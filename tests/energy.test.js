const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const ts = require('typescript');

const root = path.join(__dirname, '..');

function loadTypeScriptModule(relativePath, dependencies = {}) {
  const file = path.join(root, relativePath);
  const source = fs.readFileSync(file, 'utf8');
  const javascript = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
    fileName: file,
  }).outputText;
  const mod = { exports: {} };
  let ids = 0;
  const sandbox = {
    module: mod,
    exports: mod.exports,
    require(name) {
      if (Object.prototype.hasOwnProperty.call(dependencies, name)) return dependencies[name];
      throw new Error(`Unexpected import ${name} from ${relativePath}`);
    },
    console,
    setTimeout,
    clearTimeout,
    Date,
    Math,
  };
  if (relativePath === 'src/game/battle.ts') {
    dependencies = {
      './cards': { buildMilitia: () => [], uid: () => `test-${++ids}` },
      ...dependencies,
    };
  }
  if (relativePath === 'src/game/cards.ts') {
    dependencies = { './model': { M: {} }, ...dependencies };
  }
  // Refresh the dependency closure after supplying the module-specific test stubs.
  sandbox.require = (name) => {
    if (Object.prototype.hasOwnProperty.call(dependencies, name)) return dependencies[name];
    throw new Error(`Unexpected import ${name} from ${relativePath}`);
  };
  vm.runInNewContext(javascript, sandbox, { filename: relativePath, timeout: 2000 });
  return mod.exports;
}

function card(name, options = {}) {
  return {
    id: name.toLowerCase().replaceAll(' ', '-'),
    name,
    card_type: 'unit',
    era: 'ancient',
    emoji: '⚔️',
    drop_cost: 1,
    action_cost: 1,
    hp: 3,
    atk: 2,
    description: 'Test card.',
    keywords: [],
    effects: [],
    ...options,
  };
}

function newBattle(api, playerCards = [], enemyCards = []) {
  const config = { hp: 20, energyMax: 10, energyGrowth: 1 };
  return api.createBattle(
    playerCards, config, enemyCards, config,
    { kind: 'practice', opponentId: 'test', name: 'Test enemy', clan: 'Test', era: 0, threatEra: 2, leaderBattle: false },
    0,
  );
}

test('the barbarian era decks pass the same card schema as crafted cards', () => {
  const Campaign = require('../campaign.js');
  const cards = loadTypeScriptModule('src/game/cards.ts');
  const state = Campaign.createState(12345);
  for (const id of ['reed', 'steppe', 'north']) {
    for (const era of [0, 1, 2]) {
      const staged = structuredClone(state);
      staged.opponents.find((opponent) => opponent.id === id).era = era;
      for (const opponentCard of Campaign.getOpponentBattleDeck(staged, id)) {
        assert.doesNotThrow(
          () => cards.validateCard(opponentCard, opponentCard.card_type, ['ancient', 'bronze']),
          `${id} era ${era}: ${opponentCard.name}`,
        );
        // Базовый шаблон племени равен обычной ковке; боевая версия может получить ожидаемый
        // множитель редкости угрозы эпохи, но всё равно остаётся в общем бюджете силы.
        if (opponentCard.card_type === 'spell') continue;
        const budget = Math.round(Campaign.cardBudgetOf(opponentCard) * Campaign.expectedCraftMultiplier(era));
        assert.ok(
          cards.cardPower(opponentCard) <= budget + 1,
          `${id} era ${era}: «${opponentCard.name}» силой ${cards.cardPower(opponentCard)} при бюджете ${budget}`,
        );
      }
    }
  }
});

test('deployment and attacks spend from one energy pool in the React battle engine', () => {
  const api = loadTypeScriptModule('src/game/battle.ts');
  const troop = card('Shared cost', { keywords: ['supply', 'warcry', 'harras', 'exhaustenemy'] });
  const b = newBattle(api, [troop], []);
  b.me.hand = [troop];

  assert.equal(api.deploy(b, 'me', 0, 'front', 0), true);
  // Первый ход сразу даёт прирост энергии (см. createBattle), поэтому пул начинается с 2, а
  // supply (+1 к пределу) и warcry (+1 к пулу) поднимают его до 3 — в одном и том же пуле.
  assert.equal(b.me.energy, 3, 'supply raises the maximum and supply plus warcry add to the same current pool');
  assert.equal(b.me.energyMax, 3);
  assert.equal(b.enemy.energy, 0, 'exhaustenemy spends from the opponent shared pool');
  assert.equal(b.enemy.energyGrowthBlockedNext, 1, 'harras delays the opponent shared-pool growth');

  const attacker = b.me.front[0];
  attacker.exhausted = false; // ready the unit to isolate the shared attack-cost check
  assert.equal(api.canAct(b, 'me', attacker), true);
  assert.equal(api.attackWith(b, 'me', attacker.iid), true);
  assert.equal(b.me.energy, 2, 'the attack cost is deducted from the same pool left after deployment');

  api.startTurn(b, 'enemy');
  assert.equal(b.enemy.energyMax, 1, 'harras blocks this turn’s energy-cap growth');
  assert.equal(b.enemy.energy, 1);
  assert.equal(b.enemy.energyGrowthBlockedNext, 0);
});

test('card validation prices play-energy words on spells and reserves raid triggers for units', () => {
  const cards = loadTypeScriptModule('src/game/cards.ts');
  const spell = {
    name: 'Mobilization', card_type: 'spell', era: 'ancient', drop_cost: 6,
    action_cost: 0, hp: 0, atk: 0, description: 'A quick order.',
    keywords: [],
    effects: [{
      event: 'enter_play', target: { side: 'controller', entity: 'player' },
      action: { type: 'modify_resource', resource: 'energy', amount: 1 },
    }],
  };
  for (const keyword of ['supply', 'warcry', 'harras', 'exhaustenemy']) {
    const valid = cards.validateCard({ ...spell, keywords: [keyword] }, 'spell', ['ancient']);
    assert.equal(JSON.stringify(valid.keywords), JSON.stringify([keyword]), `${keyword} is legal when its full energy value fits the budget`);
  }
  assert.throws(() => cards.validateCard({ ...spell, drop_cost: 1, keywords: ['supply', 'warcry', 'harras', 'exhaustenemy'] }, 'spell', ['ancient']), /бюджет/u,
    'stacking all economy words on a one-energy spell exceeds its power budget');
  assert.throws(() => cards.validateCard({ ...spell, keywords: ['raider'] }, 'spell', ['ancient']), /только отрядам/);
  assert.throws(() => cards.validateCard({ ...spell, keywords: ['loot'] }, 'spell', ['ancient']), /только отрядам/);
});

test('play-triggered energy keywords also apply to a spell played from hand', () => {
  const api = loadTypeScriptModule('src/game/battle.ts');
  const spell = card('Supply order', {
    card_type: 'spell', drop_cost: 1, action_cost: 0, hp: 0, atk: 0,
    keywords: ['supply', 'warcry', 'harras', 'exhaustenemy'], effects: [],
  });
  const b = newBattle(api, [spell], []);
  b.me.hand = [spell];
  b.enemy.energy = 1;

  assert.equal(api.cast(b, 'me', 0), true);
  assert.equal(b.me.energy, 3, 'первый ход даёт прирост, supply и warcry добавляют в тот же пул, ход манёвра вычитается');
  assert.equal(b.me.energyMax, 3);
  assert.equal(b.enemy.energy, 0);
  assert.equal(b.enemy.energyGrowthBlockedNext, 1);
});

test('raider and loot use the shared pool and transfer opponent energy on hit and kill', () => {
  const api = loadTypeScriptModule('src/game/battle.ts');
  const attackerCard = card('Raider', { drop_cost: 0, action_cost: 1, keywords: ['raider', 'loot'] });
  const defenderCard = card('Defender', { drop_cost: 1, action_cost: 0, hp: 1, atk: 0 });
  const b = newBattle(api, [attackerCard], [defenderCard]);
  b.me.hand = [attackerCard];
  assert.equal(api.deploy(b, 'me', 0, 'front', 0), true);

  b.active = 'enemy';
  b.enemy.energy = 1;
  b.enemy.energyMax = 3;
  b.enemy.hand = [defenderCard];
  assert.equal(api.deploy(b, 'enemy', 0, 'front', 0), true);
  b.active = 'me';
  b.me.energy = 1;
  b.me.energyMax = 3;
  b.enemy.energy = 1;

  const attacker = b.me.front[0];
  attacker.exhausted = false; // the attacking unit is already ready
  assert.equal(api.attackWith(b, 'me', attacker.iid), true);
  assert.equal(b.enemy.energy, 0);
  assert.equal(b.me.energy, 2, 'the steal and kill bonuses are available to the same energy pool');
});

test('effect resource aliases normalize to energy and target either side’s shared pool', () => {
  const cards = loadTypeScriptModule('src/game/cards.ts');
  const api = loadTypeScriptModule('src/game/battle.ts');
  const b = newBattle(api);
  b.me.energy = 1;
  b.me.energyMax = 5;
  b.enemy.energy = 0;
  b.enemy.energyMax = 5;

  for (const resource of ['energy', 'drop', 'action']) {
    const [effect] = cards.validateEffects([{
      event: 'enter_play', target: { side: 'controller', entity: 'player' },
      action: { type: 'modify_resource', resource, amount: 1 },
    }]);
    assert.equal(effect.action.resource, 'energy');

    const [condition] = cards.validateEffects([{
      event: 'enter_play', target: { side: 'controller', entity: 'player' },
      condition: { type: 'resource', side: 'controller', resource, op: 'eq', value: 1 },
      action: { type: 'modify_resource', resource, amount: 1 },
    }]);
    assert.equal(condition.condition.resource, 'energy');
  }

  const source = {
    name: 'Common energy',
    effects: cards.validateEffects([
      {
        event: 'enter_play',
        target: { side: 'controller', entity: 'player' },
        condition: { type: 'resource', side: 'controller', resource: 'action', op: 'eq', value: 1 },
        action: { type: 'modify_resource', resource: 'drop', amount: 1 },
      },
      {
        event: 'enter_play',
        target: { side: 'opponent', entity: 'player' },
        condition: { type: 'resource', side: 'controller', resource: 'drop', op: 'eq', value: 2 },
        action: { type: 'modify_resource', resource: 'action', amount: 2 },
      },
    ]),
  };
  api.runEffects(b, source, 'enter_play', 'me', null);

  assert.equal(b.me.energy, 2);
  assert.equal(b.enemy.energy, 2);
});
