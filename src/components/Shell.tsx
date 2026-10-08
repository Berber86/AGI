import { useState, type ReactNode } from "react";
import { Tent as CampIcon, Anvil, Swords, Settings, Trophy, X, Check, CircleAlert, Info, Trash2, Flame } from "lucide-react";
import { cn } from "@/utils/cn";
import { M } from "@/game/model";
import { useDerived, useStore, type Page } from "@/game/store";
import { Btn, Chip, Meter, Modal, Label } from "./ui";

export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden>
      <rect x="4" y="4" width="56" height="56" rx="16" fill="#211d16" stroke="#4a4132" strokeWidth="2" />
      <path d="M22 17h20l-3.5 7H26l-4-7Z" fill="#d9a445" />
      <path d="M27 24h10l3 9 10 5-3 5H17l-3-5 10-5 3-9Z" fill="#e9c176" />
      <path d="M25 44h15l4 4H20l5-4Z" fill="#c4623f" />
    </svg>
  );
}

/** Три экрана прототипа: лагерь (бой и улучшения), боевой состав (колода) и кузница (карты). */
const NAV: { id: Page; label: string; Icon: typeof CampIcon }[] = [
  { id: "camp", label: "Лагерь", Icon: CampIcon },
  { id: "army", label: "Армия", Icon: Swords },
  { id: "forge", label: "Кузница", Icon: Anvil },
];

function useAlerts(): Partial<Record<Page, number>> {
  const { game, collection } = useStore();
  const { cfg, camp } = useDerived();
  const out: Partial<Record<Page, number>> = {};
  if (game.player.pendingCultureChoice) out.camp = 1;
  else if (camp.some((u: any) => u.affordable && !u.atCap)) out.camp = 1;
  const missing = Math.max(0, cfg.deckLimit - game.player.deckCardIds.length);
  if (missing && collection.length > 0) out.army = missing;
  return out;
}

export function SideNav() {
  const { page, go, openSettings, aiStatus } = useStore();
  const alerts = useAlerts();
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[216px] flex-col border-r border-line bg-surface/80 px-3 py-5 backdrop-blur lg:flex">
      <div className="mb-8 flex items-center gap-3 px-2">
        <LogoMark size={36} />
        <div className="font-display text-[17px] font-semibold leading-none text-parch">Infinite Forge</div>
      </div>
      <nav aria-label="Основная навигация" className="flex flex-col gap-1">
        {NAV.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => go(id)}
            aria-current={page === id ? "page" : undefined}
            className={cn(
              "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              page === id
                ? "bg-bronze/10 text-parch before:absolute before:bottom-2 before:left-0 before:top-2 before:w-0.5 before:rounded-full before:bg-bronze before:content-['']"
                : "text-dim hover:bg-raised/60 hover:text-parch",
            )}
          >
            <Icon size={18} className={page === id ? "text-bronze" : "text-faint group-hover:text-dim"} />
            <span className="flex-1 text-left">{label}</span>
            {alerts[id] ? (
              <span className="grid h-5 min-w-5 place-items-center rounded-full bg-bronze px-1 text-[11px] font-bold text-ground">{alerts[id]}</span>
            ) : null}
          </button>
        ))}
      </nav>
      <div className="mt-auto">
        <button onClick={() => openSettings(true)} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-dim hover:bg-raised/60 hover:text-parch">
          <Settings size={18} className="text-faint" />
          <span className="flex-1 text-left">Настройки</span>
          <span className={cn("h-2 w-2 rounded-full", aiStatus.status === "bad" ? "bg-bad" : "bg-ok")} title={aiStatus.status === "bad" ? (aiStatus.message || "ИИ недоступен") : "ИИ подключён"} />
        </button>
      </div>
    </aside>
  );
}

export function MobileNav() {
  const { page, go } = useStore();
  const alerts = useAlerts();
  return (
    <nav aria-label="Основная навигация" className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 backdrop-blur lg:hidden">
      <div className="mx-auto grid max-w-lg grid-cols-3">
        {NAV.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => go(id)}
            aria-current={page === id ? "page" : undefined}
            className={cn(
              "relative flex min-h-12 flex-col items-center gap-0.5 py-2.5 text-[10.5px] font-medium transition-colors",
              page === id
                ? "text-bronze before:absolute before:inset-x-8 before:top-0 before:h-0.5 before:rounded-full before:bg-bronze before:content-['']"
                : "text-faint hover:text-parch",
            )}
          >
            <Icon size={20} />
            {label}
            {alerts[id] ? <span className="absolute right-[26%] top-1.5 h-2 w-2 rounded-full bg-bronze" /> : null}
          </button>
        ))}
      </div>
    </nav>
  );
}

/**
 * Верхняя панель: народ, эпоха, слава и счёт боёв. Дня, сезона, приказов и четырёх ресурсов
 * здесь больше нет — вместе с экономикой из игры ушёл и календарь.
 */
export function TopBar() {
  const { game, openSettings } = useStore();
  const { glory, era, wins, losses, streak } = useDerived();
  const p = game.player;
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-ground/90 backdrop-blur">
      <div className="flex items-center gap-3 px-4 py-2.5 lg:px-8">
        <div className="flex min-w-0 max-w-[112px] shrink-0 items-center gap-2 lg:hidden sm:max-w-[150px]">
          <LogoMark size={28} />
          <div className="min-w-0">
            <div className="truncate font-display text-[11px] font-semibold leading-tight text-parch sm:text-[13px]">{p.name}</div>
            <div className="truncate text-[9px] leading-tight text-faint sm:text-[10px]">{M.eraName(p.era)}</div>
          </div>
        </div>
        <div className="hidden min-w-0 lg:block">
          <div className="truncate font-display text-[15px] font-semibold text-parch">{p.name}</div>
          <div className="truncate text-[11px] text-faint">{M.eraName(p.era)} · {p.clan}</div>
        </div>
        <div className="no-scrollbar ml-1 flex flex-1 items-center gap-2 overflow-x-auto lg:ml-6">
          <div className="flex items-center gap-2 rounded-xl border border-line bg-surface px-3 py-1.5">
            <Trophy size={18} className="text-bronze" />
            <div className="leading-none">
              <div className="text-[15px] font-bold tabular-nums text-parch">{glory}</div>
              <div className="mt-0.5 text-[10.5px] text-faint">слава</div>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-line bg-surface px-3 py-1.5">
            <Swords size={18} className="text-dim" />
            <div className="leading-none">
              <div className="text-[15px] font-bold tabular-nums text-parch">{wins}<span className="font-normal text-faint"> / {losses}</span></div>
              <div className="mt-0.5 text-[10.5px] text-faint">бои</div>
            </div>
          </div>
          {streak > 1 && (
            <div className="flex items-center gap-2 rounded-xl border border-bronze/40 bg-bronze/10 px-3 py-1.5">
              <Flame size={18} className="text-bronze" />
              <div className="leading-none">
                <div className="text-[15px] font-bold tabular-nums text-bronze-soft">{streak}</div>
                <div className="mt-0.5 text-[10.5px] text-bronze-soft/70">подряд</div>
              </div>
            </div>
          )}
        </div>
        <div className="hidden w-40 shrink-0 xl:block">
          <div className="mb-1 flex items-center justify-between text-[11px] text-faint">
            <span>{era.finalEra ? "Последняя эпоха" : `До эпохи «${era.nextLabel}»`}</span>
            <span className="tabular-nums">{era.finalEra ? "" : `${era.left} славы`}</span>
          </div>
          <Meter value={era.progress} max={100} />
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <button onClick={() => openSettings(true)} aria-label="Настройки" className="grid h-9 w-9 place-items-center rounded-lg text-dim hover:bg-raised hover:text-parch lg:hidden"><Settings size={18} /></button>
        </div>
      </div>
    </header>
  );
}

export function Toasts() {
  const { toasts, dismissToast } = useStore();
  return (
    <div className="pointer-events-none fixed inset-x-0 top-16 z-[80] flex flex-col items-center gap-2 px-4">
      {toasts.map((t) => (
        <div key={t.id} className={cn("pointer-events-auto flex max-w-md animate-rise items-start gap-3 rounded-xl border bg-raised px-4 py-3 text-sm shadow-2xl",
          t.tone === "bad" ? "border-bad/50" : t.tone === "ok" ? "border-ok/50" : "border-line-strong")}>
          {t.tone === "bad" ? <CircleAlert size={18} className="mt-0.5 shrink-0 text-bad" /> : t.tone === "ok" ? <Check size={18} className="mt-0.5 shrink-0 text-ok" /> : <Info size={18} className="mt-0.5 shrink-0 text-bronze" />}
          <span className="text-parch">{t.text}</span>
          <button onClick={() => dismissToast(t.id)} className="ml-1 text-faint hover:text-parch" aria-label="Закрыть"><X size={16} /></button>
        </div>
      ))}
    </div>
  );
}

export function SettingsModal() {
  const { settingsOpen, openSettings, resetCampaign, aiStatus, checkAi } = useStore();
  const [confirm, setConfirm] = useState(false);
  return (
    <Modal open={settingsOpen} onClose={() => { openSettings(false); setConfirm(false); }} title="Настройки">
      <h2 className="font-display text-xl font-semibold">Настройки</h2>
      <div className="mt-5">
        <div className="rounded-xl border border-line bg-ground/50 p-3.5">
          <Label className="mb-1.5">Связь с ИИ-кузнецом</Label>
          <div className="flex flex-wrap items-center gap-2">
            <span className={cn("inline-flex items-center gap-1.5 text-sm font-medium", aiStatus.status === "bad" ? "text-bad" : aiStatus.status === "ok" ? "text-ok" : "text-faint")}>
              <span className={cn("h-2 w-2 rounded-full", aiStatus.status === "bad" ? "bg-bad" : aiStatus.status === "ok" ? "bg-ok" : "bg-faint")} />
              {aiStatus.status === "checking" ? "Проверяем…" : aiStatus.status === "ok" ? "ИИ подключён" : aiStatus.status === "bad" ? "ИИ недоступен" : "Статус неизвестен"}
            </span>
            <Btn size="sm" variant="secondary" onClick={() => void checkAi()} disabled={aiStatus.status === "checking"}>Проверить связь</Btn>
          </div>
          {aiStatus.status === "bad" && aiStatus.message && <p className="mt-2 text-xs text-bad">{aiStatus.message}</p>}
        </div>
      </div>
      <div className="mt-6 flex items-center justify-between gap-3 border-t border-line pt-5">
        {confirm ? (
          <div className="flex flex-col items-start gap-2">
            <p className="text-xs text-bad">Это сотрёт народ целиком: славу, лагерь, эпоху и выкованные карты коллекции. Отменить нельзя.</p>
            <div className="flex items-center gap-2">
              <Btn variant="danger" size="sm" onClick={() => { resetCampaign(); openSettings(false); setConfirm(false); }}>Да, начать заново</Btn>
              <Btn variant="ghost" size="sm" onClick={() => setConfirm(false)}>Отмена</Btn>
            </div>
          </div>
        ) : (
          <Btn variant="ghost" size="sm" onClick={() => setConfirm(true)}><Trash2 size={14} />Новый народ</Btn>
        )}
        <Btn variant="primary" onClick={() => openSettings(false)}>Готово</Btn>
      </div>
    </Modal>
  );
}

/**
 * Выбор наследия при переходе эпохи: окно встаёт поверх игры и не закрывается, пока выбор не
 * сделан. Наследие даёт боевой бонус (campaign.js → cultureCombatBonus), поэтому выбор
 * напрямую меняет параметры вождя в следующем бою.
 */
export function CultureChoiceModal() {
  const { game, act, toast, go } = useStore();
  // Отложить выбор можно только если он физически не применяется (например, новая культура
  // урезает лимит колоды): тогда игроку нужно дойти до «Армии», а окно иначе мешает.
  const [postponed, setPostponed] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const choice: any = M.getCultureChoice(game);
  if (!choice || postponed) return null;

  const perksOf = (culture: any) => (M.describePerks(M.cultureCombatBonus(culture)) as string[]).join(", ") || "боевых бонусов не меняет";

  const decide = (id: string) => {
    const res = act((s) => M.chooseCulture(s, id), { silent: true });
    if (!res) { setBlocked(true); return; } // act() сам показал ошибку (например, новый лимит колоды)
    toast(
      id === "keep"
        ? `Наследие сохранено: ${game.player.historicalCulture?.name || "прежнее"}.`
        : `Принято наследие: ${M.HISTORICAL_CULTURES.find((c: any) => c.id === id)?.name}.`,
      "ok",
    );
    go("camp");
  };

  return (
    <Modal open onClose={() => {}} dismissable={false} wide title="Выбор наследия">
      <Label>Переход эпохи</Label>
      <h2 className="font-display text-2xl font-semibold sm:text-3xl">Эпоха «{choice.eraLabel}»: чьим наследием жить?</h2>
      <p className="mt-2 text-[14px] leading-relaxed text-dim">{choice.eraDescription}</p>
      {choice.eraTechnologies.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {choice.eraTechnologies.map((t: string) => <Chip key={t} tone="bronze"><Anvil size={11} />{t}</Chip>)}
        </div>
      )}
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <div className="flex flex-col rounded-xl border border-line-strong bg-raised/50 p-4">
          <div className="flex items-start gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-ground text-2xl">{game.player.historicalCulture?.icon || "🏺"}</span>
            <div className="min-w-0">
              <h3 className="font-display text-lg font-semibold leading-tight">Оставить прежнее наследие</h3>
              <Chip tone="ok" className="mt-1">{game.player.historicalCulture?.name || "прежний народ"}</Chip>
            </div>
          </div>
          <p className="mt-3 flex-1 text-[13.5px] leading-relaxed text-dim">{game.player.historicalCulture?.desc || "Народ остаётся при своих обычаях."}</p>
          <div className="mt-2 text-xs text-bronze-soft">{perksOf(game.player.historicalCulture)}</div>
          <Btn className="mt-4" variant="primary" onClick={() => decide("keep")}>Оставить своё наследие</Btn>
        </div>

        {choice.candidates.map((c: any) => (
          <div key={c.id} className="flex flex-col rounded-xl border border-line bg-raised/40 p-4">
            <div className="flex items-start gap-3">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-ground text-2xl">{c.icon}</span>
              <div className="min-w-0">
                <h3 className="font-display text-lg font-semibold leading-tight">{c.name}</h3>
                <Chip tone="bronze" className="mt-1">наследие эпохи</Chip>
              </div>
            </div>
            <p className="mt-3 flex-1 text-[13.5px] leading-relaxed text-dim">{c.desc}</p>
            <div className="mt-2 text-xs text-bronze-soft">{c.combat?.join(", ") || perksOf(c)}</div>
            <Btn className="mt-4" variant="secondary" onClick={() => decide(c.id)}>Принять «{c.name}»</Btn>
          </div>
        ))}
      </div>

      {blocked && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-bad/40 bg-bad/10 px-3 py-2.5">
          <span className="text-[12px] leading-relaxed text-dim">
            Выбор не применился. Отложите окно, поправьте колоду в «Армии» и откройте лагерь — выбор всё ещё ждёт.
          </span>
          <div className="flex gap-2">
            <Btn size="sm" variant="secondary" onClick={() => { setPostponed(true); go("army"); }}>К колоде</Btn>
            <Btn size="sm" variant="ghost" onClick={() => setPostponed(true)}>Отложить</Btn>
          </div>
        </div>
      )}
    </Modal>
  );
}

export function PageFrame({ children, wide }: { children: ReactNode; wide?: boolean }) {
  return <div className={cn("mx-auto w-full animate-rise px-4 pb-28 pt-6 lg:px-8 lg:pb-16 lg:pt-8", wide ? "max-w-7xl" : "max-w-5xl")}>{children}</div>;
}
