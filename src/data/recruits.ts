import { GearItem } from './gear';

export type UnitRole = 'vanguard' | 'duelist' | 'arcanist';

export interface ChampionSquad {
  id: string;
  name: string;
  title: string;
  role: UnitRole;
  avatarIcon: string;
  lore: string;
  preferredLine: number; // 0..4
  col: number; // 0..9
  baseStats: {
    maxHp: number;
    attack: number;
    defense: number;
    speed: number;
    range: number;
    critChance: number;
    dodgeRate: number;
    accuracy: number;
  };
  passiveSkill: {
    name: string;
    description: string;
    trigger: 'onHit' | 'onDamaged' | 'onStart' | 'onKill';
  };
  equippedGear: {
    core?: GearItem;
    drive?: GearItem;
    aux?: GearItem;
  };
}

export const INITIAL_CHAMPIONS: ChampionSquad[] = [
  {
    id: 'squad_vanguard',
    name: 'Броненосный Авангард',
    title: '«Железная Стена»',
    role: 'vanguard',
    avatarIcon: 'ShieldAlert',
    lore: 'Тяжелые паровые джаггернауты, укрытые многослойными листами брони. Первыми принимают удар на себя.',
    preferredLine: 2, // центр фронта
    col: 2, // близко к центру
    baseStats: {
      maxHp: 220,
      attack: 26,
      defense: 16,
      speed: 10,
      range: 1, // ближний бой
      critChance: 0.05,
      dodgeRate: 0.04,
      accuracy: 0.88,
    },
    passiveSkill: {
      name: 'Паровой Отвод',
      description: 'При получении урона снижает входящий физический урон на 4 единицы (мин. 1).',
      trigger: 'onDamaged',
    },
    equippedGear: {},
  },
  {
    id: 'squad_duelist',
    name: 'Заводной Дуэлянт',
    title: '«Шестеренный Клинок»',
    role: 'duelist',
    avatarIcon: 'Swords',
    lore: 'Виртуозные бойцы с парными рапирами из часовой стали. Стремительны, наносят сокрушительные выпады.',
    preferredLine: 1,
    col: 1,
    baseStats: {
      maxHp: 150,
      attack: 34,
      defense: 8,
      speed: 18,
      range: 2, // быстрый выпад
      critChance: 0.22,
      dodgeRate: 0.18,
      accuracy: 0.94,
    },
    passiveSkill: {
      name: 'Смертоносный Спуск',
      description: 'Критические удары наносят 220% урона и повышают скорость на 3 до конца боя.',
      trigger: 'onHit',
    },
    equippedGear: {},
  },
  {
    id: 'squad_arcanist',
    name: 'Эфирный Осадный Арканист',
    title: '«Громовержец Шестерен»',
    role: 'arcanist',
    avatarIcon: 'Sparkles',
    lore: 'Мастера баллистики и эфирной энергии. Ведут огонь по всей глубине вражеских порядков.',
    preferredLine: 3,
    col: 0, // в тылу
    baseStats: {
      maxHp: 110,
      attack: 42,
      defense: 5,
      speed: 12,
      range: 5, // дальнобойный
      critChance: 0.14,
      dodgeRate: 0.06,
      accuracy: 0.92,
    },
    passiveSkill: {
      name: 'Шрапнельный Каскад',
      description: 'Атаки поражают основную цель и наносят 30% урона соседним вражеским линиям.',
      trigger: 'onHit',
    },
    equippedGear: {},
  },
];
