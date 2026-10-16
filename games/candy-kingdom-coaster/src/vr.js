// VR-поездка для линзовых очков (Google Cardboard и подобные): экран делится
// на два квадратных стереокадра, машинка едет сама (автопилот живёт в main.js),
// игрок только осматривается в ограниченном «окне» вокруг трассы. Никакого
// WebXR, дисторсии линз и UI внутри очков — по утверждённому контракту
// (VR_BRAINSTORM.md). Рендер идёт в обход EffectComposer: нет bloom, сцена
// рисуется дважды — по разу на глаз — бережным разрешением.
//
// ВЗГЛЯД: гироскопа нет и не будет (у владельца нет датчика, позыв — только
// камера-метка). Обработчик `deviceorientation` не подключается вообще:
// взгляд задают метки («По метке» / «По двум меткам») либо мягкий авто-обзор.
// `setSimLook()` остался: им пользуются режимы меток (main.js кладёт туда
// сглаженные углы) и QA.
//
// ТЕНИ: `WebGLShadowMap` в three.js перерисовывает карту при каждом вызове
// `renderer.render()`, а стереопара вызывает его дважды за кадр — карта 2048²
// и ~100 draw calls считались в мусор. Поэтому на время пары глаз
// `shadowMap.autoUpdate` выключается, а `needsUpdate` ставится один раз:
// первый глаз обновляет карту, второй переиспользует её.
import * as THREE from 'three';

export const VR_BASELINE_MIN_CM = 10;
export const VR_BASELINE_MAX_CM = 150;
const MAX_YAW = THREE.MathUtils.degToRad(35);   // одна метка/авто-обзор: «как из окна»
const MAX_DUAL_CAMERA_YAW = THREE.MathUtils.degToRad(80); // честный потолок цели двух меток
const MAX_PITCH = THREE.MathUtils.degToRad(20);

export function normalizeVrSettings(raw) {
  const s = raw && typeof raw === 'object' ? raw : {};
  const driverMode = s.driverMode === 'remote' || s.driverMode === 'gesture' ? s.driverMode : 'auto';
  return {
    lookMode: s.lookMode === 'forward' || s.lookMode === 'camera' || s.lookMode === 'camera-dual' ? s.lookMode : 'look',
    driverMode,
    gestureZoom: s.gestureZoom === true || driverMode === 'gesture',
    camColor: typeof s.camColor === 'string' ? s.camColor : 'raspberry',
    camHue: Number.isFinite(s.camHue) ? s.camHue : null,
    camLeftColor: typeof s.camLeftColor === 'string' ? s.camLeftColor : 'orange',
    camLeftHue: Number.isFinite(s.camLeftHue) ? s.camLeftHue : null,
    camRightColor: typeof s.camRightColor === 'string' ? s.camRightColor : 'raspberry',
    camRightHue: Number.isFinite(s.camRightHue) ? s.camRightHue : null,
    camTol: Math.min(45, Math.max(8, Math.round(Number.isFinite(+s.camTol) ? +s.camTol : 26))),
    camSat: Math.min(70, Math.max(20, Math.round(Number.isFinite(+s.camSat) ? +s.camSat : 42))),
    baselineCm: Math.min(VR_BASELINE_MAX_CM, Math.max(VR_BASELINE_MIN_CM,
      Number.isFinite(+s.baselineCm) ? Math.round(+s.baselineCm) : VR_BASELINE_MIN_CM)),
  };
}

const _autoPan = (now) => {
  const t = now * 0.001;
  return {
    yaw: THREE.MathUtils.degToRad(20) * Math.sin(t * 0.35),
    pitch: THREE.MathUtils.degToRad(6) * Math.sin(t * 0.23 + 1.3),
    source: 'autopan',
  };
};

export class VRController {
  constructor(renderer, scene, camera) {
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
    this.eyes = [new THREE.PerspectiveCamera(55, 1, 0.3, 1100), new THREE.PerspectiveCamera(55, 1, 0.3, 1100)];
    this.settings = normalizeVrSettings(null);
    this.active = false;
    this._yaw = 0;              // сглаженный взгляд, применяемый к камере
    this._pitch = 0;
    this._sim = null;           // подмена взгляда {yaw, pitch} в градусах: метки и QA
    this._zoom = 1;              // плавный множитель приближения 1..6
    this._zoomTarget = 1;
    this._layout = null;
    this._right = new THREE.Vector3();
  }

  start(settings) {
    this.settings = normalizeVrSettings(settings);
    this.active = true;
    this._yaw = 0; this._pitch = 0;
    this._sim = null;
    this._zoom = 1; this._zoomTarget = 1;
  }

  stop() {
    this.active = false;
    this._sim = null;
    this._zoom = 1; this._zoomTarget = 1;
  }

  // Живые настройки из команд джойстика: взгляд перецентрируется, базис
  // применяется со следующего кадра (render читает settings каждый кадр).
  setLookMode(mode) {
    this.settings.lookMode = mode === 'forward' || mode === 'camera' || mode === 'camera-dual' ? mode : 'look';
    this._yaw = 0; this._pitch = 0;
  }
  setBaselineCm(cm) {
    this.settings.baselineCm = Math.min(VR_BASELINE_MAX_CM, Math.max(VR_BASELINE_MIN_CM, Math.round(cm) || VR_BASELINE_MIN_CM));
    return this.settings.baselineCm;
  }

  // Жест V не меняет направление взгляда и не «приклеивает» камеру к
  // несуществующей цели: он только плавно сужает FOV вокруг текущего луча.
  // Возврат быстрее набора, чтобы отпущенная рука сразу вернула обзор.
  setGestureZoom(active) {
    this._zoomTarget = active ? 6 : 1;
  }
  updateZoom(dt) {
    const rate = this._zoomTarget > this._zoom ? 2.8 : 7.5;
    this._zoom += (this._zoomTarget - this._zoom) * (1 - Math.exp(-rate * Math.max(0, dt || 0)));
    if (Math.abs(this._zoomTarget - this._zoom) < 0.002) this._zoom = this._zoomTarget;
    return this._zoom;
  }
  zoomFactor() { return this._zoom; }
  zoomShakeFactor() { return 1 - 0.72 * THREE.MathUtils.clamp((this._zoom - 1) / 5, 0, 1); }
  zoomLookGain() { return this._zoom > 1.02 ? 0.72 : 1; }
  applyZoom(baseFov, dt) {
    const z = this.updateZoom(dt);
    return THREE.MathUtils.clamp(baseFov / z, 7, baseFov);
  }

  // QA: подменить взгляд без живых углов от метки (null — снять подмену).
  setSimLook(yawDeg, pitchDeg) {
    this._sim = yawDeg === null || yawDeg === undefined ? null
      : { yaw: +yawDeg || 0, pitch: +pitchDeg || 0 };
  }

  // Текущая цель взгляда. Гироскопа нет: «вперёд» — всегда 0; режимы метки
  // берут углы из setSimLook (их кладёт main.js); если углов нет — мягкий
  // авто-обзор красивых мест. Режим «Осматриваться» без метки = тот же авто-обзор.
  lookTarget(now = performance.now()) {
    if (this.settings.lookMode === 'forward') return { yaw: 0, pitch: 0, source: 'forward' };
    if (this.settings.lookMode === 'camera' || this.settings.lookMode === 'camera-dual') {
      // Взгляд ведёт камера (main подаёт углы одной или двух меток в setSimLook);
      // нет свежих углов — мягкий авто-обзор.
      if (this._sim) {
        const maxYaw = this.settings.lookMode === 'camera-dual' ? MAX_DUAL_CAMERA_YAW : MAX_YAW;
        return {
          yaw: THREE.MathUtils.clamp(THREE.MathUtils.degToRad(this._sim.yaw), -maxYaw, maxYaw),
          pitch: THREE.MathUtils.clamp(THREE.MathUtils.degToRad(this._sim.pitch), -MAX_PITCH, MAX_PITCH),
          source: 'camera',
        };
      }
      return _autoPan(now);
    }
    if (this._sim) {
      return {
        yaw: THREE.MathUtils.clamp(THREE.MathUtils.degToRad(this._sim.yaw), -MAX_YAW, MAX_YAW),
        pitch: THREE.MathUtils.clamp(THREE.MathUtils.degToRad(this._sim.pitch), -MAX_PITCH, MAX_PITCH),
        source: 'sim',
      };
    }
    return _autoPan(now);
  }

  // Вызывается после lookAt основной камеры: доводка взгляда головой.
  applyLook(camera, dt, now = performance.now()) {
    if (!this.active) return;
    const target = this.lookTarget(now);
    const k = 1 - Math.exp(-7 * Math.max(0, dt));
    this._yaw += (target.yaw - this._yaw) * k;
    this._pitch += (target.pitch - this._pitch) * k;
    const lookGain = this.zoomLookGain();
    camera.rotateY(this._yaw * lookGain);
    camera.rotateX(this._pitch * lookGain);
  }

  // Два квадрата бок о бок, по центру экрана; между ними — линия-разделитель (DOM).
  static layout(w, h) {
    const side = Math.max(0, Math.min(h, Math.floor(w / 2)));
    const x0 = Math.round((w - side * 2) / 2);
    const y0 = Math.round((h - side) / 2);
    return { side, x0, y0, eyes: [x0, x0 + side] };
  }

  render(renderer, scene, camera) {
    const w = window.innerWidth, h = window.innerHeight;
    const L = VRController.layout(w, h);
    this._layout = L;
    if (L.side <= 0) return;
    camera.updateMatrixWorld();
    this._right.set(1, 0, 0).applyQuaternion(camera.quaternion);
    const half = (this.settings.baselineCm / 100) / 2;
    // Тени — один раз на кадр. three.js перерисовывает теневую карту при
    // каждом render(), а тут их два (по глазу): карта 2048² и её draw calls
    // считались бы дважды. needsUpdate ставим один раз — его снимает первый
    // же проход (WebGLShadowMap), второй глаз переиспользует готовую карту.
    const shadow = renderer.shadowMap;
    const prevAuto = shadow.autoUpdate;
    const dedup = shadow.enabled && prevAuto;
    if (dedup) { shadow.autoUpdate = false; shadow.needsUpdate = true; }
    renderer.setScissorTest(false);
    renderer.setClearColor(0x000000, 1);
    renderer.clear(true, true, false);
    for (let i = 0; i < 2; i++) {
      const eye = this.eyes[i];
      eye.fov = camera.fov;
      eye.aspect = 1;
      eye.near = camera.near;
      eye.far = camera.far;
      eye.updateProjectionMatrix();
      eye.position.copy(camera.position).addScaledVector(this._right, (i === 0 ? -1 : 1) * half);
      eye.quaternion.copy(camera.quaternion);
      eye.updateMatrixWorld();
      renderer.setViewport(L.eyes[i], L.y0, L.side, L.side);
      renderer.setScissor(L.eyes[i], L.y0, L.side, L.side);
      renderer.setScissorTest(true);
      renderer.render(scene, eye);
    }
    if (dedup) shadow.autoUpdate = prevAuto;
    renderer.setScissorTest(false);
    renderer.setViewport(0, 0, w, h);
  }

  info(now = performance.now()) {
    const t = this.lookTarget(now);
    return {
      active: this.active,
      lookMode: this.settings.lookMode,
      baselineCm: this.settings.baselineCm,
      baselineM: this.settings.baselineCm / 100,
      gyro: false, // датчика нет: взгляд ведут метки или авто-обзор
      lookSource: this.active ? t.source : 'off',
      yawDeg: +THREE.MathUtils.radToDeg(this._yaw).toFixed(1),
      pitchDeg: +THREE.MathUtils.radToDeg(this._pitch).toFixed(1),
      layout: this._layout,
      gestureZoom: !!this.settings.gestureZoom,
      zoomFactor: +this._zoom.toFixed(2),
      zoomActive: this._zoomTarget > 1,
      zoomShakeFactor: +this.zoomShakeFactor().toFixed(2),
      zoomLookGain: +this.zoomLookGain().toFixed(2),
    };
  }
}
