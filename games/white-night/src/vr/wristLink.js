// wristLink.js — приёмник 60 Гц датчиков с телефона-браслета для «Белой ночи».
//
// Архитектура связи (проверенная на реальных смартфонах):
//   - Сигналинг по 6-значному коду комнаты через Firebase Realtime Database
//     (автоматически подхватывает уже сохранённый конфиг `ckc_stand_cfg` из стенда/гонки!).
//   - Автоматический подъём прямого локального канала WebRTC DataChannel (60 Гц,
//     ordered: false, maxRetransmits: 0, 0 обращений к БД после рукопожатия).
//   - Защита от VPN: нечётные попытки используют LAN-first (iceServers: []),
//     чётные добавляют Google STUN; фиксация preferLanOnly после первого LAN-успеха.
//   - Уникальный hid каждой попытки, устойчивость к кратковременному 'disconnected',
//     двусторонний ping/pong раз в 1 с и фоновый Auto-Heal без участия игрока.
//   - Резервный канал Firebase (~8 Гц) при недоступности UDP + локальный BroadcastChannel
//     для проверки в двух вкладках одного браузера и автотестов.
//   - Строго без виброотклика и звуков.

const FB_CDN = 'https://www.gstatic.com/firebasejs/11.0.1';
const SHARED_CFG_KEY = 'ckc_stand_cfg';
const LOCAL_CFG_KEY = 'wn_firebase_cfg';
const DEMO_CHANNEL = 'wn-wrist-demo-v1';

const GOOGLE_STUN_SERVERS = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
];

export function parseFirebaseConfig(raw) {
  if (!raw || typeof raw !== 'string') return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (/^https:\/\/[a-z0-9-]+\.(firebaseio\.com|firebasedatabase\.app)\/?$/i.test(trimmed)) {
    return { databaseURL: trimmed.replace(/\/$/, '') };
  }
  try {
    const parsed = JSON.parse(trimmed);
    if (parsed && typeof parsed === 'object' && (parsed.databaseURL || parsed.projectId)) return parsed;
  } catch { /* продолжаем разбор JS-сниппета */ }
  const out = {};
  const re = /([a-zA-Z0-9_]+)\s*:\s*(['"`])([^'"`]*)\2/g;
  let m;
  while ((m = re.exec(trimmed)) !== null) out[m[1]] = m[3];
  if (!out.databaseURL && out.projectId) {
    out.databaseURL = `https://${out.projectId}-default-rtdb.firebaseio.com`;
  }
  return out.databaseURL ? out : null;
}

export function loadSavedFirebaseRaw() {
  try {
    return localStorage.getItem(SHARED_CFG_KEY) || localStorage.getItem(LOCAL_CFG_KEY) || '';
  } catch {
    return '';
  }
}

export function saveFirebaseRaw(raw) {
  try {
    localStorage.setItem(SHARED_CFG_KEY, raw);
    localStorage.setItem(LOCAL_CFG_KEY, raw);
  } catch { /* ignore */ }
}

function makeCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function makeHid() {
  return 'h' + Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-3);
}

function isPrivateIp(addr) {
  if (!addr || typeof addr !== 'string') return false;
  const s = addr.trim().toLowerCase();
  if (s.endsWith('.local')) return true;
  if (/^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|169\.254\.|127\.)/.test(s)) return true;
  if (s.startsWith('fd') || s.startsWith('fc') || s.startsWith('fe80:')) return true;
  return false;
}

function parseCandidateMeta(candStr) {
  if (typeof candStr !== 'string') return { type: 'unknown', address: '' };
  const parts = candStr.trim().split(/\s+/);
  const address = parts[4] || '';
  const typIdx = parts.indexOf('typ');
  const type = typIdx >= 0 && parts[typIdx + 1] ? parts[typIdx + 1].toLowerCase() : 'unknown';
  return { type, address };
}

export class WristHostLink {
  constructor({ onSensor, onCalCommand, onHandSide, onStatus } = {}) {
    this.onSensor = onSensor || (() => {});
    this.onCalCommand = onCalCommand || (() => {});
    this.onHandSide = onHandSide || (() => {});
    this.onStatus = onStatus || (() => {});

    this.mode = 'off'; // 'off' | 'demo' | 'firebase'
    this.roomCode = '';
    this.connected = false;
    this.p2pOpen = false;
    this.routeKind = 'idle'; // 'idle' | 'demo' | 'firebase' | 'lan' | 'stun'
    this.rttMs = null;
    this.rxHz = 0;
    this.error = null;

    this.db = null;
    this.fbMod = null;
    this.unsubs = [];
    this.bc = null;

    this.pc = null;
    this.dcFast = null;
    this.dcCtrl = null;
    this.hid = '';
    this.attempt = 0;
    this.preferLanOnly = false;
    this.peerJoined = false;
    this.lastPongAt = 0;
    this.lastFastRxAt = 0;
    this.lastAnyRxAt = 0;
    this.lastSeq = -1;
    this.seenCalIds = new Set();
    this.rxTimes = [];
    this.pingTimer = null;
    this.watchdogTimer = null;
    this.wakeLock = null;
  }

  async acquireWakeLock() {
    try {
      if (typeof navigator !== 'undefined' && navigator.wakeLock?.request && !this.wakeLock) {
        this.wakeLock = await navigator.wakeLock.request('screen');
        this.wakeLock.addEventListener?.('release', () => { this.wakeLock = null; });
      }
    } catch { /* не фатально */ }
  }

  releaseWakeLock() {
    try {
      this.wakeLock?.release?.();
    } catch { /* ignore */ }
    this.wakeLock = null;
  }

  startDemo(roomCode = this.roomCode || makeCode()) {
    this.stop();
    this.mode = 'demo';
    this.roomCode = String(roomCode);
    this.routeKind = 'demo';
    this.error = null;
    if (typeof BroadcastChannel !== 'undefined') {
      this.bc = new BroadcastChannel(DEMO_CHANNEL);
      this.bc.onmessage = (ev) => {
        const msg = ev?.data;
        if (!msg || String(msg.room) !== this.roomCode) return;
        if (msg.k === 'hello') {
          this.connected = true;
          this.p2pOpen = true;
          if (msg.side === 'left' || msg.side === 'right') this.onHandSide(msg.side);
          this.bc?.postMessage({ k: 'ack', room: this.roomCode, ts: Date.now() });
          this._emitStatus();
        } else if (msg.k === 'wrist') {
          this.connected = true;
          this.p2pOpen = true;
          this._handlePacket(msg, true);
        } else if (msg.k === 'cal' && msg.step) {
          const cid = msg.id || `${msg.step}:${msg.ts || 0}`;
          if (!this.seenCalIds.has(cid)) {
            this.seenCalIds.add(cid);
            this.onCalCommand(msg.step);
          }
        } else if (msg.k === 'hand_side' && (msg.side === 'left' || msg.side === 'right')) {
          this.onHandSide(msg.side);
        }
      };
    }
    this._startMeters();
    this._emitStatus();
    return { ok: true, roomCode: this.roomCode, mode: 'demo' };
  }

  async startFirebase(rawConfig) {
    const cfg = parseFirebaseConfig(rawConfig);
    if (!cfg) {
      this.error = 'Вставьте корректный firebaseConfig или URL Realtime Database';
      this._emitStatus();
      return { ok: false, error: this.error };
    }
    saveFirebaseRaw(rawConfig);
    this.stop();
    this.mode = 'firebase';
    this.roomCode = makeCode();
    this.error = null;

    try {
      const [{ initializeApp, getApps }, dbMod] = await Promise.all([
        import(`${FB_CDN}/firebase-app.js`),
        import(`${FB_CDN}/firebase-database.js`),
      ]);
      const existing = getApps().find((a) => a.name === 'wn-wrist-host');
      const app = existing || initializeApp(cfg, 'wn-wrist-host');
      this.db = dbMod.getDatabase(app, cfg.databaseURL);
      this.fbMod = dbMod;

      const { ref, set, onValue, onChildAdded, onDisconnect } = dbMod;
      const roomPath = `wn_wrist_rooms/${this.roomCode}`;
      await set(ref(this.db, roomPath), {
        createdAt: Date.now(),
        hostAlive: true,
      });
      try {
        onDisconnect(ref(this.db, `${roomPath}/hostAlive`)).remove();
      } catch { /* ignore */ }

      // Подписка на присутствие браслета
      this.unsubs.push(
        onValue(ref(this.db, `${roomPath}/wristJoined`), (snap) => {
          const val = snap.val();
          if (!val) return;
          this.peerJoined = true;
          this.connected = true;
          if (!this.isFastHealthy()) {
            this._startRtcOffer(false);
          }
          this._emitStatus();
        })
      );

      // Подписка на резервный поток датчиков через Firebase (работает пока P2P ещё поднимается)
      this.unsubs.push(
        onValue(ref(this.db, `${roomPath}/fbInput`), (snap) => {
          const pkt = snap.val();
          if (!pkt) return;
          this.connected = true;
          if (!this.isFastHealthy()) {
            this.routeKind = 'firebase';
            this._handlePacket(pkt, false);
          }
        })
      );

      // Команды калибровки с экрана браслета (без зависимости от сверки часов двух телефонов!)
      let initialCalSnap = true;
      this.unsubs.push(
        onValue(ref(this.db, `${roomPath}/calCmd`), (snap) => {
          const cmd = snap.val();
          if (initialCalSnap) {
            initialCalSnap = false;
            if (cmd?.id) this.seenCalIds.add(cmd.id);
            return;
          }
          if (!cmd || !cmd.step) return;
          const cid = cmd.id || `${cmd.step}:${cmd.ts || 0}`;
          if (this.seenCalIds.has(cid)) return;
          this.seenCalIds.add(cid);
          this.onCalCommand(cmd.step);
        })
      );

      // Выбор руки (левая / правая) с экрана браслета
      this.unsubs.push(
        onValue(ref(this.db, `${roomPath}/handSide`), (snap) => {
          const hs = snap.val();
          if (hs && (hs.side === 'left' || hs.side === 'right')) {
            this.onHandSide(hs.side);
          }
        })
      );

      // Сигналинг WebRTC от браслета: hello / answer / кандидаты
      this.unsubs.push(
        onValue(ref(this.db, `${roomPath}/rtc/hello`), (snap) => {
          const hello = snap.val();
          if (!hello || !hello.ts) return;
          this.peerJoined = true;
          this.connected = true;
          if (!this.isFastHealthy()) {
            this._startRtcOffer(false);
          }
        })
      );

      this.unsubs.push(
        onValue(ref(this.db, `${roomPath}/rtc/answer`), async (snap) => {
          const ans = snap.val();
          if (!ans || ans.hid !== this.hid || !this.pc) return;
          if (this.pc.signalingState !== 'have-local-offer') return;
          try {
            await this.pc.setRemoteDescription({ type: 'answer', sdp: ans.sdp });
          } catch { /* ignore */ }
        })
      );

      this.unsubs.push(
        onChildAdded(ref(this.db, `${roomPath}/rtc/wristCandidates`), async (snap) => {
          const item = snap.val();
          if (!item || item.hid !== this.hid || !this.pc) return;
          try {
            await this.pc.addIceCandidate(item.candidate);
          } catch { /* ignore */ }
        })
      );

      await this.acquireWakeLock();
      this._startMeters();
      this._emitStatus();
      return { ok: true, roomCode: this.roomCode, mode: 'firebase' };
    } catch (e) {
      this.error = e?.message || 'Ошибка подключения к Firebase';
      this._emitStatus();
      return { ok: false, error: this.error };
    }
  }

  isFastHealthy(now = performance.now()) {
    if (this.mode === 'demo') return this.p2pOpen;
    if (!this.dcFast || this.dcFast.readyState !== 'open') return false;
    const pongAge = this.lastPongAt ? now - this.lastPongAt : 0;
    const rxAge = this.lastFastRxAt ? now - this.lastFastRxAt : 0;
    const freshest = Math.min(pongAge || 0, rxAge || 0);
    return freshest < 8500;
  }

  async _startRtcOffer(forceStun = false) {
    if (typeof RTCPeerConnection === 'undefined' || !this.db || !this.fbMod) return;
    this._closePcOnly();
    this.attempt += 1;
    this.hid = makeHid();
    const currentHid = this.hid;

    const useLanOnly = this.preferLanOnly || (!forceStun && this.attempt % 2 === 1);
    const iceServers = useLanOnly ? [] : GOOGLE_STUN_SERVERS;
    const { ref, set, push, remove } = this.fbMod;
    const rtcBase = `wn_wrist_rooms/${this.roomCode}/rtc`;

    try {
      await Promise.all([
        remove(ref(this.db, `${rtcBase}/answer`)),
        remove(ref(this.db, `${rtcBase}/hostCandidates`)),
        remove(ref(this.db, `${rtcBase}/wristCandidates`)),
      ]);
    } catch { /* ignore */ }

    const pc = new RTCPeerConnection({ iceServers });
    this.pc = pc;

    const fast = pc.createDataChannel('wrist-fast', { ordered: false, maxRetransmits: 0 });
    const ctrl = pc.createDataChannel('wrist-ctrl', { ordered: true });
    this.dcFast = fast;
    this.dcCtrl = ctrl;

    const onOpen = () => {
      if (this.hid !== currentHid) return;
      this.p2pOpen = true;
      this.connected = true;
      this.lastPongAt = performance.now();
      this._inspectRoute(useLanOnly);
      this._emitStatus();
    };

    fast.onopen = onOpen;
    ctrl.onopen = onOpen;

    fast.onmessage = (ev) => this._onChannelMessage(ev.data, true);
    ctrl.onmessage = (ev) => this._onChannelMessage(ev.data, false);

    pc.onicecandidate = (ev) => {
      if (!ev.candidate || this.hid !== currentHid) return;
      push(ref(this.db, `${rtcBase}/hostCandidates`), {
        hid: currentHid,
        candidate: ev.candidate.toJSON ? ev.candidate.toJSON() : ev.candidate,
      }).catch(() => {});
    };

    pc.onconnectionstatechange = () => {
      if (this.hid !== currentHid) return;
      const st = pc.connectionState;
      if (st === 'connected') {
        this.p2pOpen = true;
        this._inspectRoute(useLanOnly);
        this._emitStatus();
      } else if (st === 'failed' || st === 'closed') {
        // При 'disconnected' канал НЕ рвём — даём радиомодулю Wi-Fi 8.5 с восстановиться!
        this.p2pOpen = false;
        this.routeKind = this.connected ? 'firebase' : 'idle';
        this._emitStatus();
      }
    };

    try {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      await set(ref(this.db, `${rtcBase}/offer`), {
        hid: currentHid,
        sdp: offer.sdp,
        iceMode: useLanOnly ? 'lan' : 'stun',
        ts: Date.now(),
      });
    } catch { /* watchdog повторит */ }
  }

  async _inspectRoute(wasLanAttempt) {
    if (!this.pc?.getStats) {
      this.routeKind = wasLanAttempt ? 'lan' : 'stun';
      return;
    }
    try {
      const stats = await this.pc.getStats();
      let selectedPair = null;
      const candidates = new Map();
      stats.forEach((r) => {
        if (r.type === 'local-candidate' || r.type === 'remote-candidate') candidates.set(r.id, r);
        if (r.type === 'candidate-pair' && (r.nominated || r.state === 'succeeded')) selectedPair = r;
      });
      if (selectedPair) {
        const loc = candidates.get(selectedPair.localCandidateId);
        const rem = candidates.get(selectedPair.remoteCandidateId);
        const locType = loc?.candidateType || '';
        const remType = rem?.candidateType || '';
        const nativeRtt = Number.isFinite(selectedPair.currentRoundTripTime)
          ? selectedPair.currentRoundTripTime * 1000
          : null;
        const bothDirect =
          (locType === 'host' || locType === 'prflx') &&
          (remType === 'host' || remType === 'prflx');
        const lan =
          wasLanAttempt ||
          (bothDirect && (isPrivateIp(loc?.address) || isPrivateIp(rem?.address) || (nativeRtt !== null && nativeRtt < 22)));
        this.routeKind = lan ? 'lan' : 'stun';
        if (lan) this.preferLanOnly = true;
        return;
      }
    } catch { /* ignore */ }
    this.routeKind = wasLanAttempt ? 'lan' : 'stun';
  }

  _onChannelMessage(raw, isFast) {
    let msg;
    try {
      msg = typeof raw === 'string' ? JSON.parse(raw) : null;
    } catch {
      return;
    }
    if (!msg) return;
    const now = performance.now();
    if (msg.k === 'ping') {
      this._sendCtrl({ k: 'pong', t: msg.t });
      return;
    }
    if (msg.k === 'pong') {
      this.lastPongAt = now;
      if (Number.isFinite(msg.t)) {
        const rtt = Math.max(1, Math.round(now - msg.t));
        this.rttMs = this.rttMs === null ? rtt : Math.round(this.rttMs * 0.65 + rtt * 0.35);
      }
      this._emitStatus();
      return;
    }
    if (msg.k === 'cal' && msg.step) {
      const cid = msg.id || `${msg.step}:${msg.ts || 0}`;
      if (!this.seenCalIds.has(cid)) {
        this.seenCalIds.add(cid);
        this.onCalCommand(msg.step);
      }
      return;
    }
    if (msg.k === 'hand_side' && (msg.side === 'left' || msg.side === 'right')) {
      this.onHandSide(msg.side);
      return;
    }
    if (msg.k === 'wrist') {
      this.lastFastRxAt = now;
      this.p2pOpen = true;
      this._handlePacket(msg, isFast);
    }
  }

  _sendCtrl(obj) {
    const ch = this.dcCtrl?.readyState === 'open' ? this.dcCtrl : this.dcFast;
    if (ch?.readyState === 'open') {
      try {
        ch.send(JSON.stringify(obj));
      } catch { /* ignore */ }
    }
  }

  sendHandSide(side) {
    const clean = side === 'left' ? 'left' : 'right';
    const payload = { k: 'hand_side', room: this.roomCode, side: clean, ts: Date.now() };
    if (this.mode === 'demo' && this.bc) {
      this.bc.postMessage(payload);
    }
    this._sendCtrl(payload);
    if (this.mode === 'firebase' && this.db && this.fbMod && this.roomCode) {
      const { ref, set } = this.fbMod;
      set(ref(this.db, `wn_wrist_rooms/${this.roomCode}/hostHandSide`), payload).catch(() => {});
    }
  }

  _handlePacket(pkt, fromFast) {
    const now = performance.now();
    if (fromFast && Number.isFinite(pkt.seq)) {
      if (pkt.seq <= this.lastSeq && this.lastSeq - pkt.seq < 3000) return;
      this.lastSeq = pkt.seq;
    }
    this.lastAnyRxAt = now;
    this.rxTimes.push(now);
    while (this.rxTimes.length && now - this.rxTimes[0] > 1000) this.rxTimes.shift();
    this.rxHz = this.rxTimes.length;
    this.onSensor({
      q: pkt.q,
      linMag: pkt.linMag ?? 0,
      rotRate: pkt.rotRate ?? 0,
      acc: pkt.acc || [0, 0, 0],
      ts: now,
    });
  }

  /**
   * Синтетический инжектор пакетов для детерминированных тестов без сети.
   */
  injectPacket(pkt, now = performance.now()) {
    this.connected = true;
    this.p2pOpen = true;
    this.routeKind = 'demo';
    this.lastAnyRxAt = now;
    this.rxHz = 60;
    this.onSensor({
      q: pkt.q,
      linMag: pkt.linMag ?? 0,
      rotRate: pkt.rotRate ?? 0,
      acc: pkt.acc || [0, 0, 0],
      ts: now,
    });
  }

  _startMeters() {
    clearInterval(this.pingTimer);
    clearInterval(this.watchdogTimer);

    this.pingTimer = setInterval(() => {
      const now = performance.now();
      while (this.rxTimes.length && now - this.rxTimes[0] > 1000) this.rxTimes.shift();
      this.rxHz = this.rxTimes.length;
      if (this.dcFast?.readyState === 'open' || this.dcCtrl?.readyState === 'open') {
        this._sendCtrl({ k: 'ping', t: Math.round(now) });
      }
      this._emitStatus();
    }, 1000);

    this.watchdogTimer = setInterval(() => {
      if (this.mode !== 'firebase' || !this.peerJoined) return;
      if (!this.isFastHealthy()) {
        this.p2pOpen = false;
        this._startRtcOffer(false);
      }
    }, 4200);
  }

  _closePcOnly() {
    try { this.dcFast?.close(); } catch { /* ignore */ }
    try { this.dcCtrl?.close(); } catch { /* ignore */ }
    try { this.pc?.close(); } catch { /* ignore */ }
    this.dcFast = null;
    this.dcCtrl = null;
    this.pc = null;
    this.p2pOpen = false;
  }

  stop() {
    clearInterval(this.pingTimer);
    clearInterval(this.watchdogTimer);
    this.pingTimer = null;
    this.watchdogTimer = null;
    for (const u of this.unsubs) {
      try { u(); } catch { /* ignore */ }
    }
    this.unsubs = [];
    this._closePcOnly();
    if (this.bc) {
      try { this.bc.close(); } catch { /* ignore */ }
      this.bc = null;
    }
    this.releaseWakeLock();
    this.mode = 'off';
    this.connected = false;
    this.peerJoined = false;
    this.routeKind = 'idle';
    this.rxHz = 0;
    this.rttMs = null;
    this._emitStatus();
  }

  status() {
    return {
      mode: this.mode,
      roomCode: this.roomCode,
      connected: this.connected,
      p2pOpen: this.isFastHealthy(),
      routeKind: this.routeKind,
      rttMs: this.rttMs,
      rxHz: this.rxHz,
      error: this.error,
      fresh: !!this.lastAnyRxAt && performance.now() - this.lastAnyRxAt < 1200,
    };
  }

  _emitStatus() {
    this.onStatus(this.status());
  }
}

export { parseCandidateMeta };
