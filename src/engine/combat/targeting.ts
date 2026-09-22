import { UnitEntity } from '../unit/unit.types';

export function calculateDistance(a: { row: number; col: number }, b: { row: number; col: number }): number {
  // Manhattan distance in 10x20 grid
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}

export function selectBestTarget(
  attacker: UnitEntity,
  enemies: UnitEntity[]
): UnitEntity | null {
  const activeEnemies = enemies.filter(e => e.currentHp > 0 && !e.isFled);
  if (activeEnemies.length === 0) return null;

  // 1. If Vanguard exists in the front (closest col), prioritize vanguard
  const vanguards = activeEnemies.filter(e => e.role === 'vanguard');
  const targetPool = vanguards.length > 0 && attacker.stats.range <= 2 ? vanguards : activeEnemies;

  // 2. Sort by distance, then by lowest current HP
  const sorted = [...targetPool].sort((a, b) => {
    const distA = calculateDistance(attacker, a);
    const distB = calculateDistance(attacker, b);

    // If within attack range, prefer lowest HP
    const aInRange = distA <= attacker.stats.range + 8;
    const bInRange = distB <= attacker.stats.range + 8;

    if (aInRange && bInRange) {
      if (a.currentHp !== b.currentHp) {
        return a.currentHp - b.currentHp;
      }
    }
    return distA - distB;
  });

  return sorted[0] || null;
}

export interface TargetingPreview {
  attackerId: string;
  attackerName: string;
  targetId: string;
  targetName: string;
  from: { row: number; col: number };
  to: { row: number; col: number };
  distance: number;
  isInRange: boolean;
  hitChanceEstimate: number;
}

export function previewTargetingVectors(
  playerArmy: UnitEntity[],
  enemyArmy: UnitEntity[]
): TargetingPreview[] {
  const previews: TargetingPreview[] = [];

  for (const attacker of playerArmy) {
    if (attacker.currentHp <= 0 || attacker.isFled) continue;
    const target = selectBestTarget(attacker, enemyArmy);
    if (!target) continue;

    const dist = calculateDistance(attacker, target);
    const isInRange = dist <= attacker.stats.range + 8;
    const hitChance = Math.min(0.96, Math.max(0.15, attacker.stats.accuracy - target.stats.dodgeRate));

    previews.push({
      attackerId: attacker.id,
      attackerName: attacker.name,
      targetId: target.id,
      targetName: target.name,
      from: { row: attacker.row, col: attacker.col },
      to: { row: target.row, col: target.col },
      distance: dist,
      isInRange,
      hitChanceEstimate: Math.round(hitChance * 100),
    });
  }

  return previews;
}
