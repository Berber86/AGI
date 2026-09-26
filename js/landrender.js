// landrender.js — отрисовка стадии суши: земля, трава, водоёмы, постройки, звери, погода, радар.
//
// Тот же контракт, что у подводного render.js, чтобы главный цикл не различал стадии:
//   new LandRenderer(canvas, settings) → resize(), updateCamera(game, dt), draw(game, dt),
//   drawRadar(canvas, game), cam, settings, quality, worldToScreen/screenToWorld.
//
// Приёмы:
//   * земля — градиент по биому плюс «пятна» травы из детерминированного шума по клеткам,
//     чтобы картинка не мерцала при движении камеры;
//   * трава рисуется только в пределах экрана и с шагом по сетке: 500–900 кустиков на кадр;
//   * вода — эллипс с блеском и рябью, дождь добавляет круги по поверхности.

import { CFG } from './config.js';
import { clamp, TAU, damp, rgba, mixHex, shade, hash01, dist } from './util.js';
import { LAND_BIOME_BY_ID, LAND_FOOD_KINDS, LAND_FAMILY } from './landspecies.js';
import { drawCreature, specFromPlayer, specFromSpecies, creatureSpec } from './landcreature.js';

const BIOME_GROUND = {
  shore: { a: '#d9c9a1', b: '#b9a17a', grass: '#a8c98f', accent: '#efe2c0' },
  plain: { a: '#b6c77a', b: '#7f9a55', grass: '#9dc06a', accent: '#e6f0bb' },
  forest: { a: '#6f8f5c', b: '#3f5a3f', grass: '#7fae66', accent: '#cfe6ae' },
  rock: { a: '#9a938c', b: '#5f5a58', grass: '#8f9a7a', accent: '#d9d2c6' },
};

export class LandRenderer {
  constructor(canvas, settings) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false });
    this.settings = settings;
    this.cam = { x: 0, y: 0, zoom: 1, targetZoom: 1 };
    this.dpr = 1;
    this.w = 0; this.h = 0;
    this._ramps = [];           // подготовленные «пятна» травы
    this.resize();
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('orientationchange', () => setTimeout(() => this.resize(), 250));
  }

  get quality() { return CFG.quality[this.settings.quality] ?? CFG.quality.medium; }

  resize() {
    const q = this.quality;
    const dpr = Math.min(window.devicePixelRatio || 1, q.dpr);
    this.dpr = dpr;
    this.w = this.canvas.clientWidth || window.innerWidth;
    this.h = this.canvas.clientHeight || window.innerHeight;
    this.canvas.width = Math.floor(this.w * dpr);
    this.canvas.height = Math.floor(this.h * dpr);
  }

  worldToScreen(x, y, out) {
    out.x = (x - this.cam.x) * this.cam.zoom + this.w / 2;
    out.y = (y - this.cam.y) * this.cam.zoom + this.h / 2;
    return out;
  }
  screenToWorld(sx, sy) {
    return { x: (sx - this.w / 2) / this.cam.zoom + this.cam.x, y: (sy - this.h / 2) / this.cam.zoom + this.cam.y };
  }

  updateCamera(game, dt) {
    const p = game.player;
    const q = CFG.camera;
    // на суше обзор шире: зверь видит дальше клетки
    const tierZoom = 0.86 + q.zoomByTier * (p.tier - 1) * 0.8;
    this.cam.targetZoom = clamp(tierZoom, 0.6, 0.98);
    if (game.tyrant && !game.tyrant.dead) this.cam.targetZoom *= 0.94;
    if (game.event?.id === 'nighthunt') this.cam.targetZoom *= 0.97;
    this.cam.zoom = damp(this.cam.zoom, this.cam.targetZoom, 2.4, dt);

    const base = Math.max(1, Math.abs(p.stats.baseSpeed));
    const look = q.lookAhead / Math.max(0.5, this.cam.zoom * 1.4);
    const tx = p.x + (p.vx / base) * look;
    const ty = p.y + (p.vy / base) * look;
    this.cam.x = damp(this.cam.x, tx + game.shakeX, 6, dt);
    this.cam.y = damp(this.cam.y, ty + game.shakeY, 6, dt);
  }

  // ------------------------------------------------------------------
  draw(game, dt) {
    const ctx = this.ctx;
    const q = this.quality;
    ctx.save();
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.clearRect(0, 0, this.w, this.h);

    const biome = game.biome;
    const tint = BIOME_GROUND[biome] ?? BIOME_GROUND.plain;
    const light = game.lightLevel;

    // --- земля: два слоя градиента, чтобы горизонт дышал.
    // Ночью земля уходит не в чёрный, а в синеву лунного света — иначе карта
    // превращается в чёрный экран, и зверь идёт вслепую.
    const dark = clamp((1 - light) * 0.8, 0, 0.6);
    const grd = ctx.createLinearGradient(0, 0, 0, this.h);
    grd.addColorStop(0, mixHex(tint.a, '#1b2542', dark));
    grd.addColorStop(1, mixHex(tint.b, '#121a2e', dark * 1.05));
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, this.w, this.h);

    // --- мир
    ctx.save();
    ctx.translate(this.w / 2, this.h / 2);
    ctx.scale(this.cam.zoom, this.cam.zoom);
    ctx.translate(-this.cam.x, -this.cam.y);
    const view = this._viewBounds();

    this._drawGroundTexture(ctx, game, view, tint, light, q);
    this._drawPools(ctx, game, view, light);
    this._drawFeatures(ctx, game, view, light, dt);
    this._drawFoods(ctx, game, view, dt);
    this._drawCreatures(ctx, game, view);
    this._drawParticles(ctx, game);
    if (game.player.alive) this._drawPlayer(ctx, game, dt);
    this._drawFloaters(ctx, game);
    this._drawSocialHints(ctx, game);
    ctx.restore();

    // --- погода и тьма
    this._drawRain(ctx, game, dt);
    this._drawNight(ctx, game);
    this._drawBoundary(ctx, game);
    this._drawThreatArrows(ctx, game);
    ctx.restore();
  }

  _viewBounds() {
    const m = 240;
    const hw = this.w / 2 / this.cam.zoom, hh = this.h / 2 / this.cam.zoom;
    return { x0: this.cam.x - hw - m, y0: this.cam.y - hh - m, x1: this.cam.x + hw + m, y1: this.cam.y + hh + m, hw, hh };
  }
  _visible(x, y, r, v) {
    return x + r > v.x0 && x - r < v.x1 && y + r > v.y0 && y - r < v.y1;
  }

  // ---------------------------------------------------------------- земля
  _drawGroundTexture(ctx, game, view, tint, light, q) {
    // пятна травы: детерминированный шум по клеткам, чтобы не мерцало
    const step = 96;
    const x0 = Math.floor(view.x0 / step) * step, y0 = Math.floor(view.y0 / step) * step;
    const veg = q.foodDetail ?? 1;
    ctx.save();
    for (let x = x0; x < view.x1; x += step) {
      for (let y = y0; y < view.y1; y += step) {
        const h = hash01(Math.round(x / step) * 73856093 ^ Math.round(y / step) * 19349663);
        const dens = game.vegetationAt(x + step / 2, y + step / 2);
        if (h > dens * 0.85) continue;
        const cx = x + hash01(Math.round(x) + Math.round(y) * 3) * step;
        const cy = y + hash01(Math.round(x) * 5 + Math.round(y)) * step;
        const r = step * (0.35 + hash01(Math.round(cx) + Math.round(cy) * 7) * 0.5);
        const g2 = ctx.createRadialGradient(cx, cy, r * 0.2, cx, cy, r);
        g2.addColorStop(0, rgba(shade(tint.grass, -0.05 + light * 0.2), 0.34 * (0.4 + light * 0.6)));
        g2.addColorStop(1, rgba(tint.grass, 0));
        ctx.fillStyle = g2;
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.fill();
      }
    }
    // травинки: три пучка на клетку 34 px, только если трава густая
    const tuftStep = 34;
    const tx0 = Math.floor(view.x0 / tuftStep) * tuftStep, ty0 = Math.floor(view.y0 / tuftStep) * tuftStep;
    ctx.lineCap = 'round';
    const maxTufts = Math.round(260 * (q.particles ?? 1) * veg + 120);
    let drawn = 0;
    for (let x = tx0; x < view.x1 && drawn < maxTufts; x += tuftStep) {
      for (let y = ty0; y < view.y1 && drawn < maxTufts; y += tuftStep) {
        const dens = game.vegetationAt(x, y);
        const h = hash01(Math.round(x) ^ (Math.round(y) * 31));
        if (h > dens) continue;
        drawn++;
        const n = 3 + Math.round(dens * 2);
        for (let i = 0; i < n; i++) {
          const hx = x + hash01(Math.round(x) + i * 13) * tuftStep;
          const hy = y + hash01(Math.round(y) + i * 17) * tuftStep;
          const len = 7 + hash01(Math.round(hx) + i) * 9;
          const sway = Math.sin(game.globalTime * 1.6 + hx * 0.03 + hy * 0.02) * 2.6;
          ctx.strokeStyle = rgba(shade(tint.grass, -0.18 + hash01(i + Math.round(hx)) * 0.42), 0.55 + light * 0.3);
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(hx, hy);
          ctx.quadraticCurveTo(hx + sway * 0.4, hy - len * 0.6, hx + sway, hy - len);
          ctx.stroke();
        }
      }
    }
    ctx.restore();
  }

  // ---------------------------------------------------------------- вода
  _drawPools(ctx, game, view, light) {
    for (const f of game.pools) {
      if (!this._visible(f.x, f.y, f.r + 40, view)) continue;
      const fill = clamp(f.water / Math.max(1, f.maxWater), 0.25, 1);
      const r = f.r * (0.72 + fill * 0.28);
      ctx.save();
      // берег
      ctx.fillStyle = rgba('#6a5a44', 0.5);
      ctx.beginPath(); ctx.ellipse(f.x, f.y + 4, r * 1.06, r * 0.8, 0, 0, TAU); ctx.fill();
      // вода
      const g = ctx.createRadialGradient(f.x - r * 0.3, f.y - r * 0.3, r * 0.1, f.x, f.y, r);
      g.addColorStop(0, rgba(mixHex('#7fd6ff', '#dff6ff', light * 0.5), 0.92));
      g.addColorStop(1, rgba('#2a6b8f', 0.92));
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.ellipse(f.x, f.y, r, r * 0.74, 0, 0, TAU); ctx.fill();
      // блик
      ctx.fillStyle = rgba('#ffffff', 0.16 * light);
      ctx.beginPath(); ctx.ellipse(f.x - r * 0.26, f.y - r * 0.24, r * 0.38, r * 0.14, -0.4, 0, TAU); ctx.fill();
      // рябь
      const t = game.globalTime;
      ctx.strokeStyle = rgba('#e8fbff', 0.22);
      ctx.lineWidth = 1.2;
      for (let i = 0; i < 3; i++) {
        const rr = (r * (0.35 + i * 0.22)) * (0.9 + Math.sin(t * 0.8 + i + f.seed) * 0.06);
        ctx.beginPath(); ctx.ellipse(f.x, f.y, rr, rr * 0.7, 0, 0, TAU); ctx.stroke();
      }
      ctx.restore();
    }
  }

  // ---------------------------------------------------------------- постройки
  _drawFeatures(ctx, game, view, light, dt) {
    for (const f of game.features) {
      if (!this._visible(f.x, f.y, f.r + 70, view)) continue;
      switch (f.type) {
        case 'tree': this._drawTree(ctx, game, f, light); break;
        case 'bush': this._drawBush(ctx, game, f, light); break;
        case 'rock': this._drawRock(ctx, f, light); break;
        case 'geyser': this._drawGeyser(ctx, game, f, light); break;
        case 'den': this._drawDen(ctx, game, f, light); break;
        case 'bones': this._drawBones(ctx, f, light); break;
        case 'totem': this._drawTotem(ctx, game, f, light); break;
        case 'throne': this._drawThrone(ctx, game, f, light); break;
        default: break;
      }
    }
  }

  _drawTree(ctx, game, f, light) {
    const sway = Math.sin(game.globalTime * 0.8 + f.seed) * 3.4;
    ctx.save();
    ctx.translate(f.x, f.y);
    ctx.fillStyle = rgba('#000', 0.22);
    ctx.beginPath(); ctx.ellipse(4, f.r * 0.2, f.r * 0.7, f.r * 0.34, 0, 0, TAU); ctx.fill();
    // ствол
    ctx.strokeStyle = rgba('#5a4230', 0.95);
    ctx.lineWidth = Math.max(4, f.r * 0.16);
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(0, f.r * 0.2);
    ctx.quadraticCurveTo(sway * 0.4, -f.r * 0.5, sway, -f.r * 1.1);
    ctx.stroke();
    // крона: три-четыре пятна
    const n = this.quality.particles > 0.5 ? 4 : 3;
    for (let i = 0; i < n; i++) {
      const a = hash01(f.seed + i) * TAU;
      const d = f.r * (0.2 + hash01(f.seed + i * 3) * 0.4);
      const rr = f.r * (0.5 + hash01(f.seed + i * 7) * 0.35);
      const cx = sway + Math.cos(a) * d, cy = -f.r * 1.05 + Math.sin(a) * d * 0.6;
      const g = ctx.createRadialGradient(cx - rr * 0.3, cy - rr * 0.3, rr * 0.2, cx, cy, rr);
      g.addColorStop(0, rgba(mixHex('#8fbf6f', '#ffffff', light * 0.25), 0.95));
      g.addColorStop(1, rgba('#39603a', 0.95));
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(cx, cy, rr, 0, TAU); ctx.fill();
    }
    ctx.restore();
  }

  _drawBush(ctx, game, f, light) {
    const sway = Math.sin(game.globalTime * 1.2 + f.seed) * 1.6;
    ctx.save();
    ctx.translate(f.x, f.y);
    ctx.fillStyle = rgba('#000', 0.18);
    ctx.beginPath(); ctx.ellipse(2, f.r * 0.3, f.r * 0.9, f.r * 0.36, 0, 0, TAU); ctx.fill();
    for (let i = 0; i < 3; i++) {
      const a = hash01(f.seed + i) * TAU;
      const rr = f.r * (0.6 + hash01(f.seed + i * 5) * 0.3);
      const cx = Math.cos(a) * f.r * 0.22 + sway, cy = Math.sin(a) * f.r * 0.18;
      ctx.fillStyle = rgba(i % 2 ? '#4f7a44' : '#679a52', 0.95);
      ctx.beginPath(); ctx.arc(cx, cy, rr, 0, TAU); ctx.fill();
    }
    ctx.restore();
  }

  _drawRock(ctx, f, light) {
    ctx.save();
    ctx.translate(f.x, f.y);
    ctx.fillStyle = rgba('#000', 0.25);
    ctx.beginPath(); ctx.ellipse(3, f.r * 0.28, f.r * 0.98, f.r * 0.36, 0, 0, TAU); ctx.fill();
    const g = ctx.createLinearGradient(-f.r, -f.r, f.r, f.r);
    g.addColorStop(0, rgba('#b6b0a8', 0.98));
    g.addColorStop(1, rgba('#5f5b56', 0.98));
    ctx.fillStyle = g;
    ctx.beginPath();
    const pts = 7;
    for (let i = 0; i <= pts; i++) {
      const a = (i / pts) * TAU;
      const rr = f.r * (0.72 + hash01(f.seed + i) * 0.4);
      const x = Math.cos(a) * rr, y = Math.sin(a) * rr * 0.72;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.closePath(); ctx.fill();
    // мох на камне
    ctx.fillStyle = rgba('#7f9a5a', 0.4 * light);
    ctx.beginPath(); ctx.ellipse(-f.r * 0.2, -f.r * 0.2, f.r * 0.42, f.r * 0.22, 0.3, 0, TAU); ctx.fill();
    ctx.restore();
  }

  _drawGeyser(ctx, game, f, light) {
    const blow = clamp(f.blow ?? 0, 0, 1.4);
    ctx.save();
    ctx.translate(f.x, f.y);
    // каменный кратер
    ctx.fillStyle = rgba('#7a736a', 0.95);
    ctx.beginPath(); ctx.ellipse(0, 0, f.r, f.r * 0.62, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = rgba('#3a3630', 0.95);
    ctx.beginPath(); ctx.ellipse(0, 0, f.r * 0.55, f.r * 0.32, 0, 0, TAU); ctx.fill();
    if (blow > 0) {
      ctx.fillStyle = rgba('#fff0d8', 0.5 * blow);
      ctx.beginPath(); ctx.ellipse(0, -f.r * blow * 1.6, f.r * 0.5 * blow, f.r * 1.1 * blow, 0, 0, TAU); ctx.fill();
    } else if (Math.sin(game.globalTime * 1.2 + f.seed) > 0.6) {
      ctx.fillStyle = rgba('#ffd8a0', 0.25);
      ctx.beginPath(); ctx.ellipse(0, -f.r * 0.4, f.r * 0.3, f.r * 0.4, 0, 0, TAU); ctx.fill();
    }
    ctx.restore();
  }

  _drawDen(ctx, game, f, light) {
    ctx.save();
    ctx.translate(f.x, f.y);
    // земляной холм вокруг входа
    const g = ctx.createRadialGradient(0, -f.r * 0.2, f.r * 0.2, 0, 0, f.r);
    g.addColorStop(0, rgba('#6d5a41', 0.95));
    g.addColorStop(1, rgba('#4a3d2c', 0.75));
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.ellipse(0, f.r * 0.1, f.r * 0.85, f.r * 0.56, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = rgba('#241d16', 0.95);
    ctx.beginPath(); ctx.ellipse(0, f.r * 0.14, f.r * 0.38, f.r * 0.3, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = rgba('#0e0b08', 0.95);
    ctx.beginPath(); ctx.ellipse(0, f.r * 0.16, f.r * 0.26, f.r * 0.2, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = rgba('#8b8172', 0.9);
    for (let i = 0; i < 6; i++) {
      const a = hash01(f.seed + i) * TAU;
      ctx.beginPath();
      ctx.ellipse(Math.cos(a) * f.r * 0.5, f.r * 0.12 + Math.sin(a) * f.r * 0.32, f.r * 0.12, f.r * 0.08, a, 0, TAU);
      ctx.fill();
    }
    ctx.restore();
  }

  _drawBones(ctx, f, light) {
    ctx.save();
    ctx.translate(f.x, f.y);
    ctx.strokeStyle = rgba('#e8eef0', 0.9);
    ctx.lineWidth = Math.max(2, f.r * 0.07);
    ctx.lineCap = 'round';
    // рёбра
    for (let i = 0; i < 5; i++) {
      const x = (-0.6 + i * 0.3) * f.r;
      ctx.beginPath();
      ctx.moveTo(x, -f.r * 0.3);
      ctx.quadraticCurveTo(x + f.r * 0.1, 0, x, f.r * 0.3);
      ctx.stroke();
    }
    ctx.beginPath(); ctx.moveTo(-f.r * 0.75, 0); ctx.lineTo(f.r * 0.75, 0); ctx.stroke();
    ctx.restore();
  }

  _drawTotem(ctx, game, f, light) {
    const p = game.player;
    const sworn = p?.flags?.sworn ?? 0;
    const pulse = 0.6 + Math.sin(game.globalTime * 1.4) * 0.15;
    ctx.save();
    ctx.translate(f.x, f.y);
    // круглая площадка
    ctx.fillStyle = rgba('#3a3226', 0.55);
    ctx.beginPath(); ctx.ellipse(0, f.r * 0.36, f.r * 1.1, f.r * 0.42, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = rgba('#c9ffd8', 0.35);
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.ellipse(0, f.r * 0.36, f.r * 0.95, f.r * 0.34, 0, 0, TAU); ctx.stroke();
    // столб
    const g = ctx.createLinearGradient(-f.r * 0.2, -f.r, f.r * 0.2, 0);
    g.addColorStop(0, rgba('#c9b48a', 0.98));
    g.addColorStop(1, rgba('#7a6444', 0.98));
    ctx.fillStyle = g;
    ctx.fillRect(-f.r * 0.18, -f.r * 1.1, f.r * 0.36, f.r * 1.4);
    // знаки видов
    for (let i = 0; i < 3; i++) {
      ctx.fillStyle = rgba(i < sworn ? '#9fe6a0' : '#6a6250', 0.95);
      ctx.beginPath(); ctx.arc(0, -f.r * (0.9 - i * 0.3), f.r * 0.1, 0, TAU); ctx.fill();
    }
    // связка перьев наверху
    ctx.strokeStyle = rgba('#ffd9a0', 0.9);
    ctx.lineWidth = 2;
    for (let i = -1; i <= 1; i++) {
      ctx.beginPath();
      ctx.moveTo(0, -f.r * 1.1);
      ctx.quadraticCurveTo(i * f.r * 0.4, -f.r * 1.5, i * f.r * 0.55, -f.r * 1.7);
      ctx.stroke();
    }
    ctx.fillStyle = rgba('#9fe6a0', 0.22 * pulse);
    ctx.beginPath(); ctx.arc(0, 0, f.r * 1.4, 0, TAU); ctx.fill();
    ctx.restore();
  }

  _drawThrone(ctx, game, f, light) {
    ctx.save();
    ctx.translate(f.x, f.y);
    ctx.fillStyle = rgba('#2a241f', 0.6);
    ctx.beginPath(); ctx.ellipse(0, f.r * 0.4, f.r * 1.15, f.r * 0.45, 0, 0, TAU); ctx.fill();
    // спинка из рёбер
    ctx.strokeStyle = rgba('#e2e8ea', 0.85);
    ctx.lineWidth = Math.max(3, f.r * 0.07);
    for (let i = -3; i <= 3; i++) {
      ctx.beginPath();
      ctx.moveTo(i * f.r * 0.16, f.r * 0.2);
      ctx.quadraticCurveTo(i * f.r * 0.34, -f.r * 0.5, i * f.r * 0.22, -f.r * 1.05);
      ctx.stroke();
    }
    ctx.fillStyle = rgba('#141014', 0.9);
    ctx.beginPath(); ctx.ellipse(0, f.r * 0.1, f.r * 0.5, f.r * 0.3, 0, 0, TAU); ctx.fill();
    if (game.tyrant && !game.tyrant.dead) {
      ctx.fillStyle = rgba('#ff7f5c', 0.16);
      ctx.beginPath(); ctx.arc(0, 0, f.r * 2, 0, TAU); ctx.fill();
    }
    ctx.restore();
  }

  // ---------------------------------------------------------------- еда
  _drawFoods(ctx, game, view, dt) {
    const detail = this.quality.foodDetail ?? 1;
    for (const f of game.foods) {
      if (f.dead) continue;
      const kind = LAND_FOOD_KINDS[f.kind];
      if (!kind) continue;
      if (!this._visible(f.x, f.y, 18, view)) continue;
      ctx.save();
      ctx.translate(f.x, f.y);
      const r = kind.r * f.scale * (0.85 + Math.sin(game.globalTime * 2 + f.x * 0.05) * 0.06);
      ctx.fillStyle = rgba('#000', 0.2);
      ctx.beginPath(); ctx.ellipse(1, r * 0.5, r * 0.9, r * 0.4, 0, 0, TAU); ctx.fill();
      switch (f.kind) {
        case 'fruit':
          ctx.fillStyle = kind.color;
          ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill();
          if (detail > 0.6) {
            ctx.fillStyle = rgba(kind.color2, 0.75);
            ctx.beginPath(); ctx.arc(-r * 0.3, -r * 0.3, r * 0.34, 0, TAU); ctx.fill();
            ctx.strokeStyle = rgba('#5f7a3a', 0.9); ctx.lineWidth = Math.max(1, r * 0.18);
            ctx.beginPath(); ctx.moveTo(0, -r * 0.8); ctx.lineTo(r * 0.3, -r * 1.4); ctx.stroke();
          }
          break;
        case 'berry':
          for (let i = 0; i < 3; i++) {
            const a = (i / 3) * TAU + f.x * 0.01;
            ctx.fillStyle = i % 2 ? kind.color : kind.color2;
            ctx.beginPath(); ctx.arc(Math.cos(a) * r * 0.5, Math.sin(a) * r * 0.5, r * 0.58, 0, TAU); ctx.fill();
          }
          break;
        case 'nut':
          ctx.fillStyle = kind.color;
          ctx.beginPath(); ctx.ellipse(0, 0, r, r * 0.78, 0.4, 0, TAU); ctx.fill();
          ctx.fillStyle = rgba('#7a5a2a', 0.7);
          ctx.beginPath(); ctx.ellipse(0, -r * 0.1, r * 0.5, r * 0.3, 0.4, 0, TAU); ctx.fill();
          break;
        case 'meat':
          ctx.fillStyle = kind.color;
          ctx.beginPath(); ctx.ellipse(0, 0, r, r * 0.7, f.x * 0.02, 0, TAU); ctx.fill();
          ctx.fillStyle = rgba('#c2402f', 0.6);
          ctx.beginPath(); ctx.ellipse(r * 0.2, r * 0.1, r * 0.34, r * 0.22, 0, 0, TAU); ctx.fill();
          break;
        case 'egg':
          ctx.fillStyle = kind.color;
          ctx.beginPath(); ctx.ellipse(0, 0, r * 0.8, r, 0, 0, TAU); ctx.fill();
          ctx.fillStyle = rgba('#ffffff', 0.5);
          ctx.beginPath(); ctx.arc(-r * 0.2, -r * 0.34, r * 0.26, 0, TAU); ctx.fill();
          break;
        case 'bone':
          ctx.strokeStyle = rgba('#f2f7fa', 0.95);
          ctx.lineWidth = Math.max(2, r * 0.3);
          ctx.lineCap = 'round';
          ctx.beginPath(); ctx.moveTo(-r * 0.8, r * 0.2); ctx.lineTo(r * 0.8, -r * 0.2); ctx.stroke();
          ctx.beginPath(); ctx.arc(-r * 0.8, r * 0.2, r * 0.34, 0, TAU); ctx.stroke();
          ctx.beginPath(); ctx.arc(r * 0.8, -r * 0.2, r * 0.34, 0, TAU); ctx.stroke();
          break;
        default:
          ctx.fillStyle = kind.color;
          ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill();
      }
      ctx.restore();
    }
  }

  // ---------------------------------------------------------------- существа
  _drawCreatures(ctx, game, view) {
    const list = [...game.creatures].sort((a, b) => a.y - b.y);
    for (const c of list) {
      if (c.dead) continue;
      if (!this._visible(c.x, c.y, c.r * 2.4, view)) continue;
      const spec = c._spec ?? (c._spec = specFromSpecies(c.sp, {
        x: c.x, y: c.y, r: c.r, heading: c.heading, seed: c.id, walkPhase: c.walk,
        walkAmp: clamp(Math.hypot(c.vx, c.vy) / Math.max(20, c.speed), 0, 1.6),
        flash: c.flash, alpha: 1,
      }));
      spec.x = c.x; spec.y = c.y; spec.r = c.r; spec.heading = c.heading;
      spec.walkPhase = c.walk; spec.flash = c.flash;
      spec.walkAmp = clamp(Math.hypot(c.vx, c.vy) / Math.max(20, c.speed), 0, 1.6);
      spec.wings = c.sp.plan === 'bird' && c.flee ? 1 : 0;
      if (c.hp < c.maxHp) this._drawHpBar(ctx, c);
      if (c.ally) {
        ctx.strokeStyle = rgba('#9fe6a0', 0.5);
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(c.x, c.y, c.r * 1.5, 0, TAU); ctx.stroke();
      }
      if (c.socialWith > 0) {
        ctx.strokeStyle = rgba('#ffd9f0', 0.7);
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(c.x, c.y, c.r * 1.7, 0, TAU); ctx.stroke();
      }
      if (c.stun > 0) {
        ctx.fillStyle = rgba('#ffe6a0', 0.8);
        for (let i = 0; i < 3; i++) {
          const a = game.globalTime * 4 + i * 2.1;
          ctx.beginPath(); ctx.arc(c.x + Math.cos(a) * c.r, c.y - c.r * 1.2 + Math.sin(a) * 4, 2.4, 0, TAU); ctx.fill();
        }
      }
      drawCreature(ctx, spec, game.globalTime);
    }
  }

  _drawHpBar(ctx, c) {
    const w = c.r * 1.7, h = 3.4;
    const x = c.x - w / 2, y = c.y - c.r * 1.5 - 8;
    ctx.fillStyle = rgba('#000', 0.45);
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = c.boss ? '#ff7f5c' : c.ally ? '#9fe6a0' : '#ff9f8f';
    ctx.fillRect(x, y, w * clamp(c.hp / c.maxHp, 0, 1), h);
  }

  _drawPlayer(ctx, game, dt) {
    const p = game.player;
    const spec = p._spec ?? (p._spec = specFromPlayer(p, {}));
    spec.x = p.x; spec.y = p.y; spec.r = p.r; spec.heading = p.heading;
    spec.walkPhase = p.walking; spec.flash = p.hitFlash;
    spec.walkAmp = clamp(Math.hypot(p.vx, p.vy) / Math.max(20, p.stats.baseSpeed), 0, 1.6);
    spec.features = new Set(p.features ?? []);
    spec.lvls = p.featureLvls ?? {};
    spec.alpha = p.invuln > 0 ? 0.65 + Math.sin(game.globalTime * 22) * 0.2 : 1;
    spec.wings = p.dashTime > 0 ? 1 : (p.parts.wings ? 0.25 : 0);
    if (p.stun > 0) {
      ctx.fillStyle = rgba('#ffe6a0', 0.8);
      for (let i = 0; i < 4; i++) {
        const a = game.globalTime * 5 + i * 1.6;
        ctx.beginPath(); ctx.arc(p.x + Math.cos(a) * p.r, p.y - p.r * 1.3 + Math.sin(a) * 5, 2.6, 0, TAU); ctx.fill();
      }
    }
    if (p.resting) {
      ctx.fillStyle = rgba('#9fe6ff', 0.7);
      ctx.font = '16px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText('z z z', p.x + p.r, p.y - p.r - 14);
    }
    drawCreature(ctx, spec, game.globalTime);
  }

  // Частицы и всплывающие числа: данные общие (effects.js), рисует каждая стадия по-своему.
  _drawParticles(ctx, game) {
    for (const q of game.particles) {
      const a = clamp(q.life / q.maxLife, 0, 1);
      if (q.kind === 'ring') {
        ctx.strokeStyle = rgba(q.color, a * 0.7);
        ctx.lineWidth = 2.4;
        ctx.beginPath(); ctx.arc(q.x, q.y, q.size * (2 - a), 0, TAU); ctx.stroke();
        continue;
      }
      ctx.fillStyle = rgba(q.color, q.kind === 'dust' ? a * 0.7 : a);
      if (q.kind === 'leaf') {
        ctx.save();
        ctx.translate(q.x, q.y);
        ctx.rotate(q.x * 0.05 + game.globalTime);
        ctx.beginPath(); ctx.ellipse(0, 0, q.size * 1.6, q.size * 0.7, 0, 0, TAU); ctx.fill();
        ctx.restore();
        continue;
      }
      ctx.beginPath();
      ctx.arc(q.x, q.y, q.size * (0.6 + a * 0.6), 0, TAU);
      ctx.fill();
    }
  }

  _drawFloaters(ctx, game) {
    ctx.textAlign = 'center';
    for (const f of game.floaters) {
      const a = clamp(f.life / f.maxLife, 0, 1);
      ctx.font = `bold ${f.size}px system-ui, -apple-system, sans-serif`;
      ctx.fillStyle = rgba(f.color, a);
      ctx.fillText(f.text, f.x, f.y);
    }
  }

  _drawSocialHints(ctx, game) {
    const c = game.player.social?.target;
    if (!c || c.dead) return;
    const sp = c.sp;
    const needed = game.player.social.seq[game.player.social.step];
    const liked = sp.social.likes.includes(needed);
    const pulse = 0.6 + Math.sin(game.globalTime * 5) * 0.3;
    ctx.save();
    ctx.strokeStyle = rgba(liked ? '#9fe6a0' : '#ffd0a0', pulse);
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(c.x, c.y, c.r * 2, 0, TAU); ctx.stroke();
    ctx.fillStyle = rgba(liked ? '#9fe6a0' : '#ffd0a0', 0.95);
    ctx.font = 'bold 15px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText(liked ? '♥' : '♪', c.x, c.y - c.r * 2.2);
    // таймер шага
    const frac = clamp(game.player.social.timer / CFG.land.social.stepTime, 0, 1);
    ctx.fillStyle = rgba('#000', 0.4);
    ctx.fillRect(c.x - c.r, c.y + c.r * 1.7, c.r * 2, 4);
    ctx.fillStyle = rgba('#ffd9f0', 0.9);
    ctx.fillRect(c.x - c.r, c.y + c.r * 1.7, c.r * 2 * frac, 4);
    ctx.restore();
  }

  // ---------------------------------------------------------------- погода, тьма, край
  _drawRain(ctx, game, dt) {
    if (!game.raining) return;
    const q = this.quality;
    if (q.particles <= 0.3) {
      ctx.fillStyle = rgba('#8fd0ff', 0.12);
      ctx.fillRect(0, 0, this.w, this.h);
      return;
    }
    ctx.save();
    ctx.strokeStyle = rgba('#bfe8ff', 0.34);
    ctx.lineWidth = 1.4;
    const t = game.globalTime;
    const n = Math.round(90 * q.particles) + 40;
    for (let i = 0; i < n; i++) {
      const seed = i * 97;
      const x = ((seed * 13 + t * 120) % (this.w + 120)) - 60;
      const y = ((seed * 31 + t * 900) % (this.h + 160)) - 80;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - 6, y + 22);
      ctx.stroke();
    }
    ctx.fillStyle = rgba('#7fb8d8', 0.06);
    ctx.fillRect(0, 0, this.w, this.h);
    ctx.restore();
  }

  _drawNight(ctx, game) {
    const light = game.lightLevel;
    if (light >= 0.45) return;
    const p = game.player;
    const dark = clamp((0.45 - light) * 1.0, 0, 0.45);
    // Затемнение рисуется ОДНИМ радиальным градиентом: за пределами круга градиент
    // продолжается последним цветом, поэтому вся карта ночью тёмная, а вокруг зверя — свет.
    const out = { x: 0, y: 0 };
    this.worldToScreen(p.x, p.y, out);
    const vision = (p.stats.vision * 0.5 + p.stats.nightVision * 360) * this.cam.zoom;
    ctx.save();
    const g = ctx.createRadialGradient(out.x, out.y, vision * 0.3, out.x, out.y, vision);
    g.addColorStop(0, 'rgba(4,7,15,0)');
    g.addColorStop(0.75, `rgba(4,7,15,${dark * 0.7})`);
    g.addColorStop(1, `rgba(4,7,15,${dark})`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, this.w, this.h);
    ctx.restore();
  }

  _drawBoundary(ctx, game) {
    const R = game.radius;
    const out = { x: 0, y: 0 };
    this.worldToScreen(0, 0, out);
    const rr = R * this.cam.zoom;
    ctx.save();
    // обрыв: тёмное кольцо снаружи и «каменная» кромка
    ctx.beginPath();
    ctx.rect(0, 0, this.w, this.h);
    ctx.arc(out.x, out.y, rr, 0, TAU, true);
    ctx.fillStyle = rgba('#0a0d12', 0.88);
    ctx.fill('evenodd');
    ctx.beginPath();
    ctx.arc(out.x, out.y, rr, 0, TAU);
    ctx.strokeStyle = rgba('#c9c0ae', 0.5);
    ctx.lineWidth = 6;
    ctx.stroke();
    ctx.setLineDash([14, 10]);
    ctx.strokeStyle = rgba('#ffd9a0', 0.35);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(out.x, out.y, rr - 12, 0, TAU);
    ctx.stroke();
    ctx.restore();
  }

  _drawThreatArrows(ctx, game) {
    const p = game.player;
    if (!p.alive) return;
    const out = { x: 0, y: 0 };
    this.worldToScreen(p.x, p.y, out);
    const margin = 34;
    for (const c of game.creaturesNear(p.x, p.y, 900)) {
      if (c.dead || c.ally || c.boss) continue;
      if (!c.huntPlayer && c.sp.family !== LAND_FAMILY.PREDATOR) continue;
      const s = this.worldToScreen(c.x, c.y, { x: 0, y: 0 });
      const onScreen = s.x > 0 && s.x < this.w && s.y > 0 && s.y < this.h;
      if (onScreen) continue;
      const a = Math.atan2(s.y - out.y, s.x - out.x);
      const hw = this.w / 2 - margin, hh = this.h / 2 - margin;
      const k = Math.min(hw / Math.abs(Math.cos(a) || 1e-6), hh / Math.abs(Math.sin(a) || 1e-6));
      const x = out.x + Math.cos(a) * k, y = out.y + Math.sin(a) * k;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(a);
      ctx.fillStyle = rgba(c.boss ? '#ff6b6b' : '#ff9f8f', 0.85);
      ctx.beginPath(); ctx.moveTo(9, 0); ctx.lineTo(-7, 6); ctx.lineTo(-7, -6); ctx.closePath(); ctx.fill();
      ctx.restore();
    }
  }

  // ---------------------------------------------------------------- радар
  drawRadar(canvas, game) {
    const ctx = canvas.getContext('2d');
    const size = canvas.width;
    const R = game.radius;
    ctx.clearRect(0, 0, size, size);
    ctx.save();
    ctx.beginPath(); ctx.arc(size / 2, size / 2, size / 2 - 2, 0, TAU); ctx.clip();
    ctx.fillStyle = rgba('#0d1a14', 0.92);
    ctx.fillRect(0, 0, size, size);
    const k = (size / 2 - 4) / R;
    const px = (x) => size / 2 + x * k;
    const py = (y) => size / 2 + y * k;

    // биомы кольцами
    const rings = [['#b6c77a', 0.26], ['#6f8f5c', 0.56], ['#9a938c', 0.8]];
    for (const [color, frac] of rings) {
      ctx.fillStyle = rgba(color, 0.14);
      ctx.beginPath(); ctx.arc(size / 2, size / 2, R * frac * k, 0, TAU); ctx.fill();
    }
    // водоёмы
    ctx.fillStyle = rgba('#7fd6ff', 0.75);
    for (const f of game.pools) {
      ctx.beginPath(); ctx.arc(px(f.x), py(f.y), Math.max(1.6, f.r * k), 0, TAU); ctx.fill();
    }
    // тотем и трон
    ctx.fillStyle = rgba('#9fe6a0', 0.95);
    ctx.beginPath(); ctx.arc(px(0), py(0), 3.4, 0, TAU); ctx.fill();
    if (game.throne) {
      ctx.strokeStyle = rgba('#ff7f5c', 0.9);
      ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.arc(px(game.throne.x), py(game.throne.y), 4, 0, TAU); ctx.stroke();
    }
    // существа
    for (const c of game.creatures) {
      if (c.dead) continue;
      const d = dist(c.x, c.y, game.player.x, game.player.y);
      const range = 1100 + (game.player.stats.radar ?? 0) * 900;
      if (d > range) continue;
      let color = '#dff6ff';
      if (c.ally) color = '#9fe6a0';
      else if (c.boss) color = '#ff6b6b';
      else if (c.sp.family === LAND_FAMILY.PREDATOR) color = '#ff9f8f';
      else if (c.sp.family === LAND_FAMILY.HERD || c.sp.family === LAND_FAMILY.GRAZER) color = '#ffe6a0';
      ctx.fillStyle = rgba(color, 0.9);
      ctx.beginPath(); ctx.arc(px(c.x), py(c.y), c.boss ? 3.4 : 1.8, 0, TAU); ctx.fill();
    }
    // кладки костей
    if (game.player.stats.waterSense > 0) {
      ctx.fillStyle = rgba('#e6eef2', 0.9);
      for (const f of game.features) {
        if (f.type !== 'bones') continue;
        ctx.beginPath(); ctx.arc(px(f.x), py(f.y), 2, 0, TAU); ctx.fill();
      }
    }
    // игрок
    const p = game.player;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(px(p.x), py(p.y), 2.6, 0, TAU); ctx.fill();
    ctx.strokeStyle = rgba('#ffffff', 0.8);
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(px(p.x), py(p.y));
    ctx.lineTo(px(p.x) + Math.cos(p.heading) * 7, py(p.y) + Math.sin(p.heading) * 7);
    ctx.stroke();
    ctx.restore();
  }
}

// Превью зверя в редакторе генома: тот же рисовальщик, что и в игре.
export function drawLandPreview(canvas, p, t) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  const g = ctx.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, w * 0.6);
  g.addColorStop(0, rgba(p.color ?? '#8fd8b0', 0.22));
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  const scale = Math.min(w / 420, h / 260) * 1.1;
  const spec = specFromPlayer(p, {
    x: w / 2, y: h / 2 + h * 0.1, r: 40 * scale, heading: -Math.PI / 2,
    walkPhase: t * 4, walkAmp: 0.5,
  });
  drawCreature(ctx, spec, t);
}
