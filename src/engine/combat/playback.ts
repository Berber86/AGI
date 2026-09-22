import type { BattlePhase, BattleResult, BattleUnitState } from './combat.types';

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
export function computeFrameState(result: BattleResult, upto: number): FrameState {
  const units = new Map(result.initial.map((u) => [u.id, { ...u, stats: { ...u.stats }, tags: [...u.tags], abilities: u.abilities.map((a) => ({ ...a })) }]));
  const fx = new Map<string, UnitFx>();
  let round = 0;
  let phase: BattlePhase = 'surprise';
  let banner: FrameBanner | null = null;

  const last = Math.min(upto, result.events.length - 1);
  for (let i = 0; i <= last; i++) {
    const ev = result.events[i]!;
    const n = i + 1;
    switch (ev.type) {
      case 'phase':
        phase = ev.phase;
        banner = { text: ev.phase === 'surprise' ? '⚡ Внезапная атака' : '⚔️ Основная схватка', kind: 'phase', key: n };
        break;
      case 'roundStart':
        round = ev.round;
        banner = { text: `Раунд ${ev.round}`, kind: 'round', key: n };
        break;
      case 'attack': {
        const t = units.get(ev.tgt)!;
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
        t.poison = ev.stacks;
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
      case 'end':
        break;
    }
  }
  return { units, fx, round, phase, banner, finished: upto >= result.events.length - 1, cursor: last };
}
