import { GearItem } from '../../data/gear';
import { UnitRole } from '../../data/recruits';

export interface UnitBaseStats {
  maxHp: number;
  attack: number;
  defense: number;
  speed: number;
  range: number;
  critChance: number;
  dodgeRate: number;
  accuracy: number;
}

export interface ComputedUnitStats extends UnitBaseStats {
  effectiveHp: number;
  armorPenetration: number;
  startingShield: number;
  activeSets: {
    setId: string;
    count: number;
    hasTwoPiece: boolean;
    hasThreePiece: boolean;
    name: string;
    description: string;
  }[];
  activeDogmaBonuses: string[];
}

export interface UnitEntity {
  id: string;
  name: string;
  role: UnitRole;
  isPlayer: boolean;
  row: number; // 0..4 (5 lines)
  col: number; // 0..19 (10x20 grid)
  currentHp: number;
  maxHp: number;
  shield: number;
  morale: number; // 0..100
  isFled: boolean;
  stats: ComputedUnitStats;
  equippedGear: {
    core?: GearItem;
    drive?: GearItem;
    aux?: GearItem;
  };
  statuses: {
    type: 'poison' | 'stun' | 'slow' | 'shield';
    duration: number;
    value: number;
  }[];
}
