// Слой «почтового ящика» (Signaling + параллельный облачный канал Firebase).
// Имеет две взаимозаменяемые реализации:
//   1) FirebaseBackend — настоящая база Firebase Realtime Database для двух телефонов;
//   2) DemoBackend     — BroadcastChannel для проверки в двух вкладках без Firebase
//                        (при этом сам WebRTC между вкладками поднимается НАСТОЯЩИЙ!).

const DEMO_CHANNEL_NAME = 'agi-webrtc-stand-v1';

const payloadBytes = (obj) => new Blob([JSON.stringify(obj ?? '')]).size;

export class SignalingMetrics {
  constructor() {
    this.signalWrites = 0;   // Записи в БД только ради знакомства WebRTC (останавливаются после коннекта!)
    this.streamWrites = 0;   // Записи облачного канала (руль, пинг, фолбэк)
    this.reads = 0;
    this.sentBytes = 0;
    this.recvBytes = 0;
  }

  recordOut(kind, payload) {
    const b = payloadBytes(payload);
    this.sentBytes += b;
    if (kind === 'signal') this.signalWrites++;
    else this.streamWrites++;
  }

  recordIn(payload) {
    this.reads++;
    this.recvBytes += payloadBytes(payload);
  }
}

export class DemoBackend {
  constructor({ cloudOneWayMs = 140 } = {}) {
    this.kind = 'demo';
    this.cloudOneWayMs = cloudOneWayMs;
    this.room = null;
    this.role = null;
    this.timeOffset = 0;
    this.metrics = new SignalingMetrics();
    this.handlers = {};
    this.lastAnnouncedRoom = null;
    this._timers = new Set();
    this._ch = new BroadcastChannel(DEMO_CHANNEL_NAME);
    this._ch.onmessage = (ev) => this._onMessage(ev.data);
  }

  setCloudDelayMs(ms) {
    this.cloudOneWayMs = Math.max(0, Number(ms) || 0);
  }

  _delay(ms, fn) {
    if (ms <= 0) {
      queueMicrotask(fn);
      return;
    }
    const id = setTimeout(() => {
      this._timers.delete(id);
      fn();
    }, ms);
    this._timers.add(id);
  }

  _emitSignaling(type, data) {
    this.metrics.recordOut('signal', data);
    this._ch.postMessage({ scope: 'signal', room: this.room, type, data });
  }

  _emitCloud(type, data) {
    this.metrics.recordOut('stream', data);
    this._ch.postMessage({
      scope: 'cloud',
      room: this.room,
      type,
      delayMs: this.cloudOneWayMs,
      data,
    });
  }

  _onMessage(msg) {
    if (!msg) return;
    if (msg.scope === 'discover' && msg.type === 'who-has-room' && this.role === 'host' && this.room) {
      this._ch.postMessage({ scope: 'discover', type: 'room-here', room: this.room });
      return;
    }
    if (msg.scope === 'discover' && msg.type === 'room-here' && msg.room) {
      this.lastAnnouncedRoom = msg.room;
      if (this.handlers.roomDiscovered) this.handlers.roomDiscovered(msg.room);
      return;
    }
    if (!this.room || msg.room !== this.room) return;

    if (msg.scope === 'signal') {
      this.metrics.recordIn(msg.data);
      this._dispatchSignal(msg.type, msg.data);
      return;
    }

    if (msg.scope === 'cloud') {
      const wait = typeof msg.delayMs === 'number' ? msg.delayMs : this.cloudOneWayMs;
      this._delay(wait, () => {
        this.metrics.recordIn(msg.data);
        this._dispatchCloud(msg.type, msg.data);
      });
    }
  }

  _dispatchSignal(type, data) {
    if (type === 'hello' && this.role === 'host' && this.handlers.hello) this.handlers.hello(data);
    if (type === 'offer' && this.role === 'joy' && this.handlers.offer) this.handlers.offer(data);
    if (type === 'answer' && this.role === 'host' && this.handlers.answer) this.handlers.answer(data);
    if (type === 'host-cand' && this.role === 'joy' && this.handlers.remoteCandidate) {
      this.handlers.remoteCandidate(data);
    }
    if (type === 'joy-cand' && this.role === 'host' && this.handlers.remoteCandidate) {
      this.handlers.remoteCandidate(data);
    }
  }

  _dispatchCloud(type, data) {
    if (type === 'fb_input' && this.role === 'host' && this.handlers.cloudInput) {
      const lag = typeof data.sts === 'number' ? Math.max(0, Date.now() - data.sts) : null;
      this.handlers.cloudInput(data, lag);
    }
    if (type === 'fb_ping' && this.role === 'host' && this.handlers.cloudPing) {
      this.handlers.cloudPing(data);
    }
    if (type === 'fb_pong' && this.role === 'joy' && this.handlers.cloudPong) {
      this.handlers.cloudPong(data);
    }
    if (type === 'fb_ctrl' && this.handlers.cloudCtrl && data.to === this.role) {
      this.handlers.cloudCtrl(data);
    }
  }

  discoverActiveRoom() {
    this._ch.postMessage({ scope: 'discover', type: 'who-has-room' });
  }

  async createRoom(code) {
    this.role = 'host';
    this.room = code;
    this.metrics.recordOut('signal', { room: code, proto: 1 });
    this._ch.postMessage({ scope: 'discover', type: 'room-here', room: code });
  }

  async joinRoom(code) {
    this.role = 'joy';
    this.room = code;
  }

  async prepareHostHandshake(_joySid) {
    // В BroadcastChannel старые кандидаты в базе не копятся — очистка не нужна.
  }

  async sendHello(payload) {
    this._emitSignaling('hello', payload);
  }

  async sendOffer(payload) {
    this._emitSignaling('offer', payload);
  }

  async sendAnswer(payload) {
    this._emitSignaling('answer', payload);
  }

  async sendCandidate(role, payload) {
    this._emitSignaling(role === 'host' ? 'host-cand' : 'joy-cand', payload);
  }

  sendCloudInput(stateObj) {
    this._emitCloud('fb_input', { ...stateObj, sts: Date.now() });
  }

  sendCloudPing(id) {
    this._emitCloud('fb_ping', { id, sts: Date.now() });
  }

  sendCloudPong(id) {
    this._emitCloud('fb_pong', { id, sts: Date.now() });
  }

  sendCloudCtrl(toRole, payload) {
    this._emitCloud('fb_ctrl', { to: toRole, ...payload, sts: Date.now() });
  }

  destroy() {
    for (const t of this._timers) clearTimeout(t);
    this._timers.clear();
    try { this._ch.close(); } catch { /* ignore */ }
  }
}

export class FirebaseBackend {
  constructor(db, fns) {
    this.kind = 'firebase';
    this.db = db;
    this.f = fns;
    this.room = null;
    this.role = null;
    this.timeOffset = 0;
    this.metrics = new SignalingMetrics();
    this.handlers = {};
    this._unsubs = [];
    this._lastPingId = 0;
    this._lastPongId = 0;
    this._lastCtrlSeq = 0;
  }

  _ref(sub = '') {
    return this.f.ref(this.db, `webrtc_rooms/${this.room}${sub}`);
  }

  async createRoom(code) {
    this.role = 'host';
    this.room = code;
    const f = this.f;
    const meta = { created: f.serverTimestamp(), proto: 1 };
    this.metrics.recordOut('signal', meta);
    await f.set(this._ref('/meta'), meta);
    f.onDisconnect(this._ref()).remove();

    this._unsubs.push(
      f.onValue(f.ref(this.db, '.info/serverTimeOffset'), (s) => {
        this.timeOffset = s.val() || 0;
      }),
      f.onValue(this._ref('/webrtc/hello'), (s) => {
        const v = s.val();
        if (!v || !v.joySid) return;
        this.metrics.recordIn(v);
        if (this.handlers.hello) this.handlers.hello(v);
      }),
      f.onValue(this._ref('/webrtc/answer'), (s) => {
        const v = s.val();
        if (!v || !v.joySid || !v.sdp) return;
        this.metrics.recordIn(v);
        if (this.handlers.answer) this.handlers.answer(v);
      }),
      f.onChildAdded(this._ref('/webrtc/joyCandidates'), (s) => {
        const v = s.val();
        if (!v || !v.joySid) return;
        this.metrics.recordIn(v);
        if (this.handlers.remoteCandidate) this.handlers.remoteCandidate(v);
      }),
      f.onValue(this._ref('/cloud/input'), (s) => {
        const v = s.val();
        if (!v) return;
        this.metrics.recordIn(v);
        const nowServer = Date.now() + this.timeOffset;
        const lag = typeof v.sts === 'number' ? Math.max(0, nowServer - v.sts) : null;
        if (this.handlers.cloudInput) this.handlers.cloudInput(v, lag);
      }),
      f.onValue(this._ref('/cloud/ping'), (s) => {
        const v = s.val();
        if (!v || !v.id || v.id === this._lastPingId) return;
        this._lastPingId = v.id;
        this.metrics.recordIn(v);
        if (this.handlers.cloudPing) this.handlers.cloudPing(v);
      }),
      f.onValue(this._ref('/cloud/ctrlToHost'), (s) => {
        const v = s.val();
        if (!v || !v.seq || v.seq === this._lastCtrlSeq) return;
        this._lastCtrlSeq = v.seq;
        this.metrics.recordIn(v);
        if (this.handlers.cloudCtrl) this.handlers.cloudCtrl(v);
      }),
    );
  }

  async joinRoom(code) {
    this.role = 'joy';
    this.room = code;
    const f = this.f;
    const metaSnap = await f.get(this._ref('/meta'));
    if (!metaSnap.exists()) {
      throw new Error(`Комната ${code} не найдена — проверьте 6 цифр на Экране`);
    }
    this.metrics.recordIn(metaSnap.val());

    this._unsubs.push(
      f.onValue(f.ref(this.db, '.info/serverTimeOffset'), (s) => {
        this.timeOffset = s.val() || 0;
      }),
      f.onValue(this._ref('/webrtc/offer'), (s) => {
        const v = s.val();
        if (!v || !v.joySid || !v.sdp) return;
        this.metrics.recordIn(v);
        if (this.handlers.offer) this.handlers.offer(v);
      }),
      f.onChildAdded(this._ref('/webrtc/hostCandidates'), (s) => {
        const v = s.val();
        if (!v || !v.joySid) return;
        this.metrics.recordIn(v);
        if (this.handlers.remoteCandidate) this.handlers.remoteCandidate(v);
      }),
      f.onValue(this._ref('/cloud/pong'), (s) => {
        const v = s.val();
        if (!v || !v.id || v.id === this._lastPongId) return;
        this._lastPongId = v.id;
        this.metrics.recordIn(v);
        if (this.handlers.cloudPong) this.handlers.cloudPong(v);
      }),
      f.onValue(this._ref('/cloud/ctrlToJoy'), (s) => {
        const v = s.val();
        if (!v || !v.seq || v.seq === this._lastCtrlSeq) return;
        this._lastCtrlSeq = v.seq;
        this.metrics.recordIn(v);
        if (this.handlers.cloudCtrl) this.handlers.cloudCtrl(v);
      }),
    );
  }

  async prepareHostHandshake(_joySid) {
    const f = this.f;
    await Promise.all([
      f.remove(this._ref('/webrtc/offer')).catch(() => {}),
      f.remove(this._ref('/webrtc/answer')).catch(() => {}),
      f.remove(this._ref('/webrtc/hostCandidates')).catch(() => {}),
    ]);
  }

  async sendHello(payload) {
    const f = this.f;
    await Promise.all([
      f.remove(this._ref('/webrtc/answer')).catch(() => {}),
      f.remove(this._ref('/webrtc/joyCandidates')).catch(() => {}),
    ]);
    this.metrics.recordOut('signal', payload);
    await f.set(this._ref('/webrtc/hello'), payload);
  }

  async sendOffer(payload) {
    this.metrics.recordOut('signal', payload);
    await this.f.set(this.thisRefOr('/webrtc/offer'), payload);
  }

  thisRefOr(sub) {
    return this._ref(sub);
  }

  async sendAnswer(payload) {
    this.metrics.recordOut('signal', payload);
    await this.f.set(this._ref('/webrtc/answer'), payload);
  }

  async sendCandidate(role, payload) {
    const path = role === 'host' ? '/webrtc/hostCandidates' : '/webrtc/joyCandidates';
    this.metrics.recordOut('signal', payload);
    const listRef = this.f.push(this._ref(path));
    await this.f.set(listRef, payload);
  }

  sendCloudInput(stateObj) {
    const payload = { ...stateObj, sts: Date.now() + this.timeOffset };
    this.metrics.recordOut('stream', payload);
    this.f.set(this._ref('/cloud/input'), payload).catch(() => {});
  }

  sendCloudPing(id) {
    const p = { id, sts: Date.now() + this.timeOffset };
    this.metrics.recordOut('stream', p);
    this.f.set(this._ref('/cloud/ping'), p).catch(() => {});
  }

  sendCloudPong(id) {
    const p = { id, sts: Date.now() + this.timeOffset };
    this.metrics.recordOut('stream', p);
    this.f.set(this._ref('/cloud/pong'), p).catch(() => {});
  }

  sendCloudCtrl(toRole, payload) {
    const path = toRole === 'host' ? '/cloud/ctrlToHost' : '/cloud/ctrlToJoy';
    const p = { ...payload, seq: Date.now() + Math.random() };
    this.metrics.recordOut('stream', p);
    this.f.set(this._ref(path), p).catch(() => {});
  }

  destroy() {
    for (const u of this._unsubs) {
      try { u(); } catch { /* ignore */ }
    }
    this._unsubs = [];
  }
}

export async function connectFirebaseBackend(config) {
  const appMod = await import('https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js');
  const dbMod = await import('https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js');
  const app = appMod.initializeApp(config, 'agi-webrtc-stand-' + Date.now());
  const db = dbMod.getDatabase(app);
  return new FirebaseBackend(db, dbMod);
}
