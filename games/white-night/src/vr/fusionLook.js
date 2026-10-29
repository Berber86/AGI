// fusionLook.js — gyro increments lead; proven marker samples only repair
// the absolute centre. The module is pure and uses semantic angles:
// yaw > 0 right, pitch > 0 up, both in radians.

const DEG = Math.PI / 180;
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const wrapPi = (v) => {
  let x = v;
  while (x > Math.PI) x -= Math.PI * 2;
  while (x < -Math.PI) x += Math.PI * 2;
  return x;
};

export const FUSION_VALID_K = 1.5;
export const FUSION_SINGLE_K = 0.5;
export const FUSION_VALID_MAX_RATE = 0.14;
export const FUSION_SINGLE_MAX_RATE = 0.05;
export const FUSION_GYRO_MAX_RATE = 9;
export const FUSION_GYRO_MIN_STEP = 0.3;
export const FUSION_GYRO_MAX_STEP = 0.75;
export const FUSION_GYRO_CONFIRM_FRAMES = 3;
export const FUSION_ANCHOR_JUMP_YAW = 20 * DEG;
export const FUSION_ANCHOR_JUMP_PITCH = 15 * DEG;
export const FUSION_ANCHOR_MATCH = 6 * DEG;
export const FUSION_ANCHOR_CONFIRM_SEC = 0.35;
export const FUSION_ANCHOR_STALE_SEC = 3;
export const FUSION_GYRO_LOSS_GRACE_SEC = 0.6;
export const FUSION_CAMERA_FOLLOW_K = 7;
export const FUSION_CAMERA_YAW_RATE = 1.2;
export const FUSION_CAMERA_PITCH_RATE = 0.8;
export const FUSION_HELD_MATCH = 12 * DEG;

export class FusionLook {
  constructor({ yawLimitDeg = 80, pitchMinDeg = -68, pitchMaxDeg = 62 } = {}) {
    this.yawLimit = Math.abs(yawLimitDeg) * DEG;
    this.pitchMin = Math.min(pitchMinDeg, pitchMaxDeg) * DEG;
    this.pitchMax = Math.max(pitchMinDeg, pitchMaxDeg) * DEG;
    this.yaw = 0;
    this.pitch = 0;
    this.status = 'fusion-wait';
    this.diagnostics = { gyroJumps: 0, gyroRebases: 0, anchorJumps: 0 };
    this.lastRaw = null;
    this.pendingRaw = null;
    this.pendingGyroFrames = 0;
    this.gyroMissingSec = 0;
    this.anchorTrack = null;
    this.anchorCandidate = null;
    this.anchorCandidateAgeSec = 0;
    this.anchorMissingSec = 0;
  }

  reset(yaw = 0, pitch = 0) {
    this.yaw = clamp(yaw, -this.yawLimit, this.yawLimit);
    this.pitch = clamp(pitch, this.pitchMin, this.pitchMax);
    this.lastRaw = null;
    this.pendingRaw = null;
    this.pendingGyroFrames = 0;
    this.gyroMissingSec = 0;
    this.anchorTrack = null;
    this.anchorCandidate = null;
    this.anchorCandidateAgeSec = 0;
    this.anchorMissingSec = 0;
    this.diagnostics.gyroJumps = 0;
    this.diagnostics.gyroRebases = 0;
    this.diagnostics.anchorJumps = 0;
    this.status = 'fusion-wait';
  }

  forgetGyro() {
    this.lastRaw = null;
    this.pendingRaw = null;
    this.pendingGyroFrames = 0;
    this.gyroMissingSec = 0;
  }

  update(dt, gyroRaw, sample) {
    const step = clamp(Number.isFinite(dt) ? dt : 0, 0, 0.1);
    const rawAnchor = sample && (sample.status === 'valid' || sample.status === 'single') ? sample : null;
    if (gyroRaw) {
      this.gyroMissingSec = 0;
      this.integrateGyro(gyroRaw, step);
    } else {
      this.lastRaw = null;
      this.pendingRaw = null;
      this.pendingGyroFrames = 0;
      this.gyroMissingSec += step;
    }
    const trustedAnchor = rawAnchor ? this.gateAnchor(rawAnchor, step) : null;
    if (rawAnchor) this.anchorMissingSec = 0;
    else {
      this.anchorMissingSec += step;
      if (this.anchorMissingSec > FUSION_ANCHOR_STALE_SEC) {
        this.anchorTrack = null;
        this.anchorCandidate = null;
        this.anchorCandidateAgeSec = 0;
      }
    }
    if (gyroRaw) {
      if (trustedAnchor) {
        this.correct(trustedAnchor, step);
        this.status = 'fusion';
      } else this.status = 'fusion-gyro';
    } else if (this.gyroMissingSec <= FUSION_GYRO_LOSS_GRACE_SEC) {
      this.status = 'fusion-wait';
    } else if (trustedAnchor) {
      this.followCamera(trustedAnchor, step);
      this.status = 'fusion-camera';
    } else if (sample?.status === 'held' && this.heldTrusted(sample)) {
      this.followCamera(sample, step);
      this.status = 'fusion-camera';
    } else this.status = 'fusion-wait';
    this.yaw = clamp(this.yaw, -this.yawLimit, this.yawLimit);
    this.pitch = clamp(this.pitch, this.pitchMin, this.pitchMax);
    return this.status;
  }

  integrateGyro(raw, step) {
    if (!this.lastRaw) {
      this.lastRaw = { yaw: raw.yaw, pitch: raw.pitch };
      this.pendingRaw = null;
      this.pendingGyroFrames = 0;
      return;
    }
    const dYaw = wrapPi(raw.yaw - this.lastRaw.yaw);
    const dPitch = raw.pitch - this.lastRaw.pitch;
    const maxStep = clamp(FUSION_GYRO_MAX_RATE * Math.max(step, 1 / 60), FUSION_GYRO_MIN_STEP, FUSION_GYRO_MAX_STEP);
    if (Math.abs(dYaw) <= maxStep && Math.abs(dPitch) <= maxStep) {
      this.yaw += dYaw;
      this.pitch += dPitch;
      this.lastRaw = { yaw: raw.yaw, pitch: raw.pitch };
      this.pendingRaw = null;
      this.pendingGyroFrames = 0;
      return;
    }
    if (this.pendingRaw
      && Math.abs(wrapPi(raw.yaw - this.pendingRaw.yaw)) <= maxStep
      && Math.abs(raw.pitch - this.pendingRaw.pitch) <= maxStep) this.pendingGyroFrames += 1;
    else {
      this.pendingGyroFrames = 1;
      this.diagnostics.gyroJumps += 1;
    }
    this.pendingRaw = { yaw: raw.yaw, pitch: raw.pitch };
    if (this.pendingGyroFrames >= FUSION_GYRO_CONFIRM_FRAMES) {
      this.lastRaw = { yaw: raw.yaw, pitch: raw.pitch };
      this.pendingRaw = null;
      this.pendingGyroFrames = 0;
      this.diagnostics.gyroRebases += 1;
    }
  }

  gateAnchor(sample, step) {
    const far = Math.abs(wrapPi(sample.yaw - this.yaw)) > FUSION_ANCHOR_JUMP_YAW
      || Math.abs(sample.pitch - this.pitch) > FUSION_ANCHOR_JUMP_PITCH;
    const abrupt = !this.anchorTrack
      || Math.abs(wrapPi(sample.yaw - this.anchorTrack.yaw)) > FUSION_ANCHOR_JUMP_YAW
      || Math.abs(sample.pitch - this.anchorTrack.pitch) > FUSION_ANCHOR_JUMP_PITCH;
    if (!far || !abrupt) return this.acceptAnchor(sample);
    if (this.anchorCandidate
      && Math.abs(wrapPi(sample.yaw - this.anchorCandidate.yaw)) <= FUSION_ANCHOR_MATCH
      && Math.abs(sample.pitch - this.anchorCandidate.pitch) <= FUSION_ANCHOR_MATCH) {
      this.anchorCandidateAgeSec += step;
    } else {
      this.anchorCandidateAgeSec = 0;
      this.diagnostics.anchorJumps += 1;
    }
    this.anchorCandidate = { yaw: sample.yaw, pitch: sample.pitch };
    return this.anchorCandidateAgeSec >= FUSION_ANCHOR_CONFIRM_SEC ? this.acceptAnchor(sample) : null;
  }

  acceptAnchor(sample) {
    this.anchorTrack = { yaw: sample.yaw, pitch: sample.pitch };
    this.anchorCandidate = null;
    this.anchorCandidateAgeSec = 0;
    return sample;
  }

  heldTrusted(sample) {
    const ref = this.anchorTrack || { yaw: this.yaw, pitch: this.pitch };
    return Math.abs(wrapPi(sample.yaw - ref.yaw)) <= FUSION_HELD_MATCH
      && Math.abs(sample.pitch - ref.pitch) <= FUSION_HELD_MATCH;
  }

  followCamera(sample, dt) {
    if (dt <= 0) return;
    const a = 1 - Math.exp(-FUSION_CAMERA_FOLLOW_K * dt);
    this.yaw += clamp(wrapPi(sample.yaw - this.yaw) * a, -FUSION_CAMERA_YAW_RATE * dt, FUSION_CAMERA_YAW_RATE * dt);
    this.pitch += clamp((sample.pitch - this.pitch) * a, -FUSION_CAMERA_PITCH_RATE * dt, FUSION_CAMERA_PITCH_RATE * dt);
  }

  correct(sample, dt) {
    if (dt <= 0) return;
    const valid = sample.status === 'valid';
    const k = valid ? FUSION_VALID_K : FUSION_SINGLE_K;
    const maxRate = valid ? FUSION_VALID_MAX_RATE : FUSION_SINGLE_MAX_RATE;
    const a = 1 - Math.exp(-k * dt);
    this.yaw += clamp(wrapPi(sample.yaw - this.yaw) * a, -maxRate * dt, maxRate * dt);
    this.pitch += clamp((sample.pitch - this.pitch) * a, -maxRate * 0.5 * dt, maxRate * 0.5 * dt);
  }

  info() {
    return {
      status: this.status,
      yawDeg: +(this.yaw / DEG).toFixed(2),
      pitchDeg: +(this.pitch / DEG).toFixed(2),
      guards: { ...this.diagnostics },
      anchor: this.anchorTrack ? {
        yawDeg: +(this.anchorTrack.yaw / DEG).toFixed(2),
        pitchDeg: +(this.anchorTrack.pitch / DEG).toFixed(2),
      } : null,
    };
  }
}
