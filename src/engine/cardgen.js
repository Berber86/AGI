// =============================================================================
//  ШЕСТЕРНИ ЭПОХ — cardgen.js
//  СЕРДЦЕ ИГРЫ. Карт в игре нет: юнит рождается из совместимости научных
//  открытий. Каждый слот карты — одно открытие («шестерня»). Число слотов =
//  редкость: обычная 1, необычная 2, редкая 3, мифическая 4.
//  Все ПАРЫ шестерёнок внутри юнита порождают свойства в духе MTG, а редкость
//  ограничивает, сколько свойств карта способна вместить.
// =============================================================================

import {
  GEARS, DOMAINS, ERAS, RARITIES, eraBase, eraOf, pairKey, pairToKeyword, tripleKey, tripleToKeyword,
  soloToKeyword, resonanceToKeyword, conflictToKeyword, RESONANCE_MIN,
} from './gears.js';

/** Насколько разлад ослабляет гармоничное свойство конфликтной пары. */
export const CONFLICT_WEAKEN = 0.6;
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
// --- Контекст сборки --------------------------------------------------------
// Всё, что нужно и генератору, и интерфейсу драфта: набор шестерёнок, чистота
// линии, потолок свойств и ПОЛНЫЙ пул кандидатов. Вынесено из generateCard,
// потому что интерфейс обязан показывать игроку тот же пул, из которого
// генератор выбирает сам, — иначе подсказка и результат разъезжаются.
function buildContext(componentIds) {
  const check = checkCombination(componentIds);
  if (!check.ok) return { ok: false, reason: check.reason };

  const discs = componentIds.map((id) => DISCOVERIES[id]);
  const slots = discs.length;
  const rarity = RARITIES[slots];
  const era = Math.max(...discs.map((d) => d.era));
  const domain = dominantDomain(discs);
  const domainInfo = DOMAINS[domain];

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
  const seenTriple = new Set();
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
      const pureBonus = purity === 'pure' ? 0.5 : 0;

      // --- разлад: эти шестерни мешают друг другу ---
      // Гармоничное свойство НЕ удаляется, а ослабляется: 51 свойство имеет
      // единственный источник-пару, и замена осиротила бы его (Regeneration
      // осталась бы с обработчиком в движке, но недостижимой). Ослабление
      // сохраняет контент, а «Разлад» рядом даёт настоящую альтернативу —
      // игрок выбирает между вялой гармонией и острой, но хрупкой сборкой.
      const rift = conflictToKeyword(g1, g2);
      if (rift) {
        const weak = {
          ...kw,
          lvl: Math.max(1, (kw.lvl || 1) - 1),
          value: kw.value * CONFLICT_WEAKEN,
          weakened: true,
        };
        candidates.push({ ...weak, stack, score: weak.value + 0.35 * (stack - 1) + pureBonus });
        candidates.push({ ...rift, stack, score: rift.value + 0.4 + pureBonus });
        continue;
      }
      candidates.push({ ...kw, stack, score: kw.value + 0.35 * (stack - 1) + pureBonus });
    }
  }

  // --- тройки шестерёнок: свойства, недостижимые парами, и усиленные версии ---
  // Тройка требует три РАЗНЫЕ шестерни, поэтому доступна только картам
  // редкости выше обычной — это осмысленная награда за число слотов.
  // Некоторые открытия несут по три шестерни сами по себе, поэтому одного
  // числа шестерёнок мало — требуем минимум два слота.
  const tripleKws = new Set();
  if (slots >= 2 && distinctGears.length >= 3) {
    for (let i = 0; i < distinctGears.length; i++) {
      for (let j = i + 1; j < distinctGears.length; j++) {
        for (let k = j + 1; k < distinctGears.length; k++) {
          const g1 = distinctGears[i], g2 = distinctGears[j], g3 = distinctGears[k];
          const key = tripleKey(g1, g2, g3);
          if (seenTriple.has(key)) continue;
          seenTriple.add(key);
          const kw = tripleToKeyword(g1, g2, g3);
          if (!kw) continue;
          tripleKws.add(kw.kw);
          candidates.push({ ...kw, stack: 1, score: kw.value + 1.2 + (purity === 'pure' ? 0.5 : 0) });
        }
      }
    }
    // Тройка даёт усиленную версию свойства — слабая парная версия того же
    // свойства убирается, иначе обе сложатся (lvl 1 + lvl 3 = 4) и карта
    // получит вдвое больше, чем задумано.
    if (tripleKws.size) {
      for (let i = candidates.length - 1; i >= 0; i--) {
        if (!candidates[i].triple && tripleKws.has(candidates[i].kw)) candidates.splice(i, 1);
      }
    }
  }

  // --- резонанс: шестерня, собранная в количестве RESONANCE_MIN и больше ---
  // Награда за связную сборку: одна шестерня много раз звучит громче, чем
  // разнобой из пар. Кандидат сильнее парных по ценности, но не по приоритету.
  for (const g of distinctGears) {
    if (gearCounts[g] < RESONANCE_MIN) continue;
    const kw = resonanceToKeyword(g);
    if (!kw) continue;
    candidates.push({ ...kw, stack: gearCounts[g], score: kw.value + 0.8 + (purity === 'pure' ? 0.5 : 0) });
  }

  // --- врождённое свойство шестерни ---
  // Кандидат-запас: чинит карты из одного открытия, которые раньше оставались
  // вовсе без свойств (одна шестерня не строит пару). Подавляется только для
  // бинарных fx — «Закал» рядом с «Бронёй» был бы дублем, а вот «Отладка» +0/+1
  // и «Жар» +1/+0 дают разные числа и остаются осмысленным выбором.
  const blockedFx = new Set(candidates.filter((c) => c.fx !== 'statBoost').map((c) => c.fx));
  for (const g of distinctGears) {
    const kw = soloToKeyword(g);
    if (!kw) continue;
    if (kw.fx !== 'statBoost' && blockedFx.has(kw.fx)) continue;
    blockedFx.add(kw.fx);
    candidates.push({ ...kw, stack: gearCounts[g], score: kw.value * 0.6 + (purity === 'pure' ? 0.3 : 0) });
  }

  // --- сколько свойств помещается на карту ---
  let kwCap = rarity.kwCap;
  if (purity === 'chimera') kwCap += 1; // химера: больше свойств, слабее корпус

  candidates.sort((a, b) => (b.priority - a.priority) || (b.score - a.score) || a.name.localeCompare(b.name));

  return {
    ok: true, discs, slots, rarity, era, domain, domainInfo,
    gearList, gearCounts, purity, kwCap, candidates, distinctGears,
  };
}

/** Устойчивая метка кандидата: одно свойство может прийти из разных пар. */
export const candidateId = (c) => `${c.kw}|${c.from}`;

/**
 * Полный пул кандидатов для набора открытий — то, из чего игрок выбирает.
 * Возвращает { ok:false, reason } для несобираемого набора.
 */
export function candidatePool(componentIds) {
  const ctx = buildContext(componentIds);
  if (!ctx.ok) return ctx;
  return {
    ok: true,
    slots: ctx.slots,
    kwCap: ctx.kwCap,
    purity: ctx.purity,
    era: ctx.era,
    domain: ctx.domain,
    candidates: ctx.candidates.map((c, i) => ({
      id: candidateId(c), kw: c.kw, name: c.name, text: c.text, fx: c.fx,
      lvl: c.lvl || 1, value: c.value, from: c.from, triple: !!c.triple,
      solo: !!c.solo, resonance: !!c.resonance, conflict: !!c.conflict, weakened: !!c.weakened,
      // atk/hp нужны интерфейсу: размен «+2/−1» у разлада обязан быть читаемым
      atk: c.atk || 0, hp: c.hp || 0,
      stack: c.stack, priority: c.priority, rank: i,
    })),
  };
}

/**
 * Выбор свойств под потолок.
 * draft — метки кандидатов в порядке выбора игрока; неизвестные игнорируются.
 * Без draft работает авто-подбор по приоритету (прежнее поведение).
 */
export function selectKeywords(candidates, kwCap, draft) {
  const chosen = [];
  const usedKw = new Set();
  const take = (c) => {
    if (usedKw.has(c.kw)) {
      // повтор того же свойства ⇒ усиление уровня
      const prev = chosen.find((x) => x.kw === c.kw);
      if (prev && prev.fx !== 'statBoost' && prev.upgrades < 2) {
        prev.lvl += c.lvl || 1; prev.upgrades += 1; prev.name = romanize(prev);
      }
      return;
    }
    usedKw.add(c.kw);
    chosen.push({ ...c, lvl: c.lvl || 1, upgrades: 0 });
  };
  // Пустой массив — это осознанный выбор «карта без свойств» (самый дешёвый
  // и быстрый вариант), а не откат к авто-подбору. Отличаем по типу, не по длине.
  if (Array.isArray(draft)) {
    const byId = new Map(candidates.map((c) => [candidateId(c), c]));
    for (const id of draft) {
      if (chosen.length >= kwCap) break;
      const c = byId.get(id);
      if (c) take(c);
    }
  } else {
    for (const c of candidates) {
      if (chosen.length >= kwCap) break;
      take(c);
    }
  }
  return chosen;
}

export function generateCard(componentIds, opts = {}) {
  const ctx = buildContext(componentIds);
  if (!ctx.ok) return null;
  const { slots, rarity, era, domain, domainInfo, gearList, gearCounts, purity, kwCap, discs } = ctx;

  const seed = opts.seed ?? hashString([...componentIds].sort().join('|'));
  const rng = makeRng(seed);

  const chosen = selectKeywords(ctx.candidates, kwCap, opts.draft);
  const drafted = Array.isArray(opts.draft);

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
  // Свойства входят в силу карты, поэтому драфт — это настоящий размен:
  // больше свойств ⇒ дороже карта и дольше её не сыграть.
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
    // флаг triple сохраняется: интерфейс помечает такие свойства отдельно
    // (это редкая комбинация трёх шестерёнок, а не обычная пара)
    keywords: chosen.map((k) => ({ kw: k.kw, name: k.name, text: k.text, fx: k.fx, lvl: k.lvl, value: k.value, from: k.from, triple: !!k.triple, solo: !!k.solo, resonance: !!k.resonance, conflict: !!k.conflict, weakened: !!k.weakened, atk: k.atk || 0, hp: k.hp || 0 })),
    unusedKeywords: ctx.candidates.filter((c) => !chosen.some((k) => k.kw === c.kw)).slice(0, 6)
      .map((c) => ({ kw: c.kw, name: c.name, text: c.text, fx: c.fx, lvl: c.lvl, from: c.from, triple: !!c.triple, solo: !!c.solo, resonance: !!c.resonance, conflict: !!c.conflict, weakened: !!c.weakened, atk: c.atk || 0, hp: c.hp || 0 })),
    // пул целиком нужен интерфейсу, чтобы показать выбор, а не только остаток
    poolSize: ctx.candidates.length,
    kwCap,
    drafted,
    draft: drafted ? chosen.map((k) => candidateId(k)) : null,
    // сколько свойств игрок НЕ добрал до потолка — цена скорости в энергии
    spareSlots: Math.max(0, kwCap - chosen.length),
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
