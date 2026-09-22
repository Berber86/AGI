import { GEAR_BY_ID, GEAR_POOL, gearOfRarity } from '@/data/gear';
import type { NodeKind } from '@/data/campaign';
import { RARITIES, type Affix, type GearInstance, type GearSlot, type Rarity, type StatKey } from '@/engine/unit/unit.types';
import type { Rng } from '@/utils/rng';

/** Взвешенный выбор. Веса ≤ 0 игнорируются. */
export function weightedPick<T>(rng: Rng, items: readonly T[], weightOf: (item: T) => number): T {
  const weights = items.map((i) => Math.max(0, weightOf(i)));
  const total = weights.reduce((a, b) => a + b, 0);
  if (total <= 0) return rng.pick(items);
  let roll = rng.next() * total;
  for (let i = 0; i < items.length; i++) {
    roll -= weights[i]!;
    if (roll < 0) return items[i]!;
  }
  return items[items.length - 1]!;
}

/** Базовые веса редкости по типу узла. */
export const RARITY_WEIGHTS: Record<NodeKind | 'skirmish' | 'craft', Record<Rarity, number>> = {
  skirmish: { common: 70, uncommon: 25, rare: 5, epic: 0, legendary: 0 },
  battle: { common: 55, uncommon: 30, rare: 12, epic: 3, legendary: 0.5 },
  rest: { common: 100, uncommon: 0, rare: 0, epic: 0, legendary: 0 },
  treasure: { common: 20, uncommon: 35, rare: 30, epic: 12, legendary: 3 },
  elite: { common: 25, uncommon: 35, rare: 27, epic: 10, legendary: 3 },
  boss: { common: 0, uncommon: 25, rare: 40, epic: 25, legendary: 10 },
  craft: { common: 0, uncommon: 0, rare: 0, epic: 0, legendary: 0 },
};

export interface RarityRollOptions {
  source: keyof typeof RARITY_WEIGHTS;
  cycle: number;
  /** Бонус от догм/техов: каждое очко переносит вес из common в старшие редкости. */
  rarityBonus?: number;
}

/** Итоговые веса после применения цикла и бонусов. Экспортируется для UI-подсказок и тестов. */
export function effectiveRarityWeights(opts: RarityRollOptions): Record<Rarity, number> {
  const w = { ...RARITY_WEIGHTS[opts.source] };
  const shift = Math.max(0, (opts.cycle - 1) * 3 + (opts.rarityBonus ?? 0));
  if (shift > 0) {
    const fromCommon = Math.min(w.common, shift);
    w.common -= fromCommon;
    w.uncommon += fromCommon * 0.3;
    w.rare += fromCommon * 0.4;
    w.epic += fromCommon * 0.2;
    w.legendary += fromCommon * 0.1;
  }
  return w;
}

export function rollRarity(rng: Rng, opts: RarityRollOptions): Rarity {
  const w = effectiveRarityWeights(opts);
  return weightedPick(rng, RARITIES, (r) => w[r]);
}

/** Пул аффиксов: диапазоны растут с индексом редкости r (0..4). */
const AFFIX_RANGES: Partial<Record<StatKey, (r: number) => [number, number]>> = {
  atk: (r) => [2 + 2 * r, 4 + 3 * r],
  hp: (r) => [8 + 6 * r, 15 + 10 * r],
  def: (r) => [2 + r, 4 + 2 * r],
  spd: (r) => [1, 1 + Math.floor(r / 2)],
  acc: (r) => [2 + r, 4 + 2 * r],
  eva: (r) => [1 + r, 3 + 2 * r],
  crit: (r) => [1 + r, 3 + 2 * r],
  critDmg: (r) => [5 + 3 * r, 10 + 5 * r],
  morale: (r) => [3 + 2 * r, 6 + 4 * r],
  lifesteal: (r) => [2 + r, 4 + 2 * r],
  armorPen: (r) => [3 + 2 * r, 6 + 4 * r],
};

/** Количество аффиксов по редкости. */
export const AFFIX_COUNT: Record<Rarity, number> = { common: 0, uncommon: 1, rare: 1, epic: 2, legendary: 2 };

function rollAffixes(rng: Rng, rarity: Rarity): Affix[] {
  const r = RARITIES.indexOf(rarity);
  const count = AFFIX_COUNT[rarity];
  const keys = (Object.keys(AFFIX_RANGES) as StatKey[]).filter((k) => r >= 2 || (k !== 'lifesteal' && k !== 'armorPen'));
  const chosen = rng.shuffle(keys).slice(0, count);
  return chosen.map((stat) => {
    const [min, max] = AFFIX_RANGES[stat]!(r);
    return { stat, value: rng.int(min, max) };
  });
}

export interface GenerateGearOptions {
  rarity: Rarity;
  cycle: number;
  slot?: GearSlot;
  setId?: string;
  /** Явный идентификатор экземпляра; если не задан — строится детерминированно из rng. */
  uid?: string;
  /** Для врагов: без аффиксов и сет-синергий, качество 0.9 — вкус, а не второй скейлинг. */
  bare?: boolean;
}

/**
 * Генерация экземпляра предмета заданной редкости.
 * Приоритет фильтров: сет+слот → сет → слот → любая. Если нужной редкости нет — берём ближайшую ниже.
 */
export function generateGear(rng: Rng, opts: GenerateGearOptions): GearInstance {
  let rarity = opts.rarity;
  let pool = pickPool(rarity, opts.slot, opts.setId, !opts.bare);
  while (pool.length === 0 && RARITIES.indexOf(rarity) > 0) {
    rarity = RARITIES[RARITIES.indexOf(rarity) - 1]!;
    pool = pickPool(rarity, opts.slot, opts.setId, !opts.bare);
  }
  if (pool.length === 0) pool = GEAR_POOL.filter((d) => !d.questOnly);
  const def = rng.pick(pool);
  const quality = opts.bare ? 0.9 : Math.round(rng.float(0.85, 1.15) * 100) / 100;
  return {
    uid: opts.uid ?? `g_${def.id}_${Math.floor(rng.next() * 1e9).toString(36)}`,
    defId: def.id,
    rarity: def.rarity,
    quality,
    affixes: opts.bare ? [] : rollAffixes(rng, def.rarity),
    cycle: opts.cycle,
  };
}

function pickPool(rarity: Rarity, slot?: GearSlot, setId?: string, allowSet = true) {
  const all = gearOfRarity(rarity).filter((d) => (allowSet || !d.setId) && !d.questOnly);
  if (setId && slot) {
    const p = all.filter((d) => d.setId === setId && d.slot === slot);
    if (p.length) return p;
  }
  if (setId) {
    const p = all.filter((d) => d.setId === setId);
    if (p.length) return p;
  }
  if (slot) {
    const p = all.filter((d) => d.slot === slot);
    if (p.length) return p;
  }
  return all;
}

export interface LootOptions {
  source: keyof typeof RARITY_WEIGHTS;
  cycle: number;
  count: number;
  rarityBonus?: number;
}

/** Пакет добычи за узел. */
export function rollLoot(rng: Rng, opts: LootOptions): GearInstance[] {
  const out: GearInstance[] = [];
  for (let i = 0; i < opts.count; i++) {
    const rarity = rollRarity(rng, { source: opts.source, cycle: opts.cycle, rarityBonus: opts.rarityBonus });
    out.push(generateGear(rng, { rarity, cycle: opts.cycle }));
  }
  return out;
}

// ---------------------------------------------------------------------------
// Мастерская: слияние 3 → 1 и разбор
// ---------------------------------------------------------------------------

/** Базовая стоимость слияния (руда) по редкости входа. */
export const CRAFT_COST_ORE: Record<Rarity, number> = { common: 15, uncommon: 40, rare: 90, epic: 200, legendary: 0 };

/** Сколько руды даёт разбор предмета. */
export const SALVAGE_ORE: Record<Rarity, number> = { common: 4, uncommon: 10, rare: 25, epic: 60, legendary: 150 };

export function craftCost(inputRarity: Rarity, discountPct: number): number {
  return Math.max(1, Math.round(CRAFT_COST_ORE[inputRarity] * (1 - discountPct / 100)));
}

export function canCraft(inputs: readonly GearInstance[]): { ok: boolean; reason?: string } {
  if (inputs.length !== 3) return { ok: false, reason: 'нужно ровно 3 шестерёнки' };
  const r = inputs[0]!.rarity;
  if (!inputs.every((g) => g.rarity === r)) return { ok: false, reason: 'все три должны быть одной редкости' };
  if (r === 'legendary') return { ok: false, reason: 'легендарные предметы нельзя слить' };
  return { ok: true };
}

/**
 * Слияние трёх предметов одной редкости в один предмет следующей редкости.
 * Если ≥2 входов из одного сета — результат из этого сета (если есть подходящий).
 * Если все три одного слота — результат того же слота.
 */
export function craftGear(rng: Rng, inputs: readonly GearInstance[], cycle: number): GearInstance {
  const check = canCraft(inputs);
  if (!check.ok) throw new Error(check.reason);
  const nextRarity = RARITIES[RARITIES.indexOf(inputs[0]!.rarity) + 1]!;
  const setCounts = new Map<string, number>();
  const slotCounts = new Map<GearSlot, number>();
  for (const g of inputs) {
    const def = GEAR_BY_ID[g.defId];
    if (!def) continue;
    if (def.setId) setCounts.set(def.setId, (setCounts.get(def.setId) ?? 0) + 1);
    slotCounts.set(def.slot, (slotCounts.get(def.slot) ?? 0) + 1);
  }
  const setId = [...setCounts.entries()].find(([, n]) => n >= 2)?.[0];
  const slot = [...slotCounts.entries()].find(([, n]) => n === 3)?.[0];
  return generateGear(rng, { rarity: nextRarity, cycle, setId, slot });
}
