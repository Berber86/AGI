import { MOMENTUM_META } from '@/data/momentum';
import type { BattleEvent, BattlePhase, BattleUnitState } from './combat.types';

/**
 * Проигрывание боя: чистая функция, восстанавливающая видимое состояние
 * по событиям [0..upto]. Используется UI, тестами и будущим реплеем.
 */

export type FxKind =
  | 'hit'
  | 'crit'
  | 'miss'
  | 'heal'
  | 'death'
  | 'rout'
  | 'attackMelee'
  | 'attackRanged';

export interface UnitFx {
  /** Монотонный счётчик — ключ CSS-анимации, чтобы она перезапускалась. */
  n: number;
  kind: FxKind;
  amount?: number;
}

export interface FrameBanner {
  text: string;
  kind: 'phase' | 'round';
  key: number;
}

export interface FrameState {
  units: Map<string, BattleUnitState>;
  fx: Map<string, UnitFx>;
  round: number;
  phase: BattlePhase;
  banner: FrameBanner | null;
  finished: boolean;
  /** Индекс последнего обработанного события. */
  cursor: number;
}

/** Восстанавливает состояние на кадре `upto` (индекс события включительно). */
export function computeFrameState(events: readonly BattleEvent[], initial: readonly BattleUnitState[], upto: number): FrameState {
  const units = new Map(initial.map((u) => [u.id, { ...u, stats: { ...u.stats }, tags: [...u.tags], abilities: u.abilities.map((a) => ({ ...a })) }]));
  const fx = new Map<string, UnitFx>();
  let round = 0;
  let phase: BattlePhase = 'surprise';
  let banner: FrameBanner | null = null;

  const last = Math.min(upto, events.length - 1);
  for (let i = 0; i <= last; i++) {
    const ev = events[i]!;
    const n = i + 1;
    switch (ev.type) {
      case 'phase':
        phase = ev.phase;
        banner = { text: ev.phase === 'surprise' ? '⚡ Внезапная атака' : '⚔️ Основная схватка', kind: 'phase', key: n };
        break;
      case 'momentum':
        banner = { text: `⚡ Тактика: ${MOMENTUM_META[ev.tactic].label}`, kind: 'phase', key: n };
        break;
      case 'attack': {
        const t = units.get(ev.tgt)!;
        t.wardCharges = ev.tgtWard;
        if (ev.hit) {
          t.hp = ev.tgtHp;
          t.shield = ev.tgtShield;
          fx.set(ev.tgt, { n, kind: ev.crit ? 'crit' : 'hit', amount: ev.dmg });
          if (ev.kind !== 'cleave') {
            const attackFx: UnitFx = { n, kind: ev.kind === 'ranged' ? 'attackRanged' : 'attackMelee' };
            fx.set(ev.src, attackFx);
          }
        } else {
          fx.set(ev.tgt, { n, kind: 'miss' });
        }
        break;
      }
      case 'dot': {
        const t = units.get(ev.tgt)!;
        t.hp = ev.tgtHp;
        fx.set(ev.tgt, { n, kind: 'hit', amount: ev.dmg });
        break;
      }
      case 'heal': {
        const t = units.get(ev.tgt)!;
        t.hp = ev.tgtHp;
        fx.set(ev.tgt, { n, kind: 'heal', amount: ev.amount });
        break;
      }
      case 'status': {
        const t = units.get(ev.tgt)!;
        if (ev.status === 'poison') t.poison = ev.stacks;
        else if (ev.status === 'stun') t.stunRounds = ev.stacks;
        else if (ev.status === 'slow') t.slowRounds = ev.stacks;
        else t.shield = ev.stacks;
        break;
      }
      case 'morale': {
        const t = units.get(ev.unit);
        if (t) t.morale = ev.morale;
        break;
      }
      case 'death': {
        const t = units.get(ev.unit)!;
        t.alive = false;
        t.hp = 0;
        t.poison = 0;
        t.stunRounds = 0;
        t.slowRounds = 0;
        fx.set(ev.unit, { n, kind: 'death' });
        break;
      }
      case 'rout': {
        const t = units.get(ev.unit)!;
        t.routed = true;
        t.morale = ev.morale;
        fx.set(ev.unit, { n, kind: 'rout' });
        break;
      }
      case 'advance': {
        const t = units.get(ev.unit);
        if (t) t.line = ev.toLine;
        break;
      }
      case 'skip': {
        // Оглушение списывается в момент пропущенного удара — зеркалим симуляцию.
        if (ev.reason === 'stunned') {
          const t = units.get(ev.unit);
          if (t) t.stunRounds = Math.max(0, t.stunRounds - 1);
        }
        break;
      }
      case 'roundStart': {
        // Зеркало симуляции: замедление тикает в начале раунда.
        for (const t of units.values()) {
          if (t.alive && !t.routed && t.slowRounds > 0) t.slowRounds -= 1;
        }
        round = ev.round;
        banner = { text: `Раунд ${ev.round}`, kind: 'round', key: n };
        break;
      }
      case 'end':
        break;
    }
  }
  return { units, fx, round, phase, banner, finished: upto >= events.length - 1, cursor: last };
}
