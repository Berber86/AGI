// =============================================================================
//  ШЕСТЕРНИ ЭПОХ — ui/screens/battle.js
//  Боевой экран: поле, рука, фазы, объявление атакующих и назначение блокеров.
//  Ход соперника разыгрывается пошагово с задержками, чтобы было видно, что он
//  выставляет и кем бьёт.
// =============================================================================

import { el, btn, mount, modal } from '../dom.js';
import { app, persist, toast, render } from '../app.js';
import { renderCard, ROMAN } from '../cards.js';
import { S, DOMAINS } from '../shared.js';
import {
  startTurn, endTurn, resolveCombat, beginCombat, toggleAttacker, playCard, canPlay, canAttack,
  isAlive, unitAtk, unitHp, side, legalBlockers, assignBlock, effectiveCost, boardRoom,
  log as blog,
} from '../../engine/battle.js';
import { aiPlayOne, aiDeclareAttack, suggestBlocks } from '../../engine/ai.js';

let paintRef = null;
let aiRunning = false;
const uiState = { selectedAttacker: null, blocks: {}, blockingMode: false, showLog: true };

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const paint = () => paintRef && paintRef();

export function renderBattle() {
  const b = app.battle;
  if (!b) { app.screen = 'hub'; return el('div', {}, 'Бой не найден.'); }
  if (b.phase === 'idle') startTurn(b);

  const root = el('div', { class: 'battle' });
  paintRef = () => mount(root, layout(b));
  paintRef();
  if (b.active === 'foe' && !b.over && !aiRunning && !uiState.blockingMode) runAiTurn('start');
  return root;
}

// -----------------------------------------------------------------------------
function layout(b) {
  const wrap = el('div', { class: 'battle__wrap' });
  const board = el('div', { class: 'battle__board' });
  board.append(
    leaderBar(b, 'foe'),
    rowOf(b, 'foe'),
    phaseRibbon(b),
    rowOf(b, 'me'),
    leaderBar(b, 'me'),
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
  return el('div', { class: `leader leader--${id}` }, [
    el('div', { class: 'leader__id', style: { '--c': s.color || dom.color } }, [
      el('span', { class: 'leader__glyph', text: dom.glyph }),
      el('div', {}, [
        el('b', {}, s.name),
        el('span', { class: 'leader__sub', text: id === 'me' ? 'ваша держава' : (app.battleCtx?.region?.civ?.name || 'соперник') }),
      ]),
    ]),
    el('div', { class: 'leader__hp' }, [
      el('div', { class: 'hpbar' }, el('i', { style: { width: `${pct}%`, background: pct > 50 ? '#5c9e4f' : pct > 25 ? '#c9a227' : '#c8452f' } })),
      el('b', {}, `${Math.max(0, s.leader.hp)} / ${s.leader.maxHp}`),
      s.leader.armor ? el('span', { class: 'chip chip--armor', text: `🛡 ${s.leader.armor}` }) : null,
      s.leader.shroud ? el('span', { class: 'chip', text: '🜚 Помехи' }) : null,
    ]),
    el('div', { class: 'leader__nums' }, [
      num('⚡', `${s.energy}/${s.maxEnergy || 0}`, 'энергия сейчас / потолок хода'),
      num('🂠', s.hand.length, 'карт в руке'),
      num('⛁', s.deck.length, 'в колоде'),
      num('☠', s.grave.length, 'пало в этом бою'),
      num('📉', s.fatigue || 0, 'усталость от пустой колоды'),
    ]),
  ]);
}
const num = (i, v, t) => el('span', { class: 'num', title: t }, [el('i', {}, i), el('b', {}, String(v))]);

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

  const card = renderCard(u, { size: 'sm', tooltip: false, onClick: () => onUnitClick(b, u, id) });
  const badge = el('div', { class: 'bunit__badge' }, [
    el('span', { class: 'bunit__atk', text: String(unitAtk(b, u)) }),
    el('span', { class: `bunit__hp${u.damage ? ' bunit__hp--hurt' : ''}`, text: String(Math.max(0, unitHp(u) - u.damage)) }),
  ]);
  const wrap = el('div', { class: cls.join(' '), dataset: { pos: String(pos) } }, [card, badge]);

  if (attacking && assignedHere.length) {
    wrap.append(el('div', { class: 'bunit__to', text: `блок: ${assignedHere.length}` }));
  }
  if (attacking && id === 'foe' && uiState.blockingMode && !assignedHere.length) {
    wrap.append(el('div', { class: 'bunit__to bunit__to--open', text: 'не заблокирован' }));
  }
  if (u.sick && !u.exhausted) wrap.append(el('div', { class: 'bunit__sick', text: '⏳' }));
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
    if (!uiState.selectedAttacker) { toast('Сначала выберите атакующего юнита сверху.', 'bad'); return; }
    const atk = b.sides.foe.board.find((x) => x.uid === uiState.selectedAttacker);
    if (!atk) { toast('Атакующий исчез.', 'bad'); return; }
    if (!legalBlockers(b, atk).includes(u)) {
      toast(atk.fx.siege && !u.fx.reach ? 'Осадного юнита блокируют только юниты с Захватом.' : 'Этот юнит не может блокировать.', 'bad');
      return;
    }
    const cur = uiState.blocks[uiState.selectedAttacker] || [];
    if (cur.includes(u.uid)) {
      uiState.blocks[uiState.selectedAttacker] = cur.filter((x) => x !== u.uid);
    } else {
      const elsewhere = Object.entries(uiState.blocks).filter(([k]) => k !== uiState.selectedAttacker).flatMap(([, v]) => v);
      const cap = u.fx.tactician ? 2 : 1;
      if (elsewhere.filter((x) => x === u.uid).length >= cap) {
        toast(u.fx.tactician ? 'Стратег уже блокирует двоих.' : 'Юнит уже блокирует другого атакующего.', 'bad'); return;
      }
      uiState.blocks[uiState.selectedAttacker] = [...cur, u.uid];
    }
    paint(); return;
  }

  // моя фаза атаки
  if (id === 'me' && b.active === 'me' && b.phase === 'combatDeclare') {
    if (!toggleAttacker(b, u)) {
      if (u.exhausted) toast('Юнит истощён: он уже действовал.', 'bad');
      else if (u.sick) toast('Болезнь выставления: юнит может атаковать со следующего хода (Рывок снимает её).', 'bad');
      else toast('Этот юнит не может атаковать.', 'bad');
    }
    paint(); return;
  }

  showUnitModal(b, u);
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
    ...PHASES.map(([id, name]) => el('div', { class: `ph${cur === id ? ' ph--on' : ''}` }, name)),
    el('div', { class: 'ph-turn' }, [
      el('b', {}, `Раунд ${b.round}`),
      el('span', {}, b.active === 'me' ? ' · ваш ход' : ` · ход ${side(b, 'foe').name}`),
      el('span', { class: 'dim' }, ` · эпоха ${ROMAN[b.era]}`),
    ]),
  ]);
}

// --- рука --------------------------------------------------------------------
function handRow(b) {
  const s = side(b, 'me');
  const box = el('div', { class: 'hand' });
  box.append(el('div', { class: 'hand__label' }, [`Рука ${s.hand.length}/${b.cfg.handLimit}`]));
  if (!s.hand.length) box.append(el('div', { class: 'hand__empty' }, '—'));
  for (const u of s.hand) {
    const playable = canPlay(b, u) && b.active === 'me' && !b.over && !aiRunning && !uiState.blockingMode;
    const cost = effectiveCost(b, u);
    const cell = el('div', { class: `handcell${playable ? ' handcell--ok' : ''}` }, [
      renderCard(u, {
        size: 'sm', playable, dim: !playable, tooltip: false,
        onClick: () => {
          if (b.over || b.active !== 'me' || aiRunning || uiState.blockingMode) return;
          if (!canPlay(b, u)) {
            if (!b.phase.startsWith('main')) toast('Выставлять юнитов можно только в главную фазу.', 'bad');
            else if (cost > s.energy) toast(`Нужно ${cost}⚡, у вас ${s.energy}⚡.`, 'bad');
            else if (boardRoom(b, 'me') <= 0) toast(`Поле заполнено: ${b.cfg.slots} мест в эпохе ${ROMAN[b.era]}.`, 'bad');
            return;
          }
          playCard(b, u);
          paint();
        },
      }),
      playable ? el('div', { class: 'handcell__go', text: 'выставить' }) : null,
    ]);
    box.append(cell);
  }
  return box;
}

// --- кнопки ------------------------------------------------------------------
function controls(b) {
  const box = el('div', { class: 'controls' });
  if (b.over) {
    box.append(el('div', { class: 'controls__msg' }, b.over.winner === 'me' ? '🏆 Победа!' : b.over.winner === 'draw' ? '⚖ Ничья' : '💀 Поражение'));
    box.append(btn('Итоги боя', () => finishScreen(b), 'primary'));
    return box;
  }

  if (uiState.blockingMode) {
    box.append(el('div', { class: 'controls__msg' }, `🛡 Назначьте блокеров: клик по вражескому юниту — выбрать атакующего, клик по своему — поставить в блок. Атакующих: ${b.attacking.length}.`));
    box.append(btn('⚙ Автоблок', () => { uiState.blocks = suggestBlocks(b, 'me') || {}; paint(); }));
    box.append(btn('∅ Снять блок', () => { uiState.blocks = {}; paint(); }));
    box.append(btn('⚔ Принять бой', () => commitBlocks(b), 'primary'));
    box.append(btn('🏳 Отступить', () => concede(b), 'danger-ghost'));
    return box;
  }

  if (b.active === 'me') {
    if (b.phase.startsWith('main')) {
      box.append(el('div', { class: 'controls__msg' }, `${b.phase === 'main1' ? 'Главная фаза' : 'Фаза после боя'}: выставляйте юнитов из руки и объявляйте атаку.`));
      box.append(btn('⚔ В атаку', () => { beginCombat(b); paint(); }));
      box.append(btn('⏭ Конец хода', () => doEndTurn(b), 'primary'));
      box.append(el('span', { class: 'dim small' }, `свободных мест ${boardRoom(b, 'me')} · энергия ${side(b, 'me').energy}⚡`));
    } else if (b.phase === 'combatDeclare') {
      const n = b.attacking.length;
      box.append(el('div', { class: 'controls__msg' }, n ? `⚔ Атакуют ${n}. Клик по своему юниту — добавить или убрать из атаки.` : '⚔ Отметьте юнитов для атаки или пропустите бой.'));
      box.append(btn('⚔ Всеми', () => {
        for (const u of side(b, 'me').board.filter(isAlive)) if (canAttack(b, u) && !b.attacking.includes(u.uid)) b.attacking.push(u.uid);
        paint();
      }));
      box.append(btn('∅ Никем', () => { b.attacking = []; paint(); }));
      box.append(btn('✅ Подтвердить атаку', () => {
        b.blockers = {}; uiState.blocks = {};
        resolveCombat(b);
        afterAction(b);
      }, 'primary'));
      box.append(btn('↩ Отмена', () => { b.phase = 'main1'; b.attacking = []; paint(); }));
    }
  } else {
    box.append(el('div', { class: 'controls__msg' }, aiRunning ? `Ход соперника: ${side(b, 'foe').name}…` : 'Ожидание соперника…'));
  }
  box.append(btn(uiState.showLog ? '📜 Журнал ▸' : '📜 Журнал ◂', () => { uiState.showLog = !uiState.showLog; paint(); }, 'ghost'));
  return box;
}

function afterAction(b) {
  paint();
  if (b.over) { finishScreen(b); return; }
  if (b.active === 'foe' && !aiRunning && !uiState.blockingMode) runAiTurn(b.phase === 'main2' ? 'afterBlock' : 'start');
}

function commitBlocks(b) {
  b.blockers = {};
  for (const [aid, list] of Object.entries(uiState.blocks)) assignBlock(b, aid, list);
  uiState.blockingMode = false;
  uiState.selectedAttacker = null;
  uiState.blocks = {};
  resolveCombat(b);
  paint();
  if (b.over) { finishScreen(b); return; }
  runAiTurn('afterBlock');
}

function doEndTurn(b) {
  endTurn(b);
  uiState.blocks = {}; uiState.selectedAttacker = null;
  afterAction(b);
}

function concede(b) {
  if (!confirm('Отступить? Бой будет засчитан как поражение, но юниты вернутся в строй.')) return;
  b.sides.me.leader.hp = 0;
  b.over = { winner: 'foe', reason: 'Отступление' };
  b.phase = 'over';
  blog(b, '🏳 Вы отступили.', 'bad');
  uiState.blockingMode = false;
  paint();
  finishScreen(b);
}

// --- журнал ------------------------------------------------------------------
function logBox(b) {
  const list = el('div', { class: 'logbox' }, b.log.slice(-200).map((l) => el('div', { class: `log log--${l.kind}` }, l.text)));
  requestAnimationFrame(() => { list.scrollTop = list.scrollHeight; });
  return el('div', { class: 'logpane' }, [el('h4', {}, 'Журнал боя'), list]);
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
      while (!b.over && aiPlayOne(b, 'foe') && played++ < 12) { paint(); await sleep(400); }
      if (b.over) return;
      const attackers = aiDeclareAttack(b, 'foe');
      if (attackers.length) {
        paint(); await sleep(480);
        uiState.blockingMode = true;
        uiState.blocks = {};
        uiState.selectedAttacker = null;
        paint();
        return; // дальше действует игрок: commitBlocks → runAiTurn('afterBlock')
      }
    }
    let more = 0;
    while (!b.over && aiPlayOne(b, 'foe') && more++ < 12) { paint(); await sleep(300); }
    if (b.over) return;
    endTurn(b);
    paint();
  } finally {
    aiRunning = false;
  }
  if (b.over) finishScreen(b);
  else paint();
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
  showAftermath(b, b.__after);
}

function showAftermath(b, { won, rewards }) {
  const st = app.state;
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
    el('h4', {}, 'Награды'),
    el('div', { class: 'deckstats' }, [
      el('div', { class: 'dstat' }, [el('b', {}, `+${rewards.science}`), el('span', {}, 'наука 🔬')]),
      el('div', { class: 'dstat' }, [el('b', {}, `+${rewards.materials}`), el('span', {}, 'материалы 🧱')]),
      rewards.region ? el('div', { class: 'dstat' }, [el('b', {}, rewards.region), el('span', {}, 'регион 🚩')]) : null,
      rewards.stolen ? el('div', { class: 'dstat' }, [el('b', {}, rewards.stolen), el('span', {}, 'трофей 📜')]) : null,
    ]),
    el('p', { class: 'hint' }, 'Павшие юниты вернулись в строй: карты гибнут только в бою и снова живы к следующему колодостроению. Все участники боя получили опыт.'),
    el('div', { class: 'logbox logbox--tall' }, b.log.slice(-140).map((l) => el('div', { class: `log log--${l.kind}` }, l.text))),
  ]);
  const m = modal(won ? 'Победа' : 'Поражение', body, {
    footer: [btn(st.victory ? '👑 Итоги партии' : '🗺 К карте мира', () => {
      m.close();
      app.battle = null; app.battleCtx = null; app.screen = 'hub'; app.tab = 'map';
      render();
      if (st.victory) victoryScreen(st);
    }, 'primary')],
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
