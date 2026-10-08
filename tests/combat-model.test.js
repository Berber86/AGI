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
    seedId: 'field', historicalCultureId: 'natufian', ...overrides,
  });
}

test('новое состояние: седьмая версия, стартовая слава, три племени и пустая колода', () => {
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

test('основание народа требует оба выбора, складывает имя и не выдаёт шаблонных карт', () => {
  const base = Campaign.createState();
  assert.match(Campaign.foundCampaignState(base, { historicalCultureId: 'natufian' }).error, /замысел/iu);
  assert.match(Campaign.foundCampaignState(base, { seedId: 'field' }).error, /наследие/iu);

  const res = founded();
  assert.equal(res.error, null);
  // наследие «Натуф» даёт основу имени, замысел «Пашня и зерно» — судьбу в родительном падеже
  assert.equal(res.state.player.name, 'Натуфийские жнецы Пашни');
  assert.equal(res.state.player.name, Campaign.peopleName(res.state.player.historicalCulture,
    Campaign.SEED_CHOICES.find(seed => seed.id === res.state.player.seedChoiceId)));
  assert.equal(res.state.player.onboardingComplete, true);
  assert.equal(res.state.player.historicalCulture.id, 'natufian');
  assert.deepEqual(res.state.player.culturalLineage, ['natufian']);
  assert.match(res.state.player.chronicle[0].text, /вышел из культуры Натуф/u);
  assert.match(res.state.player.chronicle[0].text, /с замыслом «Пашня и зерно»/u);
  // повторно основать народ нельзя
  assert.match(Campaign.foundCampaignState(res.state, { seedId: 'field', historicalCultureId: 'natufian' }).error, /уже основан/iu);
});

test('игрок начинает с пустой колодой, а шаблоны остаются только в NPC-ополчении', () => {
  const res = founded();
  assert.deepEqual(res.state.player.deckCardIds, [], 'основание не добавляет никаких карт игроку');
  assert.equal(Campaign.MILITIA_CORE_CARDS.length, 8, 'NPC получает историческое ядро ополчения');
  assert.equal(new Set(Campaign.MILITIA_CORE_CARDS.map(card => card.id)).size, Campaign.MILITIA_CORE_CARDS.length, 'ID NPC-карт уникальны');
  assert.ok(Campaign.MILITIA_CORE_CARDS.every(card => Campaign.isNpcMilitiaCardId(card.id)), 'шаблоны помечены как NPC-only');
  assert.equal(Campaign.getBattleConfig(res.state).openingHand, 1, 'обычная черта открывает одну карту');

  const sky = founded({ seedId: 'sky' });
  const cfg = Campaign.getBattleConfig(sky.state);
  assert.equal(cfg.openingHand, 2, 'Знаки неба дают вторую карту в стартовую руку');
  assert.equal(cfg.energyMax, Campaign.COMBAT_BASE.energyMax, 'черта руки отдельно тестируется и не маскируется под бонус энергии');
});

test('боевые параметры складываются из замысла, наследия и лагеря', () => {
  const res = founded({ seedId: 'river', historicalCultureId: 'trypillia' });
  const perks = Campaign.combatPerks(res.state);
  // замысел «Река и разлив»: +1 здоровье; наследие Триполья: +1 здоровье
  assert.equal(perks.max_hp, 2);
  const cfg = Campaign.getBattleConfig(res.state);
  assert.equal(cfg.hp, Campaign.COMBAT_BASE.hp + 2);
  assert.equal(cfg.origin, undefined, 'земли в конфигурации вождя больше нет');
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
  // самый «сильный» набор: Ямная культура и «Камень и горн» дают +2 к атаке уже на старте
  const res = founded({ seedId: 'forge', historicalCultureId: 'yamnaya' });
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

test('колода принимает только карты из коллекции, соблюдает лимит и позволяет убрать карту', () => {
  const res = founded();
  const cfg = Campaign.getBattleConfig(res.state);
  const collection = Array.from({ length: cfg.deckLimit + 1 }, (_, i) => ({ id: `card-generated-${i}` }));
  const owned = collection.map(card => card.id);
  let state = res.state;
  assert.match(Campaign.toggleDeckCardState(state, owned[0]).error, /коллекции/u, 'без списка принадлежащих карт добавление запрещено');
  assert.match(Campaign.toggleDeckCardState(state, 'not-owned', owned).error, /коллекции/u, 'чужой ID не принимается');
  assert.match(Campaign.toggleDeckCardState(state, Campaign.MILITIA_CORE_CARDS[0].id, owned).error, /ополчения/u, 'NPC-шаблон нельзя добавить даже при поддельном ownership');

  for (const id of owned.slice(0, cfg.deckLimit)) {
    const out = Campaign.toggleDeckCardState(state, id, owned);
    assert.equal(out.error, null);
    state = out.state;
  }
  assert.equal(state.player.deckCardIds.length, cfg.deckLimit);
  const overflow = Campaign.toggleDeckCardState(state, owned[cfg.deckLimit], owned);
  assert.match(overflow.error, /Предел|предел|Знамя дружины/u);
  assert.equal(overflow.state.player.deckCardIds.length, cfg.deckLimit);
  const back = Campaign.toggleDeckCardState(state, state.player.deckCardIds[0], owned);
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

test('сохранение версии 6 переносится, но его жёстко заданные карты удаляются из колоды', () => {
  const old = founded({ seedId: 'sky' }).state;
  old.version = 6;
  old.player.deckCardIds = ['starter-spears', 'militia-core-spears', 'card-forged', 'card-forged'];
  const migrated = Campaign.normalizeState(old);
  assert.equal(migrated.version, Campaign.SAVE_VERSION);
  assert.equal(migrated.player.onboardingComplete, true);
  assert.equal(migrated.player.seedChoiceId, 'sky');
  assert.deepEqual(migrated.player.deckCardIds, ['card-forged']);
  assert.equal(Campaign.getBattleConfig(migrated).openingHand, 2);
});

test('normalizeState приводит поля прототипа и отбрасывает мусор', () => {
  const base = founded().state;
  const broken = Campaign.clone(base);
  broken.player.glory = -50;
  broken.player.gloryTotal = 'много';
  broken.player.upgrades.max_hp = 99;
  broken.player.upgrades.deck_slots = -3;
  broken.player.deckCardIds = ['card-owned', 'starter-spears', 'card-owned', 42, null, 'militia-core-axes'];
  broken.player.historicalCulture = { id: 'yamnaya' };
  broken.player.wins = -4;
  broken.opponents = [{ id: 'reed', era: 9, rating: 0 }, { id: 'unknown' }];
  const state = Campaign.normalizeState(broken);
  assert.equal(state.player.glory, 0);
  assert.equal(state.player.gloryTotal, 0);
  assert.equal(state.player.upgrades.max_hp, Campaign.CAMP_UPGRADES.max_hp.max);
  assert.equal(state.player.upgrades.deck_slots, 0);
  assert.deepEqual(state.player.deckCardIds, ['card-owned'], 'сохраняются только уникальные пользовательские карты, старые шаблоны ополчения удаляются');
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
  assert.equal(eraZero.hp, Campaign.COMBAT_BASE.hp + 1, 'вождь племени крепче базового вождя игрока');
  assert.equal(eraZero.deckLimit, 4, 'колода каменного века');

  const late = Campaign.clone(res.state);
  late.player.era = 2;
  // племя подтягивается к эпохе игрока (bringBarbariansAlong вызывается при переходе эпохи)
  late.opponents.find(o => o.id === 'reed').era = Campaign.BARBARIAN_ERA_CAP;
  const eraTwo = Campaign.getOpponentBattleConfig(late, 'reed');
  // Вождь племени крепче базового на единицу и дальше растёт на +1 за эпоху угрозы (см. campaign.js).
  assert.equal(eraTwo.hp, Campaign.opponentHpFor(2));
  assert.ok(eraTwo.hp > eraZero.hp, 'с ростом угрозы вождь племени крепче');
  // Энергия врага растёт потолком (2, 3, 4, 5, 5, 5, 6 по эпохам угрозы), а прирост остаётся 1 до
  // Будущего: прежняя кривая поднимала и потолок, и прирост, и племя выводило два отряда там, где
  // игрок — один (см. комментарий в campaign.js и docs/BALANCE_REWORK_2026-10-08.md).
  assert.deepEqual(Campaign.opponentEnergyFor(2), { energyMax: 4, energyGrowth: 1 });
  assert.ok(eraTwo.energyMax > eraZero.energyMax, 'с ростом угрозы предел энергии врага выше');
  assert.ok(eraTwo.deckLimit > eraZero.deckLimit, 'к средневековью колода племени длиннее');
  assert.equal(eraTwo.atkBonus, 0, 'доктрина племени появляется только в Новейшее время');
  assert.equal(Campaign.opponentAtkBonusFor(5), 1);
  assert.equal(Campaign.opponentAtkBonusFor(6), 1, 'доктрина племени слабее доктрины игрока (+2)');

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
