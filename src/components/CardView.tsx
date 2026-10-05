import type { ReactNode } from "react";
import { Sword, Heart, Zap, ScrollText } from "lucide-react";
import { cn } from "@/utils/cn";
import { Accordion } from "@/components/ui";
import { CARD_TYPE_INFO, RARITY_INFO, describeEffect, kwName, type Card, type CardHistory } from "@/game/cards";

const TYPE_TINT: Record<string, string> = {
  unit: "from-clay/25 via-clay/5",
  spell: "from-know/25 via-know/5",
  structure: "from-mat/25 via-mat/5",
};

export function KeywordChips({ keywords, className, limit }: { keywords: string[]; className?: string; limit?: number }) {
  const list = limit ? keywords.slice(0, limit) : keywords;
  return (
    <div className={cn("flex flex-wrap gap-1", className)}>
      {list.map((k) => {
        const w = kwName(k);
        return (
          <span key={k} title={w.desc} className="rounded-md border border-line bg-ground/60 px-1.5 py-0.5 text-[10.5px] font-medium text-dim">
            {w.name}{w.level ? ` ${w.level}` : ""}
          </span>
        );
      })}
      {limit && keywords.length > limit && <span className="px-1 text-[10.5px] text-faint">+{keywords.length - limit}</span>}
    </div>
  );
}

export function CostEnergy({ value, className }: { value: number; className?: string }) {
  return (
    <span className={cn("inline-flex h-7 min-w-7 items-center justify-center gap-0.5 rounded-full border border-bronze/50 bg-ground/80 px-1.5 text-[13px] font-bold tabular-nums text-bronze-soft", className)} title="Стоимость вывода (общая энергия)">
      <Zap size={12} />{value}
    </span>
  );
}

export function StatPair({ card, className }: { card: Pick<Card, "atk" | "hp" | "card_type">; className?: string }) {
  if (card.card_type === "spell") return null;
  return (
    <div className={cn("flex items-center gap-3 text-sm font-bold tabular-nums", className)}>
      {card.card_type === "unit" && (
        <span className="inline-flex items-center gap-1 text-clay" title="Атака"><Sword size={14} />{card.atk}</span>
      )}
      <span className="inline-flex items-center gap-1 text-ok" title="Здоровье"><Heart size={14} />{card.hp}</span>
    </div>
  );
}

interface Props {
  card: Card;
  onClick?: () => void;
  selected?: boolean;
  footer?: ReactNode;
  badge?: ReactNode;
  detailed?: boolean;
  className?: string;
  dim?: boolean;
  /** Историческая справка сразу раскрыта: так показываем только что выкованную карту. */
  historyOpen?: boolean;
}

/** Историческая справка карты: эпоха кампании и наследие народа, под которые её написал кузнец. */
export function HistoryNote({ history, defaultOpen }: { history: CardHistory; defaultOpen?: boolean }) {
  return (
    <Accordion
      className="mt-2"
      defaultOpen={defaultOpen}
      icon={<ScrollText size={12} className="shrink-0 text-bronze" />}
      title={history.title}
    >
      <p className="text-[11.5px] leading-relaxed text-dim">{history.text}</p>
      {(history.era || history.culture) && (
        <div className="mt-2 flex flex-wrap gap-1">
          {history.era && <span className="rounded-md border border-line bg-ground/70 px-1.5 py-0.5 text-[10px] text-faint">Эпоха: {history.era}</span>}
          {history.culture && <span className="rounded-md border border-line bg-ground/70 px-1.5 py-0.5 text-[10px] text-faint">Наследие: {history.culture}</span>}
        </div>
      )}
    </Accordion>
  );
}

/** Полноразмерная карта */
export function CardFace({ card, onClick, selected, footer, badge, detailed, className, dim, historyOpen }: Props) {
  const rarity = card.rarity ? RARITY_INFO[card.rarity] : null;
  const type = CARD_TYPE_INFO[card.card_type];
  const Wrapper: any = onClick ? "button" : "div";
  return (
    <Wrapper
      onClick={onClick}
      className={cn(
        "group relative flex w-full flex-col overflow-hidden rounded-2xl border bg-surface text-left transition-all duration-200",
        rarity?.ring ?? "border-line-strong",
        card.rarity === "rare" && "shadow-[0_0_0_1px_rgba(217,164,69,0.25),0_10px_40px_-18px_rgba(217,164,69,0.55)]",
        onClick && "hover:-translate-y-0.5 hover:border-faint",
        selected && "ring-2 ring-bronze ring-offset-2 ring-offset-ground",
        dim && "opacity-45",
        className,
      )}
    >
      <div className={cn("relative flex items-start justify-between bg-gradient-to-b to-transparent px-3 pt-3", TYPE_TINT[card.card_type])}>
        <CostEnergy value={card.drop_cost} />
        <div className="text-right">
          <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-dim">{type.label}</div>
          {rarity && <div className={cn("text-[10px] font-medium", rarity.color)}>{rarity.label}</div>}
        </div>
      </div>
      <div className="flex flex-col items-center px-3 pb-2 pt-1">
        <div className="grid h-16 w-16 place-items-center rounded-full border border-line-strong bg-ground/70 text-[34px] leading-none shadow-inner">{card.emoji || "⚒️"}</div>
        <h3 className="font-display mt-2 text-center text-[17px] font-semibold leading-tight text-parch">{card.name}</h3>
        <div className="mt-0.5 text-[11px] text-faint">{card.era === "bronze" ? "Бронзовый век" : "Древний мир"}</div>
      </div>
      <div className="flex flex-1 flex-col gap-2 px-3 pb-3">
        {card.keywords?.length > 0 && <KeywordChips keywords={card.keywords} className="justify-center" limit={detailed ? undefined : 4} />}
        {detailed && card.keywords?.length > 0 && (
          <ul className="space-y-0.5 text-[11.5px] leading-snug text-dim">
            {card.keywords.map((k) => { const w = kwName(k); return <li key={k}><span className="text-parch">{w.name}{w.level ? ` ${w.level}` : ""}.</span> {w.desc}</li>; })}
          </ul>
        )}
        {card.effects?.length > 0 && (
          <ul className="space-y-0.5 text-[12px] leading-snug text-parch/90">
            {card.effects.slice(0, detailed ? 6 : 2).map((e, i) => (
              <li key={i} className="flex gap-1.5"><Zap size={11} className="mt-[3px] shrink-0 text-bronze" />{describeEffect(e)}</li>
            ))}
          </ul>
        )}
        <p className="mt-auto text-center text-[12px] italic leading-snug text-dim">{card.description}</p>
        {card.monkey_paw && (
          <div className="rounded-xl border border-bad/30 bg-bad/12 px-2.5 py-2">
            <div className="mb-0.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-bad">🐾 Лапа обезьяны</div>
            <div className="text-[12px] leading-snug text-parch/90">{card.monkey_paw}</div>
          </div>
        )}
        {card.history && <HistoryNote history={card.history} defaultOpen={historyOpen} />}
        <div className="flex items-center justify-between border-t border-line pt-2">
          <StatPair card={card} />
          {card.card_type === "unit" && (
            <span className="inline-flex items-center gap-1 text-[11px] text-dim" title="Стоимость атаки (общая энергия)"><Zap size={12} className="text-bronze" />атака {card.action_cost}</span>
          )}
          {card.card_type === "structure" && <span className="text-[11px] text-dim">бьёт врага раз в ход</span>}
          {card.card_type === "spell" && <span className="text-[11px] text-dim">одноразовый</span>}
        </div>
        {footer}
      </div>
      {badge && <div className="absolute right-2 top-12">{badge}</div>}
    </Wrapper>
  );
}

/** Компактная строка-плитка */
export function CardTile({ card, onClick, selected, right, dim, className }: { card: Card; onClick?: () => void; selected?: boolean; right?: ReactNode; dim?: boolean; className?: string }) {
  const rarity = card.rarity ? RARITY_INFO[card.rarity] : null;
  const Wrapper: any = onClick ? "button" : "div";
  return (
    <Wrapper
      onClick={onClick}
      className={cn(
        "flex w-full min-w-0 items-center gap-3 rounded-xl border bg-surface px-3 py-2.5 text-left transition-colors",
        rarity?.ring ?? "border-line",
        onClick && "hover:bg-raised",
        selected && "border-bronze bg-raised",
        dim && "opacity-50",
        className,
      )}
    >
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line-strong bg-ground/70 text-xl">{card.emoji}</span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-parch">{card.name}</span>
        <span className="flex items-center gap-2 text-[11px] text-faint">
          {CARD_TYPE_INFO[card.card_type].label}
          {rarity && <span className={rarity.color}>· {rarity.label}</span>}
          {card.monkey_paw && <span className="text-bad" title={card.monkey_paw}>· 🐾 плата</span>}
        </span>
      </span>
      <StatPair card={card} className="shrink-0 text-[13px]" />
      <CostEnergy value={card.drop_cost} className="shrink-0" />
      {right}
    </Wrapper>
  );
}
