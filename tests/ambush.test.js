const assert = require('node:assert/strict');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const esbuild = require('esbuild');

function loadBattle() {
  const out = esbuild.buildSync({
    entryPoints: [path.join(__dirname, '..', 'src', 'game', 'battle.ts')],
    bundle: true, write: false, platform: 'node', format: 'cjs', logLevel: 'silent',
    loader: { '.ts': 'ts' },
  });
  const module = { exports: {} };
  const sandbox = { module, exports: module.exports, require, process, console, CampaignMvp: require('../campaign.js') };
  vm.runInNewContext(out.outputFiles[0].text, sandbox);
  return sandbox.module.exports;
}

const battle = loadBattle();
const cfg = { hp: 30, energyMax: 10, energyGrowth: 0 };
function card(name, keywords, atk = 1, hp = 6) {
  return { id: name, name, card_type: 'unit', era: 'ancient', emoji: 'x', drop_cost: 1, action_cost: 1, atk, hp, description: '', keywords, effects: [] };
}

function deployedBattle({ attacker = card('Нападающий', [], 2), ambusher = card('Засадник', ['skirmish']), targetSide = 'me' } = {}) {
  const b = battle.createBattle([ambusher], cfg, [attacker], cfg, { kind: 'practice', name: 'Тест' }, 0);
  b.me.energy = 10; b.me.energyMax = 10;
  assert.equal(battle.deploy(b, 'me', 0, 'front', 0), true);
  b.active = 'enemy'; b.enemy.energy = 10; b.enemy.energyMax = 10;
  assert.equal(battle.deploy(b, 'enemy', 0, 'front', 0), true);
  b.active = targetSide;
  b[targetSide].energy = 10;
  return b;
}

test('a skirmisher that retreated after attacking can attack again from the back row', () => {
  const b = deployedBattle({ attacker: card('Мишень', [], 0, 10) });
  const ambusher = b.me.front[0];
  assert.ok(ambusher);
  ambusher.exhausted = false;

  assert.equal(battle.attackWith(b, 'me', ambusher.iid), true);
  assert.equal(b.me.front.includes(ambusher), false);
  assert.equal(b.me.back.includes(ambusher), true);

  // The next turn is represented directly: the unit is ready and has energy.
  ambusher.exhausted = false;
  b.me.energy = 10;
  assert.ok(battle.findTarget(b, ambusher, 'me'), 'the retreated ambusher has a back-row target');
  assert.equal(battle.attackWith(b, 'me', ambusher.iid), true);
  assert.equal(b.enemy.front[0].curHp, 8);
});

test('a front-row ambusher retreats before a melee exchange deals damage', () => {
  const b = deployedBattle({ attacker: card('Мечник', [], 2, 6), targetSide: 'enemy' });
  const ambusher = b.me.front[0];
  const attacker = b.enemy.front[0];
  assert.ok(ambusher && attacker);
  attacker.exhausted = false;

  assert.equal(battle.attackWith(b, 'enemy', attacker.iid), true);
  assert.equal(b.me.front.includes(ambusher), false);
  assert.equal(b.me.back.includes(ambusher), true);
  assert.equal(ambusher.curHp, 4, 'the ambusher still takes the melee hit after moving');
  assert.ok(b.log.some((entry) => /до обмена ударами/.test(entry.text)));
});
