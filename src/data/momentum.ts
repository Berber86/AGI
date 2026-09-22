import type { MomentumTactic } from '@/engine/combat/combat.types';

/** Контент тактик Momentum (правила ресурса — в combat.types.MOMENTUM_RULES). */
export const MOMENTUM_META: Record<MomentumTactic, { label: string; icon: string; description: string }> = {
  rage: { label: 'Ярость', icon: '🔥', description: 'Отряды наносят +50% урона в этом раунде.' },
  focus: { label: 'Прицел', icon: '🎯', description: '+30% меткости и +20% крита в этом раунде.' },
  volley: { label: 'Залп', icon: '🏹', description: 'Стрелки игнорируют дистанцию в этом раунде.' },
  guard: { label: 'Строй щитов', icon: '🛡️', description: 'Отряды получают щит 25 и +10% уклонения на раунд.' },
};

export const MOMENTUM_ORDER: MomentumTactic[] = ['rage', 'focus', 'volley', 'guard'];
