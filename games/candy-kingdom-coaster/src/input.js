// Touch-first input: two big buttons + keyboard. Never leaves a "stuck" button.
export class Input {
  constructor() {
    this.left = false;
    this.right = false;
    this._keyLeft = false;
    this._keyRight = false;
    this._ptr = new Map(); // pointerId -> 'left' | 'right'
    this.onPause = null;

    window.addEventListener('keydown', (e) => {
      if (e.repeat) return;
      const k = e.key.toLowerCase();
      if (k === 'arrowleft' || k === 'a' || k === 'ф') this._keyLeft = true;
      else if (k === 'arrowright' || k === 'd' || k === 'в') this._keyRight = true;
      else if (k === 'escape' || k === 'p' || k === 'з') { if (this.onPause) this.onPause(); }
    });
    window.addEventListener('keyup', (e) => {
      const k = e.key.toLowerCase();
      if (k === 'arrowleft' || k === 'a' || k === 'ф') this._keyLeft = false;
      else if (k === 'arrowright' || k === 'd' || k === 'в') this._keyRight = false;
    });
    // Safety: any blur/visibility change releases every button.
    const release = () => this.releaseAll();
    window.addEventListener('blur', release);
    document.addEventListener('visibilitychange', () => { if (document.hidden) release(); });
    window.addEventListener('pointercancel', release);
  }

  attachButton(el, side) {
    const down = (e) => {
      e.preventDefault();
      el.classList.add('is-pressed');
      try { el.setPointerCapture(e.pointerId); } catch { /* older browsers */ }
      this._ptr.set(e.pointerId, side);
      this._recalc();
    };
    const up = (e) => {
      if (!this._ptr.has(e.pointerId)) return;
      el.classList.remove('is-pressed');
      this._ptr.delete(e.pointerId);
      this._recalc();
    };
    el.addEventListener('pointerdown', down);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
    el.addEventListener('lostpointercapture', up);
    // Guard against context menu / long-press selection on Android.
    el.addEventListener('contextmenu', (e) => e.preventDefault());
    el.addEventListener('dragstart', (e) => e.preventDefault());
  }

  _recalc() {
    const sides = new Set(this._ptr.values());
    this.left = this._keyLeft || sides.has('left');
    this.right = this._keyRight || sides.has('right');
  }

  releaseAll() {
    this._ptr.clear();
    this._keyLeft = false;
    this._keyRight = false;
    this.left = false;
    this.right = false;
    document.querySelectorAll('.ctl-btn.is-pressed').forEach((b) => b.classList.remove('is-pressed'));
  }

  get steer() {
    return (this.right ? 1 : 0) - (this.left ? 1 : 0);
  }
}
