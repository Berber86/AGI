// wrist.js — автономный клиент телефона-браслета для «Белой ночи».
// Передаёт 60 Гц кватернион W3C + линейное ускорение и угловую скорость по WebRTC
// (с авто-резервом через Firebase и BroadcastChannel для демо/автотестов).
// Строго без виброотклика и звуков.

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
  roomCode: document.getElementById('room-code'),
  fbDetails: document.getElementById('fb-details'),
  fbConfig: document.getElementById('fb-config'),
  connectBtn: document.getElementById('connect-btn'),
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

// Состояние датчиков и связи
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
  mode: 'off', // 'off' | 'demo' | 'firebase'
  room: '',
  sid: 's' + Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-4),
  connected: false,
  p2pOpen: false,
  route: 'idle',
  rttMs: null,
  seq: 0,
  db: null,
  fbMod: null,
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
      // Отделяем гравитацию простым ФНЧ, если браузер не даёт чистое линейное ускорение
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
  // ВАЖНО для iOS Safari: запускаем оба requestPermission() СИНХРОННО в первом микротаске
  // клика (до любых сторонних await вроде wakeLock), иначе WebKit гасит жест пользователя!
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
    els.beaconStatus.textContent = 'Нет связи · проверьте код';
    return;
  }
  if (fast) {
    const rttTxt = link.rttMs !== null ? ` · ${link.rttMs} мс` : '';
    const label = link.mode === 'demo' ? 'Демо 60 Гц' : `⚡ Прямой Wi-Fi 60 Гц${rttTxt}`;
    els.netPill.textContent = label;
    els.netPill.classList.add('ok');
    els.beaconStatus.textContent = `${label} · Маяк активен`;
  } else if (link.connected) {
    els.netPill.textContent = '☁️ Облако (поднимаю 60 Гц…)';
    els.netPill.classList.add('ok');
    els.beaconStatus.textContent = 'Облако · Маяк активен';
  } else {
    els.netPill.textContent = 'Ожидание игры…';
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

  // 60 Гц цикл отправки (16.6 мс): при открытом P2P 0 записей в Firebase
  link.txTimer = setInterval(() => {
    if (link.mode === 'off') return;
    const pkt = buildPacket();
    const now = performance.now();
    // Затухание импульса devicemotion между кадрами во ВСЕХ режимах (demo / WebRTC / Firebase),
    // чтобы одиночный пик ускорения никогда не «залипал» на стационарном реальном браузере!
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
      } catch { /* упадём в резерв Firebase ниже */ }
    }

    // Резервный коалесцированный канал через Firebase (~8 Гц), пока WebRTC поднимается
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
      link.mode === 'firebase' &&
      link.db &&
      link.fbMod &&
      now - link.lastHelloSentAt >= 5000 &&
      now - link.answerSentAt >= 4500
    ) {
      // Напоминаем хосту поднять новый оффер только если текущее рукопожатие WebRTC не в процессе!
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
  closePcOnly();
  if (link.bc) {
    try { link.bc.close(); } catch { /* ignore */ }
    link.bc = null;
  }
  link.mode = 'off';
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
    if (link.db && link.fbMod && link.room) {
      const { ref, set } = link.fbMod;
      set(ref(link.db, `wn_wrist_rooms/${link.room}/handSide`), payload).catch(() => {});
    }
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
  const code = els.roomCode.value.replace(/\D/g, '');
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

    const { ref, set, onValue, onChildAdded } = dbMod;
    const roomPath = `wn_wrist_rooms/${code}`;
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
      })
    );

    link.unsubs.push(
      onValue(ref(link.db, `${roomPath}/rtc/offer`), async (snap) => {
        const offer = snap.val();
        if (!offer || !offer.sdp || !offer.hid || offer.hid === link.hid) return;
        await answerOffer(offer);
      })
    );

    link.unsubs.push(
      onChildAdded(ref(link.db, `${roomPath}/rtc/hostCandidates`), async (snap) => {
        const item = snap.val();
        if (!item || !item.candidate || !item.hid) return;
        if (item.hid !== link.hid || !link.pc || !link.pc.remoteDescription) {
          // Если кандидат локальной сети пришёл на микросекунду раньше setRemoteDescription(offer),
          // бережно сохраняем его в очередь, чтобы НЕ потерять прямой Wi-Fi LAN-маршрут!
          link.pendingCandidates.push(item);
          if (link.pendingCandidates.length > 48) link.pendingCandidates.shift();
          return;
        }
        try { await link.pc.addIceCandidate(item.candidate); } catch { /* ignore */ }
      })
    );

    startTransmitLoop();
    els.connMsg.textContent = 'Браслет подключён! Выполните 2 шага калибровки и включите экран-маяк.';
    renderStatus();
  } catch (e) {
    els.connMsg.textContent = `Ошибка связи: ${e?.message || e}`;
    renderStatus();
  }
}

async function answerOffer(offer) {
  if (typeof RTCPeerConnection === 'undefined' || !link.db || !link.fbMod) return;
  const savedEarly = link.pendingCandidates.filter((c) => c.hid === offer.hid);
  closePcOnly();
  link.hid = offer.hid;
  link.pendingCandidates = savedEarly;
  const currentHid = offer.hid;
  const iceServers = offer.iceMode === 'lan' ? [] : GOOGLE_STUN_SERVERS;
  const pc = new RTCPeerConnection({ iceServers });
  link.pc = pc;
  const { ref, set, push } = link.fbMod;
  const rtcBase = `wn_wrist_rooms/${link.room}/rtc`;

  pc.ondatachannel = (ev) => {
    const ch = ev.channel;
    if (ch.label === 'wrist-fast') link.dcFast = ch;
    else link.dcCtrl = ch;

    ch.onopen = () => {
      if (link.hid !== currentHid) return;
      link.p2pOpen = true;
      const now = performance.now();
      link.dcOpenedAt = now;
      link.lastPongAt = now;
      renderStatus();
    };
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
  };

  pc.onicecandidate = (ev) => {
    if (!ev.candidate || link.hid !== currentHid) return;
    push(ref(link.db, `${rtcBase}/wristCandidates`), {
      hid: currentHid,
      candidate: ev.candidate.toJSON ? ev.candidate.toJSON() : ev.candidate,
    }).catch(() => {});
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
    await set(ref(link.db, `${rtcBase}/answer`), {
      hid: currentHid,
      sdp: answer.sdp,
      ts: Date.now(),
    });
  } catch { /* ignore */ }
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
      if (link.db && link.fbMod && link.room) {
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

// Защита от случайного выхода рукавом: двойной тап в течение 1.2 с
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
  await acquireWakeLock();
  els.beaconScreen.hidden = false;
  try { await document.documentElement.requestFullscreen?.(); } catch { /* ignore */ }
  renderStatus();
});

els.connectBtn.addEventListener('click', connectFirebase);
els.demoBtn.addEventListener('click', () => connectDemo(els.roomCode.value));
els.handLeftBtn?.addEventListener('click', () => setHandSide('left', true));
els.handRightBtn?.addEventListener('click', () => setHandSide('right', true));
els.calStep1.addEventListener('click', () => sendCalibrationStep('pose1', 2000));
els.calStep2.addEventListener('click', () => sendCalibrationStep('pose2', 2000));
els.beaconCal1.addEventListener('click', () => sendCalibrationStep('pose1', 2000));
els.beaconCal2.addEventListener('click', () => sendCalibrationStep('pose2', 2000));

document.addEventListener('visibilitychange', () => {
  if (!document.hidden && link.mode !== 'off') {
    acquireWakeLock();
    if (link.mode === 'firebase' && link.db && link.fbMod && !isFastHealthy()) {
      const { ref, set } = link.fbMod;
      set(ref(link.db, `wn_wrist_rooms/${link.room}/rtc/hello`), { ts: Date.now() }).catch(() => {});
    }
  }
});

// Автоподстановка сохранённого конфига Firebase, выбранной руки и URL-параметров (?demo=1&room=...&hand=left)
try {
  const saved = localStorage.getItem(SHARED_CFG_KEY) || localStorage.getItem(LOCAL_CFG_KEY) || '';
  if (saved) els.fbConfig.value = saved;
  else els.fbDetails.open = true;
  const savedSide = localStorage.getItem(HAND_SIDE_KEY);
  if (savedSide === 'left' || savedSide === 'right') {
    sensorState.handSide = savedSide;
    sensorState.explicitSide = true;
  }
} catch { /* ignore */ }

const params = new URLSearchParams(window.location.search);
if (params.get('hand') === 'left' || params.get('hand') === 'right') {
  sensorState.handSide = params.get('hand');
  sensorState.explicitSide = true;
}
renderHandSideUI();
if (params.get('room')) els.roomCode.value = params.get('room').replace(/\D/g, '').slice(0, 6);
if (params.get('demo') === '1') {
  connectDemo(params.get('room') || '111111');
}

// Тестовый интерфейс для headless E2E проверки связки двух вкладок.
// Наружу не отдаём: страница браслета живёт на обычном хостинге, а управление
// датчиками и каналом из консоли чужой вкладке ничего хорошего не даёт.
if (new URLSearchParams(window.location.search).has('test')) window.__WRIST_TEST__ = {
  connectDemo,
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
    beaconVisible: !els.beaconScreen.hidden,
  }),
};
