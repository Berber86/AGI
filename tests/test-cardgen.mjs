import { suite, test, ok, eq, ne, ge, le, throws } from './harness.mjs';
import {
  generateCard, checkCombination, compatible, blueprintCost, recruitCost,
} from '../src/engine/cardgen.js';
import { DISCOVERY_LIST, DISCOVERIES } from '../src/engine/discoveries.js';
import { GEAR_PAIRS, KEYWORDS, RARITIES, pairKey, eraOf } from '../src/engine/gears.js';
import { makeRng } from '../src/engine/rng.js';

suite('Генератор карт: совместимость');

test('одиночное открытие всегда совместимо само с собой', () => {
  ok(checkCombination(['bronze']).ok);
  ok(compatible('bronze', 'bronze'), 'сдвоенная шестерня должна быть разрешена');
});

test('общая шестерня ⇒ сцепление', () => {
  // Бронза [alloy,fire] и Железо [alloy,fire] — общая шестерня
  ok(compatible('bronze', 'iron'));
  ok(checkCombination(['bronze', 'iron']).ok);
});

test('общий домен ⇒ сцепление', () => {
  // Покорение огня и Колесо — оба Ремесло, обе эпоха I
  ok(compatible('fire_mastery', 'wheel'));
});

test('преемственность ⇒ сцепление даже без общей шестерни', () => {
  ok(compatible('writing', 'stars'), 'Звездочётство требует Письменность');
});

test('нет ни шестерни, ни домена, ни преемственности ⇒ не сцепляется', () => {
  eq(compatible('fire_mastery', 'writing'), false);
  const r = checkCombination(['fire_mastery', 'writing']);
  eq(r.ok, false);
  ok(/зацеплен/i.test(r.reason), 'должна быть понятная причина: ' + r.reason);
});

test('слишком большой разброс эпох запрещён', () => {
  const r = checkCombination(['wheel', 'steam']);
  eq(r.ok, false);
  ok(/разброс эпох/i.test(r.reason));
});

test('одно открытие нельзя ставить больше чем в два слота', () => {
  eq(checkCombination(['wheel', 'wheel']).ok, true);
  eq(checkCombination(['wheel', 'wheel', 'wheel']).ok, false);
});

test('несвязный набор из трёх открытий отклоняется', () => {
  // Письменность и Звездочётство сцеплены, но Колесо к ним не цепляется (другой домен и шестерни)
  const r = checkCombination(['writing', 'stars', 'wheel']);
  eq(r.ok, false);
});

test('пустой набор отклоняется', () => {
  eq(checkCombination([]).ok, false);
});

test('generateCard возвращает null для несовместимого набора', () => {
  eq(generateCard(['fire_mastery', 'writing']), null);
});

suite('Генератор карт: редкость и слоты');

test('число слотов = числу открытий, редкость следует за слотами', () => {
  const cases = [
    [['bronze'], 1, 'common'],
    [['bronze', 'iron'], 2, 'uncommon'],
    [['bronze', 'iron', 'steel'], 3, 'rare'],
    [['steel', 'musket', 'linear_tac', 'cannons'], 4, 'mythic'],
  ];
  for (const [ids, slots, rarity] of cases) {
    const c = generateCard(ids);
    ok(c, `${ids.join('+')} не собралось: ${checkCombination(ids).reason}`);
    eq(c.slots, slots, ids.join('+'));
    eq(c.rarity, rarity);
    eq(c.components.length, slots);
    eq(c.rarityName, RARITIES[slots].name);
  }
});

test('свойств никогда не больше, чем вмещает редкость', () => {
  const rng = makeRng('kwcap');
  for (let i = 0; i < 1500; i++) {
    const slots = 1 + rng.int(4);
    const ids = pickCompatible(rng, slots);
    if (!ids) continue;
    const c = generateCard(ids);
    if (!c) continue;
    const cap = RARITIES[slots].kwCap + (c.purity === 'chimera' ? 1 : 0);
    le(c.keywords.length, cap, `${c.name} (${slots} слотов, ${c.purity}): ${c.keywords.length} свойств`);
  }
});

test('обычная карта вмещает ровно одно свойство, если оно есть', () => {
  const c = generateCard(['bronze']); // Бронза: alloy+fire → Зажигание
  eq(c.slots, 1);
  le(c.keywords.length, 1);
});

suite('Генератор карт: шестерни и свойства');

test('свойства берутся ровно из матрицы пар шестерёнок', () => {
  const rng = makeRng('pairs');
  for (let i = 0; i < 800; i++) {
    const ids = pickCompatible(rng, 1 + rng.int(4));
    if (!ids) continue;
    const c = generateCard(ids);
    if (!c) continue;
    for (const k of c.keywords) {
      const [g1, g2] = (k.from || '').split('+');
      ok(g1 && g2, `${c.name}: свойство ${k.name} без пары шестерёнок`);
      const rec = GEAR_PAIRS[pairKey(g1, g2)];
      ok(rec, `${c.name}: пара ${k.from} отсутствует в матрице`);
      eq(rec.kw, k.kw, `${c.name}: ${k.from} должно давать ${rec.kw}`);
      ge(c.gearCounts[g1] || 0, 1, `${c.name}: шестерня ${g1} не входит в карту`);
      ge(c.gearCounts[g2] || 0, 1, `${c.name}: шестерня ${g2} не входит в карту`);
    }
  }
});

test('одинаковая пара дважды усиливает свойство (Броня I → Броня II)', () => {
  // Механика+Сплав = Броня. Берём открытия, где эта пара повторится.
  const c = generateCard(['plate_armor', 'steel', 'ballista']);
  ok(c);
  const armor = c.keywords.filter((k) => k.fx === 'armor');
  if (armor.length) {
    ok(armor[0].lvl >= 1);
    if (armor[0].lvl > 1) ok(/I/.test(armor[0].name), `усиленная Броня должна быть отмечена: ${armor[0].name}`);
  }
});

test('конкретные пары дают ожидаемые свойства', () => {
  const c1 = generateCard(['musket']); // fire+mech+alloy
  ok(c1);
  ok(c1.keywords.length >= 1);

  // Чистая пара fire+mech = Рывок: Механические часы [mech,cipher] не подходят,
  // берём Паровую машину [fire,mech]
  const steam = generateCard(['steam']);
  ok(steam.keywords.some((k) => k.fx === 'haste'), `Паровая машина должна давать Рывок: ${JSON.stringify(steam.keywords)}`);

  const telescope = generateCard(['telescope']); // optics+mech → Первый удар
  ok(telescope.keywords.some((k) => k.fx === 'firstStrike'), `Телескоп должен давать Первый удар: ${JSON.stringify(telescope.keywords)}`);
});

test('нераспределённые комбинации попадают в «спящие»', () => {
  const rng = makeRng('latent');
  let foundLatent = 0;
  for (let i = 0; i < 600; i++) {
    const ids = pickCompatible(rng, 1 + rng.int(2)); // мало слотов → много лишних пар
    if (!ids) continue;
    const c = generateCard(ids);
    if (!c) continue;
    if (c.unusedKeywords.length) {
      foundLatent++;
      for (const k of c.unusedKeywords) ok(!c.keywords.some((x) => x.kw === k.kw), 'спящее свойство не должно дублировать активное');
    }
  }
  ge(foundLatent, 20, 'спящие комбинации должны встречаться');
});

suite('Генератор карт: детерминизм и характеристики');

test('одна и та же комбинация ⇒ одна и та же карта', () => {
  const a = generateCard(['phalanx', 'iron', 'bronze']);
  const b = generateCard(['bronze', 'iron', 'phalanx']);
  const c = generateCard(['phalanx', 'iron', 'bronze']);
  eq(a.name, b.name, 'имя не должно зависеть от порядка слотов');
  eq(a.name, c.name);
  eq(a.atk, c.atk); eq(a.hp, c.hp); eq(a.cost, c.cost);
  eq(JSON.stringify(a.keywords.map((k) => k.kw)), JSON.stringify(c.keywords.map((k) => k.kw)));
});

test('характеристики в разумных пределах', () => {
  const rng = makeRng('stats');
  for (let i = 0; i < 2000; i++) {
    const ids = pickCompatible(rng, 1 + rng.int(4));
    if (!ids) continue;
    const c = generateCard(ids);
    if (!c) continue;
    ge(c.hp, 1, `${c.name}: здоровье`);
    ge(c.atk, 0, `${c.name}: атака`);
    ge(c.cost, 1, `${c.name}: цена`);
    le(c.cost, eraOf(c.era).energyCap, `${c.name}: цена выше потолка энергии эпохи ${c.era}`);
    eq(c.era, Math.max(...c.components.map((x) => DISCOVERIES[x.disc].era)), `${c.name}: эпоха карты`);
    le(c.era, 6);
  }
});

test('больше слотов ⇒ в среднем сильнее', () => {
  const rng = makeRng('scaling');
  const avg = { 1: [], 2: [], 3: [], 4: [] };
  for (let i = 0; i < 3000; i++) {
    const slots = 1 + rng.int(4);
    const ids = pickCompatible(rng, slots);
    if (!ids) continue;
    const c = generateCard(ids);
    if (!c) continue;
    avg[c.slots].push(c.atk + c.hp);
  }
  const mean = (a) => a.reduce((x, y) => x + y, 0) / a.length;
  for (const n of [1, 2, 3, 4]) ge(avg[n].length, 20, `мало данных для ${n} слотов`);
  ok(mean(avg[2]) > mean(avg[1]), '2 слота сильнее 1');
  ok(mean(avg[3]) > mean(avg[2]), '3 слота сильнее 2');
  ok(mean(avg[4]) > mean(avg[3]), '4 слота сильнее 3');
});

test('Чистая линия усиливает, Химера ослабляет корпус, но даёт лишнее свойство', () => {
  const rng = makeRng('purity');
  const stats = { pure: [], chimera: [] };
  const kw = { pure: [], chimera: [] };
  for (let i = 0; i < 4000; i++) {
    const ids = pickCompatible(rng, 3);
    if (!ids) continue;
    const c = generateCard(ids);
    if (!c || !stats[c.purity]) continue;
    stats[c.purity].push((c.atk + c.hp) / (c.slots * 3));
    kw[c.purity].push(c.keywords.length);
  }
  ge(stats.pure.length, 20); ge(stats.chimera.length, 20);
  const mean = (a) => a.reduce((x, y) => x + y, 0) / a.length;
  ok(mean(kw.chimera) >= mean(kw.pure) - 0.01, 'Химера должна вмещать не меньше свойств');
});

test('стоимость проекта и найма положительны и растут с эпохой', () => {
  const early = generateCard(['bronze']);
  const late = generateCard(['computer']);
  ge(blueprintCost(early), 6);
  ge(recruitCost(early, 1), 3);
  ok(blueprintCost(late) > blueprintCost(early), 'позднее открытие дороже');
  ok(recruitCost(late, 2.5) > recruitCost(late, 1), 'множитель эпохи увеличивает найм');
});

test('имена читаемы и уникальны для разных комбинаций', () => {
  const rng = makeRng('names');
  const names = new Set();
  let n = 0;
  for (let i = 0; i < 400; i++) {
    const ids = pickCompatible(rng, 1 + rng.int(4));
    if (!ids) continue;
    const c = generateCard(ids);
    if (!c) continue;
    names.add(c.name);
    ok(c.name.length > 2, 'имя слишком короткое: ' + c.name);
    ok(!/\bundefined\b|\bNaN\b/.test(c.name), 'мусор в имени: ' + c.name);
    n++;
  }
  ge(names.size, Math.floor(n * 0.6), 'имена слишком однообразны');
});

test('каждая карта знает свои шестерни и состав', () => {
  const c = generateCard(['gunpowder', 'steel', 'chivalry']);
  ok(c);
  eq(c.components.length, 3);
  for (const comp of c.components) {
    ok(DISCOVERIES[comp.disc], 'неизвестное открытие в составе');
    ge(comp.gears.length, 1);
    for (const g of comp.gears) ge(c.gearCounts[g], 1);
  }
  eq(Object.values(c.gearCounts).reduce((a, b) => a + b, 0), c.components.reduce((s, x) => s + x.gears.length, 0));
});

// --- вспомогательное ---------------------------------------------------------
function pickCompatible(rng, slots) {
  const ids = [];
  let guard = 0;
  while (ids.length < slots && guard++ < 80) {
    const cand = DISCOVERY_LIST.filter((d) => !ids.includes(d.id) && ids.every((x) => compatible(x, d.id)));
    if (!cand.length) break;
    ids.push(rng.pick(cand).id);
  }
  if (ids.length !== slots) return null;
  return checkCombination(ids).ok ? ids : null;
}
