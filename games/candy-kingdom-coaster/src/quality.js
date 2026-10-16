// FPS governor: aims for 60 FPS, honestly falls back to a stable 30 FPS mode.
// В VR у него отдельный профиль (setVr): стерео вдвое дороже, поэтому уровень
// качества там ограничен Medium и никогда не поднимается во время поездки, а
// разрешение принадлежит VR-режиму (main.enterVrStereo) — губернатор его не
// трогает. Иначе посреди поездки менялся бы pixelRatio и пересоздавалась
// теневая карта — это рывки, а не плавность.
export class QualityGovernor {
  constructor(renderer, composer, world) {
    this.renderer = renderer;
    this.composer = composer;
    this.world = world;
    this.tier = 2; // 2 = high, 1 = medium, 0 = low(30fps)
    this.fps = 60;
    this.vr = false; // стерео-поездка: свой профиль
    this._acc = 0;
    this._frames = 0;
    this._judgeT = 0;
    this._cap30 = false;
    this._renderAcc = 0;
    this._dts = [];
    this._settle = 3; // seconds of frames ignored after start-up / a tier change
    this._drops = [0, 0, 0]; // how often each tier proved too slow
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.apply();
    this._settle = 3;
  }

  /** ignore the next `sec` seconds (scene/state switches cause one-off hitches) */
  hold(sec = 2) {
    this._settle = Math.max(this._settle, sec);
    this._dts.length = 0; this._judgeT = 0;
  }

  /**
   * Вход/выход из VR-поездки. Внутри VR профиль занижен, а шкала уровней
   * сбрасывается: обычные накопленные «провалы» не должны дёргать стерео.
   */
  setVr(active) {
    const on = !!active;
    if (this.vr === on) return;
    this.vr = on;
    this._goodStreak = 0;
    this._drops = [0, 0, 0];
    this._dts.length = 0; this._judgeT = 0; this._acc = 0; this._renderAcc = 0;
    this._cap30 = false;
    if (on) {
      // В стерео «High» недостижим: ни теней 2048², ни bloom-профиля.
      this._tierOnEntry = this.tier;
      this.tier = Math.min(this.tier, 1);
    } else if (Number.isFinite(this._tierOnEntry)) {
      // Возврат в меню/после паузы отдаёт уровень, который был до очков:
      // поездка не должна оставлять обычную игру навсегда облегчённой.
      this.tier = Math.max(this.tier, Math.min(this._tierOnEntry, 2));
      this._tierOnEntry = null;
    }
    this._settle = 1.5;
    this.apply();
  }

  apply() {
    const r = this.renderer;
    if (this.vr) {
      // Разрешение — VR-режима (1.5 / 1.25 в камере), bloom не считается
      // (composer в стерео не вызывается). Здесь только тени и мир.
      // PCFShadowMap (1) вместо PCFSoft (2): мягкая фильтрация на мобильном
      // GPU стоит заметных тактов, а в линзах разницы почти не видно.
      r.shadowMap.enabled = this.tier > 0;
      r.shadowMap.type = 1;
      this.world.setQuality(this.tier, { vr: true });
      this._settle = Math.max(this._settle, 1);
      this._dts.length = 0; this._acc = 0; this._frames = 0; this._judgeT = 0;
      return;
    }
    r.shadowMap.type = 2; // PCFSoftShadowMap
    if (this.tier === 2) {
      r.setPixelRatio(Math.min(this.dpr, 2));
      r.shadowMap.enabled = true;
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
    // a tier switch reallocates targets / shadow maps: don't judge those frames
    this._settle = 1.5;
    this._dts.length = 0; this._acc = 0; this._frames = 0; this._judgeT = 0;
  }

  // returns true when this frame should render
  frame(dt) {
    if (this._settle > 0) {
      this._settle -= dt;
    } else {
      this._dts.push(dt);
      this._judgeT += dt;
    }
    if (this._judgeT >= 2) {
      // Trimmed mean: one-off spikes (GC, a texture upload, a tab switch) must
      // not cost the player a whole quality tier — drop the worst 6% frames.
      const d = this._dts.sort((a, b) => a - b);
      const keep = Math.max(1, Math.floor(d.length * 0.94));
      let sum = 0;
      for (let i = 0; i < keep; i++) sum += d[i];
      const fps = keep / sum;
      this.fps = fps;
      this._dts.length = 0; this._judgeT = 0;
      if (fps < 44 && this.tier > 0) {
        this._drops[this.tier]++;
        this._goodStreak = 0;
        this.tier--;
        this.apply();
      } else if (fps < 33 && this.tier === 0) {
        this._cap30 = true; // honest 30 FPS fallback: pace frames instead of jittering
      } else {
        this._goodStreak = fps > 57 ? (this._goodStreak || 0) + 1 : 0;
        // climb back only after a long clean run, and never into a tier that
        // already failed twice (no High↔Medium ping-pong with its recompiles).
        // В VR вверх не поднимаемся вообще: пересборка программ и теневая
        // карта посреди стерео-поездки заметнее, чем выигрыш от деталей.
        if (!this.vr && this.tier < 2 && this._goodStreak > 5 && this._drops[this.tier + 1] < 2) {
          this._goodStreak = 0;
          this.tier++;
          this.apply();
        }
      }
    }
    if (this._cap30) {
      this._renderAcc += dt;
      if (this._renderAcc < 1 / 30) return false;
      this._renderAcc = 0;
    }
    return true;
  }

  describe() {
    const base = this.tier === 2 ? 'High (60 FPS)' : this.tier === 1 ? 'Medium (auto)' : (this._cap30 ? 'Low (30 FPS locked)' : 'Low');
    return this.vr ? `${base} · VR` : base;
  }
}
