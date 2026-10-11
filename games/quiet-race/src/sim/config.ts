/** Deterministic tuning values for the whole race simulation. */
export const CFG = {
  laneCount: 3,
  laneWidth: 110,
  /** Half width of the asphalt in lane units (lane centers are 0, 1, 2). */
  roadHalfLanes: 1.32,
  /** How far onto the grass shoulder the car may drift. */
  laneMin: -0.62,
  laneMax: 2.62,

  baseSpeed: 84,
  grassSpeed: 60,
  speedAccel: 95,

  steerMax: 1.55,
  steerAccel: 8.5,
  steerReturn: 11,

  raceLength: 3600,
  carLength: 112,

  collectRadius: 0.62,

  countdownMs: 4200,
  countdownStepMs: 1000,

  rivalGaps: [110, 220, 330],
  rivalSpeedFactor: 0.84,

  bumpSlowFactor: 0.9,
  bumpSlowMs: 700,
  hopMs: 520,
} as const;

export const THEMES = ['meadow', 'river', 'city'] as const;
export type Theme = (typeof THEMES)[number];

export const CAR_COLORS = [
  { id: 'rose', body: 0xff9ec4, dark: 0xe06699, name: 'розовый' },
  { id: 'sky', body: 0x8fd0f5, dark: 0x4d9fd1, name: 'голубой' },
  { id: 'mint', body: 0x9fe3c0, dark: 0x5cb587, name: 'мятный' },
  { id: 'sun', body: 0xffd479, dark: 0xdda63c, name: 'жёлтый' },
] as const;

export const FLAGS = [
  { id: 'star', color: 0xffd166 },
  { id: 'heart', color: 0xff7fa8 },
  { id: 'flower', color: 0xb388ff },
] as const;

export const RIVAL_NAMES = ['Тимка', 'Соня', 'Барсик'] as const;
