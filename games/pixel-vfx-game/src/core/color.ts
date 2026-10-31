// Colors are 32-bit integers laid out like ImageData bytes (R, G, B, A in memory), so a color buffer can
// be shown with new ImageData(new Uint8ClampedArray(buf.buffer), w, h).
//
// Ramps are dark-to-bright and hue-shifted: shadows lean cool or deep, highlights lean warm or white.
// Pixel art picks a color, it does not fade between two: use `at`.

export const rgb = (r: number, g: number, b: number): number =>
  ((255 << 24) | ((b & 255) << 16) | ((g & 255) << 8) | (r & 255)) >>> 0;
export const red = (c: number): number => c & 255;
export const green = (c: number): number => (c >>> 8) & 255;
export const blue = (c: number): number => (c >>> 16) & 255;
export const alpha = (c: number): number => (c >>> 24) & 255;

/** "#rgb" or "#rrggbb" (or a color number, passed through) to a color number. */
export function hex(h: string | number): number {
  if (typeof h === "number") return h >>> 0;
  let s = h.replace("#", "").trim();
  if (s.length === 3) s = s[0] + s[0] + s[1] + s[1] + s[2] + s[2];
  const v = parseInt(s.slice(0, 6), 16);
  return rgb((v >> 16) & 255, (v >> 8) & 255, v & 255);
}

export const toHex = (c: number): string =>
  "#" + [red(c), green(c), blue(c)].map((v) => v.toString(16).padStart(2, "0")).join("");

export const mix = (a: number, b: number, t: number): number => {
  const k = t < 0 ? 0 : t > 1 ? 1 : t;
  return rgb(
    red(a) + (red(b) - red(a)) * k,
    green(a) + (green(b) - green(a)) * k,
    blue(a) + (blue(b) - blue(a)) * k,
  );
};

export const scaleCol = (c: number, k: number): number =>
  rgb(Math.min(255, red(c) * k), Math.min(255, green(c) * k), Math.min(255, blue(c) * k));

export const luma = (c: number): number => (0.299 * red(c) + 0.587 * green(c) + 0.114 * blue(c)) / 255;

export const ramp = (list: readonly string[]): number[] => list.map(hex);

/** Resample a ramp to exactly n steps, keeping both ends. Lets code index steps by number. */
export function fit(r: readonly (string | number)[], n: number): number[] {
  const src = r.map(hex);
  if (src.length === n) return src;
  return Array.from({ length: n }, (_, i) => src[Math.round((i * (src.length - 1)) / Math.max(1, n - 1))]);
}

/** The ramp step for t in 0..1, no blending. */
export const at = (r: readonly number[], t: number): number =>
  r[Math.min(r.length - 1, Math.max(0, Math.floor(t * r.length)))];

export const WHITE = hex("#ffffff");
export const BLACK = hex("#000000");

/** Forest night ramps. Every effect takes a palette, so the same code can burn blue or bloom pink. */
export const PAL = {
  /** mossy greens, for the canopy floor */
  forest: ["#0a1410", "#14251a", "#1d3a24", "#2a5230", "#3d6f3a", "#5b9147", "#86b45c", "#bfd883"],
  /** fresh leaf, a bit brighter */
  leaf: ["#0d1a10", "#1b3220", "#2b522c", "#3f753a", "#5f9b4a", "#86bd63", "#b3d98a", "#e0f0b4"],
  /** warm amber: the finds, the fire's friendly side */
  amber: ["#231407", "#3f2410", "#6b3d15", "#9c5c1c", "#c97f26", "#eda93c", "#ffd269", "#fff2b8"],
  /** the fire itself, white-hot to smouldering */
  ember: ["#1f0b10", "#4a1118", "#8c1d1c", "#cc3a1a", "#f2701f", "#ffae35", "#ffe27a", "#fff8d6"],
  /** dead wood, bark and stones */
  bark: ["#0d0d10", "#1a191c", "#2a282a", "#3d3a38", "#55514a", "#726c60", "#948c7c", "#c0b6a2"],
  /** night sky beyond the light */
  night: ["#05080a", "#080f10", "#0b1618", "#102023", "#162c2c", "#1e3b36"],
  /** shadow creatures: violet that reads against green */
  shadow: ["#0b0714", "#150f24", "#221a3a", "#332852", "#4a3b6e", "#65538d", "#8a76b0", "#b6a5d6"],
  /** damage and danger */
  blood: ["#1a0507", "#330a0f", "#5c1016", "#8a1a1f", "#bd2a2a", "#e14b3a", "#ff7a5c", "#ffb09a"],
  /** pale moonlight highlights */
  moon: ["#0c1017", "#161d27", "#232f3b", "#354656", "#4f6577", "#7690a1", "#a8bfcb", "#e6f2f5"],
} as const;

export type Palette = readonly (string | number)[];
