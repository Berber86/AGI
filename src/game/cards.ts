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
  /** Только для обратной совместимости со старыми сохранёнными шаблонами NPC. */
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
  ranged: { name: "Дальний бой", desc: "Бьёт через все ряды врага по самому опасному отряду на поле (провокация перехватывает выстрел) и не получает ответный удар." },
  reach: { name: "Длинное оружие", desc: "Из глубины стола достаёт врага напротив в авангарде." },
  charge: { name: "Натиск", desc: "+2 к первой атаке после высадки." },
  shieldwall: { name: "Стена щитов", desc: "+1 брони; при соседях урон ниже ещё на 1." },
  wedge: { name: "Клин", desc: "+1 к атаке за каждого соседа (до +2)." },
  phalanx: { name: "Фаланга", desc: "+1 к атаке и +1 брони." },
  skirmish: { name: "Засадный", desc: "После своей атаки отходит в последний ряд и дальше бьёт как дальний бой — по любой цели. Если его атакуют в ближнем бою, уклоняется вглубь стола до обмена ударами." },
  taunt: { name: "Провокация", desc: "Враг обязан атаковать этот отряд первым." },
  poison: { name: "Яд", desc: "Отравляет цель при атаке: N урона в начале её хода." },
  burn: { name: "Поджог", desc: "Поджигает цель при атаке; огонь может перекинуться." },
  heal: { name: "Лекарь", desc: "В начале хода лечит раненого соседа на N." },
  rally: { name: "Поддержка", desc: "Соседи получают +1 к атаке." },
  fear: { name: "Устрашение", desc: "Шанс обратить цель в бегство при ударе." },
  morale: { name: "Мораль", desc: "Ниже 30% здоровья может бежать с поля." },
  siege: { name: "Осада", desc: "Двойной урон по постройкам; когда ряды перед ней пусты, достаёт постройки врага в последнем ряду." },
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
  blast: { name: "Фугас", desc: "При попадании накрывает ещё N урона соседям цели в её ряду и отряду прямо за ней — до трёх целей. Ответных ударов площадь не вызывает. Тяжёлый удар (N=2) задевает и ваш отряд напротив в том же столбце." },
  sweep: { name: "Картечь", desc: "При попадании накрывает ещё N урона всем остальным отрядам в ряду цели — до трёх целей. Ответных ударов площадь не вызывает." },
  column: { name: "Обстрел столбца", desc: "При попадании накрывает ещё N урона всем остальным отрядам в столбце цели, во всех рядах, — до трёх целей. Ответных ударов площадь не вызывает. Тяжёлый удар (N=2) задевает и ваш отряд напротив в том же столбце." },
  vengeance: { name: "Месть", desc: "При гибели в бою наносит N урона своему убийце, если тот ещё жив." },
  relentless: { name: "Неутомимый", desc: "Может атаковать дважды за ход, если хватает энергии на обе атаки." },
  scavenger: { name: "Мародёр", desc: "+1 к атаке за каждые 2 карты во вражеском сбросе (максимум +2)." },
  suppress: { name: "Подавление", desc: "При попадании подавляет отряд: его атака дорожает на N на 2 хода. Не запрет, а именно удорожание — если энергии хватает, отряд всё ещё может ударить. Потолок +3. «Несокрушимый» подавление не чувствует." },
  unbreakable: { name: "Несокрушимый", desc: "Полный иммунитет к бегству от страха, к морали и к подавлению." },
  laststand: { name: "Последний рубеж", desc: "Если это единственный живой отряд в своём ряду — +1 к атаке и +1 брони." },
  flank: { name: "Охват", desc: "+1 к урону по цели с открытым флангом — у неё нет живого соседа хотя бы с одной стороны (крайний столбец или дыра в строю). Если отряд напротив пал, такой боец идёт вверх по своему столбцу, а не вбок по чужому ряду." },
  screen: { name: "Прикрытие", desc: "+1 брони отряду прямо перед собой в том же столбце — тому, кто стоит ближе к врагу. На столе в одну линию прикрывать некого." },
  command: { name: "Штаб", desc: "Пока жив и стоит в тылу (последний ряд), даёт +1 энергии в начале хода — сверх текущего предела, но не выше общего потолка." },
  spotter: { name: "Корректировщик", desc: "Ваши дальние и площадные удары по целям в его столбце наносят +1 урона. Сам себя не наводит." },
  dispersed: { name: "Рассредоточение", desc: "Площадной урон («Фугас», «Картечь», «Обстрел столбца») по этому отряду уменьшен на 1, но не ниже 1. Прямого удара не касается." },
  entrenched: { name: "Окоп", desc: "Стоя в авангарде, не получает урона от «Картечи» и «Обстрела столбца» — ни от чужого, ни от своего. Прямой удар и «Фугас» укрытие пробивают." },
};

/* ---------- площадь: словарь и пределы ----------
   Те же числа, что и в движке (AREA_KEYWORDS / AREA_MAX_N в src/game/battle.ts): правила кузнеца и
   бой не должны разъезжаться, поэтому tests/area-shapes.test.js сверяет оба списка напрямую. */
export const AREA_KEYWORDS = ["blast", "sweep", "column"];
export const AREA_MAX_N = 2;

const SUPPORTED_KEYWORDS = new Set(Object.keys(KEYWORD_INFO));

/**
 * Ключевые слова, которым нужна глубина стола (список совпадает с DEPTH_KEYWORDS в движке — тест
 * tests/era-board.test.js это проверяет). В Каменном веке стол — одна линия в три клетки: тыла нет,
 * поэтому стрелков, засады и «длинное оружие» кузнец там не куёт — они заработают только со второго
 * ряда, с Античного мира. «Прикрытие» (`screen`) в том же списке по той же причине: прикрывать на
 * одной линии некого — ряда впереди просто нет.
 */
export const ONE_LINE_KEYWORDS = ["ranged", "skirmish", "reach", "screen"];
const keywordBase = (k: string) => String(k).toLowerCase().split(":")[0].trim();

/** Эпоха стола следующего боя — та же формула, что у threatEra в campaign.js. */
export function boardEraOf(state: any): number {
  const foes = Array.isArray(state?.opponents) ? state.opponents.map((o: any) => Number(o?.era) || 0) : [];
  return Math.max(Number(state?.player?.era) || 0, ...foes);
}

/** Стол следующего боя — одна линия (Каменный век): дальний бой не действует. */
export const oneLineBoard = (state: any): boolean => boardEraOf(state) <= 0;

/**
 * Какие «глубинные» ключевые слова модель вернула для боя на одной линии. Пустой массив — карта
 * законна; иначе текст уходит модели на переделку вместе с объяснением правила.
 */
export function oneLineViolation(card: { keywords?: string[] } | null | undefined): string[] {
  return ((card && card.keywords) || []).map(keywordBase).filter((k) => ONE_LINE_KEYWORDS.includes(k));
}

// Помимо keywords проверяем весь текст: «стреломёт без ключевого слова ranged» всё равно был бы
// анахронизмом и обещал бы на однорядном поле атаку, которой в движке нет.
const ONE_LINE_PROJECTILE_TEXT = /стрел|лук|пращ|баллист|арбалет|катапульт|метател|копь[её]м[её]т|дротик|atlatl|бумеранг|камнем[её]т|осадн.{0,18}машин|огнестрел|мушкет|выстрел|обстрел|залп|дальн.{0,12}бой/iu;
export function oneLineTextViolation(card: any): string[] {
  if (!card || typeof card !== "object") return [];
  const fields = [card.name, card.description, card.monkey_paw, ...(Array.isArray(card.tags) ? card.tags : []),
    card.history?.title, card.history?.text];
  const found = fields.filter((value) => typeof value === "string" && ONE_LINE_PROJECTILE_TEXT.test(value));
  return found.map((value) => value.match(ONE_LINE_PROJECTILE_TEXT)?.[0] || "дальнобойный образ");
}

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
  const rel = t.relation === "self" ? "себя" : t.relation === "adjacent" ? "соседей" : t.relation === "attack_target" ? "цель удара"
    : t.relation === "attack_target_row" ? "весь ряд цели удара" : t.relation === "attack_target_column" ? "весь столбец цели удара" : null;
  // Фланг и центр — ширина стола: у эффектов теперь есть и такая геометрия, её надо называть словами.
  const zoneTxt = t.zone === "flank" ? " на фланге" : t.zone === "center" ? " в центре" : "";
  const target = rel ?? `${who}${zoneTxt}`;
  let act = "";
  switch (a.type) {
    case "damage": act = `${a.amount} урона: ${target}`; break;
    case "heal": act = `лечит ${target} на ${a.amount}`; break;
    case "apply_status": act = `${a.status === "poison" ? "яд" : a.status === "burn" ? "поджог" : "подавление"} ${a.amount} на ${a.turns ?? 2} хода: ${target}`; break;
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

/* ---------- NPC-ополчение: шаблоны только для противников ---------- */

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

/**
 * NPC-ополчение использует отдельные статические шаблоны; в коллекцию игрока они не попадают.
 * Каменные шаблоны берём из campaign.js, бронзовые открываются противникам со второго этапа.
 */
const BRONZE_MILITIA: Card[] = [
  mk({ name: "Бронзовые наёмники", card_type: "unit", era: "bronze", emoji: "⚔️", drop_cost: 3, action_cost: 2, atk: 3, hp: 5, description: "Бронзовые мечи пробивают щиты.", keywords: ["pierce:1"] }),
  mk({ name: "Военный лагерь", card_type: "structure", era: "bronze", emoji: "⛺", drop_cost: 3, atk: 0, hp: 5, description: "Лагерь поднимает дух соседей и не стреляет.", keywords: ["rally"] }),
];

export function buildMilitia(): Card[] {
  const stone = ((M.MILITIA_CORE_CARDS as any[]) || []).map((c) => ({ ...c, militia: true })) as Card[];
  return [...stone, ...BRONZE_MILITIA.map((c) => ({ ...c, militia: true }))];
}

/** Учебный бой: враг приходит без построек, чтобы новичка не били бесплатно из тыла. */
export function withoutStructures(pool: Card[]): Card[] {
  return pool.filter((c) => c.card_type !== "structure");
}

/* ---------- Коллекция игрока: только карты, выкованные ИИ ---------- */

export function allCards(collection: Card[]): Card[] {
  return (Array.isArray(collection) ? collection : []).filter((card) =>
    card && !card.militia && !card.campaignStarter
      && !/^(?:militia-|starter-)/u.test(String(card.id || ""))
      && !(typeof M.isNpcMilitiaCardId === "function" && M.isNpcMilitiaCardId(card.id)),
  );
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
  if (node.type === "target_status") { if (!["poison", "burn", "suppress"].includes(node.status)) throw new Error("Неизвестный статус в условии."); return { type: "target_status", status: node.status }; }
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
      if (!["poison", "burn", "suppress"].includes(a.status)) fail("только poison, burn или suppress.");
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
    if (t.zone !== undefined) { if (!["front", "rear", "flank", "center", "any"].includes(t.zone)) fail("zone неизвестна."); target.zone = t.zone; }
    if (t.relation !== undefined) { if (!["any", "self", "adjacent", "attack_target", "attack_target_row", "attack_target_column"].includes(t.relation)) fail("relation неизвестен."); target.relation = t.relation; }
    if (t.select !== undefined) { if (!["first", "lowest_hp", "lowest_hp_ratio", "highest_attack", "attack_target", "choose", "all", "random"].includes(t.select)) fail("select неизвестен."); target.select = t.select; }
    const targetRelations = ["attack_target", "attack_target_row", "attack_target_column"];
    if ((target.select === "attack_target" || targetRelations.includes(target.relation)) && e.event !== "attack") fail("attack_target только для события attack.");
    if ((target.relation === "adjacent" || targetRelations.includes(target.relation)) && target.entity === "player") fail("это отношение неприменимо к игроку.");
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
/**
 * pawWeight — надбавка за плату: каждый пункт веса лапы обезьяны даёт карте +1 к бюджету силы.
 * Без этого карта с платой была бы строго хуже чистой, а жребий — чистым наказанием.
 */
function cardPowerBudget(dropCost: number, actionCost: number, cardType: string, rarity: string, pawWeight = 0): number {
  const mult = RARITY_BUDGET_MULT[rarity] || 1;
  const base = cardType === "structure" ? 2 * dropCost + 1 : 2 * dropCost + actionCost + 1;
  return Math.max(2, Math.round(base * mult)) + Math.max(0, Math.floor(pawWeight));
}

/** Небольшой, проверяемый бюджет силы разовых манёвров; большие цели и уничтожение запрещены. */
function spellEffectPower(effect: any): number {
  const { action, target } = effect;
  if (target.select === "all") throw new Error("Манёвр не может целиться сразу во все подходящие отряды.");
  if ((target.count || 1) > 2) throw new Error("Манёвр может затронуть не более двух целей.");
  let cost: number;
  switch (action.type) {
    case "damage": case "heal": cost = action.amount; break;
    case "apply_status": cost = action.amount + Math.ceil(((action.turns || 1) - 1) / 2); break;
    case "modify_resource": cost = Math.abs(action.amount) * 2; break;
    case "modify_stat": case "modify_cost": cost = Math.abs(action.amount) * (action.turns || 1); break;
    case "draw": case "discard": case "exchange": case "scry": cost = action.amount * 2; break;
    case "destroy": throw new Error("Манёвр не может мгновенно уничтожать отряд или постройку.");
    default: cost = 99;
  }
  return cost * (target.count || 1);
}

function validateSpellPower(card: Card, rarity: Rarity, oneLine = false, paw: PawTier = "none"): void {
  if (oneLine && card.effects.length !== 1) throw new Error("Манёвр Каменного века должен иметь ровно один скромный эффект.");
  if (!oneLine && card.effects.length > 2) throw new Error("У манёвра не больше двух эффектов — не складывай несколько сильных действий.");
  if (oneLine && card.effects.some((effect) => (effect.target.count || 1) !== 1 || effect.target.select === "all")) {
    throw new Error("Манёвр Каменного века может затронуть только одну цель.");
  }
  const power = card.effects.reduce((sum, effect) => sum + spellEffectPower(effect), 0);
  const rarityBonus = rarity === "rare" ? 2 : rarity === "uncommon" ? 1 : 0;
  // На однорядном столе редкость не разгоняет манёвр; реальная плата может вернуть не более двух
  // пунктов эффекта, чтобы жёсткий жребий не делал первую AI-карту невыполнимой.
  const paidAllowance = oneLine && paw !== "none" ? Math.min(2, pawSeverity(card, paw)) : 0;
  const budget = oneLine ? Math.min(2, card.drop_cost) + paidAllowance : card.drop_cost + 1 + rarityBonus;
  if (power > budget) throw new Error(`Манёвр слишком силён для цены: вес эффектов ${power}, предел ${budget}. Уменьши урон, длительность или число целей.`);
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

/* ---------- лапа обезьяны ----------
 * Механика из самой первой версии игры: выкованная карта может прийти с платой. Жребий бросает
 * модель кампании (campaign.js → rollPawTier: треть чистых, треть с небольшой платой, треть с
 * жёсткой) и до раскрытия карты он игроку не показывается. Плату пишет модель, а игра проверяет,
 * что она выражена настоящей механикой: текстовый «штраф» без эффекта движок не исполнит.
 */
export type PawTier = "none" | "minor" | "harsh";

export const PAW_LABELS: Record<PawTier, string> = {
  none: "Чистая карта",
  minor: "Небольшая плата",
  harsh: "Жёсткая плата",
};

/** Небольшая плата — вес 1…3, жёсткая — от 4. */
export const PAW_MINOR_MAX = 3;

const isOwnSide = (side: string) => side === "friendly" || side === "controller";
const isFoeSide = (side: string) => side === "enemy" || side === "opponent";

/**
 * Настоящие минусы карты: эффекты против своей стороны и своего вождя, усиление врага,
 * а также ключевые слова-обременения. Возвращает и человекочитаемое описание, и вес.
 */
export function pawMarkers(c: Pick<Card, "keywords" | "effects">, paw: PawTier = "none"): { text: string; weight: number }[] {
  const out: { text: string; weight: number }[] = [];
  for (const raw of c.keywords || []) {
    const key = String(raw).split(":")[0];
    // upkeep — чистое обременение, он считается всегда. morale на обычных картах — часть
    // словаря («Дружина вождя» несёт её вместе со стеной щитов), поэтому в плату она идёт,
    // только если плата заказана.
    if (key === "upkeep") out.push({ text: "содержание: без соседей теряет 1 HP за ход", weight: 2 });
    else if (key === "morale" && paw !== "none") out.push({ text: "мораль: при ранах может бежать с поля", weight: 2 });
  }
  for (const e of c.effects || []) {
    const t = e?.target, a = e?.action;
    if (!t || !a) continue;
    const own = isOwnSide(t.side), foe = isFoeSide(t.side);
    const amount = Math.abs(Number(a.amount) || 0);
    const who = own ? "своим" : "врагу";
    if (own && a.type === "damage") out.push({ text: `${amount} урона ${who}`, weight: amount });
    else if (own && a.type === "apply_status") out.push({ text: `${a.status === "burn" ? "огонь" : a.status === "suppress" ? "подавление" : "яд"} на ${who} (${a.turns || 2} хода)`, weight: amount + Math.max(0, (a.turns || 2) - 1) });
    else if (own && a.type === "destroy") out.push({ text: "уничтожает собственный отряд", weight: 4 });
    else if (own && a.type === "modify_stat" && Number(a.amount) < 0) out.push({ text: `${a.amount} к «${a.stat}» ${who}`, weight: amount + (a.turns ? 0 : 1) });
    else if (own && a.type === "modify_cost" && Number(a.amount) > 0) out.push({ text: `+${amount} к цене атаки ${who}`, weight: amount });
    else if (own && a.type === "modify_resource" && Number(a.amount) < 0) out.push({ text: `${a.amount} энергии у вождя`, weight: amount });
    else if (own && (a.type === "discard" || a.type === "exchange")) out.push({ text: `${a.type === "discard" ? "сброс" : "обмен"} ${amount} карт из руки`, weight: 2 * amount });
    else if (foe && a.type === "heal") out.push({ text: `лечит врага на ${amount}`, weight: amount });
    else if (foe && a.type === "modify_stat" && Number(a.amount) > 0) out.push({ text: `+${amount} к «${a.stat}» врага`, weight: amount });
    else if (foe && a.type === "modify_resource" && Number(a.amount) > 0) out.push({ text: `+${amount} энергии врагу`, weight: amount });
    else if (foe && a.type === "draw") out.push({ text: `враг добирает ${amount} карт`, weight: amount });
  }
  return out;
}

/** Суммарный вес платы: им измеряют и силу платы, и надбавку к бюджету карты. */
export const pawSeverity = (c: Pick<Card, "keywords" | "effects">, paw: PawTier = "none"): number =>
  pawMarkers(c, paw).reduce((sum, m) => sum + m.weight, 0);

/** Таблица весов для промпта: модель обязана попасть в заказанный диапазон, а не угадать его. */
const PAW_WEIGHT_TABLE = `Вес платы движок считает по карте сам:
- damage по своим (side friendly|controller) — вес = amount;
- apply_status poison|burn|suppress по своим — вес = amount + (turns − 1);
- destroy своего отряда — вес 4;
- modify_stat с отрицательным amount по своим — вес = |amount|, и ещё +1 если без turns (навсегда);
- modify_cost с положительным amount по своим — вес = amount;
- modify_resource energy с отрицательным amount по своим — вес = |amount|;
- discard или exchange своих карт — вес = 2 × amount;
- heal, modify_stat с плюсом, modify_resource с плюсом и draw по врагу (side enemy|opponent) — вес = amount;
- ключевое слово upkeep — вес 2; ключевое слово morale — вес 2.`;

function pawDirective(paw: PawTier): string {
  if (paw === "none") {
    return `ЛАПА ОБЕЗЬЯНЫ — НА ЭТОТ РАЗ ЧИСТО. Кузнец не берёт платы: monkey_paw = "", никаких эффектов против своей стороны и своего вождя, никакого лечения и усиления врага, ключевых слов upkeep и morale нет. Суммарный вес платы обязан быть 0.`;
  }
  const band = paw === "minor"
    ? `НЕБОЛЬШАЯ ПЛАТА: суммарный вес от 1 до ${PAW_MINOR_MAX} — один скромный минус.`
    : `ЖЁСТКАЯ ПЛАТА: суммарный вес от ${PAW_MINOR_MAX + 1} и выше — карта сильная, но рискованная; плата заметно дороже мелкой.`;
  const examples = paw === "minor"
    ? `Готовые примеры небольшой платы:
- вес 1: {"event":"enter_play","target":{"side":"controller","entity":"player"},"action":{"type":"modify_resource","resource":"energy","amount":-1}} — вождь платит энергией за выход отряда;
- вес 2: ключевое слово upkeep — без соседей отряд теряет 1 HP за ход;
- вес 2: {"event":"enter_play","target":{"side":"friendly","entity":"unit","relation":"adjacent"},"action":{"type":"damage","amount":2}} — отряд толкает своих же;
- вес 3: {"event":"turn_start","target":{"side":"friendly","entity":"unit","relation":"self"},"action":{"type":"modify_stat","stat":"attack","amount":-1}} — постоянное ухудшение своей атаки.`
    : `Готовые примеры жёсткой платы:
- вес 4: {"event":"enter_play","target":{"side":"controller","entity":"player"},"action":{"type":"discard","amount":2,"choice":"highest_cost"}} — вождь сбрасывает две лучшие карты;
- вес 4: {"event":"death","target":{"side":"friendly","entity":"unit","select":"all"},"action":{"type":"damage","amount":2}} — гибель отряда бьёт по своим;
- вес 4: {"event":"enter_play","target":{"side":"friendly","entity":"unit","relation":"self"},"action":{"type":"apply_status","status":"burn","amount":2,"turns":3}} — отряд поджигает сам себя;
- вес 6: {"event":"turn_start","target":{"side":"controller","entity":"player"},"action":{"type":"modify_resource","resource":"energy","amount":-2}} вместе с ключевым словом upkeep.`;
  return `ЛАПА ОБЕЗЬЯНЫ ОБЯЗАТЕЛЬНА. ${band}
Плату придумываешь ты, но выражена она должна быть НАСТОЯЩЕЙ МЕХАНИКОЙ из разрешённого словаря: эффектами в effects[] против своей стороны/своего вождя (урон, яд, огонь, ухудшение характеристики, удорожание атаки, потеря энергии, сброс карт, уничтожение своего отряда) либо усилением врага, и/или ключевыми словами upkeep, morale. Текст в monkey_paw (до 200 знаков) называет плату по-человечески и точно совпадает с механикой — никаких штрафов, которых нет в effects[] и keywords[].
${PAW_WEIGHT_TABLE}
${examples}
Перед ответом сложи веса своих минусов и попади в полосу ${paw === "minor" ? `1…${PAW_MINOR_MAX}` : `${PAW_MINOR_MAX + 1} и выше`}: если выходит тяжелее — убери часть эффектов, легче — добавь.
Плату платит владелец карты: цель таких эффектов — side friendly или controller (для вражеской выгоды — enemy/opponent). Плата не должна делать карту бесполезной: она мешает, но не отменяет боевую роль.
ОПИСАНИЕ И СПРАВКА ОБЪЯСНЯЮТ ПЛАТУ: description показывает, чем отряд расплачивается в бою, а history.text — откуда эта цена взялась у народа (обычай, долг обряда, скверное оружие, голод, клятва, болезнь, плата жрецам). Карта, у которой плата не обоснована текстом, не принимается.`;
}

/** Ошибка браковки платы: движок помечает её, чтобы UI не показывал игроку сам жребий. */
const pawError = (message: string) => Object.assign(new Error(message), { pawRejected: true });

/**
 * opts.relaxBand — последняя попытка ковки: плата обязана быть настоящей (вес ≥ 1, текст и справка
 * на месте), но её величину движок уже не бракует. Лучше карта с платой не той силы, чем отменённая
 * ковка: жребий задаёт ЗАКАЗ модели, а не повод вернуть игроку славу.
 */
export function validateCard(raw: any, expectedType: CardType, allowedEras: string[], rarity: Rarity = "ordinary", paw: PawTier = "none", opts: { relaxBand?: boolean; oneLine?: boolean } = {}): Card {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) throw new Error("Кузнец не вернул объект карты.");
  const c = { ...raw } as any;
  if (typeof c.name !== "string" || !c.name.trim() || c.name.length > 80) throw new Error("У карты должно быть короткое название.");
  if (c.card_type !== expectedType) throw new Error("Советник вернул не тот тип карты, который был заказан.");
  if (!allowedEras.includes(c.era)) c.era = allowedEras[0];
  for (const f of ["drop_cost", "action_cost", "hp", "atk"]) int(c[f], 0, 99, f);
  if (c.drop_cost < 1) throw new Error("Карта не может быть бесплатной: drop_cost минимум 1.");
  c.drop_cost = Math.min(6, c.drop_cost);
  if (opts.oneLine) {
    if (c.card_type === "structure") throw new Error("В Каменном веке построек нет: на одной линии они занимают место бойца.");
    c.drop_cost = Math.min(2, c.drop_cost);
  }
  if (c.card_type === "spell") { c.hp = 0; c.atk = 0; c.action_cost = 0; }
  // Постройка не ходит и не атакует как отряд, но может стрелять: atk 0 — это стена или склад,
  // atk 1…4 — башня или орудие, которое каждый ход обстреливает врага (урон гасит броня, ответа нет).
  if (c.card_type === "structure") { c.atk = Math.min(4, Math.max(0, c.atk)); c.action_cost = 0; if (c.hp < 1) throw new Error("У постройки нужно хотя бы 1 HP."); }
  if (c.card_type === "unit" && c.hp < 1) throw new Error("У отряда должно быть хотя бы 1 HP.");
  if (typeof c.description !== "string" || !c.description.trim()) throw new Error("Нужно описание карты.");
  c.description = c.description.slice(0, 400);
  const kws: string[] = Array.isArray(c.keywords) ? c.keywords : [];
  c.keywords = kws
    .map((k) => String(k).toLowerCase().trim())
    .filter((k) => SUPPORTED_KEYWORDS.has(k.split(":")[0]))
    .slice(0, 8);
  if (c.card_type !== "unit" && c.keywords.some((k: string) => ["raider", "loot"].includes(k.split(":")[0]))) throw new Error("Ключевые слова raider и loot доступны только отрядам.");
  if (opts.oneLine && c.keywords.some((k: string) => AREA_KEYWORDS.includes(k.split(":")[0]))) {
    throw new Error("Площадные и метательные атаки не подходят для рукопашного стола Каменного века.");
  }
  if (opts.oneLine && c.card_type === "unit") {
    if (c.keywords.length > 2) throw new Error("Каменный отряд может иметь не больше двух ключевых слов.");
    const attackBoosts = c.keywords.filter((k: string) => ["charge", "phalanx", "wedge", "rally", "flank", "scavenger", "laststand", "cleave", "relentless"].includes(k.split(":")[0]));
    if (attackBoosts.length > 1) throw new Error("Не складывай несколько усилителей атаки на одном каменном отряде.");
    c.action_cost = Math.min(2, Math.max(1, c.action_cost));
    c.keywords = c.keywords.map((k: string) => k.split(":")[0] === "cleave" ? "cleave:1" : k);
  }
  // Площадь — самая сильная геометрия стола, поэтому рамки жёсткие и проверяются здесь, а не на глаз:
  // одно площадное слово на карту, N не выше AREA_MAX_N, удар не бесплатный и карта не рядовая.
  const areaKws = c.keywords.filter((k: string) => AREA_KEYWORDS.includes(k.split(":")[0]));
  if (areaKws.length > 1) throw new Error("Карте хватает одного площадного слова: «Фугас», «Картечь» и «Обстрел столбца» не складываются.");
  for (const raw of areaKws) {
    const [kw, ns] = String(raw).split(":");
    const n = parseInt(ns || "1", 10);
    if (!Number.isInteger(n) || n < 1 || n > AREA_MAX_N) throw new Error(`Площадное слово ${kw} принимает N от 1 до ${AREA_MAX_N}.`);
    if (c.card_type !== "unit") throw new Error("Площадные слова доступны только отрядам.");
    if (c.action_cost < 1) throw new Error("Площадной удар не бывает бесплатным: action_cost минимум 1.");
    if (rarity === "ordinary") throw new Error("Площадной удар — не рядовое свойство: карта с ним должна быть не ниже необычной.");
  }
  c.effects = validateEffects(Array.isArray(c.effects) ? c.effects : []);
  if (c.card_type === "spell") {
    if (!c.effects.length) throw new Error("Для манёвра нужен хотя бы один эффект.");
    c.effects = c.effects.filter((e: any) => e.event === "enter_play");
    if (!c.effects.length) throw new Error("Манёвр может использовать только enter_play.");
    validateSpellPower(c as Card, rarity, Boolean(opts.oneLine), paw);
  } else if (opts.oneLine && c.card_type === "unit" && c.effects.length) {
    const power = c.effects.reduce((sum: number, effect: any) => sum + spellEffectPower(effect), 0);
    const budget = c.drop_cost + 1;
    if (c.effects.length > 2 || power > budget) {
      throw new Error(`Эффекты каменного отряда слишком сильны или многочисленны: вес ${power}, предел ${budget}; оставь одно-два простых действия.`);
    }
  }
  c.tags = Array.isArray(c.tags) ? c.tags.slice(0, 3).map((t: any) => String(t).slice(0, 40)) : [];
  c.abilities = [];
  c.emoji = typeof c.emoji === "string" && c.emoji.trim() ? c.emoji.slice(0, 8) : "⚒️";
  c.monkey_paw = typeof c.monkey_paw === "string" ? c.monkey_paw.trim().slice(0, 200) : "";
  c.history = sanitizeHistory(c.history);

  // Лапа обезьяны: жребий, выпавший при заказе, обязателен к исполнению, а размер платы измеряется
  // настоящей механикой карты — текстовый штраф без эффекта движок исполнить не сможет.
  const markers = pawMarkers(c as Card, paw);
  const severity = markers.reduce((sum, m) => sum + m.weight, 0);
  const markerText = markers.map((m) => `${m.text} (вес ${m.weight})`).join("; ");
  if (paw === "none") {
    if (severity > 0) throw pawError(`Заказана чистая карта, но кузнец добавил плату: ${markerText}.`);
    if (c.monkey_paw) throw pawError("У чистой карты не должно быть текста платы (monkey_paw).");
  } else {
    if (severity < 1) throw pawError(`Лапа обезьяны (${PAW_LABELS[paw]}) требует настоящую плату: эффект против своей стороны или ключевого слова, а не только текст.`);
    if (!opts.relaxBand) {
      if (paw === "minor" && severity > PAW_MINOR_MAX) throw pawError(`Небольшая плата — это вес 1…${PAW_MINOR_MAX}, а кузнец дал ${severity}: ${markerText}.`);
      if (paw === "harsh" && severity <= PAW_MINOR_MAX) throw pawError(`Жёсткая плата — это вес от ${PAW_MINOR_MAX + 1}, а кузнец дал ${severity}: ${markerText}.`);
    }
    if (c.monkey_paw.length < 20) throw pawError("Текст платы (monkey_paw) слишком короткий: назовите её по-человечески и точно как в механике.");
    if (!c.history || (c.history.text || "").length < 40) throw pawError("Справка карты обязана объяснять, откуда народ платит эту цену (history.text).");
  }

  if (c.card_type !== "spell") {
    const keywordWeight = c.keywords.length;
    const power = c.atk + c.hp + keywordWeight;
    // Плата оплачивает силу: каждый пункт веса лапы даёт карте +1 к бюджету.
    const budget = cardPowerBudget(c.drop_cost, c.action_cost, c.card_type, rarity, severity);
    if (power > budget) {
      const scale = budget / power;
      c.atk = Math.max(0, Math.round(c.atk * scale));
      c.hp = Math.max(1, Math.round(c.hp * scale));
    }
  }
  // Числа каменной рукопашной ограничены не только бюджетом стоимости: даже необычная редкая карта
  // не поднимает базовую атаку выше 2 и здоровье выше 3. Бой отдельно ограничивает эффективный урон.
  if (opts.oneLine && c.card_type === "unit") {
    c.atk = Math.max(1, Math.min(2, c.atk));
    c.hp = Math.max(1, Math.min(3, c.hp));
  }
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
  const p = state.player || {};
  const era = eraContextOf(state);
  const seed = (M.SEED_CHOICES as any[]).find((s) => s.id === p.seedChoiceId) || null;
  const perks = M.describePerks(M.combatPerks(state)) as string[];
  return [
    `Эпоха кампании: ${era.label}.`,
    era.tech && `Технологии эпохи: ${era.tech}`,
    p.historicalCulture?.name && `Наследие — необязательный ориентир: ${p.historicalCulture.name}; не повторяй его клише в каждой карте.`,
    seed && `Замысел народа — один из возможных источников образа, не обязательная тема: ${seed.line || seed.name}`,
    perks.length && `Боевые черты вождя: ${perks.join(", ")}`,
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
  const oneLine = oneLineBoard(state);
  const cardTypes: CardType[] = oneLine ? ["unit", "spell"] : ["unit", "spell", "structure"];
  const tableRule = oneLine
    ? ` Стол Каменного века — одна линия из трёх клеток: без тыла, построек, стрелков, снарядов и дальнего боя. Для unit предлагай только историческую роль ближнего боя; spell — ровно один небольшой эффект на одну цель.`
    : "";
  const typeList = cardTypes.join(", ");
  const typeUnion = cardTypes.join("|");
  const data = await hydraChat({
    model, temperature: 0.85, maxTokens: 650,
    system: `Ты — военный советник Infinite Forge. Придумывай идеи для одного текущего боя, а не развитие хозяйства между боями. Вывод карты и атака расходуют общий запас энергии; на поле есть авангард и тыл.\nunit — правдоподобный отряд с ясной тактической ролью. spell — немедленный, умеренный манёвр, обычно против одной цели. structure — только для стола с тылом: боевая постройка стоит в последнем ряду, action_cost=0, hp≥1; atk от 0 до 4: 0 — стена (не стреляет), 1 и выше — каждый ход обстреливает ближайшего врага или вождя, урон равен atk, броня его гасит, ответа нет. Не предлагай структуру без роли.\nИстория и наследие — источник возможных образов, не обязательная тема каждой карты. Не повторяй одну культуру, известный народ или оружейное клише; выбирай разные исторические детали и только реально доступные технологии указанной эпохи. Никакой магии, фэнтези и анахронизмов. Pitch: одно короткое предложение о действии и цели в бою, не о подготовке. Не предлагай сельское хозяйство, ремесло, торговлю, погребения, доход или долгосрочное развитие.\n${oneLine ? "В Каменном веке unit — только рукопашный: не лучник, не пращник и не метатель; оружие дальнего боя и его слова запрещены." : ""}\nОтвет строго JSON: {\"choices\":[{\"card_type\":\"${typeUnion}\",\"title\":\"короткое название\",\"pitch\":\"тактическая роль\"}]}. Верни ровно ${cardTypes.length} разных идей — по одной каждого разрешённого типа. Язык — русский.`,
    user: `Нужны ${cardTypes.length} боевые идеи для колоды, ровно по одному каждого типа: ${typeList}. Контекст ниже — необязательное вдохновение; разнообразь образы и не своди их все к культуре народа.\nКонтекст цивилизации:\n${contextOf(state)}\nРазрешённые эпохи карт: ${era}.${tableRule}`,
  });
  const list = data.choices;
  if (!Array.isArray(list) || list.length !== cardTypes.length) throw new Error(`Советник должен вернуть ${cardTypes.length} боевых замысла.`);

  const seen = new Set<CardType>();
  return list.map((c: any, i: number) => {
    if (!c || typeof c !== "object" || Array.isArray(c) || !cardTypes.includes(c.card_type)) {
      throw new Error("Советник должен предложить по одному замыслу каждого доступного типа карты.");
    }
    const cardType = c.card_type as CardType;
    if (seen.has(cardType)) throw new Error("Советник должен предложить по одному замыслу каждого доступного типа карты.");
    seen.add(cardType);
    const title = typeof c.title === "string" ? c.title.trim().slice(0, 60) : "";
    const pitch = typeof c.pitch === "string" ? c.pitch.trim().slice(0, 190) : "";
    if (!title || !pitch) throw new Error("В каждом боевом замысле нужны название и описание тактической роли.");
    return { id: `${cardType}-${i}-${Date.now()}`, cardType, title, pitch };
  });
}

/** Общие для советника и кузнеца краткие правила: полная механика проверяется валидатором. */
const CARD_SYSTEM = `Ты — ИИ-кузнец карточной стратегии Infinite Forge. Пиши исторические боевые карты без магии и фэнтези. Ответ — только JSON по схеме ниже, без пояснений.
ЭПОХА: боевой тег карты — только ancient или bronze и не является календарной датой. Исторические предметы, названия, роли и справка должны соответствовать ЭПОХЕ КАМПАНИИ и реальным технологиям из контекста. Не переносить оружие и институты из будущей эпохи в прошлую.
КАМЕННЫЙ ВЕК / стол в одну линию: только ближний бой, unit HP 1–3, ATK 1–2, цена 1–2; structure запрещена. Для unit не используй ranged, skirmish, reach, screen и не упоминай луки, пращи, стрелы, стреломёты, баллисты, арбалеты, катапульты, снаряды, залпы или обстрел — даже в имени, описании, тегах и history. Не маскируй метательное оружие другим названием. Манёвр в этой эпохе должен содержать ровно один скромный эффект и затрагивать ровно одну цель; без платы вес эффекта не выше 2, а при заказанной плате допускается только небольшая проверяемая надбавка.
БАЛАНС: у отряда 1–2 ключевых слова, без цепочки сильных бонусов; базовые цифры соразмерны цене. Натиск/клин/фаланга/охват уже увеличивают урон — не складывай несколько таких усилений на одном каменном отряде. Манёвр: цена минимум 1; только 1–2 эффекта enter_play, не более двух целей, без select=all и без destroy. Урон/лечение — умеренные; статус короткий; общий вес эффектов не выше drop_cost+1, с небольшим допуском за редкость. Никаких бесплатных ударов по всему столу, вечных блокировок и гарантированного уничтожения.
ПОСТРОЙКА возможна только при наличии тыла; action_cost=0, HP≥1, atk от 0 до 4: 0 — стена (не стреляет), 1 и выше — обстрел каждый ход. Ответ на обстрел не приходит, броня его гасит. Не обещай эффектов, которых нет в механике.
КЛЮЧЕВЫЕ СЛОВА: armor:N — снижает входящий урон; pierce:N — игнорирует броню; ranged — бьёт по опасной цели без ответа; reach — атакует авангард из тыла; charge — +2 к первой атаке; shieldwall — броня и защита соседями; wedge — атака за соседей; phalanx — +атака и броня; skirmish — отступление/атака из тыла; taunt — враг бьёт первым; poison/burn — статус при атаке; heal:N — лечит соседа; rally — +атака соседям; fear/morale — бегство; siege — урон строениям; sturdy — первый удар слабее; holdground — защита от страха/натиска; upkeep — урон без соседа; supply/warcry — энергия при розыгрыше; loot/raider — энергия за попадание/убийство; harras — задержка прироста энергии; exhaustenemy — отнять 1 энергию; cleave:N — соседям цели; blast/sweep/column:N — площадной урон, максимум одно слово на карту, N=1–2, не более трёх дополнительных целей, тяжёлый удар может задеть своего; vengeance:N — месть при гибели; relentless — вторая атака; scavenger — бонус за сброс; suppress:N — атака цели дорожает; unbreakable — иммунитет к бегству и подавлению; laststand — бонус одинокому отряду в ряду; flank — +1 урон по открытому флангу; screen — броня переднему соседу в столбце; command — энергия из тыла; spotter — +1 дальнему/площадному удару по своему столбцу; dispersed — защита от площади; entrenched — укрытие в авангарде.
МЕХАНИКА effects: [{event,target,action,condition?,watch?}]. event: enter_play, attack, turn_start, turn_end, damaged, death, card_death или card_enter_play (последним двум нужен watch:{side:all|friendly|enemy}). target: {side:friendly|controller|enemy|opponent|either,entity:unit|structure|permanent|player,zone?:front|rear|flank|center|any,relation?:self|adjacent|attack_target|attack_target_row|attack_target_column,select?:first|lowest_hp|lowest_hp_ratio|highest_attack|attack_target|choose|all|random,count?:1–3}. action.type: damage, heal, apply_status(poison|burn|suppress), destroy, modify_resource(energy), modify_stat(attack|armor|max_hp), modify_cost(action), draw/discard/exchange/scry. Для spell разрешён только enter_play; все числа и цели проходят строгую проверку игры. Событие attack нужно только для реакций на удар.
description: 1–2 коротких предложения об одном боевом образе. abilities всегда []. tags — до трёх кратких слов. Все боевые эффекты описывай в effects, не только в тексте.
ИСТОРИЯ: поле history обязательно: {"title":"","text":""}. title — реальный прототип указанной эпохи (находка, обычай, тип отряда или звание); text — 2–3 коротких предложения о материале/технологии и связи прототипа с цифрами или ролью карты. Не выдумывай место, народ или находку. Культурное наследие — необязательный ориентир: не надо вставлять имя народа и его клише в каждую карту; чередуй военные, бытовые и технологические источники эпохи.
Схема JSON: {"name":"","card_type":"unit|spell|structure","era":"ancient|bronze","emoji":"один эмодзи","drop_cost":1,"action_cost":0,"hp":0,"atk":0,"description":"","tags":[],"abilities":[],"keywords":[],"effects":[],"monkey_paw":"текст заказанной платы или пустая строка","history":{"title":"","text":""}}. Для spell: hp=0, atk=0, action_cost=0. Для structure: action_cost=0. Для unit: hp≥1. Все названия и тексты — по-русски.`;

export async function llmCard(model: string, advice: Advice, rarity: Rarity, state: any, paw: PawTier = "none"): Promise<Card> {
  const allowed = allowedCardErasOf(state);
  const directive = { ordinary: "Обычная редкость: 1–2 заметные особенности.", uncommon: "Необычная редкость: 2–3 интересно сочетающиеся особенности.", rare: "Редкая карта: 3–5 значимых особенностей, смелое сочетание." }[rarity];
  // Технологии и культурное наследие — контекст, но не обязательное повторяющееся клише.
  const era = eraContextOf(state);
  const cultureName = state.player?.historicalCulture?.name || "";
  const oneLine = oneLineBoard(state);
  const brief = `Боевой замысел: «${advice.title}». ${advice.pitch}
Тип карты: ${advice.cardType}. ${directive}
Создай простую, исторически правдоподобную карту для текущего сражения. Контекст народа — необязательное вдохновение: варьируй источник образа, не привязывай каждую карту к одной культуре или её стереотипам.

Контекст цивилизации:
${contextOf(state)}

Разрешённый боевой тег карты: ${allowed.join(" или ")}. Историческая эпоха: «${era.label}»; технологии: ${era.tech || "не заданы"}. Короткая историческая справка должна называть реальный прототип этой эпохи, но культурное наследие можно упоминать только если это уместно.`;
  const system = CARD_SYSTEM + `\nРазрешённые эпохи сейчас: ${allowed.join(", ")}.` + (oneLine
    ? "\nСтол Каменного века — одна линия из трёх клеток. Только ближний бой, без построек и любых образов снарядов; дальние ключевые слова не используй."
    : "");
  const temperature = rarity === "rare" ? 1 : rarity === "uncommon" ? 0.9 : 0.75;

  // Жребий лапы обезьяны известен только кузнецу: игрок увидит плату уже на готовой карте.
  // Две переделки — чтобы брак модели не стоил игроку похода в кузницу: каждая следующая попытка
  // получает точный текст ошибки с посчитанными весами. Если и третья не прошла проверку, ковка
  // падает, а Forge возвращает славу через M.failCraft.
  let lastError: Error | null = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    const retry = lastError
      ? `\n\nПредыдущий ответ не прошёл проверку игры: ${lastError.message}\nИсправь ровно это${paw !== "none" ? `, пересчитай суммарный вес платы по таблице выше и попади в полосу${paw === "minor" ? ` 1…${PAW_MINOR_MAX}` : ` от ${PAW_MINOR_MAX + 1}`}` : ""} и верни ПОЛНЫЙ JSON карты заново.`
      : "";
    // Третья попытка принимает плату любой силы: величина — заказ модели, а не повод отменять ковку.
    const relaxBand = attempt === 2 && paw !== "none";
    const raw = await hydraChat({
      model, maxTokens: 3000, temperature, system,
      user: `${brief}\n\n${pawDirective(paw)}${retry}`,
    });
    try {
      const card = validateCard(raw, advice.cardType, allowed, rarity, paw, { relaxBand, oneLine });
      if (oneLine) {
        const badKeywords = oneLineViolation(card);
        if (badKeywords.length) {
          throw new Error(`На одной линии Каменного века не действуют ключевые слова ${badKeywords.join(", ")}; замени их на роль ближнего боя.`);
        }
        const badText = oneLineTextViolation(card);
        if (badText.length) {
          throw new Error(`Для Каменного века запрещён дальнобойный или анахроничный образ («${badText.join(", ")}»). Перепиши имя, текст, теги и справку как рукопашную карту без снарядов.`);
        }
      }
      card.rarity = rarity;
      card.id = "card-" + uid();
      // Справку подписываем эпохой и наследием из состояния: модель могла вернуть свои формулировки.
      if (card.history) card.history = { ...card.history, era: era.label, culture: cultureName };
      return card;
    } catch (e: any) {
      lastError = e instanceof Error ? e : new Error(String(e));
    }
  }
  throw lastError ?? new Error("Кузнец не смог выковать карту.");
}

/**
 * Что показывать игроку, когда ковка не удалась. Текст браковки платы пересказывает жребий
 * («жёсткая плата — это вес от 4»), а жребий до раскрытия карты — сюрприз, поэтому наружу
 * уходит нейтральная формулировка; технические детали остаются в консоли разработчика.
 */
export const CRAFT_REJECTED_TEXT = "Кузнец не совладал с заказом: карта не прошла проверку игры.";
export function craftErrorMessage(e: any): string {
  return e?.pawRejected ? CRAFT_REJECTED_TEXT : String(e?.message || "Кузнец не справился.");
}
