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
  const sandbox = {
    module: mod,
    exports: mod.exports,
    require(name) {
      if (Object.prototype.hasOwnProperty.call(dependencies, name)) return dependencies[name];
      throw new Error(`Unexpected import ${name} from ${relativePath}`);
    },
    console, setTimeout, clearTimeout, Date, Math,
  };
  if (relativePath === 'src/game/battle.ts') {
    dependencies = { './cards': { buildMilitia: () => [], uid: () => `test-${Math.random()}` }, ...dependencies };
  }
  vm.runInNewContext(javascript, sandbox, { filename: relativePath, timeout: 2000 });
  return mod.exports;
}

function card(name, options = {}) {
  return {
    id: name.toLowerCase().replaceAll(' ', '-'), name, card_type: 'unit', era: 'ancient',
    emoji: '⚔️', drop_cost: 0, action_cost: 1, hp: 3, atk: 2, description: 'Test card.',
    keywords: [], effects: [], ...options,
  };
}

test('a military-doctrine atkBonus raises the attack of every friendly unit but never the enemy\'s', () => {
  const api = loadTypeScriptModule('src/game/battle.ts');
  const myCards = [card('Doctrine Trooper A'), card('Doctrine Trooper B')];
  const enemyCards = [card('Enemy Trooper')];
  const b = api.createBattle(
    myCards, { hp: 20, energyMax: 10, energyGrowth: 1, atkBonus: 2 },
    enemyCards, { hp: 20, energyMax: 10, energyGrowth: 1 },
    { kind: 'practice', opponentId: 'test', name: 'Test enemy', clan: 'Test', era: 0, threatEra: 2, leaderBattle: false },
    0,
  );
  assert.equal(b.me.atkBonus, 2);
  assert.equal(b.enemy.atkBonus, 0);

  api.deploy(b, 'me', 0, 'front', 0);
  api.endPlayerTurn(b);
  api.deploy(b, 'enemy', 0, 'front', 0);
  const mine = b.me.front[0];
  const theirs = b.enemy.front[0];
  assert.ok(mine && theirs);
  assert.equal(mine.atk, 2);
  assert.equal(theirs.atk, 2);
  assert.equal(api.atkOf(b, mine), 4, 'friendly unit attack should include the +2 doctrine bonus');
  assert.equal(api.atkOf(b, theirs), 2, 'enemy unit attack must stay unaffected by the player\'s doctrine');
});

test('createBattle defaults atkBonus to 0 when the config omits it (backward compatible)', () => {
  const api = loadTypeScriptModule('src/game/battle.ts');
  const b = api.createBattle(
    [card('Plain')], { hp: 20, energyMax: 10, energyGrowth: 1 },
    [card('Plain Enemy')], { hp: 20, energyMax: 10, energyGrowth: 1 },
    { kind: 'practice', opponentId: 'test', name: 'Test enemy', clan: 'Test', era: 0, threatEra: 2, leaderBattle: false },
    0,
  );
  assert.equal(b.me.atkBonus, 0);
  assert.equal(b.enemy.atkBonus, 0);
});
