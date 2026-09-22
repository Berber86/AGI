import type { NodeKind } from '@/data/campaign';
import type { Encounter } from '@/engine/campaign/nodeLogic';
import type { BattleResult } from '@/engine/combat/combat.types';
import type { GearInstance, GearSlot, Resources } from '@/engine/unit/unit.types';

/** Отряд игрока в сохранении: ссылки на предметы по uid, а не сами предметы. */
export interface Squad {
  id: string;
  name: string;
  recruitId: string | null;
  gear: Record<GearSlot, string | null>;
  line: number;
  column: number;
}

export interface CampaignProgress {
  currentNodeId: string | null;
  completed: string[];
  skirmishCount: number;
  battleAttempts: number;
}

export interface PlayerStats {
  battles: number;
  wins: number;
  losses: number;
  draws: number;
  gearFound: number;
  crafted: number;
  longestBattle: number;
  bossKills: number;
  cyclesCompleted: number;
  /** Победы в стычках (фарм-бои вне карты). */
  skirmishWins: number;
  /** Текущая и лучшая серия побед подряд. */
  winStreak: number;
  bestWinStreak: number;
  /** Победы, в которых участвовал рекрут (recruitId → количество). */
  winsByRecruit: Record<string, number>;
  /** Победы по стихии урона (element → количество). */
  winsByElement: Record<string, number>;
}

export interface ActiveBattle {
  encounter: Encounter;
  result: BattleResult;
  nodeId: string;
  kind: NodeKind | 'skirmish';
  loot: GearInstance[];
  income: Resources | null;
}

export interface Notice {
  id: number;
  text: string;
  tone: 'info' | 'success' | 'warn';
}

export interface GameData {
  version: number;
  cycle: number;
  day: number;
  campaignSeed: number;
  resources: Resources;
  buildings: Record<string, number>;
  techs: string[];
  collection: GearInstance[];
  squads: Squad[];
  campaign: CampaignProgress;
  stats: PlayerStats;
  battle: ActiveBattle | null;
  notices: Notice[];
  /** Выполненные достижения (идентификаторы). */
  achievementsDone: string[];
  /** Квестовые шестерёнки: questId → получено. */
  quests: Record<string, boolean>;
}
