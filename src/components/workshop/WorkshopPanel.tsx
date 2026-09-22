import { useMemo, useState } from 'react';
import { GEAR_BY_ID, RARITY_LABEL, SLOT_ICON, SLOT_LABEL } from '@/data/gear';
import { SET_BY_ID, SETS } from '@/data/sets';
import { describeAbility, gearInstanceStats } from '@/engine/unit/computeUnit';
import { canCraft, craftCost, CRAFT_COST_ORE, SALVAGE_ORE } from '@/engine/loot/gearGenerator';
import { collectModifiers, craftDiscount } from '@/engine/economy/techTree';
import { GEAR_SLOTS, RARITIES, type Element, type GearInstance, type GearSlot, type Rarity } from '@/engine/unit/unit.types';
import { useGameStore } from '@/store/useGameStore';
import { ELEMENT_LABEL, formatStats, STAT_ICON } from '@/utils/format';

type SortKey = 'rarity' | 'slot' | 'set';

export function WorkshopPanel() {
  const d = useGameStore((s) => s.data);
  const selection = useGameStore((s) => s.craftSelection);
  const toggle = useGameStore((s) => s.toggleCraftSelect);
  const craft = useGameStore((s) => s.craft);
  const salvage = useGameStore((s) => s.salvage);

  const [filterRarity, setFilterRarity] = useState<Rarity | 'all'>('all');
  const [filterSlot, setFilterSlot] = useState<GearSlot | 'all'>('all');
  const [filterSet, setFilterSet] = useState<string | 'all'>('all');
  const [filterElement, setFilterElement] = useState<Element | 'all'>('all');
  const [onlyAbilities, setOnlyAbilities] = useState(false);
  const [sort, setSort] = useState<SortKey>('rarity');

  const mods = useMemo(() => collectModifiers(d.techs, d.buildings), [d.techs, d.buildings]);
  const discount = craftDiscount(mods);

  const items = useMemo(() => {
    const worn = new Set(d.squads.flatMap((sq) => GEAR_SLOTS.map((s) => sq.gear[s])).filter(Boolean) as string[]);
    let list = d.collection.filter((g) => {
      const def = GEAR_BY_ID[g.defId];
      if (!def) return false;
      if (filterRarity !== 'all' && g.rarity !== filterRarity) return false;
      if (filterSlot !== 'all' && def.slot !== filterSlot) return false;
      if (filterSet !== 'all' && (def.setId ?? 'none') !== filterSet) return false;
      if (filterElement !== 'all' && (def.element ?? 'physical') !== filterElement) return false;
      if (onlyAbilities && !(def.abilities && def.abilities.length > 0)) return false;
      return true;
    });
    const rank = (g: GearInstance): number => RARITIES.indexOf(g.rarity);
    list = [...list].sort((a, b) => {
      if (sort === 'rarity') return rank(b) - rank(a) || a.defId.localeCompare(b.defId);
      if (sort === 'slot') return GEAR_BY_ID[a.defId]!.slot.localeCompare(GEAR_BY_ID[b.defId]!.slot) || rank(b) - rank(a);
      return (GEAR_BY_ID[a.defId]!.setId ?? '').localeCompare(GEAR_BY_ID[b.defId]!.setId ?? '') || rank(b) - rank(a);
    });
    return { list, worn };
  }, [d.collection, d.squads, filterRarity, filterSlot, filterSet, filterElement, onlyAbilities, sort]);

  const selected = d.collection.filter((g) => selection.includes(g.uid));
  const craftCheck = canCraft(selected);
  const cost = craftCheck.ok ? craftCost(selected[0]!.rarity, discount) : 0;
  const enoughOre = d.resources.ore >= cost;

  return (
    <div className="space-y-4">
      {/* Верстак слияния */}
      <div className="panel-brass rounded-xl p-3">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-bold text-amber-200">🔨 Слияние 3 → 1</span>
          <span className="text-xs text-slate-400">Скидка кузницы и догм: −{discount}%</span>
          <span className="ml-auto font-mono text-sm text-slate-200">⛏ {Math.floor(d.resources.ore)}</span>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          {[0, 1, 2].map((i) => {
            const g = selected[i];
            const def = g ? GEAR_BY_ID[g.defId] : undefined;
            return (
              <div
                key={i}
                className={`flex h-16 w-32 flex-col justify-center rounded-xl border-2 p-1 text-center ${
                  g ? `rarity-${g.rarity} bg-slate-900` : 'border-dashed border-slate-700 bg-slate-950/50'
                }`}
              >
                {g && def ? (
                  <>
                    <div className="truncate text-xs font-bold text-slate-100">{def.icon} {def.name}</div>
                    <div className={`text-[10px] text-rarity-${g.rarity}`}>{RARITY_LABEL[g.rarity]}</div>
                  </>
                ) : (
                  <div className="text-xs text-slate-600">слот {i + 1}</div>
                )}
              </div>
            );
          })}
          <div className="flex flex-col gap-1">
            <button
              disabled={!craftCheck.ok || !enoughOre}
              onClick={craft}
              title={!craftCheck.ok ? (craftCheck.reason ?? '') : !enoughOre ? `Нужно руды: ${cost}` : ''}
              className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-bold text-slate-950 transition enabled:hover:bg-amber-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-500"
            >
              Слить {craftCheck.ok ? `(${cost} ⛏)` : ''}
            </button>
            <span className="text-center text-[10px] text-slate-500">
              {craftCheck.ok ? `→ ${RARITY_LABEL[RARITIES[RARITIES.indexOf(selected[0]!.rarity) + 1] ?? 'legendary']}` : (craftCheck.reason ?? 'выберите 3 предмета одной редкости')}
            </span>
          </div>
        </div>
        {selected.length === 3 && selected.filter((g) => { const s = GEAR_BY_ID[g.defId]?.setId; return s && selected.filter((x) => GEAR_BY_ID[x.defId]?.setId === s).length >= 2; }).length > 0 && (
          <div className="mt-1 text-[11px] text-emerald-300">
            ✦ Два и более предметов одного сета: результат, скорее всего, будет из этого сета.
          </div>
        )}
      </div>

      {/* Фильтры */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <select value={filterRarity} onChange={(e) => setFilterRarity(e.target.value as Rarity | 'all')} className="rounded bg-slate-900 px-2 py-1 text-slate-200">
          <option value="all">Все редкости</option>
          {RARITIES.map((r) => (
            <option key={r} value={r}>{RARITY_LABEL[r]}</option>
          ))}
        </select>
        <select value={filterSlot} onChange={(e) => setFilterSlot(e.target.value as GearSlot | 'all')} className="rounded bg-slate-900 px-2 py-1 text-slate-200">
          <option value="all">Все слоты</option>
          {(Object.keys(SLOT_LABEL) as GearSlot[]).map((s) => (
            <option key={s} value={s}>{SLOT_ICON[s]} {SLOT_LABEL[s]}</option>
          ))}
        </select>
        <select value={filterSet} onChange={(e) => setFilterSet(e.target.value)} className="rounded bg-slate-900 px-2 py-1 text-slate-200">
          <option value="all">Все сеты и без</option>
          {SETS.map((s) => (
            <option key={s.id} value={s.id}>{s.icon} {s.name}</option>
          ))}
          <option value="none">— без сета</option>
        </select>
        <select value={filterElement} onChange={(e) => setFilterElement(e.target.value as Element | 'all')} className="rounded bg-slate-900 px-2 py-1 text-slate-200">
          <option value="all">Любая стихия</option>
          {(Object.keys(ELEMENT_LABEL) as Element[]).map((el) => (
            <option key={el} value={el}>{ELEMENT_LABEL[el]}</option>
          ))}
        </select>
        <label className="flex cursor-pointer items-center gap-1 rounded bg-slate-900 px-2 py-1 text-slate-300">
          <input type="checkbox" checked={onlyAbilities} onChange={(e) => setOnlyAbilities(e.target.checked)} />
          только со способностями
        </label>
        <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className="rounded bg-slate-900 px-2 py-1 text-slate-200">
          <option value="rarity">Сортировка: редкость</option>
          <option value="slot">Сортировка: слот</option>
          <option value="set">Сортировка: сет</option>
        </select>
        <span className="ml-auto text-slate-500">{items.list.length} предм.</span>
      </div>

      {/* Коллекция */}
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.list.map((g) => {
          const def = GEAR_BY_ID[g.defId]!;
          const worn = items.worn.has(g.uid);
          const chosen = selection.includes(g.uid);
          return (
            <div key={g.uid} className={`rounded-xl border-2 bg-slate-900/80 p-2 rarity-${g.rarity} ${chosen ? 'ring-2 ring-amber-400' : ''}`}>
              <div className="flex items-start gap-1">
                <button onClick={() => toggle(g.uid)} className="min-w-0 flex-1 text-left" title="Выбрать для слияния">
                  <div className="truncate text-xs font-bold text-slate-100">{def.icon} {def.name}</div>
                  <div className={`text-[10px] text-rarity-${g.rarity}`}>
                    {RARITY_LABEL[g.rarity]} • кач. {Math.round(g.quality * 100)}% • ц.{g.cycle}
                  </div>
                  <div className="mt-0.5 text-[10px] text-emerald-300">{formatStats(gearInstanceStats(g))}</div>
                  {def.abilities && (
                    <div className="mt-0.5 text-[10px] text-amber-100/70">{def.abilities.map(describeAbility).join(' ')}</div>
                  )}
                  {def.setId && (
                    <div className="mt-0.5 text-[10px] text-sky-300">{SET_BY_ID[def.setId]?.icon} {SET_BY_ID[def.setId]?.name}</div>
                  )}
                  <div className="mt-0.5 text-[10px] text-slate-500">{SLOT_ICON[def.slot]} {SLOT_LABEL[def.slot]}</div>
                </button>
                {!worn && (
                  <button
                    onClick={() => salvage(g.uid)}
                    title={`Разобрать: +${SALVAGE_ORE[g.rarity]} руды`}
                    className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-400 transition hover:bg-red-900/50 hover:text-red-300"
                  >
                    ♻ +{SALVAGE_ORE[g.rarity]}
                  </button>
                )}
              </div>
              {worn && <div className="mt-1 text-[10px] font-bold text-sky-400">надет на отряд</div>}
            </div>
          );
        })}
        {items.list.length === 0 && (
          <div className="col-span-full rounded-xl border border-dashed border-slate-700 p-6 text-center text-sm text-slate-500">
            Ничего не найдено по фильтрам. Победы в боях и слияние пополнят коллекцию.
          </div>
        )}
      </div>

      {/* Шпаргалка по стоимости */}
      <div className="text-[11px] text-slate-500">
        Слияние (база): {RARITIES.slice(0, 4).map((r) => `${RARITY_LABEL[r]} ${CRAFT_COST_ORE[r]}⛏`).join(' · ')} · Разбор: {RARITIES.map((r) => `${SALVAGE_ORE[r]}⛏`).join('/')}
      </div>
      <div className="text-[11px] text-slate-600">
        {(Object.keys(STAT_ICON) as (keyof typeof STAT_ICON)[]).map((k) => `${STAT_ICON[k]}${k}`).join(' ')}
      </div>
    </div>
  );
}
