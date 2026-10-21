// ===== Модель данных «Конвейера управления собой» =====

export type MainList = 'desires' | 'filtered' | 'priorities' | 'goals' | 'projects' | 'done';
export type SideList = 'urgent' | 'someday' | 'routines' | 'templates';
export type AnyList = MainList | SideList;

export const MAIN_ORDER: MainList[] = ['desires', 'filtered', 'priorities', 'goals', 'projects', 'done'];

export const LIST_LABEL: Record<AnyList, string> = {
  desires: 'Желания',
  filtered: 'Отфильтрованные',
  priorities: 'Приоритетные (ТОП-5)',
  goals: 'Цели',
  projects: 'Проекты',
  done: 'Сделано',
  urgent: 'Срочные',
  someday: 'Несрочные',
  routines: 'Рутины',
  templates: 'Шаблоны',
};

export const LIST_HINT: Record<AnyList, string> = {
  desires: 'Вход конвейера: всё, чего хочется',
  filtered: 'Прошли отбор «нужно ли это на самом деле?»',
  priorities: 'Строго 5 фокусов. Остальное — в игнор',
  goals: 'Сформулированы: что сделать / измеримо / достижимо',
  projects: 'Цель + атомарные шаги',
  done: 'Архив результатов',
  urgent: 'Есть дата, после которой бессмысленно',
  someday: 'Без срока. Могут ждать',
  routines: 'Повторяются периодически',
  templates: 'Чек-листы для непериодических повторов',
};

export type RepeatKind = 'none' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';

export const REPEAT_LABEL: Record<RepeatKind, string> = {
  none: 'без повторов',
  daily: 'ежедневно',
  weekly: 'еженедельно',
  monthly: 'ежемесячно',
  quarterly: 'раз в квартал',
  yearly: 'раз в год',
};

export interface Step {
  id: string;
  title: string;
  done: boolean;
  inToday: boolean;
}

export interface Item {
  id: string;
  title: string;
  notes: string;
  list: AnyList;
  steps: Step[];
  /** Критерий достижения (измеримый) */
  criteria: string;
  /** Осязаемый результат — защита от ложной продуктивности */
  result: string;
  tags: string[];
  repeat: RepeatKind;
  /** 'YYYY-MM-DD' — дата для срочных/рутин */
  nextDue: string | null;
  /** Взято ли дело «на сегодня» (для не-проектных списков) */
  inToday: boolean;
  /** Когда последний раз выполнялась рутина */
  lastDoneAt: number | null;
  /** Откуда взялось: wheel / deathbed / diagnosis / immortality / dead / inbox / manual */
  origin: string;
  createdAt: number;
  updatedAt: number;
  completedAt: number | null;
}

export interface WheelArea {
  id: string;
  name: string;
  score: number;
  current: string;
  ideal: string;
  next: string;
}

export interface MetricPoint {
  t: number;
  v: number;
}

export interface Metric {
  id: string;
  name: string;
  unit: string;
  points: MetricPoint[];
}

export interface JournalEntry {
  id: string;
  kind: 'success' | 'fear';
  date: string;
  text: string;
}

export interface HadiEntry {
  id: string;
  hypothesis: string;
  action: string;
  data: string;
  insight: string;
  status: 'open' | 'confirmed' | 'rejected';
  createdAt: number;
}

export interface RetroNote {
  id: string;
  date: string;
  text: string;
}

export interface LLMCfg {
  baseUrl: string;
  apiKey: string;
  model: string;
}

export interface FirebaseCfg {
  apiKey: string;
  authDomain: string;
  projectId: string;
  appId: string;
}

export interface Settings {
  llm: LLMCfg;
  firebase: FirebaseCfg;
  pomodoroWork: number;
  pomodoroBreak: number;
}

export interface State {
  items: Item[];
  wheel: WheelArea[];
  metrics: Metric[];
  journal: JournalEntry[];
  hadis: HadiEntry[];
  retroNotes: RetroNote[];
  metaprojects: string[];
  settings: Settings;
  updatedAt: number;
}

export const DEFAULT_WHEEL_AREAS: Omit<WheelArea, 'id'>[] = [
  { name: 'Карьера / бизнес', score: 5, current: '', ideal: '', next: '' },
  { name: 'Финансы', score: 5, current: '', ideal: '', next: '' },
  { name: 'Здоровье и внешность', score: 5, current: '', ideal: '', next: '' },
  { name: 'Семья и отношения', score: 5, current: '', ideal: '', next: '' },
  { name: 'Саморазвитие', score: 5, current: '', ideal: '', next: '' },
  { name: 'Отдых и развлечения', score: 5, current: '', ideal: '', next: '' },
  { name: 'Творчество', score: 5, current: '', ideal: '', next: '' },
  { name: 'Общение', score: 5, current: '', ideal: '', next: '' },
];

export function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function advanceDate(iso: string, repeat: RepeatKind): string {
  const d = new Date(iso + 'T12:00:00');
  switch (repeat) {
    case 'daily':
      d.setDate(d.getDate() + 1);
      break;
    case 'weekly':
      d.setDate(d.getDate() + 7);
      break;
    case 'monthly':
      d.setMonth(d.getMonth() + 1);
      break;
    case 'quarterly':
      d.setMonth(d.getMonth() + 3);
      break;
    case 'yearly':
      d.setFullYear(d.getFullYear() + 1);
      break;
    default:
      break;
  }
  return d.toISOString().slice(0, 10);
}
