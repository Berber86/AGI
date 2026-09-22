import { useMemo } from 'react';
import { collectModifiers } from '@/engine/economy/techTree';
import { RECRUIT_BY_ID } from '@/data/recruits';
import { NODE_KIND_META } from '@/data/campaign';
import { computeUnit, TARGETING_LABEL } from '@/engine/unit/computeUnit';
import { toBattleState } from '@/engine/combat/simulateFight';
import { selectTarget } from '@/engine/combat/targeting';
import { createRng } from '@/utils/rng';
import { STAT_ICON } from '@/utils/format';
import { useGameStore } from '@/store/useGameStore';
import type { ComputedUnit } from '@/engine/unit/unit.types';

const LINES = ['Фронт', '2-я', '3-я', '4-я', 'Тыл'];

function MiniUnit({ u, target }: { u: ComputedUnit; target?: ComputedUnit | null }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-950/70 px-2 py-1.5">
      <span className="text-xl">{u.icon}</span>
      <div className="min-w-0">
        <div className="truncate text-xs font-bold text-slate-100">{u.name}</div>
        <div className="text-[10px] text-slate-400">
          {STAT_ICON.hp}{u.stats.hp} {STAT_ICON.atk}{u.stats.atk} {STAT_ICON.def}{u.stats.def} {STAT_ICON.spd}{u.stats.spd} {STAT_ICON.range}{u.stats.range}
        </div>
        {target && (
          <div className="text-[10px] text-amber-300/90" title={TARGETING_LABEL[u.targeting]}>
            → {target.icon} {target.name}
          </div>
        )}
      </div>
    </div>
  );
}

/** Модалка расстановки перед боем: линии, колонки и превью таргетинга. */
export function PrepModal() {
  const prep = useGameStore((s) => s.prep);
  const confirm = useGameStore((s) => s.confirmPrep);
  const cancel = useGameStore((s) => s.cancelPrep);
  const place = useGameStore((s) => s.placeSquad);
  const squads = useGameStore((s) => s.data.squads);
  const d = useGameStore((s) => s.data);

  const preview = useMemo(() => {
    if (!prep) return null;
    const mods = collectModifiers(d.techs, d.buildings);
    const players = d.squads
      .map((sq) => {
        if (!sq.recruitId || !RECRUIT_BY_ID[sq.recruitId]) return null;
        const gear = Object.fromEntries(
          (['weapon', 'armor', 'trinket', 'core'] as const).map((slot) => [slot, d.collection.find((g) => g.uid === sq.gear[slot]) ?? null]),
        );
        return computeUnit({ id: sq.id, name: sq.name, recruitId: sq.recruitId, gear, line: sq.line, column: sq.column }, { modifiers: mods });
      })
      .filter((u): u is ComputedUnit => u !== null);
    const enemies = prep.encounter.enemies.map((sq) => computeUnit(sq));
    const rng = createRng(42);
    const pStates = players.map((u) => toBattleState(u, 'player'));
    const eStates = enemies.map((u) => toBattleState(u, 'enemy'));
    const playerTargets = new Map<string, string | null>();
    const enemyTargets = new Map<string, string | null>();
    players.forEach((u, i) => {
      const t = selectTarget(pStates[i]!, pStates, eStates, rng);
      playerTargets.set(u.id, t?.id ?? null);
    });
    enemies.forEach((u, i) => {
      const t = selectTarget(eStates[i]!, eStates, pStates, rng);
      enemyTargets.set(u.id, t?.id ?? null);
    });
    const byId = new Map<string, ComputedUnit>();
    for (const u of players) byId.set(u.id, u);
    for (const u of enemies) byId.set(u.id, u);
    return { players, enemies, playerTargets, enemyTargets, byId };
  }, [prep, d]);

  if (!prep || !preview) return null;
  const meta = NODE_KIND_META[prep.kind as keyof typeof NODE_KIND_META];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="thin-scroll max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-amber-500/40 bg-slate-900 p-4 shadow-2xl">
        <div className="flex items-center gap-2">
          <span className="text-xl font-black text-amber-200">{meta?.icon} Расстановка: {prep.kind === 'skirmish' ? 'Стычка' : (meta?.label ?? 'Бой')}</span>
          <span className="text-xs text-slate-400">Двигайте отряды — превью покажет, кто кого атакует первым</span>
        </div>

        <div className="mt-3 grid gap-4 md:grid-cols-2">
          {/* Наши отряды */}
          <div>
            <div className="mb-1 text-xs font-bold uppercase tracking-widest text-sky-300">Наши отряды</div>
            <div className="space-y-2">
              {squads.map((sq) => {
                const c = preview.players.find((u) => u.id === sq.id);
                if (!c) {
                  return (
                    <div key={sq.id} className="rounded-lg border border-dashed border-slate-700 px-2 py-2 text-[11px] text-slate-500">
                      {sq.name}: пусто (наймите во вкладке «Армия»)
                    </div>
                  );
                }
                const target = preview.playerTargets.get(sq.id) ? preview.byId.get(preview.playerTargets.get(sq.id)!) ?? null : null;
                return (
                  <div key={sq.id} className="rounded-xl border border-sky-900/60 bg-slate-950/50 p-2">
                    <MiniUnit u={c} target={target} />
                    <div className="mt-1.5 flex items-center gap-1 text-[11px]">
                      <span className="text-slate-500">Линия:</span>
                      <button onClick={() => place(sq.id, Math.max(0, sq.line - 1), sq.column)} className="rounded bg-slate-800 px-2 hover:bg-slate-700">▲</button>
                      <span className="w-12 text-center font-bold text-slate-200">{LINES[sq.line]}</span>
                      <button onClick={() => place(sq.id, Math.min(4, sq.line + 1), sq.column)} className="rounded bg-slate-800 px-2 hover:bg-slate-700">▼</button>
                      <span className="ml-2 text-slate-500">Колонка:</span>
                      <button onClick={() => place(sq.id, sq.line, Math.max(0, sq.column - 1))} className="rounded bg-slate-800 px-2 hover:bg-slate-700">◀</button>
                      <span className="w-6 text-center font-bold text-slate-200">{sq.column + 1}</span>
                      <button onClick={() => place(sq.id, sq.line, Math.min(9, sq.column + 1))} className="rounded bg-slate-800 px-2 hover:bg-slate-700">▶</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Враги */}
          <div>
            <div className="mb-1 text-xs font-bold uppercase tracking-widest text-red-300">Враги (сила ×{prep.encounter.statScale})</div>
            <div className="space-y-2">
              {preview.enemies.map((e) => {
                const tid = preview.enemyTargets.get(e.id);
                const target = tid ? preview.byId.get(tid) ?? null : null;
                return <MiniUnit key={e.id} u={e} target={target} />;
              })}
            </div>
            <div className="mt-2 rounded-lg bg-slate-950/60 p-2 text-[10px] leading-relaxed text-slate-400">
              Подсказка: стрелки в тылу (линия 3–5) бьют издалека, но в ближнем бою они беззащитны.
              Танк на фронте прикрывает их — враг по правилу «ближайшего» достанет стрелков не сразу.
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-end gap-2">
          <button onClick={cancel} className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-400 transition hover:text-slate-200">
            Отступить
          </button>
          <button onClick={confirm} className="rounded-lg bg-amber-500 px-8 py-2 font-bold text-slate-950 shadow transition hover:bg-amber-400">
            ⚔️ В бой!
          </button>
        </div>
      </div>
    </div>
  );
}
