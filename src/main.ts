import './styles.css';
import { applyPlayerAction } from './game/actions';
import { createInitialState } from './game/state';
import type { Direction, PlayerAction } from './game/types';
import { renderBoard } from './render/renderBoard';
import { renderHud } from './render/renderHud';

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) throw new Error('Не найден корневой элемент #app');

app.innerHTML = `
  <main class="shell" aria-labelledby="game-title">
    <header class="game-header">
      <div>
        <p class="eyebrow">Вылазка · вертикальный срез</p>
        <h1 id="game-title">☢️ Emoji Wasteland Arena</h1>
        <p class="subtitle">Соберите припасы и доберитесь до 🚪. Каждый шаг приближает эвакуацию — и опасность.</p>
      </div>
      <div class="hud" data-turn role="status" aria-live="polite"></div>
    </header>
    <section class="game-layout" aria-label="Игровая арена">
      <div class="board-wrap">
        <div class="board" data-board role="grid"></div>
        <div class="controls" aria-label="Управление движением">
          <button data-direction="up" aria-label="Вверх">↑</button>
          <button data-direction="left" aria-label="Влево">←</button>
          <button data-direction="down" aria-label="Вниз">↓</button>
          <button data-direction="right" aria-label="Вправо">→</button>
          <button data-action="wait">Ждать</button>
        </div>
        <p class="hint">Клавиши: WASD или стрелки · 🧱 — завал · 🚪 — эвакуация</p>
      </div>
      <aside class="journal" aria-labelledby="journal-title">
        <h2 id="journal-title">Журнал вылазки</h2>
        <ol data-log></ol>
      </aside>
    </section>
  </main>
`;

const board = document.querySelector<HTMLElement>('[data-board]');
if (!board) throw new Error('Не найдено поле арены');

let state = createInitialState();

const update = (action: PlayerAction): void => {
  state = applyPlayerAction(state, action);
  renderBoard(board, state);
  renderHud(state);
};

document.querySelectorAll<HTMLButtonElement>('[data-direction]').forEach((button) => {
  button.addEventListener('click', () => {
    update({ type: 'move', direction: button.dataset.direction as Direction });
  });
});

document.querySelector<HTMLButtonElement>('[data-action="wait"]')?.addEventListener('click', () => {
  update({ type: 'wait' });
});

document.addEventListener('keydown', (event) => {
  const directions: Record<string, Direction> = {
    ArrowUp: 'up', w: 'up',
    ArrowRight: 'right', d: 'right',
    ArrowDown: 'down', s: 'down',
    ArrowLeft: 'left', a: 'left',
  };
  const direction = directions[event.key];
  if (direction) {
    event.preventDefault();
    update({ type: 'move', direction });
  }
});

renderBoard(board, state);
renderHud(state);
