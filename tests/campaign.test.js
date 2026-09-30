const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const Campaign = require('../campaign.js');
const CampaignMap = require('../campaign-map.js');
const EconomySim = require('../tools/economy-sim.js');
const TEST_SEED = 12345;

function playableCampaign() {
  const state = Campaign.createState(TEST_SEED);
  state.player.onboardingComplete = true;
  return state;
}

function mapTileId(state, key) {
  const tiles = state.world.tiles;
  const find = predicate => tiles.find(tile => predicate(tile) && !tile.guard)?.id
    || tiles.find(predicate)?.id || null;
  if (tiles.some(tile => tile.id === key)) return key;
  switch (key) {
    case 'home': return find(tile => tile.x === CampaignMap.CENTER.x && tile.y === CampaignMap.CENTER.y);
    case 'floodplain':
    case 'oasis': {
      const home = tiles.find(tile => tile.x === CampaignMap.CENTER.x && tile.y === CampaignMap.CENTER.y);
      const adjacentFood = home.neighbors.map(id => tiles.find(tile => tile.id === id))
        .find(tile => tile?.terrain !== 'water' && tile.siteType === 'food');
      return adjacentFood?.id || find(tile => tile.siteType === 'food');
    }
    case 'hills':
    case 'calendar': return find(tile => tile.siteType === 'knowledge' && tile.kind === 'resource')
      || find(tile => tile.siteType === 'materials' && tile.kind === 'resource');
    case 'copper': return find(tile => tile.feature === 'copper-vein');
    case 'tin-route': return find(tile => tile.feature === 'tin-route');
    case 'salt-flats': return find(tile => tile.feature === 'salt-deposit');
    case 'rival-settlement': return find(tile => tile.kind === 'settlement' && tile.initialOwner === 'steppe')
      || find(tile => tile.kind === 'settlement');
    default: return null;
  }
}

function controlRegions(state, regionIds) {
  const controlled = new Set(regionIds.map(regionId => mapTileId(state, regionId) || regionId));
  const result = structuredClone(state);
  result.regions = result.regions.map(region => controlled.has(region.id)
    ? { ...region, ownerId: 'player', capturedDay: result.day, building: region.building || null }
    : region);
  return result;
}

function controlRegionsWithBuildings(state, regionBuildingMap) {
  // Keys may name a generated tile directly or a map fixture (copper, tin-route, etc.).
  const mappedBuildings = new Map(Object.entries(regionBuildingMap).map(([regionId, buildingId]) => [mapTileId(state, regionId) || regionId, buildingId]));
  const result = structuredClone(state);
  result.regions = result.regions.map(region => {
    if (mappedBuildings.has(region.id)) {
      return { ...region, ownerId: 'player', capturedDay: result.day, building: mappedBuildings.get(region.id) };
    }
    return region;
  });
  return result;
}

function adjacentLandTileId(state, tileId) {
  const tile = state.world.tiles.find(item => item.id === tileId);
  return tile?.neighbors.find(id => state.world.tiles.find(item => item.id === id)?.terrain !== 'water') || null;
}

function grantExpeditionAccess(state, targetKey = 'rival-settlement') {
  const targetId = mapTileId(state, targetKey);
  const neighborId = adjacentLandTileId(state, targetId);
  assert.ok(targetId && neighborId, 'generated map should have a land neighbor beside the rival settlement');
  return controlRegions(state, [neighborId]);
}

function claimNeutralRegion(state, regionId, won = true) {
  const action = Campaign.getRegionActionState(state, regionId);
  if (action.action === 'quest') {
    const expedition = Campaign.beginRegionExpeditionState(state, regionId);
    assert.equal(expedition.error, null);
    return Campaign.finishRegionExpeditionState(expedition.state, expedition.match, won);
  }
  return Campaign.settleRegionState(state, regionId);
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

// Приём проекта в кодекс тратит приказ «Исследование»: проект берут одним днём, изучают следующим.
function researchAndBuild(state, definition) {
  const added = Campaign.addBlueprint(state, definition, 'both');
  assert.equal(added.error, null);
  assert.equal(added.state.player.dailyOrders.researchUsed, true, 'приём проекта занимает приказ «Исследование»');
  state = Campaign.finishDayState(added.state).state;
  const researched = Campaign.researchBlueprint(state, added.blueprint.id);
  assert.equal(researched.error, null);
  state = Campaign.finishDayState(researched.state).state;
  const built = Campaign.constructBlueprint(state, added.blueprint.id);
  assert.equal(built.error, null);
  return built.state;
}

test('procedural world generation is reproducible, rectangular and connected by four-way neighbors', () => {
  const opponents = Campaign.createState(TEST_SEED).opponents;
  const world = CampaignMap.generateWorld(TEST_SEED, opponents);
  assert.deepEqual(CampaignMap.generateWorld(TEST_SEED, opponents), world, 'the same seed should reproduce the saved map');
  assert.equal(world.size, 7);
  assert.equal(world.tiles.length, 49);
  assert.equal(new Set(world.tiles.map(tile => tile.id)).size, 49);
  assert.equal(new Set(world.tiles.map(tile => tile.name)).size, 49);
  assert.ok(world.rivers.length > 0, 'generated geography should include a river landmark');

  const center = world.tiles.find(tile => tile.x === 3 && tile.y === 3);
  assert.equal(center.id, 'tile-3-3');
  assert.equal(center.kind, 'home');
  assert.equal(center.initialOwner, 'player');
  assert.ok(center.neighbors.every(id => world.tiles.find(tile => tile.id === id)?.terrain !== 'water'), 'the four starting directions should be land');
  for (const tile of world.tiles) {
    assert.ok(tile.name && tile.description.length >= 40, `${tile.id} should have a local name and a substantive description`);
    const expectedNeighbors = CampaignMap.neighborsOf(tile.x, tile.y);
    assert.deepEqual(tile.neighbors, expectedNeighbors, `${tile.id} uses only orthogonal neighbors`);
    for (const neighborId of tile.neighbors) {
      const neighbor = world.tiles.find(other => other.id === neighborId);
      assert.ok(neighbor.neighbors.includes(tile.id), 'four-way adjacency should be symmetric');
    }
  }
  assert.ok(world.tiles.some(tile => tile.feature === 'copper-vein'));
  assert.ok(world.tiles.some(tile => tile.feature === 'tin-route'));
  assert.equal(world.tiles.filter(tile => tile.kind === 'settlement').length, opponents.length);
  const guardCandidates = world.tiles.filter(tile => tile.kind === 'resource' && tile.terrain !== 'water');
  const guarded = guardCandidates.filter(tile => tile.guard);
  assert.equal(guarded.length, Math.floor(guardCandidates.length / 2), 'about half of neutral land should get quest guards');
  assert.ok(guarded.every(tile => tile.guard.id === 'guard-' + tile.id && tile.guard.name && tile.guard.clan && tile.guard.era >= tile.minEra));
  assert.ok(world.tiles.filter(tile => tile.kind === 'settlement' || tile.kind === 'home' || tile.terrain === 'water').every(tile => !tile.guard));
});

test('every generated world keeps at least one unguarded land tile next to the start', () => {
  const opponents = Campaign.createState(TEST_SEED).opponents;
  for (let seed = 1; seed <= 600; seed++) {
    const world = CampaignMap.generateWorld(seed, opponents);
    const home = world.tiles.find(tile => tile.kind === 'home');
    const adjacentLand = home.neighbors
      .map(id => world.tiles.find(tile => tile.id === id))
      .filter(tile => tile && tile.kind === 'resource' && tile.terrain !== 'water');
    assert.ok(adjacentLand.length > 0, `world ${seed} should have land next to the start`);
    assert.ok(adjacentLand.some(tile => !tile.guard), `world ${seed} should keep a free neighbour for the tutorial settle step`);
  }
});

test('map vision uses a two-cell four-way radius and expands from every owned region', () => {
  const opponents = Campaign.createState(TEST_SEED).opponents;
  const world = CampaignMap.generateWorld(TEST_SEED, opponents);
  const center = CampaignMap.tileId(CampaignMap.CENTER.x, CampaignMap.CENTER.y);
  const visible = CampaignMap.getVisibleTileIds(world, [center], 2);
  const expected = world.tiles.filter(tile => Math.abs(tile.x - 3) + Math.abs(tile.y - 3) <= 2).map(tile => tile.id);
  assert.deepEqual(visible, expected);
  assert.equal(CampaignMap.getVisibleTileIds(world, [center], 1).length, 5);

  const state = Campaign.createState(TEST_SEED);
  assert.deepEqual(Campaign.getVisibleRegionIds(state), expected);
  const nextOwnedId = CampaignMap.tileId(4, 3);
  const expanded = structuredClone(state);
  expanded.regions.find(region => region.id === nextOwnedId).ownerId = 'player';
  const expandedVisible = new Set(Campaign.getVisibleRegionIds(expanded));
  assert.ok(expandedVisible.has(CampaignMap.tileId(6, 3)), 'the next ring becomes visible from newly owned land');
  assert.equal(Campaign.getRegionActionState(state, CampaignMap.tileId(6, 3)).reason, 'Эта область скрыта туманом войны.');
  assert.match(Campaign.settleRegionState(state, CampaignMap.tileId(6, 3)).error, /скрыта туманом войны/);
  assert.match(Campaign.beginRegionExpeditionState(state, CampaignMap.tileId(6, 3)).error, /скрыта туманом войны/);

  const liveApi = globalThis.CampaignMvp;
  const liveState = liveApi.getState();
  const liveVisible = new Set(Campaign.getVisibleRegionIds(liveState));
  const hiddenTile = liveState.world.tiles.find(tile => !liveVisible.has(tile.id));
  assert.ok(hiddenTile);
  assert.ok(!liveApi.getWorldMap().some(tile => tile.id === hiddenTile.id), 'the legacy public map API must not leak hidden tiles');
  assert.equal(liveApi.getMapTile(hiddenTile.id), null);
});

test('map generation remains valid across a broad set of seeds', () => {
  const opponents = Campaign.createState(TEST_SEED).opponents;
  for (let seed = 0; seed < 100; seed++) {
    const world = CampaignMap.generateWorld(seed, opponents);
    assert.equal(world.tiles.length, 49, `seed ${seed} must contain exactly 49 cells`);
    assert.equal(world.tiles.find(tile => tile.x === 3 && tile.y === 3).initialOwner, 'player');
    assert.ok(world.tiles.every(tile => tile.name && tile.description));
    assert.ok(world.tiles.some(tile => tile.feature === 'copper-vein'));
    assert.ok(world.tiles.some(tile => tile.feature === 'tin-route'));
    assert.equal(world.tiles.filter(tile => tile.kind === 'settlement').length, opponents.length);
    const candidates = world.tiles.filter(tile => tile.kind === 'resource' && tile.terrain !== 'water');
    assert.equal(candidates.filter(tile => tile.guard).length, Math.floor(candidates.length / 2), `seed ${seed} should guard about half the neutral land`);
  }
});

test('regional building names and flavor use deterministic local site templates', () => {
  const world = CampaignMap.generateWorld(TEST_SEED, Campaign.createState(TEST_SEED).opponents);
  const siteTypes = ['food', 'materials', 'knowledge', 'copper', 'tin', 'salt', 'settlement'];
  for (const siteType of siteTypes) {
    const tile = world.tiles.find(candidate => candidate.siteType === siteType);
    assert.ok(tile, `generated map should contain a ${siteType} site`);
    const flavor = Campaign.generateLocalRegionFlavor(tile, 9876);
    assert.deepEqual(flavor, Campaign.generateLocalRegionFlavor(tile, 9876), 'local building flavor should be reproducible');
    assert.ok(flavor.name && flavor.description);
    assert.ok(Campaign.DIVERSITY_POOLS.regionEvents[siteType].some(event => flavor.description.startsWith(event + '.')),
      `the ${siteType} site should use a relevant local description`);
  }
});

test('campaign state stores its generated map and starts only in the center', () => {
  const state = Campaign.createState(TEST_SEED);
  const normalized = Campaign.normalizeState(JSON.parse(JSON.stringify(state)));
  const centerId = CampaignMap.tileId(CampaignMap.CENTER.x, CampaignMap.CENTER.y);
  assert.equal(state.version, 4);
  assert.equal(state.world.seed, TEST_SEED);
  assert.equal(state.world.tiles.length, 49);
  assert.deepEqual(normalized.world, state.world);
  assert.equal(state.regions.length, 49);
  assert.deepEqual(state.regions.filter(region => region.ownerId === 'player').map(region => region.id), [centerId]);
});

test('new campaign starts with onboarding; choosing origins and priorities creates a playable start', () => {
  const fresh = Campaign.createState(TEST_SEED);
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
  const started = Campaign.completeOnboarding(Campaign.createState(TEST_SEED), {
    name: 'Народ Реки', originId: 'river', openingFocusId: 'food'
  });
  let state = started.state;
  let guide = Campaign.getFirstSessionGuide(state);
  assert.equal(guide.complete, false);
  assert.equal(guide.completedCount, 0);
  assert.match(guide.next, /Изучите «Рыбные запруды»/);

  state = Campaign.researchBlueprint(state, 'opening-food').state;
  guide = Campaign.getFirstSessionGuide(state);
  assert.equal(guide.steps[0].done, true);
  assert.match(guide.next, /Постройте «Речная запруда»/);

  // need AP for second action, finish day if needed
  if (state.player.ap <= 0) state = Campaign.finishDayState(state).state;
  state = Campaign.constructBlueprint(state, 'opening-food').state;
  guide = Campaign.getFirstSessionGuide(state);
  assert.equal(guide.steps[1].done, true);
  assert.equal(guide.steps[2].done, false);
  // after two actions AP is 0, so the guide mentions the frontier limit
  assert.match(guide.next, /соседнюю нейтральную область/);

  if (state.player.ap <= 0 || state.player.dailyOrders.frontierUsed) state = Campaign.finishDayState(state).state;
  const foodTileId = mapTileId(state, 'floodplain');
  const expansion = claimNeutralRegion(state, foodTileId);
  assert.equal(expansion.error, null);
  state = expansion.state;
  guide = Campaign.getFirstSessionGuide(state);
  assert.equal(guide.steps[2].done, true);
  assert.match(guide.next, /тренировочный бой/);

  state = Campaign.recordPractice(state, 'reed', false, false).state;
  guide = Campaign.getFirstSessionGuide(state);
  assert.equal(guide.complete, true);
  assert.equal(guide.completedCount, 4);
});

test('first-session guide is rendered on the live campaign screen', () => {
  const state = Campaign.completeOnboarding(Campaign.createState(TEST_SEED), {
    name: 'Тестовый народ', originId: 'river', openingFocusId: 'food'
  }).state;
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
    CampaignMap: require('../campaign-map.js'),
    localStorage: storage,
    document: { getElementById: id => id === 'campaign-root' ? host : null },
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
  assert.match(host.innerHTML, /campaign-world-board/);
  assert.match(host.innerHTML, /CampaignMvp.selectMapTile/);
  assert.equal((host.innerHTML.match(/class="campaign-map-cell /g) || []).length, 49, 'the live campaign renders exactly 49 map cells');
  assert.match(host.innerHTML, /class="campaign-map-cell is-owned is-home is-selected" data-terrain="[^"]+"[^>]+data-feature="[^"]*"[^>]+aria-pressed="true"[^>]+aria-label="[^"]+"[^>]+title="[^"]+"[^>]+onclick="CampaignMvp\.selectMapTile\('tile-3-3'\)"/, 'the central starting settlement is marked on the map');
  assert.match(host.innerHTML, /<details class=\"campaign-panel campaign-fold campaign-opponents\"/);
  assert.match(host.innerHTML, /<details class=\"campaign-panel campaign-fold campaign-codex\"/);
  assert.doesNotMatch(host.innerHTML, /Очередь пуста/);
  const deckDisclosure = host.details.find(detail => detail.dataset.campaignKey === 'deck');
  deckDisclosure.open = true;
  fakeWindow.CampaignMvp.render();
  assert.equal(deckDisclosure.open, true, 'an open disclosure should survive a full campaign redraw');
});

test('v3 economy: no orders leads to scarcity not abundance, and region without building gives 0', () => {
  const report = EconomySim.runReport();
  const noOrders = report.scenarios.find(s => s.strategy.includes('пропускать дни'));
  assert.ok(noOrders);
  assert.equal(noOrders.day, Campaign.SEASON_LENGTH);
  // v2 had 97 food, v3 should have much less
  assert.ok(noOrders.resourcesAtSeasonEnd.food < 30, 'food should be scarce without orders, was ' + noOrders.resourcesAtSeasonEnd.food);
  assert.equal(noOrders.regionalDailyIncome.food, 0, 'empty region gives 0');
  assert.equal(noOrders.regionsWithBuildings, 0);
});

test('the approved 30-day sandbox can progress through eras and unlock masterwork via buildings', () => {
  const report = EconomySim.runReport();
  const development = report.scenarios.find(scenario => scenario.strategy.includes('исследовать и строить'));
  assert.ok(development);
  assert.equal(development.day, Campaign.SEASON_LENGTH);
  // v3: with AP 2/day, reaching final era in 30 days is hard, but should reach at least Neolithic
  assert.ok(Campaign.ERAS.indexOf(development.eraReached) >= 1, 'should reach at least Неолит, got ' + development.eraReached);
  assert.ok(development.researchOrders > 0);

  const refined = report.scenarios.find(scenario => scenario.strategy.includes('Отборное сырьё'));
  assert.ok(refined);
  assert.ok(refined.prerequisiteResearchOrders >= 2);
  assert.ok(refined.territoryOrders >= 2);
  assert.ok(refined.questBattles >= 1, 'economy paths should resolve the generated quest guards');
  assert.ok(refined.buildingOrders >= 1 || refined.regionsWithBuildings >= 1);
  assert.ok(refined.availableQualities.includes('refined'));

  const masterwork = report.scenarios.find(scenario => scenario.strategy === 'Редкое сырьё / Мастерская работа');
  assert.ok(masterwork);
  assert.ok(masterwork.materialSiteFeatures.includes('tin-route'));
  assert.ok(masterwork.materialSites.every(id => /^tile-\d-\d$/.test(id)), 'material-site references should be generated cell IDs');
  assert.ok(masterwork.availableQualities.includes('masterwork'));

  const frontier = report.scenarios.find(scenario => scenario.rivalSettlementCaptured);
  assert.ok(frontier, 'frontier scenario should capture rival settlement');
  assert.ok(frontier.questBattles > 0, 'the frontier simulation should account for guard fights along its route');
  assert.equal(frontier.day, Campaign.SEASON_LENGTH);
  assert.deepEqual(frontier.availableMaterialQualities, ['standard', 'refined', 'masterwork']);
  assert.equal(frontier.forgedCardRarity, 'rare');
});

test('existing version-two campaign saves do not get redirected into onboarding', () => {
  // simulate a v2 save
  const legacySave = { version: 2, season: 1, day: 5, medals: [], player: { onboardingComplete: true, era: 1, resources: { food: 5, materials: 5, knowledge: 5 } }, opponents: [], regions: [] };
  const restored = Campaign.normalizeState(legacySave);
  assert.equal(restored.player.onboardingComplete, true);
  assert.equal(restored.version, 4);
  // v3 fresh without onboarding should stay false
  const fresh = Campaign.createState(TEST_SEED);
  delete fresh.player.onboardingComplete;
  const freshRestored = Campaign.normalizeState({ ...fresh, version: 3, player: { ...fresh.player, onboardingComplete: undefined } });
  assert.equal(freshRestored.player.onboardingComplete, false);
});

test('version-two saves migrate old shared orders into separate daily limits without granting a reroll', () => {
  const crafted = Campaign.beginCardCraftState(playableCampaign(), { materialQuality: 'standard', effort: 'quick' }, 0.1);
  assert.equal(crafted.error, null);
  const legacyCraft = structuredClone(crafted.state);
  legacyCraft.version = 2;
  delete legacyCraft.player.dailyOrders;
  const migratedCraft = Campaign.normalizeState(legacyCraft);
  assert.equal(migratedCraft.player.dailyOrders.craftUsed, true);
  assert.equal(migratedCraft.player.dailyOrders.researchUsed, false);
  assert.equal(migratedCraft.player.actionUsed, true);

  const project = Campaign.addBlueprint(playableCampaign(), draft(), 'both');
  project.state.version = 2;
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

test('v3 territory is replaced while campaign progress and deck choices survive migration', () => {
  const legacy = playableCampaign();
  legacy.version = 3;
  delete legacy.world;
  legacy.regions = [
    { id: 'home', ownerId: 'player', building: null },
    { id: 'floodplain', ownerId: 'player', building: 'irrigation' },
    { id: 'hills', ownerId: 'player', building: 'quarry' }
  ];
  legacy.player.name = 'Старое поселение';
  legacy.player.era = 2;
  legacy.player.resources = { food: 19, materials: 11, knowledge: 7 };
  legacy.player.deckCardIds = ['owned-card-a', 'owned-card-b'];
  legacy.player.craftLevel = 1;
  const restored = Campaign.normalizeState(legacy);
  assert.equal(restored.version, 4);
  assert.equal(restored.world.tiles.length, 49);
  assert.equal(restored.regions.length, 49);
  assert.equal(restored.player.name, 'Старое поселение');
  assert.equal(restored.player.era, 2);
  assert.deepEqual(restored.player.resources, { food: 19, materials: 11, knowledge: 7 });
  assert.deepEqual(restored.player.deckCardIds, ['owned-card-a', 'owned-card-b']);
  assert.equal(restored.player.craftLevel, 1);
  assert.equal(restored.regions.filter(region => region.ownerId === 'player').length, 1, 'old territories must not be transferred');
  assert.match(restored.player.campaignNotice, /Владения прежней карты не перенесены/);
});

test('loading a v3 save from its previous key migrates it into the v4 key', () => {
  const legacy = playableCampaign();
  legacy.version = 3;
  delete legacy.world;
  legacy.regions = [{ id: 'home', ownerId: 'player' }, { id: 'floodplain', ownerId: 'player', building: 'irrigation' }];
  legacy.player.deckCardIds = ['collection-backed-card'];
  const values = new Map([['iforge_campaign_v3', JSON.stringify(legacy)]]);
  const fakeWindow = {
    CampaignMap,
    localStorage: {
      getItem: key => values.get(key) || null,
      setItem: (key, value) => values.set(key, value)
    },
    document: { getElementById: () => null },
    alert() {}
  };
  const source = fs.readFileSync(path.join(__dirname, '..', 'campaign.js'), 'utf8');
  vm.runInNewContext(source, { window: fakeWindow, console, Date, Math, JSON, Number, String, Object, Array, Set });
  const savedV4 = JSON.parse(values.get(Campaign.STORAGE_KEY));
  assert.equal(fakeWindow.CampaignMvp.getState().version, 4);
  assert.equal(savedV4.world.tiles.length, 49);
  assert.deepEqual(savedV4.player.deckCardIds, ['collection-backed-card']);
  assert.equal(values.has('iforge_campaign_v3'), true, 'migration should not delete the prior save key');
});

test('a missing v4 region ledger is reconstructed from its saved world', () => {
  const old = Campaign.createState(TEST_SEED);
  delete old.regions;
  old.player.name = 'Старое поселение';
  const restored = Campaign.normalizeState(old);
  assert.equal(restored.player.name, 'Старое поселение');
  assert.equal(restored.regions.length, 49);
  assert.equal(restored.world.tiles.length, 49);
  const centerId = CampaignMap.tileId(CampaignMap.CENTER.x, CampaignMap.CENTER.y);
  assert.equal(restored.regions.find(region => region.id === centerId).ownerId, 'player');
  assert.ok(restored.regions.some(region => region.ownerId === 'steppe'), 'generated opponent holdings should remain represented');
  assert.ok(restored.regions.some(region => region.ownerId === null), 'unclaimed generated land should remain available');
});

test('claiming an adjacent region spends AP and frontier slot, region without building gives 0 income', () => {
  let state = Campaign.completeOnboarding(Campaign.createState(TEST_SEED), {
    name: 'Дети Реки', originId: 'river', openingFocusId: 'food'
  }).state;
  const foodTileId = mapTileId(state, 'floodplain');
  const regionAction = Campaign.getRegionActionState(state, foodTileId);
  assert.ok(['settle', 'quest'].includes(regionAction.action));
  assert.equal(regionAction.enabled, true);
  const expectedCost = regionAction.action === 'quest'
    ? { food: 4, materials: 2, knowledge: 0 }
    : { food: 2, materials: 2, knowledge: 0 };
  assert.deepEqual(regionAction.cost, expectedCost);

  const beforeAp = state.player.ap;
  const claim = claimNeutralRegion(state, foodTileId);
  assert.equal(claim.error, null);
  assert.equal(claim.state.player.ap, beforeAp - 1);
  assert.equal(claim.state.player.dailyOrders.frontierUsed, true);
  assert.equal(claim.state.player.dailyOrders.craftUsed, false);
  assert.equal(claim.state.regions.find(region => region.id === foodTileId).ownerId, 'player');
  assert.equal(claim.state.regions.find(r => r.id === foodTileId).building, null);
  assert.equal(claim.state.player.resources.food, state.player.resources.food - expectedCost.food);
  assert.equal(claim.state.player.resources.materials, state.player.resources.materials - expectedCost.materials);
  const anotherAdjacent = claim.state.world.tiles.find(tile => tile.kind === 'home').neighbors.find(id => id !== foodTileId);
  assert.match(Campaign.getRegionActionState(claim.state, anotherAdjacent).reason, /поход за землёй|AP/);

  const nextDay = Campaign.finishDayState(claim.state);
  assert.equal(nextDay.error, null);
  assert.deepEqual(nextDay.state.player.dailyOrders, { craftUsed: false, researchUsed: false, constructionUsed: false, frontierUsed: false, legacyBlocked: false });
  assert.equal(nextDay.state.player.ap, nextDay.state.player.apMax);
  // without building, regional income 0
  assert.deepEqual(Campaign.getRegionalIncome(nextDay.state), { food: 0, materials: 0, knowledge: 0 });
  // but after building irrigation, should give 2 food
  const buildAction = Campaign.getRegionActionState(nextDay.state, foodTileId);
  assert.equal(buildAction.action, 'build');
  assert.equal(buildAction.enabled, true);
  const built = Campaign.buildRegionBuildingState(nextDay.state, foodTileId);
  assert.equal(built.error, null);
  assert.deepEqual(Campaign.getRegionalIncome(built.state), { food: 2, materials: 0, knowledge: 0 });
});

test('frontier claims require adjacency and an era gate, while ore unlocks craft grades via buildings', () => {
  let state = playableCampaign();
  state.player.era = 2;
  const copperId = mapTileId(state, 'copper');
  const foodTileId = mapTileId(state, 'floodplain');
  const home = state.world.tiles.find(tile => tile.kind === 'home');
  const visible = new Set(Campaign.getVisibleRegionIds(state));
  const nearbyButNotAdjacent = state.world.tiles.find(tile => visible.has(tile.id)
    && tile.terrain !== 'water' && tile.kind !== 'home' && !home.neighbors.includes(tile.id));
  assert.ok(nearbyButNotAdjacent, 'the two-cell vision radius should include land beyond the frontier');
  assert.match(Campaign.getRegionActionState(state, nearbyButNotAdjacent.id).reason, /соседнюю область/);
  state = Campaign.settleRegionState(state, foodTileId).state;
  state = Campaign.finishDayState(state).state;
  state = Campaign.buildRegionBuildingState(state, foodTileId).state;
  state = Campaign.finishDayState(state).state;
  state = controlRegions(state, [adjacentLandTileId(state, copperId)]);
  const copper = claimNeutralRegion(state, copperId);
  assert.equal(copper.error, null);
  // without smelter building, still only standard
  assert.deepEqual(Campaign.getAvailableMaterialQualities(copper.state), ['standard']);
  assert.match(Campaign.beginCardCraftState(playableCampaign(), { materialQuality: 'refined', effort: 'quick' }).error, /плавильню/i);

  let withBuilding = Campaign.buildRegionBuildingState(copper.state, copperId);
  if (withBuilding.error) {
    // need resources, advance day
    withBuilding.state = Campaign.finishDayState(copper.state).state;
    withBuilding = Campaign.buildRegionBuildingState(withBuilding.state, copperId);
  }
  assert.equal(withBuilding.error, null);
  assert.deepEqual(Campaign.getAvailableMaterialQualities(withBuilding.state), ['standard', 'refined']);

  let withTin = controlRegions(withBuilding.state, ['copper', 'tin-route']);
  // need caravan building for masterwork
  withTin = controlRegionsWithBuildings(withTin, { copper: 'smelter', 'tin-route': 'caravan', floodplain: 'irrigation' });
  assert.deepEqual(Campaign.getAvailableMaterialQualities(withTin), ['standard', 'refined', 'masterwork']);
  const quote = Campaign.cardCraftQuote(withTin, { materialQuality: 'masterwork', effort: 'quick' });
  assert.equal(quote.materialQualityUnlocked, true);
});

test('quest-guard expeditions claim neutral land on victory and leave it neutral on defeat or recovery', () => {
  let state = Campaign.completeOnboarding(Campaign.createState(TEST_SEED), {
    name: 'Народ Реки', originId: 'river', openingFocusId: 'food'
  }).state;
  const home = state.world.tiles.find(tile => tile.kind === 'home');
  const tile = home.neighbors.map(id => state.world.tiles.find(candidate => candidate.id === id))
    .find(candidate => candidate?.guard && candidate.terrain !== 'water');
  assert.ok(tile, 'the starting frontier should expose a generated quest guard');
  state.player.era = tile.guard.era;

  const action = Campaign.getRegionActionState(state, tile.id);
  assert.equal(action.action, 'quest');
  assert.equal(action.enabled, true);
  assert.deepEqual(action.cost, Campaign.REGION_EXPEDITION_COST);
  assert.match(Campaign.settleRegionState(state, tile.id).error, /нельзя освоить/);
  const launched = Campaign.beginRegionExpeditionState(state, tile.id);
  assert.equal(launched.error, null);
  assert.equal(launched.match.kind, 'expedition');
  assert.equal(launched.match.questBattle, true);
  assert.equal(launched.match.opponentId, tile.guard.id);
  assert.equal(launched.match.name, tile.guard.name);
  assert.equal(launched.state.player.pendingExpedition.encounterType, 'guard');
  assert.deepEqual(Campaign.normalizeState(launched.state).player.pendingExpedition, launched.state.player.pendingExpedition);
  assert.equal(Campaign.getOpponentBattleConfig(launched.state, tile.guard.id).era, tile.guard.era);

  const victory = Campaign.finishRegionExpeditionState(launched.state, launched.match, true);
  assert.equal(victory.error, null);
  assert.equal(victory.questBattle, true);
  assert.equal(victory.state.regions.find(region => region.id === tile.id).ownerId, 'player');
  assert.equal(victory.state.player.pendingExpedition, null);
  assert.deepEqual(victory.state.player.practice, state.player.practice, 'a quest guard is not recorded as a real opponent');
  assert.match(victory.message, /Победа над стражей/);

  const defeat = Campaign.finishRegionExpeditionState(launched.state, launched.match, false);
  assert.equal(defeat.error, null);
  assert.equal(defeat.state.regions.find(region => region.id === tile.id).ownerId, null);
  assert.equal(defeat.state.player.pendingExpedition, null);
  assert.deepEqual(defeat.state.player.practice, state.player.practice);
  assert.deepEqual(defeat.state.player.resources, { ...launched.state.player.resources, food: launched.state.player.resources.food + 2 }, 'a defeat refunds half the food');
  assert.match(defeat.message, /остаётся неосвоенной/);

  const marked = Campaign.markExpeditionBattleStartedState(launched.state, launched.match);
  const recovered = Campaign.recoverInterruptedExpeditionState(marked.state);
  assert.equal(recovered.recovered, true);
  assert.equal(recovered.state.regions.find(region => region.id === tile.id).ownerId, null);
  assert.equal(recovered.state.player.pendingExpedition, null);
  assert.deepEqual(recovered.state.player.practice, state.player.practice);
});

test('strategic expedition persists until battle, then a win transfers land without building and a loss refunds half the food', () => {
  let state = controlRegionsWithBuildings(grantExpeditionAccess(playableCampaign()), { copper: 'smelter', 'tin-route': 'caravan' });
  state.player.era = 2;
  const rivalId = mapTileId(state, 'rival-settlement');
  const rivalName = state.world.tiles.find(tile => tile.id === rivalId).name;
  const available = Campaign.getRegionActionState(state, rivalId);
  assert.equal(available.action, 'attack');
  assert.equal(available.enabled, true);
  assert.deepEqual(available.cost, { food: 4, materials: 2, knowledge: 0 });

  const launched = Campaign.beginRegionExpeditionState(state, rivalId);
  assert.equal(launched.error, null);
  assert.equal(launched.match.kind, 'expedition');
  assert.equal(launched.match.regionName, rivalName);
  assert.equal(launched.state.player.pendingExpedition.regionId, rivalId);
  assert.equal(launched.state.player.resources.food, state.player.resources.food - 4);
  assert.equal(launched.state.player.resources.materials, state.player.resources.materials - 2);
  assert.match(Campaign.finishDayState(launched.state).error, /Заверши бой экспедиции/);
  assert.deepEqual(Campaign.normalizeState(launched.state).player.pendingExpedition, launched.state.player.pendingExpedition);

  const victory = Campaign.finishRegionExpeditionState(launched.state, launched.match, true);
  assert.equal(victory.error, null);
  assert.equal(victory.state.regions.find(region => region.id === rivalId).ownerId, 'player');
  assert.equal(victory.state.regions.find(r => r.id === rivalId).building, null, 'conquered region should have no building');
  assert.equal(victory.state.player.pendingExpedition, null);
  assert.equal(victory.state.player.practice.leaderWins, 1);
  // after conquest, no income until outpost built
  assert.deepEqual(Campaign.getRegionalIncome(victory.state), { food: 0, materials: 2, knowledge: 0 }); // only copper+tin

  const defeat = Campaign.finishRegionExpeditionState(launched.state, launched.match, false);
  assert.equal(defeat.error, null);
  assert.equal(defeat.state.regions.find(region => region.id === rivalId).ownerId, 'steppe');
  assert.equal(defeat.state.player.practice.leaderLosses, 1);
  assert.deepEqual(defeat.state.player.resources, { ...launched.state.player.resources, food: launched.state.player.resources.food + 2 }, 'a defeat refunds half the food');
});

test('reloading after a territory battle begins records one loss instead of a free retry', () => {
  let state = grantExpeditionAccess(playableCampaign());
  state.player.era = 2;
  const rivalId = mapTileId(state, 'rival-settlement');
  const launch = Campaign.beginRegionExpeditionState(state, rivalId);
  assert.equal(launch.error, null);
  const marked = Campaign.markExpeditionBattleStartedState(launch.state, launch.match);
  assert.equal(marked.error, null);
  assert.equal(marked.state.player.pendingExpedition.battleStarted, true);

  const recovered = Campaign.recoverInterruptedExpeditionState(marked.state);
  assert.equal(recovered.recovered, true);
  assert.equal(recovered.state.player.pendingExpedition, null);
  assert.equal(recovered.state.regions.find(region => region.id === rivalId).ownerId, 'steppe');
  assert.equal(recovered.state.player.practice.leaderLosses, 1);
  assert.deepEqual(recovered.state.player.resources, { ...marked.state.player.resources, food: marked.state.player.resources.food + 2 }, 'the interrupted battle also refunds half the food');
  assert.match(recovered.state.player.campaignNotice, /засчитан как поражение/);

  const beforeBattle = Campaign.recoverInterruptedExpeditionState(launch.state);
  assert.equal(beforeBattle.recovered, false);
  assert.ok(beforeBattle.state.player.pendingExpedition);
});

test('the campaign loader persists an interrupted-expedition loss and displays a notice', () => {
  let state = grantExpeditionAccess(playableCampaign());
  state.player.era = 2;
  const rivalId = mapTileId(state, 'rival-settlement');
  const launch = Campaign.beginRegionExpeditionState(state, rivalId);
  const started = Campaign.markExpeditionBattleStartedState(launch.state, launch.match).state;
  let stored = JSON.stringify(started);
  const storage = {
    getItem: key => key === Campaign.STORAGE_KEY ? stored : null,
    setItem: (key, value) => { if (key === Campaign.STORAGE_KEY) stored = value; }
  };
  const fakeWindow = {
    CampaignMap: require('../campaign-map.js'),
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
  let state = grantExpeditionAccess(playableCampaign());
  state.player.era = 2;
  const rivalId = mapTileId(state, 'rival-settlement');
  const launch = Campaign.beginRegionExpeditionState(state, rivalId);
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

test('research and construction have independent limits via AP and can chain on one project', () => {
  let state = Campaign.createState(TEST_SEED);
  const first = Campaign.addBlueprint(state, draft(), 'both');
  assert.equal(first.error, null);
  // Второй проект в тот же день уже нельзя: приём стоит приказа «Исследование».
  assert.match(Campaign.addBlueprint(first.state, draft({ scienceName: 'Вторая наука', buildingName: 'Второе здание' }), 'both').error, /исследование уже проведено|AP/);
  const nextDay = Campaign.finishDayState(first.state).state;
  const second = Campaign.addBlueprint(nextDay, draft({ scienceName: 'Вторая наука', buildingName: 'Второе здание' }), 'both');
  assert.equal(second.error, null);

  const prepared = Campaign.finishDayState(second.state).state;
  const researched = Campaign.researchBlueprint(prepared, first.blueprint.id);
  assert.equal(researched.error, null);
  assert.equal(researched.state.player.blueprints.find(item => item.id === first.blueprint.id).researched, true);
  assert.equal(researched.state.player.dailyOrders.researchUsed, true);
  assert.equal(researched.state.player.dailyOrders.constructionUsed, false);
  assert.equal(researched.state.player.ap, researched.state.player.apMax - 1);
  assert.equal(researched.state.player.blueprints.find(item => item.id === first.blueprint.id).researchedDay, prepared.day);
  assert.match(Campaign.researchBlueprint(researched.state, second.blueprint.id).error, /исследование уже проведено|AP/);

  const built = Campaign.constructBlueprint(researched.state, first.blueprint.id);
  assert.equal(built.error, null);
  assert.equal(built.state.player.blueprints.find(item => item.id === first.blueprint.id).built, true);
  assert.equal(built.state.player.blueprints.find(item => item.id === first.blueprint.id).builtDay, prepared.day);
  assert.equal(built.state.player.dailyOrders.constructionUsed, true);
  assert.equal(built.state.player.buildings.length, 2);

  const readySecond = structuredClone(built.state);
  readySecond.player.blueprints.find(item => item.id === second.blueprint.id).researched = true;
  assert.match(Campaign.constructBlueprint(readySecond, second.blueprint.id).error, /строительство уже выполнено|AP/);
});

test('craft, research and construction share AP pool - cannot do everything in one day', () => {
  let state = controlRegions(playableCampaign(), ['home', 'copper']);
  state.player.era = 2;
  state.player.resources = { food: 30, materials: 30, knowledge: 30 };
  const added = Campaign.addBlueprint(state, draft(), 'both');
  assert.equal(added.error, null);
  state = Campaign.finishDayState(added.state).state;

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
  let state = Campaign.createState(TEST_SEED);
  const added = Campaign.addBlueprint(state, draft({
    category: 'military', effects: [{ type: 'deck_slots', amount: 1 }, { type: 'max_hp', amount: 1 }]
  }), 'allies');
  state = Campaign.finishDayState(added.state).state;
  state = Campaign.researchBlueprint(state, added.blueprint.id).state;
  state = Campaign.finishDayState(state).state;
  state = Campaign.constructBlueprint(state, added.blueprint.id).state;
  assert.equal(state.player.buildings[1].active, true);
  assert.equal(Campaign.getBattleConfig(state).deckLimit, 5);
  assert.equal(Campaign.getBattleConfig(state).hp, 6);
  const toggled = Campaign.toggleBuildingState(state, state.player.buildings[1].id);
  assert.equal(toggled.error, null);
  assert.equal(toggled.state.player.buildings[1].active, false);
  assert.equal(Campaign.getBattleConfig(toggled.state).deckLimit, 4);
  assert.equal(Campaign.getBattleConfig(toggled.state).effects.income_food, 1); // remains from the starter granary
  // check worker bonus
  const breakdown = Campaign.getProductionBreakdown(state);
  assert.ok(breakdown.workerBonus.food > 0);
});

test('previous local prototypes migrate their building loadout to four slots', () => {
  const old = Campaign.createState(TEST_SEED);
  old.player.activeBuildingSlots = 2;
  const migrated = Campaign.normalizeState(old);
  assert.equal(migrated.player.activeBuildingSlots, 4);
});

test('the civilization loadout supports four active buildings and rejects a fifth', () => {
  let state = Campaign.createState(TEST_SEED);
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
  const added = Campaign.addBlueprint(Campaign.createState(TEST_SEED), draft({
    category: 'civic', effects: [{ type: 'energy_cap', amount: 1 }, { type: 'energy_growth', amount: 1 }]
  }), 'both');
  assert.equal(added.error, null);
  const researchDay = Campaign.finishDayState(added.state).state;
  const studied = Campaign.researchBlueprint(researchDay, added.blueprint.id);
  assert.equal(studied.error, null);
  const buildDay = Campaign.finishDayState(studied.state).state;
  const state = Campaign.constructBlueprint(buildDay, added.blueprint.id).state;
  assert.equal(Campaign.getBattleConfig(state).energyMax, 3);
  assert.equal(Campaign.getBattleConfig(state).energyGrowth, 2);
  const disabled = Campaign.toggleBuildingState(state, state.player.buildings[1].id).state;
  assert.equal(Campaign.getBattleConfig(disabled).energyMax, 2);
  assert.equal(Campaign.getBattleConfig(disabled).energyGrowth, 1);
});

test('barbarian tribes have distinct, complete decks that upgrade with each early era', () => {
  const state = Campaign.createState(TEST_SEED);
  const ids = ['reed', 'steppe', 'north'];
  const stoneDecks = ids.map(id => Campaign.getOpponentBattleDeck(state, id));
  assert.deepEqual(stoneDecks.map(deck => deck.length), [4, 4, 4]);
  assert.equal(new Set(stoneDecks.map(deck => deck.map(card => card.name).join('|'))).size, 3, 'each tribe has its own card list');
  for (const deck of stoneDecks) {
    assert.equal(new Set(deck.map(card => card.id)).size, deck.length);
    assert.ok(deck.every(card => card.name && card.description && card.card_type && card.drop_cost >= 0));
  }

  for (const [era, expectedSize] of [[1, 6], [2, 8]]) {
    for (const id of ids) {
      const advanced = structuredClone(state);
      advanced.opponents.find(opponent => opponent.id === id).era = era;
      const deck = Campaign.getOpponentBattleDeck(advanced, id);
      const config = Campaign.getOpponentBattleConfig(advanced, id);
      assert.equal(deck.length, expectedSize);
      assert.equal(config.deckLimit, expectedSize);
      assert.ok(deck.some(card => card.era === 'bronze'), `${id} should receive era-appropriate upgrades`);
      assert.equal(new Set(deck.map(card => card.id)).size, deck.length);
    }
  }

  assert.equal(Campaign.getOpponentBattleConfig(state, 'reed').deckStyle, 'Речной строй');
  assert.equal(Campaign.getOpponentBattleConfig(state, 'steppe').deckStyle, 'Степной рейд');
  assert.equal(Campaign.getOpponentBattleConfig(state, 'north').deckStyle, 'Северная стража');
});

test('barbarians grow independently up to the Middle Ages, then stop', () => {
  let state = Campaign.createState(TEST_SEED);
  assert.deepEqual(state.opponents.map(opponent => opponent.era), [0, 0, 0]);
  for (let day = 0; day < 14; day++) state = Campaign.finishDayState(state).state;
  assert.ok(new Set(state.opponents.map(opponent => opponent.era)).size > 1);
  assert.equal(state.player.era, 0);
  assert.ok(state.opponents.every(opponent => opponent.era <= Campaign.BARBARIAN_ERA_CAP));

  for (let day = 14; day < 29; day++) state = Campaign.finishDayState(state).state;
  assert.equal(state.opponents.find(opponent => opponent.id === 'steppe').era, Campaign.BARBARIAN_ERA_CAP);
  assert.ok(state.opponents.every(opponent => opponent.era <= 2));
});

test('player era advances bring selected barbarian decks forward too', () => {
  let state = Campaign.createState(TEST_SEED);
  state.player.historicalCulture = Campaign.HISTORICAL_CULTURES[0];
  const first = Campaign.addBlueprint(state, draft(), 'both');
  assert.equal(first.error, null);
  state = Campaign.finishDayState(first.state).state;
  state.player.research = 1;
  const antiquity = Campaign.researchBlueprint(state, first.blueprint.id);
  assert.equal(antiquity.error, null);
  assert.equal(antiquity.state.player.era, 1);
  assert.deepEqual(antiquity.state.opponents.map(opponent => opponent.era), [1, 0, 1]);
  assert.match(antiquity.state.player.campaignNotice, /боевые колоды улучшены/);
  assert.equal(Campaign.getOpponentBattleConfig(antiquity.state, 'reed').deckLimit, 6);
  assert.equal(Campaign.getOpponentBattleConfig(antiquity.state, 'steppe').deckLimit, 4);
  assert.equal(Campaign.getOpponentBattleConfig(antiquity.state, 'north').deckLimit, 6);

  state = Campaign.finishDayState(antiquity.state).state;
  const second = Campaign.addBlueprint(state, draft({ scienceName: 'Новая бронзовая наука', buildingName: 'Бронзовая мастерская' }), 'both');
  assert.equal(second.error, null);
  state = Campaign.finishDayState(second.state).state;
  state.player.research = 1;
  const medieval = Campaign.researchBlueprint(state, second.blueprint.id);
  assert.equal(medieval.error, null);
  assert.equal(medieval.state.player.era, 2);
  assert.equal(medieval.state.opponents.find(opponent => opponent.id === 'steppe').era, 2);
  assert.equal(Campaign.getOpponentBattleConfig(medieval.state, 'steppe').deckLimit, 8);
});

test('campaign deck selection respects its current building-derived limit', () => {
  let state = Campaign.createState(TEST_SEED);
  for (const id of ['card-a', 'card-b', 'card-c', 'card-d']) state = Campaign.toggleDeckCardState(state, id).state;
  assert.equal(state.player.deckCardIds.length, 4);
  const denied = Campaign.toggleDeckCardState(state, 'card-e');
  assert.match(denied.error, /лимит колоды 4/);
});

test('AI practice is only local test data and does not change clan rating or resources', () => {
  const state = Campaign.createState(TEST_SEED);
  const opponent = state.opponents.find(item => item.leader);
  const resources = { ...state.player.resources };
  const result = Campaign.recordPractice(state, opponent.id, true, true);
  assert.equal(result.error, null);
  assert.equal(result.state.player.practice.leaderWins, 1);
  assert.deepEqual(result.state.player.resources, resources);
  assert.equal(result.state.opponents.find(item => item.id === opponent.id).rating, opponent.rating);
});

test('only a medal carries over when the local season is reset', () => {
  let state = Campaign.createState(TEST_SEED);
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
  assert.match(result.state.medals[0].name, /Пара и Стали|Новейшее|Будущее|Средневековье|Ренессанс|Античный|Каменный/);
});

test('card craft quote shows material, progression, effort and rarity odds before payment', () => {
  let state = playableCampaign();
  let quote = Campaign.cardCraftQuote(state, { materialQuality: 'standard', effort: 'quick' });
  assert.equal(quote.qualityScore, 0);
  assert.deepEqual(quote.odds, { ordinary: 70, uncommon: 25, rare: 5 });
  assert.deepEqual(quote.cost, { food: 2, materials: 2, knowledge: 0 });

  state.player.craftLevel = 1;
  state = controlRegionsWithBuildings(state, { copper: 'smelter' });
  quote = Campaign.cardCraftQuote(state, { materialQuality: 'refined', effort: 'focused' });
  assert.equal(quote.qualityScore, 3);
  assert.deepEqual(quote.odds, { ordinary: 50, uncommon: 38, rare: 12 });
  assert.deepEqual(quote.cost, { food: 3, materials: 5, knowledge: 1 });

  state.player.craftLevel = 2;
  state = controlRegionsWithBuildings(state, { copper: 'smelter', 'tin-route': 'caravan' });
  quote = Campaign.cardCraftQuote(state, { materialQuality: 'masterwork', effort: 'painstaking' });
  assert.equal(quote.qualityScore, 6);
  assert.deepEqual(quote.odds, { ordinary: 15, uncommon: 45, rare: 40 });
  assert.equal(quote.effortDays, 2);
});

test('card craft rolls rarity before generation, pays upfront and routes the model by rarity', () => {
  const initial = playableCampaign();
  const metalAccess = controlRegionsWithBuildings(initial, { copper: 'smelter', 'tin-route': 'caravan' });
  metalAccess.player.era = 2;
  const rare = Campaign.beginCardCraftState(metalAccess, { materialQuality: 'masterwork', effort: 'painstaking' }, 0.999, 'Копейная линия');
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
  const copperAccess = controlRegionsWithBuildings(playableCampaign(), { copper: 'smelter' });
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
  const copperAccess = controlRegionsWithBuildings(initial, { copper: 'smelter' });
  copperAccess.player.era = 2;
  const started = Campaign.beginCardCraftState(copperAccess, { materialQuality: 'refined', effort: 'focused' }, 0.2);
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

test('science advice uses current territory and reserves while exposing only one broad choice', async () => {
  const base = playableCampaign();
  const center = base.world.tiles.find(tile => tile.x === CampaignMap.CENTER.x && tile.y === CampaignMap.CENTER.y);
  const adjacent = center.neighbors.map(id => base.world.tiles.find(tile => tile.id === id)).find(tile => tile.terrain !== 'water');
  const other = base.world.tiles.find(tile => tile.terrain !== 'water' && tile.id !== center.id && tile.id !== adjacent.id);
  const contextIds = new Set([center.id, adjacent.id, other.id]);
  const state = controlRegions(base, [...contextIds]);
  const situation = Campaign.scienceAdvisorSituation(state);
  const expectedContexts = base.world.tiles.filter(tile => contextIds.has(tile.id));
  assert.deepEqual(situation.regionNames, expectedContexts.map(tile => tile.name));
  assert.deepEqual(situation.localContexts.map(region => region.id), expectedContexts.map(tile => tile.id));
  assert.equal(situation.reserves.food, state.player.resources.food);

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
    CampaignMap: require('../campaign-map.js'),
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
  const copperAccess = controlRegionsWithBuildings(initial, { copper: 'smelter' });
  copperAccess.player.era = 2;
  const started = Campaign.beginCardCraftState(copperAccess, { materialQuality: 'refined', effort: 'focused' }, 0.5);
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
  let state = Campaign.completeOnboarding(Campaign.createState(TEST_SEED), { name: 'Тест', originId: 'river', openingFocusId: 'food' }).state;
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
  let state = Campaign.completeOnboarding(Campaign.createState(TEST_SEED), { name: 'Тест', originId: 'river', openingFocusId: 'food' }).state;
  assert.equal(state.player.ap, 2);
  assert.equal(state.player.apMax, 2);
  const blueprintId = state.player.blueprints[0].id;
  state = Campaign.researchBlueprint(state, blueprintId).state;
  assert.equal(state.player.ap, 1);
  const claim = claimNeutralRegion(state, mapTileId(state, 'floodplain'));
  assert.equal(claim.error, null);
  state = claim.state;
  assert.equal(state.player.ap, 0);
  const blocked = Campaign.beginCardCraftState(state, { materialQuality: 'standard', effort: 'quick' }, 0.1);
  assert.match(blocked.error, /AP/);
  state = Campaign.finishDayState(state).state;
  assert.equal(state.player.ap, 2);
});

test('v3: region building loss on conquest loss', () => {
  let state = controlRegionsWithBuildings(playableCampaign(), { floodplain: 'irrigation' });
  const foodTileId = mapTileId(state, 'floodplain');
  assert.equal(Campaign.getRegionalIncome(state).food, 2);
  // simulate losing region: set owner to null
  state.regions.find(r => r.id === foodTileId).ownerId = null;
  state.regions.find(r => r.id === foodTileId).building = null;
  assert.equal(Campaign.getRegionalIncome(state).food, 0);
});

test('codex: accepting a project spends the research order and duplicates never enter', () => {
  const state = Campaign.createState(TEST_SEED);
  const first = Campaign.addBlueprint(state, draft(), 'both');
  assert.equal(first.error, null);
  assert.equal(first.state.player.dailyOrders.researchUsed, true, 'acceptance consumes the research order');
  assert.equal(first.state.player.ap, state.player.apMax - 1);

  // Второй приём в тот же день запрещён — и проектом, и исследованием.
  const sameDay = Campaign.addBlueprint(first.state, draft({ scienceName: 'Другая наука', buildingName: 'Другое здание' }), 'both');
  assert.match(sameDay.error, /исследование уже проведено|AP/);
  assert.match(Campaign.researchBlueprint(first.state, first.blueprint.id).error, /исследование уже проведено|AP/);

  // Дубликат по имени науки или постройки отсекается даже в новый день.
  const nextDay = Campaign.finishDayState(first.state).state;
  const byScience = Campaign.addBlueprint(nextDay, draft({ scienceName: '  обжиг   ГЛИНЫ ', buildingName: 'Совсем другое здание' }), 'both');
  assert.match(byScience.error, /уже есть в кодексе/);
  assert.equal(byScience.duplicate, true);
  const byBuilding = Campaign.addBlueprint(nextDay, draft({ scienceName: 'Новая наука', buildingName: 'Обжиговая мастерская' }), 'both');
  assert.match(byBuilding.error, /уже есть в кодексе/);
  assert.equal(nextDay.player.blueprints.length, first.state.player.blueprints.length, 'rejected drafts do not grow the codex');

  // Приём стоит приказа, но не ресурсов: запасы не тронуты.
  assert.deepEqual(first.state.player.resources, state.player.resources);
});

test('codex: unstarted projects can be deleted, studied and opening ones cannot', () => {
  const state = Campaign.createState(TEST_SEED);
  const added = Campaign.addBlueprint(state, draft(), 'both');
  const id = added.blueprint.id;
  const removed = Campaign.removeBlueprint(added.state, id);
  assert.equal(removed.error, null);
  assert.equal(removed.state.player.blueprints.some(item => item.id === id), false);

  const begun = Campaign.beginOnboardingState(Campaign.createState(TEST_SEED), { name: 'Тест', originId: 'river', seedId: 'river' }).state;
  const opened = Campaign.setOpeningProject(Campaign.clone(begun), {
    scienceName: 'Первое дело', scienceDescription: 'Первое наблюдение народа.', buildingName: 'Первая постройка', buildingDescription: 'Первое строение поселения.',
    category: 'economy', effects: [{ type: 'income_food', amount: 1 }]
  }).state;
  const opening = opened.player.blueprints.find(item => item.openingProject);
  assert.ok(opening, 'onboarding leaves the opening deal in the codex');
  assert.match(Campaign.removeBlueprint(opened, opening.id).error, /навсегда/);

  const researched = Campaign.finishDayState(added.state).state;
  const studied = Campaign.researchBlueprint(researched, id).state;
  assert.match(Campaign.removeBlueprint(studied, id).error, /нельзя убрать/);
  assert.match(Campaign.removeBlueprint(added.state, 'нет-такого-id').error, /не найден/);
});

test('militia deck: player assigns the reserves that will fill empty battle slots', () => {
  const state = Campaign.createState(TEST_SEED);
  assert.deepEqual(state.player.deckMilitia, [], 'new campaigns start with an empty reserve choice');

  const first = Campaign.toggleDeckMilitiaState(state, 'Топорники племени');
  assert.equal(first.error, null);
  assert.deepEqual(first.state.player.deckMilitia, ['Топорники племени']);
  assert.equal(first.state.player.ap, state.player.ap, 'choosing reserves costs no orders');

  const second = Campaign.toggleDeckMilitiaState(first.state, 'Охотники с луками');
  assert.deepEqual(second.state.player.deckMilitia, ['Топорники племени', 'Охотники с луками']);
  const off = Campaign.toggleDeckMilitiaState(second.state, 'Топорники племени');
  assert.deepEqual(off.state.player.deckMilitia, ['Охотники с луками']);

  let capped = off.state;
  for (const name of ['A', 'B', 'C', 'D', 'E', 'F', 'G']) capped = Campaign.toggleDeckMilitiaState(capped, name).state;
  assert.equal(capped.player.deckMilitia.length, Campaign.DECK_MILITIA_LIMIT);

  // Сохранение переживает нормализацию и чистит мусор.
  const migrated = Campaign.normalizeState({ ...capped, player: { ...capped.player, deckMilitia: ['  Охотники с луками  ', 'Охотники с луками', 42, ''] } });
  assert.deepEqual(migrated.player.deckMilitia, ['Охотники с луками']);
});
