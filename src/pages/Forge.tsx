import { useEffect, useRef, useState } from "react";
import { Anvil, Sparkles, Loader2, Lock, Check, Clock, Hourglass, Gift } from "lucide-react";
import { cn } from "@/utils/cn";
import { M } from "@/game/model";
import { CARD_TYPE_INFO, RARITY_INFO, llmAdvice, llmCard, type Advice, type Card, type Rarity } from "@/game/cards";
import { useStore } from "@/game/store";
import { Btn, Chip, Cost, Heading, Label, Meter, Modal, Panel } from "@/components/ui";
import { CardFace } from "@/components/CardView";
import { PageFrame } from "@/components/Shell";

const ADV_KEY = "iforge_advice_v3";

function readAdvice(season: number, day: number): Advice[] | null {
  try {
    const raw = JSON.parse(localStorage.getItem(ADV_KEY) || "null");
    if (raw && raw.season === season && raw.day === day && Array.isArray(raw.advice) && raw.advice.length === 3) return raw.advice;
  } catch { /* ignore */ }
  return null;
}

export default function Forge() {
  const { game, act, addCard, model, toast, go } = useStore();
  const p = game.player;
  const [advice, setAdvice] = useState<Advice[]>(() => readAdvice(game.season, game.day) ?? []);
  const [pick, setPick] = useState<string | null>(null);
  const [material, setMaterial] = useState("standard");
  const [effort, setEffort] = useState("quick");
  const [askLoading, setAskLoading] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [reveal, setReveal] = useState<Card | null>(null);
  const day = useRef(game.day);

  useEffect(() => { localStorage.setItem(ADV_KEY, JSON.stringify({ season: game.season, day: game.day, advice })); }, [advice, game.season, game.day]);
  useEffect(() => {
    if (day.current !== game.day) {
      day.current = game.day;
      setAdvice([]); setPick(null);
    }
  }, [game]);

  const quote = M.cardCraftQuote(game, { materialQuality: material, effort });
  const selected = advice.find((a) => a.id === pick) || null;
  const dry = M.beginCardCraft(M.clone(game), { materialQuality: material, effort }, 0.5, "x");
  const block: string | null = !selected ? "Выберите замысел карты." : dry.error || null;

  const askAdvisor = async () => {
    setAskLoading(true);
    try {
      const list = await llmAdvice(model, game);
      setAdvice(list);
      toast("Советник предложил три боевых замысла.", "ok");
    } catch (e: any) {
      toast(`Советник недоступен: ${e?.message}. Попробуйте ещё раз — заготовок нет.`, "bad");
    }
    setPick(null); setAskLoading(false);
  };

  const claim = (orderId: string) => {
    const res = act((s) => M.claimCardCraft(s, orderId), { silent: true });
    if (res) { addCard(res.card); setReveal(res.card); }
  };

  const forge = async () => {
    if (!selected || block || busy) return;
    const invest = { materialQuality: material, effort };
    const advisorOrder = `${CARD_TYPE_INFO[selected.cardType].label}: ${selected.title} — ${selected.pitch}`;
    // Коммитим через act(), чтобы beginCardCraft проверял и писал в АКТУАЛЬНОЕ состояние
    // (а не в замороженный снэпшот) — это не даёт двойному клику дважды списать ресурсы
    // и затереть уже созданный заказ.
    const begin = act((s) => M.beginCardCraft(s, invest, Math.random(), advisorOrder), { silent: true });
    if (!begin) return; // act() уже показал тост с ошибкой
    const order = begin.order;
    setBusy(order.id);
    const started = Date.now();
    try {
      const snapshot = M.clone(game);
      const card: Card = await llmCard(order.modelId, selected, order.rarity as Rarity, snapshot);
      const wait = 1400 - (Date.now() - started);
      if (wait > 0) await new Promise((r) => setTimeout(r, wait));
      const done = act((s) => M.completeCardCraft(s, order.id, card), { silent: true });
      if (!done) throw new Error("Заказ не удалось завершить.");
      if (done.order.status === "ready") claim(order.id);
      else toast(`Мастер работает над «${done.order.name}». Заберите карту через ${done.order.effortDays} дн.`, "ok");
      setPick(null);
    } catch (e: any) {
      act((s) => M.failCardCraft(s, order.id, e?.message || "Кузнец не справился."), { silent: true });
      toast(`Ковка не удалась: ${e?.message}. Оплата возвращена.`, "bad");
    } finally { setBusy(null); }
  };

  const orders: any[] = p.craftOrders.filter((o: any) => ["working", "ready", "generating"].includes(o.status));
  const materials = Object.entries(M.CARD_CRAFT_MATERIALS) as [string, any][];
  const efforts = Object.entries(M.CARD_CRAFT_EFFORTS) as [string, any][];
  const ODDS: { k: Rarity; bar: string }[] = [{ k: "ordinary", bar: "bg-faint" }, { k: "uncommon", bar: "bg-food" }, { k: "rare", bar: "bg-bronze" }];

  return (
    <PageFrame wide>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Label>Кузница</Label>
          <h1 className="font-display mt-1 text-3xl font-semibold sm:text-4xl">Выковать карту</h1>
          <p className="mt-1 max-w-xl text-sm text-dim">Три шага: замысел, сырьё, усилия. Чем лучше вложения, тем выше шанс редкой карты. Одна ковка в день.</p>
        </div>
        {(() => {
          // order_capacity от построек советника может поднять дневной лимит ковки с 1 до 2.
          const craftCap = M.getOrderCapacity(game);
          const craftUsedUp = (p.dailyOrders.craftUsed || 0) >= craftCap;
          const craftLabel = craftUsedUp
            ? "Ковка сегодня использована" + (craftCap > 1 ? ` (${p.dailyOrders.craftUsed}/${craftCap})` : "")
            : "Ковка доступна" + (craftCap > 1 ? ` (${p.dailyOrders.craftUsed}/${craftCap})` : "");
          return <Chip tone={craftUsedUp ? "neutral" : "bronze"}><Anvil size={12} />{craftLabel}</Chip>;
        })()}
      </div>

      {orders.length > 0 && (
        <div className="mb-4 space-y-2">
          {orders.map((o) => (
            <Panel key={o.id} className={cn("flex flex-wrap items-center gap-4 p-4", o.status === "ready" && "border-bronze/50 bg-bronze/8")}>
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-ground">{o.status === "ready" ? <Gift className="text-bronze" size={20} /> : <Hourglass className="text-dim" size={20} />}</span>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold">{o.status === "generating" ? "Мастер куёт карту…" : o.name || "Карта"}</div>
                <div className="text-xs text-dim">{o.status === "ready" ? "Готово — заберите в коллекцию" : o.status === "working" ? `Ещё ${o.remainingDays} дн. работы · ${RARITY_INFO[o.rarity as Rarity].label}` : "Ожидание ответа мастера"}</div>
              </div>
              {o.status === "ready" && <Btn variant="primary" onClick={() => claim(o.id)}><Gift size={16} />Забрать карту</Btn>}
              {o.status === "working" && <Meter value={o.effortDays - o.remainingDays} max={o.effortDays} className="w-28" />}
            </Panel>
          ))}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-4">
          <Panel className="p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <StepTitle n={1} title="Замысел" hint="Что поможет победить в одном бою?" />
              <Btn size="sm" onClick={askAdvisor} disabled={askLoading}>{askLoading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}{advice.length ? "Другие замыслы" : "Спросить ИИ-советника"}</Btn>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-dim">Все идеи — для одного сражения: боец, немедленный манёвр или боевая постройка в тылу. История народа даёт образ и тактику, а не план мирного хозяйства.</p>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {advice.length === 0 && (
                <p className="rounded-xl border border-dashed border-line-strong p-4 text-sm leading-relaxed text-dim md:col-span-3">
                  Боевых замыслов пока нет: советник предложит бойца, разовый манёвр и постройку для боя. Нажмите «Спросить ИИ-советника».
                </p>
              )}
              {advice.map((a) => (
                <button key={a.id} onClick={() => setPick(a.id)} className={cn("flex flex-col items-start rounded-xl border p-4 text-left transition-all", pick === a.id ? "border-bronze bg-raised shadow-[0_0_0_1px_rgba(217,164,69,0.4)]" : "border-line hover:border-line-strong hover:bg-raised/50")}>
                  <div className="flex w-full items-center justify-between"><Chip tone={a.cardType === "unit" ? "clay" : a.cardType === "spell" ? "know" : "bronze"}>{CARD_TYPE_INFO[a.cardType].label}</Chip>{pick === a.id && <Check size={16} className="text-bronze" />}</div>
                  <div className="font-display mt-3 text-[17px] font-semibold leading-tight">{a.title}</div>
                  <p className="mt-1.5 text-[13px] leading-snug text-dim">{a.pitch}</p>
                  <div className="mt-3 text-[11px] text-faint">{CARD_TYPE_INFO[a.cardType].blurb}</div>
                </button>
              ))}
            </div>
          </Panel>

          <Panel className="p-5">
            <StepTitle n={2} title="Сырьё" hint="Лучшее сырьё открывается постройками в дальних землях." />
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {materials.map(([id, m]) => {
                const unlocked = quoteUnlocked(game, id);
                return (
                  <button key={id} disabled={!unlocked} onClick={() => setMaterial(id)} className={cn("rounded-xl border p-4 text-left transition-all disabled:cursor-not-allowed", material === id ? "border-bronze bg-raised" : "border-line hover:bg-raised/50", !unlocked && "opacity-60")}>
                    <div className="flex items-center justify-between"><span className="text-sm font-semibold">{m.label}</span>{!unlocked && <Lock size={14} className="text-faint" />}</div>
                    <div className="mt-2"><Cost cost={m.cost} have={p.resources} /></div>
                    <div className="mt-2 text-[11.5px] text-faint">{unlocked ? id === "standard" ? "Всегда доступно" : "Больше шанс редкой карты" : id === "refined" ? "Постройте Плавильню в Медном руднике" : "Нужны Плавильня и Караван-сарай"}</div>
                  </button>
                );
              })}
            </div>
          </Panel>

          <Panel className="p-5">
            <StepTitle n={3} title="Усилия" hint="Время мастера повышает качество, но занимает дни." />
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {efforts.map(([id, e]) => (
                <button key={id} onClick={() => setEffort(id)} className={cn("rounded-xl border p-4 text-left transition-all", effort === id ? "border-bronze bg-raised" : "border-line hover:bg-raised/50")}>
                  <div className="flex items-center justify-between"><span className="text-sm font-semibold">{e.label}</span><span className="inline-flex items-center gap-1 text-xs text-dim"><Clock size={12} />{e.days ? `${e.days} дн.` : "сразу"}</span></div>
                  <div className="mt-2"><Cost cost={e.cost} have={p.resources} /></div>
                </button>
              ))}
            </div>
          </Panel>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Panel className="p-5">
            <Label>Смета ковки</Label>
            <div className="mt-3 rounded-xl bg-ground/60 p-3.5">
              {selected ? (<><div className="text-[11px] text-faint">{CARD_TYPE_INFO[selected.cardType].label}</div><div className="font-display text-lg font-semibold leading-tight">{selected.title}</div></>) : <div className="text-sm text-faint">Замысел не выбран</div>}
            </div>
            <div className="mt-4 space-y-2.5">
              {ODDS.map(({ k, bar }) => (
                <div key={k}>
                  <div className="mb-1 flex justify-between text-xs"><span className={RARITY_INFO[k].color}>{RARITY_INFO[k].label}</span><span className="font-semibold tabular-nums text-parch">{quote.odds[k === "ordinary" ? "ordinary" : k]}%</span></div>
                  <Meter value={quote.odds[k]} max={100} color={bar} />
                </div>
              ))}
              {quote.rareLocked && quote.rareLockText && (
                <p className="text-[11.5px] leading-relaxed text-dim">🔒 {quote.rareLockText}</p>
              )}
            </div>
            <dl className="mt-5 space-y-2 border-t border-line pt-4 text-sm">
              <div className="flex items-center justify-between"><dt className="text-dim">Цена</dt><dd><Cost cost={quote.cost} have={p.resources} /></dd></div>
              <div className="flex items-center justify-between"><dt className="text-dim">Срок</dt><dd className="font-medium">{quote.effortDays ? `${quote.effortDays} дн.` : "сразу"}</dd></div>
              <div className="flex items-center justify-between"><dt className="text-dim">Мастерство кузнеца</dt><dd className="font-medium">ур. {p.craftLevel}{p.craftLevel < 2 ? ` · ${p.craftXp}/3` : " · макс."}</dd></div>
              <div className="flex items-center justify-between"><dt className="text-dim">Мастер</dt><dd className="text-xs text-dim">ИИ-кузнец</dd></div>
              <div className="flex items-center justify-between gap-3"><dt className="text-dim">Историческая основа</dt><dd className="text-right text-xs text-dim">{M.eraName(p.era)}{p.historicalCulture ? ` · ${p.historicalCulture.icon} ${p.historicalCulture.name}` : ""}</dd></div>
            </dl>
            <Btn variant="primary" size="lg" className="mt-5 w-full" disabled={!!block || !!busy} onClick={forge}>
              {busy ? <><Loader2 size={18} className="animate-spin" />Кузнец за работой…</> : <><Anvil size={18} />Ковать карту</>}
            </Btn>
            {block && !busy && <p className="mt-2.5 text-xs leading-relaxed text-dim">{block}</p>}
            <p className="mt-3 text-[11.5px] leading-relaxed text-faint">
              Редкость выпадает до ковки, оплата списывается сразу. Если ответ мастера некорректен — ресурсы возвращаются.
            </p>
            <p className="mt-2 text-[11.5px] leading-relaxed text-faint">
              Кузнец пишет карту под эпоху «{M.eraName(p.era)}»{p.historicalCulture ? ` и наследие «${p.historicalCulture.name}»` : ""}: это видно в описании, технологиях и в исторической справке карты.
            </p>
          </Panel>
        </aside>
      </div>

      <Modal open={!!reveal} onClose={() => setReveal(null)} title="Новая карта">
        {reveal && (
          <div className="flex flex-col items-center">
            <Label className="mb-1">Новая карта в коллекции</Label>
            <h2 className="font-display mb-4 text-2xl font-semibold">{RARITY_INFO[reveal.rarity ?? "ordinary"].label} карта выкована</h2>
            <div className="w-[270px]"><CardFace card={reveal} detailed historyOpen /></div>
            {reveal.history && (
              <p className="mt-4 max-w-[330px] text-center text-[12px] leading-relaxed text-faint">
                Справка привязана к эпохе «{reveal.history.era}»{reveal.history.culture ? ` и наследию «${reveal.history.culture}»` : ""} — она останется с картой в коллекции.
              </p>
            )}
            <div className="mt-6 flex w-full gap-3">
              <Btn className="flex-1" onClick={() => setReveal(null)}>Продолжить</Btn>
              <Btn variant="primary" className="flex-1" onClick={() => { setReveal(null); go("army"); }}>В армию</Btn>
            </div>
          </div>
        )}
      </Modal>
    </PageFrame>
  );
}

function quoteUnlocked(game: any, id: string) {
  return M.getAvailableMaterialQualities(game).includes(id);
}

function StepTitle({ n, title, hint }: { n: number; title: string; hint: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-bronze/50 bg-bronze/10 text-[13px] font-bold text-bronze-soft">{n}</span>
      <Heading title={title} className="[&_h2]:text-lg" />
      <span className="hidden pt-1 text-[12.5px] text-faint md:block">{hint}</span>
    </div>
  );
}
