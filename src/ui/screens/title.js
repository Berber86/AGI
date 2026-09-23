/**
 * Заставка: выбор корпуса, зерна и имени, продолжение сохранённого забега.
 *
 * Правила показаны числами, а не настроением: игрок сразу видит базу шансов,
 * число жизней и цену корпуса — всё это константы движка, а не текст «от себя».
 */

import { HULLS, HULL_KEYS, hullSlots } from '../../engine/ship.js';
import { hullPrice, MAX_LIVES, START_PARTS, CARGO_LIMIT, MAX_SECTORS, MAX_FLEET, SECTOR_ROWS } from '../../engine/run.js';
import { CHANCE_BASE, CHANCE_MIN, CHANCE_MAX, STATS } from '../../engine/stats.js';
import { h, num, pct } from '../dom.js';

/** Короткое читаемое зерно: игрок может вписать своё и поделиться им. */
function randomSeed() {
  const words = ['пепел', 'ржавчина', 'квазар', 'обломок', 'верфь', 'свеча', 'прилив', 'якорь', 'шторм', 'искра'];
  const w = words[Math.floor(Math.random() * words.length)];
  return `${w}-${Math.floor(Math.random() * 9000 + 1000)}`;
}

export function renderTitle({ app }) {
  let hullKey = 'corvette';
  let seed = randomSeed();
  let shipName = '«Костоправ»';

  const seedInput = h('input', {
    class: 'input',
    value: seed,
    spellcheck: 'false',
    autocomplete: 'off',
    'aria-label': 'Зерно забега',
    on: { input: (ev) => { seed = ev.target.value; } },
  });

  const nameInput = h('input', {
    class: 'input',
    value: shipName,
    maxlength: '28',
    'aria-label': 'Имя корабля',
    on: { input: (ev) => { shipName = ev.target.value; } },
  });

  const picker = h('div', { class: 'hull-picker' });

  function drawPicker() {
    picker.replaceChildren(...HULL_KEYS.map((key) => {
      const hull = HULLS[key];
      const stats = hull.stats;
      return h('button', {
        class: 'hull-card',
        type: 'button',
        'aria-pressed': key === hullKey ? 'true' : 'false',
        on: {
          click: () => {
            hullKey = key;
            drawPicker();
          },
        },
      },
      h('div', { class: 'hull-card__icon', text: hull.icon }),
      h('div', { class: 'hull-card__name', text: hull.name }),
      h('div', { class: 'hull-card__slots', text: `${hullSlots(key).length} слотов` }),
      h('ul', { class: 'hull-card__stats' },
        h('li', {}, h('span', { text: 'прочность' }), h('span', { text: num(stats.hull) })),
        h('li', {}, h('span', { text: 'щит' }), h('span', { text: num(stats.shield) })),
        h('li', {}, h('span', { text: 'броня' }), h('span', { text: `÷${num(stats.armor, 2)}` })),
        h('li', {}, h('span', { text: 'урон × залп' }), h('span', { text: `${num(stats.damage)} × ${num(stats.salvo)}` })),
        h('li', {}, h('span', { text: 'скорость' }), h('span', { text: num(stats.speed, 2) })),
      ),
      h('p', { class: 'hint', style: { margin: '8px 0 0', fontSize: '11.5px' }, text: hull.desc }),
      h('div', { class: 'hull-card__price', text: `на верфи: ${hullPrice(key)} запчастей` }),
      );
    }));
  }
  drawPicker();

  const saved = app.saveSummary();

  const startBtn = h('button', {
    class: 'btn btn--primary',
    type: 'button',
    text: 'В поход',
    on: {
      click: () => {
        app.newGame({
          seed: (seed || '').trim() || randomSeed(),
          hullKey,
          shipName: (shipName || '').trim() || '«Безымянный»',
        });
      },
    },
  });

  return h('div', { class: 'title' },
    h('h1', { class: 'title__name', text: 'Верфь на костях' }),
    h('p', { class: 'title__tag', text: 'Космический рогалик про корабль, собранный из того, что снято с обломков. Три сектора, четыре жизни, ни одного спрятанного числа.' }),

    h('div', { class: 'card' },
      h('h2', { class: 'card__title', text: 'Как это работает' }),
      h('ul', { class: 'title__rules' },
        h('li', {}, 'Каждый шанс считается от видимой базы: ', h('b', { text: pct(CHANCE_BASE) }), ' попадание, уклонение, поглощение щитом. Границы — ', h('b', { text: `${pct(CHANCE_MIN)} и ${pct(CHANCE_MAX)}` }), ', а цепочка множителей показана целиком.'),
        h('li', {}, 'Модули дают множители и делители: ', h('b', { text: 'несколько множителей перемножаются' }), ', и это видно в таблице характеристик — «база ×1,36 ÷1,18 = 1,15».'),
        h('li', {}, 'Три редкости: ', h('b', { text: 'Дефектный' }), ' — штрафов больше, чем бонусов; ', h('b', { text: 'Штатный' }), ' — поровну; ', h('b', { text: 'Эталонный' }), ' — бонусов больше.'),
        h('li', {}, 'Модули снимаются с обломков: чем больше лишнего урона влито, тем сильнее они сгорают. Чистое убийство даёт чистый трофей.'),
        h('li', {}, 'Заточка усиливает бонусы и срезает штрафы, но провал их крепит и добавляет новый изъян. Уровень уходит и в минус.'),
        h('li', {}, 'Из боя можно уйти: отход стоит ', h('b', { text: '20% полной прочности' }), ' каждого корабля, жизнь сохраняет, трофеев не даёт.'),
        h('li', {}, `Забег — это ${MAX_SECTORS} сектора по ${SECTOR_ROWS} рядов, ${MAX_LIVES} жизни, трюм на ${CARGO_LIMIT} модулей и флот до ${MAX_FLEET} кораблей.`),
      ),
    ),

    h('div', { class: 'card' },
      h('h2', { class: 'card__title', text: 'Корпус на старте' }),
      picker,
      h('p', { class: 'hint', style: { marginTop: '10px' }, text: `Стартовая сборка занимает половину слотов, в трюме ${START_PARTS} запчастей. Корпус можно сменить на верфи или забрать с обломка противника — дешевле, но побитым.` }),
    ),

    h('div', { class: 'card' },
      h('h2', { class: 'card__title', text: 'Забег' }),
      h('div', { class: 'row' },
        h('label', { class: 'field', style: { flex: '1 1 220px' } },
          h('span', { class: 'field__label', text: 'Имя корабля' }),
          nameInput,
        ),
        h('label', { class: 'field', style: { flex: '1 1 220px' } },
          h('span', { class: 'field__label', text: 'Зерно (одинаковое зерно — одинаковый забег)' }),
          seedInput,
        ),
        h('div', { class: 'field', style: { justifyContent: 'flex-end' } },
          h('span', { class: 'field__label', text: ' ' }),
          h('div', { class: 'row row--tight' },
            startBtn,
            h('button', { class: 'btn btn--ghost', type: 'button', text: 'Другое зерно', on: { click: () => { seed = randomSeed(); seedInput.value = seed; } } }),
          ),
        ),
      ),
    ),

    saved ? h('div', { class: 'card' },
      h('h2', { class: 'card__title', text: 'Сохранённый забег' }),
      h('p', { class: 'hint', text: `${saved.shipName} · ${HULLS[saved.hullKey] ? HULLS[saved.hullKey].name : saved.hullKey} · сектор ${saved.sector} · ${saved.lives} из ${MAX_LIVES} жизней · ${saved.fleetSize} кораблей · ${num(saved.parts)} запчастей · зерно ${saved.seed}` }),
      h('div', { class: 'row row--tight' },
        h('button', { class: 'btn btn--primary', type: 'button', text: 'Продолжить', on: { click: () => app.continueGame() } }),
        h('button', { class: 'btn btn--ghost', type: 'button', text: 'Забыть сохранение', on: { click: () => app.forgetSave() } }),
      ),
    ) : null,

    h('p', { class: 'hint', style: { marginTop: '14px', textAlign: 'center' }, text: 'Характеристики: ' + Object.values(STATS).slice(0, 8).map((s) => s.name).join(', ') + '… — все двадцать видны на верфи.' }),
  );
}
