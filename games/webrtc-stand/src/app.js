import {
  SHARED_CFG_STORAGE_KEY,
  parseFirebaseConfig,
  median,
  p95,
  jitterOneWay,
  fmtBytes,
  clamp,
  deviceUpVector,
  accelToUpVector,
  upVectorToPad,
  eulerZXYToQuat,
  handWandQuatToPad,
} from './config-parser.js';
import { DemoBackend, connectFirebaseBackend } from './signaling.js';
import { RtcDirectLink } from './rtc-link.js';

const $ = (id) => document.getElementById(id);

const els = {
  cfg: $('cfg'),
  cfgSavedHint: $('cfg-saved-hint'),
  iceMode: $('ice-mode'),
  btnCfg: $('btn-cfg'),
  btnDemo: $('btn-demo'),
  demoControls: $('demo-controls'),
  demoDelay: $('demo-delay'),
  btnOpenTab: $('btn-open-tab'),
  cfgStatus: $('cfg-status'),
  cfgError: $('cfg-error'),

  cardRole: $('card-role'),
  btnHost: $('btn-host'),
  btnJoin: $('btn-join'),

  cardHost: $('card-host'),
  roomCode: $('room-code'),
  pillRtc: $('pill-rtc'),
  pillFb: $('pill-fb'),
  pillActive: $('pill-active'),
  driveMode: $('drive-mode'),
  arenaCanvas: $('arena-canvas'),
  viewLeft: $('view-left'),
  viewRight: $('view-right'),
  btnHostHaptic: $('btn-host-haptic'),
  btnTargetMove: $('btn-target-move'),
  btnHostDrop: $('btn-host-drop'),
  btnHostReconnect: $('btn-host-reconnect'),

  cardJoin: $('card-join'),
  joinCode: $('join-code'),
  btnJoinGo: $('btn-join-go'),
  discoveredWrap: $('discovered-wrap'),
  btnJoinDiscovered: $('btn-join-discovered'),
  joinStatus: $('join-status'),

  cardJoy: $('card-joy'),
  joyPillRtc: $('joy-pill-rtc'),
  joyPillFb: $('joy-pill-fb'),
  touchpad: $('touchpad'),
  padThumb: $('pad-thumb'),
  padHint: $('pad-hint'),
  btnAutoOrbit: $('btn-auto-orbit'),
  btnGyroToggle: $('btn-gyro-toggle'),
  gyroControls: $('gyro-controls'),
  gyroMode: $('gyro-mode'),
  gyroSpan: $('gyro-span'),
  btnGyroCenter: $('btn-gyro-center'),
  btnGyroInvert: $('btn-gyro-invert'),
  joyLeft: $('joy-left'),
  joyRight: $('joy-right'),
  hapticBanner: $('haptic-banner'),
  btnJoyDrop: $('btn-joy-drop'),
  btnJoyReconnect: $('btn-joy-reconnect'),

  routeBadge: $('route-badge'),
  routeDetail: $('route-detail'),
  cmpRtcState: $('cmp-rtc-state'),
  cmpFbState: $('cmp-fb-state'),
  cmpRtcMed: $('cmp-rtc-med'),
  cmpFbMed: $('cmp-fb-med'),
  cmpRtcP95: $('cmp-rtc-p95'),
  cmpFbP95: $('cmp-fb-p95'),
  cmpRtcJit: $('cmp-rtc-jit'),
  cmpFbJit: $('cmp-fb-jit'),
  cmpRtcHz: $('cmp-rtc-hz'),
  cmpFbHz: $('cmp-fb-hz'),
  cmpRtcPkts: $('cmp-rtc-pkts'),
  cmpFbPkts: $('cmp-fb-pkts'),
  cmpRtcBytes: $('cmp-rtc-bytes'),
  cmpFbBytes: $('cmp-fb-bytes'),
  cmpRtcDbw: $('cmp-rtc-dbw'),
  cmpFbDbw: $('cmp-fb-dbw'),
  verdict: $('verdict'),
  stepsList: $('steps-list'),
};

const CLOUD_SEND_INTERVAL_MS = 160;   // Безопасные ~6,25 пакета/с для Firebase
const CLOUD_HEARTBEAT_MS = 1500;
const RTC_TICK_MS = 16;               // ~60 Гц для WebRTC UDP

let backend = null;
let rtc = null;

const state = {
  role: null,              // 'host' | 'joy'
  room: null,
  driveMode: 'auto',       // 'auto' | 'rtc' | 'fb'
  activeSource: 'none',    // 'rtc' | 'fb-fallback' | 'fb' | 'none'

  // Ввод на стороне Джойстика
  joy: {
    x: 0,
    y: 0,
    l: false,
    r: false,
    seq: 0,
    pointerDown: false,
    autoOrbit: false,
    gyroEnabled: false,
    gyroMode: 'tilt',        // 'tilt' (3D без компаса) | 'wand' (3D кватернион)
    gyroSpanDeg: 25,
    gyroInvertY: false,
    gyroUpVec: null,
    gyroZeroUpVec: null,
    gyroRawAngles: null,
    gyroZeroQuat: null,
    hasOrientationEvents: false,
    hapticReceived: 0,
    lastHapticVia: null,
  },

  // Состояние арены на стороне Экрана
  hostArena: {
    rtcCursor: { x: 0, y: 0, l: false, r: false, lastAt: 0, trail: [] },
    fbCursor: { x: 0, y: 0, l: false, r: false, lastAt: 0 },
    target: { x: 0.42, y: -0.25, moving: true, hits: 0, inside: false, lastHitAt: 0, flashUntil: 0 },
  },

  // Пинг-понг и частота отправки (собирает Джойстик и синхронизирует на Экран)
  bench: {
    rtcRtt: [],
    fbRtt: [],
    rtcOutTimestamps: [],
    fbOutTimestamps: [],
    rtcHz: 0,
    fbHz: 0,
    pendingRtcPing: null,
    pendingFbPing: null,
    pingSeq: 0,
    // Сводка, присланная с Джойстика на Экран
    remoteSummary: null,
  },
};

const timers = [];
const addTimer = (id) => { timers.push(id); return id; };

function generateRoomCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

// ---------------------------------------------------------------- Шкала 5 шагов WebRTC
function renderSteps(steps) {
  const iconFor = (st) => {
    if (st === 'done') return '✅';
    if (st === 'active') return '⏳';
    if (st === 'fail') return '⚠️';
    return '⚪';
  };
  els.stepsList.innerHTML = '';
  for (const s of steps) {
    const li = document.createElement('li');
    li.className = `step-item ${s.state}`;
    const icon = document.createElement('span');
    icon.className = 'step-icon';
    icon.textContent = iconFor(s.state);

    const body = document.createElement('div');
    const title = document.createElement('div');
    title.className = 'step-title';
    title.textContent = s.title;
    const note = document.createElement('div');
    note.className = 'step-note';
    note.textContent = s.note;
    body.append(title, note);

    li.append(icon, body);
    els.stepsList.appendChild(li);
  }
}

renderSteps([
  { id: 1, title: '1. Вход в комнату (Hello)', state: 'idle', note: 'Выберите Firebase или Демо в 2 вкладках' },
  { id: 2, title: '2. Анкета экрана (SDP Offer)', state: 'idle', note: 'Ожидание старта комнаты' },
  { id: 3, title: '3. Ответ пульта (SDP Answer)', state: 'idle', note: 'Ожидание второго устройства' },
  { id: 4, title: '4. Обмен маршрутами (ICE)', state: 'idle', note: 'Проверим локальный Wi-Fi и STUN' },
  { id: 5, title: '5. Прямая UDP-труба', state: 'idle', note: 'Ещё не открыта' },
]);

// ---------------------------------------------------------------- Подключение Backend
try {
  const savedCfg = localStorage.getItem(SHARED_CFG_STORAGE_KEY);
  if (savedCfg && savedCfg.trim()) {
    els.cfg.value = savedCfg;
    els.cfgSavedHint.classList.remove('hidden');
  }
} catch { /* ignore */ }

els.btnCfg.addEventListener('click', async () => {
  els.cfgError.textContent = '';
  els.cfgStatus.textContent = '';
  try {
    const parsed = parseFirebaseConfig(els.cfg.value);
    els.btnCfg.disabled = true;
    backend = await connectFirebaseBackend(parsed);
    try { localStorage.setItem(SHARED_CFG_STORAGE_KEY, els.cfg.value); } catch { /* ignore */ }
    els.demoControls.classList.add('hidden');
    els.cfgStatus.textContent = '✅ Firebase подключён! Теперь выберите роль этого телефона ниже.';
    els.cardRole.classList.remove('hidden');
  } catch (err) {
    els.cfgError.textContent = 'Ошибка подключения Firebase: ' + (err?.message || String(err));
  } finally {
    els.btnCfg.disabled = false;
  }
});

els.btnDemo.addEventListener('click', () => {
  els.cfgError.textContent = '';
  if (backend) backend.destroy();
  const delayMs = Number(els.demoDelay.value) || 140;
  backend = new DemoBackend({ cloudOneWayMs: delayMs });
  backend.handlers.roomDiscovered = (roomCode) => {
    if (state.role === 'host') return;
    els.discoveredWrap.classList.remove('hidden');
    els.btnJoinDiscovered.textContent = `✨ Войти в открытую комнату ${roomCode}`;
    els.btnJoinDiscovered.dataset.room = roomCode;
  };
  backend.discoverActiveRoom();
  els.demoControls.classList.remove('hidden');
  els.cfgStatus.textContent =
    `🧪 Демо-режим активен: знакомство идёт через BroadcastChannel, но WebRTC между вкладками — 100% НАСТОЯЩИЙ! (облачный канал имитирует ${delayMs} мс в одну сторону).`;
  els.cardRole.classList.remove('hidden');
});

els.demoDelay.addEventListener('change', () => {
  if (backend && backend.kind === 'demo') {
    const ms = Number(els.demoDelay.value) || 0;
    backend.setCloudDelayMs(ms);
    state.bench.fbRtt = [];
    els.cfgStatus.textContent = `🧪 Демо-режим: имитация задержки облака переключена на ${ms} мс в одну сторону.`;
    renderComparison();
  }
});

els.btnOpenTab.addEventListener('click', () => {
  window.open(window.location.href, '_blank');
});

els.iceMode.addEventListener('change', () => {
  if (rtc) {
    rtc.setIceMode(els.iceMode.value);
    if (state.role === 'joy') rtc.startHandshakeFromJoy();
    else if (state.role === 'host') rtc.requestReconnectFromHost();
  }
});

// ---------------------------------------------------------------- Запуск Роли: Экран (Host)
els.btnHost.addEventListener('click', async () => {
  if (!backend) return;
  els.cfgError.textContent = '';
  state.role = 'host';
  state.room = generateRoomCode();
  els.roomCode.textContent = state.room;
  els.cardHost.classList.remove('hidden');
  els.cardJoin.classList.add('hidden');
  els.cardJoy.classList.add('hidden');

  await backend.createRoom(state.room);
  setupRtc('host');
  bindHostHandlers();
  startHostLoop();
  renderComparison();
});

// ---------------------------------------------------------------- Запуск Роли: Джойстик (Joy)
els.btnJoin.addEventListener('click', () => {
  if (!backend) return;
  els.cardJoin.classList.remove('hidden');
  els.cardHost.classList.add('hidden');
  if (backend.kind === 'demo') backend.discoverActiveRoom();
});

els.btnJoinDiscovered.addEventListener('click', () => {
  const code = els.btnJoinDiscovered.dataset.room || '';
  if (code) {
    els.joinCode.value = code;
    els.btnJoinGo.click();
  }
});

els.btnJoinGo.addEventListener('click', async () => {
  if (!backend) return;
  const code = els.joinCode.value.trim();
  if (!/^\d{6}$/.test(code)) {
    els.joinStatus.textContent = 'Введите ровно 6 цифр кода комнаты с Экрана.';
    return;
  }
  els.joinStatus.textContent = 'Подключаемся к комнате…';
  try {
    await backend.joinRoom(code);
    state.role = 'joy';
    state.room = code;
    els.cardJoy.classList.remove('hidden');
    els.joinStatus.textContent = `✅ В комнате ${code}. Запускаем прямое рукопожатие WebRTC…`;
    setupRtc('joy');
    bindJoyHandlers();
    await rtc.startHandshakeFromJoy();
    startJoyLoops();
    renderComparison();
  } catch (err) {
    els.joinStatus.textContent = '❌ ' + (err?.message || String(err));
  }
});

// ---------------------------------------------------------------- Настройка RtcDirectLink
function setupRtc(role) {
  if (rtc) rtc.destroy();
  rtc = new RtcDirectLink({
    role,
    signaling: backend,
    iceMode: els.iceMode.value,
    onFastMessage: (msg) => {
      if (role === 'host') onHostFastMessage(msg);
      else onJoyFastMessage(msg);
    },
    onCtrlMessage: (msg) => {
      if (role === 'host') onHostCtrlMessage(msg);
      else onJoyCtrlMessage(msg);
    },
    onStateChange: (snap) => {
      renderSteps(snap.steps);
      updateDropButtons(snap.simulatedDrop);
      renderComparison();
    },
  });
}

function updateDropButtons(dropped) {
  const label = dropped ? '🔌 Включить WebRTC обратно' : '🧪 Сымитировать обрыв WebRTC';
  els.btnHostDrop.textContent = label;
  els.btnHostDrop.setAttribute('aria-pressed', String(dropped));
  els.btnJoyDrop.textContent = label;
  els.btnJoyDrop.setAttribute('aria-pressed', String(dropped));
}

function toggleSimulatedDrop() {
  if (!rtc) return;
  rtc.setSimulatedDrop(!rtc.simulatedDrop);
}

els.btnHostDrop.addEventListener('click', toggleSimulatedDrop);
els.btnJoyDrop.addEventListener('click', toggleSimulatedDrop);

els.btnHostReconnect.addEventListener('click', () => {
  if (!rtc) return;
  rtc.setIceMode(els.iceMode.value);
  rtc.setSimulatedDrop(false);
});

els.btnJoyReconnect.addEventListener('click', () => {
  if (!rtc) return;
  rtc.setIceMode(els.iceMode.value);
  rtc.startHandshakeFromJoy();
});

// ---------------------------------------------------------------- Логика Экрана (Host)
function bindHostHandlers() {
  backend.handlers.cloudInput = (v, _lag) => {
    const fb = state.hostArena.fbCursor;
    fb.x = clamp(v.x, -1, 1);
    fb.y = clamp(v.y, -1, 1);
    fb.l = !!v.l;
    fb.r = !!v.r;
    fb.lastAt = performance.now();
  };

  backend.handlers.cloudPing = (v) => {
    if (v && v.id) backend.sendCloudPong(v.id);
  };

  backend.handlers.cloudCtrl = (msg) => {
    onHostCtrlMessage(msg);
  };
}

function onHostFastMessage(msg) {
  if (!msg) return;
  if (msg.k === 'ping') {
    rtc.sendFast({ k: 'pong', id: msg.id, t0: msg.t0 });
    return;
  }
  if (msg.k === 'in') {
    const c = state.hostArena.rtcCursor;
    c.x = clamp(msg.x, -1, 1);
    c.y = clamp(msg.y, -1, 1);
    c.l = !!msg.l;
    c.r = !!msg.r;
    c.lastAt = performance.now();
    c.trail.push({ x: c.x, y: c.y, at: c.lastAt });
    if (c.trail.length > 26) c.trail.shift();
  }
}

function onHostCtrlMessage(msg) {
  if (!msg) return;
  if (msg.cmd === 'peer-dropped' && rtc && !rtc.simulatedDrop) {
    rtc.setSimulatedDrop(true, { fromRemote: true });
    return;
  }
  if (msg.cmd === 'summary' && msg.data) {
    state.bench.remoteSummary = msg.data;
    renderComparison();
  }
}

function sendHapticToJoy(reason = 'manual') {
  const payload = { cmd: 'haptic', reason, hits: state.hostArena.target.hits, at: Date.now() };
  if (rtc && rtc.isOpen()) {
    rtc.sendCtrl({ ...payload, via: 'WebRTC' });
  } else if (backend) {
    backend.sendCloudCtrl('joy', { ...payload, via: 'Firebase' });
  }
}

els.btnHostHaptic.addEventListener('click', () => sendHapticToJoy('manual'));
els.btnTargetMove.addEventListener('click', () => {
  const tgt = state.hostArena.target;
  tgt.moving = !tgt.moving;
  els.btnTargetMove.setAttribute('aria-pressed', String(tgt.moving));
  els.btnTargetMove.textContent = tgt.moving ? '🎯 Движение мишени: Вкл' : '🎯 Движение мишени: Стоп';
});
els.driveMode.addEventListener('change', () => {
  state.driveMode = els.driveMode.value;
});

function computeActiveCursor(now) {
  const rtcC = state.hostArena.rtcCursor;
  const fbC = state.hostArena.fbCursor;
  const rtcFresh = rtc && rtc.isOpen() && now - rtcC.lastAt < 2500;
  const fbFresh = now - fbC.lastAt < 6000;

  if (state.driveMode === 'rtc') {
    state.activeSource = rtcFresh ? 'rtc' : 'none';
    return rtcFresh ? rtcC : null;
  }
  if (state.driveMode === 'fb') {
    state.activeSource = fbFresh ? 'fb' : 'none';
    return fbFresh ? fbC : null;
  }
  // auto: основной WebRTC -> бесшовный фолбэк на Firebase
  if (rtcFresh) {
    state.activeSource = 'rtc';
    return rtcC;
  }
  if (fbFresh) {
    state.activeSource = 'fb-fallback';
    return fbC;
  }
  state.activeSource = 'none';
  return null;
}

function startHostLoop() {
  const ctx = els.arenaCanvas.getContext('2d');
  let rafId = 0;

  const frame = (now) => {
    if (state.role !== 'host') return;
    const w = els.arenaCanvas.width;
    const h = els.arenaCanvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const scaleX = w * 0.43;
    const scaleY = h * 0.41;

    // 1. Движение мишени
    const tgt = state.hostArena.target;
    if (tgt.moving) {
      const t = now * 0.0011;
      tgt.x = Math.cos(t) * 0.58;
      tgt.y = Math.sin(t * 2) * 0.36;
    }

    // 2. Активный источник управления + проверка попадания в мишень
    const active = computeActiveCursor(now);
    els.viewLeft.classList.toggle('on', !!(active && active.l));
    els.viewRight.classList.toggle('on', !!(active && active.r));

    if (active) {
      const dx = active.x - tgt.x;
      const dy = active.y - tgt.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 0.16) {
        if (!tgt.inside && now - tgt.lastHitAt > 550) {
          tgt.inside = true;
          tgt.lastHitAt = now;
          tgt.hits++;
          tgt.flashUntil = now + 260;
          sendHapticToJoy('target-hit');
        }
      } else if (dist > 0.2) {
        tgt.inside = false;
      }
    }

    // 3. Отрисовка арены
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#091525';
    ctx.fillRect(0, 0, w, h);

    // Сетка радара
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.14)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx, 0); ctx.lineTo(cx, h);
    ctx.moveTo(0, cy); ctx.lineTo(w, cy);
    ctx.stroke();

    for (const r of [65, 130]) {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Мишень 🎯
    const tx = cx + tgt.x * scaleX;
    const ty = cy + tgt.y * scaleY;
    const hitFlash = now < tgt.flashUntil;
    ctx.save();
    ctx.beginPath();
    ctx.arc(tx, ty, hitFlash ? 30 : 24, 0, Math.PI * 2);
    ctx.fillStyle = hitFlash ? 'rgba(52, 211, 153, 0.35)' : 'rgba(244, 114, 182, 0.18)';
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = hitFlash ? '#34d399' : '#f472b6';
    ctx.setLineDash([6, 4]);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.arc(tx, ty, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#f472b6';
    ctx.fill();
    ctx.restore();

    // Курсор Firebase Облако (~6 Гц, пунктирный янтарный)
    const fbC = state.hostArena.fbCursor;
    if (now - fbC.lastAt < 6000) {
      const fx = cx + fbC.x * scaleX;
      const fy = cy + fbC.y * scaleY;
      ctx.save();
      ctx.beginPath();
      ctx.arc(fx, fy, 15, 0, Math.PI * 2);
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2.8;
      ctx.setLineDash([5, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = 'rgba(251, 191, 36, 0.22)';
      ctx.fill();
      ctx.restore();
    }

    // Курсор WebRTC (60 Гц, изумрудный лазер + шлейф)
    const rtcC = state.hostArena.rtcCursor;
    if (rtc && rtc.isOpen() && now - rtcC.lastAt < 2500) {
      if (rtcC.trail.length > 1) {
        ctx.save();
        for (let i = 1; i < rtcC.trail.length; i++) {
          const p0 = rtcC.trail[i - 1];
          const p1 = rtcC.trail[i];
          const age = now - p1.at;
          if (age > 450) continue;
          const alpha = Math.max(0.05, 0.55 * (1 - age / 450));
          ctx.strokeStyle = `rgba(52, 211, 153, ${alpha.toFixed(2)})`;
          ctx.lineWidth = 5 * (i / rtcC.trail.length);
          ctx.beginPath();
          ctx.moveTo(cx + p0.x * scaleX, cy + p0.y * scaleY);
          ctx.lineTo(cx + p1.x * scaleX, cy + p1.y * scaleY);
          ctx.stroke();
        }
        ctx.restore();
      }
      const rx = cx + rtcC.x * scaleX;
      const ry = cy + rtcC.y * scaleY;
      ctx.save();
      ctx.shadowColor = '#34d399';
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.arc(rx, ry, 10, 0, Math.PI * 2);
      ctx.fillStyle = '#34d399';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(rx, ry, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.restore();
    }

    // Счётчик попаданий в углу арены
    ctx.fillStyle = 'rgba(255, 255, 255, 0.82)';
    ctx.font = 'bold 13px Segoe UI, Arial, sans-serif';
    ctx.fillText(`🎯 Попаданий (с вибро): ${tgt.hits}`, 12, 22);

    // Обновление бейджей состояния на Экране
    updateHostPills(now);

    rafId = requestAnimationFrame(frame);
  };

  rafId = requestAnimationFrame(frame);
  return () => cancelAnimationFrame(rafId);
}

function updateHostPills(now) {
  const rtcOpen = rtc && rtc.isOpen();
  const fbFresh = now - state.hostArena.fbCursor.lastAt < 6000;

  els.pillRtc.className = 'pill ' + (rtcOpen ? 'rtc-ok' : (rtc?.status === 'blocked' || rtc?.simulatedDrop ? 'rtc-bad' : 'rtc-warn'));
  els.pillRtc.textContent = rtcOpen
    ? '⚡ WebRTC: открыт (60 Гц)'
    : rtc?.simulatedDrop
      ? '⚡ WebRTC: отключён (тест)'
      : rtc?.status === 'blocked'
        ? '⚡ WebRTC: закрыт VPN'
        : '⚡ WebRTC: ожидание…';

  els.pillFb.className = 'pill ' + (fbFresh ? 'rtc-ok' : '');
  els.pillFb.textContent = fbFresh ? '☁️ Облако: на связи' : '☁️ Облако: ожидание…';

  if (state.activeSource === 'rtc') {
    els.pillActive.className = 'pill rtc-ok';
    els.pillActive.textContent = 'Рулит: ⚡ WebRTC P2P';
  } else if (state.activeSource === 'fb-fallback') {
    els.pillActive.className = 'pill rtc-warn';
    els.pillActive.textContent = 'Рулит: 🛡 Авто-фолбэк Firebase!';
  } else if (state.activeSource === 'fb') {
    els.pillActive.className = 'pill rtc-warn';
    els.pillActive.textContent = 'Рулит: ☁️ Только Firebase';
  } else {
    els.pillActive.className = 'pill';
    els.pillActive.textContent = 'Рулит: ждём ввод';
  }
}

// ---------------------------------------------------------------- Логика Джойстика (Joy)
function bindJoyHandlers() {
  backend.handlers.cloudPong = (v) => {
    const pend = state.bench.pendingFbPing;
    if (!pend || !v || v.id !== pend.id) return;
    const rtt = Math.max(0, performance.now() - pend.t0);
    state.bench.pendingFbPing = null;
    state.bench.fbRtt.push(rtt);
    if (state.bench.fbRtt.length > 30) state.bench.fbRtt.shift();
    renderComparison();
  };

  backend.handlers.cloudCtrl = (msg) => {
    onJoyCtrlMessage(msg);
  };
}

function onJoyFastMessage(msg) {
  if (!msg) return;
  if (msg.k === 'pong') {
    const pend = state.bench.pendingRtcPing;
    if (!pend || msg.id !== pend.id) return;
    const rtt = Math.max(0, performance.now() - pend.t0);
    state.bench.pendingRtcPing = null;
    state.bench.rtcRtt.push(rtt);
    if (state.bench.rtcRtt.length > 30) state.bench.rtcRtt.shift();
    renderComparison();
  }
}

function onJoyCtrlMessage(msg) {
  if (!msg) return;
  if (msg.cmd === 'renegotiate' && rtc) {
    if (msg.iceMode) {
      els.iceMode.value = msg.iceMode;
      rtc.setIceMode(msg.iceMode);
    }
    rtc.startHandshakeFromJoy();
    return;
  }
  if (msg.cmd === 'peer-dropped' && rtc && !rtc.simulatedDrop) {
    rtc.setSimulatedDrop(true, { fromRemote: true });
    return;
  }
  if (msg.cmd === 'haptic') {
    state.joy.hapticReceived++;
    state.joy.lastHapticVia = msg.via || 'канал';
    try {
      if (navigator.vibrate) navigator.vibrate(35);
    } catch { /* ignore */ }
    els.hapticBanner.textContent =
      `📳 Вибро #${state.joy.hapticReceived} получено через ${state.joy.lastHapticVia}!`;
    els.hapticBanner.classList.add('flash');
    setTimeout(() => els.hapticBanner.classList.remove('flash'), 340);
  }
}

function updatePadThumb() {
  const px = 50 + state.joy.x * 42;
  const py = 50 + state.joy.y * 42;
  els.padThumb.style.left = `${px}%`;
  els.padThumb.style.top = `${py}%`;
  els.joyLeft.classList.toggle('on', state.joy.l);
  els.joyRight.classList.toggle('on', state.joy.r);
  els.joyLeft.setAttribute('aria-pressed', String(state.joy.l));
  els.joyRight.setAttribute('aria-pressed', String(state.joy.r));
}

function setPadFromPointerEvent(ev) {
  const rect = els.touchpad.getBoundingClientRect();
  if (!rect.width || !rect.height) return;
  const nx = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
  const ny = ((ev.clientY - rect.top) / rect.height) * 2 - 1;
  state.joy.x = clamp(nx, -1, 1);
  state.joy.y = clamp(ny, -1, 1);
  updatePadThumb();
}

els.touchpad.addEventListener('pointerdown', (ev) => {
  ev.preventDefault();
  state.joy.pointerDown = true;
  if (state.joy.autoOrbit) setAutoOrbit(false);
  try { els.touchpad.setPointerCapture(ev.pointerId); } catch { /* ignore */ }
  setPadFromPointerEvent(ev);
});
els.touchpad.addEventListener('pointermove', (ev) => {
  if (!state.joy.pointerDown) return;
  ev.preventDefault();
  setPadFromPointerEvent(ev);
});
const endPadDrag = () => { state.joy.pointerDown = false; };
els.touchpad.addEventListener('pointerup', endPadDrag);
els.touchpad.addEventListener('pointercancel', endPadDrag);
els.touchpad.addEventListener('lostpointercapture', endPadDrag);

function setAutoOrbit(on) {
  state.joy.autoOrbit = !!on;
  els.btnAutoOrbit.setAttribute('aria-pressed', String(state.joy.autoOrbit));
  els.btnAutoOrbit.textContent = state.joy.autoOrbit ? '🌀 Авто-круг 60 Гц: Вкл' : '🌀 Авто-круг 60 Гц: Выкл';
}

els.btnAutoOrbit.addEventListener('click', () => setAutoOrbit(!state.joy.autoOrbit));

// 3D-датчики наклона руки (симметрично по обеим сторонам телефона, без вырождения Эйлера)
function currentScreenAngle() {
  try {
    if (window.screen?.orientation && typeof window.screen.orientation.angle === 'number') {
      return window.screen.orientation.angle;
    }
    if (typeof window.orientation === 'number') return window.orientation;
  } catch { /* ignore */ }
  return 0;
}

function applySensorReading() {
  const j = state.joy;
  if (!j.gyroEnabled || j.pointerDown || j.autoOrbit) return;

  if (j.gyroMode === 'wand' && j.gyroRawAngles) {
    if (!j.gyroZeroQuat) {
      j.gyroZeroQuat = eulerZXYToQuat(j.gyroRawAngles.alpha, j.gyroRawAngles.beta, j.gyroRawAngles.gamma);
    }
    const res = handWandQuatToPad(
      j.gyroRawAngles.alpha,
      j.gyroRawAngles.beta,
      j.gyroRawAngles.gamma,
      j.gyroZeroQuat,
      { spanDeg: j.gyroSpanDeg, invertY: j.gyroInvertY }
    );
    j.x = res.x;
    j.y = res.y;
    els.padHint.textContent =
      `🔦 Указка 3D: вбок ${res.yawRightDeg >= 0 ? '+' : ''}${res.yawRightDeg}° · вверх/вниз ${res.pitchUpDeg >= 0 ? '+' : ''}${res.pitchUpDeg}°`;
    updatePadThumb();
    return;
  }

  if (j.gyroUpVec) {
    if (!j.gyroZeroUpVec) j.gyroZeroUpVec = { ...j.gyroUpVec };
    const res = upVectorToPad(j.gyroUpVec, j.gyroZeroUpVec, {
      spanDeg: j.gyroSpanDeg,
      invertY: j.gyroInvertY,
    });
    j.x = res.x;
    j.y = res.y;
    els.padHint.textContent =
      `📐 Наклон 3D: короткая грань ${res.tiltRightDeg >= 0 ? '+' : ''}${res.tiltRightDeg}° · длинная ${res.tiltUpDeg >= 0 ? '+' : ''}${res.tiltUpDeg}°`;
    updatePadThumb();
  }
}

function onDeviceOrientation(ev) {
  if (typeof ev.beta !== 'number' || typeof ev.gamma !== 'number') return;
  state.joy.hasOrientationEvents = true;
  state.joy.gyroRawAngles = {
    alpha: typeof ev.alpha === 'number' ? ev.alpha : 0,
    beta: ev.beta,
    gamma: ev.gamma,
  };
  state.joy.gyroUpVec = deviceUpVector(ev.beta, ev.gamma, currentScreenAngle());
  applySensorReading();
}

function onDeviceMotion(ev) {
  // Резервный источник 3D-гравитации, если браузер не шлёт beta/gamma
  if (state.joy.hasOrientationEvents) return;
  const a = ev.accelerationIncludingGravity;
  if (!a || typeof a.x !== 'number' || typeof a.y !== 'number' || typeof a.z !== 'number') return;
  state.joy.gyroUpVec = accelToUpVector(a.x, a.y, a.z, currentScreenAngle());
  applySensorReading();
}

function centerHandGrip() {
  const j = state.joy;
  j.gyroZeroUpVec = j.gyroUpVec ? { ...j.gyroUpVec } : null;
  j.gyroZeroQuat = j.gyroRawAngles
    ? eulerZXYToQuat(j.gyroRawAngles.alpha, j.gyroRawAngles.beta, j.gyroRawAngles.gamma)
    : null;
  j.x = 0;
  j.y = 0;
  updatePadThumb();
}

els.btnGyroToggle.addEventListener('click', async () => {
  if (state.joy.gyroEnabled) {
    state.joy.gyroEnabled = false;
    window.removeEventListener('deviceorientation', onDeviceOrientation);
    window.removeEventListener('devicemotion', onDeviceMotion);
    els.btnGyroToggle.setAttribute('aria-pressed', 'false');
    els.btnGyroToggle.textContent = '📱 Наклон руки (3D): Выкл';
    els.gyroControls.classList.add('hidden');
    els.padHint.textContent = 'Водите пальцем по кругу — на Экране увидите разницу 60 Гц vs 6 Гц!';
    return;
  }
  try {
    if (
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof DeviceOrientationEvent.requestPermission === 'function'
    ) {
      const perm = await DeviceOrientationEvent.requestPermission();
      if (perm !== 'granted') {
        els.padHint.textContent = 'Доступ к датчикам не выдан браузером — используйте тачпад пальцем.';
        return;
      }
    }
    if (
      typeof DeviceMotionEvent !== 'undefined' &&
      typeof DeviceMotionEvent.requestPermission === 'function'
    ) {
      try { await DeviceMotionEvent.requestPermission(); } catch { /* ignore */ }
    }
    state.joy.gyroZeroUpVec = null;
    state.joy.gyroZeroQuat = null;
    state.joy.hasOrientationEvents = false;
    state.joy.gyroEnabled = true;
    if (state.joy.autoOrbit) setAutoOrbit(false);
    window.addEventListener('deviceorientation', onDeviceOrientation);
    window.addEventListener('devicemotion', onDeviceMotion);
    els.btnGyroToggle.setAttribute('aria-pressed', 'true');
    els.btnGyroToggle.textContent = '📱 Наклон руки (3D): Вкл';
    els.gyroControls.classList.remove('hidden');
    els.padHint.textContent = 'Наклоняйте телефон в любую сторону — текущий хват взят за ноль!';
  } catch {
    els.padHint.textContent = 'Датчики недоступны в этом браузере — водите пальцем по тачпаду.';
  }
});

els.btnGyroCenter.addEventListener('click', centerHandGrip);
els.gyroMode.addEventListener('change', () => {
  state.joy.gyroMode = els.gyroMode.value;
  centerHandGrip();
});
els.gyroSpan.addEventListener('change', () => {
  state.joy.gyroSpanDeg = Number(els.gyroSpan.value) || 25;
  applySensorReading();
});
els.btnGyroInvert.addEventListener('click', () => {
  state.joy.gyroInvertY = !state.joy.gyroInvertY;
  els.btnGyroInvert.setAttribute('aria-pressed', String(state.joy.gyroInvertY));
  els.btnGyroInvert.textContent = state.joy.gyroInvertY
    ? '↕ Инверсия верх/низ: Вкл'
    : '↕ Инверсия верх/низ: Выкл';
  applySensorReading();
});
window.addEventListener('orientationchange', () => {
  if (state.joy.gyroEnabled) setTimeout(centerHandGrip, 150);
});

function bindSteerBtn(el, side) {
  const down = (e) => { e.preventDefault(); state.joy[side] = true; updatePadThumb(); };
  const up = (e) => { e.preventDefault(); state.joy[side] = false; updatePadThumb(); };
  el.addEventListener('pointerdown', down);
  el.addEventListener('pointerup', up);
  el.addEventListener('pointercancel', up);
  el.addEventListener('lostpointercapture', up);
  el.addEventListener('contextmenu', (e) => e.preventDefault());
}
bindSteerBtn(els.joyLeft, 'l');
bindSteerBtn(els.joyRight, 'r');

window.addEventListener('keydown', (e) => {
  if (state.role !== 'joy') return;
  if (e.key === 'ArrowLeft') { state.joy.l = true; updatePadThumb(); }
  if (e.key === 'ArrowRight') { state.joy.r = true; updatePadThumb(); }
});
window.addEventListener('keyup', (e) => {
  if (state.role !== 'joy') return;
  if (e.key === 'ArrowLeft') { state.joy.l = false; updatePadThumb(); }
  if (e.key === 'ArrowRight') { state.joy.r = false; updatePadThumb(); }
});

const resetButtonsSafe = () => {
  state.joy.pointerDown = false;
  if (state.joy.l || state.joy.r) {
    state.joy.l = false;
    state.joy.r = false;
    updatePadThumb();
  }
};
window.addEventListener('blur', resetButtonsSafe);
document.addEventListener('visibilitychange', () => {
  if (document.hidden) resetButtonsSafe();
});

function trimWindowHz(arr, now) {
  while (arr.length && now - arr[0] > 1000) arr.shift();
  return arr.length;
}

function startJoyLoops() {
  let lastRtcSent = { x: 99, y: 99, l: false, r: false, at: 0 };
  let lastCloudSent = { x: 99, y: 99, l: false, r: false, at: 0 };

  // 1) Контур 60 Гц (WebRTC + расчёт авто-круга + коалесцирование Firebase ~6 Гц)
  addTimer(setInterval(() => {
    if (state.role !== 'joy' || document.hidden) return;
    const now = performance.now();

    if (state.joy.autoOrbit && !state.joy.pointerDown) {
      const angle = now * 0.0026;
      state.joy.x = Number((Math.cos(angle) * 0.72).toFixed(3));
      state.joy.y = Number((Math.sin(angle) * 0.72).toFixed(3));
      updatePadThumb();
    }

    const j = state.joy;
    const movedRtc =
      Math.abs(j.x - lastRtcSent.x) > 0.0015 ||
      Math.abs(j.y - lastRtcSent.y) > 0.0015 ||
      j.l !== lastRtcSent.l ||
      j.r !== lastRtcSent.r;

    if (rtc && rtc.isOpen() && (movedRtc || now - lastRtcSent.at >= 450)) {
      const ok = rtc.sendFast({
        k: 'in',
        seq: ++j.seq,
        x: Number(j.x.toFixed(3)),
        y: Number(j.y.toFixed(3)),
        l: j.l ? 1 : 0,
        r: j.r ? 1 : 0,
      });
      if (ok) {
        lastRtcSent = { x: j.x, y: j.y, l: j.l, r: j.r, at: now };
        state.bench.rtcOutTimestamps.push(now);
      }
    }

    const movedCloud =
      Math.abs(j.x - lastCloudSent.x) > 0.004 ||
      Math.abs(j.y - lastCloudSent.y) > 0.004 ||
      j.l !== lastCloudSent.l ||
      j.r !== lastCloudSent.r;

    if (
      backend &&
      ((movedCloud && now - lastCloudSent.at >= CLOUD_SEND_INTERVAL_MS) ||
        now - lastCloudSent.at >= CLOUD_HEARTBEAT_MS)
    ) {
      backend.sendCloudInput({
        seq: ++j.seq,
        x: Number(j.x.toFixed(3)),
        y: Number(j.y.toFixed(3)),
        l: j.l ? 1 : 0,
        r: j.r ? 1 : 0,
      });
      lastCloudSent = { x: j.x, y: j.y, l: j.l, r: j.r, at: now };
      state.bench.fbOutTimestamps.push(now);
    }

    state.bench.rtcHz = trimWindowHz(state.bench.rtcOutTimestamps, now);
    state.bench.fbHz = trimWindowHz(state.bench.fbOutTimestamps, now);
  }, RTC_TICK_MS));

  // 2) Пинг-понг WebRTC (каждые 600 мс)
  addTimer(setInterval(() => {
    if (state.role !== 'joy' || document.hidden || !rtc || !rtc.isOpen()) return;
    const id = ++state.bench.pingSeq;
    const t0 = performance.now();
    state.bench.pendingRtcPing = { id, t0 };
    rtc.sendFast({ k: 'ping', id, t0 });
  }, 600));

  // 3) Пинг-понг Firebase Облако (каждые 1400 мс)
  addTimer(setInterval(() => {
    if (state.role !== 'joy' || document.hidden || !backend) return;
    const id = ++state.bench.pingSeq;
    state.bench.pendingFbPing = { id, t0: performance.now() };
    backend.sendCloudPing(id);
  }, 1400));

  // 4) Отправка сводной таблицы на Экран (раз в 1.1 с), чтобы оба телефона видели одни цифры
  addTimer(setInterval(() => {
    if (state.role !== 'joy' || !backend) return;
    const summary = buildLocalStatsSummary();
    if (rtc && rtc.isOpen()) {
      rtc.sendCtrl({ cmd: 'summary', data: summary });
    } else {
      backend.sendCloudCtrl('host', { cmd: 'summary', data: summary });
    }
    renderComparison();
  }, 1100));
}

// ---------------------------------------------------------------- Сводная таблица и Вердикт
function buildLocalStatsSummary() {
  const rtcMedRtt = median(state.bench.rtcRtt);
  const rtcP95Rtt = p95(state.bench.rtcRtt);
  const rtcJit = jitterOneWay(state.bench.rtcRtt);

  const fbMedRtt = median(state.bench.fbRtt);
  const fbP95Rtt = p95(state.bench.fbRtt);
  const fbJit = jitterOneWay(state.bench.fbRtt);

  return {
    rtcN: state.bench.rtcRtt.length,
    rtcOneWayMed: rtcMedRtt === null ? null : rtcMedRtt / 2,
    rtcOneWayP95: rtcP95Rtt === null ? null : rtcP95Rtt / 2,
    rtcJitter: rtcJit,
    rtcHz: state.bench.rtcHz,
    rtcPkts: rtc ? rtc.sentPackets : 0,
    rtcBytes: rtc ? rtc.sentBytes : 0,

    fbN: state.bench.fbRtt.length,
    fbOneWayMed: fbMedRtt === null ? null : fbMedRtt / 2,
    fbOneWayP95: fbP95Rtt === null ? null : fbP95Rtt / 2,
    fbJitter: fbJit,
    fbHz: state.bench.fbHz,
    fbPkts: backend ? backend.metrics.streamWrites : 0,
    fbBytes: backend ? backend.metrics.sentBytes : 0,

    signalDbWrites: backend ? backend.metrics.signalWrites : 0,
    streamDbWrites: backend ? backend.metrics.streamWrites : 0,
  };
}

const fmtMs = (v) => (typeof v === 'number' ? `${Math.max(1, Math.round(v))} мс` : '—');

function renderComparison() {
  const rtcSnap = rtc ? rtc.getSnapshot() : null;
  if (rtcSnap) {
    els.routeBadge.textContent = rtcSnap.route.badgeText;
    els.routeDetail.textContent = rtcSnap.route.detailText;
  }

  if (state.role === 'joy' && rtcSnap) {
    els.joyPillRtc.className =
      'pill ' + (rtcSnap.status === 'open' ? 'rtc-ok' : rtcSnap.status === 'blocked' || rtcSnap.simulatedDrop ? 'rtc-bad' : 'rtc-warn');
    els.joyPillRtc.textContent =
      rtcSnap.status === 'open'
        ? '⚡ WebRTC: прямая труба открыта!'
        : rtcSnap.simulatedDrop
          ? '⚡ WebRTC: отключён (тест фолбэка)'
          : rtcSnap.status === 'blocked'
            ? '⚡ WebRTC: закрыт VPN (работает фолбэк)'
            : '⚡ WebRTC: знакомство…';
  }

  const s = state.role === 'host' && state.bench.remoteSummary
    ? state.bench.remoteSummary
    : buildLocalStatsSummary();

  const rtcStateText = !rtcSnap
    ? '—'
    : rtcSnap.status === 'open'
      ? '🟢 Открыт (UDP)'
      : rtcSnap.simulatedDrop
        ? '🧪 Отключён'
        : rtcSnap.status === 'blocked'
          ? '🔴 Закрыт VPN'
          : '⏳ Соединение…';

  const fbStateText = !backend
    ? '—'
    : backend.kind === 'demo'
      ? `🟢 Демо (${backend.cloudOneWayMs} мс)`
      : '🟢 Активен';

  els.cmpRtcState.textContent = rtcStateText;
  els.cmpFbState.textContent = fbStateText;
  els.cmpRtcMed.textContent = fmtMs(s.rtcOneWayMed);
  els.cmpFbMed.textContent = fmtMs(s.fbOneWayMed);
  els.cmpRtcP95.textContent = fmtMs(s.rtcOneWayP95);
  els.cmpFbP95.textContent = fmtMs(s.fbOneWayP95);
  els.cmpRtcJit.textContent = fmtMs(s.rtcJitter);
  els.cmpFbJit.textContent = fmtMs(s.fbJitter);
  els.cmpRtcHz.textContent = `${s.rtcHz || 0} Гц`;
  els.cmpFbHz.textContent = `${s.fbHz || 0} Гц`;
  els.cmpRtcPkts.textContent = String(s.rtcPkts || 0);
  els.cmpFbPkts.textContent = String(s.fbPkts || 0);
  els.cmpRtcBytes.textContent = fmtBytes(s.rtcBytes || 0);
  els.cmpFbBytes.textContent = fmtBytes(s.fbBytes || 0);

  const sigW = (s.signalDbWrites || 0) + (state.role === 'host' && backend ? backend.metrics.signalWrites : 0);
  els.cmpRtcDbw.textContent = `${sigW} шт. (только старт!)`;
  els.cmpFbDbw.textContent = `${s.streamDbWrites || 0} шт. (растёт)`;

  renderVerdict(s, rtcSnap);
}

function renderVerdict(s, rtcSnap) {
  const v = els.verdict;
  if (!rtcSnap || (s.rtcN < 3 && s.fbN < 3 && rtcSnap.status !== 'blocked' && !rtcSnap.simulatedDrop)) {
    v.className = 'verdict idle';
    v.textContent = 'Соберите хотя бы 3 замера после входа в комнату — здесь появится понятный инженерный вывод.';
    return;
  }

  if (rtcSnap.simulatedDrop) {
    v.className = 'verdict mid';
    v.textContent =
      `🧪 Режим проверки обрыва: прямая труба WebRTC выключена вручную, но прицел не умер — его подхватил запасной канал Firebase (${fmtMs(s.fbOneWayMed)})! Нажмите «Включить WebRTC обратно», чтобы вернуть 60 Гц.`;
    return;
  }

  if (rtcSnap.status === 'blocked') {
    v.className = 'verdict bad';
    v.textContent =
      `🛡 Прямой WebRTC не пробил текущий VPN, но двухрельсовая защита сработала: управление живо через Firebase (${fmtMs(s.fbOneWayMed)}). Чтобы пробить прямой канал ~5 мс дома — включите «Доступ к локальной сети (LAN bypass)» в VPN и нажмите «Пересобрать WebRTC».`;
    return;
  }

  if (rtcSnap.status === 'open' && typeof s.rtcOneWayMed === 'number') {
    const rtcMs = Math.max(1, Math.round(s.rtcOneWayMed));
    const fbMs = typeof s.fbOneWayMed === 'number' ? Math.max(1, Math.round(s.fbOneWayMed)) : null;
    const speedup = fbMs && rtcMs > 0 ? (fbMs / rtcMs).toFixed(1) : null;
    v.className = 'verdict good';
    v.textContent = speedup && fbMs > rtcMs + 8
      ? `🚀 Победа прямого канала! WebRTC даёт ≈ ${rtcMs} мс против ≈ ${fbMs} мс у облака (быстрее в ${speedup}×) и держит плавные 60 Гц при 0 новых записей в базу Firebase. Готово для 3D-указки, гироскопа руки и мгновенного вибро!`
      : `✅ Прямая UDP-труба WebRTC работает (≈ ${rtcMs} мс в одну сторону, 0 записей в БД во время игры). Поводите пальцем по тачпаду или включите «🌀 Авто-круг 60 Гц», чтобы увидеть разницу плавности двух прицелов!`;
  }
}

// ---------------------------------------------------------------- QA Bridge (для автотестов)
window.__WEBRTC_STAND__ = {
  demo: (cloudDelayMs = 140) => {
    els.demoDelay.value = String(cloudDelayMs);
    els.btnDemo.click();
    if (backend && backend.kind === 'demo') backend.setCloudDelayMs(cloudDelayMs);
  },
  host: () => els.btnHost.click(),
  join: (code) => {
    els.joinCode.value = String(code);
    els.btnJoinGo.click();
  },
  room: () => state.room,
  setPad: (x, y) => {
    state.joy.x = clamp(x, -1, 1);
    state.joy.y = clamp(y, -1, 1);
    updatePadThumb();
  },
  setSteer: (l, r) => {
    state.joy.l = !!l;
    state.joy.r = !!r;
    updatePadThumb();
  },
  setAutoOrbit: (on) => setAutoOrbit(on),
  setDriveMode: (mode) => {
    els.driveMode.value = mode;
    state.driveMode = mode;
  },
  setTargetMove: (moving) => {
    state.hostArena.target.moving = !!moving;
  },
  setTargetPos: (x, y) => {
    state.hostArena.target.moving = false;
    state.hostArena.target.x = x;
    state.hostArena.target.y = y;
  },
  triggerHaptic: () => sendHapticToJoy('qa'),
  setSimulatedDrop: (dropped) => rtc && rtc.setSimulatedDrop(dropped),
  reconnectRtc: () => {
    if (state.role === 'joy') els.btnJoyReconnect.click();
    else els.btnHostReconnect.click();
  },
  snapshot: () => ({
    role: state.role,
    room: state.room,
    activeSource: state.activeSource,
    rtc: rtc ? rtc.getSnapshot() : null,
    joy: { ...state.joy },
    hostArena: {
      rtcCursor: { ...state.hostArena.rtcCursor, trailLen: state.hostArena.rtcCursor.trail.length },
      fbCursor: { ...state.hostArena.fbCursor },
      target: { ...state.hostArena.target },
    },
    stats: state.role === 'host' && state.bench.remoteSummary
      ? state.bench.remoteSummary
      : buildLocalStatsSummary(),
    verdict: els.verdict.textContent,
  }),
};
