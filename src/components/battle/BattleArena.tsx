import { useEffect, useMemo, useRef, useState } from 'react';
import type { BattleResult, BattleUnitState } from '@/engine/combat/combat.types';
import type { GearInstance } from '@/engine/unit/unit.types';
import { buildLog } from '@/engine/combat/log';
import { GEAR_BY_ID, RARITY_LABEL } from '@/data/gear';
import { NODE_KIND_META } from '@/data/campaign';
import { applyBattleOutcome, useGameStore } from '@/store/useGameStore';
import { UnitCard, type UnitCardData, type UnitFx } from './UnitCard';
import { FightLog } from './FightLog';

type Speed = 1 | 2 | 0; // 0 = мгновенно
const SPEED_MS: Record<Exclude<Speed, 0>, number> = { 1: 700, 2: 300 };

interface DisplayState {
  units: Map<string, BattleUnitState>;
  fx: Map<string, UnitFx>;
  round: number;
  phase: string;
  finished: boolean;
}

/** Пересчитывает видимое состояние по событиям [0..upto]. Чисто и без дрейфа. */
function displayState(result: BattleResult, upto: number): DisplayState {
  const units = new Map(result.initial.map((u) => [u.id, { ...u }]));
  const fx = new Map<string, UnitFx>();
  let round = 0;
  let phase = '⚡ Разведка';
  let n = 0;
  for (let i = 0; i <= upto && i < result.events.length; i++) {
    const ev = result.events[i]!;
    n++;
    switch (ev.type) {
      case 'phase':
        phase = ev.phase === 'surprise' ? '⚡ Внезапная атака' : '⚔️ Бой';
        break;
      case 'roundStart':
        round = ev.round;
        break;
      case 'attack': {
        const t = units.get(ev.tgt)!;
        if (ev.hit) {
          t.hp = ev.tgtHp;
          t.shield = ev.tgtShield;
          fx.set(ev.tgt, { n, kind: ev.crit ? 'crit' : 'hit', amount: ev.dmg });
          fx.delete(ev.src); // сброс прошлого fx атакующего
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
  return { units, fx, round, phase, finished: upto >= result.events.length - 1 };
}

function toCard(u: BattleUnitState): UnitCardData {
  return {
    id: u.id, name: u.name, icon: u.icon, side: u.side, hp: u.hp, maxHp: u.maxHp, shield: u.shield,
    morale: u.morale, poison: u.poison, line: u.line, alive: u.alive, routed: u.routed,
    rarity: u.rarity, stats: u.stats, abilities: u.abilities, tags: u.tags, targeting: u.targeting,
    setCounts: u.setCounts,
  };
}

function useBattle() {
  return useGameStore((s) => s.data.battle);
}
function useClearBattle() {
  return useGameStore((s) => s.clearBattle);
}

const RESULT_TEXT: Record<string, { title: string; cls: string }> = {
  player: { title: '🏆 Победа!', cls: 'text-amber-300' },
  enemy: { title: '💀 Поражение', cls: 'text-red-400' },
  draw: { title: '🤝 Ничья', cls: 'text-slate-300' },
};

export function BattleArena({
  result,
  kind,
  loot,
  income,
  onDone,
}: {
  result: BattleResult;
  kind: string;
  loot: GearInstance[];
  income: Record<string, number> | null;
  onDone: () => void;
}) {
  const [speed, setSpeed] = useState<Speed>(1);
  const [frame, setFrame] = useState(0);
  const [done, setDone] = useState(false);
  const total = result.events.length;
  const logRef = useRef<HTMLDivElement>(null);

  const ds = useMemo(() => displayState(result, frame), [result, frame]);

  // Тик воспроизведения.
  useEffect(() => {
    if (speed === 0) {
      setFrame(total - 1);
      return;
    }
    if (done) return;
    const ms = Math.max(80, SPEED_MS[speed]);
    const t = setTimeout(() => {
      setFrame((f) => {
        // За один тик проигрываем несколько коротких событий подряд.
        let next = f + 1;
        let budget = 2;
        while (next < total - 1 && budget > 0) {
          const t2 = result.events[next]!.type;
          if (t2 === 'attack' || t2 === 'death' || t2 === 'roundStart' || t2 === 'phase' || t2 === 'rout') break;
          next++;
          budget--;
        }
        return next;
      });
    }, ms);
    return () => clearTimeout(t);
  }, [frame, speed, done, total, result]);

  useEffect(() => {
    if (ds.finished && !done) setDone(true);
  }, [ds.finished, done]);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [frame]);

  const enemyUnits = [...ds.units.values()].filter((u) => u.side === 'enemy').sort((a, b) => a.column - b.column);
  const playerUnits = [...ds.units.values()].filter((u) => u.side === 'player').sort((a, b) => a.column - b.column);
  const logLines = useMemo(() => buildLog(result.events.slice(0, frame + 1), result.initial), [result, frame]);
  const meta = NODE_KIND_META[kind as keyof typeof NODE_KIND_META];
  const res = RESULT_TEXT[result.winner] ?? RESULT_TEXT.draw;

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-slate-950/97 backdrop-blur-sm">
      {/* верхняя панель */}
      <div className="flex items-center gap-3 border-b border-amber-500/20 px-4 py-2">
        <span className="text-lg font-bold text-amber-200">{meta?.icon} {kind === 'skirmish' ? 'Стычка' : (meta?.label ?? 'Бой')}</span>
        <span className="text-xs text-slate-400">{ds.phase} • Раунд {ds.round}/{result.rounds || '…'}</span>
        <div className="ml-auto flex items-center gap-1">
          {([1, 2, 0] as Speed[]).map((s) => (
            <button
              key={s}
              onClick={() => {
                setSpeed(s);
                if (s === 0) setFrame(total - 1);
              }}
              className={`rounded px-2 py-1 text-xs font-bold transition ${
                speed === s ? 'bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/50' : 'bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              {s === 0 ? '⏩ Итог' : `${s}×`}
            </button>
          ))}
        </div>
      </div>

      {/* поле боя */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex flex-wrap items-start justify-center gap-3 border-b border-red-900/30 bg-red-950/10 p-3">
          {enemyUnits.map((u) => (
            <UnitCard key={u.id} unit={toCard(u)} fx={ds.fx.get(u.id)} />
          ))}
        </div>

        <div className="flex items-center justify-center py-1 text-[10px] uppercase tracking-[0.4em] text-slate-600">
          ⚙ ⚙ ⚙
        </div>

        <div className="flex flex-wrap items-start justify-center gap-3 border-t border-sky-900/30 bg-sky-950/10 p-3">
          {playerUnits.map((u) => (
            <UnitCard key={u.id} unit={toCard(u)} fx={ds.fx.get(u.id)} />
          ))}
        </div>
      </div>

      {/* лог */}
      <div ref={logRef} className="thin-scroll h-40 overflow-y-auto border-t border-slate-800 bg-slate-950/90 px-4 py-2">
        <FightLog lines={logLines} />
      </div>

      {/* результат */}
      {done && (
        <div className="flex flex-col items-center gap-2 border-t border-amber-500/30 bg-slate-900/95 px-4 py-3">
          <div className={`text-xl font-black ${res.cls}`}>
            {res.title} <span className="text-sm font-normal text-slate-400">— раундов: {result.rounds}</span>
          </div>
          {result.winner === 'player' && (loot.length > 0 || income) && (
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
              {loot.map((g) => {
                const def = GEAR_BY_ID[g.defId];
                return (
                  <span key={g.uid} className={`rounded-lg border bg-slate-900 px-2 py-1 rarity-${g.rarity}`}>
                    {def?.icon} {def?.name} <span className={`text-rarity-${g.rarity}`}>({RARITY_LABEL[g.rarity]})</span>
                  </span>
                );
              })}
              {income && (
                <span className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-slate-300">
                  {Object.entries(income).filter(([, v]) => v > 0).map(([k, v]) => `+${v} ${k}`).join(', ')}
                </span>
              )}
            </div>
          )}
          <button
            onClick={onDone}
            className="rounded-lg bg-amber-500 px-6 py-2 font-bold text-slate-950 shadow transition hover:bg-amber-400"
          >
            Продолжить
          </button>
        </div>
      )}
    </div>
  );
}

export function BattleOverlay() {
  const battle = useBattle();
  const clear = useClearBattle();
  if (!battle) return null;
  return (
    <BattleArena
      result={battle.result}
      kind={battle.kind}
      loot={battle.loot}
      income={battle.income}
      onDone={() => {
        applyBattleOutcome();
        clear();
      }}
    />
  );
}
