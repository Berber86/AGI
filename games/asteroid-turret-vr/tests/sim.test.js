import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame, stepGame, spawnIntervalAt, asteroidSpeedAt, difficultyAt, killScore, DWELL_SECONDS, SPAWN_YAW_DEG, SPAWN_PITCH_MIN_DEG, SPAWN_PITCH_MAX_DEG } from '../src/sim.js';
import { mulberry32 } from '../src/sim.js';

function run(sec, gaze = { yawDeg: 0, pitchDeg: 0 }, seed = 5) {
  let s = createGame(seed); const rand = mulberry32(seed); const all = [];
  const steps = Math.round(sec / 0.05);
  for (let i = 0; i < steps; i++) { const r = stepGame(s, 0.05, gaze, rand); s = r.state; all.push(...r.events); }
  return { s, all };
}

test('spawn stays inside 90x60 sector', () => {
  const { all } = run(60);
  const spawns = all.filter((e) => e.type === 'spawn');
  assert.ok(spawns.length > 10);
  for (const e of spawns) { assert.ok(Math.abs(e.yawDeg) <= SPAWN_YAW_DEG + 1e-9); assert.ok(e.pitchDeg >= SPAWN_PITCH_MIN_DEG && e.pitchDeg <= SPAWN_PITCH_MAX_DEG); }
});

test('dwell 1.5s fires and destroys gazed asteroid', () => {
  let s = createGame(3); const rand = mulberry32(3);
  // spawn one directly ahead by stepping until spawn, then aim at it
  for (let i = 0; i < 200 && !s.asteroids.length; i++) s = stepGame(s, 0.05, { yawDeg: 0, pitchDeg: 0 }, rand).state;
  assert.ok(s.asteroids.length >= 1);
  const a = s.asteroids[0];
  const gaze = { yawDeg: a.yawDeg, pitchDeg: a.pitchDeg };
  const before = s.score;
  let events = [];
  const need = Math.ceil(DWELL_SECONDS / 0.05);
  for (let i = 0; i < need + 2; i++) { const r = stepGame(s, 0.05, gaze, rand); s = r.state; events.push(...r.events); }
  assert.ok(events.some((e) => e.type === 'shot'));
  assert.ok(events.some((e) => e.type === 'explosion'));
  assert.ok(s.score > before);
});

test('dwell decays instead of instant reset when gaze leaves', () => {
  let s = createGame(3); const rand = mulberry32(3);
  for (let i = 0; i < 200 && !s.asteroids.length; i++) s = stepGame(s, 0.05, { yawDeg: 0, pitchDeg: 0 }, rand).state;
  const a0 = s.asteroids[0]; const gaze = { yawDeg: a0.yawDeg, pitchDeg: a0.pitchDeg };
  for (let i = 0; i < 10; i++) s = stepGame(s, 0.05, gaze, rand).state; // 0.5 s dwell
  const mid = s.asteroids.find((x) => x.id === a0.id);
  assert.ok(mid && mid.dwell > 0.4);
  s = stepGame(s, 0.05, { yawDeg: gaze.yawDeg + 40, pitchDeg: gaze.pitchDeg }, rand).state;
  const after = s.asteroids.find((x) => x.id === a0.id);
  assert.ok(after, 'asteroid still alive');
  assert.ok(after.dwell > 0 && after.dwell < mid.dwell, `decay partial: ${mid.dwell} -> ${after.dwell}`);
});

test('impact damages hull and zero hull loses', () => {
  let s = createGame(9); const rand = mulberry32(9);
  for (let i = 0; i < 200 && !s.asteroids.length; i++) s = stepGame(s, 0.05, { yawDeg: 0, pitchDeg: 0 }, rand).state;
  s.asteroids[0].dist = 2.0; // force impact next step
  const r = stepGame(s, 0.05, { yawDeg: -40, pitchDeg: 25 }, rand); s = r.state; // look away so it is not shot
  assert.ok(r.events.some((e) => e.type === 'hullHit'));
  assert.equal(s.hull, 85);
  s.hull = 15; if (!s.asteroids.length) { const rr = run(5); s = rr.s; }
  if (s.asteroids.length) { s.asteroids[0].dist = 2.0; s = stepGame(s, 0.05, { yawDeg: -40, pitchDeg: 25 }, rand).state; }
  if (s.hull <= 0) assert.equal(s.status, 'lost');
});

test('escalation monotonic and capped at ~8 minutes', () => {
  assert.equal(difficultyAt(0), 0); assert.equal(difficultyAt(480), 1); assert.equal(difficultyAt(9999), 1);
  assert.ok(spawnIntervalAt(0) > spawnIntervalAt(240)); assert.ok(spawnIntervalAt(240) >= spawnIntervalAt(480));
  assert.equal(spawnIntervalAt(480), spawnIntervalAt(5000));
  assert.ok(asteroidSpeedAt(480, 0.5) > asteroidSpeedAt(0, 0.5));
});

test('step does not mutate input state', () => {
  const s = createGame(2); const frozen = JSON.stringify(s);
  stepGame(s, 0.05, { yawDeg: 0, pitchDeg: 0 }, mulberry32(2));
  assert.equal(JSON.stringify(s), frozen);
});

test('kill streak: bonus grows, hull hit resets streak', () => {
  assert.equal(killScore(1), 100); assert.equal(killScore(2), 110); assert.equal(killScore(30), 200);
  let s = createGame(4); const rand = mulberry32(4);
  for (let i = 0; i < 200 && !s.asteroids.length; i++) s = stepGame(s, 0.05, { yawDeg: 0, pitchDeg: 0 }, rand).state;
  const a = s.asteroids[0]; const gaze = { yawDeg: a.yawDeg, pitchDeg: a.pitchDeg };
  for (let i = 0; i < 34; i++) s = stepGame(s, 0.05, gaze, rand).state;
  assert.ok(s.kills >= 1 && s.streak >= 1 && s.score >= 100);
  const streakBefore = s.streak;
  assert.ok(streakBefore >= 1);
  // force an impact: put a fresh asteroid at hit distance and look away
  if (!s.asteroids.length) { for (let i = 0; i < 200 && !s.asteroids.length; i++) s = stepGame(s, 0.05, { yawDeg: 0, pitchDeg: 0 }, rand).state; }
  s.asteroids[0].dist = 2.0;
  s = stepGame(s, 0.05, { yawDeg: -44, pitchDeg: 28 }, rand).state;
  assert.equal(s.streak, 0);
});

test('explosion event carries world position for FX', () => {
  let s = createGame(6); const rand = mulberry32(6);
  for (let i = 0; i < 200 && !s.asteroids.length; i++) s = stepGame(s, 0.05, { yawDeg: 0, pitchDeg: 0 }, rand).state;
  const a = s.asteroids[0]; const gaze = { yawDeg: a.yawDeg, pitchDeg: a.pitchDeg };
  let evs = [];
  for (let i = 0; i < 40; i++) { const r = stepGame(s, 0.05, gaze, rand); s = r.state; evs.push(...r.events); }
  const ex = evs.find((e) => e.type === 'explosion');
  assert.ok(ex && Number.isFinite(ex.x) && Number.isFinite(ex.y) && Number.isFinite(ex.z));
});
