import { useMemo, useState } from "react";
import { Swords, Search, Plus, Minus, Trash2, Heart, Zap, Layers, Shield, Info, Tent } from "lucide-react";
import { M } from "@/game/model";
import { allCards, type Card, type CardType } from "@/game/cards";
import { useDerived, useStore } from "@/game/store";
import { Btn, Chip, Empty, Heading, Label, Modal, Panel, Tabs } from "@/components/ui";
import { CardFace, CardTile } from "@/components/CardView";
import { PageFrame } from "@/components/Shell";

/**
 * Боевой состав: колода из стартовых и выкованных карт. Ополчения, которое раньше бесплатно
 * добивало пустые слоты, больше нет — восемь стартовых карт закрывают колоду с первого боя,
 * а пустой слот остаётся пустым, если игрок сам убрал карту.
 */
export default function Army() {
  const { game, collection, act, removeCard, go } = useStore();
  const { cfg, glory } = useDerived();
  const p = game.player;

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
  const starterCount = (M.STARTER_CARDS as Card[]).length;

  return (
    <PageFrame wide>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Label>Армия</Label>
          <h1 className="font-display mt-1 text-3xl font-semibold sm:text-4xl">Боевой состав</h1>
          <p className="mt-1 max-w-xl text-sm text-dim">Единая колода для всех сражений: {starterCount} стартовых карт и всё, что выкуете сами. Размер состава растёт вместе с народом.</p>
        </div>
        <Btn variant="primary" size="lg" onClick={() => go("camp")}><Swords size={18} />К соперникам</Btn>
      </div>

      <Panel className="paper mb-6 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-baseline gap-3">
            <h2 className="font-display text-xl font-semibold">В колоде</h2>
            <span className="text-sm tabular-nums text-dim">{deck.length} из {cfg.deckLimit}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Chip><Heart size={12} className="text-ok" />Вождь {cfg.hp} HP</Chip>
            <Chip><Zap size={12} className="text-bronze" />Энергия до {cfg.energyMax}, +{cfg.energyGrowth}/ход</Chip>
            {cfg.atkBonus > 0 && <Chip tone="clay"><Swords size={12} />Атака +{cfg.atkBonus}</Chip>}
            {cfg.fatigueDelay > 0 && <Chip tone="ok"><Shield size={12} />Усталость позже на {cfg.fatigueDelay}</Chip>}
          </div>
        </div>
        <div className="mt-4 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
          {slots.map((c, i) => c ? (
            <CardTile key={c.id} card={c} right={<button aria-label="Убрать из колоды" onClick={() => toggle(c.id)} className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-faint hover:bg-hover hover:text-bad"><Minus size={16} /></button>} />
          ) : (
            <div key={i} className="flex h-[66px] min-w-0 items-center justify-center rounded-xl border border-dashed border-line-strong px-2 text-xs text-faint">Пустой слот</div>
          ))}
        </div>
        {missing > 0 && (
          <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-dim">
            <Info size={14} className="mt-0.5 shrink-0 text-bronze" />
            Пустых слотов: {missing}. В бою колода будет короче — добавьте карты из коллекции ниже или выкуйте новые в кузнице ({glory} славы).
          </p>
        )}
        <p className="mt-2 flex items-start gap-2 text-xs leading-relaxed text-faint">
          <Tent size={13} className="mt-0.5 shrink-0 text-bronze" />
          Больше слотов дают земля, замысел и наследие народа, а также улучшение «Знамя дружины» в лагере.
        </p>
      </Panel>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-baseline gap-3">
          <Heading title="Коллекция" className="[&_h2]:text-xl" />
          <span className="text-sm text-dim">{cards.length} карт</span>
        </div>
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
