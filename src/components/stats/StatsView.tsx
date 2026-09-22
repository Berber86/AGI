import React from 'react';
import { useGameStore } from '../../store/useGameStore';
import { Award, Trophy, Target, ShieldCheck, Flame, RotateCcw } from 'lucide-react';

interface AchievementDef {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  isUnlocked: (state: ReturnType<typeof useGameStore.getState>) => boolean;
}

const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: 'first_blood',
    title: 'Первая Стычка',
    description: 'Одержите победу в первом бою с патрулем автоматонов.',
    icon: <Flame className="w-5 h-5 text-amber-400" />,
    isUnlocked: (s) => s.stats.battlesWon >= 1,
  },
  {
    id: 'master_artisan',
    title: 'Мастер-Часовщик',
    description: 'Успешно проведите хотя бы одну трансмутацию шестерен (3→1).',
    icon: <Award className="w-5 h-5 text-sky-400" />,
    isUnlocked: (s) => s.stats.gearsFused >= 1,
  },
  {
    id: 'titan_breaker',
    title: 'Сокрушитель Титанов',
    description: 'Преодолейте первый цикл экспедиции и перейдите в New Game+ (Цикл 2+).',
    icon: <Trophy className="w-5 h-5 text-yellow-400" />,
    isUnlocked: (s) => s.campaign.cycle >= 2,
  },
  {
    id: 'scholar_of_cogs',
    title: 'Энциклопедист Шестерен',
    description: 'Изучите не менее 5 технологий в древе развития.',
    icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
    isUnlocked: (s) => s.unlockedTechIds.length >= 5,
  },
  {
    id: 'colossal_damage',
    title: 'Катастрофический Импульс',
    description: 'Нанесите суммарно более 1,000 урона за все кампании.',
    icon: <Target className="w-5 h-5 text-rose-400" />,
    isUnlocked: (s) => s.stats.totalDamage >= 1000,
  },
];

export const StatsView: React.FC = () => {
  const store = useGameStore();
  const { stats, campaign, resetGame } = store;

  const winRate =
    stats.battlesWon + stats.battlesLost > 0
      ? Math.round((stats.battlesWon / (stats.battlesWon + stats.battlesLost)) * 100)
      : 100;

  return (
    <div className="flex flex-col h-full p-4 gap-4 overflow-y-auto max-w-7xl mx-auto w-full">
      {/* Top Banner */}
      <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-amber-400 uppercase tracking-wide">
            Архив Империи: Статистика и Испытания
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Прогрессия побед, показатели урона, история циклов и испытания механиков.
          </p>
        </div>

        <button
          onClick={() => {
            if (confirm('Сбросить весь прогресс и начать сначала с чистого листа?')) {
              resetGame();
            }
          }}
          className="px-3 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs font-bold border border-rose-800/60 flex items-center gap-1.5 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Сбросить Прогресс
        </button>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-900/70 p-3.5 rounded-xl border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Побед в боях</span>
          <span className="text-xl font-black text-amber-400">{stats.battlesWon}</span>
        </div>
        <div className="bg-slate-900/70 p-3.5 rounded-xl border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Доля побед (Win Rate)</span>
          <span className="text-xl font-black text-emerald-400">{winRate}%</span>
        </div>
        <div className="bg-slate-900/70 p-3.5 rounded-xl border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Всего урона отрядов</span>
          <span className="text-xl font-black text-rose-400">{stats.totalDamage}</span>
        </div>
        <div className="bg-slate-900/70 p-3.5 rounded-xl border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Текущий Цикл (NG+)</span>
          <span className="text-xl font-black text-purple-400">Цикл {campaign.cycle}</span>
        </div>
      </div>

      {/* Achievements List */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Ордена и Достижения Механиков
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {ACHIEVEMENTS.map(ach => {
            const unlocked = ach.isUnlocked(store);
            return (
              <div
                key={ach.id}
                className={`p-3.5 rounded-xl border flex items-center gap-3.5 transition ${
                  unlocked
                    ? 'bg-amber-950/20 border-amber-500/40 shadow-md'
                    : 'bg-slate-950/40 border-slate-800 opacity-50'
                }`}
              >
                <div className={`p-2.5 rounded-xl border ${unlocked ? 'bg-amber-500/10 border-amber-500/30' : 'bg-slate-900 border-slate-800'}`}>
                  {ach.icon}
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className={`font-bold text-sm ${unlocked ? 'text-amber-300' : 'text-slate-400'}`}>
                      {ach.title}
                    </span>
                    {unlocked && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        ВЫПОЛНЕНО
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 leading-snug">{ach.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
