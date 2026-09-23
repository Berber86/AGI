/**
 * Экран боя.
 *
 * Ход противника разыгрывается сразу и целиком — игрок управляет только своими
 * кораблями, но видит каждый бросок в журнале: попадание, крит, поглощение
 * щитом, делитель брони и проки статусов показаны формулой, а не итогом.
 *
 * Предпросмотр залпа берёт shotPreview из движка: те же функции, те же числа,
 * которые бросит настоящий выстрел. Считать шансы «примерно» в интерфейсе
 * значило бы показывать игроку не ту игру, в которую он играет.
 */

import {
  aliveUnits, unitsOf, advance, upcoming, performAction, battleReport,
  canRetreat, retreatCost, retreat, shotPreview, volleySize, STATUS_INFO,
  overheatShare, STALEMATE_ACTIONS, BATTLE_ACTION_CAP, RETREAT_HULL_COST,
} from '../../engine/combat.js';
import { chooseTarget, suggestTarget, autoBattle } from '../../engine/ai.js';
import { HULLS, slotList, installedModules } from '../../engine/ship.js';
import { NODE_TYPES } from '../../engine/sector.js';
import { nodeById } from '../../engine/sector.js';
import { h, num, pct, barEl, chanceRow , nextFrame } from '../dom.js';

export function renderBattle({ app, state }) {
  const b = state.battle;
  if (!b) return staleBattle(app);

  const ui = state.battleUi;
  let actor = null;
  if (!b.over) actor = ensureActor(state, b);

  const node = b.nodeId ? nodeById(state.run.map, b.nodeId) : null;
  const tierName = node ? NODE_TYPES[node.type]?.name || 'Бой' : 'Засада';

  const root = h('div', { class: 'battle stack' });

  root.append(h('div', { class: 'card' },
    h('div', { class: 'row row--between' },
      h('div', {},
        h('h2', { class: 'title-line', text: `${tierName} · ${b.mode}` }),
        h('p', { class: 'subtitle', style: { margin: 0 }, text: b.over
          ? `Бой окончен: ${b.over.reason || ''}`
          : `Ход ${b.action + 1} · тик ${Math.round(b.tick)} · точность вашего флота ${pct(b.shots ? b.hits / b.shots : 0)}` }),
      ),
      heatBadge(b),
    ),
  ));

  root.append(h('div', { class: 'battle__sides' },
    side('mine', 'Ваш флот', b, state, app, actor),
    h('div', { class: 'battle__vs' },
      h('div', { class: 'card', style: { minWidth: '260px' } },
        h('h3', { class: 'card__title', text: 'Очередь ходов' }),
        queue(b),
      ),
      b.over ? outcomePanel(b, app) : controlPanel(b, actor, state, app),
    ),
    side('foes', 'Противник', b, state, app, actor),
  ));

  root.append(h('div', { class: 'card' },
    h('h3', { class: 'card__title', text: 'Журнал боя' }),
    battleLog(b),
  ));

  // журнал боя читается снизу вверх по времени: прокручиваем к последнему
  nextFrame(() => {
    const box = root.querySelector('.battle-log');
    if (box) box.scrollTop = box.scrollHeight;
  });

  return root;
}

// ---------------------------------------------------------------------------
//  Ходы
// ---------------------------------------------------------------------------

/**
 * Довести бой до хода игрока.
 *
 * Ходы противника разыгрываются сразу: они детерминированы правилом выбора
 * цели, и прятать их за кнопкой «дальше» значило бы затягивать бой втрое.
 * Возвращает корабль игрока, который ходит сейчас, или null.
 */
function ensureActor(state, b) {
  const ui = state.battleUi;
  if (ui.actor && ui.actor.alive && !b.over && unitsOf(b, 'mine').includes(ui.actor)) return ui.actor;
  ui.actor = null;
  let guard = 0;
  while (!b.over && guard++ < 200) {
    const unit = advance(b);
    if (!unit) break;
    if (!unit.alive) continue;
    if (unit.sideId === 'mine') {
      // подсказка цели: тот же выбор, что сделал бы ИИ
      ui.actor = unit;
      ui.targetUid = ui.targetUid && findTarget(b, ui.targetUid) ? ui.targetUid : suggestTarget(b, unit);
      return unit;
    }
    const target = chooseTarget(b, unit);
    if (!target) break;
    performAction(b, unit, target);
  }
  return null;
}

function findTarget(b, uid) {
  return unitsOf(b, 'foes').find((u) => u.uid === uid && u.alive) || null;
}

// ---------------------------------------------------------------------------
//  Панели
// ---------------------------------------------------------------------------

function heatBadge(b) {
  const share = overheatShare(b);
  if (share <= 0) {
    const left = Math.max(0, Math.min(STALEMATE_ACTIONS - b.actionsSinceDeath, BATTLE_ACTION_CAP - b.action));
    return h('span', { class: 'chip', title: 'Бой затягивается — реакторы начнут жечь собственный корпус' },
      h('span', { class: 'chip__label', text: 'до перегрева' }), h('b', { text: num(left) }));
  }
  return h('span', { class: 'chip', style: { borderColor: 'var(--red-dim)' } },
    h('span', { class: 'chip__label', text: 'перегрев' }),
    h('b', { class: 'bad', text: `−${pct(share)} корпуса за ход` }));
}

function queue(b) {
  if (b.over) return h('p', { class: 'hint', text: 'Очередь пуста: бой окончен.' });
  const list = upcoming(b, 6);
  return h('div', { class: 'queue' }, list.map((item, i) => h('div', {
    class: `queue__item${i === 0 ? ' queue__item--next' : ''}`,
  },
  h('span', {},
    h('span', { class: `queue__side queue__side--${item.unit.sideId === 'mine' ? 'mine' : 'foes'}`, text: item.unit.sideId === 'mine' ? 'вы' : 'враг' }),
    ' ', item.unit.name),
  h('span', { class: 'queue__tick', text: `тик ${Math.round(item.at)}` }),
  )));
}

function controlPanel(b, actor, state, app) {
  const ui = state.battleUi;
  if (!actor) {
    return h('div', { class: 'card' },
      h('p', { class: 'hint', text: 'Хода нет: бой вот-вот закончится.' }),
      h('button', { class: 'btn btn--primary btn--wide', type: 'button', text: 'Довести бой', on: { click: () => { autoBattle(b, { maxActions: 300 }); app.render(); } } }),
    );
  }

  const target = findTarget(b, ui.targetUid) || aliveUnits(b, 'foes')[0] || null;
  const preview = target ? shotPreview(b, actor, target) : null;

  const retreatCheck = canRetreat(b, 'mine');
  const costs = retreatCheck.ok ? retreatCost(b, 'mine') : [];
  const willLose = costs.filter((c) => c.lost).length;

  const panel = h('div', { class: 'card' },
    h('h3', { class: 'card__title', text: `Ход: ${actor.name}` }),
    target
      ? h('div', { class: 'shot' },
        h('p', { class: 'hint', style: { margin: '0 0 6px' }, text: `Цель: ${target.name} · залп ${volleySize(b, actor)} ${preview.overcharged ? '(перегрузка реактора: первый залп вдвое сильнее)' : ''}` }),
        chanceRow('Попадание', preview.hit),
        chanceRow('Крит', preview.crit),
        preview.absorb ? chanceRow('Щит поглотит', preview.absorb) : null,
        h('div', { class: 'chance' },
          h('span', { class: 'chance__name', text: 'Броня цели' }),
          h('span', { class: 'chance__formula', text: `делитель урона ÷${num(preview.armorDiv, 2)}${preview.armorDiv < 1 ? ' — броня слабее единицы и урон УВЕЛИЧИВАЕТ' : ''}` }),
          h('span', { class: 'chance__value', text: `×${num(1 / Math.max(0.01, preview.armorDiv), 2)}` }),
        ),
        ...preview.statuses.map((s) => h('div', { class: 'chance' },
          h('span', { class: 'chance__name', text: s.name }),
          h('span', { class: 'chance__formula', text: s.blocked ? 'цель невосприимчива' : s.chance.formula }),
          h('span', { class: 'chance__value', text: s.blocked ? '—' : pct(s.chance.p, 1) }),
        )),
        h('div', { class: 'chance' },
          h('span', { class: 'chance__name', text: 'Урон за выстрел' }),
          h('span', { class: 'chance__formula', text: `${num(preview.dmg.min, 1)}…${num(preview.dmg.max, 1)} · крит до ${num(preview.dmg.crit, 1)} · в среднем ${num(preview.dmg.expect, 1)}` }),
          h('span', { class: 'chance__value', text: num(preview.dmg.expect, 1) }),
        ),
      )
      : h('p', { class: 'hint', text: 'Целей нет.' }),

    h('div', { class: 'stack', style: { marginTop: '12px' } },
      h('button', {
        class: 'btn btn--primary btn--wide',
        type: 'button',
        disabled: !target,
        text: target ? `Выстрел по ${target.name}` : 'Выстрел',
        on: {
          click: () => {
            if (!target) return;
            performAction(b, actor, target);
            state.battleUi.actor = null;
            app.render();
          },
        },
      }),
      h('button', {
        class: 'btn btn--wide',
        type: 'button',
        text: 'Автобой до конца',
        title: 'Дальше бой разыгрывает ИИ теми же правилами',
        on: { click: () => { autoBattle(b, { maxActions: 300 }); state.battleUi.actor = null; app.render(); } },
      }),
      ui.confirmRetreat
        ? h('div', { class: 'card', style: { background: '#160f10', borderColor: 'var(--red-dim)' } },
          h('h4', { class: 'card__title', style: { color: 'var(--red)' }, text: 'Цена отхода' }),
          h('p', { class: 'hint', text: `Каждый корабль теряет ${pct(RETREAT_HULL_COST)} ПОЛНОЙ прочности. Жизнь сохраняется, трофеев нет, узел остаётся непройденным.` }),
          ...costs.map((c) => h('div', { class: 'row row--between', style: { fontSize: '12.5px' } },
            h('span', {}, c.name),
            h('span', { class: c.lost ? 'bad mono' : 'mono', text: c.lost ? `−${num(c.cost)} → ГИБЕЛЬ` : `−${num(c.cost)} → ${num(c.after)}` }),
          )),
          willLose ? h('p', { class: 'bad', style: { fontSize: '12.5px' }, text: `Кораблей потеряется при отходе: ${willLose}. Если погибнут все — это поражение и минус жизнь.` }) : null,
          h('div', { class: 'row row--tight', style: { marginTop: '10px' } },
            h('button', { class: 'btn btn--danger', type: 'button', text: 'Отходить', on: { click: () => { retreat(b, 'mine'); ui.confirmRetreat = false; ui.actor = null; app.render(); } } }),
            h('button', { class: 'btn btn--ghost', type: 'button', text: 'Отмена', on: { click: () => { ui.confirmRetreat = false; app.render(); } } }),
          ),
        )
        : h('button', {
          class: 'btn btn--danger btn--wide',
          type: 'button',
          disabled: !retreatCheck.ok,
          title: retreatCheck.ok ? `−${pct(RETREAT_HULL_COST)} полной прочности каждому кораблю` : retreatCheck.reason,
          text: retreatCheck.ok ? (willLose ? `Отход (погибнет ${willLose})` : 'Отход из боя') : retreatCheck.reason,
          on: { click: () => { ui.confirmRetreat = true; app.render(); } },
        }),
    ),
  );
  return panel;
}

function outcomePanel(b, app) {
  const win = b.over.winner === 'mine';
  const draw = b.over.winner === 'draw';
  const retreated = Boolean(b.over.retreated);
  const report = battleReport(b, 'mine');
  return h('div', { class: 'card', style: { borderColor: win ? 'var(--amber-dim)' : 'var(--red-dim)' } },
    h('h3', { class: 'card__title', style: { color: win ? 'var(--amber)' : 'var(--red)' }, text: win ? 'Победа' : retreated ? 'Отход' : draw ? 'Ничья' : 'Поражение' }),
    h('p', { class: 'hint', text: b.over.reason || '' }),
    h('ul', { class: 'title__rules' },
      h('li', {}, `Ходов: ${report.rounds} · выстрелов ${report.shots} · попаданий ${report.hits} (${pct(report.accuracy)})`),
      h('li', {}, `Обломков: ${report.wrecks.length} · перегруз урона ${pct(report.overkillRatio)} (жжёт трофеи)`),
      retreated ? h('li', { class: 'warn' }, 'Трофеев не будет: узел остался непройденным.') : null,
    ),
    h('button', {
      class: 'btn btn--primary btn--wide',
      type: 'button',
      text: win ? 'Снять трофеи' : 'Продолжить',
      on: { click: () => app.finishBattleUi(report) },
    }),
  );
}

// ---------------------------------------------------------------------------
//  Корабли в бою
// ---------------------------------------------------------------------------

function side(sideId, title, b, state, app, actor) {
  const units = unitsOf(b, sideId);
  const ui = state.battleUi;
  return h('div', {},
    h('h3', { class: `side__title side__title--${sideId === 'mine' ? 'mine' : 'foes'}`, text: title }),
    ...units.map((u) => unitCard(u, b, state, app, actor)),
  );
}

function unitCard(u, b, state, app, actor) {
  const ui = state.battleUi;
  const isActor = actor && actor.uid === u.uid;
  const isTarget = u.sideId === 'foes' && ui.targetUid === u.uid;
  const selectable = u.sideId === 'foes' && u.alive && Boolean(actor) && !b.over;

  const cls = ['ship-card', 'unit'];
  if (isActor) cls.push('unit--acting');
  if (isTarget) cls.push('unit--target');
  if (!u.alive) cls.push('unit--dead');
  if (selectable) cls.push('unit--clickable');

  const hullShare = u.hull / Math.max(1, u.maxHull);
  const stats = u.stats;

  return h('div', {
    class: cls.join(' '),
    role: selectable ? 'button' : null,
    tabindex: selectable ? '0' : null,
    title: selectable ? 'Выбрать целью' : null,
    on: selectable ? {
      click: () => { ui.targetUid = u.uid; app.render(); },
      keydown: (ev) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); ui.targetUid = u.uid; app.render(); } },
    } : null,
  },
  h('div', { class: 'ship-card__head' },
    h('div', {},
      h('div', { class: 'ship-card__name', text: u.name }),
      h('div', { class: 'ship-card__hull', text: `${HULLS[u.ship.hullKey]?.icon || ''} ${HULLS[u.ship.hullKey]?.name || ''}${u.ship.tier && u.ship.tier !== 'battle' ? ` · ${tierLabel(u.ship.tier)}` : ''}` }),
    ),
    isActor ? h('span', { class: 'ship-card__flag', text: 'ходит' }) : isTarget ? h('span', { class: 'ship-card__flag', style: { color: 'var(--violet)' }, text: 'цель' }) : null,
  ),
  barEl(u.hull, u.maxHull, u.sideId === 'mine' ? (hullShare > 0.35 ? 'hull' : 'foe') : 'foe', `прочность ${Math.round(u.hull)} / ${Math.round(u.maxHull)}`),
  u.maxShield > 0 ? barEl(u.shield, u.maxShield, 'shield', `щит ${Math.round(u.shield)} / ${Math.round(u.maxShield)}`) : null,
  h('div', { class: 'ship-card__meta' },
    h('span', { text: `точность ${num(stats.accuracy, 2)}` }),
    h('span', { text: `уклонение ${num(stats.evasion, 2)}` }),
    h('span', { text: `урон ${num(stats.damage, 1)} × ${num(stats.salvo)}` }),
    h('span', { text: `броня ÷${num(stats.armor, 2)}` }),
    h('span', { text: `темп ${num(stats.rate, 2)}` }),
    h('span', { text: `скорость ${num(stats.speed, 2)}` }),
    h('span', { text: `модулей ${installedModules(u.ship).length}${u.disabled && u.disabled.size ? `, заглушено ${u.disabled.size}` : ''}` }),
  ),
  u.statuses && u.statuses.length
    ? h('div', { class: 'unit__statuses' }, u.statuses.map((s) => h('span', {
      class: `status status--${s.id}`,
      title: STATUS_INFO[s.id] ? STATUS_INFO[s.id].text : s.id,
      text: `${STATUS_INFO[s.id] ? STATUS_INFO[s.id].name : s.id} ×${s.stacks}${s.turns ? ` · ${s.turns} хода` : ''}`,
    })))
    : null,
  );
}

function tierLabel(tier) {
  return tier === 'boss' ? 'флагман сектора' : tier === 'elite' ? 'элита' : tier === 'fleet' ? 'эскадра' : tier;
}

function battleLog(b) {
  const entries = b.log.slice(-90);
  return h('div', { class: 'battle-log' }, entries.map((e) => h('p', { class: e.kind || 'neutral', text: e.text })));
}

function staleBattle(app) {
  return h('div', { class: 'card' },
    h('h2', { class: 'title-line', text: 'Боя нет' }),
    h('p', { class: 'hint', text: 'Активный бой не найден — например, страница была перезагружена посреди перестрелки. Бой не сохраняется намеренно: иначе перезагрузка стала бы способом переиграть бросок.' }),
    h('button', { class: 'btn btn--primary', type: 'button', text: 'К карте', on: { click: () => app.go('map') } }),
  );
}
