import { describe, expect, it } from 'vitest';
import {
  createInitialState,
  moveCell,
  type OrganId,
  stepSimulation,
  WORLD_LIMIT,
  type GameState,
  type WorldEntity,
} from './simulation';

const playing = (seed = 1234): GameState => ({ ...createInitialState(seed), phase: 'playing' });
const withOrgan = (state: GameState, organ: OrganId): GameState => ({
  ...state,
  cell: { ...state.cell, organs: [organ, null] },
});
const entity = (id: string, kind: WorldEntity['kind'], x: number, z = 0): WorldEntity => ({
  id,
  kind,
  x,
  z,
  radius: kind === 'predator' ? 1.8 : kind === 'prey' ? 0.8 : 0.55,
  phase: 0,
  consumed: false,
});

describe('cell movement and seeded food web', () => {
  it('starts from a fresh deterministic state and retains the seed', () => {
    const first = createInitialState(1234);
    const second = createInitialState(1234);
    expect(first).toEqual(second);
    expect(first.seed).toBe(1234);
    expect(first.cell.health).toBe(first.cell.maxHealth);
    expect(first.entities).toHaveLength(31);
    expect(first.entities.map(({ id }) => id)).toEqual(second.entities.map(({ id }) => id));
  });

  it('uses a different, repeatable layout for a different seed', () => {
    const first = createInitialState(1234);
    const other = createInitialState(5678);
    expect(first.entities).not.toEqual(other.entities);
    expect(createInitialState(5678).entities).toEqual(other.entities);
  });

  it('moves in the requested direction without mutating the original state', () => {
    const initial = playing();
    const next = moveCell(initial, { x: 1, z: 0 }, 0.05);
    expect(next.cell.x).toBeGreaterThan(initial.cell.x);
    expect(next.cell.z).toBe(initial.cell.z);
    expect(initial.cell.x).toBe(0);
    expect(next).not.toBe(initial);
    expect(next.cell).not.toBe(initial.cell);
  });

  it('normalizes diagonal movement and clamps to the soup boundary', () => {
    const initial = playing();
    const moved = moveCell(initial, { x: 10, z: 10 }, 0.05);
    expect(Math.hypot(moved.cell.x, moved.cell.z)).toBeCloseTo(8 * 0.05, 5);
    const edge = { ...initial, cell: { ...initial.cell, x: WORLD_LIMIT - 0.01 } };
    expect(moveCell(edge, { x: 1, z: 0 }, 0.05).cell.x).toBe(WORLD_LIMIT);
  });

  it('collects each nutrient once and preserves the prior state', () => {
    const initial = { ...playing(), entities: [entity('food-1', 'nutrient', 0)] };
    const first = stepSimulation(initial, { move: { x: 0, z: 0 } }, 0.05);
    const second = stepSimulation(first, { move: { x: 0, z: 0 } }, 0.05);
    expect(first.cell.biomass).toBe(12);
    expect(first.entities[0].consumed).toBe(true);
    expect(second.cell.biomass).toBe(12);
    expect(initial.cell.biomass).toBe(0);
    expect(initial.entities[0].consumed).toBe(false);
  });

  it('bites nearby prey for biomass and DNA, but only once', () => {
    const initial = { ...playing(), entities: [entity('prey-1', 'prey', 1.5)] };
    const first = stepSimulation(initial, { move: { x: 0, z: 0 }, bite: true }, 0.05);
    const second = stepSimulation(first, { move: { x: 0, z: 0 }, bite: true }, 0.05);
    expect(first.cell.biomass).toBe(24);
    expect(first.cell.dna).toBe(1);
    expect(first.entities[0].consumed).toBe(true);
    expect(second.cell.biomass).toBe(24);
    expect(second.cell.dna).toBe(1);
  });

  it('flagellum increases movement speed without changing the base build', () => {
    const initial = playing();
    const plain = stepSimulation(initial, { move: { x: 1, z: 0 } }, 0.05);
    const evolved = stepSimulation(withOrgan(initial, 'flagellum'), { move: { x: 1, z: 0 } }, 0.05);
    expect(evolved.cell.x).toBeCloseTo(plain.cell.x * 1.35, 5);
    expect(initial.cell.x).toBe(0);
  });

  it('cilia collect nutrients beyond the base pickup radius', () => {
    const initial = { ...playing(), entities: [entity('food-1', 'nutrient', 2)] };
    const plain = stepSimulation(initial, { move: { x: 0, z: 0 } }, 0.05);
    const evolved = stepSimulation(withOrgan(initial, 'cilia'), { move: { x: 0, z: 0 } }, 0.05);
    expect(plain.cell.biomass).toBe(0);
    expect(evolved.cell.biomass).toBe(12);
  });

  it('spines repel a touching predator instead of losing health', () => {
    const initial = { ...withOrgan(playing(), 'spines'), entities: [entity('hunter', 'predator', 2)] };
    const defended = stepSimulation(initial, { move: { x: 0, z: 0 } }, 0.05);
    expect(defended.cell.health).toBe(3);
    expect(Math.hypot(defended.entities[0].x - defended.cell.x, defended.entities[0].z - defended.cell.z)).toBeGreaterThan(4);
  });

  it('proboscis extends bite range and increases prey biomass', () => {
    const initial = { ...playing(), entities: [entity('prey-1', 'prey', 4.5)] };
    const plain = stepSimulation(initial, { move: { x: 0, z: 0 }, bite: true }, 0.05);
    const evolved = stepSimulation(withOrgan(initial, 'proboscis'), { move: { x: 0, z: 0 }, bite: true }, 0.05);
    expect(plain.cell.dna).toBe(0);
    expect(evolved.cell.dna).toBe(1);
    expect(evolved.cell.biomass).toBe(36);
  });

  it('same encounter path yields distinct outcomes for three reproducible builds', () => {
    const encounter: GameState = {
      ...playing(2468),
      entities: [
        entity('food-1', 'nutrient', 2.2),
        entity('prey-1', 'prey', 4.5),
        entity('hunter', 'predator', -2),
      ],
    };
    const run = (organs: Array<OrganId | null>): GameState => stepSimulation({
      ...encounter,
      cell: { ...encounter.cell, organs },
    }, { move: { x: 1, z: 0 }, bite: true }, 0.05);

    const baseline = run([null, null]);
    const explorer = run(['flagellum', 'cilia']);
    const defender = run(['spines', 'proboscis']);
    const signature = (state: GameState) => [state.cell.x, state.cell.biomass, state.cell.dna, state.cell.health];
    expect(new Set([JSON.stringify(signature(baseline)), JSON.stringify(signature(explorer)), JSON.stringify(signature(defender))]).size).toBe(3);
    expect(signature(baseline)).toEqual([0.4, 0, 0, 2]);
    expect(signature(explorer)).toEqual([0.54, 36, 1, 2]);
    expect(signature(defender)).toEqual([0.4, 36, 1, 3]);
  });

  it('predator contact removes one health pip and has a damage cooldown', () => {
    const initial = { ...playing(), entities: [entity('hunter', 'predator', 2)] };
    const first = stepSimulation(initial, { move: { x: 0, z: 0 } }, 0.05);
    const second = stepSimulation(first, { move: { x: 0, z: 0 } }, 0.05);
    expect(first.cell.health).toBe(2);
    expect(second.cell.health).toBe(2);
    expect(first.invulnerableSeconds).toBeGreaterThan(1);
  });

  it('dash displaces the cell and briefly prevents contact damage', () => {
    const initial = { ...playing(), entities: [entity('hunter', 'predator', 2)] };
    const dashed = stepSimulation(initial, { move: { x: 1, z: 0 }, dash: true }, 0.05);
    expect(dashed.cell.x).toBeGreaterThan(initial.cell.x + 3);
    expect(dashed.cell.health).toBe(3);
    expect(dashed.dashCooldownSeconds).toBeGreaterThan(2);
  });

  it('loses at zero health and terminal states cannot continue moving', () => {
    const initial = {
      ...playing(),
      cell: { ...playing().cell, health: 1 },
      entities: [entity('hunter', 'predator', 2)],
    };
    const lost = stepSimulation(initial, { move: { x: 0, z: 0 } }, 0.05);
    const after = stepSimulation(lost, { move: { x: 1, z: 0 }, bite: true }, 0.05);
    expect(lost.phase).toBe('lost');
    expect(lost.cell.health).toBe(0);
    expect(after).toBe(lost);
  });

  it('does not move outside an active expedition or for a zero-length step', () => {
    const menu = createInitialState();
    expect(moveCell(menu, { x: 1, z: 0 }, 0.05)).toBe(menu);
    const current = playing();
    expect(moveCell(current, { x: 1, z: 0 }, 0)).toBe(current);
  });
});
