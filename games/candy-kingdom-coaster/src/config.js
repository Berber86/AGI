// Candy Kingdom Coaster — central configuration.
// Medal thresholds are EXPLICIT and shown verbatim on the finish screen.

export const GAME = {
  title: 'Candy Kingdom Coaster',
  driverName: 'Lily',
  storagePrefix: 'ckc_v1_',
};

// --- Tuning (meters, m/s) ---
export const TUNING = {
  cruiseSpeed: 16.5,          // ~59 km/h
  maxSpeed: 21.5,             // ~77 km/h
  boostSpeed: 29.0,           // ~104 km/h
  accel: 6.0,
  brakeDrag: 3.0,
  steerSpeed: 6.2,            // lateral m/s at full input
  steerReturn: 1.6,           // gentle auto-center for little hands
  roadHalfWidth: 4.4,
  shoulderLimit: 6.4,         // |lateral| clamp before soft wall
  offRoadSlow: 0.55,          // speed multiplier on the grass
  camBack: 5.8,
  camUp: 2.55,
  camAhead: 14.5,
  camSide: 1.7,             // slight 3/4 offset: the car's livery stays visible
  camLerp: 5.2,
  collectRadius: 2.55,
  boostDuration: 3.4,
  boostCharges: 4,            // cupcake boost: 4/4 like the reference
  raceTimeLimitS: 240,        // finish is always reachable; this is only a soft target
};

// --- Jump ramps: one per lane, in different parts of the ride ---
// s = metres along the track where the ramp starts, side = -1 left / +1 right
// lane, len = run-up length, height = lip height above the road, width = ramp
// width (the other lane stays free so the jump is always a choice).
export const RAMPS = [
  { id: 'cookie-left',  s: 500,  side: -1, len: 10, height: 1.5, width: 4.0, color: '#ff5f9e', accent: '#fff6f0' },
  { id: 'cream-right',  s: 1225, side:  1, len: 12, height: 2.6, width: 4.0, color: '#8f6bff', accent: '#fff6f0' },
];
export const JUMP = {
  gravity: 9.5,    // m/s² — a little floaty, the jump should feel like a treat
  launchK: 2.0,    // vertical speed = speed · sin(ramp angle) · launchK
  boostK: 1.08,    // extra lift when launching with the rocket boost active
  airSteer: 0.35,  // steering authority while airborne
  bounce: 0.35,    // restitution when the car falls off a ramp side
  dropSlow: 0.85,  // speed kept after such a fall
};

// --- Milk river + arched bridge (cookie zone). The deck humps over the river
// (added to the spline in track.js), the shoulders dip into a valley around
// the crossing and bridge.js builds the arch, balustrade, river and sea.
export const BRIDGE = {
  s: 400,          // crossing (m along the track) — straight stretch before ramp A
  halfSpan: 24,    // deck hump half length (m)
  hump: 2.2,       // extra deck height at the crest (m)
  archHalf: 20,    // arch opening half span (m)
  riverHalf: 8,    // river half width at the crossing (m)
  valleyHalf: 26,  // shoulders are dipped to the river floor within ±valleyHalf (m along s)
  floorY: -3.3,    // valley floor / river bed height (world y; ground disc is -3.35)
  wallLat: 7.6,    // spandrel wall / deck edge lateral (m)
};

// --- Zones along the ride (u = 0..1 of track length) ---
export const ZONES = [
  { id: 0, name: 'Lollipop Meadows',  u0: 0.00, u1: 0.22, fog: 0x9fd8ff, sky: 0x7ec9f2 },
  { id: 1, name: 'Gummy Bear Grove',  u0: 0.22, u1: 0.46, fog: 0xffd9a8, sky: 0x86cdf2 },
  { id: 2, name: 'Cocoa Canyon',      u0: 0.46, u1: 0.68, fog: 0xffc9b0, sky: 0x8cc6ee },
  { id: 3, name: 'Marshmallow Valley',u0: 0.68, u1: 0.88, fog: 0xffd6ec, sky: 0x93c9f4 },
  { id: 4, name: 'Sugar Castle Run',  u0: 0.88, u1: 1.001, fog: 0xffd2e8, sky: 0x8fc9f2 },
];

// --- Medals: explicit counters over sweets collected in ONE ride ---
export const MEDALS = [
  { id: 'bronze', icon: '🍬', name: 'Sweet Tooth',    requirement: 'Собери ≥ 35% сладостей',   minFraction: 0.35 },
  { id: 'silver', icon: '⭐', name: 'Candy Star',     requirement: 'Собери ≥ 65% сладостей',   minFraction: 0.65 },
  { id: 'gold',   icon: '🏆', name: 'Unicorn Legend', requirement: 'Собери ≥ 92% сладостей',   minFraction: 0.92 },
];

// Bonus time medal (explicit threshold in seconds)
export const TIME_MEDAL = { id: 'speed', icon: '⏱️', name: 'Speed Racer', requirement: 'Финиш быстрее 105 секунд', maxSeconds: 105 };

export function zoneAt(u) {
  for (const z of ZONES) if (u >= z.u0 && u < z.u1) return z;
  return ZONES[ZONES.length - 1];
}

export function formatTime(t) {
  // compact m:ss — fewer digits for young players
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}
