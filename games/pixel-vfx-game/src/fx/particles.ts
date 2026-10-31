// Small seeded particle system: sparks that streak and bounce, embers that rise and cool, smoke that
// swells and thins, glints that twinkle. Physics in pixels and seconds, drawn through the painter in local
// space, so an effect never needs to know where it is.

import type { Painter } from "../core/frame.js";
import { Rng, clamp, TAU } from "../core/math.js";

export const P = { SPARK: 0, EMBER: 1, SMOKE: 2, GLEAM: 3, GRIT: 4, MOTE: 5 } as const;
export type ParticleKind = (typeof P)[keyof typeof P];

export interface Particle {
  kind: ParticleKind;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  c: number;
  tail: number;
  size: number;
  seed: number;
  grav: number;
  drag: number;
  bounce: boolean;
  phase: number;
}

export interface ParticleOpts {
  rng: Rng;
  ground?: (x: number) => number;
  gravity?: number;
}

export const GRAVITY = 320;

export class Particles {
  readonly list: Particle[] = [];
  readonly rng: Rng;
  readonly ground: (x: number) => number;
  readonly gravity: number;

  constructor(opts: ParticleOpts) {
    this.rng = opts.rng;
    this.ground = opts.ground ?? (() => Number.POSITIVE_INFINITY);
    this.gravity = opts.gravity ?? GRAVITY;
  }

  spawn(
    kind: ParticleKind,
    x: number,
    y: number,
    vx: number,
    vy: number,
    life: number,
    c: number,
    tail = 0,
    size = 1,
    grav = 1,
  ): void {
    this.list.push({
      kind,
      x,
      y,
      vx,
      vy,
      life,
      max: life,
      c,
      tail,
      size,
      seed: this.rng.next() * 100,
      grav,
      drag: kind === P.SMOKE ? 1.6 : 2.2,
      bounce: kind === P.SPARK || kind === P.GRIT,
      phase: this.rng.range(0, TAU),
    });
  }

  /** A burst of sparks: fast, short-lived, stretched with speed. */
  burst(x: number, y: number, n: number, rampCol: readonly number[], speed = 90, life = 0.42): void {
    const R = this.rng;
    for (let i = 0; i < n; i++) {
      const a = R.range(0, TAU);
      const sp = R.range(speed * 0.35, speed);
      const c = rampCol[Math.min(rampCol.length - 1, Math.floor(R.range(0.55, 1) * rampCol.length))];
      this.spawn(P.SPARK, x, y, Math.cos(a) * sp, Math.sin(a) * sp - R.range(10, 40), R.range(life * 0.5, life), c, 2);
    }
  }

  update(dt: number): void {
    for (let i = this.list.length - 1; i >= 0; i--) {
      const p = this.list[i];
      p.life -= dt;
      if (p.life <= 0) {
        this.list.splice(i, 1);
        continue;
      }
      switch (p.kind) {
        case P.SMOKE:
          p.vy -= 16 * dt;
          p.vx += Math.sin(p.life * 5 + p.seed) * 6 * dt;
          p.vx -= p.vx * 1.4 * dt;
          p.vy -= p.vy * 1.1 * dt;
          break;
        case P.EMBER:
          p.vy -= 26 * dt;
          p.vx += Math.sin(p.life * 9 + p.seed) * 22 * dt;
          p.vx -= p.vx * 1.8 * dt;
          break;
        default:
          p.vy += this.gravity * p.grav * dt;
          p.vx -= p.vx * p.drag * dt;
          break;
      }
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      if (p.bounce) {
        const g = this.ground(p.x);
        if (p.vy > 0 && p.y >= g) {
          p.y = g - 0.4;
          if (p.vy > 60) {
            p.vy = -p.vy * 0.32;
            p.vx *= 0.6;
          } else {
            p.vy = 0;
            p.vx *= 0.4;
            p.life = Math.min(p.life, 0.16);
          }
        }
      }
    }
  }

  draw(p: Painter): void {
    for (const q of this.list) {
      const u = clamp(q.life / q.max);
      switch (q.kind) {
        case P.SPARK: {
          const n = Math.max(1, Math.round(Math.hypot(q.vx, q.vy) / 90));
          for (let k = 0; k < n; k++) {
            const t = k / n;
            p.dot(q.x - q.vx * 0.012 * t, q.y - q.vy * 0.012 * t, q.c, u);
          }
          p.light(q.x, q.y, q.c, 0.5 * u);
          break;
        }
        case P.EMBER:
          p.dot(q.x, q.y, q.c, 0.35 + 0.65 * u);
          p.light(q.x, q.y, q.c, 0.35 * u);
          break;
        case P.SMOKE: {
          const r = q.size * (1.1 + (1 - u) * 2.4);
          p.disc(q.x, q.y, r, q.c, 0.3 * u);
          break;
        }
        case P.GLEAM: {
          const a = Math.abs(Math.sin(q.life * 9 + q.phase));
          p.dot(q.x, q.y, q.c, a);
          if (q.size > 1 && a > 0.5) {
            p.dot(q.x - 1, q.y, q.c, a * 0.6);
            p.dot(q.x + 1, q.y, q.c, a * 0.6);
            p.dot(q.x, q.y - 1, q.c, a * 0.6);
            p.dot(q.x, q.y + 1, q.c, a * 0.6);
          }
          p.light(q.x, q.y, q.c, 0.3 * a);
          break;
        }
        case P.GRIT:
          p.dot(q.x, q.y, q.c, u);
          break;
        case P.MOTE:
          p.dot(q.x, q.y, q.c, 0.6 * u);
          break;
      }
    }
  }
}
