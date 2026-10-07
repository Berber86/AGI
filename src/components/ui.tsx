import { useEffect, useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Trophy, X, ChevronDown } from "lucide-react";
import { cn } from "@/utils/cn";

/**
 * Слава — единственная валюта боевого прототипа: добывается победами, уходит на постоянные
 * улучшения лагеря и на ковку карт. Прежних четырёх ресурсов (провизия, материалы, знания,
 * духовность) вместе с экономикой поселения в игре больше нет.
 */
export const GLORY_ICON = Trophy;
export const GLORY_LABEL = "Слава";

/** Компактная запись цены в славе; красным — если не хватает. */
export function GloryCost({ cost, have, className }: { cost: number; have?: number; className?: string }) {
  const short = have !== undefined && have < cost;
  return (
    <span className={cn("inline-flex items-center gap-1 text-sm font-medium tabular-nums", short ? "text-bad" : "text-bronze-soft", className)} title={GLORY_LABEL}>
      <Trophy size={14} className={short ? "text-bad" : "text-bronze"} />
      {cost}
    </span>
  );
}

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
};

export function Btn({ variant = "secondary", size = "md", className, ...rest }: BtnProps) {
  const base = "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-150 select-none disabled:opacity-40 disabled:pointer-events-none active:scale-[0.98]";
  const sizes = { sm: "h-8 px-3 text-[13px]", md: "h-10 px-4 text-sm", lg: "h-12 px-6 text-[15px]" };
  const variants = {
    primary: "bg-bronze text-ground hover:bg-bronze-soft shadow-[0_1px_0_rgba(255,255,255,0.25)_inset,0_6px_18px_-8px_rgba(217,164,69,0.7)]",
    secondary: "bg-raised text-parch border border-line-strong hover:bg-hover hover:border-faint",
    ghost: "text-dim hover:text-parch hover:bg-raised",
    danger: "bg-bad/15 text-bad border border-bad/40 hover:bg-bad/25",
  };
  return <button className={cn(base, sizes[size], variants[variant], className)} {...rest} />;
}

export function Panel({ className, children, as: Tag = "section" }: { className?: string; children: ReactNode; as?: "section" | "div" | "article" }) {
  return <Tag className={cn("rounded-2xl border border-line bg-surface", className)}>{children}</Tag>;
}

export function Heading({ eyebrow, title, right, className }: { eyebrow?: string; title: string; right?: ReactNode; className?: string }) {
  return (
    <div className={cn("flex items-end justify-between gap-4", className)}>
      <div>
        {eyebrow && <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-faint">{eyebrow}</div>}
        <h2 className="font-display text-xl font-semibold text-parch sm:text-2xl">{title}</h2>
      </div>
      {right}
    </div>
  );
}

export function Label({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("text-[11px] font-semibold uppercase tracking-[0.14em] text-faint", className)}>{children}</div>;
}

export type ChipTone = "neutral" | "bronze" | "ok" | "bad" | "clay" | "know" | "faith";

export function Chip({ children, tone = "neutral", className }: { children: ReactNode; tone?: ChipTone; className?: string }) {
  const tones = {
    neutral: "bg-raised text-dim border-line",
    bronze: "bg-bronze/12 text-bronze-soft border-bronze/30",
    ok: "bg-ok/12 text-ok border-ok/30",
    bad: "bg-bad/12 text-bad border-bad/30",
    clay: "bg-clay/12 text-clay border-clay/30",
    know: "bg-know/12 text-know border-know/30",
    faith: "bg-faith/12 text-faith border-faith/30",
  };
  return <span className={cn("inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-medium", tones[tone], className)}>{children}</span>;
}

export function Meter({ value, max, className, color = "bg-bronze" }: { value: number; max: number; className?: string; color?: string }) {
  const pct = Math.max(0, Math.min(100, (value / Math.max(1, max)) * 100));
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-ground", className)}>
      <div className={cn("h-full rounded-full transition-all duration-500", color)} style={{ width: `${pct}%` }} />
    </div>
  );
}

export function Modal({ open, onClose, children, wide, title, dismissable = true, footer }: { open: boolean; onClose: () => void; children: ReactNode; wide?: boolean; title?: string; dismissable?: boolean; footer?: ReactNode }) {
  useEffect(() => {
    if (!open || !dismissable) return;
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose, dismissable]);
  if (!open) return null;
  const panel = "relative w-full animate-rise rounded-t-3xl border border-line-strong bg-surface shadow-2xl sm:rounded-2xl";
  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label={title}>
      <div className="absolute inset-0 animate-fade bg-black/70 backdrop-blur-[2px]" onClick={dismissable ? onClose : undefined} />
      <div
        className={cn(panel, footer ? "flex max-h-[92dvh] flex-col overflow-hidden" : "max-h-[92dvh] overflow-y-auto p-5 sm:p-7", wide ? "sm:max-w-3xl" : "sm:max-w-lg")}
        style={footer ? { height: "min(92dvh, 740px)" } : undefined}
      >
        {dismissable && (
          <button onClick={onClose} aria-label="Закрыть" className="absolute right-3 top-3 z-10 grid h-8 w-8 place-items-center rounded-lg text-faint hover:bg-raised hover:text-parch">
            <X size={18} />
          </button>
        )}
        {footer ? (
          <>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-5 pt-12 sm:px-7 sm:pb-7 sm:pt-12">{children}</div>
            <div className="shrink-0 border-t border-line bg-surface px-5 pt-3 sm:px-7" style={{ paddingBottom: "max(env(safe-area-inset-bottom), 0.75rem)" }}>
              {footer}
            </div>
          </>
        ) : children}
      </div>
    </div>
  );
}

export function Empty({ icon, title, hint, action }: { icon: ReactNode; title: string; hint?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-line-strong px-6 py-10 text-center">
      <div className="text-faint">{icon}</div>
      <div className="font-medium text-parch">{title}</div>
      {hint && <div className="max-w-sm text-sm text-dim">{hint}</div>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

export function Tabs<T extends string>({ value, onChange, items, className }: { value: T; onChange: (v: T) => void; items: { id: T; label: string; badge?: ReactNode }[]; className?: string }) {
  return (
    <div className={cn("no-scrollbar flex gap-1 overflow-x-auto rounded-xl border border-line bg-surface p-1", className)} role="tablist">
      {items.map((it) => (
        <button
          key={it.id}
          role="tab"
          aria-selected={value === it.id}
          onClick={() => onChange(it.id)}
          className={cn(
            "flex shrink-0 items-center gap-2 rounded-lg px-4 py-1.5 text-sm font-medium transition-colors",
            value === it.id ? "bg-raised text-parch shadow-sm" : "text-dim hover:text-parch",
          )}
        >
          {it.label}
          {it.badge}
        </button>
      ))}
    </div>
  );
}

export function Dot({ tone = "bronze" }: { tone?: "bronze" | "bad" | "ok" }) {
  const c = { bronze: "bg-bronze", bad: "bg-bad", ok: "bg-ok" }[tone];
  return <span className={cn("inline-block h-2 w-2 rounded-full", c)} />;
}

/**
 * Аккордеон для длинных пояснений внутри карточек: историческая справка карты, разбор эффекта.
 * Свёрнут по умолчанию, чтобы карточная сетка не расползалась, но открывается одним кликом.
 */
export function Accordion({ title, icon, children, defaultOpen = false, className, badge }: { title: ReactNode; icon?: ReactNode; children: ReactNode; defaultOpen?: boolean; className?: string; badge?: ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={cn("overflow-hidden rounded-xl border border-line bg-ground/50", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-2 px-2.5 py-2 text-left transition-colors hover:bg-raised/60"
      >
        {icon}
        <span className="min-w-0 flex-1 truncate text-[11.5px] font-semibold text-dim">{title}</span>
        {badge}
        <ChevronDown size={14} className={cn("shrink-0 text-faint transition-transform duration-200", open && "rotate-180")} />
      </button>
      {open && <div className="border-t border-line px-2.5 py-2.5">{children}</div>}
    </div>
  );
}

export function fmt(n: number, digits = 1) {
  const r = Math.round(n * 10 ** digits) / 10 ** digits;
  return Number.isInteger(r) ? String(r) : r.toFixed(digits);
}
export function signed(n: number, digits = 1) {
  const v = fmt(n, digits);
  return n > 0 ? `+${v}` : v;
}
