import { useMemo } from "react";
import { Lock, Swords, Hammer, Flag, Crown, Sprout, ArrowRight, Compass, Shield } from "lucide-react";
import { cn } from "@/utils/cn";
import { M } from "@/game/model";
import { currentGuideStep, useStore } from "@/game/store";
import { Btn, Chip, Cost, Label, Panel, ResIcon, type ResKey } from "@/components/ui";
import { PageFrame } from "@/components/Shell";

const YIELD_ORDER: ResKey[] = ["food", "materials", "knowledge"];
const SITE_LABEL: Record<string, string> = {
  food: "Пища и вода",
  materials: "Камень и древесина",
  knowledge: "Место наблюдений",
  copper: "Медная жила",
  tin: "Оловянный путь",
  salt: "Соляное место",
  obsidian: "Обсидиановая жила",
  iron: "Железная руда",
  settlement: "Поселение",
  home: "Стартовое поселение",
  water: "Вода",
};
const FEATURE_LABEL: Record<string, string> = {
  river: "Река",
  settlement: "Поселение соседей",
  "copper-vein": "Медное месторождение",
  "tin-route": "Оловянный путь",
  "salt-deposit": "Соляное место",
  "obsidian-vein": "Обсидиановая жила",
  "iron-vein": "Железная руда",
};
const TERRAIN_PAINT: Record<string, { color: string; image: string }> = {
  water: {
    color: "#244852",
    image: "repeating-radial-gradient(ellipse at 45% 50%, transparent 0 12px, rgba(142,219,218,.13) 13px 14px, transparent 15px 24px), linear-gradient(145deg,#356670,#18363e)",
  },
  plains: {
    color: "#77744a",
    image: "radial-gradient(ellipse at 25% 15%,rgba(235,211,137,.24),transparent 58%),repeating-linear-gradient(165deg,transparent 0 13px,rgba(244,220,135,.10) 13px 14px,transparent 15px 24px),linear-gradient(145deg,#928b55,#5b6743)",
  },
  forest: {
    color: "#34533f",
    image: "radial-gradient(circle at 25% 28%,rgba(171,196,116,.34) 0 8%,transparent 9%),radial-gradient(circle at 70% 68%,rgba(24,63,48,.8) 0 17%,transparent 18%),linear-gradient(145deg,#48684b,#203e32)",
  },
  hills: {
    color: "#625e48",
    image: "radial-gradient(ellipse at 30% 70%,rgba(225,201,139,.32),transparent 36%),radial-gradient(ellipse at 72% 25%,rgba(44,57,45,.4),transparent 42%),linear-gradient(145deg,#817658,#4d5747)",
  },
  mountain: {
    color: "#525b57",
    image: "repeating-linear-gradient(138deg,transparent 0 13px,rgba(236,231,211,.14) 13px 14px,transparent 15px 22px),linear-gradient(145deg,#777e78,#3e4946)",
  },
  wetlands: {
    color: "#4b6552",
    image: "repeating-linear-gradient(90deg,transparent 0 12px,rgba(210,211,137,.14) 12px 13px,transparent 14px 22px),radial-gradient(ellipse at 50% 70%,rgba(25,87,72,.65),transparent 60%),linear-gradient(145deg,#667653,#3c5648)",
  },
  desert: {
    color: "#8c714c",
    image: "repeating-linear-gradient(162deg,transparent 0 12px,rgba(255,225,157,.18) 12px 13px,transparent 14px 25px),linear-gradient(145deg,#b4955e,#7e6546)",
  },
  coast: {
    color: "#4f7972",
    image: "radial-gradient(ellipse at 75% 20%,rgba(229,213,155,.3),transparent 44%),linear-gradient(145deg,#7c9069,#477a74 70%,#315c64)",
  },
};

function Yields({ y }: { y: Record<string, number> }) {
  const list = YIELD_ORDER.filter((k) => (y[k] || 0) > 0);
  if (!list.length) return null;
  return (
    <span className="inline-flex flex-wrap gap-2">
      {list.map((k) => (
        <span key={k} className="inline-flex items-center gap-1 text-sm font-semibold text-parch">
          <ResIcon k={k} size={14} />+{y[k]}
        </span>
      ))}
    </span>
  );
}

function tileMarker(tile: any, ownerId: string | null) {
  if (tile.kind === "home") return "⌂";
  if (tile.kind === "settlement") return "⚑";
  if (tile.guard && ownerId !== "player") return "⚔";
  if (tile.feature === "copper-vein") return "◆";
  if (tile.feature === "tin-route") return "◇";
  if (tile.feature === "salt-deposit") return "✦";
  if (tile.feature === "obsidian-vein") return "▲";
  if (tile.feature === "iron-vein") return "■";
  return ownerId === "player" ? "●" : "";
}

export default function MapPage() {
  const { game, selectedRegion, selectRegion, act, toast, startExpedition, resumeExpedition, nameRegionBuilding } = useStore();
  const definitions: any[] = game.world?.tiles || [];
  const visibleIds = useMemo(() => new Set<string>(M.getVisibleRegionIds(game)), [game]);
  const records = useMemo(() => new Map<string, any>(game.regions.map((r: any): [string, any] => [r.id, r])), [game.regions]);
  const definitionById = useMemo(() => new Map(definitions.map((tile) => [tile.id, tile])), [definitions]);
  const info = useMemo(() => {
    const out: Record<string, any> = {};
    for (const tile of definitions) {
      const record = records.get(tile.id);
      const connected = tile.neighbors.some((id: string) => records.get(id)?.ownerId === "player");
      const owner = record?.ownerId ?? null;
      out[tile.id] = {
        record,
        owner,
        connected,
        eraOk: game.player.era >= tile.minEra,
        action: visibleIds.has(tile.id)
          ? M.getRegionActionState(game, tile.id)
          : { action: "blocked", enabled: false, reason: "Эта область скрыта туманом войны." },
      };
    }
    return out;
  }, [definitions, game, records, visibleIds]);

  const riverSegments = useMemo(() => {
    const segments: string[] = [];
    let current: string[] = [];
    for (const id of game.world?.rivers || []) {
      const tile: any = definitionById.get(id);
      if (!tile || !visibleIds.has(id)) {
        if (current.length > 1) segments.push(current.join(" "));
        current = [];
        continue;
      }
      current.push(`${(tile.x + 0.5) * 100},${(tile.y + 0.5) * 100}`);
    }
    if (current.length > 1) segments.push(current.join(" "));
    return segments;
  }, [definitionById, game.world?.rivers, visibleIds]);

  const guided = currentGuideStep(game);
  const territoryStep = guided?.step.id === "territory" ? guided : null;
  const selected = selectedRegion && visibleIds.has(selectedRegion) ? definitionById.get(selectedRegion) : null;
  const ownerOf = (id: string) => info[id]?.owner ?? null;
  const ownerName = (id: string | null) => {
    if (!id) return null;
    if (id === "player") return "Ваш народ";
    const opponent = game.opponents.find((o: any) => o.id === id);
    return opponent?.clan || opponent?.name || "Соседний народ";
  };
  const landTiles = definitions.filter((tile) => tile.terrain !== "water");
  const owned = landTiles.filter((tile) => ownerOf(tile.id) === "player");
  const income = M.getRegionalIncome(game);

  return (
    <PageFrame wide>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <Label>Местный край · кампания-прототип</Label>
          <h1 className="font-display mt-1 text-3xl font-semibold sm:text-4xl">Земли и пути</h1>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-dim">
            Разведка открывает клетки не дальше двух шагов от ваших земель. Расширяться и отправлять экспедиции можно только в соседние клетки; часть пустых участков охраняют квестовые отряды.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-dim">
          <Flag size={14} className="text-bronze" />Поход: {(() => {
            // order_capacity от построек советника может поднять дневной лимит похода с 1 до 2.
            const cap = M.getOrderCapacity(game);
            const count = game.player.dailyOrders.frontierUsed || 0;
            const suffix = cap > 1 ? ` (${count}/${cap})` : "";
            return (count >= cap ? "использован сегодня" : "доступен") + suffix;
          })()}
        </div>
      </div>

      {territoryStep && (
        <Panel className="mb-4 border-bronze/40 bg-bronze/8 p-4">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-bronze-soft"><Compass size={14} />Шаг {territoryStep.guide.steps.findIndex((s: any) => s.id === territoryStep.step.id) + 1} из {territoryStep.guide.steps.length}: займите соседнюю область</span>
            <span className="min-w-0 flex-1 text-[13px] leading-relaxed text-dim">{territoryStep.guide.next}</span>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-faint">Подсвеченные пунктиром клетки граничат с вашими землями. Нажмите такую клетку и выполните действие справа.</p>
        </Panel>
      )}

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
        <Panel className="overflow-hidden p-3 sm:p-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 px-1">
            <div>
              <div className="font-display text-lg font-semibold text-parch">Карта местности</div>
              <div className="text-xs text-faint">СЕВЕР ↑ · 7 × 7 · 49 клеток</div>
            </div>
            <Chip tone="bronze">{owned.length} ваших · разведано {visibleIds.size}/49</Chip>
          </div>

          <div className="map-grid relative mx-auto aspect-square w-full max-w-[760px] isolate overflow-hidden rounded-2xl border border-line-strong bg-[#182b2a] p-2 shadow-inner">
            <div className="absolute inset-2 grid grid-cols-7 grid-rows-7 gap-[3px] rounded-xl bg-black/10">
              {definitions.map((tile) => {
                if (!visibleIds.has(tile.id)) {
                  return (
                    <div key={tile.id} className="relative z-20 flex min-w-0 flex-col items-center justify-center gap-0.5 overflow-hidden rounded-md border border-white/5 bg-[#101715] text-faint" aria-label="Неизведанная клетка" title="Неизведанная клетка">
                      <span className="text-base leading-none sm:text-xl" aria-hidden="true">?</span>
                      <span className="text-[7px] font-semibold sm:text-[9px]">Туман</span>
                    </div>
                  );
                }
                const tileInfo = info[tile.id];
                const owner = tileInfo.owner;
                const mine = owner === "player";
                const rival = Boolean(owner && !mine);
                const guarded = Boolean(tile.guard && !mine);
                const reachable = tile.terrain !== "water" && !owner && tileInfo.connected && tileInfo.eraOk;
                const locked = tile.terrain === "water" || (!mine && !rival && !reachable);
                const isSelected = selectedRegion === tile.id;
                const paint = TERRAIN_PAINT[tile.terrain] || TERRAIN_PAINT.plains;
                const mark = tileMarker(tile, owner);
                return (
                  <button
                    key={tile.id}
                    type="button"
                    onClick={() => selectRegion(isSelected ? null : tile.id)}
                    className={cn(
                      "group relative z-20 flex min-w-0 flex-col items-center justify-center gap-0.5 overflow-hidden rounded-md border p-0.5 text-center text-parch shadow-sm transition duration-150 hover:z-30 hover:brightness-110 focus-visible:z-30",
                      tile.terrain === "water" ? "border-cyan-100/25 text-cyan-50" : "border-parch/20",
                      mine && tile.kind !== "home" && "border-ok/90 shadow-[inset_0_0_0_2px_rgba(138,179,108,.42)]",
                      rival && "border-clay/90 shadow-[inset_0_0_0_2px_rgba(196,98,63,.32)]",
                      guarded && "border-bronze-soft/80 border-dashed shadow-[inset_0_0_0_1px_rgba(233,193,118,.35)]",
                      reachable && territoryStep && "z-30 ring-2 ring-bronze-soft/70",
                      tile.kind === "home" && "z-20 border-bronze-soft ring-2 ring-bronze/65 shadow-[0_0_18px_rgba(217,164,69,.55)]",
                      isSelected && "z-30 ring-2 ring-parch shadow-[0_0_0_4px_rgba(240,230,208,.14)]",
                      locked && tile.terrain !== "water" && "saturate-75",
                    )}
                    style={{ backgroundColor: paint.color, backgroundImage: paint.image }}
                    aria-pressed={isSelected}
                    aria-label={`${tile.name}, ${tile.terrainLabel}. ${tile.description}`}
                    title={`${tile.name} · ${tile.terrainLabel}. ${tile.description}`}
                  >
                    <span className={cn("relative z-10 text-base leading-none sm:text-xl", locked && tile.terrain !== "water" && "grayscale")}
                      aria-hidden="true">{tile.kind === "home" ? "⌂" : tile.kind === "settlement" ? "⚑" : tile.icon}</span>
                    <span className="relative z-10 line-clamp-2 max-w-full break-words px-0.5 text-[8px] font-semibold leading-[1.15] text-parch sm:text-[10px]">
                      {tile.name}
                    </span>
                    {mark && <span className={cn("absolute right-1 top-0.5 z-10 text-[9px] font-black text-bronze-soft sm:text-[11px]", mine && "text-ok", rival && "text-[#ffc0a6]")} aria-hidden="true">{mark}</span>}
                    {locked && tile.terrain !== "water" && <Lock size={10} className="absolute left-1 top-1 z-10 text-parch/70" aria-hidden="true" />}
                    {reachable && <span className={cn("pointer-events-none absolute inset-0 rounded-md border border-dashed", territoryStep ? "border-2 border-bronze-soft shadow-[0_0_14px_rgba(233,193,118,.5)]" : "border-bronze-soft/80")} aria-hidden="true" />}
                  </button>
                );
              })}
            </div>
            {riverSegments.length > 0 && (
              <svg className="pointer-events-none absolute inset-2 z-10 h-[calc(100%-1rem)] w-[calc(100%-1rem)] overflow-visible drop-shadow-[0_0_4px_rgba(80,200,207,.5)]" viewBox="0 0 700 700" preserveAspectRatio="none" aria-hidden="true">
                {riverSegments.map((points, index) => (
                  <g key={index}>
                    <polyline points={points} fill="none" stroke="#65c7cf" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" opacity=".24" />
                    <polyline points={points} fill="none" stroke="#8bdde0" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" opacity=".7" />
                  </g>
                ))}
              </svg>
            )}
          </div>

          <div className="mx-auto mt-3 flex max-w-[760px] flex-wrap items-center gap-x-4 gap-y-2 border-t border-line pt-3 text-[11px] text-dim">
            <span className="flex items-center gap-1.5"><i className="h-3 w-3 rounded-full border border-ok bg-ok/30" />Ваша земля</span>
            <span className="flex items-center gap-1.5"><i className="h-3 w-3 rounded-full border border-bronze-soft border-dashed" />Можно освоить</span>
            <span className="flex items-center gap-1.5 text-bronze-soft"><Shield size={12} />Квестовая охрана</span>
            <span className="flex items-center gap-1.5"><i className="h-3 w-3 rounded-full border border-clay bg-clay/30" />Поселение соседа</span>
            <span className="flex items-center gap-1.5"><i className="h-3 w-3 rounded-full border border-cyan-200 bg-cyan-900" />Вода</span>
            <span className="ml-auto text-faint">Серые клетки скрыты туманом</span>
          </div>
        </Panel>

        <aside className="space-y-4">
          {selected ? (
            <RegionPanel
              def={selected}
              info={info[selected.id]}
              ownerName={ownerName(info[selected.id].owner)}
              act={act}
              toast={toast}
              startExpedition={startExpedition}
              resumeExpedition={resumeExpedition}
              nameRegionBuilding={nameRegionBuilding}
            />
          ) : (
            <Panel className="p-5">
              <Label>Освоенные земли</Label>
              <div className="mt-3 space-y-2">
                {owned.length ? owned.map((tile: any) => {
                  const record = info[tile.id].record;
                  const building = M.REGION_BUILDINGS[tile.siteType];
                  return (
                    <button key={tile.id} onClick={() => selectRegion(tile.id)} className="flex w-full items-center gap-3 rounded-xl border border-line bg-raised/50 px-3 py-2.5 text-left hover:bg-raised">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-ground/70 text-xl">{tile.icon}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-parch">{tile.name}</span>
                        <span className="block truncate text-xs text-faint">{tile.kind === "home" ? "Центральное поселение" : record?.building ? record.buildingFlavor?.name || building?.name : building ? `Можно построить: ${building.name}` : "Без регионального здания"}</span>
                      </span>
                      {record?.building && building && <Yields y={building.yields} />}
                    </button>
                  );
                }) : <p className="text-sm text-dim">Пока освоено только центральное поселение.</p>}
              </div>
              <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-ground/60 px-3 py-2.5 text-sm">
                <span className="text-dim">Доход земель в день</span>
                <span className="flex gap-2.5">{YIELD_ORDER.some((k) => income[k] > 0) ? <Yields y={income} /> : <span className="text-faint">пока нет</span>}</span>
              </div>
              <p className="mt-4 flex gap-2 text-xs leading-relaxed text-faint"><Compass size={14} className="mt-0.5 shrink-0" />Нажмите клетку карты: откроется описание места и действие. Регионы дают доход только после постройки здания.</p>
            </Panel>
          )}
        </aside>
      </div>
    </PageFrame>
  );
}

function RegionPanel({ def, info, ownerName, act, toast, startExpedition, resumeExpedition, nameRegionBuilding }: any) {
  const { game } = useStore();
  const rb = M.REGION_BUILDINGS[def.siteType];
  const action = info.action;
  const record = info.record;
  const mine = info.owner === "player";
  const have = game.player.resources;
  const featureLabel = FEATURE_LABEL[def.feature] || SITE_LABEL[def.siteType] || "Местность";
  // Разведка стражи: честная грубая оценка сил перед платным квестовым боем.
  const questEst = action.action === "quest" && def.guard ? M.getOpponentBattleConfig(game, def.guard.id) : null;
  const questCfg = questEst ? M.getBattleConfig(game) : null;
  const questScore = questEst && questCfg ? (questCfg.deckLimit - questEst.deckLimit) + (questCfg.hp - questEst.hp) + (questCfg.energyMax - questEst.energyMax) : 0;
  const questVerdict = questEst ? questScore >= 2 ? "ваш отряд сильнее" : questScore >= -1 ? "силы примерно равны" : "стража заметно сильнее" : null;

  const run = () => {
    if (action.action === "settle") {
      if (act((s: any) => M.settleRegion(s, def.id), { silent: true })) toast(`«${def.name}» теперь ваша земля. Постройте здание, чтобы получать доход.`, "ok");
    } else if (action.action === "build") {
      const res = act((s: any) => M.buildRegionBuilding(s, def.id), { silent: true });
      if (res) { toast(`Здание построено в «${def.name}».`, "ok"); void nameRegionBuilding(def.id); }
    } else if (action.action === "attack" || action.action === "quest") startExpedition(def.id);
    else if (action.action === "resume" || action.action === "return") resumeExpedition();
  };
  const label: Record<string, string> = {
    settle: "Заселить землю",
    build: `Построить: ${rb?.name ?? "региональное здание"}`,
    attack: "Начать экспедицию",
    quest: "Сразиться со стражей",
    resume: "Продолжить экспедицию",
    return: "Вернуться к бою",
  };
  const orderName = action.action === "settle" || action.action === "attack" || action.action === "quest" ? "Использует приказ «Поход»." : action.action === "build" ? "Использует приказ «Строительство»." : "";

  return (
    <Panel className="animate-rise p-5">
      <div className="flex items-start gap-3">
        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-line-strong bg-ground text-3xl">{def.kind === "home" ? "⌂" : def.kind === "settlement" ? "⚑" : def.guard && !mine ? "⚔" : def.icon}</span>
        <div className="min-w-0">
          <h2 className="font-display text-xl font-semibold leading-tight text-parch">{def.name}</h2>
          <div className="mt-1 flex flex-wrap gap-1.5">
            <Chip>{def.terrainLabel}</Chip>
            <Chip tone="bronze">{featureLabel}</Chip>
            {mine ? <Chip tone="bronze"><Crown size={11} />Ваша земля</Chip> : info.owner ? <Chip tone="clay">{ownerName ?? "Сосед"}</Chip> : def.guard ? <Chip tone="clay"><Shield size={11} />Под охраной</Chip> : <Chip>Не освоена</Chip>}
          </div>
        </div>
      </div>
      <p className="mt-4 text-[13.5px] leading-relaxed text-dim">{def.description}</p>

      <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl border border-line bg-ground/50 p-3 text-xs">
        <div><div className="text-[10px] uppercase tracking-wider text-faint">Координаты</div><div className="mt-0.5 font-medium text-parch">{def.x + 1} : {def.y + 1}</div></div>
        <div><div className="text-[10px] uppercase tracking-wider text-faint">Тип места</div><div className="mt-0.5 font-medium text-parch">{SITE_LABEL[def.siteType] || "Местность"}</div></div>
        {def.resourceLabel && <div className="col-span-2"><div className="text-[10px] uppercase tracking-wider text-faint">Ресурс</div><div className="mt-0.5 font-medium text-parch">{def.resourceLabel}</div></div>}
      </div>

      {rb && def.kind !== "home" && def.terrain !== "water" && (
        <div className="mt-4 rounded-xl border border-line bg-ground/50 p-3.5">
          <div className="flex items-center justify-between gap-2">
            <div><Label>Здание региона</Label><div className="mt-0.5 text-sm font-semibold text-parch">{record?.building ? (record.buildingFlavor?.name || rb.name) : rb.name}</div></div>
            <Yields y={rb.yields} />
          </div>
          <p className="mt-1.5 text-xs leading-relaxed text-faint">{rb.description}</p>
          {rb.unlocks && <p className="mt-2 flex items-center gap-1.5 text-xs text-know"><Sprout size={12} />{rb.unlocks.includes("masterwork") ? "Вместе с плавильней открывает мастерское сырьё для ковки" : "Открывает отборное сырьё для ковки"}</p>}
          {!record?.building && <div className="mt-2 flex items-center gap-2 text-xs text-dim">Стоимость: <Cost cost={rb.cost} have={have} /></div>}
          {record?.building && <div className="mt-2 text-xs font-medium text-ok">Построено · приносит доход каждый день</div>}
        </div>
      )}

      {!mine && def.terrain !== "water" && (
        <div className="mt-4 space-y-1.5 text-xs text-dim">
          <div className={cn("flex items-center gap-2", info.eraOk ? "text-ok" : "text-faint")}>{info.eraOk ? "✓" : "○"} Эпоха «{M.eraName(def.minEra)}» {info.eraOk ? "открыта" : "ещё не наступила"}</div>
          <div className={cn("flex items-center gap-2", info.connected ? "text-ok" : "text-faint")}>{info.connected ? "✓" : "○"} Соприкасается с вашими землями по стороне</div>
        </div>
      )}

      {label[action.action] ? (
        <div className="mt-5">
          {action.cost && <div className="mb-2 flex items-center justify-between text-xs text-dim"><span>Цена {action.action === "attack" ? "экспедиции" : action.action === "quest" ? "квестового боя" : action.action === "settle" ? "заселения" : "здания"}</span><Cost cost={action.cost} have={have} /></div>}
          <Btn variant="primary" size="lg" className="w-full" disabled={!action.enabled} onClick={run}>
            {action.action === "attack" || action.action === "quest" ? <Swords size={18} /> : action.action === "build" ? <Hammer size={18} /> : <Flag size={18} />}{label[action.action]}<ArrowRight size={16} className="opacity-60" />
          </Btn>
          {!action.enabled && action.reason && <p className="mt-2 text-xs leading-relaxed text-bad/90">{action.reason}</p>}
          {action.enabled && orderName && <p className="mt-2 text-xs text-faint">{orderName}</p>}
          {action.action === "attack" && action.enabled && <p className="mt-2 text-xs leading-relaxed text-faint">Победа в бою отдаёт вам участок. При поражении припасы и приказ потеряны.</p>}
          {action.action === "quest" && action.enabled && <p className="mt-2 text-xs leading-relaxed text-faint">Разведка: {questVerdict}. Квестовый бой снимает охрану и отдаёт участок при победе. При поражении земля остаётся нейтральной, но отряд возвращает 2 🌾 припасов.</p>}
        </div>
      ) : (
        <p className="mt-4 rounded-lg bg-raised/60 p-3 text-xs leading-relaxed text-faint">{action.reason || (def.kind === "home" ? "Центральное поселение — начало всех путей." : "Это место пока недоступно для освоения.")}</p>
      )}
    </Panel>
  );
}
