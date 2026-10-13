import { describe, expect, it } from 'vitest';
import { CFG } from '../src/sim/config';
import { createRace, expectedCleanSeconds, speedKmh, stepRace, type RaceEvent, type RaceState } from '../src/sim/race';
import { createTrack, curveAt } from '../src/sim/track';

const DT = 1000 / 60;

interface RunResult {
  state: RaceState;
  events: RaceEvent[];
  steps: number;
  drivingMs: number;
}

/** Drives a full race headlessly with a scripted steering function. */
function drive(
  seed: number,
  steerAt: (state: RaceState, ms: number) => number,
  maxSeconds = 150,
  boostAt?: (state: RaceState, ms: number) => boolean,
): RunResult {
  let state = createRace(seed, 'candy');
  const events: RaceEvent[] = [];
  let steps = 0;
  const limit = Math.round((maxSeconds * 1000) / DT);
  while (state.status !== 'finished' && steps < limit) {
    const result = stepRace(state, DT, {
      steer: steerAt(state, state.elapsedMs),
      boost: boostAt ? boostAt(state, state.elapsedMs) : false,
    });
    state = result.state;
    events.push(...result.events);
    steps += 1;
  }
  return { state, events, steps, drivingMs: state.elapsedMs };
}

describe('deterministic race simulation', () => {
  it('creates a reproducible world from a seed', () => {
    const a = createRace(42, 'candy');
    const b = createRace(42, 'candy');
    expect(a).toEqual(b);
    expect(a.status).toBe('countdown');
    expect(a.progress).toBe(0);
    expect(a.lateral).toBe(1);
    expect(a.rivals).toHaveLength(3);
    expect(a.balloons.length).toBeGreaterThan(5);
    expect(a.obstacles.length).toBeGreaterThan(5);
    expect(createRace(43, 'candy').balloons).not.toEqual(a.balloons);
  });

  it('counts down 3-2-1 and only then goes', () => {
    let state = createRace(7, 'candy');
    const events: RaceEvent[] = [];
    for (let i = 0; i < 60 * 5; i += 1) {
      const result = stepRace(state, DT, { steer: 0 });
      state = result.state;
      events.push(...result.events);
    }
    const counts = events.filter((event) => event.type === 'count').map((event) => (event as { n: number }).n);
    expect(counts).toEqual([3, 2, 1]);
    expect(events.filter((event) => event.type === 'go')).toHaveLength(1);
    expect(state.status).toBe('racing');
  });

  it('finishes a clean straight run in 40-60 seconds with all three overtakes', () => {
    const run = drive(11, () => 0);
    expect(run.state.status).toBe('finished');
    expect(run.drivingMs).toBeGreaterThan(40_000);
    expect(run.drivingMs).toBeLessThan(60_000);
    expect(run.state.progress).toBe(CFG.raceLength);
    expect(run.events.filter((event) => event.type === 'finish')).toHaveLength(1);
    expect(run.state.overtakes).toBe(3);
    expect(run.state.onGrass).toBe(false);
    expect(run.state.balloonsTaken).toBeGreaterThan(0);
    // The total experience, including the traffic-light countdown, stays under a minute.
    const total = run.drivingMs + CFG.countdownMs;
    expect(total).toBeGreaterThan(40_000);
    expect(total).toBeLessThan(60_000);
    expect(Math.round(expectedCleanSeconds())).toBeGreaterThan(40);
  });

  it('never lets the car leave the drivable band', () => {
    const right = drive(3, () => 1);
    expect(right.state.lateral).toBeLessThanOrEqual(CFG.laneMax + 1e-9);
    expect(right.state.onGrass).toBe(true);

    const left = drive(3, (state) => (state.progress < 600 ? -1 : 0));
    expect(left.state.lateral).toBeGreaterThanOrEqual(CFG.laneMin - 1e-9);
  });

  it('slows down on the grass, warns once, and speeds up again when steering back', () => {
    let state = createRace(5, 'candy');
    const events: RaceEvent[] = [];
    let grassMs = 0;
    let roadAgain = false;
    for (let i = 0; i < 60 * 120 && state.status !== 'finished'; i += 1) {
      // Veer right onto the shoulder, stay there for a while, then steer back to the road.
      const steer = state.progress < 900 ? 1 : state.onGrass ? (state.lateral > 1 ? -1 : 1) : 0;
      const result = stepRace(state, DT, { steer });
      state = result.state;
      events.push(...result.events);
      if (state.onGrass) {
        grassMs += DT;
        expect(state.speed).toBeLessThanOrEqual(CFG.baseSpeed);
      }
      if (grassMs > 500 && !state.onGrass) roadAgain = true;
    }
    expect(grassMs).toBeGreaterThan(500);
    expect(events.filter((event) => event.type === 'grass')).toHaveLength(1);
    expect(events.filter((event) => event.type === 'road')).toHaveLength(1);
    expect(roadAgain).toBe(true);
    expect(state.status).toBe('finished');
    expect(state.speed).toBeCloseTo(CFG.baseSpeed, 0);
  });

  it('collects every balloon only once', () => {
    let state = createRace(21, 'candy');
    state.countdownMs = 0;
    state.status = 'racing';
    const target = state.balloons[2];
    state.lateral = target.lateral;
    const events: RaceEvent[] = [];
    for (let i = 0; i < 60 * 60 && state.status !== 'finished'; i += 1) {
      state.lateral = target.lateral;
      const result = stepRace(state, DT, { steer: 0 });
      state = result.state;
      events.push(...result.events);
    }
    const balloonEvents = events.filter((event) => event.type === 'balloon');
    const ids = balloonEvents.map((event) => (event as { id: number }).id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(state.balloons.filter((balloon) => balloon.taken).length).toBe(state.balloonsTaken);
    expect(state.balloonsTaken).toBeGreaterThanOrEqual(1);
  });

  it('treats puddles and bumps as fun, never as punishment', () => {
    let state = createRace(33, 'candy');
    state.countdownMs = 0;
    state.status = 'racing';
    const events: RaceEvent[] = [];
    const obstacleLane = state.obstacles[1].lateral;
    for (let i = 0; i < 60 * 90 && state.status !== 'finished'; i += 1) {
      state.lateral = obstacleLane;
      const result = stepRace(state, DT, { steer: 0 });
      state = result.state;
      events.push(...result.events);
      expect(Number.isFinite(state.lateral)).toBe(true);
      expect(state.speed).toBeGreaterThan(0);
    }
    const splash = events.filter((event) => event.type === 'splash').length;
    const hop = events.filter((event) => event.type === 'hop').length;
    expect(splash + hop).toBeGreaterThan(0);
    expect(state.status).toBe('finished');
    expect(state.progress).toBe(CFG.raceLength);
  });

  it('returns a new state and never mutates its input', () => {
    const state = createRace(8, 'candy');
    const snapshot = structuredClone(state);
    const result = stepRace(state, DT, { steer: 1 });
    expect(state).toEqual(snapshot);
    expect(result.state).not.toBe(state);
    expect(result.state.rivals[0]).not.toBe(state.rivals[0]);
  });

  it('freezes a finished race and ignores further input', () => {
    let state = createRace(15, 'candy');
    state.countdownMs = 0;
    state.status = 'racing';
    state.speed = CFG.baseSpeed;
    state.progress = CFG.raceLength - 1;
    const first = stepRace(state, DT, { steer: 0 });
    state = first.state;
    expect(state.status).toBe('finished');
    const finishEvents = first.events.filter((event) => event.type === 'finish');
    expect(finishEvents).toHaveLength(1);
    const after = stepRace(state, DT, { steer: -1 });
    expect(after.state).toEqual(state);
    expect(after.events).toHaveLength(0);
    expect(state.finishMs).toBeGreaterThan(0);
  });

  it('always reaches the finish line, whatever the child does', () => {
    for (let seed = 1; seed <= 24; seed += 1) {
      const run = drive(seed, (_state, ms) => Math.sin(ms / 900 + seed) * (seed % 3 === 0 ? 1 : 0.4));
      expect(run.state.status, `seed ${seed} must finish`).toBe('finished');
      expect(Number.isFinite(run.state.lateral)).toBe(true);
      expect(Number.isFinite(run.state.speed)).toBe(true);
      expect(run.state.overtakes).toBeLessThanOrEqual(3);
      expect(run.state.bumpSlowMs).toBe(0);
      expect(run.drivingMs).toBeLessThan(90_000);
    }
  });

  it('replays identically from the same seed', () => {
    const first = drive(99, (_state, ms) => Math.sin(ms / 700));
    const second = drive(99, (_state, ms) => Math.sin(ms / 700));
    expect(second.state).toEqual(first.state);
    expect(second.events).toEqual(first.events);
  });
});

describe('candy loop track', () => {
  it('builds a closed track whose curvature balances over one lap', () => {
    const track = createTrack(1234);
    expect(track.curve).toHaveLength(CFG.segmentsPerLap);
    const total = track.curve.reduce((sum, value) => sum + value, 0);
    expect(Math.abs(total)).toBeLessThan(1e-6);
    expect(track.curve.some((value) => value > 0.5)).toBe(true);
    expect(track.curve.some((value) => value < -0.5)).toBe(true);
    expect(track.lapWorldLength).toBe(CFG.lapLength * CFG.worldPerSim);
    // The mini-map path stays inside the normalised 0..1 box and loops.
    for (const point of track.mapPath) {
      expect(point.x).toBeGreaterThanOrEqual(0);
      expect(point.x).toBeLessThanOrEqual(1);
      expect(point.y).toBeGreaterThanOrEqual(0);
      expect(point.y).toBeLessThanOrEqual(1);
    }
    const first = track.mapPath[0];
    const last = track.mapPath[track.mapPath.length - 1];
    expect(first.x).toBeCloseTo(last.x, 9);
    expect(first.y).toBeCloseTo(last.y, 9);
  });

  it('varies the circuit with the seed but stays finite everywhere', () => {
    const a = createTrack(11);
    const b = createTrack(22);
    expect(a.curve).not.toEqual(b.curve);
    for (let i = 0; i < 40; i += 1) {
      const value = curveAt(a, i * 90);
      expect(Number.isFinite(value)).toBe(true);
    }
  });

  it('wraps the lap length into three laps of the same total distance', () => {
    expect(CFG.lapLength * CFG.lapCount).toBe(CFG.raceLength);
    expect(CFG.lapLength * CFG.worldPerSim).toBe(createTrack(1).lapWorldLength);
  });
});

describe('three-lap race and cupcake boost', () => {
  it('reports lap events at each third of the race', () => {
    const run = drive(11, () => 0);
    const laps = run.events.filter((event) => event.type === 'lap').map((event) => (event as { lap: number }).lap);
    expect(laps).toEqual([2, 3]);
    expect(run.state.lap).toBe(CFG.lapCount);
  });

  it('charges the cupcake meter with balloons and spends it on a boost', () => {
    let state = createRace(21, 'candy');
    state.countdownMs = 0;
    state.status = 'racing';
    const events: RaceEvent[] = [];
    let boosted = false;
    for (let i = 0; i < 60 * 90 && state.status !== 'finished'; i += 1) {
      // Ride the centre line so balloons along the road are collected.
      const next = state.balloons.find((balloon) => !balloon.taken && balloon.progress > state.progress);
      const steer = next ? Math.sign(next.lateral - state.lateral) : 0;
      const result = stepRace(state, DT, { steer, boost: state.boostCharges >= CFG.boostChargeMax && !boosted });
      state = result.state;
      events.push(...result.events);
      if (events.some((event) => event.type === 'boost')) boosted = true;
      expect(state.boostCharges).toBeLessThanOrEqual(CFG.boostChargeMax);
    }
    expect(events.filter((event) => event.type === 'charge').length).toBeGreaterThanOrEqual(CFG.boostChargeMax);
    expect(boosted).toBe(true);
    expect(state.boostsUsed).toBeGreaterThanOrEqual(1);
    expect(state.status).toBe('finished');
  });

  it('never boosts without a full meter and never loses the boost charge twice', () => {
    let state = createRace(5, 'candy');
    state.countdownMs = 0;
    state.status = 'racing';
    let peak = 0;
    for (let i = 0; i < 60 * 60 && state.status !== 'finished'; i += 1) {
      const result = stepRace(state, DT, { steer: 0, boost: true });
      state = result.state;
      peak = Math.max(peak, state.boostMs);
      expect(state.boostCharges).toBeGreaterThanOrEqual(0);
      expect(state.boostCharges).toBeLessThanOrEqual(CFG.boostChargeMax);
    }
    // The meter starts empty, so an eager child cannot fire the cupcake instantly.
    expect(peak).toBeLessThanOrEqual(CFG.boostMs);
    expect(state.boostsUsed).toBeLessThanOrEqual(9);
  });

  it('makes a boost run faster than a clean run and still within a minute', () => {
    const plain = drive(4321, () => 0);
    const boosted = drive(4321, () => 0, 150, (state) => state.boostCharges >= CFG.boostChargeMax);
    expect(plain.drivingMs).toBeGreaterThan(40_000);
    expect(plain.drivingMs).toBeLessThan(60_000);
    expect(boosted.drivingMs).toBeLessThan(plain.drivingMs);
    expect(boosted.drivingMs).toBeGreaterThan(30_000);
    expect(speedKmh(CFG.baseSpeed)).toBeGreaterThan(90);
  });
});
