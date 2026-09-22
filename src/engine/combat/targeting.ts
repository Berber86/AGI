import type { Rng } from '@/utils/rng';
import type { BattleUnitState } from './combat.types';

/** Активный юнит — жив и не бежал. */
export const isActive = (u: BattleUnitState): boolean => u.alive && !u.routed;

/** Передняя (минимальная) линия среди активных юнитов стороны. Если никого нет — 0. */
export function frontLine(units: readonly BattleUnitState[]): number {
  let min = Infinity;
  for (const u of units) if (isActive(u) && u.line < min) min = u.line;
  return min === Infinity ? 0 : min;
}

/**
 * Дистанция между атакующим и целью в "линиях".
 * Обе стороны считаются продвинувшимися к линии соприкосновения: глубина считается
 * от собственной передней линии. Фронт против фронта = 1 (ближний бой).
 */
export function lineDistance(attacker: BattleUnitState, target: BattleUnitState, attackerFront: number, targetFront: number): number {
  return attacker.line - attackerFront + (target.line - targetFront) + 1;
}

export function canReach(attacker: BattleUnitState, target: BattleUnitState, attackerFront: number, targetFront: number): boolean {
  return lineDistance(attacker, target, attackerFront, targetFront) <= attacker.stats.range;
}

const hpPct = (u: BattleUnitState): number => u.hp / u.maxHp;

/**
 * Выбор цели. Возвращает null, если ни одна цель не в досягаемости.
 * Порядок приоритетов: досягаемость → предпочтение по тегу → правило юнита → детерминированные тай-брейки.
 */
export function selectTarget(
  attacker: BattleUnitState,
  allies: readonly BattleUnitState[],
  enemies: readonly BattleUnitState[],
  rng: Rng,
  opts: { ignoreRange?: boolean } = {},
): BattleUnitState | null {
  const aFront = frontLine(allies);
  const tFront = frontLine(enemies);
  const activeEnemies = enemies.filter(isActive);
  const reachable = opts.ignoreRange
    ? activeEnemies
    : activeEnemies.filter((e) => canReach(attacker, e, aFront, tFront));
  if (reachable.length === 0) return null;

  let pool = reachable;
  for (const ab of attacker.abilities) {
    if (ab.key !== 'targetPref') continue;
    const sub = pool.filter((e) => e.tags.includes(ab.tag));
    if (sub.length > 0) {
      pool = sub;
      break;
    }
  }

  const dist = (e: BattleUnitState): number => lineDistance(attacker, e, aFront, tFront);
  const colDiff = (e: BattleUnitState): number => Math.abs(e.column - attacker.column);
  const byId = (a: BattleUnitState, b: BattleUnitState): number => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);

  const sorted = [...pool];
  switch (attacker.targeting) {
    case 'nearest':
      sorted.sort((a, b) => dist(a) - dist(b) || hpPct(a) - hpPct(b) || colDiff(a) - colDiff(b) || byId(a, b));
      break;
    case 'weakest':
      sorted.sort((a, b) => a.hp - b.hp || dist(a) - dist(b) || colDiff(a) - colDiff(b) || byId(a, b));
      break;
    case 'strongest':
      sorted.sort((a, b) => b.stats.atk - a.stats.atk || dist(a) - dist(b) || colDiff(a) - colDiff(b) || byId(a, b));
      break;
    case 'ranged': {
      const rangedFirst = (u: BattleUnitState): number => (u.tags.includes('ranged') ? 0 : 1);
      sorted.sort((a, b) => rangedFirst(a) - rangedFirst(b) || dist(a) - dist(b) || hpPct(a) - hpPct(b) || colDiff(a) - colDiff(b) || byId(a, b));
      break;
    }
    case 'random':
      return rng.pick(sorted);
  }
  return sorted[0] ?? null;
}

/** Вторая цель для рассечения: другой активный враг в той же линии, что и основная цель. */
export function selectCleaveTarget(primary: BattleUnitState, enemies: readonly BattleUnitState[]): BattleUnitState | null {
  const candidates = enemies
    .filter((e) => isActive(e) && e.id !== primary.id && e.line === primary.line)
    .sort((a, b) => Math.abs(a.column - primary.column) - Math.abs(b.column - primary.column) || (a.id < b.id ? -1 : 1));
  return candidates[0] ?? null;
}
