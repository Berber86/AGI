// Экран «Ростер»: все спроектированные юниты и их экземпляры.
import { el, btn, mount, modal, tooltip } from '../dom.js';
import { gearSVG } from '../art.js';
import { DOMAINS, GEARS, ROMAN_ERA, S, eraOf, recruitCost, blueprintCost, vetTier, VET_NAMES } from '../shared.js';
import { app, persist, toast, renderTopbar, render } from '../app.js';
import { renderCard } from '../cards.js';

const view = { sort: 'cost', filter: '', domain: null, onlyOwned: true };

export function renderRoster() {
  const st = app.state;
  const root = el('div', { class: 'roster' });

  const head = el('div', { class: 'card-panel' });
  head.append(el('div', { class: 'rp-head' }, [
    el('h3', {}, `Ростер · проектов ${Object.keys(st.blueprints).length}, юнитов ${st.roster.length}`),
    el('span', { class: 'res-inline' }, `🧱 ${st.materials}`),
  ]));
  head.append(el('div', { class: 'row' }, [
    el('input', { class: 'input input--sm', type: 'search', placeholder: 'поиск по имени…', value: view.filter, oninput: (e) => { view.filter = e.target.value.toLowerCase(); refresh(); } }),
    el('select', {
      class: 'input input--sm', onchange: (e) => { view.sort = e.target.value; refresh(); },
    }, ['cost', 'power', 'name', 'rarity', 'era'].map((k) => el('option', { value: k, selected: view.sort === k }, SORT_LABEL[k]))),
    el('label', { class: 'inline' }, [el('input', { type: 'checkbox', checked: view.onlyOwned, onchange: (e) => { view.onlyOwned = e.target.checked; refresh(); } }), 'только с юнитами']),
    btn('＋ В Мастерскую', () => { app.tab = 'forge'; render(); }),
  ]));
  const domRow = el('div', { class: 'filters' });
  domRow.append(el('button', { class: `fbtn${!view.domain ? ' fbtn--on' : ''}`, onclick: () => { view.domain = null; refresh(); } }, 'все домены'));
  for (const d of Object.values(DOMAINS)) {
    domRow.append(el('button', {
      class: `fbtn${view.domain === d.id ? ' fbtn--on' : ''}`, style: { '--c': d.color },
      onclick: () => { view.domain = view.domain === d.id ? null : d.id; refresh(); },
    }, `${d.glyph} ${d.name}`));
  }
  head.append(domRow);
  root.append(head);

  let bps = Object.values(st.blueprints);
  if (view.domain) bps = bps.filter((b) => b.domain === view.domain);
  if (view.filter) bps = bps.filter((b) => b.name.toLowerCase().includes(view.filter) || b.keywords.some((k) => k.name.toLowerCase().includes(view.filter)));
  if (view.onlyOwned) bps = bps.filter((b) => st.roster.some((u) => u.bpKey === b.key));
  bps.sort((a, b) => SORTERS[view.sort](a, b));

  const grid = el('div', { class: 'bpgrid' });
  for (const bp of bps) grid.append(bpCard(st, bp));
  if (!bps.length) grid.append(el('div', { class: 'dim' }, 'Пусто. Спроектируйте юнита в Мастерской.'));
  root.append(grid);
  return root;
}

const SORT_LABEL = { cost: 'по цене ⚡', power: 'по силе', name: 'по имени', rarity: 'по редкости', era: 'по эпохе' };
const SORTERS = {
  cost: (a, b) => a.cost - b.cost || b.atk + b.hp - (a.atk + a.hp),
  power: (a, b) => (b.atk * 1.1 + b.hp + b.keywords.length * 3) - (a.atk * 1.1 + a.hp + a.keywords.length * 3),
  name: (a, b) => a.name.localeCompare(b.name, 'ru'),
  rarity: (a, b) => b.slots - a.slots || a.cost - b.cost,
  era: (a, b) => a.era - b.era || a.cost - b.cost,
};

function bpCard(st, bp) {
  const units = st.roster.filter((u) => u.bpKey === bp.key);
  const price = recruitCost(bp, eraOf(st.era).mat);
  const node = el('div', { class: 'bpcell' }, [
    renderCard(bp, { size: 'sm', onClick: () => detailModal(st, bp, units) }),
    el('div', { class: 'bpcell__foot' }, [
      el('span', { class: 'bpcell__count', text: `×${units.length}` }),
      el('span', { class: 'bpcell__vet', text: units.some((u) => vetTier(u) > 0) ? `★${Math.max(...units.map(vetTier))}` : '' }),
      el('span', { class: 'bpcell__deck', text: units.filter((u) => st.deck.includes(u.id)).length ? 'в колоде' : '' }),
    ]),
    el('div', { class: 'row row--tight' }, [
      btn(`⚔ ${price}🧱`, () => {
        const r = S.recruit(st, bp.key, 1);
        if (!r.ok) { toast(r.reason, 'bad'); return; }
        persist(); toast(`Нанят «${bp.name}».`, 'ok');
        refresh(); const tb = document.querySelector('.topbar'); if (tb) renderTopbar(tb);
      }, 'primary sm', { disabled: st.materials < price }),
      units.length ? btn('Распустить', () => {
        S.disband(st, units[0].id); persist(); refresh();
        const tb = document.querySelector('.topbar'); if (tb) renderTopbar(tb);
      }, 'sm danger-ghost') : null,
    ]),
  ]);
  return node;
}

export function detailModal(st, bp, units) {
  const price = recruitCost(bp, eraOf(st.era).mat);
  const body = el('div', { class: 'detail' }, [
    renderCard(bp, { size: 'lg', tooltip: false }),
    el('div', { class: 'detail__side' }, [
      el('h4', {}, 'Состав'),
      el('div', { class: 'slots' }, bp.components.map((c) => el('div', { class: 'slot' }, [
        el('div', { class: 'slot__n', text: `слот ${c.slot + 1}` }),
        el('div', { class: 'slot__name', text: c.name }),
        el('div', { class: 'slot__gears', html: c.gears.map((g) => gearSVG(g, 26)).join('') }),
      ]))),
      el('h4', {}, `Экземпляры (${units.length})`),
      units.length ? el('div', { class: 'unitlist' }, units.map((u) => {
        const t = vetTier(u);
        return el('div', { class: 'unitrow' }, [
          el('span', { class: 'unitrow__name', text: `${bp.name}` }),
          el('span', { class: 'unitrow__vet', text: t ? `${VET_NAMES[t]} ★${t} (+${t}/+${t})` : VET_NAMES[0] }),
          el('span', { class: 'unitrow__xp', text: `опыт ${u.xp}, боёв ${u.battles}` }),
          el('span', { class: 'unitrow__deck', text: st.deck.includes(u.id) ? '🂠 в колоде' : '' }),
        ]);
      })) : el('div', { class: 'dim' }, 'Юнитов нет — наймите их.'),
      el('h4', {}, 'Стоимость'),
      el('div', { class: 'kv' }, [
        el('div', { class: 'kv__row' }, [el('span', {}, 'Проект'), el('b', {}, `${blueprintCost(bp)} 🧱`)]),
        el('div', { class: 'kv__row' }, [el('span', {}, 'Найм юнита'), el('b', {}, `${price} 🧱`)]),
      ]),
    ]),
  ]);
  const m = modal(bp.name, body, {
    footer: [
      btn(`⚔ Нанять 1 (${price}🧱)`, () => { const r = S.recruit(st, bp.key, 1); if (!r.ok) return toast(r.reason, 'bad'); persist(); m.close(); refresh(); }, 'primary', { disabled: st.materials < price }),
      btn(`⚔ Нанять 3 (${price * 3}🧱)`, () => { const r = S.recruit(st, bp.key, 3); if (!r.ok) return toast(r.reason, 'bad'); persist(); m.close(); refresh(); }, '', { disabled: st.materials < price * 3 }),
      btn('Закрыть', () => m.close()),
    ],
  });
}

/**
 * Разбор карты по экземпляру юнита.
 * «Колоде» и «Ростеру» нужен один и тот же модал, но входят они по-разному:
 * ростер знает чертёж и список экземпляров, колода — только юнита.
 */
export function unitDetailModal(u) {
  const st = app.state;
  const bp = u.blueprint || st.blueprints[u.bpKey];
  if (!bp) return toast('Чертёж юнита не найден', 'bad');
  return detailModal(st, bp, st.roster.filter((x) => x.bpKey === bp.key));
}

function refresh() {
  const node = document.querySelector('.screen--roster');
  if (node) mount(node, renderRoster());
}
