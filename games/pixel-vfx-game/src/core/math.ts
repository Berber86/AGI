// Numbers, easing and seeded randomness. Everything here is pure, so a frame drawn at time t is the
// same every run: the effect library's rule ("never Math.random") applied to the whole game.

export const TAU = Math.PI * 2;

export const clamp = (x: number, a = 0, b = 1): number => (x < a ? a : x > b ? b : x);
export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;
export const fract = (x: number): number => x - Math.floor(x);
/** Progress 0..1 of t through [t0, t1]. */
export const seg = (t: number, t0: number, t1: number): number => clamp((t - t0) / (t1 - t0));
/** Hermite smoothstep of x between e0 and e1. */
export const smooth = (e0: number, e1: number, x: number): number => {
  const t = seg(x, e0, e1);
  return t * t * (3 - 2 * t);
};
export const bump = (t: number, t0: number, t1: number): number =>
  t <= t0 || t >= t1 ? 0 : Math.sin(Math.PI * seg(t, t0, t1));
export const dist = (x0: number, y0: number, x1: number, y1: number): number => Math.hypot(x1 - x0, y1 - y0);

export const ease = {
  linear: (t: number) => t,
  outQuad: (t: number) => 1 - (1 - t) * (1 - t),
  inQuad: (t: number) => t * t,
  outCubic: (t: number) => 1 - Math.pow(1 - t, 3),
  outQuart: (t: number) => 1 - Math.pow(1 - t, 4),
  outExpo: (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  inOutSine: (t: number) => -(Math.cos(Math.PI * t) - 1) / 2,
  outBack: (t: number, s = 1.70158) =>
    t <= 0 ? 0 : t >= 1 ? 1 : 1 + (s + 1) * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2),
};

/** 32-bit integer hash: the whole deterministic noise floor. */
export function hash(...ns: number[]): number {
  let h = 0x9e3779b9;
  for (const n of ns) {
    h = Math.imul(h ^ (n | 0), 0x85ebca6b);
    h ^= h >>> 13;
    h = Math.imul(h, 0xc2b2ae35);
    h ^= h >>> 16;
  }
  return h >>> 0;
}
/** Hash to 0..1. */
export const rand = (...ns: number[]): number => hash(...ns) / 4294967296;

/** Seeded generator: same seed, same sequence, every time. */
export class Rng {
  private s: number;
  constructor(seed = 1) {
    this.s = (seed >>> 0) || 1;
  }
  /** 0..1 */
  next(): number {
    let t = (this.s += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  range(a: number, b: number): number {
    return a + this.next() * (b - a);
  }
  int(a: number, b: number): number {
    return Math.floor(this.range(a, b + 1));
  }
  chance(p: number): boolean {
    return this.next() < p;
  }
  pick<T>(list: readonly T[]): T {
    return list[Math.min(list.length - 1, Math.floor(this.next() * list.length))];
  }
}

/** Smooth 1D value noise in -1..1. */
export function noise(x: number, seed = 0): number {
  const i = Math.floor(x);
  const f = x - i;
  const a = rand(i, seed) * 2 - 1;
  const b = rand(i + 1, seed) * 2 - 1;
  return lerp(a, b, f * f * (3 - 2 * f));
}

/** Seamless noise in -1..1: period repeats exactly at phase = period. */
export function loopNoise(x: number, period: number, seed = 0): number {
  const p = Math.max(1, Math.floor(period));
  const i = Math.floor(x);
  const f = x - i;
  const a = rand(((i % p) + p) % p, seed) * 2 - 1;
  const b = rand((((i + 1) % p) + p) % p, seed) * 2 - 1;
  return lerp(a, b, f * f * (3 - 2 * f));
}

/** One readable place for the seedable "take a variant" habit of the effect library. */
export const variant = (seed: number): Rng => new Rng(hash(seed, 0x9e37) | 0);
