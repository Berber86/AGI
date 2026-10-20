// gyro.js — кватернионный поставщик DeviceOrientation для явного режима
// «Гибрид». Вне этого режима слушатель не подключается: старые режимы
// взгляда гироскоп не используют.
//
// Ориентация строится стандартным способом DeviceOrientationControls:
// Euler(beta, alpha, -gamma, 'YXZ') -> поворот устройства в камеру ->
// коррекция поворота экрана. Взгляд считается относительно позы
// калибровки, поэтому смена угла экрана сбрасывает базу и сообщает об
// этом через onRebase (FusionLook забывает старое сырьё без скачка).
//
// ЗНАКИ CANDY (не копировать из Pelagic Eye): VRController применяет
// camera.rotateY(yaw) и camera.rotateX(pitch). Поэтому относительный
// Euler камеры Three отдаётся как есть: yaw = euler.y, pitch = euler.x.
// В этих же координатах CamTracker отдаёт метки: голова вправо сдвигает
// метку влево по кадру и даёт отрицательный tracker yaw, а rotateY с
// отрицательным углом поворачивает камеру вправо.
import * as THREE from 'three';

const DEG = Math.PI / 180;
const GYRO_Q1 = new THREE.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5));
const GYRO_Z = new THREE.Vector3(0, 0, 1);

export class GyroLook {
  constructor() {
    this.listening = false;
    this.permission = 'unknown'; // unknown | granted | denied | unsupported | error
    this.error = null;
    this.raw = { yaw: 0, pitch: 0 };
    this.lastAt = 0;
    this.screenAngleDeg = this.readScreenAngleDeg();
    this.baseQ = null;
    this.onRebase = null;

    this.qNow = new THREE.Quaternion();
    this.qScreen = new THREE.Quaternion();
    this.relQ = new THREE.Quaternion();
    this.euler = new THREE.Euler(0, 0, 0, 'YXZ');

    this.onOrientation = (event) => this.handle(event);
  }

  get supported() {
    return typeof window !== 'undefined' && 'DeviceOrientationEvent' in window;
  }

  readScreenAngleDeg() {
    if (typeof window === 'undefined') return 0;
    if (window.screen && window.screen.orientation && Number.isFinite(window.screen.orientation.angle)) {
      return window.screen.orientation.angle;
    }
    return Number.isFinite(window.orientation) ? window.orientation : 0;
  }

  // Вызывать из пользовательского нажатия: iOS/Safari требует жест для
  // DeviceOrientationEvent.requestPermission(). Возвращает true, если
  // слушатель можно подключить; наличие настоящего датчика проверяется
  // отдельно по fresh(), когда начнут приходить события.
  async request() {
    if (!this.supported) {
      this.permission = 'unsupported';
      this.error = 'DeviceOrientation недоступен в этом браузере';
      return false;
    }
    try {
      const DOE = window.DeviceOrientationEvent;
      if (DOE && typeof DOE.requestPermission === 'function') {
        const result = await DOE.requestPermission();
        if (result !== 'granted') {
          this.permission = 'denied';
          this.error = 'Разрешение на гироскоп не выдано';
          return false;
        }
      }
      this.permission = 'granted';
      this.error = null;
      this.start();
      return true;
    } catch (error) {
      this.permission = 'error';
      this.error = error && error.message ? error.message : String(error);
      return false;
    }
  }

  start() {
    if (!this.supported || this.listening) return this.listening;
    window.addEventListener('deviceorientation', this.onOrientation);
    this.listening = true;
    return true;
  }

  stop() {
    if (this.listening && typeof window !== 'undefined') {
      window.removeEventListener('deviceorientation', this.onOrientation);
    }
    this.listening = false;
    this.lastAt = 0;
    this.baseQ = null;
  }

  calibrate() {
    this.baseQ = null;
    this.raw = { yaw: 0, pitch: 0 };
    if (typeof this.onRebase === 'function') this.onRebase();
  }

  fresh(maxMs = 700) {
    return !!this.lastAt && (performance.now() - this.lastAt) <= maxMs;
  }

  value() {
    return this.fresh(700) ? { ...this.raw } : null;
  }

  deviceQuaternion(alpha, beta, gamma, screenAngleDeg) {
    this.euler.set(beta * DEG, alpha * DEG, -gamma * DEG, 'YXZ');
    this.qNow.setFromEuler(this.euler).multiply(GYRO_Q1);
    this.qScreen.setFromAxisAngle(GYRO_Z, -screenAngleDeg * DEG);
    return this.qNow.multiply(this.qScreen);
  }

  handle(event) {
    const { alpha, beta, gamma } = event || {};
    if (!Number.isFinite(alpha) || !Number.isFinite(beta) || !Number.isFinite(gamma)) return;

    const screenAngleDeg = this.readScreenAngleDeg();
    if (screenAngleDeg !== this.screenAngleDeg) {
      this.screenAngleDeg = screenAngleDeg;
      this.baseQ = null;
      if (typeof this.onRebase === 'function') this.onRebase();
    }

    const qNow = this.deviceQuaternion(alpha, beta, gamma, screenAngleDeg).clone();
    if (!this.baseQ) {
      this.baseQ = qNow;
      this.raw = { yaw: 0, pitch: 0 };
      this.lastAt = performance.now();
      return;
    }

    this.relQ.copy(this.baseQ).invert().multiply(qNow);
    this.euler.setFromQuaternion(this.relQ, 'YXZ');
    this.raw = { yaw: this.euler.y, pitch: this.euler.x };
    this.lastAt = performance.now();
  }

  info() {
    return {
      supported: this.supported,
      listening: this.listening,
      permission: this.permission,
      error: this.error,
      fresh: this.fresh(700),
      ageMs: this.lastAt ? Math.round(performance.now() - this.lastAt) : null,
      yawDeg: +(this.raw.yaw / DEG).toFixed(2),
      pitchDeg: +(this.raw.pitch / DEG).toFixed(2),
      screenAngleDeg: this.screenAngleDeg,
    };
  }
}
