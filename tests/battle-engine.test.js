/**
 * Боевой движок (src/game/battle.ts): расчёт урона, выбор цели, постройки, усталость и победа.
 * Эти проверки заменяют часть покрытия удалённого legacy-движка (tests/effects.test.js,
 * tests/battle-turn.test.js): вторая реализация боя из legacy.html больше не существует,
 * поэтому всё проверяется на том движке, которым реально играет React-слой.
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
  if (relativePath === 'src/game/cards.ts') {
    dependencies = {
      './model': {
        M: {
          ERA_HISTORICAL: Campaign.ERA_HISTORICAL,
          HISTORICAL_CULTURES: Campaign.HISTORICAL_CULTURES,
          ORIGINS: Campaign.ORIGINS,
          SEED_CHOICES: Campaign.SEED_CHOICES,
          STARTER_CARDS: Campaign.STARTER_CARDS,
          eraName: Campaign.eraName,
          allowedCardEras: Campaign.allowedCardEras,
          combatPerks: Campaign.combatPerks,
          describePerks: Campaign.describePerks,
        },
      },
      ...dependencies,
    };
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

// threatEra: 2 — классический стол Средневековья (2 ряда по 4): эти тесты про правила рядов,
// а не про рост стола, который проверяется отдельно в tests/era-board.test.js.
const match = () => ({ kind: 'practice', opponentId: 'reed', name: 'Илмар', clan: 'Речной Союз', era: 0, threatEra: 2, leaderBattle: false, tutorial: false });

function battle(myCards, enemyCards, cfg = {}) {
  const config = { hp: 20, energyMax: 10, energyGrowth: 1, fatigueDelay: 0, atkBonus: 0, ...cfg };
  return api.createBattle(myCards, config, enemyCards, { ...config }, match());
}

/** Ставит карту из руки на поле, временно передавая ход нужной стороне. */
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

/**
 * Ставит отряд в указанный ряд, минуя правила высадки: deploy их теперь проверяет (постройки —
 * только в тыл, ближний бой без стрельбы — только в авангард), а эти тесты смотрят на бой отряда,
 * который уже оказался в глубине стола. Поэтому карта выходит на законный ряд и переносится.
 */
function putUnit(b, side, cardName, row = 'front', slot = 0) {
  const idx = b[side].hand.findIndex((c) => c.name === cardName);
  assert.ok(idx >= 0, `«${cardName}» должна быть в руке стороны ${side}`);
  const card = b[side].hand[idx];
  const rows = api.rowsOf(b[side]);
  const stage = card.card_type === 'structure' ? rows.length - 1 : 0;
  const free = rows[stage].indexOf(null);
  assert.ok(free >= 0, 'для переноса нужно свободное место на законном ряду');
  assert.equal(place(b, side, cardName, stage, free), true, `«${cardName}» должна выйти на стол`);
  const unit = rows[stage][free];
  rows[stage][free] = null;
  rowArr(b, side, row)[slot] = unit;
  return unit;
}

/** Снимает усталость со всех отрядов: высадка оставляет отряд истощённым до следующего хода. */
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

/** Столкновение двух отрядов в передних рядах: удобно мерить ровно один удар. */
function clash(myCard, enemyCard, cfg) {
  const b = battle([myCard], [enemyCard], cfg);
  assert.equal(place(b, 'me', myCard.name), true);
  assert.equal(place(b, 'enemy', enemyCard.name), true);
  refresh(b);
  return b;
}

test('бронзовый отряд бьёт древнего сильнее, а древний по бронзе — слабее', () => {
  const forward = clash(card('Бронзовые мечники', { era: 'bronze', atk: 2, hp: 4 }), card('Древние копейщики', { era: 'ancient', hp: 6 }));
  attack(forward, 'me');
  assert.equal(unitAt(forward, 'enemy', 'front', 0).curHp, 6 - 3, 'бронза по древним: 2 + 1');

  const backward = clash(card('Древние копейщики', { era: 'ancient', atk: 2, hp: 4 }), card('Бронзовые мечники', { era: 'bronze', hp: 6 }));
  attack(backward, 'me');
  assert.equal(unitAt(backward, 'enemy', 'front', 0).curHp, 6 - 1, 'древние по бронзе: максимум(1, 2 − 1)');

  // одна и та же эпоха — без поправки
  const equal = clash(card('Древние копейщики', { era: 'ancient', atk: 2 }), card('Древние пращники', { era: 'ancient', hp: 6 }));
  attack(equal, 'me');
  assert.equal(unitAt(equal, 'enemy', 'front', 0).curHp, 4);
});

test('броня гасит урон, пробой её игнорирует, а урон не бывает нулевым', () => {
  const armored = clash(card('Древние копейщики', { atk: 3 }), card('Щитоносцы', { hp: 8, keywords: ['armor:2'] }));
  attack(armored, 'me');
  assert.equal(unitAt(armored, 'enemy', 'front', 0).curHp, 8 - 1);

  const pierced = clash(card('Древние копейщики', { atk: 3, keywords: ['pierce:2'] }), card('Щитоносцы', { hp: 8, keywords: ['armor:2'] }));
  attack(pierced, 'me');
  assert.equal(unitAt(pierced, 'enemy', 'front', 0).curHp, 8 - 3, 'пробой снимает броню');

  const wall = clash(card('Древние копейщики', { atk: 1 }), card('Частокол', { hp: 8, keywords: ['armor:5'] }));
  attack(wall, 'me');
  assert.equal(unitAt(wall, 'enemy', 'front', 0).curHp, 7, 'минимум 1 урона');
});

test('щитовой строй, стойкость и последний рубеж уменьшают входящий урон', () => {
  // shieldwall работает только с соседом в ряду
  const b = battle([card('Древние копейщики', { atk: 4 })], [card('Щитоносцы', { hp: 9, keywords: ['shieldwall'] }), card('Пращники', { hp: 3 })]);
  place(b, 'me', 'Древние копейщики');
  place(b, 'enemy', 'Щитоносцы', 'front', 0);
  place(b, 'enemy', 'Пращники', 'front', 1);
  refresh(b);
  attack(b, 'me');
  assert.equal(unitAt(b, 'enemy', 'front', 0).curHp, 9 - 2, 'shieldwall: броня 1 и ещё −1 при соседе');

  // стойкий отряд гасит только первый удар за ход
  const sturdy = clash(card('Древние копейщики', { atk: 3, keywords: ['relentless'] }), card('Стойкий страж', { hp: 9, keywords: ['sturdy'] }));
  attack(sturdy, 'me');
  assert.equal(unitAt(sturdy, 'enemy', 'front', 0).curHp, 7, 'первый удар гасится стойкостью');
  // relentless не истощает отряд: вторая атака за тот же ход проходит уже полностью
  assert.equal(unitAt(sturdy, 'me', 'front', 0).exhausted, false);
  attack(sturdy, 'me');
  assert.equal(unitAt(sturdy, 'enemy', 'front', 0).curHp, 4, 'вторая атака без скидки');
  assert.equal(unitAt(sturdy, 'me', 'front', 0).exhausted, true, 'третьей атаки за ход нет');

  // последний живой в ряду получает +1 брони
  const last = clash(card('Древние копейщики', { atk: 3 }), card('Одинокий страж', { hp: 9, keywords: ['laststand'] }));
  attack(last, 'me');
  assert.equal(unitAt(last, 'enemy', 'front', 0).curHp, 9 - 2, 'laststand: +1 броня, когда в ряду больше никого');
});

test('постройка стоит в тылу, не атакует и обстреливает врага своей атакой', () => {
  const tower = card('Сторожевая башня', { card_type: 'structure', atk: 2, action_cost: 0, hp: 4 });
  const b = battle([tower, card('Древние копейщики')], [card('Древние копейщики', { hp: 6 })]);
  assert.equal(place(b, 'me', tower.name, 'front', 0), false, 'постройку нельзя поставить в передний ряд');
  assert.equal(place(b, 'me', tower.name, 'back', 0), true);
  assert.equal(api.canAct(b, 'me', unitAt(b, 'me', 'back', 0)), false, 'постройка не атакует');

  // чужой отряд на поле — обстрел идёт по нему и считается как обычный удар (броня гасит)
  place(b, 'enemy', 'Древние копейщики', 'front', 0);
  api.beginEnemyTurn(b);
  api.beginPlayerTurn(b);
  assert.equal(unitAt(b, 'enemy', 'front', 0).curHp, 4, 'обстрел снял 2 HP — свою атаку, а не фиксированную единицу');
  assert.ok(!b.log.some((l) => /ответ −/u.test(l.text)), 'на обстрел не отвечают: до чужого тыла не достать');

  // поле пустое — обстрел идёт по вождю
  unitAt(b, 'enemy', 'front', 0).curHp = 0;
  api.settle(b);
  const hpBefore = b.enemy.hp;
  api.beginEnemyTurn(b);
  api.beginPlayerTurn(b);
  assert.equal(b.enemy.hp, hpBefore - 2);
});

test('стена без атаки не стреляет: частокол преграждает проход, а не бьёт бесплатно', () => {
  const wall = card('Частокол', { card_type: 'structure', atk: 0, action_cost: 0, hp: 6 });
  const b = battle([wall, card('Древние копейщики')], [card('Древние копейщики', { hp: 6 })]);
  place(b, 'me', wall.name, 'back', 0);
  place(b, 'enemy', 'Древние копейщики', 'front', 0);
  const before = unitAt(b, 'enemy', 'front', 0).curHp;
  api.beginEnemyTurn(b);
  api.beginPlayerTurn(b);
  assert.equal(unitAt(b, 'enemy', 'front', 0).curHp, before, 'постройка без атаки никого не обстреливает');
  assert.ok(!b.log.some((l) => /обстреливает/u.test(l.text)));
});

test('осада достаёт тыл и удваивает урон по постройкам', () => {
  const ram = card('Таран', { atk: 2, keywords: ['siege'] });
  const camp = card('Лагерь', { card_type: 'structure', atk: 0, action_cost: 0, hp: 8 });

  // передний ряд врага пуст: таран бьёт по постройке в тылу и наносит двойной урон
  const b = battle([ram], [camp]);
  place(b, 'me', ram.name, 'front', 0);
  place(b, 'enemy', camp.name, 'back', 0);
  refresh(b);
  const target = api.findTarget(b, unitAt(b, 'me', 'front', 0), 'me');
  assert.equal(target.kind, 'unit');
  assert.equal(target.unit.name, camp.name);
  attack(b, 'me');
  assert.equal(unitAt(b, 'enemy', 'back', 0).curHp, 8 - 4, 'осада: 2 × 2 по постройке');

  // без осады тыл недоступен — удар уходит вождю
  const plain = battle([card('Древние копейщики', { atk: 2 })], [camp]);
  place(plain, 'me', 'Древние копейщики', 'front', 0);
  place(plain, 'enemy', camp.name, 'back', 0);
  refresh(plain);
  assert.equal(api.findTarget(plain, unitAt(plain, 'me', 'front', 0), 'me').kind, 'hero');
  const heroBefore = plain.enemy.hp;
  attack(plain, 'me');
  assert.equal(plain.enemy.hp, heroBefore - 2);
  assert.equal(unitAt(plain, 'enemy', 'back', 0).curHp, 8);

  // пока вражеский передний ряд держится, таран бьёт по нему без удвоения
  const covered = battle([ram], [camp, card('Древние копейщики', { hp: 6 })]);
  place(covered, 'me', ram.name, 'front', 0);
  place(covered, 'enemy', camp.name, 'back', 0);
  place(covered, 'enemy', 'Древние копейщики', 'front', 0);
  refresh(covered);
  assert.equal(api.findTarget(covered, unitAt(covered, 'me', 'front', 0), 'me').row, 'front');
  attack(covered, 'me');
  assert.equal(unitAt(covered, 'enemy', 'front', 0).curHp, 4);
  assert.equal(unitAt(covered, 'enemy', 'back', 0).curHp, 8);
});

test('цель удара: насмешка, зеркальный слот, ближайший отряд, глубина столбца, брешь и вождь', () => {
  // насмешка перехватывает удар даже из соседнего слота
  const b = battle([card('Древние копейщики', { atk: 2 })], [card('Пращники', { hp: 5 }), card('Забияка', { hp: 5, keywords: ['taunt'] })]);
  place(b, 'me', 'Древние копейщики', 'front', 0);
  place(b, 'enemy', 'Пращники', 'front', 0);
  place(b, 'enemy', 'Забияка', 'front', 1);
  refresh(b);
  const target = api.findTarget(b, unitAt(b, 'me', 'front', 0), 'me');
  assert.equal(target.unit.name, 'Забияка');
  attack(b, 'me');
  assert.equal(unitAt(b, 'enemy', 'front', 1).curHp, 3);
  assert.equal(unitAt(b, 'enemy', 'front', 0).curHp, 5);

  // зеркальный слот пуст, но столбец держится отрядом в глубине — удар уходит к ближайшему в ряду
  const empty = battle([card('Древние копейщики', { atk: 2 })], [card('Древние копейщики', { hp: 5 }), card('Тыловой', { hp: 5 })]);
  place(empty, 'me', 'Древние копейщики', 'front', 2);
  place(empty, 'enemy', 'Древние копейщики', 'front', 0);
  putUnit(empty, 'enemy', 'Тыловой', 'back', 2);
  refresh(empty);
  assert.equal(api.findTarget(empty, unitAt(empty, 'me', 'front', 2), 'me').i, 0, 'ближайший в ряду, пока столбец держится');
  assert.equal(api.hasGapAt(empty, 'enemy', 2), false, 'в столбце есть живой отряд — бреши нет');

  // авангард выбит — удар идёт вглубь своего столбца
  unitAt(empty, 'enemy', 'front', 0).curHp = 0;
  api.settle(empty);
  assert.equal(api.findTarget(empty, unitAt(empty, 'me', 'front', 2), 'me').unit.name, 'Тыловой');

  // и только пустой столбец открывает вождя
  unitAt(empty, 'enemy', 'back', 2).curHp = 0;
  api.settle(empty);
  assert.equal(api.hasGapAt(empty, 'enemy', 2), true);
  assert.equal(api.findTarget(empty, unitAt(empty, 'me', 'front', 2), 'me').kind, 'hero');
});

test('брешь в обороне открывает вождя: это правило по умолчанию, а не ключевое слово', () => {
  const sword = card('Древние копейщики', { atk: 3 });
  // враг стоит только в первом столбце, мой отряд — во втором: во втором столбце у врага брешь
  const b = battle([sword], [card('Заслон', { hp: 6 })]);
  place(b, 'me', sword.name, 'front', 1);
  place(b, 'enemy', 'Заслон', 'front', 0);
  refresh(b);

  assert.deepEqual(api.gapsOf(b, 'enemy').slice(1).length > 0, true, 'движок отдаёт список брешей');
  assert.equal(api.hasGapAt(b, 'enemy', 1), true);
  assert.equal(api.hasGapAt(b, 'enemy', 0), false);
  assert.equal(api.findTarget(b, unitAt(b, 'me', 'front', 1), 'me').kind, 'hero', 'чужой строй в соседнем столбце удар не останавливает');

  const heroBefore = b.enemy.hp;
  attack(b, 'me', 'front', 1);
  assert.equal(b.enemy.hp, heroBefore - 3, 'вождь получил урон через брешь');
  assert.equal(unitAt(b, 'enemy', 'front', 0).curHp, 6, 'отряд в другом столбце не задет');

  // противник закрыл брешь — удар снова идёт по строю
  const covered = battle([sword], [card('Заслон', { hp: 6 }), card('Дозор', { hp: 6 })]);
  place(covered, 'me', sword.name, 'front', 1);
  place(covered, 'enemy', 'Заслон', 'front', 0);
  place(covered, 'enemy', 'Дозор', 'front', 1);
  refresh(covered);
  assert.equal(api.hasGapAt(covered, 'enemy', 1), false);
  assert.equal(api.findTarget(covered, unitAt(covered, 'me', 'front', 1), 'me').unit.name, 'Дозор', 'зеркальный слот');

  // провокация перехватывает удар даже при бреши в столбце
  const taunted = battle([sword], [card('Забияка', { hp: 6, keywords: ['taunt'] })]);
  place(taunted, 'me', sword.name, 'front', 2);
  place(taunted, 'enemy', 'Забияка', 'front', 0);
  refresh(taunted);
  assert.equal(api.hasGapAt(taunted, 'enemy', 2), true);
  assert.equal(api.findTarget(taunted, unitAt(taunted, 'me', 'front', 2), 'me').unit.name, 'Забияка');
});

test('из тыла бьют только дальний бой, засада и досягаемость', () => {
  // обычный отряд в тылу не дотягивается: удар тратится впустую
  const melee = battle([card('Древние копейщики', { atk: 2 })], [card('Древние копейщики', { hp: 6 })]);
  assert.equal(place(melee, 'me', 'Древние копейщики', 'back', 0), false, 'ближний бой без стрельбы в тыл не выпускают');
  putUnit(melee, 'me', 'Древние копейщики', 'back', 0);
  place(melee, 'enemy', 'Древние копейщики', 'front', 0);
  refresh(melee);
  assert.equal(api.findTarget(melee, unitAt(melee, 'me', 'back', 0), 'me'), null);
  assert.equal(attack(melee, 'me', 'back', 0), true);
  assert.equal(unitAt(melee, 'enemy', 'front', 0).curHp, 6, 'урона нет');
  assert.equal(unitAt(melee, 'me', 'back', 0).exhausted, true, 'отряд потратил действие');

  // стрелок из тыла бьёт передний ряд
  const ranged = battle([card('Пращники', { atk: 2, keywords: ['ranged'] })], [card('Древние копейщики', { hp: 6 })]);
  place(ranged, 'me', 'Пращники', 'back', 0);
  place(ranged, 'enemy', 'Древние копейщики', 'front', 0);
  refresh(ranged);
  attack(ranged, 'me', 'back', 0);
  assert.equal(unitAt(ranged, 'enemy', 'front', 0).curHp, 4);

  // досягаемость работает только против зеркального слота переднего ряда
  const reach = battle([card('Копьеносцы', { atk: 2, keywords: ['reach'] })], [card('Древние копейщики', { hp: 6 })]);
  place(reach, 'me', 'Копьеносцы', 'back', 1);
  place(reach, 'enemy', 'Древние копейщики', 'front', 1);
  refresh(reach);
  attack(reach, 'me', 'back', 1);
  assert.equal(unitAt(reach, 'enemy', 'front', 1).curHp, 4);
});

test('свидетели гибели реагируют только на свою сторону (watch)', () => {
  const witness = (watch) => card(`Свидетель ${watch}`, {
    hp: 5,
    effects: [{
      event: 'card_death', watch: { side: watch },
      target: { side: 'friendly', entity: 'player' },
      action: { type: 'heal', amount: 2 },
    }],
  });
  const run = (watch, killSide) => {
    const b = battle([witness(watch), card('Древние копейщики')], [card('Древние копейщики')]);
    place(b, 'me', `Свидетель ${watch}`, 'front', 0);
    place(b, 'me', 'Древние копейщики', 'front', 1);
    place(b, 'enemy', 'Древние копейщики', 'front', 0);
    b.me.hp = 10;
    const victim = killSide === 'me' ? unitAt(b, 'me', 'front', 1) : unitAt(b, 'enemy', 'front', 0);
    victim.curHp = 0;
    api.settle(b);
    return b.me.hp;
  };
  assert.equal(run('friendly', 'me'), 12, 'свидетель своих погибших лечит вождя');
  assert.equal(run('friendly', 'enemy'), 10, 'на гибель врага он не реагирует');
  assert.equal(run('enemy', 'enemy'), 12, 'свидетель вражеских погибших реагирует на них');
  assert.equal(run('enemy', 'me'), 10);
  assert.equal(run('all', 'me'), 12);
  assert.equal(run('all', 'enemy'), 12);
});

test('зеркальное событие card_enter_play срабатывает на любую выведенную карту', () => {
  const watcher = card('Хранитель строя', {
    hp: 5,
    effects: [{
      event: 'card_enter_play', watch: { side: 'all' },
      target: { side: 'friendly', entity: 'player' },
      action: { type: 'heal', amount: 1 },
    }],
  });
  const b = battle([watcher, card('Древние копейщики')], [card('Древние копейщики')]);
  place(b, 'me', 'Хранитель строя', 'front', 0);
  b.me.hp = 10;
  // собственный выход хранителя не должен лечить его вождя дважды
  place(b, 'me', 'Древние копейщики', 'front', 1);
  assert.equal(b.me.hp, 11, 'выход чужого отряда даёт 1 HP вождю');
  place(b, 'enemy', 'Древние копейщики', 'front', 0);
  assert.equal(b.me.hp, 12, 'выход вражеского отряда тоже виден свидетелю');
});

test('цепочка срабатываний обрывается, а не зацикливается', () => {
  // три отряда, каждый из которых бьёт своего при любой гибели: классический бесконечный пинг-понг
  const avenger = (name) => card(name, {
    hp: 4,
    effects: [{
      event: 'card_death', watch: { side: 'all' },
      target: { side: 'friendly', entity: 'unit', select: 'first', count: 1 },
      action: { type: 'damage', amount: 5 },
    }],
  });
  const b = battle([avenger('Первый'), avenger('Второй'), avenger('Третий')], [card('Древние копейщики')]);
  place(b, 'me', 'Первый', 'front', 0);
  place(b, 'me', 'Второй', 'front', 1);
  place(b, 'me', 'Третий', 'front', 2);
  unitAt(b, 'me', 'front', 0).curHp = 0;
  api.settle(b);
  assert.equal(b.me.front.filter((u) => u && u.curHp > 0).length, 0, 'цепочка добивает всех и завершается');
  assert.ok(b.me.discard.length >= 3);
});

test('усталость начинается после шестого круга и растёт, а задержка отодвигает её', () => {
  const cycle = (b) => { api.beginEnemyTurn(b); api.beginPlayerTurn(b); };

  const plain = battle([card('Древние копейщики')], [card('Древние копейщики')]);
  assert.equal(plain.me.fatigueStart, 6);
  const withDelay = battle([card('Древние копейщики')], [card('Древние копейщики')], { fatigueDelay: 2 });
  assert.equal(withDelay.me.fatigueStart, 8, 'обоз и припасы дают два круга запаса');

  // микро-колода: единственная карта сразу в руке, колода пуста
  const b = battle([card('Древние копейщики')], [card('Древние копейщики')]);
  assert.equal(b.me.deck.length, 0);
  for (let turn = 0; turn < 4; turn++) cycle(b);
  assert.equal(b.turn, 5);
  assert.equal(b.me.fatigue, 0, 'до шестого круга усталости нет — микро-колода не умирает сама');
  cycle(b);
  assert.equal(b.turn, 6);
  assert.equal(b.me.fatigue, 1, 'на шестом круге усталость только началась');
  const hpBefore = b.me.hp;
  cycle(b);
  cycle(b);
  assert.equal(b.me.fatigue, 3, 'усталость растёт каждый круг');
  assert.equal(b.me.hp, hpBefore - 2 - 3, 'урон усталости накапливается');

  // та же микро-колода с задержкой: к шестому кругу ещё цела
  for (let turn = 0; turn < 5; turn++) cycle(withDelay);
  assert.equal(withDelay.turn, 6);
  assert.equal(withDelay.me.fatigue, 0, 'задержка усталости сдвигает первый урон');
});

test('бой заканчивается, когда падает вождь, и стартовая рука ограничена', () => {
  const b = battle([card('Древние копейщики')], [card('Древние копейщики')], { hp: 3 });
  assert.equal(b.me.hand.length, 1);
  b.enemy.hp = 0;
  api.settle(b);
  assert.equal(b.over, 'win');
  assert.match(b.log.at(-1).text, /Вражеский вождь повержен/u);

  const loss = battle([card('Древние копейщики')], [card('Древние копейщики')], { hp: 3 });
  loss.me.hp = 0;
  api.settle(loss);
  assert.equal(loss.over, 'lose');
  assert.match(loss.log.at(-1).text, /Ваш вождь пал/u);

  // рука не переполняется: лимит 7, старт 4
  const deck = Array.from({ length: 12 }, (_, i) => card(`Боец ${i}`));
  const wide = battle(deck, deck);
  assert.equal(wide.me.hand.length, 4);
  assert.equal(api.HAND_LIMIT, 7);
  for (let i = 0; i < 6; i++) { api.beginEnemyTurn(b); api.beginPlayerTurn(b); }
  assert.ok(wide.me.hand.length <= api.HAND_LIMIT, `рука ${wide.me.hand.length}`);
});

test('движок получает только проверенные эффекты: битые карты не пускает валидатор', () => {
  const cards = loadTypeScriptModule('src/game/cards.ts');
  const good = card('Древние копейщики');
  assert.doesNotThrow(() => cards.validateCard(good, 'unit', ['ancient']));

  const noWatch = card('Свидетель', { effects: [{ event: 'card_death', target: { side: 'friendly', entity: 'player' }, action: { type: 'heal', amount: 1 } }] });
  assert.throws(() => cards.validateCard(noWatch, 'unit', ['ancient']), /watch/iu, 'card_death без watch отклоняется');

  const badAction = card('Свидетель', { effects: [{ event: 'death', target: { side: 'friendly', entity: 'player' }, action: { type: 'выиграть бой' } }] });
  assert.throws(() => cards.validateCard(badAction, 'unit', ['ancient']), /тип эффекта|действие|неизвестн/iu);

  const noTarget = card('Свидетель', { effects: [{ event: 'death', action: { type: 'damage', amount: 1 } }] });
  assert.throws(() => cards.validateCard(noTarget, 'unit', ['ancient']), /target|цел/iu);
});

test('ближний бой при пустом авангарде доходит до тыла своего столбца', () => {
  const sword = card('Древние копейщики', { atk: 3 });
  const archer = card('Пращники', { hp: 4, keywords: ['ranged'] });

  // авангард врага пуст, в тылу того же столбца стрелок: удар уходит ему, а не вождю
  const b = battle([sword], [archer]);
  place(b, 'me', sword.name, 'front', 1);
  place(b, 'enemy', archer.name, 'back', 1);
  refresh(b);
  const target = api.findTarget(b, unitAt(b, 'me', 'front', 1), 'me');
  assert.equal(target.kind, 'unit');
  assert.equal(target.row, 'back');
  assert.equal(target.i, 1, 'столбец атакующего держится стрелком в тылу');
  const heroBefore = b.enemy.hp;
  attack(b, 'me', 'front', 1);
  assert.equal(unitAt(b, 'enemy', 'back', 1).curHp, 1);
  assert.equal(b.enemy.hp, heroBefore, 'вождь не пострадал, пока столбец держится');

  // стрелка выбили — столбец опустел, и удар уходит вождю
  unitAt(b, 'enemy', 'back', 1).curHp = 0;
  api.settle(b);
  refresh(b);
  assert.equal(api.findTarget(b, unitAt(b, 'me', 'front', 1), 'me').kind, 'hero');
  attack(b, 'me', 'front', 1);
  assert.equal(b.enemy.hp, b.enemy.maxHp - 3);
});

test('постройку в тылу разбирает только осада: ближний бой проходит мимо неё к отряду', () => {
  const camp = card('Лагерь', { card_type: 'structure', atk: 0, action_cost: 0, hp: 6 });
  const guard = card('Страж лагеря', { hp: 5 });
  const sword = card('Древние копейщики', { atk: 3 });

  // в тылу отряд того же столбца и постройка рядом: ближний бой бьёт отряд (постройки — цель осады)
  const b = battle([sword], [camp, guard]);
  place(b, 'me', sword.name, 'front', 0);
  putUnit(b, 'enemy', guard.name, 'back', 0);
  place(b, 'enemy', camp.name, 'back', 1);
  refresh(b);
  assert.equal(api.findTarget(b, unitAt(b, 'me', 'front', 0), 'me').unit.name, guard.name);
  attack(b, 'me');
  assert.equal(unitAt(b, 'enemy', 'back', 0).curHp, 2);
  assert.equal(unitAt(b, 'enemy', 'back', 1).curHp, 6, 'постройка цела');

  // осада идёт в постройку, если в её столбце нет живых отрядов, и удваивает урон
  const ram = battle([card('Таран', { atk: 2, keywords: ['siege'] })], [camp, guard]);
  place(ram, 'me', 'Таран', 'front', 0);
  place(ram, 'enemy', camp.name, 'back', 0);
  putUnit(ram, 'enemy', guard.name, 'back', 2);
  refresh(ram);
  assert.equal(api.findTarget(ram, unitAt(ram, 'me', 'front', 0), 'me').unit.name, camp.name);
  attack(ram, 'me');
  assert.equal(unitAt(ram, 'enemy', 'back', 0).curHp, 6 - 4);

  // постройка, прикрытая живым отрядом того же столбца, недоступна: сначала надо пройти отряд
  const shielded = battle([card('Таран', { atk: 2, keywords: ['siege'] })], [camp, guard]);
  place(shielded, 'me', 'Таран', 'front', 0);
  putUnit(shielded, 'enemy', guard.name, 'front', 0);
  place(shielded, 'enemy', camp.name, 'back', 0);
  refresh(shielded);
  assert.equal(api.findTarget(shielded, unitAt(shielded, 'me', 'front', 0), 'me').unit.name, guard.name);
});

test('стрелки бьют через авангард по самой опасной цели, а провокация перехватывает выстрел', () => {
  const bow = card('Охотники с луками', { atk: 2, hp: 1, keywords: ['ranged'] });

  // авангард врага занят «стеной», но в тылу стоит более опасный отряд — стрела летит в него
  const b = battle([bow], [card('Щитоносцы', { hp: 8, atk: 1, keywords: ['armor:2'] }), card('Топорники', { hp: 5, atk: 4 })]);
  place(b, 'me', bow.name, 'back', 0);
  place(b, 'enemy', 'Щитоносцы', 'front', 0);
  putUnit(b, 'enemy', 'Топорники', 'back', 0);
  refresh(b);
  const target = api.findTarget(b, unitAt(b, 'me', 'back', 0), 'me');
  assert.equal(target.unit.name, 'Топорники', 'цель — самый опасный отряд, а не тот, что напротив');
  assert.equal(target.row, 'back');
  const before = unitAt(b, 'enemy', 'back', 0).curHp;
  attack(b, 'me', 'back', 0);
  assert.equal(unitAt(b, 'enemy', 'back', 0).curHp, before - 2);
  assert.match(b.log.at(-1).text, /стреляет через строй по «Топорники»/u, 'в журнале видно, что выстрел прошёл через авангард');
  assert.equal(unitAt(b, 'enemy', 'front', 0).curHp, 8, 'авангард не задет');

  // при равной атаке стрелки выбирают отряд в тылу: его иначе не достать
  const tie = battle([bow], [card('Копейщики', { hp: 5, atk: 2 }), card('Пращники врага', { hp: 3, atk: 2 })]);
  place(tie, 'me', bow.name, 'back', 0);
  place(tie, 'enemy', 'Копейщики', 'front', 1);
  putUnit(tie, 'enemy', 'Пращники врага', 'back', 1);
  refresh(tie);
  assert.equal(api.findTarget(tie, unitAt(tie, 'me', 'back', 0), 'me').unit.name, 'Пращники врага');

  // провокация перехватывает выстрел, даже если за ней стоит более опасный отряд
  const taunted = battle([bow], [card('Забияка', { hp: 6, atk: 1, keywords: ['taunt'] }), card('Топорники', { hp: 5, atk: 5 })]);
  place(taunted, 'me', bow.name, 'back', 0);
  place(taunted, 'enemy', 'Забияка', 'front', 0);
  putUnit(taunted, 'enemy', 'Топорники', 'back', 0);
  refresh(taunted);
  assert.equal(api.findTarget(taunted, unitAt(taunted, 'me', 'back', 0), 'me').unit.name, 'Забияка');

  // отрядов не осталось — стрелки бьют вождя
  const hero = battle([bow], [card('Копейщики', { hp: 5, atk: 2 })]);
  place(hero, 'me', bow.name, 'back', 0);
  place(hero, 'enemy', 'Копейщики', 'front', 0);
  refresh(hero);
  unitAt(hero, 'enemy', 'front', 0).curHp = 0;
  api.settle(hero);
  assert.equal(api.findTarget(hero, unitAt(hero, 'me', 'back', 0), 'me').kind, 'hero');

  // стрелок в переднем ряду тоже бьёт через вражеский строй: дальний бой не зависит от своего ряда
  const frontBow = battle([bow], [card('Щитоносцы', { hp: 8, atk: 1 }), card('Топорники', { hp: 5, atk: 4 })]);
  place(frontBow, 'me', bow.name, 'front', 0);
  place(frontBow, 'enemy', 'Щитоносцы', 'front', 0);
  putUnit(frontBow, 'enemy', 'Топорники', 'back', 2);
  refresh(frontBow);
  assert.equal(api.findTarget(frontBow, unitAt(frontBow, 'me', 'front', 0), 'me').unit.name, 'Топорники');
});

test('засадный боец, уклонившись в тыл, больше не недосягаем для ближнего боя', () => {
  const skirmisher = card('Пращники из холмов', { hp: 3, atk: 1, keywords: ['ranged', 'skirmish'] });
  const sword = card('Древние копейщики', { atk: 3 });

  // уклонение работает, пока у врага есть авангард
  const b = battle([sword], [skirmisher, card('Щитоносцы', { hp: 6, atk: 1 })]);
  place(b, 'me', sword.name, 'front', 0);
  place(b, 'enemy', skirmisher.name, 'front', 0);
  place(b, 'enemy', 'Щитоносцы', 'front', 1);
  refresh(b);
  attack(b, 'me');
  assert.equal(b.enemy.front[0], null, 'засада уклонилась в тыл');
  assert.ok(b.enemy.back.some((u) => u && u.name === skirmisher.name));

  // авангард выбит — следующий удар ближнего боя достаёт уклонившегося в тылу
  b.enemy.front[1].curHp = 0;
  api.settle(b);
  refresh(b);
  unitAt(b, 'me', 'front', 0).exhausted = false;
  assert.equal(api.findTarget(b, unitAt(b, 'me', 'front', 0), 'me').unit.name, skirmisher.name);
});
