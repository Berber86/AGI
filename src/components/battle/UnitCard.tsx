import React from 'react';
import { UnitRole } from '../../data/recruits';
import { GearItem, GearRarity } from '../../data/gear';
import { Shield, Swords, Sparkles, Crosshair, Heart, Flame, Zap } from 'lucide-react';

interface UnitCardProps {
  id: string;
  name: string;
  role: UnitRole;
  isPlayer: boolean;
  currentHp: number;
  maxHp: number;
  shield?: number;
  morale?: number;
  stats: {
    attack: number;
    defense: number;
    speed: number;
    range: number;
    critChance: number;
    dodgeRate: number;
  };
  equippedGear?: {
    core?: GearItem;
    drive?: GearItem;
    aux?: GearItem;
  };
  activeSets?: { name: string; count: number }[];
  isDead?: boolean;
  isFled?: boolean;
  isAttacking?: boolean;
  isDamaged?: boolean;
  isCritTarget?: boolean;
  isDodging?: boolean;
  recentDamageText?: string | null;
  compact?: boolean;
  onClick?: () => void;
  selected?: boolean;
}

const RARITY_COLORS: Record<GearRarity, string> = {
  common: 'border-slate-600 bg-slate-900/80 shadow-slate-950/50',
  rare: 'border-blue-500/80 bg-blue-950/40 shadow-blue-900/30',
  epic: 'border-purple-500/80 bg-purple-950/40 shadow-purple-900/30',
  legendary: 'border-amber-400 bg-amber-950/40 shadow-amber-500/20',
};

export const UnitCard: React.FC<UnitCardProps> = ({
  name,
  role,
  isPlayer,
  currentHp,
  maxHp,
  shield = 0,
  morale = 100,
  stats,
  equippedGear,
  activeSets = [],
  isDead = false,
  isFled = false,
  isAttacking = false,
  isDamaged = false,
  isCritTarget = false,
  isDodging = false,
  recentDamageText = null,
  compact = false,
  onClick,
  selected = false,
}) => {
  const hpPercent = Math.max(0, Math.min(100, (currentHp / maxHp) * 100));
  const shieldPercent = Math.min(50, (shield / maxHp) * 100);

  // Highest rarity among equipped gear
  const rarities = [equippedGear?.core?.rarity, equippedGear?.drive?.rarity, equippedGear?.aux?.rarity].filter(Boolean) as GearRarity[];
  const highestRarity: GearRarity = rarities.includes('legendary')
    ? 'legendary'
    : rarities.includes('epic')
    ? 'epic'
    : rarities.includes('rare')
    ? 'rare'
    : 'common';

  const roleIcon =
    role === 'vanguard' ? (
      <Shield className="w-4 h-4 text-amber-400" />
    ) : role === 'duelist' ? (
      <Swords className="w-4 h-4 text-emerald-400" />
    ) : (
      <Sparkles className="w-4 h-4 text-sky-400" />
    );

  const roleTitle = role === 'vanguard' ? 'Авангард' : role === 'duelist' ? 'Дуэлянт' : 'Арканист';

  return (
    <div
      onClick={onClick}
      className={`relative select-none transition-all duration-300 rounded-xl border-2 flex flex-col overflow-hidden ${
        compact ? 'p-2.5 text-xs' : 'p-3 text-sm'
      } ${
        isPlayer ? RARITY_COLORS[highestRarity] : 'border-rose-700/70 bg-rose-950/30 shadow-rose-950/50'
      } ${
        selected ? 'ring-2 ring-amber-400 scale-[1.02]' : 'hover:border-slate-400/60'
      } ${
        isDead ? 'opacity-40 grayscale pointer-events-none' : ''
      } ${
        isFled ? 'opacity-30 border-dashed' : ''
      } ${
        isDamaged ? 'animate-bounce ring-2 ring-rose-500' : ''
      } ${
        isCritTarget ? 'scale-95 ring-4 ring-amber-500 animate-pulse' : ''
      } ${
        isAttacking ? 'translate-y-[-4px] ring-2 ring-sky-400' : ''
      } ${
        isDodging ? 'opacity-70 -translate-x-2' : ''
      } shadow-lg backdrop-blur-md`}
    >
      {/* Floating combat damage text */}
      {recentDamageText && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none animate-bounce font-black text-lg px-2 py-0.5 rounded shadow-xl bg-black/80 border border-amber-400/80 text-amber-300">
          {recentDamageText}
        </div>
      )}

      {/* Header Banner */}
      <div className="flex items-center justify-between pb-1.5 border-b border-slate-700/60">
        <div className="flex items-center gap-1.5 truncate">
          <span className="p-1 rounded bg-slate-800/80 border border-slate-700">{roleIcon}</span>
          <span className="font-bold truncate text-slate-100">{name}</span>
        </div>
        <span
          className={`px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
            isPlayer ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
          }`}
        >
          {roleTitle}
        </span>
      </div>

      {/* Middle visual / HP & Shield */}
      <div className="my-2 space-y-1.5">
        {/* HP Bar */}
        <div className="space-y-0.5">
          <div className="flex justify-between text-[11px] font-medium text-slate-300">
            <span className="flex items-center gap-1">
              <Heart className="w-3 h-3 text-rose-400" />
              <span>{Math.round(currentHp)} / {maxHp}</span>
            </span>
            {shield > 0 && (
              <span className="text-sky-300 font-semibold flex items-center gap-0.5">
                <Shield className="w-3 h-3 text-sky-400 inline" /> +{shield}
              </span>
            )}
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden relative border border-slate-700/60">
            <div
              className={`h-full transition-all duration-300 ${
                hpPercent > 50 ? 'bg-emerald-500' : hpPercent > 20 ? 'bg-amber-500' : 'bg-rose-600'
              }`}
              style={{ width: `${hpPercent}%` }}
            />
            {shield > 0 && (
              <div
                className="absolute top-0 right-0 h-full bg-sky-400/80 shadow-[0_0_8px_rgba(56,189,248,0.8)]"
                style={{ width: `${shieldPercent}%` }}
              />
            )}
          </div>
        </div>

        {/* Morale Bar */}
        <div className="space-y-0.5">
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>Боевой Дух:</span>
            <span className={morale > 50 ? 'text-amber-300' : 'text-rose-400 font-bold'}>{Math.round(morale)}%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-600 to-yellow-400 transition-all duration-300"
              style={{ width: `${Math.max(0, Math.min(100, morale))}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-1 py-1.5 bg-slate-950/60 rounded-lg border border-slate-800/80 text-center text-[11px]">
        <div title="Атака" className="flex flex-col items-center">
          <span className="text-slate-400 flex items-center gap-0.5">
            <Flame className="w-3 h-3 text-orange-400" />
            АТК
          </span>
          <span className="font-bold text-slate-100">{stats.attack}</span>
        </div>
        <div title="Защита" className="flex flex-col items-center">
          <span className="text-slate-400 flex items-center gap-0.5">
            <Shield className="w-3 h-3 text-sky-400" />
            ЗАЩ
          </span>
          <span className="font-bold text-slate-100">{stats.defense}</span>
        </div>
        <div title="Скорость" className="flex flex-col items-center">
          <span className="text-slate-400 flex items-center gap-0.5">
            <Zap className="w-3 h-3 text-yellow-400" />
            СКР
          </span>
          <span className="font-bold text-slate-100">{stats.speed}</span>
        </div>
        <div title="Дальность" className="flex flex-col items-center">
          <span className="text-slate-400 flex items-center gap-0.5">
            <Crosshair className="w-3 h-3 text-emerald-400" />
            ДИСТ
          </span>
          <span className="font-bold text-slate-100">{stats.range}</span>
        </div>
      </div>

      {/* Active Sets & Gear Slots indicator */}
      {!compact && (
        <div className="mt-2 pt-1.5 border-t border-slate-800/80 space-y-1">
          {/* Equipped gear dots */}
          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span>Шестерни:</span>
            <div className="flex items-center gap-1.5">
              <span
                className={`w-2.5 h-2.5 rounded-full border ${
                  equippedGear?.core ? 'bg-amber-400 border-amber-300' : 'bg-slate-800 border-slate-600'
                }`}
                title={`Главная: ${equippedGear?.core?.name || 'Пусто'}`}
              />
              <span
                className={`w-2.5 h-2.5 rounded-full border ${
                  equippedGear?.drive ? 'bg-sky-400 border-sky-300' : 'bg-slate-800 border-slate-600'
                }`}
                title={`Привод: ${equippedGear?.drive?.name || 'Пусто'}`}
              />
              <span
                className={`w-2.5 h-2.5 rounded-full border ${
                  equippedGear?.aux ? 'bg-purple-400 border-purple-300' : 'bg-slate-800 border-slate-600'
                }`}
                title={`Вспомогат.: ${equippedGear?.aux?.name || 'Пусто'}`}
              />
            </div>
          </div>

          {/* Active set badge */}
          {activeSets.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {activeSets.map(s => (
                <span
                  key={s.name}
                  className="px-1.5 py-0.5 text-[9px] rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 font-medium"
                >
                  ⚙️ {s.name} ({s.count}/3)
                </span>
              ))}
            </div>
          )}

          {/* Special ability snippet */}
          <div className="text-[10px] text-slate-400 bg-slate-900/60 p-1 rounded border border-slate-800 italic">
            {role === 'vanguard' && '«Паровой Отвод»: -4 к получаемому физ. урону.'}
            {role === 'duelist' && '«Смертоносный Спуск»: криты наносят 220% урона.'}
            {role === 'arcanist' && '«Шрапнельный Каскад»: сплэш 30% урона по соседним рядам.'}
          </div>
        </div>
      )}

      {isDead && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center font-bold text-rose-400 text-sm tracking-widest uppercase">
          Уничтожен
        </div>
      )}
      {isFled && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center font-bold text-slate-300 text-sm tracking-widest uppercase">
          Отступил
        </div>
      )}
    </div>
  );
};
