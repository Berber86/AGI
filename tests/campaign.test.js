const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const Campaign = require('../campaign.js');
const EconomySim = require('../tools/economy-sim.js');

function playableCampaign() {
  const state = Campaign.createState();
  state.player.onboardingComplete = true;
  return state;
}


function controlRegions(state, regionIds) {
  const controlled = new Set(regionIds);
  const result = structuredClone(state);
  result.regions = result.regions.map(region => controlled.has(region.id)
    ? { ...region, ownerId: 'player', capturedDay: result.day }
    : region);
  return result;
}

function draft(overrides = {}) {
  return {
    scienceName: 'Обжиг глины',
    scienceDescription: 'Наблюдение за прочностью сосудов.',
    buildingName: 'Обжиговая мастерская',
    buildingDescription: 'Печь производит долговечную керамику.',
    category: 'economy',
    effects: [{ type: 'income_materials', amount: 1 }],
    ...overrides
  };
}

function researchAndBuild(state, definition) {
  const added = Campaign.addBlueprint(state, definition, 'both');
  assert.equal(added.error, null);
  let researched = Campaign.researchBlueprint(added.state, added.blueprint.id);
  assert.equal(researched.error, null);
  state = Campaign.finishDayState(researched.state).state;
  const built = Campaign.constructBlueprint(state, added.blueprint.id);
  assert.equal(built.error, null);
  return built.state;
}

test('new campaign starts with onboarding; choosing origins and priorities creates a playable start', () => {
  const fresh = Campaign.createState();
  assert.equal(fresh.player.onboardingComplete, false);
  assert.equal(Campaign.completeOnboarding(fresh, { originId: 'not-an-origin', openingFocusId: 'food' }).error !== null, true);

  const result = Campaign.completeOnboarding(fresh, {
    name: 'Дети Реки', originId: 'river', openingFocusId: 'materials'
  });
  assert.equal(result.error, null);
  const player = result.state.player;
  assert.equal(player.onboardingComplete, true);
  assert.equal(player.name, 'Дети Реки');
  assert.equal(player.originId, 'river');
  assert.equal(player.resources.food, fresh.player.resources.food + 2);
  assert.deepEqual(player.deckCardIds, Campaign.STARTER_CARDS.map(card => card.id));
  assert.equal(player.blueprints[0].id, 'opening-materials');
  assert.equal(player.blueprints[0].openingProject, true);
  assert.equal(Campaign.researchBlueprint(result.state, 'opening-materials').error, null);
});

test('optional first-session guide advances through research, construction, expansion and a practice battle', () => {
  const started = Campaign.completeOnboarding(Campaign.createState(), {
    name: 'Народ Реки', originId: 'river', openingFocusId: 'food'
  });
  let state = started.state;
  let guide = Campaign.getFirstSessionGuide(state);
  assert.equal(guide.complete, false);
  assert.equal(guide.completedCount, 0);
  assert.match(guide.next, /Исследуй «Рыбные запруды»/);

  state = Campaign.researchBlueprint(state, 'opening-food').state;
  guide = Campaign.getFirstSessionGuide(state);
  assert.equal(guide.steps[0].done, true);
  assert.match(guide.next, /заверши день/i);

  state = Campaign.finishDayState(state).state;
  guide = Campaign.getFirstSessionGuide(state);
  assert.match(guide.next, /Построй «Речная запруда»/);
  state = Campaign.constructBlueprint(state, 'opening-food').state;
  guide = Campaign.getFirstSessionGuide(state);
  assert.equal(guide.steps[1].done, true);
  assert.equal(guide.steps[2].done, false);
  assert.match(guide.next, /займи соседний нейтральный регион/);

  state = Campaign.finishDayState(state).state;
  state = Campaign.settleRegionState(state, 'floodplain').state;
  guide = Campaign.getFirstSessionGuide(state);
  assert.equal(guide.steps[2].done, true);
  assert.match(guide.next, /тренировочный бой/);

  state = Campaign.recordPractice(state, 'reed', false, false).state;
  guide = Campaign.getFirstSessionGuide(state);
  assert.equal(guide.complete, true);
  assert.equal(guide.completedCount, 4);
});

test('first-session guide is rendered on the live campaign screen', () => {
  const state = Campaign.completeOnboarding(Campaign.createState(), {
    name: 'Тестовый народ', originId: 'river', openingFocusId: 'food'
  }).state;
  const host = { innerHTML: '' };
  const storage = {
    getItem: key => key === Campaign.STORAGE_KEY ? JSON.stringify(state) : null,
    setItem() {}
  };
  const fakeWindow = {
    localStorage: storage,
    document: { getElementById: id => id === 'campaign-root' ? host : null },
    alert() {}
  };
  const sandbox = { window: fakeWindow, console, Date, Math, JSON, Number, String, Object, Array, Set };
  const campaignSource = fs.readFileSync(path.join(__dirname, '..', 'campaign.js'), 'utf8');
  vm.runInNewContext(campaignSource, sandbox);
  fakeWindow.CampaignMvp.render();
  assert.match(host.innerHTML, /class="campaign-first-session"/);
  assert.match(host.innerHTML, /Исследовать «Рыбные запруды»/);
  assert.match(host.innerHTML, /СЛЕДУЮЩИЙ ШАГ/);
  assert.match(host.innerHTML, /campaign-world-board/);
  assert.match(host.innerHTML, /CampaignMvp.claimRegion/);
});

test('the approved 30-day sandbox can reach the final era through full development investment', () => {
  const report = EconomySim.runReport();
  const development = report.scenarios.find(scenario => scenario.strategy === 'исследовать и строить каждый доступный день');
  assert.ok(development);
  assert.equal(development.day, Campaign.SEASON_LENGTH);
  assert.equal(development.eraReached, Campaign.ERAS[Campaign.ERAS.length - 1]);
  assert.ok(development.researchOrders > 0);
  assert.ok(development.constructionOrders > 0);

  const masterwork = report.scenarios.find(scenario => scenario.strategy === 'Редкое сырьё / Мастерская работа');
  assert.equal(masterwork.prerequisiteResearchOrders, 4);
  assert.equal(masterwork.territoryOrders, 4);
  assert.ok(masterwork.cardsClaimed > 0);
  assert.ok(masterwork.materialSites.includes('tin-route'));

  const frontier = report.scenarios.find(scenario => scenario.rivalSettlementCaptured);
  assert.ok(frontier);
  assert.equal(frontier.day, Campaign.SEASON_LENGTH);
  assert.deepEqual(frontier.availableMaterialQualities, ['standard', 'refined', 'masterwork']);
  assert.equal(frontier.forgedCardRarity, 'rare');
});

test('existing version-two campaign saves do not get redirected into onboarding', () => {
  const legacySave = Campaign.createState();
  delete legacySave.player.onboardingComplete;
  const restored = Campaign.normalizeState(legacySave);
  assert.equal(restored.player.onboardingComplete, true);
});

test('legacy saves gain the starting frontier while preserving campaign progress', () => {
  const old = Campaign.createState();
  delete old.regions;
  old.player.name = 'Старое поселение';
  const restored = Campaign.normalizeState(old);
  assert.equal(restored.player.name, 'Старое поселение');
  assert.equal(restored.regions.length, Campaign.REGION_DEFINITIONS.length);
  assert.equal(restored.regions.find(region => region.id === 'home').ownerId, 'player');
  assert.equal(restored.regions.find(region => region.id === 'rival-settlement').ownerId, 'steppe');
  assert.equal(restored.regions.find(region => region.id === 'floodplain').ownerId, null);
});

test('claiming an adjacent neutral region spends one order and adds its daily income', () => {
  let state = Campaign.completeOnboarding(Campaign.createState(), {
    name: 'Дети Реки', originId: 'river', openingFocusId: 'food'
  }).state;
  const regionAction = Campaign.getRegionActionState(state, 'floodplain');
  assert.equal(regionAction.action, 'settle');
  assert.equal(regionAction.enabled, true);
  assert.deepEqual(regionAction.cost, { food: 2, materials: 2, knowledge: 0 });

  const claim = Campaign.settleRegionState(state, 'floodplain');
  assert.equal(claim.error, null);
  assert.equal(claim.state.player.actionUsed, true);
  assert.equal(claim.state.regions.find(region => region.id === 'floodplain').ownerId, 'player');
  assert.equal(claim.state.player.resources.food, state.player.resources.food - 2);
  assert.equal(claim.state.player.resources.materials, state.player.resources.materials - 2);
  assert.match(Campaign.settleRegionState(claim.state, 'hills').error, /крупный приказ/);

  const nextDay = Campaign.finishDayState(claim.state);
  assert.equal(nextDay.error, null);
  assert.equal(nextDay.state.player.resources.food, claim.state.player.resources.food + 4); // base + granary + floodplain
  assert.equal(nextDay.state.player.resources.materials, claim.state.player.resources.materials + 2);
  assert.equal(nextDay.state.player.resources.knowledge, claim.state.player.resources.knowledge + 1);
});

test('frontier claims require adjacency and an era gate, while ore unlocks craft grades', () => {
  let state = playableCampaign();
  state.player.era = 2;
  assert.match(Campaign.getRegionActionState(state, 'copper').reason, /соседний регион/);
  state = Campaign.settleRegionState(state, 'floodplain').state;
  state = Campaign.finishDayState(state).state;
  const copper = Campaign.settleRegionState(state, 'copper');
  assert.equal(copper.error, null);
  assert.deepEqual(Campaign.getAvailableMaterialQualities(copper.state), ['standard', 'refined']);
  assert.match(Campaign.beginCardCraftState(playableCampaign(), { materialQuality: 'refined', effort: 'quick' }).error, /захватить Медный рудник/);

  let withTin = controlRegions(copper.state, ['copper', 'tin-route']);
  assert.deepEqual(Campaign.getAvailableMaterialQualities(withTin), ['standard', 'refined', 'masterwork']);
  const quote = Campaign.cardCraftQuote(withTin, { materialQuality: 'masterwork', effort: 'quick' });
  assert.equal(quote.materialQualityUnlocked, true);
});

test('strategic expedition persists until battle, then a win transfers land and a loss keeps the spend', () => {
  let state = controlRegions(playableCampaign(), ['copper', 'tin-route']);
  state.player.era = 2;
  const available = Campaign.getRegionActionState(state, 'rival-settlement');
  assert.equal(available.action, 'attack');
  assert.equal(available.enabled, true);
  assert.deepEqual(available.cost, { food: 4, materials: 2, knowledge: 0 });

  const launched = Campaign.beginRegionExpeditionState(state, 'rival-settlement');
  assert.equal(launched.error, null);
  assert.equal(launched.match.kind, 'expedition');
  assert.equal(launched.match.regionName, 'Поселение Степного Круга');
  assert.equal(launched.state.player.pendingExpedition.regionId, 'rival-settlement');
  assert.equal(launched.state.player.resources.food, state.player.resources.food - 4);
  assert.equal(launched.state.player.resources.materials, state.player.resources.materials - 2);
  assert.match(Campaign.finishDayState(launched.state).error, /Заверши бой экспедиции/);
  assert.deepEqual(Campaign.normalizeState(launched.state).player.pendingExpedition, launched.state.player.pendingExpedition);

  const victory = Campaign.finishRegionExpeditionState(launched.state, launched.match, true);
  assert.equal(victory.error, null);
  assert.equal(victory.state.regions.find(region => region.id === 'rival-settlement').ownerId, 'player');
  assert.equal(victory.state.player.pendingExpedition, null);
  assert.equal(victory.state.player.practice.leaderWins, 1);
  assert.deepEqual(Campaign.getRegionalIncome(victory.state), { food: 1, materials: 3, knowledge: 1 });

  const defeat = Campaign.finishRegionExpeditionState(launched.state, launched.match, false);
  assert.equal(defeat.error, null);
  assert.equal(defeat.state.regions.find(region => region.id === 'rival-settlement').ownerId, 'steppe');
  assert.equal(defeat.state.player.practice.leaderLosses, 1);
  assert.deepEqual(defeat.state.player.resources, launched.state.player.resources);
});

test('reloading after a territory battle begins records one loss instead of a free retry', () => {
  let state = controlRegions(playableCampaign(), ['copper']);
  state.player.era = 2;
  const launch = Campaign.beginRegionExpeditionState(state, 'rival-settlement');
  assert.equal(launch.error, null);
  const marked = Campaign.markExpeditionBattleStartedState(launch.state, launch.match);
  assert.equal(marked.error, null);
  assert.equal(marked.state.player.pendingExpedition.battleStarted, true);

  const recovered = Campaign.recoverInterruptedExpeditionState(marked.state);
  assert.equal(recovered.recovered, true);
  assert.equal(recovered.state.player.pendingExpedition, null);
  assert.equal(recovered.state.regions.find(region => region.id === 'rival-settlement').ownerId, 'steppe');
  assert.equal(recovered.state.player.practice.leaderLosses, 1);
  assert.deepEqual(recovered.state.player.resources, marked.state.player.resources);
  assert.match(recovered.state.player.campaignNotice, /засчитан как поражение/);

  const beforeBattle = Campaign.recoverInterruptedExpeditionState(launch.state);
  assert.equal(beforeBattle.recovered, false);
  assert.ok(beforeBattle.state.player.pendingExpedition);
});

test('the campaign loader persists an interrupted-expedition loss and displays a notice', () => {
  let state = controlRegions(playableCampaign(), ['copper']);
  state.player.era = 2;
  const launch = Campaign.beginRegionExpeditionState(state, 'rival-settlement');
  const started = Campaign.markExpeditionBattleStartedState(launch.state, launch.match).state;
  let stored = JSON.stringify(started);
  const storage = {
    getItem: key => key === Campaign.STORAGE_KEY ? stored : null,
    setItem: (key, value) => { if (key === Campaign.STORAGE_KEY) stored = value; }
  };
  const fakeWindow = {
    localStorage: storage,
    document: { getElementById: () => null },
    alert() {}
  };
  const sandbox = { window: fakeWindow, console, Date, Math, JSON, Number, String, Object, Array, Set };
  const source = fs.readFileSync(path.join(__dirname, '..', 'campaign.js'), 'utf8');
  vm.runInNewContext(source, sandbox);

  const loaded = fakeWindow.CampaignMvp.getState();
  assert.equal(loaded.player.pendingExpedition, null);
  assert.equal(loaded.player.practice.leaderLosses, 1);
  assert.match(loaded.player.campaignNotice, /засчитан как поражение/);
  assert.equal(JSON.parse(stored).player.pendingExpedition, null);
});

test('pending territory battles cannot be discarded when a season ends', () => {
  let state = controlRegions(playableCampaign(), ['copper']);
  state.player.era = 2;
  const launch = Campaign.beginRegionExpeditionState(state, 'rival-settlement');
  assert.equal(launch.error, null);
  const endSeason = Campaign.completeSeasonState({ ...launch.state, day: Campaign.SEASON_LENGTH });
  assert.match(endSeason.error, /экспедиции/);
});

test('LLM campaign effects are declarative, allowlisted and bounded', () => {
  const safe = Campaign.cleanEffects([{ type: 'max_hp', amount: 1 }, { type: 'income_food', amount: 2 }]);
  assert.deepEqual(safe, [{ type: 'max_hp', amount: 1 }, { type: 'income_food', amount: 2 }]);
  assert.equal(Campaign.cleanEffects([{ type: 'run_javascript', amount: 1 }]), null);
  assert.equal(Campaign.cleanEffects([{ type: 'energy_growth', amount: 99 }]), null);
  assert.equal(Campaign.cleanEffects([{ type: 'deck_slots', amount: 1 }, { type: 'deck_slots', amount: 1 }]), null);
});

test('research unlocks a blueprint before construction and consumes separate daily orders', () => {
  let state = Campaign.createState();
  const added = Campaign.addBlueprint(state, draft(), 'both');
  assert.equal(added.error, null);
  state = added.state;

  const researched = Campaign.researchBlueprint(state, added.blueprint.id);
  assert.equal(researched.error, null);
  assert.equal(researched.state.player.blueprints[0].researched, true);
  assert.equal(researched.state.player.blueprints[0].built, false);
  assert.equal(researched.state.player.actionUsed, true);

  const blocked = Campaign.constructBlueprint(researched.state, added.blueprint.id);
  assert.match(blocked.error, /крупный приказ/);
  state = Campaign.finishDayState(researched.state).state;
  const built = Campaign.constructBlueprint(state, added.blueprint.id);
  assert.equal(built.error, null);
  assert.equal(built.state.player.blueprints[0].built, true);
  assert.equal(built.state.player.buildings.length, 2);
});

test('only active buildings change combat limits and economic buildings are useful too', () => {
  let state = Campaign.createState();
  const added = Campaign.addBlueprint(state, draft({
    category: 'military', effects: [{ type: 'deck_slots', amount: 1 }, { type: 'max_hp', amount: 1 }]
  }), 'allies');
  state = Campaign.researchBlueprint(added.state, added.blueprint.id).state;
  state = Campaign.finishDayState(state).state;
  state = Campaign.constructBlueprint(state, added.blueprint.id).state;
  assert.equal(state.player.buildings[1].active, true);
  assert.equal(Campaign.getBattleConfig(state).deckLimit, 3);
  assert.equal(Campaign.getBattleConfig(state).hp, 6);
  const toggled = Campaign.toggleBuildingState(state, state.player.buildings[1].id);
  assert.equal(toggled.error, null);
  assert.equal(toggled.state.player.buildings[1].active, false);
  assert.equal(Campaign.getBattleConfig(toggled.state).deckLimit, 2);
  assert.equal(Campaign.getBattleConfig(toggled.state).effects.income_food, 1); // remains from the starter granary
});

test('previous local prototypes migrate their building loadout to four slots', () => {
  const old = Campaign.createState();
  old.player.activeBuildingSlots = 2;
  const migrated = Campaign.normalizeState(old);
  assert.equal(migrated.player.activeBuildingSlots, 4);
});

test('the civilization loadout supports four active buildings and rejects a fifth', () => {
  let state = Campaign.createState();
  for (let index = 1; index <= 4; index++) {
    if (state.player.actionUsed) state = Campaign.finishDayState(state).state;
    state = researchAndBuild(state, draft({ scienceName: `Открытие ${index}`, buildingName: `Здание ${index}` }));
  }
  assert.equal(state.player.activeBuildingSlots, 4);
  assert.equal(state.player.buildings.filter(building => building.active).length, 4);
  const inactive = state.player.buildings.find(building => !building.active);
  const denied = Campaign.toggleBuildingState(state, inactive.id);
  assert.match(denied.error, /активных слота/);
  assert.equal(denied.state.player.buildings.filter(building => building.active).length, 4);
});

test('active LLM buildings modify one energy pool and its per-turn growth', () => {
  const added = Campaign.addBlueprint(Campaign.createState(), draft({
    category: 'civic', effects: [{ type: 'energy_cap', amount: 1 }, { type: 'energy_growth', amount: 1 }]
  }), 'both');
  const state = researchAndBuild(added.state, added.blueprint);
  assert.equal(Campaign.getBattleConfig(state).energyMax, 3);
  assert.equal(Campaign.getBattleConfig(state).energyGrowth, 2);
  const disabled = Campaign.toggleBuildingState(state, state.player.buildings[1].id).state;
  assert.equal(Campaign.getBattleConfig(disabled).energyMax, 2);
  assert.equal(Campaign.getBattleConfig(disabled).energyGrowth, 1);
});

test('player and AI dummies advance through eras independently', () => {
  let state = Campaign.createState();
  const initial = state.opponents.map(opponent => opponent.era);
  for (let day = 0; day < 14; day++) state = Campaign.finishDayState(state).state;
  assert.ok(new Set(state.opponents.map(opponent => opponent.era)).size > 1);
  assert.equal(state.player.era, 0);
  assert.deepEqual(initial, [0, 2, 1]);
});

test('AI dummy era changes its local test battle profile', () => {
  const state = Campaign.createState();
  const early = Campaign.getOpponentBattleConfig(state, 'reed');
  const advanced = Campaign.getOpponentBattleConfig(state, 'steppe');
  assert.equal(early.deckLimit, 2);
  assert.equal(early.hp, 5);
  assert.equal(advanced.deckLimit, 3);
  assert.equal(advanced.hp, 6);
  assert.ok(advanced.energyMax > early.energyMax);
});

test('campaign deck selection respects its current building-derived limit', () => {
  let state = Campaign.createState();
  state = Campaign.toggleDeckCardState(state, 'card-a').state;
  state = Campaign.toggleDeckCardState(state, 'card-b').state;
  assert.equal(state.player.deckCardIds.length, 2);
  const denied = Campaign.toggleDeckCardState(state, 'card-c');
  assert.match(denied.error, /лимит колоды 2/);
});

test('AI practice is only local test data and does not change clan rating or resources', () => {
  const state = Campaign.createState();
  const opponent = state.opponents.find(item => item.leader);
  const resources = { ...state.player.resources };
  const result = Campaign.recordPractice(state, opponent.id, true, true);
  assert.equal(result.error, null);
  assert.equal(result.state.player.practice.leaderWins, 1);
  assert.deepEqual(result.state.player.resources, resources);
  assert.equal(result.state.opponents.find(item => item.id === opponent.id).rating, opponent.rating);
});

test('only a medal carries over when the local season is reset', () => {
  let state = Campaign.createState();
  state.day = Campaign.SEASON_LENGTH;
  state.player.era = 4;
  state.player.blueprints.push({ id: 'bp', ...draft(), researched: true, built: false, visibility: 'allies', createdDay: 2 });
  const early = Campaign.completeSeasonState({ ...state, day: 29 });
  assert.match(early.error, /ещё не завершён/);

  const result = Campaign.completeSeasonState(state);
  assert.equal(result.error, null);
  assert.equal(result.state.season, 2);
  assert.equal(result.state.day, 1);
  assert.equal(result.state.player.era, 0);
  assert.equal(result.state.player.blueprints.length, 0);
  assert.deepEqual(result.state.player.deckCardIds, Campaign.STARTER_CARDS.map(card => card.id));
  assert.equal(result.state.player.onboardingComplete, true);
  assert.equal(result.state.medals.length, 1);
  assert.match(result.state.medals[0].name, /Железный век/);
});

test('card craft quote shows material, progression, effort and rarity odds before payment', () => {
  let state = playableCampaign();
  let quote = Campaign.cardCraftQuote(state, { materialQuality: 'standard', effort: 'quick' });
  assert.equal(quote.qualityScore, 0);
  assert.deepEqual(quote.odds, { ordinary: 70, uncommon: 25, rare: 5 });
  assert.deepEqual(quote.cost, { food: 2, materials: 2, knowledge: 0 });

  state.player.craftLevel = 1;
  state = controlRegions(state, ['copper']);
  quote = Campaign.cardCraftQuote(state, { materialQuality: 'refined', effort: 'focused' });
  assert.equal(quote.qualityScore, 3);
  assert.deepEqual(quote.odds, { ordinary: 50, uncommon: 38, rare: 12 });
  assert.deepEqual(quote.cost, { food: 3, materials: 5, knowledge: 1 });

  state.player.craftLevel = 2;
  state = controlRegions(state, ['copper', 'tin-route']);
  quote = Campaign.cardCraftQuote(state, { materialQuality: 'masterwork', effort: 'painstaking' });
  assert.equal(quote.qualityScore, 6);
  assert.deepEqual(quote.odds, { ordinary: 15, uncommon: 45, rare: 40 });
  assert.equal(quote.effortDays, 2);
});

test('card craft rolls rarity before generation, pays upfront and routes the model by rarity', () => {
  const initial = playableCampaign();
  const metalAccess = controlRegions(initial, ['copper', 'tin-route']);
  metalAccess.player.era = 2;
  const rare = Campaign.beginCardCraftState(metalAccess, { materialQuality: 'masterwork', effort: 'painstaking' }, 0.999, 'Копейная линия');
  assert.equal(rare.error, null);
  assert.equal(rare.order.rarity, 'rare');
  assert.equal(rare.order.modelId, 'glm-5.2');
  assert.deepEqual(rare.order.cost, { food: 4, materials: 8, knowledge: 3 });
  assert.deepEqual(rare.state.player.resources, { food: 4, materials: 0, knowledge: 2 });
  assert.equal(rare.state.player.actionUsed, true);

  const ordinary = Campaign.beginCardCraftState(initial, { materialQuality: 'standard', effort: 'quick' }, 0, 'Копейная линия');
  assert.equal(ordinary.order.rarity, 'ordinary');
  assert.equal(ordinary.order.modelId, 'gpt-6-luna');
  assert.equal(ordinary.state.player.resources.food, initial.player.resources.food - 2);

  const broke = Campaign.beginCardCraftState({ ...initial, player: { ...initial.player, resources: { food: 0, materials: 0, knowledge: 0 } } }, { materialQuality: 'standard', effort: 'quick' }, 0);
  assert.match(broke.error, /Не хватает ресурсов/);
});

test('crafted cards wait for invested days, become claimable and persist in the collection payload', () => {
  const copperAccess = controlRegions(playableCampaign(), ['copper']);
  copperAccess.player.era = 2;
  const started = Campaign.beginCardCraftState(copperAccess, { materialQuality: 'refined', effort: 'focused' }, 0.8, 'Пращники из холмов');
  assert.equal(started.error, null);
  assert.equal(started.order.rarity, 'uncommon');
  assert.equal(started.order.modelId, 'glm-5.2');

  const generated = Campaign.completeCardCraftState(started.state, started.order.id, {
    id: 'card-test', name: 'Пращники холмов', card_type: 'unit', atk: 12, hp: 9
  });
  assert.equal(generated.error, null);
  assert.equal(generated.order.status, 'working');
  assert.equal(generated.order.remainingDays, 1);
  assert.equal(generated.card.rarity, 'uncommon');
  assert.equal(generated.card.craftOrderId, started.order.id);
  assert.equal(generated.card.generationModel, 'glm-5.2');

  const nextDay = Campaign.finishDayState(generated.state);
  assert.equal(nextDay.error, null);
  assert.equal(nextDay.state.player.craftOrders[0].status, 'ready');
  const claimed = Campaign.claimCardCraftState(nextDay.state, started.order.id);
  assert.equal(claimed.error, null);
  assert.equal(claimed.card.id, 'card-test');
  assert.equal(claimed.state.player.craftOrders[0].status, 'claimed');
  assert.equal(claimed.state.player.craftOrders[0].card, null);
  assert.equal(claimed.state.player.craftXp, 1);
});

test('invalid generation refunds the upfront investment and frees a same-day order', () => {
  const initial = playableCampaign();
  const copperAccess = controlRegions(initial, ['copper']);
  copperAccess.player.era = 2;
  const started = Campaign.beginCardCraftState(copperAccess, { materialQuality: 'refined', effort: 'focused' }, 0.2);
  const failed = Campaign.failCardCraftState(started.state, started.order.id, 'JSON schema mismatch');
  assert.equal(failed.error, null);
  assert.deepEqual(failed.state.player.resources, initial.player.resources);
  assert.equal(failed.state.player.actionUsed, false);
  assert.equal(failed.state.player.craftOrders[0].status, 'failed');
  assert.match(failed.state.player.craftOrders[0].failure, /schema mismatch/);
});

test('science advisor only offers fixed branches unlocked by the current era', () => {
  assert.deepEqual(Campaign.scienceBranchesForEra(0).map(branch => branch.id), ['agriculture', 'stonecraft', 'seasonal', 'warfare']);
  assert.ok(Campaign.scienceBranchesForEra(2).some(branch => branch.id === 'metallurgy'));
  assert.ok(Campaign.scienceBranchesForEra(2).every(branch => branch.id !== 'bronze'));
  assert.ok(Campaign.scienceBranchesForEra(3).some(branch => branch.id === 'bronze'));
});

test('science advice uses current territory and reserves while exposing only one broad choice', async () => {
  const state = controlRegions(playableCampaign(), ['home', 'floodplain', 'hills']);
  const situation = Campaign.scienceAdvisorSituation(state);
  assert.deepEqual(situation.regionNames, ['Речное поселение', 'Заливная пойма', 'Кремнёвые холмы']);
  assert.deepEqual(situation.localContexts.map(region => region.id), ['home', 'floodplain', 'hills']);
  assert.equal(situation.reserves.food, state.player.resources.food);
  assert.equal(situation.dailyIncome.food, 4);

  const host = { innerHTML: '' };
  const status = { textContent: '' };
  const button = { disabled: false };
  const controls = {
    'campaign-root': host,
    'campaign-project-branch': { value: 'agriculture' },
    'campaign-project-status': status,
    'campaign-project-submit': button
  };
  let stored = JSON.stringify(state);
  const fakeWindow = {
    localStorage: {
      getItem: key => key === Campaign.STORAGE_KEY ? stored : null,
      setItem: (key, value) => { if (key === Campaign.STORAGE_KEY) stored = value; }
    },
    document: { getElementById: id => controls[id] || null },
    getApiKey: () => ''
  };
  const testMath = Object.create(Math);
  testMath.random = () => 0.99;
  const source = fs.readFileSync(path.join(__dirname, '..', 'campaign.js'), 'utf8');
  vm.runInNewContext(source, { window: fakeWindow, Math: testMath, console: { error() {} }, Date, JSON, Number, String, Object, Array, Set });
  const app = fakeWindow.CampaignMvp;
  app.render();
  assert.equal((host.innerHTML.match(/<select\b/g) || []).length, 1);
  assert.match(host.innerHTML, /id="campaign-project-branch"/);
  assert.match(host.innerHTML, /campaign-advisor-situation/);
  assert.doesNotMatch(host.innerHTML, /campaign-project-material|campaign-project-visibility/);

  await app.generateProject({ preventDefault() {} });
  const created = app.getState().player.blueprints[0];
  assert.equal(created.visibility, 'both');
  assert.match(created.buildingName, /^Кремнёвые холмы:/);
  assert.match(status.textContent, /API-ключ не задан/);
  assert.equal(button.disabled, false);
});

test('season cannot discard an active or ready craft and preserves crafting mastery', () => {
  let state = playableCampaign();
  const started = Campaign.beginCardCraftState(state, { materialQuality: 'standard', effort: 'quick' }, 0.1);
  const generated = Campaign.completeCardCraftState(started.state, started.order.id, { id: 'permanent-card', name: 'Пращник', card_type: 'unit' });
  state = { ...generated.state, day: Campaign.SEASON_LENGTH };
  const blocked = Campaign.completeSeasonState(state);
  assert.match(blocked.error, /забери готовые карты/);

  const claimed = Campaign.claimCardCraftState(state, started.order.id);
  const finished = Campaign.completeSeasonState({ ...claimed.state, day: Campaign.SEASON_LENGTH });
  assert.equal(finished.error, null);
  assert.equal(finished.state.player.craftLevel, 0);
  assert.equal(finished.state.player.craftXp, 1);
});

test('craft queue cannot deadlock the last season days or advance during an LLM request', () => {
  const late = { ...playableCampaign(), day: Campaign.SEASON_LENGTH - 1 };
  const tooLong = Campaign.beginCardCraftState(late, { materialQuality: 'standard', effort: 'painstaking' }, 0.5);
  assert.match(tooLong.error, /не хватит дней/);
  assert.deepEqual(tooLong.state.player.resources, late.player.resources);

  const started = Campaign.beginCardCraftState(playableCampaign(), { materialQuality: 'standard', effort: 'quick' }, 0.5);
  const blockedDay = Campaign.finishDayState(started.state);
  assert.match(blockedDay.error, /Дождись ответа кузницы/);
  assert.equal(blockedDay.state.day, started.state.day);
});

test('reloading during model generation compensates the interrupted order', () => {
  const initial = playableCampaign();
  const copperAccess = controlRegions(initial, ['copper']);
  copperAccess.player.era = 2;
  const started = Campaign.beginCardCraftState(copperAccess, { materialQuality: 'refined', effort: 'focused' }, 0.5);
  const recovery = Campaign.recoverInterruptedCardCrafts(started.state);
  assert.equal(recovery.recovered, true);
  assert.deepEqual(recovery.state.player.resources, initial.player.resources);
  assert.equal(recovery.state.player.actionUsed, false);
  assert.equal(recovery.state.player.craftOrders[0].status, 'failed');
  assert.match(recovery.state.player.craftOrders[0].failure, /перезагрузкой/);
});


test('forge and science advisors expose fixed choices without free-text prompt fields', () => {
  const appHtml = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  const campaignSource = fs.readFileSync(path.join(__dirname, '..', 'campaign.js'), 'utf8');
  assert.match(appHtml, /id="forge-advisor-type"/);
  assert.match(appHtml, /id="forge-advisor-direction"/);
  assert.match(appHtml, /id="craft-material-quality"/);
  assert.match(appHtml, /id="craft-effort"/);
  assert.doesNotMatch(appHtml, /id="prompt-input"/);
  assert.match(campaignSource, /id="campaign-project-branch"/);
  assert.doesNotMatch(campaignSource, /id="campaign-project-material"|id="campaign-project-visibility"/);
  assert.doesNotMatch(campaignSource, /campaign-project-word|campaign-project-prompt/);
  assert.doesNotMatch(appHtml, /<textarea\b/i);
});


test('claiming a finished craft stores the exact generated card snapshot in the collection', () => {
  const appHtml = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  const start = appHtml.indexOf('    function claimCraftedCard(orderId) {');
  const end = appHtml.indexOf('    function deleteCard(id) {', start);
  assert.ok(start >= 0 && end > start, 'claimCraftedCard should remain available in the app script');
  const claimFunction = appHtml.slice(start, end);
  const readyCard = { id: 'permanent-card', name: 'Редкий пращник', rarity: 'rare', atk: 77 };
  let storedJson = null;
  let claimedOrderId = null;
  const context = vm.createContext({
    window: { CampaignMvp: {
      getReadyCraftCard(orderId) { return orderId === 'order-1' ? readyCard : null; },
      claimCardCraft(orderId) { claimedOrderId = orderId; return { card: readyCard }; }
    } },
    localStorage: { setItem(key, value) { if (key === 'iforge_collection') storedJson = value; } },
    alert() { throw new Error('unexpected alert'); },
    updateCounters() {},
    renderCollection() {}
  });
  vm.runInContext(`let collection = []; ${claimFunction}
globalThis.runClaim = claimCraftedCard;`, context);
  context.runClaim('order-1');
  const savedCollection = JSON.parse(storedJson);
  assert.equal(savedCollection[0].id, readyCard.id);
  assert.equal(savedCollection[0].rarity, readyCard.rarity);
  assert.equal(savedCollection[0].atk, readyCard.atk);
  assert.equal(claimedOrderId, 'order-1');
});

test('generated card validation preserves high but technically valid mechanics', () => {
  const appHtml = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  const start = appHtml.indexOf('    function validateGeneratedCard(card, expectedType, allowedEras) {');
  const end = appHtml.indexOf('    async function forgeCard() {', start);
  assert.ok(start >= 0 && end > start, 'validateGeneratedCard should remain available in the app script');
  const validator = appHtml.slice(start, end);
  const context = vm.createContext({ KEYWORDS: { armor: { label: 'Armor' } }, validateEffects: effects => effects });
  vm.runInContext(`${validator}\nglobalThis.validateCard = validateGeneratedCard;`, context);
  const card = {
    name: 'Копейщики высокого броска', card_type: 'unit', era: 'ancient', emoji: '⚔️',
    drop_cost: 99, action_cost: 99, hp: 99, atk: 99,
    description: 'Необычно сильный результат кузницы.', tags: [], abilities: [],
    keywords: ['armor:99'], effects: [], monkey_paw: ''
  };
  const validated = context.validateCard(card, 'unit', ['ancient']);
  assert.equal(validated.atk, 99);
  assert.equal(validated.hp, 99);
  assert.equal(validated.drop_cost, 99);
  assert.equal(validated.action_cost, 99);
  assert.equal(validated.keywords[0], 'armor:99');
});
