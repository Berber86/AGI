// The game's effects, written the way the effect library teaches: two buffers, hard pixels, ramp colors,
// light for heat, seeded randomness, and choreography in phases (charge, release, spread, decay).

import type { Painter } from "../core/frame.js";
import { Rng, TAU, clamp, ease, loopNoise, rand, smooth } from "../core/math.js";
import { at, hex } from "../core/color.js";
import { RAMPS } from "../art/sprites.js";
import { P, Particles } from "./particles.js";

export interface Fx {
  update(dt: number): void;
  draw(p: Painter): void;
  readonly done: boolean;
}

const FIRE = RAMPS.fire;
const AMBER = RAMPS.amber;
const MOSS = RAMPS.moss;
const BARK = RAMPS.bark;
const BLOOD = RAMPS.blood;

/** A four-point glint: the cheapest way to make a pixel look bright. */
export function star(p: Painter, x: number, y: number, arm: number, c: number, tip: number, k = 1): void {
  p.dot(x, y, tip, k);
  for (let i = 1; i <= arm; i++) {
    const a = k * (1 - i / (arm + 1));
    p.dot(x + i, y, c, a);
    p.dot(x - i, y, c, a);
    p.dot(x, y + i, c, a);
    p.dot(x, y - i, c, a);
  }
  p.glow(x, y, arm + 2, c, 0.35 * k);
}

// ---------------------------------------------------------------- campfire

/** The campfire: layered flame tongues, embers, smoke and a flickering pool of light. A loop, so it never
 *  ends; `flare()` lets a delivered find push it brighter for a moment. */
export class Campfire implements Fx {
  t = 0;
  flareK = 0;
  private ps: Particles;
  private rng: Rng;
  private emberT = 0;
  private smokeT = 0;

  constructor(
    readonly x: number,
    readonly y: number,
    seed = 3,
  ) {
    this.rng = new Rng(seed);
    this.ps = new Particles({ rng: this.rng, ground: () => y });
  }

  flare(k = 1): void {
    this.flareK = Math.min(1.6, this.flareK + k);
    const R = this.rng;
    for (let i = 0; i < 7; i++) {
      const a = R.range(-Math.PI, 0);
      this.ps.spawn(P.EMBER, this.x + R.range(-3, 3), this.y - 7, Math.cos(a) * R.range(6, 22), Math.sin(a) * R.range(20, 46), R.range(0.5, 1.1), at(AMBER, R.range(0.6, 1)), 0, 1);
    }
  }

  get done(): boolean {
    return false;
  }

  update(dt: number): void {
    this.t += dt;
    this.flareK = Math.max(0, this.flareK - dt * 1.4);
    const R = this.rng;
    this.emberT -= dt;
    if (this.emberT <= 0) {
      this.emberT = R.range(0.06, 0.2);
      this.ps.spawn(
        P.EMBER,
        this.x + R.range(-4, 4),
        this.y - R.range(4, 9),
        R.range(-6, 6),
        -R.range(10, 34),
        R.range(0.5, 1.4),
        at(FIRE, R.range(0.55, 1)),
        0,
        1,
      );
    }
    this.smokeT -= dt;
    if (this.smokeT <= 0) {
      this.smokeT = R.range(0.25, 0.6);
      this.ps.spawn(P.SMOKE, this.x + R.range(-3, 3), this.y - 12, R.range(-4, 4), -R.range(6, 14), R.range(1.1, 2), BARK[2], 3);
    }
    this.ps.update(dt);
  }

  /** Tongues of flame, from the base to the tips, drawn as a per-pixel shader so they can bend. */
  draw(p: Painter): void {
    const t = this.t;
    const boost = 1 + this.flareK * 0.6;
    const height = 24 * boost;
    const flick = 0.85 + 0.15 * Math.sin(t * 9.3) * Math.sin(t * 3.7 + 1);
    p.place(this.x, this.y);

    // light: a wide warm pool on the ground, a tight hot core, both breathing
    p.glow(0, -5, 38 * flick, at(AMBER, 0.7), 0.3 * flick * boost);
    p.glow(0, -8, 16, at(FIRE, 0.95), 0.55 * flick * boost);
    p.glow(0, -1, 20, at(AMBER, 0.5), 0.26 * flick);

    // logs: two crossed pieces of wood, lit on top
    p.rect(-7, -3, 6, -1, BARK[2]);
    p.rect(-7, -3, 6, -3, BARK[4]);
    p.rect(-7, -2, 6, -2, BARK[1]);
    p.rect(-5, -5, 4, -2, BARK[3]);
    p.rect(-5, -5, 4, -5, BARK[5]);
    p.dot(-7, -3, BARK[0]);
    p.dot(6, -3, BARK[0]);
    p.dot(-5, -5, BARK[0]);
    p.dot(4, -5, BARK[0]);
    for (let i = 0; i < 5; i++) p.dot(-6 + i * 3, 1, BARK[1], 0.7);
    // stones around the fire
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * TAU + 0.3;
      p.dot(Math.cos(a) * 10, Math.sin(a) * 3 - 1, BARK[i % 2 ? 3 : 4]);
    }

    // the flame body: three tongues, each a sum of travelling waves
    const tongues = [
      { w: 8, h: height, sway: 2.2, sd: 11 },
      { w: 5.2, h: height * 0.8, sway: 2.8, sd: 27, dx: -2 },
      { w: 3.8, h: height * 0.62, sway: 3.4, sd: 41, dx: 2.2 },
    ];
    for (const tg of tongues) {
      const span = Math.ceil(tg.w) + 1;
      for (let y = -Math.ceil(tg.h); y <= 0; y++) {
        const v = -y / tg.h;
        if (v > 1) continue;
        const narrow = tg.w * Math.pow(1 - v, 0.75) * (0.9 + 0.2 * loopNoise(v * 4 + t * 1.7, 16, tg.sd));
        const drift = Math.sin(v * 3.2 + t * 2.6 + tg.sd) * tg.sway * v + (tg.dx ?? 0) * v;
        for (let x = -span; x <= span; x++) {
          const q = Math.abs(x - drift) / Math.max(0.6, narrow);
          if (q > 1) continue;
          const ci = clamp(q * 0.9 + v * 0.85 - 0.1 + loopNoise(v * 6 - t * 2, 12, tg.sd + 5) * 0.12, 0, 1);
          const c = at(FIRE, 1 - ci);
          p.dot(x, y, c, v > 0.86 ? 0.45 : 1);
        }
      }
    }
    // white-hot core the eye focuses on
    p.dot(0, -3, FIRE[FIRE.length - 1]);
    p.dot(-1, -2, FIRE[FIRE.length - 1]);
    p.dot(1, -2, FIRE[FIRE.length - 2]);
    p.dot(0, -1, FIRE[FIRE.length - 2]);
    this.ps.draw(p);
  }
}

// ---------------------------------------------------------------- slash

/** The strike: a crescent that whips round in two frames, cooling as it trails off, with sparks and a
 *  flare at the tip. Simulated only by its own clock — the arc is a function of age. */
export class SlashFx implements Fx {
  private ps: Particles;
  private t = 0;
  private readonly life = 0.3;
  private readonly span = 2.1;
  private readonly radius: number;

  constructor(
    private x: number,
    private y: number,
    private angle: number,
    seed = 7,
    radius = 16,
    private ramp: readonly number[] = RAMPS.amber,
  ) {
    this.radius = radius;
    const rng = new Rng(seed);
    this.ps = new Particles({ rng, ground: () => y + 8 });
    for (let i = 0; i < 9; i++) {
      const a = angle + rng.range(-0.8, 0.8);
      const sp = rng.range(50, 150);
      this.ps.spawn(
        P.SPARK,
        x + Math.cos(a) * 12,
        y + Math.sin(a) * 8,
        Math.cos(a) * sp,
        Math.sin(a) * sp * 0.6 - 20,
        rng.range(0.18, 0.4),
        at(FIRE, rng.range(0.7, 1)),
        0,
        1,
      );
    }
  }

  get done(): boolean {
    return this.t >= this.life;
  }

  update(dt: number): void {
    this.t += dt;
    this.ps.update(dt);
  }

  draw(p: Painter): void {
    const u = clamp(this.t / this.life);
    const head = ease.outExpo(clamp(this.t / 0.1));
    const tail = smooth(0.08, this.life, this.t);
    const span = this.span * (head - tail);
    if (span <= 0.01) return;
    const a0 = this.angle - this.span / 2 + this.span * tail;
    const a1 = a0 + span;
    const n = this.ramp.length;

    // the smear: bright at the leading rim, cooling into the tail, dissolving through the dither
    for (let s = 0; s <= span; s += 0.02) {
      const a = a0 + s;
      const v = s / Math.max(0.001, span);
      const width = 3.6 * Math.pow(Math.sin(Math.PI * Math.pow(v, 0.8)), 0.5) * (1 - u * 0.5);
      if (width < 0.4) continue;
      for (let k = 0; k < width; k++) {
        const r = this.radius - k * 0.9;
        const x = this.x + Math.cos(a) * r;
        const y = this.y + Math.sin(a) * r * 0.62;
        const ci = clamp(k / Math.max(1, width) * 0.8 + u * 0.9, 0, 0.999);
        p.dot(x, y, this.ramp[n - 1 - Math.floor(ci * (n - 1))], 1 - u * 0.35);
      }
      p.glow(this.x + Math.cos(a) * this.radius, this.y + Math.sin(a) * this.radius * 0.62, 5, at(this.ramp, 0.8), 0.16 * (1 - u));
    }
    // hot tip and the glint that sells the frame
    const tipX = this.x + Math.cos(a1) * this.radius;
    const tipY = this.y + Math.sin(a1) * this.radius * 0.62;
    if (this.t < 0.16) {
      star(p, tipX, tipY, 3, at(this.ramp, 0.8), hex("#ffffff"), 1 - this.t / 0.16);
      p.light(tipX, tipY, hex("#ffffff"), 0.5 * (1 - this.t / 0.16));
    }
    this.ps.draw(p);
  }
}

// ---------------------------------------------------------------- impacts

/** Sparks and a flash where the strike lands. */
export class HitFx implements Fx {
  private ps: Particles;
  private t = 0;
  private readonly life = 0.34;

  constructor(
    private x: number,
    private y: number,
    seed = 5,
    private ramp: readonly number[] = RAMPS.blood,
  ) {
    this.ps = new Particles({ rng: new Rng(seed), ground: () => y + 6 });
    this.ps.burst(x, y, 12, this.ramp, 110, 0.36);
  }

  get done(): boolean {
    return this.t >= this.life;
  }

  update(dt: number): void {
    this.t += dt;
    this.ps.update(dt);
  }

  draw(p: Painter): void {
    const u = clamp(this.t / 0.12);
    if (u < 1) {
      p.place(this.x, this.y);
      star(p, 0, 0, 4, at(this.ramp, 0.9), hex("#ffffff"), 1 - u);
      p.glow(0, 0, 9 * (1 - u) + 2, at(this.ramp, 0.7), 0.5 * (1 - u));
    }
    this.ps.draw(p);
  }
}

/** A puff of leaf smoke and grit: a creature dies. */
export class PoofFx implements Fx {
  private ps: Particles;
  private t = 0;
  private readonly life = 0.75;

  constructor(
    private x: number,
    private y: number,
    seed = 9,
    ramp: readonly number[] = RAMPS.moss,
  ) {
    const rng = new Rng(seed);
    this.ps = new Particles({ rng, ground: () => y });
    for (let i = 0; i < 6; i++) {
      this.ps.spawn(P.SMOKE, x + rng.range(-3, 3), y - rng.range(0, 5), rng.range(-10, 10), -rng.range(4, 18), rng.range(0.35, 0.7), ramp[2], 2);
    }
    for (let i = 0; i < 8; i++) {
      const a = rng.range(-Math.PI, 0);
      this.ps.spawn(P.GRIT, x, y - 2, Math.cos(a) * rng.range(20, 60), Math.sin(a) * rng.range(20, 60), rng.range(0.3, 0.6), ramp[rng.int(1, 3)], 0, 1);
    }
    for (let i = 0; i < 4; i++) this.ps.spawn(P.GLEAM, x + rng.range(-6, 6), y - rng.range(2, 10), 0, -6, rng.range(0.3, 0.6), at(RAMPS.amber, 0.9), 0, 1);
  }

  get done(): boolean {
    return this.t >= this.life;
  }

  update(dt: number): void {
    this.t += dt;
    this.ps.update(dt);
  }

  draw(p: Painter): void {
    const u = clamp(this.t / 0.1);
    if (u < 1) p.glow(this.x, this.y - 3, 12, at(RAMPS.amber, 0.8), 0.4 * (1 - u));
    this.ps.draw(p);
  }
}

/** What you see when a find jumps into your hands: a glint and a rising sparkle. */
export class PickupFx implements Fx {
  private ps: Particles;
  private t = 0;
  private readonly life = 0.5;

  constructor(
    private x: number,
    private y: number,
    seed = 11,
    ramp: readonly number[] = RAMPS.amber,
  ) {
    const rng = new Rng(seed);
    this.ps = new Particles({ rng, ground: () => y });
    for (let i = 0; i < 7; i++) {
      this.ps.spawn(P.GLEAM, x + rng.range(-5, 5), y + rng.range(-8, 2), 0, -rng.range(8, 22), rng.range(0.25, 0.5), at(ramp, 0.85), 0, 1);
    }
    this.ps.burst(x, y - 3, 4, ramp, 40, 0.24);
  }

  get done(): boolean {
    return this.t >= this.life;
  }

  update(dt: number): void {
    this.t += dt;
    this.ps.update(dt);
  }

  draw(p: Painter): void {
    if (this.t < 0.2) {
      p.place(this.x, this.y);
      star(p, 0, -3, 3, at(RAMPS.amber, 0.9), hex("#ffffff"), 1 - this.t / 0.2);
      p.glow(0, -3, 8, at(RAMPS.amber, 0.8), 0.4 * (1 - this.t / 0.2));
    }
    this.ps.draw(p);
  }
}

/** A dropped find: a small dust ring and a dim glint, so the loss reads. */
export class DropFx implements Fx {
  private ps: Particles;
  private t = 0;
  private readonly life = 0.4;

  constructor(
    x: number,
    y: number,
    seed = 13,
  ) {
    const rng = new Rng(seed);
    this.ps = new Particles({ rng, ground: () => y });
    for (let i = 0; i < 5; i++) this.ps.spawn(P.SMOKE, x, y, rng.range(-14, 14), -rng.range(2, 8), rng.range(0.2, 0.4), RAMPS.bark[2], 1);
  }

  get done(): boolean {
    return this.t >= this.life;
  }

  update(dt: number): void {
    this.t += dt;
    this.ps.update(dt);
  }

  draw(p: Painter): void {
    this.ps.draw(p);
  }
}

/** Taking damage: a red rim of light, so the hit reads even at the edge of vision. */
export class DamageFx implements Fx {
  private t = 0;
  private readonly life = 0.45;

  get done(): boolean {
    return this.t >= this.life;
  }

  update(dt: number): void {
    this.t += dt;
  }

  draw(p: Painter): void {
    const u = clamp(this.t / this.life);
    const k = (1 - u) * (1 - u);
    const w = p.w;
    const h = p.h;
    for (let x = 0; x < w; x++) {
      p.light(x, 0, at(BLOOD, 0.7), 0.7 * k);
      p.light(x, 1, at(BLOOD, 0.6), 0.45 * k);
      p.light(x, h - 1, at(BLOOD, 0.7), 0.7 * k);
      p.light(x, h - 2, at(BLOOD, 0.6), 0.45 * k);
    }
    for (let y = 0; y < h; y++) {
      p.light(0, y, at(BLOOD, 0.7), 0.7 * k);
      p.light(1, y, at(BLOOD, 0.6), 0.45 * k);
      p.light(w - 1, y, at(BLOOD, 0.7), 0.7 * k);
      p.light(w - 2, y, at(BLOOD, 0.6), 0.45 * k);
    }
  }
}

// ---------------------------------------------------------------- ambient

/** Fireflies drifting in the dark: each one a blink on its own clock, no state beyond the clock. */
export class Fireflies implements Fx {
  private readonly list: { x: number; y: number; r: number; sd: number; ph: number }[] = [];

  constructor(
    w: number,
    h: number,
    seed = 21,
    count = 22,
  ) {
    for (let i = 0; i < count; i++) {
      this.list.push({
        x: rand(i, seed) * w,
        y: 40 + rand(i, seed + 7) * (h - 60),
        r: 4 + rand(i, seed + 13) * 10,
        sd: i * 3.1 + seed,
        ph: rand(i, seed + 31) * TAU,
      });
    }
  }

  private t = 0;

  get done(): boolean {
    return false;
  }

  update(dt: number): void {
    this.t += dt;
  }

  draw(p: Painter): void {
    for (const f of this.list) {
      const x = f.x + Math.sin(this.t * 0.5 + f.sd) * f.r;
      const y = f.y + Math.cos(this.t * 0.37 + f.sd * 1.4) * f.r * 0.5;
      const blink = Math.max(0, Math.sin(this.t * 1.6 + f.ph));
      const k = Math.pow(blink, 4);
      if (k < 0.04) continue;
      p.dot(x, y, at(AMBER, 1), k);
      p.light(x, y, at(AMBER, 0.85), 0.5 * k);
      if (k > 0.75) p.dot(x + 1, y, at(AMBER, 0.7), 0.6);
    }
  }
}

/** Leaves drifting across the dark: slow, sparse, always moving. */
export class Leaves implements Fx {
  private t = 0;
  private readonly list: { x: number; y: number; sd: number; vx: number; vy: number }[] = [];

  constructor(
    private w: number,
    private h: number,
    seed = 33,
    count = 10,
  ) {
    for (let i = 0; i < count; i++) {
      this.list.push({
        x: rand(i, seed + 3) * w,
        y: rand(i, seed + 9) * h,
        sd: rand(i, seed + 17) * 10,
        vx: 6 + rand(i, seed + 23) * 10,
        vy: 2 + rand(i, seed + 29) * 5,
      });
    }
  }

  get done(): boolean {
    return false;
  }

  update(dt: number): void {
    this.t += dt;
    for (const l of this.list) {
      l.x += l.vx * dt;
      l.y += (l.vy + Math.sin(this.t * 1.2 + l.sd) * 3) * dt;
      if (l.x > this.w + 4) l.x = -4;
      if (l.y > this.h + 4) l.y = -4;
    }
  }

  draw(p: Painter): void {
    for (const l of this.list) {
      const sway = Math.sin(this.t * 2 + l.sd);
      p.dot(l.x, l.y, sway > 0 ? MOSS[3] : MOSS[2], 0.35 + 0.25 * Math.abs(sway));
    }
  }
}
