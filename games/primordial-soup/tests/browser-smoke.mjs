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
const evidenceStem = `iteration-${String(iteration).padStart(2, '0')}`;

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
  defaultViewport: { width: 844, height: 390, isMobile: true, hasTouch: true, deviceScaleFactor: 1 },
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
  await page.screenshot({ path: path.join(screenshots, `${evidenceStem}-gameplay.png`) });

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
    button.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerId: 91, button: 0 }));
    const first = T.step(0.01, { move: { x: 0, z: 0 } });
    button.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerId: 91, button: 0 }));
    const second = T.step(0.01, { move: { x: 0, z: 0 }, bite: true });
    return {
      dna: first.cell.dna,
      biomass: first.cell.biomass,
      eaten: first.entities.find((item) => item.id === prey.id)?.consumed,
      noDuplicateDna: second.cell.dna === first.cell.dna,
    };
  });
  check('touch bite consumes nearby prey for DNA and biomass', Boolean(biteResult?.eaten && biteResult.dna === 1 && biteResult.biomass > 0 && biteResult.noDuplicateDna), JSON.stringify(biteResult));

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

  const editorSetup = await page.evaluate(() => {
    const T = window.__GAME_TEST__;
    T.start();
    T.setDNA(3);
    const mutationButton = document.getElementById('evolution-button');
    const unlocked = !mutationButton.classList.contains('is-hidden');
    mutationButton.click();
    const editorOpened = !document.getElementById('editor-screen').classList.contains('is-hidden');
    const phaseInEditor = T.snapshot().phase;
    document.querySelector('[data-organ="flagellum"]').click();
    document.getElementById('slot-b').click();
    document.querySelector('[data-organ="proboscis"]').click();
    return { unlocked, editorOpened, phaseInEditor, canSave: !document.getElementById('editor-apply').disabled };
  });
  await page.screenshot({ path: path.join(screenshots, `${evidenceStem}-editor.png`) });
  const editorResult = await page.evaluate(() => {
    const T = window.__GAME_TEST__;
    document.getElementById('editor-apply').click();
    const after = T.snapshot();
    return {
      closed: document.getElementById('editor-screen').classList.contains('is-hidden'),
      finalPhase: after.phase,
      organs: after.cell.organs,
      dna: after.cell.dna,
      proboscisVisible: T.organVisible('proboscis'),
      flagellumVisible: T.organVisible('flagellum'),
    };
  });
  const fullEditorResult = { ...editorSetup, ...editorResult };
  check('touch editor fills both organ slots and spends one DNA per slot', Boolean(fullEditorResult.unlocked && fullEditorResult.editorOpened && fullEditorResult.phaseInEditor === 'editor' && fullEditorResult.canSave && fullEditorResult.closed && fullEditorResult.finalPhase === 'playing' && fullEditorResult.organs[0] === 'flagellum' && fullEditorResult.organs[1] === 'proboscis' && fullEditorResult.dna === 1 && fullEditorResult.proboscisVisible && fullEditorResult.flagellumVisible), JSON.stringify(fullEditorResult));

  check('no browser console or runtime errors', errors.length === 0, errors.slice(0, 5).join(' | '));
} catch (error) {
  errors.push(`test: ${error instanceof Error ? error.stack || error.message : String(error)}`);
} finally {
  await browser.close();
}

const report = {
  iteration,
  url: baseUrl,
  viewport: { width: 844, height: 390, mobile: true, touch: true },
  checks,
  errors,
  passed: checks.filter((item) => item.passed).length,
  total: checks.length,
  completedAt: new Date().toISOString(),
};
await fs.writeFile(path.join(reports, `${evidenceStem}.json`), `${JSON.stringify(report, null, 2)}\n`);
console.log(`\n${report.passed}/${report.total} browser checks passed.`);
if (errors.length > 0 || report.passed !== report.total) process.exitCode = 1;
