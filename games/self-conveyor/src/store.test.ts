// Тесты ядра конвейера (этап 1 — база): чистая логика без DOM.
import { describe, expect, it, beforeEach } from 'vitest';
import {
  addItem,
  addStep,
  completeItem,
  completeRoutine,
  collectToday,
  defaultState,
  getState,
  isProjectReady,
  moveForward,
  moveItem,
  prioritiesFull,
  replaceState,
  takeAllStepsToToday,
  updateItem,
  updateStep,
  makeItem,
} from './store';
import { advanceDate, todayISO, type Item, type State } from './types';

function fresh() {
  replaceState(defaultState());
  return getState();
}

function seed(partial: Partial<Item>): Item {
  return addItem(partial);
}

describe('advanceDate', () => {
  it('daily / weekly / monthly / quarterly / yearly', () => {
    expect(advanceDate('2026-10-21', 'daily')).toBe('2026-10-22');
    expect(advanceDate('2026-10-21', 'weekly')).toBe('2026-10-28');
    expect(advanceDate('2026-10-21', 'monthly')).toBe('2026-11-21');
    expect(advanceDate('2026-10-21', 'quarterly')).toBe('2027-01-21');
    expect(advanceDate('2026-10-21', 'yearly')).toBe('2027-10-21');
  });

  it('none keeps date', () => {
    expect(advanceDate('2026-10-21', 'none')).toBe('2026-10-21');
  });
});

describe('makeItem defaults', () => {
  it('has sane defaults', () => {
    const it = makeItem({ title: 'тест' });
    expect(it.list).toBe('desires');
    expect(it.steps).toEqual([]);
    expect(it.tags).toEqual([]);
    expect(it.repeat).toBe('none');
    expect(it.nextDue).toBeNull();
    expect(it.inToday).toBe(false);
    expect(it.completedAt).toBeNull();
  });
});

describe('конвейер: движение по спискам', () => {
  beforeEach(fresh);

  it('moveForward ведёт по цепочке desires→…→done', () => {
    const it = seed({ title: 'хочу дом' });
    expect(it.list).toBe('desires');
    moveForward(it.id);
    expect(getState().items[0].list).toBe('filtered');
    moveForward(it.id);
    expect(getState().items[0].list).toBe('priorities');
    moveForward(it.id);
    expect(getState().items[0].list).toBe('goals');
    moveForward(it.id);
    expect(getState().items[0].list).toBe('projects');
  });

  it('из done назад через moveForward не идёт', () => {
    const it = seed({ title: 'x', list: 'done' });
    moveForward(it.id);
    expect(getState().items[0].list).toBe('done');
  });

  it('ТОП-5: максимум 5 приоритетов', () => {
    for (let i = 0; i < 6; i++) seed({ title: `ж${i}`, list: 'filtered' });
    const items = getState().items;
    items.slice(0, 5).forEach((it) => moveItem(it.id, 'priorities'));
    expect(prioritiesFull(getState())).toBe(true);
    expect(getState().items.filter((i) => i.list === 'priorities')).toHaveLength(5);
  });

  it('moveItem в done ставит completedAt', () => {
    const it = seed({ title: 'x' });
    moveItem(it.id, 'done');
    expect(getState().items[0].completedAt).not.toBeNull();
  });
});

describe('шаги и проекты', () => {
  beforeEach(fresh);

  it('takeAllStepsToToday берёт только невыполненные', () => {
    const it = seed({ title: 'проект', list: 'projects' });
    addStep(it.id, 'шаг1');
    addStep(it.id, 'шаг2');
    addStep(it.id, 'шаг3');
    const steps = getState().items[0].steps;
    updateStep(it.id, steps[0].id, { done: true });
    const n = takeAllStepsToToday(it.id);
    expect(n).toBe(2);
    const after = getState().items[0].steps;
    expect(after[0].inToday).toBe(false); // выполненный не берём
    expect(after[1].inToday).toBe(true);
    expect(after[2].inToday).toBe(true);
  });

  it('isProjectReady: все шаги выполнены', () => {
    const it = seed({ title: 'п', list: 'projects' });
    expect(isProjectReady(getState().items[0])).toBe(false); // шагов нет
    addStep(it.id, 'а');
    addStep(it.id, 'б');
    expect(isProjectReady(getState().items[0])).toBe(false);
    getState().items[0].steps.forEach((s) => updateStep(it.id, s.id, { done: true }));
    expect(isProjectReady(getState().items[0])).toBe(true);
  });

  it('completeItem закрывает в done с completedAt', () => {
    const it = seed({ title: 'ц', list: 'projects' });
    completeItem(it.id);
    const closed = getState().items[0];
    expect(closed.list).toBe('done');
    expect(closed.completedAt).not.toBeNull();
    expect(closed.inToday).toBe(false);
  });
});

describe('Сегодня: сборка плана', () => {
  beforeEach(fresh);

  it('шаги inToday попадают в план, done — в сделанное', () => {
    const it = seed({ title: 'проект', list: 'projects' });
    addStep(it.id, 'сделать');
    const stepId = getState().items[0].steps[0].id;
    updateStep(it.id, stepId, { inToday: true });
    let t = collectToday(getState());
    expect(t.open).toHaveLength(1);
    expect(t.open[0].kind).toBe('step');

    updateStep(it.id, stepId, { done: true });
    t = collectToday(getState());
    expect(t.open).toHaveLength(0);
    expect(t.done).toHaveLength(1);
  });

  it('просроченная рутина помечается overdue, сегодняшняя — нет', () => {
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    seed({ title: 'вчера', list: 'routines', repeat: 'weekly', nextDue: yesterday });
    seed({ title: 'сегодня', list: 'routines', repeat: 'weekly', nextDue: todayISO() });
    const t = collectToday(getState());
    expect(t.open).toHaveLength(2);
    const overdue = t.open.filter((x) => x.overdue);
    expect(overdue).toHaveLength(1);
    expect(overdue[0].item.title).toBe('вчера');
  });

  it('рутина без наступившей даты не падает в план', () => {
    seed({ title: 'позже', list: 'routines', repeat: 'weekly', nextDue: '2099-01-01' });
    expect(collectToday(getState()).open).toHaveLength(0);
  });

  it('карточка закрытая сегодня видна в «Сделано»', () => {
    const it = seed({ title: 'взял', list: 'someday', inToday: true });
    expect(collectToday(getState()).open).toHaveLength(1);
    completeItem(it.id);
    const t = collectToday(getState());
    expect(t.open).toHaveLength(0);
    expect(t.done).toHaveLength(1);
    expect(t.done[0].item.title).toBe('взял');
  });

  it('completeRoutine двигает дату и пишет lastDoneAt', () => {
    seed({ title: 'замер', list: 'routines', repeat: 'monthly', nextDue: todayISO() });
    const id = getState().items[0].id;
    completeRoutine(id);
    const r = getState().items[0];
    expect(r.nextDue).not.toBe(todayISO());
    expect(r.lastDoneAt).not.toBeNull();
    // выполненная сегодня рутина видна в «Сделано»
    expect(collectToday(getState()).done.some((d) => d.item.id === id && d.kind === 'routine')).toBe(true);
  });

  it('шаблоны не попадают в план дня', () => {
    seed({ title: 'шаблон', list: 'templates', inToday: true });
    expect(collectToday(getState()).open).toHaveLength(0);
  });
});

describe('хранилище: миграция состояния', () => {
  it('replaceState поднимает недостающие поля', () => {
    const broken = { items: [], updatedAt: Date.now() } as unknown as State;
    replaceState(broken);
    const s = getState();
    expect(s.settings.llm.baseUrl).toBeTruthy();
    expect(s.settings.pomodoroWork).toBe(25);
    expect(Array.isArray(s.wheel)).toBe(true);
  });
});
