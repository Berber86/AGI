import type { Modifier, PartialResources } from '@/engine/unit/unit.types';

export interface BuildingDef {
  id: string;
  name: string;
  icon: string;
  description: string;
  maxLevel: number;
  /** Стоимость 1-го уровня; каждый следующий дороже в costGrowth раз. */
  baseCost: PartialResources;
  costGrowth: number;
  /** Производство за один ход на каждый уровень. */
  production?: PartialResources;
  /** Модификаторы на каждый уровень здания. */
  perLevel?: Modifier[];
  unlockTech?: string;
}

export const BUILDINGS: BuildingDef[] = [
  {
    id: 'farm',
    name: 'Ферма',
    icon: '🌾',
    description: 'Кормит отряды. Еда — основная валюта найма.',
    maxLevel: 5,
    baseCost: { gold: 20 },
    costGrowth: 1.6,
    production: { food: 12 },
  },
  {
    id: 'mine',
    name: 'Шахта',
    icon: '⛏️',
    description: 'Руда нужна для слияния шестерёнок и тяжёлой пехоты.',
    maxLevel: 5,
    baseCost: { gold: 30, food: 10 },
    costGrowth: 1.6,
    production: { ore: 8 },
    unlockTech: 'mining',
  },
  {
    id: 'library',
    name: 'Библиотека',
    icon: '📚',
    description: 'Наука открывает технологии, а те — иконки и догмы.',
    maxLevel: 5,
    baseCost: { gold: 40, food: 10 },
    costGrowth: 1.7,
    production: { science: 6 },
    unlockTech: 'writing',
  },
  {
    id: 'market',
    name: 'Рынок',
    icon: '🏪',
    description: 'Золото — универсальный ресурс для построек и найма.',
    maxLevel: 5,
    baseCost: { food: 30, ore: 10 },
    costGrowth: 1.7,
    production: { gold: 10 },
    unlockTech: 'currency',
  },
  {
    id: 'barracks',
    name: 'Казармы',
    icon: '⚔️',
    description: 'Муштра: каждый уровень даёт +5% здоровья всем отрядам.',
    maxLevel: 4,
    baseCost: { gold: 50, food: 30, ore: 10 },
    costGrowth: 1.8,
    perLevel: [{ kind: 'stat', stat: 'hp', pct: 5 }],
    unlockTech: 'bronze_working',
  },
  {
    id: 'forge',
    name: 'Кузница',
    icon: '🔥',
    description: 'Каждый уровень удешевляет слияние шестерёнок на 10%.',
    maxLevel: 3,
    baseCost: { gold: 60, ore: 40 },
    costGrowth: 1.8,
    perLevel: [{ kind: 'craftDiscount', pct: 10 }],
    unlockTech: 'iron_working',
  },
  {
    id: 'shrine',
    name: 'Святилище',
    icon: '⛩️',
    description: 'Каждый уровень даёт +5 морали всем отрядам.',
    maxLevel: 3,
    baseCost: { gold: 40, food: 20 },
    costGrowth: 1.7,
    perLevel: [{ kind: 'stat', stat: 'morale', flat: 5 }],
    unlockTech: 'pottery',
  },
];

export const BUILDING_BY_ID: Record<string, BuildingDef> = Object.fromEntries(BUILDINGS.map((b) => [b.id, b]));
