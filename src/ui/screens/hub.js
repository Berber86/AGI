// Оболочка «города»: вкладки мета-экрана и путеводитель по первым шагам.
import { el, btn } from '../dom.js';
import { app } from '../app.js';
import { renderMap } from './map.js';
import { renderScience } from './science.js';
import { renderForge } from './forge.js';
import { renderRoster } from './roster.js';
import { renderDeck } from './deck.js';
import { renderJournal } from './journal.js';
import { ROMAN_ERA } from '../shared.js';

export const HUB_TABS = [
  { id: 'map', label: 'Карта мира', icon: '🗺', render: renderMap },
  { id: 'forge', label: 'Мастерская', icon: '⚙', render: renderForge },
  { id: 'science', label: 'Наука', icon: '🔬', render: renderScience },
  { id: 'roster', label: 'Ростер', icon: '🛡', render: renderRoster },
  { id: 'deck', label: 'Колода', icon: '🂠', render: renderDeck },
  { id: 'journal', label: 'Журнал', icon: '📜', render: renderJournal },
];

const GOALS_KEY = 'gears-of-ages:goals-hidden';

/**
 * Цели первого знакомства. Всё выводится из состояния партии — ничего не нужно
 * хранить и нечему рассинхронизироваться. Порядок повторяет игровой цикл:
 * Мастерская → Ростер → Колода → Бой → Наука → Экспансия.
 */
export function objectives(st) {
  const wins = st.stats?.wins || 0;
  const crafted = st.stats?.crafted || 0;
  const recruited = st.stats?.recruited || 0;
  // Новая партия уже получает стартовый комплект (проекты, юниты, колода),
  // поэтому цели проверяют ЛИЧНЫЕ действия игрока — stats.crafted и
  // stats.recruited растут только от craft() и recruit(), стартовый
  // комплект их не трогает.
  return [
    {
      id: 'win', tab: 'map', icon: '⚔',
      text: 'Выиграйте первый бой',
      hint: 'Стартовая колода уже собрана. Выберите доступный регион на карте и атакуйте: победа даёт науку, материалы и землю.',
      done: wins >= 1,
      progress: `${Math.min(wins, 1)}/1`,
    },
    {
      id: 'craft', tab: 'forge', icon: '⚙',
      text: 'Соберите собственный проект',
      hint: 'Положите в слоты изученные открытия. Совместимые шестерёнки дают свойство, а число слотов — редкость.',
      done: crafted >= 1,
      progress: `${Math.min(crafted, 1)}/1`,
    },
    {
      id: 'recruit', tab: 'roster', icon: '🛡',
      text: 'Наймите юнита по своему проекту',
      hint: 'Проект — это чертёж: по нему можно нанимать юнитов за материалы. Юниты переживают бой и копят опыт.',
      done: recruited >= 1,
      progress: `${Math.min(recruited, 1)}/1`,
    },
    {
      id: 'era', tab: 'science', icon: '🔬',
      text: 'Изучите 2 открытия эпохи и смените её',
      hint: 'Смена эпохи поднимает здоровье лидера, поле и колоду — бои станут длиннее и хитрее.',
      done: st.era >= 2,
      progress: st.era >= 2 ? '✓' : `${ROMAN_ERA[st.era]}`,
    },
    {
      id: 'expand', tab: 'map', icon: '🚩',
      text: 'Займите 3 региона',
      hint: 'Каждая земля увеличивает доход и открывает следующий пояс карты.',
      done: (st.conquered || 0) >= 3,
      progress: `${Math.min(st.conquered || 0, 3)}/3`,
    },
    {
      id: 'crown', tab: 'map', icon: '👑',
      text: 'Возьмите Сердцевину',
      hint: 'Финальный регион эпохи Атома. Чтобы дойти до него, нужно сменить шесть эпох.',
      done: !!st.victory,
      progress: st.victory ? '✓' : `${st.conquered || 0}/10`,
    },
  ];
}

const goalsHidden = () => {
  try { return localStorage.getItem(GOALS_KEY) === '1'; } catch { return false; }
};
const setGoalsHidden = (v) => {
  try { localStorage.setItem(GOALS_KEY, v ? '1' : '0'); } catch { /* приватный режим */ }
};

/** Путеводитель: компактная полоса целей над содержимым вкладки. */
function goalsBar(st, rerender) {
  const list = objectives(st);
  const done = list.filter((g) => g.done).length;
  if (done === list.length) return null;
  const next = list.find((g) => !g.done);

  const bar = el('div', { class: `goals${done === 0 ? ' goals--fresh' : ''}` }, [
    el('div', { class: 'goals__head' }, [
      el('div', { class: 'goals__title' }, [
        el('b', {}, 'Путь цивилизации'),
        el('span', { class: 'dim small' }, `${done} из ${list.length}`),
      ]),
      el('div', { class: 'goals__bar' }, el('i', { style: { width: `${(done / list.length) * 100}%` } })),
      el('button', {
        class: 'goals__x', title: 'Скрыть путеводитель', 'aria-label': 'Скрыть путеводитель',
        onclick: () => { setGoalsHidden(true); rerender(); },
      }, '✕'),
    ]),
    el('div', { class: 'goals__steps' }, list.map((g) => el('div', {
      class: `goal${g.done ? ' goal--done' : ''}${g === next ? ' goal--next' : ''}`,
      title: g.hint,
    }, [
      el('span', { class: 'goal__i', text: g.done ? '✓' : g.icon }),
      el('span', { class: 'goal__t', text: g.text }),
      el('span', { class: 'goal__p', text: g.progress }),
    ]))),
    next ? el('div', { class: 'goals__cta' }, [
      el('span', { class: 'goals__hint', text: next.hint }),
      btn(`${next.icon} ${HUB_TABS.find((t) => t.id === next.tab)?.label || ''}`, () => {
        app.tab = next.tab;
        rerender();
      }, 'primary sm'),
    ]) : null,
  ]);
  return bar;
}

export function renderHub() {
  const tab = HUB_TABS.find((t) => t.id === app.tab) || HUB_TABS[0];
  const node = el('section', { class: `screen screen--${tab.id}` });

  const rerender = () => {
    const host = document.querySelector('.view');
    if (host) { host.replaceChildren(renderHub()); }
  };

  if (!goalsHidden()) {
    const bar = goalsBar(app.state, rerender);
    if (bar) node.append(bar);
  } else {
    // вернуть путеводитель можно из журнала — не запираем его навсегда
    node.append(el('button', {
      class: 'goals__restore', title: 'Показать путеводитель',
      onclick: () => { setGoalsHidden(false); rerender(); },
    }, '🧭 Путь цивилизации'));
  }

  node.append(tab.render());
  return node;
}
