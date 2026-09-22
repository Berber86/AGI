import { CityBuilding } from '../../data/buildings';
import { TechNode } from '../../data/techs';

export interface CityTickOutput {
  goldProduced: number;
  cogPartsProduced: number;
  scienceProduced: number;
  cultureProduced: number;
}

export function computeCityTick(
  buildings: CityBuilding[],
  unlockedTechs: TechNode[] = [],
  tickSeconds: number = 5
): CityTickOutput {
  let goldRate = 1; // base baseline
  let cogRate = 1;
  let scienceRate = 1;
  let cultureRate = 0;

  // 1. Sum up building production per minute
  for (const b of buildings) {
    if (b.level <= 0) continue;
    const mult = Math.pow(1.15, b.level - 1);
    if (b.production.gold) goldRate += b.production.gold * b.level * mult;
    if (b.production.cogParts) cogRate += b.production.cogParts * b.level * mult;
    if (b.production.science) scienceRate += b.production.science * b.level * mult;
    if (b.production.culture) cultureRate += b.production.culture * b.level * mult;
  }

  // 2. Tech multipliers
  let goldMult = 1.0;
  let cogMult = 1.0;
  let scienceMult = 1.0;

  for (const t of unlockedTechs) {
    if (t.effects.economicMultiplier) {
      if (t.effects.economicMultiplier.gold) goldMult *= t.effects.economicMultiplier.gold;
      if (t.effects.economicMultiplier.cogParts) cogMult *= t.effects.economicMultiplier.cogParts;
      if (t.effects.economicMultiplier.science) scienceMult *= t.effects.economicMultiplier.science;
    }
  }

  const fraction = tickSeconds / 60;

  return {
    goldProduced: Math.max(0, Number((goldRate * goldMult * fraction).toFixed(2))),
    cogPartsProduced: Math.max(0, Number((cogRate * cogMult * fraction).toFixed(2))),
    scienceProduced: Math.max(0, Number((scienceRate * scienceMult * fraction).toFixed(2))),
    cultureProduced: Math.max(0, Number((cultureRate * fraction).toFixed(2))),
  };
}

export function calculateBuildingUpgradeCost(building: CityBuilding): { gold: number; cogParts: number } {
  const currentLevel = building.level;
  const factor = Math.pow(building.costMultiplier, currentLevel);
  return {
    gold: Math.round(building.baseCost.gold * factor),
    cogParts: Math.round(building.baseCost.cogParts * factor),
  };
}
