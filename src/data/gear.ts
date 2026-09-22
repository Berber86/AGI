export type GearRarity = 'common' | 'rare' | 'epic' | 'legendary';
export type GearSlot = 'core' | 'drive' | 'aux';

export interface GearItem {
  id: string;
  templateId: string;
  name: string;
  slot: GearSlot;
  rarity: GearRarity;
  level: number;
  setName?: string;
  stats: {
    attack?: number;
    defense?: number;
    maxHp?: number;
    speed?: number;
    range?: number;
    critChance?: number; // 0.0 - 1.0
    dodgeRate?: number;  // 0.0 - 1.0
    accuracy?: number;   // 0.0 - 1.0
  };
  specialEffect?: string;
  description: string;
}

export const GEAR_POOL: Omit<GearItem, 'id'>[] = [
  // --- CORE COGS ---
  {
    templateId: 'core_iron_gear',
    name: 'Чугунная Маховая Шестерня',
    slot: 'core',
    rarity: 'common',
    level: 1,
    stats: { attack: 8, maxHp: 30 },
    description: 'Тяжелый противовес, увеличивающий силу каждого механического взмаха.',
  },
  {
    templateId: 'core_bronze_piston',
    name: 'Бронзовый Поршневой Сердечник',
    slot: 'core',
    rarity: 'common',
    level: 1,
    stats: { attack: 12, maxHp: 20 },
    description: 'Надежный поршень для ритмичной передачи крутящего момента.',
  },
  {
    templateId: 'core_steam_press',
    name: 'Сердце Парового Пресса',
    slot: 'core',
    rarity: 'rare',
    level: 1,
    setName: 'steamforged',
    stats: { attack: 18, maxHp: 50, defense: 4 },
    description: 'Оснащено клапаном сброса пара высокого давления.',
  },
  {
    templateId: 'core_titan_crank',
    name: 'Коленвал Титанического Стража',
    slot: 'core',
    rarity: 'rare',
    level: 1,
    setName: 'titan_guard',
    stats: { attack: 10, maxHp: 80, defense: 8 },
    description: 'Сплав сверхпрочного чугуна, выдерживающий артиллерийские удары.',
  },
  {
    templateId: 'core_dragon_chamber',
    name: 'Камера Драконьего Сердца',
    slot: 'core',
    rarity: 'epic',
    level: 2,
    setName: 'clockwork_dragon',
    stats: { attack: 32, maxHp: 70, critChance: 0.1 },
    specialEffect: 'fire_fury',
    description: 'Искрит при каждом обороте, нагнетая раскаленные газы.',
  },
  {
    templateId: 'core_void_gyro',
    name: 'Сингулярный Гироскоп Бездны',
    slot: 'core',
    rarity: 'epic',
    level: 2,
    setName: 'void_core',
    stats: { attack: 28, maxHp: 60, speed: 6 },
    specialEffect: 'distortion',
    description: 'Вращается сразу в двух противоположных направлениях.',
  },
  {
    templateId: 'core_perpetual_singularity',
    name: 'Вечный Двигатель Архитектора',
    slot: 'core',
    rarity: 'legendary',
    level: 3,
    setName: 'void_core',
    stats: { attack: 45, maxHp: 120, defense: 12, speed: 8, critChance: 0.15 },
    specialEffect: 'singularity_pulse',
    description: 'Легендарное ядро Первой Империи, генерирующее неиссякаемый кинетический импульс.',
  },

  // --- DRIVE COGS ---
  {
    templateId: 'drive_copper_spring',
    name: 'Медная Заводная Пружина',
    slot: 'drive',
    rarity: 'common',
    level: 1,
    stats: { speed: 4, accuracy: 0.05 },
    description: 'Быстро взводится, обеспечивая плавное перемещение отряда.',
  },
  {
    templateId: 'drive_spur_pinion',
    name: 'Зубчатый Шестеренный Привод',
    slot: 'drive',
    rarity: 'common',
    level: 1,
    stats: { speed: 6, attack: 4 },
    description: 'Точно подогнанные зубцы исключают задержки при атаке.',
  },
  {
    templateId: 'drive_steam_injector',
    name: 'Паровой Ускорительный Инжектор',
    slot: 'drive',
    rarity: 'rare',
    level: 1,
    setName: 'steamforged',
    stats: { speed: 9, defense: 5, accuracy: 0.08 },
    description: 'Выпускает струю сжатого пара для молниеносного сокращения дистанции.',
  },
  {
    templateId: 'drive_alchemical_gearbox',
    name: 'Ртутный Редуктор Ордена',
    slot: 'drive',
    rarity: 'rare',
    level: 1,
    setName: 'alchemical_order',
    stats: { speed: 7, attack: 10, dodgeRate: 0.08 },
    description: 'Ртутная смазка многократно снижает трение в сочленениях.',
  },
  {
    templateId: 'drive_dragon_flame_drive',
    name: 'Турбина Пламенного Разгона',
    slot: 'drive',
    rarity: 'epic',
    level: 2,
    setName: 'clockwork_dragon',
    stats: { speed: 12, attack: 18, critChance: 0.12 },
    description: 'Форсажная турбина, оставляющая за собой полосу дыма и искр.',
  },
  {
    templateId: 'drive_warp_pendulum',
    name: 'Квантовый Маятник Пространства',
    slot: 'drive',
    rarity: 'legendary',
    level: 3,
    setName: 'void_core',
    stats: { speed: 16, dodgeRate: 0.25, accuracy: 0.15, attack: 22 },
    specialEffect: 'phase_dash',
    description: 'Позволяет отряду совершать микродвижения сквозь материальные преграды.',
  },

  // --- AUXILIARY COGS ---
  {
    templateId: 'aux_riveted_plate',
    name: 'Клепаная Защитная Пластина',
    slot: 'aux',
    rarity: 'common',
    level: 1,
    stats: { defense: 8, maxHp: 25 },
    description: 'Стандартный защитный накладной щиток кустарного производства.',
  },
  {
    templateId: 'aux_spyglass_scope',
    name: 'Оптический Прицел с Линзами',
    slot: 'aux',
    rarity: 'common',
    level: 1,
    stats: { range: 1, accuracy: 0.12, critChance: 0.05 },
    description: 'Бронзовая зрительная труба с набором шлифованных линз.',
  },
  {
    templateId: 'aux_steam_exhaust',
    name: 'Тепловой Конвектор Легиона',
    slot: 'aux',
    rarity: 'rare',
    level: 1,
    setName: 'steamforged',
    stats: { defense: 10, maxHp: 40, attack: 6 },
    description: 'Отводит излишки пара прямо во вражеские ряды.',
  },
  {
    templateId: 'aux_titan_plating',
    name: 'Монолитный Бронещит Стража',
    slot: 'aux',
    rarity: 'rare',
    level: 1,
    setName: 'titan_guard',
    stats: { defense: 16, maxHp: 65, dodgeRate: -0.05 },
    description: 'Сверхмассивная пластина, отражающая даже бронебойные болты.',
  },
  {
    templateId: 'aux_dragon_focus_crystal',
    name: 'Фокусирующий Кристалл Дракона',
    slot: 'aux',
    rarity: 'epic',
    level: 2,
    setName: 'clockwork_dragon',
    stats: { attack: 22, critChance: 0.18, range: 1 },
    specialEffect: 'sear_flesh',
    description: 'Концентрирует тепловую энергию в прожигающий луч.',
  },
  {
    templateId: 'aux_venom_injector',
    name: 'Чумной Катализатор Ордена',
    slot: 'aux',
    rarity: 'epic',
    level: 2,
    setName: 'alchemical_order',
    stats: { attack: 14, defense: 6, critChance: 0.1 },
    specialEffect: 'toxic_sting',
    description: 'Стеклянные ампулы с едким концентратом под постоянным давлением.',
  },
  {
    templateId: 'aux_aegis_of_ages',
    name: 'Эгида Небесного Колосса',
    slot: 'aux',
    rarity: 'legendary',
    level: 3,
    setName: 'titan_guard',
    stats: { defense: 26, maxHp: 150, attack: 15, dodgeRate: 0.1 },
    specialEffect: 'unyielding_fortress',
    description: 'Древний артефакт, выкованный для противостояния осадам богов.',
  },
];
