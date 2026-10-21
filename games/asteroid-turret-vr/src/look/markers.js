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
export const FUSION_MAX_CORRECTION_DEG_S = 5;
export const FUSION_GRACE_SECONDS = 2;

export class FusionLook {
  constructor() {
    this.correction = { yaw: 0, pitch: 0 };
    this.pending = null; // candidate camera measurement {yaw,pitch,at,count}
    this.lastAnchorAt = -Infinity;
  }

  /**
   * gyro: {yawDeg,pitchDeg}; cam: tracker output or null.
   * Safeguards: confirmation (2 agreeing camera frames), grace after pair
   * loss, rate-limited correction; the anchor is the direct tracker
   * measurement, never a smoothed trajectory.
   */
  update(gyro, cam, nowSec, dtSec) {
    if (cam && cam.pairVisible && cam.mode === 'pair') {
      const meas = { yaw: cam.yawDeg, pitch: cam.pitchDeg };
      if (this.pending && Math.abs(meas.yaw - this.pending.yaw) <= 3 && Math.abs(meas.pitch - this.pending.pitch) <= 3) {
        this.pending.count += 1;
      } else {
        this.pending = { ...meas, count: 1 };
      }
      if (this.pending.count >= 2) {
        const target = {
          yaw: meas.yaw - gyro.yawDeg,
          pitch: meas.pitch - gyro.pitchDeg,
        };
        const maxStep = FUSION_MAX_CORRECTION_DEG_S * Math.max(0, dtSec);
        this.correction.yaw += Math.max(-maxStep, Math.min(maxStep, target.yaw - this.correction.yaw));
        this.correction.pitch += Math.max(-maxStep, Math.min(maxStep, target.pitch - this.correction.pitch));
        this.lastAnchorAt = nowSec;
      }
    } else if (nowSec - this.lastAnchorAt > FUSION_GRACE_SECONDS) {
      this.pending = null; // stale candidate dies; correction itself is kept
    }
    return {
      yawDeg: gyro.yawDeg + this.correction.yaw,
      pitchDeg: gyro.pitchDeg + this.correction.pitch,
      anchored: nowSec - this.lastAnchorAt <= FUSION_GRACE_SECONDS,
    };
  }
}
