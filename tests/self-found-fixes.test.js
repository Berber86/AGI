const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const ts = require('typescript');
const Campaign = require('../campaign.js');

const root = path.join(__dirname, '..');
const TEST_SEED = 12345;

function playableCampaign() {
  const state = Campaign.createState(TEST_SEED);
  state.player.onboardingComplete = true;
  return state;
}

// Mirrors the loadTypeScriptModule helper used by the other TS-backed test files.
function loadTypeScriptModule(relativePath, dependencies = {}) {
  const file = path.join(root, relativePath);
  const source = fs.readFileSync(file, 'utf8');
  const javascript = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
    fileName: file,
  }).outputText;
  const mod = { exports: {} };
  const sandbox = { module: mod, exports: mod.exports, console, setTimeout, clearTimeout, Date, Math };
  if (relativePath === 'src/game/battle.ts') {
    dependencies = { './cards': { buildMilitia: () => [], uid: () => `test-${Math.random()}` }, ...dependencies };
  }
  sandbox.require = (name) => {
    if (Object.prototype.hasOwnProperty.call(dependencies, name)) return dependencies[name];
    throw new Error(`Unexpected import ${name} from ${relativePath}`);
  };
  vm.runInNewContext(javascript, sandbox, { filename: relativePath, timeout: 2000 });
  return mod.exports;
}

function card(name, options = {}) {
  return {
    id: name.toLowerCase().replaceAll(' ', '-'), name, card_type: 'unit', era: 'ancient', emoji: '⚔️',
    drop_cost: 1, action_cost: 1, hp: 5, atk: 2, description: 'Test card.', keywords: [], effects: [], ...options,
  };
}

function newBattle(api, playerCards = [], enemyCards = []) {
  const config = { hp: 30, energyMax: 5, energyGrowth: 2 };
  return api.createBattle(playerCards, config, enemyCards, config,
    { kind: 'practice', opponentId: 'test', name: 'Test enemy', clan: 'Test', era: 0, leaderBattle: false }, 0);
}

// --- Bug 1: Forge.tsx double-submit race --------------------------------------------------

test('Forge.tsx commits craft orders through act() against live state, not a frozen pre-computed snapshot', () => {
  const forgeSrc = fs.readFileSync(path.join(root, 'src/pages/Forge.tsx'), 'utf8');
  const forgeFn = forgeSrc.slice(forgeSrc.indexOf('const forge = async'), forgeSrc.indexOf('const orders: any[]'));
  assert.match(forgeFn, /act\(\(s\)\s*=>\s*M\.beginCardCraft\(s,/, 'forge() should run beginCardCraft through act() so it always sees the freshest state');
  assert.doesNotMatch(forgeFn, /M\.beginCardCraft\(M\.clone\(game\)/, 'forge() must not pre-compute the craft order from a stale snapshot captured at render time');
});

// --- Bug 2: silent deck truncation on building toggle --------------------------------------

test('disabling a building that would shrink the deck below its current size is rejected, not silently truncated', () => {
  let state = Campaign.createState(TEST_SEED);
  const added = Campaign.addBlueprint(state, {
    scienceName: 'Военное дело', scienceDescription: 'desc', buildingName: 'Казармы', buildingDescription: 'desc',
    category: 'military', effects: [{ type: 'deck_slots', amount: 1 }, { type: 'max_hp', amount: 1 }],
  }, 'allies');
  assert.equal(added.error, null, added.error || '');
  const researched = Campaign.researchBlueprint(added.state, added.blueprint.id);
  assert.equal(researched.error, null, researched.error || '');
  state = Campaign.finishDayState(researched.state).state;
  const built = Campaign.constructBlueprint(state, added.blueprint.id);
  assert.equal(built.error, null, built.error || '');
  state = built.state;
  const militaryBuilding = state.player.buildings.find((b) => b.blueprintId === added.blueprint.id);
  assert.ok(militaryBuilding?.active);

  const limitWithBuilding = Campaign.getBattleConfig(state).deckLimit;
  // Fill the deck up to the current (expanded) limit with placeholder ids — toggleBuildingState
  // only cares about deckCardIds.length, not whether those ids resolve to real cards.
  let synthetic = 0;
  while (state.player.deckCardIds.length < limitWithBuilding) {
    state.player.deckCardIds.push(`synthetic-${synthetic++}`);
  }
  assert.equal(state.player.deckCardIds.length, limitWithBuilding);

  const result = Campaign.toggleBuildingState(state, militaryBuilding.id);
  assert.match(result.error || '', /лимит колоды|колод/i, 'toggling off should be refused with an explanation when it would shrink the deck');
  assert.equal(result.state.player.buildings.find((b) => b.id === militaryBuilding.id).active, true, 'the building must stay active since the toggle was rejected');
  assert.equal(result.state.player.deckCardIds.length, limitWithBuilding, 'no deck cards should have been dropped');
});

// --- Bug 3: "new civilization" also wipes the forged-card collection -----------------------

test('resetCampaign clears the forged-card collection and militia picks, not just the campaign state', () => {
  const storeSrc = fs.readFileSync(path.join(root, 'src/game/store.tsx'), 'utf8');
  const resetFn = storeSrc.slice(storeSrc.indexOf('const resetCampaign'), storeSrc.indexOf('const resetCampaign') + 700);
  assert.match(resetFn, /setCollection\(\[\]\)/, 'resetCampaign should clear the in-memory collection');
  assert.match(resetFn, /setMilitiaPicks\(\[\]\)/, 'resetCampaign should clear the in-memory militia picks');
  assert.match(resetFn, /removeItem\(COLL_KEY\)/, 'resetCampaign should clear the persisted collection in localStorage');
  assert.match(resetFn, /removeItem\(MILITIA_KEY\)/, 'resetCampaign should clear the persisted militia picks in localStorage');
});

// --- Bug 4: "charge" never triggered, and "holdground" only protected the enemy -------------

test('charge grants its +2 bonus on a unit\'s real first attack instead of always firing with fresh already cleared', () => {
  const api = loadTypeScriptModule('src/game/battle.ts');
  const charger = card('Charger', { keywords: ['charge'] });
  const dummy = card('Dummy');
  const b = newBattle(api, [charger], [dummy]);

  assert.equal(api.deploy(b, 'me', 0, 'front', 0), true);
  const unit = b.me.front[0];
  assert.equal(unit.fresh, true, 'freshly deployed unit should start fresh');

  api.endPlayerTurn(b);
  assert.equal(unit.fresh, true, 'ending the deploy turn must not clear fresh before the unit ever got to act');

  api.beginEnemyTurn(b);
  api.deploy(b, 'enemy', 0, 'front', 0);
  api.beginPlayerTurn(b);
  assert.equal(unit.exhausted, false, 'the unit should be able to act on its owner\'s next turn');
  assert.equal(unit.fresh, true, 'fresh must survive until the unit\'s actual first action');

  const before = b.enemy.front[0].curHp;
  assert.equal(api.attackWith(b, 'me', unit.iid), true);
  const dealt = before - b.enemy.front[0].curHp;
  assert.equal(dealt, 4, 'charge should add +2 to the base atk of 2 on this first real attack');
  assert.equal(unit.fresh, false, 'fresh should be cleared once the unit has actually attacked');
});

test('holdground protects a freshly deployed unit from charge regardless of which side deployed it', () => {
  const api = loadTypeScriptModule('src/game/battle.ts');
  const charger = card('Charger', { keywords: ['charge'], atk: 3 });
  const guard = card('Guard', { keywords: ['holdground'], hp: 20 });
  const b = newBattle(api, [charger], [guard]);

  assert.equal(api.deploy(b, 'me', 0, 'front', 0), true);
  const attacker = b.me.front[0];
  api.endPlayerTurn(b);

  assert.equal(api.deploy(b, 'enemy', 0, 'front', 0), true);
  const defender = b.enemy.front[0];
  assert.equal(defender.fresh, true);

  api.beginPlayerTurn(b);
  assert.equal(attacker.exhausted, false);
  assert.equal(defender.fresh, true, 'the defender should still be fresh when attacked on the very next player turn');

  const before = defender.curHp;
  api.attackWith(b, 'me', attacker.iid);
  const dealt = before - defender.curHp;
  assert.equal(dealt, 3, 'holdground should cancel the +2 charge bonus while the defender is still fresh, leaving only the base atk');
});

// --- Bug 5: population growth chance used a deterministic formula instead of real randomness -

test('finishDay population growth is driven by an actual random roll, not a deterministic function of day/population/season', () => {
  const source = fs.readFileSync(path.join(root, 'campaign.js'), 'utf8');
  assert.doesNotMatch(source, /state\.day \* 7 \+ state\.player\.population \* 13 \+ state\.season \* 3/, 'the deterministic pseudoRandom formula must be gone');

  let state = playableCampaign();
  state.player.resources.food = 500;
  state.player.population = 3;
  state.player.growthDebt = 0;
  // Force a clearly positive net-food day by giving the player plenty of idle food workers.
  state.player.workers = { food: 6, materials: 0, knowledge: 0, idle: 0 };

  const grown = Campaign.finishDayState(state, 0);
  assert.equal(grown.state.player.population, state.player.population + 1, 'roll=0 should always be below the growth chance and trigger growth');

  const notGrown = Campaign.finishDayState(state, 0.999999);
  assert.equal(notGrown.state.player.population, state.player.population, 'roll close to 1 should always be above the growth chance and skip growth');
});
