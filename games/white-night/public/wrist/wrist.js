// wrist.js — автономный клиент телефона-браслета для «Белой ночи».
// Передаёт 60 Гц кватернион W3C + линейное ускорение и угловую скорость по WebRTC
// без обязательного ввода API Firebase:
//   - `local` (по умолчанию): общая сохранённая пара (`agi_pair_v1`) + прямой локальный Wi-Fi WebRTC 60 Гц.
//   - `offline` (100% без интернета): взаимный обмен компактными QR-кодами `AG1.<base64url>`.
//   - `firebase` / `demo`: свёрнутый резервный режим.
// Строго без тактильного отклика и звуков.

import {
  loadSavedPairCode,
  savePairCode,
  normalizePairCode,
  formatPairCode,
  createAutoPairSignaling,
  acceptOfflineOfferAndCreateAnswer,
  renderQrSvg,
  QrCameraScanner,
  parseScannedPayload,
} from './local-pair.js';

const FB_CDN = 'https://www.gstatic.com/firebasejs/11.0.1';
const SHARED_CFG_KEY = 'ckc_stand_cfg';
const LOCAL_CFG_KEY = 'wn_firebase_cfg';
const HAND_SIDE_KEY = 'wn_wrist_hand_side';
const DEMO_CHANNEL = 'wn-wrist-demo-v1';
const DEG = Math.PI / 180;
const Q_ENU_TO_GL = [-Math.SQRT1_2, 0, 0, Math.SQRT1_2];

const GOOGLE_STUN_SERVERS = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
];

function qMul(a, b) {
  const [ax, ay, az, aw] = a;
  const [bx, by, bz, bw] = b;
  return [
    aw * bx + ax * bw + ay * bz - az * by,
    aw * by - ax * bz + ay * bw + az * bx,
    aw * bz + ax * by - ay * bx + az * bw,
    aw * bw - ax * bx - ay * by - az * bz,
  ];
}

function qAxisAngle([ax, ay, az], rad) {
  const half = rad * 0.5;
  const s = Math.sin(half);
  return [ax * s, ay * s, az * s, Math.cos(half)];
}

function qNormalize([x, y, z, w]) {
  const len = Math.hypot(x, y, z, w);
  return len < 1e-9 ? [0, 0, 0, 1] : [x / len, y / len, z / len, w / len];
}

function w3cDeviceQuaternion(alphaDeg = 0, betaDeg = 0, gammaDeg = 0, screenAngleDeg = 0) {
  const qZ = qAxisAngle([0, 0, 1], alphaDeg * DEG);
  const qX = qAxisAngle([1, 0, 0], betaDeg * DEG);
  const qY = qAxisAngle([0, 1, 0], gammaDeg * DEG);
  const qGl = qMul(Q_ENU_TO_GL, qMul(qMul(qZ, qX), qY));
  if (!screenAngleDeg) return qNormalize(qGl);
  return qNormalize(qMul(qGl, qAxisAngle([0, 0, 1], -screenAngleDeg * DEG)));
}

function gravityOnlyDeviceQuaternion(betaDeg = 0, gammaDeg = 0, screenAngleDeg = 0) {
  const b = betaDeg * DEG;
  const g = gammaDeg * DEG;
  const s = screenAngleDeg * DEG;
  const ux = -Math.cos(b) * Math.sin(g);
  const uy = Math.sin(b);
  const uz = Math.cos(b) * Math.cos(g);
  const cs = Math.cos(s);
  const sn = Math.sin(s);
  const sx = ux * cs - uy * sn;
  const sy = ux * sn + uy * cs;
  const sz = uz;
  if (sy < -0.99999) return [1, 0, 0, 0];
  return qNormalize([-sz, 0, sx, 1 + sy]);
}

function parseFirebaseConfig(raw) {
  if (!raw || typeof raw !== 'string') return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (/^https:\/\/[a-z0-9-]+\.(firebaseio\.com|firebasedatabase\.app)\/?$/i.test(trimmed)) {
    return { databaseURL: trimmed.replace(/\/$/, '') };
  }
  try {
    const parsed = JSON.parse(trimmed);
    if (parsed && typeof parsed === 'object' && (parsed.databaseURL || parsed.projectId)) return parsed;
  } catch { /* ignore */ }
  const out = {};
  const re = /([a-zA-Z0-9_]+)\s*:\s*(['"`])([^'"`]*)\2/g;
  let m;
  while ((m = re.exec(trimmed)) !== null) out[m[1]] = m[3];
  if (!out.databaseURL && out.projectId) {
    out.databaseURL = `https://${out.projectId}-default-rtdb.firebaseio.com`;
  }
  return out.databaseURL ? out : null;
}

const els = {
  netPill: document.getElementById('net-pill'),
  sensorPill: document.getElementById('sensor-pill'),
  savedPairBtn: document.getElementById('saved-pair-btn'),
  scanQrBtn: document.getElementById('scan-qr-btn'),
  pasteOffBtn: document.getElementById('paste-off-btn'),
  qrScanBox: document.getElementById('qr-scan-box'),
  qrScanVideo: document.getElementById('qr-scan-video'),
  scanFlipBtn: document.getElementById('scan-flip-btn'),
  scanStopBtn: document.getElementById('scan-stop-btn'),
  qrScanMsg: document.getElementById('qr-scan-msg'),
  qrAnsBox: document.getElementById('qr-ans-box'),
  qrAnsSvg: document.getElementById('qr-ans-svg'),
  copyAnsBtn: document.getElementById('copy-ans-btn'),
  cancelAnsBtn: document.getElementById('cancel-ans-btn'),
  qrAnsMsg: document.getElementById('qr-ans-msg'),
  roomCode: document.getElementById('room-code'),
  fbDetails: document.getElementById('fb-details'),
  fbConfig: document.getElementById('fb-config'),
  connectBtn: document.getElementById('connect-btn'),
  fbConnectBtn: document.getElementById('fb-connect-btn'),
  demoBtn: document.getElementById('demo-btn'),
  connMsg: document.getElementById('conn-msg'),
  handLeftBtn: document.getElementById('hand-left-btn'),
  handRightBtn: document.getElementById('hand-right-btn'),
  handSideMsg: document.getElementById('hand-side-msg'),
  calMsg: document.getElementById('cal-msg'),
  calStep1: document.getElementById('cal-step1'),
  calStep2: document.getElementById('cal-step2'),
  openBeacon: document.getElementById('open-beacon'),
  beaconScreen: document.getElementById('beacon-screen'),
  beaconStatus: document.getElementById('beacon-status'),
  beaconCal1: document.getElementById('beacon-cal1'),
  beaconCal2: document.getElementById('beacon-cal2'),
  beaconClose: document.getElementById('beacon-close'),
};

const sensorState = {
  active: false,
  synthetic: false,
  handSide: 'right',
  explicitSide: false,
  q: [0, 0, 0, 1],
  linMag: 0,
  rotRate: 0,
  acc: [0, 0, 0],
  gravityLp: [0, 0, 0],
  lastAt: 0,
};

const link = {
  mode: 'off', // 'off' | 'local' | 'offline' | 'demo' | 'firebase'
  room: '',
  sid: 's' + Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-4),
  connected: false,
  p2pOpen: false,
  brokersOnline: 0,
  route: 'idle',
  rttMs: null,
  seq: 0,
  db: null,
  fbMod: null,
  autoSig: null,
  unsubs: [],
  bc: null,
  pc: null,
  dcFast: null,
  dcCtrl: null,
  hid: '',
  pendingCandidates: [],
  dcOpenedAt: 0,
  lastPongAt: 0,
  lastFastTxAt: 0,
  lastFbWriteAt: 0,
  lastHelloSentAt: 0,
  answerSentAt: 0,
  wakeLock: null,
  txTimer: null,
  pingTimer: null,
  calTimer: null,
};

function readScreenAngleDeg() {
  if (window.screen?.orientation && Number.isFinite(window.screen.orientation.angle)) {
    return window.screen.orientation.angle;
  }
  return Number.isFinite(window.orientation) ? window.orientation : 0;
}

async function acquireWakeLock() {
  try {
    if (navigator.wakeLock?.request && !link.wakeLock) {
      link.wakeLock = await navigator.wakeLock.request('screen');
      link.wakeLock.addEventListener?.('release', () => { link.wakeLock = null; });
    }
  } catch { /* ignore */ }
}

let sensorListenersBound = false;

function bindSensorListenersOnce() {
  if (sensorListenersBound) return;
  sensorListenersBound = true;

  window.addEventListener('deviceorientation', (ev) => {
    if (sensorState.synthetic) return;
    if (!Number.isFinite(ev.beta) || !Number.isFinite(ev.gamma)) return;
    const scr = readScreenAngleDeg();
    sensorState.q = Number.isFinite(ev.alpha)
      ? w3cDeviceQuaternion(ev.alpha, ev.beta, ev.gamma, scr)
      : gravityOnlyDeviceQuaternion(ev.beta, ev.gamma, scr);
    sensorState.active = true;
    sensorState.lastAt = performance.now();
  });

  window.addEventListener('devicemotion', (ev) => {
    if (sensorState.synthetic) return;
    const lin = ev.acceleration;
    const inc = ev.accelerationIncludingGravity;
    if (lin && Number.isFinite(lin.x) && Number.isFinite(lin.y) && Number.isFinite(lin.z)) {
      sensorState.acc = [+lin.x.toFixed(2), +lin.y.toFixed(2), +lin.z.toFixed(2)];
      sensorState.linMag = +Math.hypot(lin.x, lin.y, lin.z).toFixed(2);
    } else if (inc && Number.isFinite(inc.x) && Number.isFinite(inc.y) && Number.isFinite(inc.z)) {
      const g = sensorState.gravityLp;
      g[0] = g[0] * 0.85 + inc.x * 0.15;
      g[1] = g[1] * 0.85 + inc.y * 0.15;
      g[2] = g[2] * 0.85 + inc.z * 0.15;
      const lx = inc.x - g[0], ly = inc.y - g[1], lz = inc.z - g[2];
      sensorState.acc = [+lx.toFixed(2), +ly.toFixed(2), +lz.toFixed(2)];
      sensorState.linMag = +Math.hypot(lx, ly, lz).toFixed(2);
    }
    const rr = ev.rotationRate;
    if (rr && (Number.isFinite(rr.alpha) || Number.isFinite(rr.beta) || Number.isFinite(rr.gamma))) {
      sensorState.rotRate = +Math.hypot(rr.alpha || 0, rr.beta || 0, rr.gamma || 0).toFixed(1);
    }
  });
}

async function requestSensors() {
  if (sensorState.synthetic) return true;
  try {
    const orientPerm = typeof DeviceOrientationEvent?.requestPermission === 'function'
      ? DeviceOrientationEvent.requestPermission()
      : Promise.resolve('granted');
    const motionPerm = typeof DeviceMotionEvent?.requestPermission === 'function'
      ? DeviceMotionEvent.requestPermission().catch(() => 'granted')
      : Promise.resolve('granted');
    const [orientRes] = await Promise.all([orientPerm, motionPerm]);
    if (orientRes !== 'granted') {
      els.sensorPill.textContent = 'Гироскоп запрещён';
      return false;
    }
  } catch { /* ignore */ }

  bindSensorListenersOnce();
  els.sensorPill.textContent = 'Датчики активны';
  return true;
}

function isFastHealthy(now = performance.now()) {
  if (link.mode === 'demo') return link.connected;
  if (!link.dcFast || link.dcFast.readyState !== 'open') return false;
  const refAt = link.lastPongAt || link.dcOpenedAt;
  if (!refAt) return false;
  return now - refAt < 8500;
}

function renderStatus() {
  const fast = isFastHealthy();
  if (!link.connected && link.mode === 'off') {
    els.netPill.textContent = 'Не подключён';
    els.netPill.classList.remove('ok');
    els.beaconStatus.textContent = 'Нет связи · проверьте пару';
    return;
  }
  if (fast) {
    const rttTxt = link.rttMs !== null ? ` · ${link.rttMs} мс` : '';
    const label = link.mode === 'demo' ? 'Демо 60 Гц' : `⚡ Прямой Wi-Fi 60 Гц${rttTxt}`;
    els.netPill.textContent = label;
    els.netPill.classList.add('ok');
    els.beaconStatus.textContent = `${label} · Маяк активен`;
  } else if (link.mode === 'offline') {
    els.netPill.textContent = 'Офлайн QR: ждём экран…';
    els.netPill.classList.remove('ok');
    els.beaconStatus.textContent = 'Ждём сканирование ответа…';
  } else if (link.connected) {
    els.netPill.textContent = link.mode === 'local'
      ? 'Связь есть (поднимаю 60 Гц…)'
      : '☁️ Облако (поднимаю 60 Гц…)';
    els.netPill.classList.add('ok');
    els.beaconStatus.textContent = 'Поднимаю 60 Гц · Маяк активен';
  } else {
    els.netPill.textContent = link.mode === 'local'
      ? `Пара ${formatPairCode(link.room)} · ищем игру…`
      : 'Ожидание игры…';
    els.netPill.classList.remove('ok');
  }
  if (sensorState.active) {
    els.sensorPill.textContent = 'Гироскоп 60 Гц ✓';
    els.sensorPill.classList.add('ok');
  }
}

function buildPacket() {
  link.seq += 1;
  return {
    k: 'wrist',
    room: link.room,
    sid: link.sid,
    seq: link.seq,
    q: sensorState.q.map((v) => +v.toFixed(5)),
    linMag: sensorState.linMag,
    rotRate: sensorState.rotRate,
    acc: sensorState.acc,
    ts: Date.now(),
  };
}

function startTransmitLoop() {
  clearInterval(link.txTimer);
  clearInterval(link.pingTimer);

  link.txTimer = setInterval(() => {
    if (link.mode === 'off') return;
    const pkt = buildPacket();
    const now = performance.now();
    if (!sensorState.synthetic) {
      sensorState.linMag = +(sensorState.linMag * 0.92).toFixed(2);
      sensorState.rotRate = +(sensorState.rotRate * 0.92).toFixed(1);
    }

    if (link.mode === 'demo' && link.bc) {
      link.bc.postMessage(pkt);
      return;
    }

    if (isFastHealthy(now)) {
      try {
        link.dcFast.send(JSON.stringify(pkt));
        link.lastFastTxAt = now;
        return;
      } catch { /* упадём в резерв ниже */ }
    }

    if (link.mode === 'local' && link.autoSig && now - link.lastFbWriteAt >= 120) {
      link.lastFbWriteAt = now;
      link.autoSig.sendFallback(pkt);
      return;
    }

    if (link.db && link.fbMod && now - link.lastFbWriteAt >= 120) {
      link.lastFbWriteAt = now;
      const { ref, set } = link.fbMod;
      set(ref(link.db, `wn_wrist_rooms/${link.room}/fbInput`), pkt).catch(() => {});
    }
  }, 16);

  link.pingTimer = setInterval(() => {
    const now = performance.now();
    const ch = link.dcCtrl?.readyState === 'open' ? link.dcCtrl : link.dcFast;
    if (ch?.readyState === 'open') {
      try { ch.send(JSON.stringify({ k: 'ping', t: Math.round(now) })); } catch { /* ignore */ }
    } else if (
      link.mode === 'local' &&
      link.autoSig &&
      now - link.lastHelloSentAt >= 3200 &&
      now - link.answerSentAt >= 3000
    ) {
      link.lastHelloSentAt = now;
      link.autoSig.writeHello({ ts: Date.now() }).catch(() => {});
      link.autoSig.sendFallback({
        k: 'hello',
        room: link.room,
        sid: link.sid,
        side: sensorState.handSide,
        explicitSide: sensorState.explicitSide,
        ts: Date.now(),
      });
    } else if (
      link.mode === 'firebase' &&
      link.db &&
      link.fbMod &&
      now - link.lastHelloSentAt >= 5000 &&
      now - link.answerSentAt >= 4500
    ) {
      link.lastHelloSentAt = now;
      const { ref, set } = link.fbMod;
      set(ref(link.db, `wn_wrist_rooms/${link.room}/rtc/hello`), { ts: Date.now() }).catch(() => {});
    }
    renderStatus();
  }, 1200);
}

function closePcOnly() {
  try { link.dcFast?.close(); } catch { /* ignore */ }
  try { link.dcCtrl?.close(); } catch { /* ignore */ }
  try { link.pc?.close(); } catch { /* ignore */ }
  link.dcFast = null;
  link.dcCtrl = null;
  link.pc = null;
  link.pendingCandidates = [];
  link.dcOpenedAt = 0;
  link.p2pOpen = false;
}

function stopLink() {
  clearInterval(link.txTimer);
  clearInterval(link.pingTimer);
  clearTimeout(link.calTimer);
  for (const u of link.unsubs) {
    try { u(); } catch { /* ignore */ }
  }
  link.unsubs = [];
  if (link.autoSig) {
    link.autoSig.dispose();
    link.autoSig = null;
  }
  closePcOnly();
  if (link.bc) {
    try { link.bc.close(); } catch { /* ignore */ }
    link.bc = null;
  }
  link.mode = 'off';
  link.brokersOnline = 0;
  link.connected = false;
  renderStatus();
}

function renderHandSideUI() {
  const isLeft = sensorState.handSide === 'left';
  els.handLeftBtn?.classList.toggle('primary', isLeft);
  els.handRightBtn?.classList.toggle('primary', !isLeft);
  if (els.handSideMsg) {
    els.handSideMsg.textContent = isLeft
      ? 'Левая рука активна: плечо слева, сгиб локтя и большой палец отзеркалены под левую кисть.'
      : 'Правая рука активна: плечо справа, естественный локтевой сгиб и хват правой кисти.';
  }
}

function setHandSide(side, broadcast = true) {
  const clean = side === 'left' ? 'left' : 'right';
  sensorState.handSide = clean;
  if (broadcast) sensorState.explicitSide = true;
  try { localStorage.setItem(HAND_SIDE_KEY, clean); } catch { /* ignore */ }
  renderHandSideUI();
  if (!broadcast || link.mode === 'off') return;
  const payload = { k: 'hand_side', room: link.room, side: clean, ts: Date.now() };
  if (link.mode === 'demo' && link.bc) {
    link.bc.postMessage(payload);
  } else {
    const ch = link.dcCtrl?.readyState === 'open' ? link.dcCtrl : link.dcFast;
    if (ch?.readyState === 'open') {
      try { ch.send(JSON.stringify(payload)); } catch { /* ignore */ }
    }
    if (link.mode === 'local' && link.autoSig) {
      link.autoSig.sendFallback(payload);
    } else if (link.db && link.fbMod && link.room) {
      const { ref, set } = link.fbMod;
      set(ref(link.db, `wn_wrist_rooms/${link.room}/handSide`), payload).catch(() => {});
    }
  }
}

function bindIncomingPeerChannel(ch, currentHid) {
  if (ch.label === 'wrist-fast') link.dcFast = ch;
  else link.dcCtrl = ch;

  const markOpen = () => {
    if (currentHid && link.hid !== currentHid) return;
    link.connected = true;
    link.p2pOpen = true;
    const now = performance.now();
    link.dcOpenedAt = now;
    link.lastPongAt = now;
    if (els.qrAnsBox) els.qrAnsBox.hidden = true;
    els.connMsg.textContent = '⚡ Прямой канал Wi-Fi 60 Гц открыт! Выполните 2 жеста калибровки и включите экран-маяк.';
    renderStatus();
  };
  if (ch.readyState === 'open') markOpen();
  ch.onopen = markOpen;
  ch.onmessage = (mEv) => {
    let msg;
    try { msg = JSON.parse(mEv.data); } catch { return; }
    if (msg.k === 'ping') {
      try { ch.send(JSON.stringify({ k: 'pong', t: msg.t })); } catch { /* ignore */ }
    } else if (msg.k === 'pong') {
      link.lastPongAt = performance.now();
      if (Number.isFinite(msg.t)) {
        const rtt = Math.max(1, Math.round(performance.now() - msg.t));
        link.rttMs = link.rttMs === null ? rtt : Math.round(link.rttMs * 0.65 + rtt * 0.35);
      }
      renderStatus();
    } else if (msg.k === 'hand_side' && (msg.side === 'left' || msg.side === 'right')) {
      setHandSide(msg.side, false);
    }
  };
}

async function answerOfferGeneric(offer, pushCandidate, writeAnswer) {
  if (typeof RTCPeerConnection === 'undefined') return;
  const savedEarly = link.pendingCandidates.filter((c) => c.hid === offer.hid);
  closePcOnly();
  link.hid = offer.hid;
  link.pendingCandidates = savedEarly;
  const currentHid = offer.hid;
  const iceServers = offer.iceMode === 'lan' ? [] : GOOGLE_STUN_SERVERS;
  const pc = new RTCPeerConnection({ iceServers });
  link.pc = pc;

  pc.ondatachannel = (ev) => bindIncomingPeerChannel(ev.channel, currentHid);

  pc.onicecandidate = (ev) => {
    if (!ev.candidate || link.hid !== currentHid) return;
    const candJson = ev.candidate.toJSON ? ev.candidate.toJSON() : ev.candidate;
    pushCandidate({ hid: currentHid, candidate: candJson }).catch(() => {});
  };

  pc.onconnectionstatechange = () => {
    if (link.hid !== currentHid) return;
    if (pc.connectionState === 'failed' || pc.connectionState === 'closed') {
      link.p2pOpen = false;
      renderStatus();
    }
  };

  try {
    await pc.setRemoteDescription({ type: 'offer', sdp: offer.sdp });
    const queued = link.pendingCandidates.filter((c) => c.hid === currentHid);
    link.pendingCandidates = [];
    for (const item of queued) {
      if (link.hid !== currentHid) break;
      try { await pc.addIceCandidate(item.candidate); } catch { /* ignore */ }
    }
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    link.answerSentAt = performance.now();
    await writeAnswer({
      hid: currentHid,
      sdp: answer.sdp,
      ts: Date.now(),
    });
  } catch { /* ignore */ }
}

async function connectLocalPair(rawCode, { requestPerm = true } = {}) {
  const code = normalizePairCode(rawCode || els.roomCode.value);
  if (code.length !== 6) {
    els.connMsg.textContent = 'Введите 6 цифр пары или сканируйте QR с экрана игры.';
    return false;
  }
  stopQrScanner();
  if (els.qrAnsBox) els.qrAnsBox.hidden = true;
  if (requestPerm) await requestSensors();
  else bindSensorListenersOnce();
  acquireWakeLock();
  stopLink();

  savePairCode(code);
  syncSavedPairButton();
  els.roomCode.value = code;
  link.mode = 'local';
  link.room = code;
  link.sid = 's' + Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-4);
  link.seq = 0;
  link.lastHelloSentAt = performance.now();

  link.autoSig = createAutoPairSignaling(code, {
    game: 'wn',
    role: 'controller',
    onBrokerChange: (count) => {
      link.brokersOnline = count;
      renderStatus();
    },
    onFallbackMessage: (d) => {
      if (!d || typeof d !== 'object') return;
      if (d.k === 'ack') {
        link.connected = true;
        if (!sensorState.explicitSide && (d.side === 'left' || d.side === 'right')) {
          setHandSide(d.side, false);
        }
        renderStatus();
      } else if (d.k === 'hand_side' && (d.side === 'left' || d.side === 'right')) {
        setHandSide(d.side, false);
      }
    },
  });

  link.unsubs.push(
    link.autoSig.onOffer(async (offer) => {
      if (!offer || !offer.sdp || !offer.hid || offer.hid === link.hid) return;
      link.connected = true;
      await answerOfferGeneric(
        offer,
        (c) => link.autoSig.pushJoyCandidate(c),
        (a) => link.autoSig.writeAnswer(a),
      );
    }),
    link.autoSig.onHostCandidate(async (item) => {
      if (!item || !item.candidate || !item.hid) return;
      if (item.hid !== link.hid || !link.pc || !link.pc.remoteDescription) {
        link.pendingCandidates.push(item);
        if (link.pendingCandidates.length > 48) link.pendingCandidates.shift();
        return;
      }
      try { await link.pc.addIceCandidate(item.candidate); } catch { /* ignore */ }
    }),
  );

  link.autoSig.writeHello({ ts: Date.now() }).catch(() => {});
  link.autoSig.sendFallback({
    k: 'hello',
    room: link.room,
    sid: link.sid,
    side: sensorState.handSide,
    explicitSide: sensorState.explicitSide,
    ts: Date.now(),
  });

  startTransmitLoop();
  els.connMsg.textContent = `Пара ${formatPairCode(code)} сохранена — поднимаем прямой Wi-Fi 60 Гц…`;
  renderStatus();
  return true;
}

let pendingOfflineAnswerToken = '';
async function handleOfflineOfferToken(offerToken, { requestPerm = false } = {}) {
  stopQrScanner();
  if (requestPerm) await requestSensors();
  else bindSensorListenersOnce();
  acquireWakeLock();
  stopLink();

  try {
    els.connMsg.textContent = 'Собираем локальный ответ точки доступа Wi-Fi…';
    const ans = await acceptOfflineOfferAndCreateAnswer(offerToken, {
      fastLabel: 'wrist-fast',
      ctrlLabel: 'wrist-ctrl',
    });
    pendingOfflineAnswerToken = ans.token;
    const code = normalizePairCode(ans.pairCode) || loadSavedPairCode() || '000000';
    if (normalizePairCode(ans.pairCode)) {
      savePairCode(ans.pairCode);
      syncSavedPairButton();
      els.roomCode.value = ans.pairCode;
    }
    link.mode = 'offline';
    link.room = code;
    link.hid = ans.hid;
    link.pc = ans.pc;
    link.sid = 's' + Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-4);
    link.seq = 0;

    ans.onFastChannel((ch) => bindIncomingPeerChannel(ch, ans.hid));
    ans.onCtrlChannel((ch) => bindIncomingPeerChannel(ch, ans.hid));

    startTransmitLoop();
    if (els.qrAnsSvg) els.qrAnsSvg.innerHTML = renderQrSvg(ans.token, { border: 2 });
    if (els.qrAnsBox) els.qrAnsBox.hidden = false;
    els.connMsg.textContent = 'Покажите ответный QR камере первого телефона — канал 60 Гц откроется сам.';
    renderStatus();
    return { token: ans.token, pairCode: code };
  } catch (err) {
    els.connMsg.textContent = `Не удалось разобрать офлайн-код: ${err?.message || err}`;
    return null;
  }
}

function connectDemo(code) {
  stopLink();
  const cleanCode = String(code || '').replace(/\D/g, '').slice(0, 6) || '111111';
  els.roomCode.value = cleanCode;
  link.mode = 'demo';
  link.room = cleanCode;
  link.sid = 's' + Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-4);
  link.seq = 0;
  link.connected = true;
  link.p2pOpen = true;
  if (typeof BroadcastChannel !== 'undefined') {
    link.bc = new BroadcastChannel(DEMO_CHANNEL);
    link.bc.onmessage = (ev) => {
      const d = ev?.data;
      if (!d || String(d.room) !== link.room) return;
      if (d.k === 'ack') {
        link.connected = true;
        if (!sensorState.explicitSide && (d.side === 'left' || d.side === 'right')) {
          setHandSide(d.side, false);
        }
        renderStatus();
      } else if (d.k === 'hand_side' && (d.side === 'left' || d.side === 'right')) {
        setHandSide(d.side, false);
      }
    };
    link.bc.postMessage({
      k: 'hello',
      room: link.room,
      sid: link.sid,
      side: sensorState.handSide,
      explicitSide: sensorState.explicitSide,
      ts: Date.now(),
    });
  }
  requestSensors();
  acquireWakeLock();
  startTransmitLoop();
  els.connMsg.textContent = `Демо-связь активна (код ${cleanCode}). Откройте Белую ночь в соседней вкладке.`;
  renderStatus();
}

async function connectFirebase() {
  const code = normalizePairCode(els.roomCode.value);
  if (code.length !== 6) {
    els.connMsg.textContent = 'Введите ровно 6 цифр кода комнаты.';
    return;
  }
  const rawCfg = els.fbConfig.value.trim();
  const cfg = parseFirebaseConfig(rawCfg);
  if (!cfg) {
    els.fbDetails.open = true;
    els.connMsg.textContent = 'Вставьте firebaseConfig или URL вашей Realtime Database.';
    return;
  }
  try {
    localStorage.setItem(SHARED_CFG_KEY, rawCfg);
    localStorage.setItem(LOCAL_CFG_KEY, rawCfg);
  } catch { /* ignore */ }

  await requestSensors();
  await acquireWakeLock();
  stopLink();
  link.mode = 'firebase';
  link.room = code;
  els.connMsg.textContent = 'Подключаемся к комнате…';

  try {
    const [{ initializeApp, getApps, deleteApp }, dbMod] = await Promise.all([
      import(`${FB_CDN}/firebase-app.js`),
      import(`${FB_CDN}/firebase-database.js`),
    ]);
    const existing = getApps().find((a) => a.name === 'wn-wrist-peer');
    if (existing) {
      try { await deleteApp(existing); } catch { /* ignore */ }
    }
    const app = initializeApp(cfg, 'wn-wrist-peer');
    link.db = dbMod.getDatabase(app, cfg.databaseURL);
    link.fbMod = dbMod;

    const { ref, set, push, onValue, onChildAdded } = dbMod;
    const roomPath = `wn_wrist_rooms/${code}`;
    const rtcBase = `${roomPath}/rtc`;
    link.sid = 's' + Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-4);
    link.seq = 0;
    link.lastHelloSentAt = performance.now();
    await set(ref(link.db, `${roomPath}/wristJoined`), { sid: link.sid, ts: Date.now() });
    if (sensorState.explicitSide) {
      await set(ref(link.db, `${roomPath}/handSide`), { side: sensorState.handSide, ts: Date.now() });
    }
    link.connected = true;

    link.unsubs.push(
      onValue(ref(link.db, `${roomPath}/hostHandSide`), (snap) => {
        const hs = snap.val();
        if (hs && (hs.side === 'left' || hs.side === 'right')) {
          setHandSide(hs.side, false);
        }
      }),
      onValue(ref(link.db, `${rtcBase}/offer`), async (snap) => {
        const offer = snap.val();
        if (!offer || !offer.sdp || !offer.hid || offer.hid === link.hid) return;
        await answerOfferGeneric(
          offer,
          (c) => push(ref(link.db, `${rtcBase}/wristCandidates`), c),
          (a) => set(ref(link.db, `${rtcBase}/answer`), a),
        );
      }),
      onChildAdded(ref(link.db, `${rtcBase}/hostCandidates`), async (snap) => {
        const item = snap.val();
        if (!item || !item.candidate || !item.hid) return;
        if (item.hid !== link.hid || !link.pc || !link.pc.remoteDescription) {
          link.pendingCandidates.push(item);
          if (link.pendingCandidates.length > 48) link.pendingCandidates.shift();
          return;
        }
        try { await link.pc.addIceCandidate(item.candidate); } catch { /* ignore */ }
      }),
    );

    startTransmitLoop();
    els.connMsg.textContent = 'Браслет подключён! Выполните 2 шага калибровки и включите экран-маяк.';
    renderStatus();
  } catch (e) {
    els.connMsg.textContent = `Ошибка связи: ${e?.message || e}`;
    renderStatus();
  }
}

function sendCalibrationStep(step, delayMs = 2000) {
  requestSensors();
  clearTimeout(link.calTimer);
  const label = step === 'pose1' ? 'Шаг 1 (прямая рука)' : 'Шаг 2 (согнуть локоть)';
  els.calMsg.textContent = `${label}: примите позу… запись через ${(delayMs / 1000).toFixed(0)} с`;
  els.beaconStatus.textContent = `${label}: держите позу…`;
  link.calTimer = setTimeout(() => {
    link.calTimer = null;
    const cmdId = 'c' + Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4);
    const payload = { k: 'cal', id: cmdId, room: link.room, step, ts: Date.now() };
    if (link.mode === 'demo' && link.bc) {
      link.bc.postMessage(payload);
    } else {
      const ch = link.dcCtrl?.readyState === 'open' ? link.dcCtrl : link.dcFast;
      if (ch?.readyState === 'open') {
        try { ch.send(JSON.stringify(payload)); } catch { /* ignore */ }
      }
      if (link.mode === 'local' && link.autoSig) {
        link.autoSig.sendFallback(payload);
      } else if (link.db && link.fbMod && link.room) {
        const { ref, set } = link.fbMod;
        set(ref(link.db, `wn_wrist_rooms/${link.room}/calCmd`), payload).catch(() => {});
      }
    }
    els.calMsg.textContent = step === 'pose1'
      ? '✓ Шаг 1 отправлен! Теперь нажмите Шаг 2 и согните руку в локте (не выворачивая кисть).'
      : '✓ Шаг 2 отправлен! Включите экран-маяк и наденьте VR-очки.';
    renderStatus();
  }, delayMs);
}

let qrScanner = null;
function stopQrScanner() {
  if (qrScanner) {
    qrScanner.stop();
    qrScanner = null;
  }
  if (els.qrScanBox) els.qrScanBox.hidden = true;
}

function syncSavedPairButton() {
  const saved = loadSavedPairCode();
  if (!els.savedPairBtn) return;
  if (saved) {
    els.savedPairBtn.textContent = `Подключиться к моей паре (${formatPairCode(saved)})`;
    els.savedPairBtn.hidden = false;
    if (!els.roomCode.value) els.roomCode.value = saved;
  } else {
    els.savedPairBtn.hidden = true;
  }
}

function handleScannedAny(raw) {
  const parsed = parseScannedPayload(raw);
  if (parsed.kind === 'offline-offer') {
    handleOfflineOfferToken(parsed.token, { requestPerm: false });
    return true;
  }
  if (parsed.kind === 'pair-code') {
    connectLocalPair(parsed.pairCode, { requestPerm: false });
    return true;
  }
  return false;
}

let lastCloseTap = 0;
els.beaconClose.addEventListener('click', () => {
  const now = performance.now();
  if (now - lastCloseTap < 1200) {
    els.beaconScreen.hidden = true;
    try { if (document.fullscreenElement) document.exitFullscreen?.(); } catch { /* ignore */ }
  } else {
    lastCloseTap = now;
    els.beaconStatus.textContent = 'Нажмите ещё раз для выхода из маяка';
  }
});

els.openBeacon.addEventListener('click', async () => {
  await requestSensors();
  await acquireWakeLock();
  els.beaconScreen.hidden = false;
  try { await document.documentElement.requestFullscreen?.(); } catch { /* ignore */ }
  renderStatus();
});

els.savedPairBtn?.addEventListener('click', () => {
  const saved = loadSavedPairCode();
  if (saved) connectLocalPair(saved, { requestPerm: true });
});
els.scanQrBtn?.addEventListener('click', async () => {
  if (qrScanner) { stopQrScanner(); return; }
  await requestSensors();
  if (els.qrAnsBox) els.qrAnsBox.hidden = true;
  els.qrScanBox.hidden = false;
  els.qrScanMsg.textContent = 'Запускаем камеру…';
  qrScanner = new QrCameraScanner({
    videoEl: els.qrScanVideo,
    facingMode: 'environment',
    onResult: (raw) => {
      if (handleScannedAny(raw)) stopQrScanner();
    },
  });
  try {
    await qrScanner.start();
    els.qrScanMsg.textContent = 'Наведите камеру на QR в окне «VR · Рука-браслет»…';
  } catch (err) {
    els.qrScanMsg.textContent = `Камера недоступна (${err?.message || err}) — введите 6 цифр или нажмите «Офлайн-код».`;
  }
});
els.scanFlipBtn?.addEventListener('click', () => { qrScanner?.flipCamera().catch(() => {}); });
els.scanStopBtn?.addEventListener('click', stopQrScanner);
els.pasteOffBtn?.addEventListener('click', async () => {
  await requestSensors();
  let raw = '';
  try { raw = await navigator.clipboard.readText(); } catch { /* ignore */ }
  if (!raw) raw = window.prompt('Вставьте офлайн-код шага 1 с экрана игры:') || '';
  if (raw && !handleScannedAny(raw)) {
    els.connMsg.textContent = 'Не распознан код или QR-ссылка.';
  }
});
els.copyAnsBtn?.addEventListener('click', async () => {
  if (!pendingOfflineAnswerToken) return;
  try {
    await navigator.clipboard.writeText(pendingOfflineAnswerToken);
    els.qrAnsMsg.textContent = 'Ответ скопирован! Вставьте его на экране игры.';
  } catch {
    window.prompt('Скопируйте ответный код шага 2:', pendingOfflineAnswerToken);
  }
});
els.cancelAnsBtn?.addEventListener('click', () => {
  pendingOfflineAnswerToken = '';
  if (els.qrAnsBox) els.qrAnsBox.hidden = true;
  stopLink();
});

els.connectBtn.addEventListener('click', () => connectLocalPair(els.roomCode.value, { requestPerm: true }));
els.fbConnectBtn?.addEventListener('click', connectFirebase);
els.demoBtn.addEventListener('click', () => connectDemo(els.roomCode.value));
els.handLeftBtn?.addEventListener('click', () => setHandSide('left', true));
els.handRightBtn?.addEventListener('click', () => setHandSide('right', true));
els.calStep1.addEventListener('click', () => sendCalibrationStep('pose1', 2000));
els.calStep2.addEventListener('click', () => sendCalibrationStep('pose2', 2000));
els.beaconCal1.addEventListener('click', () => sendCalibrationStep('pose1', 2000));
els.beaconCal2.addEventListener('click', () => sendCalibrationStep('pose2', 2000));

window.addEventListener('pagehide', () => {
  stopQrScanner();
  stopLink();
});
document.addEventListener('visibilitychange', () => {
  if (!document.hidden && link.mode !== 'off') {
    acquireWakeLock();
    if (link.mode === 'local' && link.autoSig && !isFastHealthy()) {
      link.autoSig.writeHello({ ts: Date.now() }).catch(() => {});
    } else if (link.mode === 'firebase' && link.db && link.fbMod && !isFastHealthy()) {
      const { ref, set } = link.fbMod;
      set(ref(link.db, `wn_wrist_rooms/${link.room}/rtc/hello`), { ts: Date.now() }).catch(() => {});
    }
  }
});

// Автоподстановка сохранённого конфига (без раскрытия резервного блока!), руки и пары
try {
  const saved = localStorage.getItem(SHARED_CFG_KEY) || localStorage.getItem(LOCAL_CFG_KEY) || '';
  if (saved && els.fbConfig) els.fbConfig.value = saved;
  const savedSide = localStorage.getItem(HAND_SIDE_KEY);
  if (savedSide === 'left' || savedSide === 'right') {
    sensorState.handSide = savedSide;
    sensorState.explicitSide = true;
  }
} catch { /* ignore */ }
syncSavedPairButton();

const params = new URLSearchParams(window.location.search);
const hashParams = new URLSearchParams(window.location.hash.startsWith('#') ? window.location.hash.slice(1) : '');
if (params.get('hand') === 'left' || params.get('hand') === 'right') {
  sensorState.handSide = params.get('hand');
  sensorState.explicitSide = true;
}
renderHandSideUI();

const urlPair = normalizePairCode(params.get('pair') || '');
const urlRoom = normalizePairCode(params.get('room') || '');
const hashOffline = hashParams.get('off') || params.get('off') || '';

if (params.get('demo') === '1') {
  connectDemo(urlRoom || urlPair || '111111');
} else if (hashOffline) {
  if (urlPair) savePairCode(urlPair);
  syncSavedPairButton();
  handleOfflineOfferToken(hashOffline, { requestPerm: false });
} else if (urlPair) {
  connectLocalPair(urlPair, { requestPerm: false });
} else if (urlRoom) {
  els.roomCode.value = urlRoom;
  if (params.get('auto') === '1') connectLocalPair(urlRoom, { requestPerm: false });
}

if (new URLSearchParams(window.location.search).has('test')) window.__WRIST_TEST__ = {
  connectDemo,
  connectLocal: (code) => connectLocalPair(code, { requestPerm: false }),
  acceptOfflineOffer: (token) => handleOfflineOfferToken(token, { requestPerm: false }),
  offlineAnswerToken: () => pendingOfflineAnswerToken,
  setHandSide: (side) => setHandSide(side, true),
  setPose({ alpha = 0, beta = 90, gamma = 0, linMag = 0, rotRate = 0 } = {}) {
    sensorState.synthetic = true;
    sensorState.active = true;
    sensorState.q = w3cDeviceQuaternion(alpha, beta, gamma, 0);
    sensorState.linMag = linMag;
    sensorState.rotRate = rotRate;
    sensorState.lastAt = performance.now();
  },
  setQuaternion(q, { linMag = 0, rotRate = 0 } = {}) {
    sensorState.synthetic = true;
    sensorState.active = true;
    sensorState.q = qNormalize(q);
    sensorState.linMag = linMag;
    sensorState.rotRate = rotRate;
    sensorState.lastAt = performance.now();
  },
  triggerCalibrationNow(step) {
    sendCalibrationStep(step, 10);
  },
  openBeacon() {
    els.beaconScreen.hidden = false;
  },
  status: () => ({
    mode: link.mode,
    room: link.room,
    handSide: sensorState.handSide,
    connected: link.connected,
    p2pOpen: isFastHealthy(),
    brokersOnline: link.brokersOnline,
    beaconVisible: !els.beaconScreen.hidden,
  }),
};
