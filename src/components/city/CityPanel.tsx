import { BUILDINGS } from '@/data/buildings';
import { buildingCost, canAfford, cityTick } from '@/engine/economy/cityTick';
import { useGameStore } from '@/store/useGameStore';
import { formatCost, RESOURCE_META } from '@/utils/format';
import { RESOURCE_KEYS, type ResourceKey } from '@/engine/unit/unit.types';
import { TECH_BY_ID } from '@/data/techs';

export function CityPanel() {
  const d = useGameStore((s) => s.data);
  const mods = useGameStore((s) => s.modifiers());
  const build = useGameStore((s) => s.build);
  const breakdown = cityTick(d.buildings, mods);

  return (
    <div className="space-y-4">
      {/* Сводка дохода */}
      <div className="panel-brass rounded-xl p-3">
        <div className="mb-2 text-sm font-bold text-amber-200">📊 Доход за ход</div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {RESOURCE_KEYS.map((k) => (
            <div key={k} className="rounded-lg bg-slate-900/70 p-2 text-center">
              <div className="text-xs text-slate-400">{RESOURCE_META[k].icon} {RESOURCE_META[k].label}</div>
              <div className="text-xl font-black text-slate-100">+{breakdown.total[k]}</div>
              <div className="text-[10px] text-slate-500">
                база {breakdown.base[k]} + постройки {breakdown.buildings[k]}
                {breakdown.modifiersFlat[k] ? ` + бонусы ${breakdown.modifiersFlat[k]}` : ''}
                {breakdown.pct[k] ? ` ×${(1 + breakdown.pct[k] / 100).toFixed(2)}` : ''}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Постройки */}
      <div className="grid gap-3 md:grid-cols-2">
        {BUILDINGS.map((b) => {
          const level = d.buildings[b.id] ?? 0;
          const locked = b.unlockTech !== undefined && !d.techs.includes(b.unlockTech);
          const maxed = level >= b.maxLevel;
          const cost = buildingCost(b, level + 1);
          const affordable = canAfford(d.resources, cost);
          return (
            <div key={b.id} className={`panel-brass rounded-xl p-3 ${locked ? 'opacity-50' : ''}`}>
              <div className="flex items-start gap-2">
                <span className="text-2xl">{b.icon}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-100">{b.name}</span>
                    <span className="rounded bg-slate-800 px-1.5 text-xs text-amber-300">{level}/{b.maxLevel}</span>
                  </div>
                  <div className="text-xs text-slate-400">{b.description}</div>
                  {b.production && (
                    <div className="mt-1 text-[11px] text-emerald-300">
                      Даёт: {Object.entries(b.production).map(([k, v]) => `+${v * (level || 1)} ${RESOURCE_META[k as ResourceKey].label.toLowerCase()}`).join(', ')} за ход (за уровень)
                    </div>
                  )}
                  {locked && (
                    <div className="mt-1 text-[11px] text-red-300">
                      🔒 Нужна технология: {TECH_BY_ID[b.unlockTech!]?.name}
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-slate-300">
                  {maxed ? 'Максимальный уровень' : `Улучшение: ${formatCost(cost)}`}
                </span>
                <button
                  disabled={locked || maxed || !affordable}
                  onClick={() => build(b.id)}
                  className="rounded-lg bg-amber-500/90 px-3 py-1 text-xs font-bold text-slate-950 transition enabled:hover:bg-amber-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-500"
                >
                  {maxed ? '✓' : level === 0 ? 'Построить' : '+1 уровень'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
