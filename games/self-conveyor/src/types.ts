// ===== «По силам» — модель данных =====
// Два механизма:
//  1) Аффект-фильтр + протокол избегания (дело несёт предсказанную эмоцию; страх сверяется с фактом)
//  2) Бюджет сил + квота-шторка (день собирается по силам; квота закрывает день)

export type AffectKind = 'boredom' | 'anxiety' | 'heaviness' | 'confusion' | 'shame' | 'other' | 'none';

export const AFFECT_LABEL: Record<AffectKind, string> = {
  boredom: 'скука',
  anxiety: 'тревога',
  heaviness: 'тяжесть',
  confusion: 'непонятно как',
  shame: 'стыд / страх критики',
  other: 'другое',
  none: '—',
};

export const RESISTANCE_LABEL = ['нет', 'лёгкое', 'заметное', 'сильное'];

export const COST_LABEL: Record<1 | 2 | 3, string> = {
  1: 'лёгкое',
  2: 'среднее',
  3: 'тяжёлое',
};

/** Один запуск протокола избегания: что боялся → что было на самом деле */
export interface ProtocolRun {
  at: number;
  fear: string;
  microStep: string;
  predicted: number; // 0..3 — ожидаемая негативная эмоция
  actual: number | null; // 0..3 — факт после старта
}

export type RepeatKind = 'none' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';

export const REPEAT_LABEL: Record<RepeatKind, string> = {
  none: 'без повторов',
  daily: 'ежедневно',
  weekly: 'еженедельно',
  monthly: 'ежемесячно',
  quarterly: 'раз в квартал',
  yearly: 'раз в год',
};

export interface Item {
  id: string;
  title: string;
  notes: string;
  /** Стоимость в «мыслетопливе»: 1..3 */
  cost: 1 | 2 | 3;
  /** Ожидаемая эмоция от встречи с делом */
  affect: AffectKind;
  /** Уровень сопротивления 0..3 */
  resistance: number;
  /** Микро-шаг для протокола: «сделать плохо, на 2 минуты» */
  microStep: string;
  /** Кандидат в слот «на радость» (не тратит бюджет) */
  joy: boolean;
  /** Срок (YYYY-MM-DD). «Что будет, если просрочу? Ничего» → срока нет */
  due: string | null;
  /** Повтор: для рутин при выполнении срок сдвигается вперёд */
  repeat: RepeatKind;
  status: 'pool' | 'done' | 'dropped';
  createdAt: number;
  updatedAt: number;
  doneAt: number | null;
  /** Когда последний раз выполнялась рутина */
  lastDoneAt: number | null;
  runs: ProtocolRun[];
}

export interface PlanEntry {
  itemId: string;
  joy: boolean;
  done: boolean;
}

export interface DayLog {
  date: string; // YYYY-MM-DD
  energy: number | null; // 1..5
  plan: PlanEntry[];
  closed: boolean; // шторка
  evening: number | null; // 1..5 — «день удался»
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
  /** Максимум дел в дне (квота) */
  quotaMax: number;
}

export interface State {
  items: Item[];
  days: Record<string, DayLog>;
  settings: Settings;
  updatedAt: number;
}

// ---- правила «по силам» (чистые функции, покрыты тестами) ----

/** Бюджет дня в единицах стоимости = уровень сил (1..5) */
export function budgetFor(energy: number | null): number {
  if (energy == null) return 0;
  return Math.max(1, Math.min(5, Math.round(energy)));
}

/** Квота дел в дне: не больше quotaMax и не больше уровня сил */
export function quotaFor(energy: number | null, quotaMax: number): number {
  if (energy == null) return 0;
  return Math.max(1, Math.min(quotaMax, Math.round(energy)));
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function tomorrowISO(): string {
  return new Date(Date.now() + 86400000).toISOString().slice(0, 10);
}

/** Сдвиг срока по повтору (рутины) */
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

export function emptyDay(date: string): DayLog {
  return { date, energy: null, plan: [], closed: false, evening: null };
}
