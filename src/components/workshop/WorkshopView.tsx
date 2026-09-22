import React, { useState } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { GearItem, GearRarity, QUEST_BLUEPRINTS } from '../../data/gear';
import { GEAR_SETS } from '../../data/sets';
import { Sparkles, Trash2, Filter, Combine, CheckCircle2, AlertCircle, Hammer, Award } from 'lucide-react';

const RARITY_COLORS: Record<GearRarity, string> = {
  common: 'border-slate-700 bg-slate-900/60 text-slate-300',
  rare: 'border-blue-500/60 bg-blue-950/30 text-blue-300',
  epic: 'border-purple-500/60 bg-purple-950/30 text-purple-300',
  legendary: 'border-amber-500/60 bg-amber-950/30 text-amber-300',
};

const RARITY_NAMES: Record<GearRarity, string> = {
  common: 'Обычная',
  rare: 'Редкая',
  epic: 'Эпическая',
  legendary: 'Легендарная',
};

type WorkshopSubTab = 'fusion' | 'refine' | 'blueprints' | 'inventory';

export const WorkshopView: React.FC = () => {
  const {
    inventory,
    champions,
    resources,
    fuseThreeGears,
    dismantleGear,
    refineGearItem,
    craftArtifact,
  } = useGameStore();

  const [activeSubTab, setActiveSubTab] = useState<WorkshopSubTab>('fusion');
  const [selectedRarity, setSelectedRarity] = useState<string>('all');
  const [selectedSlot, setSelectedSlot] = useState<string>('all');
  const [selectedSet, setSelectedSet] = useState<string>('all');
  const [fusionSelectedIds, setFusionSelectedIds] = useState<string[]>([]);
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; isError?: boolean } | null>(null);

  const filteredInventory = inventory.filter(g => {
    if (selectedRarity !== 'all' && g.rarity !== selectedRarity) return false;
    if (selectedSlot !== 'all' && g.slot !== selectedSlot) return false;
    if (selectedSet !== 'all' && g.setName !== selectedSet) return false;
    return true;
  });

  const toggleFusionSelection = (gear: GearItem) => {
    if (fusionSelectedIds.includes(gear.id)) {
      setFusionSelectedIds(fusionSelectedIds.filter(id => id !== gear.id));
      return;
    }

    if (fusionSelectedIds.length >= 3) {
      setFeedbackMessage({ text: 'Максимум 3 шестерни в камере слияния!', isError: true });
      return;
    }

    if (fusionSelectedIds.length > 0) {
      const firstGear = inventory.find(g => g.id === fusionSelectedIds[0]);
      if (firstGear && firstGear.rarity !== gear.rarity) {
        setFeedbackMessage({ text: 'Все 3 шестерни должны быть одинаковой редкости!', isError: true });
        return;
      }
    }

    if (gear.rarity === 'legendary') {
      setFeedbackMessage({ text: 'Легендарные шестерни достигли максимального качества!', isError: true });
      return;
    }

    setFeedbackMessage(null);
    setFusionSelectedIds([...fusionSelectedIds, gear.id]);
  };

  const handlePerformFusion = () => {
    if (fusionSelectedIds.length !== 3) return;
    const res = fuseThreeGears([fusionSelectedIds[0], fusionSelectedIds[1], fusionSelectedIds[2]]);
    if (res.success) {
      setFeedbackMessage({ text: res.message, isError: false });
      setFusionSelectedIds([]);
    } else {
      setFeedbackMessage({ text: res.message, isError: true });
    }
  };

  const handleRefine = (gearId: string) => {
    const res = refineGearItem(gearId);
    setFeedbackMessage({ text: res.message, isError: !res.success });
  };

  const handleCraftArtifact = (blueprintId: string) => {
    const res = craftArtifact(blueprintId);
    setFeedbackMessage({ text: res.message, isError: !res.success });
  };

  const fusionGears = inventory.filter(g => fusionSelectedIds.includes(g.id));

  // Collect all refinable gears (both in inventory and equipped on champions)
  const allRefinableGears: { gear: GearItem; squadName?: string }[] = [];
  inventory.forEach(g => allRefinableGears.push({ gear: g }));
  champions.forEach(sq => {
    if (sq.equippedGear.core) allRefinableGears.push({ gear: sq.equippedGear.core, squadName: sq.name });
    if (sq.equippedGear.drive) allRefinableGears.push({ gear: sq.equippedGear.drive, squadName: sq.name });
    if (sq.equippedGear.aux) allRefinableGears.push({ gear: sq.equippedGear.aux, squadName: sq.name });
  });

  return (
    <div className="flex flex-col h-full p-4 gap-4 overflow-y-auto max-w-7xl mx-auto w-full">
      {/* Top Banner */}
      <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-amber-400 uppercase tracking-wide">
            Мастерская Шестерен и Трансмутация
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Слияние 3 шестерен в 1 более высокого ранга, заточка (+1..+5) и ковка артефактов по чертежам.
          </p>
        </div>

        {/* Sub-tabs buttons */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => { setActiveSubTab('fusion'); setFeedbackMessage(null); }}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition ${
              activeSubTab === 'fusion' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Combine className="w-3.5 h-3.5" /> Слияние (3→1)
          </button>
          <button
            onClick={() => { setActiveSubTab('refine'); setFeedbackMessage(null); }}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition ${
              activeSubTab === 'refine' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Hammer className="w-3.5 h-3.5" /> Заточка (+1..+5)
          </button>
          <button
            onClick={() => { setActiveSubTab('blueprints'); setFeedbackMessage(null); }}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition ${
              activeSubTab === 'blueprints' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5" /> Чертежи
          </button>
        </div>
      </div>

      {/* Global Feedback Banner */}
      {feedbackMessage && (
        <div
          className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
            feedbackMessage.isError
              ? 'bg-rose-950/60 text-rose-300 border border-rose-500/40'
              : 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40'
          }`}
        >
          {feedbackMessage.isError ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
          {feedbackMessage.text}
        </div>
      )}

      {/* SUBTAB 1: 3-to-1 Fusion */}
      {activeSubTab === 'fusion' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-amber-950/30 via-slate-900 to-slate-900 p-4 rounded-xl border-2 border-amber-500/40 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Combine className="w-5 h-5 text-amber-400" />
                <h2 className="text-sm font-black uppercase tracking-wider text-amber-300">
                  Камера Трансмутации Шестерен (3 → 1 Редкость Выше)
                </h2>
              </div>
              <span className="text-xs text-slate-400">
                Выбрано: <strong className="text-amber-400">{fusionSelectedIds.length}</strong> / 3
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
              {[0, 1, 2].map(slotIdx => {
                const gear = fusionGears[slotIdx];
                return (
                  <div
                    key={slotIdx}
                    className={`p-3 rounded-xl border-2 flex flex-col justify-between min-h-[110px] ${
                      gear ? RARITY_COLORS[gear.rarity] : 'border-dashed border-slate-800 bg-slate-950/40'
                    }`}
                  >
                    {gear ? (
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-[10px] font-bold">
                          <span className="truncate">{gear.name}</span>
                          <button
                            onClick={() => toggleFusionSelection(gear)}
                            className="text-slate-500 hover:text-rose-400 text-xs"
                          >
                            ✕
                          </button>
                        </div>
                        <span className="text-[10px] text-amber-400 uppercase block font-semibold">{gear.rarity}</span>
                        <span className="text-[10px] text-slate-400">Слот: {gear.slot.toUpperCase()}</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-slate-600 text-xs">
                        <span>Слот {slotIdx + 1}</span>
                        <span className="text-[10px]">Выберите в списке ниже</span>
                      </div>
                    )}
                  </div>
                );
              })}

              <div>
                <button
                  onClick={handlePerformFusion}
                  disabled={fusionSelectedIds.length !== 3}
                  className={`w-full py-4 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-lg ${
                    fusionSelectedIds.length === 3
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 cursor-pointer animate-pulse'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  Трансмутировать (3→1)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: Refinement (+1..+5) */}
      {activeSubTab === 'refine' && (
        <div className="space-y-3">
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-1">
            <h3 className="font-bold text-sm text-sky-400 flex items-center gap-2">
              <Hammer className="w-4 h-4" />
              Станок Прецизионной Заточки (+15% к базовым характеристикам за уровень, макс. +5)
            </h3>
            <p className="text-xs text-slate-400">
              Полируйте зубья и усиливайте пружины шестерёнок за Золото и Запчасти. Доступно для всех деталей из инвентаря и экипированных на бойцах.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {allRefinableGears.map(({ gear, squadName }) => {
              const currentRefine = gear.refinementLevel || 0;
              const costGold = (currentRefine + 1) * 35;
              const costCog = (currentRefine + 1) * 20;
              const canAfford = resources.gold >= costGold && resources.cogParts >= costCog;

              return (
                <div
                  key={gear.id}
                  className={`p-3.5 rounded-xl border flex flex-col justify-between gap-2.5 ${RARITY_COLORS[gear.rarity]}`}
                >
                  <div>
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase mb-1">
                      <span>{gear.slot.toUpperCase()} • {RARITY_NAMES[gear.rarity]}</span>
                      {squadName && (
                        <span className="text-amber-400 px-1.5 py-0.2 rounded bg-amber-500/10 border border-amber-500/30">
                          {squadName}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-sm text-slate-100">{gear.name}</h4>
                      {currentRefine > 0 && (
                        <span className="text-xs font-black text-amber-400 font-mono">+{currentRefine}</span>
                      )}
                    </div>

                    <div className="text-xs text-slate-300 flex flex-wrap gap-2 pt-1 font-mono">
                      {gear.stats.attack && <span>АТК +{gear.stats.attack}</span>}
                      {gear.stats.defense && <span>ЗАЩ +{gear.stats.defense}</span>}
                      {gear.stats.maxHp && <span>HP +{gear.stats.maxHp}</span>}
                      {gear.stats.speed && <span>СКР +{gear.stats.speed}</span>}
                      {gear.stats.critChance && <span>Крит +{Math.round(gear.stats.critChance * 100)}%</span>}
                    </div>
                  </div>

                  <div>
                    {currentRefine >= 5 ? (
                      <div className="p-2 rounded bg-slate-950 border border-slate-800 text-center text-xs font-bold text-emerald-400">
                        Максимальная заточка (+5)
                      </div>
                    ) : (
                      <button
                        onClick={() => handleRefine(gear.id)}
                        disabled={!canAfford}
                        className={`w-full py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition ${
                          canAfford
                            ? 'bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-md'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                        }`}
                      >
                        <Hammer className="w-3.5 h-3.5" />
                        Заточить (💰{costGold} | ⚙️{costCog})
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUBTAB 3: Blueprints (Quest Artifacts) */}
      {activeSubTab === 'blueprints' && (
        <div className="space-y-3">
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-1">
            <h3 className="font-bold text-sm text-purple-400 flex items-center gap-2">
              <Award className="w-4 h-4" />
              Чертежи Легендарных Шестерен Первой Империи
            </h3>
            <p className="text-xs text-slate-400">
              Создавайте уникальные артефакты, перековывая эпические детали определенных сетов.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {QUEST_BLUEPRINTS.map(bp => {
              const eligibleCount = inventory.filter(
                g => g.rarity === bp.requiredRarity && (!bp.requiredSetName || g.setName === bp.requiredSetName)
              ).length;
              const canCraft =
                eligibleCount >= bp.requiredCount &&
                resources.gold >= bp.costGold &&
                resources.cogParts >= bp.costCogParts;

              return (
                <div
                  key={bp.id}
                  className="bg-slate-900/90 border border-purple-500/40 p-4 rounded-xl flex flex-col justify-between gap-3 shadow-lg shadow-purple-950/20"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
                      Легендарный Чертеж
                    </span>
                    <h4 className="font-bold text-sm text-slate-100">{bp.name}</h4>
                    <p className="text-xs text-slate-400 leading-snug">{bp.description}</p>

                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Требуется деталей:</span>
                        <span className={eligibleCount >= bp.requiredCount ? 'text-emerald-400 font-bold' : 'text-rose-400'}>
                          {eligibleCount} / {bp.requiredCount} {bp.requiredSetName ? `(${bp.requiredSetName})` : ''}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Стоимость ковки:</span>
                        <span className="text-amber-300 font-bold">💰 {bp.costGold} | ⚙️ {bp.costCogParts}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCraftArtifact(bp.id)}
                    disabled={!canCraft}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition ${
                      canCraft
                        ? 'bg-gradient-to-r from-purple-500 to-amber-500 text-slate-950 shadow-lg cursor-pointer'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                    }`}
                  >
                    Выковать Артефакт
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Inventory Filters & Grid (Always shown below for quick reference) */}
      <div className="space-y-3 pt-2">
        <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="font-bold text-slate-300 uppercase">Фильтры Инвентаря:</span>
          </div>

          <div className="flex items-center gap-1">
            {['all', 'common', 'rare', 'epic', 'legendary'].map(r => (
              <button
                key={r}
                onClick={() => setSelectedRarity(r)}
                className={`px-2.5 py-1 rounded-lg capitalize transition ${
                  selectedRarity === r
                    ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {r === 'all' ? 'Все' : RARITY_NAMES[r as GearRarity] || r}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1">
            {['all', 'core', 'drive', 'aux'].map(s => (
              <button
                key={s}
                onClick={() => setSelectedSlot(s)}
                className={`px-2.5 py-1 rounded-lg capitalize transition ${
                  selectedSlot === s
                    ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {s === 'all' ? 'Все слоты' : s}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setSelectedSet('all')}
              className={`px-2.5 py-1 rounded-lg transition ${
                selectedSet === 'all'
                  ? 'bg-purple-500/20 text-purple-300 font-bold border border-purple-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Все сеты
            </button>
            {Object.entries(GEAR_SETS).map(([setId, sDef]) => (
              <button
                key={setId}
                onClick={() => setSelectedSet(setId)}
                className={`px-2 py-1 rounded-lg transition text-[11px] ${
                  selectedSet === setId
                    ? 'bg-purple-500/20 text-purple-300 font-bold border border-purple-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {sDef.name}
              </button>
            ))}
          </div>
        </div>

        {/* Inventory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredInventory.map(gear => {
            const isSelectedForFusion = fusionSelectedIds.includes(gear.id);
            const setName = gear.setName ? GEAR_SETS[gear.setName]?.name || gear.setName : null;

            return (
              <div
                key={gear.id}
                className={`p-3.5 rounded-xl border-2 flex flex-col justify-between gap-2.5 transition ${
                  isSelectedForFusion
                    ? 'border-amber-400 ring-2 ring-amber-400 bg-amber-950/30'
                    : RARITY_COLORS[gear.rarity]
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                      {gear.slot.toUpperCase()} • {RARITY_NAMES[gear.rarity]}
                    </span>
                    {setName && (
                      <span className="text-[10px] text-sky-400 font-medium px-1.5 py-0.2 rounded bg-sky-950/80 border border-sky-800">
                        ⚙️ {setName}
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-sm text-slate-100">{gear.name}</h3>
                  <p className="text-[11px] text-slate-400 leading-snug">{gear.description}</p>

                  <div className="text-xs text-slate-200 flex flex-wrap gap-2 pt-1 font-mono">
                    {gear.stats.attack && <span>АТК +{gear.stats.attack}</span>}
                    {gear.stats.defense && <span>ЗАЩ +{gear.stats.defense}</span>}
                    {gear.stats.maxHp && <span>HP +{gear.stats.maxHp}</span>}
                    {gear.stats.speed && <span>СКР +{gear.stats.speed}</span>}
                    {gear.stats.critChance && <span>Крит +{Math.round(gear.stats.critChance * 100)}%</span>}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => toggleFusionSelection(gear)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 ${
                      isSelectedForFusion
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                    }`}
                  >
                    <Combine className="w-3.5 h-3.5" />
                    {isSelectedForFusion ? 'Убрать из кузни' : 'В кузню слияния'}
                  </button>

                  <button
                    onClick={() => dismantleGear(gear.id)}
                    className="p-1.5 rounded-lg bg-slate-950 hover:bg-rose-950/60 hover:text-rose-400 text-slate-500 border border-slate-800 transition"
                    title="Разобрать на запчасти и золото"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
