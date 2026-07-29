import { describe, expect, it } from 'vitest';
import { applyPlayerAction } from './actions';
import { createInitialState } from './state';

describe('действия героя', () => {
  it('двигает героя на одну клетку и увеличивает ход', () => {
    const next = applyPlayerAction(createInitialState(), { type: 'move', direction: 'up' });

    expect(next.turn).toBe(1);
    expect(next.entities[0].position).toEqual({ row: 5, column: 1 });
  });

  it('не двигает героя за границу карты', () => {
    let state = createInitialState();
    for (let step = 0; step < 6; step += 1) {
      state = applyPlayerAction(state, { type: 'move', direction: 'up' });
    }
    const next = applyPlayerAction(state, { type: 'move', direction: 'up' });

    expect(next.turn).toBe(6);
    expect(next.entities[0].position).toEqual(state.entities[0].position);
    expect(next.eventLog.at(-1)).toContain('закрыт');
  });

  it('не позволяет пройти через завал', () => {
    const state = createInitialState();
    const right = applyPlayerAction(state, { type: 'move', direction: 'right' });
    const up = applyPlayerAction(right, { type: 'move', direction: 'up' });
    const afterBlocked = applyPlayerAction(up, { type: 'move', direction: 'up' });

    expect(afterBlocked.turn).toBe(2);
    expect(afterBlocked.entities[0].position).toEqual({ row: 5, column: 2 });
  });

  it('тратит ход на ожидание', () => {
    const next = applyPlayerAction(createInitialState(), { type: 'wait' });

    expect(next.turn).toBe(1);
    expect(next.eventLog.at(-1)).toContain('ждёт');
  });
});
