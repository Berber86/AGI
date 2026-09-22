import type { Modifier } from '@/engine/unit/unit.types';

/** Иконки технологий (аналог символов карт Innovation). */
export const TECH_ICONS = ['craft', 'lore', 'culture', 'war', 'mining', 'agri'] as const;
export type TechIcon = (typeof TECH_ICONS)[number];

export const TECH_ICON_META: Record<TechIcon, { label: string; emoji: string; color: string }> = {
  craft: { label: 'Ремесло', emoji: '🔧', color: 'text-amber-300' },
  lore: { label: 'Знание', emoji: '📖', color: 'text-sky-300' },
  culture: { label: 'Культура', emoji: '🎭', color: 'text-fuchsia-300' },
  war: { label: 'Война', emoji: '⚔️', color: 'text-red-300' },
  mining: { label: 'Горное дело', emoji: '⛏️', color: 'text-stone-300' },
  agri: { label: 'Земледелие', emoji: '🌾', color: 'text-lime-300' },
};

export interface TechDef {
  id: string;
  name: string;
  icon: string;
  era: 1 | 2 | 3;
  /** Стоимость в науке. */
  cost: number;
  requires: string[];
  icons: TechIcon[];
  effects: Modifier[];
  description: string;
}

export const TECHS: TechDef[] = [
  // ===== Эра I =====
  { id: 'agriculture', name: 'Земледелие', icon: '🌱', era: 1, cost: 20, requires: [], icons: ['agri'], effects: [{ kind: 'production', resource: 'food', pct: 20 }], description: '+20% к производству еды.' },
  { id: 'mining', name: 'Горное дело', icon: '⛏️', era: 1, cost: 20, requires: [], icons: ['mining'], effects: [], description: 'Открывает Шахту.' },
  { id: 'writing', name: 'Письменность', icon: '📜', era: 1, cost: 25, requires: [], icons: ['lore'], effects: [], description: 'Открывает Библиотеку.' },
  { id: 'bronze_working', name: 'Бронза', icon: '🥉', era: 1, cost: 30, requires: ['mining'], icons: ['war', 'craft'], effects: [{ kind: 'stat', stat: 'atk', flat: 2 }], description: '+2 к атаке всех отрядов. Открывает Казармы.' },
  { id: 'pottery', name: 'Гончарное дело', icon: '🏺', era: 1, cost: 25, requires: ['agriculture'], icons: ['craft', 'culture'], effects: [], description: 'Открывает Святилище.' },
  { id: 'archery', name: 'Стрельба из лука', icon: '🏹', era: 1, cost: 30, requires: [], icons: ['war'], effects: [{ kind: 'stat', stat: 'acc', flat: 5 }], description: '+5% меткости всем отрядам.' },
  { id: 'horseback_riding', name: 'Верховая езда', icon: '🐎', era: 1, cost: 35, requires: ['agriculture'], icons: ['war', 'agri'], effects: [], description: 'Открывает Копейщика.' },

  // ===== Эра II =====
  { id: 'iron_working', name: 'Обработка железа', icon: '⚒️', era: 2, cost: 60, requires: ['bronze_working'], icons: ['war', 'craft', 'mining'], effects: [{ kind: 'stat', stat: 'def', flat: 3 }], description: '+3 к защите всех отрядов. Открывает Рыцаря и Кузницу.' },
  { id: 'mathematics', name: 'Математика', icon: '📐', era: 2, cost: 55, requires: ['writing'], icons: ['lore', 'craft'], effects: [{ kind: 'production', resource: 'science', pct: 15 }], description: '+15% к науке.' },
  { id: 'philosophy', name: 'Философия', icon: '🧠', era: 2, cost: 60, requires: ['writing'], icons: ['lore', 'culture'], effects: [], description: 'Открывает Мага.' },
  { id: 'currency', name: 'Чеканка монет', icon: '🪙', era: 2, cost: 50, requires: ['mining', 'pottery'], icons: ['culture', 'mining'], effects: [], description: 'Открывает Рынок и Головореза.' },
  { id: 'masonry', name: 'Каменная кладка', icon: '🧱', era: 2, cost: 50, requires: ['mining'], icons: ['craft', 'mining'], effects: [{ kind: 'production', resource: 'ore', pct: 20 }], description: '+20% к добыче руды.' },
  { id: 'medicine', name: 'Медицина', icon: '⚕️', era: 2, cost: 55, requires: ['agriculture', 'writing'], icons: ['lore', 'agri'], effects: [{ kind: 'stat', stat: 'hp', pct: 8 }], description: '+8% здоровья всем отрядам.' },
  { id: 'hunting', name: 'Охота', icon: '🏹', era: 2, cost: 45, requires: ['archery'], icons: ['war', 'agri'], effects: [{ kind: 'stat', stat: 'crit', flat: 3 }], description: '+3% крита всем отрядам. Путь Охотника.' },
  { id: 'toolmaking', name: 'Орудия труда', icon: '🔨', era: 2, cost: 45, requires: ['bronze_working'], icons: ['craft', 'craft'], effects: [{ kind: 'stat', stat: 'atk', flat: 1 }, { kind: 'production', resource: 'ore', flat: 4 }], description: '+1 атака, +4 руды за ход. Путь Кузнеца.' },
  { id: 'logistics', name: 'Логистика', icon: '🚚', era: 2, cost: 50, requires: ['currency'], icons: ['culture', 'agri'], effects: [{ kind: 'production', resource: 'food', flat: 6 }], description: '+6 еды за ход. Путь Стратега.' },

  // ===== Эра III =====
  { id: 'steel', name: 'Сталь', icon: '🔩', era: 3, cost: 110, requires: ['iron_working'], icons: ['war', 'craft', 'craft'], effects: [{ kind: 'stat', stat: 'atk', pct: 8 }], description: '+8% к атаке всех отрядов.' },
  { id: 'engineering', name: 'Инженерия', icon: '⚙️', era: 3, cost: 120, requires: ['mathematics', 'masonry'], icons: ['craft', 'lore', 'mining'], effects: [{ kind: 'craftDiscount', pct: 15 }], description: 'Слияние шестерёнок на 15% дешевле.' },
  { id: 'alchemy', name: 'Алхимия', icon: '⚗️', era: 3, cost: 120, requires: ['philosophy', 'medicine'], icons: ['lore', 'craft'], effects: [{ kind: 'lootRarity', bonus: 6 }], description: 'Добыча заметно чаще выпадает более редкой.' },
  { id: 'feudalism', name: 'Феодализм', icon: '🏰', era: 3, cost: 100, requires: ['currency', 'horseback_riding'], icons: ['war', 'culture', 'agri'], effects: [{ kind: 'stat', stat: 'morale', flat: 10 }], description: '+10 морали всем отрядам.' },
  // --- Путь Охотника: скорость/крит/уклонение ---
  { id: 'hunting_bands', name: 'Охотничьи артели', icon: '🐺', era: 3, cost: 100, requires: ['hunting'], icons: ['war', 'agri', 'agri'], effects: [{ kind: 'stat', stat: 'spd', flat: 2 }, { kind: 'stat', stat: 'eva', flat: 3 }], description: '+2 скорости, +3% уклонения.' },
  { id: 'apex_predator', name: 'Верхний хищник', icon: '🦅', era: 3, cost: 130, requires: ['hunting_bands'], icons: ['war', 'war', 'agri'], effects: [{ kind: 'stat', stat: 'crit', flat: 6 }, { kind: 'stat', stat: 'critDmg', flat: 20 }], description: '+6% крита, +20% критического урона.' },
  { id: 'beast_taming', name: 'Приручение', icon: '🐾', era: 3, cost: 110, requires: ['hunting'], icons: ['agri', 'war'], effects: [{ kind: 'stat', stat: 'spd', flat: 1 }, { kind: 'stat', stat: 'eva', flat: 2 }, { kind: 'stat', stat: 'morale', flat: 5 }], description: '+1 скорость, +2% уклонения, +5 морали.' },
  // --- Путь Кузнеца: атака/слияние/добыча ---
  { id: 'master_craft', name: 'Мастер-кузнец', icon: '⚒️', era: 3, cost: 105, requires: ['toolmaking'], icons: ['craft', 'craft', 'war'], effects: [{ kind: 'stat', stat: 'atk', pct: 5 }, { kind: 'craftDiscount', pct: 10 }], description: '+5% атаки, слияние на 10% дешевле.' },
  { id: 'rune_forge', name: 'Рунная кузня', icon: '🔯', era: 3, cost: 140, requires: ['master_craft'], icons: ['craft', 'lore', 'war'], effects: [{ kind: 'lootRarity', bonus: 5 }, { kind: 'stat', stat: 'atk', flat: 3 }], description: 'Добыча чаще редче, +3 атаки.' },
  // --- Путь Стратега: экономика/масса ---
  { id: 'conscription', name: 'Рекрутский набор', icon: '📯', era: 3, cost: 100, requires: ['logistics'], icons: ['culture', 'war', 'agri'], effects: [{ kind: 'stat', stat: 'hp', pct: 5 }, { kind: 'production', resource: 'food', flat: 5 }], description: '+5% здоровья, +5 еды за ход.' },
  { id: 'war_college', name: 'Военная академия', icon: '🎓', era: 3, cost: 125, requires: ['logistics', 'mathematics'], icons: ['lore', 'war', 'culture'], effects: [{ kind: 'stat', stat: 'morale', flat: 8 }, { kind: 'stat', stat: 'acc', flat: 3 }], description: '+8 морали, +3% меткости.' },
];

export const TECH_BY_ID: Record<string, TechDef> = Object.fromEntries(TECHS.map((t) => [t.id, t]));

/** Догма — пассивный бонус, активируемый набором иконок (прямая параллель с Innovation). */
export interface DogmaDef {
  id: string;
  name: string;
  icon: string;
  requires: Partial<Record<TechIcon, number>>;
  effects: Modifier[];
  description: string;
}

export const DOGMAS: DogmaDef[] = [
  { id: 'warrior_code', name: 'Кодекс воина', icon: '⚔️', requires: { war: 3 }, effects: [{ kind: 'stat', stat: 'atk', pct: 10 }], description: '+10% к атаке.' },
  { id: 'war_machine', name: 'Военная машина', icon: '🏹', requires: { war: 5 }, effects: [{ kind: 'stat', stat: 'crit', flat: 8 }, { kind: 'stat', stat: 'spd', flat: 2 }], description: '+8% крита, +2 скорости.' },
  { id: 'guild', name: 'Гильдия мастеров', icon: '🔧', requires: { craft: 3 }, effects: [{ kind: 'craftDiscount', pct: 25 }], description: 'Слияние на 25% дешевле.' },
  { id: 'master_key', name: 'Мастер-ключ', icon: '🗝️', requires: { craft: 5 }, effects: [{ kind: 'lootRarity', bonus: 8 }], description: 'Редкая добыча выпадает чаще.' },
  { id: 'academy', name: 'Академия', icon: '📖', requires: { lore: 3 }, effects: [{ kind: 'production', resource: 'science', pct: 25 }], description: '+25% к науке.' },
  { id: 'enlightenment', name: 'Просвещение', icon: '💡', requires: { lore: 5 }, effects: [{ kind: 'stat', stat: 'acc', flat: 8 }, { kind: 'stat', stat: 'armorPen', flat: 10 }], description: '+8% меткости, +10 пробития брони.' },
  { id: 'festivals', name: 'Празднества', icon: '🎭', requires: { culture: 3 }, effects: [{ kind: 'stat', stat: 'morale', flat: 15 }], description: '+15 морали.' },
  { id: 'deep_mines', name: 'Глубокие шахты', icon: '⛏️', requires: { mining: 3 }, effects: [{ kind: 'production', resource: 'ore', pct: 30 }], description: '+30% руды.' },
  { id: 'granaries', name: 'Амбары', icon: '🌾', requires: { agri: 3 }, effects: [{ kind: 'production', resource: 'food', pct: 30 }], description: '+30% еды.' },
  // --- комбинации ---
  { id: 'armourers', name: 'Оружейники', icon: '🛡️', requires: { craft: 2, war: 2 }, effects: [{ kind: 'stat', stat: 'def', flat: 5 }, { kind: 'stat', stat: 'critDmg', flat: 15 }], description: '+5 защиты, +15% критического урона.' },
  { id: 'transmutation', name: 'Трансмутация', icon: '⚗️', requires: { lore: 2, craft: 2 }, effects: [{ kind: 'lootCount', bonus: 1 }], description: '+1 шестерёнка за победу.' },
  { id: 'heroic_epic', name: 'Героический эпос', icon: '📯', requires: { culture: 2, war: 2 }, effects: [{ kind: 'ability', ability: { key: 'rally', morale: 5 } }], description: 'Убийство врага поднимает мораль всех союзников на 5.' },
  { id: 'infrastructure', name: 'Инфраструктура', icon: '🛤️', requires: { agri: 2, mining: 2 }, effects: [{ kind: 'production', resource: 'gold', flat: 5 }, { kind: 'production', resource: 'food', flat: 5 }], description: '+5 золота и +5 еды за ход.' },
];
