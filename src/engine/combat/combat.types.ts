import type { Ability, ComputedUnit, Element, Rarity, TargetingRule, UnitTag } from '@/engine/unit/unit.types';

export type Side = 'player' | 'enemy';

/** Размеры поля: 10 колонок × 20 рядов; каждая сторона владеет 10 рядами = 5 линиями по 2 ряда. */
export const FIELD = { columns: 10, rows: 20, linesPerSide: 5, rowsPerLine: 2 } as const;

/** Порог морали, ниже которого юнит может обратиться в бегство. */
export const MORALE_BREAK = 25;

/** Состояние юнита внутри симуляции. */
export interface BattleUnitState {
  id: string;
  side: Side;
  name: string;
  icon: string;
  recruitId: string;
  stats: ComputedUnit['stats'];
  hp: number;
  maxHp: number;
  shield: number;
  morale: number;
  poison: number;
  line: number;
  column: number;
  alive: boolean;
  routed: boolean;
  tags: UnitTag[];
  abilities: Ability[];
  targeting: TargetingRule;
  element: Element;
  rarity: Rarity;
  setCounts: Record<string, number>;
  /** Флаги однократных потерь морали. */
  hpFlags: { below50: boolean; below25: boolean };
  kills: number;
  damageDealt: number;
}

export type BattlePhase = 'surprise' | 'main';

export type BattleEvent =
  | { type: 'phase'; phase: BattlePhase }
  | { type: 'roundStart'; round: number }
  | {
      type: 'attack';
      round: number;
      src: string;
      tgt: string;
      hit: boolean;
      crit: boolean;
      dmg: number;
      absorbed: number;
      tgtHp: number;
      tgtShield: number;
      kind: 'melee' | 'ranged' | 'cleave' | 'counter';
      element: Element;
      surprise: boolean;
    }
  | { type: 'dot'; round: number; tgt: string; dmg: number; tgtHp: number; status: 'poison' }
  | { type: 'heal'; round: number; tgt: string; amount: number; tgtHp: number; source: 'regen' | 'lifesteal' }
  | { type: 'status'; round: number; tgt: string; status: 'poison'; stacks: number }
  | { type: 'morale'; round: number; unit: string; delta: number; morale: number; reason: string }
  | { type: 'death'; round: number; unit: string; killer?: string }
  | { type: 'rout'; round: number; unit: string; morale: number }
  | { type: 'advance'; round: number; unit: string; fromLine: number; toLine: number }
  | { type: 'skip'; round: number; unit: string; reason: 'noTarget' }
  | { type: 'end'; winner: Side | 'draw'; rounds: number };

export interface BattleOptions {
  seed: number;
  /** Лимит раундов; по достижении — ничья. */
  maxRounds?: number;
}

export interface BattleResult {
  seed: number;
  winner: Side | 'draw';
  rounds: number;
  events: BattleEvent[];
  /** Состояние всех юнитов на старте (после расчёта статов). */
  initial: BattleUnitState[];
  /** Состояние всех юнитов на финише. */
  final: BattleUnitState[];
}

export const EVENT_TYPES = ['phase', 'roundStart', 'attack', 'dot', 'heal', 'status', 'morale', 'death', 'rout', 'advance', 'skip', 'end'] as const;
