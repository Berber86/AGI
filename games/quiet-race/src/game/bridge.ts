import type { RaceEvent, RaceState } from '../sim/race';

export interface BridgeMetrics {
  frames: number;
  fps: number;
  worstFrameMs: number;
  avgFrameMs: number;
  renderMs: number;
  simMs: number;
}

export interface Bridge {
  scene: string;
  seed: number;
  theme: string;
  state: RaceState | null;
  events: RaceEvent[];
  metrics: BridgeMetrics;
  forceSteer: number | null;
  /** Test-only: stops the simulation loop without leaving the scene. */
  freeze: boolean;
  /** Test-only: makes the next race use this seed, so evidence is reproducible. */
  forceSeed: number | null;
  /** Test-only time multiplier: 1 = real time, 10 = ten simulated steps per frame. */
  timeScale: number;
  tapSteer: (direction: -1 | 0 | 1) => void;
  restart: (seed?: number) => void;
  skipToFinish: () => Record<string, unknown>;
}

export const bridge: Bridge = {
  scene: 'boot',
  seed: 1,
  theme: 'candy',
  state: null,
  events: [],
  metrics: { frames: 0, fps: 0, worstFrameMs: 0, avgFrameMs: 0, renderMs: 0, simMs: 0 },
  forceSteer: null,
  freeze: false,
  forceSeed: null,
  timeScale: 1,
  tapSteer: () => undefined,
  restart: () => undefined,
  skipToFinish: () => ({}),
};

export function publishBridge(): void {
  if (typeof window !== 'undefined') {
    window.__GAME_TEST__ = bridge;
  }
}

export function recordFrame(deltaMs: number): void {
  const metrics = bridge.metrics;
  metrics.frames += 1;
  metrics.worstFrameMs = Math.max(metrics.worstFrameMs, Math.round(deltaMs * 10) / 10);
  const previous = metrics.avgFrameMs || deltaMs;
  metrics.avgFrameMs = Math.round((previous * 0.94 + Math.min(deltaMs, 100) * 0.06) * 100) / 100;
  metrics.fps = Math.round(1000 / Math.max(1, metrics.avgFrameMs));
}

/** Rolling average of the time spent inside one phase of a frame, in ms. */
export function recordPhase(phase: 'renderMs' | 'simMs', ms: number): void {
  const metrics = bridge.metrics;
  const previous = metrics[phase] || ms;
  metrics[phase] = Math.round((previous * 0.9 + ms * 0.1) * 100) / 100;
}

declare global {
  interface Window {
    __GAME_TEST__?: Bridge;
    __GAME__?: unknown;
  }
}
