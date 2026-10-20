// headGestures.js — deliberate "no" head shake recognition.
//
// One counted swing is a movement from an extreme on one side to an extreme
// on the other. Two such transitions inside four seconds trigger once;
// merely turning to one side, or slowly inspecting an object, does not.
const DEG = Math.PI / 180;

export class HeadShakeDetector {
  constructor({ thresholdDeg = 13, requiredTransitions = 2, windowMs = 4000, staleMs = 1800 } = {}) {
    this.thresholdDeg = thresholdDeg;
    this.requiredTransitions = requiredTransitions;
    this.windowMs = windowMs;
    this.staleMs = staleMs;
    this.reset();
  }

  reset() {
    this.count = 0;
    this.lastSide = null;
    this.startedAt = 0;
    this.lastExtremeAt = 0;
  }

  update(yawRad, now = performance.now()) {
    if (!Number.isFinite(yawRad)) return false;
    if (this.lastSide && now - this.startedAt > this.windowMs) this.reset();
    const yawDeg = yawRad / DEG;
    const side = yawDeg >= this.thresholdDeg ? 'right' : yawDeg <= -this.thresholdDeg ? 'left' : null;
    if (!side) {
      if (this.lastSide && now - this.lastExtremeAt > this.staleMs) this.reset();
      return false;
    }
    if (!this.lastSide) {
      this.lastSide = side;
      this.startedAt = now;
      this.lastExtremeAt = now;
      return false;
    }
    if (side === this.lastSide) {
      this.lastExtremeAt = now;
      return false;
    }
    this.count += 1;
    this.lastSide = side;
    this.lastExtremeAt = now;
    if (this.count >= this.requiredTransitions) {
      this.reset();
      return true;
    }
    return false;
  }

  info() {
    return {
      count: this.count,
      required: this.requiredTransitions,
      lastSide: this.lastSide,
      active: !!this.lastSide,
    };
  }
}
