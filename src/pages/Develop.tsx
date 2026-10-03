import { useEffect, useState } from "react";
import { Telescope, Hammer, Check, Lock, Sparkles, RefreshCw, Loader2, Landmark, ChevronRight, Trash2, Scroll, Anvil } from "lucide-react";
import { cn } from "@/utils/cn";
import { M } from "@/game/model";
import { llmDirectionPreviews, llmScienceOffers } from "@/game/cards";
import { useStore } from "@/game/store";
import { Btn, CATEGORY_META, Chip, Cost, Heading, Label, Meter, Panel, ResIcon, Tabs, fmt } from "@/components/ui";
import { PageFrame } from "@/components/Shell";

// Категории (включая религиозное) описаны один раз в ui.tsx — метки и цвета общие для всего интерфейса.
const CAT = CATEGORY_META;

function EffectChips({ effects }: { effects: any[] }) {
  return <div className="flex flex-wrap gap-1.5">{effects.map((e, i) => <Chip key={i} tone="bronze">{M.EFFECTS[e.type]?.label ?? e.type}</Chip>)}</div>;
}

/* ---------- Наука ---------- */

function Science() {
  const { game, act, commit, model, toast } = useStore();
  const p = game.player;
  const [loading, setLoading] = useState(false);
  const choices = p.scienceChoices;
  // Стадия чертежа: 1 — не изучен, 2 — изучен, но не построен, 3 — построен.
  const stage = (b: any) => (b.built ? 3 : b.researched ? 2 : 1);
  // Превью направлений и выбранное направление живут в состоянии: они переживают перезагрузку.
  const dirs: any[] = p.directionChoices?.directions || [];
  const chosenDirection: any = p.directionChoice || null;

  /** Шаг 1: советник придумывает, О ЧЁМ может быть наука этого народа. */
  const askDirections = async () => {
    setLoading(true);
    try {
      const previews = await llmDirectionPreviews(model, game);
      const next = M.setScienceDirections(M.clone(game), previews);
      if (next.error) throw new Error(next.error);
      commit(next.state, { silent: true });
      toast("Советник предложил три направления — выберите, о чём будет наука.", "ok");
    } catch (e: any) {
      toast(`Советник недоступен: ${e?.message}. Заготовок нет — попробуйте ещё раз.`, "bad");
    } finally {
      setLoading(false);
    }
  };

  /** Шаг 2: направление выбрано — приказ не тратится, он уйдёт на приём конкретного замысла. */
  const pickDirection = (index: number) => {
    const res = act((s: any) => M.chooseScienceDirection(s, index), { silent: true });
    if (res?.direction) toast(`Направление «${res.direction.title}» выбрано. Теперь советник придумает замыслы внутри него.`, "ok");
  };

  /** Шаг 3: три замысла внутри выбранного направления. */
  const generate = async () => {
    setLoading(true);
    try {
      const projects = await llmScienceOffers(model, game, chosenDirection || undefined);
      if (!projects.length) throw new Error("не пришло ни одного проекта");
      const next = M.clone(game);
      next.player.scienceChoices = { branchId: chosenDirection ? `direction:${chosenDirection.theme}` : "advisor", day: game.day, projects };
      commit(next, { silent: true });
      toast(chosenDirection ? `Три замысла внутри «${chosenDirection.title}».` : "Советник предложил три замысла под вашу ситуацию.", "ok");
    } catch (e: any) {
      toast(`Советник недоступен: ${e?.message}. Заготовок нет — попробуйте ещё раз.`, "bad");
    } finally {
      setLoading(false);
    }
  };

  // Приём замысла — это и есть приказ «Исследование»: он тратит день и AP.
  const choose = (idx: number) => {
    const res = act((s: any) => M.acceptScienceProject(s, idx), { silent: true });
    if (!res) return;
    toast(`«${res.blueprint.scienceName}» в кодексе. Приказ «Исследование» потрачен — изучить её можно завтра.`, "ok");
  };

  // order_capacity от построек советника может поднять дневной лимит приказа с 1 до 2 —
  // "потрачен" наступает только когда счётчик достиг лимита, а не после первого же раза.
  const researchOrderCap = M.getOrderCapacity(game);
  const researchOrderUsed = (p.dailyOrders?.researchUsed || 0) >= researchOrderCap;
  const orderBlock = researchOrderUsed
    ? "Приказ «Исследование» уже потрачен сегодня."
    : p.ap <= 0
      ? "AP на сегодня исчерпаны."
      : null;

  const bps: any[] = p.blueprints;
  const sorted = [...bps].sort((a, b) => stage(a) - stage(b));

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
      <div className="space-y-4">
        <Panel className="p-5">
          <Heading title="Научный советник" eyebrow="О чём будет наука" className="[&_h2]:text-lg" />
          <p className="mt-1 text-[13px] leading-relaxed text-dim">
            Сначала вы выбираете направление: советник читает замысел народа, происхождение, землю, черту, наследие, запасы и эпоху и придумывает три превью — земледелие, ремесло, война, вера, знание, устройство общества и их сочетания. Готовых наук и ветвей в игре нет.
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {(M.SCIENCE_DIRECTION_THEMES || []).map((t: any) => <Chip key={t.id}>{t.icon} {t.label}</Chip>)}
          </div>
          {dirs.length === 0 && !chosenDirection && (
            <Btn variant="primary" className="mt-4 w-full" size="lg" onClick={askDirections} disabled={loading || bps.length >= 30}>
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={16} />}
              {loading ? "Советник думает…" : "Спросить о направлениях"}
            </Btn>
          )}
          {dirs.length > 0 && !chosenDirection && (
            <div className="mt-4 space-y-2.5">
              {dirs.map((d: any, i: number) => (
                <div key={d.id} className="rounded-xl border border-line bg-raised/50 p-3.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-lg leading-none">{d.icon}</span>
                        <span className="font-display text-[15px] font-semibold">{d.title}</span>
                        <Chip tone={CAT[d.category]?.tone}>{CAT[d.category]?.label ?? d.category}</Chip>
                        <Chip>{d.themeLabel}</Chip>
                      </div>
                      <p className="mt-1.5 text-[13px] leading-snug text-dim">{d.summary}</p>
                      <div className="mt-2"><EffectChips effects={d.effects} /></div>
                      {d.rationale && <p className="mt-1.5 text-xs italic leading-relaxed text-faint">{d.rationale}</p>}
                    </div>
                    <Btn size="sm" variant="primary" className="shrink-0" disabled={loading} onClick={() => pickDirection(i)}>Выбрать</Btn>
                  </div>
                </div>
              ))}
              <Btn variant="secondary" className="w-full" onClick={askDirections} disabled={loading}>
                {loading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}Другие направления
              </Btn>
            </div>
          )}
          {chosenDirection && (
            <div className="mt-4 space-y-3">
              <div className="rounded-xl border border-faith/40 bg-faith/8 p-3.5">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-lg leading-none">{chosenDirection.icon}</span>
                  <span className="font-display text-[15px] font-semibold">{chosenDirection.title}</span>
                  <Chip tone={CAT[chosenDirection.category]?.tone}>{CAT[chosenDirection.category]?.label ?? chosenDirection.category}</Chip>
                  <Chip>{chosenDirection.themeLabel}</Chip>
                </div>
                <p className="mt-1.5 text-[13px] leading-snug text-dim">{chosenDirection.summary}</p>
              </div>
              <Btn variant="primary" className="w-full" size="lg" onClick={generate} disabled={loading || bps.length >= 30}>
                {loading ? <Loader2 size={18} className="animate-spin" /> : choices ? <RefreshCw size={16} /> : <Sparkles size={16} />}
                {loading ? "Советник думает…" : choices ? "Другие замыслы в этом направлении" : "Придумать замыслы в этом направлении"}
              </Btn>
              <Btn variant="ghost" className="w-full" onClick={askDirections} disabled={loading}>
                <RefreshCw size={16} />Сменить направление
              </Btn>
            </div>
          )}
        </Panel>

        {(p.pendingDecreeChoice || p.pendingCultureChoice) && (
          <Panel className="border-bronze/40 bg-bronze/8 p-4">
            <div className="flex items-center gap-3"><Landmark className="text-bronze" /><div className="flex-1 text-sm"><b>Новая эпоха «{M.eraName(p.era)}»!</b> Выберите уклад во вкладке «Уклады»{p.pendingCultureChoice ? " и наследие во вкладке «Наследие»" : ""}.</div></div>
          </Panel>
        )}
      </div>

      <div className="space-y-4">
        {choices && (
          <Panel className="animate-rise border-bronze/30 p-5">
            <Heading title="Выберите один путь" eyebrow="Советник прочитал вашу ситуацию" className="[&_h2]:text-lg" />
            <p className="mt-2 text-[12.5px] leading-relaxed text-dim">
              Приём замысла — это дневной приказ «Исследование»: он тратит 1 приказ и AP. Остальные замыслы останутся здесь и на следующие дни.
            </p>
            <div className="mt-4 grid gap-3">
              {choices.projects.map((pr: any, i: number) => (
                <div key={i} className="rounded-xl border border-line bg-raised/50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-display text-base font-semibold">{pr.scienceName}</div>
                      <p className="mt-1 text-[13px] leading-snug text-dim">{pr.scienceDescription}</p>
                      <div className="mt-2 flex items-center gap-1.5 text-xs text-faint"><Hammer size={12} />Здание: <span className="text-parch">{pr.buildingName}</span></div>
                      <div className="mt-2"><EffectChips effects={pr.effects} /></div>
                      {pr.rationale && <p className="mt-2 text-xs italic leading-relaxed text-faint">{pr.rationale}</p>}
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1.5">
                      <Btn size="sm" variant="primary" disabled={!!orderBlock} title={orderBlock || ""} onClick={() => choose(i)}>Выбрать</Btn>
                      {orderBlock && <span className="max-w-[190px] text-right text-[10.5px] leading-snug text-faint">{orderBlock}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        )}

        <Panel className="p-5">
          <Heading title="Кодекс проектов" eyebrow={`${bps.length} из 30`} className="[&_h2]:text-lg" />
          {sorted.length === 0 ? (
            <p className="mt-4 text-sm text-dim">Кодекс пуст. Спросите советника слева — он придумает проекты под вашу затравку.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {sorted.map((b) => {
                const s = stage(b);
                const rErr = !b.researched ? M.researchBlueprint(M.clone(game), b.id).error : null;
                const cErr = b.researched && !b.built ? M.constructBlueprint(M.clone(game), b.id).error : null;
                return (
                  <li key={b.id} className={cn("rounded-xl border p-4", s === 3 ? "border-line bg-ground/40" : "border-line-strong bg-raised/40")}>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-display text-base font-semibold">{b.scienceName}</span>
                          {b.openingProject && <Chip tone="bronze">Первое дело</Chip>}
                        </div>
                        <p className="mt-1 text-[13px] leading-snug text-dim">{b.scienceDescription}</p>
                        {/* Направление, из которого вырос замысел: видно, что наука продолжает выбор игрока. */}
                        {b.direction && (
                          <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11.5px] text-faint">
                            <span>{b.direction.icon}</span><span>Из направления «{b.direction.title}»</span>
                            <Chip>{b.direction.themeLabel}</Chip>
                          </div>
                        )}
                        <div className="mt-2 flex flex-wrap items-center gap-2"><EffectChips effects={b.effects} /></div>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-line pt-3">
                      <Step done={s >= 2} active={s === 1} icon={<Telescope size={14} />} label="Изучить" />
                      <ChevronRight size={14} className="text-faint" />
                      <Step done={s >= 3} active={s === 2} icon={<Hammer size={14} />} label={b.buildingName} />
                      <div className="ml-auto flex items-center gap-2">
                        {s === 1 && (<><Cost cost={{ food: 1, knowledge: 1 }} have={p.resources} />
                          <Btn size="sm" variant="primary" disabled={!!rErr} title={rErr || ""} onClick={() => act((st) => M.researchBlueprint(st, b.id))}>Изучить</Btn></>)}
                        {s === 2 && (<><Cost cost={{ materials: 3 }} have={p.resources} />
                          <Btn size="sm" variant="primary" disabled={!!cErr} title={cErr || ""} onClick={() => act((st) => M.constructBlueprint(st, b.id))}>Построить</Btn></>)}
                        {s === 3 && <Chip tone="ok"><Check size={11} />Построено</Chip>}
                        {s === 1 && !b.openingProject && (
                          <Btn size="sm" variant="ghost" title="Убрать проект из кодекса" onClick={() => {
                            const res = act((st: any) => M.removeBlueprint(st, b.id));
                            if (res) toast(`«${b.scienceName}» убрано из кодекса.`, "info");
                          }}>
                            <Trash2 size={14} />
                          </Btn>
                        )}
                      </div>
                    </div>
                    {(rErr && s === 1) || (cErr && s === 2) ? <p className="mt-2 text-xs text-faint">{s === 1 ? rErr : cErr}</p> : null}
                  </li>
                );
              })}
            </ul>
          )}
        </Panel>
      </div>
    </div>
  );
}

function Step({ done, active, icon, label }: { done: boolean; active: boolean; icon: React.ReactNode; label: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11.5px] font-medium", done ? "border-ok/40 bg-ok/10 text-ok" : active ? "border-bronze/50 bg-bronze/10 text-bronze-soft" : "border-line text-faint")}>
      {done ? <Check size={12} /> : icon}<span className="max-w-[180px] truncate">{label}</span>
    </span>
  );
}

/* ---------- Постройки ---------- */

function Buildings() {
  const { game, act, go } = useStore();
  const p = game.player;
  const active = p.buildings.filter((b: any) => b.active).length;
  const totals = M.effectTotals(game);
  const active_effects = Object.entries(totals).filter(([, v]) => (v as number) > 0);
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
      <Panel className="p-5">
        <Heading title="Здания поселения" eyebrow={`Активно ${active} из ${p.activeBuildingSlots} слотов`} className="[&_h2]:text-lg" />
        <p className="mt-1 text-[13px] text-dim">Работают только здания в активных слотах. Каждое здание стоит 0.1 материала в день.</p>
        <ul className="mt-4 space-y-2.5">
          {p.buildings.map((b: any) => (
            <li key={b.id} className={cn("flex items-start gap-3 rounded-xl border p-4", b.active ? "border-line-strong bg-raised/50" : "border-line bg-ground/40")}>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2"><span className="font-display text-base font-semibold">{b.name}</span><Chip tone={CAT[b.category]?.tone}>{CAT[b.category]?.label}</Chip></div>
                <p className="mt-1 text-[13px] leading-snug text-dim">{b.description}</p>
                <div className="mt-2"><EffectChips effects={b.effects} /></div>
              </div>
              <button
                role="switch" aria-checked={b.active} aria-label={b.active ? "Отключить здание" : "Включить здание"} onClick={() => act((s) => M.toggleBuilding(s, b.id), { silent: true })}
                className={cn("relative mt-1 h-6 w-11 shrink-0 rounded-full transition-colors", b.active ? "bg-bronze" : "bg-line-strong")}
              >
                <span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-parch transition-all", b.active ? "left-[22px]" : "left-0.5")} />
              </button>
            </li>
          ))}
        </ul>
      </Panel>
      <div className="space-y-4">
        <Panel className="p-5">
          <Label>Что дают здания сейчас</Label>
          {active_effects.length === 0 ? <p className="mt-3 text-sm text-dim">Нет активных бонусов.</p> : (
            <ul className="mt-3 space-y-1.5 text-sm">
              {active_effects.map(([k, v]) => <li key={k} className="flex items-center justify-between"><span className="text-dim">{M.EFFECTS[k]?.label}</span><span className="font-semibold">×{v as number}</span></li>)}
            </ul>
          )}
        </Panel>
        <Panel className="p-5">
          <Label>Здания в землях</Label>
          <p className="mt-2 text-[13px] text-dim">Постройки в регионах (рудники, оазисы, обсерватории) возводятся на карте и не занимают слотов.</p>
          <Btn variant="secondary" className="mt-3 w-full" onClick={() => go("map")}>Открыть карту</Btn>
        </Panel>
      </div>
    </div>
  );
}

/* ---------- Уклады ---------- */

function Decrees() {
  const { game, act, toast } = useStore();
  const p = game.player;
  const chosen: any[] = p.decrees;
  return (
    <div>
      {p.pendingDecreeChoice ? (
        <Panel className="mb-4 border-bronze/40 bg-bronze/8 p-4"><div className="flex items-center gap-3 text-sm"><Landmark className="text-bronze" /><span><b>Эпоха «{M.eraName(p.era)}».</b> Выберите уклад — он определит производство, склад и размер армии.{p.pendingCultureChoice ? " Наследие эпохи выбирается отдельно на вкладке «Наследие»." : ""}</span></div></Panel>
      ) : (
        <p className="mb-4 text-sm text-dim">Уклад выбирается при переходе в новую эпоху. Следующий выбор откроется, когда вы изучите ещё несколько наук.</p>
      )}
      <div className="grid gap-4 md:grid-cols-3">
        {Object.values(M.DECREES).map((d: any) => {
          const times = chosen.filter((c) => c.id === d.id).length;
          return (
            <Panel key={d.id} className={cn("flex flex-col p-5", p.pendingDecreeChoice && "border-line-strong")}>
              <div className="flex items-center gap-3"><span className="grid h-12 w-12 place-items-center rounded-xl bg-ground text-2xl">{d.icon}</span><div><h3 className="font-display text-lg font-semibold leading-tight">{d.label}</h3>{times > 0 && <Chip tone="ok" className="mt-1">принят ×{times}</Chip>}</div></div>
              <p className="mt-3 flex-1 text-[13.5px] leading-relaxed text-dim">{d.description}</p>
              <Btn className="mt-4" variant={p.pendingDecreeChoice ? "primary" : "secondary"} disabled={!p.pendingDecreeChoice}
                onClick={() => { if (act((s) => M.chooseDecree(s, d.id), { silent: true })) toast(`Принят уклад: ${d.label}.`, "ok"); }}>
                {p.pendingDecreeChoice ? "Принять уклад" : times ? "Уже принят" : <><Lock size={14} />Ждёт новой эпохи</>}
              </Btn>
            </Panel>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- Наследие эпохи ---------- */

/** Бонусы культур формулирует модель — одна формулировка на все экраны (онбординг, модалка перехода, вкладка). */
function bonusOf(culture: any): string {
  return M.describeCultureBonus(culture);
}

/**
 * Наследие и технологии эпохи. При переходе эпохи игрок сам решает, принять культуру новой эпохи
 * или сохранить прежнее наследие; технологии эпохи (науки, ключевой ресурс, эпохи карт) доступны
 * в обоих случаях — они зависят от player.era, а не от культуры.
 */
function Heritage({ onGoto }: { onGoto: (tab: "decrees") => void }) {
  const { game, act, toast } = useStore();
  const p = game.player;
  const choice: any = M.getCultureChoice(game);
  const eraRecord: any = M.ERA_HISTORICAL?.[p.era];
  const lineage = (p.culturalLineage || []).map((id: string) => M.HISTORICAL_CULTURES.find((c: any) => c.id === id)).filter(Boolean);

  const decide = (id: string) => {
    const res = act((s) => M.chooseCulture(s, id), { silent: true });
    if (res && !res.error) toast(id === "keep" ? `Наследие сохранено: ${p.historicalCulture?.name || "прежнее"}. Технологии эпохи уже ваши.` : `Принято наследие: ${M.HISTORICAL_CULTURES.find((c: any) => c.id === id)?.name}.`, "ok");
  };

  return (
    <div className="space-y-4">
      {p.pendingDecreeChoice && (
        <Panel className="border-bronze/40 bg-bronze/8 p-4">
          <div className="flex items-center gap-3 text-sm"><Landmark className="text-bronze" /><span className="flex-1">Уклад новой эпохи ещё не выбран.</span><Btn variant="secondary" size="sm" onClick={() => onGoto("decrees")}>К укладам</Btn></div>
        </Panel>
      )}

      {choice ? (
        <Panel className="border-bronze/40 p-5">
          <Heading title={`Эпоха «${choice.eraLabel}»: выберите наследие`} eyebrow="Переход эпохи" className="[&_h2]:text-xl" />
          <p className="mt-2 text-[13.5px] leading-relaxed text-dim">{choice.eraDescription}</p>
          {choice.eraTechnologies.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">{choice.eraTechnologies.map((t: string) => <Chip key={t} tone="bronze"><Anvil size={11} />{t}</Chip>)}</div>
          )}
          <p className="mt-3 text-[13px] leading-relaxed text-dim">
            Технологии эпохи уже доступны в любом случае: науки, ключевой ресурс эпохи и ковка карт зависят от эпохи, а не от наследия. Выбираете только то, чьи обычаи и бонусы несёт народ.
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="flex flex-col rounded-xl border border-line-strong bg-raised/50 p-4">
              <div className="flex items-center gap-3"><span className="grid h-12 w-12 place-items-center rounded-xl bg-ground text-2xl">{p.historicalCulture?.icon || "🏺"}</span>
                <div><h3 className="font-display text-lg font-semibold leading-tight">Сохранить прежнее наследие</h3><Chip tone="ok" className="mt-1">{p.historicalCulture?.name || "прежний народ"}</Chip></div></div>
              <p className="mt-3 flex-1 text-[13.5px] leading-relaxed text-dim">{p.historicalCulture?.desc || "Народ остаётся при своих обычаях."}</p>
              <div className="mt-2 text-xs text-faint">{bonusOf(p.historicalCulture)}</div>
              <Btn className="mt-4" variant="primary" onClick={() => decide("keep")}>Оставить прошлое наследие</Btn>
            </div>
            {choice.candidates.map((c: any) => (
              <div key={c.id} className="flex flex-col rounded-xl border border-line bg-raised/40 p-4">
                <div className="flex items-center gap-3"><span className="grid h-12 w-12 place-items-center rounded-xl bg-ground text-2xl">{c.icon}</span>
                  <div><h3 className="font-display text-lg font-semibold leading-tight">{c.name}</h3><Chip tone="bronze" className="mt-1">наследие эпохи</Chip></div></div>
                <p className="mt-3 flex-1 text-[13.5px] leading-relaxed text-dim">{c.desc}</p>
                <div className="mt-2 text-xs text-faint">{bonusOf(c)}</div>
                <Btn className="mt-4" variant="secondary" onClick={() => decide(c.id)}>Принять это наследие</Btn>
              </div>
            ))}
          </div>
        </Panel>
      ) : (
        <Panel className="p-5">
          <Heading title="Наследие народа" eyebrow={`Эпоха «${M.eraName(p.era)}»`} className="[&_h2]:text-xl" />
          <p className="mt-2 text-[13.5px] leading-relaxed text-dim">{eraRecord?.desc || ""}</p>
          {eraRecord?.tech?.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">{eraRecord.tech.map((t: string) => <Chip key={t} tone="bronze"><Anvil size={11} />{t}</Chip>)}</div>
          )}
          {p.historicalCulture && (
            <div className="mt-4 flex items-start gap-3 rounded-xl border border-line-strong bg-raised/50 p-4">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-ground text-2xl">{p.historicalCulture.icon}</span>
              <div className="min-w-0"><h3 className="font-display text-lg font-semibold leading-tight">{p.historicalCulture.name}</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-dim">{p.historicalCulture.desc}</p>
                <div className="mt-2 text-xs text-faint">{bonusOf(p.historicalCulture)}</div></div>
            </div>
          )}
          <p className="mt-4 text-sm text-dim">Выбор наследия откроется при переходе в новую эпоху: можно принять культуру того времени или сохранить прежнее наследие, переняв только технологии.</p>
        </Panel>
      )}

      <Panel className="p-5">
        <div className="flex items-center gap-2"><Scroll size={15} className="text-bronze" /><Label>Линия наследия</Label></div>
        {lineage.length === 0 ? <p className="mt-3 text-sm text-dim">Линия пока пуста.</p> : (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {lineage.map((c: any, i: number) => (
              <span key={c.id} className="flex items-center gap-2">
                {i > 0 && <ChevronRight size={13} className="text-faint" />}
                <span title={c.desc}><Chip tone={c.id === p.historicalCulture?.id ? "bronze" : undefined}>{c.icon} {c.name}</Chip></span>
              </span>
            ))}
          </div>
        )}
        {eraRecord?.cultures?.length > 0 && (
          <p className="mt-4 text-[13px] leading-relaxed text-faint">Культуры эпохи: {eraRecord.cultures.join(" · ")}</p>
        )}
      </Panel>
    </div>
  );
}

/**
 * Просветление эпохи: 2·📚 + 1·🙏 против порога эпохи (36 + 8·era). Показывается на всех вкладках
 * развития, чтобы игрок видел, чего не хватает до следующей эпохи и почему науки её больше не двигают.
 * Порог лежит выше любого стартового запаса, а первый день закрыт: эпоху даёт накопленное трудом.
 */
function EraProgress() {
  const { game } = useStore();
  const prog: any = M.getEraProgress(game);
  if (prog.finalEra) return null;
  return (
    <Panel className={cn("mb-5 p-4", prog.ready && "border-bronze/50 bg-bronze/8")}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-bronze/12 text-bronze"><Telescope size={17} /></span>
          <div>
            <Label>Просветление эпохи · {prog.formula}</Label>
            <div className="text-sm font-semibold text-parch">
              {fmt(prog.score, 1)} из {prog.threshold} до эпохи «{prog.nextEraLabel}»
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 text-[11.5px] text-faint">
          <span className="inline-flex items-center gap-1"><ResIcon k="knowledge" size={13} />{fmt(prog.knowledge, 1)} × 2</span>
          <span className="inline-flex items-center gap-1"><ResIcon k="faith" size={13} />{fmt(prog.faith, 1)} × 1</span>
        </div>
      </div>
      <Meter value={prog.score} max={prog.threshold} className="mt-3" />
      <p className="mt-2 text-[11.5px] leading-relaxed text-faint">
        {prog.ready
          ? "Порог взят: эпоха сменится в конце этого дня. Половина 📚 и 🙏 сгорит в переходе — откроются уклад и выбор наследия."
          : prog.dayBlocked
            ? `День основания: эпоха не открывается в первый день ни при каком запасе. Самый ранний переход — конец ${prog.minDay}-го дня: сажайте кланы на книги и молитвы.`
            : `Не хватает ${fmt(prog.remaining, 1)} очков: жрецы дают 🙏, книжники и святилища — 📚. Эпоха наступит сама в конце дня.`}
      </p>
    </Panel>
  );
}

export default function Develop() {
  const { game } = useStore();
  const [tab, setTab] = useState<"science" | "buildings" | "decrees" | "heritage">(
    game.player.pendingDecreeChoice ? "decrees" : game.player.pendingCultureChoice ? "heritage" : "science",
  );
  const p = game.player;
  // Выбор мог открыться, пока игрок стоял на другой вкладке — переводим на него сразу.
  useEffect(() => {
    if (p.pendingDecreeChoice) setTab("decrees");
    else if (p.pendingCultureChoice) setTab("heritage");
  }, [p.pendingDecreeChoice, p.pendingCultureChoice]);
  return (
    <PageFrame wide>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Label>Развитие цивилизации</Label>
          <h1 className="font-display mt-1 text-3xl font-semibold sm:text-4xl">Наука, здания, уклады</h1>
          <p className="mt-1 max-w-xl text-sm text-dim">Науки дают здания и эффекты; эпоху открывает просветление народа — 2·📚 + 1·🙏. Исследование, строительство, поход и миссия — по одному приказу в день.</p>
        </div>
        <Tabs value={tab} onChange={setTab} items={[
          { id: "science", label: "Наука" },
          { id: "buildings", label: "Здания" },
          { id: "decrees", label: "Уклады", badge: p.pendingDecreeChoice ? <span className="h-2 w-2 rounded-full bg-bronze" /> : undefined },
          { id: "heritage", label: "Наследие", badge: p.pendingCultureChoice ? <span className="h-2 w-2 rounded-full bg-bronze" /> : undefined },
        ]} />
      </div>
      <EraProgress />
      {tab === "science" && <Science />}
      {tab === "buildings" && <Buildings />}
      {tab === "decrees" && <Decrees />}
      {tab === "heritage" && <Heritage onGoto={setTab} />}
    </PageFrame>
  );
}
