import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { M } from "./model";
import { llmOpeningProject, llmRegionBuildingName, probeApiKey, type Card } from "./cards";
import type { Match } from "./battle";

export type Page = "home" | "map" | "develop" | "forge" | "army";
export type Tone = "info" | "ok" | "bad";

/** Шаг первого маршрута ведёт на конкретный экран — игрок не ищет, куда нажать. */
export function guideStepPage(stepId: string): Page {
  if (stepId === "territory") return "map";
  if (stepId === "battle") return "army";
  return "develop";
}

export function currentGuideStep(game: any): { step: any; guide: any; page: Page } | null {
  const guide = M.getFirstSessionGuide(game);
  if (!guide || guide.complete) return null;
  const step = guide.steps.find((s: any) => !s.done);
  if (!step) return null;
  return { step, guide, page: guideStepPage(step.id) };
}
export interface Toast { id: number; text: string; tone: Tone }

/**
 * Модели сгруппированы по семействам: бренд остаётся на месте, а рядом пометка,
 * чем модель отличается, — выбор не превращается в угадывание названий.
 */
export const MODEL_GROUPS: { id: string; label: string; hint: string; models: { id: string; label: string }[] }[] = [
  {
    id: "gpt", label: "GPT-6", hint: "Универсальные: Sol — самая сильная, Luna — быстрая и аккуратная",
    models: [
      { id: "gpt-6-luna", label: "GPT-6 Luna · по умолчанию" },
      { id: "gpt-6-sol", label: "GPT-6 Sol · сильная" },
      { id: "gpt-6-astra", label: "GPT-6 Astra · ровная" },
    ],
  },
  {
    id: "glm", label: "GLM", hint: "Крепкие модели, хороши в описаниях и названиях",
    models: [
      { id: "glm-5.2", label: "GLM-5.2 · новая" },
      { id: "glm-5.1", label: "GLM-5.1 · прошлая" },
    ],
  },
  {
    id: "deepseek", label: "DeepSeek", hint: "Pro точнее, Flash отвечает быстрее",
    models: [
      { id: "deepseek-v4-pro", label: "DeepSeek V4 Pro · сильная" },
      { id: "deepseek-v4-flash", label: "DeepSeek V4 Flash · быстрая" },
      { id: "deepseek-v3.2", label: "DeepSeek V3.2 · прошлая" },
    ],
  },
  {
    id: "claude", label: "Claude", hint: "Сильные тексты и аккуратные правила",
    models: [
      { id: "claude-sonnet-5", label: "Claude Sonnet 5 · сильная" },
    ],
  },
  {
    id: "hydra", label: "Hydra", hint: "Бесплатная модель для пробы",
    models: [
      { id: "hydra-gpt-mini", label: "Hydra GPT Mini · бесплатная" },
    ],
  },
];

export const AVAILABLE_MODELS = MODEL_GROUPS.flatMap((g) => g.models);

export interface ApiKeyCheck { status: "unknown" | "checking" | "ok" | "bad"; message: string }

export interface DayReport {
  day: number;
  before: { food: number; materials: number; knowledge: number };
  after: { food: number; materials: number; knowledge: number };
  gained: { food: number; materials: number; knowledge: number };
  consumption: number;
  upkeep: number;
  popBefore: number;
  popAfter: number;
  starvation: boolean;
  notice: string;
  readyCards: string[];
}

interface Store {
  game: any;
  collection: Card[];
  apiKey: string;
  keyCheck: ApiKeyCheck;
  model: string;
  setApiKey: (k: string) => void;
  setModel: (m: string) => void;
  verifyKey: (candidate?: string, quiet?: boolean) => Promise<boolean>;
  /** Основание народа: имя, происхождение и затравка; первый проект создаёт ИИ. */
  foundCampaign: (input: { name: string; originId: string; seedId: string }) => Promise<{ ok: boolean; project?: any; error?: string }>;
  /** Игрок увидел созданное первое дело и начинает первый день. */
  startFirstDay: (project?: any) => boolean;
  /** Даёт постройке в земле уникальное имя от советника. */
  nameRegionBuilding: (regionId: string) => void;
  page: Page;
  go: (p: Page) => void;
  toasts: Toast[];
  toast: (text: string, tone?: Tone) => void;
  dismissToast: (id: number) => void;
  act: (fn: (s: any) => any, opts?: { silent?: boolean }) => any | null;
  commit: (next: any, opts?: { silent?: boolean }) => void;
  addCard: (c: Card) => void;
  removeCard: (id: string) => void;
  endDay: () => void;
  dayReport: DayReport | null;
  closeDayReport: () => void;
  resetCampaign: () => void;
  settingsOpen: boolean;
  openSettings: (v: boolean) => void;
  match: Match | null;
  startPractice: (opponentId: string) => void;
  startExpedition: (regionId: string) => void;
  resumeExpedition: () => void;
  markBattleStarted: () => void;
  finishBattle: (won: boolean) => string;
  closeBattle: () => void;
  selectedRegion: string | null;
  selectRegion: (id: string | null) => void;
  /** Выбранные игроком ополченцы: заполняют свободные слоты колоды в бою. */
  militiaPicks: string[];
  toggleMilitiaPick: (cardId: string) => void;
}

const Ctx = createContext<Store | null>(null);
export const useStore = () => {
  const s = useContext(Ctx);
  if (!s) throw new Error("Store missing");
  return s;
};

const COLL_KEY = "iforge_collection";
const MILITIA_KEY = "iforge_militia";

function loadMilitiaPicks(): string[] {
  try {
    const raw = JSON.parse(localStorage.getItem(MILITIA_KEY) || "[]");
    return Array.isArray(raw) ? raw.filter((id) => typeof id === "string").slice(0, 6) : [];
  } catch { return []; }
}

function loadCollection(): Card[] {
  try {
    const raw = JSON.parse(localStorage.getItem(COLL_KEY) || "[]");
    if (!Array.isArray(raw)) return [];
    return raw.filter((c) => c && c.id && c.name).map((c) => ({ keywords: [], effects: [], ...c }));
  } catch { return []; }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [game, setGame] = useState<any>(() => M.load());
  const gameRef = useRef(game);
  const [collection, setCollection] = useState<Card[]>(loadCollection);
  const [militiaPicks, setMilitiaPicks] = useState<string[]>(loadMilitiaPicks);
  const [apiKey, setApiKeyState] = useState(() => localStorage.getItem("iforge_hydra_key") || "");
  const [keyCheck, setKeyCheck] = useState<ApiKeyCheck>(() => ({ status: localStorage.getItem("iforge_hydra_key") ? "unknown" : "bad", message: "" }));
  const [model, setModelState] = useState(() => localStorage.getItem("iforge_model") || "gpt-6-luna");
  const [page, setPage] = useState<Page>("home");
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [dayReport, setDayReport] = useState<DayReport | null>(null);
  const [settingsOpen, openSettings] = useState(false);
  const [match, setMatch] = useState<Match | null>(null);
  const [pendingOpening, setPendingOpening] = useState<{ state: any } | null>(null);
  const [selectedRegion, selectRegion] = useState<string | null>(null);
  const toastId = useRef(0);

  const dismissToast = useCallback((id: number) => setToasts((t) => t.filter((x) => x.id !== id)), []);
  const toast = useCallback((text: string, tone: Tone = "info") => {
    const id = ++toastId.current;
    setToasts((t) => [...t.slice(-3), { id, text, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), tone === "bad" ? 6500 : 5000);
  }, []);

  const commit = useCallback((next: any, opts?: { silent?: boolean }) => {
    const s = M.normalizeState(next);
    const notice = s.player.campaignNotice;
    s.player.campaignNotice = "";
    M.save(s);
    gameRef.current = s;
    setGame(s);
    if (notice && !opts?.silent) toast(notice, "info");
  }, [toast]);

  const act = useCallback((fn: (s: any) => any, opts?: { silent?: boolean }) => {
    const res = fn(M.clone(gameRef.current));
    if (!res || res.error) { toast(res?.error || "Действие недоступно.", "bad"); return null; }
    commit(res.state, opts);
    return res;
  }, [commit, toast]);

  useEffect(() => { localStorage.setItem(COLL_KEY, JSON.stringify(collection)); }, [collection]);
  useEffect(() => { localStorage.setItem(MILITIA_KEY, JSON.stringify(militiaPicks)); }, [militiaPicks]);

  // Порядок выбора = порядок выхода: первый выбранный ополченец занимает первый свободный слот.
  const toggleMilitiaPick = useCallback((cardId: string) => {
    setMilitiaPicks((picks) => picks.includes(cardId) ? picks.filter((id) => id !== cardId) : [...picks, cardId].slice(0, 6));
  }, []);

  const addCard = useCallback((c: Card) => setCollection((list) => [c, ...list.filter((x) => x.id !== c.id)]), []);
  const removeCard = useCallback((id: string) => {
    setCollection((list) => list.filter((x) => x.id !== id));
    const g = gameRef.current;
    if (g.player.deckCardIds.includes(id)) {
      const next = M.clone(g);
      next.player.deckCardIds = next.player.deckCardIds.filter((x: string) => x !== id);
      commit(next, { silent: true });
    }
  }, [commit]);

  const setApiKey = (k: string) => {
    setApiKeyState(k);
    localStorage.setItem("iforge_hydra_key", k.trim());
    setKeyCheck({ status: k.trim() ? "unknown" : "bad", message: "" });
  };

  const verifyKey = useCallback(async (candidate?: string, quiet = false): Promise<boolean> => {
    const key = (candidate ?? apiKey).trim();
    if (!key) { setKeyCheck({ status: "bad", message: "Введите ключ с dashboard.hydraai.ru." }); return false; }
    setKeyCheck({ status: "checking", message: "" });
    try {
      await probeApiKey(key, model);
      setApiKeyState(key);
      localStorage.setItem("iforge_hydra_key", key);
      setKeyCheck({ status: "ok", message: "Ключ работает — ИИ подключён." });
      if (!quiet) toast("Ключ проверен: советники на связи.", "ok");
      return true;
    } catch (e: any) {
      setKeyCheck({ status: "bad", message: e?.message || "Ключ не принят." });
      return false;
    }
  }, [apiKey, model, toast]);

  /** Полный старт: модель получает затравку и придумывает первое дело народа. */
  const foundCampaign = useCallback(async ({ name, originId, seedId }: { name: string; originId: string; seedId: string }) => {
    if (!apiKey.trim()) return { ok: false, error: "Нужен API-ключ: первый проект создаёт советник." };
    const current = gameRef.current;
    // Повтор после ошибки не должен второй раз выдавать стартовый бонус происхождения.
    const resumable = current.player.awaitingOpeningProject && current.player.originId === originId;
    let base = M.clone(current);
    if (resumable) {
      const choice = (M.SEED_CHOICES || []).find((item: any) => item.id === seedId) || null;
      base.player.seedChoiceId = choice ? choice.id : base.player.seedChoiceId;
      base.player.seedLine = choice ? choice.line : base.player.seedLine;
      base.player.name = name.trim().slice(0, 24) || base.player.name;
      base = M.normalizeState(base);
      commit(base, { silent: true });
    } else {
      const begun = M.beginOnboardingState(base, { name, originId, seedId });
      if (begun.error) return { ok: false, error: begun.error };
      base = begun.state;
      commit(base, { silent: true });
    }
    try {
      const project = await llmOpeningProject(apiKey, model, base);
      const applied = M.setOpeningProject(M.clone(base), project);
      if (applied.error) return { ok: false, error: applied.error };
      // Начало игры фиксируется только после того, как игрок увидел первый проект.
      setPendingOpening({ state: applied.state });
      // Черновик спасает уже оплаченную генерацию, если игрок закроет вкладку до первого дня.
      try { localStorage.setItem("iforge_opening_draft", JSON.stringify({ seedChoiceId: base.player.seedChoiceId, seedLine: base.player.seedLine, project: applied.blueprint })); } catch { /* переполнение хранилища не критично */ }
      return { ok: true, project: applied.blueprint };
    } catch (e: any) {
      return { ok: false, error: e?.message || "Советник недоступен." };
    }
  }, [apiKey, model, commit]);

  const startFirstDay = useCallback((project?: any) => {
    let prepared = pendingOpening?.state ?? null;
    if (!prepared && project) {
      const applied = M.setOpeningProject(M.clone(gameRef.current), project);
      if (applied.error) return false;
      prepared = applied.state;
    }
    if (!prepared) return false;
    commit(prepared, { silent: true });
    setPendingOpening(null);
    try { localStorage.removeItem("iforge_opening_draft"); } catch { /* пусто */ }
    return true;
  }, [pendingOpening, commit]);
  /** Постройка в новой земле получает своё имя от советника; при сбое остаётся местное. */
  const nameRegionBuilding = useCallback(async (regionId: string) => {
    const tile = (gameRef.current.world?.tiles || []).find((t: any) => t.id === regionId);
    const building = tile ? M.REGION_BUILDINGS[tile.siteType] : null;
    if (!tile || !building || !apiKey) return;
    try {
      const flavor = await llmRegionBuildingName(apiKey, model, gameRef.current, tile, building);
      if (!flavor) return;
      const next = M.clone(gameRef.current);
      const record = next.regions.find((r: any) => r.id === regionId);
      if (!record?.building || record.ownerId !== "player") return;
      record.buildingFlavor = flavor;
      commit(next, { silent: true });
      toast(`Постройка в «${tile.name}» получила имя: ${flavor.name}.`, "ok");
    } catch { /* местное имя остаётся, стройка уже оплачена */ }
  }, [apiKey, model, commit, toast]);

  const setModel = (m: string) => { setModelState(m); localStorage.setItem("iforge_model", m); };

  const go = useCallback((p: Page) => { setPage(p); window.scrollTo({ top: 0 }); }, []);

  const endDay = useCallback(() => {
    const before = gameRef.current;
    const res = M.finishDay(M.clone(before));
    if (res.error) { toast(res.error, "bad"); return; }
    const after = res.state;
    const b = res.breakdown;
    const readyBefore = new Set(before.player.craftOrders.filter((o: any) => o.status === "ready").map((o: any) => o.id));
    const readyCards = after.player.craftOrders.filter((o: any) => o.status === "ready" && !readyBefore.has(o.id)).map((o: any) => o.name || "Карта");
    setDayReport({
      day: before.day,
      before: { ...before.player.resources },
      after: { ...after.player.resources },
      gained: {
        food: b.workerProduction.food + b.regional.food,
        materials: b.workerProduction.materials + b.regional.materials,
        knowledge: b.workerProduction.knowledge + b.regional.knowledge,
      },
      consumption: b.consumption,
      upkeep: b.upkeep,
      popBefore: before.player.population,
      popAfter: after.player.population,
      starvation: res.starvation,
      notice: after.player.campaignNotice || "",
      readyCards,
    });
    commit(after, { silent: true });
  }, [commit, toast]);

  const resetCampaign = useCallback(() => {
    try { localStorage.removeItem("iforge_opening_draft"); } catch { /* пусто */ }
    setPendingOpening(null);
    commit(M.createState(), { silent: true });
    setMatch(null);
    setPage("home");
    selectRegion(null);
  }, [commit]);

  const startPractice = useCallback((opponentId: string) => {
    const g = gameRef.current;
    if (g.player.pendingExpedition) { toast("Сначала завершите начатую экспедицию.", "bad"); return; }
    const o = g.opponents.find((x: any) => x.id === opponentId);
    if (!o) return;
    // Первый в жизни игрока бой ведёт наставник: подсказки, враг без построек, полная энергия на выходе.
    const practiceCount = (g.player.practice?.wins || 0) + (g.player.practice?.losses || 0);
    setMatch({ kind: "practice", opponentId, name: o.name, clan: o.clan, era: o.era, leaderBattle: !!o.leader, tutorial: practiceCount === 0 });
  }, [toast]);

  const startExpedition = useCallback((regionId: string) => {
    const res = act((s) => M.beginRegionExpedition(s, regionId), { silent: true });
    if (res?.match) setMatch(res.match);
  }, [act]);

  const resumeExpedition = useCallback(() => {
    const m = M.makeExpeditionMatch(gameRef.current);
    if (m) setMatch(m); else toast("Незавершённая экспедиция не найдена.", "bad");
  }, [toast]);

  const markBattleStarted = useCallback(() => {
    if (match?.kind === "expedition") act((s) => M.markExpeditionBattleStarted(s, match), { silent: true });
  }, [act, match]);

  const finishBattle = useCallback((won: boolean) => {
    if (!match) return "";
    const g = M.clone(gameRef.current);
    if (match.kind === "expedition") {
      const out = M.finishRegionExpedition(g, match, won);
      if (out.error) return out.error;
      commit(out.state, { silent: true });
      return out.message as string;
    }
    const out = M.recordPractice(g, match.opponentId, won, match.leaderBattle);
    if (!out.error) commit(out.state, { silent: true });
    return "Тренировка не меняет ресурсы и границы — только запись в летописи.";
  }, [commit, match]);

  const closeBattle = useCallback(() => setMatch(null), []);

  const value = useMemo<Store>(() => ({
    game, collection, apiKey, keyCheck, model, setApiKey, setModel, verifyKey, foundCampaign, startFirstDay, nameRegionBuilding, page, go, toasts, toast, dismissToast, act, commit, addCard, removeCard,
    endDay, dayReport, closeDayReport: () => setDayReport(null), resetCampaign, settingsOpen, openSettings,
    match, startPractice, startExpedition, resumeExpedition, markBattleStarted, finishBattle, closeBattle, selectedRegion, selectRegion, militiaPicks, toggleMilitiaPick,
  }), [game, collection, apiKey, keyCheck, model, verifyKey, foundCampaign, startFirstDay, nameRegionBuilding, page, go, toasts, toast, dismissToast, act, commit, addCard, removeCard, endDay, dayReport, resetCampaign, settingsOpen,
    match, startPractice, startExpedition, resumeExpedition, markBattleStarted, finishBattle, closeBattle, selectedRegion, militiaPicks, toggleMilitiaPick]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

/* ---------- производные значения ---------- */

export function useDerived() {
  const { game } = useStore();
  return useMemo(() => {
    const p = game.player;
    const b = M.getProductionBreakdown(game);
    const net = {
      food: b.workerProduction.food + b.regional.food - b.consumption,
      materials: b.workerProduction.materials + b.regional.materials - b.upkeep,
      knowledge: b.workerProduction.knowledge + b.regional.knowledge,
    };
    const cap = M.getStorageCap(game);
    const cfg = M.getBattleConfig(game);
    const ordersUsed = Object.values(p.dailyOrders).filter((v) => v === true).length - (p.dailyOrders.legacyBlocked ? 1 : 0);
    return { breakdown: b, net, cap, cfg, ordersUsed, ap: p.ap, apMax: p.apMax };
  }, [game]);
}
