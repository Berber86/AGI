// vrLook.js — composition for the two selectable White Night look sources.
// `gyro` intentionally uses the same guarded FusionLook integrator with no
// camera anchor; `fusion` adds the two-landmark absolute measurement.
import { GyroLook } from './gyro.js';
import { FusionLook } from './fusionLook.js';
import { DualMarkerTracker } from './markerTracker.js';

const DEG = Math.PI / 180;

export class VrLook {
  constructor(video = null) {
    this.gyro = new GyroLook();
    this.fusion = new FusionLook();
    this.tracker = new DualMarkerTracker(video);
    this.mode = 'gyro';
    this.status = 'idle';
    this.look = { yaw: 0, pitch: 0 };
    this.markerSample = { status: 'lost', yaw: 0, pitch: 0 };
    this.active = false;
    this.gyro.onRebase = () => this.fusion.forgetGyro();
  }

  setMode(mode) {
    this.mode = mode === 'fusion' ? 'fusion' : 'gyro';
    if (this.mode === 'gyro') this.tracker.stop();
    this.fusion.reset(0, 0);
    this.look = { yaw: 0, pitch: 0 };
    this.status = this.active ? (this.mode === 'gyro' ? 'gyro' : 'fusion-wait') : 'idle';
  }

  setHues(leftHue, rightHue) {
    this.tracker.setHues(leftHue, rightHue);
  }

  async requestGyro() {
    return this.gyro.request();
  }

  async startCamera() {
    return this.tracker.start();
  }

  start() {
    this.gyro.start();
    this.gyro.calibrate();
    this.fusion.reset(0, 0);
    this.look = { yaw: 0, pitch: 0 };
    this.active = true;
    this.status = this.mode === 'gyro' ? 'gyro' : 'fusion-wait';
    if (this.mode === 'fusion' && !this.tracker.running && !this.tracker.synthetic) {
      this.tracker.start().catch(() => {});
    }
  }

  stop() {
    this.gyro.stop();
    this.tracker.stop();
    this.fusion.reset(0, 0);
    this.look = { yaw: 0, pitch: 0 };
    this.active = false;
    this.status = 'idle';
  }

  calibrate() {
    this.gyro.calibrate();
    if (this.mode === 'fusion' && this.tracker.calibrated) {
      const result = this.tracker.recalibrateCentre();
      if (!result.ok) return result;
    }
    this.fusion.reset(0, 0);
    this.look = { yaw: 0, pitch: 0 };
    this.status = this.mode === 'gyro' ? 'gyro' : 'fusion-wait';
    return { ok: true, message: 'Центр зафиксирован.' };
  }

  processPrep() {
    if (this.mode === 'fusion') this.tracker.process();
    this.markerSample = this.tracker.sample();
    return this.info();
  }

  update(dt) {
    const gyroRaw = this.gyro.value();
    this.markerSample = { status: 'lost', yaw: 0, pitch: 0 };
    let sample = null;
    if (this.mode === 'fusion') {
      this.tracker.process();
      sample = this.tracker.sample();
      this.markerSample = sample;
    }
    this.fusion.update(dt, gyroRaw, sample);
    this.look = { yaw: this.fusion.yaw, pitch: this.fusion.pitch };
    if (this.mode === 'gyro') {
      this.status = gyroRaw ? 'gyro' : 'gyro-wait';
    } else {
      this.status = this.fusion.status;
    }
    return this.look;
  }

  info() {
    return {
      mode: this.mode,
      status: this.status,
      active: this.active,
      yawDeg: +(this.look.yaw / DEG).toFixed(2),
      pitchDeg: +(this.look.pitch / DEG).toFixed(2),
      fusion: this.fusion.info(),
      gyro: this.gyro.info(),
      marker: this.tracker.info(),
      markerSample: {
        status: this.markerSample.status,
        yawDeg: +(this.markerSample.yaw / DEG).toFixed(2),
        pitchDeg: +(this.markerSample.pitch / DEG).toFixed(2),
      },
    };
  }
}
