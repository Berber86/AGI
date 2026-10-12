// FPS governor: aims for 60 FPS, honestly falls back to a stable 30 FPS mode.
export class QualityGovernor {
  constructor(renderer, composer, world) {
    this.renderer = renderer;
    this.composer = composer;
    this.world = world;
    this.tier = 2; // 2 = high, 1 = medium, 0 = low(30fps)
    this.fps = 60;
    this._acc = 0;
    this._frames = 0;
    this._judgeT = 0;
    this._cap30 = false;
    this._renderAcc = 0;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.apply();
  }

  apply() {
    const r = this.renderer;
    if (this.tier === 2) {
      r.setPixelRatio(Math.min(this.dpr, 2));
      r.shadowMap.enabled = true;
      r.shadowMap.type = 2; // PCFSoftShadowMap
      this.composer.passes.forEach((p) => {
        if (p.constructor.name === 'UnrealBloomPass') { p.enabled = true; p.strength = 0.62; }
      });
    } else if (this.tier === 1) {
      r.setPixelRatio(Math.min(this.dpr, 1.4));
      r.shadowMap.enabled = true;
      this.composer.passes.forEach((p) => {
        if (p.constructor.name === 'UnrealBloomPass') { p.enabled = true; p.strength = 0.4; }
      });
    } else {
      r.setPixelRatio(1);
      r.shadowMap.enabled = false;
      this.composer.passes.forEach((p) => {
        if (p.constructor.name === 'UnrealBloomPass') { p.enabled = false; }
      });
    }
    this.world.setQuality(this.tier);
  }

  // returns true when this frame should render
  frame(dt) {
    this._acc += dt;
    this._frames++;
    this._judgeT += dt;
    if (this._judgeT >= 2) {
      const fps = this._frames / this._acc;
      this.fps = fps;
      this._acc = 0; this._frames = 0; this._judgeT = 0;
      if (fps < 44 && this.tier > 0) {
        this.tier--;
        this.apply();
      } else if (fps < 33 && this.tier === 0) {
        this._cap30 = true; // honest 30 FPS fallback: pace frames instead of jittering
      } else if (fps > 56 && this.tier < 2 && this._judgeT === 0 && this._goodStreak > 3) {
        this.tier++;
        this.apply();
      }
      if (fps > 56) this._goodStreak = (this._goodStreak || 0) + 1;
      else this._goodStreak = 0;
    }
    if (this._cap30) {
      this._renderAcc += dt;
      if (this._renderAcc < 1 / 30) return false;
      this._renderAcc = 0;
    }
    return true;
  }

  describe() {
    return this.tier === 2 ? 'High (60 FPS)' : this.tier === 1 ? 'Medium (auto)' : (this._cap30 ? 'Low (30 FPS locked)' : 'Low');
  }
}
