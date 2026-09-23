/**
 * Дымовой прогон интерфейса в jsdom.
 *
 * Тесты движка проверяют правила; этот прогон проверяет, что интерфейс вообще
 * кликабелен: экраны не падают, кнопки ведут туда, куда обещают, и после
 * каждого клика соблюдаются инварианты забега (модули не размножаются, трюм не
 * лопается). Клики настоящие — dispatchEvent по DOM, а не вызовы функций.
 *
 * Запуск: node tools/smoke.mjs [число_забегов]
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

const dom = new JSDOM(html, { pretendToBeVisual: true, url: 'http://localhost/' });
const { window } = dom;

/**
 * Часть глобальных свойств Node отдаёт только через геттер (navigator), поэтому
 * присваивание может молча не сработать — пишем через defineProperty.
 */
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
const { CARGO_LIMIT, MAX_FLEET, cargoSpace } = await import('../src/engine/run.js');
const { unitsOf, aliveUnits, shotPreview } = await import('../src/engine/combat.js');
const { rollModule } = await import('../src/engine/modules.js');
const { makeRng } = await import('../src/engine/rng.js');
const { SAVE_KEY } = await import('../src/engine/save.js');
const { pct } = await import('../src/ui/dom.js');

// ---------------------------------------------------------------------------

const problems = [];
const clicks = { total: 0, byScreen: {} };
let checks = 0;

function ok(cond, text) {
  checks++;
  if (!cond) problems.push(text);
}

function screen() { return document.getElementById('screen'); }

function enabledButtons() {
  return [...screen().querySelectorAll('button')].filter((b) => !b.disabled);
}

function byText(re) {
  return enabledButtons().find((b) => re.test(b.textContent || '')) || null;
}

function click(el, why) {
  if (!el) { problems.push(`некого кликнуть: ${why}`); return false; }
  clicks.total++;
  clicks.byScreen[state.screen] = (clicks.byScreen[state.screen] || 0) + 1;
  el.dispatchEvent(new window.Event('click', { bubbles: true }));
  return true;
}

/** Инварианты, которые обязаны держаться после ЛЮБОГО клика. */
function invariants() {
  const run = state.run;
  if (!run) return;
  noJunk(state.screen);
  const all = [];
  let slots = 0;
  for (const s of run.fleet) {
    const list = slotList(s);
    slots += list.length;
    for (const sl of list) if (s.installed[sl.id]) all.push(s.installed[sl.id]);
    all.push(...s.cargo);
  }
  const uids = new Set(all.map((m) => m.uid));
  ok(uids.size === all.length, `модули размножились: ${all.length} штук, уникальных ${uids.size}`);
  ok(all.length <= slots + CARGO_LIMIT, `бюджет модулей превышен: ${all.length} > ${slots} слотов + ${CARGO_LIMIT} трюм`);
  ok(run.fleet.length <= MAX_FLEET, `флот больше предела: ${run.fleet.length} > ${MAX_FLEET}`);
  ok(cargoSpace(run) >= 0, `трюм ушёл в минус: ${cargoSpace(run)}`);
  // Прочность корабля синхронизирована с его юнитом, поэтому внутри боя ноль —
  // законное состояние погибшего корабля. Вне боя ноль означал бы, что флот
  // оставили небоеспособным: чинят победа, доки и аварийный ремонт после поражения.
  if (!state.battle) {
    for (const s of run.fleet) {
      ok(s.hull > 0, `корабль ${s.name} с нулевой прочностью вне боя [экран ${state.screen}]`
        + (process.env.SMOKE_DEBUG ? ` · лог: ${run.log.slice(-4).map((e) => e.text).join(' // ')}` : ''));
    }
  }
  ok(run.parts >= 0, `запчасти ушли в минус: ${run.parts}`);
}

/** Экран не должен показывать запасную карточку «Экран не собрался». */
function noCrash(where) {
  const t = screen().textContent || '';
  if (t.includes('Экран не собрался')) {
    const lines = [...screen().querySelectorAll('p')].map((p) => p.textContent).filter(Boolean);
    problems.push(`экран упал (${where}): ${lines.slice(0, 2).join(' | ')}`);
    return;
  }
  noJunk(where);
}

/**
 * Ни одного служебного слова на экране.
 *
 * «undefined», «NaN» и «[object Object]» — это то, чем интерфейс расплачивается
 * за пропущенное поле или неверный формат числа. Глазом такие места ищутся долго,
 * а ловятся одной проверкой текста.
 */
const JUNK = /undefined|NaN|\[object [A-Za-z]+\]|\$\{/;
function noJunk(where) {
  // смотрим не только на экран: строка состояния и журнал всегда на виду
  for (const id of ['statusbar', 'logpanel']) {
    const panel = document.getElementById(id);
    const m2 = panel && !panel.hidden ? (panel.textContent || '').match(JUNK) : null;
    if (m2) problems.push(`в панели «${id}» служебный текст «${m2[0]}» (экран ${where})`);
  }
  const t = screen().textContent || '';
  const m = t.match(JUNK);
  if (m) {
    const at = Math.max(0, m.index - 60);
    problems.push(`на экране «${where}» служебный текст «${m[0]}»: …${t.slice(at, m.index + 70).replace(/\s+/g, ' ')}…`);
  }
}

// ---------------------------------------------------------------------------
//  Фаза А: автоматический прогон забега кликами
// ---------------------------------------------------------------------------

const STUCK_LIMIT = 12;

/**
 * Пропустить кадр.
 *
 * Часть интерфейса дорисовывается в следующем кадре: элемент сначала собирается
 * вне документа, а измерить позиции узлов можно только после вставки. Клики в
 * прогоне идут подряд, поэтому без уступки событию проверка рисовалась бы
 * раньше, чем экран успевал отрисоваться.
 */
const tick = () => new Promise((resolve) => setTimeout(resolve, 0));

async function playRun(seed) {
  app.go('title');
  // стартуем с заставки: вводим зерно и жмём «В поход»
  const inputs = [...document.querySelectorAll('#screen input')];
  const seedInput = inputs.find((i) => (i.getAttribute('aria-label') || i.placeholder || '').includes('ерно')) || inputs[inputs.length - 1];
  if (seedInput) { seedInput.value = seed; seedInput.dispatchEvent(new window.Event('input', { bubbles: true })); }
  const hullCards = [...document.querySelectorAll('#screen .hull-card')];
  if (hullCards.length) click(hullCards[seed.length % hullCards.length], 'выбор корпуса');
  ok(state.screen === 'title', 'заставка не открылась');
  if (!click(byText(/В поход/), 'кнопка «В поход» на заставке')) return null;
  ok(state.screen === 'map', `после «В поход» открылся ${state.screen}, а не карта`);

  let step = 0;
  let stuck = 0;
  let lastScreen = '';
  let subStep = 0;

  while (state.screen !== 'over' && step < 900) {
    step++;
    await tick();
    noCrash(`шаг ${step}, экран ${state.screen}`);
    invariants();

    if (state.screen === lastScreen) subStep++; else { subStep = 0; lastScreen = state.screen; }
    if (subStep > STUCK_LIMIT) { problems.push(`экран ${state.screen} не отпускает: ${subStep} кликов без перехода (шаг ${step})`); break; }

    const before = state.screen;
    if (!actOnScreen(state.screen, step)) break;
    if (state.screen === before) stuck++; else stuck = 0;
    if (stuck > 25) { problems.push(`забег застрял на ${before}: ${stuck} кликов подряд без смены экрана`); break; }
  }

  noCrash('финал');
  invariants();
  return { step, over: state.screen === 'over', win: state.run && state.run.over ? state.run.over.win : null, cleared: state.run ? state.run.clearedTotal : 0, lives: state.run ? state.run.lives : 0 };
}

/**
 * Связи узлов карты.
 *
 * Линии рисуются по измеренным позициям узлов, а jsdom не раскладывает элементы:
 * все прямоугольники у него нулевые, поэтому честная проверка числа линий
 * возможна только там, где есть настоящая раскладка. Здесь проверяем то, что
 * проверяется без браузера: слой для линий на месте, у каждого узла есть
 * идентификатор, по которому линии ищут узлы, и сам граф связен.
 */
function checkMapEdges() {
  const canvas = document.querySelector('#screen .map__canvas');
  ok(Boolean(canvas), 'на карте нет слоя с узлами');
  if (!canvas) return;
  ok(Boolean(canvas.querySelector('svg.map__edges')), 'на карте нет слоя для линий связей');
  const nodes = [...canvas.querySelectorAll('.node')];
  ok(nodes.length > 0, 'на карте нет ни одного узла');
  ok(nodes.every((n) => n.dataset.node), 'у узла карты нет идентификатора: линия не найдёт его');
  const hasLayout = canvas.getBoundingClientRect().width > 0;
  if (hasLayout) {
    ok(canvas.querySelectorAll('svg line').length > 0, 'раскладка есть, а связи не нарисованы');
  } else {
    // без раскладки проверяем граф напрямую: у каждого узла должны быть выходы
    const edges = state.run.map.nodes.reduce((a, n) => a + (n.edges || []).length, 0);
    ok(edges >= nodes.length - 1, `граф карты разрежен: рёбер ${edges} при ${nodes.length} узлах`);
    const ids = new Set(state.run.map.nodes.map((n) => n.id));
    ok(state.run.map.nodes.every((n) => (n.edges || []).every((e) => ids.has(e))), 'ребро карты ведёт в несуществующий узел');
  }
}

function actOnScreen(name, step) {
  switch (name) {
    case 'map': {
      checkMapEdges();
      const node = document.querySelector('#screen .node--available');
      if (!node) {
        // доступных узлов нет — это тупик, интерфейс должен был дать выход
        problems.push('на карте нет доступных узлов, а забег не окончен');
        return false;
      }
      return click(node, 'узел карты');
    }
    case 'battle':
      return click(byText(/Автобой до конца/) || byText(/Довести бой/) || byText(/Снять трофеи|Продолжить/), 'бой');
    case 'loot': {
      // берём пару модулей кликом по карточкам, потом «Взять»
      const cards = [...document.querySelectorAll('#screen .module--selectable')];
      const picked = document.querySelectorAll('#screen .module--picked').length;
      if (cards.length && picked < Math.min(2, cards.length) && step % 2 === 0) return click(cards[picked], 'карточка трофея');
      const capture = byText(/Отбуксировать во флот/);
      if (capture && step % 3 === 0 && state.run.fleet.length < MAX_FLEET) return click(capture, 'захват корпуса');
      return click(byText(/^Взять$/) || byText(/Оставить всё|К карте/), 'трофеи');
    }
    case 'event':
      return click(enabledButtons()[0], 'вариант аномалии');
    case 'shipyard':
      return click(byText(/К карте/), 'выход с верфи');
    case 'over':
      return false;
    default:
      problems.push(`неизвестный экран: ${name}`);
      return false;
  }
}

// ---------------------------------------------------------------------------
//  Фаза Б: верфь — установка, заточка, переработка
// ---------------------------------------------------------------------------

function playShipyard() {
  app.go('title');
  click(byText(/В поход/), 'старт забега для проверки верфи');
  ok(state.screen === 'map', 'карта не открылась перед верфью');

  click(byText(/⚒ Верфь/), 'кнопка «Верфь» на карте');
  ok(state.screen === 'shipyard', `верфь не открылась: ${state.screen}`);
  noCrash('верфь');

  // Стартовый корабль приходит с полупустым трюмом: чтобы проверить установку,
  // кладём в трюм модуль того типа, под который на корабле есть слот.
  if (!countCargo()) {
    const ship = state.run.fleet[0];
    const list = slotList(ship);
    const free = list.filter((sl) => !ship.installed[sl.id]);
    const slotType = (free.length ? free[0] : list[0]).slot;
    ship.cargo.push(rollModule(makeRng('дым-верфь'), { slot: slotType, rarity: 'standard' }));
    app.render();
  }

  const installedBefore = countInstalled();
  const cargoBefore = countCargo();

  // 1. установка из трюма в подсвеченный слот
  const install = byText(/^Поставить$/);
  ok(Boolean(install), 'на верфи нет кнопки «Поставить»: панель трюма не собралась');
  if (install) {
    click(install, 'кнопка «Поставить» у модуля в трюме');
    const slotBtn = byText(/Поставить сюда|Заменить/);
    ok(Boolean(slotBtn), 'после «Поставить» не появился ни один слот того же типа');
    if (slotBtn) {
      // замена возвращает прежний модуль в трюм, поэтому ожидания разные
      const replacing = /Заменить/.test(slotBtn.textContent || '');
      click(slotBtn, 'слот для установки');
      const wantInstalled = installedBefore + (replacing ? 0 : 1);
      const wantCargo = cargoBefore - 1 + (replacing ? 1 : 0);
      ok(countInstalled() === wantInstalled, `занятых слотов: ${installedBefore} → ${countInstalled()}, ждали ${wantInstalled}`);
      ok(countCargo() === wantCargo, `модулей в трюме: ${cargoBefore} → ${countCargo()}, ждали ${wantCargo}`);
      ok(allUidsUnique(), 'установка оставила копию модуля');
    }
    invariants();
  }

  // 2. снятие установленного модуля обратно в трюм
  const installedAfterSet = countInstalled();
  const remove = byText(/^Снять$/);
  if (remove) {
    click(remove, 'кнопка «Снять»');
    ok(countInstalled() === installedAfterSet - 1, 'снятие не освободило слот');
    invariants();
  }

  // 3. заточка: тратит запчасти и меняет уровень
  state.run.parts = 500;
  app.render();
  const enchants = enabledButtons().filter((b) => /^Точить$/.test(b.textContent || ''));
  ok(enchants.length > 0, 'на верфи нет доступной заточки при 500 запчастей');
  if (enchants.length) {
    const partsBefore = state.run.parts;
    const lvlBefore = allModules().map((m) => m.enchant || 0).reduce((a, b) => a + b, 0);
    click(enchants[0], 'заточка');
    ok(state.run.parts < partsBefore, `заточка не списала запчасти: ${partsBefore} → ${state.run.parts}`);
    const lvlAfter = allModules().map((m) => m.enchant || 0).reduce((a, b) => a + b, 0);
    ok(lvlAfter !== lvlBefore, 'заточка не изменила ни один уровень');
    invariants();
  }

  // 4. переработка: модуль исчезает, запчасти приходят
  const totalBefore = allModules().length;
  const partsBefore = state.run.parts;
  const salvage = byText(/В запчасти/);
  if (salvage) {
    click(salvage, 'переработка');
    ok(allModules().length === totalBefore - 1, 'переработка не удалила модуль из флота');
    ok(state.run.parts > partsBefore, 'переработка не дала запчастей');
    invariants();
  } else problems.push('нет кнопки «В запчасти»');

  // 5. таблица характеристик: множители перемножаются и подписаны именами модулей
  const all = byText(/Все \d+/);
  if (all) { click(all, 'полная таблица характеристик'); noCrash('таблица характеристик'); }
  const terms = [...document.querySelectorAll('#screen .chain__term')];
  ok(terms.length > 0, 'в таблице характеристик нет ни одного множителя — цепочка не видна');
  const labelled = terms.filter((t) => t.querySelector('.chain__label'));
  ok(labelled.length > 0, 'множители не подписаны именами модулей');
  ok(terms.some((t) => t.classList.contains('chain__term--down')) || terms.every((t) => t.classList.contains('chain__term--up')),
    'множитель не различается цветом: × и ÷ выглядят одинаково');
  const eqs = [...document.querySelectorAll('#screen .chain__eq')];
  ok(eqs.length > 0, 'в цепочке не показан итог (= число)');
  if (eqs.length) {
    // итог цепочки обязан совпадать с числом в соседней колонке той же строки
    const row = eqs[0].closest('tr');
    const value = row.querySelector('td.value').textContent.trim();
    ok(eqs[0].textContent.replace(/^=\s*/, '').trim() === value,
      `итог цепочки ${eqs[0].textContent} не совпал с колонкой «Итог» ${value}`);
  }

  // 6. выход
  click(byText(/К карте/), 'выход с верфи на карту');
  ok(state.screen === 'map', `выход с верфи привёл на ${state.screen}`);
}

function allUidsUnique() {
  const list = allModules();
  return new Set(list.map((m) => m.uid)).size === list.length;
}
function allModules() {
  const out = [];
  for (const s of state.run.fleet) {
    for (const sl of slotList(s)) if (s.installed[sl.id]) out.push(s.installed[sl.id]);
    out.push(...s.cargo);
  }
  return out;
}
function countInstalled() {
  return state.run.fleet.reduce((a, s) => a + slotList(s).filter((sl) => s.installed[sl.id]).length, 0);
}
function countCargo() {
  return state.run.fleet.reduce((a, s) => a + s.cargo.length, 0);
}

// ---------------------------------------------------------------------------
//  Фаза В: сохранение через кнопки интерфейса
// ---------------------------------------------------------------------------

function playSave() {
  app.go('map');
  const parts = state.run.parts;
  const lives = state.run.lives;
  const seed = state.run.seed;

  click(byText(/Сохранить/), 'кнопка «Сохранить» на карте');
  ok(Boolean(window.localStorage.getItem(SAVE_KEY)), 'сохранение не записалось в localStorage');
  ok(app.hasSave(), 'hasSave() не видит свежее сохранение');

  app.go('title');
  const cont = byText(/Продолжить/);
  ok(Boolean(cont), 'на заставке нет кнопки «Продолжить» после сохранения');
  if (!cont) return;

  // портим состояние в памяти: восстановиться оно обязано именно из хранилища
  state.run.parts = 1;
  state.run.lives = 1;
  click(cont, '«Продолжить» с заставки');
  ok(state.screen === 'map', `«Продолжить» привело на ${state.screen}`);
  ok(state.run.parts === parts, `запчасти после загрузки: ${state.run.parts}, было ${parts}`);
  ok(state.run.lives === lives, `жизни после загрузки: ${state.run.lives}, было ${lives}`);
  ok(state.run.seed === seed, `зерно после загрузки: ${state.run.seed}, было ${seed}`);
  invariants();

  // новый забег стирает прежнее сохранение: иначе «Продолжить» вернул бы чужой забег
  app.newGame({ seed: 'другое-зерно', hullKey: 'corvette', shipName: 'Другой' });
  ok(state.screen === 'map', 'новый забег не начался с карты');
  app.go('title');
  ok(!byText(/Продолжить/), 'после нового забега «Продолжить» всё ещё предлагает старый');
}

// ---------------------------------------------------------------------------
//  Фаза Г: предпросмотр залпа обязан совпадать с расчётом движка
// ---------------------------------------------------------------------------

/**
 * Главное обещание игры — «ни одного спрятанного числа». Проверяем его в лоб:
 * берём с экрана боя показанный шанс и формулу и сравниваем с тем, что на тех
 * же данных считает shotPreview. Заодно убеждаемся, что предпросмотр не делает
 * бросков: счётчики боя не двигаются.
 */
function playTransparency() {
  app.go('title');
  click(byText(/В поход/), 'старт забега для проверки предпросмотра');

  let guard = 0;
  while (state.screen !== 'battle' && guard++ < 60) {
    switch (state.screen) {
      case 'map': {
        const node = document.querySelector('#screen .node--available');
        if (!node) { problems.push('карта кончилась раньше первого боя'); return; }
        click(node, 'узел в поиске боя');
        break;
      }
      case 'event': click(enabledButtons()[0], 'аномалия по дороге к бою'); break;
      case 'shipyard': click(byText(/К карте/), 'выход с верфи'); break;
      case 'loot': click(byText(/Оставить всё|К карте/), 'пропуск трофеев'); break;
      default: problems.push(`неожиданный экран по дороге к бою: ${state.screen}`); return;
    }
  }
  ok(state.screen === 'battle', 'до боя дойти не удалось');
  if (state.screen !== 'battle') return;

  const b = state.battle;
  const acting = document.querySelector('#screen .unit--acting');
  ok(Boolean(acting), 'на экране боя не помечен корабль, который ходит');
  if (!acting) return;

  const name = acting.querySelector('.ship-card__name').textContent;
  const actor = unitsOf(b, 'mine').find((u) => u.name === name && u.alive);
  ok(Boolean(actor), `ходящий «${name}» не найден среди кораблей движка`);
  const target = aliveUnits(b, 'foes')[0];
  ok(Boolean(target), 'у движка нет живой цели, а экран показывает предпросмотр');
  if (!actor || !target) return;

  const rows = [...document.querySelectorAll('#screen .chance')].map((el) => ({
    name: el.querySelector('.chance__name').textContent,
    formula: el.querySelector('.chance__formula').textContent,
    value: el.querySelector('.chance__value').textContent,
  }));
  ok(rows.length >= 3, `в предпросмотре всего ${rows.length} строк: игрок не видит всей цепочки`);

  const frozen = { shots: b.shots, action: b.action, log: b.log.length, hulls: unitsOf(b, 'mine').concat(unitsOf(b, 'foes')).map((u) => Math.round(u.hull)).join(',') };
  const preview = shotPreview(b, actor, target);
  const after = { shots: b.shots, action: b.action, log: b.log.length, hulls: unitsOf(b, 'mine').concat(unitsOf(b, 'foes')).map((u) => Math.round(u.hull)).join(',') };
  ok(JSON.stringify(frozen) === JSON.stringify(after), 'предпросмотр изменил бой: он обязан только показывать');

  const row = (label) => rows.find((r) => r.name === label);
  const hit = row('Попадание');
  ok(Boolean(hit), 'нет строки «Попадание»');
  if (hit) {
    ok(hit.value === pct(preview.hit.p, 1), `попадание на экране ${hit.value}, движок считает ${pct(preview.hit.p, 1)}`);
    ok(hit.formula.includes('50%'), `в формуле попадания не видна база 50%: «${hit.formula}»`);
  }
  const crit = row('Крит');
  ok(crit && crit.value === pct(preview.crit.p, 1), `крит на экране ${crit ? crit.value : 'нет'}, движок считает ${pct(preview.crit.p, 1)}`);
  if (preview.absorb) {
    const abs = row('Щит поглотит');
    ok(abs && abs.value === pct(preview.absorb.p, 1), `поглощение щитом на экране ${abs ? abs.value : 'нет'}, движок считает ${pct(preview.absorb.p, 1)}`);
  }
  for (const st of preview.statuses) {
    const r = row(st.name);
    ok(Boolean(r), `свойство «${st.name}» не показано в предпросмотре`);
    if (r) {
      ok(r.value === (st.blocked ? '—' : pct(st.chance.p, 1)), `шанс «${st.name}» на экране ${r.value}, движок считает ${st.blocked ? '—' : pct(st.chance.p, 1)}`);
      if (st.blocked) ok(/невосприимчив/.test(r.formula), `для «${st.name}» не сказано, почему шанс не действует`);
    }
  }
  // очередь хода видна до выстрела: игрок знает, кто пойдёт следующим
  ok(document.querySelectorAll('#screen .queue__item').length > 0, 'не показана очередь ходов');
}

// ---------------------------------------------------------------------------

const runs = Number(process.argv[2] || 3);
const results = [];
const seeds = ['дым-один', 'дым-два', 'дым-три', 'дым-четыре', 'дым-пять'];
const phases = [];
async function phase(name, fn) {
  const before = { checks, clicks: clicks.total, problems: problems.length };
  await fn();
  phases.push({ name, checks: checks - before.checks, clicks: clicks.total - before.clicks, problems: problems.length - before.problems });
}
for (let i = 0; i < runs; i++) {
  const seed = seeds[i % seeds.length] + (i >= seeds.length ? `-${i}` : '');
  let res = null;
  await phase(`забег «${seed}»`, async () => { res = await playRun(seed); });
  results.push(res);
}
await phase('верфь', playShipyard);
await phase('сохранение', playSave);
await phase('предпросмотр залпа', playTransparency);

const finished = results.filter((r) => r && r.over);
console.log(`\nзабегов сыграно: ${results.length} · дошло до конца: ${finished.length} · побед: ${finished.filter((r) => r.win).length}`);
console.log('\nфазы:');
for (const ph of phases) console.log(`  ${ph.name}: кликов ${ph.clicks}, проверок ${ph.checks}, провалов ${ph.problems}`);
for (const [s, n] of Object.entries(clicks.byScreen)) console.log(`  кликов на «${s}»: ${n}`);
console.log(`всего кликов: ${clicks.total} · проверок: ${checks}`);

if (problems.length) {
  console.log(`\nПРОВАЛ: ${problems.length}`);
  const seen = new Set();
  for (const p of problems) { if (seen.has(p)) continue; seen.add(p); console.log('  · ' + p); }
  process.exit(1);
}
console.log('\nдымовой прогон интерфейса прошёл без единой поломки');
