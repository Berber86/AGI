// Candy Kingdom Coaster — bootstrap & game loop.
import * as THREE from 'three';
import { EffectComposer } from '../vendor/three/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from '../vendor/three/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from '../vendor/three/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from '../vendor/three/jsm/postprocessing/OutputPass.js';

import { GAME, TUNING, ZONES, zoneAt, formatTime, MEDALS, TIME_MEDAL } from './config.js';
import { Storage } from './storage.js';
import { SFX } from './audio.js';
import { Input } from './input.js';
import { createTrack } from './track.js';
import { createCar, createTrail } from './car.js';
import { createWorld } from './world.js';
import { createSweets, Burst } from './sweets.js';
import { HUD, fillRecordsPanel } from './hud.js';
import { QualityGovernor } from './quality.js';

// ---------------------------------------------------------------- renderer
const canvas = document.getElementById('game-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
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
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.45, 0.55, 0.92);
composer.addPass(bloom);
composer.addPass(new OutputPass());

// ---------------------------------------------------------------- world
const track = createTrack(scene);
const world = createWorld(scene, track, renderer);
const car = createCar();
scene.add(car.root);
const trail = createTrail(scene);
const sweets = createSweets(scene, track);
const finishFx = new Burst(scene);
const hud = new HUD(document.getElementById('hud'), track);
const input = new Input();
const governor = new QualityGovernor(renderer, composer, world);

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
  countdownT: 0,
  countdownN: 3,
  introT: 0,
  goHideT: 0,
  bumpCooldown: 0,
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
  zoneToast: document.getElementById('zone-toast'),
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
  medalsList: document.getElementById('medals-list'),
  recordsMenu: document.getElementById('records-menu'),
  recordsFinish: document.getElementById('records-finish'),
  boostCount: document.getElementById('hud-boost-count'),
};

// gentle haptics where supported (Android Chrome) — silent no-op elsewhere
const HAPTIC = {
  buzz(p) { try { navigator.vibrate && navigator.vibrate(p); } catch { /* ignore */ } },
};

function showScreen(name) {
  for (const [k, node] of Object.entries(screens)) node.classList.toggle('hidden', k !== name);
}

function setSoundIcons() {
  hud.setMuted(SFX.isMuted());
  el.btnSound2.textContent = SFX.isMuted() ? '🔇 Звук выключен' : '🔊 Звук включён';
}

// ---------------------------------------------------------------- flow
function toMenu() {
  game.state = 'menu';
  input.releaseAll();
  showScreen('menu');
  el.countdown.classList.add('hidden');
  fillRecordsPanel(el.recordsMenu, Storage.getRecords());
  setSoundIcons();
  SFX.engineStop();
  window.__GAME_STATE__ = 'menu';
}

function startRace() {
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
  sweets.reset();
  input.releaseAll();
  showScreen(null);
  el.countdown.classList.add('hidden');
  game.state = 'intro'; // 6s cinematic sweep before the 3-2-1
  window.__GAME_STATE__ = 'intro';
  SFX.unlock();
  SFX.engineStart();
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
    input.releaseAll();
    showScreen('pause');
    setSoundIcons();
    window.__GAME_STATE__ = 'paused';
    SFX.play('click');
    SFX.engineStop();
  } else if (game.state === 'paused') {
    resumeGame();
  }
}

function resumeGame() {
  game.state = 'racing';
  input.releaseAll();
  showScreen(null);
  el.countdown.classList.add('hidden'); // a countdown digit must not survive the pause
  game.goHideT = 0;
  window.__GAME_STATE__ = 'racing';
  SFX.play('click');
  SFX.unlock();
  SFX.engineStart();
}

function finishRace() {
  game.state = 'finish';
  input.releaseAll();
  SFX.engineStop();
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
  const records = Storage.commitRun({
    timeMs, sweets: collected, total, score: game.score,
    medalsEarned, starsEarned: game.stars,
  });
  el.finishTime.textContent = formatTime(game.timeS);
  el.finishSweets.textContent = `${collected}`;
  el.finishStars.textContent = `${game.stars}`;
  el.medalsList.innerHTML = hud.renderMedals({ sweets: collected, total, timeMs, score: game.score });
  fillRecordsPanel(el.recordsFinish, records);
  showScreen('finish');
  setSoundIcons();
  SFX.play('finish');
  HAPTIC.buzz([50, 70, 50, 70, 120]);
  window.__GAME_STATE__ = 'finish';
  window.__SHOT_INFO__ = { timeMs, sweets: collected, total, score: game.score, medalsEarned, stars: game.stars };
}

// ---------------------------------------------------------------- UI wiring
document.addEventListener('pointerdown', () => SFX.unlock(), { once: true });

el.btnPlay.addEventListener('click', () => { SFX.unlock(); SFX.play('click'); startRace(); });
el.btnResume.addEventListener('click', () => resumeGame());
el.btnRestart.addEventListener('click', () => { SFX.play('click'); startRace(); });
el.btnRestart2.addEventListener('click', () => { SFX.play('click'); startRace(); });
el.btnMenu.addEventListener('click', () => { SFX.play('click'); toMenu(); });
el.btnMenu2.addEventListener('click', () => { SFX.play('click'); toMenu(); });
document.getElementById('btn-sound').addEventListener('click', () => {
  SFX.unlock(); SFX.toggleMute(); setSoundIcons(); SFX.play('click');
});
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
el.btnSound2.addEventListener('click', () => {
  SFX.unlock(); SFX.toggleMute(); setSoundIcons(); SFX.play('click');
});
document.getElementById('btn-pause').addEventListener('click', () => pauseGame());
input.onPause = () => pauseGame();
input.attachButton(document.getElementById('btn-left'), 'left');
input.attachButton(document.getElementById('btn-right'), 'right');

window.addEventListener('keydown', (e) => {
  if (e.key.toLowerCase() === 'm') { SFX.toggleMute(); setSoundIcons(); }
  if (e.key === ' ' || e.key === 'Enter') {
    if (game.state === 'menu') { SFX.unlock(); startRace(); }
    else if (game.state === 'intro') skipIntro();
    else if (game.state === 'finish') startRace();
    else if (game.state === 'paused') resumeGame();
  }
});

// any tap during the cinematic intro jumps straight to the 3-2-1
window.addEventListener('pointerdown', () => { if (game.state === 'intro') skipIntro(); }, { capture: true });

function onResize() {
  const w = window.innerWidth, h = window.innerHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
  composer.setSize(w, h);
  bloom.setSize(w, h);
}
window.addEventListener('resize', onResize);
window.addEventListener('orientationchange', () => setTimeout(onResize, 250));

// ---------------------------------------------------------------- zone toast
let toastTimer = 0;
function showZoneToast() { /* zone toasts removed — distracting for kids */ }

// ---------------------------------------------------------------- gameplay
function updateGameplay(dt) {
  // cinematic intro: camera starts front-top, sweeps around, settles behind
  if (game.state === 'intro') {
    game.introT += dt;
    const T = 6;
    const p = Math.min(1, game.introT / T);
    const e = p * p * (3 - 2 * p); // smoothstep
    const pose = track.getPose(game.s, game.lateral);
    const chase = track.getPose(Math.max(0, game.s - TUNING.camBack), game.lateral * 0.55);
    if (game.s < TUNING.camBack) {
      const p0 = track.getPose(0, game.lateral * 0.55);
      const t0 = track.getPose(Math.min(track.length, 8), game.lateral * 0.55);
      const dir = t0.pos.clone().sub(p0.pos).normalize();
      chase.pos.copy(p0.pos).addScaledVector(dir, game.s - TUNING.camBack);
    }
    const chaseAhead = track.getPose(Math.min(track.length, game.s + TUNING.camAhead), game.lateral * 0.22);
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
    camera.fov = THREE.MathUtils.lerp(camera.fov, 58, dt * 2);
    camera.updateProjectionMatrix();
    car.root.position.copy(pose.pos);
    car.root.position.y += 0.02;
    car.root.rotation.y = pose.heading;
    car.update(dt, { speed: 0, steer: 0, boost: false });
    const knocked = world.update(dt, camera.position, game.s / track.length, performance.now() * 0.001, -1, 0);
    finishFx.update(dt);
    hud.drawMinimap(0, sweets.list);
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

  // speed
  const target = game.freeze ? 0 : (game.boostActive ? TUNING.boostSpeed : (Math.abs(game.lateral) > TUNING.roadHalfWidth + 1.0 ? TUNING.cruiseSpeed * TUNING.offRoadSlow : game.boostCharges >= 4 ? TUNING.maxSpeed : TUNING.cruiseSpeed));
  game.speed = THREE.MathUtils.lerp(game.speed, target, dt * (game.boostActive ? 1.6 : 0.9));

  if (racing) {
    game.timeS += dt;

    // boost auto-trigger when full
    if (!game.boostActive && game.boostCharges >= TUNING.boostCharges) {
      game.boostActive = true;
      game.boostT = TUNING.boostDuration;
      game.boostCharges = 0;
      SFX.play('boost');
      HAPTIC.buzz([25, 35, 45]);
      hud.popup('🚀');
    }
    if (game.boostActive) {
      game.boostT -= dt;
      if (game.boostT <= 0) game.boostActive = false;
    }

    // steering
    const steer = input.steer;
    game.lateral += steer * TUNING.steerSpeed * dt * (0.72 + 0.28 * Math.min(1, game.speed / TUNING.cruiseSpeed));
    if (steer === 0) {
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
    game.s += game.speed * dt;
    if (game.s >= track.length) {
      game.s = track.length;
      finishRace();
    }
  }

  // sweets collection (also works in countdown-roll-in, harmless)
  const events = sweets.update(dt, game.s, game.lateral, performance.now() * 0.001);
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
  car.root.position.y += 0.02;
  car.root.rotation.y = pose.heading;
  // lean into the road slope
  car.root.rotation.x = -pose.pitch * 0.65;
  car.update(dt, {
    speed: game.speed,
    steer: input.steer || (game.lateral < -0.3 ? -0.25 : game.lateral > 0.3 ? 0.25 : 0),
    boost: game.boostActive,
    offRoad: Math.abs(game.lateral) > TUNING.roadHalfWidth + 0.6,
  });
  trail.update(dt, car.root, game.speed, game.boostActive);

  // camera: readable chase view
  const back = track.getPose(Math.max(0, game.s - TUNING.camBack), game.lateral * 0.55);
  if (game.s < TUNING.camBack) {
    // before the start line extrapolate along the initial tangent so the car
    // is framed normally from the very first frame (no s=0 clamp pile-up)
    const p0 = track.getPose(0, game.lateral * 0.55);
    const t0 = track.getPose(Math.min(track.length, 8), game.lateral * 0.55);
    const dir = t0.pos.clone().sub(p0.pos).normalize();
    back.pos.copy(p0.pos).addScaledVector(dir, game.s - TUNING.camBack);
  }
  const ahead = track.getPose(Math.min(track.length, game.s + TUNING.camAhead), game.lateral * 0.22);
  const desiredPos = back.pos.clone().add(new THREE.Vector3(0, TUNING.camUp + 0.6, 0));
  const desiredTgt = ahead.pos.clone().add(new THREE.Vector3(0, 1.05, 0));
  const k = game.camSnap ? 1 : 1 - Math.exp(-TUNING.camLerp * dt);
  game.camSnap = false;
  game.camPos.lerp(desiredPos, k);
  game.camTarget.lerp(desiredTgt, k);
  camera.position.copy(game.camPos);
  camera.lookAt(game.camTarget);
  // subtle FOV kick on boost
  const targetFov = game.boostActive ? 63 : 55;
  camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov, dt * 2.2);
  camera.updateProjectionMatrix();

  // zone tracking
  const u = game.s / track.length;
  const z = zoneAt(u);
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
  hud.drawMinimap(u, sweets.list);

  const knocked = world.update(dt, camera.position, u, performance.now() * 0.001, game.s, game.lateral);
  if (knocked > 0) { SFX.play('knock'); HAPTIC.buzz(28); }
  finishFx.update(dt);
  // driving sound layer follows speed
  SFX.engineUpdate(game.speed / TUNING.cruiseSpeed, game.boostActive);
}

// ---------------------------------------------------------------- loop
let lastT = performance.now();
function animate(now) {
  requestAnimationFrame(animate);
  const dt = Math.min(0.05, (now - lastT) / 1000);
  lastT = now;

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
    hud.drawMinimap(0.02, sweets.list);
    // the attract scene MUST render too — otherwise the menu card floats on a
    // black void instead of the living candy world behind it
    if (governor.frame(dt)) composer.render();
    window.__FPS__ = Math.round(governor.fps);
    window.__GAME_STATE__ = 'menu';
    return;
  }

  updateGameplay(dt);
  if (governor.frame(dt)) composer.render();
  window.__FPS__ = Math.round(governor.fps);
  window.__GAME_STATE__ = game.state;
}

// ---------------------------------------------------------------- PWA & test hooks
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}

window.__TEST__ = {
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
  setProgress(u, lateral = 0, freeze = false) {
    game.s = track.length * u;
    game.lateral = lateral;
    game.state = 'racing';
    game.speed = freeze ? 0 : TUNING.cruiseSpeed;
    game.freeze = freeze;
    game.camSnap = true;
    showScreen(null);
    el.countdown.classList.add('hidden');
  },
  snapCamera() {
    const back = track.getPose(Math.max(0, game.s - TUNING.camBack), game.lateral * 0.55);
    const ahead = track.getPose(Math.min(track.length, game.s + TUNING.camAhead), game.lateral * 0.22);
    game.camPos.copy(back.pos).add(new THREE.Vector3(0, TUNING.camUp + 0.6, 0));
    game.camTarget.copy(ahead.pos).add(new THREE.Vector3(0, 1.05, 0));
    camera.position.copy(game.camPos);
    camera.lookAt(game.camTarget);
  },
  collectAll() { sweets.collectAllDemo(); game.score = sweets.total * 10; },
  // Visual QA: pin the quality tier so a slow headless GPU cannot silently
  // downgrade shadows/bloom while taking reference screenshots.
  pinQuality(tier = 2) {
    governor.tier = tier;
    governor.apply();
    return governor.describe();
  },
  state: () => game.state,
  // Acceptance helper: project the road ahead to screen space (px).
  roadScreenPoints(aheadFrom = 20, aheadTo = 110, step = 10) {
    const pts = [];
    const v = new THREE.Vector3();
    camera.updateMatrixWorld(true);
    for (let d = aheadFrom; d <= aheadTo; d += step) {
      const s = Math.min(track.length - 1, game.s + d);
      const p = track.getPose(s, 0).pos.clone();
      v.copy(p).project(camera);
      pts.push({ d, x: (v.x * 0.5 + 0.5) * window.innerWidth, y: (-v.y * 0.5 + 0.5) * window.innerHeight, onScreen: Math.abs(v.x) <= 1 && Math.abs(v.y) <= 1 && v.z <= 1 });
    }
    return pts;
  },
  gameInfo() {
    return {
      trackLength: Math.round(track.length), totalSweets: sweets.total,
      state: game.state, timeS: +game.timeS.toFixed(2), speedKmh: +(game.speed * 3.6).toFixed(1),
      lateral: +game.lateral.toFixed(2), collected: sweets.collected,
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
    return it ? { s: +it.s.toFixed(1), lateral: +it.lateral.toFixed(2), collected: it.collected, total: sweets.list.length } : null;
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

setSoundIcons();
fillRecordsPanel(el.recordsMenu, Storage.getRecords());
toMenu();
onResize();
requestAnimationFrame(animate);
window.__READY__ = true;
window.__GL__ = renderer.getContext().getParameter(renderer.getContext().VERSION);
console.log('[CKC] Candy Kingdom Coaster ready — track', Math.round(track.length), 'm, sweets', sweets.total);
