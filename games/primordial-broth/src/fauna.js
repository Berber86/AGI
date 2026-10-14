// fauna.js — the ecosystem: plankton, crumbs, debris, small cells, swarms, grazers,
// hunters and stinging spores. Each kind has its own steering and its own look.

import { PALETTES, WORLD } from './config.js';
import { drawCreature, createTrail, updateTrail } from './cell.js';
import { hexA, shade, bokehSprite } from './sprites.js';

export const KIND = {
  plankton: 'plankton',
  crumb: 'crumb',
  debris: 'debris',
  cell: 'cell',
  swarmling: 'swarmling',
  grazer: 'grazer',
  hunter: 'hunter',
  spore: 'spore',
};

export const REWARD = {
  plankton: 0.42, crumb: 0.24, cell: 1.35, swarmling: 0.9, debris: 3.4, grazer: 7.5, hunter: 6.5, spore: 0.6,
};

export const HOSTILE = new Set([KIND.hunter, KIND.spore, KIND.swarmling]);

let nextId = 1;

export function createEntity(kind, x, y, rng, opts = {}) {
  const pal = opts.palette || rng.pick(PALETTES);
  const e = {
    id: nextId++,
    kind,
    x, y, vx: 0, vy: 0,
    heading: rng.range(0, Math.PI * 2),
    radius: 6,
    hp: 10,
    maxHp: 10,
    palette: pal,
    parts: {},
    stage: 1,
    waveT: rng.range(0, 6.28),
    flagellaPhase: rng.range(0, 6.28),
    hitFlash: 0,
    stunT: 0,
    biteCd: 0,
    wanderT: rng.range(0, 3),
    think: rng.range(0, 0.6),
    eaten: false,
    age: 0,
    mouthOpen: 0,
    scale: 1,
    spin: rng.range(-0.4, 0.4),
    verts: null,
    simple: true,
  };

  switch (kind) {
    case KIND.plankton: {
      e.radius = rng.range(2.6, 6.2);
      e.hp = 1;
      e.glows = rng.next() < 0.35;
      e.palette = { body: '#bff6ff', belly: '#ffffff', stripe: '#4fd0e8', fin: '#e8ffff' };
      break;
    }
    case KIND.crumb: {
      e.radius = rng.range(3.4, 7.4);
      e.hp = 1;
      e.verts = makeVerts(rng, 7, 0.45);
      break;
    }
    case KIND.debris: {
      e.radius = opts.radius || rng.range(14, 30);
      e.hp = 24;
      e.verts = makeVerts(rng, 9, 0.34);
      e.rot = rng.range(0, 6.28);
      e.spin = rng.range(-0.12, 0.12);
      break;
    }
    case KIND.cell: {
      e.radius = opts.radius || rng.range(8, 17);
      e.stage = 1;
      e.parts = rng.next() < 0.35 ? { flagellum: 1 } : {};
      e.simple = false;
      break;
    }
    case KIND.swarmling: {
      e.radius = opts.radius || rng.range(5, 9.5);
      e.parts = { flagellum: 1 };
      break;
    }
    case KIND.grazer: {
      e.radius = opts.radius || rng.range(34, 54);
      e.stage = 3;
      e.parts = { flagellum: 2, cilia: rng.next() < 0.5 };
      e.palette = rng.pick([PALETTES[2], PALETTES[3], PALETTES[4]]);
      e.simple = false;
      break;
    }
    case KIND.hunter: {
      e.radius = opts.radius || rng.range(24, 46);
      e.stage = opts.stage || 3;
      e.parts = { flagellum: 2, spike: true, jaw: true, cilia: rng.next() < 0.4 };
      e.palette = { body: '#ff7a4d', belly: '#ffe0c8', stripe: '#8f2f1e', fin: '#ffc9a0', iris: '#3a0f06' };
      e.simple = false;
      break;
    }
    case KIND.spore: {
      e.radius = rng.range(9, 15);
      e.palette = { body: '#b687ff', belly: '#e8d8ff', stripe: '#6a3f9e', fin: '#d7bcff' };
      e.spikes = rng.int(5, 7);
      break;
    }
    default: break;
  }

  e.hp = e.maxHp = Math.max(e.hp, kind === KIND.hunter ? 30 : kind === KIND.grazer ? 20 : e.hp);
  if (!e.simple) e.trail = createTrail(200);
  return e;
}

function makeVerts(rng, n, jitter) {
  const out = [];
  for (let i = 0; i < n; i += 1) {
    out.push(1 - rng.next() * jitter);
  }
  return out;
}

// ------------------------------------------------------------------ steering

export function updateEntity(e, dt, ctx) {
  const { player, rng, water, quality } = ctx;
  e.age += dt;
  e.hitFlash = Math.max(0, e.hitFlash - dt * 3.2);
  e.waveT += dt;
  e.flagellaPhase += dt;
  e.biteCd = Math.max(0, e.biteCd - dt);
  e.mouthOpen = Math.max(0, e.mouthOpen - dt * 2.6);
  if (e.stunT > 0) {
    e.stunT -= dt;
    e.vx *= 0.92; e.vy *= 0.92;
    e.x += e.vx * dt; e.y += e.vy * dt;
    if (e.trail) updateTrail(e.trail, e.x, e.y);
    return;
  }

  const dx = e.x - player.x;
  const dy = e.y - player.y;
  const dist = Math.hypot(dx, dy) || 1;
  const playerThreat = player.radius / e.radius;

  e.think -= dt;
  let ax = 0;
  let ay = 0;

  switch (e.kind) {
    case KIND.plankton:
    case KIND.crumb: {
      const drift = Math.sin(e.waveT * 0.7 + e.id) * 4;
      e.vx = e.vx * 0.96 + Math.cos(e.heading) * 3 * dt + drift * dt;
      e.vy = e.vy * 0.96 + Math.sin(e.heading) * 3 * dt + Math.cos(e.waveT * 0.5) * 3 * dt;
      break;
    }
    case KIND.debris: {
      e.rot += e.spin * dt;
      e.vx *= 0.9; e.vy *= 0.9;
      break;
    }
    case KIND.spore: {
      e.vx = e.vx * 0.98 + Math.cos(e.heading) * 8 * dt;
      e.vy = e.vy * 0.98 + Math.sin(e.heading) * 8 * dt;
      if (e.think <= 0) { e.heading += rng.range(-0.8, 0.8); e.think = rng.range(1.2, 3); }
      break;
    }
    case KIND.swarmling:
    case KIND.cell: {
      // flee from anything that can swallow them, including the player
      const fleeRange = e.radius * (e.kind === KIND.swarmling ? 16 : 11);
      if (dist < fleeRange && playerThreat > 1.05) {
        const fear = (1 - dist / fleeRange) * (e.kind === KIND.swarmling ? 420 : 300);
        ax -= (dx / dist) * fear;
        ay -= (dy / dist) * fear;
      } else {
        if (e.think <= 0) {
          e.heading += rng.range(-1.1, 1.1);
          e.think = rng.range(0.8, 2.4);
        }
        // graze on plankton nearby
        ax += Math.cos(e.heading) * 60;
        ay += Math.sin(e.heading) * 60;
      }
      break;
    }
    case KIND.grazer: {
      if (e.think <= 0) { e.heading += rng.range(-0.5, 0.5); e.think = rng.range(1.5, 3.5); }
      ax += Math.cos(e.heading) * 34;
      ay += Math.sin(e.heading) * 34;
      if (dist < e.radius * 3.4 && player.radius >= e.radius) {
        ax += (dx / dist) * 90; ay += (dy / dist) * 90; // politely move away from a bigger cell
      }
      break;
    }
    case KIND.hunter: {
      const canEatPlayer = playerThreat < 0.88 && player.invulnT <= 0;
      if (canEatPlayer && dist < 900) {
        const speed = 190;
        ax += (-dx / dist) * speed * 1.6;
        ay += (-dy / dist) * speed * 1.6;
        e.mouthOpen = Math.min(1, e.mouthOpen + dt * 3);
      } else if (dist < 420 && playerThreat > 1.3) {
        const fear = (1 - dist / 420) * 300;
        ax += (dx / dist) * fear;
        ay += (dy / dist) * fear;
      } else {
        if (e.think <= 0) { e.heading += rng.range(-0.7, 0.7); e.think = rng.range(1.2, 2.8); }
        ax += Math.cos(e.heading) * 70;
        ay += Math.sin(e.heading) * 70;
      }
      break;
    }
    default: break;
  }

  const speedBase = e.kind === KIND.swarmling ? 235 : e.kind === KIND.hunter ? 205 : e.kind === KIND.cell ? 150 : e.kind === KIND.grazer ? 95 : 60;
  e.vx += ax * dt;
  e.vy += ay * dt;
  const damp = 1 - Math.min(0.95, (e.kind === KIND.plankton || e.kind === KIND.crumb ? 0.6 : 2.2) * dt);
  e.vx *= damp;
  e.vy *= damp;
  const sp = Math.hypot(e.vx, e.vy);
  const cap = speedBase * (e.stunT > 0 ? 0.2 : 1);
  if (sp > cap) { e.vx = (e.vx / sp) * cap; e.vy = (e.vy / sp) * cap; }

  e.x += e.vx * dt;
  e.y += e.vy * dt;

  // soft world bounds; plankton/crumbs wrap around the player's neighbourhood
  e.x = Math.max(-200, Math.min(WORLD.w + 200, e.x));
  e.y = Math.max(-200, Math.min(WORLD.h + 200, e.y));

  if (sp > 8) e.heading = Math.atan2(e.vy, e.vx);
  if (e.trail) updateTrail(e.trail, e.x, e.y);

  void quality; void water;
}

// ------------------------------------------------------------------ drawing

export function drawEntity(ctx, e, time) {
  switch (e.kind) {
    case KIND.plankton: return drawPlankton(ctx, e, time);
    case KIND.crumb: return drawDebrisLike(ctx, e, '#c9a86b', '#8a6f42', time, true);
    case KIND.debris: return drawDebrisLike(ctx, e, '#b9c6d0', '#6d7c8a', time, false);
    case KIND.spore: return drawSpore(ctx, e, time);
    case KIND.swarmling: return drawSimpleCell(ctx, e, time, 0.86);
    case KIND.cell: return drawSimpleCell(ctx, e, time, 1);
    default: return drawCreature(ctx, e, time);
  }
}

function drawPlankton(ctx, e, time) {
  const r = e.radius;
  const pulse = 1 + 0.12 * Math.sin(time * 2 + e.id);
  // cheap glow: one small cached sprite instead of a per-frame full-size blit
  const s = r * 3.4 * pulse;
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  ctx.globalAlpha = e.glows ? 0.5 : 0.34;
  ctx.drawImage(bokehSprite(e.glows ? '#9ff6ff' : '#d8fbff', 0.5), e.x - s / 2, e.y - s / 2, s, s);
  ctx.restore();
  ctx.beginPath();
  ctx.arc(e.x, e.y, r * pulse, 0, Math.PI * 2);
  ctx.fillStyle = e.glows ? '#eaffff' : '#dff7ff';
  ctx.fill();
  if (r > 4.2) {
    ctx.beginPath();
    ctx.arc(e.x + r * 0.2, e.y - r * 0.25, r * 0.45 * pulse, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(120,220,240,0.85)';
    ctx.fill();
  }
}

function drawDebrisLike(ctx, e, c1, c2, time, small) {
  const r = e.radius;
  const verts = e.verts || makeVerts({ next: () => 0.5, range: (a, b) => (a + b) / 2 }, 7, 0.4);
  ctx.save();
  ctx.translate(e.x, e.y);
  ctx.rotate(e.rot || 0);
  ctx.beginPath();
  for (let i = 0; i < verts.length; i += 1) {
    const a = (i / verts.length) * Math.PI * 2;
    const rr = r * verts[i];
    const x = Math.cos(a) * rr;
    const y = Math.sin(a) * rr;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.closePath();
  const g = ctx.createLinearGradient(-r, -r, r, r);
  g.addColorStop(0, shade(c1, 0.25));
  g.addColorStop(0.55, c1);
  g.addColorStop(1, c2);
  ctx.fillStyle = g;
  ctx.fill();
  ctx.strokeStyle = 'rgba(30,45,60,0.55)';
  ctx.lineWidth = Math.max(0.8, r * 0.09);
  ctx.stroke();
  if (!small) {
    // crystal facets catching the light
    ctx.save();
    ctx.clip();
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 3; i += 1) {
      const a = time * 0.2 + i * 2.1;
      ctx.fillStyle = hexA('#bfe9ff', 0.12 + 0.08 * Math.sin(time + i));
      ctx.beginPath();
      ctx.ellipse(Math.cos(a) * r * 0.4, Math.sin(a) * r * 0.4, r * 0.5, r * 0.22, a, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
  ctx.restore();
}

function drawSpore(ctx, e, time) {
  const r = e.radius;
  const pulse = 0.9 + 0.1 * Math.sin(time * 3 + e.id);
  ctx.save();
  ctx.translate(e.x, e.y);
  ctx.rotate(e.age * 0.3);
  ctx.globalCompositeOperation = 'source-over';
  // spikes
  ctx.fillStyle = hexA('#c79bff', 0.85);
  for (let i = 0; i < e.spikes; i += 1) {
    const a = (i / e.spikes) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(Math.cos(a - 0.16) * r * 0.8, Math.sin(a - 0.16) * r * 0.8);
    ctx.lineTo(Math.cos(a) * r * 1.65 * pulse, Math.sin(a) * r * 1.65 * pulse);
    ctx.lineTo(Math.cos(a + 0.16) * r * 0.8, Math.sin(a + 0.16) * r * 0.8);
    ctx.closePath();
    ctx.fill();
  }
  const g = ctx.createRadialGradient(-r * 0.3, -r * 0.35, r * 0.1, 0, 0, r);
  g.addColorStop(0, hexA('#f0e2ff', 0.95));
  g.addColorStop(0.6, hexA('#b687ff', 0.85));
  g.addColorStop(1, hexA('#7a4fd0', 0.9));
  ctx.beginPath();
  ctx.arc(0, 0, r * pulse, 0, Math.PI * 2);
  ctx.fillStyle = g;
  ctx.fill();
  ctx.strokeStyle = 'rgba(90,50,150,0.6)';
  ctx.lineWidth = Math.max(0.8, r * 0.07);
  ctx.stroke();
  ctx.restore();
}

/** Lighter cell renderer for the small critters: cheap but still characterful. */
function drawSimpleCell(ctx, e, time, detail) {
  const r = e.radius;
  const target = Math.atan2(e.vy, e.vx);
  let diff = target - e.heading;
  while (diff > Math.PI) diff -= Math.PI * 2;
  while (diff < -Math.PI) diff += Math.PI * 2;
  e.heading += diff * 0.12;
  const hx = Math.cos(e.heading);
  const hy = Math.sin(e.heading);
  const nx = -hy;
  const ny = hx;
  const pal = e.palette;
  const len = r * 1.55;

  // tail
  ctx.save();
  ctx.lineCap = 'round';
  const phase = e.waveT * 12;
  for (let i = 1; i <= 5; i += 1) {
    const t = i / 5;
    const wob = Math.sin(phase - i * 0.7) * r * 0.5 * t;
    ctx.beginPath();
    ctx.moveTo(e.x - hx * (r * 0.9 + len * t), e.y - hy * (r * 0.9 + len * t));
    ctx.lineTo(
      e.x - hx * (r * 0.9 + len * (t + 0.2)) + nx * wob,
      e.y - hy * (r * 0.9 + len * (t + 0.2)) + ny * wob,
    );
    ctx.lineWidth = Math.max(0.8, r * 0.22 * (1 - t) + 0.6);
    ctx.strokeStyle = `rgba(255,235,215,${0.85 - t * 0.4})`;
    ctx.stroke();
  }
  ctx.restore();

  // body — flat fill plus a highlight keeps hundreds of critters affordable
  ctx.save();
  ctx.translate(e.x, e.y);
  ctx.rotate(e.heading);
  ctx.fillStyle = pal.body;
  ctx.beginPath();
  ctx.ellipse(0, 0, r * 1.25, r * 0.86, 0, 0, Math.PI * 2);
  ctx.fill();
  if (detail > 0.9) {
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 1.25, r * 0.86, 0, 0, Math.PI * 2);
    ctx.clip();
    ctx.fillStyle = hexA(pal.stripe, 0.8);
    for (let i = -2; i <= 2; i += 1) {
      ctx.beginPath();
      ctx.ellipse(i * r * 0.44, 0, r * 0.11, r * 1.1, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
  ctx.strokeStyle = 'rgba(40,16,10,0.45)';
  ctx.lineWidth = Math.max(0.8, r * 0.1);
  ctx.beginPath();
  ctx.ellipse(0, 0, r * 1.25, r * 0.86, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = 'rgba(255,255,255,0.20)';
  ctx.beginPath();
  ctx.ellipse(-r * 0.25, -r * 0.35, r * 0.55, r * 0.26, -0.35, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.12)';
  ctx.beginPath();
  ctx.ellipse(r * 0.1, r * 0.35, r * 0.8, r * 0.3, 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  // eyes
  const eyeR = Math.max(1.9, r * 0.3);
  for (const side of [-1, 1]) {
    const ex = r * 0.62;
    const ey = side * r * 0.36;
    ctx.fillStyle = '#fffdf6';
    ctx.beginPath();
    ctx.arc(ex, ey, eyeR, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = pal.iris || '#4a1f0c';
    ctx.beginPath();
    ctx.arc(ex + eyeR * 0.25, ey, eyeR * 0.55, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.beginPath();
    ctx.arc(ex - eyeR * 0.3, ey - eyeR * 0.35, eyeR * 0.28, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}
