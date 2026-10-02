import { useEffect, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Wheat, Pickaxe, ScrollText, Flame, X } from "lucide-react";
import { cn } from "@/utils/cn";

// 🙏 Духовность — четвёртый ресурс: жрецы, святилища и миссии (см. campaign.js ENLIGHTENMENT_WEIGHTS).
export type ResKey = "food" | "materials" | "knowledge" | "faith";

export const RES: Record<ResKey, { label: string; short: string; color: string; bg: string; Icon: typeof Wheat }> = {
  food: { label: "Провизия", short: "Еда", color: "text-food", bg: "bg-food/12", Icon: Wheat },
  materials: { label: "Материалы", short: "Материалы", color: "text-mat", bg: "bg-mat/12", Icon: Pickaxe },
  knowledge: { label: "Знания", short: "Знания", color: "text-know", bg: "bg-know/12", Icon: ScrollText },
  faith: { label: "Духовность", short: "Духовность", color: "text-faith", bg: "bg-faith/12", Icon: Flame },
};

export function ResIcon({ k, size = 16, className }: { k: ResKey; size?: number; className?: string }) {
  const { Icon, color } = RES[k];
  return <Icon size={size} className={cn(color, className)} strokeWidth={2} />;
}

/** Компактная запись стоимости: «2 🌾 · 3 🪵», красным — если не хватает */
export function Cost({ cost, have, className }: { cost: Partial<Record<ResKey, number>>; have?: Record<ResKey, number>; className?: string }) {
  const entries = (Object.keys(cost) as ResKey[]).filter((k) => (cost[k] || 0) > 0);
  if (!entries.length) return <span className={cn("text-xs text-faint", className)}>бесплатно</span>;
  return (
    <span className={cn("inline-flex flex-wrap items-center gap-x-2.5 gap-y-1 text-sm", className)}>
      {entries.map((k) => {
        const short = have && have[k] < (cost[k] as number);
        return (
          <span key={k} className={cn("inline-flex items-center gap-1 font-medium tabular-nums", short ? "text-bad" : "text-parch")} title={RES[k].label}>
            <ResIcon k={k} size={14} />
            {cost[k]}
          </span>
        );
      })}
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

/** Категории наук и построек: пятая — религиозное (обряд, жречество, книжность), она же цвет духовности. */
export const CATEGORY_META: Record<string, { label: string; tone: ChipTone }> = {
  military: { label: "Военное", tone: "bad" },
  economy: { label: "Экономика", tone: "ok" },
  science: { label: "Наука", tone: "know" },
  civic: { label: "Общество", tone: "bronze" },
  religion: { label: "Религия", tone: "faith" },
};

export function Meter({ value, max, className, color = "bg-bronze" }: { value: number; max: number; className?: string; color?: string }) {
  const pct = Math.max(0, Math.min(100, (value / Math.max(1, max)) * 100));
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-ground", className)}>
      <div className={cn("h-full rounded-full transition-all duration-500", color)} style={{ width: `${pct}%` }} />
    </div>
  );
}

export function Modal({ open, onClose, children, wide, title, dismissable = true }: { open: boolean; onClose: () => void; children: ReactNode; wide?: boolean; title?: string; dismissable?: boolean }) {
  useEffect(() => {
    if (!open || !dismissable) return;
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose, dismissable]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label={title}>
      <div className="absolute inset-0 animate-fade bg-black/70 backdrop-blur-[2px]" onClick={dismissable ? onClose : undefined} />
      <div className={cn("relative max-h-[92dvh] w-full animate-rise overflow-y-auto rounded-t-3xl border border-line-strong bg-surface p-5 shadow-2xl sm:rounded-2xl sm:p-7", wide ? "sm:max-w-3xl" : "sm:max-w-lg")}>
        {dismissable && (
          <button onClick={onClose} aria-label="Закрыть" className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-lg text-faint hover:bg-raised hover:text-parch">
            <X size={18} />
          </button>
        )}
        {children}
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

export function fmt(n: number, digits = 1) {
  const r = Math.round(n * 10 ** digits) / 10 ** digits;
  return Number.isInteger(r) ? String(r) : r.toFixed(digits);
}
export function signed(n: number, digits = 1) {
  const v = fmt(n, digits);
  return n > 0 ? `+${v}` : v;
}
