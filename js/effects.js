// effects.js — общий слой «мелочи» для обеих стадий: частицы, кольца, всплывающие числа,
// облака (чернила под водой, пыль на суше) и тряска экрана. Раньше это жило внутри core.js;
// когда появилась стадия суши, держать две копии стало опасно — они неизбежно разъедутся.
//
// Мир подмешивает методы в свой прототип:
//   Object.assign(World.prototype, EffectsMethods);
// и создаёт состояние вызовом initEffects(world) в конструкторе.
//
// Что должен определить сам мир:
//   settings.quality.particles — плотность частиц;
//   onCloudContact(cloud, d)   — что делает облако с игроком (по умолчанию замедляет).

import { CFG } from './config.js';

export function initEffects(world) {
  world.particles = [];
  world.floaters = [];
  world.inkClouds = [];
  world.shakeAmt = 0;
  world.shakeX = 0;
  world.shakeY = 0;
  world._eatFloatT = 0;
  return world;
}

export const EffectsMethods = {
  // ---------------------------------------------------------------- частицы
  spawnParticle(x, y, kind, color, size = 3, vx = 0, vy = 0, life = 1) {
    if (this.particles.length > CFG.spawn.maxParticles * (this.settings.quality.particles ?? 1)) return;
    this.particles.push({ x, y, vx, vy, kind, color, size, life, maxLife: life, dead: false });
  },

  spawnRing(x, y, r, color) {
    if (this.particles.length > 400) return;
    this.particles.push({ x, y, vx: 0, vy: 0, kind: 'ring', color, size: r * 0.35, life: 0.6, maxLife: 0.6, dead: false });
  },

  spawnInkCloud(x, y, r, opts = {}) {
    const color = opts.color ?? '#0a1a2a';
    const life = opts.life ?? 5.5;
    const n = opts.particles ?? 16;
    for (let i = 0; i < n; i++) {
      const a = this.rng.angle(), d = this.rng.next() * r;
      this.spawnParticle(x + Math.cos(a) * d, y + Math.sin(a) * d, 'goo', color, r * 0.18, 0, 0, life * 0.8);
    }
    this.inkClouds.push({ x, y, r, life });
    this.emit('ink', { x, y, r });
  },

  shake(amount) { this.shakeAmt = Math.min(24, this.shakeAmt + amount); },

  // Всплывающий текст: «+12 ДНК», «−8», «СТАЯ!»
  float(text, x, y, color = '#dff6ff', size = 13) {
    if (this.floaters.length > 34) return;
    this.floaters.push({ text, x, y, color, size, life: 1.1, maxLife: 1.1, vy: -26, vx: (this.rng.next() - 0.5) * 12, dead: false });
  },

  // ---------------------------------------------------------------- обновление
  updateEffects(dt) {
    this._updateParticles(dt);
    this._updateFloaters(dt);
    this._updateInk(dt);
    this._applyShake(dt);
  },

  _updateParticles(dt) {
    for (const q of this.particles) {
      if (q.dead) continue;
      q.life -= dt;
      if (q.life <= 0) { q.dead = true; continue; }
      q.x += q.vx * dt; q.y += q.vy * dt;
      q.vx *= 1 - 2.2 * dt; q.vy *= 1 - 2.2 * dt;
      if (q.kind === 'bubble') q.vy -= 22 * dt;
      if (q.kind === 'dust') q.vy -= 14 * dt;
      if (q.kind === 'leaf') { q.vx += Math.sin(this.time * 2.2 + q.y * 0.01) * 10 * dt; q.vy += 8 * dt; }
      if (q.kind === 'goo') q.vx += Math.sin(this.time * 3 + q.x) * 6 * dt;
    }
    this.particles = this.particles.filter((q) => !q.dead);
  },

  _updateFloaters(dt) {
    for (const f of this.floaters) {
      f.life -= dt;
      f.y += f.vy * dt; f.x += f.vx * dt;
      f.vy *= 1 - 1.2 * dt;
      if (f.life <= 0) f.dead = true;
    }
    this.floaters = this.floaters.filter((f) => !f.dead);
  },

  // Облако гасит скорость тому, кто внутри. Под водой это чернила сепиолы,
  // на суше — облако пыли или спор: правило одно, вкус разный.
  _updateInk(dt) {
    const p = this.player;
    for (const ink of this.inkClouds) {
      ink.life -= dt;
      if (!p.alive) continue;
      const dx = ink.x - p.x, dy = ink.y - p.y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < ink.r + p.r * 0.5) {
        if (this.onCloudContact) this.onCloudContact(ink, d);
        else this.player._slowFactor = 0.6;
      }
    }
    if (this.inkClouds.length) this.inkClouds = this.inkClouds.filter((i) => i.life > 0);
  },

  _applyShake(dt) {
    this.shakeAmt = Math.max(0, this.shakeAmt - dt * CFG.camera.shakeDecay);
    if (this.shakeAmt <= 0.01) { this.shakeX = 0; this.shakeY = 0; return; }
    this.shakeX = Math.cos(this.globalTime * 60) * this.shakeAmt;
    this.shakeY = Math.sin(this.globalTime * 71) * this.shakeAmt;
  },
};
