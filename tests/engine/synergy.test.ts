import { describe, expect, it } from 'vitest';
import { GEAR_BY_ID } from '@/data/gear';
import { synergyHints, setTierStates } from '@/engine/unit/synergy';
import { computeUnit } from '@/engine/unit/computeUnit';
import type { GearDef, GearInstance } from '@/engine/unit/unit.types';

const def = (id: string): GearDef => GEAR_BY_ID[id]!;

const inst = (uid: string, defId: string): GearInstance => ({
  uid,
  defId,
  rarity: GEAR_BY_ID[defId]!.rarity,
  quality: 1,
  affixes: [],
  cycle: 1,
});

describe('синергии: подсказки', () => {
  it('прогресс сета 2/3 → подсказка до третьего предмета', () => {
    const hints = synergyHints([def('dragon_fang'), def('dragon_scale')], [def('dragon_eye')], ['melee']);
    const dragon = hints.find((h) => h.setId === 'dragon');
    expect(dragon).toBeDefined();
    expect(dragon!.have).toBe(2);
    expect(dragon!.nextPieces).toBe(3);
    expect(dragon!.reason).toBe('progress');
    expect(dragon!.availableInStash).toBe(1);
  });

  it('архетипный совет: волчий сет для кавалерии даже без надетых предметов', () => {
    const hints = synergyHints([], [def('wolf_claws')], ['melee', 'cavalry']);
    const wolf = hints.find((h) => h.setId === 'wolf');
    expect(wolf).toBeDefined();
    expect(wolf!.reason).toBe('archetype');
    expect(wolf!.have).toBe(0);
  });

  it('без совпадений подсказок нет', () => {
    // mage (ranged+magic) подходит sage/dragon — но если в коллекции пусто, подсказок нет.
    expect(synergyHints([], [], ['melee', 'infantry'])).toEqual([]);
  });

  it('полный сет не даёт подсказок', () => {
    const full = [def('dragon_fang'), def('dragon_scale'), def('dragon_eye'), def('flame_heart')];
    expect(synergyHints(full, [], ['melee']).find((h) => h.setId === 'dragon')).toBeUndefined();
  });

  it('сортировка: сначала активный прогресс, потом архетипы', () => {
    const hints = synergyHints(
      [def('wolf_claws'), def('wolf_pelt')],
      [def('bulwark_spiked_mace' in GEAR_BY_ID ? 'spiked_mace' : 'plate_cuirass'), def('sage_robe')],
      ['melee', 'infantry', 'cavalry'],
    );
    expect(hints[0]!.setId).toBe('wolf');
    expect(hints[0]!.reason).toBe('progress');
  });
});

describe('синергии: тиры сетов', () => {
  it('setTierStates помечает активные и неактивные тиры', () => {
    const tiers = setTierStates('dragon', 2);
    expect(tiers.length).toBe(3);
    expect(tiers[0]!.active).toBe(true);
    expect(tiers[1]!.active).toBe(false);
    expect(tiers[2]!.active).toBe(false);
    expect(setTierStates('dragon', 4).every((t) => t.active)).toBe(true);
    expect(setTierStates('nope', 2)).toEqual([]);
  });
});

describe('синергии: интеграция с computeUnit', () => {
  it('совет «2/3 → добавьте третий» реально открывает бонус 3-го тира', () => {
    const two = computeUnit({
      id: 'a', name: 'Два', recruitId: 'militia',
      gear: { weapon: inst('w', 'dragon_fang'), armor: inst('a', 'dragon_scale') },
      line: 0, column: 0,
    });
    expect(two.setCounts.dragon).toBe(2);
    expect(two.abilities.some((ab) => ab.key === 'cleave')).toBe(false);

    const three = computeUnit({
      id: 'b', name: 'Три', recruitId: 'militia',
      gear: {
        weapon: inst('w', 'dragon_fang'),
        armor: inst('a', 'dragon_scale'),
        trinket: inst('t', 'dragon_eye'),
      },
      line: 0, column: 0,
    });
    expect(three.setCounts.dragon).toBe(3);
    expect(three.abilities.some((ab) => ab.key === 'cleave')).toBe(true);
  });
});
