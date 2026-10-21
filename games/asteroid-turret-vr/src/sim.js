// Pure deterministic core simulation for Asteroid Turret VR.
// No DOM / three.js here: unit-tested with node --test (tests/sim.test.js).

export const DWELL_SECONDS = 1.5;
export const DWELL_DECAY_PER_SEC = 1.2; // progress points per second while not gazed
export const SPAWN_YAW_DEG = 45;        // spawn sector: 90 deg horizontal
export const SPAWN_PITCH_MIN_DEG = -30; // spawn sector: 60 deg vertical
export const SPAWN_PITCH_MAX_DEG = 30;
export const ESCALATION_SECONDS = 480;  // calm-long: caps at ~8 minutes
export const HULL_MAX = 100;
export const ASTEROID_DAMAGE = 15;
export const ASTEROID_HP = 1;
export const SPAWN_DISTANCE = 42;
export const HIT_DISTANCE = 2.2;
export const MAX_ALIVE = 14;

export function mulberry32(seed) {
  let a = seed >>> 0;
  return function rand() {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const lerp = (a, b, t) => a + (b - a) * t;

/** Difficulty 0..1, monotonic, capped at ESCALATION_SECONDS. */
/** Score for the n-th consecutive kill (1-based streak after this kill). */
export function killScore(streak) { return 100 + Math.min(10, Math.max(0, streak - 1)) * 10; }

export function difficultyAt(elapsedSec) {
  return Math.min(1, Math.max(0, elapsedSec / ESCALATION_SECONDS));
}
export function spawnIntervalAt(elapsedSec) {
  return lerp(2.2, 0.75, difficultyAt(elapsedSec));
}
export function asteroidSpeedAt(elapsedSec, rand) {
  // One asteroid type; only speed varies (contract: one-type).
  return lerp(3.2, 7.5, difficultyAt(elapsedSec)) * (0.85 + rand * 0.3);
}

export function createGame(seed = 1) {
  return {
    seed,
    status: 'playing', // playing | lost
    elapsed: 0,
    score: 0,
    shots: 0,
    kills: 0,
    streak: 0,      // consecutive kills without taking hull damage
    bestStreak: 0,
    hull: HULL_MAX,
    asteroids: [],
    nextId: 1,
    spawnTimer: 0.4,
    gazeTargetId: null,
  };
}

/** Direction (unit, game space: -Z forward, +X right, +Y up) for yaw/pitch degrees. */
export function dirFromYawPitch(yawDeg, pitchDeg) {
  const yaw = (yawDeg * Math.PI) / 180;
  const pitch = (pitchDeg * Math.PI) / 180;
  return {
    x: Math.sin(yaw) * Math.cos(pitch),
    y: Math.sin(pitch),
    z: -Math.cos(yaw) * Math.cos(pitch),
  };
}

function asteroidPos(a) {
  const d = dirFromYawPitch(a.yawDeg, a.pitchDeg);
  return { x: d.x * a.dist, y: d.y * a.dist, z: d.z * a.dist };
}
export { asteroidPos };

/** Angular separation in degrees between the gaze direction and an asteroid. */
export function angularSeparationDeg(gaze, a) {
  const g = dirFromYawPitch(gaze.yawDeg, gaze.pitchDeg);
  const d = dirFromYawPitch(a.yawDeg, a.pitchDeg);
  const dot = Math.min(1, Math.max(-1, g.x * d.x + g.y * d.y + g.z * d.z));
  return (Math.acos(dot) * 180) / Math.PI;
}

/** Gaze hit tolerance: asteroid angular radius plus a small grace angle. */
export function gazeToleranceDeg(a) {
  const angularRadius = (Math.atan2(a.radius, Math.max(1, a.dist)) * 180) / Math.PI;
  return angularRadius + 1.5;
}

/**
 * Advance the simulation. `gaze` = { yawDeg, pitchDeg } (turret/look direction).
 * Returns a NEW state plus events; the input state is never mutated.
 * Events: {type:'spawn'|'shot'|'explosion'|'hullHit'|'lost', ...}
 */
export function stepGame(state, dt, gaze, rand) {
  const s = {
    ...state,
    asteroids: state.asteroids.map((a) => ({ ...a })),
  };
  const events = [];
  if (s.status !== 'playing' || dt <= 0) return { state: s, events };
  const rng = rand || mulberry32((s.seed ^ Math.floor(s.elapsed * 1000) ^ s.nextId) >>> 0);

  s.elapsed += dt;

  // --- spawn (only inside the 90x60 degree sector, moderately paced) ---
  s.spawnTimer -= dt;
  if (s.spawnTimer <= 0 && s.asteroids.length < MAX_ALIVE) {
    const yawDeg = (rng() * 2 - 1) * SPAWN_YAW_DEG;
    const pitchDeg = SPAWN_PITCH_MIN_DEG + rng() * (SPAWN_PITCH_MAX_DEG - SPAWN_PITCH_MIN_DEG);
    const a = {
      id: s.nextId++,
      yawDeg, pitchDeg,
      dist: SPAWN_DISTANCE,
      speed: asteroidSpeedAt(s.elapsed, rng()),
      radius: 1.6,
      hp: ASTEROID_HP,
      dwell: 0,
      spin: rng() * Math.PI * 2,
    };
    s.asteroids.push(a);
    events.push({ type: 'spawn', id: a.id, yawDeg, pitchDeg });
    s.spawnTimer = spawnIntervalAt(s.elapsed) * (0.8 + rng() * 0.4);
  }

  // --- gaze target: nearest asteroid inside its gaze tolerance ---
  let target = null;
  let bestSep = Infinity;
  for (const a of s.asteroids) {
    const sep = angularSeparationDeg(gaze, a);
    if (sep <= gazeToleranceDeg(a) && sep < bestSep) { bestSep = sep; target = a; }
  }
  s.gazeTargetId = target ? target.id : null;

  // --- dwell / decay / movement / impacts ---
  const survivors = [];
  for (const a of s.asteroids) {
    if (target && a.id === target.id) a.dwell = Math.min(DWELL_SECONDS, a.dwell + dt);
    else a.dwell = Math.max(0, a.dwell - DWELL_DECAY_PER_SEC * dt);

    if (a.dwell >= DWELL_SECONDS) {
      a.hp -= 1;
      s.shots += 1;
      events.push({ type: 'shot', id: a.id });
      if (a.hp <= 0) {
        s.kills += 1;
        s.streak += 1;
        s.bestStreak = Math.max(s.bestStreak, s.streak);
        const gained = killScore(s.streak);
        s.score += gained;
        const pos = asteroidPos(a);
        events.push({ type: 'explosion', id: a.id, yawDeg: a.yawDeg, pitchDeg: a.pitchDeg, dist: a.dist, x: pos.x, y: pos.y, z: pos.z, streak: s.streak, gained });
        continue; // destroyed
      }
      a.dwell = 0;
    }

    a.dist -= a.speed * dt;
    a.spin += dt * 0.7;
    if (a.dist <= HIT_DISTANCE) {
      s.hull = Math.max(0, s.hull - ASTEROID_DAMAGE);
      s.streak = 0; // taking damage breaks the kill streak
      const pos = asteroidPos(a);
      events.push({ type: 'hullHit', id: a.id, hull: s.hull, x: pos.x, y: pos.y, z: pos.z });
      if (s.hull <= 0) {
        s.status = 'lost';
        events.push({ type: 'lost', score: s.score });
      }
      continue; // crashed into the ship
    }
    survivors.push(a);
  }
  s.asteroids = survivors;
  return { state: s, events };
}
