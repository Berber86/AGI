import { buildMilitia, uid, type Card } from "./cards";

/* Тактический движок. Правила перенесены из Infinite Forge (кампанийный режим с единой энергией):
   авангард и тыл, энергия платит за выход и за атаку, вождь с малым запасом HP.
   Стол не фиксирован: он растёт вместе с эпохами — от одной линии в три клетки в Каменном веке
   до пяти рядов по пять в Будущем (см. BOARD_SHAPES). */

export type Side = "me" | "enemy";
export const HAND_LIMIT = 7;
const START_HAND = 1;
const MAX_OPENING_HAND = 2;

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
  /** Отряд уже перестраивался в этот ход: второе перемещение за ход запрещено (см. moveUnit). */
  movedThisTurn: boolean;
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
// openingHand — 1 обычно, 2 при соответствующей черте народа; противник всегда начинает с 1.
export interface SideConfig { hp: number; energyMax: number; energyGrowth: number; fatigueDelay?: number; atkBonus?: number; openingHand?: number }

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

// вражеское ополчение говорит своими именами: «Копейщики атакует „Копейщики“» в журнале нечитаемо
const ENEMY_MILITIA_NAMES: Record<string, string> = {
  "Копейщики": "Налётчики с копьями",
  "Дубинщики": "Дубинщики разбойников",
  "Топорники": "Топоры мародёров",
  "Щитоносцы": "Щитоносцы разбойников",
  "Всадники": "Всадники-загонщики",
  "Загонщики": "Облавщики",
  "Дружина вождя": "Стража атамана",
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

/** Сохраняет паритет колод: соперник получает ровно столько карт, сколько выбрал игрок. */
export function mirrorDeckToPlayer(playerDeck: Card[], opponentPool: Card[]): Card[] {
  return fillDeck(opponentPool, playerDeck.length);
}

export function createBattle(myDeck: Card[], myCfg: SideConfig, enemyDeck: Card[], enemyCfg: SideConfig, match: Match): Battle {
  const shape = boardShape(match.threatEra ?? match.era);
  const b: Battle = {
    me: newPlayer(myDeck, myCfg, shape), enemy: newPlayer(enemyDeck, enemyCfg, shape), shape,
    turn: 1, active: "me", counters: { me: 1, enemy: 0 },
    log: [], seq: 0, order: 0, over: null, match,
  };
  const requested = Number.isFinite(myCfg.openingHand) ? Math.trunc(myCfg.openingHand as number) : START_HAND;
  const openingHand = Math.max(START_HAND, Math.min(MAX_OPENING_HAND, requested));
  // Первый ход игрока раньше начинался с одной энергии, тогда как враг получал свой первый прирост
  // в beginEnemyTurn. Теперь обе стороны входят в бой одинаково: прирост энергии за ход применяется
  // к тому, кто ходит первым, ещё до выдачи руки. Иначе учебный бой и первые ходы кампании были
  // проиграны в тот момент, когда игрок выкладывал 1 энергию против 2 у врага.
  b.me.energyMax = Math.min(b.me.energyCap, b.me.energyMax + b.me.energyGrowth);
  b.me.energy = b.me.energyMax;
  for (let i = 0; i < Math.min(openingHand, myDeck.length); i++) { drawOne(b, "me", true); }
  for (let i = 0; i < Math.min(START_HAND, enemyDeck.length); i++) { drawOne(b, "enemy", true); }
  log(b, "system", `Бой начался: у вас ${Math.min(openingHand, myDeck.length)} карт в руке, у соперника ${Math.min(START_HAND, enemyDeck.length)}. Вы ходите первым — темп боя изначально на вашей стороне.`);
  log(b, "system", `Стол эпохи: ${shape.rows === 1 ? "одна линия" : `${shape.rows} ряда(ов)`} по ${shape.slots} клетки — ${boardLabel(shape)}.`);
  return b;
}

/* ---------- утилиты ---------- */

export function log(b: Battle, side: LogEntry["side"], text: string) {
  b.log.push({ id: ++b.seq, side, text });
  if (b.log.length > 150) b.log.shift();
}

const nm = (s: Side) => (s === "me" ? "Вы" : "Враг");
/** Статусы по-русски: для журнала и для подписей в интерфейсе. */
export const STATUS_TXT: Record<string, string> = { poison: "яд", burn: "поджог", suppress: "подавление" };
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
/** Крайний столбец половины: на столе в один столбец флангом считается и он сам. */
export const isFlank = (p: Player, i: number): boolean => i <= 0 || i >= slotCount(p) - 1;
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
 * напротив, затем ближайшего в линии, при пустой линии — вождя) и получают ответный удар: обмен
 * одновременный, защитник отвечает даже тогда, когда этот удар его убивает.
 * Тот же список в cards.ts (ONE_LINE_KEYWORDS) использует кузнец: пока стол не вырос до второго
 * ряда, он не куёт стрелков. Тест сверяет оба списка, чтобы они не разъехались.
 */
export const DEPTH_KEYWORDS = ["ranged", "skirmish", "reach", "screen"];
/**
 * Слова обеспечения боя: прикрытие, штаб и корректировщик работают из глубины своего столбца,
 * поэтому стоять могут в любом ряду — иначе до тыла, где от них есть толк, они бы просто не доехали.
 * В отличие от DEPTH_KEYWORDS они не молчат на столе в одну линию: штаб снабжает и с единственной
 * линии (она же и тыл), а корректировщик наводит площадный удар.
 */
export const SUPPORT_KEYWORDS = ["screen", "command", "spotter"];
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
  // На однорядном столе бонусы атаки и ключевые слова не должны превращать каменные отряды
  // в высокоуронные машины: потолок атаки — 3 даже при фаланге, клине, натиске и бонусе вождя.
  return Math.max(0, Math.min(b.shape.rows === 1 ? 3 : 99, a));
}
export function armorOf(b: Battle, u: Unit): number {
  let ar = (u.st.armor || 0) + modTotal(b, u, "armor");
  const p = posOf(b, u);
  if (has(u, "laststand") && p && unitsOf(b, p.side).filter((s) => s.ri === p.ri).length === 1) ar += 1;
  // Прикрытие: отряд этажом ниже в том же столбце добавляет брони тому, кто стоит перед ним.
  // На столе в одну линию ряда ниже нет — значит, и прикрывать некого (см. DEPTH_KEYWORDS).
  if (p) {
    const behind = rowArray(b[p.side], p.ri + 1)[p.i];
    if (behind && behind.curHp > 0 && has(behind, "screen")) ar += 1;
  }
  return Math.max(0, ar);
}
/** Цена атаки: своя стоимость, модификаторы и подавление — оно делает удар дороже, а не запрещает его. */
export const costOf = (b: Battle, u: Unit) =>
  Math.max(0, u.action_cost + modTotal(b, u, "action_cost") + Math.min(SUPPRESS_MAX, u.st.suppress || 0));

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

/**
 * Слова-источники статусов хранятся отдельно от самого статуса: `poison:1` на карте означает
 * «этот отряд отравляет при попадании», а `st.poison` — «этот отряд отравлён». Раньше оба жили в
 * одном поле, из-за чего отравитель получал урон от собственного яда каждый ход и навсегда, а срок
 * статуса при этом стирал и само слово. Теперь источник — `poisons`/`burns`/`suppresses`.
 */
const STATUS_SOURCE: Record<string, string> = { poison: "poisons", burn: "burns", suppress: "suppresses" };
/** Потолок подавления: удорожание атаки не должно делать отряд бесплатной мишенью навсегда. */
export const SUPPRESS_MAX = 3;

function makeUnit(b: Battle, card: Card): Unit {
  const atk = Math.max(0, Math.floor(card.atk) || 0);
  const hp = Math.max(1, Math.floor(card.hp) || 1);
  const u: Unit = {
    iid: uid(), card, name: card.name || "Безымянный", emoji: card.emoji || "⚒️", card_type: card.card_type, era: card.era || "ancient",
    atk, hp, curHp: hp, drop_cost: card.drop_cost || 0, action_cost: card.action_cost || 0,
    keywords: card.keywords || [], effects: card.effects || [], st: {}, mods: [],
    exhausted: true, fresh: true, hitThisTurn: false, movedThisTurn: false, fears: false, usedRelentless: false,
    isStructure: card.card_type === "structure", order: b.order++, hitSeq: 0, lastDmg: 0,
    rarity: card.rarity, description: card.description || "",
  };
  for (const raw of u.keywords) {
    const [kw, ns] = String(raw).toLowerCase().trim().split(":");
    const n = Math.max(1, parseInt(ns) || 1);
    if (STATUS_SOURCE[kw]) u.st[STATUS_SOURCE[kw]] = Math.max(u.st[STATUS_SOURCE[kw]] || 0, n);
    else if (["armor", "pierce", "heal", "cleave", "vengeance", "blast", "sweep", "column"].includes(kw)) u.st[kw] = Math.max(u.st[kw] || 0, n);
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

/* ---------- столбцы: брешь в обороне ----------
   Терминология стола: РЯД — глубина (авангард, средние ряды, тыл), СТОЛБЕЦ — ширина (фланги и
   центр), КЛЕТКА — слот на пересечении. Ряды защищают от ближнего боя, а столбцы определяют, куда
   удар приходит: столбец, в котором у стороны не осталось живых отрядов, — это брешь. */

/** Есть ли в столбце стороны живой отряд. Постройки строй не держат: их разбирает осада. */
function laneHolds(b: Battle, side: Side, i: number): boolean {
  for (let ri = 0; ri < rowCount(b[side]); ri++) {
    const u = rowArray(b[side], ri)[i];
    if (u && u.curHp > 0 && !u.isStructure) return true;
  }
  return false;
}

/** Брешь ли в этом столбце: правило общее для обеих сторон и для всех эпох. */
export const hasGapAt = (b: Battle, side: Side, i: number): boolean => i >= 0 && i < slotCount(b[side]) && !laneHolds(b, side, i);

/** Все столбцы стороны с брешами — для подсветки в интерфейсе и для выбора слота противником. */
export function gapsOf(b: Battle, side: Side): number[] {
  const out: number[] = [];
  for (let i = 0; i < slotCount(b[side]); i++) if (!laneHolds(b, side, i)) out.push(i);
  return out;
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
  // Осада проверяется раньше бреши: постройка строй не держит, но для осадного орудия она и есть
  // цель — иначе таран шагал бы мимо частокола вождю. Прикрытая живым отрядом того же столбца
  // постройка недоступна: сначала надо пройти тех, кто стоит ближе (общее правило рядов).
  if (has(attacker, "siege") && !laneHolds(b, es, p.i)) {
    const structure = nearestBehind(b, es, 0, p.i, true);
    if (structure) return structure;
  }
  // БРЕШЬ — правило по умолчанию, а не особое ключевое слово: если в столбце атакующего у врага не
  // осталось живых отрядов, удар проходит вождю, даже когда вражеский строй стоит в других столбцах.
  // Держать надо всю линию, а не центр. Провокация перехватывает удар и здесь — она проверена выше.
  if (!laneHolds(b, es, p.i)) return { kind: "hero", side: es };
  if (front[p.i]) return targetAt(b, es, 0, p.i, front[p.i]!);
  // Охват: если зеркальный слот пуст, а столбец держит отряд в глубине, такой боец идёт вверх по
  // своей полосе, а не вбок по чужому ряду — фланговый удар остаётся фланговым.
  if (has(attacker, "flank")) {
    const lane = nearestBehind(b, es, 1, p.i, false);
    if (lane) return lane;
  }
  const beside = nearestInRow(b, es, 0, p.i, false);
  if (beside) return beside;
  // Авангард врага пуст — ближний бой идёт вглубь, ряд за рядом (осадное орудие свои постройки
  // уже проверило выше). Ближайший отряд в глубине важнее вождя: брешь в столбце — не повод
  // проходить мимо чужого строя.
  const deep = nearestBehind(b, es, 1, p.i, false);
  if (deep) return deep;
  return { kind: "hero", side: es };
}

/* ---------- перестроение: манёвр по клеткам своей половины за энергию ----------
   Отряд можно сдвинуть на одну соседнюю клетку (вбок по своему ряду или на ряд вперёд/назад, без
   диагоналей) за MOVE_COST энергии, один раз за ход. Правила рядов действуют и здесь: ближний бой
   без стрельбы не уходит вглубь, постройки не двигаются вовсе. Манёвр не истощает отряд — можно
   перестроиться и ударить в тот же ход, если хватает энергии: так находятся бреши во вражеской
   линии и закрываются свои. */
export const MOVE_COST = 1;
export interface MoveTarget { ri: number; i: number }

export function moveTargets(b: Battle, side: Side, u: Unit): MoveTarget[] {
  if (b.over || b.active !== side || u.isStructure || u.curHp <= 0 || u.movedThisTurn) return [];
  if (b[side].energy < MOVE_COST) return [];
  const p = posOf(b, u);
  if (!p) return [];
  const out: MoveTarget[] = [];
  for (const [ri, i] of [[p.ri, p.i - 1], [p.ri, p.i + 1], [p.ri - 1, p.i], [p.ri + 1, p.i]] as [number, number][]) {
    if (ri < 0 || ri >= rowCount(b[side]) || i < 0 || i >= slotCount(b[side])) continue;
    if (rowArray(b[side], ri)[i]) continue;
    if (!canStandInRow(u, b[side], ri)) continue;
    out.push({ ri, i });
  }
  return out;
}

export function moveUnit(b: Battle, side: Side, iid: string, ri: number, i: number): boolean {
  if (b.over || b.active !== side) return false;
  const u = unitsOf(b, side).find((s) => s.unit.iid === iid)?.unit;
  if (!u) return false;
  const from = posOf(b, u);
  if (!from) return false;
  if (!moveTargets(b, side, u).some((t) => t.ri === ri && t.i === i)) return false;
  rowArray(b[side], from.ri)[from.i] = null;
  rowArray(b[side], ri)[i] = u;
  u.movedThisTurn = true;
  b[side].energy = Math.max(0, b[side].energy - MOVE_COST);
  log(b, side, `«${u.name}» перестраивается: ${rowName(b[side], from.ri)}, столбец ${from.i + 1} → ${rowName(b[side], ri)}, столбец ${i + 1}. −${MOVE_COST} энергии.`);
  settle(b);
  return true;
}

export function canAct(b: Battle, side: Side, u: Unit): boolean {
  return !b.over && b.active === side && !u.exhausted && !u.isStructure && costOf(b, u) <= b[side].energy;
}

/* ---------- удар ---------- */

/** Чистый расчёт урона удара. AI вызывает его для прогноза размена без изменения стола. */
function calculateHitDamage(
  b: Battle, attacker: Unit, target: Unit, base: number, attackerSide: Side, markSturdy = true,
): number {
  let dmg = base;
  if (attacker.era === "bronze" && target.era === "ancient") dmg += 1;
  if (attacker.era === "ancient" && target.era === "bronze") dmg = Math.max(1, dmg - 1);
  const armor = Math.max(0, armorOf(b, target) - (attacker.st.pierce || 0));
  dmg = Math.max(1, dmg - armor);
  if (has(attacker, "charge") && attacker.fresh && !(has(target, "holdground") && target.fresh)) dmg += 2;
  // Охват: цель с открытым флангом (крайний столбец или дыра в строю) получает на 1 больше.
  if (has(attacker, "flank") && flankExposed(b, target)) dmg += 1;
  // Корректировщик наводит дальний бой по целям своего столбца.
  if (strikesFromRear(b, attacker)) {
    const tp = posOf(b, target);
    if (tp) dmg += spotterBonus(b, attackerSide, tp.i, attacker);
  }
  if (has(target, "shieldwall") && neighborsOf(b, target).length >= 1) dmg = Math.max(1, dmg - 1);
  if (has(target, "sturdy") && !target.hitThisTurn) {
    dmg = Math.max(1, dmg - 1);
    if (markSturdy) target.hitThisTurn = true;
  }
  if (target.isStructure && has(attacker, "siege")) dmg *= 2;
  const damage = Math.max(1, Math.floor(dmg));
  return b.shape.rows === 1 ? Math.min(3, damage) : damage;
}

function resolveHit(b: Battle, attacker: Unit, target: Unit, base: number, attackerSide: Side): number {
  const wasAlive = target.curHp > 0;
  const dmg = calculateHitDamage(b, attacker, target, base, attackerSide);
  if (has(attacker, "fear") && Math.random() < 0.25 && !(has(target, "holdground") && target.fresh) && !has(target, "unbreakable")) target.fears = true;
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

/* ---------- столбцы как поддержка: охват, прикрытие, штаб, корректировщик ----------
   Ряд защищает от удара, столбец задаёт направление — а эти четыре слова делают столбец ещё и
   этажом обеспечения боя: тыл прикрывает передних, штаб снабжает, корректировщик наводит, а охват
   наказывает за открытый фланг и идёт вверх по своей полосе. Все четыре работают по столбцу, а не
   по соседям в ряду, поэтому на столе в одну линию «Прикрытие» молчит (прикрывать некого). */

/** Отряд с открытым флангом: живого соседа нет хотя бы с одной стороны (край стола или дыра в строю). */
export function flankExposed(b: Battle, u: Unit): boolean {
  const p = posOf(b, u);
  if (!p) return false;
  const row = rowArray(b[p.side], p.ri);
  const holds = (x: Unit | null | undefined) => !!x && x.curHp > 0;
  const left = p.i - 1 < 0 ? null : row[p.i - 1];
  const right = p.i + 1 >= slotCount(b[p.side]) ? null : row[p.i + 1];
  return !holds(left) || !holds(right);
}

/** Сколько энергии добавляют штабы стороны: живые отряды с command в последнем ряду. */
export function commandBonus(b: Battle, side: Side): number {
  const p = b[side];
  return unitsOf(b, side).filter((s) => s.unit.curHp > 0 && has(s.unit, "command") && isBackRow(p, s.ri)).length;
}

/** Корректировщик в столбце i: +1 к урону дальнего и площадного удара по целям этого столбца. */
export function spotterBonus(b: Battle, side: Side, i: number, attacker: Unit | null): number {
  return unitsOf(b, side).some((s) => s.i === i && s.unit.curHp > 0 && s.unit !== attacker && has(s.unit, "spotter")) ? 1 : 0;
}

/* ---------- площадный удар: три формы площади ----------
   Ряд защищает от ближнего боя, но не от площади; столбец задаёт направление удара. Площадь —
   ответ на плотный строй, и у неё ровно три формы, по осям стола: крест («Фугас» — соседи цели в
   её ряду и отряд прямо за целью), линия («Картечь» — весь ряд цели), полоса («Обстрел столбца» —
   весь столбец цели во всех рядах). Все три считаются от основной цели: её выбирает обычное
   правило выбора цели, включая провокацию, поэтому перехватить площадь taunt'ом нельзя — можно
   только принять её на себя.

   Ограничения баланса зашиты здесь, а не в советах кузнецу: дополнительных целей не больше
   AREA_MAX_EXTRA, урон по ним — N (основная цель получает полный урон атаки), ответных ударов
   площадь не вызывает, а «рассредоточение» и «окоп» её гасят. Тяжёлый удар (N ≥ AREA_HEAVY_N)
   задевает и собственный отряд, стоящий напротив в той же полосе огня: линия огня проходит через
   весь столбец, а не только по чужой половине. По вождю площадь не работает — у удара нет точки
   на поле, считать форму не от чего (прорыв в столбце и так даёт полный урон вождю). */
export const AREA_KEYWORDS = ["blast", "sweep", "column"] as const;
export type AreaShape = (typeof AREA_KEYWORDS)[number];
export const AREA_NAMES: Record<AreaShape, string> = { blast: "Фугас", sweep: "Картечь", column: "Обстрел столбца" };
/** Больший N — это не «ещё сильнее», а «ещё дороже карта»: потолок один для всех форм. */
export const AREA_MAX_N = 2;
/** Сколько дополнительных целей накрывает один удар (основная цель в этот счёт не входит). */
export const AREA_MAX_EXTRA = 3;
/** С какого N удар считается тяжёлым и задевает своих в той же полосе. */
export const AREA_HEAVY_N = 2;

/** Площадное слово отряда: кузнец обязан давать карте не больше одного (см. validateCard). */
export function areaOf(u: Unit): { shape: AreaShape; n: number } | null {
  for (const shape of AREA_KEYWORDS) {
    const n = u.st[shape];
    if (typeof n === "number" && n > 0) return { shape, n: Math.min(AREA_MAX_N, Math.floor(n)) };
  }
  return null;
}

export interface SplashHit { side: Side; ri: number; i: number; unit: Unit; own: boolean }

/** «Окоп» в авангарде гасит картечь и обстрел столбца, но не разрыв рядом и не прямой удар. */
const entrenchedSaves = (u: Unit, ri: number, shape: AreaShape): boolean =>
  has(u, "entrenched") && ri === 0 && shape !== "blast";

/**
 * Клетки, которые накрывает удар, кроме основной цели. Урон считает applySplash: здесь только
 * геометрия, чтобы её можно было показать в интерфейсе и проверить в тестах.
 */
export function splashTargets(b: Battle, side: Side, attacker: Unit, target: AttackTarget): SplashHit[] {
  const area = areaOf(attacker);
  // На линии Каменного века даже старые сохранённые карты не получают площадной/метательный бой;
  // рукопашный удар остаётся прямым. Геометрия и ответная полоса действуют со второго ряда.
  if (!area || b.shape.rows === 1 || target.kind !== "unit") return [];
  const es = target.side;
  const dp = b[es];
  const found: (SplashHit & { dist: number })[] = [];
  const seen = new Set<Unit>([target.unit]);
  const push = (ri: number, i: number) => {
    if (ri < 0 || ri >= rowCount(dp) || i < 0 || i >= slotCount(dp)) return;
    const u = rowArray(dp, ri)[i];
    if (!u || u.curHp <= 0 || seen.has(u)) return;
    if (entrenchedSaves(u, ri, area.shape)) return;
    seen.add(u);
    found.push({ side: es, ri, i, unit: u, own: false, dist: Math.abs(ri - target.ri) + Math.abs(i - target.i) });
  };
  if (area.shape === "blast") {
    push(target.ri, target.i - 1);
    push(target.ri, target.i + 1);
    push(target.ri + 1, target.i);
  } else if (area.shape === "sweep") {
    for (let i = 0; i < slotCount(dp); i++) if (i !== target.i) push(target.ri, i);
  } else {
    for (let ri = 0; ri < rowCount(dp); ri++) if (ri !== target.ri) push(ri, target.i);
  }
  found.sort((x, y) => x.dist - y.dist || x.ri - y.ri || x.i - y.i);
  const out: SplashHit[] = found.slice(0, AREA_MAX_EXTRA).map(({ dist, ...hit }) => hit);
  // Тяжёлая площадь задевает своих: отряд напротив, в той же полосе огня. Стреляющих не накрывает —
  // они и есть источник удара, — а «окоп» спасает и здесь.
  if (area.n >= AREA_HEAVY_N) {
    const mine = rowArray(b[side], 0)[target.i];
    if (mine && mine.curHp > 0 && mine !== attacker && !entrenchedSaves(mine, 0, area.shape)) {
      out.push({ side, ri: 0, i: target.i, unit: mine, own: true });
    }
  }
  return out;
}

/** Урон по площади: броня и «рассредоточение» гасят его, а бонусы атакующего (рывок, трофеи, страх) — нет. */
function areaDamage(b: Battle, attacker: Unit, side: Side, u: Unit, base: number, markSturdy = true): number {
  let dmg = base;
  if (attacker.era === "bronze" && u.era === "ancient") dmg += 1;
  if (attacker.era === "ancient" && u.era === "bronze") dmg = Math.max(1, dmg - 1);
  const up = posOf(b, u);
  if (up) dmg += spotterBonus(b, side, up.i, attacker);
  dmg = Math.max(1, dmg - Math.max(0, armorOf(b, u) - (attacker.st.pierce || 0)));
  if (has(u, "dispersed")) dmg = Math.max(1, dmg - 1);
  if (has(u, "shieldwall") && neighborsOf(b, u).length >= 1) dmg = Math.max(1, dmg - 1);
  if (has(u, "sturdy") && !u.hitThisTurn) {
    dmg = Math.max(1, dmg - 1);
    if (markSturdy) u.hitThisTurn = true;
  }
  if (u.isStructure && has(attacker, "siege")) dmg *= 2;
  return Math.max(1, Math.floor(dmg));
}

/** Накрывает площадь вокруг основной цели и пишет это в журнал — по строке на каждую клетку. */
function applySplash(b: Battle, side: Side, attacker: Unit, target: AttackTarget): void {
  const area = areaOf(attacker);
  if (!area) return;
  for (const h of splashTargets(b, side, attacker, target)) {
    const dmg = areaDamage(b, attacker, side, h.unit, h.own ? 1 : area.n);
    hurtUnit(b, h.unit, dmg, attacker);
    log(b, side, h.own
      ? `${AREA_NAMES[area.shape]} задевает свой отряд в той же полосе: «${h.unit.name}» −${dmg}.`
      : `${AREA_NAMES[area.shape]} накрывает «${h.unit.name}»: −${dmg}.`);
  }
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
    // Обмен ударами одновременный: защитник отвечает, даже если этот удар его убивает. Силу ответа
    // считаем до урона — иначе бонусы умирающего отряда (клин, последний рубеж, заряд, стена щитов)
    // пересчитались бы по искалеченному составу и ответ зависел от порядка строк в журнале.
    // Отвечает только живой отряд и только рукопашному удару: постройка не дерётся, а стрелка
    // в глубине стола достать нечем. Уклонившаяся засада не бьёт и не получает удара вовсе.
    const counterBase = !isRanged(b, attacker) && t.curHp > 0 && !t.isStructure ? atkOf(b, t) : 0;
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
      // Ответ приходит и по мёртвому телу: урон обмена наносится одновременно.
      const counter = counterBase > 0 ? resolveHit(b, t, attacker, counterBase, opp(side)) : 0;
      // Выстрел через живой авангард — это отдельная ситуация: иначе непонятно, почему стрелок
      // из тыла бьёт не тех, кто стоит напротив.
      const overFront = isRanged(b, attacker) && target.ri > 0 && !!rowArray(b[defenderSide], 0).find((u) => u && u.curHp > 0);
      log(b, side, `${attacker.name} ${overFront ? "стреляет через строй по" : "атакует"} «${t.name}»: −${d}${counter ? ` / ответ −${counter}` : ""}.`);
      // Площадь — после основного удара: читатель журнала сначала видит, кто кого ударил, а потом
      // кого ещё накрыло. Ответных ударов она не вызывает (как и «рассечение»).
      applySplash(b, side, attacker, target);
      // Месть: погибший в этом обмене отряд наносит сверх своего ответа ещё один удар убийце, если тот жив.
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
      if (has(attacker, "poisons")) { t.st.poison = (t.st.poison || 0) + 1; t.st.poisonTurns = 2; }
      if (has(attacker, "burns")) { t.st.burn = (t.st.burn || 0) + 1; t.st.burnTurns = 2; }
      // Подавление: не запрет, а удорожание атаки. «Несокрушимый» его не чувствует, постройке оно
      // бессмысленно — постройки не атакуют.
      if (has(attacker, "suppresses") && !t.isStructure && !has(t, "unbreakable")) {
        const amount = Math.min(SUPPRESS_MAX, attacker.st.suppresses || 1);
        const was = t.st.suppress || 0;
        t.st.suppress = Math.max(was, amount);
        t.st.suppressTurns = 2;
        log(b, side, `«${t.name}» подавлен огнём «${attacker.name}»: атака дороже на ${t.st.suppress}${was ? " (снова)" : ""}.`);
      }
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
  // Цель удара отдаётся эффектам целиком (с рядом и столбцом): от них зависит геометрия —
  // relation attack_target_row / attack_target_column выбирают клетки по осям цели.
  if (hitLanded && attacker.curHp > 0 && posOf(b, attacker)) runEffects(b, attacker, "attack", side, target.kind === "hero" ? { kind: "player", side: target.side } : target);
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
 *  • дальнобойные (ranged, skirmish) и reach — в любом ряду: они бьют поверх строя;
 *  • слова обеспечения (screen, command, spotter) — тоже в любом ряду: их место как раз в глубине.
 */
export function canStandInRow(card: { card_type: string; keywords?: string[] }, p: Player, ri: number): boolean {
  if (card.card_type === "structure") return isBackRow(p, ri);
  if (isFrontRow(p, ri) || rowCount(p) === 1) return true;
  return standsDeep(card);
}

/** Кому место в глубине: стрельба поверх строя и слова обеспечения своего столбца. */
function standsDeep(card: { keywords?: string[] }): boolean {
  return (card.keywords || []).some((raw) => {
    const kw = String(raw).toLowerCase().trim().split(":")[0];
    return kw === "ranged" || kw === "skirmish" || kw === "reach" || SUPPORT_KEYWORDS.includes(kw);
  });
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
    // Фланг — крайние столбцы своей половины, центр — всё между ними: ширина стола стала осмысленной
    // (см. брешь и площадные слова), поэтому у эффектов появился и такой выбор цели.
    if (spec.zone === "flank" && !isFlank(b[s.side], s.i)) return false;
    if (spec.zone === "center" && isFlank(b[s.side], s.i)) return false;
    return true;
  });
  if (spec.relation === "self") cands = cands.filter((s) => s.unit === ctx.source);
  // Ряд и столбец цели удара: те же оси, что и у площадных слов, — только выбирает их эффект карты.
  if (spec.relation === "attack_target_row" || spec.relation === "attack_target_column") {
    const t = ctx.eventTarget;
    cands = t && t.kind === "unit"
      ? cands.filter((s) => s.side === t.side && (spec.relation === "attack_target_row" ? s.ri === t.ri : s.i === t.i))
      : [];
  }
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
      if (t.kind === "unit" && !(a.status === "suppress" && has(t.unit, "unbreakable"))) {
        const amount = a.status === "suppress" ? Math.min(SUPPRESS_MAX, a.amount) : a.amount;
        t.unit.st[a.status] = Math.max(t.unit.st[a.status] || 0, amount);
        t.unit.st[a.status + "Turns"] = a.turns ?? 2;
        log(b, who, `${src}: ${STATUS_TXT[a.status] || a.status} ${amount} — ${tname}.`);
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
    const shooter = s.unit;
    // Стреляет только постройка с атакой: частокол или обоз — стена и склад, а не орудие, и раньше
    // они бесплатно снимали по 1 HP каждый ход в обход брони. Урон идёт через resolveHit, поэтому
    // броня, пробой и эпоха работают как в обычном бою. Ответа на обстрел нет: до тыла не достать.
    const base = atkOf(b, shooter);
    if (base <= 0) continue;
    const es = opp(side);
    // Обстрел идёт по первому живому отряду в ближайшем ряду: на глубоком столе это не обязательно авангард.
    const t = firstAlive(b, es);
    if (t) {
      const d = resolveHit(b, shooter, t.unit, base, side);
      log(b, side, `«${shooter.name}» обстреливает «${t.unit.name}»: −${d}.`);
    } else {
      const d = Math.max(1, base);
      hurtHero(b, es, d);
      log(b, side, `«${shooter.name}» обстреливает ${es === "me" ? "вас" : "вражеского вождя"}: −${d}.`);
    }
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
    // Подавление не наносит урона: оно истекает само и возвращает отряду прежнюю цену атаки.
    if (u.st.suppress > 0 && u.st.suppressTurns > 0 && --u.st.suppressTurns <= 0) {
      delete u.st.suppress;
      delete u.st.suppressTurns;
      log(b, side, `«${u.name}» приходит в себя: подавление снято.`);
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
  // Штаб в тылу: +1 энергии сверх текущего предела за каждый живой отряд с command в последнем ряду.
  // Предел не растёт навсегда — снабжение идёт, пока штаб жив и стоит в тылу (общий потолок energyCap).
  const staff = commandBonus(b, side);
  p.energy = Math.min(p.energyCap, p.energyMax + staff);
  log(b, "system", `Ход ${b.turn}: ${side === "me" ? "ваш" : "вражеский"}. Энергия ${p.energy}.`);
  if (staff) {
    for (const s of unitsOf(b, side)) {
      if (s.unit.curHp > 0 && has(s.unit, "command") && isBackRow(p, s.ri)) log(b, side, `«${s.unit.name}» держит штаб в тылу: +1 энергии сверх предела.`);
    }
  }
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
    u.movedThisTurn = false;
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

/* ---------- ИИ соперника: оценка размена перед ударом ---------- */

/** Условная ценность отряда: стоимость высадки, текущая угроза и ключевые роли. */
function aiUnitValue(b: Battle, u: Unit): number {
  let value = 1.25 + Math.max(0, u.drop_cost) * 0.55 + Math.max(0, atkOf(b, u)) * 0.32 + Math.max(1, u.hp) * 0.12;
  if (has(u, "taunt")) value += 0.35;
  if (has(u, "ranged") || has(u, "skirmish")) value += 0.3;
  if (has(u, "heal") || has(u, "command") || has(u, "screen")) value += 0.25;
  if (has(u, "vengeance") || has(u, "relentless")) value += 0.2;
  return value;
}

function aiUnitLoss(b: Battle, u: Unit, damage: number): number {
  const dealt = Math.min(Math.max(0, u.curHp), Math.max(0, damage));
  if (dealt === 0) return 0;
  const value = aiUnitValue(b, u);
  const loss = value * dealt / Math.max(1, u.hp);
  // Убийство ещё и освобождает слот и снимает угрозу со стола.
  return loss + (dealt >= u.curHp ? value * 0.15 : 0);
}

/**
 * Оценивает обмен так же, как его разыграет движок: удар, ответ до смерти защитника, броня,
 * натиск, фланг, затем рассечение/площадь без ответов и месть. Прогноз чистый: он не крутит RNG,
 * не тратит энергию и не меняет состояние боя. Случайный страх и произвольные эффекты карт —
 * отдельные тактические модификаторы, в однопроходную оценку размена они не входят.
 */
function enemyAttackScore(b: Battle, side: Side, attacker: Unit, target: AttackTarget): number {
  if (target.kind === "hero") {
    const damage = Math.max(1, atkOf(b, attacker));
    const lethal = damage >= b[target.side].hp ? 1000 : 0;
    return damage * 1.35 + lethal - costOf(b, attacker) * 0.04;
  }

  const defenderSide = target.side;
  const defender = target.unit;
  const ranged = isRanged(b, attacker);
  const defenderBack = rowArray(b[defenderSide], rowCount(b[defenderSide]) - 1);
  const dodges = !ranged && has(defender, "skirmish") && target.ri === 0
    && rowCount(b[defenderSide]) > 1 && defenderBack.indexOf(null) >= 0;
  if (dodges) return Number.NEGATIVE_INFINITY;

  const projected = new Map<Unit, { side: Side; damage: number }>();
  const addDamage = (unit: Unit, hitSide: Side, amount: number) => {
    const prior = projected.get(unit);
    projected.set(unit, { side: hitSide, damage: (prior?.damage || 0) + Math.max(0, amount) });
  };

  const mainDamage = calculateHitDamage(b, attacker, defender, atkOf(b, attacker), side, false);
  addDamage(defender, defenderSide, mainDamage);

  // Рассечение и площадь не получают ответа. Учитываем и своих, если тяжёлая площадь заденет строй.
  if (has(attacker, "cleave")) {
    for (const neighbor of neighborsOf(b, defender)) {
      if (neighbor.curHp > 0) addDamage(neighbor, defenderSide,
        calculateHitDamage(b, attacker, neighbor, attacker.st.cleave, side, false));
    }
  }
  const area = areaOf(attacker);
  if (area) {
    for (const hit of splashTargets(b, side, attacker, target)) {
      addDamage(hit.unit, hit.side, areaDamage(b, attacker, side, hit.unit, hit.own ? 1 : area.n, false));
    }
  }

  let counterDamage = 0;
  if (!ranged && defender.curHp > 0 && !defender.isStructure) {
    const counterBase = atkOf(b, defender);
    if (counterBase > 0) {
      counterDamage = calculateHitDamage(b, defender, attacker, counterBase, defenderSide, false);
      addDamage(attacker, side, counterDamage);
    }
  }

  const targetAfterHit = Math.max(0, defender.curHp - mainDamage);
  const attackerAfterExchange = Math.max(0, attacker.curHp - (projected.get(attacker)?.damage || 0));
  // Месть срабатывает после площади: погибшая цель наказывает только выжившего убийцу;
  // павший от ответного удара атакующий мстит только оставшейся в живых цели.
  if (targetAfterHit <= 0 && has(defender, "vengeance") && attackerAfterExchange > 0) {
    addDamage(attacker, side, defender.st.vengeance);
  }
  if (counterDamage > 0 && attackerAfterExchange <= 0 && has(attacker, "vengeance") && targetAfterHit > 0) {
    addDamage(defender, defenderSide, attacker.st.vengeance);
  }

  let score = 0;
  for (const [unit, hit] of projected) {
    const loss = aiUnitLoss(b, unit, hit.damage);
    score += hit.side === side ? -loss : loss;
  }
  if (has(attacker, "raider") && defenderSide !== side && !defender.isStructure && b[defenderSide].energy > 0) score += 0.2;
  if (has(attacker, "loot") && targetAfterHit <= 0 && !defender.isStructure) score += 0.2;
  return score - costOf(b, attacker) * 0.04;
}

/* ---------- ИИ соперника: одно действие за вызов ---------- */

export function enemyAct(b: Battle): boolean {
  if (b.over || b.active !== "enemy") return false;
  const e = b.enemy;
  /**
   * Слот для высадки: сначала закрываем брешь — столбец, где у игрока стоит живой отряд, а у нас
   * никого нет. Иначе игрок бьёт в этот столбец и проходит вождю (правило бреши в findTarget).
   */
  const freeSlot = (ri: number) => {
    const row = rowArray(e, ri);
    const free: number[] = [];
    for (let i = 0; i < row.length; i++) if (!row[i]) free.push(i);
    if (!free.length) return -1;
    const theirs = new Set(unitsOf(b, "me").filter((s) => s.unit.curHp > 0).map((s) => s.i));
    const gap = free.find((i) => theirs.has(i) && !laneHolds(b, "enemy", i));
    return gap === undefined ? free[0] : gap;
  };
  /**
   * Порядок рядов для карты: постройки в тыл, ближний бой — в авангард, а стрелки, «длинное оружие»
   * и слова обеспечения — как можно глубже: штаб снабжает только из последнего ряда, прикрытие
   * прикрывает того, кто впереди, а корректировщик из тыла наводит огонь по своему столбцу.
   */
  const rowOrder = (c: Card): number[] => {
    const all = Array.from({ length: rowCount(e) }, (_, ri) => ri);
    return c.card_type === "structure" || !standsDeep(c) ? all.filter((ri) => canStandInRow(c, e, ri)) : [...all].reverse();
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
  // Не бросаем первый попавшийся отряд в заведомо плохой размен. Сравниваем все доступные
  // атаки, учитывая, кто погибнет от ответа, и выбираем лучший обмен; отрицательный размен можно
  // отложить — защитник всё равно ответит, когда игрок нападёт первым.
  const attacks = unitsOf(b, "enemy")
    .filter((s) => canAct(b, "enemy", s.unit))
    .map((s) => ({ ...s, target: findTarget(b, s.unit, "enemy") }))
    .filter((s): s is Slot & { target: AttackTarget } => !!s.target)
    .map((s) => ({ ...s, score: enemyAttackScore(b, "enemy", s.unit, s.target) }))
    .sort((a, z) => z.score - a.score || costOf(b, a.unit) - costOf(b, z.unit) || a.unit.order - z.unit.order);
  const best = attacks[0];
  if (best && best.score > 0.05) return attackWith(b, "enemy", best.unit.iid);
  return false;
}
