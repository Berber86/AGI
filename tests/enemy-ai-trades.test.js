/** Решения ИИ при одновременном обмене ударами: ценный размен, отказ от самоубийственного и прорыв к вождю. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const ts = require('typescript');

const root = path.join(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'src/game/battle.ts'), 'utf8');
const javascript = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  fileName: 'src/game/battle.ts',
}).outputText;
const mod = { exports: {} };
let uid = 0;
vm.runInNewContext(javascript, {
  module: mod, exports: mod.exports, console, setTimeout, clearTimeout, Date, Math, JSON, Object, Array, String, Number,
  require(name) {
    if (name === './cards') return { buildMilitia: () => [], uid: () => `test-${++uid}` };
    throw new Error(`Unexpected import ${name}`);
  },
}, { filename: 'src/game/battle.ts', timeout: 5000 });
const api = mod.exports;

function card(name, options = {}) {
  return {
    id: name.toLowerCase().replaceAll(' ', '-'), name, card_type: 'unit', era: 'ancient', emoji: '⚔️',
    drop_cost: 1, action_cost: 1, hp: 3, atk: 2, description: 'Тестовая карта.',
    tags: [], abilities: [], keywords: [], effects: [], monkey_paw: '', ...options,
  };
}

/** Test setup helper: old fixtures start with up to four cards so tests can place several units. */
function topUpHandsForSetup(b) {
  for (const side of ['me', 'enemy']) {
    const player = b[side];
    const target = Math.min(4, player.hand.length + player.deck.length);
    while (player.hand.length < target) player.hand.push(player.deck.shift());
  }
  return b;
}

function stoneBattle(myCards, enemyCards) {
  const config = { hp: 20, energyMax: 10, energyGrowth: 1, fatigueDelay: 0, atkBonus: 0 };
  const match = { kind: 'practice', opponentId: 'reed', name: 'Илмар', clan: 'Речной Союз', era: 0, threatEra: 0, leaderBattle: false, tutorial: false };
  return topUpHandsForSetup(api.createBattle(myCards, config, enemyCards, { ...config }, match));
}

function deploy(b, side, name, slot) {
  const index = b[side].hand.findIndex((entry) => entry.name === name);
  assert.ok(index >= 0, `«${name}» должна быть в руке ${side}`);
  b.active = side;
  b[side].energy = 10;
  assert.equal(api.deploy(b, side, index, 'front', slot), true, `высадка «${name}»`);
}

function readyNoCards(b) {
  b.me.hand = [];
  b.enemy.hand = [];
  b.enemy.energy = 10;
  for (const side of ['me', 'enemy']) {
    for (const { unit } of api.unitsOf(b, side)) {
      unit.exhausted = false;
      unit.fresh = false;
    }
  }
  b.active = 'enemy';
}

function unitAt(b, side, slot) {
  const unit = api.rowsOf(b[side])[0][slot];
  assert.ok(unit, `нужен отряд ${side} в слоте ${slot}`);
  return unit;
}

test('ИИ пропускает размен, в котором его отряд погибает, а противник только ранен', () => {
  const b = stoneBattle(
    [card('Тяжёлый противник', { atk: 3, hp: 3 })],
    [card('Слабый налётчик', { atk: 1, hp: 1 })],
  );
  deploy(b, 'me', 'Тяжёлый противник', 0);
  deploy(b, 'enemy', 'Слабый налётчик', 0);
  readyNoCards(b);

  const attacker = unitAt(b, 'enemy', 0);
  const defender = unitAt(b, 'me', 0);
  assert.equal(api.enemyAct(b), false, 'убыточный размен лучше отложить');
  assert.equal(attacker.curHp, 1, 'ИИ не отправил свой отряд на верную смерть');
  assert.equal(defender.curHp, 3, 'противник не получил даже бесплатный урон');
  assert.equal(attacker.exhausted, false, 'отказ от атаки не расходует действие');
  assert.ok(!b.log.some((entry) => /атакует/u.test(entry.text)), 'в журнале нет совершённого удара');
});

test('ИИ выбирает выгодный размен вместо первого доступного атакующего', () => {
  const b = stoneBattle(
    [card('Броневой рубака', { atk: 3, hp: 3 }), card('Хрупкий ополченец', { atk: 1, hp: 1 })],
    [card('Слабый налётчик', { atk: 1, hp: 1 }), card('Сильный копейщик', { atk: 3, hp: 3 })],
  );
  deploy(b, 'me', 'Броневой рубака', 0);
  deploy(b, 'me', 'Хрупкий ополченец', 1);
  deploy(b, 'enemy', 'Слабый налётчик', 0);
  deploy(b, 'enemy', 'Сильный копейщик', 1);
  readyNoCards(b);

  assert.equal(api.enemyAct(b), true);
  assert.equal(api.rowsOf(b.me)[0][0].curHp, 3, 'ИИ не выбрал безнадёжную атаку слабым налётчиком');
  assert.equal(api.rowsOf(b.me)[0][1], null, 'сильный отряд снял хрупкую цель');
  assert.equal(api.rowsOf(b.enemy)[0][0].curHp, 1, 'слабый отряд сохранён для лучшей ситуации');
  assert.equal(api.rowsOf(b.enemy)[0][1].curHp, 2, 'сильный копейщик пережил ответный удар');
});

test('ИИ учитывает месть погибшего защитника и не меняет дорогой отряд на дешёвого мстителя', () => {
  const b = stoneBattle(
    [card('Мститель', { atk: 1, hp: 1, drop_cost: 1, keywords: ['vengeance:3'] })],
    [card('Дорогой рубака', { atk: 3, hp: 2, drop_cost: 3 })],
  );
  deploy(b, 'me', 'Мститель', 0);
  deploy(b, 'enemy', 'Дорогой рубака', 0);
  readyNoCards(b);

  const attacker = unitAt(b, 'enemy', 0);
  assert.equal(api.enemyAct(b), false, 'ответ и месть вместе убивают дорогого атакующего');
  assert.equal(attacker.curHp, 2);
  assert.equal(unitAt(b, 'me', 0).curHp, 1);
});

test('ИИ всё равно бьёт по вождю, если линия пуста и ответа не будет', () => {
  const b = stoneBattle([], [card('Копейщик', { atk: 2, hp: 2 })]);
  deploy(b, 'enemy', 'Копейщик', 0);
  readyNoCards(b);
  const heroHp = b.me.hp;
  assert.equal(api.enemyAct(b), true);
  assert.equal(b.me.hp, heroHp - 2);
});
