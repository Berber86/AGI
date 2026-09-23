// =============================================================================
//  ШЕСТЕРНИ ЭПОХ — cardgen.js
//  СЕРДЦЕ ИГРЫ. Карт в игре нет: юнит рождается из совместимости научных
//  открытий. Каждый слот карты — одно открытие («шестерня»). Число слотов =
//  редкость: обычная 1, необычная 2, редкая 3, мифическая 4.
//  Все ПАРЫ шестерёнок внутри юнита порождают свойства в духе MTG, а редкость
//  ограничивает, сколько свойств карта способна вместить.
// =============================================================================

import { GEARS, DOMAINS, ERAS, RARITIES, eraBase, eraOf, pairKey, pairToKeyword } from './gears.js';
import { DISCOVERIES } from './discoveries.js';
import { makeRng, hashString } from './rng.js';

// --- Константы баланса -------------------------------------------------------
export const BALANCE = {
  compAtk: 0.65,     // вклад открытия в атаку
  compHp: 0.65,      // вклад открытия в здоровье
  kwAtk: 1.0,        // вклад свойства в атаку
  kwHp: 1.0,         // вклад свойства в здоровье
  stackBonus: 0.5,   // бонус за каждую «лишнюю» шестерню того же типа
  pureBonus: 0.08,   // «Чистая линия»: все открытия одного домена
  chimeraPenalty: 0.10, // «Химера»: ≥3 доменов, но +1 слот под свойство
  maxEraSpan: 2,     // разброс эпох внутри одной карты
  costDivisor: (era) => 2.0 + 0.62 * era,
};

// --- Совместимость открытий --------------------------------------------------
/** Два открытия «цепляются», если у них общая шестерня / общий домен / прямая
 *  преемственность при соседних эпохах. */
export function compatible(a, b) {
  const da = typeof a === 'string' ? DISCOVERIES[a] : a;
  const db = typeof b === 'string' ? DISCOVERIES[b] : b;
  if (!da || !db) return false;
  if (da.id === db.id) return true;   // одно и то же открытие сцепляется само с собой («сдвоенная шестерня»)
  if (Math.abs(da.era - db.era) > 1) return false;
  if (da.gears.some((g) => db.gears.includes(g))) return true;
  if (da.domain === db.domain) return true;
  if (da.prereq.includes(db.id) || db.prereq.includes(da.id)) return true;
  return false;
}

/**
 * Проверка набора открытий на совместимость:
 *  - разброс эпох ≤ BALANCE.maxEraSpan;
 *  - граф совместимости связен (ни одна шестерня не «висит в воздухе»);
 *  - набор не пуст.
 * Возвращает { ok, reason }.
 */
export function checkCombination(ids) {
  if (!ids || ids.length === 0) return { ok: false, reason: 'Пусто: положите хотя бы одно открытие в слот.' };
  const dup = {};
  for (const id of ids) dup[id] = (dup[id] || 0) + 1;
  for (const [id, n] of Object.entries(dup)) {
    if (n > 2) return { ok: false, reason: `«${DISCOVERIES[id]?.name}» нельзя ставить больше чем в два слота: ось не выдержит.` };
  }
  const discs = ids.map((id) => DISCOVERIES[id]);
  if (discs.some((d) => !d)) return { ok: false, reason: 'Неизвестное открытие.' };
  const eras = discs.map((d) => d.era);
  const span = Math.max(...eras) - Math.min(...eras);
  if (span > BALANCE.maxEraSpan) {
    return { ok: false, reason: `Слишком большой разброс эпох (${span}): шестерни не сцепляются.` };
  }
  // связность
  const n = discs.length;
  const seen = new Set([0]);
  let grew = true;
  while (grew) {
    grew = false;
    for (let i = 0; i < n; i++) {
      if (seen.has(i)) continue;
      for (const j of seen) {
        if (compatible(discs[i], discs[j])) { seen.add(i); grew = true; break; }
      }
    }
  }
  if (seen.size < n) {
    const lonely = discs.filter((_, i) => !seen.has(i)).map((d) => d.name);
    return { ok: false, reason: `Нет зацепления: ${lonely.join(', ')} не сцепляется с остальными шестернями.` };
  }
  return { ok: true };
}

// --- Вспомогательное ---------------------------------------------------------
function dominantDomain(discs) {
  const count = {};
  discs.forEach((d, i) => { count[d.domain] = (count[d.domain] || 0) + d.era * 0.25 + 1 + i * 0.01; });
  let best = null;
  for (const [k, v] of Object.entries(count)) if (!best || v > best.v) best = { k, v };
  return best.k;
}

const EPIC_TITLES = ['Великий', 'Последний', 'Вечный', 'Грозный', 'Первый', 'Нездешний', 'Железный', 'Седьмой'];
const DOMAIN_GEN = { war: 'Войны', order: 'Порядка', knowledge: 'Знания', life: 'Жизни', craft: 'Ремесла' };

const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

function buildName(discs, slots, rng) {
  // Имя детерминировано: одна и та же комбинация ⇒ одна и та же карта.
  // Чем реже карта — тем торжественнее имя.
  const byPower = discs.slice().sort((a, b) => (b.atk + b.hp + b.era) - (a.atk + a.hp + a.era));
  const noun = byPower[0].noun;
  const adjSrc = byPower.length > 1 ? byPower[1 + rng.int(byPower.length - 1)] : byPower[0];
  const adj = adjSrc.adj || byPower[0].adj;
  const dom = dominantDomain(discs);

  if (slots >= 4) return `${rng.pick(EPIC_TITLES)} ${adj} ${noun}`;
  if (slots === 3) return `${cap(adj)} ${noun} ${DOMAIN_GEN[dom]}`;
  if (slots === 2) return `${cap(adj)} ${noun}`;
  return cap(noun);
}

const FLAVOR = [
  'Шестерни не спорят — они сцепляются.',
  'Открытие не воюет. Воюет то, что из него собрали.',
  'Между двумя истинами всегда есть ось.',
  'Эпоха — это сумма того, что удалось соединить.',
  'Там, где зубья совпали, рождается свойство.',
  'Никто не знал, что это получится. Получилось.',
];

// --- ГЕНЕРАЦИЯ КАРТЫ ---------------------------------------------------------
/**
 * @param {string[]} componentIds — по одному открытию на слот (1..4)
 * @param {object} opts — { seed, allowChimeraBonus }
 * @returns {object|null} карта-проект (blueprint) или null, если набор несовместим
 */
export function generateCard(componentIds, opts = {}) {
  const check = checkCombination(componentIds);
  if (!check.ok) return null;

  const discs = componentIds.map((id) => DISCOVERIES[id]);
  const slots = discs.length;
  const rarity = RARITIES[slots];
  const era = Math.max(...discs.map((d) => d.era));
  const domain = dominantDomain(discs);
  const domainInfo = DOMAINS[domain];

  const seed = opts.seed ?? hashString([...componentIds].sort().join('|'));
  const rng = makeRng(seed);

  // --- мультимножество шестерёнок ---
  const gearList = [];
  discs.forEach((d, slot) => d.gears.forEach((g) => gearList.push({ gear: g, slot, disc: d.id })));
  const gearCounts = {};
  for (const g of gearList) gearCounts[g.gear] = (gearCounts[g.gear] || 0) + 1;

  // --- чистота линии ---
  const distinctDomains = new Set(discs.map((d) => d.domain)).size;
  const purity = distinctDomains === 1 ? 'pure' : distinctDomains === 2 ? 'mixed' : 'chimera';

  // --- кандидаты в свойства: все пары шестерёнок ---
  const distinctGears = Object.keys(gearCounts);
  const candidates = [];
  const seenPair = new Set();
  for (let i = 0; i < distinctGears.length; i++) {
    for (let j = i; j < distinctGears.length; j++) {
      const g1 = distinctGears[i], g2 = distinctGears[j];
      if (g1 === g2 && gearCounts[g1] < 2) continue;
      const key = pairKey(g1, g2);
      if (seenPair.has(key)) continue;
      seenPair.add(key);
      const kw = pairToKeyword(g1, g2);
      if (!kw) continue;
      const stack = (g1 === g2 ? gearCounts[g1] : Math.min(gearCounts[g1], gearCounts[g2]));
      candidates.push({ ...kw, stack, score: kw.value + 0.35 * (stack - 1) + (purity === 'pure' ? 0.5 : 0) });
    }
  }

  // --- сколько свойств помещается на карту ---
  let kwCap = rarity.kwCap;
  if (purity === 'chimera') kwCap += 1; // химера: больше свойств, слабее корпус

  candidates.sort((a, b) => (b.priority - a.priority) || (b.score - a.score) || a.name.localeCompare(b.name));
  const chosen = [];
  const usedKw = new Set();
  for (const c of candidates) {
    if (chosen.length >= kwCap) break;
    if (usedKw.has(c.kw)) {
      // повтор того же свойства ⇒ усиление уровня
      const prev = chosen.find((x) => x.kw === c.kw);
      if (prev && prev.fx !== 'statBoost' && prev.upgrades < 2) { prev.lvl += c.lvl || 1; prev.upgrades += 1; prev.name = romanize(prev); }
      continue;
    }
    usedKw.add(c.kw);
    chosen.push({ ...c, lvl: c.lvl || 1, upgrades: 0 });
  }

  // --- характеристики ---
  const base = eraBase(era);
  let atk = base.atk * domainInfo.atk;
  let hp = base.hp * domainInfo.hp;
  for (const d of discs) { atk += d.atk * BALANCE.compAtk; hp += d.hp * BALANCE.compHp; }
  for (const [g, n] of Object.entries(gearCounts)) if (n > 1) { atk += (n - 1) * BALANCE.stackBonus * 0.6; hp += (n - 1) * BALANCE.stackBonus; }
  for (const k of chosen) {
    const lvl = k.lvl || 1;
    if (k.fx === 'armor' || k.fx === 'thorns') { hp += lvl * 0.8; }
    else if (k.fx === 'statBoost') { atk += (k.atk || 0) * lvl; hp += (k.hp || 0) * lvl; }
    else if (k.fx === 'overload') { atk += 2; }
    else if (['deathtouch', 'doubleStrike', 'firstStrike', 'trample', 'siege', 'pierce'].includes(k.fx)) atk += 0.7 * lvl;
    else if (['lifelink', 'regenerate', 'indestructible', 'bulwark', 'bond', 'carapace'].includes(k.fx)) hp += 0.7 * lvl;
    else if (['frenzy', 'zeal', 'growth', 'resolve', 'terror'].includes(k.fx)) atk += 0.5 * lvl;
    else atk += 0.25 * lvl;
  }
  if (purity === 'pure') { atk *= 1 + BALANCE.pureBonus; hp *= 1 + BALANCE.pureBonus; }
  if (purity === 'chimera') { atk *= 1 - BALANCE.chimeraPenalty; hp *= 1 - BALANCE.chimeraPenalty; }
  atk = Math.max(0, Math.round(atk));
  hp = Math.max(1, Math.round(hp));

  // --- стоимость в энергии ---
  const power = atk * 1.15 + hp * 0.8 + chosen.reduce((s, k) => s + k.value, 0);
  const cap = eraOf(era).energyCap;
  const cost = Math.max(1, Math.min(cap, Math.round(power / BALANCE.costDivisor(era))));

  const name = buildName(discs, slots, rng);
  const blurb = flavorLine(chosen, rng);

  return {
    kind: 'blueprint',
    key: [...componentIds].sort().join('+'),
    name,
    blurb,
    slots,
    rarity: rarity.id,
    rarityName: rarity.name,
    rarityColor: rarity.color,
    era,
    eraName: eraOf(era).name,
    domain,
    domainName: domainInfo.name,
    domainColor: domainInfo.color,
    archetype: domainInfo.archetype,
    components: discs.map((d, i) => ({ slot: i, disc: d.id, name: d.name, gears: d.gears.slice() })),
    gears: gearList,
    gearCounts,
    keywords: chosen.map((k) => ({ kw: k.kw, name: k.name, text: k.text, fx: k.fx, lvl: k.lvl, value: k.value, from: k.from })),
    unusedKeywords: candidates.filter((c) => !chosen.some((k) => k.kw === c.kw)).slice(0, 4)
      .map((c) => ({ kw: c.kw, name: c.name, text: c.text, fx: c.fx, lvl: c.lvl, from: c.from })),
    purity,
    atk, hp, cost, power,
  };
}

function romanize(k) {
  const r = ['', ' I', ' II', ' III', ' IV'];
  const base = (k.name || '').replace(/\s+[IVX]+$/, '');
  return base + (r[Math.min(4, k.lvl)] || '');
}

function flavorLine(chosen, rng) {
  if (chosen.length === 0) return rng.pick(FLAVOR);
  const k = chosen[0];
  return `${k.name}: ${k.text}`;
}

// --- Стоимость создания проекта и найма юнита --------------------------------
export function blueprintCost(bp) {
  const comps = bp.components.map((c) => DISCOVERIES[c.disc]);
  const sum = comps.reduce((s, d) => s + d.cost, 0);
  return Math.max(6, Math.round(sum * 0.16 * (1 + 0.18 * (bp.slots - 1))));
}

export function recruitCost(bp, eraMat = 1) {
  return Math.max(3, Math.round(blueprintCost(bp) * 0.45 * eraMat));
}

/** Доступные партнёры для набора: какие открытия вообще сцепляются с ним. */
export function compatibleWith(ids, pool) {
  const set = new Set(ids);
  return pool.filter((id) => !set.has(id) || ids.length < 4)
    .filter((id) => ids.every((x) => x === id || compatible(x, id)))
    .filter((id) => checkCombination([...ids, id]).ok);
}

export { pairKey, GEARS, DOMAINS, ERAS, RARITIES };
