/**
 * Обмен ударами: ответный удар наносится одновременно с атакующим, а не только выжившим защитником.
 *
 * До правила обмена ответный урон вовсе не рассчитывался; при 1–3 HP это особенно заметно — отряд
 * мог погибнуть, не успев причинить встречный урон. Теперь удар и ответ — один обмен: защитник бьёт
 * в ответ, даже если погибает. Сила ответа считается до урона, чтобы бонусы умирающего
 * отряда (заряд, клин, стена щитов) не пересчитывались по искалеченному составу.
 *
 * Что ответом не считается и осталось прежним: стрелок ответа не получает (его не достать), постройка
 * не дерётся, уклонившаяся засада не бьёт и не получает урона, площадь ответных ударов не вызывает.
 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const ts = require('typescript');

const Campaign = require('../campaign.js');
const root = path.join(__dirname, '..');

function loadTypeScriptModule(relativePath, dependencies = {}) {
  const file = path.join(root, relativePath);
  const javascript = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
    fileName: file,
  }).outputText;
  const mod = { exports: {} };
  let ids = 0;
  if (relativePath === 'src/game/battle.ts') {
    dependencies = { './cards': { buildMilitia: () => [], uid: () => `u${++ids}` }, ...dependencies };
  }
  const sandbox = {
    module: mod, exports: mod.exports, console, setTimeout, clearTimeout, Date, Math, JSON, Object, Array, String, Number,
    require: (name) => {
      if (Object.prototype.hasOwnProperty.call(dependencies, name)) return dependencies[name];
      throw new Error(`Unexpected import ${name} from ${relativePath}`);
    },
  };
  vm.runInNewContext(javascript, sandbox, { filename: relativePath, timeout: 5000 });
  return mod.exports;
}

const api = loadTypeScriptModule('src/game/battle.ts');

function card(name, options = {}) {
  return {
    id: name.toLowerCase().replaceAll(' ', '-'), name, card_type: 'unit', era: 'ancient', emoji: '⚔️',
    drop_cost: 1, action_cost: 1, hp: 5, atk: 2, description: 'Тестовая карта.',
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

function battle(myCards, enemyCards, threatEra = 2, cfg = {}) {
  const config = { hp: 20, energyMax: 10, energyGrowth: 1, fatigueDelay: 0, atkBonus: 0, ...cfg };
  const match = { kind: 'practice', opponentId: 'reed', name: 'Илмар', clan: 'Речной Союз', era: 0, threatEra, leaderBattle: false, tutorial: false };
  return topUpHandsForSetup(api.createBattle(myCards, config, enemyCards, { ...config }, match));
}

function place(b, side, cardName, row = 'front', slot = 0) {
  const idx = b[side].hand.findIndex((c) => c.name === cardName);
  assert.ok(idx >= 0, `«${cardName}» должна быть в руке стороны ${side}`);
  const active = b.active;
  b.active = side;
  b[side].energy = 10;
  const ok = api.deploy(b, side, idx, row, slot);
  b.active = active;
  return ok;
}

function rowArr(b, side, row) {
  return typeof row === 'number' ? api.rowsOf(b[side])[row] : b[side][row];
}

function unitAt(b, side, row, slot) {
  const u = rowArr(b, side, row)[slot];
  assert.ok(u, `в ${side}.${row}[${slot}] должен стоять отряд`);
  return u;
}

function refresh(b) {
  for (const side of ['me', 'enemy']) for (const s of api.unitsOf(b, side)) s.unit.exhausted = false;
}

function attack(b, side, row = 'front', slot = 0) {
  const u = unitAt(b, side, row, slot);
  const active = b.active;
  b.active = side;
  b[side].energy = 10;
  const ok = api.attackWith(b, side, u.iid);
  b.active = active;
  return ok;
}

/** Столкновение двух отрядов в передних рядах: ровно один обмен ударами. */
function clash(myCard, enemyCard, threatEra = 2, cfg) {
  const b = battle([myCard], [enemyCard], threatEra, cfg);
  assert.equal(place(b, 'me', myCard.name), true);
  assert.equal(place(b, 'enemy', enemyCard.name), true);
  refresh(b);
  return b;
}

const fallen = (b, name) => b.log.filter((l) => new RegExp(`«${name}» повержен|«${name}» пал`, 'u').test(l.text)).length;
/** Строка обмена: смерть защитника попадает в журнал позже, поэтому ищем строку удара, а не последнюю. */
const exchange = (b) => b.log.find((l) => /атакует «.*»: −\d+( \/ ответ −\d+)?\./u.test(l.text));

test('защитник отвечает, даже если этот удар его убивает', () => {
  const b = clash(card('Рубака', { atk: 5, hp: 10 }), card('Копейщик', { atk: 2, hp: 2 }));
  const me = unitAt(b, 'me', 'front', 0);
  assert.equal(attack(b, 'me'), true);
  assert.equal(fallen(b, 'Копейщик'), 1, 'защитник погиб от удара');
  assert.equal(me.curHp, 8, 'но ответить успел: урон обмена нанесён одновременно');
  assert.match(exchange(b).text, /атакует «Копейщик»: −5 \/ ответ −2/u, 'обе половины обмена — в одной строке журнала');
});

test('обоюдная гибель: оба отряда бьют и оба падают', () => {
  const b = clash(card('Топорник', { atk: 3, hp: 3 }), card('Дубинщик', { atk: 3, hp: 3 }));
  assert.equal(attack(b, 'me'), true);
  assert.equal(fallen(b, 'Дубинщик'), 1);
  assert.equal(fallen(b, 'Топорник'), 1, 'атакующий получил ответ и пал');
  assert.equal(api.rowsOf(b.me)[0][0], null, 'клетка пуста');
  assert.equal(api.rowsOf(b.enemy)[0][0], null, 'и у противника тоже');
});

test('сила ответа считается до урона: заряд умирающего всё равно бьёт в полную силу', () => {
  const b = clash(card('Рубака', { atk: 5, hp: 10 }), card('Всадник', { atk: 2, hp: 2, keywords: ['charge'] }));
  const rider = unitAt(b, 'enemy', 'front', 0);
  assert.equal(rider.fresh, true, 'только что высаженный отряд считается свежим');
  assert.equal(attack(b, 'me'), true);
  assert.equal(fallen(b, 'Всадник'), 1);
  assert.equal(unitAt(b, 'me', 'front', 0).curHp, 10 - 4, 'ответ пришёл с натиском (+2), а не ослабленным');
  assert.match(exchange(b).text, /ответ −4/u);
});

test('броня атакующего гасит ответ, но не ниже единицы', () => {
  const b = clash(card('Щитоносец', { atk: 5, hp: 10, keywords: ['armor:2'] }), card('Копейщик', { atk: 2, hp: 2 }));
  assert.equal(attack(b, 'me'), true);
  assert.equal(unitAt(b, 'me', 'front', 0).curHp, 10 - 1, 'броня 2 поглотила ответ почти целиком');
  assert.match(exchange(b).text, /ответ −1/u);
});

test('месть бьёт сверх ответа: умирающий отряд успевает и ответить, и отомстить', () => {
  const b = clash(card('Рубака', { atk: 5, hp: 10 }), card('Смертник', { atk: 2, hp: 2, keywords: ['vengeance:3'] }));
  assert.equal(attack(b, 'me'), true);
  assert.equal(unitAt(b, 'me', 'front', 0).curHp, 10 - 2 - 3, 'сначала ответ, потом удар мести');
  assert.ok(b.log.some((l) => /удар мести: −3/u.test(l.text)), 'месть записана отдельной строкой');
});

test('стрелок ответа не получает: его не достать из глубины стола', () => {
  const b = battle([card('Лучник', { atk: 3, hp: 3, keywords: ['ranged'] })], [card('Копейщик', { atk: 2, hp: 6 })]);
  const bow = api.rowsOf(b.me);
  assert.equal(place(b, 'me', 'Лучник', 'back', 0), true);
  assert.equal(place(b, 'enemy', 'Копейщик'), true);
  refresh(b);
  b.active = 'me';
  b.me.energy = 10;
  const archer = bow[1][0];
  assert.equal(api.attackWith(b, 'me', archer.iid), true);
  assert.equal(archer.curHp, 3, 'дальний бой остаётся безнаказанным');
  assert.ok(!b.log.some((l) => /ответ −/u.test(l.text)), 'в журнале нет ответа');
});

test('постройка не дерётся: осада бьёт её без ответного удара', () => {
  const b = battle([card('Таран', { atk: 3, hp: 8, keywords: ['siege'] })],
    [card('Частокол', { card_type: 'structure', atk: 4, hp: 10, action_cost: 0 })], 3);
  const fort = api.rowsOf(b.enemy);
  assert.equal(place(b, 'me', 'Таран'), true);
  assert.equal(place(b, 'enemy', 'Частокол', fort.length - 1, 0), true);
  refresh(b);
  b.active = 'me';
  b.me.energy = 10;
  const ram = unitAt(b, 'me', 'front', 0);
  assert.equal(api.attackWith(b, 'me', ram.iid), true);
  assert.equal(ram.curHp, 8, 'постройка не отвечает, даже когда у неё есть атака');
  assert.ok(!b.log.some((l) => /ответ −/u.test(l.text)));
});

test('уклонившаяся засада не бьёт и не получает урона: обмена нет вовсе', () => {
  const b = battle([card('Рубака', { atk: 5, hp: 10 }), card('Запасной', { atk: 1, hp: 4 })],
    [card('Засадчик', { atk: 3, hp: 3, keywords: ['ranged', 'skirmish'] })]);
  assert.equal(place(b, 'me', 'Рубака'), true);
  assert.equal(place(b, 'enemy', 'Засадчик'), true);
  refresh(b);
  const dodger = unitAt(b, 'enemy', 'front', 0);
  assert.equal(attack(b, 'me'), true);
  assert.equal(dodger.curHp, 3, 'засада уклонилась в тыл до обмена ударами');
  assert.equal(unitAt(b, 'me', 'front', 0).curHp, 10, 'и не ударила в ответ');
  assert.ok(b.log.some((l) => /уклоняется в тыл/u.test(l.text)));
});

test('площадь ответных ударов не вызывает: отвечает только основная цель', () => {
  const b = battle([card('Мортира', { atk: 6, hp: 8, keywords: ['blast:2'] })],
    [card('Копейщик А', { atk: 3, hp: 2 }), card('Копейщик Б', { atk: 3, hp: 2 }), card('Копейщик В', { atk: 3, hp: 9 })]);
  ['Копейщик А', 'Копейщик Б', 'Копейщик В'].forEach((name, i) => assert.equal(place(b, 'enemy', name, 'front', i), true));
  assert.equal(place(b, 'me', 'Мортира'), true);
  refresh(b);
  const mortar = unitAt(b, 'me', 'front', 0);
  assert.equal(attack(b, 'me'), true);
  // Основная цель — это обычный удар, она отвечает (и погибает). А вот накрытые площадью соседи —
  // нет: иначе один фугас собирал бы ответ со всего ряда.
  assert.equal(mortar.curHp, 8 - 3, 'ответила только основная цель, двое накрытых — нет');
  assert.equal(fallen(b, 'Копейщик А'), 1, 'основная цель погибла от полного урона');
  assert.equal(fallen(b, 'Копейщик Б'), 1, 'соседа накрыло площадью');
});

test('на столе Каменного века отвечают все: стрелков там нет, бой рукопашный', () => {
  const b = clash(card('Охотники с луками', { atk: 2, hp: 4, keywords: ['ranged'] }),
    card('Копейщик', { atk: 2, hp: 4 }), 0);
  assert.equal(api.rowsOf(b.enemy).length, 1, 'стол Каменного века — одна линия');
  const bow = unitAt(b, 'me', 'front', 0);
  assert.equal(attack(b, 'me'), true, 'слово «дальний бой» на этом столе молчит, удар рукопашный');
  assert.equal(bow.curHp, 2, 'и ответ прилетел — стрелком отряд здесь не считается');
  assert.match(exchange(b).text, /ответ −2/u);
});

test('ответный удар не мешает прорыву: вождь не отвечает', () => {
  const b = battle([card('Рубака', { atk: 3, hp: 8 })], [card('Копейщик', { atk: 2, hp: 6 })], 0);
  assert.equal(place(b, 'me', 'Рубака', 'front', 0), true);
  assert.equal(place(b, 'enemy', 'Копейщик', 'front', 2), true);
  refresh(b);
  const foeHero = b.enemy.hp;
  assert.equal(attack(b, 'me'), true, 'в столбце атакующего у врага никого нет — удар проходит вождю');
  assert.equal(b.enemy.hp, foeHero - 3, 'вождь получил урон');
  assert.equal(unitAt(b, 'me', 'front', 0).curHp, 8, 'вождь не отвечает на удар');
});
