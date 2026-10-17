// VR-режим для линзовых очков: экран делится на два квадрата, сцена рисуется
// дважды. Никакого WebXR и коррекции дисторсии — только стереопара и обзор
// головой по камере-меткам.
//
// ОТКУДА ВЗГЛЯД. Гироскоп не подключается вообще: `deviceorientation` не слушаем
// ни при каких условиях (утверждено контрактом). Источники взгляда:
//   forward      — всегда прямо;
//   camera       — одна цветная метка;
//   camera-dual  — две метки.
// Метку потеряли — взгляд остаётся там, где был (удержание), и не едет ни к
// центру, ни куда-либо ещё: движение возвращается только с новыми данными.
import * as THREE from 'three';
import { LOOK, VR_BASELINE_MIN_CM, VR_BASELINE_MAX_CM } from './config.js';
import { setGradeViewport, water as waterEnv } from './water.js';

const MAX_YAW = THREE.MathUtils.degToRad(LOOK.maxYawDeg);
const MAX_PITCH = THREE.MathUtils.degToRad(LOOK.maxPitchDeg);

export function normalizeVrLook(raw) {
  const s = raw && typeof raw === 'object' ? raw : {};
  return {
    lookMode: s.lookMode === 'forward' || s.lookMode === 'camera' || s.lookMode === 'camera-dual' ? s.lookMode : 'camera-dual',
    baselineCm: Math.min(VR_BASELINE_MAX_CM, Math.max(VR_BASELINE_MIN_CM,
      Number.isFinite(+s.baselineCm) ? Math.round(+s.baselineCm) : 64)),
  };
}

export class VRController {
  constructor(renderer, scene, camera) {
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
    this.eyes = [new THREE.PerspectiveCamera(62, 1, 0.08, 700), new THREE.PerspectiveCamera(62, 1, 0.08, 700)];
    this.settings = normalizeVrLook(null);
    this.active = false;
    this._yaw = 0;
    this._pitch = 0;
    this._sim = null;      // последние достоверные углы от меток, градусы
    this._held = false;    // угол удержан: метки нет, взгляд стоит
    this._layout = null;
    this._right = new THREE.Vector3();
    this._frames = 0;
  }

  start(settings) {
    this.settings = normalizeVrLook(settings);
    this.active = true;
    this._yaw = 0; this._pitch = 0;
    this._sim = null; this._held = false;
    this._frames = 0;
  }

  stop() {
    this.active = false;
    this._sim = null;
    this._held = false;
  }

  setLookMode(mode) {
    this.settings.lookMode = normalizeVrLook({ lookMode: mode }).lookMode;
    return this.settings.lookMode;
  }

  setBaselineCm(cm) {
    this.settings.baselineCm = Math.min(VR_BASELINE_MAX_CM, Math.max(VR_BASELINE_MIN_CM, Math.round(cm) || VR_BASELINE_MIN_CM));
    return this.settings.baselineCm;
  }

  /**
   * Углы от трекера меток (градусы). `held = true` означает «данных нет, держим
   * последний угол»: цель взгляда не меняется, но и не сбрасывается в ноль.
   * `null` — явный сброс (например, выход из VR или режим «прямо»).
   */
  setSimLook(yawDeg, pitchDeg, held = false) {
    if (yawDeg === null || yawDeg === undefined) {
      this._sim = null;
      this._held = false;
      return;
    }
    this._sim = { yaw: +yawDeg || 0, pitch: +pitchDeg || 0 };
    this._held = !!held;
  }

  /** Цель взгляда в радианах с учётом утверждённых пределов. */
  lookTarget() {
    if (!this.active) return { yaw: 0, pitch: 0, source: 'off' };
    if (this.settings.lookMode === 'forward') return { yaw: 0, pitch: 0, source: 'forward' };
    if (!this._sim) return { yaw: 0, pitch: 0, source: 'nodata' };
    return {
      yaw: THREE.MathUtils.clamp(THREE.MathUtils.degToRad(this._sim.yaw), -MAX_YAW, MAX_YAW),
      pitch: THREE.MathUtils.clamp(THREE.MathUtils.degToRad(this._sim.pitch), -MAX_PITCH, MAX_PITCH),
      source: this._held ? 'held' : 'camera',
    };
  }

  /** Вызывается после обычного построения вида: доводка поворотом головы. */
  applyLook(camera, dt) {
    if (!this.active) return;
    const target = this.lookTarget();
    const k = 1 - Math.exp(-LOOK.smoothing * Math.max(0, Math.min(dt, 0.25)));
    this._yaw += (target.yaw - this._yaw) * k;
    this._pitch += (target.pitch - this._pitch) * k;
    camera.rotateY(this._yaw);
    camera.rotateX(this._pitch);
  }

  /** Два квадрата бок о бок по центру экрана. */
  static layout(w, h) {
    const side = Math.max(0, Math.min(h, Math.floor(w / 2)));
    const x0 = Math.round((w - side * 2) / 2);
    const y0 = Math.round((h - side) / 2);
    return { side, x0, y0, eyes: [x0, x0 + side] };
  }

  render() {
    const w = window.innerWidth, h = window.innerHeight;
    const L = VRController.layout(w, h);
    this._layout = L;
    if (L.side <= 0) return false;
    const camera = this.camera;
    camera.updateMatrixWorld();
    this._right.set(1, 0, 0).applyQuaternion(camera.quaternion);
    const half = this.settings.baselineCm / 100 / 2;
    const renderer = this.renderer;
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
      // Вода и виньетка считаются от своего глаза: поглощение — от его позиции,
      // виньетка — в границах его половины экрана.
      waterEnv.uCamPos.value.copy(eye.position);
      setGradeViewport(L.eyes[i], L.y0, L.side, L.side, renderer.getPixelRatio());
      renderer.render(this.scene, eye);
    }
    renderer.setScissorTest(false);
    renderer.setViewport(0, 0, w, h);
    this._frames++;
    return true;
  }

  info() {
    const t = this.lookTarget();
    return {
      active: this.active,
      lookMode: this.settings.lookMode,
      gyro: false, // датчик не используется никогда: это часть контракта
      baselineCm: this.settings.baselineCm,
      baselineM: +(this.settings.baselineCm / 100).toFixed(2),
      lookSource: t.source,
      yawDeg: +THREE.MathUtils.radToDeg(this._yaw).toFixed(1),
      pitchDeg: +THREE.MathUtils.radToDeg(this._pitch).toFixed(1),
      maxYawDeg: LOOK.maxYawDeg,
      maxPitchDeg: LOOK.maxPitchDeg,
      frames: this._frames,
      layout: this._layout,
    };
  }
}
