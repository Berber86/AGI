import { activeDogmas } from '@/engine/economy/techTree';
import type { BattleAnalysis, ProgressInput } from '@/engine/progression/meta';
import type { GameData } from './gameState.types';

/** Адаптер: снимок игры → вход для движка прогрессии. */
export function progressInputOf(d: GameData, analysis: BattleAnalysis | null): ProgressInput {
  return {
    stats: {
      wins: d.stats.wins,
      skirmishWins: d.stats.skirmishWins,
      winStreak: d.stats.winStreak,
      bestWinStreak: d.stats.bestWinStreak,
      crafted: d.stats.crafted,
      bossKills: d.stats.bossKills,
      cyclesCompleted: d.stats.cyclesCompleted,
    },
    techsCount: d.techs.length,
    dogmaCount: activeDogmas(d.techs).length,
    collectionSize: d.collection.length,
    fullSquads: d.squads.filter((sq) => sq.recruitId).length,
    analysis,
  };
}
