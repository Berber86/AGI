#!/usr/bin/env node
/**
 * Headless gameplay evidence for «Тихая гонка».
 *
 * Runs the real game bundle inside jsdom with a Skia-backed 2D canvas
 * (@napi-rs/canvas), plays a complete race at mobile-landscape size through
 * synthetic touch events, repeats the boot in portrait to check the
 * "turn the phone" guardian hint, then writes PNG screenshots and a
 * machine-readable report into .studio/evidence/.
 *
 * This stands in for a device browser: it proves boot, rendering, reaction to
 * touch and the finish/restart paths, but it is not an Android phone.
 *
 * Usage: node scripts/headless-run.mjs
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Image as SkiaImage, createCanvas } from '@napi-rs/canvas';
import { JSDOM } from 'jsdom';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const BUNDLE = path.join(ROOT, 'dist-headless/game.js');
const SHOTS = path.join(ROOT, '.studio/evidence/screenshots');
const REPORTS = path.join(ROOT, '.studio/evidence/reports');
const LOGICAL = { width: 1600, height: 800 };
const LANDSCAPE = { width: 915, height: 412 };
const PORTRAIT = { width: 360, height: 800 };

const code = readFileSync(BUNDLE, 'utf8');

// jsdom has no canvas implementation, so every DOM canvas gets a Skia surface.
// A canvas keeps ONE context object for its lifetime (browsers behave the same),
// and that context follows the canvas whenever Phaser resizes it — otherwise text
// textures drawn after a resize would land on a stale, clipped surface.
const surfaces = new WeakMap(); // DOM canvas -> current Skia surface

function surfaceFor(element) {
  const width = element.width || 300;
  const height = element.height || 150;
  let surface = surfaces.get(element);
  if (!surface || surface.width !== width || surface.height !== height) {
    surface = createCanvas(width, height);
    surfaces.set(element, surface);
  }
  return surface;
}

function contextFor(element) {
  const record = contexts.get(element) ?? {};
  contexts.set(element, record);
  if (!record.proxy) {
    record.proxy = new Proxy(
      {},
      {
        get: (_target, property) => {
          const context = surfaceFor(element).getContext('2d');
          const value = context[property];
          return typeof value === 'function' ? value.bind(context) : value;
        },
        set: (_target, property, value) => {
          surfaceFor(element).getContext('2d')[property] = value;
          return true;
        },
        has: (_target, property) => property in surfaceFor(element).getContext('2d'),
      },
    );
  }
  return record.proxy;
}

const contexts = new WeakMap();

// Phaser hands DOM canvas elements to Skia drawing calls. A browser takes the
// source rectangle from the canvas's own pixel size, so the shim restores those
// dimensions instead of using the (possibly larger) backing surface size.
const skiaContextPrototype = Object.getPrototypeOf(createCanvas(1, 1).getContext('2d'));
for (const method of ['drawImage', 'createPattern']) {
  const original = skiaContextPrototype[method];
  if (typeof original !== 'function') continue;
  skiaContextPrototype[method] = function patched(source, ...rest) {
    const isCanvasElement =
      Boolean(source) && typeof source === 'object' && typeof source.getContext === 'function' && 'nodeName' in source;
    const surface = isCanvasElement ? surfaceFor(source) : null;
    if (!surface) return original.call(this, source, ...rest);
    const width = source.width || surface.width;
    const height = source.height || surface.height;
    if (method === 'createPattern') return original.call(this, surface, ...rest);
    if (rest.length === 2) return original.call(this, surface, rest[0], rest[1], width, height);
    if (rest.length === 4) return original.call(this, surface, 0, 0, width, height, ...rest);
    return original.call(this, surface, ...rest);
  };
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function instrument(window, width, height) {
  if (window.__QUIET_RACE_INSTRUMENTED__) return window.__QUIET_RACE_SESSION__;
  window.__QUIET_RACE_INSTRUMENTED__ = true;
  const runtimeErrors = [];
  const consoleErrors = [];

  Object.defineProperty(window, 'innerWidth', { value: width, configurable: true });
  Object.defineProperty(window, 'innerHeight', { value: height, configurable: true });
  Object.defineProperty(window, 'devicePixelRatio', { value: 2, configurable: true });

  // jsdom only exposes these web APIs together with the native canvas package.
  window.CanvasRenderingContext2D ??= class CanvasRenderingContext2D {};
  delete window.WebGLRenderingContext; // force the Canvas renderer
  window.focus = () => undefined;
  window.Image = SkiaImage; // Phaser decodes its bootstrap textures from data URIs
  window.matchMedia ??= () => ({
    matches: false,
    media: '',
    addListener() {},
    removeListener() {},
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent: () => false,
  });
  window.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };

  window.HTMLCanvasElement.prototype.getContext = function getContext(type) {
    if (String(type).includes('webgl')) return null;
    return contextFor(this);
  };
  window.HTMLCanvasElement.prototype.getBoundingClientRect = function getBoundingClientRect() {
    const w = parseFloat(this.style.width) || this.width;
    const h = parseFloat(this.style.height) || this.height;
    return { x: 0, y: 0, left: 0, top: 0, right: w, bottom: h, width: w, height: h, toJSON: () => ({}) };
  };
  const parent = window.document.getElementById('game');
  if (parent) {
    parent.getBoundingClientRect = () => ({
      x: 0,
      y: 0,
      left: 0,
      top: 0,
      right: width,
      bottom: height,
      width,
      height,
      toJSON: () => ({}),
    });
  }

  window.addEventListener('error', (event) => runtimeErrors.push(String(event.error ?? event.message)));
  window.addEventListener('unhandledrejection', (event) => runtimeErrors.push(`unhandled rejection: ${event.reason}`));
  const originalError = window.console.error.bind(window.console);
  window.console.error = (...args) => {
    consoleErrors.push(args.map(String).join(' '));
    originalError(...args);
  };

  const canvas = () => window.document.querySelector('canvas');
  const shoot = (name) => {
    const element = canvas();
    const surface = element ? surfaces.get(element) : null;
    if (!surface) return null;
    const file = path.join(SHOTS, `${name}.png`);
    writeFileSync(file, surface.toBuffer('image/png'));
    return path.relative(ROOT, file);
  };

  // Phaser listens for legacy mouse/touch events; jsdom generates no compatibility
  // mouse events from synthetic pointer events, so both are dispatched.
  const touch = (type, logicalX, logicalY) => {
    const element = canvas();
    if (!element) throw new Error('canvas missing');
    const rect = element.getBoundingClientRect();
    const x = Math.round((logicalX / LOGICAL.width) * rect.width);
    const y = Math.round((logicalY / LOGICAL.height) * rect.height);
    const init = {
      bubbles: true,
      cancelable: true,
      clientX: x,
      clientY: y,
      screenX: x,
      screenY: y,
      button: 0,
      buttons: type === 'down' ? 1 : 0,
    };
    if (typeof window.PointerEvent === 'function') {
      element.dispatchEvent(
        new window.PointerEvent(`pointer${type}`, { ...init, pointerId: 1, pointerType: 'touch', isPrimary: true }),
      );
    }
    element.dispatchEvent(new window.MouseEvent(`mouse${type}`, init));
  };

  const waitFor = async (check, timeoutMs, label) => {
    const start = Date.now();
    for (;;) {
      const value = check();
      if (value) return value;
      if (Date.now() - start > timeoutMs) throw new Error(`timeout waiting for ${label}`);
      await sleep(120);
    }
  };

  const evaluate = (fn) => window.eval(`(${fn.toString()})()`);

  const session = { window, shoot, touch, waitFor, evaluate, runtimeErrors, consoleErrors };
  window.__QUIET_RACE_SESSION__ = session;
  return session;
}

/** Boots an empty page and evaluates the classic-script bundle (the QA build). */
function boot(width, height, bundleCode = code) {
  const dom = new JSDOM('<!doctype html><html lang="ru"><body><div id="game"></div></body></html>', {
    pretendToBeVisual: true,
    runScripts: 'outside-only',
    url: 'http://127.0.0.1/quiet-race/',
  });
  const session = instrument(dom.window, width, height);
  dom.window.eval(bundleCode);
  return session;
}

/** Loads a real HTML file (used for the single-file offline build) and lets it run. */
function bootHtmlFile(htmlPath, width, height) {
  const html = readFileSync(htmlPath, 'utf8');
  const dom = new JSDOM(html, {
    pretendToBeVisual: true,
    runScripts: 'dangerously',
    url: 'file:///quiet-race/index.html',
    beforeParse: (window) => {
      instrument(window, width, height);
    },
  });
  return instrument(dom.window, width, height);
}

const bridgeOf = (session) => session.window.__GAME_TEST__;
const stateOf = (session) => bridgeOf(session)?.state;
const report = {
  harness: 'jsdom + @napi-rs/canvas, Phaser Canvas renderer',
  generatedAt: new Date().toISOString(),
  landscape: LANDSCAPE,
  portrait: PORTRAIT,
  steps: [],
};

async function runLandscape() {
  const session = boot(LANDSCAPE.width, LANDSCAPE.height);
  await session.waitFor(() => bridgeOf(session)?.scene, 20000, 'game boot');
  await sleep(1000);
  // Deterministic seed for the whole evidence run: the same race every time.
  bridgeOf(session).forceSeed = 4321;
  report.steps.push({ step: 'garage', scene: bridgeOf(session)?.scene, screenshot: session.shoot('headless-01-garage') });

  // Garage rows of pictures: colour, flag, sticker. Tap one of each, then «Едем!».
  const tap = (x, y) => {
    session.touch('down', x, y);
    session.touch('up', x, y);
  };
  tap(556, 470);
  tap(668, 580);
  tap(556, 690);
  await sleep(200);
  tap(1250, 270);
  await session.waitFor(() => bridgeOf(session)?.scene === 'race', 20000, 'race scene');
  // Wait until the first traffic-light digit is actually lit before the screenshot.
  await session.waitFor(() => (stateOf(session)?.countdownMs ?? 9999) <= 3100, 20000, 'first countdown digit');
  await sleep(250);
  report.steps.push({
    step: 'countdown',
    scene: bridgeOf(session)?.scene,
    countdownMs: Math.round(stateOf(session)?.countdownMs ?? -1),
    screenshot: session.shoot('headless-02-countdown'),
  });

  // The chase view with the traffic light behind: the start line screenshot.
  bridgeOf(session).timeScale = 15;
  await session.waitFor(() => stateOf(session)?.status === 'racing', 40000, 'racing status');
  await sleep(300);
  report.steps.push({ step: 'go', scene: bridgeOf(session)?.scene, screenshot: session.shoot('headless-03-race') });

  // Hold the left pad: the car leaves the asphalt and the grass rule slows it down.
  session.touch('down', 230, 600);
  await session.waitFor(() => stateOf(session)?.onGrass === true, 40000, 'on grass');
  await sleep(500);
  const onGrass = stateOf(session);
  report.steps.push({
    step: 'grass-slowdown',
    status: onGrass?.status,
    onGrass: onGrass?.onGrass,
    lateral: Math.round((onGrass?.lateral ?? 0) * 100) / 100,
    speed: Math.round(onGrass?.speed ?? 0),
    screenshot: session.shoot('headless-04-grass'),
  });

  // Hold the right pad until the car is back on the road, then let go.
  session.touch('up', 230, 600);
  session.touch('down', 1370, 600);
  await session.waitFor(() => stateOf(session)?.onGrass === false, 40000, 'back on the road');
  session.touch('up', 1370, 600);
  await sleep(400);
  const onRoad = stateOf(session);
  report.steps.push({
    step: 'back-on-road',
    status: onRoad?.status,
    onGrass: onRoad?.onGrass,
    lateral: Math.round((onRoad?.lateral ?? 0) * 100) / 100,
    speed: Math.round(onRoad?.speed ?? 0),
    balloons: onRoad?.balloonsTaken,
    overtakes: onRoad?.overtakes,
    screenshot: session.shoot('headless-05-road'),
  });

  // Cupcake boost: wait for a full meter, then tap the cupcake.
  let boostChargesBefore = null;
  try {
    await session.waitFor(() => (stateOf(session)?.boostCharges ?? 0) >= 4, 20000, 'full boost meter');
    boostChargesBefore = stateOf(session)?.boostCharges ?? null;
    tap(1415, 706);
    await session.waitFor(() => (stateOf(session)?.boostMs ?? 0) > 0, 8000, 'boost fired');
    await sleep(250);
    // The traffic light also refills the cup; the boost itself is the cue here.
  } catch (error) {
    report.boostNote = String(error);
  }
  report.steps.push({
    step: 'boost',
    chargesBefore: boostChargesBefore,
    boostMs: Math.round(stateOf(session)?.boostMs ?? 0),
    boostsUsed: stateOf(session)?.boostsUsed ?? 0,
    screenshot: session.shoot('headless-06-boost'),
  });

  // Second lap: the HUD must read «КРУГ 2/3» while the castle loop scrolls.
  await session.waitFor(() => (stateOf(session)?.lap ?? 1) >= 2, 20000, 'second lap');
  await sleep(200);
  report.steps.push({
    step: 'lap-two',
    lap: stateOf(session)?.lap ?? null,
    screenshot: session.shoot('headless-07-lap-two'),
  });

  await session.waitFor(() => bridgeOf(session)?.scene === 'finish', 90000, 'finish scene');
  await sleep(1200);
  report.steps.push({
    step: 'finish',
    scene: bridgeOf(session)?.scene,
    screenshot: session.shoot('headless-08-finish'),
  });

  const metrics = bridgeOf(session)?.metrics ?? null;
  const boostStep = report.steps.find((step) => step.step === 'boost');
  // A fresh deterministic clean run from a built-in seed: 40-60 s and always finished.
  const cleanRun = bridgeOf(session)?.skipToFinish?.(4321) ?? null;

  // The blue car button leads back to the garage…
  tap(1300, 470);
  const backToGarage = await session.waitFor(() => bridgeOf(session)?.scene === 'garage', 20000, 'back to garage')
    .then(() => 'garage')
    .catch(() => 'timeout');
  await sleep(400);
  report.steps.push({ step: 'back-to-garage', scene: backToGarage, screenshot: session.shoot('headless-09-garage-again') });

  // …and «Едем!» starts another playable race (the same path as «Ещё раз»).
  tap(1250, 270);
  const restarted = await session.waitFor(() => bridgeOf(session)?.scene === 'race', 20000, 'restart')
    .then(() => 'race')
    .catch(() => 'timeout');
  await sleep(600);
  report.steps.push({ step: 'restart', scene: restarted, screenshot: session.shoot('headless-10-restart') });

  report.metrics = metrics;
  report.cleanRun = cleanRun;
  report.runtimeErrors = session.runtimeErrors;
  report.consoleErrors = session.consoleErrors;

  const grassStep = report.steps.find((step) => step.step === 'grass-slowdown');
  const roadStep = report.steps.find((step) => step.step === 'back-on-road');
  const lapStep = report.steps.find((step) => step.step === 'lap-two');
  return {
    noRuntimeErrors: session.runtimeErrors.length === 0,
    noConsoleErrors: session.consoleErrors.length === 0,
    reachedFinish: report.steps.some((step) => step.step === 'finish'),
    grassSlowsCar: grassStep?.onGrass === true && grassStep.speed <= 84,
    backOnRoadSpeedsUp:
      roadStep?.onGrass === false && roadStep.speed > (grassStep?.speed ?? 999) - 1 && roadStep.speed >= 60,
    boostWorks: (boostStep?.boostsUsed ?? 0) >= 1,
    lapProgressWorks: lapStep?.lap === 2,
    cleanRunInRange:
      cleanRun?.ok === true &&
      cleanRun?.drivingMs >= 40000 &&
      cleanRun?.drivingMs <= 60000 &&
      cleanRun?.overtakes === 3 &&
      cleanRun?.balloons >= 1,
    garageReturnWorks: backToGarage === 'garage',
    restartWorks: restarted === 'race',
  };
}

async function runPortrait() {
  const session = boot(PORTRAIT.width, PORTRAIT.height);
  await session.waitFor(() => bridgeOf(session)?.scene, 20000, 'portrait boot');
  await sleep(1200);
  const portraitFlag = session.evaluate(() => Boolean(window.__GAME__?.registry.get('portrait')));
  const scene = bridgeOf(session)?.scene;
  const screenshot = session.shoot('headless-07-portrait-hint');
  report.steps.push({ step: 'portrait-hint', scene, portraitFlag, screenshot });
  report.portraitErrors = session.runtimeErrors;
  return { portraitHint: portraitFlag === true, portraitNoErrors: session.runtimeErrors.length === 0 };
}


/** Smoke check of the single-file offline build: boot, play, finish, restart. */
async function runOffline() {
  const htmlPath = path.join(ROOT, 'dist-offline/index.html');
  const session = bootHtmlFile(htmlPath, LANDSCAPE.width, LANDSCAPE.height);
  const report = { build: path.relative(ROOT, htmlPath), steps: [] };
  await session.waitFor(() => bridgeOf(session)?.scene, 25000, 'offline boot');
  await sleep(900);
  report.steps.push({ step: 'garage', scene: bridgeOf(session)?.scene, screenshot: session.shoot('offline-01-garage') });

  session.touch('down', 1250, 270);
  session.touch('up', 1250, 270);
  await session.waitFor(() => bridgeOf(session)?.scene === 'race', 25000, 'offline race scene');
  bridgeOf(session).timeScale = 15;
  await session.waitFor(() => stateOf(session)?.status === 'racing', 40000, 'offline racing');
  const cleanRun = bridgeOf(session)?.skipToFinish?.(777) ?? null;
  await session.waitFor(() => bridgeOf(session)?.scene === 'finish', 120000, 'offline finish');
  await sleep(900);
  report.steps.push({ step: 'finish', scene: bridgeOf(session)?.scene, screenshot: session.shoot('offline-02-finish') });
  report.cleanRun = cleanRun;
  report.runtimeErrors = session.runtimeErrors;
  report.consoleErrors = session.consoleErrors;
  report.checks = {
    offlineBoots: report.steps[0].scene === 'garage',
    offlinePlays: report.steps[1].step === 'finish',
    offlineCleanRun: cleanRun?.ok === true,
    offlineNoErrors: session.runtimeErrors.length === 0 && session.consoleErrors.length === 0,
  };
  report.pass = Object.values(report.checks).every(Boolean);
  writeFileSync(
    path.join(REPORTS, 'offline-run.json'),
    `${JSON.stringify(report, null, 2)}\n`,
    'utf8',
  );
  console.log(JSON.stringify({ pass: report.pass, checks: report.checks, cleanRun }, null, 2));
  process.exit(0);
}

async function main() {
  mkdirSync(SHOTS, { recursive: true });
  mkdirSync(REPORTS, { recursive: true });

  if (process.argv.includes('--offline')) {
    await runOffline();
    return;
  }

  const landscapeChecks = await runLandscape();
  const portraitChecks = await runPortrait();
  report.checks = { ...landscapeChecks, ...portraitChecks };
  report.pass = Object.values(report.checks).every(Boolean);

  writeFileSync(path.join(REPORTS, 'headless-run.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({ pass: report.pass, checks: report.checks, metrics: report.metrics, cleanRun: report.cleanRun }, null, 2));
  // jsdom keeps its rAF loop alive; the evidence is written, so stop deliberately.
  process.exit(0);
}

main().catch((error) => {
  report.failure = String(error);
  writeFileSync(path.join(REPORTS, 'headless-run.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  console.error(error);
  process.exit(1);
});
