const test = require('node:test');
const assert = require('node:assert/strict');
const Campaign = require('../campaign.js');
const CampaignMap = require('../campaign-map.js');

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
  switch (key) {
    case 'obsidian': return find(tile => tile.feature === 'obsidian-vein');
    case 'copper': return find(tile => tile.feature === 'copper-vein');
    case 'tin-route': return find(tile => tile.feature === 'tin-route');
    default: return null;
  }
}

function controlRegionsWithBuildings(state, regionBuildingMap) {
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

function draft(overrides = {}) {
  return {
    scienceName: 'Доктрина эпохи',
    scienceDescription: 'Военный уклад, требующий ключевого ресурса эпохи.',
    buildingName: 'Арсенал',
    buildingDescription: 'Готовит отряды к бою.',
    category: 'military',
    effects: [{ type: 'unit_power', amount: 1 }],
    ...overrides
  };
}

test('world generation places an obsidian vein alongside copper and tin, with no era lock', () => {
  const opponents = Campaign.createState(TEST_SEED).opponents;
  const world = CampaignMap.generateWorld(TEST_SEED, opponents);
  const obsidian = world.tiles.find(tile => tile.feature === 'obsidian-vein');
  assert.ok(obsidian, 'the generated map should contain an obsidian vein');
  assert.equal(obsidian.siteType, 'obsidian');
  assert.equal(obsidian.resource, 'obsidian');
  assert.equal(obsidian.minEra, 0, 'obsidian should be reachable from the start, unlike copper/tin (minEra 2)');
  assert.ok(world.tiles.some(tile => tile.feature === 'copper-vein'), 'copper must still be generated');
  assert.ok(world.tiles.some(tile => tile.feature === 'tin-route'), 'tin must still be generated');
});

test('hasEraKeyResource gates era 0 on the obsidian workshop and era 2 on smelter+caravan, leaving other eras ungated', () => {
  let state = playableCampaign();
  assert.equal(state.player.era, 0);
  assert.equal(Campaign.hasEraKeyResource(state), false, 'era 0 without an obsidian workshop should be locked');

  const withObsidian = controlRegionsWithBuildings(state, { obsidian: 'obsidian-workshop' });
  assert.equal(Campaign.hasEraKeyResource(withObsidian), true);

  const era2 = structuredClone(state);
  era2.player.era = 2;
  assert.equal(Campaign.hasEraKeyResource(era2), false, 'era 2 without copper+tin buildings should be locked');

  const era2Copper = controlRegionsWithBuildings(era2, { copper: 'smelter' });
  assert.equal(Campaign.hasEraKeyResource(era2Copper), false, 'copper alone is not enough in era 2');

  const era2Both = controlRegionsWithBuildings(era2, { copper: 'smelter', 'tin-route': 'caravan' });
  assert.equal(Campaign.hasEraKeyResource(era2Both), true);

  for (const era of [1, 3, 4, 5, 6]) {
    const other = structuredClone(state);
    other.player.era = era;
    assert.equal(Campaign.hasEraKeyResource(other), true, `era ${era} is not in the pilot scope and must stay ungated`);
  }
});

test('cardCraftQuote hard-locks the rare tier in era 0 without obsidian, folding its odds into uncommon', () => {
  let state = playableCampaign();
  const locked = Campaign.cardCraftQuote(state, { materialQuality: 'standard', effort: 'quick' });
  assert.equal(locked.rareLocked, true);
  assert.equal(locked.odds.rare, 0);
  assert.equal(locked.odds.ordinary + locked.odds.uncommon, 100);
  assert.match(locked.rareLockText, /обсидиан/i);

  state = controlRegionsWithBuildings(state, { obsidian: 'obsidian-workshop' });
  const unlocked = Campaign.cardCraftQuote(state, { materialQuality: 'standard', effort: 'quick' });
  assert.equal(unlocked.rareLocked, false);
  assert.ok(unlocked.odds.rare > 0);
});

test('cardCraftQuote hard-locks the rare tier in era 2 unless both copper and tin buildings are owned', () => {
  let state = playableCampaign();
  state.player.era = 2;
  const locked = Campaign.cardCraftQuote(state, { materialQuality: 'standard', effort: 'quick' });
  assert.equal(locked.rareLocked, true);
  assert.equal(locked.odds.rare, 0);

  const withBoth = controlRegionsWithBuildings(state, { copper: 'smelter', 'tin-route': 'caravan' });
  const unlocked = Campaign.cardCraftQuote(withBoth, { materialQuality: 'standard', effort: 'quick' });
  assert.equal(unlocked.rareLocked, false);
  assert.ok(unlocked.odds.rare > 0);
});

test('constructBlueprint blocks a unit_power (era-doctrine) building without the era key resource, and allows it once owned', () => {
  let state = playableCampaign();
  const added = Campaign.addBlueprint(state, draft(), 'both');
  assert.equal(added.error, null);
  let researched = Campaign.researchBlueprint(added.state, added.blueprint.id);
  assert.equal(researched.error, null);
  state = Campaign.finishDayState(researched.state).state;

  const blocked = Campaign.constructBlueprint(Campaign.clone(state), added.blueprint.id);
  assert.match(blocked.error, /обсидиан/i);
  assert.equal(state.player.buildings.some(b => b.blueprintId === added.blueprint.id), false);

  state = controlRegionsWithBuildings(state, { obsidian: 'obsidian-workshop' });
  const built = Campaign.constructBlueprint(state, added.blueprint.id);
  assert.equal(built.error, null);
  assert.ok(built.state.player.buildings.some(b => b.blueprintId === added.blueprint.id));
});

test('constructBlueprint leaves ordinary (non unit_power) buildings unaffected by the era-resource gate', () => {
  let state = playableCampaign();
  const added = Campaign.addBlueprint(state, draft({ effects: [{ type: 'income_food', amount: 1 }] }), 'both');
  assert.equal(added.error, null);
  let researched = Campaign.researchBlueprint(added.state, added.blueprint.id);
  assert.equal(researched.error, null);
  state = Campaign.finishDayState(researched.state).state;
  const built = Campaign.constructBlueprint(state, added.blueprint.id);
  assert.equal(built.error, null, 'a building with no unit_power effect must never be blocked by the era-resource gate');
});

test('getBattleConfig surfaces the unit_power effect total as atkBonus', () => {
  let state = playableCampaign();
  const added = Campaign.addBlueprint(state, draft(), 'both');
  let researched = Campaign.researchBlueprint(added.state, added.blueprint.id);
  state = Campaign.finishDayState(researched.state).state;
  state = controlRegionsWithBuildings(state, { obsidian: 'obsidian-workshop' });
  const built = Campaign.constructBlueprint(state, added.blueprint.id);
  assert.equal(built.error, null);
  const cfg = Campaign.getBattleConfig(built.state);
  assert.equal(cfg.atkBonus, 1);

  const before = Campaign.getBattleConfig(playableCampaign());
  assert.equal(before.atkBonus, 0);
});
