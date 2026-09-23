// =============================================================================
//  ШЕСТЕРНИ ЭПОХ — state.js
//  Мета-слой «цивилизации»: эпохи, наука, материалы, изученные открытия,
//  ростер юнитов, колода и карта мира. Здесь живёт весь прогресс партии.
// =============================================================================

import { DISCOVERIES, DISCOVERY_LIST, isAvailable } from './discoveries.js';
import { DOMAINS, eraOf, MAX_ERA, ERAS } from './gears.js';
import { generateCard, checkCombination, blueprintCost, recruitCost } from './cardgen.js';
import { generateWorld, buildRival, applyDifficulty, canAttackRegion, HOME_POS } from './civ.js';
import { makeUnit, grantExperience, vetTier, VET_NAMES } from './units.js';
import { buildDeck } from './deck.js';
import { makeRng } from './rng.js';
import { createBattle } from './battle.js';

export const SAVE_KEY = 'gears-of-ages:save:v1';

// --- Экономика ---------------------------------------------------------------
export const ECONOMY = {
  startScience: 46,
  startMaterials: 52,
  // смена эпохи: наука + присоединённые регионы + 2 открытия текущей эпохи
  eraAdvance: [0, 0, 60, 150, 300, 500, 760],
  eraRegions: [0, 0, 1, 2, 4, 6, 8],
  eraDiscoveries: 2,
  income: (state, mult = 1) => ({
    science: Math.round((10 + 5 * state.era + 7 * state.conquered) * mult),
    materials: Math.round((12 + 6 * state.era + 8 * state.conquered) * mult),
  }),
  defeatShare: 0.45,
  developShare: 0.65,
};

export const LEGACIES = [
  { domain: 'war',       name: 'Наследие Войны',    desc: 'Старт с Железом и Вождеством: дешёвые злые юниты.',
    bonus: ['chieftain', 'bronze'], materials: 12 },
  { domain: 'order',     name: 'Наследие Порядка',  desc: 'Старт с Ритуалом и Письменностью: крепкий строй.',
    bonus: ['chieftain', 'ritual', 'writing'], materials: 6 },
  { domain: 'knowledge', name: 'Наследие Знания',   desc: 'Старт со Звездочётством: ранняя Оптика и Шифр.',
    bonus: ['writing', 'stars'], materials: 8 },
  { domain: 'life',      name: 'Наследие Жизни',    desc: 'Старт с Земледелием и Траволечением: много здоровья.',
    bonus: ['agriculture', 'herbs'], materials: 8 },
  { domain: 'craft',     name: 'Наследие Ремесла',  desc: 'Старт с Колесом и Камнем: ранняя Механика и Сплав.',
    bonus: ['wheel', 'stonework', 'pottery'], materials: 10 },
];

// --- Новая партия ------------------------------------------------------------
export function newGame({ civName = 'Новая Цивилизация', seed = null, legacy = 'craft', difficulty = 1 } = {}) {
  const realSeed = seed ?? Math.floor(Math.random() * 1e9);
  const rng = makeRng(`${realSeed}:start`);
  const leg = LEGACIES.find((l) => l.domain === legacy) || LEGACIES[4];
  const world = generateWorld(realSeed, difficulty);

  const state = {
    v: 1,
    seed: realSeed,
    difficulty,
    civName,
    legacy: leg.domain,
    era: 1,
    science: ECONOMY.startScience,
    materials: ECONOMY.startMaterials + leg.materials,
    conquered: 0,
    researched: ['fire_mastery', 'stonework', 'wheel', 'agriculture', 'writing', 'chieftain', ...leg.bonus],
    blueprints: {},   // key -> blueprint
    roster: [],       // unit instances
    deck: [],         // unit ids
    world,
    stats: { battles: 0, wins: 0, losses: 0, crafted: 0, recruited: 0, turns: 0, kills: 0, lost: 0 },
    messages: [],
    victory: false,
    defeatStreak: 0,
    createdAt: Date.now(),
  };
  state.researched = [...new Set(state.researched)];

  // Стартовая мастерская: несколько простых юнитов, чтобы сразу можно было воевать.
  const starters = [
    ['bronze'], ['wheel'], ['agriculture'], ['writing'], ['chieftain'],
    ['stonework'], ['fire_mastery'], ['chieftain', 'bronze'], ['wheel', 'stonework'], ['agriculture', 'herbs'],
  ].filter((c) => c.every((id) => state.researched.includes(id) || DISCOVERIES[id]));

  for (const comps of starters) {
    const missing = comps.filter((id) => !state.researched.includes(id));
    if (missing.length) continue;
    addUnitFrom(state, comps, rng, 0);
  }
  // добираем до минимальной колоды
  while (state.roster.length < ERAS[1].deckSize) {
    const c = rng.pick([['chieftain'], ['wheel'], ['stonework'], ['agriculture'], ['fire_mastery'], ['writing']]);
    addUnitFrom(state, c, rng, 0);
  }
  state.deck = state.roster.slice(0, ERAS[1].deckSize).map((u) => u.id);
  push(state, `Основана цивилизация «${civName}». ${leg.name}: ${leg.desc}`);
  push(state, `Эпоха I — ${eraOf(1).name}. Здоровье лидера ${eraOf(1).leaderHp}, колода ${ERAS[1].deckSize} юнитов.`);
  return state;
}

function addUnitFrom(state, comps, rng, matCost = 0) {
  const bp = generateCard(comps, { seed: rng.next() * 1e9 });
  if (!bp) return null;
  state.blueprints[bp.key] = bp;
  const u = makeUnit(bp);
  state.roster.push(u);
  return u;
}

export function push(state, text, kind = 'info') {
  state.messages.unshift({ text, kind, t: state.stats.turns });
  if (state.messages.length > 120) state.messages.length = 120;
}

// --- Наука -------------------------------------------------------------------
export const researchedSet = (state) => new Set(state.researched);

export function availableResearch(state) {
  const set = researchedSet(state);
  return DISCOVERY_LIST.filter((d) => d.era <= state.era && isAvailable(d.id, set));
}

export function canResearch(state, id) {
  const d = DISCOVERIES[id];
  if (!d) return { ok: false, reason: 'Нет такого открытия.' };
  if (state.researched.includes(id)) return { ok: false, reason: 'Уже изучено.' };
  if (d.era > state.era) return { ok: false, reason: `Нужна эпоха ${d.era} (${eraOf(d.era).name}).` };
  if (!isAvailable(id, researchedSet(state))) return { ok: false, reason: 'Не изучены предшественники.' };
  if (state.science < d.cost) return { ok: false, reason: `Не хватает ${d.cost - state.science} науки.` };
  return { ok: true };
}

export function research(state, id) {
  const chk = canResearch(state, id);
  if (!chk.ok) return chk;
  const d = DISCOVERIES[id];
  state.science -= d.cost;
  state.researched.push(id);
  push(state, `🔬 Изучено «${d.name}» (${DOMAINS[d.domain].name}, эпоха ${d.era}) — шестерни: ${d.gears.join(', ')}.`, 'good');
  return { ok: true, disc: d };
}

export function eraRequirements(state) {
  const next = Math.min(MAX_ERA, state.era + 1);
  const disc = DISCOVERY_LIST.filter((d) => d.era === state.era && state.researched.includes(d.id)).length;
  return {
    next,
    science: { need: ECONOMY.eraAdvance[next], have: state.science },
    regions: { need: ECONOMY.eraRegions[next], have: state.conquered },
    discoveries: { need: ECONOMY.eraDiscoveries, have: disc },
  };
}

export function canAdvanceEra(state) {
  if (state.era >= MAX_ERA) return { ok: false, reason: 'Вы уже в последней эпохе.', reqs: null };
  const r = eraRequirements(state);
  const fails = [];
  if (r.science.have < r.science.need) fails.push(`${r.science.need} науки (есть ${r.science.have})`);
  if (r.regions.have < r.regions.need) fails.push(`${r.regions.need} регионов (есть ${r.regions.have})`);
  if (r.discoveries.have < r.discoveries.need) fails.push(`${r.discoveries.need} открытия эпохи ${state.era} (есть ${r.discoveries.have})`);
  if (fails.length) return { ok: false, reason: 'Для эпохи ' + r.next + ' нужно: ' + fails.join('; ') + '.', reqs: r };
  return { ok: true, cost: r.science.need, reqs: r };
}

export function advanceEra(state) {
  const chk = canAdvanceEra(state);
  if (!chk.ok) return chk;
  state.science -= chk.cost;
  state.era += 1;
  const e = eraOf(state.era);
  push(state, `🏛 ЭПОХА ${['', 'I', 'II', 'III', 'IV', 'V', 'VI'][state.era]} — ${e.name}! Здоровье лидера ${e.leaderHp}, поле ${e.slots}, колода ${e.deckSize}, энергия до ${e.energyCap}.`, 'good');
  return { ok: true, era: state.era };
}

// --- Мастерская: создание проектов и найм ------------------------------------
/**
 * draft — выбор игрока: какие свойства из пула поставить на карту.
 * Без него генератор берёт топ по приоритету (прежнее поведение).
 */
export function canCraft(state, comps, draft = null) {
  const chk = checkCombination(comps);
  if (!chk.ok) return { ok: false, reason: chk.reason };
  for (const id of comps) {
    if (!state.researched.includes(id)) return { ok: false, reason: `«${DISCOVERIES[id]?.name}» не изучено.` };
  }
  const bp = generateCard(comps, { draft });
  if (!bp) return { ok: false, reason: 'Не удалось собрать.' };
  const cost = blueprintCost(bp);
  if (state.blueprints[bp.key]) return { ok: false, reason: 'Такой проект уже есть — можно просто нанять юнитов.', bp };
  if (state.materials < cost) return { ok: false, reason: `Нужно ${cost} материалов (есть ${state.materials}).`, bp };
  return { ok: true, bp, cost };
}

export function craft(state, comps, draft = null) {
  const chk = canCraft(state, comps, draft);
  if (!chk.ok) return chk;
  state.materials -= chk.cost;
  state.blueprints[chk.bp.key] = chk.bp;
  state.stats.crafted += 1;
  const kws = chk.bp.keywords.length
    ? chk.bp.keywords.map((k) => k.name).join(', ')
    : 'без свойств';
  push(state, `🛠 Спроектирован «${chk.bp.name}» (${chk.bp.rarityName}, ${chk.bp.atk}/${chk.bp.hp} за ${chk.bp.cost}⚡; ${kws}) за ${chk.cost} материалов.`, 'good');
  return { ok: true, bp: chk.bp, cost: chk.cost };
}

/** Доля стоимости проекта, которую берут за переработку свойств. */
export const REWORK_SHARE = 0.4;

/**
 * Цена перековки. Не зависит от того, какие свойства выбраны: стоимость проекта
 * в материалах определяется открытиями и числом слотов, а ценой свойства служит
 * энергия (bp.cost) — она уже растёт вместе с силой карты. Плата здесь только за
 * сам факт переработки чертежа, чтобы смена решения не была бесплатной.
 */
export function recraftCost(bp) {
  return Math.max(1, Math.round(blueprintCost(bp) * REWORK_SHARE));
}

/**
 * Перековка: пересобрать свойства уже существующего проекта.
 * Нанятые юниты не меняются: они уже собраны по прежнему чертежу.
 */
export function recraft(state, key, draft) {
  const old = state.blueprints[key];
  if (!old) return { ok: false, reason: 'Нет такого проекта.' };
  const comps = old.components.map((c) => c.disc);
  const next = generateCard(comps, { draft });
  if (!next) return { ok: false, reason: 'Не удалось пересобрать.' };
  const fee = recraftCost(next);
  if (state.materials < fee) {
    return { ok: false, reason: `Перековка стоит ${fee} материалов (есть ${state.materials}).`, bp: next };
  }
  state.materials -= fee;
  state.blueprints[key] = next;
  state.stats.recrafted = (state.stats.recrafted || 0) + 1;
  const kws = next.keywords.length ? next.keywords.map((k) => k.name).join(', ') : 'без свойств';
  push(state, `🔧 «${next.name}» перекован за ${fee} 🧱: ${kws} (${next.atk}/${next.hp} за ${next.cost}⚡).`, 'good');
  return { ok: true, bp: next, fee };
}

export function unitCost(state, bpKey) {
  const bp = state.blueprints[bpKey];
  if (!bp) return Infinity;
  return recruitCost(bp, eraOf(state.era).mat);
}

export function recruit(state, bpKey, n = 1) {
  const bp = state.blueprints[bpKey];
  if (!bp) return { ok: false, reason: 'Нет такого проекта.' };
  const price = unitCost(state, bpKey);
  const afford = Math.floor(state.materials / price);
  const count = Math.max(0, Math.min(n, afford));
  if (count === 0) return { ok: false, reason: `Нужно ${price} материалов за юнита (есть ${state.materials}).` };
  state.materials -= price * count;
  const made = [];
  for (let i = 0; i < count; i++) {
    const u = makeUnit(bp);
    state.roster.push(u);
    made.push(u);
  }
  state.stats.recruited += count;
  push(state, `⚔ Нанято ${count} × «${bp.name}» за ${price * count} материалов.`, 'good');
  return { ok: true, units: made, cost: price * count };
}

export function disband(state, unitId) {
  const i = state.roster.findIndex((u) => u.id === unitId);
  if (i < 0) return false;
  const u = state.roster[i];
  const refund = Math.round(unitCost(state, u.bpKey) * 0.5);
  state.roster.splice(i, 1);
  state.deck = state.deck.filter((x) => x !== unitId);
  state.materials += refund;
  push(state, `Расформирован «${u.blueprint.name}»: +${refund} материалов.`, 'dim');
  return true;
}

// --- Колода ------------------------------------------------------------------
export function deckLimits(state) {
  const e = eraOf(state.era);
  return { min: Math.max(6, e.deckSize - 4), max: e.deckSize };
}

export function setDeck(state, unitIds) {
  const lim = deckLimits(state);
  const ids = unitIds.filter((id) => state.roster.some((u) => u.id === id));
  if (ids.length > lim.max) return { ok: false, reason: `Колода эпохи ${state.era}: максимум ${lim.max} юнитов.` };
  if (ids.length < lim.min) return { ok: false, reason: `Колода эпохи ${state.era}: минимум ${lim.min} юнитов.` };
  state.deck = ids;
  return { ok: true };
}

export function deckUnits(state) {
  return state.deck.map((id) => state.roster.find((u) => u.id === id)).filter(Boolean);
}

export function deckInfo(state) {
  const units = deckUnits(state);
  const curve = {};
  let atk = 0, hp = 0, kw = 0;
  const gearCount = {};
  const domainCount = {};
  for (const u of units) {
    const bp = u.blueprint;
    curve[bp.cost] = (curve[bp.cost] || 0) + 1;
    atk += bp.atk + vetTier(u); hp += bp.hp + vetTier(u); kw += bp.keywords.length;
    for (const g of Object.keys(bp.gearCounts || {})) gearCount[g] = (gearCount[g] || 0) + bp.gearCounts[g];
    domainCount[bp.domain] = (domainCount[bp.domain] || 0) + 1;
  }
  const lim = deckLimits(state);
  return {
    count: units.length, min: lim.min, max: lim.max,
    valid: units.length >= lim.min && units.length <= lim.max,
    curve, atk, hp, kw, gearCount, domainCount, units,
    avgCost: units.length ? (units.reduce((s, u) => s + u.blueprint.cost, 0) / units.length) : 0,
  };
}

/** Автоматическая сборка колоды: ровная кривая стоимости из ростера. */
export function autoDeck(state, style = 'balanced') {
  const lim = deckLimits(state);
  if (!state.roster.length) return { ok: false, reason: 'Ростер пуст — спроектируйте и наймите юнитов.' };
  const rng = makeRng(`${state.seed}:autodeck:${state.stats.turns}:${state.roster.length}`);
  const picked = buildDeck(state.roster, lim.max, state.era, rng, style);
  const res = setDeck(state, picked.map((u) => u.id));
  if (res.ok) {
    const info = deckInfo(state);
    push(state, `Колода собрана (${style === 'balanced' ? 'сбалансированно' : style}): ${info.count} юнитов, средняя цена ${info.avgCost.toFixed(1)}⚡.`, 'dim');
  }
  return res.ok ? { ok: true, ids: state.deck } : res;
}

// --- Бой ---------------------------------------------------------------------
export function startBattle(state, regionId) {
  const region = state.world.regions.find((r) => r.id === regionId);
  if (!region) return { ok: false, reason: 'Нет такого региона.' };
  if (region.conquered) return { ok: false, reason: 'Регион уже ваш.' };
  if (!canAttackRegion(state, region)) {
    return { ok: false, reason: `Нужна эпоха ${Math.max(1, region.era - 1)}+ чтобы идти на «${region.name}» (эпоха ${region.era}).` };
  }
  const info = deckInfo(state);
  if (!info.valid) return { ok: false, reason: `Соберите колоду: нужно ${info.min}–${info.max} юнитов, сейчас ${info.count}.` };

  const rng = makeRng(`${state.seed}:${regionId}:${state.stats.battles}`);
  const rival = applyDifficulty(buildRival(region, rng.fork('rival'), state.difficulty), state.difficulty);
  rival.name = `${rival.name}`;
  rival.isHuman = false;
  const me = {
    name: state.civName,
    civName: state.civName,
    color: DOMAINS[state.legacy].color,
    isHuman: true,
    deck: deckUnits(state).map((u) => ({ ...u, blueprint: u.blueprint })),
  };
  const era = Math.max(state.era, region.era);
  const battle = createBattle({ era, seed: `${state.seed}-${regionId}-${state.stats.battles}`, sides: { me, foe: rival }, first: 'me', context: { regionId } });
  return { ok: true, battle, rival, region };
}

/** Завершение боя: награды, опыт юнитов, присоединение региона. */
export function finishBattle(state, battle, outcome) {
  const won = outcome === 'win';
  const region = state.world.regions.find((r) => r.id === battle.context?.regionId);
  state.stats.battles += 1;
  state.stats.turns += 1;
  const inc = ECONOMY.income(state, won ? 1 : ECONOMY.defeatShare);
  state.science += inc.science;
  state.materials += inc.materials;

  // опыт: все юниты колоды получают XP; павшие в бою помечаются.
  // Повышения собираются в rewards.veterans — экран итогов показывает их отдельно,
  // чтобы рост армии был заметен, а не тонул в журнале.
  const fallen = new Set((battle.sides.me.grave || []).map((u) => u.srcId).filter(Boolean));
  const veterans = [];
  for (const u of state.roster) {
    if (!state.deck.includes(u.id)) continue;
    const before = vetTier(u);
    const leveled = grantExperience(u, { won, died: fallen.has(u.id) });
    if (leveled) {
      const tier = vetTier(u);
      const awakens = tier >= 3 ? (u.blueprint.unusedKeywords?.[0]?.name || null) : null;
      veterans.push({ id: u.id, name: u.blueprint.name, tier, title: VET_NAMES[tier], awakens, died: fallen.has(u.id), xp: u.xp, before });
      push(state, `🎖 «${u.blueprint.name}» получает уровень ветеранства ${tier}: +1/+1 навсегда${awakens ? ` и отпирает «${awakens}»` : ''}.`, 'good');
    }
  }
  state.stats.kills += (battle.sides.foe.grave || []).length;
  state.stats.lost += fallen.size;

  const rewards = { science: inc.science, materials: inc.materials, region: null, stolen: null, veterans };
  if (won) {
    state.stats.wins += 1;
    state.defeatStreak = 0;
    if (region) {
      region.conquered = true;
      state.conquered += 1;
      state.science += region.reward.science;
      state.materials += region.reward.materials;
      rewards.science += region.reward.science;
      rewards.materials += region.reward.materials;
      rewards.region = region.name;
      push(state, `🏆 «${region.name}» присоединён! +${region.reward.science} науки, +${region.reward.materials} материалов. Доход вырос.`, 'good');
      // трофей: одно открытие соперника
      const rng = makeRng(`${state.seed}:trophy:${region.id}`);
      const pool = DISCOVERY_LIST.filter((d) => d.era <= Math.max(state.era, region.era) && !state.researched.includes(d.id)
        && d.prereq.every((p) => state.researched.includes(p)));
      if (pool.length) {
        const got = rng.weighted(pool, (d) => (d.era === state.era ? 3 : 1) + (region.civ.domains.includes(d.domain) ? 2 : 0));
        state.researched.push(got.id);
        rewards.stolen = got.name;
        push(state, `📜 Трофей: «${got.name}» перенято у ${region.civ.name}.`, 'good');
      }
      if (region.boss) {
        state.victory = true;
        push(state, '👑 Сердцевина пала. Ваша цивилизация прошла все эпохи — ПОБЕДА.', 'good');
      }
    }
  } else {
    state.stats.losses += 1;
    state.defeatStreak += 1;
    push(state, `💀 Поражение от ${battle.sides.foe.name}. Юниты вернутся в строй к следующей сборке колоды. +${inc.science} науки (уроки поражения).`, 'bad');
    if (state.defeatStreak >= 3) {
      const gift = Math.round(20 + state.era * 12);
      state.science += gift; state.materials += gift;
      state.defeatStreak = 0;
      push(state, `🕊 Мобилизация: три поражения подряд — город даёт +${gift} науки и +${gift} материалов.`, 'good');
    }
  }
  return rewards;
}

/** «Развитие» — мирный ход: доход без боя. */
export function develop(state) {
  state.stats.turns += 1;
  const inc = ECONOMY.income(state, ECONOMY.developShare);
  state.science += inc.science;
  state.materials += inc.materials;
  push(state, `🏗 Год развития: +${inc.science} науки, +${inc.materials} материалов.`, 'dim');
  return inc;
}

// --- Сохранение --------------------------------------------------------------
export function serialize(state) { return JSON.stringify(state); }

/**
 * Проверка сохранённой партии.
 *
 * Одного `v === 1` мало: интерфейс импортирует файл, выбранный игроком, и
 * подставляет его как текущее состояние. Обрубленный или чужой JSON с той же
 * версией уронил бы приложение на первой же отрисовке — и уронил бы уже после
 * того, как партия перезаписана. Поэтому сначала валидируем, потом подставляем.
 *
 * @returns {{ok:boolean, reason?:string}}
 */
export function validateSave(s) {
  if (!s || typeof s !== 'object') return { ok: false, reason: 'файл не содержит объект партии' };
  if (s.v !== 1) return { ok: false, reason: `неверная версия сохранения (нужна 1, получено ${s.v ?? '—'})` };
  if (typeof s.civName !== 'string' || !s.civName) return { ok: false, reason: 'нет имени цивилизации' };
  if (!Number.isInteger(s.era) || s.era < 1 || s.era > MAX_ERA) return { ok: false, reason: `недопустимая эпоха: ${s.era}` };
  if (!Array.isArray(s.researched)) return { ok: false, reason: 'нет списка изученных открытий' };
  if (!Array.isArray(s.roster)) return { ok: false, reason: 'нет ростера юнитов' };
  if (!Array.isArray(s.deck)) return { ok: false, reason: 'нет колоды' };
  if (!s.blueprints || typeof s.blueprints !== 'object') return { ok: false, reason: 'нет чертежей проектов' };
  if (!s.world || !Array.isArray(s.world.regions) || !s.world.regions.length) return { ok: false, reason: 'нет карты мира' };
  if (!Number.isFinite(s.science) || !Number.isFinite(s.materials)) return { ok: false, reason: 'ресурсы повреждены' };
  if (!s.stats || typeof s.stats !== 'object') return { ok: false, reason: 'нет статистики партии' };
  // ростер обязан ссылаться на существующие чертежи — иначе карта не отрисуется
  const missing = s.roster.find((u) => !u || !u.blueprint);
  if (missing !== undefined) return { ok: false, reason: 'в ростере есть юнит без чертежа' };
  const unknown = s.deck.filter((id) => !s.roster.some((u) => u && u.id === id));
  if (unknown.length) return { ok: false, reason: `колода ссылается на ${unknown.length} несуществующих юнитов` };
  return { ok: true };
}

export function deserialize(text) {
  let s;
  try { s = JSON.parse(text); } catch { throw new Error('файл не является корректным JSON'); }
  const chk = validateSave(s);
  if (!chk.ok) throw new Error(chk.reason);
  return s;
}

export function save(state) {
  try { localStorage.setItem(SAVE_KEY, serialize(state)); return true; } catch { return false; }
}

export function loadSaved() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function clearSaved() {
  try { localStorage.removeItem(SAVE_KEY); } catch { /* noop */ }
}

export { ERAS, DOMAINS, MAX_ERA, HOME_POS, canAttackRegion, vetTier, blueprintCost, recruitCost };
