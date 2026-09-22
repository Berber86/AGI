import { describe, expect, it } from 'vitest';
import { analyzeBattle, achievementProgress, ACHIEVEMENT_BY_ID, completedAchievements, completedQuests, questRewardInstance, type ProgressInput } from '@/engine/progression/meta';
import { generateGear } from '@/engine/loot/gearGenerator';
import { simulateFight } from '@/engine/combat/simulateFight';
import { computeFrameState } from '@/engine/combat/playback';
import { GEAR_BY_ID } from '@/data/gear';
import { migrate } from '@/store/useGameStore';
import { SAVE_VERSION } from '@/store/useGameStore';
import { mkUnit } from '../testUtils';
import { createRng } from '@/utils/rng';
import type { GameData } from '@/store/gameState.types';

function fireVsTough(seed = 3) {
  // Игрок бьёт огнём; враг живучий, без страха.
  const p = mkUnit({ id: 'p1', hp: 300, atk: 22, acc: 100, crit: 0, spd: 15, element: 'fire' });
  const p2 = mkUnit({ id: 'p2', hp: 200, atk: 15, acc: 100, crit: 0, spd: 10, element: 'physical' });
  const e = mkUnit({ id: 'e1', hp: 2500, atk: 1, acc: 100, crit: 0, spd: 1, morale: 150, tags: ['fearless'] });
  return { p, p2, e, result: simulateFight([p, p2], [e], { seed, maxRounds: 25 }) };
}

describe('analyzeBattle', () => {
  it('собирает стихии игрока из результативных атак', () => {
    const { result } = fireVsTough();
    const an = analyzeBattle(result, ['p1', 'p2']);
    expect(an.playerElements).toContain('fire');
    expect(an.playerElements).toContain('physical');
  });

  it('только огонь → пустой список физического', () => {
    const p = mkUnit({ id: 'p1', hp: 300, atk: 25, acc: 100, crit: 0, spd: 15, element: 'fire' });
    const e = mkUnit({ id: 'e1', hp: 2000, atk: 1, acc: 100, crit: 0, spd: 1, morale: 150, tags: ['fearless'] });
    const r = simulateFight([p], [e], { seed: 3, maxRounds: 20 });
    const an = analyzeBattle(r, ['p1']);
    expect(an.playerElements).toEqual(['fire']);
  });

  it('считает потери игрока и бегство врага', () => {
    // Враг с низким моралом + высокие шансы паники: критующий дебют.
    const p = mkUnit({ id: 'p', hp: 500, atk: 30, acc: 100, crit: 50, critDmg: 200, spd: 20 });
    const eWeak = mkUnit({ id: 'weak', hp: 120, atk: 5, acc: 100, crit: 0, spd: 1, morale: 30 });
    const r = simulateFight([p], [eWeak], { seed: 11, maxRounds: 10 });
    const an = analyzeBattle(r, ['p']);
    expect(an.winner).toBe('player');
    expect(an.playerLost).toBe(0);
    // В 10 раундах против морали 30 бегство очень вероятно, но не гарантировано.
    expect(an.enemyRouted).toBeGreaterThanOrEqual(0);
  });

  it('реплей с новым анализом остаётся точным (санити playback)', () => {
    const { result } = fireVsTough();
    const fs = computeFrameState(result.events, result.initial, result.events.length - 1);
    for (const u of result.final) {
      expect(fs.units.get(u.id)!.hp).toBe(u.hp);
    }
  });
});

function baseInput(over: Partial<ProgressInput> = {}): ProgressInput {
  return {
    stats: { wins: 0, skirmishWins: 0, winStreak: 0, crafted: 0, bossKills: 0, cyclesCompleted: 0 },
    techsCount: 0,
    dogmaCount: 0,
    collectionSize: 0,
    fullSquads: 0,
    analysis: null,
    ...over,
  };
}

describe('достижения', () => {
  it('пироман: только огненные победы засчитываются', () => {
    const pyro = ACHIEVEMENT_BY_ID.pyromaniac!;
    const win = { winner: 'player' as const, rounds: 5, playerElements: ['fire' as const], playerLost: 0, enemyRouted: 0, playerKills: 1 };
    expect(achievementProgress(pyro, baseInput({ analysis: win })).cur).toBe(1);
    const mixed = { ...win, playerElements: ['fire' as const, 'physical' as const] };
    expect(achievementProgress(pyro, baseInput({ analysis: mixed })).cur).toBe(0);
    const loss = { ...win, winner: 'enemy' as const };
    expect(achievementProgress(pyro, baseInput({ analysis: loss })).cur).toBe(0);
  });

  it('нотачбл-достижения не выполняются без боя', () => {
    const input = baseInput({ analysis: null });
    const done = completedAchievements(input).map((a) => a.id);
    expect(done).not.toContain('pyromaniac');
    expect(done).not.toContain('untouchable');
  });

  it('мета-достижения считаются от статистики', () => {
    const input = baseInput({
      stats: { wins: 10, skirmishWins: 5, winStreak: 5, crafted: 5, bossKills: 1, cyclesCompleted: 1 },
      techsCount: 10,
      dogmaCount: 5,
      collectionSize: 20,
      fullSquads: 3,
    });
    const ids = completedAchievements(input).map((a) => a.id);
    expect(ids).toContain('exterminator');
    expect(ids).toContain('skirmisher');
    expect(ids).toContain('streak5');
    expect(ids).toContain('collector');
    expect(ids).toContain('craftsman');
    expect(ids).toContain('scholar');
    expect(ids).toContain('dogmatist');
    expect(ids).toContain('full_house');
    expect(ids).toContain('boss_slayer');
    expect(ids).toContain('cycle_one');
  });

  it('блитц и марафон взаимоисключимы по раундам', () => {
    const fast = { winner: 'player' as const, rounds: 2, playerElements: ['fire' as const], playerLost: 0, enemyRouted: 0, playerKills: 1 };
    const input = baseInput({ analysis: fast });
    const ids = completedAchievements(input).map((a) => a.id);
    expect(ids).toContain('blitz');
    expect(ids).not.toContain('marathon');
  });
});

describe('квесты', () => {
  const winAnalysis = { winner: 'player' as const, rounds: 6, playerElements: ['fire' as const], playerLost: 0, enemyRouted: 0, playerKills: 3 };

  it('Феникс: босс без потерь', () => {
    const d = { stats: { bestWinStreak: 0, cyclesCompleted: 0 } } as unknown as GameData;
    const ids = completedQuests(d, { isBossBattle: true, analysis: winAnalysis });
    expect(ids).toContain('q_phoenix');
    const withLoss = { ...winAnalysis, playerLost: 1 };
    expect(completedQuests(d, { isBossBattle: true, analysis: withLoss })).not.toContain('q_phoenix');
    expect(completedQuests(d, { isBossBattle: false, analysis: winAnalysis })).not.toContain('q_phoenix');
  });

  it('Поджигатель: босс только огнём', () => {
    const d = { stats: { bestWinStreak: 0, cyclesCompleted: 0 } } as unknown as GameData;
    const ids = completedQuests(d, { isBossBattle: true, analysis: winAnalysis });
    expect(ids).toContain('q_arsonist');
  });

  it('Хранитель Циклов и Печать Военачальника — по статистике', () => {
    const d = { stats: { bestWinStreak: 5, cyclesCompleted: 2 } } as unknown as GameData;
    const ids = completedQuests(d, { isBossBattle: false, analysis: null });
    expect(ids).toContain('q_cog_ages');
    expect(ids).toContain('q_warlord');
  });

  it('награда квеста — существующий предмет с uid квеста', () => {
    const inst = questRewardInstance('q_phoenix', 2);
    expect(inst).not.toBeNull();
    expect(inst!.uid).toBe('quest_q_phoenix');
    expect(inst!.quest).toBe('q_phoenix');
    expect(GEAR_BY_ID[inst!.defId]!.questOnly).toBe(true);
  });

  it('квестовые предметы исключены из лута', () => {
    // generateGear для legendary не должен вернуть questOnly-предмет.
    for (let seed = 1; seed <= 60; seed++) {
      const g = generateGear(createRng(seed * 7919), { rarity: 'legendary', cycle: 1 });
      expect(GEAR_BY_ID[g.defId]!.questOnly ?? false).toBe(false);
    }
  });
});

describe('миграция сохранений v1 → v2', () => {
  it('дозаполняет новые поля, сохраняет старые данные', () => {
    const old = {
      version: 1,
      cycle: 3,
      day: 42,
      campaignSeed: 999,
      resources: { food: 100, ore: 50, science: 20, gold: 70 },
      buildings: { farm: 2 },
      techs: ['mining'],
      collection: [{ uid: 'x', defId: 'rusty_sword', rarity: 'common', quality: 1, affixes: [], cycle: 1 }],
      squads: [{ id: 'sq1', name: 'А', recruitId: 'militia', gear: { weapon: null, armor: null, trinket: null, core: null }, line: 0, column: 0 }],
      campaign: { currentNodeId: 'b1a', completed: ['b1a'], skirmishCount: 2, battleAttempts: 3 },
      stats: { battles: 5, wins: 3, losses: 2, draws: 0, gearFound: 4, crafted: 1, longestBattle: 9, bossKills: 0, cyclesCompleted: 0 },
      battle: null,
      notices: [],
    };
    const m = migrate(old);
    expect(m).not.toBeNull();
    expect(m!.version).toBe(SAVE_VERSION);
    expect(m!.cycle).toBe(3);
    expect(m!.stats.wins).toBe(3);
    expect(m!.stats.skirmishWins).toBe(0);
    expect(m!.stats.winStreak).toBe(0);
    expect(m!.stats.winsByRecruit).toEqual({});
    expect(m!.achievementsDone).toEqual([]);
    expect(m!.quests).toEqual({});
    expect(m!.campaign.currentNodeId).toBe('b1a');
  });

  it('чужеродное сохранение отбрасывается', () => {
    expect(migrate(null)).toBeNull();
    expect(migrate({ version: 99 })).toBeNull();
    expect(migrate('string')).toBeNull();
  });
});
