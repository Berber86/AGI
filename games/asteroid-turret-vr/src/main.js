import * as THREE from 'three';
import { createGame, stepGame, asteroidPos, DWELL_SECONDS } from './sim.js';
import { deviceOrientationToYawPitch, centroidToYawPitch, clampDeg, angDiffDeg } from './look/math.js';
import { MarkerTracker, FusionLook } from './look/markers.js';
import { unlockAudio, playShot, playExplosion, audioInfo } from './audio.js';
import { createEnvironment, createShip, createAsteroidAssets, setTextureAnisotropy } from './world.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { FxSystem } from './fx.js';

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
let hullShake = 0; // flat-screen only impact shake (never in VR: comfort)

const tracker = new MarkerTracker();
const fusion = new FusionLook();
let camState = { active: false, worker: null, busy: false, stream: null, video: null, lastDet: null, procMs: null, workerActive: false, tier: 160 };

// deterministic rng for the live game (seeded via test bridge / start)
function rng() { rngState = (Math.imul(rngState, 1664525) + 1013904223) >>> 0; return rngState / 4294967296; }

// ---------------------------------------------------------------- three setup
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.24;
renderer.outputColorSpace = THREE.SRGBColorSpace;
setTextureAnisotropy(Math.min(4, renderer.capabilities.getMaxAnisotropy()));
const scene = new THREE.Scene();
// Image-based lighting from a tiny procedural room: metal, glass canopy and
// white armour pick up real reflections instead of flat specular streaks.
// Generated once at startup (PMREM), zero per-frame cost.
{
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.38;
  pmrem.dispose();
}
scene.background = new THREE.Color(0x04060f);
const camera = new THREE.PerspectiveCamera(70, 1, 0.1, 400);

const environment = createEnvironment(scene);
const ship = createShip();
scene.add(camera);
camera.add(ship.group);
const fx = new FxSystem(scene);

scene.add(new THREE.HemisphereLight(0xcfe0ff, 0x2a1c30, 1.25));
const sun = new THREE.DirectionalLight(0xffd9a6, 2.6); sun.position.set(-14, 7, -6); scene.add(sun); // warm key from the sun side
const rim = new THREE.DirectionalLight(0xff3df0, 0.55); rim.position.set(-6, -2, 6); scene.add(rim);
const fill = new THREE.DirectionalLight(0x8fb4ff, 0.55); fill.position.set(6, 3, 12); scene.add(fill); // camera-side fill so rocks read
const hitFlash = new THREE.PointLight(0xff4444, 0, 9); hitFlash.position.set(0, 0, -1); camera.add(hitFlash);

// ---------------------------------------------------------------- asteroids
const rockAssets = createAsteroidAssets();
const ringGeo = new THREE.RingGeometry(2.08, 2.2, 48);
const ARC_POINTS = 48;
const meshes = new Map(); // id -> {group, rock, ring, arc, arcGeo, bracket}

function makeArc(radius, color) {
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(ARC_POINTS * 3), 3));
  const line = new THREE.Line(geo, new THREE.LineBasicMaterial({ color, transparent: true, opacity: 1 }));
  line.frustumCulled = false;
  return { line, geo, radius };
}
function setArc(arc, frac) {
  const pos = arc.geo.attributes.position;
  const n = Math.max(2, Math.floor(ARC_POINTS * Math.min(1, frac)));
  for (let i = 0; i < n; i++) {
    const t = (i / (ARC_POINTS - 1)) * Math.PI * 2 * Math.min(1, frac) - Math.PI / 2;
    pos.setXYZ(i, Math.cos(t) * arc.radius, Math.sin(t) * arc.radius, 0);
  }
  pos.needsUpdate = true;
  arc.geo.setDrawRange(0, n);
}
function makeBrackets() {
  // Four corner brackets that frame the gazed target (in-world, not HUD).
  const mat = new THREE.LineBasicMaterial({ color: 0x38f5ff, transparent: true, opacity: 0.9 });
  const pts = [];
  const R = 2.75, L = 0.55;
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    pts.push(new THREE.Vector3(sx * R, sy * R, 0), new THREE.Vector3(sx * (R - L), sy * R, 0));
    pts.push(new THREE.Vector3(sx * R, sy * R, 0), new THREE.Vector3(sx * R, sy * (R - L), 0));
  }
  const geo = new THREE.BufferGeometry().setFromPoints(pts);
  const lines = new THREE.LineSegments(geo, mat);
  lines.visible = false;
  return lines;
}

function meshFor(a) {
  let m = meshes.get(a.id);
  if (!m) {
    const group = new THREE.Group();
    const rock = new THREE.Mesh(rockAssets.geometryFor(a.id), rockAssets.makeMaterial());
    // Per-rock material variety: tint, roughness, metalness
    const hueShift = ((a.id * 37) % 10 - 5) * 0.005;
    rock.material.color.offsetHSL(hueShift, 0, ((a.id * 53) % 10 - 5) * 0.012);
    rock.material.roughness = 0.88 + (a.id % 7) * 0.02;
    rock.material.metalness = 0.03 + (a.id % 5) * 0.02;
    // Rim heat glow: stronger when close, fades with distance
    rock.material.emissive.setHex(0x1a0d06);
    rock.material.emissiveIntensity = 1.4;
    const ring = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color: 0x38f5ff, transparent: true, opacity: 0.22, side: THREE.DoubleSide }));
    const arc = makeArc(2.45, 0x38f5ff);
    const arc2 = makeArc(2.62, 0xff3df0); // counter-rotating outer arc
    const brackets = makeBrackets();
    group.add(rock, ring, arc.line, arc2.line, brackets); scene.add(group);
    m = { group, rock, ring, arc, arc2, brackets }; meshes.set(a.id, m);
  }
  return m;
}
function removeMesh(id) {
  const m = meshes.get(id);
  if (m) {
    scene.remove(m.group);
    m.ring.material.dispose(); m.rock.material.dispose();
    m.arc.geo.dispose(); m.arc.line.material.dispose();
    m.arc2.geo.dispose(); m.arc2.line.material.dispose();
    m.brackets.geometry.dispose(); m.brackets.material.dispose();
    meshes.delete(id);
  }
}

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
  crossEl.style.left = e.clientX + 'px'; crossEl.style.top = e.clientY + 'px';
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
  hullShake = 0;
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
  const statsEl = document.getElementById('last-stats');
  if (statsEl) statsEl.textContent = `${game.kills} / ×${game.bestStreak} / ${Math.floor(game.elapsed / 60)}:${String(Math.floor(game.elapsed % 60)).padStart(2, '0')}`;
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

const _camPos = new THREE.Vector3();
function frame() {
  requestAnimationFrame(frame);
  const dt = Math.min(0.05, clock.getDelta());
  const nowSec = performance.now() / 1000;
  if (mode === 'fusion' && running) pumpCameraFrame();
  environment.update(dt, nowSec);
  ship.update(nowSec);

  if (running) {
    look = currentLook(nowSec);
    // camera follows the look FIRST (single application point, guide §2),
    // so muzzle/beam world positions below are correct for this frame.
    // Impact shake applies only on the flat screen, never in VR (comfort).
    hullShake = Math.max(0, hullShake - dt * 2.2);
    const shakeAmp = (!vrActive && hullShake > 0) ? hullShake * 0.35 : 0;
    camera.position.set((Math.random() - 0.5) * shakeAmp * 0.1, (Math.random() - 0.5) * shakeAmp * 0.1, 0);
    camera.rotation.set(0, 0, 0);
    camera.rotateY((-look.yawDeg * Math.PI) / 180);
    camera.rotateX((look.pitchDeg * Math.PI) / 180);
    if (shakeAmp > 0) camera.rotateZ((Math.random() - 0.5) * shakeAmp * 0.01);
    camera.updateMatrixWorld();
    const { state, events } = stepGame(game, dt, look, rng);
    game = state;
    for (const ev of events) {
      if (ev.type === 'explosion') { fx.fireBeam(ship.muzzle, ev.x, ev.y, ev.z); fx.burst(ev.x, ev.y, ev.z, true); playShot(); playExplosion(); removeMesh(ev.id); }
      if (ev.type === 'hullHit') {
        fx.burst(ev.x, ev.y, ev.z, false); fx.stats.hullFlashes += 1;
        hitFlash.intensity = 14; hullShake = 1; playExplosion(); removeMesh(ev.id);
      }
    }
    // sync meshes
    const alive = new Set(game.asteroids.map((a) => a.id));
    for (const id of [...meshes.keys()]) if (!alive.has(id)) removeMesh(id);
    camera.getWorldPosition(_camPos);
    for (const a of game.asteroids) {
      const m = meshFor(a); const p = asteroidPos(a);
      m.group.position.set(p.x, p.y, p.z);
      m.rock.rotation.set(a.spin, a.spin * 0.7, a.spin * 0.3);
      // proximity warning: the closer the rock, the hotter its rim glow (red-orange fade)
      const heat = Math.max(0, (16 - a.dist) / 16);
      const flicker = 1 + Math.sin(a.spin * 3 + nowSec * 6) * 0.15;
      m.rock.material.emissive.setRGB(
        0.05 + heat * 0.5 * flicker,
        0.025 + heat * 0.18 * flicker,
        0.015 + heat * 0.05 * flicker
      );
      // dwell: faint full ring + bright arc that closes over 1.5 s +
      // a slower counter-rotating outer arc once charging is underway
      const frac = a.dwell / DWELL_SECONDS;
      const targeted = game.gazeTargetId === a.id;
      m.ring.visible = targeted || a.dwell > 0.01;
      m.brackets.visible = targeted;
      m.arc.line.visible = a.dwell > 0.01;
      m.arc2.line.visible = a.dwell > 0.35;
      if (m.arc.line.visible) { setArc(m.arc, frac); m.arc.line.rotation.z = nowSec * 0.6; }
      if (m.arc2.line.visible) { setArc(m.arc2, Math.min(1, frac * 1.15)); m.arc2.line.rotation.z = -nowSec * 0.45; }
      m.ring.material.color.setHSL(0.52 - frac * 0.38, 1, 0.55); // cyan -> magenta when charged
      m.arc.line.material.color.copy(m.ring.material.color);
      m.group.lookAt(_camPos);
      const pulse = targeted ? 1 + Math.sin(nowSec * 10) * 0.03 : 1;
      m.rock.scale.setScalar(pulse);
    }
    document.getElementById('hud-score').textContent = `Счёт: ${game.score}${game.streak >= 2 ? ` · серия ×${game.streak}` : ''}`;
    document.getElementById('hud-hull').textContent = `Корпус: ${game.hull}`;
    const hullBar = document.getElementById('hull-fill');
    if (hullBar) { hullBar.style.width = game.hull + '%'; hullBar.style.background = game.hull > 50 ? '#38f5ff' : (game.hull > 25 ? '#ffb02e' : '#ff4444'); }
    if (game.status === 'lost') endRun('lost');
  }
  fx.update(dt, camera);
  hitFlash.intensity = Math.max(0, hitFlash.intensity - dt * 26);
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
  info: () => ({ mode, quality, vrActive, running, audio: audioInfo(), cam: camInfo(), fx: fx.info(), inVrDomOverlay: vrActive ? document.querySelectorAll('#hud:not(.hidden),#cross:not(.hidden),#prep:not(.hidden)').length : 0 }),
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
