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

// --- space environment: nebula sprites + a ringed planet (procedural, 0 assets)
function glowTexture(inner, outer) {
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(64, 64, 4, 64, 64, 64);
  g.addColorStop(0, inner); g.addColorStop(1, outer);
  ctx.fillStyle = g; ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}
{
  const nebTexA = glowTexture('rgba(70,40,160,0.55)', 'rgba(70,40,160,0)');
  const nebTexB = glowTexture('rgba(10,90,110,0.5)', 'rgba(10,90,110,0)');
  const mkNeb = (tex, x, y, z, s) => { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false })); sp.position.set(x, y, z); sp.scale.setScalar(s); scene.add(sp); };
  mkNeb(nebTexA, -70, 26, -150, 150); mkNeb(nebTexB, 85, -18, -140, 130); mkNeb(nebTexA, 10, 55, -165, 110);
  const planet = new THREE.Mesh(new THREE.SphereGeometry(16, 32, 24), new THREE.MeshStandardMaterial({ color: 0x2c5f8a, roughness: 0.8, emissive: 0x06182c }));
  planet.position.set(-72, -26, -150); scene.add(planet);
  const ring = new THREE.Mesh(new THREE.RingGeometry(21, 30, 48), new THREE.MeshBasicMaterial({ color: 0x6fd8ff, transparent: true, opacity: 0.28, side: THREE.DoubleSide }));
  ring.position.copy(planet.position); ring.rotation.x = Math.PI / 2.7; scene.add(ring);
}

// turret + ship deck (in-world; child of the camera so it rides the look)
const turret = new THREE.Group();
let muzzleTip = null;
{
  const metal = new THREE.MeshStandardMaterial({ color: 0x3a4a66, metalness: 0.7, roughness: 0.35, emissive: 0x0a2a3a });
  const dark = new THREE.MeshStandardMaterial({ color: 0x1b2740, metalness: 0.6, roughness: 0.5, emissive: 0x050b16 });
  const neon = new THREE.MeshBasicMaterial({ color: 0x38f5ff });
  const pink = new THREE.MeshBasicMaterial({ color: 0xff3df0 });
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.72, 0.35, 20), metal); base.position.y = -0.55;
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.3, 0.62), metal); head.position.y = -0.28;
  const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.075, 1.15, 10), metal);
  barrel.rotation.x = Math.PI / 2; barrel.position.set(0, -0.28, -0.72);
  muzzleTip = new THREE.Mesh(new THREE.SphereGeometry(0.075, 10, 10), neon); muzzleTip.position.set(0, -0.28, -1.3);
  // ship deck + side rails with running lights, below the turret
  const deck = new THREE.Mesh(new THREE.BoxGeometry(7.5, 0.28, 5.5), dark); deck.position.set(0, -1.28, 0.6);
  const railL = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.16, 4.6), metal); railL.position.set(-2.4, -0.98, 0.2);
  const railR = railL.clone(); railR.position.x = 2.4;
  const stripL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.05, 4.2), neon); stripL.position.set(-2.4, -0.88, 0.2);
  const stripR = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.05, 4.2), pink); stripR.position.set(2.4, -0.88, 0.2);
  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.8, 8), metal); mast.position.set(1.7, -0.6, 1.3);
  const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), pink); beacon.position.set(1.7, -0.18, 1.3);
  beacon.name = 'beacon';
  turret.add(base, head, barrel, muzzleTip, deck, railL, railR, stripL, stripR, mast, beacon);
  turret.scale.setScalar(0.6);
  turret.position.set(0, -0.42, -1.45);
  scene.add(camera);
  camera.add(turret);
}
scene.add(new THREE.AmbientLight(0x8899bb, 1.1));
const sun = new THREE.DirectionalLight(0xffffff, 2.2); sun.position.set(4, 6, 2); scene.add(sun);
const hitFlash = new THREE.PointLight(0xff4444, 0, 9); hitFlash.position.set(0, 0, -1); camera.add(hitFlash);

// asteroids: shared geometry/material, one type (contract)
const rockGeo = new THREE.IcosahedronGeometry(1.6, 1);
{
  const p = rockGeo.attributes.position; const r = mulberryForStars(42);
  for (let i = 0; i < p.count; i++) { const s = 0.82 + r() * 0.4; p.setXYZ(i, p.getX(i) * s, p.getY(i) * s, p.getZ(i) * s); }
  rockGeo.computeVertexNormals();
}
const rockMat = new THREE.MeshStandardMaterial({ color: 0x8a6f5a, roughness: 0.95, metalness: 0.05, flatShading: true, emissive: 0x1a0d06 });
const ringGeo = new THREE.RingGeometry(2.08, 2.2, 48);
const ARC_POINTS = 48;
const meshes = new Map(); // id -> {group, rock, ring, arc, arcGeo}
const beams = [];
const fxBursts = [];

function makeArc() {
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(ARC_POINTS * 3), 3));
  const line = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: 0x38f5ff, transparent: true, opacity: 1 }));
  line.frustumCulled = false;
  return { line, geo };
}
function setArc(arc, frac) {
  const pos = arc.geo.attributes.position;
  const n = Math.max(2, Math.floor(ARC_POINTS * Math.min(1, frac)));
  for (let i = 0; i < ARC_POINTS; i++) {
    const t = (i / (ARC_POINTS - 1)) * Math.PI * 2 * Math.min(1, frac) - Math.PI / 2;
    const idx = Math.min(i, n - 1);
    const tt = (idx / (ARC_POINTS - 1)) * Math.PI * 2 * Math.min(1, frac) - Math.PI / 2;
    pos.setXYZ(i, Math.cos(tt) * 2.45, Math.sin(tt) * 2.45, 0);
    void t;
  }
  pos.needsUpdate = true;
  arc.geo.setDrawRange(0, n);
}

function meshFor(a) {
  let m = meshes.get(a.id);
  if (!m) {
    const group = new THREE.Group();
    const rock = new THREE.Mesh(rockGeo, rockMat.clone());
    const ring = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color: 0x38f5ff, transparent: true, opacity: 0.22, side: THREE.DoubleSide }));
    const arc = makeArc();
    group.add(rock, ring, arc.line); scene.add(group);
    m = { group, rock, ring, arc }; meshes.set(a.id, m);
  }
  return m;
}
function removeMesh(id) { const m = meshes.get(id); if (m) { scene.remove(m.group); m.ring.material.dispose(); m.rock.material.dispose(); m.arc.geo.dispose(); m.arc.line.material.dispose(); meshes.delete(id); } }

// --- explosion FX: pooled particle bursts + tumbling shards (all in-world) ---
const MAX_PARTICLES = 420;
const particleGeo = new THREE.BufferGeometry();
particleGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(MAX_PARTICLES * 3), 3));
particleGeo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(MAX_PARTICLES * 3), 3));
const particleMat = new THREE.PointsMaterial({ size: 0.55, vertexColors: true, transparent: true, opacity: 0.95, depthWrite: false });
const particlePoints = new THREE.Points(particleGeo, particleMat);
particlePoints.frustumCulled = false; scene.add(particlePoints);
const particles = []; // {pos, vel, life, maxLife, r,g,b}
const shardGeo = new THREE.TetrahedronGeometry(0.34);
const shardMat = new THREE.MeshStandardMaterial({ color: 0x7a5f4c, roughness: 0.9, flatShading: true, emissive: 0x200f04 });
const shards = [];
for (let i = 0; i < 26; i++) { const s = new THREE.Mesh(shardGeo, shardMat); s.visible = false; scene.add(s); shards.push({ mesh: s, vel: new THREE.Vector3(), rot: new THREE.Vector3(), life: 0 }); }
let fxStats = { bursts: 0, hullFlashes: 0 };

function burst(x, y, z, big = true) {
  fxStats.bursts += 1;
  const count = big ? 46 : 22;
  const origin = new THREE.Vector3(x, y, z);
  for (let i = 0; i < count && particles.length < MAX_PARTICLES; i++) {
    const v = new THREE.Vector3((Math.random() - 0.5), (Math.random() - 0.5), (Math.random() - 0.5)).normalize().multiplyScalar(2.5 + Math.random() * (big ? 7 : 4));
    const warm = Math.random();
    particles.push({ pos: origin.clone(), vel: v, life: 0, maxLife: 0.55 + Math.random() * 0.7, r: 1, g: 0.45 + warm * 0.4, b: 0.12 + warm * 0.2 });
  }
  let spawned = 0;
  for (const sh of shards) {
    if (sh.life > 0) continue;
    sh.life = 0.7 + Math.random() * 0.5;
    sh.mesh.visible = true; sh.mesh.position.copy(origin);
    sh.mesh.scale.setScalar(0.6 + Math.random() * 0.9);
    sh.vel.set((Math.random() - 0.5) * 7, (Math.random() - 0.5) * 7, (Math.random() - 0.5) * 7);
    sh.rot.set(Math.random() * 5, Math.random() * 5, Math.random() * 5);
    if (++spawned >= (big ? 6 : 3)) break;
  }
  // impact flash sprite
  const flash = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture('rgba(255,190,90,1)', 'rgba(255,90,20,0)'), transparent: true, depthWrite: false }));
  flash.position.copy(origin); flash.scale.setScalar(big ? 7 : 4);
  scene.add(flash); fxBursts.push({ flash, life: 0.22, max: 0.22 });
}
function updateFx(dt) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const pt = particles[i]; pt.life += dt;
    if (pt.life >= pt.maxLife) { particles.splice(i, 1); continue; }
    pt.vel.multiplyScalar(1 - dt * 1.4); pt.pos.addScaledVector(pt.vel, dt);
  }
  const pos = particleGeo.attributes.position; const col = particleGeo.attributes.color;
  for (let i = 0; i < MAX_PARTICLES; i++) {
    const pt = particles[i];
    if (pt) { const fade = 1 - pt.life / pt.maxLife; pos.setXYZ(i, pt.pos.x, pt.pos.y, pt.pos.z); col.setXYZ(i, pt.r * fade, pt.g * fade, pt.b * fade); }
    else { pos.setXYZ(i, 0, 0, -999); col.setXYZ(i, 0, 0, 0); }
  }
  pos.needsUpdate = true; col.needsUpdate = true;
  for (const sh of shards) {
    if (sh.life <= 0) continue;
    sh.life -= dt; sh.mesh.position.addScaledVector(sh.vel, dt);
    sh.mesh.rotation.x += sh.rot.x * dt; sh.mesh.rotation.y += sh.rot.y * dt;
    if (sh.life <= 0) sh.mesh.visible = false;
  }
  for (let i = fxBursts.length - 1; i >= 0; i--) {
    const f = fxBursts[i]; f.life -= dt;
    f.flash.material.opacity = Math.max(0, f.life / f.max);
    f.flash.scale.multiplyScalar(1 + dt * 6);
    if (f.life <= 0) { scene.remove(f.flash); f.flash.material.dispose(); fxBursts.splice(i, 1); }
  }
  for (let i = beams.length - 1; i >= 0; i--) {
    beams[i].life -= dt;
    beams[i].mesh.material.opacity = Math.max(0, beams[i].life / beams[i].max) * 0.95;
    if (beams[i].life <= 0) { scene.remove(beams[i].mesh); beams[i].mesh.geometry.dispose(); beams[i].mesh.material.dispose(); beams.splice(i, 1); }
  }
  hitFlash.intensity = Math.max(0, hitFlash.intensity - dt * 26);
  const beacon = turret.getObjectByName('beacon');
  if (beacon) beacon.material.color.setHex(Math.sin(performance.now() / 280) > 0 ? 0xff3df0 : 0x57104f);
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

// laser beam: glowing cylinder from the real muzzle to the real impact point
const beamMat = () => new THREE.MeshBasicMaterial({ color: 0x7df9ff, transparent: true, opacity: 0.95, depthWrite: false });
const _muzzle = new THREE.Vector3(); const _target = new THREE.Vector3(); const _mid = new THREE.Vector3(); const _dir = new THREE.Vector3();
function fireBeamTo(x, y, z) {
  if (muzzleTip) muzzleTip.getWorldPosition(_muzzle); else _muzzle.set(0, -0.3, -1);
  _target.set(x, y, z);
  const len = _muzzle.distanceTo(_target);
  const geo = new THREE.CylinderGeometry(0.045, 0.075, len, 8, 1, true);
  const mesh = new THREE.Mesh(geo, beamMat());
  _mid.addVectors(_muzzle, _target).multiplyScalar(0.5);
  mesh.position.copy(_mid);
  _dir.subVectors(_target, _muzzle).normalize();
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), _dir);
  scene.add(mesh); beams.push({ mesh, life: 0.16, max: 0.16 });
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
    // camera follows the look FIRST (single application point, guide §2),
    // so muzzle/beam world positions below are correct for this frame
    camera.position.set(0, 0, 0);
    camera.rotation.set(0, 0, 0);
    camera.rotateY((-look.yawDeg * Math.PI) / 180);
    camera.rotateX((look.pitchDeg * Math.PI) / 180);
    camera.updateMatrixWorld();
    const { state, events } = stepGame(game, dt, look, rng);
    game = state;
    for (const ev of events) {
      if (ev.type === 'explosion') { fireBeamTo(ev.x, ev.y, ev.z); burst(ev.x, ev.y, ev.z, true); playExplosion(); removeMesh(ev.id); }
      if (ev.type === 'hullHit') { burst(ev.x, ev.y, ev.z, false); hitFlash.intensity = 14; fxStats.hullFlashes += 1; playExplosion(); removeMesh(ev.id); }
    }
    // sync meshes
    const alive = new Set(game.asteroids.map((a) => a.id));
    for (const id of [...meshes.keys()]) if (!alive.has(id)) removeMesh(id);
    const camPos = camera.getWorldPosition(new THREE.Vector3());
    for (const a of game.asteroids) {
      const m = meshFor(a); const p = asteroidPos(a);
      m.group.position.set(p.x, p.y, p.z);
      m.rock.rotation.set(a.spin, a.spin * 0.7, a.spin * 0.3);
      // proximity warning: the closer the rock, the hotter its rim glow
      m.rock.material.emissive.setRGB(0.10 + Math.max(0, (16 - a.dist) / 16) * 0.35, 0.04, 0.02);
      // dwell: faint full ring + bright arc that closes over 1.5 s
      const frac = a.dwell / DWELL_SECONDS;
      const targeted = game.gazeTargetId === a.id;
      m.ring.visible = targeted || a.dwell > 0.01;
      m.arc.line.visible = a.dwell > 0.01;
      if (m.arc.line.visible) setArc(m.arc, frac);
      m.ring.material.color.setHSL(0.52 - frac * 0.38, 1, 0.55); // cyan -> magenta when charged
      m.arc.line.material.color.copy(m.ring.material.color);
      m.group.lookAt(camPos);
      const pulse = targeted ? 1 + Math.sin(nowSec * 10) * 0.03 : 1;
      m.rock.scale.setScalar(pulse);
    }
    document.getElementById('hud-score').textContent = `Счёт: ${game.score}${game.streak >= 2 ? ` · серия ×${game.streak}` : ''}`;
    document.getElementById('hud-hull').textContent = `Корпус: ${game.hull}`;
    const hullBar = document.getElementById('hull-fill');
    if (hullBar) { hullBar.style.width = game.hull + '%'; hullBar.style.background = game.hull > 50 ? '#38f5ff' : (game.hull > 25 ? '#ffb02e' : '#ff4444'); }
    if (game.status === 'lost') endRun('lost');
  }
  updateFx(dt);
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
  info: () => ({ mode, quality, vrActive, running, audio: audioInfo(), cam: camInfo(), fx: { ...fxStats, activeParticles: particles.length, activeBeams: beams.length }, inVrDomOverlay: vrActive ? document.querySelectorAll('#hud:not(.hidden),#cross:not(.hidden),#prep:not(.hidden)').length : 0 }),
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
