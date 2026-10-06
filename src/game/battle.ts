import { buildMilitia, uid, type Card } from "./cards";

/* Тактический движок. Правила перенесены из Infinite Forge (кампанийный режим с единой энергией):
   авангард и тыл, энергия платит за выход и за атаку, вождь с малым запасом HP.
   Стол не фиксирован: он растёт вместе с эпохами — от одной линии в три клетки в Каменном веке
   до пяти рядов по пять в Будущем (см. BOARD_SHAPES). */

export type Side = "me" | "enemy";
export const HAND_LIMIT = 7;
const START_HAND = 4;

/**
 * Форма стола по эпохам (индекс — единая шкала ERAS из campaign.js). Размер общий для обеих
 * сторон и берётся из ЭПОХИ УГРОЗЫ — максимума эпохи игрока и эпохи племени, как HP и энергия:
 * иначе в поздних эпохах племя Средневековья стояло бы на столе Будущего в две линии.
 *
 * Каменный век — одна линия копейщиков и дубинщиков: ни тыла, ни построек, ни стрельбы из-за спин.
 * Дальше стол растёт то в глубину (новый ряд), то в ширину (новый столбец) — по очереди, чтобы
 * каждая эпоха добавляла одно понятное изменение.
 */
export interface BoardShape { rows: number; slots: number }
export const BOARD_SHAPES: BoardShape[] = [
  { rows: 1, slots: 3 }, // Каменный век: одна линия в три клетки
  { rows: 2, slots: 3 }, // Античный мир: вторые ряды — появился тыл
  { rows: 2, slots: 4 }, // Средневековье: четвёртый столбец
  { rows: 3, slots: 4 }, // Ренессанс: третий ряд
  { rows: 4, slots: 4 }, // Эпоха Пара и Стали: четвёртый ряд
  { rows: 4, slots: 5 }, // Новейшее время: пятый столбец
  { rows: 5, slots: 5 }, // Будущее 2050-2150: пятый ряд — спутники и наведение дронов
];
/** Стол без указанной эпохи — классические 2 ряда по 4 (Средневековье): старые бои и тесты не меняются. */
export const DEFAULT_BOARD_ERA = 2;

export function boardShape(era?: number | null): BoardShape {
  if (!Number.isFinite(era as number)) return BOARD_SHAPES[DEFAULT_BOARD_ERA];
  const idx = Math.max(0, Math.min(BOARD_SHAPES.length - 1, Math.trunc(era as number)));
  return BOARD_SHAPES[idx];
}

/** «3×4» — как стол подписан в бою и в лагере. */
export const boardLabel = (shape: BoardShape): string => `${shape.rows}×${shape.slots}`;

export interface Mod { stat: "attack" | "armor" | "action_cost"; amount: number; expires: number }
export interface Unit {
  iid: string;
  card: Card;
  name: string;
  emoji: string;
  card_type: Card["card_type"];
  era: string;
  atk: number;
  hp: number;
  curHp: number;
  drop_cost: number;
  action_cost: number;
  keywords: string[];
  effects: any[];
  st: Record<string, any>;
  mods: Mod[];
  exhausted: boolean;
  fresh: boolean;
  hitThisTurn: boolean;
  fears: boolean;
  /** "relentless" уже потратил свою вторую атаку в этом ходу. */
  usedRelentless: boolean;
  isStructure: boolean;
  order: number;
  hitSeq: number;
  lastDmg: number;
  rarity?: string;
  description: string;
}
export interface Hand extends Card { iid?: string; revivedOnce?: boolean }
export interface Player {
  hp: number; maxHp: number;
  deck: Hand[]; hand: Hand[]; discard: Hand[];
  fatigue: number;
  fatigueStart: number;
  /** Ряд 0 — авангард: сюда встаёт ближний бой и здесь принимают удар. */
  front: (Unit | null)[];
  /** Промежуточные ряды между авангардом и тылом: появляются с Ренессанса (3-й ряд и дальше). */
  middle: (Unit | null)[][];
  /** Последний ряд — тыл: постройки и отходящая засада. В Каменном веке это тот же массив, что front. */
  back: (Unit | null)[];
  energy: number; energyMax: number; energyCap: number; energyGrowth: number; energyGrowthBlockedNext: number;
  hitSeq: number; lastDmg: number;
  /** Плоский бонус к атаке всех отрядов этой стороны — воинская доктрина эпохи (EFFECTS.unit_power). */
  atkBonus: number;
}
export interface LogEntry { id: number; side: Side | "system"; text: string }
/** Бой в прототипе один: тренировка с племенем-соперником. Экспедиций и карты больше нет. */
export interface Match {
  kind: "practice";
  opponentId: string; name: string; clan: string; era: number; leaderBattle: boolean;
  /** Максимум эпохи игрока и эпохи племени: от него зависит размер стола (BOARD_SHAPES). */
  threatEra?: number;
  /** Первый в жизни игрока бой: тренер подсказывает шаги, враг приходит без построек. */
  tutorial?: boolean;
}
export interface Battle {
  me: Player; enemy: Player;
  /** Размер стола этого боя: рядов и клеток в ряду. Одинаков для обеих сторон. */
  shape: BoardShape;
  turn: number; active: Side;
  counters: { me: number; enemy: number };
  log: LogEntry[]; seq: number; order: number;
  over: null | "win" | "lose";
  match: Match;
}

// fatigueDelay — сколько дополнительных кругов сторона выдерживает без усталости (эффект построек fatigue_resist)
// atkBonus — плоский бонус к атаке всех отрядов стороны (воинская доктрина эпохи, EFFECTS.unit_power)
export interface SideConfig { hp: number; energyMax: number; energyGrowth: number; fatigueDelay?: number; atkBonus?: number }

const opp = (s: Side): Side => (s === "me" ? "enemy" : "me");

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

function newPlayer(deck: Card[], cfg: SideConfig, shape: BoardShape): Player {
  const line = (): (Unit | null)[] => Array(shape.slots).fill(null);
  const front = line();
  // Один ряд (Каменный век) — он же авангард, он же тыл: буквально один массив. Тогда постройка
  // может встать на единственную линию, а «уклониться в тыл» не превращается в прыжок в никуда.
  const back = shape.rows > 1 ? line() : front;
  const middle: (Unit | null)[][] = Array(Math.max(0, shape.rows - 2)).fill(0).map(() => line());
  return {
    hp: cfg.hp, maxHp: cfg.hp,
    deck: shuffle(deck.map((c) => ({ ...JSON.parse(JSON.stringify(c)), iid: uid() }))),
    hand: [], discard: [], fatigue: 0, fatigueStart: 6 + Math.max(0, Math.min(3, cfg.fatigueDelay || 0)),
    front, middle, back,
    energy: 1, energyMax: 1, energyCap: cfg.energyMax, energyGrowth: cfg.energyGrowth, energyGrowthBlockedNext: 0,
    hitSeq: 0, lastDmg: 0,
    atkBonus: Math.max(0, cfg.atkBonus || 0),
  };
}

// вражеское ополчение говорит своими именами: «Племенные копейщики атакует „Племенные копейщики"» в журнале нечитаемо
const ENEMY_MILITIA_NAMES: Record<string, string> = {
  "Племенные копейщики": "Налётчики с копьями",
  "Пращники из холмов": "Пращники разбойников",
  "Охотники с луками": "Стрелки из засады",
  "Топорники племени": "Топоры мародёров",
  "Разведчики на лошадях": "Всадники-загонщики",
  "Дружина вождя": "Стража атамана",
  "Частокол": "Баррикады",
  "Ночной набег": "Поджог лагеря",
  "Бронзовые наёмники": "Бронзовые головорезы",
  "Военный лагерь": "Стоянка грабителей",
};

/**
 * era — индекс в ERAS (единая шкала эпох из campaign.js). Бронзовые карты появляются у дозоров
 * с эпохи 1 «Античный мир»: тот же порог, что и у игрока (BRONZE_CARD_MIN_ERA / allowedCardEras
 * в модели). Согласованность двух порогов держит tests/era-alignment.test.js.
 */
export function enemyDeckForEra(era: number, limit: number): Card[] {
  const all = buildMilitia();
  const ordered = era >= 1 ? [...all.filter((c) => c.era === "bronze"), ...all.filter((c) => c.era !== "bronze")] : all;
  return fillDeck(ordered.map((c) => ({ ...c, name: ENEMY_MILITIA_NAMES[c.name] ?? c.name })), limit);
}

/**
 * Колода ровно из limit карт: если своих не хватает, состав повторяется по кругу. Нужна потому, что
 * стол растёт по эпохам до 5×5, а контент племён ограничен Средневековьем — в поздних эпохах племя
 * приходит не одним отрядом, а несколькими такими же (каждая копия получает свой iid в newPlayer).
 */
export function fillDeck(deck: Card[], limit: number): Card[] {
  const out: Card[] = [];
  if (!deck.length || !(limit > 0)) return out;
  while (out.length < limit) out.push({ ...deck[out.length % deck.length] });
  return out;
}

export function createBattle(myDeck: Card[], myCfg: SideConfig, enemyDeck: Card[], enemyCfg: SideConfig, match: Match): Battle {
  const shape = boardShape(match.threatEra ?? match.era);
  const b: Battle = {
    me: newPlayer(myDeck, myCfg, shape), enemy: newPlayer(enemyDeck, enemyCfg, shape), shape,
    turn: 1, active: "me", counters: { me: 1, enemy: 0 },
    log: [], seq: 0, order: 0, over: null, match,
  };
  const n = Math.min(START_HAND, myDeck.length);
  for (let i = 0; i < n; i++) { drawOne(b, "me", true); }
  for (let i = 0; i < Math.min(START_HAND, enemyDeck.length); i++) { drawOne(b, "enemy", true); }
  log(b, "system", "Бой начался. Вы ходите первым — темп боя изначально на вашей стороне.");
  log(b, "system", `Стол эпохи: ${shape.rows === 1 ? "одна линия" : `${shape.rows} ряда(ов)`} по ${shape.slots} клетки — ${boardLabel(shape)}.`);
  return b;
}

/* ---------- утилиты ---------- */

export function log(b: Battle, side: LogEntry["side"], text: string) {
  b.log.push({ id: ++b.seq, side, text });
  if (b.log.length > 150) b.log.shift();
}

const nm = (s: Side) => (s === "me" ? "Вы" : "Враг");
// глаголы 3-го лица ломают «Вы ...» в журнале («Вы тянет») — подбираем форму под сторону
const say = (s: Side, third: string, second: string) => `${nm(s)} ${s === "me" ? second : third}`;

/**
 * Ряд стороны: ri — индекс ряда (0 — авангард, rowCount-1 — тыл). Поле row оставлено подписью
 * для журнала, подсказок и старых проверок, но вся логика работает по ri: при трёх и более рядах
 * «front»/«back» уже не описывают позицию отряда полностью.
 */
export interface Slot { side: Side; ri: number; row: RowName; i: number; unit: Unit }
export type RowName = "front" | "middle" | "back";
/** Куда можно поставить карту: номер ряда либо привычные «авангард»/«тыл». */
export type RowRef = number | "front" | "back";

/** Все ряды стороны от авангарда к тылу. В Каменном веке front и back — один массив, он же единственный ряд. */
export function rowsOf(p: Player): (Unit | null)[][] {
  return p.front === p.back ? [p.front] : [p.front, ...p.middle, p.back];
}
export const rowCount = (p: Player): number => rowsOf(p).length;
export const slotCount = (p: Player): number => p.front.length;
export const rowArray = (p: Player, ri: number): (Unit | null)[] => rowsOf(p)[ri] || [];
export const isFrontRow = (_p: Player, ri: number): boolean => ri === 0;
export const isBackRow = (p: Player, ri: number): boolean => ri === rowCount(p) - 1;

/** «авангард», «тыл», «3-й ряд» — подпись ряда для журнала и подсказок тренера. */
export function rowName(p: Player, ri: number): string {
  const rows = rowCount(p);
  if (rows === 1) return "линия";
  if (ri === 0) return "авангард";
  if (ri === rows - 1) return "тыл";
  return `${ri + 1}-й ряд`;
}
const rowKey = (p: Player, ri: number): RowName => (isFrontRow(p, ri) ? "front" : isBackRow(p, ri) ? "back" : "middle");

/** Нормализует «front»/«back»/число в индекс ряда; вне стола возвращает -1. */
export function rowIndex(p: Player, ref: RowRef): number {
  const rows = rowCount(p);
  const ri = ref === "front" ? 0 : ref === "back" ? rows - 1 : Math.trunc(Number(ref));
  return Number.isFinite(ri) && ri >= 0 && ri < rows ? ri : -1;
}

export function unitsOf(b: Battle, side: Side): Slot[] {
  const out: Slot[] = [];
  const p = b[side];
  rowsOf(p).forEach((row, ri) => row.forEach((u, i) => { if (u) out.push({ side, ri, row: rowKey(p, ri), i, unit: u }); }));
  return out;
}

function posOf(b: Battle, u: Unit): Slot | null {
  for (const side of ["me", "enemy"] as Side[]) {
    const p = b[side];
    const rows = rowsOf(p);
    for (let ri = 0; ri < rows.length; ri++) {
      const i = rows[ri].indexOf(u);
      if (i >= 0) return { side, ri, row: rowKey(p, ri), i, unit: u };
    }
  }
  return null;
}

const has = (u: Unit | null | undefined, k: string) => !!(u && u.st && u.st[k]);

/**
 * Ключевые слова, которым нужна глубина стола: стрельба из-за спин, засада и «длинное оружие».
 * В Каменном веке стол — одна линия в три клетки: тыла нет, прятать стрелков не за кем и стрелять
 * не из-за кого, поэтому дальнего боя там нет вовсе — все отряды бьются врукопашную (бьют того, кто
 * напротив, затем ближайшего в линии, при пустой линии — вождя) и получают ответный удар.
 * Тот же список в cards.ts (ONE_LINE_KEYWORDS) использует кузнец: пока стол не вырос до второго
 * ряда, он не куёт стрелков. Тест сверяет оба списка, чтобы они не разъехались.
 */
export const DEPTH_KEYWORDS = ["ranged", "skirmish", "reach"];
/** Есть ли у стола глубина: больше одного ряда. */
export const deepTable = (b: Battle): boolean => b.shape.rows > 1;
/** Какие ключевые слова на этом столе не действуют — для подписей в интерфейсе. */
export const inactiveKeywords = (b: Battle): string[] => (deepTable(b) ? [] : DEPTH_KEYWORDS);

const isRanged = (b: Battle, u: Unit) => deepTable(b) && has(u, "ranged");
// засадный боец, отступивший в тыл, бьёт как дальний бой — иначе он застревает там без атак.
// На столе в одну линию ни тыла, ни стрельбы из-за спин нет: отряд бьётся как обычный ближний бой.
const strikesFromRear = (b: Battle, u: Unit) => deepTable(b) && (has(u, "ranged") || has(u, "skirmish"));

function modTotal(b: Battle, u: Unit, stat: Mod["stat"]) {
  const p = posOf(b, u);
  const side: Side | null = p ? p.side : null;
  return u.mods.reduce((t, m) => (m.stat === stat && (!side || m.expires > b.counters[side]) ? t + m.amount : t), 0);
}

export function neighborsOf(b: Battle, u: Unit): Unit[] {
  const p = posOf(b, u);
  if (!p) return [];
  const row = rowArray(b[p.side], p.ri);
  return [row[p.i - 1], row[p.i + 1]].filter(Boolean) as Unit[];
}

export function atkOf(b: Battle, u: Unit): number {
  let a = u.atk;
  if (has(u, "phalanx")) a += 1;
  const nb = neighborsOf(b, u);
  if (has(u, "wedge")) a += Math.min(2, nb.length);
  a += nb.filter((n) => has(n, "rally")).length;
  a += modTotal(b, u, "attack");
  const p = posOf(b, u);
  if (p) a += b[p.side].atkBonus || 0;
  // Мародёр: чем больше карт противник уже потерял в бою (его сброс), тем злее добивают его остатки.
  if (has(u, "scavenger") && p) a += Math.min(2, Math.floor(b[opp(p.side)].discard.length / 2));
  // Последний рубеж: в одиночестве в своём ряду отряд дерётся отчаяннее и держится твёрже.
  if (has(u, "laststand") && p && unitsOf(b, p.side).filter((s) => s.ri === p.ri).length === 1) a += 1;
  return Math.max(0, Math.min(99, a));
}
export function armorOf(b: Battle, u: Unit): number {
  let ar = (u.st.armor || 0) + modTotal(b, u, "armor");
  const p = posOf(b, u);
  if (has(u, "laststand") && p && unitsOf(b, p.side).filter((s) => s.ri === p.ri).length === 1) ar += 1;
  return Math.max(0, ar);
}
export const costOf = (b: Battle, u: Unit) => Math.max(0, u.action_cost + modTotal(b, u, "action_cost"));

function adjustEnergy(b: Battle, side: Side, amount: number): number {
  const player = b[side];
  const before = player.energy;
  player.energy = Math.max(0, Math.min(player.energyMax, before + amount));
  return player.energy - before;
}

function hasCardKeyword(card: { keywords?: string[] }, keyword: string): boolean {
  return (card.keywords || []).some((raw) => String(raw).toLowerCase().trim().split(":")[0] === keyword);
}

function applyEnergyKeywordsOnPlay(b: Battle, side: Side, card: { name: string; keywords?: string[] }) {
  const player = b[side];
  const enemySide = opp(side);
  if (hasCardKeyword(card, "supply")) {
    const beforeMax = player.energyMax;
    player.energyMax = Math.min(player.energyCap, player.energyMax + 1);
    const gained = adjustEnergy(b, side, 1);
    if (player.energyMax > beforeMax || gained) log(b, side, `«${card.name}» приносит снабжение: +${gained} энергии, предел ${player.energyMax}.`);
  }
  if (hasCardKeyword(card, "warcry")) {
    const gained = adjustEnergy(b, side, 1);
    if (gained) log(b, side, `«${card.name}» поднимает боевой дух: +${gained} энергии.`);
  }
  if (hasCardKeyword(card, "harras")) {
    b[enemySide].energyGrowthBlockedNext = (b[enemySide].energyGrowthBlockedNext || 0) + 1;
    log(b, side, `«${card.name}» задерживает прирост энергии противника на следующий ход.`);
  }
  if (hasCardKeyword(card, "exhaustenemy")) {
    const drained = adjustEnergy(b, enemySide, -1);
    if (drained) log(b, side, `«${card.name}» изматывает противника: ${drained} энергии.`);
  }
}

function makeUnit(b: Battle, card: Card): Unit {
  const atk = Math.max(0, Math.floor(card.atk) || 0);
  const hp = Math.max(1, Math.floor(card.hp) || 1);
  const u: Unit = {
    iid: uid(), card, name: card.name || "Безымянный", emoji: card.emoji || "⚒️", card_type: card.card_type, era: card.era || "ancient",
    atk, hp, curHp: hp, drop_cost: card.drop_cost || 0, action_cost: card.action_cost || 0,
    keywords: card.keywords || [], effects: card.effects || [], st: {}, mods: [],
    exhausted: true, fresh: true, hitThisTurn: false, fears: false, usedRelentless: false,
    isStructure: card.card_type === "structure", order: b.order++, hitSeq: 0, lastDmg: 0,
    rarity: card.rarity, description: card.description || "",
  };
  for (const raw of u.keywords) {
    const [kw, ns] = String(raw).toLowerCase().trim().split(":");
    const n = Math.max(1, parseInt(ns) || 1);
    if (["armor", "pierce", "poison", "burn", "heal", "cleave", "vengeance"].includes(kw)) u.st[kw] = Math.max(u.st[kw] || 0, n);
    else u.st[kw] = true;
  }
  if (u.st.shieldwall || u.st.phalanx) u.st.armor = Math.max(u.st.armor || 0, 1);
  return u;
}

/* ---------- карты: добор ---------- */

function hurtHero(b: Battle, side: Side, amount: number) {
  const p = b[side];
  p.hp -= amount; p.hitSeq++; p.lastDmg = amount;
}
// source — кто нанёс урон (если известен): нужен только для события "damaged" у самой цели.
// Срабатывает для любого источника урона (бой, заклинание, яд/поджог, обстрел постройки) —
// единая точка, где curHp реально уменьшается.
function hurtUnit(b: Battle, u: Unit, amount: number, source?: Unit | null) {
  u.curHp -= amount; u.hitSeq++; u.lastDmg = amount;
  if (u.curHp > 0) {
    const p = posOf(b, u);
    if (p) {
      const srcPos = source ? posOf(b, source) : null;
      const eventTarget = srcPos ? ({ kind: "unit", side: srcPos.side, unit: source } as Tgt) : null;
      runEffects(b, u, "damaged", p.side, eventTarget);
    }
  }
}

function drawOne(b: Battle, side: Side, silent = false): boolean {
  const p = b[side];
  if (p.deck.length === 0 && p.discard.length > 0) {
    // Погибшая карта возвращается в колоду через перетасовку сброса только один раз:
    // карты, уже однажды вернувшиеся так в игру, остаются в сбросе навсегда.
    const revivable = p.discard.filter((c) => !c.revivedOnce);
    const stuck = p.discard.filter((c) => c.revivedOnce);
    if (revivable.length > 0) {
      for (const c of revivable) c.revivedOnce = true;
      p.deck = shuffle(revivable);
      p.discard = stuck;
      if (!silent) log(b, side, `${say(side, 'перетасовывает', 'перетасовываете')} сброс в колоду (каждая карта возвращается так не больше раза).`);
    }
  }
  if (p.deck.length === 0 && b.turn < p.fatigueStart) return false; // первые круги усталости нет — микро-колоды не должны умирать сами собой (fatigueStart сдвигает эффект построек)
  if (p.deck.length === 0) {
    p.fatigue++;
    hurtHero(b, side, p.fatigue);
    if (!silent) log(b, side, `${say(side, 'тянет', 'тянете')} из пустой колоды: усталость ${p.fatigue} наносит ${p.fatigue} урона.`);
    return false;
  }
  if (p.hand.length >= HAND_LIMIT) {
    const burned = p.deck.shift()!;
    p.discard.push(burned);
    log(b, side, `${nm(side)}: рука переполнена, «${burned.name}» уходит в сброс.`);
    return false;
  }
  const c = p.deck.shift()!;
  c.iid = uid();
  p.hand.push(c);
  return true;
}

function drawMany(b: Battle, side: Side, n: number, src: string) {
  let got = 0;
  for (let i = 0; i < n && b[side].hp > 0; i++) if (drawOne(b, side)) got++;
  log(b, side, `${src}: ${say(side, "берёт", "берёте").toLowerCase()} карт — ${got}.`);
}

function discardFrom(b: Battle, side: Side, n: number, choice: string, src: string) {
  const p = b[side];
  for (let k = 0; k < n && p.hand.length; k++) {
    let idx = 0;
    const cost = (c: Card) => c.drop_cost;
    if (choice === "lowest_cost") idx = p.hand.reduce((bi, c, i) => (cost(c) < cost(p.hand[bi]) ? i : bi), 0);
    else idx = p.hand.reduce((bi, c, i) => (cost(c) > cost(p.hand[bi]) ? i : bi), 0);
    const [c] = p.hand.splice(idx, 1);
    p.discard.push(c);
    log(b, side, `${src}: «${c.name}» сброшена.`);
  }
}

/* ---------- цели атаки ---------- */

export type AttackTarget = { kind: "hero"; side: Side } | UnitTarget;
/** Цель-отряд: позиция на столе (ряд и слот) нужна движку, подписи и подсветке в бою. */
export type UnitTarget = { kind: "unit"; side: Side; ri: number; row: RowName; i: number; unit: Unit };

const targetAt = (b: Battle, es: Side, ri: number, i: number, unit: Unit): UnitTarget =>
  ({ kind: "unit", side: es, ri, row: rowKey(b[es], ri), i, unit });

/**
 * Ближайший к слоту i живой отряд в ряду ri: сначала зеркальный слот, затем соседи слева и справа.
 * structures=true ищет постройки (их достаёт только осада), false — обычные отряды.
 */
function nearestInRow(b: Battle, es: Side, ri: number, i: number, structures: boolean): UnitTarget | null {
  const row = rowArray(b[es], ri);
  const fits = (u: Unit | null) => !!u && u.curHp > 0 && (structures ? u.isStructure : !u.isStructure);
  if (fits(row[i])) return targetAt(b, es, ri, i, row[i]!);
  for (let off = 1; off < row.length; off++) for (const dir of [-1, 1]) {
    const idx = i + dir * off;
    if (idx >= 0 && idx < row.length && fits(row[idx])) return targetAt(b, es, ri, idx, row[idx]!);
  }
  return null;
}

/**
 * Первый ряд начиная с fromRi, где есть подходящая цель: ближний бой продвигается вглубь
 * вражеского стола ряд за рядом. Пока жив авангард, задние ряды для него недоступны — этим
 * тыл и ценен, и это же работает на пяти рядах Будущего.
 */
function nearestBehind(b: Battle, es: Side, fromRi: number, i: number, structures: boolean): UnitTarget | null {
  for (let ri = fromRi; ri < rowCount(b[es]); ri++) {
    const found = nearestInRow(b, es, ri, i, structures);
    if (found) return found;
  }
  return null;
}

/**
 * Цель дальнего боя: стрелки (ranged, skirmish) бьют через ВСЕ вражеские ряды — строй защищает
 * только от ближнего боя. Провокация перехватывает выстрел, иначе целью становится самый опасный
 * отряд на поле (по атаке с учётом модификаторов и бонуса вождя), при равенстве — стоящий глубже
 * (ближним боем его труднее достать) и левее. Постройки не цели для стрелков: их разбирает осада.
 * Если отрядов нет — бьём вождя.
 */
function rangedTarget(b: Battle, es: Side): AttackTarget {
  const alive = unitsOf(b, es).filter((s) => s.unit.curHp > 0 && !s.unit.isStructure);
  if (!alive.length) return { kind: "hero", side: es };
  const taunted = alive.find((s) => has(s.unit, "taunt"));
  const best = taunted || alive.reduce((a, x) => {
    const aa = atkOf(b, a.unit), xa = atkOf(b, x.unit);
    if (xa !== aa) return xa > aa ? x : a;
    if (x.ri !== a.ri) return x.ri > a.ri ? x : a;
    return x.i < a.i ? x : a;
  });
  return targetAt(b, es, best.ri, best.i, best.unit);
}

export function findTarget(b: Battle, attacker: Unit, side: Side): AttackTarget | null {
  const p = posOf(b, attacker);
  if (!p) return null;
  const es = opp(side);
  // Дальний бой работает из любого ряда: вражеский строй его не закрывает. На одной линии
  // Каменного века дальнего боя нет — стрелок уходит в обычную ветку ближнего боя ниже.
  if (strikesFromRear(b, attacker)) return rangedTarget(b, es);
  if (p.ri !== 0) {
    // Из глубины без дальнего боя дотягивается только длинное оружие — и лишь по врагу напротив в авангарде.
    const front = rowArray(b[es], 0);
    if (has(attacker, "reach") && front[p.i]) return targetAt(b, es, 0, p.i, front[p.i]!);
    return null;
  }
  const front = rowArray(b[es], 0);
  for (let i = 0; i < front.length; i++) { const u = front[i]; if (u && has(u, "taunt")) return targetAt(b, es, 0, i, u); }
  if (front[p.i]) return targetAt(b, es, 0, p.i, front[p.i]!);
  const beside = nearestInRow(b, es, 0, p.i, false);
  if (beside) return beside;
  // Авангард врага пуст — ближний бой идёт вглубь, ряд за рядом. Осадное орудие ищет постройки
  // (они стоят в тылу), остальные берут ближайший отряд, и только при пустом столе бьют вождя.
  if (has(attacker, "siege")) {
    const structure = nearestBehind(b, es, 1, p.i, true);
    if (structure) return structure;
  }
  const deep = nearestBehind(b, es, 1, p.i, false);
  if (deep) return deep;
  return { kind: "hero", side: es };
}

export function canAct(b: Battle, side: Side, u: Unit): boolean {
  return !b.over && b.active === side && !u.exhausted && !u.isStructure && costOf(b, u) <= b[side].energy;
}

/* ---------- удар ---------- */

function resolveHit(b: Battle, attacker: Unit, target: Unit, base: number, attackerSide: Side): number {
  const wasAlive = target.curHp > 0;
  let dmg = base;
  if (attacker.era === "bronze" && target.era === "ancient") dmg += 1;
  if (attacker.era === "ancient" && target.era === "bronze") dmg = Math.max(1, dmg - 1);
  const armor = Math.max(0, armorOf(b, target) - (attacker.st.pierce || 0));
  dmg = Math.max(1, dmg - armor);
  if (has(attacker, "charge") && attacker.fresh && !(has(target, "holdground") && target.fresh)) dmg += 2;
  if (has(target, "shieldwall") && neighborsOf(b, target).length >= 1) dmg = Math.max(1, dmg - 1);
  if (has(target, "sturdy") && !target.hitThisTurn) { dmg = Math.max(1, dmg - 1); target.hitThisTurn = true; }
  if (target.isStructure && has(attacker, "siege")) dmg *= 2;
  if (has(attacker, "fear") && Math.random() < 0.25 && !(has(target, "holdground") && target.fresh) && !has(target, "unbreakable")) target.fears = true;
  dmg = Math.max(1, Math.floor(dmg));
  hurtUnit(b, target, dmg, attacker);

  const defenderSide = opp(attackerSide);
  if (has(attacker, "raider") && wasAlive && !target.isStructure && b[defenderSide].energy > 0) {
    adjustEnergy(b, defenderSide, -1);
    adjustEnergy(b, attackerSide, 1);
    log(b, attackerSide, `«${attacker.name}» крадёт 1 энергию у противника.`);
  }
  if (has(attacker, "loot") && wasAlive && target.curHp <= 0 && !target.isStructure) {
    const gained = adjustEnergy(b, attackerSide, 1);
    if (gained) log(b, attackerSide, `«${attacker.name}» получает трофеи: +${gained} энергии.`);
  }
  return dmg;
}

export function attackWith(b: Battle, side: Side, iid: string): boolean {
  const attacker = unitsOf(b, side).find((s) => s.unit.iid === iid)?.unit;
  if (!attacker || !canAct(b, side, attacker)) return false;
  const target = findTarget(b, attacker, side);
  const p = posOf(b, attacker)!;
  if (!target) { attacker.exhausted = true; return true; }
  let hitLanded = true;
  if (target.kind === "hero") {
    const d = Math.max(1, atkOf(b, attacker));
    hurtHero(b, target.side, d);
    log(b, side, `${attacker.name} бьёт ${target.side === "me" ? "вашего вождя" : "вражеского вождя"}: −${d}.`);
  } else {
    const t = target.unit;
    const defenderSide = target.side;
    // Засадный боец в авангарде уклоняется в тыл от ближнего боя ДО обмена ударами — урона не будет ни ему, ни атакующему.
    // Уклониться в тыл можно, только если тыл — отдельный ряд: в Каменном веке линия одна.
    const dodgeRow = rowArray(b[defenderSide], rowCount(b[defenderSide]) - 1);
    const defenderDodges = !isRanged(b, attacker) && has(t, "skirmish") && target.ri === 0
      && rowCount(b[defenderSide]) > 1 && dodgeRow.indexOf(null) >= 0;
    if (defenderDodges) {
      const free = dodgeRow.indexOf(null);
      rowArray(b[defenderSide], 0)[target.i] = null;
      dodgeRow[free] = t;
      log(b, defenderSide, `«${t.name}» уклоняется в тыл от «${attacker.name}»: засада не принимает ближний бой.`);
      hitLanded = false;
    } else {
      const d = resolveHit(b, attacker, t, atkOf(b, attacker), side);
      // Рассечение: сопутствующий удар по обоим соседям цели в её ряду (даже если сама цель от основного удара погибла) —
      // отдельная "фитча" широкого замаха, не связана с исходом обмена ударами с основной целью.
      if (has(attacker, "cleave")) {
        for (const n of neighborsOf(b, t)) {
          if (n.curHp <= 0) continue;
          const cd = resolveHit(b, attacker, n, attacker.st.cleave, side);
          log(b, side, `${attacker.name} рассекает ещё и «${n.name}»: −${cd}.`);
        }
      }
      let counter = 0;
      if (!isRanged(b, attacker) && t.curHp > 0 && !t.isStructure) {
        const cb = atkOf(b, t);
        if (cb > 0) counter = resolveHit(b, t, attacker, cb, opp(side));
      }
      // Выстрел через живой авангард — это отдельная ситуация: иначе непонятно, почему стрелок
      // из тыла бьёт не тех, кто стоит напротив.
      const overFront = isRanged(b, attacker) && target.ri > 0 && !!rowArray(b[defenderSide], 0).find((u) => u && u.curHp > 0);
      log(b, side, `${attacker.name} ${overFront ? "стреляет через строй по" : "атакует"} «${t.name}»: −${d}${counter ? ` / ответ −${counter}` : ""}.`);
      // Месть: погибший в этом обмене ударами отряд наносит ответный удар своему убийце, если тот ещё жив.
      // Пока охватывает только прямой ближний/дальний бой (resolveHit выше и ниже), а не урон от заклинаний/статусов.
      if (t.curHp <= 0 && has(t, "vengeance") && attacker.curHp > 0) {
        const v = t.st.vengeance;
        hurtUnit(b, attacker, v, t);
        log(b, side, `«${t.name}» наносит удар мести: −${v} по «${attacker.name}».`);
      }
      if (counter > 0 && attacker.curHp <= 0 && has(attacker, "vengeance") && t.curHp > 0) {
        const v = attacker.st.vengeance;
        hurtUnit(b, t, v, attacker);
        log(b, opp(side), `«${attacker.name}» наносит удар мести: −${v} по «${t.name}».`);
      }
      // Яд/поджог от ключевого слова раньше никогда не истекали (в отличие от тех же статусов от заклинаний,
      // которые получают явный срок через apply_status) — отряд, который бьют поджигающим/ядовитым атакующим
      // несколько ходов подряд, копил бесконечно растущий урон за ход. Теперь каждый удар обновляет срок действия
      // на 2 хода, как и у аналогичного эффекта заклинаний (баланс-ревизия).
      if (has(attacker, "poison")) { t.st.poison = (t.st.poison || 0) + 1; t.st.poisonTurns = 2; }
      if (has(attacker, "burn")) { t.st.burn = (t.st.burn || 0) + 1; t.st.burnTurns = 2; }
      // После собственной атаки засадный боец тоже уходит в тыл и дальше бьёт как боец дальнего боя (см. strikesFromRear).
      if (has(attacker, "skirmish") && p.ri === 0 && attacker.curHp > 0 && rowCount(b[side]) > 1) {
        const backLine = rowArray(b[side], rowCount(b[side]) - 1);
        const freeBack = backLine.indexOf(null);
        if (freeBack >= 0) { rowArray(b[side], 0)[p.i] = null; backLine[freeBack] = attacker; log(b, side, `${attacker.name} отступает в тыл и продолжит бить из засады.`); }
      }
    }
  }
  attacker.fresh = false;
  // "Неутомимый" получает одну дополнительную атаку за ход (не истощается после первой), если переживёт обмен
  // ударами; дальше его ограничивает только запас энергии — третьей атаки не будет, usedRelentless уже true.
  if (has(attacker, "relentless") && !attacker.usedRelentless && attacker.curHp > 0) {
    attacker.usedRelentless = true;
  } else {
    attacker.exhausted = true;
  }
  adjustEnergy(b, side, -costOf(b, attacker));
  if (hitLanded && attacker.curHp > 0 && posOf(b, attacker)) runEffects(b, attacker, "attack", side, target.kind === "hero" ? { kind: "player", side: target.side } : { kind: "unit", side: target.side, unit: target.unit });
  settle(b);
  return true;
}

/* ---------- высадка и манёвры ---------- */

export function canPlay(b: Battle, side: Side, card: Card): boolean {
  return !b.over && b.active === side && card.drop_cost <= b[side].energy;
}

/**
 * Кто может стоять в ряду ri (обобщение прежних двух рядов на любую глубину стола):
 *  • постройки — только в тылу, последний ряд: в Каменном веке это единственная линия;
 *  • ближний бой без стрельбы и без «длинного оружия» — только в авангарде, из глубины он не дотянется;
 *  • дальнобойные (ranged, skirmish) и reach — в любом ряду: они бьют поверх строя.
 */
export function canStandInRow(card: { card_type: string; keywords?: string[] }, p: Player, ri: number): boolean {
  if (card.card_type === "structure") return isBackRow(p, ri);
  if (isFrontRow(p, ri) || rowCount(p) === 1) return true;
  return (card.keywords || []).some((raw) => ["ranged", "skirmish", "reach"].includes(String(raw).toLowerCase().trim().split(":")[0]));
}

export function deploy(b: Battle, side: Side, handIdx: number, row: RowRef, slot: number): boolean {
  const p = b[side];
  const card = p.hand[handIdx];
  if (!card || card.card_type === "spell" || !canPlay(b, side, card)) return false;
  const ri = rowIndex(p, row);
  if (ri < 0 || !canStandInRow(card, p, ri)) return false;
  const line = rowArray(p, ri);
  if (slot < 0 || slot >= line.length || line[slot]) return false;
  p.energy -= card.drop_cost;
  p.hand.splice(handIdx, 1);
  const u = makeUnit(b, card);
  line[slot] = u;
  log(b, side, `${say(side, 'выводит', 'выводите')} «${u.name}».`);
  applyEnergyKeywordsOnPlay(b, side, u);
  runEffects(b, u, "enter_play", side, null);
  notifyCardEnterPlay(b, side, u);
  settle(b);
  return true;
}

export function cast(b: Battle, side: Side, handIdx: number): boolean {
  const p = b[side];
  const card = p.hand[handIdx];
  if (!card || card.card_type !== "spell" || !canPlay(b, side, card)) return false;
  p.energy -= card.drop_cost;
  p.hand.splice(handIdx, 1);
  p.discard.push(card);
  log(b, side, `${say(side, 'разыгрывает', 'разыгрываете')} манёвр «${card.name}».`);
  applyEnergyKeywordsOnPlay(b, side, card);
  runEffects(b, { name: card.name, effects: card.effects } as any, "enter_play", side, null);
  notifyCardEnterPlay(b, side);
  settle(b);
  return true;
}

export function spellHasTarget(b: Battle, side: Side, card: Card): boolean {
  return (card.effects || []).some((e) => {
    if (e.target.entity === "player") return true;
    const t = resolveTargets(b, e, { source: null, owner: side, eventTarget: null }, true);
    if (e.action.type === "heal") return t.some((x) => x.kind === "unit" && x.unit.curHp < x.unit.hp);
    return t.length > 0;
  });
}

/* ---------- конструктор эффектов ---------- */

interface Ctx { source: Unit | null; owner: Side; eventTarget: any; name?: string }
type Tgt = { kind: "player"; side: Side } | { kind: "unit"; side: Side; unit: Unit; ri?: number; row?: RowName; i?: number };

function resolveTargets(b: Battle, e: any, ctx: Ctx, all = false): Tgt[] {
  const spec = e.target;
  const owner = ctx.owner;
  const sideSel: Side | null = spec.side === "controller" || spec.side === "friendly" ? owner : spec.side === "opponent" || spec.side === "enemy" ? opp(owner) : null;
  let select = spec.select || "first";
  // select:"all" просит движок не ограничивать список spec.count — то же, что и штатный параметр
  // all (который существует для проверки "есть ли вообще хоть одна цель" у заклинаний, см. spellHasTarget).
  if (select === "all") all = true;
  if (select === "attack_target" || spec.relation === "attack_target") {
    const t = ctx.eventTarget;
    if (!t) return [];
    if (t.kind === "player") return spec.entity === "player" ? [t] : [];
    if (t.unit.curHp <= 0) return [];
    if (sideSel && sideSel !== t.side) return [];
    if (spec.entity === "unit" && t.unit.isStructure) return [];
    if (spec.entity === "structure" && !t.unit.isStructure) return [];
    return [t];
  }
  if (select === "choose") {
    const a = e.action.type;
    select = a === "heal" ? "lowest_hp_ratio" : a === "destroy" ? "highest_attack" : a === "damage" || a === "apply_status" ? "lowest_hp" : "highest_attack";
  }
  if (spec.entity === "player") {
    let sides: Side[] = spec.side === "either" ? ["me", "enemy"] : [sideSel || owner];
    if (spec.side === "either") sides = [e.action.type === "heal" ? owner : e.action.type === "damage" ? opp(owner) : owner];
    return sides.map((s) => ({ kind: "player", side: s }) as Tgt).slice(0, all ? 2 : 1);
  }
  const sides: Side[] = spec.side === "either" ? ["me", "enemy"] : [sideSel || owner];
  let cands: Slot[] = sides.flatMap((s) => unitsOf(b, s)).filter((s) => {
    if (s.unit.curHp <= 0) return false;
    if (spec.entity === "unit" && s.unit.isStructure) return false;
    if (spec.entity === "structure" && !s.unit.isStructure) return false;
    // zone: front — авангард (нулевой ряд), rear — всё, что за ним. На двух рядах rear это ровно тыл,
    // на пяти — четыре глубинных ряда: «бьёт по тылам» остаётся осмысленным на любом столе.
    if (spec.zone === "front" && s.ri !== 0) return false;
    if (spec.zone === "rear" && s.ri === 0) return false;
    return true;
  });
  if (spec.relation === "self") cands = cands.filter((s) => s.unit === ctx.source);
  if (spec.relation === "adjacent") {
    const pos = ctx.source && posOf(b, ctx.source);
    cands = pos ? cands.filter((s) => s.side === pos.side && s.ri === pos.ri && Math.abs(s.i - pos.i) === 1) : [];
  }
  if (select === "lowest_hp") cands.sort((x, y) => x.unit.curHp - y.unit.curHp || x.i - y.i);
  else if (select === "lowest_hp_ratio") cands.sort((x, y) => x.unit.curHp / x.unit.hp - y.unit.curHp / y.unit.hp || x.i - y.i);
  else if (select === "highest_attack") cands.sort((x, y) => atkOf(b, y.unit) - atkOf(b, x.unit) || x.i - y.i);
  else if (select === "random") cands = shuffle(cands);
  const out: Tgt[] = cands.map((s) => ({ kind: "unit", side: s.side, unit: s.unit, ri: s.ri, row: s.row, i: s.i }));
  return all ? out : out.slice(0, spec.count || 1);
}

const CMP: Record<string, (a: number, b: number) => boolean> = {
  eq: (a, b) => a === b, ne: (a, b) => a !== b, lt: (a, b) => a < b, lte: (a, b) => a <= b, gt: (a, b) => a > b, gte: (a, b) => a >= b,
};

function condOk(b: Battle, c: any, ctx: Ctx, t: Tgt): boolean {
  if (!c) return true;
  if (c.all) return c.all.every((x: any) => condOk(b, x, ctx, t));
  if (c.any) return c.any.some((x: any) => condOk(b, x, ctx, t));
  if (c.not) return !condOk(b, c.not, ctx, t);
  if (c.type === "target_wounded") return t.kind === "player" ? b[t.side].hp < b[t.side].maxHp : t.unit.curHp < t.unit.hp;
  if (c.type === "target_status") return t.kind === "unit" && !!t.unit.st[c.status];
  if (c.type === "target_stat") {
    let v: number | null = null;
    if (t.kind === "player") v = c.stat === "hp" ? b[t.side].hp : null;
    else v = c.stat === "hp" ? t.unit.curHp : c.stat === "attack" ? atkOf(b, t.unit) : armorOf(b, t.unit);
    return v !== null && CMP[c.op](v, c.value);
  }
  if (c.type === "resource") {
    const s = c.side === "controller" ? ctx.owner : opp(ctx.owner);
    return CMP[c.op](b[s].energy, c.value);
  }
  if (c.type === "board_count") {
    const s = c.side === "controller" ? ctx.owner : opp(ctx.owner);
    return CMP[c.op](unitsOf(b, s).length, c.value);
  }
  return false;
}

let depth = 0;

export function runEffects(b: Battle, source: Unit | { name: string; effects: any[] }, event: string, owner: Side, eventTarget: any) {
  const effects = (source as any).effects as any[] | undefined;
  if (!effects?.length || depth > 12) return;
  depth++;
  try {
    for (const e of effects) {
      if (e.event !== event) continue;
      if (b.over) break;
      const isUnit = (source as Unit).iid !== undefined;
      const ctx: Ctx = { source: isUnit ? (source as Unit) : null, owner, eventTarget, name: source.name };
      const targets = resolveTargets(b, e, ctx);
      for (const t of targets) {
        if (!condOk(b, e.condition, ctx, t)) continue;
        execEffect(b, e, t, ctx);
      }
    }
  } finally { depth--; }
}

// Реакция других отрядов на поле на розыгрыш ЛЮБОЙ карты (отряда/постройки/манёвра) — зеркало к card_death
// (см. settle()), но на "вход", а не на "выход". exclude — сам только что выставленный отряд: он не реагирует
// на собственное появление (у него для этого есть обычный enter_play).
function notifyCardEnterPlay(b: Battle, side: Side, exclude?: Unit) {
  for (const w of [...unitsOf(b, "me"), ...unitsOf(b, "enemy")]) {
    if (w.unit === exclude || w.unit.curHp <= 0) continue;
    for (const e of w.unit.effects || []) {
      if (e.event !== "card_enter_play") continue;
      const rel = side === w.side ? "friendly" : "enemy";
      if (e.watch.side !== "all" && e.watch.side !== rel) continue;
      const ctx: Ctx = { source: w.unit, owner: w.side, eventTarget: null, name: w.unit.name };
      for (const t of resolveTargets(b, e, ctx)) if (condOk(b, e.condition, ctx, t)) execEffect(b, e, t, ctx);
    }
  }
}

function execEffect(b: Battle, e: any, t: Tgt, ctx: Ctx) {
  const a = e.action;
  const src = ctx.name || "Эффект";
  const who = ctx.owner;
  const tname = t.kind === "player" ? (t.side === "me" ? "вашего вождя" : "вражеского вождя") : `«${t.unit.name}»`;
  switch (a.type) {
    case "damage":
      if (t.kind === "player") hurtHero(b, t.side, a.amount); else hurtUnit(b, t.unit, a.amount, ctx.source || undefined);
      log(b, who, `${src}: ${a.amount} урона — ${tname}.`);
      break;
    case "heal":
      if (t.kind === "player") { const p = b[t.side]; p.hp = Math.min(p.maxHp, p.hp + a.amount); }
      else t.unit.curHp = Math.min(t.unit.hp, t.unit.curHp + a.amount);
      log(b, who, `${src}: лечение +${a.amount} — ${tname}.`);
      break;
    case "apply_status":
      if (t.kind === "unit") {
        t.unit.st[a.status] = Math.max(t.unit.st[a.status] || 0, a.amount);
        t.unit.st[a.status + "Turns"] = a.turns ?? 2;
        log(b, who, `${src}: ${a.status === "poison" ? "яд" : "поджог"} ${a.amount} — ${tname}.`);
      }
      break;
    case "destroy":
      if (t.kind === "unit") { t.unit.curHp = 0; t.unit.hitSeq++; log(b, who, `${src}: уничтожает ${tname}.`); }
      break;
    case "modify_resource": {
      const p = b[t.kind === "player" ? t.side : who];
      const before = p.energy;
      p.energy = Math.max(0, Math.min(p.energyMax, before + a.amount));
      if (p.energy !== before) log(b, who, `${src}: энергия ${p.energy - before > 0 ? "+" : ""}${p.energy - before} (${t.kind === "player" && t.side === "me" ? "вам" : "врагу"}).`);
      break;
    }
    case "modify_stat":
      if (t.kind === "unit") {
        const u = t.unit;
        if (a.stat === "max_hp") { u.hp = Math.max(1, u.hp + a.amount); u.curHp = a.amount > 0 ? u.curHp + a.amount : Math.min(u.curHp, u.hp); }
        else if (a.turns) u.mods.push({ stat: a.stat, amount: a.amount, expires: b.counters[t.side] + a.turns });
        else if (a.stat === "attack") u.atk = Math.max(0, u.atk + a.amount);
        else u.st.armor = Math.max(0, (u.st.armor || 0) + a.amount);
        log(b, who, `${src}: ${a.amount > 0 ? "+" : ""}${a.amount} ${a.stat === "attack" ? "атаки" : a.stat === "armor" ? "брони" : "здоровья"} — ${tname}${a.turns ? ` (${a.turns} х.)` : ""}.`);
      }
      break;
    case "modify_cost":
      if (t.kind === "unit") {
        if (a.turns) t.unit.mods.push({ stat: "action_cost", amount: a.amount, expires: b.counters[t.side] + a.turns });
        else t.unit.action_cost = Math.max(0, t.unit.action_cost + a.amount);
        log(b, who, `${src}: цена атаки ${a.amount > 0 ? "+" : ""}${a.amount} — ${tname}.`);
      }
      break;
    case "draw": if (t.kind === "player") drawMany(b, t.side, a.amount, src); break;
    case "discard": if (t.kind === "player") discardFrom(b, t.side, a.amount, a.choice === "lowest_cost" ? "lowest_cost" : "highest_cost", src); break;
    case "exchange":
      if (t.kind === "player") { drawMany(b, t.side, a.amount, src); discardFrom(b, t.side, a.amount, a.choice === "lowest_cost" ? "lowest_cost" : "highest_cost", src); }
      break;
    case "scry":
      if (t.kind === "player") { const p = b[t.side]; const top = p.deck.splice(0, a.amount).sort((x, y) => x.drop_cost - y.drop_cost); p.deck.unshift(...top); log(b, who, `${src}: просмотр верха колоды.`); }
      break;
  }
}

/* ---------- гибель и завершение ---------- */

function cardOfUnit(u: Unit): Hand { return { ...u.card, iid: uid() }; }

export function settle(b: Battle) {
  for (let guard = 0; guard < 20; guard++) {
    const dead = (["me", "enemy"] as Side[]).flatMap((s) => unitsOf(b, s)).filter((s) => s.unit.curHp <= 0).sort((x, y) => x.unit.order - y.unit.order);
    if (!dead.length) break;
    for (const d of dead) {
      const arr = rowArray(b[d.side], d.ri);
      if (arr[d.i] !== d.unit) continue;
      arr[d.i] = null;
      b[d.side].discard.push(cardOfUnit(d.unit));
      log(b, d.side, `«${d.unit.name}» ${d.side === "me" ? "пал" : "повержен"}.`);
      runEffects(b, d.unit, "death", d.side, null);
      for (const w of (["me", "enemy"] as Side[]).flatMap((s) => unitsOf(b, s))) {
        for (const e of w.unit.effects || []) {
          if (e.event !== "card_death" || w.unit.curHp <= 0) continue;
          const rel = d.side === w.side ? "friendly" : "enemy";
          if (e.watch.side !== "all" && e.watch.side !== rel) continue;
          const ctx: Ctx = { source: w.unit, owner: w.side, eventTarget: null, name: w.unit.name };
          for (const t of resolveTargets(b, e, ctx)) if (condOk(b, e.condition, ctx, t)) execEffect(b, e, t, ctx);
        }
      }
    }
  }
  checkEnd(b);
}

function checkEnd(b: Battle) {
  if (b.over) return;
  const meDead = b.me.hp <= 0, enDead = b.enemy.hp <= 0;
  if (!meDead && !enDead) return;
  if (meDead && enDead) b.over = b.active === "me" ? "win" : "lose";
  else b.over = enDead ? "win" : "lose";
  log(b, "system", b.over === "win" ? "Вражеский вождь повержен." : "Ваш вождь пал.");
}

/* ---------- ходы ---------- */

/** Первый живой отряд врага по порядку: ряд за рядом от авангарда вглубь, в ряду — по слотам. */
function firstAlive(b: Battle, es: Side): UnitTarget | null {
  for (let ri = 0; ri < rowCount(b[es]); ri++) {
    const row = rowArray(b[es], ri);
    for (let i = 0; i < row.length; i++) {
      const u = row[i];
      if (u && u.curHp > 0 && !u.isStructure) return targetAt(b, es, ri, i, u);
    }
  }
  return null;
}

function fireStructures(b: Battle, side: Side) {
  for (const s of unitsOf(b, side).filter((x) => x.unit.isStructure)) {
    if (b.over) return;
    const es = opp(side);
    // Обстрел идёт по первому живому отряду в ближайшем ряду: на глубоком столе это не обязательно авангард.
    const t = firstAlive(b, es);
    if (t) { hurtUnit(b, t.unit, 1, s.unit); log(b, side, `«${s.unit.name}» обстреливает «${t.unit.name}»: −1.`); }
    else { hurtHero(b, es, 1); log(b, side, `«${s.unit.name}» обстреливает ${es === "me" ? "вас" : "вражеского вождя"}: −1.`); }
    settle(b);
  }
}

function tickStatuses(b: Battle, side: Side) {
  const p = b[side];
  for (const s of unitsOf(b, side)) {
    const u = s.unit;
    if (u.st.poison > 0) {
      hurtUnit(b, u, u.st.poison);
      log(b, side, `«${u.name}» получает ${u.st.poison} урона от яда.`);
      if (u.st.poisonTurns > 0 && --u.st.poisonTurns <= 0) { delete u.st.poison; delete u.st.poisonTurns; }
    }
    if (u.curHp <= 0) continue;
    if (u.st.burn > 0) {
      hurtUnit(b, u, u.st.burn);
      log(b, side, `«${u.name}» получает ${u.st.burn} урона от огня.`);
      // Перекидывание огня на соседей — отдельная "фитча" очага огня, не зависит от того, истекает ли срок.
      if (u.curHp > 0) [s.i - 1, s.i + 1].forEach((ni) => { const n = rowArray(p, s.ri)[ni]; if (n && !n.st.burn && Math.random() < 0.35) { n.st.burn = 1; n.st.burnTurns = 2; log(b, side, `Огонь перекинулся на «${n.name}».`); } });
      if (u.st.burnTurns > 0) { if (--u.st.burnTurns <= 0) { delete u.st.burn; delete u.st.burnTurns; } }
      else { u.st.burn--; if (u.st.burn <= 0) delete u.st.burn; }
    }
    if (u.curHp > 0 && !has(u, "unbreakable") && (u.fears || (has(u, "morale") && u.curHp / u.hp < 0.3))) {
      if (Math.random() < (u.fears ? 0.5 : 0.2)) {
        if (p.hand.length < HAND_LIMIT) { p.hand.push(cardOfUnit(u)); log(b, side, `«${u.name}» бежит с поля и возвращается в руку.`); }
        else log(b, side, `«${u.name}» бежит с поля — отряд разбежался.`);
        rowArray(p, s.ri)[s.i] = null;
      }
      u.fears = false;
    }
  }
  settle(b);
}

export function startTurn(b: Battle, side: Side) {
  // Ход только что закончился у противоположной стороны — здесь единственная надёжная точка стыка между
  // ходами обеих сторон (у врага нет отдельного "endTurn", он просто перестаёт действовать, см. enemyAct).
  const endedSide = opp(side);
  for (const s of unitsOf(b, endedSide)) if (s.unit.curHp > 0) runEffects(b, s.unit, "turn_end", endedSide, null);
  settle(b);
  if (b.over) return;
  const p = b[side];
  b.counters[side]++;
  for (const s of unitsOf(b, side)) s.unit.mods = s.unit.mods.filter((m) => m.expires > b.counters[side]);
  const blockedGrowth = Math.max(0, p.energyGrowthBlockedNext || 0);
  p.energyMax = Math.min(p.energyCap, p.energyMax + Math.max(0, p.energyGrowth - blockedGrowth));
  p.energyGrowthBlockedNext = 0;
  p.energy = p.energyMax;
  log(b, "system", `Ход ${b.turn}: ${side === "me" ? "ваш" : "вражеский"}. Энергия ${p.energy}.`);
  if (b.turn >= 12) {
    const d = b.turn - 10;
    hurtHero(b, side, d);
    log(b, side, `Затяжной бой изматывает ${side === "me" ? "вас" : "врага"}: −${d}.`);
    checkEnd(b);
    if (b.over) return;
  }
  tickStatuses(b, side);
  if (b.over) return;
  // лекари
  for (const s of unitsOf(b, side)) {
    const u = s.unit;
    if (!u.st.heal || u.isStructure) continue;
    const row = rowArray(p, s.ri);
    const cands = [row[s.i - 1], row[s.i + 1]].filter((n): n is Unit => !!n && !n.isStructure && n.curHp < n.hp);
    const target = cands.sort((x, y) => x.curHp / x.hp - y.curHp / y.hp)[0] || (u.curHp < u.hp ? u : null);
    if (target) { const before = target.curHp; target.curHp = Math.min(target.hp, target.curHp + u.st.heal); if (target.curHp > before) log(b, side, `«${u.name}» лечит «${target.name}»: +${target.curHp - before}.`); }
  }
  for (const s of unitsOf(b, side)) {
    const u = s.unit;
    u.exhausted = u.isStructure;
    // "fresh" сбрасывается только в момент собственной первой атаки юнита (см. attackWith),
    // а не здесь: раньше это поле гасло ещё до того, как юнит вообще получал право
    // действовать, из-за чего бонус "charge" и защита "holdground" не успевали сработать.
    u.hitThisTurn = false;
    u.usedRelentless = false;
    if (u.st.upkeep && !u.isStructure && neighborsOf(b, u).length === 0) { hurtUnit(b, u, 1); log(b, side, `«${u.name}» без поддержки соседей теряет 1 HP.`); }
  }
  settle(b);
  if (b.over) return;
  for (const s of unitsOf(b, side)) if (s.unit.curHp > 0 && posOf(b, s.unit)) runEffects(b, s.unit, "turn_start", side, null);
  settle(b);
  if (b.over) return;
  drawOne(b, side);
  checkEnd(b);
  if (b.over) return;
  fireStructures(b, side);
}

export function endPlayerTurn(b: Battle) {
  b.active = "enemy";
  // Раньше здесь гасился "fresh" у всех своих юнитов сразу в конце хода высадки — то есть
  // ещё до того, как они вообще могли атаковать или быть атакованными "свежими". Теперь
  // флаг живёт до первой собственной атаки юнита (см. attackWith), как и задумано.
}

export function beginPlayerTurn(b: Battle) {
  b.turn++;
  b.active = "me";
  startTurn(b, "me");
}

export function beginEnemyTurn(b: Battle) {
  startTurn(b, "enemy");
}

/* ---------- ИИ соперника: одно действие за вызов ---------- */

export function enemyAct(b: Battle): boolean {
  if (b.over || b.active !== "enemy") return false;
  const e = b.enemy;
  const freeSlot = (ri: number) => rowArray(e, ri).indexOf(null);
  /** Порядок рядов для карты: постройки в тыл, стрелки и «длинное оружие» — как можно глубже, ближний бой — в авангард. */
  const rowOrder = (c: Card): number[] => {
    const all = Array.from({ length: rowCount(e) }, (_, ri) => ri);
    const strikes = (c.keywords || []).some((k) => ["ranged", "skirmish", "reach"].includes(String(k).toLowerCase().trim().split(":")[0]));
    return c.card_type === "structure" || !strikes ? all.filter((ri) => canStandInRow(c, e, ri)) : [...all].reverse();
  };
  const playable = e.hand
    .map((c, i) => ({ c, i }))
    .filter(({ c }) => {
      if (c.drop_cost > e.energy) return false;
      if (c.card_type === "spell") return spellHasTarget(b, "enemy", c);
      return rowOrder(c).some((ri) => freeSlot(ri) >= 0);
    })
    .sort((x, y) => y.c.drop_cost - x.c.drop_cost);
  if (playable.length) {
    const { c, i } = playable[0];
    if (c.card_type === "spell") return cast(b, "enemy", i);
    const ri = rowOrder(c).find((r) => freeSlot(r) >= 0);
    if (ri === undefined) return false;
    return deploy(b, "enemy", i, ri, freeSlot(ri));
  }
  const att = unitsOf(b, "enemy").find((s) => canAct(b, "enemy", s.unit));
  if (att) return attackWith(b, "enemy", att.unit.iid);
  return false;
}
