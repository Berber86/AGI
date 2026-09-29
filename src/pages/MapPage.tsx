import { useMemo } from "react";
import { Lock, Swords, Hammer, Flag, Crown, Sprout, ArrowRight, Info } from "lucide-react";
import { cn } from "@/utils/cn";
import { M } from "@/game/model";
import { useStore } from "@/game/store";
import { Btn, Chip, Cost, Label, Panel, ResIcon, type ResKey } from "@/components/ui";
import { PageFrame } from "@/components/Shell";

/** Расположение узлов на карте — задано вручную, чтобы дороги не пересекались (в процентах) */
const POS: Record<string, { x: number; y: number }> = {
  home: { x: 9, y: 50 },
  oasis: { x: 12, y: 85 },
  floodplain: { x: 27, y: 19 },
  hills: { x: 29, y: 80 },
  calendar: { x: 44, y: 50 },
  "salt-flats": { x: 52, y: 13 },
  copper: { x: 73, y: 27 },
  "tin-route": { x: 73, y: 76 },
  "rival-settlement": { x: 91, y: 50 },
};

const YIELD_ORDER: ResKey[] = ["food", "materials", "knowledge"];

function Yields({ y }: { y: Record<string, number> }) {
  const list = YIELD_ORDER.filter((k) => (y[k] || 0) > 0);
  if (!list.length) return null;
  return (
    <span className="inline-flex gap-2">
      {list.map((k) => <span key={k} className="inline-flex items-center gap-1 text-sm font-semibold text-parch"><ResIcon k={k} size={14} />+{y[k]}</span>)}
    </span>
  );
}

export default function MapPage() {
  const { game, selectedRegion, selectRegion, act, toast, startExpedition, resumeExpedition } = useStore();
  const p = game.player;
  const defs: any[] = M.REGION_DEFINITIONS;
  const rec = (id: string) => game.regions.find((r: any) => r.id === id);
  const ownerOf = (id: string) => rec(id)?.ownerId ?? null;

  const info = useMemo(() => {
    const out: Record<string, any> = {};
    for (const d of defs) {
      const r = rec(d.id);
      const connected = d.neighbors.some((n: string) => ownerOf(n) === "player");
      const eraOk = p.era >= d.minEra;
      out[d.id] = { r, connected, eraOk, action: M.getRegionActionState(game, d.id), owner: r?.ownerId ?? null };
    }
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game]);

  const roads = useMemo(() => {
    const seen = new Set<string>();
    const list: { a: string; b: string; mine: boolean; open: boolean }[] = [];
    for (const d of defs) for (const n of d.neighbors) {
      const key = [d.id, n].sort().join("|");
      if (seen.has(key)) continue;
      seen.add(key);
      const oa = ownerOf(d.id) === "player", ob = ownerOf(n) === "player";
      list.push({ a: d.id, b: n, mine: oa && ob, open: oa || ob });
    }
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game]);

  const sel = selectedRegion ? defs.find((d) => d.id === selectedRegion) : null;
  const opponentName = (id: string | null) => (id && id !== "player" ? game.opponents.find((o: any) => o.id === id)?.name : null);

  const owned = defs.filter((d) => info[d.id].owner === "player");
  const income = M.getRegionalIncome(game);

  return (
    <PageFrame wide>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <Label>Карта мира</Label>
          <h1 className="font-display mt-1 text-3xl font-semibold sm:text-4xl">Земли и пути</h1>
          <p className="mt-1 max-w-xl text-sm text-dim">Расширяйтесь от родного поселения к соседним землям, стройте там здания ради дохода, а затем бросьте вызов соседям.</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-dim">
          <Flag size={14} className="text-bronze" />Поход: {p.dailyOrders.frontierUsed ? "использован сегодня" : "доступен"}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
        <Panel className="overflow-hidden">
          <div className="overflow-x-auto">
            <div className="map-grid relative aspect-[16/9] min-w-[700px] bg-[radial-gradient(ellipse_at_center,rgba(217,164,69,0.07),transparent_70%)]" onClick={() => selectRegion(null)}>
              <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
                {roads.map((r) => {
                  const a = POS[r.a], b = POS[r.b];
                  return (
                    <line key={r.a + r.b} x1={a.x} y1={a.y} x2={b.x} y2={b.y} vectorEffect="non-scaling-stroke"
                      stroke={r.mine ? "#d9a445" : r.open ? "#7f735f" : "#3a3327"} strokeWidth={r.mine ? 3 : 2} strokeDasharray={r.mine ? undefined : "2 7"} strokeLinecap="round" opacity={r.mine ? 0.9 : 0.8} />
                  );
                })}
              </svg>
              {defs.map((d) => {
                const i = info[d.id];
                const pos = POS[d.id];
                const mine = i.owner === "player";
                const rival = i.owner && !mine;
                const reachable = !i.owner && i.connected && i.eraOk;
                const locked = !mine && !rival && !reachable;
                const isSel = selectedRegion === d.id;
                const canDo = i.action.enabled && (i.action.action === "settle" || i.action.action === "build" || i.action.action === "attack");
                return (
                  <button
                    key={d.id}
                    onClick={(e) => { e.stopPropagation(); selectRegion(isSel ? null : d.id); }}
                    className="group absolute -translate-x-1/2 -translate-y-1/2 outline-none"
                    style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                    aria-label={d.name}
                  >
                    <span className={cn(
                      "relative grid h-[68px] w-[68px] place-items-center rounded-full border-2 text-[30px] transition-all",
                      mine && "border-bronze bg-[#2c2413] shadow-[0_0_28px_-6px_rgba(217,164,69,0.55)]",
                      rival && "border-clay bg-[#2b1a14]",
                      reachable && "border-dashed border-bronze-soft/70 bg-raised",
                      locked && "border-line bg-surface opacity-55",
                      isSel && "scale-110 ring-4 ring-bronze/30",
                      !isSel && "group-hover:scale-105",
                    )}>
                      <span className={locked ? "grayscale" : ""}>{d.icon}</span>
                      {reachable && <span className="absolute inset-[-7px] animate-pulse-soft rounded-full border border-bronze/40" />}
                      {locked && <Lock size={14} className="absolute -right-1 -top-1 rounded-full bg-ground p-0.5 text-faint" />}
                      {mine && d.kind !== "home" && !i.r?.building && M.REGION_BUILDINGS[d.id] && (
                        <span className="absolute -right-1 -top-1 grid h-6 w-6 place-items-center rounded-full bg-bronze text-ground" title="Можно построить здание"><Hammer size={12} /></span>
                      )}
                      {mine && i.r?.building && <span className="absolute -right-1 -top-1 grid h-6 w-6 place-items-center rounded-full bg-ok text-ground text-[11px] font-bold">✓</span>}
                      {rival && <span className="absolute -right-1 -top-1 grid h-6 w-6 place-items-center rounded-full bg-clay text-ground"><Swords size={12} /></span>}
                      {canDo && !mine && <span className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-bronze" />}
                    </span>
                    <span className={cn("absolute left-1/2 top-full mt-2 block w-[130px] -translate-x-1/2 text-center text-[12px] font-medium leading-tight", isSel ? "text-parch" : mine ? "text-bronze-soft" : locked ? "text-faint" : "text-dim")}>{d.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line px-4 py-3 text-[11.5px] text-dim">
            <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full border-2 border-bronze bg-[#2c2413]" />Ваши земли</span>
            <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full border-2 border-dashed border-bronze-soft/70" />Можно занять</span>
            <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full border-2 border-clay bg-[#2b1a14]" />Соперник</span>
            <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full border-2 border-line" />Пока недоступно</span>
          </div>
        </Panel>

        <aside className="space-y-4">
          {sel ? <RegionPanel def={sel} info={info[sel.id]} opponentName={opponentName(info[sel.id].owner)} act={act} toast={toast} startExpedition={startExpedition} resumeExpedition={resumeExpedition} /> : (
            <Panel className="p-5">
              <Label>Ваши земли</Label>
              <div className="mt-3 space-y-2">
                {owned.map((d) => {
                  const r = info[d.id].r;
                  const b = M.REGION_BUILDINGS[d.id];
                  return (
                    <button key={d.id} onClick={() => selectRegion(d.id)} className="flex w-full items-center gap-3 rounded-xl border border-line bg-raised/50 px-3 py-2.5 text-left hover:bg-raised">
                      <span className="text-2xl">{d.icon}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium">{d.name}</span>
                        <span className="block truncate text-xs text-faint">{d.kind === "home" ? "Родное поселение" : r?.building ? r.buildingFlavor?.name || b?.name : b ? `Можно построить: ${b.name}` : "Без здания"}</span>
                      </span>
                      {r?.building && b && <Yields y={b.yields} />}
                    </button>
                  );
                })}
              </div>
              <div className="mt-4 flex items-center justify-between rounded-xl bg-ground/60 px-3 py-2.5 text-sm">
                <span className="text-dim">Доход земель в день</span>
                <span className="flex gap-2.5">{YIELD_ORDER.some((k) => income[k] > 0) ? <Yields y={income} /> : <span className="text-faint">пока нет</span>}</span>
              </div>
              <p className="mt-4 flex gap-2 text-xs leading-relaxed text-faint"><Info size={14} className="mt-0.5 shrink-0" />Нажмите на регион на карте, чтобы увидеть, что там можно сделать.</p>
            </Panel>
          )}
        </aside>
      </div>
    </PageFrame>
  );
}

function RegionPanel({ def, info, opponentName, act, toast, startExpedition, resumeExpedition }: any) {
  const { game } = useStore();
  const rb = M.REGION_BUILDINGS[def.id];
  const a = info.action;
  const r = info.r;
  const mine = info.owner === "player";
  const kind = def.kind === "home" ? "Родное поселение" : def.kind === "settlement" ? "Поселение соперника" : "Ресурсный регион";
  const have = game.player.resources;

  const run = () => {
    if (a.action === "settle") { if (act((s: any) => M.settleRegion(s, def.id), { silent: true })) toast(`«${def.name}» теперь ваша земля. Постройте здание, чтобы получать доход.`, "ok"); }
    else if (a.action === "build") { const res = act((s: any) => M.buildRegionBuilding(s, def.id), { silent: true }); if (res) toast(`Здание построено в «${def.name}».`, "ok"); }
    else if (a.action === "attack") startExpedition(def.id);
    else if (a.action === "resume" || a.action === "return") resumeExpedition();
  };
  const label = { settle: "Заселить землю", build: `Построить: ${rb?.name ?? ""}`, attack: "Начать экспедицию", resume: "Продолжить экспедицию", return: "Вернуться к бою" }[a.action as string];
  const orderName = a.action === "settle" || a.action === "attack" ? "Использует приказ «Поход»." : a.action === "build" ? "Использует приказ «Строительство»." : "";

  return (
    <Panel className="animate-rise p-5">
      <div className="flex items-start gap-3">
        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-line-strong bg-ground text-3xl">{def.icon}</span>
        <div className="min-w-0">
          <h2 className="font-display text-xl font-semibold leading-tight">{def.name}</h2>
          <div className="mt-1 flex flex-wrap gap-1.5">
            <Chip>{kind}</Chip>
            {mine ? <Chip tone="bronze"><Crown size={11} />Ваша</Chip> : info.owner ? <Chip tone="clay">{opponentName ?? "Соперник"}</Chip> : <Chip>Ничья</Chip>}
          </div>
        </div>
      </div>
      <p className="mt-4 text-[13.5px] leading-relaxed text-dim">{def.description}</p>

      {rb && (
        <div className="mt-4 rounded-xl border border-line bg-ground/50 p-3.5">
          <div className="flex items-center justify-between gap-2">
            <div><Label>Здание региона</Label><div className="mt-0.5 text-sm font-semibold">{r?.building ? (r.buildingFlavor?.name || rb.name) : rb.name}</div></div>
            <Yields y={rb.yields} />
          </div>
          <p className="mt-1.5 text-xs leading-relaxed text-faint">{rb.description}</p>
          {rb.unlocks && <p className="mt-2 flex items-center gap-1.5 text-xs text-know"><Sprout size={12} />{rb.unlocks.includes("masterwork") ? "Вместе с плавильней открывает мастерское сырьё для ковки" : "Открывает отборное сырьё для ковки"}</p>}
          {!r?.building && <div className="mt-2 flex items-center gap-2 text-xs text-dim">Стоимость: <Cost cost={rb.cost} have={have} /></div>}
          {r?.building && <div className="mt-2 text-xs font-medium text-ok">Построено · приносит доход каждый день</div>}
        </div>
      )}

      {!mine && (
        <div className="mt-4 space-y-1.5 text-xs text-dim">
          <div className={cn("flex items-center gap-2", info.eraOk ? "text-ok" : "text-faint")}>{info.eraOk ? "✓" : "○"} Эпоха «{M.eraName(def.minEra)}» {info.eraOk ? "открыта" : "ещё не наступила"}</div>
          <div className={cn("flex items-center gap-2", info.connected ? "text-ok" : "text-faint")}>{info.connected ? "✓" : "○"} Граничит с вашими землями</div>
        </div>
      )}

      {label && (
        <div className="mt-5">
          {a.cost && <div className="mb-2 flex items-center justify-between text-xs text-dim"><span>Цена {a.action === "attack" ? "экспедиции" : a.action === "settle" ? "заселения" : "здания"}</span><Cost cost={a.cost} have={have} /></div>}
          <Btn variant="primary" size="lg" className="w-full" disabled={!a.enabled} onClick={run}>
            {a.action === "attack" ? <Swords size={18} /> : a.action === "build" ? <Hammer size={18} /> : <Flag size={18} />}{label}<ArrowRight size={16} className="opacity-60" />
          </Btn>
          {!a.enabled && a.reason && <p className="mt-2 text-xs leading-relaxed text-bad/90">{a.reason}</p>}
          {a.enabled && orderName && <p className="mt-2 text-xs text-faint">{orderName}</p>}
          {a.action === "attack" && a.enabled && <p className="mt-2 text-xs leading-relaxed text-faint">Победа в бою отдаёт вам регион. При поражении ресурсы и приказ потеряны.</p>}
        </div>
      )}
      {!label && mine && def.kind === "home" && <p className="mt-4 text-xs text-faint">Дом народа — отсюда идут все пути. Здание здесь не нужно.</p>}
    </Panel>
  );
}
