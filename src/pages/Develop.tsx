import { useState } from "react";
import { Telescope, Hammer, Check, Lock, Sparkles, RefreshCw, Loader2, Landmark, ChevronRight } from "lucide-react";
import { cn } from "@/utils/cn";
import { M } from "@/game/model";
import { llmScience } from "@/game/cards";
import { useStore } from "@/game/store";
import { Btn, Chip, Cost, Heading, Label, Panel, Tabs } from "@/components/ui";
import { PageFrame } from "@/components/Shell";

const CAT: Record<string, { label: string; tone: "bad" | "ok" | "know" | "bronze" }> = {
  military: { label: "Военное", tone: "bad" },
  economy: { label: "Экономика", tone: "ok" },
  science: { label: "Наука", tone: "know" },
  civic: { label: "Общество", tone: "bronze" },
};

function EffectChips({ effects }: { effects: any[] }) {
  return <div className="flex flex-wrap gap-1.5">{effects.map((e, i) => <Chip key={i} tone="bronze">{M.EFFECTS[e.type]?.label ?? e.type}</Chip>)}</div>;
}

/* ---------- Наука ---------- */

function Science() {
  const { game, act, commit, apiKey, model, toast } = useStore();
  const p = game.player;
  const branches: any[] = M.scienceBranchesForEra(p.era);
  const [branchId, setBranchId] = useState<string>(branches[0]?.id);
  const [loading, setLoading] = useState(false);
  const [nonce, setNonce] = useState(0);
  const choices = p.scienceChoices;

  const generate = async () => {
    const branch = branches.find((b) => b.id === branchId);
    if (!branch) return;
    setLoading(true);
    let projects: any[] = [];
    let usedLlm = false;
    try {
      if (!apiKey) throw new Error("no-key");
      projects = await llmScience(apiKey, model, game, branch);
      usedLlm = projects.length > 0;
    } catch (e: any) {
      if (e?.message !== "no-key") toast(`ИИ недоступен (${e?.message}). Использованы местные пулы.`, "info");
    }
    if (!projects.length) projects = M.generateLocalScienceVariants(branchId, M.hashString(p.name + p.clan + branchId + game.day + ":" + nonce + Date.now()), 3);
    const cleaned = projects.map((raw) => ({
      scienceName: String(raw.scienceName || "").slice(0, 80),
      scienceDescription: String(raw.scienceDescription || "").slice(0, 400),
      buildingName: String(raw.buildingName || "").slice(0, 80),
      buildingDescription: String(raw.buildingDescription || "").slice(0, 400),
      category: M.CATEGORIES.includes(raw.category) ? raw.category : branch.category,
      effects: M.cleanEffects(raw.effects) || [{ type: branch.effect, amount: 1 }],
    })).filter((x) => x.scienceName && x.buildingName).slice(0, 3);
    setLoading(false);
    if (!cleaned.length) { toast("Советник не смог придумать проекты — попробуйте ещё раз.", "bad"); return; }
    const next = M.clone(game);
    next.player.scienceChoices = { branchId, day: game.day, projects: cleaned };
    commit(next, { silent: true });
    setNonce((n) => n + 1);
    if (usedLlm) toast("Советник предложил три уникальных замысла.", "ok");
  };

  const choose = (idx: number) => {
    const raw = choices.projects[idx];
    const res = M.addBlueprint(M.clone(game), raw, "both");
    if (res.error) { toast(res.error, "bad"); return; }
    const entry = M.generateChronicleEntry(res.state, choices.branchId, raw.scienceName);
    res.state.player.chronicle = [...(res.state.player.chronicle || []), { day: res.state.day, era: res.state.player.era, text: entry }].slice(-20);
    res.state.player.scienceChoices = null;
    commit(res.state, { silent: true });
    toast(`«${raw.scienceName}» добавлено в кодекс. Теперь его можно изучить.`, "ok");
  };

  const research = (id: string, onEra?: () => void) => {
    const oldEra = p.era;
    const res = act((s) => M.researchBlueprint(s, id));
    if (res && res.state.player.era > oldEra) onEra?.();
  };

  const bps: any[] = p.blueprints;
  const stage = (b: any) => (b.built ? 3 : b.researched ? 2 : 1);
  const sorted = [...bps].sort((a, b) => stage(a) - stage(b));

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
      <div className="space-y-4">
        <Panel className="p-5">
          <Heading title="Научный советник" eyebrow="Новые замыслы" className="[&_h2]:text-lg" />
          <p className="mt-1 text-[13px] text-dim">Выберите широкое направление — советник предложит три конкретных пути с учётом ваших земель и запасов.</p>
          <div className="mt-4 grid gap-2">
            {branches.map((b) => (
              <button key={b.id} onClick={() => setBranchId(b.id)} className={cn("flex items-center gap-3 rounded-xl border px-3.5 py-2.5 text-left transition-colors", branchId === b.id ? "border-bronze bg-raised" : "border-line hover:bg-raised/60")}>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium">{b.label}</span>
                  <span className="block truncate text-xs text-faint">{M.EFFECTS[b.effect]?.label}</span>
                </span>
                <Chip tone={CAT[b.category]?.tone}>{CAT[b.category]?.label}</Chip>
              </button>
            ))}
          </div>
          <Btn variant="primary" className="mt-4 w-full" onClick={generate} disabled={loading || bps.length >= 30}>
            {loading ? <Loader2 size={16} className="animate-spin" /> : choices ? <RefreshCw size={16} /> : <Sparkles size={16} />}
            {loading ? "Советник думает…" : choices ? "Предложить другие замыслы" : "Получить три замысла"}
          </Btn>
          {!apiKey && <p className="mt-2 text-[11.5px] text-faint">Без API-ключа замыслы составляются из местных пулов — у каждого народа они свои.</p>}
        </Panel>

        {p.pendingDecreeChoice && (
          <Panel className="border-bronze/40 bg-bronze/8 p-4">
            <div className="flex items-center gap-3"><Landmark className="text-bronze" /><div className="flex-1 text-sm"><b>Новая эпоха!</b> Выберите уклад во вкладке «Уклады».</div></div>
          </Panel>
        )}
      </div>

      <div className="space-y-4">
        {choices && (
          <Panel className="animate-rise border-bronze/30 p-5">
            <Heading title="Выберите один путь" eyebrow={`Направление: ${branches.find((b) => b.id === choices.branchId)?.label ?? ""}`} className="[&_h2]:text-lg" />
            <div className="mt-4 grid gap-3">
              {choices.projects.map((pr: any, i: number) => (
                <div key={i} className="rounded-xl border border-line bg-raised/50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-display text-base font-semibold">{pr.scienceName}</div>
                      <p className="mt-1 text-[13px] leading-snug text-dim">{pr.scienceDescription}</p>
                      <div className="mt-2 flex items-center gap-1.5 text-xs text-faint"><Hammer size={12} />Здание: <span className="text-parch">{pr.buildingName}</span></div>
                      <div className="mt-2"><EffectChips effects={pr.effects} /></div>
                    </div>
                    <Btn size="sm" variant="primary" onClick={() => choose(i)}>Выбрать</Btn>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        )}

        <Panel className="p-5">
          <Heading title="Кодекс проектов" eyebrow={`${bps.length} из 30`} className="[&_h2]:text-lg" />
          {sorted.length === 0 ? (
            <p className="mt-4 text-sm text-dim">Кодекс пуст. Получите замыслы у советника слева.</p>
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
                        <div className="mt-2 flex flex-wrap items-center gap-2"><EffectChips effects={b.effects} /></div>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-line pt-3">
                      <Step done={s >= 2} active={s === 1} icon={<Telescope size={14} />} label="Изучить" />
                      <ChevronRight size={14} className="text-faint" />
                      <Step done={s >= 3} active={s === 2} icon={<Hammer size={14} />} label={b.buildingName} />
                      <div className="ml-auto flex items-center gap-2">
                        {s === 1 && (<><Cost cost={{ food: 1, knowledge: 1 }} have={p.resources} />
                          <Btn size="sm" variant="primary" disabled={!!rErr} title={rErr || ""} onClick={() => research(b.id, () => toast("Новая эпоха! Выберите уклад.", "ok"))}>Изучить</Btn></>)}
                        {s === 2 && (<><Cost cost={{ materials: 3 }} have={p.resources} />
                          <Btn size="sm" variant="primary" disabled={!!cErr} title={cErr || ""} onClick={() => act((st) => M.constructBlueprint(st, b.id))}>Построить</Btn></>)}
                        {s === 3 && <Chip tone="ok"><Check size={11} />Построено</Chip>}
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
        <Panel className="mb-4 border-bronze/40 bg-bronze/8 p-4"><div className="flex items-center gap-3 text-sm"><Landmark className="text-bronze" /><span><b>Эпоха «{M.eraName(p.era)}».</b> Выберите уклад — он определит производство, склад и размер армии.</span></div></Panel>
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

export default function Develop() {
  const { game } = useStore();
  const [tab, setTab] = useState<"science" | "buildings" | "decrees">(game.player.pendingDecreeChoice ? "decrees" : "science");
  const p = game.player;
  return (
    <PageFrame wide>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Label>Развитие цивилизации</Label>
          <h1 className="font-display mt-1 text-3xl font-semibold sm:text-4xl">Наука, здания, уклады</h1>
          <p className="mt-1 max-w-xl text-sm text-dim">Каждые две науки открывают новую эпоху. Исследование и строительство — по одному приказу в день.</p>
        </div>
        <Tabs value={tab} onChange={setTab} items={[
          { id: "science", label: "Наука" },
          { id: "buildings", label: "Здания" },
          { id: "decrees", label: "Уклады", badge: p.pendingDecreeChoice ? <span className="h-2 w-2 rounded-full bg-bronze" /> : undefined },
        ]} />
      </div>
      {tab === "science" && <Science />}
      {tab === "buildings" && <Buildings />}
      {tab === "decrees" && <Decrees />}
    </PageFrame>
  );
}
