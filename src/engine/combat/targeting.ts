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
