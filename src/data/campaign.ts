export type NodeKind = 'battle' | 'elite' | 'rest' | 'treasure' | 'boss';

export interface CampaignNodeDef {
  id: string;
  /** Индекс слоя (колонки) на карте, 0 — старт. */
  layer: number;
  kind: NodeKind;
  title: string;
  /** Идентификаторы узлов следующего слоя, в которые можно пойти. */
  next: string[];
}

export const NODE_KIND_META: Record<NodeKind, { label: string; icon: string; hint: string }> = {
  battle: { label: 'Бой', icon: '⚔️', hint: 'Обычная стычка. 1 шестерёнка за победу.' },
  elite: { label: 'Элита', icon: '💀', hint: 'Сильный отряд с редкой экипировкой. 2 шестерёнки.' },
  rest: { label: 'Привал', icon: '🏕️', hint: 'Два хода экономики без боя.' },
  treasure: { label: 'Сокровище', icon: '🎁', hint: 'Бесплатная добыча повышенной редкости.' },
  boss: { label: 'Босс', icon: '👑', hint: 'Финал цикла. 3 шестерёнки и новый цикл.' },
};

/**
 * Статичная структура карты цикла. Содержимое узлов (враги, добыча) генерируется
 * детерминированно по seed кампании (см. engine/campaign/nodeLogic.ts).
 * Первый слой — стартовый узел, из него можно пойти в любой узел слоя 1.
 */
export const CAMPAIGN_MAP: CampaignNodeDef[] = [
  { id: 'start', layer: 0, kind: 'rest', title: 'Лагерь', next: ['b1a', 'b1b'] },

  { id: 'b1a', layer: 1, kind: 'battle', title: 'Разбойничий тракт', next: ['b2a', 'r2'] },
  { id: 'b1b', layer: 1, kind: 'battle', title: 'Волчий лес', next: ['r2', 'b2b'] },

  { id: 'b2a', layer: 2, kind: 'battle', title: 'Старая застава', next: ['e3', 't3'] },
  { id: 'r2', layer: 2, kind: 'rest', title: 'Придорожная деревня', next: ['e3', 't3'] },
  { id: 'b2b', layer: 2, kind: 'battle', title: 'Кладбище у холма', next: ['t3', 'b3'] },

  { id: 'e3', layer: 3, kind: 'elite', title: 'Логово вожака', next: ['r4', 'b4'] },
  { id: 't3', layer: 3, kind: 'treasure', title: 'Заброшенная шахта', next: ['r4', 'b4'] },
  { id: 'b3', layer: 3, kind: 'battle', title: 'Мост через реку', next: ['b4'] },

  { id: 'r4', layer: 4, kind: 'rest', title: 'Монастырь', next: ['e5', 'b5'] },
  { id: 'b4', layer: 4, kind: 'battle', title: 'Сожжённый хутор', next: ['e5', 'b5'] },

  { id: 'e5', layer: 5, kind: 'elite', title: 'Курган', next: ['r6'] },
  { id: 'b5', layer: 5, kind: 'battle', title: 'Ущелье', next: ['r6'] },

  { id: 'r6', layer: 6, kind: 'rest', title: 'Последний лагерь', next: ['boss'] },

  { id: 'boss', layer: 7, kind: 'boss', title: 'Цитадель Лича', next: [] },
];

export const CAMPAIGN_NODE_BY_ID: Record<string, CampaignNodeDef> = Object.fromEntries(
  CAMPAIGN_MAP.map((n) => [n.id, n]),
);

export const MAX_LAYER = Math.max(...CAMPAIGN_MAP.map((n) => n.layer));
