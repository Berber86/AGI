import React, { useState } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { GearItem, GearRarity } from '../../data/gear';
import { GEAR_SETS } from '../../data/sets';
import { Sparkles, Trash2, Filter, Combine, CheckCircle2, AlertCircle } from 'lucide-react';

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

export const WorkshopView: React.FC = () => {
  const { inventory, fuseThreeGears, dismantleGear } = useGameStore();

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
      setFeedbackMessage({ text: 'Легендарные шестерни достигли максимального уровня!', isError: true });
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

  const fusionGears = inventory.filter(g => fusionSelectedIds.includes(g.id));

  return (
    <div className="flex flex-col h-full p-4 gap-4 overflow-y-auto max-w-7xl mx-auto w-full">
      {/* Top Banner */}
      <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-amber-400 uppercase tracking-wide">
            Мастерская Шестерен и Трансмутация
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Слияние 3 шестерен в 1 более высокого ранга (3→1 Craft). Разбор ненужных компонентов на запчасти и золото.
          </p>
        </div>

        <div className="text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
          В инвентаре: <span className="font-bold text-amber-400">{inventory.length}</span> шестерен
        </div>
      </div>

      {/* 3-to-1 Fusion Chamber Panel */}
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

        {feedbackMessage && (
          <div
            className={`p-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 ${
              feedbackMessage.isError
                ? 'bg-rose-950/60 text-rose-300 border border-rose-500/40'
                : 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40'
            }`}
          >
            {feedbackMessage.isError ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
            {feedbackMessage.text}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
          {/* Slot 1, 2, 3 */}
          {[0, 1, 2].map(slotIdx => {
            const gear = fusionGears[slotIdx];
            return (
              <div
                key={slotIdx}
                className={`p-3 rounded-xl border-2 flex flex-col justify-between min-h-[110px] ${
                  gear
                    ? RARITY_COLORS[gear.rarity]
                    : 'border-dashed border-slate-800 bg-slate-950/40'
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

          {/* Fusion Button */}
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

      {/* Inventory Filters */}
      <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="font-bold text-slate-300 uppercase">Фильтры:</span>
        </div>

        {/* Rarity filter */}
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

        {/* Slot filter */}
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

        {/* Set filter */}
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

                {/* Stats */}
                <div className="text-xs text-slate-200 flex flex-wrap gap-2 pt-1 font-mono">
                  {gear.stats.attack && <span>АТК +{gear.stats.attack}</span>}
                  {gear.stats.defense && <span>ЗАЩ +{gear.stats.defense}</span>}
                  {gear.stats.maxHp && <span>HP +{gear.stats.maxHp}</span>}
                  {gear.stats.speed && <span>СКР +{gear.stats.speed}</span>}
                  {gear.stats.critChance && <span>Крит +{Math.round(gear.stats.critChance * 100)}%</span>}
                </div>
              </div>

              {/* Action Buttons */}
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
  );
};
