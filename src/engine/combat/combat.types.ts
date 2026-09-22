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
  /** Оглушение: пропускает удары, пока > 0. */
  stunRounds: number;
  /** Замедление: эффективная скорость ×0.6, пока > 0. */
  slowRounds: number;
  /** Броня-щит с зарядами: каждый заряд поглощает wardPerCharge урона от одной атаки. */
  wardCharges: number;
  wardPerCharge: number;
  /** Временное уклонение (тактика «Строй щитов»), сбрасывается в конце раунда. */
  bonusEva: number;
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

/** Тактики Momentum — разовая активация игрока между раундами. */
export type MomentumTactic = 'rage' | 'focus' | 'volley' | 'guard';

export type StatusKind = 'poison' | 'stun' | 'slow' | 'shield';

export type BattleEvent =
  | { type: 'phase'; phase: BattlePhase }
  | { type: 'roundStart'; round: number }
  | { type: 'momentum'; round: number; tactic: MomentumTactic }
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
      /** Остаток зарядов брони-щита у цели после атаки (для точного реплея). */
      tgtWard: number;
      kind: 'melee' | 'ranged' | 'cleave' | 'counter';
      element: Element;
      surprise: boolean;
    }
  | { type: 'dot'; round: number; tgt: string; dmg: number; tgtHp: number; status: 'poison' }
  | { type: 'heal'; round: number; tgt: string; amount: number; tgtHp: number; source: 'regen' | 'lifesteal' }
  | { type: 'status'; round: number; tgt: string; status: StatusKind; stacks: number }
  | { type: 'morale'; round: number; unit: string; delta: number; morale: number; reason: string }
  | { type: 'death'; round: number; unit: string; killer?: string }
  | { type: 'rout'; round: number; unit: string; morale: number }
  | { type: 'advance'; round: number; unit: string; fromLine: number; toLine: number }
  | { type: 'skip'; round: number; unit: string; reason: 'noTarget' | 'stunned' }
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

export const EVENT_TYPES = ['phase', 'roundStart', 'momentum', 'attack', 'dot', 'heal', 'status', 'morale', 'death', 'rout', 'advance', 'skip', 'end'] as const;

/** Правила Momentum-ресурса. */
export const MOMENTUM_RULES = {
  /** Стоимость активации (в единицах духа). */
  cost: 4,
  /** Чекпоинты: после каждого N-го раунда. */
  everyRounds: 3,
  /** Максимум духа в запасе. */
  maxSpirit: 10,
  /** Урон от отрядов игрока за 1 единицу духа. */
  spiritPerDamage: 40,
  /** Дух за убийство врага. */
  spiritPerKill: 2,
} as const;
