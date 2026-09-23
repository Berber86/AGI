/**
 * Модули: случайный трофей, из которого собирается корабль.
 *
 * Модуль — это набор аффиксов поверх слота. Каждый аффикс либо умножает
 * характеристику (×1,36 точность), либо делит её (÷1,18 прочность — внутренне
 * то же ×0,85, но показывается делителем, потому что игрок так о нём думает),
 * либо прибавляет плоскую величину к тем характеристикам, у которых база ноль
 * (поджог, ремонт): умножение нуля всегда ноль, и множитель там был бы
 * бесполезен.
 *
 * Редкость задаёт баланс бонусов и штрафов — и количественно, и качественно:
 *   дефектный  — 1 слабый бонус по нишевой характеристике и 2–3 крепких штрафа
 *                по основным; плюс шанс вредного особого свойства;
 *   штатный    — 2 бонуса и 1–2 штрафа, пулы перемешаны;
 *   эталонный  — 3 крепких бонуса по основным и 0–1 мягкий штраф по нишевой,
 *                особое свойство чаще полезное.
 * «Качественно» важнее цифр: дефектный модуль бьёт по прочности и урону, а не
 * по защите от коррозии, поэтому он плох ровно там, где больно.
 *
 * Имя собирается из доминирующего бонуса (префикс), типа слота (основа) и
 * доминирующего штрафа либо особого свойства (суффикс) — как в Diablo: название
 * рассказывает про предмет, а не просто украшает его.
 */

import { STATS, STAT_KEYS, CORE_KEYS, NICHE_KEYS, ZERO_KEYS, STAT_NAME, fmtMult, fmtNum } from './stats.js';

let seq = 0;

// ---------------------------------------------------------------------------
//  Слоты
// ---------------------------------------------------------------------------

export const SLOTS = {
  weapon:  { name: 'Орудийный',   icon: '🔫' },
  shield:  { name: 'Щитовой',     icon: '🛡' },
  armor:   { name: 'Броневой',    icon: '🧱' },
  engine:  { name: 'Двигательный',icon: '🚀' },
  reactor: { name: 'Реакторный',  icon: '⚛' },
  utility: { name: 'Вспомогательный', icon: '🔧' },
};
export const SLOT_KEYS = Object.keys(SLOTS);

/** Какие характеристики любит слот: из них чаще берутся бонусы. */
const SLOT_AFFINITY = {
  weapon:  ['damage', 'accuracy', 'crit', 'critDmg', 'salvo', 'rate', 'pierce'],
  shield:  ['shield', 'shieldBlock', 'pierce', 'hull'],
  armor:   ['armor', 'hull', 'shield', 'evasion'],
  engine:  ['speed', 'evasion', 'rate', 'hull'],
  reactor: ['repair', 'salvo', 'damage', 'rate', 'shield'],
  utility: ['igniteChance', 'empChance', 'corrodeChance', 'igniteRes', 'empRes', 'corrodeRes', 'crit'],
};

// ---------------------------------------------------------------------------
//  Редкости
// ---------------------------------------------------------------------------

export const RARITIES = {
  defective: {
    key: 'defective', name: 'Дефектный', color: '#8a8f98', weight: 45,
    bonuses: [1, 1], penalties: [2, 3],
    bonusRange: [1.05, 1.18], penaltyRange: [1.15, 1.45],
    bonusPool: 'niche', penaltyPool: 'core',
    specialChance: 0.25, specialGood: 0.15,
    parts: 6,
  },
  standard: {
    key: 'standard', name: 'Штатный', color: '#5c9e4f', weight: 40,
    bonuses: [2, 2], penalties: [1, 2],
    bonusRange: [1.10, 1.32], penaltyRange: [1.05, 1.25],
    bonusPool: 'any', penaltyPool: 'any',
    specialChance: 0.35, specialGood: 0.6,
    parts: 14,
  },
  pristine: {
    key: 'pristine', name: 'Эталонный', color: '#c9a227', weight: 15,
    bonuses: [3, 3], penalties: [0, 1],
    bonusRange: [1.20, 1.55], penaltyRange: [1.02, 1.12],
    bonusPool: 'core', penaltyPool: 'niche',
    specialChance: 0.7, specialGood: 0.92,
    parts: 30,
  },
};
export const RARITY_KEYS = ['defective', 'standard', 'pristine'];

// ---------------------------------------------------------------------------
//  Особые свойства
// ---------------------------------------------------------------------------

export const SPECIALS = {
  // --- полезные ---
  firewall:    { name: 'Противопожарная переборка', good: true, text: 'Корабль не горит: поджог не действует.' },
  faraday:     { name: 'Клетка Фарадея', good: true, text: 'ЭМИ не глушит модули этого корабля.' },
  inox:        { name: 'Нержавеющая обшивка', good: true, text: 'Коррозия не разъедает броню.' },
  vampire:     { name: 'Мародёрский контур', good: true, text: 'Ремонт 6% от нанесённого урона.' },
  overcharge:  { name: 'Перегрузка реактора', good: true, text: 'Первый залп в бою бьёт вдвое сильнее.' },
  lastStand:   { name: 'Аварийный реактор', good: true, text: 'При прочности ниже 25% темп ×1,5.' },
  surge:       { name: 'Аварийный щит', good: true, text: 'Один раз за бой восстанавливает щит до половины.' },
  salvageBay:  { name: 'Трофейный трюм', good: true, text: '+25% к шансу снять модуль с обломков.' },
  duelist:     { name: 'Дуэлянт', good: true, text: '+20% точности, пока враг один.' },
  swarm:       { name: 'Роевик', good: true, text: '+1 выстрел в залпе, если врагов больше одного.' },
  thickSkin:   { name: 'Толстая шкура', good: true, text: 'Крит по вам не усиливается: урон крита ÷1,5.' },
  // --- вредные ---
  pyromaniac:  { name: 'Самовозгорание', good: false, text: 'Каждый ход 12% шанса поджечь собственный корабль.' },
  leak:        { name: 'Течь', good: false, text: 'Теряете 4 прочности каждый свой ход.' },
  shortCircuit:{ name: 'Короткое замыкание', good: false, text: '10% шанса пропустить ход.' },
  brittle:     { name: 'Хрупкая обшивка', good: false, text: 'Крит по вам наносит ×2,5 вместо обычного.' },
  beacon:      { name: 'Маяк', good: false, text: 'Вас чаще выбирают целью.' },
  parasite:    { name: 'Паразитный контур', good: false, text: 'Ремонт не действует.' },
  heavy:       { name: 'Перевес', good: false, text: 'Скорость ÷1,25, пока модуль установлен.' },
};
export const SPECIAL_KEYS = Object.keys(SPECIALS);
const GOOD_SPECIALS = SPECIAL_KEYS.filter((k) => SPECIALS[k].good);
const BAD_SPECIALS = SPECIAL_KEYS.filter((k) => !SPECIALS[k].good);

// ---------------------------------------------------------------------------
//  Имена
// ---------------------------------------------------------------------------

/**
 * Согласование прилагательного с родом основы.
 *
 * Имя модуля обязано читаться по-русски: «Латающая Обшивка», а не «Латающий
 * Обшивка». Все префиксы — стандартные прилагательные на -ый/-ий/-ой, у них
 * женский и средний род образуются заменой окончания, поэтому правило одно.
 */
export function agree(adj, gender) {
  if (gender === 'f') return adj.slice(0, -2) + 'ая';
  if (gender === 'n') return adj.slice(0, -2) + 'ое';
  return adj;
}

const PREFIX_STAT = {
  hull:        ['Крепкий', 'Живучий', 'Несокрушимый', 'Переборчатый'],
  shield:      ['Экранированный', 'Зеркальный', 'Купольный', 'Непроницаемый'],
  armor:       ['Бронированный', 'Чешуйчатый', 'Тяжёлый', 'Плитный'],
  accuracy:    ['Зоркий', 'Меткий', 'Прицельный', 'Дальнобойный'],
  evasion:     ['Вёрткий', 'Скользкий', 'Неуловимый', 'Ртутный'],
  damage:      ['Громовой', 'Сокрушительный', 'Разящий', 'Содрогающий'],
  salvo:       ['Шквальный', 'Многоствольный', 'Ливневый', 'Веерный'],
  rate:        ['Скорострельный', 'Лихорадочный', 'Частый', 'Неудержимый'],
  speed:       ['Стремительный', 'Рваный', 'Быстрый', 'Свистящий'],
  crit:        ['Хищный', 'Роковой', 'Снайперский', 'Хладнокровный'],
  critDmg:     ['Кровавый', 'Дробящий', 'Пронзающий', 'Губительный'],
  shieldBlock: ['Отражающий', 'Гасящий', 'Невозмутимый'],
  pierce:      ['Пробивной', 'Сквозной', 'Иглоподобный'],
  repair:      ['Ремонтный', 'Восстанавливающий', 'Живительный', 'Латающий'],
  igniteChance:['Пылающий', 'Зажигательный', 'Тлеющий', 'Искрящий'],
  igniteRes:   ['Огнеупорный', 'Негорючий', 'Противопожарный'],
  empChance:   ['Глушащий', 'Разрядный', 'Статический'],
  empRes:      ['Экранированный', 'Заземлённый', 'Помехоустойчивый'],
  corrodeChance:['Едкий', 'Кислотный', 'Корродирующий'],
  corrodeRes:  ['Нержавеющий', 'Лужёный', 'Стойкий'],
};

const PREFIX_JUNK = ['Ржавый', 'Кособокий', 'Кустарный', 'Латаный', 'Списанный', 'Гаражный', 'Паяный', 'Треснутый'];
const PREFIX_PLAIN = ['Отлаженный', 'Серийный', 'Уставной', 'Проверенный', 'Служебный', 'Штатный', 'Конвейерный'];
const PREFIX_GRAND = ['Эталонный', 'Звёздный', 'Венценосный', 'Абсолютный', 'Реликтовый', 'Триумфальный', 'Парадный'];

const BASE_SLOT = {
  weapon:  [{ n: 'Рельсотрон', g: 'm' }, { n: 'Излучатель', g: 'm' }, { n: 'Орудие', g: 'n' }, { n: 'Батарея', g: 'f' }, { n: 'Пушка', g: 'f' }, { n: 'Импульсник', g: 'm' }, { n: 'Торпеда', g: 'f' }],
  shield:  [{ n: 'Дефлектор', g: 'm' }, { n: 'Экран', g: 'm' }, { n: 'Купол', g: 'm' }, { n: 'Генератор', g: 'm' }, { n: 'Завеса', g: 'f' }],
  armor:   [{ n: 'Кожух', g: 'm' }, { n: 'Обшивка', g: 'f' }, { n: 'Переборка', g: 'f' }, { n: 'Бронеплита', g: 'f' }, { n: 'Плита', g: 'f' }],
  engine:  [{ n: 'Двигатель', g: 'm' }, { n: 'Ускоритель', g: 'm' }, { n: 'Сопло', g: 'n' }, { n: 'Контур', g: 'm' }, { n: 'Толкатель', g: 'm' }],
  reactor: [{ n: 'Реактор', g: 'm' }, { n: 'Накопитель', g: 'm' }, { n: 'Сердечник', g: 'm' }, { n: 'Ячейка', g: 'f' }, { n: 'Шина', g: 'f' }],
  utility: [{ n: 'Узел', g: 'm' }, { n: 'Матрица', g: 'f' }, { n: 'Прибор', g: 'm' }, { n: 'Блок', g: 'm' }, { n: 'Аппарат', g: 'm' }],
};

const SUFFIX_PENALTY = ['Заплаток', 'Расплаты', 'Износа', 'Перегрузки', 'Отдачи', 'Просадки', 'Ущербности', 'Брака', 'Утечки', 'Люфта'];
const SUFFIX_BAD = ['Самовозгорания', 'Короткого замыкания', 'Течи', 'Хрупкости', 'Маяка', 'Паразитов', 'Перевеса'];
const SUFFIX_GOOD = ['Бездны', 'Пустоты', 'Сверхновой', 'Горизонта', 'Туманности', 'Затмения', 'Пульсара', 'Ориона', 'Квазара'];
const SUFFIX_PLAIN = ['Устава', 'Конвейера', 'Серии', 'Приёмки', 'Гарантии'];

// ---------------------------------------------------------------------------
//  Генерация
// ---------------------------------------------------------------------------

/** Плоские добавки для характеристик с нулевой базой. */
const ADD_RANGE = {
  repair:       [1.0, 4.5],
  igniteChance: [0.06, 0.22],
  empChance:    [0.05, 0.18],
  corrodeChance:[0.06, 0.20],
};

function statPool(rarity, role) {
  const which = role === 'bonus' ? rarity.bonusPool : rarity.penaltyPool;
  if (which === 'core') return CORE_KEYS;
  if (which === 'niche') return NICHE_KEYS;
  return STAT_KEYS;
}

/** Характеристики, к которым слот расположен, всегда в приоритете. */
function weightedStats(rng, pool, slot) {
  const affinity = SLOT_AFFINITY[slot] || [];
  return rng.weighted(pool, (k) => (affinity.includes(k) ? 4 : 1));
}

function makeAffix(rng, stat, role, rarity, used) {
  const def = STATS[stat];
  if (used.has(stat)) return null;
  used.add(stat);

  // Нулевая база: только плоская добавка, и только как бонус. Штраф по
  // характеристике, которой и так нет, ничего бы не значил.
  if (def.kind === 'zero') {
    if (role !== 'bonus') return null;
    const [lo, hi] = ADD_RANGE[stat] || [1, 2];
    const value = rng.float(lo, hi);
    return { key: stat, kind: 'add', value, role, label: `+${def.percent ? Math.round(value * 100) + '%' : fmtNum(value, 1)} ${def.short}` };
  }

  const [lo, hi] = role === 'bonus' ? rarity.bonusRange : rarity.penaltyRange;
  const rolled = rng.float(lo, hi);
  // Штраф храним как множитель < 1, но показываем делителем.
  const value = role === 'bonus' ? rolled : 1 / rolled;
  return {
    key: stat, kind: 'mult', value, role,
    label: `${fmtMult(value)} ${def.short}`,
  };
}

function pickSpecial(rng, rarity) {
  if (!rng.chance(rarity.specialChance)) return null;
  const good = rng.chance(rarity.specialGood);
  const id = rng.pick(good ? GOOD_SPECIALS : BAD_SPECIALS);
  return { id, name: SPECIALS[id].name, text: SPECIALS[id].text, good };
}

/**
 * Префикс — по самому крупному бонусу: имя должно рассказывать про модуль.
 * Если бонусов нет вовсе (редкий брак), берём обидный префикс по редкости.
 */
function pickPrefix(rng, rarity, affixes) {
  const bonuses = affixes.filter((a) => a.role === 'bonus');
  if (bonuses.length) {
    // Крупнейший бонус: для множителя — величина отклонения от единицы,
    // для плоской добавки — нормируем к её диапазону.
    const top = bonuses.reduce((best, a) => {
      const strength = a.kind === 'mult' ? Math.abs(a.value - 1) : (a.value / (ADD_RANGE[a.key]?.[1] || 1));
      const bestStrength = best.kind === 'mult' ? Math.abs(best.value - 1) : (best.value / (ADD_RANGE[best.key]?.[1] || 1));
      return strength > bestStrength ? a : best;
    });
    const pool = PREFIX_STAT[top.key] || PREFIX_PLAIN;
    return rng.pick(pool);
  }
  return rng.pick(rarity.key === 'defective' ? PREFIX_JUNK : rarity.key === 'pristine' ? PREFIX_GRAND : PREFIX_PLAIN);
}

function pickSuffix(rng, rarity, affixes, special) {
  const penalties = affixes.filter((a) => a.role === 'penalty');
  const hasBadSpecial = special && !special.good;
  if (hasBadSpecial) return rng.pick(SUFFIX_BAD);
  if (penalties.length) {
    const worst = penalties.reduce((a, b) => (a.value < b.value ? a : b));
    // Сильный штраф заслуживает собственного слова в имени.
    return worst.value < 0.8 ? rng.pick(SUFFIX_PENALTY) : rng.pick([...SUFFIX_PENALTY, ...SUFFIX_PLAIN]);
  }
  if (special?.good) return rng.pick(SUFFIX_GOOD);
  return rng.pick(rarity.key === 'pristine' ? SUFFIX_GOOD : SUFFIX_PLAIN);
}

/**
 * Собрать модуль.
 * @param {object} rng ГПСЧ
 * @param {object} opts { rarity, slot, luck } — luck>1 сдвигает редкость вверх
 */
export function rollModule(rng, opts = {}) {
  // opts.rarity — это КЛЮЧ редкости. Раньше сюда попадал сам объект редкости, и
  // RARITIES[объект] давал undefined: нормализуем явно.
  const rarity = (opts.rarity && RARITIES[opts.rarity])
    ? opts.rarity
    : rng.weighted(RARITY_KEYS, (k) => {
      const luck = opts.luck || 1;
      // Удача масштабирует вес: эталонные растут, дефектные тают.
      if (k === 'pristine') return RARITIES[k].weight * luck;
      if (k === 'defective') return RARITIES[k].weight / luck;
      return RARITIES[k].weight;
    });
  const slot = opts.slot || rng.pick(SLOT_KEYS);
  const r = RARITIES[rarity];

  const used = new Set();
  const affixes = [];

  const nBonuses = rng.int(r.bonuses[0], r.bonuses[1]);
  const nPenalties = rng.int(r.penalties[0], r.penalties[1]);

  // Бонусы
  let guard = 0;
  while (affixes.filter((a) => a.role === 'bonus').length < nBonuses && guard++ < 24) {
    const pool = statPool(r, 'bonus').filter((k) => !used.has(k));
    if (!pool.length) break;
    const stat = weightedStats(rng, pool, slot);
    const affix = makeAffix(rng, stat, 'bonus', r, used);
    if (affix) affixes.push(affix);
  }
  // Штрафы
  guard = 0;
  while (affixes.filter((a) => a.role === 'penalty').length < nPenalties && guard++ < 24) {
    const pool = statPool(r, 'penalty').filter((k) => !used.has(k) && STATS[k].kind !== 'zero');
    if (!pool.length) break;
    const stat = weightedStats(rng, pool, slot);
    const affix = makeAffix(rng, stat, 'penalty', r, used);
    if (affix) affixes.push(affix);
  }

  const special = pickSpecial(rng, r);
  const prefix = pickPrefix(rng, r, affixes);
  const suffix = pickSuffix(rng, r, affixes, special);
  const base = rng.pick(BASE_SLOT[slot]);
  const name = `${agree(prefix, base.g)} ${base.n} ${suffix}`;

  const m = {
    uid: `mod${++seq}`,
    slot, rarity: r.key, affixes, special,
    enchant: 0,
    name,
  };
  m.parts = moduleParts(m);
  return m;
}

/** Стоимость разбора: редкость + уровень заточки. */
export function moduleParts(m) {
  const base = RARITIES[m.rarity]?.parts ?? 8;
  const bonus = Math.max(0, m.enchant) * Math.round(base * 0.5);
  const minus = Math.max(0, -m.enchant) * 2;
  return Math.max(1, base + bonus - minus + (m.special ? 4 : 0));
}

// ---------------------------------------------------------------------------
//  Заточка (требование 12)
// ---------------------------------------------------------------------------

/** Цена заточки в запчастях растёт с уровнем и редкостью. */
export function enchantCost(m) {
  const base = RARITIES[m.rarity]?.parts ?? 8;
  const level = Math.abs(m.enchant || 0);
  return Math.round(base * 0.9 + level * level * 6 + level * 8);
}

/** Шанс успеха падает с уровнем и тем быстрее, чем глубже провал. */
export function enchantChance(m) {
  const level = m.enchant || 0;
  if (level >= 0) return Math.max(0.15, 0.8 - level * 0.09);
  return Math.max(0.1, 0.6 + level * 0.1);   // из минуса выбираться легче
}

const GROW = [0.08, 0.16];      // насколько усиливается бонус при успехе
const CUT = [0.10, 0.22];       // насколько срезается штраф при успехе
const SHRINK = [0.05, 0.13];    // насколько слабеет бонус при провале
const WORSEN = [0.10, 0.22];    // насколько крепнет штраф при провале
const NEW_PENALTY_CHANCE = 0.45; // шанс, что провал добавит НОВЫЙ штраф

/** Пересобрать подпись аффикса после изменения величины. */
function relabel(a) {
  const def = STATS[a.key];
  a.label = a.kind === 'mult'
    ? `${fmtMult(a.value)} ${def.short}`
    : `+${def.percent ? Math.round(a.value * 100) + '%' : fmtNum(a.value, 1)} ${def.short}`;
}

/**
 * Масштабировать аффикс. Для множителя factor > 1 усиливает, < 1 ослабляет;
 * для плоской добавки то же самое, но с полом, чтобы заточка не обнулила бонус.
 */
function scaleAffix(a, factor) {
  const before = a.value;
  if (a.kind === 'mult') {
    if (a.role === 'bonus') a.value = Math.max(1.001, before * factor);
    else a.value = Math.min(0.999, before * factor);
  } else {
    a.value = Math.max(0.01, before * factor);
  }
  relabel(a);
  return before;
}

/** Есть ли у модуля что точить. Без этой проверки платёж списывается впустую. */
export function canEnchant(m) {
  const hasBonus = m.affixes.some((a) => a.role === 'bonus');
  const hasPenalty = m.affixes.some((a) => a.role === 'penalty');
  return { ok: hasBonus || hasPenalty, reason: hasBonus || hasPenalty ? '' : 'У модуля нет ни бонусов, ни штрафов — точить нечего.' };
}

/**
 * Заточка.
 *
 * Успех: либо усиливается случайный бонус, либо срезается случайный штраф
 * (вплоть до полного снятия — тогда аффикс удаляется).
 * Провал: бонусы слабеют, штрафы крепнут и — главное — становятся
 * разнообразнее: с заметным шансом добавляется новый штраф по ранее чистой
 * характеристике. Уровень уходит в минус, и это видно в метке «−2».
 *
 * Плоские добавки (ремонт, поджог) точатся наравне с множителями: модуль,
 * у которого из бонусов только «+3,7 ремонт», обязан быть улучшаемым, иначе
 * он навсегда выпадает из экономики забега.
 */
export function enchantModule(rng, m) {
  const check = canEnchant(m);
  if (!check.ok) return { ok: false, text: check.reason, addedPenalty: null, refused: true };

  const success = rng.chance(enchantChance(m));
  const bonuses = m.affixes.filter((a) => a.role === 'bonus');
  const penalties = m.affixes.filter((a) => a.role === 'penalty');
  let addedPenalty = null;
  let text;

  if (success) {
    m.enchant = (m.enchant || 0) + 1;
    const mode = bonuses.length && penalties.length ? rng.chance(0.5) : Boolean(bonuses.length);
    if (mode) {
      const a = rng.pick(bonuses);
      const before = scaleAffix(a, 1 + rng.float(GROW[0], GROW[1]));
      text = `бонус ${STAT_NAME(a.key)} усилен: ${a.kind === 'mult' ? fmtMult(before) : '+' + fmtNum(before, 1)} → ${a.label}`;
    } else {
      const a = rng.pick(penalties);
      const before = a.value;
      a.value = Math.min(1, a.value * (1 + rng.float(CUT[0], CUT[1])));
      relabel(a);
      if (a.value >= 1) {
        m.affixes = m.affixes.filter((x) => x !== a);
        text = `штраф ${STAT_NAME(a.key)} снят целиком (был ${fmtMult(before)})`;
      } else {
        text = `штраф ${STAT_NAME(a.key)} срезан: ${fmtMult(before)} → ${fmtMult(a.value)}`;
      }
    }
  } else {
    m.enchant = (m.enchant || 0) - 1;
    const parts = [];
    if (bonuses.length) {
      const a = rng.pick(bonuses);
      const before = a.label;
      scaleAffix(a, 1 - rng.float(SHRINK[0], SHRINK[1]));
      parts.push(`бонус ${STAT_NAME(a.key)} ослаб: ${before} → ${a.label}`);
    }
    if (penalties.length) {
      const a = rng.pick(penalties);
      const before = a.value;
      scaleAffix(a, 1 - rng.float(WORSEN[0], WORSEN[1]));
      parts.push(`штраф ${STAT_NAME(a.key)} окреп: ${fmtMult(before)} → ${fmtMult(a.value)}`);
    }
    if (rng.chance(NEW_PENALTY_CHANCE)) {
      const used = new Set(m.affixes.map((a) => a.key));
      const pool = STAT_KEYS.filter((k) => !used.has(k) && STATS[k].kind !== 'zero');
      if (pool.length) {
        const stat = weightedStats(rng, pool, m.slot);
        const value = 1 / rng.float(1.08, 1.28);
        const affix = { key: stat, kind: 'mult', value, role: 'penalty', label: `${fmtMult(value)} ${STATS[stat].short}` };
        m.affixes.push(affix);
        addedPenalty = affix;
        parts.push(`новый изъян: ${STAT_NAME(stat)} ${fmtMult(value)}`);
      }
    }
    text = parts.length ? parts.join('; ') : 'провал, но менять было нечего';
  }

  m.parts = moduleParts(m);
  // ok и success совпадают по значению, но названы по-разному не зря: ok —
  // «заточка удалась», refused — «модуль вообще нельзя точить». Интерфейсу
  // нужно различать провал броска и отказ, поэтому поле явное.
  return { ok: success, success, text, addedPenalty };
}

// ---------------------------------------------------------------------------
//  Отображение
// ---------------------------------------------------------------------------

export function rarityOf(m) { return RARITIES[m.rarity] || RARITIES.standard; }

export function enchantLabel(m) {
  const e = m.enchant || 0;
  if (!e) return '';
  return e > 0 ? `+${e}` : `${e}`;
}

export function moduleTitle(m) {
  const e = enchantLabel(m);
  return e ? `${m.name} [${e}]` : m.name;
}

/** Итог модуля одним числом: произведение бонусов ÷ произведение штрафов.
 *  Нужно сортировке в трюме, а не балансу. */
export function moduleScore(m) {
  let score = 1;
  for (const a of m.affixes) score *= a.kind === 'mult' ? a.value : 1 + a.value;
  if (m.special) score *= m.special.good ? 1.25 : 0.75;
  return score;
}

export { ZERO_KEYS };
