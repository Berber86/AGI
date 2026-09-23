// =============================================================================
//  ШЕСТЕРНИ ЭПОХ — ui/fx.js
//  Слой мгновенной обратной связи: всплывающие цифры урона и лечения, вспышки
//  попаданий, баннеры хода, внутриигровое подтверждение вместо confirm(),
//  дельты ресурсов в шапке.
//
//  Всё живёт в отдельном оверлее #fx и НЕ зависит от перерисовки экрана:
//  координаты снимаются с элемента до перерисовки, поэтому цифры урона
//  остаются на месте даже после того, как поле пересобрано.
// =============================================================================

import { el } from './dom.js';

let layer = null;
export function fxLayer() {
  // Узел мог быть удалён вместе с перерисовкой — проверяем связность,
  // иначе эффекты улетят в оторванный от документа элемент.
  if (layer && !layer.isConnected) layer = null;
  if (!layer) {
    layer = document.getElementById('fx');
    if (!layer || !layer.isConnected) {
      layer = el('div', { id: 'fx', 'aria-hidden': 'true' });
      document.body.append(layer);
    }
  }
  return layer;
}

const reduced = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Центр элемента в координатах вьюпорта (до перерисовки). */
export function anchorOf(node) {
  if (!node || typeof node.getBoundingClientRect !== 'function') return null;
  const r = node.getBoundingClientRect();
  if (!r.width && !r.height) return null;
  return { x: r.left + r.width / 2, y: r.top + r.height / 2, top: r.top, left: r.left, w: r.width, h: r.height };
}

/**
 * Всплывающий текст в заданной точке.
 * @param {{x:number,y:number}|null} a — точка; null ⇒ в центр экрана
 */
export function floatAt(a, text, kind = 'dmg') {
  if (reduced() || !a) return;
  const n = el('div', { class: `fx-float fx-float--${kind}`, text: String(text) });
  const jitter = (Math.random() - 0.5) * 26;
  n.style.left = `${Math.round(a.x + jitter)}px`;
  n.style.top = `${Math.round(a.y - 8)}px`;
  fxLayer().append(n);
  requestAnimationFrame(() => n.classList.add('is-on'));
  setTimeout(() => { n.classList.remove('is-on'); n.classList.add('is-out'); setTimeout(() => n.remove(), 420); }, 780);
}

/** Всплывающий текст, привязанный к живому элементу. */
export function floatOn(node, text, kind) {
  const a = anchorOf(node);
  if (a) floatAt(a, text, kind);
}

/** Короткая вспышка поверх элемента (попадание / лечение / гибель). */
export function flashAt(a, kind = 'hit') {
  if (reduced() || !a) return;
  const n = el('div', { class: `fx-flash fx-flash--${kind}` });
  n.style.left = `${Math.round(a.left)}px`;
  n.style.top = `${Math.round(a.top)}px`;
  n.style.width = `${Math.round(a.w)}px`;
  n.style.height = `${Math.round(a.h)}px`;
  fxLayer().append(n);
  requestAnimationFrame(() => n.classList.add('is-on'));
  setTimeout(() => n.remove(), 520);
}

/** Тряска экрана — для урона лидеру и прочих тяжёлых событий. */
export function shake(power = 1) {
  if (reduced()) return;
  const app = document.getElementById('app');
  if (!app) return;
  app.style.setProperty('--shake', String(power));
  app.classList.remove('is-shaking');
  void app.offsetWidth;
  app.classList.add('is-shaking');
  setTimeout(() => app.classList.remove('is-shaking'), 420);
}

// --- баннер хода -------------------------------------------------------------
let bannerTimer = null;
export function banner(title, sub = '', kind = 'me', ms = 900) {
  const box = el('div', { class: `fx-banner fx-banner--${kind}` }, [
    el('b', {}, title),
    sub ? el('span', {}, sub) : null,
  ]);
  fxLayer().append(box);
  requestAnimationFrame(() => box.classList.add('is-on'));
  clearTimeout(bannerTimer);
  bannerTimer = setTimeout(() => {
    box.classList.remove('is-on');
    box.classList.add('is-out');
    setTimeout(() => box.remove(), 420);
  }, reduced() ? 120 : ms);
}

// --- дельты ресурсов ---------------------------------------------------------
/** Показывает «+24» рядом с элементом-счётчиком ресурса. */
export function delta(node, amount, suffix = '') {
  if (!amount) return;
  const a = anchorOf(node);
  if (!a) return;
  floatAt({ x: a.x, y: a.top + 4 }, `${amount > 0 ? '+' : ''}${amount}${suffix}`, amount > 0 ? 'gain' : 'dmg');
}

// --- внутриигровое подтверждение --------------------------------------------
/**
 * Замена window.confirm: не блокирует поток, выглядит как часть игры.
 * @returns {Promise<boolean>}
 */
export function confirmBox({ title = 'Подтвердите', text = '', ok = 'Да', cancel = 'Отмена', danger = false } = {}) {
  return new Promise((resolve) => {
    let done = false;
    const finish = (v) => {
      if (done) return;
      done = true;
      document.removeEventListener('keydown', onKey, true);
      overlay.remove();
      resolve(v);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); finish(false); }
      if (e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); finish(true); }
    };
    const box = el('div', { class: 'modal__box modal__box--sm', role: 'alertdialog', 'aria-modal': 'true' }, [
      el('div', { class: 'modal__head' }, [el('h3', {}, title)]),
      el('div', { class: 'modal__body' }, [el('p', { class: 'confirm__text' }, text)]),
      el('div', { class: 'modal__foot' }, [
        el('button', { class: `btn ${danger ? 'danger' : 'primary'}`, onclick: () => finish(true) }, ok),
        el('button', { class: 'btn ghost', onclick: () => finish(false) }, cancel),
      ]),
    ]);
    const overlay = el('div', { class: 'modal', onclick: (e) => { if (e.target === overlay) finish(false); } }, box);
    document.body.append(overlay);
    document.addEventListener('keydown', onKey, true);
    const primary = box.querySelector('.btn');
    if (primary) primary.focus();
  });
}

// --- снимок состояния для расчёта дельт урона -------------------------------
/**
 * Снимает «до» со всех юнитов и лидеров боя. Возвращает карту uid → {dmg, hp, dead}
 * плюс hp лидеров. После разрешения боя diffSnapshot() подскажет, где какие
 * цифры рисовать.
 */
export function snapshotBattle(b, sides) {
  const snap = { units: {}, leaders: {} };
  for (const id of sides) {
    const s = b.sides[id];
    snap.leaders[id] = s.leader.hp;
    for (const u of s.board) snap.units[u.uid] = { dmg: u.damage || 0, dead: !!u.dead, hp: u.hp };
  }
  return snap;
}

/**
 * Разница между снимком и текущим состоянием: список событий
 * { uid, side, amount, kind } для отрисовки цифр.
 */
export function diffSnapshot(b, sides, snap) {
  const out = [];
  for (const id of sides) {
    const s = b.sides[id];
    for (const u of s.board) {
      const before = snap.units[u.uid];
      if (!before) continue;
      const deltaDmg = (u.damage || 0) - before.dmg;
      if (deltaDmg > 0) out.push({ uid: u.uid, side: id, amount: deltaDmg, kind: 'dmg' });
      else if (deltaDmg < 0) out.push({ uid: u.uid, side: id, amount: -deltaDmg, kind: 'heal' });
      if (u.dead && !before.dead) out.push({ uid: u.uid, side: id, amount: 0, kind: 'death' });
    }
    // юнит мог уйти с поля (кладбище) — гибель видна по отсутствию
    for (const [uid, before] of Object.entries(snap.units)) {
      if (before.dead) continue;
      const still = s.board.some((x) => x.uid === uid);
      if (!still && !out.some((e) => e.uid === uid && e.kind === 'death')) {
        out.push({ uid, side: id, amount: 0, kind: 'death' });
      }
    }
    const dHp = s.leader.hp - snap.leaders[id];
    if (dHp !== 0) out.push({ uid: `leader:${id}`, side: id, amount: Math.abs(dHp), kind: dHp < 0 ? 'leader' : 'heal' });
  }
  return out;
}

/**
 * Проигрывает список событий: цифры по сохранённым якорям.
 * @param {Map<string, {x:number,y:number,top:number,left:number,w:number,h:number}>} anchors uid → якорь
 */
export function playEvents(events, anchors) {
  let heaviest = 0;
  for (const ev of events) {
    const a = anchors.get(ev.uid);
    if (!a) continue;
    if (ev.kind === 'dmg') { floatAt(a, `−${ev.amount}`, 'dmg'); flashAt(a, 'hit'); heaviest = Math.max(heaviest, ev.amount); }
    else if (ev.kind === 'heal') { floatAt(a, `+${ev.amount}`, 'heal'); flashAt(a, 'heal'); }
    else if (ev.kind === 'death') { floatAt(a, '☠', 'death'); flashAt(a, 'death'); }
    else if (ev.kind === 'leader') { floatAt(a, `−${ev.amount}`, 'leader'); flashAt(a, 'leader'); }
  }
  const leaderHit = events.find((e) => e.kind === 'leader');
  if (leaderHit) shake(Math.min(2.2, 0.7 + leaderHit.amount / 12));
  else if (heaviest >= 6) shake(0.6);
}
