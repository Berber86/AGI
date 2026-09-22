import { useMemo, useState } from 'react';
import { GEAR_BY_ID, RARITY_LABEL, SLOT_ICON, SLOT_LABEL } from '@/data/gear';
import { RECRUIT_BY_ID, RECRUITS, PLAYER_RECRUIT_IDS } from '@/data/recruits';
import { SET_BY_ID } from '@/data/sets';
import { synergyHints, setTierStates } from '@/engine/unit/synergy';
import { computeUnit, describeAbility, gearInstanceStats } from '@/engine/unit/computeUnit';
import { collectModifiers } from '@/engine/economy/techTree';
import { GEAR_SLOTS, RARITIES, type ComputedUnit, type GearInstance, type GearSlot } from '@/engine/unit/unit.types';
import { useGameStore } from '@/store/useGameStore';
import { formatCost, formatStatDelta, formatStats, STAT_ICON } from '@/utils/format';

const LINES = ['Фронт', '2-я линия', '3-я линия', '4-я линия', 'Тыл'];
const PLAYER_RECRUITS = RECRUITS.filter((r) => (PLAYER_RECRUIT_IDS as readonly string[]).includes(r.id));

/** Сравнение статов собранного юнита с базой рекрута. */
function statDiffs(computed: ComputedUnit): string[] {
  const base = RECRUIT_BY_ID[computed.recruitId]!.base;
  return (Object.keys(STAT_ICON) as (keyof typeof STAT_ICON)[])
    .filter((k) => computed.stats[k] !== base[k])
    .map((k) => formatStatDelta(k, computed.stats[k] - base[k]));
}

export function ArmyBuilderPanel() {
  const d = useGameStore((s) => s.data);
  const mods = useMemo(() => collectModifiers(d.techs, d.buildings), [d.techs, d.buildings]);
  const hire = useGameStore((s) => s.hire);
  const disband = useGameStore((s) => s.disband);
  const rename = useGameStore((s) => s.renameSquad);
  const place = useGameStore((s) => s.placeSquad);
  const equip = useGameStore((s) => s.equip);
  const [pickerFor, setPickerFor] = useState<{ squadId: string; slot: GearSlot } | null>(null);

  const computed = d.squads.map((sq) => {
    if (!sq.recruitId) return null;
    const gear = Object.fromEntries(GEAR_SLOTS.map((slot) => [slot, d.collection.find((g) => g.uid === sq.gear[slot]) ?? null]));
    return computeUnit({ id: sq.id, name: sq.name, recruitId: sq.recruitId, gear, line: sq.line, column: sq.column }, { modifiers: mods });
  });

  const equippedUids = new Set(d.squads.flatMap((sq) => GEAR_SLOTS.map((s) => sq.gear[s])).filter(Boolean) as string[]);

  return (
    <div className="space-y-4">
      <div className="text-xs text-slate-500">
        Отряды: до 3. Линия определяет, кто вступает в бой первым; таргетинг зависит от типа рекрута и оружия.
      </div>

      {d.squads.map((sq, idx) => {
        const c = computed[idx];
        const recruit = sq.recruitId ? RECRUIT_BY_ID[sq.recruitId] : null;
        const available = PLAYER_RECRUITS.filter((r) => !r.unlockTech || d.techs.includes(r.unlockTech));
        return (
          <div key={sq.id} className="panel-brass rounded-xl p-3">
            {/* Заголовок отряда */}
            <div className="flex flex-wrap items-center gap-2">
              <input
                value={sq.name}
                onChange={(e) => rename(sq.id, e.target.value)}
                className="w-40 rounded bg-slate-900 px-2 py-1 text-sm font-bold text-slate-100 outline-none ring-amber-500/40 focus:ring-2"
              />
              {c && <span className={`rounded border px-1.5 text-[10px] rarity-${c.rarity} text-rarity-${c.rarity}`}>{RARITY_LABEL[c.rarity]}</span>}
              <div className="ml-auto flex items-center gap-1">
                <select
                  value={sq.line}
                  onChange={(e) => place(sq.id, Number(e.target.value), sq.column)}
                  className="rounded bg-slate-900 px-1 py-1 text-xs text-slate-200"
                  title="Линия построения"
                >
                  {LINES.map((label, i) => (
                    <option key={i} value={i}>{label}</option>
                  ))}
                </select>
                <select
                  value={sq.column}
                  onChange={(e) => place(sq.id, sq.line, Number(e.target.value))}
                  className="rounded bg-slate-900 px-1 py-1 text-xs text-slate-200"
                  title="Позиция в линии"
                >
                  {Array.from({ length: 10 }, (_, i) => (
                    <option key={i} value={i}>Кол. {i + 1}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Найм */}
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <select
                value={sq.recruitId ?? ''}
                onChange={(e) => {
                  if (e.target.value === '') disband(sq.id);
                  else hire(sq.id, e.target.value);
                }}
                className="rounded bg-slate-900 px-2 py-1.5 text-sm text-slate-200"
              >
                <option value="">— пусто —</option>
                {available.map((r) => (
                  <option key={r.id} value={r.id}>{r.icon} {r.name} ({formatCost(r.cost)})</option>
                ))}
              </select>
              {recruit && <span className="text-xs text-slate-400">{recruit.description}</span>}
            </div>

            {/* Слоты экипировки */}
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {GEAR_SLOTS.map((slot) => {
                const uid = sq.gear[slot];
                const item: GearInstance | undefined = uid ? d.collection.find((g) => g.uid === uid) : undefined;
                const def = item ? GEAR_BY_ID[item.defId] : undefined;
                return (
                  <button
                    key={slot}
                    onClick={() => setPickerFor({ squadId: sq.id, slot })}
                    className={`rounded-xl border-2 p-2 text-left transition hover:bg-slate-800/60 ${
                      item ? `rarity-${item.rarity} bg-slate-900` : 'border-dashed border-slate-700 bg-slate-950/60'
                    }`}
                    title="Выбрать предмет"
                  >
                    <div className="text-[10px] uppercase tracking-wide text-slate-500">{SLOT_ICON[slot]} {SLOT_LABEL[slot]}</div>
                    {def ? (
                      <>
                        <div className="truncate text-xs font-bold text-slate-100">{def.icon} {def.name}</div>
                        <div className={`text-[10px] text-rarity-${item!.rarity}`}>{RARITY_LABEL[item!.rarity]}</div>
                        <div className="text-[10px] text-emerald-300">{formatStats(gearInstanceStats(item!))}</div>
                      </>
                    ) : (
                      <div className="text-xs text-slate-600">пусто</div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Активные сеты и итоговые статы */}
            {c && (
              <div className="mt-3 rounded-lg bg-slate-950/60 p-2">
                <div className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Итоговые характеристики</div>
                <div className="mt-1 flex flex-wrap gap-1.5 text-[11px]">
                  {(Object.keys(STAT_ICON) as (keyof typeof STAT_ICON)[]).map((k) => (
                    <span key={k} className="rounded bg-slate-900 px-1.5 py-0.5 text-slate-200">
                      {STAT_ICON[k]} {c.stats[k]}
                    </span>
                  ))}
                </div>
                {(() => {
                  const diffs = statDiffs(c);
                  return diffs.length ? <div className="mt-1 text-[10px] text-emerald-300">от базы: {diffs.join(', ')}</div> : null;
                })()}
                {Object.keys(c.setCounts).length > 0 && (
                  <div className="mt-1 space-y-1">
                    {Object.entries(c.setCounts).map(([setId, n]) => {
                      const set = SET_BY_ID[setId];
                      if (!set) return null;
                      return (
                        <div key={setId} className="text-[10px]">
                          <span className="font-bold text-emerald-300">{set.icon} {set.name} {n}/4</span>
                          {setTierStates(setId, n).map((t) => (
                            <span key={t.pieces} className={`ml-2 ${t.active ? 'text-emerald-300' : 'text-slate-500'}`}>
                              {t.active ? '✓' : '○'}{t.pieces}: {t.text}
                            </span>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                )}
                {(() => {
                  const equippedDefs = GEAR_SLOTS
                    .map((s) => sq.gear[s])
                    .filter((uid): uid is string => !!uid)
                    .map((uid) => d.collection.find((g) => g.uid === uid))
                    .filter((g): g is GearInstance => !!g)
                    .map((g) => GEAR_BY_ID[g.defId])
                    .filter((def): def is NonNullable<typeof def> => !!def);
                  const wornEverywhere = new Set(d.squads.flatMap((s2) => GEAR_SLOTS.map((s3) => s2.gear[s3])).filter(Boolean) as string[]);
                  const stashDefs = d.collection
                    .filter((g) => !wornEverywhere.has(g.uid))
                    .map((g) => GEAR_BY_ID[g.defId])
                    .filter((def): def is NonNullable<typeof def> => !!def);
                  const hints = recruit ? synergyHints(equippedDefs, stashDefs, recruit.tags) : [];
                  if (hints.length === 0) return null;
                  return (
                    <div className="mt-1 rounded bg-slate-900/70 p-1.5">
                      <div className="text-[10px] font-bold uppercase tracking-wide text-amber-300/90">💡 Синергии</div>
                      {hints.slice(0, 3).map((h) => (
                        <div key={h.setId} className="text-[10px] text-slate-300">
                          {h.icon} {h.name}: <span className="font-bold text-slate-100">{h.have}/{h.nextPieces}</span> — {h.nextBonusText}
                          {h.availableInStash > 0 && <span className="text-sky-300"> · в коллекции: {h.availableInStash} шт.</span>}
                          {h.reason === 'archetype' && <span className="text-slate-500"> · подходит архетипу</span>}
                        </div>
                      ))}
                    </div>
                  );
                })()}
                {c.abilities.length > 0 && (
                  <div className="mt-1 space-y-0.5 text-[10px] text-amber-100/80">
                    {c.abilities.map((ab, i) => (
                      <div key={i}>✦ {describeAbility(ab)}</div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* Модалка выбора предмета */}
      {pickerFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setPickerFor(null)}>
          <div className="thin-scroll max-h-[70vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-amber-500/30 bg-slate-900 p-4" onClick={(e) => e.stopPropagation()}>
            <div className="mb-2 flex items-center justify-between">
              <span className="font-bold text-amber-200">Выбор: {SLOT_LABEL[pickerFor.slot]}</span>
              <button onClick={() => setPickerFor(null)} className="text-slate-400 hover:text-slate-200">✕</button>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <button
                onClick={() => {
                  equip(pickerFor.squadId, pickerFor.slot, null);
                  setPickerFor(null);
                }}
                className="rounded-lg border border-dashed border-slate-600 p-2 text-left text-xs text-slate-400 hover:bg-slate-800"
              >
                Снять предмет
              </button>
              {d.collection
                .filter((g) => GEAR_BY_ID[g.defId]?.slot === pickerFor.slot)
                .sort((a, b) => RARITIES.indexOf(b.rarity) - RARITIES.indexOf(a.rarity) || a.defId.localeCompare(b.defId))
                .map((g) => {
                  const def = GEAR_BY_ID[g.defId]!;
                  const wornBy = d.squads.find((sq) => GEAR_SLOTS.some((s) => sq.gear[s] === g.uid));
                  return (
                    <button
                      key={g.uid}
                      onClick={() => {
                        equip(pickerFor.squadId, pickerFor.slot, g.uid);
                        setPickerFor(null);
                      }}
                      className={`rounded-lg border-2 p-2 text-left transition hover:bg-slate-800 rarity-${g.rarity} bg-slate-950/70`}
                    >
                      <div className="flex items-center gap-1 text-xs font-bold text-slate-100">
                        {def.icon} {def.name}
                        <span className={`ml-auto text-[10px] text-rarity-${g.rarity}`}>{RARITY_LABEL[g.rarity]}</span>
                      </div>
                      <div className="text-[10px] text-emerald-300">{formatStats(gearInstanceStats(g))}</div>
                      {def.abilities && (
                        <div className="text-[10px] text-amber-100/70">{def.abilities.map((ab) => describeAbility(ab)).join(' ')}</div>
                      )}
                      {wornBy && <div className="text-[10px] text-sky-400">надет: {wornBy.name}</div>}
                      {equippedUids.has(g.uid) && !wornBy && null}
                    </button>
                  );
                })}
              {d.collection.filter((g) => GEAR_BY_ID[g.defId]?.slot === pickerFor.slot).length === 0 && (
                <div className="text-xs text-slate-500">Пусто. Загляните в Мастерскую или выиграйте бои.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
