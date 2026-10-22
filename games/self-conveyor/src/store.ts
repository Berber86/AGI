// ===== Стор «По силам»: состояние + действия двух механизмов =====
import { useSyncExternalStore } from 'react';
import {
  advanceDate,
  budgetFor,
  emptyDay,
  quotaFor,
  todayISO,
  uid,
  type DayLog,
  type Item,
  type PlanEntry,
  type ProtocolRun,
  type RepeatKind,
  type Settings,
  type State,
} from './types';
import { loadLocal, saveLocal, cloudSave, firebaseReady } from './persistence';

export const STATE_KEY = 'self-conveyor-state-v2';

export function defaultSettings(): Settings {
  return {
    llm: {
      baseUrl: 'https://openrouter.ai/api/v1',
      apiKey: '',
      model: 'openai/gpt-4o-mini',
    },
    firebase: { apiKey: '', authDomain: '', projectId: '', appId: '' },
    quotaMax: 4,
  };
}

export function defaultState(): State {
  return {
    items: [],
    days: {},
    settings: defaultSettings(),
    updatedAt: Date.now(),
  };
}

export function makeItem(partial: Partial<Item>): Item {
  const now = Date.now();
  return {
    id: uid(),
    title: '',
    notes: '',
    cost: 2,
    affect: 'none',
    resistance: 0,
    microStep: '',
    joy: false,
    due: null,
    repeat: 'none',
    status: 'pool',
    createdAt: now,
    updatedAt: now,
    doneAt: null,
    lastDoneAt: null,
    runs: [],
    ...partial,
  };
}

/** Миграция: старая схема v1 (конвейер списков) → v2 (склад дел с аффектом и стоимостью) */
export function migrate(raw: unknown): State {
  const base = defaultState();
  const r = raw as Partial<State> & { items?: unknown[] };
  if (!r || typeof r !== 'object') return base;

  const items: Item[] = (Array.isArray(r.items) ? r.items : []).map((unknownItem) => {
    const it = unknownItem as Partial<Item> & {
      list?: string;
      completedAt?: number | null;
      nextDue?: string | number | null; // поле легаси v1 (таймстамп или строка)
      steps?: { done: boolean }[];
    };
    const done = it.status === 'done' || it.list === 'done';
    return makeItem({
      id: it.id ?? uid(),
      title: it.title ?? '',
      notes: it.notes ?? '',
      cost: it.cost === 1 || it.cost === 2 || it.cost === 3 ? it.cost : 2,
      affect: it.affect ?? 'none',
      resistance: typeof it.resistance === 'number' ? it.resistance : 0,
      microStep: it.microStep ?? '',
      joy: Boolean(it.joy),
      due: it.due
        ? String(it.due).slice(0, 10)
        : it.nextDue
          ? typeof it.nextDue === 'number'
            ? new Date(it.nextDue).toISOString().slice(0, 10)
            : String(it.nextDue).slice(0, 10)
          : null,
      repeat: it.repeat ?? 'none',
      status: done ? 'done' : it.status === 'dropped' ? 'dropped' : 'pool',
      createdAt: it.createdAt ?? Date.now(),
      updatedAt: it.updatedAt ?? Date.now(),
      doneAt: it.doneAt ?? it.completedAt ?? null,
      runs: Array.isArray(it.runs) ? it.runs : [],
    });
  });

  const days: Record<string, DayLog> = {};
  const rawDays = (r.days ?? {}) as Record<string, DayLog>;
  for (const [date, d] of Object.entries(rawDays)) {
    days[date] = { ...emptyDay(date), ...d, date };
  }

  return {
    items,
    days,
    settings: {
      ...base.settings,
      ...(r.settings ?? {}),
      llm: { ...base.settings.llm, ...(r.settings?.llm ?? {}) },
      firebase: { ...base.settings.firebase, ...(r.settings?.firebase ?? {}) },
    },
    updatedAt: r.updatedAt ?? Date.now(),
  };
}

let state: State = migrate(loadLocal(STATE_KEY));
const listeners = new Set<() => void>();
let saveTimer: ReturnType<typeof setTimeout> | null = null;

function persist() {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    saveLocal(STATE_KEY, state);
    if (firebaseReady(state.settings.firebase)) {
      cloudSave(state).catch((e) => console.warn('cloud autosave skipped:', e?.message ?? e));
    }
  }, 400);
}

function emit() {
  for (const l of listeners) l();
  persist();
}

export function getState(): State {
  return state;
}

export function setState(fn: (s: State) => State): void {
  state = { ...fn(state), updatedAt: Date.now() };
  emit();
}

export function replaceState(next: State): void {
  state = migrate(next);
  emit();
}

export function updateSettings(patch: Partial<Settings>): void {
  setState((s) => ({ ...s, settings: { ...s.settings, ...patch } }));
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useApp(): State {
  return useSyncExternalStore(subscribe, getState, getState);
}

// ---------- дела (склад) ----------

export function addItem(partial: Partial<Item>): Item {
  const item = makeItem(partial);
  setState((s) => ({ ...s, items: [item, ...s.items] }));
  return item;
}

export function updateItem(id: string, patch: Partial<Item>): void {
  setState((s) => ({
    ...s,
    items: s.items.map((it) => (it.id === id ? { ...it, ...patch, updatedAt: Date.now() } : it)),
  }));
}

export function deleteItem(id: string): void {
  setState((s) => ({
    ...s,
    items: s.items.filter((it) => it.id !== id),
    days: Object.fromEntries(
      Object.entries(s.days).map(([d, log]) => [d, { ...log, plan: log.plan.filter((p) => p.itemId !== id) }]),
    ),
  }));
}

export function completeItem(id: string): void {
  const now = Date.now();
  setState((s) => ({
    ...s,
    items: s.items.map((it) =>
      it.id === id ? { ...it, status: 'done', doneAt: now, updatedAt: now } : it,
    ),
    days: markPlanDoneInDays(s.days, id),
  }));
}

export function dropItem(id: string): void {
  setState((s) => ({
    ...s,
    items: s.items.map((it) =>
      it.id === id ? { ...it, status: 'dropped', updatedAt: Date.now() } : it,
    ),
  }));
}

export function restoreItem(id: string): void {
  setState((s) => ({
    ...s,
    items: s.items.map((it) =>
      it.id === id ? { ...it, status: 'pool', doneAt: null, updatedAt: Date.now() } : it,
    ),
  }));
}

// ---------- скелет быта: сроки и рутины ----------

export function reschedule(id: string, due: string | null): void {
  setState((s) => ({
    ...s,
    items: s.items.map((it) => (it.id === id ? { ...it, due, updatedAt: Date.now() } : it)),
  }));
}

export function setRepeat(id: string, repeat: RepeatKind): void {
  setState((s) => ({
    ...s,
    items: s.items.map((it) => (it.id === id ? { ...it, repeat, updatedAt: Date.now() } : it)),
  }));
}

/** Выполнение датированного дела: рутина сдвигает срок, обычное дело закрывается. */
export function completeDueItem(id: string): void {
  const it = state.items.find((x) => x.id === id);
  if (!it) return;
  if (it.repeat === 'none') {
    completeItem(id);
    return;
  }
  const base = it.due && it.due > todayISO() ? it.due : todayISO();
  setState((s) => ({
    ...s,
    items: s.items.map((x) =>
      x.id === id
        ? {
            ...x,
            due: advanceDate(base, x.repeat),
            lastDoneAt: Date.now(),
            updatedAt: Date.now(),
          }
        : x,
    ),
  }));
}

function markPlanDoneInDays(days: Record<string, DayLog>, itemId: string): Record<string, DayLog> {
  return Object.fromEntries(
    Object.entries(days).map(([d, log]) => [
      d,
      { ...log, plan: log.plan.map((p) => (p.itemId === itemId ? { ...p, done: true } : p)) },
    ]),
  );
}

// ---------- механизм 1: протокол избегания ----------

export function addProtocolRun(itemId: string, run: ProtocolRun): void {
  setState((s) => ({
    ...s,
    items: s.items.map((it) =>
      it.id === itemId
        ? {
            ...it,
            runs: [...it.runs, run].slice(-20),
            updatedAt: Date.now(),
            // после протокола уточняем профиль дела по факту
            ...(run.actual != null ? { resistance: Math.max(0, run.actual - 1) } : {}),
          }
        : it,
    ),
  }));
}

// ---------- механизм 2: день, бюджет, квота-шторка ----------

export function getDay(s: State, date = todayISO()): DayLog {
  return s.days[date] ?? emptyDay(date);
}

function withDay(fn: (day: DayLog) => DayLog): void {
  setState((s) => {
    const date = todayISO();
    const day = fn(s.days[date] ?? emptyDay(date));
    return { ...s, days: { ...s.days, [date]: day } };
  });
}

export function setEnergy(energy: number): void {
  withDay((d) => ({ ...d, energy }));
}

export function setEvening(evening: number): void {
  withDay((d) => ({ ...d, evening }));
}

/** Взять дело в план. joy — бесплатный слот «на радость» (не тратит бюджет). */
export function planAdd(itemId: string, joy = false): { ok: boolean; reason?: string } {
  const s = state;
  const day = getDay(s);
  const item = s.items.find((it) => it.id === itemId);
  if (!item) return { ok: false, reason: 'дело не найдено' };
  if (day.plan.some((p) => p.itemId === itemId)) return { ok: false, reason: 'уже в плане' };
  if (day.closed) return { ok: false, reason: 'день закрыт — шторка' };

  const nonJoy = day.plan.filter((p) => !p.joy);
  const quota = quotaFor(day.energy, s.settings.quotaMax);
  const budget = budgetFor(day.energy);

  if (!joy) {
    if (day.energy == null) return { ok: false, reason: 'сначала отметьте силы (чекин)' };
    if (nonJoy.length >= quota) return { ok: false, reason: `квота дня: ${quota} дел — набрано` };
    const spent = nonJoy.reduce((sum, p) => sum + (s.items.find((i) => i.id === p.itemId)?.cost ?? 0), 0);
    if (spent + item.cost > budget) {
      return { ok: false, reason: `бюджет сил исчерпан: ${spent}/${budget}` };
    }
  } else {
    if (day.plan.some((p) => p.joy)) return { ok: false, reason: 'слот «на радость» уже занят' };
  }

  const entry: PlanEntry = { itemId, joy, done: false };
  withDay((d) => ({ ...d, plan: [...d.plan, entry] }));
  return { ok: true };
}

export function planRemove(itemId: string): void {
  withDay((d) => ({ ...d, plan: d.plan.filter((p) => p.itemId !== itemId) }));
}

export function planComplete(itemId: string): void {
  withDay((d) => ({
    ...d,
    plan: d.plan.map((p) => (p.itemId === itemId ? { ...p, done: true } : p)),
  }));
  completeItem(itemId);
}

export function closeDay(): void {
  withDay((d) => ({ ...d, closed: true }));
}

export function reopenDay(): void {
  withDay((d) => ({ ...d, closed: false }));
}

// ---------- агрегаты для UI и «суда над страхом» ----------

export interface FearStats {
  runs: number;
  overstated: number; // страх преувеличил (predicted > actual)
  matched: number;
  worse: number; // факт хуже ожидания
}

export function fearStats(s: State): FearStats {
  const out: FearStats = { runs: 0, overstated: 0, matched: 0, worse: 0 };
  for (const it of s.items) {
    for (const r of it.runs) {
      if (r.actual == null) continue;
      out.runs += 1;
      if (r.predicted > r.actual) out.overstated += 1;
      else if (r.predicted === r.actual) out.matched += 1;
      else out.worse += 1;
    }
  }
  return out;
}

export function dayHistory(s: State, limit = 30): DayLog[] {
  return Object.values(s.days)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-limit);
}

export function poolItems(s: State): Item[] {
  return s.items.filter((it) => it.status === 'pool');
}

/** Датированные дела (не рутины), наступившие по сроку */
export function dueBucket(s: State): { overdue: Item[]; dueToday: Item[] } {
  const today = todayISO();
  const overdue: Item[] = [];
  const dueToday: Item[] = [];
  for (const it of s.items) {
    if (it.status !== 'pool' || !it.due || it.repeat !== 'none') continue;
    if (it.due < today) overdue.push(it);
    else if (it.due === today) dueToday.push(it);
  }
  overdue.sort((a, b) => (a.due ?? '').localeCompare(b.due ?? ''));
  return { overdue, dueToday };
}

/** Рутины, наступившие сегодня (включая просроченные) */
export function dueRoutines(s: State): { overdue: Item[]; dueToday: Item[] } {
  const today = todayISO();
  const overdue: Item[] = [];
  const dueToday: Item[] = [];
  for (const it of s.items) {
    if (it.status !== 'pool' || it.repeat === 'none' || !it.due) continue;
    if (it.due < today) overdue.push(it);
    else if (it.due === today) dueToday.push(it);
  }
  return { overdue, dueToday };
}
