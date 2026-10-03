import { useState } from "react";
import { Telescope, Hammer, Compass, Anvil, Minus, Plus, Check, ArrowRight, Users, Lightbulb, Trophy, Scroll, Sparkles, Crown, Flame } from "lucide-react";
import { cn } from "@/utils/cn";
import { M } from "@/game/model";
import { useDerived, useStore, type Page } from "@/game/store";
import { Btn, Chip, Heading, Label, Meter, Panel, ResIcon, RES, Tabs, fmt, signed, type ResKey } from "@/components/ui";
import { PageFrame } from "@/components/Shell";

interface Next { title: string; text: string; cta: { label: string; page: Page } | null; tone: "bronze" | "bad" | "ok" }

function useNext(): Next {
  const { game } = useStore();
  const { net } = useDerived();
  const p = game.player;
  if (p.pendingExpedition) return { title: "Экспедиция ждёт вас", text: "Начатый поход нужно закончить, прежде чем продолжить день.", cta: { label: "К карте", page: "map" }, tone: "bronze" };
  if (p.pendingDecreeChoice) return { title: "Выберите уклад новой эпохи", text: "Народ вошёл в новую эпоху. Уклад определит производство и состав армии на много дней вперёд.", cta: { label: "Выбрать уклад", page: "develop" }, tone: "bronze" };
  if (p.pendingCultureChoice) return { title: "Выберите наследие новой эпохи", text: "Принять культуру нового времени или сохранить прежнее наследие — технологии эпохи (науки, ключевой ресурс, ковка карт) доступны в обоих случаях.", cta: { label: "Выбрать наследие", page: "develop" }, tone: "bronze" };
  const daysFood = net.food < 0 ? p.resources.food / -net.food : Infinity;
  if (daysFood < 3) return { title: `Провизии хватит на ${Math.max(1, Math.floor(daysFood))} дн.`, text: "Народ съедает больше, чем приносят поля. Направьте рабочих на провизию или займите плодородные земли.", cta: null, tone: "bad" };
  if (p.craftOrders.some((o: any) => o.status === "ready")) return { title: "В кузнице ждёт готовая карта", text: "Мастер закончил работу. Заберите карту, чтобы она попала в коллекцию.", cta: { label: "Забрать в кузнице", page: "forge" }, tone: "ok" };
  if (p.workers.idle > 0) return { title: `${p.workers.idle} без дела`, text: "Свободные люди не приносят ресурсов. Назначьте их на провизию, материалы или знания.", cta: null, tone: "bronze" };
  if (game.day >= M.SEASON_LENGTH) return { title: "Сезон подходит к концу", text: "Заберите готовые карты и подведите итоги — вы получите медаль и начнёте новый сезон.", cta: null, tone: "ok" };
  const research = p.blueprints.find((b: any) => !b.researched);
  const build = p.blueprints.find((b: any) => b.researched && !b.built);
  // order_capacity от построек советника может поднять дневной лимит приказа с 1 до 2 —
  // подсказка должна учитывать реальный лимит, а не считать приказ потраченным после первого раза.
  const orderCap = M.getOrderCapacity(game);
  if (p.ap > 0 && (p.dailyOrders.constructionUsed || 0) < orderCap && build) return { title: `Постройте «${build.buildingName}»`, text: "Чертёж изучен — здание даст постоянный бонус.", cta: { label: "К развитию", page: "develop" }, tone: "bronze" };
  if (p.ap > 0 && (p.dailyOrders.researchUsed || 0) < orderCap && research) return { title: `Изучите «${research.scienceName}»`, text: "Новая наука приближает следующую эпоху.", cta: { label: "К развитию", page: "develop" }, tone: "bronze" };
  if (p.ap > 0) return { title: "У вас остались приказы", text: "Придумайте новое исследование, займите землю или откуйте карту. Или завершите день.", cta: { label: "К карте", page: "map" }, tone: "bronze" };
  return { title: "Приказы на сегодня исчерпаны", text: "Нажмите «Завершить день» — народ соберёт ресурсы, и завтра будут новые приказы.", cta: null, tone: "ok" };
}

function NextCard() {
  const { go } = useStore();
  const next = useNext();
  return (
    <Panel className={cn("paper overflow-hidden p-5 sm:p-6", next.tone === "bad" && "border-bad/40")}>
      <div className="flex items-start gap-4">
        <div className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-xl", next.tone === "bad" ? "bg-bad/15 text-bad" : next.tone === "ok" ? "bg-ok/15 text-ok" : "bg-bronze/15 text-bronze")}><Lightbulb size={22} /></div>
        <div className="min-w-0 flex-1">
          <Label>Что дальше</Label>
          <h2 className="font-display mt-0.5 text-2xl font-semibold leading-snug">{next.title}</h2>
          <p className="mt-1.5 max-w-2xl text-[14px] leading-relaxed text-dim">{next.text}</p>
          {next.cta && <Btn variant="primary" className="mt-4" onClick={() => go(next.cta!.page)}>{next.cta.label}<ArrowRight size={16} /></Btn>}
        </div>
      </div>
    </Panel>
  );
}

function Orders() {
  const { game, go } = useStore();
  const p = game.player;
  // order_capacity от построек советника может поднять дневной лимит КАЖДОГО приказа с 1 до 2
  // (можно повторить тот же тип за день) — см. campaign.js getOrderCapacity.
  const orderCap = M.getOrderCapacity(game);
  const items: { key: string; count: number; used: boolean; label: string; hint: string; Icon: typeof Hammer; page: Page }[] = [
    { key: "researchUsed", count: p.dailyOrders.researchUsed || 0, used: (p.dailyOrders.researchUsed || 0) >= orderCap, label: "Исследование", hint: "Изучить науку или принять замысел", Icon: Telescope, page: "develop" },
    { key: "constructionUsed", count: p.dailyOrders.constructionUsed || 0, used: (p.dailyOrders.constructionUsed || 0) >= orderCap, label: "Строительство", hint: "Здание на карте или чертёж", Icon: Hammer, page: "develop" },
    { key: "frontierUsed", count: p.dailyOrders.frontierUsed || 0, used: (p.dailyOrders.frontierUsed || 0) >= orderCap, label: "Поход", hint: "Занять землю", Icon: Compass, page: "map" },
    { key: "craftUsed", count: p.dailyOrders.craftUsed || 0, used: (p.dailyOrders.craftUsed || 0) >= orderCap, label: "Ковка", hint: "Новая карта", Icon: Anvil, page: "forge" },
    // Слово народа: земля присоединяется проповедью за 🙏, без требования соседства и без боя.
    { key: "missionUsed", count: p.dailyOrders.missionUsed || 0, used: (p.dailyOrders.missionUsed || 0) >= orderCap, label: "Миссия", hint: "Присоединить землю словом", Icon: Flame, page: "map" },
  ];
  return (
    <Panel className="p-5">
      <div className="flex items-center justify-between">
        <Heading title="Приказы дня" className="[&_h2]:text-lg" />
        <Chip tone={p.ap > 0 ? "bronze" : "neutral"}>{p.ap > 0 ? `Осталось ${p.ap} из ${p.apMax}` : "Приказы исчерпаны"}</Chip>
      </div>
      <p className="mt-1 text-[13px] text-dim">Выберите любые {p.apMax} из пяти — каждый тип можно выполнить {orderCap > 1 ? `до ${orderCap} раз` : "один раз"} в день.</p>
      <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-5">
        {items.map(({ key, count, used, label, hint, Icon, page }) => (
          <button key={key} onClick={() => go(page)} disabled={false}
            className={cn("group flex flex-col items-start gap-2 rounded-xl border p-3 text-left transition-colors", used ? "border-line bg-ground/40 text-faint" : p.ap > 0 ? "border-line-strong bg-raised hover:border-bronze/60" : "border-line bg-ground/40 text-faint")}>
            <span className="flex w-full items-center justify-between">
              <Icon size={20} className={used ? "text-faint" : p.ap > 0 ? "text-bronze" : "text-faint"} />
              {used && <Check size={16} className="text-ok" />}
            </span>
            <span>
              <span className={cn("block text-sm font-semibold", used ? "text-dim" : "text-parch")}>{label}</span>
              <span className="block text-[11.5px] text-faint">{(used ? "Выполнено сегодня" : hint) + (orderCap > 1 ? ` (${count}/${orderCap})` : "")}</span>
            </span>
          </button>
        ))}
      </div>
    </Panel>
  );
}

function People() {
  const { game, act } = useStore();
  const { breakdown: b, cap, cfg } = useDerived();
  const p = game.player;
  const rows: { k: ResKey; perWorker: number; workers: number; total: number }[] = (["food", "materials", "knowledge", "faith"] as ResKey[]).map((k) => ({
    k, workers: p.workers[k], perWorker: b.workerBase[k] + b.workerBonus[k], total: b.workerProduction[k],
  }));
  const move = (from: string, to: string) => act((s) => M.assignWorker(s, from, to), { silent: true });
  return (
    <Panel className="p-5">
      <div className="flex items-center justify-between">
        <Heading title="Народ и работа" className="[&_h2]:text-lg" />
        <Chip><Users size={12} />{p.population} чел.</Chip>
      </div>
      <div className="mt-4 divide-y divide-line">
        {rows.map(({ k, workers, perWorker, total }) => (
          <div key={k} className="flex items-center gap-3 py-2.5">
            <span className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-lg", RES[k].bg)}><ResIcon k={k} size={18} /></span>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium">{RES[k].label}</div>
              <div className="text-xs text-faint">{fmt(perWorker)} с человека · всего {signed(total)}/день</div>
            </div>
            <div className="flex items-center gap-1">
              <button aria-label="Убрать рабочего" disabled={workers <= 0} onClick={() => move(k, "idle")} className="grid h-8 w-8 place-items-center rounded-lg border border-line-strong text-dim hover:bg-raised disabled:opacity-30"><Minus size={15} /></button>
              <span className="w-8 text-center text-base font-bold tabular-nums">{workers}</span>
              <button aria-label="Добавить рабочего" disabled={p.workers.idle <= 0} onClick={() => move("idle", k)} className="grid h-8 w-8 place-items-center rounded-lg border border-line-strong text-dim hover:bg-raised disabled:opacity-30"><Plus size={15} /></button>
            </div>
          </div>
        ))}
        <div className="flex items-center gap-3 py-2.5">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-raised text-faint"><Users size={18} /></span>
          <div className="flex-1"><div className="text-sm font-medium">Без дела</div><div className="text-xs text-faint">Ничего не приносят, но едят</div></div>
          <span className={cn("w-8 text-center text-base font-bold tabular-nums", p.workers.idle > 0 && "text-bronze")}>{p.workers.idle}</span>
          <span className="w-[74px]" />
        </div>
      </div>
      <p className="mt-2 text-[12.5px] leading-relaxed text-faint">
        Расход: <b className="text-dim">{fmt(b.consumption)} 🌾</b> на еду и <b className="text-dim">{fmt(b.upkeep)} 🪵</b> на содержание в день.
      </p>
      <details className="mt-2 rounded-xl border border-line bg-ground/40 px-3 py-2.5 text-[12.5px]">
        <summary className="cursor-pointer font-medium text-dim hover:text-parch">Свод правил: склад, рост народа, походы, бой</summary>
        <ul className="mt-2 space-y-1.5 leading-relaxed text-dim">
          <li>• <b className="text-parch">Склад:</b> вмещает {cap} каждого ресурса; излишек сверх склада тает вдвое — вовремя пускайте запасы в дело.</li>
          <li>• <b className="text-parch">Рост:</b> +1 человек, если провизии на складе больше 10 и дневной профицит еды больше 2 (35% за день). Голод, наоборот, уносит людей.</li>
          <li>• <b className="text-parch">Походы:</b> освоение свободной клетки — 2 🌾 + 2 🪵; квестовый бой и экспедиция — 4 🌾 + 2 🪵. При поражении отряд возвращает 2 🌾 припасов, но приказ и материалы теряются.</li>
          <li>• <b className="text-parch">Бой:</b> колода {cfg.deckLimit} карт, свободные места добирает ополчение. Вы ходите первым; с 6-го хода пустая колода бьёт вождя нарастающей усталостью — затягивать нельзя обеим сторонам.</li>
          <li>• <b className="text-parch">Запасы дробные:</b> доход 0.7 в день копится и округляется только на экране — один работник на знаниях рано или поздно окупается.</li>
        </ul>
      </details>
    </Panel>
  );
}

function Identity() {
  const { game } = useStore();
  const p = game.player;
  const origin = M.ORIGINS.find((o: any) => o.id === p.originId);
  const facts = [
    { label: "Происхождение", v: origin && `${origin.icon} ${origin.name}` },
    { label: "Земля", v: p.biome && `${p.biome.icon} ${p.biome.name}` },
    { label: "География", v: p.geography && `${p.geography.icon ?? ""} ${p.geography.name}` },
    { label: "Черта народа", v: p.trait && `${p.trait.icon} ${p.trait.name}` },
    { label: "Рядом", v: p.nearby && `${p.nearby.icon} ${p.nearby.name}` },
    { label: "Наследие", v: p.historicalCulture && `${p.historicalCulture.icon} ${p.historicalCulture.name}` },
  ].filter((f) => f.v);
  return (
    <Panel className="p-5">
      <Heading title="Наш народ" className="[&_h2]:text-lg" />
      <dl className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
        {facts.map((f) => (<div key={f.label}><dt className="text-[11px] uppercase tracking-wider text-faint">{f.label}</dt><dd className="text-sm text-parch">{f.v}</dd></div>))}
      </dl>
      {p.trait && <p className="mt-4 text-[13px] italic leading-relaxed text-dim">{p.trait.desc}</p>}
    </Panel>
  );
}

function EraTrack() {
  const { game } = useStore();
  const p = game.player;
  // Эпоха наступает сама в конце дня, когда просветление 2·📚 + 1·🙏 доходит до порога эпохи.
  const prog: any = M.getEraProgress(game);
  return (
    <Panel className="p-5">
      <div className="flex items-center justify-between">
        <Heading title={M.eraName(p.era)} eyebrow="Эпоха" className="[&_h2]:text-xl" />
        <Chip tone={prog.finalEra ? "neutral" : prog.ready ? "ok" : "bronze"}>
          <Telescope size={12} />{prog.finalEra ? "Последняя эпоха открыта" : `Просветление ${Math.floor(prog.score)}/${prog.threshold}`}
        </Chip>
      </div>
      <div className="mt-4 flex items-center gap-1">
        {M.ERAS.map((e: string, i: number) => (
          <div key={e} className="group relative flex-1" title={e}>
            <div className={cn("h-2 rounded-full", i < p.era ? "bg-bronze" : i === p.era ? "bg-bronze-soft" : "bg-line")} />
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-between text-[11px] text-faint"><span>{M.ERAS[0]}</span><span>{M.ERAS[M.ERAS.length - 1].replace(/ 20.*/, "")}</span></div>
      {!prog.finalEra && (
        <div className="mt-4 rounded-xl border border-line bg-ground/50 p-3.5">
          <div className="flex items-center justify-between gap-2 text-xs">
            <Label>Просветление эпохи · {prog.formula}</Label>
            <span className="tabular-nums text-dim">{fmt(prog.score, 1)} / {prog.threshold}</span>
          </div>
          <Meter value={prog.score} max={prog.threshold} className="mt-2" />
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11.5px] text-faint">
            <span className="inline-flex items-center gap-1"><ResIcon k="knowledge" size={12} />{fmt(prog.knowledge, 1)} × 2 = {fmt(prog.knowledge * 2, 1)}</span>
            <span className="inline-flex items-center gap-1"><ResIcon k="faith" size={12} />{fmt(prog.faith, 1)} × 1 = {fmt(prog.faith, 1)}</span>
            <span>до «{prog.nextEraLabel}» не хватает {fmt(Math.max(0, prog.remaining), 1)}</span>
          </div>
          <p className="mt-2 text-[11.5px] leading-relaxed text-faint">
            Эпоха наступает сама в конце дня, когда 2·📚 + 1·🙏 доходит до {prog.threshold}. В переходе половина знаний и духовности сгорает — собор, перепись и обряды, — поэтому копить придётся заново.
          </p>
        </div>
      )}
    </Panel>
  );
}

function Chronicle() {
  const { game } = useStore();
  const p = game.player;
  const lineage = (p.culturalLineage || []).map((id: string) => M.HISTORICAL_CULTURES.find((c: any) => c.id === id)).filter(Boolean);
  const eraRecord: any = M.ERA_HISTORICAL?.[p.era];
  return (
    <div className="grid gap-4 lg:grid-cols-[3fr_2fr]">
      <Panel className="p-5">
        <Heading title="Летопись народа" className="[&_h2]:text-lg" />
        {p.chronicle.length === 0 ? <p className="mt-4 text-sm text-dim">Пока нет записей. Каждое открытие и эпоха оставляют след в истории.</p> : (
          <ol className="relative mt-5 space-y-5 border-l border-line-strong pl-5">
            {[...p.chronicle].reverse().map((c: any, i: number) => (
              <li key={i} className="relative">
                <span className="absolute -left-[26px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-surface bg-bronze" />
                <div className="text-[11px] font-semibold uppercase tracking-wider text-faint">День {c.day} · {M.eraName(c.era)}</div>
                <p className="mt-0.5 text-[13.5px] leading-relaxed text-parch/90">{c.text}</p>
              </li>
            ))}
          </ol>
        )}
      </Panel>
      <div className="space-y-4">
        <Panel className={cn("p-5", p.pendingCultureChoice && "border-bronze/40 bg-bronze/8")}>
          <Heading title="Линия культур" eyebrow={`Эпоха «${M.eraName(p.era)}»`} className="[&_h2]:text-lg" />
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {lineage.map((c: any, i: number) => (<span key={c.id} className="flex items-center gap-1.5"><Chip tone={c.id === p.historicalCulture?.id ? "bronze" : "neutral"}>{c.icon} {c.name}</Chip>{i < lineage.length - 1 && <ArrowRight size={12} className="text-faint" />}</span>))}
          </div>
          {eraRecord?.tech?.length > 0 && (
            <p className="mt-3 text-[13px] leading-relaxed text-dim">Технологии эпохи: {eraRecord.tech.join(", ")}.</p>
          )}
          {p.pendingCultureChoice ? (
            <p className="mt-3 text-[13px] leading-relaxed text-parch">Ждёт решения: принять культуру эпохи «{M.eraName(p.era)}» или сохранить прежнее наследие. Технологии уже ваши в любом случае.</p>
          ) : (
            <p className="mt-3 text-xs text-faint">При переходе эпохи вы сами решаете, принять культуру нового времени или сохранить прежнее наследие.</p>
          )}
        </Panel>
        <Panel className="p-5">
          <Heading title="Медали сезонов" className="[&_h2]:text-lg" />
          {game.medals.length === 0 ? <p className="mt-3 text-sm text-dim">Медаль вручают по итогам 30-дневного сезона.</p> : (
            <ul className="mt-3 space-y-2">{game.medals.map((m: any) => (<li key={m.id} className="flex items-center gap-2.5 text-sm"><Trophy size={16} className="text-bronze" /><span>{m.name}</span></li>))}</ul>
          )}
        </Panel>
      </div>
    </div>
  );
}

function Rivals() {
  const { game, go, startPractice } = useStore();
  const pr = game.player.practice;
  return (
    <div className="grid gap-4 lg:grid-cols-[3fr_2fr]">
      <Panel className="p-5">
        <Heading title="Соседние народы" className="[&_h2]:text-lg" />
        <p className="mt-1 text-sm text-dim">Соперники развиваются сами. Победа в экспедиции отнимает у них землю.</p>
        <ul className="mt-4 space-y-3">
          {game.opponents.map((o: any) => (
            <li key={o.id} className="flex flex-wrap items-center gap-4 rounded-xl border border-line bg-raised/40 p-4">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-ground text-clay"><Crown size={20} /></span>
              <div className="min-w-0 flex-1">
                <div className="font-medium">{o.name} {o.leader && <Chip tone="clay" className="ml-1">лидер</Chip>}</div>
                <div className="text-xs text-faint">{o.clan} · рейтинг {o.rating}</div>
                <div className="mt-2 flex items-center gap-2"><span className="text-xs text-dim">{M.eraName(o.era)}</span><Meter value={o.research} max={2} className="w-20" /></div>
              </div>
              <Btn size="sm" onClick={() => { startPractice(o.id); }}>Тренировка</Btn>
            </li>
          ))}
        </ul>
      </Panel>
      <Panel className="p-5">
        <Heading title="Ваши бои" className="[&_h2]:text-lg" />
        <dl className="mt-4 grid grid-cols-2 gap-3 text-center">
          {[["Победы", pr.wins + pr.leaderWins], ["Поражения", pr.losses + pr.leaderLosses]].map(([l, v]) => (
            <div key={l as string} className="rounded-xl bg-ground/60 py-4"><dd className="font-display text-3xl font-semibold">{v}</dd><dt className="text-xs text-faint">{l}</dt></div>
          ))}
        </dl>
        <Btn variant="secondary" className="mt-4 w-full" onClick={() => go("army")}>К армии</Btn>
      </Panel>
    </div>
  );
}

export default function Home() {
  const { game } = useStore();
  const [tab, setTab] = useState<"overview" | "chronicle" | "rivals">("overview");
  const p = game.player;
  return (
    <PageFrame>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Label>Сезон {game.season} · день {game.day}</Label>
          <h1 className="font-display mt-1 text-3xl font-semibold sm:text-4xl">{p.name}</h1>
          <p className="mt-1 text-sm text-dim">{p.clan} · {M.eraName(p.era)}</p>
        </div>
        <Tabs value={tab} onChange={setTab} items={[{ id: "overview", label: "Обзор" }, { id: "chronicle", label: "Летопись" }, { id: "rivals", label: "Соседи" }]} />
      </div>

      {tab === "overview" && (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <div className="space-y-4">
            <NextCard />
            <Orders />
            <People />
          </div>
          <div className="space-y-4">
            <EraTrack />
            <Identity />
            {game.day >= M.SEASON_LENGTH && (
              <Panel className="border-bronze/40 bg-bronze/8 p-5"><div className="flex items-center gap-3"><Sparkles className="text-bronze" /><div><div className="font-semibold">Последний день сезона</div><div className="text-sm text-dim">Нажмите «Итоги сезона» вверху.</div></div></div></Panel>
            )}
            <Panel className="p-5">
              <div className="flex items-center gap-2 text-dim"><Scroll size={16} className="text-bronze" /><Label>Последняя запись</Label></div>
              <p className="mt-2 text-[13px] leading-relaxed text-parch/90">{p.chronicle.length ? p.chronicle[p.chronicle.length - 1].text : "Летопись пока пуста."}</p>
              <button onClick={() => setTab("chronicle")} className="mt-2 text-xs font-medium text-bronze hover:underline">Вся летопись →</button>
            </Panel>
          </div>
        </div>
      )}
      {tab === "chronicle" && <Chronicle />}
      {tab === "rivals" && <Rivals />}
    </PageFrame>
  );
}
