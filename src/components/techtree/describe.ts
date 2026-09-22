import { BUILDINGS } from '@/data/buildings';
import { RECRUITS } from '@/data/recruits';
import type { TechDef } from '@/data/techs';
import type { Modifier } from '@/engine/unit/unit.types';
import { formatStatDelta, RESOURCE_META } from '@/utils/format';

/** Человекочитаемое описание эффектов технологии/догмы. */
export function describeModifiers(mods: readonly Modifier[]): string {
  const parts: string[] = [];
  for (const m of mods) {
    switch (m.kind) {
      case 'stat':
        parts.push(formatStatDelta(m.stat, m.pct ?? m.flat ?? 0));
        break;
      case 'production': {
        const label = RESOURCE_META[m.resource].label.toLowerCase();
        const bits = [m.flat ? `+${m.flat}/ход` : null, m.pct ? `+${m.pct}%` : null].filter(Boolean);
        parts.push(`${label} ${bits.join(', ')}`);
        break;
      }
      case 'lootRarity':
        parts.push('добыча чаще бывает редче');
        break;
      case 'lootCount':
        parts.push(`+${m.bonus} предмет за победу`);
        break;
      case 'craftDiscount':
        parts.push(`слияние −${m.pct}%`);
        break;
      case 'ability':
        parts.push('особая способность всем отрядам');
        break;
    }
  }
  return parts.join(', ') || '—';
}

/** Короткая сводка «что даёт технология»: эффекты + разблокировки. */
export function describeTech(t: TechDef): string {
  const unlocks = [
    ...BUILDINGS.filter((b) => b.unlockTech === t.id).map((b) => b.name),
    ...RECRUITS.filter((r) => r.unlockTech === t.id).map((r) => r.name),
  ];
  const eff = describeModifiers(t.effects);
  return [eff !== '—' ? eff : null, unlocks.length ? `Открывает: ${unlocks.join(', ')}` : null]
    .filter(Boolean)
    .join(' · ') || '—';
}
