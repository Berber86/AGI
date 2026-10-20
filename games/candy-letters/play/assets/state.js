/**
 * Состояние игры «Сладкие буквы» — чистый редьюсер.
 *
 * createGame() возвращает свежее состояние, applyAction(state, action) — новое
 * состояние и никогда не меняет входное. Модуль не знает про DOM: его гоняют
 * юнит-тесты в node и тот же код исполняется в браузере.
 *
 * Круг на одну букву: trace → listen → write → наклейка.
 * Победа: все пять наклеек. Поражения нет — три конфетки кончились,
 * экран «Коробка опустела», кнопка «Попробовать ещё» возвращает конфетки.
 */

import { LETTERS, LETTER_IDS, seededShuffle } from './letters.js';

export const LIVES = 3;
export const TRACE_ATTEMPTS = 3;
export const WRITE_ATTEMPTS = 2;
export const LISTEN_ROUNDS = 3;
export const TASKS = ['trace', 'listen', 'write'];

export const SCREENS = {
  MENU: 'menu',
  LETTER: 'letter',
  TRACE: 'trace',
  LISTEN: 'listen',
  WRITE: 'write',
  STICKER: 'sticker',
  ALBUM: 'album',
  PARENT: 'parent',
  EMPTY_BOX: 'empty-box',
  WIN: 'win',
};

const LISTEN_CHOICES = 5;

function blankProgress() {
  return LETTERS.reduce((acc, letter) => {
    acc[letter.id] = {
      done: false,
      stars: 0,
      attempts: 0,
      listenRounds: 0,
      writeAttempts: 0,
      traceScore: 0,
      mistakes: 0,
    };
    return acc;
  }, {});
}

function taskSeed(letterIndex, seed) {
  return Math.abs(seed * 7919 + (letterIndex + 1) * 104729);
}

function listenOptions(letterId, seed) {
  const pool = seededShuffle(LETTER_IDS.filter((id) => id !== letterId), seed);
  const options = [letterId, ...pool.slice(0, LISTEN_CHOICES - 1)];
  return seededShuffle(options, seed + 17);
}

/**
 * @param {number} seed сид для порядка вариантов и выбора цели в «услышь и найди»
 */
export function createGame(seed = 1) {
  return {
    seed: Number.isFinite(seed) ? Math.trunc(seed) : 1,
    screen: SCREENS.MENU,
    previousScreen: SCREENS.MENU,
    letterId: LETTERS[0].id,
    task: 'trace',
    lives: LIVES,
    status: 'playing',
    progress: blankProgress(),
    traceAttempt: 1,
    traceStrokesDone: 0,
    traceResult: null,
    listenIndex: 0,
    listenTarget: null,
    listenOptions: [],
    writeAttempt: 1,
    writeResult: null,
    reward: null,
    soundOn: true,
    paused: false,
    toast: null,
    stats: { rounds: 0, stickers: 0, mistakes: 0 },
  };
}

function clone(state) {
  return {
    ...state,
    progress: Object.fromEntries(
      Object.entries(state.progress).map(([key, value]) => [key, { ...value }]),
    ),
    stats: { ...state.stats },
    listenOptions: [...(state.listenOptions || [])],
    traceResult: state.traceResult ? { ...state.traceResult, strokes: [...state.traceResult.strokes] } : null,
    writeResult: state.writeResult ? { ...state.writeResult, strokes: [...state.writeResult.strokes] } : null,
    reward: state.reward ? { ...state.reward } : null,
  };
}

function stickersCount(state) {
  return LETTER_IDS.filter((id) => state.progress[id]?.done).length;
}

function startListen(next) {
  const index = LETTER_IDS.indexOf(next.letterId);
  const seed = taskSeed(index, next.seed) + next.listenIndex;
  next.listenOptions = listenOptions(next.letterId, seed);
  next.listenTarget = next.letterId;
}

function startTrace(next) {
  next.traceAttempt = 1;
  next.traceStrokesDone = 0;
  next.traceResult = null;
}

function startWrite(next) {
  next.writeAttempt = 1;
  next.writeResult = null;
}

/** Выдаёт наклейку и проверяет победу. */
function grantSticker(next, stars) {
  const entry = next.progress[next.letterId];
  const first = !entry.done;
  entry.done = true;
  entry.stars = Math.max(entry.stars, stars);
  if (first) {
    next.stats.stickers += 1;
  }
  next.reward = { letterId: next.letterId, stars: entry.stars };
  if (stickersCount(next) >= LETTER_IDS.length) {
    next.status = 'won';
    next.screen = SCREENS.WIN;
  } else {
    next.screen = SCREENS.STICKER;
  }
  return next;
}

/**
 * @param {object} state текущее состояние
 * @param {object} action { type, ... }
 * @returns {object} новое состояние
 */
export function applyAction(state, action) {
  const next = clone(state);
  const type = action && action.type;

  if (type === 'restart') {
    const fresh = createGame(state.seed);
    fresh.soundOn = state.soundOn;
    fresh.screen = SCREENS.MENU;
    return fresh;
  }

  if (type === 'set-sound') {
    next.soundOn = Boolean(action.on);
    return next;
  }

  if (type === 'set-paused') {
    next.paused = Boolean(action.paused);
    return next;
  }

  if (type === 'load-progress') {
    const saved = action.progress || {};
    for (const id of LETTER_IDS) {
      const entry = saved[id];
      if (entry && typeof entry === 'object') {
        next.progress[id] = {
          done: Boolean(entry.done),
          stars: Number.isFinite(entry.stars) ? entry.stars : 0,
          attempts: Number.isFinite(entry.attempts) ? entry.attempts : 0,
          listenRounds: Number.isFinite(entry.listenRounds) ? entry.listenRounds : 0,
          writeAttempts: Number.isFinite(entry.writeAttempts) ? entry.writeAttempts : 0,
          traceScore: Number.isFinite(entry.traceScore) ? entry.traceScore : 0,
          mistakes: Number.isFinite(entry.mistakes) ? entry.mistakes : 0,
        };
      }
    }
    next.stats.stickers = stickersCount(next);
    next.stats.mistakes = LETTER_IDS.reduce((sum, id) => sum + next.progress[id].mistakes, 0);
    return next;
  }

  if (type === 'reset-progress') {
    next.progress = blankProgress();
    next.lives = LIVES;
    next.status = 'playing';
    next.screen = SCREENS.MENU;
    next.reward = null;
    next.toast = { kind: 'info', text: 'Коробка снова пустая' };
    next.stats = { rounds: 0, stickers: 0, mistakes: 0 };
    return next;
  }

  if (type === 'toast') {
    next.toast = action.text ? { kind: action.kind || 'info', text: action.text } : null;
    return next;
  }

  if (type === 'open-album') {
    next.previousScreen = state.screen;
    next.screen = SCREENS.ALBUM;
    return next;
  }

  if (type === 'open-parent') {
    next.previousScreen = state.screen;
    next.screen = SCREENS.PARENT;
    return next;
  }

  if (type === 'menu') {
    next.screen = SCREENS.MENU;
    next.toast = null;
    return next;
  }

  if (type === 'back') {
    next.screen = next.previousScreen === next.screen ? SCREENS.MENU : next.previousScreen;
    next.toast = null;
    return next;
  }

  if (type === 'choose-letter') {
    if (!LETTER_IDS.includes(action.letterId)) return next;
    next.letterId = action.letterId;
    next.task = 'trace';
    next.screen = SCREENS.LETTER;
    next.previousScreen = SCREENS.MENU;
    next.traceResult = null;
    next.reward = null;
    next.toast = null;
    startTrace(next);
    return next;
  }

  if (type === 'start-trace') {
    next.task = 'trace';
    next.screen = SCREENS.TRACE;
    startTrace(next);
    return next;
  }

  if (type === 'stroke-done') {
    if (next.screen !== SCREENS.TRACE) return next;
    next.traceStrokesDone = Math.max(next.traceStrokesDone, Number(action.count) || 0);
    return next;
  }

  if (type === 'submit-trace') {
    if (next.screen !== SCREENS.TRACE) return next;
    const result = action.result || null;
    next.traceResult = result;
    next.progress[next.letterId].attempts += 1;
    if (result && result.complete) {
      next.progress[next.letterId].traceScore = Math.max(
        next.progress[next.letterId].traceScore,
        result.score,
      );
      next.task = 'listen';
      next.screen = SCREENS.LISTEN;
      next.listenIndex = 0;
      next.progress[next.letterId].listenRounds = 0;
      startListen(next);
      next.toast = { kind: 'good', text: 'Красиво! Теперь услышь букву' };
    } else {
      next.traceAttempt += 1;
      next.traceStrokesDone = 0;
      if (next.traceAttempt > TRACE_ATTEMPTS) {
        // Не вышло за три попытки — не наказание, а мягкий повтор с подсказкой.
        next.traceAttempt = TRACE_ATTEMPTS;
        next.toast = { kind: 'info', text: 'Обведём ещё раз, медленно' };
      } else {
        next.toast = { kind: 'info', text: 'Попробуй ещё раз по точкам' };
      }
    }
    return next;
  }

  if (type === 'answer-listen') {
    if (next.screen !== SCREENS.LISTEN) return next;
    const correct = action.letterId === next.listenTarget;
    const entry = next.progress[next.letterId];
    if (correct) {
      entry.listenRounds += 1;
      next.listenIndex += 1;
      if (entry.listenRounds >= LISTEN_ROUNDS) {
        next.task = 'write';
        next.screen = SCREENS.WRITE;
        startWrite(next);
        next.toast = { kind: 'good', text: 'Ты узнаёшь букву на слух!' };
      } else {
        startListen(next);
        next.toast = { kind: 'good', text: 'Верно!' };
      }
    } else {
      entry.mistakes += 1;
      next.stats.mistakes += 1;
      next.lives -= 1;
      if (next.lives <= 0) {
        next.lives = 0;
        next.screen = SCREENS.EMPTY_BOX;
        next.toast = null;
      } else {
        next.toast = { kind: 'warn', text: 'Не та конфетка, послушай ещё раз' };
      }
    }
    return next;
  }

  if (type === 'submit-write') {
    if (next.screen !== SCREENS.WRITE) return next;
    const result = action.result || null;
    next.writeResult = result;
    const entry = next.progress[next.letterId];
    entry.writeAttempts += 1;
    if (result && result.complete) {
      return grantSticker(next, Math.max(next.traceResult?.stars || 0, result.stars));
    }
    next.writeAttempt += 1;
    if (next.writeAttempt > WRITE_ATTEMPTS) {
      // Две попытки исчерпаны: хвалим за старание и всё равно даём наклейку,
      // но с одной звездой — ребёнок не должен застревать.
      return grantSticker(next, 1);
    }
    next.toast = { kind: 'info', text: 'Ещё разок, по памяти' };
    return next;
  }

  if (type === 'next-after-sticker') {
    next.reward = null;
    if (next.status === 'won') {
      next.screen = SCREENS.WIN;
      return next;
    }
    next.screen = SCREENS.MENU;
    next.task = 'trace';
    return next;
  }

  if (type === 'refill-candy') {
    next.lives = LIVES;
    next.status = 'playing';
    next.screen = SCREENS.LETTER;
    next.toast = { kind: 'good', text: 'Конфетки снова полны!' };
    return next;
  }

  if (type === 'play-round') {
    next.stats.rounds += 1;
    return next;
  }

  return next;
}

/** Срез состояния для сохранения в localStorage. */
export function toPersisted(state) {
  return { progress: state.progress, soundOn: state.soundOn, seed: state.seed };
}

export function summary(state) {
  return {
    screen: state.screen,
    status: state.status,
    letterId: state.letterId,
    task: state.task,
    lives: state.lives,
    stickers: stickersCount(state),
    letters: LETTER_IDS,
  };
}
