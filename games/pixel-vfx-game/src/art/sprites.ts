// Sprites from strings: rows of digits indexing a palette, '.' empty. Same idea as the effect library's
// p.sprite — nothing is an image file, everything is code and a ramp.

import { PAL, hex, ramp, type Palette } from "../core/color.js";

export interface SpriteDef {
  rows: readonly string[];
  pal: readonly number[];
  /** anchor: the pixel that sits on the entity's feet/base */
  ax: number;
  ay: number;
}

const HERO_PAL = [hex("#070d09"), hex("#2b4630"), hex("#40653c"), hex("#6d9a56"), hex("#43291a"), hex("#ffcf6a")];

export const HERO_IDLE: SpriteDef = {
  rows: [
    "....0000....",
    "...011110...",
    "..01122110..",
    "..01244210..",
    "..01244210..",
    "...011110...",
    "..01111110..",
    ".0112223110.",
    "011122233115",
    ".0112222110.",
    "..01111110..",
    "..01100110..",
    "..01....10..",
    ".00......00.",
    "..0......0..",
  ],
  pal: HERO_PAL,
  ax: 6,
  ay: 15,
};

/** The same walker mid-step: the cloak lifts and the feet cross. */
export const HERO_STEP: SpriteDef = {
  rows: [
    "....0000....",
    "...011110...",
    "..01122110..",
    "..01244210..",
    "..01244210..",
    "...011110...",
    "..01111110..",
    ".0112223110.",
    "011122233115",
    ".0112222110.",
    "..01111110..",
    "..0110110...",
    ".001..1100..",
    ".00....00...",
    "..0.....0...",
  ],
  pal: HERO_PAL,
  ax: 6,
  ay: 15,
};

const SLUG_PAL = [hex("#050b07"), hex("#24492a"), hex("#3b713a"), hex("#8cbb57"), hex("#ffd269")];

export const SLUG: SpriteDef = {
  rows: [
    "....0000..",
    "..0011110.",
    ".011222310",
    "0112223310",
    "0122222110",
    ".01111110.",
    "..000000..",
  ],
  pal: SLUG_PAL,
  ax: 5,
  ay: 7,
};

/** The slug squashes down before it lunges: same silhouette, half the height. */
export const SLUG_WINDUP: SpriteDef = {
  rows: ["..........", "..........", ".00000000.", "0112223310", "0122222110", ".01111110."],
  pal: SLUG_PAL,
  ax: 5,
  ay: 6,
};

const BEETLE_PAL = [hex("#050806"), hex("#4a3521"), hex("#7d562c"), hex("#b07c3a"), hex("#ffb03a"), hex("#e14b3a")];

export const BEETLE: SpriteDef = {
  rows: [
    "..0....0....",
    ".000..000...",
    ".011111110..",
    "01122232110.",
    "01223333210.",
    "01122222110.",
    ".011111110..",
    "..0.0.0.0...",
  ],
  pal: BEETLE_PAL,
  ax: 6,
  ay: 8,
};

export const BEETLE_WINDUP: SpriteDef = {
  rows: [
    "..0....0....",
    ".000..000...",
    ".011111110..",
    "01122232110.",
    "01223333210.",
    "01122222110.",
    ".001111100..",
    "..0.....0...",
  ],
  pal: BEETLE_PAL,
  ax: 6,
  ay: 8,
};

const FIREFLY_PAL = [hex("#5a3a10"), hex("#ffd269"), hex("#fff2b8"), hex("#ffffff")];

export const FIREFLY: SpriteDef = {
  rows: ["..0..", ".020.", "02320", ".020.", "..0.."],
  pal: FIREFLY_PAL,
  ax: 2,
  ay: 3,
};

const AMBER_PAL = [hex("#4a2a0c"), hex("#c97f26"), hex("#eda93c"), hex("#fff2b8")];

export const AMBER: SpriteDef = {
  rows: ["..0..", ".030.", "03230", ".030.", "..0.."],
  pal: AMBER_PAL,
  ax: 2,
  ay: 3,
};

/** Palette ramps the game hands to effects, so fire, moss and shadow stay in one family. */
export const RAMPS = {
  fire: ramp(PAL.ember),
  amber: ramp(PAL.amber),
  moss: ramp(PAL.leaf),
  bark: ramp(PAL.bark),
  shadow: ramp(PAL.shadow),
  blood: ramp(PAL.blood),
  night: ramp(PAL.night),
  moon: ramp(PAL.moon),
};

export const paletteOf = (p: Palette): number[] => p.map((c) => hex(c));
