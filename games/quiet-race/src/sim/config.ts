/** Deterministic tuning values for the whole race simulation and the 3D view. */
export const CFG = {
  // ---- simulation (same core rules as the approved contract) ----
  laneCount: 3,
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

  // ---- laps: the same 3600-unit race, shown as three candy laps ----
  lapCount: 3,
  lapLength: 1200,

  // ---- cupcake boost ----
  boostChargeMax: 4,
  boostMs: 2600,
  boostSpeedFactor: 1.32,

  // ---- chase-camera 3D view ----
  /** World units per simulation unit (the view scale is decorative, the sim stays authoritative). */
  worldPerSim: 25,
  segmentLength: 200,
  segmentsPerLap: 150,
  roadHalfWidth: 1150,
  cameraHeight: 1000,
  /** Focal length in pixels: 348 px at 1600x800 gives the wide arcade look of the reference shot. */
  focalPx: 348,
  horizonY: 285,
  drawSegments: 96,
  /** The camera follows the car sideways only partially, so the child sees the car move on the road. */
  cameraFollow: 0.55,
  carWorldWidth: 1150,
  rivalWorldWidth: 950,
  wallHeight: 120,
  wallInset: 250,
  kerbWidth: 150,
  /** Screen y where the road passes under the hero car. */
  carBaseY: 726,
  curveScale: 55,
} as const;

export const LANE_WORLD_WIDTH = ((CFG.roadHalfWidth * 2) / CFG.laneCount) as number;
export const PLAYER_Z = (CFG.cameraHeight * CFG.focalPx) / (CFG.carBaseY - CFG.horizonY);

export const THEMES = ['candy', 'mint', 'choco'] as const;
export type Theme = (typeof THEMES)[number];

export interface ThemePalette {
  /** Track name shown on the HUD plate. */
  name: string;
  skyTop: number;
  skyMid: number;
  skyHorizon: number;
  ground: number;
  groundAlt: number;
  road: number;
  roadAlt: number;
  wall: number[];
  mountain: number;
  castleWall: number;
  castleRoof: number;
}

export const PALETTES: Record<Theme, ThemePalette> = {
  candy: {
    name: 'Леденцовый замок',
    skyTop: 0x58b4f0,
    skyMid: 0x9dd6ff,
    skyHorizon: 0xffe1f0,
    ground: 0xbfe9a8,
    groundAlt: 0xa8dd93,
    road: 0x9a93a8,
    roadAlt: 0x8d8798,
    wall: [0xffb3d1, 0xffe0a3, 0xb8e8ff, 0xd9f5b0, 0xffc9e5, 0xc9d8ff],
    mountain: 0xd7a9e6,
    castleWall: 0xfff3fb,
    castleRoof: 0xf08fc6,
  },
  mint: {
    name: 'Мятная карусель',
    skyTop: 0x7fd3e8,
    skyMid: 0xbfeef7,
    skyHorizon: 0xe6fff4,
    ground: 0xb6ecc6,
    groundAlt: 0x9fdfb4,
    road: 0x939aa8,
    roadAlt: 0x868d9c,
    wall: [0xa8f0d8, 0xd6f7a8, 0xa8d8ff, 0xfff0b8, 0xc4f0ff, 0xe0c9ff],
    mountain: 0x9fd8d0,
    castleWall: 0xf7fffb,
    castleRoof: 0x63c7b0,
  },
  choco: {
    name: 'Шоколадный холм',
    skyTop: 0xf7a86b,
    skyMid: 0xffd7a8,
    skyHorizon: 0xfff0d6,
    ground: 0xd8e79a,
    groundAlt: 0xc6d887,
    road: 0x8f8a94,
    roadAlt: 0x827d88,
    wall: [0xffd0a3, 0xd9a86b, 0xffe8c4, 0xf7b8c4, 0xc9a3ff, 0xfff0b8],
    mountain: 0xc98f6b,
    castleWall: 0xfff6ea,
    castleRoof: 0xd1663f,
  },
};

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
