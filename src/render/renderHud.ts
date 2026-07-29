import type { GameState } from '../game/types';

export const renderHud = (state: GameState): void => {
  const turn = document.querySelector<HTMLElement>('[data-turn]');
  const log = document.querySelector<HTMLOListElement>('[data-log]');
  if (!turn || !log) return;
  const hero = state.entities.find((entity) => entity.kind === 'hero');
  turn.textContent = `Ход ${state.turn} · ❤️ ${hero?.health ?? 0}/${hero?.maxHealth ?? 0} · 🥫 ${state.supplies}`;
  log.innerHTML = state.eventLog.slice(-5).map((event) => `<li>${event}</li>`).join('');
};
