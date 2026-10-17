// Candy Kingdom Coaster — bootstrap & game loop.
import * as THREE from 'three';
import { EffectComposer } from '../vendor/three/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from '../vendor/three/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from '../vendor/three/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from '../vendor/three/jsm/postprocessing/OutputPass.js';

import { GAME, TUNING, JUMP, formatTime, MEDALS, TIME_MEDAL } from './config.js';
import { Storage } from './storage.js';
import { SFX } from './audio.js';
import { Input } from './input.js';
import { createTrack } from './track.js';
import { createCar, createTrail } from './car.js';
import { createWorld } from './world.js';
import { createSweets, Burst } from './sweets.js';
import { createRamps } from './ramps.js';
import { createBridge } from './bridge.js';
import { createTunnel } from './tunnel.js';
import { createCakes } from './cakes.js';
import { createForks } from './forks.js';
import { createLandmarks } from './landmarks.js';
import { createAmbient } from './ambient.js';
import { MUSIC } from './music.js';
import { HUD, fillRecordsPanel } from './hud.js';
import { QualityGovernor } from './quality.js';
import { VRController, normalizeVrSettings } from './vr.js';
import { RemoteControl, parseFirebaseConfig } from './remote.js';
import { CamTracker, CAM_COLORS } from './camtrack.js';
import { loadTextures, countLoaded } from './textures.js';
import { setLoading, finishLoading, paintLoading } from './loading.js';

// ---------------------------------------------------------------- renderer
const canvas = document.getElementById('game-canvas');
// antialias: false — MSAA достаётся только тому пути, который рисует прямо в
// канвас, то есть стереопаре (в обычной игре сцена идёт через EffectComposer,
// у его таргетов сэмплов 0, и 4× сэмплы холста не давали ничего, только resolve).
// Для стерео это была самая дорогая часть заполнения: два вьюпорта с 4×
// сэмплами. Поэтому MSAA выключен совсем — разрешение глаз не меняется,
// а освободившийся бюджет уходит в ровные 60 к/с.
const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
// Candy look: no filmic desaturation — keep the pastel colors punchy.
renderer.toneMapping = THREE.NoToneMapping;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.3, 1100);
camera.position.set(0, 6, -12);

const composer = new EffectComposer(renderer);
renderer.info.autoReset = false; // keep the whole frame's draw calls/triangles
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.5, 0.62, 0.84);
composer.addPass(bloom);
composer.addPass(new OutputPass());

// ---------------------------------------------------------------- textures
// Real image textures are fetched before the world is built so every material
// starts with its final map. Missing files fall back to procedural canvases.
setLoading(4, 0, 'Открываем конфетный мир…');
const TEX = await loadTextures({
  renderer,
  onProgress: (n, total) => {
    setLoading(4 + (n / total) * 52, 0, 'Добавляем краски и сладости…');
  },
});
setLoading(60, 0, 'Строим сладкую трассу…');
await paintLoading();

// ---------------------------------------------------------------- world
const track = createTrack(scene, TEX);
const ramps = createRamps(scene, track, TEX);
const bridge = createBridge(scene, track, TEX); // milk river + arched bridge (before the world: props avoid the river)
const tunnel = createTunnel(scene, track, TEX); // chocolate Swiss-roll tunnel (cocoa → marshmallow)
const cakes = createCakes(scene, track, TEX); // uphill cake → sky bridge → downhill cake
await document.fonts.ready;
const forks = createForks(scene, track, TEX);
const landmarks = createLandmarks(scene, track, TEX);
const ambient = createAmbient(scene, track);
setLoading(70, 0, 'Расставляем сладости…');
await paintLoading();
// Keep the water, tunnel and elevated cake roads free of ordinary props.
const world = createWorld(scene, track, renderer, TEX, { blocks: (x, z) => bridge.blocks(x, z) || tunnel.blocks(x, z) || cakes.blocks(x, z) || forks.blocks(x, z) || landmarks.blocks(x, z) });
setLoading(78, 1, 'Лили пристёгивается…');
await paintLoading();
const car = createCar({ renderer, TEX });
car.root.rotation.order = 'YXZ'; // heading first, then pitch / roll in the car's own frame
scene.add(car.root);
const trail = createTrail(scene);
// Inside the tunnel the daylight fades (hemi + sun dim, car reflections dim)
// and the car's headlight spot comes on; the sponge walls carry baked lantern
// light, so this is the only real-time light change.
let tunnelK = 0;
function tunnelTick(dt, s) {
  const k = Math.max(tunnel.darkness(s), forks.darkness(s));
  tunnelK = k;
  world.setDarkness(k);
  car.setHeadlights(k);
  tunnel.update(dt, performance.now() * 0.001, s);
  forks.update(dt, performance.now() * 0.001, s);
}
setLoading(86, 1, 'Проверяем машинку…');
await paintLoading();
const sweets = createSweets(scene, track, ramps);
const finishFx = new Burst(scene);
const hud = new HUD(document.getElementById('hud'), track);
const input = new Input();
const governor = new QualityGovernor(renderer, composer, world);
const vr = new VRController(renderer, scene, camera);
let remoteCtrl = null; // телефон-джойстик (создаётся из экрана подготовки)
let vrSettings = normalizeVrSettings(Storage.getVrSettings());
const isCameraLookMode = (mode = vrSettings.lookMode) => mode === 'camera' || mode === 'camera-dual';
const gestureDriverEnabled = () => vrSettings.driverMode === 'gesture';
const gestureInputEnabled = () => !!vrSettings.gestureZoom || gestureDriverEnabled();
const needsCameraInput = () => isCameraLookMode() || gestureInputEnabled();

// ---------------------------------------------------------------- state
const game = {
  state: 'menu', // menu | countdown | racing | paused | finish
  s: 0,
  lateral: 0,
  speed: 0,
  timeS: 0,
  score: 0,
  stars: 0,
  boostCharges: 0,
  boostActive: false,
  boostT: 0,
  zoneIndex: -1,
  vrRide: false, // VR-поездка: заезд ведёт автопилот, игрок только смотрит
  driverMode: 'auto', // 'auto' | 'gesture' | 'remote'
  autoAssist: false, // команда джойстика: автопилот поверх руля
  camOn: false, // режим взгляда «По метке»: камера ведёт взгляд
  gestureOn: false, // gesture camera analyzer: V zoom and/or thumbs-up throttle
  vrPlan: null,
  vrSteer: 0,
  countdownT: 0,
  countdownN: 3,
  introT: 0,
  goHideT: 0,
  bumpCooldown: 0,
  // jump ramps: height above the road, vertical speed, phase, airtime
  air: 0,
  vy: 0,
  jump: 'ground', // ground | ramp | air | drop
  jumpRamp: null,
  jumpT: 0,
  carPitch: 0,
  landSquash: 0,
  camKick: 0,
  bigAir: false,
  dropSide: 0,
  bounces: 0,
  carRoll: 0,
  camPos: new THREE.Vector3(0, 6, -12),
  camTarget: new THREE.Vector3(0, 2, 20),
};

const screens = {
  menu: document.getElementById('screen-menu'),
  pause: document.getElementById('screen-pause'),
  finish: document.getElementById('screen-finish'),
};
const el = {
  countdown: document.getElementById('countdown'),
  countdownNum: document.getElementById('countdown-num'),
  portrait: document.getElementById('portrait-hint'),
  btnPlay: document.getElementById('btn-play'),
  btnResume: document.getElementById('btn-resume'),
  btnRestart: document.getElementById('btn-restart'),
  btnMenu: document.getElementById('btn-menu'),
  btnRestart2: document.getElementById('btn-restart2'),
  btnMenu2: document.getElementById('btn-menu2'),
  btnSound2: document.getElementById('btn-sound2'),
  finishTime: document.getElementById('finish-time'),
  finishSweets: document.getElementById('finish-sweets'),
  finishScore: document.getElementById('finish-score'),
  finishStars: document.getElementById('finish-stars'),
  finishRoute: document.getElementById('finish-route'),
  medalsList: document.getElementById('medals-list'),
  recordsMenu: document.getElementById('records-menu'),
  boostCount: document.getElementById('hud-boost-count'),
  btnVr: document.getElementById('btn-vr'),
  vrScreen: document.getElementById('screen-vr'),
  vrModeLook: document.getElementById('vr-mode-look'),
  vrModeCamera: document.getElementById('vr-mode-camera'),
  vrModeCameraDual: document.getElementById('vr-mode-camera-dual'),
  vrCamPanel: document.getElementById('vr-cam-panel'),
  vrCamSingleControls: document.getElementById('vr-cam-single-controls'),
  vrCamDualControls: document.getElementById('vr-cam-dual-controls'),
  vrCamVideo: document.getElementById('vr-cam-video'),
  vrCamStart: document.getElementById('vr-cam-start'),
  vrCamSample: document.getElementById('vr-cam-sample'),
  vrCamCalib: document.getElementById('vr-cam-calib'),
  vrCamStatus: document.getElementById('vr-cam-status'),
  vrCamSwatch: document.getElementById('vr-cam-swatch'),
  vrCamHueLabel: document.getElementById('vr-cam-hue-label'),
  vrCamTol: document.getElementById('vr-cam-tol'),
  vrCamTolVal: document.getElementById('vr-cam-tol-val'),
  vrCamSat: document.getElementById('vr-cam-sat'),
  vrCamSatVal: document.getElementById('vr-cam-sat-val'),
  vrCamSampleLeft: document.getElementById('vr-cam-sample-left'),
  vrCamSampleRight: document.getElementById('vr-cam-sample-right'),
  vrCamDualCalib: document.getElementById('vr-cam-dual-calib'),
  vrCamDualStatus: document.getElementById('vr-cam-dual-status'),
  vrGestureZoom: document.getElementById('vr-gesture-zoom'),
  vrGestureStatus: document.getElementById('vr-gesture-status'),
  vrCamLeftSwatch: document.getElementById('vr-cam-left-swatch'),
  vrCamLeftLabel: document.getElementById('vr-cam-left-label'),
  vrCamRightSwatch: document.getElementById('vr-cam-right-swatch'),
  vrCamRightLabel: document.getElementById('vr-cam-right-label'),
  vrModeForward: document.getElementById('vr-mode-forward'),
  vrIpd: document.getElementById('vr-ipd'),
  vrIpdVal: document.getElementById('vr-ipd-val'),
  btnVrStart: document.getElementById('btn-vr-start'),
  btnVrCancel: document.getElementById('btn-vr-cancel'),
  vrCount: document.getElementById('vr-count'),
  vrCountNum: document.getElementById('vr-count-num'),
  vrDriverAuto: document.getElementById('vr-driver-auto'),
  vrDriverGesture: document.getElementById('vr-driver-gesture'),
  vrDriverRemote: document.getElementById('vr-driver-remote'),
  vrRemotePanel: document.getElementById('vr-remote-panel'),
  vrCfg: document.getElementById('vr-cfg'),
  vrCfgConnect: document.getElementById('vr-cfg-connect'),
  vrRoomDemo: document.getElementById('vr-room-demo'),
  vrCfgStatus: document.getElementById('vr-cfg-status'),
  vrRoomCode: document.getElementById('vr-room-code'),
  vrRoomStatus: document.getElementById('vr-room-status'),
};

// gentle haptics where supported (Android Chrome) — silent no-op elsewhere
const HAPTIC = {
  buzz(p) { try { navigator.vibrate && navigator.vibrate(p); } catch { /* ignore */ } },
};

function showScreen(name) {
  for (const [k, node] of Object.entries(screens)) node.classList.toggle('hidden', k !== name);
  const playing = name === null;
  document.body.dataset.screen = playing ? 'game' : name;
  const root = document.getElementById('hud');
  root.inert = !playing;
  root.setAttribute('aria-hidden', String(!playing));
}

function setSoundIcons() {
  hud.setMuted(SFX.isMuted());
  document.querySelectorAll('[data-sound-toggle]').forEach((button) => {
    button.classList.toggle('is-muted', SFX.isMuted());
    button.setAttribute('aria-label', SFX.isMuted() ? 'Включить звук' : 'Выключить звук');
    button.setAttribute('aria-pressed', String(!SFX.isMuted()));
  });
  el.btnSound2.textContent = SFX.isMuted() ? '🔇 Звук выключен' : '🔊 Звук включён';
}

// ---------------------------------------------------------------- flow
function toMenu() {
  closeRemote();
  stopVrStereo();
  game.vrRide = false;
  hideVrPrep();
  game.state = 'menu';
  input.releaseAll();
  showScreen('menu');
  el.countdown.classList.add('hidden');
  fillRecordsPanel(el.recordsMenu, Storage.getRecords());
  setSoundIcons();
  SFX.engineStop();
  if (MUSIC.isPlaying()) MUSIC.setMode('menu');
  window.__GAME_STATE__ = 'menu';
}

function startRace() {
  governor.hold(2);
  game.s = 0;
  game.lateral = 0;
  game.speed = TUNING.cruiseSpeed * 0.55;
  game.timeS = 0;
  game.score = 0;
  game.stars = 0;
  game.boostCharges = 0;
  game.boostActive = false;
  game.boostT = 0;
  game.zoneIndex = -1;
  game.countdownT = 0;
  game.countdownN = 3;
  game.goHideT = 0;
  game.freeze = false;
  game.camSnap = true;
  game.introT = 0;
  resetJump();
  track.routes.reset();
  game.vrRide = false;
  game.vrPlan = null;
  sweets.reset();
  input.releaseAll();
  showScreen(null);
  el.countdown.classList.add('hidden');
  game.state = 'intro'; // 6s cinematic sweep before the 3-2-1
  window.__GAME_STATE__ = 'intro';
  SFX.unlock();
  SFX.engineStart();
  MUSIC.start('menu');
}

function beginCountdown() {
  game.countdownT = 0;
  game.countdownN = 3;
  game.goHideT = 0;
  game.camSnap = true;
  showScreen(null);
  el.countdown.classList.remove('hidden');
  el.countdownNum.textContent = '3';
  game.state = 'countdown';
  window.__GAME_STATE__ = 'countdown';
}

function skipIntro() {
  if (game.state === 'intro') beginCountdown();
}

function pauseGame() {
  if (game.state === 'racing' || game.state === 'countdown') {
    game.state = 'paused';
    stopVrStereo();
    publishRemoteState();
    input.releaseAll();
    showScreen('pause');
    setSoundIcons();
    window.__GAME_STATE__ = 'paused';
    SFX.play('click');
    SFX.engineStop();
    MUSIC.stop(0.2);
  } else if (game.state === 'paused') {
    resumeGame();
  }
}

function resumeGame() {
  game.state = 'racing';
  publishRemoteState();
  input.releaseAll();
  showScreen(null);
  el.countdown.classList.add('hidden'); // a countdown digit must not survive the pause
  game.goHideT = 0;
  window.__GAME_STATE__ = 'racing';
  SFX.play('click');
  SFX.unlock();
  SFX.engineStart();
  MUSIC.start(game.boostActive ? 'boost' : 'race');
}

function finishRace() {
  closeRemote();
  stopVrStereo(); // VR сам выключается на финише — дальше обычный экран медалей
  game.vrRide = false;
  el.finishRoute.textContent = 'Твой маршрут: ' + track.routes.forks.map((f) => f.branches[track.routes.choice(f)].title).join(' → ');
  game.state = 'finish';
  input.releaseAll();
  SFX.engineStop();
  MUSIC.setMode('menu'); // the band takes a breather under the fanfare
  // candy-confetti celebration around the car
  const fp = car.root.position.clone().add(new THREE.Vector3(0, 1.6, 0));
  finishFx.spawn(fp, '#ffd45e', 34, 8.5);
  finishFx.spawn(fp, '#ff8fc6', 30, 7.5);
  finishFx.spawn(fp, '#8fd8ff', 26, 8);
  const timeMs = game.timeS * 1000;
  const total = sweets.total;
  const collected = sweets.collected;
  const frac = total ? collected / total : 0;
  const medalsEarned = MEDALS.filter((m) => frac >= m.minFraction).length + (game.timeS < TIME_MEDAL.maxSeconds ? 1 : 0);
  Storage.commitRun({ // records live in the menu panel; the finish card stays focused on "play again"
    timeMs, sweets: collected, total, score: game.score,
    medalsEarned, starsEarned: game.stars,
  });
  el.finishTime.textContent = formatTime(game.timeS);
  el.finishSweets.textContent = `${collected}`;
  el.finishStars.textContent = `${game.stars}`;
  el.medalsList.innerHTML = hud.renderMedals({ sweets: collected, total, timeMs, score: game.score });
  showScreen('finish');
  setSoundIcons();
  SFX.play('finish');
  HAPTIC.buzz([50, 70, 50, 70, 120]);
  window.__GAME_STATE__ = 'finish';
  window.__SHOT_INFO__ = { timeMs, sweets: collected, total, score: game.score, medalsEarned, stars: game.stars };
}

// ---------------------------------------------------------------- UI wiring
document.addEventListener('pointerdown', () => {
  // first touch unlocks audio: the tune starts here (browsers forbid earlier)
  SFX.unlock();
  MUSIC.start(game.state === 'racing' ? 'race' : 'menu');
}, { once: true });

el.btnPlay.addEventListener('click', () => { SFX.unlock(); SFX.play('click'); startRace(); });
el.btnResume.addEventListener('click', () => resumeGame());
el.btnRestart.addEventListener('click', () => { SFX.play('click'); startRace(); });
el.btnRestart2.addEventListener('click', () => { SFX.play('click'); startRace(); });
el.btnMenu.addEventListener('click', () => { SFX.play('click'); toMenu(); });
el.btnMenu2.addEventListener('click', () => { SFX.play('click'); toMenu(); });
document.querySelectorAll('[data-sound-toggle]').forEach((button) => button.addEventListener('click', () => {
  SFX.unlock(); SFX.toggleMute(); setSoundIcons(); SFX.play('click');
}));
// fullscreen toggle — hides the browser UI (Android Chrome: user gesture required)
document.getElementById('btn-full').addEventListener('click', () => {
  SFX.unlock(); SFX.play('click');
  try {
    const d = document;
    const root = d.documentElement;
    const isFs = d.fullscreenElement || d.webkitFullscreenElement;
    if (!isFs) {
      const req = root.requestFullscreen || root.webkitRequestFullscreen;
      if (req) {
        const p = req.call(root);
        if (p && p.catch) p.catch(() => { /* e.g. iOS Safari — ignore */ });
        try {
          if (screen.orientation && screen.orientation.lock) screen.orientation.lock('landscape').catch(() => {});
        } catch { /* ignore */ }
      }
    } else {
      const exit = d.exitFullscreen || d.webkitExitFullscreen;
      if (exit) {
        const p = exit.call(d);
        if (p && p.catch) p.catch(() => {});
      }
    }
  } catch { /* ignore */ }
});
for (const event of ['fullscreenchange', 'webkitfullscreenchange']) {
  document.addEventListener(event, () => {
    const active = !!(document.fullscreenElement || document.webkitFullscreenElement);
    const button = document.getElementById('btn-full');
    button.setAttribute('aria-pressed', String(active));
    button.setAttribute('aria-label', active ? 'Выйти из полного экрана' : 'Полный экран');
  });
}
el.btnSound2.addEventListener('click', () => {
  SFX.unlock(); SFX.toggleMute(); setSoundIcons(); SFX.play('click');
});
document.getElementById('btn-pause').addEventListener('click', () => pauseGame());
input.onPause = () => pauseGame();
input.attachButton(document.getElementById('btn-left'), 'left');
input.attachButton(document.getElementById('btn-right'), 'right');

window.addEventListener('keydown', (e) => {
  if (document.body.dataset.boot !== 'ready') return;
  if (e.key.toLowerCase() === 'm') { SFX.toggleMute(); setSoundIcons(); }
  if (e.key === ' ' || e.key === 'Enter') {
    if (game.state === 'menu') { SFX.unlock(); startRace(); }
    else if (game.state === 'intro') skipIntro();
    else if (game.state === 'finish') startRace();
    else if (game.state === 'paused') resumeGame();
  }
});

// ---------------------------------------------------------------- VR ride
// Контракт: VR_BRAINSTORM.md. Автопилот ведёт машинку сам: целится в ближайшие
// сладости своей ветки, заранее занимает сторону запланированной развилки и
// иногда заезжает на трамплины. Выбор веток — новый на каждую поездку.
function planVrRide() {
  const choices = {}, rampTake = {};
  for (const f of track.routes.forks) choices[f.id] = Math.random() < 0.5 ? 0 : 1;
  for (const r of ramps.list) rampTake[r.id] = Math.random() < 0.5;
  return { choices, rampTake };
}

function vrSteerTarget() {
  const plan = game.vrPlan, s = game.s;
  if (!plan) return 0;
  for (const f of track.routes.forks) {
    if (f.selected === null && s < f.s0 && s > f.s0 - 75) return plan.choices[f.id] ? 3.6 : -3.6;
  }
  for (const r of ramps.list) {
    if (!plan.rampTake[r.id]) continue;
    if (r.forkId) {
      const f = track.routes.forks.find((x) => x.id === r.forkId);
      if (f && plan.choices[f.id] !== r.branch) continue;
    }
    if (s > r.s0 - 32 && s < r.s1) return r.center;
  }
  let bestD = 55, target = null;
  for (const it of sweets.list) {
    if (it.collected) continue;
    const d = it.s - s;
    if (d < -2 || d > bestD) continue;
    if (it.fork && track.routes.choice(it.fork) !== it.branch) continue;
    bestD = d; target = it.lateral;
  }
  if (target !== null) return THREE.MathUtils.clamp(target, -5.6, 5.6);
  return Math.sin(s * 0.021) * 0.4;
}

function remoteDriveActive() {
  return game.driverMode === 'remote' && !game.autoAssist && !!remoteCtrl && remoteCtrl.fresh();
}

function vrEffectiveSteer() {
  // Ни thumbs-up, ни V не рулят: пока жестовый режим не получил руление,
  // сохраняем безопасный автопилот по трассе.
  if (remoteDriveActive()) return remoteCtrl.steer();
  return vrSteer();
}

function gestureThrottle() {
  const t = camTracker;
  // Жестовый режим — fail-stop: камера/рука устарели или большого пальца
  // нет, возвращаем ровно 0, а не автопилотный throttle.
  return t && t.thumbFresh(700) && t.thumbUp ? 1 : 0;
}

function vrEffectiveThrottle() {
  if (game.driverMode === 'gesture') return gestureThrottle();
  // null означает «джойстик сейчас не управляет» — тогда сохраняется
  // прежний мягкий фолбэк на автопилот. Ноль — настоящий свежий отпуск газа:
  // машина должна стоять, а не ехать на крейсерской скорости.
  return remoteDriveActive() ? remoteCtrl.throttle() : null;
}

let lastRemoteState = null;
function publishRemoteState() {
  lastRemoteState = {
    paused: game.state === 'paused', racing: game.state === 'racing',
    auto: !!game.autoAssist, look: vrSettings.lookMode, cm: vrSettings.baselineCm,
    muted: SFX.isMuted(), driver: game.vrRide ? game.driverMode : vrSettings.driverMode,
    speedKmh: +((game.speed || 0) * 3.6).toFixed(1),
    throttle: game.driverMode === 'gesture' ? gestureThrottle() : (remoteCtrl ? +remoteCtrl.throttle().toFixed(2) : 0),
    steer: remoteCtrl ? +remoteCtrl.steer().toFixed(2) : 0,
    cam: {
      on: isCameraLookMode() && !!game.camOn,
      found: !!(camTracker && camTracker.fresh(1200)),
      yaw: camTracker ? Math.round(camTracker.yaw) : 0,
      exit: camTracker ? camTracker.exitSideX : null,
      dual: !!(camTracker && camTracker.dual),
      visible: camTracker && camTracker.dual ? camTracker.dualVisible.length : null,
      lost: camTracker && camTracker.dual ? camTracker.lastLostMarker : null,
      gesture: !!(game.gestureOn && camTracker && camTracker.gestureV),
      thumb: !!(game.gestureOn && camTracker && camTracker.thumbUp),
      gestureDrive: game.driverMode === 'gesture',
      zoom: vr.zoomFactor(),
    },
  };
  if (remoteCtrl) remoteCtrl.publishState(lastRemoteState);
}

function executeRemoteCommand(name) {
  if (!game.vrRide && name !== 'menu') return;
  switch (name) {
    case 'restart': startVrRide(); break;
    case 'pauseToggle':
      if (game.state === 'paused') { resumeGame(); enterVrStereo(); }
      else if (game.state === 'racing') pauseGame();
      break;
    case 'autoToggle': game.autoAssist = !game.autoAssist; break;
    case 'lookToggle':
      if (isCameraLookMode()) { stopCamTracker(); vrSettings.lookMode = 'look'; }
      else vrSettings.lookMode = vrSettings.lookMode === 'look' ? 'forward' : 'look';
      vr.setLookMode(vrSettings.lookMode);
      vrSettings = Storage.saveVrSettings(vrSettings);
      break;
    case 'cmMinus':
    case 'cmPlus': {
      const d = name === 'cmPlus' ? 10 : -10;
      vrSettings.baselineCm = vr.setBaselineCm(vrSettings.baselineCm + d);
      vrSettings = Storage.saveVrSettings(vrSettings);
      break;
    }
    case 'muteToggle': SFX.toggleMute(); setSoundIcons(); break;
    case 'camToggle':
      if (isCameraLookMode() && game.vrRide) {
        game.camOn = !game.camOn;
        if (game.camOn) {
          game.gestureOn = gestureInputEnabled();
          const t = ensureCamTracker();
          t.setGestureEnabled(game.gestureOn);
          t.useWorkerMode();
          if (!t.running && !t.synthetic) t.start(el.vrCamVideo).catch(() => {});
        } else stopCamTracker(), game.camOn = false;
      }
      break;
    case 'finish': if (game.state === 'racing' || game.state === 'paused') finishRace(); break;
    case 'menu': exitVrToMenu(); break;
  }
  publishRemoteState();
}

function ensureRemote() {
  if (!remoteCtrl) {
    remoteCtrl = new RemoteControl();
    remoteCtrl.onCommand = executeRemoteCommand;
  }
  return remoteCtrl;
}

// ------------------------------------------------------------- камера-метка
let camTracker = null;
const camSmooth = { yaw: 0, pitch: 0 };
let camLastProcess = 0;
function ensureCamTracker() {
  if (!camTracker) camTracker = new CamTracker();
  const dual = vrSettings.lookMode === 'camera-dual';
  if (camTracker.dual !== dual) {
    camTracker.dual = dual;
    camTracker.c0n = null;
    camTracker.resetDualCalibration();
    camTracker.markers = [
      { id: 'left', found: false, count: 0 },
      { id: 'right', found: false, count: 0 },
    ];
    camTracker.found = false;
    camTracker.lastFoundAt = 0;
    camTracker.lastLostMarker = null;
    camTracker.lostMarkers = [];
    camTracker.dualVisible = [];
    camTracker.exitSideX = null;
    camTracker.exitSideY = null;
    resetCamLook();
  }
  camTracker.hue = vrSettings.camColor === 'custom' && Number.isFinite(vrSettings.camHue)
    ? vrSettings.camHue
    : (CAM_COLORS[vrSettings.camColor] || CAM_COLORS.raspberry).hue;
  camTracker.hueA = vrSettings.camLeftColor === 'custom' && Number.isFinite(vrSettings.camLeftHue)
    ? vrSettings.camLeftHue
    : (CAM_COLORS[vrSettings.camLeftColor] || CAM_COLORS.orange).hue;
  camTracker.hueB = vrSettings.camRightColor === 'custom' && Number.isFinite(vrSettings.camRightHue)
    ? vrSettings.camRightHue
    : (CAM_COLORS[vrSettings.camRightColor] || CAM_COLORS.raspberry).hue;
  camTracker.tol = vrSettings.camTol || 26;
  camTracker.satMin = (vrSettings.camSat || 42) / 100;
  camTracker.setGestureEnabled(gestureInputEnabled());
  return camTracker;
}
function syncCamColorUi() {
  const custom = vrSettings.camColor === 'custom' && Number.isFinite(vrSettings.camHue);
  const preset = CAM_COLORS[vrSettings.camColor] || CAM_COLORS.raspberry;
  el.vrCamSwatch.style.background = custom ? `hsl(${vrSettings.camHue} 90% 55%)` : preset.css;
  el.vrCamHueLabel.textContent = custom ? `Свой цвет, оттенок ${vrSettings.camHue}°` : preset.label;
  const leftCustom = vrSettings.camLeftColor === 'custom' && Number.isFinite(vrSettings.camLeftHue);
  const rightCustom = vrSettings.camRightColor === 'custom' && Number.isFinite(vrSettings.camRightHue);
  const left = CAM_COLORS[vrSettings.camLeftColor] || CAM_COLORS.orange;
  const right = CAM_COLORS[vrSettings.camRightColor] || CAM_COLORS.raspberry;
  el.vrCamLeftSwatch.style.background = leftCustom ? `hsl(${vrSettings.camLeftHue} 90% 55%)` : left.css;
  el.vrCamLeftLabel.textContent = leftCustom ? `Свой цвет, оттенок ${vrSettings.camLeftHue}°` : left.label;
  el.vrCamRightSwatch.style.background = rightCustom ? `hsl(${vrSettings.camRightHue} 90% 55%)` : right.css;
  el.vrCamRightLabel.textContent = rightCustom ? `Свой цвет, оттенок ${vrSettings.camRightHue}°` : right.label;
  el.vrCamTol.value = String(vrSettings.camTol || 26);
  el.vrCamTolVal.textContent = `±${vrSettings.camTol || 26}°`;
  el.vrCamSat.value = String(vrSettings.camSat || 42);
  el.vrCamSatVal.textContent = `${vrSettings.camSat || 42}%`;
}
function stopCamTracker() {
  game.camOn = false;
  game.gestureOn = false;
  if (camTracker) camTracker.stop();
  vr.setSimLook(null);
  vr.setGestureZoom(false);
  resetCamLook();
}
// Взгляд по камере. Ведёт его доказанное измерение: пара (обе метки в нужных
// местах — единственное доказательство, что взгляд «прямо») или одиночная
// подтверждённая метка нужной формы. Одиночная левая даёт поворот влево,
// правая — сильно вправо; вторую метку при этом не ищем (она вне кадра по
// геометрии). Пока не видно ни одной, взгляд не возвращается в центр сам:
// коротко доезжает по последнему вектору головы и затухает, дальше стоит.
// Центр может поставить только реально увиденная пара.
// Возврат метки в другом месте: переякорка после подтверждения вторым кадром
// (в VR вредно расхождение картинки с головой, а не сам «скачок» к истине).
let camSnapPending = null;
let camWasLost = false;
let camFollowing = false;      // прошлый кадр вёл взгляд по доказанной фиксации
let camRateHist = [];          // углы доказанных фиксаций — для вектора головы
let camCoastAt = 0;
// «Чуть ведут»: половина последней измеренной скорости головы, с потолком
// 12°/с, затухание ~0.55 с и не больше 8° на ось. Это выбег, а не возврат.
const CAM_COAST_GAIN = 0.5;
const CAM_COAST_MAX_DPS = 12;
const CAM_COAST_TAU_S = 0.55;
const CAM_COAST_MAX_DEG = 8;
const CAM_RATE_WINDOW_MS = 1200;
const CAM_RATE_MIN_MS = 250;
const CAM_RATE_MAX_DPS = 30;
let camCoast = { yaw: 0, pitch: 0, usedYaw: 0, usedPitch: 0, active: false };

function stopCamCoast() {
  camCoast.active = false;
  camCoast.yaw = 0; camCoast.pitch = 0;
  camCoast.usedYaw = 0; camCoast.usedPitch = 0;
}

function resetCamLook() {
  camSmooth.yaw = 0; camSmooth.pitch = 0;
  camSnapPending = null;
  camWasLost = false;
  camFollowing = false;
  camRateHist = [];
  camCoastAt = 0;
  camLastProcess = 0;
  stopCamCoast();
}

// Последний вектор движения головы: наклон угла по времени на окне 1.2 с.
// Берём только доказанные фиксации — по одной метке или чужому пятну
// скорость головы не оцениваем.
function noteCamFixation(now, yaw, pitch) {
  const h = camRateHist;
  // Длинная пауза между фиксациями (фриз, потеря) — это не движение головы:
  // историю начинаем заново, иначе наклон по старым и новым точкам даёт
  // ложную скорость и «выбег» уводит взгляд не туда.
  if (!h.length || now - h[h.length - 1].t > 500) h.length = 0;
  h.push({ t: now, yaw, pitch });
  while (h.length > 2 && now - h[0].t > CAM_RATE_WINDOW_MS) h.shift();
}

function camHeadRate(now = performance.now()) {
  const h = camRateHist;
  if (!h.length || now - h[h.length - 1].t > 400) return { yaw: 0, pitch: 0 };
  if (h.length < 3 || h[h.length - 1].t - h[0].t < CAM_RATE_MIN_MS) return { yaw: 0, pitch: 0 };
  const t0 = h[0].t;
  let n = 0, st = 0, sy = 0, sp = 0, stt = 0, sty = 0, stp = 0;
  for (const s of h) {
    const ts = (s.t - t0) / 1000;
    n++; st += ts; sy += s.yaw; sp += s.pitch;
    stt += ts * ts; sty += ts * s.yaw; stp += ts * s.pitch;
  }
  const den = n * stt - st * st;
  if (den <= 1e-9) return { yaw: 0, pitch: 0 };
  const cl = (v) => Math.max(-CAM_RATE_MAX_DPS, Math.min(CAM_RATE_MAX_DPS, Number.isFinite(v) ? v : 0));
  return { yaw: cl((n * sty - st * sy) / den), pitch: cl((n * stp - st * sp) / den) };
}

// Начало выбега от того угла, где взгляд реально стоит сейчас.
function startCamCoast(now) {
  const r = camHeadRate();
  const clamp = (v) => Math.max(-CAM_COAST_MAX_DPS, Math.min(CAM_COAST_MAX_DPS, v * CAM_COAST_GAIN));
  camCoast.yaw = clamp(r.yaw);
  camCoast.pitch = clamp(r.pitch);
  camCoast.usedYaw = 0; camCoast.usedPitch = 0;
  camCoast.active = Math.abs(camCoast.yaw) > 0.3 || Math.abs(camCoast.pitch) > 0.3;
  camCoastAt = now;
}

function stepCamCoast(now) {
  const dt = Math.max(0, Math.min(0.25, (now - camCoastAt) / 1000));
  camCoastAt = now;
  if (!camCoast.active || dt === 0) return;
  const roomY = Math.max(0, CAM_COAST_MAX_DEG - camCoast.usedYaw);
  const roomP = Math.max(0, CAM_COAST_MAX_DEG - camCoast.usedPitch);
  const dy = Math.sign(camCoast.yaw) * Math.min(Math.abs(camCoast.yaw) * dt, roomY);
  const dp = Math.sign(camCoast.pitch) * Math.min(Math.abs(camCoast.pitch) * dt, roomP);
  camSmooth.yaw += dy;
  camSmooth.pitch += dp;
  camCoast.usedYaw += Math.abs(dy);
  camCoast.usedPitch += Math.abs(dp);
  const k = Math.exp(-dt / CAM_COAST_TAU_S);
  camCoast.yaw *= k;
  camCoast.pitch *= k;
  if (Math.abs(camCoast.yaw) < 0.25) camCoast.yaw = 0;
  if (Math.abs(camCoast.pitch) < 0.25) camCoast.pitch = 0;
  if (!camCoast.yaw && !camCoast.pitch) camCoast.active = false;
}

function updateGestureZoom() {
  const t = camTracker;
  const active = !!(vr.active && game.vrRide && game.gestureOn && t && t.gestureFresh(700) && t.gestureV);
  vr.setGestureZoom(active);
}

function updateCameraLook(now, force = false) {
  const cameraLookActive = isCameraLookMode() && game.camOn;
  if (!game.vrRide || !camTracker || (!cameraLookActive && !game.gestureOn)) return;
  if (!force && now - camLastProcess < (camTracker.intervalMs || 90)) return;
  camLastProcess = now;
  // Even when «По метке» is off, the same Worker must keep feeding the V
  // gesture state. Gesture-only VR deliberately never changes vr.setSimLook.
  camTracker.process();
  if (!cameraLookActive) return;
  const t = camTracker;
  const pairFix = t.pairFixation();
  const singleFix = !pairFix && t.singleSteer();
  if (pairFix || singleFix) {
    // Доказанное измерение: пара ведёт взгляд, одиночная метка — в свою
    // сторону. «Прямо» по одной метке не заключаем никогда.
    const dy = t.yaw - camSmooth.yaw;
    const dp = t.pitch - camSmooth.pitch;
    const jump = Math.hypot(dy, dp);
    if (camSnapPending) {
      if (Math.abs(t.yaw - camSnapPending.yaw) < 3 && Math.abs(t.pitch - camSnapPending.pitch) < 3) {
        camSmooth.yaw = t.yaw; // переякорка подтверждена вторым кадром
        camSmooth.pitch = t.pitch;
        camSnapPending = null;
        camWasLost = false;
      } else {
        camSnapPending = { yaw: t.yaw, pitch: t.pitch }; // кадр не согласен — ждём ещё
        camSmooth.yaw += dy * 0.4;
        camSmooth.pitch += dp * 0.4;
      }
    } else if (camWasLost && jump > 8) {
      camSnapPending = { yaw: t.yaw, pitch: t.pitch }; // метка вернулась в другом месте
      camSmooth.yaw += dy * 0.4;
      camSmooth.pitch += dp * 0.4;
    } else {
      camWasLost = false;
      const f = Math.min(0.85, 0.4 + jump * 0.015); // догон пропорционален разрыву
      camSmooth.yaw += dy * f;
      camSmooth.pitch += dp * f;
    }
    // Резкий разрыв — это не скорость головы, а переякорка/вернувшаяся метка.
    // Такой кадр не должен потом «выбегать» взглядом: историю начинаем заново.
    if (!camFollowing || jump > 8) camRateHist = [];
    camFollowing = true;
    stopCamCoast();
    noteCamFixation(now, t.yaw, t.pitch);
    vr.setSimLook(camSmooth.yaw, camSmooth.pitch);
    return;
  }
  // Фиксации нет: не тянем взгляд ни к оставшейся метке, ни в центр. Если
  // голова только что шла — короткий выбег по последнему вектору и затухание,
  // иначе взгляд просто стоит на месте сколько угодно.
  camWasLost = true;
  camSnapPending = null;
  if (camFollowing) {
    camFollowing = false;
    startCamCoast(now); // первый кадр без фиксации угол ещё не меняет
  } else {
    stepCamCoast(now);
  }
  vr.setSimLook(camSmooth.yaw, camSmooth.pitch);
}

function closeRemote() {
  stopCamTracker();
  if (remoteCtrl) { remoteCtrl.close(); remoteCtrl = null; }
}

function vrSteer() {
  return THREE.MathUtils.clamp((vrSteerTarget() - game.lateral) * 0.55, -1, 1);
}

function requestFullscreenLandscape() {
  try {
    const root = document.documentElement;
    const req = root.requestFullscreen || root.webkitRequestFullscreen;
    if (req && !document.fullscreenElement) {
      const pr = req.call(root);
      if (pr && pr.catch) pr.catch(() => {});
      try { if (screen.orientation && screen.orientation.lock) screen.orientation.lock('landscape').catch(() => {}); } catch { /* ignore */ }
    }
  } catch { /* ignore */ }
}

function startVrRide() {
  if (vrSettings.driverMode !== 'remote' && remoteCtrl) closeRemote();
  game.camOn = isCameraLookMode();
  game.gestureOn = gestureInputEnabled();
  camSmooth.yaw = 0; camSmooth.pitch = 0;
  if (needsCameraInput()) {
    const t = ensureCamTracker();
    t.setGestureEnabled(game.gestureOn);
    t.useWorkerMode(); // анализ — вне главного потока, иначе проседает FPS
    if (!t.running && !t.synthetic) t.start(el.vrCamVideo).catch(() => {});
  }
  startRace(); // сбрасывает трассу/сладости; интро и 3-2-1 в очках не нужны
  game.vrRide = true;
  game.driverMode = vrSettings.driverMode === 'remote' || vrSettings.driverMode === 'gesture'
    ? vrSettings.driverMode : 'auto';
  if (game.driverMode === 'gesture') game.speed = 0; // no thumb means stopped from frame one
  game.autoAssist = false;
  game.vrPlan = planVrRide();
  game.state = 'racing';
  window.__GAME_STATE__ = 'racing';
  el.countdown.classList.add('hidden');
  hideVrPrep();
  enterVrStereo();
  try { history.pushState({ ckcVr: true }, ''); } catch { /* ignore */ }
  MUSIC.setMode('race', { restart: true });
  window.__VR_ACTIVE__ = true;
  publishRemoteState();
}

function enterVrStereo() {
  vr.start(vrSettings);
  document.body.classList.add('vr-active');
  // VR принадлежит самому себе: разрешение задаёт VR, тени 1024², bloom не считается.
  // Сначала VR-профиль губернатора (он не трогает pixelRatio в VR), потом разрешение.
  governor.setVr(true);
  // облегчённый стерео-рендер; в режиме камеры — ещё легче (телефон и так занят потоком)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, (isCameraLookMode() || game.gestureOn) ? 1.25 : 1.5));
  // первые кадры стерео всегда дороже (новые варианты программ, тени) — не судим их
  governor.hold(3);
}

function stopVrStereo() {
  if (!vr.active) return;
  vr.stop();
  document.body.classList.remove('vr-active');
  window.__VR_ACTIVE__ = false;
  try {
    if (document.fullscreenElement) {
      const pr = document.exitFullscreen();
      if (pr && pr.catch) pr.catch(() => {});
    }
  } catch { /* ignore */ }
  governor.setVr(false); // вернуть обычное разрешение, PCFSoft-тени и bloom по уровню
  camera.fov = 55;
  camera.updateProjectionMatrix();
  onResize();
}

function exitVrToMenu() {
  stopVrStereo();
  game.vrRide = false;
  toMenu();
}

// --- экран подготовки: режим взгляда, ползунок камер, обратный отсчёт
function updateRemoteUi() {
  const info = remoteCtrl ? remoteCtrl.info() : null;
  if (!info || !info.room) {
    el.vrRoomCode.classList.add('hidden');
    el.vrRoomStatus.textContent = 'Джойстик не подключён — до его появления ведёт автопилот';
    return;
  }
  el.vrRoomCode.textContent = info.room;
  el.vrRoomCode.classList.remove('hidden');
  el.vrRoomStatus.textContent = info.connected
    ? `🕹 Джойстик на связи${info.lastLagMs !== null ? ` · задержка ≈ ${info.lastLagMs} мс` : ''} — он ведёт машинку`
    : `Код комнаты ${info.room} — ждём джойстик на втором телефоне…`;
}
async function setupRemote(kind) {
  try {
    const rc = ensureRemote();
    if (kind === 'demo') rc.useDemo();
    else {
      const cfg = parseFirebaseConfig(el.vrCfg.value);
      await rc.connectFirebase(cfg);
      try { localStorage.setItem('ckc_stand_cfg', el.vrCfg.value); } catch { /* ignore */ }
    }
    const code = await rc.createRoom();
    publishRemoteState(); // джойстик видит экран сразу, ещё до старта поездки
    el.vrCfgStatus.textContent = `Комната создана: ${code}. Введите код на телефоне-джойстике.`;
  } catch (e) {
    el.vrCfgStatus.textContent = 'Ошибка комнаты: ' + (e && e.message ? e.message : e);
  }
  updateRemoteUi();
}

function updateCamPrepUi() {
  if (!camTracker) {
    el.vrCamStatus.textContent = 'Камера выключена. Включите камеру и наведите заднюю камеру на коробку.';
    el.vrCamDualStatus.textContent = 'Камера выключена. Включите камеру и наведите её на две коробки.';
    el.vrGestureStatus.textContent = gestureDriverEnabled()
      ? 'Жестовый ввод включит заднюю камеру только после старта VR: 👍 газ, ✌️ zoom.'
      : 'Жест V включит камеру только после старта VR.';
    return;
  }
  const info = camTracker.info();
  if (gestureInputEnabled()) {
    const vStatus = !info.gestureFresh
      ? '✌️ V не виден — zoom 1×.'
      : info.gestureV
        ? '✌️ V распознан — zoom включён.'
        : '✌️ поднимите указательный и средний пальцы.';
    const thumbStatus = !info.thumbFresh
      ? '👍 камера не видит руку — стоп.'
      : info.thumbUp
        ? '👍 большой палец виден — газ.'
        : '👍 большой палец не поднят — стоп.';
    el.vrGestureStatus.textContent = gestureDriverEnabled()
      ? `${thumbStatus} ${vStatus} Руление — автопилот.`
      : vStatus;
  }
  if (vrSettings.lookMode === 'camera-dual') {
    el.vrCamDualStatus.textContent = !info.running && !info.synthetic
      ? 'Камера выключена. Включите камеру и наведите её на две коробки.'
      : info.dualCalibrated
        ? `✅ В кадре: ${info.dualVisible.length}/2 метки · yaw ${info.yaw}°, pitch ${info.pitch}° · ${info.procMs} мс${info.lastLostMarker ? ` · ушла ${info.lastLostMarker === 'left' ? 'левая' : info.lastLostMarker === 'right' ? 'правая' : 'обе'}` : ''}`
        : `В кадре: ${info.dualVisible.length}/2 метки. Поставьте обе симметрично и нажмите «Калибровать: прямо».`;
    return;
  }
  el.vrCamStatus.textContent = !info.running && !info.synthetic
    ? 'Камера выключена. Включите камеру и наведите заднюю камеру на коробку.'
    : info.found
      ? `✅ Метка видна: yaw ${info.yaw}°, pitch ${info.pitch}° · обработка ${info.procMs} мс. Нажмите «Смотрю на метку», когда она прямо перед вами.`
      : 'Метка не видна: проверьте цвет (или «Взять цвет коробки») и освещение.';
}
function syncVrUi() {
  const dual = vrSettings.lookMode === 'camera-dual';
  el.vrModeCamera.setAttribute('aria-pressed', String(vrSettings.lookMode === 'camera'));
  el.vrModeCameraDual.setAttribute('aria-pressed', String(dual));
  el.vrGestureZoom.setAttribute('aria-pressed', String(!!vrSettings.gestureZoom));
  el.vrGestureZoom.textContent = vrSettings.gestureZoom ? '✌️ Жест V — зум включён' : '✌️ Жест V — включить зум';
  el.vrGestureStatus.textContent = vrSettings.gestureZoom
    ? 'После старта VR задняя камера ищет V-жест. Ладонь держите в её поле зрения.'
    : 'Опционально: включает заднюю камеру только ради жеста и не меняет обычный режим.';
  // Gesture-only driving still needs the rear-camera controls/status visible.
  el.vrCamPanel.classList.toggle('hidden', !(isCameraLookMode() || gestureInputEnabled()));
  el.vrCamSingleControls.classList.toggle('hidden', dual);
  el.vrCamDualControls.classList.toggle('hidden', !dual);
  if (isCameraLookMode() && camTracker) ensureCamTracker();
  document.querySelectorAll('.vr-cam-color').forEach((b) =>
    b.setAttribute('aria-pressed', String(vrSettings.camColor === b.dataset.color)));
  document.querySelectorAll('.vr-cam-dual-preset').forEach((b) => {
    const selected = b.dataset.side === 'left'
      ? vrSettings.camLeftColor === b.dataset.color
      : vrSettings.camRightColor === b.dataset.color;
    b.setAttribute('aria-pressed', String(selected));
  });
  syncCamColorUi();
  el.vrModeLook.setAttribute('aria-pressed', String(vrSettings.lookMode === 'look'));
  el.vrModeForward.setAttribute('aria-pressed', String(vrSettings.lookMode === 'forward'));
  el.vrIpd.value = String(vrSettings.baselineCm);
  el.vrIpdVal.textContent = `${vrSettings.baselineCm} см`;
  const gestureDriver = gestureDriverEnabled();
  el.vrDriverAuto.setAttribute('aria-pressed', String(vrSettings.driverMode === 'auto'));
  el.vrDriverGesture.setAttribute('aria-pressed', String(gestureDriver));
  el.vrDriverRemote.setAttribute('aria-pressed', String(vrSettings.driverMode === 'remote'));
  el.vrRemotePanel.classList.toggle('hidden', vrSettings.driverMode !== 'remote');
  if (gestureDriver) {
    vrSettings.gestureZoom = true;
    el.vrGestureZoom.setAttribute('aria-pressed', 'true');
    el.vrGestureZoom.textContent = '👍✌️ Жесты включены';
    el.vrGestureStatus.textContent = 'Режим без джойстика: 👍 виден — газ, 👍 пропал — стоп; ✌️ — zoom. Руление остаётся автопилотом.';
  }
  updateRemoteUi();
}
function saveVrUi() {
  vrSettings = Storage.saveVrSettings(vrSettings);
  syncVrUi();
}
function openVrPrep() {
  syncVrUi();
  el.vrScreen.classList.remove('hidden');
}
function hideVrPrep() {
  stopVrCountdown();
  el.vrScreen.classList.add('hidden');
}
let vrCountTimer = null;
function stopVrCountdown() {
  if (vrCountTimer) { clearInterval(vrCountTimer); vrCountTimer = null; }
  el.vrCount.classList.add('hidden');
  el.btnVrStart.disabled = false;
}
el.btnVr.addEventListener('click', () => { SFX.unlock(); SFX.play('click'); openVrPrep(); });
el.btnVrCancel.addEventListener('click', () => { SFX.play('click'); hideVrPrep(); });
el.vrModeLook.addEventListener('click', () => { vrSettings.lookMode = 'look'; saveVrUi(); SFX.play('click'); });
function selectDriverMode(mode) {
  vrSettings.driverMode = mode === 'remote' || mode === 'gesture' ? mode : 'auto';
  if (vrSettings.driverMode === 'gesture') vrSettings.gestureZoom = true;
  if (vrSettings.driverMode !== 'remote' && remoteCtrl) closeRemote();
  saveVrUi();
  SFX.play('click');
}
el.vrDriverAuto.addEventListener('click', () => selectDriverMode('auto'));
el.vrDriverGesture.addEventListener('click', () => selectDriverMode('gesture'));
el.vrDriverRemote.addEventListener('click', () => selectDriverMode('remote'));
el.vrCfgConnect.addEventListener('click', () => { SFX.play('click'); setupRemote('firebase'); });
el.vrRoomDemo.addEventListener('click', () => { SFX.play('click'); setupRemote('demo'); });
try {
  const savedCfg = localStorage.getItem('ckc_stand_cfg');
  if (savedCfg) el.vrCfg.value = savedCfg;
} catch { /* ignore */ }
setInterval(updateRemoteUi, 700);
setInterval(() => { if (remoteCtrl && remoteCtrl.room) publishRemoteState(); }, 5000);
el.vrModeForward.addEventListener('click', () => { vrSettings.lookMode = 'forward'; saveVrUi(); SFX.play('click'); });
el.vrModeCamera.addEventListener('click', () => { vrSettings.lookMode = 'camera'; saveVrUi(); SFX.play('click'); });
el.vrModeCameraDual.addEventListener('click', () => { vrSettings.lookMode = 'camera-dual'; saveVrUi(); SFX.play('click'); });
el.vrGestureZoom.addEventListener('click', () => {
  if (gestureDriverEnabled()) return; // combined mode deliberately keeps both gestures on
  vrSettings.gestureZoom = !vrSettings.gestureZoom;
  saveVrUi();
  SFX.play('click');
});
el.vrCamStart.addEventListener('click', async () => {
  SFX.play('click');
  try {
    await ensureCamTracker().start(el.vrCamVideo);
    el.vrCamStatus.textContent = 'Камера работает. Поднесите коробку в центр кадра и нажмите «Взять цвет коробки».';
  } catch (e) {
    el.vrCamStatus.textContent = 'Камера недоступна: ' + (e && e.message ? e.message : e) + ' (нужны HTTPS и разрешение).';
  }
  updateCamPrepUi();
});
el.vrCamSample.addEventListener('click', () => {
  SFX.play('click');
  const t = ensureCamTracker();
  t.processMain();
  const hue = t.sampleColor();
  if (hue === null) { el.vrCamStatus.textContent = 'В центре кадра нет насыщенного цвета — поднесите коробку ближе.'; return; }
  vrSettings.camColor = 'custom'; vrSettings.camHue = hue;
  saveVrUi();
  syncCamColorUi();
  el.vrCamStatus.textContent = `Цвет коробки запомнен (оттенок ${hue}°). Теперь поставьте её перед собой и нажмите «Смотрю на метку».`;
});
el.vrCamCalib.addEventListener('click', () => {
  SFX.play('click');
  const t = ensureCamTracker();
  t.processMain();
  t.calibrate();
  el.vrCamStatus.textContent = t.found ? 'Ноль выставлен: метка перед вами — это «вперёд». Можно надевать очки!' : 'Метка не видна — ноль выставлен по центру кадра. Лучше повторить, когда метка видна.';
});
function sampleDualColor(side) {
  SFX.play('click');
  const t = ensureCamTracker();
  t.processMain();
  const hue = t.sampleColor();
  if (hue === null) {
    el.vrCamDualStatus.textContent = 'В прицеле нет насыщенного цвета — поднесите нужную коробку в центр.';
    return;
  }
  if (side === 'left') { vrSettings.camLeftColor = 'custom'; vrSettings.camLeftHue = hue; }
  else { vrSettings.camRightColor = 'custom'; vrSettings.camRightHue = hue; }
  saveVrUi();
  el.vrCamDualStatus.textContent = `${side === 'left' ? 'Левый' : 'Правый'} цвет запомнен: оттенок ${hue}°. Теперь проверьте обе метки.`;
}
el.vrCamSampleLeft.addEventListener('click', () => sampleDualColor('left'));
el.vrCamSampleRight.addEventListener('click', () => sampleDualColor('right'));
el.vrCamDualCalib.addEventListener('click', () => {
  SFX.play('click');
  const t = ensureCamTracker();
  t.processMain();
  const ok = t.calibrate();
  el.vrCamDualStatus.textContent = ok
    ? 'Ноль выставлен по середине двух меток. Теперь можно надевать очки.'
    : 'Нужно, чтобы обе метки были видны одновременно. Расставьте их слева/справа и повторите.';
});
document.querySelectorAll('.vr-cam-dual-preset').forEach((b) => b.addEventListener('click', () => {
  if (b.dataset.side === 'left') { vrSettings.camLeftColor = b.dataset.color; vrSettings.camLeftHue = null; }
  else { vrSettings.camRightColor = b.dataset.color; vrSettings.camRightHue = null; }
  ensureCamTracker(); saveVrUi(); SFX.play('click');
}));

el.vrCamTol.addEventListener('input', () => {
  vrSettings.camTol = +el.vrCamTol.value;
  el.vrCamTolVal.textContent = `±${el.vrCamTol.value}°`;
  ensureCamTracker();
});
el.vrCamTol.addEventListener('change', () => { vrSettings.camTol = +el.vrCamTol.value; saveVrUi(); });
el.vrCamSat.addEventListener('input', () => {
  vrSettings.camSat = +el.vrCamSat.value;
  el.vrCamSatVal.textContent = `${el.vrCamSat.value}%`;
  ensureCamTracker();
});
el.vrCamSat.addEventListener('change', () => { vrSettings.camSat = +el.vrCamSat.value; saveVrUi(); });
document.querySelectorAll('.vr-cam-color').forEach((b) => b.addEventListener('click', () => {
  vrSettings.camColor = b.dataset.color; vrSettings.camHue = null;
  ensureCamTracker();
  saveVrUi();
  SFX.play('click');
}));
setInterval(() => {
  if (!el.vrScreen.classList.contains('hidden') && camTracker && (camTracker.running || camTracker.synthetic) && !game.vrRide) {
    camTracker.processMain();
    updateCamPrepUi();
  }
}, 150);
el.vrIpd.addEventListener('input', () => {
  vrSettings.baselineCm = +el.vrIpd.value;
  el.vrIpdVal.textContent = `${vrSettings.baselineCm} см`;
});
el.vrIpd.addEventListener('change', () => { vrSettings.baselineCm = +el.vrIpd.value; saveVrUi(); });
el.btnVrStart.addEventListener('click', async () => {
  SFX.unlock();
  SFX.play('click');
  vrSettings.baselineCm = +el.vrIpd.value;
  saveVrUi();
  requestFullscreenLandscape();
  stopVrCountdown();
  el.btnVrStart.disabled = true;

  // Request camera permission synchronously from this user tap, before the
  // delayed 5-second countdown. Browsers may reject getUserMedia when it is
  // first called from the timer; that used to be swallowed in startVrRide().
  if (needsCameraInput()) {
    try {
      const tracker = ensureCamTracker();
      tracker.setGestureEnabled(gestureInputEnabled());
      await tracker.start(el.vrCamVideo);
      tracker.useWorkerMode();
      updateCamPrepUi();
      if (gestureInputEnabled()) {
        el.vrGestureStatus.textContent = '✅ Задняя камера разрешена и включена. Жесты обрабатываются локально; проверь распознавание в комнате «Проверка жестов».';
      }
    } catch (e) {
      const message = e && e.message ? e.message : String(e);
      const status = `Камера не запустилась: ${message}. Нужны HTTPS, разрешение и задняя камера.`;
      el.vrCamStatus.textContent = status;
      if (gestureInputEnabled()) el.vrGestureStatus.textContent = status;
      el.btnVrStart.disabled = false;
      return;
    }
  }

  // Теперь permission уже получен в обработчике пользовательского нажатия;
  // отсчёт нужен только чтобы успеть надеть очки.
  el.vrCount.classList.remove('hidden');
  let left = 5;
  el.vrCountNum.textContent = String(left);
  vrCountTimer = setInterval(() => {
    left -= 1;
    if (left <= 0) { stopVrCountdown(); startVrRide(); }
    else el.vrCountNum.textContent = String(left);
  }, 900);
});
// системная «Назад» во время поездки — выход из VR в меню
window.addEventListener('popstate', () => {
  if (vr.active || (game.vrRide && game.state === 'racing')) exitVrToMenu();
});

// any tap during the cinematic intro jumps straight to the 3-2-1
window.addEventListener('pointerdown', () => { if (game.state === 'intro') skipIntro(); }, { capture: true });

// backgrounding (app switch, screen off, tab change) pauses the race and
// silences the engine — a kid never comes back to a lost run
document.addEventListener('visibilitychange', () => {
  if (document.hidden && (game.state === 'racing' || game.state === 'countdown' || game.state === 'intro')) {
    pauseGame();
  }
});

function onResize() {
  const w = window.innerWidth, h = window.innerHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
  composer.setSize(w, h);
  bloom.setSize(w, h);
  // сняли очки и повернули телефон вертикально — VR-поездка завершается в меню
  if (vr.active && game.state === 'racing' && h > w) exitVrToMenu();
}
window.addEventListener('resize', onResize);
window.addEventListener('orientationchange', () => setTimeout(onResize, 250));

// ---------------------------------------------------------------- gameplay
// ---------------------------------------------------------------- jump ramps
function resetJump() {
  game.air = 0; game.vy = 0; game.jump = 'ground'; game.jumpRamp = null;
  game.jumpT = 0; game.carPitch = 0; game.landSquash = 0; game.camKick = 0; game.bigAir = false;
  game.dropSide = 0; game.bounces = 0; game.carRoll = 0;
  car.root.scale.setScalar(1);
  car.root.rotation.z = 0;
}

function launchFromRamp(r) {
  // arcade parabola: lift comes from the ramp angle and the current speed;
  // with the rocket boost on, the car is both faster and gets extra lift,
  // so the jump is noticeably higher and longer
  const boosted = game.boostActive;
  game.jump = 'air';
  game.air = r.height;
  game.vy = game.speed * Math.sin(r.angle) * JUMP.launchK * (boosted ? JUMP.boostK : 1);
  game.jumpT = 0;
  game.bigAir = boosted;
  SFX.play('jump');
  HAPTIC.buzz(boosted ? [20, 30, 40] : 18);
  hud.popup(boosted ? '🚀✨' : '✨', boosted ? '#ffd166' : '#fff6a8');
  // sparkle puff off the lip
  const lip = car.root.position.clone();
  lip.y -= 0.3;
  finishFx.spawn(lip, boosted ? '#ffd166' : '#fff6a8', boosted ? 22 : 12, boosted ? 6.5 : 4.5);
  if (boosted) finishFx.spawn(lip, '#ff8fc6', 14, 5.5);
}

function dropOffRamp(r) {
  // more than half the car slid off the ramp's side: it tips over the edge
  // and falls from the current height, loses a bit of speed, bounces on its
  // wheels once or twice and drives on
  game.jump = 'drop';
  game.vy = 0;
  game.jumpT = 0;
  game.bounces = 0;
  game.dropSide = game.lateral > r.center ? 1 : -1; // which side it tipped to
  game.speed *= JUMP.dropSlow;
  SFX.play('bump');
  HAPTIC.buzz(20);
}

function bounceCar(floor) {
  // wheels hit the ground hard: squash and pop back up a little
  game.bounces += 1;
  game.air = floor;
  game.vy = -game.vy * JUMP.bounce;
  game.landSquash = 0.3;
  game.camKick = 0.25;
  SFX.play('land');
  HAPTIC.buzz(30);
}

function landCar(onWedge) {
  const hard = game.vy < -4;
  const big = game.bigAir && game.jumpT > 1.6;
  if (onWedge) {
    // came down on a ramp surface: ride it like a normal entry
    game.air = onWedge.h; game.vy = 0; game.jump = 'ramp'; game.jumpRamp = onWedge.ramp;
  } else {
    game.air = 0; game.vy = 0; game.jump = 'ground'; game.jumpRamp = null;
  }
  game.dropSide = 0;
  game.landSquash = hard ? 0.42 : 0.26;
  game.camKick = hard ? 0.35 : 0.18;
  game.bigAir = false;
  SFX.play('land');
  HAPTIC.buzz(hard ? [35, 25, 45] : 25);
  if (big) {
    // a long boosted flight ends with a little celebration
    hud.popup('🌟', '#ffd45e');
    finishFx.spawn(car.root.position.clone(), '#ffd45e', 18, 5);
  }
}

function updateJump(dt) {
  const rs = ramps.sample(game.s, game.lateral);
  const onWedge = !!(rs.ramp && rs.inside && !rs.past);
  if (game.jump === 'ground' || game.jump === 'ramp') {
    if (onWedge) {
      // climbing the run-up: ride the wedge surface
      game.jump = 'ramp';
      game.jumpRamp = rs.ramp;
      game.air = THREE.MathUtils.lerp(game.air, rs.h, 1 - Math.exp(-14 * dt)); // snaps up quickly when entering from the side
      game.vy = 0;
    } else if (game.jump === 'ramp') {
      const r = game.jumpRamp;
      if (game.s >= r.s1 - 0.35) launchFromRamp(r); // over the lip
      else dropOffRamp(r);                          // slid off the side
    } else {
      game.air = 0;
    }
  }
  if (game.jump === 'air' || game.jump === 'drop') {
    game.vy -= JUMP.gravity * dt;
    game.air += game.vy * dt;
    game.jumpT += dt;
    const floor = onWedge ? rs.h : 0; // steering back over a wedge lands on it
    if (game.air <= floor) {
      if (game.jump === 'drop' && game.vy < -2.2 && game.bounces < 2) bounceCar(floor);
      else landCar(onWedge ? rs : null);
    }
  }
  // roll: tips toward the side it fell off, settles back once on the wheels
  const rollTarget = game.jump === 'drop' ? game.dropSide * 0.3 : 0;
  game.carRoll = THREE.MathUtils.lerp(game.carRoll, rollTarget, 1 - Math.exp(-(game.jump === 'drop' ? 7 : 5) * dt));
  if (game.landSquash > 0) game.landSquash = Math.max(0, game.landSquash - dt);
  if (game.camKick > 0) game.camKick = Math.max(0, game.camKick - dt * 1.6);
}

// At the bottom of the hanging bridge, aiming at the distant uphill road
// alone tilts the camera up and crops the car. Keep most of the local tangent
// framing while retaining the road's rise farther ahead. This has no effect
// outside the bridge or on convex crests (the approach still looks downhill).
function chaseTarget(s, ahead, pose = track.getPose(s)) {
  const target = ahead.pos.clone().add(new THREE.Vector3(0, 1.05, 0));
  const B = track.cakeSection.bridge;
  if ((s >= B.s0 && s <= B.s1) || track.routes.at(s)) {
    const tangentY = pose.pos.y + pose.tangent.y * TUNING.camAhead;
    target.y -= Math.max(0, ahead.pos.y - tangentY) * 0.85;
  }
  return target;
}

function updateGameplay(dt) {
  // cinematic intro: camera starts front-top, sweeps around, settles behind
  if (game.state === 'intro') {
    game.introT += dt;
    const T = 6;
    const p = Math.min(1, game.introT / T);
    const e = p * p * (3 - 2 * p); // smoothstep
    const pose = track.getPose(game.s, game.lateral);
    const chase = track.getPose(Math.max(0, track.advance(game.s, -TUNING.camBack)), game.lateral * 0.55 - TUNING.camSide);
    if (game.s < TUNING.camBack) {
      const p0 = track.getPose(0, game.lateral * 0.55);
      const t0 = track.getPose(Math.min(track.length, 8), game.lateral * 0.55);
      const dir = t0.pos.clone().sub(p0.pos).normalize();
      chase.pos.copy(p0.pos).addScaledVector(dir, game.s - TUNING.camBack);
    }
    const chaseAhead = track.getPose(Math.min(track.length, track.advance(game.s, TUNING.camAhead)), game.lateral * 0.22);
    const w0 = track.getPose(Math.min(track.length, game.s + 15), 0).pos.clone().add(new THREE.Vector3(0, 9.5, 0));
    const w1 = track.getPose(game.s + 7, -12).pos.clone().add(new THREE.Vector3(0, 6.5, 0));
    const w2 = track.getPose(Math.max(0, game.s - 2), -11).pos.clone().add(new THREE.Vector3(0, 5, 0));
    const w3 = chase.pos.clone().add(new THREE.Vector3(0, TUNING.camUp + 0.6, 0));
    const camCurve = new THREE.CatmullRomCurve3([w0, w1, w2, w3], false, 'catmullrom', 0.5);
    game.camPos.copy(camCurve.getPoint(e));
    // keep the car in frame throughout; by the end we look just over the hood
    const tgt = pose.pos.clone().add(new THREE.Vector3(0, 1.75, 0))
      .lerp(chaseAhead.pos.clone().add(new THREE.Vector3(0, 1.15, 0)), e * e * 0.55);
    game.camTarget.copy(tgt);
    camera.position.copy(game.camPos);
    camera.lookAt(game.camTarget);
    camera.fov = THREE.MathUtils.lerp(camera.fov, 54, dt * 2);
    camera.updateProjectionMatrix();
    car.root.position.copy(pose.pos);
    car.root.position.y += 0.02;
    car.root.rotation.y = pose.heading;
    car.update(dt, { speed: 0, steer: 0, boost: false });
    const knocked = world.update(dt, camera.position, game.s / track.length, performance.now() * 0.001, -1, 0);
    bridge.update(dt, performance.now() * 0.001);
    tunnelTick(dt, game.s);
    ambient.update(dt, camera.position, game.s / track.length, 0, Math.max(tunnel.darkness(game.s), forks.darkness(game.s)));
    landmarks.update(dt);
    finishFx.update(dt);
    if (game.introT >= T && game.state === 'intro') beginCountdown();
    return;
  }

  // countdown
  if (game.state === 'countdown') {
    game.countdownT += dt;
    const n = 3 - Math.floor(game.countdownT / 0.72);
    if (n !== game.countdownN) {
      game.countdownN = n;
      if (n > 0) { el.countdownNum.textContent = String(n); SFX.play('beep'); }
      else {
        // 3,2,1 → digits vanish at zero; the race just begins
        el.countdown.classList.add('hidden');
        SFX.play('go');
        MUSIC.setMode('race', { restart: true }); // band kicks in on the downbeat
        game.state = 'racing';
        window.__GAME_STATE__ = 'racing';
        game.goHideT = 0;
      }
    }
    if (game.state === 'countdown') {
      // gentle roll-in while counting
      game.speed = THREE.MathUtils.lerp(game.speed, TUNING.cruiseSpeed * 0.55, dt * 1.2);
      game.s += game.speed * dt * 0.35;
    }
  }

  // GO! fade-out — independent of state so it can never get stuck
  if (game.goHideT > 0) {
    game.goHideT -= dt;
    if (game.goHideT <= 0) el.countdown.classList.add('hidden');
  }

  const racing = game.state === 'racing';

  // speed: only a fresh external joystick introduces a manual throttle.
  // Its vertical sensor maps directly to 0..maxSpeed; released/no gas is
  // deliberately a full stop so the player can stay still and look around.
  const remoteThrottle = vrEffectiveThrottle();
  const manualThrottle = remoteThrottle !== null;
  const offRoad = Math.abs(game.lateral) > TUNING.roadHalfWidth + 1.0;
  const remoteTarget = manualThrottle
    ? (game.boostActive && remoteThrottle > 0.02 ? TUNING.boostSpeed : remoteThrottle * TUNING.maxSpeed) * (offRoad ? TUNING.offRoadSlow : 1)
    : null;
  const target = game.freeze ? 0 : manualThrottle
    ? remoteTarget
    : (game.boostActive ? TUNING.boostSpeed : (offRoad ? TUNING.cruiseSpeed * TUNING.offRoadSlow : game.boostCharges >= 4 ? TUNING.maxSpeed : TUNING.cruiseSpeed));
  const speedResponse = manualThrottle ? (remoteThrottle <= 0.001 ? 7.5 : 3.2) : (game.boostActive ? 1.6 : 0.9);
  game.speed = THREE.MathUtils.lerp(game.speed, target, dt * speedResponse);

  if (racing) {
    game.timeS += dt;

    // boost auto-trigger when full
    if (!game.boostActive && game.boostCharges >= TUNING.boostCharges && (!manualThrottle || remoteThrottle > 0.02)) {
      game.boostActive = true;
      game.boostT = TUNING.boostDuration;
      game.boostCharges = 0;
      SFX.play('boost');
      HAPTIC.buzz([25, 35, 45]);
      hud.popup('🚀');
      MUSIC.setMode('boost');
    }
    if (game.boostActive) {
      game.boostT -= dt;
      if (game.boostT <= 0) { game.boostActive = false; MUSIC.setMode('race'); }
    }

    // steering (only a little authority while airborne)
    const steer = qaSteer !== null ? qaSteer : (game.vrRide ? vrEffectiveSteer() : input.steer);
    game.vrSteer = steer;
    const airborne = game.jump === 'air' || game.jump === 'drop';
    game.lateral += steer * TUNING.steerSpeed * dt * (0.72 + 0.28 * Math.min(1, game.speed / TUNING.cruiseSpeed)) * (airborne ? JUMP.airSteer : 1);
    if (steer === 0 && !airborne) {
      // gentle auto-center so the road always guides home
      const center = Math.sin(game.s * 0.021) * 1.15; // visual drift line
      game.lateral = THREE.MathUtils.lerp(game.lateral, center * 0.35, dt * TUNING.steerReturn * 0.35);
    }
    // soft walls: mistakes only cost time/reward
    const limit = TUNING.shoulderLimit;
    if (Math.abs(game.lateral) > limit) {
      game.lateral = Math.sign(game.lateral) * limit;
      game.speed *= 0.985;
      game.bumpCooldown -= dt;
      if (game.bumpCooldown <= 0) {
        SFX.play('bump');
        game.bumpCooldown = 0.55;
      }
    } else {
      game.bumpCooldown = Math.min(game.bumpCooldown, 0.2);
    }

    // progress
    // Choose silently: the player discovers destinations rather than receiving
    // directional prompts or a selection confirmation during the ride.
    track.routes.update(game.s, game.lateral, steer, game.speed * dt);
    game.s = track.advance(game.s, game.speed * dt);
    if (game.s >= track.length) {
      game.s = track.length;
      finishRace();
    }
  }

  // ramps: climb, launch, fly, land
  updateJump(dt);

  // sweets collection (also works in countdown-roll-in, harmless)
  const events = sweets.update(dt, game.s, game.lateral, performance.now() * 0.001, game.air);
  for (const ev of events) {
    game.score += ev.points;
    if (ev.type === 'star') { game.stars += 1; SFX.play('star'); HAPTIC.buzz(15); hud.popup('⭐', '#ffd45e'); }
    else if (ev.type === 'cupcake') {
      game.boostCharges = Math.min(TUNING.boostCharges, game.boostCharges + 1);
      game.stars += 1;
      SFX.play('cupcake');
      HAPTIC.buzz(20);
      hud.popup('🧁', '#ff9ed2');
    } else {
      SFX.play('candy');
      HAPTIC.buzz(8);
      hud.popup('🍬', '#fff');
    }
  }

  // car pose
  const pose = track.getPose(game.s, game.lateral);
  car.root.position.copy(pose.pos);
  car.root.position.y += 0.02 + game.air;
  car.root.rotation.y = pose.heading;
  // lean into the road slope; nose up on the ramp, follow the arc in the air
  // The dipped bridge is steeper than the ordinary road: align the chassis
  // to that deck rather than leaving the front/rear wheels inside the wafer.
  const sky = track.cakeSection.bridge;
  const onSkyBridge = game.s >= sky.s0 && game.s <= sky.s1;
  let pitch = -pose.pitch * (onSkyBridge || track.routes.at(game.s) ? 1 : 0.65);
  if (game.jump === 'ramp') pitch -= game.jumpRamp.angle;
  else if (game.jump === 'air' || game.jump === 'drop') pitch -= Math.atan2(game.vy, Math.max(4, game.speed)) * 0.55;
  game.carPitch = THREE.MathUtils.lerp(game.carPitch, pitch, 1 - Math.exp(-9 * dt));
  car.root.rotation.x = game.carPitch;
  car.root.rotation.z = game.carRoll;
  // landing squash: a quick jelly bounce of the whole car
  if (game.landSquash > 0) {
    const k = Math.sin((game.landSquash / 0.42) * Math.PI) * Math.min(1, game.landSquash / 0.42 + 0.4);
    car.root.scale.set(1 + k * 0.10, 1 - k * 0.20, 1 + k * 0.06);
  } else car.root.scale.setScalar(1);
  car.update(dt, {
    speed: game.speed,
    steer: (game.vrRide ? game.vrSteer : input.steer) || (game.lateral < -0.3 ? -0.25 : game.lateral > 0.3 ? 0.25 : 0),
    boost: game.boostActive,
    offRoad: Math.abs(game.lateral) > TUNING.roadHalfWidth + 0.6,
  });
  trail.update(dt, car.root, game.speed, game.boostActive);

  // camera: readable chase view with a slight 3/4 flank offset
  // (getPose extrapolates along the pseudo road behind the start, so the
  // camera is framed normally from the very first frame)
  const spdK = Math.min(1, game.speed / TUNING.maxSpeed);
  const back = track.getPose(track.advance(game.s, -(TUNING.camBack + spdK * 0.7)), game.lateral * 0.55 - TUNING.camSide);
  const ahead = track.getPose(track.advance(game.s, TUNING.camAhead), game.lateral * 0.22 + TUNING.camSide * 1.15);
  const desiredPos = back.pos.clone().add(new THREE.Vector3(0, TUNING.camUp + 0.6 + game.air * 0.35, 0));
  const desiredTgt = chaseTarget(game.s, ahead, pose);
  desiredTgt.y += game.air * 0.7;
  const k = game.camSnap ? 1 : 1 - Math.exp(-TUNING.camLerp * dt);
  game.camSnap = false;
  game.camPos.lerp(desiredPos, k);
  game.camTarget.lerp(desiredTgt, k);
  camera.position.copy(game.camPos);
  camera.lookAt(game.camTarget);
  // speed feel: micro shake that grows with speed, lean into the steering
  // При zoom жестом убираем большую часть игровой тряски; поворот головы
  // всё ещё остаётся лёгким корректором направления приближения в VRController.
  const shake = ((game.boostActive ? 0.055 : 0.013) * spdK + game.camKick * 0.5) * vr.zoomShakeFactor();
  if (shake > 0.001) {
    const tn = performance.now() * 0.001;
    camera.position.x += Math.sin(tn * 37.1) * shake;
    camera.position.y += Math.sin(tn * 53.3 + 1.7) * shake * 0.6;
  }
  camera.rotateZ(-((game.vrRide ? game.vrSteer : input.steer) || 0) * 0.02);
  vr.applyLook(camera, dt); // взгляд: углы метки (готовит updateCameraLook) или мягкий авто-обзор; гироскопа нет
  // FOV reads the actual speed, not just the boost button: the world opens up
  // as the car winds up, and boost adds its own extra kick on top.
  // normalised over the speeds the car actually reaches (cruise → flat out),
  // so the widening is felt inside a normal run, not only near the cap
  const spdN = Math.min(1, Math.max(0, (game.speed - 8) / 13.5));
  const fovTarget = 50 + spdN * 8 + (game.boostActive ? 4.5 : 0);
  // camera.fov already contains the previous zoomed value; recover the
  // unzoomed base first, otherwise repeated frames would divide the FOV again.
  const baseFov = camera.fov * vr.zoomFactor();
  const smoothedBaseFov = THREE.MathUtils.lerp(baseFov, fovTarget, dt * 2.2);
  camera.fov = vr.applyZoom(smoothedBaseFov, dt);
  // and the highlights bloom harder the faster the car goes
  bloom.strength += ((0.5 + spdN * 0.26 + (game.boostActive ? 0.2 : 0)) - bloom.strength) * Math.min(1, dt * 2.4);
  if (qaCamFixed) { // QA: absolute camera for scenery screenshots
    camera.position.set(qaCamFixed[0], qaCamFixed[1], qaCamFixed[2]);
    camera.lookAt(qaCamFixed[3], qaCamFixed[4], qaCamFixed[5]);
  }
  camera.updateProjectionMatrix();

  // zone tracking
  const u = game.s / track.length;
  const z = track.zoneAt(u);
  if (z.id !== game.zoneIndex) {
    game.zoneIndex = z.id;
    // (no zone toast — removed as a distraction)
  }

  // HUD
  hud.update({
    timeS: game.timeS,
    speedKmh: game.speed * 3.6,
    sweets: sweets.collected,
    total: sweets.total,
    boostCharges: game.boostCharges,
    boostActive: game.boostActive,
    score: game.score,
  });

  const knocked = world.update(dt, camera.position, u, performance.now() * 0.001, game.s, game.lateral);
  bridge.update(dt, performance.now() * 0.001);
  tunnelTick(dt, game.s);
  ambient.update(dt, camera.position, u, game.speed, Math.max(tunnel.darkness(game.s), forks.darkness(game.s)));
  landmarks.update(dt);
  if (knocked > 0) { SFX.play('knock'); HAPTIC.buzz(28); }
  finishFx.update(dt);
  // driving sound layer follows speed
  SFX.engineUpdate(game.speed / TUNING.cruiseSpeed, game.boostActive);
}

// ---------------------------------------------------------------- loop
let lastT = performance.now();
// QA: headless Chromium only produces animation frames when a screenshot forces
// one, so tests can drive the very same frame body deterministically instead of
// waiting on requestAnimationFrame (which would never fire).
let qaForceRender = false;
// while stepping frames from a test, the FPS governor must not judge or pace:
// its real-time accounting would fight the fixed dt and force needless renders
let qaNoGovernor = false;
let qaSteer = null; // QA override for input.steer (-1..1), null = real input
let qaCamFixed = null; // QA absolute camera [x,y,z, tx,ty,tz] or null
function frame(now, dt) {
  if (game.state === 'menu') {
    // pretty attract-mode camera drift around the start area
    const t = now * 0.00012;
    const pose = track.getPose(18 + Math.sin(t * 2) * 6, 0);
    const orbit = new THREE.Vector3(
      pose.pos.x + Math.cos(t) * 16,
      pose.pos.y + 6.5 + Math.sin(t * 1.7) * 1.2,
      pose.pos.z + Math.sin(t) * 16
    );
    camera.position.lerp(orbit, 0.04);
    camera.lookAt(pose.pos.x, pose.pos.y + 1.6, pose.pos.z);
    car.root.position.copy(track.getPose(12, 0).pos);
    car.root.rotation.y = track.getPose(12, 0).heading;
    car.update(dt, { speed: 6, steer: 0, boost: false });
    trail.update(dt, car.root, 6, false);
    world.update(dt, camera.position, 0.01, now * 0.001);
    bridge.update(dt, now * 0.001);
    tunnelTick(dt, 12);
    ambient.update(dt, camera.position, 12 / track.length, 0, 0);
    landmarks.update(dt);
    // the attract scene MUST render too — otherwise the menu card floats on a
    // black void instead of the living candy world behind it
    if ((qaNoGovernor ? qaForceRender : governor.frame(dt) || qaForceRender)) composer.render();
    window.__FPS__ = Math.round(governor.fps);
    window.__GAME_STATE__ = 'menu';
    return;
  }

  updateGestureZoom();
  updateGameplay(dt);
  if (qaNoGovernor ? qaForceRender : (governor.frame(dt) || qaForceRender)) {
    renderer.info.reset(); // accumulate every pass of this frame, not just the last
    if (vr.active) vr.render(renderer, scene, camera); // стереопара без bloom: облегчённый рендер на два глаза
    else composer.render();
  }
  window.__FPS__ = Math.round(governor.fps);
  window.__GAME_STATE__ = game.state;
  // Камера-метка обрабатывается ПОСЛЕ рендера: getImageData по видео —
  // синхронный сброс GPU-конвейера; до рендера он ронял FPS всей игры.
  updateCameraLook(now);
  // QA: live render budget (draw calls / triangles) for the perf audit
  const ri = renderer.info.render;
  window.__RENDER_INFO__ = { calls: ri.calls, triangles: ri.triangles, fps: window.__FPS__, tier: governor.describe() };
}

function animate(now) {
  requestAnimationFrame(animate);
  const dt = Math.min(0.05, (now - lastT) / 1000);
  lastT = now;
  frame(now, dt);
}

// ---------------------------------------------------------------- PWA & test hooks
if ('serviceWorker' in navigator) {
  const registerWorker = () => navigator.serviceWorker.register('./sw.js').catch(() => {});
  // Texture loading / shader warm-up can finish after the window load event.
  // Register in both cases so the new course modules are actually cached.
  if (document.readyState === 'complete') registerWorker();
  else window.addEventListener('load', registerWorker, { once: true });
}

window.__TEST__ = {
  textures() {
    return { loaded: countLoaded(TEX), keys: Object.keys(TEX).filter((k) => TEX[k]) };
  },
  startRace,
  toMenu,
  finishNow() {
    if (game.state !== 'racing') { startRace(); skipIntro(); game.countdownT = 2.3; }
    game.s = track.length - 2;
    game.timeS = Math.min(game.timeS, 97.2);
  },
  fastForwardCountdown() {
    if (game.state === 'intro') { skipIntro(); game.countdownT = 2.3; }
    else game.countdownT = 2.3;
  },
  setIntro(p) {
    if (game.state !== 'intro') startRace();
    game.introT = 6 * p;
  },
  dbg() { return { goHideT: game.goHideT, cdT: game.countdownT, st: game.state, hid: el.countdown.classList.contains('hidden') }; },
  // QA only: forces the current speed. Call it every frame while stepping to
  // hold a speed, so speed-feel effects (FOV, glow, streaks) can be compared
  // frame to frame. The game itself never calls this.
  setSpeed(v) { game.speed = v; },
  setProgress(u, lateral = 0, freeze = false) {
    game.s = track.length * u;
    game.lateral = lateral;
    resetJump();
    game.state = 'racing';
    game.speed = freeze ? 0 : TUNING.cruiseSpeed;
    game.freeze = freeze;
    game.camSnap = true;
    showScreen(null);
    el.countdown.classList.add('hidden');
  },
  snapCamera() {
    const back = track.getPose(Math.max(0, track.advance(game.s, -TUNING.camBack)), game.lateral * 0.55 - TUNING.camSide);
    const ahead = track.getPose(Math.min(track.length, track.advance(game.s, TUNING.camAhead)), game.lateral * 0.22 + TUNING.camSide * 1.15);
    game.camPos.copy(back.pos).add(new THREE.Vector3(0, TUNING.camUp + 0.6, 0));
    game.camTarget.copy(chaseTarget(game.s, ahead));
    camera.position.copy(game.camPos);
    camera.lookAt(game.camTarget);
  },
  collectAll() { sweets.collectAllDemo(); game.score = sweets.total * 10; },
  // Visual QA: park the camera at a world position looking at a target (null = release).
  // Arguments may also be track coordinates: fixCamTrack(s, lateral, up, ts, tlat, tup).
  fixCam(x, y, z, tx, ty, tz) { qaCamFixed = x === null ? null : [x, y, z, tx, ty, tz]; return qaCamFixed; },
  fixCamTrack(s, lateral, up, ts, tlat, tup) {
    const a = track.getPose(s, lateral).pos, b = track.getPose(ts, tlat).pos;
    return this.fixCam(a.x, a.y + up, a.z, b.x, b.y + tup, b.z);
  },
  // Visual QA: pull the chase camera in for paint/detail close-ups
  pinCam(back, up, ahead) {
    TUNING.camBack = back; TUNING.camUp = up; TUNING.camAhead = ahead;
    return [TUNING.camBack, TUNING.camUp, TUNING.camAhead];
  },
  // Visual QA: pin the quality tier so a slow headless GPU cannot silently
  // downgrade shadows/bloom while taking reference screenshots.
  // QA: advance the game by N fixed frames without requestAnimationFrame.
  // dt defaults to 1/60 so the quality governor still sees a 60 FPS cadence.
  // render=false skips composer.render() so long simulations stay fast on a
  // software GL backend (the gameplay logic is identical either way).
  step(dt = 1 / 60, steps = 1, render = false) {
    const prevGov = qaNoGovernor;
    qaNoGovernor = true;
    qaForceRender = render;
    try {
      const now = performance.now();
      for (let i = 0; i < steps; i++) frame(now + i * dt * 1000, dt);
    } finally {
      qaForceRender = false;
      qaNoGovernor = prevGov;
    }
    return { state: game.state, timeS: +game.timeS.toFixed(2), speedKmh: +(game.speed * 3.6).toFixed(1), lateral: +game.lateral.toFixed(2) };
  },
  // perf QA: raw handles for in-page draw-call profiling (tests/tools/drawprof.mjs)
  internals() { return { renderer, scene, camera, composer, world, car, governor, track, tunnel, cakes, forks, ramps, sweets, landmarks, ambient }; },
  forks() { return track.routes.forks.map((f) => ({ id: f.id, s0: f.s0, s1: f.s1, selected: f.selected, pending: f.pending,
    routes: f.branches.map((b) => ({ id: b.id, title: b.title, length: b.length, kind: b.kind })) })); },
  chooseFork(id, option) { track.routes.select(id, option); },
  // Zone-aware air layers: which one is visible and how strong (QA + tuning).
  ambient() { return ambient.info(); },
  tunnelInfo() {
    return { range: tunnel.range, k: tunnelK, spot: car.headSpot.intensity, hemi: world.hemi.intensity, sun: world.sun.intensity, ...tunnel.info() };
  },
  // perf QA: compiled shader programs / GPU textures / governor tier
  perf() {
    return { programs: renderer.info.programs.length, textures: renderer.info.memory.textures, geometries: renderer.info.memory.geometries, tier: governor.tier };
  },
  pinQuality(tier = 2) {
    governor.tier = tier;
    governor.apply();
    return governor.describe();
  },
  // Milk river + arched bridge facts for QA: deck hump, arch, river under it, sea.
  bridge() {
    const s = bridge.crossing.s;
    const deck = track.getPose(s, 0).pos.y, before = track.getPose(s - 60, 0).pos.y, after = track.getPose(s + 60, 0).pos.y;
    const names = {};
    bridge.group.traverse((o) => { if (o.isMesh) names[o.name || 'part'] = (names[o.name || 'part'] || 0) + 1; });
    const river = bridge.group.getObjectByName('milkRiver');
    river.geometry.computeBoundingBox();
    return { crossingS: s, deckY: +deck.toFixed(2), deckBefore: +before.toFixed(2), deckAfter: +after.toFixed(2),
      archApexY: +bridge.archApexY.toFixed(2), riverY: +river.geometry.boundingBox.max.y.toFixed(2),
      riverLength: +bridge.riverLength.toFixed(0), sea: bridge.sea, parts: names };
  },
  // Music sequencer facts (mode, bar position, note count).
  music() { return MUSIC.info(); },
  // QA: hold the steering at v (-1..1) for step() runs; null releases.
  holdSteer(v = null) { qaSteer = v === null ? null : Math.max(-1, Math.min(1, +v)); return qaSteer; },
  // Jump state for physics QA (drive with step() and sample this).
  jumpInfo() {
    return { jump: game.jump, air: +game.air.toFixed(3), vy: +game.vy.toFixed(3), s: +game.s.toFixed(2), lateral: +game.lateral.toFixed(2), speed: +game.speed.toFixed(2), t: +game.jumpT.toFixed(2), boost: game.boostActive, roll: +game.carRoll.toFixed(3), pitch: +game.carPitch.toFixed(3), bounces: game.bounces };
  },
  // Jump ramps: placement + lane span (config.js RAMPS resolved by ramps.js).
  ramps() {
    return ramps.list.map((r) => ({ id: r.id, s0: +r.s0.toFixed(1), s1: +r.s1.toFixed(1), latMin: +r.latMin.toFixed(2), latMax: +r.latMax.toFixed(2), height: r.height, angleDeg: +(r.angle * 180 / Math.PI).toFixed(1), side: r.side, children: r.group.children.length }));
  },
  // Road surface key per zone mesh (track.js ROAD_SURFACES) in track order.
  roadSurfaces() {
    return track.roadMeshes.map((m) => m.userData.surface);
  },
  // Geometry QA: world pose of a named scene object (gates, strips) next to the
  // road tangent at that spot, so "is it perpendicular to the road?" is a number.
  objectPose(name) {
    const o = scene.getObjectByName(name);
    if (!o) return null;
    o.updateWorldMatrix(true, false);
    const pos = new THREE.Vector3().setFromMatrixPosition(o.matrixWorld);
    const axis = (x, y, z) => new THREE.Vector3(x, y, z).transformDirection(o.matrixWorld).toArray().map((v) => +v.toFixed(3));
    let best = { d: Infinity, u: 0 };
    for (let i = 0; i <= 2000; i++) { const u = i / 2000; const d = track.curve.getPointAt(u).distanceTo(pos); if (d < best.d) best = { d, u }; }
    const t = track.curve.getTangentAt(best.u).normalize();
    const right = new THREE.Vector3().crossVectors(t, new THREE.Vector3(0, 1, 0)).normalize();
    return { pos: pos.toArray().map((v) => +v.toFixed(2)), u: +best.u.toFixed(4), x: axis(1, 0, 0), y: axis(0, 1, 0), z: axis(0, 0, 1), tangent: t.toArray().map((v) => +v.toFixed(3)), right: right.toArray().map((v) => +v.toFixed(3)) };
  },
  // Perf QA: triangle / draw-call budget per world bucket, so heavy prop groups
  // (castles, houses, clouds) can be found and merged without guessing.
  sceneAudit() {
    const tri = (o) => {
      const g = o.geometry;
      if (!g) return 0;
      const n = g.index ? g.index.count : (g.attributes.position ? g.attributes.position.count : 0);
      return Math.floor(n / 3);
    };
    const buckets = new Map();
    let totalTri = 0, totalCalls = 0, meshes = 0;
    scene.traverse((o) => {
      if (!o.isMesh && !o.isInstancedMesh && !o.isPoints && !o.isSprite) return;
      meshes++;
      const inst = o.isInstancedMesh ? (o.count || 1) : 1;
      const t = tri(o) * inst;
      totalTri += t; totalCalls++;
      // two-level label: scene child -> its child (so world props are separated)
      let label = '(scene)';
      const chain = [];
      let q = o;
      while (q && q.parent && q.parent.type !== 'Scene') { chain.push(q); q = q.parent; }
      if (chain.length > 1) {
        const sub = chain[chain.length - 2];
        label = (q.name ? q.name + '/' : '') + (sub.name || sub.type + '#' + sub.children.length);
      } else if (chain.length === 1 && q !== o) label = q.name || q.type;
      if (!buckets.has(label)) buckets.set(label, { tri: 0, calls: 0, meshes: 0 });
      const b = buckets.get(label);
      b.tri += t; b.calls++; b.meshes++;
    });
    const top = [...buckets.entries()].map(([k, v]) => ({ k, ...v })).sort((a, b) => b.tri - a.tri).slice(0, 20);
    const topCalls = [...buckets.entries()].map(([k, v]) => ({ k, ...v })).sort((a, b) => b.calls - a.calls).slice(0, 14);
    const all = [];
    scene.traverse((o) => {
      if (!o.isMesh && !o.isInstancedMesh) return;
      const inst = o.isInstancedMesh ? (o.count || 1) : 1;
      const t = tri(o) * inst;
      if (t < 2000) return;
      const chain = [];
      let q = o;
      while (q && q.parent) {
        const idx = q.parent.children ? q.parent.children.indexOf(q) : -1;
        chain.push((q.name || q.type) + '[' + idx + ']' + (q.geometry ? ':' + q.geometry.type : ''));
        q = q.parent;
      }
      let bb = null;
      if (o.geometry && o.geometry.boundingBox === null) o.geometry.computeBoundingBox();
      if (o.geometry && o.geometry.boundingBox) {
        const b = o.geometry.boundingBox;
        const d = new THREE.Vector3(); b.getSize(d);
        const worldScale = o.getWorldScale ? o.getWorldScale(new THREE.Vector3()) : null;
        const k = worldScale ? Math.max(worldScale.x, worldScale.y, worldScale.z) : 1;
        bb = [Math.round(d.x * k), Math.round(d.y * k), Math.round(d.z * k)];
      }
      all.push({ t, path: chain.reverse().join(' < '), bb, verts: o.geometry && o.geometry.attributes.position ? o.geometry.attributes.position.count : 0, inst: o.isInstancedMesh ? (o.count || 1) : 1, mat: o.material ? (o.material.name || o.material.type) : '?' });
    });
    all.sort((a, b) => b.t - a.t);
    // sub-breakdown of the heaviest scene child (the world group)
    let heaviest = null, hv = -1;
    for (const c of scene.children) {
      let t = 0;
      c.traverse((x) => { if (x.isMesh || x.isInstancedMesh) t += tri(x) * (x.isInstancedMesh ? (x.count || 1) : 1); });
      if (t > hv) { hv = t; heaviest = c; }
    }
    const sub = heaviest ? heaviest.children.map((c, i) => {
      let t = 0, m = 0;
      c.traverse((x) => { if (x.isMesh || x.isInstancedMesh) { const q = x.isInstancedMesh ? (x.count || 1) : 1; t += tri(x) * q; m++; } });
      return { i, n: c.name || c.type, tri: t, meshes: m, kids: c.children.length };
    }) : [];
    sub.sort((a, b) => b.meshes - a.meshes);
    // what would actually be drawn right now (frustum + visibility)
    camera.updateMatrixWorld(true);
    const frustum = new THREE.Frustum().setFromProjectionMatrix(
      new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse)
    );
    const vis = {};
    const visByLabel = new Map();
    let visMeshes = 0, visChunks = 0;
    const labelOf = (o) => {
      const chain = [];
      let q = o;
      while (q && q.parent && q.parent.type !== 'Scene') {
        const idx = q.parent.children ? q.parent.children.indexOf(q) : -1;
        chain.push((q.name || q.type) + '[' + idx + ']');
        q = q.parent;
      }
      chain.push((q.name || q.type) + '[root]');
      chain.reverse();
      return chain.slice(0, 3).join('/');
    };
    scene.traverse((o) => {
      if (!o.visible) return;
      const isDrawable = o.isMesh || o.isInstancedMesh || o.isSprite || o.isPoints || o.isLine;
      if (!isDrawable) return;
      if (!frustum.intersectsObject(o)) return;
      visMeshes++;
      const k = o.isInstancedMesh ? 'visInstanced' : (o.isSprite ? 'visSprite' : (o.isMesh ? 'visMesh' : 'visOther'));
      vis[k] = (vis[k] || 0) + 1;
      if (o.isInstancedMesh) visChunks++;
      const lb = labelOf(o);
      visByLabel.set(lb, (visByLabel.get(lb) || 0) + 1);
    });
    const visTop = [...visByLabel.entries()].map(([k, v]) => ({ k, v })).sort((a, b) => b.v - a.v).slice(0, 16);
    const byType = {};
    scene.traverse((o) => {
      if (o.isInstancedMesh) { const k = 'InstancedMesh'; byType[k] = byType[k] || { n: 0, tri: 0 }; byType[k].n++; byType[k].tri += tri(o) * (o.count || 1); }
      else if (o.isMesh) { const k = 'Mesh'; byType[k] = byType[k] || { n: 0, tri: 0 }; byType[k].n++; byType[k].tri += tri(o); }
      else if (o.isSprite) { const k = 'Sprite'; byType[k] = byType[k] || { n: 0, tri: 0 }; byType[k].n++; }
      else if (o.isPoints) { const k = 'Points'; byType[k] = byType[k] || { n: 0, tri: 0 }; byType[k].n++; }
    });
    return { totalTri, totalCalls, meshes, top, topCalls, byType, vis, visMeshes, visChunks, visTop, bigMeshes: all.slice(0, 22), heaviest: heaviest ? (heaviest.name || heaviest.type) : '', sub };
  },
  // Visual QA: force the boost state for a frozen screenshot
  forceBoost(seconds = 3.4) {
    if (game.state !== 'racing') { startRace(); skipIntro(); game.countdownT = 2.3; }
    game.boostActive = true;
    game.boostT = seconds;
    game.boostCharges = 0;
    return { boost: game.boostActive, t: game.boostT };
  },
  vrStart(lookMode = 'look', baselineCm = 10, gestureZoom = false, driverMode = vrSettings.driverMode) {
    vrSettings = normalizeVrSettings({ lookMode, baselineCm, gestureZoom, driverMode });
    Storage.saveVrSettings(vrSettings);
    startVrRide();
    return this.vrInfo();
  },
  vrStop() { exitVrToMenu(); return this.vrInfo(); },
  vrInfo() {
    return { ...vr.info(), fov: +camera.fov.toFixed(2), vrRide: game.vrRide, plan: game.vrPlan, state: game.state };
  },
  vrSetLook(yawDeg = null, pitchDeg = 0) { vr.setSimLook(yawDeg, pitchDeg); return this.vrInfo(); },
  async remoteDemo() {
    vrSettings.driverMode = 'remote';
    const rc = ensureRemote();
    if (!rc.kind) rc.useDemo();
    const code = await rc.createRoom();
    publishRemoteState();
    return { code, info: rc.info() };
  },
  remoteState() { publishRemoteState(); return lastRemoteState; },
  gestureEnableSynthetic(on = true) {
    vrSettings.gestureZoom = true;
    game.gestureOn = true;
    const t = ensureCamTracker();
    t.synthetic = true; t.running = true; t.setGestureEnabled(true); t.injectGestureV(on);
    updateGestureZoom();
    return { info: t.info(), vr: this.vrInfo() };
  },
  gestureSetSynthetic(on = true) {
    const t = ensureCamTracker();
    t.injectGestureV(on);
    updateGestureZoom();
    return { info: t.info(), vr: this.vrInfo() };
  },
  gestureFeed(on = true) {
    vrSettings.gestureZoom = true;
    game.gestureOn = true;
    const t = ensureCamTracker();
    t.synthetic = true; t.running = true; t.setGestureEnabled(true);
    const result = t.injectGestureFrame(on);
    updateGestureZoom();
    return { result, info: t.info(), vr: this.vrInfo() };
  },
  gestureThumbFeed(on = true) {
    vrSettings.driverMode = 'gesture';
    vrSettings.gestureZoom = true;
    game.driverMode = 'gesture';
    game.gestureOn = true;
    const t = ensureCamTracker();
    t.synthetic = true; t.running = true; t.setGestureEnabled(true);
    const result = t.injectThumbFrame(on);
    updateGestureZoom();
    return { result, info: t.info(), vr: this.vrInfo(), throttle: gestureThrottle() };
  },
  camInfo() { return camTracker ? camTracker.info() : null; },
  // QA: куда именно сейчас ЦЕЛИТСЯ взгляд (до демпфирования в vr.js) —
  // этим числом проверяются «нет возврата в центр» и «нет скачка».
  camLook() {
    const t = camTracker;
    return {
      yaw: +camSmooth.yaw.toFixed(2), pitch: +camSmooth.pitch.toFixed(2),
      snapPending: camSnapPending ? { yaw: +camSnapPending.yaw.toFixed(1), pitch: +camSnapPending.pitch.toFixed(1) } : null,
      wasLost: camWasLost,
      fixation: camFollowing,
      pairFixation: !!(t && t.dual && t.pairFixation()),
      singleSteer: !!(t && !t.pairFixation() && t.singleSteer()),
      headRate: +camHeadRate().yaw.toFixed(1),
      coast: { active: camCoast.active, yaw: +camCoast.yaw.toFixed(1), pitch: +camCoast.pitch.toFixed(1),
        usedYaw: +camCoast.usedYaw.toFixed(1), usedPitch: +camCoast.usedPitch.toFixed(1) },
      lastFoundAgoMs: t && t.lastFoundAt ? Math.round(performance.now() - t.lastFoundAt) : null,
      lookMode: vrSettings.lookMode, camOn: !!game.camOn, vrRide: !!game.vrRide,
    };
  },
  camEnableSynthetic() {
    vrSettings.lookMode = 'camera';
    const t = ensureCamTracker();
    t.synthetic = true; t.running = true;
    game.camOn = true;
    t.calibrate();
    return t.info();
  },
  camEnableDualSynthetic() {
    vrSettings.lookMode = 'camera-dual';
    const t = ensureCamTracker();
    t.synthetic = true; t.running = true;
    game.camOn = true;
    t.resetDualCalibration();
    return t.info();
  },
  camFeedDual(ax, ay, bx, by, r = 26, shape = 'rect') {
    const t = ensureCamTracker();
    t.injectDualBlob(ax, ay, bx, by, r, 320, 240, shape);
    updateCameraLook(performance.now(), true);
    return { info: t.info(), vr: vr.info() };
  },
  // QA: сдвинуть часы «сущности» меток назад (аналог camAgeLoss): проверить
  // правило 0.15 с без реального ожидания. Возвращает состояние трекера.
  // QA: «забыть» метку (сымитировать долгую пропажу, после которой появление
  // снова должно быть явным 0.15 с).
  camForgetMarkers(id = null) {
    const t = ensureCamTracker();
    t.forgetMarkerEntities(id);
    return t.info();
  },
  camAgeMarkers(ms) {
    const t = ensureCamTracker();
    // Сдвигаем только начало наблюдения: «сколько мс метка явно видна».
    // lastSeen не трогаем — иначе хук сам себе устраивает «пропажу».
    for (const st of Object.values(t.markerEntity || {})) {
      if (st.seenSince) st.seenSince -= ms;
    }
    return t.info();
  },
  camCalibrateDual() {
    const t = ensureCamTracker();
    const ok = t.calibrate();
    return { ok, info: t.info() };
  },
  camFeed(cx, cy, r, shape = 'rect') {
    const t = ensureCamTracker();
    t.injectBlob(cx, cy, r, 320, 240, shape);
    updateCameraLook(performance.now(), true);
    return { info: t.info(), vr: vr.info() };
  },
  async camFeedBitmap(cx, cy, r) {
    const t = ensureCamTracker();
    const c = document.createElement('canvas');
    c.width = 320; c.height = 240;
    const x = c.getContext('2d');
    x.fillStyle = 'rgb(215,51,108)';
    x.fillRect(cx - 2 * r, cy - r, 4 * r, 2 * r); // горизонтальный прямоугольник
    const bmp = await createImageBitmap(c);
    await t.ingestBitmap(bmp);
    updateCameraLook(performance.now(), true);
    return { info: t.info(), vr: vr.info() };
  },
  camFeedEmpty() {
    const t = ensureCamTracker();
    t.injectEmpty();
    updateCameraLook(performance.now(), true);
    return { info: t.info(), vr: vr.info() };
  },
  camAgeLoss(ms) {
    const t = ensureCamTracker();
    t.lastFoundAt = performance.now() - ms;
    updateCameraLook(performance.now(), true);
    return { info: t.info(), vr: vr.info() };
  },
  sendRemoteCommand(name) { executeRemoteCommand(name); return lastRemoteState; },
  remoteInfo() { return remoteCtrl ? remoteCtrl.info() : null; },
  state: () => game.state,
  // Acceptance helper: project the road ahead to screen space (px).
  roadScreenPoints(aheadFrom = 20, aheadTo = 110, step = 10) {
    const pts = [];
    const v = new THREE.Vector3();
    camera.updateMatrixWorld(true);
    for (let d = aheadFrom; d <= aheadTo; d += step) {
      const s = Math.min(track.length - 1, track.advance(game.s, d));
      const p = track.getPose(s, 0).pos.clone();
      v.copy(p).project(camera);
      pts.push({ d, x: (v.x * 0.5 + 0.5) * window.innerWidth, y: (-v.y * 0.5 + 0.5) * window.innerHeight, onScreen: Math.abs(v.x) <= 1 && Math.abs(v.y) <= 1 && v.z <= 1 });
    }
    return pts;
  },
  gameInfo() {
    return {
      trackLength: Math.round(track.routes.routeLength()), referenceLength: Math.round(track.length), totalSweets: sweets.total,
      state: game.state, timeS: +game.timeS.toFixed(2), speedKmh: +(game.speed * 3.6).toFixed(1),
      lateral: +game.lateral.toFixed(2), collected: sweets.collected,
      boostActive: game.boostActive, boostCharges: game.boostCharges,
      zone: track.zoneAt(game.s / track.length).id,
      vrActive: vr.active, vrRide: game.vrRide, driverMode: game.driverMode,
      gestureV: !!(game.gestureOn && camTracker && camTracker.gestureV),
      thumbUp: !!(game.gestureOn && camTracker && camTracker.thumbUp),
      remote: remoteCtrl ? remoteCtrl.info() : null,
    };
  },
  camDebug() {
    camera.updateMatrixWorld(true);
    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir);
    const g = (v) => [+v.x.toFixed(1), +v.y.toFixed(1), +v.z.toFixed(1)];
    const p20 = track.getPose(Math.min(track.length - 1, game.s + 20), 0).pos;
    const p60 = track.getPose(Math.min(track.length - 1, game.s + 60), 0).pos;
    return {
      s: +game.s.toFixed(1), camPos: g(camera.position), camDir: g(dir),
      road20: g(p20), road60: g(p60),
      toRoad20: g(p20.clone().sub(camera.position).normalize()),
    };
  },
  hideHUD(hide = true) {
    document.getElementById('hud').style.display = hide ? 'none' : '';
    document.getElementById('portrait-hint').style.display = 'none';
    for (const n of Object.values(screens)) n.classList.add('hidden');
    el.countdown.classList.add('hidden');
  },
  // Diagnose what is under/behind given NDC pixel + the road mesh state.
  diagScene(ndcX = 0, ndcY = -0.5) {
    camera.updateMatrixWorld(true);
    const rc = new THREE.Raycaster();
    rc.setFromCamera(new THREE.Vector2(ndcX * 2 - 1, -(ndcY * 2 - 1)), camera);
    const hits = rc.intersectObjects(scene.children, true).slice(0, 6).map((h) => ({
      name: h.object.name || h.object.type, dist: +h.distance.toFixed(1),
      mat: h.object.material && (h.object.material.type + '/' + (h.object.material.color ? '#' + h.object.material.color.getHexString() : '')),
    }));
    const road = scene.getObjectByName('road');
    let roadInfo = null;
    if (road) {
      const pos = road.geometry.getAttribute('position');
      let nan = 0;
      for (let i = 0; i < pos.array.length; i++) if (!Number.isFinite(pos.array[i])) nan++;
      road.geometry.computeBoundingSphere();
      roadInfo = {
        visible: road.visible, count: pos.count, nan,
        bsCenter: road.geometry.boundingSphere.center.toArray().map((v) => +v.toFixed(1)),
        bsRadius: +road.geometry.boundingSphere.radius.toFixed(1),
        matType: road.material.type, side: road.material.side,
        idx: road.geometry.index ? road.geometry.index.count : null,
      };
    }
    const carPos = car.root.position;
    const rc2 = new THREE.Raycaster();
    rc2.camera = camera;
    rc2.set(new THREE.Vector3(carPos.x, carPos.y + 8, carPos.z), new THREE.Vector3(0, -1, 0));
    const under = rc2.intersectObjects(scene.children, true).slice(0, 5).map((h) => ({
      name: h.object.name || h.object.type, dist: +h.distance.toFixed(1),
    }));
    return { hits, roadInfo, under, car: carPos.toArray().map((v) => +v.toFixed(1)) };
  },
  debugPaint(mode = 0) {
    const road = scene.getObjectByName('road');
    if (road) {
      if (mode === 0) road.material = new THREE.MeshBasicMaterial({ color: '#ff0000', side: THREE.DoubleSide });
      else if (mode === 1) road.material = new THREE.MeshBasicMaterial({ map: road.material.map, side: THREE.DoubleSide });
      else if (mode === 2) road.material = new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.DoubleSide });
      else if (mode === 3) road.material = new THREE.MeshBasicMaterial({ map: road.material.map, vertexColors: true, side: THREE.DoubleSide });
      road.material.needsUpdate = true;
    }
    return !!road;
  },
  roadMatInfo() {
    const road = scene.getObjectByName('road');
    if (!road) return null;
    const m = road.material;
    const col = road.geometry.getAttribute('color');
    const c0 = col ? [col.getX(0).toFixed(2), col.getY(0).toFixed(2), col.getZ(0).toFixed(2)] : null;
    const mid = col ? Math.floor(col.count / 2) : 0;
    const cm = col ? [col.getX(mid).toFixed(2), col.getY(mid).toFixed(2), col.getZ(mid).toFixed(2)] : null;
    return {
      type: m.type, color: '#' + (m.color ? m.color.getHexString() : ''),
      vertexColors: m.vertexColors, hasMap: !!m.map,
      mapImg: m.map && m.map.image ? (m.map.image.width + 'x' + m.map.image.height) : null,
      firstVertColor: c0, midVertColor: cm, visible: road.visible,
    };
  },
  hideWorldParts(which) {
    // bisect helpers for the black-sky artifact
    let n = 0;
    scene.traverse((o) => {
      if (which === 'sprites' && o.isSprite) { o.visible = false; n++; }
      if (which === 'points' && o.isPoints) { o.visible = false; n++; }
      if (which === 'instanced' && o.isInstancedMesh) { o.visible = false; n++; }
      if (which === 'balloons' && o.type === 'Group' && o.children.some((c) => c.geometry && c.geometry.type === 'SphereGeometry' && c.scale.y === 1.18)) { o.visible = false; n++; }
    });
    return n;
  },
  findAtPixel(px = 520, py = 115) {
    camera.updateMatrixWorld(true);
    const v = new THREE.Vector3();
    const found = [];
    scene.traverse((o) => {
      if (!o.isMesh && !o.isPoints && !o.isSprite) return;
      if (o.name === 'road') return;
      o.geometry.computeBoundingSphere && o.geometry.computeBoundingSphere();
      const bs = o.geometry.boundingSphere;
      if (!bs) return;
      v.copy(bs.center).applyMatrix4(o.matrixWorld).project(camera);
      const sx = (v.x * 0.5 + 0.5) * window.innerWidth;
      const sy = (-v.y * 0.5 + 0.5) * window.innerHeight;
      const d = Math.hypot(sx - px, sy - py);
      if (d < 60) found.push({
        type: o.type, name: o.name || '(anon)', d: Math.round(d),
        sx: Math.round(sx), sy: Math.round(sy),
        mat: o.material ? (o.material.type + '/' + (o.material.color ? '#' + o.material.color.getHexString() : '')) : '?',
        parent: o.parent ? (o.parent.name || o.parent.type) : '?',
      });
    });
    found.sort((a, b) => a.d - b.d);
    return found.slice(0, 12);
  },
  toggleSky(hide = true) {
    let n = 0;
    scene.traverse((o) => {
      if (o.material && o.material.type === 'ShaderMaterial') { o.visible = !hide; n++; }
    });
    if (hide) scene.background = new THREE.Color('#7ec9f2');
    return n;
  },
  toggleBloom(on = false) {
    composer.passes.forEach((p) => {
      if (p.constructor.name === 'UnrealBloomPass') p.enabled = on;
    });
  },
  scanNaN() {
    const bad = [];
    scene.traverse((o) => {
      if (!o.isMesh && !o.isPoints) return;
      const g = o.geometry;
      if (!g || !g.attributes || !g.attributes.position) return;
      const arr = g.attributes.position.array;
      let nan = 0;
      for (let i = 0; i < arr.length; i++) if (!Number.isFinite(arr[i])) nan++;
      if (nan > 0) bad.push({
        type: o.type, name: o.name || '(anon)', nan,
        mat: o.material ? o.material.type : '?',
        parent: o.parent ? (o.parent.name || o.parent.type) : '?',
        inst: !!o.isInstancedMesh,
      });
    });
    return bad;
  },
  childList() {
    return scene.children.map((o, i) => ({
      i, type: o.type, name: o.name || '(anon)', visible: o.visible,
      kids: o.children ? o.children.length : 0,
      pos: o.position.toArray().map((v) => +v.toFixed(2)),
      rot: [o.rotation.x, o.rotation.y, o.rotation.z].map((v) => +v.toFixed(2)),
      scale: o.scale.toArray().map((v) => +v.toFixed(2)),
    }));
  },
  hideChild(i, hide = true) {
    if (scene.children[i]) scene.children[i].visible = !hide;
  },
  knockedCount() { return world.knockedCount(); },
  mountainDebug() { return world.mountainDebug(); },
  sweetPeek(i) {
    const it = sweets.list[i % sweets.list.length];
    return it ? { s: +it.s.toFixed(1), lateral: +it.lateral.toFixed(2), collected: it.collected, type: it.type, total: sweets.list.length } : null;
  },
  matrixFlags(x, y, z, r = 1.5) {
    const out = [];
    scene.traverse((o) => {
      if (!o.isMesh && !o.isGroup && !o.isInstancedMesh) return;
      const d = Math.hypot(o.position.x - x, o.position.y - y, o.position.z - z);
      if (d < r) {
        out.push({
          type: o.type + '/' + (o.geometry ? o.geometry.type : ''), uuid: o.uuid.slice(0, 8),
          pos: o.position.toArray().map((q) => +q.toFixed(1)),
          mAuto: o.matrixAutoUpdate, mwAuto: o.matrixWorldAutoUpdate,
          mw: Array.from(o.matrixWorld.elements).slice(12, 15).map((q) => +q.toFixed(1)),
          parent: o.parent ? o.parent.type + '@' + o.parent.position.toArray().map((q) => +q.toFixed(0)).join(',') : '?',
        });
      }
    });
    return out;
  },
  forceMW() {
    scene.updateMatrixWorld(true);
    return scene.children.length;
  },
  rayProbe(s, lat = 0) {
    const rc = new THREE.Raycaster();
    rc.camera = camera;
    const p = track.getPose(s, lat).pos;
    rc.set(new THREE.Vector3(p.x, p.y + 4, p.z), new THREE.Vector3(0, -1, 0));
    const hits = rc.intersectObjects(scene.children, true).slice(0, 8);
    return {
      origin: [p.x, p.y + 4, p.z].map((q) => +q.toFixed(2)),
      hits: hits.map((h) => {
        const local = h.point.clone().applyMatrix4(h.object.matrixWorld.clone().invert());
        return {
          d: +h.distance.toFixed(2), wpt: h.point.toArray().map((q) => +q.toFixed(1)),
          lpt: local.toArray().map((q) => +q.toFixed(1)),
          type: h.object.geometry ? h.object.geometry.type : h.object.type,
          uuid: h.object.uuid.slice(0, 8), inst: !!h.object.isInstancedMesh,
          mat: h.object.material && h.object.material.color ? '#' + h.object.material.color.getHexString() : '?',
          objPos: h.object.position.toArray().map((q) => +q.toFixed(1)),
        };
      }),
    };
  },
  worldScanNear(x, y, z, r = 80) {
    const out = [];
    scene.traverse((o) => {
      if (!o.isMesh) return;
      o.updateMatrixWorld(true);
      if (!o.geometry.boundingSphere) o.geometry.computeBoundingSphere();
      const bs = o.geometry.boundingSphere;
      const c = bs.center.clone().applyMatrix4(o.matrixWorld);
      const sc = o.scale ? Math.max(o.scale.x, o.scale.y, o.scale.z) : 1;
      const d = c.distanceTo(new THREE.Vector3(x, y, z)) - bs.radius * sc;
      if (d < r) {
        out.push({
          type: o.geometry.type, dTo: +d.toFixed(1),
          wc: c.toArray().map((q) => +q.toFixed(1)), wr: +(bs.radius * sc).toFixed(1),
          mat: o.material.color ? '#' + o.material.color.getHexString() : '?',
          name: o.name || '(anon)', uuid: o.uuid.slice(0, 8),
          pos: o.position.toArray().map((q) => +q.toFixed(1)),
          scl: o.scale.toArray().map((q) => +q.toFixed(2)),
          vis: o.visible, par: o.parent ? o.parent.type + '@' + o.parent.position.toArray().map((q) => +q.toFixed(0)).join(',') : '?',
        });
      }
    });
    out.sort((a, b) => a.dTo - b.dTo);
    return out.slice(0, 15);
  },
  findNear(x, y, z, r = 1.5) {
    const out = [];
    scene.traverse((o) => {
      if (!o.isMesh) return;
      const p = o.position;
      const d = Math.hypot(p.x - x, p.y - y, p.z - z);
      if (d < r) {
        o.geometry.computeBoundingSphere();
        const bs = o.geometry.boundingSphere;
        const v0 = o.geometry.attributes.position ? o.geometry.attributes.position.array.slice(0, 9).map((q) => +q.toFixed(1)) : null;
        const idx = o.geometry.index;
        let idxInfo = null;
        if (idx) {
          let mx = 0, bad = 0;
          const cnt = o.geometry.attributes.position.count;
          for (let i = 0; i < idx.array.length; i++) { if (idx.array[i] > mx) mx = idx.array[i]; if (idx.array[i] >= cnt) bad++; }
          idxInfo = { count: idx.array.length, max: mx, verts: cnt, bad };
        }
        out.push({
          type: o.geometry.type, d: +d.toFixed(2),
          mat: o.material.color ? '#' + o.material.color.getHexString() : '?',
          bs: bs ? [+bs.center.x.toFixed(1), +bs.center.y.toFixed(1), +bs.center.z.toFixed(1), +bs.radius.toFixed(1)] : null,
          v0, idxInfo, inst: !!o.isInstancedMesh, uuid: o.uuid.slice(0, 8),
          parent: o.parent ? (o.parent.type + '/' + (o.parent.position ? o.parent.position.toArray().map((q) => +q.toFixed(1)) : '')) : '?',
        });
      }
    });
    return out;
  },
  // QA: cast rays down onto the drivable corridor along the whole track.
  // Normal first hit ≈ 3.9-4.05 (road under a 4m ray). Smaller = object ON the
  // road (the "texture hill" bug); larger/none = road missing there.
  corridorScan(step = 16) {
    scene.updateMatrixWorld(true); // matrices may be stale before the first render
    const rc = new THREE.Raycaster();
    rc.camera = camera; // sprites require raycaster.camera or they crash
    const down = new THREE.Vector3(0, -1, 0);
    const out = [];
    for (let s = 6; s < track.length - 6; s += step) {
      for (const lat of [-3.2, -1.6, 0, 1.6, 3.2]) {
        const p = track.getPose(s, lat).pos;
        rc.set(new THREE.Vector3(p.x, p.y + 4, p.z), down);
        const hits = rc.intersectObjects(scene.children, true);
        // sweets float above the road on purpose — skip them (userData.noCollide on any ancestor)
        const noCol = (o) => { for (let q = o; q; q = q.parent) if (q.userData && q.userData.noCollide) return true; return false; };
        const h = hits.find((x) => x.object.isMesh && x.object.visible !== false && !noCol(x.object));
        const d = h ? h.distance : 99;
        if (d < 3.3 || d > 4.6) {
          let instPos = null, instSc = null;
          if (h && h.object.isInstancedMesh && h.instanceId !== undefined) {
            const nm = new THREE.Matrix4();
            h.object.getMatrixAt(h.instanceId, nm);
            instPos = new THREE.Vector3().setFromMatrixPosition(nm).toArray().map((v) => +v.toFixed(1));
            instSc = +new THREE.Vector3().setFromMatrixScale(nm).x.toFixed(2);
          }
          out.push({
            s: Math.round(s), lat, d: +d.toFixed(2),
            name: h ? (h.object.name || h.object.type) : 'NONE',
            mat: h && h.object.material ? h.object.material.type + '/' + (h.object.material.color ? '#' + h.object.material.color.getHexString() : '') : '',
            hitY: h ? +h.point.y.toFixed(1) : null,
            objPos: h ? h.object.position.toArray().map((v) => +v.toFixed(1)) : null,
            instPos, instSc,
          });
        }
      }
    }
    return out;
  },
  // QA: look FORWARD along the driving line — catches vertical "walls" (hills,
  // oversized props) that a downward ray passes over. Flags anything that is
  // not scenery-beside-the-road but straight AHEAD within 45 m.
  corridorScanAhead(step = 16) {
    scene.updateMatrixWorld(true);
    const rc = new THREE.Raycaster();
    rc.camera = camera;
    const out = [];
    const noCol = (o) => { for (let q = o; q; q = q.parent) if (q.userData && q.userData.noCollide) return true; return false; };
    for (let s = 6; s < track.length - 20; s += step) {
      const p = track.getPose(s, 0);
      // aim along the CURVE (at a point 30 m ahead), not the local tangent
      const ahead = track.getPose(Math.min(track.length - 1, s + 30), 0);
      const dir = ahead.pos.clone().sub(p.pos).normalize();
      // eye height, slight downward pitch like the real camera
      const origin = p.pos.clone().add(new THREE.Vector3(0, 1.6, 0));
      rc.set(origin, dir);
      const hits = rc.intersectObjects(scene.children, true);
      const h = hits.find((x) => x.object.isMesh && x.object.visible !== false && !noCol(x.object));
      if (h && h.distance < 45) {
        out.push({
          s: Math.round(s), d: +h.distance.toFixed(1),
          name: h.object.name || h.object.type,
          mat: h.object.material && h.object.material.color ? '#' + h.object.material.color.getHexString() : '?',
          hit: h.point.toArray().map((v) => +v.toFixed(1)),
        });
      }
    }
    return out;
  },
  worldChildren() {
    const world = scene.children.find((o) => o.type === 'Group' && o.children.length > 50);
    if (!world) return [];
    return world.children.map((o, i) => ({
      i, type: o.type, name: o.name || '(anon)', visible: o.visible,
      kids: o.children ? o.children.length : 0,
    }));
  },
  hideWorldChild(i, hide = true) {
    const world = scene.children.find((o) => o.type === 'Group' && o.children.length > 50);
    if (world && world.children[i]) world.children[i].visible = !hide;
  },
};

// ---------------------------------------------------------------- prewarm
// Without this every material compiles its shader the first time it comes into
// view — sweets, ramps, boost flames, finish confetti… — each a synchronous
// stall of tens to hundreds of ms on phones, i.e. the stutter of the first
// race seconds. Compile EVERYTHING now (hidden objects included, plus the
// shadow-less variants the Low tier switches to) and upload every texture.
function compileAll({ shadows = true } = {}) {
  const hidden = [];
  scene.traverse((o) => { if (!o.visible) { hidden.push(o); o.visible = true; } });
  const sunCast = world.sun.castShadow, smEnabled = renderer.shadowMap.enabled;
  let job = Promise.resolve();
  try {
    if (!shadows) { world.sun.castShadow = false; renderer.shadowMap.enabled = false; }
    job = renderer.compileAsync(scene, camera).catch(() => {});
  } catch (e) {
    console.warn('prewarm compile failed', e);
  } finally {
    world.sun.castShadow = sunCast; renderer.shadowMap.enabled = smEnabled;
    for (const o of hidden) o.visible = false;
  }
  return job;
}
async function prewarm() {
  const t0 = performance.now();
  const seen = new Set();
  scene.traverse((o) => {
    const mats = o.material ? (Array.isArray(o.material) ? o.material : [o.material]) : [];
    for (const m of mats) {
      for (const k in m) {
        const t = m[k];
        if (!t || !t.isTexture || seen.has(t) || t.isRenderTargetTexture) continue;
        seen.add(t);
        const img = t.image;
        if (!img || !(img.width || img.data || t.isCubeTexture)) seen.delete(t);
      }
    }
  });
  let uploaded = 0;
  for (const texture of seen) {
    renderer.initTexture(texture);
    if (++uploaded % 8 === 0) {
      setLoading(88 + uploaded / seen.size * 6, 2, 'Готовим трассу к заезду…');
      await paintLoading();
    }
  }
  const syncMs = Math.round(performance.now() - t0);
  setLoading(96, 2, 'Последний штрих — и поехали!');
  await paintLoading();
  const job = compileAll();
  // parallel compile (KHR_parallel_shader_compile) finishes in the background;
  // never hold the menu hostage for more than a few seconds
  await Promise.race([job, new Promise((r) => setTimeout(r, 5000))]);
  window.__PREWARM__ = { syncMs, ms: Math.round(performance.now() - t0), programs: renderer.info.programs.length, textures: seen.size };
  // The Low tier turns the sun shadow off = a different shader variant of
  // every lit material. Prepare those while the player looks at the menu.
  setTimeout(() => {
    compileAll({ shadows: false }).then(() => { window.__PREWARM__.lowTier = renderer.info.programs.length; });
  }, 1500);
}
setLoading(88, 2, 'Готовим трассу к заезду…');
await paintLoading();
await prewarm();
finishLoading();

setSoundIcons();
fillRecordsPanel(el.recordsMenu, Storage.getRecords());
toMenu();
el.btnVr.classList.remove('hidden');
onResize();
requestAnimationFrame(animate);
window.__READY__ = true;
window.__GL__ = renderer.getContext().getParameter(renderer.getContext().VERSION);
console.log('[CKC] Candy Kingdom Coaster ready — track', Math.round(track.length), 'm, sweets', sweets.total, ', textures', countLoaded(TEX) + '/' + Object.keys(TEX).length);
