import { describe, expect, it } from 'vitest';
import { CFG } from '../src/sim/config';
import { createRace, expectedCleanSeconds, stepRace, type RaceEvent, type RaceState } from '../src/sim/race';

const DT = 1000 / 60;

interface RunResult {
  state: RaceState;
  events: RaceEvent[];
  steps: number;
  drivingMs: number;
}

/** Drives a full race headlessly with a scripted steering function. */
function drive(seed: number, steerAt: (state: RaceState, ms: number) => number, maxSeconds = 150): RunResult {
  let state = createRace(seed, 'meadow');
  const events: RaceEvent[] = [];
  let steps = 0;
  const limit = Math.round((maxSeconds * 1000) / DT);
  while (state.status !== 'finished' && steps < limit) {
    const result = stepRace(state, DT, { steer: steerAt(state, state.elapsedMs) });
    state = result.state;
    events.push(...result.events);
    steps += 1;
  }
  return { state, events, steps, drivingMs: state.elapsedMs };
}

describe('deterministic race simulation', () => {
  it('creates a reproducible world from a seed', () => {
    const a = createRace(42, 'meadow');
    const b = createRace(42, 'meadow');
    expect(a).toEqual(b);
    expect(a.status).toBe('countdown');
    expect(a.progress).toBe(0);
    expect(a.lateral).toBe(1);
    expect(a.rivals).toHaveLength(3);
    expect(a.balloons.length).toBeGreaterThan(5);
    expect(a.obstacles.length).toBeGreaterThan(5);
    expect(createRace(43, 'meadow').balloons).not.toEqual(a.balloons);
  });

  it('counts down 3-2-1 and only then goes', () => {
    let state = createRace(7, 'meadow');
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
    let state = createRace(5, 'meadow');
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
    let state = createRace(21, 'meadow');
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
    let state = createRace(33, 'meadow');
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
    const state = createRace(8, 'meadow');
    const snapshot = structuredClone(state);
    const result = stepRace(state, DT, { steer: 1 });
    expect(state).toEqual(snapshot);
    expect(result.state).not.toBe(state);
    expect(result.state.rivals[0]).not.toBe(state.rivals[0]);
  });

  it('freezes a finished race and ignores further input', () => {
    let state = createRace(15, 'meadow');
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
