import React, { useState, useEffect } from 'react';
import { useGameStore } from './store/useGameStore';
import { Header, NavTab } from './components/layout/Header';
import { CampaignMap } from './components/campaign/CampaignMap';
import { ArmyBuilder } from './components/armybuilder/ArmyBuilder';
import { CityView } from './components/city/CityView';
import { TechTreeView } from './components/techtree/TechTreeView';
import { WorkshopView } from './components/workshop/WorkshopView';
import { StatsView } from './components/stats/StatsView';
import { BattleArena } from './components/battle/BattleArena';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('campaign');
  const { activeBattle, cityTick } = useGameStore();

  // Automatic city production tick every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      cityTick(5);
    }, 5000);
    return () => clearInterval(timer);
  }, [cityTick]);

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0d11] text-slate-100">
      <Header currentTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1 flex flex-col overflow-hidden">
        {activeBattle.isFighting ? (
          <BattleArena />
        ) : (
          <>
            {activeTab === 'campaign' && <CampaignMap />}
            {activeTab === 'army' && <ArmyBuilder />}
            {activeTab === 'city' && <CityView />}
            {activeTab === 'tech' && <TechTreeView />}
            {activeTab === 'workshop' && <WorkshopView />}
            {activeTab === 'stats' && <StatsView />}
          </>
        )}
      </main>
    </div>
  );
};

export default App;
