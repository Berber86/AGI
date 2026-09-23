/**
 * Верфь: сборка корабля, заточка, переработка, покупка корпуса.
 *
 * Главное на этом экране — таблица характеристик с цепочкой множителей. Игрок
 * обязан видеть, что три модуля на точность не складываются, а перемножаются,
 * и где именно сборка уперлась в потолок 95%. Цепочки берёт explainStat из
 * движка: интерфейс не пересобирает формулы сам.
 */

import { computeStats, shipPower, slotList, hullSlots, installedModules, freeSlots, explainStat, statBase, HULLS, HULL_KEYS } from '../../engine/ship.js';
import { SLOTS, SPECIALS, moduleParts, enchantCost, enchantChance, canEnchant, moduleScore } from '../../engine/modules.js';
import { installModule, removeModule, salvageModule, enchantModuleRun, buyHull, hullPrice, cargo, cargoSpace, MAX_FLEET, CARGO_LIMIT, flagship } from '../../engine/run.js';
import { STATS, STAT_KEYS, CORE_KEYS } from '../../engine/stats.js';
import { h, num, pct, barEl, moduleEl, statsTable } from '../dom.js';

export function renderShipyard({ app, state }) {
  const run = state.run;
  const ui = state.shipyardUi = state.shipyardUi || { shipIndex: 0, installUid: null, showAllStats: false };
  const station = state.payload && state.payload.station;

  if (ui.shipIndex >= run.fleet.length) ui.shipIndex = 0;
  const ship = run.fleet[ui.shipIndex] || flagship(run);
  const computed = computeStats(ship);

  const root = h('div', { class: 'stack' });

  // --- шапка ---------------------------------------------------------------
  root.append(h('div', { class: 'card' },
    h('div', { class: 'row row--between' },
      h('div', {},
        h('h2', { class: 'title-line', text: station === 'forge' ? 'Верфь сектора' : station === 'repair' ? 'Доки сектора' : 'Сборка флота' }),
        h('p', { class: 'subtitle', style: { margin: 0 }, text: station === 'forge'
          ? 'Здесь точат модули, разбирают их на запчасти и покупают корпус.'
          : station === 'repair'
            ? 'Корпус восстановлен полностью, щиты подняты. Можно переставить модули.'
            : 'Перестановка модулей, заточка и переработка доступны в любой момент.' }),
      ),
      h('div', { class: 'row row--tight' },
        h('span', { class: 'chip chip--parts' }, h('span', { class: 'chip__label', text: 'запчасти' }), h('b', { text: num(run.parts) })),
        h('span', { class: 'chip' }, h('span', { class: 'chip__label', text: 'трюм' }), h('b', { text: `${CARGO_LIMIT - cargoSpace(run)} / ${CARGO_LIMIT}` })),
        h('button', { class: 'btn', type: 'button', text: '← К карте', on: { click: () => { state.shipyardUi = null; app.go('map'); } } }),
      ),
    ),
    run.fleet.length > 1 ? h('div', { class: 'tabs', style: { marginTop: '12px' } },
      run.fleet.map((s, i) => h('button', {
        class: 'tab',
        type: 'button',
        'aria-selected': i === ui.shipIndex ? 'true' : 'false',
        text: `${s.name} · ${HULLS[s.hullKey].name}`,
        on: { click: () => { ui.shipIndex = i; ui.installUid = null; app.render(); } },
      }))) : null,
  ));

  // --- корабль и трюм ------------------------------------------------------
  const layout = h('div', { class: 'battle__sides', style: { gridTemplateColumns: 'minmax(0,1.35fr) minmax(0,1fr)' } });

  layout.append(h('div', { class: 'stack' },
    shipPanel(ship, computed, ui, app, state, run),
    statsPanel(ship, computed, ui, app),
  ));

  layout.append(h('div', { class: 'stack' },
    cargoPanel(run, ship, ui, app),
    stationPanel(run, station, app),
  ));

  root.append(layout);
  return root;
}

// ---------------------------------------------------------------------------

function shipPanel(ship, computed, ui, app, state, run) {
  const slots = slotList(ship);
  const installing = ui.installUid ? findInFleet(run, ui.installUid) : null;

  const slotEls = slots.map((slot) => {
    const m = ship.installed[slot.id];
    const compatible = installing && installing.slot === slot.slot;
    const mark = h('div', { class: 'slot__mark', text: SLOTS[slot.slot].icon, title: SLOTS[slot.slot].name });

    if (m && !compatible) {
      return h('div', { class: 'slot' }, mark,
        h('div', { class: 'slot__body' },
          moduleEl(m, {
            actions: [
              h('button', { class: 'btn btn--small', type: 'button', text: 'Снять', title: 'В трюм', on: { click: () => { const out = removeModule(run, ship.uid, slot.id); app.toast(out.ok ? `«${m.name}» снят в трюм.` : out.reason, out.ok ? 'info' : 'bad'); app.render(); } } }),
              h('button', { class: 'btn btn--small', type: 'button', text: 'Точить', title: `${enchantCost(m)} запчастей, шанс ${pct(enchantChance(m))}`, disabled: !canEnchant(m).ok || run.parts < enchantCost(m), on: { click: () => doEnchant(run, m, app) } }),
              h('button', { class: 'btn btn--small btn--ghost', type: 'button', text: 'В запчасти', title: `+${moduleParts(m)}`, on: { click: () => doSalvage(run, m, app) } }),
            ],
          }),
        ));
    }

    if (compatible) {
      return h('div', { class: 'slot' }, mark,
        h('div', { class: 'slot__body' },
          h('div', { class: 'slot__empty', style: { borderColor: 'var(--amber-dim)', color: 'var(--amber)' } },
            m ? `Занято: ${m.name}` : `Свободно · ${SLOTS[slot.slot].name.toLowerCase()}`,
            h('div', { class: 'row row--tight', style: { marginTop: '6px' } },
              h('button', {
                class: 'btn btn--small btn--primary',
                type: 'button',
                text: m ? 'Заменить' : 'Поставить сюда',
                on: {
                  click: () => {
                    const out = installModule(run, installing.uid, ship.uid, slot.id);
                    app.toast(out.ok ? `«${installing.name}» установлен${m ? ` (прежний «${m.name}» в трюме)` : ''}.` : out.reason, out.ok ? 'good' : 'bad');
                    ui.installUid = null;
                    app.render();
                  },
                },
              }),
              h('button', { class: 'btn btn--small btn--ghost', type: 'button', text: 'Отмена', on: { click: () => { ui.installUid = null; app.render(); } } }),
            ),
          ),
        ));
    }

    return h('div', { class: 'slot' }, mark,
      h('div', { class: 'slot__body' },
        h('div', { class: 'slot__empty', text: `Пусто · ${SLOTS[slot.slot].name.toLowerCase()}` })));
  });

  const hullShare = ship.hull / Math.max(1, computed.stats.hull);

  return h('div', { class: 'card' },
    h('div', { class: 'row row--between' },
      h('div', {},
        h('h3', { class: 'card__title', text: `${ship.name}` }),
        h('p', { class: 'hint', style: { margin: 0 }, text: `${HULLS[ship.hullKey].icon} ${HULLS[ship.hullKey].name} · ${slots.length} слотов · занято ${installedModules(ship).length} · свободно ${freeSlots(ship).length}` }),
      ),
      h('span', { class: 'power', text: `мощность ${num(shipPower(ship), 1)}` }),
    ),
    h('div', { style: { margin: '10px 0' } },
      barEl(ship.hull, computed.stats.hull, hullShare > 0.35 ? 'hull' : 'foe', `прочность ${Math.round(ship.hull)} / ${Math.round(computed.stats.hull)} (${pct(hullShare)})`),
      barEl(ship.shield ?? computed.stats.shield, Math.max(1, computed.stats.shield), 'shield', `щит ${Math.round(ship.shield ?? computed.stats.shield)} / ${Math.round(computed.stats.shield)}`),
    ),
    ui.installUid
      ? h('p', { class: 'warn', text: `Выбирайте слот для «${installing ? installing.name : ''}»: подсвечены подходящие по типу.` })
      : h('p', { class: 'hint', text: 'Модуль встаёт только в слот своего типа. Замена отправляет прежний модуль в трюм.' }),
    h('div', { class: 'slots' }, slotEls),
  );
}

function statsPanel(ship, computed, ui, app) {
  const keys = ui.showAllStats ? STAT_KEYS : CORE_KEYS;
  return h('div', { class: 'card' },
    h('div', { class: 'row row--between' },
      h('h3', { class: 'card__title', text: 'Характеристики и как они сложились' }),
      h('button', {
        class: 'btn btn--small btn--ghost',
        type: 'button',
        text: ui.showAllStats ? 'Только основные' : `Все ${STAT_KEYS.length}`,
        on: { click: () => { ui.showAllStats = !ui.showAllStats; app.render(); } },
      }),
    ),
    statsTable(computed, {
      keys,
      baseOf: (k) => statBase(ship, k),
      explain: (k) => explainStat(ship, k, computed),
    }),
    h('p', { class: 'hint', style: { marginTop: '10px' }, text: 'Цепочка читается слева направо: база корпуса, затем множители модулей (× усиливает, ÷ ослабляет), в конце плоские добавки. Итог ограничен полом 5% и потолком 95% — если сборка уперлась, показаны оба числа.' }),
    h('details', { style: { marginTop: '8px' } },
      h('summary', { class: 'hint', style: { cursor: 'pointer' }, text: 'Особые свойства корабля' }),
      h('div', { class: 'stack', style: { marginTop: '8px' } },
        Object.keys(computed.fx).length
          ? Object.keys(computed.fx).map((id) => {
            const sp = specialInfo(id);
            return h('div', { class: sp && sp.good ? 'good' : 'bad', style: { fontSize: '12.5px' } }, sp ? `${sp.name}: ${sp.text}` : id);
          })
          : [h('p', { class: 'hint', text: 'Особых свойств нет: их дают не все модули.' })]),
      computed.disabledCount ? h('p', { class: 'warn', text: `Заглушено ЭМИ модулей: ${computed.disabledCount}.` }) : null,
    ),
  );
}

/** Особое свойство по id — описание берётся из SPECIALS движка. */
function specialInfo(id) {
  return SPECIALS[id] || null;
}

function cargoPanel(run, ship, ui, app) {
  const all = [];
  for (const s of run.fleet) {
    for (const m of s.cargo) all.push({ module: m, owner: s });
  }
  all.sort((a, b) => moduleScore(b.module) - moduleScore(a.module));

  return h('div', { class: 'card' },
    h('h3', { class: 'card__title', text: `Трюм флота · ${all.length} модулей` }),
    h('p', { class: 'hint', text: 'Модули лежат на кораблях, но поставить их можно на любой: перенос идёт целиком, копия не остаётся.' }),
    all.length
      ? h('div', { class: 'stack' }, all.map(({ module: m, owner }) => moduleEl(m, {
        selectable: false,
        meta: `${owner.name} · счёт ${num(moduleScore(m), 2)} · на запчасти ${moduleParts(m)}`,
        actions: [
          h('button', {
            class: ui.installUid === m.uid ? 'btn btn--small btn--primary' : 'btn btn--small',
            type: 'button',
            text: ui.installUid === m.uid ? 'Выбираю слот…' : 'Поставить',
            on: { click: () => { ui.installUid = ui.installUid === m.uid ? null : m.uid; app.render(); } },
          }),
          h('button', { class: 'btn btn--small', type: 'button', text: 'Точить', disabled: !canEnchant(m).ok || run.parts < enchantCost(m), title: `${enchantCost(m)} запчастей, шанс ${pct(enchantChance(m))}`, on: { click: () => doEnchant(run, m, app) } }),
          h('button', { class: 'btn btn--small btn--ghost', type: 'button', text: `В запчасти (+${moduleParts(m)})`, on: { click: () => doSalvage(run, m, app) } }),
        ],
      })))
      : h('p', { class: 'hint', text: 'Трюм пуст. Модули берутся с обломков после победы.' }),
  );
}

function stationPanel(run, station, app) {
  if (station !== 'forge') {
    return h('div', { class: 'card' },
      h('h3', { class: 'card__title', text: 'Покупка корпуса' }),
      h('p', { class: 'hint', text: 'Корпус продаётся только на верфи сектора (узел ⚒). Там же дешевле забрать корпус с обломка противника — за 40% цены, но с половиной прочности.' }),
    );
  }
  const fleetFull = run.fleet.length >= MAX_FLEET;
  return h('div', { class: 'card', style: { borderColor: 'var(--amber-dim)' } },
    h('h3', { class: 'card__title', text: 'Купить корпус на верфи' }),
    fleetFull ? h('p', { class: 'warn', text: `Флот полон: не больше ${MAX_FLEET} кораблей.` }) : null,
    h('div', { class: 'stack' }, HULL_KEYS.map((key) => {
      const hull = HULLS[key];
      const price = hullPrice(key);
      return h('div', { class: 'row row--between', style: { gap: '8px' } },
        h('div', {},
          h('div', { text: `${hull.icon} ${hull.name} · ${hullSlots(key).length} слотов` }),
          h('div', { class: 'hint', style: { fontSize: '11.5px' }, text: hull.desc }),
        ),
        h('button', {
          class: 'btn btn--small',
          type: 'button',
          disabled: fleetFull || run.parts < price,
          text: `${price} запчастей`,
          on: {
            click: () => {
              const out = buyHull(run, key);
              app.toast(out.ok ? `${hull.name} вошёл во флот.` : out.reason, out.ok ? 'good' : 'bad');
              app.render();
            },
          },
        }),
      );
    })),
  );
}

// ---------------------------------------------------------------------------

function doEnchant(run, m, app) {
  const out = enchantModuleRun(run, m.uid);
  if (!out.ok) { app.toast(out.reason, 'bad'); app.render(); return; }
  app.toast(`${out.success ? 'Успех' : 'Провал'}: ${out.text}`, out.success ? 'good' : 'bad', 5200);
  app.render();
}

function doSalvage(run, m, app) {
  const out = salvageModule(run, m.uid);
  if (!out.ok) { app.toast(out.reason, 'bad'); app.render(); return; }
  app.toast(`«${m.name}» разобран: +${out.parts} запчастей.`, 'info');
  app.render();
}

function findInFleet(run, uid) {
  for (const s of run.fleet) {
    for (const sl of slotList(s)) if (s.installed[sl.id] && s.installed[sl.id].uid === uid) return s.installed[sl.id];
    const inCargo = s.cargo.find((m) => m.uid === uid);
    if (inCargo) return inCargo;
  }
  return null;
}
