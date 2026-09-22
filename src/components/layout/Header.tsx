import { useGameStore } from '@/store/useGameStore';
import { RESOURCE_META } from '@/utils/format';
import { RESOURCE_KEYS } from '@/engine/unit/unit.types';

export function Header() {
  const d = useGameStore((s) => s.data);
  const restart = useGameStore((s) => s.restart);

  return (
    <header className="flex flex-wrap items-center gap-3 border-b border-amber-500/20 bg-slate-950/80 px-4 py-2 backdrop-blur">
      <div className="flex items-center gap-2">
        <span className="text-2xl">⚙️</span>
        <div className="leading-tight">
          <div className="text-sm font-bold tracking-wide text-amber-200">МЕХАНИЗМ ЦИВИЛИЗАЦИИ</div>
          <div className="text-[10px] uppercase tracking-widest text-slate-500">Cog Empires</div>
        </div>
      </div>

      <div className="ml-2 flex items-center gap-1 rounded-lg border border-amber-500/30 bg-slate-900 px-3 py-1 text-xs">
        <span className="text-slate-400">Цикл</span>
        <span className="font-bold text-amber-300">{d.cycle}</span>
        <span className="text-slate-600">•</span>
        <span className="text-slate-400">День</span>
        <span className="font-bold text-slate-200">{d.day}</span>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-sm">
        {RESOURCE_KEYS.map((k) => (
          <div key={k} className="flex items-center gap-1 rounded-lg bg-slate-900/80 px-2 py-1" title={RESOURCE_META[k].label}>
            <span>{RESOURCE_META[k].icon}</span>
            <span className="font-mono font-semibold text-slate-100">{Math.floor(d.resources[k])}</span>
          </div>
        ))}
      </div>

      <button
        onClick={() => {
          if (confirm('Начать заново? Текущий прогресс будет потерян.')) restart();
        }}
        className="ml-auto rounded-lg border border-slate-700 px-3 py-1 text-xs text-slate-400 transition hover:border-red-500/50 hover:text-red-300"
      >
        ⟳ Новая игра
      </button>
    </header>
  );
}
