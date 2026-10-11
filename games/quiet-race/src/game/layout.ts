/** Shared screen geometry for the render layer (logical units, 1600x800 canvas). */
export const VIEW = { w: 1600, h: 800 } as const;

/** Road geometry mirrors the simulation lanes but in screen units. */
export const ROAD = {
  centerX: VIEW.w / 2,
  laneWidth: 220,
  get halfWidth() {
    return (3 * this.laneWidth) / 2;
  },
  shoulder: 46,
} as const;

/** Screen x of a continuous lane position (0 = left lane centre, 2 = right lane centre). */
export function laneX(lateral: number): number {
  return ROAD.centerX + (lateral - 1) * ROAD.laneWidth;
}

/** The hero car sits low on the screen so most of the road ahead stays visible. */
export const PLAYER_SCREEN_Y = 620;

/** Vertical screen position of something `progress` units ahead of the player. */
export function screenY(progress: number, playerProgress: number): number {
  return PLAYER_SCREEN_Y - (progress - playerProgress);
}

/** How far the world is visible around the player, in progress units. */
export const VISIBLE = { behind: 200, ahead: 660 } as const;

export const UI = {
  buttonSize: 300,
  hudSize: 96,
  fontSize: { big: 120, mid: 56, small: 34, tiny: 26 },
  fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
} as const;

export const COLORS = {
  sky: 0xbfe6ff,
  sun: 0xffe28a,
  grassLight: 0xa9dd8a,
  grassDark: 0x8fce74,
  asphalt: 0x9aa0ad,
  asphaltDark: 0x8a90a0,
  line: 0xfdf6e3,
  shadow: 0x3d2b1f,
  ink: 0x5a4632,
  card: 0xfff7e8,
  accent: 0x7ed957,
  accentDark: 0x4fae33,
} as const;
