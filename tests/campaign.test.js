const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const Campaign = require('../campaign.js');
const WorldMap = require('../world-map.js');
const EconomySim = require('../tools/economy-sim.js');

function playableCampaign() {
  const state = Campaign.createState();
  state.player.onboardingComplete = true;
  return state;
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

test('optional first-session guide advances through research, construction, map exploration and a practice battle', () => {
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
  assert.match(guide.next, /Построй «Речная запруда»/);

  if (state.player.ap <= 0) state = Campaign.finishDayState(state).state;
  state = Campaign.constructBlueprint(state, 'opening-food').state;
  guide = Campaign.getFirstSessionGuide(state);
  assert.equal(guide.steps[1].done, true);
  assert.equal(guide.steps[2].done, false);
  assert.match(guide.next, /Мировую карту/);

  let exploration = state.worldMap;
  while (exploration.visited.length < 3) {
    const target = WorldMap.getNeighbors(exploration.current.x, exploration.current.y)
      .find(point => !exploration.visited.includes(WorldMap.tileId(point.x, point.y)));
    assert.ok(target, 'an unvisited adjacent tile should be available');
    const moved = WorldMap.moveToTile(exploration, target.x, target.y);
    assert.equal(moved.error, null);
    exploration = moved.state;
  }
  state = { ...state, worldMap: exploration };
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
  const mapHost = { innerHTML: '' };
  const host = {
    _html: '',
    details: ['first-steps', 'season-menu', 'advisor-context', 'buildings', 'civilization', 'opponents', 'deck'].map(campaignKey => ({ dataset: { campaignKey }, open: false })),
    get innerHTML() { return this._html; },
    set innerHTML(value) { this._html = value; this.details.forEach(detail => { detail.open = false; }); },
    querySelectorAll(selector) {
      const rendered = this.details.filter(detail => this._html.includes(`data-campaign-key=\"${detail.dataset.campaignKey}\"`));
      return selector.includes('[open]') ? rendered.filter(detail => detail.open) : rendered;
    }
  };
  const storage = {
    getItem: key => key === Campaign.STORAGE_KEY ? JSON.stringify(state) : null,
    setItem() {}
  };
  const fakeWindow = {
    WorldMapGenerator: WorldMap,
    localStorage: storage,
    document: { getElementById: id => id === 'campaign-root' ? host : id === 'world-map-root' ? mapHost : null },
    alert() {}
  };
  const sandbox = { window: fakeWindow, console, Date, Math, JSON, Number, String, Object, Array, Set };
  const campaignSource = fs.readFileSync(path.join(__dirname, '..', 'campaign.js'), 'utf8');
  vm.runInNewContext(campaignSource, sandbox);
  fakeWindow.CampaignMvp.render();
  assert.match(host.innerHTML, /class=\"campaign-first-session\"/);
  assert.doesNotMatch(host.innerHTML, /campaign-first-session\" open/);
  assert.match(host.innerHTML, /Исследовать «Рыбные запруды»/);
  assert.match(host.innerHTML, /ДАЛЬШЕ/);
  assert.match(host.innerHTML, /aria-label=\"Дневные возможности\"/);
  assert.match(host.innerHTML, /campaign-day-action/);
  assert.match(host.innerHTML, /Завершить день/);
  assert.match(host.innerHTML, /Открыть мировую карту/);
  assert.doesNotMatch(host.innerHTML, /campaign-world-board|claimRegion|campaign-region/);
  assert.match(mapHost.innerHTML, /class=\"world-map-grid\"/);
  assert.match(mapHost.innerHTML, /world-map-tile biome-riverlands is-home is-current is-selected/);
  assert.equal((mapHost.innerHTML.match(/<button type=\"button\" class=\"world-map-tile /g) || []).length, 49);
  assert.match(host.innerHTML, /<details class=\"campaign-panel campaign-fold campaign-opponents\"/);
  assert.match(host.innerHTML, /<details class=\"campaign-panel campaign-fold campaign-codex\"/);
  assert.doesNotMatch(host.innerHTML, /Очередь пуста/);
  const deckDisclosure = host.details.find(detail => detail.dataset.campaignKey === 'deck');
  deckDisclosure.open = true;
  fakeWindow.CampaignMvp.render();
  assert.equal(deckDisclosure.open, true, 'an open disclosure should survive a full campaign redraw');
});

test('economy simulator includes a territory-independent map exploration scenario', () => {
  const report = EconomySim.runReport();
  const noOrders = report.scenarios.find(s => s.strategy.includes('пропускать дни'));
  assert.ok(noOrders);
  assert.equal(noOrders.day, Campaign.SEASON_LENGTH);
  assert.ok(noOrders.resourcesAtSeasonEnd.food < 30, 'food should be scarce without orders, was ' + noOrders.resourcesAtSeasonEnd.food);
  assert.equal(noOrders.exploration.visited, 1);

  const exploration = report.scenarios.find(s => s.strategy.includes('локальных перехода'));
  assert.ok(exploration);
  assert.equal(exploration.mapMoves, 3);
  assert.equal(exploration.explorationEconomyNeutral, true);
  assert.equal(exploration.mapFinal.visited, 4);
  assert.equal(exploration.resourcesAtSeasonEnd.ap, '2/2');
  assert.deepEqual(exploration.economyAfter, exploration.economyBefore);
});

test('campaign progression and every crafting material quality are independent of the world map', () => {
  const report = EconomySim.runReport();
  const development = report.scenarios.find(scenario => scenario.strategy.includes('исследовать и строить'));
  assert.ok(development);
  assert.equal(development.day, Campaign.SEASON_LENGTH);
  assert.ok(Campaign.ERAS.indexOf(development.eraReached) >= 1, 'should reach at least Неолит, got ' + development.eraReached);
  assert.ok(development.researchOrders > 0);

  const allQualities = ['standard', 'refined', 'masterwork'];
  const refined = report.scenarios.find(scenario => scenario.strategy.includes('Отборное сырьё'));
  assert.ok(refined);
  assert.equal(refined.materialQualityUnlockedAtStart, true);
  assert.deepEqual(refined.availableQualities, allQualities);

  const masterwork = report.scenarios.find(scenario => scenario.strategy === 'Редкое сырьё / Мастерская работа');
  assert.ok(masterwork);
  assert.equal(masterwork.materialQualityUnlockedAtStart, true);
  assert.deepEqual(masterwork.availableQualities, allQualities);
});

test('existing version-two campaign saves do not get redirected into onboarding', () => {
  // simulate a v2 save
  const legacySave = { version: 2, season: 1, day: 5, medals: [], player: { onboardingComplete: true, era: 1, resources: { food: 5, materials: 5, knowledge: 5 } }, opponents: [], regions: [] };
  const restored = Campaign.normalizeState(legacySave);
  assert.equal(restored.player.onboardingComplete, true);
  assert.equal(restored.version, 4);
  assert.equal(restored.worldMap.width, 7);
  assert.deepEqual(restored.worldMap.current, { x: 3, y: 3 });
  // v3 fresh without onboarding should stay false
  const fresh = Campaign.createState();
  delete fresh.player.onboardingComplete;
  const freshRestored = Campaign.normalizeState({ ...fresh, version: 3, player: { ...fresh.player, onboardingComplete: undefined } });
  assert.equal(freshRestored.player.onboardingComplete, false);
});

test('version-two saves migrate old shared orders into separate daily limits without granting a reroll', () => {
  const crafted = Campaign.beginCardCraftState(playableCampaign(), { materialQuality: 'standard', effort: 'quick' }, 0.1);
  assert.equal(crafted.error, null);
  const legacyCraft = structuredClone(crafted.state);
  delete legacyCraft.player.dailyOrders;
  const migratedCraft = Campaign.normalizeState(legacyCraft);
  assert.equal(migratedCraft.player.dailyOrders.craftUsed, true);
  assert.equal(migratedCraft.player.dailyOrders.researchUsed, false);
  assert.equal(migratedCraft.player.actionUsed, true);

  const project = Campaign.addBlueprint(playableCampaign(), draft(), 'both');
  project.state.player.blueprints[0].researched = true;
  project.state.player.blueprints[0].researchedDay = project.state.day;
  project.state.player.actionUsed = true;
  delete project.state.player.dailyOrders;
  const migratedResearch = Campaign.normalizeState(project.state);
  assert.equal(migratedResearch.player.dailyOrders.researchUsed, true);

  const ambiguous = playableCampaign();
  delete ambiguous.player.dailyOrders;
  ambiguous.player.actionUsed = true;
  const migratedAmbiguous = Campaign.normalizeState(ambiguous);
  assert.equal(migratedAmbiguous.player.dailyOrders.legacyBlocked, true);
  assert.match(Campaign.beginCardCraftState(migratedAmbiguous, { materialQuality: 'standard', effort: 'quick' }, 0.1).error, /старый приказ/i);
  assert.equal(Campaign.finishDayState(migratedAmbiguous).state.player.dailyOrders.legacyBlocked, false);
});

test('legacy territory data is discarded while unrelated campaign progress is preserved', () => {
  for (const version of [2, 3]) {
    const old = structuredClone(Campaign.createState());
    old.version = version;
    old.season = 4;
    old.day = 12;
    old.player.name = 'Старое поселение';
    old.player.era = 3;
    old.player.resources = { food: 31, materials: 22, knowledge: 17 };
    old.player.pendingExpedition = { regionId: 'rival-settlement', battleStarted: false };
    old.player.buildings[0].regionId = 'home';
    old.regions = [{ id: 'home', ownerId: 'player' }, { id: 'copper', ownerId: 'player' }];

    const restored = Campaign.normalizeState(old);
    assert.equal(restored.version, 4);
    assert.equal(restored.season, 4);
    assert.equal(restored.day, 12);
    assert.equal(restored.player.name, 'Старое поселение');
    assert.equal(restored.player.era, 3);
    assert.deepEqual(restored.player.resources, { food: 31, materials: 22, knowledge: 17 });
    assert.equal(Object.hasOwn(restored, 'regions'), false);
    assert.equal(Object.hasOwn(restored.player, 'pendingExpedition'), false);
    assert.equal(Object.hasOwn(restored.player.buildings[0], 'regionId'), false);
    assert.equal(restored.worldMap.tiles.length, 49);
    assert.deepEqual(restored.worldMap.current, { x: 3, y: 3 });
    assert.deepEqual(Campaign.normalizeState(restored).worldMap, restored.worldMap, 'missing legacy map seed should remain deterministic');
  }
});

test('legacy storage keys load into the v4 campaign slot without resetting unrelated progress', () => {
  const legacy = structuredClone(Campaign.createState());
  legacy.version = 3;
  legacy.season = 6;
  legacy.day = 19;
  legacy.player.name = 'Сохранённый народ';
  legacy.player.resources = { food: 27, materials: 18, knowledge: 12 };
  legacy.player.era = 4;
  legacy.player.practice.wins = 3;
  legacy.player.buildings[0].regionId = 'home';
  legacy.regions = [{ id: 'home', ownerId: 'player' }];
  delete legacy.worldMap;

  let savedV4 = null;
  const fakeWindow = {
    WorldMapGenerator: WorldMap,
    localStorage: {
      getItem: key => key === 'iforge_campaign_v3' ? JSON.stringify(legacy) : null,
      setItem: (key, value) => { if (key === 'iforge_campaign_v4') savedV4 = value; }
    }
  };
  const source = fs.readFileSync(path.join(__dirname, '..', 'campaign.js'), 'utf8');
  vm.runInNewContext(source, { window: fakeWindow, console, Date, Math, JSON, Number, String, Object, Array, Set });
  const restored = fakeWindow.CampaignMvp.getState();

  assert.equal(restored.version, 4);
  assert.equal(restored.season, 6);
  assert.equal(restored.day, 19);
  assert.equal(restored.player.name, 'Сохранённый народ');
  assert.deepEqual(restored.player.resources, { food: 27, materials: 18, knowledge: 12 });
  assert.equal(restored.player.era, 4);
  assert.equal(restored.player.practice.wins, 3);
  assert.equal(Object.hasOwn(restored, 'regions'), false);
  assert.ok(restored.worldMap.seed.startsWith('legacy-'));
  assert.ok(savedV4, 'migrated state should be written to the v4 storage key');
  assert.equal(JSON.parse(savedV4).version, 4);
});

test('LLM campaign effects are declarative, allowlisted and bounded', () => {
  const safe = Campaign.cleanEffects([{ type: 'max_hp', amount: 1 }, { type: 'income_food', amount: 2 }]);
  assert.deepEqual(safe, [{ type: 'max_hp', amount: 1 }, { type: 'income_food', amount: 2 }]);
  assert.equal(Campaign.cleanEffects([{ type: 'run_javascript', amount: 1 }]), null);
  assert.equal(Campaign.cleanEffects([{ type: 'energy_growth', amount: 99 }]), null);
  assert.equal(Campaign.cleanEffects([{ type: 'deck_slots', amount: 1 }, { type: 'deck_slots', amount: 1 }]), null);
});

test('research and construction have independent limits via AP and can chain on one project', () => {
  let state = Campaign.createState();
  const first = Campaign.addBlueprint(state, draft(), 'both');
  const second = Campaign.addBlueprint(first.state, draft({ scienceName: 'Вторая наука', buildingName: 'Второе здание' }), 'both');
  assert.equal(first.error, null);
  assert.equal(second.error, null);

  const researched = Campaign.researchBlueprint(second.state, first.blueprint.id);
  assert.equal(researched.error, null);
  assert.equal(researched.state.player.blueprints.find(item => item.id === first.blueprint.id).researched, true);
  assert.equal(researched.state.player.dailyOrders.researchUsed, true);
  assert.equal(researched.state.player.dailyOrders.constructionUsed, false);
  assert.equal(researched.state.player.ap, researched.state.player.apMax - 1);
  assert.equal(researched.state.player.blueprints.find(item => item.id === first.blueprint.id).researchedDay, state.day);
  assert.match(Campaign.researchBlueprint(researched.state, second.blueprint.id).error, /исследование уже проведено|AP/);

  const built = Campaign.constructBlueprint(researched.state, first.blueprint.id);
  assert.equal(built.error, null);
  assert.equal(built.state.player.blueprints.find(item => item.id === first.blueprint.id).built, true);
  assert.equal(built.state.player.blueprints.find(item => item.id === first.blueprint.id).builtDay, state.day);
  assert.equal(built.state.player.dailyOrders.constructionUsed, true);
  assert.equal(built.state.player.buildings.length, 2);

  const readySecond = structuredClone(built.state);
  readySecond.player.blueprints.find(item => item.id === second.blueprint.id).researched = true;
  assert.match(Campaign.constructBlueprint(readySecond, second.blueprint.id).error, /строительство уже выполнено|AP/);
});

test('craft, research and construction share AP pool - cannot do everything in one day', () => {
  let state = playableCampaign();
  state.player.resources = { food: 30, materials: 30, knowledge: 30 };
  const added = Campaign.addBlueprint(state, draft(), 'both');
  assert.equal(added.error, null);
  state = added.state;

  const researched = Campaign.researchBlueprint(state, added.blueprint.id);
  assert.equal(researched.error, null);
  state = researched.state;
  const built = Campaign.constructBlueprint(state, added.blueprint.id);
  assert.equal(built.error, null);
  state = built.state;
  // after research+construction, AP should be 0, so craft should fail due to AP
  assert.equal(state.player.ap, 0);
  const crafted = Campaign.beginCardCraftState(state, { materialQuality: 'standard', effort: 'quick' }, 0.1);
  assert.match(crafted.error, /AP/);
  // after finishing day, AP resets
  state = Campaign.finishDayState(state).state;
  assert.equal(state.player.ap, state.player.apMax);
  const crafted2 = Campaign.beginCardCraftState(state, { materialQuality: 'standard', effort: 'quick' }, 0.1);
  assert.equal(crafted2.error, null);
});

test('only active buildings change combat limits and economic buildings give worker bonus', () => {
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
  // check worker bonus
  const breakdown = Campaign.getProductionBreakdown(state);
  assert.ok(breakdown.workerBonus.food > 0);
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
    if (state.player.ap <= 0) state = Campaign.finishDayState(state).state;
    if (state.player.dailyOrders.researchUsed || state.player.dailyOrders.constructionUsed) state = Campaign.finishDayState(state).state;
    state = researchAndBuild(state, draft({ scienceName: `Открытие ${index}`, buildingName: `Здание ${index}` }));
  }
  assert.equal(state.player.activeBuildingSlots, 4);
  assert.equal(state.player.buildings.filter(building => building.active).length, 4);
  const inactive = state.player.buildings.find(building => !building.active);
  if (inactive) {
    const denied = Campaign.toggleBuildingState(state, inactive.id);
    assert.match(denied.error, /активных слота/);
    assert.equal(denied.state.player.buildings.filter(building => building.active).length, 4);
  }
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

test('season reset preserves world exploration independently of campaign progress', () => {
  let state = Campaign.createState();
  state.worldMap = WorldMap.moveToTile(state.worldMap, 4, 3).state;
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
  assert.deepEqual(result.state.worldMap, state.worldMap, 'the separate exploration layer should survive a season reset');
  assert.equal(result.state.medals.length, 1);
  assert.match(result.state.medals[0].name, /Пара и Стали|Новейшее|Будущее|Средневековье|Ренессанс|Античный|Каменный/);
});

test('card craft quote shows material, progression, effort and rarity odds before payment', () => {
  let state = playableCampaign();
  let quote = Campaign.cardCraftQuote(state, { materialQuality: 'standard', effort: 'quick' });
  assert.equal(quote.qualityScore, 0);
  assert.deepEqual(quote.odds, { ordinary: 70, uncommon: 25, rare: 5 });
  assert.deepEqual(quote.cost, { food: 2, materials: 2, knowledge: 0 });

  state.player.craftLevel = 1;
  quote = Campaign.cardCraftQuote(state, { materialQuality: 'refined', effort: 'focused' });
  assert.equal(quote.qualityScore, 3);
  assert.deepEqual(quote.odds, { ordinary: 50, uncommon: 38, rare: 12 });
  assert.deepEqual(quote.cost, { food: 3, materials: 5, knowledge: 1 });

  state.player.craftLevel = 2;
  quote = Campaign.cardCraftQuote(state, { materialQuality: 'masterwork', effort: 'painstaking' });
  assert.equal(quote.qualityScore, 6);
  assert.deepEqual(quote.odds, { ordinary: 15, uncommon: 45, rare: 40 });
  assert.equal(quote.effortDays, 2);
});

test('card craft rolls rarity before generation, pays upfront and routes the model by rarity', () => {
  const initial = playableCampaign();
  const rare = Campaign.beginCardCraftState(initial, { materialQuality: 'masterwork', effort: 'painstaking' }, 0.999, 'Копейная линия');
  assert.equal(rare.error, null);
  assert.equal(rare.order.rarity, 'rare');
  assert.equal(rare.order.modelId, 'glm-5.2');
  assert.deepEqual(rare.order.cost, { food: 4, materials: 8, knowledge: 3 });
  assert.deepEqual(rare.state.player.resources, { food: 6, materials: 2, knowledge: 3 });
  assert.equal(rare.state.player.dailyOrders.craftUsed, true);
  assert.match(Campaign.beginCardCraftState(rare.state, { materialQuality: 'standard', effort: 'quick' }, 0.1).error, /ковка уже заказана|AP/);

  const ordinary = Campaign.beginCardCraftState(initial, { materialQuality: 'standard', effort: 'quick' }, 0, 'Копейная линия');
  assert.equal(ordinary.order.rarity, 'ordinary');
  assert.equal(ordinary.order.modelId, 'gpt-6-luna');
  assert.equal(ordinary.state.player.resources.food, initial.player.resources.food - 2);

  const broke = Campaign.beginCardCraftState({ ...initial, player: { ...initial.player, resources: { food: 0, materials: 0, knowledge: 0 } } }, { materialQuality: 'standard', effort: 'quick' }, 0);
  assert.match(broke.error, /Не хватает ресурсов/);
});

test('crafted cards wait for invested days, become claimable and persist in the collection payload', () => {
  const started = Campaign.beginCardCraftState(playableCampaign(), { materialQuality: 'refined', effort: 'focused' }, 0.8, 'Пращники из холмов');
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
  const started = Campaign.beginCardCraftState(initial, { materialQuality: 'refined', effort: 'focused' }, 0.2);
  const failed = Campaign.failCardCraftState(started.state, started.order.id, 'JSON schema mismatch');
  assert.equal(failed.error, null);
  assert.deepEqual(failed.state.player.resources, initial.player.resources);
  assert.equal(failed.state.player.dailyOrders.craftUsed, false);
  assert.equal(failed.state.player.craftOrders[0].status, 'failed');
  assert.match(failed.state.player.craftOrders[0].failure, /schema mismatch/);
  assert.equal(Campaign.beginCardCraftState(failed.state, { materialQuality: 'standard', effort: 'quick' }, 0.1).error, null);
});

test('science advisor only offers fixed branches unlocked by the current era', () => {
  assert.deepEqual(Campaign.scienceBranchesForEra(0).map(branch => branch.id), ['agriculture', 'stonecraft', 'seasonal', 'warfare']);
  assert.ok(Campaign.scienceBranchesForEra(2).some(branch => branch.id === 'metallurgy'));
  assert.ok(Campaign.scienceBranchesForEra(2).every(branch => branch.id !== 'bronze'));
  assert.ok(Campaign.scienceBranchesForEra(3).some(branch => branch.id === 'bronze'));
});

test('science advice uses cultural context and reserves while exposing only one broad choice', async () => {
  const state = Campaign.completeOnboarding(Campaign.createState(), {
    name: 'Народ Реки', originId: 'river', openingFocusId: 'food'
  }).state;
  const situation = Campaign.scienceAdvisorSituation(state);
  assert.equal(situation.reserves.food, state.player.resources.food);
  assert.ok(situation.biome);
  assert.ok(situation.geography);
  assert.equal(Object.hasOwn(situation, 'regionNames'), false);

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
    WorldMapGenerator: WorldMap,
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
  assert.match(host.innerHTML, /id=\"campaign-project-branch\"/);
  assert.match(host.innerHTML, /campaign-advisor-situation/);
  assert.doesNotMatch(host.innerHTML, /campaign-project-material|campaign-project-visibility/);

  await app.generateProject({ preventDefault() {} });
  const stateAfter = app.getState();
  // new v3.4: 3-choice science, not immediate blueprint
  assert.ok(stateAfter.player.scienceChoices, 'scienceChoices should be set');
  assert.equal(stateAfter.player.scienceChoices.projects.length, 3);
  assert.ok(stateAfter.player.scienceChoices.projects[0].scienceName);
  assert.match(status.textContent, /API-ключ не задан|черновика|разные/);
  assert.equal(button.disabled, false);
  // choose one
  app.chooseScience(0);
  const afterChoose = app.getState();
  assert.equal(afterChoose.player.scienceChoices, null);
  assert.ok(afterChoose.player.blueprints.length > 0);
  assert.equal(afterChoose.player.blueprints[0].visibility, 'both');
  assert.ok(afterChoose.player.chronicle.length > 0, 'chronicle should have entry');
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
  const started = Campaign.beginCardCraftState(initial, { materialQuality: 'refined', effort: 'focused' }, 0.5);
  const recovery = Campaign.recoverInterruptedCardCrafts(started.state);
  assert.equal(recovery.recovered, true);
  assert.deepEqual(recovery.state.player.resources, initial.player.resources);
  assert.equal(recovery.state.player.craftOrders[0].status, 'failed');
  assert.match(recovery.state.player.craftOrders[0].failure, /перезагрузкой/);
});

test('v3: workers and food consumption', () => {
  let state = playableCampaign();
  assert.equal(state.player.population, 5);
  assert.deepEqual(state.player.workers, { food: 2, materials: 1, knowledge: 1, idle: 1 });
  assert.equal(Campaign.getFoodConsumption(state), 5 * 0.7);
  const breakdown = Campaign.getProductionBreakdown(state);
  assert.ok(breakdown.workerProduction.food > 0);
  assert.ok(breakdown.consumption > 0);
  // assign worker
  const moved = Campaign.assignWorkerState(state, 'idle', 'food');
  assert.equal(moved.error, null);
  assert.equal(moved.state.player.workers.food, 3);
  assert.equal(moved.state.player.workers.idle, 0);
});

test('v3: starvation reduces population', () => {
  let state = playableCampaign();
  state.player.resources.food = 0;
  state.player.workers = { food: 0, materials: 0, knowledge: 0, idle: 5 };
  // no food production, consumption 3.5, so starvation
  const result = Campaign.finishDayState(state);
  assert.equal(result.error, null);
  assert.ok(result.starvation);
  assert.ok(result.state.player.population < 5);
});

test('v3: storage cap and rot', () => {
  let state = Campaign.completeOnboarding(Campaign.createState(), { name: 'Тест', originId: 'river', openingFocusId: 'food' }).state;
  state.player.resources.food = 25;
  state.player.buildings = state.player.buildings.slice(0, 1);
  state.player.workers = { food: 5, materials: 0, knowledge: 0, idle: 0 };
  // cap = 15 + 2*1 +3 =20, production ~9.5, consumption 3.5, net +6, 25+6=31, cap 20, excess 11, rot 50% => 25
  const capBefore = Campaign.getStorageCap(state);
  const result = Campaign.finishDayState(state);
  assert.equal(result.error, null);
  const capAfter = Campaign.getStorageCap(result.state);
  // should be >cap but less than without rot
  assert.ok(result.state.player.resources.food < 31, 'should rot excess, got ' + result.state.player.resources.food + ' cap ' + capAfter);
  assert.ok(result.state.player.resources.food >= capBefore, 'should keep at least cap, got ' + result.state.player.resources.food + ' cap ' + capBefore);
});

test('v3: AP system', () => {
  let state = Campaign.completeOnboarding(Campaign.createState(), { name: 'Тест', originId: 'river', openingFocusId: 'food' }).state;
  assert.equal(state.player.ap, 2);
  assert.equal(state.player.apMax, 2);
  const blueprintId = state.player.blueprints[0].id;
  state = Campaign.researchBlueprint(state, blueprintId).state;
  assert.equal(state.player.ap, 1);
  state = Campaign.constructBlueprint(state, blueprintId).state;
  assert.equal(state.player.ap, 0);
  const blocked = Campaign.beginCardCraftState(state, { materialQuality: 'standard', effort: 'quick' }, 0.1);
  assert.match(blocked.error, /AP/);
  state = Campaign.finishDayState(state).state;
  assert.equal(state.player.ap, 2);
});

test('all material grades are available without regional ownership or buildings', () => {
  const state = playableCampaign();
  assert.deepEqual(Campaign.getAvailableMaterialQualities(state), ['standard', 'refined', 'masterwork']);
  for (const materialQuality of ['standard', 'refined', 'masterwork']) {
    const quote = Campaign.cardCraftQuote(state, { materialQuality, effort: 'quick' });
    assert.equal(quote.materialQualityUnlocked, true);
    assert.equal(quote.qualityUnlockText, '');
  }
});
