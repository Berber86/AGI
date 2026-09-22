import React from 'react';
import { useGameStore } from '../../store/useGameStore';
import { calculateBuildingUpgradeCost, computeCityTick } from '../../engine/economy/cityTick';
import { TECH_NODES } from '../../data/techs';
import { Hammer, Coins, BookOpen, Cpu, Telescope, Flame, ArrowUpCircle, PlayCircle, Clock } from 'lucide-react';

const BUILDING_ICONS: Record<string, React.ReactNode> = {
  Hammer: <Hammer className="w-5 h-5 text-amber-400" />,
  BookOpen: <BookOpen className="w-5 h-5 text-sky-400" />,
  Coins: <Coins className="w-5 h-5 text-yellow-400" />,
  Cpu: <Cpu className="w-5 h-5 text-emerald-400" />,
  Telescope: <Telescope className="w-5 h-5 text-purple-400" />,
  Flame: <Flame className="w-5 h-5 text-rose-400" />,
};

export const CityView: React.FC = () => {
  const { buildings, resources, upgradeBuilding, cityTick, unlockedTechIds } = useGameStore();

  const unlockedTechs = TECH_NODES.filter(t => unlockedTechIds.includes(t.id));
  const ratePerMinute = computeCityTick(buildings, unlockedTechs, 60);

  return (
    <div className="flex flex-col h-full p-4 gap-4 overflow-y-auto max-w-7xl mx-auto w-full">
      {/* City Header */}
      <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-amber-400 uppercase tracking-wide">
            Метрополия Механизмов (Городской Центр)
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Развивайте инфраструктуру паровой метрополии. Мануфактуры чеканят золото, отливают шестерни и ведут научные расчеты.
          </p>
        </div>

        <button
          onClick={() => cityTick(15)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg"
        >
          <PlayCircle className="w-4 h-4" />
          Форсировать Такт (+15 сек)
        </button>
      </div>

      {/* Production Rates Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Доход Золота</span>
            <span className="text-lg font-bold text-amber-300">+{ratePerMinute.goldProduced}/мин</span>
          </div>
          <Coins className="w-6 h-6 text-yellow-400/80" />
        </div>
        <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Выпуск Запчастей</span>
            <span className="text-lg font-bold text-orange-400">+{ratePerMinute.cogPartsProduced}/мин</span>
          </div>
          <Hammer className="w-6 h-6 text-orange-400/80" />
        </div>
        <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Прирост Науки</span>
            <span className="text-lg font-bold text-sky-400">+{ratePerMinute.scienceProduced}/мин</span>
          </div>
          <BookOpen className="w-6 h-6 text-sky-400/80" />
        </div>
        <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Очки Культуры</span>
            <span className="text-lg font-bold text-purple-400">+{ratePerMinute.cultureProduced}/мин</span>
          </div>
          <Clock className="w-6 h-6 text-purple-400/80" />
        </div>
      </div>

      {/* Buildings List */}
      <div className="space-y-3">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
          Городские Мануфактуры и Учреждения
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {buildings.map(b => {
            const cost = calculateBuildingUpgradeCost(b);
            const canAfford = resources.gold >= cost.gold && resources.cogParts >= cost.cogParts;
            const isLocked = b.techRequired && !unlockedTechIds.includes(b.techRequired);
            const reqTech = b.techRequired ? TECH_NODES.find(t => t.id === b.techRequired) : null;

            return (
              <div
                key={b.id}
                className={`p-4 rounded-xl border flex flex-col justify-between gap-3 ${
                  isLocked
                    ? 'bg-slate-950/40 border-slate-800 opacity-60'
                    : 'bg-slate-900/80 border-slate-800 shadow-md hover:border-slate-700'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                        {BUILDING_ICONS[b.icon] || <Hammer className="w-5 h-5 text-amber-400" />}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-slate-100">{b.name}</h3>
                        <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                          Уровень {b.level} / {b.maxLevel}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-snug">{b.description}</p>

                  {/* Production detail */}
                  <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-800/80 text-[11px] text-slate-300 flex flex-wrap gap-2">
                    {b.production.gold && <span>💰 Золото: +{b.production.gold * Math.max(1, b.level)}/мин</span>}
                    {b.production.cogParts && <span>⚙️ Запчасти: +{b.production.cogParts * Math.max(1, b.level)}/мин</span>}
                    {b.production.science && <span>📜 Наука: +{b.production.science * Math.max(1, b.level)}/мин</span>}
                    {b.production.culture && <span>🎭 Культура: +{b.production.culture * Math.max(1, b.level)}/мин</span>}
                  </div>
                </div>

                {/* Upgrade Button */}
                <div>
                  {isLocked ? (
                    <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-center text-[10px] text-rose-400">
                      🔒 Требуется технология: {reqTech?.name || b.techRequired}
                    </div>
                  ) : b.level >= b.maxLevel ? (
                    <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-center text-xs font-bold text-emerald-400">
                      Максимальный уровень
                    </div>
                  ) : (
                    <button
                      onClick={() => upgradeBuilding(b.id)}
                      disabled={!canAfford}
                      className={`w-full py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition ${
                        canAfford
                          ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                      }`}
                    >
                      <ArrowUpCircle className="w-3.5 h-3.5" />
                      Улучшить (💰{cost.gold} | ⚙️{cost.cogParts})
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
