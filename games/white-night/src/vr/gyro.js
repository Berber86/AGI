// gyro.js — quaternion DeviceOrientation provider for White Night VR.
//
// The provider returns semantic look angles: yaw > 0 is a physical turn to
// the right, pitch > 0 is a physical look up. DeviceOrientationControls'
// relative camera Euler has the opposite yaw sign, hence yaw=-euler.y.
import * as THREE from 'three';

const DEG = Math.PI / 180;
const Q1 = new THREE.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5));
const Z_AXIS = new THREE.Vector3(0, 0, 1);

export class GyroLook {
  constructor() {
    this.listening = false;
    this.permission = 'unknown';
    this.error = null;
    this.raw = { yaw: 0, pitch: 0 };
    this.lastAt = 0;
    this.screenAngleDeg = this.readScreenAngleDeg();
    this.hasBase = false;
    this.baseQ = new THREE.Quaternion();
    this.qNow = new THREE.Quaternion();
    this.qScreen = new THREE.Quaternion();
    this.relQ = new THREE.Quaternion();
    this.euler = new THREE.Euler(0, 0, 0, 'YXZ');
    this.onRebase = null;
    this.onOrientation = (event) => this.handle(event);
  }

  get supported() {
    return typeof window !== 'undefined' && 'DeviceOrientationEvent' in window;
  }

  readScreenAngleDeg() {
    if (typeof window === 'undefined') return 0;
    if (window.screen?.orientation && Number.isFinite(window.screen.orientation.angle)) {
      return window.screen.orientation.angle;
    }
    return Number.isFinite(window.orientation) ? window.orientation : 0;
  }

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
      this.error = error?.message || String(error);
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
    this.hasBase = false;
  }

  calibrate() {
    this.hasBase = false;
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
    this.qNow.setFromEuler(this.euler).multiply(Q1);
    this.qScreen.setFromAxisAngle(Z_AXIS, -screenAngleDeg * DEG);
    return this.qNow.multiply(this.qScreen);
  }

  handle(event) {
    const { alpha, beta, gamma } = event || {};
    if (!Number.isFinite(alpha) || !Number.isFinite(beta) || !Number.isFinite(gamma)) return;
    const screenAngleDeg = this.readScreenAngleDeg();
    if (screenAngleDeg !== this.screenAngleDeg) {
      this.screenAngleDeg = screenAngleDeg;
      this.hasBase = false;
      if (typeof this.onRebase === 'function') this.onRebase();
    }
    this.deviceQuaternion(alpha, beta, gamma, screenAngleDeg);
    if (!this.hasBase) {
      this.baseQ.copy(this.qNow);
      this.hasBase = true;
      this.raw = { yaw: 0, pitch: 0 };
      this.lastAt = performance.now();
      return;
    }
    this.relQ.copy(this.baseQ).invert().multiply(this.qNow);
    this.euler.setFromQuaternion(this.relQ, 'YXZ');
    this.raw = { yaw: -this.euler.y, pitch: this.euler.x };
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
