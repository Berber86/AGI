import { M } from "./model";

export type CardType = "unit" | "spell" | "structure";
export type Rarity = "ordinary" | "uncommon" | "rare";

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
  ranged: { name: "Дальний бой", desc: "Бьёт из тыла по авангарду и не получает ответный удар." },
  reach: { name: "Длинное оружие", desc: "Из тыла достаёт врага напротив." },
  charge: { name: "Натиск", desc: "+2 к первой атаке после высадки." },
  shieldwall: { name: "Стена щитов", desc: "+1 брони; при соседях урон ниже ещё на 1." },
  wedge: { name: "Клин", desc: "+1 к атаке за каждого соседа (до +2)." },
  phalanx: { name: "Фаланга", desc: "+1 к атаке и +1 брони." },
  skirmish: { name: "Засадный", desc: "После атаки отступает в тыл." },
  taunt: { name: "Провокация", desc: "Враг обязан атаковать этот отряд первым." },
  poison: { name: "Яд", desc: "Отравляет цель при атаке: N урона в начале её хода." },
  burn: { name: "Поджог", desc: "Поджигает цель при атаке; огонь может перекинуться." },
  heal: { name: "Лекарь", desc: "В начале хода лечит раненого соседа на N." },
  rally: { name: "Поддержка", desc: "Соседи получают +1 к атаке." },
  fear: { name: "Устрашение", desc: "Шанс обратить цель в бегство при ударе." },
  morale: { name: "Мораль", desc: "Ниже 30% здоровья может бежать с поля." },
  siege: { name: "Осада", desc: "Двойной урон по постройкам." },
  sturdy: { name: "Стойкий", desc: "Первый удар за ход наносит на 1 меньше урона." },
  holdground: { name: "Удержание", desc: "В первый ход не боится страха и натиска." },
  upkeep: { name: "Содержание", desc: "Без соседей в ряду теряет 1 HP за ход." },
  supply: { name: "Снабжение", desc: "При розыгрыше повышает доступный предел энергии на 1 и даёт 1 энергию." },
  warcry: { name: "Боевой клич", desc: "При розыгрыше даёт 1 энергию в общий запас, не выше текущего предела." },
  loot: { name: "Трофеи", desc: "За убийство отряда даёт 1 энергию в общий запас." },
  raider: { name: "Налётчик", desc: "При попадании по отряду крадёт 1 энергию у противника и передаёт её вам." },
  harras: { name: "Набег", desc: "На следующий ход противника уменьшает прирост общей энергии на 1." },
  exhaustenemy: { name: "Изнурение", desc: "При розыгрыше отнимает 1 текущую энергию у противника." },
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
    death: "При гибели",
    card_death: `Когда гибнет ${e.watch?.side === "friendly" ? "свой" : e.watch?.side === "enemy" ? "вражеский" : "любой"} отряд`,
  };
  const a = e.action;
  const t = e.target || {};
  const who = t.entity === "player" ? `${SIDE_TXT[t.side] ?? ""} вождя`.trim() : `${t.count > 1 ? t.count + " " : ""}${SIDE_TXT[t.side] ?? ""} ${t.entity === "structure" ? "постройку" : "отряд"}`;
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

/* ---------- Карты игрока: стартовые + коллекция ---------- */

export function allCards(collection: Card[]): Card[] {
  return [...(M.STARTER_CARDS as Card[]), ...collection];
}

/* ---------- Валидация карты (для ответа LLM) ---------- */

const EVENTS = ["enter_play", "attack", "turn_start", "death", "card_death"];
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
    if (e.event === "card_death") {
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
    if (t.select !== undefined) { if (!["first", "lowest_hp", "lowest_hp_ratio", "highest_attack", "attack_target", "choose"].includes(t.select)) fail("select неизвестен."); target.select = t.select; }
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

export function validateCard(raw: any, expectedType: CardType, allowedEras: string[]): Card {
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
  c.id = c.id || "card-" + uid();
  return c as Card;
}

/* ---------- LLM (Hydra API) ---------- */

const HYDRA_URL = "https://api.hydraai.ru/v1/chat/completions";

/** Минимальная проверка ключа: один короткий запрос без разбора ответа модели. */
export async function probeApiKey(key: string, model: string): Promise<void> {
  if (!key || !key.trim()) throw new Error("Введите API-ключ.");
  let resp: Response;
  try {
    resp = await fetch(HYDRA_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${key.trim()}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: model || "gpt-6-luna",
        messages: [{ role: "user", content: "Ответь одним словом: готов" }],
        max_tokens: 8,
        temperature: 0,
      }),
    });
  } catch {
    throw new Error("Нет связи с api.hydraai.ru. Проверьте интернет.");
  }
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Ключ не принят (HTTP ${resp.status}).`);
  }
  const data = await resp.json().catch(() => ({}));
  if (data?.error) throw new Error(data.error.message || "Ключ не принят.");
}

/** Приводит проект совета к схеме кампании; null — если проект невалиден. */
export function sanitizeScienceProject(raw: any, fallbackCategory = "civic"): any | null {
  if (!raw || typeof raw !== "object") return null;
  const scienceName = String(raw.scienceName || "").trim().slice(0, 80);
  const buildingName = String(raw.buildingName || "").trim().slice(0, 80);
  const scienceDescription = String(raw.scienceDescription || "").trim().slice(0, 400);
  const buildingDescription = String(raw.buildingDescription || "").trim().slice(0, 400);
  if (!scienceName || !buildingName || !scienceDescription || !buildingDescription) return null;
  const effects = M.cleanEffects(raw.effects);
  if (!effects) return null;
  return {
    scienceName,
    scienceDescription,
    buildingName,
    buildingDescription,
    category: M.CATEGORIES.includes(raw.category) ? raw.category : fallbackCategory,
    effects,
    rationale: String(raw.rationale || "").trim().slice(0, 300),
  };
}

const PROJECT_SHAPE = `{"scienceName":"","scienceDescription":"1–2 предложения","buildingName":"","buildingDescription":"1–2 предложения","category":"military|economy|science|civic","effects":[{"type":"<из списка>","amount":1}],"rationale":"1 предложение: почему это следует из затравки"}`;

/** Первый проект народа: единственная наука, выведенная из затравки игрока. */
export async function llmOpeningProject(key: string, model: string, state: any): Promise<any> {
  const sit = M.scienceAdvisorSituation(state);
  const p = state.player;
  const effects = Object.keys(M.EFFECTS).join(", ");
  const data = await hydraChat({
    key, model, temperature: 1, maxTokens: 1200,
    system: `Ты научный советник исторической стратегии "Infinite Forge" о становлении цивилизаций. Сеттинг: реалистичный древний мир и бронзовый век, БЕЗ магии и фэнтези.
Игрок только что основал народ и выбрал его затравку — готовый замысел о том, чем этот народ живёт и куда смотрит.
Придумай РОВНО ОДНО первое дело народа: науку и связанную с ней постройку. Оно должно прямо продолжать затравку и опираться на землю, черту и наследие народа. Никаких готовых шаблонов — придумай свой образ.
Ответ — строго JSON: ${PROJECT_SHAPE}. Допустимые type: ${effects}. Не более 2 эффектов, amount 1. Язык — русский, без магии.`,
    user: `Затравка игрока: «${p.seedLine || "не задана — опирайся на происхождение и землю"}»\nПроисхождение: ${sit.origin?.name || p.originId || "неизвестно"} — ${sit.origin?.historical || ""}\nСитуация: ${sit.summary}`,
  });
  const project = sanitizeScienceProject(data);
  if (!project) throw new Error("Советник не вернул первый проект в понятной форме.");
  return project;
}

/** Три новых проекта по текущей ситуации и затравке; направление выбирает сам советник. */
export async function llmScienceOffers(key: string, model: string, state: any): Promise<any[]> {
  const sit = M.scienceAdvisorSituation(state);
  const effects = Object.keys(M.EFFECTS).join(", ");
  const data = await hydraChat({
    key, model, temperature: 1, maxTokens: 1600,
    system: `Ты научный советник исторической стратегии "Infinite Forge" о становлении цивилизаций. Сеттинг: реалистичный древний мир и бронзовый век, БЕЗ магии и фэнтези.
Игрок не выбирает направление — ты сам читаешь затравку народа, земли, запасы и эпоху. Предложи ровно 3 РАЗНЫХ проекта (наука + связанная постройка): один отвечает на нехватку пропитания и хозяйство, один — на защиту и войну, один — на знания и устройство общества. Каждый проект должен опираться на конкретную ситуацию народа, а не на общий список наук.
Ответ — строго JSON: {"projects":[${PROJECT_SHAPE}, ...]}. Допустимые type: ${effects}. Не более 2 эффектов на проект, amount 1. Язык — русский, без магии.`,
    user: `Ситуация: ${sit.summary}\nУже известные науки: ${(state.player.blueprints || []).map((b: any) => b.scienceName).join(", ") || "нет"}`,
  });
  const list = Array.isArray(data.projects) ? data.projects : data.scienceName ? [data] : [];
  const cleaned = list.map((raw: any) => sanitizeScienceProject(raw)).filter(Boolean).slice(0, 3);
  if (!cleaned.length) throw new Error("Советник не предложил ни одного проекта.");
  return cleaned;
}

/** Имя и описание постройки в новой земле: уникальные для этого народа, а не из списка. */
export async function llmRegionBuildingName(key: string, model: string, state: any, tile: any, building: any): Promise<{ name: string; description: string } | null> {
  const p = state.player;
  const data = await hydraChat({
    key, model, temperature: 1, maxTokens: 300,
    system: `Ты — летописец исторической стратегии "Infinite Forge" о становлении цивилизаций. Сеттинг: реалистичный древний мир и бронзовый век, БЕЗ магии и фэнтези.
Народ обустроил новую землю и возводит там постройку. Придумай ИМЕННО ЭТОЙ общине своё имя постройки и короткое описание — не шаблонное, связанное с местом и затравкой народа.
Ответ — строго JSON: {"name":"до 40 знаков","description":"одно предложение до 160 знаков"}. Язык — русский.`,
    user: `Народ: ${p.name} (${p.clan}). Затравка: «${p.seedLine || "не задана"}». Земля: ${tile.name} — ${tile.description}. Постройка по назначению: ${building.name} — ${building.description}. Эпоха: ${M.eraName(p.era)}. Земли народа: ${(state.regions || []).filter((r: any) => r.ownerId === "player").map((r: any) => (state.world?.tiles || []).find((t: any) => t.id === r.id)?.name).filter(Boolean).join(", ") || "поселение"}.`,
  });
  const name = String(data?.name || "").trim().slice(0, 60);
  if (!name) return null;
  return { name, description: String(data?.description || "").trim().slice(0, 180) };
}

async function hydraChat(opts: { key: string; model: string; system: string; user: string; temperature: number; maxTokens: number }) {
  const resp = await fetch(HYDRA_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${opts.key}`, "Content-Type": "application/json" },
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

export function contextOf(state: any): string {
  const p = state.player;
  return [
    p.seedLine && `Затравка народа: «${p.seedLine}»`,
    p.biome && `Биом: ${p.biome.name} — ${p.biome.desc}`,
    p.geography && `География: ${p.geography.name}`,
    p.trait && `Черта: ${p.trait.name} — ${p.trait.desc}`,
    p.historicalCulture && `Наследие: ${p.historicalCulture.name}`,
    `Эпоха: ${M.eraName(p.era)}`,
    `Уклады: ${(p.decrees || []).map((d: any) => M.DECREES[d.id]?.label).join(", ") || "нет"}`,
  ].filter(Boolean).join("\n");
}

export async function llmAdvice(key: string, model: string, state: any): Promise<Advice[]> {
  const era = state.player.era >= 3 ? "ancient и bronze" : "ancient";
  const data = await hydraChat({
    key, model, temperature: 1, maxTokens: 900,
    system: "Ты военный советник кузницы исторической карточной стратегии о становлении цивилизаций (древний мир и бронзовый век, без магии и фэнтези). Предложи ровно три замысла карты: один card_type=unit, один spell, один structure. Ответ — JSON: {\"choices\":[{\"card_type\":\"unit|spell|structure\",\"title\":\"короткое название\",\"pitch\":\"1 предложение, один образ\"}]}. Язык — русский.",
    user: `Контекст цивилизации:\n${contextOf(state)}\nРазрешённые эпохи карт: ${era}.`,
  });
  const list = data.choices;
  if (!Array.isArray(list) || list.length !== 3) throw new Error("Советник должен вернуть три замысла.");
  return list.map((c: any, i: number) => {
    const cardType = ["unit", "spell", "structure"].includes(c.card_type) ? c.card_type : (["unit", "spell", "structure"] as const)[i];
    return { id: `${cardType}-${i}-${Date.now()}`, cardType, title: String(c.title).slice(0, 60), pitch: String(c.pitch).slice(0, 190) };
  });
}

const CARD_SYSTEM = `Ты — ИИ-Кузнец исторической карточной стратегии "Infinite Forge" о становлении цивилизаций. Сеттинг: реалистичный древний мир и бронзовый век, БЕЗ магии и фэнтези.
Эпохи карт: "ancient" (камень, кремень, пращи, частоколы) и "bronze" (бронзовое оружие, колесницы, стены). Используй только разрешённые.
Ключевые слова: armor:N, pierce:N, ranged, reach, charge, shieldwall, wedge, phalanx, skirmish, taunt, heal:N, rally, fear, morale, siege, sturdy, holdground, upkeep. Энергетические свойства: supply (при выводе отряда/постройки или розыгрыше манёвра +1 к пределу энергии и +1 текущей энергии), warcry (+1 энергия при розыгрыше), loot (+1 энергия за убийство отряда; только для отряда), raider (крадёт 1 энергию у врага при попадании по отряду; только для отряда), harras (−1 к приросту энергии врага в его следующий ход), exhaustenemy (−1 энергия врага при розыгрыше). Яд/поджог/лечение оформляй через effects[].
Боевой ресурс один: и вывод карты, и атака расходуют общий запас энергии.
Разовые и срабатывающие действия — только в effects[]. Движок не читает description/tags.
description — 1–2 коротких предложения, один образ.
effects[] — объекты {event, target, action, condition?, watch?}:
 event: enter_play | attack | turn_start | death | card_death (для card_death обязателен watch:{side:all|friendly|enemy}).
 target: {side: friendly|controller|enemy|opponent|either, entity: unit|structure|permanent|player, zone?: front|rear|any, relation?: any|self|adjacent|attack_target, select?: first|lowest_hp|lowest_hp_ratio|highest_attack|attack_target|choose, count?: 1-3}
 action.type: damage(amount 1-12) | heal(1-8) | apply_status(status poison|burn, amount 1-5, turns 1-3) | destroy | modify_resource(resource energy, amount -5..5; target player; старые drop/action читаются как энергия) | modify_stat(stat attack|armor|max_hp, amount -3..3, turns? 1-3) | modify_cost(cost "action", amount -3..3, turns?) | draw/scry(amount 1-5, target player) | discard/exchange(amount 1-5, choice highest_cost|lowest_cost, target player).
У манёвра hp=0, atk=0, action_cost=0 и минимум один эффект enter_play. У постройки atk=0, action_cost=0, hp≥1. У отряда hp≥1.
Силу и цену выбираешь сам: сильные и странные карты допустимы. Ответ — строго JSON:
{"name":"","card_type":"unit|spell|structure","era":"ancient|bronze","emoji":"один эмодзи","drop_cost":0,"action_cost":0,"hp":0,"atk":0,"description":"","tags":[],"abilities":[],"keywords":[],"effects":[],"monkey_paw":""}
Язык — русский.`;

export async function llmCard(key: string, model: string, advice: Advice, rarity: Rarity, state: any): Promise<Card> {
  const allowed = state.player.era >= 3 ? ["ancient", "bronze"] : ["ancient"];
  const directive = { ordinary: "Обычная редкость: 1–2 заметные особенности.", uncommon: "Необычная редкость: 2–3 интересно сочетающиеся особенности.", rare: "Редкая карта: 3–5 значимых особенностей, смелое сочетание." }[rarity];
  const raw = await hydraChat({
    key, model, maxTokens: 2600, temperature: rarity === "rare" ? 1 : rarity === "uncommon" ? 0.9 : 0.75,
    system: CARD_SYSTEM + `\nРазрешённые эпохи сейчас: ${allowed.join(", ")}.`,
    user: `Замысел: «${advice.title}». ${advice.pitch}\ncard_type="${advice.cardType}". ${directive}\n\nКонтекст цивилизации:\n${contextOf(state)}`,
  });
  const card = validateCard(raw, advice.cardType, allowed);
  card.rarity = rarity;
  card.id = "card-" + uid();
  return card;
}

export async function llmScience(key: string, model: string, state: any, branch: any): Promise<any[]> {
  const sit = M.scienceAdvisorSituation(state);
  const effects = Object.keys(M.EFFECTS).join(", ");
  const data = await hydraChat({
    key, model, temperature: 1, maxTokens: 1400,
    system: `Ты научный советник исторической стратегии. Игрок выбрал широкую ветвь; придумай 3 РАЗНЫХ замысла (наука + здание). Ответ — JSON: {"projects":[{"scienceName":"","scienceDescription":"1–2 предложения","buildingName":"","buildingDescription":"1–2 предложения","category":"military|economy|science|civic","effects":[{"type":"<из списка>","amount":1}]}]}. Допустимые type: ${effects}. Не более 2 эффектов, amount 1. Язык — русский, без магии.`,
    user: `Эпоха: ${M.eraName(state.player.era)}. Направление: «${branch.label}» — ${branch.prompt}. Ситуация: ${sit.summary}`,
  });
  return Array.isArray(data.projects) ? data.projects.slice(0, 3) : data.scienceName ? [data] : [];
}
