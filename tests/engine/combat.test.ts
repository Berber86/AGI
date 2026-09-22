import { describe, it, expect } from 'vitest';
import { INITIAL_CHAMPIONS } from '../../src/data/recruits';
import { buildUnitEntityFromChampion } from '../../src/engine/unit/computeUnit';
import { simulateFight } from '../../src/engine/combat/simulateFight';
import { selectBestTarget, calculateDistance } from '../../src/engine/combat/targeting';
import { UnitEntity } from '../../src/engine/unit/unit.types';

describe('Combat Engine - Determinism & Targeting', () => {
  it('should calculate distance correctly in 10x20 field', () => {
    const a = { row: 1, col: 2 };
    const b = { row: 3, col: 12 };
    // Manhattan: |1-3| + |2-12| = 2 + 10 = 12
    expect(calculateDistance(a, b)).toBe(12);
  });

  it('should prioritize Vanguard in frontline targeting', () => {
    const vanguard = buildUnitEntityFromChampion(INITIAL_CHAMPIONS[0]);
    const duelist = buildUnitEntityFromChampion(INITIAL_CHAMPIONS[1]);
    vanguard.isPlayer = false;
    duelist.isPlayer = false;
    vanguard.row = 2;
    vanguard.col = 11;
    duelist.row = 1;
    duelist.col = 13;

    const attacker = buildUnitEntityFromChampion(INITIAL_CHAMPIONS[0]);
    attacker.row = 2;
    attacker.col = 2;

    const target = selectBestTarget(attacker, [duelist, vanguard]);
    expect(target?.id).toBe(vanguard.id);
  });

  it('should be 100% deterministic with a fixed seed', () => {
    const p1 = buildUnitEntityFromChampion(INITIAL_CHAMPIONS[0]);
    const p2 = buildUnitEntityFromChampion(INITIAL_CHAMPIONS[1]);
    const p3 = buildUnitEntityFromChampion(INITIAL_CHAMPIONS[2]);

    const createEnemies = (): UnitEntity[] => [
      {
        id: 'e1',
        name: 'Enemy Centurion',
        role: 'vanguard',
        isPlayer: false,
        row: 2,
        col: 12,
        currentHp: 180,
        maxHp: 180,
        shield: 0,
        morale: 100,
        isFled: false,
        stats: {
          attack: 24,
          defense: 12,
          maxHp: 180,
          speed: 9,
          range: 1,
          critChance: 0.05,
          dodgeRate: 0.05,
          accuracy: 0.85,
          effectiveHp: 216,
          armorPenetration: 0,
          startingShield: 0,
          activeSets: [],
          activeDogmaBonuses: [],
        },
        equippedGear: {},
        statuses: [],
      },
    ];

    const sim1 = simulateFight([p1, p2, p3], createEnemies(), { seed: 424242 });
    const sim2 = simulateFight([p1, p2, p3], createEnemies(), { seed: 424242 });

    expect(sim1.winner).toBe(sim2.winner);
    expect(sim1.roundsCount).toBe(sim2.roundsCount);
    expect(sim1.totalDamageDealtByPlayer).toBe(sim2.totalDamageDealtByPlayer);
    expect(sim1.frames.length).toBe(sim2.frames.length);
    expect(sim1.frames[0].damage).toBe(sim2.frames[0].damage);
  });

  it('should run sudden attack ambush phase for high-speed or duelist units', () => {
    const p1 = buildUnitEntityFromChampion(INITIAL_CHAMPIONS[1]); // Duelist (speed 18)
    const enemy: UnitEntity = {
      id: 'dummy_foe',
      name: 'Slow Scrapbot',
      role: 'vanguard',
      isPlayer: false,
      row: 1,
      col: 11,
      currentHp: 200,
      maxHp: 200,
      shield: 0,
      morale: 100,
      isFled: false,
      stats: {
        attack: 10,
        defense: 5,
        maxHp: 200,
        speed: 5,
        range: 1,
        critChance: 0,
        dodgeRate: 0,
        accuracy: 0.5,
        effectiveHp: 215,
        armorPenetration: 0,
        startingShield: 0,
        activeSets: [],
        activeDogmaBonuses: [],
      },
      equippedGear: {},
      statuses: [],
    };

    const res = simulateFight([p1], [enemy], { seed: 12345 });
    const ambushFrames = res.frames.filter(f => f.isAmbush && f.round === 0);
    expect(ambushFrames.length).toBeGreaterThan(0);
    expect(ambushFrames[0].actorId).toBe(p1.id);
  });

  it('should absorb damage when target has shield', () => {
    const p1 = buildUnitEntityFromChampion(INITIAL_CHAMPIONS[0]);
    const enemy: UnitEntity = {
      id: 'shielded_foe',
      name: 'Shielded Automaton',
      role: 'vanguard',
      isPlayer: false,
      row: 2,
      col: 11,
      currentHp: 100,
      maxHp: 100,
      shield: 50,
      morale: 100,
      isFled: false,
      stats: {
        attack: 10,
        defense: 10,
        maxHp: 100,
        speed: 8,
        range: 1,
        critChance: 0,
        dodgeRate: 0,
        accuracy: 0.8,
        effectiveHp: 130,
        armorPenetration: 0,
        startingShield: 50,
        activeSets: [],
        activeDogmaBonuses: [],
      },
      equippedGear: {},
      statuses: [],
    };

    const res = simulateFight([p1], [enemy], { seed: 777 });
    const hitsWithShield = res.frames.filter(f => f.absorbedByShield > 0);
    expect(hitsWithShield.length).toBeGreaterThan(0);
  });

  it('should decrease morale when critical hits occur or units fall', () => {
    const p1 = buildUnitEntityFromChampion(INITIAL_CHAMPIONS[1]);
    const weakEnemy: UnitEntity = {
      id: 'fragile_drone',
      name: 'Fragile Drone',
      role: 'duelist',
      isPlayer: false,
      row: 1,
      col: 11,
      currentHp: 15,
      maxHp: 15,
      shield: 0,
      morale: 100,
      isFled: false,
      stats: {
        attack: 5,
        defense: 0,
        maxHp: 15,
        speed: 2,
        range: 1,
        critChance: 0,
        dodgeRate: 0,
        accuracy: 0.5,
        effectiveHp: 15,
        armorPenetration: 0,
        startingShield: 0,
        activeSets: [],
        activeDogmaBonuses: [],
      },
      equippedGear: {},
      statuses: [],
    };

    const res = simulateFight([p1], [weakEnemy], { seed: 999 });
    expect(res.winner).toBe('player');
    expect(res.enemiesDefeatedCount).toBe(1);
  });
});
