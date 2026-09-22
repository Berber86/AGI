import { BUILDING_BY_ID, type BuildingDef } from '@/data/buildings';
import { RESOURCE_KEYS, type Modifier, type PartialResources, type ResourceKey, type Resources } from '@/engine/unit/unit.types';

export const ZERO_RESOURCES: Resources = { food: 0, ore: 0, science: 0, gold: 0 };

/** Базовый доход поселения без построек — чтобы игра никогда не вставала намертво. */
export const BASE_INCOME: Resources = { food: 8, ore: 3, science: 4, gold: 6 };

export function addResources(a: Resources, b: PartialResources, sign = 1): Resources {
  const out = { ...a };
  for (const k of RESOURCE_KEYS) out[k] = Math.max(0, Math.round((out[k] + (b[k] ?? 0) * sign) * 100) / 100);
  return out;
}

export function canAfford(have: Resources, cost: PartialResources): boolean {
  return RESOURCE_KEYS.every((k) => have[k] >= (cost[k] ?? 0));
}

/** Стоимость постройки/улучшения здания до уровня level (1-based). */
export function buildingCost(def: BuildingDef, level: number): PartialResources {
  const mult = Math.pow(def.costGrowth, Math.max(0, level - 1));
  const out: PartialResources = {};
  for (const [k, v] of Object.entries(def.baseCost) as [ResourceKey, number][]) out[k] = Math.round(v * mult);
  return out;
}

export interface TickBreakdown {
  base: Resources;
  buildings: Resources;
  modifiersFlat: Resources;
  pct: Resources;
  total: Resources;
}

/**
 * Производство за один ход. Чистая функция.
 * total = (base + buildings + flat) × (1 + pct/100), покомпонентно.
 */
export function cityTick(buildings: Readonly<Record<string, number>>, modifiers: readonly Modifier[]): TickBreakdown {
  const fromBuildings: Resources = { ...ZERO_RESOURCES };
  for (const [id, level] of Object.entries(buildings)) {
    const def = BUILDING_BY_ID[id];
    if (!def?.production || level <= 0) continue;
    for (const [k, v] of Object.entries(def.production) as [ResourceKey, number][]) fromBuildings[k] += v * level;
  }
  const flat: Resources = { ...ZERO_RESOURCES };
  const pct: Resources = { ...ZERO_RESOURCES };
  for (const m of modifiers) {
    if (m.kind !== 'production') continue;
    if (m.flat) flat[m.resource] += m.flat;
    if (m.pct) pct[m.resource] += m.pct;
  }
  const total: Resources = { ...ZERO_RESOURCES };
  for (const k of RESOURCE_KEYS) {
    total[k] = Math.round((BASE_INCOME[k] + fromBuildings[k] + flat[k]) * (1 + pct[k] / 100));
  }
  return { base: { ...BASE_INCOME }, buildings: fromBuildings, modifiersFlat: flat, pct, total };
}
