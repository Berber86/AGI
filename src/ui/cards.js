// =============================================================================
//  ШЕСТЕРНИ ЭПОХ — ui/cards.js
//  Компонент карты. Один и тот же рендер для проекта, юнита ростера и боевой
//  единицы — отличаются только наложенным состоянием (урон, истощение, статусы).
// =============================================================================

import { el, tooltip } from './dom.js';
import { gearSVG, sigilSVG, darken, lighten } from './art.js';
import { GEARS, DOMAINS, RARITIES } from '../engine/gears.js';
import { vetTier, VET_NAMES } from '../engine/units.js';

export const ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI'];

/** Приводит сущность (проект / юнит ростера / боевая единица) к общему виду. */
export function cardView(x) {
  const bp = x.blueprint || x;
  const isBattle = !!x.uid;
  return {
    isBattle,
    name: bp.name,
    atk: isBattle ? x.atk + (x.counters?.atk || 0) : bp.atk + (x.id ? vetTier(x) : 0),
    hp: isBattle ? x.hp + (x.counters?.hp || 0) : bp.hp + (x.id ? vetTier(x) : 0),
    damage: isBattle ? x.damage : 0,
    cost: bp.cost,
    era: bp.era,
    domain: bp.domain,
    rarity: bp.rarity,
    rarityName: bp.rarityName || RARITIES[bp.slots || 1].name,
    rarityColor: bp.rarityColor || RARITIES[bp.slots || 1].color,
    archetype: bp.archetype,
    slots: bp.slots || bp.components?.length || 1,
    keywords: bp.keywords || [],
    gearCounts: bp.gearCounts || {},
    components: bp.components || [],
    blurb: bp.blurb || '',
    unused: bp.unusedKeywords || [],
    vet: x.id ? vetTier(x) : (isBattle ? x.lvl || 0 : 0),
    key: bp.key,
    purity: bp.purity,
    state: isBattle ? {
      exhausted: x.exhausted, sick: x.sick, burning: x.burning, poisoned: x.poisoned,
      token: x.token, dead: x.dead, regen: x.fx?.regenerate && !x.regenUsed,
      indestr: x.fx?.indestructible, armor: x.fx?.armor || 0,
    } : null,
  };
}

const KW_SHORT = {
  haste: 'РВ', vigilance: 'БД', armor: 'БР', pierce: 'ПР', firstStrike: '1У', doubleStrike: '2У',
  trample: 'ТП', lifelink: 'ЖО', deathtouch: 'СК', siege: 'ОС', reach: 'ЗХ', thorns: 'ШП',
  indestructible: 'НС', shroud: 'ПО', tactician: 'СТ', frenzy: 'НЯ', zeal: 'ФН', overload: 'ПГ',
  bulwark: 'БС', bond: 'СВ', terror: 'УЖ', growth: 'РС', regenerate: 'РГ',
};

function kwChip(kw, tiny = false) {
  const lvl = (kw.lvl || 1) > 1 ? ` ${ROMAN[Math.min(6, kw.lvl)]}` : '';
  const short = KW_SHORT[kw.fx] || (kw.name || '').slice(0, 2).toUpperCase();
  const node = el('span', {
    class: `kw kw--${kw.fx || kw.kw}${tiny ? ' kw--tiny' : ''}`,
    text: tiny ? `${short}${(kw.lvl || 1) > 1 ? kw.lvl : ''}` : `${kw.name}${lvl}`,
  });
  tooltip(node, `<b>${kw.name}${lvl}</b><br><span class="tip-from">${kw.from ? kw.from.split('+').map((g) => GEARS[g]?.name || g).join(' + ') : ''}</span><br>${kw.text || ''}`);
  return node;
}

function gearRow(gearCounts, size = 22, max = 8) {
  const ids = Object.keys(gearCounts || {});
  const box = el('div', { class: 'gears' });
  let shown = 0;
  for (const gid of ids) {
    const n = gearCounts[gid];
    for (let i = 0; i < n && shown < max; i++, shown++) {
      box.insertAdjacentHTML('beforeend', gearSVG(gid, size, { w: size, h: size }));
    }
  }
  return box;
}

/**
 * @param {object} entity — проект / юнит / боевая единица
 * @param {object} o — { size, onClick, selected, playable, dim, showKeywords, states, classes }
 */
export function renderCard(entity, o = {}) {
  const v = cardView(entity);
  const size = o.size || 'md';
  const dom = DOMAINS[v.domain] || DOMAINS.craft;
  const cls = ['card', `card--${size}`, `rarity-${v.rarity || 'common'}`];
  if (o.selected) cls.push('is-selected');
  if (o.playable) cls.push('is-playable');
  if (o.dim) cls.push('is-dim');
  if (o.classes) cls.push(...[].concat(o.classes));
  if (v.state?.exhausted) cls.push('is-exhausted');
  if (v.state?.sick) cls.push('is-sick');
  if (o.attacking) cls.push('is-attacking');
  if (o.blocking) cls.push('is-blocking');
  if (o.targetable) cls.push('is-targetable');

  const costNode = el('div', { class: 'card__cost' }, [el('b', {}, String(v.cost)), el('span', { class: 'card__cost-glyph' }, '⚡')]);
  const hpShown = v.hp - (v.damage || 0);
  const statsNode = el('div', { class: 'card__stats' }, [
    el('b', { class: 'atk' }, String(v.atk)),
    el('span', {}, '/'),
    el('b', { class: `hp${v.damage ? ' hp--hurt' : ''}` }, String(Math.max(0, hpShown))),
    v.damage ? el('i', { class: 'hpmax' }, `/${v.hp}`) : null,
  ]);

  const children = [];

  if (size !== 'xs') {
    children.push(el('div', { class: 'card__head' }, [
      costNode,
      el('div', { class: 'card__name', text: v.name }),
    ]));
    const art = el('div', { class: 'card__art', html: sigilSVG(entity.blueprint || entity, size === 'lg' ? 200 : size === 'md' ? 150 : 110) });
    if (v.vet > 0) art.append(el('div', { class: 'card__vet', text: '★'.repeat(v.vet), title: `${VET_NAMES[v.vet]}: +${v.vet}/+${v.vet} навсегда` }));
    art.append(el('div', { class: 'card__rarity', style: { background: v.rarityColor }, text: ROMAN[v.slots] || 'I' }));
    children.push(art);
    children.push(el('div', { class: 'card__gears' }, gearRow(v.gearCounts, size === 'lg' ? 26 : size === 'md' ? 21 : 17)));
  } else {
    children.push(el('div', { class: 'card__xs-top' }, [costNode, el('div', { class: 'card__name', text: v.name })]));
    children.push(el('div', { class: 'card__gears card__gears--xs' }, gearRow(v.gearCounts, 13)));
  }

  if (o.showKeywords !== false && v.keywords.length) {
    children.push(el('div', { class: 'card__kws' }, v.keywords.map((k) => kwChip(k, size === 'xs' || size === 'sm'))));
  }

  if (v.state) {
    const pips = [];
    if (v.state.armor) pips.push(el('span', { class: 'pip pip--armor', text: `🛡${v.state.armor}` }));
    if (v.state.burning) pips.push(el('span', { class: 'pip pip--burn', text: `🔥${v.state.burning}` }));
    if (v.state.poisoned) pips.push(el('span', { class: 'pip pip--poison', text: `☠${v.state.poisoned}` }));
    if (v.state.regen) pips.push(el('span', { class: 'pip pip--regen', text: '🌿' }));
    if (v.state.indestr) pips.push(el('span', { class: 'pip pip--ind', text: '⛨' }));
    if (v.state.exhausted) pips.push(el('span', { class: 'pip pip--tap', text: '💤' }));
    if (v.state.sick) pips.push(el('span', { class: 'pip pip--sick', text: '⏳' }));
    if (pips.length) children.push(el('div', { class: 'card__pips' }, pips));
  }

  children.push(el('div', { class: 'card__foot' }, [
    el('div', { class: 'card__meta' }, [
      el('span', { class: 'card__era', text: ROMAN[v.era] || v.era }),
      el('span', { class: 'card__dom', style: { color: dom.color }, text: `${dom.glyph} ${v.archetype || dom.archetype}` }),
    ]),
    statsNode,
  ]));

  const node = el('div', { class: cls.join(' '), dataset: o.dataset || {} }, children);
  node.style.setProperty('--dom', dom.color);
  node.style.setProperty('--rarity', v.rarityColor);
  if (o.onClick) node.addEventListener('click', o.onClick);
  if (o.title) node.title = o.title;
  if (size === 'lg' || o.tooltip !== false) {
    tooltip(node, `<b>${v.name}</b> · ${v.rarityName} · ${ROMAN[v.era]} эпоха<br>
      <span class="tip-sub">${dom.name} / ${v.archetype}${v.purity === 'pure' ? ' · Чистая линия' : v.purity === 'chimera' ? ' · Химера' : ''}</span><br>
      ${v.components.length ? 'Слоты: ' + v.components.map((c) => c.name).join(' · ') + '<br>' : ''}
      ${v.keywords.map((k) => `<span class="tip-kw">${k.name}${(k.lvl || 1) > 1 ? ' ' + ROMAN[Math.min(6, k.lvl)] : ''}</span> — ${k.text}`).join('<br>') || 'Свойств нет.'}`);
  }
  return node;
}

/** Крупная карточка-предпросмотр в мастерской: слоты, пары шестерёнок, спящие свойства. */
export function renderForgePreview(bp) {
  const v = cardView(bp);
  const dom = DOMAINS[v.domain];
  const root = el('div', { class: 'preview' });
  root.append(renderCard(bp, { size: 'lg', showKeywords: true, tooltip: false }));

  const detail = el('div', { class: 'preview__detail' });
  detail.append(el('h4', {}, 'Слоты и шестерни'));
  const slotBox = el('div', { class: 'slots' });
  for (const c of bp.components) {
    slotBox.append(el('div', { class: 'slot' }, [
      el('div', { class: 'slot__n', text: `слот ${c.slot + 1}` }),
      el('div', { class: 'slot__name', text: c.name }),
      el('div', { class: 'slot__gears', html: c.gears.map((g) => gearSVG(g, 26)).join('') }),
    ]));
  }
  detail.append(slotBox);

  detail.append(el('h4', {}, `Свойства (${v.keywords.length} из ${RARITIES[v.slots].kwCap + (bp.purity === 'chimera' ? 1 : 0)} слотов свойств)`));
  const kwBox = el('div', { class: 'kwlist' });
  for (const k of v.keywords) {
    const pair = (k.from || '').split('+').map((g) => GEARS[g]?.name || g).join(' + ');
    kwBox.append(el('div', { class: 'kwrow' }, [
      el('span', { class: 'kwrow__name', text: `${k.name}${(k.lvl || 1) > 1 ? ' ' + ROMAN[Math.min(6, k.lvl)] : ''}` }),
      el('span', { class: 'kwrow__from', text: pair }),
      el('span', { class: 'kwrow__text', text: k.text }),
    ]));
  }
  if (!v.keywords.length) kwBox.append(el('div', { class: 'dim' }, 'Ни одна пара шестерёнок не дала свойства. Попробуйте другие открытия.'));
  detail.append(kwBox);

  if (v.unused.length) {
    detail.append(el('h4', {}, 'Спящие комбинации'));
    detail.append(el('div', { class: 'dim small' }, 'Не хватило слотов свойств. Ветеран 3-го уровня отпирает первую из них.'));
    detail.append(el('div', { class: 'kwlist kwlist--latent' }, v.unused.map((k) => el('div', { class: 'kwrow kwrow--latent' }, [
      el('span', { class: 'kwrow__name', text: k.name }),
      el('span', { class: 'kwrow__from', text: (k.from || '').split('+').map((g) => GEARS[g]?.name || g).join(' + ') }),
      el('span', { class: 'kwrow__text', text: k.text }),
    ]))));
  }

  detail.append(el('div', { class: 'preview__sum' }, [
    el('span', {}, `Домен: ${dom.glyph} ${dom.name}`),
    el('span', {}, v.purity === 'pure' ? '✦ Чистая линия: +8% к характеристикам' : v.purity === 'chimera' ? '✦ Химера: +1 слот свойства, −10% к характеристикам' : '✦ Смешанная линия'),
    el('span', {}, `Сила проекта: ${(bp.power ?? 0).toFixed(1)}`),
  ]));
  root.append(detail);
  return root;
}

export { gearRow, kwChip, sigilSVG, gearSVG, darken, lighten };
