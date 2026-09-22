import { describe, expect, it } from 'vitest';
import { computeFrameState } from '@/engine/combat/playback';
import { simulateFight } from '@/engine/combat/simulateFight';
import { mkUnit } from '../testUtils';

function duel(seed = 42) {
  const p = mkUnit({ id: 'p1', hp: 120, atk: 20, def: 10, spd: 12, acc: 100, crit: 0 });
  const e = mkUnit({ id: 'e1', hp: 100, atk: 18, def: 8, spd: 9, acc: 100, crit: 0 });
  return simulateFight([p], [e], { seed });
}

describe('playback: восстановление кадра', () => {
  it('финальный кадр побитово совпадает с final-состоянием симуляции', () => {
    for (const seed of [1, 7, 42]) {
      const r = duel(seed);
      const fs = computeFrameState(r.events, r.initial, r.events.length - 1);
      expect(fs.finished).toBe(true);
      for (const u of r.final) {
        const s = fs.units.get(u.id)!;
        expect(s.hp).toBe(u.hp);
        expect(s.alive).toBe(u.alive);
        expect(s.routed).toBe(u.routed);
        expect(s.morale).toBe(u.morale);
        expect(s.poison).toBe(u.poison);
        expect(s.shield).toBe(u.shield);
        expect(s.line).toBe(u.line);
      }
    }
  });

  it('кадр атаки даёт fx у цели (попадание) или промах, и fx выпада у атакующего', () => {
    const r = duel(5);
    const idx = r.events.findIndex((e) => e.type === 'attack');
    expect(idx).toBeGreaterThan(-1);
    const fs = computeFrameState(r.events, r.initial, idx);
    const ev = r.events[idx]!;
    if (ev.type !== 'attack') return;
    if (ev.hit) {
      if (ev.kind !== 'cleave') {
        expect(fs.fx.get(ev.src)?.kind).toMatch(/attackMelee|attackRanged/);
      }
      const tfx = fs.fx.get(ev.tgt);
      expect(['crit', 'hit']).toContain(tfx?.kind);
      expect(tfx?.amount).toBe(ev.dmg);
    } else {
      expect(fs.fx.get(ev.tgt)?.kind).toBe('miss');
    }
  });

  it('счётчик раундов и фаза отслеживаются', () => {
    const r = duel(3);
    const lastRound = Math.max(...r.events.filter((e) => e.type === 'roundStart').map((e) => (e.type === 'roundStart' ? e.round : 0)));
    const fs = computeFrameState(r.events, r.initial, r.events.length - 1);
    expect(fs.round).toBe(lastRound);
    expect(fs.phase).toBe('main');
    const mid = computeFrameState(r.events, r.initial, 0);
    expect(mid.phase).toBe('surprise');
  });

  it('смерть обнуляет hp и яд в воспроизведении', () => {
    const r = duel(11);
    const deathIdx = r.events.findIndex((e) => e.type === 'death');
    if (deathIdx === -1) return;
    const fs = computeFrameState(r.events, r.initial, deathIdx);
    const ev = r.events[deathIdx]!;
    if (ev.type !== 'death') return;
    const s = fs.units.get(ev.unit)!;
    expect(s.alive).toBe(false);
    expect(s.hp).toBe(0);
    expect(s.poison).toBe(0);
  });

  it('воспроизведение детерминировано', () => {
    const r = duel(9);
    const a = computeFrameState(r.events, r.initial, 10);
    const b = computeFrameState(r.events, r.initial, 10);
    expect([...a.fx.entries()]).toEqual([...b.fx.entries()]);
    expect([...a.units.entries()].map(([k, v]) => [k, v.hp, v.morale])).toEqual(
      [...b.units.entries()].map(([k, v]) => [k, v.hp, v.morale]),
    );
  });

  it('до первого события — стартовые состояния, fx пуст', () => {
    const r = duel(2);
    const fs = computeFrameState(r.events, r.initial, -1);
    expect(fs.fx.size).toBe(0);
    for (const u of r.initial) {
      expect(fs.units.get(u.id)!.hp).toBe(u.maxHp);
    }
  });
});
