const test = require('node:test');
const assert = require('node:assert/strict');
const Campaign = require('../campaign.js');

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

test('existing version-two campaign saves do not get redirected into onboarding', () => {
  const legacySave = Campaign.createState();
  delete legacySave.player.onboardingComplete;
  const restored = Campaign.normalizeState(legacySave);
  assert.equal(restored.player.onboardingComplete, true);
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
