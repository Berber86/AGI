// Everything the game shows is drawn here, into the two buffers: a forest floor baked once, entities, the
// campfire's light, effects — then the night dims color and light together — and only then the HUD, drawn
// over the darkness so the numbers never fade with it.

import { Painter, clearFrame, composite, createFrame, over, type Frame } from "../core/frame.js";
import { at, hex } from "../core/color.js";
import { Rng, TAU, clamp, loopNoise, smooth } from "../core/math.js";
import { drawText } from "../core/font.js";
import { AMBER, BEETLE, BEETLE_WINDUP, FIREFLY, HERO_IDLE, HERO_STEP, RAMPS, SLUG, SLUG_WINDUP, type SpriteDef } from "../art/sprites.js";
import { CONFIG, type Creature, type World } from "./world.js";
import type { Campfire, Fx } from "../fx/effects.js";

const FIRE = RAMPS.fire;
const AMBER_R = RAMPS.amber;
const MOSS = RAMPS.moss;
const BLOOD = RAMPS.blood;

const INK = hex("#f2f6e4");
const INK_DIM = hex("#b8c9a0");
const SHADOW = hex("#08100a");

const HEART = [".#####.", "#######", "#######", "#######", ".#####.", "..###..", "...#..."];
const HEART_EMPTY = [".#####.", "#.....#", "#.....#", "#.....#", ".#####.", "..###..", "...#..."];

export interface RenderOptions {
  mode: "title" | "play" | "over";
  time: number;
  best: number;
  record: boolean;
  shakeX?: number;
  shakeY?: number;
}

export interface SceneFx {
  campfire: Campfire;
  fireflies: Fx;
  leaves: Fx;
  transient: Fx[];
}

const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);

export class Renderer {
  readonly w: number;
  readonly h: number;
  readonly frame: Frame;
  private bg: Frame;
  private painter: Painter;
  private dark: Uint8Array;
  private warm: Uint8Array;

  constructor(w = CONFIG.w, h = CONFIG.h) {
    this.w = w;
    this.h = h;
    this.frame = createFrame(w, h);
    this.bg = createFrame(w, h);
    this.painter = new Painter(this.frame);
    this.dark = new Uint8Array(w * h);
    this.warm = new Uint8Array(w * h);
    this.bakeForest();
  }

  /** The forest floor: moss, grass, stones, mushrooms, roots, the fire ring and the ring of trunks. */
  private bakeForest(): void {
    const f = this.bg;
    const p = new Painter(f);
    const R = new Rng(0x1e5f);
    f.color.fill(hex("#0c1712"));

    // dappled ground in whole 2x2 clumps: three close greens, so it vibrates but never speckles
    for (let i = 0; i < 620; i++) {
      const x = Math.floor(R.range(0, this.w / 2)) * 2;
      const y = Math.floor(R.range(0, this.h / 2)) * 2;
      const c = R.chance(0.45) ? hex("#0f1d16") : R.chance(0.5) ? hex("#12221a") : hex("#16271d");
      p.rect(x, y, x + 1, y + 1, c);
    }

    // the trodden ring around the fire: lighter earth, pebbles, ash
    for (let i = 0; i < 240; i++) {
      const a = R.range(0, TAU);
      const r = Math.sqrt(R.next()) * 30;
      const x = CONFIG.fireX + Math.cos(a) * r;
      const y = CONFIG.fireY + Math.sin(a) * r * 0.6;
      p.dot(x, y, R.chance(0.55) ? hex("#26301f") : hex("#1d2619"), 0.9);
    }

    // moss clumps: bright tip, mid body, dark base
    for (let i = 0; i < 120; i++) {
      const x = Math.floor(R.range(4, this.w - 4));
      const y = Math.floor(R.range(24, this.h - 3));
      const r = R.int(2, 4);
      for (let k = 0; k < r; k++) {
        const xx = x + R.int(-1, 1);
        p.dot(xx, y - k, k === r - 1 ? hex("#7fae63") : hex("#3d6f3a"), 1);
        p.dot(xx + 1, y - k, hex("#2a5230"), 0.9);
      }
      p.dot(x, y + 1, hex("#1d3a24"), 0.8);
    }

    // grass blades: one bright pixel at the tip is what sells them at this size
    for (let i = 0; i < 70; i++) {
      const x = Math.floor(R.range(4, this.w - 4));
      const y = Math.floor(R.range(26, this.h - 3));
      const h = R.int(1, 3);
      for (let k = 0; k < h; k++) p.dot(x + (k > 1 ? 1 : 0), y - k, k === h - 1 ? hex("#86b45c") : hex("#2a5230"));
    }

    // stones: lit top edge, dark base
    for (let i = 0; i < 22; i++) {
      const x = Math.floor(R.range(6, this.w - 6));
      const y = Math.floor(R.range(26, this.h - 4));
      const w = R.int(2, 4);
      p.rect(x, y, x + w, y + 1, hex("#3d3a38"));
      p.rect(x, y, x + w - 1, y, hex("#55514a"));
      p.dot(x + w, y, hex("#55514a"));
      p.dot(x, y + 1, hex("#2a282a"));
      p.dot(x + w, y + 1, hex("#2a282a"));
    }

    // mushrooms: a pale stem and an amber cap, rare enough to be a find in themselves
    for (let i = 0; i < 10; i++) {
      const x = Math.floor(R.range(8, this.w - 8));
      const y = Math.floor(R.range(30, this.h - 4));
      p.dot(x, y, hex("#c0b6a2"));
      p.dot(x, y - 1, hex("#c97f26"));
      p.dot(x - 1, y - 1, hex("#eda93c"));
      p.dot(x + 1, y - 1, hex("#9c5c1c"));
      p.dot(x, y - 2, hex("#ffd269"));
    }

    // roots
    for (let i = 0; i < 9; i++) {
      let x = R.range(10, this.w - 10);
      let y = R.range(30, this.h - 6);
      for (let k = 0; k < 14; k++) {
        p.dot(x, y, hex("#07110c"), 0.75);
        x += R.range(-1.4, 1.4);
        y += R.range(-0.5, 0.6);
      }
    }

    // fallen leaves, small warm accents in a cold frame
    for (let i = 0; i < 46; i++) {
      const x = Math.floor(R.range(4, this.w - 4));
      const y = Math.floor(R.range(26, this.h - 4));
      p.dot(x, y, R.chance(0.5) ? hex("#6b4826") : hex("#9c5c1c"));
      if (R.chance(0.4)) p.dot(x + 1, y, hex("#4a3521"));
    }

    // tree trunks at the top and sides: silhouettes with one lit edge
    for (let i = 0; i < 12; i++) {
      const x = Math.floor(R.range(6, this.w - 6));
      const w = R.int(3, 7);
      const h = R.int(14, 34);
      p.rect(x - w / 2, 0, x + w / 2, h, hex("#050b08"));
      p.rect(x - w / 2 + 1, 0, x + w / 2 - 1, h, hex("#0a1410"));
      p.rect(x + w / 2, 0, x + w / 2, h, hex("#14221a"));
      p.dot(x + w / 2, h, hex("#1d3a24"));
    }

    // bushes: overlapping clumps lit on top
    const bush = (x: number, y: number, r: number) => {
      for (let i = 0; i < 3; i++) {
        const cx = x + R.range(-r * 0.5, r * 0.5);
        const cy = y + R.range(-r * 0.35, r * 0.35);
        const rr = r * R.range(0.55, 0.95);
        for (let yy = Math.floor(cy - rr); yy <= cy + rr; yy++)
          for (let xx = Math.floor(cx - rr); xx <= cx + rr; xx++) {
            const dx = xx - cx;
            const dy = (yy - cy) * 1.25;
            if (dx * dx + dy * dy > rr * rr) continue;
            p.dot(xx, yy, dy < -rr * 0.3 ? hex("#3d6f3a") : hex("#1d3a24"));
          }
      }
      p.dot(x, y - r * 0.6, hex("#86b45c"), 0.6);
      p.dot(x + 1, y - r * 0.45, hex("#5b9147"), 0.7);
    };
    for (let i = 0; i < 13; i++) {
      const left = R.chance(0.5);
      bush(left ? R.range(2, 20) : R.range(this.w - 20, this.w - 2), R.range(34, this.h - 8), R.int(4, 8));
    }
    for (let i = 0; i < 7; i++) bush(R.range(30, this.w - 30), R.range(6, 24), R.int(3, 6));

    // fire pit: a ring of stones, ash, and two logs
    for (let i = 0; i < 11; i++) {
      const a = (i / 11) * TAU + 0.2;
      const x = CONFIG.fireX + Math.cos(a) * 12;
      const y = CONFIG.fireY + Math.sin(a) * 7;
      p.dot(x, y, hex("#55514a"));
      p.dot(x, y + 1, hex("#2a282a"));
      p.dot(x + 1, y, hex("#3d3a38"));
    }
    p.disc(CONFIG.fireX, CONFIG.fireY + 1, 7, hex("#1a1512"), 0.55);
  }

  /** Draw the world, apply the night, then draw the HUD on top of the darkness. */
  render(world: World, fx: SceneFx, out: Uint8ClampedArray, opts: RenderOptions): void {
    const p = this.painter;
    const f = this.frame;
    f.color.set(this.bg.color);
    f.light.fill(0);
    p.reset();

    // finds first: they sit on the ground
    for (const g of world.finds) {
      const y = g.y + Math.sin(g.age * 3 + g.bob) * 1.2;
      const blink = g.dropped ? (Math.sin(g.age * 14) > 0 ? 1 : 0.45) * clamp(g.life / CONFIG.dropLife) : 1;
      p.place(g.x, y);
      const spr = g.kind === "amber" ? AMBER : FIREFLY;
      p.dot(0, 1, hex("#0a120c"), 0.5);
      p.sprite(spr.rows, spr.pal, -spr.ax, -spr.ay, { a: blink });
      p.place(g.x, y - 3);
      p.glow(0, 0, g.kind === "amber" ? 9 : 7, at(AMBER_R, 0.85), 0.3 * blink);
      if (g.dropped) p.ring(0, 2, 4 + Math.sin(g.age * 8), at(BLOOD, 0.6), 0.3 * blink);
    }

    for (const c of world.creatures) this.drawCreature(p, c, opts.time);

    // the fire, then the hero so he can stand in front of it
    fx.campfire.draw(p);
    this.drawHero(p, world, opts.time);

    p.place(0, 0);
    for (const e of fx.transient) e.draw(p);
    fx.fireflies.draw(p);
    fx.leaves.draw(p);

    if (opts.shakeX || opts.shakeY) this.shiftLayer(opts.shakeX ?? 0, opts.shakeY ?? 0);

    this.computeLight(world, opts.mode, opts.time);
    composite(f, out, null, this.dark, this.warm, 1);

    // ---- UI pass: crisp, unaffected by the night
    clearFrame(f);
    p.reset();
    if (opts.mode === "title") this.drawTitle(world, opts);
    else if (opts.mode === "over") this.drawOver(world, opts);
    else this.drawHud(world, opts);
    over(f, out);
  }

  private drawCreature(p: Painter, c: Creature, time: number): void {
    const windup = c.state === "windup";
    const spr: SpriteDef = c.kind === "slug" ? (windup ? SLUG_WINDUP : SLUG) : windup ? BEETLE_WINDUP : BEETLE;
    const shake = windup ? (Math.sin(time * 70) > 0 ? 1 : -1) : 0;
    const bob = Math.sin(c.bob) * (c.state === "walk" ? 0.6 : 0);
    const px = Math.round(c.x) + shake;
    const py = Math.round(c.y) + bob;

    // contact shadow, so nothing floats
    p.place(px, py);
    p.disc(0, -0.5, spr.ax - 2, hex("#07100b"), 0.45);

    this.spriteOutlined(p, spr, px, py, c.dirX < 0);
    if (c.flash > 0) {
      // a solid white silhouette for a frame or two: the hit reads instantly
      const flashPal = spr.pal.map((_, i) => (i === 0 ? hex("#1a1208") : hex("#fff8e6")));
      p.sprite(spr.rows, flashPal, -spr.ax, -spr.ay, { flip: c.dirX < 0 });
    }
    p.place(px, py - 4);
    p.light(0, 0, at(AMBER_R, 0.9), 0.22);
    if (c.kind === "beetle") {
      p.place(px, py);
      for (let i = 0; i < c.hp; i++) p.dot(-1 + i * 2, -spr.ay - 2, at(BLOOD, 0.85), 0.95);
    }
    if (windup) {
      const u = clamp(c.t / 0.42);
      p.place(px, py);
      // "!" above the head, growing, plus a red rim so the telegraph reads in the dark
      p.dot(0, -spr.ay - 9, at(BLOOD, 1), 1);
      p.dot(0, -spr.ay - 8, at(BLOOD, 1), 1);
      p.dot(0, -spr.ay - 6, at(BLOOD, 1), 1);
      p.glow(0, -spr.ay + 2, 10, at(BLOOD, 0.7), 0.12 + 0.14 * u);
    }
  }

  /** Draw a sprite with a 1 px dark outline underneath: the cheapest way to separate it from the floor. */
  private spriteOutlined(p: Painter, spr: SpriteDef, x: number, y: number, flip: boolean, a = 1): void {
    const rim = spr.pal.map(() => hex("#9fc47a"));
    p.place(x - 1, y - 1);
    p.sprite(spr.rows, rim, -spr.ax, -spr.ay, { flip, a: a * 0.45 });
    const outline = spr.pal.map((_, i) => hex(i === 0 ? "#040806" : "#0d1a12"));
    for (const [dx, dy] of [
      [-1, 0],
      [1, 0],
      [0, 1],
    ]) {
      p.place(x + dx, y + dy);
      p.sprite(spr.rows, outline, -spr.ax, -spr.ay, { flip, a });
    }
    p.place(x, y);
    p.sprite(spr.rows, spr.pal, -spr.ax, -spr.ay, { flip, a });
  }

  private drawHero(p: Painter, world: World, time: number): void {
    const step = world.moving && Math.sin(world.heroStep * Math.PI * 2) > 0;
    const spr = step ? HERO_STEP : HERO_IDLE;
    const bob = world.moving ? (Math.sin(world.heroStep * TAU) > 0 ? 0 : -1) : 0;
    const blink = world.invuln > 0 && Math.sin(time * 40) > 0;
    const hx = Math.round(world.heroX);
    const hy = Math.round(world.heroY) + bob;

    p.place(hx, hy);
    p.disc(0, -0.5, 5, hex("#07100b"), 0.5);
    this.spriteOutlined(p, spr, hx, hy, false, blink ? 0.4 : 1);

    // the lantern in his hand: the one bright thing he carries
    p.place(hx + 5, hy - 7);
    p.dot(0, 0, at(AMBER_R, 1), 1);
    p.dot(0, -1, hex("#fff2b8"), 0.9);
    p.glow(0, 0, 11, at(AMBER_R, 0.9), 0.5);

    // carried finds orbit his shoulders
    for (let i = 0; i < world.carried.length; i++) {
      const a = time * 2 + (i / CONFIG.carryMax) * TAU;
      const x = hx + Math.cos(a) * 6;
      const y = hy - 15 + Math.sin(a) * 2;
      p.place(x, y);
      p.dot(0, 0, world.carried[i] === "amber" ? at(AMBER_R, 1) : at(AMBER_R, 0.8), 1);
      p.glow(0, 0, 4, at(AMBER_R, 0.9), 0.35);
    }

    // the strike: a short smear toward the target, always answered the moment you tap
    if (world.strikePulse > 0) {
      const u = 1 - world.strikePulse / 0.16;
      const a0 = world.strikeAngle - 0.8;
      const a1 = world.strikeAngle + 0.6;
      p.place(hx, hy - 8);
      for (let s = 0; s <= 1; s += 0.05) {
        const ang = a0 + (a1 - a0) * s;
        const w = 1 + Math.round(2 * Math.sin(Math.PI * s));
        for (let k = 0; k < w; k++) {
          p.dot(Math.cos(ang) * (11 + k * 2), Math.sin(ang) * (8 + k * 1.5), at(FIRE, 0.9), (1 - u) * (0.55 + 0.45 * s));
        }
      }
      p.glow(Math.cos(world.strikeAngle) * 12, Math.sin(world.strikeAngle) * 9, 8, at(AMBER_R, 0.9), 0.4 * (1 - u));
    }
  }

  // ---------------------------------------------------------------- UI

  private drawHud(world: World, opts: RenderOptions): void {
    const p = this.painter;
    p.reset();
    drawText(p, `СЧЁТ ${world.score}`, 6, 5, INK, { outline: SHADOW });
    drawText(p, `РЕКОРД ${Math.max(opts.best, world.score)}`, 6, 14, at(AMBER_R, 0.9), { outline: SHADOW });

    for (let i = 0; i < CONFIG.heartsMax; i++) {
      const alive = i < world.hearts;
      const rows = alive ? HEART : HEART_EMPTY;
      const x = this.w - 6 - (CONFIG.heartsMax - i) * 9;
      const y = 5;
      for (let ry = 0; ry < rows.length; ry++)
        for (let rx = 0; rx < rows[ry].length; rx++) {
          if (rows[ry][rx] !== "#") continue;
          // outline pass first, then the fill, so hearts read on any background
          if (alive) p.dot(x + rx + 1, y + ry + 1, hex("#2a080c"), 0.9);
          else p.dot(x + rx + 1, y + ry + 1, SHADOW, 0.8);
        }
      for (let ry = 0; ry < rows.length; ry++)
        for (let rx = 0; rx < rows[ry].length; rx++) {
          if (rows[ry][rx] !== "#") continue;
          p.dot(x + rx, y + ry, alive ? at(BLOOD, 0.95) : hex("#2b3a2e"));
        }
    }

    // what you stand to lose, bottom left
    p.place(0, 0);
    for (let i = 0; i < CONFIG.carryMax; i++) {
      const kind = world.carried[i];
      p.place(9 + i * 8, this.h - 8);
      if (kind) {
        const spr = kind === "amber" ? AMBER : FIREFLY;
        p.sprite(spr.rows, spr.pal, -2, -2);
        p.glow(0, 0, 4, at(AMBER_R, 0.9), 0.3);
      } else {
        p.rect(-2, -1, 2, 1, hex("#1b2a20"));
      }
    }
  }

  private drawTitle(world: World, opts: RenderOptions): void {
    const p = this.painter;
    void world;
    // a dithered panel: the title has to read over the firelight
    const top = 26;
    const bottom = this.h - 22;
    for (let y = top; y <= bottom; y++) {
      const edge = y === top || y === bottom ? 0.55 : 0.86;
      for (let x = 26; x < this.w - 26; x++) p.blend(x, y, hex("#050c08"), edge);
    }
    p.rect(30, top, this.w - 30, top, hex("#1d2b1f"), 0.5);

    drawText(p, "ЛЕСНОЙ ОГОНЬ", this.w / 2, 34, hex("#fff2b8"), { align: "center", scale: 2, outline: hex("#20100a") });
    p.rect(this.w / 2 - 30, 54, this.w / 2 + 30, 54, at(AMBER_R, 0.8), 0.7);

    drawText(p, "ВЕДИ ПАЛЬЦЕМ — ИДИ", this.w / 2, 66, INK, { align: "center", outline: SHADOW });
    drawText(p, "ТАП — УДАР", this.w / 2, 78, INK, { align: "center", outline: SHADOW });
    drawText(p, "НАХОДКИ НЕСИ К КОСТРУ", this.w / 2, 94, at(AMBER_R, 0.85), { align: "center", outline: SHADOW });
    drawText(p, "УДАР — И ВЫРОНИШЬ ВСЁ", this.w / 2, 104, at(BLOOD, 0.85), { align: "center", outline: SHADOW });

    const pulse = Math.sin(opts.time * 3) > -0.2 ? 1 : 0.72;
    drawText(p, "ТАП — ВОЙТИ", this.w / 2, 122, hex("#ffffff"), { align: "center", outline: SHADOW, alpha: pulse });
    if (opts.best > 0) drawText(p, `РЕКОРД ${opts.best}`, this.w / 2, 138, at(MOSS, 0.85), { align: "center", outline: SHADOW });
  }

  private drawOver(world: World, opts: RenderOptions): void {
    const p = this.painter;
    const top = 28;
    const bottom = this.h - 20;
    for (let y = top; y <= bottom; y++) {
      const edge = y === top || y === bottom ? 0.5 : 0.88;
      for (let x = 20; x < this.w - 20; x++) p.blend(x, y, hex("#050b07"), edge);
    }
    p.rect(24, top, this.w - 24, top, at(AMBER_R, 0.6), 0.5);

    drawText(p, "КОСТЁР ПОГАС", this.w / 2, 36, at(FIRE, 0.95), { align: "center", scale: 2, outline: hex("#1a0a05") });
    drawText(p, `СЧЁТ ${world.banked + world.kills > 0 ? world.score : 0}`, this.w / 2, 62, hex("#ffffff"), {
      align: "center",
      scale: 2,
      outline: SHADOW,
    });
    drawText(p, `СДАНО ${world.banked} · УБИТО ${world.kills}`, this.w / 2, 84, INK_DIM, { align: "center", outline: SHADOW });
    if (opts.record) {
      drawText(p, "НОВЫЙ РЕКОРД", this.w / 2, 100, at(AMBER_R, 1), { align: "center", outline: SHADOW });
      for (let i = 0; i < 6; i++) {
        const a = opts.time * 1.7 + i * 1.1;
        p.dot(this.w / 2 + Math.cos(a) * (52 + i * 3), 96 + Math.sin(a * 1.4) * 10, at(AMBER_R, 0.95), 0.5 + 0.4 * Math.sin(opts.time * 5 + i));
      }
    } else {
      drawText(p, `РЕКОРД ${opts.best}`, this.w / 2, 100, at(MOSS, 0.85), { align: "center", outline: SHADOW });
    }
    const pulse = Math.sin(opts.time * 3.4) > -0.3 ? 1 : 0.45;
    drawText(p, "ТАП — ЗАНОВО", this.w / 2, 124, hex("#ffffff"), { align: "center", outline: SHADOW, alpha: pulse });
  }

  // ---------------------------------------------------------------- the night

  /** One light field from the fire and the lantern, quantized into dithered steps, warm near the fire. */
  private computeLight(world: World, mode: RenderOptions["mode"], time = 0): void {
    const w = this.w;
    const h = this.h;
    const dark = this.dark;
    const warm = this.warm;
    const night = mode === "play" ? world.night : 0.12;
    const baseLevel = 0.2 - night * 0.08;
    const fireR = 54;
    const heroR = mode === "title" ? 44 : world.lightRadius;
    const hx = mode === "title" ? CONFIG.fireX + 14 : world.heroX;
    const hy = mode === "title" ? CONFIG.fireY + 6 : world.heroY;
    const fx = CONFIG.fireX;
    const fy = CONFIG.fireY;
    const soft = 18;
    const steps = 5;

    const falloff = (d: number, r: number): number => {
      if (d >= r) return 0;
      if (d <= r - soft) return 1;
      return smooth(r - soft, r, d);
    };
    // the light's edge breathes: firelight is never a circle
    const wobble = (angle: number, seed: number, amp: number, speed: number): number =>
      loopNoise(angle * 2.2 + time * speed, 9, seed) * amp + loopNoise(angle * 5.1 - time * speed * 1.7, 14, seed + 3) * amp * 0.5;

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const dxh = x + 0.5 - hx;
        const dyh = y + 0.5 - hy;
        const dxf = x + 0.5 - fx;
        const dyf = (y + 0.5 - fy) * 1.25;
        const dh = Math.sqrt(dxh * dxh + dyh * dyh);
        const df = Math.sqrt(dxf * dxf + dyf * dyf);
        const heroAngle = Math.atan2(dyh, dxh);
        const fireAngle = Math.atan2(dyf, dxf);
        const heroL = falloff(dh, heroR * (1 + wobble(heroAngle, 5, 0.05, 0.7)));
        const fireL = falloff(df, fireR * (1 + wobble(fireAngle, 11, 0.07, 3.1)));
        const l = Math.max(heroL, fireL);
        // a light that is brightest at its centre and fades towards its rim, like a lantern
        const inner = l <= 0 ? 0 : 1 - 0.22 * smooth(0.15, 1, l > 0 ? Math.min(dh / heroR, 1) : 1);
        const level = baseLevel + (1 - baseLevel) * l * (l > 0 ? inner : 1);
        // quantize with ordered dithering: bands of tone, not a smear and not one checkerboard ring
        const q = level * steps;
        const b = Math.floor(q);
        const frac = q - b;
        const stepped = Math.min(steps, b + (frac > BAYER[((y & 3) << 2) | (x & 3)] ? 1 : 0)) / steps;
        const i = y * w + x;
        dark[i] = (stepped * 255) | 0;
        const warmth = Math.max(fireL, heroL * 0.5);
        warm[i] = (warmth * 255) | 0;
        // firelight is a real light, not just "less dark": it washes the ground and everything on it
        if (warmth > 0.01) {
          const k = warmth * warmth * 0.16;
          const d = this.frame.light[i];
          const rr = Math.min(255, (d & 255) + 112 * k) | 0;
          const gg = Math.min(255, ((d >>> 8) & 255) + 72 * k) | 0;
          const bb = Math.min(255, ((d >>> 16) & 255) + 34 * k) | 0;
          this.frame.light[i] = ((255 << 24) | (bb << 16) | (gg << 8) | rr) >>> 0;
        }
      }
    }
  }

  /** Shake the world layer before the night is applied, so the HUD never wobbles. */
  private shiftLayer(sx: number, sy: number): void {
    const w = this.w;
    const h = this.h;
    const C = this.frame.color;
    const L = this.frame.light;
    const copyC = new Uint32Array(C);
    const copyL = new Uint32Array(L);
    for (let y = 0; y < h; y++) {
      const srcY = clamp(y - sy, 0, h - 1);
      for (let x = 0; x < w; x++) {
        const srcX = clamp(x - sx, 0, w - 1);
        C[y * w + x] = copyC[srcY * w + srcX];
        L[y * w + x] = copyL[srcY * w + srcX];
      }
    }
  }
}

/** A pooled effect list: spawn, update, drop when done. Keeps effects out of the game state. */
export class FxBag {
  readonly transient: Fx[] = [];
  add(fx: Fx): void {
    this.transient.push(fx);
  }
  update(dt: number): void {
    for (let i = this.transient.length - 1; i >= 0; i--) {
      const fx = this.transient[i];
      fx.update(dt);
      if (fx.done) this.transient.splice(i, 1);
    }
  }
  clear(): void {
    this.transient.length = 0;
  }
}
