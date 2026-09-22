# Описание Схем Данных (Data Schema)

## 1. Ресурсы Цивилизации
```typescript
export interface CityResources {
  gold: number;
  cogParts: number;
  science: number;
  culture: number;
}
```

## 2. Иконки Технологий (Innovation Dogma Icons)
```typescript
export type TechIcon = 'craft' | 'lore' | 'culture' | 'war' | 'mining' | 'agri';

export interface TechNode {
  id: string;
  name: string;
  era: 1 | 2 | 3 | 4;
  cost: number;
  prerequisites: string[];
  icons: Partial<Record<TechIcon, number>>;
  effectsDescription: string;
  bonusStats?: Partial<UnitStats>;
  buildingUnlocks?: string[];
}

export interface Dogma {
  id: string;
  name: string;
  description: string;
  requiredIcons: Partial<Record<TechIcon, number>>;
  effectType: 'combat' | 'economy';
  applyEffect: (context: unknown) => void;
}
```

## 3. Экипировка (Cogs / Gear)
```typescript
export type GearRarity = 'common' | 'rare' | 'epic' | 'legendary';
export type GearSlot = 'core' | 'drive' | 'aux';

export interface GearItem {
  id: string;
  name: string;
  slot: GearSlot;
  rarity: GearRarity;
  setName?: string;
  level: number;
  stats: Partial<UnitStats>;
  specialEffect?: string;
  iconSvg?: string;
}
```

## 4. Юниты и Боевые Показатели
```typescript
export interface UnitStats {
  maxHp: number;
  attack: number;
  defense: number;
  speed: number;
  range: number;
  critChance: number;   // 0.0 to 1.0
  dodgeRate: number;    // 0.0 to 1.0
  accuracy: number;     // 0.0 to 1.0
}

export interface CombatUnit {
  id: string;
  name: string;
  role: 'vanguard' | 'duelist' | 'arcanist';
  isPlayer: boolean;
  row: number; // 0..4 (5 lines)
  col: number; // 0..19 (10x20 field)
  stats: UnitStats;
  currentHp: number;
  maxHp: number;
  morale: number; // 0..100
  statuses: ActiveStatus[];
  equippedGear: {
    core?: GearItem;
    drive?: GearItem;
    aux?: GearItem;
  };
}
```

## 5. Кампания и Узлы
```typescript
export type NodeType = 'battle' | 'elite' | 'rest' | 'workshop' | 'boss';

export interface CampaignNode {
  id: string;
  stage: number;
  type: NodeType;
  name: string;
  description: string;
  connections: string[]; // IDs of reachable nodes
  completed: boolean;
  rewards?: {
    gold: number;
    science: number;
    cogParts: number;
    gearDropChance: number;
    gearGuaranteedRarity?: GearRarity;
  };
}
```
