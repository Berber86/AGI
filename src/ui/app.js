// =============================================================================
//  ШЕСТЕРНИ ЭПОХ — ui/app.js
//  Контроллер приложения: экраны, состояние партии, сохранение, уведомления.
// =============================================================================

import { el, mount, clear, modal, btn } from './dom.js';
import * as S from '../engine/state.js';
import { DOMAINS, ERAS, eraOf, ROMAN_ERA } from './shared.js';
import { renderTitle } from './screens/title.js';
import { renderHub, HUB_TABS } from './screens/hub.js';
import { renderBattle } from './screens/battle.js';
import { renderHelp } from './screens/help.js';

export const app = {
  state: null,
  screen: 'title',
  tab: 'map',
  battle: null,
  battleCtx: null,
  root: null,
  topbar: null,
  tabs: null,
  view: null,
  toasts: null,
  autoBattle: false,
};

export function boot() {
  app.root = document.getElementById('app');
  app.toasts = document.getElementById('toasts');
  const saved = S.loadSaved();
  if (saved) {
    try {
      app.state = saved;
      app.screen = 'hub';
      app.tab = 'map';
    } catch { app.state = null; }
  }
  render();
}

export function render() {
  if (!app.root) return;
  clear(app.root);
  if (app.screen === 'title') { mount(app.root, renderTitle()); return; }
  if (app.screen === 'battle' && app.battle) { mount(app.root, renderBattle()); return; }

  app.topbar = el('header', { class: 'topbar' });
  app.tabs = el('nav', { class: 'tabs' });
  app.view = el('main', { class: 'view' });
  mount(app.root, app.topbar, app.tabs, app.view);
  renderTopbar(app.topbar);
  renderTabs(app.tabs);
  mount(app.view, renderHub());
}

/** Перерисовать только содержимое (без пересоздания шапки). */
export function refresh() {
  if (app.screen === 'hub') {
    renderTopbar(app.topbar);
    renderTabs(app.tabs);
    mount(app.view, renderHub());
  } else {
    render();
  }
}

export function renderTopbar(node) {
  if (!node || !app.state) return;
  const st = app.state;
  const e = eraOf(st.era);
  mount(node,
    el('div', { class: 'topbar__id' }, [
      el('div', { class: 'topbar__civ', text: st.civName }),
      el('div', { class: 'topbar__era' }, [
        el('span', { class: 'era-badge', style: { background: DOMAINS[st.legacy].color }, text: `${ROMAN_ERA[st.era]} · ${e.name}` }),
      ]),
    ]),
    el('div', { class: 'topbar__res' }, [
      resChip('🔬', 'Наука', st.science, `Доход за ход: +${S.ECONOMY.income(st).science}`),
      resChip('🧱', 'Материалы', st.materials, `Доход за ход: +${S.ECONOMY.income(st).materials}`),
      resChip('🚩', 'Регионы', `${st.conquered}/${st.world.regions.length}`, 'Присоединённые земли дают доход'),
      resChip('⚔', 'Побед', `${st.stats.wins}/${st.stats.battles}`, `Проектов ${Object.keys(st.blueprints).length}, юнитов ${st.roster.length}`),
    ]),
    el('div', { class: 'topbar__act' }, [
      btn('🏗 Развитие', () => { S.develop(st); persist(); toast(`+${S.ECONOMY.income(st, S.ECONOMY.developShare).science}🔬 +${S.ECONOMY.income(st, S.ECONOMY.developShare).materials}🧱`, 'ok'); refresh(); }, '', { title: 'Мирный ход: доход без боя' }),
      btn('📖 Правила', () => modal('Правила и словарь', renderHelp())),
      btn('💾', () => { persist(); toast('Сохранено', 'ok'); }, '', { title: 'Сохранить' }),
      btn('☰', () => menuModal()),
    ]),
  );
}

function resChip(icon, label, value, title) {
  const node = el('div', { class: 'res' }, [
    el('span', { class: 'res__i', text: icon }),
    el('span', { class: 'res__v', text: String(value) }),
    el('span', { class: 'res__l', text: label }),
  ]);
  node.title = title || '';
  return node;
}

export function renderTabs(node) {
  if (!node) return;
  clear(node);
  for (const t of HUB_TABS) {
    node.append(el('button', {
      class: `tab${app.tab === t.id ? ' tab--on' : ''}`,
      onclick: () => { app.tab = t.id; refresh(); },
    }, [el('span', { class: 'tab__i', text: t.icon }), el('span', { text: t.label })]));
  }
}

export function menuModal() {
  const body = el('div', { class: 'stack' }, [
    el('p', {}, 'Партия сохраняется в этом браузере автоматически после каждого действия.'),
    el('div', { class: 'row' }, [
      btn('💾 Сохранить', () => { persist(); toast('Сохранено', 'ok'); }),
      btn('📤 Экспорт JSON', () => exportSave()),
      btn('📥 Импорт JSON', () => importSave()),
      btn('🔥 В главное меню', () => { app.screen = 'title'; closeModal(); render(); }, 'danger'),
      btn('♻ Начать заново', () => {
        if (confirm('Удалить текущую партию и начать новую?')) { S.clearSaved(); app.state = null; app.screen = 'title'; closeModal(); render(); }
      }, 'danger'),
    ]),
    el('div', { class: 'small dim' }, `Сид партии: ${app.state?.seed} · сложность ${app.state?.difficulty} · ходов ${app.state?.stats.turns}`),
  ]);
  const m = modal('Меню', body);
  function closeModal() { m.close(); }
}

function exportSave() {
  const blob = new Blob([S.serialize(app.state)], { type: 'application/json' });
  const a = el('a', { href: URL.createObjectURL(blob), download: `gears-of-ages-${app.state.seed}.json` });
  document.body.append(a); a.click(); a.remove();
}

function importSave() {
  const inp = el('input', { type: 'file', accept: '.json,application/json' });
  inp.addEventListener('change', async () => {
    const f = inp.files?.[0];
    if (!f) return;
    try {
      const text = await f.text();
      const parsed = JSON.parse(text);
      if (!parsed || parsed.v !== 1) throw new Error('неверный формат');
      app.state = parsed; app.screen = 'hub'; app.tab = 'map'; persist(); render();
      toast('Партия загружена', 'ok');
    } catch (e) { toast('Не удалось импортировать: ' + e.message, 'bad'); }
  });
  inp.click();
}

export function persist() {
  if (app.state) S.save(app.state);
}

export function toast(text, kind = 'info', ms = 2600) {
  if (!app.toasts) return;
  const t = el('div', { class: `toast toast--${kind}`, text });
  app.toasts.append(t);
  requestAnimationFrame(() => t.classList.add('is-on'));
  setTimeout(() => { t.classList.remove('is-on'); setTimeout(() => t.remove(), 320); }, ms);
}

/** Показать последние сообщения партии. */
export function lastMessages(n = 6) {
  return (app.state?.messages || []).slice(0, n);
}

export { S, ERAS };
