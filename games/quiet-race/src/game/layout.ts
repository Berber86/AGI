/** Shared screen geometry for the render layer (logical units, 1600x800 canvas). */
export const VIEW = { w: 1600, h: 800 } as const;

export const UI = {
  buttonSize: 300,
  hudSize: 96,
  fontSize: { big: 120, mid: 56, small: 40, tiny: 26 },
  fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
} as const;

export const COLORS = {
  sky: 0xbfe6ff,
  sun: 0xffe28a,
  grassLight: 0xa9dd8a,
  grassDark: 0x8fce74,
  ink: 0x5a4632,
  card: 0xfff7e8,
} as const;
