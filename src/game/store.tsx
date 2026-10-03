import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { M } from "./model";
import { llmRegionBuildingOffers, llmRegionBuildingName, probeApiKey, type Card } from "./cards";

import type { Match } from "./battle";

export type Page = "home" | "map" | "develop" | "forge" | "army";
export type Tone = "info" | "ok" | "bad";

export interface Toast { id: number; text: string; tone: Tone }

/**
 * Модель выбирает игра, а не игрок: выбор модели из интерфейса убран целиком.
 * `gpt-6-luna` отвечает за науки, советы, названия построек и обычные карты; кузница сама
 * меняет её на `glm-5.2` для необычных и редких карт (campaign.js → cardCraftQuote.modelByRarity).
 * Ключ по-прежнему живёт только на сервере (HYDRA_API_KEY), браузер его не видит.
 */
export const ADVISOR_MODEL = "gpt-6-luna";

/** Статус диагностики ИИ: ключ больше не вводится игроком — он настроен один раз на сервере (env HYDRA_API_KEY). */
export interface AiStatus { status: "unknown" | "checking" | "ok" | "bad"; message: string }

export interface DayReport {
  day: number;
  before: { food: number; materials: number; knowledge: number; faith: number };
  after: { food: number; materials: number; knowledge: number; faith: number };
  gained: { food: number; materials: number; knowledge: number; faith: number };
  /** Переход эпохи случился в конце дня: просветление 2·📚 + 1·🙏 дошло до порога. */
  eraAdvanced: { from: number; to: number; label: string } | null;
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
  /** Диагностика ИИ-советника: ключ настроен один раз на сервере, тут только статус связи. */
  aiStatus: AiStatus;
  checkAi: () => Promise<boolean>;
  /** Модель советника задана игрой (ADVISOR_MODEL) — игрок её больше не выбирает. */
  model: string;
  /**
   * Основание народа: происхождение, наследие и замысел. Ни первой науки, ни первого здания
   * на старте не выдаётся — советник предложит три разные науки позже, когда игрок сам откроет
   * вкладку «Наука» (см. Develop.tsx).
   */
  foundPeople: (input: { originId: string; seedId: string; historicalCultureId?: string | null }) => { ok: boolean; error?: string };
  /** Даёт постройке в земле уникальное имя от советника (совместимость со старой страницей). */
  nameRegionBuilding: (regionId: string) => void;
  /** Для каждой освоенной пустой клетки сохраняет три контекстных чертежа советника. */
  requestRegionBuildingOffers: (regionId: string) => Promise<{ ok: boolean; offers?: any[]; error?: string }>;
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
  const [aiStatus, setAiStatus] = useState<AiStatus>({ status: "unknown", message: "" });
  // Модель одна и задана игрой: выбор модели из интерфейса убран, старая запись в localStorage стирается.
  const model = ADVISOR_MODEL;
  const [page, setPage] = useState<Page>("home");
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [dayReport, setDayReport] = useState<DayReport | null>(null);
  const [settingsOpen, openSettings] = useState(false);
  const [match, setMatch] = useState<Match | null>(null);
  const [selectedRegion, selectRegion] = useState<string | null>(null);
  const toastId = useRef(0);
  const regionOfferRequests = useRef(new Map<string, Promise<{ ok: boolean; offers?: any[]; error?: string }>>());

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

  // Ключ ИИ больше нигде не вводится руками: он один раз задан в окружении сервера
  // (HYDRA_API_KEY на Vercel) и используется прокси-функцией /api/hydra. Здесь — только
  // автоматическая диагностика связи, без какого-либо текстового поля для ключа.
  const checkAi = useCallback(async (): Promise<boolean> => {
    setAiStatus({ status: "checking", message: "" });
    try {
      await probeApiKey(model);
      setAiStatus({ status: "ok", message: "ИИ на связи." });
      return true;
    } catch (e: any) {
      setAiStatus({ status: "bad", message: e?.message || "ИИ недоступен." });
      return false;
    }
  }, [model]);

  // Проверяем связь один раз при запуске — автоматически, без участия игрока.
  // Заодно стираем ключ прежнего выбора модели: модель теперь одна и задана игрой.
  useEffect(() => {
    try { localStorage.removeItem("iforge_model"); } catch { /* пусто */ }
    void checkAi(); /* eslint-disable-line react-hooks/exhaustive-deps */
  }, []);

  /**
   * Основание народа: происхождение, наследие и замысел. Игрок сразу попадает в поселение —
   * ни первой науки, ни первого здания на старте нет (экран советника открывается только
   * по клику игрока во вкладке «Наука»). Черновик прежнего двухшагового онбординга стирается.
   */
  const foundPeople = useCallback(({ originId, seedId, historicalCultureId }: { originId: string; seedId: string; historicalCultureId?: string | null }) => {
    const founded = M.foundCampaign(M.clone(gameRef.current), { originId, seedId, historicalCultureId });
    if (founded.error) return { ok: false, error: founded.error as string };
    commit(founded.state, { silent: true });
    try { localStorage.removeItem("iforge_opening_draft"); } catch { /* пусто */ }
    return { ok: true };
  }, [commit]);
  /** Постройка в новой земле получает своё имя от советника; при сбое остаётся местное. */
  const nameRegionBuilding = useCallback(async (regionId: string) => {
    const tile = (gameRef.current.world?.tiles || []).find((t: any) => t.id === regionId);
    const building = tile ? M.REGION_BUILDINGS[tile.siteType] : null;
    if (!tile || !building) return;
    try {
      const flavor = await llmRegionBuildingName(model, gameRef.current, tile, building);
      if (!flavor) return;
      const next = M.clone(gameRef.current);
      const record = next.regions.find((r: any) => r.id === regionId);
      if (!record?.building || record.ownerId !== "player") return;
      record.buildingFlavor = flavor;
      commit(next, { silent: true });
      toast(`Постройка в «${tile.name}» получила имя: ${flavor.name}.`, "ok");
    } catch { /* местное имя остаётся, стройка уже оплачена */ }
  }, [model, commit, toast]);

  const requestRegionBuildingOffers = useCallback((regionId: string): Promise<{ ok: boolean; offers?: any[]; error?: string }> => {
    const inFlight = regionOfferRequests.current.get(regionId);
    if (inFlight) return inFlight;
    const current = gameRef.current;
    const tile = (current.world?.tiles || []).find((item: any) => item.id === regionId);
    const record = current.regions.find((item: any) => item.id === regionId);
    if (!tile || !record || record.ownerId !== "player" || record.building) {
      return Promise.resolve({ ok: false, error: "Сначала освойте пустую клетку, чтобы советник подготовил для неё постройки." });
    }
    if (record.buildingOffers?.length === 3) return Promise.resolve({ ok: true, offers: record.buildingOffers });

    const request = (async () => {
      try {
        const offers = await llmRegionBuildingOffers(model, current, tile);
        const stored = M.setRegionBuildingOffersState(M.clone(gameRef.current), regionId, offers);
        if (stored.error) return { ok: false, error: stored.error };
        commit(stored.state, { silent: true });
        return { ok: true, offers: stored.offers || offers };
      } catch (e: any) {
        return { ok: false, error: e?.message || "Советник не смог придумать постройки для этой клетки." };
      } finally {
        regionOfferRequests.current.delete(regionId);
      }
    })();
    regionOfferRequests.current.set(regionId, request);
    return request;
  }, [model, commit]);

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
        faith: b.workerProduction.faith + b.regional.faith,
      },
      eraAdvanced: res.eraAdvanced ? { from: res.eraAdvanced.from, to: res.eraAdvanced.to, label: M.eraName(res.eraAdvanced.to) } : null,
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
    commit(M.createState(), { silent: true });
    // «Новая цивилизация» должна быть полным рестартом: без этого выкованные карты
    // и набор ополчения из прошлой жизни оставались в localStorage и в памяти.
    setCollection([]);
    setMilitiaPicks([]);
    try { localStorage.removeItem(COLL_KEY); } catch { /* пусто */ }
    try { localStorage.removeItem(MILITIA_KEY); } catch { /* пусто */ }
    setMatch(null);
    setPage("home");
    selectRegion(null);
  }, [commit]);

  const startPractice = useCallback((opponentId: string) => {
    const g = gameRef.current;
    if (g.player.pendingExpedition) { toast("Сначала завершите начатую экспедицию.", "bad"); return; }
    const o = g.opponents.find((x: any) => x.id === opponentId);
    if (!o) return;
    // Первый в жизни игрока бой остаётся мягким входом: подсказки, враг без построек,
    // полная энергия на выходе. Обязательного маршрута нет — тренироваться не обязательно.
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
    game, collection, aiStatus, checkAi, model, foundPeople, nameRegionBuilding, requestRegionBuildingOffers, page, go, toasts, toast, dismissToast, act, commit, addCard, removeCard,
    endDay, dayReport, closeDayReport: () => setDayReport(null), resetCampaign, settingsOpen, openSettings,
    match, startPractice, startExpedition, resumeExpedition, markBattleStarted, finishBattle, closeBattle, selectedRegion, selectRegion, militiaPicks, toggleMilitiaPick,
  }), [game, collection, aiStatus, checkAi, model, foundPeople, nameRegionBuilding, requestRegionBuildingOffers, page, go, toasts, toast, dismissToast, act, commit, addCard, removeCard, endDay, dayReport, resetCampaign, settingsOpen,
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
      faith: b.workerProduction.faith + b.regional.faith,
    };
    const cap = M.getStorageCap(game);
    const cfg = M.getBattleConfig(game);
    // *Used хранит счётчик (0,1,2...), а не true/false — order_capacity от построек советника
    // может поднять дневной лимит приказа с 1 до 2 (см. campaign.js getOrderCapacity).
    const ordersUsed = (["craftUsed", "researchUsed", "constructionUsed", "frontierUsed", "missionUsed"] as const)
      .reduce((sum, key) => sum + (Number(p.dailyOrders[key]) || 0), 0);
    return { breakdown: b, net, cap, cfg, ordersUsed, ap: p.ap, apMax: p.apMax };
  }, [game]);
}
