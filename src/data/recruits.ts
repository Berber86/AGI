import type { RecruitDef, Stats } from '@/engine/unit/unit.types';

/** Базовая заготовка статов: всё, что не указано явно, берётся отсюда. */
export const DEFAULT_STATS: Stats = {
  hp: 100,
  atk: 20,
  def: 10,
  spd: 10,
  acc: 85,
  eva: 5,
  crit: 5,
  critDmg: 150,
  range: 1,
  morale: 70,
  lifesteal: 0,
  armorPen: 0,
};

const stats = (over: Partial<Stats>): Stats => ({ ...DEFAULT_STATS, ...over });

/**
 * Шаблоны рекрутов. Баланс намеренно "плоский" — глубина приходит из шестерёнок и сетов.
 * Стоимость — разовая при найме в отряд.
 */
export const RECRUITS: RecruitDef[] = [
  {
    id: 'militia',
    name: 'Ополченец',
    icon: '🪓',
    description: 'Дешёвый и надёжный. Ничего особенного, но и слабых мест нет.',
    cost: { food: 20 },
    base: stats({ hp: 110, atk: 18, def: 10, spd: 9 }),
    tags: ['melee', 'infantry', 'human'],
    targeting: 'nearest',
  },
  {
    id: 'archer',
    name: 'Лучник',
    icon: '🏹',
    description: 'Стреляет через линии. Хрупок в ближнем бою.',
    cost: { food: 25, gold: 10 },
    base: stats({ hp: 80, atk: 22, def: 5, spd: 11, acc: 90, range: 3 }),
    tags: ['ranged', 'infantry', 'human'],
    targeting: 'weakest',
  },
  {
    id: 'knight',
    name: 'Рыцарь',
    icon: '🛡️',
    description: 'Тяжёлая пехота. Держит фронт и отвечает ударом на удар.',
    cost: { food: 30, ore: 25, gold: 15 },
    base: stats({ hp: 150, atk: 20, def: 25, spd: 7, eva: 2, morale: 80 }),
    tags: ['melee', 'infantry', 'human'],
    targeting: 'strongest',
    abilities: [{ key: 'retaliate', pct: 40 }],
    unlockTech: 'iron_working',
  },
  {
    id: 'rogue',
    name: 'Головорез',
    icon: '🗡️',
    description: 'Быстрый и злой. Ищет раненых и добивает.',
    cost: { food: 25, gold: 25 },
    base: stats({ hp: 85, atk: 24, def: 6, spd: 14, eva: 20, crit: 20, critDmg: 175 }),
    tags: ['melee', 'infantry', 'human'],
    targeting: 'weakest',
    abilities: [{ key: 'execute', threshold: 35, bonus: 50 }],
    unlockTech: 'currency',
  },
  {
    id: 'mage',
    name: 'Маг',
    icon: '🔮',
    description: 'Огненные шары пробивают броню и задевают соседей.',
    cost: { food: 20, gold: 30, science: 15 },
    base: stats({ hp: 70, atk: 28, def: 3, spd: 8, acc: 95, range: 4, armorPen: 40, morale: 60 }),
    tags: ['ranged', 'magic', 'human'],
    targeting: 'strongest',
    element: 'fire',
    abilities: [{ key: 'cleave', pct: 40 }],
    unlockTech: 'philosophy',
  },
  {
    id: 'lancer',
    name: 'Копейщик',
    icon: '🐎',
    description: 'Конница. Бьёт первым, пока враг не построился.',
    cost: { food: 40, gold: 20 },
    base: stats({ hp: 120, atk: 26, def: 12, spd: 15, morale: 75 }),
    tags: ['melee', 'cavalry', 'human'],
    targeting: 'ranged',
    abilities: [{ key: 'firstStrike' }],
    unlockTech: 'horseback_riding',
  },
  // ---------- Только для врагов ----------
  {
    id: 'wolf',
    name: 'Волк',
    icon: '🐺',
    description: 'Быстрый зверь. Слабый поодиночке, опасный в стае.',
    cost: {},
    base: stats({ hp: 70, atk: 18, def: 4, spd: 16, eva: 15, crit: 10, morale: 50 }),
    tags: ['melee', 'beast'],
    targeting: 'weakest',
  },
  {
    id: 'skeleton',
    name: 'Скелет',
    icon: '💀',
    description: 'Не знает страха. Не знает и ловкости.',
    cost: {},
    base: stats({ hp: 90, atk: 17, def: 14, spd: 6, eva: 0, morale: 100 }),
    tags: ['melee', 'undead', 'fearless'],
    targeting: 'nearest',
  },
  {
    id: 'bandit_archer',
    name: 'Разбойник-стрелок',
    icon: '🎯',
    description: 'Стреляет из-за спин и целится в самых уязвимых.',
    cost: {},
    base: stats({ hp: 75, atk: 20, def: 5, spd: 12, acc: 88, range: 3, morale: 55 }),
    tags: ['ranged', 'infantry', 'human'],
    targeting: 'weakest',
  },
  {
    id: 'ogre',
    name: 'Огр',
    icon: '👹',
    description: 'Огромен и медлителен. Каждый удар — как обвал.',
    cost: {},
    base: stats({ hp: 210, atk: 29, def: 13, spd: 5, acc: 75, crit: 10, morale: 70 }),
    tags: ['melee', 'beast', 'boss'],
    targeting: 'nearest',
    abilities: [{ key: 'cleave', pct: 35 }],
  },
  {
    id: 'lich',
    name: 'Лич',
    icon: '🧙',
    description: 'Повелитель мёртвых. Отравляет и восстанавливается.',
    cost: {},
    base: stats({ hp: 170, atk: 30, def: 10, spd: 9, acc: 95, range: 4, armorPen: 30, morale: 100 }),
    tags: ['ranged', 'magic', 'undead', 'fearless', 'boss'],
    targeting: 'strongest',
    element: 'poison',
    abilities: [
      { key: 'poisonOnHit', stacks: 2 },
      { key: 'regen', hp: 8 },
    ],
  },
];

export const RECRUIT_BY_ID: Record<string, RecruitDef> = Object.fromEntries(RECRUITS.map((r) => [r.id, r]));

/** Рекруты, доступные игроку для найма (остальные — только враги). */
export const PLAYER_RECRUIT_IDS = ['militia', 'archer', 'knight', 'rogue', 'mage', 'lancer'] as const;
