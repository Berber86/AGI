export interface CityBuilding {
  id: string;
  name: string;
  level: number;
  maxLevel: number;
  baseCost: {
    gold: number;
    cogParts: number;
  };
  costMultiplier: number;
  production: {
    gold?: number;
    cogParts?: number;
    science?: number;
    culture?: number;
  };
  description: string;
  icon: string;
  techRequired?: string;
}

export const INITIAL_BUILDINGS: CityBuilding[] = [
  {
    id: 'steam_press',
    name: 'Кустарная Мастерская',
    level: 1,
    maxLevel: 10,
    baseCost: { gold: 30, cogParts: 10 },
    costMultiplier: 1.5,
    production: { cogParts: 3, gold: 2 },
    description: 'Мануфактура ручной штамповки болтов и шестерней.',
    icon: 'Hammer',
  },
  {
    id: 'alchemy_scriptorium',
    name: 'Алхимический Скрипторий',
    level: 1,
    maxLevel: 10,
    baseCost: { gold: 50, cogParts: 20 },
    costMultiplier: 1.55,
    production: { science: 4, culture: 1 },
    description: 'Ученые и чертежники расшифровывают формулы древних машин.',
    icon: 'BookOpen',
  },
  {
    id: 'clockwork_treasury',
    name: 'Городской Монетный Двор',
    level: 0,
    maxLevel: 10,
    baseCost: { gold: 80, cogParts: 40 },
    costMultiplier: 1.6,
    production: { gold: 8 },
    description: 'Чеканка имперских золотых кронов и учет налогов мануфактур.',
    icon: 'Coins',
  },
  {
    id: 'steam_manufactory',
    name: 'Паровой Цех Высокого Давления',
    level: 0,
    maxLevel: 10,
    baseCost: { gold: 150, cogParts: 90 },
    costMultiplier: 1.7,
    production: { cogParts: 10, gold: 5 },
    description: 'Грохочущие паровые молоты для массового производства зубчатых передач.',
    icon: 'Cpu',
    techRequired: 'steam_boiler',
  },
  {
    id: 'observatory',
    name: 'Астрономическая Обсерватория',
    level: 0,
    maxLevel: 10,
    baseCost: { gold: 220, cogParts: 120 },
    costMultiplier: 1.75,
    production: { science: 14, culture: 4 },
    description: 'Гигантские телескопы улавливают движение небесных сфер.',
    icon: 'Telescope',
    techRequired: 'optics_and_mirrors',
  },
  {
    id: 'titan_foundry',
    name: 'Титаническая Доменная Печь',
    level: 0,
    maxLevel: 10,
    baseCost: { gold: 400, cogParts: 250 },
    costMultiplier: 1.8,
    production: { cogParts: 25, gold: 15, science: 8 },
    description: 'Колоссальные печи плавления орихалка и термостойкой стали.',
    icon: 'Flame',
    techRequired: 'clockwork_colossus',
  },
];
