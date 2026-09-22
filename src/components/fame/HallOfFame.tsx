import { useMemo } from 'react';
import { GEAR_BY_ID, RARITY_LABEL } from '@/data/gear';
import { QUESTS } from '@/data/quests';
import { RECRUIT_BY_ID } from '@/data/recruits';
import { activeDogmas } from '@/engine/economy/techTree';
import { achievementProgress, ACHIEVEMENTS } from '@/engine/progression/meta';
import { progressInputOf } from '@/store/metaInput';
import { ELEMENT_LABEL, STAT_ICON } from '@/utils/format';
import { useGameStore } from '@/store/useGameStore';
import type { Element } from '@/engine/unit/unit.types';

function StatCard({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="rounded-xl bg-slate-900/70 p-3 text-center" title={hint}>
      <div className="text-xs text-slate-400">{label}</div>
      <div className="text-xl font-black text-slate-100">{value}</div>
    </div>
  );
}

export function HallOfFame() {
  const d = useGameStore((s) => s.data);
  const input = useMemo(() => progressInputOf(d, null), [d]);
  const done = useMemo(() => new Set(d.achievementsDone), [d.achievementsDone]);
  const dogmas = useMemo(() => activeDogmas(d.techs), [d.techs]);

  const s = d.stats;
  const totalGames = s.wins + s.losses + s.draws;
  const winRate = totalGames > 0 ? Math.round((s.wins / totalGames) * 100) : 0;
  const topRecruits = Object.entries(s.winsByRecruit).sort((a, b) => b[1] - a[1]).slice(0, 3);
  const topElements = Object.entries(s.winsByElement).sort((a, b) => b[1] - a[1]).slice(0, 3);
  const unlockedCount = done.size;

  return (
    <div className="space-y-5">
      {/* ===== Статистика ===== */}
      <section>
        <div className="mb-2 text-sm font-bold uppercase tracking-widest text-slate-400">📊 Статистика командира</div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-6">
          <StatCard label="Винрейт" value={`${winRate}%`} hint={`${s.wins}П / ${s.losses}Пр / ${s.draws}Н`} />
          <StatCard label="Боёв" value={s.battles} />
          <StatCard label="Серия побед" value={s.winStreak} hint={`лучшая: ${s.bestWinStreak}`} />
          <StatCard label="Самый долгий бой" value={`${s.longestBattle} р.`} />
          <StatCard label="Боссов повержено" value={s.bossKills} />
          <StatCard label="Циклов завершено" value={s.cyclesCompleted} />
          <StatCard label="Шестерёнок найдено" value={s.gearFound} />
          <StatCard label="Слияний" value={s.crafted} />
          <StatCard label="Технологий" value={`${d.techs.length}/27`} />
          <StatCard label="Догм активно" value={`${dogmas.length}/13`} />
          <StatCard label="Побед в стычках" value={s.skirmishWins} />
          <StatCard label="Коллекция" value={d.collection.length} hint={`испытаний: ${unlockedCount}/${ACHIEVEMENTS.length}`} />
        </div>

        {(topRecruits.length > 0 || topElements.length > 0) && (
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            <div className="rounded-xl bg-slate-900/60 p-3">
              <div className="text-xs font-bold text-slate-400">⭐ Любимые отряды (по победам)</div>
              {topRecruits.length === 0 ? (
                <div className="mt-1 text-xs text-slate-600">Пока нет побед</div>
              ) : (
                topRecruits.map(([rid, n]) => (
                  <div key={rid} className="mt-1 flex items-center gap-2 text-sm">
                    <span>{RECRUIT_BY_ID[rid]?.icon ?? '❓'}</span>
                    <span className="text-slate-200">{RECRUIT_BY_ID[rid]?.name ?? rid}</span>
                    <span className="ml-auto font-mono text-amber-300">{n}</span>
                  </div>
                ))
              )}
            </div>
            <div className="rounded-xl bg-slate-900/60 p-3">
              <div className="text-xs font-bold text-slate-400">🔥 Любимые стихии урона</div>
              {topElements.length === 0 ? (
                <div className="mt-1 text-xs text-slate-600">Пока нет побед</div>
              ) : (
                topElements.map(([el, n]) => (
                  <div key={el} className="mt-1 flex items-center gap-2 text-sm">
                    <span className="text-slate-200">{ELEMENT_LABEL[el as Element] ?? el}</span>
                    <span className="ml-auto font-mono text-amber-300">{n}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </section>

      {/* ===== Испытания ===== */}
      <section>
        <div className="mb-2 flex items-center gap-2">
          <span className="text-sm font-bold uppercase tracking-widest text-slate-400">🏆 Испытания</span>
          <span className="text-xs text-slate-500">{unlockedCount}/{ACHIEVEMENTS.length}</span>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {ACHIEVEMENTS.map((a) => {
            const p = achievementProgress(a, input);
            const complete = done.has(a.id) || p.cur >= p.goal;
            const pct = Math.min(100, Math.round((p.cur / Math.max(1, p.goal)) * 100));
            return (
              <div
                key={a.id}
                className={`rounded-xl border-2 p-2.5 ${complete ? 'border-amber-400/70 bg-amber-500/10' : 'border-slate-800 bg-slate-950/60'}`}
                title={a.description}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{a.icon}</span>
                  <span className={`text-sm font-bold ${complete ? 'text-amber-200' : 'text-slate-300'}`}>{a.name}</span>
                  {complete && <span className="ml-auto text-[10px] font-bold uppercase text-amber-400">✓</span>}
                </div>
                <div className="mt-1 text-[11px] text-slate-400">{a.description}</div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded bg-slate-800">
                  <div className={`h-full transition-all ${complete ? 'bg-amber-400' : 'bg-sky-500/70'}`} style={{ width: `${complete ? 100 : pct}%` }} />
                </div>
                <div className="mt-1 flex items-center justify-between text-[10px] text-slate-500">
                  <span>{a.rewardText}</span>
                  <span className="font-mono">{Math.min(p.cur, p.goal)}/{p.goal}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===== Квестовые шестерёнки ===== */}
      <section>
        <div className="mb-2 text-sm font-bold uppercase tracking-widest text-slate-400">🗝️ Квестовые шестерёнки</div>
        <div className="grid gap-2 sm:grid-cols-2">
          {QUESTS.map((q) => {
            const received = d.quests[q.id] || d.collection.some((g) => g.quest === q.id);
            const reward = GEAR_BY_ID[q.rewardDefId];
            return (
              <div key={q.id} className={`rounded-xl border-2 p-3 ${received ? 'rarity-legendary bg-slate-900' : 'border-slate-800 bg-slate-950/60'}`}>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{q.icon}</span>
                  <div className="min-w-0">
                    <div className={`text-sm font-bold ${received ? 'text-amber-200' : 'text-slate-200'}`}>{q.name}</div>
                    <div className="text-[11px] text-slate-400">{q.description}</div>
                  </div>
                  {received && <span className="ml-auto text-[10px] font-bold uppercase text-amber-400">получено</span>}
                </div>
                <div className={`mt-2 rounded-lg border border-slate-700 bg-slate-950/70 p-2 text-[11px] ${reward ? `text-rarity-${reward.rarity}` : ''}`}>
                  Награда: {reward?.icon} <span className="font-bold">{reward?.name}</span>
                  <span className="text-slate-500"> · {reward ? RARITY_LABEL[reward.rarity] : ''}</span>
                  <div className="text-emerald-300/90">
                    {reward && Object.entries(reward.stats).map(([k, v]) => `${STAT_ICON[k as keyof typeof STAT_ICON] ?? ''}${v}`).join(' ')}
                  </div>
                  {reward?.flavor && <div className="mt-0.5 italic text-slate-500">«{reward.flavor}»</div>}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* активные догмы кратким списком */}
      {dogmas.length > 0 && (
        <section className="text-[11px] text-slate-500">
          Активные догмы: {dogmas.map((dg) => `${dg.icon} ${dg.name}`).join(' · ')}
        </section>
      )}
    </div>
  );
}