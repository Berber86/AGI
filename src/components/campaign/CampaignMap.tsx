import { useMemo } from 'react';
import { CAMPAIGN_MAP, CAMPAIGN_NODE_BY_ID, NODE_KIND_META } from '@/data/campaign';
import { availableNodes, MAX_LAYER } from '@/engine/campaign/nodeLogic';
import { RECRUIT_BY_ID } from '@/data/recruits';
import { useGameStore } from '@/store/useGameStore';

const LAYERS = Array.from({ length: MAX_LAYER + 1 }, (_, i) => i);

export function CampaignMap() {
  const d = useGameStore((s) => s.data);
  const enterNode = useGameStore((s) => s.enterNode);
  const fightSkirmish = useGameStore((s) => s.fightSkirmish);
  const squads = useGameStore((s) => s.data.squads);

  const current = d.campaign.currentNodeId;
  const available = useMemo(() => new Set(availableNodes(current, d.campaign.completed).map((n) => n.id)), [current, d.campaign.completed]);
  const completed = useMemo(() => new Set(d.campaign.completed), [d.campaign.completed]);
  const armyReady = useMemo(
    () => squads.some((sq) => sq.recruitId && RECRUIT_BY_ID[sq.recruitId]),
    [squads],
  );

  return (
    <div className="space-y-4">
      <div className="panel-brass flex flex-wrap items-center gap-3 rounded-xl p-3">
        <div className="text-sm text-slate-300">
          Вы в узле: <span className="font-bold text-amber-200">{current ? CAMPAIGN_NODE_BY_ID[current]?.title : '—'}</span>
        </div>
        <div className="text-xs text-slate-500">
          Пройдено узлов: {completed.size}/{CAMPAIGN_MAP.length - 1}
        </div>
        <button
          onClick={fightSkirmish}
          className="ml-auto rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-500/20"
          title="Внеочередной бой для фарма добычи"
        >
          ⚔️ Стычка (фарм)
        </button>
      </div>

      {/* Карта: колонки слоёв */}
      <div className="thin-scroll overflow-x-auto pb-2">
        <div className="flex min-w-max gap-3">
          {LAYERS.map((layer) => {
            const nodes = CAMPAIGN_MAP.filter((n) => n.layer === layer);
            return (
              <div key={layer} className="flex w-40 flex-col items-center gap-2">
                <div className="text-[10px] uppercase tracking-widest text-slate-600">Слой {layer}</div>
                {nodes.map((n) => {
                  const meta = NODE_KIND_META[n.kind];
                  const isCurrent = n.id === current;
                  const isAvail = available.has(n.id) && !isCurrent;
                  const isDone = completed.has(n.id);
                  const clickable = isAvail && armyReady;
                  return (
                    <button
                      key={n.id}
                      disabled={!clickable}
                      onClick={() => enterNode(n.id)}
                      title={clickable ? meta.hint : !armyReady ? 'Сначала соберите отряд' : isDone ? 'Уже пройдено' : meta.hint}
                      className={`w-full rounded-xl border-2 p-2 text-left transition ${
                        isCurrent
                          ? 'border-amber-400 bg-amber-500/10 shadow-[0_0_14px_rgba(245,158,11,0.35)]'
                          : isAvail
                            ? 'node-available border-emerald-500/60 bg-slate-900 hover:bg-slate-800'
                            : isDone
                              ? 'border-slate-700 bg-slate-900/50 opacity-60'
                              : 'border-slate-800 bg-slate-950/60 opacity-40'
                      } ${clickable ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="text-lg">{meta.icon}</span>
                        <span className="text-xs font-bold text-slate-200">{n.title}</span>
                      </div>
                      <div className="mt-0.5 text-[10px] text-slate-500">{meta.label}</div>
                      {isCurrent && <div className="mt-1 text-[10px] font-bold text-amber-300">📍 Вы здесь</div>}
                      {isAvail && <div className="mt-1 text-[10px] font-bold text-emerald-400">Можно идти →</div>}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {!armyReady && (
        <div className="rounded-xl border border-red-500/40 bg-red-950/30 p-3 text-sm text-red-300">
          ⚠️ Ни один отряд не собран. Зайдите во вкладку «Армия» и наймите бойцов.
        </div>
      )}
    </div>
  );
}
