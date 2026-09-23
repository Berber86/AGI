// Экран «Наука»: дерево открытий и смена эпох.
import { el, btn, mount, tooltip } from '../dom.js';
import { gearSVG } from '../art.js';
import {
  DISCOVERIES, DISCOVERY_LIST, DOMAINS, GEARS, GEAR_IDS, ROMAN_ERA, S, eraOf, isAvailable, MAX_ERA,
  compatible, pairKey, KEYWORDS, GEAR_PAIRS,
} from '../shared.js';
import { app, persist, toast, render, renderTopbar } from '../app.js';
import { tryAdvanceEra } from '../era-up.js';

const filt = { gear: null, domain: null };

export function renderScience() {
  const st = app.state;
  const root = el('div', { class: 'science' });
  root.append(headPanel(st));

  const filters = el('div', { class: 'filters' });
  filters.append(el('button', { class: `fbtn${!filt.gear && !filt.domain ? ' fbtn--on' : ''}`, onclick: () => { filt.gear = null; filt.domain = null; refresh(); } }, 'все'));
  for (const g of GEAR_IDS) {
    filters.append(el('button', {
      class: `fbtn${filt.gear === g ? ' fbtn--on' : ''}`, style: { '--c': GEARS[g].color }, title: GEARS[g].name,
      onclick: () => { filt.gear = filt.gear === g ? null : g; refresh(); },
    }, el('span', { html: gearSVG(g, 18) })));
  }
  filters.append(el('span', { class: 'sep' }));
  for (const d of Object.values(DOMAINS)) {
    filters.append(el('button', {
      class: `fbtn${filt.domain === d.id ? ' fbtn--on' : ''}`, style: { '--c': d.color }, title: d.name,
      onclick: () => { filt.domain = filt.domain === d.id ? null : d.id; refresh(); },
    }, d.glyph));
  }
  root.append(filters);

  const set = new Set(st.researched);
  for (let era = 1; era <= MAX_ERA; era++) {
    const list = DISCOVERY_LIST.filter((d) => d.era === era)
      .filter((d) => !filt.gear || d.gears.includes(filt.gear))
      .filter((d) => !filt.domain || d.domain === filt.domain);
    if (!list.length) continue;
    const done = DISCOVERY_LIST.filter((d) => d.era === era && set.has(d.id)).length;
    const total = DISCOVERY_LIST.filter((d) => d.era === era).length;
    const locked = era > st.era;
    const sec = el('section', { class: `era-sec${locked ? ' era-sec--locked' : ''}` });
    const e = eraOf(era);
    sec.append(el('div', { class: 'era-sec__head' }, [
      el('h3', {}, `Эпоха ${ROMAN_ERA[era]} · ${e.name}`),
      el('div', { class: 'era-sec__stats' }, [
        el('span', {}, `лидер ${e.leaderHp} HP`),
        el('span', {}, `поле ${e.slots}`),
        el('span', {}, `колода ${e.deckSize}`),
        el('span', {}, `энергия ≤${e.energyCap}`),
        el('span', { class: 'bar bar--wide' }, el('i', { style: { width: `${(done / total) * 100}%` } })),
        el('b', {}, `${done}/${total}`),
      ]),
      locked ? el('span', { class: 'lock' }, `🔒 нужна эпоха ${ROMAN_ERA[era]}`) : null,
    ]));
    const grid = el('div', { class: 'discgrid' });
    for (const d of list) grid.append(discNode(st, d, set, locked));
    sec.append(grid);
    root.append(sec);
  }
  return root;
}

function refresh() {
  const node = document.querySelector('.screen--science');
  if (node) mount(node, renderScience());
}

function headPanel(st) {
  const r = S.eraRequirements(st);
  const chk = S.canAdvanceEra(st);
  const box = el('div', { class: 'card-panel' });
  box.append(el('div', { class: 'rp-head' }, [
    el('h3', {}, `Наука · эпоха ${ROMAN_ERA[st.era]} (${eraOf(st.era).name})`),
    el('span', { class: 'res-inline' }, `🔬 ${st.science}`),
  ]));
  if (st.era >= MAX_ERA) {
    box.append(el('p', { class: 'hint' }, 'Вы достигли последней эпохи. Изучайте оставшиеся открытия эпохи Атома — они дают самые зубастые комбинации шестерёнок.'));
    return box;
  }
  box.append(el('div', { class: 'reqs reqs--inline' }, [
    req('🔬 Наука', r.science.have, r.science.need),
    req('🚩 Регионы', r.regions.have, r.regions.need),
    req(`📜 Открытия эпохи ${st.era}`, r.discoveries.have, r.discoveries.need),
  ]));
  box.append(btn(`🏛 Сменить эпоху → ${ROMAN_ERA[r.next]} (${eraOf(r.next).name})`, () => {
    const res = tryAdvanceEra(st, { onChange: () => { persist(); render(); } });
    if (!res.ok) toast(res.reason, 'bad', 4200);
  }, chk.ok ? 'primary' : '', { disabled: !chk.ok, title: chk.ok ? '' : chk.reason }));
  return box;
}

function req(label, have, need) {
  const ok = have >= need;
  return el('div', { class: `req${ok ? ' req--ok' : ''}` }, [
    el('span', {}, label), el('b', {}, `${Math.min(have, need)}/${need}`),
    el('div', { class: 'bar' }, el('i', { style: { width: `${Math.min(100, (have / Math.max(1, need)) * 100)}%` } })),
  ]);
}

/**
 * Что открытие даёт ВПЕРЁД: какие открытия отпирает, какое свойство рождает
 * собственная пара его шестерёнок и со сколькими изученными оно сцепляется.
 * Без этого выбор исследования — слепой: игрок видит только предшественников.
 */
export function forwardInfo(st, d, set) {
  const children = DISCOVERY_LIST.filter((x) => x.prereq.includes(d.id));
  const openable = children.filter((c) => c.prereq.every((p) => set.has(p) || p === d.id));
  const links = [...set].filter((id) => id !== d.id && compatible(id, d.id)).length;

  // собственная пара шестерёнок: открытие с двумя шестернями даёт свойство
  // даже в одиночном слоте
  let ownPair = null;
  if (d.gears.length >= 2) {
    const rec = GEAR_PAIRS[pairKey(d.gears[0], d.gears[1])];
    if (rec) ownPair = { kw: KEYWORDS[rec.kw], alias: rec.alias || null };
  }
  return { children, openable, links, ownPair };
}

function discNode(st, d, set, locked) {
  const researched = set.has(d.id);
  const avail = !researched && !locked && isAvailable(d.id, set);
  const afford = st.science >= d.cost;
  const fwd = forwardInfo(st, d, set);
  const cls = ['discn'];
  if (researched) cls.push('discn--done');
  else if (avail) cls.push('discn--avail');
  else cls.push('discn--off');
  const node = el('div', { class: cls.join(' '), style: { '--c': DOMAINS[d.domain].color } }, [
    el('div', { class: 'discn__gears', html: d.gears.map((g) => gearSVG(g, 24)).join('') }),
    el('div', { class: 'discn__body' }, [
      el('div', { class: 'discn__name', text: d.name }),
      el('div', { class: 'discn__meta' }, [
        el('span', {}, `${DOMAINS[d.domain].glyph} ${DOMAINS[d.domain].name}`),
        el('span', {}, `+${d.atk}/+${d.hp}`),
      ]),
      d.prereq.length ? el('div', { class: 'discn__pre', text: `нужно: ${d.prereq.map((p) => DISCOVERIES[p]?.name || p).join(', ')}` }) : null,
      fwd.children.length ? el('div', { class: 'discn__next' }, [
        el('span', { class: 'discn__next-l', text: 'открывает' }),
        el('span', { class: 'discn__next-v', text: fwd.children.map((c) => c.name).join(', ') }),
      ]) : null,
      fwd.ownPair ? el('div', { class: 'discn__pair' }, [
        el('span', { class: 'discn__next-l', text: 'пара' }),
        el('b', {}, fwd.ownPair.alias || fwd.ownPair.kw.name),
        el('span', { class: 'dim' }, `${GEARS[d.gears[0]].name} + ${GEARS[d.gears[1]].name}`),
      ]) : null,
    ]),
    el('div', { class: 'discn__cost' }, researched
      ? el('b', { class: 'tick' }, '✓')
      : el('span', {}, [`🔬 ${d.cost}`])),
  ]);
  tooltip(node, `<b>${d.name}</b> · эпоха ${ROMAN_ERA[d.era]} · ${DOMAINS[d.domain].name}<br>
    Шестерни: ${d.gears.map((g) => GEARS[g].name).join(', ')}<br>
    Вклад в юнита: +${d.atk} атаки, +${d.hp} здоровья<br>
    Цена изучения: ${d.cost} 🔬${avail && !afford ? ' <span class="tip-bad">(не хватает ' + (d.cost - st.science) + ')</span>' : ''}<br>
    ${d.prereq.length ? 'Предшественники: ' + d.prereq.map((p) => DISCOVERIES[p]?.name).join(', ') + '<br>' : 'Предшественников нет<br>'}
    ${fwd.children.length ? '<span class="tip-ok">Открывает: ' + fwd.children.map((c) => c.name).join(', ') + '</span><br>' : ''}
    ${fwd.ownPair ? 'Своя пара шестерёнок даёт <span class="tip-kw">' + (fwd.ownPair.alias || fwd.ownPair.kw.name) + '</span>: ' + fwd.ownPair.kw.text + '<br>' : ''}
    <span class="tip-sub">Сцепляется с ${fwd.links} изученными открытиями — столько же путей в Мастерской</span>`);
  if (avail && !researched) {
    node.style.cursor = 'pointer';
    if (!afford) node.classList.add('discn--poor');
    node.addEventListener('click', () => {
      const r = S.research(st, d.id);
      if (!r.ok) { toast(r.reason, 'bad', 3200); return; }
      persist();
      toast(`🔬 «${d.name}» изучено (${d.gears.map((g) => GEARS[g].name).join('+')})`, 'ok');
      refresh();
      const tb = document.querySelector('.topbar');
      if (tb) renderTopbar(tb);
    });
  }
  return node;
}
