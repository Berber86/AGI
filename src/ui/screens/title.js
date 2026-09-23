// Экран заставки: новая партия, выбор Наследия (аналог выбора цвета в MTG),
// сложность, сид и продолжение сохранённой игры.
import { el, btn, mount } from '../dom.js';
import { gearSVG } from '../art.js';
import { DOMAINS, GEAR_IDS, S } from '../shared.js';
import { app, render, persist, toast } from '../app.js';

const DIFFS = [
  { v: 0.75, name: 'Ученик', desc: 'Соперники слабее: меньше корпуса, меньше ветеранов.' },
  { v: 1, name: 'Стратег', desc: 'Честная партия. Соперники проектируют карты так же, как вы.' },
  { v: 1.35, name: 'Эпоха войн', desc: 'Соперники сильнее и опытнее. Бои длиннее и злее.' },
];

export function renderTitle() {
  const saved = S.loadSaved();
  let legacy = 'craft';
  let difficulty = 1;
  const seedBox = { value: String(Math.floor(Math.random() * 1e6)) };

  const root = el('div', { class: 'title' });

  // --- шапка с вращающимися шестернями ---
  const gears = GEAR_IDS.map((g, i) => el('span', {
    class: `title__gear title__gear--${i}`,
    html: gearSVG(g, 60 + (i % 3) * 12, { letter: false }),
  }));
  root.append(el('div', { class: 'title__gears' }, gears));

  root.append(el('div', { class: 'title__head' }, [
    el('h1', { class: 'title__name' }, [el('span', {}, 'ШЕСТЕРНИ'), el('em', {}, 'ЭПОХ')]),
    el('p', { class: 'title__sub' }, 'Колодостроительная стратегия: MTG × Civilization'),
    el('div', { class: 'title__pitch' }, [
      el('p', {}, 'Карт в игре нет. Каждый юнит — это '),
      el('b', {}, 'сцепление научных открытий'),
      el('p', {}, 'Слоты карты заполняются открытиями; все '),
      el('b', {}, 'пары шестерёнок'),
      el('p', {}, 'порождают свойства вроде Первого удара, Топота, Мора и Несокрушимости.'),
    ]),
  ]));

  // --- Наследие ---
  const legacyBox = el('div', { class: 'legacy' });
  const paint = () => {
    mount(legacyBox, S.LEGACIES.map((l) => {
      const d = DOMAINS[l.domain];
      return el('button', {
        class: `legacy__opt${legacy === l.domain ? ' legacy__opt--on' : ''}`,
        style: { '--dom': d.color },
        onclick: () => { legacy = l.domain; paint(); },
      }, [
        el('div', { class: 'legacy__glyph', text: d.glyph }),
        el('div', { class: 'legacy__name', text: l.name }),
        el('div', { class: 'legacy__desc', text: l.desc }),
      ]);
    }));
  };
  paint();

  const diffBox = el('div', { class: 'diffs' });
  const paintDiff = () => {
    mount(diffBox, DIFFS.map((d) => el('button', {
      class: `diff${difficulty === d.v ? ' diff--on' : ''}`,
      onclick: () => { difficulty = d.v; paintDiff(); },
    }, [el('b', {}, d.name), el('span', {}, d.desc)])));
  };
  paintDiff();

  const nameInput = el('input', { class: 'input', type: 'text', value: 'Аккад', maxlength: 24, placeholder: 'Название цивилизации' });
  const seedInput = el('input', { class: 'input input--sm', type: 'text', value: seedBox.value, maxlength: 12 });

  const start = () => {
    const state = S.newGame({
      civName: nameInput.value.trim() || 'Безымянная цивилизация',
      seed: seedInput.value.trim() || seedBox.value,
      legacy, difficulty,
    });
    app.state = state;
    app.screen = 'hub';
    app.tab = 'forge';
    persist();
    render();
    toast('Цивилизация основана. Соберите первую колоду в Мастерской.', 'ok', 4200);
  };

  root.append(el('div', { class: 'title__panel' }, [
    el('div', { class: 'panel-block' }, [
      el('h3', {}, '1 · Наследие'),
      el('p', { class: 'hint' }, 'Определяет стартовые открытия и цвет вашей цивилизации.'),
      legacyBox,
    ]),
    el('div', { class: 'panel-block' }, [
      el('h3', {}, '2 · Цивилизация и сид'),
      el('div', { class: 'row' }, [nameInput, el('label', { class: 'inline' }, ['сид', seedInput])]),
    ]),
    el('div', { class: 'panel-block' }, [
      el('h3', {}, '3 · Сложность'),
      diffBox,
    ]),
    el('div', { class: 'row row--center title__cta' }, [
      btn('⚙ Основать цивилизацию', start, 'primary big'),
      saved ? btn('↺ Продолжить партию', () => { app.state = saved; app.screen = 'hub'; render(); }, 'big') : null,
    ]),
    saved ? el('div', { class: 'small dim row row--center' }, `Сохранение: ${saved.civName}, эпоха ${saved.era}, регионов ${saved.conquered}/10`) : null,
  ]));

  return root;
}
