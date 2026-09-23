/**
 * Помощники интерфейса.
 *
 * Никакой библиотеки: элементы собираются функцией h(), числа форматируются
 * теми же функциями, что и движок (fmtNum/fmtMult), а цвета редкостей берутся
 * из RARITIES — чтобы подпись «Эталонный» в списке трофеев и на верфи была
 * одного цвета и из одного источника.
 */

import { fmtNum, fmtMult, STATS, STAT_NAME } from '../engine/stats.js';
import { rarityOf, moduleScore, moduleParts, enchantCost, enchantChance, enchantLabel, moduleTitle } from '../engine/modules.js';
import { SLOTS } from '../engine/modules.js';

/** Создать элемент. props: class, text, html, attrs, style, dataset, on{событие: fn}. */
export function h(tag, props = {}, ...children) {
  const el = document.createElement(tag);
  for (const [key, value] of Object.entries(props || {})) {
    if (value === null || value === undefined || value === false) continue;
    if (key === 'class') el.className = value;
    else if (key === 'text') el.textContent = String(value);
    else if (key === 'html') el.innerHTML = String(value);
    else if (key === 'style' && typeof value === 'object') Object.assign(el.style, value);
    else if (key === 'dataset' && typeof value === 'object') Object.assign(el.dataset, value);
    else if (key === 'on' && typeof value === 'object') {
      for (const [ev, fn] of Object.entries(value)) el.addEventListener(ev, fn);
    } else if (key in el && key !== 'list' && typeof value !== 'object') {
      try { el[key] = value; } catch { el.setAttribute(key, String(value)); }
    } else {
      el.setAttribute(key, String(value));
    }
  }
  for (const child of children.flat(4)) {
    if (child === null || child === undefined || child === false) continue;
    el.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }
  return el;
}

export function clear(node) { while (node && node.firstChild) node.removeChild(node.firstChild); }

export const num = (v, digits = 0) => fmtNum(v, digits);
export const mult = (v) => fmtMult(v);
export const pct = (v, digits = 0) => `${fmtNum(v * 100, digits)}%`;

/** Цвет и имя редкости — из данных движка. */
export function rarityOf2(m) { return rarityOf(m); }

/** Подпись уровня заточки: «+3», «−2», «без заточки». */
export function enchantBadge(m) {
  const level = m.enchant || 0;
  const cls = level > 0 ? 'module__enchant module__enchant--up' : level < 0 ? 'module__enchant module__enchant--down' : 'module__enchant';
  return h('span', { class: cls, text: enchantLabel ? enchantLabel(m) : (level > 0 ? `+${level}` : String(level)) });
}

/** Одна строка аффикса: бонус зелёным, штраф красным, название характеристики русским. */
export function affixEl(a) {
  const cls = a.role === 'penalty' ? 'affix affix--penalty' : 'affix affix--bonus';
  const value = a.kind === 'mult' ? mult(a.value) : `${a.value > 0 ? '+' : '−'}${num(Math.abs(a.value), 2)}`;
  return h('li', { class: cls },
    h('span', { class: 'affix__stat', text: STAT_NAME(a.key) || a.key }),
    h('span', { text: value }),
  );
}

/**
 * Карточка модуля — один и тот же вид в трофеях, в трюме и на верфи.
 *
 * @param {object} m модуль
 * @param {object} opts { selectable, picked, burned, meta, onPick, actions }
 */
export function moduleEl(m, opts = {}) {
  const r = rarityOf(m);
  const cls = ['module'];
  if (opts.selectable) cls.push('module--selectable');
  if (opts.picked) cls.push('module--picked');
  if (opts.burned) cls.push('module--burned');

  const head = h('div', { class: 'module__head' },
    h('span', { class: 'module__name', text: m.name }),
    h('span', { class: 'module__slot', text: `${SLOTS[m.slot] ? SLOTS[m.slot].icon : ''} ${SLOTS[m.slot] ? SLOTS[m.slot].name : m.slot}` }),
  );

  const sub = h('div', { class: 'row row--tight row--between' },
    h('span', { class: 'module__rarity', style: { color: r.color }, text: r.name }),
    enchantBadge(m),
  );

  const affixes = h('ul', { class: 'affixes' }, (m.affixes || []).map(affixEl));

  const children = [head, sub, affixes];

  if (m.special) {
    children.push(h('div', {
      class: `module__special ${m.special.good ? 'module__special--good' : 'module__special--bad'}`,
    }, h('b', { text: `${m.special.name}: ` }), m.special.text));
  }

  const meta = [];
  if (opts.meta) meta.push(opts.meta);
  meta.push(`счёт ${num(moduleScore(m), 2)} · на запчасти ${moduleParts(m)}`);
  children.push(h('div', { class: 'module__meta', text: meta.join(' · ') }));

  const el = h('div', {
    class: cls.join(' '),
    style: { borderLeftColor: r.color },
    title: moduleTitle ? moduleTitle(m) : m.name,
  }, children);

  if (opts.selectable) {
    el.setAttribute('role', 'button');
    el.setAttribute('tabindex', '0');
    el.setAttribute('aria-pressed', opts.picked ? 'true' : 'false');
    el.addEventListener('click', () => opts.onPick && opts.onPick(m));
    el.addEventListener('keydown', (ev) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); opts.onPick && opts.onPick(m); } });
  }
  if (opts.actions && opts.actions.length) {
    el.append(h('div', { class: 'row row--tight', style: { marginTop: '8px' } }, opts.actions));
  }
  return el;
}

/**
 * Следующий кадр перед отрисовкой.
 *
 * Интерфейсу он нужен, чтобы измерить уже вставленные узлы (рёбра карты,
 * прокрутка журнала). В браузере это requestAnimationFrame; вне его — обычная
 * отложенная задача, иначе экран упал бы из-за отсутствующего глобала.
 */
export function nextFrame(fn) {
  if (typeof requestAnimationFrame === 'function') { requestAnimationFrame(fn); return; }
  if (typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function') {
    window.requestAnimationFrame(fn);
    return;
  }
  setTimeout(() => fn(Date.now()), 0);
}

/** Полоса прочности или щита. */
export function barEl(current, max, kind = 'hull', label) {
  const share = max > 0 ? Math.max(0, Math.min(1, current / max)) : 0;
  return h('div', { class: 'bar' },
    h('div', { class: `bar__fill bar__fill--${kind}`, style: { width: `${(share * 100).toFixed(1)}%` } }),
    h('span', { class: 'bar__text', text: label || `${Math.round(current)} / ${Math.round(max)}` }),
  );
}

/** Строка шанса с формулой: название, цепочка множителей, итог. */
export function chanceRow(name, chance) {
  const cls = chance.clamped ? 'chance chance--clamped' : 'chance';
  return h('div', { class: cls },
    h('span', { class: 'chance__name', text: name }),
    h('span', { class: 'chance__formula', text: chance.formula }),
    h('span', { class: 'chance__value', text: pct(chance.p, 1) }),
  );
}

/**
 * Таблица характеристик с цепочкой множителей.
 *
 * Цепочка — главное требование к игре: несколько модулей на одну характеристику
 * ПЕРЕМНОЖАЮТСЯ, и это должно быть видно глазами, а не «где-то в коде». Поэтому
 * каждый множитель показан отдельным цветом (× усиливает, ÷ ослабляет) и
 * подписан именем модуля, который его принёс. Плоские добавки и итог стоят тут
 * же, чтобы строка читалась как равенство: база ×1,36 (Око) ÷1,18 (Кривой
 * ствол) = 57,96.
 *
 * @param {object} computed результат computeStats с цепочками (не { plain: true })
 * @param {object} opts { chains, keys, baseOf(stat), explain(stat) }
 */
export function statsTable(computed, { chains = true, keys = null, baseOf = null, explain = null } = {}) {
  const list = keys || Object.keys(STATS);

  // Слагаемое без множителя — это округление или предел («выстрелы целые:
  // 2,43 → 2»). Оно объясняет, почему итог не равен произведению множителей.
  const term = (t) => (t.mult === null || t.mult === undefined
    ? h('span', { class: 'chain__term chain__term--limit', title: t.text || '' },
      h('i', { class: 'chain__note', text: t.text || t.label || '' }))
    : h('span', {
      class: `chain__term ${t.mult >= 1 ? 'chain__term--up' : 'chain__term--down'}`,
      title: t.note ? `${t.label || ''}: ${t.note}` : (t.label || ''),
    },
    h('b', { text: mult(t.mult) }),
    t.label ? h('i', { class: 'chain__label', text: t.label }) : null,
    t.note ? h('i', { class: 'chain__note', text: t.note }) : null));

  const body = list.map((k) => {
    const st = STATS[k];
    const value = computed.stats[k];
    const shown = st.percent ? pct(value, 1) : num(value, 2);
    const terms = (chains && computed.chain && computed.chain[k]) || [];
    const add = (chains && computed.adds && computed.adds[k]) || 0;
    const base = baseOf ? baseOf(k) : (st.base ?? null);

    const cell = h('td', { class: 'chain' });
    if (!terms.length && !add) {
      cell.append(h('span', { class: 'chain__plain', text: base === null ? 'модули не трогают' : `база ${num(base, 2)} — модули не трогают` }));
    } else {
      if (base !== null) cell.append(h('span', { class: 'chain__base', text: `база ${num(base, 2)}` }));
      for (const t of terms) cell.append(term(t));
      if (add) {
        cell.append(h('span', { class: `chain__term ${add > 0 ? 'chain__term--up' : 'chain__term--down'}`, title: 'плоская добавка: не умножается, прибавляется в конце' },
          h('b', { text: `${add > 0 ? '+' : '−'}${Math.abs(add).toFixed(2)}` }),
          h('i', { class: 'chain__label', text: 'плоская добавка' })));
      }
      cell.append(h('span', { class: 'chain__eq', text: `= ${shown}` }));
    }

    return h('tr', { class: st.core ? 'core' : '' },
      h('th', { scope: 'row', text: st.name, title: explain ? explain(k) : null }),
      h('td', { class: 'value', text: shown }),
      chains ? cell : null,
    );
  });

  const head = h('tr', {},
    h('th', { text: 'Характеристика' }),
    h('th', { text: 'Итог', style: { textAlign: 'right' } }),
    chains ? h('th', { text: 'Как сложилось (множители перемножаются)' }) : null,
  );
  return h('table', { class: 'stats-table' }, h('thead', {}, head), h('tbody', {}, body));
}

/** Цена и шанс заточки одной строкой. */
export function enchantInfo(m) {
  return `заточка ${enchantCost(m)} запчастей, шанс ${pct(enchantChance(m))}`;
}

export { STATS, STAT_NAME };
