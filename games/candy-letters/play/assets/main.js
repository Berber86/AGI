/**
 * «Сладкие буквы» — точка входа.
 * Связывает чистое состояние (state.js), отрисовку (render.js),
 * озвучку (audio.js) и касания ребёнка.
 */

import { LETTERS, LETTER_IDS, letterById } from './letters.js';
import { boardGeometry, toBoard, flattenPath } from './paths.js';
import { scoreAttempt, TRACE_RULES } from './tracing.js';
import {
  applyAction,
  createGame,
  SCREENS,
  LIVES,
  WRITE_ATTEMPTS,
  summary,
  toPersisted,
} from './state.js';
import { audio } from './audio.js';
import {
  fitCanvas,
  drawCandyBackground,
  drawLollipopCard,
  drawLollipopDisc,
  drawLetterOnCandy,
  drawTraceBoard,
  drawSprinkles,
  makeSprinkles,
  stepSprinkles,
} from './render.js';

const STORAGE_KEY = 'candy-letters-progress-v1';
const $ = (selector) => document.querySelector(selector);

const dom = {
  scene: $('#scene'),
  sprinkles: $('#sprinkles'),
  lives: $('#lives'),
  progressPill: $('#progress-pill'),
  letterLabel: $('#topbar-letter'),
  screens: Object.fromEntries(
    Object.values(SCREENS).map((name) => [name, document.querySelector(`[data-screen="${name}"]`)]),
  ),
  menuGrid: $('#menu-grid'),
  letterCard: $('#letter-canvas'),
  letterButton: $('#letter-card'),
  letterBig: $('#letter-big'),
  letterWord: $('#letter-word'),
  letterFlavor: $('#letter-flavor'),
  traceBoard: $('#trace-board'),
  writeBoard: $('#write-board'),
  traceStatus: $('#trace-status'),
  writeStatus: $('#write-status'),
  listenGrid: $('#listen-grid'),
  listenPrompt: $('#listen-prompt'),
  listenRound: $('#listen-round'),
  albumGrid: $('#album-grid'),
  albumCount: $('#album-count'),
  parentStats: $('#parent-stats'),
  parentVoice: $('#parent-voice'),
  rewardLetter: $('#reward-letter'),
  rewardStars: $('#reward-stars'),
  rewardText: $('#reward-text'),
  winCount: $('#win-count'),
  toast: $('#toast'),
  rotate: $('#rotate-hint'),
  pauseBadge: $('#pause-badge'),
};

let state = createGame(Date.now() % 100000);
let drawnStrokes = [];
let activeStroke = null;
let guideProgress = 0;
let showGuide = true;
let particles = [];
let finishing = false;
let lastTask = null;
let lastLetter = null;
let toastTimer = null;
let lastSpoken = '';

/* ------------------------------------------------------------------ */
/* Состояние                                                           */
/* ------------------------------------------------------------------ */

function dispatch(action) {
  state = applyAction(state, action);
  persist();
  render();
  return state;
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toPersisted(state)));
  } catch (error) {
    /* приватный режим — играем без сохранения */
  }
}

function restore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw);
    if (saved && saved.progress) {
      state = applyAction(state, { type: 'load-progress', progress: saved.progress });
    }
    if (saved && typeof saved.soundOn === 'boolean') {
      state = applyAction(state, { type: 'set-sound', on: saved.soundOn });
      audio.setEnabled(state.soundOn);
    }
  } catch (error) {
    /* битый JSON — начинаем с чистой коробки */
  }
}

function currentLetter() {
  return letterById(state.letterId) || LETTERS[0];
}

/* ------------------------------------------------------------------ */
/* Звук и речь                                                         */
/* ------------------------------------------------------------------ */

function speak(text, fallback = 'tap') {
  if (!state.soundOn) return;
  audio.unlock();
  audio.speak(text, { fallback });
}

function effect(name) {
  if (!state.soundOn) return;
  audio.unlock();
  audio.effect(name);
}

audio.onVoiceMissing(() => {
  // Голоса нет — вместо речи уже звучит мелодия. Ребёнку об этом не сообщаем,
  // взрослый увидит причину в родительском режиме.
  lastSpoken = 'voice-missing';
});

/* ------------------------------------------------------------------ */
/* Конфетти                                                            */
/* ------------------------------------------------------------------ */

function celebrate(x, y) {
  const canvas = dom.sprinkles;
  particles = particles.concat(makeSprinkles(canvas.clientWidth, canvas.clientHeight, { x, y }));
}

function celebrateCenter() {
  const canvas = dom.sprinkles;
  celebrate(canvas.clientWidth / 2, canvas.clientHeight * 0.42);
}

/* ------------------------------------------------------------------ */
/* Отрисовка экранов                                                   */
/* ------------------------------------------------------------------ */

function starsHtml(count) {
  const total = 3;
  let html = '';
  for (let i = 0; i < total; i += 1) {
    html += `<span class="star${i < count ? ' on' : ''}">★</span>`;
  }
  return html;
}

function renderMenu() {
  const grid = dom.menuGrid;
  if (grid.childElementCount !== LETTERS.length) {
    grid.innerHTML = LETTERS.map(
      (letter) => `
        <button class="candy-card" type="button" data-letter="${letter.id}"
                style="--candy:${letter.color};--candy-deep:${letter.colorDeep};--candy-soft:${letter.highlight}">
          <canvas class="candy-disc" width="120" height="120" aria-hidden="true"></canvas>
          <span class="candy-letter">${letter.upper}</span>
          <span class="candy-flavor">${letter.flavor}</span>
          <span class="candy-stars">${starsHtml(0)}</span>
          <span class="candy-state">Играть</span>
        </button>`,
    ).join('');
    grid.querySelectorAll('[data-letter]').forEach((button) => {
      button.addEventListener('click', () => {
        effect('tap');
        dispatch({ type: 'choose-letter', letterId: button.dataset.letter });
        speak(currentLetter().speak);
      });
    });
  }
  grid.querySelectorAll('[data-letter]').forEach((button) => {
    const letter = letterById(button.dataset.letter);
    const entry = state.progress[letter.id];
    button.querySelector('.candy-stars').innerHTML = starsHtml(entry.stars);
    button.querySelector('.candy-state').textContent = entry.done ? 'Снова!' : 'Играть';
    button.classList.toggle('done', entry.done);
    const canvas = button.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawLollipopDisc(ctx, 60, 60, 50, [letter.color, '#fff8fb'], 2, performance.now());
    drawLetterOnCandy(ctx, 60, 60, letter.upper, 52, '#ffffff');
  });
}

function applyAccent(letter) {
  const root = document.documentElement;
  root.style.setProperty('--candy', letter.color);
  root.style.setProperty('--candy-deep', letter.colorDeep);
  root.style.setProperty('--candy-soft', letter.highlight);
}

function renderLetterCard() {
  const letter = currentLetter();
  applyAccent(letter);
  dom.letterBig.textContent = letter.upper;
  dom.letterWord.textContent = `${letter.upper}${letter.lower.slice(1)} — ${letter.word}`;
  dom.letterFlavor.textContent = `Вкус: ${letter.flavor}`;
  $('#start-trace').textContent = 'Обвести глазурью';
}

function renderListen() {
  const letter = currentLetter();
  dom.listenPrompt.textContent = 'Нажми конфетку, которая звучит так же';
  dom.listenRound.textContent = `Раунд ${Math.min(state.listenIndex + 1, 3)} из 3`;
  const grid = dom.listenGrid;
  const wanted = state.listenOptions.join(',');
  if (grid.dataset.options !== wanted) {
    grid.dataset.options = wanted;
    grid.innerHTML = state.listenOptions
      .map(
        (id) => `
          <button class="listen-candy" type="button" data-letter="${id}"
                  style="--candy:${letterById(id).color};--candy-deep:${letterById(id).colorDeep}">
            <canvas width="130" height="130" aria-hidden="true"></canvas>
            <span>${letterById(id).upper}</span>
          </button>`,
      )
      .join('');
    grid.querySelectorAll('[data-letter]').forEach((button) => {
      const canvas = button.querySelector('canvas');
      const ctx = canvas.getContext('2d');
      const letterData = letterById(button.dataset.letter);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawLollipopDisc(ctx, 65, 65, 54, [letterData.color, '#fff8fb'], 5, performance.now());
      drawLetterOnCandy(ctx, 65, 65, letterData.upper, 62, '#ffffff');
      button.addEventListener('click', () => answerListen(button));
    });
  }
  void letter;
}

function renderAlbum() {
  const count = LETTER_IDS.filter((id) => state.progress[id].done).length;
  dom.albumCount.textContent = `${count} из ${LETTER_IDS.length}`;
  dom.albumGrid.innerHTML = LETTERS.map((letter) => {
    const entry = state.progress[letter.id];
    return `
      <div class="box-slot${entry.done ? ' filled' : ''}" style="--candy:${letter.color}">
        <span class="slot-letter">${letter.upper}</span>
        <span class="slot-flavor">${entry.done ? letter.flavor : 'пусто'}</span>
        <span class="slot-stars">${starsHtml(entry.stars)}</span>
      </div>`;
  }).join('');
}

function renderParent() {
  const stickers = LETTER_IDS.filter((id) => state.progress[id].done).length;
  const attempts = LETTER_IDS.reduce((sum, id) => sum + state.progress[id].attempts, 0);
  dom.parentStats.innerHTML = `
    <li>Наклеек в коробке: <b>${stickers} из ${LETTER_IDS.length}</b></li>
    <li>Попыток обводки всего: <b>${attempts}</b></li>
    <li>Ошибок на слух: <b>${state.stats.mistakes}</b></li>
    <li>Допуск обводки: <b>${TRACE_RULES.tolerance} ед.</b>, нужно покрытие <b>${Math.round(TRACE_RULES.minCoverage * 100)}%</b></li>`;
  const info = audio.describe();
  dom.parentVoice.textContent = info.speechSupported
    ? info.russianVoice
      ? `Русский голос: ${info.russianVoice}`
      : 'Русский голос в системе не найден — вместо речи звучит мелодия'
    : 'Синтез речи в этом браузере недоступен — звучат только мелодии';
  const soundButton = $('#toggle-sound');
  soundButton.textContent = state.soundOn ? 'Звук: вкл' : 'Звук: выкл';
  soundButton.classList.toggle('off', !state.soundOn);
  const lettersRow = $('#parent-letters');
  lettersRow.innerHTML = LETTERS.map(
    (letter) => `<button type="button" class="chip" data-letter="${letter.id}">${letter.upper}</button>`,
  ).join('');
  lettersRow.querySelectorAll('[data-letter]').forEach((button) => {
    button.addEventListener('click', () => {
      effect('tap');
      dispatch({ type: 'choose-letter', letterId: button.dataset.letter });
    });
  });
}

function renderReward() {
  if (!state.reward) return;
  const letter = letterById(state.reward.letterId);
  dom.rewardLetter.textContent = letter.upper;
  dom.rewardLetter.style.setProperty('--candy', letter.color);
  dom.rewardStars.innerHTML = starsHtml(state.reward.stars);
  dom.rewardText.textContent = `Наклейка «${letter.flavor}» твоя!`;
}

function renderTopbar() {
  dom.lives.innerHTML = Array.from({ length: LIVES }, (_, index) => {
    const filled = index < state.lives;
    return `<span class="candy-life${filled ? ' on' : ''}" aria-hidden="true"><span class="css-candy"></span></span>`;
  }).join('');
  dom.lives.setAttribute('aria-label', `Конфеток осталось: ${state.lives} из ${LIVES}`);
  const count = LETTER_IDS.filter((id) => state.progress[id].done).length;
  dom.progressPill.textContent = `${count}/${LETTER_IDS.length}`;
  dom.letterLabel.textContent = currentLetter().upper;
}

function renderToast() {
  const toast = state.toast;
  if (!toast) {
    dom.toast.hidden = true;
    dom.toast.textContent = '';
    return;
  }
  dom.toast.hidden = false;
  dom.toast.textContent = toast.text;
  dom.toast.dataset.kind = toast.kind;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => dispatch({ type: 'toast' }), 2400);
}

function render() {
  for (const [name, element] of Object.entries(dom.screens)) {
    if (!element) continue;
    element.hidden = state.screen !== name;
  }
  dom.pauseBadge.hidden = !state.paused;
  renderTopbar();
  renderToast();

  switch (state.screen) {
    case SCREENS.MENU:
      lastTask = null;
      renderMenu();
      break;
    case SCREENS.LETTER:
      lastTask = null;
      renderLetterCard();
      break;
    case SCREENS.TRACE:
      lastTask = 'trace';
      if (lastLetter !== state.letterId) {
        drawnStrokes = [];
        activeStroke = null;
        guideProgress = 0;
        showGuide = true;
        finishing = false;
        lastTask = 'trace';
        lastLetter = state.letterId;
      }
      updateTraceStatus();
      break;
    case SCREENS.LISTEN:
      renderListen();
      if (lastTask !== 'listen') {
        lastTask = 'listen';
        setTimeout(speakTarget, 260);
      }
      break;
    case SCREENS.WRITE:
      lastTask = 'write';
      if (lastLetter !== state.letterId) {
        drawnStrokes = [];
        activeStroke = null;
        lastTask = 'write';
        lastLetter = state.letterId;
      }
      updateWriteStatus();
      break;
    case SCREENS.ALBUM:
      renderAlbum();
      break;
    case SCREENS.PARENT:
      renderParent();
      break;
    case SCREENS.STICKER:
      renderReward();
      break;
    case SCREENS.WIN:
      dom.winCount.textContent = `${LETTER_IDS.length}`;
      break;
    default:
      break;
  }

  if (state.screen === SCREENS.TRACE || state.screen === SCREENS.WRITE) {
    resizeBoards();
  }
}

function updateTraceStatus() {
  const letter = currentLetter();
  const left = letter.strokes.length - state.traceStrokesDone;
  const done = state.traceStrokesDone >= letter.strokes.length;
  const nextButton = $('#trace-next');
  if (nextButton) nextButton.classList.toggle('waiting', !done);
  dom.traceStatus.innerHTML = `
    <span class="status-line">Штрих ${done ? letter.strokes.length : Math.min(state.traceStrokesDone + 1, letter.strokes.length)} из ${letter.strokes.length}</span>
    <span class="status-line muted">${done ? 'Готово — жми «Дальше»' : left > 0 ? 'Веди пальцем по пунктиру' : ''}</span>
`;
}

function updateWriteStatus() {
  dom.writeStatus.innerHTML = `
    <span class="status-line">Напиши букву сам</span>
    <span class="status-line small">Попытка ${Math.min(state.writeAttempt, WRITE_ATTEMPTS)} из ${WRITE_ATTEMPTS}</span>`;
}

/* ------------------------------------------------------------------ */
/* Обводка и письмо                                                    */
/* ------------------------------------------------------------------ */

export function boardGeometryFor(canvas) {
  const rect = canvas.getBoundingClientRect();
  return boardGeometry(rect.width, rect.height, 100, 10);
}

/** Пересчитываем геометрию только когда размер canvas реально изменился. */
let lastBoardSize = '';
function stableBoardGeometry(width, height) {
  const key = `${Math.round(width)}x${Math.round(height)}`;
  if (key !== lastBoardSize) {
    lastBoardSize = key;
    cachedGeometry = boardGeometry(width, height, 100, 10);
  }
  return cachedGeometry;
}
let cachedGeometry = boardGeometry(1, 1, 100, 10);

function resizeBoards() {
  [dom.traceBoard, dom.writeBoard].forEach((canvas) => {
    if (canvas) fitCanvas(canvas);
  });
}

function beginStroke(event, canvas) {
  if (finishing) return;
  const geometry = boardGeometryFor(canvas);
  const rect = canvas.getBoundingClientRect();
  activeStroke = [toBoard(geometry, event.clientX, event.clientY, rect)];
  canvas.setPointerCapture?.(event.pointerId);
}

function extendStroke(event, canvas) {
  if (!activeStroke) return;
  const geometry = boardGeometryFor(canvas);
  const rect = canvas.getBoundingClientRect();
  const point = toBoard(geometry, event.clientX, event.clientY, rect);
  const last = activeStroke[activeStroke.length - 1];
  if (Math.hypot(point.x - last.x, point.y - last.y) < 0.8) return;
  activeStroke.push(point);
}

function endStroke(canvas, { guided }) {
  if (!activeStroke) return;
  const stroke = activeStroke;
  activeStroke = null;
  const letter = currentLetter();

  if (guided) {
    const expected = letter.strokes[state.traceStrokesDone];
    if (!expected) return;
    const result = scoreAttempt([...drawnStrokes, stroke], letter.strokes);
    const item = result.strokes[state.traceStrokesDone];
    if (item && item.ok) {
      drawnStrokes.push(stroke);
      effect('good');
      dispatch({ type: 'stroke-done', count: state.traceStrokesDone + 1 });
      if (drawnStrokes.length >= letter.strokes.length && !finishing) {
        // Буква обведена целиком: хвалим, оставляем глазурь на экране,
        // дальше ребёнок идёт сам по большой кнопке «Дальше».
        finishing = true;
        effect('star');
        speak(`Красиво! ${letter.praise}`, 'star');
      }
    } else {
      effect('wrong');
      dispatch({ type: 'toast', kind: 'warn', text: 'Не по канавке — попробуй ещё' });
    }
  } else {
    drawnStrokes.push(stroke);
    effect('tap');
  }
}

function finishTrace() {
  const letter = currentLetter();
  const forced = state.traceStrokesDone >= letter.strokes.length;
  const result = forced
    ? scoreAttempt(drawnStrokes, letter.strokes)
    : { complete: false, score: 0, stars: 0, strokes: [] };
  if (result.complete) celebrateCenter();
  finishing = false;
  dispatch({ type: 'submit-trace', result });
  drawnStrokes = [];
}

function submitWrite() {
  const letter = currentLetter();
  const result = scoreAttempt(drawnStrokes, letter.strokes);
  if (result.complete) {
    effect('sticker');
    celebrateCenter();
    speak('Молодец!', 'sticker');
  }
  dispatch({ type: 'submit-write', result });
  drawnStrokes = [];
}

function wireBoard(canvas, { guided, submit }) {
  canvas.addEventListener('pointerdown', (event) => {
    event.preventDefault();
    audio.unlock();
    beginStroke(event, canvas);
  });
  canvas.addEventListener('pointermove', (event) => {
    event.preventDefault();
    extendStroke(event, canvas);
  });
  const finish = (event) => {
    if (event) event.preventDefault();
    endStroke(canvas, { guided });
  };
  canvas.addEventListener('pointerup', finish);
  canvas.addEventListener('pointercancel', finish);
  canvas.addEventListener('pointerleave', (event) => {
    if (activeStroke) finish(event);
  });
  canvas.addEventListener('contextmenu', (event) => event.preventDefault());
  void submit;
}

/* ------------------------------------------------------------------ */
/* Мини-игра «услышь и найди»                                          */
/* ------------------------------------------------------------------ */

function speakTarget() {
  const letter = currentLetter();
  speak(letter.speak, 'tap');
}

function answerListen(button) {
  const picked = button.dataset.letter;
  if (picked === state.listenTarget) {
    const rect = button.getBoundingClientRect();
    celebrate(rect.left + rect.width / 2 - dom.sprinkles.getBoundingClientRect().left, rect.top + rect.height / 2);
    effect('good');
    speak('Верно!', 'good');
    button.classList.add('pop');
    setTimeout(() => button.classList.remove('pop'), 420);
    dispatch({ type: 'answer-listen', letterId: picked });
    if (state.screen === SCREENS.LISTEN) {
      dom.listenGrid.dataset.options = '';
      render();
      setTimeout(speakTarget, 700);
    }
  } else {
    effect('wrong');
    button.classList.add('shake');
    setTimeout(() => button.classList.remove('shake'), 420);
    dispatch({ type: 'answer-listen', letterId: picked });
    if (state.screen === SCREENS.LISTEN) setTimeout(speakTarget, 900);
  }
}

/* ------------------------------------------------------------------ */
/* Кнопки                                                              */
/* ------------------------------------------------------------------ */

function wireButtons() {
  const on = (selector, action, extra) => {
    const element = $(selector);
    if (!element) return;
    element.addEventListener('click', () => {
      audio.unlock();
      effect('tap');
      if (action) dispatch(action);
      if (extra) extra();
    });
  };

  on('#open-album', { type: 'open-album' });
  on('#open-parent', { type: 'open-parent' });
  $('.topbar-home').addEventListener('click', () => {
    effect('tap');
    dispatch({ type: 'menu' });
  });
  on('#start-trace', { type: 'start-trace' });
  on('#speak-letter', null, () => speakTarget());
  on('#back-to-menu', { type: 'menu' });
  on('#trace-replay', null, () => {
    finishing = false;
    drawnStrokes = [];
    guideProgress = 0;
    showGuide = true;
    dispatch({ type: 'stroke-done', count: 0 });
    speakTarget();
  });
  on('#trace-next', null, () => finishTrace());
  on('#write-clear', null, () => {
    drawnStrokes = [];
  });
  on('#write-next', null, () => submitWrite());
  on('#listen-replay', null, () => speakTarget());
  on('#listen-menu', { type: 'menu' });
  on('#sticker-next', { type: 'next-after-sticker' });
  on('#album-back', { type: 'menu' });
  on('#parent-back', { type: 'menu' });
  on('#reset-progress', { type: 'reset-progress' });
  on('#toggle-sound', null, () => {
    const next = !state.soundOn;
    audio.setEnabled(next);
    dispatch({ type: 'set-sound', on: next });
    if (next) speakTarget();
  });
  on('#empty-retry', { type: 'refill-candy' }, () => speak('Попробуем ещё!', 'good'));
  on('#win-again', { type: 'restart' });
  on('#win-album', { type: 'open-album' });

  const letterButton = dom.letterButton;
  letterButton.addEventListener('click', () => {
    audio.unlock();
    speakTarget();
  });
}

/* ------------------------------------------------------------------ */
/* Цикл отрисовки                                                      */
/* ------------------------------------------------------------------ */

let lastFrame = performance.now();

function frame(now) {
  const delta = Math.min(64, now - lastFrame);
  lastFrame = now;

  if (!state.paused && !document.hidden) {
    const scene = dom.scene;
    const { ctx, width, height } = fitCanvas(scene);
    drawCandyBackground(ctx, width, height, state.seed, now);

    if (state.screen === SCREENS.LETTER) {
      const canvas = dom.letterCard;
      const { ctx: cardCtx, width: w, height: h } = fitCanvas(canvas);
      drawLollipopCard(cardCtx, w, h, currentLetter(), { showStrokes: true });
    }

    if (state.screen === SCREENS.TRACE) {
      const canvas = dom.traceBoard;
      const { ctx: boardCtx, width: w, height: h } = fitCanvas(canvas);
      const geometry = stableBoardGeometry(w, h);
      guideProgress = (guideProgress + delta / 2600) % 1.0001;
      drawTraceBoard(boardCtx, geometry, currentLetter(), {
        strokesDone: state.traceStrokesDone,
        drawn: drawnStrokes,
        activeStroke,
        guideProgress,
        showGuide,
      });
    }

    if (state.screen === SCREENS.WRITE) {
      const canvas = dom.writeBoard;
      const { ctx: boardCtx, width: w, height: h } = fitCanvas(canvas);
      const geometry = stableBoardGeometry(w, h);
      drawTraceBoard(boardCtx, geometry, currentLetter(), {
        strokesDone: currentLetter().strokes.length,
        drawn: drawnStrokes,
        activeStroke,
        ghost: true,
        showGuide: false,
      });
    }

    const sprinkleCanvas = dom.sprinkles;
    if (particles.length) {
      const { ctx: spCtx, width: w, height: h } = fitCanvas(sprinkleCanvas);
      particles = stepSprinkles(particles, w, h);
      drawSprinkles(spCtx, w, h, particles);
    } else if (sprinkleCanvas.width && sprinkleCanvas.height) {
      sprinkleCanvas.getContext('2d').clearRect(0, 0, sprinkleCanvas.clientWidth, sprinkleCanvas.clientHeight);
    }
  }

  requestAnimationFrame(frame);
}

/* ------------------------------------------------------------------ */
/* Ориентация, пауза, старт                                            */
/* ------------------------------------------------------------------ */

function updateOrientation() {
  const portrait = globalThis.innerHeight > globalThis.innerWidth;
  dom.rotate.hidden = !portrait;
}

function wireLifecycle() {
  globalThis.addEventListener('resize', () => {
    updateOrientation();
    resizeBoards();
  });
  globalThis.addEventListener('orientationchange', updateOrientation);
  document.addEventListener('visibilitychange', () => {
    const paused = document.hidden;
    if (paused !== state.paused) dispatch({ type: 'set-paused', paused });
    if (!paused) audio.unlock();
  });
  document.addEventListener('pointerdown', () => audio.unlock(), { once: true });
}

function boot() {
  restore();
  wireButtons();
  wireBoard(dom.traceBoard, { guided: true });
  wireBoard(dom.writeBoard, { guided: false });
  wireLifecycle();
  updateOrientation();
  resizeBoards();
  render();

  globalThis.__GAME_TEST__ = {
    version: 1,
    getState: () => JSON.parse(JSON.stringify(state)),
    getSummary: () => summary(state),
    dispatch,
    reset: (seed = 1) => {
      state = createGame(seed);
      drawnStrokes = [];
      activeStroke = null;
      persist();
      render();
      return globalThis.__GAME_TEST__.getSummary();
    },
    /** Идеальная обводка буквы — для автоматических проверок. */
    idealStrokes(letterId) {
      const letter = letterById(letterId) || currentLetter();
      return letter.strokes.map((stroke) => flattenPath(stroke.path, 1.5));
    },
    submitIdealTrace(letterId) {
      return dispatch({ type: 'submit-trace', result: scoreAttempt(globalThis.__GAME_TEST__.idealStrokes(letterId), (letterById(letterId) || currentLetter()).strokes) });
    },
    submitIdealWrite(letterId) {
      return dispatch({ type: 'submit-write', result: scoreAttempt(globalThis.__GAME_TEST__.idealStrokes(letterId), (letterById(letterId) || currentLetter()).strokes) });
    },
    celebrate: celebrateCenter,
    speakTarget,
    /** Средняя стоимость одного кадра сцены — бюджет вместо FPS в headless. */
    benchFrame(count = 24) {
      const scene = dom.scene;
      const started = performance.now();
      for (let i = 0; i < count; i += 1) {
        const { ctx, width, height } = fitCanvas(scene);
        drawCandyBackground(ctx, width, height, state.seed, i * 16);
      }
      return (performance.now() - started) / count;
    },
    clockProgress() {
      let frames = 0;
      const started = performance.now();
      return new Promise((resolve) => {
        const tick = () => {
          frames += 1;
          if (performance.now() - started < 2000) requestAnimationFrame(tick);
          else resolve(Math.round((frames / (performance.now() - started)) * 1000));
        };
        requestAnimationFrame(tick);
      });
    },
    audio: () => audio.describe(),
  };

  requestAnimationFrame(frame);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}

if ('serviceWorker' in navigator) {
  globalThis.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}
