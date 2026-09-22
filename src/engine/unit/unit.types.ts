/**
 * Базовые типы юнита, экипировки и модификаторов.
 * Файл не зависит от React и от данных — только контракты.
 */

/** Редкости шестерёнок, по возрастанию. */
export const RARITIES = ['common', 'uncommon', 'rare', 'epic', 'legendary'] as const;
export type Rarity = (typeof RARITIES)[number];

/** Слоты экипировки юнита. Ровно 4 слота — это дизайн-константа (см. docs/DECISIONS.md). */
export const GEAR_SLOTS = ['weapon', 'armor', 'trinket', 'core'] as const;
export type GearSlot = (typeof GEAR_SLOTS)[number];

/** Числовые характеристики юнита. */
export const STAT_KEYS = [
  'hp',
  'atk',
  'def',
  'spd',
  'acc',
  'eva',
  'crit',
  'critDmg',
  'range',
  'morale',
  'lifesteal',
  'armorPen',
] as const;
export type StatKey = (typeof STAT_KEYS)[number];
export type Stats = Record<StatKey, number>;
export type PartialStats = Partial<Stats>;

/** Теги юнита — используются таргетингом, сетами и догмами. */
export type UnitTag =
  | 'melee'
  | 'ranged'
  | 'infantry'
  | 'cavalry'
  | 'magic'
  | 'beast'
  | 'undead'
  | 'human'
  | 'boss'
  | 'fearless';

/** Стихия урона. Пока влияет только на текст и статистику; множители — задел на Фазу 4. */
export type Element = 'physical' | 'fire' | 'frost' | 'poison' | 'arcane';

/** Правило выбора цели. */
export type TargetingRule =
  | 'nearest' // ближайшая линия, затем наименьший % HP
  | 'weakest' // наименьший текущий HP
  | 'strongest' // наибольшая атака
  | 'ranged' // предпочитает цели с тегом ranged
  | 'random';

/** Способности — дискретный набор ключей с параметрами, из них генерируется текст карты. */
export type Ability =
  | { key: 'firstStrike' } // действует в фазе внезапной атаки
  | { key: 'poisonOnHit'; stacks: number } // накладывает яд при попадании
  | { key: 'cleave'; pct: number } // бьёт вторую цель в той же линии на pct% урона
  | { key: 'doubleStrike'; chance: number } // шанс атаковать повторно
  | { key: 'retaliate'; pct: number } // контратака при получении ближнего удара
  | { key: 'regen'; hp: number } // лечение каждый раунд
  | { key: 'execute'; threshold: number; bonus: number } // бонус урона по целям ниже threshold% HP
  | { key: 'rally'; morale: number } // при убийстве все союзники получают мораль
  | { key: 'shield'; amount: number } // щит, поглощающий урон в начале боя
  | { key: 'stunOnHit'; chance: number; rounds: number } // шанс оглушить цель
  | { key: 'slowOnHit'; rounds: number } // замедление цели при попадании
  | { key: 'wardOnStart'; charges: number; perCharge: number } // броня-щит с зарядами
  | { key: 'targetPref'; tag: UnitTag }; // приоритет целей с тегом

export type AbilityKey = Ability['key'];

/** Универсальный модификатор — из техов, догм, зданий, сетов. */
export type Modifier =
  | { kind: 'stat'; stat: StatKey; flat?: number; pct?: number }
  | { kind: 'production'; resource: ResourceKey; flat?: number; pct?: number }
  | { kind: 'lootRarity'; bonus: number } // сдвиг весов редкости (в "очках", см. gearGenerator)
  | { kind: 'lootCount'; bonus: number }
  | { kind: 'craftDiscount'; pct: number }
  | { kind: 'ability'; ability: Ability };

export const RESOURCE_KEYS = ['food', 'ore', 'science', 'gold'] as const;
export type ResourceKey = (typeof RESOURCE_KEYS)[number];
export type Resources = Record<ResourceKey, number>;
export type PartialResources = Partial<Resources>;

/** Определение шестерёнки в пуле. */
export interface GearDef {
  id: string;
  name: string;
  icon: string;
  slot: GearSlot;
  rarity: Rarity;
  setId?: string;
  element?: Element;
  stats: PartialStats;
  abilities?: Ability[];
  tags?: UnitTag[];
  targeting?: TargetingRule;
  flavor?: string;
  /** Квестовый предмет: не выпадает из лута и не craft'ится — только наградой за испытание. */
  questOnly?: boolean;
}

/** Случайный аффикс на экземпляре предмета. */
export interface Affix {
  stat: StatKey;
  value: number;
}

/** Конкретный экземпляр шестерёнки в коллекции игрока. */
export interface GearInstance {
  uid: string;
  defId: string;
  rarity: Rarity;
  /** Множитель базовых статов, 0.85..1.15. */
  quality: number;
  affixes: Affix[];
  /** Номер цикла, в котором выпал предмет (для статистики и будущего скейлинга). */
  cycle: number;
  /** Если предмет — награда за квест, здесь его идентификатор. */
  quest?: string;
}

/** Бонус сета за N предметов. */
export interface SetBonus {
  pieces: number;
  stats?: PartialStats;
  pctStats?: PartialStats;
  abilities?: Ability[];
  text: string;
}

export interface GearSetDef {
  id: string;
  name: string;
  icon: string;
  element?: Element;
  bonuses: SetBonus[];
}

/** Шаблон рекрута. */
export interface RecruitDef {
  id: string;
  name: string;
  icon: string;
  description: string;
  cost: PartialResources;
  base: Stats;
  tags: UnitTag[];
  targeting: TargetingRule;
  element?: Element;
  abilities?: Ability[];
  /** Технология, открывающая рекрута. undefined — доступен сразу. */
  unlockTech?: string;
}

/** Отряд игрока (или врага) до расчёта. */
export interface SquadSetup {
  id: string;
  name: string;
  recruitId: string;
  gear: Partial<Record<GearSlot, GearInstance | null>>;
  /** Линия построения 0 (фронт) .. 4 (тыл). */
  line: number;
  /** Колонка 0..9 — используется как тай-брейкер при выборе цели. */
  column: number;
  /** Множитель базовых статов (скейлинг врагов по циклам). */
  statScale?: number;
  extraTags?: UnitTag[];
}

/** Полностью рассчитанный юнит — вход для симулятора боя. */
export interface ComputedUnit {
  id: string;
  name: string;
  icon: string;
  recruitId: string;
  stats: Stats;
  tags: UnitTag[];
  abilities: Ability[];
  targeting: TargetingRule;
  element: Element;
  line: number;
  column: number;
  /** Наивысшая редкость среди надетых предметов — для рамки карточки. */
  rarity: Rarity;
  /** Активные сет-бонусы: setId -> количество предметов. */
  setCounts: Record<string, number>;
}
