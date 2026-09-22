import { ChampionSquad } from '../../data/recruits';
import { GEAR_SETS } from '../../data/sets';
import { TechNode, DogmaDefinition } from '../../data/techs';
import { ComputedUnitStats, UnitEntity } from './unit.types';

export interface ComputeContext {
  unlockedTechs?: TechNode[];
  activeDogmas?: DogmaDefinition[];
}

export function computeUnitStats(
  champion: ChampionSquad,
  context: ComputeContext = {}
): ComputedUnitStats {
  const base = champion.baseStats;
  const gears = [
    champion.equippedGear.core,
    champion.equippedGear.drive,
    champion.equippedGear.aux,
  ].filter(Boolean);

  // 1. Add gear stats
  let attack = base.attack;
  let defense = base.defense;
  let maxHp = base.maxHp;
  let speed = base.speed;
  let range = base.range;
  let critChance = base.critChance;
  let dodgeRate = base.dodgeRate;
  let accuracy = base.accuracy;
  let startingShield = 0;
  let armorPenetration = 0;

  for (const gear of gears) {
    if (!gear) continue;
    if (gear.stats.attack) attack += gear.stats.attack;
    if (gear.stats.defense) defense += gear.stats.defense;
    if (gear.stats.maxHp) maxHp += gear.stats.maxHp;
    if (gear.stats.speed) speed += gear.stats.speed;
    if (gear.stats.range) range += gear.stats.range;
    if (gear.stats.critChance) critChance += gear.stats.critChance;
    if (gear.stats.dodgeRate) dodgeRate += gear.stats.dodgeRate;
    if (gear.stats.accuracy) accuracy += gear.stats.accuracy;
  }

  // 2. Count sets
  const setCountMap: Record<string, number> = {};
  for (const gear of gears) {
    if (gear && gear.setName) {
      setCountMap[gear.setName] = (setCountMap[gear.setName] || 0) + 1;
    }
  }

  const activeSets: ComputedUnitStats['activeSets'] = [];
  for (const [setId, count] of Object.entries(setCountMap)) {
    const setDef = GEAR_SETS[setId];
    if (!setDef) continue;
    const hasTwoPiece = count >= 2;
    const hasThreePiece = count >= 3;

    if (hasTwoPiece) {
      if (setDef.twoPieceBonus.attackBonus) attack += setDef.twoPieceBonus.attackBonus;
      if (setDef.twoPieceBonus.defenseBonus) defense += setDef.twoPieceBonus.defenseBonus;
      if (setDef.twoPieceBonus.maxHpBonus) maxHp += setDef.twoPieceBonus.maxHpBonus;
      if (setDef.twoPieceBonus.speedBonus) speed += setDef.twoPieceBonus.speedBonus;
      if (setDef.twoPieceBonus.critBonus) critChance += setDef.twoPieceBonus.critBonus;
    }

    if (hasThreePiece) {
      if (setDef.threePieceBonus.attackPercent) {
        attack = Math.round(attack * (1 + setDef.threePieceBonus.attackPercent / 100));
      }
      if (setDef.threePieceBonus.allStatsBonus) {
        attack += setDef.threePieceBonus.allStatsBonus;
        defense += setDef.threePieceBonus.allStatsBonus;
        speed += Math.round(setDef.threePieceBonus.allStatsBonus / 2);
      }
      if (setDef.threePieceBonus.specialEffect === 'steam_burst') {
        startingShield += 50;
      }
    }

    activeSets.push({
      setId,
      count,
      hasTwoPiece,
      hasThreePiece,
      name: setDef.name,
      description: hasThreePiece
        ? `${setDef.twoPieceBonus.description} + ${setDef.threePieceBonus.description}`
        : setDef.twoPieceBonus.description,
    });
  }

  // 3. Tech Bonuses
  if (context.unlockedTechs) {
    for (const tech of context.unlockedTechs) {
      if (tech.effects.statBonuses) {
        const b = tech.effects.statBonuses;
        if (b.attack) attack += b.attack;
        if (b.defense) defense += b.defense;
        if (b.maxHp) maxHp += b.maxHp;
        if (b.speed) speed += b.speed;
        if (b.critChance) critChance += b.critChance;
      }
    }
  }

  // 4. Dogma Bonuses
  const activeDogmaBonuses: string[] = [];
  if (context.activeDogmas) {
    for (const dogma of context.activeDogmas) {
      if (dogma.combatBonus) {
        const cb = dogma.combatBonus;
        if (cb.attackPercent) attack = Math.round(attack * (1 + cb.attackPercent / 100));
        if (cb.defensePercent) defense = Math.round(defense * (1 + cb.defensePercent / 100));
        if (cb.speedBonus) speed += cb.speedBonus;
        if (cb.critBonus) critChance += cb.critBonus;
        if (cb.armorPenetration) armorPenetration += cb.armorPenetration;
        if (cb.startingShield) startingShield += cb.startingShield;
        activeDogmaBonuses.push(dogma.name);
      }
    }
  }

  // Bounds checks
  critChance = Math.min(0.85, Math.max(0.01, critChance));
  dodgeRate = Math.min(0.60, Math.max(0.0, dodgeRate));
  accuracy = Math.min(0.99, Math.max(0.20, accuracy));

  return {
    attack: Math.max(1, Math.round(attack)),
    defense: Math.max(0, Math.round(defense)),
    maxHp: Math.max(10, Math.round(maxHp)),
    speed: Math.max(1, Math.round(speed)),
    range: Math.max(1, range),
    critChance: Number(critChance.toFixed(3)),
    dodgeRate: Number(dodgeRate.toFixed(3)),
    accuracy: Number(accuracy.toFixed(3)),
    effectiveHp: Math.max(10, Math.round(maxHp + defense * 3)),
    armorPenetration: Number(armorPenetration.toFixed(2)),
    startingShield,
    activeSets,
    activeDogmaBonuses,
  };
}

export function buildUnitEntityFromChampion(
  champion: ChampionSquad,
  context: ComputeContext = {}
): UnitEntity {
  const stats = computeUnitStats(champion, context);
  return {
    id: champion.id,
    name: champion.name,
    role: champion.role,
    isPlayer: true,
    row: champion.preferredLine,
    col: champion.col,
    maxHp: stats.maxHp,
    currentHp: stats.maxHp,
    shield: stats.startingShield,
    morale: 100,
    isFled: false,
    stats,
    equippedGear: { ...champion.equippedGear },
    statuses: [],
  };
}
