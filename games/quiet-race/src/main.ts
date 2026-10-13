import Phaser from 'phaser';
import { CFG, THEMES, type Theme } from './sim/config';
import { createRace, stepRace, type RaceState } from './sim/race';
import { VIEW } from './game/layout';
import { bridge, publishBridge } from './game/bridge';
import { audio } from './game/audio';
import { FinishScene } from './game/scenes/FinishScene';
import { GarageScene } from './game/scenes/GarageScene';
import { OverlayScene } from './game/scenes/OverlayScene';
import { RaceScene } from './game/scenes/RaceScene';

/**
 * The Canvas renderer is chosen deliberately: it is the renderer the automated
 * run exercises, it draws this game (flat candy shapes, gradients, text) at
 * 60 fps on phones, and it removes a whole class of WebGL-only boot failures
 * that the headless run cannot see.
 */
/** Reports a boot failure on the plain HTML hint, so the parent sees the reason. */
function reportBootFailure(error: unknown): void {
  const message = error instanceof Error ? error.message : String(error);
  const detail = document.getElementById('boot-detail');
  const retry = document.getElementById('boot-retry');
  if (detail) detail.textContent = `Ошибка при запуске: ${message}`;
  retry?.classList.add('show');
}

let game: Phaser.Game;
try {
  game = new Phaser.Game({
  type: Phaser.CANVAS,
  parent: 'game',
  backgroundColor: '#bfe6a2',
  banner: false,
  disableContextMenu: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: VIEW.w,
    height: VIEW.h,
  },
  render: {
    antialias: true,
    roundPixels: false,
    powerPreference: 'high-performance',
  },
  fps: { target: 60, min: 30 },
  input: { activePointers: 3 },
  audio: { noAudio: true },
  scene: [GarageScene, RaceScene, FinishScene, OverlayScene],
  });
} catch (error) {
  reportBootFailure(error);
  throw error;
}

game.registry.set('portrait', false);
game.registry.set('paused', false);
game.registry.set('themeIndex', 0);
game.registry.set('colorId', 'rose');
game.registry.set('flagId', 'star');
game.registry.set('stickerId', 'star');

function hideBootHint(): void {
  const guard = (window as unknown as { __quietRaceBootClear?: () => void }).__quietRaceBootClear;
  if (typeof guard === 'function') {
    guard();
    return;
  }
  const hint = document.getElementById('boot-hint');
  hint?.classList.add('hidden');
  window.setTimeout(() => hint?.remove(), 800);
}

// The hint goes away as soon as the engine is up, and again when the first scene
// has drawn its first frame — whichever comes last, the child never sees it.
game.events.once(Phaser.Core.Events.READY, () => hideBootHint());
game.events.once(Phaser.Core.Events.POST_RENDER, () => hideBootHint());

function pauseForParents(): void {
  game.registry.set('paused', true);
  audio.stopEngine();
}

document.addEventListener('visibilitychange', () => {
  if (document.hidden) pauseForParents();
});
window.addEventListener('blur', () => {
  pauseForParents();
});

bridge.restart = (seed?: number) => {
  const themeIndex = (game.registry.get('themeIndex') as number | undefined) ?? 0;
  const theme = THEMES[themeIndex % THEMES.length] as Theme;
  for (const scene of game.scene.getScenes(true)) {
    if (scene.scene.key !== 'overlay') scene.scene.stop();
  }
  game.scene.start('race', {
    seed: seed ?? Math.floor(Math.random() * 1_000_000),
    theme,
    colorId: game.registry.get('colorId') ?? 'rose',
    flagId: game.registry.get('flagId') ?? 'star',
    stickerId: game.registry.get('stickerId') ?? 'star',
  });
};

/**
 * Headless check used by the automated runs: replays a *fresh* race from a seed
 * with no steering at all and never touches the live scene, so the deterministic
 * "a clean run always reaches the finish in 40-60 seconds" promise is verified
 * against the shipped bundle.
 */
bridge.skipToFinish = (seed?: number): Record<string, unknown> => {
  const useSeed = seed ?? bridge.seed ?? 1;
  const theme = (bridge.theme as Theme | undefined) ?? 'candy';
  let state: RaceState = createRace(useSeed, theme);
  const limit = Math.round(180_000 / (1000 / 60));
  let steps = 0;
  while (state.status !== 'finished' && steps < limit) {
    state = stepRace(state, 1000 / 60, { steer: 0, boost: true }).state;
    steps += 1;
  }
  const drivingMs = state.finishMs ?? 0;
  return {
    ok: state.status === 'finished',
    seed: useSeed,
    theme,
    steps,
    drivingMs,
    totalMs: drivingMs + CFG.countdownMs,
    balloons: state.balloonsTaken,
    overtakes: state.overtakes,
    boosts: state.boostsUsed,
    onGrass: state.onGrass,
    progress: state.progress,
  };
};

publishBridge();

if (typeof window !== 'undefined') {
  window.__GAME__ = game;
}

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    void navigator.serviceWorker.register('./sw.js').catch(() => undefined);
  });
}

export { game };
