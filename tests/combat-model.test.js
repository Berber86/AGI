/**
 * Боевая модель прототипа: три выбора народа, боевые параметры вождя и колода.
 * Экономики (ресурсы, рабочие, склад), стройки и наук, карты и регионов в модели больше нет —
 * это проверяет отдельный тест combat-prototype.test.js.
 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const Campaign = require('../campaign.js');

const root = path.join(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'campaign.js'), 'utf8');

function founded(overrides = {}) {
  return Campaign.foundCampaignState(Campaign.createState(), {
    originId: 'river', seedId: 'field', historicalCultureId: 'natufian', ...overrides,
  });
}

test('новое состояние: пятая версия, стартовая слава, три племени и пустая колода', () => {
  const state = Campaign.createState();
  assert.equal(state.version, Campaign.SAVE_VERSION);
  assert.equal(state.player.glory, Campaign.GLORY_START);
  assert.equal(state.player.onboardingComplete, false);
  assert.deepEqual(state.player.deckCardIds, []);
  assert.deepEqual(state.opponents.map(o => o.id), ['reed', 'steppe', 'north']);
  // ни дня, ни сезона, ни ресурсов, ни построек
  for (const key of ['day', 'season', 'world', 'regions', 'medals']) assert.equal(key in state, false, `в состоянии не должно быть ${key}`);
  for (const key of ['resources', 'workers', 'buildings', 'blueprints', 'dailyOrders', 'ap', 'population']) {
    assert.equal(key in state.player, false, `в player не должно быть ${key}`);
  }
});

test('основание народа требует все три выбора и берёт имя из земли', () => {
  const base = Campaign.createState();
  assert.match(Campaign.foundCampaignState(base, { seedId: 'field', historicalCultureId: 'natufian' }).error, /происхождение/iu);
  assert.match(Campaign.foundCampaignState(base, { originId: 'river', historicalCultureId: 'natufian' }).error, /замысел/iu);
  assert.match(Campaign.foundCampaignState(base, { originId: 'river', seedId: 'field' }).error, /наследие/iu);

  const res = founded();
  assert.equal(res.error, null);
  assert.equal(res.state.player.name, 'Люди Великой Реки');
  assert.equal(res.state.player.name, Campaign.originPeopleName(Campaign.ORIGINS[0]));
  assert.equal(res.state.player.onboardingComplete, true);
  assert.equal(res.state.player.historicalCulture.id, 'natufian');
  assert.deepEqual(res.state.player.culturalLineage, ['natufian']);
  assert.match(res.state.player.chronicle[0].text, /вышел из земли «Великая Река»/u);
  // повторно основать народ нельзя
  assert.match(Campaign.foundCampaignState(res.state, { originId: 'river', seedId: 'field', historicalCultureId: 'natufian' }).error, /уже основан/iu);
});

test('колода первого боя собирается из стартовых карт по лимиту вождя', () => {
  assert.equal(Campaign.STARTER_CARDS.length, 8, 'стартовых карт должно быть восемь: четыре слота колоды игрок выбирает сам');
  const res = founded();
  const cfg = Campaign.getBattleConfig(res.state);
  assert.equal(res.state.player.deckCardIds.length, Math.min(cfg.deckLimit, Campaign.STARTER_DECK_IDS.length));
  assert.deepEqual(res.state.player.deckCardIds, Campaign.STARTER_DECK_IDS.slice(0, cfg.deckLimit));
  for (const id of res.state.player.deckCardIds) {
    assert.ok(Campaign.STARTER_CARDS.some(card => card.id === id), `${id} есть среди стартовых карт`);
  }
  // стартовые карты проходят ту же схему, что и выкованные
  const ids = new Set(Campaign.STARTER_CARDS.map(card => card.id));
  assert.equal(ids.size, Campaign.STARTER_CARDS.length, 'идентификаторы стартовых карт уникальны');
});

test('боевые параметры складываются из земли, замысла, наследия и лагеря', () => {
  const res = founded({ originId: 'highlands', seedId: 'river', historicalCultureId: 'trypillia' });
  const perks = Campaign.combatPerks(res.state);
  // Каменные Предгорья: +1 здоровье; замысел «Река и разлив»: +1 здоровье; Триполье: +1 здоровье
  assert.equal(perks.max_hp, 3);
  const cfg = Campaign.getBattleConfig(res.state);
  assert.equal(cfg.hp, Campaign.COMBAT_BASE.hp + 3);
  assert.equal(cfg.origin.id, 'highlands');
  assert.equal(cfg.seed.id, 'river');
  assert.equal(cfg.historicalCulture.id, 'trypillia');

  // слава на два улучшения: цена первого уровня — 15 и 20 (CAMP_UPGRADES)
  const rich = Campaign.clone(res.state);
  rich.player.glory = 200;
  const first = Campaign.buyUpgradeState(rich, 'max_hp');
  assert.equal(first.error, null);
  const upgraded = Campaign.buyUpgradeState(first.state, 'deck_slots');
  assert.equal(upgraded.error, null);
  assert.equal(upgraded.state.player.glory, 200 - Campaign.CAMP_UPGRADES.max_hp.cost[0] - Campaign.CAMP_UPGRADES.deck_slots.cost[0]);
  const after = Campaign.getBattleConfig(upgraded.state);
  assert.equal(after.hp, cfg.hp + 1);
  assert.equal(after.deckLimit, cfg.deckLimit + 1);
  assert.equal(upgraded.state.player.upgrades.max_hp, 1);
  assert.equal(upgraded.state.player.upgrades.deck_slots, 1);
});

test('боевые потолки держатся при любых сочетаниях выборов и улучшений', () => {
  // самый «сильный» набор: Сухие Земли и «Камень и горн» дают +2 к атаке уже на старте
  const res = founded({ originId: 'desert', seedId: 'forge', historicalCultureId: 'gobekli' });
  const before = Campaign.getBattleConfig(res.state);
  assert.equal(before.atkBonus, Campaign.COMBAT_CAPS.atkBonus);
  assert.equal(before.capped.unit_power, true);

  // покупаем всё, что можно: ни один параметр не должен выйти за потолок
  let state = res.state;
  for (let round = 0; round < 6; round++) {
    for (const key of Campaign.COMBAT_KEYS) {
      state = Campaign.clone(state);
      state.player.glory = 99999;
      const out = Campaign.buyUpgradeState(state, key);
      if (!out.error) state = out.state;
    }
  }
  const cfg = Campaign.getBattleConfig(state);
  assert.ok(cfg.hp <= Campaign.COMBAT_CAPS.hp, `hp ${cfg.hp}`);
  assert.ok(cfg.deckLimit <= Campaign.COMBAT_CAPS.deckLimit, `deckLimit ${cfg.deckLimit}`);
  assert.ok(cfg.energyMax <= Campaign.COMBAT_CAPS.energyMax, `energyMax ${cfg.energyMax}`);
  assert.ok(cfg.energyGrowth <= Campaign.COMBAT_CAPS.energyGrowth, `energyGrowth ${cfg.energyGrowth}`);
  assert.ok(cfg.fatigueDelay <= Campaign.COMBAT_CAPS.fatigueDelay, `fatigueDelay ${cfg.fatigueDelay}`);
  assert.ok(cfg.atkBonus <= Campaign.COMBAT_CAPS.atkBonus, `atkBonus ${cfg.atkBonus}`);
});

test('наследие выводит боевой бонус из того, чем культура жила', () => {
  const byId = id => Campaign.HISTORICAL_CULTURES.find(c => c.id === id);
  // Чатал-Хююк: материалы и знание → оружие; Натуф: только еда → здоровье вождя
  assert.equal(Campaign.cultureCombatBonus(byId('catalhoyuk')).unit_power, 1);
  assert.equal(Campaign.cultureCombatBonus(byId('natufian')).max_hp, 1);
  // Ямная: еда и металл поровну, приоритет у металла → оружие
  assert.equal(Campaign.cultureCombatBonus(byId('yamnaya')).unit_power, 1);
  // Гёбекли-Тепе: знание → темп боя
  assert.equal(Campaign.cultureCombatBonus(byId('gobekli')).energy_growth, 1);
  // Наследие разных эпох одной стихии даёт разные бонусы: иначе выбор культуры сводился бы к атаке
  const derived = new Set();
  for (const culture of Campaign.HISTORICAL_CULTURES) {
    for (const key of Campaign.COMBAT_KEYS) if (Campaign.cultureCombatBonus(culture)[key] > 0) derived.add(key);
  }
  assert.equal(derived.size, Campaign.COMBAT_KEYS.length, 'наследие покрывает все шесть боевых бонусов');
  // Аккад уже имеет собственный боевой бонус в данных — он сохраняется и дополняется
  const akkad = Campaign.cultureCombatBonus(byId('akkad'));
  assert.ok(akkad.deck_slots >= 1, 'Аккад даёт слот колоды');
  // у каждой культуры есть хотя бы один боевой бонус: выбор наследия всегда что-то значит
  for (const culture of Campaign.HISTORICAL_CULTURES) {
    const perks = Campaign.cultureCombatBonus(culture);
    const total = Campaign.COMBAT_KEYS.reduce((sum, key) => sum + perks[key], 0);
    assert.ok(total >= 1, `«${culture.name}» не даёт ни одного боевого бонуса`);
  }
  assert.equal(Campaign.describePerks(Campaign.cultureCombatBonus(byId('natufian'))).join(', '), '+1 здоровье вождя');
});

test('колода: карта добавляется до лимита и убирается обратно', () => {
  const res = founded();
  const cfg = Campaign.getBattleConfig(res.state);
  let state = res.state;
  // убираем всё, что есть, и заполняем заново
  for (const id of [...state.player.deckCardIds]) state = Campaign.toggleDeckCardState(state, id).state;
  assert.deepEqual(state.player.deckCardIds, []);
  for (const card of Campaign.STARTER_CARDS.slice(0, cfg.deckLimit)) {
    const out = Campaign.toggleDeckCardState(state, card.id);
    assert.equal(out.error, null);
    state = out.state;
  }
  assert.equal(state.player.deckCardIds.length, cfg.deckLimit);
  const overflow = Campaign.toggleDeckCardState(state, Campaign.STARTER_CARDS[cfg.deckLimit].id);
  assert.match(overflow.error, /Предел|предел|Знамя дружины/u);
  assert.equal(overflow.state.player.deckCardIds.length, cfg.deckLimit);
  // повторное добавление той же карты — это удаление
  const back = Campaign.toggleDeckCardState(state, state.player.deckCardIds[0]);
  assert.equal(back.error, null);
  assert.equal(back.state.player.deckCardIds.length, cfg.deckLimit - 1);
});

test('сохранение прежней кампании не переносится: прототип начинает народ заново', () => {
  const legacy = {
    version: 4, season: 2, day: 11, medals: [],
    player: {
      name: 'Люди Дельты', clan: 'Медный Ворон', era: 2, onboardingComplete: true,
      resources: { food: 30, materials: 12, knowledge: 8, faith: 3 },
      population: 9, workers: { food: 4, materials: 2, knowledge: 2, faith: 1, idle: 0 },
      buildings: [{ id: 'x', active: true, effects: [{ type: 'max_hp', amount: 1 }] }],
      blueprints: [], deckCardIds: ['campaign-starter-spears'],
    },
    opponents: [], world: { tiles: [] }, regions: [],
  };
  const state = Campaign.normalizeState(legacy);
  assert.equal(state.version, Campaign.SAVE_VERSION);
  assert.equal(state.player.onboardingComplete, false, 'старое сохранение не даёт готовый народ');
  assert.equal(state.player.era, 0);
  assert.equal(state.opponents.length, 3);
  assert.equal('resources' in state.player, false);
});

test('normalizeState приводит поля прототипа и отбрасывает мусор', () => {
  const base = founded().state;
  const broken = Campaign.clone(base);
  broken.player.glory = -50;
  broken.player.gloryTotal = 'много';
  broken.player.upgrades.max_hp = 99;
  broken.player.upgrades.deck_slots = -3;
  broken.player.deckCardIds = ['starter-spears', 'starter-spears', 42, null, 'starter-axes'];
  broken.player.originId = 'атлантида';
  broken.player.historicalCulture = { id: 'yamnaya' };
  broken.player.wins = -4;
  broken.opponents = [{ id: 'reed', era: 9, rating: 0 }, { id: 'unknown' }];
  const state = Campaign.normalizeState(broken);
  assert.equal(state.player.glory, 0);
  assert.equal(state.player.gloryTotal, 0);
  assert.equal(state.player.upgrades.max_hp, Campaign.CAMP_UPGRADES.max_hp.max);
  assert.equal(state.player.upgrades.deck_slots, 0);
  assert.deepEqual(state.player.deckCardIds, ['starter-spears', 'starter-axes'], 'колода без дублей и мусора');
  assert.equal(state.player.originId, null, 'неизвестная земля сбрасывается');
  assert.equal(state.player.historicalCulture.id, 'yamnaya', 'наследие принимается и по идентификатору');
  assert.equal(state.player.wins, 0);
  assert.deepEqual(state.opponents.map(o => o.id), ['reed', 'steppe', 'north']);
  assert.equal(state.opponents[0].era, Campaign.BARBARIAN_ERA_CAP, 'эпоха племени не выше контента колод');
  // нормализация не мутирует исходный объект
  assert.equal(broken.player.glory, -50);
});

test('сила племени растёт от эпохи игрока, а состав колоды — от эпохи племени', () => {
  const res = founded();
  const eraZero = Campaign.getOpponentBattleConfig(res.state, 'reed');
  assert.equal(eraZero.hp, Campaign.COMBAT_BASE.hp);
  assert.equal(eraZero.deckLimit, 4, 'колода каменного века');

  const late = Campaign.clone(res.state);
  late.player.era = 2;
  // племя подтягивается к эпохе игрока (bringBarbariansAlong вызывается при переходе эпохи)
  late.opponents.find(o => o.id === 'reed').era = Campaign.BARBARIAN_ERA_CAP;
  const eraTwo = Campaign.getOpponentBattleConfig(late, 'reed');
  assert.equal(eraTwo.hp, Campaign.COMBAT_BASE.hp + 2);
  assert.equal(eraTwo.energyMax, Campaign.COMBAT_BASE.energyMax + 2);
  assert.ok(eraTwo.deckLimit > eraZero.deckLimit, 'к средневековью колода племени длиннее');

  const deck = Campaign.getOpponentBattleDeck(late, 'reed');
  assert.ok(Array.isArray(deck) && deck.length > 0);
  assert.equal(Campaign.getOpponentBattleConfig(late, 'нет-такого').deckStyle, 'Незнакомое племя');
});

test('модель больше не знает об экономике, стройке, науке и карте', () => {
  for (const word of ['assignWorker', 'getProductionBreakdown', 'finishDay', 'SEASON_LENGTH', 'constructBlueprint', 'researchBlueprint', 'beginRegionExpedition', 'missionRegion', 'settleRegion', 'scienceAdvisorSituation', 'SCIENCE_BRANCHES', 'REGION_BUILDINGS', 'DECREES', 'getStorageCap', 'POP_START']) {
    assert.ok(!source.includes(word), `в campaign.js не должно остаться ${word}`);
  }
  for (const key of ['createState', 'normalizeState', 'foundCampaignState', 'getBattleConfig', 'getOpponentBattleConfig', 'getOpponentBattleDeck', 'recordBattleState', 'buyUpgradeState', 'campSummary', 'toggleDeckCardState', 'cardCraftQuote', 'beginCraftState', 'completeCraftState', 'failCraftState', 'getCultureChoice', 'chooseCultureState', 'load', 'save', 'eraName', 'allowedCardEras', 'describePerks', 'cultureCombatBonus']) {
    assert.ok(key in Campaign, `в модели нет ${key}`);
  }
});
