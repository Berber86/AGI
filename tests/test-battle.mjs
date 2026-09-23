import { suite, test, ok, eq, ne, ge, le } from './harness.mjs';
import {
  createBattle, startTurn, endTurn, resolveCombat, beginCombat, canAttack, canPlay, playCard,
  isAlive, unitAtk, unitHp, unitArmor, side, enemySide, makeBattleUnit, aggregateFx,
  dealDamage, damageLeader, legalBlockers, assignBlock, bulwarkHp, autoBlock, terrorLocked,
  boardRoom, maxBlocks, drawCards, predictCombat, predictUnblocked, predictDefense, cloneBattle,
  diagnoseBattle,
} from '../src/engine/battle.js';
import { autoplay } from '../src/engine/autoplay.js';
import { aiDeclareAttack, aiPlayOne } from '../src/engine/ai.js';
import { eraOf, RARITIES } from '../src/engine/gears.js';
import { generateCard } from '../src/engine/cardgen.js';
import { makeRng } from '../src/engine/rng.js';
import { generateWorld, buildRival, applyDifficulty } from '../src/engine/civ.js';

// --- фабрики -----------------------------------------------------------------
let seq = 0;
export function bp(name, atk, hp, cost = 1, kws = [], extra = {}) {
  return {
    key: `k:${name}`, name, atk, hp, cost, era: 1, domain: 'war', rarity: 'common',
    rarityColor: '#b9b9b9', archetype: 'Ударный', slots: 1, components: [], gears: [], gearCounts: {},
    keywords: kws.map((k) => ({ kw: k.kw || k.fx, name: k.name || k.fx, text: 't', fx: k.fx, lvl: k.lvl || 1, value: 1, from: 'mech+fire' })),
    unusedKeywords: [], blurb: '', power: 0, ...extra,
  };
}
const inst = (blueprint) => ({ id: `u${seq++}`, blueprint, xp: 0, battles: 0 });

export function mkBattle(meDeck = [], foeDeck = [], era = 1, opts = {}) {
  const b = createBattle({
    era, seed: opts.seed ?? 'test',
    sides: {
      me: { name: 'Игрок', deck: meDeck, isHuman: true, color: '#5c9e4f' },
      foe: { name: 'Враг', deck: foeDeck, isHuman: true, color: '#c8452f' },
    },
    first: opts.first ?? 'me',
  });
  startTurn(b);
  return b;
}

/** Ставит юнита сразу на поле, минуя руку и энергию. */
export function deploy(b, sideId, blueprint, opts = {}) {
  const u = makeBattleUnit(inst(blueprint), sideId);
  aggregateFx(u);
  u.sick = opts.sick ?? false;
  u.exhausted = opts.exhausted ?? false;
  if (opts.counters) { u.counters.atk += opts.counters[0]; u.counters.hp += opts.counters[1]; }
  side(b, sideId).board.push(u);
  return u;
}

function strike(b, attacker, blockers = []) {
  b.phase = 'main1';
  b.attacking = [attacker.uid];
  b.blockers = {};
  if (blockers.length) assignBlock(b, attacker.uid, blockers.map((x) => x.uid));
  resolveCombat(b);
}

// -----------------------------------------------------------------------------
suite('Бой: основа');

test('здоровье лидера берётся из настроек эпохи', () => {
  const deck = () => Array.from({ length: 8 }, (_, i) => inst(bp('ю' + i, 1, 1)));
  for (const era of [1, 2, 3, 4, 5, 6]) {
    const b = mkBattle(deck(), deck(), era);
    eq(b.sides.me.leader.maxHp, eraOf(era).leaderHp, `эпоха ${era}`);
    eq(b.sides.foe.leader.maxHp, eraOf(era).leaderHp);
    eq(b.sides.me.leader.hp, eraOf(era).leaderHp, 'колода не пуста — усталости нет');
    eq(b.cfg.slots, eraOf(era).slots);
    eq(b.cfg.energyCap, eraOf(era).energyCap);
  }
});

test('поздние эпохи дают больше HP, мест на поле и энергии', () => {
  const e1 = eraOf(1), e6 = eraOf(6);
  ok(e6.leaderHp > e1.leaderHp * 5, 'HP лидера должны вырасти кратно');
  ok(e6.slots > e1.slots);
  ok(e6.energyCap > e1.energyCap);
  ok(e6.deckSize > e1.deckSize);
});

test('энергия растёт на 1 каждый ход до потолка эпохи', () => {
  const deck = () => Array.from({ length: 40 }, (_, i) => inst(bp('ю' + i, 1, 1)));
  const b = mkBattle(deck(), deck(), 3);
  eq(side(b, 'me').maxEnergy, 1);
  const seen = [];
  for (let i = 0; i < 20 && !b.over; i++) { seen.push(side(b, b.active).maxEnergy); endTurn(b); }
  eq(seen[0], 1);
  eq(seen[1], 1, 'у соперника тоже первый ход');
  eq(seen[2], 2);
  ok(seen.some((v) => v === eraOf(3).energyCap), `должна достичь потолка ${eraOf(3).energyCap}, есть ${Math.max(...seen)}`);
  le(Math.max(...seen), eraOf(3).energyCap);
});

test('поле ограничено числом мест эпохи', () => {
  const b = mkBattle([], [], 1);
  eq(boardRoom(b, 'me'), eraOf(1).slots);
  for (let i = 0; i < eraOf(1).slots + 3; i++) deploy(b, 'me', bp('x', 1, 1));
  eq(side(b, 'me').board.length, eraOf(1).slots + 3, 'deploy() пишет напрямую — предел проверяет canPlay');
  const hand = bp('в руке', 1, 1);
  side(b, 'me').hand.push(makeBattleUnit(inst(hand), 'me'));
  const u = side(b, 'me').hand[0];
  aggregateFx(u);
  side(b, 'me').energy = 99;
  eq(canPlay(b, u), false, 'при полном поле выставлять нельзя');
});

test('рука ограничена, лишний добор сгорает', () => {
  const deck = Array.from({ length: 20 }, (_, i) => inst(bp('ю' + i, 1, 1)));
  const b = mkBattle(deck, [], 1);
  const s = side(b, 'me');
  for (let i = 0; i < 20; i++) drawCards(b, 'me', 1);
  le(s.hand.length, eraOf(1).handLimit);
});

test('болезнь выставления: юнит не атакует в свой первый ход', () => {
  const b = mkBattle([inst(bp('Новичок', 3, 3, 1))], [], 1);
  const s = side(b, 'me');
  s.energy = 5;
  const u = s.hand[0];
  ok(canPlay(b, u));
  playCard(b, u);
  eq(u.sick, true);
  eq(canAttack(b, u), false);
});

test('Рывок снимает болезнь выставления', () => {
  const b = mkBattle([], [], 1);
  const u = deploy(b, 'me', bp('Рывковый', 3, 3, 1, [{ fx: 'haste' }]), { sick: true });
  eq(canAttack(b, u), true);
});

test('атака после выставления возможна только со следующего хода', () => {
  const b = mkBattle([inst(bp('Новичок', 3, 3, 1))], [], 1);
  const s = side(b, 'me');
  s.energy = 5;
  const u = s.hand[0];
  playCard(b, u);
  endTurn(b);   // ход врага
  endTurn(b);   // снова наш ход
  const now = side(b, 'me').board[0];
  eq(now.uid, u.uid);
  eq(canAttack(b, now), true);
});

// -----------------------------------------------------------------------------
suite('Бой: урон и размены');

test('незаблокированный атакующий бьёт лидера', () => {
  const b = mkBattle([], []);
  const a = deploy(b, 'me', bp('Боец', 4, 3));
  const before = side(b, 'foe').leader.hp;
  strike(b, a);
  eq(before - side(b, 'foe').leader.hp, 4);
});

test('взаимный блок: оба юнита гибнут при равной силе', () => {
  const b = mkBattle([], []);
  const a = deploy(b, 'me', bp('А', 3, 3));
  const d = deploy(b, 'foe', bp('Д', 3, 3));
  strike(b, a, [d]);
  eq(isAlive(a), false);
  eq(isAlive(d), false);
  eq(side(b, 'foe').leader.hp, eraOf(1).leaderHp, 'лидер не должен пострадать');
});

test('боевой урон одновременный: погибший блокер успевает ударить', () => {
  const b = mkBattle([], []);
  const a = deploy(b, 'me', bp('А', 3, 3));
  const d = deploy(b, 'foe', bp('Д', 3, 3));
  strike(b, a, [d]);
  eq(isAlive(a), false, 'атакующий тоже должен погибнуть');
  eq(isAlive(d), false);
});

test('блокер сильнее — атакующий гибнет, блокер жив', () => {
  const b = mkBattle([], []);
  const a = deploy(b, 'me', bp('А', 2, 2));
  const d = deploy(b, 'foe', bp('Д', 5, 5));
  strike(b, a, [d]);
  eq(isAlive(a), false);
  eq(isAlive(d), true);
  eq(d.damage, 2);
});

test('Первый удар убивает блокера до ответного удара', () => {
  const b = mkBattle([], []);
  const a = deploy(b, 'me', bp('А', 3, 3, 1, [{ fx: 'firstStrike' }]));
  const d = deploy(b, 'foe', bp('Д', 3, 3));
  strike(b, a, [d]);
  eq(isAlive(a), true, 'атакующий с Первым ударом должен выжить');
  eq(isAlive(d), false);
});

test('Двойной удар бьёт в обе фазы', () => {
  const b = mkBattle([], []);
  const a = deploy(b, 'me', bp('А', 2, 4, 1, [{ fx: 'doubleStrike' }]));
  const d = deploy(b, 'foe', bp('Д', 1, 4));
  strike(b, a, [d]);
  eq(isAlive(d), false, '2 + 2 урона хватает на 4 здоровья');
  eq(isAlive(a), true);
  const b2 = mkBattle([], []);
  const a2 = deploy(b2, 'me', bp('А', 2, 4, 1, [{ fx: 'doubleStrike' }]));
  const d2 = deploy(b2, 'foe', bp('Д', 1, 5));
  strike(b2, a2, [d2]);
  eq(d2.damage, 4, 'Двойной удар обязан нанести урон дважды');
  eq(isAlive(d2), true);
});

test('Броня гасит урон, Пробитие её игнорирует', () => {
  const b1 = mkBattle([], []);
  const a1 = deploy(b1, 'me', bp('А', 3, 3));
  const d1 = deploy(b1, 'foe', bp('Д', 1, 6, 1, [{ fx: 'armor', lvl: 2 }]));
  eq(unitArmor(d1), 2);
  strike(b1, a1, [d1]);
  eq(d1.damage, 1, '3 урона − 2 брони');

  const b2 = mkBattle([], []);
  const a2 = deploy(b2, 'me', bp('А', 3, 3, 1, [{ fx: 'pierce' }]));
  const d2 = deploy(b2, 'foe', bp('Д', 1, 6, 1, [{ fx: 'armor', lvl: 2 }]));
  strike(b2, a2, [d2]);
  eq(d2.damage, 3, 'Пробитие игнорирует Броню');
});

test('Топот пропускает излишек в лидера', () => {
  const b = mkBattle([], []);
  const a = deploy(b, 'me', bp('А', 7, 5, 1, [{ fx: 'trample' }]));
  const d = deploy(b, 'foe', bp('Д', 1, 2));
  const before = side(b, 'foe').leader.hp;
  strike(b, a, [d]);
  eq(isAlive(d), false);
  eq(before - side(b, 'foe').leader.hp, 5, '7 − 2 здоровья блокера');
});

test('без Топота излишек теряется', () => {
  const b = mkBattle([], []);
  const a = deploy(b, 'me', bp('А', 7, 5));
  const d = deploy(b, 'foe', bp('Д', 1, 2));
  const before = side(b, 'foe').leader.hp;
  strike(b, a, [d]);
  eq(before - side(b, 'foe').leader.hp, 0);
});

test('Жизнеотдача лечит лидера', () => {
  const b = mkBattle([], []);
  damageLeader(b, 'me', 5);
  const a = deploy(b, 'me', bp('А', 4, 4, 1, [{ fx: 'lifelink' }]));
  const hp = side(b, 'me').leader.hp;
  strike(b, a);
  eq(side(b, 'me').leader.hp - hp, 4);
});

test('Смертельный удар уничтожает любым уроном', () => {
  const b = mkBattle([], []);
  const a = deploy(b, 'me', bp('А', 1, 1, 1, [{ fx: 'deathtouch' }]));
  const d = deploy(b, 'foe', bp('Д', 1, 9));
  strike(b, a, [d]);
  eq(isAlive(d), false);
});

test('Шипы возвращают урон атакующему', () => {
  const b = mkBattle([], []);
  const a = deploy(b, 'me', bp('А', 2, 6));
  const d = deploy(b, 'foe', bp('Д', 1, 6, 1, [{ fx: 'thorns', lvl: 2 }]));
  strike(b, a, [d]);
  eq(a.damage, 1 + 2, 'урон блокера + шипы');
  eq(d.damage, 2);
});

test('Бдительность: юнит не истощается после атаки', () => {
  const b = mkBattle([], []);
  const a = deploy(b, 'me', bp('А', 2, 2, 1, [{ fx: 'vigilance' }]));
  strike(b, a);
  eq(a.exhausted, false);
  const a2 = deploy(b, 'me', bp('Б', 2, 2));
  b.phase = 'main1'; b.attacking = [a2.uid]; b.blockers = {}; resolveCombat(b);
  eq(a2.exhausted, true);
});

test('Стратег блокирует двоих', () => {
  const b = mkBattle([], []);
  const d = deploy(b, 'foe', bp('Стратег', 1, 8, 1, [{ fx: 'tactician' }]));
  const plain = deploy(b, 'foe', bp('Обычный', 1, 8));
  const a1 = deploy(b, 'me', bp('А1', 1, 1));
  const a2 = deploy(b, 'me', bp('А2', 1, 1));
  eq(maxBlocks(d), 2);
  eq(maxBlocks(plain), 1);
  b.phase = 'combatDeclare';
  b.attacking = [a1.uid, a2.uid];
  b.blockers = {};
  assignBlock(b, a1.uid, [d.uid]);
  assignBlock(b, a2.uid, [d.uid]);
  eq(b.blockers[a1.uid].length, 1);
  eq(b.blockers[a2.uid].length, 1, 'Стратег держит обоих');
});

test('обычный юнит не может блокировать двоих', () => {
  const b = mkBattle([], []);
  const d = deploy(b, 'foe', bp('Обычный', 1, 8));
  const a1 = deploy(b, 'me', bp('А1', 1, 1));
  const a2 = deploy(b, 'me', bp('А2', 1, 1));
  b.phase = 'combatDeclare';
  b.attacking = [a1.uid, a2.uid];
  assignBlock(b, a1.uid, [d.uid]);
  b.blockers[a2.uid] = [d.uid]; // вручную, в обход ограничений
  // autoBlock/assignBlock для второго атакующего должен отказать
  const okAssign = assignBlock(b, a2.uid, [d.uid]);
  eq(okAssign, true, 'assignBlock возвращает true, но список чистится');
  eq(b.blockers[a2.uid].length, 0, 'юнит уже занят первым атакующим');
});

// -----------------------------------------------------------------------------
suite('Бой: Осадный и Захват');

test('Осадного не блокирует обычный юнит', () => {
  const b = mkBattle([], []);
  const a = deploy(b, 'me', bp('Осадный', 3, 2, 1, [{ fx: 'siege' }]));
  const d = deploy(b, 'foe', bp('Обычный', 3, 3));
  eq(legalBlockers(b, a).includes(d), false);
  strike(b, a);
  eq(isAlive(d), true);
  ok(side(b, 'foe').leader.hp < eraOf(1).leaderHp);
});

test('Захват блокирует Осадного', () => {
  const b = mkBattle([], []);
  const a = deploy(b, 'me', bp('Осадный', 3, 2, 1, [{ fx: 'siege' }]));
  const d = deploy(b, 'foe', bp('Пво', 3, 3, 1, [{ fx: 'reach' }]));
  eq(legalBlockers(b, a).includes(d), true);
  strike(b, a, [d]);
  eq(side(b, 'foe').leader.hp, eraOf(1).leaderHp);
});

// -----------------------------------------------------------------------------
suite('Бой: выживание и триггеры');

test('Несокрушимость держит обычный урон, но не двойной', () => {
  const b = mkBattle([], []);
  const d = deploy(b, 'foe', bp('Несокрушимый', 1, 4, 1, [{ fx: 'indestructible' }]));
  const a = deploy(b, 'me', bp('А', 5, 5));
  strike(b, a, [d]);
  eq(isAlive(d), true, 'не должен умереть от 5 урона при 4 здоровья');
  const a2 = deploy(b, 'me', bp('Б', 5, 5));
  b.phase = 'main1'; b.attacking = [a2.uid]; b.blockers = {}; assignBlock(b, a2.uid, [d.uid]); resolveCombat(b);
  eq(isAlive(d), false, 'суммарно ≥ 2× здоровья — разрушается');
});

test('Регенерация спасает один раз за бой', () => {
  const b = mkBattle([], []);
  const d = deploy(b, 'foe', bp('Реген', 1, 2, 1, [{ fx: 'regenerate' }]));
  const a = deploy(b, 'me', bp('А', 5, 5));
  strike(b, a, [d]);
  eq(isAlive(d), true);
  eq(d.damage, 0);
  eq(d.regenUsed, true);
  eq(d.exhausted, true, 'Регенерация истощает юнита');
  const a2 = deploy(b, 'me', bp('Б', 5, 5));
  d.exhausted = false;   // следующий ход: юнит развернулся
  b.phase = 'main1'; b.attacking = [a2.uid]; b.blockers = {}; assignBlock(b, a2.uid, [d.uid]); resolveCombat(b);
  eq(isAlive(d), false, 'второй раз Регенерация не спасает');
});

test('Сборка (при выходе) добирает карту', () => {
  const deck = [inst(bp('А', 1, 1)), inst(bp('Б', 1, 1)), inst(bp('В', 1, 1))];
  const b = mkBattle(deck, [], 1);
  const s = side(b, 'me');
  const before = s.hand.length;
  const u = makeBattleUnit(inst(bp('Сборщик', 1, 1, 1, [{ fx: 'etbDraw' }])), 'me');
  aggregateFx(u);
  s.hand.push(u);
  s.energy = 5;
  playCard(b, u);
  eq(s.hand.length, before + 1, 'карта сыграна (−1) и добрана (+1)');
  eq(s.deck.length, 3 - before - 1);
});

test('Логистика даёт энергию в ход выставления', () => {
  const b = mkBattle([], [], 1);
  const s = side(b, 'me');
  s.energy = 3;
  const u = makeBattleUnit(inst(bp('Логист', 1, 1, 1, [{ fx: 'etbEnergy', lvl: 2 }])), 'me');
  aggregateFx(u);
  s.hand.push(u);
  playCard(b, u);
  eq(s.energy, 4, '3 − 1 цена + 2 от Логистики');
});

test('Разряд при гибели бьёт врага', () => {
  const b = mkBattle([], []);
  const a = deploy(b, 'me', bp('Разрядник', 1, 1, 1, [{ fx: 'deathZap', lvl: 3 }]));
  const d = deploy(b, 'foe', bp('Д', 5, 5));
  const d2 = deploy(b, 'foe', bp('Д2', 5, 5));
  b.phase = 'main1'; b.attacking = [a.uid]; b.blockers = {};
  assignBlock(b, a.uid, [d.uid]);
  resolveCombat(b);
  eq(isAlive(a), false);
  eq(d.damage + d2.damage, 4, '1 урон от атаки + 3 от Разряда (в случайную цель)');
});

test('Пожар при гибели задевает всех врагов', () => {
  const b = mkBattle([], []);
  const a = deploy(b, 'me', bp('Горючий', 1, 1, 1, [{ fx: 'deathWildfire', lvl: 2 }]));
  const d1 = deploy(b, 'foe', bp('Д1', 1, 9));
  const d2 = deploy(b, 'foe', bp('Д2', 1, 9));
  b.phase = 'main1'; b.attacking = [a.uid]; b.blockers = {}; assignBlock(b, a.uid, [d1.uid]); resolveCombat(b);
  ge(d1.damage, 2);
  ge(d2.damage, 2);
});

test('Отзыв возвращает павшего в руку один раз', () => {
  const b = mkBattle([], []);
  const a = deploy(b, 'me', bp('Отзывной', 1, 1, 1, [{ fx: 'deathRecall' }]));
  const d = deploy(b, 'foe', bp('Д', 5, 5));
  strike(b, a, [d]);
  eq(isAlive(a), true, 'не погиб');
  ok(side(b, 'me').hand.includes(a), 'вернулся в руку');
  eq(side(b, 'me').board.includes(a), false);
});

test('Рой создаёт токен при выходе', () => {
  const b = mkBattle([], [], 1);
  const s = side(b, 'me');
  const u = makeBattleUnit(inst(bp('Роевик', 1, 1, 1, [{ fx: 'etbSwarm' }])), 'me');
  aggregateFx(u);
  s.hand.push(u); s.energy = 5;
  playCard(b, u);
  eq(s.board.length, 2);
  eq(s.board[1].token, true);
  eq(s.board[1].atk, 1);
});

test('Горение тикает в конце хода', () => {
  const b = mkBattle([], []);
  const a = deploy(b, 'me', bp('Поджигатель', 2, 5, 1, [{ fx: 'ignite', lvl: 1 }]));
  const d = deploy(b, 'foe', bp('Д', 1, 9));
  strike(b, a, [d]);
  eq(d.burning, 1);
  endTurn(b);           // ход врага
  endTurn(b);           // конец нашего хода тикает горение у наших юнитов; у вражеских — в его конце
  ge(d.damage, 2, 'горение должно накопить урон');
});

test('Мор бьёт по всем врагам в конце хода', () => {
  const b = mkBattle([], []);
  deploy(b, 'me', bp('Моровой', 1, 5, 1, [{ fx: 'endPlague', lvl: 1 }]));
  const d1 = deploy(b, 'foe', bp('Д1', 1, 5));
  const d2 = deploy(b, 'foe', bp('Д2', 1, 5));
  endTurn(b);
  ge(d1.damage, 1);
  ge(d2.damage, 1);
});

test('Усталость от пустой колоды растёт и бьёт лидера', () => {
  const b = mkBattle([], [], 1);
  const s = side(b, 'me');
  s.deck = []; s.fatigue = 0; s.leader.hp = s.leader.maxHp;
  const hp0 = s.leader.hp;
  drawCards(b, 'me', 1);
  eq(s.fatigue, 1);
  eq(hp0 - s.leader.hp, 1);
  drawCards(b, 'me', 1);
  eq(s.fatigue, 2);
  eq(hp0 - s.leader.hp, 3);
});

test('бой заканчивается, когда лидер падает', () => {
  const b = mkBattle([], []);
  damageLeader(b, 'foe', 999);
  ok(b.over);
  eq(b.over.winner, 'me');
});

test('броня лидера гасит урон и не восстанавливается', () => {
  const b = mkBattle([], []);
  const s = side(b, 'me');
  s.leader.armor = 3;
  const hp = s.leader.hp;
  damageLeader(b, 'me', 5);
  eq(s.leader.armor, 0);
  eq(hp - s.leader.hp, 2);
});

// -----------------------------------------------------------------------------
suite('Бой: ауры и условные свойства');

test('Бастион даёт соседям здоровье', () => {
  const b = mkBattle([], []);
  const left = deploy(b, 'me', bp('Левый', 1, 3));
  const mid = deploy(b, 'me', bp('Бастион', 1, 5, 1, [{ fx: 'bulwark' }]));
  const right = deploy(b, 'me', bp('Правый', 1, 3));
  eq(bulwarkHp(b, left), 1);
  eq(bulwarkHp(b, right), 1);
  eq(bulwarkHp(b, mid), 0);
});

test('Связь даёт прочим союзникам атаку', () => {
  const b = mkBattle([], []);
  deploy(b, 'me', bp('Связной', 1, 3, 1, [{ fx: 'bond' }]));
  const other = deploy(b, 'me', bp('Прочий', 2, 3));
  eq(unitAtk(b, other), 3);
});

test('Фанатизм включается на половине здоровья лидера', () => {
  const b = mkBattle([], []);
  const u = deploy(b, 'me', bp('Фанатик', 2, 3, 1, [{ fx: 'zeal' }]));
  eq(unitAtk(b, u), 2);
  damageLeader(b, 'me', Math.ceil(side(b, 'me').leader.maxHp / 2));
  eq(unitAtk(b, u), 4);
});

test('Ужас не пускает в атаку юнитов с атакой ≤ 1', () => {
  const b = mkBattle([], []);
  const weak = deploy(b, 'me', bp('Слабак', 1, 3));
  const strong = deploy(b, 'me', bp('Силач', 4, 3));
  deploy(b, 'foe', bp('Ужас', 1, 3, 1, [{ fx: 'terror' }]));
  eq(terrorLocked(b, weak), true);
  eq(canAttack(b, weak), false);
  eq(canAttack(b, strong), true);
});

test('Рост даёт +1/+1 в начале своего хода', () => {
  const b = mkBattle([], []);
  const u = deploy(b, 'me', bp('Растущий', 1, 1, 1, [{ fx: 'growth' }]));
  eq(unitAtk(b, u), 1);
  endTurn(b); endTurn(b);
  ge(unitAtk(b, u), 2);
});

// -----------------------------------------------------------------------------
suite('Бой: автобой и детерминизм');

test('автобой всегда завершается', () => {
  for (const era of [1, 3, 6]) {
    const world = generateWorld('term', 1);
    const region = world.regions.find((r) => r.era === era);
    const rng = makeRng('term' + era);
    const me = buildRival(region, rng.fork('a'), 1);
    const foe = buildRival(region, rng.fork('b'), 1);
    me.isHuman = false; foe.isHuman = false;
    const b = createBattle({ era, seed: 'term' + era, sides: { me, foe }, first: 'me' });
    autoplay(b);
    ok(b.over, `эпоха ${era}: бой не завершился`);
    ok(['me', 'foe', 'draw'].includes(b.over.winner));
    le(b.round, 40, 'внезапная смерть должна обрывать затяжные бои');
  }
});

test('один и тот же сид ⇒ один и тот же бой', () => {
  const run = () => {
    const world = generateWorld('det', 1);
    const region = world.regions.find((r) => r.era === 3);
    const rng = makeRng('det3');
    const me = buildRival(region, rng.fork('a'), 1);
    const foe = buildRival(region, rng.fork('b'), 1);
    me.isHuman = false; foe.isHuman = false;
    const b = createBattle({ era: 3, seed: 'det3', sides: { me, foe }, first: 'me' });
    autoplay(b);
    return `${b.over.winner}:${b.round}:${b.sides.me.leader.hp}:${b.sides.foe.leader.hp}:${b.sides.me.grave.length}`;
  };
  eq(run(), run());
});

test('соперник собирается тем же генератором и его колода валидна', () => {
  const world = generateWorld('rivals', 1);
  for (const region of world.regions) {
    const rival = buildRival(region, makeRng('r' + region.id), 1);
    eq(rival.deck.length, eraOf(region.era).deckSize, `${region.name}: размер колоды`);
    for (const u of rival.deck) {
      ok(u.blueprint && u.blueprint.name, 'у соперника нет имени юнита');
      ge(u.blueprint.hp, 1);
      ge(u.blueprint.cost, 1);
      le(u.blueprint.cost, eraOf(region.era).energyCap);
      ok([1, 2, 3, 4].includes(u.blueprint.slots));
    }
  }
});

test('ИИ объявляет атаку только теми, кто может атаковать', () => {
  const world = generateWorld('ai1', 1);
  const region = world.regions.find((r) => r.era === 2);
  const rng = makeRng('ai1');
  const a = buildRival(region, rng, 1);
  const c = buildRival(region, rng.fork('m'), 1);
  a.isHuman = false; c.isHuman = false;
  const b = createBattle({ era: 2, seed: 'ai1', sides: { me: a, foe: c }, first: 'me' });
  startTurn(b);
  for (let i = 0; i < 6 && !b.over; i++) {
    let p = 0;
    while (aiPlayOne(b, 'me') && p++ < 12) { /* выставление */ }
    const attackers = aiDeclareAttack(b, 'me');
    for (const id of attackers) {
      const u = side(b, 'me').board.find((x) => x.uid === id);
      ok(u, 'ИИ атакует несуществующим юнитом');
      ok(canAttack(b, u), `ИИ атакует юнитом, который не может атаковать: ${u.name}`);
    }
    resolveCombat(b);
    if (b.over) break;
    endTurn(b);
    if (b.active !== 'me') { let q = 0; while (aiPlayOne(b, 'foe') && q++ < 12) { /* */ } aiDeclareAttack(b, 'foe'); resolveCombat(b); if (b.over) break; endTurn(b); }
  }
  ok(true);
});

test('автоблок защищает от летала, когда это возможно', () => {
  const b = mkBattle([], [], 1);
  const s = side(b, 'foe');
  s.leader.hp = 2;
  const atk = deploy(b, 'me', bp('А', 5, 5));
  const wall = deploy(b, 'foe', bp('Стена', 1, 9));
  b.phase = 'combatDeclare';
  b.attacking = [atk.uid];
  b.blockers = {};
  autoBlock(b, 'foe');
  eq((b.blockers[atk.uid] || []).length, 1, 'при летале ИИ обязан блокировать');
  eq(b.blockers[atk.uid][0], wall.uid);
});


// --- прогноз боя -------------------------------------------------------------
suite('Бой: прогноз (predictCombat)');

/**
 * Прогоняет сценарий дважды — сначала прогнозом, затем настоящим боем —
 * и сверяет урон лидерам и списки потерь. Прогноз обязан совпадать точно,
 * иначе интерфейс будет обещать игроку не то, что случится.
 */
function assertPrediction(name, setup, blocksFor) {
  const mk = () => {
    const b = mkBattle([], [], 1);
    const ids = setup(b);
    b.phase = 'main1';
    b.attacking = ids.atk;
    return { b, ids };
  };

  const { b: pb, ids: pids } = mk();
  const blocks = blocksFor(pids);
  const beforeP = { me: pb.sides.me.leader.hp, foe: pb.sides.foe.leader.hp };
  const p = predictCombat(pb, blocks);

  const { b: rb, ids: rids } = mk();
  const beforeR = { me: rb.sides.me.leader.hp, foe: rb.sides.foe.leader.hp };
  rb.blockers = {};
  for (const [aid, list] of Object.entries(blocksFor(rids))) if (list.length) assignBlock(rb, aid, list);
  resolveCombat(rb);
  const realLoss = { me: rb.sides.me.grave.map((u) => u.name), foe: rb.sides.foe.grave.map((u) => u.name) };

  eq(p.leaderDelta.me, rb.sides.me.leader.hp - beforeR.me, `${name}: урон моему лидеру`);
  eq(p.leaderDelta.foe, rb.sides.foe.leader.hp - beforeR.foe, `${name}: урон лидеру соперника`);
  eq(beforeP.me, beforeR.me, `${name}: прогноз не изменил живой бой`);
  eq(p.losses.me.map((x) => x.name).sort().join(','), realLoss.me.sort().join(','), `${name}: мои потери`);
  eq(p.losses.foe.map((x) => x.name).sort().join(','), realLoss.foe.sort().join(','), `${name}: потери соперника`);
}

test('прогноз совпадает с настоящим боем: атака без блока', () => {
  assertPrediction('без блока', (b) => ({ atk: [deploy(b, 'me', bp('А', 4, 4)).uid] }), () => ({}));
});

test('прогноз совпадает: взаимный размен через блок', () => {
  assertPrediction('размен', (b) => {
    const a = deploy(b, 'me', bp('А', 4, 4));
    const d = deploy(b, 'foe', bp('Д', 4, 4));
    return { atk: [a.uid], d };
  }, (ids) => ({ [ids.atk[0]]: [ids.d.uid] }));
});

test('прогноз совпадает: Топот пропускает избыток в лидера', () => {
  assertPrediction('топот', (b) => {
    const a = deploy(b, 'me', bp('А', 7, 4, 1, [{ fx: 'trample' }]));
    const d = deploy(b, 'foe', bp('Д', 1, 2));
    return { atk: [a.uid], d };
  }, (ids) => ({ [ids.atk[0]]: [ids.d.uid] }));
});

test('прогноз совпадает: Первый удар убивает блокера до ответного удара', () => {
  assertPrediction('первый удар', (b) => {
    const a = deploy(b, 'me', bp('А', 3, 3, 1, [{ fx: 'firstStrike' }]));
    const d = deploy(b, 'foe', bp('Д', 3, 3));
    return { atk: [a.uid], d };
  }, (ids) => ({ [ids.atk[0]]: [ids.d.uid] }));
});

test('прогноз совпадает: Двойной удар бьёт дважды', () => {
  assertPrediction('двойной удар', (b) => {
    const a = deploy(b, 'me', bp('А', 2, 4, 1, [{ fx: 'doubleStrike' }]));
    const d = deploy(b, 'foe', bp('Д', 1, 4));
    return { atk: [a.uid], d };
  }, (ids) => ({ [ids.atk[0]]: [ids.d.uid] }));
});

test('прогноз совпадает: Шипы возвращают урон атакующему', () => {
  assertPrediction('шипы', (b) => {
    const a = deploy(b, 'me', bp('А', 2, 2));
    const d = deploy(b, 'foe', bp('Д', 1, 6, 1, [{ fx: 'thorns', lvl: 2 }]));
    return { atk: [a.uid], d };
  }, (ids) => ({ [ids.atk[0]]: [ids.d.uid] }));
});

test('прогноз совпадает: два атакующих, Стратег блокирует двоих', () => {
  assertPrediction('стратег', (b) => {
    const a1 = deploy(b, 'me', bp('А1', 3, 3));
    const a2 = deploy(b, 'me', bp('А2', 2, 2));
    const wall = deploy(b, 'foe', bp('Стратег', 2, 8, 1, [{ fx: 'tactician' }]));
    return { atk: [a1.uid, a2.uid], wall };
  }, (ids) => ({ [ids.atk[0]]: [ids.wall.uid], [ids.atk[1]]: [ids.wall.uid] }));
});

test('прогноз не мутирует живой бой и не тратит его случайность', () => {
  const b = mkBattle([], [], 1);
  const a = deploy(b, 'me', bp('А', 4, 4));
  deploy(b, 'foe', bp('Д', 2, 5));
  b.phase = 'main1'; b.attacking = [a.uid];
  const hpMe = b.sides.me.leader.hp, hpFoe = b.sides.foe.leader.hp;
  const logLen = b.log.length;
  const dmgBefore = b.sides.foe.board.map((u) => u.damage).join(',');
  for (let i = 0; i < 5; i++) predictCombat(b, {});
  eq(b.sides.me.leader.hp, hpMe);
  eq(b.sides.foe.leader.hp, hpFoe);
  eq(b.log.length, logLen, 'прогноз не пишет в журнал настоящего боя');
  eq(b.sides.foe.board.map((u) => u.damage).join(','), dmgBefore);
  eq(b.blockers && Object.keys(b.blockers).length, 0, 'прогноз не назначает блоки в настоящем бою');
});

test('клон боя независим: ГПСЧ отдельный, данные равны', () => {
  const b = mkBattle([], [], 2);
  deploy(b, 'me', bp('А', 3, 3));
  const c = cloneBattle(b, 'test');
  ne(c, b);
  eq(c.sides.me.board.length, b.sides.me.board.length);
  eq(c.sides.me.board[0].uid, b.sides.me.board[0].uid, 'uid сохраняются — по ним интерфейс ищет ячейки');
  eq(c.__clone, true);
  // Эталон — второй такой же бой (mkBattle детерминирован по сиду 'test'),
  // чей ГПСЧ никто не трогал. Прогоняем клон и прогноз, затем сверяем потоки.
  const ref = mkBattle([], [], 2);
  deploy(ref, 'me', bp('А', 3, 3));
  for (let i = 0; i < 5; i++) { c.rng.int(1e6); predictCombat(b, {}); }
  eq(b.rng.int(1e6), ref.rng.int(1e6), 'ГПСЧ настоящего боя не сдвинут ни клоном, ни прогнозом');
});

test('predictUnblocked считает суммарный урон лидеру без блоков', () => {
  const b = mkBattle([], [], 1);
  const a = deploy(b, 'me', bp('А', 4, 4));
  const c = deploy(b, 'me', bp('Б', 3, 3));
  const sick = deploy(b, 'me', bp('В', 9, 9));
  b.phase = 'main1'; b.attacking = [a.uid, c.uid];
  const p = predictUnblocked(b);
  eq(p.dmg, 7);
  eq(p.count, 2);
  eq(p.names.join(','), 'А,Б');
  // юнит не в списке атакующих не учитывается
  eq(predictUnblocked(b, [sick.uid]).dmg, 9);
  eq(predictUnblocked(b, []).dmg, 0);
});

test('predictUnblocked учитывает Двойной удар: юнит бьёт лидера дважды', () => {
  const b = mkBattle([], [], 1);
  const twin = deploy(b, 'me', bp('Двойник', 3, 3, 1, [{ fx: 'doubleStrike' }]));
  const first = deploy(b, 'me', bp('Первый', 4, 4, 1, [{ fx: 'firstStrike' }]));
  b.phase = 'main1'; b.attacking = [twin.uid, first.uid];
  const p = predictUnblocked(b);
  // Двойной удар проходит оба фильтра dealRound → 3+3, Первый удар меняет порядок, не сумму → 4
  eq(p.gross, 10, 'сумма урона: 3×2 + 4');
  eq(p.dmg, 10);
  ok(p.names.some((n) => n.includes('×2')), 'двойной удар помечен в списке: ' + p.names.join(', '));

  // сверяем с настоящим боем без блоков
  const b2 = mkBattle([], [], 1);
  const t2 = deploy(b2, 'me', bp('Двойник', 3, 3, 1, [{ fx: 'doubleStrike' }]));
  const f2 = deploy(b2, 'me', bp('Первый', 4, 4, 1, [{ fx: 'firstStrike' }]));
  b2.phase = 'main1'; b2.attacking = [t2.uid, f2.uid]; b2.blockers = {};
  const hpBefore = side(b2, 'foe').leader.hp;
  resolveCombat(b2);
  eq(hpBefore - side(b2, 'foe').leader.hp, 10, 'прогноз совпал с реальным уроном лидеру');
});

test('predictUnblocked вычитает броню лидера, которую гасит damageLeader', () => {
  const b = mkBattle([], [], 1);
  const a = deploy(b, 'me', bp('А', 5, 5));
  side(b, 'foe').leader.armor = 3;
  b.phase = 'main1'; b.attacking = [a.uid];
  const p = predictUnblocked(b);
  eq(p.gross, 5, 'валовый урон');
  eq(p.absorbed, 3, 'броня поглотила 3');
  eq(p.dmg, 2, 'лидеру дойдёт 2');
  eq(p.armorLeft, 0, 'броня израсходована');

  const hpBefore = side(b, 'foe').leader.hp;
  resolveCombat(b);
  eq(hpBefore - side(b, 'foe').leader.hp, p.dmg, 'прогноз совпал с боем');
});

test('predictCombat не подменяет блоки автоблоком, когда защищается ИИ', () => {
  // resolveCombat сам ставит автоблок при defSide.isHuman === false. Прогноз
  // обязан показывать назначение игрока, а не чужую расстановку: иначе на этапе
  // атаки интерфейс обещает урон, которого в бою не будет.
  const mk = () => {
    const b = mkBattle([], [], 1);
    side(b, 'foe').isHuman = false;              // защищается ИИ
    const a = deploy(b, 'me', bp('Атакующий', 4, 4));
    deploy(b, 'foe', bp('Заступник', 2, 5));     // ИИ закрыл бы им
    b.phase = 'combatDeclare'; b.active = 'me'; b.attacking = [a.uid]; b.blockers = {};
    return b;
  };

  const snap = predictCombat(mk(), {});          // «блокировать нечем/не будем»
  eq(snap.leaderDelta.foe, -4, 'без блоков весь урон уходит лидеру ИИ');
  eq(snap.damageToDefender, 4);
  eq(snap.blocked, false, 'автоблок не подставился');

  // а если игрок сам назначил блок — прогноз обязан показать именно его
  const b2 = mk();
  const blocker = side(b2, 'foe').board[0];
  const snap2 = predictCombat(b2, { [b2.attacking[0]]: [blocker.uid] });
  eq(snap2.blocked, true, 'назначение игрока принято');
  eq(snap2.leaderDelta.foe, 0, 'урон лидеру не прошёл — его закрыли');
  ok(snap2.wounded.some((w) => w.uid === blocker.uid), 'урон получил именно назначенный блокер');

  // клон не должен испортить настоящий бой
  const b3 = mk();
  predictCombat(b3, {});
  eq(Object.keys(b3.blockers).length, 0, 'b.blockers не тронут прогнозом');
});

test('predictDefense совпадает с настоящим боем, где защищается ИИ', () => {
  // resolveCombat сам назначает автоблок при defSide.isHuman === false, поэтому
  // прогноз «без блока» не совпадёт с реальностью. predictDefense обязан совпасть.
  const mk = () => {
    const b = mkBattle([], [], 1);
    side(b, 'foe').isHuman = false;
    const a1 = deploy(b, 'me', bp('Таран', 6, 4));
    const a2 = deploy(b, 'me', bp('Лучник', 2, 2));
    deploy(b, 'foe', bp('Заступник', 2, 7));
    deploy(b, 'foe', bp('Стенка', 1, 9));
    b.phase = 'combatDeclare'; b.active = 'me'; b.attacking = [a1.uid, a2.uid]; b.blockers = {};
    return b;
  };

  const p = predictDefense(mk());
  ok(p.blocked, 'ИИ выставил блоки');
  ok(Array.isArray(p.plan) && p.plan.length > 0, 'план расстановки возвращён');
  ok(p.plan.every((x) => x.attackerName && x.blockers.length), 'в плане есть имена: ' + JSON.stringify(p.plan));

  // сверяем с настоящим боем
  const real = mk();
  const hpFoe = side(real, 'foe').leader.hp;
  const hpMe = side(real, 'me').leader.hp;
  resolveCombat(real);
  eq(side(real, 'foe').leader.hp - hpFoe, p.leaderDelta.foe, 'урон лидеру ИИ совпал');
  eq(side(real, 'me').leader.hp - hpMe, p.leaderDelta.me, 'ответный урон нашему лидеру совпал');

  // потери тоже обязаны совпасть
  const realDeadFoe = side(real, 'foe').grave.length;
  eq(p.losses.foe.length, realDeadFoe, 'число павших у соперника совпало');

  // настоящий бой не тронут прогнозом
  const untouched = mk();
  predictDefense(untouched);
  eq(Object.keys(untouched.blockers).length, 0, 'b.blockers не изменён');
  eq(side(untouched, 'foe').leader.hp, eraOf(1).leaderHp, 'здоровье лидера не тронуто');
});

test('predictDefense и predictCombat расходятся там, где ИИ блокирует', () => {
  const mk = () => {
    const b = mkBattle([], [], 1);
    side(b, 'foe').isHuman = false;
    const a = deploy(b, 'me', bp('Таран', 6, 4));
    deploy(b, 'foe', bp('Заступник', 2, 7));
    b.phase = 'combatDeclare'; b.active = 'me'; b.attacking = [a.uid]; b.blockers = {};
    return b;
  };
  const free = predictCombat(mk(), {});
  const defended = predictDefense(mk());
  eq(free.leaderDelta.foe, -6, 'без блока весь урон лидеру');
  eq(defended.leaderDelta.foe, 0, 'ИИ закрыл — лидеру не дошло');
  eq(free.blocked, false);
  eq(defended.blocked, true);
  // damageToDefender считает урон по всей стороне (юниты + лидер), поэтому
  // совпадать суммы вправе: 6 в лидера и 6 в блокера — разные раскладки
  eq(free.damageToDefender, 6);
  eq(defended.damageToDefender, 6);
  eq(free.wounded.filter((w) => w.side === 'foe').length, 0, 'без блока юниты соперника целы');
  ok(defended.wounded.some((w) => w.side === 'foe' && w.name === 'Заступник'),
    'при блоке урон принял на себя Заступник');
});

test('diagnoseBattle объясняет поражение и называет источник урона', () => {
  const b = mkBattle([], [], 1);
  const a = deploy(b, 'me', bp('Таран', 5, 5));
  const wall = deploy(b, 'foe', bp('Стенолом', 7, 8));
  b.phase = 'combatDeclare'; b.active = 'foe'; b.attacking = [wall.uid]; b.blockers = {};
  side(b, 'me').isHuman = true; side(b, 'foe').isHuman = true;
  // два удара в лидера: 7 + 7 = 14 из 22
  resolveCombat(b);
  b.phase = 'combatDeclare'; b.attacking = [wall.uid]; b.blockers = {};
  side(b, 'foe').board.push(deploy(b, 'foe', bp('Подмога', 1, 1)));
  resolveCombat(b);
  // добиваем напрямую, чтобы бой завершился
  damageLeader(b, 'me', side(b, 'me').leader.hp);
  ok(b.over, 'бой завершён');

  const d = diagnoseBattle(b);
  eq(d.winner, 'foe', 'победитель определён');
  ok(d.verdict.length >= 1, 'есть хотя бы одна строка вердикта');
  ok(d.verdict.some((v) => v.includes('Ваш лидер пал')), 'вердикт говорит о падении лидера');
  ok(d.topDamage.me.some((t) => t.name === 'Стенолом' && t.total >= 7),
    'урон приписан конкретному юниту: ' + JSON.stringify(d.topDamage.me.slice(0, 3)));
  ok(d.advice.length >= 1, 'есть совет, что исправить');
  eq(d.margin.me, 0, 'здоровье павшего лидера — ноль');
  ok(!d.verdict.some((v) => v.includes('undefined')), 'в вердикте нет undefined');
  ok(!d.verdict.some((v) => /нанесла «[^УВ]/.test(v)), 'согласование рода верно: ' + d.verdict.join(' | '));
});

test('diagnoseBattle отмечает Усталость и внезапную смерть', () => {
  const deck = Array.from({ length: 2 }, (_, i) => ({ id: 'd' + i, blueprint: bp('ю' + i, 1, 1), xp: 0, battles: 0 }));
  const b = mkBattle(deck, deck, 1);
  // выжигаем колоду СОПЕРНИКА: каждый пустой добор растит его Усталость
  for (let i = 0; i < 6 && !b.over; i++) drawCards(b, 'foe', 3);
  ge(side(b, 'foe').fatigue, 1, 'Усталость накоплена у соперника');
  b.round = 22;                                  // имитируем затяжной бой
  if (!b.over) damageLeader(b, 'foe', side(b, 'foe').leader.hp);
  const d = diagnoseBattle(b);
  eq(d.winner, 'me', 'соперник пал — от Усталости или добивания');
  ok(d.suddenDeath, 'внезапная смерть отмечена при round >= 21');
  ok(d.verdict.some((v) => v.includes('внезапной смерти')), 'вердикт упоминает внезапную смерть');
  ok(d.verdict.some((v) => v.includes('Усталость')), 'вердикт упоминает Усталость');
  eq(d.fatigue.foe, side(b, 'foe').fatigue, 'Усталость соперника передана в разбор');
});

test('diagnoseBattle не падает на бою без журнала урона', () => {
  const b = mkBattle([], [], 1);
  damageLeader(b, 'me', side(b, 'me').leader.hp);
  const d = diagnoseBattle(b);
  eq(d.winner, 'foe');
  ok(Array.isArray(d.topDamage.me), 'список источников всегда массив');
  // damageLeader без источника пишет строку без «— …»; такой урон не должен
  // всплывать чипом «неизвестно» в разборе
  ok(!d.topDamage.me.some((t) => t.name === 'неизвестно'), 'неприписанный урон не показывается');
  ok(d.topDamage.me.every((t) => t.total > 0 && t.name), 'каждый источник осмыслен: ' + JSON.stringify(d.topDamage.me));
  ok(Array.isArray(d.advice), 'советы всегда массив');
  ok(!d.verdict.some((v) => v.includes('undefined') || v.includes('NaN')), 'в вердикте нет мусора');
});

test('прогноз помечает приблизительность при случайных целях', () => {
  const plain = mkBattle([], [], 1);
  deploy(plain, 'me', bp('А', 2, 2));
  eq(predictCombat(plain, {}).approximate, false, 'обычный бой — точный прогноз');

  const zappy = mkBattle([], [], 1);
  deploy(zappy, 'me', bp('Разрядник', 1, 1, 1, [{ fx: 'deathZap', lvl: 3 }]));
  deploy(zappy, 'foe', bp('Д', 5, 5));
  zappy.phase = 'main1'; zappy.attacking = [zappy.sides.me.board[0].uid];
  eq(predictCombat(zappy, {}).approximate, true, 'Разряд выбирает цель случайно — прогноз приблизительный');
});

test('прогноз видит победу/поражение до её наступления', () => {
  const b = mkBattle([], [], 1);
  const a = deploy(b, 'me', bp('А', 9, 9));
  b.sides.foe.leader.hp = 3;
  b.phase = 'main1'; b.attacking = [a.uid];
  const p = predictCombat(b, {});
  ok(p.over, 'прогноз должен предвидеть конец боя');
  eq(p.over.winner, 'me');
  eq(b.over, null, 'настоящий бой ещё не закончен');
});
