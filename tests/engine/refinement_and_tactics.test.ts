import { describe, it, expect } from 'vitest';
import { GEAR_POOL, GearItem } from '../../src/data/gear';
import { refineGear, craftBlueprintArtifact } from '../../src/engine/loot/gearGenerator';
import { previewTargetingVectors } from '../../src/engine/combat/targeting';
import { simulateFight } from '../../src/engine/combat/simulateFight';
import { buildUnitEntityFromChampion } from '../../src/engine/unit/computeUnit';
import { INITIAL_CHAMPIONS } from '../../src/data/recruits';
import { UnitEntity } from '../../src/engine/unit/unit.types';

describe('Advanced Systems: Refinement, Artifacts & Tactical Abilities', () => {
  it('should refine gear and increase stats by 15% per rank', () => {
    const gear: GearItem = {
      ...GEAR_POOL[0],
      id: 'gear_refine_test',
      stats: { attack: 10, maxHp: 50 },
    };

    const res = refineGear(gear, 100, 100);
    expect(res.success).toBe(true);
    expect(res.refinedGear?.refinementLevel).toBe(1);
    expect(res.refinedGear?.stats.attack).toBeGreaterThan(10);
    expect(res.refinedGear?.stats.maxHp).toBeGreaterThan(50);
  });

  it('should enforce maximum refinement rank of +5', () => {
    const maxGear: GearItem = {
      ...GEAR_POOL[0],
      id: 'max_gear',
      refinementLevel: 5,
      stats: { attack: 20 },
    };

    const res = refineGear(maxGear, 500, 500);
    expect(res.success).toBe(false);
    expect(res.error).toContain('максимального');
  });

  it('should craft legendary artifact from matching quest blueprint', () => {
    const epic1: GearItem = {
      ...GEAR_POOL[5], // void gyro
      id: 'epic_void_1',
      rarity: 'epic',
      setName: 'void_core',
    };
    const epic2: GearItem = {
      ...GEAR_POOL[5],
      id: 'epic_void_2',
      rarity: 'epic',
      setName: 'void_core',
    };

    const res = craftBlueprintArtifact('blueprint_void_crown', [epic1, epic2], 300, 200);
    expect(res.success).toBe(true);
    expect(res.resultGear?.rarity).toBe('legendary');
    expect(res.consumedGearIds).toContain('epic_void_1');
    expect(res.consumedGearIds).toContain('epic_void_2');
  });

  it('should generate pre-battle targeting vectors', () => {
    const player = buildUnitEntityFromChampion(INITIAL_CHAMPIONS[0]);
    player.row = 2;
    player.col = 2;

    const enemy: UnitEntity = {
      id: 'e_target',
      name: 'Enemy Target',
      role: 'vanguard',
      isPlayer: false,
      row: 2,
      col: 11,
      currentHp: 100,
      maxHp: 100,
      shield: 0,
      morale: 100,
      isFled: false,
      stats: { attack: 10, defense: 5, maxHp: 100, speed: 5, range: 1, critChance: 0, dodgeRate: 0.05, accuracy: 0.9, effectiveHp: 115, armorPenetration: 0, startingShield: 0, activeSets: [], activeDogmaBonuses: [] },
      equippedGear: {},
      statuses: [],
    };

    const vectors = previewTargetingVectors([player], [enemy]);
    expect(vectors.length).toBe(1);
    expect(vectors[0].targetId).toBe(enemy.id);
    expect(vectors[0].distance).toBe(9); // |2-2| + |2-11| = 9
    expect(vectors[0].hitChanceEstimate).toBeGreaterThan(0);
  });

  it('should execute EMP Stun tactical card during combat', () => {
    const player = buildUnitEntityFromChampion(INITIAL_CHAMPIONS[0]);
    const strongEnemy: UnitEntity = {
      id: 'boss_unit',
      name: 'Heavy Titan',
      role: 'vanguard',
      isPlayer: false,
      row: 2,
      col: 11,
      currentHp: 200,
      maxHp: 200,
      shield: 0,
      morale: 100,
      isFled: false,
      stats: { attack: 40, defense: 10, maxHp: 200, speed: 10, range: 1, critChance: 0, dodgeRate: 0, accuracy: 0.8, effectiveHp: 230, armorPenetration: 0, startingShield: 0, activeSets: [], activeDogmaBonuses: [] },
      equippedGear: {},
      statuses: [],
    };

    const sim = simulateFight([player], [strongEnemy], {
      seed: 555,
      tacticalCardsPlayed: [
        {
          round: 1,
          card: {
            id: 'tactic_emp_stun',
            name: 'Эфирный ЭМИ-Импульс',
            costMorale: 40,
            effect: 'emp_stun',
            description: 'Stun',
          },
        },
      ],
    });

    const empFrames = sim.frames.filter(f => f.actionType === 'tactical_card');
    expect(empFrames.length).toBe(1);
    expect(empFrames[0].targetId).toBe(strongEnemy.id);
  });

  it('should compute comprehensive per-unit performance metrics', () => {
    const player = buildUnitEntityFromChampion(INITIAL_CHAMPIONS[1]); // Duelist
    const enemy: UnitEntity = {
      id: 'target_dummy',
      name: 'Target Dummy',
      role: 'vanguard',
      isPlayer: false,
      row: 1,
      col: 11,
      currentHp: 80,
      maxHp: 80,
      shield: 0,
      morale: 100,
      isFled: false,
      stats: { attack: 15, defense: 5, maxHp: 80, speed: 8, range: 1, critChance: 0, dodgeRate: 0, accuracy: 0.8, effectiveHp: 95, armorPenetration: 0, startingShield: 0, activeSets: [], activeDogmaBonuses: [] },
      equippedGear: {},
      statuses: [],
    };

    const sim = simulateFight([player], [enemy], { seed: 100 });
    expect(sim.unitPerformance).toBeDefined();
    expect(sim.unitPerformance?.length).toBe(2);

    const playerPerf = sim.unitPerformance?.find(p => p.unitId === player.id);
    expect(playerPerf).toBeDefined();
    expect(playerPerf?.totalDamageDealt).toBeGreaterThan(0);
  });
});
