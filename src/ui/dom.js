// =============================================================================
//  ШЕСТЕРНИ ЭПОХ — ui/dom.js
//  Мини-хелперы для разметки без фреймворков.
// =============================================================================

export function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === null || v === undefined || v === false) continue;
    if (k === 'class') node.className = v;
    else if (k === 'html') node.innerHTML = v;
    else if (k === 'text') node.textContent = v;
    else if (k === 'style' && typeof v === 'object') Object.assign(node.style, v);
    else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k === 'dataset') Object.assign(node.dataset, v);
    else node.setAttribute(k, v);
  }
  const list = Array.isArray(children) ? children : [children];
  for (const c of list) {
    if (c === null || c === undefined || c === false) continue;
    node.append(typeof c === 'string' || typeof c === 'number' ? document.createTextNode(String(c)) : c);
  }
  return node;
}

export const clear = (node) => { while (node.firstChild) node.removeChild(node.firstChild); return node; };

export function mount(parent, ...nodes) {
  clear(parent);
  for (const n of nodes.flat()) if (n) parent.append(n);
  return parent;
}

export function on(node, ev, fn, opts) { node.addEventListener(ev, fn, opts); return () => node.removeEventListener(ev, fn, opts); }

/**
 * Кнопка. opts.hint добавляет подсказку горячей клавиши прямо в кнопку —
 * так игрок узнаёт о шорткатах в моменте, а не из справки.
 */
export function btn(label, onClick, cls = '', opts = {}) {
  const title = [opts.title || '', opts.hint ? ` [${opts.hint}]` : ''].filter(Boolean).join('');
  const children = [label];
  if (opts.hint) children.push(kbd(opts.hint, 'btn__hint'));
  return el('button', {
    class: `btn ${cls}`.trim(), onclick: onClick, disabled: opts.disabled,
    title, dataset: opts.dataset || {}, 'aria-label': opts.aria || '',
  }, children);
}

/** Клавиша-подсказка. */
export function kbd(text, cls = '') {
  return el('kbd', { class: `kbd ${cls}`.trim(), text: String(text) });
}

/**
 * Модальное окно. Ставит фокус внутрь, держит Tab в пределах окна
 * (ловушка фокуса) и закрывается по Escape.
 */
export function modal(titleText, bodyNode, opts = {}) {
  const close = () => {
    overlay.remove();
    document.removeEventListener('keydown', onKey);
    if (restoreFocus && typeof restoreFocus.focus === 'function') { try { restoreFocus.focus(); } catch { /* узел мог исчезнуть */ } }
  };
  const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  const onKey = (e) => {
    if (e.key === 'Escape') { e.preventDefault(); close(); return; }
    if (e.key !== 'Tab') return;
    const items = [...box.querySelectorAll(FOCUSABLE)].filter((n) => !n.disabled && n.offsetParent !== null);
    if (!items.length) return;
    const first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };
  const box = el('div', {
    class: `modal__box${opts.small ? ' modal__box--sm' : ''}`,
    role: 'dialog', 'aria-modal': 'true', 'aria-label': String(titleText),
  }, [
    el('div', { class: 'modal__head' }, [el('h3', {}, titleText), el('button', { class: 'modal__x', onclick: close, 'aria-label': 'Закрыть', title: 'Закрыть (Esc)' }, '✕')]),
    el('div', { class: 'modal__body' }, bodyNode),
    opts.footer ? el('div', { class: 'modal__foot' }, opts.footer) : null,
  ]);
  const overlay = el('div', { class: 'modal', onclick: (e) => { if (e.target === overlay) close(); } }, box);
  const restoreFocus = typeof document !== 'undefined' ? document.activeElement : null;
  document.body.append(overlay);
  document.addEventListener('keydown', onKey);
  const first = box.querySelector('.modal__foot .btn') || box.querySelector(FOCUSABLE);
  if (first) requestAnimationFrame(() => { try { first.focus(); } catch { /* jsdom */ } });
  return { close, overlay, box };
}

/** Всплывающая подсказка у курсора. */
let tipNode = null;
export function tooltip(target, html) {
  const show = () => {
    if (!tipNode) { tipNode = el('div', { class: 'tip' }); document.body.append(tipNode); }
    tipNode.innerHTML = html;
    tipNode.style.display = 'block';
    const r = target.getBoundingClientRect();
    const w = tipNode.offsetWidth, h = tipNode.offsetHeight;
    let x = r.left + r.width / 2 - w / 2;
    let y = r.top - h - 8;
    if (y < 6) y = r.bottom + 8;
    x = Math.max(6, Math.min(window.innerWidth - w - 6, x));
    tipNode.style.left = `${x}px`;
    tipNode.style.top = `${y}px`;
  };
  const hide = () => { if (tipNode) tipNode.style.display = 'none'; };
  target.addEventListener('mouseenter', show);
  target.addEventListener('mouseleave', hide);
  target.addEventListener('click', show);
  return hide;
}
