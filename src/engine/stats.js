/**
 * Характеристики корабля и математика вероятностей.
 *
 * Два правила, на которых держится вся игра:
 *
 * 1. ЛЮБАЯ вероятность считается от видимой базы 50% и ограничена сверху и
 *    снизу. Ни одна сборка не даёт 100% попаданий или 0% промахов — иначе бой
 *    превращается в арифметику и пропадает ставка на бросок. Когда значение
 *    упирается в границу, интерфейс обязан это сказать, а не молча подменить.
 *
 * 2. ЛЮБАЯ характеристика — произведение множителей модулей поверх базы
 *    корпуса. Произведение хранится цепочкой, а не только итогом: игрок видит,
 *    какой именно модуль и во сколько раз сдвинул число. Это и есть
 *    «мультимножители», ради которых модули собирают.
 */

export const CHANCE_BASE = 0.5;   // базовый шанс любого исхода
export const CHANCE_MIN = 0.05;   // пол: 5% — ничего не невозможно
export const CHANCE_MAX = 0.95;   // потолок: 95% — ничего не гарантировано

/** Интервал инициативы: ход происходит, когда счётчик корабля доходит до 0. */
export const TICK_INTERVAL = 100;

/**
 * kind — как модуль вправе менять характеристику:
 *   ratio  — только множителем (безразмерная, база 1)
 *   pool   — множителем и плоской добавкой (ёмкость: прочность, щит)
 *   flat   — множителем и плоской добавкой (урон, выстрелы, ремонт)
 *   pct    — множителем и плоской добавкой в долях единицы (шанс крита)
 *   zero   — база ноль, поэтому ТОЛЬКО плоская добавка: умножение нуля даёт ноль
 *
 * core — «качественный» вес характеристики. Штрафы плохих модулей бьют по
 * основным, бонусы редких — тоже по основным; у штатных всё перемешано.
 * Именно это делает плохой модуль плохим не только количественно.
 */
export const STATS = {
  hull:         { name: 'Прочность',         short: 'прочн.', base: 100, kind: 'pool',  core: true,  digits: 0 },
  shield:       { name: 'Ёмкость щита',      short: 'щит',    base: 40,  kind: 'pool',  core: true,  digits: 0 },
  armor:        { name: 'Броня',             short: 'броня',  base: 1,   kind: 'ratio', core: true,  digits: 2, divisor: true },
  accuracy:     { name: 'Точность',          short: 'точн.',  base: 1,   kind: 'ratio', core: true,  digits: 2 },
  evasion:      { name: 'Уклонение',         short: 'уклон.', base: 1,   kind: 'ratio', core: true,  digits: 2, divisor: true },
  damage:       { name: 'Урон орудий',       short: 'урон',   base: 12,  kind: 'flat',  core: true,  digits: 1 },
  salvo:        { name: 'Выстрелов в залпе', short: 'залп',   base: 2,   kind: 'flat',  core: true,  digits: 0 },
  rate:         { name: 'Скорострельность',  short: 'темп',   base: 1,   kind: 'ratio', core: true,  digits: 2 },
  speed:        { name: 'Скорость',          short: 'скор.',  base: 1,   kind: 'ratio', core: false, digits: 2 },
  crit:         { name: 'Шанс крита',        short: 'крит',   base: 0.1, kind: 'pct',   core: false, digits: 0, percent: true },
  critDmg:      { name: 'Урон крита',        short: 'крит×',  base: 1.5, kind: 'ratio', core: false, digits: 2 },
  shieldBlock:  { name: 'Поглощение щитом',  short: 'погл.',  base: 1,   kind: 'ratio', core: false, digits: 2 },
  pierce:       { name: 'Пробитие щита',     short: 'пробой', base: 1,   kind: 'ratio', core: false, digits: 2, divisor: true },
  repair:       { name: 'Ремонт за ход',     short: 'ремонт', base: 0,   kind: 'zero',  core: false, digits: 1 },
  igniteChance: { name: 'Поджог',            short: 'поджог', base: 0,   kind: 'zero',  core: false, digits: 0, percent: true },
  igniteRes:    { name: 'Защита от поджига', short: 'антипод.', base: 1, kind: 'ratio', core: false, digits: 2, divisor: true },
  empChance:    { name: 'ЭМИ-глушение',      short: 'ЭМИ',    base: 0,   kind: 'zero',  core: false, digits: 0, percent: true },
  empRes:       { name: 'Защита от ЭМИ',     short: 'антиЭМИ', base: 1,  kind: 'ratio', core: false, digits: 2, divisor: true },
  corrodeChance:{ name: 'Коррозия брони',    short: 'корроз.', base: 0,  kind: 'zero',  core: false, digits: 0, percent: true },
  corrodeRes:   { name: 'Защита от коррозии',short: 'антикор.', base: 1, kind: 'ratio', core: false, digits: 2, divisor: true },
};

export const STAT_KEYS = Object.keys(STATS);
export const CORE_KEYS = STAT_KEYS.filter((k) => STATS[k].core);
export const NICHE_KEYS = STAT_KEYS.filter((k) => !STATS[k].core);
/** Характеристики с нулевой базой: их нельзя умножать, только прибавлять. */
export const ZERO_KEYS = STAT_KEYS.filter((k) => STATS[k].kind === 'zero');

export const STAT_NAME = (k) => STATS[k]?.name ?? k;
export const STAT_SHORT = (k) => STATS[k]?.short ?? k;

/** Формат числа под русскую раскладку: точка → запятая, хвостовые нули долой. */
export function fmtNum(v, digits = 2) {
  const n = Number(v);
  if (!Number.isFinite(n)) return '∞';
  const s = n.toFixed(digits);
  return s.replace(/\.0+$/, '').replace(/(\.\d*?)0+$/, '$1').replace('.', ',');
}

export function fmtStat(k, v) {
  const s = STATS[k] || { digits: 2, percent: false };
  if (s.percent) return `${Math.round(v * 100)}%`;
  return fmtNum(v, s.digits);
}

/**
 * Множитель показывается так, как его задумал игрок: ×1,36 — усиление,
 * ÷1,18 — ослабление (это то же ×0,85, но «делитель» читается честнее).
 */
export function fmtMult(m) {
  if (m >= 1) return `×${fmtNum(m, 3)}`;
  return `÷${fmtNum(1 / m, 3)}`;
}

/**
 * Вероятность от базы 50% с множителем и делителем.
 * Возвращает не только число, но и всю цепочку — интерфейс обязан показывать
 * вывод, иначе «прозрачная система» остаётся заявлением, а не свойством.
 *
 * @param {Array<{label:string, mult:number}>} terms слагаемые цепочки
 * @returns {{p:number, clamped:'min'|'max'|null, formula:string, chain:Array}}
 */
export function chanceFrom(terms = []) {
  const chain = [{ label: 'база', mult: CHANCE_BASE, text: `${Math.round(CHANCE_BASE * 100)}%` }];
  let p = CHANCE_BASE;
  for (const t of terms) {
    if (!t || !Number.isFinite(t.mult) || t.mult === 1) continue;
    p *= t.mult;
    chain.push({ label: t.label, mult: t.mult, text: fmtMult(t.mult) });
  }
  // Свободное значение показываем отдельно от итогового: если сборка уперлась в
  // границу, игрок должен видеть ОБА числа — и то, что дала сборка, и то, что
  // реально бросается. Молчаливая подмена выглядела бы как обман.
  const raw = p;
  let clamped = null;
  if (p > CHANCE_MAX) { p = CHANCE_MAX; clamped = 'max'; }
  if (p < CHANCE_MIN) { p = CHANCE_MIN; clamped = 'min'; }
  const pct = (v) => `${fmtNum(v * 100, 1)}%`;
  let formula = chain.map((c) => c.text).join(' ') + ` = ${pct(raw)}`;
  if (clamped) {
    formula += ` → ${clamped === 'max' ? 'потолок' : 'пол'} ${pct(p)}`;
    chain.push({ label: clamped === 'max' ? 'потолок' : 'пол', mult: null, text: pct(p), clamp: clamped });
  }
  return { p, raw, clamped, formula, chain };
}

/** Шанс попасть: точность стреляющего против уклонения цели. */
export function hitChance(attacker, target) {
  return chanceFrom([
    { label: 'точность', mult: attacker.accuracy },
    { label: 'уклонение цели', mult: 1 / Math.max(0.01, target.evasion) },
  ]);
}

/** Шанс, что щит поглотит попадание: поглощение цели против пробоя стреляющего. */
export function absorbChance(target, attacker) {
  return chanceFrom([
    { label: 'поглощение щитом', mult: target.shieldBlock },
    { label: 'пробитие', mult: 1 / Math.max(0.01, attacker.pierce) },
  ]);
}

/** Шанс статуса: сила источника против защиты цели. */
export function statusChance(source, target, stat, resStat) {
  const power = source[stat] || 0;
  if (power <= 0) return null;
  const res = Math.max(0.01, target[resStat] || 1);
  return chanceFrom([
    { label: STAT_NAME(stat), mult: 1 + power / CHANCE_BASE },
    { label: STAT_NAME(resStat), mult: 1 / res },
  ]);
}

/**
 * Шанс крита — единственная вероятность не от базы 50%, поэтому отдельно.
 *
 * @param {object} attacker характеристики стреляющего
 * @param {Array<{label:string, mult:number}>} [chain] цепочка множителей
 *   характеристики «крит» из computeStats. С ней формула называет модули,
 *   которые дали крит, а не показывает одно итоговое число: иначе крит остался
 *   бы единственной вероятностью без вывода.
 */
export function critChance(attacker, chain = null) {
  const p = Math.min(CHANCE_MAX, Math.max(0, attacker.crit || 0));
  const terms = (chain || []).filter((t) => t && Number.isFinite(t.mult) && t.mult !== 1);
  const base = (STATS.crit && STATS.crit.base) || 0;
  const formula = terms.length
    ? `${[`база ${fmtNum(base * 100, 1)}%`].concat(terms.map((t) => `${fmtMult(t.mult)} (${t.label})`)).join(' ')} = ${fmtNum(p * 100, 1)}%`
    : `${fmtNum(p * 100, 1)}%`;
  return { p, clamped: p >= CHANCE_MAX ? 'max' : null, formula, chain: terms };
}

/** Делитель входящего урона от брони. Броня 1,5 означает «урон ÷ 1,5». */
export function armorDivisor(target) {
  return Math.max(0.05, target.armor || 1);
}
