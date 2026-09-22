import { describe, it, expect } from 'vitest';
import { INITIAL_BUILDINGS } from '../../src/data/buildings';
import { computeCityTick, calculateBuildingUpgradeCost } from '../../src/engine/economy/cityTick';
import { calculateAccumulatedIcons, getActiveDogmas, isTechUnlockable } from '../../src/engine/economy/techTree';
import { fuseGears } from '../../src/engine/loot/gearGenerator';
import { GEAR_POOL, GearItem } from '../../src/data/gear';

describe('Economy & Tech Tree Engine', () => {
  it('should compute city production based on active buildings', () => {
    const buildings = [...INITIAL_BUILDINGS];
    const tick = computeCityTick(buildings, [], 60); // 1 minute
    expect(tick.goldProduced).toBeGreaterThan(0);
    expect(tick.cogPartsProduced).toBeGreaterThan(0);
    expect(tick.scienceProduced).toBeGreaterThan(0);
  });

  it('should scale upgrade cost with building level', () => {
    const building = { ...INITIAL_BUILDINGS[0], level: 1 };
    const costLvl1 = calculateBuildingUpgradeCost(building);
    building.level = 3;
    const costLvl3 = calculateBuildingUpgradeCost(building);
    expect(costLvl3.gold).toBeGreaterThan(costLvl1.gold);
    expect(costLvl3.cogParts).toBeGreaterThan(costLvl1.cogParts);
  });

  it('should accumulate Innovation dogma icons accurately', () => {
    const unlockedIds = ['primitive_foundry', 'phalanx_drills'];
    // primitive_foundry: craft:1, mining:1
    // phalanx_drills: war:2
    const icons = calculateAccumulatedIcons(unlockedIds);
    expect(icons.craft).toBe(1);
    expect(icons.mining).toBe(1);
    expect(icons.war).toBe(2);
    expect(icons.lore).toBe(0);
  });

  it('should activate Dogmas when icon threshold is reached', () => {
    const iconsSufficient = {
      craft: 0,
      lore: 0,
      culture: 0,
      war: 3, // unlocks dogma_iron_fist
      mining: 0,
      agri: 0,
    };
    const active = getActiveDogmas(iconsSufficient);
    expect(active.some(d => d.id === 'dogma_iron_fist')).toBe(true);

    const iconsInsufficient = {
      craft: 0,
      lore: 0,
      culture: 0,
      war: 2,
      mining: 0,
      agri: 0,
    };
    const notActive = getActiveDogmas(iconsInsufficient);
    expect(notActive.some(d => d.id === 'dogma_iron_fist')).toBe(false);
  });

  it('should enforce tech prerequisites and science cost', () => {
    // watermill_power requires primitive_foundry and 60 science
    const check1 = isTechUnlockable('watermill_power', [], 100);
    expect(check1.canUnlock).toBe(false);
    expect(check1.missingPrereqs).toContain('primitive_foundry');

    const check2 = isTechUnlockable('watermill_power', ['primitive_foundry'], 20);
    expect(check2.canUnlock).toBe(false);
    expect(check2.missingScience).toBe(40);

    const check3 = isTechUnlockable('watermill_power', ['primitive_foundry'], 60);
    expect(check3.canUnlock).toBe(true);
  });

  it('should fuse 3 gears of common rarity into 1 rare gear (3-to-1 craft)', () => {
    const commonGear1: GearItem = {
      id: 'g1',
      templateId: 'core_iron_gear',
      name: 'Iron Gear 1',
      slot: 'core',
      rarity: 'common',
      level: 1,
      stats: { attack: 8 },
      description: 'test',
    };
    const commonGear2: GearItem = { ...commonGear1, id: 'g2', name: 'Iron Gear 2' };
    const commonGear3: GearItem = { ...commonGear1, id: 'g3', name: 'Iron Gear 3' };

    const fusion = fuseGears([commonGear1, commonGear2, commonGear3]);
    expect(fusion.success).toBe(true);
    expect(fusion.resultGear?.rarity).toBe('rare');
  });

  it('should reject fusing mismatched rarities or invalid item count', () => {
    const g1: GearItem = { ...GEAR_POOL[0], id: '1', rarity: 'common' };
    const g2: GearItem = { ...GEAR_POOL[0], id: '2', rarity: 'rare' };
    const g3: GearItem = { ...GEAR_POOL[0], id: '3', rarity: 'common' };

    const fusion = fuseGears([g1, g2, g3]);
    expect(fusion.success).toBe(false);

    const fusionTwo = fuseGears([g1, g3]);
    expect(fusionTwo.success).toBe(false);
  });
});
