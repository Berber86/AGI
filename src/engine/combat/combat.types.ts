export interface CombatUnitSnapshot {
  id: string;
  name: string;
  isPlayer: boolean;
  row: number;
  col: number;
  currentHp: number;
  maxHp: number;
  shield: number;
  morale: number;
  isDead: boolean;
  isFled: boolean;
}

export type CombatActionType =
  | 'ambush_strike'
  | 'attack'
  | 'critical_strike'
  | 'dodge'
  | 'status_damage'
  | 'stunned_skip'
  | 'flee'
  | 'tactical_card';

export interface CombatFrame {
  frameIndex: number;
  round: number;
  isAmbush: boolean;
  actionType: CombatActionType;
  actorId: string;
  actorName: string;
  actorIsPlayer: boolean;
  targetId?: string;
  targetName?: string;
  damage: number;
  isCrit: boolean;
  isDodge: boolean;
  absorbedByShield: number;
  statusApplied?: string;
  logMessage: string;
  unitSnapshots: CombatUnitSnapshot[];
}

export interface TacticalCard {
  id: string;
  name: string;
  costMorale: number;
  description: string;
  effect: 'shield_all' | 'focused_fire' | 'overclock_speed' | 'cleave_burst' | 'overclock_attack' | 'emp_stun' | 'smoke_screen';
}

export interface FightSimulationResult {
  winner: 'player' | 'enemy' | 'draw';
  roundsCount: number;
  frames: CombatFrame[];
  playerSurvivedCount: number;
  enemiesDefeatedCount: number;
  totalDamageDealtByPlayer: number;
  totalDamageDealtByEnemy: number;
  seed: number;
}
