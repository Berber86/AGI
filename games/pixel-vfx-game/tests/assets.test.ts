import { describe, expect, it } from "vitest";
import { HERO_IDLE, HERO_STEP, SLUG, SLUG_WINDUP, BEETLE, BEETLE_WINDUP, FIREFLY, AMBER } from "../src/art/sprites.js";
import { GLYPHS, GLYPH_H, GLYPH_W } from "../src/core/font.js";
import { BAYER_PROBE } from "./helpers.js";

describe("sprite art", () => {
  const sprites = { HERO_IDLE, HERO_STEP, SLUG, SLUG_WINDUP, BEETLE, BEETLE_WINDUP, FIREFLY, AMBER };
  for (const [name, def] of Object.entries(sprites)) {
    it(`${name}: every row is the same width and every pixel indexes the palette`, () => {
      const w = def.rows[0].length;
      for (const row of def.rows) expect(row.length, name).toBe(w);
      for (const row of def.rows)
        for (const ch of row) {
          if (ch === ".") continue;
          const i = ch.charCodeAt(0) - 48;
          expect(i, `${name} char ${ch}`).toBeGreaterThanOrEqual(0);
          expect(i, `${name} char ${ch}`).toBeLessThan(def.pal.length);
        }
      expect(def.ax).toBeGreaterThanOrEqual(0);
      expect(def.ax).toBeLessThanOrEqual(w);
    });
  }
});

describe("pixel font", () => {
  it("has 5x7 glyphs for every letter the HUD uses", () => {
    const used = "СЧЁТРЕКОДНЫЙВЗАПЛУШГИТМЯБЮЖХЦЩЪФЭ0123456789:-!.";
    for (const ch of used) {
      const g = GLYPHS[ch];
      expect(g, ch).toBeDefined();
      expect(g).toHaveLength(GLYPH_H);
      for (const row of g) expect(row).toHaveLength(GLYPH_W);
    }
  });
});

describe("dither", () => {
  it("uses a 4x4 ordered matrix with 16 distinct thresholds", () => {
    expect(new Set(BAYER_PROBE()).size).toBe(16);
  });
});
