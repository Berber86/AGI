const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const Campaign = require('../campaign.js');

const root = path.join(__dirname, '..');

/**
 * Стол растёт вместе с эпохами: Каменный век — одна линия в три клетки (бой копейщиков и
 * дубинщиков), Античный мир — вторые ряды, Средневековье — четвёртый столбец, Ренессанс — третий
 * ряд, Эпоха Пара и Стали — четвёртый ряд, Новейшее время — пятый столбец, Будущее — пятый ряд.
 * Размер общий для обеих сторон и берётся из эпохи угрозы (максимум эпох игрока и племени),
 * как HP и энергия. Лимит колоды растёт следом, иначе большой стол нечем заполнить.
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
    id: name.toLowerCase().replaceAll(' ', '-'), name, card_type: 'unit', era: 'ancient', emoji: '⚔️',
    drop_cost: 1, action_cost: 1, hp: 5, atk: 2, description: 'Тестовая карта.',
    tags: [], abilities: [], keywords: [], effects: [], monkey_paw: '', ...options,
  };
}

const CFG = { hp: 30, energyMax: 12, energyGrowth: 2, fatigueDelay: 0, atkBonus: 0 };

/** Бой на столе нужной эпохи: threatEra задаёт форму стола. */
function battleAt(threatEra, myCards, enemyCards, cfg = {}) {
  const config = { ...CFG, ...cfg };
  const match = { kind: 'practice', opponentId: 'reed', name: 'Илмар', clan: 'Речной Союз', era: 0, threatEra, leaderBattle: false, tutorial: false };
  return api.createBattle(myCards, config, enemyCards, { ...config }, match);
}

/** Выводит карту из руки на стол законным способом (deploy проверяет правила рядов). */
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

/**
 * Ставит отряд в любой ряд, минуя правила высадки: deploy их теперь проверяет (постройки — только
 * в последний ряд, ближний бой без стрельбы — только в авангард), а эти тесты смотрят на бой
 * отряда, который уже оказался в глубине стола. Карта выходит на законный ряд и переносится.
 */
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
  rows[typeof row === 'number' ? row : row === 'back' ? rows.length - 1 : 0][slot] = unit;
  return unit;
}

function unitAt(b, side, row, slot) {
  const u = api.rowsOf(b[side])[row][slot];
  assert.ok(u, `в ${side}[${row}][${slot}] должен стоять отряд`);
  return u;
}

function refresh(b) {
  for (const side of ['me', 'enemy']) for (const s of api.unitsOf(b, side)) s.unit.exhausted = false;
}

function attackWith(b, side, row, slot) {
  const u = unitAt(b, side, row, slot);
  b.active = side;
  b[side].energy = 12;
  return api.attackWith(b, side, u.iid);
}

/* ---------------- расписание роста стола ---------------- */

test('стол растёт по эпохам ровно так, как задумано: ряды и столбцы чередуются', () => {
  // Объекты из vm-контекста движка имеют свой Object.prototype, поэтому формы стола сравниваем сериализацией.
  const shapes = api.BOARD_SHAPES.map((s) => `${s.rows}×${s.slots}`).join(',');
  assert.equal(shapes, '1×3,2×3,2×4,3×4,4×4,4×5,5×5', 'Каменный век → Будущее');
  assert.equal(api.BOARD_SHAPES.length, Campaign.ERAS.length, 'по одной форме стола на эпоху');
  assert.equal(api.boardLabel(api.BOARD_SHAPES[6]), '5×5');

  assert.equal(JSON.stringify(api.boardShape(0)), JSON.stringify({ rows: 1, slots: 3 }));
  assert.equal(JSON.stringify(api.boardShape(3)), JSON.stringify({ rows: 3, slots: 4 }));
  assert.equal(JSON.stringify(api.boardShape(6)), JSON.stringify({ rows: 5, slots: 5 }));
  assert.equal(JSON.stringify(api.boardShape(-4)), JSON.stringify(api.BOARD_SHAPES[0]), 'эпоха ниже нуля — первый стол');
  assert.equal(JSON.stringify(api.boardShape(99)), JSON.stringify(api.BOARD_SHAPES[6]), 'и выше последней — последний');
  assert.equal(JSON.stringify(api.boardShape(undefined)), JSON.stringify({ rows: 2, slots: 4 }), 'без эпохи стол классический: 2×4');
  assert.equal(api.DEFAULT_BOARD_ERA, 2);
});

test('бой создаётся по эпохе угрозы, а не по эпохе племени', () => {
  for (const era of [0, 1, 2, 3, 4, 5, 6]) {
    const b = battleAt(era, [card('Отряд')], [card('Враг')]);
    assert.equal(JSON.stringify(b.shape), JSON.stringify(api.BOARD_SHAPES[era]), `эпоха ${era}`);
    assert.equal(api.rowsOf(b.me).length, api.BOARD_SHAPES[era].rows);
    assert.equal(api.rowsOf(b.enemy).length, api.BOARD_SHAPES[era].rows, 'стол общий для обеих сторон');
    for (const row of api.rowsOf(b.me)) assert.equal(row.length, api.BOARD_SHAPES[era].slots);
    assert.match(b.log.map((l) => l.text).join(' '), new RegExp(`${api.BOARD_SHAPES[era].slots} клетки`), 'размер стола объявлен в журнале');
  }

  // Эпоха угрозы — максимум эпох игрока и племени: её и отдаёт модель кампании.
  const state = Campaign.createState(20261006);
  state.player.onboardingComplete = true;
  state.player.era = 4;
  const cfg = Campaign.getOpponentBattleConfig(Campaign.normalizeState(state), 'reed');
  assert.equal(cfg.era, 0, 'племя остаётся в Каменном веке');
  assert.equal(cfg.threatEra, 4, 'а эпоха угрозы — эпоха игрока');
  assert.equal(JSON.stringify(api.boardShape(cfg.threatEra)), JSON.stringify({ rows: 4, slots: 4 }), 'стол будущего боя — 4×4');
});

test('Каменный век: одна линия — она же авангард, она же тыл', () => {
  const b = battleAt(0, [card('Копейщики'), card('Частокол', { card_type: 'structure', atk: 0, action_cost: 0, hp: 4 }), card('Пращники', { keywords: ['ranged'] })], [card('Дубинщики', { hp: 6 })]);
  const rows = api.rowsOf(b.me);
  assert.equal(rows.length, 1, 'ряд единственный');
  assert.equal(rows[0].length, 3, 'в нём три клетки');
  assert.equal(b.me.front, b.me.back, 'front и back — один и тот же массив');
  assert.equal(api.rowName(b.me, 0), 'линия');
  assert.equal(api.isBackRow(b.me, 0), true, 'единственная линия считается тылом…');
  assert.equal(api.isFrontRow(b.me, 0), true, '…и авангардом одновременно');

  assert.equal(place(b, 'me', 'Копейщики', 0, 0), true, 'ближний бой встаёт на линию');
  assert.equal(place(b, 'me', 'Частокол', 0, 1), true, 'постройке есть куда встать: последний ряд — он же первый');
  assert.equal(place(b, 'me', 'Пращники', 0, 2), true);
  assert.equal(api.rowCount(b.me), 1);

  place(b, 'enemy', 'Дубинщики', 0, 0);
  refresh(b);
  assert.equal(api.findTarget(b, unitAt(b, 'me', 0, 0), 'me').unit.name, 'Дубинщики', 'линия бьёт линию');

  // Уклоняться в тыл некуда: засада остаётся на линии и принимает ближний бой.
  const ambush = battleAt(0, [card('Засадный', { keywords: ['skirmish'] })], [card('Дубинщики', { hp: 6 })]);
  place(ambush, 'me', 'Засадный', 0, 0);
  place(ambush, 'enemy', 'Дубинщики', 0, 0);
  refresh(ambush);
  attackWith(ambush, 'me', 0, 0);
  assert.equal(api.rowCount(ambush.me), 1);
  assert.ok(unitAt(ambush, 'me', 0, 0), 'отряд не провалился в несуществующий тыл');
  assert.ok(unitAt(ambush, 'enemy', 0, 0).curHp < 6, 'и удар состоялся');
});

/* ---------------- правила рядов ---------------- */

test('постройки — только в последний ряд, ближний бой — только в авангард, стрелки — куда угодно', () => {
  const b = battleAt(3, [
    card('Копейщики'), card('Пращники', { keywords: ['ranged'] }), card('Копьеносцы', { keywords: ['reach'] }),
    card('Частокол', { card_type: 'structure', atk: 0, action_cost: 0, hp: 4 }),
  ], [card('Враг')]);
  const rows = api.rowsOf(b.me);
  assert.equal(rows.length, 3, 'стол Ренессанса: три ряда');

  assert.equal(place(b, 'me', 'Копейщики', 1, 0), false, 'ближний бой без стрельбы в средний ряд не выпускают');
  assert.equal(place(b, 'me', 'Копейщики', 2, 0), false, '…и в тыл тоже');
  assert.equal(place(b, 'me', 'Копейщики', 0, 0), true, 'авангард — его место');

  assert.equal(place(b, 'me', 'Пращники', 2, 0), true, 'дальний бой встаёт в тыл');
  assert.equal(place(b, 'me', 'Копьеносцы', 1, 1), true, '«длинное оружие» — в средний ряд');

  assert.equal(place(b, 'me', 'Частокол', 0, 3), false, 'постройку нельзя в авангард');
  assert.equal(place(b, 'me', 'Частокол', 1, 3), false, '…нельзя и в средний ряд');
  assert.equal(place(b, 'me', 'Частокол', 2, 3), true, 'только последний ряд (тыл)');

  assert.equal(api.canStandInRow(card('Тяжёлый'), b.me, 0), true);
  assert.equal(api.canStandInRow(card('Тяжёлый'), b.me, 1), false);
  assert.equal(api.canStandInRow(card('Лучник', { keywords: ['ranged'] }), b.me, 2), true);
  assert.equal(api.canStandInRow(card('Башня', { card_type: 'structure' }), b.me, 2), true);
  assert.equal(api.canStandInRow(card('Башня', { card_type: 'structure' }), b.me, 1), false);

  // За пределами стола высадка невозможна.
  assert.equal(api.deploy(b, 'me', 0, 9, 0), false, 'несуществующий ряд');
  assert.equal(api.deploy(b, 'me', 0, 'back', 42), false, 'несуществующий слот');
});

test('ближний бой продвигается вглубь ряд за рядом, а вождя бьёт только при пустом столе', () => {
  const b = battleAt(3, [card('Таран', { atk: 3 })], [card('Первый'), card('Второй'), card('Третий')]);
  place(b, 'me', 'Таран', 0, 1);
  putUnit(b, 'enemy', 'Первый', 0, 1);
  putUnit(b, 'enemy', 'Второй', 1, 2);
  putUnit(b, 'enemy', 'Третий', 2, 1);
  refresh(b);

  let target = api.findTarget(b, unitAt(b, 'me', 0, 1), 'me');
  assert.equal(target.unit.name, 'Первый', 'пока жив авангард врага, задние ряды недоступны');
  assert.equal(target.ri, 0);

  unitAt(b, 'enemy', 0, 1).curHp = 0;
  api.settle(b);
  target = api.findTarget(b, unitAt(b, 'me', 0, 1), 'me');
  assert.equal(target.unit.name, 'Второй', 'авангард выбит — удар уходит во второй ряд');
  assert.equal(target.ri, 1);
  assert.equal(target.i, 2, 'в ряду цель ищется от зеркального слота к ближайшему');

  unitAt(b, 'enemy', 1, 2).curHp = 0;
  api.settle(b);
  target = api.findTarget(b, unitAt(b, 'me', 0, 1), 'me');
  assert.equal(target.unit.name, 'Третий', 'и в третий ряд, когда передние пусты');
  assert.equal(target.ri, 2);

  unitAt(b, 'enemy', 2, 1).curHp = 0;
  api.settle(b);
  assert.equal(api.findTarget(b, unitAt(b, 'me', 0, 1), 'me').kind, 'hero', 'пустой стол — удар вождю');
});

test('осада из пустого авангарда берётся за постройки в последнем ряду', () => {
  const b = battleAt(4, [card('Осадная башня', { atk: 2, keywords: ['siege'] })], [
    card('Стенобитное', { card_type: 'structure', atk: 0, action_cost: 0, hp: 8 }), card('Гвардия'),
  ]);
  place(b, 'me', 'Осадная башня', 0, 0);
  place(b, 'enemy', 'Стенобитное', 'back', 0);
  putUnit(b, 'enemy', 'Гвардия', 2, 3);
  refresh(b);

  const target = api.findTarget(b, unitAt(b, 'me', 0, 0), 'me');
  assert.equal(target.unit.name, 'Стенобитное', 'осада ищет постройки, а не отряды');
  assert.equal(target.ri, api.rowCount(b.enemy) - 1, 'постройка стоит в последнем ряду');

  attackWith(b, 'me', 0, 0);
  assert.equal(unitAt(b, 'enemy', api.rowCount(b.enemy) - 1, 0).curHp, 8 - 4, 'осада бьёт постройку вдвое сильнее');
});

test('стрелки бьют через все пять рядов по самой опасной цели, провокация перехватывает выстрел', () => {
  const b = battleAt(6, [card('Спутник', { atk: 2, keywords: ['ranged'] })], [
    card('Дрон', { atk: 5, hp: 3 }), card('Пехота', { atk: 1 }), card('Провокатор', { atk: 1, keywords: ['taunt'] }),
  ]);
  place(b, 'me', 'Спутник', 'back', 4);
  assert.equal(api.rowCount(b.me), 5, 'стол Будущего: пять рядов');
  putUnit(b, 'enemy', 'Дрон', 4, 2);
  putUnit(b, 'enemy', 'Пехота', 0, 0);
  refresh(b);

  const deep = api.findTarget(b, unitAt(b, 'me', 4, 4), 'me');
  assert.equal(deep.unit.name, 'Дрон', 'самый опасный отряд в последнем ряду врага — законная цель для стрельбы');
  assert.equal(deep.ri, 4);

  // При равной атаке выбирается тот, кто стоит глубже: его труднее достать ближним боем.
  const tie = battleAt(6, [card('Спутник', { atk: 2, keywords: ['ranged'] })], [card('Равный А', { atk: 3 }), card('Равный Б', { atk: 3 })]);
  place(tie, 'me', 'Спутник', 'back', 0);
  putUnit(tie, 'enemy', 'Равный А', 0, 0);
  putUnit(tie, 'enemy', 'Равный Б', 3, 0);
  refresh(tie);
  assert.equal(api.findTarget(tie, unitAt(tie, 'me', 4, 0), 'me').unit.name, 'Равный Б');

  // Провокация в любом ряду перехватывает выстрел.
  putUnit(b, 'enemy', 'Провокатор', 2, 1);
  refresh(b);
  assert.equal(api.findTarget(b, unitAt(b, 'me', 4, 4), 'me').unit.name, 'Провокатор');
});

test('«длинное оружие» из глубины достаёт только врага напротив в авангарде', () => {
  const b = battleAt(3, [card('Копьеносцы', { atk: 2, keywords: ['reach'] })], [card('Первый'), card('Второй')]);
  place(b, 'me', 'Копьеносцы', 2, 1);
  putUnit(b, 'enemy', 'Первый', 0, 1);
  putUnit(b, 'enemy', 'Второй', 1, 1);
  refresh(b);

  const target = api.findTarget(b, unitAt(b, 'me', 2, 1), 'me');
  assert.equal(target.unit.name, 'Первый', 'дотягивается зеркальный слот авангарда');
  assert.equal(target.ri, 0);

  unitAt(b, 'enemy', 0, 1).curHp = 0;
  api.settle(b);
  assert.equal(api.findTarget(b, unitAt(b, 'me', 2, 1), 'me'), null, 'зеркальный слот пуст — удара нет, второй ряд не достаётся');

  // Отряд без дальнего боя и без «длинного оружия» из среднего ряда не бьёт вовсе.
  const stuck = battleAt(3, [card('Тяжёлый')], [card('Первый')]);
  putUnit(stuck, 'me', 'Тяжёлый', 1, 0);
  putUnit(stuck, 'enemy', 'Первый', 0, 0);
  refresh(stuck);
  assert.equal(api.findTarget(stuck, unitAt(stuck, 'me', 1, 0), 'me'), null);
});

test('постройки обстреливают ближайший занятый ряд, а не только авангард', () => {
  const b = battleAt(3, [card('Дозорная вышка', { card_type: 'structure', atk: 2, action_cost: 0, hp: 4 })], [card('Второй ряд')]);
  place(b, 'me', 'Дозорная вышка', 'back', 0);
  putUnit(b, 'enemy', 'Второй ряд', 1, 2);
  const before = unitAt(b, 'enemy', 1, 2).curHp;

  api.beginEnemyTurn(b);
  api.beginPlayerTurn(b);
  assert.equal(unitAt(b, 'enemy', 1, 2).curHp, before - 2, 'авангард врага пуст — обстрел идёт по следующему ряду');
  assert.match(b.log.map((l) => l.text).join(' '), /обстреливает «Второй ряд»/u);
});

test('zone: rear — все ряды за авангардом, zone: front — только авангард', () => {
  const strike = card('Обстрел тылов', {
    card_type: 'spell', drop_cost: 1, action_cost: 0, atk: 0, hp: 0,
    effects: [{ event: 'enter_play', target: { side: 'enemy', entity: 'unit', zone: 'rear', select: 'all' }, action: { type: 'damage', amount: 1 } }],
  });
  const b = battleAt(4, [strike], [card('Авангард'), card('Середина'), card('Тыл')]);
  putUnit(b, 'enemy', 'Авангард', 0, 0);
  putUnit(b, 'enemy', 'Середина', 1, 0);
  putUnit(b, 'enemy', 'Тыл', 'back', 0);

  b.active = 'me';
  b.me.energy = 12;
  const idx = b.me.hand.findIndex((c) => c.name === strike.name);
  assert.equal(api.cast(b, 'me', idx), true);

  assert.equal(unitAt(b, 'enemy', 0, 0).curHp, 5, 'авангард не задет');
  assert.equal(unitAt(b, 'enemy', 1, 0).curHp, 4, 'средний ряд — уже тыл относительно авангарда');
  assert.equal(unitAt(b, 'enemy', 3, 0).curHp, 4, 'последний ряд тоже');

  const front = card('Удар по авангарду', {
    card_type: 'spell', drop_cost: 1, action_cost: 0, atk: 0, hp: 0,
    effects: [{ event: 'enter_play', target: { side: 'enemy', entity: 'unit', zone: 'front', select: 'all' }, action: { type: 'damage', amount: 2 } }],
  });
  const b2 = battleAt(4, [front], [card('Авангард'), card('Тыл')]);
  putUnit(b2, 'enemy', 'Авангард', 0, 0);
  putUnit(b2, 'enemy', 'Тыл', 3, 0);
  b2.active = 'me';
  b2.me.energy = 12;
  assert.equal(api.cast(b2, 'me', b2.me.hand.findIndex((c) => c.name === front.name)), true);
  assert.equal(unitAt(b2, 'enemy', 0, 0).curHp, 3, 'авангард получил урон');
  assert.equal(unitAt(b2, 'enemy', 3, 0).curHp, 5, 'глубина стола не задета');
});

test('соседи, «последний рубеж» и лечение считают ряд по индексу, а не по подписи', () => {
  const b = battleAt(3, [card('Лекарь', { keywords: ['heal:2'], hp: 5 }), card('Раненый', { hp: 5 }), card('Одинокий', { keywords: ['laststand'], atk: 2, hp: 5 }), card('Сосед', { hp: 5 })], [card('Враг')]);
  putUnit(b, 'me', 'Лекарь', 1, 1);
  putUnit(b, 'me', 'Раненый', 1, 2);
  putUnit(b, 'me', 'Одинокий', 2, 0);

  unitAt(b, 'me', 1, 2).curHp = 2;
  const healer = unitAt(b, 'me', 1, 1);
  assert.equal(api.neighborsOf(b, healer).map((u) => u.name).join(','), 'Раненый', 'соседи — только свой ряд');
  b.active = 'me';
  api.startTurn(b, 'me');
  assert.equal(unitAt(b, 'me', 1, 2).curHp, 4, 'лекарь лечит соседа по ряду');

  assert.equal(api.atkOf(b, unitAt(b, 'me', 2, 0)), 3, '«последний рубеж»: +1 атаки, пока отряд один в своём ряду');
  putUnit(b, 'me', 'Сосед', 2, 1);
  assert.equal(api.atkOf(b, unitAt(b, 'me', 2, 0)), 2, 'появился сосед в том же ряду — бонус пропал');
});

/* ---------------- колода растёт вместе со столом ---------------- */

test('лимит колоды растёт по эпохам: в Каменном веке прежние 4 и 6', () => {
  assert.equal(Campaign.DECK_BASE_BY_ERA.length, Campaign.ERAS.length);
  assert.equal(Campaign.DECK_CAP_BY_ERA.length, Campaign.ERAS.length);
  assert.deepEqual(Campaign.deckLimits(0), { base: 4, cap: 6 }, 'Каменный век не изменился');
  assert.deepEqual(Campaign.deckLimits(6), { base: 10, cap: 12 }, 'Будущее — десять карт, потолок двенадцать');
  assert.deepEqual(Campaign.deckLimits(99), Campaign.deckLimits(6), 'эпоха вне шкалы — последняя');
  for (let era = 1; era < Campaign.ERAS.length; era++) {
    assert.ok(Campaign.deckLimits(era).base > Campaign.deckLimits(era - 1).base, `база растёт: эпоха ${era}`);
    assert.ok(Campaign.deckLimits(era).cap >= Campaign.deckLimits(era).base + 2, 'потолок оставляет место улучшениям лагеря');
  }

  const state = Campaign.normalizeState(Campaign.createState(20261006));
  state.player.onboardingComplete = true;
  state.player.era = 0;
  assert.equal(Campaign.getBattleConfig(state).deckLimit, 4);
  assert.equal(Campaign.getBattleConfig(state).deckCap, 6);

  state.player.era = 5;
  const late = Campaign.getBattleConfig(Campaign.normalizeState(state));
  assert.equal(late.deckLimit, 9, 'Новейшее время: девять слотов колоды');
  assert.equal(late.deckCap, 11);
  assert.equal(late.capped.deck_slots, false, 'улучшения лагеря ещё есть куда расти');

  // Потолок эпохи ограничивает и сохранение: колода не может быть длиннее стола по силам.
  state.player.era = 6;
  state.player.deckCardIds = Array.from({ length: 20 }, (_, i) => `card-${i}`);
  const normalized = Campaign.normalizeState(state);
  assert.equal(normalized.player.deckCardIds.length, Campaign.deckLimits(6).cap);

  // Колода племени растёт с эпохой угрозы, а не только с эпохой племени.
  const foe = Campaign.getOpponentBattleConfig(Campaign.normalizeState({ ...normalized, player: { ...normalized.player, era: 6 } }), 'reed');
  assert.equal(foe.deckLimit, Campaign.deckLimits(6).base, 'племя приходит отрядами под размер стола');
  assert.ok(foe.deckLimit <= Campaign.deckLimits(6).cap);
});

test('fillDeck добирает колоду племени повторением состава: контент не растёт, стол растёт', () => {
  const pool = [card('Копейщики'), card('Пращники')];
  assert.equal(api.fillDeck(pool, 0).length, 0);
  assert.equal(api.fillDeck([], 5).length, 0);
  const filled = api.fillDeck(pool, 5);
  assert.equal(filled.length, 5);
  assert.equal(filled.map((c) => c.name).join(','), 'Копейщики,Пращники,Копейщики,Пращники,Копейщики');
  assert.notEqual(filled[0], pool[0], 'копия — отдельный объект');

  const short = api.fillDeck(pool, 2);
  assert.equal(short.length, 2, 'лишнего не добавляет');
});

test('противник умеет играть на любом столе: от одной линии до пяти рядов', () => {
  for (const era of [0, 2, 4, 6]) {
    const mine = [card('Мой отряд', { hp: 8 }), card('Мои стрелки', { keywords: ['ranged'], atk: 3 })];
    const theirs = [
      card('Копейщики племени'), card('Пращники племени', { keywords: ['ranged'] }),
      card('Засадные племени', { keywords: ['skirmish'] }), card('Длинные копья', { keywords: ['reach'] }),
      card('Частокол племени', { card_type: 'structure', atk: 0, action_cost: 0, hp: 6 }),
    ];
    const b = battleAt(era, mine, theirs, { energyGrowth: 4 });
    let steps = 0;
    while (!b.over && steps < 120) {
      b.active = 'enemy';
      b.enemy.energy = b.enemy.energyMax;
      while (api.enemyAct(b)) steps += 1;
      api.beginPlayerTurn(b);
      for (const s of api.unitsOf(b, 'me')) s.unit.exhausted = false;
      b.active = 'me';
      b.me.energy = b.me.energyMax;
      for (const s of api.unitsOf(b, 'me')) if (api.canAct(b, 'me', s.unit)) api.attackWith(b, 'me', s.unit.iid);
      api.endPlayerTurn(b);
      steps += 1;
    }
    assert.ok(steps < 120, `бой эпохи ${era} завершился за ${steps} шагов`);
    const enemyRows = api.rowsOf(b.enemy);
    const deployed = enemyRows.flatMap((row, ri) => row.filter(Boolean).map((u) => ({ u, ri })));
    assert.ok(deployed.length > 0, `племя эпохи ${era} что-то выставило`);
    for (const { u, ri } of deployed) {
      if (u.isStructure) assert.equal(ri, enemyRows.length - 1, 'постройка племени — в последнем ряду');
      const ranged = (u.keywords || []).some((k) => k === 'ranged' || k === 'skirmish' || k === 'reach');
      if (!ranged && !u.isStructure && enemyRows.length > 1) assert.equal(ri, 0, 'ближний бой племени — в авангарде');
    }
  }
});

/* ---------------- интерфейс ---------------- */

test('экран боя рисует столько рядов, сколько дала эпоха', () => {
  const view = fs.readFileSync(path.join(root, 'src', 'pages', 'Battle.tsx'), 'utf8');
  assert.match(view, /rowsOf\(b\[side\]\)/u, 'ряды берутся из движка, а не из двух констант');
  assert.match(view, /gridTemplateColumns: `repeat\(\$\{rows\[ri\]\.length\}, minmax\(0, 1fr\)\)`/u, 'число столбцов динамическое');
  assert.match(view, /rowName\(b\[side\], ri\)/u, 'каждый ряд подписан');
  assert.match(view, /canStandInRow\(selCard, b\.me, ri\)/u, 'слот подсвечивается только для законного ряда');
  assert.match(view, /boardLabel\(b\.shape\)/u, 'размер стола виден в бою');
  assert.match(view, /fillDeck\(/u, 'колода племени добирается до лимита эпохи');
  assert.doesNotMatch(view, /grid-cols-4/u, 'жёсткой сетки на четыре столбца больше нет');

  const camp = fs.readFileSync(path.join(root, 'src', 'pages', 'Camp.tsx'), 'utf8');
  assert.match(camp, /boardLabel\(boardShape\(oc\.threatEra\)\)/u, 'в лагере видно, каким будет стол');
  assert.match(camp, /cfg\.deckCap/u, 'потолок слотов колоды — по эпохе');

  const store = fs.readFileSync(path.join(root, 'src', 'game', 'store.tsx'), 'utf8');
  assert.match(store, /threatEra: M\.getOpponentBattleConfig\(g, o\.id\)\.threatEra/u, 'бой получает эпоху угрозы');

  const system = fs.readFileSync(path.join(root, 'src', 'game', 'cards.ts'), 'utf8');
  assert.match(system, /от одной линии в три клетки в Каменном веке до пяти рядов по пять в Будущем/u, 'кузнец знает про рост стола');
  assert.match(system, /zone rear — все ряды за ним/u);
});
