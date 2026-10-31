// «Кубик-картинка»: образец → сборка из настоящих кубиков → фото → проверка → оживление.
import { PALETTE, PICTURES, PLAY_COLORS, grid } from './pictures.js';
import { analyze } from './vision.js';
import { drawPicture, drawInventory, drawCube, layoutPicture, roundRect, star } from './draw.js';
import { drawAnimation, drawConfetti } from './anim.js';
import { sfx, unlockAudio, suspendAudio, setSoundEnabled } from './sound.js';
import { ICONS } from './icons.js';

const $ = (id) => document.getElementById(id);
const DPR = () => Math.min(2, window.devicePixelRatio || 1);
const CROP = 360; // сторона кадра для анализа (рамка + поле вокруг)
const MARGIN = 0.14; // поле вокруг рамки (доля стороны рамки) — по нему оценивается фон

// ------------------------------------------------------------ прогресс
const STORE = 'cube-picture-v1';
let progress = { done: [], sound: true };
try {
  progress = { ...progress, ...JSON.parse(localStorage.getItem(STORE) || '{}') };
} catch {
  /* приватный режим — живём без сохранения */
}
const save = () => {
  try {
    localStorage.setItem(STORE, JSON.stringify(progress));
  } catch {
    /* ignore */
  }
};
setSoundEnabled(progress.sound);

// ------------------------------------------------------------ состояние
const state = {
  screen: 'map',
  index: 0,
  result: null, // результат последней проверки
  mode: null, // checking | success | fail
  modeStart: 0,
  photo: null, // canvas снимка CROP×CROP
  camera: 'off', // off | starting | live | fallback
  frozenTime: null, // для скриншотов в тестах
};
const picture = () => PICTURES[state.index];

document.querySelectorAll('[data-icon]').forEach((el) => (el.innerHTML = ICONS[el.dataset.icon]));

function fitCanvas(canvas) {
  const r = canvas.getBoundingClientRect();
  const dpr = DPR();
  const w = Math.max(1, Math.round(r.width * dpr));
  const h = Math.max(1, Math.round(r.height * dpr));
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w;
    canvas.height = h;
  }
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, W: r.width, H: r.height };
}

function go(screen) {
  if (state.screen === 'camera' && screen !== 'camera') stopCamera();
  state.screen = screen;
  document.querySelectorAll('.screen').forEach((s) => s.classList.toggle('active', s.id === 'scr-' + screen));
  if (screen === 'map') renderMap();
  if (screen === 'task') renderTask();
  if (screen === 'camera') startCamera();
  loop();
}

document.addEventListener('pointerdown', unlockAudio, { capture: true });
document.querySelectorAll('[data-go]').forEach((b) =>
  b.addEventListener('click', () => {
    sfx.tap();
    go(b.dataset.go);
  }),
);

// ------------------------------------------------------------ карта
function renderLogo() {
  const { ctx, W, H } = fitCanvas($('logo'));
  ctx.clearRect(0, 0, W, H);
  const keys = PLAY_COLORS;
  const s = Math.min(H * 0.62, W / 7.5);
  keys.forEach((k, i) => drawCube(ctx, s * 0.7 + i * s * 1.12, H / 2 + (i % 2 ? -s * 0.15 : s * 0.15), s, k, { rot: (i % 2 ? 1 : -1) * 0.12 }));
}

function renderMap() {
  renderLogo();
  const wrap = $('cards');
  const nextIdx = PICTURES.findIndex((p) => !progress.done.includes(p.id));
  if (!wrap.children.length) {
    PICTURES.forEach((p, i) => {
      const b = document.createElement('button');
      b.className = 'card';
      b.setAttribute('aria-label', `Картинка ${i + 1}`);
      b.dataset.index = i;
      b.innerHTML = '<canvas></canvas><canvas class="badge"></canvas>';
      b.addEventListener('click', () => {
        sfx.tap();
        state.index = i;
        go('task');
      });
      wrap.appendChild(b);
    });
  }
  [...wrap.children].forEach((b, i) => {
    const p = PICTURES[i];
    const done = progress.done.includes(p.id);
    b.classList.toggle('next', i === nextIdx);
    b.classList.toggle('done', done);
    const [cv, badge] = b.querySelectorAll('canvas');
    const { ctx, W, H } = fitCanvas(cv);
    ctx.clearRect(0, 0, W, H);
    drawPicture(ctx, p, W * 0.1, H * 0.1, W * 0.8, H * 0.8, { maxCube: W * 0.24 });
    const bb = fitCanvas(badge);
    bb.ctx.clearRect(0, 0, bb.W, bb.H);
    if (done) star(bb.ctx, bb.W / 2, bb.H / 2, bb.W * 0.45);
    else star(bb.ctx, bb.W / 2, bb.H / 2, bb.W * 0.42, '#efe8f7', '#ddd2ea');
  });
}

// ------------------------------------------------------------ образец
function renderTask() {
  const p = picture();
  const { ctx, W, H } = fitCanvas($('taskCanvas'));
  ctx.clearRect(0, 0, W, H);
  drawPicture(ctx, p, W * 0.08, H * 0.08, W * 0.84, H * 0.84, { grid: true, maxCube: W * 0.26 });
  const inv = fitCanvas($('invCanvas'));
  inv.ctx.clearRect(0, 0, inv.W, inv.H);
  drawInventory(inv.ctx, p, 0, 0, inv.W, inv.H);
}

$('btnCamera').addEventListener('click', () => {
  sfx.tap();
  go('camera');
});

// ------------------------------------------------------------ камера
const video = $('video');
let stream = null;
let liveTimer = 0;
let liveResult = null;
const liveCanvas = document.createElement('canvas');
liveCanvas.width = liveCanvas.height = 120;

function guideRect() {
  const r = $('scr-camera').getBoundingClientRect();
  const size = Math.min(r.width * 0.8, r.height * 0.52);
  return { x: (r.width - size) / 2, y: r.height * 0.46 - size / 2, size, W: r.width, H: r.height };
}

async function startCamera() {
  renderCamSample();
  drawGuide();
  if (stream) return;
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return cameraFallback();
  state.camera = 'starting';
  $('btnShutter').disabled = true;
  try {
    const s = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 960 } },
      audio: false,
    });
    if (state.screen !== 'camera' || document.hidden) {
      s.getTracks().forEach((t) => t.stop());
      state.camera = 'off';
      return;
    }
    stream = s;
    video.srcObject = s;
    await video.play().catch(() => {});
    state.camera = 'live';
    $('btnShutter').disabled = false;
    $('btnGallery').classList.remove('attention');
    clearInterval(liveTimer);
    liveTimer = setInterval(liveCheck, 350);
  } catch (e) {
    cameraFallback();
  }
}

function cameraFallback() {
  state.camera = 'fallback';
  $('btnShutter').disabled = true;
  $('btnGallery').classList.add('attention');
  drawGuide();
}

function stopCamera() {
  clearInterval(liveTimer);
  liveResult = null;
  if (stream) stream.getTracks().forEach((t) => t.stop());
  stream = null;
  video.srcObject = null;
  state.camera = 'off';
  $('btnShutter').classList.remove('ready');
}

/** Переносит область «рамка + поле» из видео в canvas size×size. */
function grabFrame(size, target) {
  const vw = video.videoWidth;
  const vh = video.videoHeight;
  if (!vw || !vh) return null;
  const g = guideRect();
  const scale = Math.max(g.W / vw, g.H / vh);
  const offX = (g.W - vw * scale) / 2;
  const offY = (g.H - vh * scale) / 2;
  const m = g.size * MARGIN;
  const sx = (g.x - m - offX) / scale;
  const sy = (g.y - m - offY) / scale;
  const ss = (g.size + 2 * m) / scale;
  const c = target || document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d', { willReadFrequently: true });
  ctx.fillStyle = '#888';
  ctx.fillRect(0, 0, size, size);
  ctx.drawImage(video, sx, sy, ss, ss, 0, 0, size, size);
  return c;
}

function liveCheck() {
  if (state.screen !== 'camera' || !stream || document.hidden) return;
  const c = grabFrame(120, liveCanvas);
  if (!c) return;
  const img = c.getContext('2d', { willReadFrequently: true }).getImageData(0, 0, 120, 120);
  liveResult = analyze(img, grid(picture()), PALETTE, { work: 120 });
  $('btnShutter').classList.toggle('ready', !!liveResult.ok);
  drawGuide();
}

function drawGuide() {
  const { ctx, W, H } = fitCanvas($('guide'));
  ctx.clearRect(0, 0, W, H);
  const g = guideRect();
  // Затемнение вокруг рамки.
  ctx.fillStyle = 'rgba(0,0,0,0.42)';
  ctx.fillRect(0, 0, W, H);
  ctx.save();
  ctx.globalCompositeOperation = 'destination-out';
  roundRect(ctx, g.x, g.y, g.size, g.size, 22);
  ctx.fill();
  ctx.restore();
  // Уголки.
  const ok = liveResult && liveResult.ok;
  ctx.strokeStyle = ok ? '#5dff7e' : '#fff';
  ctx.lineWidth = 7;
  ctx.lineCap = 'round';
  const L = g.size * 0.16;
  for (const [cx, cy, dx, dy] of [
    [g.x, g.y, 1, 1], [g.x + g.size, g.y, -1, 1], [g.x, g.y + g.size, 1, -1], [g.x + g.size, g.y + g.size, -1, -1],
  ]) {
    ctx.beginPath();
    ctx.moveTo(cx, cy + dy * L);
    ctx.lineTo(cx, cy);
    ctx.lineTo(cx + dx * L, cy);
    ctx.stroke();
  }
  // Что видит игра: рамка найденных кубиков.
  if (liveResult && liveResult.frame && liveResult.reason !== 'empty') {
    const m = g.size * MARGIN;
    const k = (g.size + 2 * m) / 120;
    ctx.strokeStyle = ok ? '#5dff7e' : 'rgba(255,230,90,0.9)';
    ctx.lineWidth = 3;
    ctx.setLineDash(ok ? [] : [10, 8]);
    ctx.beginPath();
    liveResult.frame.forEach(([x, y], i) => ctx[i ? 'lineTo' : 'moveTo'](g.x - m + x * k, g.y - m + y * k));
    ctx.closePath();
    ctx.stroke();
    ctx.setLineDash([]);
  }
  if (state.camera === 'fallback') {
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    roundRect(ctx, g.x, g.y, g.size, g.size, 22);
    ctx.fill();
    drawCube(ctx, g.x + g.size / 2, g.y + g.size / 2, g.size * 0.22, 'P', { dim: 0.5 });
  }
}

function renderCamSample() {
  const { ctx, W, H } = fitCanvas($('camSample'));
  ctx.clearRect(0, 0, W, H);
  drawPicture(ctx, picture(), 8, 8, W - 16, H - 16);
}

$('btnShutter').addEventListener('click', () => {
  const c = grabFrame(CROP);
  if (!c) return;
  sfx.shutter();
  flash();
  stopCamera();
  checkPhoto(c);
});

$('btnGallery').addEventListener('click', () => {
  sfx.tap();
  $('fileInput').click();
});

$('fileInput').addEventListener('change', async (e) => {
  const file = e.target.files && e.target.files[0];
  e.target.value = '';
  if (!file) return;
  const url = URL.createObjectURL(file);
  const img = new Image();
  img.onload = () => {
    // Центральный квадрат фото = рамка с полем.
    const side = Math.min(img.naturalWidth, img.naturalHeight);
    const c = document.createElement('canvas');
    c.width = c.height = CROP;
    c.getContext('2d', { willReadFrequently: true }).drawImage(
      img, (img.naturalWidth - side) / 2, (img.naturalHeight - side) / 2, side, side, 0, 0, CROP, CROP,
    );
    URL.revokeObjectURL(url);
    stopCamera();
    checkPhoto(c);
  };
  img.src = url;
});

function flash() {
  const f = document.createElement('div');
  f.style.cssText = 'position:fixed;inset:0;background:#fff;z-index:20;pointer-events:none;transition:opacity .35s';
  document.body.appendChild(f);
  requestAnimationFrame(() => {
    f.style.opacity = '0';
    setTimeout(() => f.remove(), 400);
  });
}

// ------------------------------------------------------------ проверка
const CHECK_TIME = 1.0;

function checkPhoto(canvas) {
  const img = canvas.getContext('2d', { willReadFrequently: true }).getImageData(0, 0, canvas.width, canvas.height);
  const res = analyze(img, grid(picture()), PALETTE);
  state.photo = canvas;
  state.result = res;
  setMode('checking');
  sfx.scan();
  go('result');
  return summary(res);
}

function summary(res) {
  return {
    ok: res.ok,
    reason: res.reason,
    rotation: res.rotation,
    mismatches: res.mismatches.map((m) => ({ src: m.src, want: m.want, got: m.got })),
    found: res.found,
    expected: res.expected,
  };
}

function setMode(mode) {
  state.mode = mode;
  state.modeStart = performance.now();
  const box = $('resultActions');
  box.innerHTML = '';
  const add = (icon, label, fn, primary) => {
    const b = document.createElement('button');
    b.className = 'icon-btn appear' + (primary ? ' primary' : '');
    b.setAttribute('aria-label', label);
    b.dataset.action = icon;
    b.innerHTML = `<span data-icon="${icon}">${ICONS[icon]}</span>`;
    b.style.animationDelay = `${box.children.length * 0.08}s`;
    b.addEventListener('click', () => {
      sfx.tap();
      fn();
    });
    box.appendChild(b);
  };
  if (mode === 'success') {
    add('map', 'Все картинки', () => go('map'));
    add('replay', 'Ещё раз', () => go('task'));
    if (state.index < PICTURES.length - 1) {
      add('play', 'Следующая', () => {
        state.index += 1;
        go('task');
      }, true);
    }
  } else if (mode === 'fail') {
    add('eye', 'Посмотреть образец', () => go('task'));
    add('camera', 'Сфотографировать ещё раз', () => go('camera'), true);
  }
}

function onCheckDone() {
  const res = state.result;
  if (res.ok) {
    setMode('success');
    sfx.success();
    const id = picture().id;
    if (!progress.done.includes(id)) {
      progress.done.push(id);
      save();
      setTimeout(() => sfx.star(), 900);
    }
  } else {
    setMode('fail');
    sfx.almost();
  }
}

// ------------------------------------------------------------ отрисовка результата
function drawPhoto(ctx, x, y, size, t) {
  ctx.save();
  roundRect(ctx, x, y, size, size, 22);
  ctx.clip();
  ctx.drawImage(state.photo, x, y, size, size);
  ctx.restore();
  const k = size / CROP;
  const res = state.result;
  const pulse = 0.5 + 0.5 * Math.sin(t * 6);
  for (const cell of res.cells) {
    const pts = cell.corners.map(([px, py]) => [x + px * k, y + py * k]);
    const cx = pts.reduce((s, p) => s + p[0], 0) / 4;
    const cy = pts.reduce((s, p) => s + p[1], 0) / 4;
    const cs = Math.hypot(pts[1][0] - pts[0][0], pts[1][1] - pts[0][1]);
    if (state.mode === 'checking') continue;
    if (cell.ok) {
      if (!cell.want) continue;
      ctx.strokeStyle = 'rgba(70,230,110,0.95)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      pts.forEach(([px, py], i) => ctx[i ? 'lineTo' : 'moveTo'](px, py));
      ctx.closePath();
      ctx.stroke();
    } else {
      ctx.strokeStyle = `rgba(255,60,80,${0.6 + 0.4 * pulse})`;
      ctx.lineWidth = 5 + 3 * pulse;
      ctx.beginPath();
      ctx.arc(cx, cy, cs * (0.55 + 0.08 * pulse), 0, Math.PI * 2);
      ctx.stroke();
      // Какой цвет нужен — маленький кубик в углу клетки (или «пусто»).
      if (cell.want) drawCube(ctx, cx + cs * 0.42, cy - cs * 0.42, cs * 0.42, cell.want);
      else {
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(cx - cs * 0.2, cy - cs * 0.2);
        ctx.lineTo(cx + cs * 0.2, cy + cs * 0.2);
        ctx.moveTo(cx + cs * 0.2, cy - cs * 0.2);
        ctx.lineTo(cx - cs * 0.2, cy + cs * 0.2);
        ctx.stroke();
      }
    }
  }
  if (state.mode !== 'checking' && res.frame && (res.reason === 'shape')) {
    ctx.strokeStyle = 'rgba(255,200,60,0.95)';
    ctx.lineWidth = 4;
    ctx.setLineDash([10, 8]);
    ctx.beginPath();
    res.frame.forEach(([px, py], i) => ctx[i ? 'lineTo' : 'moveTo'](x + px * k, y + py * k));
    ctx.closePath();
    ctx.stroke();
    ctx.setLineDash([]);
  }
}

function drawResult(t) {
  const { ctx, W, H } = fitCanvas($('resultCanvas'));
  ctx.clearRect(0, 0, W, H);
  const p = picture();
  if (state.mode === 'checking') {
    const size = Math.min(W * 0.96, H * 0.8);
    const x = (W - size) / 2;
    const y = (H - size) / 2;
    drawPhoto(ctx, x, y, size, t);
    const sy = y + size * ((t / CHECK_TIME) % 1);
    const g = ctx.createLinearGradient(0, sy - 40, 0, sy);
    g.addColorStop(0, 'rgba(124,77,255,0)');
    g.addColorStop(1, 'rgba(124,77,255,0.55)');
    ctx.fillStyle = g;
    ctx.fillRect(x, sy - 40, size, 40);
    ctx.fillStyle = '#b9a3ff';
    ctx.fillRect(x, sy - 2, size, 4);
    if (t >= CHECK_TIME && state.frozenTime == null) onCheckDone();
    return;
  }
  if (state.mode === 'success') {
    ctx.save();
    roundRect(ctx, 0, 0, W, H, 28);
    ctx.clip();
    drawAnimation(ctx, W, H, t, p);
    drawConfetti(ctx, W, H, t);
    ctx.restore();
    // Звезда прилетает в угол.
    const k = Math.min(1, t / 0.8);
    const R = W * 0.07 * (1 + 0.6 * Math.sin(k * Math.PI));
    star(ctx, W - W * 0.1, H * 0.08, R);
    return;
  }
  if (state.mode === 'fail') {
    const size = Math.min(W * 0.92, H * 0.56);
    const x = (W - size) / 2;
    drawPhoto(ctx, x, 4, size, t);
    // Образец снизу, неверные клетки подсвечены.
    const top = size + 16;
    const boxH = H - top - 4;
    ctx.fillStyle = '#fffdf8';
    roundRect(ctx, W * 0.04, top, W * 0.92, boxH, 24);
    ctx.fill();
    ctx.strokeStyle = '#f1e6d6';
    ctx.lineWidth = 3;
    ctx.stroke();
    const L = layoutPicture(p, W * 0.1, top + boxH * 0.08, W * 0.8, boxH * 0.84, W * 0.2);
    const wrong = new Set(state.result.mismatches.map((m) => m.src.join(',')));
    const allWrong = state.result.reason === 'empty' || state.result.reason === 'shape';
    const pulse = 0.5 + 0.5 * Math.sin(t * 6);
    drawPicture(ctx, p, W * 0.1, top + boxH * 0.08, W * 0.8, boxH * 0.84, {
      maxCube: W * 0.2,
      grid: true,
      cubeOpts: (cube) => (allWrong ? { sx: 1 + 0.06 * pulse, sy: 1 + 0.06 * pulse } : {}),
    });
    for (const key of wrong) {
      const [r, c] = key.split(',').map(Number);
      const [cx, cy] = L.at(r, c);
      ctx.strokeStyle = `rgba(255,60,80,${0.6 + 0.4 * pulse})`;
      ctx.lineWidth = 4 + 3 * pulse;
      ctx.beginPath();
      ctx.arc(cx, cy, L.s * (0.62 + 0.08 * pulse), 0, Math.PI * 2);
      ctx.stroke();
    }
  }
}

// ------------------------------------------------------------ цикл кадров
let raf = 0;
function frame() {
  raf = 0;
  if (document.hidden) return;
  if (state.screen === 'result') {
    // В замороженном кадре (скриншоты тестов) не перерисовываем.
    if (state.frozenTime == null) drawResult((performance.now() - state.modeStart) / 1000);
    raf = requestAnimationFrame(frame);
  }
}
function loop() {
  if (!raf && state.screen === 'result') raf = requestAnimationFrame(frame);
}

// Пауза при сворачивании: останавливаем камеру, анимацию и звук.
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    if (state.screen === 'camera') stopCamera();
    suspendAudio();
  } else {
    if (state.screen === 'camera') startCamera();
    loop();
  }
});

let resizeT = 0;
window.addEventListener('resize', () => {
  clearTimeout(resizeT);
  resizeT = setTimeout(() => {
    if (state.screen === 'map') renderMap();
    if (state.screen === 'task') renderTask();
    if (state.screen === 'camera') {
      renderCamSample();
      drawGuide();
    }
  }, 80);
});

// ------------------------------------------------------------ меню взрослых
(() => {
  const btn = $('btnAdult');
  let timer = 0;
  const cancel = () => {
    clearTimeout(timer);
    btn.classList.remove('holding');
  };
  btn.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    btn.classList.add('holding');
    timer = setTimeout(() => {
      cancel();
      openAdult();
    }, 1000);
  });
  ['pointerup', 'pointerleave', 'pointercancel'].forEach((ev) => btn.addEventListener(ev, cancel));
  btn.addEventListener('contextmenu', (e) => e.preventDefault());
})();

let adultOpenedAt = 0;
function openAdult() {
  adultOpenedAt = performance.now();
  sfx.tap();
  updateSoundBtn();
  $('adultSheet').hidden = false;
}
function updateSoundBtn() {
  $('btnSound').textContent = progress.sound ? '🔊 Звук включён' : '🔇 Звук выключен';
}
$('btnAdultClose').addEventListener('click', () => ($('adultSheet').hidden = true));
$('adultSheet').addEventListener('click', (e) => {
  // Отпускание пальца после удержания даёт click по фону — его игнорируем.
  if (e.target === $('adultSheet') && performance.now() - adultOpenedAt > 600) $('adultSheet').hidden = true;
});
$('btnSound').addEventListener('click', () => {
  progress.sound = !progress.sound;
  setSoundEnabled(progress.sound);
  save();
  updateSoundBtn();
  sfx.tap();
});
$('btnReset').addEventListener('click', () => {
  if (!confirm('Сбросить все звёзды?')) return;
  progress.done = [];
  save();
  renderMap();
});

// ------------------------------------------------------------ тестовый мост
window.__GAME_TEST__ = {
  state: () => ({
    screen: state.screen,
    index: state.index,
    picture: picture().id,
    mode: state.mode,
    camera: state.camera,
    done: [...progress.done],
    result: state.result ? summary(state.result) : null,
    live: liveResult ? { ok: liveResult.ok, reason: liveResult.reason } : null,
  }),
  open(i) {
    state.index = i;
    go('task');
  },
  go,
  /** Прогоняет ImageData через тот же путь, что и снимок с камеры. */
  checkImageData(img) {
    const c = document.createElement('canvas');
    c.width = c.height = CROP;
    const tmp = document.createElement('canvas');
    tmp.width = img.width;
    tmp.height = img.height;
    tmp.getContext('2d').putImageData(img, 0, 0);
    c.getContext('2d', { willReadFrequently: true }).drawImage(tmp, 0, 0, CROP, CROP);
    stopCamera();
    return checkPhoto(c);
  },
  finishCheck() {
    if (state.mode === 'checking') onCheckDone();
  },
  freeze(t) {
    state.frozenTime = t;
    drawResult(t);
  },
  unfreeze() {
    state.frozenTime = null;
  },
  pictures: PICTURES.map((p) => p.id),
};

// ------------------------------------------------------------ старт
go('map');
if ('serviceWorker' in navigator && location.protocol !== 'file:' && !navigator.webdriver) {
  navigator.serviceWorker.register('./sw.js').catch(() => {});
}
window.__READY__ = true;
