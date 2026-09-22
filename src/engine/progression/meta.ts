import { GEAR_BY_ID } from '@/data/gear';
import { QUESTS, QUEST_BY_ID } from '@/data/quests';
import type { Element, Resources } from '@/engine/unit/unit.types';
import type { BattleResult } from '@/engine/combat/combat.types';

/**
 * Прогрессия и мета: разбор боя, достижения, квесты.
 * Все функции чистые — работают на снимке GameData и анализе боя.
 */

// ---------------------------------------------------------------------------
// Анализ боя: агрегат из событий, нужный достижениям и статистике.
// ---------------------------------------------------------------------------

export interface BattleAnalysis {
  winner: 'player' | 'enemy' | 'draw';
  rounds: number;
  /** Стихии, которыми игрок наносил урон (только результативные попадания). */
  playerElements: Element[];
  /** Сколько отрядов игрока погибло. */
  playerLost: number;
  /** Сколько врагов обратилось в бегство. */
  enemyRouted: number;
  /** Убийств на счету отрядов игрока. */
  playerKills: number;
}

export function analyzeBattle(result: BattleResult, playerSquadIds: readonly string[]): BattleAnalysis {
  const playerIds = new Set(playerSquadIds);
  const sideOf = new Map(result.initial.map((u) => [u.id, u.side]));
  const elements = new Set<Element>();
  let playerLost = 0;
  let enemyRouted = 0;
  let playerKills = 0;
  for (const ev of result.events) {
    if (ev.type === 'attack' && ev.hit && ev.dmg > 0 && playerIds.has(ev.src)) {
      elements.add(ev.element);
    } else if (ev.type === 'death') {
      const side = sideOf.get(ev.unit);
      if (side === 'player' && playerIds.has(ev.unit)) playerLost += 1;
      if (ev.killer && playerIds.has(ev.killer)) playerKills += 1;
    } else if (ev.type === 'rout') {
      if (sideOf.get(ev.unit) === 'enemy') enemyRouted += 1;
    }
  }
  return { winner: result.winner, rounds: result.rounds, playerElements: [...elements], playerLost, enemyRouted, playerKills };
}

// ---------------------------------------------------------------------------
// Достижения/испытания.
// ---------------------------------------------------------------------------

export interface AchievementDef {
  id: string;
  name: string;
  icon: string;
  description: string;
  reward: Partial<Resources>;
  rewardText: string;
  /** Требует контекста боя: проверяется только после победы. */
  needsBattle?: boolean;
}

export const ACHIEVEMENTS: AchievementDef[] = [
  { id: 'first_blood', name: 'Первая кровь', icon: '🩸', description: 'Выиграй первый бой.', reward: { gold: 50 }, rewardText: '+50 золота' },
  { id: 'exterminator', name: 'Истребитель', icon: '⚔️', description: 'Выиграй 10 боёв.', reward: { ore: 40 }, rewardText: '+40 руды' },
  { id: 'skirmisher', name: 'Загонщик', icon: '🐎', description: 'Выиграй 5 стычек.', reward: { ore: 35 }, rewardText: '+35 руды' },
  { id: 'pyromaniac', name: 'Пироман', icon: '🔥', description: 'Победи, нанося урон только Огнём.', reward: { science: 40 }, rewardText: '+40 науки', needsBattle: true },
  { id: 'untouchable', name: 'Не тронутые', icon: '🕊️', description: 'Победи, не потеряв ни одного отряда.', reward: { gold: 60 }, rewardText: '+60 золота', needsBattle: true },
  { id: 'demoralizer', name: 'Гроза морали', icon: '😱', description: 'Победи, обратив врага в бегство.', reward: { gold: 50 }, rewardText: '+50 золота', needsBattle: true },
  { id: 'blitz', name: 'Блицкриг', icon: '💨', description: 'Победи за 3 раунда или быстрее.', reward: { ore: 30 }, rewardText: '+30 руды', needsBattle: true },
  { id: 'marathon', name: 'Марафонец', icon: '🏃', description: 'Победи в бою длиной 10+ раундов.', reward: { gold: 50 }, rewardText: '+50 золота', needsBattle: true },
  { id: 'streak5', name: 'На волне', icon: '📈', description: 'Выиграй 5 боёв подряд.', reward: { gold: 80 }, rewardText: '+80 золота' },
  { id: 'collector', name: 'Коллекционер', icon: '🗄️', description: 'Собери 20 шестерёнок.', reward: { gold: 40 }, rewardText: '+40 золота' },
  { id: 'craftsman', name: 'Мастер слияния', icon: '🔨', description: 'Проведи 5 слияний.', reward: { ore: 50 }, rewardText: '+50 руды' },
  { id: 'scholar', name: 'Учёный', icon: '🎓', description: 'Изучи 10 технологий.', reward: { science: 50 }, rewardText: '+50 науки' },
  { id: 'dogmatist', name: 'Богослов', icon: '📕', description: 'Открой 5 догм.', reward: { science: 60 }, rewardText: '+60 науки' },
  { id: 'full_house', name: 'Полный состав', icon: '👥', description: 'Собери все три отряда одновременно.', reward: { gold: 30 }, rewardText: '+30 золота' },
  { id: 'boss_slayer', name: 'Убийца Боссов', icon: '👑', description: 'Победи Босса цикла.', reward: { gold: 100 }, rewardText: '+100 золота' },
  { id: 'cycle_one', name: 'Первый оборот', icon: '🔄', description: 'Заверши Цикл 1.', reward: { science: 60 }, rewardText: '+60 науки' },
];

export const ACHIEVEMENT_BY_ID: Record<string, AchievementDef> = Object.fromEntries(ACHIEVEMENTS.map((a) => [a.id, a]));

export interface AchievementProgress {
  cur: number;
  goal: number;
}

/** Данные для проверки достижений вне боя: снимок состояния + активные догмы. */
export interface ProgressInput {
  stats: {
    wins: number;
    skirmishWins: number;
    winStreak: number;
    bestWinStreak: number;
    crafted: number;
    bossKills: number;
    cyclesCompleted: number;
  };
  techsCount: number;
  dogmaCount: number;
  collectionSize: number;
  fullSquads: number;
  analysis: BattleAnalysis | null;
}

/** Текущий прогресс достижения. cur >= goal → выполнено. */
export function achievementProgress(a: AchievementDef, input: ProgressInput): AchievementProgress {
  const s = input.stats;
  const an = input.analysis;
  const win = an?.winner === 'player' ? an : null;
  switch (a.id) {
    case 'first_blood':
      return { cur: Math.min(s.wins, 1), goal: 1 };
    case 'exterminator':
      return { cur: s.wins, goal: 10 };
    case 'skirmisher':
      return { cur: s.skirmishWins, goal: 5 };
    case 'pyromaniac':
      return { cur: win && win.playerElements.length > 0 && win.playerElements.every((e) => e === 'fire') ? 1 : 0, goal: 1 };
    case 'untouchable':
      return { cur: win && win.playerLost === 0 ? 1 : 0, goal: 1 };
    case 'demoralizer':
      return { cur: win && win.enemyRouted > 0 ? 1 : 0, goal: 1 };
    case 'blitz':
      return { cur: win && win.rounds <= 3 ? 1 : 0, goal: 1 };
    case 'marathon':
      return { cur: win && win.rounds >= 10 ? 1 : 0, goal: 1 };
    case 'streak5':
      return { cur: s.winStreak, goal: 5 };
    case 'collector':
      return { cur: input.collectionSize, goal: 20 };
    case 'craftsman':
      return { cur: s.crafted, goal: 5 };
    case 'scholar':
      return { cur: input.techsCount, goal: 10 };
    case 'dogmatist':
      return { cur: input.dogmaCount, goal: 5 };
    case 'full_house':
      return { cur: input.fullSquads, goal: 3 };
    case 'boss_slayer':
      return { cur: Math.min(s.bossKills, 1), goal: 1 };
    case 'cycle_one':
      return { cur: Math.min(s.cyclesCompleted, 1), goal: 1 };
    default:
      return { cur: 0, goal: 1 };
  }
}

/** Возвращает достижения, выполненные сейчас (включая alreadyDone для фильтрации снаружи). */
export function completedAchievements(input: ProgressInput): AchievementDef[] {
  return ACHIEVEMENTS.filter((a) => {
    const p = achievementProgress(a, input);
    return p.cur >= p.goal;
  });
}

// ---------------------------------------------------------------------------
// Квесты.
// ---------------------------------------------------------------------------

export interface QuestContext {
  /** Текущий бой — бой с боссом? */
  isBossBattle: boolean;
  analysis: BattleAnalysis | null;
}

/** Выполненные сейчас квесты (без учёта уже выданных — фильтрует стор). */
export function completedQuests(input: ProgressInput, ctx: QuestContext): string[] {
  const out: string[] = [];
  const an = ctx.analysis;
  const win = an?.winner === 'player' ? an : null;
  for (const q of QUESTS) {
    switch (q.id) {
      case 'q_phoenix':
        if (ctx.isBossBattle && win && win.playerLost === 0) out.push(q.id);
        break;
      case 'q_arsonist':
        if (ctx.isBossBattle && win && win.playerElements.length > 0 && win.playerElements.every((e) => e === 'fire')) out.push(q.id);
        break;
      case 'q_cog_ages':
        if (input.stats.cyclesCompleted >= 2) out.push(q.id);
        break;
      case 'q_warlord':
        if (input.stats.bestWinStreak >= 5) out.push(q.id);
        break;
    }
  }
  return out;
}

/** Экземпляр квестовой награды. */
export function questRewardInstance(questId: string, cycle: number): { uid: string; defId: string; quest: string; cycle: number } | null {
  const q = QUEST_BY_ID[questId];
  if (!q || !GEAR_BY_ID[q.rewardDefId]) return null;
  return { uid: `quest_${questId}`, defId: q.rewardDefId, quest: questId, cycle };
}
