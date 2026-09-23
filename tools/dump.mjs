/**
 * Печатный дамп экранов.
 *
 * Браузера в песочнице нет, а вычитать интерфейс надо: этот инструмент проходит
 * забег в jsdom и печатает содержимое каждого экрана текстом — с классами,
 * подписями кнопок и состоянием «выключена». Так видны и опечатки в русском
 * тексте, и служебные «undefined», и числа, которые не сходятся с движком
 * (например «прочность 100 / 74» — корабль прочнее собственного потолка).
 *
 * Запуск:
 *   node tools/dump.mjs            — все экраны
 *   node tools/dump.mjs verfi boj  — только названные (title map battle loot shipyard event over)
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const dom = new JSDOM(html, { pretendToBeVisual: true, url: 'http://localhost/' });
const { window } = dom;

function expose(name, value) {
  Object.defineProperty(globalThis, name, { value, writable: true, configurable: true });
}
expose('window', window);
expose('document', window.document);
expose('Node', window.Node);
expose('Element', window.Element);
expose('HTMLElement', window.HTMLElement);
expose('Event', window.Event);
expose('navigator', window.navigator);
expose('localStorage', window.localStorage);
expose('getComputedStyle', window.getComputedStyle.bind(window));

const { app, state } = await import('../src/ui/app.js');
const { slotList } = await import('../src/engine/ship.js');
const { rollModule } = await import('../src/engine/modules.js');
const { makeRng } = await import('../src/engine/rng.js');
const { choices } = await import('../src/engine/run.js');
const { battleReport } = await import('../src/engine/combat.js');
const { autoBattle } = await import('../src/engine/ai.js');   // автобой живёт в ИИ, а не в правилах боя

const click = (el) => el && el.dispatchEvent(new window.Event('click', { bubbles: true }));
const first = (sel) => document.querySelector(sel);
const button = (re) => [...document.querySelectorAll('#screen button')].find((b) => !b.disabled && re.test(b.textContent || ''));

// ---------------------------------------------------------------------------

const INDENT = '  ';

/** Печать дерева экрана: структурные узлы — с отступом, текстовые — inline. */
function dump(label) {
  const el = first('#screen');
  console.log(`\n${'='.repeat(78)}\n### ${label}  [экран: ${state.screen}]\n${'='.repeat(78)}`);
  walk(el, 0);
  for (const id of ['statusbar', 'logpanel']) {
    const panel = document.getElementById(id);
    if (panel && !panel.hidden) console.log(`\n[${id}] ${panel.textContent.replace(/\s+/g, ' ').trim()}`);
  }
}

const STRUCTURAL = new Set(['button', 'table', 'tr', 'td', 'th', 'li', 'ul', 'details', 'summary', 'input', 'svg']);
const MARKED = /card|module|chance|ship-card|node|slot|chip|queue|stat|bar|field|hull-card|wreck|trophy|chain/;

function walk(node, depth) {
  if (node.nodeType === 3) {
    const t = node.textContent.replace(/\s+/g, ' ').trim();
    if (t) console.log(INDENT.repeat(depth) + t);
    return;
  }
  if (node.nodeType !== 1) return;
  const tag = node.tagName.toLowerCase();
  if (tag === 'svg') { console.log(INDENT.repeat(depth) + `[svg: линий ${node.querySelectorAll('line').length}]`); return; }
  if (tag === 'line') return;

  const cls = typeof node.className === 'string' && node.className.trim()
    ? '.' + node.className.trim().split(/\s+/).join('.')
    : '';
  const own = [...node.childNodes].filter((c) => c.nodeType === 3).map((c) => c.textContent.replace(/\s+/g, ' ').trim()).filter(Boolean).join(' ');
  const kids = [...node.childNodes].filter((c) => c.nodeType === 1);
  const structural = STRUCTURAL.has(tag) || MARKED.test(cls);

  if (structural) {
    const marks = [];
    if (node.disabled) marks.push('ВЫКЛЮЧЕНА');
    if (node.title) marks.push(`title="${node.title.slice(0, 70)}"`);
    if (tag === 'input') marks.push(`value="${node.value}"`);
    if (node.style && node.style.cssText) marks.push(`style="${node.style.cssText.slice(0, 60)}"`);
    console.log(`${INDENT.repeat(depth)}<${tag}${cls}>${marks.length ? ` [${marks.join(' · ')}]` : ''}${own ? ` ${own}` : ''}`);
    for (const k of kids) walk(k, depth + 1);
  } else {
    if (own) console.log(INDENT.repeat(depth) + own);
    for (const k of kids) walk(k, depth);
  }
}

// ---------------------------------------------------------------------------
//  Обход: довести забег до каждого экрана
// ---------------------------------------------------------------------------

function startRun(seed) {
  app.go('title');
  const inputs = [...document.querySelectorAll('#screen input')];
  const seedInput = inputs[inputs.length - 1];
  if (seedInput) { seedInput.value = seed; seedInput.dispatchEvent(new window.Event('input', { bubbles: true })); }
  click(button(/В поход/));
  if (state.screen !== 'map') throw new Error(`забег не стартовал: экран ${state.screen}`);
}

/** Шагать по карте, пока не встретим нужный экран. Побочные экраны закрываем. */
function seek(wanted, limit = 80) {
  for (let i = 0; i < limit && state.screen !== wanted; i++) {
    switch (state.screen) {
      case 'map': {
        const node = first('#screen .node--available');
        if (!node) return false;
        click(node);
        break;
      }
      case 'battle':
        if (wanted === 'battle') return true;
        autoBattle(state.battle, { maxActions: 400 });
        app.finishBattleUi(battleReport(state.battle, 'mine'));
        break;
      case 'loot':
        if (wanted === 'loot') return true;
        click(button(/Оставить всё|К карте/));
        break;
      case 'event':
        if (wanted === 'event') return true;
        click(first('#screen button'));
        click(button(/К карте/));
        break;
      case 'shipyard':
        if (wanted === 'shipyard') return true;
        click(button(/К карте/));
        break;
      case 'over':
        return false;
      default:
        return false;
    }
    if (state.screen === wanted) return true;
  }
  return state.screen === wanted;
}

const want = process.argv.slice(2);
const show = (name) => !want.length || want.some((w) => name.startsWith(w));

if (show('title')) { app.go('title'); dump('ЗАСТАВКА: выбор корпуса, зерно, правила'); }

startRun('дам-один');
if (show('map')) dump('КАРТА: старт забега, доступен нижний ряд');
if (show('battle') && seek('battle')) dump('БОЙ: очередь, предпросмотр залпа, отход');
if (show('shipyard')) {
  state.run.parts = 900;
  const ship = state.run.fleet[0];
  if (!ship.cargo.length) {
    const free = slotList(ship).filter((s) => !ship.installed[s.id]);
    ship.cargo.push(rollModule(makeRng('дам-трюм'), { slot: (free[0] || slotList(ship)[0]).slot, rarity: 'pristine' }));
  }
  app.openShipyard({ station: 'forge' });
  dump('ВЕРФЬ: слоты, цепочки множителей, трюм, покупка корпуса');
}
if (show('event')) {
  // Аномалия — узел редкий, дожидаться её на карте долго: ставим событие напрямую.
  if (!seek('event', 40)) {
    const { ANOMALIES } = await import('../src/engine/run.js');
    state.run.pendingAnomaly = { ...ANOMALIES[1], uid: 'дам-аномалия' };
    app.go('event');
  }
  dump('АНОМАЛИЯ: событие с выбором');
}
if (show('loot') && seek('loot')) dump('ТРОФЕИ: шанс и бросок каждого модуля');
if (show('over')) {
  state.run.lives = 0;
  const { checkRunOver, runSummary } = await import('../src/engine/run.js');
  checkRunOver(state.run);
  app.go('over', { summary: runSummary(state.run) });
  dump('ИТОГ ЗАБЕГА: счёт и финальный флот');
}

const texts = ['screen', 'statusbar', 'logpanel']
  .map((id) => document.getElementById(id))
  .filter((el) => el && !el.hidden)
  .map((el) => el.textContent || '')
  .join(' ');
const junk = texts.match(/undefined|NaN|\[object [A-Za-z]+\]/);
console.log(junk ? `\nВНИМАНИЕ: на экранах встретился служебный текст «${junk[0]}»` : '\nслужебного текста (undefined / NaN) на экранах нет');
