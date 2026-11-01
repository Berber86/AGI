// Телефон-джойстик для VR-поездки: второй телефон передаёт аналоговые
// значения руля, газа и тормоза на экран в очках.
//
// Режимы сопряжения без обязательного ввода API Firebase:
//   1) `local` (по умолчанию) — общая «Моя пара» (`agi_pair_v1`):
//      телефоны узнают друг друга по сохранённому 6-значному ключу (через встроенную
//      бесплатную WSS-сваху + BroadcastChannel) и открывают прямой локальный канал
//      WebRTC DataChannel (60 Гц, ~2–6 мс, `iceServers: []`) по точке доступа Wi-Fi.
//   2) `offline` (100% без интернета, авиарежим + точка доступа Wi-Fi) —
//      взаимный обмен компактными QR-кодами `AG1.<base64url>` камера ↔ экран.
//   3) `firebase` / `demo` — свёрнутый резервный режим для совместимости.
// Если джойстик молчит дольше REMOTE_FRESH_MS (6 секунд), main.js мягко возвращает автопилота.

import {
  RtcHostPeer,
  createFirebaseRtcSignaling,
  createBroadcastRtcSignaling,
} from './tilt-rtc.js';
import {
  ensureHostPairCode,
  normalizePairCode,
  savePairCode,
  createAutoPairSignaling,
  createOfflineHostOffer,
  buildControllerQrUrl,
} from './local-pair.js';

export const REMOTE_FRESH_MS = 6000;
const DEMO_CHANNEL = 'ckc-joystick-stand';

// Конфиг из консоли Firebase — JS-объект, а не строгий JSON. Тот же
// посимвольный разбор, что в стенде: https:// в databaseURL не комментарий.
export function parseFirebaseConfig(text) {
  const a = text.indexOf('{'), b = text.lastIndexOf('}');
  if (a < 0 || b <= a) throw new Error('Не нашёл объект конфига в тексте');
  const src = text.slice(a, b + 1);
  let out = '', inStr = false, quote = '', esc = false;
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (inStr) {
      if (esc) { out += c; esc = false; continue; }
      if (c === '\\') { out += c; esc = true; continue; }
      if (c === quote) { inStr = false; out += '"'; continue; }
      if (c < ' ') continue;
      out += c; continue;
    }
    if (c === '/' && src[i + 1] === '/') { while (i < src.length && src[i] !== '\n') i++; continue; }
    if (c === '"' || c === "'") { inStr = true; quote = c; out += '"'; continue; }
    if (/[A-Za-z_$]/.test(c)) {
      let j = i;
      while (j < src.length && /[\w$]/.test(src[j])) j++;
      const word = src.slice(i, j);
      let k = j;
      while (k < src.length && /\s/.test(src[k])) k++;
      out += src[k] === ':' ? `"${word}"` : word;
      i = j - 1; continue;
    }
    out += c;
  }
  out = out.replace(/,\s*([}\]])/g, '$1');
  return JSON.parse(out);
}

const newCode = () => String(Math.floor(100000 + Math.random() * 900000));
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, Number.isFinite(+v) ? +v : 0));

export class RemoteControl {
  constructor() {
    this.kind = null;        // 'local' | 'offline' | 'firebase' | 'demo'
    this.room = null;
    // Continuous controls from the second phone:
    // steer ∈ [-1..1], throttle ∈ [0..1], brake ∈ [0..1].
    this.driveState = { steer: 0, throttle: 0, brake: 0 };
    this.connected = false;
    this.lastInputAt = 0;
    this.lastLag = null;
    this.rtcPackets = 0;
    this.cloudPackets = 0;
    this._rtc = null;
    this._rtcOpen = false;
    this._autoSig = null;
    this._offlineSession = null;
    this._pairCode = '';
    this._brokersOnline = 0;
    this._lastStatePayload = null;
    this._unsubs = [];
    this._timeOffset = 0;
    this._db = null;
    this._f = null;
    this._ch = null;
    this.onCommand = null;   // (name) => void — высокоуровневые команды джойстика
    this.onStatus = null;    // (info) => void — опциональное уведомление UI подготовки
    this._lastCmdSeq = 0;
    this._lastInputSeq = 0;
    this._inputSession = null;
    this._lastPing = null;
  }

  useLocalPair(pairCode = '') {
    const clean = normalizePairCode(pairCode) || ensureHostPairCode();
    savePairCode(clean);
    this._pairCode = clean;
    this.kind = 'local';
    return clean;
  }

  async connectFirebase(config) {
    if (!config || !config.databaseURL) throw new Error('В конфиге нет databaseURL — включите Realtime Database');
    const appMod = await import('https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js');
    const dbMod = await import('https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js');
    const app = appMod.initializeApp(config, 'ckc-remote-' + Date.now());
    this._db = dbMod.getDatabase(app);
    this._f = dbMod;
    this.kind = 'firebase';
  }

  useDemo() {
    if (this._ch) { try { this._ch.close(); } catch { /* ignore */ } }
    this.kind = 'demo';
    this._ch = new BroadcastChannel(DEMO_CHANNEL);
  }

  get _roomPath() { return `rooms/${this.room}`; }

  _closeOfflineSession() {
    if (!this._offlineSession) return;
    const s = this._offlineSession;
    this._offlineSession = null;
    try { s.fast?.close(); } catch { /* ignore */ }
    try { s.ctrl?.close(); } catch { /* ignore */ }
    try { s.pc?.close(); } catch { /* ignore */ }
  }

  _clearRoomOnly() {
    this._closeOfflineSession();
    if (this._rtc) {
      this._rtc.close();
      this._rtc = null;
    }
    if (this._autoSig) {
      this._autoSig.dispose();
      this._autoSig = null;
    }
    this._rtcOpen = false;
    this._brokersOnline = 0;
    for (const u of this._unsubs) { try { u(); } catch { /* ignore */ } }
    this._unsubs = [];
  }

  _makeRtcCallbacks() {
    return {
      onOpenChange: (open) => {
        this._rtcOpen = open;
        if (open) {
          this.connected = true;
          if (!this.lastInputAt) this.lastInputAt = performance.now();
        }
        if (this.onStatus) this.onStatus(this.info());
      },
      onCtrlOpen: () => {
        if (this._lastStatePayload) {
          this._sendRtcState(this._lastStatePayload);
        }
      },
      onRtt: (rtt) => {
        this.lastLag = Math.max(1, rtt / 2);
        if (this.onStatus) this.onStatus(this.info());
      },
      onInput: (state, lag) => {
        this._accept(state, lag, 'webrtc');
      },
      onAlive: () => {
        if (this.connected) this.lastInputAt = performance.now();
      },
      onCmd: (name, seq) => {
        this._acceptCmd(name, seq);
      },
    };
  }

  _sendRtcState(payload) {
    if (this._offlineSession?.ctrl?.readyState === 'open') {
      try {
        this._offlineSession.ctrl.send(JSON.stringify({ k: 'state', state: payload }));
        return true;
      } catch { /* ignore */ }
    }
    if (this._rtc) {
      return this._rtc.sendState(payload);
    }
    return false;
  }

  async createRoom(forcedCode = '') {
    if (!this.kind) this.useLocalPair(forcedCode);
    this._clearRoomOnly();
    this.room = this.kind === 'local'
      ? (normalizePairCode(forcedCode) || this._pairCode || ensureHostPairCode())
      : (normalizePairCode(forcedCode) || newCode());
    if (this.kind === 'local') {
      this._pairCode = this.room;
      savePairCode(this.room);
    }
    this.connected = false;
    this.driveState = { steer: 0, throttle: 0, brake: 0 };
    this.lastInputAt = 0;
    this.lastLag = null;
    this.rtcPackets = 0;
    this.cloudPackets = 0;
    this._lastCmdSeq = 0;
    this._lastInputSeq = 0;
    this._inputSession = null;
    this._lastPing = null;

    const rtcCallbacks = this._makeRtcCallbacks();

    if (this.kind === 'local') {
      this._autoSig = createAutoPairSignaling(this.room, {
        game: 'ckc',
        role: 'host',
        onBrokerChange: (count) => {
          this._brokersOnline = count;
          if (this.onStatus) this.onStatus(this.info());
        },
        onFallbackMessage: (m) => {
          if (!m || typeof m !== 'object') return;
          if (m.kind === 'input' && m.state) {
            const lag = typeof m.state.sts === 'number' ? Math.max(0, Date.now() - m.state.sts) : null;
            this._accept(m.state, lag, 'local-bus');
          } else if (m.kind === 'ping') {
            this.connected = true;
            this._autoSig?.sendFallback({ kind: 'pong', id: m.id });
            if (this._lastStatePayload) {
              this._autoSig?.sendFallback({ kind: 'state', state: this._lastStatePayload });
            }
            if (this.onStatus) this.onStatus(this.info());
          } else if (m.kind === 'cmd' && m.name) {
            this._acceptCmd(m.name, m.seq);
          } else if (m.kind === 'hello-meta') {
            if (this._lastStatePayload) {
              this._autoSig?.sendFallback({ kind: 'state', state: this._lastStatePayload });
            }
          }
        },
      });
      this._rtc = new RtcHostPeer(this._autoSig, rtcCallbacks);
      this._rtc.start();
      if (this.onStatus) this.onStatus(this.info());
      return this.room;
    }

    if (this.kind === 'demo') {
      const handler = (e) => {
        const m = e.data;
        if (!m || m.room !== this.room) return;
        if (m.kind === 'input' && m.state) this._accept(m.state, null, 'demo');
        if (m.kind === 'ping') {
          this.connected = true;
          this._ch.postMessage({ kind: 'pong', room: this.room, id: m.id });
        }
        if (m.kind === 'cmd' && m.name) this._acceptCmd(m.name, m.seq);
      };
      this._ch.addEventListener('message', handler);
      this._unsubs.push(() => this._ch && this._ch.removeEventListener('message', handler));

      this._rtc = new RtcHostPeer(createBroadcastRtcSignaling(this._ch, this.room), rtcCallbacks);
      this._rtc.start();
      return this.room;
    }

    const f = this._f, db = this._db;
    const ref = (p) => f.ref(db, p);
    await f.set(ref(`${this._roomPath}/meta`), { game: 'ckc-vr', created: f.serverTimestamp() });
    f.onDisconnect(ref(this._roomPath)).remove();
    this._unsubs.push(
      f.onValue(ref('.info/serverTimeOffset'), (s) => { this._timeOffset = s.val() || 0; }),
      f.onValue(ref(`${this._roomPath}/input`), (s) => {
        const v = s.val();
        if (!v) return;
        const lag = typeof v.sts === 'number' ? Math.max(0, Date.now() + this._timeOffset - v.sts) : null;
        this._accept(v, lag, 'firebase');
      }),
      f.onValue(ref(`${this._roomPath}/cmd`), (s) => {
        const v = s.val();
        if (!v || !v.name) return;
        this._acceptCmd(v.name, v.seq);
      }),
      f.onValue(ref(`${this._roomPath}/ping`), (s) => {
        const v = s.val();
        if (!v || v.id === this._lastPing) return;
        this._lastPing = v.id;
        this.connected = true;
        f.set(ref(`${this._roomPath}/pong`), { id: v.id }).catch(() => {});
      }),
    );

    this._rtc = new RtcHostPeer(createFirebaseRtcSignaling(f, db, this.room), rtcCallbacks);
    this._rtc.start();
    return this.room;
  }

  /**
   * 100% локальное офлайн-приглашение WebRTC для взаимного обмена QR-кодами (без интернета).
   * Работает поверх текущей комнаты, не ломая фоновую авто-пару.
   */
  async createOfflineOffer(controllerUrl = './joystick/index.html') {
    if (!this.room) {
      this.useLocalPair();
      await this.createRoom();
    }
    this._closeOfflineSession();
    const offerSession = await createOfflineHostOffer({
      fastLabel: 'fast',
      ctrlLabel: 'ctrl',
      game: 'ckc',
      pairCode: this.room,
    });
    this._offlineSession = offerSession;
    const cb = this._makeRtcCallbacks();
    const { pc, fast, ctrl } = offerSession;

    const sendFast = (obj) => {
      if (fast.readyState !== 'open') return false;
      try { fast.send(JSON.stringify(obj)); return true; } catch { return false; }
    };

    const bindCh = (ch, label) => {
      ch.onopen = () => {
        if (this._offlineSession !== offerSession) return;
        if (label === 'fast') cb.onOpenChange(true);
        if (label === 'ctrl') cb.onCtrlOpen();
      };
      ch.onclose = () => {
        if (this._offlineSession !== offerSession) return;
        if (label === 'fast') cb.onOpenChange(false);
      };
      ch.onmessage = (ev) => {
        if (this._offlineSession !== offerSession) return;
        let msg;
        try { msg = JSON.parse(ev.data); } catch { return; }
        if (!msg || typeof msg !== 'object') return;
        if (msg.k === 'in' && msg.state) {
          const lag = this.lastLag !== null ? Math.max(1, Math.round(this.lastLag)) : 2;
          cb.onInput(msg.state, lag);
        } else if (msg.k === 'ping') {
          sendFast({ k: 'pong', id: msg.id, t0: msg.t0 });
          cb.onAlive();
        } else if (msg.k === 'pong-ack' && Number.isFinite(msg.rtt)) {
          cb.onRtt(Math.max(1, Math.round(msg.rtt)));
        } else if (msg.k === 'cmd' && msg.name) {
          cb.onCmd(msg.name, msg.seq);
        }
      };
    };
    bindCh(fast, 'fast');
    bindCh(ctrl, 'ctrl');

    pc.onconnectionstatechange = () => {
      if (this._offlineSession !== offerSession) return;
      const st = pc.connectionState;
      if (st === 'failed' || st === 'closed') {
        cb.onOpenChange(false);
      } else if (st === 'connected' && fast.readyState === 'open') {
        cb.onOpenChange(true);
      }
    };

    const qrUrl = buildControllerQrUrl({
      controllerUrl,
      pairCode: this.room,
      offlineToken: offerSession.token,
    });
    return {
      room: this.room,
      token: offerSession.token,
      qrUrl,
      candidatesCount: offerSession.candidatesCount,
    };
  }

  async applyOfflineAnswer(answerToken) {
    if (!this._offlineSession) {
      throw new Error('Сначала откройте шаг 1 (Офлайн QR экрана)');
    }
    return this._offlineSession.applyAnswer(answerToken);
  }

  _acceptCmd(name, seq) {
    if (!name || seq === this._lastCmdSeq) return;
    if (Number.isFinite(seq)) this._lastCmdSeq = seq;
    this.connected = true;
    this.lastInputAt = performance.now();
    if (this.onCommand) this.onCommand(name);
    if (this.onStatus) this.onStatus(this.info());
  }

  _accept(st, lag, source = 'cloud') {
    // Firebase/bus can deliver a queued snapshot after a newer one (or after a faster
    // WebRTC packet). Ignore stale packets by monotonic (sid, seq).
    const sid = typeof st?.sid === 'string' ? st.sid : null;
    if (sid && sid !== this._inputSession) {
      this._inputSession = sid;
      this._lastInputSeq = 0;
    }
    if (!sid && this._inputSession) return;
    if (sid && Number.isFinite(Number(st?.seq))) {
      const seq = Number(st.seq);
      if (seq <= this._lastInputSeq) return;
      this._lastInputSeq = seq;
    }
    const oldSteer = (st && st.r ? 1 : 0) - (st && st.l ? 1 : 0);
    this.driveState = {
      steer: clamp(Number.isFinite(+st?.steer) ? +st.steer : oldSteer, -1, 1),
      throttle: clamp(Number.isFinite(+st?.throttle) ? +st.throttle : 0, 0, 1),
      brake: clamp(Number.isFinite(+st?.brake) ? +st.brake : 0, 0, 1),
    };
    const wasConnected = this.connected;
    this.lastInputAt = performance.now();
    if (typeof lag === 'number') this.lastLag = lag;
    if (source === 'webrtc') this.rtcPackets += 1;
    else this.cloudPackets += 1;
    this.connected = true;
    if (!wasConnected && this.onStatus) this.onStatus(this.info());
  }

  // Состояние игры для экрана команд джойстика (пауза/авто/взгляд/базис/звук).
  publishState(obj) {
    if (!this.room) return;
    const payload = { ...obj, rtcOpen: this._rtcOpen };
    this._lastStatePayload = payload;
    this._sendRtcState(payload);
    if (this.kind === 'local') {
      if (this._autoSig) this._autoSig.sendFallback({ kind: 'state', state: payload });
    } else if (this.kind === 'demo') {
      if (this._ch) this._ch.postMessage({ kind: 'state', room: this.room, state: payload });
    } else if (this.kind === 'firebase') {
      this._f.set(this._f.ref(this._db, `${this._roomPath}/state`), payload).catch(() => {});
    }
  }

  // Частое обновление спидометра только через открытый P2P WebRTC (0 записей в сеть).
  publishFastHud(obj) {
    if (!this._rtcOpen) return;
    const merged = { ...(this._lastStatePayload || {}), ...obj, rtcOpen: true };
    this._lastStatePayload = merged;
    this._sendRtcState(merged);
  }

  steer() {
    return this.driveState.steer;
  }

  throttle() {
    return this.driveState.throttle;
  }

  brake() {
    return this.driveState.brake;
  }

  fresh(now = performance.now()) {
    return !!this.room && this.connected && (now - this.lastInputAt) <= REMOTE_FRESH_MS;
  }

  info() {
    return {
      kind: this.kind,
      transport: this._rtcOpen ? 'webrtc' : this.kind,
      rtcOpen: this._rtcOpen,
      brokersOnline: this._brokersOnline,
      offlineReady: Boolean(this._offlineSession),
      room: this.room,
      connected: this.connected,
      fresh: this.fresh(),
      steer: +this.steer().toFixed(3),
      throttle: +this.throttle().toFixed(3),
      brake: +this.brake().toFixed(3),
      rtcPackets: this.rtcPackets,
      cloudPackets: this.cloudPackets,
      ageMs: this.connected ? Math.round(performance.now() - this.lastInputAt) : null,
      lastLagMs: this.lastLag === null ? null : Math.round(this.lastLag),
    };
  }

  close() {
    this._clearRoomOnly();
    if (this.kind === 'firebase' && this._db && this.room) {
      try { this._f.remove(this._f.ref(this._db, this._roomPath)); } catch { /* ignore */ }
    }
    if (this._ch) { try { this._ch.close(); } catch { /* ignore */ } this._ch = null; }
    this.room = null;
    this.connected = false;
    this.driveState = { steer: 0, throttle: 0, brake: 0 };
    this._lastInputSeq = 0;
    this._inputSession = null;
  }
}
