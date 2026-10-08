import { Crown, Grid3x3, Heart, Layers, ScrollText, Shield, Swords, Tent, Trophy, Zap, Lock } from "lucide-react";
import { M } from "@/game/model";
import { cn } from "@/utils/cn";
import { Btn, Chip, GloryCost, Heading, Meter, Panel } from "@/components/ui";
import { PageFrame } from "@/components/Shell";
import { useDerived, useStore } from "@/game/store";
import { boardLabel, boardShape } from "@/game/battle";

/**
 * Лагерь — единственный хаб прототипа: военный стол (соперники), постоянные улучшения за славу
 * и сводка боевых параметров вождя. Экономики, карты и науки здесь нет: всё, что влияет на бой,
 * собрано на одном экране.
 */
export default function Camp() {
  const { game, collection, startBattle, buyUpgrade, go } = useStore();
  const { cfg, camp, era, glory, wins, losses, bestStreak } = useDerived();
  const p = game.player;
  const ownedIds = new Set(collection.map((card) => card.id));
  const playerDeckCount = p.deckCardIds.filter((id: string) => ownedIds.has(id)).length;
  const chronicle = (p.chronicle || []).slice(-6).reverse();
  const heritagePerks = M.describePerks(M.cultureCombatBonus(p.historicalCulture)) as string[];
  const upgradePerks = M.describePerks(p.upgrades) as string[];

  return (
    <PageFrame wide>
      <div className="mb-6">
        <h1 className="font-display text-3xl font-semibold sm:text-4xl">{p.name}</h1>
        <p className="mt-1 text-sm text-dim">{M.eraName(p.era)} · {p.clan} · {glory} славы · {wins} побед, {losses} поражений{bestStreak > 1 ? ` · лучшая серия ${bestStreak}` : ""}</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <div className="space-y-4">
          <Panel className="paper p-5">
            <Heading title="Военный стол" eyebrow="Три племени" className="[&_h2]:text-lg" />
            {playerDeckCount === 0 && (
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-bronze/40 bg-bronze/8 p-4">
                <div className="font-semibold text-parch">Колода пуста — сначала выкуйте первую карту</div>
                <Btn variant="primary" onClick={() => go("forge")}><Swords size={15} />В кузницу</Btn>
              </div>
            )}
            <div className="mt-4 grid gap-3">
              {game.opponents.map((o: any) => {
                const oc = M.getOpponentBattleConfig(game, o.id);
                const deck = M.getOpponentBattleDeck(game, o.id) as any[] | null;
                const threat = oc.hp + playerDeckCount * 2;
                return (
                  <div key={o.id} className="flex flex-wrap items-center gap-4 rounded-xl border border-line bg-raised/50 p-4">
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-ground text-clay"><Crown size={20} /></span>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium">{o.name} {o.leader && <Chip tone="clay" className="ml-1">вождь</Chip>}</div>
                      <div className="text-xs text-faint">{o.clan} · {M.eraName(oc.era)}</div>
                      <div className="mt-1 flex flex-wrap gap-3 text-xs text-dim">
                        <span className="inline-flex items-center gap-1"><Heart size={11} />вождь {oc.hp}</span>
                        <span className="inline-flex items-center gap-1"><Layers size={11} />{playerDeckCount} карт — как у вас</span>
                        <span className="inline-flex items-center gap-1"><Zap size={11} />энергия до {oc.energyMax}</span>
                        <span className="inline-flex items-center gap-1">
                          <Grid3x3 size={11} />стол {boardLabel(boardShape(oc.threatEra))}
                        </span>
                        <span className="inline-flex items-center gap-1"><Shield size={11} />угроза {threat}</span>
                      </div>
                      <div className="mt-1 text-[11px] text-faint" title={oc.deckDescription}>{oc.deckStyle}{deck ? ` · ${deck.filter((c) => c.card_type === "unit").length} отряда, ${deck.filter((c) => c.card_type !== "unit").length} прочих` : ""}</div>
                    </div>
                    <Btn variant="primary" disabled={playerDeckCount === 0} onClick={() => startBattle(o.id)}><Swords size={16} />В бой</Btn>
                  </div>
                );
              })}
            </div>
          </Panel>

          <Panel className="p-5">
            <Heading title="Вождь в бою" eyebrow="Боевой состав" className="[&_h2]:text-lg" />
            <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              <Stat icon={<Heart size={15} className="text-ok" />} label="Здоровье вождя" value={cfg.hp} cap={M.COMBAT_CAPS.hp} />
              <Stat icon={<Layers size={15} className="text-know" />} label="Слоты колоды" value={cfg.deckLimit} cap={cfg.deckCap ?? M.COMBAT_CAPS.deckLimit} />
              <Stat icon={<Layers size={15} className="text-know" />} label="Начальная рука" value={cfg.openingHand} cap={2} />
              <Stat icon={<Zap size={15} className="text-bronze" />} label="Предел энергии" value={cfg.energyMax} cap={M.COMBAT_CAPS.energyMax} />
              <Stat icon={<Zap size={15} className="text-bronze" />} label="Прирост энергии" value={`+${cfg.energyGrowth}`} cap={`+${M.COMBAT_CAPS.energyGrowth}`} />
              <Stat icon={<Shield size={15} className="text-mat" />} label="Ходов до усталости" value={cfg.fatigueDelay} cap={M.COMBAT_CAPS.fatigueDelay} />
              <Stat icon={<Swords size={15} className="text-clay" />} label="Атака отрядов" value={cfg.atkBonus ? `+${cfg.atkBonus}` : "—"} cap={`+${M.COMBAT_CAPS.atkBonus}`} />
            </div>
            <div className="mt-4 space-y-2 border-t border-line pt-4 text-[12.5px]">
              <Source icon={cfg.seed?.icon || "✨"} title={cfg.seed ? `Замысел «${cfg.seed.name}»` : "Замысел не выбран"} note={cfg.seed?.combatNote || ""} perks={M.describePerks(cfg.seed?.combat || {})} />
              <Source icon={p.historicalCulture?.icon || "🏺"} title={p.historicalCulture ? `Наследие «${p.historicalCulture.name}»` : "Наследие не выбрано"} note={p.historicalCulture?.desc || ""} perks={heritagePerks} />
              <Source icon={<Tent size={14} className="text-bronze" />} title="Лагерь" perks={upgradePerks} />
            </div>
          </Panel>
        </div>

        <div className="space-y-4">
          <Panel className="p-5">
            <Heading title="Улучшения лагеря" className="[&_h2]:text-lg" />
            <div className="mt-4 space-y-2.5">
              {camp.map((u: any) => {
                const blocked = u.maxed || u.atCap || !u.affordable;
                const reason = u.maxed ? "на пределе уровня" : u.atCap ? "боевой параметр уже на пределе" : !u.affordable ? `нужно ${u.cost} славы` : "";
                return (
                  <div key={u.id} className={cn("rounded-xl border p-3.5", u.affordable && !u.maxed && !u.atCap ? "border-bronze/40 bg-bronze/8" : "border-line bg-ground/40")}>
                    <div className="flex items-start gap-3">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-line bg-ground text-lg">{u.icon}</span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-semibold">{u.name}</span>
                          <span className="flex gap-1" title={`Уровень ${u.level} из ${u.max}`}>
                            {Array.from({ length: u.max }).map((_, i) => (
                              <span key={i} className={cn("h-1.5 w-4 rounded-full", i < u.level ? "bg-bronze" : "bg-line-strong")} />
                            ))}
                          </span>
                        </div>
                        <div className="mt-0.5 text-[12px] text-dim">{u.label}{u.cost !== null && !u.atCap ? ` · сейчас ${u.current}, будет ${u.next}` : ` · сейчас ${u.current}`}</div>
                        <div className="mt-1 text-[11px] leading-relaxed text-faint">{u.note}</div>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1.5">
                        {u.cost === null ? (
                          <Chip tone="ok">максимум</Chip>
                        ) : (
                          <>
                            <GloryCost cost={u.cost} have={glory} />
                            <Btn size="sm" variant={blocked ? "ghost" : "primary"} disabled={blocked} onClick={() => buyUpgrade(u.id)}>
                              {u.atCap ? <Lock size={13} /> : <Trophy size={13} />}{u.atCap ? "Предел" : "Улучшить"}
                            </Btn>
                          </>
                        )}
                        {reason && <span className="text-[10.5px] text-faint">{reason}</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Panel>

          <Panel className="p-5">
            <Heading title={M.eraName(p.era)} eyebrow="Эпоха" className="[&_h2]:text-xl" />
            {!era.finalEra && (
              <>
                <div className="mt-3 flex items-center justify-between text-xs text-faint">
                  <span>До эпохи «{era.nextLabel}»</span>
                  <span className="tabular-nums">{Math.floor(p.gloryTotal)} / {era.need} славы</span>
                </div>
                <Meter className="mt-1.5" value={Math.max(0, p.gloryTotal - era.from)} max={Math.max(1, era.need - era.from)} />
              </>
            )}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {M.ERAS.map((name: string, i: number) => (
                <Chip key={name} tone={i === p.era ? "bronze" : i < p.era ? "ok" : "neutral"} className={i > p.era ? "opacity-60" : ""}>{i < p.era ? "✓ " : ""}{name}</Chip>
              ))}
            </div>
          </Panel>

          <Panel className="p-5">
            <Heading title="Летопись боёв" eyebrow={`${(p.chronicle || []).length} записей`} className="[&_h2]:text-lg" right={<ScrollText size={16} className="text-faint" />} />
            {chronicle.length === 0 ? (
              <p className="mt-3 text-sm text-dim">Записей пока нет: выйдите в первый бой или купите улучшение лагеря.</p>
            ) : (
              <ol className="mt-3 space-y-2">
                {chronicle.map((entry: any, i: number) => (
                  <li key={i} className="flex gap-2.5 text-[12.5px] leading-relaxed">
                    <span className="mt-0.5 shrink-0 rounded border border-line bg-ground px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-faint">{M.eraName(entry.era)}</span>
                    <span className="text-dim">{entry.text}</span>
                  </li>
                ))}
              </ol>
            )}
          </Panel>
        </div>
      </div>
    </PageFrame>
  );
}

function Stat({ icon, label, value, cap }: { icon: React.ReactNode; label: string; value: React.ReactNode; cap: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-line bg-ground/40 p-3" title={`${label}: ${value} из ${cap} возможных`}>
      <div className="flex items-center gap-1.5 text-[11px] text-faint">{icon}{label}</div>
      <div className="mt-1 flex items-baseline gap-1.5">
        <span className="font-display text-xl font-semibold tabular-nums text-parch">{value}</span>
        <span className="text-[11px] text-faint">/ {cap}</span>
      </div>
    </div>
  );
}

function Source({ icon, title, note, perks }: { icon: React.ReactNode; title: string; note?: string; perks: string[] }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md border border-line bg-ground text-[13px]">{icon}</span>
      <div className="min-w-0 flex-1">
        <div className="text-[12.5px] font-medium text-parch">{title}</div>
        {note && <div className="text-[11.5px] leading-relaxed text-faint">{note}</div>}
      </div>
      <div className="flex shrink-0 flex-wrap justify-end gap-1">
        {perks.length ? perks.map((perk) => <Chip key={perk} tone="bronze">{perk}</Chip>) : <span className="text-[11px] text-faint">без бонуса</span>}
      </div>
    </div>
  );
}
