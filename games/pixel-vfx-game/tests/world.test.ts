import { describe, expect, it } from "vitest";
import { CONFIG, World, emptyInput } from "../src/game/world.js";

const step = (w: World, seconds: number, input = emptyInput()) => {
  const n = Math.round(seconds * 60);
  for (let i = 0; i < n; i++) w.step(1 / 60, input);
  return w;
};

describe("world: the core loop", () => {
  it("starts fresh with hearts, an empty score and finds on the ground", () => {
    const w = new World(7, 0);
    expect(w.status).toBe("playing");
    expect(w.hearts).toBe(CONFIG.heartsMax);
    expect(w.score).toBe(0);
    expect(w.carried).toHaveLength(0);
    expect(w.finds.length).toBeGreaterThan(0);
  });

  it("walks toward the finger and never leaves the arena", () => {
    const w = new World(1);
    const input = { px: 9999, py: 9999, strike: 0 };
    step(w, 3, input);
    expect(w.heroX).toBeLessThanOrEqual(CONFIG.w - 8);
    expect(w.heroY).toBeLessThanOrEqual(CONFIG.h - 6);
  });

  it("picks up a find it walks over and caps what it can carry", () => {
    const w = new World(2);
    for (let i = 0; i < 5; i++) w.finds.push({ id: 100 + i, kind: "firefly", x: 40, y: 40, age: 0, life: 0, dropped: false, bob: 0 });
    step(w, 4, { px: 40, py: 40, strike: 0 });
    expect(w.carried.length).toBe(CONFIG.carryMax);
    expect(w.finds.length).toBeGreaterThanOrEqual(2);
  });

  it("banks only at the fire and scores the carried value", () => {
    const w = new World(3);
    w.carried = ["amber", "firefly"];
    step(w, 4, { px: CONFIG.fireX, py: CONFIG.fireY, strike: 0 });
    expect(w.carried).toHaveLength(0);
    expect(w.banked).toBe(2);
    expect(w.score).toBe(3);
  });

  it("cannot stand in the fire: the hero is pushed out to the ring of stones", () => {
    const w = new World(41);
    const input = { px: CONFIG.fireX, py: CONFIG.fireY, strike: 0 };
    for (let i = 0; i < 240; i++) w.step(1 / 60, input);
    const d = Math.hypot(w.heroX - CONFIG.fireX, w.heroY - CONFIG.fireY);
    expect(d).toBeGreaterThanOrEqual(10.9);
    expect(d).toBeLessThan(CONFIG.bankR);
  });

  it("never scores for standing still", () => {
    const w = new World(4);
    w.hearts = 3;
    step(w, 60);
    expect(w.score).toBe(0);
    expect(w.banked).toBe(0);
  });

  it("drops carried finds when hit, and iframes stop a second hit in the same moment", () => {
    const w = new World(5);
    w.carried = ["amber", "amber", "firefly"];
    w.hearts = 3;
    w.invuln = 0;
    // stand in the dark and let the first creature arrive
    const before = w.hearts;
    let steps = 0;
    while (w.hearts === before && steps < 60 * 90) {
      w.step(1 / 60, emptyInput());
      steps += 1;
    }
    expect(w.hearts).toBe(before - 1);
    expect(w.carried).toHaveLength(2);
    const heartsAfter = w.hearts;
    w.step(1 / 60, emptyInput());
    expect(w.hearts).toBe(heartsAfter);
  });

  it("ends the run at zero hearts and freezes the score afterwards", () => {
    const w = new World(6);
    w.hearts = 1;
    let steps = 0;
    while (w.status === "playing" && steps < 60 * 120) {
      w.step(1 / 60, emptyInput());
      steps += 1;
    }
    expect(w.status).toBe("over");
    const score = w.score;
    step(w, 5);
    expect(w.score).toBe(score);
  });

  it("is deterministic for a seed and a scripted input", () => {
    const script = (w: World) => {
      const input = emptyInput();
      for (let i = 0; i < 60 * 25; i++) {
        input.px = 40 + Math.sin(i / 30) * 60;
        input.py = 70 + Math.cos(i / 40) * 30;
        if (i % 90 === 0) input.strike += 1;
        w.step(1 / 60, input);
        for (const e of w.drain()) if (e.type === "bank") w.score += 0;
      }
      return w.snapshot();
    };
    expect(script(new World(11, 0))).toEqual(script(new World(11, 0)));
    expect(script(new World(11, 0))).not.toEqual(script(new World(12, 0)));
  });

  it("closes the light as the night deepens", () => {
    const w = new World(8);
    const r0 = w.lightRadius;
    // keep the collector alive: this test is about the clock, not about surviving the dark
    const survive = (seconds: number) => {
      for (let i = 0; i < Math.round(seconds * 60); i++) {
        w.hearts = CONFIG.heartsMax;
        w.step(1 / 60, emptyInput());
      }
    };
    survive(120);
    const r1 = w.lightRadius;
    survive(60);
    expect(w.night).toBeGreaterThan(0.4);
    expect(r1).toBeLessThan(r0);
    expect(w.lightRadius).toBeLessThan(r1);
    expect(w.lightRadius).toBeGreaterThanOrEqual(CONFIG.lightEnd - 0.01);
  });

  it("kills a creature with a tap inside reach and scores it", () => {
    const w = new World(9);
    w.creatures.push({ id: 500, kind: "slug", x: w.heroX + 8, y: w.heroY, hp: 1, state: "walk", t: 0, dirX: -1, dirY: 0, flash: 0, bob: 0 });
    w.step(1 / 60, { px: null, py: null, strike: 1 });
    expect(w.creatures).toHaveLength(0);
    expect(w.kills).toBe(1);
    expect(w.score).toBe(1);
  });

  it("queues a strike even when the cooldown is still running, but does not double-hit", () => {
    const w = new World(10);
    w.creatures.push({ id: 501, kind: "beetle", x: w.heroX + 8, y: w.heroY, hp: 2, state: "walk", t: 0, dirX: -1, dirY: 0, flash: 0, bob: 0 });
    w.step(1 / 60, { px: null, py: null, strike: 1 });
    w.step(1 / 60, { px: null, py: null, strike: 1 });
    expect(w.creatures[0].hp).toBe(1);
  });
});
