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
const TARGET_SIDES = ["friendly", "enemy", "controller", "opponent", "either"];
const TARGET_ENTITIES = ["unit", "structure", "permanent", "player"];
const TARGET_ZONES = ["front", "rear", "flank", "center", "any"];
const TARGET_RELATIONS = ["any", "self", "adjacent", "attack_target", "attack_target_row", "attack_target_column"];
const TARGET_SELECTS = ["first", "lowest_hp", "lowest_hp_ratio", "highest_attack", "attack_target", "choose", "all", "random"];
// Одна справка для промпта и диагностики: параметры находятся ВНУТРИ action, не рядом с ним.
const ACTION_SHAPES: Record<string, string> = {
  damage: '{"type":"damage","amount":1}',
  heal: '{"type":"heal","amount":1}',
  apply_status: '{"type":"apply_status","status":"suppress","amount":1,"turns":1}',
  destroy: '{"type":"destroy"}',
  modify_resource: '{"type":"modify_resource","resource":"energy","amount":-1}',
  modify_stat: '{"type":"modify_stat","stat":"attack","amount":-1,"turns":1}',
  modify_cost: '{"type":"modify_cost","cost":"action","amount":1,"turns":1}',
  draw: '{"type":"draw","amount":1}',
  discard: '{"type":"discard","amount":1,"choice":"choose"}',
  exchange: '{"type":"exchange","amount":1,"choice":"choose"}',
  scry: '{"type":"scry","amount":1}',
};

type EffectValidationError = Error & { validationIssues: string[] };
const validationDetails = (error: Error): string =>
  (error as Partial<EffectValidationError>).validationIssues?.join("\n") || error.message;

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

/** Собираем независимые ошибки всех эффектов; не возвращаем частично исправленную механику. */
export function validateEffects(raw: any): any[] {
  if (!Array.isArray(raw)) throw new Error("Поле effects должно быть массивом.");
  if (raw.length > 6) throw new Error("Не более 6 эффектов на карте.");
  const issues: string[] = [];
  const isObject = (value: any): boolean => Boolean(value && typeof value === "object" && !Array.isArray(value));
  const received = (value: any): string => value === undefined ? "отсутствует" : JSON.stringify(value);
  const effects = raw.map((e, idx) => {
    const fail = (field: string, message: string): void => {
      issues.push(`Эффект ${idx + 1}: effects[${idx}]${field ? "." + field : ""}: ${message}`);
    };
    const enumValue = (field: string, value: any, allowed: string[], message = "неизвестное значение"): boolean => {
      if (allowed.includes(value)) return true;
      fail(field, `${message}; допустимы ${allowed.join(", ")}; получено ${received(value)}.`);
      return false;
    };
    const integer = (field: string, value: any, min: number, max: number): number | undefined => {
      try { return int(value, min, max, field); }
      catch (error) { fail(field, `${(error as Error).message} Получено ${received(value)}.`); return undefined; }
    };
    if (!isObject(e)) { fail("", "ожидался объект эффекта."); return undefined; }
    enumValue("event", e.event, EVENTS, "неизвестное событие");
    let watch: any = undefined;
    if (e.event === "card_death" || e.event === "card_enter_play") {
      enumValue("watch.side", e.watch?.side, ["all", "friendly", "enemy"], "нужен watch.side");
      watch = { side: e.watch?.side };
    }

    const a = e.action;
    const action: any = {};
    // Неверный action не мешает проверить target и condition того же эффекта.
    if (!isObject(a)) {
      const example = typeof a === "string" && Object.prototype.hasOwnProperty.call(ACTION_SHAPES, a)
        ? ACTION_SHAPES[a] : ACTION_SHAPES.damage;
      fail("action", `ожидался объект действия с полем type, не строка/массив/null; получено ${received(a)}. Пример структуры: ${example}. Параметры действия должны быть внутри action; значения примера не подставляй автоматически.`);
    } else if (enumValue("action.type", a.type, ACTIONS, "неизвестное действие")) {
      action.type = a.type;
      if (["damage", "heal", "apply_status"].includes(a.type)) {
        action.amount = integer("action.amount", a.amount, 1, a.type === "damage" ? 12 : a.type === "apply_status" ? 5 : 8);
      }
      if (a.type === "apply_status") {
        enumValue("action.status", a.status, ["poison", "burn", "suppress"], "только poison, burn или suppress");
        action.status = a.status;
        action.turns = a.turns === undefined ? 2 : integer("action.turns", a.turns, 1, 3);
      }
      if (a.type === "modify_resource") {
        enumValue("action.resource", a.resource, ["energy", "drop", "action"], "resource: energy (drop/action — совместимые старые значения)");
        action.resource = "energy";
        action.amount = integer("action.amount", a.amount, -5, 5);
        if (action.amount === 0) fail("action.amount", "amount не может быть 0.");
      }
      if (a.type === "modify_stat") {
        enumValue("action.stat", a.stat, ["attack", "armor", "max_hp"], "stat: attack, armor или max_hp");
        action.stat = a.stat;
        action.amount = integer("action.amount", a.amount, -3, 3);
        if (action.amount === 0) fail("action.amount", "amount не может быть 0.");
        if (a.turns !== undefined) {
          if (a.stat === "max_hp") fail("action.turns", "max_hp не может быть временным.");
          action.turns = integer("action.turns", a.turns, 1, 3);
        }
      }
      if (a.type === "modify_cost") {
        action.cost = "action";
        action.amount = integer("action.amount", a.amount, -3, 3);
        if (action.amount === 0) fail("action.amount", "amount не может быть 0.");
        if (a.turns !== undefined) action.turns = integer("action.turns", a.turns, 1, 3);
      }
      if (["draw", "discard", "exchange", "scry"].includes(a.type)) {
        action.amount = integer("action.amount", a.amount, 1, 5);
        if (["discard", "exchange"].includes(a.type)) action.choice = ["choose", "highest_cost", "lowest_cost"].includes(a.choice) ? a.choice : "choose";
      }
    }
    // Ловим плоскую схему даже при action-объекте: иначе лишние поля молча теряются.
    for (const field of ["value", "amount", "turns", "status", "resource", "stat", "cost", "choice"]) {
      if (e[field] !== undefined) fail(field, field === "value"
        ? "value не является параметром эффекта. Для статуса используй action.status, для величины — action.amount."
        : `параметр действия должен находиться в action.${field}, не на уровне эффекта.`);
    }

    let t = e.target;
    if (!t && action.type === "modify_resource") t = { side: "controller", entity: "player" };
    const target: any = {};
    if (!isObject(t)) {
      fail("target", 'нужно задать target — объект с side и entity, например {"side":"enemy","entity":"unit","count":1}.');
    } else {
      enumValue("target.side", t.side, TARGET_SIDES, "target.side неизвестен");
      const validEntity = enumValue("target.entity", t.entity, TARGET_ENTITIES, "target.entity неизвестен");
      target.side = t.side; target.entity = t.entity;
      if (t.zone !== undefined) { enumValue("target.zone", t.zone, TARGET_ZONES, "zone неизвестна"); target.zone = t.zone; }
      if (t.relation !== undefined) { enumValue("target.relation", t.relation, TARGET_RELATIONS, "relation неизвестен"); target.relation = t.relation; }
      if (t.select !== undefined) {
        enumValue("target.select", t.select, TARGET_SELECTS, "select неизвестен (это способ выбора, количество задаётся target.count)");
        target.select = t.select;
      }
      const targetRelations = ["attack_target", "attack_target_row", "attack_target_column"];
      if ((target.select === "attack_target" || targetRelations.includes(target.relation)) && e.event !== "attack") fail("target", "attack_target только для события attack.");
      if ((target.relation === "adjacent" || targetRelations.includes(target.relation)) && target.entity === "player") fail("target.relation", "это отношение неприменимо к игроку.");
      if (e.event === "death" && target.relation === "self") fail("target.relation", "погибший источник не может быть целью.");
      target.count = t.count === undefined ? 1 : integer("target.count", t.count, 1, 3);
      if (validEntity) {
        if (action.type === "apply_status" && target.entity !== "unit") fail("target.entity", "статус только на отряд.");
        if (["modify_stat", "modify_cost", "destroy"].includes(action.type) && target.entity === "player") fail("target.entity", "действие требует цель на поле.");
        if (["modify_resource", "draw", "discard", "exchange", "scry"].includes(action.type) && target.entity !== "player") fail("target.entity", "действие требует цель player.");
      }
    }
    const out: any = { event: e.event, target, action };
    if (watch) out.watch = watch;
    if (e.condition !== undefined) {
      try { out.condition = validateCondition(e.condition); }
      catch (error) { fail("condition", (error as Error).message); }
    }
    return out;
  });
  // Короткая первая причина идёт в тост, полный список — в журнал и запрос переделки.
  if (issues.length) throw Object.assign(new Error(issues[0]), { validationIssues: issues });
  return effects;
}

// Бюджет кузницы — один общий потолок для полезной силы карты: параметры, ключевые слова и полезные
// эффекты расходуют одни и те же пункты. Энергия уже отражена в базовом бюджете: более дорогой вывод
// и более дорогая атака дают больше очков силы; эффекты, возвращающие/крадущие энергию, отдельно
// стоят как ключевое слово или эффект.
const RARITY_BUDGET_MULT: Record<string, number> = { ordinary: 1, uncommon: 2, rare: 4 };
export const PAW_BUDGET_MULT: Record<PawTier, number> = { none: 1, minor: 2, harsh: 3 };

/** Вес слова. Повторяемые/геометрические способности стоят дороже; числовые N оплачиваются отдельно. */
const KEYWORD_WEIGHT: Record<string, number> = {
  armor: 1, pierce: 1, ranged: 2, reach: 2, charge: 2, shieldwall: 2, wedge: 2, phalanx: 2,
  skirmish: 2, taunt: 2, poison: 2, burn: 2, heal: 2, rally: 2, fear: 2, morale: 1,
  siege: 2, sturdy: 2, holdground: 1, upkeep: 2, supply: 3, warcry: 2, loot: 2, raider: 3,
  harras: 2, exhaustenemy: 2, cleave: 2, blast: 2, sweep: 2, column: 2, vengeance: 2,
  relentless: 3, scavenger: 2, suppress: 2, unbreakable: 3, laststand: 2, flank: 2,
  screen: 2, command: 3, spotter: 2, dispersed: 1, entrenched: 1,
};
/** Слова, в которых каждый пункт N сверх первого — ещё один пункт силы. */
const KEYWORD_SCALES = new Set(["armor", "pierce", "heal", "suppress", "cleave", "vengeance", "blast", "sweep", "column"]);

export function keywordWeight(raw: string): number {
  const [kw, arg] = String(raw).toLowerCase().trim().split(":");
  const n = Math.max(1, parseInt(arg || "1", 10) || 1);
  return (KEYWORD_WEIGHT[kw] ?? 1) + (KEYWORD_SCALES.has(kw) ? n - 1 : 0);
}
export const keywordPower = (keywords: string[] = []): number => keywords.reduce((sum, k) => sum + keywordWeight(k), 0);

/** Обычный бюджет зависит от боевой цены: unit — вывод + атака, structure — вывод, spell — разовый вывод. */
export function cardPowerBaseBudget(dropCost: number, actionCost: number, cardType: string, oneLine = false): number {
  const drop = Math.max(1, Math.floor(Number(dropCost) || 1));
  const action = Math.max(0, Math.floor(Number(actionCost) || 0));
  let base: number;
  if (cardType === "structure") base = 2 * drop + 1;
  else if (cardType === "spell") base = oneLine ? Math.min(2, drop) : drop + 1;
  else base = 2 * drop + action + 1;
  return Math.max(2, base);
}

/**
 * Уровни редкости и риска перемножаются: необычная ×2, редкая ×4, небольшая лапа ×2,
 * жёсткая ×3. Значит, редкая карта с жёсткой платой получает ровно ×12 базового бюджета.
 */
export function cardPowerBudget(
  dropCost: number, actionCost: number, cardType: string, rarity: string,
  paw: PawTier = "none", oneLine = false,
): number {
  const rarityMult = RARITY_BUDGET_MULT[rarity] || RARITY_BUDGET_MULT.ordinary;
  const pawMult = PAW_BUDGET_MULT[paw] || PAW_BUDGET_MULT.none;
  return Math.round(cardPowerBaseBudget(dropCost, actionCost, cardType, oneLine) * rarityMult * pawMult);
}

/** Цена эффекта зависит от силы действия, числа целей и частоты срабатывания. */
function effectPower(effect: any, cardType = "unit"): number {
  return cardType === "spell" ? spellEffectPower(effect) : unitEffectPower(effect);
}

/** Сильные штрафы не считаются полезной силой карты: их цена уже отражена множителем лапы. */
const positiveEffectPower = (effects: any[] = [], cardType = "unit"): number => effects.reduce((sum, effect) => {
  if (isPenaltyEffect(effect)) return sum;
  try { return sum + effectPower(effect, cardType); } catch { return Number.POSITIVE_INFINITY; }
}, 0);

function usefulKeywordPower(card: { keywords?: string[]; monkey_paw?: string }): number {
  return (card.keywords || []).reduce((sum, raw) => {
    const key = keywordBase(raw);
    if (key === "upkeep" || (key === "morale" && card.monkey_paw)) return sum;
    return sum + keywordWeight(raw);
  }, 0);
}

/** Полная сила, учитываемая тем же бюджетом кузницы: характеристики + слова + полезные эффекты. */
export function cardPower(c: { atk?: number; hp?: number; keywords?: string[]; effects?: any[]; monkey_paw?: string; card_type?: string }): number {
  const atk = Math.max(0, Math.floor(c.atk || 0));
  const hp = Math.max(0, Math.floor(c.hp || 0));
  return atk * (c.card_type === "structure" ? 2 : 1) + hp
    + usefulKeywordPower(c) + positiveEffectPower(c.effects || [], c.card_type);
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

/**
 * Насколько часто срабатывает эффект. Раньше вес эффекта считался по одному срабатыванию, и
 * «1 урона в начале каждого хода» стоило столько же, сколько «1 урона при выходе», — хотя за бой
 * первое наносит в разы больше. Повторяемые триггеры дороже разовых, удар — вдвое дороже выхода.
 */
const EVENT_REPEAT: Record<string, number> = {
  enter_play: 1, death: 1, card_death: 1, card_enter_play: 1, attack: 2, damaged: 2, turn_start: 3, turn_end: 3,
};

/** Эффект-плата (он же минус карты): по своей стороне или в пользу врага — см. pawMarkers. */
const isPenaltyEffect = (effect: any): boolean => pawMarkers({ keywords: [], effects: [effect] }).length > 0;

/**
 * Вес эффекта отряда: числа самого действия, умноженные на частоту события. Две вещи запрещены
 * наглухо, потому что ломают бой при любом бюджете: мгновенное уничтожение ЧУЖОГО отряда (свой
 * отряд карта вправе принести в жертву — это плата лапы обезьяны) и урон по чужому вождю с порога
 * (вождя достигают прорывом столбца, а не картой за одну славу).
 */
function unitEffectPower(effect: any): number {
  const action = effect?.action;
  const target = effect?.target;
  if (!action || !target) return Number.POSITIVE_INFINITY;
  const mayHitOwn = target.side === "friendly" || target.side === "controller";
  if (!mayHitOwn && action.type === "destroy") return Number.POSITIVE_INFINITY;
  if (!mayHitOwn && target.entity === "player" && action.type === "damage") return Number.POSITIVE_INFINITY;
  try { return spellEffectPower(effect) * (EVENT_REPEAT[effect.event] ?? 2); } catch { return Number.POSITIVE_INFINITY; }
}

/** Жёсткий дополнительный потолок эффектов только для Каменного века: там действует одна линия и короткий бой. */
export const unitEffectBudget = (dropCost: number): number => Math.max(1, Math.floor(dropCost)) + 1;

/** Урезает числа эффекта под остаток бюджета: длительность и величина не обходят предел. */
function clampEffectToBudget(effect: any, budgetLeft: number): void {
  const mult = EVENT_REPEAT[effect.event] ?? 2;
  const room = Math.floor(budgetLeft / mult);
  const action = effect.action;
  if (["damage", "heal", "apply_status"].includes(action.type)) {
    action.amount = Math.min(action.amount, Math.max(0, room));
    return;
  }
  const perPoint = action.type === "modify_resource" || ["draw", "discard", "exchange", "scry"].includes(action.type) ? 2 : Math.max(1, action.turns || 1);
  const maxMagnitude = Math.floor(room / perPoint);
  if (maxMagnitude < 1) action.amount = 0;
  else action.amount = Math.sign(action.amount) * Math.min(Math.abs(action.amount), maxMagnitude);
}

/**
 * Эффекты отряда — часть общей силы, а не бесплатная добавка. Оставляем только простые, исполнимые
 * действия и расходуем на них рассчитанный остаток бюджета; число полезных действий растёт с этим
 * остатком, но не выше четырёх. Каменный век сохраняет отдельный предел drop_cost+1 и одну цель.
 */
function trimUnitEffects(effects: any[], allowance: number, stone: boolean): any[] {
  const simpleActions = new Set(["damage", "heal", "apply_status", "modify_stat", "modify_cost"]);
  const simpleEvents = new Set(["enter_play", "attack", "damaged", "death"]);
  const out: any[] = [];
  let spent = 0;
  let useful = 0;
  const maxUseful = stone ? 2 : Math.min(4, Math.max(2, Math.floor(allowance / 3)));

  for (const source of effects.slice(0, 6)) {
    if (simpleActions.has(source?.action?.type) === false) {
      // Плата бывает и сложнее (сброс карт, потеря энергии, статус на себя): она не «полезный» эффект,
      // а цена карты, и её вес движок считает отдельно (см. pawMarkers и pawBudgetBonus).
      if (isPenaltyEffect(source)) out.push(source);
      continue;
    }
    if (!simpleEvents.has(source?.event)) { if (isPenaltyEffect(source)) out.push(source); continue; }
    const penalty = isPenaltyEffect(source);
    // Плата не тратит бюджет эффектов: её вес уже оплачен надбавкой к силе карты.
    if (!penalty && (useful >= maxUseful || spent >= allowance)) continue;

    const effect = { ...source, target: { ...source.target }, action: { ...source.action } };
    const target = effect.target;
    const action = effect.action;
    if (stone) {
      if (target.select === "all") target.select = "first";
      target.count = 1;
      if (target.zone === "rear") target.zone = "front";
      if (target.relation === "attack_target_row" || target.relation === "attack_target_column") {
        // Площадное действие превращаем в обычный эффект по цели самого удара.
        target.relation = "attack_target";
        target.select = "attack_target";
      }
      // Длительные эффекты не должны обходить бюджет за счёт срока действия.
      if (action.type === "apply_status") action.turns = 1;
      if (action.type === "modify_cost") action.turns = 1;
      if (action.type === "modify_stat") {
        if (action.stat === "max_hp") delete action.turns;
        else action.turns = 1;
      }
    }

    if (penalty) { out.push(effect); continue; }
    clampEffectToBudget(effect, allowance - spent);
    const power = unitEffectPower(effect);
    if (!Number.isFinite(power) || power < 1 || power > allowance - spent) continue;
    out.push(effect);
    spent += power;
    useful++;
  }
  return out;
}

function validateSpellPower(card: Card, rarity: Rarity, oneLine = false, paw: PawTier = "none"): void {
  const useful = card.effects.filter((effect) => !isPenaltyEffect(effect));
  const penalties = card.effects.filter((effect) => isPenaltyEffect(effect));
  if (!useful.length) throw new Error("Манёвр должен давать полезный тактический эффект: плата не может быть единственным действием карты.");
  if (oneLine) {
    const expectedCount = paw === "none" ? 1 : 2;
    if (card.effects.length !== expectedCount || useful.length !== 1 || (paw !== "none" && penalties.length !== 1)) {
      throw new Error(paw === "none"
        ? "Манёвр Каменного века должен иметь ровно один полезный эффект."
        : "Манёвр Каменного века должен иметь один полезный эффект и один эффект-плату.");
    }
    if (card.effects.some((effect) => (effect.target.count || 1) !== 1 || effect.target.select === "all")) {
      throw new Error("Манёвр Каменного века может затронуть только одну цель каждым эффектом.");
    }
  } else if (card.effects.length > 2) {
    throw new Error("У манёвра не больше двух эффектов — не складывай несколько сильных действий.");
  }
  for (const effect of card.effects) {
    if (effect.event !== "enter_play") throw new Error("Манёвр может использовать только enter_play.");
    if (effect.target.select === "all") throw new Error("Манёвр не может целиться сразу во все подходящие отряды.");
    if ((effect.target.count || 1) > 2) throw new Error("Манёвр может затронуть не более двух целей.");
  }
  const power = useful.reduce((sum, effect) => sum + spellEffectPower(effect), 0);
  const budget = cardPowerBudget(card.drop_cost, 0, "spell", rarity, paw, oneLine);
  const room = budget - usefulKeywordPower(card);
  // Каменный век сохраняет силу чистого манёвра ≤2; заказанная плата даёт небольшое расширение до 4,
  // но не снимает ограничение одной цели и не открывает area/target-all эффекты.
  const eraCap = oneLine ? (paw === "none" ? 2 : 4) : budget;
  const limit = Math.min(room, eraCap);
  if (power > limit) throw new Error(`Полезные эффекты и ключевые слова манёвра превышают бюджет: эффект ${power}, остаток ${limit}. Уменьши силу действия или число целей.`);
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

/** Небольшая плата — вес 1…3; жёсткая — 4…8, чтобы штраф не делал карту непригодной. */
export const PAW_MINOR_MAX = 3;
export const PAW_HARSH_MAX = 8;

const isOwnSide = (side: string) => side === "friendly" || side === "controller";
const isFoeSide = (side: string) => side === "enemy" || side === "opponent";

/**
 * Настоящие минусы карты: эффекты против своей стороны и своего вождя, усиление врага,
 * а также ключевые слова-обременения. Возвращает и человекочитаемое описание, и вес.
 */
function penaltyActionWeight(action: any): number {
  const amount = Math.abs(Number(action?.amount) || 0);
  switch (action?.type) {
    case "damage": case "heal": return amount;
    case "apply_status": return amount + Math.max(0, (Number(action.turns) || 1) - 1);
    case "destroy": return 4;
    case "modify_stat": case "modify_cost":
      return amount * (Number(action.turns) || 1) + (action.turns ? 0 : 1);
    case "modify_resource": return amount * 2;
    case "discard": case "exchange": case "draw": case "scry": return amount * 2;
    default: return 0;
  }
}

function penaltyEffectWeight(effect: any): number {
  const target = effect?.target || {};
  const count = target.select === "all" ? 3 : Math.max(1, Math.min(3, Math.floor(Number(target.count) || 1)));
  const repeat = EVENT_REPEAT[effect?.event] ?? 2;
  return penaltyActionWeight(effect?.action) * count * repeat;
}

/**
 * Настоящие минусы карты: эффекты против своей стороны и своего вождя, усиление врага,
 * а также ключевые слова-обременения. Вес учитывает силу действия, число целей и повторяемость.
 */
export function pawMarkers(c: Pick<Card, "keywords" | "effects">, paw: PawTier = "none"): { text: string; weight: number }[] {
  const out: { text: string; weight: number }[] = [];
  for (const raw of c.keywords || []) {
    const key = String(raw).split(":")[0];
    // upkeep — чистое обременение, он считается всегда. morale на обычных картах — часть
    // словаря; в лапу он идёт только если игроку выпал штраф.
    if (key === "upkeep") out.push({ text: "содержание: без соседей теряет 1 HP за ход", weight: 2 });
    else if (key === "morale" && paw !== "none") out.push({ text: "мораль: при ранах может бежать с поля", weight: 2 });
  }
  for (const e of c.effects || []) {
    const t = e?.target, a = e?.action;
    if (!t || !a) continue;
    const own = isOwnSide(t.side), foe = isFoeSide(t.side);
    const amount = Math.abs(Number(a.amount) || 0);
    const who = own ? "своим" : "врагу";
    let text = "";
    if (own && a.type === "damage") text = `${amount} урона ${who}`;
    else if (own && a.type === "apply_status") text = `${a.status === "burn" ? "огонь" : a.status === "suppress" ? "подавление" : "яд"} на ${who} (${a.turns || 2} хода)`;
    else if (own && a.type === "destroy") text = "уничтожает собственный отряд";
    else if (own && a.type === "modify_stat" && Number(a.amount) < 0) text = `${a.amount} к «${a.stat}» ${who}`;
    else if (own && a.type === "modify_cost" && Number(a.amount) > 0) text = `+${amount} к цене атаки ${who}`;
    else if (own && a.type === "modify_resource" && Number(a.amount) < 0) text = `${a.amount} энергии у вождя`;
    else if (own && (a.type === "discard" || a.type === "exchange")) text = `${a.type === "discard" ? "сброс" : "обмен"} ${amount} карт из руки`;
    else if (foe && a.type === "heal") text = `лечит врага на ${amount}`;
    else if (foe && a.type === "modify_stat" && Number(a.amount) > 0) text = `+${amount} к «${a.stat}» врага`;
    else if (foe && a.type === "modify_cost" && Number(a.amount) < 0) text = `${a.amount} к цене атаки врага`;
    else if (foe && a.type === "modify_resource" && Number(a.amount) > 0) text = `+${amount} энергии врагу`;
    else if (foe && a.type === "draw") text = `враг добирает ${amount} карт`;
    if (!text) continue;
    const targets = t.select === "all" ? "по всем целям" : (t.count || 1) > 1 ? `по ${t.count} целям` : "";
    const repeat = (EVENT_REPEAT[e.event] ?? 2) > 1 ? `, повторяемость ×${EVENT_REPEAT[e.event] ?? 2}` : "";
    out.push({ text: [text, targets].filter(Boolean).join(" ") + repeat, weight: penaltyEffectWeight(e) });
  }
  return out;
}

/** Суммарный вес платы: валидирует размер реального недостатка; бюджет растёт по категории, не по числу веса. */
export const pawSeverity = (c: Pick<Card, "keywords" | "effects">, paw: PawTier = "none"): number =>
  pawMarkers(c, paw).reduce((sum, m) => sum + m.weight, 0);

/** Таблица весов для промпта: модель обязана попасть в заказанный диапазон, а не угадать его. */
const PAW_WEIGHT_TABLE = `Вес платы движок считает по карте сам:
- сначала оцени действие: damage/heal — amount; apply_status — amount + (turns − 1); destroy своего отряда — 4;
- modify_stat/modify_cost — |amount| × turns (навсегда: ×1 и ещё +1); modify_resource — 2 × |amount|;
- discard/exchange/draw/scry — 2 × amount;
- затем умножь на число целей (target.count) и частоту: enter_play/death — ×1, attack/damaged — ×2, turn_start/turn_end — ×3;
- select=all для платы запрещён; не задавай больше двух целей. upkeep и morale — фиксированный вес 2.
Небольшая плата имеет суммарный вес 1…${PAW_MINOR_MAX}, жёсткая — 4…${PAW_HARSH_MAX}. Вес определяет только категорию реального недостатка; бюджет растёт множителем уровня риска, а не прибавкой веса.`;

function pawDirective(paw: PawTier): string {
  if (paw === "none") {
    return `ЛАПА ОБЕЗЬЯНЫ — НА ЭТОТ РАЗ ЧИСТО. Кузнец не берёт платы: monkey_paw = "", никаких эффектов против своей стороны и своего вождя, никакого лечения и усиления врага, ключевых слов upkeep и morale нет. Суммарный вес платы обязан быть 0.`;
  }
  const band = paw === "minor"
    ? `НЕБОЛЬШАЯ ПЛАТА: суммарный вес от 1 до ${PAW_MINOR_MAX} — один скромный минус.`
    : `ЖЁСТКАЯ ПЛАТА: суммарный вес от ${PAW_MINOR_MAX + 1} до ${PAW_HARSH_MAX} — карта сильная, но рискованная; не делай штраф катастрофическим.`;
  const examples = paw === "minor"
    ? `Готовые примеры небольшой платы:
- вес 2: {"event":"enter_play","target":{"side":"controller","entity":"player"},"action":{"type":"modify_resource","resource":"energy","amount":-1}} — вождь теряет 1 энергию;
- вес 2: ключевое слово upkeep — без соседей отряд теряет 1 HP за ход;
- вес 2: {"event":"enter_play","target":{"side":"friendly","entity":"unit","relation":"adjacent"},"action":{"type":"damage","amount":2}} — отряд толкает своих же;
- вес 3: {"event":"turn_start","target":{"side":"friendly","entity":"unit","relation":"self"},"action":{"type":"damage","amount":1}} — небольшой повторный урон своему бойцу.`
    : `Готовые примеры жёсткой платы:
- вес 4: {"event":"enter_play","target":{"side":"controller","entity":"player"},"action":{"type":"discard","amount":2,"choice":"highest_cost"}} — вождь сбрасывает две лучшие карты;
- вес 4: {"event":"enter_play","target":{"side":"friendly","entity":"unit","relation":"self"},"action":{"type":"destroy"}} — отряд уничтожает себя при выходе;
- вес 6: {"event":"turn_start","target":{"side":"friendly","entity":"unit","relation":"self"},"action":{"type":"damage","amount":2}} — повторный урон своему бойцу;
- вес 8: {"event":"enter_play","target":{"side":"controller","entity":"player"},"action":{"type":"discard","amount":4,"choice":"highest_cost"}} — предельная, но всё ещё конечная жертва.`;
  return `ЛАПА ОБЕЗЬЯНЫ ОБЯЗАТЕЛЬНА. ${band}
Плату придумываешь ты, но выражена она должна быть НАСТОЯЩЕЙ МЕХАНИКОЙ из разрешённого словаря: эффектами в effects[] против своей стороны/своего вождя (урон, яд, огонь, ухудшение характеристики, удорожание атаки, потеря энергии, сброс карт, уничтожение своего отряда) либо усилением врага, и/или ключевыми словами upkeep, morale. Текст в monkey_paw (до 200 знаков) называет плату по-человечески и точно совпадает с механикой — никаких штрафов, которых нет в effects[] и keywords[].
${PAW_WEIGHT_TABLE}
${examples}
Перед ответом сложи веса своих минусов и попади в полосу ${paw === "minor" ? `1…${PAW_MINOR_MAX}` : `${PAW_MINOR_MAX + 1}…${PAW_HARSH_MAX}`}: если вышло тяжелее — уменьши число целей или силу штрафа.
Плату платит владелец карты: цель таких эффектов — side friendly или controller (для вражеской выгоды — enemy/opponent). Плата не должна делать карту бесполезной: обязательно создай сильную полезную боевую часть. Полезная сила оштрафованной карты должна быть не меньше бюджета такой же чистой карты той же редкости.
ОПИСАНИЕ И СПРАВКА ОБЪЯСНЯЮТ ПЛАТУ: description показывает, чем отряд расплачивается в бою, а history.text — откуда эта цена взялась у народа (обычай, долг обряда, скверное оружие, голод, клятва, болезнь, плата жрецам). Карта, у которой плата не обоснована текстом, не принимается.`;
}

/** Ошибка браковки платы: движок помечает её, чтобы UI не показывал игроку сам жребий. */
const pawError = (message: string) => Object.assign(new Error(message), { pawRejected: true });

/** Валидатор исполняет бюджет и штраф жёстко на каждой попытке; неправильная категория платы не получает множитель. */
export function validateCard(raw: any, expectedType: CardType, allowedEras: string[], rarity: Rarity = "ordinary", paw: PawTier = "none", opts: { oneLine?: boolean } = {}): Card {
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
  if (c.card_type === "structure") {
    c.atk = Math.min(4, Math.max(0, c.atk));
    c.action_cost = 0;
    if (c.hp < 1) throw new Error("У постройки нужно хотя бы 1 HP.");
  }
  if (c.card_type === "unit") {
    if (c.hp < 1) throw new Error("У отряда должно быть хотя бы 1 HP.");
    if (!opts.oneLine && c.action_cost < 1) throw new Error("Атака отряда не бывает бесплатной: action_cost минимум 1.");
    // Цена выше глобального потолка энергии не давала бы атаковать; stone выше отдельно зажимается до 2.
    c.action_cost = opts.oneLine ? Math.min(2, Math.max(1, c.action_cost)) : Math.min(8, c.action_cost);
  }
  if (typeof c.description !== "string" || !c.description.trim()) throw new Error("Нужно описание карты.");
  c.description = c.description.slice(0, 400);

  const rawKeywords: string[] = Array.isArray(c.keywords) ? c.keywords : [];
  c.keywords = rawKeywords
    .map((rawKeyword) => {
      const normalized = String(rawKeyword).toLowerCase().trim();
      const [key, rawN] = normalized.split(":");
      if (!SUPPORTED_KEYWORDS.has(key)) return "";
      if (rawN === undefined || !KEYWORD_SCALES.has(key)) return key;
      const n = Number(rawN);
      const max = key === "blast" || key === "sweep" || key === "column" ? AREA_MAX_N : 3;
      if (!Number.isInteger(n) || n < 1 || n > max) {
        throw new Error(`Ключевое слово ${key} принимает N от 1 до ${max}.`);
      }
      return `${key}:${n}`;
    })
    .filter(Boolean)
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

  // Площадь — одна геометрия на карту, N не выше эрового потолка, удар не бесплатный.
  const areaKws = c.keywords.filter((k: string) => AREA_KEYWORDS.includes(k.split(":")[0]));
  if (areaKws.length > 1) throw new Error("Карте хватает одного площадного слова: «Фугас», «Картечь» и «Обстрел столбца» не складываются.");
  for (const rawKeyword of areaKws) {
    const [kw, ns] = String(rawKeyword).split(":");
    const n = parseInt(ns || "1", 10);
    if (!Number.isInteger(n) || n < 1 || n > AREA_MAX_N) throw new Error(`Площадное слово ${kw} принимает N от 1 до ${AREA_MAX_N}.`);
    if (c.card_type !== "unit") throw new Error("Площадные слова доступны только отрядам.");
    if (c.action_cost < 1) throw new Error("Площадной удар не бывает бесплатным: action_cost минимум 1.");
    if (rarity === "ordinary") throw new Error("Площадной удар — не рядовое свойство: карта с ним должна быть не ниже необычной.");
  }

  // Сначала проверяем и нормализуем механику, сохраняя штрафы нетронутыми.
  if (c.card_type === "unit") {
    if (opts.oneLine) {
      const candidates = Array.isArray(c.effects) ? c.effects.slice(0, 6) : [];
      const validated: any[] = [];
      for (const rawEffect of candidates) {
        try { validated.push(...validateEffects([rawEffect])); } catch { /* снимаем только этот эффект */ }
      }
      c.effects = validated;
    } else {
      c.effects = validateEffects(Array.isArray(c.effects) ? c.effects : []);
    }
  } else {
    c.effects = validateEffects(Array.isArray(c.effects) ? c.effects : []);
  }
  if (c.card_type === "spell") {
    c.effects = c.effects.filter((effect: any) => effect.event === "enter_play");
    if (!c.effects.length) throw new Error("Для манёвра нужен хотя бы один эффект enter_play.");
  }

  c.tags = Array.isArray(c.tags) ? c.tags.slice(0, 3).map((t: any) => String(t).slice(0, 40)) : [];
  c.abilities = [];
  c.emoji = typeof c.emoji === "string" && c.emoji.trim() ? c.emoji.slice(0, 8) : "⚒️";
  c.monkey_paw = typeof c.monkey_paw === "string" ? c.monkey_paw.trim().slice(0, 200) : "";
  c.history = sanitizeHistory(c.history);

  // Категория штрафа строго соответствует реальному весу; размывать её на последней попытке нельзя,
  // иначе карта получила бы множитель harsh за фактически minor-плату.
  const markers = pawMarkers(c as Card, paw);
  const severity = markers.reduce((sum, marker) => sum + marker.weight, 0);
  const markerText = markers.map((marker) => `${marker.text} (вес ${marker.weight})`).join("; ");
  if (paw === "none") {
    if (severity > 0) throw pawError(`Заказана чистая карта, но кузнец добавил плату: ${markerText}.`);
    if (c.monkey_paw) throw pawError("У чистой карты не должно быть текста платы (monkey_paw).");
  } else {
    if (severity < 1) throw pawError(`Лапа обезьяны (${PAW_LABELS[paw]}) требует настоящую плату: эффект против своей стороны или ключевого слова, а не только текст.`);
    if (paw === "minor" && severity > PAW_MINOR_MAX) throw pawError(`Небольшая плата — это вес 1…${PAW_MINOR_MAX}, а кузнец дал ${severity}: ${markerText}.`);
    if (paw === "harsh" && (severity <= PAW_MINOR_MAX || severity > PAW_HARSH_MAX)) {
      throw pawError(`Жёсткая плата — это вес ${PAW_MINOR_MAX + 1}…${PAW_HARSH_MAX}, а кузнец дал ${severity}: ${markerText}.`);
    }
    const penaltyEffects = c.effects.filter((effect: any) => isPenaltyEffect(effect));
    if (penaltyEffects.some((effect: any) => effect.target.select === "all" || (effect.target.count || 1) > 2)) {
      throw pawError("Плата не может задевать всех сразу или больше двух целей: её цена должна оставаться предсказуемой.");
    }
    if (c.monkey_paw.length < 20) throw pawError("Текст платы (monkey_paw) слишком короткий: назовите её по-человечески и точно как в механике.");
    if (!c.history || (c.history.text || "").length < 40) throw pawError("Справка карты обязана объяснять, откуда народ платит эту цену (history.text).");
  }

  const budget = cardPowerBudget(c.drop_cost, c.action_cost, c.card_type, rarity, paw, Boolean(opts.oneLine));
  if (c.card_type === "spell") {
    validateSpellPower(c as Card, rarity, Boolean(opts.oneLine), paw);
  } else if (c.card_type === "unit") {
    // Эффекты отряда расходуют остаток того же бюджета, что слова и параметры. Каменный век сохраняет
    // собственный предел эффектов drop_cost+1 и геометрию одной линии.
    const effectAllowance = Math.max(0, budget - 1);
    const stoneEffectCap = Math.max(0, budget - 2 - usefulKeywordPower(c)); // reserve ATK 1 + HP 1 on the melee line
    const eraEffectCap = opts.oneLine ? Math.min(unitEffectBudget(c.drop_cost), stoneEffectCap) : effectAllowance;
    c.effects = trimUnitEffects(c.effects, Math.min(effectAllowance, eraEffectCap), Boolean(opts.oneLine));
  } else {
    // У построек нет бесплатного кармана эффектов: их периодические эффекты входят в общую силу.
    const usefulEffects = positiveEffectPower(c.effects, c.card_type);
    if (usefulEffects > Math.max(0, budget - 1)) {
      throw new Error(`Эффекты постройки весят ${usefulEffects}, а после минимального HP остаётся ${Math.max(0, budget - 1)}. Уменьши эффекты.`);
    }
  }

  if (c.card_type !== "spell") {
    const effectPowerSpent = positiveEffectPower(c.effects, c.card_type);
    const minimumStats = 1; // unit и structure обязаны пережить проверку с хотя бы 1 HP.
    const keywordPowerSpent = () => usefulKeywordPower(c);
    // Сначала оставляем полезные эффекты и ключевые слова, затем подгоняем ATK/HP под остаток.
    while (keywordPowerSpent() + effectPowerSpent + minimumStats > budget) {
      let worst = -1;
      for (let i = 0; i < c.keywords.length; i++) {
        const key = keywordBase(c.keywords[i]);
        if (key === "upkeep" || (key === "morale" && c.monkey_paw)) continue;
        if (worst < 0 || keywordWeight(c.keywords[i]) >= keywordWeight(c.keywords[worst])) worst = i;
      }
      if (worst < 0) break;
      c.keywords = c.keywords.filter((_: string, i: number) => i !== worst);
    }
    const room = Math.max(1, budget - keywordPowerSpent() - effectPowerSpent);
    const atkWeight = c.card_type === "structure" ? 2 : 1;
    const origAtk = c.atk;
    const origHp = c.hp;
    const force = () => c.atk * atkWeight + c.hp;
    if (force() > room) {
      if (c.card_type === "structure") {
        // Автоматическая атака постройки повторяется каждый ход и потому стоит вдвое дороже.
        while (force() > room && c.hp > 1) c.hp--;
        while (force() > room && c.atk > 0) c.atk--;
      } else {
        const scale = room / Math.max(1, force());
        // Каменный отряд не падает до ATK 0: иначе поздний клэмп поднимет его до 1 уже за бюджетом.
        c.atk = Math.max(opts.oneLine ? 1 : 0, Math.floor(origAtk * scale));
        c.hp = Math.max(1, Math.round(origHp * scale));
        while (force() > room && c.hp > 1) c.hp--;
        while (force() > room && c.atk > 0) c.atk--;
      }
      // Не теряем остаток от округления, когда карта исходно была сильнее лимита.
      while (c.atk < origAtk && (c.atk + 1) * atkWeight + c.hp <= room) c.atk++;
      while (c.hp < origHp && force() + 1 <= room) c.hp++;
    }
  }

  // Историческая экономика и геометрия важнее мультипликатора: Каменный век остаётся рукопашным
  // и не получает характеристики выше ATK 3 / HP 5 даже для необычной карты с лапой.
  if (opts.oneLine && c.card_type === "unit") {
    c.atk = Math.max(1, Math.min(3, c.atk));
    c.hp = Math.max(1, Math.min(5, c.hp));
  }

  const finalPower = cardPower(c);
  if (finalPower > budget) throw new Error(`Сила карты ${finalPower} превышает общий бюджет ${budget}. Уменьши характеристики, слова или эффекты.`);
  if ((rarity !== "ordinary" && !opts.oneLine) || paw !== "none") {
    const cleanBudget = cardPowerBudget(c.drop_cost, c.action_cost, c.card_type, rarity, "none", Boolean(opts.oneLine));
    const stoneCap = opts.oneLine ? (c.card_type === "spell" ? 2 : 14) : Number.POSITIVE_INFINITY;
    const minimumUsefulPower = Math.min(cleanBudget, stoneCap);
    if (finalPower < minimumUsefulPower) {
      throw new Error(`Карта использует полезную силу ${finalPower}, но для ${RARITY_INFO[rarity].label.toLowerCase()} редкости нужен минимум ${minimumUsefulPower} — сила чистой карты той же цены.`);
    }
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

/* ---------- Журнал ответов ИИ ----------
   Игрок видит короткую причину в тосте, а дословный ответ модели по каждой неудачной попытке выводится
   на экране кузницы (панель «Журнал ответов ИИ»): до извлечения {…}, до JSON.parse и до проверки правил.
   Отчёты собираются здесь и уходят наверх в error.journal, поэтому журнал показывает всю ковку целиком,
   а не только последнюю попытку. Успешные попытки в журнал не попадают.
   Панель видна игроку: в дословном ответе может быть текст лапы обезьяны, который до раскрытия карты
   остаётся сюрпризом. Прятать её до релиза или за режимом отладки — отдельное решение. */

/** Этап, на котором сломалась попытка: запрос до модели, разбор ответа или правила игры. */
type LogPhase = "запрос" | "разбор" | "проверка";

/** Что известно о неудачном ответе модели для журнала. */
interface ModelDump {
  /** Что показываем дословно: content модели, тело HTTP-ответа целиком или ничего. */
  source: "content" | "body" | "none";
  text: string;
  status?: number;
  finishReason?: string;
  usage?: unknown;
  model?: string;
}

/** Ошибка обращения к модели: прежний текст для игрока плюс дамп для журнала. */
const modelFailure = (message: string, phase: LogPhase, dump: ModelDump) =>
  Object.assign(new Error(message), { modelPhase: phase, modelDump: dump });

/** Где в ковке случилась попытка — для строки заголовка в журнале. */
interface AttemptContext {
  stage: "Карта" | "Замыслы";
  attempt: number;
  attempts: number;
  model: string;
  /** Параметры заказа одной строкой: тип карты, редкость, лапа или типы замыслов. */
  details: string;
}

/** Отчёт об одной неудачной попытке: заголовок, причина, метаданные и ответ модели дословно. */
function attemptReport(ctx: AttemptContext, message: string, phase: LogPhase, dump: ModelDump | undefined, final: boolean): string {
  const model = dump?.model && dump.model !== ctx.model ? `${ctx.model} (ответила ${dump.model})` : ctx.model;
  const meta = [
    dump?.status !== undefined && `HTTP ${dump.status}`,
    dump?.finishReason && `finish_reason: ${dump.finishReason}`,
    dump?.usage != null && `usage: ${JSON.stringify(dump.usage)}`,
  ].filter(Boolean);
  const lines = [
    `${ctx.stage} · попытка ${ctx.attempt} из ${ctx.attempts} · этап: ${phase} · исход: ${final ? "провал" : "переделка"}`,
    `Причина: ${message}`,
    `модель: ${model} · ${ctx.details}`,
  ];
  if (meta.length) lines.push(meta.join(" · "));
  if (dump?.finishReason === "length") lines.push("Ответ обрезан по max_tokens: JSON, скорее всего, не закрыт.");
  if (!dump || dump.source === "none") {
    lines.push("Дословного ответа нет: запрос не дошёл до модели или тело ответа не JSON.");
  } else {
    lines.push(dump.source === "content" ? "--- ответ модели дословно (choices[0].message.content) ---" : "--- тело ответа дословно ---", dump.text, "--- конец ---");
  }
  return lines.join("\n");
}

/** Ошибка несёт весь журнал ковки: все неудачные попытки подряд, в порядке их появления. */
const withJournal = (error: any, journal: string[]) => Object.assign(error, { journal: journal.join("\n\n") });

interface HydraOpts {
  model: string; system: string; user: string; temperature: number; maxTokens: number;
  /** Только последняя неудачная попытка: не раздуваем историю, но даём конкретный объект для ремонта. */
  repair?: { response: string; feedback: string };
}

/** Разобранный JSON и дословный ответ, из которого он извлечён: второе нужно журналу, если правила игры не пройдут. */
interface ModelReply { json: any; dump: ModelDump }

/** Один запрос к модели. Неудача запроса или разбора по-прежнему не переделывается, но её отчёт попадает в журнал. */
async function askModel(ctx: AttemptContext, opts: HydraOpts, journal: string[]): Promise<ModelReply> {
  try {
    return await hydraChat(opts);
  } catch (e: any) {
    journal.push(attemptReport(ctx, String(e?.message ?? e), e?.modelPhase ?? "запрос", e?.modelDump, true));
    throw withJournal(e, journal);
  }
}

async function hydraChat(opts: HydraOpts): Promise<ModelReply> {
  const resp = await fetch(HYDRA_PROXY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: opts.model,
      messages: [
        { role: "system", content: opts.system }, { role: "user", content: opts.user },
        ...(opts.repair ? [
          { role: "assistant", content: opts.repair.response },
          { role: "user", content: opts.repair.feedback },
        ] : []),
      ],
      temperature: opts.temperature, max_tokens: opts.maxTokens, response_format: { type: "json_object" },
    }),
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => null);
    throw modelFailure(err?.error?.message || `HTTP ${resp.status}`, "запрос", err === null
      ? { source: "none", text: "", status: resp.status }
      : { source: "body", text: JSON.stringify(err, null, 2), status: resp.status });
  }
  const data = await resp.json().catch((e: any) => {
    throw modelFailure(String(e?.message ?? e), "разбор", { source: "none", text: "", status: resp.status });
  });
  const choice = data?.choices?.[0];
  const meta = {
    status: resp.status,
    finishReason: typeof choice?.finish_reason === "string" ? choice.finish_reason : undefined,
    usage: data?.usage,
    model: typeof data?.model === "string" ? data.model : undefined,
  };
  if (data?.error) throw modelFailure(data.error.message || "Ошибка API", "запрос", { ...meta, source: "body", text: JSON.stringify(data, null, 2) });
  const content = choice?.message?.content;
  if (typeof content !== "string" || !content) {
    throw modelFailure("Модель не вернула JSON.", "разбор", { ...meta, source: "body", text: JSON.stringify(data, null, 2) });
  }
  const dump: ModelDump = { ...meta, source: "content", text: content };
  const m = content.match(/\{[\s\S]*\}/);
  if (!m) throw modelFailure("Модель не вернула JSON.", "разбор", dump);
  try {
    return { json: JSON.parse(m[0]), dump };
  } catch (e: any) {
    throw modelFailure(String(e?.message ?? e), "разбор", dump);
  }
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
  const user = `Нужны ${cardTypes.length} боевые идеи для колоды, ровно по одному каждого типа: ${typeList}. Контекст ниже — обязательное вдохновение; разнообразь образы отталкиваясь от культуры народа и эпохи\n\nКонтекст цивилизации:\n${contextOf(state)}\nРазрешённые эпохи карт: ${era}.${tableRule}`;
  const system = `Ты — военный советник ККИ игры Infinite Forge. Придумывай идеи для боя. Вывод карты и атака расходуют общий запас энергии; на поле есть авангард и тыл.\nunit — правдоподобный отряд с ясной тактической ролью. spell — немедленный манёвр (аналог волшебства или моментальных заклинаний MTG). structure — только для стола с тылом: боевая постройка стоит в последнем ряду, action_cost=0, hp≥1; atk от 0 до 4: 0 — стена (не стреляет), 1 и выше — каждый ход обстреливает ближайшего врага или вождя, урон равен atk, броня его гасит, ответа нет. Не предлагай структуру без роли.\nИстория важна! Выбирай разные исторические детали и только реально доступные технологии указанной эпохи. Никакой магии, фэнтези и анахронизмов. Не предлагай сельское хозяйство, ремесло, торговлю, погребения, доход или долгосрочное развитие.\n${oneLine ? "В Каменном веке unit — только рукопашный: не лучник, не пращник и не метатель; оружие дальнего боя и его слова запрещены." : ""}\nОтвет строго JSON: {\"choices\":[{\"card_type\":\"${typeUnion}\",\"title\":\"короткое название\",\"pitch\":\"тактическая роль\"}]}. Верни ровно ${cardTypes.length} разных идей — по одной каждого разрешённого типа. Язык — русский.`;
  // Советник ошибается редко, но раньше одна осечка (не тот тип, дубликат, лишняя идея) оставляла
  // игрока без замыслов вовсе: у кузнеца переделки были, у советника — нет. Теперь одна переделка есть
  // и здесь, с точным текстом ошибки.
  const journal: string[] = [];
  let lastError: Error | null = null;
  for (let attempt = 0; attempt < 2; attempt++) {
    const ctx: AttemptContext = { stage: "Замыслы", attempt: attempt + 1, attempts: 2, model, details: `типы ${cardTypes.join("|")}` };
    const reply = await askModel(ctx, { model, temperature: 0.85, maxTokens: 650, system, user: lastError ? `${user}\n\nПрошлый ответ не подошёл: ${lastError.message} Верни полный JSON заново.` : user }, journal);
    try {
      return parseAdvice(reply.json?.choices, cardTypes);
    } catch (e: any) {
      lastError = e instanceof Error ? e : new Error(String(e));
      journal.push(attemptReport(ctx, lastError.message, "проверка", reply.dump, attempt === 1));
    }
  }
  throw withJournal(lastError ?? new Error("Советник не справился."), journal);
}

function parseAdvice(list: any, cardTypes: CardType[]): Advice[] {
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
ЭПОХА: боевой тег карты — только ancient или bronze и не является календарной датой, но он бьёт по урону: бронзовая карта наносит каменной на 1 больше, а каменная по бронзовой — на 1 меньше. Помечай карту ancient, только если её прототип действительно каменного века; всё, что из мира металла, — bronze. Исторические предметы, названия, роли и справка должны соответствовать ЭПОХЕ КАМПАНИИ и реальным технологиям из контекста. Не переносить оружие и институты из будущей эпохи в прошлую.
КАМЕННЫЙ ВЕК: одна линия, только ближний бой; unit HP 1–5, ATK 1–3, drop_cost/action_cost 1–2; structure запрещена. Запрещены ranged, skirmish, reach, screen, area-слова и любые образы луков, пращ, стрел, метательных машин/снарядов (включая стреломёты, имя, текст, теги и history). Максимум 2 ключевых слова и 1 усилитель атаки. У unit — максимум 2 простых эффекта суммарной силой drop_cost+1; редкость/лапа этот предел не меняют. Манёвр Каменного века: один полезный enter_play-эффект на одну цель (плюс один эффект-плата); польза ≤2 clean / ≤4 paid.
БЮДЖЕТ: сила unit = ATK+HP+полезные слова+эффекты; structure = 2×ATK+HP+слова+эффекты (автоатака); spell = слова+полезные эффекты. База: unit 2×drop+action+1; structure 2×drop+1; spell drop+1 (Каменный век: min(2,drop)). Умножь на rarity ordinary ×1 / uncommon ×2 / rare ×4 и независимо на paw none ×1 / minor ×2 / harsh ×3. Перемножай: rare+harsh = ×12. Дешёвый вывод/удар — преимущество, но уменьшает бюджет; не давай отдельный бонус. Плата не считается полезной силой; полезная часть paid-карты ≥ бюджета чистой карты той же редкости/цены.
Вес слова: ×3 command/supply/raider/relentless/unbreakable; ×2 ranged/reach/charge/shieldwall/wedge/phalanx/skirmish/taunt/poison/burn/heal/rally/fear/siege/sturdy/upkeep/warcry/loot/harras/exhaustenemy/cleave/blast/sweep/column/vengeance/scavenger/suppress/laststand/flank/screen/spotter; ×1 armor/pierce/morale/holdground/dispersed/entrenched. armor:N, pierce:N = N; heal/suppress/cleave/vengeance/blast/sweep/column:N = базовый вес+N−1. Не дублируй сильные слова.
ЭФФЕКТЫ — та же сила: damage/heal=amount; apply_status=amount+ceil((turns−1)/2); modify_resource=2×|amount|; modify_stat/cost=|amount|×turns (без turns ×1); draw/discard/exchange/scry=2×amount. Умножь на число целей и повтор: enter_play/death ×1, attack/damaged ×2, turn_start/end ×3. Unit/structure: ≤4 полезных эффектов, ≤2 целей; нельзя уничтожать врага или бить чужого вождя. Spell: 1–2 enter_play, ≤2 целей, без select=all/destroy. Манёвр: цена минимум 1; общий вес эффектов и энергетические бонусы входит в бюджет. Без бесплатных ударов по всему полю, вечных блокировок и гарантированного уничтожения.
ПОСТРОЙКА возможна только при наличии тыла; action_cost=0, HP≥1, atk от 0 до 4: 0 — стена (не стреляет), 1 и выше — обстрел каждый ход. Ответ на обстрел не приходит, броня его гасит. Не обещай эффектов, которых нет в механике.
КЛЮЧЕВЫЕ СЛОВА: armor:N (снижает урон), pierce:N (игнорирует броню), ranged (без ответа), reach (из тыла), charge (+2 первой атаке), shieldwall (броня/защита), wedge (+атака за соседей), phalanx (+атака/броня), skirmish (отход и бой из тыла), taunt (враг бьёт первым), poison/burn (статус при атаке), heal:N (лечит соседа), rally (+атака соседям), fear/morale (бегство), siege (×2 по строениям), sturdy (первый удар слабее), holdground (защита в первый ход), upkeep (урон без соседа), supply/warcry (энергия при выходе), loot/raider (энергия за убийство/попадание), harras (задержка прироста), exhaustenemy (отнимает энергию), cleave:N (соседям цели), blast/sweep/column:N (площадь, одно слово, N=1–2, до 3 целей, N=2 может задеть своего), vengeance:N (ответ при гибели), relentless (вторая атака), scavenger (бонус за сброс), suppress:N (удорожание атаки), unbreakable (иммунитет к бегству/подавлению), laststand (одинокий ряд), flank (открытый фланг), screen (броня соседу впереди), command (+энергия из тыла), spotter (+1 дальнему/площадному удару в столбце), dispersed (защита от площади), entrenched (укрытие в авангарде).
МЕХАНИКА effects: массив объектов {event,target,action,condition?,watch?}. event: ${EVENTS.join(", ")}; card_death/card_enter_play требуют watch:{"side":"all|friendly|enemy"}. Spell использует только enter_play; event=attack — только реакция на удар.
ОБЯЗАТЕЛЬНАЯ СТРУКТУРА: action всегда объект с полем type, никогда строка. Допустимые action.type: ${ACTIONS.join(", ")}. Параметры status/amount/turns/resource/stat/cost/choice размещай ВНУТРИ action. Поле value не используется; статус — action.status, величина — action.amount.
Примеры структуры действий (числа и значения подбирай по замыслу и бюджету, не копируй механически): ${ACTIONS.map((type) => ACTION_SHAPES[type]).join("; ")}.
damage.amount: целое 1–12; heal.amount: 1–8; apply_status.amount: 1–5, status только poison/burn/suppress, turns 1–3 (по умолчанию 2). suppress удорожает атаку, НЕ уменьшает ATK и НЕ перемещает цель. Для снижения ATK используй modify_stat со stat=attack и отрицательным amount. keywords suppress:N/poison/burn — источники статуса при попадании, не замена enter_play-эффекта манёвра.
modify_resource: resource=energy, amount целое −5…5 кроме 0. modify_stat: stat=attack/armor/max_hp, amount целое −3…3 кроме 0, turns необязателен (1–3), но запрещён для max_hp. modify_cost: cost=action, amount целое −3…3 кроме 0, turns необязателен (1–3). Без turns modify_stat/modify_cost постоянны. draw/discard/exchange/scry: amount целое 1–5; discard/exchange.choice: choose/highest_cost/lowest_cost (по умолчанию choose). destroy без параметров, но запрещён для манёвра и против врага.
target — объект: обязательные side (${TARGET_SIDES.join(", ")}) и entity (${TARGET_ENTITIES.join(", ")}); необязательные zone (${TARGET_ZONES.join(", ")}), relation (${TARGET_RELATIONS.join(", ")}), select (${TARGET_SELECTS.join(", ")}), count (целое 1–3, по умолчанию 1). select — способ выбора, НЕ количество: select:1 и select:"any" запрещены. В текущем движке choose — автоматический выбор, не ручной. apply_status требует entity=unit; modify_resource/draw/discard/exchange/scry требуют entity=player; modify_stat/modify_cost/destroy требуют цель на поле. relation/select=attack_target и relation=attack_target_row/attack_target_column — только для event=attack; adjacent/attack_target* неприменимы к player; death не может целиться в self. Ограничения эпохи и типа карты на число целей строже общего count 1–3.
Полный пример эффекта манёвра: {"event":"enter_play","target":{"side":"enemy","entity":"unit","zone":"front","select":"highest_attack","count":1},"action":{"type":"apply_status","status":"suppress","amount":1,"turns":1}}.
condition необязательно: {"type":"target_wounded"}; {"type":"target_status","status":"poison|burn|suppress"}; {"type":"target_stat","stat":"hp|attack|armor","op":"eq|ne|lt|lte|gt|gte","value":1}; {"type":"resource","side":"controller|opponent","resource":"energy","op":"gte","value":1}; {"type":"board_count","side":"controller|opponent","op":"gte","value":1}. В условиях value — целое 0–99 (board_count 0–8). Комбинации: {"all":[условия]} / {"any":[условия]} (1–4) / {"not":условие}, глубина не больше 3. Запись с | в примерах означает выбор ОДНОГО значения, не буквальную строку с |.
description: 1–2 коротких предложения об одном боевом образе. abilities всегда []. tags — до трёх кратких слов. Все боевые эффекты описывай в effects, не только в тексте.
ИСТОРИЯ: поле history обязательно: {"title":"","text":""}. title — реальный прототип указанной эпохи (находка, обычай, тип отряда или звание); text — 2–3 коротких предложения о материале/технологии и связи прототипа с цифрами или ролью карты. Не выдумывай место, народ или находку. Культурное наследие — необязательный ориентир: не надо вставлять имя народа и его клише в каждую карту; чередуй военные, бытовые и технологические источники эпохи.
Схема JSON: {"name":"","card_type":"unit|spell|structure","era":"ancient|bronze","emoji":"один эмодзи","drop_cost":1,"action_cost":0,"hp":0,"atk":0,"description":"","tags":[],"abilities":[],"keywords":[],"effects":[],"monkey_paw":"текст заказанной платы или пустая строка","history":{"title":"","text":""}}. Для spell: hp=0, atk=0, action_cost=0. Для structure: action_cost=0. Для unit: hp≥1. Все названия и тексты — по-русски.`;

export async function llmCard(model: string, advice: Advice, rarity: Rarity, state: any, paw: PawTier = "none"): Promise<Card> {
  const allowed = allowedCardErasOf(state);
  const oneLine = oneLineBoard(state);
  const rarityDirective = {
    ordinary: "Обычная редкость: ×1 к базовому бюджету; одна ясная особенность.",
    uncommon: "Необычная редкость: ×2 к базовому бюджету; используй добавочную силу в характеристиках, словах или эффектах.",
    rare: "Редкая карта: ×4 к базовому бюджету; используй добавочную силу, сохранив ясную роль и игру по эпохе.",
  }[rarity];
  const directive = oneLine && advice.cardType === "unit"
    ? `Каменный век: рукопашный отряд, ATK 1–3 / HP 1–5, 0–2 простых эффекта; их общий вес не выше drop_cost+1. ${rarityDirective}`
    : rarityDirective;
  // Технологии и культурное наследие — контекст, но не обязательное повторяющееся клише.
  const era = eraContextOf(state);
  const cultureName = state.player?.historicalCulture?.name || "";
  const brief = `Боевой замысел: «${advice.title}». ${advice.pitch}
Тип карты: ${advice.cardType}. ${directive}
Бюджет силы: базовый unit = 2×drop_cost + action_cost + 1; structure = 2×drop_cost + 1; spell = drop_cost + 1 (на каменном столе min(2, drop_cost)). Умножь на редкость ordinary ×1 / uncommon ×2 / rare ×4 и независимо на чистую лапу ×1 / minor ×2 / harsh ×3 — эти множители перемножаются. В общий бюджет входят ATK + HP + вес ключевых слов + полезные эффекты; у structure ATK считается ×2. Низкая цена уже даёт темповое преимущество: чем дешевле вывод или атака, тем меньше базовый бюджет; не добавляй отдельный бонус за дешевизну и не создавай бесплатных действий. Для карты с платой полезная сила должна быть не меньше чистого бюджета той же цены и редкости.
Создай простую, исторически правдоподобную карту для текущего сражения. Контекст народа — необязательное вдохновение: варьируй источник образа, не привязывай каждую карту к одной культуре или её стереотипам.

Контекст цивилизации:
${contextOf(state)}

Разрешённый боевой тег карты: ${allowed.join(" или ")}. Историческая эпоха: «${era.label}»; технологии: ${era.tech || "не заданы"}. Короткая историческая справка должна называть реальный прототип этой эпохи, но культурное наследие можно упоминать только если это уместно.`;
  const system = CARD_SYSTEM + `\nРазрешённые эпохи сейчас: ${allowed.join(", ")}.` + (oneLine
    ? "\nСтол Каменного века — одна линия из трёх клеток. Только ближний бой, без построек и любых образов снарядов; дальние ключевые слова не используй. У каменного отряда может быть 0–2 простых эффекта общей силой не выше drop_cost+1; редкость не добавляет к этому пределу."
    : "");
  const temperature = rarity === "rare" ? 1 : rarity === "uncommon" ? 0.9 : 0.75;

  // Жребий лапы обезьяны известен только кузнецу: игрок увидит плату уже на готовой карте.
  // Две переделки — каждая получает предыдущий ответ, список ошибок и те же жёсткие правила. Плата не ослабляется
  // на последней попытке: иначе карта получила бы ×3 бюджета за штраф неправильной категории.
  const journal: string[] = [];
  let lastError: Error | null = null;
  let lastResponse = "";
  for (let attempt = 0; attempt < 3; attempt++) {
    const retry = lastError
      ? `Предыдущий ответ не прошёл проверку игры: ${validationDetails(lastError)}\nИсправь все перечисленные ошибки в предыдущей карте по схеме из системного сообщения; проверь связанные поля. Сохрани замысел и корректные части карты${paw !== "none" ? `, пересчитай суммарный вес платы и попади в строгую полосу ${paw === "minor" ? `1…${PAW_MINOR_MAX}` : `${PAW_MINOR_MAX + 1}…${PAW_HARSH_MAX}`}; не ослабляй полезную часть карты` : ""}. Не обходи проверку удалением обязательного эффекта. Верни ПОЛНЫЙ JSON карты заново, не патч и не пояснение.`
      : "";
    const ctx: AttemptContext = { stage: "Карта", attempt: attempt + 1, attempts: 3, model, details: `тип ${advice.cardType} · редкость ${rarity} · лапа ${paw}` };
    const reply = await askModel(ctx, {
      model, maxTokens: 3000, temperature, system,
      user: `${brief}\n\n${pawDirective(paw)}`,
      repair: lastError ? { response: lastResponse, feedback: retry } : undefined,
    }, journal);
    try {
      const card = validateCard(reply.json, advice.cardType, allowed, rarity, paw, { oneLine });
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
      lastResponse = reply.dump.text;
      journal.push(attemptReport(ctx, validationDetails(lastError), "проверка", reply.dump, attempt === 2));
    }
  }
  throw withJournal(lastError ?? new Error("Кузнец не смог выковать карту."), journal);
}

/**
 * Что показывать игроку, когда ковка не удалась. Текст браковки платы пересказывает жребий
 * («жёсткая плата — это вес 4…8»), а жребий до раскрытия карты — сюрприз, поэтому наружу
 * уходит нейтральная формулировка; технические детали (дословные ответы модели) выводит отдельная панель журнала.
 */
export const CRAFT_REJECTED_TEXT = "Кузнец не совладал с заказом: карта не прошла проверку игры.";
export function craftErrorMessage(e: any): string {
  return e?.pawRejected ? CRAFT_REJECTED_TEXT : String(e?.message || "Кузнец не справился.");
}
