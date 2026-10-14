import {
  ArcRotateCamera,
  Engine,
  Scene,
  Vector3,
} from '@babylonjs/core';
import { createInitialState, EXIT_X, EXIT_Z, GROWTH_THRESHOLDS, getOrganEffects, stepSimulation, type GameInput, type GameState, type OrganId } from './simulation';
import { VirtualJoystick } from './touch';
import { createMicroWorld } from './world';
import './style.css';

const canvas = requiredElement<HTMLCanvasElement>('renderCanvas');
const menu = requiredElement<HTMLElement>('menu-screen');
const hud = requiredElement<HTMLElement>('game-hud');
const joystickElement = requiredElement<HTMLElement>('joystick');
const actionControls = requiredElement<HTMLElement>('action-controls');
const startHint = requiredElement<HTMLElement>('start-hint');
const loading = requiredElement<HTMLElement>('loading-status');
const startButton = requiredElement<HTMLButtonElement>('start-button');
const pauseButton = requiredElement<HTMLButtonElement>('pause-button');
const pauseScreen = requiredElement<HTMLElement>('pause-screen');
const resumeButton = requiredElement<HTMLButtonElement>('resume-button');
const pauseRestartButton = requiredElement<HTMLButtonElement>('pause-restart-button');
const retryButton = requiredElement<HTMLButtonElement>('retry-button');
const lossScreen = requiredElement<HTMLElement>('loss-screen');
const editorScreen = requiredElement<HTMLElement>('editor-screen');
const editorDnaValue = requiredElement<HTMLElement>('editor-dna-value');
const editorFeedback = requiredElement<HTMLElement>('editor-feedback');
const editorApplyButton = requiredElement<HTMLButtonElement>('editor-apply');
const editorSlots = [requiredElement<HTMLButtonElement>('slot-a'), requiredElement<HTMLButtonElement>('slot-b')];
const organCards = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-organ]'));
const growthLabel = requiredElement<HTMLElement>('growth-label');
const buildReadout = requiredElement<HTMLElement>('build-readout');
const buildOrgans = requiredElement<HTMLElement>('build-organs');
const biteStatus = requiredElement<HTMLElement>('bite-status');
const missionBanner = requiredElement<HTMLElement>('mission-banner');
const threatWarning = requiredElement<HTMLElement>('threat-warning');
const threatDistance = requiredElement<HTMLElement>('threat-distance');
const threatArrow = requiredElement<HTMLElement>('threat-arrow');
const exitDistance = requiredElement<HTMLElement>('exit-distance');
const exitArrow = requiredElement<HTMLElement>('exit-arrow');
const winScreen = requiredElement<HTMLElement>('win-screen');
const winRetryButton = requiredElement<HTMLButtonElement>('win-retry-button');
const winMutations = requiredElement<HTMLElement>('win-mutations');
const winTime = requiredElement<HTMLElement>('win-time');
const biteButton = requiredElement<HTMLButtonElement>('bite-button');
const dashButton = requiredElement<HTMLButtonElement>('dash-button');
const healthValue = requiredElement<HTMLElement>('health-value');
const biomassValue = requiredElement<HTMLElement>('biomass-value');
const dnaValue = requiredElement<HTMLElement>('dna-value');
const dashCooldownLabel = requiredElement<HTMLElement>('dash-cooldown');
const growthMeter = requiredElement<HTMLElement>('game-hud').querySelector<HTMLElement>('.stage-meter span');

const engine = new Engine(canvas, true, {
  preserveDrawingBuffer: true,
  stencil: true,
  adaptToDeviceRatio: false,
  powerPreference: 'high-performance',
});
const scene = new Scene(engine);
scene.collisionsEnabled = false;
const camera = new ArcRotateCamera(
  'micro-world-camera',
  -Math.PI / 2,
  1.12,
  25,
  new Vector3(0, 0.5, 0),
  scene,
);
camera.fov = 0.78;
camera.lowerRadiusLimit = 16;
camera.upperRadiusLimit = 31;
camera.panningSensibility = 0;
camera.inertia = 0;
camera.inputs.clear();

const joystick = new VirtualJoystick(joystickElement);
const initialState = createInitialState();
const world = createMicroWorld(scene, camera, initialState);
let state: GameState = initialState;
let testAxes = { x: 0, z: 0 };
let keyboard = { x: 0, z: 0 };
let biteHeld = false;
let bitePulse = false;
let dashPending = false;
let previousTime = performance.now();
let renderCount = 0;
let fpsWindowStart = previousTime;
let visibleFps = 60;
let pausedByVisibility = false;
let draftOrgans: Array<OrganId | null> = [null, null];
let selectedSlot = 0;
const ORGAN_LABELS: Record<OrganId, string> = {
  flagellum: 'Жгутик',
  cilia: 'Реснички',
  spines: 'Шипы',
  proboscis: 'Хоботок',
};

function pauseExpedition(): void {
  if (state.phase !== 'playing') return;
  state = { ...state, phase: 'paused' };
  keyboard = { x: 0, z: 0 };
  testAxes = { x: 0, z: 0 };
  joystick.releaseAll();
  biteHeld = false;
  bitePulse = false;
  dashPending = false;
  joystickElement.classList.add('is-hidden');
  actionControls.classList.add('is-hidden');
  pauseScreen.classList.remove('is-hidden');
  previousTime = performance.now();
  updateHud();
}

function resumeExpedition(): void {
  if (state.phase !== 'paused') return;
  state = { ...state, phase: 'playing' };
  pauseScreen.classList.add('is-hidden');
  joystickElement.classList.remove('is-hidden');
  actionControls.classList.remove('is-hidden');
  previousTime = performance.now();
  updateHud();
}

function beginExpedition(): void {
  state = { ...createInitialState(state.seed), phase: 'playing' };
  pausedByVisibility = false;
  testAxes = { x: 0, z: 0 };
  keyboard = { x: 0, z: 0 };
  biteHeld = false;
  bitePulse = false;
  dashPending = false;
  menu.classList.add('is-hidden');
  pauseScreen.classList.add('is-hidden');
  lossScreen.classList.add('is-hidden');
  winScreen.classList.add('is-hidden');
  editorScreen.classList.add('is-hidden');
  missionBanner.classList.add('is-hidden');
  hud.classList.remove('is-hidden');
  joystickElement.classList.remove('is-hidden');
  actionControls.classList.remove('is-hidden');
  startHint.classList.remove('is-hidden');
  document.body.dataset.phase = 'playing';
  updateHud();
}

function finishLoss(): void {
  document.body.dataset.phase = 'lost';
  joystick.releaseAll();
  biteHeld = false;
  dashPending = false;
  joystickElement.classList.add('is-hidden');
  actionControls.classList.add('is-hidden');
  startHint.classList.add('is-hidden');
  missionBanner.classList.add('is-hidden');
  editorScreen.classList.add('is-hidden');
  lossScreen.classList.remove('is-hidden');
}

function finishWin(): void {
  document.body.dataset.phase = 'won';
  joystick.releaseAll();
  biteHeld = false;
  dashPending = false;
  joystickElement.classList.add('is-hidden');
  actionControls.classList.add('is-hidden');
  startHint.classList.add('is-hidden');
  missionBanner.classList.add('is-hidden');
  editorScreen.classList.add('is-hidden');
  winMutations.textContent = `${state.mutationsCompleted} / 2`;
  const minutes = Math.floor(state.elapsedSeconds / 60).toString().padStart(2, '0');
  const seconds = Math.floor(state.elapsedSeconds % 60).toString().padStart(2, '0');
  winTime.textContent = `${minutes}:${seconds}`;
  winScreen.classList.remove('is-hidden');
}

function openEditor(): void {
  if (state.phase !== 'editor') return;
  draftOrgans = [state.cell.organs[0] ?? null, state.cell.organs[1] ?? null];
  selectedSlot = Math.max(0, draftOrgans.findIndex((organ) => organ === null));
  keyboard = { x: 0, z: 0 };
  joystick.releaseAll();
  biteHeld = false;
  dashPending = false;
  joystickElement.classList.add('is-hidden');
  actionControls.classList.add('is-hidden');
  startHint.classList.add('is-hidden');
  editorScreen.classList.remove('is-hidden');
  renderEditor();
  updateHud();
}

function renderEditor(): void {
  editorDnaValue.textContent = String(state.cell.dna);
  editorSlots.forEach((slot, index) => {
    slot.classList.toggle('selected', selectedSlot === index);
    const organ = draftOrgans[index];
    const label = slot.querySelector('strong');
    if (label) label.textContent = organ ? ORGAN_LABELS[organ] : 'Пусто · выбрать';
  });
  for (const card of organCards) {
    const organ = card.dataset.organ as OrganId;
    card.classList.toggle('selected-slot', draftOrgans[selectedSlot] === organ);
    card.classList.toggle('equipped', draftOrgans.includes(organ));
  }

  const changedSlots = draftOrgans.filter((organ, index) => organ !== state.cell.organs[index]).length;
  editorApplyButton.disabled = changedSlots !== 1 || state.cell.dna < 1;
  if (changedSlots === 0) editorFeedback.textContent = 'Выбери один слот и новый орган.';
  else if (changedSlots > 1) editorFeedback.textContent = 'На этом пороге доступна одна мутация — измени только один слот.';
  else if (state.cell.dna < 1) editorFeedback.textContent = 'Для эволюции нужна 1 единица ДНК.';
  else editorFeedback.textContent = 'Новая мутация: 1 ДНК. Способности клетки изменятся.';
}

function chooseOrgan(organ: OrganId): void {
  const otherSlot = draftOrgans.findIndex((active, index) => active === organ && index !== selectedSlot);
  if (otherSlot >= 0) {
    editorFeedback.textContent = 'Этот орган уже установлен в другом слоте.';
    return;
  }
  draftOrgans[selectedSlot] = organ;
  renderEditor();
}

function applyMutation(): void {
  if (state.phase !== 'editor') return;
  const changedSlots = draftOrgans.filter((organ, index) => organ !== state.cell.organs[index]).length;
  if (changedSlots !== 1 || state.cell.dna < 1) {
    renderEditor();
    return;
  }

  const mutationsCompleted = state.mutationsCompleted + 1;
  const activateFinalEncounter = state.growthStage === 2 && mutationsCompleted >= 2 && !state.finalEncounterActive;
  const entities = activateFinalEncounter
    ? state.entities.map((entity) => entity.kind === 'predator' ? { ...entity, x: EXIT_X, z: EXIT_Z + 6, consumed: false } : entity)
    : state.entities;
  state = {
    ...state,
    phase: 'playing',
    mutationsCompleted,
    finalEncounterActive: state.finalEncounterActive || activateFinalEncounter,
    entities,
    cell: { ...state.cell, organs: [...draftOrgans], dna: state.cell.dna - 1 },
  };
  world.update(state, performance.now() / 1000);
  editorScreen.classList.add('is-hidden');
  joystickElement.classList.remove('is-hidden');
  actionControls.classList.remove('is-hidden');
  updateHud();
}

editorSlots.forEach((slot, index) => slot.addEventListener('click', () => {
  selectedSlot = index;
  renderEditor();
}));
organCards.forEach((card) => card.addEventListener('click', () => {
  const organ = card.dataset.organ as OrganId | undefined;
  if (organ) chooseOrgan(organ);
}));
editorApplyButton.addEventListener('click', applyMutation);

startButton.addEventListener('click', beginExpedition);
pauseButton.addEventListener('click', pauseExpedition);
resumeButton.addEventListener('click', resumeExpedition);
pauseRestartButton.addEventListener('click', beginExpedition);
retryButton.addEventListener('click', beginExpedition);
winRetryButton.addEventListener('click', beginExpedition);

document.addEventListener('visibilitychange', () => {
  if (document.hidden && state.phase === 'playing') {
    pausedByVisibility = true;
    pauseExpedition();
  } else if (!document.hidden && pausedByVisibility && state.phase === 'paused') {
    pausedByVisibility = false;
    resumeExpedition();
  }
});

function bindHold(button: HTMLButtonElement, onStart: () => void, onStop: () => void): void {
  const down = (event: PointerEvent): void => {
    event.preventDefault();
    button.classList.add('is-pressed');
    try { button.setPointerCapture(event.pointerId); } catch { /* optional on older browsers */ }
    onStart();
  };
  const up = (event: PointerEvent): void => {
    button.classList.remove('is-pressed');
    onStop();
  };
  button.addEventListener('pointerdown', down);
  button.addEventListener('pointerup', up);
  button.addEventListener('pointercancel', up);
  button.addEventListener('lostpointercapture', up);
}

bindHold(biteButton, () => { biteHeld = true; }, () => { biteHeld = false; });
biteButton.addEventListener('click', (event) => { if (event.detail === 0) bitePulse = true; });
dashButton.addEventListener('pointerdown', (event) => { event.preventDefault(); dashPending = true; });
dashButton.addEventListener('click', (event) => { if (event.detail === 0) dashPending = true; });

window.addEventListener('keydown', (event) => {
  const key = event.key.toLowerCase();
  if (key === 'arrowleft' || key === 'a') keyboard.x = -1;
  else if (key === 'arrowright' || key === 'd') keyboard.x = 1;
  else if (key === 'arrowup' || key === 'w') keyboard.z = 1;
  else if (key === 'arrowdown' || key === 's') keyboard.z = -1;
  else if (key === ' ' && document.body.dataset.phase === 'playing') bitePulse = true;
});
window.addEventListener('keyup', (event) => {
  const key = event.key.toLowerCase();
  if ((key === 'arrowleft' || key === 'a') && keyboard.x < 0) keyboard.x = 0;
  else if ((key === 'arrowright' || key === 'd') && keyboard.x > 0) keyboard.x = 0;
  else if ((key === 'arrowup' || key === 'w') && keyboard.z > 0) keyboard.z = 0;
  else if ((key === 'arrowdown' || key === 's') && keyboard.z < 0) keyboard.z = 0;
});
window.addEventListener('blur', () => {
  keyboard = { x: 0, z: 0 };
  biteHeld = false;
});

function readAxes(): { x: number; z: number } {
  const touch = joystick.vector;
  if (Math.hypot(touch.x, touch.z) > 0.02) return touch;
  if (Math.hypot(testAxes.x, testAxes.z) > 0.02) return testAxes;
  return keyboard;
}

function readInput(overrides: Partial<GameInput> = {}): GameInput {
  return {
    move: overrides.move ?? readAxes(),
    bite: overrides.bite ?? (biteHeld || bitePulse),
    dash: overrides.dash ?? dashPending,
  };
}

function updateHud(): void {
  const hearts = Array.from({ length: state.cell.maxHealth }, (_, index) => index < state.cell.health ? '●' : '○').join(' ');
  healthValue.textContent = hearts;
  biomassValue.innerHTML = `${state.cell.biomass} <i>/ 100</i>`;
  dnaValue.textContent = String(state.cell.dna);
  dashButton.disabled = state.dashCooldownSeconds > 0.05;
  dashCooldownLabel.textContent = state.dashCooldownSeconds > 0.05 ? `${state.dashCooldownSeconds.toFixed(1)}С` : 'ГОТОВ';
  if (state.growthStage === 0) {
    growthLabel.textContent = `ПЕРВЫЙ ПОРОГ · ${GROWTH_THRESHOLDS[0]}`;
    if (growthMeter) growthMeter.style.width = `${Math.min(100, (state.cell.biomass / GROWTH_THRESHOLDS[0]) * 100)}%`;
  } else if (state.growthStage === 1) {
    growthLabel.textContent = `ВТОРОЙ ПОРОГ · ${GROWTH_THRESHOLDS[1]}`;
    if (growthMeter) growthMeter.style.width = `${Math.min(100, ((state.cell.biomass - GROWTH_THRESHOLDS[0]) / (GROWTH_THRESHOLDS[1] - GROWTH_THRESHOLDS[0])) * 100)}%`;
  } else {
    growthLabel.textContent = state.finalEncounterActive ? 'ФИНАЛЬНАЯ ВСТРЕЧА' : 'РОСТ ДОСТИГНУТ';
    if (growthMeter) growthMeter.style.width = '100%';
  }
  const activeOrganNames = state.cell.organs.filter((organ): organ is OrganId => organ !== null).map((organ) => ORGAN_LABELS[organ]);
  buildReadout.classList.toggle('is-hidden', activeOrganNames.length === 0 || state.phase !== 'playing');
  buildOrgans.textContent = activeOrganNames.join(' · ').toLocaleUpperCase('ru-RU');
  const effects = getOrganEffects(state.cell.organs);
  const preyInRange = state.entities.some((entity) => entity.kind === 'prey' && !entity.consumed && Math.hypot(entity.x - state.cell.x, entity.z - state.cell.z) <= effects.biteRange + entity.radius);
  biteButton.classList.toggle('is-in-range', preyInRange && state.phase === 'playing');
  biteStatus.textContent = preyInRange ? 'В РАДИУСЕ' : 'ДОБЫЧУ';
  biteButton.setAttribute('aria-label', preyInRange ? 'Кусать добычу — цель в радиусе' : 'Кусать добычу');

  const exitDx = EXIT_X - state.cell.x;
  const exitDz = EXIT_Z - state.cell.z;
  exitDistance.textContent = `РАЗЛОМ · ${Math.round(Math.hypot(exitDx, exitDz))} ед.`;
  exitArrow.style.transform = `rotate(${Math.atan2(-exitDz, exitDx) * 180 / Math.PI}deg)`;
  missionBanner.classList.toggle('is-hidden', !state.finalEncounterActive || state.phase !== 'playing');
  const predator = state.entities.find((entity) => entity.kind === 'predator' && !entity.consumed);
  const predatorDistance = predator ? Math.hypot(predator.x - state.cell.x, predator.z - state.cell.z) : Infinity;
  const showThreat = state.phase === 'playing' && predator !== undefined && predatorDistance <= 14;
  threatWarning.classList.toggle('is-hidden', !showThreat);
  threatWarning.classList.toggle('is-danger', showThreat && predatorDistance <= 6);
  if (showThreat && predator) {
    const predatorDx = predator.x - state.cell.x;
    const predatorDz = predator.z - state.cell.z;
    threatDistance.textContent = `${Math.round(predatorDistance)} ед.`;
    threatArrow.style.transform = `rotate(${Math.atan2(-predatorDz, predatorDx) * 180 / Math.PI}deg)`;
  }
  document.body.dataset.phase = state.phase;
}

function simulate(deltaSeconds: number, input = readInput()): GameState {
  const oldPhase = state.phase;
  state = stepSimulation(state, input, deltaSeconds);
  bitePulse = false;
  dashPending = false;
  updateHud();
  if (oldPhase === 'playing' && state.phase === 'editor') openEditor();
  if (oldPhase !== 'lost' && state.phase === 'lost') finishLoss();
  if (oldPhase !== 'won' && state.phase === 'won') finishWin();
  return state;
}

function updateFrame(now: number): void {
  const rawSeconds = Math.max(0, (now - previousTime) / 1000);
  const deltaSeconds = Math.min(rawSeconds, 0.05);
  previousTime = now;

  if (state.phase === 'playing') {
    simulate(deltaSeconds);
    if (!startHint.classList.contains('is-hidden') && state.elapsedSeconds > 4) {
      startHint.classList.add('is-hidden');
    }
  }

  world.update(state, now / 1000);
  scene.render();
  renderCount += 1;
  if (now - fpsWindowStart >= 1000) {
    visibleFps = Math.round((renderCount * 1000) / (now - fpsWindowStart));
    renderCount = 0;
    fpsWindowStart = now;
    canvas.dataset.fps = String(visibleFps);
  }
}

window.__GAME_TEST__ = {
  start: beginExpedition,
  snapshot: () => structuredClone(state),
  setAxes: (x, z) => { testAxes = { x, z }; },
  setPosition: (x, z) => {
    state = { ...state, cell: { ...state.cell, x, z } };
    world.update(state, performance.now() / 1000);
  },
  setHealth: (health) => {
    state = { ...state, cell: { ...state.cell, health: Math.max(0, Math.min(state.cell.maxHealth, health)) } };
    updateHud();
  },
  setDNA: (dna) => {
    state = { ...state, cell: { ...state.cell, dna: Math.max(0, Math.floor(dna)) } };
    updateHud();
  },
  setBiomass: (biomass) => {
    state = { ...state, cell: { ...state.cell, biomass: Math.max(0, Math.min(100, Math.floor(biomass))) } };
    updateHud();
  },
  setLoadout: (organs) => {
    state = { ...state, cell: { ...state.cell, organs: [organs[0] ?? null, organs[1] ?? null] } };
    world.update(state, performance.now() / 1000);
    updateHud();
  },
  organVisible: (organ) => world.organVisible(organ),
  exitVisible: () => world.exitVisible(),
  effects: () => getOrganEffects(state.cell.organs),
  teleportToEntity: (id) => {
    const entity = state.entities.find((candidate) => candidate.id === id && !candidate.consumed);
    if (!entity) return false;
    state = { ...state, cell: { ...state.cell, x: entity.x, z: entity.z } };
    world.update(state, performance.now() / 1000);
    return true;
  },
  entities: () => structuredClone(state.entities),
  step: (seconds, actions = {}) => simulate(seconds, readInput(actions)),
  axes: () => ({ ...readAxes() }),
};

engine.runRenderLoop(() => updateFrame(performance.now()));
window.addEventListener('resize', () => engine.resize());

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js', { updateViaCache: 'none' }).catch((error: unknown) => {
      console.warn('[Microgenesis] Service worker registration failed', error);
    });
  });
}

loading.classList.add('is-hidden');
window.__READY__ = true;
canvas.dataset.fps = String(visibleFps);
updateHud();

function requiredElement<T extends HTMLElement>(id: string): T {
  const element = document.getElementById(id);
  if (!element) throw new Error(`Missing required game element: #${id}`);
  return element as T;
}
