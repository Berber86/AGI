/** Квестовые шестерёнки: уникальные награды за особые условия (не рандомный дроп). */

export interface QuestDef {
  id: string;
  name: string;
  icon: string;
  /** Что нужно сделать (человекочитаемо). */
  description: string;
  /** Какой предмет выдаётся. */
  rewardDefId: string;
}

export const QUESTS: QuestDef[] = [
  {
    id: 'q_phoenix',
    name: 'Испытание Феникса',
    icon: '👑',
    description: 'Победи Босса цикла, не потеряв ни одного отряда.',
    rewardDefId: 'phoenix_crown',
  },
  {
    id: 'q_arsonist',
    name: 'Поджигатель',
    icon: '🔆',
    description: 'Победи Босса цикла, нанося урон только Огнём.',
    rewardDefId: 'solar_lance',
  },
  {
    id: 'q_cog_ages',
    name: 'Хранитель Циклов',
    icon: '🕰️',
    description: 'Заверши второй Цикл (победи Босса в цикле 2).',
    rewardDefId: 'cog_of_ages',
  },
  {
    id: 'q_warlord',
    name: 'Пять побед подряд',
    icon: '🎖️',
    description: 'Выиграй 5 боёв подряд в любом порядке.',
    rewardDefId: 'warlord_seal',
  },
];

export const QUEST_BY_ID: Record<string, QuestDef> = Object.fromEntries(QUESTS.map((q) => [q.id, q]));
