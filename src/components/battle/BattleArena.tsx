import { useEffect, useMemo, useRef, useState } from 'react';
import type { BattleResult, BattleUnitState } from '@/engine/combat/combat.types';
import type { GearInstance } from '@/engine/unit/unit.types';
import { buildLog } from '@/engine/combat/log';
import { computeFrameState, type UnitFx } from '@/engine/combat/playback';
import { GEAR_BY_ID, RARITY_LABEL } from '@/data/gear';
import { NODE_KIND_META } from '@/data/campaign';
import { applyBattleOutcome, useGameStore } from '@/store/useGameStore';
import { cueForEvent, playCue } from '@/utils/sound';
import { UnitCard, type UnitCardData } from './UnitCard';
import { FightLog } from './FightLog';

type Speed = 1 | 2 | 0; // 0 = мгновенно
const SPEED_MS: Record<Exclude<Speed, 0>, number> = { 1: 700, 2: 300 };

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

/** Зона одной стороны: 5 линий глубины, фронт у разделителя. */
function SideField({ side, units, fxMap }: { side: 'player' | 'enemy'; units: BattleUnitState[]; fxMap: Map<string, UnitFx> }) {
  const order = side === 'enemy' ? [4, 3, 2, 1, 0] : [0, 1, 2, 3, 4];
  return (
    <div className="flex w-full flex-col gap-1">
      {order.map((line) => {
        const inLine = units.filter((u) => u.line === line).sort((a, b) => a.column - b.column);
        const front = line === 0;
        return (
          <div
            key={line}
            className={`flex min-h-[16px] flex-wrap items-start justify-center gap-2 rounded-lg border border-dashed px-2 py-1 ${
              front ? 'border-slate-600/70 bg-slate-900/50' : line === 4 ? 'border-slate-800/50' : 'border-slate-800/70 bg-slate-950/20'
            }`}
          >
            {inLine.length === 0 ? (
              <span className="py-0.5 text-[9px] uppercase tracking-widest text-slate-700">
                {side === 'player' ? 'наша' : 'вражья'} линия {line + 1}
              </span>
            ) : (
              inLine.map((u) => <UnitCard key={u.id} unit={toCard(u)} fx={fxMap.get(u.id)} />)
            )}
          </div>
        );
      })}
    </div>
  );
}

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
  const [soundOn, setSoundOn] = useState(true);
  const [frame, setFrame] = useState(0);
  const [done, setDone] = useState(false);
  const total = result.events.length;
  const logRef = useRef<HTMLDivElement>(null);
  const prevFrameRef = useRef(0);

  const ds = useMemo(() => computeFrameState(result, frame), [result, frame]);

  // Новый бой — сброс курсора звуков.
  useEffect(() => {
    prevFrameRef.current = 0;
  }, [result]);

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

  // Звуки: озвучиваем события, попавшие в кадр с прошлого тика.
  useEffect(() => {
    const from = prevFrameRef.current;
    prevFrameRef.current = frame;
    if (!soundOn || speed === 0 || frame <= from) return;
    for (let i = from + 1; i <= Math.min(frame, total - 1); i++) {
      const cue = cueForEvent(result.events[i]!);
      if (cue) playCue(cue);
    }
  }, [frame, soundOn, speed, total, result]);

  useEffect(() => {
    if (ds.finished && !done) setDone(true);
  }, [ds.finished, done]);

  // Финальный аккорд.
  useEffect(() => {
    if (done && soundOn) {
      playCue(result.winner === 'player' ? 'victory' : result.winner === 'enemy' ? 'defeat' : 'round');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [frame]);

  const enemyUnits = [...ds.units.values()].filter((u) => u.side === 'enemy');
  const playerUnits = [...ds.units.values()].filter((u) => u.side === 'player');
  const logLines = useMemo(() => buildLog(result.events.slice(0, frame + 1), result.initial), [result, frame]);
  const meta = NODE_KIND_META[kind as keyof typeof NODE_KIND_META];
  const res = RESULT_TEXT[result.winner] ?? RESULT_TEXT.draw;
  const progress = Math.min(100, (ds.round / Math.max(1, result.rounds)) * 100);

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-slate-950/97 backdrop-blur-sm">
      {/* верхняя панель */}
      <div className="flex items-center gap-3 border-b border-amber-500/20 px-4 py-2">
        <span className="text-lg font-bold text-amber-200">{meta?.icon} {kind === 'skirmish' ? 'Стычка' : (meta?.label ?? 'Бой')}</span>
        <span className="text-xs text-slate-400">{ds.phase === 'surprise' ? '⚡ Внезапная атака' : '⚔️ Бой'} • Раунд {ds.round}/{result.rounds || '…'}</span>
        <div className="ml-auto flex items-center gap-1">
          <button
            onClick={() => setSoundOn((v) => !v)}
            title={soundOn ? 'Выключить звук' : 'Включить звук'}
            className={`rounded px-2 py-1 text-xs transition ${soundOn ? 'bg-slate-900 text-slate-200' : 'bg-slate-900 text-slate-600'}`}
          >
            {soundOn ? '🔊' : '🔇'}
          </button>
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

      {/* прогресс раундов */}
      <div className="h-0.5 w-full bg-slate-800">
        <div className="h-full bg-amber-500/60 transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>

      {/* поле боя */}
      <div className="relative flex flex-1 flex-col overflow-hidden">
        {ds.banner && speed !== 0 && (
          <div
            key={ds.banner.key}
            className="banner-float pointer-events-none absolute left-1/2 top-6 z-30 -translate-x-1/2 rounded-xl border border-amber-500/40 bg-slate-950/90 px-8 py-2 text-lg font-black uppercase tracking-[0.3em] text-amber-200 shadow-[0_0_30px_rgba(245,158,11,0.25)]"
          >
            {ds.banner.text}
          </div>
        )}

        <div className="flex-1 overflow-y-auto thin-scroll border-b border-red-900/30 bg-red-950/10 p-2">
          <SideField side="enemy" units={enemyUnits} fxMap={ds.fx} />
        </div>

        <div className="flex items-center justify-center gap-4 py-1 text-[10px] uppercase tracking-[0.4em] text-slate-600">
          <span>линия фронта</span>
          <span>⚙ ⚙ ⚙</span>
          <span>касание · дальность 1</span>
        </div>

        <div className="flex-1 overflow-y-auto thin-scroll border-t border-sky-900/30 bg-sky-950/10 p-2">
          <SideField side="player" units={playerUnits} fxMap={ds.fx} />
        </div>
      </div>

      {/* лог */}
      <div ref={logRef} className="thin-scroll h-36 overflow-y-auto border-t border-slate-800 bg-slate-950/90 px-4 py-2">
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
