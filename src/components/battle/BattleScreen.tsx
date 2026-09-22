import { useEffect, useMemo, useRef, useState } from 'react';
import type { BattleUnitState } from '@/engine/combat/combat.types';
import { buildLog } from '@/engine/combat/log';
import { computeFrameState, type UnitFx } from '@/engine/combat/playback';
import { GEAR_BY_ID, RARITY_LABEL } from '@/data/gear';
import { MOMENTUM_META, MOMENTUM_ORDER } from '@/data/momentum';
import { NODE_KIND_META } from '@/data/campaign';
import { applyBattleOutcome, useGameStore } from '@/store/useGameStore';
import { cueForEvent, playCue } from '@/utils/sound';
import { UnitCard, type UnitCardData } from './UnitCard';
import { FightLog } from './FightLog';

const EMPTY_EVENTS: readonly never[] = [];

type Speed = 1 | 2 | 0; // 0 = мгновенно
const SPEED_MS: Record<Exclude<Speed, 0>, number> = { 1: 700, 2: 300 };
const EVENT_STOPS = new Set(['attack', 'death', 'roundStart', 'phase', 'rout', 'momentum']);

function toCard(u: BattleUnitState): UnitCardData {
  return {
    id: u.id, name: u.name, icon: u.icon, side: u.side, hp: u.hp, maxHp: u.maxHp, shield: u.shield,
    morale: u.morale, poison: u.poison, stunRounds: u.stunRounds, slowRounds: u.slowRounds, wardCharges: u.wardCharges,
    line: u.line, alive: u.alive, routed: u.routed,
    rarity: u.rarity, stats: u.stats, abilities: u.abilities, tags: u.tags, targeting: u.targeting,
    setCounts: u.setCounts,
  };
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
                линия {line + 1}
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

export function BattleScreen() {
  const session = useGameStore((s) => s.session);
  const simVersion = useGameStore((s) => s.simVersion);
  const stepSim = useGameStore((s) => s.stepSim);
  const useMomentum = useGameStore((s) => s.useMomentum);
  const skipMomentum = useGameStore((s) => s.skipMomentum);
  const finishBattle = useGameStore((s) => s.finishBattle);
  const clearSession = useGameStore((s) => s.clearSession);
  const record = useGameStore((s) => s.data.battle);

  const [speed, setSpeed] = useState<Speed>(1);
  const [soundOn, setSoundOn] = useState(true);
  const [autoPause, setAutoPause] = useState(true);
  const [frame, setFrame] = useState(0);
  const [paused, setPaused] = useState(false);
  const [done, setDone] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);
  const prevFrameRef = useRef(0);

  const events = session?.sim.events ?? EMPTY_EVENTS;
  const initial = session?.sim.initialUnits ?? [];
  const ds = useMemo(
    () => (session ? computeFrameState(events, initial, frame) : null),
    [session, events, initial, frame, simVersion],
  );

  // Новая сессия — сброс воспроизведения.
  useEffect(() => {
    setFrame(0);
    setPaused(false);
    setDone(false);
    prevFrameRef.current = 0;
  }, [session]);

  // Тик: догоняем кадр; когда кадр догнал события — делаем шаг симуляции.
  useEffect(() => {
    if (!session || done || paused) return;
    if (speed === 0) {
      while (!session.sim.finished) stepSim();
      setFrame(session.sim.events.length - 1);
      return;
    }
    const ms = Math.max(80, SPEED_MS[speed]);
    const t = setTimeout(() => {
      const total = session.sim.events.length;
      if (frame < total - 1) {
        let next = frame + 1;
        let budget = 2;
        while (next < total - 1 && budget > 0) {
          if (EVENT_STOPS.has(session.sim.events[next]!.type)) break;
          next++;
          budget--;
        }
        setFrame(next);
      } else if (!session.sim.finished) {
        stepSim();
      }
    }, ms);
    return () => clearTimeout(t);
  }, [session, simVersion, frame, done, paused, speed, stepSim]);

  // Финал: когда симуляция завершена и кадр дошёл до конца.
  useEffect(() => {
    if (!session || done) return;
    if (session.sim.finished && frame >= session.sim.events.length - 1) {
      finishBattle();
      setDone(true);
      if (soundOn) playCue(session.sim.winner === 'player' ? 'victory' : session.sim.winner === 'enemy' ? 'defeat' : 'round');
    }
  }, [session, simVersion, frame, done, soundOn, finishBattle]);

  // Momentum: пауза на чекпоинте.
  useEffect(() => {
    if (!session || done || paused || !autoPause) return;
    if (frame >= session.sim.events.length - 1 && session.sim.canMomentum()) setPaused(true);
  }, [session, simVersion, frame, done, paused, autoPause]);

  // Звуки событий, попавших в кадр.
  useEffect(() => {
    const from = prevFrameRef.current;
    prevFrameRef.current = frame;
    if (!session || !soundOn || speed === 0 || frame <= from) return;
    for (let i = from + 1; i <= Math.min(frame, events.length - 1); i++) {
      const cue = cueForEvent(events[i]!);
      if (cue) playCue(cue);
    }
  }, [frame, session, soundOn, speed, events]);

  useEffect(() => {
    logRef.current?.scrollTo?.({ top: logRef.current.scrollHeight });
  }, [frame]);

  if (!session || !ds) return null;

  const sim = session.sim;
  const enemyUnits = [...ds.units.values()].filter((u) => u.side === 'enemy');
  const playerUnits = [...ds.units.values()].filter((u) => u.side === 'player');
  const meta = NODE_KIND_META[session.kind as keyof typeof NODE_KIND_META];
  const res = RESULT_TEXT[sim.winner ?? 'draw'] ?? RESULT_TEXT.draw;
  const progress = Math.min(100, (ds.round / 30) * 100);
  const momentumCost = 4;

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-slate-950/97 backdrop-blur-sm">
      {/* верхняя панель */}
      <div className="flex items-center gap-3 border-b border-amber-500/20 px-4 py-2">
        <span className="text-lg font-bold text-amber-200">{meta?.icon} {session.kind === 'skirmish' ? 'Стычка' : (meta?.label ?? 'Бой')}</span>
        <span className="text-xs text-slate-400">{ds.phase === 'surprise' ? '⚡ Внезапная атака' : '⚔️ Бой'} • Раунд {ds.round}</span>
        <span
          className={`rounded px-2 py-0.5 text-xs font-bold transition ${sim.canMomentum() ? 'bg-amber-500/25 text-amber-300 ring-1 ring-amber-400/60' : 'bg-slate-900 text-slate-500'}`}
          title="Дух растёт от урона по врагам, убийств и времени. 4 единицы = тактика Momentum."
        >
          ⚡ Дух: {sim.spirit}
        </span>
        <div className="ml-auto flex items-center gap-1">
          <button
            onClick={() => setAutoPause((v) => !v)}
            title={autoPause ? 'Пауза для тактик: вкл' : 'Пауза для тактик: выкл (автобой)'}
            className={`rounded px-2 py-1 text-xs transition ${autoPause ? 'bg-slate-900 text-amber-300' : 'bg-slate-900 text-slate-600'}`}
          >
            ⏸
          </button>
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
                if (s === 0 && !paused) {
                  while (!sim.finished) stepSim();
                  setFrame(sim.events.length - 1);
                }
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

        {/* Momentum-пауза */}
        {paused && !done && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-slate-950/80 p-4">
            <div className="w-full max-w-2xl rounded-2xl border border-amber-500/40 bg-slate-900 p-4 shadow-2xl">
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-amber-200">⚡ Momentum</span>
                <span className="text-xs text-slate-400">Дух: {sim.spirit} (тактика стоит {momentumCost})</span>
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {MOMENTUM_ORDER.map((t) => {
                  const m = MOMENTUM_META[t];
                  const affordable = sim.spirit >= momentumCost;
                  return (
                    <button
                      key={t}
                      disabled={!affordable}
                      onClick={() => {
                        useMomentum(t);
                        setPaused(false);
                      }}
                      className="rounded-xl border border-slate-700 bg-slate-950/70 p-3 text-left transition enabled:hover:border-amber-500/60 enabled:hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <div className="text-sm font-bold text-amber-100">{m.icon} {m.label}</div>
                      <div className="mt-0.5 text-[11px] text-slate-400">{m.description}</div>
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => {
                  skipMomentum();
                  setPaused(false);
                }}
                className="mt-3 w-full rounded-lg border border-slate-700 py-1.5 text-xs text-slate-400 transition hover:text-slate-200"
              >
                Приберечь дух ({sim.spirit}) →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* лог */}
      <div ref={logRef} className="thin-scroll h-36 overflow-y-auto border-t border-slate-800 bg-slate-950/90 px-4 py-2">
        <FightLog lines={buildLog(events.slice(0, frame + 1), initial)} />
      </div>

      {/* результат */}
      {done && record && (
        <div className="flex flex-col items-center gap-2 border-t border-amber-500/30 bg-slate-900/95 px-4 py-3">
          <div className={`text-xl font-black ${res.cls}`}>
            {res.title} <span className="text-sm font-normal text-slate-400">— раундов: {record.result.rounds}</span>
          </div>
          {record.result.winner === 'player' && (record.loot.length > 0 || record.income) && (
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
              {record.loot.map((g) => {
                const def = GEAR_BY_ID[g.defId];
                return (
                  <span key={g.uid} className={`rounded-lg border bg-slate-900 px-2 py-1 rarity-${g.rarity}`}>
                    {def?.icon} {def?.name} <span className={`text-rarity-${g.rarity}`}>({RARITY_LABEL[g.rarity]})</span>
                  </span>
                );
              })}
              {record.income && (
                <span className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-slate-300">
                  {Object.entries(record.income).filter(([, v]) => v > 0).map(([k, v]) => `+${v} ${k}`).join(', ')}
                </span>
              )}
            </div>
          )}
          <button
            onClick={() => {
              applyBattleOutcome();
              clearSession();
            }}
            className="rounded-lg bg-amber-500 px-6 py-2 font-bold text-slate-950 shadow transition hover:bg-amber-400"
          >
            Продолжить
          </button>
        </div>
      )}
    </div>
  );
}


