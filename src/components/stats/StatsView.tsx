import React, { useState } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { Award, Trophy, Target, ShieldCheck, Flame, RotateCcw, Swords, Share2, Copy, Check } from 'lucide-react';

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
  const { stats, campaign, resetGame, startSandboxBattle, champions } = store;

  const [copiedCode, setCopiedCode] = useState(false);
  const [importCode, setImportCode] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const winRate =
    stats.battlesWon + stats.battlesLost > 0
      ? Math.round((stats.battlesWon / (stats.battlesWon + stats.battlesLost)) * 100)
      : 100;

  // Export current squad build as compact Base64 code
  const handleExportBuild = () => {
    try {
      const buildData = champions.map(c => ({
        id: c.id,
        line: c.preferredLine,
        col: c.col,
        core: c.equippedGear.core?.templateId,
        drive: c.equippedGear.drive?.templateId,
        aux: c.equippedGear.aux?.templateId,
      }));
      const encoded = btoa(JSON.stringify(buildData));
      navigator.clipboard.writeText(encoded);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
    } catch (e) {
      console.warn('Clipboard write error', e);
    }
  };

  const handleImportBuild = () => {
    try {
      if (!importCode.trim()) return;
      const decoded = JSON.parse(atob(importCode.trim()));
      if (!Array.isArray(decoded)) throw new Error('Неверный формат сборки');

      setImportStatus('Код сборки валиден! В будущих обновлениях активируется авто-экипировка.');
    } catch (e) {
      setImportStatus('Ошибка: неверный код сборки.');
    }
  };

  return (
    <div className="flex flex-col h-full p-4 gap-4 overflow-y-auto max-w-7xl mx-auto w-full">
      {/* Top Banner */}
      <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-amber-400 uppercase tracking-wide">
            Архив Империи: Статистика, Испытания и Полигон
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Прогрессия побед, показатели урона, история циклов, тренировочный полигон и экспорт сборок.
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

      {/* PvP Sandbox / Training Grounds */}
      <div className="bg-gradient-to-r from-amber-950/30 via-slate-900 to-slate-900 p-4 rounded-xl border border-amber-500/30 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Swords className="w-5 h-5 text-amber-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-amber-300">
              Испытательный Полигон (Sandbox Bot Arena)
            </h2>
          </div>
          <span className="text-xs text-slate-400">Тестируйте сборки ваших отрядов без риска</span>
        </div>

        <p className="text-xs text-slate-300">
          Сразитесь с тренировочными гарнизонами ботов разной специализации, чтобы проверить эффективность ваших расстановок и сет-бонусов:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            onClick={() => startSandboxBattle('fortress')}
            className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-amber-400 flex flex-col justify-between text-left transition group"
          >
            <div>
              <span className="text-[10px] font-bold text-sky-400 uppercase">Броневой Бастион</span>
              <h4 className="font-bold text-xs text-slate-200 group-hover:text-amber-300">Два Колосса с Щитами</h4>
              <p className="text-[11px] text-slate-400 mt-1">Высокая защита (22) и мощный барьер 60 HP. Проверка на урон в секунду.</p>
            </div>
            <span className="mt-3 text-xs font-bold text-amber-400 flex items-center gap-1">Тестировать бой →</span>
          </button>

          <button
            onClick={() => startSandboxBattle('assassins')}
            className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-amber-400 flex flex-col justify-between text-left transition group"
          >
            <div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase">Фланговые Ликвидаторы</span>
              <h4 className="font-bold text-xs text-slate-200 group-hover:text-amber-300">Два Скоростных Дуэлянта</h4>
              <p className="text-[11px] text-slate-400 mt-1">Скорость 20, крит 35%, внезапная атака (Ambush). Проверка на живучесть.</p>
            </div>
            <span className="mt-3 text-xs font-bold text-amber-400 flex items-center gap-1">Тестировать бой →</span>
          </button>

          <button
            onClick={() => startSandboxBattle('swarm')}
            className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-amber-400 flex flex-col justify-between text-left transition group"
          >
            <div>
              <span className="text-[10px] font-bold text-purple-400 uppercase">Шестеренный Рой</span>
              <h4 className="font-bold text-xs text-slate-200 group-hover:text-amber-300">Три Юнита с Мортирой</h4>
              <p className="text-[11px] text-slate-400 mt-1">Осада по тылу и быстрые перехватчики. Проверка на сплэш-урон.</p>
            </div>
            <span className="mt-3 text-xs font-bold text-amber-400 flex items-center gap-1">Тестировать бой →</span>
          </button>
        </div>
      </div>

      {/* Build Export & Import for Community / PvP Sharing */}
      <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 shadow-md space-y-3">
        <div className="flex items-center gap-2">
          <Share2 className="w-4 h-4 text-sky-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Экспорт и Обмен Сборками Отрядов (PvP Build Sharing)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <span className="text-xs text-slate-400 block">Скопировать код текущей расстановки и экипировки 3 отрядов:</span>
            <button
              onClick={handleExportBuild}
              className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition"
            >
              {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copiedCode ? 'Код скопирован в буфер!' : 'Экспортировать текущую сборку'}
            </button>
          </div>

          <div className="space-y-2">
            <span className="text-xs text-slate-400 block">Импортировать код сборки соперника:</span>
            <div className="flex gap-2">
              <input
                type="text"
                value={importCode}
                onChange={(e) => setImportCode(e.target.value)}
                placeholder="Вставьте Base64 код..."
                className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 font-mono"
              />
              <button
                onClick={handleImportBuild}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700"
              >
                Проверить
              </button>
            </div>
            {importStatus && <span className="text-xs text-amber-300 block">{importStatus}</span>}
          </div>
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
