import { RARITY_LABEL } from '@/data/gear';
import { SET_BY_ID } from '@/data/sets';
import { describeAbility, TARGETING_LABEL } from '@/engine/unit/computeUnit';
import type { Rarity } from '@/engine/unit/unit.types';
import { formatStatValue, STAT_ICON, STAT_LABEL } from '@/utils/format';
import type { BattleUnitState } from '@/engine/combat/combat.types';

export interface UnitFx {
  /** Ключ анимации; меняется на каждое новое событие, чтобы перезапустить CSS. */
  n: number;
  kind: 'hit' | 'crit' | 'miss' | 'heal' | 'death' | 'rout';
  amount?: number;
}

/** Короткие статы для верхней строки карточки. */
const TOP_STATS = ['atk', 'def', 'spd', 'range'] as const;

export interface UnitCardData {
  id: string;
  name: string;
  icon: string;
  side: 'player' | 'enemy';
  hp: number;
  maxHp: number;
  shield: number;
  morale: number;
  poison: number;
  line: number;
  alive: boolean;
  routed: boolean;
  rarity: Rarity;
  stats: BattleUnitState['stats'];
  abilities: BattleUnitState['abilities'];
  tags: string[];
  targeting: BattleUnitState['targeting'];
  setCounts: Record<string, number>;
}

export function UnitCard({ unit, fx, compact = false }: { unit: UnitCardData; fx?: UnitFx; compact?: boolean }) {
  const hpPct = Math.max(0, Math.min(100, (unit.hp / unit.maxHp) * 100));
  const hpColor = hpPct > 55 ? 'bg-green-500' : hpPct > 25 ? 'bg-yellow-400' : 'bg-red-500';
  const dead = !unit.alive;
  const fxClass =
    fx?.kind === 'hit' ? 'fx-hit' :
    fx?.kind === 'crit' ? 'fx-crit' :
    fx?.kind === 'heal' ? 'fx-heal' :
    fx?.kind === 'death' ? 'fx-dead' :
    fx?.kind === 'rout' ? 'fx-routed' : '';
  const key = fx ? `${fx.kind}-${fx.n}` : 'idle';

  return (
    <div
      key={key}
      className={`relative w-36 select-none rounded-xl border-2 bg-gradient-to-b from-slate-800/95 to-slate-900/95 shadow-lg transition-all rarity-${unit.rarity} ${
        dead ? 'fx-dead opacity-30 grayscale' : ''
      } ${unit.routed && !dead ? 'fx-routed' : ''} ${fxClass}`}
      data-unit={unit.id}
    >
      {/* всплывающие числа */}
      {fx && (fx.kind === 'hit' || fx.kind === 'crit') && (
        <div key={`d${fx.n}`} className="dmg-float fx-float text-lg text-red-400">-{fx.amount}</div>
      )}
      {fx && fx.kind === 'heal' && (
        <div key={`h${fx.n}`} className="dmg-float fx-float text-lg text-green-400">+{fx.amount}</div>
      )}
      {fx && fx.kind === 'miss' && (
        <div key={`m${fx.n}`} className="dmg-float fx-float text-sm text-slate-300">промах</div>
      )}
      {fx && fx.kind === 'crit' && (
        <div key={`c${fx.n}`} className="dmg-float fx-float mt-5 text-xs font-black text-amber-300">КРИТ!</div>
      )}

      {/* шапка: имя + редкость */}
      <div className="flex items-center justify-between gap-1 border-b border-slate-700/70 px-2 py-1">
        <span className="truncate text-xs font-bold text-slate-100">{unit.icon} {unit.name}</span>
        <span className={`text-[9px] uppercase tracking-wide text-rarity-${unit.rarity}`} title={RARITY_LABEL[unit.rarity]}>
          {RARITY_LABEL[unit.rarity].slice(0, 4)}.
        </span>
      </div>

      {/* арт-плейсхолдер */}
      <div className="relative flex h-16 items-center justify-center bg-[radial-gradient(circle_at_50%_40%,rgba(245,158,11,0.12),transparent_70%)] text-4xl">
        {unit.icon}
        {unit.shield > 0 && (
          <span className="absolute bottom-1 left-1 rounded bg-sky-500/20 px-1 text-[10px] font-bold text-sky-300" title="Щит">
            🛡{unit.shield}
          </span>
        )}
        {unit.poison > 0 && (
          <span className="absolute bottom-1 right-1 rounded bg-lime-500/20 px-1 text-[10px] font-bold text-lime-300" title={`Яд ${unit.poison}`}>
            ☠{unit.poison}
          </span>
        )}
        <span className="absolute right-1 top-1 rounded bg-slate-950/70 px-1 text-[9px] text-slate-400" title="Линия">
          Л{unit.line + 1}
        </span>
      </div>

      {/* здоровье */}
      <div className="px-2 pt-1">
        <div className="hpbar">
          <div className={hpColor} style={{ width: `${hpPct}%` }} />
        </div>
        <div className="mt-0.5 flex justify-between text-[9px] text-slate-400">
          <span>❤️ {Math.max(0, unit.hp)}/{unit.maxHp}</span>
          <span title={`Мораль: ${unit.morale}`}>🚩 {Math.round(unit.morale)}</span>
        </div>
      </div>

      {/* короткие статы */}
      <div className="grid grid-cols-4 gap-0.5 px-2 py-1 text-[10px]">
        {TOP_STATS.map((s) => (
          <span key={s} title={`${STAT_LABEL[s]}: ${formatStatValue(s, unit.stats[s])}`} className="rounded bg-slate-800/80 text-center text-slate-300">
            {STAT_ICON[s]}{formatStatValue(s, unit.stats[s])}
          </span>
        ))}
      </div>

      {/* текст способностей */}
      {!compact && (
        <div className="border-t border-slate-700/60 px-2 py-1 text-[9px] leading-snug text-amber-100/80">
          <div className="italic text-slate-400">{TARGETING_LABEL[unit.targeting]}</div>
          {unit.abilities.slice(0, 3).map((ab, i) => (
            <div key={i} className="mt-0.5">{describeAbility(ab)}</div>
          ))}
          {Object.entries(unit.setCounts).map(([setId, n]) => (
            <div key={setId} className="mt-0.5 text-emerald-300/90">
              {SET_BY_ID[setId]?.icon ?? '🔗'} {SET_BY_ID[setId]?.name ?? setId} {n}/4
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
