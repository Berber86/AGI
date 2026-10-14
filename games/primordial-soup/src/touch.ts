import type { MoveVector } from './simulation';

export class VirtualJoystick {
  private readonly root: HTMLElement;
  private readonly knob: HTMLElement;
  private activePointer: number | null = null;
  private current: MoveVector = { x: 0, z: 0 };

  constructor(root: HTMLElement) {
    this.root = root;
    const knob = root.querySelector<HTMLElement>('.joystick-knob');
    if (!knob) throw new Error('Virtual joystick is missing its knob element.');
    this.knob = knob;

    root.addEventListener('pointerdown', this.onPointerDown);
    root.addEventListener('pointermove', this.onPointerMove);
    root.addEventListener('pointerup', this.onPointerUp);
    root.addEventListener('pointercancel', this.onPointerUp);
    root.addEventListener('lostpointercapture', this.onPointerUp);
    window.addEventListener('blur', this.release);
    document.addEventListener('visibilitychange', this.onVisibilityChange);
  }

  get vector(): MoveVector {
    return this.current;
  }

  releaseAll(): void {
    this.release();
  }

  destroy(): void {
    this.root.removeEventListener('pointerdown', this.onPointerDown);
    this.root.removeEventListener('pointermove', this.onPointerMove);
    this.root.removeEventListener('pointerup', this.onPointerUp);
    this.root.removeEventListener('pointercancel', this.onPointerUp);
    this.root.removeEventListener('lostpointercapture', this.onPointerUp);
    window.removeEventListener('blur', this.release);
    document.removeEventListener('visibilitychange', this.onVisibilityChange);
  }

  private readonly onPointerDown = (event: PointerEvent): void => {
    if (this.activePointer !== null || event.button > 0) return;
    event.preventDefault();
    this.activePointer = event.pointerId;
    this.root.classList.add('is-active');
    try {
      this.root.setPointerCapture(event.pointerId);
    } catch {
      // Pointer capture is optional; cancellation and blur still release input.
    }
    this.updateFromPointer(event);
  };

  private readonly onPointerMove = (event: PointerEvent): void => {
    if (event.pointerId !== this.activePointer) return;
    event.preventDefault();
    this.updateFromPointer(event);
  };

  private readonly onPointerUp = (event: PointerEvent): void => {
    if (this.activePointer === null || event.pointerId !== this.activePointer) return;
    this.release();
  };

  private readonly onVisibilityChange = (): void => {
    if (document.hidden) this.release();
  };

  private readonly release = (): void => {
    this.activePointer = null;
    this.current = { x: 0, z: 0 };
    this.knob.style.transform = 'translate(-50%, -50%)';
    this.root.classList.remove('is-active');
  };

  private updateFromPointer(event: PointerEvent): void {
    const bounds = this.root.getBoundingClientRect();
    const centerX = bounds.left + bounds.width / 2;
    const centerY = bounds.top + bounds.width * 0.42;
    const maxRadius = bounds.width * 0.26;
    let dx = event.clientX - centerX;
    let dy = event.clientY - centerY;
    const distance = Math.hypot(dx, dy);
    if (distance > maxRadius) {
      const scale = maxRadius / distance;
      dx *= scale;
      dy *= scale;
    }
    this.current = {
      x: clamp(dx / maxRadius, -1, 1),
      z: clamp(-dy / maxRadius, -1, 1),
    };
    this.knob.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
