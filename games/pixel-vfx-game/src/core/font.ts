// A 5x7 pixel font, Cyrillic uppercase, digits and the punctuation the HUD needs. Text is drawn into the
// color buffer like any other pixel art: hard pixels, no antialiasing, optional 1 px dark outline so it
// reads over firelight.

import type { Painter } from "./frame.js";

const G = (s: string): string[] => s.split("|");

export const GLYPHS: Record<string, string[]> = {
  А: G(".###.|#...#|#...#|#####|#...#|#...#|#...#"),
  Б: G("#####|#....|#....|####.|#...#|#...#|####."),
  В: G("####.|#...#|#...#|####.|#...#|#...#|####."),
  Г: G("#####|#....|#....|#....|#....|#....|#...."),
  Д: G("..##.|.#.#.|.#.#.|.#.#.|.#.#.|#####|#...#"),
  Е: G("#####|#....|#....|####.|#....|#....|#####"),
  Ё: G("#.#.#|#####|#....|####.|#....|#....|#####"),
  Ж: G("#.#.#|#.#.#|#.#.#|.###.|#.#.#|#.#.#|#.#.#"),
  З: G("####.|#...#|....#|..##.|....#|#...#|####."),
  И: G("#...#|#...#|#..##|#.#.#|##..#|#...#|#...#"),
  Й: G(".#.#.|#...#|#..##|#.#.#|##..#|#...#|#...#"),
  К: G("#...#|#..#.|#.#..|##...|#.#..|#..#.|#...#"),
  Л: G("..###|.#..#|.#..#|.#..#|.#..#|#...#|#...#"),
  М: G("#...#|##.##|#.#.#|#.#.#|#...#|#...#|#...#"),
  Н: G("#...#|#...#|#...#|#####|#...#|#...#|#...#"),
  О: G(".###.|#...#|#...#|#...#|#...#|#...#|.###."),
  П: G("#####|#...#|#...#|#...#|#...#|#...#|#...#"),
  Р: G("####.|#...#|#...#|####.|#....|#....|#...."),
  С: G(".###.|#...#|#....|#....|#....|#...#|.###."),
  Т: G("#####|..#..|..#..|..#..|..#..|..#..|..#.."),
  У: G("#...#|#...#|.#.#.|..#..|..#..|.#...|##..."),
  Ф: G("..#..|.###.|#.#.#|#.#.#|#.#.#|.###.|..#.."),
  Х: G("#...#|#...#|.#.#.|..#..|.#.#.|#...#|#...#"),
  Ц: G("#...#|#...#|#...#|#...#|#...#|#####|....#"),
  Ч: G("#...#|#...#|#...#|.####|....#|....#|....#"),
  Ш: G("#.#.#|#.#.#|#.#.#|#.#.#|#.#.#|#.#.#|#####"),
  Щ: G("#.#.#|#.#.#|#.#.#|#.#.#|#.#.#|#####|....#"),
  Ъ: G("##...|.#...|.#...|.###.|.#..#|.#..#|.###."),
  Ы: G("#...#|#...#|##..#|#.#.#|#.#.#|#.#.#|##..#"),
  Ь: G("#....|#....|#....|####.|#...#|#...#|####."),
  Э: G(".###.|#...#|....#|..###|....#|#...#|.###."),
  Ю: G("#..#.|#.#.#|#.#.#|###.#|#.#.#|#.#.#|#..#."),
  Я: G(".####|#...#|#...#|.####|..#.#|.#..#|#...#"),
  "0": G(".###.|#...#|#..##|#.#.#|##..#|#...#|.###."),
  "1": G("..#..|.##..|..#..|..#..|..#..|..#..|.###."),
  "2": G(".###.|#...#|....#|...#.|..#..|.#...|#####"),
  "3": G("####.|....#|....#|.###.|....#|....#|####."),
  "4": G("...#.|..##.|.#.#.|#..#.|#####|...#.|...#."),
  "5": G("#####|#....|####.|....#|....#|#...#|.###."),
  "6": G("..##.|.#...|#....|####.|#...#|#...#|.###."),
  "7": G("#####|....#|...#.|..#..|.#...|.#...|.#..."),
  "8": G(".###.|#...#|#...#|.###.|#...#|#...#|.###."),
  "9": G(".###.|#...#|#...#|.####|....#|...#.|.##.."),
  ":": G(".....|..#..|.....|.....|..#..|.....|....."),
  "-": G(".....|.....|.....|.###.|.....|.....|....."),
  "!": G("..#..|..#..|..#..|..#..|..#..|.....|..#.."),
  ".": G(".....|.....|.....|.....|.....|.....|..#.."),
  "×": G(".....|#...#|.#.#.|..#..|.#.#.|#...#|....."),
  "+": G(".....|..#..|..#..|#####|..#..|..#..|....."),
  "/": G("....#|....#|...#.|..#..|.#...|#....|#...."),
};

export const GLYPH_W = 5;
export const GLYPH_H = 7;
export const TRACK = 1;

export function textWidth(rawText: string, scale = 1): number {
  const text = rawText.replace(/[—–]/g, "-").toUpperCase();
  let w = 0;
  for (const ch of text) w += (ch === " " ? 3 : GLYPH_W + TRACK) * scale;
  return Math.max(0, w - TRACK * scale);
}

export interface TextOptions {
  scale?: number;
  align?: "left" | "center" | "right";
  outline?: number;
  alpha?: number;
}

export function drawText(p: Painter, rawText: string, x: number, y: number, color: number, opts: TextOptions = {}): number {
  const text = rawText.replace(/[—–]/g, "-").toUpperCase();
  const scale = opts.scale ?? 1;
  const align = opts.align ?? "left";
  const width = textWidth(text, scale);
  let ox = align === "center" ? Math.round(x - width / 2) : align === "right" ? Math.round(x - width) : Math.round(x);
  const oy = Math.round(y);
  const a = opts.alpha ?? 1;

  const paint = (dx: number, dy: number, c: number) => {
    for (const ch of text) {
      if (ch === " ") {
        ox += 3 * scale;
        continue;
      }
      const glyph = GLYPHS[ch] ?? GLYPHS[ch.toUpperCase()];
      if (glyph) {
        for (let ry = 0; ry < GLYPH_H; ry++) {
          const row = glyph[ry];
          for (let rx = 0; rx < GLYPH_W; rx++) {
            if (row[rx] !== "#") continue;
            for (let sy = 0; sy < scale; sy++)
              for (let sx = 0; sx < scale; sx++) p.dot(ox + rx * scale + sx + dx, oy + ry * scale + sy + dy, c, a);
          }
        }
      }
      ox += (GLYPH_W + TRACK) * scale;
    }
    ox -= TRACK * scale;
  };

  const start = ox;
  if (opts.outline !== undefined) {
    for (const [dx, dy] of [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
      [-1, -1],
      [1, -1],
      [-1, 1],
      [1, 1],
    ]) {
      ox = start;
      paint(dx, dy, opts.outline);
    }
  }
  ox = start;
  paint(0, 0, color);
  return width;
}
