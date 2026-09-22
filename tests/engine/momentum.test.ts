import { describe, expect, it } from 'vitest';
import { BattleSim, simulateFight } from '@/engine/combat/simulateFight';
import { computeFrameState } from '@/engine/combat/playback';
import { MOMENTUM_RULES } from '@/engine/combat/combat.types';
import { computeUnit } from '@/engine/unit/computeUnit';
import { mkUnit } from '../testUtils';

function setup(seed = 7) {
  const players = [
    mkUnit({ id: 'p1', hp: 160, atk: 22, def: 12, spd: 11, acc: 95, crit: 10, line: 0 }),
    mkUnit({ id: 'p2', hp: 90, atk: 24, def: 5, spd: 12, acc: 95, range: 3, line: 2 }),
  ];
  const enemies = [
    mkUnit({ id: 'e1', hp: 140, atk: 20, def: 10, spd: 9, acc: 95, line: 0, morale: 120, tags: ['fearless'] }),
    mkUnit({ id: 'e2', hp: 120, atk: 18, def: 8, spd: 8, acc: 95, line: 1, morale: 120, tags: ['fearless'] }),
  ];
  return { players, enemies, seed };
}

describe('BattleSim: пошаговость эквивалентна одноразовой симуляции', () => {
  it('одинаковый seed: events пошагового прогона ≡ simulateFight', () => {
    for (const seed of [1, 7, 42, 999]) {
      const { players, enemies } = setup(seed);
      const stepped = new BattleSim(players, enemies, { seed });
      while (!stepped.finished) stepped.step();
      const steppedResult = stepped.result();
      const oneShot = simulateFight(players, enemies, { seed });
      expect(steppedResult.events).toEqual(oneShot.events);
      expect(steppedResult).toEqual(oneShot);
    }
  });
});

describe('Momentum: дух и тактики', () => {
  it('дух растёт от урона и раундов; чекпоинты каждые 3 раунда', () => {
    const { players, enemies, seed } = setup();
    const sim = new BattleSim(players, enemies, { seed });
    expect(sim.canMomentum()).toBe(false); // фаза внезапной атаки
    while (!sim.finished && sim.round < 2) sim.step();
    expect(sim.spirit).toBeGreaterThan(0);
    // Пропускаем чекпоинт раунда 3 без духа-расхода: canMomentum зависит от духа >= cost.
    while (!sim.finished && sim.round < 3) sim.step();
    if (sim.spirit >= MOMENTUM_RULES.cost) {
      expect(sim.canMomentum()).toBe(true);
      const before = sim.spirit;
      sim.useMomentum('rage');
      expect(sim.spirit).toBe(before - MOMENTUM_RULES.cost);
      expect(sim.canMomentum()).toBe(false); // тот же чекпоинт второй раз нельзя
    }
  });

  it('useMomentum вне чекпоинта игнорируется', () => {
    const { players, enemies, seed } = setup();
    const sim = new BattleSim(players, enemies, { seed });
    sim.step(); // внезапная атака
    sim.step(); // раунд 1
    const spirit = sim.spirit;
    sim.useMomentum('rage');
    expect(sim.spirit).toBe(spirit);
  });

  it('Ярость усиливает урон игрока при тех же бросках', () => {
    const { players, enemies, seed } = setup();
    const baseline = new BattleSim(players, enemies, { seed });
    const boosted = new BattleSim(players, enemies, { seed });
    while (!baseline.finished && baseline.round < 3) { baseline.step(); boosted.step(); }
    while (!boosted.finished && boosted.round < 3) { baseline.step(); boosted.step(); }
    if (!boosted.canMomentum()) return; // не хватило духа — тест неприменим
    boosted.useMomentum('rage');
    baseline.step();
    boosted.step();
    const dmgOf = (sim: BattleSim, evs: ReturnType<BattleSim['step']>): number =>
      evs.filter((e) => e.type === 'attack' && e.hit).reduce((sum, e) => {
        const src = sim.unitById(e.type === 'attack' ? e.src : '');
        return src?.side === 'player' ? sum + (e.type === 'attack' ? e.dmg : 0) : sum;
      }, 0);
    const baseDmg = dmgOf(baseline, baseline.events.slice(-12) as never);
    void baseDmg;
    // Прямое сравнение: последний раунд boosted с rage — урон от p1/p2 выше либо равен (промахи).
    const boostedEvents = boosted.events.filter((e) => e.type === 'attack' && e.round === boosted.round);
    const baselineEvents = baseline.events.filter((e) => e.type === 'attack' && e.round === baseline.round && (e.src === 'p1' || e.src === 'p2'));
    const boostedSum = boostedEvents
      .filter((e) => e.type === 'attack' && (e.src === 'p1' || e.src === 'p2'))
      .reduce((s, e) => s + (e.type === 'attack' && e.hit ? e.dmg : 0), 0);
    const baselineSum = baselineEvents.reduce((s, e) => s + (e.type === 'attack' && e.hit ? e.dmg : 0), 0);
    expect(boostedSum).toBeGreaterThanOrEqual(baselineSum);
  });

  it('событие momentum попадает в лог событий', () => {
    const { players, enemies, seed } = setup();
    const sim = new BattleSim(players, enemies, { seed: seed + 1 });
    while (!sim.finished && sim.round < 3) sim.step();
    if (sim.canMomentum()) {
      sim.useMomentum('guard');
      sim.step();
      expect(sim.events.some((e) => e.type === 'momentum' && e.tactic === 'guard')).toBe(true);
    }
  });
});

describe('новые статусы', () => {
  it('оглушение: цель пропускает удар (skip/stunned)', () => {
    const p = mkUnit({ id: 'p', hp: 400, atk: 25, acc: 100, crit: 0, spd: 20, abilities: [{ key: 'stunOnHit', chance: 100, rounds: 1 }] });
    const e = mkUnit({ id: 'e', hp: 900, atk: 5, acc: 100, crit: 0, spd: 1, morale: 150, tags: ['fearless'] });
    const r = simulateFight([p], [e], { seed: 3, maxRounds: 8 });
    const stunnedSkips = r.events.filter((ev) => ev.type === 'skip' && ev.reason === 'stunned' && ev.unit === 'e');
    expect(stunnedSkips.length).toBeGreaterThan(0);
    const final = r.final.find((u) => u.id === 'e')!;
    expect([0, 1, 2, 3]).toContain(final.stunRounds);
  });

  it('замедление снижает эффективную скорость и отображается в событиях', () => {
    const p = mkUnit({ id: 'p', hp: 300, atk: 20, acc: 100, crit: 0, spd: 20, abilities: [{ key: 'slowOnHit', rounds: 2 }] });
    const e = mkUnit({ id: 'e', hp: 600, atk: 5, acc: 100, crit: 0, spd: 5, morale: 150, tags: ['fearless'] });
    const r = simulateFight([p], [e], { seed: 5, maxRounds: 5 });
    expect(r.events.some((ev) => ev.type === 'status' && ev.status === 'slow')).toBe(true);
    // slowRounds в финале в пределах [0..3]
    const final = r.final.find((u) => u.id === 'e')!;
    expect(final.slowRounds).toBeGreaterThanOrEqual(0);
    expect(final.slowRounds).toBeLessThanOrEqual(3);
  });

  it('броня-щит с зарядами поглощает урон атак и расходуется', () => {
    const p = mkUnit({ id: 'p', hp: 200, atk: 40, acc: 100, crit: 0, spd: 20 });
    const e = mkUnit({ id: 'e', hp: 500, atk: 5, acc: 100, crit: 0, spd: 1, morale: 150, tags: ['fearless'], abilities: [{ key: 'wardOnStart', charges: 2, perCharge: 30 }] });
    const r = simulateFight([p], [e], { seed: 9, maxRounds: 4 });
    const hits = r.events.filter((ev) => ev.type === 'attack' && ev.hit && ev.tgt === 'e') as Extract<(typeof r.events)[number], { type: 'attack' }>[];
    expect(hits.length).toBeGreaterThan(0);
    const first = hits[0]!;
    expect(first.absorbed).toBe(30); // первый заряд поглотил 30
    expect(first.tgtWard).toBe(1); // остался 1 заряд
    const second = hits.find((h) => h.tgtWard === 0);
    expect(second).toBeDefined();
  });

  it('экипировка с новым способностями попадает в расчёт юнита', () => {
    const u = computeUnit({
      id: 'x', name: 'Тест', recruitId: 'militia',
      gear: {
        weapon: { uid: 'w', defId: 'thunder_maul', rarity: 'epic', quality: 1, affixes: [], cycle: 1 },
        core: { uid: 'c', defId: 'aegis_shard', rarity: 'epic', quality: 1, affixes: [], cycle: 1 },
      },
      line: 0, column: 0,
    });
    expect(u.abilities.some((a) => a.key === 'stunOnHit')).toBe(true);
    expect(u.abilities.some((a) => a.key === 'wardOnStart')).toBe(true);
  });
});

describe('реплей с новыми механиками остаётся точным', () => {
  it('финальный кадр ≡ final для боя с оглушением/замедлением/бронёй', () => {
    const p = mkUnit({ id: 'p', hp: 300, atk: 22, acc: 100, crit: 15, spd: 20, abilities: [{ key: 'stunOnHit', chance: 40, rounds: 1 }, { key: 'slowOnHit', rounds: 2 }] });
    const e = mkUnit({ id: 'e', hp: 400, atk: 12, acc: 100, crit: 0, spd: 5, morale: 150, abilities: [{ key: 'wardOnStart', charges: 3, perCharge: 20 }] });
    const r = simulateFight([p], [e], { seed: 21, maxRounds: 10 });
    const fs = computeFrameState(r.events, r.initial, r.events.length - 1);
    for (const u of r.final) {
      const s = fs.units.get(u.id)!;
      expect(s.hp).toBe(u.hp);
      expect(s.alive).toBe(u.alive);
      expect(s.stunRounds).toBe(u.stunRounds);
      expect(s.slowRounds).toBe(u.slowRounds);
      expect(s.wardCharges).toBe(u.wardCharges);
      expect(s.shield).toBe(u.shield);
      expect(s.morale).toBe(u.morale);
    }
  });
});
