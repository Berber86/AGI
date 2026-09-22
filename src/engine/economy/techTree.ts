import { BUILDING_BY_ID } from '@/data/buildings';
import { DOGMAS, TECHS, TECH_BY_ID, TECH_ICONS, type DogmaDef, type TechDef, type TechIcon } from '@/data/techs';
import type { Modifier } from '@/engine/unit/unit.types';

export type IconCounts = Record<TechIcon, number>;

export const emptyIconCounts = (): IconCounts => Object.fromEntries(TECH_ICONS.map((i) => [i, 0])) as IconCounts;

/** Суммарные иконки по изученным технологиям. */
export function countIcons(researched: readonly string[]): IconCounts {
  const counts = emptyIconCounts();
  for (const id of researched) {
    const t = TECH_BY_ID[id];
    if (!t) continue;
    for (const icon of t.icons) counts[icon] += 1;
  }
  return counts;
}

export function isDogmaActive(dogma: DogmaDef, counts: IconCounts): boolean {
  return (Object.entries(dogma.requires) as [TechIcon, number][]).every(([icon, need]) => counts[icon] >= need);
}

export function activeDogmas(researched: readonly string[]): DogmaDef[] {
  const counts = countIcons(researched);
  return DOGMAS.filter((d) => isDogmaActive(d, counts));
}

/** Прогресс догмы 0..1 — для подсветки "почти открыто". */
export function dogmaProgress(dogma: DogmaDef, counts: IconCounts): number {
  const entries = Object.entries(dogma.requires) as [TechIcon, number][];
  const need = entries.reduce((s, [, n]) => s + n, 0);
  const have = entries.reduce((s, [icon, n]) => s + Math.min(counts[icon], n), 0);
  return need === 0 ? 1 : have / need;
}

export function canResearch(tech: TechDef, researched: readonly string[], science: number): { ok: boolean; reason?: string } {
  if (researched.includes(tech.id)) return { ok: false, reason: 'уже изучено' };
  const missing = tech.requires.filter((r) => !researched.includes(r));
  if (missing.length) return { ok: false, reason: `нужно: ${missing.map((m) => TECH_BY_ID[m]?.name ?? m).join(', ')}` };
  if (science < tech.cost) return { ok: false, reason: `не хватает науки (${science}/${tech.cost})` };
  return { ok: true };
}

export function availableTechs(researched: readonly string[]): TechDef[] {
  return TECHS.filter((t) => !researched.includes(t.id) && t.requires.every((r) => researched.includes(r)));
}

/** Технологии, у которых все требования выполнены (независимо от науки). */
export function isTechUnlocked(techId: string | undefined, researched: readonly string[]): boolean {
  return techId === undefined || researched.includes(techId);
}

/**
 * Собирает все глобальные модификаторы: эффекты техов + активные догмы + здания.
 * Именно этот список передаётся в computeUnit, cityTick и генератор добычи.
 */
export function collectModifiers(researched: readonly string[], buildings: Readonly<Record<string, number>>): Modifier[] {
  const out: Modifier[] = [];
  for (const id of researched) {
    const t = TECH_BY_ID[id];
    if (t) out.push(...t.effects);
  }
  for (const d of activeDogmas(researched)) out.push(...d.effects);
  for (const [id, level] of Object.entries(buildings)) {
    const b = BUILDING_BY_ID[id];
    if (!b || !b.perLevel || level <= 0) continue;
    for (let i = 0; i < level; i++) out.push(...b.perLevel);
  }
  return out;
}

/** Суммарная скидка на слияние, %, ограничена 60%. */
export function craftDiscount(modifiers: readonly Modifier[]): number {
  let pct = 0;
  for (const m of modifiers) if (m.kind === 'craftDiscount') pct += m.pct;
  return Math.min(60, pct);
}

export function lootRarityBonus(modifiers: readonly Modifier[]): number {
  let b = 0;
  for (const m of modifiers) if (m.kind === 'lootRarity') b += m.bonus;
  return b;
}

export function lootCountBonus(modifiers: readonly Modifier[]): number {
  let b = 0;
  for (const m of modifiers) if (m.kind === 'lootCount') b += m.bonus;
  return b;
}
