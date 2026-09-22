import type { PartialResources, PartialStats, StatKey } from '@/engine/unit/unit.types';

export const STAT_LABEL: Record<StatKey, string> = {
  hp: 'Здоровье',
  atk: 'Атака',
  def: 'Защита',
  spd: 'Скорость',
  acc: 'Меткость',
  eva: 'Уклонение',
  crit: 'Крит',
  critDmg: 'Крит. урон',
  range: 'Дальность',
  morale: 'Мораль',
  lifesteal: 'Вампиризм',
  armorPen: 'Пробитие',
};

export const STAT_ICON: Record<StatKey, string> = {
  hp: '❤️',
  atk: '⚔️',
  def: '🛡️',
  spd: '💨',
  acc: '🎯',
  eva: '🌀',
  crit: '💥',
  critDmg: '☄️',
  range: '📏',
  morale: '🚩',
  lifesteal: '🩸',
  armorPen: '🔻',
};

/** Статы, которые выводятся в процентах. */
export const PCT_STATS: ReadonlySet<StatKey> = new Set(['acc', 'eva', 'crit', 'critDmg', 'lifesteal', 'armorPen']);

export function formatStatValue(stat: StatKey, value: number): string {
  const v = Math.round(value);
  return PCT_STATS.has(stat) ? `${v}%` : String(v);
}

export function formatStatDelta(stat: StatKey, value: number): string {
  const v = Math.round(value);
  const sign = v > 0 ? '+' : '';
  return `${sign}${v}${PCT_STATS.has(stat) ? '%' : ''} ${STAT_LABEL[stat]}`;
}

export function formatStats(stats: PartialStats): string {
  return (Object.entries(stats) as [StatKey, number][])
    .filter(([, v]) => v !== 0)
    .map(([k, v]) => formatStatDelta(k, v))
    .join(', ');
}

export const RESOURCE_META = {
  food: { label: 'Еда', icon: '🌾' },
  ore: { label: 'Руда', icon: '⛏️' },
  science: { label: 'Наука', icon: '📜' },
  gold: { label: 'Золото', icon: '💰' },
} as const;

export function formatCost(cost: PartialResources): string {
  const parts = (Object.entries(cost) as [keyof typeof RESOURCE_META, number][])
    .filter(([, v]) => v > 0)
    .map(([k, v]) => `${RESOURCE_META[k].icon}${Math.round(v)}`);
  return parts.length ? parts.join(' ') : 'бесплатно';
}
