import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { M } from "./model";
import type { Card } from "./cards";
import type { Match } from "./battle";

export type Page = "home" | "map" | "develop" | "forge" | "army";
export type Tone = "info" | "ok" | "bad";
export interface Toast { id: number; text: string; tone: Tone }

export const AVAILABLE_MODELS = [
  { id: "gpt-6-luna", label: "GPT-6 Luna (по умолчанию)" },
  { id: "gpt-6-sol", label: "GPT-6 Sol (сильная)" },
  { id: "gpt-6-astra", label: "GPT-6 Astra" },
  { id: "glm-5.2", label: "GLM-5.2" },
  { id: "glm-5.1", label: "GLM-5.1" },
  { id: "deepseek-v4-pro", label: "DeepSeek V4 Pro" },
  { id: "deepseek-v4-flash", label: "DeepSeek V4 Flash (быстрая)" },
  { id: "deepseek-v3.2", label: "DeepSeek V3.2" },
  { id: "claude-sonnet-5", label: "Claude Sonnet 5" },
  { id: "hydra-gpt-mini", label: "Hydra GPT Mini (бесплатная)" },
];

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
  model: string;
  setApiKey: (k: string) => void;
  setModel: (m: string) => void;
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
}

const Ctx = createContext<Store | null>(null);
export const useStore = () => {
  const s = useContext(Ctx);
  if (!s) throw new Error("Store missing");
  return s;
};

const COLL_KEY = "iforge_collection";

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
  const [apiKey, setApiKeyState] = useState(() => localStorage.getItem("iforge_hydra_key") || "");
  const [model, setModelState] = useState(() => localStorage.getItem("iforge_model") || "gpt-6-luna");
  const [page, setPage] = useState<Page>("home");
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [dayReport, setDayReport] = useState<DayReport | null>(null);
  const [settingsOpen, openSettings] = useState(false);
  const [match, setMatch] = useState<Match | null>(null);
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

  const setApiKey = (k: string) => { setApiKeyState(k); localStorage.setItem("iforge_hydra_key", k.trim()); };
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
    setMatch({ kind: "practice", opponentId, name: o.name, clan: o.clan, era: o.era, leaderBattle: !!o.leader });
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
    game, collection, apiKey, model, setApiKey, setModel, page, go, toasts, toast, dismissToast, act, commit, addCard, removeCard,
    endDay, dayReport, closeDayReport: () => setDayReport(null), resetCampaign, settingsOpen, openSettings,
    match, startPractice, startExpedition, resumeExpedition, markBattleStarted, finishBattle, closeBattle, selectedRegion, selectRegion,
  }), [game, collection, apiKey, model, page, go, toasts, toast, dismissToast, act, commit, addCard, removeCard, endDay, dayReport, resetCampaign, settingsOpen,
    match, startPractice, startExpedition, resumeExpedition, markBattleStarted, finishBattle, closeBattle, selectedRegion]);

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
