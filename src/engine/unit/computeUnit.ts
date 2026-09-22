import { GEAR_BY_ID } from '@/data/gear';
import { RECRUIT_BY_ID } from '@/data/recruits';
import { SET_BY_ID } from '@/data/sets';
import {
  GEAR_SLOTS,
  RARITIES,
  STAT_KEYS,
  type Ability,
  type ComputedUnit,
  type Element,
  type GearInstance,
  type Modifier,
  type PartialStats,
  type Rarity,
  type SquadSetup,
  type StatKey,
  type Stats,
  type TargetingRule,
  type UnitTag,
} from './unit.types';

/** Итоговые статы конкретного экземпляра предмета (база × качество + аффиксы). */
export function gearInstanceStats(inst: GearInstance): PartialStats {
  const def = GEAR_BY_ID[inst.defId];
  if (!def) return {};
  const out: PartialStats = {};
  for (const [k, v] of Object.entries(def.stats) as [StatKey, number][]) {
    // Дальность и мораль не масштабируем качеством — это "дискретные" статы.
    const scaled = k === 'range' ? v : v * inst.quality;
    out[k] = (out[k] ?? 0) + (k === 'range' ? scaled : Math.round(scaled * 10) / 10);
  }
  for (const a of inst.affixes) {
    out[a.stat] = (out[a.stat] ?? 0) + a.value;
  }
  return out;
}

/** Сливает список способностей: одинаковые ключи объединяются (складываются/берётся максимум). */
export function mergeAbilities(list: Ability[]): Ability[] {
  const map = new Map<string, Ability>();
  for (const ab of list) {
    const mapKey = ab.key === 'targetPref' ? `${ab.key}:${ab.tag}` : ab.key;
    const prev = map.get(mapKey);
    if (!prev) {
      map.set(mapKey, { ...ab });
      continue;
    }
    switch (ab.key) {
      case 'poisonOnHit':
        map.set(mapKey, { key: 'poisonOnHit', stacks: (prev as typeof ab).stacks + ab.stacks });
        break;
      case 'cleave':
        map.set(mapKey, { key: 'cleave', pct: Math.max((prev as typeof ab).pct, ab.pct) });
        break;
      case 'doubleStrike':
        map.set(mapKey, { key: 'doubleStrike', chance: Math.min(90, (prev as typeof ab).chance + ab.chance) });
        break;
      case 'retaliate':
        map.set(mapKey, { key: 'retaliate', pct: Math.max((prev as typeof ab).pct, ab.pct) });
        break;
      case 'regen':
        map.set(mapKey, { key: 'regen', hp: (prev as typeof ab).hp + ab.hp });
        break;
      case 'execute': {
        const p = prev as typeof ab;
        map.set(mapKey, { key: 'execute', threshold: Math.max(p.threshold, ab.threshold), bonus: p.bonus + ab.bonus });
        break;
      }
      case 'rally':
        map.set(mapKey, { key: 'rally', morale: (prev as typeof ab).morale + ab.morale });
        break;
      case 'shield':
        map.set(mapKey, { key: 'shield', amount: (prev as typeof ab).amount + ab.amount });
        break;
      case 'firstStrike':
      case 'targetPref':
        break; // дубликаты бессмысленны
    }
  }
  return [...map.values()];
}

export interface ComputeContext {
  /** Глобальные модификаторы: догмы, техи, здания. */
  modifiers?: Modifier[];
}

const rarityRank = (r: Rarity): number => RARITIES.indexOf(r);

/**
 * Сборка боевого юнита из отряда: база рекрута × скейлинг + шестерёнки + сет-бонусы + глобальные модификаторы.
 * Чистая функция: одинаковый вход → одинаковый выход.
 */
export function computeUnit(setup: SquadSetup, ctx: ComputeContext = {}): ComputedUnit {
  const recruit = RECRUIT_BY_ID[setup.recruitId];
  if (!recruit) throw new Error(`Неизвестный рекрут: ${setup.recruitId}`);

  const scale = setup.statScale ?? 1;
  const flat: Stats = { ...recruit.base };
  // Масштабируем только "боевые" статы, проценты и дальность не трогаем.
  for (const k of ['hp', 'atk', 'def'] as const) flat[k] = Math.round(flat[k] * scale);

  const pct: PartialStats = {};
  const abilities: Ability[] = [...(recruit.abilities ?? [])];
  const tags = new Set<UnitTag>([...recruit.tags, ...(setup.extraTags ?? [])]);
  let targeting: TargetingRule = recruit.targeting;
  let element: Element = recruit.element ?? 'physical';
  let bestRarity: Rarity = 'common';
  const setCounts: Record<string, number> = {};

  // --- шестерёнки ---
  for (const slot of GEAR_SLOTS) {
    const inst = setup.gear[slot];
    if (!inst) continue;
    const def = GEAR_BY_ID[inst.defId];
    if (!def) continue;
    const s = gearInstanceStats(inst);
    for (const [k, v] of Object.entries(s) as [StatKey, number][]) flat[k] += v;
    if (def.abilities) abilities.push(...def.abilities);
    if (def.tags) def.tags.forEach((t) => tags.add(t));
    if (def.targeting) targeting = def.targeting;
    if (def.element && slot === 'weapon') element = def.element;
    if (rarityRank(inst.rarity) > rarityRank(bestRarity)) bestRarity = inst.rarity;
    if (def.setId) setCounts[def.setId] = (setCounts[def.setId] ?? 0) + 1;
  }

  // --- сет-бонусы ---
  for (const [setId, count] of Object.entries(setCounts)) {
    const set = SET_BY_ID[setId];
    if (!set) continue;
    for (const bonus of set.bonuses) {
      if (count < bonus.pieces) continue;
      if (bonus.stats) for (const [k, v] of Object.entries(bonus.stats) as [StatKey, number][]) flat[k] += v;
      if (bonus.pctStats) for (const [k, v] of Object.entries(bonus.pctStats) as [StatKey, number][]) pct[k] = (pct[k] ?? 0) + v;
      if (bonus.abilities) abilities.push(...bonus.abilities);
    }
    // Полный сет со стихией красит урон юнита, если оружие стихии не задало.
    if (set.element && count >= 3 && element === 'physical') element = set.element;
  }

  // --- глобальные модификаторы ---
  for (const m of ctx.modifiers ?? []) {
    if (m.kind === 'stat') {
      if (m.flat) flat[m.stat] += m.flat;
      if (m.pct) pct[m.stat] = (pct[m.stat] ?? 0) + m.pct;
    } else if (m.kind === 'ability') {
      abilities.push(m.ability);
    }
  }

  const stats = { ...flat };
  for (const k of STAT_KEYS) {
    const p = pct[k] ?? 0;
    stats[k] = Math.round(flat[k] * (1 + p / 100));
  }
  // Ограничения здравого смысла.
  stats.hp = Math.max(1, stats.hp);
  stats.atk = Math.max(1, stats.atk);
  stats.def = Math.max(0, stats.def);
  stats.spd = Math.max(1, stats.spd);
  stats.range = Math.max(1, Math.min(5, stats.range));
  stats.acc = Math.max(0, stats.acc);
  stats.eva = Math.max(0, Math.min(75, stats.eva));
  stats.crit = Math.max(0, Math.min(100, stats.crit));
  stats.critDmg = Math.max(100, stats.critDmg);
  stats.morale = Math.max(0, Math.min(150, stats.morale));
  stats.lifesteal = Math.max(0, stats.lifesteal);
  stats.armorPen = Math.max(0, Math.min(100, stats.armorPen));

  const mergedAbilities = mergeAbilities(abilities);
  // Приоритет цели по тегу из способности имеет силу, если правило юнита не переопределено легендаркой.
  return {
    id: setup.id,
    name: setup.name,
    icon: recruit.icon,
    recruitId: recruit.id,
    stats,
    tags: [...tags],
    abilities: mergedAbilities,
    targeting,
    element,
    line: Math.max(0, Math.min(4, setup.line)),
    column: Math.max(0, Math.min(9, setup.column)),
    rarity: bestRarity,
    setCounts,
  };
}

/** Человекочитаемое описание способности — основа авто-текста на карточке. */
export function describeAbility(ab: Ability): string {
  switch (ab.key) {
    case 'firstStrike':
      return 'Внезапная атака: наносит удар до начала боя.';
    case 'poisonOnHit':
      return `Яд: попадания накладывают ${ab.stacks} заряд(а) яда.`;
    case 'cleave':
      return `Рассечение: вторая цель в линии получает ${ab.pct}% урона.`;
    case 'doubleStrike':
      return `Двойной удар: ${ab.chance}% шанс атаковать повторно.`;
    case 'retaliate':
      return `Контратака: отвечает на ближний удар ${ab.pct}% урона.`;
    case 'regen':
      return `Регенерация: +${ab.hp} HP в начале каждого раунда.`;
    case 'execute':
      return `Казнь: +${ab.bonus}% урона по целям ниже ${ab.threshold}% HP.`;
    case 'rally':
      return `Воодушевление: убийство даёт союзникам +${ab.morale} морали.`;
    case 'shield':
      return `Щит: поглощает первые ${ab.amount} урона.`;
    case 'targetPref':
      return `Охотник: предпочитает цели с меткой «${ab.tag}».`;
  }
}

/** Краткая метка правила выбора цели. */
export const TARGETING_LABEL: Record<TargetingRule, string> = {
  nearest: 'бьёт ближайшего',
  weakest: 'добивает раненых',
  strongest: 'ищет сильнейшего',
  ranged: 'охотится на стрелков',
  random: 'бьёт наугад',
};
