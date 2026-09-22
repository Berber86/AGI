import { CAMPAIGN_MAP, CAMPAIGN_NODE_BY_ID, MAX_LAYER, type CampaignNodeDef, type NodeKind } from '@/data/campaign';
import { RECRUIT_BY_ID } from '@/data/recruits';
import { generateGear, rollRarity } from '@/engine/loot/gearGenerator';
import { GEAR_SLOTS, type GearInstance, type GearSlot, type Rarity, type SquadSetup } from '@/engine/unit/unit.types';
import { combineSeed, createRng, type Rng } from '@/utils/rng';

/** Количество шестерёнок за узел. */
export const LOOT_COUNT: Record<NodeKind | 'skirmish', number> = { skirmish: 1, battle: 1, elite: 2, treasure: 2, rest: 0, boss: 3 };

/** Сколько ходов экономики даёт узел. */
export const TICKS_FOR_NODE: Record<NodeKind | 'skirmish', number> = { skirmish: 1, battle: 1, elite: 1, treasure: 1, rest: 2, boss: 1 };

/** Множитель статов врагов: цикл и глубина карты. */
export function enemyStatScale(cycle: number, layer: number): number {
  return Math.round((1 + 0.28 * (cycle - 1) + 0.05 * layer) * 100) / 100;
}

interface EncounterTemplate {
  units: { recruitId: string; line: number }[];
  /** Редкость экипировки врагов: нижняя и верхняя граница. */
  gear: { min: Rarity; max: Rarity; slots: number };
  boss?: boolean;
}

const BATTLE_TEMPLATES: EncounterTemplate[] = [
  { units: [{ recruitId: 'militia', line: 0 }, { recruitId: 'bandit_archer', line: 1 }], gear: { min: 'common', max: 'uncommon', slots: 1 } },
  { units: [{ recruitId: 'wolf', line: 0 }, { recruitId: 'wolf', line: 0 }, { recruitId: 'wolf', line: 1 }], gear: { min: 'common', max: 'common', slots: 1 } },
  { units: [{ recruitId: 'skeleton', line: 0 }, { recruitId: 'skeleton', line: 0 }], gear: { min: 'common', max: 'uncommon', slots: 2 } },
  { units: [{ recruitId: 'militia', line: 0 }, { recruitId: 'militia', line: 0 }, { recruitId: 'bandit_archer', line: 2 }], gear: { min: 'common', max: 'uncommon', slots: 1 } },
  { units: [{ recruitId: 'rogue', line: 0 }, { recruitId: 'bandit_archer', line: 1 }], gear: { min: 'common', max: 'uncommon', slots: 2 } },
];

const ELITE_TEMPLATES: EncounterTemplate[] = [
  { units: [{ recruitId: 'knight', line: 0 }, { recruitId: 'archer', line: 1 }, { recruitId: 'archer', line: 1 }], gear: { min: 'common', max: 'rare', slots: 2 } },
  { units: [{ recruitId: 'wolf', line: 0 }, { recruitId: 'wolf', line: 0 }, { recruitId: 'lancer', line: 1 }], gear: { min: 'common', max: 'rare', slots: 2 } },
  { units: [{ recruitId: 'skeleton', line: 0 }, { recruitId: 'skeleton', line: 0 }, { recruitId: 'mage', line: 2 }], gear: { min: 'common', max: 'rare', slots: 2 } },
];

const BOSS_TEMPLATES: EncounterTemplate[] = [
  { units: [{ recruitId: 'skeleton', line: 0 }, { recruitId: 'skeleton', line: 0 }, { recruitId: 'lich', line: 1 }], gear: { min: 'uncommon', max: 'rare', slots: 2 }, boss: true },
  { units: [{ recruitId: 'ogre', line: 0 }, { recruitId: 'wolf', line: 0 }, { recruitId: 'bandit_archer', line: 1 }], gear: { min: 'uncommon', max: 'rare', slots: 2 }, boss: true },
];

const RARITY_ORDER: Rarity[] = ['common', 'uncommon', 'rare', 'epic', 'legendary'];

function rollEnemyGear(rng: Rng, tpl: EncounterTemplate, cycle: number): Partial<Record<GearSlot, GearInstance>> {
  const out: Partial<Record<GearSlot, GearInstance>> = {};
  const slots = rng.shuffle(GEAR_SLOTS).slice(0, tpl.gear.slots);
  const lo = RARITY_ORDER.indexOf(tpl.gear.min);
  const hi = RARITY_ORDER.indexOf(tpl.gear.max);
  for (const slot of slots) {
    const rarity = RARITY_ORDER[rng.int(lo, hi)]!;
    out[slot] = generateGear(rng, { rarity, cycle, slot, bare: true });
  }
  return out;
}

export interface Encounter {
  nodeId: string;
  kind: NodeKind | 'skirmish';
  enemies: SquadSetup[];
  statScale: number;
}

/**
 * Детерминированно генерирует отряд врагов для узла.
 * `attempt` (номер попытки) меняет шаблон и экипировку — ретраи не идентичны.
 */
export function generateEncounter(campaignSeed: number, cycle: number, nodeId: string, attempt = 0): Encounter {
  const node = CAMPAIGN_NODE_BY_ID[nodeId];
  if (!node) throw new Error(`Неизвестный узел: ${nodeId}`);
  return buildEncounter(createRng(combineSeed(campaignSeed, cycle, nodeId, attempt)), node.kind, node.layer, cycle, nodeId);
}

/** Стычка (патруль): случайный бой уровня текущего слоя, доступный всегда — для фарма. */
export function generateSkirmish(campaignSeed: number, cycle: number, layer: number, counter: number): Encounter {
  return buildEncounter(createRng(combineSeed(campaignSeed, cycle, 'skirmish', counter)), 'battle', Math.max(1, layer), cycle, `skirmish_${counter}`, 'skirmish');
}

function buildEncounter(rng: Rng, kind: NodeKind, layer: number, cycle: number, nodeId: string, overrideKind?: 'skirmish'): Encounter {
  const templates = kind === 'boss' ? BOSS_TEMPLATES : kind === 'elite' ? ELITE_TEMPLATES : BATTLE_TEMPLATES;
  const tpl = rng.pick(templates);
  const statScale = enemyStatScale(cycle, layer);
  const enemies: SquadSetup[] = tpl.units.map((u, i) => {
    const recruit = RECRUIT_BY_ID[u.recruitId]!;
    const isBoss = recruit.tags.includes('boss');
    return {
      id: `e${i}_${u.recruitId}`,
      name: isBoss ? `${recruit.name} (босс)` : recruit.name,
      recruitId: u.recruitId,
      gear: rollEnemyGear(rng, tpl, cycle),
      line: u.line,
      column: 2 + i * 2,
      statScale, // босс получает только слой карты: его сила — в шаблоне и свите
    };
  });
  return { nodeId, kind: overrideKind ?? kind, enemies, statScale };
}

/** Добыча за узел сокровищ — без боя. */
export function treasureLoot(campaignSeed: number, cycle: number, nodeId: string, rarityBonus: number): GearInstance[] {
  const rng = createRng(combineSeed(campaignSeed, cycle, nodeId, 'treasure'));
  const out: GearInstance[] = [];
  for (let i = 0; i < LOOT_COUNT.treasure; i++) {
    const rarity = rollRarity(rng, { source: 'treasure', cycle, rarityBonus });
    out.push(generateGear(rng, { rarity, cycle }));
  }
  return out;
}

/** Узлы, в которые можно пойти из текущего положения. */
export function availableNodes(currentNodeId: string | null, completed: readonly string[]): CampaignNodeDef[] {
  if (currentNodeId === null) return CAMPAIGN_MAP.filter((n) => n.layer === 0);
  const cur = CAMPAIGN_NODE_BY_ID[currentNodeId];
  if (!cur) return [];
  return cur.next.map((id) => CAMPAIGN_NODE_BY_ID[id]!).filter((n) => n && !completed.includes(n.id));
}

export function isCycleComplete(completed: readonly string[]): boolean {
  return CAMPAIGN_MAP.filter((n) => n.kind === 'boss').every((n) => completed.includes(n.id));
}

export function layerOf(nodeId: string | null): number {
  return nodeId ? (CAMPAIGN_NODE_BY_ID[nodeId]?.layer ?? 0) : 0;
}

export { MAX_LAYER };
