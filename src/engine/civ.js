// =============================================================================
//  ШЕСТЕРНИ ЭПОХ — civ.js
//  Соперники и карта мира. Важно: колоды соперников собираются ТЕМ ЖЕ
//  генератором карт, что и у игрока. Никаких заранее нарисованных карт —
//  только открытия, шестерни и совместимость.
// =============================================================================

import { DISCOVERY_LIST, DISCOVERIES, isAvailable } from './discoveries.js';
import { DOMAINS, DOMAIN_IDS, eraOf, MAX_ERA } from './gears.js';
import { generateCard, compatible, blueprintCost } from './cardgen.js';
import { makeRng } from './rng.js';
import { makeUnit } from './units.js';
import { buildDeck } from './deck.js';

export const CIV_NAMES = [
  'Аркания', 'Вельгард', 'Нуррам', 'Тир-Хабба', 'Остмарк', 'Синтра',
  'Каоруна', 'Гхимар', 'Элориан', 'Урук-Тар', 'Механис', 'Ферралия',
  'Драконис', 'Хетт-Саар', 'Вольная Марка', 'Киммерий',
];

export const REGION_NAMES = [
  'Междуречье', 'Дельта', 'Степной Предел', 'Янтарный Берег', 'Семихолмье',
  'Серебряный Кряж', 'Вольные Города', 'Пепельная Равнина', 'Железный Мыс',
  'Затерянный Плато', 'Сердцевина',
];

export const PERSONALITIES = {
  aggro:    { name: 'Агрессия',  slots: [1, 1, 1, 2, 2, 3], bias: 'war',       desc: 'Дешёвые злые юниты, Рывок и Топот.' },
  swarm:    { name: 'Рой',       slots: [1, 1, 2, 2, 2, 3], bias: 'life',      desc: 'Много мелких тел и Вдохновение.' },
  midrange: { name: 'Середина',  slots: [1, 2, 2, 3, 3, 4], bias: 'craft',     desc: 'Ровная кривая, крепкие корпуса.' },
  control:  { name: 'Контроль',  slots: [2, 2, 3, 3, 4, 4], bias: 'knowledge', desc: 'Дорогие юниты, Мор, Паралич, Провидение.' },
};
export const PERSONALITY_IDS = Object.keys(PERSONALITIES);

// --- Карта мира --------------------------------------------------------------
const MAP_LAYOUT = [
  { era: 1, x: 13, y: 62 }, { era: 1, x: 27, y: 82 }, { era: 1, x: 8,  y: 84 },
  { era: 2, x: 34, y: 62 }, { era: 2, x: 22, y: 42 },
  { era: 3, x: 47, y: 80 }, { era: 3, x: 52, y: 56 },
  { era: 4, x: 66, y: 70 },
  { era: 5, x: 71, y: 44 },
  { era: 6, x: 50, y: 22, boss: true },
];
export const HOME_POS = { x: 12, y: 24 };

export function generateWorld(seed = 'gears', difficulty = 1) {
  const rng = makeRng(`${seed}:world`);
  const names = rng.shuffle(CIV_NAMES);
  const regions = MAP_LAYOUT.map((m, i) => {
    const boss = !!m.boss;
    const personality = boss ? 'control' : rng.pick(PERSONALITY_IDS);
    const domCount = boss ? 3 : (m.era >= 4 ? 2 : rng.chance(0.35) ? 2 : 1);
    const domains = rng.shuffle(DOMAIN_IDS).slice(0, domCount);
    return {
      id: `r${i}`,
      index: i,
      // Финальный регион всегда называется «Сердцевина» (последнее имя пула) —
      // именно о нём говорит сообщение о победе.
      name: boss ? REGION_NAMES[REGION_NAMES.length - 1] : REGION_NAMES[i % (REGION_NAMES.length - 1)],
      x: m.x, y: m.y, era: m.era, boss,
      conquered: false,
      civ: {
        name: boss ? 'Сингулярный Престол' : names[i % names.length],
        domains, personality,
        color: DOMAINS[domains[0]].color,
      },
      reward: {
        science: Math.round((24 + m.era * 28) * (boss ? 3 : 1)),
        materials: Math.round((30 + m.era * 34) * (boss ? 3 : 1)),
      },
    };
  });
  return { seed, difficulty, regions, rng: rng.seed };
}

/** Соперник доступен для атаки, если его эпоха не выше вашей + 1. */
export function canAttackRegion(state, region) {
  if (region.conquered) return false;
  return region.era <= state.era + 1;
}

// --- Колода соперника --------------------------------------------------------
/**
 * Собирает «цивилизацию»: набор изученных открытий и колоду юнитов,
 * сгенерированную тем же механизмом, что и карты игрока.
 */
export function buildRival(region, rng, difficulty = 1) {
  const era = region.era;
  const cfgEra = eraOf(era);
  const P = PERSONALITIES[region.civ.personality];
  const domains = region.civ.domains;

  // «изученные» открытия: почти все прежних эпох по своим доменам + часть текущей
  const pool = DISCOVERY_LIST.filter((d) => d.era <= era);
  const researched = new Set();
  for (const d of pool) {
    const inDomain = domains.includes(d.domain);
    const p = d.era < era ? (inDomain ? 0.97 : 0.7) : (inDomain ? 0.85 : 0.35);
    if (rng.chance(p)) researched.add(d.id);
  }
  // гарантируем минимум
  for (const d of pool.filter((x) => x.era === era && domains.includes(x.domain))) researched.add(d.id);
  const ids = [...researched];

  const deckSize = cfgEra.deckSize;
  // Соперник «проектирует» втрое больше юнитов, чем нужно, и отбирает лучшую
  // колоду по кривой стоимости — ровно так же, как это делает игрок.
  const target = deckSize * 3;
  const blueprints = [];
  let guard = 0;
  while (blueprints.length < target && guard++ < 1600) {
    const slots = Math.min(4, rng.pick(P.slots));
    const maxEra = rng.chance(0.8) ? era : Math.max(1, era - 1);
    const comps = [];
    let tries = 0;
    while (comps.length < slots && tries++ < 60) {
      const cand = ids.filter((id) => DISCOVERIES[id].era <= maxEra);
      if (!cand.length) break;
      // тянем к доменам цивилизации и к уже выбранным шестерням
      const pickId = rng.weighted(cand, (id) => {
        const d = DISCOVERIES[id];
        let w = 1;
        if (domains.includes(d.domain)) w += 3;
        if (d.era === era) w += 1.5;
        if (comps.length && comps.some((c) => compatible(c, id))) w += 4;
        if (comps.some((c) => c === id)) w -= 3;
        return w;
      });
      if (!pickId) break;
      comps.push(pickId);
    }
    if (comps.length !== slots) continue;
    const bp = generateCard(comps, { seed: rng.next() * 1e9 });
    if (!bp) continue;
    blueprints.push(bp);
  }

  const candidates = blueprints.map((bp) => makeUnit(bp, { xp: era >= 4 ? rng.int(4) : rng.int(2) }));
  const deck = buildDeck(candidates, deckSize, era, rng, region.civ.personality);

  return {
    name: region.civ.name,
    civName: region.civ.name,
    color: region.civ.color,
    era,
    domains,
    personality: region.civ.personality,
    researched: ids,
    deck,
    difficulty,
  };
}

/** Масштабирование сложности: ветеранство и лёгкий бонус к корпусу. */
export function applyDifficulty(rival, difficulty = 1) {
  if (difficulty === 1) return rival;
  const extraXp = difficulty > 1 ? (difficulty - 1) * 3 : 0;
  for (const u of rival.deck) {
    u.xp = (u.xp || 0) + extraXp;
    if (difficulty > 1) {
      u.blueprint = { ...u.blueprint, atk: u.blueprint.atk + (difficulty - 1), hp: u.blueprint.hp + (difficulty - 1) };
    } else if (difficulty < 1) {
      u.blueprint = { ...u.blueprint, atk: Math.max(0, u.blueprint.atk - 1), hp: Math.max(1, u.blueprint.hp - 1) };
    }
  }
  return rival;
}

/** Сводка силы региона для интерфейса. */
export function rivalPower(rival) {
  const atk = rival.deck.reduce((s, u) => s + u.blueprint.atk, 0);
  const hp = rival.deck.reduce((s, u) => s + u.blueprint.hp, 0);
  const kw = rival.deck.reduce((s, u) => s + u.blueprint.keywords.length, 0);
  return { atk, hp, kw, score: Math.round(atk + hp * 0.7 + kw * 3) };
}

export { blueprintCost, isAvailable, MAX_ERA };
