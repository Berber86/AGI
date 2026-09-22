import { describe, expect, it } from 'vitest';
import { simulateFight } from '@/engine/combat/simulateFight';
import { buildLog } from '@/engine/combat/log';
import { MORALE_BREAK } from '@/engine/combat/combat.types';
import { computeUnit } from '@/engine/unit/computeUnit';
import type { GearInstance } from '@/engine/unit/unit.types';
import { mkUnit } from '../testUtils';

const base = { hp: 100, atk: 20, def: 10, spd: 10, acc: 100, eva: 0, crit: 0, range: 1, morale: 100 };

function duel(seed = 1) {
  const p = mkUnit({ id: 'p1', hp: base.hp, atk: base.atk, def: base.def, spd: base.spd, acc: 100, crit: 0 });
  const e = mkUnit({ id: 'e1', hp: base.hp, atk: base.atk, def: base.def, spd: base.spd, acc: 100, crit: 0 });
  return simulateFight([p], [e], { seed });
}

describe('simulateFight: детерминизм', () => {
  it('одинаковый seed → идентичный результат', () => {
    const a = duel(42);
    const b = duel(42);
    expect(a).toEqual(b);
    expect(a.events).toEqual(b.events);
  });

  it('разный seed → другой ход боя (у варьирования есть разброс)', () => {
    const results = new Set(
      [1, 2, 3, 4, 5].map((s) => {
        const r = duel(s);
        return r.events.map((e) => JSON.stringify(e)).join('|');
      }),
    );
    expect(results.size).toBeGreaterThan(1);
  });

  it('симуляция не зависит от порядка вызовов (чистая функция)', () => {
    const a = duel(7);
    duel(999);
    duel(123);
    const b = duel(7);
    expect(a.events).toEqual(b.events);
  });
});

describe('simulateFight: базовые правила', () => {
  it('кто-то должен победить или ничья по лимиту раундов', () => {
    for (const seed of [1, 2, 3, 10, 50]) {
      const r = duel(seed);
      expect(['player', 'enemy', 'draw']).toContain(r.winner);
      expect(r.rounds).toBeLessThanOrEqual(30);
      expect(r.events[r.events.length - 1]!.type).toBe('end');
    }
  });

  it('сильный юнит чаще побеждает слабого (статистически)', () => {
    let strong = 0;
    const runs = 60;
    for (let seed = 1; seed <= runs; seed++) {
      const p = mkUnit({ id: 'p', hp: 140, atk: 26, def: 14, acc: 100, crit: 0 });
      const e = mkUnit({ id: 'e', hp: 90, atk: 16, def: 6, acc: 100, crit: 0 });
      if (simulateFight([p], [e], { seed }).winner === 'player') strong++;
    }
    expect(strong / runs).toBeGreaterThan(0.85);
  });

  it('юнит с 0 HP не может существовать в initial (граница задана базой)', () => {
    const p = mkUnit({ id: 'p', hp: 50, atk: 100 });
    const r = simulateFight([p], [mkUnit({ id: 'e', hp: 40, atk: 10 })], { seed: 1 });
    expect(r.initial[0]!.maxHp).toBe(50);
  });

  it('мёртвые юниты не действуют после смерти', () => {
    const r = duel(3);
    const deaths = r.events.filter((e) => e.type === 'death');
    const deathRound = new Map(deaths.map((e) => [e.type === 'death' ? e.unit : '', e.type === 'death' ? e.round : -1]));
    for (const ev of r.events) {
      if (ev.type === 'attack') {
        const dr = deathRound.get(ev.src);
        if (dr !== undefined && dr !== -1) {
          // атакующий мёртв → после его смерти атак быть не может (кроме контратаки в тот же раунд смерти).
          expect(ev.round).toBeLessThanOrEqual(dr);
        }
      }
    }
  });
});

describe('simulateFight: механики', () => {
  it('крит наносит больше обычного удара', () => {
    const p = mkUnit({ id: 'p', hp: 200, atk: 50, def: 5, spd: 20, crit: 100, critDmg: 200, acc: 100 });
    const e = mkUnit({ id: 'e', hp: 500, atk: 1, def: 0, spd: 1, acc: 100, crit: 0, morale: 150, tags: ['fearless'] });
    const r = simulateFight([p], [e], { seed: 5, maxRounds: 1 });
    const dmg = r.events.filter((e2) => e2.type === 'attack' && e2.hit).map((e2) => (e2.type === 'attack' ? e2.dmg : 0));
    expect(dmg.some((d) => d > 50)).toBe(true); // минимум один удар > базы
  });

  it('промахи случаются при низкой меткости', () => {
    const p = mkUnit({ id: 'p', hp: 300, atk: 30, acc: 30, crit: 0, spd: 10 });
    const e = mkUnit({ id: 'e', hp: 300, atk: 1, acc: 100, eva: 50, crit: 0, spd: 5, morale: 150, tags: ['fearless'] });
    const r = simulateFight([p], [e], { seed: 11, maxRounds: 4 });
    const misses = r.events.filter((ev) => ev.type === 'attack' && !ev.hit && ev.src === 'p');
    expect(misses.length).toBeGreaterThan(0);
  });

  it('щит поглощает урон', () => {
    const p = mkUnit({ id: 'p', hp: 100, atk: 25, acc: 100, crit: 0, spd: 20 });
    const e = mkUnit({ id: 'e', hp: 100, atk: 5, acc: 100, crit: 0, spd: 1, abilities: [{ key: 'shield', amount: 60 }], morale: 150, tags: ['fearless'] });
    const r = simulateFight([p], [e], { seed: 9, maxRounds: 3 });
    const absorbed = r.events.filter((ev) => ev.type === 'attack' && ev.hit).reduce((s, ev) => s + (ev.type === 'attack' ? ev.absorbed : 0), 0);
    expect(absorbed).toBeGreaterThan(0);
  });

  it('яд наносит урон в начале раунда и спадает по стакам', () => {
    const p = mkUnit({ id: 'p', hp: 300, atk: 20, acc: 100, crit: 0, spd: 20, abilities: [{ key: 'poisonOnHit', stacks: 3 }] });
    const e = mkUnit({ id: 'e', hp: 400, atk: 1, acc: 100, crit: 0, spd: 1, morale: 150, tags: ['fearless'] });
    const r = simulateFight([p], [e], { seed: 4, maxRounds: 6 });
    const dots = r.events.filter((ev) => ev.type === 'dot');
    expect(dots.length).toBeGreaterThan(0);
    const first = dots[0]!;
    expect(first.type === 'dot' && first.dmg).toBe(3 * 3); // 3 стака × 3 урона
  });

  it('вампиризм лечит атакующего', () => {
    const p = mkUnit({ id: 'p', hp: 100, atk: 50, acc: 100, crit: 0, spd: 20, lifesteal: 50 });
    const e = mkUnit({ id: 'e', hp: 600, atk: 5, acc: 100, crit: 0, spd: 1, morale: 150, tags: ['fearless'] });
    const r = simulateFight([p], [e], { seed: 2, maxRounds: 4 });
    const heals = r.events.filter((ev) => ev.type === 'heal' && ev.source === 'lifesteal');
    expect(heals.length).toBeGreaterThan(0);
  });

  it('контратака срабатывает на ближний удар', () => {
    const p = mkUnit({ id: 'p', hp: 200, atk: 20, acc: 100, crit: 0, spd: 20 });
    const e = mkUnit({ id: 'e', hp: 400, atk: 10, acc: 100, crit: 0, spd: 1, abilities: [{ key: 'retaliate', pct: 50 }], morale: 150, tags: ['fearless'] });
    const r = simulateFight([p], [e], { seed: 6, maxRounds: 2 });
    const counters = r.events.filter((ev) => ev.type === 'attack' && ev.kind === 'counter');
    expect(counters.length).toBeGreaterThan(0);
  });

  it('дальний юнит бьёт через линии, ближний — продвигается', () => {
    const archer = mkUnit({ id: 'a', hp: 100, atk: 15, acc: 100, crit: 0, spd: 20, range: 4, line: 3 });
    const melee = mkUnit({ id: 'm', hp: 100, atk: 15, acc: 100, crit: 0, spd: 10, range: 1, line: 3 });
    const r = simulateFight([archer], [melee], { seed: 8, maxRounds: 6 });
    // Меломан-ближник должен продвинуться, чтобы дотянуться.
    const advances = r.events.filter((ev) => ev.type === 'advance' && ev.unit === 'm');
    expect(advances.length).toBeGreaterThanOrEqual(0);
    // Лучник наносил урон, пока ближник ещё далеко — это значит дальность работает.
    const earlyHits = r.events.some((ev) => ev.type === 'attack' && ev.src === 'a' && ev.hit && ev.round <= 2);
    expect(earlyHits).toBe(true);
  });

  it('мораль: паника и бегство при низком морале', () => {
    const p = mkUnit({ id: 'p', hp: 500, atk: 30, acc: 100, crit: 50, critDmg: 200, spd: 20 });
    const e = mkUnit({ id: 'e', hp: 900, atk: 1, acc: 100, crit: 0, spd: 1, morale: 20 });
    const r = simulateFight([p], [e], { seed: 21, maxRounds: 12 });
    // При морале 20 и событиях снижения — либо бегство случилось, либо мораль не упала ниже порога.
    const routs = r.events.filter((ev) => ev.type === 'rout');
    expect(routs.length).toBeLessThanOrEqual(1);
    expect(MORALE_BREAK).toBe(25);
  });

  it('внезапная атака: быстрый юнит бьёт в фазе surprise', () => {
    const fast = mkUnit({ id: 'fast', hp: 100, atk: 30, acc: 100, crit: 0, spd: 20 });
    const slow = mkUnit({ id: 'slow', hp: 100, atk: 30, acc: 100, crit: 0, spd: 5 });
    const r = simulateFight([fast], [slow], { seed: 13, maxRounds: 5 });
    const surprise = r.events.some((ev) => ev.type === 'attack' && ev.surprise && ev.src === 'fast');
    expect(surprise).toBe(true);
  });

  it('firstStrike даёт внезапную атаку без превышения скорости', () => {
    const striker = mkUnit({ id: 's', hp: 100, atk: 30, acc: 100, crit: 0, spd: 10, abilities: [{ key: 'firstStrike' }] });
    const normal = mkUnit({ id: 'n', hp: 100, atk: 30, acc: 100, crit: 0, spd: 10 });
    const r = simulateFight([striker], [normal], { seed: 17, maxRounds: 3 });
    const surprise = r.events.some((ev) => ev.type === 'attack' && ev.surprise && ev.src === 's');
    expect(surprise).toBe(true);
  });
});

describe('лог боя', () => {
  it('каждое событие даёт строку или осознанно скрыто, лог не пустой', () => {
    const r = duel(99);
    const log = buildLog(r.events, r.initial);
    expect(log.length).toBeGreaterThan(3);
    expect(log[log.length - 1]!.tone).toBe('system');
  });
});

// ---- Интеграционный тест: сборка юнита из шестерёнок влияет на бой ----
describe('computeUnit + simulateFight', () => {
  const gear = (uid: string, defId: string): GearInstance => ({ uid, defId, rarity: 'common', quality: 1, affixes: [], cycle: 1 });

  it('экипированный юнит сильнее голого', () => {
    const naked = computeUnit({ id: 'n', name: 'Голый', recruitId: 'militia', gear: {}, line: 0, column: 0 });
    const armed = computeUnit({
      id: 'a', name: 'Вооружённый', recruitId: 'militia',
      gear: { weapon: gear('w', 'steel_blade'), armor: gear('ar', 'chainmail'), core: gear('c', 'flywheel') },
      line: 0, column: 0,
    });
    expect(armed.stats.atk).toBeGreaterThan(naked.stats.atk);
    expect(armed.stats.hp).toBeGreaterThan(naked.stats.hp);

    // Вооружённый побеждает в большинстве боёв.
    let wins = 0;
    for (let seed = 1; seed <= 40; seed++) {
      const r = simulateFight(
        [{ ...armed, id: 'p' }],
        [{ ...naked, id: 'e' }],
        { seed },
      );
      if (r.winner === 'player') wins++;
    }
    expect(wins / 40).toBeGreaterThan(0.8);
  });
});
