// 3D-управление наклонами ладони (без компаса alpha и без gimbal-lock)
// + прямой P2P-канал WebRTC DataChannel (60 Гц) поверх комнаты Firebase / Demo.

const DEG2RAD = Math.PI / 180;
const RAD2DEG = 180 / Math.PI;

export const GOOGLE_STUN_SERVERS = [
  { urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302'] },
];

function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}

function cleanZero(v) {
  return Object.is(v, -0) || Math.abs(v) < 1e-9 ? 0 : v;
}

function rotateScreenXY(x, y, screenAngleDeg = 0) {
  const a = ((Number(screenAngleDeg) || 0) * DEG2RAD);
  if (Math.abs(a) < 1e-6) return { x, y };
  const c = Math.cos(a);
  const s = Math.sin(a);
  return {
    x: x * c - y * s,
    y: x * s + y * c,
  };
}

/**
 * 3D единичный вектор «вверх» (против гравитации) в координатах экрана телефона:
 * +X — правый край, +Y — верхний край (от себя), +Z — из экрана к лицу.
 * Зависит ТОЛЬКО от beta и gamma (компас alpha не используется вовсе).
 */
export function deviceUpVector(betaDeg, gammaDeg, screenAngleDeg = 0) {
  const b = (Number(betaDeg) || 0) * DEG2RAD;
  const g = (Number(gammaDeg) || 0) * DEG2RAD;
  const cb = Math.cos(b);
  const sb = Math.sin(b);
  const cg = Math.cos(g);
  const sg = Math.sin(g);

  const ux0 = -cb * sg;
  const uy0 = sb;
  const uz = cb * cg;
  const rot = rotateScreenXY(ux0, uy0, screenAngleDeg);
  const len = Math.hypot(rot.x, rot.y, uz) || 1;
  return {
    x: rot.x / len,
    y: rot.y / len,
    z: uz / len,
  };
}

/**
 * Резервный 3D вектор «вверх» из акселерометра (devicemotion.accelerationIncludingGravity)
 * для телефонов без гироскопа.
 */
export function accelToUpVector(ax, ay, az, screenAngleDeg = 0) {
  const x0 = Number(ax) || 0;
  const y0 = Number(ay) || 0;
  const z0 = Number(az) || 0;
  const len = Math.hypot(x0, y0, z0);
  if (len < 1.5) return null;
  const rot = rotateScreenXY(x0 / len, y0 / len, screenAngleDeg);
  return {
    x: rot.x,
    y: rot.y,
    z: z0 / len,
  };
}

/**
 * Поворот Родрига кратчайшей дугой, переводящий эталонный хват zeroUp в (0, 0, 1).
 * Одинаковый физический наклон на 15° вдоль длинной или короткой стороны телефона
 * даёт ровно 15° отклонения без перекоса чувствительности.
 */
export function alignToZeroGrip(u, zeroUp) {
  if (!zeroUp) return u;
  const zx = zeroUp.x;
  const zy = zeroUp.y;
  const zz = zeroUp.z;

  const dot = clamp(zz, -1, 1);
  if (dot > 0.999999) return u;
  if (dot < -0.999999) return { x: u.x, y: -u.y, z: -u.z };

  // k = normalize(zeroUp × Z_hat) = normalize((zy, -zx, 0))
  const kLen = Math.hypot(zy, -zx);
  const kx = zy / kLen;
  const ky = -zx / kLen;
  const sinA = kLen;
  const cosA = dot;

  const kDotU = kx * u.x + ky * u.y;
  const cx = ky * u.z;
  const cy = -kx * u.z;
  const cz = kx * u.y - ky * u.x;

  const oneMinusCos = 1 - cosA;
  return {
    x: u.x * cosA + cx * sinA + kx * kDotU * oneMinusCos,
    y: u.y * cosA + cy * sinA + ky * kDotU * oneMinusCos,
    z: u.z * cosA + cz * sinA,
  };
}

/**
 * Переводит текущее 3D-положение телефона относительно откалиброванного хвата zeroUp
 * в управление машинкой Candy Kingdom Coaster:
 *   - Наклон влево/вправо -> steer [-1..+1]
 *   - Ровно в руке (±5°) -> спокойный круиз throttle = 0.30, brake = 0
 *   - Наклон от себя (вперёд) -> плавный разгон throttle 0.30 -> 1.00
 *   - Наклон на себя (назад) -> сброс газа и активный тормоз brake 0 -> 1.00 (до полной остановки)
 */
export function handTiltDrive(u, zeroUp, opts = {}) {
  const spanDeg = Math.max(12, Number(opts.spanDeg) || 24);
  const steerDeadzoneDeg = Number.isFinite(opts.steerDeadzoneDeg) ? opts.steerDeadzoneDeg : 2.2;
  const cruiseDeadzoneDeg = Number.isFinite(opts.cruiseDeadzoneDeg) ? opts.cruiseDeadzoneDeg : 5.0;
  const cruiseThrottle = Number.isFinite(opts.cruiseThrottle) ? opts.cruiseThrottle : 0.30;
  const invertPitch = Boolean(opts.invertPitch);

  const rel = alignToZeroGrip(u, zeroUp || { x: 0, y: 0, z: 1 });

  // Вправо: правый край опускается -> вектор «вверх» смещается в -X в СК экрана -> -rel.x > 0
  // Подождите: проверим знак gamma!
  // При наклоне ВПРАВО (gamma > 0): deviceUpVector даёт ux = -cos(b)*sin(g) < 0!
  // Значит наклон вправо соответствует (-rel.x > 0)!
  const tiltRightDeg = Math.asin(clamp(-rel.x, -1, 1)) * RAD2DEG;

  // Вперёд (от себя, носом вниз): beta уменьшается -> uy уменьшается -> (-rel.y > 0)!
  const rawForwardDeg = Math.asin(clamp(-rel.y, -1, 1)) * RAD2DEG;
  const tiltForwardDeg = invertPitch ? -rawForwardDeg : rawForwardDeg;

  // Руль: мягкая мёртвая зона ±2.2°, затем линейный ход до ±spanDeg
  let steer = 0;
  const absR = Math.abs(tiltRightDeg);
  if (absR > steerDeadzoneDeg) {
    const signR = tiltRightDeg >= 0 ? 1 : -1;
    steer = signR * clamp((absR - steerDeadzoneDeg) / Math.max(6, spanDeg - steerDeadzoneDeg), 0, 1);
  }

  // Педаль газа / круиза / тормоза:
  let throttle = cruiseThrottle;
  let brake = 0;
  let zone = 'cruise';

  if (tiltForwardDeg > cruiseDeadzoneDeg) {
    // Разгон от круиза (30%) до полного газа (100%)
    const gasSpan = Math.max(8, spanDeg - cruiseDeadzoneDeg);
    const t = clamp((tiltForwardDeg - cruiseDeadzoneDeg) / gasSpan, 0, 1);
    throttle = cruiseThrottle + (1 - cruiseThrottle) * t;
    brake = 0;
    zone = 'gas';
  } else if (tiltForwardDeg < -cruiseDeadzoneDeg) {
    const backDeg = -tiltForwardDeg; // > cruiseDeadzoneDeg
    const coastEndDeg = cruiseDeadzoneDeg + 4; // 5°..9° — плавный сброс газа 30% -> 0%
    if (backDeg <= coastEndDeg) {
      const t = clamp((backDeg - cruiseDeadzoneDeg) / 4, 0, 1);
      throttle = cruiseThrottle * (1 - t);
      brake = 0;
      zone = 'coast';
    } else {
      // Глубже 9° на себя (9°..19°) — активное торможение до полной остановки
      const brakeSpan = Math.max(7, Math.min(12, spanDeg * 0.45));
      throttle = 0;
      brake = clamp((backDeg - coastEndDeg) / brakeSpan, 0, 1);
      zone = 'brake';
    }
  }

  return {
    steer: cleanZero(+steer.toFixed(4)),
    throttle: cleanZero(+throttle.toFixed(4)),
    brake: cleanZero(+brake.toFixed(4)),
    zone,
    tiltRightDeg: cleanZero(+tiltRightDeg.toFixed(2)),
    tiltForwardDeg: cleanZero(+tiltForwardDeg.toFixed(2)),
  };
}

function serializeDesc(desc) {
  return { type: desc.type, sdp: desc.sdp, ts: Date.now() };
}

function serializeCand(cand) {
  const j = cand.toJSON ? cand.toJSON() : cand;
  return {
    candidate: j.candidate,
    sdpMid: j.sdpMid ?? null,
    sdpMLineIndex: j.sdpMLineIndex ?? null,
    usernameFragment: j.usernameFragment ?? null,
    ts: Date.now(),
  };
}

/**
 * Сигнальный адаптер поверх Firebase RTDB (rooms/{room}/webrtc/*).
 */
export function createFirebaseRtcSignaling(fb, db, room) {
  const base = `rooms/${room}/webrtc`;
  return {
    iceServers: GOOGLE_STUN_SERVERS,
    async resetForOffer() {
      await Promise.all([
        fb.remove(fb.ref(db, `${base}/offer`)).catch(() => {}),
        fb.remove(fb.ref(db, `${base}/answer`)).catch(() => {}),
        fb.remove(fb.ref(db, `${base}/hostCandidates`)).catch(() => {}),
        fb.remove(fb.ref(db, `${base}/joyCandidates`)).catch(() => {}),
      ]);
    },
    async sendHello(joySid) {
      await fb.set(fb.ref(db, `${base}/hello`), { joySid, ts: Date.now() });
    },
    onHello(cb) {
      return fb.onValue(fb.ref(db, `${base}/hello`), (s) => {
        const v = s.val();
        if (v && v.joySid) cb(v);
      });
    },
    async sendOffer(offer, joySid) {
      await fb.set(fb.ref(db, `${base}/offer`), { ...serializeDesc(offer), joySid });
    },
    onOffer(cb) {
      return fb.onValue(fb.ref(db, `${base}/offer`), (s) => {
        const v = s.val();
        if (v && v.sdp && v.type === 'offer') cb(v);
      });
    },
    async sendAnswer(answer, joySid) {
      await fb.set(fb.ref(db, `${base}/answer`), { ...serializeDesc(answer), joySid });
    },
    onAnswer(cb) {
      return fb.onValue(fb.ref(db, `${base}/answer`), (s) => {
        const v = s.val();
        if (v && v.sdp && v.type === 'answer') cb(v);
      });
    },
    async pushCandidate(role, cand, joySid) {
      const sub = role === 'host' ? 'hostCandidates' : 'joyCandidates';
      await fb.push(fb.ref(db, `${base}/${sub}`), { ...serializeCand(cand), joySid });
    },
    onCandidate(role, cb) {
      const sub = role === 'host' ? 'hostCandidates' : 'joyCandidates';
      return fb.onChildAdded(fb.ref(db, `${base}/${sub}`), (s) => {
        const v = s.val();
        if (v && v.candidate) cb(v);
      });
    },
  };
}

/**
 * Сигнальный адаптер поверх BroadcastChannel (для локального демо и автотестов без облака).
 */
export function createBroadcastRtcSignaling(bc, room) {
  const handlers = { hello: [], offer: [], answer: [], hostCand: [], joyCand: [] };
  const listener = (ev) => {
    const m = ev.data;
    if (!m || m.kind !== 'rtc-sig' || m.room !== room) return;
    const list = handlers[m.sub];
    if (list) for (const fn of list) fn(m.payload);
  };
  bc.addEventListener('message', listener);
  const off = (sub, fn) => () => {
    const idx = handlers[sub].indexOf(fn);
    if (idx >= 0) handlers[sub].splice(idx, 1);
  };
  const post = (sub, payload) => bc.postMessage({ kind: 'rtc-sig', room, sub, payload });

  return {
    iceServers: [],
    async resetForOffer() {},
    async sendHello(joySid) { post('hello', { joySid, ts: Date.now() }); },
    onHello(cb) { handlers.hello.push(cb); return off('hello', cb); },
    async sendOffer(offer, joySid) { post('offer', { ...serializeDesc(offer), joySid }); },
    onOffer(cb) { handlers.offer.push(cb); return off('offer', cb); },
    async sendAnswer(answer, joySid) { post('answer', { ...serializeDesc(answer), joySid }); },
    onAnswer(cb) { handlers.answer.push(cb); return off('answer', cb); },
    async pushCandidate(role, cand, joySid) {
      const sub = role === 'host' ? 'hostCand' : 'joyCand';
      post(sub, { ...serializeCand(cand), joySid });
    },
    onCandidate(role, cb) {
      const sub = role === 'host' ? 'hostCand' : 'joyCand';
      handlers[sub].push(cb);
      return off(sub, cb);
    },
    dispose() {
      bc.removeEventListener('message', listener);
    },
  };
}

/**
 * Хост-сторона WebRTC (экран игры / VR-очки).
 * Слушает hello от джойстика, поднимает DataChannel 'fast' (unordered, 0 ретрансляций)
 * и 'ctrl' (ordered для команд и состояния игры).
 */
export class RtcHostPeer {
  constructor(signaling, callbacks = {}) {
    this.sig = signaling;
    this.cb = callbacks;
    this.pc = null;
    this.fast = null;
    this.ctrl = null;
    this.activeJoySid = null;
    this.remoteDescReady = false;
    this.pendingCandidates = [];
    this.unsubs = [];
    this.open = false;
    this.rttMs = null;
  }

  start() {
    if (typeof RTCPeerConnection === 'undefined') return;
    this.unsubs.push(
      this.sig.onHello((h) => { this._handleHello(h).catch(() => {}); }),
      this.sig.onAnswer((ans) => { this._handleAnswer(ans).catch(() => {}); }),
      this.sig.onCandidate('joy', (c) => { this._handleCandidate(c).catch(() => {}); }),
    );
  }

  async _handleHello(hello) {
    const joySid = hello.joySid;
    if (!joySid) return;
    this._closePeer();
    this.activeJoySid = joySid;
    await this.sig.resetForOffer();

    const pc = new RTCPeerConnection({ iceServers: this.sig.iceServers ?? GOOGLE_STUN_SERVERS });
    this.pc = pc;
    this.remoteDescReady = false;
    this.pendingCandidates = [];

    const fast = pc.createDataChannel('fast', { ordered: false, maxRetransmits: 0 });
    const ctrl = pc.createDataChannel('ctrl', { ordered: true });
    this.fast = fast;
    this.ctrl = ctrl;

    this._bindChannel(fast, 'fast', pc);
    this._bindChannel(ctrl, 'ctrl', pc);

    pc.onicecandidate = (e) => {
      if (this.pc !== pc || !e.candidate) return;
      this.sig.pushCandidate('host', e.candidate, joySid).catch(() => {});
    };
    pc.onconnectionstatechange = () => {
      if (this.pc !== pc) return;
      const st = pc.connectionState;
      if (st === 'failed' || st === 'closed' || st === 'disconnected') {
        this._setOpen(false);
      }
    };

    const offer = await pc.createOffer();
    if (this.pc !== pc) return;
    await pc.setLocalDescription(offer);
    await this.sig.sendOffer(pc.localDescription, joySid);
  }

  async _handleAnswer(ans) {
    if (!this.pc || (ans.joySid && ans.joySid !== this.activeJoySid)) return;
    if (this.pc.signalingState !== 'have-local-offer') return;
    await this.pc.setRemoteDescription({ type: 'answer', sdp: ans.sdp });
    this.remoteDescReady = true;
    const queued = this.pendingCandidates.splice(0);
    for (const c of queued) {
      await this.pc.addIceCandidate(c).catch(() => {});
    }
  }

  async _handleCandidate(c) {
    if (!this.pc || (c.joySid && c.joySid !== this.activeJoySid)) return;
    const init = {
      candidate: c.candidate,
      sdpMid: c.sdpMid ?? null,
      sdpMLineIndex: c.sdpMLineIndex ?? null,
      usernameFragment: c.usernameFragment ?? undefined,
    };
    if (!this.remoteDescReady) {
      this.pendingCandidates.push(init);
      return;
    }
    await this.pc.addIceCandidate(init).catch(() => {});
  }

  _bindChannel(ch, label, ownerPc) {
    ch.onopen = () => {
      if (this.pc !== ownerPc) return;
      if (label === 'fast') this._setOpen(true);
      if (label === 'ctrl' && this.cb.onCtrlOpen) this.cb.onCtrlOpen();
    };
    ch.onclose = () => {
      if (this.pc !== ownerPc) return;
      if (label === 'fast') this._setOpen(false);
    };
    ch.onmessage = (ev) => {
      if (this.pc !== ownerPc) return;
      let msg;
      try { msg = JSON.parse(ev.data); } catch { return; }
      if (!msg || typeof msg !== 'object') return;
      if (msg.k === 'in' && msg.state && this.cb.onInput) {
        const lag = this.rttMs !== null ? Math.max(1, Math.round(this.rttMs / 2)) : 2;
        this.cb.onInput(msg.state, lag);
      } else if (msg.k === 'ping') {
        this._sendJson(this.fast, { k: 'pong', id: msg.id, t0: msg.t0 });
        if (this.cb.onAlive) this.cb.onAlive();
      } else if (msg.k === 'pong-ack' && Number.isFinite(msg.rtt)) {
        this.rttMs = Math.max(1, Math.round(msg.rtt));
        if (this.cb.onRtt) this.cb.onRtt(this.rttMs);
      } else if (msg.k === 'cmd' && msg.name && this.cb.onCmd) {
        this.cb.onCmd(msg.name, msg.seq);
      }
    };
  }

  _setOpen(v) {
    if (this.open === v) return;
    this.open = v;
    if (this.cb.onOpenChange) this.cb.onOpenChange(v);
  }

  _sendJson(ch, obj) {
    if (!ch || ch.readyState !== 'open') return false;
    try {
      ch.send(JSON.stringify(obj));
      return true;
    } catch {
      return false;
    }
  }

  sendState(stateObj) {
    return this._sendJson(this.ctrl, { k: 'state', state: stateObj });
  }

  _closePeer() {
    this._setOpen(false);
    this.rttMs = null;
    try { if (this.fast) this.fast.close(); } catch {}
    try { if (this.ctrl) this.ctrl.close(); } catch {}
    try { if (this.pc) this.pc.close(); } catch {}
    this.fast = null;
    this.ctrl = null;
    this.pc = null;
    this.remoteDescReady = false;
    this.pendingCandidates = [];
  }

  close() {
    for (const u of this.unsubs.splice(0)) {
      try { u(); } catch {}
    }
    if (this.sig && this.sig.dispose) this.sig.dispose();
    this._closePeer();
  }
}

/**
 * Джойстик-сторона WebRTC (второй телефон в руке).
 * Отправляет hello в комнату, принимает offer, шлёт быстрые 60 Гц пакеты руля/газа/тормоза
 * без единой записи в базу Firebase, а при обрыве мгновенно возвращает флаг isOpen() = false
 * для прозрачного отката на Firebase.
 */
export class RtcJoyPeer {
  constructor(signaling, joySid, callbacks = {}) {
    this.sig = signaling;
    this.joySid = joySid;
    this.cb = callbacks;
    this.pc = null;
    this.fast = null;
    this.ctrl = null;
    this.remoteDescReady = false;
    this.pendingCandidates = [];
    this.unsubs = [];
    this.open = false;
    this.rttMs = null;
    this.lastPongAt = -Infinity;
    this._pingTimer = null;
    this._pingSeq = 0;
    this._lastOfferSdp = '';
  }

  async start() {
    if (typeof RTCPeerConnection === 'undefined') return;
    this.unsubs.push(
      this.sig.onOffer((off) => { this._handleOffer(off).catch(() => {}); }),
      this.sig.onCandidate('host', (c) => { this._handleCandidate(c).catch(() => {}); }),
    );
    await this.reconnect();
  }

  async reconnect() {
    if (typeof RTCPeerConnection === 'undefined') return;
    this._lastOfferSdp = '';
    this._closePeer();
    await this.sig.sendHello(this.joySid).catch(() => {});
  }

  async _handleOffer(offer) {
    if (offer.joySid && offer.joySid !== this.joySid) return;
    if (offer.sdp === this._lastOfferSdp && this.pc) return;
    this._lastOfferSdp = offer.sdp;
    this._closePeer();

    const pc = new RTCPeerConnection({ iceServers: this.sig.iceServers ?? GOOGLE_STUN_SERVERS });
    this.pc = pc;
    this.remoteDescReady = false;
    this.pendingCandidates = [];

    pc.ondatachannel = (ev) => {
      if (this.pc !== pc) return;
      const ch = ev.channel;
      if (ch.label === 'fast') {
        this.fast = ch;
        this._bindChannel(ch, 'fast', pc);
      } else if (ch.label === 'ctrl') {
        this.ctrl = ch;
        this._bindChannel(ch, 'ctrl', pc);
      }
    };

    pc.onicecandidate = (e) => {
      if (this.pc !== pc || !e.candidate) return;
      this.sig.pushCandidate('joy', e.candidate, this.joySid).catch(() => {});
    };

    pc.onconnectionstatechange = () => {
      if (this.pc !== pc) return;
      const st = pc.connectionState;
      if (st === 'failed' || st === 'closed' || st === 'disconnected') {
        this._setOpen(false);
      }
    };

    await pc.setRemoteDescription({ type: 'offer', sdp: offer.sdp });
    this.remoteDescReady = true;
    const queued = this.pendingCandidates.splice(0);
    for (const c of queued) {
      await pc.addIceCandidate(c).catch(() => {});
    }

    const answer = await pc.createAnswer();
    if (this.pc !== pc) return;
    await pc.setLocalDescription(answer);
    await this.sig.sendAnswer(pc.localDescription, this.joySid);
  }

  async _handleCandidate(c) {
    if (!this.pc || (c.joySid && c.joySid !== this.joySid)) return;
    const init = {
      candidate: c.candidate,
      sdpMid: c.sdpMid ?? null,
      sdpMLineIndex: c.sdpMLineIndex ?? null,
      usernameFragment: c.usernameFragment ?? undefined,
    };
    if (!this.remoteDescReady) {
      this.pendingCandidates.push(init);
      return;
    }
    await this.pc.addIceCandidate(init).catch(() => {});
  }

  _bindChannel(ch, label, ownerPc) {
    ch.onopen = () => {
      if (this.pc !== ownerPc) return;
      if (label === 'fast') {
        this.lastPongAt = performance.now();
        this._setOpen(true);
        this._startPings();
      }
    };
    ch.onclose = () => {
      if (this.pc !== ownerPc) return;
      if (label === 'fast') this._setOpen(false);
    };
    ch.onmessage = (ev) => {
      if (this.pc !== ownerPc) return;
      let msg;
      try { msg = JSON.parse(ev.data); } catch { return; }
      if (!msg || typeof msg !== 'object') return;
      if (msg.k === 'pong' && Number.isFinite(msg.t0)) {
        const now = performance.now();
        const rtt = Math.max(1, Math.round(now - msg.t0));
        this.lastPongAt = now;
        this.rttMs = rtt;
        this._sendJson(this.ctrl, { k: 'pong-ack', rtt });
        if (this.cb.onRtt) this.cb.onRtt(rtt);
      } else if (msg.k === 'state' && msg.state && this.cb.onState) {
        this.lastPongAt = performance.now();
        this.cb.onState(msg.state);
      }
    };
  }

  _startPings() {
    clearInterval(this._pingTimer);
    const fire = () => {
      if (!this.open) return;
      this._sendJson(this.fast, { k: 'ping', id: ++this._pingSeq, t0: performance.now() });
    };
    fire();
    this._pingTimer = setInterval(fire, 1500);
  }

  _setOpen(v) {
    if (this.open === v) return;
    this.open = v;
    if (!v) clearInterval(this._pingTimer);
    if (this.cb.onOpenChange) this.cb.onOpenChange(v);
  }

  _sendJson(ch, obj) {
    if (!ch || ch.readyState !== 'open') return false;
    try {
      ch.send(JSON.stringify(obj));
      return true;
    } catch {
      return false;
    }
  }

  isOpen() {
    return Boolean(
      this.open &&
      this.fast &&
      this.fast.readyState === 'open' &&
      (performance.now() - this.lastPongAt) < 9000
    );
  }

  sendInput(stateObj) {
    if (!this.isOpen()) return false;
    return this._sendJson(this.fast, { k: 'in', state: stateObj });
  }

  sendCmd(name, seq) {
    if (!this.ctrl || this.ctrl.readyState !== 'open') return false;
    return this._sendJson(this.ctrl, { k: 'cmd', name, seq });
  }

  _closePeer() {
    this._setOpen(false);
    this.rttMs = null;
    clearInterval(this._pingTimer);
    try { if (this.fast) this.fast.close(); } catch {}
    try { if (this.ctrl) this.ctrl.close(); } catch {}
    try { if (this.pc) this.pc.close(); } catch {}
    this.fast = null;
    this.ctrl = null;
    this.pc = null;
    this.remoteDescReady = false;
    this.pendingCandidates = [];
  }

  close() {
    for (const u of this.unsubs.splice(0)) {
      try { u(); } catch {}
    }
    if (this.sig && this.sig.dispose) this.sig.dispose();
    this._closePeer();
  }
}
