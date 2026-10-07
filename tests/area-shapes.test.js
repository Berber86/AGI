const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const Campaign = require('../campaign.js');

const root = path.join(__dirname, '..');

/**
 * Площадь — ответ на плотный строй, и у неё ровно три формы, по осям стола: «Фугас» (крест: соседи
 * цели в её ряду и отряд прямо за ней), «Картечь» (весь ряд цели) и «Обстрел столбца» (весь столбец
 * цели во всех рядах). Все три считаются от основной цели, дополнительных целей не больше трёх,
 * ответных ударов площадь не вызывает, а тяжёлый удар (N = 2) задевает и свой отряд напротив —
 * линия огня проходит через весь столбец, а не только по чужой половине. Отвечают на площадь
 * «Рассредоточение» (−1 к площадному урону) и «Окоп» (в авангарде не получает «Картечь» и
 * «Обстрел столбца»). Ряд остаётся защитой от ближнего боя, но перестаёт быть бесплатным.
 */
function transpile(relativePath) {
  const file = path.join(root, relativePath);
  return ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
    fileName: file,
  }).outputText;
}

function runInVm(relativePath, javascript, sandboxExtra) {
  const mod = { exports: {} };
  const sandbox = {
    module: mod, exports: mod.exports, console, setTimeout, clearTimeout, Date, Math, JSON, Object, Array, String, Number, Promise,
    ...sandboxExtra,
  };
  vm.runInNewContext(javascript, sandbox, { filename: relativePath, timeout: 5000 });
  return mod.exports;
}

/** Настоящие карты и настоящий движок: движку отдаём модуль карт, а не заглушку. */
function loadBoth() {
  let ids = 0;
  const cards = runInVm('src/game/cards.ts', transpile('src/game/cards.ts'), {
    fetch: async () => ({ ok: true, status: 200, json: async () => ({ choices: [] }) }),
    require(name) {
      if (name === './model') {
        return {
          M: {
            ERA_HISTORICAL: Campaign.ERA_HISTORICAL,
            HISTORICAL_CULTURES: Campaign.HISTORICAL_CULTURES,
            SEED_CHOICES: Campaign.SEED_CHOICES,
            STARTER_CARDS: Campaign.STARTER_CARDS,
            eraName: Campaign.eraName,
            allowedCardEras: Campaign.allowedCardEras,
            combatPerks: Campaign.combatPerks,
            describePerks: Campaign.describePerks,
          },
        };
      }
      throw new Error(`Неожиданный импорт ${name}`);
    },
  });
  const battle = runInVm('src/game/battle.ts', transpile('src/game/battle.ts'), {
    require(name) {
      if (name === './cards') return cards;
      throw new Error(`Неожиданный импорт ${name}`);
    },
    uid: () => `u${++ids}`,
  });
  return { cards, battle };
}

const { cards: C, battle: api } = loadBoth();

function card(name, options = {}) {
  return {
    id: name.toLowerCase().replaceAll(' ', '-'), name, card_type: 'unit', era: 'ancient', emoji: '💥',
    drop_cost: 1, action_cost: 1, hp: 5, atk: 2, description: 'Тестовая карта.',
    tags: [], abilities: [], keywords: [], effects: [], monkey_paw: '', ...options,
  };
}

const CFG = { hp: 30, energyMax: 12, energyGrowth: 2, fatigueDelay: 0, atkBonus: 0 };

function battleAt(threatEra, myCards, enemyCards, cfg = {}) {
  const config = { ...CFG, ...cfg };
  const match = { kind: 'practice', opponentId: 'reed', name: 'Илмар', clan: 'Речной Союз', era: 0, threatEra, leaderBattle: false, tutorial: false };
  return api.createBattle(myCards, config, enemyCards, { ...config }, match);
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

/** n одинаковых по смыслу, но разных по имени карт: putUnit ищет карту в руке по имени. */
const squad = (n, prefix = 'Враг', options = {}) => Array.from({ length: n }, (_, k) => card(`${prefix} ${k + 1}`, { atk: 2, hp: 9, ...options }));

/** Расставляет отряды по клеткам, беря из руки карты по порядку. */
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

/** Клетки площади в виде «сторона ряд:столбец» — объекты пришли из другой песочницы, сравниваем строкой. */
const cells = (hits) => hits.map((h) => `${h.own ? 'свой' : 'чужой'} ${h.ri}:${h.i}`).join(' ');

const wall = (name = 'Частокол') => card(name, { card_type: 'structure', atk: 0, hp: 14, action_cost: 0 });

test('«Фугас» накрывает крест: соседей цели в её ряду и отряд прямо за ней', () => {
  const b = battleAt(3, [card('Мортира', { atk: 4, hp: 8, keywords: ['blast:1'] })], [
    card('Враг 1', { atk: 5, hp: 9 }), card('Враг 2', { atk: 3, hp: 9 }),
    card('Враг 3', { atk: 5, hp: 9 }), card('Враг 4', { atk: 5, hp: 9 }),
  ]);
  deployAt(b, 'enemy', [[0, 0], [0, 1], [0, 2], [1, 1]]);
  const gun = putUnit(b, 'me', 'Мортира', 0, 1);
  refresh(b);
  b.active = 'me';
  b.me.energy = 8;

  const target = api.findTarget(b, gun, 'me');
  assert.equal(target.unit.name, 'Враг 2', 'основная цель — отряд напротив');
  assert.equal(cells(api.splashTargets(b, 'me', gun, target)), 'чужой 0:0 чужой 0:2 чужой 1:1', 'крест вокруг цели');

  const attackerHp = gun.curHp;
  assert.equal(api.attackWith(b, 'me', gun.iid), true);
  assert.equal(unitAt(b, 'enemy', 0, 1).curHp, 9 - 4, 'основная цель получает полный урон атаки');
  assert.equal(unitAt(b, 'enemy', 0, 0).curHp, 9 - 1, 'сосед в ряду накрыт на N');
  assert.equal(unitAt(b, 'enemy', 0, 2).curHp, 9 - 1);
  assert.equal(unitAt(b, 'enemy', 1, 1).curHp, 9 - 1, 'отряд прямо за целью тоже накрыт');
  assert.equal(gun.curHp, attackerHp - 3, 'ответный удар даёт только основная цель: накрытые отряды не отвечают');
  assert.ok(b.log.some((l) => /Фугас накрывает/u.test(l.text)), 'площадь записана в журнал');
});

test('«Картечь» бьёт весь ряд цели и не трогает глубину', () => {
  const b = battleAt(3, [card('Картечь', { atk: 3, hp: 8, keywords: ['sweep:1'] })], squad(4));
  // В руке четыре карты, а пятый отряд нужен в глубине: добираем его в руку вручную и ставим первым —
  // перенос идёт через свободную клетку авангарда, а он сейчас ещё не занят.
  b.enemy.hand.push(card('Глубина', { hp: 9 }));
  const deep = putUnit(b, 'enemy', 'Глубина', 1, 1);
  deployAt(b, 'enemy', [[0, 0], [0, 1], [0, 2], [0, 3]]);
  const gun = putUnit(b, 'me', 'Картечь', 0, 2);
  refresh(b);
  b.active = 'me';
  b.me.energy = 8;

  const target = api.findTarget(b, gun, 'me');
  const hits = api.splashTargets(b, 'me', gun, target);
  assert.equal(hits.length, 3, 'потолок площади — три дополнительные цели');
  assert.equal(cells(hits), 'чужой 0:1 чужой 0:3 чужой 0:0', 'ближайшие в ряду цели первыми');

  assert.equal(api.attackWith(b, 'me', gun.iid), true);
  assert.equal(unitAt(b, 'enemy', 0, 0).curHp, 8);
  assert.equal(unitAt(b, 'enemy', 0, 1).curHp, 8);
  assert.equal(unitAt(b, 'enemy', 0, 3).curHp, 8);
  assert.equal(deep.curHp, 9, 'картечь не пробивает в глубину: второй ряд цел');
});

test('«Обстрел столбца» проходит все ряды столбца и достаёт постройку в тылу', () => {
  const b = battleAt(3, [card('Миномёт', { atk: 3, hp: 8, keywords: ['column:1'] })],
    [card('Враг 1', { hp: 9 }), card('Враг 2', { hp: 9 }), card('Враг 3', { hp: 9 }), wall()]);
  deployAt(b, 'enemy', [[0, 1], [1, 1], [0, 0]]);
  const fort = putUnit(b, 'enemy', 'Частокол', 2, 1);
  const gun = putUnit(b, 'me', 'Миномёт', 0, 1);
  refresh(b);
  b.active = 'me';
  b.me.energy = 8;

  const target = api.findTarget(b, gun, 'me');
  assert.equal(target.unit.name, 'Враг 1');
  assert.equal(cells(api.splashTargets(b, 'me', gun, target)), 'чужой 1:1 чужой 2:1', 'полоса вдоль столбца');

  assert.equal(api.attackWith(b, 'me', gun.iid), true);
  assert.equal(unitAt(b, 'enemy', 1, 1).curHp, 8, 'средний ряд того же столбца накрыт');
  assert.equal(fort.curHp, 13, 'навесной огонь достаёт постройку в последнем ряду');
  assert.equal(unitAt(b, 'enemy', 0, 0).curHp, 9, 'соседний столбец не задет');
});

test('тяжёлый удар (N = 2) задевает свой отряд в полосе огня, а лёгкий (N = 1) — нет', () => {
  function setup(keyword) {
    const b = battleAt(2, [
      card('Стрелки', { atk: 3, hp: 8, keywords: ['ranged', keyword] }),
      card('Прикрытие', { atk: 2, hp: 8 }),
    ], [card('Гроза', { atk: 6, hp: 9 }), card('Враг 2', { atk: 1, hp: 9 })]);
    putUnit(b, 'enemy', 'Враг 2', 0, 0);
    putUnit(b, 'enemy', 'Гроза', 0, 2);
    const gun = putUnit(b, 'me', 'Стрелки', 1, 3);
    const own = putUnit(b, 'me', 'Прикрытие', 0, 2);
    refresh(b);
    b.active = 'me';
    b.me.energy = 8;
    return { b, gun, own };
  }

  const light = setup('blast:1');
  const lightTarget = api.findTarget(light.b, light.gun, 'me');
  assert.equal(lightTarget.unit.name, 'Гроза', 'стрелки из тыла бьют самого опасного');
  assert.equal(cells(api.splashTargets(light.b, 'me', light.gun, lightTarget)), '', 'вокруг цели никого, а своих N = 1 не задевает');
  assert.equal(api.attackWith(light.b, 'me', light.gun.iid), true);
  assert.equal(light.own.curHp, 8, 'лёгкая площадь безопасна для своих');

  const heavy = setup('blast:2');
  const heavyTarget = api.findTarget(heavy.b, heavy.gun, 'me');
  assert.equal(cells(api.splashTargets(heavy.b, 'me', heavy.gun, heavyTarget)), 'свой 0:2', 'полоса огня проходит через столбец собственного прикрытия');
  assert.equal(api.attackWith(heavy.b, 'me', heavy.gun.iid), true);
  assert.equal(heavy.own.curHp, 7, 'свои получают фиксированный 1 урон, а не N');
  assert.ok(heavy.b.log.some((l) => /задевает свой отряд/u.test(l.text)), 'и это видно в журнале');
});

test('тяжёлый обстрел столбца накрывает свой отряд напротив, а окоп его спасает', () => {
  function setup(ownKeywords) {
    const b = battleAt(2, [
      card('Мортира', { atk: 3, hp: 8, keywords: ['ranged', 'column:2'] }),
      card('Прикрытие', { atk: 2, hp: 8, keywords: ownKeywords }),
    ], [card('Враг 1', { atk: 1, hp: 9 }), card('Гроза', { atk: 6, hp: 9 })]);
    putUnit(b, 'enemy', 'Враг 1', 0, 0);
    putUnit(b, 'enemy', 'Гроза', 0, 1);
    const gun = putUnit(b, 'me', 'Мортира', 0, 0);
    const own = putUnit(b, 'me', 'Прикрытие', 0, 1);
    refresh(b);
    b.active = 'me';
    b.me.energy = 8;
    return { b, gun, own };
  }

  const open = setup([]);
  const target = api.findTarget(open.b, open.gun, 'me');
  assert.equal(target.unit.name, 'Гроза', 'стрелки бьют самого опасного — в столбце 2');
  assert.equal(target.i, 1, 'цель в столбце 2');
  assert.equal(cells(api.splashTargets(open.b, 'me', open.gun, target)), 'свой 0:1', 'в чужом столбце больше никого, зато свой отряд напротив — в полосе');
  assert.equal(api.attackWith(open.b, 'me', open.gun.iid), true);
  assert.equal(open.own.curHp, 7, 'свой отряд получил 1 урон от тяжёлого удара');
  assert.equal(unitAt(open.b, 'enemy', 0, 1).curHp, 6, 'основная цель получила полный урон атаки');

  const dug = setup(['entrenched']);
  const dugTarget = api.findTarget(dug.b, dug.gun, 'me');
  assert.equal(cells(api.splashTargets(dug.b, 'me', dug.gun, dugTarget)), '', 'окопавшийся отряд в авангарде полоса не берёт');
  assert.equal(api.attackWith(dug.b, 'me', dug.gun.iid), true);
  assert.equal(dug.own.curHp, 8, 'свой окоп спасён от своего же обстрела');
});

test('«Рассредоточение» гасит площадной урон, но не прямой удар', () => {
  const b = battleAt(2, [card('Картечь', { atk: 4, hp: 8, keywords: ['sweep:2'] })],
    [card('Цель', { hp: 9 }), card('Рассыпной', { hp: 9, keywords: ['dispersed'] })]);
  putUnit(b, 'enemy', 'Цель', 0, 0);
  const loose = putUnit(b, 'enemy', 'Рассыпной', 0, 1);
  const gun = putUnit(b, 'me', 'Картечь', 0, 0);
  refresh(b);
  b.active = 'me';
  b.me.energy = 8;

  assert.equal(api.attackWith(b, 'me', gun.iid), true);
  assert.equal(unitAt(b, 'enemy', 0, 0).curHp, 5, 'основная цель получает полный урон: рассредоточение её не касается');
  assert.equal(loose.curHp, 8, 'площадной урон 2 уменьшен до 1');
});

test('«Окоп» в авангарде спасает от картечи и обстрела столбца, но не от фугаса', () => {
  // Картечь: цель в столбце 2, окопавшийся сосед в столбце 1 того же ряда.
  const sweepBattle = battleAt(2, [card('Орудие', { atk: 3, hp: 8, keywords: ['sweep:1'] })],
    [card('Цель', { hp: 9 }), card('Окоп', { hp: 9, keywords: ['entrenched'] })]);
  putUnit(sweepBattle, 'enemy', 'Цель', 0, 1);
  const dugSweep = putUnit(sweepBattle, 'enemy', 'Окоп', 0, 0);
  const sweepGun = putUnit(sweepBattle, 'me', 'Орудие', 0, 1);
  refresh(sweepBattle);
  sweepBattle.active = 'me';
  sweepBattle.me.energy = 8;
  const sweepTarget = api.findTarget(sweepBattle, sweepGun, 'me');
  assert.equal(cells(api.splashTargets(sweepBattle, 'me', sweepGun, sweepTarget)), '', 'картечь не берёт окоп в авангарде');
  assert.equal(api.attackWith(sweepBattle, 'me', sweepGun.iid), true);
  assert.equal(dugSweep.curHp, 9, 'урон не прошёл');

  // Обстрел столбца: стрелки из тыла бьют глубокого врага, а в авангарде того же столбца — окоп.
  const columnBattle = battleAt(3, [card('Миномёт', { atk: 3, hp: 8, keywords: ['ranged', 'column:1'] })],
    [card('Окоп', { hp: 9, atk: 1, keywords: ['entrenched'] }), card('Тыл', { hp: 9, atk: 5 })]);
  putUnit(columnBattle, 'enemy', 'Окоп', 0, 1);
  const dugColumn = putUnit(columnBattle, 'enemy', 'Тыл', 1, 1);
  const columnGun = putUnit(columnBattle, 'me', 'Миномёт', 2, 1);
  refresh(columnBattle);
  columnBattle.active = 'me';
  columnBattle.me.energy = 8;
  const columnTarget = api.findTarget(columnBattle, columnGun, 'me');
  assert.equal(columnTarget.unit, dugColumn, 'стрелки бьют самого опасного в глубине');
  const columnHits = api.splashTargets(columnBattle, 'me', columnGun, columnTarget);
  assert.equal(cells(columnHits), '', 'окоп в авангарде того же столбца полоса не берёт');
  assert.equal(api.attackWith(columnBattle, 'me', columnGun.iid), true);
  assert.equal(unitAt(columnBattle, 'enemy', 0, 1).curHp, 9, 'окопавшийся авангард цел');
  assert.equal(dugColumn.curHp, 6, 'а основная цель получила урон как обычно');

  // Фугас: разрыв рядом укрытие пробивает.
  const blastBattle = battleAt(2, [card('Орудие', { atk: 3, hp: 8, keywords: ['blast:1'] })],
    [card('Цель', { hp: 9 }), card('Окоп', { hp: 9, keywords: ['entrenched'] })]);
  putUnit(blastBattle, 'enemy', 'Цель', 0, 1);
  const dugBlast = putUnit(blastBattle, 'enemy', 'Окоп', 0, 0);
  const blastGun = putUnit(blastBattle, 'me', 'Орудие', 0, 1);
  refresh(blastBattle);
  blastBattle.active = 'me';
  blastBattle.me.energy = 8;
  const blastTarget = api.findTarget(blastBattle, blastGun, 'me');
  assert.equal(cells(api.splashTargets(blastBattle, 'me', blastGun, blastTarget)), 'чужой 0:0', 'фугас накрывает окопавшегося соседа');
  assert.equal(api.attackWith(blastBattle, 'me', blastGun.iid), true);
  assert.equal(dugBlast.curHp, 8, 'укрытие не спасло от разрыва рядом');
});

test('окоп вне авангарда не спасает: полоса накрывает отряд в глубине столбца', () => {
  const b = battleAt(3, [card('Миномёт', { atk: 4, hp: 8, keywords: ['column:1'] })],
    [card('Цель', { hp: 9 }), card('Окоп', { hp: 9, keywords: ['entrenched'] })]);
  putUnit(b, 'enemy', 'Цель', 0, 1);
  const dug = putUnit(b, 'enemy', 'Окоп', 1, 1);
  const gun = putUnit(b, 'me', 'Миномёт', 0, 1);
  refresh(b);
  b.active = 'me';
  b.me.energy = 8;
  const target = api.findTarget(b, gun, 'me');
  assert.equal(cells(api.splashTargets(b, 'me', gun, target)), 'чужой 1:1', 'в среднем ряду окоп не работает');
  assert.equal(api.attackWith(b, 'me', gun.iid), true);
  assert.equal(dug.curHp, 8);
});

test('провокация выбирает основную цель, и площадь летит туда же', () => {
  const b = battleAt(2, [card('Картечь', { atk: 3, hp: 8, keywords: ['sweep:1'] })],
    [card('Враг 1', { hp: 9 }), card('Страж', { hp: 9, keywords: ['taunt'] }), card('Враг 3', { hp: 9 })]);
  putUnit(b, 'enemy', 'Враг 1', 0, 0);
  putUnit(b, 'enemy', 'Страж', 0, 2);
  const flank = putUnit(b, 'enemy', 'Враг 3', 0, 3);
  const gun = putUnit(b, 'me', 'Картечь', 0, 0);
  refresh(b);
  b.active = 'me';
  b.me.energy = 8;

  const target = api.findTarget(b, gun, 'me');
  assert.equal(target.unit.name, 'Страж', 'провокация перехватывает удар');
  assert.equal(cells(api.splashTargets(b, 'me', gun, target)), 'чужой 0:3 чужой 0:0', 'площадь считается от перехваченной цели, а не от столбца атакующего');
  assert.equal(api.attackWith(b, 'me', gun.iid), true);
  assert.equal(flank.curHp, 8, 'ряд цели накрыт');
  assert.equal(unitAt(b, 'enemy', 0, 0).curHp, 8);
});

test('по вождю площади нет: у удара через брешь нет точки на поле', () => {
  const b = battleAt(2, [card('Картечь', { atk: 4, hp: 8, keywords: ['sweep:2'] })], [card('Враг 1', { hp: 9 })]);
  const bystander = putUnit(b, 'enemy', 'Враг 1', 0, 0);
  const gun = putUnit(b, 'me', 'Картечь', 0, 2);
  refresh(b);
  b.active = 'me';
  b.me.energy = 8;

  const target = api.findTarget(b, gun, 'me');
  assert.equal(target.kind, 'hero', 'в столбце атакующего у врага никого');
  assert.equal(cells(api.splashTargets(b, 'me', gun, target)), '', 'целей для площади нет');
  const heroBefore = b.enemy.hp;
  assert.equal(api.attackWith(b, 'me', gun.iid), true);
  assert.equal(heroBefore - b.enemy.hp, 4, 'вождь получил только обычный урон атаки');
  assert.equal(bystander.curHp, 9, 'чужой отряд в другом столбце не задет');
});

test('на столе в одну линию обстрелу столбца некого накрывать', () => {
  const b = battleAt(0, [card('Миномёт', { atk: 3, hp: 8, keywords: ['column:1'] })], [card('Враг 1', { hp: 9 }), card('Враг 2', { hp: 9 })]);
  deployAt(b, 'enemy', [[0, 0], [0, 1]]);
  const gun = putUnit(b, 'me', 'Миномёт', 0, 0);
  refresh(b);
  b.active = 'me';
  b.me.energy = 8;
  const target = api.findTarget(b, gun, 'me');
  assert.equal(cells(api.splashTargets(b, 'me', gun, target)), '', 'в одной линии столбец — одна клетка');
  assert.equal(api.attackWith(b, 'me', gun.iid), true);
  assert.equal(unitAt(b, 'enemy', 0, 1).curHp, 9, 'сосед не задет');
});

test('эффекты видят фланг, центр, ряд и столбец цели удара', () => {
  const zoneBattle = (zone) => {
    const spell = card(`Залп по ${zone === 'flank' ? 'флангам' : 'центру'}`, {
      card_type: 'spell', hp: 0, atk: 0, action_cost: 0, drop_cost: 1,
      effects: [{ event: 'enter_play', target: { side: 'enemy', entity: 'unit', zone, select: 'all' }, action: { type: 'damage', amount: 2 } }],
    });
    const b = battleAt(2, [spell], squad(4));
    deployAt(b, 'enemy', [[0, 0], [0, 1], [0, 2], [0, 3]]);
    b.active = 'me';
    b.me.energy = 6;
    assert.equal(api.cast(b, 'me', b.me.hand.findIndex((c) => c.name === spell.name)), true);
    return b;
  };

  const flank = zoneBattle('flank');
  assert.equal(unitAt(flank, 'enemy', 0, 0).curHp, 7, 'крайний левый столбец — фланг');
  assert.equal(unitAt(flank, 'enemy', 0, 3).curHp, 7, 'крайний правый столбец — фланг');
  assert.equal(unitAt(flank, 'enemy', 0, 1).curHp, 9, 'центр не задет');
  assert.equal(unitAt(flank, 'enemy', 0, 2).curHp, 9);

  const center = zoneBattle('center');
  assert.equal(unitAt(center, 'enemy', 0, 1).curHp, 7, 'центр накрыт');
  assert.equal(unitAt(center, 'enemy', 0, 2).curHp, 7);
  assert.equal(unitAt(center, 'enemy', 0, 0).curHp, 9, 'фланги целы');
  assert.equal(unitAt(center, 'enemy', 0, 3).curHp, 9);

  // Ряд и столбец цели удара — те же оси, что и у площадных слов, но выбирает их эффект карты.
  const relationBattle = (relation) => {
    const shooter = card('Гранатомёт', {
      atk: 2, hp: 8,
      effects: [{ event: 'attack', target: { side: 'enemy', entity: 'unit', relation, select: 'all' }, action: { type: 'damage', amount: 1 } }],
    });
    const b = battleAt(2, [shooter], squad(4));
    deployAt(b, 'enemy', [[0, 0], [0, 1], [0, 2], [1, 1]]);
    const gun = putUnit(b, 'me', 'Гранатомёт', 0, 1);
    refresh(b);
    b.active = 'me';
    b.me.energy = 8;
    assert.equal(api.attackWith(b, 'me', gun.iid), true);
    return b;
  };

  const row = relationBattle('attack_target_row');
  assert.equal(unitAt(row, 'enemy', 0, 0).curHp, 8, 'весь ряд цели удара получил по 1');
  assert.equal(unitAt(row, 'enemy', 0, 2).curHp, 8);
  assert.equal(unitAt(row, 'enemy', 1, 1).curHp, 9, 'другой ряд не задет');

  const column = relationBattle('attack_target_column');
  assert.equal(unitAt(column, 'enemy', 1, 1).curHp, 8, 'весь столбец цели удара получил по 1');
  assert.equal(unitAt(column, 'enemy', 0, 0).curHp, 9, 'соседние столбцы целы');
  assert.equal(unitAt(column, 'enemy', 0, 2).curHp, 9);
});

test('кузнец держит площадные слова в рамках, а словарь совпадает с движком', () => {
  assert.equal(C.AREA_KEYWORDS.join(','), api.AREA_KEYWORDS.join(','), 'список площадных слов один на игру и на кузнеца');
  assert.equal(C.AREA_MAX_N, api.AREA_MAX_N, 'предел N совпадает');
  for (const kw of ['blast', 'sweep', 'column', 'dispersed', 'entrenched']) {
    assert.ok(C.KEYWORD_INFO[kw], `${kw} объяснён в инспекторе`);
    assert.ok(C.KEYWORD_INFO[kw].name.length > 2, `${kw} назван по-русски`);
    assert.ok(C.KEYWORD_INFO[kw].desc.length > 20, `${kw} описан`);
  }

  const base = {
    name: 'Бомбарда', card_type: 'unit', era: 'ancient', emoji: '💥', drop_cost: 3, action_cost: 2, atk: 3, hp: 5,
    description: 'Накрывает строй ядрами.', tags: [], abilities: [], keywords: [], effects: [], monkey_paw: '',
  };
  const validate = (keywords, extra = {}, rarity = 'uncommon') =>
    C.validateCard({ ...base, keywords, ...extra }, 'unit', ['ancient'], rarity, 'none');

  assert.doesNotThrow(() => validate(['blast:2']), 'необычная карта с тяжёлым фугасом законна');
  assert.doesNotThrow(() => validate(['sweep:1', 'ranged']), 'площадь сочетается с дальним боем');
  assert.doesNotThrow(() => validate(['dispersed', 'entrenched']), 'контрмеры к площади — без особых рамок');
  assert.throws(() => validate(['blast:3']), /от 1 до 2/u, 'N выше потолка отклоняется');
  assert.throws(() => validate(['blast:0']), /от 1 до 2/u, 'нулевой площади не бывает');
  assert.throws(() => validate(['blast:1', 'sweep:1']), /одного площадного слова/u, 'две формы площади на карте не складываются');
  assert.throws(() => validate(['column:1'], { action_cost: 0 }), /action_cost минимум 1/u, 'бесплатного обстрела не бывает');
  assert.throws(() => validate(['column:1'], {}, 'ordinary'), /не ниже необычной/u, 'рядовая карта площади не получает');
  assert.throws(() => C.validateCard({ ...base, card_type: 'structure', atk: 0, action_cost: 0, hp: 8, keywords: ['sweep:1'] },
    'structure', ['ancient'], 'uncommon', 'none'), /только отрядам/u, 'постройка не стреляет картечью');

  // Эффекты с новой геометрией проходят валидацию, а чужая — нет.
  const spell = (target) => ({
    name: 'Залп', card_type: 'spell', era: 'ancient', emoji: '💥', drop_cost: 2, action_cost: 0, atk: 0, hp: 0,
    description: 'Накрывает полосу.', tags: [], abilities: [], keywords: [], monkey_paw: '',
    effects: [{ event: 'enter_play', target, action: { type: 'damage', amount: 2 } }],
  });
  const validateSpell = (target) => C.validateCard(spell(target), 'spell', ['ancient'], 'ordinary', 'none');
  assert.doesNotThrow(() => validateSpell({ side: 'enemy', entity: 'unit', zone: 'flank', select: 'all' }), 'зона фланга законна');
  assert.doesNotThrow(() => validateSpell({ side: 'enemy', entity: 'unit', zone: 'center', count: 2 }), 'зона центра законна');
  assert.throws(() => validateSpell({ side: 'enemy', entity: 'unit', zone: 'middle' }), /zone неизвестна/u);
  assert.throws(() => validateSpell({ side: 'enemy', entity: 'unit', relation: 'attack_target_row' }), /только для события attack/u, 'ряд цели удара существует лишь для удара');

  const unitWithRelation = (relation) => C.validateCard({
    ...base, name: 'Гранатомёт', keywords: [],
    effects: [{ event: 'attack', target: { side: 'enemy', entity: 'unit', relation, select: 'all' }, action: { type: 'damage', amount: 1 } }],
  }, 'unit', ['ancient'], 'uncommon', 'none');
  assert.doesNotThrow(() => unitWithRelation('attack_target_row'), 'ряд цели удара — законное отношение');
  assert.doesNotThrow(() => unitWithRelation('attack_target_column'), 'столбец цели удара — законное отношение');
});

test('подписи эффектов называют новую геометрию словами', () => {
  const effect = (target) => C.describeEffect({ event: 'enter_play', target, action: { type: 'damage', amount: 2 } });
  assert.match(effect({ side: 'enemy', entity: 'unit', zone: 'flank', select: 'all' }), /фланг/u, 'фланг назван в подписи');
  assert.match(effect({ side: 'enemy', entity: 'unit', zone: 'center', select: 'all' }), /центр/u, 'центр назван в подписи');
  assert.match(C.describeEffect({ event: 'attack', target: { side: 'enemy', entity: 'unit', relation: 'attack_target_row', select: 'all' }, action: { type: 'damage', amount: 1 } }),
    /ряд цели удара/u);
  assert.match(C.describeEffect({ event: 'attack', target: { side: 'enemy', entity: 'unit', relation: 'attack_target_column', select: 'all' }, action: { type: 'damage', amount: 1 } }),
    /столбец цели удара/u);
});
