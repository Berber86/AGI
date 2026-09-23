// =============================================================================
//  ШЕСТЕРНИ ЭПОХ — ui/screens/battle.js
//  Боевой экран: поле, рука, фазы, объявление атакующих и назначение блокеров.
//
//  Ключевые решения второй итерации:
//   • Консоль блокирования — каждый атакующий отдельной строкой с назначенными
//     блокерами и ЖИВЫМ ПРОГНОЗОМ исхода. Прогноз считается настоящим движком
//     на клоне боя (predictCombat), а не приближённой формулой, поэтому цифры
//     на экране всегда совпадают с тем, что случится.
//   • Всплывающие цифры урона/лечения и вспышки попаданий (ui/fx.js): снимок
//     состояния снимается ДО разрешения боя, координаты ячеек — тоже, поэтому
//     цифры остаются на местах даже после перерисовки поля.
//   • Горячие клавиши и баннер хода.
//   • Прокрутка журнала сохраняется между перерисовками.
//   • Ход соперника разыгрывается пошагово с задержками — видно, что он
//     выставляет и кем бьёт.
// =============================================================================

import { el, btn, mount, modal, kbd } from '../dom.js';
import { app, persist, toast, render } from '../app.js';
import { renderCard, ROMAN } from '../cards.js';
import { S, DOMAINS } from '../shared.js';
import {
  startTurn, endTurn, resolveCombat, beginCombat, toggleAttacker, playCard, canPlay, canAttack,
  cpBudget, cpSpentAttack, cpSpentBlock, cpLeftAttack, cpLeftBlock, cpCost, canDeclareAttack, maxBlocks,
  isAlive, unitAtk, unitHp, side, legalBlockers, assignBlock, effectiveCost, boardRoom,
  predictCombat, predictUnblocked, predictDefense, diagnoseBattle,
  log as blog,
} from '../../engine/battle.js';
import { aiPlayOne, aiDeclareAttack, suggestBlocks } from '../../engine/ai.js';
import {
  anchorOf, floatAt, flashAt, banner, shake, confirmBox,
  snapshotBattle, diffSnapshot, playEvents,
} from '../fx.js';

let paintRef = null;
let aiRunning = false;
const uiState = {
  selectedAttacker: null,
  blocks: {},
  blockingMode: false,
  showLog: typeof matchMedia !== 'function' || !matchMedia('(max-width: 1180px)').matches,
  logScroll: 0,
  bannerKey: '',
  helpOpen: false,
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const paint = () => paintRef && paintRef();
const isNarrow = () => typeof matchMedia === 'function' && matchMedia('(max-width: 1180px)').matches;

/**
 * Сбрасывает локальное состояние боевого экрана. Обязательно при входе в новый
 * бой и при выходе на карту: иначе режим блокирования и выбранный атакующий
 * «переезжают» в следующий бой.
 */
export function resetBattleUi() {
  uiState.selectedAttacker = null;
  uiState.blocks = {};
  uiState.blockingMode = false;
  uiState.bannerKey = '';
  uiState.logScroll = 0;
  uiState.consoleScroll = 0;
  predictionCache = null;
}

export function renderBattle() {
  const b = app.battle;
  if (!b) { app.screen = 'hub'; return el('div', {}, 'Бой не найден.'); }
  if (!b.__uiInit) { b.__uiInit = true; resetBattleUi(); }

  const root = el('div', { class: 'battle' });
  paintRef = () => {
    const keep = uiState.logScroll;
    mount(root, layout(b));
    const box = root.querySelector('.logbox');
    if (box && keep) box.scrollTop = keep;
    const sc = root.querySelector('.block-console__rows');
    if (sc && uiState.consoleScroll) sc.scrollTop = uiState.consoleScroll;
  };

  if (b.phase === 'idle') {
    startTurn(b);
    maybeBanner(b);
  }
  paintRef();
  bindKeys(b);

  if (app.battleCtx && !app.battleCtx.briefed) {
    app.battleCtx.briefed = true;
    briefing(b);
  }
  if (b.active === 'foe' && !b.over && !aiRunning && !uiState.blockingMode) runAiTurn('start');
  return root;
}

// -----------------------------------------------------------------------------
//  Раскладка
// -----------------------------------------------------------------------------
function layout(b) {
  const wrap = el('div', { class: `battle__wrap${uiState.showLog ? '' : ' battle__wrap--nolog'}` });
  const board = el('div', { class: 'battle__board' });
  board.append(
    leaderBar(b, 'foe'),
    rowOf(b, 'foe'),
    phaseRibbon(b),
    rowOf(b, 'me'),
    leaderBar(b, 'me'),
    uiState.blockingMode ? blockConsole(b) : null,
    handRow(b),
    controls(b),
  );
  wrap.append(board);
  if (uiState.showLog) wrap.append(el('div', { class: 'battle__log' }, logBox(b)));
  return wrap;
}

// --- полосы лидеров ----------------------------------------------------------
function leaderBar(b, id) {
  const s = side(b, id);
  const pct = Math.max(0, (s.leader.hp / s.leader.maxHp) * 100);
  const dom = DOMAINS[id === 'me' ? app.state.legacy : (app.battleCtx?.region?.civ?.domains?.[0] || 'war')];
  return el('div', { class: `leader leader--${id}`, dataset: { anchor: `leader:${id}` } }, [
    el('div', { class: 'leader__id', style: { '--c': s.color || dom.color } }, [
      el('span', { class: 'leader__glyph', text: dom.glyph }),
      el('div', {}, [
        el('b', {}, s.name),
        el('span', { class: 'leader__sub', text: id === 'me' ? 'ваша держава' : (app.battleCtx?.region?.civ?.name || 'соперник') }),
      ]),
    ]),
    el('div', { class: 'leader__hp' }, [
      el('div', { class: 'hpbar', role: 'img', 'aria-label': `Здоровье лидера ${Math.max(0, s.leader.hp)} из ${s.leader.maxHp}` },
        el('i', { style: { width: `${pct}%`, background: pct > 50 ? '#5c9e4f' : pct > 25 ? '#c9a227' : '#c8452f' } })),
      el('b', {}, `${Math.max(0, s.leader.hp)} / ${s.leader.maxHp}`),
      s.leader.armor ? el('span', { class: 'chip chip--armor', text: `🛡 ${s.leader.armor}` }) : null,
      s.leader.shroud ? el('span', { class: 'chip', text: '🜚 Помехи' }) : null,
    ]),
    el('div', { class: 'leader__nums' }, [
      num('⚡', `${s.energy}/${s.maxEnergy || 0}`, 'энергия сейчас / потолок хода'),
      num('🎖', `${cpLeft(b, id)}/${cpBudget(b, id, id === b.active && b.phase === 'combatDeclare' ? 'attack' : 'block')}`, cpTitle(b, id)),
      num('🂠', s.hand.length, 'карт в руке'),
      num('⛁', s.deck.length, 'в колоде'),
      num('☠', s.grave.length, 'пало в этом бою'),
      num('📉', s.fatigue || 0, 'усталость от пустой колоды'),
    ]),
  ]);
}
const num = (i, v, t) => el('span', { class: 'num', title: t }, [el('i', {}, i), el('b', {}, String(v))]);

/** Сколько очков командования осталось у стороны в этом раунде. */
function cpLeft(b, id) {
  return b.phase === 'combatDeclare' && b.active === id ? cpLeftAttack(b) : cpLeftBlock(b, id);
}

function cpTitle(b, id) {
  const who = id === 'me' ? 'ваших' : 'противника';
  return `очки командования ${who}: осталось / бюджет раунда. Ими оплачиваются атакующие и блокирующие; «Знамя» прибавляет, чужая «Паника» отнимает.`;
}

// --- ряды поля ---------------------------------------------------------------
function rowOf(b, id) {
  const s = side(b, id);
  const row = el('div', { class: `brow brow--${id}` });
  const units = s.board.filter(isAlive);
  for (let i = 0; i < b.cfg.slots; i++) {
    row.append(units[i] ? unitCell(b, units[i], id, i) : el('div', { class: 'bslot bslot--empty' }, id === 'me' ? '＋' : ''));
  }
  return row;
}

/**
 * «Всеми» — но в пределах бюджета командования.
 * Раньше кнопка писала в b.attacking напрямую и пробивала потолок: соперник
 * играл по правилам, а игрок — нет. Отказ объясняем, а не глотаем.
 */
function declareAllAttackers(b) {
  let added = 0, refused = 0;
  for (const u of side(b, 'me').board.filter(isAlive)) {
    if (!canAttack(b, u) || b.attacking.includes(u.uid)) continue;
    if (toggleAttacker(b, u)) added++; else refused++;
  }
  if (refused) {
    toast(`Очков командования хватило на ${added}. Ещё ${refused} не влезли в бюджет раунда (${cpLeftAttack(b)} из ${cpBudget(b, 'me')} свободно).`, 'bad', 4200);
  }
  paint();
}

function unitCell(b, u, id, pos) {
  const attacking = b.attacking.includes(u.uid);
  const myBlocks = uiState.blocks[u.uid] || [];
  const autoBlocks = b.blockers[u.uid] || [];
  const assignedHere = [...myBlocks, ...autoBlocks];
  const isBlocking = Object.values(uiState.blocks).flat().includes(u.uid);
  const selected = uiState.selectedAttacker === u.uid;

  const cls = ['bunit'];
  if (attacking) cls.push('bunit--atk');
  if (isBlocking) cls.push('bunit--blk');
  if (selected) cls.push('bunit--sel');
  if (u.exhausted) cls.push('bunit--tap');
  if (uiState.blockingMode && id === 'foe' && attacking) cls.push('bunit--target');
  if (uiState.blockingMode && id === 'me') cls.push('bunit--pickable');

  // onClick на ОБЁРТКЕ, а не на карточке: клик по внутреннему узлу всплывает
  // вверх, а не вниз, поэтому обработчик на карточке недостижим из ячейки.
  // Заодно вся ячейка становится крупной целью — важно на тач-устройствах.
  const card = renderCard(u, { size: 'sm', tooltip: false });
  const badge = el('div', { class: 'bunit__badge' }, [
    el('span', { class: 'bunit__atk', text: String(unitAtk(b, u)) }),
    el('span', { class: `bunit__hp${u.damage ? ' bunit__hp--hurt' : ''}`, text: String(Math.max(0, unitHp(u) - u.damage)) }),
  ]);
  const wrap = el('div', {
    class: cls.join(' '),
    dataset: { pos: String(pos), uid: u.uid, side: id },
    tabindex: '0',
    role: 'button',
    onclick: () => onUnitClick(b, u, id),
    'aria-label': `${u.name}, ${unitAtk(b, u)}/${Math.max(0, unitHp(u) - u.damage)}${attacking ? ', атакует' : ''}${isBlocking ? ', блокирует' : ''}`,
  }, [card, badge]);
  wrap.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onUnitClick(b, u, id); }
  });

  if (attacking && assignedHere.length) {
    wrap.append(el('div', { class: 'bunit__to', text: `блок: ${assignedHere.length}` }));
  }
  if (attacking && id === 'foe' && uiState.blockingMode && !assignedHere.length) {
    wrap.append(el('div', { class: 'bunit__to bunit__to--open', text: 'не заблокирован' }));
  }
  if (u.sick && !u.exhausted) wrap.append(el('div', { class: 'bunit__sick', text: '⏳' }));

  // Цену в очках командования показываем ДО клика: отказ без видимой цены
  // выглядит как произвол, а с ценой игрок сам видит, кого не хватает.
  const deciding = !b.over && id === 'me'
    && (uiState.blockingMode || (b.phase === 'combatDeclare' && b.active === 'me'));
  if (deciding) {
    const mode = uiState.blockingMode ? 'block' : 'attack';
    const cost = cpCost(b, u, mode);
    wrap.append(el('div', {
      class: 'bunit__cp' + (cost === 0 ? ' bunit__cp--free' : ''),
      text: `🎖${cost}`,
      title: cost === 0
        ? 'Не стоит очков командования (Муштра)'
        : `Стоит ${cost} очк${cost === 1 ? 'о' : 'а'} командования в этой фазе`,
    }));
  }
  return wrap;
}

function onUnitClick(b, u, id) {
  if (b.over) { finishScreen(b); return; }

  // режим назначения блокеров
  if (uiState.blockingMode) {
    if (id === 'foe') {
      uiState.selectedAttacker = uiState.selectedAttacker === u.uid ? null : u.uid;
      paint(); return;
    }
    if (!uiState.selectedAttacker) { toast('Сначала выберите атакующего — строку в консоли ниже или юнита на поле.', 'bad'); return; }
    toggleBlock(b, uiState.selectedAttacker, u);
    return;
  }

  // моя фаза атаки
  if (id === 'me' && b.active === 'me' && b.phase === 'combatDeclare') {
    if (!toggleAttacker(b, u)) {
      // причину спрашиваем у движка: он знает и про очки командования, которые
      // интерфейс иначе не смог бы объяснить
      const why = canDeclareAttack(b, u);
      if (why.reason) toast(why.reason, 'bad', 3200);
      else if (u.exhausted) toast('Юнит истощён: он уже действовал.', 'bad');
      else if (u.sick) toast('Болезнь выставления: юнит может атаковать со следующего хода (Рывок снимает её).', 'bad');
      else toast('Этот юнит не может атаковать.', 'bad');
    }
    paint(); return;
  }

  showUnitModal(b, u);
}

/** Поставить/снять блокера; обновляет консоль и прогноз. */
/**
 * Очки командования, уже обещанные отложенным блоком.
 * Консоль блока хранит назначения в uiState.blocks, а не в b.blockers, поэтому
 * остаток нужно считать именно от отложенного состояния — иначе панель
 * показывала бы полный бюджет и разрешала набрать сверх него, а commitBlocks
 * молча выбрасывал бы лишнее. Прогноз перестал бы совпадать с реальностью.
 */
function pendingBlockCost(b) {
  const ids = new Set(Object.values(uiState.blocks).flat());
  return [...ids]
    .map((id) => side(b, 'me').board.find((u) => u.uid === id))
    .filter((u) => u && isAlive(u))
    .reduce((sum, u) => sum + cpCost(b, u, 'block'), 0);
}

function cpLeftPending(b) {
  return Math.max(0, cpBudget(b, 'me', 'block') - pendingBlockCost(b));
}

/**
 * Почему юнит не может держать ещё одного атакующего.
 * Лимит дают свойства, и их теперь два — Стратег и Муштра, складывающиеся до
 * трёх. Называем источник, иначе цифра выглядит произвольной.
 */
function blockCapReason(u, cap) {
  const words = { 1: 'одного', 2: 'двоих', 3: 'троих' };
  const sources = [u.fx.tactician ? 'Стратег' : null, u.fx.drill ? 'Муштра' : null].filter(Boolean);
  return sources.length
    ? `${sources.join(' и ')} позволяет держать ${words[cap] || cap}. Больше — нельзя.`
    : 'Юнит уже блокирует другого атакующего.';
}

function toggleBlock(b, attackerUid, u) {
  const atk = b.sides.foe.board.find((x) => x.uid === attackerUid);
  if (!atk) { toast('Атакующий исчез.', 'bad'); return; }
  if (!legalBlockers(b, atk).includes(u)) {
    toast(atk.fx.siege && !u.fx.reach ? 'Осадного юнита блокируют только юниты с Захватом.' : 'Этот юнит не может блокировать.', 'bad');
    return;
  }
  const cur = uiState.blocks[attackerUid] || [];
  if (cur.includes(u.uid)) {
    uiState.blocks[attackerUid] = cur.filter((x) => x !== u.uid);
  } else {
    const elsewhere = Object.entries(uiState.blocks).filter(([k]) => k !== attackerUid).flatMap(([, v]) => v);
    // maxBlocks — единый источник: хардкод «Стратег ? 2 : 1» не знал про Муштру
    const cap = maxBlocks(u);
    if (elsewhere.filter((x) => x === u.uid).length >= cap) {
      toast(blockCapReason(u, cap), 'bad'); return;
    }
    // Юнит, уже стоящий в блоке у другого атакующего, оплачен один раз.
    const alreadyPaying = Object.values(uiState.blocks).flat().includes(u.uid);
    if (!alreadyPaying) {
      const cost = cpCost(b, u, 'block');
      const left = cpLeftPending(b);
      if (cost > left) {
        toast(cost === 0
          ? 'Не хватает очков командования.'
          : `Не хватает очков командования на блок: нужно ${cost}, осталось ${left}.`, 'bad', 3600);
        return;
      }
    }
    uiState.blocks[attackerUid] = [...cur, u.uid];
  }
  predictionCache = null;
  paint();
}

function showUnitModal(b, u) {
  modal(u.name, el('div', { class: 'detail' }, [
    renderCard(u, { size: 'lg', tooltip: false }),
    el('div', { class: 'detail__side' }, [
      el('div', { class: 'kv' }, [
        el('div', { class: 'kv__row' }, [el('span', {}, 'Атака'), el('b', {}, `${unitAtk(b, u)} (база ${u.atk}${u.counters.atk ? `, жетоны ${u.counters.atk > 0 ? '+' : ''}${u.counters.atk}` : ''})`)]),
        el('div', { class: 'kv__row' }, [el('span', {}, 'Здоровье'), el('b', {}, `${Math.max(0, unitHp(u) - u.damage)} / ${unitHp(u)}`)]),
        el('div', { class: 'kv__row' }, [el('span', {}, 'Цена'), el('b', {}, `${u.cost}⚡`)]),
        el('div', { class: 'kv__row' }, [el('span', {}, 'Владелец'), el('b', {}, side(b, u.owner).name)]),
      ]),
      el('h4', {}, 'Свойства'),
      el('div', { class: 'kwlist' }, u.keywords.length ? u.keywords.map((k) => el('div', { class: 'kwrow' }, [
        el('span', { class: 'kwrow__name', text: k.name + ((k.lvl || 1) > 1 ? ' ' + ROMAN[Math.min(6, k.lvl)] : '') }),
        el('span', { class: 'kwrow__text', text: k.text }),
      ])) : el('div', { class: 'dim' }, 'Свойств нет — чистая сила корпуса.')),
      u.srcId
        ? el('div', { class: 'small dim' }, `Ветеранство ${u.lvl ? '★'.repeat(u.lvl) : 'нет'} · после боя получит опыт`)
        : el('div', { class: 'small dim' }, u.token ? 'Токен: не возвращается в ростер.' : ''),
    ]),
  ]));
}

// --- лента фаз ---------------------------------------------------------------
const PHASES = [['main1', 'Главная'], ['combatDeclare', 'Атака'], ['combatResolve', 'Разрешение'], ['main2', 'После боя']];
function phaseRibbon(b) {
  const cur = b.over ? 'over' : b.phase;
  return el('div', { class: 'ribbon' }, [
    ...PHASES.map(([id, name]) => el('div', { class: `ph${cur === id ? ' ph--on' : ''}`, 'aria-current': cur === id ? 'step' : null }, name)),
    el('div', { class: 'ph-turn' }, [
      el('b', {}, `Раунд ${b.round}`),
      el('span', {}, b.active === 'me' ? ' · ваш ход' : ` · ход ${side(b, 'foe').name}`),
      el('span', { class: 'dim' }, ` · эпоха ${ROMAN[b.era]}`),
    ]),
    el('button', { class: 'ph-help', title: 'Горячие клавиши (H)', onclick: () => shortcutsModal(), 'aria-label': 'Горячие клавиши' }, '⌨'),
  ]);
}

// --- рука --------------------------------------------------------------------
function handRow(b) {
  const s = side(b, 'me');
  const box = el('div', { class: 'hand' });
  box.append(el('div', { class: 'hand__label' }, [`Рука ${s.hand.length}/${b.cfg.handLimit}`]));
  if (!s.hand.length) box.append(el('div', { class: 'hand__empty' }, 'Рука пуста — нажмите «Конец хода», чтобы добрать карту.'));
  for (const u of s.hand) {
    const playable = canPlay(b, u) && b.active === 'me' && !b.over && !aiRunning && !uiState.blockingMode;
    const cost = effectiveCost(b, u);
    const cell = el('div', {
      class: `handcell${playable ? ' handcell--ok' : ''}`,
      dataset: { hand: u.uid },
      tabindex: '0',
      role: 'button',
      'aria-label': `${u.name}, цена ${cost}, ${u.atk}/${u.hp}${playable ? ', можно выставить' : ', сейчас недоступно'}`,
      onclick: () => onHandClick(b, u, playable, cost),
    }, [
      renderCard(u, { size: 'sm', playable, dim: !playable, tooltip: false }),
      playable ? el('div', { class: 'handcell__go', text: 'выставить' }) : null,
      playable ? el('div', { class: 'handcell__cost', text: `${cost}⚡` }) : null,
    ]);
    cell.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onHandClick(b, u, playable, cost); }
    });
    box.append(cell);
  }
  return box;
}

/** Клик по карте в руке: либо выставляем, либо объясняем, почему нельзя. */
function onHandClick(b, u, playable, cost) {
  if (b.over || b.active !== 'me' || aiRunning || uiState.blockingMode) return;
  if (!playable) {
    const s = side(b, 'me');
    if (!b.phase.startsWith('main')) toast('Выставлять юнитов можно только в главную фазу.', 'bad');
    else if (cost > s.energy) toast(`Нужно ${cost}⚡, у вас ${s.energy}⚡.`, 'bad');
    else if (boardRoom(b, 'me') <= 0) toast(`Поле заполнено: ${b.cfg.slots} мест в эпохе ${ROMAN[b.era]}.`, 'bad');
    else showUnitModal(b, u);
    return;
  }
  playCardFx(b, () => playCard(b, u));
}

// -----------------------------------------------------------------------------
//  КОНСОЛЬ БЛОКИРОВАНИЯ
//  Главный инструмент защиты: каждый атакующий — строка с назначенными
//  блокерами и точным прогнозом исхода.
// -----------------------------------------------------------------------------
let predictionCache = null;
function prediction(b) {
  const key = JSON.stringify([b.attacking, uiState.blocks, b.round, b.sides.me.leader.hp, b.sides.foe.leader.hp]);
  if (predictionCache && predictionCache.key === key) return predictionCache.value;
  let value;
  try { value = predictCombat(b, uiState.blocks); }
  catch { value = null; }
  predictionCache = { key, value };
  return value;
}

function blockConsole(b) {
  const atkUnits = b.attacking.map((id) => b.sides.foe.board.find((u) => u.uid === id)).filter((u) => u && isAlive(u));
  const p = prediction(b);
  const myLeader = b.sides.me.leader;
  const incoming = p ? -p.leaderDelta.me : atkUnits.reduce((s, u) => s + unitAtk(b, u), 0);
  const lethal = incoming >= myLeader.hp + (myLeader.armor || 0);

  const box = el('div', { class: `block-console${lethal ? ' block-console--lethal' : ''}` });

  box.append(el('div', { class: 'block-console__head' }, [
    el('div', { class: 'block-console__title' }, [
      el('b', {}, '🛡 Назначьте блокеров'),
      el('span', { class: 'dim small' }, 'клик по строке или вражескому юниту — выбрать, клик по своему — поставить в блок'),
    ]),
    el('div', { class: `block-console__incoming${lethal ? ' is-lethal' : ''}` }, [
      el('span', {}, lethal ? '☠ СМЕРТЕЛЬНЫЙ УРОН' : 'Ваш лидер получит'),
      el('b', {}, `${incoming}`),
      el('span', { class: 'dim' }, `из ${myLeader.hp} HP`),
    ]),
  ]));

  const rows = el('div', { class: 'block-console__rows' });
  rows.addEventListener('scroll', () => { uiState.consoleScroll = rows.scrollTop; });
  if (!atkUnits.length) rows.append(el('div', { class: 'dim' }, 'Атакующих нет.'));

  atkUnits.forEach((a, i) => {
    const blockers = (uiState.blocks[a.uid] || []).map((id) => b.sides.me.board.find((u) => u.uid === id)).filter(Boolean);
    const sel = uiState.selectedAttacker === a.uid;
    const legal = legalBlockers(b, a);
    const blockedDmg = blockers.length ? unitAtk(b, a) : 0;
    const willKillBlocker = blockers.some((bl) => {
      const need = unitHp(bl) - bl.damage + (bl.fx.indestructible ? unitHp(bl) : 0);
      return !a.fx.trample ? unitAtk(b, a) >= need : false;
    });

    const row = el('div', {
      class: `atkrow${sel ? ' atkrow--sel' : ''}${blockers.length ? '' : ' atkrow--open'}`,
      dataset: { uid: a.uid },
      onclick: () => { uiState.selectedAttacker = sel ? null : a.uid; paint(); },
      role: 'button', tabindex: '0',
      'aria-label': `Атакующий ${a.name}, ${unitAtk(b, a)}/${Math.max(0, unitHp(a) - a.damage)}, блокеров ${blockers.length}`,
    }, [
      el('span', { class: 'atkrow__n', text: String(i + 1) }),
      el('div', { class: 'atkrow__who' }, [
        el('b', {}, a.name),
        el('span', { class: 'atkrow__stats' }, [
          el('i', { class: 'a' }, String(unitAtk(b, a))),
          el('span', {}, '/'),
          el('i', { class: 'h' }, String(Math.max(0, unitHp(a) - a.damage))),
        ]),
        a.keywords.length ? el('span', { class: 'atkrow__kw', text: a.keywords.map((k) => k.name).join(' · ') }) : null,
      ]),
      el('div', { class: 'atkrow__arrow', text: '→' }),
      el('div', { class: 'atkrow__blocks' }, blockers.length
        ? blockers.map((bl) => el('button', {
          class: 'blkchip', title: 'Убрать из блока',
          onclick: (e) => { e.stopPropagation(); toggleBlock(b, a.uid, bl); },
        }, [el('b', {}, bl.name), el('span', {}, `${unitAtk(b, bl)}/${Math.max(0, unitHp(bl) - bl.damage)}`), el('i', {}, '✕')]))
        : el('span', { class: 'atkrow__none', text: `не заблокирован · пройдёт ${unitAtk(b, a)} в лидера` })),
      el('div', { class: 'atkrow__verdict' }, [
        blockers.length
          ? el('span', { class: willKillBlocker ? 'v-bad' : 'v-ok' }, willKillBlocker ? 'блокер погибнет' : 'обмен уроном')
          : el('span', { class: 'v-warn' }, 'открыт'),
        el('span', { class: 'dim small' }, `блокируют ${legal.length} из ${b.sides.me.board.filter(isAlive).length}`),
      ]),
    ]);
    row.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); uiState.selectedAttacker = sel ? null : a.uid; paint(); }
    });
    rows.append(row);
    void blockedDmg;
  });
  box.append(rows);

  // --- итоговый прогноз ---
  if (p) {
    const myLosses = p.losses.me.map((x) => x.name);
    const foeLosses = p.losses.foe.map((x) => x.name);
    box.append(el('div', { class: 'block-console__sum' }, [
      el('div', { class: 'sum' }, [
        el('span', {}, 'Прогноз'),
        p.approximate ? el('span', { class: 'sum__approx', title: 'Есть свойства со случайной целью (Разряд, Взрыв, Пожар) — исход может отличаться выбором цели' }, '≈ приблизительный') : el('span', { class: 'sum__exact', title: 'Просчитано настоящим движком на копии боя' }, 'точный'),
      ]),
      el('div', { class: 'sum' }, [el('span', {}, 'Ваш лидер'), el('b', { class: p.leaderDelta.me < 0 ? 'v-bad' : '' }, `${Math.max(0, myLeader.hp + p.leaderDelta.me)} HP`)]),
      el('div', { class: 'sum' }, [el('span', {}, 'Лидер врага'), el('b', { class: p.leaderDelta.foe < 0 ? 'v-bad' : '' }, `${Math.max(0, b.sides.foe.leader.hp + p.leaderDelta.foe)} HP`)]),
      el('div', { class: 'sum' }, [el('span', {}, 'Ваши потери'), el('b', { class: myLosses.length ? 'v-bad' : 'v-ok' }, myLosses.length ? myLosses.join(', ') : 'нет')]),
      el('div', { class: 'sum' }, [el('span', {}, 'Потери врага'), el('b', { class: foeLosses.length ? 'v-ok' : '' }, foeLosses.length ? foeLosses.join(', ') : 'нет')]),
      p.over ? el('div', { class: `sum sum--end ${p.over.winner === 'me' ? 'v-ok' : 'v-bad'}` },
        p.over.winner === 'me' ? '🏆 эта атака выиграет бой' : p.over.winner === 'foe' ? '☠ эта атака проиграет бой' : '⚖ взаимное уничтожение') : null,
    ]));
  }
  return box;
}

// --- кнопки ------------------------------------------------------------------
/**
 * Ожидаемый исход атаки: как именно соперник заблокирует и чем это кончится.
 * Считается predictDefense — настоящим движком на копии боя, поэтому числа
 * совпадают с тем, что произойдёт (кроме свойств со случайной целью).
 */
function defenseForecast(b) {
  const p = predictDefense(b);
  const def = p.defenderSide;
  const myLosses = p.losses.me;
  const foeLosses = p.losses.foe;
  const toLeader = Math.max(0, -p.leaderDelta[def]);

  const head = el('div', { class: 'forecast__head' }, [
    el('span', { class: 'forecast__title' }, p.blocked ? '🛡 Соперник заблокирует' : '⚔ Соперник не сможет заблокировать'),
    el('span', { class: `forecast__num${toLeader ? ' forecast__num--hit' : ''}` },
      toLeader ? `лидеру ${toLeader}` : 'лидеру 0'),
    p.approximate ? el('span', { class: 'forecast__approx', title: 'У участников есть свойства со случайной целью: итог по лидерам точен, распределение урона — нет' }, '≈') : null,
  ]);

  const rows = (p.plan || []).map((pair) => el('div', { class: 'forecast__pair' }, [
    el('b', {}, pair.attackerName), el('span', { class: 'dim' }, ' → '),
    el('span', {}, pair.blockers.join(', ')),
  ]));

  const casualties = [];
  if (myLosses.length) casualties.push(el('span', { class: 'forecast__bad' }, `потеряете: ${myLosses.map((l) => l.name).join(', ')}`));
  if (foeLosses.length) casualties.push(el('span', { class: 'forecast__good' }, `у соперника падут: ${foeLosses.map((l) => l.name).join(', ')}`));
  if (p.over) casualties.push(el('span', { class: p.over.winner === 'me' ? 'forecast__good' : 'forecast__bad' },
    p.over.winner === 'me' ? '⚑ атака заканчивает бой в вашу пользу' : '⚠ бой закончится не в вашу пользу'));

  return el('div', { class: 'forecast' }, [head,
    rows.length ? el('div', { class: 'forecast__rows' }, rows) : null,
    casualties.length ? el('div', { class: 'forecast__casualties' }, casualties) : null]);
}

function controls(b) {
  const box = el('div', { class: 'controls' });
  if (b.over) {
    box.append(el('div', { class: 'controls__msg' }, b.over.winner === 'me' ? '🏆 Победа!' : b.over.winner === 'draw' ? '⚖ Ничья' : '💀 Поражение'));
    box.append(btn('Итоги боя', () => finishScreen(b), 'primary', { hint: 'Enter' }));
    return box;
  }

  if (uiState.blockingMode) {
    box.append(el('div', { class: 'controls__msg' },
      `🛡 Выберите блокирующих. Очки командования: ${cpLeftPending(b)} из ${cpBudget(b, 'me', 'block')}. Каждый блокирующий стоит очков один раз, даже если держит двоих; «Муштра» блокирует бесплатно.`));
    box.append(btn('⚙ Автоблок', () => {
      uiState.blocks = suggestBlocks(b, 'me') || {};
      predictionCache = null; paint();
      toast('Блокеры расставлены автоматически — можно поправить вручную.', 'info', 2200);
    }, '', { hint: 'B' }));
    box.append(btn('∅ Снять блок', () => { uiState.blocks = {}; predictionCache = null; paint(); }, '', { hint: 'X' }));
    box.append(btn('⚔ Принять бой', () => commitBlocks(b), 'primary', { hint: 'Enter' }));
    box.append(btn('🏳 Отступить', () => concede(b), 'danger-ghost'));
    box.append(hintRow([['Enter', 'принять'], ['B', 'автоблок'], ['X', 'снять'], ['1–9', 'выбрать атакующего']]));
    return box;
  }

  if (b.active === 'me') {
    if (b.phase.startsWith('main')) {
      const room = boardRoom(b, 'me');
      const energy = side(b, 'me').energy;
      box.append(el('div', { class: 'controls__msg' },
        `${b.phase === 'main1' ? 'Главная фаза' : 'Фаза после боя'}: выставляйте юнитов из руки и объявляйте атаку.`));
      box.append(btn('⚔ В атаку', () => { beginCombat(b); paint(); }, '', { hint: 'A', disabled: !b.sides.me.board.some((u) => isAlive(u) && canAttack(b, u)) }));
      box.append(btn('⏭ Конец хода', () => doEndTurn(b), 'primary', { hint: 'E' }));
      box.append(el('span', { class: 'dim small' }, `свободных мест ${room} · энергия ${energy}⚡`));
      box.append(hintRow([['A', 'атака'], ['E', 'конец хода'], ['L', 'журнал'], ['H', 'клавиши']]));
    } else if (b.phase === 'combatDeclare') {
      const n = b.attacking.length;
      const unblocked = predictUnblocked(b);
      // dmg уже за вычетом брони лидера и с учётом Двойного удара (бьёт дважды);
      // показываем оба уточнения, чтобы число не выглядело взятым с потолка
      const armorNote = unblocked.absorbed ? ` (броня лидера гасит ${unblocked.absorbed}${unblocked.armorLeft ? `, останется ${unblocked.armorLeft}` : ''})` : '';
      const twinNote = unblocked.names.some((x) => x.includes('×2')) ? ', двойной удар учтён' : '';
      const cpNote = `Очки командования: ${cpLeftAttack(b)} из ${cpBudget(b, 'me')}`;
      box.append(el('div', { class: 'controls__msg' }, n
        ? `⚔ Атакуют ${unblocked.count}. ${cpNote}. Без блока лидер получил бы ${unblocked.dmg}${armorNote}${twinNote}. Клик по своему юниту — добавить или убрать.`
        : `⚔ Отметьте юнитов для атаки или пропустите бой. ${cpNote}.`));
      // Соперник-ИИ блокирует всегда, поэтому «урон без блока» в реальном бою
      // почти не случается. Показываем ожидаемый исход — тем же движком.
      if (n) box.append(defenseForecast(b));
      box.append(btn('⚔ Всеми', () => declareAllAttackers(b), '', { hint: 'A' }));
      box.append(btn('∅ Никем', () => { b.attacking = []; paint(); }, '', { hint: 'X' }));
      box.append(btn('✅ Подтвердить атаку', () => confirmAttack(b), 'primary', { hint: 'Enter', disabled: !n }));
      box.append(btn('↩ Отмена', () => { b.phase = 'main1'; b.attacking = []; paint(); }, 'ghost', { hint: 'Esc' }));
      box.append(hintRow([['Enter', 'подтвердить'], ['A', 'всеми'], ['X', 'никем'], ['Esc', 'отмена']]));
    }
  } else {
    box.append(el('div', { class: 'controls__msg' }, aiRunning ? `Ход соперника: ${side(b, 'foe').name}…` : 'Ожидание соперника…'));
    box.append(el('div', { class: 'thinking', 'aria-hidden': 'true' }, [el('i'), el('i'), el('i')]));
  }
  box.append(btn(uiState.showLog ? '📜 Журнал ▸' : '📜 Журнал ◂', () => {
    uiState.showLog = !uiState.showLog; paint();
  }, 'ghost', { hint: 'L', title: isNarrow() ? 'Журнал боя (отдельное окно)' : 'Показать/скрыть журнал' }));
  return box;
}

function hintRow(pairs) {
  return el('div', { class: 'hints' }, pairs.map(([k, label]) => el('span', { class: 'hint-k' }, [kbd(k), label])));
}

// -----------------------------------------------------------------------------
//  Действия с обратной связью
// -----------------------------------------------------------------------------

/** Снимает якоря ячеек, выполняет действие, затем рисует цифры урона. */
function withFx(b, action) {
  const anchors = collectAnchors(b);
  const snap = snapshotBattle(b, ['me', 'foe']);
  action();
  const events = diffSnapshot(b, ['me', 'foe'], snap);
  paint();
  markHitCells(b, events);
  playEvents(events, anchors);
}

function collectAnchors(b) {
  const map = new Map();
  const root = document.querySelector('.battle');
  if (!root) return map;
  root.querySelectorAll('[data-uid]').forEach((n) => {
    const a = anchorOf(n);
    if (a) map.set(n.dataset.uid, a);
  });
  root.querySelectorAll('[data-anchor]').forEach((n) => {
    const a = anchorOf(n);
    if (a) map.set(n.dataset.anchor, a);
  });
  void b;
  return map;
}

/** Подсветить ячейки, получившие урон, уже в перерисованном DOM. */
function markHitCells(b, events) {
  const root = document.querySelector('.battle');
  if (!root) return;
  void b;
  for (const ev of events) {
    const node = root.querySelector(`[data-uid="${ev.uid}"]`);
    if (!node) continue;
    const cls = ev.kind === 'death' ? 'is-dying' : ev.kind === 'heal' ? 'is-healed' : 'is-hit';
    node.classList.add(cls);
    setTimeout(() => node.classList.remove(cls), 520);
  }
}

function playCardFx(b, action) {
  const anchors = collectAnchors(b);
  const before = side(b, 'me').board.filter(isAlive).map((u) => u.uid);
  action();
  const added = side(b, 'me').board.filter(isAlive).find((u) => !before.includes(u.uid));
  paint();
  if (added) {
    const node = document.querySelector(`.battle [data-uid="${added.uid}"]`);
    const a = node ? anchorOf(node) : anchors.get(added.uid);
    if (a) { floatAt(a, '⚙', 'summon'); flashAt(a, 'summon'); }
  }
}

function resolveFx(b) { withFx(b, () => resolveCombat(b)); }

function confirmAttack(b) {
  b.blockers = {};
  uiState.blocks = {};
  predictionCache = null;
  resolveFx(b);
  afterAction(b);
}

function afterAction(b) {
  paint();
  maybeBanner(b);
  if (b.over) { finishScreen(b); return; }
  if (b.active === 'foe' && !aiRunning && !uiState.blockingMode) runAiTurn(b.phase === 'main2' ? 'afterBlock' : 'start');
}

function commitBlocks(b) {
  b.blockers = {};
  for (const [aid, list] of Object.entries(uiState.blocks)) assignBlock(b, aid, list);
  uiState.blockingMode = false;
  uiState.selectedAttacker = null;
  uiState.blocks = {};
  predictionCache = null;
  resolveFx(b);
  if (b.over) { finishScreen(b); return; }
  runAiTurn('afterBlock');
}

function doEndTurn(b) {
  withFx(b, () => endTurn(b));
  uiState.blocks = {}; uiState.selectedAttacker = null; predictionCache = null;
  afterAction(b);
}

async function concede(b) {
  const yes = await confirmBox({
    title: 'Отступить?',
    text: 'Бой будет засчитан как поражение. Юниты вернутся в строй и получат опыт — карты гибнут только в бою и снова живы к следующему колодостроению.',
    ok: 'Отступить', cancel: 'Продолжить бой', danger: true,
  });
  if (!yes) return;
  b.sides.me.leader.hp = 0;
  b.over = { winner: 'foe', reason: 'Отступление' };
  b.phase = 'over';
  blog(b, '🏳 Вы отступили.', 'bad');
  uiState.blockingMode = false;
  paint();
  finishScreen(b);
}

/** Баннер хода — один раз на смену активного игрока. */
function maybeBanner(b) {
  if (b.over) return;
  const key = `${b.round}:${b.active}`;
  if (uiState.bannerKey === key) return;
  uiState.bannerKey = key;
  if (b.active === 'me') banner('ВАШ ХОД', `Раунд ${b.round} · энергия ${side(b, 'me').maxEnergy}⚡`, 'me');
  else banner(`ХОД: ${side(b, 'foe').name.toUpperCase()}`, `Раунд ${b.round}`, 'foe', 700);
}

// --- журнал ------------------------------------------------------------------
function logBox(b) {
  const list = el('div', {
    class: 'logbox', role: 'log', 'aria-label': 'Журнал боя',
    onscroll: (e) => { uiState.logScroll = e.target.scrollTop; },
  }, b.log.slice(-200).map((l) => el('div', { class: `log log--${l.kind}` }, l.text)));
  requestAnimationFrame(() => {
    if (uiState.logScroll) list.scrollTop = uiState.logScroll;
    else list.scrollTop = list.scrollHeight;
  });
  return el('div', { class: 'logpane' }, [
    el('div', { class: 'logpane__head' }, [
      el('h4', {}, 'Журнал боя'),
      isNarrow() ? el('button', { class: 'modal__x', title: 'Скрыть', onclick: () => { uiState.showLog = false; paint(); } }, '✕') : null,
    ]),
    list,
  ]);
}

// -----------------------------------------------------------------------------
//  Горячие клавиши
// -----------------------------------------------------------------------------
let keysBound = null;
function bindKeys(b) {
  if (keysBound) document.removeEventListener('keydown', keysBound);
  keysBound = (e) => {
    if (e.target && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
    if (document.querySelector('.modal')) { return; }
    const k = e.key.toLowerCase();

    if (k === 'h' || k === 'р') { e.preventDefault(); shortcutsModal(); return; }
    if (k === 'l' || k === 'д') { e.preventDefault(); uiState.showLog = !uiState.showLog; paint(); return; }
    if (b.over) { if (e.key === 'Enter') { e.preventDefault(); finishScreen(b); } return; }

    if (uiState.blockingMode) {
      const atkUnits = b.attacking.map((id) => b.sides.foe.board.find((u) => u.uid === id)).filter(Boolean);
      if (/^[1-9]$/.test(e.key)) {
        const idx = Number(e.key) - 1;
        if (atkUnits[idx]) { uiState.selectedAttacker = atkUnits[idx].uid; e.preventDefault(); paint(); }
        return;
      }
      if (k === 'b' || k === 'и') {
        e.preventDefault();
        uiState.blocks = suggestBlocks(b, 'me') || {}; predictionCache = null; paint(); return;
      }
      if (k === 'x' || k === 'ч') { e.preventDefault(); uiState.blocks = {}; predictionCache = null; paint(); return; }
      if (e.key === 'Enter') { e.preventDefault(); commitBlocks(b); return; }
      return;
    }

    if (b.active !== 'me') return;
    if (b.phase.startsWith('main')) {
      if (k === 'a' || k === 'ф') {
        const can = b.sides.me.board.some((u) => isAlive(u) && canAttack(b, u));
        if (!can) { toast('Нечем атаковать.', 'bad'); return; }
        e.preventDefault(); beginCombat(b); paint(); return;
      }
      if (k === 'e' || k === 'у' || e.key === ' ') { e.preventDefault(); doEndTurn(b); return; }
    } else if (b.phase === 'combatDeclare') {
      if (/^[1-9]$/.test(e.key)) {
        const units = side(b, 'me').board.filter(isAlive);
        const u = units[Number(e.key) - 1];
        if (u) { e.preventDefault(); toggleAttacker(b, u); paint(); }
        return;
      }
      if (k === 'a' || k === 'ф') {
        e.preventDefault();
        declareAllAttackers(b); return;
        paint(); return;
      }
      if (k === 'x' || k === 'ч') { e.preventDefault(); b.attacking = []; paint(); return; }
      if (e.key === 'Enter') { if (b.attacking.length) { e.preventDefault(); confirmAttack(b); } return; }
      if (e.key === 'Escape') { e.preventDefault(); b.phase = 'main1'; b.attacking = []; paint(); return; }
    }
  };
  document.addEventListener('keydown', keysBound);
}

function shortcutsModal() {
  const rows = [
    ['Главная фаза', [['A', 'объявить атаку'], ['E / Пробел', 'конец хода'], ['1–8', 'карта в руке / юнит на поле']]],
    ['Объявление атаки', [['Enter', 'подтвердить атаку'], ['A', 'атаковать всеми'], ['X', 'снять выделение'], ['Esc', 'вернуться в главную фазу']]],
    ['Блокирование', [['Enter', 'принять бой'], ['B', 'автоблок'], ['X', 'снять все блоки'], ['1–9', 'выбрать атакующего']]],
    ['Общие', [['L', 'журнал боя'], ['H', 'эта справка'], ['Esc', 'закрыть окно']]],
  ];
  modal('Горячие клавиши', el('div', { class: 'keys' }, rows.map(([title, list]) => el('div', { class: 'keys__sec' }, [
    el('h4', {}, title),
    el('div', { class: 'keys__list' }, list.map(([k, d]) => el('div', { class: 'keys__row' }, [kbd(k), el('span', {}, d)]))),
  ]))));
}

// -----------------------------------------------------------------------------
//  Ход соперника — пошагово, с задержками
// -----------------------------------------------------------------------------
async function runAiTurn(stage = 'start') {
  const b = app.battle;
  if (!b || b.over || aiRunning) return;
  aiRunning = true;
  paint();
  try {
    if (stage === 'start') {
      let played = 0;
      while (!b.over && aiPlayOne(b, 'foe') && played++ < 12) { paint(); await sleep(380); }
      if (b.over) return;
      const attackers = aiDeclareAttack(b, 'foe');
      if (attackers.length) {
        paint(); await sleep(420);
        uiState.blockingMode = true;
        uiState.blocks = {};
        uiState.selectedAttacker = attackers.length === 1 ? attackers[0].uid : null;
        predictionCache = null;
        paint();
        if (attackers.length >= 3) shake(0.8);
        return; // дальше действует игрок: commitBlocks → runAiTurn('afterBlock')
      }
    }
    let more = 0;
    while (!b.over && aiPlayOne(b, 'foe') && more++ < 12) { paint(); await sleep(280); }
    if (b.over) return;
    withFx(b, () => endTurn(b));
    maybeBanner(b);
    paint();
  } finally {
    aiRunning = false;
  }
  if (b.over) finishScreen(b);
  else paint();
}

// -----------------------------------------------------------------------------
//  Брифинг перед боем
// -----------------------------------------------------------------------------
function briefing(b) {
  const st = app.state;
  const region = app.battleCtx?.region;
  const me = side(b, 'me'), foe = side(b, 'foe');
  const e = b.cfg;
  const body = el('div', { class: 'brief' }, [
    el('div', { class: 'brief__vs' }, [
      el('div', { class: 'brief__side brief__side--me' }, [
        el('b', {}, me.name),
        el('span', { class: 'dim small' }, `эпоха ${ROMAN[b.era]} · ${st.legacy ? DOMAINS[st.legacy].name : ''}`),
        el('div', { class: 'brief__hp' }, `${me.leader.maxHp} HP`),
        el('div', { class: 'dim small' }, `колода ${me.deck.length + me.hand.length}, свойств ${countKw(me)}`),
      ]),
      el('div', { class: 'brief__x' }, '⚔'),
      el('div', { class: 'brief__side brief__side--foe' }, [
        el('b', {}, foe.name),
        el('span', { class: 'dim small' }, region?.civ?.name || 'соперник'),
        el('div', { class: 'brief__hp' }, `${foe.leader.maxHp} HP`),
        el('div', { class: 'dim small' }, `колода ${foe.deck.length + foe.hand.length}, свойств ${countKw(foe)}`),
      ]),
    ]),
    el('div', { class: 'brief__rules' }, [
      rule('🎴', `Поле: ${e.slots} мест у каждой стороны`),
      rule('⚡', `Энергия растёт каждый ход до ${e.energyCap}`),
      rule('🂠', `Добор ${e.draw} в ход, предел руки ${e.handLimit}`),
      rule('⏳', `Юнит не может атаковать в ход выставления — если нет Рывка`),
      rule('🛡', `Атака → вы назначаете блокеров → урон наносится одновременно`),
      rule('🏆', `Победа: снизить здоровье лидера соперника до нуля`),
    ]),
    region ? el('div', { class: 'brief__stake' }, [
      el('span', {}, 'Ставка'),
      el('b', {}, `+${region.reward.science} 🔬`),
      el('b', {}, `+${region.reward.materials} 🧱`),
      el('b', {}, `регион «${region.name}» 🚩`),
    ]) : null,
  ]);
  const m = modal(region ? `Бой за «${region.name}»` : 'Бой', body, {
    footer: [btn('⚔ Начать бой', () => m.close(), 'primary', { hint: 'Enter' })],
  });
}
const rule = (i, t) => el('div', { class: 'brief__rule' }, [el('span', {}, i), el('span', {}, t)]);
function countKw(s) {
  const all = [...s.deck, ...s.hand, ...s.board];
  return all.reduce((n, u) => n + (u.keywords?.length || 0), 0);
}

// -----------------------------------------------------------------------------
//  Итоги боя
// -----------------------------------------------------------------------------
function finishScreen(b) {
  if (b.__settled) { showAftermath(b, b.__after); return; }
  const won = b.over?.winner === 'me';
  const st = app.state;
  const rewards = S.finishBattle(st, b, won ? 'win' : 'lose');
  persist();
  b.__settled = true;
  b.__after = { won, rewards };
  uiState.blockingMode = false;
  if (won) banner('ПОБЕДА', regionName(), 'me', 1200); else banner('ПОРАЖЕНИЕ', regionName(), 'foe', 1200);
  showAftermath(b, b.__after);
}

function regionName() { return app.battleCtx?.region?.name || ''; }

/**
 * Разбор исхода: почему бой закончился именно так. Награды отвечают на «что я
 * получил», но не на «что мне исправить» — а это главный источник обучения.
 */
function diagnosisBlock(d, won) {
  const rows = [];
  for (const v of d.verdict) rows.push(el('div', { class: 'diag__row' }, [
    el('span', { class: 'diag__mark' }, '·'), el('span', {}, v),
  ]));
  const tips = d.advice.map((a) => el('div', { class: 'diag__tip' }, [
    el('span', { class: 'diag__mark' }, '→'), el('span', {}, a),
  ]));
  const top = d.topDamage.me.slice(0, 3);
  return el('div', { class: `diag${won ? ' diag--won' : ' diag--lost'}` }, [
    el('h4', {}, won ? 'Как прошёл бой' : 'Почему бой проигран'),
    el('div', { class: 'diag__list' }, rows),
    tips.length ? el('div', { class: 'diag__advice' }, tips) : null,
    top.length ? el('div', { class: 'diag__top' }, [
      el('span', { class: 'diag__top-l' }, 'урон вашему лидеру'),
      ...top.map((t) => el('span', { class: 'diag__chip', title: `«${t.name}» снял ${t.total} здоровья за бой` }, [
        el('b', {}, String(t.total)), el('span', {}, t.name),
      ])),
    ]) : null,
  ]);
}

function showAftermath(b, { won, rewards }) {
  const st = app.state;
  const vetLines = (rewards.veterans || []);
  const body = el('div', { class: 'aftermath' }, [
    el('div', { class: won ? 'big-ok' : 'big-bad' }, won
      ? `🏆 ${b.sides.foe.name} разбиты за ${b.round} раундов`
      : `💀 Поражение от ${b.sides.foe.name} за ${b.round} раундов`),
    el('div', { class: 'kv' }, [
      el('div', { class: 'kv__row' }, [el('span', {}, 'Ваш лидер'), el('b', {}, `${Math.max(0, b.sides.me.leader.hp)}/${b.sides.me.leader.maxHp}`)]),
      el('div', { class: 'kv__row' }, [el('span', {}, 'Лидер врага'), el('b', {}, `${Math.max(0, b.sides.foe.leader.hp)}/${b.sides.foe.leader.maxHp}`)]),
      el('div', { class: 'kv__row' }, [el('span', {}, 'Пало ваших юнитов'), el('b', {}, String(b.sides.me.grave.length))]),
      el('div', { class: 'kv__row' }, [el('span', {}, 'Убито врагов'), el('b', {}, String(b.sides.foe.grave.length))]),
    ]),
    diagnosisBlock(diagnoseBattle(b), won),
    el('h4', {}, 'Награды'),
    el('div', { class: 'deckstats' }, [
      el('div', { class: 'dstat' }, [el('b', {}, `+${rewards.science}`), el('span', {}, 'наука 🔬')]),
      el('div', { class: 'dstat' }, [el('b', {}, `+${rewards.materials}`), el('span', {}, 'материалы 🧱')]),
      rewards.region ? el('div', { class: 'dstat dstat--hl' }, [el('b', {}, rewards.region), el('span', {}, 'регион 🚩')]) : null,
      rewards.stolen ? el('div', { class: 'dstat dstat--hl' }, [el('b', {}, rewards.stolen), el('span', {}, 'трофей 📜')]) : null,
    ]),
    vetLines.length ? el('div', { class: 'aftermath__vet' }, [
      el('h4', {}, 'Повышения'),
      el('div', { class: 'vetlist' }, vetLines.map((v) => el('div', { class: 'vetrow' }, [
        el('b', {}, v.name), el('span', {}, '★'.repeat(v.tier)), el('span', { class: 'dim' }, v.title),
      ]))),
    ]) : null,
    el('p', { class: 'hint' }, 'Павшие юниты вернулись в строй: карты гибнут только в бою и снова живы к следующему колодостроению. Все участники боя получили опыт.'),
    el('details', { class: 'aftermath__log' }, [
      el('summary', {}, `Журнал боя (${b.log.length} записей)`),
      el('div', { class: 'logbox logbox--tall' }, b.log.slice(-140).map((l) => el('div', { class: `log log--${l.kind}` }, l.text))),
    ]),
  ]);
  const m = modal(won ? 'Победа' : 'Поражение', body, {
    footer: [btn(st.victory ? '👑 Итоги партии' : '🗺 К карте мира', () => {
      m.close();
      app.battle = null; app.battleCtx = null; app.screen = 'hub'; app.tab = 'map';
      resetBattleUi();
      if (keysBound) { document.removeEventListener('keydown', keysBound); keysBound = null; }
      render();
      if (st.victory) victoryScreen(st);
    }, 'primary', { hint: 'Enter' })],
  });
}

function victoryScreen(st) {
  const m = modal('👑 ПОБЕДА В ПАРТИИ', el('div', { class: 'victory' }, [
    el('p', { class: 'big-ok' }, `${st.civName} прошла шесть эпох и взяла Сердцевину.`),
    el('div', { class: 'deckstats' }, [
      el('div', { class: 'dstat' }, [el('b', {}, String(st.stats.turns)), el('span', {}, 'ходов')]),
      el('div', { class: 'dstat' }, [el('b', {}, `${st.stats.wins}/${st.stats.battles}`), el('span', {}, 'побед')]),
      el('div', { class: 'dstat' }, [el('b', {}, String(st.researched.length)), el('span', {}, 'открытий')]),
      el('div', { class: 'dstat' }, [el('b', {}, String(Object.keys(st.blueprints).length)), el('span', {}, 'проектов')]),
      el('div', { class: 'dstat' }, [el('b', {}, String(st.roster.length)), el('span', {}, 'юнитов')]),
    ]),
    el('h4', {}, 'Ваши сильнейшие проекты'),
    el('div', { class: 'decklist decklist--flat' }, Object.values(st.blueprints)
      .sort((a, c) => (c.atk * 1.1 + c.hp) - (a.atk * 1.1 + a.hp)).slice(0, 6)
      .map((bp) => renderCard(bp, { size: 'sm' }))),
    el('p', { class: 'hint' }, 'Партию можно продолжать: изучайте оставшиеся открытия эпохи Атома и ищите мифические сочетания шестерёнок.'),
  ]), { footer: [btn('Продолжить', () => m.close(), 'primary')] });
}

export { runAiTurn, unitAtk, unitHp };
