// input.js — touch-first: a free stick anywhere on the water surface, plus action buttons.
// Pointer Events keep desktop mouse testing working.

export function createInput(canvas, { onDash, onPause, onAnyGesture } = {}) {
  const state = {
    // Steering stick: origin is where the finger first landed.
    active: false,
    pointerId: null,
    originX: 0,
    originY: 0,
    x: 0,
    y: 0,
    // -1..1 normalised thrust vector (screen space).
    tx: 0,
    ty: 0,
    magnitude: 0,
    dashHeld: false,
    keys: new Set(),
  };

  const STICK_RADIUS = 68; // px of drag that means "full power"

  function setFromPointer(ev) {
    const dx = ev.clientX - state.originX;
    const dy = ev.clientY - state.originY;
    const len = Math.hypot(dx, dy) || 1;
    const m = Math.min(1, len / STICK_RADIUS);
    state.magnitude = m;
    state.tx = (dx / len) * m;
    state.ty = (dy / len) * m;
    state.x = ev.clientX;
    state.y = ev.clientY;
  }

  function release() {
    state.active = false;
    state.pointerId = null;
    state.tx = 0;
    state.ty = 0;
    state.magnitude = 0;
    state.dashHeld = false;
  }

  const isGameSurface = (ev) => ev.target === canvas || ev.target.id === 'stage';

  canvas.addEventListener('pointerdown', (ev) => {
    if (!isGameSurface(ev)) return;
    if (state.active) return;
    state.active = true;
    state.pointerId = ev.pointerId;
    state.originX = ev.clientX;
    state.originY = ev.clientY;
    state.x = ev.clientX;
    state.y = ev.clientY;
    canvas.setPointerCapture?.(ev.pointerId);
    onAnyGesture?.();
    ev.preventDefault();
  }, { passive: false });

  canvas.addEventListener('pointermove', (ev) => {
    if (!state.active || ev.pointerId !== state.pointerId) return;
    setFromPointer(ev);
    ev.preventDefault();
  }, { passive: false });

  const endHandler = (ev) => {
    if (ev.pointerId !== state.pointerId) return;
    release();
  };
  canvas.addEventListener('pointerup', endHandler);
  canvas.addEventListener('pointercancel', endHandler);
  window.addEventListener('blur', release);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) release();
  });

  // --- dash button (also reachable with space for desktop testing) ---
  const dashBtn = document.getElementById('btn-dash');
  if (dashBtn) {
    const down = (ev) => { ev.preventDefault(); state.dashHeld = true; onAnyGesture?.(); };
    const up = (ev) => { ev.preventDefault(); state.dashHeld = false; };
    dashBtn.addEventListener('pointerdown', down);
    dashBtn.addEventListener('pointerup', up);
    dashBtn.addEventListener('pointerleave', up);
    dashBtn.addEventListener('pointercancel', up);
  }

  window.addEventListener('keydown', (ev) => {
    state.keys.add(ev.key.toLowerCase());
    if (ev.key === ' ' || ev.key.toLowerCase() === 'shift') { state.dashHeld = true; ev.preventDefault(); }
    if (ev.key === 'Escape' || ev.key.toLowerCase() === 'p') onPause?.();
    onAnyGesture?.();
  });
  window.addEventListener('keyup', (ev) => {
    state.keys.delete(ev.key.toLowerCase());
    if (ev.key === ' ' || ev.key.toLowerCase() === 'shift') state.dashHeld = false;
  });

  // Desktop WASD/arrows -> stick vector, purely a convenience for QA.
  function keyboardVector() {
    let x = 0;
    let y = 0;
    const k = state.keys;
    if (k.has('a') || k.has('arrowleft')) x -= 1;
    if (k.has('d') || k.has('arrowright')) x += 1;
    if (k.has('w') || k.has('arrowup')) y -= 1;
    if (k.has('s') || k.has('arrowdown')) y += 1;
    if (x || y) {
      const l = Math.hypot(x, y);
      state.tx = x / l;
      state.ty = y / l;
      state.magnitude = 1;
    }
    return x || y;
  }

  return {
    state,
    release,
    /** Normalised thrust vector for this frame. */
    vector() {
      if (!state.active) {
        state.tx = 0; state.ty = 0; state.magnitude = 0;
        const active = keyboardVector();
        if (!active) { state.magnitude = 0; }
      }
      return { x: state.tx, y: state.ty, magnitude: state.magnitude };
    },
    isDashHeld: () => state.dashHeld,
    isActive: () => state.active,
    overlay() {
      return state.active
        ? { active: true, ox: state.originX, oy: state.originY, x: state.x, y: state.y, m: state.magnitude }
        : { active: false };
    },
  };
}
