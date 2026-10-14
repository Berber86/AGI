// cell.js — procedural creature rendering.
// The body is built along the *trail* of recent head positions, so it bends like a real
// swimmer instead of a rotating sprite. Everything (stripes, eyes, spikes, flagella,
// jaws, electric arcs) is drawn with canvas primitives — no image assets.

import { hexA, shade } from './sprites.js';

export function withWorldTransform(ctx, cam, view) {
  ctx.save();
  ctx.translate(view.w / 2 + cam.shakeX, view.h / 2 + cam.shakeY);
  ctx.scale(cam.zoom, cam.zoom);
  ctx.translate(-cam.x, -cam.y);
}

// ---------------------------------------------------------------- trail buffers

export function createTrail(capacity = 220) {
  return { xs: new Float32Array(capacity), ys: new Float32Array(capacity), n: 0, head: 0, cap: capacity };
}

/** Hard-reset a trail so the body is drawn at `x,y` (used after teleports and respawns). */
export function resetTrail(trail, x, y) {
  trail.xs[0] = x;
  trail.ys[0] = y;
  trail.head = 1 % trail.cap;
  trail.n = 1;
}

export function updateTrail(trail, x, y) {
  const last = trail.n > 0 ? (trail.head - 1 + trail.cap) % trail.cap : -1;
  if (last >= 0) {
    const dx = x - trail.xs[last];
    const dy = y - trail.ys[last];
    if (dx * dx + dy * dy < 1) return; // ignore sub-pixel jitter
  }
  trail.xs[trail.head] = x;
  trail.ys[trail.head] = y;
  trail.head = (trail.head + 1) % trail.cap;
  trail.n = Math.min(trail.n + 1, trail.cap);
}

/** Walk back from the head and return `count` points spaced by arc length.
 *  When the trail is shorter than the body (a resting cell, or right after a teleport)
 *  the remaining points are extrapolated backwards so the body keeps its volume. */
export function sampleSpine(trail, totalLength, count, out, fallbackDir) {
  const pts = out || new Array(count);
  const desired = totalLength / (count - 1 || 1);
  let idx = trail.head - 1;
  let acc = 0;
  let written = 0;
  let curX = trail.xs[(idx + trail.cap) % trail.cap];
  let curY = trail.ys[(idx + trail.cap) % trail.cap];
  pts[0] = pts[0] || { x: 0, y: 0 };
  pts[0].x = curX; pts[0].y = curY;
  written = 1;
  let travelled = 0;
  let guard = 0;
  while (written < count && guard < trail.cap * 2) {
    guard += 1;
    const prev = (idx - 1 + trail.cap) % trail.cap;
    if (idx - 1 < trail.head - trail.n) break;
    const px = trail.xs[prev];
    const py = trail.ys[prev];
    const seg = Math.hypot(px - curX, py - curY);
    if (seg < 1e-4) { idx -= 1; continue; }
    acc += seg;
    travelled += seg;
    if (travelled >= desired) {
      const nx = px; const ny = py;
      pts[written] = pts[written] || { x: 0, y: 0 };
      pts[written].x = nx; pts[written].y = ny;
      written += 1;
      travelled -= desired;
    }
    curX = px; curY = py;
    idx -= 1;
  }
  if (written < count) {
    // direction pointing from the head towards the tail
    let dirX;
    let dirY;
    if (written >= 2) {
      dirX = pts[written - 1].x - pts[0].x;
      dirY = pts[written - 1].y - pts[0].y;
    } else if (fallbackDir) {
      dirX = -fallbackDir.x;
      dirY = -fallbackDir.y;
    } else {
      dirX = -1; dirY = 0;
    }
    const dl = Math.hypot(dirX, dirY) || 1;
    dirX /= dl; dirY /= dl;
    let lastX = pts[written - 1].x;
    let lastY = pts[written - 1].y;
    while (written < count) {
      lastX += dirX * desired;
      lastY += dirY * desired;
      pts[written] = pts[written] || { x: 0, y: 0 };
      pts[written].x = lastX;
      pts[written].y = lastY;
      written += 1;
    }
  }
  return pts;
}

// ---------------------------------------------------------------- shape maths

/** Half-width profile along the body: rounded nose, fat middle, tapered tail. */
export function bodyWidth(t) {
  // Smooth teardrop: blunt rounded nose, fattest around t≈0.42, tapering to a
  // rounded tail tip. sin()^k has zero derivative at both ends, so the outline
  // has no sharp corners — the reference creature is a soft "flag" shape.
  const s = Math.sin(Math.PI * Math.min(1, Math.max(0, t)));
  const profile = Math.pow(s, 0.55);
  const forward = 1 - 0.22 * t;          // keeps the body fat just behind the nose
  const bluntNose = t < 0.14 ? Math.sqrt(1 - Math.pow(1 - t / 0.14, 2)) : 1;
  return profile * forward * bluntNose * 1.16;
}

function ensureScratch(c, sampleCount) {
  if (!c._spine || c._spine.length !== sampleCount) {
    c._spine = new Array(sampleCount);
    for (let i = 0; i < sampleCount; i += 1) c._spine[i] = { x: 0, y: 0 };
  }
  return c._spine;
}

// ---------------------------------------------------------------- creature draw

const SEG = 34;

export function drawCreature(ctx, c, time) {
  const r = c.radius;
  const bodyLen = r * (c.bodyStretch || 3.3);
  const heading = c.heading ?? Math.atan2(c.vy || 0, c.vx || 0);
  const forward = { x: Math.cos(heading), y: Math.sin(heading) };
  const spine = sampleSpine(c.trail, bodyLen, SEG, ensureScratch(c, SEG), forward);

  // travelling wave makes even a resting cell look alive
  const speedRatio = Math.min(1, Math.hypot(c.vx, c.vy) / 260);
  const waveAmp = r * (0.10 + 0.16 * (1 - speedRatio));
  const wavePhase = (c.waveT || 0) * (5.5 + 4 * speedRatio);
  const lenScale = c.len || 1;

  const left = c._left || (c._left = new Array(SEG));
  const right = c._right || (c._right = new Array(SEG));
  for (let i = 0; i < SEG; i += 1) {
    const t = i / (SEG - 1);
    const p = spine[i];
    const q = spine[Math.min(SEG - 1, i + 1)];
    const pp = spine[Math.max(0, i - 1)];
    let tx = q.x - pp.x;
    let ty = q.y - pp.y;
    const l = Math.hypot(tx, ty) || 1;
    tx /= l; ty /= l;
    const nx = -ty;
    const ny = tx;
    const wave = Math.sin(wavePhase - t * 4.2) * waveAmp * (0.25 + t * 0.75);
    const w = bodyWidth(t) * r * lenScale;
    const cx = p.x + nx * wave;
    const cy = p.y + ny * wave;
    left[i] = left[i] || { x: 0, y: 0 };
    right[i] = right[i] || { x: 0, y: 0 };
    left[i].x = cx + nx * w; left[i].y = cy + ny * w;
    right[i].x = cx - nx * w; right[i].y = cy - ny * w;
  }

  const head = spine[0];
  const tail = spine[SEG - 1];
  let hx = tail.x - head.x;
  let hy = tail.y - head.y;
  const hl = Math.hypot(hx, hy) || 1;
  hx /= hl; hy /= hl;

  const bodyPath = () => {
    ctx.beginPath();
    ctx.moveTo(left[0].x, left[0].y);
    for (let i = 1; i < SEG; i += 1) ctx.lineTo(left[i].x, left[i].y);
    for (let i = SEG - 1; i >= 0; i -= 1) ctx.lineTo(right[i].x, right[i].y);
    ctx.closePath();
  };

  const pal = c.palette;
  const grad = ctx.createLinearGradient(
    head.x - hx * r * 0.6 + -hy * r * 1.5,
    head.y - hy * r * 0.6 + hx * r * 1.5,
    head.x - hx * r * 0.6 - -hy * r * 1.5,
    head.y - hy * r * 0.6 - hx * r * 1.5,
  );
  grad.addColorStop(0, shade(pal.body, 0.16));
  grad.addColorStop(0.45, pal.body);
  grad.addColorStop(1, shade(pal.body, -0.30));

  // soft contact shadow in the water
  ctx.save();
  ctx.globalAlpha = 0.14;
  ctx.fillStyle = '#04203c';
  ctx.filter = 'blur(3px)';
  ctx.translate(r * 0.1, r * 0.22);
  bodyPath();
  ctx.fill();
  ctx.filter = 'none';
  ctx.restore();

  // body
  bodyPath();
  ctx.fillStyle = grad;
  ctx.fill();

  // stripes
  ctx.save();
  bodyPath();
  ctx.clip();
  ctx.globalAlpha = 0.88;
  ctx.fillStyle = pal.stripe;
  const stripeCount = 9;
  for (let s = 0; s < stripeCount; s += 1) {
    const t = 0.12 + (s / (stripeCount - 1)) * 0.74;
    const i = Math.round(t * (SEG - 1));
    const p = spine[i];
    const n = { x: -(spine[Math.min(SEG - 1, i + 1)].y - spine[Math.max(0, i - 1)].y), y: 0 };
    const txv = spine[Math.min(SEG - 1, i + 1)].x - spine[Math.max(0, i - 1)].x;
    const tyv = spine[Math.min(SEG - 1, i + 1)].y - spine[Math.max(0, i - 1)].y;
    const l = Math.hypot(txv, tyv) || 1;
    n.x = -tyv / l; n.y = txv / l;
    const halfW = (bodyWidth(t) * r * lenScale) * 1.25 + r * 0.12;
    const thick = r * 0.115;
    const along = thick * 0.5;
    ctx.beginPath();
    ctx.moveTo(p.x + n.x * halfW - txv / l * along, p.y + n.y * halfW - tyv / l * along);
    ctx.lineTo(p.x - n.x * halfW - txv / l * along, p.y - n.y * halfW - tyv / l * along);
    ctx.lineTo(p.x - n.x * halfW + txv / l * along, p.y - n.y * halfW + tyv / l * along);
    ctx.lineTo(p.x + n.x * halfW + txv / l * along, p.y + n.y * halfW + tyv / l * along);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  // highlight + rim light
  ctx.save();
  bodyPath();
  ctx.clip();
  const hl2 = ctx.createRadialGradient(
    head.x - hy * r * 0.55, head.y + hx * r * 0.55, r * 0.05,
    head.x - hy * r * 0.55, head.y + hx * r * 0.55, r * 1.25,
  );
  hl2.addColorStop(0, 'rgba(255,255,255,0.34)');
  hl2.addColorStop(0.5, 'rgba(255,255,255,0.07)');
  hl2.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = hl2;
  ctx.fillRect(head.x - r * 2.4, head.y - r * 2.4, r * 4.8, r * 4.8);
  ctx.restore();

  // outline
  bodyPath();
  ctx.strokeStyle = 'rgba(40,16,10,0.5)';
  ctx.lineWidth = Math.max(1, r * 0.09);
  ctx.lineJoin = 'round';
  ctx.stroke();

  if (c.hitFlash > 0) {
    ctx.save();
    bodyPath();
    ctx.globalAlpha = Math.min(0.7, c.hitFlash);
    ctx.fillStyle = '#fff4f0';
    ctx.fill();
    ctx.restore();
  }

  drawParts(ctx, c, spine, bodyLen, r, time);

  // eyes — always on top, they sell the character
  const look = Math.min(1, Math.hypot(c.vx, c.vy) / 200);
  const eyeR = Math.max(3.4, r * 0.30);
  const eyeSpread = r * 0.30;
  const eyeFwd = r * 0.62;
  const lookX = (c.vx / (Math.hypot(c.vx, c.vy) || 1)) * eyeR * 0.22 * look;
  const lookY = (c.vy / (Math.hypot(c.vx, c.vy) || 1)) * eyeR * 0.22 * look;
  for (const side of [-1, 1]) {
    const ex = head.x + hx * eyeFwd + -hy * eyeSpread * side;
    const ey = head.y + hy * eyeFwd + hx * eyeSpread * side;
    // dark rim so the eyes read against a bright body
    ctx.fillStyle = 'rgba(52,20,8,0.55)';
    ctx.beginPath();
    ctx.arc(ex, ey, eyeR * 1.14, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fffdf6';
    ctx.beginPath();
    ctx.arc(ex, ey, eyeR, 0, Math.PI * 2);
    ctx.fill();
    const iris = pal.iris || '#5a2a12';
    ctx.fillStyle = iris;
    ctx.beginPath();
    ctx.arc(ex + lookX, ey + lookY, eyeR * 0.56, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#140803';
    ctx.beginPath();
    ctx.arc(ex + lookX * 1.2, ey + lookY * 1.2, eyeR * 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    ctx.beginPath();
    ctx.arc(ex - eyeR * 0.34 + lookX, ey - eyeR * 0.36 + lookY, eyeR * 0.24, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawParts(ctx, c, spine, bodyLen, r, time) {
  const head = spine[0];
  const tail = spine[SEG - 1];
  // hx/hy point from head to tail (backwards); fx/fy are the true "forward" axes
  let hx = tail.x - head.x;
  let hy = tail.y - head.y;
  const hl = Math.hypot(hx, hy) || 1;
  hx /= hl; hy /= hl;
  const fx = -hx;
  const fy = -hy;
  const nx = -hy;
  const ny = hx;
  const parts = c.parts || {};

  // --- cilia: a fringe of beating hairs (drawn before the spikes) ---
  // --- cilia: a fringe of beating hairs ---
  if (parts.cilia) {
    ctx.strokeStyle = 'rgba(226,250,255,0.72)';
    ctx.lineWidth = Math.max(1, r * 0.032);
    ctx.lineCap = 'round';
    const rows = Math.max(5, Math.min(16, Math.round(r * 0.075) + 5));
    for (const side of [-1, 1]) {
      ctx.beginPath();
      for (let i = 0; i < rows; i += 1) {
        const idx = 2 + Math.round((i / (rows - 1)) * (SEG - 4));
        const p = spine[idx];
        const q = spine[Math.min(SEG - 1, idx + 1)];
        const tx = q.x - p.x; const ty = q.y - p.y;
        const l = Math.hypot(tx, ty) || 1;
        const px = -ty / l * side;
        const py = tx / l * side;
        const w = bodyWidth(idx / (SEG - 1)) * r;
        const beat = Math.sin(time * 9 - i * 0.6) * 0.35 + 0.8;
        const sx = p.x + px * w * 0.97;
        const sy = p.y + py * w * 0.97;
        const ex = sx + px * Math.min(r * 0.26, 16) * beat + tx / l * r * 0.08;
        const ey = sy + py * Math.min(r * 0.26, 16) * beat + ty / l * r * 0.08;
        ctx.moveTo(sx, sy);
        ctx.lineTo(ex, ey);
      }
      ctx.stroke();
    }
  }

  // --- spikes ---
  if (parts.spike) {
    const n = Math.max(3, Math.min(8, Math.round(r * 0.035) + 3));
    for (const side of [-1, 1]) {
      for (let i = 0; i < n; i += 1) {
        const t = 0.12 + (i / (n - 1)) * 0.68;
        const idx = Math.round(t * (SEG - 1));
        const p = spine[idx];
        const q = spine[Math.min(SEG - 1, idx + 1)];
        const tx = q.x - p.x; const ty = q.y - p.y;
        const l = Math.hypot(tx, ty) || 1;
        const px = -ty / l * side;
        const py = tx / l * side;
        const w = bodyWidth(t) * r;
        const bx = p.x + px * w;
        const by = p.y + py * w;
        const len = r * 0.30 * (1 - t * 0.3);
        ctx.beginPath();
        ctx.moveTo(bx - tx / l * r * 0.1, by - ty / l * r * 0.1);
        ctx.lineTo(bx + px * len + tx / l * r * 0.04, by + py * len + ty / l * r * 0.04);
        ctx.lineTo(bx + tx / l * r * 0.12, by + ty / l * r * 0.12);
        ctx.closePath();
        const g = ctx.createLinearGradient(bx, by, bx + px * len, by + py * len);
        g.addColorStop(0, hexA(parts.spikeColor || '#ff9f6a', 0.95));
        g.addColorStop(1, hexA(parts.spikeColor || '#ffd9b0', 0.85));
        ctx.fillStyle = g;
        ctx.fill();
        ctx.strokeStyle = 'rgba(90,40,20,0.45)';
        ctx.lineWidth = Math.max(0.7, r * 0.03);
        ctx.stroke();
      }
    }
  }

  // --- venom sacs ---
  if (parts.venom) {
    for (let i = 0; i < 3; i += 1) {
      const t = 0.22 + i * 0.2;
      const idx = Math.round(t * (SEG - 1));
      const p = spine[idx];
      const q = spine[Math.min(SEG - 1, idx + 1)];
      const tx = q.x - p.x; const ty = q.y - p.y;
      const l = Math.hypot(tx, ty) || 1;
      const px = -ty / l;
      const py = tx / l;
      const w = bodyWidth(t) * r * 0.66;
      for (const side of [-1, 1]) {
        const cx = p.x + px * w * side;
        const cy = p.y + py * w * side;
        ctx.beginPath();
        ctx.arc(cx, cy, r * 0.125, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(182,135,255,0.55)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(120,70,190,0.6)';
        ctx.lineWidth = Math.max(0.7, r * 0.025);
        ctx.stroke();
      }
    }
  }

  // --- electric arcs ---
  if (parts.electric) {
    const pulse = 0.35 + 0.65 * Math.max(0, Math.sin(time * 2.2));
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = hexA('#9ff0ff', 0.75 * pulse);
    ctx.lineWidth = Math.max(1, r * 0.05);
    ctx.lineJoin = 'round';
    for (let a = 0; a < 3; a += 1) {
      const baseT = 0.2 + a * 0.22;
      const idx = Math.round(baseT * (SEG - 1));
      const p = spine[idx];
      const ang = time * 3 + a * 2.1;
      const rr = r * 0.9;
      ctx.beginPath();
      for (let s = 0; s <= 6; s += 1) {
        const q = s / 6;
        const aa = ang + q * 1.6;
        const jitter = 0.75 + 0.25 * Math.sin(time * 22 + s * 2.4);
        const x = p.x + Math.cos(aa) * rr * q * jitter;
        const y = p.y + Math.sin(aa) * rr * q * jitter;
        if (s === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    ctx.restore();
  }

  // --- stinger at the nose ---
  if (parts.stinger) {
    const size = r * 0.72 * (1 + 0.12 * Math.sin(time * 6));
    const bx = head.x + fx * r * 0.42;
    const by = head.y + fy * r * 0.42;
    ctx.beginPath();
    ctx.moveTo(bx + nx * r * 0.1, by + ny * r * 0.1);
    ctx.lineTo(bx + fx * size, by + fy * size);
    ctx.lineTo(bx - nx * r * 0.1, by - ny * r * 0.1);
    ctx.closePath();
    const g = ctx.createLinearGradient(bx, by, bx + fx * size, by + fy * size);
    g.addColorStop(0, '#ffd9ec');
    g.addColorStop(1, '#ff4f9b');
    ctx.fillStyle = g;
    ctx.fill();
    ctx.strokeStyle = 'rgba(120,20,70,0.5)';
    ctx.lineWidth = Math.max(0.7, r * 0.03);
    ctx.stroke();
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = 'rgba(255,120,200,0.35)';
    ctx.beginPath();
    ctx.arc(bx + fx * size * 0.4, by + fy * size * 0.4, r * 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // --- jaws ---
  if (parts.jaw) {
    const open = c.mouthOpen || 0;
    const w = r * 0.5;
    for (const side of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(head.x + fx * r * 0.42, head.y + fy * r * 0.42);
      ctx.quadraticCurveTo(
        head.x + fx * r * 0.62 + nx * side * (w * 0.45 + open * r * 0.4),
        head.y + fy * r * 0.62 + ny * side * (w * 0.45 + open * r * 0.4),
        head.x + fx * r * 0.16 + nx * side * (w * 1.05 + open * r * 0.55),
        head.y + fy * r * 0.16 + ny * side * (w * 1.05 + open * r * 0.55),
      );
      ctx.quadraticCurveTo(
        head.x + fx * r * 0.3 + nx * side * w * 0.55,
        head.y + fy * r * 0.3 + ny * side * w * 0.55,
        head.x + fx * r * 0.42,
        head.y + fy * r * 0.42,
      );
      ctx.closePath();
      ctx.fillStyle = side > 0 ? '#ffb27a' : '#ffd0a0';
      ctx.fill();
      ctx.strokeStyle = 'rgba(120,50,20,0.55)';
      ctx.lineWidth = Math.max(0.8, r * 0.035);
      ctx.stroke();
    }
  }

  // --- flagella: long whipping tails ---
  if (parts.flagellum) {
    const count = Math.min(3, parts.flagellum);
    const baseLen = r * (3.1 + 0.42 * count);
    for (let f = 0; f < count; f += 1) {
      const spread = (f - (count - 1) / 2) * r * 0.34;
      let px = tail.x + nx * spread;
      let py = tail.y + ny * spread;
      const segs = 18;
      const segLen = baseLen / segs;
      const phase = (c.flagellaPhase || 0) * (6 + 5 * Math.min(1, Math.hypot(c.vx, c.vy) / 220)) + f * 0.9;
      ctx.lineCap = 'round';
      for (let s = 0; s < segs; s += 1) {
        const wave = Math.sin(phase - s * 0.5) * r * 0.34 * (s / segs);
        const nxx = -hy;
        const nyy = hx;
        const nx2 = px + hx * segLen + nxx * (Math.sin(phase - (s + 1) * 0.5) * r * 0.34 * ((s + 1) / segs));
        const ny2 = py + hy * segLen + nyy * (Math.sin(phase - (s + 1) * 0.5) * r * 0.34 * ((s + 1) / segs));
        ctx.beginPath();
        ctx.moveTo(px + nxx * wave * 0.15, py + nyy * wave * 0.15);
        ctx.lineTo(nx2, ny2);
        ctx.lineWidth = Math.max(1, Math.min(r * 0.11, 9) * (1 - s / segs) + 0.7);
        ctx.strokeStyle = `rgba(255,${Math.round(242 - s * 3)},236,${0.62 - (s / segs) * 0.28})`;
        ctx.stroke();
        px = nx2; py = ny2;
      }
      // glowing tip
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = 'rgba(255,220,160,0.35)';
      ctx.beginPath();
      ctx.arc(px, py, r * 0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }
}

export function trailLength(c) {
  return c.radius * (c.bodyStretch || 3.3);
}
