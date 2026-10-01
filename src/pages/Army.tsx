import { useEffect, useMemo, useState } from "react";
import { Swords, Sword, Search, Plus, Minus, Trash2, Heart, Zap, Layers, Crown, Shield, Info } from "lucide-react";
import { M } from "@/game/model";
import { cn } from "@/utils/cn";
import { allCards, militiaFill, militiaPool, type Card, type CardType } from "@/game/cards";
import { currentGuideStep, useDerived, useStore } from "@/game/store";
import { Btn, Chip, Empty, Label, Modal, Panel, Tabs } from "@/components/ui";
import { CardFace, CardTile } from "@/components/CardView";
import { PageFrame } from "@/components/Shell";

export default function Army() {
  const { game, collection, act, removeCard, startPractice, go, militiaPicks, toggleMilitiaPick } = useStore();
  const { cfg } = useDerived();
  const p = game.player;
  const guided = currentGuideStep(game);
  const battleStep = guided?.step.id === "battle" ? guided : null;
  const stepNumber = battleStep ? battleStep.guide.steps.findIndex((s: any) => s.id === "battle") + 1 : 0;
  const [picker, setPicker] = useState(false);

  // На шаге «тренировочный бой» сразу предлагаем выбрать соперника — без лишних нажатий.
  useEffect(() => {
    if (battleStep) setPicker(true);
  }, [battleStep]);
  const cards = useMemo(() => allCards(collection), [collection]);
  const byId = useMemo(() => new Map(cards.map((c) => [c.id, c])), [cards]);
  const deck: Card[] = p.deckCardIds.map((id: string) => byId.get(id)).filter(Boolean) as Card[];
  const [filter, setFilter] = useState<"all" | CardType>("all");
  const [q, setQ] = useState("");
  const [del, setDel] = useState<Card | null>(null);
  const [swapFor, setSwapFor] = useState<Card | null>(null);

  const toggle = (id: string) => act((s) => M.toggleDeckCard(s, id), { silent: true });
  const missing = Math.max(0, cfg.deckLimit - deck.length);
  const shown = cards.filter((c) => (filter === "all" || c.card_type === filter) && (!q || (c.name + c.description).toLowerCase().includes(q.toLowerCase())));
  const inDeck = new Set(p.deckCardIds);
  const full = deck.length >= cfg.deckLimit;

  const slots = Array.from({ length: cfg.deckLimit }, (_, i) => deck[i] ?? null);
  const pool = militiaPool(p.era);
  const fill = militiaFill(militiaPicks, p.era);
  // Кто именно закроет свободные слоты: порядок выбора = порядок выхода.
  const incoming = fill.slice(0, missing);
  const picked = new Set(militiaPicks);

  return (
    <PageFrame wide>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Label>Армия</Label>
          <h1 className="font-display mt-1 text-3xl font-semibold sm:text-4xl">Боевой состав</h1>
          <p className="mt-1 max-w-xl text-sm text-dim">Единая колода для всех сражений. Размер состава растёт вместе с цивилизацией.</p>
        </div>
        <Btn variant="primary" size="lg" onClick={() => setPicker(true)}><Swords size={18} />В бой</Btn>
      </div>

      {battleStep && (
        <Panel className="mb-6 border-bronze/40 bg-bronze/8 p-4">
          <div className="flex items-start gap-3">
            <Shield size={18} className="mt-0.5 shrink-0 text-bronze-soft" />
            <div className="min-w-0">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-bronze-soft">Шаг {stepNumber} из {battleStep.guide.steps.length}: тренировочный бой</div>
              <p className="mt-1 text-[13px] leading-relaxed text-dim">{battleStep.guide.next} Выберите любого соседа — тренировка не тратит ресурсы и не меняет границы.</p>
            </div>
          </div>
        </Panel>
      )}

      <Panel className="paper mb-6 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-baseline gap-3">
            <h2 className="font-display text-xl font-semibold">В колоде</h2>
            <span className="text-sm tabular-nums text-dim">{deck.length} из {cfg.deckLimit}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Chip><Heart size={12} className="text-ok" />Вождь {cfg.hp} HP</Chip>
            <Chip><Zap size={12} className="text-bronze" />Энергия до {cfg.energyMax}, +{cfg.energyGrowth}/ход</Chip>
          </div>
        </div>
        {deck.length < cfg.deckLimit && (
          <p className="mt-2.5 text-xs leading-relaxed text-faint">
            Свободные слоты ({cfg.deckLimit - deck.length}) в бою добьют максимум два простых ополченца поселения — они не входят в коллекцию. Более сильных бойцов нужно выковать самому в кузнице.
          </p>
        )}
        <div className="mt-4 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
          {slots.map((c, i) => c ? (
            <CardTile key={c.id} card={c} right={<button aria-label="Убрать из колоды" onClick={() => toggle(c.id)} className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-faint hover:bg-hover hover:text-bad"><Minus size={16} /></button>} />
          ) : (
            <div key={i} className="flex h-[66px] min-w-0 items-center justify-center gap-2 overflow-hidden rounded-xl border border-dashed border-line-strong px-2 text-xs text-faint">
              {incoming[i - deck.length] ? (
                <><span className="text-base leading-none">{incoming[i - deck.length].emoji}</span>
                  <span className="min-w-0 truncate">{incoming[i - deck.length].name}</span>
                  <span className="shrink-0 text-[10px] uppercase tracking-wide text-bronze-soft">ополчение</span></>
              ) : "Свободный слот"}
            </div>
          ))}
        </div>
        {missing > 0 && (
          <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-dim"><Info size={14} className="mt-0.5 shrink-0 text-bronze" />Не хватает {missing} {missing === 1 ? "карты" : "карт"}: в бою пустые места займёт ополчение. Откуйте новые карты в кузнице или добавьте из коллекции ниже.</p>
        )}
        <p className="mt-2 text-xs leading-relaxed text-faint">Больше слотов дают военный уклад, здания военных наук и культура народа.</p>

        {missing > 0 && (
          <div className="mt-4 rounded-xl border border-line bg-ground/40 p-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-display text-base font-semibold">Кого возьмём в ополчение</h3>
              <span className="text-xs text-faint">Выбрано {incoming.length} из {missing} свободных слотов</span>
            </div>
            <p className="mt-1 text-[12.5px] leading-relaxed text-dim">
              Это всё доступное бесплатное ополчение — только эти двое. Выберите, кто выйдет первым; остальных более сильных бойцов нужно выковать самому в кузнице.
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {pool.map((c) => {
                const on = picked.has(c.id);
                const order = militiaPicks.indexOf(c.id);
                return (
                  <button key={c.id} onClick={() => toggleMilitiaPick(c.id)}
                    className={cn("flex min-w-0 items-center gap-2.5 rounded-xl border px-3 py-2 text-left transition-colors",
                      on ? "border-bronze bg-raised" : "border-line bg-surface hover:border-line-strong hover:bg-raised/50")}>
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-line bg-ground/70 text-lg">{c.emoji}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-semibold">{c.name}</span>
                      <span className="flex items-center gap-2 text-[11px] text-faint">
                        <span className="inline-flex items-center gap-1 text-clay"><Sword size={10} />{c.atk}</span>
                        <span className="inline-flex items-center gap-1 text-ok"><Heart size={10} />{c.hp}</span>
                        <span>вывод {c.drop_cost}<Zap size={9} className="inline text-bronze" /></span>
                      </span>
                    </span>
                    {on && <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-bronze text-[11px] font-bold text-ground">{order + 1}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </Panel>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-baseline gap-3"><h2 className="font-display text-xl font-semibold">Коллекция</h2><span className="text-sm text-dim">{cards.length} карт</span></div>
        <div className="flex w-full min-w-0 flex-wrap items-center gap-3 sm:w-auto">
          <div className="relative min-w-0 max-w-full flex-1 sm:flex-none">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-faint" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Поиск по названию" className="h-10 w-full rounded-lg border border-line-strong bg-surface pl-9 pr-3 text-sm outline-none placeholder:text-faint focus:border-bronze sm:w-52" />
          </div>
          <Tabs className="min-w-0 max-w-full" value={filter} onChange={setFilter} items={[{ id: "all", label: "Все" }, { id: "unit", label: "Отряды" }, { id: "spell", label: "Манёвры" }, { id: "structure", label: "Постройки" }]} />
        </div>
      </div>

      {shown.length === 0 ? (
        <Empty icon={<Layers size={28} />} title="Ничего не найдено" hint={collection.length === 0 ? "У вас пока только стартовые карты. Выкуйте новые в кузнице." : "Измените фильтр или поисковый запрос."} action={collection.length === 0 ? <Btn onClick={() => go("forge")}>В кузницу</Btn> : undefined} />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {shown.map((c) => {
            const isIn = inDeck.has(c.id);
            return (
              <div key={c.id} className="flex flex-col gap-2">
                <CardFace card={c} selected={isIn} className="flex-1" />
                <div className="flex gap-2">
                  <Btn className="flex-1" variant={isIn ? "secondary" : "primary"} size="sm" onClick={() => (!isIn && full ? setSwapFor(c) : toggle(c.id))}>
                    {isIn ? <><Minus size={14} />Убрать</> : full ? <><Plus size={14} />Заменить…</> : <><Plus size={14} />В колоду</>}
                  </Btn>
                  {!c.campaignStarter && <Btn variant="ghost" size="sm" aria-label="Удалить карту" onClick={() => setDel(c)}><Trash2 size={15} /></Btn>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal open={picker} onClose={() => setPicker(false)} wide title="Выбор соперника">
        <Label>Тренировочный бой</Label>
        <h2 className="font-display text-2xl font-semibold">Против кого выйти?</h2>
        <p className="mt-1 text-sm text-dim">Тренировка не тратит ресурсы и не меняет границы. Для захвата земель отправляйте экспедиции с карты.</p>
        <div className="mt-5 grid gap-3">
          {game.opponents.map((o: any) => {
            const oc = M.getOpponentBattleConfig(game, o.id);
            return (
              <div key={o.id} className="flex flex-wrap items-center gap-4 rounded-xl border border-line bg-raised/50 p-4">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-ground text-clay"><Crown size={20} /></span>
                <div className="min-w-0 flex-1">
                  <div className="font-medium">{o.name} {o.leader && <Chip tone="clay" className="ml-1">лидер</Chip>}</div>
                  <div className="text-xs text-faint">{o.clan} · {M.eraName(o.era)}</div>
                  <div className="mt-1 flex gap-3 text-xs text-dim"><span className="inline-flex items-center gap-1"><Heart size={11} />{oc.hp}</span><span className="inline-flex items-center gap-1"><Layers size={11} />{oc.deckLimit} карт</span><span className="inline-flex items-center gap-1" title="Рейтинг — грубая сила отряда: здоровье вождя, карты и их состав. Чем выше, тем труднее бой."><Shield size={11} />сила {o.rating}</span></div>
                  <div className="mt-1 text-[11px] text-faint" title={oc.deckDescription}>{oc.deckStyle} · состав растёт вместе с эпохой</div>
                </div>
                <Btn variant="primary" onClick={() => { setPicker(false); startPractice(o.id); }}>Начать бой</Btn>
              </div>
            );
          })}
        </div>
      </Modal>

      <Modal open={!!swapFor} onClose={() => setSwapFor(null)} title="Замена карты">
        {swapFor && (
          <>
            <Label>Колода полна</Label>
            <h2 className="font-display text-xl font-semibold">Кого заменить на «{swapFor.name}»?</h2>
            <div className="mt-4 grid gap-2">
              {deck.map((c) => (
                <CardTile key={c.id} card={c} onClick={() => { toggle(c.id); toggle(swapFor.id); setSwapFor(null); }} />
              ))}
            </div>
          </>
        )}
      </Modal>

      <Modal open={!!del} onClose={() => setDel(null)} title="Удалить карту">
        {del && (
          <>
            <h2 className="font-display text-xl font-semibold">Удалить «{del.name}»?</h2>
            <p className="mt-2 text-sm text-dim">Карта исчезнет из коллекции навсегда. Вернуть её можно только выковав заново.</p>
            <div className="mt-6 flex justify-end gap-3"><Btn variant="ghost" onClick={() => setDel(null)}>Оставить</Btn><Btn variant="danger" onClick={() => { removeCard(del.id); setDel(null); }}>Удалить</Btn></div>
          </>
        )}
      </Modal>
    </PageFrame>
  );
}
