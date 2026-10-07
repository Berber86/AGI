/**
 * Кузница: мгновенная ковка карты за славу. Очередей, дней и приказов в прототипе нет,
 * поэтому весь путь — это смета (редкость и цена), списание славы и возврат при сбое.
 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const Campaign = require('../campaign.js');

const root = path.join(__dirname, '..');
const forgeSource = fs.readFileSync(path.join(root, 'src', 'pages', 'Forge.tsx'), 'utf8');

function founded(era = 0, glory = 100) {
  const out = Campaign.foundCampaignState(Campaign.createState(), {
    seedId: 'forge', historicalCultureId: 'natufian',
  });
  const state = out.state;
  state.player.era = era;
  state.player.glory = glory;
  return state;
}

test('смета ковки считается в славе и дорожает с эпохой', () => {
  const zero = Campaign.cardCraftQuote(founded(0, 100), { materialQuality: 'standard' });
  assert.equal(zero.cost, 6);
  assert.equal(zero.glory, 100);
  assert.equal(zero.affordable, true);
  assert.equal(zero.effortDays, undefined, 'дней у ковки больше нет');

  const two = Campaign.cardCraftQuote(founded(2, 100), { materialQuality: 'standard' });
  assert.equal(two.cost, Math.ceil(6 * (1 + 2 * 0.4)), 'цена растёт с эпохой');

  const master = Campaign.cardCraftQuote(founded(2, 100), { materialQuality: 'masterwork' });
  assert.equal(master.cost, Math.ceil(20 * (1 + 2 * 0.4)));
  assert.ok(master.cost > two.cost);

  // неизвестное сырьё приводится к обычному
  assert.equal(Campaign.cardCraftQuote(founded(0, 100), { materialQuality: 'золото' }).materialQuality, 'standard');
});

test('сырьё открывается эпохой, а редкие карты — бронзой', () => {
  assert.deepEqual(Campaign.getAvailableMaterialQualities(founded(0)), ['standard']);
  assert.deepEqual(Campaign.getAvailableMaterialQualities(founded(1)), ['standard', 'refined']);
  assert.deepEqual(Campaign.getAvailableMaterialQualities(founded(2)), ['standard', 'refined', 'masterwork']);

  const locked = Campaign.cardCraftQuote(founded(0, 100), { materialQuality: 'standard' });
  assert.equal(locked.rareLocked, true);
  assert.equal(locked.odds.rare, 0);
  assert.equal(locked.odds.ordinary + locked.odds.uncommon, 100, 'доля редких уходит в необычные');
  assert.match(locked.rareLockText, /Античный мир/u);

  const open = Campaign.cardCraftQuote(founded(1, 100), { materialQuality: 'refined' });
  assert.equal(open.rareLocked, false);
  assert.ok(open.odds.rare > 0);
  assert.equal(open.odds.ordinary + open.odds.uncommon + open.odds.rare, 100);

  const blocked = Campaign.cardCraftQuote(founded(0, 100), { materialQuality: 'masterwork' });
  assert.equal(blocked.materialQualityUnlocked, false);
  assert.equal(blocked.affordable, false);
  assert.match(blocked.unlockText, /откроется в эпоху/u);
});

test('мастерство кузнеца повышает шанс редкой карты', () => {
  const novice = Campaign.cardCraftQuote(founded(3, 100), { materialQuality: 'standard' });
  const master = Campaign.cardCraftQuote(founded(3, 100), { materialQuality: 'masterwork' });
  assert.equal(novice.craftLevel, 0);
  assert.ok(master.odds.rare > novice.odds.rare, 'редкое сырьё даёт больше редких карт');
  assert.ok(master.odds.ordinary < novice.odds.ordinary);

  const leveled = founded(3, 100);
  leveled.player.craftLevel = Campaign.CRAFT_LEVEL_MAX;
  const best = Campaign.cardCraftQuote(leveled, { materialQuality: 'masterwork' });
  assert.equal(best.qualityScore, 5, 'качество упирается в потолок: редкое сырьё + третий уровень мастерства');
  assert.ok(best.odds.rare >= master.odds.rare);
});

test('модель для карты выбирает игра: обычные — Luna, необычные и редкие — GLM', () => {
  const quote = Campaign.cardCraftQuote(founded(1, 100), { materialQuality: 'refined' });
  assert.deepEqual(quote.modelByRarity, Campaign.CARD_MODEL_BY_RARITY);
  assert.equal(quote.modelByRarity.ordinary, 'gpt-6-luna');
  assert.equal(quote.modelByRarity.uncommon, 'glm-5.2');
  assert.equal(quote.modelByRarity.rare, 'glm-5.2');
});

test('ковка списывает славу сразу, а сбой возвращает её обратно', () => {
  const state = founded(1, 50);
  const begin = Campaign.beginCraftState(state, { materialQuality: 'refined' }, 0.99);
  assert.equal(begin.error, null);
  assert.equal(begin.rarity, 'ordinary');
  assert.equal(begin.modelId, 'gpt-6-luna');
  assert.equal(begin.state.player.glory, 50 - begin.cost);

  const fail = Campaign.failCraftState(begin.state, begin.cost, 'модель вернула мусор');
  assert.equal(fail.state.player.glory, 50, 'слава возвращена целиком');
  assert.equal(fail.refund, begin.cost);
  assert.match(fail.state.player.campaignNotice, /Ковка не удалась/u);

  // редкость выпадает из сметы: редкое сырьё и высокий бросок дают редкую карту и GLM
  const rare = Campaign.beginCraftState(founded(2, 200), { materialQuality: 'masterwork' }, 0.0);
  assert.equal(rare.rarity, 'rare');
  assert.equal(rare.modelId, 'glm-5.2');

  // не хватает славы — ковка не начинается
  const poor = Campaign.beginCraftState(founded(0, 2), { materialQuality: 'standard' }, 0.5);
  assert.match(poor.error, /Нужно 6 славы/u);
  assert.equal(poor.state.player.glory, 2);
  // закрытое эпохой сырьё не продаётся
  assert.match(Campaign.beginCraftState(founded(0, 200), { materialQuality: 'refined' }, 0.5).error, /откроется в эпоху/u);
});

test('успешная ковка растит мастерство кузнеца и попадает в летопись', () => {
  let state = founded(0, 100);
  for (let i = 0; i < Campaign.CRAFT_XP_PER_LEVEL; i++) {
    const out = Campaign.completeCraftState(state, { name: 'Стражи брода', rarity: 'ordinary' });
    assert.equal(out.error, null);
    state = out.state;
  }
  assert.equal(state.player.craftLevel, 1, 'после трёх успешных ковок мастерство растёт');
  assert.equal(state.player.craftXp, 0);
  assert.match(state.player.chronicle.at(-1).text, /«Стражи брода»/u);

  // потолок мастерства: опыт больше не копится
  const maxed = Campaign.clone(state);
  maxed.player.craftLevel = Campaign.CRAFT_LEVEL_MAX;
  const out = Campaign.completeCraftState(maxed, { name: 'Таран', rarity: 'rare' });
  assert.equal(out.state.player.craftLevel, Campaign.CRAFT_LEVEL_MAX);
  assert.equal(out.leveledUp, false);
});

test('экран кузницы работает со славой и не знает про дни, приказы и ресурсы', () => {
  assert.match(forgeSource, /iforge_advice_combat/);
  assert.match(forgeSource, /Все идеи — для одного сражения/iu);
  assert.match(forgeSource, /Что поможет победить в одном бою/iu);
  assert.match(forgeSource, /Ковать карту за \{quote\.cost\} славы/u);
  assert.match(forgeSource, /M\.beginCraft/);
  assert.match(forgeSource, /M\.failCraft/, 'при сбое слава возвращается');
  for (const gone of ['iforge_advice_v3', 'iforge_advice_v2', 'craftUsed', 'getOrderCapacity', 'effortDays', 'craftOrders', 'claimCardCraft', 'p.resources', 'CARD_CRAFT_EFFORTS']) {
    assert.ok(!forgeSource.includes(gone), `в Forge.tsx не должно остаться ${gone}`);
  }
});
