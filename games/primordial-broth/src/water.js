// water.js — the "living water": layered parallax bokeh, light shafts, caustics,
// drifting plankton specks and rising bubbles. This is the main visual bet of the game,
// so it gets its own module and its own budget.

import { WORLD } from './config.js';
import { bokehSprite, bokehRingSprite, bubbleSprite, causticTile, hexA } from './sprites.js';

const LAYER_COLORS = ['#7fe6ff', '#ffffff', '#4fb8e8', '#a8f0ff', '#2f7fb8', '#8affd0'];
const BLOOM_COLORS = ['#1fa8c8', '#0d5f92', '#2fd0d8', '#0a3a68', '#c96fd8', '#3f8fd0', '#1fae88', '#e07fd0'];

export function createWater(rng) {
  const blooms = [];
  const BLOOM_WEIGHTS = ['#1fa8c8', '#0d5f92', '#2fd0d8', '#0a3a68', '#c96fd8', '#3f8fd0', '#1fae88', '#e07fd0',
    '#1fa8c8', '#0d5f92', '#1fae88', '#c96fd8'];
  for (let i = 0; i < 34; i += 1) {
    blooms.push({
      x: rng.range(0, WORLD.w),
      y: rng.range(0, WORLD.h),
      r: rng.range(360, 1300),
      color: rng.pick(BLOOM_WEIGHTS),
      alpha: rng.range(0.14, 0.34),
    });
  }

  // far → near, each layer scrolls slower than the play field
  const layers = [
    { parallax: 0.16, items: [], scale: 1 },   // huge soft depth blobs
    { parallax: 0.42, items: [], scale: 1 },   // mid bokeh
    { parallax: 0.78, items: [], scale: 1 },   // near bokeh (slightly blurred)
    { parallax: 1.32, items: [], scale: 1 },   // foreground out-of-focus bubbles
  ];
  const counts = [30, 58, 52, 20];
  layers.forEach((layer, li) => {
    for (let i = 0; i < counts[li]; i += 1) {
      layer.items.push({
        x: rng.range(-400, WORLD.w + 400),
        y: rng.range(-300, WORLD.h + 300),
        r: li === 0 ? rng.range(240, 560)
          : li === 1 ? rng.range(110, 260)
            : li === 2 ? rng.range(70, 170)
              : rng.range(190, 380),
        color: rng.pick(LAYER_COLORS),
        ring: rng.next() < 0.62,
        alpha: li === 0 ? rng.range(0.05, 0.13) : rng.range(0.10, 0.30),
        drift: rng.range(-7, 7),
        phase: rng.range(0, Math.PI * 2),
      });
    }
  });

  // world-space micro particles ("взвесь") — three depth bands
  const specks = [[], [], []];
  for (let band = 0; band < 3; band += 1) {
    const count = [520, 340, 200][band];
    for (let i = 0; i < count; i += 1) {
      specks[band].push({
        x: rng.range(0, WORLD.w),
        y: rng.range(0, WORLD.h),
        r: band === 2 ? rng.range(1.4, 3.0) : rng.range(0.7, 1.9),
        a: rng.range(0.10, 0.42),
        vx: rng.range(-6, 6),
        vy: rng.range(-9, -1),
        phase: rng.range(0, 6.28),
      });
    }
  }

  const bubbles = [];
  for (let i = 0; i < 150; i += 1) {
    bubbles.push({
      x: rng.range(0, WORLD.w),
      y: rng.range(0, WORLD.h),
      r: rng.range(3, 13),
      vy: rng.range(-34, -12),
      vx: rng.range(-6, 6),
      phase: rng.range(0, 6.28),
    });
  }

  // Signature background colonies: big round diatom-like discs with radial spokes,
  // matching the large circular colony in the reference frame.
  const colonies = [];
  for (let i = 0; i < 7; i += 1) {
    colonies.push({
      x: rng.range(0, WORLD.w),
      y: rng.range(0, WORLD.h),
      r: rng.range(320, 720),
      spokes: rng.int(22, 34),
      phase: rng.range(0, 6.28),
      alpha: rng.range(0.10, 0.20),
      tint: rng.pick(['#dff6ff', '#cfe8ff', '#e6f0ff']),
      parallax: 0.42,
    });
  }

  const rays = [];
  for (let i = 0; i < 16; i += 1) {
    rays.push({
      x: rng.range(-0.3, 1.3),
      w: rng.range(0.03, 0.14),
      angle: rng.range(-0.30, -0.13),
      alpha: rng.range(0.03, 0.10),
      phase: rng.range(0, 6.28),
      speed: rng.range(0.05, 0.16),
    });
  }

  // The blurry layers (gradient, depth blooms, parallax bokeh) are rendered into a
  // third-resolution backdrop: it looks identical after upscaling but costs ~9x less fill.
  const backdrop = document.createElement('canvas');
  const bctx = backdrop.getContext('2d');
  const backdropScale = 3;
  let lastBackdropKey = '';

  // pre-rendered light shaft sprite (avoids 16 gradient builds per frame)
  const raySprite = document.createElement('canvas');
  raySprite.width = 128; raySprite.height = 512;
  {
    const rc = raySprite.getContext('2d');
    rc.filter = 'blur(10px)';
    const g = rc.createLinearGradient(0, 0, 0, 512);
    g.addColorStop(0, 'rgba(205,245,255,0.30)');
    g.addColorStop(0.30, 'rgba(180,236,255,0.16)');
    g.addColorStop(0.75, 'rgba(160,230,255,0.05)');
    g.addColorStop(1, 'rgba(150,225,255,0)');
    rc.fillStyle = g;
    rc.beginPath();
    rc.moveTo(64 - 22, 0); rc.lineTo(64 + 22, 0);
    rc.lineTo(64 + 58, 512); rc.lineTo(64 - 58, 512);
    rc.closePath();
    rc.fill();
    rc.filter = 'none';
  }

  return {
    blooms, layers, specks, bubbles, rays, colonies,
    caustic: causticTile(7),
    backdrop, bctx, backdropScale, lastBackdropKey, raySprite,
    time: 0,
    /** draw everything behind the creatures */
    renderBackdrop(view, cam) {
      const s = this.backdropScale;
      const bw = Math.max(64, Math.ceil(view.w / s));
      const bh = Math.max(64, Math.ceil(view.h / s));
      if (this.backdrop.width !== bw || this.backdrop.height !== bh) {
        this.backdrop.width = bw;
        this.backdrop.height = bh;
      }
      const bctx = this.bctx;
      const t = this.time;
      bctx.setTransform(1, 0, 0, 1, 0, 0);
      bctx.clearRect(0, 0, bw, bh);

      const base = bctx.createLinearGradient(0, 0, bw * 0.25, bh);
      base.addColorStop(0, '#15688f');
      base.addColorStop(0.35, '#0f4f7d');
      base.addColorStop(0.7, '#0b3a63');
      base.addColorStop(1, '#123f5c');
      bctx.fillStyle = base;
      bctx.fillRect(0, 0, bw, bh);

      const tint = bctx.createRadialGradient(bw * 0.08, bh * 1.05, 4, bw * 0.08, bh * 1.05, bh * 0.9);
      tint.addColorStop(0, 'rgba(60,180,155,0.26)');
      tint.addColorStop(0.5, 'rgba(40,140,150,0.14)');
      tint.addColorStop(1, 'rgba(0,0,0,0)');
      bctx.fillStyle = tint;
      bctx.fillRect(0, 0, bw, bh);

      const top = bctx.createLinearGradient(0, 0, 0, bh * 0.55);
      top.addColorStop(0, 'rgba(180,240,255,0.13)');
      top.addColorStop(0.5, 'rgba(150,225,255,0.05)');
      top.addColorStop(1, 'rgba(0,0,0,0)');
      bctx.fillStyle = top;
      bctx.fillRect(0, 0, bw, bh);

      bctx.save();
      bctx.globalCompositeOperation = 'lighter';
      for (const b of this.blooms) {
        const sx = ((b.x - cam.x * 0.5) * cam.zoom * 0.5 + view.w / 2) / s;
        const sy = ((b.y - cam.y * 0.5) * cam.zoom * 0.5 + view.h / 2) / s;
        const sr = (b.r * cam.zoom * 0.5) / s;
        if (sx < -sr || sx > bw + sr || sy < -sr || sy > bh + sr) continue;
        const pulse = 0.86 + 0.14 * Math.sin(t * 0.22 + b.x * 0.001);
        bctx.globalAlpha = b.alpha * pulse;
        bctx.drawImage(bokehSprite(b.color, 0.5), sx - sr, sy - sr, sr * 2, sr * 2);
      }
      bctx.restore();

      for (const layer of this.layers) {
        const p = layer.parallax;
        bctx.save();
        for (const it of layer.items) {
          const sx = ((it.x - cam.x * p) * cam.zoom + view.w / 2) / s;
          const sy = ((it.y - cam.y * p) * cam.zoom + view.h / 2 + Math.sin(t * 0.3 + it.phase) * 8) / s;
          const sr = (it.r * cam.zoom) / s;
          if (sx < -sr || sx > bw + sr || sy < -sr || sy > bh + sr) continue;
          bctx.globalAlpha = it.alpha * (0.8 + 0.2 * Math.sin(t * 0.5 + it.phase));
          const sprite = it.ring ? bokehRingSprite(it.color) : bokehSprite(it.color, 0.5);
          bctx.drawImage(sprite, sx - sr, sy - sr, sr * 2, sr * 2);
        }
        bctx.restore();
      }
    },
    draw(ctx, cam, view, dt, quality = 1) {
      this.time += dt;
      const t = this.time;
      const skip = this.skip || (this.skip = new URLSearchParams(location.search));
      if (skip.get('nowater') === '1') { return; }

      // --- soft layers come from the low-resolution backdrop ---
      this.lastBackdropKey = `${Math.round(cam.x)}:${Math.round(cam.y)}:${cam.zoom.toFixed(3)}:${view.w}x${view.h}`;
      if (skip.get('nobackdrop') !== '1') {
        this.renderBackdrop(view, cam);
        ctx.imageSmoothingEnabled = true;
        ctx.drawImage(this.backdrop, 0, 0, view.w, view.h);
      }

      const base = ctx.createLinearGradient(0, 0, view.w * 0.25, view.h);
      base.addColorStop(0, '#15688f');
      base.addColorStop(0.35, '#0f4f7d');
      base.addColorStop(0.7, '#0b3a63');
      base.addColorStop(1, '#123f5c');
      ctx.fillStyle = base;
      ctx.fillRect(0, 0, view.w, view.h);
      const tint = ctx.createRadialGradient(view.w * 0.08, view.h * 1.05, 10, view.w * 0.08, view.h * 1.05, view.h * 0.9);
      tint.addColorStop(0, 'rgba(70,190,160,0.30)');
      tint.addColorStop(0.5, 'rgba(40,140,150,0.13)');
      tint.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = tint;
      ctx.fillRect(0, 0, view.w, view.h);
      const top = ctx.createLinearGradient(0, 0, 0, view.h * 0.55);
      top.addColorStop(0, 'rgba(190,245,255,0.26)');
      top.addColorStop(0.5, 'rgba(150,225,255,0.10)');
      top.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = top;
      ctx.fillRect(0, 0, view.w, view.h);

      // --- background colonies (drawn into the backdrop pass would blur them, so
      //     they get their own cheap pass: a faint disc plus radial spokes) ---
      if (skip.get('nocolonies') !== '1') {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        for (const col of this.colonies) {
          const sx = (col.x - cam.x * col.parallax) * cam.zoom + view.w / 2;
          const sy = (col.y - cam.y * col.parallax) * cam.zoom + view.h / 2;
          const sr = col.r * cam.zoom;
          if (sx < -sr || sx > view.w + sr || sy < -sr || sy > view.h + sr) continue;
          const breathe = 0.85 + 0.15 * Math.sin(t * 0.18 + col.phase);
          ctx.globalAlpha = col.alpha * breathe;
          ctx.strokeStyle = col.tint;
          ctx.lineWidth = Math.max(1, sr * 0.012);
          ctx.beginPath();
          ctx.arc(sx, sy, sr * 0.94, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(sx, sy, sr * 0.78, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          for (let s = 0; s < col.spokes; s += 1) {
            const a = (s / col.spokes) * Math.PI * 2 + t * 0.02;
            ctx.moveTo(sx + Math.cos(a) * sr * 0.78, sy + Math.sin(a) * sr * 0.78);
            ctx.lineTo(sx + Math.cos(a) * sr * 0.96, sy + Math.sin(a) * sr * 0.96);
          }
          ctx.stroke();
          for (let s = 0; s < col.spokes; s += 2) {
            const a = (s / col.spokes) * Math.PI * 2 - t * 0.01;
            ctx.beginPath();
            ctx.arc(sx + Math.cos(a) * sr * 0.86, sy + Math.sin(a) * sr * 0.86, sr * 0.035, 0, Math.PI * 2);
            ctx.fillStyle = col.tint;
            ctx.fill();
          }
        }
        ctx.restore();
      }

      // --- sun shafts from the surface ---
      if (skip.get('norays') !== '1') {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (const r of this.rays) {
        const sway = Math.sin(t * r.speed + r.phase) * 0.02;
        const x0 = (r.x + sway) * view.w;
        const h = view.h * 1.15;
        const w = r.w * view.w * 5.2;
        ctx.globalAlpha = r.alpha * 2.1;
        ctx.save();
        ctx.translate(x0, -20);
        ctx.rotate(Math.tan(r.angle) * 0.55);
        ctx.drawImage(this.raySprite, -w / 2, 0, w, h);
        ctx.restore();
      }
      ctx.restore();
      }

      // --- caustics as a seamless repeating pattern (cheap, no page-sized blits) ---
      if (quality > 0.5 && skip.get('nocaustic') !== '1') {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = 0.15;
        const pattern = this.causticPattern || (this.causticPattern = ctx.createPattern(this.caustic, 'repeat'));
        const cs = 900 * cam.zoom;
        const k = cs / 512;
        const ox = (-cam.x * cam.zoom + view.w / 2 + Math.sin(t * 0.07) * 10) % (cs);
        const oy = (-cam.y * cam.zoom + view.h / 2 + Math.cos(t * 0.05) * 8) % (cs);
        if (pattern.setTransform && typeof DOMMatrix !== 'undefined') {
          pattern.setTransform(new DOMMatrix().translate(ox, oy).scale(k, k));
          ctx.fillStyle = pattern;
          ctx.fillRect(0, 0, view.w, view.h);
        }
        ctx.restore();
      }

      // --- world-space specks and bubbles (drawn behind the creatures) ---
      this.updateSpecks(dt, quality);
      ctx.save();
      for (let band = 0; band < 3; band += 1) {
        const dim = [0.55, 0.8, 1][band];
        for (const s of this.specks[band]) {
          const sx = (s.x - cam.x) * cam.zoom + view.w / 2;
          const sy = (s.y - cam.y) * cam.zoom + view.h / 2;
          if (sx < -20 || sx > view.w + 20 || sy < -20 || sy > view.h + 20) continue;
          ctx.globalAlpha = s.a * dim;
          ctx.fillStyle = '#eafcff';
          const rr = Math.max(0.6, s.r * cam.zoom * (band === 2 ? 1 : 0.9));
          ctx.beginPath();
          ctx.arc(sx, sy, rr, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();

      this.updateBubbles(dt, cam, quality);
      const bubble = bubbleSprite();
      ctx.save();
      for (const b of this.bubbles) {
        const sx = (b.x - cam.x) * cam.zoom + view.w / 2;
        const sy = (b.y - cam.y) * cam.zoom + view.h / 2;
        const sr = b.r * cam.zoom * 1.6;
        if (sx < -sr || sx > view.w + sr || sy < -sr || sy > view.h + sr) continue;
        ctx.globalAlpha = 0.55;
        ctx.drawImage(bubble, sx - sr, sy - sr, sr * 2, sr * 2);
      }
      ctx.restore();

      // --- the shoal on the right: brighter, sandy water ---
      const shoreX = (WORLD.shoreStart - cam.x) * cam.zoom + view.w / 2;
      const endX = (WORLD.shoreEnd - cam.x) * cam.zoom + view.w / 2;
      if (shoreX < view.w) {
        const g = ctx.createLinearGradient(shoreX, 0, endX, 0);
        g.addColorStop(0, 'rgba(190,235,220,0)');
        g.addColorStop(0.55, 'rgba(196,240,210,0.35)');
        g.addColorStop(1, 'rgba(228,246,206,0.75)');
        ctx.fillStyle = g;
        ctx.fillRect(shoreX, 0, Math.max(0, view.w - shoreX), view.h);
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = 0.25 + 0.1 * Math.sin(t * 0.8);
        const sun = bokehSprite('#eaffd0', 0.5);
        ctx.drawImage(sun, endX - 900, -260, 1800, 1800);
        ctx.restore();
      }
    },
    updateSpecks(dt, quality) {
      const mult = quality > 0.5 ? 1 : 0.5;
      for (let band = 0; band < 3; band += 1) {
        for (const s of this.specks[band]) {
          s.x += s.vx * dt * mult;
          s.y += s.vy * dt * mult;
          s.phase += dt;
          if (s.y < -20) { s.y = WORLD.h + 20; s.x = Math.random() * WORLD.w; }
          if (s.x < -20) s.x = WORLD.w + 20;
          if (s.x > WORLD.w + 20) s.x = -20;
        }
      }
    },
    updateBubbles(dt, cam, quality) {
      const mult = quality > 0.5 ? 1 : 0.55;
      for (const b of this.bubbles) {
        b.y += b.vy * dt * mult;
        b.x += (b.vx + Math.sin(b.phase) * 6) * dt * mult;
        b.phase += dt * 2;
        if (b.y < cam.y - 1400 || b.y < -40) {
          b.y = Math.min(WORLD.h - 20, cam.y + 1200 + Math.random() * 600);
          b.x = cam.x + (Math.random() * 2 - 1) * 1300;
        }
      }
    },
    /** a quick bubble puff, e.g. when the player dashes */
    spawnBubble(x, y, r = 8) {
      this.bubbles.push({
        x, y, r, vy: -46 - Math.random() * 30, vx: (Math.random() * 2 - 1) * 12,
        phase: Math.random() * 6.28, ttl: 2.4,
      });
      if (this.bubbles.length > 140) this.bubbles.shift();
    },
  };
}

/** Red damage vignette helper, drawn by the renderer on top of everything. */
export function drawVignette(ctx, view, strength, color = '190,20,60') {
  if (strength <= 0.001) return;
  const g = ctx.createRadialGradient(
    view.w / 2, view.h / 2, Math.min(view.w, view.h) * 0.34,
    view.w / 2, view.h / 2, Math.max(view.w, view.h) * 0.72,
  );
  g.addColorStop(0, `rgba(${color},0)`);
  g.addColorStop(1, `rgba(${color},${Math.min(0.62, strength)})`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, view.w, view.h);
}

export function drawWaterOverlay(ctx, view, cam, time) {
  // subtle blue grade + warm caustic flicker on top of the creatures
  ctx.save();
  ctx.globalCompositeOperation = 'overlay';
  ctx.globalAlpha = 0.12;
  const g = ctx.createLinearGradient(0, 0, 0, view.h);
  g.addColorStop(0, '#a8e8ff');
  g.addColorStop(1, '#0a2b52');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, view.w, view.h);
  ctx.restore();
  void cam; void time;
}

export { hexA };
