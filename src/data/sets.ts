import type { GearSetDef } from '@/engine/unit/unit.types';

/**
 * Сеты экипировки. У юнита 4 слота, поэтому максимум — 4 предмета одного сета.
 * Бонусы за 2 / 3 / 4 предмета. Каждый сет — отчётливый "архетип сборки".
 */
export const SETS: GearSetDef[] = [
  {
    id: 'dragon',
    name: 'Сет Дракона',
    icon: '🐉',
    element: 'fire',
    bonuses: [
      { pieces: 2, pctStats: { atk: 10 }, text: '+10% к атаке' },
      { pieces: 3, abilities: [{ key: 'cleave', pct: 35 }], text: 'Удар задевает вторую цель в линии на 35% урона' },
      { pieces: 4, stats: { armorPen: 30, critDmg: 25 }, text: '+30 пробития брони, +25% к критическому урону' },
    ],
  },
  {
    id: 'wolf',
    name: 'Сет Волка',
    icon: '🐺',
    bonuses: [
      { pieces: 2, stats: { spd: 3, crit: 5 }, text: '+3 скорости, +5% крита' },
      { pieces: 3, abilities: [{ key: 'doubleStrike', chance: 30 }], text: '30% шанс атаковать дважды' },
      { pieces: 4, abilities: [{ key: 'firstStrike' }], stats: { eva: 10 }, text: 'Внезапная атака, +10% уклонения' },
    ],
  },
  {
    id: 'bulwark',
    name: 'Сет Бастиона',
    icon: '🏰',
    bonuses: [
      { pieces: 2, pctStats: { hp: 12 }, text: '+12% к здоровью' },
      { pieces: 3, stats: { def: 15 }, abilities: [{ key: 'retaliate', pct: 50 }], text: '+15 защиты, контратака на 50% урона' },
      { pieces: 4, abilities: [{ key: 'shield', amount: 80 }], stats: { morale: 20 }, text: 'Щит 80 в начале боя, +20 морали' },
    ],
  },
  {
    id: 'serpent',
    name: 'Сет Змея',
    icon: '🐍',
    element: 'poison',
    bonuses: [
      { pieces: 2, stats: { eva: 8 }, text: '+8% уклонения' },
      { pieces: 3, abilities: [{ key: 'poisonOnHit', stacks: 2 }], text: 'Попадания накладывают 2 заряда яда' },
      { pieces: 4, abilities: [{ key: 'execute', threshold: 40, bonus: 60 }], text: '+60% урона по целям ниже 40% HP' },
    ],
  },
  {
    id: 'sage',
    name: 'Сет Мудреца',
    icon: '📜',
    element: 'arcane',
    bonuses: [
      { pieces: 2, stats: { acc: 10 }, text: '+10% меткости' },
      { pieces: 3, abilities: [{ key: 'regen', hp: 8 }], text: 'Восстанавливает 8 HP каждый раунд' },
      { pieces: 4, stats: { range: 1, armorPen: 25 }, text: '+1 дальность, +25 пробития брони' },
    ],
  },
];

export const SET_BY_ID: Record<string, GearSetDef> = Object.fromEntries(SETS.map((s) => [s.id, s]));
