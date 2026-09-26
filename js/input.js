// input.js — управление: виртуальный джойстик, кнопки, клавиатура.
// Возвращает единый объект: { ax, ay, bite, dash, ability, abilityHeld, pointer, gestures }

import { clamp, hypot } from './util.js';
import { CFG } from './config.js';

export class Input {
  constructor(opts = {}) {
    this.opts = opts;
    this.ax = 0; this.ay = 0;
    this.dash = false; this.ability = false; this.bite = false;
    this.abilityHeld = false;
    this.keys = new Set();
    this.stick = { active: false, id: null, ox: 0, oy: 0, x: 0, y: 0 };
    this.autoBite = false;
    this.sens = opts.sens ?? 'normal';       // чувствительность стика: low | normal | high
    this.mag = 0;
    this.leftHanded = false;
    this.listeners = {};
    this.wantPause = false;
  }

  on(name, fn) { (this.listeners[name] ??= []).push(fn); }
  fire(name, data) { (this.listeners[name] ?? []).forEach((f) => f(data)); }

  attach(dom) {
    const { zone, base, knob, dashBtn, abilityBtn, nestBtn, canvas } = dom;
    this.dom = dom;
    const S = CFG.stick;
    const maxDist = () => S.sensitivity[this.sens] ?? S.radius;
    const DEAD = S.dead;
    const EXPO = S.expo;
    const KNOB_R = 20;                       // радиус шайбы, см. .stick-knob в CSS

    const setStick = (x, y) => {
      const st = this.stick;
      st.x = x; st.y = y;
      const dx = x - st.ox, dy = y - st.oy;
      const d = hypot(dx, dy);
      const max = maxDist();
      const k = d > max ? max / d : 1;
      const kx = dx * k, ky = dy * k;
      st.kx = st.ox + kx; st.ky = st.oy + ky;
      // нормируем ход, отсекаем дрожание пальца и добавляем кривую отклика
      let mag = Math.min(1, hypot(kx, ky) / max);
      const out = mag <= DEAD ? 0 : Math.pow((mag - DEAD) / (1 - DEAD), EXPO);
      const scale = mag > 0.0001 ? out / mag : 0;
      this.ax = clamp((kx / max) * scale, -1, 1);
      this.ay = clamp((ky / max) * scale, -1, 1);
      this.mag = out;
      if (base) {
        // подложка = полный ход + радиус шайбы: на полном отклонении шайба у края, а не снаружи
        const size = Math.round((max + KNOB_R) * 2);
        base.style.width = `${size}px`; base.style.height = `${size}px`;
        // координаты пальца — вьюпортные, а база может жить внутри сдвинутого контейнера,
        // поэтому вычитаем начало системы координат её родителя (иначе стик уезжает вниз)
        const ob = base.offsetParent?.getBoundingClientRect?.();
        const bx = ob ? ob.left : 0, by = ob ? ob.top : 0;
        base.style.left = `${(st.ox - bx).toFixed(1)}px`;
        base.style.top = `${(st.oy - by).toFixed(1)}px`;
        base.classList.remove('hidden');
        base.style.setProperty('--dz', `${Math.round(max * DEAD)}px`);
      }
      // ВАЖНО: кноб позиционируется относительно центра базы, а не её левого края
      if (knob) {
        knob.style.left = `calc(50% + ${kx.toFixed(1)}px)`;
        knob.style.top = `calc(50% + ${ky.toFixed(1)}px)`;
        knob.style.transform = `scale(${(0.88 + out * 0.22).toFixed(2)})`;
      }
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
      this.stick.active = false; this.ax = 0; this.ay = 0; this.mag = 0;
      if (base) base.classList.add('hidden');
      if (knob) { knob.style.left = '50%'; knob.style.top = '50%'; knob.style.transform = 'scale(0.9)'; }
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

    // двойной тап по миру — рывок в сторону пальца (жест «взмах»).
    // Слушаем на window: зона стика занимает всю левую часть экрана, и тапы по ней
    // до canvas не доходят. Тапы по кнопкам игнорируем — у них свои действия.
    let lastTap = 0, lastPos = null;
    window.addEventListener('touchend', (e) => {
      if (e.target?.closest?.('button')) return;
      const t = e.changedTouches[0];
      if (!t) return;
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
