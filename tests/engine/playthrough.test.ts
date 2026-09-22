import { beforeEach, describe, expect, it } from 'vitest';
import { applyBattleOutcome, useGameStore } from '@/store/useGameStore';
import { CAMPAIGN_NODE_BY_ID } from '@/data/campaign';
import { cityTick } from '@/engine/economy/cityTick';

/**
 * Интеграционный тест: полная петля «найм → кампания → босс → цикл+1».
 * Использует реальный стор (localStorage в node-окружении отключается try/catch).
 */

const PATH = ['b1a', 'r2', 't3', 'r4', 'e5', 'r6', 'boss'];

function freshGame(seed = 424242): void {
  useGameStore.getState().hardReset();
  useGameStore.setState((s) => ({ data: { ...s.data, campaignSeed: seed } }));
}

beforeEach(() => {
  freshGame();
});

describe('интеграция: петля игры', () => {
  it('найм и стартовое снаряжение работают', () => {
    const s = useGameStore.getState();
    s.hire('sq1', 'militia');
    const d = useGameStore.getState().data;
    expect(d.squads[0]!.recruitId).toBe('militia');
    expect(d.resources.food).toBe(60 - 20);
    const computed = useGameStore.getState().computedSquads();
    expect(computed[0]).not.toBeNull();
    expect(computed[0]!.stats.atk).toBeGreaterThan(18); // база 18 + меч 4
  });

  it('найм без денег невозможен', () => {
    const s = useGameStore.getState();
    useGameStore.setState((st) => ({ data: { ...st.data, resources: { ...st.data.resources, food: 0 } } }));
    s.hire('sq1', 'militia');
    expect(useGameStore.getState().data.squads[0]!.recruitId).toBeNull();
  });

  it('полное прохождение цикла 1 с ретраями (армия середины игры)', () => {
    const s = useGameStore.getState();
    // Сетап, адекватный моменту перед боссом: техы + рыцарь и два лучника с экипировкой.
    useGameStore.setState((st) => ({
      data: {
        ...st.data,
        resources: { food: 400, ore: 200, science: 400, gold: 400 },
        techs: ['archery', 'bronze_working', 'iron_working', 'medicine'],
        collection: [
          ...st.data.collection,
          { uid: 'k_w', defId: 'spiked_mace', rarity: 'rare' as const, quality: 1, affixes: [], cycle: 1 },
          { uid: 'k_a', defId: 'plate_cuirass', rarity: 'rare' as const, quality: 1, affixes: [], cycle: 1 },
          { uid: 'a1_w', defId: 'composite_bow', rarity: 'uncommon' as const, quality: 1, affixes: [], cycle: 1 },
          { uid: 'a2_w', defId: 'composite_bow', rarity: 'uncommon' as const, quality: 1, affixes: [], cycle: 1 },
        ],
      },
    }));
    const st0 = useGameStore.getState();
    st0.hire('sq1', 'knight');
    st0.hire('sq2', 'archer');
    st0.hire('sq3', 'archer');
    st0.equip('sq1', 'weapon', 'k_w');
    st0.equip('sq1', 'armor', 'k_a');
    st0.equip('sq2', 'weapon', 'a1_w');
    st0.equip('sq3', 'weapon', 'a2_w');

    let guard = 0;
    const totalAttempts: number[] = [];
    for (const nodeId of PATH) {
      const node = CAMPAIGN_NODE_BY_ID[nodeId]!;
      let attempts = 0;
      // Для боёв: заходим, смотрим исход, при поражении повторяем (новый seed).
      while (attempts < 8) {
        attempts++;
        guard++;
        expect(guard).toBeLessThan(60);
        useGameStore.getState().enterNode(nodeId);
        const battle = useGameStore.getState().data.battle;
        if (!battle) break; // не боевой узел (привал/сокровище)
        const won = battle.result.winner === 'player';
        applyBattleOutcome();
        if (won) break;
      }
      totalAttempts.push(attempts);
      expect(attempts).toBeLessThan(8);
      const d = useGameStore.getState().data;
      if (nodeId !== 'boss') {
        expect(d.campaign.currentNodeId).toBe(nodeId);
        if (node.kind !== 'rest' && node.kind !== 'treasure') {
          expect(d.campaign.completed).toContain(nodeId);
        }
      } else {
        // Победа над боссом уже открыла новый цикл.
        expect(d.cycle).toBe(2);
        expect(d.campaign.currentNodeId).toBe('start');
        expect(d.campaign.completed).toEqual([]);
        expect(d.stats.cyclesCompleted).toBe(1);
        expect(d.stats.bossKills).toBe(1);
      }
    }
    const d = useGameStore.getState().data;
    // Боёв на пути ровно 3: b1a, e5, boss (остальные узлы — привал/сокровищница).
    expect(d.stats.wins).toBe(3);
    expect(d.stats.losses).toBeLessThanOrEqual(7);
    // Лут: старт 3 + бой 1 + сокровище 2 + элита 2 + босс 3 = минимум 11.
    expect(d.collection.length).toBeGreaterThanOrEqual(10);
    void totalAttempts;
  });

  it('стычка доступна и даёт лут при победе', () => {
    const s = useGameStore.getState();
    s.hire('sq1', 'militia');
    s.hire('sq2', 'militia');
    s.hire('sq3', 'militia');
    const before = useGameStore.getState().data.collection.length;
    let tries = 0;
    while (tries < 10) {
      tries++;
      useGameStore.getState().fightSkirmish();
      const b = useGameStore.getState().data.battle!;
      const won = b.result.winner === 'player';
      applyBattleOutcome();
      if (won) break;
    }
    const d = useGameStore.getState().data;
    expect(d.stats.wins).toBeGreaterThanOrEqual(1);
    expect(d.collection.length).toBeGreaterThan(before);
    expect(d.battle).toBeNull();
  });

  it('мастерская: слияние трёх общих в одну необычную', () => {
    const s = useGameStore.getState();
    s.hire('sq1', 'militia');
    const d0 = useGameStore.getState().data;
    // Снимаем стартовые предметы с отряда, чтобы их можно было слить, и добавляем два ещё.
    s.equip('sq1', 'weapon', null);
    s.equip('sq1', 'armor', null);
    s.equip('sq1', 'core', null);
    useGameStore.setState((st) => ({
      data: {
        ...st.data,
        resources: { ...st.data.resources, ore: 100 },
        collection: [
          ...st.data.collection,
          { uid: 't1', defId: 'rabbit_foot', rarity: 'common' as const, quality: 1, affixes: [], cycle: 1 },
          { uid: 't2', defId: 'lead_weight', rarity: 'common' as const, quality: 1, affixes: [], cycle: 1 },
        ],
      },
    }));
    const st = useGameStore.getState();
    st.toggleCraftSelect('start_weapon');
    st.toggleCraftSelect('start_armor');
    st.toggleCraftSelect('start_core');
    const oreBefore = useGameStore.getState().data.resources.ore;
    st.craft();
    const d = useGameStore.getState().data;
    expect(d.stats.crafted).toBe(1);
    expect(d.resources.ore).toBe(oreBefore - 15); // common → 15 руды
    const crafted = d.collection.find((g) => !['start_weapon', 'start_armor', 'start_core', 't1', 't2'].includes(g.uid));
    expect(crafted).toBeDefined();
    expect(crafted!.rarity).toBe('uncommon');
    expect(useGameStore.getState().craftSelection.length).toBe(0);
    void d0;
  });

  it('экономика города: постройка списывает ресурсы и даёт доход', () => {
    const s = useGameStore.getState();
    useGameStore.setState((st) => ({ data: { ...st.data, resources: { ...st.data.resources, gold: 500 }, techs: ['mining'] } }));
    const goldBefore = useGameStore.getState().data.resources.gold;
    s.build('farm');
    s.build('farm');
    const d1 = useGameStore.getState().data;
    expect(d1.buildings.farm).toBe(2);
    // farm: 20, затем 32 → 52 золота
    expect(goldBefore - d1.resources.gold).toBe(52);
    const mods = useGameStore.getState().modifiers();
    useGameStore.setState((st) => ({ data: { ...st.data, techs: [...st.data.techs] } }));
    void mods;
    const b1 = useGameStore.getState();
    const total1 = cityTickTotal();
    b1.build('farm');
    const total2 = cityTickTotal();
    expect(total2).toBeGreaterThan(total1);
  });

  it('перезапуск сбрасывает состояние', () => {
    const s = useGameStore.getState();
    s.hire('sq1', 'militia');
    s.restart();
    const d = useGameStore.getState().data;
    expect(d.squads[0]!.recruitId).toBeNull();
    expect(d.day).toBe(0);
    expect(d.cycle).toBe(1);
  });
});

function cityTickTotal(): number {
  const d = useGameStore.getState().data;
  const mods = useGameStore.getState().modifiers();
  return cityTick(d.buildings, mods).total.food;
}
