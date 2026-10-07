const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

const root = path.join(__dirname, '..');

/**
 * Столбцы как обеспечение боя: «Охват» наказывает открытый фланг и идёт вверх по своей полосе,
 * «Прикрытие» добавляет брони тому, кто стоит прямо перед ним, «Штаб» снабжает энергией из тыла,
 * «Корректировщик» наводит дальний и площадный огонь по целям своего столбца. Все четыре работают
 * по столбцу, а не по соседям в ряду, поэтому слова обеспечения могут стоять в любом ряду: их место
 * в глубине. На столе в одну линию молчит только «Прикрытие» — прикрывать там некого.
 */
function loadBattle() {
  const file = path.join(root, 'src', 'game', 'battle.ts');
  const javascript = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
    fileName: file,
  }).outputText;
  const mod = { exports: {} };
  let ids = 0;
  const sandbox = {
    module: mod, exports: mod.exports, console, setTimeout, clearTimeout, Date, Math, JSON, Object, Array, String, Number,
    require(name) {
      if (name === './cards') return { buildMilitia: () => [], uid: () => `u${++ids}` };
      throw new Error(`Unexpected import ${name}`);
    },
  };
  vm.runInNewContext(javascript, sandbox, { filename: file, timeout: 5000 });
  return mod.exports;
}

const api = loadBattle();

function card(name, options = {}) {
  return {
    id: name.toLowerCase().replaceAll(' ', '-'), name, card_type: 'unit', era: 'ancient', emoji: '🛡️',
    drop_cost: 1, action_cost: 1, hp: 5, atk: 2, description: 'Тестовая карта.',
    tags: [], abilities: [], keywords: [], effects: [], monkey_paw: '', ...options,
  };
}

const CFG = { hp: 30, energyMax: 12, energyGrowth: 2, fatigueDelay: 0, atkBonus: 0 };

/** Test setup helper: old fixtures start with up to four cards so tests can place several units. */
function topUpHandsForSetup(b) {
  for (const side of ['me', 'enemy']) {
    const player = b[side];
    const target = Math.min(4, player.hand.length + player.deck.length);
    while (player.hand.length < target) player.hand.push(player.deck.shift());
  }
  return b;
}

function battleAt(threatEra, myCards, enemyCards, cfg = {}) {
  const config = { ...CFG, ...cfg };
  const match = { kind: 'practice', opponentId: 'reed', name: 'Илмар', clan: 'Речной Союз', era: 0, threatEra, leaderBattle: false, tutorial: false };
  return topUpHandsForSetup(api.createBattle(myCards, config, enemyCards, { ...config }, match));
}

function place(b, side, cardName, row = 0, slot = 0) {
  const idx = b[side].hand.findIndex((c) => c.name === cardName);
  assert.ok(idx >= 0, `«${cardName}» должна быть в руке стороны ${side}`);
  const active = b.active;
  b.active = side;
  b[side].energy = 12;
  const ok = api.deploy(b, side, idx, row, slot);
  b.active = active;
  return ok;
}

/** Ставит отряд в любую клетку, минуя правила высадки (постройки идут на законный последний ряд). */
function putUnit(b, side, cardName, row = 0, slot = 0) {
  const idx = b[side].hand.findIndex((c) => c.name === cardName);
  assert.ok(idx >= 0, `«${cardName}» должна быть в руке стороны ${side}`);
  const rows = api.rowsOf(b[side]);
  const stage = b[side].hand[idx].card_type === 'structure' ? rows.length - 1 : 0;
  const free = rows[stage].indexOf(null);
  assert.ok(free >= 0, 'для переноса нужно свободное место на законном ряду');
  assert.equal(place(b, side, cardName, stage, free), true, `«${cardName}» должна выйти на стол`);
  const unit = rows[stage][free];
  rows[stage][free] = null;
  rows[row][slot] = unit;
  return unit;
}

/** Расставляет отряды по клеткам, беря из руки карты по порядку имён «Префикс 1…n». */
function deployAt(b, side, spots, prefix = 'Враг') {
  const out = [];
  for (const [ri, i] of spots) out.push(putUnit(b, side, `${prefix} ${out.length + 1}`, ri, i));
  return out;
}

function unitAt(b, side, row, slot) {
  const u = api.rowsOf(b[side])[row][slot];
  assert.ok(u, `в ${side}[${row}][${slot}] должен стоять отряд`);
  return u;
}

function refresh(b) {
  for (const side of ['me', 'enemy']) for (const s of api.unitsOf(b, side)) s.unit.exhausted = false;
}

const cells = (hits) => hits.map((h) => `${h.own ? 'свой' : 'чужой'} ${h.ri}:${h.i}`).join(' ');

const foe = (n = 1, options = {}) => Array.from({ length: n }, (_, k) => card(`Враг ${k + 1}`, { atk: 2, hp: 10, ...options }));

test('«Охват» бьёт сильнее по цели с открытым флангом: край стола или дыра в строю', () => {
  function duel(enemySpots, mySlot) {
    const b = battleAt(2, [card('Конница', { atk: 3, hp: 8, keywords: ['flank'] })], foe(enemySpots.length));
    deployAt(b, 'enemy', enemySpots);
    const rider = putUnit(b, 'me', 'Конница', 0, mySlot);
    refresh(b);
    b.active = 'me';
    b.me.energy = 8;
    const target = api.findTarget(b, rider, 'me');
    assert.equal(target.kind, 'unit', 'цель найдена');
    return { b, rider, target };
  }

  // Крайний столбец: соседа слева нет вовсе.
  const edge = duel([[0, 0], [0, 1], [0, 2]], 0);
  assert.equal(api.flankExposed(edge.b, edge.target.unit), true, 'у крайнего отряда фланг открыт');
  let hp = edge.target.unit.curHp;
  assert.equal(api.attackWith(edge.b, 'me', edge.rider.iid), true);
  assert.equal(hp - edge.target.unit.curHp, 4, '3 атаки + 1 за охват');

  // Плотный строй: соседи с обеих сторон, охватить нечего.
  const dense = duel([[0, 0], [0, 1], [0, 2], [0, 3]], 1);
  assert.equal(api.flankExposed(dense.b, dense.target.unit), false, 'в плотном строю фланги закрыты');
  hp = dense.target.unit.curHp;
  assert.equal(api.attackWith(dense.b, 'me', dense.rider.iid), true);
  assert.equal(hp - dense.target.unit.curHp, 3, 'обычный урон');

  // Дыра в строю открывает фланг даже в середине стола.
  const hole = duel([[0, 0], [0, 1], [0, 3]], 1);
  assert.equal(api.flankExposed(hole.b, hole.target.unit), true, 'пустая клетка рядом — тот же открытый фланг');
  hp = hole.target.unit.curHp;
  assert.equal(api.attackWith(hole.b, 'me', hole.rider.iid), true);
  assert.equal(hp - hole.target.unit.curHp, 4);
});

test('«Охват» при пустом слоте напротив идёт вверх по своему столбцу, а не вбок по чужому ряду', () => {
  function setup(keywords) {
    const b = battleAt(3, [card('Боец', { atk: 3, hp: 8, keywords })], [card('Глубинный', { hp: 10 }), card('Боковой', { hp: 10 })]);
    putUnit(b, 'enemy', 'Глубинный', 1, 1);
    putUnit(b, 'enemy', 'Боковой', 0, 0);
    const mine = putUnit(b, 'me', 'Боец', 0, 1);
    refresh(b);
    b.active = 'me';
    b.me.energy = 8;
    return { b, mine };
  }

  const plain = setup([]);
  const plainTarget = api.findTarget(plain.b, plain.mine, 'me');
  assert.equal(plainTarget.unit.name, 'Боковой', 'обычный боец ищет ближайшего в чужом авангарде');

  const flanker = setup(['flank']);
  const flankTarget = api.findTarget(flanker.b, flanker.mine, 'me');
  assert.equal(flankTarget.unit.name, 'Глубинный', 'охват поднимается по своей полосе');
  assert.equal(flankTarget.ri, 1);
  assert.equal(api.flankExposed(flanker.b, flankTarget.unit), true, 'и бьёт его как цель с открытым флангом');
});

test('«Прикрытие» даёт брони тому, кто стоит прямо перед ним, и броня эта настоящая', () => {
  const b = battleAt(3, [
    card('Передний', { hp: 10, keywords: ['armor:1'] }), card('Сосед', { hp: 10 }), card('Щит', { hp: 8, keywords: ['screen'] }),
  ], foe(1, { atk: 4 }));
  const front = putUnit(b, 'me', 'Передний', 0, 1);
  const side = putUnit(b, 'me', 'Сосед', 0, 2);
  assert.equal(api.armorOf(b, front), 1, 'пока прикрытия нет — только своя броня');

  const guard = putUnit(b, 'me', 'Щит', 1, 1);
  assert.equal(api.armorOf(b, front), 2, 'прикрытие этажом ниже добавило брони');
  assert.equal(api.armorOf(b, side), 0, 'соседний столбец не прикрыт');
  assert.equal(api.armorOf(b, guard), 0, 'сам прикрывающий от этого брони не получает');

  deployAt(b, 'enemy', [[0, 1]]);
  refresh(b);
  b.active = 'enemy';
  b.enemy.energy = 8;
  assert.equal(api.attackWith(b, 'enemy', unitAt(b, 'enemy', 0, 1).iid), true);
  assert.equal(front.curHp, 10 - 2, '4 атаки − 1 своя броня − 1 прикрытие');

  guard.curHp = 0;
  api.settle(b);
  assert.equal(api.armorOf(b, front), 1, 'прикрытие погибло — бонус ушёл вместе с ним');
});

test('прикрытие работает этажами, а постройка в тылу прикрывает не хуже отряда', () => {
  const chain = battleAt(3, [card('Передний', { hp: 10 }), card('Щит 1', { hp: 8, keywords: ['screen'] }), card('Щит 2', { hp: 8, keywords: ['screen'] })], []);
  const front = putUnit(chain, 'me', 'Передний', 0, 1);
  const mid = putUnit(chain, 'me', 'Щит 1', 1, 1);
  putUnit(chain, 'me', 'Щит 2', 2, 1);
  assert.equal(api.armorOf(chain, front), 1, 'авангард прикрыт средним рядом');
  assert.equal(api.armorOf(chain, mid), 1, 'средний ряд прикрыт тылом');

  const fort = battleAt(2, [
    card('Передний', { hp: 10 }),
    card('Надолбы', { card_type: 'structure', hp: 12, atk: 0, action_cost: 0, keywords: ['screen'] }),
  ], []);
  const guarded = putUnit(fort, 'me', 'Передний', 0, 1);
  assert.equal(api.armorOf(fort, guarded), 0);
  putUnit(fort, 'me', 'Надолбы', 1, 1);
  assert.equal(api.armorOf(fort, guarded), 1, 'постройка в тылу прикрывает отряд перед собой');
});

test('на столе в одну линию прикрывать некого: «Прикрытие» молчит вместе с дальним боем', () => {
  const b = battleAt(0, [card('Передний', { hp: 10 }), card('Щит', { hp: 8, keywords: ['screen'] })], []);
  const front = putUnit(b, 'me', 'Передний', 0, 1);
  putUnit(b, 'me', 'Щит', 0, 0);
  assert.equal(api.armorOf(b, front), 0, 'сосед в ряду не прикрывает: нужен ряд впереди');
  assert.equal(api.inactiveKeywords(b).includes('screen'), true, 'интерфейс помечает слово молчащим');
  assert.equal(api.inactiveKeywords(battleAt(2, [], [])).includes('screen'), false, 'со второго ряда оно снова работает');
  assert.equal(api.inactiveKeywords(b).includes('command'), false, 'штаб снабжает и с одной линии');
});

test('«Штаб» в тылу даёт энергию сверх предела, а вне тыла и мёртвым — нет', () => {
  const b = battleAt(2, [card('Штаб', { hp: 7, keywords: ['command'] }), card('Штаб 2', { hp: 7, keywords: ['command'] }), card('Боец', { hp: 8 })], []);
  const staff = putUnit(b, 'me', 'Штаб', 1, 0);
  assert.equal(api.commandBonus(b, 'me'), 1);

  b.active = 'me';
  const maxBefore = b.me.energyMax;
  api.startTurn(b, 'me');
  assert.equal(b.me.energyMax, Math.min(b.me.energyCap, maxBefore + b.me.energyGrowth), 'предел растёт как обычно');
  assert.equal(b.me.energy, b.me.energyMax + 1, 'штаб добавил энергию сверх предела');
  assert.ok(b.log.some((l) => /держит штаб в тылу/u.test(l.text)), 'снабжение видно в журнале');

  putUnit(b, 'me', 'Штаб 2', 1, 1);
  api.startTurn(b, 'me');
  assert.equal(b.me.energy, b.me.energyMax + 2, 'два штаба — две энергии');

  assert.equal(api.moveUnit(b, 'me', staff.iid, 0, 0), true, 'штаб можно переставить');
  api.startTurn(b, 'me');
  assert.equal(b.me.energy, b.me.energyMax + 1, 'в авангарде штаб не снабжает');

  const second = unitAt(b, 'me', 1, 1);
  second.curHp = 0;
  api.settle(b);
  api.startTurn(b, 'me');
  assert.equal(api.commandBonus(b, 'me'), 0);
  assert.equal(b.me.energy, b.me.energyMax, 'мёртвый штаб ничего не даёт');

  // Общий потолок энергии не пробивается даже штабами.
  const capped = battleAt(2, [card('Штаб', { hp: 7, keywords: ['command'] })], []);
  putUnit(capped, 'me', 'Штаб', 1, 0);
  capped.active = 'me';
  capped.me.energyMax = capped.me.energyCap;
  api.startTurn(capped, 'me');
  assert.equal(capped.me.energy, capped.me.energyCap, 'выше общего потолка энергия не поднимается');

  // На одной линии она же и тыл: штаб работает.
  const line = battleAt(0, [card('Штаб', { hp: 7, keywords: ['command'] })], []);
  putUnit(line, 'me', 'Штаб', 0, 0);
  line.active = 'me';
  assert.equal(api.commandBonus(line, 'me'), 1);
  api.startTurn(line, 'me');
  assert.equal(line.me.energy, line.me.energyMax + 1);
});

test('«Корректировщик» наводит дальний удар по целям своего столбца', () => {
  function setup(spotterColumn) {
    const my = [card('Стрелки', { atk: 3, hp: 7, keywords: ['ranged'] })];
    if (spotterColumn !== null) my.push(card('Наводчик', { atk: 1, hp: 6, keywords: ['ranged', 'spotter'] }));
    const b = battleAt(3, my, foe(1));
    putUnit(b, 'enemy', 'Враг 1', 0, 2);
    const gun = putUnit(b, 'me', 'Стрелки', 2, 0);
    if (spotterColumn !== null) putUnit(b, 'me', 'Наводчик', 1, spotterColumn);
    refresh(b);
    b.active = 'me';
    b.me.energy = 8;
    return { b, gun, target: unitAt(b, 'enemy', 0, 2) };
  }

  const none = setup(null);
  assert.equal(api.spotterBonus(none.b, 'me', 2, none.gun), 0);
  assert.equal(api.attackWith(none.b, 'me', none.gun.iid), true);
  assert.equal(none.target.curHp, 7, 'без наводчика урон обычный');

  const away = setup(0);
  assert.equal(api.spotterBonus(away.b, 'me', 2, away.gun), 0, 'наводчик в другом столбце не помогает');
  assert.equal(api.attackWith(away.b, 'me', away.gun.iid), true);
  assert.equal(away.target.curHp, 7);

  const onLane = setup(2);
  assert.equal(api.spotterBonus(onLane.b, 'me', 2, onLane.gun), 1, 'наводчик в столбце цели');
  assert.equal(api.attackWith(onLane.b, 'me', onLane.gun.iid), true);
  assert.equal(onLane.target.curHp, 6, 'стрелки получили +1 урона');

  // Сам себя наводчик не наводит: слово про обеспечение чужого огня.
  const solo = battleAt(3, [card('Разъезд', { atk: 3, hp: 7, keywords: ['ranged', 'spotter'] })], foe(1));
  putUnit(solo, 'enemy', 'Враг 1', 0, 2);
  const lone = putUnit(solo, 'me', 'Разъезд', 1, 2);
  refresh(solo);
  solo.active = 'me';
  solo.me.energy = 8;
  const loneTarget = unitAt(solo, 'enemy', 0, 2);
  assert.equal(api.spotterBonus(solo, 'me', 2, lone), 0, 'сам себя не наводит');
  assert.equal(api.attackWith(solo, 'me', lone.iid), true);
  assert.equal(loneTarget.curHp, 7);

  // Ближнему бою наводчик не помогает.
  const meleeBattle = battleAt(3, [card('Пехота', { atk: 3, hp: 8 }), card('Наводчик', { atk: 1, hp: 6, keywords: ['ranged', 'spotter'] })], foe(1));
  putUnit(meleeBattle, 'enemy', 'Враг 1', 0, 2);
  const infantry = putUnit(meleeBattle, 'me', 'Пехота', 0, 2);
  putUnit(meleeBattle, 'me', 'Наводчик', 1, 2);
  refresh(meleeBattle);
  meleeBattle.active = 'me';
  meleeBattle.me.energy = 8;
  const meleeTarget = unitAt(meleeBattle, 'enemy', 0, 2);
  assert.equal(api.attackWith(meleeBattle, 'me', infantry.iid), true);
  assert.equal(meleeTarget.curHp, 7, 'рукопашная наводкой не пользуется');
});

test('«Корректировщик» наводит и площадной удар: основная цель ближнего боя остаётся без бонуса', () => {
  const b = battleAt(3, [
    card('Мортира', { atk: 3, hp: 8, keywords: ['blast:1'] }),
    card('Наводчик', { atk: 1, hp: 6, keywords: ['ranged', 'spotter'] }),
  ], foe(2));
  deployAt(b, 'enemy', [[0, 1], [1, 1]]);
  const gun = putUnit(b, 'me', 'Мортира', 0, 1);
  putUnit(b, 'me', 'Наводчик', 2, 1);
  refresh(b);
  b.active = 'me';
  b.me.energy = 8;

  const target = api.findTarget(b, gun, 'me');
  assert.equal(cells(api.splashTargets(b, 'me', gun, target)), 'чужой 1:1', 'фугас накрывает отряд за целью');
  assert.equal(api.attackWith(b, 'me', gun.iid), true);
  assert.equal(unitAt(b, 'enemy', 0, 1).curHp, 7, 'ближнему бою наводчик не помогает: 3 урона');
  assert.equal(unitAt(b, 'enemy', 1, 1).curHp, 8, 'а площадной урон в столбце наводчика: 1 + 1');
});

test('слова обеспечения стоят в глубине, а охват и чистый ближний бой — в авангарде', () => {
  const b = battleAt(3, [card('Щит', { hp: 8, keywords: ['screen'] })], []);
  const p = b.me;
  assert.equal(api.SUPPORT_KEYWORDS.join(','), 'screen,command,spotter');
  assert.equal(api.canStandInRow({ card_type: 'unit', keywords: ['screen'] }, p, 1), true);
  assert.equal(api.canStandInRow({ card_type: 'unit', keywords: ['command'] }, p, 2), true);
  assert.equal(api.canStandInRow({ card_type: 'unit', keywords: ['spotter'] }, p, 2), true);
  assert.equal(api.canStandInRow({ card_type: 'unit', keywords: [] }, p, 1), false, 'ближний бой без стрельбы в глубину не пускают');
  assert.equal(api.canStandInRow({ card_type: 'unit', keywords: ['flank'] }, p, 1), false, 'охват — слово авангарда');
  assert.equal(api.canStandInRow({ card_type: 'structure', keywords: ['screen'] }, p, 1), false, 'постройки по-прежнему только в тыл');

  const shield = putUnit(b, 'me', 'Щит', 0, 0);
  b.active = 'me';
  b.me.energy = 5;
  refresh(b);
  assert.equal(api.moveUnit(b, 'me', shield.iid, 1, 0), true, 'перестроение подчиняется тому же правилу и пускает прикрытие вглубь');
  assert.equal(api.moveUnit(b, 'me', shield.iid, 0, 0), false, 'но назад в авангард — уже второй манёвр за ход');
});

test('противник ставит слова обеспечения в глубину, а не в авангард', () => {
  const b = battleAt(3, [card('Боец', { hp: 8 })], [
    card('Штаб', { hp: 7, keywords: ['command'], drop_cost: 2 }),
    card('Щит', { hp: 8, keywords: ['screen'], drop_cost: 1 }),
  ]);
  b.active = 'enemy';
  b.enemy.energy = 10;
  assert.equal(api.enemyAct(b), true, 'первым вышел штаб — он дороже');
  assert.equal(api.commandBonus(b, 'enemy'), 1, 'и встал в последний ряд, где он снабжает');
  assert.equal(api.enemyAct(b), true, 'вторым вышло прикрытие');
  const placed = api.unitsOf(b, 'enemy').filter((s) => !s.unit.isStructure);
  assert.equal(placed.length, 2);
  assert.ok(placed.every((s) => s.ri > 0), 'слова обеспечения ушли в глубину, а не на линию');
});

test('столбец как этаж обеспечения: прикрытие, наводчик и штаб в одной полосе', () => {
  const b = battleAt(4, [
    card('Передний', { atk: 3, hp: 10, keywords: ['armor:1'] }),
    card('Щит', { hp: 8, keywords: ['screen'] }),
    card('Наводчик', { atk: 1, hp: 6, keywords: ['ranged', 'spotter'] }),
    card('Штаб', { hp: 7, keywords: ['command'] }),
  ], foe(1, { atk: 4 }));
  const front = putUnit(b, 'me', 'Передний', 0, 1);
  putUnit(b, 'me', 'Щит', 1, 1);
  putUnit(b, 'me', 'Наводчик', 2, 1);
  putUnit(b, 'me', 'Штаб', 3, 1);
  deployAt(b, 'enemy', [[0, 1]]);

  assert.equal(b.shape.rows, 4, 'стол Эпохи Пара и Стали: четыре ряда');
  assert.equal(api.armorOf(b, front), 2, 'своя броня и прикрытие из тыла');
  assert.equal(api.commandBonus(b, 'me'), 1, 'штаб в последнем ряду снабжает');
  assert.equal(api.spotterBonus(b, 'me', 1, front), 1, 'наводчик в том же столбце наводит');

  b.active = 'me';
  api.startTurn(b, 'me');
  assert.equal(b.me.energy, b.me.energyMax + 1, 'снабжение пришло в начале хода');

  refresh(b);
  b.active = 'enemy';
  b.enemy.energy = 8;
  assert.equal(api.attackWith(b, 'enemy', unitAt(b, 'enemy', 0, 1).iid), true);
  assert.equal(front.curHp, 8, 'этаж прикрытия принял удар: 4 атаки − 2 брони');
});
