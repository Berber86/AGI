import type { ComputedUnit, Stats, UnitTag, Ability, TargetingRule, Element, Rarity } from '@/engine/unit/unit.types';
import { DEFAULT_STATS } from '@/data/recruits';

/** Быстрая сборка боевого юнита для тестов. */
export function mkUnit(opts: {
  id: string;
  name?: string;
  side?: 'player' | 'enemy';
  hp?: number;
  atk?: number;
  def?: number;
  spd?: number;
  acc?: number;
  eva?: number;
  crit?: number;
  critDmg?: number;
  range?: number;
  morale?: number;
  lifesteal?: number;
  armorPen?: number;
  line?: number;
  column?: number;
  tags?: UnitTag[];
  abilities?: Ability[];
  targeting?: TargetingRule;
  element?: Element;
  rarity?: Rarity;
}): ComputedUnit {
  const stats: Stats = {
    ...DEFAULT_STATS,
    ...(opts.hp !== undefined && { hp: opts.hp }),
    ...(opts.atk !== undefined && { atk: opts.atk }),
    ...(opts.def !== undefined && { def: opts.def }),
    ...(opts.spd !== undefined && { spd: opts.spd }),
    ...(opts.acc !== undefined && { acc: opts.acc }),
    ...(opts.eva !== undefined && { eva: opts.eva }),
    ...(opts.crit !== undefined && { crit: opts.crit }),
    ...(opts.critDmg !== undefined && { critDmg: opts.critDmg }),
    ...(opts.range !== undefined && { range: opts.range }),
    ...(opts.morale !== undefined && { morale: opts.morale }),
    ...(opts.lifesteal !== undefined && { lifesteal: opts.lifesteal }),
    ...(opts.armorPen !== undefined && { armorPen: opts.armorPen }),
  };
  return {
    id: opts.id,
    name: opts.name ?? opts.id,
    icon: '🧪',
    recruitId: 'test',
    stats,
    tags: opts.tags ?? ['infantry'],
    abilities: opts.abilities ?? [],
    targeting: opts.targeting ?? 'nearest',
    element: opts.element ?? 'physical',
    line: opts.line ?? 0,
    column: 0,
    rarity: opts.rarity ?? 'common',
    setCounts: {},
  };
}
