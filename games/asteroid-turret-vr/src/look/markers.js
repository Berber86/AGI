// Dual color-marker tracking per repo VR guide §3-§4.
// Pure logic: worker detections go in, a look state comes out. Unit-tested.
//
// Contract implemented here:
// - A marker is an ENTITY only after >=0.15 s of continuous visibility and
//   keeps its identity through losses shorter than 4 s.
// - Marker shape: horizontal rectangle, fill >= 0.5, proportions compared to
//   the same marker's calibrated shape (no absolute 2:1 threshold).
// - Only the PAIR proves "straight": calibration requires both markers.
// - A lone confirmed marker steers the look toward its own side; it NEVER
//   proves "straight" and never returns the look to centre (a lone marker
//   sitting at its calibration spot with an already-turned head is rejected).
// - Nothing visible: hold the last angle, plus a short coast along the last
//   head-motion vector (<=12 deg/s decaying, <=8 deg per axis). No timer
//   return to centre, ever.
// - Symmetric alien-side rejection: a blob on the impossible side of the
//   frame is not searched, not counted as missing, and never extends the
//   life of an entity.

export const ENTITY_SECONDS = 0.15;
export const ENTITY_MEMORY_SECONDS = 4;
export const PAIR_AGREE_DEG = 6;
export const MIN_FILL = 0.5;
export const COAST_MAX_DEG = 8;
export const COAST_MAX_SPEED_DEG_S = 12;

function freshEntity() {
  return { entity: false, visibleSince: null, lastSeenAt: -Infinity, shape: null, yawDeg: 0, pitchDeg: 0, count: 0 };
}

export class MarkerTracker {
  constructor() {
    this.markers = { left: freshEntity(), right: freshEntity() };
    this.calibration = null; // { left:{yawDeg,pitchDeg,aspect}, right:{...} }
    this.hold = { yawDeg: 0, pitchDeg: 0 };
    this.lastVel = { yaw: 0, pitch: 0 };
    this.lastOut = { yawDeg: 0, pitchDeg: 0 };
    this.lastOutAt = null;
    this.coastUsed = { yaw: 0, pitch: 0 };
  }

  _shapeOk(m, det) {
    if (!det || (det.fill ?? 0) < MIN_FILL) return false;
    if (!m.shape || !det.aspect) return true; // before calibration: fill only
    // Perspective compresses width ~cos(angle); compare to own calibrated
    // shape with generous bounds instead of an absolute threshold.
    const ratio = det.aspect / m.shape;
    return ratio > 0.45 && ratio < 2.2;
  }

  /**
   * detections: { left: det|null, right: det|null } where det =
   * { found, u, v, yawDeg, pitchDeg, count, fill, aspect, expected }
   * `expected === false` means geometry says this marker cannot be in frame:
   * the blob is alien — ignore it entirely (and it does not refresh entity life).
   */
  update(detections, nowSec) {
    const seen = { left: false, right: false };
    for (const side of ['left', 'right']) {
      const m = this.markers[side];
      const det = detections[side];
      const usable = det && det.found && det.expected !== false && this._shapeOk(m, det);
      if (usable) {
        if (m.visibleSince === null || nowSec - m.lastSeenAt > ENTITY_MEMORY_SECONDS) {
          m.visibleSince = nowSec;
          m.entity = false;
        }
        if (nowSec - m.visibleSince >= ENTITY_SECONDS) m.entity = true;
        m.lastSeenAt = nowSec;
        m.yawDeg = det.yawDeg; m.pitchDeg = det.pitchDeg; m.count = det.count || 0;
        seen[side] = true;
      } else {
        if (nowSec - m.lastSeenAt > ENTITY_MEMORY_SECONDS) { m.entity = false; m.visibleSince = null; }
      }
    }

    const L = this.markers.left; const R = this.markers.right;
    const pairIn = seen.left && seen.right && L.entity && R.entity;
    let out = null;
    let mode = 'held';

    if (pairIn) {
      if (this.calibration) {
        const dL = { yaw: L.yawDeg - this.calibration.left.yawDeg, pitch: L.pitchDeg - this.calibration.left.pitchDeg };
        const dR = { yaw: R.yawDeg - this.calibration.right.yawDeg, pitch: R.pitchDeg - this.calibration.right.pitchDeg };
        if (Math.abs(dL.yaw - dR.yaw) <= PAIR_AGREE_DEG && Math.abs(dL.pitch - dR.pitch) <= PAIR_AGREE_DEG) {
          out = { yawDeg: (dL.yaw + dR.yaw) / 2, pitchDeg: (dL.pitch + dR.pitch) / 2 };
        } else {
          // Disagreeing deltas: the higher-count (more trusted) side leads,
          // never the average (guide §4).
          const lead = (L.count >= R.count) ? dL : dR;
          out = { yawDeg: lead.yaw, pitchDeg: lead.pitch };
        }
      } else {
        out = { yawDeg: (L.yawDeg + R.yawDeg) / 2, pitchDeg: (L.pitchDeg + R.pitchDeg) / 2 };
      }
      mode = 'pair';
    } else {
      // Lone marker: steers toward its own side only; near its calibrated
      // centre it proves nothing and is rejected (never returns to centre).
      const side = seen.left && L.entity ? 'left' : (seen.right && R.entity ? 'right' : null);
      if (side && this.calibration) {
        const m = this.markers[side];
        const dYaw = m.yawDeg - this.calibration[side].yawDeg;
        const dPitch = m.pitchDeg - this.calibration[side].pitchDeg;
        const towardSide = side === 'left' ? dYaw >= 2 : dYaw <= -2;
        if (towardSide || Math.abs(dPitch) >= 2) {
          out = { yawDeg: dYaw, pitchDeg: dPitch };
          mode = 'single';
        }
      } else if (side && !this.calibration) {
        const m = this.markers[side];
        out = { yawDeg: m.yawDeg, pitchDeg: m.pitchDeg };
        mode = 'single';
      }
    }

    if (out) {
      if (this.lastOutAt !== null && nowSec > this.lastOutAt) {
        const dt = nowSec - this.lastOutAt;
        this.lastVel = {
          yaw: (out.yawDeg - this.lastOut.yawDeg) / dt,
          pitch: (out.pitchDeg - this.lastOut.pitchDeg) / dt,
        };
      }
      this.hold = { ...out };
      this.lastOut = { ...out };
      this.lastOutAt = nowSec;
      this.coastUsed = { yaw: 0, pitch: 0 };
      return { ...out, mode, pairVisible: pairIn, entity: { left: L.entity, right: R.entity } };
    }

    // Nothing usable: hold + short coast along the last measured head motion.
    let { yawDeg, pitchDeg } = this.hold;
    if (this.lastOutAt !== null) {
      const dt = Math.min(0.25, Math.max(0, nowSec - this.lastOutAt));
      const decay = 0.55; // seconds, velocity tau
      const age = nowSec - this.lastOutAt;
      const k = Math.exp(-age / decay);
      const stepYaw = Math.sign(this.lastVel.yaw) * Math.min(Math.abs(this.lastVel.yaw) * 0.5, COAST_MAX_SPEED_DEG_S) * k * dt;
      const stepPitch = Math.sign(this.lastVel.pitch) * Math.min(Math.abs(this.lastVel.pitch) * 0.5, COAST_MAX_SPEED_DEG_S) * k * dt;
      if (Math.abs(this.coastUsed.yaw + stepYaw) <= COAST_MAX_DEG) { yawDeg += stepYaw; this.coastUsed.yaw += stepYaw; }
      if (Math.abs(this.coastUsed.pitch + stepPitch) <= COAST_MAX_DEG) { pitchDeg += stepPitch; this.coastUsed.pitch += stepPitch; }
      this.hold = { yawDeg, pitchDeg };
    }
    return { yawDeg, pitchDeg, mode, pairVisible: false, entity: { left: L.entity, right: R.entity } };
  }

  /** "I look straight" — requires BOTH markers currently visible as entities. */
  calibrate(detections, nowSec) {
    const state = this.update(detections, nowSec);
    const L = this.markers.left; const R = this.markers.right;
    if (!(state.pairVisible && L.entity && R.entity)) {
      return { ok: false, reason: 'both-markers-required' };
    }
    this.calibration = {
      left: { yawDeg: L.yawDeg, pitchDeg: L.pitchDeg },
      right: { yawDeg: R.yawDeg, pitchDeg: R.pitchDeg },
    };
    // Shape memory comes from detections when provided.
    for (const side of ['left', 'right']) {
      const det = detections[side];
      if (det && det.aspect) this.markers[side].shape = det.aspect;
    }
    this.hold = { yawDeg: 0, pitchDeg: 0 };
    this.lastOut = { yawDeg: 0, pitchDeg: 0 };
    return { ok: true };
  }
}

// --- Fusion: gyro leads every frame, pair slowly corrects drift (guide §4a) ---
// Ported smoothing guards from White Night / Candy Kingdom Coaster:
//   * exponential smoothing  a = 1 - exp(-k * dt)
//   * rate clamp per axis
//   * gyro confirmation over N frames before accepting a jump
//   * anchor gate with time confirmation before snapping to camera
//   * grace period when gyro goes missing
// Semantics: yaw > 0 right, pitch > 0 up, degrees.
export const FUSION_VALID_MAX_DEG_S = 6;   // пара меток: быстрое исправление дрейфа
export const FUSION_SINGLE_MAX_DEG_S = 3;  // одна метка: осторожная коррекция
export const FUSION_PITCH_RATE_SCALE = 0.5;
export const FUSION_GRACE_SECONDS = 2;
export const FUSION_GYRO_CONFIRM_FRAMES = 3;
export const FUSION_ANCHOR_JUMP_YAW = 20;
export const FUSION_ANCHOR_JUMP_PITCH = 15;
export const FUSION_ANCHOR_MATCH = 6;
export const FUSION_ANCHOR_CONFIRM_SEC = 0.35;
export const FUSION_ANCHOR_STALE_SEC = 3;
export const FUSION_GYRO_LOSS_GRACE_SEC = 0.6;
export const FUSION_CAMERA_FOLLOW_K = 7;
export const FUSION_CAMERA_YAW_RATE = 1.2;
export const FUSION_CAMERA_PITCH_RATE = 0.8;
export const FUSION_HELD_MATCH = 12;
// Look limits (comfort zone, matches White Night / Candy Kingdom Coaster)
export const FUSION_YAW_LIMIT_DEG = 80;
export const FUSION_PITCH_MIN_DEG = -55;
export const FUSION_PITCH_MAX_DEG = 55;

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const wrapDeg = (v) => {
  let x = v;
  while (x > 180) x -= 360;
  while (x < -180) x += 360;
  return x;
};

export class FusionLook {
  constructor() {
    this.yaw = 0;
    this.pitch = 0;
    this.lastRaw = null; // last accepted gyro {yawDeg,pitchDeg}
    this.pendingRaw = null;
    this.pendingGyroFrames = 0;
    this.gyroMissingSec = 0;
    this.camPending = null; // {yaw,pitch,count} awaiting 2-frame camera confirmation
    this.anchorTrack = null; // {yaw,pitch} accepted camera anchor
    this.anchorCandidate = null; // {yaw,pitch,age} for spurious-reading guard
    this.anchorCandidateAgeSec = 0;
    this.anchorMissingSec = 0;
    this.lastAnchorAt = -Infinity;
  }

  /** Gyro leads: integrate delta between consecutive raw gyro readings. */
  integrateGyro(raw, dtSec) {
    const step = clamp(Number.isFinite(dtSec) ? dtSec : 0, 0, 0.1);
    const maxStep = clamp(
      FUSION_VALID_MAX_DEG_S * Math.max(step, 1 / 60),
      0.3,
      0.75,
    );
    if (!this.lastRaw) {
      // First reading: anchor the smoothed angle directly to gyro.
      this.yaw = raw.yawDeg;
      this.pitch = raw.pitchDeg;
      this.lastRaw = { yaw: raw.yawDeg, pitch: raw.pitchDeg };
      this.pendingRaw = null;
      this.pendingGyroFrames = 0;
      return;
    }
    const dYaw = wrapDeg(raw.yawDeg - this.lastRaw.yaw);
    const dPitch = raw.pitchDeg - this.lastRaw.pitchDeg;
    if (Math.abs(dYaw) <= maxStep && Math.abs(dPitch) <= maxStep) {
      this.yaw += dYaw;
      this.pitch += dPitch;
      this.lastRaw = { yaw: raw.yawDeg, pitch: raw.pitchDeg };
      this.pendingRaw = null;
      this.pendingGyroFrames = 0;
      return;
    }
    const pending = this.pendingRaw;
    if (
      pending
      && Math.abs(wrapDeg(raw.yawDeg - pending.yaw)) <= maxStep
      && Math.abs(raw.pitchDeg - pending.pitch) <= maxStep
    ) {
      this.pendingGyroFrames += 1;
    } else {
      this.pendingGyroFrames = 1;
    }
    this.pendingRaw = { yaw: raw.yawDeg, pitch: raw.pitchDeg };
    if (this.pendingGyroFrames >= FUSION_GYRO_CONFIRM_FRAMES) {
      this.lastRaw = { yaw: raw.yawDeg, pitch: raw.pitchDeg };
      this.pendingRaw = null;
      this.pendingGyroFrames = 0;
    }
  }

  /** Gate a camera anchor: sample is already 2-frame confirmed.
   *  First anchor always establishes the track.  Afterwards, accept unless
   *  it is far from both the fused angle AND the last track (spurious).
   *  If close to either one, accept — drift correction is what anchors are
   *  for (White Night / Candy pattern). */
  gateAnchor(sample) {
    if (!this.anchorTrack) return this.acceptAnchor(sample);

    const farFromFused =
      Math.abs(wrapDeg(sample.yawDeg - this.yaw)) > FUSION_ANCHOR_JUMP_YAW
      || Math.abs(sample.pitchDeg - this.pitch) > FUSION_ANCHOR_JUMP_PITCH;
    const abrupt =
      Math.abs(wrapDeg(sample.yawDeg - this.anchorTrack.yaw)) > FUSION_ANCHOR_JUMP_YAW
      || Math.abs(sample.pitchDeg - this.anchorTrack.pitch) > FUSION_ANCHOR_JUMP_PITCH;

    if (!farFromFused || !abrupt) return this.acceptAnchor(sample);
    return null; // far from both: spurious, keep last track
  }

  acceptAnchor(sample) {
    this.anchorTrack = { yaw: sample.yawDeg, pitch: sample.pitchDeg };
    this.anchorCandidate = null;
    this.anchorCandidateAgeSec = 0;
    return sample;
  }

  /** Exponential smoothing toward a target, rate-clamped per axis.
   *  Separate yaw/pitch rate limits, then clamp to comfort zone. */
  easeTowardClamped(targetYaw, targetPitch, k, maxYawRateDegS, maxPitchRateDegS, dtSec) {
    if (dtSec <= 0) return;
    const a = 1 - Math.exp(-k * dtSec);
    this.yaw += clamp(wrapDeg(targetYaw - this.yaw) * a, -maxYawRateDegS * dtSec, maxYawRateDegS * dtSec);
    this.pitch += clamp((targetPitch - this.pitch) * a, -maxPitchRateDegS * dtSec, maxPitchRateDegS * dtSec);
    this.yaw = clamp(this.yaw, -FUSION_YAW_LIMIT_DEG, FUSION_YAW_LIMIT_DEG);
    this.pitch = clamp(this.pitch, FUSION_PITCH_MIN_DEG, FUSION_PITCH_MAX_DEG);
  }

  /** Exponential smoothing toward a target, rate-clamped per axis. */
  easeToward(targetYaw, targetPitch, k, maxRateDegS, dtSec) {
    this.easeTowardClamped(targetYaw, targetPitch, k, maxRateDegS, maxRateDegS, dtSec);
  }

  update(gyro, cam, nowSec, dtSec) {
    const step = clamp(Number.isFinite(dtSec) ? dtSec : 0, 0, 0.1);

    // --- gyro integration with jump confirmation ---
    if (gyro) {
      this.gyroMissingSec = 0;
      this.integrateGyro(gyro, step);
    } else {
      this.lastRaw = null;
      this.pendingRaw = null;
      this.pendingGyroFrames = 0;
      this.gyroMissingSec += step;
    }

    // --- camera anchor confirmation: 2 agreeing frames ---
    let camAnchor = null;
    if (cam && cam.pairVisible && cam.mode === 'pair') {
      const r = cam;
      if (
        this.camPending
        && Math.abs(wrapDeg(r.yawDeg - this.camPending.yawDeg)) <= FUSION_ANCHOR_MATCH
        && Math.abs(r.pitchDeg - this.camPending.pitchDeg) <= FUSION_ANCHOR_MATCH
      ) {
        this.camPending.count += 1;
      } else {
        this.camPending = { yawDeg: r.yawDeg, pitchDeg: r.pitchDeg, count: 1 };
      }
      if (this.camPending.count >= 2) {
        camAnchor = this.camPending;
      }
    } else {
      this.camPending = null;
    }
    const trustedAnchor = camAnchor ? this.gateAnchor(camAnchor) : null;

    if (cam && cam.pairVisible && cam.mode === 'pair') {
      this.anchorMissingSec = 0;
    } else {
      this.anchorMissingSec += step;
      if (this.anchorMissingSec > FUSION_ANCHOR_STALE_SEC) {
        this.anchorTrack = null;
        this.anchorCandidate = null;
        this.anchorCandidateAgeSec = 0;
      }
    }

    // --- fuse: gyro + anchor correction, or camera follow after gyro loss ---
    if (gyro) {
      if (trustedAnchor) {
        // correct toward absolute camera anchor (like White Night / Candy),
        // not relative to gyro — otherwise we double-subtract gyro
        const maxRate = FUSION_VALID_MAX_DEG_S;
        const pitchRate = maxRate * FUSION_PITCH_RATE_SCALE;
        this.easeTowardClamped(
          trustedAnchor.yawDeg,
          trustedAnchor.pitchDeg,
          FUSION_CAMERA_FOLLOW_K,
          maxRate,
          pitchRate,
          step,
        );
        this.lastAnchorAt = nowSec;
        return {
          yawDeg: this.yaw,
          pitchDeg: this.pitch,
          anchored: true,
        };
      }
      return {
        yawDeg: this.yaw,
        pitchDeg: this.pitch,
        anchored: false,
      };
    }

    // No gyro: grace period then camera follow
    if (this.gyroMissingSec <= FUSION_GYRO_LOSS_GRACE_SEC) {
      return {
        yawDeg: this.yaw,
        pitchDeg: this.pitch,
        anchored: false,
      };
    }
    if (trustedAnchor) {
      this.easeToward(
        trustedAnchor.yawDeg,
        trustedAnchor.pitchDeg,
        FUSION_CAMERA_FOLLOW_K,
        FUSION_CAMERA_YAW_RATE,
        step,
      );
      this.lastAnchorAt = nowSec;
      return { yawDeg: this.yaw, pitchDeg: this.pitch, anchored: true };
    }
    if (cam && cam.mode === 'single') {
      const ref = this.anchorTrack || { yaw: this.yaw, pitch: this.pitch };
      if (
        Math.abs(wrapDeg(cam.yawDeg - ref.yaw)) <= FUSION_HELD_MATCH
        && Math.abs(cam.pitchDeg - ref.pitch) <= FUSION_HELD_MATCH
      ) {
        this.easeTowardClamped(
          cam.yawDeg,
          cam.pitchDeg,
          FUSION_CAMERA_FOLLOW_K,
          FUSION_CAMERA_YAW_RATE,
          FUSION_CAMERA_PITCH_RATE,
          step,
        );
        return { yawDeg: this.yaw, pitchDeg: this.pitch, anchored: false };
      }
    }
    return { yawDeg: this.yaw, pitchDeg: this.pitch, anchored: false };
  }

  reset(yaw = 0, pitch = 0) {
    this.yaw = yaw;
    this.pitch = pitch;
    this.lastRaw = null;
    this.pendingRaw = null;
    this.pendingGyroFrames = 0;
    this.gyroMissingSec = 0;
    this.camPending = null;
    this.anchorTrack = null;
    this.anchorCandidate = null;
    this.anchorCandidateAgeSec = 0;
    this.anchorMissingSec = 0;
    this.lastAnchorAt = -Infinity;
  }
}
