import { useEffect, useMemo, useRef, useState } from "react";
import { Flag, Heart, Sword, Zap, ScrollText, Loader2, Shield, Skull, Flame, Trophy, X, Layers, Hourglass } from "lucide-react";
import { cn } from "@/utils/cn";
import { M } from "@/game/model";
import { allCards, withoutStructures, describeEffect, kwName, type Card } from "@/game/cards";
import {
  atkOf, armorOf, attackWith, beginEnemyTurn, beginPlayerTurn, boardLabel, canAct, canStandInRow, cast, costOf, createBattle, deploy,
  commandBonus, endPlayerTurn, enemyAct, enemyDeckForEra, mirrorDeckToPlayer, findTarget, gapsOf,
  inactiveKeywords, MOVE_COST, moveTargets, moveUnit, rowsOf, rowName, spellHasTarget, splashTargets, unitsOf,
  type Battle, type Unit,
} from "@/game/battle";
import { useStore } from "@/game/store";
import { Btn, Meter, Modal } from "@/components/ui";
import { CardFace, KeywordChips } from "@/components/CardView";
import art from "../../assets/infinite-forge-battlefield.jpg";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Ключевое слово без уровня: «armor:2» → «armor». */
const kwBase = (k: string) => String(k).toLowerCase().split(":")[0].trim();

/** Пометка у ключевого слова карты, которое не работает на текущем столе (одна линия Каменного века). */
const ONE_LINE_NOTE = "Не действует на этом столе.";

function EnergyPips({ energy, max, cap, label }: { energy: number; max: number; cap: number; label?: string }) {
  return (
    <div className="flex items-center gap-1" title={`Энергия ${energy} из ${max} (предел ${cap})`}>
      <Zap size={15} className="mr-0.5 text-bronze" />
      {label && <span className="mr-0.5 text-[10px] font-semibold uppercase tracking-wider text-faint">{label}</span>}
      {Array.from({ length: Math.max(max, 1) }).map((_, i) => (
        <span key={i} className={cn("h-3 w-3 rounded-full border transition-colors", i < energy ? "border-bronze bg-bronze shadow-[0_0_8px_rgba(217,164,69,0.7)]" : "border-line-strong bg-transparent")} />
      ))}
      <span className="ml-1.5 text-sm font-bold tabular-nums text-parch">{energy}<span className="font-medium text-faint">/{max}</span></span>
    </div>
  );
}

function Hero({ side, b, name, sub, targeted, onClick }: { side: "me" | "enemy"; b: Battle; name: string; sub: string; targeted?: boolean; onClick?: () => void }) {
  const p = b[side];
  const pct = Math.max(0, (p.hp / p.maxHp) * 100);
  return (
    <div
      onClick={onClick}
      className={cn("relative flex items-center gap-2.5 rounded-2xl border bg-surface/90 px-3 py-2 backdrop-blur transition-all sm:gap-3 sm:px-4 sm:py-2.5", targeted ? "cursor-pointer border-bad ring-4 ring-bad/25" : "border-line", b.active === side && !b.over && "border-bronze/50")}
    >
      <span className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-full border", side === "me" ? "border-bronze/50 bg-bronze/10 text-bronze" : "border-clay/50 bg-clay/10 text-clay")}>
        {side === "me" ? <Shield size={18} /> : <Skull size={18} />}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <div className="truncate text-sm font-semibold text-parch">{name}</div>
          <div className="text-sm font-bold tabular-nums text-parch"><Heart size={12} className="mr-1 inline text-bad" />{Math.max(0, p.hp)}<span className="font-medium text-faint">/{p.maxHp}</span></div>
        </div>
        <div className="hidden truncate text-[11px] text-faint sm:block">{sub}</div>
        <Meter value={p.hp} max={p.maxHp} className="mt-1.5 h-2" color={pct > 50 ? "bg-ok" : pct > 25 ? "bg-bronze" : "bg-bad"} />
      </div>
      {p.hitSeq > 0 && <span key={p.hitSeq} className="pointer-events-none absolute right-6 top-0 animate-float-dmg text-xl font-black text-bad">−{p.lastDmg}</span>}
      {targeted && <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 rounded-full bg-bad px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ground">Цель</span>}
    </div>
  );
}

export function UnitToken({ b, u, mine, ready, selected, targeted, splashed, onClick, onHover, onInspect }: { b: Battle; u: Unit; mine: boolean; ready: boolean; selected: boolean; targeted: boolean; splashed?: boolean; onClick: () => void; onHover: (v: boolean) => void; onInspect: () => void }) {
  const atk = atkOf(b, u);
  const armor = armorOf(b, u);
  const hurt = u.curHp < u.hp;
  // Долгий тап/зажатие мышью — раскрыть карточку юнита целиком (свою или вражескую),
  // не выполняя обычное действие (выбор/атаку) по короткому клику.
  const pressTimer = useRef<number | null>(null);
  const longPressed = useRef(false);
  const clearPress = () => { if (pressTimer.current !== null) { window.clearTimeout(pressTimer.current); pressTimer.current = null; } };
  const startPress = () => {
    longPressed.current = false;
    clearPress();
    pressTimer.current = window.setTimeout(() => { longPressed.current = true; onInspect(); }, 480);
  };
  const handleClick = () => {
    if (longPressed.current) { longPressed.current = false; return; }
    onClick();
  };
  return (
    <button
      onClick={handleClick}
      onPointerDown={startPress}
      onPointerUp={clearPress}
      onPointerLeave={clearPress}
      onPointerCancel={clearPress}
      onContextMenu={(e) => e.preventDefault()}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => { onHover(false); clearPress(); }}
      style={{ WebkitTouchCallout: "none" } as React.CSSProperties}
      className={cn(
        "select-none touch-manipulation",
        "relative flex h-full w-full flex-col items-center justify-between overflow-hidden rounded-xl border px-1 pb-1.5 pt-1.5 text-center transition-all sm:px-2",
        u.isStructure ? "border-mat/40 bg-[#2a2016]" : mine ? "border-line-strong bg-[#241f17]" : "border-clay/40 bg-[#2a1a14]",
        ready && "border-bronze shadow-[0_0_0_1px_rgba(217,164,69,0.6),0_0_20px_-4px_rgba(217,164,69,0.55)]",
        selected && "-translate-y-1 ring-2 ring-bronze",
        targeted && "border-bad ring-4 ring-bad/30",
        u.hitSeq > 0 && "animate-shake",
      )}
      key={u.iid + ":" + u.hitSeq}
    >
      <span className="text-[24px] leading-none sm:text-[28px]">{u.emoji}</span>
      <span className="line-clamp-2 w-full text-[10px] font-semibold leading-tight text-parch sm:text-[11.5px]">{u.name}</span>
      <span className="flex w-full items-center justify-center gap-1.5 text-[12px] font-bold tabular-nums sm:gap-2 sm:text-[13px]">
        {!u.isStructure && <span className="inline-flex items-center gap-0.5 text-clay"><Sword size={11} />{atk}</span>}
        <span className={cn("inline-flex items-center gap-0.5", hurt ? "text-bad" : "text-ok")}><Heart size={11} />{u.curHp}</span>
        {armor > 0 && <span className="inline-flex items-center gap-0.5 text-know"><Shield size={11} />{armor}</span>}
      </span>
      <span className="absolute left-1 top-1 flex gap-0.5">
        {u.st.poison > 0 && <span title="Отравлен" className="grid h-4 w-4 place-items-center rounded-full bg-ok/30 text-ok"><Skull size={9} /></span>}
        {u.st.burn > 0 && <span title="Горит" className="grid h-4 w-4 place-items-center rounded-full bg-clay/40 text-clay"><Flame size={9} /></span>}
        {u.st.suppress > 0 && <span title={`Подавлен: атака дороже на ${u.st.suppress}`} className="grid h-4 w-4 place-items-center rounded-full bg-know/30 text-know"><Hourglass size={9} /></span>}
      </span>
      {u.isStructure ? <span className="absolute right-1 top-1 text-[9px] font-semibold uppercase text-mat">здание</span> : <span className="absolute right-1 top-1 inline-flex items-center gap-0.5 text-[10px] font-semibold text-bronze"><Zap size={9} />{costOf(b, u)}</span>}
      {splashed && <span title="Эту клетку накрывает площадный удар" className="pointer-events-none absolute inset-0 rounded-xl border-2 border-dashed border-clay/80" />}
      {splashed && <span title="Эту клетку накрывает площадный удар" className="pointer-events-none absolute bottom-0.5 left-1 text-[11px] leading-none">💥</span>}
      {u.hitSeq > 0 && <span key={"d" + u.hitSeq} className="pointer-events-none absolute inset-x-0 top-1/3 animate-float-dmg text-xl font-black text-bad drop-shadow">−{u.lastDmg}</span>}
      {mine && !u.exhausted && !u.isStructure && !ready && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-bronze/30" />}
    </button>
  );
}

function Slot({ children, valid, onClick, compact, kind = "deploy" }: {
  children?: React.ReactNode; valid?: boolean; onClick?: () => void; compact?: boolean; kind?: "deploy" | "move";
}) {
  return (
    <div className={cn(compact ? "h-[56px] sm:h-[74px] [@media(min-height:900px)]:sm:h-[86px]" : "h-[74px] sm:h-[100px] [@media(min-height:900px)]:sm:h-[114px]")}>
      {children ?? (
        <button
          onClick={onClick}
          disabled={!valid}
          title={kind === "move" ? `Перестроить отряд сюда за ${MOVE_COST} энергии` : "Вывести сюда отряд из руки"}
          className={cn(
            "grid h-full w-full place-items-center rounded-xl border border-dashed text-[10px] transition-all",
            !valid && "border-line/60 text-line-strong",
            valid && kind === "deploy" && "animate-pulse-soft border-bronze/70 bg-bronze/8 text-bronze-soft hover:bg-bronze/15",
            valid && kind === "move" && "border-know/70 bg-know/8 text-know hover:bg-know/15",
          )}
        >
          {valid ? (kind === "move" ? "⇄ сюда" : "+ выйти") : ""}
        </button>
      )}
    </div>
  );
}

/**
 * Полоса брешей: столбцы, в которых у стороны не осталось живых отрядов. Через брешь удар ближнего
 * боя проходит вождю, поэтому их видно прямо на линии фронта — чужие (зелёные) как возможность,
 * свои (красные) как опасность.
 */
export function GapStrip({ b, side, compact }: { b: Battle; side: "me" | "enemy"; compact: boolean }) {
  // Пустое поле — не «брешь», а начало боя: помечаем только линию, которую уже держат отряды.
  const holds = unitsOf(b, side).some((s) => s.unit.curHp > 0 && !s.unit.isStructure);
  const gaps = holds ? gapsOf(b, side) : [];
  if (!gaps.length) return null;
  const title = side === "enemy"
    ? "Брешь: удар из этого столбца проходит вождю."
    : "Ваша брешь: враг бьёт вождя из этого столбца.";
  return (
    <div className="flex items-stretch gap-1 sm:gap-1.5" title={title}>
      <div className={cn("shrink-0", compact ? "w-8 sm:w-10" : "w-10 sm:w-12")} />
      <div className="grid min-w-0 flex-1 gap-1.5 sm:gap-2.5" style={{ gridTemplateColumns: `repeat(${b.shape.slots}, minmax(0, 1fr))` }}>
        {Array.from({ length: b.shape.slots }, (_, i) => (
          <div key={i} className={cn("text-center text-[8.5px] font-semibold uppercase leading-none tracking-[0.08em] sm:text-[9.5px]",
            gaps.includes(i) ? (side === "enemy" ? "text-ok" : "text-bad") : "text-transparent")}>
            {gaps.includes(i) ? "брешь" : "·"}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function BattleScreen() {
  const { game, collection, match, finishBattle, closeBattle, go } = useStore();
  const m = match!;
  const cfg = useMemo(() => M.getBattleConfig(game), []); // eslint-disable-line react-hooks/exhaustive-deps
  const build = () => {
    const cards = new Map(allCards(collection).map((c) => [c.id, c]));
    // Колода = выбранные игроком карты (экран «Армия»); пустые слоты никто не заполняет.
    const deck: Card[] = game.player.deckCardIds.map((id: string) => cards.get(id)).filter(Boolean).slice(0, cfg.deckLimit) as Card[];
    const ec = M.getOpponentBattleConfig(game, m.opponentId);
    const customEnemyDeck = M.getOpponentBattleDeck(game, m.opponentId) as Card[] | null;
    const enemyPool = (customEnemyDeck?.length ? customEnemyDeck : enemyDeckForEra(ec.era, 12)) as Card[];
    // В первом учебном бою враг приходит без построек: никто не бьёт новичка бесплатно из тыла.
    // Соперник получает ровно столько карт, сколько реально есть у игрока; при одной выкованной карте
    // это одно-карточная колода с обеих сторон, даже если шаблон ополчения намного больше.
    const enemyDeck = mirrorDeckToPlayer(deck, m.tutorial ? withoutStructures(enemyPool) : enemyPool);
    const battle = createBattle(deck, { hp: cfg.hp, energyMax: cfg.energyMax, energyGrowth: cfg.energyGrowth, fatigueDelay: cfg.fatigueDelay, atkBonus: cfg.atkBonus, openingHand: cfg.openingHand }, enemyDeck, { hp: ec.hp, energyMax: ec.energyMax, energyGrowth: ec.energyGrowth, fatigueDelay: ec.fatigueDelay, atkBonus: ec.atkBonus }, m);
    // Первый ход новичка начинается с энергии 2 (а не 1), чтобы в руке можно было сыграть карту за 2.
    // Берём фиксированное значение 2, а не текущий предел игрока: иначе бонусы эпохи/черты
    // характера (например, «Владыки Коней») поднимали бы старт сразу до 3 энергии.
    if (m.tutorial) {
      const start = Math.min(2, battle.me.energyCap);
      battle.me.energyMax = start; battle.me.energy = start;
      // Учебный бой идёт одной картой с каждой стороны, поэтому колоды пустеют на первом же ходу и
      // исход решала гонка усталости, где первым умирает начинающий (замер стендом: 0 побед из 200
      // против Речного Союза и Степного Круга при любой первой карте). Наставник не бьётся насмерть
      // — у его вождя 3 HP вместо шести, — а новичок получает фору по припасам: +2 хода до усталости.
      battle.enemy.hp = Math.min(battle.enemy.hp, 3);
      battle.enemy.maxHp = battle.enemy.hp;
      battle.me.fatigueStart += 2;
    }
    return battle;
  };
  const bRef = useRef<Battle>(null as any);
  if (!bRef.current) bRef.current = build();
  const [b, setB] = useState<Battle>(bRef.current);
  const [selHand, setSelHand] = useState<number | null>(null);
  const [selUnit, setSelUnit] = useState<string | null>(null);
  const [hover, setHover] = useState<Unit | null>(null);
  const [inspectUnit, setInspectUnit] = useState<Unit | null>(null);
  const [result, setResult] = useState<{ won: boolean; msg: string } | null>(null);
  const [confirmRetreat, setConfirmRetreat] = useState(false);
  const [logOpen, setLogOpen] = useState(false);
  const alive = useRef(true);
  const busy = useRef(false);
  const finished = useRef(false);

  useEffect(() => { alive.current = true; return () => { alive.current = false; }; }, []);

  const mutate = (fn: (nb: Battle) => void) => {
    const nb = structuredClone(bRef.current);
    fn(nb);
    bRef.current = nb;
    setB(nb);
  };

  useEffect(() => {
    if (b.over && !finished.current) {
      finished.current = true;
      setSelHand(null); setSelUnit(null); setInspectUnit(null);
      setTimeout(() => {
        const won = bRef.current.over === "win";
        const msg = finishBattle(won);
        setResult({ won, msg });
      }, 900);
    }
  }, [b.over, finishBattle]);

  const myTurn = b.active === "me" && !b.over && !busy.current;
  const hand = b.me.hand;
  const selCard = selHand !== null ? hand[selHand] : null;
  const selU = selUnit ? unitsOf(b, "me").find((s) => s.unit.iid === selUnit)?.unit ?? null : null;
  const target = selU ? findTarget(b, selU, "me") : null;
  /** Клетки, куда выбранный отряд может перестроиться за энергию (см. moveTargets в движке). */
  const selMoves = selU && b.active === "me" && !b.over ? moveTargets(b, "me", selU) : [];
  const isMove = (ri: number, i: number) => selMoves.some((t) => t.ri === ri && t.i === i);
  /** Клетки, которые накроет площадный удар выбранного отряда, — отмечаем до самого удара. */
  const splashCells = selU && myTurn && target ? splashTargets(b, "me", selU, target) : [];
  const isSplashed = (side: "me" | "enemy", ri: number, i: number) =>
    splashCells.some((h) => h.side === side && h.ri === ri && h.i === i);

  const runEnemy = async () => {
    busy.current = true;
    await sleep(650);
    if (!alive.current) return;
    mutate(beginEnemyTurn);
    while (alive.current && !bRef.current.over) {
      await sleep(800);
      if (!alive.current) return;
      let acted = false;
      mutate((nb) => { acted = enemyAct(nb); });
      if (!acted) break;
    }
    if (!alive.current || bRef.current.over) { busy.current = false; return; }
    await sleep(650);
    if (!alive.current) return;
    mutate(beginPlayerTurn);
    busy.current = false;
    setB({ ...bRef.current });
  };

  const endTurn = () => {
    if (!myTurn) return;
    setSelHand(null); setSelUnit(null); setInspectUnit(null);
    mutate(endPlayerTurn);
    runEnemy();
  };

  const clickHand = (i: number) => {
    if (!myTurn) return;
    const c = hand[i];
    if (selHand === i) { setSelHand(null); return; }
    setSelUnit(null);
    if (c.drop_cost > b.me.energy) { setSelHand(i); return; }
    setSelHand(i);
  };

  const doCast = () => { if (selHand === null) return; mutate((nb) => { cast(nb, "me", selHand); }); setSelHand(null); };
  const doDeploy = (ri: number, slot: number) => {
    if (selHand === null || !selCard || selCard.card_type === "spell") return;
    mutate((nb) => { deploy(nb, "me", selHand, ri, slot); });
    setSelHand(null);
  };
  const doAttack = () => {
    if (!selU) return;
    const id = selU.iid;
    mutate((nb) => { attackWith(nb, "me", id); });
    setSelUnit(null);
  };
  const doMove = (ri: number, i: number) => {
    if (!selU) return;
    const id = selU.iid;
    mutate((nb) => { moveUnit(nb, "me", id, ri, i); });
    setSelUnit(null);
  };
  /** Клик по пустой клетке своей половины: либо вывод карты из руки, либо перестроение отряда. */
  const clickCell = (side: "me" | "enemy", ri: number, i: number) => {
    if (side !== "me" || !myTurn) return;
    if (selHand !== null) { doDeploy(ri, i); return; }
    if (isMove(ri, i)) doMove(ri, i);
  };
  const clickMyUnit = (u: Unit) => {
    if (!myTurn) return;
    if (selUnit === u.iid) { setSelUnit(null); return; }
    setSelHand(null);
    if (canAct(b, "me", u)) setSelUnit(u.iid);
  };
  const clickEnemyUnit = (u: Unit) => {
    if (selU && target?.kind === "unit" && target.unit === u) doAttack();
  };

  const retreat = () => {
    setConfirmRetreat(false);
    mutate((nb) => { nb.over = "lose"; nb.log.push({ id: ++nb.seq, side: "system", text: "Вы отступили." }); });
  };

  const rematch = () => {
    bRef.current = build(); setB(bRef.current); setResult(null); finished.current = false; busy.current = false; setSelHand(null); setSelUnit(null); setInspectUnit(null);
  };

  // Горячие клавиши: цифры 1–9 выбирают карту в руке, Enter завершает ход, Esc снимает выбор.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (b.over || confirmRetreat || logOpen || inspectUnit) return;
      if (e.key === "Escape") { setSelHand(null); setSelUnit(null); return; }
      if (b.active === "enemy" || busy.current) return;
      if (e.key === "Enter") { endTurn(); return; }
      if (/^[1-9]$/.test(e.key)) {
        const i = Number(e.key) - 1;
        if (i < hand.length) clickHand(i);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [b.over, b.active, confirmRetreat, logOpen, inspectUnit, hand.length, endTurn, clickHand]);

  // Слот подсвечивается, только если карта вообще может стоять в этом ряду: постройки — в тылу,
  // ближний бой без стрельбы — в авангарде (см. canStandInRow в движке).
  const validSlot = (ri: number, i: number) => !!selCard && selCard.card_type !== "spell" && selCard.drop_cost <= b.me.energy
    && !rowsOf(b.me)[ri][i] && canStandInRow(selCard, b.me, ri);

  const inspect: { unit?: Unit; card?: Card } = hover ? { unit: hover } : selU ? { unit: selU } : selCard ? { card: selCard } : {};
  const anyMove = unitsOf(b, "me").some((s) => canAct(b, "me", s.unit) || moveTargets(b, "me", s.unit).length > 0)
    || hand.some((c) => c.drop_cost <= b.me.energy);

  const enemyName = `${m.name}`;

  const hint = (() => {
    if (b.over) return { text: b.over === "win" ? "Победа!" : "Поражение…", actions: null as React.ReactNode };
    if (b.active === "enemy" || busy.current) return { text: "Ход врага…", actions: <Loader2 size={16} className="animate-spin text-dim" /> };
    if (selU) {
      if (!target) return { text: `«${selU.name}» не достаёт до врага.`, actions: <Btn size="sm" variant="ghost" onClick={() => setSelUnit(null)}>Отмена</Btn> };
      const tName = target.kind === "hero" ? "вражеского вождя" : `«${target.unit.name}»`;
      return { text: `«${selU.name}» атакует ${tName} за ${costOf(b, selU)} энергии.`, actions: <><Btn size="sm" variant="primary" onClick={doAttack}><Sword size={14} />Атаковать</Btn><Btn size="sm" variant="ghost" onClick={() => setSelUnit(null)}>Отмена</Btn></> };
    }
    if (selCard) {
      if (selCard.drop_cost > b.me.energy) return { text: `«${selCard.name}» стоит ${selCard.drop_cost} — не хватает энергии.`, actions: <Btn size="sm" variant="ghost" onClick={() => setSelHand(null)}>Отмена</Btn> };
      if (selCard.card_type === "spell") {
        const ok = spellHasTarget(b, "me", selCard);
        return { text: `Манёвр «${selCard.name}»${ok ? "" : " — целей нет"}: ${(selCard.effects || []).map(describeEffect).join("; ")}`, actions: <><Btn size="sm" variant="primary" disabled={!ok} onClick={doCast}><ScrollText size={14} />Разыграть</Btn><Btn size="sm" variant="ghost" onClick={() => setSelHand(null)}>Отмена</Btn></> };
      }
      const slotText = selCard.card_type === "structure"
        ? `Постройка «${selCard.name}»: выберите слот в тылу.`
        : `«${selCard.name}»: выберите свободный слот.`;
      return { text: slotText, actions: <Btn size="sm" variant="ghost" onClick={() => setSelHand(null)}>Отмена</Btn> };
    }
    return { text: anyMove ? "Ваш ход." : "Действий нет — «Конец хода».", actions: null };
  })();

  const rowsFor = (side: "me" | "enemy") => {
    const rows = rowsOf(b[side]);
    // Ряды врага идут сверху от его тыла к линии фронта, наши — от линии фронта вглубь.
    const order = rows.map((_, ri) => ri);
    if (side === "enemy") order.reverse();
    const compact = b.shape.rows >= 4 || b.shape.slots >= 5;
    return order.map((ri) => (
      <div key={ri} className="flex items-stretch gap-1 sm:gap-1.5">
        <div className={cn("grid shrink-0 place-items-center text-center text-[8.5px] font-semibold uppercase leading-tight tracking-[0.06em] text-faint sm:text-[9.5px]", compact ? "w-8 sm:w-10" : "w-10 sm:w-12")}>{rowName(b[side], ri)}</div>
        <div className="grid min-w-0 flex-1 gap-1.5 sm:gap-2.5" style={{ gridTemplateColumns: `repeat(${rows[ri].length}, minmax(0, 1fr))` }}>
        {rows[ri].map((u, i) => (
          <Slot key={i} compact={compact} kind={isMove(ri, i) ? "move" : "deploy"} valid={side === "me" && (validSlot(ri, i) || isMove(ri, i))} onClick={() => clickCell(side, ri, i)}>
            {u ? (
              <UnitToken
                b={b} u={u} mine={side === "me"}
                ready={side === "me" && myTurn && canAct(b, "me", u) && !selUnit}
                selected={selUnit === u.iid}
                targeted={!!selU && target?.kind === "unit" && target.unit === u}
                splashed={isSplashed(side, ri, i)}
                onClick={() => (side === "me" ? clickMyUnit(u) : clickEnemyUnit(u))}
                onHover={(v) => setHover(v ? u : null)}
                onInspect={() => setInspectUnit(u)}
              />
            ) : undefined}
          </Slot>
        ))}
        </div>
      </div>
    ));
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-ground">
      <img src={art} alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.16]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ground/70 via-transparent to-ground/90" />

      <header className="relative z-10 flex items-center justify-between gap-2 px-3 py-2 sm:px-6 sm:py-2.5">
        <Btn variant="ghost" size="sm" onClick={() => (b.over ? undefined : setConfirmRetreat(true))} disabled={!!b.over}><Flag size={14} />Отступить</Btn>
        <div className="min-w-0 text-center">
          <div className="truncate text-[10.5px] font-semibold uppercase tracking-[0.14em] text-faint sm:text-[11px] sm:tracking-[0.16em]">
            {m.tutorial ? "Учебный бой" : m.leaderBattle ? "Бой с вождём племени" : "Бой с племенем"}
          </div>
          <div className={cn("text-sm font-semibold", b.active === "me" ? "text-bronze-soft" : "text-clay")}>{b.over ? "Бой окончен" : `Ход ${b.turn} · ${b.active === "me" ? "ваш" : "врага"}`}</div>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <Btn variant="ghost" size="sm" className="lg:hidden" onClick={() => setLogOpen(true)}><ScrollText size={14} /><span className="hidden sm:inline">Журнал</span></Btn>
        </div>
      </header>

      <div className="relative z-10 flex min-h-0 flex-1 gap-4 px-3 pb-2 sm:px-6">
        <div className="no-scrollbar mx-auto flex min-h-0 w-full max-w-[720px] flex-1 flex-col justify-between gap-1 overflow-y-auto overscroll-contain">
          <div>
            <Hero side="enemy" b={b} name={enemyName} sub={`${m.clan} · ${M.eraName(m.era)} · в руке ${b.enemy.hand.length}, в колоде ${b.enemy.deck.length}`} targeted={!!selU && target?.kind === "hero"} onClick={() => { if (selU && target?.kind === "hero") doAttack(); }} />
            <div className="mt-1.5 flex justify-end"><EnergyPips energy={b.enemy.energy} max={b.enemy.energyMax + commandBonus(b, "enemy")} cap={b.enemy.energyCap} label="враг" /></div>
          </div>

          <div className="space-y-1.5 sm:space-y-2.5">
            {rowsFor("enemy")}
            <GapStrip b={b} side="enemy" compact={b.shape.rows >= 4 || b.shape.slots >= 5} />
            <div className="relative flex items-center gap-3 py-0.5"><span className="h-px flex-1 bg-gradient-to-r from-transparent via-bronze/40 to-transparent" /><span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-bronze/70">линия фронта · стол {boardLabel(b.shape)}</span><span className="h-px flex-1 bg-gradient-to-r from-transparent via-bronze/40 to-transparent" /></div>
            <GapStrip b={b} side="me" compact={b.shape.rows >= 4 || b.shape.slots >= 5} />
            {rowsFor("me")}
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <EnergyPips energy={b.me.energy} max={b.me.energyMax + commandBonus(b, "me")} cap={b.me.energyCap} label="вы" />
              <span className="inline-flex items-center gap-1 text-[11px] text-faint"><Layers size={12} />колода {b.me.deck.length} · сброс {b.me.discard.length}{b.me.fatigue > 0 && <span className="text-bad" title="Усталость: добор из пустой колоды бьёт вождя"> · усталость {b.me.fatigue}</span>}</span>
            </div>
            <Hero side="me" b={b} name={game.player.name} sub={`${game.player.clan} · ${M.eraName(game.player.era)}`} />
          </div>
        </div>

        <aside className="hidden w-[300px] shrink-0 flex-col gap-3 overflow-y-auto pb-2 lg:flex">
          <Inspector inspect={inspect} b={b} />
          <LogList b={b} className="max-h-[260px]" />
        </aside>
      </div>

      <footer className="relative z-10 border-t border-line bg-surface/95 px-3 pb-2 pt-1.5 backdrop-blur sm:px-6 sm:pb-3 sm:pt-2">
        <div className="mx-auto max-w-[720px]">
          <div className="mb-1.5 flex min-h-8 items-center justify-between gap-2 sm:mb-2 sm:min-h-9 sm:gap-3">
            <p className="text-[12px] leading-snug text-dim sm:text-[12.5px]">{hint.text}</p>
            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">{hint.actions}</div>
          </div>
          <div className="flex items-end gap-1.5 sm:gap-3">
            <div className="no-scrollbar flex min-w-0 flex-1 gap-2 overflow-x-auto pb-1 pt-2">
              {hand.length === 0 && <div className="grid h-[90px] flex-1 place-items-center rounded-xl border border-dashed border-line text-xs text-faint sm:h-[116px]">Рука пуста</div>}
              {hand.map((c, i) => {
                const afford = c.drop_cost <= b.me.energy;
                return (
                  <button key={c.iid ?? i} onClick={() => clickHand(i)} disabled={!myTurn} title={i < 9 ? `${c.name} — клавиша ${i + 1}` : c.name}
                    className={cn("relative flex h-[90px] w-[76px] shrink-0 flex-col items-center justify-between rounded-xl border bg-surface px-1.5 pb-1.5 pt-1.5 text-center transition-all sm:h-[116px] sm:w-[94px]",
                      selHand === i ? "-translate-y-2 border-bronze ring-2 ring-bronze" : afford && myTurn ? "border-line-strong hover:-translate-y-1 hover:border-bronze/60" : "border-line opacity-55")}>
                    <span className="absolute left-1 top-1 grid h-5 min-w-5 place-items-center rounded-full border border-bronze/60 bg-ground px-1 text-[11px] font-bold text-bronze-soft">{c.drop_cost}</span>
                    <span className="mt-3 text-[26px] leading-none sm:text-[30px]">{c.emoji}</span>
                    <span className="line-clamp-2 text-[10.5px] font-semibold leading-tight">{c.name}</span>
                    {c.card_type === "spell" ? <span className="text-[10px] font-medium text-know">манёвр</span> : (
                      <span className="flex gap-2 text-[11.5px] font-bold tabular-nums">{c.card_type === "unit" && <span className="text-clay">{c.atk}</span>}<span className="text-ok">{c.hp}</span>{c.card_type === "structure" && <span className="text-mat">здан.</span>}</span>
                    )}
                  </button>
                );
              })}
            </div>
            <Btn variant="primary" size="lg" className="h-[90px] shrink-0 flex-col gap-1 px-3 sm:h-[116px] sm:px-6" onClick={endTurn} disabled={!myTurn} title="Конец хода (Enter)">
              {b.active === "enemy" && !b.over ? <Hourglass size={20} /> : <Flag size={20} />}
              <span className="text-[13px] leading-tight">Конец<br />хода</span>
            </Btn>
          </div>
        </div>
      </footer>

      <Modal open={logOpen} onClose={() => setLogOpen(false)} title="Журнал боя">
        <h2 className="font-display mb-3 text-xl font-semibold">Журнал боя</h2>
        <LogList b={b} className="max-h-[60dvh]" bare />
      </Modal>

      <Modal open={!!inspectUnit} onClose={() => setInspectUnit(null)} title={inspectUnit?.name || "Карта"}>
        {inspectUnit && <Inspector inspect={{ unit: inspectUnit }} b={b} />}
      </Modal>

      <Modal open={confirmRetreat} onClose={() => setConfirmRetreat(false)} title="Отступить">
        <h2 className="font-display text-xl font-semibold">Отступить с поля боя?</h2>
        <p className="mt-2 text-sm text-dim">Засчитается как поражение.</p>
        <div className="mt-6 flex justify-end gap-3"><Btn variant="ghost" onClick={() => setConfirmRetreat(false)}>Продолжить бой</Btn><Btn variant="danger" onClick={retreat}>Отступить</Btn></div>
      </Modal>

      <Modal open={!!result} onClose={() => undefined} dismissable={false} title="Итог боя">
        {result && (
          <div className="text-center">
            <div className={cn("mx-auto grid h-16 w-16 place-items-center rounded-full", result.won ? "bg-bronze/15 text-bronze" : "bg-bad/15 text-bad")}>{result.won ? <Trophy size={30} /> : <X size={30} />}</div>
            <h2 className="font-display mt-4 text-3xl font-semibold">{result.won ? "Победа" : "Поражение"}</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-dim">{result.msg}</p>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <Btn size="lg" className="flex-1" onClick={() => { closeBattle(); go("camp"); }}>В лагерь</Btn>
              <Btn variant="secondary" size="lg" className="flex-1" onClick={() => { closeBattle(); go("army"); }}>К составу</Btn>
              <Btn variant="primary" size="lg" className="flex-1" onClick={rematch}>Реванш</Btn>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

/** Карточка отряда/карты в бою: свойства, ключевые слова с пояснениями и эффект. Экспорт — для тестов рендера. */
export function Inspector({ inspect, b }: { inspect: { unit?: Unit; card?: Card }; b: Battle }) {
  if (inspect.unit) {
    const u = inspect.unit;
    return (
      <div className="rounded-2xl border border-line bg-surface/95 p-4">
        <div className="flex items-center gap-3"><span className="text-3xl">{u.emoji}</span><div><div className="font-display text-lg font-semibold leading-tight">{u.name}</div><div className="text-xs text-faint">{u.isStructure ? "Постройка" : "Отряд"} · {u.era === "bronze" ? "Бронзовый век" : "Древний мир"}</div></div></div>
        <div className="mt-3 grid grid-cols-3 gap-2 text-center text-sm font-bold">
          <div className="rounded-lg bg-ground/70 py-1.5 text-clay"><Sword size={13} className="mx-auto mb-0.5" />{atkOf(b, u)}</div>
          <div className="rounded-lg bg-ground/70 py-1.5 text-ok"><Heart size={13} className="mx-auto mb-0.5" />{u.curHp}/{u.hp}</div>
          <div className="rounded-lg bg-ground/70 py-1.5 text-know"><Shield size={13} className="mx-auto mb-0.5" />{armorOf(b, u)}</div>
        </div>
        <KeywordChips keywords={u.keywords} className="mt-3" inactive={inactiveKeywords(b)} note={ONE_LINE_NOTE} />
        {u.keywords.length > 0 && (
          <ul className="mt-2 space-y-1 text-[11.5px] leading-snug text-dim">
            {u.keywords.map((k) => {
              const w = kwName(k);
              const off = inactiveKeywords(b).includes(kwBase(k));
              return (
                <li key={k}>
                  <span className={cn("text-parch", off && "text-faint line-through decoration-clay/70")}>{w.name}{w.level ? ` ${w.level}` : ""}.</span> {w.desc}
                  {off && <span className="text-clay"> {ONE_LINE_NOTE}</span>}
                </li>
              );
            })}
          </ul>
        )}
        {u.effects.length > 0 && <ul className="mt-2 space-y-1 text-xs leading-snug text-parch/90">{u.effects.map((e, i) => <li key={i} className="flex gap-1.5"><Zap size={11} className="mt-0.5 shrink-0 text-bronze" />{describeEffect(e)}</li>)}</ul>}
        <p className="mt-3 text-xs italic leading-snug text-dim">{u.description}</p>
      </div>
    );
  }
  if (inspect.card) return <div className="w-[240px] self-center"><CardFace card={inspect.card} detailed inactiveKeywords={inactiveKeywords(b)} keywordNote={ONE_LINE_NOTE} /></div>;
  return null;
}

function LogList({ b, className, bare }: { b: Battle; className?: string; bare?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { if (ref.current) ref.current.scrollTop = ref.current.scrollHeight; }, [b.log.length]);
  return (
    <div className={cn(!bare && "rounded-2xl border border-line bg-surface/95 p-3", "flex flex-col", className)}>
      {!bare && <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-faint">Журнал</div>}
      <div ref={ref} className="space-y-1 overflow-y-auto pr-1 text-[12px] leading-snug">
        {b.log.slice(-40).map((l) => (
          <div key={l.id} className={cn(l.side === "me" ? "text-bronze-soft" : l.side === "enemy" ? "text-clay" : "text-faint")}>{l.text}</div>
        ))}
      </div>
    </div>
  );
}
