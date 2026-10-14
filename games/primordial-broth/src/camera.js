// camera.js — smooth follow camera whose zoom adapts to the creature's size.

import { TUNING, SIZE_BY_STAGE, WORLD } from './config.js';

export function createCamera() {
  return {
    x: 600,
    y: WORLD.h / 2,
    zoom: 1.45,
    targetZoom: 1.45,
    shake: 0,
    shakeX: 0,
    shakeY: 0,
    time: 0,
  };
}

/** 1.5 at birth → ~0.5 for the biggest organism: the cell always fills a similar
 *  fraction of the screen, exactly like the reference stage does. */
export function cameraZoomForStage(stage) {
  const r = SIZE_BY_STAGE[Math.min(stage, SIZE_BY_STAGE.length) - 1];
  return Math.max(0.52, Math.min(1.22, 38 / r + 0.30));
}

export function updateCamera(cam, dt, target, view) {
  const lookAhead = TUNING.cameraLookAhead;
  const tx = target.x + target.vx * lookAhead;
  const ty = target.y + target.vy * lookAhead;
  const k = 1 - Math.exp(-TUNING.cameraLerp * dt);
  cam.x += (tx - cam.x) * k;
  cam.y += (ty - cam.y) * k;

  cam.targetZoom = cameraZoomForStage(target.stage);
  cam.zoom += (cam.targetZoom - cam.zoom) * (1 - Math.exp(-1.6 * dt));

  // Soft bounds: allow a little over-scroll past the world edges so the creature
  // stays centred instead of being pushed against the side of the screen.
  const margin = 260;
  cam.x = Math.max(-margin, Math.min(WORLD.w + margin, cam.x));
  cam.y = Math.max(-margin, Math.min(WORLD.h + margin, cam.y));

  cam.time += dt;
  if (cam.shake > 0) {
    cam.shake = Math.max(0, cam.shake - dt * 2.6);
    const a = cam.shake * 16;
    cam.shakeX = (Math.random() * 2 - 1) * a;
    cam.shakeY = (Math.random() * 2 - 1) * a;
  } else {
    cam.shakeX = 0;
    cam.shakeY = 0;
  }
  return cam;
}

export function worldToScreen(cam, view, x, y) {
  return {
    x: (x - cam.x) * cam.zoom + view.w / 2 + cam.shakeX,
    y: (y - cam.y) * cam.zoom + view.h / 2 + cam.shakeY,
  };
}

export function screenToWorld(cam, view, x, y) {
  return {
    x: (x - view.w / 2 - cam.shakeX) / cam.zoom + cam.x,
    y: (y - view.h / 2 - cam.shakeY) / cam.zoom + cam.y,
  };
}
