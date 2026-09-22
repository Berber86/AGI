import { SETS, SET_BY_ID } from '@/data/sets';
import type { GearDef, UnitTag } from './unit.types';

/**
 * Эвристика «рекомендаций синергий»: подсказывает игроку, каких предметов
 * не хватает до следующего бонуса сета и какие сеты подходят архетипу рекрута.
 * Чистая функция — тестируется без UI.
 */

export interface SynergyHint {
  setId: string;
  name: string;
  icon: string;
  /** Сколько предметов сета надето на отряд. */
  have: number;
  /** Следующий порог сета (2..4). */
  nextPieces: number;
  nextBonusText: string;
  /** Сколько подходящих предметов лежит в коллекции без дела. */
  availableInStash: number;
  reason: 'progress' | 'archetype';
}

/** Архетипы: какой сет к каким тегам рекрута тяготеет. */
const ARCHETYPE: Record<string, readonly UnitTag[]> = {
  bulwark: ['melee', 'infantry'],
  wolf: ['cavalry', 'beast'],
  sage: ['ranged', 'magic'],
  dragon: ['magic', 'melee'],
  serpent: ['ranged', 'infantry'],
};

export function synergyHints(
  equippedDefs: readonly GearDef[],
  stashDefs: readonly GearDef[],
  recruitTags: readonly UnitTag[],
): SynergyHint[] {
  const equippedCount = new Map<string, number>();
  for (const def of equippedDefs) {
    if (def.setId) equippedCount.set(def.setId, (equippedCount.get(def.setId) ?? 0) + 1);
  }
  const stashBySet = new Map<string, number>();
  for (const def of stashDefs) {
    if (def.setId) stashBySet.set(def.setId, (stashBySet.get(def.setId) ?? 0) + 1);
  }

  const hints: SynergyHint[] = [];
  for (const set of SETS) {
    const have = equippedCount.get(set.id) ?? 0;
    const stash = stashBySet.get(set.id) ?? 0;
    if (have === 0 && stash === 0) continue;
    const next = set.bonuses.find((b) => b.pieces > have);
    if (!next) continue; // сет уже полный
    const archetype = ARCHETYPE[set.id]?.some((t) => recruitTags.includes(t)) ?? false;
    if (have === 0 && !archetype) continue;
    hints.push({
      setId: set.id,
      name: set.name,
      icon: set.icon,
      have,
      nextPieces: next.pieces,
      nextBonusText: next.text,
      availableInStash: stash,
      reason: have > 0 ? 'progress' : 'archetype',
    });
  }
  hints.sort((a, b) => b.have - a.have || a.nextPieces - b.nextPieces);
  return hints;
}

/** Состояние тиров сета: активен ли бонус при данном количестве предметов. */
export function setTierStates(setId: string, count: number): { pieces: number; text: string; active: boolean }[] {
  const set = SET_BY_ID[setId];
  if (!set) return [];
  return set.bonuses.map((b) => ({ pieces: b.pieces, text: b.text, active: count >= b.pieces }));
}
