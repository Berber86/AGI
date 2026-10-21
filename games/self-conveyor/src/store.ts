// ===== Глобальный стор (useSyncExternalStore) + действия конвейера =====
import { useSyncExternalStore } from 'react';
import {
  advanceDate,
  todayISO,
  uid,
  DEFAULT_WHEEL_AREAS,
  type AnyList,
  type HadiEntry,
  type Item,
  type JournalEntry,
  type MainList,
  type Metric,
  type RepeatKind,
  type Settings,
  type State,
  type Step,
  type WheelArea,
  MAIN_ORDER,
} from './types';
import { loadLocal, saveLocal, cloudSave, firebaseReady } from './persistence';

export function defaultSettings(): Settings {
  return {
    llm: {
      baseUrl: 'https://openrouter.ai/api/v1',
      apiKey: '',
      model: 'openai/gpt-4o-mini',
    },
    firebase: { apiKey: '', authDomain: '', projectId: '', appId: '' },
    pomodoroWork: 25,
    pomodoroBreak: 5,
  };
}

export function defaultState(): State {
  return {
    items: [],
    wheel: DEFAULT_WHEEL_AREAS.map((a) => ({ ...a, id: uid() })),
    metrics: [],
    journal: [],
    hadis: [],
    retroNotes: [],
    metaprojects: [],
    settings: defaultSettings(),
    updatedAt: Date.now(),
  };
}

function migrate(raw: State | null): State {
  if (!raw) return defaultState();
  const base = defaultState();
  return {
    ...base,
    ...raw,
    settings: {
      ...base.settings,
      ...(raw.settings ?? {}),
      llm: { ...base.settings.llm, ...(raw.settings?.llm ?? {}) },
      firebase: { ...base.settings.firebase, ...(raw.settings?.firebase ?? {}) },
    },
  };
}

let state: State = migrate(loadLocal());
const listeners = new Set<() => void>();
let saveTimer: ReturnType<typeof setTimeout> | null = null;

function persist() {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    saveLocal(state);
    if (firebaseReady(state.settings.firebase)) {
      cloudSave(state).catch((e) => console.warn('cloud autosave skipped:', e?.message ?? e));
    }
  }, 500);
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

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useApp(): State {
  return useSyncExternalStore(subscribe, getState, getState);
}

// ---------- items ----------

export function makeItem(partial: Partial<Item>): Item {
  const now = Date.now();
  return {
    id: uid(),
    title: '',
    notes: '',
    list: 'desires',
    steps: [],
    criteria: '',
    result: '',
    tags: [],
    repeat: 'none',
    nextDue: null,
    inToday: false,
    lastDoneAt: null,
    origin: 'manual',
    createdAt: now,
    updatedAt: now,
    completedAt: null,
    ...partial,
  };
}

export function addItem(partial: Partial<Item>): Item {
  const item = makeItem(partial);
  setState((s) => ({ ...s, items: [item, ...s.items] }));
  return item;
}

export function addItems(partials: Partial<Item>[]): void {
  const now = Date.now();
  const made = partials.map((p) => makeItem({ ...p, createdAt: now, updatedAt: now }));
  setState((s) => ({ ...s, items: [...made, ...s.items] }));
}

export function updateItem(id: string, patch: Partial<Item>): void {
  setState((s) => ({
    ...s,
    items: s.items.map((it) => (it.id === id ? { ...it, ...patch, updatedAt: Date.now() } : it)),
  }));
}

export function deleteItem(id: string): void {
  setState((s) => ({ ...s, items: s.items.filter((it) => it.id !== id) }));
}

export function moveItem(id: string, list: AnyList): void {
  setState((s) => ({
    ...s,
    items: s.items.map((it) =>
      it.id === id
        ? {
            ...it,
            list,
            updatedAt: Date.now(),
            completedAt: list === 'done' ? Date.now() : it.completedAt,
          }
        : it,
    ),
  }));
}

export function moveForward(id: string): void {
  const it = state.items.find((x) => x.id === id);
  if (!it) return;
  const idx = MAIN_ORDER.indexOf(it.list as MainList);
  if (idx < 0 || idx >= MAIN_ORDER.length - 1) return;
  moveItem(id, MAIN_ORDER[idx + 1]);
}

export function copyTemplateToProject(id: string): void {
  const it = state.items.find((x) => x.id === id);
  if (!it) return;
  const copy = makeItem({
    ...it,
    id: uid(),
    title: it.title,
    list: 'projects',
    steps: it.steps.map((st) => ({ ...st, id: uid(), done: false, inToday: false })),
    createdAt: Date.now(),
    updatedAt: Date.now(),
    completedAt: null,
    origin: 'template',
  });
  setState((s) => ({ ...s, items: [copy, ...s.items] }));
}

// ---------- steps ----------

export function addStep(itemId: string, title: string): void {
  const step: Step = { id: uid(), title, done: false, inToday: false };
  setState((s) => ({
    ...s,
    items: s.items.map((it) =>
      it.id === itemId ? { ...it, steps: [...it.steps, step], updatedAt: Date.now() } : it,
    ),
  }));
}

export function updateStep(itemId: string, stepId: string, patch: Partial<Step>): void {
  setState((s) => ({
    ...s,
    items: s.items.map((it) =>
      it.id === itemId
        ? {
            ...it,
            updatedAt: Date.now(),
            steps: it.steps.map((st) => (st.id === stepId ? { ...st, ...patch } : st)),
          }
        : it,
    ),
  }));
}

export function deleteStep(itemId: string, stepId: string): void {
  setState((s) => ({
    ...s,
    items: s.items.map((it) =>
      it.id === itemId ? { ...it, steps: it.steps.filter((st) => st.id !== stepId) } : it,
    ),
  }));
}

export function completeRoutine(id: string): void {
  setState((s) => ({
    ...s,
    items: s.items.map((it) => {
      if (it.id !== id) return it;
      const base = it.nextDue ?? todayISO();
      const nextDue = it.repeat === 'none' ? it.nextDue : advanceDate(base, it.repeat);
      return { ...it, nextDue, lastDoneAt: Date.now(), updatedAt: Date.now() };
    }),
  }));
}

// ---------- wheel ----------

export function updateWheelArea(id: string, patch: Partial<WheelArea>): void {
  setState((s) => ({
    ...s,
    wheel: s.wheel.map((a) => (a.id === id ? { ...a, ...patch } : a)),
  }));
}

export function addWheelArea(name: string): void {
  const area: WheelArea = { id: uid(), name, score: 5, current: '', ideal: '', next: '' };
  setState((s) => ({ ...s, wheel: [...s.wheel, area] }));
}

export function removeWheelArea(id: string): void {
  setState((s) => ({ ...s, wheel: s.wheel.filter((a) => a.id !== id) }));
}

// ---------- metrics ----------

export function addMetric(name: string, unit: string): void {
  const m: Metric = { id: uid(), name, unit, points: [] };
  setState((s) => ({ ...s, metrics: [...s.metrics, m] }));
}

export function updateMetric(id: string, patch: Partial<Metric>): void {
  setState((s) => ({
    ...s,
    metrics: s.metrics.map((m) => (m.id === id ? { ...m, ...patch } : m)),
  }));
}

export function deleteMetric(id: string): void {
  setState((s) => ({ ...s, metrics: s.metrics.filter((m) => m.id !== id) }));
}

export function addMetricPoint(id: string, value: number): void {
  setState((s) => ({
    ...s,
    metrics: s.metrics.map((m) =>
      m.id === id ? { ...m, points: [...m.points, { t: Date.now(), v: value }].slice(-500) } : m,
    ),
  }));
}

// ---------- journal / hadi / retro / meta ----------

export function addJournalEntry(kind: JournalEntry['kind'], text: string): void {
  const e: JournalEntry = { id: uid(), kind, date: todayISO(), text };
  setState((s) => ({ ...s, journal: [e, ...s.journal] }));
}

export function deleteJournalEntry(id: string): void {
  setState((s) => ({ ...s, journal: s.journal.filter((e) => e.id !== id) }));
}

export function addHadi(hypothesis: string): HadiEntry {
  const h: HadiEntry = {
    id: uid(),
    hypothesis,
    action: '',
    data: '',
    insight: '',
    status: 'open',
    createdAt: Date.now(),
  };
  setState((s) => ({ ...s, hadis: [h, ...s.hadis] }));
  return h;
}

export function updateHadi(id: string, patch: Partial<HadiEntry>): void {
  setState((s) => ({
    ...s,
    hadis: s.hadis.map((h) => (h.id === id ? { ...h, ...patch } : h)),
  }));
}

export function deleteHadi(id: string): void {
  setState((s) => ({ ...s, hadis: s.hadis.filter((h) => h.id !== id) }));
}

export function addRetroNote(text: string): void {
  setState((s) => ({
    ...s,
    retroNotes: [{ id: uid(), date: todayISO(), text }, ...s.retroNotes],
  }));
}

export function deleteRetroNote(id: string): void {
  setState((s) => ({ ...s, retroNotes: s.retroNotes.filter((n) => n.id !== id) }));
}

export function addMetaproject(name: string): void {
  const t = name.trim();
  if (!t) return;
  setState((s) => (s.metaprojects.includes(t) ? s : { ...s, metaprojects: [...s.metaprojects, t] }));
}

export function removeMetaproject(name: string): void {
  setState((s) => ({
    ...s,
    metaprojects: s.metaprojects.filter((m) => m !== name),
    items: s.items.map((it) => ({ ...it, tags: it.tags.filter((t) => t !== name) })),
  }));
}

// ---------- settings ----------

export function updateSettings(patch: Partial<Settings>): void {
  setState((s) => ({ ...s, settings: { ...s.settings, ...patch } }));
}

// ---------- выборки для UI ----------

export interface TodayTask {
  kind: 'step' | 'item' | 'routine';
  item: Item;
  step?: Step;
  overdue: boolean;
}

export function isDoneToday(it: Item): boolean {
  return it.completedAt != null && new Date(it.completedAt).toISOString().slice(0, 10) === todayISO();
}

export function collectToday(s: State): { open: TodayTask[]; done: TodayTask[] } {
  const today = todayISO();
  const open: TodayTask[] = [];
  const done: TodayTask[] = [];
  for (const item of s.items) {
    if (item.list === 'done' || item.list === 'templates') continue;
    // Шаги проектов, взятые в план дня
    if (item.steps.length > 0) {
      for (const step of item.steps) {
        if (!step.inToday) continue;
        (step.done ? done : open).push({ kind: 'step', item, step, overdue: false });
      }
    }
    // Дела из служебных списков: взято вручную или наступила дата (срочные/рутины)
    const dueToday =
      (item.list === 'routines' || item.list === 'urgent') &&
      !!item.nextDue &&
      item.nextDue <= today;
    const flagged = item.inToday && item.steps.length === 0 && item.list !== 'projects';
    if (dueToday || flagged) {
      const overdue = dueToday && !!item.nextDue && item.nextDue < today;
      open.push({ kind: item.list === 'routines' ? 'routine' : 'item', item, overdue });
    }
    // Рутины, уже выполненные сегодня (дата сдвинута вперёд, но след виден)
    if (item.list === 'routines' && item.lastDoneAt && isDoneAt(item.lastDoneAt)) {
      done.push({ kind: 'routine', item, overdue: false });
    }
  }
  // Карточки, закрытые сегодня из любого места
  for (const item of s.items) {
    if (item.list === 'done' && isDoneToday(item)) {
      done.push({ kind: 'item', item, overdue: false });
    }
  }
  return { open, done };
}

function isDoneAt(t: number): boolean {
  return new Date(t).toISOString().slice(0, 10) === todayISO();
}

/** Все невыполненные шаги проекта — в «Сегодня» */
export function takeAllStepsToToday(itemId: string): number {
  const it = state.items.find((x) => x.id === itemId);
  if (!it) return 0;
  const targets = it.steps.filter((st) => !st.done && !st.inToday);
  if (!targets.length) return 0;
  const ids = new Set(targets.map((t) => t.id));
  setState((s) => ({
    ...s,
    items: s.items.map((x) =>
      x.id === itemId
        ? { ...x, updatedAt: Date.now(), steps: x.steps.map((st) => (ids.has(st.id) ? { ...st, inToday: true } : st)) }
        : x,
    ),
  }));
  return targets.length;
}

/** Проект готов к проверке: есть шаги и все они выполнены */
export function isProjectReady(it: Item): boolean {
  return it.steps.length > 0 && it.steps.every((st) => st.done);
}

export function completeItem(id: string, patch?: Partial<Item>): void {
  setState((s) => ({
    ...s,
    items: s.items.map((it) =>
      it.id === id
        ? { ...it, ...patch, list: 'done', inToday: false, completedAt: Date.now(), updatedAt: Date.now() }
        : it,
    ),
  }));
}

export function prioritiesFull(s: State): boolean {
  return s.items.filter((it) => it.list === 'priorities').length >= 5;
}

/** Число карточек в списке (для счётчиков колонок) */
export function countByList(s: State): Record<string, number> {
  const out: Record<string, number> = {};
  for (const it of s.items) out[it.list] = (out[it.list] ?? 0) + 1;
  return out;
}
