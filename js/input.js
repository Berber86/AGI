// input.js — управление: виртуальный джойстик, кнопки, клавиатура.
// Возвращает единый объект: { ax, ay, bite, dash, ability, abilityHeld, pointer, gestures }

import { clamp, hypot } from './util.js';

export class Input {
  constructor(opts = {}) {
    this.opts = opts;
    this.ax = 0; this.ay = 0;
    this.dash = false; this.ability = false; this.bite = false;
    this.abilityHeld = false;
    this.keys = new Set();
    this.stick = { active: false, id: null, ox: 0, oy: 0, x: 0, y: 0 };
    this.autoBite = true;
    this.leftHanded = false;
    this.listeners = {};
    this.wantPause = false;
  }

  on(name, fn) { (this.listeners[name] ??= []).push(fn); }
  fire(name, data) { (this.listeners[name] ?? []).forEach((f) => f(data)); }

  attach(dom) {
    const { zone, base, knob, dashBtn, abilityBtn, nestBtn, canvas } = dom;
    this.dom = dom;
    const R = 46;      // радиус хода стика в пикселях (визуально)
    const maxDist = 54;

    const setStick = (x, y) => {
      const st = this.stick;
      st.x = x; st.y = y;
      const dx = x - st.ox, dy = y - st.oy;
      const d = hypot(dx, dy);
      const k = d > maxDist ? maxDist / d : 1;
      st.kx = st.ox + dx * k; st.ky = st.oy + dy * k;
      const nx = (dx * k) / maxDist, ny = (dy * k) / maxDist;
      this.ax = clamp(nx * 1.35, -1, 1);
      this.ay = clamp(ny * 1.35, -1, 1);
      if (base) { base.style.left = `${st.ox}px`; base.style.top = `${st.oy}px`; base.classList.remove('hidden'); }
      if (knob) { knob.style.left = `${st.ox + dx * k - st.ox}px`; knob.style.top = `${st.oy + dy * k - st.oy}px`; }
    };

    const startStick = (e) => {
      const t = e.changedTouches ? e.changedTouches[0] : e;
      this.stick.active = true;
      this.stick.id = e.changedTouches ? t.identifier : 'mouse';
      this.stick.ox = t.clientX; this.stick.oy = t.clientY;
      setStick(t.clientX, t.clientY);
      e.preventDefault();
    };
    const moveStick = (e) => {
      if (!this.stick.active) return;
      const t = e.changedTouches ? [...e.changedTouches].find((x) => x.identifier === this.stick.id) : e;
      if (!t) return;
      setStick(t.clientX, t.clientY);
      e.preventDefault();
    };
    const endStick = (e) => {
      if (!this.stick.active) return;
      if (e.changedTouches && ![...e.changedTouches].some((x) => x.identifier === this.stick.id)) return;
      this.stick.active = false; this.ax = 0; this.ay = 0;
      if (base) base.classList.add('hidden');
      if (knob) { knob.style.left = '50%'; knob.style.top = '50%'; }
    };

    zone?.addEventListener('touchstart', startStick, { passive: false });
    zone?.addEventListener('touchmove', moveStick, { passive: false });
    zone?.addEventListener('touchend', endStick);
    zone?.addEventListener('touchcancel', endStick);
    zone?.addEventListener('mousedown', startStick);
    window.addEventListener('mousemove', moveStick);
    window.addEventListener('mouseup', endStick);

    // удержание на зоне = укус (как в Spore: держи палец — жуй)
    zone?.addEventListener('pointerdown', () => { this.bite = true; });
    window.addEventListener('pointerup', () => { this.bite = false; });

    const bindPress = (el, onDown, onUp) => {
      if (!el) return;
      el.addEventListener('touchstart', (e) => { e.preventDefault(); onDown(); }, { passive: false });
      el.addEventListener('touchend', (e) => { e.preventDefault(); onUp?.(); });
      el.addEventListener('mousedown', (e) => { e.preventDefault(); onDown(); });
      el.addEventListener('mouseup', (e) => { e.preventDefault(); onUp?.(); });
      el.addEventListener('mouseleave', () => onUp?.());
    };
    bindPress(dashBtn, () => { this.dash = true; this.fire('dash'); }, () => { });
    bindPress(abilityBtn, () => { this.ability = true; this.abilityHeld = true; }, () => { this.abilityHeld = false; });
    bindPress(nestBtn, () => this.fire('nest'), null);

    // двойной тап по миру — рывок в сторону пальца (жест «взмах»)
    let lastTap = 0, lastPos = null;
    canvas?.addEventListener('touchend', (e) => {
      const t = e.changedTouches[0];
      const now = performance.now();
      if (lastPos && now - lastTap < 280 && hypot(t.clientX - lastPos.x, t.clientY - lastPos.y) > 60) {
        this.fire('swipe', { dx: t.clientX - lastPos.x, dy: t.clientY - lastPos.y });
      }
      lastTap = now; lastPos = { x: t.clientX, y: t.clientY };
    });

    // клавиатура (для отладки на десктопе)
    window.addEventListener('keydown', (e) => {
      this.keys.add(e.code);
      if (e.code === 'Space') { this.dash = true; e.preventDefault(); }
      if (e.code === 'KeyE' || e.code === 'ShiftLeft') { this.ability = true; this.abilityHeld = true; }
      if (e.code === 'KeyF') this.fire('nest');
      if (e.code === 'Escape') this.wantPause = true;
    });
    window.addEventListener('keyup', (e) => {
      this.keys.delete(e.code);
      if (e.code === 'KeyE' || e.code === 'ShiftLeft') this.abilityHeld = false;
    });

    // потеря фокуса — сброс всех осей
    window.addEventListener('blur', () => { this.ax = 0; this.ay = 0; this.bite = false; });
    return this;
  }

  // Считывается каждый кадр, затем сбрасываются «импульсные» флаги.
  poll() {
    let ax = this.ax, ay = this.ay;
    const K = this.keys;
    if (K.has('KeyA') || K.has('ArrowLeft')) ax -= 1;
    if (K.has('KeyD') || K.has('ArrowRight')) ax += 1;
    if (K.has('KeyW') || K.has('ArrowUp')) ay -= 1;
    if (K.has('KeyS') || K.has('ArrowDown')) ay += 1;
    if (K.has('KeyJ')) this.bite = true;

    const state = {
      ax, ay,
      bite: this.bite || this.autoBite,
      dash: this.dash,
      ability: this.ability,
      abilityHeld: this.abilityHeld,
      raw: { ax: this.ax, ay: this.ay },
    };
    this.dash = false;
    this.ability = false;
    const pause = this.wantPause;
    this.wantPause = false;
    return { ...state, pause };
  }
}
