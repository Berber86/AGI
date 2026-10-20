// Эрмитаж · Парадный зал — точка сборки: рендер, взгляд, перенос, режимы экрана и очков.

import * as THREE from 'three';
import {
  HALL, POINTS, ARTWORKS, SCULPTURES, START_POINT, DWELL_SECONDS, DWELL_ANGLE_DEG, DWELL_GRACE,
  pointById, pointPose, EXHIBITS, lookAngles,
} from './config.js';
import { createMaterials, buildWorld, createLights } from './world.js';
import { loadPaintings, loadSculptures } from './artworks.js';
import { createMarkers } from './markers.js';
import { createGaze, forwardFromAngles, ringFraction, markerDirection, MARKER_EYE_HEIGHT } from './gaze.js';
import { createTravel } from './travel.js';
import {
  createLookController, createStereoRig, applyRigPose, renderStereo, renderMono, clampPitch,
} from './vr.js';
import { createUI } from './ui.js';

const canvas = document.getElementById('hall');

const state = {
  mode: 'loading', // loading | start | explore | vr
  quality: 'high',
  currentPointId: START_POINT,
  travel: null,
  hover: null,
  paused: false,
  lastFrame: 0,
  frames: 0,
  fps: 0,
  fpsWindow: 0,
};

let renderer = null;
let scene = null;
let rig = null;
let look = null;
let gaze = null;
let markers = null;
let showMarkers = true;
let ui = null;
let hoverMeshes = [];
let exhibitIndex = new Map();
let dust = null;
let travelClock = 0;
let hoverClock = 0;
let stereoReady = false;
let lastGaze = null;
let lastArrival = null;
let lastTargetId = null;
const DEBUG = new URLSearchParams(location.search).has('debug');

const player = {
  position: [0, HALL.eye, 4.9],
  yaw: 0,
  pitch: 0,
};

function supportsWebGL2() {
  try {
    const test = document.createElement('canvas');
    return Boolean(window.WebGL2RenderingContext && test.getContext('webgl2'));
  } catch {
    return false;
  }
}

function makeEnvironment(rendererInstance) {
  // Маленькая процедурная сцена для отражений: зал в золоте и зелени.
  const envScene = new THREE.Scene();
  const geometry = new THREE.SphereGeometry(12, 24, 16);
  const colors = [];
  const position = geometry.getAttribute('position');
  const top = new THREE.Color(0x2c4a3a);
  const mid = new THREE.Color(0x5c5340);
  const bottom = new THREE.Color(0x191410);
  for (let i = 0; i < position.count; i += 1) {
    const y = position.getY(i) / 12;
    const c = y > 0 ? top.clone().lerp(mid, 1 - y) : mid.clone().lerp(bottom, Math.min(1, -y * 1.6));
    colors.push(c.r, c.g, c.b);
  }
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  const material = new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide });
  envScene.add(new THREE.Mesh(geometry, material));

  const glowMat = new THREE.MeshBasicMaterial({ color: 0xffe6bd, side: THREE.DoubleSide });
  for (const [x, y, z] of [[6, 2.4, 3], [6, 2.4, -3], [-4, 3.6, 5], [0, 4.2, -6]]) {
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 2.8), glowMat);
    plane.position.set(x, y, z);
    plane.lookAt(0, 1.6, 0);
    envScene.add(plane);
  }
  const pmrem = new THREE.PMREMGenerator(rendererInstance);
  const target = pmrem.fromScene(envScene, 0.04);
  pmrem.dispose();
  geometry.dispose();
  material.dispose();
  glowMat.dispose();
  return target.texture;
}

function buildDust(sceneRef) {
  const count = 70;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    positions[i * 3] = (Math.random() - 0.5) * 16;
    positions[i * 3 + 1] = 0.6 + Math.random() * 5.6;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 11;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const sprite = (() => {
    const c = document.createElement('canvas');
    c.width = 32;
    c.height = 32;
    const ctx = c.getContext('2d');
    const g = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    g.addColorStop(0, 'rgba(255,244,214,0.9)');
    g.addColorStop(1, 'rgba(255,244,214,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 32, 32);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  })();
  const mat = new THREE.PointsMaterial({
    size: 0.026,
    map: sprite,
    transparent: true,
    depthWrite: false,
    opacity: 0.11,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  });
  dust = new THREE.Points(geo, mat);
  dust.name = 'dust';
  dust.frustumCulled = false;
  sceneRef.add(dust);
}

async function boot() {
  if (!supportsWebGL2()) {
    ui = createUI({});
    ui.showWebGLError();
    return;
  }

  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: window.devicePixelRatio < 2,
    powerPreference: 'high-performance',
    alpha: false,
    stencil: false,
  });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.16;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setClearColor(0x0a1511, 1);
  resize();

  scene = new THREE.Scene();
  scene.environment = makeEnvironment(renderer);
  scene.environmentIntensity = 0.5;

  rig = createStereoRig(scene, { ipd: HALL.ipd, fov: 66 });
  look = createLookController({
    onSourceChange: (source) => {
      if (source === 'touch') ui.setGyroStatus('ведёт свайп');
      if (source === 'gyro') ui.setGyroStatus('работает');
    },
  });
  look.attach(canvas);

  ui = createUI({
    onEnter: () => enterExplore(),
    onOpenVR: () => {
      ui.openPanel('vr');
      ui.setGyroStatus(look.state.gyro === 'denied' ? 'запрещён' : 'не запрошен');
    },
    onEnterVR: () => enterVR(),
    onRecenter: () => recenter(),
    onQuality: (quality) => applyQuality(quality),
  });
  ui.setQualityLabel(state.quality);
  const saved = readQuality();
  if (saved && saved !== state.quality) applyQuality(saved);

  ui.setLoading(0.04, 'Строим стены, паркет и лепнину…');
  await nextFrame();

  const materials = createMaterials(state.quality);
  const { meshes } = buildWorld(scene, materials, { quality: state.quality });
  createLights(scene);
  buildDust(scene);
  markers = createMarkers(scene);

  ui.setLoading(0.28, 'Развешиваем полотна в высоком разрешении…');
  const paintings = await loadPaintings(scene, materials, state.quality, (p) => {
    ui.setLoading(0.28 + p * 0.5, p < 1 ? `Загружаем полотна: ${Math.round(p * 100)} %` : 'Последние штрихи…');
  });
  for (const painting of paintings) {
    painting.canvas.userData.exhibitId = painting.art.id;
    painting.anchor.userData.exhibitId = painting.art.id;
    hoverMeshes.push(painting.canvas, painting.anchor);
  }

  ui.setLoading(0.82, 'Ставим скульптуры на плинты…');
  const sculptures = await loadSculptures(scene, materials);
  for (const s of sculptures) {
    if (s.mesh) {
      s.mesh.userData.exhibitId = s.spec.id;
      hoverMeshes.push(s.mesh);
    }
    s.group.userData.exhibitId = s.spec.id;
  }

  for (const exhibit of EXHIBITS) exhibitIndex.set(exhibit.id, exhibit);

  gaze = createGaze({
    points: POINTS,
    dwellSeconds: DWELL_SECONDS,
    angleDeg: DWELL_ANGLE_DEG,
    grace: DWELL_GRACE,
  });

  ui.setLoading(0.92, 'Прогреваем шейдеры, чтобы первый кадр не замер…');
  await nextFrame();
  await warmUp();

  const startPoint = pointById(START_POINT);
  const pose = pointPose(startPoint);
  placeAtPoint(startPoint, pose);
  gaze.reset(null);

  resize();
  ui.setLoading(1, 'Готово');
  state.mode = 'start';
  ui.hideLoading();
  ui.showStart(true);
  ui.showHUD(false);
  renderFrame();

  window.__READY__ = true;
  window.__HERMITAGE__ = exposeAPI({ materials, paintings, sculptures, meshes });
  state.lastFrame = performance.now();
  requestAnimationFrame(frame);
}

function readQuality() {
  try {
    return window.localStorage.getItem('hermitage-quality');
  } catch {
    return null;
  }
}

function nextFrame() {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}

async function warmUp() {
  // По правилам skill: мало слинковать программы — их нужно прожить первой отрисовкой.
  const size = renderer.getSize(new THREE.Vector2());
  const dpr = renderer.getPixelRatio();
  try {
    await renderer.compileAsync(scene, rig.mono);
  } catch {
    renderer.compile(scene, rig.mono);
  }
  renderer.setPixelRatio(1);
  renderer.setSize(320, 180, false);
  renderMono(renderer, scene, rig.mono);
  renderStereo(renderer, scene, rig, { quality: state.quality });
  renderer.setPixelRatio(dpr);
  renderer.setSize(size.x, size.y, false);
  renderer.shadowMap.needsUpdate = true;
  renderMono(renderer, scene, rig.mono);
  renderer.shadowMap.autoUpdate = false;
  stereoReady = true;
}

function applyQuality(quality) {
  state.quality = quality;
  ui.setQualityLabel(quality);
  try {
    window.localStorage.setItem('hermitage-quality', quality);
  } catch { /* приватный режим */ }
  if (!renderer) return;
  const dpr = quality === 'high' ? Math.min(window.devicePixelRatio || 1, 2) : Math.min(window.devicePixelRatio || 1, 1.25);
  renderer.setPixelRatio(dpr);
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  renderer.shadowMap.enabled = quality === 'high';
  renderer.toneMappingExposure = quality === 'high' ? 1.16 : 1.22;
  scene.traverse((obj) => {
    if (obj.isMesh) {
      if (obj.material) obj.material.needsUpdate = true;
    }
  });
  if (quality === 'high') renderer.shadowMap.needsUpdate = true;
}

function resize() {
  if (!renderer) return;
  const dpr = state.quality === 'high'
    ? Math.min(window.devicePixelRatio || 1, 2)
    : Math.min(window.devicePixelRatio || 1, 1.25);
  renderer.setPixelRatio(dpr);
  renderer.setSize(window.innerWidth, window.innerHeight, false);
}

function placeAtPoint(point, pose) {
  player.position = [point.position[0], HALL.eye, point.position[1]];
  player.yaw = pose.yaw;
  player.pitch = pose.pitch;
  state.currentPointId = point.id;
  look.recenter(pose.yaw, pose.pitch);
  ui.setPointName(point);
}

function enterExplore() {
  state.mode = 'explore';
  ui.showStart(false);
  ui.showHUD(true);
  const point = pointById(state.currentPointId) || pointById(START_POINT);
  placeAtPoint(point, pointPose(point));
  gaze.reset(null);
  ui.toast('Смотрите на медальон · 10 секунд', 3200);
}

function isLandscape() {
  return window.innerWidth >= window.innerHeight;
}

async function enterVR() {
  if (!isLandscape()) {
    ui.openPanel('vr');
    ui.toast('Поверните телефон горизонтально и нажмите «Войти»', 3800);
    return;
  }
  ui.closePanels();
  ui.showStart(false);
  ui.showHUD(false);
  document.body.classList.add('vr');
  state.mode = 'vr';

  try {
    if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
      await document.documentElement.requestFullscreen({ navigationUI: 'hide' });
    }
  } catch { /* браузер может отказать */ }
  try {
    if (screen.orientation && screen.orientation.lock) await screen.orientation.lock('landscape');
  } catch { /* iOS не поддерживает */ }

  const point = pointById(state.currentPointId) || pointById(START_POINT);
  placeAtPoint(point, pointPose(point));

  const gyro = await look.requestGyro();
  if (gyro === 'denied' || gyro === 'unsupported') {
    // Единственное исключение из «ноль HUD в очках»: честно сказать, что гироскопа нет.
    ui.showVRHint('Гироскоп недоступен', 'Осматривайтесь свайпом по экрану. Нажмите и удерживайте 1,2 с, чтобы выйти.');
    ui.hideVRHint(5200);
    ui.setGyroStatus(gyro === 'denied' ? 'запрещён' : 'нет в устройстве');
  } else {
    ui.setGyroStatus('запрошен');
  }
  recenter();
  gaze.reset(null);
}

function exitVR() {
  if (state.mode !== 'vr') return;
  document.body.classList.remove('vr');
  state.mode = 'explore';
  ui.showHUD(true);
  ui.showVRHint('');
  if (ui.el && ui.el.vrSetup) ui.el.vrSetup.hidden = true;
  if (document.fullscreenElement && document.exitFullscreen) {
    document.exitFullscreen().catch(() => {});
  }
  ui.toast('Обычный экран · продолжите осмотр', 2400);
  resize();
}

function recenter() {
  // Короткое касание в очках возвращает взгляд к кадру прибытия (на экспонат).
  const point = pointById(state.currentPointId) || pointById(START_POINT);
  const pose = pointPose(point);
  look.recenter(pose.yaw, pose.pitch);
  player.yaw = pose.yaw;
  player.pitch = pose.pitch;
  gaze.reset(null);
}

function startTravel(pointId) {
  const target = pointById(pointId);
  if (!target) return;
  const targetPose = pointPose(target);
  const mode = state.mode === 'vr' ? 'fade' : 'glide';
  state.travel = {
    id: target.id,
    target,
    travel: createTravel({
      mode,
      from: [player.position[0], player.position[2]],
      to: [target.position[0], target.position[1]],
      fromYaw: player.yaw,
      fromPitch: player.pitch,
      toYaw: targetPose.yaw,
      toPitch: targetPose.pitch,
      eye: HALL.eye,
    }),
  };
  travelClock = 0;
  gaze.reset(null);
  if (state.mode !== 'vr') ui.toast(`Переходим: ${target.name}`, 1600);
}

function advanceTravel(dt) {
  if (!state.travel) return false;
  travelClock += dt;
  const t = Math.min(1, travelClock / state.travel.travel.duration);
  const sample = state.travel.travel.sample(t);
  if (state.travel.travel.kind === 'fade') {
    ui.fadeTo(sample.alpha);
  }
  applyRigPose(rig, { position: sample.position, yaw: sample.yaw, pitch: sample.pitch });
  if (t >= 1) {
    const target = state.travel.target;
    state.travel = null;
    ui.fadeTo(0);
    if (DEBUG) ui.debugTravel('');
    ui.toast(`Вы у точки: ${target.name}`, 1900);
    placeAtPoint(target, pointPose(target));
    gaze.reset(null);
  }
  return true;
}

function updateHover(dt) {
  hoverClock += dt;
  if (hoverClock < 0.1) return;
  hoverClock = 0;
  if (state.mode !== 'explore') {
    if (state.hover) {
      state.hover = null;
      ui.setInfo(null);
    }
    return;
  }
  rig.mono.updateMatrixWorld(true);
  raycaster.setFromCamera(CENTER, rig.mono);
  const hits = raycaster.intersectObjects(hoverMeshes, false);
  const hit = hits.find((h) => h.distance < 17);
  if (hit) {
    const id = hit.object.userData.exhibitId;
    const exhibit = exhibitIndex.get(id);
    if (exhibit && (!state.hover || state.hover.id !== id)) {
      state.hover = exhibit;
      ui.setInfo(exhibit, true);
    }
  } else if (state.hover) {
    state.hover = null;
    ui.setInfo(null);
  }
}

const raycaster = new THREE.Raycaster();
const CENTER = new THREE.Vector2(0, 0);

function advance(dt) {
  if (state.mode === 'loading' || state.mode === 'start') {
    // На стартовом экране зал медленно живёт: лёгкий параллакс от указателя не нужен.
    markers.update(dt, { currentPointId: state.currentPointId, targetId: null, progress: 0, visible: false });
    if (dust) dust.rotation.y += dt * 0.006;
    return;
  }

  look.update(dt);

  const traveling = Boolean(state.travel);
  if (traveling) {
    advanceTravel(dt);
  } else {
    player.yaw = look.state.yaw;
    player.pitch = clampPitch(look.state.pitch);
    applyRigPose(rig, { position: player.position, yaw: player.yaw, pitch: player.pitch });
  }

  if (!traveling) {
    const forward = forwardFromAngles(player.yaw, player.pitch);
    const snapshot = gaze.update(dt, {
      position: [player.position[0], player.position[1], player.position[2]],
      forward,
      currentPointId: state.currentPointId,
      enabled: true,
    });
    lastGaze = snapshot;
    if (snapshot.arrival) {
      lastArrival = snapshot.arrival;
      startTravel(snapshot.arrival);
    }
    const targetPoint = snapshot.targetId ? pointById(snapshot.targetId) : null;
    markers.update(dt, {
      currentPointId: state.currentPointId,
      targetId: snapshot.targetId,
      progress: snapshot.progress,
      visible: showMarkers,
    });
    if (state.mode === 'explore') {
      ui.setDwell({
        active: Boolean(snapshot.targetId),
        progress: snapshot.progress,
        point: targetPoint,
      });
      if (snapshot.targetId && snapshot.targetId !== lastTargetId) {
        ui.toast(`Держите взгляд: ${targetPoint ? targetPoint.name : 'точка'} · 10 секунд`, 2400);
      }
    } else {
      ui.setDwell({ active: false, progress: 0 });
    }
    if (snapshot.targetId !== lastTargetId) lastTargetId = snapshot.targetId;
    if (dust) dust.rotation.y += dt * 0.01;
  } else {
    markers.update(dt, { currentPointId: state.currentPointId, targetId: null, progress: 0, visible: false });
    ui.setDwell({ active: false, progress: 0 });
  }

  updateHover(dt);
}

function renderFrame() {
  if (!renderer || !scene) return;
  if (state.mode === 'vr') {
    renderStereo(renderer, scene, rig, { quality: state.quality });
  } else {
    renderMono(renderer, scene, rig.mono);
  }
  state.frames += 1;
}

function frame(now) {
  if (state.paused) {
    state.lastFrame = now;
    requestAnimationFrame(frame);
    return;
  }
  const dt = Math.min(0.05, (now - state.lastFrame) / 1000 || 0.016);
  state.lastFrame = now;
  state.fpsWindow += dt;
  if (state.fpsWindow > 1.5) {
    state.fps = Math.round(state.frames / state.fpsWindow);
    state.frames = 0;
    state.fpsWindow = 0;
  }
  advance(dt);
  renderFrame();
  requestAnimationFrame(frame);
}

function onVisibility() {
  if (document.hidden) {
    state.paused = true;
    look.state.yaw = player.yaw;
    look.state.pitch = player.pitch;
  } else {
    state.paused = false;
    state.lastFrame = performance.now();
    resize();
  }
}

function bindVRTouch() {
  let pressTimer = 0;
  let longPress = false;
  let startAt = 0;
  canvas.addEventListener('pointerdown', () => {
    if (state.mode !== 'vr') return;
    longPress = false;
    startAt = performance.now();
    pressTimer = window.setTimeout(() => {
      longPress = true;
      exitVR();
    }, 1200);
  });
  const release = () => {
    window.clearTimeout(pressTimer);
    if (state.mode === 'vr' && !longPress && performance.now() - startAt < 350) {
      recenter();
    }
  };
  canvas.addEventListener('pointerup', release);
  canvas.addEventListener('pointercancel', () => window.clearTimeout(pressTimer));
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && state.mode === 'vr') exitVR();
    if (event.key.toLowerCase() === 'r' && state.mode !== 'vr') recenter();
  });
  window.addEventListener('resize', () => {
    resize();
    if (state.mode === 'vr' && !isLandscape()) {
      ui.showVRHint('Поверните телефон', 'Для очков нужна горизонтальная ориентация.');
    }
  });
  document.addEventListener('visibilitychange', onVisibility);
}

function instantGoto(id) {
  const target = pointById(id);
  if (!target) return false;
  state.travel = null;
  ui.fadeTo(0);
  placeAtPoint(target, pointPose(target));
  applyRigPose(rig, { position: player.position, yaw: player.yaw, pitch: player.pitch });
  gaze.reset(null);
  markers.update(0.016, { currentPointId: state.currentPointId, targetId: null, progress: 0, visible: showMarkers });
  return true;
}

function markerPose(id, from = player.position) {
  const target = pointById(id);
  if (!target) return null;
  const dir = markerDirection([from[0], from[1], from[2]], target.position);
  const horizontal = Math.hypot(dir[0], dir[2]) || 1e-6;
  return { yaw: Math.atan2(dir[0], -dir[2]), pitch: Math.atan2(dir[1], horizontal) };
}

function lookAtPoint(id) {
  const pose = markerPose(id);
  if (!pose) return false;
  look.recenter(pose.yaw, pose.pitch);
  player.yaw = pose.yaw;
  player.pitch = pose.pitch;
  applyRigPose(rig, { position: player.position, yaw: player.yaw, pitch: player.pitch });
  return { yaw: pose.yaw, pitch: pose.pitch };
}

function lookAtExhibit(id) {
  const item = EXHIBITS.find((e) => e.id === id);
  if (!item) return false;
  const pose = lookAngles([player.position[0], player.position[1], player.position[2]], item.position);
  look.recenter(pose.yaw, pose.pitch);
  player.yaw = pose.yaw;
  player.pitch = pose.pitch;
  applyRigPose(rig, { position: player.position, yaw: player.yaw, pitch: player.pitch });
  updateHoverForce();
  return { yaw: pose.yaw, pitch: pose.pitch };
}

function updateHoverForce() {
  hoverClock = 1;
  updateHover(0.11);
}

function stepSim(dt, count = 1) {
  for (let i = 0; i < count; i += 1) advance(dt);
}

function exposeAPI(extra) {
  return {
    version: '1.0.0',
    ready: true,
    points: () => POINTS.map((p, i) => ({ ...p, index: i + 1 })),
    exhibits: () => EXHIBITS.map((e) => ({ ...e })),
    artworks: () => ARTWORKS.map((a) => ({ id: a.id, title: a.title, author: a.author, file: a.file })),
    sculptures: () => SCULPTURES.map((s) => ({ id: s.id, title: s.title, file: s.file })),
    info: () => ({
      mode: state.mode,
      quality: state.quality,
      pointId: state.currentPointId,
      position: [...player.position],
      yaw: player.yaw,
      pitch: player.pitch,
      source: look.state.source,
      gyro: look.state.gyro,
      fps: state.fps,
      frames: state.frames,
      stereoReady,
      drawCalls: renderer.info.render.calls,
      triangles: renderer.info.render.triangles,
      meshes: extra.meshes,
      travel: state.travel ? state.travel.id : null,
    }),
    dwell: () => {
      const snap = lastGaze || gaze.snapshot();
      return { ...snap, ring: ringFraction(snap.progress), secondsLeft: Math.max(0, DWELL_SECONDS * (1 - snap.progress)), lastArrival };
    },
    pose: () => ({ position: [...player.position], yaw: player.yaw, pitch: player.pitch, pointId: state.currentPointId }),
    enter: () => enterExplore(),
    enterVR: async () => { await enterVR(); return state.mode; },
    exitVR: () => { exitVR(); return state.mode; },
    goto: (id) => instantGoto(id),
    lookAtPoint: (id) => lookAtPoint(id),
    markerPose: (id) => markerPose(id),
    markerHeight: MARKER_EYE_HEIGHT,
    lookAtExhibit: (id) => lookAtExhibit(id),
    setLook: (yaw, pitch) => {
      look.recenter(yaw, pitch);
      player.yaw = yaw;
      player.pitch = clampPitch(pitch);
      applyRigPose(rig, { position: player.position, yaw: player.yaw, pitch: player.pitch });
      return { yaw: player.yaw, pitch: player.pitch };
    },
    setPoint: (id) => instantGoto(id),
    step: (dt = 1 / 60, count = 1) => { lastArrival = null; stepSim(dt, count); return lastGaze || gaze.snapshot(); },
    render: () => renderFrame(),
    quality: (q) => { applyQuality(q); return state.quality; },
    hover: () => (state.hover ? { id: state.hover.id, title: state.hover.title } : null),
    setMarkers: (on) => {
      showMarkers = on !== false;
      if (!showMarkers) markers.markers.forEach((m) => { m.holder.visible = false; });
      else markers.markers.forEach((m) => { m.holder.visible = m.point.id !== state.currentPointId; });
      return showMarkers;
    },
    markers: () => markers.markers.map((m) => ({
      id: m.point.id,
      visible: m.holder.visible,
      progress: m.ringMat.uniforms.uProgress.value,
      active: m.ringMat.uniforms.uActive.value,
    })),
    travelInfo: () => (state.travel ? { id: state.travel.id, kind: state.travel.travel.kind, duration: state.travel.travel.duration } : null),
    forceDwellComplete: () => {
      const targetId = gaze.targetId;
      if (!targetId) return null;
      startTravel(targetId);
      return targetId;
    },
    setPaused: (v) => { state.paused = Boolean(v); state.lastFrame = performance.now(); },
    clearTravel: () => { state.travel = null; ui.fadeTo(0); },
    setQuality: (q) => { applyQuality(q); return state.quality; },
    sceneInfo: () => ({ children: scene.children.length, hall: extra.meshes }),
    debugCanvas: (id) => {
      const painting = extra.paintings.find((p) => p.art.id === id);
      if (!painting) return null;
      const mat = painting.canvasMat;
      return {
        hasMap: Boolean(mat.map),
        mapColor: mat.map && mat.map.colorSpace,
        imageSize: mat.map && mat.map.image ? [mat.map.image.width, mat.map.image.height] : null,
        visible: painting.canvas.visible,
        worldPos: painting.canvas.getWorldPosition(new THREE.Vector3()).toArray(),
        scale: painting.canvas.getWorldScale(new THREE.Vector3()).toArray(),
        parentRot: painting.group.rotation.y,
        frustumCulled: painting.canvas.frustumCulled,
      };
    },
  };
}

window.addEventListener('resize', () => resize());
bindVRTouch();

// PWA: офлайн-кэш после первой успешной загрузки (в dev-режиме sw.js нет — молча пропускаем).
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(new URL('sw.js', document.baseURI)).catch(() => {});
  });
}
boot().catch((err) => {
  console.error(err);
  if (ui) ui.showWebGLError();
});
