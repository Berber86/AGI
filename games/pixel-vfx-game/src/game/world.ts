// The whole simulation, in plain TypeScript with no Phaser and no rendering: deterministic, seeded, and
// therefore testable in Node. The scene only feeds it input and draws the result.

import { Rng, clamp, dist, ease, lerp } from "../core/math.js";

export const CONFIG = {
  w: 320,
  h: 180,
  fireX: 160,
  fireY: 104,
  heroSpeed: 46,
  carryMax: 3,
  pickupR: 7,
  bankR: 17,
  strikeR: 21,
  strikeCd: 0.42,
  iframes: 1.0,
  heartsMax: 3,
  lightStart: 96,
  lightEnd: 42,
  nightSeconds: 240,
  groundFindMax: 6,
  creatureMax: 7,
  findEvery: 1.9,
  creatureEvery: [5.4, 2.4] as const,
  dropLife: 4,
} as const;

export type FindKind = "firefly" | "amber";
export type CreatureKind = "slug" | "beetle";
export type CreatureState = "walk" | "windup" | "lunge" | "recover";

export interface GroundFind {
  id: number;
  kind: FindKind;
  x: number;
  y: number;
  age: number;
  /** dropped finds fade out: they were lost, not spawned */
  life: number;
  dropped: boolean;
  bob: number;
}

export interface Creature {
  id: number;
  kind: CreatureKind;
  x: number;
  y: number;
  hp: number;
  state: CreatureState;
  t: number;
  dirX: number;
  dirY: number;
  flash: number;
  bob: number;
}

export interface InputState {
  /** pointer in world pixels, or null when the finger is up */
  px: number | null;
  py: number | null;
  /** number of taps queued since the last step */
  strike: number;
}

export const emptyInput = (): InputState => ({ px: null, py: null, strike: 0 });

export type GameEvent =
  | { type: "pickup"; kind: FindKind; x: number; y: number; carried: number }
  | { type: "bank"; x: number; y: number; amount: number; score: number; carried: number }
  | { type: "strike"; x: number; y: number; angle: number; hit: boolean }
  | { type: "hitCreature"; x: number; y: number; kind: CreatureKind; killed: boolean }
  | { type: "damage"; x: number; y: number; hearts: number }
  | { type: "drop"; kind: FindKind; x: number; y: number }
  | { type: "spawn"; kind: CreatureKind; x: number; y: number }
  | { type: "over"; score: number; best: number; record: boolean };

const FIND_VALUE: Record<FindKind, number> = { firefly: 1, amber: 2 };

export class World {
  readonly seed: number;
  status: "playing" | "over" = "playing";
  t = 0;
  score = 0;
  best: number;
  hearts: number = CONFIG.heartsMax;
  invuln = 0;
  carryCd = 0;
  strikeCd = 0;
  strikeAngle = 0;
  strikePulse = 0;
  carried: FindKind[] = [];
  finds: GroundFind[] = [];
  creatures: Creature[] = [];
  heroX: number = CONFIG.fireX;
  heroY: number = CONFIG.fireY + 26;
  heroStep = 0;
  moving = false;
  lightRadius: number = CONFIG.lightStart;
  night = 0;
  events: GameEvent[] = [];
  banked = 0;
  kills = 0;
  private rng: Rng;
  private nextId = 1;
  private findTimer = 0.8;
  private creatureTimer = 2.2;

  constructor(seed = 1, best = 0) {
    this.seed = seed >>> 0;
    this.best = best;
    this.rng = new Rng(this.seed);
    for (let i = 0; i < 3; i++) this.spawnFind("firefly");
    this.spawnFind("amber");
  }

  get fireX(): number {
    return CONFIG.fireX;
  }
  get fireY(): number {
    return CONFIG.fireY;
  }

  get creatureEvery(): number {
    return lerp(CONFIG.creatureEvery[0], CONFIG.creatureEvery[1], this.night);
  }

  private spawnFind(kind: FindKind, x?: number, y?: number): GroundFind | null {
    if (this.finds.length >= CONFIG.groundFindMax) return null;
    let fx = x ?? 0;
    let fy = y ?? 0;
    if (x === undefined || y === undefined) {
      for (let attempt = 0; attempt < 12; attempt++) {
        fx = this.rng.range(16, CONFIG.w - 16);
        fy = this.rng.range(26, CONFIG.h - 12);
        if (dist(fx, fy, CONFIG.fireX, CONFIG.fireY) > 44) break;
      }
    }
    const f: GroundFind = { id: this.nextId++, kind, x: fx, y: fy, age: 0, life: 0, dropped: false, bob: this.rng.range(0, Math.PI * 2) };
    this.finds.push(f);
    return f;
  }

  private spawnCreature(): void {
    if (this.creatures.length >= CONFIG.creatureMax) return;
    const kind: CreatureKind = this.rng.chance(0.45 + this.night * 0.25) ? "beetle" : "slug";
    const side = this.rng.int(0, 3);
    const m = 6;
    let x = 0;
    let y = 0;
    if (side === 0) {
      x = this.rng.range(m, CONFIG.w - m);
      y = m;
    } else if (side === 1) {
      x = CONFIG.w - m;
      y = this.rng.range(m, CONFIG.h - m);
    } else if (side === 2) {
      x = this.rng.range(m, CONFIG.w - m);
      y = CONFIG.h - m;
    } else {
      x = m;
      y = this.rng.range(m, CONFIG.h - m);
    }
    this.creatures.push({
      id: this.nextId++,
      kind,
      x,
      y,
      hp: kind === "beetle" ? 2 : 1,
      state: "walk",
      t: 0,
      dirX: 1,
      dirY: 0,
      flash: 0,
      bob: this.rng.range(0, Math.PI * 2),
    });
    this.events.push({ type: "spawn", kind, x, y });
  }

  private dropCarried(): void {
    if (!this.carried.length) return;
    const kind = this.carried.pop()!;
    const f = this.spawnFind(kind, clamp(this.heroX + this.rng.range(-9, 9), 12, CONFIG.w - 12), clamp(this.heroY + this.rng.range(-4, 8), 18, CONFIG.h - 10));
    if (f) {
      f.dropped = true;
      f.life = CONFIG.dropLife;
      this.events.push({ type: "drop", kind, x: f.x, y: f.y });
    }
  }

  private hurt(): void {
    if (this.invuln > 0 || this.status !== "playing") return;
    this.hearts = Math.max(0, this.hearts - 1);
    this.invuln = CONFIG.iframes;
    this.events.push({ type: "damage", x: this.heroX, y: this.heroY, hearts: this.hearts });
    this.dropCarried();
    if (this.hearts <= 0) this.finish();
  }

  private finish(): void {
    if (this.status === "over") return;
    this.status = "over";
    const record = this.score > this.best;
    if (record) this.best = this.score;
    this.events.push({ type: "over", score: this.score, best: this.best, record });
  }

  /** One fixed step: 1/60 s. */
  step(dt: number, input: InputState): void {
    this.events.length = 0;
    if (this.status !== "playing") return;
    dt = Math.min(dt, 0.05);
    this.t += dt;
    this.night = clamp(this.t / CONFIG.nightSeconds);
    this.lightRadius = lerp(CONFIG.lightStart, CONFIG.lightEnd, ease.inOutSine(this.night));
    this.invuln = Math.max(0, this.invuln - dt);
    this.strikeCd = Math.max(0, this.strikeCd - dt);
    this.strikePulse = Math.max(0, this.strikePulse - dt);

    // --- hero movement: the finger is the destination, the hero walks at a fixed speed
    this.moving = false;
    if (input.px !== null && input.py !== null) {
      const dx = input.px - this.heroX;
      const dy = input.py - this.heroY;
      const d = Math.hypot(dx, dy);
      if (d > 1.5) {
        const step = Math.min(d, CONFIG.heroSpeed * dt);
        this.heroX += (dx / d) * step;
        this.heroY += (dy / d) * step;
        this.moving = true;
        this.heroStep += step * 0.16;
      }
    }
    this.heroX = clamp(this.heroX, 8, CONFIG.w - 8);
    this.heroY = clamp(this.heroY, 20, CONFIG.h - 6);
    // you cannot walk into the fire: it pushes you out to the ring of stones
    const fd = dist(this.heroX, this.heroY, CONFIG.fireX, CONFIG.fireY);
    if (fd < 11) {
      const a = fd > 0.001 ? Math.atan2(this.heroY - CONFIG.fireY, this.heroX - CONFIG.fireX) : Math.PI / 2;
      this.heroX = CONFIG.fireX + Math.cos(a) * 11;
      this.heroY = CONFIG.fireY + Math.sin(a) * 11;
    }

    // --- pick up what you walk over
    for (let i = this.finds.length - 1; i >= 0; i--) {
      const f = this.finds[i];
      f.age += dt;
      if (f.dropped) {
        f.life -= dt;
        if (f.life <= 0) {
          this.finds.splice(i, 1);
          continue;
        }
      }
      if (this.carried.length < CONFIG.carryMax && dist(f.x, f.y, this.heroX, this.heroY) < CONFIG.pickupR) {
        this.carried.push(f.kind);
        this.finds.splice(i, 1);
        this.events.push({ type: "pickup", kind: f.kind, x: f.x, y: f.y, carried: this.carried.length });
      }
    }

    // --- bank at the fire
    if (this.carried.length && dist(this.heroX, this.heroY, CONFIG.fireX, CONFIG.fireY) < CONFIG.bankR) {
      let amount = 0;
      for (const k of this.carried) amount += FIND_VALUE[k];
      this.score += amount;
      this.banked += this.carried.length;
      this.carried = [];
      this.events.push({ type: "bank", x: CONFIG.fireX, y: CONFIG.fireY, amount, score: this.score, carried: 0 });
    }

    // --- tap to strike: the nearest creature inside reach
    while (input.strike > 0) {
      input.strike--;
      if (this.strikeCd > 0) continue;
      this.strikeCd = CONFIG.strikeCd;
      this.strikePulse = 0.16;
      let target: Creature | null = null;
      let bestD: number = CONFIG.strikeR;
      for (const c of this.creatures) {
        const d = dist(c.x, c.y, this.heroX, this.heroY);
        if (d < bestD) {
          bestD = d;
          target = c;
        }
      }
      this.strikeAngle = target ? Math.atan2(target.y - this.heroY, target.x - this.heroX) : this.heroStep % 2 ? 0 : Math.PI;
      this.events.push({ type: "strike", x: this.heroX, y: this.heroY - 8, angle: this.strikeAngle, hit: !!target });
      if (!target) continue;
      target.hp -= 1;
      target.flash = 0.18;
      const push = 9;
      const a = this.strikeAngle;
      target.x = clamp(target.x + Math.cos(a) * push, 6, CONFIG.w - 6);
      target.y = clamp(target.y + Math.sin(a) * push, 16, CONFIG.h - 6);
      const killed = target.hp <= 0;
      this.events.push({ type: "hitCreature", x: target.x, y: target.y - 4, kind: target.kind, killed });
      if (killed) {
        this.creatures = this.creatures.filter((c) => c.id !== target!.id);
        this.score += target.kind === "beetle" ? 2 : 1;
        this.kills += 1;
      }
    }

    // --- creatures
    for (const c of this.creatures) {
      c.t += dt;
      c.flash = Math.max(0, c.flash - dt);
      c.bob += dt * (c.state === "lunge" ? 12 : 4);
      const d = dist(c.x, c.y, this.heroX, this.heroY);
      const speed = c.kind === "beetle" ? 22 : 14;
      if (c.state === "walk") {
        const a = Math.atan2(this.heroY - c.y, this.heroX - c.x);
        c.dirX = Math.cos(a);
        c.dirY = Math.sin(a);
        c.x += c.dirX * speed * dt;
        c.y += c.dirY * speed * dt;
        if (d < 25) {
          c.state = "windup";
          c.t = 0;
        }
      } else if (c.state === "windup") {
        if (c.t > 0.42) {
          c.state = "lunge";
          c.t = 0;
        }
      } else if (c.state === "lunge") {
        c.x += c.dirX * (c.kind === "beetle" ? 130 : 100) * dt;
        c.y += c.dirY * (c.kind === "beetle" ? 130 : 100) * dt;
        if (d < 9) this.hurt();
        if (c.t > 0.18) {
          c.state = "recover";
          c.t = 0;
        }
      } else if (c.state === "recover") {
        if (c.t > 0.85) {
          c.state = "walk";
          c.t = 0;
        }
      }
      c.x = clamp(c.x, 4, CONFIG.w - 4);
      c.y = clamp(c.y, 14, CONFIG.h - 4);
    }

    // --- spawning, paced by the night
    this.findTimer -= dt;
    if (this.findTimer <= 0) {
      this.findTimer = CONFIG.findEvery * (0.85 + this.rng.next() * 0.5);
      const kind: FindKind = this.rng.chance(0.22 + this.night * 0.2) ? "amber" : "firefly";
      this.spawnFind(kind);
    }
    this.creatureTimer -= dt;
    if (this.creatureTimer <= 0) {
      this.creatureTimer = this.creatureEvery * (0.8 + this.rng.next() * 0.4);
      this.spawnCreature();
    }
  }

  /** Between steps: drop stale events (the scene drains them each frame). */
  drain(): GameEvent[] {
    const out = this.events.slice();
    this.events.length = 0;
    return out;
  }

  snapshot() {
    return {
      status: this.status,
      t: +this.t.toFixed(4),
      score: this.score,
      best: this.best,
      hearts: this.hearts,
      carried: [...this.carried],
      finds: this.finds.map((f) => ({ id: f.id, kind: f.kind, x: +f.x.toFixed(2), y: +f.y.toFixed(2), dropped: f.dropped })),
      creatures: this.creatures.map((c) => ({ id: c.id, kind: c.kind, x: +c.x.toFixed(2), y: +c.y.toFixed(2), hp: c.hp, state: c.state })),
      heroX: +this.heroX.toFixed(2),
      heroY: +this.heroY.toFixed(2),
      lightRadius: +this.lightRadius.toFixed(2),
      night: +this.night.toFixed(4),
      banked: this.banked,
      kills: this.kills,
    };
  }
}

/** Persisted best score, versioned and safe against corrupt storage. */
export const BEST_KEY = "lesnoy-ogon:best:v1";

export function loadBest(): number {
  try {
    const raw = localStorage.getItem(BEST_KEY);
    if (!raw) return 0;
    const v = Number.parseInt(raw, 10);
    return Number.isFinite(v) && v >= 0 ? v : 0;
  } catch {
    return 0;
  }
}

export function saveBest(v: number): void {
  try {
    localStorage.setItem(BEST_KEY, String(Math.max(0, Math.floor(v))));
  } catch {
    /* private mode: the run still plays, the record just does not persist */
  }
}
