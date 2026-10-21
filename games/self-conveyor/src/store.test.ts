// Тесты ядра «По силам»: бюджет сил, квота-шторка, протокол избегания, миграция.
import { describe, expect, it, beforeEach } from 'vitest';
import {
  addItem,
  addProtocolRun,
  closeDay,
  completeItem,
  defaultState,
  fearStats,
  getDay,
  getState,
  migrate,
  planAdd,
  planRemove,
  replaceState,
  setEnergy,
  makeItem,
} from './store';
import { budgetFor, quotaFor, todayISO, type State } from './types';

function fresh() {
  replaceState(defaultState());
  return getState();
}

describe('правила «по силам»', () => {
  it('бюджет = уровень сил (1..5)', () => {
    expect(budgetFor(null)).toBe(0);
    expect(budgetFor(1)).toBe(1);
    expect(budgetFor(3)).toBe(3);
    expect(budgetFor(5)).toBe(5);
  });

  it('квота = мин(силы, максимум), минимум 1', () => {
    expect(quotaFor(null, 4)).toBe(0);
    expect(quotaFor(5, 4)).toBe(4);
    expect(quotaFor(2, 4)).toBe(2);
    expect(quotaFor(1, 1)).toBe(1);
  });
});

describe('план дня: бюджет и квота', () => {
  beforeEach(fresh);

  it('без чекина сил дело в план не берётся', () => {
    const it = addItem({ title: 'а', cost: 1 });
    const res = planAdd(it.id);
    expect(res.ok).toBe(false);
    expect(res.reason).toContain('чекин');
  });

  it('квота ограничивает количество дел', () => {
    setEnergy(2); // квота 2, бюджет 2
    const a = addItem({ title: 'a', cost: 1 });
    const b = addItem({ title: 'b', cost: 1 });
    const c = addItem({ title: 'c', cost: 1 });
    expect(planAdd(a.id).ok).toBe(true);
    expect(planAdd(b.id).ok).toBe(true);
    const res = planAdd(c.id);
    expect(res.ok).toBe(false);
    expect(res.reason).toContain('квота');
  });

  it('бюджет сил ограничивает суммарную стоимость', () => {
    setEnergy(3); // квота 3, бюджет 3
    const heavy = addItem({ title: 'тяжёлое', cost: 3 });
    const light = addItem({ title: 'лёгкое', cost: 1 });
    expect(planAdd(heavy.id).ok).toBe(true);
    const res = planAdd(light.id);
    expect(res.ok).toBe(false);
    expect(res.reason).toContain('бюджет');
  });

  it('слот «на радость» бесплатный, но один', () => {
    setEnergy(1); // бюджет 1, квота 1 — обычное дело займёт всё
    const work = addItem({ title: 'работа', cost: 1 });
    const joy1 = addItem({ title: 'гитара', joy: true, cost: 3 });
    const joy2 = addItem({ title: 'кино', joy: true, cost: 3 });
    expect(planAdd(joy1.id, true).ok).toBe(true); // бесплатно
    expect(planAdd(work.id).ok).toBe(true); // бюджет ещё не тронут радостью
    const res = planAdd(joy2.id, true);
    expect(res.ok).toBe(false);
    expect(res.reason).toContain('радость');
  });

  it('шторка: закрытый день не принимает дела', () => {
    setEnergy(3);
    closeDay();
    const it = addItem({ title: 'поздно', cost: 1 });
    const res = planAdd(it.id);
    expect(res.ok).toBe(false);
    expect(res.reason).toContain('шторка');
  });

  it('planRemove освобождает место в квоте', () => {
    setEnergy(1);
    const a = addItem({ title: 'a', cost: 1 });
    const b = addItem({ title: 'b', cost: 1 });
    planAdd(a.id);
    expect(planAdd(b.id).ok).toBe(false);
    planRemove(a.id);
    expect(planAdd(b.id).ok).toBe(true);
  });
});

describe('механизм 1: протокол избегания', () => {
  beforeEach(fresh);

  it('сверка предсказания и факта попадает в статистику', () => {
    const it = addItem({ title: 'избегаемое', resistance: 3 });
    addProtocolRun(it.id, { at: Date.now(), fear: 'получится плохо', microStep: 'открыть файл', predicted: 3, actual: 1 });
    addProtocolRun(it.id, { at: Date.now(), fear: 'скучно', microStep: 'один абзац', predicted: 2, actual: 2 });

    const fs = fearStats(getState());
    expect(fs.runs).toBe(2);
    expect(fs.overstated).toBe(1); // 3→1: страх преувеличил
    expect(fs.matched).toBe(1);
    expect(fs.worse).toBe(0);
  });

  it('прогоны без сверки не считаются, но хранятся', () => {
    const it = addItem({ title: 'x' });
    addProtocolRun(it.id, { at: Date.now(), fear: 'f', microStep: 'm', predicted: 2, actual: null });
    expect(fearStats(getState()).runs).toBe(0);
    expect(getState().items[0].runs).toHaveLength(1);
  });

  it('факт уточняет сопротивление дела', () => {
    const it = addItem({ title: 'y', resistance: 3 });
    addProtocolRun(it.id, { at: Date.now(), fear: 'f', microStep: 'm', predicted: 3, actual: 1 });
    expect(getState().items[0].resistance).toBe(0); // max(0, 1-1)
  });
});

describe('завершение дела', () => {
  beforeEach(fresh);

  it('completeItem закрывает дело и галочку в плане дня', () => {
    setEnergy(3);
    const it = addItem({ title: 'сделать', cost: 1 });
    planAdd(it.id);
    completeItem(it.id);
    const closed = getState().items[0];
    expect(closed.status).toBe('done');
    expect(closed.doneAt).not.toBeNull();
    expect(getDay(getState()).plan[0].done).toBe(true);
    expect(getDay(getState()).date).toBe(todayISO());
  });
});

describe('миграция со старой схемы v1', () => {
  it('переносит дела из конвейера списков на склад', () => {
    const v1 = {
      items: [
        { id: 'a', title: 'написать книгу', notes: 'старое', list: 'projects', steps: [{ done: true }] },
        { id: 'b', title: 'сделано уже', list: 'done', completedAt: 123 },
      ],
      updatedAt: 1,
    } as unknown as State;
    const s = migrate(v1);
    expect(s.items).toHaveLength(2);
    expect(s.items.find((i) => i.id === 'a')?.status).toBe('pool');
    expect(s.items.find((i) => i.id === 'a')?.cost).toBe(2); // дефолт
    expect(s.items.find((i) => i.id === 'b')?.status).toBe('done');
    expect(s.items.find((i) => i.id === 'b')?.doneAt).toBe(123);
    expect(s.settings.quotaMax).toBe(4);
  });

  it('makeItem: дефолты нового типа', () => {
    const it = makeItem({ title: 'т' });
    expect(it.cost).toBe(2);
    expect(it.affect).toBe('none');
    expect(it.resistance).toBe(0);
    expect(it.runs).toEqual([]);
    expect(it.status).toBe('pool');
  });
});
