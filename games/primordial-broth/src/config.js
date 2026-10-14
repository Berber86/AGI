// config.js — central tuning for «Первичный бульон» (primordial broth).
// All values are world units (≈ pixels at zoom 1) and seconds.

export const GAME = {
  title: 'Первичный бульон',
  storagePrefix: 'pb_v1_',
};

export const WORLD = {
  w: 6600,
  h: 3400,
  shoreStart: 5620,   // from here on the water is a bright sandy shoal
  shoreEnd: 6600,
  // sediment knolls keep the floor interesting
  floor: 3400,
};

// Growth stages 1..8 — body radius, speed factor and health.
export const STAGES = 8;
export const SIZE_BY_STAGE = [30, 38, 48, 61, 77, 96, 121, 152];
export const BIOMASS_TO_STAGE = [0, 6, 15, 30, 52, 82, 122, 174];

export const TUNING = {
  accel: 900,            // px/s² while thrusting
  drag: 2.35,            // velocity damping per second
  turnRate: 3.4,         // rad/s heading slew at full control
  maxSpeed: 250,         // base cruise speed
  boostSpeed: 430,
  boostDrain: 0.42,      // stamina per second while boosting
  boostRegen: 0.22,
  boostMin: 0.18,        // minimum stamina to start a dash
  cameraLerp: 3.4,
  cameraLookAhead: 0.24, // seconds of velocity the camera leads by
  genTargetStages: [3, 6, 8],   // growth stage that ends generations 1..3
  genTimeSoftS: 150,            // shown as a soft target, never a hard loss
  healthBase: 54,
  healthPerStage: 17,
  regenPerS: 0.85,
  softDefeatKeepBiomass: 0.72,  // biomass kept after a soft defeat
  softDefeatInvulnS: 2.4,
  biteRange: 0.62,
  eatSizeRatio: 1.14,           // attacker radius / victim radius needed to swallow
  fightSizeRatio: 0.86,         // below this the two creatures just bounce
  shoreBonusTime: 0,
};

// The seven part types promised in the approved contract.
export const PARTS = {
  flagellum: {
    name: 'Жгутик', icon: '〜', color: '#ffd166',
    blurb: '+32% к скорости плавания и мощный рывок.',
    speed: 0.32, turn: -0.06,
  },
  cilia: {
    name: 'Реснички', icon: '≡', color: '#8fd8ff',
    blurb: '+35% к поворотливости и мягкое ускорение.',
    speed: 0.1, turn: 0.35,
  },
  spike: {
    name: 'Шипы', icon: '☀', color: '#ff9f6a',
    blurb: 'Острые шипы: укусивший получает урон и отлетает.',
    melee: 7, retaliate: 9,
  },
  stinger: {
    name: 'Жало', icon: '↟', color: '#ff6ab2',
    blurb: 'Тарановый удар: наносит урон и разворачивает врага.',
    melee: 6, charge: 12,
  },
  venom: {
    name: 'Яд', icon: '☁', color: '#b687ff',
    blurb: 'Ядовитое облако: укусивший теряет здоровье ещё 3 секунды.',
    venom: 5.5,
  },
  electric: {
    name: 'Электричество', icon: '⚡', color: '#9ff0ff',
    blurb: 'Разряд оглушает всё живое вокруг раз в 4 секунды.',
    shock: 1,
  },
  jaw: {
    name: 'Челюсть', icon: '◣', color: '#ff8f5f',
    blurb: 'Дробит панцири и обломки: ест более крупную добычу.',
    melee: 10, eatBonus: 0.16, debris: 1,
  },
};
export const PART_ORDER = ['flagellum', 'cilia', 'spike', 'stinger', 'venom', 'electric', 'jaw'];

// Fauna palette — striped orange/white like the reference, plus teal and lilac variants.
export const PALETTES = [
  { body: '#ff9a4d', belly: '#fff0d8', stripe: '#a8402a', fin: '#ffd9a8' },
  { body: '#ffb066', belly: '#fff6e6', stripe: '#b24c33', fin: '#ffe2bd' },
  { body: '#6fd3d8', belly: '#e8ffff', stripe: '#1f6f80', fin: '#bff2f5' },
  { body: '#c59cf0', belly: '#f7ecff', stripe: '#6a3f9e', fin: '#e2cdfa' },
  { body: '#8ce07a', belly: '#f0ffe8', stripe: '#3d7a33', fin: '#d0f7c4' },
];
