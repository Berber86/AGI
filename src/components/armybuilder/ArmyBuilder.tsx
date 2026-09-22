import React, { useState } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { GearItem, GearSlot } from '../../data/gear';
import { GEAR_SETS } from '../../data/sets';
import { UnitCard } from '../battle/UnitCard';
import { computeUnitStats, buildUnitEntityFromChampion } from '../../engine/unit/computeUnit';
import { TECH_NODES } from '../../data/techs';
import { calculateAccumulatedIcons, getActiveDogmas } from '../../engine/economy/techTree';
import { previewTargetingVectors } from '../../engine/combat/targeting';
import { Plus, X, Lightbulb, Target } from 'lucide-react';
import { UnitEntity } from '../../engine/unit/unit.types';

export const ArmyBuilder: React.FC = () => {
  const { champions, inventory, equipGear, unequipGear, setSquadPosition, unlockedTechIds } = useGameStore();
  const [selectedSquadId, setSelectedSquadId] = useState<string>(champions[0].id);
  const [equipModalSlot, setEquipModalSlot] = useState<GearSlot | null>(null);

  const selectedSquad = champions.find(c => c.id === selectedSquadId) || champions[0];

  const unlockedTechs = TECH_NODES.filter(t => unlockedTechIds.includes(t.id));
  const accumulatedIcons = calculateAccumulatedIcons(unlockedTechIds);
  const activeDogmas = getActiveDogmas(accumulatedIcons);

  const computedStats = computeUnitStats(selectedSquad, { unlockedTechs, activeDogmas });

  // Dummy target dummy enemies to compute target preview
  const dummyEnemies: UnitEntity[] = [
    {
      id: 'dummy_vanguard',
      name: 'Вражеский Дозор (Авангард)',
      role: 'vanguard',
      isPlayer: false,
      row: 2,
      col: 11,
      currentHp: 160,
      maxHp: 160,
      shield: 0,
      morale: 100,
      isFled: false,
      stats: { attack: 20, defense: 14, maxHp: 160, speed: 9, range: 1, critChance: 0.05, dodgeRate: 0.04, accuracy: 0.85, effectiveHp: 200, armorPenetration: 0, startingShield: 0, activeSets: [], activeDogmaBonuses: [] },
      equippedGear: {},
      statuses: [],
    },
    {
      id: 'dummy_flanker',
      name: 'Вражеский Фланкер (Дуэлянт)',
      role: 'duelist',
      isPlayer: false,
      row: 0,
      col: 13,
      currentHp: 120,
      maxHp: 120,
      shield: 0,
      morale: 100,
      isFled: false,
      stats: { attack: 30, defense: 8, maxHp: 120, speed: 17, range: 2, critChance: 0.2, dodgeRate: 0.15, accuracy: 0.9, effectiveHp: 144, armorPenetration: 0.1, startingShield: 0, activeSets: [], activeDogmaBonuses: [] },
      equippedGear: {},
      statuses: [],
    },
    {
      id: 'dummy_sniper',
      name: 'Вражеский Снайпер (Арканист)',
      role: 'arcanist',
      isPlayer: false,
      row: 4,
      col: 15,
      currentHp: 90,
      maxHp: 90,
      shield: 0,
      morale: 100,
      isFled: false,
      stats: { attack: 38, defense: 4, maxHp: 90, speed: 12, range: 6, critChance: 0.15, dodgeRate: 0.05, accuracy: 0.92, effectiveHp: 102, armorPenetration: 0.15, startingShield: 0, activeSets: [], activeDogmaBonuses: [] },
      equippedGear: {},
      statuses: [],
    },
  ];

  const playerEntities = champions.map(c =>
    buildUnitEntityFromChampion(c, { unlockedTechs, activeDogmas })
  );

  const targetingPreviews = previewTargetingVectors(playerEntities, dummyEnemies);

  // Eligible inventory items for equip modal
  const eligibleGear = equipModalSlot ? inventory.filter(g => g.slot === equipModalSlot) : [];

  // Synergy Recommendations
  const recommendations: string[] = [];
  champions.forEach(s => {
    const gears = [s.equippedGear.core, s.equippedGear.drive, s.equippedGear.aux].filter(Boolean) as GearItem[];
    const setCounts: Record<string, number> = {};
    gears.forEach(g => {
      if (g.setName) setCounts[g.setName] = (setCounts[g.setName] || 0) + 1;
    });

    for (const [setName, count] of Object.entries(setCounts)) {
      if (count === 2) {
        const matchingInInventory = inventory.find(g => g.setName === setName);
        const setDef = GEAR_SETS[setName];
        if (matchingInInventory && setDef) {
          recommendations.push(
            `💡 Для ${s.name}: в инвентаре есть «${matchingInInventory.name}». Экипируйте ее для активации полного бонуса сета «${setDef.name}» (3/3)!`
          );
        }
      }
    }
  });

  return (
    <div className="flex flex-col h-full p-4 gap-4 overflow-y-auto max-w-7xl mx-auto w-full">
      {/* Top Banner */}
      <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 shadow-lg flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-black text-amber-400 uppercase tracking-wide">
            Ангар и Конструктор Шестерен
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Кастомизируйте три элитных отряда Империи. Устанавливайте шестерни в ячейки Ядра, Привода и Вспомогат. узла для получения мощных сетовых синергий.
          </p>
        </div>
        <div className="text-xs text-slate-300 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
          Активных догм: <span className="font-bold text-amber-400">{activeDogmas.length}</span>
        </div>
      </div>

      {/* Synergy Recommendations Banner */}
      {recommendations.length > 0 && (
        <div className="bg-gradient-to-r from-amber-950/40 to-slate-900 border border-amber-500/40 p-3 rounded-xl shadow-md space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            Рекомендации по Сетовым Синергиям
          </div>
          {recommendations.map((rec, i) => (
            <div key={i} className="text-xs text-slate-200">
              {rec}
            </div>
          ))}
        </div>
      )}

      {/* Squad Tabs Selection */}
      <div className="grid grid-cols-3 gap-3">
        {champions.map(squad => {
          const isSelected = squad.id === selectedSquadId;
          const stats = computeUnitStats(squad, { unlockedTechs, activeDogmas });
          return (
            <button
              key={squad.id}
              onClick={() => setSelectedSquadId(squad.id)}
              className={`p-3 rounded-xl border-2 text-left transition ${
                isSelected
                  ? 'border-amber-400 bg-amber-950/20 shadow-lg shadow-amber-950/40 ring-1 ring-amber-400'
                  : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-sm text-slate-100">{squad.name}</span>
                <span className="text-[10px] uppercase font-semibold text-amber-400">{squad.role}</span>
              </div>
              <div className="text-[11px] text-slate-400 flex gap-3">
                <span>HP: {stats.maxHp}</span>
                <span>АТК: {stats.attack}</span>
                <span>ЗАЩ: {stats.defense}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Squad Workshop Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Unit Card & Position Inspector */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 shadow-md space-y-3">
            <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-wider">
              <span>Визуальная Карта Отряда (CCG Card)</span>
              <span className="text-amber-400">{selectedSquad.title}</span>
            </div>

            <UnitCard
              id={selectedSquad.id}
              name={selectedSquad.name}
              role={selectedSquad.role}
              isPlayer={true}
              currentHp={computedStats.maxHp}
              maxHp={computedStats.maxHp}
              shield={computedStats.startingShield}
              morale={100}
              stats={computedStats}
              equippedGear={selectedSquad.equippedGear}
              activeSets={computedStats.activeSets}
            />

            {/* Line / Position Controls */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2 text-xs">
              <span className="font-bold text-slate-300 block">Боевая Позиция на Сетке (10x20):</span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Боевая Линия (Ряд 1-5):</label>
                  <select
                    value={selectedSquad.preferredLine}
                    onChange={(e) => setSquadPosition(selectedSquad.id, Number(e.target.value), selectedSquad.col)}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-xs text-slate-200"
                  >
                    {[0, 1, 2, 3, 4].map(line => (
                      <option key={line} value={line}>
                        Линия {line + 1} {line === 2 ? '(Центр)' : line === 0 ? '(Верхний фланг)' : line === 4 ? '(Нижний фланг)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Глубина (Колонка 0-9):</label>
                  <select
                    value={selectedSquad.col}
                    onChange={(e) => setSquadPosition(selectedSquad.id, selectedSquad.preferredLine, Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-xs text-slate-200"
                  >
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(col => (
                      <option key={col} value={col}>
                        Колонка {col} {col <= 2 ? '(Тыловой резерв)' : col >= 6 ? '(Авангард фронта)' : '(Медиана)'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Equipment Slots & Sets Panel */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 shadow-md space-y-4">
            <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-800">
              <span>Слоты Модулей Шестерен</span>
              <span className="text-amber-400">3 слота на отряд</span>
            </div>

            {/* 3 Gear Slots: Core, Drive, Aux */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {(['core', 'drive', 'aux'] as GearSlot[]).map(slot => {
                const gear = selectedSquad.equippedGear[slot];
                const slotTitle = slot === 'core' ? 'Главная Передача (Core)' : slot === 'drive' ? 'Привод (Drive)' : 'Вспомогат. Узел (Aux)';

                return (
                  <div
                    key={slot}
                    className={`p-3 rounded-xl border flex flex-col justify-between min-h-[160px] ${
                      gear
                        ? 'bg-slate-950/80 border-slate-700 shadow-md'
                        : 'bg-slate-950/40 border-dashed border-slate-800'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase mb-2">
                        <span>{slotTitle}</span>
                        {gear && (
                          <button
                            onClick={() => unequipGear(selectedSquad.id, slot)}
                            className="p-1 hover:text-rose-400 text-slate-500 rounded"
                            title="Снять шестерню"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {gear ? (
                        <div className="space-y-1.5">
                          <div className="font-bold text-xs text-amber-300">{gear.name}</div>
                          {gear.setName && (
                            <div className="text-[10px] text-sky-400 font-medium">
                              Сет: {GEAR_SETS[gear.setName]?.name || gear.setName}
                            </div>
                          )}
                          <div className="text-[10px] text-slate-300 space-y-0.5">
                            {gear.stats.attack && <div>АТК: +{gear.stats.attack}</div>}
                            {gear.stats.defense && <div>ЗАЩ: +{gear.stats.defense}</div>}
                            {gear.stats.maxHp && <div>HP: +{gear.stats.maxHp}</div>}
                            {gear.stats.speed && <div>СКР: +{gear.stats.speed}</div>}
                            {gear.stats.critChance && <div>Крит: +{Math.round(gear.stats.critChance * 100)}%</div>}
                          </div>
                        </div>
                      ) : (
                        <div className="text-xs text-slate-600 text-center py-4">Слот пуст</div>
                      )}
                    </div>

                    <button
                      onClick={() => setEquipModalSlot(slot)}
                      className="mt-3 w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1 border border-slate-700"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      {gear ? 'Заменить' : 'Установить'}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Active Sets Breakdown */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Активные Сет-Бонусы Экипировки
              </span>
              {computedStats.activeSets.length > 0 ? (
                <div className="space-y-2">
                  {computedStats.activeSets.map(setInfo => (
                    <div
                      key={setInfo.setId}
                      className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-500/30 text-xs"
                    >
                      <div className="flex justify-between font-bold text-amber-300 mb-0.5">
                        <span>⚙️ {setInfo.name}</span>
                        <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400">
                          {setInfo.count} / 3 предметов
                        </span>
                      </div>
                      <div className="text-slate-300 text-[11px] leading-relaxed">{setInfo.description}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-slate-500 italic bg-slate-950 p-3 rounded-lg border border-slate-800">
                  Экипируйте 2 или 3 шестерни одного сета (например, «Паровой Легион» или «Заводной Дракон») для активации мощных пассивных эффектов.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive 10x20 Battlefield Tactical Preview with Targeting Vectors */}
      <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-sm text-slate-100 uppercase tracking-wider">
              Тактическая Сетка 10x20: Превью Таргетинга и Траекторий
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            Зона Игрока (Колонки 0..9) ↔ Зона Врагов (Колонки 10..19)
          </span>
        </div>

        {/* 10x20 Interactive Board */}
        <div className="grid grid-rows-5 gap-1.5 bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[10px]">
          {[0, 1, 2, 3, 4].map(rowIndex => (
            <div key={rowIndex} className="flex items-center gap-1">
              <span className="w-8 text-slate-500 font-bold">L{rowIndex + 1}</span>

              {/* 20 Columns */}
              <div className="grid grid-cols-20 gap-1 flex-1">
                {Array.from({ length: 20 }).map((_, colIndex) => {
                  const isPlayerZone = colIndex <= 9;
                  const squadHere = champions.find(c => c.preferredLine === rowIndex && c.col === colIndex);
                  const dummyHere = dummyEnemies.find(d => d.row === rowIndex && d.col === colIndex);

                  return (
                    <div
                      key={colIndex}
                      onClick={() => {
                        if (isPlayerZone) {
                          setSquadPosition(selectedSquadId, rowIndex, colIndex);
                        }
                      }}
                      className={`h-7 rounded flex items-center justify-center transition border ${
                        squadHere
                          ? 'bg-amber-500/30 border-amber-400 text-amber-300 font-bold shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                          : dummyHere
                          ? 'bg-rose-500/20 border-rose-500 text-rose-300 font-bold'
                          : isPlayerZone
                          ? 'bg-slate-900/40 border-slate-800/80 hover:border-amber-500/40 cursor-pointer'
                          : 'bg-slate-950/60 border-slate-900 text-slate-700'
                      }`}
                      title={
                        squadHere
                          ? `${squadHere.name} (L${rowIndex + 1}, C${colIndex})`
                          : dummyHere
                          ? `${dummyHere.name}`
                          : `Клетка L${rowIndex + 1}, C${colIndex}`
                      }
                    >
                      {squadHere ? (
                        <span className="text-xs">⚔</span>
                      ) : dummyHere ? (
                        <span className="text-xs">🎯</span>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Targeting vectors readout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-1 text-xs font-mono">
          {targetingPreviews.map(p => (
            <div
              key={p.attackerId}
              className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 flex flex-col justify-between"
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-amber-400 font-bold truncate">{p.attackerName}</span>
                <span className="text-[10px] text-slate-400">дист: {p.distance}</span>
              </div>
              <div className="text-[11px] text-slate-300">
                Цель: <strong className="text-rose-400">{p.targetName}</strong>
              </div>
              <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1">
                <span>Шанс попадания: <strong className="text-emerald-400">{p.hitChanceEstimate}%</strong></span>
                <span className={p.isInRange ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                  {p.isInRange ? '✓ В радиусе' : '⚡ Сближение'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Equip Modal / Selection Drawer */}
      {equipModalSlot && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-5 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div>
                <h3 className="font-bold text-base text-slate-100">
                  Выбор шестерни для слота: {equipModalSlot.toUpperCase()}
                </h3>
                <span className="text-xs text-slate-400">
                  Отряд: <span className="text-amber-400 font-bold">{selectedSquad.name}</span>
                </span>
              </div>
              <button
                onClick={() => setEquipModalSlot(null)}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-2 pr-1 flex-1">
              {eligibleGear.length > 0 ? (
                eligibleGear.map(gear => (
                  <div
                    key={gear.id}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 flex items-center justify-between gap-3 transition"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-100">{gear.name}</span>
                        <span className="text-[10px] uppercase font-semibold text-amber-400 px-1.5 py-0.2 rounded bg-amber-500/10">
                          {gear.rarity}
                        </span>
                      </div>
                      {gear.setName && (
                        <div className="text-[10px] text-sky-400">Сет: {GEAR_SETS[gear.setName]?.name || gear.setName}</div>
                      )}
                      <div className="text-[11px] text-slate-400 flex flex-wrap gap-2">
                        {gear.stats.attack && <span>АТК +{gear.stats.attack}</span>}
                        {gear.stats.defense && <span>ЗАЩ +{gear.stats.defense}</span>}
                        {gear.stats.maxHp && <span>HP +{gear.stats.maxHp}</span>}
                        {gear.stats.speed && <span>СКР +{gear.stats.speed}</span>}
                        {gear.stats.critChance && <span>Крит +{Math.round(gear.stats.critChance * 100)}%</span>}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        equipGear(selectedSquad.id, equipModalSlot, gear.id);
                        setEquipModalSlot(null);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition"
                    >
                      Надеть
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-xs text-slate-500">
                  В инвентаре нет свободных шестеренок для этого слота.
                  Добудьте их в кампании или объедините в мастерской!
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
