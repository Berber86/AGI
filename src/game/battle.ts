import { buildMilitia, uid, type Card } from "./cards";

/* Тактический движок. Правила перенесены из Infinite Forge (кампанийный режим с единой энергией):
   два ряда по 4 слота, авангард и тыл, энергия платит за выход и за атаку, вождь с малым запасом HP. */

export type Side = "me" | "enemy";
export const FRONT = 4;
export const BACK = 4;
export const HAND_LIMIT = 7;
const START_HAND = 4;

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
  isStructure: boolean;
  order: number;
  hitSeq: number;
  lastDmg: number;
  rarity?: string;
  description: string;
}
export interface Hand extends Card { iid?: string }
export interface Player {
  hp: number; maxHp: number;
  deck: Hand[]; hand: Hand[]; discard: Hand[];
  fatigue: number;
  fatigueStart: number;
  front: (Unit | null)[]; back: (Unit | null)[];
  energy: number; energyMax: number; energyCap: number; energyGrowth: number; energyGrowthBlockedNext: number;
  hitSeq: number; lastDmg: number;
}
export interface LogEntry { id: number; side: Side | "system"; text: string }
export interface Match {
  kind: "practice" | "expedition";
  opponentId: string; name: string; clan: string; era: number; leaderBattle: boolean;
  regionId?: string; regionName?: string; questBattle?: boolean;
  /** Первый в жизни игрока бой: тренер подсказывает шаги, враг приходит без построек. */
  tutorial?: boolean;
}
export interface Battle {
  me: Player; enemy: Player;
  turn: number; active: Side;
  counters: { me: number; enemy: number };
  log: LogEntry[]; seq: number; order: number;
  over: null | "win" | "lose";
  match: Match;
  usedMilitia: number;
}

// fatigueDelay — сколько дополнительных кругов сторона выдерживает без усталости (эффект построек fatigue_resist)
export interface SideConfig { hp: number; energyMax: number; energyGrowth: number; fatigueDelay?: number }

const opp = (s: Side): Side => (s === "me" ? "enemy" : "me");

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

function newPlayer(deck: Card[], cfg: SideConfig): Player {
  return {
    hp: cfg.hp, maxHp: cfg.hp,
    deck: shuffle(deck.map((c) => ({ ...JSON.parse(JSON.stringify(c)), iid: uid() }))),
    hand: [], discard: [], fatigue: 0, fatigueStart: 6 + Math.max(0, Math.min(3, cfg.fatigueDelay || 0)),
    front: Array(FRONT).fill(null), back: Array(BACK).fill(null),
    energy: 1, energyMax: 1, energyCap: cfg.energyMax, energyGrowth: cfg.energyGrowth, energyGrowthBlockedNext: 0,
    hitSeq: 0, lastDmg: 0,
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

export function enemyDeckForEra(era: number, limit: number): Card[] {
  const all = buildMilitia();
  const ordered = era >= 1 ? [...all.filter((c) => c.era === "bronze"), ...all.filter((c) => c.era !== "bronze")] : all;
  return ordered.slice(0, limit).map((c) => ({ ...c, name: ENEMY_MILITIA_NAMES[c.name] ?? c.name }));
}

export function createBattle(myDeck: Card[], myCfg: SideConfig, enemyDeck: Card[], enemyCfg: SideConfig, match: Match, usedMilitia: number): Battle {
  const b: Battle = {
    me: newPlayer(myDeck, myCfg), enemy: newPlayer(enemyDeck, enemyCfg),
    turn: 1, active: "me", counters: { me: 1, enemy: 0 },
    log: [], seq: 0, order: 0, over: null, match, usedMilitia,
  };
  const n = Math.min(START_HAND, myDeck.length);
  for (let i = 0; i < n; i++) { drawOne(b, "me", true); }
  for (let i = 0; i < Math.min(START_HAND, enemyDeck.length); i++) { drawOne(b, "enemy", true); }
  log(b, "system", "Бой начался. Вы ходите первым — темп боя изначально на вашей стороне.");
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

export interface Slot { side: Side; row: "front" | "back"; i: number; unit: Unit }

export function unitsOf(b: Battle, side: Side): Slot[] {
  const out: Slot[] = [];
  (["front", "back"] as const).forEach((row) => b[side][row].forEach((u, i) => { if (u) out.push({ side, row, i, unit: u }); }));
  return out;
}

function posOf(b: Battle, u: Unit): Slot | null {
  for (const side of ["me", "enemy"] as Side[]) for (const row of ["front", "back"] as const) {
    const i = b[side][row].indexOf(u);
    if (i >= 0) return { side, row, i, unit: u };
  }
  return null;
}

const has = (u: Unit | null | undefined, k: string) => !!(u && u.st && u.st[k]);
const isRanged = (u: Unit) => has(u, "ranged");

function modTotal(b: Battle, u: Unit, stat: Mod["stat"]) {
  const p = posOf(b, u);
  const side: Side | null = p ? p.side : null;
  return u.mods.reduce((t, m) => (m.stat === stat && (!side || m.expires > b.counters[side]) ? t + m.amount : t), 0);
}

export function neighborsOf(b: Battle, u: Unit): Unit[] {
  const p = posOf(b, u);
  if (!p) return [];
  const row = b[p.side][p.row];
  return [row[p.i - 1], row[p.i + 1]].filter(Boolean) as Unit[];
}

export function atkOf(b: Battle, u: Unit): number {
  let a = u.atk;
  if (has(u, "phalanx")) a += 1;
  const nb = neighborsOf(b, u);
  if (has(u, "wedge")) a += Math.min(2, nb.length);
  a += nb.filter((n) => has(n, "rally")).length;
  a += modTotal(b, u, "attack");
  return Math.max(0, Math.min(99, a));
}
export const armorOf = (b: Battle, u: Unit) => Math.max(0, (u.st.armor || 0) + modTotal(b, u, "armor"));
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
    exhausted: true, fresh: true, hitThisTurn: false, fears: false,
    isStructure: card.card_type === "structure", order: b.order++, hitSeq: 0, lastDmg: 0,
    rarity: card.rarity, description: card.description || "",
  };
  for (const raw of u.keywords) {
    const [kw, ns] = String(raw).toLowerCase().trim().split(":");
    const n = Math.max(1, parseInt(ns) || 1);
    if (["armor", "pierce", "poison", "burn", "heal"].includes(kw)) u.st[kw] = Math.max(u.st[kw] || 0, n);
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
function hurtUnit(u: Unit, amount: number) {
  u.curHp -= amount; u.hitSeq++; u.lastDmg = amount;
}

function drawOne(b: Battle, side: Side, silent = false): boolean {
  const p = b[side];
  if (p.deck.length === 0 && p.discard.length > 0) {
    p.deck = shuffle(p.discard);
    p.discard = [];
    if (!silent) log(b, side, `${say(side, 'перетасовывает', 'перетасовываете')} сброс в колоду.`);
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

export type AttackTarget = { kind: "hero"; side: Side } | { kind: "unit"; side: Side; row: "front" | "back"; i: number; unit: Unit };

export function findTarget(b: Battle, attacker: Unit, side: Side): AttackTarget | null {
  const p = posOf(b, attacker);
  if (!p) return null;
  const es = opp(side);
  const E = b[es];
  const isFront = p.row === "front";
  if (isFront) {
    for (let i = 0; i < FRONT; i++) { const u = E.front[i]; if (u && has(u, "taunt")) return { kind: "unit", side: es, row: "front", i, unit: u }; }
    if (E.front[p.i]) return { kind: "unit", side: es, row: "front", i: p.i, unit: E.front[p.i]! };
    for (let off = 1; off < FRONT; off++) for (const dir of [-1, 1]) {
      const idx = p.i + dir * off;
      if (idx >= 0 && idx < FRONT && E.front[idx]) return { kind: "unit", side: es, row: "front", i: idx, unit: E.front[idx]! };
    }
    return { kind: "hero", side: es };
  }
  if (isRanged(attacker)) {
    for (let i = 0; i < FRONT; i++) if (E.front[i]) return { kind: "unit", side: es, row: "front", i, unit: E.front[i]! };
    return { kind: "hero", side: es };
  }
  if (has(attacker, "reach") && E.front[p.i]) return { kind: "unit", side: es, row: "front", i: p.i, unit: E.front[p.i]! };
  return null;
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
  if (has(attacker, "fear") && Math.random() < 0.25 && !(has(target, "holdground") && target.fresh)) target.fears = true;
  dmg = Math.max(1, Math.floor(dmg));
  hurtUnit(target, dmg);

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
  if (target.kind === "hero") {
    const d = Math.max(1, atkOf(b, attacker));
    hurtHero(b, target.side, d);
    log(b, side, `${attacker.name} бьёт ${target.side === "me" ? "вашего вождя" : "вражеского вождя"}: −${d}.`);
  } else {
    const t = target.unit;
    const d = resolveHit(b, attacker, t, atkOf(b, attacker), side);
    let counter = 0;
    if (!isRanged(attacker) && t.curHp > 0 && !t.isStructure) {
      const cb = atkOf(b, t);
      if (cb > 0) counter = resolveHit(b, t, attacker, cb, opp(side));
    }
    log(b, side, `${attacker.name} атакует «${t.name}»: −${d}${counter ? ` / ответ −${counter}` : ""}.`);
    if (has(attacker, "poison")) t.st.poison = (t.st.poison || 0) + 1;
    if (has(attacker, "burn")) t.st.burn = (t.st.burn || 0) + 1;
    if (has(attacker, "skirmish") && p.row === "front" && attacker.curHp > 0) {
      const free = b[side].back.indexOf(null);
      if (free >= 0) { b[side].front[p.i] = null; b[side].back[free] = attacker; log(b, side, `${attacker.name} отступает в тыл.`); }
    }
  }
  attacker.fresh = false;
  attacker.exhausted = true;
  adjustEnergy(b, side, -costOf(b, attacker));
  if (attacker.curHp > 0 && posOf(b, attacker)) runEffects(b, attacker, "attack", side, target.kind === "hero" ? { kind: "player", side: target.side } : { kind: "unit", side: target.side, unit: target.unit });
  settle(b);
  return true;
}

/* ---------- высадка и манёвры ---------- */

export function canPlay(b: Battle, side: Side, card: Card): boolean {
  return !b.over && b.active === side && card.drop_cost <= b[side].energy;
}

export function deploy(b: Battle, side: Side, handIdx: number, row: "front" | "back", slot: number): boolean {
  const p = b[side];
  const card = p.hand[handIdx];
  if (!card || card.card_type === "spell" || !canPlay(b, side, card)) return false;
  if (card.card_type === "structure" && row === "front") return false;
  if (p[row][slot]) return false;
  p.energy -= card.drop_cost;
  p.hand.splice(handIdx, 1);
  const u = makeUnit(b, card);
  p[row][slot] = u;
  log(b, side, `${say(side, 'выводит', 'выводите')} «${u.name}».`);
  applyEnergyKeywordsOnPlay(b, side, u);
  runEffects(b, u, "enter_play", side, null);
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
type Tgt = { kind: "player"; side: Side } | { kind: "unit"; side: Side; unit: Unit; row?: "front" | "back"; i?: number };

function resolveTargets(b: Battle, e: any, ctx: Ctx, all = false): Tgt[] {
  const spec = e.target;
  const owner = ctx.owner;
  const sideSel: Side | null = spec.side === "controller" || spec.side === "friendly" ? owner : spec.side === "opponent" || spec.side === "enemy" ? opp(owner) : null;
  let select = spec.select || "first";
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
    if (spec.zone === "front" && s.row !== "front") return false;
    if (spec.zone === "rear" && s.row !== "back") return false;
    return true;
  });
  if (spec.relation === "self") cands = cands.filter((s) => s.unit === ctx.source);
  if (spec.relation === "adjacent") {
    const pos = ctx.source && posOf(b, ctx.source);
    cands = pos ? cands.filter((s) => s.side === pos.side && s.row === pos.row && Math.abs(s.i - pos.i) === 1) : [];
  }
  if (select === "lowest_hp") cands.sort((x, y) => x.unit.curHp - y.unit.curHp || x.i - y.i);
  else if (select === "lowest_hp_ratio") cands.sort((x, y) => x.unit.curHp / x.unit.hp - y.unit.curHp / y.unit.hp || x.i - y.i);
  else if (select === "highest_attack") cands.sort((x, y) => atkOf(b, y.unit) - atkOf(b, x.unit) || x.i - y.i);
  const out: Tgt[] = cands.map((s) => ({ kind: "unit", side: s.side, unit: s.unit, row: s.row, i: s.i }));
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

function execEffect(b: Battle, e: any, t: Tgt, ctx: Ctx) {
  const a = e.action;
  const src = ctx.name || "Эффект";
  const who = ctx.owner;
  const tname = t.kind === "player" ? (t.side === "me" ? "вашего вождя" : "вражеского вождя") : `«${t.unit.name}»`;
  switch (a.type) {
    case "damage":
      if (t.kind === "player") hurtHero(b, t.side, a.amount); else hurtUnit(t.unit, a.amount);
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
      const arr = b[d.side][d.row];
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

function fireStructures(b: Battle, side: Side) {
  for (const s of unitsOf(b, side).filter((x) => x.unit.isStructure)) {
    if (b.over) return;
    const es = opp(side);
    const front = b[es].front.find((u) => u && u.curHp > 0);
    if (front) { hurtUnit(front, 1); log(b, side, `«${s.unit.name}» обстреливает «${front.name}»: −1.`); }
    else { hurtHero(b, es, 1); log(b, side, `«${s.unit.name}» обстреливает ${es === "me" ? "вас" : "вражеского вождя"}: −1.`); }
    settle(b);
  }
}

function tickStatuses(b: Battle, side: Side) {
  const p = b[side];
  for (const s of unitsOf(b, side)) {
    const u = s.unit;
    if (u.st.poison > 0) {
      hurtUnit(u, u.st.poison);
      log(b, side, `«${u.name}» получает ${u.st.poison} урона от яда.`);
      if (u.st.poisonTurns > 0 && --u.st.poisonTurns <= 0) { delete u.st.poison; delete u.st.poisonTurns; }
    }
    if (u.curHp <= 0) continue;
    if (u.st.burn > 0) {
      hurtUnit(u, u.st.burn);
      log(b, side, `«${u.name}» получает ${u.st.burn} урона от огня.`);
      if (u.st.burnTurns > 0) { if (--u.st.burnTurns <= 0) { delete u.st.burn; delete u.st.burnTurns; } }
      else {
        if (u.curHp > 0) [s.i - 1, s.i + 1].forEach((ni) => { const n = p[s.row][ni]; if (n && !n.st.burn && Math.random() < 0.35) { n.st.burn = 1; log(b, side, `Огонь перекинулся на «${n.name}».`); } });
        u.st.burn--; if (u.st.burn <= 0) delete u.st.burn;
      }
    }
    if (u.curHp > 0 && (u.fears || (has(u, "morale") && u.curHp / u.hp < 0.3))) {
      if (Math.random() < (u.fears ? 0.5 : 0.2)) {
        if (p.hand.length < HAND_LIMIT) { p.hand.push(cardOfUnit(u)); log(b, side, `«${u.name}» бежит с поля и возвращается в руку.`); }
        else log(b, side, `«${u.name}» бежит с поля — отряд разбежался.`);
        p[s.row][s.i] = null;
      }
      u.fears = false;
    }
  }
  settle(b);
}

export function startTurn(b: Battle, side: Side) {
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
    const row = p[s.row];
    const cands = [row[s.i - 1], row[s.i + 1]].filter((n): n is Unit => !!n && !n.isStructure && n.curHp < n.hp);
    const target = cands.sort((x, y) => x.curHp / x.hp - y.curHp / y.hp)[0] || (u.curHp < u.hp ? u : null);
    if (target) { const before = target.curHp; target.curHp = Math.min(target.hp, target.curHp + u.st.heal); if (target.curHp > before) log(b, side, `«${u.name}» лечит «${target.name}»: +${target.curHp - before}.`); }
  }
  for (const s of unitsOf(b, side)) {
    const u = s.unit;
    u.exhausted = u.isStructure;
    u.fresh = false;
    u.hitThisTurn = false;
    if (u.st.upkeep && !u.isStructure && neighborsOf(b, u).length === 0) { hurtUnit(u, 1); log(b, side, `«${u.name}» без поддержки соседей теряет 1 HP.`); }
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
  for (const s of unitsOf(b, "me")) s.unit.fresh = false;
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
  const freeSlot = (row: "front" | "back") => e[row].indexOf(null);
  const playable = e.hand
    .map((c, i) => ({ c, i }))
    .filter(({ c }) => {
      if (c.drop_cost > e.energy) return false;
      if (c.card_type === "spell") return spellHasTarget(b, "enemy", c);
      if (c.card_type === "structure") return freeSlot("back") >= 0;
      return freeSlot("front") >= 0 || freeSlot("back") >= 0;
    })
    .sort((x, y) => y.c.drop_cost - x.c.drop_cost);
  if (playable.length) {
    const { c, i } = playable[0];
    if (c.card_type === "spell") return cast(b, "enemy", i);
    let row: "front" | "back";
    if (c.card_type === "structure") row = "back";
    else if ((c.keywords || []).some((k) => k.startsWith("ranged") || k.startsWith("reach")) && freeSlot("back") >= 0) row = "back";
    else row = freeSlot("front") >= 0 ? "front" : "back";
    return deploy(b, "enemy", i, row, freeSlot(row));
  }
  const att = unitsOf(b, "enemy").find((s) => canAct(b, "enemy", s.unit));
  if (att) return attackWith(b, "enemy", att.unit.iid);
  return false;
}
