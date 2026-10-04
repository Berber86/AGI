import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { M } from "./model";
import { probeApiKey, type Card } from "./cards";

import type { Match } from "./battle";

export type Page = "camp" | "army" | "forge";
export type Tone = "info" | "ok" | "bad";

export interface Toast { id: number; text: string; tone: Tone }

/**
 * Модель выбирает игра, а не игрок. `gpt-6-luna` придумывает боевые замыслы и пишет обычные
 * карты; кузница сама меняет её на `glm-5.2` для необычных и редких карт
 * (campaign.js → CARD_MODEL_BY_RARITY). Ключ живёт только на сервере (HYDRA_API_KEY).
 */
export const ADVISOR_MODEL = "gpt-6-luna";

/** Диагностика ИИ: ключ настроен один раз на сервере, здесь только статус связи. */
export interface AiStatus { status: "unknown" | "checking" | "ok" | "bad"; message: string }

interface Store {
  game: any;
  collection: Card[];
  aiStatus: AiStatus;
  checkAi: () => Promise<boolean>;
  model: string;
  /**
   * Основание народа: происхождение, наследие и замысел. Все три выбора дают боевые бонусы
   * (campaign.js → combatPerks), поэтому сразу после онбординга можно выходить в бой.
   */
  foundPeople: (input: { originId: string; seedId: string; historicalCultureId?: string | null }) => { ok: boolean; error?: string };
  page: Page;
  go: (p: Page) => void;
  toasts: Toast[];
  toast: (text: string, tone?: Tone) => void;
  dismissToast: (id: number) => void;
  act: (fn: (s: any) => any, opts?: { silent?: boolean }) => any | null;
  commit: (next: any, opts?: { silent?: boolean }) => void;
  addCard: (c: Card) => void;
  removeCard: (id: string) => void;
  resetCampaign: () => void;
  settingsOpen: boolean;
  openSettings: (v: boolean) => void;
  match: Match | null;
  /** Выход в бой: тренировка с племенем — единственный вид боя в прототипе. */
  startBattle: (opponentId: string) => void;
  /** Итог боя: слава, счёт, серия побед и возможный переход эпохи с выбором наследия. */
  finishBattle: (won: boolean) => string;
  closeBattle: () => void;
  /** Постоянное улучшение лагеря за славу. */
  buyUpgrade: (key: string) => void;
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
  const [aiStatus, setAiStatus] = useState<AiStatus>({ status: "unknown", message: "" });
  const model = ADVISOR_MODEL;
  const [page, setPage] = useState<Page>("camp");
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [settingsOpen, openSettings] = useState(false);
  const [match, setMatch] = useState<Match | null>(null);
  const toastId = useRef(0);

  const dismissToast = useCallback((id: number) => setToasts((t) => t.filter((x) => x.id !== id)), []);
  const toast = useCallback((text: string, tone: Tone = "info") => {
    if (!text) return;
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

  // Ключ ИИ нигде не вводится руками: он один раз задан в окружении сервера (HYDRA_API_KEY)
  // и используется прокси-функцией /api/hydra. Здесь — только автоматическая диагностика связи.
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

  useEffect(() => {
    // Прежние ключи кампании (выбор модели, черновик онбординга, набор ополчения) больше не используются.
    try {
      localStorage.removeItem("iforge_model");
      localStorage.removeItem("iforge_opening_draft");
      localStorage.removeItem("iforge_militia");
      localStorage.removeItem("iforge_advice_v3");
    } catch { /* пусто */ }
    void checkAi(); /* eslint-disable-line react-hooks/exhaustive-deps */
  }, []);

  const foundPeople = useCallback(({ originId, seedId, historicalCultureId }: { originId: string; seedId: string; historicalCultureId?: string | null }) => {
    const founded = M.foundCampaign(M.clone(gameRef.current), { originId, seedId, historicalCultureId });
    if (founded.error) return { ok: false, error: founded.error as string };
    commit(founded.state, { silent: true });
    return { ok: true };
  }, [commit]);

  const go = useCallback((p: Page) => { setPage(p); window.scrollTo({ top: 0 }); }, []);

  const resetCampaign = useCallback(() => {
    commit(M.createState(), { silent: true });
    // «Новый народ» — полный рестарт: выкованные карты прошлой жизни не должны оставаться.
    setCollection([]);
    try { localStorage.removeItem(COLL_KEY); } catch { /* пусто */ }
    setMatch(null);
    setPage("camp");
  }, [commit]);

  const startBattle = useCallback((opponentId: string) => {
    const g = gameRef.current;
    const o = g.opponents.find((x: any) => x.id === opponentId);
    if (!o) return;
    // Первый в жизни игрока бой остаётся мягким входом: подсказки тренера и враг без построек.
    const battles = (g.player.wins || 0) + (g.player.losses || 0);
    setMatch({
      kind: "practice",
      opponentId,
      name: o.name,
      clan: o.clan,
      era: M.getOpponentBattleConfig(g, o.id).era,
      leaderBattle: !!o.leader,
      tutorial: battles === 0,
    });
  }, []);

  const finishBattle = useCallback((won: boolean) => {
    if (!match) return "";
    const out = M.recordBattle(M.clone(gameRef.current), { opponentId: match.opponentId, won, leaderBattle: match.leaderBattle });
    if (out.error) return out.error as string;
    commit(out.state, { silent: true });
    if (out.eraAdvanced) toast(`Наступила эпоха «${out.eraAdvanced.label}»: племена стали сильнее, а вам предстоит выбрать наследие.`, "ok");
    return out.message as string;
  }, [commit, match, toast]);

  const closeBattle = useCallback(() => setMatch(null), []);

  const buyUpgrade = useCallback((key: string) => {
    const res = act((s) => M.buyUpgrade(s, key));
    if (res) toast(`${res.state.player.campaignNotice || "Улучшение куплено."}`, "ok");
  }, [act, toast]);

  const value = useMemo<Store>(() => ({
    game, collection, aiStatus, checkAi, model, foundPeople, page, go, toasts, toast, dismissToast, act, commit,
    addCard, removeCard, resetCampaign, settingsOpen, openSettings, match, startBattle, finishBattle, closeBattle, buyUpgrade,
  }), [game, collection, aiStatus, checkAi, model, foundPeople, page, go, toasts, toast, dismissToast, act, commit,
    addCard, removeCard, resetCampaign, settingsOpen, match, startBattle, finishBattle, closeBattle, buyUpgrade]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

/* ---------- производные значения ---------- */

export function useDerived() {
  const { game } = useStore();
  return useMemo(() => {
    const p = game.player;
    return {
      cfg: M.getBattleConfig(game),
      era: M.nextEraProgress(game),
      camp: M.campSummary(game),
      glory: Math.floor(p.glory),
      gloryTotal: Math.floor(p.gloryTotal),
      wins: p.wins,
      losses: p.losses,
      streak: p.streak,
      bestStreak: p.bestStreak,
    };
  }, [game]);
}
