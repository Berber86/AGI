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

export function btn(label, onClick, cls = '', opts = {}) {
  return el('button', { class: `btn ${cls}`, onclick: onClick, disabled: opts.disabled, title: opts.title || '', dataset: opts.dataset || {} }, label);
}

/** Простой модал. */
export function modal(titleText, bodyNode, opts = {}) {
  const close = () => { overlay.remove(); document.removeEventListener('keydown', onKey); };
  const onKey = (e) => { if (e.key === 'Escape') close(); };
  const box = el('div', { class: 'modal__box' }, [
    el('div', { class: 'modal__head' }, [el('h3', {}, titleText), el('button', { class: 'modal__x', onclick: close }, '✕')]),
    el('div', { class: 'modal__body' }, bodyNode),
    opts.footer ? el('div', { class: 'modal__foot' }, opts.footer) : null,
  ]);
  const overlay = el('div', { class: 'modal', onclick: (e) => { if (e.target === overlay) close(); } }, box);
  document.body.append(overlay);
  document.addEventListener('keydown', onKey);
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
