import React, { useState } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { DOGMAS, TECH_NODES, TechIcon } from '../../data/techs';
import { calculateAccumulatedIcons, getActiveDogmas, isTechUnlockable } from '../../engine/economy/techTree';
import { Hammer, BookOpen, Shield, Pickaxe, Wheat, Sparkles, Check, Lock, GitFork, LayoutGrid } from 'lucide-react';

const ICON_SYMBOLS: Record<TechIcon, { label: string; icon: React.ReactNode; color: string }> = {
  craft: { label: 'Ремесло', icon: <Hammer className="w-3.5 h-3.5" />, color: 'text-amber-400' },
  lore: { label: 'Наука/Лор', icon: <BookOpen className="w-3.5 h-3.5" />, color: 'text-sky-400' },
  culture: { label: 'Культура', icon: <Sparkles className="w-3.5 h-3.5" />, color: 'text-purple-400' },
  war: { label: 'Война', icon: <Shield className="w-3.5 h-3.5" />, color: 'text-rose-400' },
  mining: { label: 'Добыча', icon: <Pickaxe className="w-3.5 h-3.5" />, color: 'text-stone-400' },
  agri: { label: 'Аграрное', icon: <Wheat className="w-3.5 h-3.5" />, color: 'text-emerald-400' },
};

export const TechTreeView: React.FC = () => {
  const { unlockedTechIds, resources, unlockTech } = useGameStore();
  const [viewMode, setViewMode] = useState<'cards' | 'graph'>('graph');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [selectedEra, setSelectedEra] = useState<number>(0);

  const accumulatedIcons = calculateAccumulatedIcons(unlockedTechIds);
  const activeDogmas = getActiveDogmas(accumulatedIcons);
  const activeDogmaIds = new Set(activeDogmas.map(d => d.id));

  const filteredTechs = TECH_NODES.filter(t => {
    if (selectedBranch !== 'all' && t.branch !== selectedBranch) return false;
    if (selectedEra !== 0 && t.era !== selectedEra) return false;
    return true;
  });

  // Calculate coordinates for SVG Graph View
  // Eras: 1, 2, 3, 4 (Columns X: 40, 320, 600, 880)
  const eraColumns = [1, 2, 3, 4];
  const nodePositions: Record<string, { x: number; y: number }> = {};
  eraColumns.forEach((era, colIndex) => {
    const eraTechs = TECH_NODES.filter(t => t.era === era);
    const spacingY = 110;
    const startY = 60;
    eraTechs.forEach((t, rowIndex) => {
      nodePositions[t.id] = {
        x: 40 + colIndex * 270,
        y: startY + rowIndex * spacingY,
      };
    });
  });

  return (
    <div className="flex flex-col h-full p-4 gap-4 overflow-y-auto max-w-7xl mx-auto w-full">
      {/* Top Banner */}
      <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-amber-400 uppercase tracking-wide">
            Дерево Технологий и Догмы Цивилизации
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Изучайте изобретения (Innovation CCG механика), накапливайте символы и открывайте глобальные Догмы цивилизации.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Mode Switcher */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setViewMode('graph')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition ${
                viewMode === 'graph' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              <GitFork className="w-3.5 h-3.5" /> Граф Связей
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition ${
                viewMode === 'cards' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" /> Карточки
            </button>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 font-medium">Очки Науки:</span>
            <span className="text-sm font-black text-sky-400 font-mono">📜 {Math.round(resources.science)}</span>
          </div>
        </div>
      </div>

      {/* Accumulated Icons Bar (Innovation Symbols) */}
      <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800 shadow-md">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
          Символы Вашей Цивилизации (Innovation Icons Pool)
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {(Object.keys(ICON_SYMBOLS) as TechIcon[]).map(iconKey => {
            const info = ICON_SYMBOLS[iconKey];
            const count = accumulatedIcons[iconKey] || 0;
            return (
              <div
                key={iconKey}
                className="bg-slate-950 p-2 rounded-lg border border-slate-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-1.5 text-xs text-slate-300">
                  <span className={info.color}>{info.icon}</span>
                  <span>{info.label}</span>
                </div>
                <span className={`text-sm font-black ${count > 0 ? info.color : 'text-slate-600'}`}>
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dogmas Panel */}
      <div className="bg-gradient-to-r from-amber-950/30 via-slate-900 to-slate-900 p-4 rounded-xl border border-amber-500/30 shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Догмы Цивилизации (Постоянные Синергии от Набора Символов)
            </span>
          </div>
          <span className="text-xs text-slate-400">
            Активно: <strong className="text-amber-400">{activeDogmas.length}</strong> / {DOGMAS.length}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {DOGMAS.map(dogma => {
            const isActive = activeDogmaIds.has(dogma.id);
            return (
              <div
                key={dogma.id}
                className={`p-3 rounded-xl border flex flex-col justify-between transition ${
                  isActive
                    ? 'bg-amber-950/40 border-amber-500/60 shadow-lg shadow-amber-950/30'
                    : 'bg-slate-950/40 border-slate-800 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`font-bold text-xs ${isActive ? 'text-amber-300' : 'text-slate-400'}`}>
                      {dogma.name}
                    </span>
                    {isActive ? (
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        АКТИВНА
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.2 rounded text-[10px] text-slate-500 bg-slate-900">
                        ЗАБЛОКИРОВАНА
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] italic text-slate-400 mb-1.5">{dogma.tagline}</div>
                  <div className="text-xs text-slate-200 leading-snug">{dogma.description}</div>
                </div>

                <div className="mt-2 pt-1.5 border-t border-slate-800/80 flex items-center gap-2 text-[10px] text-slate-400">
                  <span>Требуется:</span>
                  {Object.entries(dogma.requiredIcons).map(([icon, req]) => (
                    <span
                      key={icon}
                      className={`font-semibold ${
                        (accumulatedIcons[icon as TechIcon] || 0) >= (req || 0)
                          ? 'text-emerald-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {ICON_SYMBOLS[icon as TechIcon]?.label || icon} {req} (у вас {accumulatedIcons[icon as TechIcon] || 0})
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* VIEW MODE 1: Interactive SVG Graph */}
      {viewMode === 'graph' ? (
        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 shadow-xl overflow-x-auto min-h-[550px] relative">
          <div className="flex justify-between items-center mb-3 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2">
            <span>Интерактивный Граф Связей (Кликните на узел для исследования)</span>
            <div className="flex gap-4 text-[11px] font-mono">
              <span className="flex items-center gap-1.5 text-emerald-400">● Изучено</span>
              <span className="flex items-center gap-1.5 text-amber-400">● Доступно для открытия</span>
              <span className="flex items-center gap-1.5 text-slate-500">● Закрыто</span>
            </div>
          </div>

          <div className="relative w-[1100px] h-[820px]">
            {/* SVG Link lines between prerequisite and child nodes */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
              <defs>
                <linearGradient id="link-grad-unlocked" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.8" />
                </linearGradient>
                <linearGradient id="link-grad-locked" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#334155" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#334155" stopOpacity="0.4" />
                </linearGradient>
              </defs>

              {TECH_NODES.map(tech => {
                const childPos = nodePositions[tech.id];
                if (!childPos) return null;

                return tech.prerequisites.map(prereqId => {
                  const parentPos = nodePositions[prereqId];
                  if (!parentPos) return null;

                  const isParentUnlocked = unlockedTechIds.includes(prereqId);
                  const isChildUnlocked = unlockedTechIds.includes(tech.id);
                  const isLinkActive = isParentUnlocked && isChildUnlocked;

                  const startX = parentPos.x + 210;
                  const startY = parentPos.y + 40;
                  const endX = childPos.x;
                  const endY = childPos.y + 40;
                  const controlX1 = startX + (endX - startX) / 2;
                  const controlX2 = startX + (endX - startX) / 2;

                  const pathD = `M ${startX} ${startY} C ${controlX1} ${startY}, ${controlX2} ${endY}, ${endX} ${endY}`;

                  return (
                    <path
                      key={`${prereqId}->${tech.id}`}
                      d={pathD}
                      fill="none"
                      stroke={isLinkActive ? 'url(#link-grad-unlocked)' : isParentUnlocked ? '#da9d78' : '#334155'}
                      strokeWidth={isLinkActive ? 3 : 1.5}
                      strokeDasharray={isLinkActive ? 'none' : '4,4'}
                      className="transition-all duration-300"
                    />
                  );
                });
              })}
            </svg>

            {/* Era Column Labels */}
            <div className="absolute top-0 left-0 right-0 flex justify-between px-10 text-xs font-mono font-bold text-slate-400 uppercase tracking-widest pointer-events-none">
              <span>Эра 1: Рассвет Механики</span>
              <span className="ml-16">Эра 2: Век Пара и Поршней</span>
              <span className="ml-16">Эра 3: Заводные Колоссы</span>
              <span className="ml-16">Эра 4: Сингулярность</span>
            </div>

            {/* Tech Node Boxes */}
            {TECH_NODES.map(tech => {
              const pos = nodePositions[tech.id];
              if (!pos) return null;

              const isUnlocked = unlockedTechIds.includes(tech.id);
              const check = isTechUnlockable(tech.id, unlockedTechIds, resources.science);

              return (
                <div
                  key={tech.id}
                  style={{ left: `${pos.x}px`, top: `${pos.y}px` }}
                  className={`absolute w-[210px] p-2.5 rounded-xl border-2 transition-all z-10 select-none shadow-md ${
                    isUnlocked
                      ? 'bg-slate-900 border-emerald-500/80 shadow-emerald-950/40 text-slate-100 ring-1 ring-emerald-500/40'
                      : check.canUnlock
                      ? 'bg-slate-900 border-amber-400 hover:scale-105 cursor-pointer shadow-amber-950/40 animate-pulse'
                      : 'bg-slate-950 border-slate-800 text-slate-500 opacity-60'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1 text-[10px] font-bold uppercase tracking-wider">
                    <span className="text-amber-400">{tech.branch}</span>
                    {isUnlocked ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                        <Check className="w-3 h-3" />
                      </span>
                    ) : (
                      <span className="text-slate-400 font-mono">📜 {tech.cost}</span>
                    )}
                  </div>

                  <h4 className="font-bold text-xs text-slate-100 truncate mb-1">{tech.name}</h4>

                  {/* Icon chips on graph node */}
                  <div className="flex items-center gap-1 mb-1.5">
                    {Object.entries(tech.icons).map(([icon, count]) => (
                      <span
                        key={icon}
                        className="text-[9px] px-1 py-0.2 rounded bg-slate-950 border border-slate-800 text-slate-300 font-mono"
                      >
                        {icon.slice(0, 2).toUpperCase()} +{count}
                      </span>
                    ))}
                  </div>

                  {/* Quick Action Button on Node */}
                  {!isUnlocked && (
                    <button
                      onClick={() => unlockTech(tech.id)}
                      disabled={!check.canUnlock}
                      className={`w-full py-1 rounded text-[10px] font-bold uppercase transition ${
                        check.canUnlock
                          ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      {check.canUnlock ? 'Изучить' : check.missingPrereqs.length > 0 ? 'Заблокировано' : `Нужно 📜${check.missingScience}`}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* VIEW MODE 2: Card Grid */
        <div className="space-y-3">
          {/* Filters (Branch & Era) */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-400 mr-1 font-medium">Ветка:</span>
              {[
                { id: 'all', label: 'Все ветки' },
                { id: 'craftsman', label: 'Кузнец/Механика' },
                { id: 'warfare', label: 'Война/Баллистика' },
                { id: 'alchemy', label: 'Алхимия/Эфир' },
                { id: 'industry', label: 'Индустрия' },
              ].map(b => (
                <button
                  key={b.id}
                  onClick={() => setSelectedBranch(b.id)}
                  className={`px-2.5 py-1 rounded-lg transition ${
                    selectedBranch === b.id
                      ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-400 mr-1 font-medium">Эра:</span>
              {[0, 1, 2, 3, 4].map(era => (
                <button
                  key={era}
                  onClick={() => setSelectedEra(era)}
                  className={`px-2 py-1 rounded-lg transition ${
                    selectedEra === era
                      ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {era === 0 ? 'Все' : `Эра ${era}`}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredTechs.map(tech => {
              const isUnlocked = unlockedTechIds.includes(tech.id);
              const check = isTechUnlockable(tech.id, unlockedTechIds, resources.science);

              return (
                <div
                  key={tech.id}
                  className={`p-4 rounded-xl border flex flex-col justify-between gap-3 transition ${
                    isUnlocked
                      ? 'bg-slate-900/90 border-emerald-500/40 shadow-emerald-950/20'
                      : check.canUnlock
                      ? 'bg-slate-900/90 border-amber-500/60 shadow-lg shadow-amber-950/20'
                      : 'bg-slate-950/60 border-slate-800 opacity-60'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Эра {tech.era} • {tech.branch}
                      </span>
                      {isUnlocked && (
                        <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30">
                          <Check className="w-3 h-3" /> Изучено
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-sm text-slate-100">{tech.name}</h3>
                    <p className="text-xs text-slate-400 leading-snug">{tech.description}</p>

                    <div className="text-[11px] font-medium text-amber-300 bg-amber-950/20 p-2 rounded border border-amber-500/20">
                      {tech.bonusEffectText}
                    </div>

                    <div className="flex items-center gap-1.5 pt-1">
                      {Object.entries(tech.icons).map(([icon, count]) => {
                        const info = ICON_SYMBOLS[icon as TechIcon];
                        return (
                          <span
                            key={icon}
                            className={`text-[10px] flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 ${info.color}`}
                            title={`${info.label}: +${count}`}
                          >
                            {info.icon} +{count}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    {isUnlocked ? (
                      <div className="text-center py-2 text-xs font-semibold text-emerald-400">
                        Технология активирована
                      </div>
                    ) : (
                      <button
                        onClick={() => unlockTech(tech.id)}
                        disabled={!check.canUnlock}
                        className={`w-full py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition ${
                          check.canUnlock
                            ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                        }`}
                      >
                        {check.canUnlock ? (
                          <>Исследовать (📜 {tech.cost} Науки)</>
                        ) : check.missingPrereqs.length > 0 ? (
                          <span className="flex items-center gap-1">
                            <Lock className="w-3.5 h-3.5" /> Нужен пререквизит
                          </span>
                        ) : (
                          <>Не хватает {check.missingScience} Науки</>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
