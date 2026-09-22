import { describe, expect, it } from 'vitest';
import { buildingCost, canAfford, cityTick, addResources, ZERO_RESOURCES } from '@/engine/economy/cityTick';
import { canResearch, collectModifiers, countIcons, craftDiscount, isDogmaActive, lootCountBonus, lootRarityBonus } from '@/engine/economy/techTree';
import { canCraft, craftCost, craftGear, effectiveRarityWeights, generateGear, rollRarity, weightedPick, SALVAGE_ORE } from '@/engine/loot/gearGenerator';
import { computeUnit, gearInstanceStats } from '@/engine/unit/computeUnit';
import { DOGMAS, TECH_BY_ID } from '@/data/techs';
import { BUILDING_BY_ID } from '@/data/buildings';
import { GEAR_BY_ID } from '@/data/gear';
import { createRng } from '@/utils/rng';
import type { GearInstance } from '@/engine/unit/unit.types';

describe('город: производство', () => {
  it('пустой город даёт только базовый доход', () => {
    const t = cityTick({}, []);
    expect(t.total.food).toBe(t.base.food);
    expect(t.total.gold).toBe(t.base.gold);
  });

  it('фермы увеличивают еду линейно по уровням', () => {
    const one = cityTick({ farm: 1 }, []);
    const three = cityTick({ farm: 3 }, []);
    expect(three.total.food - three.base.food).toBe((one.total.food - one.base.food) * 3);
  });

  it('процентные модификаторы усиливают итог', () => {
    const without = cityTick({}, []);
    const withAgri = cityTick({}, [{ kind: 'production', resource: 'food', pct: 50 }]);
    expect(withAgri.total.food).toBe(Math.round(without.total.food * 1.5));
  });

  it('addResources не уходит в минус', () => {
    const r = addResources({ food: 5, ore: 0, science: 0, gold: 0 }, { food: -100 }, 1);
    expect(r.food).toBe(0);
  });

  it('canAfford проверяет все ресурсы', () => {
    expect(canAfford({ food: 30, ore: 10, science: 0, gold: 20 }, { food: 20, gold: 20 })).toBe(true);
    expect(canAfford({ food: 10, ore: 0, science: 0, gold: 0 }, { food: 20 })).toBe(false);
  });

  it('стоимость здания растёт по геометрии', () => {
    const farm = BUILDING_BY_ID.farm!;
    const l1 = buildingCost(farm, 1);
    const l2 = buildingCost(farm, 2);
    expect(l2.gold!).toBeCloseTo((l1.gold ?? 0) * farm.costGrowth, 0);
  });
});

describe('технологии и догмы', () => {
  it('иконки считаются по изученным техам', () => {
    const icons = countIcons(['mining', 'bronze_working']);
    expect(icons.mining).toBe(1);
    expect(icons.war).toBe(1);
    expect(icons.craft).toBe(1);
  });

  it('догма активируется от нужного числа иконок', () => {
    const warrior = DOGMAS.find((d) => d.id === 'warrior_code')!;
    expect(isDogmaActive(warrior, { ...countIcons([]), war: 2 })).toBe(false);
    expect(isDogmaActive(warrior, { ...countIcons([]), war: 3 })).toBe(true);
  });

  it('комбинированная догма требует оба типа иконок', () => {
    const armourers = DOGMAS.find((d) => d.id === 'armourers')!;
    expect(isDogmaActive(armourers, { ...countIcons([]), craft: 2, war: 1 })).toBe(false);
    expect(isDogmaActive(armourers, { ...countIcons([]), craft: 2, war: 2 })).toBe(true);
  });

  it('canResearch: требования и наука', () => {
    const iron = TECH_BY_ID.iron_working!;
    expect(canResearch(iron, [], 500).ok).toBe(false);
    expect(canResearch(iron, ['bronze_working'], 10).ok).toBe(false);
    expect(canResearch(iron, ['bronze_working'], 500).ok).toBe(true);
  });

  it('collectModifiers собирает техи + догмы + здания', () => {
    const mods = collectModifiers(['agriculture'], { shrine: 2 });
    // agriculture: production pct; shrine: morale flat ×2
    expect(mods.some((m) => m.kind === 'production')).toBe(true);
    expect(mods.filter((m) => m.kind === 'stat' && m.stat === 'morale').length).toBe(2);
  });

  it('глобальные модификаторы попадают в статы юнита', () => {
    const u = computeUnit(
      { id: 'u', name: 'Тест', recruitId: 'militia', gear: {}, line: 0, column: 0 },
      { modifiers: [{ kind: 'stat', stat: 'atk', flat: 5 }, { kind: 'stat', stat: 'hp', pct: 10 }] },
    );
    expect(u.stats.atk).toBe(18 + 5);
    expect(u.stats.hp).toBe(Math.round(110 * 1.1));
  });
});

describe('добыча: детерминизм и веса', () => {
  it('weightedPick не выбирает предметы с нулевым весом', () => {
    const rng = createRng(1);
    const picked = new Set<string>();
    for (let i = 0; i < 200; i++) picked.add(weightedPick(rng, ['a', 'b', 'c'], (x) => (x === 'b' ? 0 : 1)));
    expect(picked.has('b')).toBe(false);
  });

  it('одинаковый seed → одинаковая добыча', () => {
    const a = generateGear(createRng(42), { rarity: 'rare', cycle: 1 });
    const b = generateGear(createRng(42), { rarity: 'rare', cycle: 1 });
    expect(a).toEqual(b);
  });

  it('бонус редкости переносит вес из common в старшие', () => {
    const base = effectiveRarityWeights({ source: 'battle', cycle: 1, rarityBonus: 0 });
    const boosted = effectiveRarityWeights({ source: 'battle', cycle: 1, rarityBonus: 20 });
    expect(boosted.common).toBeLessThan(base.common);
    expect(boosted.epic).toBeGreaterThan(base.epic);
  });

  it('с циклом добыча становится щедрее', () => {
    let early = 0;
    let late = 0;
    for (let i = 0; i < 300; i++) {
      if (rollRarity(createRng(i + 1), { source: 'battle', cycle: 1 }).match(/rare|epic|legendary/)) early++;
      if (rollRarity(createRng(i + 1), { source: 'battle', cycle: 5 }).match(/rare|epic|legendary/)) late++;
    }
    expect(late).toBeGreaterThanOrEqual(early);
  });

  it('аффиксы растут с редкостью', () => {
    const common = generateGear(createRng(1), { rarity: 'common', cycle: 1 });
    const epic = generateGear(createRng(1), { rarity: 'epic', cycle: 1 });
    expect(common.affixes.length).toBe(0);
    expect(epic.affixes.length).toBe(2);
  });

  it('качество в границах 0.85..1.15 и влияет на статы', () => {
    const inst: GearInstance = { uid: 'x', defId: 'steel_blade', rarity: 'uncommon', quality: 1.15, affixes: [], cycle: 1 };
    const def = GEAR_BY_ID.steel_blade!;
    const s = gearInstanceStats(inst);
    expect(s.atk).toBeCloseTo(def.stats.atk! * 1.15, 0);
  });
});

describe('мастерская: слияние и разбор', () => {
  const mk = (uid: string, rarity: GearInstance['rarity'], defId = 'rusty_sword'): GearInstance => ({ uid, defId, rarity, quality: 1, affixes: [], cycle: 1 });

  it('нужно ровно 3 предмета одной редкости', () => {
    expect(canCraft([mk('1', 'common')]).ok).toBe(false);
    expect(canCraft([mk('1', 'common'), mk('2', 'common'), mk('3', 'uncommon')]).ok).toBe(false);
    expect(canCraft([mk('1', 'common'), mk('2', 'common'), mk('3', 'common')]).ok).toBe(true);
  });

  it('легендарные не сливаются', () => {
    expect(canCraft([mk('1', 'legendary'), mk('2', 'legendary'), mk('3', 'legendary')]).ok).toBe(false);
  });

  it('слияние повышает редкость на ступень', () => {
    const out = craftGear(createRng(5), [mk('1', 'common'), mk('2', 'common', 'gambeson'), mk('3', 'common', 'copper_amulet')], 1);
    expect(out.rarity).toBe('uncommon');
    expect(out.uid).not.toContain('1');
  });

  it('два предмета сета тянут результат в сет', () => {
    const inputs = [mk('1', 'rare', 'dragon_fang'), mk('2', 'rare', 'dragon_scale'), mk('3', 'rare', 'headsman_axe')];
    const out = craftGear(createRng(7), inputs, 1);
    expect(GEAR_BY_ID[out.defId]!.setId).toBe('dragon');
  });

  it('скидка уменьшает цену слияния', () => {
    expect(craftCost('rare', 0)).toBe(90);
    expect(craftCost('rare', 50)).toBe(45);
  });

  it('разбор даёт меньше, чем стоит слияние', () => {
    expect(SALVAGE_ORE.common).toBeLessThan(craftCost('common', 0));
  });
});

describe('сеты и вычисление юнита', () => {
  const gear = (uid: string, defId: string): GearInstance => ({ uid, defId, rarity: GEAR_BY_ID[defId]!.rarity, quality: 1, affixes: [], cycle: 1 });

  it('сет из 2 предметов даёт бонус', () => {
    const one = computeUnit({ id: 'a', name: 'Один', recruitId: 'militia', gear: { weapon: gear('w', 'dragon_fang') }, line: 0, column: 0 });
    const two = computeUnit({ id: 'b', name: 'Два', recruitId: 'militia', gear: { weapon: gear('w', 'dragon_fang'), armor: gear('ar', 'dragon_scale') }, line: 0, column: 0 });
    // 2 предмета сета Дракона: +10% атаки.
    expect(two.setCounts.dragon).toBe(2);
    expect(two.stats.atk).toBeGreaterThan(one.stats.atk);
  });

  it('полный сет даёт способность 4-го уровня', () => {
    const u = computeUnit({
      id: 'c', name: 'Полный', recruitId: 'militia',
      gear: {
        weapon: gear('w', 'dragon_fang'),
        armor: gear('a', 'dragon_scale'),
        trinket: gear('t', 'dragon_eye'),
        core: gear('c', 'flame_heart'),
      },
      line: 0, column: 0,
    });
    expect(u.setCounts.dragon).toBe(4);
    expect(u.abilities.some((a) => a.key === 'cleave')).toBe(true);
    expect(u.abilities.some((a) => a.key === 'poisonOnHit')).toBe(false);
    expect(u.stats.armorPen).toBeGreaterThanOrEqual(30);
  });

  it('лоот-модификаторы суммируются', () => {
    expect(lootRarityBonus([{ kind: 'lootRarity', bonus: 6 }, { kind: 'lootRarity', bonus: 8 }])).toBe(14);
    expect(lootCountBonus([{ kind: 'lootCount', bonus: 1 }])).toBe(1);
  });

  it('craftDiscount складывается и ограничен', () => {
    expect(craftDiscount([{ kind: 'craftDiscount', pct: 15 }, { kind: 'craftDiscount', pct: 25 }])).toBe(40);
    expect(craftDiscount([{ kind: 'craftDiscount', pct: 40 }, { kind: 'craftDiscount', pct: 40 }])).toBe(60);
  });

  it('неизвестный рекрут бросает понятную ошибку', () => {
    expect(() => computeUnit({ id: 'x', name: 'X', recruitId: 'nope', gear: {}, line: 0, column: 0 })).toThrow(/nope/);
  });

  it('ZERO_RESOURCES — нули', () => {
    expect(Object.values(ZERO_RESOURCES).every((v) => v === 0)).toBe(true);
  });
});
