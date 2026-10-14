// fx.js — particles, floating numbers, growth rings and ripples. All additive and cheap.

import { bokehSprite, hexA } from './sprites.js';

export function createFx() {
  return { parts: [], popups: [], rings: [], bubblesPuff: [] };
}

export function burst(fx, x, y, { count = 14, color = '#ffe0b0', color2 = null, speed = 190, size = 3, life = 0.7, kind = 'spark' } = {}) {
  for (let i = 0; i < count; i += 1) {
    const a = Math.random() * Math.PI * 2;
    const sp = speed * (0.35 + Math.random() * 0.9);
    fx.parts.push({
      x, y,
      vx: Math.cos(a) * sp,
      vy: Math.sin(a) * sp,
      r: size * (0.6 + Math.random() * 0.9),
      life: life * (0.6 + Math.random() * 0.8),
      maxLife: life,
      color: (color2 && Math.random() < 0.5) ? color2 : color,
      kind,
      spin: Math.random() * 6.28,
    });
  }
  if (fx.parts.length > 900) fx.parts.splice(0, fx.parts.length - 900);
}

export function ring(fx, x, y, radius, color = '#bff6ff', width = 3, life = 0.6) {
  fx.rings.push({ x, y, r: radius * 0.35, target: radius * 1.6, life, maxLife: life, color, width });
}

export function popup(fx, x, y, text, color = '#ffe9a8', size = 16) {
  fx.popups.push({ x, y, text, color, size, life: 1.1, maxLife: 1.1, vy: -34 });
  if (fx.popups.length > 60) fx.popups.shift();
}

export function updateFx(fx, dt) {
  for (let i = fx.parts.length - 1; i >= 0; i -= 1) {
    const p = fx.parts[i];
    p.life -= dt;
    if (p.life <= 0) { fx.parts.splice(i, 1); continue; }
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    const damp = p.kind === 'blob' ? 1.6 : 3.1;
    const k = Math.exp(-damp * dt);
    p.vx *= k; p.vy *= k;
    p.vy -= 8 * dt; // slight buoyancy
    p.spin += dt * 3;
  }
  for (let i = fx.rings.length - 1; i >= 0; i -= 1) {
    const r = fx.rings[i];
    r.life -= dt;
    if (r.life <= 0) { fx.rings.splice(i, 1); continue; }
    const t = 1 - r.life / r.maxLife;
    r.r = r.r + (r.target - r.r) * Math.min(1, dt * 4.2);
    r.alpha = 1 - t;
  }
  for (let i = fx.popups.length - 1; i >= 0; i -= 1) {
    const p = fx.popups[i];
    p.life -= dt;
    if (p.life <= 0) { fx.popups.splice(i, 1); continue; }
    p.y += p.vy * dt;
    p.vy *= Math.exp(-2.2 * dt);
  }
}

export function drawFx(ctx, fx, time) {
  // soft blobs first (they read as plankton guts dissolving)
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  for (const p of fx.parts) {
    const a = Math.max(0, p.life / p.maxLife);
    if (p.kind === 'blob') {
      const s = p.r * 9;
      ctx.globalAlpha = a * 0.5;
      ctx.drawImage(bokehSprite(p.color, 0.5), p.x - s / 2, p.y - s / 2, s, s);
    } else if (p.kind === 'spark') {
      ctx.globalAlpha = a * 0.95;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * a, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = a * 0.35;
      ctx.drawImage(bokehSprite(p.color, 0.5), p.x - p.r * 4, p.y - p.r * 4, p.r * 8, p.r * 8);
    }
  }
  ctx.restore();

  // solid morsels (chunks that sink)
  for (const p of fx.parts) {
    if (p.kind !== 'morsel') continue;
    const a = Math.max(0, p.life / p.maxLife);
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.spin);
    ctx.globalAlpha = a;
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.r, -p.r * 0.7, p.r * 2, p.r * 1.4);
    ctx.restore();
  }

  // rings
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  for (const r of fx.rings) {
    ctx.globalAlpha = (r.alpha ?? 1) * 0.8;
    ctx.strokeStyle = r.color;
    ctx.lineWidth = r.width;
    ctx.beginPath();
    ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();

  void time;
}

/** Text popups are drawn in screen space so they stay readable at any zoom. */
export function drawPopups(ctx, fx, cam, view) {
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (const p of fx.popups) {
    const a = Math.min(1, p.life / p.maxLife * 1.6);
    const sx = (p.x - cam.x) * cam.zoom + view.w / 2;
    const sy = (p.y - cam.y) * cam.zoom + view.h / 2;
    ctx.globalAlpha = a;
    ctx.font = `800 ${p.size}px 'Trebuchet MS', system-ui, sans-serif`;
    ctx.lineWidth = 4;
    ctx.strokeStyle = 'rgba(4,20,40,0.65)';
    ctx.strokeText(p.text, sx, sy);
    ctx.fillStyle = p.color;
    ctx.fillText(p.text, sx, sy);
  }
  ctx.restore();
}

export function spawnRipple(fx, x, y, color = '#cdf6ff', radius = 40) {
  ring(fx, x, y, radius, hexA(color, 0.5), 2.4, 0.8);
}
