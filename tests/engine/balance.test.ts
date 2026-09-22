import { describe, expect, it } from 'vitest';
import { generateEncounter } from '@/engine/campaign/nodeLogic';
import { simulateFight } from '@/engine/combat/simulateFight';
import { computeUnit } from '@/engine/unit/computeUnit';
import { collectModifiers } from '@/engine/economy/techTree';
import type { GearInstance, SquadSetup } from '@/engine/unit/unit.types';

/**
 * Баланс NG+ калибруется пробами, не «на глаз» (docs/DECISIONS.md, D-13).
 * Ячейка = (уровень армии, цикл босса). Ожидание: армия «своего» цикла
 * проходит босса в большинстве сидов; армия предыдущего цикла — почти никогда.
 */

const gi = (uid: string, defId: string): GearInstance => ({
  uid, defId, rarity: 'common', quality: 1, affixes: [], cycle: 1,
});

interface ArmySpec {
  recruitId: string;
  gear: Record<string, string>;
  line: number;
  techs: string[];
}

function buildArmy(specs: ArmySpec[]) {
  return specs.map((spec, i) =>
    computeUnit({
      id: `p${i}`,
      name: spec.recruitId,
      recruitId: spec.recruitId,
      gear: Object.fromEntries(Object.entries(spec.gear).map(([slot, defId]) => [slot, gi(`${i}_${slot}`, defId)])),
      line: spec.line,
      column: 2 + i * 2,
    }, { modifiers: collectModifiers(spec.techs, {}) }),
  );
}

const MID_TECHS = ['archery', 'bronze_working', 'iron_working', 'medicine'];
const LATE_TECHS = ['archery', 'bronze_working', 'iron_working', 'medicine', 'steel', 'feudalism', 'hunting', 'hunting_bands'];
const TOP_TECHS = [...LATE_TECHS, 'apex_predator', 'master_craft', 'war_college'];

const MID_ARMY: ArmySpec[] = [
  { recruitId: 'knight', gear: { weapon: 'spiked_mace', armor: 'plate_cuirass' }, line: 0, techs: MID_TECHS },
  { recruitId: 'archer', gear: { weapon: 'composite_bow' }, line: 2, techs: MID_TECHS },
  { recruitId: 'archer', gear: { weapon: 'composite_bow' }, line: 2, techs: MID_TECHS },
];

const LATE_ARMY: ArmySpec[] = [
  { recruitId: 'knight', gear: { weapon: 'storm_blade', armor: 'titan_plate', core: 'aegis_shard' }, line: 0, techs: LATE_TECHS },
  { recruitId: 'mage', gear: { weapon: 'staff_of_knowledge', trinket: 'lens_of_truth' }, line: 2, techs: LATE_TECHS },
  { recruitId: 'archer', gear: { weapon: 'headsman_axe', trinket: 'amulet_of_aim' }, line: 2, techs: LATE_TECHS },
];

const TOP_ARMY: ArmySpec[] = [
  { recruitId: 'knight', gear: { weapon: 'dawn_blade', armor: 'aegis', core: 'titan_core' }, line: 0, techs: TOP_TECHS },
  { recruitId: 'mage', gear: { weapon: 'mind_core', trinket: 'phoenix_heart' }, line: 2, techs: TOP_TECHS },
  { recruitId: 'archer', gear: { weapon: 'devourer', trinket: 'hawk_eye' }, line: 2, techs: TOP_TECHS },
];

const SEEDS = Array.from({ length: 16 }, (_, i) => i + 1);

/** Винрейт армии против босса заданного цикла. */
function bossWinrate(army: ArmySpec[], cycle: number, techsKey: 'own' | 'none' = 'own'): number {
  const specs = techsKey === 'none' ? army.map((a) => ({ ...a, techs: MID_TECHS })) : army;
  const units = buildArmy(specs);
  let wins = 0;
  for (const seed of SEEDS) {
    const enc = generateEncounter(cycle * 1000 + 7, cycle, 'boss', 0);
    const enemies = enc.enemies.map((s: SquadSetup) => computeUnit(s));
    const r = simulateFight(units, enemies, { seed, maxRounds: 40 });
    if (r.winner === 'player') wins += 1;
  }
  return wins / SEEDS.length;
}

describe('баланс NG+: кривая сложности пробами', () => {
  // Тесты с широкими полосами: баланс должен оставаться «проходимым, но не бесплатным».
  it('цикл 1: армия середины игры проходит босса (≥45% сидов)', () => {
    const wr = bossWinrate(MID_ARMY, 1);
    expect(wr).toBeGreaterThanOrEqual(0.45);
  });

  it('цикл 2: армия поздней игры проходит босса (≥45% сидов)', () => {
    const wr = bossWinrate(LATE_ARMY, 2);
    expect(wr).toBeGreaterThanOrEqual(0.45);
  });

  it('цикл 3: топ-армия проходит босса (≥40% сидов)', () => {
    const wr = bossWinrate(TOP_ARMY, 3);
    expect(wr).toBeGreaterThanOrEqual(0.4);
  });

  it('прогрессия: армия цикла 1 почти не проходит босса цикла 2 (<25%)', () => {
    const wr = bossWinrate(MID_ARMY, 2);
    expect(wr).toBeLessThan(0.25);
  });

  it('технологии решают: без ветки техов та же армия слабее на боссе цикла 2', () => {
    const withTech = bossWinrate(LATE_ARMY, 2, 'own');
    const noTech = bossWinrate(LATE_ARMY, 2, 'none');
    expect(withTech).toBeGreaterThan(noTech);
  });
});
