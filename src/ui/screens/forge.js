// Экран «Мастерская»: здесь юниты рождаются из совместимости открытий.
// Слева — слоты и доступные открытия, справа — живая карточка результата.
import { el, btn, mount, modal, tooltip } from '../dom.js';
import { gearSVG } from '../art.js';
import {
  DISCOVERIES, DOMAINS, GEARS, GEAR_IDS, GEAR_PAIRS, RARITIES, KEYWORDS, eraOf,
  ROMAN_ERA, S, compatible, checkCombination, generateCard, pairKey, blueprintCost, recruitCost,
} from '../shared.js';
import { app, persist, toast } from '../app.js';
import { renderForgePreview } from '../cards.js';
import { makeRng } from '../../engine/rng.js';

const forge = { slots: 2, picked: [], filterGear: null, filterDomain: null, filterEra: 0, query: '' };

export function renderForge() {
  const st = app.state;
  const root = el('div', { class: 'forge' });

  const left = el('div', { class: 'forge__left' });
  left.append(slotRack(st));
  left.append(picker(st));
  const right = el('div', { class: 'forge__right' });
  right.append(preview(st));

  root.append(left, right);
  return root;
}

function refreshForge() {
  const node = document.querySelector('.screen--forge');
  if (node) mount(node, renderForge());
}

// -----------------------------------------------------------------------------
function slotRack(st) {
  const box = el('div', { class: 'rack' });
  const rar = RARITIES[forge.slots];
  box.append(el('div', { class: 'rack__head' }, [
    el('h3', {}, 'Станок'),
    el('div', { class: 'rack__rarity' }, [1, 2, 3, 4].map((n) => {
      const r = RARITIES[n];
      return el('button', {
        class: `rarbtn${forge.slots === n ? ' rarbtn--on' : ''}`,
        style: { '--c': r.color },
        onclick: () => { forge.slots = n; forge.picked = forge.picked.slice(0, n); refreshForge(); },
        title: `${r.name}: ${n} слот(ов), свойств до ${r.kwCap}`,
      }, `${n}`);
    })),
  ]));
  box.append(el('div', { class: 'rack__hint' }, [
    el('b', { style: { color: rar.color }, text: rar.name }),
    el('span', {}, ` · ${forge.slots} слот(а) · до ${rar.kwCap + (currentPurity() === 'chimera' ? 1 : 0)} свойств`),
  ]));

  const slots = el('div', { class: 'slots slots--rack' });
  for (let i = 0; i < forge.slots; i++) {
    const id = forge.picked[i];
    const d = id ? DISCOVERIES[id] : null;
    const cell = el('button', {
      class: `slotcell${d ? ' slotcell--on' : ''}`,
      onclick: () => { forge.picked[i] = null; forge.picked = forge.picked.filter(Boolean); refreshForge(); },
    }, d ? [
      el('div', { class: 'slotcell__n', text: `слот ${i + 1}` }),
      el('div', { class: 'slotcell__gears', html: d.gears.map((g) => gearSVG(g, 30)).join('') }),
      el('div', { class: 'slotcell__name', text: d.name }),
      el('div', { class: 'slotcell__meta', text: `+${d.atk}/+${d.hp} · ${ROMAN_ERA[d.era]} · ${DOMAINS[d.domain].name}` }),
      el('div', { class: 'slotcell__x', text: '✕' }),
    ] : [
      el('div', { class: 'slotcell__n', text: `слот ${i + 1}` }),
      el('div', { class: 'slotcell__empty', text: '⚙' }),
      el('div', { class: 'slotcell__meta', text: 'выберите открытие' }),
    ]);
    if (!d) cell.disabled = true;
    slots.append(cell);
  }
  box.append(slots);

  // пары шестерёнок текущего набора
  const bp = currentBlueprint();
  const pairs = pairList(bp);
  box.append(el('div', { class: 'rack__pairs' }, [
    el('h4', {}, 'Сцепление шестерёнок'),
    pairs.length
      ? el('div', { class: 'pairlist' }, pairs.map((p) => el('div', { class: `pairrow${p.active ? ' pairrow--on' : ''}` }, [
        el('span', { class: 'pairrow__g', html: gearSVG(p.a, 20) + gearSVG(p.b, 20) }),
        el('span', { class: 'pairrow__n', text: `${GEARS[p.a].name} + ${GEARS[p.b].name}` }),
        el('span', { class: 'pairrow__r', text: p.kw ? `→ ${p.kw.name}` : '→ нет свойства' }),
      ])))
      : el('div', { class: 'dim small' }, 'Положите в слоты хотя бы два открытия — пары шестерёнок дадут свойства.'),
  ]));

  box.append(el('div', { class: 'row' }, [
    btn('🎲 Случайный набор', () => { randomPick(st); refreshForge(); }),
    btn('∅ Очистить', () => { forge.picked = []; refreshForge(); }),
    btn('📖 Матрица шестерёнок', () => matrixModal()),
  ]));
  return box;
}

function currentPurity() {
  const bp = currentBlueprint();
  return bp ? bp.purity : 'mixed';
}

/**
 * generateCard дёргается на каждую перерисовку по нескольку раз (чистота линии,
 * список пар, предпросмотр), поэтому результат кэшируем по набору открытий.
 */
let bpCache = null;
function currentBlueprint() {
  const ids = forge.picked.filter(Boolean);
  if (!ids.length) { bpCache = null; return null; }
  const key = ids.join('|');
  if (bpCache && bpCache.key === key) return bpCache.value;
  const value = generateCard(ids);
  bpCache = { key, value };
  return value;
}

/**
 * Какие пары шестерёнок добавит открытие, если положить его в следующий слот.
 * Это главная информация в Мастерской: игрок выбирает не «+2/+3», а свойство.
 */
export function addedKeywords(ids, cand) {
  const d = DISCOVERIES[cand];
  if (!d) return [];
  const have = [];
  for (const id of ids) have.push(...(DISCOVERIES[id]?.gears || []));
  const seen = new Set();
  const out = [];
  for (const g of d.gears) {
    // пары новой шестерни с уже лежащими в станке
    for (const h of have) {
      const rec = GEAR_PAIRS[pairKey(g, h)];
      if (!rec) continue;
      const kw = KEYWORDS[rec.kw];
      if (!kw || seen.has(kw.kw)) continue;
      seen.add(kw.kw);
      out.push({ name: rec.alias || kw.name, kw, from: `${GEARS[g].name} + ${GEARS[h].name}` });
    }
    // пара внутри самого открытия (две его шестерни)
    for (const g2 of d.gears) {
      if (g2 === g) continue;
      const rec = GEAR_PAIRS[pairKey(g, g2)];
      if (!rec) continue;
      const kw = KEYWORDS[rec.kw];
      if (!kw || seen.has(kw.kw)) continue;
      seen.add(kw.kw);
      out.push({ name: rec.alias || kw.name, kw, from: `внутри «${d.name}»` });
    }
  }
  return out;
}

function pairList(bp) {
  const ids = forge.picked.filter(Boolean);
  if (!bp) return [];
  const counts = bp.gearCounts || {};
  const gs = Object.keys(counts);
  const out = [];
  const active = new Set(bp.keywords.map((k) => k.from));
  for (let i = 0; i < gs.length; i++) {
    for (let j = i; j < gs.length; j++) {
      const a = gs[i], b = gs[j];
      if (a === b && counts[a] < 2) continue;
      const key = pairKey(a, b);
      const rec = GEAR_PAIRS[key];
      out.push({ a, b, kw: rec ? KEYWORDS[rec.kw] : null, active: active.has(key) });
    }
  }
  return out.sort((x, y) => (y.active - x.active) || (y.kw?.priority || 0) - (x.kw?.priority || 0));
}

// -----------------------------------------------------------------------------
function picker(st) {
  const box = el('div', { class: 'picker' });
  box.append(el('div', { class: 'picker__head' }, [
    el('h3', {}, `Изученные открытия (${st.researched.length})`),
    el('input', {
      class: 'input input--sm', type: 'search', placeholder: 'поиск…', value: forge.query,
      oninput: (e) => { forge.query = e.target.value.toLowerCase(); refreshForge(); },
    }),
  ]));

  const filters = el('div', { class: 'filters' });
  filters.append(el('button', {
    class: `fbtn${!forge.filterGear ? ' fbtn--on' : ''}`, onclick: () => { forge.filterGear = null; refreshForge(); },
  }, 'все'));
  for (const g of GEAR_IDS) {
    filters.append(el('button', {
      class: `fbtn${forge.filterGear === g ? ' fbtn--on' : ''}`,
      style: { '--c': GEARS[g].color },
      onclick: () => { forge.filterGear = forge.filterGear === g ? null : g; refreshForge(); },
      title: GEARS[g].name,
    }, el('span', { html: gearSVG(g, 18) })));
  }
  filters.append(el('span', { class: 'sep' }));
  for (const d of Object.values(DOMAINS)) {
    filters.append(el('button', {
      class: `fbtn${forge.filterDomain === d.id ? ' fbtn--on' : ''}`, style: { '--c': d.color },
      onclick: () => { forge.filterDomain = forge.filterDomain === d.id ? null : d.id; refreshForge(); },
      title: d.name,
    }, d.glyph));
  }
  box.append(filters);

  const list = el('div', { class: 'disclist' });
  const ids = forge.picked.filter(Boolean);
  const byEra = {};
  for (const id of st.researched) {
    const d = DISCOVERIES[id];
    if (!d) continue;
    if (forge.filterGear && !d.gears.includes(forge.filterGear)) continue;
    if (forge.filterDomain && d.domain !== forge.filterDomain) continue;
    if (forge.query && !d.name.toLowerCase().includes(forge.query) && !d.gears.some((g) => GEARS[g].name.toLowerCase().includes(forge.query))) continue;
    (byEra[d.era] ||= []).push(d);
  }
  let shown = 0;
  for (const era of Object.keys(byEra).map(Number).sort((a, b) => b - a)) {
    list.append(el('div', { class: 'discera', text: `Эпоха ${ROMAN_ERA[era]}` }));
    const row = el('div', { class: 'discrow' });
    for (const d of byEra[era].sort((a, b) => b.atk + b.hp - (a.atk + a.hp))) {
      row.append(discChip(d, ids));
      shown++;
    }
    list.append(row);
  }
  if (!shown) list.append(el('div', { class: 'dim' }, 'Ничего не найдено. Изучите новые открытия во вкладке «Наука».'));
  box.append(list);
  return box;
}

function discChip(d, ids) {
  const full = ids.length >= forge.slots;
  const alreadyIn = ids.includes(d.id) && ids.filter((x) => x === d.id).length >= 2;
  const fits = ids.length === 0 || ids.every((x) => compatible(x, d.id));
  const comboOk = !full && !alreadyIn && fits && checkCombination([...ids, d.id]).ok;
  const adds = comboOk ? addedKeywords(ids, d.id) : [];
  const node = el('div', {
    class: `disc${comboOk ? ' disc--ok' : ' disc--no'}${ids.includes(d.id) ? ' disc--in' : ''}`,
    style: { '--c': DOMAINS[d.domain].color },
    onclick: () => {
      if (alreadyIn || full) { toast(full ? 'Все слоты заняты — уберите одно открытие.' : 'Одно открытие можно поставить не более чем в два слота.', 'bad'); return; }
      if (!comboOk) { toast(checkCombination([...ids, d.id]).reason || 'Не сцепляется с текущим набором.', 'bad', 3600); return; }
      forge.picked.push(d.id);
      refreshForge();
    },
  }, [
    el('div', { class: 'disc__gears', html: d.gears.map((g) => gearSVG(g, 22)).join('') }),
    el('div', { class: 'disc__name', text: d.name }),
    el('div', { class: 'disc__meta', text: `+${d.atk}/+${d.hp}` }),
    adds.length ? el('div', { class: 'disc__adds', text: adds.slice(0, 2).map((a) => a.name).join(' · ') }) : null,
    el('div', { class: 'disc__dom', text: DOMAINS[d.domain].glyph }),
  ]);
  tooltip(node, `<b>${d.name}</b> · эпоха ${ROMAN_ERA[d.era]} · ${DOMAINS[d.domain].name}<br>
    Шестерни: ${d.gears.map((g) => `${GEARS[g].name}`).join(', ')}<br>
    Вклад в юнита: +${d.atk} атаки, +${d.hp} здоровья<br>
    ${ids.length ? (comboOk ? '<span class="tip-ok">Сцепляется с набором ✓</span>' : '<span class="tip-bad">Не сцепляется: нет общей шестерни, домена или преемственности</span>') : ''}
    ${adds.length ? '<br><span class="tip-kw">Добавит свойства: ' + adds.map((a) => `${a.name} (${a.from})`).join(', ') + '</span>' : ''}
    ${ids.length === 0 ? '<br><span class="tip-sub">Первое открытие в станке: свойства появятся со вторым</span>' : ''}`);
  return node;
}

// -----------------------------------------------------------------------------
function preview(st) {
  const box = el('div', { class: 'forge__preview' });
  const ids = forge.picked.filter(Boolean);
  const bp = currentBlueprint();

  if (!bp) {
    box.append(el('div', { class: 'empty-preview' }, [
      el('div', { class: 'empty-preview__gear', html: gearSVG('mech', 90, { letter: false }) }),
      el('h3', {}, 'Станок пуст'),
      el('p', { class: 'hint' }, 'Выберите редкость (число слотов) и положите в слоты изученные открытия. Карта соберётся сама: характеристики — из вклада открытий, свойства — из всех пар шестерёнок.'),
      el('div', { class: 'rules-mini' }, [
        el('div', {}, '1 слот → Обычная · до 1 свойства'),
        el('div', {}, '2 слота → Необычная · до 2 свойств'),
        el('div', {}, '3 слота → Редкая · до 3 свойств'),
        el('div', {}, '4 слота → Мифическая · до 4 свойств'),
        el('div', {}, 'Химера (3+ домена) → +1 свойство, −10% характеристик'),
        el('div', {}, 'Чистая линия (1 домен) → +8% характеристик'),
      ]),
    ]));
    return box;
  }

  box.append(renderForgePreview(bp));

  const existing = st.blueprints[bp.key];
  const cost = blueprintCost(bp);
  const recruit = recruitCost(bp, eraOf(st.era).mat);
  const owned = existing ? st.roster.filter((u) => u.bpKey === bp.key).length : 0;

  const actions = el('div', { class: 'forge__actions' });
  if (!existing) {
    const canAfford = st.materials >= cost;
    actions.append(btn(`🛠 Спроектировать за ${cost} 🧱`, () => {
      const r = S.craft(st, ids);
      if (!r.ok) { toast(r.reason, 'bad', 3600); return; }
      persist(); toast(`Проект «${bp.name}» создан!`, 'ok'); refreshForge();
    }, 'primary', { disabled: !canAfford, title: canAfford ? '' : `Нужно ${cost} материалов, у вас ${st.materials}` }));
  } else {
    actions.append(el('div', { class: 'ok' }, `✓ Проект уже в мастерской. Юнитов в ростере: ${owned}.`));
  }
  if (existing) {
    actions.append(el('div', { class: 'row' }, [
      btn(`⚔ Нанять 1 за ${recruit} 🧱`, () => doRecruit(st, bp.key, 1), 'primary', { disabled: st.materials < recruit }),
      btn(`⚔ Нанять 3 за ${recruit * 3} 🧱`, () => doRecruit(st, bp.key, 3), '', { disabled: st.materials < recruit }),
      btn('＋ В колоду', () => {
        const r = S.recruit(st, bp.key, 1);
        if (!r.ok) { toast(r.reason, 'bad'); return; }
        const lim = S.deckLimits(st);
        if (st.deck.length < lim.max) { st.deck.push(r.units[0].id); persist(); toast(`«${bp.name}» добавлен в колоду (${st.deck.length}/${lim.max}).`, 'ok'); }
        else toast(`Колода полна (${lim.max}). Уберите кого-нибудь во вкладке «Колода».`, 'bad');
        refreshForge();
      }),
    ]));
  }
  actions.append(el('div', { class: 'small dim' }, `Материалы: ${st.materials}. Стоимость найма растёт с эпохой (×${eraOf(st.era).mat}).`));
  box.append(actions);
  return box;
}

function doRecruit(st, key, n) {
  const r = S.recruit(st, key, n);
  if (!r.ok) { toast(r.reason, 'bad'); return; }
  persist();
  toast(`Нанято ${r.units.length} × «${r.units[0].blueprint.name}».`, 'ok');
  refreshForge();
}

function randomPick(st) {
  const rng = makeRng(Math.random() * 1e9);
  forge.picked = [];
  const ids = st.researched.slice();
  let guard = 0;
  while (forge.picked.length < forge.slots && guard++ < 200) {
    const cand = ids.filter((id) => DISCOVERIES[id].era <= st.era
      && forge.picked.filter((x) => x === id).length < 2
      && forge.picked.every((x) => compatible(x, id)));
    if (!cand.length) break;
    forge.picked.push(rng.pick(cand));
  }
  if (!forge.picked.length) forge.picked = [rng.pick(ids)];
}

// -----------------------------------------------------------------------------
function matrixModal() {
  const gs = GEAR_IDS;
  const table = el('table', { class: 'matrix' });
  const head = el('tr', {}, [el('th', {}, '⚙')].concat(gs.map((g) => el('th', { style: { color: GEARS[g].color }, html: gearSVG(g, 20, { letter: false }), title: GEARS[g].name }))));
  table.append(head);
  for (const a of gs) {
    const row = el('tr', {}, [el('th', { style: { color: GEARS[a].color }, html: gearSVG(a, 20, { letter: false }), title: GEARS[a].name })]);
    for (const b of gs) {
      const rec = GEAR_PAIRS[pairKey(a, b)];
      const kw = rec ? KEYWORDS[rec.kw] : null;
      const cell = el('td', {
        class: kw ? 'mx mx--on' : 'mx',
        style: kw ? { '--c': GEARS[a].color } : {},
        text: kw ? (rec.alias || kw.name) : '·',
      });
      if (kw) tooltip(cell, `<b>${rec.alias || kw.name}</b> = ${GEARS[a].name} + ${GEARS[b].name}<br>${kw.text}`);
      row.append(cell);
    }
    table.append(row);
  }
  modal('Матрица совместимости шестерёнок', el('div', {}, [
    el('p', { class: 'hint' }, 'Каждая пара шестерёнок внутри юнита даёт свойство. Если одно и то же свойство получилось дважды — оно усиливается (Броня I → Броня II). Редкость карты ограничивает число свойств: 1 / 2 / 3 / 4 для обычной / необычной / редкой / мифической.'),
    el('div', { class: 'matrix-wrap' }, table),
  ]));
}

export { forge };
