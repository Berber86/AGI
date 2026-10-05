import { M } from "./model";

export type CardType = "unit" | "spell" | "structure";
export type Rarity = "ordinary" | "uncommon" | "rare";

/**
 * Историческая справка карты: к какой реалии эпохи она отсылает и почему бьётся именно так.
 * Пишется ИИ-кузнецом в тот же вызов, что и сама карта, — по эпохе кампании и наследию народа,
 * поэтому «древний мир» и «античность» (как и Ренессанс с Будущим) звучат по-разному даже у
 * одинаковых по цифрам карт. Если модель справку не вернула — поля у карты нет и аккордеон
 * не рисуется: локальных заготовок намеренно не делаем, иначе текст снова станет одинаковым.
 */
export interface CardHistory {
  /** Реальный прототип: находка, место, обычай или звание эпохи. */
  title: string;
  /** 2–4 предложения: технологии эпохи, быт и связь с цифрами и ключевыми словами карты. */
  text: string;
  /** Эпоха кампании, под которую написана справка. */
  era: string;
  /** Наследие народа, под которое написана справка. */
  culture: string;
}

export interface Card {
  id: string;
  name: string;
  card_type: CardType;
  era: "ancient" | "bronze";
  emoji: string;
  drop_cost: number;
  action_cost: number;
  hp: number;
  atk: number;
  description: string;
  tags?: string[];
  abilities?: string[];
  keywords: string[];
  effects: any[];
  monkey_paw?: string;
  rarity?: Rarity;
  /** Историческая справка (аккордеон на карте); заполняется только из ответа модели. */
  history?: CardHistory;
  campaignStarter?: boolean;
  militia?: boolean;
  generationModel?: string;
}

export interface Advice {
  id: string;
  cardType: CardType;
  title: string;
  pitch: string;
  hint?: string;
}

export const CARD_TYPE_INFO: Record<CardType, { label: string; plural: string; blurb: string }> = {
  unit: { label: "Отряд", plural: "Отряды", blurb: "Выходит на поле и атакует" },
  spell: { label: "Манёвр", plural: "Манёвры", blurb: "Разовое действие, тратит энергию" },
  structure: { label: "Постройка", plural: "Постройки", blurb: "Стоит в тылу и работает каждый ход" },
};

export const RARITY_INFO: Record<Rarity, { label: string; color: string; ring: string }> = {
  ordinary: { label: "Обычная", color: "text-dim", ring: "border-line-strong" },
  uncommon: { label: "Необычная", color: "text-food", ring: "border-food/50" },
  rare: { label: "Редкая", color: "text-bronze", ring: "border-bronze/70" },
};

export const KEYWORD_INFO: Record<string, { name: string; desc: string }> = {
  armor: { name: "Броня", desc: "Снижает входящий урон на N (не меньше 1)." },
  pierce: { name: "Пробитие", desc: "Игнорирует N брони цели." },
  ranged: { name: "Дальний бой", desc: "Бьёт через вражеский авангард по самому опасному отряду на поле (провокация перехватывает выстрел) и не получает ответный удар." },
  reach: { name: "Длинное оружие", desc: "Из тыла достаёт врага напротив." },
  charge: { name: "Натиск", desc: "+2 к первой атаке после высадки." },
  shieldwall: { name: "Стена щитов", desc: "+1 брони; при соседях урон ниже ещё на 1." },
  wedge: { name: "Клин", desc: "+1 к атаке за каждого соседа (до +2)." },
  phalanx: { name: "Фаланга", desc: "+1 к атаке и +1 брони." },
  skirmish: { name: "Засадный", desc: "После своей атаки уходит в тыл и дальше бьёт как дальний бой — по любой цели. Если его атакуют в ближнем бою, уклоняется в тыл до обмена ударами." },
  taunt: { name: "Провокация", desc: "Враг обязан атаковать этот отряд первым." },
  poison: { name: "Яд", desc: "Отравляет цель при атаке: N урона в начале её хода." },
  burn: { name: "Поджог", desc: "Поджигает цель при атаке; огонь может перекинуться." },
  heal: { name: "Лекарь", desc: "В начале хода лечит раненого соседа на N." },
  rally: { name: "Поддержка", desc: "Соседи получают +1 к атаке." },
  fear: { name: "Устрашение", desc: "Шанс обратить цель в бегство при ударе." },
  morale: { name: "Мораль", desc: "Ниже 30% здоровья может бежать с поля." },
  siege: { name: "Осада", desc: "Двойной урон по постройкам; когда авангард врага пуст, достаёт его постройки в тылу." },
  sturdy: { name: "Стойкий", desc: "Первый удар за ход наносит на 1 меньше урона." },
  holdground: { name: "Удержание", desc: "В первый ход не боится страха и натиска." },
  upkeep: { name: "Содержание", desc: "Без соседей в ряду теряет 1 HP за ход." },
  supply: { name: "Снабжение", desc: "При розыгрыше повышает доступный предел энергии на 1 и даёт 1 энергию." },
  warcry: { name: "Боевой клич", desc: "При розыгрыше даёт 1 энергию в общий запас, не выше текущего предела." },
  loot: { name: "Трофеи", desc: "За убийство отряда даёт 1 энергию в общий запас." },
  raider: { name: "Налётчик", desc: "При попадании по отряду крадёт 1 энергию у противника и передаёт её вам." },
  harras: { name: "Набег", desc: "На следующий ход противника уменьшает прирост общей энергии на 1." },
  exhaustenemy: { name: "Изнурение", desc: "При розыгрыше отнимает 1 текущую энергию у противника." },
  cleave: { name: "Рассечение", desc: "При атаке дополнительно наносит N урона всем соседям цели в её ряду." },
  vengeance: { name: "Месть", desc: "При гибели в бою наносит N урона своему убийце, если тот ещё жив." },
  relentless: { name: "Неутомимый", desc: "Может атаковать дважды за ход, если хватает энергии на обе атаки." },
  scavenger: { name: "Мародёр", desc: "+1 к атаке за каждые 2 карты во вражеском сбросе (максимум +2)." },
  unbreakable: { name: "Несокрушимый", desc: "Полный иммунитет к бегству от страха и морали." },
  laststand: { name: "Последний рубеж", desc: "Если это единственный живой отряд в своём ряду — +1 к атаке и +1 брони." },
};

const SUPPORTED_KEYWORDS = new Set(Object.keys(KEYWORD_INFO));

export function kwName(raw: string) {
  const [k, n] = raw.split(":");
  const info = KEYWORD_INFO[k];
  return { key: k, level: n ? Number(n) : null, name: info?.name ?? k, desc: info?.desc ?? "" };
}

export const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);

/* ---------- Эффекты: описание для игрока ---------- */

const SIDE_TXT: Record<string, string> = {
  friendly: "своего",
  controller: "своего",
  enemy: "вражеского",
  opponent: "вражеского",
  either: "любого",
};

export function describeEffect(e: any): string {
  const ev: Record<string, string> = {
    enter_play: "При выходе",
    attack: "После атаки",
    turn_start: "В начале хода",
    turn_end: "В конце хода",
    damaged: "При получении урона",
    death: "При гибели",
    card_death: `Когда гибнет ${e.watch?.side === "friendly" ? "свой" : e.watch?.side === "enemy" ? "вражеский" : "любой"} отряд`,
    card_enter_play: `Когда выходит ${e.watch?.side === "friendly" ? "своя" : e.watch?.side === "enemy" ? "вражеская" : "любая"} карта`,
  };
  const a = e.action;
  const t = e.target || {};
  const entityNoun =
    t.select === "all" ? (t.entity === "structure" ? "все постройки" : "все отряды") :
    t.select === "random" ? (t.entity === "structure" ? "случайную постройку" : "случайный отряд") :
    `${t.count > 1 ? t.count + " " : ""}${t.entity === "structure" ? "постройку" : "отряд"}`;
  const who = t.entity === "player" ? `${SIDE_TXT[t.side] ?? ""} вождя`.trim() : `${SIDE_TXT[t.side] ?? ""} ${entityNoun}`.trim();
  const rel = t.relation === "self" ? "себя" : t.relation === "adjacent" ? "соседей" : t.relation === "attack_target" ? "цель удара" : null;
  const target = rel ?? who;
  let act = "";
  switch (a.type) {
    case "damage": act = `${a.amount} урона: ${target}`; break;
    case "heal": act = `лечит ${target} на ${a.amount}`; break;
    case "apply_status": act = `${a.status === "poison" ? "яд" : "поджог"} ${a.amount} на ${a.turns ?? 2} хода: ${target}`; break;
    case "destroy": act = `уничтожает: ${target}`; break;
    case "modify_resource": act = `${a.amount > 0 ? "+" : ""}${a.amount} энергии ${t.side === "enemy" || t.side === "opponent" ? "врагу" : "вам"}`; break;
    case "modify_stat": act = `${a.amount > 0 ? "+" : ""}${a.amount} ${a.stat === "attack" ? "атаки" : a.stat === "armor" ? "брони" : "здоровья"}: ${target}${a.turns ? ` на ${a.turns} хода` : ""}`; break;
    case "modify_cost": act = `стоимость атаки ${a.amount > 0 ? "+" : ""}${a.amount}: ${target}`; break;
    case "draw": act = `${t.side === "enemy" || t.side === "opponent" ? "враг берёт" : "берёте"} ${a.amount} карт`; break;
    case "discard": act = `${t.side === "enemy" || t.side === "opponent" ? "враг сбрасывает" : "сбросьте"} ${a.amount} карт`; break;
    case "exchange": act = `обмен ${a.amount} карт`; break;
    case "scry": act = `просмотр ${a.amount} карт колоды`; break;
    default: act = a.type;
  }
  return `${ev[e.event] ?? e.event}: ${act}`;
}

/* ---------- Ополчение — запасные карты, если колода не заполнена ---------- */

function mk(p: Partial<Card> & { name: string; card_type: CardType }): Card {
  return {
    id: "militia-" + p.name,
    era: "ancient",
    emoji: "⚔️",
    drop_cost: 1,
    action_cost: 0,
    hp: 1,
    atk: 0,
    description: "",
    keywords: [],
    effects: [],
    tags: [],
    abilities: [],
    ...p,
  } as Card;
}

export function buildMilitia(): Card[] {
  return [
    mk({ name: "Племенные копейщики", card_type: "unit", emoji: "🔺", drop_cost: 2, action_cost: 1, atk: 2, hp: 2, description: "Ополчение с копьями держит строй.", keywords: ["phalanx"] }),
    mk({ name: "Пращники из холмов", card_type: "unit", emoji: "🪨", drop_cost: 1, action_cost: 1, atk: 1, hp: 1, description: "Бросают камни из-за спин пехоты.", keywords: ["ranged", "skirmish"] }),
    mk({ name: "Охотники с луками", card_type: "unit", emoji: "🏹", drop_cost: 2, action_cost: 1, atk: 2, hp: 1, description: "Лучники бьют издалека, избегая боя.", keywords: ["ranged"] }),
    mk({ name: "Топорники племени", card_type: "unit", emoji: "🪓", drop_cost: 2, action_cost: 1, atk: 3, hp: 3, description: "Каменные топоры и кожаные щиты.", keywords: ["wedge", "armor:1"] }),
    mk({ name: "Разведчики на лошадях", card_type: "unit", emoji: "🐎", drop_cost: 3, action_cost: 1, atk: 3, hp: 2, description: "Лёгкая конница, стремительный натиск.", keywords: ["charge", "skirmish"] }),
    mk({ name: "Дружина вождя", card_type: "unit", emoji: "🛡️", drop_cost: 3, action_cost: 2, atk: 3, hp: 5, description: "Элитные воины прикрывают вождя стеной щитов.", keywords: ["shieldwall", "taunt", "morale"] }),
    mk({ name: "Частокол", card_type: "structure", emoji: "🧱", drop_cost: 2, atk: 0, hp: 5, description: "Деревянное заграждение преграждает проход." }),
    mk({
      name: "Ночной набег", card_type: "spell", emoji: "🌙", drop_cost: 2, description: "Поджигает вражеский авангард.",
      effects: [{ event: "enter_play", target: { side: "enemy", entity: "unit", zone: "front", select: "highest_attack", count: 1 }, action: { type: "apply_status", status: "burn", amount: 1, turns: 2 } }],
    }),
    mk({ name: "Бронзовые наёмники", card_type: "unit", era: "bronze", emoji: "⚔️", drop_cost: 3, action_cost: 2, atk: 3, hp: 4, description: "Бронзовые мечи пробивают щиты.", keywords: ["pierce:1"] }),
    mk({ name: "Военный лагерь", card_type: "structure", emoji: "⛺", drop_cost: 3, atk: 0, hp: 4, description: "Лагерь поднимает дух соседей.", keywords: ["rally"] }),
  ];
}

/** Учебный бой: враг приходит без построек, чтобы новичка не били бесплатно из тыла. */
export function withoutStructures(pool: Card[]): Card[] {
  return pool.filter((c) => c.card_type !== "structure");
}

/* ---------- Карты игрока: стартовые + коллекция ---------- */

export function allCards(collection: Card[]): Card[] {
  return [...(M.STARTER_CARDS as Card[]), ...collection];
}

/* ---------- Валидация карты (для ответа LLM) ---------- */

const EVENTS = ["enter_play", "attack", "turn_start", "turn_end", "death", "card_death", "card_enter_play", "damaged"];
const ACTIONS = ["damage", "heal", "apply_status", "destroy", "modify_resource", "modify_stat", "modify_cost", "draw", "discard", "exchange", "scry"];
const CMP = ["eq", "ne", "lt", "lte", "gt", "gte"];

function int(v: any, min: number, max: number, name: string) {
  if (!Number.isInteger(v) || v < min || v > max) throw new Error(`Параметр ${name} должен быть целым числом от ${min} до ${max}.`);
  return v as number;
}

function validateCondition(node: any, depth = 0): any {
  if (!node || typeof node !== "object" || depth > 3) throw new Error("Некорректное условие эффекта.");
  if (node.all || node.any) {
    const list = node.all || node.any;
    if (!Array.isArray(list) || !list.length || list.length > 4) throw new Error("Условие all/any: 1–4 элемента.");
    return node.all ? { all: list.map((c: any) => validateCondition(c, depth + 1)) } : { any: list.map((c: any) => validateCondition(c, depth + 1)) };
  }
  if (node.not) return { not: validateCondition(node.not, depth + 1) };
  if (node.type === "target_wounded") return { type: "target_wounded" };
  if (node.type === "target_status") { if (!["poison", "burn"].includes(node.status)) throw new Error("Неизвестный статус в условии."); return { type: "target_status", status: node.status }; }
  if (node.type === "target_stat") { if (!["hp", "attack", "armor"].includes(node.stat) || !CMP.includes(node.op)) throw new Error("Некорректное условие target_stat."); return { type: "target_stat", stat: node.stat, op: node.op, value: int(node.value, 0, 99, "value") }; }
  if (node.type === "resource") { if (!["controller", "opponent"].includes(node.side) || !["energy", "drop", "action"].includes(node.resource) || !CMP.includes(node.op)) throw new Error("Некорректное условие resource."); return { type: "resource", side: node.side, resource: "energy", op: node.op, value: int(node.value, 0, 99, "value") }; }
  if (node.type === "board_count") { if (!["controller", "opponent"].includes(node.side) || !CMP.includes(node.op)) throw new Error("Некорректное условие board_count."); return { type: "board_count", side: node.side, op: node.op, value: int(node.value, 0, 8, "value") }; }
  throw new Error("Неизвестный тип условия.");
}

export function validateEffects(raw: any): any[] {
  if (!Array.isArray(raw)) throw new Error("Поле effects должно быть массивом.");
  if (raw.length > 6) throw new Error("Не более 6 эффектов на карте.");
  return raw.map((e, idx) => {
    const fail = (m: string): never => { throw new Error(`Эффект ${idx + 1}: ${m}`); };
    if (!e || typeof e !== "object" || Array.isArray(e)) fail("ожидался объект.");
    if (!EVENTS.includes(e.event)) fail("неизвестное событие.");
    let watch: any = undefined;
    if (e.event === "card_death" || e.event === "card_enter_play") {
      if (!e.watch || !["all", "friendly", "enemy"].includes(e.watch.side)) fail("нужен watch.side.");
      watch = { side: e.watch.side };
    }
    const a = e.action;
    if (!a || !ACTIONS.includes(a.type)) fail("неизвестное действие.");
    const action: any = { type: a.type };
    if (["damage", "heal", "apply_status"].includes(a.type)) action.amount = int(a.amount, 1, a.type === "damage" ? 12 : a.type === "apply_status" ? 5 : 8, "amount");
    if (a.type === "apply_status") {
      if (!["poison", "burn"].includes(a.status)) fail("только poison или burn.");
      action.status = a.status;
      action.turns = a.turns === undefined ? 2 : int(a.turns, 1, 3, "turns");
    }
    if (a.type === "modify_resource") {
      if (!["energy", "drop", "action"].includes(a.resource)) fail("resource: energy (drop/action — совместимые старые значения).");
      action.resource = "energy"; action.amount = int(a.amount, -5, 5, "amount"); if (!action.amount) fail("amount не может быть 0.");
    }
    if (a.type === "modify_stat") {
      if (!["attack", "armor", "max_hp"].includes(a.stat)) fail("stat: attack, armor или max_hp.");
      action.stat = a.stat; action.amount = int(a.amount, -3, 3, "amount"); if (!action.amount) fail("amount не может быть 0.");
      if (a.turns !== undefined) { if (a.stat === "max_hp") fail("max_hp не может быть временным."); action.turns = int(a.turns, 1, 3, "turns"); }
    }
    if (a.type === "modify_cost") {
      action.cost = "action"; action.amount = int(a.amount, -3, 3, "amount"); if (!action.amount) fail("amount не может быть 0.");
      if (a.turns !== undefined) action.turns = int(a.turns, 1, 3, "turns");
    }
    if (["draw", "discard", "exchange", "scry"].includes(a.type)) {
      action.amount = int(a.amount, 1, 5, "amount");
      if (["discard", "exchange"].includes(a.type)) action.choice = ["choose", "highest_cost", "lowest_cost"].includes(a.choice) ? a.choice : "choose";
    }
    let t = e.target;
    if (!t && a.type === "modify_resource") t = { side: "controller", entity: "player" };
    if (!t || typeof t !== "object") fail("нужно задать target.");
    if (!["friendly", "enemy", "controller", "opponent", "either"].includes(t.side)) fail("target.side неизвестен.");
    if (!["unit", "structure", "permanent", "player"].includes(t.entity)) fail("target.entity неизвестен.");
    const target: any = { side: t.side, entity: t.entity };
    if (t.zone !== undefined) { if (!["front", "rear", "any"].includes(t.zone)) fail("zone неизвестна."); target.zone = t.zone; }
    if (t.relation !== undefined) { if (!["any", "self", "adjacent", "attack_target"].includes(t.relation)) fail("relation неизвестен."); target.relation = t.relation; }
    if (t.select !== undefined) { if (!["first", "lowest_hp", "lowest_hp_ratio", "highest_attack", "attack_target", "choose", "all", "random"].includes(t.select)) fail("select неизвестен."); target.select = t.select; }
    if ((target.select === "attack_target" || target.relation === "attack_target") && e.event !== "attack") fail("attack_target только для события attack.");
    if (target.relation === "adjacent" && target.entity === "player") fail("adjacent неприменим к игроку.");
    if (e.event === "death" && target.relation === "self") fail("погибший источник не может быть целью.");
    target.count = t.count === undefined ? 1 : int(t.count, 1, 3, "count");
    if (["apply_status"].includes(a.type) && target.entity !== "unit") fail("статус только на отряд.");
    if (["modify_stat", "modify_cost", "destroy"].includes(a.type) && target.entity === "player") fail("действие требует цель на поле.");
    if (["modify_resource", "draw", "discard", "exchange", "scry"].includes(a.type) && target.entity !== "player") fail("действие требует цель player.");
    const out: any = { event: e.event, target, action };
    if (watch) out.watch = watch;
    if (e.condition !== undefined) out.condition = validateCondition(e.condition);
    return out;
  });
}

// Бюджет силы карты от ИИ-Кузнеца. Раньше drop_cost/action_cost/hp/atk проверялись только независимо друг от
// друга (int() проверяет лишь диапазон 0-99 для каждого поля отдельно) — ничто не мешало модели вернуть,
// например, atk:99 и hp:99 при drop_cost:0, пройдя валидацию без единой ошибки. Системный промпт просит модель
// соблюдать баланс сама, но это не гарантия: один "сорвавшийся" ответ создаёт карту вне всякого баланса.
// Теперь суммарная сила (атака + здоровье + грубый вес ключевых слов) ограничена бюджетом от заявленной
// стоимости розыгрыша/действия и редкости заказа; излишек урезается пропорционально, а не просто принимается
// (баланс-ревизия).
const RARITY_BUDGET_MULT: Record<string, number> = { ordinary: 1, uncommon: 1.3, rare: 1.7 };
function cardPowerBudget(dropCost: number, actionCost: number, cardType: string, rarity: string): number {
  const mult = RARITY_BUDGET_MULT[rarity] || 1;
  const base = cardType === "structure" ? 2 * dropCost + 1 : 2 * dropCost + actionCost + 1;
  return Math.max(2, Math.round(base * mult));
}

/**
 * Справка живёт только если модель её написала: без title или text блока у карты не будет
 * (локального фолбэка сознательно нет — заготовочный текст снова стёр бы разницу эпох).
 */
export function sanitizeHistory(raw: any, era = "", culture = ""): CardHistory | undefined {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return undefined;
  const title = String(raw.title || "").trim().slice(0, 90);
  const text = String(raw.text || "").trim().slice(0, 700);
  if (!title || !text) return undefined;
  return {
    title,
    text,
    era: String(raw.era || era || "").slice(0, 60),
    culture: String(raw.culture || culture || "").slice(0, 80),
  };
}

export function validateCard(raw: any, expectedType: CardType, allowedEras: string[], rarity: Rarity = "ordinary"): Card {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) throw new Error("Кузнец не вернул объект карты.");
  const c = { ...raw } as any;
  if (typeof c.name !== "string" || !c.name.trim() || c.name.length > 80) throw new Error("У карты должно быть короткое название.");
  if (c.card_type !== expectedType) throw new Error("Советник вернул не тот тип карты, который был заказан.");
  if (!allowedEras.includes(c.era)) c.era = allowedEras[0];
  for (const f of ["drop_cost", "action_cost", "hp", "atk"]) int(c[f], 0, 99, f);
  if (c.card_type === "spell") { c.hp = 0; c.atk = 0; c.action_cost = 0; }
  if (c.card_type === "structure") { c.atk = 0; c.action_cost = 0; if (c.hp < 1) throw new Error("У постройки нужно хотя бы 1 HP."); }
  if (c.card_type === "unit" && c.hp < 1) throw new Error("У отряда должно быть хотя бы 1 HP.");
  if (typeof c.description !== "string" || !c.description.trim()) throw new Error("Нужно описание карты.");
  c.description = c.description.slice(0, 400);
  const kws: string[] = Array.isArray(c.keywords) ? c.keywords : [];
  c.keywords = kws
    .map((k) => String(k).toLowerCase().trim())
    .filter((k) => SUPPORTED_KEYWORDS.has(k.split(":")[0]))
    .slice(0, 8);
  if (c.card_type !== "unit" && c.keywords.some((k: string) => ["raider", "loot"].includes(k.split(":")[0]))) throw new Error("Ключевые слова raider и loot доступны только отрядам.");
  if (c.card_type !== "spell") {
    const keywordWeight = c.keywords.length;
    const power = c.atk + c.hp + keywordWeight;
    const budget = cardPowerBudget(c.drop_cost, c.action_cost, c.card_type, rarity);
    if (power > budget) {
      const scale = budget / power;
      if (c.card_type !== "structure") c.atk = Math.max(0, Math.round(c.atk * scale));
      c.hp = Math.max(1, Math.round(c.hp * scale));
    }
  }
  c.effects = validateEffects(Array.isArray(c.effects) ? c.effects : []);
  if (c.card_type === "spell") {
    if (!c.effects.length) throw new Error("Для манёвра нужен хотя бы один эффект.");
    c.effects = c.effects.filter((e: any) => e.event === "enter_play");
    if (!c.effects.length) throw new Error("Манёвр может использовать только enter_play.");
  }
  c.tags = Array.isArray(c.tags) ? c.tags.slice(0, 3).map((t: any) => String(t).slice(0, 40)) : [];
  c.abilities = [];
  c.emoji = typeof c.emoji === "string" && c.emoji.trim() ? c.emoji.slice(0, 8) : "⚒️";
  c.monkey_paw = typeof c.monkey_paw === "string" ? c.monkey_paw.slice(0, 200) : "";
  c.history = sanitizeHistory(c.history);
  c.id = c.id || "card-" + uid();
  return c as Card;
}

/* ---------- LLM (Hydra API) ----------
   Ключ больше нигде не вводится руками: он лежит только в переменной окружения
   HYDRA_API_KEY на сервере (Vercel) и используется прокси-функцией /api/hydra.
   Браузер этот ключ никогда не видит — только относительный путь к своей же функции. */

const HYDRA_PROXY_URL = "/api/hydra";

/** Проверка, что сервер настроен и ИИ отвечает: один короткий запрос без разбора ответа модели. */
export async function probeApiKey(model: string): Promise<void> {
  let resp: Response;
  try {
    resp = await fetch(HYDRA_PROXY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: model || "gpt-6-luna",
        messages: [{ role: "user", content: "Ответь одним словом: готов" }],
        max_tokens: 8,
        temperature: 0,
      }),
    });
  } catch {
    throw new Error("Нет связи с сервером игры. Проверьте интернет.");
  }
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err?.error?.message || `ИИ недоступен (HTTP ${resp.status}).`);
  }
  const data = await resp.json().catch(() => ({}));
  if (data?.error) throw new Error(data.error.message || "ИИ недоступен.");
}

/* Научный советник (три науки → чертёж → здание), советник-строитель и региональные постройки
   удалены вместе с экономикой, стройкой и картой: прототип сосредоточен на боевой системе
   (docs/COMBAT_PROTOTYPE_CUT.md). ИИ здесь отвечает только за кузницу — боевые замыслы и карты. */

async function hydraChat(opts: { model: string; system: string; user: string; temperature: number; maxTokens: number }) {
  const resp = await fetch(HYDRA_PROXY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: opts.model,
      messages: [{ role: "system", content: opts.system }, { role: "user", content: opts.user }],
      temperature: opts.temperature, max_tokens: opts.maxTokens, response_format: { type: "json_object" },
    }),
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err?.error?.message || `HTTP ${resp.status}`);
  }
  const data = await resp.json();
  if (data.error) throw new Error(data.error.message || "Ошибка API");
  const content: string = data.choices?.[0]?.message?.content || "";
  const m = content.match(/\{[\s\S]*\}/);
  if (!m) throw new Error("Модель не вернула JSON.");
  return JSON.parse(m[0]);
}

/** Исторический контекст эпохи: строка ERA_HISTORICAL, индекс которой совпадает с ERAS. */
export function eraContextOf(state: any): { label: string; desc: string; cultures: string; tech: string } {
  const record = M.ERA_HISTORICAL?.[state.player.era];
  return {
    label: M.eraName(state.player.era),
    desc: record?.desc || "",
    cultures: (record?.cultures || []).join(" · "),
    tech: (record?.tech || []).join(", "),
  };
}

export function contextOf(state: any): string {
  const p = state.player;
  const era = eraContextOf(state);
  const origin = (M.ORIGINS as any[]).find((o) => o.id === p.originId) || null;
  const seed = (M.SEED_CHOICES as any[]).find((s) => s.id === p.seedChoiceId) || null;
  const perks = M.describePerks(M.combatPerks(state)) as string[];
  return [
    `Народ: ${p.name} (${p.clan})`,
    origin && `Земля: ${origin.name} — ${origin.place}.${origin.historical ? " " + origin.historical : ""}`,
    seed && `Замысел народа: «${seed.line || seed.name}»`,
    p.historicalCulture && `Наследие: ${p.historicalCulture.name} — ${p.historicalCulture.desc || ""}`,
    `Эпоха: ${era.label}${era.desc ? ` — ${era.desc}` : ""}`,
    era.cultures && `Культуры эпохи: ${era.cultures}`,
    era.tech && `Технологии эпохи: ${era.tech}`,
    perks.length && `Боевой набор народа: ${perks.join(", ")}`,
  ].filter(Boolean).join("\n");
}

/**
 * Боевых тегов эпох у карт два (ancient и bronze) — на них держится модификатор урона в бою.
 * Порог открытия bronze берётся из модели (BRONZE_CARD_MIN_ERA = 1, «Античный мир»), а не
 * хардкодом: раньше здесь стояло `era >= 3`, что по единой шкале ERAS означало «Ренессанс»,
 * тогда как вражеские колоды получали бронзу уже с эпохи 1 (src/game/battle.ts).
 */
export function allowedCardErasOf(state: any): string[] {
  return M.allowedCardEras(state.player.era) as string[];
}

export async function llmAdvice(model: string, state: any): Promise<Advice[]> {
  const era = allowedCardErasOf(state).join(" и ");
  const data = await hydraChat({
    model, temperature: 1, maxTokens: 900,
    system: `Ты военный советник кузницы исторической карточной стратегии "Infinite Forge". Ты придумываешь замыслы именно для боевой колоды: каждая идея должна быть полезна в одном текущем сражении, а не описывать развитие народа между боями. Используй историю, географию, материалы и обычаи народа как источник образа и боевой тактики, но не как повод рассказывать о мирном хозяйстве.
В бою есть авангард и тыл, а вывод карты и атака расходуют общий запас энергии.
Предложи ровно три разных замысла, строго по одному каждого типа:
- unit — боец или воинское подразделение, которое выходит на поле и атакует; в pitch назови его тактическую роль: натиск, удержание линии, защита союзника, стрельба из тыла, засада или осада.
- spell — разовый манёвр, который немедленно меняет ход боя: удар, ловушка, поджог/яд, лечение, усиление бойца или воздействие на энергию/руку. Никакого урожая, ремесленного производства или подготовки к будущему походу.
- structure — именно боевая постройка/орудие в тылу, а не гражданское здание. В этой игре постройка остаётся в тылу и каждый ход обстреливает вражеский авангард или вождя; её замысел должен усиливать эту постоянную боевую роль или поддерживать войска.
В каждом pitch — одно короткое предложение с конкретным боевым действием и его целью/результатом. Не ограничивайся предысторией, бытом или тем, что народ «готовится», «сеет», «строит на будущее» или «собирается в путь»: сразу объясни, что карта делает на поле боя. Не предлагай сельское хозяйство, доход поселения, торговлю, погребения, дальнюю дорогу и долгосрочное развитие как самостоятельный эффект карты. Контекст народа — вдохновение для тактики, не задача карты.
Ответ — строго JSON: {"choices":[{"card_type":"unit|spell|structure","title":"короткое название","pitch":"одно предложение о тактической роли в бою"}]}. Язык — русский, исторический сеттинг без магии и фэнтези.`,
    user: `Нужны три боевые идеи для колоды — по одному unit, spell и structure. Преврати особенности народа в тактику одного сражения: контекст ниже нужен для исторического образа, а не для проектов хозяйства или долгой жизни поселения.
Контекст цивилизации:
${contextOf(state)}
Разрешённые эпохи карт: ${era}.`,
  });
  const list = data.choices;
  if (!Array.isArray(list) || list.length !== 3) throw new Error("Советник должен вернуть три замысла.");

  const cardTypes: CardType[] = ["unit", "spell", "structure"];
  const seen = new Set<CardType>();
  return list.map((c: any, i: number) => {
    if (!c || typeof c !== "object" || Array.isArray(c) || !cardTypes.includes(c.card_type)) {
      throw new Error("Советник должен предложить по одному замыслу каждого типа карты.");
    }
    const cardType = c.card_type as CardType;
    if (seen.has(cardType)) throw new Error("Советник должен предложить по одному замыслу каждого типа карты.");
    seen.add(cardType);
    const title = typeof c.title === "string" ? c.title.trim().slice(0, 60) : "";
    const pitch = typeof c.pitch === "string" ? c.pitch.trim().slice(0, 190) : "";
    if (!title || !pitch) throw new Error("В каждом боевом замысле нужны название и описание тактической роли.");
    return { id: `${cardType}-${i}-${Date.now()}`, cardType, title, pitch };
  });
}
const CARD_SYSTEM = `Ты — ИИ-Кузнец исторической карточной стратегии "Infinite Forge" о становлении цивилизаций. Сеттинг: реалистичный древний мир и бронзовый век, БЕЗ магии и фэнтези.
Эпохи карт (боевой тег, их ровно две): "ancient" (камень, кремень, пращи, частоколы) и "bronze" (бронзовое оружие, колесницы, стены). Используй только разрешённые.
Важно: боевой тег — это не дата в календаре кампании. В контексте указана эпоха кампании (например «Ренессанс» или «Эпоха Пара и Стали») вместе с её культурами и технологиями: образы, названия, описания и технологии карты должны соответствовать ИМЕННО этой эпохе (мушкеты и печатный стан для Ренессанса, пар и сталь для 1800-1910), а тег era при этом остаётся в разрешённом наборе ancient/bronze.
Ключевые слова: armor:N, pierce:N, ranged, reach, charge, shieldwall, wedge, phalanx, skirmish, taunt, heal:N, rally, fear, morale, siege, sturdy, holdground, upkeep, cleave:N (при атаке доп. N урона всем соседям цели в её ряду), vengeance:N (при гибели в бою наносит N урона своему убийце, если тот жив), relentless (может атаковать дважды за ход, если хватает энергии на обе атаки), scavenger (+1 к атаке за каждые 2 карты во вражеском сбросе, максимум +2), unbreakable (полный иммунитет к бегству от страха и морали), laststand (если это единственный живой отряд в своём ряду — +1 атаки и +1 брони). Энергетические свойства: supply (при выводе отряда/постройки или розыгрыше манёвра +1 к пределу энергии и +1 текущей энергии), warcry (+1 энергия при розыгрыше), loot (+1 энергия за убийство отряда; только для отряда), raider (крадёт 1 энергию у врага при попадании по отряду; только для отряда), harras (−1 к приросту энергии врага в его следующий ход), exhaustenemy (−1 энергия врага при розыгрыше). Яд/поджог/лечение оформляй через effects[].
Выбор цели в бою решает движок, в карте он не задаётся — но описание и образ должны ему соответствовать. Ближний бой из переднего ряда бьёт отряд напротив, затем ближайший; отряд с taunt перехватывает удар первым. Когда вражеский авангард пуст, ближний бой доходит до ближайшего отряда в тылу, а siege — до построек тыла; по вождю удар уходит только при полностью пустом поле. Дальний бой (ranged, skirmish) бьёт через вражеский авангард по самому опасному отряду на поле и не получает ответного удара, taunt перехватывает и выстрел. reach из тыла достаёт только врага напротив. Авангард защищает от ближнего боя, но не от стрел: этим объясняются и плотный строй щитов, и засады, и ценность провокации.
Боевой ресурс один: и вывод карты, и атака расходуют общий запас энергии.
Замысел от военного советника — только исторический образ: преврати его в тактическую карту, полезную в текущем сражении. Описание и эффекты должны показывать боевую роль отряда, немедленный результат манёвра или постоянную роль постройки в тылу. Не делай из карты сельское хозяйство, ремесленное производство, доход поселения или подготовку к будущему походу.
Разовые и срабатывающие действия — только в effects[]. Движок не читает description/tags.
description — 1–2 коротких предложения, один образ.
effects[] — объекты {event, target, action, condition?, watch?}:
 event: enter_play | attack | turn_start | turn_end | damaged (это событие срабатывает у самого отряда, когда он получает урон в бою) | death | card_death (когда гибнет отряд) | card_enter_play (когда выходит любая карта: отряд, постройка или манёвр). Для card_death и card_enter_play обязателен watch:{side:all|friendly|enemy}.
 target: {side: friendly|controller|enemy|opponent|either, entity: unit|structure|permanent|player, zone?: front|rear|any, relation?: any|self|adjacent|attack_target, select?: first|lowest_hp|lowest_hp_ratio|highest_attack|attack_target|choose|all|random (all — абсолютно все подходящие цели сразу, игнорирует count; random — count случайных целей), count?: 1-3}
 action.type: damage(amount 1-12) | heal(1-8) | apply_status(status poison|burn, amount 1-5, turns 1-3) | destroy | modify_resource(resource energy, amount -5..5; target player; старые drop/action читаются как энергия) | modify_stat(stat attack|armor|max_hp, amount -3..3, turns? 1-3) | modify_cost(cost "action", amount -3..3, turns?) | draw/scry(amount 1-5, target player) | discard/exchange(amount 1-5, choice highest_cost|lowest_cost, target player).
condition (необязательное поле эффекта) помимо target_wounded/target_status/target_stat/resource теперь поддерживает board_count: {type:"board_count", side: controller|opponent, op: eq|ne|lt|lte|gt|gte, value: 0-8} — количество живых отрядов на стороне.
У манёвра hp=0, atk=0, action_cost=0 и минимум один эффект enter_play. У постройки atk=0, action_cost=0, hp≥1. У отряда hp≥1.
Про историческую справку (поле history — ОБЯЗАТЕЛЬНО, пиши его последним): {"title":"","text":""}.
 title (до 70 знаков) — настоящий прототип карты: конкретная находка, место, обычай, род войск или звание ЭПОХИ КАМПАНИИ и НАСЛЕДИЯ НАРОДА из контекста («Курганные погребения ямной культуры», «Бронзовый кинжал из Арслантепе», «Янычарская мушкетная шеренга»).
 text (2–4 предложения, до 480 знаков) — зачем эта вещь или обычай существовали именно в эту эпоху у этого народа: из чего и какими технологиями эпохи её делали, кем были эти люди, чем она была в быту и почему на поле боя карта ведёт себя так, как у неё записано (её числа, ключевые слова, эффекты).
 Только реальная история: ни магии, ни фэнтези, ни вымышленных цивилизаций и пророчеств. Не пересказывай description и не повторяй название карты целиком. Если точного прототипа нет — возьми самое близкое явление этой эпохи, но не выдумывай народы.
Силу и цену выбираешь сам: сильные и странные карты допустимы. Ответ — строго JSON:
{"name":"","card_type":"unit|spell|structure","era":"ancient|bronze","emoji":"один эмодзи","drop_cost":0,"action_cost":0,"hp":0,"atk":0,"description":"","tags":[],"abilities":[],"keywords":[],"effects":[],"monkey_paw":"","history":{"title":"","text":""}}
Язык — русский.`;

export async function llmCard(model: string, advice: Advice, rarity: Rarity, state: any): Promise<Card> {
  const allowed = allowedCardErasOf(state);
  const directive = { ordinary: "Обычная редкость: 1–2 заметные особенности.", uncommon: "Необычная редкость: 2–3 интересно сочетающиеся особенности.", rare: "Редкая карта: 3–5 значимых особенностей, смелое сочетание." }[rarity];
  // Справка пишется под ЭПОХУ КАМПАНИИ и НАСЛЕДИЕ НАРОДА (не под боевой тег ancient/bronze):
  // иначе карты «древнего мира» и «античности» звучали бы одинаково при разных технологиях.
  const era = eraContextOf(state);
  const cultureName = state.player?.historicalCulture?.name || "";
  const raw = await hydraChat({
    model, maxTokens: 3000, temperature: rarity === "rare" ? 1 : rarity === "uncommon" ? 0.9 : 0.75,
    system: CARD_SYSTEM + `\nРазрешённые эпохи сейчас: ${allowed.join(", ")}.`,
    user: `Боевой замысел: «${advice.title}». ${advice.pitch}
Тип карты: ${advice.cardType}. ${directive}
Воплоти этот образ в боевую роль в текущем матче: не превращай ремесло, урожай, быт или дальний путь в долгосрочный эффект. Сами описание и effects должны объяснять, что происходит с бойцами, строем, энергией или полем боя.

Контекст цивилизации:
${contextOf(state)}

Эпоха кампании: «${era.label}». Наследие народа: «${cultureName || "своё, по контексту"}». Название, образ, описание, свойства (числа, ключевые слова, эффекты) и историческая справка должны принадлежать ИМЕННО этой эпохе и этому наследию — иначе карты «древнего мира» и «античности» неотличимы. Технологии эпохи: ${era.tech || "не заданы"}. Боевой тег карты при этом только один из разрешённых: ${allowed.join(" или ")}.

Историческая справка (поле history): привяжи карту к эпохе кампании «${era.label}»${cultureName ? ` и наследию «${cultureName}»` : ""} — к их технологиям, обычаям и людям.`,
  });
  const card = validateCard(raw, advice.cardType, allowed, rarity);
  card.rarity = rarity;
  card.id = "card-" + uid();
  // Справку подписываем эпохой и наследием из состояния: модель могла вернуть свои формулировки.
  if (card.history) card.history = { ...card.history, era: era.label, culture: cultureName };
  return card;
}
