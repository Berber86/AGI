import type { RaceEvent, RaceState } from '../sim/race';

export interface BridgeMetrics {
  frames: number;
  fps: number;
  worstFrameMs: number;
}

export interface Bridge {
  scene: string;
  seed: number;
  theme: string;
  state: RaceState | null;
  events: RaceEvent[];
  metrics: BridgeMetrics;
  forceSteer: number | null;
  /** Test-only time multiplier: 1 = real time, 10 = ten simulated steps per frame. */
  timeScale: number;
  tapSteer: (direction: -1 | 0 | 1) => void;
  restart: (seed?: number) => void;
  skipToFinish: () => Record<string, unknown>;
}

export const bridge: Bridge = {
  scene: 'boot',
  seed: 1,
  theme: 'meadow',
  state: null,
  events: [],
  metrics: { frames: 0, fps: 0, worstFrameMs: 0 },
  forceSteer: null,
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
  metrics.fps = Math.round(1000 / Math.max(1, deltaMs));
}

declare global {
  interface Window {
    __GAME_TEST__?: Bridge;
    __GAME__?: unknown;
  }
}
