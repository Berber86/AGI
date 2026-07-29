import type { Entity, GameState, Tile } from '../game/types';

const tileEmoji: Record<Tile['kind'], string> = {
  floor: '·', rubble: '🧱', evacuation: '🚪', supplies: '🥫', medkit: '🩹',
};
const entityEmoji: Record<Entity['kind'], string> = {
  hero: '🧑‍🚀', 'mutant-rat': '🐀', 'rust-drone': '🛸',
};

export const renderBoard = (container: HTMLElement, state: GameState): void => {
  const entitiesByPosition = new Map(state.entities.map((entity) => [`${entity.position.row}:${entity.position.column}`, entity]));
  container.innerHTML = '';
  container.setAttribute('aria-label', `Арена ${state.boardSize} на ${state.boardSize}`);
  for (const tile of state.tiles) {
    const cell = document.createElement('div');
    const entity = entitiesByPosition.get(`${tile.position.row}:${tile.position.column}`);
    cell.className = `board__cell board__cell--${tile.kind}`;
    cell.textContent = entity ? entityEmoji[entity.kind] : tileEmoji[tile.kind];
    cell.setAttribute('role', 'gridcell');
    cell.setAttribute('aria-label', entity ? `Герой, строка ${tile.position.row + 1}, колонка ${tile.position.column + 1}` : tile.kind);
    container.append(cell);
  }
};
