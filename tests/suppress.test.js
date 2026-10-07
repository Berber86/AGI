const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const Campaign = require('../campaign.js');

const root = path.join(__dirname, '..');

/**
 * Подавление — статус вместо урона: пулемёт и артиллерия заставляют противника залечь, а не только
 * выбивают строй. Решение принято мягкое: подавленный отряд не теряет право на атаку, она просто
 * дорожает на N (потолок +3) на два хода, поэтому при запасе энергии он всё равно ударит. Ответ —
 * «Несокрушимый»: он гасит и страх, и мораль, и подавление.
 *
 * Здесь же регрессия на соседнюю поломку: слова-источники статусов (poison, burn, suppress) живут
 * отдельно от самого статуса, иначе отряд с «ядом» получал урон от собственного яда каждый ход и
 * навсегда, а истечение срока стирало и само слово.
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
            MILITIA_CORE_CARDS: Campaign.MILITIA_CORE_CARDS,
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
    id: name.toLowerCase().replaceAll(' ', '-'), name, card_type: 'unit', era: 'ancient', emoji: '🔫',
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

/** Пулемёт против одного отряда: общий стенд для большей части проверок. */
function duel(myCard, enemyCard, threatEra = 2) {
  const b = battleAt(threatEra, [myCard], [enemyCard]);
  const foe = putUnit(b, 'enemy', enemyCard.name, 0, 0);
  const gun = putUnit(b, 'me', myCard.name, 0, 0);
  refresh(b);
  b.active = 'me';
  b.me.energy = 10;
  return { b, gun, foe };
}

const gunner = (options = {}) => card('Пулемёт', { atk: 3, hp: 8, keywords: ['suppress:2'], ...options });
const soldier = (options = {}) => card('Боец', { atk: 2, hp: 14, action_cost: 1, ...options });

test('подавление удорожает атаку, но не отнимает её', () => {
  const { b, gun, foe } = duel(gunner(), soldier());
  assert.equal(api.costOf(b, foe), 1, 'до удара атака стоит свою цену');

  assert.equal(api.attackWith(b, 'me', gun.iid), true);
  assert.equal(foe.st.suppress, 2, 'отряд подавлен');
  assert.equal(foe.st.suppressTurns, 2, 'на два хода');
  assert.equal(api.costOf(b, foe), 3, 'атака подорожала на 2');
  assert.ok(b.log.some((l) => /подавлен огнём/u.test(l.text)), 'подавление видно в журнале');

  b.active = 'enemy';
  refresh(b);
  b.enemy.energy = 2;
  assert.equal(api.canAct(b, 'enemy', foe), false, 'за 2 энергии подавленный отряд не бьёт');
  b.enemy.energy = 3;
  assert.equal(api.canAct(b, 'enemy', foe), true, 'а за 3 — бьёт: это удорожание, а не запрет');
  const heroBefore = b.me.hp;
  assert.equal(api.attackWith(b, 'enemy', foe.iid), true);
  assert.ok(b.me.hp < heroBefore || unitAt(b, 'me', 0, 0).curHp < 8, 'удар состоялся');
});

test('подавление не наносит урона и истекает само', () => {
  const { b, gun, foe } = duel(gunner(), soldier());
  assert.equal(api.attackWith(b, 'me', gun.iid), true);
  const hpAfterHit = foe.curHp;

  b.active = 'enemy';
  api.startTurn(b, 'enemy');
  assert.equal(foe.st.suppress, 2, 'после первого хода противника подавление ещё держится');
  assert.equal(foe.st.suppressTurns, 1);
  assert.equal(foe.curHp, hpAfterHit, 'урона от подавления нет');

  api.startTurn(b, 'me');
  api.startTurn(b, 'enemy');
  assert.equal(foe.st.suppress, undefined, 'к следующему своему ходу отряд пришёл в себя');
  assert.equal(foe.st.suppressTurns, undefined);
  assert.equal(api.costOf(b, foe), 1, 'цена атаки прежняя');
  assert.equal(foe.curHp, hpAfterHit, 'и здоровье не изменилось');
  assert.ok(b.log.some((l) => /приходит в себя/u.test(l.text)), 'снятие подавления записано');
});

test('повторное попадание обновляет срок и берёт большее число, а потолок — +3', () => {
  const { b, gun, foe } = duel(gunner(), soldier());
  assert.equal(api.attackWith(b, 'me', gun.iid), true);
  assert.equal(foe.st.suppressTurns, 2);

  api.startTurn(b, 'enemy');
  assert.equal(foe.st.suppressTurns, 1);
  api.startTurn(b, 'me');
  refresh(b);
  b.active = 'me';
  b.me.energy = 10;
  assert.equal(api.attackWith(b, 'me', gun.iid), true);
  assert.equal(foe.st.suppressTurns, 2, 'срок обновился, а не истёк');
  assert.equal(foe.st.suppress, 2);

  // Пулемёт помощнее: потолок не пробивается.
  const heavy = duel(gunner({ keywords: ['suppress:9'] }), soldier({ name: 'Боец 2' }));
  assert.equal(api.attackWith(heavy.b, 'me', heavy.gun.iid), true);
  assert.equal(heavy.foe.st.suppress, api.SUPPRESS_MAX, 'потолок подавления');
  assert.equal(api.SUPPRESS_MAX, 3);
  assert.equal(api.costOf(heavy.b, heavy.foe), 1 + api.SUPPRESS_MAX);
});

test('«Несокрушимый» не чувствует подавления — ни от слова, ни от манёвра', () => {
  const { b, gun, foe } = duel(gunner(), soldier({ keywords: ['unbreakable'] }));
  assert.equal(api.attackWith(b, 'me', gun.iid), true);
  assert.equal(foe.st.suppress, undefined, 'подавление не легло');
  assert.equal(api.costOf(b, foe), 1, 'цена атаки не изменилась');
  assert.ok(!b.log.some((l) => /подавлен огнём/u.test(l.text)), 'и в журнале пусто');

  const spell = card('Огонь на подавление', {
    card_type: 'spell', hp: 0, atk: 0, action_cost: 0, drop_cost: 1,
    effects: [{ event: 'enter_play', target: { side: 'enemy', entity: 'unit', zone: 'front', select: 'highest_attack', count: 1 }, action: { type: 'apply_status', status: 'suppress', amount: 2, turns: 2 } }],
  });
  // Манёвр бьёт по самой опасной цели, поэтому несокрушимого делаем опаснее второго.
  const b2 = battleAt(2, [spell], [soldier({ keywords: ['unbreakable'], atk: 6 }), soldier({ name: 'Боец 2', atk: 2 })]);
  const sturdy = putUnit(b2, 'enemy', 'Боец', 0, 0);
  const soft = putUnit(b2, 'enemy', 'Боец 2', 0, 1);
  b2.active = 'me';
  b2.me.energy = 6;
  assert.equal(api.cast(b2, 'me', b2.me.hand.findIndex((c) => c.name === spell.name)), true);
  assert.equal(sturdy.st.suppress, undefined, 'несокрушимого манёвр тоже не подавляет');
  assert.equal(api.costOf(b2, sturdy), 1);
  assert.equal(soft.st.suppress, undefined, 'а вторую цель манёвр и не выбирал');
});

test('манёвр подавляет отряд: статус приходит из эффекта карты', () => {
  const spell = card('Огонь на подавление', {
    card_type: 'spell', hp: 0, atk: 0, action_cost: 0, drop_cost: 1,
    effects: [{ event: 'enter_play', target: { side: 'enemy', entity: 'unit', zone: 'front', select: 'highest_attack', count: 1 }, action: { type: 'apply_status', status: 'suppress', amount: 2, turns: 2 } }],
  });
  const b = battleAt(2, [spell], [soldier(), soldier({ name: 'Боец 2', atk: 5 })]);
  putUnit(b, 'enemy', 'Боец', 0, 0);
  const loudest = putUnit(b, 'enemy', 'Боец 2', 0, 1);
  b.active = 'me';
  b.me.energy = 6;
  assert.equal(api.cast(b, 'me', b.me.hand.findIndex((c) => c.name === spell.name)), true);
  assert.equal(loudest.st.suppress, 2, 'манёвр выбрал самую опасную цель и подавил её');
  assert.equal(api.costOf(b, loudest), 3);
  assert.ok(b.log.some((l) => /подавление 2/u.test(l.text)), 'в журнале назван статус по-русски');
});

test('постройку подавлять бессмысленно: она не атакует', () => {
  const b = battleAt(3, [gunner({ keywords: ['suppress:2', 'siege'] })],
    [card('Частокол', { card_type: 'structure', atk: 0, hp: 14, action_cost: 0 })]);
  const fort = putUnit(b, 'enemy', 'Частокол', 2, 0);
  const gun = putUnit(b, 'me', 'Пулемёт', 0, 0);
  refresh(b);
  b.active = 'me';
  b.me.energy = 10;
  const target = api.findTarget(b, gun, 'me');
  assert.equal(target.unit.isStructure, true, 'осада берётся за постройку в пустом столбце');
  assert.equal(api.attackWith(b, 'me', gun.iid), true);
  assert.equal(fort.st.suppress, undefined, 'статус на постройку не лёг');
});

test('подавленный противник не тратит ход впустую: энергии хватает — и он бьёт', () => {
  const { b, gun, foe } = duel(gunner(), soldier({ atk: 3 }));
  assert.equal(api.attackWith(b, 'me', gun.iid), true);
  b.active = 'enemy';
  b.enemy.energy = 8;
  b.enemy.energyMax = 12;
  refresh(b);
  assert.equal(api.enemyAct(b), true, 'противник действует');
  assert.ok(foe.exhausted, 'и это была именно атака подавленного отряда');
});

test('слова-источники статусов не травят и не поджигают своего владельца', () => {
  const b = battleAt(2, [
    card('Отравитель', { atk: 2, hp: 8, keywords: ['poison:1'] }),
    card('Поджигатель', { atk: 2, hp: 8, keywords: ['burn:1'] }),
  ], [card('Враг 1', { hp: 12 }), card('Враг 2', { hp: 12 })]);
  const poisoner = putUnit(b, 'me', 'Отравитель', 0, 0);
  const burner = putUnit(b, 'me', 'Поджигатель', 0, 1);
  const victimA = putUnit(b, 'enemy', 'Враг 1', 0, 0);
  const victimB = putUnit(b, 'enemy', 'Враг 2', 0, 1);
  refresh(b);
  b.active = 'me';
  b.me.energy = 10;

  assert.equal(poisoner.st.poisons, 1, 'слово хранится как источник, а не как статус');
  assert.equal(poisoner.st.poison, undefined, 'сам он не отравлен');
  assert.equal(burner.st.burns, 1);
  assert.equal(burner.st.burn, undefined);

  assert.equal(api.attackWith(b, 'me', poisoner.iid), true);
  refresh(b);
  b.me.energy = 10;
  assert.equal(api.attackWith(b, 'me', burner.iid), true);
  assert.ok(victimA.st.poison > 0, 'цель отравлена');
  assert.ok(victimB.st.burn > 0, 'цель подожжена');

  const poisonerHp = poisoner.curHp;
  const burnerHp = burner.curHp;
  api.startTurn(b, 'enemy');
  api.startTurn(b, 'me');
  assert.equal(poisoner.curHp, poisonerHp, 'отравитель не получает урон от собственного яда');
  assert.equal(burner.curHp, burnerHp, 'поджигатель не горит от собственного слова');
  assert.equal(poisoner.st.poisons, 1, 'и слово при этом не стирается');
  assert.ok(b.log.some((l) => /урона от яда/u.test(l.text)), 'а цель — получает');
});

test('кузнец и словарь знают подавление, а «Несокрушимый» объяснён заново', () => {
  assert.ok(C.KEYWORD_INFO.suppress, 'слово есть в словаре');
  assert.equal(C.KEYWORD_INFO.suppress.name, 'Подавление');
  assert.match(C.KEYWORD_INFO.suppress.desc, /дорожает/u, 'в пояснении сказано, что это удорожание, а не запрет');
  assert.match(C.KEYWORD_INFO.unbreakable.desc, /подавлению/u, '«Несокрушимый» теперь гасит и подавление');
  assert.equal(api.STATUS_TXT.suppress, 'подавление', 'статус назван по-русски');

  const spell = (status) => C.validateCard({
    name: 'Залп', card_type: 'spell', era: 'ancient', emoji: '💥', drop_cost: 2, action_cost: 0, atk: 0, hp: 0,
    description: 'Накрывает огнём.', tags: [], abilities: [], keywords: [], monkey_paw: '',
    effects: [{ event: 'enter_play', target: { side: 'enemy', entity: 'unit', count: 1 }, action: { type: 'apply_status', status, amount: 2, turns: 2 } }],
  }, 'spell', ['ancient'], 'ordinary', 'none');
  assert.doesNotThrow(() => spell('suppress'), 'подавление — законный статус для манёвра');
  assert.doesNotThrow(() => spell('poison'));
  assert.throws(() => spell('panic'), /только poison, burn или suppress/u, 'неизвестный статус отклоняется');

  const condition = C.validateCard({
    name: 'Добивание', card_type: 'spell', era: 'ancient', emoji: '💥', drop_cost: 2, action_cost: 0, atk: 0, hp: 0,
    description: 'Бьёт по подавленным.', tags: [], abilities: [], keywords: [], monkey_paw: '',
    effects: [{
      event: 'enter_play', target: { side: 'enemy', entity: 'unit', count: 1 },
      condition: { type: 'target_status', status: 'suppress' }, action: { type: 'damage', amount: 2 },
    }],
  }, 'spell', ['ancient'], 'ordinary', 'none');
  assert.equal(condition.effects[0].condition.status, 'suppress', 'по подавленным можно ставить условие');

  assert.match(C.describeEffect({ event: 'enter_play', target: { side: 'enemy', entity: 'unit', count: 1 }, action: { type: 'apply_status', status: 'suppress', amount: 2, turns: 2 } }),
    /подавление/u, 'подпись эффекта называет статус по-русски');
});
