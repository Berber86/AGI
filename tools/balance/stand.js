/**
 * Стенд баланса кампании: честная («по бюджету редкости») колода игрока против настоящих колод и
 * конфигов племён из campaign.js. Врага ведёт боевой ИИ движка (enemyAct), сторону игрока — общая
 * политика стенда (tools/balance/policy.js), потому что ИИ игрока в игре нет.
 *
 * Запуск:
 *   node tools/balance/stand.js                     # 40 боёв на клетку, 6 наборов карт
 *   node tools/balance/stand.js --battles 100 --decks 12 --seed 7
 *   node tools/balance/stand.js --eras 0-3 --tribes reed,north
 *   node tools/balance/stand.js --mirror            # зеркальные колоды: проверка честности движка
 *
 * Печатает процент побед игрока: по эпохам (среднее по трём племенам и разброс между наборами карт).
 */
const path = require('node:path');
const Campaign = require(path.join(__dirname, '..', '..', 'campaign.js'));
const { loadBattle } = require('./loader.js');
const { makePolicy } = require('./policy.js');

const api = loadBattle();
const policy = makePolicy(api);

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const hit = args.find((a) => a === `--${name}` || a.startsWith(`--${name}=`));
  if (!hit) return fallback;
  const value = hit.includes('=') ? hit.split('=')[1] : args[args.indexOf(hit) + 1];
  return value === undefined ? fallback : value;
};

/* ---------- прежняя кривая племени: для сравнения «до/после» ----------
   До перебалансировки конфиг считался от эпохи угрозы по-другому: вождь 5+эпоха, предел энергии
   рос +1 за каждую эпоху, прирост — через эпоху, доктрина племени шла вровень с доктриной игрока,
   а ветераны догоняли ковку игрока без отставания. Ключ --legacy возвращает ту кривую, чтобы стенд
   показывал, что именно изменилось. */
const LEGACY = args.includes('--legacy');
if (LEGACY) {
  const originalConfig = Campaign.getOpponentBattleConfig;
  Campaign.getOpponentBattleConfig = (state, id) => {
    const ec = originalConfig(state, id);
    const era = ec.threatEra;
    return {
      ...ec,
      hp: Math.min(Campaign.COMBAT_CAPS.hp, Campaign.COMBAT_BASE.hp + era),
      energyMax: Math.min(Campaign.COMBAT_CAPS.energyMax, Campaign.COMBAT_BASE.energyMax + Math.ceil(era / 2)),
      energyGrowth: Math.min(Campaign.COMBAT_CAPS.energyGrowth, Campaign.COMBAT_BASE.energyGrowth + Math.floor((era + 1) / 3)),
      atkBonus: Math.min(Campaign.COMBAT_CAPS.atkBonus, Math.floor(era / 3)),
    };
  };
  const originalDeck = Campaign.getOpponentBattleDeck;
  Campaign.getOpponentBattleDeck = (state, id) => {
    const normalized = Campaign.normalizeState(state);
    const opponent = normalized.opponents.find((o) => o.id === id);
    if (!opponent) return null;
    const threat = Math.max(opponent.era, normalized.player.era);
    return Campaign.getBarbarianDeck(opponent.id, opponent.era, threat - Campaign.barbarianStage(opponent.era), Campaign.expectedCraftMultiplier(threat));
  };
}

const BATTLES = Math.max(1, Number(flag('battles', 40)));
const DECKS = Math.max(1, Number(flag('decks', 6)));
const SEED = Number(flag('seed', 20250915));
const MIRROR = args.includes('--mirror');
const TRIBES = String(flag('tribes', 'reed,steppe,north')).split(',').map((s) => s.trim()).filter(Boolean);
const eraRange = String(flag('eras', '0-6')).split('-').map(Number);
const ERAS = [];
for (let e = eraRange[0]; e <= (eraRange[1] ?? eraRange[0]); e++) ERAS.push(e);

/* ---------- честная колода игрока: сила не выше бюджета редкости ---------- */
let rngState = SEED >>> 0;
const rnd = () => { rngState = (rngState * 1103515245 + 12345) & 0x7fffffff; return rngState / 0x7fffffff; };
const pick = (arr) => arr[Math.floor(rnd() * arr.length) % arr.length];

// One representative progression mix per deck slot: cycling a short list silently changed the
// intended rarity share when deckLimit grew, so every era now has exactly one entry per card.
const RARITY_MIX = {
  0: ['ordinary', 'ordinary', 'ordinary', 'ordinary', 'ordinary'],
  1: ['ordinary', 'uncommon', 'rare', 'ordinary', 'ordinary', 'ordinary', 'ordinary'],
  2: ['ordinary', 'uncommon', 'rare', 'ordinary', 'uncommon', 'ordinary', 'uncommon', 'ordinary'],
  3: ['ordinary', 'uncommon', 'rare', 'ordinary', 'uncommon', 'ordinary', 'rare', 'uncommon', 'ordinary'],
  4: ['ordinary', 'uncommon', 'rare', 'uncommon', 'ordinary', 'uncommon', 'rare', 'uncommon', 'ordinary', 'uncommon'],
  5: ['ordinary', 'uncommon', 'rare', 'uncommon', 'rare', 'uncommon', 'ordinary', 'rare', 'uncommon', 'rare', 'uncommon'],
  6: ['ordinary', 'uncommon', 'rare', 'rare', 'uncommon', 'rare', 'ordinary', 'rare', 'uncommon', 'rare', 'rare', 'uncommon'],
};
// Слова по эпохам: каменный стол рукопашный (одна линия — стрельба и глубина молчат).
const POOL_STONE = [['phalanx'], ['shieldwall'], ['taunt'], ['charge'], ['wedge'], ['armor:1'], ['flank'], ['rally'], ['sturdy'], ['morale']];
const POOL_BRONZE = [...POOL_STONE, ['ranged'], ['skirmish'], ['pierce:1'], ['raider'], ['reach'], ['laststand']];
const STONE_ATTACK_BOOSTS = new Set(['charge', 'phalanx', 'wedge', 'rally', 'flank', 'scavenger', 'laststand', 'cleave', 'relentless']);
const COST_PATTERN = [1, 2, 2, 3, 3, 4, 2, 3, 1, 4, 2, 3];
let cardSeq = 0;

/** Собирает карту под бюджет обычной/необычной/редкой ковки — так же, как это делает кузница. */
function makeCard(drop, rarity, bronze, wantKws) {
  const mult = Campaign.CARD_RARITY_BUDGET_MULT[rarity] || 1;
  const budget = Math.max(2, Math.round((2 * drop + 1 + 1) * mult));
  const pool = bronze ? POOL_BRONZE : POOL_STONE;
  const keywords = [];
  for (const seed of wantKws) {
    if (keywords.length >= 2) break;
    const kw = pool[seed % pool.length][0];
    if (keywords.includes(kw)) continue;
    const next = [...keywords, kw];
    if (!bronze && next.filter((word) => STONE_ATTACK_BOOSTS.has(word.split(':')[0])).length > 1) continue;
    if (Campaign.cardValueOf({ atk: 0, hp: 0, keywords: next, card_type: 'unit' }) <= budget - 2) keywords.push(kw);
  }
  const room = budget - Campaign.cardValueOf({ atk: 0, hp: 0, keywords, card_type: 'unit' });
  // The Stone Age limit is a real deck-building constraint, not just a forge prompt: unused
  // budget cannot become an illegal third attack or fourth health point on a one-line board.
  const hp = bronze ? Math.max(1, Math.floor(room / 2)) : Math.min(3, Math.max(1, Math.ceil(room / 2)));
  const atk = bronze ? Math.max(1, room - hp) : Math.min(2, Math.max(1, room - hp));
  cardSeq++;
  return {
    id: `stand-${cardSeq}`, name: `Карта игрока ${cardSeq}`, card_type: 'unit', era: bronze ? 'bronze' : 'ancient',
    emoji: '⚔️', drop_cost: drop, action_cost: 1, atk, hp,
    description: 'Честная карта игрока, собранная по бюджету редкости стенда.', tags: [], abilities: [],
    keywords, effects: [], monkey_paw: '',
  };
}

// Типичная прокачка лагеря к эпохе: слава в прототипе идёт в бой, а не в запас (сумма покупок к
// шестой эпохе ≈ 450 из 580 — остальное уходит на сырьё кузницы).
const UPGRADES = {
  0: {}, 1: { deck_slots: 1, max_hp: 1 }, 2: { deck_slots: 1, max_hp: 1, energy_cap: 1 },
  3: { deck_slots: 1, max_hp: 2, energy_cap: 1, unit_power: 1 },
  4: { deck_slots: 1, max_hp: 2, energy_cap: 1, energy_growth: 1, unit_power: 1 },
  5: { deck_slots: 2, max_hp: 2, energy_cap: 2, energy_growth: 1, unit_power: 1, fatigue_resist: 1 },
  6: { deck_slots: 2, max_hp: 3, energy_cap: 2, energy_growth: 2, unit_power: 2, fatigue_resist: 1 },
};

function campaignState(era) {
  const base = Campaign.createState(4242);
  const state = Campaign.foundCampaignState(base, { seedId: 'field', historicalCultureId: 'natufian' }).state || base;
  state.player.era = era;
  state.player.upgrades = UPGRADES[era];
  for (const o of state.opponents) o.era = Math.min(Campaign.BARBARIAN_ERA_CAP, Math.max(0, era));
  return state;
}

/** Колода игрока: карты не дороже его собственного предела энергии (дороже просто не сыграть). */
function playerDeck(state) {
  const cfg = Campaign.getBattleConfig(state);
  const mix = RARITY_MIX[state.player.era];
  if (mix.length !== cfg.deckLimit) throw new Error(`RARITY_MIX эпохи ${state.player.era}: ${mix.length} карт для лимита колоды ${cfg.deckLimit}`);
  const cap = state.player.era === 0 ? Math.min(cfg.energyMax, 2) : cfg.energyMax;
  const costs = COST_PATTERN.filter((c) => c <= cap);
  const useCosts = costs.length ? costs : [Math.max(1, cap)];
  const deck = [];
  for (let i = 0; i < cfg.deckLimit; i++) {
    deck.push(makeCard(useCosts[i % useCosts.length], mix[i % mix.length], state.player.era >= 1, [Math.floor(rnd() * 10), Math.floor(rnd() * 10), Math.floor(rnd() * 10)]));
  }
  return { cfg, deck };
}

function enemySetup(state, tribe, deckLen) {
  const ec = Campaign.getOpponentBattleConfig(state, tribe);
  const pool = Campaign.getOpponentBattleDeck(state, tribe) || [];
  return { ec, enemyDeck: api.mirrorDeckToPlayer(new Array(deckLen).fill(0), pool) };
}

function trial(state, tribe, battles, mirror) {
  const { cfg, deck } = playerDeck(state);
  const { ec, enemyDeck } = enemySetup(state, tribe, deck.length);
  const meCfg = { hp: cfg.hp, energyMax: cfg.energyMax, energyGrowth: cfg.energyGrowth, fatigueDelay: cfg.fatigueDelay, atkBonus: cfg.atkBonus, openingHand: cfg.openingHand };
  const ecCfg = { hp: ec.hp, energyMax: ec.energyMax, energyGrowth: ec.energyGrowth, fatigueDelay: ec.fatigueDelay, atkBonus: ec.atkBonus };
  let wins = 0, turns = 0;
  for (let i = 0; i < battles; i++) {
    const match = { kind: 'practice', opponentId: tribe, name: 'стенд', clan: 'стенд', era: ec.era, threatEra: ec.threatEra, leaderBattle: false, tutorial: false };
    const b = mirror
      ? api.createBattle(enemyDeck, ecCfg, enemyDeck, ecCfg, match)   // зеркало: одинаковые колоды и конфиги
      : api.createBattle(deck, meCfg, enemyDeck, ecCfg, match);
    const done = policy.runBattle(api, b);
    if (done.over === 'win') wins++;
    turns += done.turn;
  }
  return { pct: (wins / battles) * 100, turns: turns / battles, cfg, ec };
}

const head = (MIRROR ? 'Зеркальный замер (одинаковые колоды и конфиги с обеих сторон)' : 'Кампания: честная колода игрока против племён') + (LEGACY ? ' [--legacy: прежняя кривая]' : '');
console.log(`${head}; ${DECKS} наборов × ${BATTLES} боёв; seed ${SEED}`);
for (const era of ERAS) {
  const state = campaignState(era);
  const rows = [];
  const means = [];
  for (const tribe of TRIBES) {
    const vals = [];
    for (let d = 0; d < DECKS; d++) vals.push(trial(state, tribe, BATTLES, MIRROR).pct);
    const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
    means.push(avg);
    rows.push(`${tribe} ${avg.toFixed(0)}% [${Math.min(...vals).toFixed(0)}–${Math.max(...vals).toFixed(0)}]`);
  }
  const c = Campaign.getBattleConfig(state);
  console.log(`эпоха ${era}: игрок hp${c.hp} э${c.energyMax}/${c.energyGrowth} атк+${c.atkBonus} | ${rows.join(' | ')} | сред ${(means.reduce((a, b) => a + b, 0) / means.length).toFixed(0)}%`);
}
