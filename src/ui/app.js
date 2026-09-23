// =============================================================================
//  ШЕСТЕРНИ ЭПОХ — ui/app.js
//  Контроллер приложения: экраны, состояние партии, сохранение, уведомления.
// =============================================================================

import { el, mount, clear, modal, btn } from './dom.js';
import { delta, confirmBox } from './fx.js';
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
  app.view = el('main', { class: 'view', id: 'view', tabindex: '-1' });
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

/** Прошлые значения ресурсов — чтобы рисовать «+24 🔬» при изменении. */
let lastRes = null;

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
      resChip('🔬', 'Наука', st.science, `Доход за ход: +${S.ECONOMY.income(st).science}`, 'science'),
      resChip('🧱', 'Материалы', st.materials, `Доход за ход: +${S.ECONOMY.income(st).materials}`, 'materials'),
      resChip('🚩', 'Регионы', `${st.conquered}/${st.world.regions.length}`, 'Присоединённые земли дают доход', 'regions'),
      resChip('⚔', 'Побед', `${st.stats.wins}/${st.stats.battles}`, `Проектов ${Object.keys(st.blueprints).length}, юнитов ${st.roster.length}`, 'wins'),
    ]),
    el('div', { class: 'topbar__act' }, [
      btn('🏗 Развитие', () => { S.develop(st); persist(); toast(`+${S.ECONOMY.income(st, S.ECONOMY.developShare).science}🔬 +${S.ECONOMY.income(st, S.ECONOMY.developShare).materials}🧱`, 'ok'); refresh(); }, '', { title: 'Мирный ход: доход без боя' }),
      btn('📖 Правила', () => modal('Правила и словарь', renderHelp())),
      btn('💾', () => { persist(); toast('Сохранено', 'ok'); }, '', { title: 'Сохранить' }),
      btn('☰', () => menuModal(), '', { title: 'Меню партии', aria: 'Меню партии' }),
    ]),
  );
  lastRes = {
    science: st.science, materials: st.materials,
    regions: st.conquered, wins: st.stats.wins,
  };
}

function resChip(icon, label, value, title, key) {
  const node = el('div', { class: 'res', dataset: { res: key } }, [
    el('span', { class: 'res__i', text: icon }),
    el('span', { class: 'res__v', text: String(value) }),
    el('span', { class: 'res__l', text: label }),
  ]);
  node.title = title || '';

  // Изменение ресурса показываем всплывающей дельтой: экономика становится
  // осязаемой, игрок видит ПРИЧИНУ изменения числа, а не только итог.
  const prev = lastRes ? lastRes[key] : null;
  const numeric = typeof value === 'number' ? value : parseInt(String(value), 10);
  if (prev !== null && Number.isFinite(numeric) && Number.isFinite(prev) && numeric !== prev) {
    node.classList.add('res--bump');
    setTimeout(() => node.classList.remove('res--bump'), 620);
    delta(node.querySelector('.res__v'), numeric - prev, key === 'science' ? ' 🔬' : key === 'materials' ? ' 🧱' : '');
  }
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
      btn('♻ Начать заново', async () => {
        const yes = await confirmBox({
          title: 'Начать заново?',
          text: `Партия «${app.state?.civName}» (эпоха ${app.state?.era}, регионов ${app.state?.conquered}) будет удалена безвозвратно. Экспортируйте JSON, если хотите её сохранить.`,
          ok: 'Удалить и начать', cancel: 'Отмена', danger: true,
        });
        if (!yes) return;
        S.clearSaved(); app.state = null; app.screen = 'title'; lastRes = null; closeModal(); render();
      }, 'danger'),
    ]),
    el('div', { class: 'small dim' }, `Сид партии: ${app.state?.seed} · сложность ${app.state?.difficulty} · ходов ${app.state?.stats.turns}`),
  ]);
  const m = modal('Меню', body);
  function closeModal() { m.close(); }
}

function exportSave() {
  const blob = new Blob([S.serialize(app.state)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = el('a', { href: url, download: `gears-of-ages-${app.state.seed}.json` });
  document.body.append(a); a.click(); a.remove();
  // объект живёт в памяти браузера, пока его не отозвать
  setTimeout(() => URL.revokeObjectURL(url), 4000);
  toast('Сохранение выгружено в файл', 'ok');
}

/**
 * Импорт партии. Файл выбирает игрок, поэтому содержимое непроверенное:
 * сначала парсим и валидируем, и только потом спрашиваем согласие и
 * подменяем текущую партию. Иначе один неверный клик по файлу уничтожил бы
 * текущий прогресс, а битый JSON уронил бы приложение уже после перезаписи.
 */
function importSave() {
  const inp = el('input', { type: 'file', accept: '.json,application/json' });
  inp.addEventListener('change', async () => {
    const f = inp.files?.[0];
    if (!f) return;
    let next;
    try {
      next = S.deserialize(await f.text());
    } catch (e) {
      toast('Не удалось импортировать: ' + e.message, 'bad', 4200);
      return;
    }
    const cur = app.state;
    const describe = (x) => `«${x.civName}» · эпоха ${ROMAN_ERA[x.era] || x.era} · регионов ${x.conquered} · ходов ${x.stats?.turns ?? 0}`;
    const yes = await confirmBox({
      title: 'Загрузить партию из файла?',
      text: cur
        ? `Текущая партия ${describe(cur)} будет заменена на ${describe(next)}. Действие нельзя отменить — если хотите сохранить текущую, сначала выгрузите её в JSON.`
        : `Будет загружена партия ${describe(next)}.`,
      ok: 'Загрузить', cancel: 'Отмена', danger: !!cur,
    });
    if (!yes) { toast('Импорт отменён — текущая партия не тронута', 'info'); return; }
    app.state = next; app.screen = 'hub'; app.tab = 'map';
    persist(); render();
    toast(`Партия ${describe(next)} загружена`, 'ok', 3600);
  });
  inp.click();
}

export function persist() {
  if (app.state) S.save(app.state);
}

const MAX_TOASTS = 4;
export function toast(text, kind = 'info', ms = 2600) {
  if (!app.toasts) return;
  // не даём стопке уведомлений захватить экран: старейшие убираем сразу
  while (app.toasts.children.length >= MAX_TOASTS) app.toasts.firstElementChild?.remove();
  const t = el('div', { class: `toast toast--${kind}`, text, role: kind === 'bad' ? 'alert' : 'status' });
  t.addEventListener('click', () => { t.classList.remove('is-on'); setTimeout(() => t.remove(), 200); });
  app.toasts.append(t);
  requestAnimationFrame(() => t.classList.add('is-on'));
  setTimeout(() => { t.classList.remove('is-on'); setTimeout(() => t.remove(), 320); }, ms);
}

/** Показать последние сообщения партии. */
export function lastMessages(n = 6) {
  return (app.state?.messages || []).slice(0, n);
}

export { S, ERAS };
