/**
 * Состояние игры и маршрутизатор экранов.
 *
 * Экраны ничего не знают друг о друге: каждый получает один контекст { app }
 * и возвращает элемент. Всё, что меняет забег, идёт через движок — интерфейс
 * не считает шансы и урон сам, иначе цифры на экране разошлись бы с боем.
 */

import { newRun, choices, enterNode, finishBattle, nextSector, runSummary, cargo, cargoSpace, flagship, drydockRepair, MAX_LIVES, CARGO_LIMIT } from '../engine/run.js';
import { computeStats, shipPower, HULLS } from '../engine/ship.js';
import { saveToStorage, loadFromStorage, peekSave, clearSave } from '../engine/save.js';
import { h, clear, pct, num } from './dom.js';

import { renderTitle } from './screens/title.js';
import { renderMap } from './screens/map.js';
import { renderBattle } from './screens/battle.js';
import { renderLoot } from './screens/loot.js';
import { renderShipyard } from './screens/shipyard.js';
import { renderEvent } from './screens/event.js';
import { renderOver } from './screens/over.js';

export const state = {
  run: null,
  screen: 'title',
  battle: null,          // активный бой (объект движка)
  battleUi: {},          // выбор цели и прочее, что не относится к забегу
  node: null,            // узел, в который вошли
  payload: null,         // данные экрана (итог боя, список трофеев и т. п.)
  shipTab: 0,            // выбранный корабль на верфи
};

const SCREENS = {
  title: renderTitle,
  map: renderMap,
  battle: renderBattle,
  loot: renderLoot,
  shipyard: renderShipyard,
  event: renderEvent,
  over: renderOver,
};

export const app = {
  state,
  go,
  render,
  toast,
  newGame,
  continueGame,
  saveGame,
  forgetSave,
  hasSave: () => Boolean(peekSave()),
  saveSummary: () => peekSave(),
  log,
  enterNodeUi,
  finishBattleUi,
  leaveLootAndAdvance,
  openShipyard,
};

// ---------------------------------------------------------------------------
//  Переходы
// ---------------------------------------------------------------------------

export function go(screen, payload = null) {
  state.screen = screen;
  state.payload = payload;
  render();
}

export function render() {
  const screenEl = document.getElementById('screen');
  const statusEl = document.getElementById('statusbar');
  const logEl = document.getElementById('logpanel');
  if (!screenEl) return;

  clear(screenEl);
  const view = SCREENS[state.screen] || renderTitle;
  let node;
  try {
    node = view({ app, state });
  } catch (err) {
    node = h('div', { class: 'card' },
      h('h2', { class: 'title-line bad', text: 'Экран не собрался' }),
      h('p', { class: 'hint', text: String(err && err.message ? err.message : err) }),
      h('p', { class: 'hint', text: 'Забег не потерян: сохранение можно загрузить с заставки.' }),
      h('button', { class: 'btn btn--primary', text: 'На заставку', on: { click: () => go('title') } }),
    );
  }
  screenEl.append(node);

  const inRun = Boolean(state.run) && state.screen !== 'title';
  statusEl.hidden = !inRun;
  logEl.hidden = !inRun;
  if (inRun) {
    clear(statusEl);
    // statusBar() возвращает СПИСОК элементов: append() без разворота принял бы
    // его за строку и напечатал «[object HTMLSpanElement],…» вместо цифр.
    statusEl.append(...statusBar());
    clear(document.getElementById('log-list'));
    document.getElementById('log-list').append(...logEntries());
  }
}

function statusBar() {
  const run = state.run;
  const ship = flagship(run);
  const stats = computeStats(ship, { plain: true }).stats;
  const hullShare = run.fleet.reduce((a, s) => a + s.hull / Math.max(1, computeStats(s, { plain: true }).stats.hull), 0) / Math.max(1, run.fleet.length);
  const used = CARGO_LIMIT - cargoSpace(run);

  return [
    h('span', { class: 'statusbar__title', text: 'Верфь на костях' }),
    h('span', { class: 'chip chip--lives' }, h('span', { class: 'chip__label', text: 'жизни' }), h('b', { text: '♥'.repeat(Math.max(0, run.lives)) + '♡'.repeat(Math.max(0, MAX_LIVES - run.lives)) })),
    h('span', { class: 'chip chip--parts' }, h('span', { class: 'chip__label', text: 'запчасти' }), h('b', { text: num(run.parts) })),
    h('span', { class: 'chip chip--sector' }, h('span', { class: 'chip__label', text: 'сектор' }), h('b', { text: `${run.sector} / 3` })),
    h('span', { class: 'chip' }, h('span', { class: 'chip__label', text: 'глубина' }), h('b', { text: `${run.depth}` })),
    h('span', { class: 'chip' }, h('span', { class: 'chip__label', text: 'флот' }), h('b', { text: `${run.fleet.length} × ${HULLS[ship.hullKey].name}` })),
    h('span', { class: 'chip' }, h('span', { class: 'chip__label', text: 'корпус' }), h('b', { text: pct(hullShare), style: { color: hullShare > 0.7 ? 'var(--green)' : hullShare > 0.4 ? 'var(--amber)' : 'var(--red)' } })),
    h('span', { class: 'chip' }, h('span', { class: 'chip__label', text: 'трюм' }), h('b', { text: `${used} / ${CARGO_LIMIT}` })),
    h('span', { class: 'chip' }, h('span', { class: 'chip__label', text: 'мощность' }), h('b', { text: num(shipPower(ship), 1) })),
    h('span', { class: 'chip' }, h('span', { class: 'chip__label', text: 'щит' }), h('b', { text: num(stats.shield) })),
    h('span', { class: 'statusbar__spacer' }),
    h('button', {
      class: 'btn btn--small btn--ghost',
      text: 'Верфь',
      disabled: state.screen === 'battle',
      title: 'Модули, заточка, переработка',
      on: { click: () => openShipyard() },
    }),
    h('button', {
      class: 'btn btn--small btn--ghost',
      text: 'Сохранить',
      disabled: state.screen === 'battle',
      title: state.screen === 'battle' ? 'В бою сохранение недоступно' : 'Записать забег в память браузера',
      on: { click: () => saveGame() },
    }),
  ];
}

function logEntries() {
  const run = state.run;
  if (!run) return [];
  // свежие сверху: игрок смотрит начало списка, а не листает вниз
  return run.log.slice(-120).reverse().map((e) => h('li', { class: e.kind || 'info', text: e.text }));
}

export function log(text, kind = 'info') {
  if (state.run) state.run.log.push({ text, kind });
  render();
}

// ---------------------------------------------------------------------------
//  Всплывающие сообщения
// ---------------------------------------------------------------------------

let toastTimer = null;
export function toast(text, kind = 'info', ms = 3200) {
  const box = document.getElementById('toasts');
  if (!box) return;
  const el = h('div', { class: `toast toast--${kind}`, text });
  box.append(el);
  window.setTimeout(() => el.remove(), ms);
  if (box.children.length > 4) box.firstChild.remove();
  clearTimeout(toastTimer);
}

// ---------------------------------------------------------------------------
//  Забег: начало, продолжение, сохранение
// ---------------------------------------------------------------------------

export function newGame({ seed, hullKey, shipName }) {
  const run = newRun({ seed, hullKey, shipName });
  state.run = run;
  state.battle = null;
  state.battleUi = {};
  state.shipTab = 0;
  state.node = null;
  clearSave();
  go('map');
  toast('Забег начат. Четыре жизни, три сектора.', 'good');
}

export function continueGame() {
  const loaded = loadFromStorage();
  if (!loaded.ok) { toast(loaded.reason, 'bad'); return false; }
  state.run = loaded.run;
  state.battle = null;
  state.battleUi = {};
  state.shipTab = 0;
  state.node = null;
  go('map');
  toast('Забег продолжен.', 'good');
  return true;
}

export function saveGame() {
  if (!state.run) return;
  if (state.screen === 'battle') { toast('В бою сохранение недоступно: сначала решите исход.', 'bad'); return; }
  const res = saveToStorage(state.run);
  toast(res.ok ? `Забег сохранён (${num(res.bytes / 1024, 1)} КБ).` : res.reason, res.ok ? 'good' : 'bad');
}

export function forgetSave() {
  clearSave();
  toast('Сохранение стёрто.', 'info');
  render();
}

// ---------------------------------------------------------------------------
//  Вход в узел и исход боя
// ---------------------------------------------------------------------------

/**
 * Войти в узел карты и открыть нужный экран.
 * Вся логика — в движке; здесь только разбор того, что он вернул.
 */
export function enterNodeUi(nodeId) {
  const run = state.run;
  const res = enterNode(run, nodeId);
  if (!res.ok) { toast(res.reason, 'bad'); return; }
  state.node = run.map.nodes.find((n) => n.id === nodeId) || null;

  switch (res.kind) {
    case 'travel':
      toast('Проход через зачищенный узел: бой не повторяется.', 'info');
      go('map');
      return;
    case 'battle':
      state.battle = res.battle;
      state.battleUi = { targetUid: null, auto: false };
      go('battle');
      return;
    case 'anomaly':
      go('event', { anomaly: res.anomaly });
      return;
    case 'forge':
      state.payload = { station: 'forge' };
      openShipyard({ station: 'forge' });
      return;
    case 'repair': {
      const out = drydockRepair(run);
      toast(out.ok ? `Доки: корпус восстановлен (+${out.healed}).` : out.reason, out.ok ? 'good' : 'info');
      openShipyard({ station: 'repair' });
      return;
    }
    default:
      go('map');
  }
}

/**
 * Разрешить бой и перейти к трофеям, карте или итогу.
 * @param {object} report отчёт battleReport
 */
export function finishBattleUi(report) {
  const run = state.run;
  const battle = state.battle;
  const out = finishBattle(run, battle, report);
  state.battle = null;
  state.battleUi = {};

  if (run.over) { go('over', { summary: runSummary(run) }); return out; }

  if (out.win) {
    go('loot', { outcome: out, boss: Boolean(out.boss) });
    return out;
  }
  // поражение или отход: жизнь цела при отходе, карта откатилась назад
  toast(out.retreated ? 'Флот отошёл: жизнь цела, узел не пройден.' : 'Поражение: потеряна жизнь.', out.retreated ? 'info' : 'bad');
  go('map');
  return out;
}

/** Победа над боссом: трофеи взяты, sector вперёд. */
export function leaveLootAndAdvance({ boss }) {
  const run = state.run;
  if (boss) {
    const nxt = nextSector(run);
    if (!nxt.ok) {
      if (run.over) { go('over', { summary: runSummary(run) }); return; }
      toast(nxt.reason, 'bad');
      go('map');
      return;
    }
    toast(`Сектор ${run.sector - 1} пройден. Флот входит в сектор ${run.sector}.`, 'good');
  }
  state.node = null;
  go('map');
}

export function openShipyard(opts = {}) {
  go('shipyard', { station: opts.station || state.payload?.station || null, back: opts.back || 'map' });
}

// ---------------------------------------------------------------------------
//  Старт
// ---------------------------------------------------------------------------

export function boot() {
  const app0 = document.getElementById('app');
  if (app0) app0.hidden = false;
  render();
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
}

export { choices, cargo, cargoSpace, computeStats, shipPower };
