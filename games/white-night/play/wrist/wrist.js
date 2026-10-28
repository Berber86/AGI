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
  lastPongAt: 0,
  lastFastTxAt: 0,
  lastFbWriteAt: 0,
  wakeLock: null,
  txTimer: null,
  pingTimer: null,
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

async function requestSensors() {
  if (sensorState.synthetic) return true;
  try {
    if (typeof DeviceOrientationEvent?.requestPermission === 'function') {
      const res = await DeviceOrientationEvent.requestPermission();
      if (res !== 'granted') {
        els.sensorPill.textContent = 'Гироскоп запрещён';
        return false;
      }
    }
    if (typeof DeviceMotionEvent?.requestPermission === 'function') {
      try { await DeviceMotionEvent.requestPermission(); } catch { /* ignore */ }
    }
  } catch { /* ignore */ }

  window.addEventListener('deviceorientation', (ev) => {
    if (sensorState.synthetic) return;
    if (!Number.isFinite(ev.alpha) || !Number.isFinite(ev.beta) || !Number.isFinite(ev.gamma)) return;
    sensorState.q = w3cDeviceQuaternion(ev.alpha, ev.beta, ev.gamma, readScreenAngleDeg());
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

  els.sensorPill.textContent = 'Датчики активны';
  return true;
}

function isFastHealthy(now = performance.now()) {
  if (link.mode === 'demo') return link.connected;
  if (!link.dcFast || link.dcFast.readyState !== 'open') return false;
  if (!link.lastPongAt) return true;
  return now - link.lastPongAt < 8500;
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

    if (link.mode === 'demo' && link.bc) {
      link.bc.postMessage(pkt);
      return;
    }

    if (isFastHealthy(now)) {
      try {
        link.dcFast.send(JSON.stringify(pkt));
        link.lastFastTxAt = now;
        // Decaying импульса между событиями devicemotion
        sensorState.linMag = +(sensorState.linMag * 0.92).toFixed(2);
        sensorState.rotRate = +(sensorState.rotRate * 0.92).toFixed(1);
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
    const ch = link.dcCtrl?.readyState === 'open' ? link.dcCtrl : link.dcFast;
    if (ch?.readyState === 'open') {
      try { ch.send(JSON.stringify({ k: 'ping', t: Math.round(performance.now()) })); } catch { /* ignore */ }
    } else if (link.mode === 'firebase' && link.db && link.fbMod) {
      // Напоминаем хосту поднять новый оффер, если прямой канал ещё не открыт
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
  link.p2pOpen = false;
}

function stopLink() {
  clearInterval(link.txTimer);
  clearInterval(link.pingTimer);
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
  link.connected = true;
  link.p2pOpen = true;
  if (typeof BroadcastChannel !== 'undefined') {
    link.bc = new BroadcastChannel(DEMO_CHANNEL);
    link.bc.onmessage = (ev) => {
      const d = ev?.data;
      if (!d || String(d.room) !== link.room) return;
      if (d.k === 'ack') {
        link.connected = true;
        renderStatus();
      } else if (d.k === 'hand_side' && (d.side === 'left' || d.side === 'right')) {
        setHandSide(d.side, false);
      }
    };
    link.bc.postMessage({ k: 'hello', room: link.room, side: sensorState.handSide, ts: Date.now() });
  }
  acquireWakeLock();
  requestSensors();
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

  await acquireWakeLock();
  await requestSensors();
  stopLink();
  link.mode = 'firebase';
  link.room = code;
  els.connMsg.textContent = 'Подключаемся к комнате…';

  try {
    const [{ initializeApp, getApps }, dbMod] = await Promise.all([
      import(`${FB_CDN}/firebase-app.js`),
      import(`${FB_CDN}/firebase-database.js`),
    ]);
    const existing = getApps().find((a) => a.name === 'wn-wrist-peer');
    const app = existing || initializeApp(cfg, 'wn-wrist-peer');
    link.db = dbMod.getDatabase(app, cfg.databaseURL);
    link.fbMod = dbMod;

    const { ref, set, push, onValue, onChildAdded } = dbMod;
    const roomPath = `wn_wrist_rooms/${code}`;
    await set(ref(link.db, `${roomPath}/wristJoined`), { ts: Date.now() });
    await set(ref(link.db, `${roomPath}/handSide`), { side: sensorState.handSide, ts: Date.now() });
    await set(ref(link.db, `${roomPath}/rtc/hello`), { ts: Date.now() });
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
        if (!item || item.hid !== link.hid || !link.pc) return;
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
  closePcOnly();
  link.hid = offer.hid;
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
      link.lastPongAt = performance.now();
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
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    await set(ref(link.db, `${rtcBase}/answer`), {
      hid: currentHid,
      sdp: answer.sdp,
      ts: Date.now(),
    });
  } catch { /* ignore */ }
}

function sendCalibrationStep(step, delayMs = 2000) {
  const label = step === 'pose1' ? 'Шаг 1 (прямая рука)' : 'Шаг 2 (согнуть локоть)';
  els.calMsg.textContent = `${label}: примите позу… запись через ${(delayMs / 1000).toFixed(0)} с`;
  els.beaconStatus.textContent = `${label}: держите позу…`;
  setTimeout(() => {
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
  if (savedSide === 'left' || savedSide === 'right') sensorState.handSide = savedSide;
} catch { /* ignore */ }

const params = new URLSearchParams(window.location.search);
if (params.get('hand') === 'left' || params.get('hand') === 'right') {
  sensorState.handSide = params.get('hand');
}
renderHandSideUI();
if (params.get('room')) els.roomCode.value = params.get('room').replace(/\D/g, '').slice(0, 6);
if (params.get('demo') === '1') {
  connectDemo(params.get('room') || '111111');
}

// Тестовый интерфейс для headless E2E проверки связки двух вкладок
window.__WRIST_TEST__ = {
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
