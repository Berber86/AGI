import { describe, expect, it } from 'vitest';
import { PROTOCOL_VERSION, simulateFromRequest, validateBattleRequest, type BattleSimulateRequest } from '@/engine/remote/contract';
import { PROTOCOL_VERSION as V } from '@/engine/remote/contract';

const VALID: BattleSimulateRequest = {
  protocolVersion: PROTOCOL_VERSION,
  seed: 42,
  player: {
    units: [
      { id: 'p1', recruitId: 'knight', gear: { weapon: { defId: 'spiked_mace' }, armor: { defId: 'plate_cuirass' } }, line: 0, column: 2 },
      { id: 'p2', recruitId: 'archer', gear: { weapon: { defId: 'composite_bow' } }, line: 2, column: 4 },
    ],
  },
  enemy: {
    units: [
      { id: 'e1', recruitId: 'skeleton', line: 0, column: 2, statScale: 1.2 },
      { id: 'e2', recruitId: 'lich', line: 1, column: 4, statScale: 1.2 },
    ],
  },
};

describe('контракт POST /battle/simulate: валидация', () => {
  it('валидный запрос проходит', () => {
    expect(validateBattleRequest(VALID)).toBeNull();
  });

  it('версия протокола строго проверяется', () => {
    expect(validateBattleRequest({ ...VALID, protocolVersion: 999 })).toMatch(/протокола/);
  });

  it('неизвестный рекрут отвергается', () => {
    const bad = structuredClone(VALID);
    bad.enemy.units[0]!.recruitId = 'dragon_god';
    expect(validateBattleRequest(bad)).toMatch(/неизвестный рекрут/);
  });

  it('линия/колонка вне поля отвергаются', () => {
    const bad = structuredClone(VALID);
    bad.player.units[0]!.line = 7;
    expect(validateBattleRequest(bad)).toMatch(/линия/);
    const bad2 = structuredClone(VALID);
    bad2.player.units[0]!.column = -1;
    expect(validateBattleRequest(bad2)).toMatch(/колонка/);
  });

  it('предмет чужого слота отвергается', () => {
    const bad = structuredClone(VALID);
    bad.player.units[0]!.gear!.armor = { defId: 'rusty_sword' };
    expect(validateBattleRequest(bad)).toMatch(/другого слота/);
  });

  it('качество вне диапазона отвергается', () => {
    const bad = structuredClone(VALID);
    bad.player.units[0]!.gear!.weapon = { defId: 'spiked_mace', quality: 3 };
    expect(validateBattleRequest(bad)).toMatch(/качество/);
  });

  it('квестовые предметы нельзя подсунуть через контракт', () => {
    const bad = structuredClone(VALID);
    bad.player.units[0]!.gear!.trinket = { defId: 'phoenix_crown' };
    // Валидация пройдёт (предмет существует в словаре), но в сборке он отбрасывается.
    expect(validateBattleRequest(bad)).toBeNull();
    const resp = simulateFromRequest(bad);
    expect(resp.ok).toBe(true);
    const initial = resp.result!.initial as { id: string; rarity: string }[];
    const p1 = initial.find((u) => u.id === 'p1')!;
    expect(p1.rarity).toBe('rare'); // тринкет не надет: максимальная редкость осталась от брони
  });

  it('больше 3 отрядов — отказ (дизайн-константа)', () => {
    const bad = structuredClone(VALID);
    bad.player.units.push({ id: 'p4', recruitId: 'militia' });
    bad.player.units.push({ id: 'p5', recruitId: 'militia' });
    expect(validateBattleRequest(bad)).toMatch(/максимум 3/);
  });
});

describe('контракт: симуляция детерминирована и симметрична', () => {
  it('одинаковый seed → идентичный результат', () => {
    const a = simulateFromRequest(VALID);
    const b = simulateFromRequest(VALID);
    expect(a.ok).toBe(true);
    expect(b.ok).toBe(true);
    expect(a.result!.winner).toBe(b.result!.winner);
    expect(a.result!.events).toEqual(b.result!.events);
    expect(a.result!.rounds).toBe(b.result!.rounds);
  });

  it('ошибочный запрос → ok:false с текстом', () => {
    const bad = structuredClone(VALID);
    bad.enemy.units[0]!.recruitId = 'nope';
    const resp = simulateFromRequest(bad);
    expect(resp.ok).toBe(false);
    expect(resp.error).toMatch(/неизвестный рекрут/);
  });

  it('результат содержит события и состояния обеих сторон', () => {
    const resp = simulateFromRequest(VALID);
    expect(resp.ok).toBe(true);
    expect(resp.result!.events.length).toBeGreaterThan(3);
    const initial = resp.result!.initial as { side: string }[];
    expect(initial.filter((u) => u.side === 'player').length).toBe(2);
    expect(initial.filter((u) => u.side === 'enemy').length).toBe(2);
    void V;
  });
});
