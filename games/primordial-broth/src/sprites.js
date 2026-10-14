// sprites.js — cached offscreen sprites. Nothing here is downloaded: the whole look is
// generated procedurally, which keeps the asset budget near zero and the style consistent.

const cache = new Map();

function makeCanvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
}

/** Soft round blob used for bokeh, glows and light pools. */
export function bokehSprite(color, soft = 0.55) {
  const key = `bokeh:${color}:${soft}`;
  if (cache.has(key)) return cache.get(key);
  const size = 256;
  const c = makeCanvas(size, size);
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(size / 2, size / 2, size * 0.02, size / 2, size / 2, size / 2);
  g.addColorStop(0, hexA(color, 0.95));
  g.addColorStop(soft, hexA(color, 0.45));
  g.addColorStop(0.82, hexA(color, 0.12));
  g.addColorStop(1, hexA(color, 0));
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  ctx.fill();
  cache.set(key, c);
  return c;
}

/** Ring-shaped bokeh with a bright rim — the classic "out of focus" lens bubble. */
export function bokehRingSprite(color) {
  const key = `ring:${color}`;
  if (cache.has(key)) return cache.get(key);
  const size = 256;
  const c = makeCanvas(size, size);
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(size / 2, size / 2, size * 0.18, size / 2, size / 2, size / 2);
  g.addColorStop(0, hexA(color, 0.06));
  g.addColorStop(0.62, hexA(color, 0.16));
  g.addColorStop(0.86, hexA(color, 0.5));
  g.addColorStop(0.97, hexA(color, 0.22));
  g.addColorStop(1, hexA(color, 0));
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  ctx.fill();
  cache.set(key, c);
  return c;
}

/** Soap-bubble with a rim and a highlight; used for free-floating bubbles. */
export function bubbleSprite() {
  const key = 'bubble';
  if (cache.has(key)) return cache.get(key);
  const size = 128;
  const c = makeCanvas(size, size);
  const ctx = c.getContext('2d');
  const r = size / 2 - 2;
  const body = ctx.createRadialGradient(size * 0.4, size * 0.38, r * 0.1, size / 2, size / 2, r);
  body.addColorStop(0, 'rgba(255,255,255,0.30)');
  body.addColorStop(0.65, 'rgba(200,240,255,0.10)');
  body.addColorStop(1, 'rgba(160,220,255,0.05)');
  ctx.fillStyle = body;
  ctx.beginPath(); ctx.arc(size / 2, size / 2, r, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.75)';
  ctx.lineWidth = size * 0.055;
  ctx.beginPath(); ctx.arc(size / 2, size / 2, r * 0.93, 0, Math.PI * 2); ctx.stroke();
  ctx.strokeStyle = 'rgba(255,255,255,0.35)';
  ctx.lineWidth = size * 0.03;
  ctx.beginPath(); ctx.arc(size / 2, size / 2, r * 0.78, Math.PI * 0.15, Math.PI * 0.75); ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.beginPath();
  ctx.ellipse(size * 0.38, size * 0.34, r * 0.16, r * 0.11, -0.5, 0, Math.PI * 2);
  ctx.fill();
  cache.set(key, c);
  return c;
}

/** Tileable caustic pattern: only soft radial gradients, each drawn with wrapped copies
 *  in all 8 neighbouring cells, so the tile repeats with no visible seams. */
export function causticTile(seedRnd) {
  const key = `caustic:${seedRnd}`;
  if (cache.has(key)) return cache.get(key);
  const size = 512;
  const c = makeCanvas(size, size);
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, size, size);
  const rand = mulberry(seedRnd);
  ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 46; i += 1) {
    const x = rand() * size;
    const y = rand() * size;
    const r = 40 + rand() * 120;
    const ry = r * (0.35 + rand() * 0.5);
    const rot = rand() * Math.PI;
    const alpha = 0.10 + rand() * 0.20;
    for (let dx = -1; dx <= 1; dx += 1) {
      for (let dy = -1; dy <= 1; dy += 1) {
        const cx = x + dx * size;
        const cy = y + dy * size;
        const g = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
        g.addColorStop(0, `rgba(255,255,255,${alpha})`);
        g.addColorStop(0.55, `rgba(200,240,255,${alpha * 0.45})`);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rot);
        ctx.scale(1, ry / r);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
  }
  cache.set(key, c);
  return c;
}

export function clearSpriteCache() { cache.clear(); }

function mulberry(a) {
  return function next() {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hexA(hex, alpha) {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((ch) => ch + ch).join('') : h;
  const n = parseInt(full, 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}

export function shade(hex, amount) {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((ch) => ch + ch).join('') : h;
  const n = parseInt(full, 16);
  const clamp = (v) => Math.max(0, Math.min(255, Math.round(v)));
  let r = (n >> 16) & 255;
  let g = (n >> 8) & 255;
  let b = n & 255;
  if (amount >= 0) {
    r = clamp(r + (255 - r) * amount); g = clamp(g + (255 - g) * amount); b = clamp(b + (255 - b) * amount);
  } else {
    r = clamp(r * (1 + amount)); g = clamp(g * (1 + amount)); b = clamp(b * (1 + amount));
  }
  return `rgb(${r},${g},${b})`;
}
