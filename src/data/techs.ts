export type TechIcon = 'craft' | 'lore' | 'culture' | 'war' | 'mining' | 'agri';

export interface TechNode {
  id: string;
  name: string;
  era: 1 | 2 | 3 | 4;
  branch: 'craftsman' | 'warfare' | 'alchemy' | 'industry';
  cost: number;
  prerequisites: string[];
  icons: Partial<Record<TechIcon, number>>;
  description: string;
  bonusEffectText: string;
  effects: {
    statBonuses?: {
      attack?: number;
      defense?: number;
      speed?: number;
      maxHp?: number;
      critChance?: number;
    };
    economicMultiplier?: {
      gold?: number;
      cogParts?: number;
      science?: number;
    };
    unlockBuilding?: string;
  };
}

export interface DogmaDefinition {
  id: string;
  name: string;
  requiredIcons: Partial<Record<TechIcon, number>>;
  tagline: string;
  description: string;
  bonusType: 'stat' | 'mechanic';
  combatBonus?: {
    attackPercent?: number;
    defensePercent?: number;
    speedBonus?: number;
    critBonus?: number;
    armorPenetration?: number;
    startingShield?: number;
  };
}

export const TECH_NODES: TechNode[] = [
  // --- ERA 1: Рассвет Механики ---
  {
    id: 'primitive_foundry',
    name: 'Кустарная Литейка',
    era: 1,
    branch: 'craftsman',
    cost: 40,
    prerequisites: [],
    icons: { craft: 1, mining: 1 },
    description: 'Основы плавки чугуна и грубой формовки зубчатых колес.',
    bonusEffectText: '+15% к производству Запчастей в час',
    effects: { economicMultiplier: { cogParts: 1.15 } },
  },
  {
    id: 'calligraphy_scrolls',
    name: 'Чертежные Манускрипты',
    era: 1,
    branch: 'alchemy',
    cost: 45,
    prerequisites: [],
    icons: { lore: 1, culture: 1 },
    description: 'Систематизация формул рычагов и каталогов сплавов.',
    bonusEffectText: '+20% к производству Науки',
    effects: { economicMultiplier: { science: 1.2 } },
  },
  {
    id: 'phalanx_drills',
    name: 'Шереножный Строй',
    era: 1,
    branch: 'warfare',
    cost: 50,
    prerequisites: [],
    icons: { war: 2 },
    description: 'Военная дисциплина и распределение веса в плотном строю.',
    bonusEffectText: '+15 к Макс. HP и +2 к Защите всем отрядам',
    effects: { statBonuses: { maxHp: 15, defense: 2 } },
  },
  {
    id: 'watermill_power',
    name: 'Водяное Колесо',
    era: 1,
    branch: 'industry',
    cost: 60,
    prerequisites: ['primitive_foundry'],
    icons: { craft: 1, agri: 1 },
    description: 'Использование течения рек для вращения первых полировочных валов.',
    bonusEffectText: 'Открывает постройку «Механическая Мельница»',
    effects: { unlockBuilding: 'watermill' },
  },
  {
    id: 'composite_bowstrings',
    name: 'Натяжные Бронзовые Тросы',
    era: 1,
    branch: 'warfare',
    cost: 75,
    prerequisites: ['phalanx_drills'],
    icons: { war: 1, craft: 1 },
    description: 'Эластичные сплавы для метательных осадных машин.',
    bonusEffectText: '+4 к Атаке всем отрядам',
    effects: { statBonuses: { attack: 4 } },
  },
  {
    id: 'herbal_infusion',
    name: 'Алхимические Вытяжки',
    era: 1,
    branch: 'alchemy',
    cost: 70,
    prerequisites: ['calligraphy_scrolls'],
    icons: { lore: 1, agri: 1 },
    description: 'Стимулирующие бальзамы для пилотов автоматонов.',
    bonusEffectText: '+3 к Скорости всем отрядам',
    effects: { statBonuses: { speed: 3 } },
  },

  // --- ERA 2: Век Пара и Поршней ---
  {
    id: 'steam_boiler',
    name: 'Паровой Котел Высокого Давления',
    era: 2,
    branch: 'craftsman',
    cost: 140,
    prerequisites: ['primitive_foundry', 'watermill_power'],
    icons: { craft: 2, mining: 1 },
    description: 'Герметичные заклепки и безопасные клапаны для паровой тяги.',
    bonusEffectText: '+25% к Золоту и Запчастям; открывает «Паровой Цех»',
    effects: { economicMultiplier: { gold: 1.25, cogParts: 1.25 }, unlockBuilding: 'steam_manufactory' },
  },
  {
    id: 'rifled_barrels',
    name: 'Нарезные Стволы',
    era: 2,
    branch: 'warfare',
    cost: 160,
    prerequisites: ['composite_bowstrings'],
    icons: { war: 2, craft: 1 },
    description: 'Винтовая нарезка для стабилизации паровых снарядов.',
    bonusEffectText: '+8 к Атаке и +5% к Криту',
    effects: { statBonuses: { attack: 8, critChance: 0.05 } },
  },
  {
    id: 'optics_and_mirrors',
    name: 'Оптические Системы Призматики',
    era: 2,
    branch: 'alchemy',
    cost: 150,
    prerequisites: ['calligraphy_scrolls'],
    icons: { lore: 2, culture: 1 },
    description: 'Фокусирующие линзы для телескопов и боевых рефлекторов.',
    bonusEffectText: '+35% к производству Науки; открывает «Обсерваторию»',
    effects: { economicMultiplier: { science: 1.35 }, unlockBuilding: 'observatory' },
  },
  {
    id: 'hardened_carapace',
    name: 'Закаленный Панцирь',
    era: 2,
    branch: 'warfare',
    cost: 180,
    prerequisites: ['phalanx_drills', 'steam_boiler'],
    icons: { war: 1, mining: 2 },
    description: 'Многослойная клепаная броня из легированной стали.',
    bonusEffectText: '+6 к Защите и +40 к Макс. HP',
    effects: { statBonuses: { defense: 6, maxHp: 40 } },
  },
  {
    id: 'sulfur_catalysis',
    name: 'Серный Катализ',
    era: 2,
    branch: 'alchemy',
    cost: 190,
    prerequisites: ['herbal_infusion'],
    icons: { lore: 1, mining: 2 },
    description: 'Синтез едких дымов и пороховых составов.',
    bonusEffectText: '+6 к Атаке; открывает «Алхимическую Лабораторию»',
    effects: { statBonuses: { attack: 6 }, unlockBuilding: 'alchemical_lab' },
  },
  {
    id: 'standardized_gearing',
    name: 'Стандартизация Калибров',
    era: 2,
    branch: 'industry',
    cost: 210,
    prerequisites: ['steam_boiler'],
    icons: { craft: 2, culture: 1 },
    description: 'Единые допуски и посадки для всех имперских фабрик.',
    bonusEffectText: '+4 к Скорости и +30% к производству Запчастей',
    effects: { statBonuses: { speed: 4 }, economicMultiplier: { cogParts: 1.3 } },
  },

  // --- ERA 3: Эра Заводных Колоссов ---
  {
    id: 'differential_engine',
    name: 'Разностная Машина Бэббиджа',
    era: 3,
    branch: 'craftsman',
    cost: 350,
    prerequisites: ['standardized_gearing', 'optics_and_mirrors'],
    icons: { craft: 2, lore: 2 },
    description: 'Механический вычислитель для баллистических таблиц.',
    bonusEffectText: '+10% к Шансу Крита и +50% к Науке',
    effects: { statBonuses: { critChance: 0.1 }, economicMultiplier: { science: 1.5 } },
  },
  {
    id: 'pressurized_hydraulics',
    name: 'Гидравлические Сервоприводы',
    era: 3,
    branch: 'industry',
    cost: 380,
    prerequisites: ['steam_boiler', 'hardened_carapace'],
    icons: { craft: 2, mining: 1, war: 1 },
    description: 'Масляные контуры высокого давления для мгновенной реакции манипуляторов.',
    bonusEffectText: '+12 к Атаке и +6 к Скорости',
    effects: { statBonuses: { attack: 12, speed: 6 } },
  },
  {
    id: 'heavy_artillery_chassis',
    name: 'Тяжелый Осадный Лафет',
    era: 3,
    branch: 'warfare',
    cost: 420,
    prerequisites: ['rifled_barrels'],
    icons: { war: 3, mining: 1 },
    description: 'Мобильные рельсовые платформы для мортир огромного калибра.',
    bonusEffectText: '+18 к Атаке и +8 к Защите',
    effects: { statBonuses: { attack: 18, defense: 8 } },
  },
  {
    id: 'toxic_phlogiston',
    name: 'Очищенный Флогистон',
    era: 3,
    branch: 'alchemy',
    cost: 390,
    prerequisites: ['sulfur_catalysis'],
    icons: { lore: 2, war: 1 },
    description: 'Концентрированное пламя, воспламеняющееся от контакта с кислородом.',
    bonusEffectText: '+15 к Атаке; атаки игнорируют 15% брони',
    effects: { statBonuses: { attack: 15 } },
  },
  {
    id: 'guild_charter',
    name: 'Хартия Великих Гильдий',
    era: 3,
    branch: 'industry',
    cost: 400,
    prerequisites: ['standardized_gearing'],
    icons: { culture: 3, craft: 1 },
    description: 'Союз инженеров и купцов, стимулирующий приток капитала.',
    bonusEffectText: '+50% к доходу Золота',
    effects: { economicMultiplier: { gold: 1.5 } },
  },
  {
    id: 'aetheric_resonator',
    name: 'Эфирный Резонатор',
    era: 3,
    branch: 'alchemy',
    cost: 440,
    prerequisites: ['optics_and_mirrors', 'sulfur_catalysis'],
    icons: { lore: 3, culture: 1 },
    description: 'Улавливание тонких вибраций эфира для подпитки кристаллических ядер.',
    bonusEffectText: '+80 к Макс. HP и +6 к Скорости',
    effects: { statBonuses: { maxHp: 80, speed: 6 } },
  },

  // --- ERA 4: Эра Сингулярности и Вечности ---
  {
    id: 'clockwork_colossus',
    name: 'Протокол «Заводной Титан»',
    era: 4,
    branch: 'warfare',
    cost: 800,
    prerequisites: ['heavy_artillery_chassis', 'pressurized_hydraulics'],
    icons: { war: 4, craft: 2 },
    description: 'Многоэтажные боевые автоматоны с автономным паровым реактором.',
    bonusEffectText: '+35 к Атаке, +15 к Защите, +150 к HP',
    effects: { statBonuses: { attack: 35, defense: 15, maxHp: 150 } },
  },
  {
    id: 'perpetual_governor',
    name: 'Хроно-регулятор Вечности',
    era: 4,
    branch: 'craftsman',
    cost: 850,
    prerequisites: ['differential_engine'],
    icons: { craft: 4, lore: 2 },
    description: 'Механизм с отрицательным коэффициентом трения.',
    bonusEffectText: '+12 к Скорости, +15% к Шансу Крита, +100% к производству Запчастей',
    effects: { statBonuses: { speed: 12, critChance: 0.15 }, economicMultiplier: { cogParts: 2.0 } },
  },
  {
    id: 'alchemical_transmutation',
    name: 'Философский Синтез Металлов',
    era: 4,
    branch: 'alchemy',
    cost: 880,
    prerequisites: ['toxic_phlogiston', 'aetheric_resonator'],
    icons: { lore: 4, mining: 2 },
    description: 'Трансмутация свинца в орихалк и жидкое золото.',
    bonusEffectText: '+100% к Золоту и Науке; +20 к Атаке',
    effects: { statBonuses: { attack: 20 }, economicMultiplier: { gold: 2.0, science: 2.0 } },
  },
  {
    id: 'imperial_monumentalism',
    name: 'Архитектурный Апофеоз',
    era: 4,
    branch: 'industry',
    cost: 920,
    prerequisites: ['guild_charter'],
    icons: { culture: 4, craft: 2 },
    description: 'Возведение грандиозных куполов и шпилей над всей метрополией.',
    bonusEffectText: '+100 к Макс. HP, +10 к Защите всем отрядам',
    effects: { statBonuses: { maxHp: 100, defense: 10 } },
  },
  {
    id: 'void_containment',
    name: 'Камера Удержания Сингулярности',
    era: 4,
    branch: 'craftsman',
    cost: 1100,
    prerequisites: ['perpetual_governor', 'clockwork_colossus'],
    icons: { craft: 3, lore: 3, war: 2 },
    description: 'Ядро черной дыры карманного размера, питающее орудия апокалипсиса.',
    bonusEffectText: '+50 к Атаке и +20% к Криту',
    effects: { statBonuses: { attack: 50, critChance: 0.2 } },
  },
];

// --- ДОГМЫ (Innovation-style Synergies) ---
export const DOGMAS: DogmaDefinition[] = [
  {
    id: 'dogma_iron_fist',
    name: 'Догма: Железная Поступь',
    requiredIcons: { war: 3 },
    tagline: '«Дисциплина крепче чугуна»',
    description: 'Все отряды получают +15% к урону и игнорируют 10% брони цели.',
    bonusType: 'stat',
    combatBonus: { attackPercent: 15, armorPenetration: 0.1 },
  },
  {
    id: 'dogma_steam_surge',
    name: 'Догма: Избыточное Давление',
    requiredIcons: { craft: 3 },
    tagline: '«Ни капли пара впустую»',
    description: 'Скорость всех отрядов увеличена на +5. В начале боя каждый отряд получает щит на 30 HP.',
    bonusType: 'mechanic',
    combatBonus: { speedBonus: 5, startingShield: 30 },
  },
  {
    id: 'dogma_rational_geometry',
    name: 'Догма: Рациональная Геометрия',
    requiredIcons: { lore: 3 },
    tagline: '«Траектория рассчитана до выстрела»',
    description: 'Шанс критического удара всех отрядов повышен на +12%.',
    bonusType: 'stat',
    combatBonus: { critBonus: 0.12 },
  },
  {
    id: 'dogma_bastion_of_labor',
    name: 'Догма: Бастион Труда',
    requiredIcons: { mining: 3 },
    tagline: '«Каждая порода послушна молоту»',
    description: 'Защита всех отрядов увеличена на +20%.',
    bonusType: 'stat',
    combatBonus: { defensePercent: 20 },
  },
  {
    id: 'dogma_grand_order',
    name: 'Догма: Великая Симфония Шестерен',
    requiredIcons: { craft: 5, war: 4 },
    tagline: '«Империя работает как единые куранты»',
    description: 'Урон увеличен на +25%, защита на +20%, щит в начале боя +60 HP.',
    bonusType: 'mechanic',
    combatBonus: { attackPercent: 25, defensePercent: 20, startingShield: 60 },
  },
  {
    id: 'dogma_enlightenment',
    name: 'Догма: Абсолютный Просветитель',
    requiredIcons: { lore: 5, culture: 3 },
    tagline: '«Свет разума рассекает туман хаоса»',
    description: 'Шанс критического удара +20%, скорость +8, игнорирование 25% брони.',
    bonusType: 'stat',
    combatBonus: { critBonus: 0.2, speedBonus: 8, armorPenetration: 0.25 },
  },
];
