// render.js — отрисовка мира: фон, параллакс, объекты, существа, радар.
// Никакой логики — только чтение состояния game.

import { CFG } from './config.js';
import { clamp, damp, rgba, shade, mixHex, hash01, TAU, dist, lerp } from './util.js';
import { drawCell, drawFood, drawParticle } from './cellrender.js';
import { FOOD_KINDS, BIOMES } from './species.js';
import { PARTS } from './parts.js';

const BIOME_TINT = {
  shallows: { top: '#0b5c7a', bottom: '#03202f', fog: '#0a4a63' },
  reef: { top: '#0a4257', bottom: '#04182a', fog: '#083b4d' },
  trench: { top: '#062a3d', bottom: '#020f1c', fog: '#05243a' },
  abyss: { top: '#03121f', bottom: '#01070e', fog: '#031420' },
};

export class Renderer {
  constructor(canvas, settings) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false });
    this.settings = settings;
    this.cam = { x: 0, y: 0, zoom: 1, targetZoom: 1 };
    this.snow = [];
    this.dpr = 1;
    this.w = 0; this.h = 0;
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
    this._makeSnow();
  }

  _makeSnow() {
    const q = this.quality;
    const n = Math.round(150 * q.particles);
    this.snow = [];
    for (let i = 0; i < n; i++) {
      this.snow.push({
        x: Math.random() * 2 - 1, y: Math.random() * 2 - 1,
        z: 0.2 + Math.random() * 0.8,
        r: 0.6 + Math.random() * 2.4,
        a: 0.05 + Math.random() * 0.22,
        ph: Math.random() * TAU,
        relic: Math.random() < 0.06,
      });
    }
  }

  // ------------------------------------------------------------------
  worldToScreen(x, y, out) {
    const c = this.cam;
    out.x = (x - c.x) * c.zoom + this.w / 2;
    out.y = (y - c.y) * c.zoom + this.h / 2;
    return out;
  }
  screenToWorld(sx, sy) {
    const c = this.cam;
    return { x: (sx - this.w / 2) / c.zoom + c.x, y: (sy - this.h / 2) / c.zoom + c.y };
  }

  updateCamera(game, dt) {
    const p = game.player;
    const q = CFG.camera;
    const tierZoom = q.zoom + q.zoomByTier * (p.tier - 1);
    this.cam.targetZoom = clamp(tierZoom, q.zoomRange[0], q.zoomRange[1]);
    // в шторм/бой камеру слегка отдаляем
    if (game.event?.id === 'tide') this.cam.targetZoom *= 0.97;
    if (game.boss) this.cam.targetZoom *= 0.96;
    this.cam.zoom = damp(this.cam.zoom, this.cam.targetZoom, 2.4, dt);

    const look = q.lookAhead / Math.max(0.5, this.cam.zoom * 1.4);
    const tx = p.x + (p.vx / Math.max(1, Math.abs(p.stats.baseSpeed))) * look;
    const ty = p.y + (p.vy / Math.max(1, Math.abs(p.stats.baseSpeed))) * look;
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
    const tint = BIOME_TINT[biome] ?? BIOME_TINT.shallows;
    const light = game.lightLevel;

    // --- базовый градиент воды
    const top = mixHex(tint.top, '#02060c', clamp(1 - light * 1.15, 0, 0.92));
    const bottom = mixHex(tint.bottom, '#010409', clamp(1 - light, 0, 0.85));
    const grd = ctx.createLinearGradient(0, 0, 0, this.h);
    grd.addColorStop(0, top);
    grd.addColorStop(1, bottom);
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, this.w, this.h);

    // --- каустика/лучи света сверху (только в светлых биомах)
    if (q.caustics && light > 0.35) {
      ctx.save();
      ctx.globalAlpha = clamp((light - 0.35) * 0.9, 0, 0.5);
      const t = game.globalTime;
      ctx.strokeStyle = rgba('#bff3ff', 0.055);
      ctx.lineWidth = 70;
      for (let i = 0; i < 7; i++) {
        const x = ((i / 7) + Math.sin(t * 0.06 + i) * 0.03) * this.w;
        ctx.beginPath();
        ctx.moveTo(x - 90, -40);
        ctx.lineTo(x + 120 + Math.sin(t * 0.14 + i) * 40, this.h * 0.85);
        ctx.stroke();
      }
      ctx.restore();
    }

    // --- параллакс: морской снег (три слоя)
    ctx.save();
    const deep = clamp(1 - light, 0, 1);
    for (const s of this.snow) {
      const par = 0.25 + s.z * 0.6;
      const px = (s.x * this.w * 0.5 - this.cam.x * par * this.cam.zoom * 0.35) % this.w;
      const py = (s.y * this.h * 0.5 - this.cam.y * par * this.cam.zoom * 0.35) % this.h;
      const x = (px + this.w) % this.w, y = (py + this.h) % this.h;
      const tw = 0.6 + Math.sin(game.globalTime * 2 + s.ph) * 0.4;
      // в темноте выживают только светящиеся организмы
      const biolum = s.relic ? 1 : 0;
      const a = s.a * tw * (0.4 + light * 0.8 + biolum * deep * 1.5);
      const rad = s.r * (0.6 + s.z) * (1 + biolum * deep * 0.8);
      if (biolum && deep > 0.4) {
        const g = ctx.createRadialGradient(x, y, 0, x, y, rad * 6);
        g.addColorStop(0, rgba('#d8c4ff', a * 0.9));
        g.addColorStop(1, rgba('#7f6bff', 0));
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(x, y, rad * 6, 0, TAU); ctx.fill();
      }
      ctx.fillStyle = rgba(s.relic ? '#e2d2ff' : '#cfefff', a);
      ctx.beginPath(); ctx.arc(x, y, rad, 0, TAU); ctx.fill();
    }
    ctx.restore();

    // --- мир
    ctx.save();
    ctx.translate(this.w / 2, this.h / 2);
    ctx.scale(this.cam.zoom, this.cam.zoom);
    ctx.translate(-this.cam.x, -this.cam.y);
    const view = this._viewBounds();

    this._drawFeatures(ctx, game, view);
    this._drawEventOverlays(ctx, game, view);
    this._drawFoods(ctx, game, view, dt);
    this._drawProjectiles(ctx, game);
    this._drawCreatures(ctx, game, view);
    this._drawParticles(ctx, game);
    if (game.player.alive) this._drawPlayer(ctx, game);
    this._drawFloaters(ctx, game);
    ctx.restore();

    // --- граница океана (плёнка)
    this._drawBoundary(ctx, game);
    // --- индикаторы угроз за экраном
    this._drawThreatArrows(ctx, game);
    // --- затемнение в глубине
    if (light < 0.4) {
      ctx.fillStyle = rgba('#000308', clamp((0.4 - light) * 1.0, 0, 0.38));
      ctx.fillRect(0, 0, this.w, this.h);
    }
    ctx.restore();
  }

  _viewBounds() {
    const c = this.cam;
    const hw = this.w / 2 / c.zoom, hh = this.h / 2 / c.zoom;
    return { x0: c.x - hw, y0: c.y - hh, x1: c.x + hw, y1: c.y + hh, hw, hh };
  }

  _visible(x, y, r, view) {
    return x + r > view.x0 && x - r < view.x1 && y + r > view.y0 && y - r < view.y1;
  }

  // ------------------------------------------------------------------
  _drawFeatures(ctx, game, view) {
    const t = game.globalTime;
    for (const f of game.features) {
      if (!this._visible(f.x, f.y, f.r + 40, view)) continue;
      switch (f.type) {
        case 'rock': {
          ctx.save(); ctx.translate(f.x, f.y);
          const lobes = 2 + Math.floor(hash01(f.seed * 3.1) * 2);
          const depth = f.biome === 'abyss' ? 0 : f.biome === 'trench' ? 0.18 : f.biome === 'reef' ? 0.34 : 0.5;
          const baseA = 0.62 + depth * 0.35;
          ctx.beginPath(); ctx.ellipse(f.r * 0.12, f.r * 0.16, f.r * 1.02, f.r * 0.82, 0, 0, TAU);
          ctx.fillStyle = `rgba(0,0,0,${0.28 * baseA})`; ctx.fill();
          for (let l = 0; l < lobes; l++) {
            const la = hash01(f.seed + l * 17) * TAU;
            const ld = f.r * (l === 0 ? 0 : 0.22 + hash01(f.seed + l * 5) * 0.22);
            const lr = f.r * (l === 0 ? 0.8 : 0.55 + hash01(f.seed + l * 11) * 0.25) * 0.86;
            const lx = Math.cos(la) * ld, ly = Math.sin(la) * ld;
            const g2 = ctx.createRadialGradient(lx - lr * 0.35, ly - lr * 0.5, lr * 0.08, lx, ly, lr * 1.1);
            const top = mixHex('#33454f', '#0a141c', 1 - depth * 0.8);
            const bot = mixHex('#16232c', '#050a10', 1 - depth * 0.6);
            g2.addColorStop(0, rgba(top, baseA));
            g2.addColorStop(1, rgba(bot, Math.min(1, baseA + 0.2)));
            ctx.fillStyle = g2;
            ctx.beginPath();
            for (let i = 0; i <= 12; i++) {
              const a = (i / 12) * TAU;
              const rr = lr * (0.76 + 0.26 * hash01(f.seed + i * 7 + l * 31));
              const px = lx + Math.cos(a) * rr, py = ly + Math.sin(a) * rr * 0.84;
              i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
            }
            ctx.closePath(); ctx.fill();
            ctx.strokeStyle = `rgba(178,222,240,${0.06 + depth * 0.10})`;
            ctx.lineWidth = 2.2;
            ctx.beginPath();
            ctx.arc(lx, ly, lr * 0.9, Math.PI * 1.08, Math.PI * 1.92);
            ctx.stroke();
            if (l === 0) {
              ctx.strokeStyle = `rgba(0,0,0,${0.22 * baseA})`;
              ctx.lineWidth = 1.6;
              for (let k = 0; k < 3; k++) {
                const a0 = hash01(f.seed + k * 23) * TAU;
                ctx.beginPath();
                ctx.moveTo(Math.cos(a0) * lr * 0.2, Math.sin(a0) * lr * 0.2);
                ctx.lineTo(Math.cos(a0 + 0.5) * lr * 0.6, Math.sin(a0 + 0.5) * lr * 0.5);
                ctx.stroke();
              }
            }
          }
          ctx.restore();
          break;
        }
        case 'reef': {
          ctx.save(); ctx.translate(f.x, f.y);
          const depthR = f.biome === 'abyss' ? 0.12 : f.biome === 'trench' ? 0.45 : f.biome === 'reef' ? 0.85 : 1;
          const kind = Math.floor(hash01(f.seed * 1.7) * 3);   // 0 — кустистый, 1 — трубчатый, 2 — веерный
          const sway = Math.sin(t * 0.5 + f.seed) * 0.06;
          ctx.rotate(hash01(f.seed) * 0.7 + sway);
          if (kind === 0) {
            const n = 6 + Math.floor(hash01(f.seed) * 5);
            for (let i = 0; i < n; i++) {
              const a = (i / n) * TAU + hash01(f.seed + i) * 0.5;
              const len = f.r * (0.45 + hash01(f.seed + i * 3) * 0.75);
              const hue = ['#2f7f6a', '#7c4f8f', '#a8632f', '#3f6f9f', '#b0708f'][i % 5];
              ctx.strokeStyle = rgba(shade(hue, 0.18), 0.5 + depthR * 0.4);
              ctx.lineWidth = 3 + hash01(f.seed + i * 7) * 3;
              ctx.lineCap = 'round';
              const wob = Math.sin(t * 0.9 + i) * 3;
              ctx.beginPath();
              ctx.moveTo(Math.cos(a) * f.r * 0.15, Math.sin(a) * f.r * 0.15);
              ctx.quadraticCurveTo(
                Math.cos(a) * len * 0.6 + wob, Math.sin(a) * len * 0.6,
                Math.cos(a) * len + wob * 1.6, Math.sin(a) * len,
              );
              ctx.stroke();
              ctx.fillStyle = rgba(shade(hue, 0.4), 0.35 + depthR * 0.35);
              ctx.beginPath(); ctx.arc(Math.cos(a) * len + wob * 1.6, Math.sin(a) * len, 2.6, 0, TAU); ctx.fill();
            }
          } else if (kind === 1) {
            const n = 4 + Math.floor(hash01(f.seed) * 4);
            for (let i = 0; i < n; i++) {
              const a = (i / n) * TAU + hash01(f.seed + i) * 0.6;
              const x0 = Math.cos(a) * f.r * 0.4, y0 = Math.sin(a) * f.r * 0.4;
              const h = f.r * (0.7 + hash01(f.seed + i * 5) * 0.7);
              const hue = ['#d98f6b', '#c9748f', '#8f7fd0', '#6ba39c'][i % 4];
              ctx.strokeStyle = rgba(shade(hue, -0.1), 0.6 + depthR * 0.3);
              ctx.lineWidth = 7 + hash01(f.seed + i * 3) * 6;
              ctx.lineCap = 'round';
              ctx.beginPath();
              ctx.moveTo(x0, y0);
              ctx.lineTo(x0 + Math.sin(t * 0.7 + i) * 2, y0 - h);
              ctx.stroke();
              ctx.fillStyle = rgba(shade(hue, 0.5), 0.5 + depthR * 0.4);
              ctx.beginPath(); ctx.arc(x0, y0 - h, 5 + hash01(f.seed + i * 11) * 4, 0, TAU); ctx.fill();
            }
          } else {
            for (let i = 0; i < 4; i++) {
              const a = (i / 4) * TAU + 0.4;
              const hue = ['#4fa38f', '#9b6fb8', '#b07a4f', '#5f87b8'][i % 4];
              const rr = f.r * (0.5 + hash01(f.seed + i) * 0.4);
              ctx.save();
              ctx.rotate(a + Math.sin(t * 0.5 + i) * 0.08);
              const g = ctx.createRadialGradient(rr * 0.2, 0, 3, 0, 0, rr);
              g.addColorStop(0, rgba(shade(hue, 0.35), 0.55 + depthR * 0.35));
              g.addColorStop(1, rgba(shade(hue, -0.5), 0.25 + depthR * 0.2));
              ctx.fillStyle = g;
              ctx.beginPath();
              ctx.moveTo(0, 0);
              ctx.quadraticCurveTo(rr * 0.6, -rr * 0.75, rr, 0);
              ctx.quadraticCurveTo(rr * 0.6, rr * 0.4, 0, 0);
              ctx.fill();
              ctx.restore();
            }
          }
          ctx.restore();
          break;
        }
        case 'vent': {
          ctx.save(); ctx.translate(f.x, f.y);
          ctx.fillStyle = '#1a1013';
          ctx.beginPath(); ctx.ellipse(0, 0, f.r * 0.8, f.r * 0.55, 0, 0, TAU); ctx.fill();
          const g = ctx.createRadialGradient(0, 0, 4, 0, 0, f.r);
          g.addColorStop(0, `rgba(255,150,80,${0.4 + Math.sin(t * 2 + f.seed) * 0.12})`);
          g.addColorStop(1, 'rgba(255,120,60,0)');
          ctx.fillStyle = g;
          ctx.beginPath(); ctx.arc(0, 0, f.r, 0, TAU); ctx.fill();
          ctx.restore();
          break;
        }
        case 'wreck': {
          ctx.save(); ctx.translate(f.x, f.y); ctx.rotate(hash01(f.seed) * TAU);
          ctx.fillStyle = 'rgba(28,40,50,0.9)';
          ctx.beginPath(); ctx.ellipse(0, 0, f.r, f.r * 0.4, 0, 0, TAU); ctx.fill();
          ctx.strokeStyle = 'rgba(150,190,210,0.2)'; ctx.lineWidth = 3;
          for (let i = -3; i <= 3; i++) { ctx.beginPath(); ctx.moveTo(i * f.r * 0.26, -f.r * 0.3); ctx.lineTo(i * f.r * 0.26, f.r * 0.3); ctx.stroke(); }
          ctx.restore();
          break;
        }
        case 'nest': {
          ctx.save(); ctx.translate(f.x, f.y);
          const pulse = 1 + Math.sin(t * 1.4) * 0.05;
          const g = ctx.createRadialGradient(0, 0, 4, 0, 0, f.r * 1.5 * pulse);
          g.addColorStop(0, 'rgba(120,255,210,0.35)');
          g.addColorStop(0.6, 'rgba(60,200,255,0.12)');
          g.addColorStop(1, 'rgba(40,160,255,0)');
          ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, f.r * 1.5 * pulse, 0, TAU); ctx.fill();
          ctx.strokeStyle = 'rgba(160,255,230,0.45)'; ctx.lineWidth = 3;
          for (let k = 0; k < 3; k++) {
            ctx.beginPath(); ctx.arc(0, 0, f.r * (0.5 + k * 0.3) * pulse, t * 0.3 + k, t * 0.3 + k + 4.4); ctx.stroke();
          }
          ctx.restore();
          break;
        }
        case 'cache': {
          ctx.save(); ctx.translate(f.x, f.y);
          ctx.fillStyle = 'rgba(40,52,62,0.85)';
          ctx.beginPath(); ctx.ellipse(0, 0, f.r, f.r * 0.6, 0.4, 0, TAU); ctx.fill();
          ctx.strokeStyle = 'rgba(255,209,102,0.35)'; ctx.lineWidth = 2; ctx.stroke();
          ctx.restore();
          break;
        }
        case 'relic': {
          ctx.save(); ctx.translate(f.x, f.y);
          const pulse = 0.8 + Math.sin(t * 1.1 + f.seed) * 0.2;
          const g = ctx.createRadialGradient(0, 0, 6, 0, 0, f.r * pulse);
          g.addColorStop(0, 'rgba(255,157,224,0.32)');
          g.addColorStop(1, 'rgba(255,157,224,0)');
          ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, f.r * pulse, 0, TAU); ctx.fill();
          ctx.strokeStyle = 'rgba(255,157,224,0.35)'; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.arc(0, 0, f.r * 0.92, 0, TAU); ctx.stroke();
          ctx.beginPath(); ctx.arc(0, 0, f.r * 0.6 * pulse, 0, TAU); ctx.stroke();
          if (!f.hasRelic && !f.guard) {
            ctx.fillStyle = 'rgba(255,157,224,0.5)';
            ctx.beginPath(); ctx.arc(0, 0, 6, 0, TAU); ctx.fill();
          }
          ctx.restore();
          break;
        }
        default: break;
      }
    }
  }

  _drawEventOverlays(ctx, game, view) {
    // облака спор
    const clouds = game.eventData?.clouds;
    if (clouds) {
      for (const cl of clouds) {
        if (!this._visible(cl.x, cl.y, cl.r, view)) continue;
        const g = ctx.createRadialGradient(cl.x, cl.y, cl.r * 0.2, cl.x, cl.y, cl.r);
        g.addColorStop(0, 'rgba(201,166,255,0.22)');
        g.addColorStop(1, 'rgba(201,166,255,0)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(cl.x, cl.y, cl.r, 0, TAU); ctx.fill();
      }
    }
    // чернильные облака
    for (const ink of game.inkClouds) {
      const a = clamp(ink.life / 5.5, 0, 1);
      const g = ctx.createRadialGradient(ink.x, ink.y, ink.r * 0.15, ink.x, ink.y, ink.r);
      g.addColorStop(0, `rgba(4,10,20,${0.85 * a})`);
      g.addColorStop(1, 'rgba(4,10,20,0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(ink.x, ink.y, ink.r, 0, TAU); ctx.fill();
    }
    // реликтовые «столбы» на месторождениях, где сейчас растёт ген
    for (const f of game.relicSpots) {
      if (f.hasRelic || f.relicTimer > 8) continue;
      if (!this._visible(f.x, f.y, f.r, view)) continue;
      const k = clamp(1 - f.relicTimer / 8, 0, 1);
      ctx.strokeStyle = `rgba(255,157,224,${0.25 + k * 0.4})`;
      ctx.lineWidth = 4;
      ctx.beginPath(); ctx.arc(f.x, f.y, f.r * (1 - k * 0.7), 0, TAU); ctx.stroke();
    }
  }

  _drawFoods(ctx, game, view, dt) {
    const q = this.quality;
    for (const f of game.foods) {
      const kind = FOOD_KINDS[f.kind];
      if (!kind) continue;
      const r = kind.r * f.scale * (f.kind === 'relic' ? 1.4 + Math.sin(game.globalTime * 2) * 0.1 : 1);
      if (!this._visible(f.x, f.y, r * 3, view)) continue;
      if (kind.relic && q.glow < 1) { drawFood(ctx, kind, f.x, f.y, game.globalTime, f.seed, f.scale); continue; }
      drawFood(ctx, kind, f.x, f.y, game.globalTime, f.seed, f.scale);
    }
  }

  _drawProjectiles(ctx, game) {
    for (const p of game.projectiles) {
      ctx.fillStyle = rgba(p.color, 0.85);
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, TAU); ctx.fill();
      ctx.strokeStyle = rgba('#ffffff', 0.5); ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(p.x - p.vx * 0.03, p.y - p.vy * 0.03); ctx.lineTo(p.x, p.y); ctx.stroke();
    }
  }

  _drawCreatures(ctx, game, view) {
    const q = this.quality;
    const p = game.player;
    for (const c of game.creatures) {
      if (c.dead) continue;
      const vis = 1;
      if (!this._visible(c.x, c.y, c.r * 3, view)) continue;
      // в темноте далёкие существа почти не видны
      let alpha = 1;
      if (game.lightLevel < 0.45) {
        const d = dist(c.x, c.y, p.x, p.y);
        const range = c.ally || c === game.boss ? 800 : (p.stats.nightVision > 0 ? 700 : 460);
        alpha = clamp(1 - (d - range * 0.4) / range, 0.08, 1);
      }
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(c.x, c.y);
      ctx.rotate(c.heading);
      const color = mixHex(c.sp.color, '#ffffff', c.flash ?? 0);
      drawCell(ctx, {
        shape: c.sp.shape, color, color2: c.sp.color2, r: c.r, t: c.t,
        seed: c.seed, phase: c.phase, parts: c.sp.parts, mouth: c.sp.mouth,
        flash: c.flash ?? 0, isPlayer: false,
        glow: (c.sp.parts?.luciferin ?? 0) + (c.ally ? 0.8 : 0),
        aura: c.sp.hazard ? { radius: c.sp.hazard.radius, color: c.sp.hazard.type === 'spores' ? '#c9a6ff' : '#c9ff5e' } : null,
        paralyzed: c.stun > 0, poisoned: c.poison.t > 0, cloak: c.sp.stealth > 0 && !c.hunt,
      });
      ctx.restore();

      // индикаторы над существом
      const showHp = (c.hp < c.maxHp * 0.98 && !c.sp.boss) || c.boss;
      if (showHp) {
        const w = c.r * 2.1;
        ctx.fillStyle = 'rgba(4,14,22,0.6)';
        ctx.fillRect(c.x - w / 2, c.y - c.r - 12, w, 4);
        ctx.fillStyle = c.ally ? '#4fe3c1' : c.boss ? '#ff6b6b' : '#ff9a8b';
        ctx.fillRect(c.x - w / 2, c.y - c.r - 12, w * clamp(c.hp / c.maxHp, 0, 1), 4);
      }
      if (c.boss) {
        ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'center';
        ctx.fillStyle = 'rgba(255,190,190,0.85)';
        ctx.fillText(`фаза ${c.phase}`, c.x, c.y - c.r - 18);
      }
      if (c.ally) {
        ctx.fillStyle = 'rgba(79,227,193,0.85)';
        ctx.beginPath(); ctx.arc(c.x, c.y - c.r - 18, 3, 0, TAU); ctx.fill();
      }
      if (c.sp.alpha && !c.boss) {
        ctx.fillStyle = 'rgba(255,209,102,0.85)';
        ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('★', c.x, c.y - c.r - 14);
      }
      if (c.migrating) {
        ctx.fillStyle = 'rgba(160,220,255,0.5)';
        ctx.beginPath(); ctx.arc(c.x, c.y - c.r - 20, 2.4, 0, TAU); ctx.fill();
      }
      if (c.behavior === 'chase' && c.hunt && !c.ally && dist(c.x, c.y, p.x, p.y) < 700) {
        ctx.fillStyle = 'rgba(255,90,90,0.75)';
        ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('!', c.x, c.y - c.r - (c.sp.alpha ? 24 : 10));
      }
    }
  }

  _drawPlayer(ctx, game) {
    const p = game.player;
    const t = game.globalTime;
    ctx.save();
    ctx.translate(p.x, p.y);
    // индикатор «танца»: кольцо синхронизации
    if (p.dance.target && Math.abs(p.dance.progress) > 0.02 && !p.dance.target.dead) {
      const pr = clamp(p.dance.progress, 0, 1);
      ctx.strokeStyle = pr > 0 ? `rgba(79,227,193,${0.4 + pr * 0.5})` : 'rgba(255,120,120,0.6)';
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(0, 0, p.r * 1.5, -Math.PI / 2, -Math.PI / 2 + pr * TAU); ctx.stroke();
      const near = p.dance.target;
      ctx.font = 'bold 15px sans-serif'; ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(79,227,193,0.9)';
      ctx.fillText('♪', near.x, near.y - near.r - 14);
    }
    if (p.dance.lastAttack > 0) p.dance.lastAttack -= 0.016;

    // след рывка
    if (p.dashTime > 0) {
      ctx.save(); ctx.globalAlpha = p.dashTime / CFG.player.dashTime * 0.5;
      ctx.fillStyle = rgba('#bff6ff', 0.4);
      ctx.beginPath(); ctx.ellipse(-p.r * 0.9, 0, p.r * (0.9 + p.dashTime * 3), p.r * 0.7, 0, 0, TAU); ctx.fill();
      ctx.restore();
    }
    ctx.rotate(p.heading);
    drawCell(ctx, {
      shape: 'coccus', color: mixHex(p.stats.color ?? '#66e6c3', '#ffffff', p.hitFlash * 0.6),
      color2: '#e8fff8', r: p.r, t, seed: 42, phase: 0.6,
      parts: p.parts, mouth: this._playerMouth(p), flash: p.hitFlash,
      isPlayer: true, glow: (p.parts.luciferin ?? 0) * 0.8 + (p.cloak > 0 ? 0.6 : 0.3),
      cloak: p.cloak > 0, paralyzed: p.stun > 0, poisoned: p.poison.t > 0,
    });
    ctx.restore();
  }

  _playerMouth(p) {
    if (p.parts.jaws) return 'jaws';
    if (p.parts.beak) return 'beak';
    if (p.parts.disc) return 'disk';
    if (p.parts.filter) return 'filter';
    return 'disk';
  }

  _drawParticles(ctx, game) {
    for (const q of game.particles) drawParticle(ctx, q);
  }

  _drawFloaters(ctx, game) {
    if (!game.floaters.length) return;
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (const f of game.floaters) {
      const a = clamp(f.life / f.maxLife, 0, 1);
      ctx.globalAlpha = a;
      ctx.font = `bold ${f.size}px -apple-system, sans-serif`;
      ctx.lineWidth = 3;
      ctx.strokeStyle = 'rgba(2,14,22,0.85)';
      ctx.strokeText(f.text, f.x, f.y);
      ctx.fillStyle = f.color;
      ctx.fillText(f.text, f.x, f.y);
    }
    ctx.restore();
  }

  // ------------------------------------------------------------------
  _drawBoundary(ctx, game) {
    const c = this.cam;
    const p = game.player;
    const R = CFG.world.radius;
    const distToEdge = R - Math.hypot(p.x, p.y);
    const near = clamp(1 - (distToEdge - 150) / 900, 0, 1);   // 0 — далеко, 1 — у самой плёнки
    if (near <= 0.01) return;
    const sx = (0 - c.x) * c.zoom + this.w / 2;
    const sy = (0 - c.y) * c.zoom + this.h / 2;
    const sr = R * c.zoom;
    const t = game.globalTime;

    // 1. «плёнка поверхностного натяжения»: тёмный градиент наружу от границы
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, this.w, this.h);
    ctx.arc(sx, sy, sr, 0, TAU, true);
    const grd = ctx.createRadialGradient(sx, sy, sr * 0.99, sx, sy, sr * 1.12);
    grd.addColorStop(0, `rgba(3,14,24,${0.1 * near})`);
    grd.addColorStop(0.25, `rgba(2,10,18,${0.55 * near})`);
    grd.addColorStop(1, 'rgba(1,5,10,0.95)');
    ctx.fillStyle = grd;
    ctx.fill();
    ctx.restore();

    // 2. сама граница: пульсирующие штрихи + свечение
    ctx.save();
    ctx.lineCap = 'round';
    ctx.strokeStyle = `rgba(126,232,255,${0.10 + 0.16 * near + Math.sin(t * 1.4) * 0.05})`;
    ctx.lineWidth = 3 + near * 5;
    ctx.setLineDash([46 + near * 40, 40]);
    ctx.lineDashOffset = -t * 46;
    ctx.beginPath(); ctx.arc(sx, sy, sr, 0, TAU); ctx.stroke();
    ctx.setLineDash([]);
    ctx.strokeStyle = `rgba(180,246,255,${0.16 * near})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(sx, sy, sr - 2, 0, TAU); ctx.stroke();
    ctx.restore();

    // 3. пузыри, поднимающиеся вдоль плёнки (только когда игрок рядом)
    if (near > 0.35 && this.quality.particles > 0.3) {
      const a0 = Math.atan2(p.y, p.x);
      for (let i = 0; i < 5; i++) {
        const a = a0 + Math.sin(t * 0.3 + i * 2.4) * 0.5;
        const rr = R + 12 + i * 9;
        ctx.fillStyle = `rgba(200,245,255,${0.10 + 0.12 * near})`;
        ctx.beginPath();
        ctx.arc(Math.cos(a) * rr, Math.sin(a) * rr - Math.sin(t * 2 + i) * 14, 3 + i * 0.6, 0, TAU);
        ctx.fill();
      }
    }
  }

  _drawThreatArrows(ctx, game) {
    const p = game.player;
    const list = game.creaturesNear(p.x, p.y, 900);
    ctx.save();
    ctx.font = 'bold 15px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (const c of list) {
      if (c.dead || c.ally || c === game.boss) continue;
      if (!(c.hunt && c.r > p.r * 1.2)) continue;
      const s = this.worldToScreen(c.x, c.y, { x: 0, y: 0 });
      const marg = 34;
      if (s.x > marg && s.x < this.w - marg && s.y > marg && s.y < this.h - marg) continue;
      const cx = this.w / 2, cy = this.h / 2;
      const dx = s.x - cx, dy = s.y - cy;
      const ang = Math.atan2(dy, dx);
      const rx = Math.min(this.w / 2 - marg, Math.abs(Math.cos(ang)) > 0.001 ? Math.abs((this.w / 2 - marg) / Math.cos(ang)) : 9e9);
      const ry = Math.min(this.h / 2 - marg, Math.abs(Math.sin(ang)) > 0.001 ? Math.abs((this.h / 2 - marg) / Math.sin(ang)) : 9e9);
      const rr = Math.min(rx, ry);
      const x = cx + Math.cos(ang) * rr, y = cy + Math.sin(ang) * rr;
      ctx.save();
      ctx.translate(x, y); ctx.rotate(ang);
      ctx.fillStyle = 'rgba(255,80,80,0.85)';
      ctx.beginPath(); ctx.moveTo(12, 0); ctx.lineTo(-8, -8); ctx.lineTo(-8, 8); ctx.closePath(); ctx.fill();
      ctx.restore();
      if (c === game.boss || c.sp.alpha) {
        ctx.fillStyle = 'rgba(255,160,160,0.9)';
        ctx.fillText(c.boss ? '☠' : '★', x - Math.cos(ang) * 22, y - Math.sin(ang) * 22);
      }
    }
    ctx.restore();
  }

  // ------------------------------------------------------------------
  // Радар
  // ------------------------------------------------------------------
  drawRadar(canvas, game) {
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    const cx = w / 2, cy = h / 2;
    const p = game.player;
    const rangeBonus = 1 + (p.stats.radar ?? 0);
    const range = 1150 * rangeBonus;
    const R = w / 2 - 6;
    ctx.clearRect(0, 0, w, h);
    ctx.save();
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.clip();
    const g = ctx.createRadialGradient(cx, cy, 4, cx, cy, R);
    g.addColorStop(0, 'rgba(10,50,70,0.75)');
    g.addColorStop(1, 'rgba(3,18,28,0.85)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);

    const toRadar = (x, y) => ({ x: cx + (x - p.x) / range * R, y: cy + (y - p.y) / range * R });

    // препятствия
    ctx.fillStyle = 'rgba(120,150,165,0.22)';
    for (const f of game.features) {
      const d = dist(f.x, f.y, p.x, p.y);
      if (d > range) continue;
      const s = toRadar(f.x, f.y);
      const rr = clamp(f.r / range * R * 1.2, 1, 8);
      if (f.type === 'rock' || f.type === 'reef') { ctx.fillStyle = 'rgba(120,150,165,0.22)'; ctx.beginPath(); ctx.arc(s.x, s.y, rr, 0, TAU); ctx.fill(); }
      else if (f.type === 'vent') { ctx.fillStyle = 'rgba(255,150,80,0.45)'; ctx.beginPath(); ctx.arc(s.x, s.y, rr, 0, TAU); ctx.fill(); }
      else if (f.type === 'relic') { ctx.fillStyle = 'rgba(255,157,224,0.6)'; ctx.beginPath(); ctx.arc(s.x, s.y, rr, 0, TAU); ctx.fill(); }
      else if (f.type === 'cache' || f.type === 'wreck') { ctx.fillStyle = 'rgba(255,209,102,0.4)'; ctx.beginPath(); ctx.arc(s.x, s.y, rr, 0, TAU); ctx.fill(); }
    }
    // еда
    ctx.fillStyle = 'rgba(200,255,220,0.3)';
    for (const f of game.foods) {
      const d = dist(f.x, f.y, p.x, p.y);
      if (d > range) continue;
      const s = toRadar(f.x, f.y);
      ctx.fillStyle = f.kind === 'relic' ? 'rgba(255,157,224,0.95)' : f.kind === 'cache' ? 'rgba(255,209,102,0.9)' : 'rgba(180,240,210,0.35)';
      ctx.beginPath(); ctx.arc(s.x, s.y, f.kind === 'relic' ? 3.4 : 1.4, 0, TAU); ctx.fill();
    }
    // существа
    for (const c of game.creatures) {
      if (c.dead) continue;
      const d = dist(c.x, c.y, p.x, p.y);
      if (d > range) continue;
      const s = toRadar(c.x, c.y);
      const rec = p.rep[c.sp.id];
      let col = 'rgba(255,220,180,0.75)';
      if (c.ally) col = '#4fe3c1';
      else if (rec && rec.rep >= 62) col = '#8ff0ff';
      else if (rec && rec.rep <= -45) col = '#ff6b6b';
      else if (c.r > p.r * 1.25) col = '#ff9a8b';
      else if (c.r * 1.25 < p.r) col = '#b6ffd0';
      if (c.boss) col = '#ff3b3b';
      const rr = clamp(c.r / range * R * 2.2, 2, 7) * (c.boss ? 1.8 : 1);
      ctx.fillStyle = col;
      ctx.beginPath(); ctx.arc(s.x, s.y, rr, 0, TAU); ctx.fill();
      if (c.sp.alpha || c.boss) { ctx.strokeStyle = '#ffd166'; ctx.lineWidth = 1.5; ctx.stroke(); }
    }
    // гнездо
    const nest = toRadar(p.nestPos.x, p.nestPos.y);
    ctx.strokeStyle = '#7fe7ff'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(nest.x, nest.y - 4); ctx.lineTo(nest.x + 4, nest.y + 3); ctx.lineTo(nest.x - 4, nest.y + 3); ctx.closePath(); ctx.stroke();

    // игрок
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    const hx = Math.cos(p.heading), hy = Math.sin(p.heading);
    ctx.moveTo(cx + hx * 6, cy + hy * 6);
    ctx.lineTo(cx - hy * 4, cy + hx * 4);
    ctx.lineTo(cx + hy * 4, cy - hx * 4);
    ctx.closePath(); ctx.fill();
    // сектор обзора
    ctx.strokeStyle = 'rgba(126,232,255,0.18)';
    ctx.beginPath(); ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(p.heading - 0.7) * R, cy + Math.sin(p.heading - 0.7) * R);
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(p.heading + 0.7) * R, cy + Math.sin(p.heading + 0.7) * R);
    ctx.stroke();
    ctx.restore();
    // рамка
    ctx.strokeStyle = 'rgba(126,232,255,0.25)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.stroke();
  }
}

// ------------------------------------------------------------------
// Мини-превью клетки для редактора генома и бестиария.
// ------------------------------------------------------------------
export function drawGenomePreview(canvas, p, t) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  const g = ctx.createRadialGradient(w / 2, h * 0.45, 10, w / 2, h / 2, w * 0.6);
  g.addColorStop(0, '#0d3b52'); g.addColorStop(1, '#04141f');
  ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);

  ctx.save();
  ctx.translate(w / 2, h / 2);
  const scale = Math.min(w, h) / (p.r * 4.4);
  ctx.scale(scale, scale);
  ctx.rotate(Math.sin(t * 0.6) * 0.06);
  drawCell(ctx, {
    shape: 'coccus', color: '#66e6c3', color2: '#e8fff8', r: p.r, t: t * 1.2, seed: 42,
    parts: p.parts, mouth: p.parts.jaws ? 'jaws' : p.parts.beak ? 'beak' : p.parts.filter ? 'filter' : 'disk',
    isPlayer: true, glow: (p.parts.luciferin ?? 0) * 0.7 + 0.25,
  });
  ctx.restore();

  ctx.strokeStyle = 'rgba(126,232,255,0.16)'; ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, w - 2, h - 2);
}
