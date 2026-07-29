import { describe, expect, it } from 'vitest';
import { BOARD_SIZE, EVACUATION_POSITION, HERO_START } from './config';
import { createArenaTiles, isInsideBoard, isWalkable } from './map';
import { createInitialState } from './state';

describe('контракт арены MLP', () => {
  it('создаёт квадратную арену 8×8 с эвакуацией и стартом героя', () => {
    const tiles = createArenaTiles();

    expect(tiles).toHaveLength(BOARD_SIZE * BOARD_SIZE);
    expect(tiles.find((tile) => tile.kind === 'evacuation')?.position).toEqual(EVACUATION_POSITION);
    expect(tiles.find((tile) => tile.kind === 'supplies')?.position).toEqual(HERO_START);
    expect(tiles.filter(isWalkable)).toHaveLength(58);
  });

  it('проверяет границы и блокирует завалы', () => {
    const tiles = createArenaTiles();
    const rubble = tiles.find((tile) => tile.kind === 'rubble');

    expect(rubble).toBeDefined();
    expect(isWalkable(rubble!)).toBe(false);
    expect(isInsideBoard({ row: 0, column: 0 })).toBe(true);
    expect(isInsideBoard({ row: BOARD_SIZE, column: 0 })).toBe(false);
    expect(isInsideBoard({ row: -1, column: 0 })).toBe(false);
  });

  it('создаёт героя в состоянии вылазки без скрытой мутации', () => {
    const state = createInitialState();
    const nextState = createInitialState();

    expect(state.status).toBe('playing');
    expect(state.turn).toBe(0);
    expect(state.entities).toHaveLength(1);
    expect(state.entities[0].position).toEqual(HERO_START);
    expect(state.entities).not.toBe(nextState.entities);
  });
});
