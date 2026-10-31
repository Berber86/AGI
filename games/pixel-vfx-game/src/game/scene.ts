// Phaser is the host: the loop, the pointer, the canvas and the lifecycle. The world, the effects and the
// pixels are ours. Each frame renders into two buffers and is uploaded as one 320x180 texture, so nothing
// in the game can end up on a half pixel.

import Phaser from "phaser";
import { CONFIG, World, loadBest, saveBest, type GameEvent, type InputState, emptyInput } from "./world.js";
import { FxBag, Renderer, type RenderOptions, type SceneFx } from "./render.js";
import { GameAudio } from "./audio.js";
import { Campfire, DamageFx, DropFx, Fireflies, HitFx, Leaves, PickupFx, PoofFx, SlashFx } from "../fx/effects.js";
import { rand } from "../core/math.js";

export interface GameTestBridge {
  isReady(): boolean;
  start(): ReturnType<World["snapshot"]>;
  reset(seed?: number): ReturnType<World["snapshot"]>;
  getState(): { mode: string; world: ReturnType<World["snapshot"]>; best: number; record: boolean };
  moveTo(x: number, y: number): void;
  release(): void;
  strike(): void;
  tick(ms: number): void;
  metrics(): { frames: number; avgMs: number; maxMs: number; fps: number };
  setHearts(n: number): void;
  spawnFind(kind?: "firefly" | "amber"): { x: number; y: number };
  mode(): string;
}

declare global {
  interface Window {
    __GAME_TEST__?: GameTestBridge;
  }
}

const TAP_MS = 260;
const TAP_SLOP = 11;

export class PlayScene extends Phaser.Scene {
  private view = new Renderer();
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private imageData!: ImageData;
  private textureKey = "world";
  private world = new World(1, 0);
  private fxBag = new FxBag();
  private campfire = new Campfire(CONFIG.fireX, CONFIG.fireY, 5);
  private fireflies = new Fireflies(CONFIG.w, CONFIG.h, 9);
  private leaves = new Leaves(CONFIG.w, CONFIG.h, 13);
  private audio = new GameAudio();
  private inputState: InputState = emptyInput();
  private mode: RenderOptions["mode"] = "title";
  private best = 0;
  private record = false;
  private clock = 0;
  private hitStop = 0;
  private shake = 0;
  private restartLock = 0;
  private accumulator = 0;
  private tapStart = 0;
  private tapX = 0;
  private tapY = 0;
  private pointerActive = false;
  private frames = 0;
  private frameSum = 0;
  private frameMax = 0;
  private frameWindowStart = 0;
  private ready = false;
  private seedCounter = 1;

  constructor() {
    super("play");
  }

  create(): void {
    this.canvas = document.createElement("canvas");
    this.canvas.width = CONFIG.w;
    this.canvas.height = CONFIG.h;
    const ctx = this.canvas.getContext("2d", { willReadFrequently: false });
    if (!ctx) throw new Error("2D canvas is not available");
    this.ctx = ctx;
    this.imageData = ctx.createImageData(CONFIG.w, CONFIG.h);
    this.textures.addCanvas(this.textureKey, this.canvas);
    this.add.image(0, 0, this.textureKey).setOrigin(0, 0);

    this.best = loadBest();
    this.bindInput();
    this.bindLifecycle();
    this.installBridge();
    this.frameWindowStart = this.time.now;
    this.ready = true;
  }

  // ---------------------------------------------------------------- input

  private bindInput(): void {
    this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      this.audio.unlock();
      if (this.mode === "title") {
        this.startRun(this.nextSeed());
        return;
      }
      if (this.mode === "over") {
        if (this.time.now >= this.restartLock) this.startRun(this.nextSeed());
        return;
      }
      this.pointerActive = true;
      this.tapStart = this.time.now;
      this.tapX = pointer.x;
      this.tapY = pointer.y;
      this.inputState.px = pointer.x;
      this.inputState.py = pointer.y;
    });

    this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
      if (!this.pointerActive || this.mode !== "play") return;
      this.inputState.px = pointer.x;
      this.inputState.py = pointer.y;
    });

    const release = (pointer: Phaser.Input.Pointer) => {
      if (!this.pointerActive) return;
      this.pointerActive = false;
      const quick = this.time.now - this.tapStart < TAP_MS;
      const still = Math.hypot(pointer.x - this.tapX, pointer.y - this.tapY) < TAP_SLOP;
      if (this.mode === "play" && quick && still) this.inputState.strike += 1;
      this.inputState.px = null;
      this.inputState.py = null;
    };
    this.input.on("pointerup", release);
    this.input.on("pointerupoutside", release);
    this.input.on("gameout", () => {
      this.pointerActive = false;
      this.inputState.px = null;
      this.inputState.py = null;
    });
  }

  private bindLifecycle(): void {
    const onHidden = () => {
      this.pointerActive = false;
      this.inputState.px = null;
      this.inputState.py = null;
      this.audio.suspend();
    };
    const onVisible = () => {
      if (!document.hidden) this.audio.resume();
    };
    document.addEventListener("visibilitychange", () => (document.hidden ? onHidden() : onVisible()));
    window.addEventListener("blur", onHidden);
    window.addEventListener("pointerdown", () => this.audio.unlock(), { passive: true });
  }

  private nextSeed(): number {
    this.seedCounter += 1;
    return (rand(this.seedCounter, 0x51f3) * 0xffffffff) >>> 0;
  }

  // ---------------------------------------------------------------- runs

  private startRun(seed: number): void {
    this.best = loadBest();
    this.world = new World(seed >>> 0, this.best);
    this.campfire = new Campfire(CONFIG.fireX, CONFIG.fireY, seed + 3);
    this.fireflies = new Fireflies(CONFIG.w, CONFIG.h, seed + 9);
    this.leaves = new Leaves(CONFIG.w, CONFIG.h, seed + 13);
    this.fxBag.clear();
    this.inputState = emptyInput();
    this.mode = "play";
    this.clock = 0;
    this.hitStop = 0;
    this.shake = 0;
    this.accumulator = 0;
    this.record = false;
    this.audio.start();
  }

  private endRun(): void {
    this.mode = "over";
    this.record = this.world.best > this.best;
    this.best = this.world.best;
    saveBest(this.best);
    this.restartLock = this.time.now + 900;
    this.audio.over();
  }

  // ---------------------------------------------------------------- loop

  update(_time: number, delta: number): void {
    const dt = Math.min(delta, 50) / 1000;
    this.frames += 1;
    this.frameSum += delta;
    this.frameMax = Math.max(this.frameMax, delta);
    this.clock += dt;

    if (this.mode === "play") {
      if (this.hitStop > 0) {
        this.hitStop -= dt;
      } else {
        this.accumulator = Math.min(this.accumulator + dt, 0.25);
        const step = 1 / 60;
        let guard = 0;
        while (this.accumulator >= step && guard < 6) {
          this.world.step(step, this.inputState);
          this.consume(this.world.drain());
          this.accumulator -= step;
          guard += 1;
        }
      }
      this.audio.setNight(this.world.night);
    }

    this.fxBag.update(dt);
    this.campfire.update(dt);
    this.fireflies.update(dt);
    this.leaves.update(dt);
    this.shake = Math.max(0, this.shake - dt * 14);

    this.draw();
  }

  private consume(events: GameEvent[]): void {
    for (const e of events) {
      switch (e.type) {
        case "pickup":
          this.fxBag.add(new PickupFx(e.x, e.y, this.world.score + e.carried));
          this.audio.pickup();
          break;
        case "bank": {
          this.campfire.flare(1.2);
          this.fxBag.add(new PickupFx(e.x, e.y - 6, this.world.score + 3));
          this.audio.bank();
          this.shake = Math.max(this.shake, 0.8);
          break;
        }
        case "strike":
          this.fxBag.add(new SlashFx(e.x, e.y, e.angle, this.frames, 17));
          this.audio.strike();
          break;
        case "hitCreature":
          this.fxBag.add(new HitFx(e.x, e.y, this.frames + 1));
          this.audio.hitCreature();
          if (e.killed) {
            this.fxBag.add(new PoofFx(e.x, e.y + 4, this.frames + 2));
            this.audio.kill();
            this.hitStop = Math.max(this.hitStop, 0.09);
            this.shake = Math.max(this.shake, 2.2);
          } else {
            this.hitStop = Math.max(this.hitStop, 0.05);
            this.shake = Math.max(this.shake, 1.2);
          }
          break;
        case "damage":
          this.fxBag.add(new DamageFx());
          this.audio.damage();
          this.hitStop = Math.max(this.hitStop, 0.13);
          this.shake = Math.max(this.shake, 3.4);
          if (e.hearts <= 0) this.endRun();
          break;
        case "drop":
          this.fxBag.add(new DropFx(e.x, e.y, this.frames + 3));
          break;
        case "over":
          this.record = e.record;
          this.endRun();
          break;
        case "spawn":
          break;
      }
    }
  }

  private draw(): void {
    const sx = this.shake > 0.05 ? Math.round(Math.sin(this.clock * 60) * this.shake) : 0;
    const sy = this.shake > 0.05 ? Math.round(Math.cos(this.clock * 47) * this.shake * 0.6) : 0;
    const scene: SceneFx = {
      campfire: this.campfire,
      fireflies: this.fireflies,
      leaves: this.leaves,
      transient: this.fxBag.transient,
    };
    this.view.render(this.world, scene, this.imageData.data, {
      mode: this.mode,
      time: this.clock,
      best: this.best,
      record: this.record,
      shakeX: sx,
      shakeY: sy,
    });
    this.ctx.putImageData(this.imageData, 0, 0);
    (this.textures.get(this.textureKey) as Phaser.Textures.CanvasTexture).refresh();
  }

  // ---------------------------------------------------------------- test bridge

  private tickSim(ms: number): void {
    const step = 1 / 60;
    let left = ms / 1000;
    while (left > 0) {
      const dt = Math.min(step, left);
      if (this.mode === "play") {
        this.world.step(dt, this.inputState);
        this.consume(this.world.drain());
        this.campfire.update(dt);
        this.fireflies.update(dt);
        this.leaves.update(dt);
        this.fxBag.update(dt);
      }
      left -= dt;
    }
    this.draw();
  }

  private installBridge(): void {
    const bridge: GameTestBridge = {
      isReady: () => this.ready,
      start: () => {
        this.startRun(1234);
        return this.world.snapshot();
      },
      reset: (seed = 1) => {
        this.startRun(seed);
        return this.world.snapshot();
      },
      getState: () => ({ mode: this.mode, world: this.world.snapshot(), best: this.best, record: this.record }),
      moveTo: (x: number, y: number) => {
        this.inputState.px = x;
        this.inputState.py = y;
      },
      release: () => {
        this.inputState.px = null;
        this.inputState.py = null;
      },
      strike: () => {
        this.inputState.strike += 1;
      },
      tick: (ms: number) => this.tickSim(ms),
      metrics: () => ({
        frames: this.frames,
        avgMs: this.frames ? this.frameSum / this.frames : 0,
        maxMs: this.frameMax,
        fps: this.frames && this.time.now > this.frameWindowStart ? (this.frames * 1000) / (this.time.now - this.frameWindowStart) : 0,
      }),
      setHearts: (n: number) => {
        this.world.hearts = Math.max(0, Math.min(CONFIG.heartsMax, n));
      },
      spawnFind: (kind = "firefly") => {
        const x = this.world.heroX + 10;
        const y = this.world.heroY + 2;
        this.world.finds.push({ id: 9999, kind, x, y, age: 0, life: 0, dropped: false, bob: 0 });
        return { x, y };
      },
      mode: () => this.mode,
    };
    window.__GAME_TEST__ = bridge;
  }
}
