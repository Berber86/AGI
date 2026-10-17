// Голубой риф VR — сборка страницы, цикл кадра и связь взгляда с камерой-меткой.
// Управления в игре нет: ребёнок только смотрит по сторонам. Гироскоп не
// используется никогда (контракт), взгляд ведут цветные метки или «прямо».
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { water as waterEnv, setGradeViewport } from './water.js';
// uniform-ы каустики живут в shading.js — QA-мост должен крутить и их.
import { water as shadingWater } from './shading.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

import { WORLD, LOOK, LOOK_MODES, PRESETS, PRESET_ORDER, presetOf, VR_BASELINE_MIN_CM, VR_BASELINE_MAX_CM } from './config.js';
import { loadSettings, saveSettings } from './storage.js';
import { createRenderer, createWorld, applyPreset, updateWorld, worldInfo } from './scene.js';
import { VRController } from './vr.js';
import { CamTracker, CAM_COLORS } from './camtrack.js';

const el = (id) => document.getElementById(id);
const ui = {
  canvas: el('game-canvas'),
  loading: el('screen-loading'),
  loadingText: el('loading-text'),
  home: el('screen-home'),
  vr: el('screen-vr'),
  btnFlat: el('btn-flat'),
  btnVr: el('btn-vr'),
  btnHelp: el('btn-help'),
  help: el('help-panel'),
  btnHelpClose: el('btn-help-close'),
  btnBackHome: el('btn-back-home'),
  btnExitFlat: el('btn-exit-flat'),
  flatHint: el('flat-hint'),
  lookModes: el('look-modes'),
  camPanel: el('cam-panel'),
  camDualPanel: el('cam-dual-panel'),
  camVideo: el('cam-video'),
  camSlotDual: el('cam-slot-dual'),
  camSlotSingle: el('cam-slot-single'),
  btnCamStart: el('btn-cam-start'),
  btnCamStartSingle: el('btn-cam-start-single'),
  btnCamSample: el('btn-cam-sample'),
  btnCamCalib: el('btn-cam-calib'),
  camStatus: el('cam-status'),
  btnCamSampleLeft: el('btn-cam-sample-left'),
  btnCamSampleRight: el('btn-cam-sample-right'),
  btnCamDualCalib: el('btn-cam-dual-calib'),
  camDualStatus: el('cam-dual-status'),
  camColors: el('cam-colors'),
  camColorsLeft: el('cam-colors-left'),
  camColorsRight: el('cam-colors-right'),
  baseline: el('baseline'),
  baselineVal: el('baseline-val'),
  presets: el('presets'),
  btnVrStart: el('btn-vr-start'),
  vrCount: el('vr-count'),
  vrCountNum: el('vr-count-num'),
  divider: el('vr-divider'),
  portrait: el('portrait-hint'),
};

const settings = loadSettings();
const game = {
  mode: 'menu',          // menu | flat | vr
  paused: false,
  camOn: false,
  startedAt: 0,
  frames: 0,
  fps: 0,
  errors: [],
  lookMode: settings.lookMode,
  preset: settings.preset,
};

let renderer, world, vr, composer, bloomPass;
let camTracker = null;
let elapsed = 0;
let lastFrameAt = performance.now();
let fpsAccum = 0;
let fpsFrames = 0;
let countTimer = null;

// Сглаженный взгляд от меток: цель обновляется только по достоверным кадрам.
const camSmooth = { yaw: 0, pitch: 0 };
const camSnap = { pending: null, wasLost: false };
let camLastProcess = 0;

// Осмотр в обычном режиме (мышь/палец): только для превью на экране.
const preview = { yaw: 0, pitch: 0, targetYaw: 0, targetPitch: 0, dragging: false, lastX: 0, lastY: 0 };

// ---------------------------------------------------------------- загрузка
async function boot() {
  ui.loadingText.textContent = 'Готовим воду, песок и кораллы…';
  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

  renderer = createRenderer(ui.canvas);
  world = createWorld(renderer, settings.preset);
  vr = new VRController(renderer, world.scene, world.camera);
  vr.settings.lookMode = settings.lookMode;
  vr.settings.baselineCm = settings.baselineCm;

  window.addEventListener('resize', onResize);
  window.addEventListener('orientationchange', () => setTimeout(onResize, 250));
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) pause();
    else resume();
  });
  window.addEventListener('error', (e) => game.errors.push(String(e.message || e.error)));
  window.addEventListener('unhandledrejection', (e) => game.errors.push(String(e.reason)));

  bindUi();
  syncSettingsUi();
  onResize();
  requestAnimationFrame(frame);

  ui.loading.classList.add('hidden');
  ui.home.classList.remove('hidden');
  exposeTestBridge();
}

function onResize() {
  if (!renderer) return;
  const w = window.innerWidth, h = window.innerHeight;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, presetOf(game.preset).dpr));
  renderer.setSize(w, h, false);
  world.camera.aspect = w / Math.max(1, h);
  world.camera.updateProjectionMatrix();
  if (composer) composer.setSize(w, h);
  const portrait = h > w;
  ui.portrait.classList.toggle('hidden', !(portrait && game.mode === 'vr'));
}

function ensureComposer() {
  if (composer) return composer;
  composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(world.scene, world.camera));
  bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.42, 0.65, 0.86);
  composer.addPass(bloomPass);
  composer.addPass(new OutputPass());
  composer.setSize(window.innerWidth, window.innerHeight);
  return composer;
}

// ------------------------------------------------------------------- UI
function bindUi() {
  ui.btnFlat.addEventListener('click', () => { startFlat(); });
  ui.btnVr.addEventListener('click', () => openVrPrep());
  ui.btnHelp.addEventListener('click', () => ui.help.classList.toggle('hidden'));
  ui.btnHelpClose.addEventListener('click', () => ui.help.classList.add('hidden'));
  ui.btnBackHome.addEventListener('click', () => stopAll('home'));
  ui.btnExitFlat.addEventListener('click', () => stopAll('home'));

  ui.lookModes.querySelectorAll('[data-look-mode]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.lookMode;
      settings.lookMode = mode;
      game.lookMode = mode;
      vr.setLookMode(mode);
      saveSettings(settings);
      syncSettingsUi();
    });
  });

  ui.presets.querySelectorAll('[data-preset]').forEach((btn) => {
    btn.addEventListener('click', () => {
      game.preset = btn.dataset.preset;
      settings.preset = game.preset;
      applyPreset(world, game.preset);
      onResize();
      saveSettings(settings);
      syncSettingsUi();
    });
  });

  ui.baseline.addEventListener('input', () => {
    settings.baselineCm = +ui.baseline.value;
    vr.setBaselineCm(settings.baselineCm);
    ui.baselineVal.textContent = `${settings.baselineCm} см`;
  });
  ui.baseline.addEventListener('change', () => saveSettings(settings));

  ui.camColors.querySelectorAll('[data-color]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const c = CAM_COLORS[btn.dataset.color];
      settings.camColor = btn.dataset.color;
      settings.camHue = null;
      const t = ensureCamTracker();
      if (t) { t.hue = c.hue; t.dual = false; }
      saveSettings(settings);
      syncSettingsUi();
    });
  });
  for (const side of ['left', 'right']) {
    const box = side === 'left' ? ui.camColorsLeft : ui.camColorsRight;
    box.querySelectorAll('[data-color]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const c = CAM_COLORS[btn.dataset.color];
        if (side === 'left') { settings.camLeftColor = btn.dataset.color; settings.camLeftHue = null; } else { settings.camRightColor = btn.dataset.color; settings.camRightHue = null; }
        const t = ensureCamTracker();
        if (t) { t.dual = true; if (side === 'left') t.hueA = c.hue; else t.hueB = c.hue; }
        saveSettings(settings);
        syncSettingsUi();
      });
    });
  }

  const startCam = async () => {
    const t = ensureCamTracker();
    try {
      await t.start(ui.camVideo);
      game.camOn = true;
      ui.camStatus.textContent = 'Камера работает. Поднесите коробку в центр кадра и нажмите «Взять цвет коробки».';
    } catch (e) {
      game.camOn = false;
      ui.camStatus.textContent = `Камера недоступна: ${e && e.message ? e.message : e}. Нужны HTTPS и разрешение.`;
    }
    syncSettingsUi();
  };
  ui.btnCamStart.addEventListener('click', startCam);
  ui.btnCamStartSingle.addEventListener('click', startCam);

  ui.btnCamSample.addEventListener('click', () => sampleColor('single'));
  ui.btnCamSampleLeft.addEventListener('click', () => sampleColor('left'));
  ui.btnCamSampleRight.addEventListener('click', () => sampleColor('right'));
  ui.btnCamCalib.addEventListener('click', () => {
    const t = ensureCamTracker();
    t.dual = false;
    t.processMain();
    const ok = t.calibrate();
    ui.camStatus.textContent = ok
      ? 'Ноль выставлен: коробка перед вами — это «прямо». Можно надевать очки.'
      : 'Метка не видна — ноль выставлен по центру кадра. Повторите, когда коробка в кадре.';
  });
  ui.btnCamDualCalib.addEventListener('click', () => {
    const t = ensureCamTracker();
    t.dual = true;
    t.processMain();
    const ok = t.calibrate();
    ui.camDualStatus.textContent = ok
      ? 'Ноль выставлен по середине двух меток. Теперь можно надевать очки.'
      : 'Нужно, чтобы обе коробки были видны одновременно. Расставьте их и повторите.';
  });

  ui.btnVrStart.addEventListener('click', startVrFromUi);

  // Осмотр в обычном режиме: палец или мышь. В VR это не используется.
  ui.canvas.addEventListener('pointerdown', (e) => {
    if (game.mode !== 'flat') return;
    preview.dragging = true;
    preview.lastX = e.clientX;
    preview.lastY = e.clientY;
    ui.canvas.setPointerCapture?.(e.pointerId);
  });
  ui.canvas.addEventListener('pointermove', (e) => {
    if (!preview.dragging || game.mode !== 'flat') return;
    const dx = e.clientX - preview.lastX;
    const dy = e.clientY - preview.lastY;
    preview.lastX = e.clientX; preview.lastY = e.clientY;
    preview.targetYaw = clamp(preview.targetYaw - dx * 0.22, -150, 150);
    preview.targetPitch = clamp(preview.targetPitch - dy * 0.22, -75, 75);
  });
  const endDrag = () => { preview.dragging = false; };
  ui.canvas.addEventListener('pointerup', endDrag);
  ui.canvas.addEventListener('pointercancel', endDrag);
  ui.canvas.addEventListener('pointerleave', endDrag);
}

function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }

function syncSettingsUi() {
  const mode = settings.lookMode;
  ui.lookModes.querySelectorAll('[data-look-mode]').forEach((b) => {
    const on = b.dataset.lookMode === mode;
    b.classList.toggle('selected', on);
    b.setAttribute('aria-pressed', on ? 'true' : 'false');
  });
  ui.presets.querySelectorAll('[data-preset]').forEach((b) => {
    const on = b.dataset.preset === game.preset;
    b.classList.toggle('selected', on);
    b.setAttribute('aria-pressed', on ? 'true' : 'false');
  });
  ui.camPanel.classList.toggle('hidden', mode !== 'camera');
  ui.camDualPanel.classList.toggle('hidden', mode !== 'camera-dual');
  // Предпросмотр камеры один: переезжает в ту панель, которая сейчас открыта.
  const slot = mode === 'camera-dual' ? ui.camSlotDual : ui.camSlotSingle;
  if (slot && ui.camVideo.parentElement !== slot) slot.appendChild(ui.camVideo);
  ui.baseline.value = String(settings.baselineCm);
  ui.baselineVal.textContent = `${settings.baselineCm} см`;
  ui.camColors.querySelectorAll('[data-color]').forEach((b) => b.classList.toggle('selected', b.dataset.color === settings.camColor));
  ui.camColorsLeft.querySelectorAll('[data-color]').forEach((b) => b.classList.toggle('selected', b.dataset.color === settings.camLeftColor));
  ui.camColorsRight.querySelectorAll('[data-color]').forEach((b) => b.classList.toggle('selected', b.dataset.color === settings.camRightColor));
}

function sampleColor(which) {
  const t = ensureCamTracker();
  t.dual = which !== 'single';
  t.processMain();
  const hue = t.sampleColor();
  if (hue === null) {
    (which === 'single' ? ui.camStatus : ui.camDualStatus).textContent = 'В центре кадра нет насыщенного цвета — поднесите коробку ближе.';
    return;
  }
  if (which === 'single') {
    settings.camColor = 'custom'; settings.camHue = hue;
    ui.camStatus.textContent = `Цвет коробки запомнен (оттенок ${hue}°). Теперь поставьте её перед собой и нажмите «Смотрю прямо».`;
  } else if (which === 'left') {
    t.dual = true; t.hueA = hue;
    settings.camLeftColor = 'custom'; settings.camLeftHue = hue;
    ui.camDualStatus.textContent = `Левый цвет запомнен: оттенок ${hue}°.`;
  } else {
    t.dual = true; t.hueB = hue;
    settings.camRightColor = 'custom'; settings.camRightHue = hue;
    ui.camDualStatus.textContent = `Правый цвет запомнен: оттенок ${hue}°.`;
  }
  saveSettings(settings);
  syncSettingsUi();
}

function ensureCamTracker() {
  if (!camTracker) {
    camTracker = new CamTracker();
    camTracker.tol = settings.camTol;
    camTracker.satMin = settings.camSat / 100;
    camTracker.dual = settings.lookMode === 'camera-dual';
    camTracker.hue = hueFor(settings.camColor, settings.camHue, 'raspberry');
    camTracker.hueA = hueFor(settings.camLeftColor, settings.camLeftHue, 'orange');
    camTracker.hueB = hueFor(settings.camRightColor, settings.camRightHue, 'raspberry');
  }
  return camTracker;
}

function hueFor(colorKey, customHue, fallback) {
  if (colorKey === 'custom' && Number.isFinite(customHue)) return customHue;
  return (CAM_COLORS[colorKey] || CAM_COLORS[fallback]).hue;
}

// --------------------------------------------------------------- режимы
function startFlat() {
  game.mode = 'flat';
  game.startedAt = performance.now();
  ui.home.classList.add('hidden');
  ui.vr.classList.add('hidden');
  ui.divider.classList.add('hidden');
  ui.btnExitFlat.classList.remove('hidden');
  ui.flatHint.classList.remove('hidden');
  setTimeout(() => ui.flatHint.classList.add('faded'), 4200);
  vr.stop();
  requestFullscreen(false);
}

function openVrPrep() {
  game.mode = 'menu';
  ui.home.classList.add('hidden');
  ui.vr.classList.remove('hidden');
  ui.btnExitFlat.classList.add('hidden');
  ui.flatHint.classList.add('hidden');
  if (settings.lookMode !== 'forward') ensureCamTracker();
  syncSettingsUi();
}

function stopAll(next) {
  stopVr();
  game.mode = 'menu';
  ui.vr.classList.add('hidden');
  ui.divider.classList.add('hidden');
  ui.btnExitFlat.classList.add('hidden');
  ui.flatHint.classList.add('hidden');
  if (next === 'home') ui.home.classList.remove('hidden');
  if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
}

async function startVrFromUi() {
  const mode = settings.lookMode;
  ui.btnVrStart.disabled = true;
  if (mode !== 'forward') {
    try {
      const t = ensureCamTracker();
      t.dual = mode === 'camera-dual';
      t.hue = hueFor(settings.camColor, settings.camHue, 'raspberry');
      t.hueA = hueFor(settings.camLeftColor, settings.camLeftHue, 'orange');
      t.hueB = hueFor(settings.camRightColor, settings.camRightHue, 'raspberry');
      t.tol = settings.camTol;
      t.satMin = settings.camSat / 100;
      await t.start(ui.camVideo);
      t.useWorkerMode();
      game.camOn = true;
    } catch (e) {
      ui.camStatus.textContent = `Камера не запустилась: ${e && e.message ? e.message : e}. Нужны HTTPS, разрешение и задняя камера.`;
      ui.btnVrStart.disabled = false;
      return;
    }
  } else {
    game.camOn = false;
  }
  requestFullscreen(true);
  // Отсчёт нужен, чтобы успеть вставить телефон в очки.
  let left = 5;
  ui.vrCount.classList.remove('hidden');
  ui.vrCountNum.textContent = String(left);
  countTimer = setInterval(() => {
    left -= 1;
    if (left <= 0) {
      clearInterval(countTimer); countTimer = null;
      ui.vrCount.classList.add('hidden');
      startVr();
    } else ui.vrCountNum.textContent = String(left);
  }, 900);
}

function startVr(opts = {}) {
  game.mode = 'vr';
  game.startedAt = performance.now();
  const lookMode = opts.lookMode || settings.lookMode;
  const baseline = Number.isFinite(opts.baselineCm) ? opts.baselineCm : settings.baselineCm;
  vr.start({ lookMode, baselineCm: baseline });
  ui.vr.classList.add('hidden');
  ui.home.classList.add('hidden');
  ui.btnExitFlat.classList.add('hidden');
  ui.flatHint.classList.add('hidden');
  ui.divider.classList.remove('hidden');
  camSmooth.yaw = 0; camSmooth.pitch = 0;
  camSnap.pending = null; camSnap.wasLost = false;
  if (camTracker) camTracker.resetDualCalibration();
}

function stopVr() {
  if (countTimer) { clearInterval(countTimer); countTimer = null; ui.vrCount.classList.add('hidden'); }
  vr?.stop();
  if (camTracker) { camTracker.stop(); game.camOn = false; }
  ui.divider.classList.add('hidden');
  ui.btnVrStart.disabled = false;
}

function pause() { game.paused = true; }
function resume() { game.paused = false; lastFrameAt = performance.now(); }

async function requestFullscreen(landscape) {
  try {
    if (!document.fullscreenElement) await document.documentElement.requestFullscreen?.({ navigationUI: 'hide' });
    if (landscape && screen.orientation?.lock) await screen.orientation.lock('landscape');
  } catch { /* браузер вправе отказать — играем как есть */ }
}

// ------------------------------------------------------------- взгляд
function updateCameraLook(now) {
  if (game.mode !== 'vr' || !camTracker || !game.camOn) return;
  if (settings.lookMode === 'forward') { vr.setSimLook(null); return; }
  if (now - camLastProcess < (camTracker.intervalMs || 90)) return;
  camLastProcess = now;
  camTracker.process();

  const fix = camTracker.dual
    ? (camTracker.pairFixation() || camTracker.singleSteer())
    : camTracker.fresh(900);

  if (!fix) {
    // Метки нет: взгляд остаётся там, где был. Ни к центру, ни по кругу.
    camSnap.wasLost = true;
    camSnap.pending = null;
    vr.setSimLook(camSmooth.yaw, camSmooth.pitch, true);
    return;
  }
  const dy = camTracker.yaw - camSmooth.yaw;
  const dp = camTracker.pitch - camSmooth.pitch;
  const jump = Math.hypot(dy, dp);
  if (camSnap.pending) {
    if (Math.abs(camTracker.yaw - camSnap.pending.yaw) < 3 && Math.abs(camTracker.pitch - camSnap.pending.pitch) < 3) {
      camSmooth.yaw = camTracker.yaw;
      camSmooth.pitch = camTracker.pitch;
      camSnap.pending = null;
      camSnap.wasLost = false;
    } else {
      camSnap.pending = { yaw: camTracker.yaw, pitch: camTracker.pitch };
      camSmooth.yaw += dy * 0.4;
      camSmooth.pitch += dp * 0.4;
    }
  } else if (camSnap.wasLost && jump > 8) {
    camSnap.pending = { yaw: camTracker.yaw, pitch: camTracker.pitch };
    camSmooth.yaw += dy * 0.4;
    camSmooth.pitch += dp * 0.4;
  } else {
    camSnap.wasLost = false;
    const f = Math.min(0.85, 0.4 + jump * 0.015);
    camSmooth.yaw += dy * f;
    camSmooth.pitch += dp * f;
  }
  vr.setSimLook(camSmooth.yaw, camSmooth.pitch, false);
}

function applyPreviewLook(dt) {
  const k = 1 - Math.exp(-9 * Math.max(0, Math.min(dt, 0.25)));
  preview.yaw += (preview.targetYaw - preview.yaw) * k;
  preview.pitch += (preview.targetPitch - preview.pitch) * k;
  world.camera.rotation.set(0, 0, 0);
  world.camera.rotateY(THREE.MathUtils.degToRad(preview.yaw));
  world.camera.rotateX(THREE.MathUtils.degToRad(preview.pitch));
}

// ---------------------------------------------------------- цикл кадра
function frame(now) {
  requestAnimationFrame(frame);
  if (game.paused || !renderer) { lastFrameAt = now; return; }
  const dt = Math.min(0.1, Math.max(0, (now - lastFrameAt) / 1000));
  lastFrameAt = now;
  elapsed += dt;
  game.frames++;

  fpsAccum += dt; fpsFrames++;
  if (fpsAccum >= 0.5) {
    game.fps = Math.round(fpsFrames / fpsAccum);
    fpsAccum = 0; fpsFrames = 0;
  }

  updateWorld(world, dt, elapsed);

  if (game.mode === 'vr') {
    updateCameraLook(now);
    world.camera.rotation.set(0, 0, 0);
    vr.applyLook(world.camera, dt);
    world.camera.updateMatrixWorld();
    vr.render();
  } else {
    applyPreviewLook(dt);
    world.camera.updateMatrixWorld();
    const preset = presetOf(game.preset);
    setGradeViewport(0, 0, window.innerWidth, window.innerHeight, renderer.getPixelRatio());
    if (preset.bloom) {
      const comp = ensureComposer();
      bloomPass.enabled = true;
      comp.render(dt);
    } else {
      renderer.render(world.scene, world.camera);
    }
  }
}

// ------------------------------------------------------- тестовый мост
function exposeTestBridge() {
  window.__TEST__ = {
    ready: true,
    version: 1,
    state() {
      return {
        mode: game.mode, paused: game.paused, fps: game.fps, frames: game.frames,
        elapsed: +elapsed.toFixed(3), camOn: game.camOn, preset: game.preset,
        lookMode: settings.lookMode, baselineCm: vr.settings.baselineCm,
        errors: [...game.errors],
        preview: { yaw: +preview.yaw.toFixed(1), pitch: +preview.pitch.toFixed(1) },
      };
    },
    startFlat() { startFlat(); return this.state(); },
    openVrPrep() { openVrPrep(); return this.state(); },
    startVr(opts = {}) { startVr(opts); return { vr: this.vrInfo(), state: this.state() }; },
    stopVr() { stopVr(); return this.state(); },
    backHome() { stopAll('home'); return this.state(); },
    setLookMode(mode) { settings.lookMode = mode; vr.setLookMode(mode); syncSettingsUi(); return this.vrInfo(); },
    setBaseline(cm) {
      const v = vr.setBaselineCm(cm);
      settings.baselineCm = v;
      ui.baseline.value = String(v);
      ui.baselineVal.textContent = `${v} см`;
      return v;
    },
    setPreset(id) {
      game.preset = PRESETS[id] ? id : game.preset;
      applyPreset(world, game.preset);
      onResize();
      syncSettingsUi();
      return this.worldInfo();
    },
    setPreviewLook(yawDeg, pitchDeg) {
      preview.targetYaw = clamp(+yawDeg || 0, -150, 150);
      preview.targetPitch = clamp(+pitchDeg || 0, -75, 75);
      preview.yaw = preview.targetYaw; preview.pitch = preview.targetPitch;
      return this.state().preview;
    },
    // Прямая подмена углов метки: то же, что делает трекер в боевом пути.
    look(yawDeg = null, pitchDeg = 0, held = false) {
      vr.setSimLook(yawDeg, pitchDeg, held);
      return this.vrInfo();
    },
    step(seconds = 1, dt = 1 / 30) {
      const n = Math.max(1, Math.round(seconds / dt));
      for (let i = 0; i < n; i++) { elapsed += dt; updateWorld(world, dt, elapsed); }
      return this.worldInfo();
    },
    worldInfo() { return worldInfo(world); },
    // Только для QA: крутить параметры воды и коррекции на ходу, чтобы видеть
    // вклад каждого эффекта в кадр (слепые правки «на глаз» здесь не годятся).
    setWater(patch = {}) {
      const out = {};
      for (const [key, value] of Object.entries(patch)) {
        const slot = waterEnv[key] || shadingWater[key];
        if (!slot || !('value' in slot)) continue;
        const v = slot.value;
        if (typeof v === 'number') slot.value = value;
        else if (Array.isArray(value) && v.fromArray) v.fromArray(value);
        out[key] = Array.isArray(slot.value) || typeof slot.value === 'number'
          ? slot.value : (slot.value.toArray ? slot.value.toArray().map((n) => +n.toFixed(4)) : String(slot.value));
      }
      return out;
    },
    getWater() {
      const out = {};
      for (const [key, slot] of Object.entries({ ...waterEnv, ...shadingWater })) {
        const v = slot.value;
        out[key] = typeof v === 'number' ? v : (v.toArray ? v.toArray().map((n) => +n.toFixed(4)) : String(v));
      }
      return out;
    },
    /** Мировые координаты первой рыбы каждого вида: доказательство, что рыбы плывут. */
    fishProbe() {
      const m = new THREE.Matrix4();
      const v = new THREE.Vector3();
      return world.fish.species.map((s) => {
        s.mesh.getMatrixAt(0, m);
        v.setFromMatrixPosition(m);
        return { id: s.spec.id, x: +v.x.toFixed(2), y: +v.y.toFixed(2), z: +v.z.toFixed(2) };
      });
    },
    whaleInfo() { return whaleInfo(world.whale); },
    vrInfo() { return vr.info(); },
    camInfo() { return camTracker ? camTracker.info() : null; },
    camStart() { return ensureCamTracker(); },
    camSetDual(dual) {
      const t = ensureCamTracker();
      t.dual = !!dual;
      t.resetDualCalibration();
      return t.info();
    },
    camColors({ hue, hueA, hueB } = {}) {
      const t = ensureCamTracker();
      if (Number.isFinite(hue)) t.hue = hue;
      if (Number.isFinite(hueA)) t.hueA = hueA;
      if (Number.isFinite(hueB)) t.hueB = hueB;
      return t.info();
    },
    camFeed(opts = {}) {
      const t = ensureCamTracker();
      const { cx = 160, cy = 120, r = 26, w = 320, h = 240, shape = 'rect' } = opts;
      return t.injectBlob(cx, cy, r, w, h, shape);
    },
    camFeedDual(opts = {}) {
      const t = ensureCamTracker();
      const { ax = 96, ay = 120, bx = 224, by = 120, r = 26, w = 320, h = 240, shape = 'rect' } = opts;
      return t.injectDualBlob(ax, ay, bx, by, r, w, h, shape);
    },
    camFeedEmpty(w = 320, h = 240) { return ensureCamTracker().injectEmpty(w, h); },
    camCalibrate() { const t = ensureCamTracker(); const ok = t.calibrate(); return { ok, info: t.info() }; },
    camForget(id = null) { const t = ensureCamTracker(); t.forgetMarkerEntities(id); return t.info(); },
    camPushLook(now = performance.now()) { updateCameraLook(now); return { vr: vr.info(), cam: camTracker ? camTracker.info() : null }; },
    limits() { return { yawDeg: LOOK.maxYawDeg, pitchDeg: LOOK.maxPitchDeg, baseline: [VR_BASELINE_MIN_CM, VR_BASELINE_MAX_CM] }; },
    lookModes() { return Object.values(LOOK_MODES).map((m) => ({ id: m.id, label: m.label })); },
    presetOrder() { return [...PRESET_ORDER]; },
    world() { return { ...WORLD, eyeDepth: +(WORLD.surfaceY - WORLD.eyeY).toFixed(1) }; },
    pause() { pause(); return this.state(); },
    resume() { resume(); return this.state(); },
  };
}

boot().catch((err) => {
  ui.loadingText.textContent = `Не удалось запустить: ${err && err.message ? err.message : err}`;
  console.error(err);
});
