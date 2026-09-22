import { TECHS, TECH_BY_ID, TECH_ICON_META, DOGMAS, type TechIcon } from '@/data/techs';
import { canResearch, countIcons, dogmaProgress, isDogmaActive } from '@/engine/economy/techTree';
import { useGameStore } from '@/store/useGameStore';
import { describeTech } from './describe';

const ERAS = [1, 2, 3] as const;
const ERA_LABEL: Record<number, string> = { 1: 'Эра I — Заря', 2: 'Эра II — Порядок', 3: 'Эра III — Механизм' };

export function TechTreePanel() {
  const d = useGameStore((s) => s.data);
  const research = useGameStore((s) => s.research);
  const icons = countIcons(d.techs);

  return (
    <div className="space-y-4">
      {/* Счётчик иконок — сердце системы догм (как символы в Innovation) */}
      <div className="panel-brass flex flex-wrap items-center gap-3 rounded-xl p-3">
        <span className="text-sm font-bold text-amber-200">🔢 Иконки цивилизации:</span>
        {(Object.entries(TECH_ICON_META) as [TechIcon, { label: string; emoji: string; color: string }][]).map(([icon, meta]) => (
          <div key={icon} className="flex items-center gap-1 rounded-lg bg-slate-900/80 px-2 py-1">
            <span>{meta.emoji}</span>
            <span className={`text-lg font-black ${meta.color}`}>{icons[icon]}</span>
          </div>
        ))}
        <span className="text-xs text-slate-500">Наборы иконок активируют догмы ↓</span>
      </div>

      {/* Догмы */}
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {DOGMAS.map((dogma) => {
          const active = isDogmaActive(dogma, icons);
          const progress = dogmaProgress(dogma, icons);
          return (
            <div
              key={dogma.id}
              className={`rounded-xl border-2 p-2.5 transition ${
                active ? 'border-amber-400/70 bg-amber-500/10 shadow-[0_0_12px_rgba(245,158,11,0.25)]' : 'border-slate-800 bg-slate-950/60'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{dogma.icon}</span>
                <span className={`text-sm font-bold ${active ? 'text-amber-200' : 'text-slate-300'}`}>{dogma.name}</span>
                {active && <span className="ml-auto text-[10px] font-bold uppercase text-amber-400">активна</span>}
              </div>
              <div className="mt-1 text-[11px] text-slate-300">{dogma.description}</div>
              <div className="mt-1 flex items-center gap-1 text-[10px] text-slate-400">
                {(Object.entries(dogma.requires) as [TechIcon, number][]).map(([ic, n]) => (
                  <span key={ic} className={icons[ic] >= n ? 'text-emerald-300' : ''}>
                    {TECH_ICON_META[ic].emoji}×{n}
                  </span>
                ))}
                {!active && <span className="ml-auto">{Math.round(progress * 100)}%</span>}
              </div>
              {!active && (
                <div className="mt-1 h-1 overflow-hidden rounded bg-slate-800">
                  <div className="h-full bg-amber-500/70 transition-all" style={{ width: `${progress * 100}%` }} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Дерево технологий по эрам */}
      {ERAS.map((era) => (
        <div key={era}>
          <div className="mb-2 text-sm font-bold uppercase tracking-widest text-slate-400">{ERA_LABEL[era]}</div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {TECHS.filter((t) => t.era === era).map((t) => {
              const researched = d.techs.includes(t.id);
              const check = canResearch(t, d.techs, d.resources.science);
              return (
                <button
                  key={t.id}
                  disabled={researched || !check.ok}
                  onClick={() => research(t.id)}
                  title={researched ? 'Изучено' : (check.reason ?? '')}
                  className={`rounded-xl border-2 p-2.5 text-left transition ${
                    researched
                      ? 'border-emerald-500/60 bg-emerald-500/10'
                      : check.ok
                        ? 'border-sky-500/50 bg-slate-900 hover:bg-slate-800'
                        : 'border-slate-800 bg-slate-950/60 opacity-60'
                  } ${check.ok && !researched ? 'cursor-pointer' : 'cursor-default'}`}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-xl">{t.icon}</span>
                    <span className="text-sm font-bold text-slate-100">{t.name}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-1">
                    {t.icons.map((ic, i) => (
                      <span key={i} title={TECH_ICON_META[ic].label} className={TECH_ICON_META[ic].color}>{TECH_ICON_META[ic].emoji}</span>
                    ))}
                    <span className={`ml-auto font-mono text-[11px] ${researched ? 'text-emerald-400' : d.resources.science >= t.cost ? 'text-slate-300' : 'text-red-400'}`}>
                      📜{t.cost}
                    </span>
                  </div>
                  <div className="mt-1 text-[11px] leading-snug text-slate-300">{describeTech(t)}</div>
                  {t.requires.length > 0 && !researched && (
                    <div className="mt-1 text-[10px] text-slate-500">
                      ← {t.requires.map((r) => TECH_BY_ID[r]?.name ?? r).join(', ')}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
