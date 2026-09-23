// Экран «Колода»: сборка армии из ростера. Юниты не расходуются поштучно —
// они переживают бой и возвращаются в строй к следующей сборке.
import { el, btn, mount, tooltip } from '../dom.js';
import { gearSVG } from '../art.js';
import { DOMAINS, GEARS, GEAR_IDS, ROMAN_ERA, S, eraOf, vetTier, VET_NAMES } from '../shared.js';
import { app, persist, toast, render } from '../app.js';
import { renderCard } from '../cards.js';

let style = 'balanced';
let sortMode = 'cost';

const STYLES = [
  { id: 'balanced', name: 'Сбалансированно' },
  { id: 'aggro', name: 'Агрессия' },
  { id: 'control', name: 'Контроль' },
  { id: 'swarm', name: 'Рой' },
  { id: 'midrange', name: 'Мидрейндж' },
];

export function renderDeck() {
  const st = app.state;
  const info = S.deckInfo(st);
  const lim = S.deckLimits(st);
  const root = el('div', { class: 'deck' });

  // --- левая колонка: сама колода ---
  const left = el('div', { class: 'deck__main' });
  left.append(el('div', { class: 'card-panel' }, [
    el('div', { class: 'rp-head' }, [
      el('h3', {}, `Колода эпохи ${ROMAN_ERA[st.era]}`),
      el('span', { class: `count-badge${info.valid ? ' count-badge--ok' : ' count-badge--bad'}` }, `${info.count} / ${lim.min}–${lim.max}`),
    ]),
    el('p', { class: 'hint' }, 'Юниты гибнут только в бою и возвращаются в строй после него — колода собирается заново перед каждым сражением.'),
    el('div', { class: 'deckstats' }, [
      stat('Средняя цена', `${info.avgCost.toFixed(1)}⚡`),
      stat('Суммарная атака', info.atk),
      stat('Суммарное здоровье', info.hp),
      stat('Свойств', info.kw),
      stat('Ветеранов', info.units.filter((u) => vetTier(u) > 0).length),
    ]),
    curveChart(info),
    gearCoverage(info),
    el('div', { class: 'row' }, [
      el('select', { class: 'input input--sm', onchange: (e) => { style = e.target.value; } },
        STYLES.map((s) => el('option', { value: s.id, selected: style === s.id }, s.name))),
      btn('⚙ Автосбор', () => {
        const r = S.autoDeck(st, style);
        if (!r.ok) { toast(r.reason, 'bad'); return; }
        persist(); toast('Колода собрана.', 'ok'); refresh();
      }, 'primary'),
      btn('Очистить', () => { st.deck = []; persist(); refresh(); }),
    ]),
  ]));

  const list = el('div', { class: 'decklist' });
  const units = info.units.slice().sort((a, b) => SORT[sortMode](a, b));
  if (!units.length) list.append(el('div', { class: 'dim' }, 'Колода пуста. Добавьте юнитов справа или нажмите «Автосбор».'));
  for (const u of units) {
    // карту в колоде можно рассмотреть: клик открывает тот же разбор,
    // что и в ростере (какая пара шестерёнок дала какое свойство)
    const cell = el('div', { class: 'deckcell' }, [
      renderCard(u, { size: 'sm', onClick: () => detailModal(u, { mode: 'deck' }) }),
      btn('✕', () => { st.deck = st.deck.filter((x) => x !== u.id); persist(); refresh(); }, 'sm danger-ghost'),
    ]);
    tooltip(cell, `<b>${u.blueprint.name}</b> — ${u.blueprint.atk}/${u.blueprint.hp}, ${u.blueprint.cost} ⚡<br>
      <span class="tip-sub">Клик — разбор карты · ✕ — убрать из колоды</span>`);
    list.append(cell);
  }
  left.append(list);
  root.append(left);

  // --- правая колонка: ростер ---
  const right = el('div', { class: 'deck__pool' });
  const pool = st.roster.filter((u) => !st.deck.includes(u.id));
  right.append(el('div', { class: 'card-panel' }, [
    el('div', { class: 'rp-head' }, [
      el('h3', {}, `Ростер · ${pool.length} свободных`),
      el('select', { class: 'input input--xs', onchange: (e) => { sortMode = e.target.value; refresh(); } },
        Object.entries(SORT_LABEL).map(([k, v]) => el('option', { value: k, selected: sortMode === k }, v))),
    ]),
    el('p', { class: 'hint' }, `Клик по юниту — добавить в колоду. Осталось мест: ${Math.max(0, lim.max - info.count)}.`),
  ]));
  const grid = el('div', { class: 'poolgrid' });
  const sorted = pool.slice().sort((a, b) => SORT[sortMode](a, b));
  for (const u of sorted) {
    const full = info.count >= lim.max;
    const cell = el('div', { class: `poolcell${full ? ' poolcell--off' : ''}` }, renderCard(u, {
      size: 'xs',
      onClick: () => {
        if (full) { toast(`Колода полна: максимум ${lim.max} юнитов в эпохе ${ROMAN_ERA[st.era]}.`, 'bad'); return; }
        st.deck.push(u.id); persist(); refresh();
      },
    }));
    grid.append(cell);
  }
  if (!pool.length) grid.append(el('div', { class: 'dim' }, 'Все юниты уже в колоде (или ростер пуст).'));
  right.append(grid);
  root.append(right);
  return root;
}

const SORT_LABEL = { cost: 'цена ⚡', power: 'сила', name: 'имя', vet: 'ветеранство', rarity: 'редкость' };
const SORT = {
  cost: (a, b) => a.blueprint.cost - b.blueprint.cost || (b.blueprint.atk + b.blueprint.hp) - (a.blueprint.atk + a.blueprint.hp),
  power: (a, b) => (b.blueprint.atk * 1.1 + b.blueprint.hp + b.blueprint.keywords.length * 3) - (a.blueprint.atk * 1.1 + a.blueprint.hp + a.blueprint.keywords.length * 3),
  name: (a, b) => a.blueprint.name.localeCompare(b.blueprint.name, 'ru'),
  vet: (a, b) => vetTier(b) - vetTier(a) || b.blueprint.cost - a.blueprint.cost,
  rarity: (a, b) => b.blueprint.slots - a.blueprint.slots || b.blueprint.cost - a.blueprint.cost,
};

const stat = (k, v) => el('div', { class: 'dstat' }, [el('b', {}, String(v)), el('span', {}, k)]);

function curveChart(info) {
  const cap = eraOf(app.state.era).energyCap;
  const max = Math.max(1, ...Object.values(info.curve));
  const box = el('div', { class: 'curve' });
  for (let c = 1; c <= cap; c++) {
    const n = info.curve[c] || 0;
    box.append(el('div', { class: 'curve__col', title: `${c}⚡ — ${n} юнитов` }, [
      el('div', { class: 'curve__bar' }, el('i', { style: { height: `${(n / max) * 100}%` } })),
      el('span', {}, String(c)),
    ]));
  }
  return el('div', { class: 'curve-wrap' }, [el('h4', {}, 'Кривая стоимости'), box]);
}

function gearCoverage(info) {
  const total = Object.values(info.gearCount).reduce((a, b) => a + b, 0) || 1;
  return el('div', { class: 'coverage' }, [
    el('h4', {}, 'Покрытие шестерёнок'),
    el('div', { class: 'coverage__row' }, GEAR_IDS.map((g) => {
      const n = info.gearCount[g] || 0;
      const node = el('div', { class: `cov${n ? ' cov--on' : ''}`, style: { '--c': GEARS[g].color } }, [
        el('span', { html: gearSVG(g, 26, { dim: n ? 1 : 0.25 }) }),
        el('b', {}, String(n)),
      ]);
      tooltip(node, `<b>${GEARS[g].name}</b>: ${n} в колоде (${Math.round((n / total) * 100)}%)`);
      return node;
    })),
  ]);
}

function refresh() {
  const node = document.querySelector('.screen--deck');
  if (node) mount(node, renderDeck());
}
