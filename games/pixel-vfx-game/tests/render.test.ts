import { describe, expect, it } from "vitest";
import { Renderer, type SceneFx } from "../src/game/render.js";
import { CONFIG, World } from "../src/game/world.js";
import { Campfire, Fireflies, HitFx, Leaves, SlashFx } from "../src/fx/effects.js";

const makeScene = (seed = 3): SceneFx => ({
  campfire: new Campfire(CONFIG.fireX, CONFIG.fireY, seed),
  fireflies: new Fireflies(CONFIG.w, CONFIG.h, seed + 1),
  leaves: new Leaves(CONFIG.w, CONFIG.h, seed + 2),
  transient: [],
});

const renderOnce = (renderer: Renderer, world: World, scene: SceneFx, out: Uint8ClampedArray, time = 1.5) =>
  renderer.render(world, scene, out, { mode: "play", time, best: 10, record: false });

describe("renderer", () => {
  it("draws the game at the contract resolution", () => {
    const renderer = new Renderer();
    expect(renderer.w).toBe(320);
    expect(renderer.h).toBe(180);
  });

  it("is deterministic: same state and time, same pixels", () => {
    const makeWorld = () => {
      const w = new World(21, 0);
      for (let i = 0; i < 120; i++) w.step(1 / 60, { px: 120, py: 80, strike: 0 });
      return w;
    };
    const outA = new Uint8ClampedArray(CONFIG.w * CONFIG.h * 4);
    const outB = new Uint8ClampedArray(CONFIG.w * CONFIG.h * 4);
    renderOnce(new Renderer(), makeWorld(), makeScene(), outA);
    renderOnce(new Renderer(), makeWorld(), makeScene(), outB);
    expect(Array.from(outA)).toEqual(Array.from(outB));
  });

  it("lights the fire and leaves the far corner dark", () => {
    const renderer = new Renderer();
    const world = new World(22, 0);
    const out = new Uint8ClampedArray(CONFIG.w * CONFIG.h * 4);
    renderOnce(renderer, world, makeScene(), out, 0.4);
    const at = (x: number, y: number) => {
      const i = (y * CONFIG.w + x) * 4;
      return out[i] + out[i + 1] + out[i + 2];
    };
    const nearFire = at(CONFIG.fireX, CONFIG.fireY - 6);
    const farCorner = at(4, 4);
    expect(nearFire).toBeGreaterThan(farCorner * 2);
  });

  it("keeps a frame under the 33.33 ms budget at the contract resolution", () => {
    const renderer = new Renderer();
    const world = new World(23, 0);
    const scene = makeScene();
    scene.transient.push(new SlashFx(160, 100, 0.6, 4), new HitFx(150, 96, 5));
    const out = new Uint8ClampedArray(CONFIG.w * CONFIG.h * 4);
    for (let i = 0; i < 10; i++) renderOnce(renderer, world, scene, out, i / 60);
    const t0 = performance.now();
    const frames = 60;
    for (let i = 0; i < frames; i++) {
      scene.campfire.update(1 / 60);
      for (const fx of scene.transient) fx.update(1 / 60);
      renderOnce(renderer, world, scene, out, 1 + i / 60);
    }
    const avg = (performance.now() - t0) / frames;
    expect(avg).toBeLessThan(33.33);
  });
});
