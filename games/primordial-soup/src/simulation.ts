export type GamePhase = 'menu' | 'playing' | 'editor' | 'paused' | 'won' | 'lost';
export type OrganId = 'flagellum' | 'cilia' | 'spines' | 'proboscis';
export type EntityKind = 'nutrient' | 'prey' | 'predator';

export interface CellState {
  x: number;
  z: number;
  heading: number;
  health: number;
  maxHealth: number;
  biomass: number;
  dna: number;
  organs: Array<OrganId | null>;
}

export interface WorldEntity {
  id: string;
  kind: EntityKind;
  x: number;
  z: number;
  radius: number;
  phase: number;
  consumed: boolean;
}

export interface GameState {
  phase: GamePhase;
  seed: number;
  elapsedSeconds: number;
  cell: CellState;
  entities: WorldEntity[];
  invulnerableSeconds: number;
  biteCooldownSeconds: number;
  dashCooldownSeconds: number;
}

export interface MoveVector {
  x: number;
  z: number;
}

export interface GameInput {
  move: MoveVector;
  bite?: boolean;
  dash?: boolean;
}

export interface OrganEffects {
  movementSpeedMultiplier: number;
  pickupRadius: number;
  biteRange: number;
  preyBiomass: number;
  hasSpines: boolean;
}

export const WORLD_LIMIT = 34;
export const BASE_MOVE_SPEED = 8;
export const CELL_RADIUS = 1.1;
const MAX_STEP_SECONDS = 0.05;
const DASH_DISTANCE = 4.2;
const BITE_RANGE = 3.2;
const PREDATOR_SPEED = 1.65;

export function getOrganEffects(organs: readonly (OrganId | null)[]): OrganEffects {
  const active = new Set(organs.filter((organ): organ is OrganId => organ !== null));
  return {
    movementSpeedMultiplier: active.has('flagellum') ? 1.35 : 1,
    pickupRadius: active.has('cilia') ? CELL_RADIUS * 1.55 : CELL_RADIUS,
    biteRange: active.has('proboscis') ? BITE_RANGE * 1.55 : BITE_RANGE,
    preyBiomass: active.has('proboscis') ? 36 : 24,
    hasSpines: active.has('spines'),
  };
}

export function createInitialState(seed = 0x4d494352): GameState {
  const stableSeed = seed >>> 0;
  return {
    phase: 'menu',
    seed: stableSeed,
    elapsedSeconds: 0,
    cell: {
      x: 0,
      z: 0,
      heading: 0,
      health: 3,
      maxHealth: 3,
      biomass: 0,
      dna: 0,
      organs: [null, null],
    },
    entities: createEntities(stableSeed),
    invulnerableSeconds: 0,
    biteCooldownSeconds: 0,
    dashCooldownSeconds: 0,
  };
}

export function moveCell(
  state: GameState,
  input: MoveVector,
  deltaSeconds: number,
  speed = BASE_MOVE_SPEED,
): GameState {
  if (state.phase !== 'playing' || deltaSeconds <= 0) return state;

  const { x: axisX, z: axisZ, magnitude } = normalized(input);
  const dt = Math.min(deltaSeconds, MAX_STEP_SECONDS);
  const x = clamp(state.cell.x + axisX * speed * dt, -WORLD_LIMIT, WORLD_LIMIT);
  const z = clamp(state.cell.z + axisZ * speed * dt, -WORLD_LIMIT, WORLD_LIMIT);
  const heading = magnitude > 0.015 ? Math.atan2(axisX, axisZ) : state.cell.heading;

  return {
    ...state,
    elapsedSeconds: state.elapsedSeconds + dt,
    cell: { ...state.cell, x, z, heading },
  };
}

export function stepSimulation(state: GameState, input: GameInput, deltaSeconds: number): GameState {
  if (state.phase !== 'playing' || deltaSeconds <= 0) return state;
  const dt = Math.min(deltaSeconds, MAX_STEP_SECONDS);
  const effects = getOrganEffects(state.cell.organs);
  const moved = moveCell(state, input.move, dt, BASE_MOVE_SPEED * effects.movementSpeedMultiplier);
  const elapsedSeconds = moved.elapsedSeconds;
  let cell = { ...moved.cell };
  let invulnerableSeconds = Math.max(0, state.invulnerableSeconds - dt);
  let biteCooldownSeconds = Math.max(0, state.biteCooldownSeconds - dt);
  let dashCooldownSeconds = Math.max(0, state.dashCooldownSeconds - dt);
  let biomass = cell.biomass;
  let dna = cell.dna;
  let phase: GamePhase = state.phase;
  const entities = state.entities.map((entity) => ({ ...entity }));

  if (input.dash && dashCooldownSeconds <= 0) {
    let direction = normalized(input.move);
    if (direction.magnitude <= 0.015) {
      direction = { x: Math.sin(cell.heading), z: Math.cos(cell.heading), magnitude: 1 };
    }
    cell.x = clamp(cell.x + direction.x * DASH_DISTANCE, -WORLD_LIMIT, WORLD_LIMIT);
    cell.z = clamp(cell.z + direction.z * DASH_DISTANCE, -WORLD_LIMIT, WORLD_LIMIT);
    invulnerableSeconds = Math.max(invulnerableSeconds, 0.34);
    dashCooldownSeconds = 2.8;
  }

  for (const entity of entities) {
    if (entity.consumed) continue;
    if (entity.kind === 'prey') {
      const drift = elapsedSeconds + entity.phase;
      entity.x = clamp(entity.x + Math.sin(drift * 0.75) * dt * 0.45, -WORLD_LIMIT + 2, WORLD_LIMIT - 2);
      entity.z = clamp(entity.z + Math.cos(drift * 0.63) * dt * 0.45, -WORLD_LIMIT + 2, WORLD_LIMIT - 2);
    } else if (entity.kind === 'predator') {
      const dx = cell.x - entity.x;
      const dz = cell.z - entity.z;
      const distance = Math.hypot(dx, dz);
      if (distance > 0.001) {
        const stride = Math.min(distance, PREDATOR_SPEED * dt);
        entity.x = clamp(entity.x + (dx / distance) * stride, -WORLD_LIMIT + 1, WORLD_LIMIT - 1);
        entity.z = clamp(entity.z + (dz / distance) * stride, -WORLD_LIMIT + 1, WORLD_LIMIT - 1);
        entity.phase = Math.atan2(dx, dz);
      }
    }
  }

  for (const entity of entities) {
    if (entity.kind !== 'nutrient' || entity.consumed) continue;
    if (distance(cell.x, cell.z, entity.x, entity.z) <= effects.pickupRadius + entity.radius) {
      entity.consumed = true;
      biomass = Math.min(100, biomass + 12);
    }
  }

  if (input.bite && biteCooldownSeconds <= 0) {
    const nearestPrey = entities
      .filter((entity) => entity.kind === 'prey' && !entity.consumed)
      .map((entity) => ({ entity, distance: distance(cell.x, cell.z, entity.x, entity.z) }))
      .filter((entry) => entry.distance <= effects.biteRange + entry.entity.radius)
      .sort((a, b) => a.distance - b.distance)[0];
    biteCooldownSeconds = 0.42;
    if (nearestPrey) {
      nearestPrey.entity.consumed = true;
      biomass = Math.min(100, biomass + effects.preyBiomass);
      dna += 1;
    }
  }

  const predator = entities.find((entity) => entity.kind === 'predator' && !entity.consumed);
  if (predator) {
    const predatorTouchRange = CELL_RADIUS + predator.radius * 0.78;
    const contactDistance = distance(cell.x, cell.z, predator.x, predator.z);
    if (contactDistance <= predatorTouchRange) {
      if (effects.hasSpines) {
        const dx = predator.x - cell.x;
        const dz = predator.z - cell.z;
        const distanceFromCell = Math.max(0.001, Math.hypot(dx, dz));
        const repelDistance = predatorTouchRange + 2.2;
        predator.x = clamp(cell.x + (dx / distanceFromCell) * repelDistance, -WORLD_LIMIT + 1, WORLD_LIMIT - 1);
        predator.z = clamp(cell.z + (dz / distanceFromCell) * repelDistance, -WORLD_LIMIT + 1, WORLD_LIMIT - 1);
      } else if (invulnerableSeconds <= 0) {
        cell.health = Math.max(0, cell.health - 1);
        invulnerableSeconds = 1.15;
        if (cell.health === 0) phase = 'lost';
      }
    }
  }

  return {
    ...moved,
    phase,
    elapsedSeconds,
    cell: { ...cell, biomass, dna },
    entities,
    invulnerableSeconds,
    biteCooldownSeconds,
    dashCooldownSeconds,
  };
}

export function normalized(input: MoveVector): MoveVector & { magnitude: number } {
  const length = Math.hypot(input.x, input.z);
  const magnitude = Math.min(1, length);
  if (length === 0) return { x: 0, z: 0, magnitude: 0 };
  return { x: (input.x / length) * magnitude, z: (input.z / length) * magnitude, magnitude };
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function createEntities(seed: number): WorldEntity[] {
  const random = seededRandom(seed ^ 0xa53c9e1d);
  const entities: WorldEntity[] = [];
  for (let index = 0; index < 24; index += 1) {
    const angle = (index / 24) * Math.PI * 2 + (random() - 0.5) * 0.34;
    const radius = 8 + random() * 22;
    entities.push({
      id: `nutrient-${String(index + 1).padStart(2, '0')}`,
      kind: 'nutrient',
      x: Math.cos(angle) * radius,
      z: Math.sin(angle) * radius,
      radius: 0.52 + random() * 0.18,
      phase: random() * Math.PI * 2,
      consumed: false,
    });
  }
  for (let index = 0; index < 6; index += 1) {
    const angle = random() * Math.PI * 2;
    const radius = 12 + random() * 17;
    entities.push({
      id: `prey-${String(index + 1).padStart(2, '0')}`,
      kind: 'prey',
      x: Math.cos(angle) * radius,
      z: Math.sin(angle) * radius,
      radius: 0.78 + random() * 0.16,
      phase: random() * Math.PI * 2,
      consumed: false,
    });
  }
  entities.push({
    id: 'predator-01',
    kind: 'predator',
    x: -24,
    z: 22,
    radius: 1.8,
    phase: -Math.PI * 0.75,
    consumed: false,
  });
  return entities;
}

function seededRandom(seed: number): () => number {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let next = value;
    next = Math.imul(next ^ (next >>> 15), next | 1);
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}

function distance(x1: number, z1: number, x2: number, z2: number): number {
  return Math.hypot(x1 - x2, z1 - z2);
}
