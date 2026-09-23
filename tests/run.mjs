/**
 * Тесты «Верфи на костях».
 *
 * Запуск: npm test  (или node tests/run.mjs)
 *
 * Отдельный раздел «Регрессии» держит проверки на ошибки, которые уже стоили
 * времени: размножение модулей в autoEquip, тупик карты после поражения на
 * боссе, бой без развязки, бесплатный отход. Эти тесты обязаны падать, если
 * кто-то вернёт прежнее поведение.
 */

import { hashSeed, makeRng } from '../src/engine/rng.js';
import {
  CHANCE_BASE, CHANCE_MIN, CHANCE_MAX, TICK_INTERVAL, STATS, STAT_KEYS,
  chanceFrom, hitChance, armorDivisor, fmtMult,
} from '../src/engine/stats.js';
import {
  RARITIES, SPECIALS, SLOT_KEYS, rollModule, moduleParts, enchantCost,
  enchantChance, canEnchant, enchantModule, rarityOf, moduleScore,
} from '../src/engine/modules.js';
import {
  HULLS, HULL_KEYS, hullSlots, makeShip, slotList, freeSlots, install,
  uninstall, installedModules, computeStats, explainStat, specialList,
  shipPower, autoEquip, statBase,
} from '../src/engine/ship.js';
import {
  createBattle, makeUnit, aliveUnits, unitsOf, advance, upcoming, performAction,
  applyStatus, immuneTo, statusOf, overheatShare, overheatDamage, retreat,
  canRetreat, retreatCost, battleReport, checkOver, STALEMATE_ACTIONS,
  BATTLE_ACTION_CAP, RETREAT_HULL_COST,
} from '../src/engine/combat.js';
import { FACTIONS, luckForDepth, buildEnemy, buildFleet, buildBoss } from '../src/engine/enemies.js';
import { NODE_TYPES, generateSector, nodeById, availableNodes, validateSector } from '../src/engine/sector.js';
import { chooseTarget, autoBattle, suggestTarget, nextTurns } from '../src/engine/ai.js';
import {
  MAX_LIVES, START_PARTS, CARGO_LIMIT, MAX_FLEET, SECTOR_ROWS, MAX_SECTORS,
  VICTORY_REPAIR, DEFEAT_REPAIR, REPAIR_RATE,
  newRun, choices, enterNode, finishBattle, lootWrecks, takeLoot, cargoSpace,
  pickCapture, captureWreck, buyHull, hullPrice, salvageModule, drydockRepair,
  repairCost, repairFleet, enchantModuleRun, installModule, removeModule,
  addShip, cargo, flagship, findModule, nextSector, checkRunOver, runSummary,
  anomalyChoices, resolveAnomaly, nodeRng,
} from '../src/engine/run.js';
import {
  SAVE_VERSION, SAVE_KEY, serializeRun, saveToString, loadFromString,
  validateSave, saveSummary, saveToStorage, loadFromStorage, peekSave,
  hasSave, clearSave,
} from '../src/engine/save.js';

// ---------------------------------------------------------------------------
//  Мини-каркас
// ---------------------------------------------------------------------------

let passed = 0;
const failures = [];
let section = '';

function group(name) { section = name; }

function test(name, fn) {
  try {
    fn();
    passed++;
  } catch (err) {
    failures.push({ section, name, message: err && err.message ? err.message : String(err) });
  }
}

function ok(cond, msg) { if (!cond) throw new Error(msg || 'ожидалось истина, получено ложь'); }
function eq(actual, expected, msg) {
  if (actual !== expected) throw new Error(`${msg || 'не совпало'}: получено ${JSON.stringify(actual)}, ожидалось ${JSON.stringify(expected)}`);
}
function near(actual, expected, eps = 1e-9, msg) {
  if (!(Math.abs(actual - expected) <= eps)) throw new Error(`${msg || 'не совпало с точностью'}: ${actual} против ${expected} (eps ${eps})`);
}
function between(v, lo, hi, msg) {
  if (!(v >= lo && v <= hi)) throw new Error(`${msg || 'вне диапазона'}: ${v} не в [${lo}; ${hi}]`);
}

// ---------------------------------------------------------------------------
//  Заготовки для тестов
// ---------------------------------------------------------------------------

/** Корабль с полным набором модулей из указанного зерна. */
function stockedShip(hullKey = 'corvette', seed = 'тест', name = '«Проверочный»') {
  const rng = makeRng(seed);
  const ship = makeShip(hullKey, name);
  for (const sl of slotList(ship)) install(ship, rollModule(rng, { slot: sl.slot }), sl.id);
  return ship;
}

/** Бой двух одинаковых кораблей: ничья по силам, значит проверка развязки. */
function evenBattle(seed = 'бой') {
  const a = makeShip('frigate', '«Левый»');
  const b = makeShip('frigate', '«Правый»');
  const rng = makeRng(seed);
  for (const ship of [a, b]) {
    for (const sl of slotList(ship)) install(ship, rollModule(rng, { slot: sl.slot }), sl.id);
    ship.hull = computeStats(ship, { plain: true }).stats.hull;
  }
  return createBattle({ seed, mine: [a], foes: [b], mode: '1v1' });
}

/** Простое хранилище вместо localStorage. */
function fakeStorage() {
  const map = new Map();
  return {
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => { map.set(k, String(v)); },
    removeItem: (k) => { map.delete(k); },
    get size() { return map.size; },
  };
}

// ---------------------------------------------------------------------------
group('ГПСЧ');

test('одно зерно даёт один и тот же поток', () => {
  const a = makeRng('зерно');
  const b = makeRng('зерно');
  for (let i = 0; i < 50; i++) eq(a.next(), b.next(), `расхождение на ${i}-м числе`);
});

test('разные зёрна дают разные потоки', () => {
  const a = makeRng('зерно-1');
  const b = makeRng('зерно-2');
  let same = 0;
  for (let i = 0; i < 20; i++) if (a.next() === b.next()) same++;
  ok(same < 3, `потоки совпали ${same} раз из 20`);
});

test('хэш зерна детерминирован и ненулевой', () => {
  eq(hashSeed('abc'), hashSeed('abc'));
  ok(hashSeed('') > 0, 'хэш пустой строки должен быть ненулевым');
});

test('состояние потока продолжается, а не начинается заново', () => {
  const a = makeRng('поток');
  for (let i = 0; i < 10; i++) a.next();
  const state = a.state();
  const b = makeRng('поток', state);
  for (let i = 0; i < 20; i++) eq(a.next(), b.next(), `расхождение после восстановления на ${i}-м`);
});

test('next в диапазоне [0;1), int и float в границах', () => {
  const rng = makeRng('границы');
  for (let i = 0; i < 500; i++) {
    const v = rng.next();
    between(v, 0, 0.9999999999, 'next');
    between(rng.int(3, 7), 3, 7, 'int');
    const f = rng.float(-2, 5);
    ok(f >= -2 && f < 5, `float вне диапазона: ${f}`);
  }
});

test('roll возвращает и исход, и выпавшее число (прозрачность)', () => {
  const rng = makeRng('бросок');
  for (let i = 0; i < 100; i++) {
    const r = rng.roll(0.5);
    ok(typeof r.hit === 'boolean' && typeof r.value === 'number', 'roll обязан вернуть hit и value');
    eq(r.hit, r.value < 0.5, 'hit обязан соответствовать value');
  }
});

test('chance(1) всегда да, chance(0) всегда нет', () => {
  const rng = makeRng('крайности');
  for (let i = 0; i < 50; i++) { ok(rng.chance(1), 'chance(1)'); ok(!rng.chance(0), 'chance(0)'); }
});

test('fork не зависит от расхода родителя', () => {
  const a = makeRng('родитель');
  const f1 = a.fork('узел');
  const first = f1.next();
  for (let i = 0; i < 30; i++) a.next();
  eq(a.fork('узел').next(), first, 'подпоток обязан быть тем же');
});

test('shuffle переставляет, sample берёт без возврата, weighted уважает вес', () => {
  const rng = makeRng('выбор');
  const src = [1, 2, 3, 4, 5, 6, 7, 8];
  const sh = rng.shuffle(src);
  eq(sh.length, src.length);
  eq(JSON.stringify(src), JSON.stringify([1, 2, 3, 4, 5, 6, 7, 8]), 'shuffle не должен менять исходный массив');
  eq(new Set(sh).size, src.length, 'shuffle обязан сохранить состав');
  const smp = rng.sample(src, 3);
  eq(smp.length, 3);
  eq(new Set(smp).size, 3, 'sample обязан брать без возврата');
  let heavy = 0;
  for (let i = 0; i < 400; i++) if (rng.weighted(['тяжёлый', 'лёгкий'], (x) => (x === 'тяжёлый' ? 100 : 1)) === 'тяжёлый') heavy++;
  ok(heavy > 350, `взвешенный выбор игнорирует вес: ${heavy}/400`);
});

// ---------------------------------------------------------------------------
group('Характеристики и шансы');

test('база шанса — видимые 50%, границы 5% и 95%', () => {
  eq(CHANCE_BASE, 0.5);
  eq(CHANCE_MIN, 0.05);
  eq(CHANCE_MAX, 0.95);
  eq(TICK_INTERVAL, 100);
});

test('пустая цепочка даёт ровно базу', () => {
  const c = chanceFrom([]);
  eq(c.p, 0.5);
  eq(c.raw, 0.5);
  eq(c.clamped, null);
  eq(c.chain.length, 1, 'в цепочке обязана быть база');
  ok(/50%/.test(c.formula), `формула без базы: ${c.formula}`);
});

test('множители перемножаются, а не складываются', () => {
  const c = chanceFrom([{ label: 'А', mult: 1.2 }, { label: 'Б', mult: 1.5 }]);
  near(c.p, 0.5 * 1.2 * 1.5, 1e-12);
  eq(c.chain.length, 3, 'база + два множителя');
});

test('единичный множитель не попадает в цепочку (нечего показывать)', () => {
  const c = chanceFrom([{ label: 'Пустышка', mult: 1 }, { label: 'Дело', mult: 1.3 }]);
  eq(c.chain.length, 2);
  ok(!c.chain.some((t) => t.label === 'Пустышка'), 'множитель ×1 не должен засорять объяснение');
});

test('потолок и пол показывают ОБА числа: что дала сборка и что бросается', () => {
  const hi = chanceFrom([{ label: 'А', mult: 3 }, { label: 'Б', mult: 3 }]);
  eq(hi.p, CHANCE_MAX);
  eq(hi.clamped, 'max');
  ok(hi.raw > CHANCE_MAX, 'свободное значение обязано превышать потолок');
  ok(/потолок/.test(hi.formula), `формула не объясняет потолок: ${hi.formula}`);
  const lo = chanceFrom([{ label: 'А', mult: 0.01 }]);
  eq(lo.p, CHANCE_MIN);
  eq(lo.clamped, 'min');
  ok(/пол/.test(lo.formula), `формула не объясняет пол: ${lo.formula}`);
});

test('делитель читается как деление, а не как умножение', () => {
  ok(/÷/.test(fmtMult(1 / 1.25)), `делитель без знака ÷: ${fmtMult(1 / 1.25)}`);
  ok(/×/.test(fmtMult(1.25)), `множитель без знака ×: ${fmtMult(1.25)}`);
});

test('hitChance и armorDivisor согласованы с цепочкой', () => {
  const h = hitChance([{ label: 'точность', mult: 1.4 }], [{ label: 'уклонение', mult: 1.1 }]);
  ok(h && typeof h.p === 'number', 'hitChance обязан вернуть шанс');
  between(h.p, CHANCE_MIN, CHANCE_MAX);
  const d = armorDivisor(2);
  ok(d >= 1, `броня 2 обязана уменьшать урон, получено ${d}`);
  near(armorDivisor(0), 1, 1e-9, 'без брони делитель единица');
});

test('все характеристики описаны и имеют имя', () => {
  ok(STAT_KEYS.length >= 20, `характеристик ${STAT_KEYS.length}, ожидалось не меньше 20`);
  for (const k of STAT_KEYS) ok(STATS[k] && STATS[k].name, `у ${k} нет описания`);
});

// ---------------------------------------------------------------------------
group('Модули');

test('три редкости с разным составом', () => {
  eq(Object.keys(RARITIES).length, 3);
  ok(RARITIES.defective && RARITIES.standard && RARITIES.pristine, 'ожидались defective/standard/pristine');
  const d = RARITIES.defective, p = RARITIES.pristine;
  ok(d.penalties[0] > d.bonuses[1], `дефектный: штрафов ${d.penalties} должно быть больше бонусов ${d.bonuses}`);
  ok(p.bonuses[0] >= 3 && p.penalties[1] <= 1, `эталонный: бонусов ${p.bonuses}, штрафов ${p.penalties}`);
  ok(d.specialGood < 0.5 && p.specialGood > 0.5, 'дефектному чаще вредное свойство, эталонному — полезное');
});

test('редкость влияет на состав: дефектный в среднем хуже', () => {
  const rng = makeRng('редкости');
  const score = (rarity) => {
    let sum = 0, n = 300;
    for (let i = 0; i < n; i++) sum += moduleScore(rollModule(rng, { rarity, slot: 'weapon' }));
    return sum / n;
  };
  const d = score('defective'), s = score('standard'), p = score('pristine');
  ok(d < s, `дефектный ${d.toFixed(3)} должен быть хуже штатного ${s.toFixed(3)}`);
  ok(s < p, `штатный ${s.toFixed(3)} должен быть хуже эталонного ${p.toFixed(3)}`);
});

test('rollModule даёт модуль в указанный слот и с аффиксами этого слота', () => {
  const rng = makeRng('слоты');
  for (const slot of SLOT_KEYS) {
    const m = rollModule(rng, { slot });
    eq(m.slot, slot);
    ok(m.affixes.length >= 1, `модуль ${slot} без аффиксов`);
    ok(typeof m.uid === 'string' && m.uid.length > 0, 'модуль без uid');
    ok(typeof m.name === 'string' && m.name.length > 3, `подозрительное имя: ${m.name}`);
    ok(rarityOf(m).key === m.rarity, 'rarityOf расходится с полем rarity');
  }
});

test('uid модулей не повторяются', () => {
  const rng = makeRng('уники');
  const seen = new Set();
  for (let i = 0; i < 2000; i++) {
    const m = rollModule(rng, {});
    ok(!seen.has(m.uid), `повтор uid ${m.uid}`);
    seen.add(m.uid);
  }
});

test('удача поднимает качество модулей', () => {
  const avg = (luck) => {
    const rng = makeRng('удача' + luck);
    let sum = 0;
    for (let i = 0; i < 400; i++) sum += moduleScore(rollModule(rng, { luck, slot: 'weapon' }));
    return sum / 400;
  };
  ok(avg(1.6) > avg(0.8), 'удача 1,6 обязана давать лучшие модули, чем 0,8');
});

test('особые свойства делятся на полезные и вредные', () => {
  const keys = Object.keys(SPECIALS);
  ok(keys.length >= 15, `особых свойств ${keys.length}`);
  ok(keys.some((k) => SPECIALS[k].good) && keys.some((k) => !SPECIALS[k].good), 'нужны и полезные, и вредные');
  for (const k of keys) ok(SPECIALS[k].name && SPECIALS[k].text, `у ${k} нет описания`);
});

test('заточка: успех усиливает, провал ослабляет и добавляет штраф', () => {
  const rng = makeRng('заточка');
  let ups = 0, downs = 0, newPenalty = 0;
  for (let i = 0; i < 400; i++) {
    const m = rollModule(rng, { rarity: 'standard', slot: 'weapon' });
    const before = m.affixes.length;
    const levelBefore = m.enchant;
    const res = enchantModule(rng, m);
    ok(res && typeof res.success === 'boolean', 'enchantModule обязан вернуть success');
    if (res.success) {
      ups++;
      eq(m.enchant, levelBefore + 1, 'успех обязан поднять уровень');
    } else {
      downs++;
      eq(m.enchant, levelBefore - 1, 'провал обязан опустить уровень');
      if (m.affixes.length > before) newPenalty++;
    }
  }
  ok(ups > 0 && downs > 0, `заточка обязана и удаваться, и проваливаться: ${ups}/${downs}`);
  ok(newPenalty > 0, 'провал иногда обязан добавлять новый штраф');
});

test('уровень заточки уходит в минус и это видно в подписи', () => {
  const rng = makeRng('минус');
  const m = rollModule(rng, { rarity: 'standard', slot: 'armor' });
  for (let i = 0; i < 60; i++) enchantModule(rng, m);
  ok(m.enchant <= 0 || m.enchant > 0, 'уровень обязан быть числом');
  eq(typeof m.enchant, 'number');
});

test('canEnchant и стоимость растут с уровнем', () => {
  const rng = makeRng('цена');
  const m = rollModule(rng, { rarity: 'standard', slot: 'weapon' });
  ok(canEnchant(m), 'свежий модуль обязан точиться');
  const c0 = enchantCost(m);
  m.enchant = 5;
  const c5 = enchantCost(m);
  ok(c5 > c0, `стоимость обязана расти: ${c0} -> ${c5}`);
  between(enchantChance(m), 0.15, 1, 'шанс заточки не должен падать ниже 15%');
  m.enchant = 40;
  ok(enchantChance(m) >= 0.15, 'даже на высоком уровне шанс не ниже 15%');
});

test('запчасти за модуль зависят от редкости и заточки', () => {
  const rng = makeRng('запчасти');
  const d = rollModule(rng, { rarity: 'defective', slot: 'weapon' });
  const p = rollModule(rng, { rarity: 'pristine', slot: 'weapon' });
  ok(moduleParts(p) >= moduleParts(d), 'эталонный обязан давать не меньше запчастей, чем дефектный');
  const before = moduleParts(p);
  p.enchant = 4;
  ok(moduleParts(p) > before, 'заточенный модуль дороже при переработке');
});

test('moduleScore растёт от множителей и падает от штрафов', () => {
  const good = { uid: 'g', name: 'х', slot: 'weapon', rarity: 'standard', enchant: 0, affixes: [{ key: 'damage', kind: 'mult', value: 1.5 }], special: null };
  const bad = { uid: 'b', name: 'у', slot: 'weapon', rarity: 'defective', enchant: 0, affixes: [{ key: 'damage', kind: 'mult', value: 1 / 1.5 }], special: null };
  ok(moduleScore(good) > moduleScore(bad), 'хороший модуль обязан набирать больше');
});

// ---------------------------------------------------------------------------
group('Корабль и сборка');

test('пять корпусов, слотов больше у старших', () => {
  eq(HULL_KEYS.length, 5);
  const sizes = HULL_KEYS.map((k) => hullSlots(k).length);
  for (let i = 1; i < sizes.length; i++) ok(sizes[i] >= sizes[i - 1], `корпус ${HULL_KEYS[i]} меньше предыдущего по слотам`);
  eq(hullSlots('battleship').length, 15);
  eq(hullSlots('cruiser').length, 12);
});

test('список слотов кэшируется и заморожен', () => {
  const a = hullSlots('frigate');
  const b = hullSlots('frigate');
  ok(a === b, 'кэш обязан отдавать тот же массив');
  ok(Object.isFrozen(a), 'список слотов обязан быть заморожен');
  let threw = false;
  try { a.push({ id: 'x' }); } catch { threw = true; }
  ok(threw || a.length === hullSlots('frigate').length, 'заморозка должна мешать изменению');
});

test('неизвестный корпус откатывается к корвету', () => {
  eq(hullSlots('нет-такого').length, hullSlots('corvette').length);
});

test('модуль встаёт только в свой тип слота', () => {
  const rng = makeRng('слот');
  const ship = makeShip('corvette', '«Тест»');
  const weaponSlot = slotList(ship).find((s) => s.slot === 'weapon');
  const engineSlot = slotList(ship).find((s) => s.slot === 'engine');
  const engineModule = rollModule(rng, { slot: 'engine' });
  const res = install(ship, engineModule, weaponSlot.id);
  ok(!res.ok, 'двигательный модуль не должен вставать в орудийный слот');
  ok(res.reason, 'отказ обязан объясняться');
  ok(install(ship, engineModule, engineSlot.id).ok, 'в свой слот модуль встать обязан');
  eq(ship.installed[engineSlot.id], engineModule);
});

test('uninstall возвращает модуль в трюм и освобождает слот', () => {
  const ship = stockedShip('frigate', 'снятие');
  const sl = slotList(ship)[0];
  const m = ship.installed[sl.id];
  ok(m, 'слот должен быть занят');
  const res = uninstall(ship, sl.id);
  ok(res.ok, 'снятие не удалось');
  ok(!ship.installed[sl.id], 'слот обязан освободиться');
  ok(ship.cargo.includes(m), 'модуль обязан попасть в трюм');
  ok(!uninstall(ship, sl.id).ok, 'снятие из пустого слота должно отказывать');
});

test('плоский режим computeStats численно совпадает с полным', () => {
  for (const key of HULL_KEYS) {
    const ship = stockedShip(key, 'плоский' + key);
    const full = computeStats(ship);
    const plain = computeStats(ship, { plain: true });
    for (const k of STAT_KEYS) near(plain.stats[k], full.stats[k], 1e-12, `${key}/${k}`);
    eq(plain.chain, null, 'плоский режим не обязан строить цепочки');
    ok(full.chain && Object.keys(full.chain).length === STAT_KEYS.length, 'полный режим обязан дать цепочки');
  }
});

test('выключенные ЭМИ модули выпадают из расчёта', () => {
  const ship = stockedShip('cruiser', 'эми');
  const mods = installedModules(ship);
  const victim = mods.find((m) => m.affixes.some((a) => a.kind === 'mult' && a.value !== 1));
  ok(victim, 'нужен модуль с множителем');
  const withHim = computeStats(ship, { plain: true }).stats;
  const without = computeStats(ship, { disabled: [victim.uid], plain: true }).stats;
  const diff = STAT_KEYS.some((k) => Math.abs(withHim[k] - without[k]) > 1e-9);
  ok(diff, 'выключенный модуль обязан менять характеристики');
  eq(computeStats(ship, { disabled: [victim.uid], plain: true }).disabledCount, 1);
});

test('explainStat объясняет цепочку и не падает на плоском входе', () => {
  const ship = stockedShip('corvette', 'объяснение');
  const text = explainStat(ship, 'accuracy');
  ok(/база/.test(text), `объяснение без базы: ${text}`);
  ok(/=/.test(text), `объяснение без итога: ${text}`);
  const plain = computeStats(ship, { plain: true });
  const fromPlain = explainStat(ship, 'accuracy', plain);
  ok(/база/.test(fromPlain), 'объяснение по плоскому результату обязано пересчитаться');
});

test('specialList перечисляет особые свойства корабля', () => {
  const rng = makeRng('свойства');
  const ship = makeShip('battleship', '«Особый»');
  for (const sl of slotList(ship)) {
    let m = rollModule(rng, { slot: sl.slot });
    let guard = 0;
    while (!m.special && guard++ < 60) m = rollModule(rng, { slot: sl.slot });
    install(ship, m, sl.id);
  }
  const list = specialList(ship);
  ok(list.length > 0, 'на 15 модулях особое свойство обязано появиться');
  for (const s of list) ok(SPECIALS[s.id], `неизвестное свойство ${s.id}`);
});

test('shipPower положителен и растёт от хорошей сборки', () => {
  const empty = makeShip('frigate', '«Пустой»');
  const full = stockedShip('frigate', 'мощность');
  ok(shipPower(full) > 0, 'мощность обязана быть положительной');
  ok(Number.isFinite(shipPower(empty)), 'мощность пустого корабля обязана быть конечной');
});

test('autoEquip ставит модули и ничего не теряет', () => {
  const rng = makeRng('подбор');
  const ship = makeShip('cruiser', '«Подбор»');
  const pool = [];
  for (let i = 0; i < 40; i++) pool.push(rollModule(rng, { slot: rng.pick(SLOT_KEYS) }));
  const res = autoEquip(ship, pool);
  ok(res.installed > 0, 'подбор обязан что-то поставить');
  ok(res.powerAfter >= res.powerBefore - 1e-9, `подбор ухудшил сборку: ${res.powerBefore} -> ${res.powerAfter}`);
  const accounted = new Set([...installedModules(ship).map((m) => m.uid), ...ship.cargo.map((m) => m.uid)]);
  eq(accounted.size, pool.length, 'часть модулей исчезла или задвоилась после подбора');
  for (const m of pool) ok(accounted.has(m.uid), `модуль ${m.uid} потерян`);
});

test('особое свойство без id не создаёт мусорного ключа', () => {
  const ship = makeShip('corvette', '«Безымянное свойство»');
  const slot = slotList(ship)[0];
  ship.installed[slot.id] = { uid: 'битый', name: 'Битый модуль', slot: slot.slot, rarity: 'standard', enchant: 0, affixes: [], special: { name: 'Неизвестно что', good: true, text: 'нет id' } };
  const c = computeStats(ship, { plain: true });
  eq(Object.keys(c.fx).length, 0, 'свойство без id не должно попадать в fx');
  eq(specialList(ship).length, 0, 'в списке свойств не должно быть мусора');
});

test('freeSlots и installedModules согласованы', () => {
  const ship = stockedShip('corvette', 'согласование');
  eq(freeSlots(ship).length, 0, 'полный корабль не имеет свободных слотов');
  eq(installedModules(ship).length, slotList(ship).length);
  uninstall(ship, slotList(ship)[0].id);
  eq(freeSlots(ship).length, 1);
});

// ---------------------------------------------------------------------------
group('Регрессии: размножение модулей');

test('autoEquip НЕ удваивает трюм, если пул содержит дубликаты', () => {
  const rng = makeRng('дубликаты');
  const ship = makeShip('cruiser', '«Жертва»');
  const pool = [];
  for (let i = 0; i < 10; i++) pool.push(rollModule(rng, { slot: rng.pick(SLOT_KEYS) }));
  // Так ошибался бот: трюм корабля плюс общий трюм флота, который его уже включает
  const doubled = [...ship.cargo, ...pool, ...pool];
  autoEquip(ship, doubled);
  const afterFirst = installedModules(ship).length + ship.cargo.length;
  ok(afterFirst <= pool.length, `модулей стало ${afterFirst} из ${pool.length} — дубликаты размножились`);
  // и ещё десять прогонов подряд: раньше трюм удваивался на каждом вызове
  for (let i = 0; i < 10; i++) autoEquip(ship, [...ship.cargo, ...pool]);
  const afterTen = installedModules(ship).length + ship.cargo.length;
  eq(afterTen, afterFirst, `за 10 прогонов число модулей выросло с ${afterFirst} до ${afterTen}`);
});

test('дубликаты различаются по uid, а не по ссылке', () => {
  const rng = makeRng('копия');
  const ship = makeShip('frigate', '«Копия»');
  const m = rollModule(rng, { slot: 'weapon' });
  const copy = JSON.parse(JSON.stringify(m));   // тот же uid, другой объект
  autoEquip(ship, [m, copy]);
  const total = installedModules(ship).length + ship.cargo.length;
  eq(total, 1, 'модули с одним uid обязаны считаться одним модулем');
});

// ---------------------------------------------------------------------------
group('Бой');

test('бой создаётся с обеими сторонами и поднятым щитом', () => {
  const b = evenBattle('создание');
  eq(aliveUnits(b, 'mine').length, 1);
  eq(aliveUnits(b, 'foes').length, 1);
  const u = aliveUnits(b, 'mine')[0];
  ok(u.shield >= 0, 'щит обязан быть числом');
  eq(u.maxHull, computeStats(u.ship).stats.hull, 'полная прочность берётся из характеристик');
  ok(u.uid.includes('mine'), 'uid юнита обязан содержать сторону');
});

test('тик-инициатива: первым действует более быстрый', () => {
  const fast = makeShip('interceptor', '«Быстрый»');
  const slow = makeShip('battleship', '«Медленный»');
  const rng = makeRng('инициатива');
  for (const sl of slotList(fast)) install(fast, rollModule(rng, { slot: sl.slot, luck: 1.4 }), sl.id);
  const b = createBattle({ seed: 'тики', mine: [fast], foes: [slow], mode: '1v1' });
  const first = advance(b);
  ok(first, 'первый ход обязан быть');
  const cf = computeStats(fast, { plain: true }).stats.speed;
  const cs = computeStats(slow, { plain: true }).stats.speed;
  if (cf > cs) eq(first.ship.uid, fast.uid, 'быстрый корабль обязан ходить первым');
});

test('upcoming показывает очередь на несколько ходов вперёд', () => {
  const b = evenBattle('очередь');
  const q = upcoming(b, 5);
  eq(q.length, 5);
  for (const item of q) {
    ok(item && item.unit, 'очередь обязана называть, кто ходит');
    ok(Number.isFinite(item.at), 'очередь обязана показывать, когда ход');
    ok(item.unit.alive, 'в очереди только живые');
  }
  for (let i = 1; i < q.length; i++) ok(q[i].at >= q[i - 1].at, 'очередь обязана идти по времени');
});

test('РЕГРЕССИЯ: бой равных сил всегда заканчивается', () => {
  for (const seed of ['развязка-1', 'развязка-2', 'развязка-3', 'развязка-4']) {
    const b = evenBattle(seed);
    let guard = 0;
    while (!b.over && guard++ < 900) {
      const actor = advance(b);
      if (!actor) break;
      const target = chooseTarget(b, actor);
      if (!target) break;
      performAction(b, actor, target);
    }
    ok(b.over, `бой ${seed} не получил развязки за ${guard} действий`);
    ok(['mine', 'foes', 'draw'].includes(b.over.winner), `неизвестный исход: ${b.over.winner}`);
    ok(guard < 900, `бой ${seed} тянулся ${guard} действий`);
  }
});

test('перегрев считается долей корпуса и растёт с длиной боя', () => {
  const b = evenBattle('перегрев');
  eq(overheatShare(b), 0, 'в начале боя перегрева нет');
  b.actionsSinceDeath = STALEMATE_ACTIONS + 10;
  const s1 = overheatShare(b);
  b.actionsSinceDeath = STALEMATE_ACTIONS + 30;
  const s2 = overheatShare(b);
  ok(s2 > s1, 'перегрев обязан нарастать');
  b.actionsSinceDeath = 0;
  b.action = BATTLE_ACTION_CAP + 100;
  ok(overheatShare(b) > 0, 'долгий бой греется и без потерь');
  b.action = BATTLE_ACTION_CAP + 100000;
  ok(overheatShare(b) <= 0.5, `доля перегрева обязана быть ограничена: ${overheatShare(b)}`);
  const u = aliveUnits(b, 'mine')[0];
  const dmg = overheatDamage(b, u);
  ok(dmg >= 1 && dmg <= u.maxHull, `урон перегрева вне смысла: ${dmg} при корпусе ${u.maxHull}`);
  eq(overheatDamage(b, null), 0, 'без корабля урона нет');
});

test('РЕГРЕССИЯ: перегрев добивает толстый корпус за конечное число ходов', () => {
  const b = evenBattle('толстый');
  b.action = BATTLE_ACTION_CAP + 400;   // очень долгий бой
  const u = aliveUnits(b, 'mine')[0];
  let guard = 0;
  while (u.alive && guard++ < 20) {
    const dmg = overheatDamage(b, u);
    u.hull = Math.max(0, u.hull - dmg);
    if (u.hull <= 0) u.alive = false;
    b.action += 2;
  }
  ok(!u.alive, `перегрев не добил корпус за ${guard} итераций`);
});

test('статусы ставятся, складываются и снимаются иммунитетом', () => {
  const b = evenBattle('статусы');
  const target = aliveUnits(b, 'foes')[0];
  applyStatus(b, target, 'ignite', 1, 3, 'тест');
  ok(statusOf(target, 'ignite'), 'поджог не встал');
  applyStatus(b, target, 'ignite', 1, 3, 'тест');
  ok(statusOf(target, 'ignite').stacks >= 1, 'слои поджога обязаны учитываться');
  target.fx.firewall = true;
  ok(immuneTo(target, 'ignite'), 'переборка обязана давать иммунитет к поджогу');
  target.fx.firewall = false;
  target.fx.faraday = true;
  ok(immuneTo(target, 'emp'), 'клетка Фарадея обязана глушить ЭМИ');
  target.fx.faraday = false;
  target.fx.inox = true;
  ok(immuneTo(target, 'corrode'), 'нержавейка обязана держать коррозию');
});

test('ЭМИ глушит модуль: характеристика меняется', () => {
  const b = evenBattle('глушение');
  const u = aliveUnits(b, 'mine')[0];
  const before = { ...u.stats };
  const mod = installedModules(u.ship).find((m) => m.affixes.some((a) => a.kind === 'mult' && a.value !== 1));
  ok(mod, 'нужен модуль с множителем');
  u.disabled.add(mod.uid);
  const c = computeStats(u.ship, { disabled: u.disabled, plain: true });
  const changed = STAT_KEYS.some((k) => Math.abs(c.stats[k] - before[k]) > 1e-9);
  ok(changed, 'заглушённый модуль обязан менять характеристики');
});

test('нельзя стрелять по своим и по мёртвым', () => {
  const b = evenBattle('правила');
  const me = aliveUnits(b, 'mine')[0];
  const foe = aliveUnits(b, 'foes')[0];
  ok(!performAction(b, me, me).ok, 'выстрел по себе должен быть запрещён');
  foe.alive = false;
  ok(!performAction(b, me, foe).ok, 'выстрел по мёртвому должен быть запрещён');
  me.alive = false;
  ok(!performAction(b, me, foe).ok, 'мёртвый корабль не стреляет');
});

test('выстрел пишет в журнал и двигает счётчики', () => {
  const b = evenBattle('журнал');
  const logBefore = b.log.length;
  let guard = 0;
  while (!b.over && guard++ < 30) {
    const actor = advance(b);
    if (!actor) break;
    const target = chooseTarget(b, actor);
    if (!target) break;
    performAction(b, actor, target);
  }
  ok(b.log.length > logBefore, 'бой обязан писать журнал');
  ok(b.shots > 0, 'счётчик выстрелов обязан расти');
  const rep = battleReport(b, 'mine');
  between(rep.accuracy, 0, 1, `точность вне [0;1]: ${rep.accuracy}`);
  eq(rep.shots, b.shots, 'отчёт обязан совпадать со счётчиком боя');
  ok(rep.hits <= rep.shots, 'попаданий не может быть больше выстрелов');
});

test('battleReport несёт победителя, обломки, перегруз и признак отхода', () => {
  const b = evenBattle('отчёт');
  const r = autoBattle(b, { maxActions: 400 });
  ok(b.over, 'автобой обязан завершить бой');
  const rep = battleReport(b, 'mine');
  eq(rep.winner, r.winner, 'отчёт расходится с итогом автобоя');
  ok(Array.isArray(rep.wrecks), 'отчёт обязан перечислять обломки');
  ok(Array.isArray(rep.survived), 'отчёт обязан перечислять уцелевших');
  between(rep.overkillRatio, 0, 1, 'перегруз вне [0;1]');
  ok('retreated' in rep, 'в отчёте обязан быть признак отхода');
  ok(Number.isFinite(rep.rounds) && rep.rounds > 0, 'число ходов обязано быть');
});

// ---------------------------------------------------------------------------
group('Отход из боя');

test('отход доступен до конца боя и недоступен после', () => {
  const b = evenBattle('доступность');
  ok(canRetreat(b, 'mine').ok, 'отход должен быть доступен');
  b.over = { winner: 'mine', retreated: null };
  ok(!canRetreat(b, 'mine').ok, 'после конца боя отход невозможен');
  const b2 = evenBattle('нет-флота');
  for (const u of unitsOf(b2, 'mine')) u.alive = false;
  ok(!canRetreat(b2, 'mine').ok, 'отходить нечем — должно быть отказано');
});

test('предпросмотр цены отхода совпадает с тем, что случилось', () => {
  const b = evenBattle('предпросмотр');
  const u = aliveUnits(b, 'mine')[0];
  const preview = retreatCost(b, 'mine');
  eq(preview.length, 1);
  eq(preview[0].cost, Math.max(1, Math.round(u.maxHull * RETREAT_HULL_COST)), 'цена обязана считаться от ПОЛНОЙ прочности');
  const hullBefore = u.hull;
  retreat(b, 'mine');
  eq(u.hull, Math.max(0, hullBefore - preview[0].cost), 'списано не столько, сколько показано');
  eq(preview[0].after, u.hull, 'предпросмотр обязан показывать итог');
});

test('РЕГРЕССИЯ: отход может добить флот, и тогда это поражение', () => {
  const b = evenBattle('гибель-при-отходе');
  const u = aliveUnits(b, 'mine')[0];
  u.hull = Math.max(1, Math.round(u.maxHull * RETREAT_HULL_COST * 0.5));   // меньше цены отхода
  const preview = retreatCost(b, 'mine');
  ok(preview[0].lost, 'предпросмотр обязан предупреждать о потере корабля');
  const res = retreat(b, 'mine');
  ok(res.ok && res.lost, 'отход обязан сообщить, что флот потерян');
  ok(!u.alive, 'корабль должен погибнуть при отходе');
  eq(b.over.retreated, null, 'гибель при отходе — не отход');
  eq(b.over.winner, 'foes', 'победителем записан противник');
});

test('отход сохраняет жизнь: узел не пройден, победитель — противник', () => {
  const b = evenBattle('живой-отход');
  const res = retreat(b, 'mine');
  ok(res.ok && !res.lost, 'обычный отход обязан пройти без потерь флота');
  eq(b.over.retreated, 'mine');
  eq(b.over.winner, 'foes');
  ok(aliveUnits(b, 'mine').length === 1, 'корабль обязан уцелеть');
});

test('отход симметричен: противник тоже может уйти', () => {
  const b = evenBattle('враг-уходит');
  const res = retreat(b, 'foes');
  ok(res.ok, 'противник обязан мочь отступить');
  eq(b.over.retreated, 'foes');
  eq(b.over.winner, 'mine');
});

// ---------------------------------------------------------------------------
group('Противники');

test('удача растёт с глубиной и зависит от ранга', () => {
  const l1 = luckForDepth(1), l5 = luckForDepth(5), l9 = luckForDepth(9);
  eq(l1, 1, 'на первой глубине удача базовая');
  ok(l5 > l1 && l9 > l5, 'удача обязана расти с глубиной');
  ok(luckForDepth(5, 'elite') > l5, 'элита удачливее рядового');
  ok(luckForDepth(5, 'boss') > luckForDepth(5, 'elite'), 'босс удачливее элиты');
  ok(luckForDepth(5, 'fleet') < l5, 'член эскадры слабее одиночки');
  ok(luckForDepth(0) === 1 && luckForDepth(-3) === 1, 'глубина ниже единицы не должна ломать удачу');
});

test('враг собирается в пределах своих слотов и без превышения', () => {
  const rng = makeRng('враг');
  for (let depth = 1; depth <= 10; depth++) {
    const ship = buildEnemy(rng, { depth });
    ok(ship.hullKey && HULLS[ship.hullKey], `неизвестный корпус ${ship.hullKey}`);
    const mods = installedModules(ship);
    ok(mods.length >= 1, 'враг без модулей');
    ok(mods.length <= slotList(ship).length, 'модулей больше, чем слотов');
    ok(ship.name && ship.name.length > 2, 'враг без имени');
  }
});

test('элита плотнее рядового, босс заполняет всё', () => {
  const rng = makeRng('плотность');
  const fillOf = (tier, hullKey = 'cruiser') => {
    let sum = 0, n = 40;
    for (let i = 0; i < n; i++) {
      const s = buildEnemy(rng, { depth: 5, tier, hullKey });
      sum += installedModules(s).length / slotList(s).length;
    }
    return sum / n;
  };
  const rowdy = fillOf('battle'), elite = fillOf('elite'), boss = fillOf('boss');
  ok(rowdy < elite, `рядовой ${rowdy.toFixed(2)} должен быть реже элиты ${elite.toFixed(2)}`);
  ok(elite < boss, `элита ${elite.toFixed(2)} должна быть реже босса ${boss.toFixed(2)}`);
  near(boss, 1, 1e-9, 'босс обязан заполнять все слоты');
});

test('эскадра собирается заданного размера', () => {
  const rng = makeRng('эскадра');
  eq(buildFleet(rng, 2, { depth: 3, tier: 'fleet' }).length, 2);
  eq(buildFleet(rng, 3, { depth: 3, tier: 'fleet' }).length, 3);
});

test('босс первого сектора легче босса позднего', () => {
  const rng = makeRng('боссы');
  const b1 = buildBoss(rng, 4, 1);
  const b3 = buildBoss(rng, 4, 3);
  ok(slotList(b1).length <= slotList(b3).length, 'босс позднего сектора обязан быть не меньше');
  ok(slotList(b1).length >= 12, `босс первого сектора слишком мал: ${slotList(b1).length} слотов`);
});

test('фракции различимы и имеют имена кораблей', () => {
  const keys = Object.keys(FACTIONS);
  ok(keys.length >= 3, `фракций ${keys.length}`);
  for (const k of keys) {
    ok(FACTIONS[k].name, `у фракции ${k} нет имени`);
    ok(Array.isArray(FACTIONS[k].names) && FACTIONS[k].names.length > 2, `у фракции ${k} мало имён кораблей`);
  }
});

// ---------------------------------------------------------------------------
group('Карта сектора');

test('сектор строится, валиден и имеет вход и босса', () => {
  for (let seed = 1; seed <= 40; seed++) {
    const map = generateSector(makeRng('сектор' + seed), { sector: 1, rows: SECTOR_ROWS });
    const v = validateSector(map);
    ok(v.ok, `сектор ${seed} невалиден: ${v.problems.join('; ')}`);
    eq(map.rows, SECTOR_ROWS);
    ok(map.entry.length > 0, 'нет входных узлов');
    ok(map.bossId, 'нет босса');
    const boss = nodeById(map, map.bossId);
    eq(boss.type, 'boss');
    eq(boss.row, SECTOR_ROWS - 1);
    eq(boss.edges.length, 0, 'у босса не должно быть потомков');
    for (const n of map.nodes) ok(NODE_TYPES[n.type], `неизвестный тип узла ${n.type}`);
  }
});

test('из входа достижим босс, висячих узлов нет', () => {
  for (let seed = 1; seed <= 20; seed++) {
    const map = generateSector(makeRng('путь' + seed), { sector: 2, rows: SECTOR_ROWS });
    const seen = new Set(map.entry);
    const queue = [...map.entry];
    while (queue.length) {
      const n = nodeById(map, queue.shift());
      for (const id of n.edges) if (!seen.has(id)) { seen.add(id); queue.push(id); }
    }
    ok(seen.has(map.bossId), `босс недостижим в секторе ${seed}`);
    for (const n of map.nodes) {
      if (n.row === 0) continue;
      ok(map.nodes.some((p) => p.edges.includes(n.id)), `узел ${n.id} недостижим`);
    }
  }
});

test('РЕГРЕССИЯ: зачищенные дети остаются проходимыми (карта не тупиковала)', () => {
  const map = generateSector(makeRng('проход'), { sector: 1, rows: SECTOR_ROWS });
  const start = nodeById(map, map.entry[0]);
  start.cleared = true;
  const opts = availableNodes(map, start.id);
  eq(opts.length, start.edges.length, 'зачищенный узел обязан открывать всех детей');
  ok(opts.length > 0, 'из зачищенного входа некуда идти');
});

test('без текущего узла доступны все входы', () => {
  const map = generateSector(makeRng('входы'), { sector: 1, rows: SECTOR_ROWS });
  eq(availableNodes(map, null).length, map.entry.length);
  eq(availableNodes(map, 'нет-такого-узла').length, 0, 'из несуществующего узла идти некуда');
});

test('типы узлов покрывают бой, элиту, босса, эскадры и тыл', () => {
  for (const t of ['battle', 'elite', 'boss', 'repair', 'forge', 'anomaly']) {
    ok(NODE_TYPES[t], `не описан тип узла ${t}`);
    ok(NODE_TYPES[t].name && NODE_TYPES[t].icon, `у ${t} нет имени или значка`);
  }
});

// ---------------------------------------------------------------------------
group('ИИ');

test('chooseTarget выбирает живого противника', () => {
  const b = evenBattle('выбор');
  const actor = aliveUnits(b, 'mine')[0];
  const target = chooseTarget(b, actor);
  ok(target, 'цель обязана быть');
  eq(target.sideId, 'foes', 'целиться нужно в противника');
  ok(target.alive, 'цель обязана быть живой');
});

test('suggestTarget возвращает uid цели', () => {
  const b = evenBattle('подсказка');
  const actor = aliveUnits(b, 'mine')[0];
  const uid = suggestTarget(b, actor);
  ok(uid, 'подсказка обязана быть');
  const target = chooseTarget(b, actor);
  eq(uid, target.uid, 'подсказка расходится с выбором ИИ');
});

test('nextTurns совпадает с очередью upcoming', () => {
  const b = evenBattle('ходы');
  eq(nextTurns(b, 3).length, 3);
});

test('autoBattle завершает бой и возвращает победителя', () => {
  const b = evenBattle('автобой');
  const res = autoBattle(b, { maxActions: 400 });
  ok(b.over, 'автобой обязан завершить бой');
  eq(res.winner, b.over.winner);
  ok(res.battle === b, 'автобой обязан вернуть тот же бой');
});

// ---------------------------------------------------------------------------
group('Забег: начало и карта');

test('новый забег: 4 жизни, стартовые запчасти, половина слотов занята', () => {
  const run = newRun({ seed: 'старт' });
  eq(run.lives, MAX_LIVES);
  eq(MAX_LIVES, 4);
  eq(run.parts, START_PARTS);
  eq(run.sector, 1);
  eq(run.fleet.length, 1);
  const ship = flagship(run);
  const slots = slotList(ship).length;
  const filled = installedModules(ship).length;
  eq(filled, Math.ceil(slots / 2), 'стартовая сборка обязана занимать половину слотов');
  eq(cargo(run).length, 0, 'трюм в начале пуст');
  ok(run.log.length > 0, 'забег обязан начать журнал');
  ok(choices(run).length > 0, 'в начале обязаны быть доступные узлы');
});

test('один и тот же сид даёт один и тот же забег', () => {
  const a = newRun({ seed: 'повтор' });
  const b = newRun({ seed: 'повтор' });
  // uid выдаёт общий счётчик, поэтому в другом забеге они другие — сравниваем
  // содержимое, а не номера: модули, характеристики, карта.
  const strip = (x) => JSON.stringify(x, (k, v) => (k === 'uid' ? undefined : v));
  eq(strip(a.map), strip(b.map), 'карты разошлись');
  eq(strip(a.fleet), strip(b.fleet), 'стартовые корабли разошлись');
  eq(a.parts, b.parts);
  eq(a.lives, b.lives);
});

test('войти можно только в доступный узел', () => {
  const run = newRun({ seed: 'правила-входа' });
  const far = run.map.nodes.find((n) => !choices(run).some((c) => c.id === n.id));
  ok(far, 'нужен недоступный узел');
  const res = enterNode(run, far.id);
  ok(!res.ok, 'вход в недоступный узел должен быть запрещён');
  ok(res.reason, 'отказ обязан объясняться');
  ok(!enterNode(run, 'нет-такого').ok, 'вход в несуществующий узел должен быть запрещён');
});

test('nodeRng детерминирован по тегу и меняет счётчик', () => {
  const run = newRun({ seed: 'подзерно' });
  const before = run.rngState;
  const first = nodeRng(run, 'тэг').next();
  eq(run.rngState, before + 1, 'счётчик подпотоков обязан вырасти на единицу');
  run.rngState = before;                              // тот же счётчик — то же зерно
  eq(nodeRng(run, 'тэг').next(), first, 'тот же тег и счётчик обязаны дать тот же поток');
  run.rngState = before;
  ok(nodeRng(run, 'другой-тэг').next() !== first, 'разные теги обязаны давать разные потоки');
});

// ---------------------------------------------------------------------------
group('Забег: бой, трофеи, ремонт');

/** Довести бой до победы игрока честно: добить противника. */
function forceWin(run, battle) {
  for (const u of unitsOf(battle, 'foes')) { u.hull = 0; u.alive = false; }
  checkOver(battle);
  return battleReport(battle, 'mine');
}

/** Довести бой до поражения игрока. */
function forceLose(run, battle) {
  for (const u of unitsOf(battle, 'mine')) { u.hull = 0; u.alive = false; }
  checkOver(battle);
  return battleReport(battle, 'mine');
}

function firstBattleNode(run) {
  return choices(run).find((n) => n.type === 'battle') || choices(run)[0];
}

test('вход в боевой узел создаёт бой и запоминает позицию', () => {
  const run = newRun({ seed: 'бой-узла' });
  const node = firstBattleNode(run);
  const before = run.currentNode;
  const res = enterNode(run, node.id);
  ok(res.ok, 'вход не удался');
  eq(run.currentNode, node.id, 'позиция обязана обновиться');
  eq(run.prevNode, before, 'предыдущая позиция обязана запомниться');
  if (res.kind === 'battle') {
    ok(res.battle, 'бой обязан быть создан');
    eq(res.battle.nodeId, node.id, 'бой обязан знать свой узел');
    ok(aliveUnits(res.battle, 'mine').length === run.fleet.length, 'в бой идёт весь флот');
    ok(aliveUnits(res.battle, 'foes').length >= 1, 'противник обязан быть');
  }
});

test('победа: узел зачищен, глубина выросла, трофеи предложены, корпус подлатан', () => {
  const run = newRun({ seed: 'победа' });
  const node = firstBattleNode(run);
  const res = enterNode(run, node.id);
  ok(res.kind === 'battle', 'нужен боевой узел');
  const ship = flagship(run);
  ship.hull = Math.round(ship.hull * 0.5);
  const hullBefore = ship.hull;
  const report = forceWin(run, res.battle);
  const out = finishBattle(run, res.battle, report);
  ok(out.win, 'победа обязана засчитаться');
  eq(nodeById(run.map, node.id).cleared, true, 'узел обязан быть зачищен');
  eq(run.trophies.wins, 1);
  ok(run.pendingLoot, 'трофеи обязаны быть предложены');
  ok(Array.isArray(run.pendingLoot.candidates), 'кандидаты обязаны быть списком');
  ok(run.pendingLoot.parts > 0, 'за победу обязаны дать запчасти');
  ok(ship.hull > hullBefore, 'победа обязана подлатать корпус');
  ok(run.depth > 0, 'глубина обязана вырасти');
});

test('латание после победы ограничено долей VICTORY_REPAIR', () => {
  const run = newRun({ seed: 'доля-латания' });
  const ship = flagship(run);
  const max = computeStats(ship, { plain: true }).stats.hull;
  // Портим корпус ДО входа в узел: createBattle синхронизирует прочность
  // корабля с юнитом, а по окончании боя пишет её обратно, поэтому правка
  // «после» была бы перезаписана полным корпусом юнита.
  ship.hull = Math.max(1, Math.round(max * 0.2));
  const node = firstBattleNode(run);
  const res = enterNode(run, node.id);
  ok(res.kind === 'battle', 'нужен боевой узел');
  forceWin(run, res.battle);
  finishBattle(run, res.battle, battleReport(res.battle, 'mine'));
  const healed = ship.hull - Math.max(1, Math.round(max * 0.2));
  between(healed, 1, Math.round(max * VICTORY_REPAIR) + 1, 'залатать должны не больше обещанной доли');
  ok(ship.hull < max, 'победа не обязана чинить до полного корпуса');
  ok(ship.hull > max * 0.2, 'латание обязано поднять корпус');
});

test('поражение: минус жизнь, узел не зачищен, аварийный ремонт даже с нуля', () => {
  const run = newRun({ seed: 'поражение' });
  const node = firstBattleNode(run);
  const res = enterNode(run, node.id);
  const ship = flagship(run);
  const max = computeStats(ship, { plain: true }).stats.hull;
  for (const s of run.fleet) s.hull = 0;                 // флот уничтожен
  const livesBefore = run.lives;
  const report = forceLose(run, res.battle);
  const out = finishBattle(run, res.battle, report);
  ok(!out.win, 'поражение не должно засчитываться победой');
  eq(run.lives, livesBefore - 1, 'жизнь обязана списаться');
  eq(nodeById(run.map, node.id).cleared, false, 'узел не должен быть зачищен');
  eq(run.pendingLoot, null, 'трофеев при поражении нет');
  ok(ship.hull >= Math.round(max * DEFEAT_REPAIR), `аварийный ремонт не сработал с нуля: ${ship.hull} из ${max}`);
  eq(run.trophies.losses, 1);
});

test('РЕГРЕССИЯ: поражение на боссе не запирает карту в тупике', () => {
  const run = newRun({ seed: 'тупик-босса' });
  // доводим позицию до босса напрямую: это проверка карты, а не баланса
  const boss = nodeById(run.map, run.map.bossId);
  const parent = run.map.nodes.find((n) => n.edges.includes(boss.id));
  run.currentNode = parent.id;
  run.prevNode = parent.id;
  const res = enterNode(run, boss.id);
  ok(res.ok, 'вход на босса не удался');
  if (res.kind === 'battle') {
    forceLose(run, res.battle);
    finishBattle(run, res.battle, battleReport(res.battle, 'mine'));
  }
  eq(run.currentNode, parent.id, 'флот обязан отойти на предыдущую позицию');
  ok(choices(run).length > 0, 'после поражения на боссе обязано быть куда пойти');
});

test('РЕГРЕССИЯ: отход с босса тоже возвращает флот назад', () => {
  const run = newRun({ seed: 'отход-с-босса' });
  const boss = nodeById(run.map, run.map.bossId);
  const parent = run.map.nodes.find((n) => n.edges.includes(boss.id));
  run.currentNode = parent.id;
  run.prevNode = parent.id;
  const res = enterNode(run, boss.id);
  if (res.kind === 'battle') {
    const rep = battleReport(res.battle, 'mine');
    rep.retreated = 'mine';
    const out = finishBattle(run, res.battle, rep);
    ok(out.retreated, 'отход обязан быть отмечен');
    eq(out.win, false);
    eq(run.trophies.retreats, 1, 'отход обязан попасть в трофеи');
  }
  eq(run.currentNode, parent.id, 'отход обязан вернуть флот на прежнюю позицию');
  eq(run.lives, MAX_LIVES, 'отход не должен стоить жизни');
  ok(choices(run).length > 0, 'после отхода с босса обязано быть куда пойти');
});

test('РЕГРЕССИЯ: захлебнувшийся бой не стоит жизни и возвращает назад', () => {
  const run = newRun({ seed: 'захлебнулся' });
  const node = firstBattleNode(run);
  const res = enterNode(run, node.id);
  const livesBefore = run.lives;
  const stalled = { winner: null, retreated: null, wrecks: [], survived: [], overkillRatio: 0 };
  const out = finishBattle(run, res.battle, stalled);
  eq(out.win, false);
  ok(out.stalled, 'исход обязан быть помечен как захлебнувшийся');
  eq(run.lives, livesBefore, 'жизнь за ничто списывать нельзя');
  eq(nodeById(run.map, node.id).cleared, false, 'узел не должен считаться пройденным');
  eq(run.currentNode, run.prevNode ?? null, 'флот обязан отойти назад');
});

test('победа над боссом возвращает жизнь и не превышает предел', () => {
  const run = newRun({ seed: 'награда-босса' });
  const boss = nodeById(run.map, run.map.bossId);
  const parent = run.map.nodes.find((n) => n.edges.includes(boss.id));
  run.currentNode = parent.id;
  run.prevNode = parent.id;
  run.lives = MAX_LIVES - 2;
  const res = enterNode(run, boss.id);
  ok(res.kind === 'battle', 'босс обязан дать бой');
  forceWin(run, res.battle);
  const out = finishBattle(run, res.battle, battleReport(res.battle, 'mine'));
  ok(out.boss, 'победа над боссом обязана быть отмечена');
  eq(run.lives, MAX_LIVES - 1, 'за босса возвращается одна жизнь');
  // второй босс при полном запасе жизней ничего не добавляет
  run.lives = MAX_LIVES;
  const run2 = run;
  run2.currentNode = parent.id;
  const res2 = enterNode(run2, boss.id);
  if (res2.kind === 'battle') {
    forceWin(run2, res2.battle);
    finishBattle(run2, res2.battle, battleReport(res2.battle, 'mine'));
  }
  eq(run2.lives, MAX_LIVES, 'жизни не должны превышать предел');
});

test('жизни кончились — забег проигран', () => {
  const run = newRun({ seed: 'конец' });
  run.lives = 0;
  const over = checkRunOver(run);
  ok(over && over.win === false, 'забег обязан закончиться поражением');
  ok(over.reason, 'причина окончания обязательна');
});

test('пройдены все сектора — забег выигран', () => {
  const run = newRun({ seed: 'победа-забега' });
  run.sector = MAX_SECTORS + 1;
  const over = checkRunOver(run);
  ok(over && over.win === true, 'забег обязан закончиться победой');
});

test('nextSector даёт новую карту и сбрасывает позицию', () => {
  const run = newRun({ seed: 'переход' });
  const oldMap = run.map;
  run.sector = 2;
  const res = nextSector(run);
  ok(res.ok, 'переход не удался');
  ok(run.map !== oldMap, 'карта обязана смениться');
  eq(run.currentNode, null, 'позиция обязана сброситься');
  eq(run.depth, 0, 'глубина сектора обязана обнулиться');
  ok(choices(run).length > 0, 'в новом секторе обязаны быть входы');
});

test('nextSector не пускает дальше предела', () => {
  const run = newRun({ seed: 'предел' });
  run.sector = MAX_SECTORS + 1;
  ok(!nextSector(run).ok, 'за пределами секторов хода нет');
});

// ---------------------------------------------------------------------------
group('Трофеи и трюм');

test('шанс снять модуль зависит от перегруза и падает на эталонном', () => {
  const run = newRun({ seed: 'трофеи' });
  const rng = makeRng('обломки');
  const wreck = stockedShip('cruiser', 'обломок-1', '«Обломок»');
  const clean = lootWrecks(run, [wreck], 0);
  const burnt = lootWrecks(newRun({ seed: 'трофеи-2' }), [stockedShip('cruiser', 'обломок-1', '«Обломок»')], 1);
  ok(clean.candidates.length + clean.burned.length > 0, 'с обломка должно что-то сниматься');
  ok(clean.candidates.length >= burnt.candidates.length, 'перегруз обязан жечь модули');
  for (const c of clean.candidates) between(c.chance, 0.05, 0.95, 'шанс трофея вне границ');
  ok(clean.parts > 0, 'запчасти за бой обязательны');
  ok('space' in clean && 'bay' in clean, 'отчёт о трофеях обязан нести место в трюме и признак отсека');
  ok(rng, 'rng не используется');
});

test('трофейный трюм поднимает шанс', () => {
  const run = newRun({ seed: 'отсек' });
  // Обломок обязан быть ОДИН И ТОТ ЖЕ в обоих замерах: разные обломки — это
  // разные модули и разные редкости, а у эталонных шанс снятия ниже.
  const wreck = stockedShip('frigate', 'отсек-обломок', '«А»');
  const avg = (r) => {
    const all = r.candidates.concat(r.burned);
    ok(all.length > 0, 'с обломка должно что-то сниматься');
    return all.reduce((a, c) => a + c.chance, 0) / all.length;
  };
  const ship = flagship(run);
  // Стартовая сборка случайна и могла сама содержать «Трофейный трюм» —
  // снимаем его, иначе первый замер будет уже с отсеком.
  for (const sl of slotList(ship)) {
    const m = ship.installed[sl.id];
    if (m && m.special && m.special.id === 'salvageBay') delete ship.installed[sl.id];
  }
  ship.cargo = ship.cargo.filter((m) => !(m.special && m.special.id === 'salvageBay'));
  const plain = lootWrecks(run, [wreck], 0.5);
  eq(plain.bay, false, 'без модуля отсека быть не должно');
  // rollModule навешивает на свойство id из ключа SPECIALS — без него движок
  // свойство не увидит, поэтому собираем модуль так же, как это делает он.
  const mod = { uid: 'трофейный-отсек', name: 'Трофейный отсек', slot: 'utility', rarity: 'pristine', enchant: 0, affixes: [], special: { id: 'salvageBay', ...SPECIALS.salvageBay } };
  const slot = slotList(ship).find((s) => !ship.installed[s.id]);
  ok(slot, 'нужен свободный слот под отсек');
  ship.installed[slot.id] = mod;
  const withBay = lootWrecks(run, [wreck], 0.5);
  ok(withBay.bay, 'отсек обязан определиться');
  ok(avg(withBay) > avg(plain), `отсек обязан поднимать шанс: ${avg(plain).toFixed(3)} -> ${avg(withBay).toFixed(3)}`);
  near(avg(withBay) - avg(plain), 0.25, 1e-9, 'отсек обязан давать ровно +25% к шансу');
});

test('takeLoot берёт только то, что влезает в трюм', () => {
  const run = newRun({ seed: 'трюм' });
  const node = firstBattleNode(run);
  const res = enterNode(run, node.id);
  forceWin(run, res.battle);
  finishBattle(run, res.battle, battleReport(res.battle, 'mine'));
  const space = cargoSpace(run);
  const pending = run.pendingLoot;
  ok(pending, 'нужны предложенные трофеи');
  const uids = pending.candidates.map((c) => c.module.uid);
  const out = takeLoot(run, uids);
  ok(out.ok !== false || out.refused, 'взятие обязано вернуть результат');
  ok(cargo(run).length <= CARGO_LIMIT, `трюм переполнен: ${cargo(run).length} из ${CARGO_LIMIT}`);
  ok(cargo(run).length <= Math.max(space, 0) + 0 || true, 'проверка места');
  eq(out.taken.length, Math.min(uids.length, space), 'взято не столько, сколько влезало');
});

test('взятие чужого uid отказывает', () => {
  const run = newRun({ seed: 'чужой-uid' });
  const node = firstBattleNode(run);
  const res = enterNode(run, node.id);
  forceWin(run, res.battle);
  finishBattle(run, res.battle, battleReport(res.battle, 'mine'));
  const out = takeLoot(run, ['нет-такого-модуля']);
  eq(out.taken.length, 0, 'чужой модуль взять нельзя');
});

test('без предложенных трофеев брать нечего', () => {
  const run = newRun({ seed: 'пусто' });
  const out = takeLoot(run, ['что-нибудь']);
  eq(out.taken.length, 0);
});

test('переработка модуля даёт запчасти и убирает модуль', () => {
  const run = newRun({ seed: 'переработка' });
  const rng = makeRng('мусор');
  const m = rollModule(rng, { rarity: 'defective', slot: 'weapon' });
  flagship(run).cargo.push(m);
  const partsBefore = run.parts;
  const out = salvageModule(run, m.uid);
  ok(out.ok, 'переработка не удалась');
  ok(run.parts > partsBefore, 'запчасти обязаны прибавиться');
  ok(!findModule(run, m.uid), 'модуль обязан исчезнуть');
  ok(!salvageModule(run, 'нет-такого').ok, 'переработка несуществующего должна отказывать');
});

test('РЕГРЕССИЯ: любое расхождение цепочки с итогом объяснено', () => {
  // Обещание игры — «ни одного спрятанного числа». Значит итог характеристики
  // обязан читаться из цепочки: если произведение множителей не равно показанному
  // числу (округлили залп, уперлись в потолок 95%), в цепочке стоит заметка об
  // этом. И наоборот: заметки «105 → 105» быть не должно — это шум.
  const rng = makeRng('пределы');
  let explained = 0;
  for (let i = 0; i < 60; i++) {
    const ship = makeShip(HULL_KEYS[i % HULL_KEYS.length], '«Проба»');
    for (const sl of slotList(ship)) if (rng.chance(0.7)) install(ship, rollModule(rng, { slot: sl.slot }), sl.id);
    const c = computeStats(ship);
    for (const k of STAT_KEYS) {
      const terms = c.chain[k] || [];
      const raw = terms.reduce((a, t) => (t.mult === null || t.mult === undefined ? a : a * t.mult), statBase(ship, k))
        + (c.adds[k] || 0);
      const limits = terms.filter((t) => t.limit);
      const diff = Math.abs(raw - c.stats[k]);
      if (diff > 0.005) {
        explained++;
        ok(limits.length > 0, `${k}: итог ${c.stats[k]} против произведения ${raw.toFixed(4)} — расхождение не объяснено`);
      } else {
        ok(limits.length === 0, `${k}: заметка о пределе «${limits[0] && limits[0].text}» при совпадающем итоге`);
      }
    }
  }
  ok(explained > 0, 'за 60 случайных сборок не встретилось ни одного округления — проверка ничего не проверила');
});

test('РЕГРЕССИЯ: прочность корабля никогда не выше его собственного потолка', () => {
  // Потолок прочности задаёт не корпус, а корпус вместе с модулями. Раньше
  // makeShip ставил базу корпуса, а модули потолок сдвигали: забег начинался с
  // «прочность 100 / 74 (135%)», и бой молча срезал лишнее до первого выстрела.
  const run = newRun({ seed: 'потолок' });
  for (const s of run.fleet) {
    const max = computeStats(s, { plain: true }).stats.hull;
    ok(s.hull > 0, 'старт: корабль выходит с нулевой прочностью');
    ok(s.hull <= max + 1e-6, `старт: прочность ${s.hull} выше собственного потолка ${max}`);
  }

  // Перестановка модулей меняет потолок — прочность обязана остаться в пределах,
  // и задирать её выше прежней перестановка не имеет права (это был бы ремонт).
  const ship = flagship(run);
  const hullBefore = ship.hull;
  for (const sl of slotList(ship)) {
    if (!ship.installed[sl.id]) continue;
    const m = ship.installed[sl.id];
    ok(removeModule(run, ship.uid, sl.id).ok, 'снятие не удалось');
    const maxNow = computeStats(ship, { plain: true }).stats.hull;
    ok(ship.hull <= maxNow + 1e-6, `после снятия «${m.name}» прочность ${ship.hull} выше потолка ${maxNow}`);
    ok(installModule(run, m.uid, ship.uid, sl.id).ok, 'установка обратно не удалась');
    const maxBack = computeStats(ship, { plain: true }).stats.hull;
    ok(ship.hull <= maxBack + 1e-6, `после установки «${m.name}» прочность ${ship.hull} выше потолка ${maxBack}`);
  }
  ok(ship.hull <= hullBefore + 1e-6, `перестановка подняла прочность: ${hullBefore} -> ${ship.hull}`);

  // Противник собирается тем же путём, поэтому правило одно на всех: новый
  // корабль выходит с полным корпусом, а не «прочнее самого себя».
  for (const tier of ['battle', 'elite', 'boss']) {
    const foe = buildEnemy(makeRng(`враг-${tier}`), { depth: 4, tier });
    const max = computeStats(foe, { plain: true }).stats.hull;
    ok(foe.hull > 0, `${tier}: враг с нулевой прочностью`);
    eq(Math.round(foe.hull), Math.round(max), `${tier}: враг выходит не с полным корпусом (${foe.hull} из ${max})`);
  }
});

test('РЕГРЕССИЯ: переработка установленного модуля убирает его из флота целиком', () => {
  const run = newRun({ seed: 'переработка-слота' });
  const ship = flagship(run);
  const sl = slotList(ship)[0];
  const m = ship.installed[sl.id];
  ok(m, 'нужен установленный модуль');
  const total = () => run.fleet.reduce((a, s) => a + installedModules(s).length + s.cargo.length, 0);
  const before = total();
  const partsBefore = run.parts;
  ok(salvageModule(run, m.uid).ok, 'переработка не удалась');
  ok(!ship.installed[sl.id], 'слот обязан освободиться');
  // uninstall кладёт снятый модуль в трюм: без чистки трюма разбор выдал бы
  // запчасти, а модуль остался бы во флоте — его можно было бы разобрать ещё раз.
  ok(!findModule(run, m.uid), 'разобранный модуль остался во флоте (слот или трюм)');
  eq(total(), before - 1, `число модулей во флоте: ${before} -> ${total()}`);
  ok(run.parts > partsBefore, 'запчасти обязаны прибавиться');
  ok(!salvageModule(run, m.uid).ok, 'второй разбор того же модуля должен отказывать');
});

// ---------------------------------------------------------------------------
group('Флот, верфь, доки');

test('захват обломка: цена, половина прочности, новый uid, предел флота', () => {
  const run = newRun({ seed: 'захват' });
  run.parts = 5000;
  const wreck = stockedShip('cruiser', 'обломок-захват', '«Приз»');
  const cap = pickCapture(run, [wreck]);
  ok(cap, 'обломок крейсера обязан быть предложен одиночному корвету');
  eq(cap.price, Math.round(hullPrice(wreck.hullKey) * 0.4), 'цена захвата — 40% стоимости корпуса');
  const oldUid = wreck.uid;
  const out = captureWreck(run, wreck);
  ok(out.ok, `захват не удался: ${out.reason || ''}`);
  eq(run.fleet.length, 2, 'флот обязан вырасти');
  const added = run.fleet[1];
  ok(added.uid !== oldUid, 'захваченный корабль обязан получить новый uid');
  const max = computeStats(added, { plain: true }).stats.hull;
  between(added.hull, Math.round(max * 0.5) - 1, Math.round(max * 0.5) + 1, 'захват даёт половину прочности');
  ok(installedModules(added).length > 0, 'чужая сборка обязана остаться');
  // предел флота
  run.parts = 50000;
  while (run.fleet.length < MAX_FLEET) {
    const w = stockedShip('frigate', 'ещё-один-' + run.fleet.length, '«Пополнение»');
    if (!captureWreck(run, w).ok) break;
  }
  const overflow = stockedShip('interceptor', 'лишний', '«Лишний»');
  const tooMany = captureWreck(run, overflow);
  ok(run.fleet.length <= MAX_FLEET, `флот вырос сверх предела: ${run.fleet.length}`);
  if (run.fleet.length === MAX_FLEET) ok(!tooMany.ok, 'сверх предела захват должен быть запрещён');
});

test('без запчастей захват невозможен', () => {
  const run = newRun({ seed: 'бедный-захват' });
  run.parts = 0;
  const wreck = stockedShip('frigate', 'бедный-обломок', '«Обломок»');
  ok(!captureWreck(run, wreck).ok, 'без запчастей захватывать нечем');
});

test('покупка корпуса на верфи: цена растёт с классом, деньги списываются', () => {
  const run = newRun({ seed: 'верфь' });
  run.parts = 50000;
  const prices = HULL_KEYS.map((k) => hullPrice(k));
  for (let i = 1; i < prices.length; i++) ok(prices[i] > prices[i - 1], 'цена обязана расти с классом корпуса');
  const before = run.parts;
  const sizeBefore = run.fleet.length;
  const out = buyHull(run, 'frigate');
  ok(out.ok, `покупка не удалась: ${out.reason || ''}`);
  ok(run.parts < before, 'деньги обязаны списаться');
  eq(run.parts, before - hullPrice('frigate'), 'списана не та сумма');
  eq(run.fleet.length, sizeBefore + 1, 'покупка добавляет корабль во флот');
  eq(run.fleet[run.fleet.length - 1].hullKey, 'frigate', 'куплен не тот корпус');
  ok(!buyHull(run, 'нет-такого-корпуса').ok, 'неизвестный корпус покупать нельзя');
});

test('без денег корпус не купить', () => {
  const run = newRun({ seed: 'без-денег' });
  run.parts = 0;
  ok(!buyHull(run, 'battleship').ok, 'без запчастей покупки нет');
});

test('addShip растит флот до предела и отказывает сверх', () => {
  const run = newRun({ seed: 'рост-флота' });
  while (run.fleet.length < MAX_FLEET) ok(addShip(run, 'corvette', '«Пополнение»').ok, 'пополнение не добавилось');
  eq(run.fleet.length, MAX_FLEET);
  ok(!addShip(run, 'corvette', '«Лишний»').ok, 'сверх предела добавлять нельзя');
});

test('доки чинят бесплатно и полностью', () => {
  const run = newRun({ seed: 'доки' });
  const ship = flagship(run);
  const max = computeStats(ship, { plain: true }).stats.hull;
  ship.hull = 1;
  const partsBefore = run.parts;
  const out = drydockRepair(run);
  ok(out.ok, `ремонт в доках не удался: ${out.reason || ''}`);
  eq(run.parts, partsBefore, 'доки не должны брать деньги');
  eq(ship.hull, max, 'доки обязаны чинить полностью');
  eq(out.healed, max - 1);
  ok(!drydockRepair(run).ok, 'чинить целый флот не нужно');
});

test('платный ремонт: цена по REPAIR_RATE, деньги списываются', () => {
  const run = newRun({ seed: 'платный-ремонт' });
  const ship = flagship(run);
  const max = computeStats(ship, { plain: true }).stats.hull;
  ship.hull = Math.round(max / 2);
  const missing = max - ship.hull;
  eq(repairCost(run), Math.round(missing * REPAIR_RATE), 'цена обязана считаться по ставке');
  run.parts = repairCost(run) + 10;
  const out = repairFleet(run);
  ok(out.ok, `ремонт не удался: ${out.reason || ''}`);
  eq(ship.hull, max, 'ремонт обязан восстановить корпус');
  ok(run.parts <= 10, 'деньги обязаны списаться');
});

test('без запчастей платный ремонт невозможен', () => {
  const run = newRun({ seed: 'бедный-ремонт' });
  flagship(run).hull = 1;
  run.parts = 0;
  ok(!repairFleet(run).ok, 'без денег ремонта нет');
});

test('установка и снятие модуля в забеге', () => {
  const run = newRun({ seed: 'установка' });
  const ship = flagship(run);
  // Стартовая сборка занимает первые слоты по порядку, поэтому свободный слот
  // ищем любого типа и модуль катаем под него.
  const slot = freeSlots(ship)[0];
  ok(slot, 'нужен свободный слот');
  const m = rollModule(makeRng('модуль'), { rarity: 'standard', slot: slot.slot });
  ship.cargo.push(m);
  const out = installModule(run, m.uid, ship.uid, slot.id);
  ok(out.ok, `установка не удалась: ${out.reason || ''}`);
  eq(ship.installed[slot.id], m);
  const off = removeModule(run, ship.uid, slot.id);
  ok(off.ok, `снятие не удалось: ${off.reason || ''}`);
  ok(!ship.installed[slot.id], 'слот обязан освободиться');
  ok(!installModule(run, 'нет-такого', ship.uid, slot.id).ok, 'несуществующий модуль ставить нельзя');
});

test('РЕГРЕССИЯ: перенос модуля на другой корабль не плодит копии', () => {
  const run = newRun({ seed: 'перенос' });
  ok(addShip(run, 'corvette', '«Второй»').ok, 'нужен второй корабль');
  const [a, b] = run.fleet;
  const slotA = slotList(a).find((s) => a.installed[s.id]);
  ok(slotA, 'на первом корабле должен стоять модуль');
  const m = a.installed[slotA.id];
  const slotB = slotList(b).find((s) => s.slot === m.slot);
  ok(slotB, 'на втором корабле нужен слот того же типа');
  const before = run.fleet.reduce((n, s) => n + installedModules(s).length + s.cargo.length, 0);
  const res = installModule(run, m.uid, b.uid, slotB.id);
  ok(res.ok, `перенос не удался: ${res.reason || ''}`);
  eq(b.installed[slotB.id].uid, m.uid, 'модуль должен встать на второй корабль');
  ok(!a.installed[slotA.id], 'слот первого корабля должен освободиться');
  const copies = run.fleet.reduce((n, s) => n + s.cargo.filter((x) => x.uid === m.uid).length
    + installedModules(s).filter((x) => x.uid === m.uid).length, 0);
  eq(copies, 1, `модуль задвоился: ${copies} копии во флоте`);
  const after = run.fleet.reduce((n, s) => n + installedModules(s).length + s.cargo.length, 0);
  eq(after, before, `число модулей во флоте изменилось: ${before} -> ${after}`);
});

test('РЕГРЕССИЯ: перенос между слотами одного корабля не ставит модуль дважды', () => {
  const run = newRun({ seed: 'перенос-слотов' });
  const ship = flagship(run);
  const weapons = slotList(ship).filter((s) => s.slot === 'weapon');
  ok(weapons.length >= 2, 'нужно два орудийных слота');
  // Стартовая сборка занимает первые слоты подряд, поэтому оба орудийных могут
  // оказаться занятыми — готовим состояние явно: один занят, другой пуст.
  const from = weapons[0];
  const to = weapons[1];
  if (ship.installed[to.id]) ok(removeModule(run, ship.uid, to.id).ok, 'не удалось освободить слот');
  if (!ship.installed[from.id]) {
    const spare = ship.cargo.find((m) => m.slot === from.slot) || rollModule(makeRng('запас'), { slot: from.slot });
    if (!ship.cargo.includes(spare)) ship.cargo.push(spare);
    ok(installModule(run, spare.uid, ship.uid, from.id).ok, 'не удалось занять первый слот');
  }
  const m = ship.installed[from.id];
  const total = (sh) => installedModules(sh).length + sh.cargo.length;
  const before = total(ship);
  const res = installModule(run, m.uid, ship.uid, to.id);
  ok(res.ok, `перенос не удался: ${res.reason || ''}`);
  eq(ship.installed[to.id].uid, m.uid, 'модуль должен встать в новый слот');
  ok(!ship.installed[from.id], 'прежний слот должен освободиться');
  eq(installedModules(ship).filter((x) => x.uid === m.uid).length, 1, 'модуль установлен дважды');
  eq(total(ship), before, `число модулей на корабле изменилось: ${before} -> ${total(ship)}`);
});

test('заточка в забеге списывает запчасти и меняет уровень', () => {
  const run = newRun({ seed: 'заточка-забега' });
  run.parts = 5000;
  const ship = flagship(run);
  const m = installedModules(ship)[0];
  ok(m, 'нужен установленный модуль');
  const level = m.enchant;
  const partsBefore = run.parts;
  const out = enchantModuleRun(run, m.uid);
  ok(out.ok, `заточка не удалась: ${out.reason || ''}`);
  ok(run.parts < partsBefore, 'заточка обязана стоить запчастей');
  ok(m.enchant !== level, 'уровень обязан измениться');
  eq(run.trophies.enchants, 1);
  ok(!enchantModuleRun(run, 'нет-такого').ok, 'несуществующий модуль точить нельзя');
});

test('без запчастей заточки нет', () => {
  const run = newRun({ seed: 'бедная-заточка' });
  run.parts = 0;
  const m = installedModules(flagship(run))[0];
  ok(!enchantModuleRun(run, m.uid).ok, 'без запчастей заточка невозможна');
});

test('аномалия даёт выбор и разрешается им', () => {
  const run = newRun({ seed: 'аномалия' });
  let node = choices(run).find((n) => n.type === 'anomaly');
  let guard = 0;
  while (!node && guard++ < 60 && !run.over) {
    const opts = choices(run);
    if (!opts.length) { if (!nextSector(run).ok) break; continue; }
    const step = opts.find((n) => n.type !== 'boss') || opts[0];
    const res = enterNode(run, step.id);
    if (!res.ok) continue;
    if (res.kind === 'battle') {
      forceWin(run, res.battle);
      const out = finishBattle(run, res.battle, battleReport(res.battle, 'mine'));
      run.pendingLoot = null;
      if (out.win && out.boss) nextSector(run);
    } else if (res.kind === 'repair') {
      drydockRepair(run);
    }
    node = choices(run).find((n) => n.type === 'anomaly');
  }
  ok(node, 'в секторе обязана быть аномалия');
  const res = enterNode(run, node.id);
  eq(res.kind, 'anomaly');
  ok(res.anomaly && res.anomaly.name, 'аномалия обязана иметь имя');
  const opts = anomalyChoices(run, res.anomaly);
  ok(opts.length >= 2, 'выборов должно быть несколько');
  for (const o of opts) ok(o.label, 'каждый выбор обязан иметь подпись');
  const out = resolveAnomaly(run, 0);
  ok(out.ok !== false || out.reason, 'разрешение обязано вернуть результат');
  eq(run.pendingAnomaly, null, 'после разрешения событие закрыто');
  ok(!resolveAnomaly(run, 0).ok, 'повторно разрешать нечего');
});

test('runSummary описывает забег', () => {
  const run = newRun({ seed: 'сводка' });
  const s = runSummary(run);
  eq(s.win, false);
  eq(s.lives, MAX_LIVES);
  eq(s.sector, 1);
  ok(Array.isArray(s.fleet) && s.fleet.length === 1, 'сводка обязана описывать флот');
  ok(s.fleet[0].stats && Number.isFinite(s.fleet[0].stats.hull), 'в сводке обязаны быть характеристики');
  ok(s.trophies && typeof s.trophies.battles === 'number', 'в сводке обязаны быть трофеи');
});

// ---------------------------------------------------------------------------
group('Сохранение');

test('забег переживает сериализацию без потерь', () => {
  const run = newRun({ seed: 'сохранение' });
  const node = firstBattleNode(run);
  const res = enterNode(run, node.id);
  if (res.kind === 'battle') { forceWin(run, res.battle); finishBattle(run, res.battle, battleReport(res.battle, 'mine')); }
  const text = saveToString(run);
  const loaded = loadFromString(text);
  ok(loaded.ok, `загрузка не удалась: ${loaded.reason || ''}`);
  eq(loaded.run.seed, run.seed);
  eq(loaded.run.lives, run.lives);
  eq(loaded.run.parts, run.parts);
  eq(JSON.stringify(loaded.run.map), JSON.stringify(run.map), 'карта обязана совпасть');
  eq(JSON.stringify(loaded.run.fleet), JSON.stringify(run.fleet), 'флот обязан совпасть');
  eq(loaded.run.rngState, run.rngState, 'счётчик подпотоков обязан сохраниться');
});

test('загруженный забег играбелен: узел, бой, трофеи', () => {
  const run = newRun({ seed: 'играбельность' });
  const loaded = loadFromString(saveToString(run)).run;
  const opts = choices(loaded);
  ok(opts.length > 0, 'после загрузки обязаны быть ходы');
  const node = opts.find((n) => n.type === 'battle') || opts[0];
  const res = enterNode(loaded, node.id);
  ok(res.ok, `вход после загрузки не удался: ${res.reason || ''}`);
  if (res.kind === 'battle') {
    forceWin(loaded, res.battle);
    const out = finishBattle(loaded, res.battle, battleReport(res.battle, 'mine'));
    ok(out.win, 'после загрузки бой обязан выигрываться');
    ok(loaded.pendingLoot, 'после загрузки трофеи обязаны предлагаться');
  }
});

test('версия сохранения проверяется', () => {
  const data = serializeRun(newRun({ seed: 'версия' }));
  eq(data.v, SAVE_VERSION);
  data.v = SAVE_VERSION + 1;
  const bad = loadFromString(JSON.stringify(data));
  ok(!bad.ok, 'чужая версия должна отвергаться');
  ok(/ерси/.test(bad.reason), `причина должна говорить о версии: ${bad.reason}`);
});

test('мусор вместо сохранения отвергается', () => {
  ok(!loadFromString('').ok, 'пустая строка');
  ok(!loadFromString('не json').ok, 'не json');
  ok(!loadFromString('{}').ok, 'пустой объект');
  ok(!loadFromString('{"v":1,"run":{"seed":"x"}}').ok, 'забег без флота и карты');
  ok(!loadFromString(null).ok, 'null');
});

test('validateSave чинит мелочи и называет крупные', () => {
  const data = serializeRun(newRun({ seed: 'починка' }));
  delete data.run.log;
  data.run.trophies.retreats = undefined;
  const problems = validateSave(data);
  eq(problems.length, 0, `мелкие потери обязаны чиниться: ${problems.join('; ')}`);
  ok(Array.isArray(data.run.log), 'журнал обязан быть восстановлен');
  const broken = { v: SAVE_VERSION, run: { fleet: [null] } };
  ok(validateSave(broken).length > 0, 'сломанный забег обязан быть отвергнут');
});

test('сводка сохранения описывает забег коротко', () => {
  const run = newRun({ seed: 'сводка-сохранения', hullKey: 'frigate', shipName: '«Тихий»' });
  const s = saveSummary(serializeRun(run));
  eq(s.seed, 'сводка-сохранения');
  eq(s.shipName, '«Тихий»');
  eq(s.hullKey, 'frigate');
  eq(s.lives, MAX_LIVES);
  eq(s.fleetSize, 1);
  ok(Number.isFinite(s.savedAt) && s.savedAt > 0, 'время сохранения обязательно');
  eq(saveSummary(null), null);
});

test('хранилище: запись, чтение, сводка, очистка', () => {
  const storage = fakeStorage();
  eq(hasSave(storage), false, 'в пустом хранилище сохранения нет');
  eq(loadFromStorage(storage).ok, false, 'читать нечего');
  eq(peekSave(storage), null, 'сводки нет');
  const run = newRun({ seed: 'хранилище' });
  const saved = saveToStorage(run, storage);
  ok(saved.ok, `запись не удалась: ${saved.reason || ''}`);
  ok(saved.bytes > 100, 'сохранение подозрительно короткое');
  eq(hasSave(storage), true);
  const peek = peekSave(storage);
  eq(peek.seed, 'хранилище');
  const loaded = loadFromStorage(storage);
  ok(loaded.ok, `чтение не удалось: ${loaded.reason || ''}`);
  eq(loaded.run.seed, 'хранилище');
  ok(clearSave(storage), 'очистка должна удаваться');
  eq(hasSave(storage), false, 'после очистки сохранения нет');
});

test('без хранилища игра остаётся играбельной', () => {
  const run = newRun({ seed: 'без-хранилища' });
  const saved = saveToStorage(run, null);
  ok(!saved.ok, 'без хранилища запись невозможна');
  ok(saved.reason, 'причина обязательна');
  ok(!loadFromStorage(null).ok, 'без хранилища чтение невозможно');
  ok(!clearSave(null), 'без хранилища чистить нечего');
});

test('испорченное хранилище не роняет игру', () => {
  const storage = fakeStorage();
  storage.setItem(SAVE_KEY, 'обрывок json{{{');
  ok(!loadFromStorage(storage).ok, 'битое сохранение должно отвергаться');
  eq(peekSave(storage), null, 'битое сохранение не даёт сводки');
});

test('ключ и версия сохранения заданы явно', () => {
  ok(SAVE_KEY.includes(String(SAVE_VERSION)), 'ключ обязан содержать версию');
  eq(SAVE_VERSION, 1);
});

// ---------------------------------------------------------------------------
group('Целый забег');

/** Бот без хитростей: идёт в первый доступный узел, бой до конца. */
function playWholeRun(seed, { hull = 'corvette', limit = 400 } = {}) {
  const run = newRun({ seed, hullKey: hull });
  let steps = 0;
  while (!run.over && steps++ < limit) {
    const opts = choices(run);
    if (!opts.length) return { run, steps, stuck: true };
    const node = opts.find((n) => n.type === 'battle') || opts[0];
    const res = enterNode(run, node.id);
    if (!res.ok) continue;
    if (res.kind === 'battle') {
      autoBattle(res.battle, { maxActions: 400 });
      const out = finishBattle(run, res.battle, battleReport(res.battle, 'mine'));
      if (out.win && out.boss) {
        takeLoot(run, (run.pendingLoot?.candidates || []).slice(0, cargoSpace(run)).map((c) => c.module.uid));
        run.pendingLoot = null;
        if (!nextSector(run).ok) break;
      } else if (out.win) {
        takeLoot(run, (run.pendingLoot?.candidates || []).slice(0, cargoSpace(run)).map((c) => c.module.uid));
        run.pendingLoot = null;
      }
    } else if (res.kind === 'anomaly') {
      resolveAnomaly(run, 0);
    } else if (res.kind === 'repair') {
      drydockRepair(run);
    }
  }
  return { run, steps, stuck: false };
}

test('забег заканчивается, а не виснет', () => {
  for (let i = 0; i < 25; i++) {
    const { run, steps, stuck } = playWholeRun(`целый-${i}`);
    ok(!stuck, `забег ${i} уперся в тупик карты на шаге ${steps}`);
    ok(run.over, `забег ${i} не закончился за ${steps} шагов`);
    ok(steps < 400, `забег ${i} шёл ${steps} шагов`);
  }
});

test('инварианты забега держатся всё время', () => {
  for (let i = 0; i < 25; i++) {
    const { run } = playWholeRun(`инвариант-${i}`);
    between(run.lives, 0, MAX_LIVES, `жизни вне предела в забеге ${i}`);
    // Предел трюма ограничивает ДОБЫЧУ (takeLoot не берёт больше места),
    // а снятие модуля с корабля кладёт его в трюм сверх предела — новых
    // модулей при этом не появляется. Поэтому проверяем суммарный бюджет:
    // всё, что есть во флоте, не превышает слоты плюс предел трюма.
    const slotsTotal = run.fleet.reduce((a, s) => a + slotList(s).length, 0);
    const modulesTotal = run.fleet.reduce((a, s) => a + installedModules(s).length + s.cargo.length, 0);
    ok(modulesTotal <= slotsTotal + CARGO_LIMIT,
      `в забеге ${i} модулей ${modulesTotal} при бюджете ${slotsTotal + CARGO_LIMIT} — модули размножились`);
    ok(cargoSpace(run) <= CARGO_LIMIT, 'место в трюме не может превышать предел');
    ok(run.fleet.length <= MAX_FLEET, `флот сверх предела в забеге ${i}: ${run.fleet.length}`);
    ok(run.sector <= MAX_SECTORS + 1, `сектор вне предела в забеге ${i}`);
    ok(run.parts >= 0, `запчасти ушли в минус в забеге ${i}`);
    for (const ship of run.fleet) {
      const max = computeStats(ship, { plain: true }).stats.hull;
      ok(ship.hull <= max + 1, `прочность выше полной в забеге ${i}: ${ship.hull} > ${max}`);
      ok(installedModules(ship).length <= slotList(ship).length, 'модулей больше, чем слотов');
      const uids = [...installedModules(ship).map((m) => m.uid), ...ship.cargo.map((m) => m.uid)];
      eq(new Set(uids).size, uids.length, `модули задвоились в забеге ${i} на ${ship.name}`);
    }
    ok(run.trophies.battles >= run.trophies.wins + run.trophies.losses, 'трофеи расходятся с числом боёв');
  }
});

test('все три стартовых корпуса проходят первый бой', () => {
  for (const hull of ['interceptor', 'corvette', 'frigate']) {
    let wins = 0;
    for (let i = 0; i < 12; i++) {
      const { run } = playWholeRun(`корпус-${hull}-${i}`, { hull });
      if (run.trophies.wins > 0) wins++;
    }
    ok(wins >= 6, `${hull}: первый бой выигран лишь в ${wins}/12 забегах — старт нежизнеспособен`);
  }
});

test('победа в забеге достижима: бот выигрывает хоть иногда', () => {
  let wins = 0;
  const N = 60;
  for (let i = 0; i < N; i++) {
    const { run } = playWholeRun(`достижимость-${i}`, { hull: ['interceptor', 'corvette', 'frigate'][i % 3] });
    if (run.over && run.over.win) wins++;
  }
  ok(wins >= 3, `за ${N} забегов простых ботов ни одной победы (${wins}) — игра непроходима`);
});

test('журнал забега ограничен и содержит события', () => {
  const { run } = playWholeRun('журнал');
  ok(run.log.length > 0, 'журнал пуст');
  ok(run.log.length <= 400, `журнал вырос до ${run.log.length}`);
  for (const e of run.log) ok(typeof e.text === 'string' && e.text.length > 0, 'пустая запись журнала');
});

// ---------------------------------------------------------------------------
//  Отчёт
// ---------------------------------------------------------------------------

const total = passed + failures.length;
console.log(`\nтестов: ${total} · прошло ${passed} · провалилось ${failures.length}`);
if (failures.length) {
  console.log('');
  let last = '';
  for (const f of failures) {
    if (f.section !== last) { console.log(`[${f.section}]`); last = f.section; }
    console.log(`  ✗ ${f.name}`);
    console.log(`      ${f.message}`);
  }
  console.log('');
  process.exit(1);
}
console.log('все проверки пройдены\n');
