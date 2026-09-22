import { create } from 'zustand';
import { INITIAL_BUILDINGS, CityBuilding } from '../data/buildings';
import { CampaignNode } from '../data/campaign';
import { GEAR_POOL, GearItem, GearSlot } from '../data/gear';
import { INITIAL_CHAMPIONS, ChampionSquad } from '../data/recruits';
import { TECH_NODES } from '../data/techs';
import { CampaignState, completeCampaignNode, advanceToNextCycle, initializeCampaign } from '../engine/campaign/nodeLogic';
import { FightSimulationResult, TacticalCard } from '../engine/combat/combat.types';
import { simulateFight } from '../engine/combat/simulateFight';
import { calculateBuildingUpgradeCost, computeCityTick } from '../engine/economy/cityTick';
import { calculateAccumulatedIcons, getActiveDogmas, isTechUnlockable } from '../engine/economy/techTree';
import { dismantleGearReward, fuseGears, generateLootGear } from '../engine/loot/gearGenerator';
import { buildUnitEntityFromChampion } from '../engine/unit/computeUnit';
import { UnitEntity } from '../engine/unit/unit.types';
import { loadGameStateFromLocalStorage, saveGameStateToLocalStorage } from './persistence';
import { soundManager } from '../utils/audio';

export interface GameResources {
  gold: number;
  cogParts: number;
  science: number;
  culture: number;
}

export interface PlayerStats {
  battlesWon: number;
  battlesLost: number;
  totalDamage: number;
  highestCycle: number;
  gearsFused: number;
  achievements: string[];
}

export interface ActiveBattleState {
  isFighting: boolean;
  currentNode: CampaignNode | null;
  fightResult: FightSimulationResult | null;
  frameIndex: number;
  playbackSpeed: 1 | 2 | 'instant';
  isPlaying: boolean;
  playerUnits: UnitEntity[];
  enemyUnits: UnitEntity[];
  tacticalMorale: number;
  availableTactics: TacticalCard[];
  battleEnded: boolean;
  lootAwarded?: {
    gold: number;
    science: number;
    cogParts: number;
    gear?: GearItem;
  };
}

interface GameStoreState {
  resources: GameResources;
  champions: ChampionSquad[];
  inventory: GearItem[];
  buildings: CityBuilding[];
  unlockedTechIds: string[];
  campaign: CampaignState;
  activeBattle: ActiveBattleState;
  stats: PlayerStats;
  soundEnabled: boolean;

  // Actions
  equipGear: (squadId: string, slot: GearSlot, gearId: string) => void;
  unequipGear: (squadId: string, slot: GearSlot) => void;
  setSquadPosition: (squadId: string, row: number, col: number) => void;
  upgradeBuilding: (buildingId: string) => boolean;
  cityTick: (seconds?: number) => void;
  unlockTech: (techId: string) => boolean;
  fuseThreeGears: (gearIds: [string, string, string]) => { success: boolean; message: string; newGear?: GearItem };
  dismantleGear: (gearId: string) => void;
  startBattle: (nodeId: string) => void;
  handleRestNode: (nodeId: string) => void;
  handleWorkshopNode: (nodeId: string) => void;
  stepBattle: () => void;
  setBattleFrameIndex: (idx: number) => void;
  setPlaybackSpeed: (speed: 1 | 2 | 'instant') => void;
  setIsPlaying: (playing: boolean) => void;
  useTacticalCard: (cardId: string) => void;
  finishBattle: () => void;
  toggleSound: () => void;
  resetGame: () => void;
  saveGame: () => void;
}

const TACTICAL_DECK: TacticalCard[] = [
  {
    id: 'tactic_shield_phalanx',
    name: 'Паровой Заслон',
    costMorale: 30,
    effect: 'shield_all',
    description: 'Развернуть мобильные щиты: +40 броневого барьера всем союзникам.',
  },
  {
    id: 'tactic_focused_burst',
    name: 'Синхронный Залп',
    costMorale: 40,
    effect: 'focused_fire',
    description: 'Навести оптику: +25% к шансу крита и +15% к точности до конца боя.',
  },
];

const INITIAL_RESOURCES: GameResources = {
  gold: 120,
  cogParts: 60,
  science: 60,
  culture: 0,
};

const INITIAL_INVENTORY: GearItem[] = [
  { ...GEAR_POOL[0], id: 'starter_gear_1', level: 1 },
  { ...GEAR_POOL[7], id: 'starter_gear_2', level: 1 }, // drive
  { ...GEAR_POOL[13], id: 'starter_gear_3', level: 1 }, // aux
  { ...GEAR_POOL[2], id: 'starter_gear_4', level: 1 }, // steam press core
  { ...GEAR_POOL[9], id: 'starter_gear_5', level: 1 }, // steam injector drive
];

const INITIAL_STATS: PlayerStats = {
  battlesWon: 0,
  battlesLost: 0,
  totalDamage: 0,
  highestCycle: 1,
  gearsFused: 0,
  achievements: [],
};

const INITIAL_BATTLE_STATE: ActiveBattleState = {
  isFighting: false,
  currentNode: null,
  fightResult: null,
  frameIndex: 0,
  playbackSpeed: 1,
  isPlaying: false,
  playerUnits: [],
  enemyUnits: [],
  tacticalMorale: 50,
  availableTactics: TACTICAL_DECK,
  battleEnded: false,
};

export const useGameStore = create<GameStoreState>((set, get) => {
  // Load saved or initial state
  const saved = loadGameStateFromLocalStorage<{
    resources: GameResources;
    champions: ChampionSquad[];
    inventory: GearItem[];
    buildings: CityBuilding[];
    unlockedTechIds: string[];
    campaign: CampaignState;
    stats: PlayerStats;
  }>();

  return {
    resources: saved?.resources ?? INITIAL_RESOURCES,
    champions: saved?.champions ?? INITIAL_CHAMPIONS,
    inventory: saved?.inventory ?? INITIAL_INVENTORY,
    buildings: saved?.buildings ?? INITIAL_BUILDINGS,
    unlockedTechIds: saved?.unlockedTechIds ?? ['primitive_foundry'],
    campaign: saved?.campaign ?? initializeCampaign(1),
    activeBattle: INITIAL_BATTLE_STATE,
    stats: saved?.stats ?? INITIAL_STATS,
    soundEnabled: true,

    saveGame: () => {
      const s = get();
      saveGameStateToLocalStorage({
        resources: s.resources,
        champions: s.champions,
        inventory: s.inventory,
        buildings: s.buildings,
        unlockedTechIds: s.unlockedTechIds,
        campaign: s.campaign,
        stats: s.stats,
      });
    },

    toggleSound: () => {
      const current = get().soundEnabled;
      soundManager.enabled = !current;
      set({ soundEnabled: !current });
    },

    resetGame: () => {
      localStorage.clear();
      set({
        resources: INITIAL_RESOURCES,
        champions: INITIAL_CHAMPIONS,
        inventory: INITIAL_INVENTORY,
        buildings: INITIAL_BUILDINGS,
        unlockedTechIds: ['primitive_foundry'],
        campaign: initializeCampaign(1),
        activeBattle: INITIAL_BATTLE_STATE,
        stats: INITIAL_STATS,
      });
    },

    equipGear: (squadId, slot, gearId) => {
      const { champions, inventory } = get();
      const squad = champions.find(c => c.id === squadId);
      const gear = inventory.find(g => g.id === gearId);
      if (!squad || !gear || gear.slot !== slot) return;

      const previousGear = squad.equippedGear[slot];
      const newInventory = inventory.filter(g => g.id !== gearId);
      if (previousGear) {
        newInventory.push(previousGear);
      }

      const updatedSquads = champions.map(c =>
        c.id === squadId
          ? {
              ...c,
              equippedGear: {
                ...c.equippedGear,
                [slot]: gear,
              },
            }
          : c
      );

      soundManager.playCraft();
      set({ champions: updatedSquads, inventory: newInventory });
      get().saveGame();
    },

    unequipGear: (squadId, slot) => {
      const { champions, inventory } = get();
      const squad = champions.find(c => c.id === squadId);
      if (!squad) return;

      const gear = squad.equippedGear[slot];
      if (!gear) return;

      const updatedSquads = champions.map(c =>
        c.id === squadId
          ? {
              ...c,
              equippedGear: {
                ...c.equippedGear,
                [slot]: undefined,
              },
            }
          : c
      );

      set({ champions: updatedSquads, inventory: [...inventory, gear] });
      get().saveGame();
    },

    setSquadPosition: (squadId, row, col) => {
      const { champions } = get();
      const updated = champions.map(c =>
        c.id === squadId ? { ...c, preferredLine: Math.max(0, Math.min(4, row)), col: Math.max(0, Math.min(9, col)) } : c
      );
      set({ champions: updated });
      get().saveGame();
    },

    upgradeBuilding: (buildingId) => {
      const { buildings, resources } = get();
      const b = buildings.find(x => x.id === buildingId);
      if (!b || b.level >= b.maxLevel) return false;

      const cost = calculateBuildingUpgradeCost(b);
      if (resources.gold < cost.gold || resources.cogParts < cost.cogParts) return false;

      const updatedBuildings = buildings.map(item =>
        item.id === buildingId ? { ...item, level: item.level + 1 } : item
      );

      soundManager.playCraft();
      set({
        resources: {
          ...resources,
          gold: resources.gold - cost.gold,
          cogParts: resources.cogParts - cost.cogParts,
        },
        buildings: updatedBuildings,
      });
      get().saveGame();
      return true;
    },

    cityTick: (seconds = 5) => {
      const { buildings, unlockedTechIds, resources } = get();
      const unlockedTechs = TECH_NODES.filter(t => unlockedTechIds.includes(t.id));
      const delta = computeCityTick(buildings, unlockedTechs, seconds);

      set({
        resources: {
          gold: Number((resources.gold + delta.goldProduced).toFixed(1)),
          cogParts: Number((resources.cogParts + delta.cogPartsProduced).toFixed(1)),
          science: Number((resources.science + delta.scienceProduced).toFixed(1)),
          culture: Number((resources.culture + delta.cultureProduced).toFixed(1)),
        },
      });
    },

    unlockTech: (techId) => {
      const { unlockedTechIds, resources } = get();
      const check = isTechUnlockable(techId, unlockedTechIds, resources.science);
      if (!check.canUnlock) return false;

      const tech = TECH_NODES.find(t => t.id === techId);
      if (!tech) return false;

      soundManager.playCraft();
      const newUnlocked = [...unlockedTechIds, techId];
      set({
        resources: {
          ...resources,
          science: resources.science - tech.cost,
        },
        unlockedTechIds: newUnlocked,
      });
      get().saveGame();
      return true;
    },

    fuseThreeGears: (gearIds) => {
      const { inventory, stats } = get();
      const items = inventory.filter(g => gearIds.includes(g.id));
      const result = fuseGears(items);

      if (!result.success || !result.resultGear) {
        return { success: false, message: result.error || 'Ошибка слияния' };
      }

      const remainingInventory = inventory.filter(g => !gearIds.includes(g.id));
      remainingInventory.push(result.resultGear);

      soundManager.playVictory();
      set({
        inventory: remainingInventory,
        stats: {
          ...stats,
          gearsFused: stats.gearsFused + 1,
        },
      });
      get().saveGame();
      return { success: true, message: `Получено: ${result.resultGear.name}!`, newGear: result.resultGear };
    },

    dismantleGear: (gearId) => {
      const { inventory, resources } = get();
      const item = inventory.find(g => g.id === gearId);
      if (!item) return;

      const reward = dismantleGearReward(item);
      const updatedInventory = inventory.filter(g => g.id !== gearId);

      soundManager.playCraft();
      set({
        inventory: updatedInventory,
        resources: {
          ...resources,
          cogParts: resources.cogParts + reward.cogParts,
          gold: resources.gold + reward.gold,
        },
      });
      get().saveGame();
    },

    handleRestNode: (nodeId) => {
      const { campaign, resources } = get();
      const node = campaign.nodes.find(n => n.id === nodeId);
      if (!node) return;

      const { updatedCampaign } = completeCampaignNode(campaign, nodeId);
      soundManager.playVictory();
      set({
        campaign: updatedCampaign,
        resources: {
          ...resources,
          gold: resources.gold + node.rewards.gold,
          science: resources.science + node.rewards.science,
          cogParts: resources.cogParts + node.rewards.cogParts,
        },
      });
      get().saveGame();
    },

    handleWorkshopNode: (nodeId) => {
      const { campaign, resources, inventory } = get();
      const node = campaign.nodes.find(n => n.id === nodeId);
      if (!node) return;

      const freeGear = generateLootGear(campaign.cycle, 'rare');
      const { updatedCampaign } = completeCampaignNode(campaign, nodeId);

      soundManager.playVictory();
      set({
        campaign: updatedCampaign,
        inventory: [...inventory, freeGear],
        resources: {
          ...resources,
          gold: resources.gold + node.rewards.gold,
          cogParts: resources.cogParts + node.rewards.cogParts,
        },
      });
      get().saveGame();
    },

    startBattle: (nodeId) => {
      const { campaign, champions, unlockedTechIds } = get();
      const node = campaign.nodes.find(n => n.id === nodeId);
      if (!node || !node.enemySquads) return;

      const unlockedTechs = TECH_NODES.filter(t => unlockedTechIds.includes(t.id));
      const icons = calculateAccumulatedIcons(unlockedTechIds);
      const activeDogmas = getActiveDogmas(icons);

      // Build player entities
      const playerUnits: UnitEntity[] = champions.map(c =>
        buildUnitEntityFromChampion(c, { unlockedTechs, activeDogmas })
      );

      // Build enemy entities
      const enemyUnits: UnitEntity[] = node.enemySquads.map((e, idx) => ({
        id: `enemy_${idx}_${Date.now()}`,
        name: e.name,
        role: e.role,
        isPlayer: false,
        row: e.row,
        col: e.col,
        currentHp: Math.round(140 * e.hpMultiplier),
        maxHp: Math.round(140 * e.hpMultiplier),
        shield: 0,
        morale: 100,
        isFled: false,
        stats: {
          attack: Math.round(24 * e.attackMultiplier),
          defense: Math.round(10 * e.hpMultiplier),
          maxHp: Math.round(140 * e.hpMultiplier),
          speed: 10 + e.speedBonus,
          range: e.role === 'arcanist' ? 5 : e.role === 'duelist' ? 2 : 1,
          critChance: 0.1,
          dodgeRate: 0.08,
          accuracy: 0.88,
          effectiveHp: Math.round(140 * e.hpMultiplier + 30),
          armorPenetration: 0.05,
          startingShield: 0,
          activeSets: [],
          activeDogmaBonuses: [],
        },
        equippedGear: {},
        statuses: [],
      }));

      const simulation = simulateFight(playerUnits, enemyUnits);

      set({
        activeBattle: {
          isFighting: true,
          currentNode: node,
          fightResult: simulation,
          frameIndex: 0,
          playbackSpeed: 1,
          isPlaying: true,
          playerUnits,
          enemyUnits,
          tacticalMorale: 50,
          availableTactics: TACTICAL_DECK,
          battleEnded: false,
        },
      });
    },

    stepBattle: () => {
      const { activeBattle } = get();
      if (!activeBattle.fightResult) return;

      const nextIndex = activeBattle.frameIndex + 1;
      if (nextIndex >= activeBattle.fightResult.frames.length) {
        // Battle ended
        const isWin = activeBattle.fightResult.winner === 'player';
        if (isWin) soundManager.playVictory();

        set({
          activeBattle: {
            ...activeBattle,
            frameIndex: activeBattle.fightResult.frames.length - 1,
            isPlaying: false,
            battleEnded: true,
          },
        });
        return;
      }

      const frame = activeBattle.fightResult.frames[nextIndex];
      if (frame.actionType === 'critical_strike') soundManager.playHit(true);
      else if (frame.actionType === 'attack' || frame.actionType === 'ambush_strike') soundManager.playHit(false);
      else if (frame.actionType === 'dodge') soundManager.playDodge();

      set({
        activeBattle: {
          ...activeBattle,
          frameIndex: nextIndex,
          tacticalMorale: Math.min(100, activeBattle.tacticalMorale + 3),
        },
      });
    },

    setBattleFrameIndex: (idx) => {
      const { activeBattle } = get();
      if (!activeBattle.fightResult) return;
      const safeIdx = Math.max(0, Math.min(activeBattle.fightResult.frames.length - 1, idx));
      set({
        activeBattle: {
          ...activeBattle,
          frameIndex: safeIdx,
        },
      });
    },

    setPlaybackSpeed: (speed) => {
      set(s => ({
        activeBattle: {
          ...s.activeBattle,
          playbackSpeed: speed,
        },
      }));
    },

    setIsPlaying: (playing) => {
      set(s => ({
        activeBattle: {
          ...s.activeBattle,
          isPlaying: playing,
        },
      }));
    },

    useTacticalCard: (cardId) => {
      const { activeBattle } = get();
      const card = activeBattle.availableTactics.find(c => c.id === cardId);
      if (!card || activeBattle.tacticalMorale < card.costMorale) return;

      soundManager.playCraft();
      // Apply immediate shield or effect to player units in current snapshot
      set({
        activeBattle: {
          ...activeBattle,
          tacticalMorale: activeBattle.tacticalMorale - card.costMorale,
          availableTactics: activeBattle.availableTactics.filter(c => c.id !== cardId),
        },
      });
    },

    finishBattle: () => {
      const { activeBattle, campaign, stats, resources, inventory } = get();
      if (!activeBattle.fightResult || !activeBattle.currentNode) return;

      const isVictory = activeBattle.fightResult.winner === 'player';
      const node = activeBattle.currentNode;

      if (isVictory) {
        const { updatedCampaign, isBossDefeated } = completeCampaignNode(campaign, node.id);
        const lootGold = node.rewards.gold;
        const lootScience = node.rewards.science;
        const lootCogParts = node.rewards.cogParts;

        let droppedGear: GearItem | undefined = undefined;
        if (Math.random() <= node.rewards.gearDropChance || node.rewards.guaranteedRarity) {
          droppedGear = generateLootGear(campaign.cycle, node.rewards.guaranteedRarity);
        }

        const nextCampaign = isBossDefeated ? advanceToNextCycle(updatedCampaign) : updatedCampaign;

        set({
          campaign: nextCampaign,
          resources: {
            gold: resources.gold + lootGold,
            science: resources.science + lootScience,
            cogParts: resources.cogParts + lootCogParts,
            culture: resources.culture,
          },
          inventory: droppedGear ? [...inventory, droppedGear] : inventory,
          stats: {
            ...stats,
            battlesWon: stats.battlesWon + 1,
            totalDamage: stats.totalDamage + activeBattle.fightResult.totalDamageDealtByPlayer,
            highestCycle: Math.max(stats.highestCycle, nextCampaign.cycle),
          },
          activeBattle: INITIAL_BATTLE_STATE,
        });
      } else {
        set({
          stats: {
            ...stats,
            battlesLost: stats.battlesLost + 1,
          },
          activeBattle: INITIAL_BATTLE_STATE,
        });
      }

      get().saveGame();
    },
  };
});
