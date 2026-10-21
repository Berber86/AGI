import * as THREE from 'three';
import { createGame, stepGame, asteroidPos, DWELL_SECONDS } from './sim.js';
import { deviceOrientationToYawPitch, centroidToYawPitch, clampDeg, angDiffDeg } from './look/math.js';
import { MarkerTracker, FusionLook } from './look/markers.js';
import { unlockAudio, playShot, playExplosion, audioInfo } from './audio.js';

// ---------------------------------------------------------------- state
const canvas = document.getElementById('game-canvas');
const prepEl = document.getElementById('prep');
const hudEl = document.getElementById('hud');
const crossEl = document.getElementById('cross');
const statusEl = document.getElementById('status');
const BEST_KEY = 'asteroid-turret-vr-best';

let mode = 'flat'; // flat | gyro | fusion
let quality = localStorage.getItem('asteroid-turret-vr-quality') || 'high';
if (quality === 'auto') quality = 'high'; // saved auto migrates to high (guide §4a)
let running = false;
let vrActive = false;
let game = createGame(1);
let rngState = 1234567;
let look = { yawDeg: 0, pitchDeg: 0 };       // degrees, project semantics
let gyroLook = { yawDeg: 0, pitchDeg: 0 };
let gyroSeenAt = -Infinity;
let flatPointer = null; // {x,y} normalized -1..1

const tracker = new MarkerTracker();
const fusion = new FusionLook();
let camState = { active: false, worker: null, busy: false, stream: null, video: null, lastDet: null, procMs: null, workerActive: false, tier: 160 };

// deterministic rng for the live game (seeded via test bridge / start)
function rng() { rngState = (Math.imul(rngState, 1664525) + 1013904223) >>> 0; return rngState / 4294967296; }

// ---------------------------------------------------------------- three setup
const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x04060f);
const camera = new THREE.PerspectiveCamera(70, 1, 0.1, 300);

// starfield
{
  const n = 900; const pos = new Float32Array(n * 3);
  const r = mulberryForStars(7);
  for (let i = 0; i < n; i++) {
    const t = r() * Math.PI * 2, p = Math.acos(r() * 2 - 1), rad = 180;
    pos[i * 3] = rad * Math.sin(p) * Math.cos(t); pos[i * 3 + 1] = rad * Math.cos(p); pos[i * 3 + 2] = rad * Math.sin(p) * Math.sin(t);
  }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  scene.add(new THREE.Points(g, new THREE.PointsMaterial({ color: 0xa8c8ff, size: 0.7, sizeAttenuation: true })));
}
function mulberryForStars(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

// turret (in-world, at the camera base; this is the visible "ship")
const turret = new THREE.Group();
{
  const metal = new THREE.MeshStandardMaterial({ color: 0x3a4a66, metalness: 0.7, roughness: 0.35, emissive: 0x0a2a3a });
  const neon = new THREE.MeshBasicMaterial({ color: 0x38f5ff });
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.7, 0.35, 20), metal); base.position.y = -0.55;
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.3, 0.6), metal); head.position.y = -0.28;
  const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.07, 1.1, 10), metal);
  barrel.rotation.x = Math.PI / 2; barrel.position.set(0, -0.28, -0.7);
  const tip = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 10), neon); tip.position.set(0, -0.28, -1.25);
  turret.add(base, head, barrel, tip);
  scene.add(turret);
}
scene.add(new THREE.AmbientLight(0x8899bb, 1.1));
const sun = new THREE.DirectionalLight(0xffffff, 2.2); sun.position.set(4, 6, 2); scene.add(sun);

// asteroids: shared geometry/material, one type (contract)
const rockGeo = new THREE.IcosahedronGeometry(1.6, 1);
{
  const p = rockGeo.attributes.position; const r = mulberryForStars(42);
  for (let i = 0; i < p.count; i++) { const s = 0.82 + r() * 0.4; p.setXYZ(i, p.getX(i) * s, p.getY(i) * s, p.getZ(i) * s); }
  rockGeo.computeVertexNormals();
}
const rockMat = new THREE.MeshStandardMaterial({ color: 0x8a6f5a, roughness: 0.95, metalness: 0.05, flatShading: true, emissive: 0x1a0d06 });
const ringGeo = new THREE.RingGeometry(2.05, 2.3, 40);
const meshes = new Map(); // id -> {group, rock, ring}
const beams = [];

function meshFor(a) {
  let m = meshes.get(a.id);
  if (!m) {
    const group = new THREE.Group();
    const rock = new THREE.Mesh(rockGeo, rockMat);
    const ring = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color: 0x38f5ff, transparent: true, opacity: 0.95, side: THREE.DoubleSide }));
    group.add(rock, ring); scene.add(group);
    m = { group, rock, ring }; meshes.set(a.id, m);
  }
  return m;
}
function removeMesh(id) { const m = meshes.get(id); if (m) { scene.remove(m.group); m.ring.material.dispose(); meshes.delete(id); } }

function resize() {
  const w = window.innerWidth, h = window.innerHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h; camera.updateProjectionMatrix();
}
window.addEventListener('resize', resize); resize();

// ---------------------------------------------------------------- look providers
function onDeviceOrientation(e) {
  if (e.alpha === null) return;
  const angle = (screen.orientation && screen.orientation.angle) || 0;
  const rel = deviceOrientationToYawPitch(e.alpha, e.beta, e.gamma, angle);
  // Relative-to-start semantics: first sample becomes "straight ahead".
  if (!onDeviceOrientation.zero) onDeviceOrientation.zero = rel;
  gyroLook = {
    yawDeg: clampDeg(angDiffDeg(rel.yawDeg, onDeviceOrientation.zero.yawDeg), -80, 80),
    pitchDeg: clampDeg(rel.pitchDeg - onDeviceOrientation.zero.pitchDeg, -55, 55),
  };
  gyroSeenAt = performance.now() / 1000;
}
async function ensureGyroPermission() {
  if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
    try { return (await DeviceOrientationEvent.requestPermission()) === 'granted'; } catch { return false; }
  }
  return true;
}

canvas.addEventListener('pointermove', (e) => {
  flatPointer = { x: (e.clientX / window.innerWidth) * 2 - 1, y: (e.clientY / window.innerHeight) * 2 - 1 };
});
canvas.addEventListener('pointerdown', (e) => {
  flatPointer = { x: (e.clientX / window.innerWidth) * 2 - 1, y: (e.clientY / window.innerHeight) * 2 - 1 };
  pressStartedAt = performance.now();
});
let pressStartedAt = 0;
canvas.addEventListener('pointerup', () => {
  // Invisible VR exit: long-press ~0.9 s (guide: zero HUD, exit without UI).
  if (vrActive && performance.now() - pressStartedAt >= 900) exitVr('long-press');
  pressStartedAt = 0;
});
window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && vrActive) exitVr('esc'); });

// ---------------------------------------------------------------- camera markers
const camVideo = document.getElementById('cam-preview');
const camStatus = document.getElementById('cam-status');
const camCalBtn = document.getElementById('cam-calibrate');
function camInfo() {
  return { active: camState.active, workerActive: camState.workerActive, procMs: camState.procMs, width: camState.tier, busy: camState.busy };
}
async function startCamera() {
  try {
    camState.stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment', width: { ideal: 640 } }, audio: false });
  } catch { camStatus.textContent = 'Камера недоступна: нет разрешения или устройства. Fusion останется на гироскопе.'; return false; }
  camVideo.srcObject = camState.stream; camVideo.style.display = 'block';
  await camVideo.play().catch(() => {});
  camState.video = camVideo;
  try {
    camState.worker = new Worker(new URL('./look/camtrack-worker.js', import.meta.url), { type: 'module' });
    camState.worker.onmessage = (e) => {
      camState.busy = false; camState.workerActive = true; camState.procMs = e.data.procMs;
      if (e.data.ok) camState.lastDet = e.data;
    };
    camState.worker.onerror = () => { camState.workerActive = false; };
  } catch { camState.worker = null; }
  camState.active = true; camCalBtn.disabled = false;
  camStatus.textContent = 'Камера работает. Наведите её на обе метки и нажмите калибровку, глядя прямо.';
  // Feed the tracker on the prep screen too (entity >=0.15 s must be able to
  // confirm before calibration); analysis stays in the worker, off render.
  setInterval(() => {
    if (!camState.active) return;
    pumpCameraFrame();
    const state = tracker.update(detectionsFromWorker(performance.now() / 1000), performance.now() / 1000);
    if (!running) camStatus.textContent = `Камера работает. Метки: левая ${state.entity.left ? 'есть' : 'нет'}, правая ${state.entity.right ? 'есть' : 'нет'}${state.pairVisible ? ' — пара видна, можно калибровать.' : '.'}`;
  }, 120);
  return true;
}
async function pumpCameraFrame() {
  if (!camState.active || !camState.worker || camState.busy || !camState.video || camState.video.readyState < 2) return;
  camState.busy = true;
  try {
    const bmp = await createImageBitmap(camState.video, { resizeWidth: camState.tier, resizeQuality: 'low' });
    camState.worker.postMessage({ bitmap: bmp, id: Date.now() }, [bmp]);
  } catch { camState.busy = false; }
}
function detectionsFromWorker(nowSec) {
  const d = camState.lastDet;
  const out = { left: null, right: null };
  if (!d) return out;
  for (const side of ['left', 'right']) {
    const b = d[side];
    if (b && b.found) {
      const yp = centroidToYawPitch(b.u, b.v);
      out[side] = { found: true, u: b.u, v: b.v, count: b.count, fill: b.fill, aspect: b.aspect, yawDeg: yp.yawDeg, pitchDeg: yp.pitchDeg, expected: true };
    } else out[side] = { found: false, count: 0 };
  }
  // Symmetric alien-side rejection: magenta must stay left of orange.
  if (out.left.found && out.right.found && out.left.u > out.right.u) { out.left.expected = false; out.right.expected = false; }
  return out;
}

// ---------------------------------------------------------------- game flow
const lastScoreEl = document.getElementById('last-score');
const bestEl = document.getElementById('best-score');
bestEl.textContent = String(Number(localStorage.getItem(BEST_KEY) || 0));

function setQualityInputs() {
  document.querySelectorAll('input[name="quality"]').forEach((i) => { i.checked = i.value === quality; });
}
setQualityInputs();
document.querySelectorAll('input[name="quality"]').forEach((i) => i.addEventListener('change', () => {
  quality = i.value; localStorage.setItem('asteroid-turret-vr-quality', quality);
}));
document.querySelectorAll('input[name="look"]').forEach((i) => i.addEventListener('change', () => {
  document.getElementById('fusion-block').style.display = i.value === 'fusion' && i.checked ? 'block' : 'none';
}));
document.getElementById('cam-start').addEventListener('click', async () => { unlockAudio(); await startCamera(); });
camCalBtn.addEventListener('click', () => {
  const now = performance.now() / 1000;
  // Feed a few synthetic updates so entity timing can confirm, then calibrate.
  const res = tracker.calibrate(detectionsFromWorker(now), now);
  camStatus.textContent = res.ok ? 'Калибровка сохранена: пара меток = прямо.' : 'Калибровка не удалась: нужны ОБЕ метки в кадре непрерывно ≥0,15 с.';
});

async function startGame() {
  unlockAudio();
  mode = document.querySelector('input[name="look"]:checked').value;
  quality = document.querySelector('input[name="quality"]:checked').value;
  localStorage.setItem('asteroid-turret-vr-quality', quality);
  if (mode === 'gyro' || mode === 'fusion') {
    const ok = await ensureGyroPermission();
    if (!ok) { statusEl.textContent = 'Нет разрешения на гироскоп — выберите плоский экран или разрешите датчики.'; return; }
    onDeviceOrientation.zero = null;
    window.addEventListener('deviceorientation', onDeviceOrientation);
    if (mode === 'fusion' && !camState.active) await startCamera();
    vrActive = true;
    try { await document.documentElement.requestFullscreen(); } catch {}
    try { if (screen.orientation && screen.orientation.lock) await screen.orientation.lock('landscape'); } catch {}
  } else vrActive = false;
  game = createGame(1); rngState = 987654321;
  look = { yawDeg: 0, pitchDeg: 0 }; gyroLook = { yawDeg: 0, pitchDeg: 0 };
  prepEl.classList.add('hidden');
  hudEl.classList.toggle('hidden', vrActive); // zero HUD inside glasses
  crossEl.classList.toggle('hidden', vrActive);
  running = true;
  statusEl.textContent = '';
}
function endRun(reason) {
  running = false;
  const best = Math.max(Number(localStorage.getItem(BEST_KEY) || 0), game.score);
  localStorage.setItem(BEST_KEY, String(best));
  bestEl.textContent = String(best); lastScoreEl.textContent = String(game.score);
  if (vrActive) exitVr(reason || 'gameover');
  prepEl.classList.remove('hidden');
  hudEl.classList.add('hidden'); crossEl.classList.add('hidden');
  statusEl.textContent = game.status === 'lost' ? `Корабль уничтожен. Счёт: ${game.score}. Ещё заход?` : 'Пауза.';
}
function exitVr() {
  vrActive = false;
  window.removeEventListener('deviceorientation', onDeviceOrientation);
  if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  if (running) { prepEl.classList.remove('hidden'); running = false; hudEl.classList.add('hidden'); crossEl.classList.add('hidden'); }
}
document.getElementById('start').addEventListener('click', startGame);
document.addEventListener('visibilitychange', () => { if (document.hidden && running) endRun('hidden'); });

// laser beam flash
function fireBeam(a) {
  const p = asteroidPos(a);
  const geo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, -0.28, -1.2), new THREE.Vector3(p.x, p.y, p.z)]);
  const beam = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: 0x38f5ff, transparent: true, opacity: 1 }));
  scene.add(beam); beams.push({ beam, life: 0.12 });
  playShot();
}

// ---------------------------------------------------------------- main loop
const clock = new THREE.Clock();
function currentLook(nowSec) {
  if (mode === 'gyro') return (nowSec - gyroSeenAt < 0.7) ? gyroLook : look; // stale gyro: hold
  if (mode === 'fusion') {
    const gyro = (nowSec - gyroSeenAt < 0.7) ? gyroLook : look;
    const cam = tracker.update(detectionsFromWorker(nowSec), nowSec);
    return fusion.update(gyro, cam, nowSec, 1 / 60);
  }
  if (flatPointer) return { yawDeg: flatPointer.x * 55, pitchDeg: -flatPointer.y * 35 };
  return look;
}

function renderEye(offsetX) {
  const w = window.innerWidth, h = window.innerHeight;
  const halfW = Math.floor(w / 2);
  const x = offsetX < 0 ? 0 : halfW;
  const scale = quality === 'light' ? 0.7 : 1;
  renderer.setViewport(x, 0, halfW * scale, h * scale);
  renderer.setScissor(x, 0, halfW * scale, h * scale);
  renderer.setScissorTest(true);
  camera.aspect = (halfW) / h; camera.updateProjectionMatrix();
  camera.position.set(offsetX, 0, 0);
  renderer.render(scene, camera);
}

function frame() {
  requestAnimationFrame(frame);
  const dt = Math.min(0.05, clock.getDelta());
  const nowSec = performance.now() / 1000;
  if (mode === 'fusion' && running) pumpCameraFrame();

  if (running) {
    look = currentLook(nowSec);
    const { state, events } = stepGame(game, dt, look, rng);
    game = state;
    for (const ev of events) {
      if (ev.type === 'shot') { const a = game.asteroids.find((x) => x.id === ev.id); }
      if (ev.type === 'explosion') playExplosion();
      if (ev.type === 'hullHit') playExplosion();
    }
    // sync meshes
    const alive = new Set(game.asteroids.map((a) => a.id));
    for (const id of [...meshes.keys()]) if (!alive.has(id)) removeMesh(id);
    for (const a of game.asteroids) {
      const m = meshFor(a); const p = asteroidPos(a);
      m.group.position.set(p.x, p.y, p.z);
      m.rock.rotation.set(a.spin, a.spin * 0.7, 0);
      // dwell ring: in-world ring around the asteroid, closes over 1.5 s
      const frac = a.dwell / DWELL_SECONDS;
      m.ring.visible = a.dwell > 0.01;
      m.ring.material.color.setHSL(0.52 - frac * 0.15, 1, 0.55);
      m.ring.scale.setScalar(1.6 - frac * 0.55);
      m.ring.lookAt(camera.getWorldPosition(new THREE.Vector3()));
      if (frac >= 1) { /* shot handled in sim events next step */ }
    }
    // fire beams for shots fired this frame: sim already destroyed targets;
    // show beam toward any asteroid that just reached full dwell last frame
    for (const ev of events) if (ev.type === 'shot') {
      const a = game.asteroids.find((x) => x.id === ev.id) || { yawDeg: ev.yawDeg || look.yawDeg, pitchDeg: ev.pitchDeg || look.pitchDeg, dist: 20 };
      fireBeam(a);
    }
    // turret + camera follow the look (single application point, guide §2)
    camera.position.set(0, 0, 0);
    camera.rotation.set(0, 0, 0);
    camera.rotateY((-look.yawDeg * Math.PI) / 180);
    camera.rotateX((look.pitchDeg * Math.PI) / 180);
    // turret is a camera child: it inherits the look rotation directly
    document.getElementById('hud-score').textContent = `Счёт: ${game.score}`;
    document.getElementById('hud-hull').textContent = `Корпус: ${game.hull}`;
    if (game.status === 'lost') endRun('lost');
  }
  for (let i = beams.length - 1; i >= 0; i--) {
    beams[i].life -= dt; beams[i].beam.material.opacity = Math.max(0, beams[i].life / 0.12);
    if (beams[i].life <= 0) { scene.remove(beams[i].beam); beams.splice(i, 1); }
  }
  if (vrActive) {
    renderer.setScissorTest(true);
    renderEye(-0.032); renderEye(0.032);
    renderer.setScissorTest(false);
    camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix();
    camera.position.set(0, 0, 0);
  } else {
    renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
    renderer.setScissorTest(false);
    camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix();
    renderer.render(scene, camera);
  }
}
frame();

// ---------------------------------------------------------------- test bridge
const bridge = {
  ready: true,
  start: async (m) => { if (m) { const el = document.querySelector(`input[name="look"][value="${m}"]`); if (el) el.checked = true; } await startGame(); return bridge.info(); },
  info: () => ({ mode, quality, vrActive, running, audio: audioInfo(), cam: camInfo(), inVrDomOverlay: vrActive ? document.querySelectorAll('#hud:not(.hidden),#cross:not(.hidden),#prep:not(.hidden)').length : 0 }),
  reset: (seed = 1) => { game = createGame(seed); rngState = (seed * 2654435761) >>> 0; for (const id of [...meshes.keys()]) removeMesh(id); return bridge.state(); },
  setLook: (yawDeg, pitchDeg) => { look = { yawDeg, pitchDeg }; flatPointer = { x: yawDeg / 55, y: -pitchDeg / 35 }; return look; },
  // Deterministic step for QA (mirrors the sim used by the render loop)
  step: (dt, gaze) => { const r = stepGame(game, dt, gaze || look, rng); game = r.state; return { state: bridge.state(), events: r.events }; },
  state: () => JSON.parse(JSON.stringify(game)),
  tracker: () => ({ calibration: tracker.calibration, markers: JSON.parse(JSON.stringify(tracker.markers)) }),
  camFeed: (detections, nowSec) => tracker.update(detections, nowSec),
  camCalibrate: (detections, nowSec) => tracker.calibrate(detections, nowSec),
  endRun: () => endRun('test'),
};
window.__GAME_TEST__ = bridge;

// service worker: versioned code cache, media cache separate (guide §9)
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  navigator.serviceWorker.register('./sw.js').catch(() => {});
}
window.__READY__ = true;
