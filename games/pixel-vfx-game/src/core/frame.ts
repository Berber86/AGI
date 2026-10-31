// A frame is two buffers at the game's pixel resolution: `color` takes pixels (opaque, dithered or truly
// translucent) and `light` takes additive glow, added on top when composited. Effects draw in local
// coordinates around their own origin; the painter places them, so an effect never knows where it is.
//
// Ported from the pixelfx way of working: hard pixels, 4x4 ordered dither for fades, ramps for color,
// light for heat. No images, no blending of gradients.

export interface Frame {
  w: number;
  h: number;
  color: Uint32Array;
  light: Uint32Array;
}

export const createFrame = (w: number, h: number): Frame => ({
  w,
  h,
  color: new Uint32Array(w * h),
  light: new Uint32Array(w * h),
});

export function clearFrame(f: Frame): void {
  f.color.fill(0);
  f.light.fill(0);
}

/** 4x4 ordered (Bayer) thresholds: a pixel at alpha a is drawn when a is above its cell's threshold. */
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);
export const bayer = (x: number, y: number): number => BAYER[((y & 3) << 2) | (x & 3)];

const OUT = { c: 0, a: 1, l: 0, k: 0 };
type Maybe<T> = T | ((...args: number[]) => T);
const call = <T>(v: Maybe<T>, ...args: number[]): T => (typeof v === "function" ? (v as (...a: number[]) => T)(...args) : v);

export class Painter {
  frame: Frame;
  w: number;
  h: number;
  /** local (0,0) in frame pixels */
  ox = 0;
  oy = 0;
  fade = 1;
  lightK = 1;

  constructor(frame: Frame) {
    this.frame = frame;
    this.w = frame.w;
    this.h = frame.h;
  }

  reset(): this {
    this.ox = 0;
    this.oy = 0;
    this.fade = 1;
    this.lightK = 1;
    return this;
  }

  /** Put the effect's origin at (x, y) in frame pixels. */
  place(x: number, y: number): this {
    this.ox = Math.round(x);
    this.oy = Math.round(y);
    return this;
  }

  private sx(x: number): number {
    return this.ox + Math.floor(x);
  }
  private sy(y: number): number {
    return this.oy + Math.floor(y);
  }

  /** One opaque pixel; color 0 means "nothing" and never erases. */
  put(x: number, y: number, c: number, a = 1): void {
    if (!c) return;
    const al = a * this.fade;
    if (al < 1 && al <= bayer(x, y)) return;
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return;
    this.frame.color[y * this.w + x] = c >>> 0;
  }

  /** Additive light at a frame pixel. */
  add(x: number, y: number, c: number, k = 1): void {
    const kk = k * this.fade * this.lightK;
    if (kk <= 0.004) return;
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return;
    const i = y * this.w + x;
    const d = this.frame.light[i];
    const r = Math.min(255, (d & 255) + (c & 255) * kk) | 0;
    const g = Math.min(255, ((d >>> 8) & 255) + ((c >>> 8) & 255) * kk) | 0;
    const b = Math.min(255, ((d >>> 16) & 255) + ((c >>> 16) & 255) * kk) | 0;
    this.frame.light[i] = ((255 << 24) | (b << 16) | (g << 8) | r) >>> 0;
  }

  /** Truly translucent pixel: soft smoke, vapour and mist only. */
  blend(x: number, y: number, c: number, a: number): void {
    const al = a * this.fade;
    if (!c || al <= 0.004) return;
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return;
    const i = y * this.w + x;
    const d = this.frame.color[i];
    const da = (d >>> 24) / 255;
    const oa = al + da * (1 - al);
    if (oa <= 0) return;
    const k = al / oa;
    const ch = (s: number) => ((((c >>> s) & 255) * k + ((d >>> s) & 255) * (1 - k)) & 255) | 0;
    this.frame.color[i] = ((((oa * 255) & 255) << 24) | (ch(16) << 16) | (ch(8) << 8) | ch(0)) >>> 0;
  }

  // ---- local-space primitives
  px(x: number, y: number, c: number): void {
    this.put(this.sx(x), this.sy(y), c, 1);
  }

  /** One pixel at alpha a, faded by ordered dither. */
  dot(x: number, y: number, c: number, a = 1): void {
    if (a <= 0) return;
    this.put(this.sx(x), this.sy(y), c, a);
  }

  light(x: number, y: number, c: number, k = 1): void {
    this.add(this.sx(x), this.sy(y), c, k);
  }

  line(x0: number, y0: number, x1: number, y1: number, c: Maybe<number>, a = 1): void {
    const dx = x1 - x0;
    const dy = y1 - y0;
    const n = Math.max(1, Math.round(Math.max(Math.abs(dx), Math.abs(dy))));
    for (let i = 0; i <= n; i++) {
      const u = i / n;
      this.dot(x0 + dx * u, y0 + dy * u, call(c, u), a);
    }
  }

  rect(x0: number, y0: number, x1: number, y1: number, c: Maybe<number>, a = 1): void {
    for (let y = Math.floor(y0); y <= Math.floor(y1); y++)
      for (let x = Math.floor(x0); x <= Math.floor(x1); x++) this.dot(x, y, call(c, x, y), a);
  }

  /** A translucent disc: puffs of smoke, vapour, light pools. */
  disc(cx: number, cy: number, r: number, c: Maybe<number>, a: Maybe<number> = 1): void {
    if (r < 0.5) {
      this.blend(this.sx(cx), this.sy(cy), call(c, 0, 0), call(a, 0, 0));
      return;
    }
    for (let y = Math.floor(cy - r); y <= Math.ceil(cy + r); y++)
      for (let x = Math.floor(cx - r); x <= Math.ceil(cx + r); x++) {
        const dx = x + 0.5 - cx;
        const dy = y + 0.5 - cy;
        const d2 = dx * dx + dy * dy;
        if (d2 > r * r) continue;
        const d = Math.sqrt(d2) / r;
        this.blend(this.sx(x), this.sy(y), call(c, x, y), call(a, d));
      }
  }

  circle(cx: number, cy: number, r: number, c: Maybe<number>, a = 1): void {
    for (let y = Math.floor(cy - r); y <= Math.ceil(cy + r); y++)
      for (let x = Math.floor(cx - r); x <= Math.ceil(cx + r); x++) {
        const dx = x + 0.5 - cx;
        const dy = y + 0.5 - cy;
        if (dx * dx + dy * dy > r * r) continue;
        this.dot(x, y, call(c, x, y), a);
      }
  }

  /** Band of a ring; width may taper with the angle. */
  arc(cx: number, cy: number, r: number, w: number | ((u: number) => number), a0: number, a1: number, c: Maybe<number>, a = 1): void {
    const steps = Math.max(8, Math.ceil(Math.abs(a1 - a0) * r * 0.8));
    for (let i = 0; i <= steps; i++) {
      const u = i / steps;
      const ang = a0 + (a1 - a0) * u;
      const width = typeof w === "function" ? w(u) : w;
      for (let k = 0; k < Math.max(1, width); k++) {
        const rr = r - k;
        this.dot(cx + Math.cos(ang) * rr, cy + Math.sin(ang) * rr, call(c, u), a);
      }
    }
  }

  ring(cx: number, cy: number, r: number, c: Maybe<number>, a = 1): void {
    this.arc(cx, cy, r, 1, 0, Math.PI * 2, c, a);
  }

  /** per-pixel shader over a local box: fn(x, y, out) may set c/a/l/k. */
  shade(x0: number, y0: number, x1: number, y1: number, fn: (x: number, y: number, out: typeof OUT) => void): void {
    for (let y = Math.floor(y0); y <= Math.floor(y1); y++)
      for (let x = Math.floor(x0); x <= Math.floor(x1); x++) {
        OUT.c = 0;
        OUT.a = 1;
        OUT.l = 0;
        OUT.k = 0;
        fn(x, y, OUT);
        if (OUT.c) this.dot(x, y, OUT.c, OUT.a);
        if (OUT.l && OUT.k) this.light(x, y, OUT.l, OUT.k);
      }
  }

  /** Soft additive pool of light. */
  glow(x: number, y: number, r: number, c: number, k: number): void {
    const rr = Math.max(1, r);
    for (let yy = Math.floor(y - rr); yy <= Math.ceil(y + rr); yy++)
      for (let xx = Math.floor(x - rr); xx <= Math.ceil(x + rr); xx++) {
        const dx = xx + 0.5 - x;
        const dy = yy + 0.5 - y;
        const d = Math.sqrt(dx * dx + dy * dy) / rr;
        if (d >= 1) continue;
        const fall = (1 - d) * (1 - d);
        this.light(xx, yy, c, k * fall);
      }
  }

  glowLine(x0: number, y0: number, x1: number, y1: number, r: number, c: number, k: number): void {
    const n = Math.max(1, Math.round(Math.hypot(x1 - x0, y1 - y0)));
    for (let i = 0; i <= n; i++) {
      const u = i / n;
      this.glow(x0 + (x1 - x0) * u, y0 + (y1 - y0) * u, r, c, k);
    }
  }

  /** A sprite from strings: rows of characters indexing a palette ('.' and ' ' are empty). */
  sprite(
    rows: readonly string[],
    pal: readonly (number | null)[],
    x: number,
    y: number,
    opts: { a?: number; flip?: boolean; scale?: number; tint?: (c: number) => number } = {},
  ): void {
    const a = opts.a ?? 1;
    const s = opts.scale ?? 1;
    const tint = opts.tint;
    for (let ry = 0; ry < rows.length; ry++) {
      const row = rows[ry];
      for (let rx = 0; rx < row.length; rx++) {
        const ch = row[rx];
        if (ch === "." || ch === " ") continue;
        const idx = ch.charCodeAt(0) - 48;
        const c = pal[idx];
        if (c === null || c === undefined) continue;
        const px = opts.flip ? row.length - 1 - rx : rx;
        const col = tint ? tint(c) : c;
        for (let yy = 0; yy < s; yy++) for (let xx = 0; xx < s; xx++) this.dot(x + px * s + xx, y + ry * s + yy, col, a);
      }
    }
  }
}

/** Composite UI pixels over what is already in `out`: straight alpha, no light. */
export function over(f: Frame, out: Uint8ClampedArray): void {
  const n = f.w * f.h;
  const C = f.color;
  for (let i = 0; i < n; i++) {
    const c = C[i];
    const a = (c >>> 24) & 255;
    if (!a) continue;
    const j = i << 2;
    if (a === 255) {
      out[j] = c & 255;
      out[j + 1] = (c >>> 8) & 255;
      out[j + 2] = (c >>> 16) & 255;
      out[j + 3] = 255;
      continue;
    }
    const k = a / 255;
    out[j] = (c & 255) * k + out[j] * (1 - k);
    out[j + 1] = ((c >>> 8) & 255) * k + out[j + 1] * (1 - k);
    out[j + 2] = ((c >>> 16) & 255) * k + out[j + 2] * (1 - k);
    out[j + 3] = 255;
  }
}

/**
 * Color over a background (or transparency) plus light, into RGBA bytes. `dark` (0..255 per pixel) dims
 * both color and light; `warm` (0..255) bends that dimming from cold night blue-green towards firelight.
 */
export function composite(
  f: Frame,
  out: Uint8ClampedArray,
  bg: number | null,
  dark?: Uint8Array,
  warm?: Uint8Array,
  lightK = 1,
): void {
  const n = f.w * f.h;
  const C = f.color;
  const L = f.light;
  for (let i = 0; i < n; i++) {
    const c = C[i];
    const l = L[i] & 0xffffff;
    let dk = 1;
    let wr = 0;
    if (dark) {
      dk = dark[i] / 255;
      wr = warm ? warm[i] / 255 : 0;
    }
    const ca = (c >>> 24) & 255;
    let r: number, g: number, b: number, a: number;
    if (ca === 255) {
      r = c & 255;
      g = (c >>> 8) & 255;
      b = (c >>> 16) & 255;
      a = 255;
    } else if (bg === null) {
      r = c & 255;
      g = (c >>> 8) & 255;
      b = (c >>> 16) & 255;
      a = ca;
    } else {
      const k = ca / 255;
      r = (c & 255) * k + (bg & 255) * (1 - k);
      g = ((c >>> 8) & 255) * k + ((bg >>> 8) & 255) * (1 - k);
      b = ((c >>> 16) & 255) * k + ((bg >>> 16) & 255) * (1 - k);
      a = 255;
    }
    if (dark) {
      r *= dk * (0.62 + 0.38 * wr);
      g *= dk * (0.86 + 0.09 * wr);
      b *= dk * (0.9 - 0.32 * wr);
    }
    if (l) {
      const lr = (l & 255) * lightK * dk;
      const lg = ((l >>> 8) & 255) * lightK * dk;
      const lb = ((l >>> 16) & 255) * lightK * dk;
      if (a < 255) {
        const pa = a / 255;
        const pr = r * pa + lr;
        const pg = g * pa + lg;
        const pb = b * pa + lb;
        const na = Math.min(1, Math.max(pa, Math.max(lr, lg, lb) / 255));
        if (na > 0) {
          r = Math.min(255, pr / na);
          g = Math.min(255, pg / na);
          b = Math.min(255, pb / na);
          a = na * 255;
        }
      } else {
        r = Math.min(255, r + lr);
        g = Math.min(255, g + lg);
        b = Math.min(255, b + lb);
      }
    }
    const j = i << 2;
    out[j] = r;
    out[j + 1] = g;
    out[j + 2] = b;
    out[j + 3] = a;
  }
}
