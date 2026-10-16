// VR-поездка для линзовых очков (Google Cardboard и подобные): экран делится
// на два квадратных стереокадра, машинка едет сама (автопилот живёт в main.js),
// игрок только осматривается головой в ограниченном «окне» вокруг трассы.
// Никакого WebXR, дисторсии линз и UI внутри очков — по утверждённому
// контракту (VR_BRAINSTORM.md). Рендер идёт в обход EffectComposer: нет bloom,
// сцена рисуется дважды — по разу на глаз — бережным разрешением.
import * as THREE from 'three';

export const VR_BASELINE_MIN_CM = 10;
export const VR_BASELINE_MAX_CM = 150;
const MAX_YAW = THREE.MathUtils.degToRad(35);   // «как из окна»: взгляд не уезжает от трассы
const MAX_PITCH = THREE.MathUtils.degToRad(20);
const GYRO_FRESH_MS = 1500;

export function normalizeVrSettings(raw) {
  const s = raw && typeof raw === 'object' ? raw : {};
  return {
    lookMode: s.lookMode === 'forward' || s.lookMode === 'camera' ? s.lookMode : 'look',
    driverMode: s.driverMode === 'remote' ? 'remote' : 'auto',
    camColor: typeof s.camColor === 'string' ? s.camColor : 'raspberry',
    camHue: Number.isFinite(s.camHue) ? s.camHue : null,
    baselineCm: Math.min(VR_BASELINE_MAX_CM, Math.max(VR_BASELINE_MIN_CM,
      Number.isFinite(+s.baselineCm) ? Math.round(+s.baselineCm) : VR_BASELINE_MIN_CM)),
  };
}

const _euler = new THREE.Euler();
const _q = new THREE.Quaternion();
const _qx = new THREE.Quaternion();
const _qz = new THREE.Quaternion();
const X_AXIS = new THREE.Vector3(1, 0, 0);
const Z_AXIS = new THREE.Vector3(0, 0, 1);

// DeviceOrientation → мировая ориентация камеры телефона (тот же приём, что в
// three.js DeviceOrientationControls): Euler YXZ + доводка под поворот экрана.
function deviceQuaternion(alpha, beta, gamma) {
  _euler.set(THREE.MathUtils.degToRad(beta), THREE.MathUtils.degToRad(alpha),
    THREE.MathUtils.degToRad(-gamma), 'YXZ');
  _q.setFromEuler(_euler);
  _qx.setFromAxisAngle(X_AXIS, -Math.PI / 2);
  _q.multiply(_qx);
  const orient = (window.screen && window.screen.orientation && window.screen.orientation.angle != null)
    ? window.screen.orientation.angle : (window.orientation || 0);
  _qz.setFromAxisAngle(Z_AXIS, -THREE.MathUtils.degToRad(orient || 0));
  _q.multiply(_qz);
  return _q.clone();
}

export class VRController {
  constructor(renderer, scene, camera) {
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
    this.eyes = [new THREE.PerspectiveCamera(55, 1, 0.3, 1100), new THREE.PerspectiveCamera(55, 1, 0.3, 1100)];
    this.settings = normalizeVrSettings(null);
    this.active = false;
    this.hasGyro = false;
    this.lastGyroAt = -Infinity;
    this._refQuat = null;      // ориентация головы «прямо» в момент старта
    this._gyroYaw = 0;
    this._gyroPitch = 0;
    this._yaw = 0;              // сглаженный взгляд, применяемый к камере
    this._pitch = 0;
    this._sim = null;           // тестовая подмена взгляда {yaw, pitch} в градусах
    this._layout = null;
    this._right = new THREE.Vector3();
    this._onOrientation = (e) => this._handleOrientation(e);
    window.addEventListener('deviceorientation', this._onOrientation, { passive: true });
  }

  _handleOrientation(e) {
    if (!e || e.alpha === null || e.beta === null || e.gamma === null) return;
    this.hasGyro = true;
    this.lastGyroAt = performance.now();
    if (!this.active || this.settings.lookMode !== 'look') return;
    const q = deviceQuaternion(e.alpha, e.beta, e.gamma);
    if (!this._refQuat) { this._refQuat = q; return; }
    const rel = this._refQuat.clone().invert().multiply(q);
    const eu = new THREE.Euler().setFromQuaternion(rel, 'YXZ');
    this._gyroYaw = THREE.MathUtils.clamp(eu.y, -MAX_YAW, MAX_YAW);
    this._gyroPitch = THREE.MathUtils.clamp(eu.x, -MAX_PITCH, MAX_PITCH);
  }

  // iOS требует явного разрешения из жеста пользователя; остальные — no-op.
  async requestPermission() {
    try {
      const DOE = window.DeviceOrientationEvent;
      if (DOE && typeof DOE.requestPermission === 'function') {
        const res = await DOE.requestPermission();
        return res === 'granted';
      }
    } catch { /* отказали — сработает авто-обзор */ }
    return true;
  }

  start(settings) {
    this.settings = normalizeVrSettings(settings);
    this.active = true;
    this._refQuat = null;
    this._yaw = 0; this._pitch = 0; this._gyroYaw = 0; this._gyroPitch = 0;
    this._sim = null;
  }

  stop() {
    this.active = false;
    this._refQuat = null;
    this._sim = null;
  }

  // Живые настройки из команд джойстика: взгляд перецентрируется, базис
  // применяется со следующего кадра (render читает settings каждый кадр).
  setLookMode(mode) {
    this.settings.lookMode = mode === 'forward' || mode === 'camera' ? mode : 'look';
    this._refQuat = null;
    this._yaw = 0; this._pitch = 0;
  }
  setBaselineCm(cm) {
    this.settings.baselineCm = Math.min(VR_BASELINE_MAX_CM, Math.max(VR_BASELINE_MIN_CM, Math.round(cm) || VR_BASELINE_MIN_CM));
    return this.settings.baselineCm;
  }

  // QA: подменить взгляд без настоящего гироскопа (null — снять подмену).
  setSimLook(yawDeg, pitchDeg) {
    this._sim = yawDeg === null || yawDeg === undefined ? null
      : { yaw: +yawDeg || 0, pitch: +pitchDeg || 0 };
  }

  gyroFresh(now = performance.now()) {
    return this.hasGyro && (now - this.lastGyroAt) <= GYRO_FRESH_MS;
  }

  // Текущая цель взгляда: режим «вперёд» — всегда 0; подмена для тестов;
  // гироскоп, пока события свежие; иначе — медленный авто-обзор красивых мест.
  lookTarget(now = performance.now()) {
    if (this.settings.lookMode === 'forward') return { yaw: 0, pitch: 0, source: 'forward' };
    if (this.settings.lookMode === 'camera') {
      // Взгляд ведёт камера (main подаёт углы метки в setSimLook);
      // гироскоп не участвует. Нет свежих углов — мягкий авто-обзор.
      if (this._sim) {
        return {
          yaw: THREE.MathUtils.clamp(THREE.MathUtils.degToRad(this._sim.yaw), -MAX_YAW, MAX_YAW),
          pitch: THREE.MathUtils.clamp(THREE.MathUtils.degToRad(this._sim.pitch), -MAX_PITCH, MAX_PITCH),
          source: 'camera',
        };
      }
      const t = now * 0.001;
      return {
        yaw: THREE.MathUtils.degToRad(20) * Math.sin(t * 0.35),
        pitch: THREE.MathUtils.degToRad(6) * Math.sin(t * 0.23 + 1.3),
        source: 'autopan',
      };
    }
    if (this._sim) {
      return {
        yaw: THREE.MathUtils.clamp(THREE.MathUtils.degToRad(this._sim.yaw), -MAX_YAW, MAX_YAW),
        pitch: THREE.MathUtils.clamp(THREE.MathUtils.degToRad(this._sim.pitch), -MAX_PITCH, MAX_PITCH),
        source: 'sim',
      };
    }
    if (this.gyroFresh(now)) return { yaw: this._gyroYaw, pitch: this._gyroPitch, source: 'gyro' };
    const t = now * 0.001;
    return {
      yaw: THREE.MathUtils.degToRad(20) * Math.sin(t * 0.35),
      pitch: THREE.MathUtils.degToRad(6) * Math.sin(t * 0.23 + 1.3),
      source: 'autopan',
    };
  }

  // Вызывается после lookAt основной камеры: доводка взгляда головой.
  applyLook(camera, dt, now = performance.now()) {
    if (!this.active) return;
    const target = this.lookTarget(now);
    const k = 1 - Math.exp(-7 * Math.max(0, dt));
    this._yaw += (target.yaw - this._yaw) * k;
    this._pitch += (target.pitch - this._pitch) * k;
    camera.rotateY(this._yaw);
    camera.rotateX(this._pitch);
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
      hasGyro: this.hasGyro,
      lookSource: this.active ? t.source : 'off',
      yawDeg: +THREE.MathUtils.radToDeg(this._yaw).toFixed(1),
      pitchDeg: +THREE.MathUtils.radToDeg(this._pitch).toFixed(1),
      layout: this._layout,
    };
  }
}
