import { GEAR_POOL, GearItem, GearRarity } from '../../data/gear';

const RARITY_WEIGHTS: Record<number, Record<GearRarity, number>> = {
  1: { common: 70, rare: 25, epic: 5, legendary: 0 },
  2: { common: 40, rare: 45, epic: 13, legendary: 2 },
  3: { common: 20, rare: 45, epic: 27, legendary: 8 },
  4: { common: 5, rare: 35, epic: 42, legendary: 18 },
};

export function rollRarity(cycle: number = 1, guaranteedRarity?: GearRarity): GearRarity {
  if (guaranteedRarity) return guaranteedRarity;
  const cycleKey = Math.min(4, Math.max(1, cycle));
  const weights = RARITY_WEIGHTS[cycleKey];

  const roll = Math.random() * 100;
  let cumulative = 0;

  for (const [r, w] of Object.entries(weights) as [GearRarity, number][]) {
    cumulative += w;
    if (roll <= cumulative) {
      return r;
    }
  }

  return 'common';
}

export function generateLootGear(cycle: number = 1, guaranteedRarity?: GearRarity): GearItem {
  const rarity = rollRarity(cycle, guaranteedRarity);
  const matchingTemplates = GEAR_POOL.filter(g => g.rarity === rarity);
  const template =
    matchingTemplates.length > 0
      ? matchingTemplates[Math.floor(Math.random() * matchingTemplates.length)]
      : GEAR_POOL[0];

  const id = `gear_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

  // Slight stat variance (+/- 10%)
  const varianceFactor = 0.95 + Math.random() * 0.1;
  const scaledStats: GearItem['stats'] = {};

  if (template.stats.attack) scaledStats.attack = Math.round(template.stats.attack * varianceFactor);
  if (template.stats.defense) scaledStats.defense = Math.round(template.stats.defense * varianceFactor);
  if (template.stats.maxHp) scaledStats.maxHp = Math.round(template.stats.maxHp * varianceFactor);
  if (template.stats.speed) scaledStats.speed = template.stats.speed;
  if (template.stats.range) scaledStats.range = template.stats.range;
  if (template.stats.critChance) scaledStats.critChance = template.stats.critChance;
  if (template.stats.dodgeRate) scaledStats.dodgeRate = template.stats.dodgeRate;
  if (template.stats.accuracy) scaledStats.accuracy = template.stats.accuracy;

  return {
    ...template,
    id,
    stats: scaledStats,
    level: cycle,
  };
}

export const NEXT_RARITY: Record<GearRarity, GearRarity | null> = {
  common: 'rare',
  rare: 'epic',
  epic: 'legendary',
  legendary: null,
};

export function fuseGears(gearsToFuse: GearItem[]): {
  success: boolean;
  resultGear?: GearItem;
  error?: string;
} {
  if (gearsToFuse.length !== 3) {
    return { success: false, error: 'Для трансмутации необходимо ровно 3 шестерни.' };
  }

  const baseRarity = gearsToFuse[0].rarity;
  const sameRarity = gearsToFuse.every(g => g.rarity === baseRarity);

  if (!sameRarity) {
    return { success: false, error: 'Все три шестерни должны быть одной редкости!' };
  }

  const nextRarity = NEXT_RARITY[baseRarity];
  if (!nextRarity) {
    return { success: false, error: 'Легендарные шестерни уже достигли наивысшего качества!' };
  }

  // Preserve preferred slot or pick matching
  const matchingPool = GEAR_POOL.filter(g => g.rarity === nextRarity);
  const template = matchingPool[Math.floor(Math.random() * matchingPool.length)] || GEAR_POOL[0];

  const highestLevel = Math.max(...gearsToFuse.map(g => g.level));
  const newGear: GearItem = {
    ...template,
    id: `fused_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    level: highestLevel,
  };

  return { success: true, resultGear: newGear };
}

export function dismantleGearReward(gear: GearItem): { cogParts: number; gold: number } {
  const rarityValues: Record<GearRarity, { cogParts: number; gold: number }> = {
    common: { cogParts: 8, gold: 5 },
    rare: { cogParts: 20, gold: 15 },
    epic: { cogParts: 50, gold: 40 },
    legendary: { cogParts: 120, gold: 100 },
  };

  return rarityValues[gear.rarity] || { cogParts: 5, gold: 5 };
}
