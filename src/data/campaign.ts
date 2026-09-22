import { GearRarity } from './gear';

export type NodeType = 'battle' | 'elite' | 'rest' | 'workshop' | 'boss';

export interface CampaignNode {
  id: string;
  stage: number;
  colIndex: number;
  rowIndex: number;
  type: NodeType;
  name: string;
  description: string;
  connections: string[];
  completed: boolean;
  enemySquads?: {
    name: string;
    role: 'vanguard' | 'duelist' | 'arcanist';
    hpMultiplier: number;
    attackMultiplier: number;
    speedBonus: number;
    row: number;
    col: number;
  }[];
  rewards: {
    gold: number;
    science: number;
    cogParts: number;
    gearDropChance: number;
    guaranteedRarity?: GearRarity;
  };
}

export function generateCampaignGraph(cycle: number = 1): CampaignNode[] {
  const mult = 1 + (cycle - 1) * 0.25;

  return [
    // Stage 1
    {
      id: 'node_1_1',
      stage: 1,
      colIndex: 0,
      rowIndex: 1,
      type: 'battle',
      name: 'Разведчики Ржавчины',
      description: 'Передовой дозор автоматонов-мародеров на границе Пустошей.',
      connections: ['node_2_1', 'node_2_2'],
      completed: false,
      enemySquads: [
        { name: 'Ржавый Дробильщик', role: 'vanguard', hpMultiplier: 0.9 * mult, attackMultiplier: 0.85 * mult, speedBonus: 0, row: 2, col: 12 },
        { name: 'Стрелок-Мародер', role: 'arcanist', hpMultiplier: 0.8 * mult, attackMultiplier: 0.9 * mult, speedBonus: 1, row: 1, col: 14 },
      ],
      rewards: { gold: 35, science: 20, cogParts: 15, gearDropChance: 0.7, guaranteedRarity: 'common' },
    },
    // Stage 2
    {
      id: 'node_2_1',
      stage: 2,
      colIndex: 1,
      rowIndex: 0,
      type: 'battle',
      name: 'Углекислый Патруль',
      description: 'Отряд автоматонов с коптящими угольными топками.',
      connections: ['node_3_1', 'node_3_2'],
      completed: false,
      enemySquads: [
        { name: 'Угольный Голем', role: 'vanguard', hpMultiplier: 1.0 * mult, attackMultiplier: 0.9 * mult, speedBonus: -1, row: 2, col: 12 },
        { name: 'Кочегар-Застрельщик', role: 'duelist', hpMultiplier: 0.9 * mult, attackMultiplier: 1.0 * mult, speedBonus: 2, row: 0, col: 13 },
      ],
      rewards: { gold: 45, science: 25, cogParts: 20, gearDropChance: 0.8 },
    },
    {
      id: 'node_2_2',
      stage: 2,
      colIndex: 1,
      rowIndex: 2,
      type: 'rest',
      name: 'Заброшенный Водонапорный Шпиль',
      description: 'Безопасное укрытие для охлаждения котлов и починки обшивки.',
      connections: ['node_3_2', 'node_3_3'],
      completed: false,
      rewards: { gold: 20, science: 10, cogParts: 10, gearDropChance: 0 },
    },
    // Stage 3
    {
      id: 'node_3_1',
      stage: 3,
      colIndex: 2,
      rowIndex: 0,
      type: 'elite',
      name: 'Элитный Паровой Центурион',
      description: 'Тяжелый военный автомат Первой Династии, вооруженный пневмо-молотом.',
      connections: ['node_4_1'],
      completed: false,
      enemySquads: [
        { name: 'Паровой Центурион', role: 'vanguard', hpMultiplier: 1.35 * mult, attackMultiplier: 1.25 * mult, speedBonus: 1, row: 2, col: 11 },
        { name: 'Винтовой Ассасин', role: 'duelist', hpMultiplier: 1.1 * mult, attackMultiplier: 1.2 * mult, speedBonus: 4, row: 1, col: 13 },
        { name: 'Мортирный Автомат', role: 'arcanist', hpMultiplier: 1.0 * mult, attackMultiplier: 1.3 * mult, speedBonus: 0, row: 3, col: 15 },
      ],
      rewards: { gold: 80, science: 50, cogParts: 45, gearDropChance: 1.0, guaranteedRarity: 'rare' },
    },
    {
      id: 'node_3_2',
      stage: 3,
      colIndex: 2,
      rowIndex: 1,
      type: 'workshop',
      name: 'Кочевая Кузня Гильдии',
      description: 'Мастера согласны переплавить излишки запчастей в ценные шестерни.',
      connections: ['node_4_1', 'node_4_2'],
      completed: false,
      rewards: { gold: 30, science: 15, cogParts: 35, gearDropChance: 0.5 },
    },
    {
      id: 'node_3_3',
      stage: 3,
      colIndex: 2,
      rowIndex: 2,
      type: 'battle',
      name: 'Шестеренный Рой',
      description: 'Свора быстрых механизмов-перехватчиков.',
      connections: ['node_4_2'],
      completed: false,
      enemySquads: [
        { name: 'Роевой Шершень A', role: 'duelist', hpMultiplier: 0.85 * mult, attackMultiplier: 1.1 * mult, speedBonus: 5, row: 0, col: 12 },
        { name: 'Роевой Шершень B', role: 'duelist', hpMultiplier: 0.85 * mult, attackMultiplier: 1.1 * mult, speedBonus: 5, row: 4, col: 12 },
        { name: 'Ульевый Контроллер', role: 'arcanist', hpMultiplier: 1.1 * mult, attackMultiplier: 1.0 * mult, speedBonus: 2, row: 2, col: 15 },
      ],
      rewards: { gold: 55, science: 30, cogParts: 30, gearDropChance: 0.85 },
    },
    // Stage 4
    {
      id: 'node_4_1',
      stage: 4,
      colIndex: 3,
      rowIndex: 0,
      type: 'battle',
      name: 'Застава Хронометристов',
      description: 'Укрепленный форпост с резонансными часовыми вышками.',
      connections: ['node_5_1'],
      completed: false,
      enemySquads: [
        { name: 'Хроно-Рыцарь', role: 'vanguard', hpMultiplier: 1.2 * mult, attackMultiplier: 1.15 * mult, speedBonus: 2, row: 2, col: 12 },
        { name: 'Снайпер Курантов', role: 'arcanist', hpMultiplier: 1.0 * mult, attackMultiplier: 1.25 * mult, speedBonus: 3, row: 1, col: 16 },
      ],
      rewards: { gold: 70, science: 45, cogParts: 35, gearDropChance: 0.9 },
    },
    {
      id: 'node_4_2',
      stage: 4,
      colIndex: 3,
      rowIndex: 2,
      type: 'rest',
      name: 'Оазис Термальных Источников',
      description: 'Теплые гейзеры и спокойствие перед восхождением к цитадели.',
      connections: ['node_5_1'],
      completed: false,
      rewards: { gold: 40, science: 20, cogParts: 20, gearDropChance: 0 },
    },
    // Stage 5: Boss
    {
      id: 'node_5_1',
      stage: 5,
      colIndex: 4,
      rowIndex: 1,
      type: 'boss',
      name: 'Автоматон-Владыка «Кронос III»',
      description: 'Верховный титан древней часовой империи. Его шестерни сотрясают землю.',
      connections: [],
      completed: false,
      enemySquads: [
        { name: 'Титанический Бастион Кроноса', role: 'vanguard', hpMultiplier: 1.7 * mult, attackMultiplier: 1.4 * mult, speedBonus: 1, row: 2, col: 11 },
        { name: 'Шестеренный Палач', role: 'duelist', hpMultiplier: 1.3 * mult, attackMultiplier: 1.5 * mult, speedBonus: 4, row: 1, col: 13 },
        { name: 'Сердце Сингулярности', role: 'arcanist', hpMultiplier: 1.4 * mult, attackMultiplier: 1.6 * mult, speedBonus: 2, row: 3, col: 15 },
      ],
      rewards: { gold: 200, science: 150, cogParts: 120, gearDropChance: 1.0, guaranteedRarity: 'epic' },
    },
  ];
}
