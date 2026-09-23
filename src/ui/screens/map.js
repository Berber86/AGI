/**
 * Карта сектора.
 *
 * Граф настоящий: узлы расставлены по рядам, а связи рисуются линиями по
 * измеренным позициям, поэтому игрок видит, куда именно ведёт каждый узел, а
 * не угадывает по соседству. Доступны только дети текущей позиции — в том
 * числе уже зачищенные: через них можно пройти дальше, бой не повторяется.
 */

import { NODE_TYPES, nodeById } from '../../engine/sector.js';
import { computeStats, shipPower, HULLS, installedModules, slotList } from '../../engine/ship.js';
import { MAX_SECTORS, choices } from '../../engine/run.js';
import { h, num, pct, barEl , nextFrame } from '../dom.js';

export function renderMap({ app, state }) {
  const run = state.run;
  // Ходы берём у движка: если карта начнёт считать доступные узлы сама,
  // интерфейс и правила разойдутся, а игрок увидит узел, в который нельзя войти.
  const available = new Set(choices(run).map((n) => n.id));

  const canvas = h('div', { class: 'map__canvas' });
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'map__edges');
  svg.setAttribute('aria-hidden', 'true');
  canvas.append(svg);

  // Ряды сверху вниз: босс наверху, вход снизу — так путь читается как подъём.
  const rows = [];
  for (const node of run.map.nodes) {
    (rows[node.row] = rows[node.row] || []).push(node);
  }

  for (let r = rows.length - 1; r >= 0; r--) {
    const list = rows[r] || [];
    const rowEl = h('div', { class: 'map__row' },
      h('span', { class: 'map__row-label', text: r === rows.length - 1 ? 'флагман' : r === 0 ? 'вход' : `ряд ${r + 1}` }),
    );
    for (const node of list) {
      const type = NODE_TYPES[node.type] || NODE_TYPES.battle;
      const cls = ['node'];
      if (node.type === 'boss') cls.push('node--boss');
      if (node.id === run.currentNode) cls.push('node--current');
      else if (available.has(node.id)) cls.push('node--available');
      else if (node.cleared) cls.push('node--cleared');
      else cls.push('node--locked');

      const btn = h('button', {
        class: cls.join(' '),
        type: 'button',
        dataset: { node: node.id },
        disabled: !available.has(node.id),
        title: `${type.name}: ${type.desc}${node.cleared ? ' (зачищено)' : ''}`,
        on: {
          click: () => { if (available.has(node.id)) app.enterNodeUi(node.id); },
        },
      },
      h('span', { class: 'node__icon', text: type.icon }),
      h('span', { class: 'node__name', text: type.name }),
      );
      rowEl.append(btn);
    }
    canvas.append(rowEl);
  }

  // Линии рисуем после вставки в документ: нужны реальные координаты узлов.
  nextFrame(() => drawEdges(canvas, svg, run, available));

  return h('div', { class: 'map stack' },
    h('div', { class: 'card' },
      h('div', { class: 'row row--between' },
        h('div', {},
          h('h2', { class: 'title-line', text: `Сектор ${run.sector} из ${MAX_SECTORS}` }),
          h('p', { class: 'subtitle', style: { margin: 0 }, text: run.currentNode
            ? `Позиция: ${NODE_TYPES[nodeById(run.map, run.currentNode)?.type]?.name || '—'}. Дальше ведут подсвеченные узлы.`
            : 'Выберите входной узел: забег начинается снизу карты.' }),
        ),
        h('div', { class: 'row row--tight' },
          h('button', { class: 'btn', type: 'button', text: '⚒ Верфь', on: { click: () => app.openShipyard() } }),
          h('button', { class: 'btn btn--ghost', type: 'button', text: 'Сохранить', on: { click: () => app.saveGame() } }),
        ),
      ),
      canvas,
      h('div', { class: 'map__legend' },
        ...Object.values(NODE_TYPES).map((t) => h('span', {}, h('b', { text: `${t.icon} ${t.name}` }), ` — ${t.desc}`)),
      ),
    ),

    h('div', { class: 'card' },
      h('h2', { class: 'card__title', text: `Флот · ${run.fleet.length} ${run.fleet.length === 1 ? 'корабль' : 'корабля'}` }),
      h('div', { class: 'fleet' }, run.fleet.map((ship, i) => shipCard(ship, i === 0))),
      h('p', { class: 'hint', style: { marginTop: '10px' }, text: 'Прочность не чинится сама: после победы экипаж латает 40% корпуса, после поражения — 25%. Полностью чинят только доки.' }),
    ),
  );
}

function shipCard(ship, isFlagship) {
  const c = computeStats(ship);
  const hullShare = ship.hull / Math.max(1, c.stats.hull);
  const mods = installedModules(ship).length;
  return h('div', { class: `ship-card${isFlagship ? ' ship-card--flagship' : ''}${ship.hull <= 0 ? ' ship-card--dead' : ''}` },
    h('div', { class: 'ship-card__head' },
      h('div', {},
        h('div', { class: 'ship-card__name', text: ship.name }),
        h('div', { class: 'ship-card__hull', text: `${HULLS[ship.hullKey].icon} ${HULLS[ship.hullKey].name} · ${slotList(ship).length} слотов` }),
      ),
      isFlagship ? h('span', { class: 'ship-card__flag', text: 'флагман' }) : null,
    ),
    barEl(ship.hull, c.stats.hull, hullShare > 0.35 ? 'hull' : 'foe', `прочность ${Math.round(ship.hull)} / ${Math.round(c.stats.hull)} (${pct(hullShare)})`),
    barEl(c.stats.shield, Math.max(1, c.stats.shield), 'shield', `щит ${Math.round(c.stats.shield)}`),
    h('div', { class: 'ship-card__meta' },
      h('span', { text: `модулей ${mods} / ${slotList(ship).length}` }),
      h('span', { text: `урон ${num(c.stats.damage, 1)} × ${num(c.stats.salvo)}` }),
      h('span', { text: `точность ${pct(c.stats.accuracy * 0.5, 1)}` }),
      h('span', { class: 'power', text: `мощность ${num(shipPower(ship), 1)}` }),
    ),
  );
}

/** Связи между узлами: от родителя к каждому ребёнку. */
function drawEdges(canvas, svg, run, available) {
  while (svg.firstChild) svg.removeChild(svg.firstChild);
  const base = canvas.getBoundingClientRect();
  if (!base.width) return;
  svg.setAttribute('viewBox', `0 0 ${base.width} ${base.height}`);
  const pos = new Map();
  for (const el of canvas.querySelectorAll('.node')) {
    const r = el.getBoundingClientRect();
    pos.set(el.dataset.node, {
      x: r.left - base.left + r.width / 2,
      top: r.top - base.top,
      bottom: r.bottom - base.top,
    });
  }
  for (const node of run.map.nodes) {
    const from = pos.get(node.id);
    if (!from) continue;
    for (const toId of node.edges) {
      const to = pos.get(toId);
      if (!to) continue;
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', String(from.x));
      line.setAttribute('y1', String(from.top));
      line.setAttribute('x2', String(to.x));
      line.setAttribute('y2', String(to.bottom));
      if (node.id === run.currentNode && available.has(toId)) line.setAttribute('class', 'open');
      svg.append(line);
    }
  }
}

