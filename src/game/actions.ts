import { isInsideBoard, isWalkable } from './map';
import type { Direction, Entity, GameState, PlayerAction, Position } from './types';

const DELTAS: Record<Direction, Position> = {
  up: { row: -1, column: 0 },
  right: { row: 0, column: 1 },
  down: { row: 1, column: 0 },
  left: { row: 0, column: -1 },
};

const addPositions = (first: Position, second: Position): Position => ({
  row: first.row + second.row,
  column: first.column + second.column,
});

const samePosition = (first: Position, second: Position): boolean =>
  first.row === second.row && first.column === second.column;

const replaceHero = (entities: readonly Entity[], position: Position): readonly Entity[] =>
  entities.map((entity) => (entity.kind === 'hero' ? { ...entity, position } : entity));

const appendEvent = (state: GameState, message: string): GameState => ({
  ...state,
  eventLog: [...state.eventLog, message],
});

export const applyPlayerAction = (state: GameState, action: PlayerAction): GameState => {
  if (state.status !== 'playing') return state;

  const hero = state.entities.find((entity) => entity.kind === 'hero');
  if (!hero) return appendEvent(state, 'Скаут пропал в Пустоши.');

  if (action.type === 'move') {
    const destination = addPositions(hero.position, DELTAS[action.direction]);
    const tile = state.tiles.find((candidate) => samePosition(candidate.position, destination));

    if (!isInsideBoard(destination, state.boardSize) || !tile || !isWalkable(tile)) {
      return appendEvent(state, 'Путь закрыт. Попробуйте другое направление.');
    }

    return {
      ...state,
      turn: state.turn + 1,
      entities: replaceHero(state.entities, destination),
      eventLog: [...state.eventLog, `Шаг: ${action.direction}.`],
    };
  }

  if (action.type === 'wait') {
    return appendEvent({ ...state, turn: state.turn + 1 }, 'Скаут ждёт и прислушивается.');
  }

  return appendEvent(state, 'Это действие появится в следующей версии.');
};
