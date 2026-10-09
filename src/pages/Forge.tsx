import { useEffect, useState } from "react";
import { Anvil, Sparkles, Loader2, Lock, Check } from "lucide-react";
import { cn } from "@/utils/cn";
import { M } from "@/game/model";
import { CARD_TYPE_INFO, RARITY_INFO, craftErrorMessage, llmAdvice, llmCard, oneLineBoard, type Advice, type Card, type Rarity } from "@/game/cards";
import { useDerived, useStore } from "@/game/store";
import { Btn, Chip, GloryCost, Heading, Label, Meter, Modal, Panel } from "@/components/ui";
import { CardFace } from "@/components/CardView";
import { PageFrame } from "@/components/Shell";

const ADV_KEY = "iforge_advice_combat";

function readAdvice(era: number, count: number): Advice[] | null {
  try {
    const raw = JSON.parse(localStorage.getItem(ADV_KEY) || "null");
    if (raw && raw.era === era && Array.isArray(raw.advice) && raw.advice.length === count) return raw.advice;
  } catch { /* ignore */ }
  return null;
}

/**
 * Кузница: ИИ-кузнец придумывает боевые замыслы (два на однорядном столе, три при наличии тыла)
 * и по выбранному делает карту.
 * Ковка мгновенная и стоит славу — ни дней, ни приказов, ни очереди заказов в прототипе нет.
 * Редкость выпадает до ковки (шансы зависят от сырья и мастерства кузнеца), при сбое ответа
 * слава возвращается.
 */
export default function Forge() {
  const { game, collection, act, addCard, model, toast, go } = useStore();
  const { glory } = useDerived();
  const p = game.player;
  const expectedAdviceCount = oneLineBoard(game) ? 2 : 3;
  const [advice, setAdvice] = useState<Advice[]>(() => readAdvice(p.era, oneLineBoard(game) ? 2 : 3) ?? []);
  const [pick, setPick] = useState<string | null>(null);
  const [material, setMaterial] = useState("standard");
  const [askLoading, setAskLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [reveal, setReveal] = useState<Card | null>(null);
  const [era, setEra] = useState(p.era);
  const [cachedAdviceCount, setCachedAdviceCount] = useState(expectedAdviceCount);

  useEffect(() => { localStorage.setItem(ADV_KEY, JSON.stringify({ era: p.era, advice })); }, [advice, p.era]);
  // Смена эпохи или размера стола сбрасывает замыслы: типы и роли должны соответствовать бою.
  useEffect(() => {
    if (era !== p.era || cachedAdviceCount !== expectedAdviceCount) {
      setEra(p.era); setCachedAdviceCount(expectedAdviceCount); setAdvice([]); setPick(null); setMaterial("standard");
    }
  }, [era, p.era, cachedAdviceCount, expectedAdviceCount]);

  const quote = M.cardCraftQuote(game, { materialQuality: material });
  const selected = advice.find((a) => a.id === pick) || null;
  const block: string | null = !selected ? "Выберите замысел карты." : !quote.materialQualityUnlocked ? quote.unlockText : !quote.affordable ? `Нужно ${quote.cost} славы, сейчас ${glory}.` : null;

  const askAdvisor = async () => {
    setAskLoading(true);
    try {
      const list = await llmAdvice(model, game);
      setAdvice(list);
      toast(`Советник предложил ${list.length} замысла.`, "ok");
    } catch (e: any) {
      toast(`Советник недоступен: ${e?.message}`, "bad");
    }
    setPick(null); setAskLoading(false);
  };

  const forge = async () => {
    if (!selected || block || busy) return;
    // Слава списывается через act() в АКТУАЛЬНОМ состоянии: двойной клик не спишет её дважды.
    const begin = act((s) => M.beginCraft(s, { materialQuality: material }, Math.random()), { silent: true });
    if (!begin) return; // act() уже показал тост с ошибкой
    setBusy(true);
    const started = Date.now();
    try {
      const snapshot = M.clone(game);
      // begin.paw — жребий лапы обезьяны: он уходит в промпт кузнеца, но игроку до раскрытия не показывается.
      const card: Card = await llmCard(begin.modelId, selected, begin.rarity as Rarity, snapshot, begin.paw);
      const firstDeckCard = !game.player.deckCardIds.some((id: string) => collection.some((owned) => owned.id === id));
      const wait = 1200 - (Date.now() - started);
      if (wait > 0) await new Promise((r) => setTimeout(r, wait));
      addCard(card);
      let autoAdded = false;
      if (firstDeckCard) {
        // Убираем только осиротевшие ID старой коллекции, если они есть, и привязываем карту
        // явно к ownership: toggleDeckCard больше не принимает произвольные идентификаторы.
        if (game.player.deckCardIds.length) act((s) => { s.player.deckCardIds = []; return { state: s, error: null }; }, { silent: true });
        autoAdded = Boolean(act((s) => M.toggleDeckCard(s, card.id, [card.id]), { silent: true }));
      }
      const done = act((s) => M.completeCraft(s, { name: card.name, rarity: card.rarity || begin.rarity, monkeyPaw: card.monkey_paw }), { silent: true });
      toast(`Карта «${card.name}» выкована${autoAdded ? " и добавлена в колоду" : ""}.`, "ok");
      if (done?.leveledUp) toast(`Кузнец поднял мастерство до ур. ${done.craftLevel}.`, "ok");
      setReveal(card);
      setPick(null);
    } catch (e: any) {
      // craftErrorMessage прячет текст браковки лапы: жребий до раскрытия карты остаётся сюрпризом.
      // Подробности неудачи (включая дословный ответ модели) пишет журнал в cards.ts — здесь только игрок.
      const reason = craftErrorMessage(e);
      act((s) => M.failCraft(s, begin.cost, reason), { silent: true });
      toast(`Ковка не удалась: ${reason} Слава возвращена (${begin.cost}).`, "bad");
    } finally { setBusy(false); }
  };

  const materials = Object.entries(M.CARD_CRAFT_MATERIALS) as [string, any][];
  const ODDS: { k: Rarity; bar: string }[] = [{ k: "ordinary", bar: "bg-faint" }, { k: "uncommon", bar: "bg-food" }, { k: "rare", bar: "bg-bronze" }];

  return (
    <PageFrame wide>
      <div className="mb-6">
        <h1 className="font-display text-3xl font-semibold sm:text-4xl">Выковать карту</h1>
        <p className="mt-1 text-sm text-dim">{glory} славы · кузнец ур. {quote.craftLevel}</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-4">
          <Panel className="p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <StepTitle n={1} title="Замысел" />
              <Btn size="sm" onClick={askAdvisor} disabled={askLoading}>{askLoading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}{advice.length ? "Другие замыслы" : "Спросить ИИ-советника"}</Btn>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {advice.length === 0 && (
                <p className="rounded-xl border border-dashed border-line-strong p-4 text-sm leading-relaxed text-dim md:col-span-3">
                  Замыслов пока нет — нажмите «Спросить ИИ-советника».
                </p>
              )}
              {advice.map((a) => (
                <button key={a.id} onClick={() => setPick(a.id)} className={cn("flex flex-col items-start rounded-xl border p-4 text-left transition-all", pick === a.id ? "border-bronze bg-raised shadow-[0_0_0_1px_rgba(217,164,69,0.4)]" : "border-line hover:border-line-strong hover:bg-raised/50")}>
                  <div className="flex w-full items-center justify-between"><Chip tone={a.cardType === "unit" ? "clay" : a.cardType === "spell" ? "know" : "bronze"}>{CARD_TYPE_INFO[a.cardType].label}</Chip>{pick === a.id && <Check size={16} className="text-bronze" />}</div>
                  <div className="font-display mt-3 text-[17px] font-semibold leading-tight">{a.title}</div>
                  <p className="mt-1.5 text-[13px] leading-snug text-dim">{a.pitch}</p>
                </button>
              ))}
            </div>
          </Panel>

          <Panel className="p-5">
            <StepTitle n={2} title="Сырьё" />
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {materials.map(([id, m]) => {
                const unlocked = quote.availableMaterialQualities.includes(id);
                return (
                  <button key={id} disabled={!unlocked} onClick={() => setMaterial(id)} className={cn("rounded-xl border p-4 text-left transition-all disabled:cursor-not-allowed", material === id ? "border-bronze bg-raised" : "border-line hover:bg-raised/50", !unlocked && "opacity-60")}>
                    <div className="flex items-center justify-between"><span className="text-sm font-semibold">{m.label}</span>{!unlocked && <Lock size={14} className="text-faint" />}</div>
                    <div className="mt-2"><GloryCost cost={Math.ceil(m.cost * (1 + p.era * 0.4))} have={glory} /></div>
                    {!unlocked && <div className="mt-2 text-[11.5px] text-faint">Откроется в эпоху «{M.eraName(m.minEra)}»</div>}
                  </button>
                );
              })}
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
                  <div className="mb-1 flex justify-between text-xs"><span className={RARITY_INFO[k].color}>{RARITY_INFO[k].label}</span><span className="font-semibold tabular-nums text-parch">{quote.odds[k]}%</span></div>
                  <Meter value={quote.odds[k]} max={100} color={bar} />
                </div>
              ))}
              {quote.rareLocked && quote.rareLockText && <p className="text-[11.5px] leading-relaxed text-dim">🔒 {quote.rareLockText}</p>}
              <p className="text-[11.5px] leading-relaxed text-dim">
                🐾 <b className="text-parch">Лапа обезьяны:</b> часть карт приходит с платой — она оплачивает силу карты.
              </p>
            </div>
            <dl className="mt-5 space-y-2 border-t border-line pt-4 text-sm">
              <div className="flex items-center justify-between"><dt className="text-dim">Цена</dt><dd><GloryCost cost={quote.cost} have={glory} /></dd></div>
              <div className="flex items-center justify-between"><dt className="text-dim">Мастерство кузнеца</dt><dd className="font-medium">ур. {quote.craftLevel}{quote.craftLevel < M.CRAFT_LEVEL_MAX ? ` · ${quote.craftXp}/${M.CRAFT_XP_PER_LEVEL}` : " · макс."}</dd></div>
              <div className="flex items-center justify-between gap-3"><dt className="text-dim">Историческая основа</dt><dd className="text-right text-xs text-dim">{M.eraName(p.era)}{p.historicalCulture ? ` · ${p.historicalCulture.icon} ${p.historicalCulture.name}` : ""}</dd></div>
            </dl>
            <Btn variant="primary" size="lg" className="mt-5 w-full" disabled={!!block || busy} onClick={forge}>
              {busy ? <><Loader2 size={18} className="animate-spin" />Кузнец за работой…</> : <><Anvil size={18} />Ковать карту за {quote.cost} славы</>}
            </Btn>
            {block && !busy && <p className="mt-2.5 text-xs leading-relaxed text-dim">{block}</p>}
          </Panel>
        </aside>
      </div>

      <Modal
        open={!!reveal}
        onClose={() => setReveal(null)}
        title="Новая карта"
        footer={reveal && (
          <div className="flex flex-col gap-2 sm:flex-row">
            <Btn variant="primary" size="lg" className="min-h-14 w-full flex-1 px-4" onClick={() => setReveal(null)}>Принять карту</Btn>
            <Btn size="lg" className="min-h-14 w-full flex-1 px-4" onClick={() => { setReveal(null); go("army"); }}>В колоду</Btn>
          </div>
        )}
      >
        {reveal && (
          <div className="flex flex-col items-center">
            <h2 className="font-display mb-2 text-center text-2xl font-semibold">{RARITY_INFO[reveal.rarity ?? "ordinary"].label} карта выкована</h2>
            <p className="mb-4 max-w-[330px] text-center text-[12.5px] leading-relaxed text-dim">
              {reveal.monkey_paw
                ? <>🐾 <b className="text-bad">Лапа обезьяны сработала.</b> Кузнец взял плату.</>
                : "Карта пришла чистой."}
            </p>
            <div className="w-[270px] max-w-full"><CardFace card={reveal} detailed historyOpen /></div>
            {reveal.history && (
              <p className="mt-4 max-w-[330px] text-center text-[12px] leading-relaxed text-faint">
                Справка «{reveal.history.era}»{reveal.history.culture ? ` · ${reveal.history.culture}` : ""} останется с картой.
              </p>
            )}
          </div>
        )}
      </Modal>
    </PageFrame>
  );
}

function StepTitle({ n, title }: { n: number; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-bronze/50 bg-bronze/10 text-[13px] font-bold text-bronze-soft">{n}</span>
      <Heading title={title} className="[&_h2]:text-lg" />
    </div>
  );
}
