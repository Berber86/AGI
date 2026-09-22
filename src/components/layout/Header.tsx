import React from 'react';
import { useGameStore } from '../../store/useGameStore';
import {
  MapPin,
  Shield,
  Building2,
  BookOpen,
  Wrench,
  Volume2,
  VolumeX,
  Trophy,
  Coins,
  Cpu,
  Sparkles,
} from 'lucide-react';

export type NavTab = 'campaign' | 'army' | 'city' | 'tech' | 'workshop' | 'stats';

interface HeaderProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, onTabChange }) => {
  const { resources, campaign, soundEnabled, toggleSound } = useGameStore();

  const navItems: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    { id: 'campaign', label: 'Кампания', icon: <MapPin className="w-4 h-4" /> },
    { id: 'army', label: 'Отряды (3)', icon: <Shield className="w-4 h-4" /> },
    { id: 'city', label: 'Город', icon: <Building2 className="w-4 h-4" /> },
    { id: 'tech', label: 'Технологии', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'workshop', label: 'Мастерская', icon: <Wrench className="w-4 h-4" /> },
    { id: 'stats', label: 'Зал Славы', icon: <Trophy className="w-4 h-4" /> },
  ];

  return (
    <header className="bg-[#12151b] border-b border-slate-800 sticky top-0 z-40 select-none shadow-md">
      {/* Top row: Brand & Resources */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-900/40 border border-amber-400/40">
            <span className="text-base font-black text-slate-950">⚙</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-sm tracking-wide text-slate-100 uppercase">
                Механизм Цивилизации
              </span>
              <span className="text-[10px] text-amber-400 font-mono font-bold px-1.5 py-0.2 rounded bg-amber-500/10 border border-amber-500/30">
                Цикл {campaign.cycle}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 block -mt-0.5">Cog Empires • 10x20 Auto-Tactics</span>
          </div>
        </div>

        {/* Resources Bar */}
        <div className="flex items-center gap-2 sm:gap-4 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-mono">
          <div className="flex items-center gap-1.5" title="Золото: используется для мануфактур и покупок">
            <Coins className="w-4 h-4 text-yellow-400" />
            <span className="font-bold text-slate-200">{Math.floor(resources.gold)}</span>
          </div>
          <div className="w-px h-3.5 bg-slate-800" />
          <div className="flex items-center gap-1.5" title="Запчасти: шестерни для улучшений и крафта">
            <Cpu className="w-4 h-4 text-orange-400" />
            <span className="font-bold text-slate-200">{Math.floor(resources.cogParts)}</span>
          </div>
          <div className="w-px h-3.5 bg-slate-800" />
          <div className="flex items-center gap-1.5" title="Наука: очки для открытия карточных технологий">
            <BookOpen className="w-4 h-4 text-sky-400" />
            <span className="font-bold text-slate-200">{Math.floor(resources.science)}</span>
          </div>
          <div className="w-px h-3.5 bg-slate-800" />
          <div className="flex items-center gap-1.5" title="Культура: догмы и гражданские институты">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="font-bold text-slate-200">{Math.floor(resources.culture)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSound}
            className={`p-2 rounded-lg border transition ${
              soundEnabled
                ? 'bg-slate-900 border-slate-700 text-amber-400 hover:text-amber-300'
                : 'bg-slate-950 border-slate-800 text-slate-600 hover:text-slate-400'
            }`}
            title={soundEnabled ? 'Звук включен (Web Audio)' : 'Звук отключен'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Tabs navigation row */}
      <div className="max-w-7xl mx-auto px-4 flex gap-1 overflow-x-auto scrollbar-none border-t border-slate-800/80">
        {navItems.map(item => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold transition border-b-2 whitespace-nowrap ${
                isActive
                  ? 'border-amber-400 text-amber-400 bg-amber-500/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
