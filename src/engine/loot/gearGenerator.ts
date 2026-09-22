import { GEAR_POOL, GearItem, GearRarity, QUEST_BLUEPRINTS } from '../../data/gear';

export function dismantleGearReward(gear: GearItem): { cogParts: number; gold: number } {
  const rarityValues: Record<GearRarity, { cogParts: number; gold: number }> = {
    common: { cogParts: 8, gold: 5 },
    rare: { cogParts: 20, gold: 15 },
    epic: { cogParts: 50, gold: 40 },
    legendary: { cogParts: 120, gold: 100 },
  };

  return rarityValues[gear.rarity] || { cogParts: 5, gold: 5 };
}

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

export function refineGear(
  gear: GearItem,
  goldAvailable: number,
  cogPartsAvailable: number
): {
  success: boolean;
  refinedGear?: GearItem;
  costGold: number;
  costCogParts: number;
  error?: string;
} {
  const currentRefine = gear.refinementLevel || 0;
  if (currentRefine >= 5) {
    return { success: false, costGold: 0, costCogParts: 0, error: 'Шестерня достигла максимального уровня заточки (+5)!' };
  }

  const costGold = (currentRefine + 1) * 35;
  const costCogParts = (currentRefine + 1) * 20;

  if (goldAvailable < costGold || cogPartsAvailable < costCogParts) {
    return { success: false, costGold, costCogParts, error: `Недостаточно ресурсов (нужно 💰${costGold}, ⚙️${costCogParts})!` };
  }

  const newStats: GearItem['stats'] = { ...gear.stats };
  const mult = 1.15;

  if (newStats.attack) newStats.attack = Math.round(newStats.attack * mult);
  if (newStats.defense) newStats.defense = Math.round(newStats.defense * mult);
  if (newStats.maxHp) newStats.maxHp = Math.round(newStats.maxHp * mult);
  if (newStats.speed) newStats.speed = Math.max(newStats.speed + 1, Math.round(newStats.speed * 1.1));

  const refinedGear: GearItem = {
    ...gear,
    refinementLevel: currentRefine + 1,
    name: gear.name.includes('+') ? gear.name.replace(/\+\d+$/, `+${currentRefine + 1}`) : `${gear.name} +${currentRefine + 1}`,
    stats: newStats,
  };

  return { success: true, refinedGear, costGold, costCogParts };
}

export function craftBlueprintArtifact(
  blueprintId: string,
  inventory: GearItem[],
  gold: number,
  cogParts: number
): {
  success: boolean;
  resultGear?: GearItem;
  consumedGearIds: string[];
  costGold: number;
  costCogParts: number;
  error?: string;
} {
  // Find blueprint template
  const bp = QUEST_BLUEPRINTS.find(b => b.id === blueprintId);
  if (!bp) return { success: false, consumedGearIds: [], costGold: 0, costCogParts: 0, error: 'Чертеж не найден' };

  if (gold < bp.costGold || cogParts < bp.costCogParts) {
    return { success: false, consumedGearIds: [], costGold: bp.costGold, costCogParts: bp.costCogParts, error: 'Недостаточно золота или запчастей!' };
  }

  const eligible = inventory.filter(
    g => g.rarity === bp.requiredRarity && (!bp.requiredSetName || g.setName === bp.requiredSetName)
  );

  if (eligible.length < bp.requiredCount) {
    return {
      success: false,
      consumedGearIds: [],
      costGold: bp.costGold,
      costCogParts: bp.costCogParts,
      error: `Требуется ${bp.requiredCount} эпических деталей сета ${bp.requiredSetName || ''} (у вас ${eligible.length})!`,
    };
  }

  const consumed = eligible.slice(0, bp.requiredCount);
  const targetTemplate = GEAR_POOL.find(g => g.templateId === bp.resultGearTemplateId) || GEAR_POOL[6];

  const resultGear: GearItem = {
    ...targetTemplate,
    id: `artifact_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    rarity: 'legendary',
    level: 3,
  };

  return {
    success: true,
    resultGear,
    consumedGearIds: consumed.map(c => c.id),
    costGold: bp.costGold,
    costCogParts: bp.costCogParts,
  };
}
