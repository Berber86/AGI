// util.js — математика, случайность, вспомогательные структуры.
// Никаких зависимостей: модуль пригоден для тестов в Node.

export const TAU = Math.PI * 2;
export const DEG = Math.PI / 180;

export const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
export const lerp = (a, b, t) => a + (b - a) * t;
export const invLerp = (a, b, v) => (b === a ? 0 : clamp((v - a) / (b - a), 0, 1));
export const smoothstep = (t) => { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };

// Кадронезависимое сглаживание (экспоненциальное приближение).
export const damp = (cur, target, lambda, dt) => lerp(cur, target, 1 - Math.exp(-lambda * dt));

export const dist2 = (ax, ay, bx, by) => { const dx = bx - ax, dy = by - ay; return dx * dx + dy * dy; };
export const dist = (ax, ay, bx, by) => Math.sqrt(dist2(ax, ay, bx, by));
export const hypot = (x, y) => Math.sqrt(x * x + y * y);

// Кратчайшая разница углов (радианы, результат в [-PI, PI]).
export function angleDiff(a, b) {
  let d = (b - a) % TAU;
  if (d > Math.PI) d -= TAU;
  if (d < -Math.PI) d += TAU;
  return d;
}
export function angleLerp(a, b, t) { return a + angleDiff(a, b) * t; }
export function angleDamp(a, b, lambda, dt) { return a + angleDiff(a, b) * (1 - Math.exp(-lambda * dt)); }

export const fmt = (n, d = 0) => (Math.abs(n) < 1e5 ? Number(n).toFixed(d) : Math.round(n).toString());
export const fmtTime = (s) => {
  s = Math.max(0, Math.floor(s));
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, '0')}`;
};

let _uid = 1;
export const uid = () => _uid++;

// ------------------------------------------------------------------
// Детерминированный ГПСЧ (mulberry32) — мир воспроизводим по семени.
// ------------------------------------------------------------------
export class RNG {
  constructor(seed = 1) { this.s = seed >>> 0 || 1; }
  next() {
    this.s = (this.s + 0x6D2B79F5) >>> 0;
    let t = this.s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  range(a, b) { return a + this.next() * (b - a); }
  int(a, b) { return Math.floor(this.range(a, b + 1)); }
  chance(p) { return this.next() < p; }
  pick(arr) { return arr[Math.floor(this.next() * arr.length)]; }
  sign() { return this.next() < 0.5 ? -1 : 1; }
  angle() { return this.next() * TAU; }
  // Точка, равномерная по площади круга радиуса r.
  inCircle(r) {
    const a = this.angle(), d = Math.sqrt(this.next()) * r;
    return { x: Math.cos(a) * d, y: Math.sin(a) * d };
  }
  // Взвешенный выбор: entries = [[value, weight], ...]
  weighted(entries) {
    let total = 0;
    for (const e of entries) total += e[1];
    if (total <= 0) return entries.length ? entries[0][0] : null;
    let r = this.next() * total;
    for (const e of entries) { r -= e[1]; if (r <= 0) return e[0]; }
    return entries[entries.length - 1][0];
  }
  shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(this.next() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
}

// ------------------------------------------------------------------
// Крошечный эмиттер событий (для связи логики и UI/звука).
// ------------------------------------------------------------------
export class Emitter {
  constructor() { this.map = new Map(); }
  on(ev, fn) {
    let list = this.map.get(ev);
    if (!list) { list = []; this.map.set(ev, list); }
    list.push(fn);
    return () => this.off(ev, fn);
  }
  off(ev, fn) {
    const list = this.map.get(ev); if (!list) return;
    const i = list.indexOf(fn); if (i >= 0) list.splice(i, 1);
  }
  emit(ev, data) {
    const list = this.map.get(ev); if (!list) return;
    for (let i = 0; i < list.length; i++) list[i](data);
  }
}

// ------------------------------------------------------------------
// Пул объектов: игра создаёт тысячи сущностей, сборщик мусора не нужен.
// ------------------------------------------------------------------
export class Pool {
  constructor(factory, reset = () => {}) { this.factory = factory; this.reset = reset; this.free = []; }
  get() { const o = this.free.pop() ?? this.factory(); o.dead = false; return o; }
  put(o) { this.reset(o); o.dead = true; if (this.free.length < 512) this.free.push(o); }
}

// Простое пространственное хеширование по сетке.
export class SpatialGrid {
  constructor(cell = 160) { this.cell = cell; this.map = new Map(); }
  key(cx, cy) { return cx * 73856093 ^ cy * 19349663; }
  clear() { this.map.clear(); }
  insert(o) {
    const cx = Math.floor(o.x / this.cell), cy = Math.floor(o.y / this.cell);
    const k = this.key(cx, cy);
    let b = this.map.get(k);
    if (!b) { b = []; this.map.set(k, b); }
    b.push(o);
  }
  build(list) {
    this.clear();
    for (let i = 0; i < list.length; i++) if (!list[i].dead) this.insert(list[i]);
  }
  query(x, y, r, out) {
    out.length = 0;
    const c = this.cell;
    const x0 = Math.floor((x - r) / c), x1 = Math.floor((x + r) / c);
    const y0 = Math.floor((y - r) / c), y1 = Math.floor((y + r) / c);
    const r2 = r * r;
    for (let cx = x0; cx <= x1; cx++) for (let cy = y0; cy <= y1; cy++) {
      const b = this.map.get(this.key(cx, cy));
      if (!b) continue;
      for (let i = 0; i < b.length; i++) {
        const o = b[i];
        if (o.dead) continue;
        if (dist2(x, y, o.x, o.y) <= r2) out.push(o);
      }
    }
    return out;
  }
}

// Быстрый шум значений (без зависимостей): 2D, детерминированный.
export class ValueNoise {
  constructor(seed = 1) {
    this.p = new Uint8Array(512);
    const rng = new RNG(seed);
    const perm = new Uint8Array(256);
    for (let i = 0; i < 256; i++) perm[i] = i;
    rng.shuffle(perm);
    for (let i = 0; i < 512; i++) this.p[i] = perm[i & 255];
  }
  grad(ix, iy) { return (this.p[(ix + this.p[iy & 255]) & 255] / 255) * 2 - 1; }
  at(x, y) {
    const ix = Math.floor(x), iy = Math.floor(y);
    const fx = x - ix, fy = y - iy;
    const u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy);
    const a = this.grad(ix, iy), b = this.grad(ix + 1, iy);
    const c = this.grad(ix, iy + 1), d = this.grad(ix + 1, iy + 1);
    return lerp(lerp(a, b, u), lerp(c, d, u), v);
  }
  fbm(x, y, oct = 3) {
    let sum = 0, amp = 0.5, f = 1, norm = 0;
    for (let i = 0; i < oct; i++) { sum += this.at(x * f, y * f) * amp; norm += amp; amp *= 0.5; f *= 2; }
    return sum / norm;
  }
}

// Цвета: смешение hex-строк.
export function mixHex(a, b, t) {
  // t зажимается в [0,1]: иначе канал уходит за 255, и «hex» получается битым
  // (#11104ff) — canvas такой цвет молча не принимает, а рисование падает.
  t = clamp(t, 0, 1);
  const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
  const r = Math.round(lerp((pa >> 16) & 255, (pb >> 16) & 255, t));
  const g = Math.round(lerp((pa >> 8) & 255, (pb >> 8) & 255, t));
  const bl = Math.round(lerp(pa & 255, pb & 255, t));
  return `#${((r << 16) | (g << 8) | bl).toString(16).padStart(6, '0')}`;
}
export function shade(hex, k) {
  // k > 0 — светлее, k < 0 — темнее
  return mixHex(hex, k >= 0 ? '#ffffff' : '#000000', Math.abs(k));
}
export function rgba(hex, a) {
  const p = parseInt(hex.slice(1), 16);
  return `rgba(${(p >> 16) & 255},${(p >> 8) & 255},${p & 255},${a})`;
}

// Детерминированный хеш из целого числа в [0,1) — для «случайных», но стабильных деталей.
export function hash01(n) {
  let x = Math.imul(n ^ 0x9e3779b9, 0x85ebca6b) >>> 0;
  x = Math.imul(x ^ (x >>> 13), 0xc2b2ae35) >>> 0;
  return ((x ^ (x >>> 16)) >>> 0) / 4294967296;
}

// Простой планировщик «сначала-пришло-первым-обслужено» для повторяющихся таймеров.
export function every(timer, dt, interval) {
  timer.t += dt;
  let fired = 0;
  while (timer.t >= interval) { timer.t -= interval; fired++; if (fired > 8) { timer.t = 0; break; } }
  return fired;
}
