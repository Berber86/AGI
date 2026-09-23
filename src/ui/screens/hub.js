// Оболочка «города»: вкладки мета-экрана.
import { el } from '../dom.js';
import { app } from '../app.js';
import { renderMap } from './map.js';
import { renderScience } from './science.js';
import { renderForge } from './forge.js';
import { renderRoster } from './roster.js';
import { renderDeck } from './deck.js';
import { renderJournal } from './journal.js';

export const HUB_TABS = [
  { id: 'map', label: 'Карта мира', icon: '🗺', render: renderMap },
  { id: 'forge', label: 'Мастерская', icon: '⚙', render: renderForge },
  { id: 'science', label: 'Наука', icon: '🔬', render: renderScience },
  { id: 'roster', label: 'Ростер', icon: '🛡', render: renderRoster },
  { id: 'deck', label: 'Колода', icon: '🂠', render: renderDeck },
  { id: 'journal', label: 'Журнал', icon: '📜', render: renderJournal },
];

export function renderHub() {
  const tab = HUB_TABS.find((t) => t.id === app.tab) || HUB_TABS[0];
  const node = el('section', { class: `screen screen--${tab.id}` });
  node.append(tab.render());
  return node;
}
