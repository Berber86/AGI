import { describe, expect, it } from 'vitest';
import { TECHS, TECH_BY_ID, TECH_ICONS } from '@/data/techs';
import { BUILDINGS } from '@/data/buildings';
import { RECRUITS, RECRUIT_BY_ID } from '@/data/recruits';
import { GEAR_POOL } from '@/data/gear';
import { SETS } from '@/data/sets';
import type { GearSlot } from '@/engine/unit/unit.types';
import { CAMPAIGN_MAP, CAMPAIGN_NODE_BY_ID } from '@/data/campaign';
import { generateEncounter, generateSkirmish } from '@/engine/campaign/nodeLogic';
import { requirementClosure, techDepth } from '@/engine/economy/techTree';

describe('целостность данных: технологии', () => {
  it('в дереве минимум 25 узлов', () => {
    expect(TECHS.length).toBeGreaterThanOrEqual(25);
  });

  it('все requirements существуют, циклов нет', () => {
    const ids = new Set(TECHS.map((t) => t.id));
    for (const t of TECHS) {
      for (const r of t.requires) expect(ids.has(r), `${t.id} → ${r}`).toBe(true);
    }
    const visited = new Set<string>();
    const stack = new Set<string>();
    const visit = (id: string): void => {
      if (visited.has(id)) return;
      expect(stack.has(id), `цикл через ${id}`).toBe(false);
      stack.add(id);
      for (const r of TECH_BY_ID[id]!.requires) visit(r);
      stack.delete(id);
      visited.add(id);
    };
    for (const t of TECHS) visit(t.id);
  });

  it('есть минимум 3 глубокие ветки специализации (эра III, глубина ≥ 4)', () => {
    const deep = TECHS.filter((t) => t.era === 3 && techDepth(t.id) >= 4);
    expect(deep.length).toBeGreaterThanOrEqual(3);
  });

  it('каждая технология даёт хотя бы одну валидную иконку', () => {
    for (const t of TECHS) {
      expect(t.icons.length).toBeGreaterThanOrEqual(1);
      for (const ic of t.icons) expect(TECH_ICONS).toContain(ic);
    }
  });

  it('requirementClosure возвращает всех предков', () => {
    const closure = requirementClosure('rune_forge');
    expect(closure.has('toolmaking')).toBe(true);
    expect(closure.has('master_craft')).toBe(true);
    expect(closure.has('bronze_working')).toBe(true);
    expect(closure.has('mining')).toBe(true);
    expect(closure.has('rune_forge')).toBe(false);
  });
});

describe('целостность данных: разблокировки', () => {
  it('unlockTech построек и рекрутов существует', () => {
    for (const b of BUILDINGS) {
      if (b.unlockTech) expect(TECH_BY_ID[b.unlockTech], b.id).toBeDefined();
    }
    for (const r of RECRUITS) {
      if (r.unlockTech) expect(TECH_BY_ID[r.unlockTech], r.id).toBeDefined();
    }
  });

  it('у построек и рекрутов стоимость валидна', () => {
    for (const b of BUILDINGS) {
      expect(Object.values(b.baseCost).every((v) => v > 0)).toBe(true);
      expect(b.maxLevel).toBeGreaterThan(0);
    }
    for (const r of RECRUITS) {
      if (r.unlockTech === undefined) {
        // Игровые рекруты без теха должны стоить что-то; вражеские могут быть бесплатными.
        const enemyOnly = ['wolf', 'skeleton', 'bandit_archer', 'ogre', 'lich'];
        if (!enemyOnly.includes(r.id)) expect(Object.values(r.cost).some((v) => v > 0), r.id).toBe(true);
      }
    }
  });
});

describe('целостность данных: шестерёнки и сеты', () => {
  it('setId всех предметов существует в SETS', () => {
    const setIds = new Set(SETS.map((s) => s.id));
    for (const g of GEAR_POOL) {
      if (g.setId) expect(setIds.has(g.setId), g.id).toBe(true);
    }
  });

  it('бонусы сетов: пороги 2..4 возрастают, слотов всего 4', () => {
    for (const s of SETS) {
      expect(s.bonuses.length).toBeGreaterThanOrEqual(2);
      let prev = 1;
      for (const b of s.bonuses) {
        expect(b.pieces).toBeGreaterThan(prev);
        expect(b.pieces).toBeLessThanOrEqual(4);
        expect(b.text.length).toBeGreaterThan(3);
        prev = b.pieces;
      }
    }
  });

  it('у каждого слота есть предметы хотя бы uncommon-редкости', () => {
    const slots = new Set<GearSlot>(['weapon', 'armor', 'trinket', 'core']);
    const covered = new Set(GEAR_POOL.filter((g) => g.rarity !== 'common').map((g) => g.slot));
    for (const slot of slots) expect(covered.has(slot), slot).toBe(true);
  });
});

describe('целостность данных: кампания', () => {
  it('все next-узлы существуют', () => {
    for (const n of CAMPAIGN_MAP) {
      for (const next of n.next) expect(CAMPAIGN_NODE_BY_ID[next], `${n.id} → ${next}`).toBeDefined();
    }
  });

  it('от старта достижимы все узлы, включая босса', () => {
    const start = CAMPAIGN_MAP.find((n) => n.layer === 0)!;
    const seen = new Set<string>([start.id]);
    const queue = [start.id];
    while (queue.length) {
      const cur = CAMPAIGN_NODE_BY_ID[queue.shift()!]!;
      for (const next of cur.next) {
        if (!seen.has(next)) {
          seen.add(next);
          queue.push(next);
        }
      }
    }
    expect(seen.size).toBe(CAMPAIGN_MAP.length);
  });

  it('босс ровно один и в последнем слое', () => {
    const bosses = CAMPAIGN_MAP.filter((n) => n.kind === 'boss');
    expect(bosses.length).toBe(1);
    const maxLayer = Math.max(...CAMPAIGN_MAP.map((n) => n.layer));
    expect(bosses[0]!.layer).toBe(maxLayer);
  });

  it('энкаунтеры используют известных рекрутов и валидные линии', () => {
    for (const node of CAMPAIGN_MAP) {
      if (node.kind !== 'battle' && node.kind !== 'elite' && node.kind !== 'boss') continue;
      for (let attempt = 0; attempt < 4; attempt++) {
        const enc = generateEncounter(1, 1, node.id, attempt);
        expect(enc.enemies.length).toBeGreaterThanOrEqual(1);
        for (const e of enc.enemies) {
          expect(RECRUIT_BY_ID[e.recruitId], `${node.id}: ${e.recruitId}`).toBeDefined();
          expect(e.line).toBeGreaterThanOrEqual(0);
          expect(e.line).toBeLessThanOrEqual(4);
          expect(e.column).toBeGreaterThanOrEqual(0);
          expect(e.column).toBeLessThanOrEqual(9);
        }
      }
    }
    for (let i = 0; i < 4; i++) {
      const sk = generateSkirmish(1, 1, 3, i);
      for (const e of sk.enemies) expect(RECRUIT_BY_ID[e.recruitId]).toBeDefined();
    }
  });
});
