// VR: параллельная стереопара под линзовые очки, взгляд по гироскопу и свайп.
// Семантика взгляда одна на весь проект: yaw > 0 — вправо, pitch > 0 — вверх.
// Применение к камере: rotation.y = -yaw, rotation.x = pitch (порядок YXZ).

import * as THREE from 'three';

const DEG = Math.PI / 180;
const MAX_PITCH = 78 * DEG;

export function forwardFromAngles(yaw, pitch) {
  const cp = Math.cos(pitch);
  return [Math.sin(yaw) * cp, Math.sin(pitch), -Math.cos(yaw) * cp];
}

export function anglesFromQuaternion(q) {
  const euler = new THREE.Euler().setFromQuaternion(q, 'YXZ');
  return { yaw: -euler.y, pitch: euler.x };
}

export function applyOrientation(alpha, beta, gamma, screenAngle) {
  const euler = new THREE.Euler();
  const q = new THREE.Quaternion();
  const q1 = new THREE.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5));
  const q0 = new THREE.Quaternion();
  const zee = new THREE.Vector3(0, 0, 1);
  euler.set(beta, alpha, -gamma, 'YXZ');
  q.setFromEuler(euler);
  q.multiply(q1);
  q.multiply(q0.setFromAxisAngle(zee, -screenAngle));
  return anglesFromQuaternion(q);
}

export function clampPitch(pitch) {
  return Math.max(-MAX_PITCH, Math.min(MAX_PITCH, pitch));
}

export function shortestAngle(from, to) {
  let delta = (to - from) % (Math.PI * 2);
  if (delta > Math.PI) delta -= Math.PI * 2;
  if (delta < -Math.PI) delta += Math.PI * 2;
  return delta;
}

/**
 * LookController: единый владелец yaw/pitch. Источники: гироскоп, свайп, «домой».
 * События гироскопа редкие и приходят вне главного потока — применяем последний сэмпл.
 */
export function createLookController({ onSourceChange = () => {} } = {}) {
  const state = {
    yaw: 0,
    pitch: 0,
    source: 'touch',
    gyro: 'idle',
    hasAbsolute: false,
    lastSampleAt: 0,
    smoothing: 0.38,
  };
  let gyroRaw = null;
  let gyroOffsetYaw = 0;
  let gyroOffsetPitch = 0;
  let screenAngle = 0;
  let dragging = false;
  let lastX = 0;
  let lastY = 0;
  let swipeYaw = 0;
  let swipePitch = 0;
  const listeners = [];

  function setSource(next) {
    if (state.source !== next) {
      state.source = next;
      onSourceChange(next);
    }
  }

  function onOrientation(event) {
    if (event.alpha == null && event.beta == null) return;
    const alpha = (event.alpha || 0) * DEG;
    const beta = (event.beta || 0) * DEG;
    const gamma = (event.gamma || 0) * DEG;
    gyroRaw = applyOrientation(alpha, beta, gamma, screenAngle);
    state.lastSampleAt = performance.now();
    state.gyro = 'active';
    if (state.source !== 'gyro') setSource('gyro');
  }

  function onScreenChange() {
    const angle = (screen.orientation && screen.orientation.angle) || window.orientation || 0;
    screenAngle = (Number(angle) || 0) * DEG;
  }

  function onPointerDown(event) {
    dragging = true;
    lastX = event.clientX;
    lastY = event.clientY;
    if (event.pointerId != null && event.target && event.target.setPointerCapture) {
      try { event.target.setPointerCapture(event.pointerId); } catch { /* игнорируем */ }
    }
  }

  function onPointerMove(event) {
    if (!dragging) return;
    const dx = event.clientX - lastX;
    const dy = event.clientY - lastY;
    lastX = event.clientX;
    lastY = event.clientY;
    // «Тянем мир»: свайп вправо поворачивает взгляд влево.
    swipeYaw -= dx * 0.0042;
    swipePitch = clampPitch(swipePitch - dy * 0.0034);
    if (state.source !== 'touch') setSource('touch');
  }

  function onPointerUp() {
    dragging = false;
  }

  function attach(element) {
    window.addEventListener('deviceorientation', onOrientation);
    window.addEventListener('orientationchange', onScreenChange);
    onScreenChange();
    element.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
  }

  function detach(element) {
    window.removeEventListener('deviceorientation', onOrientation);
    window.removeEventListener('orientationchange', onScreenChange);
    element.removeEventListener('pointerdown', onPointerDown);
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
    window.removeEventListener('pointercancel', onPointerUp);
  }

  function recenter(yaw = state.yaw, pitch = state.pitch) {
    state.yaw = yaw;
    state.pitch = pitch;
    swipeYaw = yaw;
    swipePitch = pitch;
    // Гироскоп считает дельту от своего опорного угла: без этого сброса
    // «recenter» возвращался следующим же событием ориентации.
    gyroOffsetYaw = yaw + (gyroRaw ? -gyroRaw.yaw : 0);
    gyroOffsetPitch = pitch + (gyroRaw ? -gyroRaw.pitch : 0);
  }

  function update(dt) {
    if (gyroRaw && state.source === 'gyro') {
      const targetYaw = gyroRaw.yaw + gyroOffsetYaw;
      const targetPitch = clampPitch(gyroRaw.pitch + gyroOffsetPitch);
      const k = 1 - Math.pow(1 - state.smoothing, dt * 60);
      state.yaw += shortestAngle(state.yaw, targetYaw) * k;
      state.pitch += (targetPitch - state.pitch) * k;
      swipeYaw = state.yaw;
      swipePitch = state.pitch;
    } else {
      state.yaw = swipeYaw;
      state.pitch = swipePitch;
    }
    state.pitch = clampPitch(state.pitch);
    // Гироскоп замолчал — честно переключаемся на свайп.
    if (state.source === 'gyro' && performance.now() - state.lastSampleAt > 1500) {
      swipeYaw = state.yaw;
      swipePitch = state.pitch;
      setSource('touch');
      state.gyro = 'stale';
    }
  }

  async function requestGyro() {
    try {
      const DOE = window.DeviceOrientationEvent;
      if (!DOE) {
        state.gyro = 'unsupported';
        return 'unsupported';
      }
      if (typeof DOE.requestPermission === 'function') {
        const permission = await DOE.requestPermission();
        if (permission !== 'granted') {
          state.gyro = 'denied';
          return 'denied';
        }
      }
      state.gyro = 'requested';
      return 'granted';
    } catch (err) {
      state.gyro = 'denied';
      return 'denied';
    }
  }

  function add(eventName, fn) {
    listeners.push([eventName, fn]);
    return fn;
  }

  return {
    state,
    attach,
    detach,
    update,
    recenter,
    requestGyro,
    add,
    get listeners() { return listeners; },
  };
}

/** Пара камер: левый и правый глаз, параллельная стереобаза. */
export function createStereoRig(scene, { ipd = 0.064, fov = 66 } = {}) {
  const rig = new THREE.Group();
  rig.name = 'rig';
  rig.rotation.order = 'YXZ';
  // near не 0,05: в зале ближе 15 см ничего нет, а каждый сантиметр near
  // съедает точность глубины — от неё зависят ковёр, медальоны и рамы.
  const left = new THREE.PerspectiveCamera(fov, 1, 0.15, 60);
  const right = new THREE.PerspectiveCamera(fov, 1, 0.15, 60);
  left.position.x = -ipd / 2;
  right.position.x = ipd / 2;
  left.name = 'eye-left';
  right.name = 'eye-right';
  const mono = new THREE.PerspectiveCamera(fov, 1, 0.15, 60);
  mono.name = 'eye-mono';
  rig.add(left, right, mono);
  rig.left = left;
  rig.right = right;
  rig.mono = mono;
  rig.ipd = ipd;
  scene.add(rig);
  return rig;
}

/** Плавное сужение поля зрения для близкого осмотра: меньше перспективных искажений. */
export function setRigFov(rig, fov) {
  for (const camera of [rig.left, rig.right, rig.mono]) {
    if (!camera || camera.fov === fov) continue;
    camera.fov = fov;
    camera.updateProjectionMatrix();
  }
}

export function applyRigPose(rig, { position, yaw, pitch, roll = 0 }) {
  rig.position.set(position[0], position[1], position[2]);
  rig.rotation.set(pitch, -yaw, roll);
}

/** Скругление под линзы не делаем: центр кадра совпадает с осью глаза. */
export function renderStereo(renderer, scene, rig, { quality = 'high' } = {}) {
  const size = renderer.getSize(new THREE.Vector2());
  const half = size.x / 2;
  const aspect = half / size.y;
  rig.left.aspect = aspect;
  rig.right.aspect = aspect;
  rig.left.updateProjectionMatrix();
  rig.right.updateProjectionMatrix();

  renderer.setScissorTest(true);
  renderer.setViewport(0, 0, half, size.y);
  renderer.setScissor(0, 0, half, size.y);
  renderer.render(scene, rig.left);

  renderer.setViewport(half, 0, half, size.y);
  renderer.setScissor(half, 0, half, size.y);
  renderer.render(scene, rig.right);

  renderer.setScissorTest(false);
  renderer.setViewport(0, 0, size.x, size.y);
  void quality;
}

export function renderMono(renderer, scene, camera) {
  const size = renderer.getSize(new THREE.Vector2());
  camera.aspect = size.x / size.y;
  camera.updateProjectionMatrix();
  renderer.setScissorTest(false);
  renderer.setViewport(0, 0, size.x, size.y);
  renderer.render(scene, camera);
}
