import { create } from 'zustand';
import { CAMPAIGN_NODE_BY_ID as NODE_BY_ID, NODE_KIND_META } from '@/data/campaign';
import { BUILDING_BY_ID as BUILDING_LOOKUP } from '@/data/buildings';
import { RECRUIT_BY_ID, PLAYER_RECRUIT_IDS } from '@/data/recruits';
import { TECH_BY_ID as TECH_LOOKUP } from '@/data/techs';
import type { Encounter } from '@/engine/campaign/nodeLogic';
import { generateEncounter, generateSkirmish, isCycleComplete, LOOT_COUNT, TICKS_FOR_NODE, treasureLoot } from '@/engine/campaign/nodeLogic';
import { BattleSim } from '@/engine/combat/simulateFight';
import type { MomentumTactic } from '@/engine/combat/combat.types';
import { cityTick, canAfford, addResources, buildingCost, ZERO_RESOURCES } from '@/engine/economy/cityTick';
import { activeDogmas, collectModifiers, craftDiscount, lootCountBonus, lootRarityBonus } from '@/engine/economy/techTree';
import { canCraft, craftCost, craftGear, rollLoot, SALVAGE_ORE } from '@/engine/loot/gearGenerator';
import { computeUnit } from '@/engine/unit/computeUnit';
import { GEAR_SLOTS, type GearInstance, type GearSlot, type Modifier, type Resources, type SquadSetup } from '@/engine/unit/unit.types';
import { combineSeed, createRng } from '@/utils/rng';
import type { ActiveBattle, GameData, Notice, Squad } from './gameState.types';
import { clearSavedGame, loadGame, saveGame } from './persistence';

/** Бой на стадии расстановки (до «В бой!»). */
export interface BattlePrep {
  nodeId: string;
  kind: ActiveBattle['kind'];
  encounter: Encounter;
  /** Для стычек — их счётчик (фиксируется при подтверждении). */
  skirmishCounter?: number;
}

/** Живой бой: пошаговый симулятор + контекст узла. Не сериализуется и не сохраняется. */
export interface BattleSession {
  sim: BattleSim;
  nodeId: string;
  kind: ActiveBattle['kind'];
  encounter: Encounter;
}

/** Граф переходов кампании: из узла → в какие узлы можно идти. */
const NEXT_OF: Record<string, string[]> = Object.fromEntries(
  Object.entries(NODE_BY_ID).map(([id, n]) => [id, n.next]),
);

export const SAVE_VERSION = 1;
export const MAX_SQUADS = 3;

const START_RESOURCES: Resources = { food: 60, ore: 20, science: 30, gold: 60 };

function startingCollection(): GearInstance[] {
  const mk = (defId: string, uid: string): GearInstance => ({ uid, defId, rarity: 'common', quality: 1, affixes: [], cycle: 1 });
  return [mk('rusty_sword', 'start_weapon'), mk('gambeson', 'start_armor'), mk('crude_cog', 'start_core')];
}

function startingSquads(): Squad[] {
  return [
    { id: 'sq1', name: 'Первый отряд', recruitId: null, gear: { weapon: 'start_weapon', armor: 'start_armor', trinket: null, core: 'start_core' }, line: 0, column: 2 },
    { id: 'sq2', name: 'Второй отряд', recruitId: null, gear: { weapon: null, armor: null, trinket: null, core: null }, line: 1, column: 4 },
    { id: 'sq3', name: 'Третий отряд', recruitId: null, gear: { weapon: null, armor: null, trinket: null, core: null }, line: 1, column: 6 },
  ];
}

function freshData(seed?: number): GameData {
  return {
    version: SAVE_VERSION,
    cycle: 1,
    day: 0,
    campaignSeed: seed ?? Math.floor(Math.random() * 2 ** 31),
    resources: { ...START_RESOURCES },
    buildings: {},
    techs: [],
    collection: startingCollection(),
    squads: startingSquads(),
    campaign: { currentNodeId: 'start', completed: [], skirmishCount: 0, battleAttempts: 0 },
    stats: { battles: 0, wins: 0, losses: 0, draws: 0, gearFound: 0, crafted: 0, longestBattle: 0, bossKills: 0, cyclesCompleted: 0 },
    battle: null,
    notices: [{ id: 1, text: 'Цикл 1. Собери отряд и выдвигайся.', tone: 'info' }],
  };
}

export interface GameStore {
  data: GameData;
  craftSelection: string[];
  /** Бой на стадии расстановки. */
  prep: BattlePrep | null;
  /** Живой бой (пошаговый симулятор). Не персистится. */
  session: BattleSession | null;
  /** Счётчик изменений симуляции — чтобы React реагировал на мутации sim. */
  simVersion: number;
  // --- производные селекторы ---
  modifiers(): Modifier[];
  computedSquads(): (ReturnType<typeof computeUnit> | null)[];
  // --- уведомления ---
  notify(text: string, tone?: Notice['tone']): void;
  dismissNotice(id: number): void;
  // --- экономика ---
  tickOnce(): void;
  build(id: string): void;
  research(id: string): void;
  hire(squadId: string, recruitId: string): void;
  disband(squadId: string): void;
  renameSquad(squadId: string, name: string): void;
  placeSquad(squadId: string, line: number, column: number): void;
  equip(squadId: string, slot: GearSlot, itemUid: string | null): void;
  salvage(uid: string): void;
  toggleCraftSelect(uid: string): void;
  craft(): void;
  // --- кампания и бой ---
  enterNode(nodeId: string): void;
  fightSkirmish(): void;
  confirmPrep(): void;
  cancelPrep(): void;
  stepSim(): void;
  useMomentum(tactic: MomentumTactic): void;
  skipMomentum(): void;
  finishBattle(): void;
  clearSession(): void;
  restart(): void;
  hardReset(): void;
}

let noticeId = 100;

export const useGameStore = create<GameStore>()((set, get) => {
  const saved = loadGame();
  const initial = saved && saved.version === SAVE_VERSION ? saved : freshData();

  const mutate = (fn: (d: GameData) => void): void => {
    set((state) => {
      const d: GameData = structuredClone(state.data);
      fn(d);
      return { data: d };
    });
  };

  return {
    data: initial,
    craftSelection: [],
    prep: null,
    session: null,
    simVersion: 0,

    modifiers() {
      const d = get().data;
      return collectModifiers(d.techs, d.buildings);
    },

    computedSquads() {
      const d = get().data;
      const mods = collectModifiers(d.techs, d.buildings);
      return d.squads.map((sq) => {
        if (!sq.recruitId || !RECRUIT_BY_ID[sq.recruitId]) return null;
        const gear = Object.fromEntries(
          GEAR_SLOTS.map((slot) => [slot, d.collection.find((g) => g.uid === sq.gear[slot]) ?? null]),
        );
        return computeUnit({
          id: sq.id,
          name: sq.name,
          recruitId: sq.recruitId,
          gear,
          line: sq.line,
          column: sq.column,
        }, { modifiers: mods });
      });
    },

    notify(text, tone = 'info') {
      set((state) => ({
        data: { ...state.data, notices: [...state.data.notices.slice(-29), { id: ++noticeId, text, tone }] },
      }));
    },

    dismissNotice(id) {
      set((state) => ({ data: { ...state.data, notices: state.data.notices.filter((n) => n.id !== id) } }));
    },

    tickOnce() {
      mutate((d) => {
        const mods = collectModifiers(d.techs, d.buildings);
        const income = cityTick(d.buildings, mods).total;
        d.resources = addResources(d.resources, income);
        d.day += 1;
      });
    },

    build(id) {
      mutate((draft) => {
        const b = BUILDING_LOOKUP[id];
        if (!b) return;
        const level = draft.buildings[id] ?? 0;
        if (level >= b.maxLevel) return;
        if (b.unlockTech && !draft.techs.includes(b.unlockTech)) return;
        const cost = buildingCost(b, level + 1);
        if (!canAfford(draft.resources, cost)) return;
        draft.resources = addResources(draft.resources, cost, -1);
        draft.buildings[id] = level + 1;
        draft.notices = pushNotice(draft, `${b.icon} ${b.name} — уровень ${level + 1}`, 'success');
      });
    },

    research(id) {
      mutate((draft) => {
        const t = TECH_LOOKUP[id];
        if (!t || draft.techs.includes(id)) return;
        const missing = t.requires.filter((r) => !draft.techs.includes(r));
        if (missing.length) return;
        if (draft.resources.science < t.cost) return;
        draft.resources.science -= t.cost;
        draft.techs.push(id);
        draft.notices = pushNotice(draft, `${t.icon} Изучено: ${t.name}`, 'success');
        const dogmas = activeDogmas(draft.techs);
        if (dogmas.length > 0) {
          const last = dogmas[dogmas.length - 1]!;
          draft.notices = pushNotice(draft, `${last.icon} Догма активирована: ${last.name}`, 'success');
        }
      });
    },

    hire(squadId, recruitId) {
      mutate((draft) => {
        const r = RECRUIT_BY_ID[recruitId];
        if (!r || !PLAYER_RECRUIT_IDS.includes(recruitId as (typeof PLAYER_RECRUIT_IDS)[number])) return;
        const sq = draft.squads.find((s) => s.id === squadId);
        if (!sq || sq.recruitId === recruitId) return;
        if (!canAfford(draft.resources, r.cost)) return;
        draft.resources = addResources(draft.resources, r.cost, -1);
        sq.recruitId = recruitId;
        draft.notices = pushNotice(draft, `${r.icon} ${r.name} нанят в «${sq.name}»`, 'success');
      });
    },

    disband(squadId) {
      mutate((draft) => {
        const sq = draft.squads.find((s) => s.id === squadId);
        if (!sq) return;
        sq.recruitId = null;
      });
    },

    renameSquad(squadId, name) {
      mutate((draft) => {
        const sq = draft.squads.find((s) => s.id === squadId);
        if (sq && name.trim()) sq.name = name.trim().slice(0, 24);
      });
    },

    placeSquad(squadId, line, column) {
      mutate((draft) => {
        const sq = draft.squads.find((s) => s.id === squadId);
        if (!sq) return;
        sq.line = Math.max(0, Math.min(4, line));
        sq.column = Math.max(0, Math.min(9, column));
      });
    },

    equip(squadId, slot, itemUid) {
      mutate((draft) => {
        const target = draft.squads.find((s) => s.id === squadId);
        if (!target) return;
        if (itemUid === null) {
          target.gear[slot] = null;
          return;
        }
        const item = draft.collection.find((g) => g.uid === itemUid);
        if (!item) return;
        // Если предмет надет на другой отряд — меняемся местами.
        for (const other of draft.squads) {
          for (const s of GEAR_SLOTS) {
            if (other.gear[s] === itemUid && !(other.id === squadId && s === slot)) {
              other.gear[s] = target.gear[slot];
            }
          }
        }
        target.gear[slot] = itemUid;
      });
    },

    salvage(uid) {
      mutate((draft) => {
        const item = draft.collection.find((g) => g.uid === uid);
        if (!item) return;
        // Предметы, надетые на отряды, разбирать нельзя.
        if (draft.squads.some((s) => GEAR_SLOTS.some((slot) => s.gear[slot] === uid))) return;
        draft.collection = draft.collection.filter((g) => g.uid !== uid);
        draft.resources.ore += SALVAGE_ORE[item.rarity];
        draft.notices = pushNotice(draft, `Разобрано: +${SALVAGE_ORE[item.rarity]} руды`, 'info');
      });
      if (get().craftSelection.includes(uid)) {
        set((state) => ({ craftSelection: state.craftSelection.filter((u) => u !== uid) }));
      }
    },

    toggleCraftSelect(uid) {
      set((state) => {
        const has = state.craftSelection.includes(uid);
        const next = has ? state.craftSelection.filter((u) => u !== uid) : state.craftSelection.length < 3 ? [...state.craftSelection, uid] : state.craftSelection;
        return { craftSelection: next };
      });
    },

    craft() {
      const d = get().data;
      const craftSel = get().craftSelection;
      const inputs = d.collection.filter((g) => craftSel.includes(g.uid));
      const check = canCraft(inputs);
      if (!check.ok) {
        get().notify(check.reason ?? 'Слияние невозможно', 'warn');
        return;
      }
      const discount = craftDiscount(collectModifiers(d.techs, d.buildings));
      const cost = craftCost(inputs[0]!.rarity, discount);
      if (d.resources.ore < cost) {
        get().notify(`Не хватает руды: нужно ${cost}`, 'warn');
        return;
      }
      const rng = createRng(Math.floor(Math.random() * 2 ** 31));
      const result = craftGear(rng, inputs, d.cycle);
      const used = new Set(craftSel);
      mutate((draft) => {
        draft.resources.ore -= cost;
        draft.collection = draft.collection.filter((g) => !used.has(g.uid));
        draft.collection.push(result);
        draft.stats.crafted += 1;
        draft.stats.gearFound += 1;
        draft.notices = pushNotice(draft, `Слияние удалось: новый предмет ${result.rarity}`, 'success');
      });
      set({ craftSelection: [] });
    },

    enterNode(nodeId) {
      const d0 = get().data;
      const node = NODE_BY_ID[nodeId];
      if (!node) return;
      // Из текущего узла можно двигаться только в разрешённые следующие.
      // Повторный вход в ТЕКУЩИЙ боевой узел = повторная попытка (новый seed).
      const retryCurrent = nodeId === d0.campaign.currentNodeId;
      const allowed = d0.campaign.currentNodeId === null ? [] : NEXT_OF[d0.campaign.currentNodeId] ?? [];
      const movingFromStart = d0.campaign.currentNodeId === 'start' && ['b1a', 'b1b'].includes(nodeId);
      if (!retryCurrent && !movingFromStart && !allowed.includes(nodeId)) return;

      if (node.kind === 'battle' || node.kind === 'elite' || node.kind === 'boss') {
        const encounter = generateEncounter(d0.campaignSeed, d0.cycle, nodeId, d0.campaign.battleAttempts);
        set({ prep: { nodeId, kind: node.kind, encounter } });
        return;
      }
      mutate((draft) => {
        // Привал/сокровищница: без боя.
        const ticks = TICKS_FOR_NODE[node.kind];
        const mods = collectModifiers(draft.techs, draft.buildings);
        const income = cityTick(draft.buildings, mods).total;
        for (let i = 0; i < ticks; i++) draft.resources = addResources(draft.resources, income);
        draft.day += ticks;
        if (node.kind === 'treasure') {
          const bonus = lootRarityBonus(mods);
          const loot = treasureLoot(draft.campaignSeed, draft.cycle, nodeId, bonus);
          for (const item of loot) {
            draft.collection.push(item);
            draft.stats.gearFound += 1;
          }
          draft.notices = pushNotice(draft, `🎁 Найдено предметов: ${loot.length}`, 'success');
        }
        draft.notices = pushNotice(draft, `${NODE_KIND_META[node.kind].icon} ${node.title}: ${NODE_KIND_META[node.kind].hint}`, 'info');
        const prev = draft.campaign.currentNodeId;
        if (prev && prev !== nodeId && prev !== 'start' && !draft.campaign.completed.includes(prev)) {
          draft.campaign.completed.push(prev);
        }
        draft.campaign.currentNodeId = nodeId;
      });
    },

    fightSkirmish() {
      const d = get().data;
      const counter = d.campaign.skirmishCount + 1;
      const encounter = generateSkirmish(d.campaignSeed, d.cycle, 3, counter);
      set({ prep: { nodeId: `skirmish_${counter}`, kind: 'skirmish', encounter, skirmishCounter: counter } });
    },

    confirmPrep() {
      const st = get();
      const prep = st.prep;
      if (!prep) return;
      const d = st.data;
      const { units } = playerUnitsOf(d);
      if (units.length === 0) {
        st.notify('Сначала собери хотя бы один отряд!', 'warn');
        set({ prep: null });
        return;
      }
      const enemyUnits = prep.encounter.enemies.map((sq: SquadSetup) => computeUnit(sq));
      const seed = combineSeed(d.campaignSeed, d.cycle, prep.nodeId, d.campaign.battleAttempts);
      const sim = new BattleSim(units, enemyUnits, { seed });
      mutate((draft) => {
        if (prep.skirmishCounter !== undefined) {
          draft.campaign.skirmishCount = prep.skirmishCounter;
        } else {
          // Движение по карте фиксируется при входе в бой.
          const prev = draft.campaign.currentNodeId;
          if (prev && prev !== prep.nodeId && prev !== 'start' && !draft.campaign.completed.includes(prev)) {
            draft.campaign.completed.push(prev);
          }
          draft.campaign.currentNodeId = prep.nodeId;
        }
        draft.campaign.battleAttempts += 1;
        draft.stats.battles += 1;
      });
      set({ prep: null, session: { sim, nodeId: prep.nodeId, kind: prep.kind, encounter: prep.encounter }, simVersion: 0 });
    },

    cancelPrep() {
      set({ prep: null });
    },

    stepSim() {
      const session = get().session;
      if (!session || session.sim.finished) return;
      session.sim.step();
      set({ simVersion: get().simVersion + 1 });
    },

    useMomentum(tactic) {
      const session = get().session;
      if (!session) return;
      session.sim.useMomentum(tactic);
      set({ simVersion: get().simVersion + 1 });
    },

    skipMomentum() {
      const session = get().session;
      if (!session) return;
      session.sim.skipMomentum();
      set({ simVersion: get().simVersion + 1 });
    },

    finishBattle() {
      const session = get().session;
      if (!session || !session.sim.finished) return;
      if (get().data.battle) return; // результат уже зафиксирован
      const result = session.sim.result();
      set((state) => {
        const draft = structuredClone(state.data);
        const kind = session.kind;
        draft.stats.longestBattle = Math.max(draft.stats.longestBattle, result.rounds);

        const rng = createRng(combineSeed(result.seed, 'loot'));
        const mods = collectModifiers(draft.techs, draft.buildings);
        let loot: GearInstance[] = [];
        let income: Resources | null = null;

        if (result.winner === 'player') {
          draft.stats.wins += 1;
          const count = LOOT_COUNT[kind] + lootCountBonus(mods);
          loot = rollLoot(rng, { source: kind, cycle: draft.cycle, count, rarityBonus: lootRarityBonus(mods) });
          const ticks = TICKS_FOR_NODE[kind];
          const tick = cityTick(draft.buildings, mods).total;
          income = { ...ZERO_RESOURCES };
          for (let i = 0; i < ticks; i++) {
            draft.resources = addResources(draft.resources, tick);
            draft.day += 1;
            income = addResources(income, tick);
          }
          for (const item of loot) {
            draft.collection.push(item);
            draft.stats.gearFound += 1;
          }
          if (kind === 'boss') {
            draft.stats.bossKills += 1;
            draft.stats.cyclesCompleted += 1;
          }
        } else if (result.winner === 'enemy') {
          draft.stats.losses += 1;
        } else {
          draft.stats.draws += 1;
        }

        draft.battle = { encounter: session.encounter, result, nodeId: session.nodeId, kind, loot, income };
        return { data: draft };
      });
    },

    clearSession() {
      set({ session: null, simVersion: 0 });
    },

    restart() {
      // Полный перезапуск цикла 1 с новым seed.
      const seed = Math.floor(Math.random() * 2 ** 31);
      set({ data: freshData(seed), craftSelection: [] });
      get().notify('Новая игра. Удачи, командир!', 'info');
    },

    hardReset() {
      clearSavedGame();
      set({ data: freshData(), craftSelection: [] });
    },
  };

  // ---- вспомогательные функции замыкания ----
  function pushNotice(d: GameData, text: string, tone: Notice['tone']): Notice[] {
    return [...d.notices.slice(-29), { id: ++noticeId, text, tone }];
  }
});

// Автосохранение при любом изменении данных игры.
useGameStore.subscribe((state) => {
  saveGame(state.data);
});

// ---------------------------------------------------------------------------
// Бой: генерация, симуляция, разбор результатов.
// ---------------------------------------------------------------------------

function playerUnitsOf(d: GameData): { units: ReturnType<typeof computeUnit>[]; squadIds: string[] } {
  const mods = collectModifiers(d.techs, d.buildings);
  const units: ReturnType<typeof computeUnit>[] = [];
  const squadIds: string[] = [];
  for (const sq of d.squads) {
    if (!sq.recruitId || !RECRUIT_BY_ID[sq.recruitId]) continue;
    const gear = Object.fromEntries(GEAR_SLOTS.map((slot) => [slot, d.collection.find((g) => g.uid === sq.gear[slot]) ?? null]));
    units.push(
      computeUnit({ id: sq.id, name: sq.name, recruitId: sq.recruitId, gear, line: sq.line, column: sq.column }, { modifiers: mods }),
    );
    squadIds.push(sq.id);
  }
  return { units, squadIds };
}

/**
 * Завершение боя: применяется ПОСЛЕ того, как игрок посмотрел результат.
 * Победа в боссовом узле открывает новый цикл.
 */
export function applyBattleOutcome(): void {
  const store = useGameStore;
  const d = store.getState().data;
  const b = d.battle;
  if (!b) return;
  store.setState((state) => {
    const draft = structuredClone(state.data);
    if (b.result.winner === 'player' && b.kind !== 'skirmish') {
      if (!draft.campaign.completed.includes(b.nodeId)) draft.campaign.completed.push(b.nodeId);
      if (b.kind === 'boss' && isCycleComplete(draft.campaign.completed)) {
        draft.cycle += 1;
        draft.campaign.currentNodeId = 'start';
        draft.campaign.completed = [];
        draft.campaign.skirmishCount = 0;
        draft.notices = [
          ...draft.notices.slice(-29),
          { id: ++noticeId, text: `👑 Цикл ${draft.cycle - 1} завершён! Начинается Цикл ${draft.cycle}: враги стали сильнее, добыча — богаче.`, tone: 'success' },
        ];
      }
    }
    draft.battle = null;
    return { data: draft };
  });
}
