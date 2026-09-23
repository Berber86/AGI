import { suite, test, ok, eq, ne, ge, le } from './harness.mjs';
import { DISCOVERY_LIST, DISCOVERIES, isAvailable } from '../src/engine/discoveries.js';
import { GEARS, GEAR_IDS, GEAR_PAIRS, KEYWORDS, DOMAINS, DOMAIN_IDS, ERAS, RARITIES, pairKey, pairToKeyword, eraOf } from '../src/engine/gears.js';

suite('Данные: открытия');

test('все id уникальны и есть в индексе', () => {
  const ids = DISCOVERY_LIST.map((d) => d.id);
  eq(new Set(ids).size, ids.length);
  eq(Object.keys(DISCOVERIES).length, ids.length);
});

test('шестерни и домены валидны, 1–3 шестерни на открытие', () => {
  for (const d of DISCOVERY_LIST) {
    ge(d.gears.length, 1, `${d.id}: нет шестерён`);
    le(d.gears.length, 3, `${d.id}: слишком много шестерён`);
    for (const g of d.gears) ok(GEAR_IDS.includes(g), `${d.id}: неизвестная шестерня ${g}`);
    ok(DOMAIN_IDS.includes(d.domain), `${d.id}: неизвестный домен ${d.domain}`);
  }
});

test('предшественники существуют и не старше самого открытия', () => {
  for (const d of DISCOVERY_LIST) {
    for (const p of d.prereq) {
      const pd = DISCOVERIES[p];
      ok(pd, `${d.id}: нет предшественника ${p}`);
      le(pd.era, d.era, `${d.id}: предшественник ${p} из более поздней эпохи`);
      ne(p, d.id, `${d.id}: сам себе предшественник`);
    }
  }
});

test('в каждой эпохе есть открытия всех пяти доменов или почти всех', () => {
  for (let era = 1; era <= 6; era++) {
    const list = DISCOVERY_LIST.filter((d) => d.era === era);
    ge(list.length, 10, `эпоха ${era}: мало открытий`);
    const doms = new Set(list.map((d) => d.domain));
    ge(doms.size, 3, `эпоха ${era}: покрыто доменов ${doms.size}`);
  }
});

test('в первой эпохе есть открытия без предшественников (точка входа)', () => {
  const roots = DISCOVERY_LIST.filter((d) => d.era === 1 && d.prereq.length === 0);
  ge(roots.length, 4);
});

test('каждое открытие достижимо: нет циклов в графе предшественников', () => {
  const seen = new Set();
  const stack = new Set();
  const walk = (id) => {
    if (stack.has(id)) throw new Error('цикл у ' + id);
    if (seen.has(id)) return;
    stack.add(id);
    for (const p of DISCOVERIES[id].prereq) walk(p);
    stack.delete(id);
    seen.add(id);
  };
  for (const d of DISCOVERY_LIST) walk(d.id);
  eq(seen.size, DISCOVERY_LIST.length);
});

test('isAvailable честен: без предшественников открытие закрыто', () => {
  const empty = new Set();
  eq(isAvailable('phalanx', empty), false);
  eq(isAvailable('chieftain', empty), true);
  eq(isAvailable('phalanx', new Set(['chieftain', 'iron'])), true);
});

test('у каждого открытия есть имя, noun и adj для генератора имён', () => {
  for (const d of DISCOVERY_LIST) {
    ok(d.name && d.name.length > 1, `${d.id}: нет имени`);
    ok(d.noun && d.noun.length > 1, `${d.id}: нет noun`);
    ok(d.adj && d.adj.length > 2, `${d.id}: нет adj`);
    ge(d.cost, 1, `${d.id}: стоимость`);
    ge(d.atk + d.hp, 1, `${d.id}: нулевой вклад`);
  }
});

suite('Данные: шестерни и свойства');

test('матрица пар полная: 55 комбинаций из 10 шестерёнок', () => {
  eq(Object.keys(GEAR_PAIRS).length, (GEAR_IDS.length * (GEAR_IDS.length + 1)) / 2);
});

test('каждая пара ссылается на существующее свойство', () => {
  for (const [key, rec] of Object.entries(GEAR_PAIRS)) {
    ok(KEYWORDS[rec.kw], `пара ${key} → неизвестное свойство ${rec.kw}`);
    const [a, b] = key.split('+');
    eq(pairKey(a, b), key, `ключ ${key} не отсортирован`);
    ok(GEAR_IDS.includes(a) && GEARS[b] !== undefined, `пара ${key}: неизвестные шестерни`);
  }
});

test('pairToKeyword работает для любой пары шестерёнок', () => {
  for (const a of GEAR_IDS) {
    for (const b of GEAR_IDS) {
      const k = pairToKeyword(a, b);
      ok(k, `${a}+${b}: нет свойства`);
      ok(k.name && k.text && k.fx, `${a}+${b}: неполное свойство`);
      ge(k.priority, 1, `${a}+${b}: нет приоритета`);
    }
  }
});

test('у каждого свойства есть обработчик (fx) и описание', () => {
  for (const [id, k] of Object.entries(KEYWORDS)) {
    ok(k.fx, `${id}: нет fx`);
    ok(k.text && k.text.length > 5, `${id}: нет описания`);
    ok(k.name, `${id}: нет имени`);
  }
});

test('все fx из свойств поддержаны боевым движком', () => {
  const supported = new Set([
    'haste', 'vigilance', 'armor', 'pierce', 'firstStrike', 'doubleStrike', 'trample', 'lifelink',
    'deathtouch', 'siege', 'reach', 'thorns', 'indestructible', 'shroud', 'tactician', 'statBoost',
    'resolve', 'frenzy', 'zeal', 'overload', 'bulwark', 'bond', 'terror', 'growth', 'regenerate',
    'etbDraw', 'etbScry', 'etbCompute', 'etbEnergy', 'etbDiscount', 'etbDrain', 'etbDiscard',
    'etbBlast', 'etbExhaust', 'etbStun', 'etbBroadcast', 'etbInspire', 'etbAdapt', 'etbDivine',
    'etbFortify', 'etbRefine', 'etbSwarm', 'deathZap', 'deathWildfire', 'deathVolatile', 'deathEmp',
    'deathMartyr', 'deathRecall', 'ignite', 'corrode', 'poison', 'endUplink', 'endDraw', 'endPlague',
  ]);
  for (const [id, k] of Object.entries(KEYWORDS)) ok(supported.has(k.fx), `${id}: fx «${k.fx}» не поддержан движком`);
});

suite('Данные: эпохи и редкости');

test('эпох шесть, и здоровье лидера строго растёт', () => {
  eq(ERAS.length, 7);
  for (let e = 2; e <= 6; e++) {
    ok(eraOf(e).leaderHp > eraOf(e - 1).leaderHp, `эпоха ${e}: HP не вырос`);
    ge(eraOf(e).deckSize, eraOf(e - 1).deckSize, `эпоха ${e}: колода`);
    ge(eraOf(e).slots, eraOf(e - 1).slots, `эпоха ${e}: поле`);
    ge(eraOf(e).energyCap, eraOf(e - 1).energyCap, `эпоха ${e}: энергия`);
  }
});

test('редкость = число слотов, и вместимость свойств растёт с ней', () => {
  for (let n = 1; n <= 4; n++) {
    const r = RARITIES[n];
    eq(r.slots, n);
    eq(r.kwCap, n);
    ok(r.name && r.color);
  }
});

test('домены дают разный профиль атаки/здоровья', () => {
  ok(DOMAINS.war.atk > DOMAINS.life.atk, 'Война должна бить сильнее Жизни');
  ok(DOMAINS.life.hp > DOMAINS.war.hp, 'Жизнь должна быть крепче Войны');
  for (const d of Object.values(DOMAINS)) {
    ok(d.gears.length >= 3, `${d.id}: мало шестерён`);
    for (const g of d.gears) ok(GEAR_IDS.includes(g));
  }
});
