import { DOGMAS, DogmaDefinition, TECH_NODES, TechIcon } from '../../data/techs';

export function calculateAccumulatedIcons(unlockedTechIds: string[]): Record<TechIcon, number> {
  const totals: Record<TechIcon, number> = {
    craft: 0,
    lore: 0,
    culture: 0,
    war: 0,
    mining: 0,
    agri: 0,
  };

  const unlockedSet = new Set(unlockedTechIds);
  for (const tech of TECH_NODES) {
    if (unlockedSet.has(tech.id)) {
      for (const [icon, count] of Object.entries(tech.icons) as [TechIcon, number][]) {
        totals[icon] = (totals[icon] || 0) + count;
      }
    }
  }

  return totals;
}

export function getActiveDogmas(accumulatedIcons: Record<TechIcon, number>): DogmaDefinition[] {
  return DOGMAS.filter(dogma => {
    for (const [icon, required] of Object.entries(dogma.requiredIcons) as [TechIcon, number][]) {
      if ((accumulatedIcons[icon] || 0) < (required || 0)) {
        return false;
      }
    }
    return true;
  });
}

export function isTechUnlockable(techId: string, unlockedTechIds: string[], currentScience: number): {
  canUnlock: boolean;
  missingPrereqs: string[];
  missingScience: number;
} {
  const tech = TECH_NODES.find(t => t.id === techId);
  if (!tech) {
    return { canUnlock: false, missingPrereqs: [], missingScience: 0 };
  }

  const unlockedSet = new Set(unlockedTechIds);
  const missingPrereqs = tech.prerequisites.filter(p => !unlockedSet.has(p));
  const missingScience = Math.max(0, tech.cost - currentScience);

  return {
    canUnlock: missingPrereqs.length === 0 && missingScience === 0 && !unlockedSet.has(techId),
    missingPrereqs,
    missingScience,
  };
}
