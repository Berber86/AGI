import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

const here = path.dirname(fileURLToPath(import.meta.url));
const gameRoot = path.resolve(here, '..');
const repoRoot = path.resolve(gameRoot, '../..');
const evidenceRoot = path.join(repoRoot, '.studio', 'evidence');
const screenshots = path.join(evidenceRoot, 'screenshots');
const reports = path.join(evidenceRoot, 'reports');
const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:5173/';
const iteration = Math.max(1, Number(process.env.ITERATION || 1));
const viewport = {
  width: Math.max(320, Number(process.env.VIEWPORT_WIDTH || 844)),
  height: Math.max(240, Number(process.env.VIEWPORT_HEIGHT || 390)),
};
const viewportSuffix = process.env.VIEWPORT_WIDTH || process.env.VIEWPORT_HEIGHT ? `-${viewport.width}x${viewport.height}` : '';
const evidenceStem = `iteration-${String(iteration).padStart(2, '0')}${viewportSuffix}`;

await fs.mkdir(screenshots, { recursive: true });
await fs.mkdir(reports, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: await chromium.executablePath(),
  args: [
    ...chromium.args,
    '--use-gl=angle',
    '--use-angle=swiftshader',
    '--enable-unsafe-swiftshader',
    '--hide-scrollbars',
    '--mute-audio',
  ],
  headless: true,
  defaultViewport: { ...viewport, isMobile: true, hasTouch: true, deviceScaleFactor: 1 },
  protocolTimeout: 120000,
});

const page = await browser.newPage();
const errors = [];
page.on('pageerror', (error) => errors.push(`page: ${error.message}`));
page.on('console', (message) => {
  if (message.type() === 'error') errors.push(`console: ${message.text()}`);
});

const checks = [];
function check(name, passed, detail = '') {
  checks.push({ name, passed: Boolean(passed), detail });
  console.log(`${passed ? 'PASS' : 'FAIL'} ${name}${detail ? ` — ${detail}` : ''}`);
}

try {
  await page.goto(baseUrl, { waitUntil: 'networkidle0', timeout: 90000 });
  await page.waitForFunction(() => window.__READY__ === true, { timeout: 60000 });
  await page.waitForFunction(() => Number(document.querySelector('#renderCanvas')?.dataset.fps) > 0, { timeout: 60000 });
  await page.screenshot({ path: path.join(screenshots, `${evidenceStem}.png`) });

  const initial = await page.evaluate(() => {
    const snapshot = window.__GAME_TEST__?.snapshot();
    return snapshot ? { phase: snapshot.phase, seed: snapshot.seed, entities: snapshot.entities.length, cellX: snapshot.cell.x } : null;
  });
  check('game booted with test bridge', Boolean(initial && initial.phase === 'menu'), JSON.stringify(initial));

  await page.evaluate(() => window.__GAME_TEST__?.start());
  await page.evaluate(() => {
    window.__GAME_TEST__?.setAxes(1, 0);
    window.__GAME_TEST__?.step(0.05);
  });
  const moved = await page.evaluate(() => window.__GAME_TEST__?.snapshot());
  check('steering changes cell position', moved?.cell.x > initial.cellX, `x=${moved?.cell.x}`);
  check('cell remains inside movement bounds', Math.abs(moved?.cell.x) <= 34 && Math.abs(moved?.cell.z) <= 34);
  const controlBounds = await page.evaluate(() => ['#joystick', '#bite-button', '#dash-button', '#pause-button'].map((selector) => {
    const rect = document.querySelector(selector).getBoundingClientRect();
    return { selector, left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom };
  }));
  check('landscape touch controls stay inside the viewport', controlBounds.every((rect) => rect.left >= 0 && rect.top >= 0 && rect.right <= viewport.width && rect.bottom <= viewport.height), JSON.stringify(controlBounds));

  await page.evaluate(() => {
    window.__GAME_TEST__?.setPosition(33.99, 0);
    window.__GAME_TEST__?.setAxes(1, 0);
    window.__GAME_TEST__?.step(0.05);
  });
  const edge = await page.evaluate(() => window.__GAME_TEST__?.snapshot());
  check('world edge is clamped', edge?.cell.x <= 34 && edge?.cell.x >= -34, `x=${edge?.cell.x}`);

  await page.evaluate(() => {
    window.__GAME_TEST__?.setPosition(0, 0);
    const pad = document.querySelector('#joystick');
    const rect = pad.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.width * 0.42;
    pad.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerId: 77, button: 0, clientX: cx, clientY: cy }));
    pad.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, pointerId: 77, button: 0, clientX: cx + 22, clientY: cy }));
  });
  const touchResult = await page.evaluate(() => {
    const before = window.__GAME_TEST__?.snapshot();
    const axes = window.__GAME_TEST__?.axes();
    const after = window.__GAME_TEST__?.step(0.05);
    return { axes, beforeX: before?.cell.x, afterX: after?.cell.x };
  });
  check('virtual joystick reports touch direction', Math.abs(touchResult.axes?.x || 0) > 0.4, JSON.stringify(touchResult.axes));
  check('touch steering moves the cell without a keyboard', (touchResult.afterX || 0) > (touchResult.beforeX || 0), JSON.stringify(touchResult));
  await page.evaluate(() => {
    const pad = document.querySelector('#joystick');
    pad.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerId: 77, button: 0 }));
    window.__GAME_TEST__?.setAxes(0, 0);
    window.__GAME_TEST__?.setPosition(0, 0);
  });
  const joystickCancel = await page.evaluate(() => {
    const T = window.__GAME_TEST__;
    const pad = document.querySelector('#joystick');
    const rect = pad.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.width * 0.42;
    pad.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerId: 78, button: 0, clientX: cx, clientY: cy }));
    pad.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, pointerId: 78, button: 0, clientX: cx + 22, clientY: cy }));
    const before = T.axes();
    pad.dispatchEvent(new PointerEvent('pointercancel', { bubbles: true, pointerId: 78, button: 0 }));
    const after = T.axes();
    return { before, after, active: pad.classList.contains('is-active') };
  });
  check('touch cancellation releases the virtual joystick', Boolean(Math.abs(joystickCancel.before?.x || 0) > 0.4 && joystickCancel.after?.x === 0 && joystickCancel.after?.z === 0 && !joystickCancel.active), JSON.stringify(joystickCancel));
  await page.screenshot({ path: path.join(screenshots, `${evidenceStem}-gameplay.png`) });

  const pauseResult = await page.evaluate(() => {
    const T = window.__GAME_TEST__;
    T.setAxes(1, 0);
    const before = T.snapshot();
    document.getElementById('pause-button').click();
    const paused = T.snapshot();
    const overlayVisible = !document.getElementById('pause-screen').classList.contains('is-hidden');
    T.step(0.05, { move: { x: 1, z: 0 }, bite: true, dash: true });
    const afterStep = T.snapshot();
    return {
      before,
      paused,
      afterStep,
      overlayVisible,
      controlsHidden: document.getElementById('action-controls').classList.contains('is-hidden'),
    };
  });
  await page.screenshot({ path: path.join(screenshots, `${evidenceStem}-pause.png`) });
  const resumeResult = await page.evaluate(() => {
    document.getElementById('resume-button').click();
    return {
      phase: window.__GAME_TEST__?.snapshot().phase,
      overlayHidden: document.getElementById('pause-screen').classList.contains('is-hidden'),
      controlsVisible: !document.getElementById('action-controls').classList.contains('is-hidden'),
    };
  });
  check('manual pause freezes simulation and resume restores controls', Boolean(pauseResult.paused.phase === 'paused' && pauseResult.overlayVisible && pauseResult.controlsHidden && pauseResult.afterStep.elapsedSeconds === pauseResult.before.elapsedSeconds && pauseResult.afterStep.cell.x === pauseResult.before.cell.x && resumeResult.phase === 'playing' && resumeResult.overlayHidden && resumeResult.controlsVisible), JSON.stringify({ phase: pauseResult.paused.phase, overlay: pauseResult.overlayVisible, frozen: pauseResult.afterStep.elapsedSeconds === pauseResult.before.elapsedSeconds, resumeResult }));
  const pauseRestartResult = await page.evaluate(() => {
    const T = window.__GAME_TEST__;
    T.setBiomass(24);
    document.getElementById('pause-button').click();
    document.getElementById('pause-restart-button').click();
    const state = T.snapshot();
    return { phase: state.phase, biomass: state.cell.biomass, health: state.cell.health, overlayHidden: document.getElementById('pause-screen').classList.contains('is-hidden') };
  });
  check('restart is available from the pause screen', Boolean(pauseRestartResult.phase === 'playing' && pauseRestartResult.biomass === 0 && pauseRestartResult.health === 3 && pauseRestartResult.overlayHidden), JSON.stringify(pauseRestartResult));

  const visibilityResult = await page.evaluate(() => {
    const T = window.__GAME_TEST__;
    const pad = document.querySelector('#joystick');
    const rect = pad.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.width * 0.42;
    pad.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerId: 79, button: 0, clientX: cx, clientY: cy }));
    pad.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, pointerId: 79, button: 0, clientX: cx + 22, clientY: cy }));
    Object.defineProperty(document, 'hidden', { configurable: true, value: true });
    document.dispatchEvent(new Event('visibilitychange'));
    const hidden = { phase: T.snapshot().phase, axis: T.axes(), joystickActive: pad.classList.contains('is-active') };
    Object.defineProperty(document, 'hidden', { configurable: true, value: false });
    document.dispatchEvent(new Event('visibilitychange'));
    const visible = T.snapshot().phase;
    delete document.hidden;
    return { hidden, visible };
  });
  check('backgrounding pauses safely and foregrounding resumes without stuck touch input', Boolean(visibilityResult.hidden.phase === 'paused' && visibilityResult.hidden.axis.x === 0 && visibilityResult.hidden.axis.z === 0 && !visibilityResult.hidden.joystickActive && visibilityResult.visible === 'playing'), JSON.stringify(visibilityResult));

  const nutrientResult = await page.evaluate(() => {
    const T = window.__GAME_TEST__;
    T.start();
    const nutrient = T.entities().find((item) => item.kind === 'nutrient');
    if (!nutrient) return null;
    T.teleportToEntity(nutrient.id);
    const first = T.step(0.01, { move: { x: 0, z: 0 } });
    const firstAmount = first.cell.biomass;
    const collectedOnce = first.entities.find((item) => item.id === nutrient.id)?.consumed;
    const second = T.step(0.01, { move: { x: 0, z: 0 } });
    return { firstAmount, secondAmount: second.cell.biomass, collectedOnce };
  });
  check('nutrient contact grants biomass once', Boolean(nutrientResult?.collectedOnce && nutrientResult.firstAmount > 0 && nutrientResult.secondAmount === nutrientResult.firstAmount), JSON.stringify(nutrientResult));

  const biteResult = await page.evaluate(() => {
    const T = window.__GAME_TEST__;
    T.start();
    const prey = T.entities().find((item) => item.kind === 'prey');
    if (!prey) return null;
    T.teleportToEntity(prey.id);
    const button = document.getElementById('bite-button');
    T.step(0.001, { move: { x: 0, z: 0 }, bite: false });
    const biteReady = button.classList.contains('is-in-range');
    const readyLabel = document.getElementById('bite-status').textContent;
    button.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerId: 91, button: 0 }));
    const first = T.step(0.01, { move: { x: 0, z: 0 } });
    button.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerId: 91, button: 0 }));
    const second = T.step(0.01, { move: { x: 0, z: 0 }, bite: true });
    return {
      dna: first.cell.dna,
      biomass: first.cell.biomass,
      eaten: first.entities.find((item) => item.id === prey.id)?.consumed,
      noDuplicateDna: second.cell.dna === first.cell.dna,
      biteReady,
      readyLabel,
    };
  });
  check('touch bite consumes nearby prey for DNA and biomass', Boolean(biteResult?.eaten && biteResult.dna === 1 && biteResult.biomass > 0 && biteResult.noDuplicateDna && biteResult.biteReady && biteResult.readyLabel === 'В РАДИУСЕ'), JSON.stringify(biteResult));

  const predatorResult = await page.evaluate(() => {
    const T = window.__GAME_TEST__;
    T.start();
    const predator = T.entities().find((item) => item.kind === 'predator');
    if (!predator) return null;
    T.setPosition(predator.x + 2, predator.z);
    const first = T.step(0.05, { move: { x: 0, z: 0 } });
    const second = T.step(0.05, { move: { x: 0, z: 0 } });
    return { healthAfterContact: first.cell.health, healthAfterCooldownFrame: second.cell.health };
  });
  check('predator contact damages once and respects cooldown', predatorResult?.healthAfterContact === 2 && predatorResult.healthAfterCooldownFrame === 2, JSON.stringify(predatorResult));

  const dashResult = await page.evaluate(() => {
    const T = window.__GAME_TEST__;
    T.start();
    const predator = T.entities().find((item) => item.kind === 'predator');
    if (!predator) return null;
    T.setPosition(predator.x + 2, predator.z);
    const before = T.snapshot().cell.x;
    const after = T.step(0.05, { move: { x: 1, z: 0 }, dash: true });
    return { before, after: after.cell.x, health: after.cell.health, cooldown: after.dashCooldownSeconds };
  });
  check('dash creates distance and a temporary safe window', Boolean(dashResult && dashResult.after > dashResult.before + 3 && dashResult.health === 3 && dashResult.cooldown > 2), JSON.stringify(dashResult));

  const touchDashResult = await page.evaluate(() => {
    const T = window.__GAME_TEST__;
    T.start();
    const predator = T.entities().find((item) => item.kind === 'predator');
    if (!predator) return null;
    T.setPosition(predator.x + 2, predator.z);
    const before = T.snapshot().cell.x;
    document.getElementById('dash-button').dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerId: 92, button: 0 }));
    const after = T.step(0.05, { move: { x: 1, z: 0 } });
    return { distance: after.cell.x - before, health: after.cell.health, cooldown: after.dashCooldownSeconds };
  });
  check('touch dash button activates the escape action', Boolean(touchDashResult && touchDashResult.distance > 3 && touchDashResult.health === 3 && touchDashResult.cooldown > 2), JSON.stringify(touchDashResult));

  const organResult = await page.evaluate(() => {
    const T = window.__GAME_TEST__;
    T.start();
    T.setLoadout(['flagellum', 'spines']);
    T.setPosition(0, 0);
    const before = T.snapshot();
    const after = T.step(0.05, { move: { x: 1, z: 0 } });
    return {
      travel: after.cell.x - before.cell.x,
      speedMultiplier: T.effects().movementSpeedMultiplier,
      flagellumVisible: T.organVisible('flagellum'),
      spinesVisible: T.organVisible('spines'),
      ciliaVisible: T.organVisible('cilia'),
    };
  });
  check('equipped organs are visible and change movement mechanics', Boolean(organResult?.travel > 0.5 && organResult.speedMultiplier === 1.35 && organResult.flagellumVisible && organResult.spinesVisible && !organResult.ciliaVisible), JSON.stringify(organResult));

  const silhouetteResult = await page.evaluate(() => {
    const T = window.__GAME_TEST__;
    const visibility = {};
    for (const organ of ['flagellum', 'cilia', 'spines', 'proboscis']) {
      T.setLoadout([organ, null]);
      visibility[organ] = T.organVisible(organ);
    }
    return visibility;
  });
  check('all four selectable organs change the visible cell silhouette', Boolean(['flagellum', 'cilia', 'spines', 'proboscis'].every((organ) => silhouetteResult?.[organ] === true)), JSON.stringify(silhouetteResult));

  const firstMilestone = await page.evaluate(() => {
    const T = window.__GAME_TEST__;
    T.start();
    T.setBiomass(36);
    const state = T.step(0.01, { move: { x: 0, z: 0 } });
    return {
      phase: state.phase,
      growthStage: state.growthStage,
      dna: state.cell.dna,
      editorVisible: !document.getElementById('editor-screen').classList.contains('is-hidden'),
    };
  });
  await page.screenshot({ path: path.join(screenshots, `${evidenceStem}-editor.png`) });
  check('first growth threshold automatically opens mutation editor', Boolean(firstMilestone?.phase === 'editor' && firstMilestone.growthStage === 1 && firstMilestone.dna >= 1 && firstMilestone.editorVisible), JSON.stringify(firstMilestone));

  const firstMutation = await page.evaluate(() => {
    const T = window.__GAME_TEST__;
    document.querySelector('[data-organ="cilia"]').click();
    const canApply = !document.getElementById('editor-apply').disabled;
    document.getElementById('editor-apply').click();
    const state = T.snapshot();
    return { canApply, phase: state.phase, mutations: state.mutationsCompleted, organ: state.cell.organs[0], growthStage: state.growthStage };
  });
  const secondMilestone = await page.evaluate(() => {
    const T = window.__GAME_TEST__;
    T.setBiomass(72);
    const state = T.step(0.01, { move: { x: 0, z: 0 } });
    return { phase: state.phase, growthStage: state.growthStage, editorVisible: !document.getElementById('editor-screen').classList.contains('is-hidden') };
  });
  const finalMutation = await page.evaluate(() => {
    const T = window.__GAME_TEST__;
    document.getElementById('slot-b').click();
    document.querySelector('[data-organ="proboscis"]').click();
    const canApply = !document.getElementById('editor-apply').disabled;
    document.getElementById('editor-apply').click();
    const state = T.snapshot();
    return {
      canApply,
      phase: state.phase,
      growthStage: state.growthStage,
      mutations: state.mutationsCompleted,
      organs: state.cell.organs,
      finalEncounterActive: state.finalEncounterActive,
      exitVisible: T.exitVisible(),
      missionVisible: !document.getElementById('mission-banner').classList.contains('is-hidden'),
      buildText: document.getElementById('build-organs').textContent,
    };
  });
  await page.evaluate(() => window.__GAME_TEST__?.setPosition(25, -24));
  await new Promise((resolve) => setTimeout(resolve, 600));
  await page.screenshot({ path: path.join(screenshots, `${evidenceStem}-final-encounter.png`) });
  const threatResult = await page.evaluate(() => ({
    visible: !document.getElementById('threat-warning').classList.contains('is-hidden'),
    danger: document.getElementById('threat-warning').classList.contains('is-danger'),
    distance: document.getElementById('threat-distance').textContent,
  }));
  check('nearby predator gets a distance and danger warning', Boolean(threatResult.visible && threatResult.danger && Number.parseInt(threatResult.distance, 10) <= 6), JSON.stringify(threatResult));
  const victoryResult = await page.evaluate(() => {
    const T = window.__GAME_TEST__;
    T.setPosition(29, -28);
    const state = T.step(0.01, { move: { x: 0, z: 0 } });
    return { phase: state.phase, winVisible: !document.getElementById('win-screen').classList.contains('is-hidden'), mutations: state.mutationsCompleted };
  });
  await page.screenshot({ path: path.join(screenshots, `${evidenceStem}-win.png`) });
  check('two biomass thresholds lead through two mutations to the final exit win', Boolean(firstMilestone?.phase === 'editor' && firstMilestone.growthStage === 1 && firstMutation.canApply && firstMutation.organ === 'cilia' && firstMutation.mutations === 1 && secondMilestone?.phase === 'editor' && secondMilestone.growthStage === 2 && secondMilestone.editorVisible && finalMutation.canApply && finalMutation.organs[1] === 'proboscis' && finalMutation.mutations === 2 && finalMutation.finalEncounterActive && finalMutation.exitVisible && finalMutation.missionVisible && finalMutation.buildText === 'РЕСНИЧКИ · ХОБОТОК' && victoryResult?.phase === 'won' && victoryResult.winVisible && victoryResult.mutations === 2), JSON.stringify({ firstMilestone, firstMutation, secondMilestone, finalMutation, victoryResult }));

  const lossResult = await page.evaluate(() => {
    const T = window.__GAME_TEST__;
    T.start();
    const predator = T.entities().find((item) => item.kind === 'predator');
    if (!predator) return null;
    T.setHealth(1);
    T.setPosition(predator.x + 2, predator.z);
    const lost = T.step(0.05, { move: { x: 0, z: 0 } });
    return { phase: lost.phase, health: lost.cell.health, lossVisible: !document.getElementById('loss-screen').classList.contains('is-hidden') };
  });
  await page.screenshot({ path: path.join(screenshots, `${evidenceStem}-loss.png`) });
  const restartResult = await page.evaluate(() => {
    document.getElementById('retry-button').click();
    const state = window.__GAME_TEST__.snapshot();
    return { phase: state.phase, health: state.cell.health, biomass: state.cell.biomass, growthStage: state.growthStage, finalEncounterActive: state.finalEncounterActive };
  });
  check('zero-health loss and restart clear the expedition state', Boolean(lossResult?.phase === 'lost' && lossResult.health === 0 && lossResult.lossVisible && restartResult.phase === 'playing' && restartResult.health === 3 && restartResult.biomass === 0 && restartResult.growthStage === 0 && !restartResult.finalEncounterActive), JSON.stringify({ lossResult, restartResult }));

  check('no browser console or runtime errors', errors.length === 0, errors.slice(0, 5).join(' | '));
} catch (error) {
  errors.push(`test: ${error instanceof Error ? error.stack || error.message : String(error)}`);
} finally {
  await browser.close();
}

const report = {
  iteration,
  url: baseUrl,
  viewport: { ...viewport, mobile: true, touch: true },
  checks,
  errors,
  passed: checks.filter((item) => item.passed).length,
  total: checks.length,
  completedAt: new Date().toISOString(),
};
await fs.writeFile(path.join(reports, `${evidenceStem}.json`), `${JSON.stringify(report, null, 2)}\n`);
console.log(`\n${report.passed}/${report.total} browser checks passed.`);
if (errors.length > 0 || report.passed !== report.total) process.exitCode = 1;
