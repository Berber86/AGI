import { CFG, RIVAL_NAMES, type Theme } from './config';
import { createRng } from './rng';

export interface SteeringInput {
  /** -1 = left, 0 = straight, 1 = right. */
  steer: number;
}

export interface Rival {
  id: number;
  name: string;
  lateral: number;
  targetLane: number;
  laneTimerMs: number;
  progress: number;
  baseSpeed: number;
  waveTimerMs: number;
  passedByPlayer: boolean;
}

export interface Balloon {
  id: number;
  progress: number;
  lateral: number;
  taken: boolean;
}

export type ObstacleKind = 'puddle' | 'bump';

export interface Obstacle {
  id: number;
  kind: ObstacleKind;
  progress: number;
  lateral: number;
  used: boolean;
}

export type RaceStatus = 'countdown' | 'racing' | 'finished';

export type RaceEvent =
  | { type: 'count'; n: number }
  | { type: 'go' }
  | { type: 'overtake'; rival: number; name: string }
  | { type: 'balloon'; id: number; total: number }
  | { type: 'splash'; id: number }
  | { type: 'hop'; id: number }
  | { type: 'grass' }
  | { type: 'road' }
  | { type: 'finish'; ms: number };

export interface RaceState {
  seed: number;
  theme: Theme;
  status: RaceStatus;
  countdownMs: number;
  elapsedMs: number;
  progress: number;
  lateral: number;
  steerVel: number;
  speed: number;
  onGrass: boolean;
  bumpSlowMs: number;
  hopMs: number;
  balloons: Balloon[];
  obstacles: Obstacle[];
  rivals: Rival[];
  balloonsTaken: number;
  overtakes: number;
  finishMs: number | null;
}

export interface StepResult {
  state: RaceState;
  events: RaceEvent[];
}

const roadCenter = (CFG.laneCount - 1) / 2;

export function createRace(seed: number, theme: Theme): RaceState {
  const rng = createRng(seed * 7919 + 13);

  const balloons: Balloon[] = [];
  let balloonId = 0;
  for (let p = 320; p < CFG.raceLength - 220; p += 150 + rng.range(0, 90)) {
    balloons.push({
      id: balloonId++,
      progress: p,
      lateral: Math.round(rng.range(0, CFG.laneCount - 1) * 2) / 2,
      taken: false,
    });
  }

  const obstacles: Obstacle[] = [];
  let obstacleId = 0;
  for (let p = 260; p < CFG.raceLength - 200; p += 175 + rng.range(0, 130)) {
    obstacles.push({
      id: obstacleId++,
      kind: rng.next() < 0.5 ? 'puddle' : 'bump',
      progress: p,
      lateral: rng.int(0, CFG.laneCount - 1) + rng.range(-0.2, 0.2),
      used: false,
    });
  }

  const rivals: Rival[] = CFG.rivalGaps.map((gap, index) => ({
    id: index,
    name: RIVAL_NAMES[index % RIVAL_NAMES.length],
    lateral: 0.4 + index * 0.8,
    targetLane: 0.4 + index * 0.8,
    laneTimerMs: 1200 + index * 700,
    progress: gap,
    baseSpeed: CFG.baseSpeed * CFG.rivalSpeedFactor,
    waveTimerMs: 0,
    passedByPlayer: false,
  }));

  return {
    seed,
    theme,
    status: 'countdown',
    countdownMs: CFG.countdownMs,
    elapsedMs: 0,
    progress: 0,
    lateral: roadCenter,
    steerVel: 0,
    speed: 0,
    onGrass: false,
    bumpSlowMs: 0,
    hopMs: 0,
    balloons,
    obstacles,
    rivals,
    balloonsTaken: 0,
    overtakes: 0,
    finishMs: null,
  };
}

function cloneState(state: RaceState): RaceState {
  return {
    ...state,
    balloons: state.balloons.map((balloon) => ({ ...balloon })),
    obstacles: state.obstacles.map((obstacle) => ({ ...obstacle })),
    rivals: state.rivals.map((rival) => ({ ...rival })),
  };
}

function isOnGrass(lateral: number): boolean {
  return Math.abs(lateral - roadCenter) > CFG.roadHalfLanes;
}

/** Advances the deterministic race by `dtMs` and reports everything that happened. */
export function stepRace(state: RaceState, dtMs: number, input: SteeringInput): StepResult {
  const events: RaceEvent[] = [];
  const s = cloneState(state);
  const dt = Math.max(0, Math.min(dtMs, 100)) / 1000;

  if (s.status === 'finished') {
    return { state: s, events };
  }

  if (s.status === 'countdown') {
    const before = s.countdownMs;
    s.countdownMs = Math.max(0, s.countdownMs - dtMs);
    const marks = [
      { at: CFG.countdownMs - CFG.countdownStepMs, n: 3 },
      { at: CFG.countdownMs - CFG.countdownStepMs * 2, n: 2 },
      { at: CFG.countdownMs - CFG.countdownStepMs * 3, n: 1 },
    ];
    for (const mark of marks) {
      if (before > mark.at && s.countdownMs <= mark.at) {
        events.push({ type: 'count', n: mark.n });
      }
    }
    steerPlayer(s, input, dt);
    if (s.countdownMs <= 0) {
      s.status = 'racing';
      events.push({ type: 'go' });
    }
    return { state: s, events };
  }

  s.elapsedMs += dtMs;

  if (s.bumpSlowMs > 0) {
    s.bumpSlowMs = Math.max(0, s.bumpSlowMs - dtMs);
  }
  if (s.hopMs > 0) {
    s.hopMs = Math.max(0, s.hopMs - dtMs);
  }

  const onGrass = isOnGrass(s.lateral);
  if (onGrass !== s.onGrass) {
    s.onGrass = onGrass;
    events.push({ type: onGrass ? 'grass' : 'road' });
  }

  const targetSpeed = s.onGrass ? CFG.grassSpeed : CFG.baseSpeed;
  const slowed = s.bumpSlowMs > 0 ? targetSpeed * CFG.bumpSlowFactor : targetSpeed;
  const diff = slowed - s.speed;
  const maxStep = CFG.speedAccel * dt;
  s.speed += Math.sign(diff) * Math.min(Math.abs(diff), maxStep);
  if (s.speed < 1) {
    s.speed = Math.max(s.speed, 1);
  }

  steerPlayer(s, input, dt);
  s.progress += s.speed * dt;

  for (const balloon of s.balloons) {
    if (balloon.taken) continue;
    if (Math.abs(balloon.progress - s.progress) > CFG.carLength * 0.65) continue;
    if (Math.abs(balloon.lateral - s.lateral) > CFG.collectRadius) continue;
    balloon.taken = true;
    s.balloonsTaken += 1;
    events.push({ type: 'balloon', id: balloon.id, total: s.balloonsTaken });
  }

  for (const obstacle of s.obstacles) {
    if (obstacle.used) continue;
    if (Math.abs(obstacle.progress - s.progress) > CFG.carLength * 0.5) continue;
    if (Math.abs(obstacle.lateral - s.lateral) > 0.58) continue;
    obstacle.used = true;
    if (obstacle.kind === 'puddle') {
      events.push({ type: 'splash', id: obstacle.id });
    } else {
      events.push({ type: 'hop', id: obstacle.id });
      s.hopMs = CFG.hopMs;
    }
    s.bumpSlowMs = CFG.bumpSlowMs;
  }

  for (const rival of s.rivals) {
    rival.progress += rival.baseSpeed * dt;
    rival.laneTimerMs -= dtMs;
    if (rival.laneTimerMs <= 0) {
      rival.laneTimerMs = 2600 + rival.id * 900;
      rival.targetLane = Math.min(CFG.laneCount - 1, Math.max(0, rival.targetLane + (rival.id % 2 === 0 ? 0.5 : -0.5)));
    }
    const lateralDiff = rival.targetLane - rival.lateral;
    rival.lateral += Math.sign(lateralDiff) * Math.min(Math.abs(lateralDiff), 0.5 * dt);
    if (rival.waveTimerMs > 0) {
      rival.waveTimerMs = Math.max(0, rival.waveTimerMs - dtMs);
    }
    if (!rival.passedByPlayer && rival.progress < s.progress) {
      rival.passedByPlayer = true;
      rival.waveTimerMs = 1800;
      s.overtakes += 1;
      events.push({ type: 'overtake', rival: rival.id, name: rival.name });
    }
  }

  if (s.progress >= CFG.raceLength) {
    s.progress = CFG.raceLength;
    s.status = 'finished';
    s.finishMs = Math.round(s.elapsedMs);
    events.push({ type: 'finish', ms: s.finishMs });
  }

  return { state: s, events };
}

function steerPlayer(s: RaceState, input: SteeringInput, dt: number): void {
  const steer = Math.max(-1, Math.min(1, input.steer));
  const targetVel = steer * CFG.steerMax;
  const accel = steer === 0 ? CFG.steerReturn : CFG.steerAccel;
  const diff = targetVel - s.steerVel;
  const maxStep = accel * dt;
  s.steerVel += Math.sign(diff) * Math.min(Math.abs(diff), maxStep);
  s.lateral = Math.min(CFG.laneMax, Math.max(CFG.laneMin, s.lateral + s.steerVel * dt));
}

/** Race length in seconds assuming a clean run with no grass and no bumps. */
export function expectedCleanSeconds(): number {
  return CFG.raceLength / CFG.baseSpeed + CFG.countdownMs / 1000;
}
