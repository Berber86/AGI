// Телефон-джойстик для VR-поездки: второй телефон рулит через Firebase
// Realtime Database (только события нажатий/отпусканий), экран — хозяин игры.
// Замеры стенда (../joystick-stand): медиана 148 мс в одну сторону при пороге
// 300 мс — Firebase достаточно, WebRTC не нужен (JOYSTICK_BRAINSTORM.md).
// Если руль молчит дольше FRESH_MS, main.js мягко возвращает автопилота.
export const REMOTE_FRESH_MS = 2500;
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

export class RemoteControl {
  constructor() {
    this.kind = null;        // 'firebase' | 'demo'
    this.room = null;
    this.steerState = { l: false, r: false };
    this.connected = false;
    this.lastInputAt = 0;
    this.lastLag = null;
    this._unsubs = [];
    this._timeOffset = 0;
    this._db = null;
    this._f = null;
    this._ch = null;
    this.onCommand = null;   // (name) => void — высокоуровневые команды джойстика
    this._lastCmdSeq = 0;
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
    this.kind = 'demo';
    this._ch = new BroadcastChannel(DEMO_CHANNEL);
  }

  get _roomPath() { return `rooms/${this.room}`; }

  async createRoom() {
    if (!this.kind) throw new Error('Сначала подключите Firebase или демо-режим');
    this.room = newCode();
    if (this.kind === 'demo') {
      this._ch.onmessage = (e) => {
        const m = e.data;
        if (!m || m.room !== this.room) return;
        if (m.kind === 'input' && m.state) this._accept(m.state, null);
        if (m.kind === 'ping') this._ch.postMessage({ kind: 'pong', room: this.room, id: m.id });
        if (m.kind === 'cmd' && m.name && m.seq !== this._lastCmdSeq) {
          this._lastCmdSeq = m.seq;
          this.connected = true;
          if (this.onCommand) this.onCommand(m.name);
        }
        if (m.kind === 'input' || m.kind === 'ping') this.connected = true;
      };
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
        this._accept({ l: !!v.l, r: !!v.r }, lag);
      }),
      f.onValue(ref(`${this._roomPath}/cmd`), (s) => {
        const v = s.val();
        if (!v || !v.name || v.seq === this._lastCmdSeq) return;
        this._lastCmdSeq = v.seq;
        this.connected = true;
        if (this.onCommand) this.onCommand(v.name);
      }),
      f.onValue(ref(`${this._roomPath}/ping`), (s) => {
        const v = s.val();
        if (!v || v.id === this._lastPing) return;
        this._lastPing = v.id;
        this.connected = true;
        f.set(ref(`${this._roomPath}/pong`), { id: v.id }).catch(() => {});
      }),
    );
    return this.room;
  }

  _accept(st, lag) {
    this.steerState = { l: !!st.l, r: !!st.r };
    this.lastInputAt = performance.now();
    if (typeof lag === 'number') this.lastLag = lag;
    this.connected = true;
  }

  // Состояние игры для экрана команд джойстика (пауза/авто/взгляд/базис/звук).
  publishState(obj) {
    if (!this.room) return;
    if (this.kind === 'demo') {
      if (this._ch) this._ch.postMessage({ kind: 'state', room: this.room, state: obj });
    } else if (this.kind === 'firebase') {
      this._f.set(this._f.ref(this._db, `${this._roomPath}/state`), obj).catch(() => {});
    }
  }

  steer() {
    return (this.steerState.r ? 1 : 0) - (this.steerState.l ? 1 : 0);
  }

  fresh(now = performance.now()) {
    return !!this.room && this.connected && (now - this.lastInputAt) <= REMOTE_FRESH_MS;
  }

  info() {
    return {
      kind: this.kind, room: this.room, connected: this.connected,
      fresh: this.fresh(), steer: this.steer(),
      lastLagMs: this.lastLag === null ? null : Math.round(this.lastLag),
    };
  }

  close() {
    for (const u of this._unsubs) { try { u(); } catch { /* ignore */ } }
    this._unsubs = [];
    if (this.kind === 'firebase' && this._db && this.room) {
      try { this._f.remove(this._f.ref(this._db, this._roomPath)); } catch { /* ignore */ }
    }
    if (this._ch) { try { this._ch.close(); } catch { /* ignore */ } this._ch = null; }
    this.room = null;
    this.connected = false;
    this.steerState = { l: false, r: false };
  }
}
