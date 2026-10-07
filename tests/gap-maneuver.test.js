const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

const root = path.join(__dirname, '..');

/**
 * Смысл ширины стола: столбец, в котором у стороны не осталось живых отрядов, — брешь, и удар
 * ближнего боя из неё проходит вождю. Это правило по умолчанию для обеих сторон и всех эпох, а не
 * особое ключевое слово. Манёвр (шаг на соседнюю клетку за энергию) существует, чтобы бреши
 * находить и закрывать: он двигает отряд по своей половине, не истощая его.
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

/** Бой на столе нужной эпохи: threatEra задаёт форму стола (ряды — глубина, столбцы — ширина). */
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

function unitAt(b, side, row, slot) {
  const u = api.rowsOf(b[side])[row][slot];
  assert.ok(u, `в ${side}[${row}][${slot}] должен стоять отряд`);
  return u;
}

function refresh(b) {
  for (const side of ['me', 'enemy']) for (const s of api.unitsOf(b, side)) s.unit.exhausted = false;
}

/** Список клеток в виде «ряд:столбец» — сравниваем строкой, объекты пришли из другой песочницы. */
const cells = (list) => list.map((t) => `${t.ri}:${t.i}`).join(',');

const wall = card('Частокол', { card_type: 'structure', atk: 0, hp: 12, action_cost: 0 });
const foot = (atk = 3) => card('Пеший', { atk, hp: 8, action_cost: 1 });

test('брешь в столбце открывает вождя, даже когда чужой строй стоит рядом', () => {
  const b = battleAt(3, [foot(4)], [foot(), foot(), foot()]);
  assert.equal(b.shape.rows, 3, 'стол Ренессанса: три ряда');
  assert.equal(b.shape.slots, 4, 'и четыре столбца');

  putUnit(b, 'enemy', 'Пеший', 0, 0);
  putUnit(b, 'enemy', 'Пеший', 1, 2);
  putUnit(b, 'enemy', 'Пеший', 2, 3);
  const mine = putUnit(b, 'me', 'Пеший', 0, 1);
  refresh(b);

  assert.equal(api.hasGapAt(b, 'enemy', 1), true, 'в столбце игрока у врага никого');
  assert.equal(api.hasGapAt(b, 'enemy', 0), false, 'соседний столбец держит авангард');
  const target = api.findTarget(b, mine, 'me');
  assert.equal(target.kind, 'hero', 'удар идёт вождю через пустой столбец');

  const before = b.enemy.hp;
  b.active = 'me';
  b.me.energy = 6;
  assert.equal(api.attackWith(b, 'me', mine.iid), true);
  assert.ok(b.enemy.hp < before, 'вождь получил урон');
});

test('провокация перехватывает удар и через брешь', () => {
  const b = battleAt(3, [foot(4)], [foot(), card('Страж', { keywords: ['taunt'], atk: 2, hp: 9 })]);
  putUnit(b, 'enemy', 'Страж', 0, 0);
  const mine = putUnit(b, 'me', 'Пеший', 0, 2);
  refresh(b);
  assert.equal(api.hasGapAt(b, 'enemy', 2), true, 'столбец игрока пуст');
  const target = api.findTarget(b, mine, 'me');
  assert.equal(target.kind, 'unit', 'провокация важнее бреши');
  assert.equal(target.unit.name, 'Страж');
});

test('постройка строй не держит: брешь остаётся, но осада бьёт по ней', () => {
  function setup(myCard) {
    const b = battleAt(3, [myCard], [wall, foot(), foot()]);
    putUnit(b, 'enemy', 'Пеший', 0, 0);
    putUnit(b, 'enemy', 'Пеший', 0, 2);
    putUnit(b, 'enemy', 'Частокол', 2, 1);
    return b;
  }

  const plain = setup(foot(4));
  const plainUnit = putUnit(plain, 'me', 'Пеший', 0, 1);
  refresh(plain);
  assert.equal(api.hasGapAt(plain, 'enemy', 1), true, 'постройка не считается строем');
  assert.equal(api.findTarget(plain, plainUnit, 'me').kind, 'hero', 'обычный отряд проходит мимо частокола к вождю');

  const ram = setup(card('Таран', { atk: 5, hp: 8, keywords: ['siege'], action_cost: 1 }));
  const ramUnit = putUnit(ram, 'me', 'Таран', 0, 1);
  refresh(ram);
  const target = api.findTarget(ram, ramUnit, 'me');
  assert.equal(target.kind, 'unit', 'осадное орудие не шагает мимо постройки');
  assert.equal(target.unit.isStructure, true);
});

test('постройка, прикрытая отрядом своего столбца, недоступна даже осаде', () => {
  const b = battleAt(3, [card('Таран', { atk: 5, hp: 8, keywords: ['siege'], action_cost: 1 })], [wall, foot()]);
  putUnit(b, 'enemy', 'Частокол', 2, 1);
  putUnit(b, 'enemy', 'Пеший', 0, 1);
  const ramUnit = putUnit(b, 'me', 'Таран', 0, 1);
  refresh(b);
  assert.equal(api.hasGapAt(b, 'enemy', 1), false, 'столбец держит живой отряд');
  const target = api.findTarget(b, ramUnit, 'me');
  assert.equal(target.kind, 'unit');
  assert.equal(target.unit.isStructure, false, 'сначала тот, кто стоит ближе');
});

test('gapsOf перечисляет столбцы без живых отрядов на столе любой ширины', () => {
  const b = battleAt(6, [foot()], [foot(), foot()]);
  assert.equal(b.shape.slots, 5, 'стол Будущего: пять столбцов');
  assert.equal(api.gapsOf(b, 'enemy').join(','), '0,1,2,3,4', 'пустое поле — все столбцы открыты');
  putUnit(b, 'enemy', 'Пеший', 0, 1);
  putUnit(b, 'enemy', 'Пеший', 3, 3);
  assert.equal(api.gapsOf(b, 'enemy').join(','), '0,2,4');
  putUnit(b, 'me', 'Пеший', 2, 2);
  assert.equal(api.gapsOf(b, 'me').join(','), '0,1,3,4', 'тот же счёт и для своей половины');
});

test('противник закрывает брешь, из которой ему грозит удар вождю', () => {
  const b = battleAt(3, [foot(4)], [foot(), wall]);
  putUnit(b, 'me', 'Пеший', 0, 2);
  putUnit(b, 'enemy', 'Частокол', 2, 0);
  refresh(b);
  assert.equal(api.gapsOf(b, 'enemy').includes(2), true, 'столбец игрока открыт');

  b.active = 'enemy';
  b.enemy.energy = 8;
  b.enemy.hand = [card('Всадник', { atk: 3, hp: 6, drop_cost: 2 })];
  assert.equal(api.enemyAct(b), true, 'противник сделал ход');
  const placed = api.unitsOf(b, 'enemy').find((s) => !s.unit.isStructure && s.i === 2);
  assert.ok(placed, 'новый отряд встал в угрожаемый столбец, а не куда попало');
});

test('перестроение: шаг на соседнюю клетку за энергию, один раз за ход', () => {
  const b = battleAt(2, [foot(), card('Лучники', { atk: 2, hp: 5, keywords: ['ranged'] }), wall], [foot()]);
  const mine = putUnit(b, 'me', 'Пеший', 0, 0);
  refresh(b);
  b.active = 'me';
  b.me.energy = 3;

  assert.equal(api.MOVE_COST, 1, 'манёвр стоит одну энергию');
  assert.equal(cells(api.moveTargets(b, 'me', mine)), '0:1', 'ближнему бою доступен только свой ряд');
  assert.equal(api.moveUnit(b, 'me', mine.iid, 1, 0), false, 'вглубь без дальнего боя нельзя');
  assert.equal(api.moveUnit(b, 'me', mine.iid, 0, 2), false, 'через клетку — не шаг');
  assert.equal(unitAt(b, 'me', 0, 0), mine, 'отряд остался на месте');

  assert.equal(api.moveUnit(b, 'me', mine.iid, 0, 1), true);
  assert.equal(unitAt(b, 'me', 0, 1), mine, 'отряд перешёл в соседний столбец');
  assert.equal(api.rowsOf(b.me)[0][0], null, 'старая клетка пуста');
  assert.equal(b.me.energy, 2, 'энергия потрачена');
  assert.equal(mine.exhausted, false, 'манёвр не истощает отряд');
  assert.equal(mine.movedThisTurn, true);
  assert.equal(cells(api.moveTargets(b, 'me', mine)), '', 'один манёвр за ход');
  assert.equal(api.moveUnit(b, 'me', mine.iid, 0, 2), false, 'второй шаг запрещён');
  assert.ok(b.log.some((l) => /перестраивается/u.test(l.text)), 'ход записан в журнал');

  b.active = 'enemy';
  assert.equal(cells(api.moveTargets(b, 'me', mine)), '', 'в чужой ход перестраиваться нельзя');
  assert.equal(api.moveUnit(b, 'me', mine.iid, 0, 0), false);
  b.active = 'me';

  b.me.energy = 0;
  const archers = putUnit(b, 'me', 'Лучники', 0, 3);
  refresh(b);
  b.me.energy = 0;
  assert.equal(cells(api.moveTargets(b, 'me', archers)), '', 'без энергии манёвра нет');
  assert.equal(api.moveUnit(b, 'me', archers.iid, 0, 2), false);

  api.startTurn(b, 'me');
  b.active = 'me';
  assert.equal(archers.movedThisTurn, false, 'к своему ходу манёвр снова доступен');
  assert.ok(cells(api.moveTargets(b, 'me', archers)).length > 0, 'стрелку открыты и ряд, и глубина');

  const fort = putUnit(b, 'me', 'Частокол', 1, 0);
  assert.equal(cells(api.moveTargets(b, 'me', fort)), '', 'постройки не двигаются');
  assert.equal(api.moveUnit(b, 'me', fort.iid, 1, 1), false);
});

test('манёвр находит брешь: шаг в пустой столбец и удар вождю в тот же ход', () => {
  const b = battleAt(2, [foot(4), foot(4)], [foot(), foot()]);
  putUnit(b, 'enemy', 'Пеший', 0, 0);
  putUnit(b, 'enemy', 'Пеший', 0, 2);
  const mine = putUnit(b, 'me', 'Пеший', 0, 0);
  refresh(b);
  b.active = 'me';
  b.me.energy = 6;

  assert.equal(api.findTarget(b, mine, 'me').kind, 'unit', 'в занятом столбце удар встречает строй');
  assert.equal(api.moveUnit(b, 'me', mine.iid, 0, 1), true, 'шаг в пустой столбец');
  assert.equal(api.findTarget(b, mine, 'me').kind, 'hero', 'теперь перед отрядом брешь');
  assert.equal(api.attackWith(b, 'me', mine.iid), true, 'перестроение и удар в один ход');
  assert.ok(b.enemy.hp < 30, 'вождь получил урон');
});

test('манёвр закрывает свою брешь: враг больше не проходит к вождю', () => {
  const b = battleAt(2, [foot(), foot()], [foot()]);
  const his = putUnit(b, 'enemy', 'Пеший', 0, 1);
  const mine = putUnit(b, 'me', 'Пеший', 0, 0);
  refresh(b);

  b.active = 'enemy';
  b.enemy.energy = 6;
  assert.equal(api.findTarget(b, his, 'enemy').kind, 'hero', 'враг видит мой пустой столбец');

  b.active = 'me';
  b.me.energy = 6;
  assert.equal(api.moveUnit(b, 'me', mine.iid, 0, 1), true, 'отряд встал в свой столбец');

  b.active = 'enemy';
  const target = api.findTarget(b, his, 'enemy');
  assert.equal(target.kind, 'unit', 'брешь закрыта');
  assert.equal(api.attackWith(b, 'enemy', his.iid), true);
  assert.equal(b.me.hp, 30, 'вождь цел');
  assert.ok(mine.curHp < mine.hp, 'урон принял отряд');
});
