import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { NoticeStack } from '@/components/layout/NoticeStack';
import { CampaignMap } from '@/components/campaign/CampaignMap';
import { CityPanel } from '@/components/city/CityPanel';
import { TechTreePanel } from '@/components/techtree/TechTreePanel';
import { ArmyBuilderPanel } from '@/components/armybuilder/ArmyBuilderPanel';
import { WorkshopPanel } from '@/components/workshop/WorkshopPanel';
import { BattleScreen } from '@/components/battle/BattleScreen';
import { PrepModal } from '@/components/battle/PrepModal';
import { useGameStore } from '@/store/useGameStore';

const TABS = [
  { id: 'campaign', label: 'Кампания', icon: '🗺️' },
  { id: 'city', label: 'Город', icon: '🏛️' },
  { id: 'tech', label: 'Технологии', icon: '🔬' },
  { id: 'army', label: 'Армия', icon: '🛡️' },
  { id: 'workshop', label: 'Мастерская', icon: '⚙️' },
] as const;

type TabId = (typeof TABS)[number]['id'];

export default function App() {
  const [tab, setTab] = useState<TabId>('campaign');
  const prep = useGameStore((s) => s.prep);
  const session = useGameStore((s) => s.session);

  return (
    <div className="min-h-screen text-slate-100">
      <Header />
      <NoticeStack />
      {prep && <PrepModal />}
      {session && <BattleScreen />}

      <nav className="flex gap-1 border-b border-slate-800 bg-slate-950/60 px-4 pt-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-t-lg px-4 py-2 text-sm font-semibold transition ${
              tab === t.id
                ? 'border-x border-t border-amber-500/40 bg-slate-900 text-amber-200'
                : 'text-slate-400 hover:bg-slate-900/50 hover:text-slate-200'
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </nav>

      <main className="mx-auto max-w-6xl p-4">
        {tab === 'campaign' && <CampaignMap />}
        {tab === 'city' && <CityPanel />}
        {tab === 'tech' && <TechTreePanel />}
        {tab === 'army' && <ArmyBuilderPanel />}
        {tab === 'workshop' && <WorkshopPanel />}
      </main>

      <footer className="border-t border-slate-800/60 px-4 py-3 text-center text-[10px] text-slate-600">
        Механизм Цивилизации (Cog Empires) · Прототип · Фаза 0 · Прогресс сохраняется в браузере автоматически
      </footer>
    </div>
  );
}
