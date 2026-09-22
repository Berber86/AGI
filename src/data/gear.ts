import type { GearDef, GearSlot, Rarity } from '@/engine/unit/unit.types';

/**
 * Пул шестерёнок. Редкость закреплена за определением (как у уникальных предметов Diablo):
 * генератор сначала выбирает редкость по весам, затем — предмет этой редкости.
 * Случайность экземпляра — в качестве (quality) и аффиксах (см. engine/loot/gearGenerator.ts).
 */
const g = (def: GearDef): GearDef => def;

export const GEAR_POOL: GearDef[] = [
  // =================== COMMON ===================
  g({ id: 'rusty_sword', name: 'Ржавый меч', icon: '🗡️', slot: 'weapon', rarity: 'common', stats: { atk: 4 } }),
  g({ id: 'hunting_bow', name: 'Охотничий лук', icon: '🏹', slot: 'weapon', rarity: 'common', stats: { atk: 3, acc: 3 } }),
  g({ id: 'gambeson', name: 'Стёганка', icon: '🧥', slot: 'armor', rarity: 'common', stats: { hp: 15, def: 3 } }),
  g({ id: 'leather_armor', name: 'Кожаный доспех', icon: '🥋', slot: 'armor', rarity: 'common', stats: { def: 4, eva: 2 } }),
  g({ id: 'copper_amulet', name: 'Медный амулет', icon: '📿', slot: 'trinket', rarity: 'common', stats: { morale: 6 } }),
  g({ id: 'rabbit_foot', name: 'Кроличья лапка', icon: '🐾', slot: 'trinket', rarity: 'common', stats: { eva: 3 } }),
  g({ id: 'crude_cog', name: 'Грубая шестерня', icon: '⚙️', slot: 'core', rarity: 'common', stats: { hp: 10, atk: 2 } }),
  g({ id: 'lead_weight', name: 'Свинцовый груз', icon: '🔩', slot: 'core', rarity: 'common', stats: { def: 3, hp: 5 } }),

  // =================== UNCOMMON ===================
  g({ id: 'steel_blade', name: 'Стальной клинок', icon: '⚔️', slot: 'weapon', rarity: 'uncommon', stats: { atk: 7, crit: 3 } }),
  g({ id: 'composite_bow', name: 'Составной лук', icon: '🏹', slot: 'weapon', rarity: 'uncommon', stats: { atk: 6, acc: 6 } }),
  g({ id: 'war_hammer', name: 'Боевой молот', icon: '🔨', slot: 'weapon', rarity: 'uncommon', stats: { atk: 10, spd: -1 } }),
  g({ id: 'chainmail', name: 'Кольчуга', icon: '🛡️', slot: 'armor', rarity: 'uncommon', stats: { def: 8, hp: 20 } }),
  g({ id: 'scout_cloak', name: 'Плащ разведчика', icon: '🧣', slot: 'armor', rarity: 'uncommon', stats: { eva: 8, spd: 2 } }),
  g({ id: 'ring_of_might', name: 'Кольцо силы', icon: '💍', slot: 'trinket', rarity: 'uncommon', stats: { atk: 4, morale: 5 } }),
  g({ id: 'amulet_of_aim', name: 'Амулет точности', icon: '🎯', slot: 'trinket', rarity: 'uncommon', stats: { acc: 8, crit: 3 } }),
  g({ id: 'honed_cog', name: 'Точёная шестерня', icon: '⚙️', slot: 'core', rarity: 'uncommon', stats: { atk: 4, spd: 2 } }),
  g({ id: 'flywheel', name: 'Маховик', icon: '🛞', slot: 'core', rarity: 'uncommon', stats: { hp: 25 } }),

  // =================== RARE ===================
  // --- сетовые ---
  g({ id: 'dragon_fang', name: 'Клык дракона', icon: '🐉', slot: 'weapon', rarity: 'rare', setId: 'dragon', element: 'fire', stats: { atk: 12 } }),
  g({ id: 'dragon_scale', name: 'Чешуйчатый доспех', icon: '🐲', slot: 'armor', rarity: 'rare', setId: 'dragon', stats: { def: 10, hp: 30 } }),
  g({ id: 'wolf_claws', name: 'Волчьи когти', icon: '🐺', slot: 'weapon', rarity: 'rare', setId: 'wolf', stats: { atk: 9, spd: 2, crit: 5 } }),
  g({ id: 'wolf_pelt', name: 'Волчья шкура', icon: '🐺', slot: 'armor', rarity: 'rare', setId: 'wolf', stats: { hp: 25, eva: 6 } }),
  g({ id: 'spiked_mace', name: 'Шипастая булава', icon: '🏰', slot: 'weapon', rarity: 'rare', setId: 'bulwark', stats: { atk: 8, def: 5 } }),
  g({ id: 'plate_cuirass', name: 'Латный нагрудник', icon: '🏰', slot: 'armor', rarity: 'rare', setId: 'bulwark', stats: { def: 15, hp: 40 } }),
  g({ id: 'venom_dagger', name: 'Отравленный кинжал', icon: '🐍', slot: 'weapon', rarity: 'rare', setId: 'serpent', element: 'poison', stats: { atk: 8, spd: 1 }, abilities: [{ key: 'poisonOnHit', stacks: 1 }] }),
  g({ id: 'snake_skin', name: 'Змеиная кожа', icon: '🐍', slot: 'armor', rarity: 'rare', setId: 'serpent', stats: { eva: 10, hp: 15 } }),
  g({ id: 'staff_of_knowledge', name: 'Посох знаний', icon: '📜', slot: 'weapon', rarity: 'rare', setId: 'sage', element: 'arcane', stats: { atk: 9, acc: 8 } }),
  g({ id: 'sage_robe', name: 'Мантия мудреца', icon: '📜', slot: 'armor', rarity: 'rare', setId: 'sage', stats: { hp: 20, def: 5, acc: 5 } }),
  // --- обычные редкие со способностью ---
  g({ id: 'headsman_axe', name: 'Секира палача', icon: '🪓', slot: 'weapon', rarity: 'rare', stats: { atk: 11 }, abilities: [{ key: 'execute', threshold: 30, bonus: 40 }] }),
  g({ id: 'shell_shield', name: 'Щит-панцирь', icon: '🐢', slot: 'armor', rarity: 'rare', stats: { def: 12, hp: 20 }, abilities: [{ key: 'retaliate', pct: 30 }] }),
  g({ id: 'talisman_of_valor', name: 'Талисман храбрости', icon: '🎖️', slot: 'trinket', rarity: 'rare', stats: { morale: 20 }, abilities: [{ key: 'rally', morale: 8 }] }),
  g({ id: 'frost_brand', name: 'Морозный клинок', icon: '❄️', slot: 'weapon', rarity: 'rare', element: 'frost', stats: { atk: 9, spd: 1 }, abilities: [{ key: 'slowOnHit', rounds: 2 }] }),
  g({ id: 'chrono_pendant', name: 'Хроно-кулон', icon: '⏳', slot: 'trinket', rarity: 'rare', stats: { spd: 2, eva: 4 }, abilities: [{ key: 'slowOnHit', rounds: 1 }] }),
  g({ id: 'regenerator', name: 'Регенератор', icon: '💚', slot: 'core', rarity: 'rare', stats: { hp: 20 }, abilities: [{ key: 'regen', hp: 5 }] }),
  g({ id: 'lens_of_focus', name: 'Линза сосредоточения', icon: '🔍', slot: 'trinket', rarity: 'rare', stats: { acc: 10, crit: 6 } }),
  g({ id: 'iron_core', name: 'Железное ядро', icon: '⚙️', slot: 'core', rarity: 'rare', stats: { def: 8, hp: 30, atk: 3 } }),

  // =================== EPIC ===================
  // --- сетовые ---
  g({ id: 'dragon_eye', name: 'Драконий глаз', icon: '🐉', slot: 'trinket', rarity: 'epic', setId: 'dragon', stats: { crit: 8, critDmg: 20 } }),
  g({ id: 'flame_heart', name: 'Пламенное сердце', icon: '🐉', slot: 'core', rarity: 'epic', setId: 'dragon', element: 'fire', stats: { atk: 8, armorPen: 15 } }),
  g({ id: 'alpha_fang', name: 'Клык вожака', icon: '🐺', slot: 'trinket', rarity: 'epic', setId: 'wolf', stats: { spd: 3, crit: 6 } }),
  g({ id: 'wild_heart', name: 'Дикое сердце', icon: '🐺', slot: 'core', rarity: 'epic', setId: 'wolf', stats: { spd: 4, atk: 5 } }),
  g({ id: 'seal_of_resolve', name: 'Печать стойкости', icon: '🏰', slot: 'trinket', rarity: 'epic', setId: 'bulwark', stats: { morale: 15, def: 5 } }),
  g({ id: 'granite_core', name: 'Гранитное ядро', icon: '🏰', slot: 'core', rarity: 'epic', setId: 'bulwark', stats: { hp: 50, def: 8 } }),
  g({ id: 'venom_vial', name: 'Ядовитый флакон', icon: '🐍', slot: 'trinket', rarity: 'epic', setId: 'serpent', element: 'poison', stats: { acc: 5 }, abilities: [{ key: 'poisonOnHit', stacks: 1 }] }),
  g({ id: 'serpent_core', name: 'Змеиное ядро', icon: '🐍', slot: 'core', rarity: 'epic', setId: 'serpent', stats: { eva: 6, spd: 3, atk: 4 } }),
  g({ id: 'lens_of_truth', name: 'Линза истины', icon: '📜', slot: 'trinket', rarity: 'epic', setId: 'sage', stats: { acc: 12, crit: 5 } }),
  g({ id: 'mind_core', name: 'Ядро разума', icon: '📜', slot: 'core', rarity: 'epic', setId: 'sage', element: 'arcane', stats: { atk: 6, armorPen: 20 } }),
  // --- обычные эпические ---
  g({ id: 'storm_blade', name: 'Клинок бури', icon: '⚡', slot: 'weapon', rarity: 'epic', stats: { atk: 14, spd: 3 }, abilities: [{ key: 'doubleStrike', chance: 20 }] }),
  g({ id: 'titan_plate', name: 'Доспех титана', icon: '🛡️', slot: 'armor', rarity: 'epic', stats: { def: 18, hp: 50 }, abilities: [{ key: 'shield', amount: 40 }] }),
  g({ id: 'hawk_eye', name: 'Око ястреба', icon: '🦅', slot: 'trinket', rarity: 'epic', stats: { acc: 15, range: 1, crit: 5 } }),
  g({ id: 'war_engine', name: 'Двигатель войны', icon: '⚙️', slot: 'core', rarity: 'epic', stats: { atk: 10, critDmg: 30 } }),
  g({ id: 'thunder_maul', name: 'Громовой молот', icon: '🔨', slot: 'weapon', rarity: 'epic', stats: { atk: 13, spd: -1 }, abilities: [{ key: 'stunOnHit', chance: 30, rounds: 1 }] }),
  g({ id: 'aegis_shard', name: 'Осколок эгиды', icon: '🧿', slot: 'core', rarity: 'epic', stats: { def: 10, hp: 30 }, abilities: [{ key: 'wardOnStart', charges: 2, perCharge: 35 }] }),

  // =================== LEGENDARY ===================
  g({ id: 'devourer', name: 'Пожиратель', icon: '🩸', slot: 'weapon', rarity: 'legendary', stats: { atk: 18, lifesteal: 25 }, targeting: 'weakest', flavor: 'Каждая рана врага — глоток жизни.' }),
  g({ id: 'dawn_blade', name: 'Рассветный клинок', icon: '🌅', slot: 'weapon', rarity: 'legendary', element: 'fire', stats: { atk: 16, crit: 10 }, abilities: [{ key: 'firstStrike' }], flavor: 'Бьёт прежде, чем враг поймёт, что рассвело.' }),
  g({ id: 'aegis', name: 'Эгида Бессмертных', icon: '🛡️', slot: 'armor', rarity: 'legendary', stats: { hp: 80, def: 20 }, abilities: [{ key: 'shield', amount: 120 }], tags: ['fearless'], flavor: 'Носитель не ведает страха. Совсем.' }),
  g({ id: 'phoenix_heart', name: 'Сердце Феникса', icon: '🔥', slot: 'trinket', rarity: 'legendary', element: 'fire', stats: { hp: 30, morale: 25 }, abilities: [{ key: 'regen', hp: 15 }], flavor: 'Оно бьётся, даже когда всё вокруг — пепел.' }),
  g({ id: 'hunter_compass', name: 'Компас охотника', icon: '🧭', slot: 'trinket', rarity: 'legendary', stats: { acc: 10, range: 1 }, abilities: [{ key: 'targetPref', tag: 'ranged' }], flavor: 'Стрелка всегда указывает на лучника.' }),
  g({ id: 'perpetuum', name: 'Вечный двигатель', icon: '✨', slot: 'core', rarity: 'legendary', stats: { spd: 6, atk: 8 }, abilities: [{ key: 'doubleStrike', chance: 35 }], flavor: 'Шестерёнка, которая не останавливается.' }),
  g({ id: 'titan_core', name: 'Ядро Титана', icon: '🗿', slot: 'core', rarity: 'legendary', stats: { hp: 100, def: 15 }, abilities: [{ key: 'retaliate', pct: 60 }], flavor: 'Ударь — и тебе ответит гора.' }),

  // ============ КВЕСТОВЫЕ: только награда за испытания, не из лута ============
  g({ id: 'solar_lance', name: 'Солнечное копьё', icon: '🔆', slot: 'weapon', rarity: 'legendary', element: 'fire', questOnly: true, stats: { atk: 17, crit: 8, armorPen: 20 }, abilities: [{ key: 'firstStrike' }], flavor: 'Выковано в сердце звезды. Награда поджигателю.' }),
  g({ id: 'phoenix_crown', name: 'Венец Феникса', icon: '👑', slot: 'trinket', rarity: 'legendary', element: 'fire', questOnly: true, stats: { hp: 45, morale: 30 }, abilities: [{ key: 'regen', hp: 12 }], flavor: 'Кто не потерял никого — не потеряет и себя.' }),
  g({ id: 'cog_of_ages', name: 'Шестерня Веков', icon: '🕰️', slot: 'core', rarity: 'legendary', questOnly: true, stats: { atk: 10, def: 12, spd: 3 }, flavor: 'Она вращала первый Цикл. И повернёт следующий.' }),
  g({ id: 'warlord_seal', name: 'Печать Военачальника', icon: '🎖️', slot: 'trinket', rarity: 'legendary', questOnly: true, stats: { atk: 6, morale: 30 }, abilities: [{ key: 'rally', morale: 10 }], flavor: 'Пять побед подряд не забываются. И не прощаются.' }),
];

export const GEAR_BY_ID: Record<string, GearDef> = Object.fromEntries(GEAR_POOL.map((d) => [d.id, d]));

export function gearOfRarity(rarity: Rarity, slot?: GearSlot): GearDef[] {
  return GEAR_POOL.filter((d) => d.rarity === rarity && (slot === undefined || d.slot === slot));
}

export const RARITY_LABEL: Record<Rarity, string> = {
  common: 'Обычная',
  uncommon: 'Необычная',
  rare: 'Редкая',
  epic: 'Эпическая',
  legendary: 'Легендарная',
};

export const SLOT_LABEL: Record<GearSlot, string> = {
  weapon: 'Оружие',
  armor: 'Броня',
  trinket: 'Амулет',
  core: 'Ядро',
};

export const SLOT_ICON: Record<GearSlot, string> = {
  weapon: '⚔️',
  armor: '🛡️',
  trinket: '💍',
  core: '⚙️',
};
