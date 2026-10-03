import { useState, type ReactNode } from "react";
import { Home, Map as MapIcon, Telescope, Anvil, Swords, Settings, Users, Sun, ArrowRight, X, Check, CircleAlert, Info, Flag, Sparkles, Trash2 } from "lucide-react";
import { cn } from "@/utils/cn";
import { M } from "@/game/model";
import { useDerived, useStore, type Page } from "@/game/store";
import { Btn, Chip, Meter, Modal, ResIcon, RES, fmt, signed, type ResKey, Label } from "./ui";

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

const NAV: { id: Page; label: string; Icon: typeof Home }[] = [
  { id: "home", label: "Поселение", Icon: Home },
  { id: "map", label: "Карта", Icon: MapIcon },
  { id: "develop", label: "Развитие", Icon: Telescope },
  { id: "forge", label: "Кузница", Icon: Anvil },
  { id: "army", label: "Армия", Icon: Swords },
];

function useAlerts(): Partial<Record<Page, number>> {
  const { game, collection } = useStore();
  const { cfg } = useDerived();
  const p = game.player;
  const out: Partial<Record<Page, number>> = {};
  if (p.pendingDecreeChoice || p.pendingCultureChoice) out.develop = 1;
  const ready = p.craftOrders.filter((o: any) => o.status === "ready").length;
  if (ready) out.forge = ready;
  const missing = Math.max(0, cfg.deckLimit - p.deckCardIds.length);
  if (missing && (collection.length > 0 || M.STARTER_CARDS.length > p.deckCardIds.length)) out.army = missing;
  if (p.pendingExpedition) out.map = 1;
  return out;
}

export function SideNav() {
  const { page, go, openSettings, aiStatus } = useStore();
  const alerts = useAlerts();
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[216px] flex-col border-r border-line bg-surface/80 px-3 py-5 backdrop-blur lg:flex">
      <div className="mb-8 flex items-center gap-3 px-2">
        <LogoMark size={36} />
        <div>
          <div className="font-display text-[17px] font-semibold leading-none text-parch">Infinite Forge</div>
          <div className="mt-1 text-[11px] text-faint">Рождение цивилизаций</div>
        </div>
      </div>
      <nav className="flex flex-col gap-1">
        {NAV.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => go(id)}
            className={cn(
              "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              page === id ? "bg-raised text-parch" : "text-dim hover:bg-raised/60 hover:text-parch",
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

/**
 * Раньше здесь был обязательный экран ввода ключа. Теперь ключ ИИ настраивается один раз
 * на сервере (переменная окружения HYDRA_API_KEY на Vercel) — в игре его больше нигде
 * вводить не нужно, поэтому блокирующий гейт убран. Если сервер всё же не настроен,
 * об этом скажет статус «ИИ» в настройках и подсказки при попытке спросить советника.
 */

export function MobileNav() {
  const { page, go } = useStore();
  const alerts = useAlerts();
  return (
    <nav className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 backdrop-blur lg:hidden">
      <div className="mx-auto grid max-w-lg grid-cols-5">
        {NAV.map(({ id, label, Icon }) => (
          <button key={id} onClick={() => go(id)} className={cn("relative flex flex-col items-center gap-0.5 py-2.5 text-[10.5px] font-medium", page === id ? "text-bronze" : "text-faint")}>
            <Icon size={20} />
            {label}
            {alerts[id] ? <span className="absolute right-[26%] top-1.5 h-2 w-2 rounded-full bg-bronze" /> : null}
          </button>
        ))}
      </div>
    </nav>
  );
}

function ResChip({ k }: { k: ResKey }) {
  const { game } = useStore();
  const { net, cap } = useDerived();
  const v = game.player.resources[k];
  const n = net[k];
  return (
    <div className="flex items-center gap-2 rounded-xl border border-line bg-surface px-3 py-1.5" title={`${RES[k].label}: ${fmt(v, 0)} из ${cap} на складе; ${signed(n)} в день. Запасы копятся дробно; излишек сверх склада тает вдвое.`}>
      <ResIcon k={k} size={18} />
      <div className="leading-none">
        <div className="text-[15px] font-bold tabular-nums text-parch">{Math.floor(v)}</div>
        <div className={cn("mt-0.5 text-[10.5px] font-medium tabular-nums", n < -0.05 ? "text-bad" : "text-faint")}>{signed(n)} / день</div>
      </div>
    </div>
  );
}

export function TopBar() {
  const { game, endDay, act, go, toast, openSettings } = useStore();
  const { ap, apMax, cap } = useDerived();
  const p = game.player;
  const last = game.day >= M.SEASON_LENGTH;
  const [confirmSeason, setConfirmSeason] = useState(false);
  const completeSeason = () => {
    const res = act((s) => M.completeSeason(s));
    if (res) { toast(`Сезон завершён. Медаль: ${res.medal.name}`, "ok"); go("home"); }
  };
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-ground/90 backdrop-blur">
      <div className="flex items-center gap-3 px-4 py-2.5 lg:px-8">
        <div className="flex items-center gap-2 lg:hidden"><LogoMark size={28} /></div>
        <div className="hidden min-w-0 lg:block">
          <div className="truncate font-display text-[15px] font-semibold text-parch">{p.name}</div>
          <div className="truncate text-[11px] text-faint">{M.eraName(p.era)} · {p.clan}</div>
        </div>
        <div className="no-scrollbar ml-1 flex flex-1 items-center gap-2 overflow-x-auto lg:ml-6">
          {(["food", "materials", "knowledge", "faith"] as ResKey[]).map((k) => <ResChip key={k} k={k} />)}
          <div className="flex items-center gap-2 rounded-xl border border-line bg-surface px-3 py-1.5" title="Население. Растёт на 1, когда провизии на складе больше 10 и дневной профицит еды больше 2; голод уносит людей.">
            <Users size={18} className="text-dim" />
            <div className="leading-none">
              <div className="text-[15px] font-bold tabular-nums text-parch">{p.population}</div>
              <div className="mt-0.5 text-[10.5px] text-faint">склад {cap}</div>
            </div>
          </div>
        </div>
        <div className="hidden w-36 shrink-0 xl:block">
          <div className="mb-1 flex items-center justify-between text-[11px] text-faint">
            <span className="inline-flex items-center gap-1"><Sun size={12} className="text-bronze" />День {game.day} из {M.SEASON_LENGTH}</span>
            <span>Сезон {game.season}</span>
          </div>
          <Meter value={game.day} max={M.SEASON_LENGTH} />
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <button onClick={() => openSettings(true)} aria-label="Настройки" className="grid h-9 w-9 place-items-center rounded-lg text-dim hover:bg-raised hover:text-parch lg:hidden"><Settings size={18} /></button>
          <div className="hidden items-center gap-1.5 sm:flex" title={`Приказов осталось сегодня: ${ap} из ${apMax}`}>
            {Array.from({ length: apMax }).map((_, i) => (
              <span key={i} className={cn("grid h-6 w-6 place-items-center rounded-full border", i < ap ? "border-bronze bg-bronze/15 text-bronze" : "border-line text-faint")}>
                <Flag size={12} />
              </span>
            ))}
          </div>
          {last ? (
            <Btn variant="primary" onClick={() => setConfirmSeason(true)}>Итоги сезона<ArrowRight size={16} /></Btn>
          ) : (
            <Btn variant="primary" onClick={endDay} title="Провести день: рабочие соберут ресурсы, народ съест провизию">
              <span className="hidden sm:inline">Завершить день</span><span className="sm:hidden">День {game.day}</span><ArrowRight size={16} />
            </Btn>
          )}
        </div>
      </div>
      <Modal open={confirmSeason} onClose={() => setConfirmSeason(false)} title="Решение народа">
        <Label>Итоги сезона</Label>
        <h2 className="font-display text-2xl font-semibold">Завершить сезон {game.season}?</h2>
        <p className="mt-2 text-sm leading-relaxed text-dim">
          Новый сезон — новая жизнь: мир, земли, науки, постройки и запасы начнутся с чистого листа. Вам покажут новую карту.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-dim">
          Останутся с вами: медаль за сезон, мастерство кузнеца, численность народа и собранная коллекция карт.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <Btn variant="ghost" onClick={() => setConfirmSeason(false)}>Ещё пораньше</Btn>
          <Btn variant="primary" onClick={() => { setConfirmSeason(false); completeSeason(); }}>Завершить сезон<ArrowRight size={16} /></Btn>
        </div>
      </Modal>
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
      <p className="mt-1 text-sm text-dim">Науки, постройки и карты придумывает модель во время игры, готовых вариантов нет. Ключ ИИ настроен на сервере заранее — вводить его в игре не нужно.</p>
      <div className="mt-5 space-y-4">
        <div className="rounded-xl border border-line bg-ground/50 p-3.5">
          <Label className="mb-1.5 flex items-center gap-1.5"><Sparkles size={12} />Связь с ИИ-советником</Label>
          <div className="flex flex-wrap items-center gap-2">
            <span className={cn("inline-flex items-center gap-1.5 text-sm font-medium", aiStatus.status === "bad" ? "text-bad" : aiStatus.status === "ok" ? "text-ok" : "text-faint")}>
              <span className={cn("h-2 w-2 rounded-full", aiStatus.status === "bad" ? "bg-bad" : aiStatus.status === "ok" ? "bg-ok" : "bg-faint")} />
              {aiStatus.status === "checking" ? "Проверяем…" : aiStatus.status === "ok" ? "ИИ подключён" : aiStatus.status === "bad" ? "ИИ недоступен" : "Статус неизвестен"}
            </span>
            <Btn size="sm" variant="secondary" onClick={() => void checkAi()} disabled={aiStatus.status === "checking"}>Проверить связь</Btn>
          </div>
          {aiStatus.status === "bad" && aiStatus.message && <p className="mt-2 text-xs text-bad">{aiStatus.message}</p>}
        </div>
        <div className="rounded-xl border border-line bg-ground/50 p-3.5">
          <Label className="mb-1.5">Модель советника</Label>
          <p className="text-sm leading-relaxed text-dim">
            Модель выбирает игра, а не игрок: науки, советы и обычные карты делает <span className="text-parch">GPT-6 Luna</span>,
            а необычные и редкие карты кузница отдаёт <span className="text-parch">GLM-5.2</span>.
          </p>
        </div>
      </div>
      <a href="/legacy.html" target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-bronze hover:text-bronze-soft hover:underline">
        Открыть прежний интерфейс (локальные заготовки, без ИИ) <ArrowRight size={13} />
      </a>
      <div className="mt-6 flex items-center justify-between gap-3 border-t border-line pt-5">
        {confirm ? (
          <div className="flex flex-col items-start gap-2">
            <p className="text-xs text-bad">Это сотрёт кампанию целиком: прогресс, выкованные карты в коллекции и набор ополчения. Отменить нельзя.</p>
            <div className="flex items-center gap-2">
              <Btn variant="danger" size="sm" onClick={() => { resetCampaign(); openSettings(false); setConfirm(false); }}>Да, начать заново</Btn>
              <Btn variant="ghost" size="sm" onClick={() => setConfirm(false)}>Отмена</Btn>
            </div>
          </div>
        ) : (
          <Btn variant="ghost" size="sm" onClick={() => setConfirm(true)}><Trash2 size={14} />Новая цивилизация</Btn>
        )}
        <Btn variant="primary" onClick={() => openSettings(false)}>Готово</Btn>
      </div>
    </Modal>
  );
}

export function DayReportModal() {
  const { dayReport: r, closeDayReport } = useStore();
  if (!r) return null;
  const rows: { k: ResKey; extra: string }[] = [
    { k: "food", extra: `+${fmt(r.gained.food)} добыто, −${fmt(r.consumption)} съел народ` },
    { k: "materials", extra: `+${fmt(r.gained.materials)} добыто, −${fmt(r.upkeep)} на содержание` },
    { k: "knowledge", extra: `+${fmt(r.gained.knowledge)} накоплено` },
    { k: "faith", extra: `+${fmt(r.gained.faith)} накоплено` },
  ];
  return (
    <Modal open onClose={closeDayReport} title="Итоги дня">
      <Label>Итоги</Label>
      <h2 className="font-display text-2xl font-semibold">День {r.day} завершён</h2>
      {r.eraAdvanced && (
        <div className="mt-4 rounded-xl border border-bronze/50 bg-bronze/10 p-4">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-bronze">Просветление дошло до порога</div>
          <div className="mt-1 font-display text-lg font-semibold text-parch">Наступила эпоха «{r.eraAdvanced.label}»</div>
          <p className="mt-1 text-xs leading-relaxed text-dim">Половина накопленных 📚 и 🙏 сгорела в переходе: собор, перепись и обряды. Выберите уклад и наследие — технологии эпохи уже доступны.</p>
        </div>
      )}
      <div className="mt-5 space-y-2">
        {rows.map(({ k, extra }) => {
          const d = r.after[k] - r.before[k];
          return (
            <div key={k} className="flex items-center gap-3 rounded-xl border border-line bg-raised/60 px-4 py-3">
              <ResIcon k={k} size={20} />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-parch">{RES[k].label}</div>
                <div className="text-xs text-faint">{extra}</div>
              </div>
              <div className="text-right tabular-nums">
                <div className="text-base font-bold text-parch">{Math.floor(r.after[k])}</div>
                <div className={cn("text-xs font-medium", d < 0 ? "text-bad" : "text-ok")}>{d >= 0 ? "+" : ""}{fmt(d)}</div>
              </div>
            </div>
          );
        })}
      </div>
      {(r.popAfter !== r.popBefore || r.starvation) && (
        <div className={cn("mt-3 flex items-center gap-2 rounded-xl border px-4 py-3 text-sm", r.popAfter < r.popBefore ? "border-bad/40 bg-bad/10 text-bad" : "border-ok/40 bg-ok/10 text-ok")}>
          <Users size={16} />
          {r.popAfter > r.popBefore ? `Народ вырос: ${r.popBefore} → ${r.popAfter}. Назначьте нового работника.` : `Голод! Потеряно ${r.popBefore - r.popAfter} чел. Отправьте больше людей на провизию.`}
        </div>
      )}
      {r.readyCards.length > 0 && <div className="mt-3 rounded-xl border border-bronze/40 bg-bronze/10 px-4 py-3 text-sm text-bronze-soft">Кузница закончила работу: {r.readyCards.join(", ")}. Заберите карту в «Кузнице».</div>}
      {r.notice && !r.starvation && r.popAfter === r.popBefore && <div className="mt-3 text-sm text-dim">{r.notice}</div>}
      <Btn variant="primary" size="lg" className="mt-6 w-full" onClick={closeDayReport}>Наступает день {r.day + 1}<ArrowRight size={18} /></Btn>
    </Modal>
  );
}

/**
 * Выбор наследия при переходе эпохи — отдельным окном, а не только вкладкой «Наследие».
 * Раньше выбор открывался тихо: значок на вкладке и строчка в отчёте дня, поэтому игрок
 * доходил до следующей эпохи, так и не увидев, что культуру вообще предлагали. Теперь
 * окно встаёт поверх игры сразу после отчёта дня и не закрывается, пока выбор не сделан
 * (любой вариант — включая «оставить прежнее» — равноправен: технологии эпохи уже доступны).
 */
export function CultureChoiceModal() {
  const { game, dayReport, act, toast, go } = useStore();
  // Отложить выбор можно только если он физически не применяется (например, новая культура
  // урезает лимит колоды): тогда игроку нужно дойти до «Отряда», а окно иначе мешает.
  const [postponed, setPostponed] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const choice: any = M.getCultureChoice(game);
  // Отчёт дня читается первым: иначе два окна встали бы друг на друга.
  if (!choice || dayReport || postponed) return null;

  const decide = (id: string) => {
    const res = act((s) => M.chooseCulture(s, id), { silent: true });
    if (!res) { setBlocked(true); return; } // act() сам показал ошибку (например, новый лимит колоды)
    toast(
      id === "keep"
        ? `Наследие сохранено: ${game.player.historicalCulture?.name || "прежнее"}. Технологии эпохи уже ваши.`
        : `Принято наследие: ${M.HISTORICAL_CULTURES.find((c: any) => c.id === id)?.name}.`,
      "ok",
    );
    if (game.player.pendingDecreeChoice) {
      go("develop");
      toast("Осталось выбрать уклад новой эпохи — вкладка «Уклады».", "info");
    }
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
      <p className="mt-3 text-[13.5px] leading-relaxed text-dim">
        Технологии эпохи уже в работе — науки, ключевой ресурс и ковка карт идут от эпохи, а не от наследия.
        Здесь решается только то, чьи обычаи и какие бонусы несёт дальше ваш народ.
      </p>

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
          <div className="mt-2 text-xs text-faint">{M.describeCultureBonus(game.player.historicalCulture)}</div>
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
            <div className="mt-2 text-xs text-faint">{M.describeCultureBonus(c)}</div>
            <Btn className="mt-4" variant="secondary" onClick={() => decide(c.id)}>Принять «{c.name}»</Btn>
          </div>
        ))}
      </div>

      <p className="mt-4 text-[11.5px] leading-relaxed text-faint">
        Выбор останется в летописи и в линии наследия; принятая культура попадёт в промпты советника — науки, постройки
        и карты кузница будет придумывать под неё. Передумать можно будет при следующем переходе эпохи.
      </p>
      {blocked && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-bad/40 bg-bad/10 px-3 py-2.5">
          <span className="text-[12px] leading-relaxed text-dim">
            Выбор не применился. Отложите окно, поправьте колоду в «Армии» и вернитесь во вкладку «Наследие» — выбор там ждёт.
          </span>
          <Btn size="sm" variant="ghost" onClick={() => setPostponed(true)}>Отложить</Btn>
        </div>
      )}
    </Modal>
  );
}

export function PageFrame({ children, wide }: { children: ReactNode; wide?: boolean }) {
  return <div className={cn("mx-auto w-full animate-rise px-4 pb-28 pt-6 lg:px-8 lg:pb-16 lg:pt-8", wide ? "max-w-7xl" : "max-w-5xl")}>{children}</div>;
}
