// Эрмитаж · Парадный зал — точка сборки: рендер, взгляд, перенос, режимы экрана и очков.

import * as THREE from 'three';
import {
  HALL, POINTS, ARTWORKS, SCULPTURES, START_POINT, DWELL_SECONDS, DWELL_ANGLE_DEG, DWELL_GRACE,
  STUDY_SECONDS, STUDY_LEAVE_ANGLE_DEG, STUDY_LEAVE_SECONDS,
  pointById, pointPose, artworkById, EXHIBITS, lookAngles,
} from './config.js';
import { createMaterials, buildWorld, createLights } from './world.js';
import {
  loadPaintings, loadSculptures, createArtworkDetails, featuredArtwork, mergePaintingStatics,
  setPaintingEffects,
} from './artworks.js';
import { createMarkers } from './markers.js';
import { createGaze, forwardFromAngles, ringFraction, markerDirection, MARKER_EYE_HEIGHT } from './gaze.js';
import { createTravel } from './travel.js';
import {
  closeUpPose, paintingCoverage, createStudyDwell, CLOSE_FOV, NORMAL_FOV,
} from './study.js';
import {
  createLookController, createStereoRig, applyRigPose, renderStereo, renderMono, clampPitch, setRigFov,
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
  closeUp: null, // { id, pose, entryPoint, zoom } — близкий осмотр полотна
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
let study = null;
let studyLookAway = 0;
let lastStudyId = null;
let markers = null;
let details = null;
let showMarkers = true;
let ui = null;
let hoverMeshes = [];
let exhibitIndex = new Map();
let paintingIndex = new Map();
let dust = null;
let travelClock = 0;
let hoverClock = 0;
let stereoReady = false;
let renderScale = 1;
let lastTune = 0;
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
    // MSAA дорог на мобильном GPU и при адаптивном разрешении почти не виден.
    antialias: !isHandheld() && window.devicePixelRatio < 2,
    powerPreference: 'high-performance',
    alpha: false,
    stencil: false,
  });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.16;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
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
    onBack: () => leaveCloseUp(),
    onQuality: (quality) => applyQuality(quality),
  });
  // На телефоне по умолчанию лёгкая графика: тени выключены, DPR ограничен.
  // Пользователь может вернуть высокую в настройках — выбор запоминается.
  state.quality = isHandheld() ? 'low' : 'high';
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
  markers.setSimple(state.quality !== 'high');

  ui.setLoading(0.28, 'Развешиваем полотна…');
  const paintings = await loadPaintings(scene, materials, state.quality, (p) => {
    ui.setLoading(0.28 + p * 0.5, p < 1 ? `Вешаем полотна: ${Math.round(p * 100)} %` : 'Последние штрихи…');
  });
  for (const painting of paintings) {
    painting.canvas.userData.exhibitId = painting.art.id;
    painting.anchor.userData.exhibitId = painting.art.id;
    hoverMeshes.push(painting.canvas, painting.anchor);
  }

  // Сливаем рамы, подсветку и пятна света шести полотен в общие сетки.
  mergePaintingStatics(scene, paintings);

  // Постоянно в зале живут только миниатюры; крупные текстуры подгружаются к точке.
  details = createArtworkDetails(paintings, { maxWidth: detailMaxWidth(), maxResident: 2 });

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
  for (const painting of paintings) paintingIndex.set(painting.art.id, painting);

  gaze = createGaze({
    points: POINTS,
    dwellSeconds: DWELL_SECONDS,
    angleDeg: DWELL_ANGLE_DEG,
    grace: DWELL_GRACE,
  });
  study = createStudyDwell({ seconds: STUDY_SECONDS, grace: 0.35 });

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

function isHandheld() {
  const ua = navigator.userAgent || '';
  if (/Android|iPhone|iPad|iPod|Mobile/i.test(ua)) return true;
  const touch = (navigator.maxTouchPoints || 0) > 0 || 'ontouchstart' in window;
  return touch && Math.min(window.innerWidth, window.innerHeight) < 820;
}

function detailMaxWidth() {
  if (state.quality === 'low') return 1024;
  return isHandheld() ? 1280 : 2048;
}

function dprCap() {
  const dpr = window.devicePixelRatio || 1;
  return state.quality === 'low' ? Math.min(dpr, 1) : Math.min(dpr, 1.5);
}

function targetDpr() {
  const cap = dprCap();
  // В стереопаре два глаза делят один экран: пикселей вдвое больше, поэтому
  // потолок ниже, а запас адаптивного разрешения — глубже.
  const limit = state.mode === 'vr' ? Math.min(cap, 0.95) : cap;
  const floor = state.mode === 'vr' ? 0.5 : 0.62;
  return Math.max(floor, Math.min(limit, cap * renderScale));
}

function applyRenderScale() {
  if (!renderer) return;
  const dpr = targetDpr();
  const size = renderer.getSize(new THREE.Vector2());
  const width = window.innerWidth;
  const height = window.innerHeight;
  if (Math.abs(renderer.getPixelRatio() - dpr) < 0.01 && size.x === width && size.y === height) return;
  renderer.setPixelRatio(dpr);
  renderer.setSize(width, height, false);
}

let slowWindows = 0;

function tuneResolution(fps, now) {
  // В headless-браузере FPS ничего не значит: не портим кадры тестов адаптивом.
  if (navigator.webdriver) return;
  if (state.mode !== 'explore' && state.mode !== 'vr') return;
  if (now - lastTune < 2000) return;
  lastTune = now;

  const floor = state.mode === 'vr' ? 0.5 : 0.62;
  if (fps < 45 && renderScale > floor) {
    renderScale = Math.max(floor, renderScale - 0.15);
    applyRenderScale();
    slowWindows += 1;
  } else if (fps > 58 && renderScale < 1) {
    renderScale = Math.min(1, renderScale + 0.06);
    applyRenderScale();
    slowWindows = 0;
  } else if (fps >= 45) {
    slowWindows = 0;
  }

  // Совсем тяжёлый случай: даже минимальное разрешение не даёт 26 кадров —
  // убираем тени и лишние эффекты совсем (один раз, без «мигания»).
  if (state.quality === 'high' && slowWindows >= 3 && fps < 26) {
    slowWindows = 0;
    applyQuality('low');
    ui.toast('Графика переключена на лёгкую: так плавнее', 3200);
  }
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
  const previous = state.quality;
  state.quality = quality;
  ui.setQualityLabel(quality);
  try {
    window.localStorage.setItem('hermitage-quality', quality);
  } catch { /* приватный режим */ }
  if (!renderer) return;

  renderScale = 1;
  applyRenderScale();

  const shadowsChanged = (quality === 'high') !== (previous === 'high');
  renderer.shadowMap.enabled = quality === 'high';
  setPaintingEffects(quality === 'high');
  if (markers) markers.setSimple(quality !== 'high');
  renderer.toneMappingExposure = quality === 'high' ? 1.16 : 1.22;
  if (!scene) return;

  if (shadowsChanged) {
    // Тени — отдельная пермутация шейдера: пересобираем программы один раз и
    // прогреваем их, чтобы переключение не превратилось в фриз посреди зала.
    scene.traverse((obj) => {
      if (obj.isMesh && obj.material) obj.material.needsUpdate = true;
    });
    if (quality === 'high') renderer.shadowMap.needsUpdate = true;
    warmPrograms();
  }
  if (details) details.setMaxWidth(detailMaxWidth());
}

function warmPrograms() {
  const size = renderer.getSize(new THREE.Vector2());
  const dpr = renderer.getPixelRatio();
  renderer.setPixelRatio(1);
  renderer.setSize(160, 90, false);
  renderMono(renderer, scene, rig.mono);
  renderStereo(renderer, scene, rig, { quality: state.quality });
  renderer.setPixelRatio(dpr);
  renderer.setSize(size.x, size.y, false);
  renderer.shadowMap.needsUpdate = true;
}

function resize() {
  if (!renderer) return;
  applyRenderScale();
}

function placeAtPoint(point, pose) {
  player.position = [point.position[0], HALL.eye, point.position[1]];
  player.yaw = pose.yaw;
  player.pitch = pose.pitch;
  state.currentPointId = point.id;
  look.recenter(pose.yaw, pose.pitch);
  ui.setPointName(point);
  if (details) {
    const art = featuredArtwork(point);
    details.show(art ? art.id : null);
  }
}

function enterExplore() {
  state.mode = 'explore';
  state.closeUp = null;
  if (study) study.reset();
  lastStudyId = null;
  setRigFov(rig, NORMAL_FOV);
  ui.setCloseUp(false);
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
  renderScale = 1;
  applyRenderScale();

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
  renderScale = 1;
  applyRenderScale();
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
  state.closeUp = null;
  ui.setCloseUp(false);
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
    const entry = state.travel;
    state.travel = null;
    ui.fadeTo(0);
    if (DEBUG) ui.debugTravel('');

    if (entry.kind === 'study' && state.closeUp) {
      const { pose } = state.closeUp;
      player.position = [pose.position[0], HALL.eye, pose.position[2]];
      player.yaw = pose.yaw;
      player.pitch = pose.pitch;
      look.recenter(pose.yaw, pose.pitch);
      gaze.reset(null);
      study.reset();
      studyLookAway = 0;
      if (details) details.show(entry.art.id);
      const exhibit = exhibitIndex.get(entry.art.id);
      if (exhibit) ui.setInfo(exhibit, true);
      setRigFov(rig, CLOSE_FOV);
      ui.setCloseUp(true, `«${entry.art.title}»`);
      if (state.mode !== 'vr') ui.toast('Отведите взгляд в сторону, чтобы вернуться к точке', 3000);
      return true;
    }

    if (entry.kind === 'study-back') {
      state.closeUp = null;
      setRigFov(rig, NORMAL_FOV);
      placeAtPoint(entry.target, pointPose(entry.target));
      ui.setCloseUp(false);
      gaze.reset(null);
      study.reset();
      studyLookAway = 0;
      return true;
    }

    state.closeUp = null;
    ui.setCloseUp(false);
    ui.toast(`Вы у точки: ${entry.target.name}`, 1900);
    placeAtPoint(entry.target, pointPose(entry.target));
    gaze.reset(null);
  }
  return true;
}

function setStudyGlow(id, progress) {
  for (const painting of paintingIndex.values()) {
    const glow = painting.glow;
    if (!glow) continue;
    const value = painting.art.id === id && state.mode === 'vr' ? Math.min(0.42, progress * 0.42) : 0;
    glow.visible = value > 0.01;
    glow.material.opacity = value;
  }
}

function advanceStudy(dt) {
  const hoverArt = state.hover && state.hover.kind === 'painting' ? state.hover : null;
  const snapshot = study.update(dt, hoverArt ? hoverArt.id : null);
  const medallionBusy = Boolean(lastGaze && lastGaze.targetId);

  if (snapshot.artId && snapshot.artId !== lastStudyId) {
    lastStudyId = snapshot.artId;
    if (!medallionBusy) ui.toast('Держите взгляд на полотне · 10 секунд — подойдёте ближе', 2800);
    if (details) details.preload(snapshot.artId);
  }
  if (!snapshot.artId) {
    lastStudyId = null;
    setStudyGlow(null, 0);
    return;
  }
  setStudyGlow(snapshot.artId, snapshot.progress);
  if (!medallionBusy) {
    ui.setDwell({
      active: true,
      progress: snapshot.progress,
      point: { name: `«${hoverArt.title}»` },
    });
  }
  if (snapshot.ready) {
    const art = artworkById(snapshot.artId);
    if (art) startCloseUp(art);
  }
}

function startCloseUp(art) {
  if (!art || state.travel || state.closeUp) return false;
  // В стереопаре у каждого глаза своя, более узкая горизонталь — считаем по ней.
  const aspect = state.mode === 'vr'
    ? (window.innerWidth / 2) / window.innerHeight
    : window.innerWidth / window.innerHeight;
  const pose = closeUpPose(art, { fov: CLOSE_FOV, aspect, eye: HALL.eye });
  const fade = state.mode === 'vr';
  state.closeUp = { id: art.id, pose, entryPoint: state.currentPointId, zoom: 0 };
  state.travel = {
    id: art.id,
    kind: 'study',
    art,
    travel: createTravel({
      mode: fade ? 'fade' : 'glide',
      from: [player.position[0], player.position[2]],
      to: [pose.position[0], pose.position[2]],
      fromYaw: player.yaw,
      fromPitch: player.pitch,
      toYaw: pose.yaw,
      toPitch: pose.pitch,
      eye: HALL.eye,
      duration: 1.9,
    }),
  };
  travelClock = 0;
  study.reset();
  studyLookAway = 0;
  lastStudyId = null;
  setStudyGlow(null, 0);
  gaze.reset(null);
  lastGaze = { targetId: null, progress: 0 };
  if (details) details.preload(art.id);
  if (state.mode === 'vr') ui.hideVRHint(0);
  else ui.toast(`Подходим ближе: «${art.title}»`, 1700);
  return true;
}

/**
 * Лупа: 0 — холст целиком, 1 — самый близкий допустимый кадр.
 * Точка обзора едет вдоль нормали к картине, поэтому камера не уходит в стену.
 */
function setCloseUpZoom(value) {
  if (!state.closeUp) return 0;
  const art = artworkById(state.closeUp.id);
  if (!art) return 0;
  const zoom = Math.max(0, Math.min(1, value));
  const aspect = state.mode === 'vr'
    ? (window.innerWidth / 2) / window.innerHeight
    : window.innerWidth / window.innerHeight;
  const base = state.closeUp.pose.baseDistance || state.closeUp.pose.distance;
  const target = base * (1 - 0.7 * zoom);
  const pose = closeUpPose(art, { fov: CLOSE_FOV, aspect, eye: HALL.eye, distance: target });
  state.closeUp.pose = pose;
  state.closeUp.zoom = zoom;
  player.position = [pose.position[0], HALL.eye, pose.position[2]];
  player.yaw = pose.yaw;
  player.pitch = pose.pitch;
  look.recenter(pose.yaw, pose.pitch);
  applyRigPose(rig, { position: player.position, yaw: pose.yaw, pitch: pose.pitch });
  return zoom;
}

function nudgeCloseUpZoom(delta) {
  if (!state.closeUp) return;
  setCloseUpZoom(state.closeUp.zoom + delta);
}

function leaveCloseUp() {
  if (!state.closeUp || state.travel) return false;
  const point = pointById(state.currentPointId) || pointById(START_POINT);
  const pose = pointPose(point);
  state.travel = {
    id: point.id,
    kind: 'study-back',
    target: point,
    travel: createTravel({
      mode: state.mode === 'vr' ? 'fade' : 'glide',
      from: [player.position[0], player.position[2]],
      to: [point.position[0], point.position[1]],
      fromYaw: player.yaw,
      fromPitch: player.pitch,
      toYaw: pose.yaw,
      toPitch: pose.pitch,
      eye: HALL.eye,
      duration: 1.7,
    }),
  };
  travelClock = 0;
  study.reset();
  studyLookAway = 0;
  setStudyGlow(null, 0);
  gaze.reset(null);
  ui.setCloseUp(false);
  ui.setInfo(null);
  if (state.mode !== 'vr') ui.toast('Возвращаемся к точке', 1500);
  return true;
}

function advanceStudyLeave(dt) {
  const art = state.closeUp ? artworkById(state.closeUp.id) : null;
  if (!art) return;
  const dx = art.position[0] - player.position[0];
  const dy = art.position[1] - player.position[1];
  const dz = art.position[2] - player.position[2];
  const len = Math.hypot(dx, dy, dz) || 1e-6;
  const forward = forwardFromAngles(player.yaw, player.pitch);
  const dot = (forward[0] * dx + forward[1] * dy + forward[2] * dz) / len;
  const angle = Math.acos(Math.max(-1, Math.min(1, dot))) * (180 / Math.PI);
  if (angle > STUDY_LEAVE_ANGLE_DEG) {
    studyLookAway += dt;
    if (studyLookAway > STUDY_LEAVE_SECONDS) leaveCloseUp();
  } else {
    studyLookAway = 0;
  }
}

function updateHover(dt) {
  hoverClock += dt;
  if (hoverClock < 0.1) return;
  hoverClock = 0;
  if (state.mode !== 'explore' && state.mode !== 'vr') {
    if (state.hover) {
      state.hover = null;
      ui.setInfo(null);
    }
    return;
  }
  // Обновляем весь риг: камера — ребёнок группы, и без этого матрица мира
  // остаётся от прошлого кадра (а в тестах без render — от прошлой точки).
  rig.updateMatrixWorld(true);
  raycaster.setFromCamera(CENTER, rig.mono);
  const hits = raycaster.intersectObjects(hoverMeshes, false);
  const hit = hits.find((h) => h.distance < 17);
  if (hit) {
    const id = hit.object.userData.exhibitId;
    const exhibit = exhibitIndex.get(id);
    if (exhibit && (!state.hover || state.hover.id !== id)) {
      state.hover = exhibit;
      if (state.mode !== 'vr') ui.setInfo(exhibit, true);
      // Смотрим на полотно вблизи — подтягиваем крупную текстуру только этой картины.
      if (details && exhibit.kind === 'painting' && hit.distance < 6.5) details.preload(exhibit.id);
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

  if (!traveling && state.closeUp) {
    // Близкий осмотр: медальоны и двелль выключены, выйти можно взглядом в сторону.
    markers.update(dt, { currentPointId: state.currentPointId, targetId: null, progress: 0, visible: false });
    ui.setDwell({ active: false, progress: 0 });
    advanceStudyLeave(dt);
    if (dust) dust.rotation.y += dt * 0.006;
  } else if (!traveling) {
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
        // Пока кольцо заполняется, успеваем скачать крупную текстуру той картины.
        if (details && targetPoint) {
          const art = featuredArtwork(targetPoint);
          if (art) details.preload(art.id);
        }
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

  if (!traveling && !state.closeUp && study && (state.mode === 'explore' || state.mode === 'vr')) {
    advanceStudy(dt);
  }
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

let lastStartRender = 0;

function frame(now) {
  if (state.paused) {
    state.lastFrame = now;
    requestAnimationFrame(frame);
    return;
  }
  // За стартовым экраном сцена не нуждается в 60 кадрах: экономим батарею и нагрев.
  if (state.mode === 'start' && now - lastStartRender < 70) {
    state.lastFrame = now;
    requestAnimationFrame(frame);
    return;
  }
  if (state.mode === 'start') lastStartRender = now;
  const dt = Math.min(0.05, (now - state.lastFrame) / 1000 || 0.016);
  state.lastFrame = now;
  state.fpsWindow += dt;
  if (state.fpsWindow > 1.5) {
    state.fps = Math.round(state.frames / state.fpsWindow);
    tuneResolution(state.fps, now);
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

function bindStudyZoom() {
  canvas.addEventListener('wheel', (event) => {
    if (!state.closeUp) return;
    event.preventDefault();
    nudgeCloseUpZoom(event.deltaY < 0 ? 0.12 : -0.12);
  }, { passive: false });

  const points = new Map();
  let pinchStart = 0;
  let zoomStart = 0;
  const spread = () => {
    const [a, b] = [...points.values()];
    return Math.hypot(a.x - b.x, a.y - b.y) || 1e-6;
  };
  canvas.addEventListener('pointerdown', (event) => {
    if (!state.closeUp) return;
    points.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (points.size === 2) {
      pinchStart = spread();
      zoomStart = state.closeUp.zoom;
    }
  });
  canvas.addEventListener('pointermove', (event) => {
    if (!state.closeUp || !points.has(event.pointerId)) return;
    points.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (points.size === 2 && pinchStart > 0) {
      setCloseUpZoom(zoomStart + (spread() / pinchStart - 1) * 1.6);
    }
  });
  const drop = (event) => {
    points.delete(event.pointerId);
    if (points.size < 2) pinchStart = 0;
  };
  canvas.addEventListener('pointerup', drop);
  canvas.addEventListener('pointercancel', drop);
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
      // В очках нет колеса: короткое касание — лупа, взгляд в сторону — выход.
      if (state.closeUp) setCloseUpZoom(state.closeUp.zoom > 0.5 ? 0 : 1);
      else recenter();
    }
  };
  canvas.addEventListener('pointerup', release);
  canvas.addEventListener('pointercancel', () => window.clearTimeout(pressTimer));
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      if (state.closeUp) leaveCloseUp();
      else if (state.mode === 'vr') exitVR();
    }
    if (event.key.toLowerCase() === 'r' && state.mode !== 'vr' && !state.closeUp) recenter();
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
  state.closeUp = null;
  if (study) study.reset();
  setRigFov(rig, NORMAL_FOV);
  ui.setCloseUp(false);
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
      dpr: renderer.getPixelRatio(),
      renderScale,
      detail: details ? details.info() : null,
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
    debugHover: () => {
      rig.updateMatrixWorld(true);
      raycaster.setFromCamera(CENTER, rig.mono);
      const hits = raycaster.intersectObjects(hoverMeshes, false).slice(0, 3)
        .map((h) => ({ name: h.object.name, id: h.object.userData.exhibitId, distance: +h.distance.toFixed(2) }));
      return { hits, hoverMeshes: hoverMeshes.length, camera: rig.mono.getWorldPosition(new THREE.Vector3()).toArray() };
    },
    study: () => ({
      seconds: STUDY_SECONDS,
      artId: study ? study.artId : null,
      progress: study ? study.progress : 0,
      closeUp: state.closeUp ? state.closeUp.id : null,
    }),
    closeUp: () => (state.closeUp ? {
      id: state.closeUp.id,
      zoom: state.closeUp.zoom || 0,
      pose: { ...state.closeUp.pose, position: [...state.closeUp.pose.position] },
      pointId: state.closeUp.entryPoint,
    } : null),
    setCloseUpZoom: (value) => setCloseUpZoom(value),
    debugState: () => ({
      travel: state.travel ? { kind: state.travel.kind, t: +(travelClock / state.travel.travel.duration).toFixed(3) } : null,
      lookAway: +studyLookAway.toFixed(3),
      closeUp: state.closeUp ? state.closeUp.id : null,
      look: { yaw: +look.state.yaw.toFixed(3), pitch: +look.state.pitch.toFixed(3), source: look.state.source },
      player: { yaw: +player.yaw.toFixed(3), pitch: +player.pitch.toFixed(3) },
    }),
    enterCloseUp: (id) => {
      const art = artworkById(id);
      return art ? startCloseUp(art) : false;
    },
    exitCloseUp: () => leaveCloseUp(),
    coverage: (id) => {
      const art = artworkById(id);
      if (!art) return null;
      const aspect = state.mode === 'vr'
        ? (window.innerWidth / 2) / window.innerHeight
        : window.innerWidth / window.innerHeight;
      const pose = state.closeUp && state.closeUp.id === id
        ? state.closeUp.pose
        : closeUpPose(art, { fov: CLOSE_FOV, aspect, eye: HALL.eye });
      return { ...paintingCoverage(art, pose, { fov: CLOSE_FOV, aspect }), pose };
    },
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
    detail: (id) => (details ? details.show(id) : null),
    detailInfo: () => (details ? details.info() : null),
    textures: () => extra.paintings.map((p) => ({
      id: p.art.id,
      base: p.baseTexture ? [p.baseTexture.image.width, p.baseTexture.image.height] : null,
      detail: p.detailTexture ? [p.detailTexture.image.width, p.detailTexture.image.height] : null,
    })),
    resolution: () => ({ dpr: renderer.getPixelRatio(), scale: renderScale, cap: dprCap() }),
    lights: () => {
      let count = 0;
      scene.traverse((obj) => { if (obj.isLight) count += 1; });
      return count;
    },
    debugCanvas: (id) => {
      const painting = extra.paintings.find((p) => p.art.id === id);
      if (!painting) return null;
      const mat = painting.canvasMat;
      return {
        hasMap: Boolean(mat.map),
        mapColor: mat.map && mat.map.colorSpace,
        imageSize: mat.map && mat.map.image ? [mat.map.image.width, mat.map.image.height] : null,
        imageIsCanvas: Boolean(mat.map && (mat.map.image instanceof HTMLCanvasElement)),
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
bindStudyZoom();

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
