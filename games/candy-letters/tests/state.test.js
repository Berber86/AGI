/**
 * Юнит-тесты редьюсера состояний игры «Сладкие буквы».
 * Запуск: npm test  (node --test tests/)
 */
import test from 'node:test';
import assert from 'node:assert/strict';

import { LETTER_IDS } from '../play/assets/letters.js';
import {
  applyAction,
  createGame,
  LIVES,
  LISTEN_ROUNDS,
  SCREENS,
  summary,
  toPersisted,
} from '../play/assets/state.js';

const goodTrace = { complete: true, score: 0.9, stars: 3, strokes: [{ ok: true }] };
const goodWrite = { complete: true, score: 0.88, stars: 3, strokes: [{ ok: true }] };
const badTrace = { complete: false, score: 0.2, stars: 0, strokes: [{ ok: false }] };
const badWrite = { complete: false, score: 0.1, stars: 0, strokes: [{ ok: false }] };

/** Проходит одну букву целиком: обводка → слушание → письмо. */
function completeLetter(state, letterId) {
  let next = applyAction(state, { type: 'choose-letter', letterId });
  next = applyAction(next, { type: 'start-trace' });
  next = applyAction(next, { type: 'submit-trace', result: goodTrace });
  assert.equal(next.screen, SCREENS.LISTEN, 'после удачной обводки — мини-игра на слух');
  for (let i = 0; i < LISTEN_ROUNDS; i += 1) {
    next = applyAction(next, { type: 'answer-listen', letterId });
  }
  assert.equal(next.screen, SCREENS.WRITE, 'после слушания — письмо по памяти');
  next = applyAction(next, { type: 'submit-write', result: goodWrite });
  return next;
}

test('свежее состояние: меню, пять букв, три конфетки, статус playing', () => {
  const state = createGame(7);
  assert.equal(state.screen, SCREENS.MENU);
  assert.equal(state.status, 'playing');
  assert.equal(state.lives, LIVES);
  assert.equal(summary(state).stickers, 0);
  assert.deepEqual(Object.keys(state.progress), LETTER_IDS);
  assert.notEqual(createGame(7), state, 'состояния должны быть разными объектами');
});

test('applyAction не мутирует входное состояние', () => {
  const state = createGame(3);
  const snapshot = JSON.parse(JSON.stringify(state));
  const next = applyAction(state, { type: 'choose-letter', letterId: 'о' });
  assert.deepEqual(state, snapshot);
  assert.notEqual(next, state);
  assert.notEqual(next.progress, state.progress);
  assert.notEqual(next.progress.о, state.progress.о);
});

test('неизвестное действие возвращает равную копию', () => {
  const state = createGame(3);
  const next = applyAction(state, { type: 'fly-to-moon' });
  assert.deepEqual(next, state);
  assert.notEqual(next, state);
});

test('выбор несуществующей буквы игнорируется', () => {
  const state = createGame(3);
  const next = applyAction(state, { type: 'choose-letter', letterId: 'ы' });
  assert.equal(next.screen, SCREENS.MENU);
});

test('неудачная обводка даёт ещё попытку и не выдаёт наклейку', () => {
  let state = applyAction(createGame(1), { type: 'choose-letter', letterId: 'а' });
  state = applyAction(state, { type: 'start-trace' });
  state = applyAction(state, { type: 'submit-trace', result: badTrace });
  assert.equal(state.screen, SCREENS.TRACE, 'остаёмся на обводке');
  assert.equal(state.traceAttempt, 2);
  assert.equal(state.progress.а.done, false);
  assert.equal(summary(state).stickers, 0);
  assert.equal(state.progress.а.attempts, 1);
});

test('обводка держит ребёнка на третьем повторе вместо наказания', () => {
  let state = applyAction(createGame(1), { type: 'choose-letter', letterId: 'а' });
  state = applyAction(state, { type: 'start-trace' });
  for (let i = 0; i < 6; i += 1) {
    state = applyAction(state, { type: 'submit-trace', result: badTrace });
  }
  assert.equal(state.screen, SCREENS.TRACE);
  assert.equal(state.traceAttempt, 3);
  assert.equal(state.lives, LIVES, 'за кривую обводку конфетки не отнимаем');
});

test('полный круг выдаёт наклейку и возвращает в меню', () => {
  const state = completeLetter(createGame(11), 'м');
  assert.equal(state.screen, SCREENS.STICKER);
  assert.equal(state.progress.м.done, true);
  assert.equal(state.progress.м.stars, 3);
  assert.equal(summary(state).stickers, 1);
  assert.deepEqual(state.reward, { letterId: 'м', stars: 3 });
  const after = applyAction(state, { type: 'next-after-sticker' });
  assert.equal(after.screen, SCREENS.MENU);
  assert.equal(after.reward, null);
});

test('пять наклеек = коробка собрана, статус won', () => {
  let state = createGame(5);
  for (const id of LETTER_IDS) {
    state = completeLetter(state, id);
  }
  assert.equal(state.status, 'won');
  assert.equal(state.screen, SCREENS.WIN);
  assert.equal(summary(state).stickers, 5);
  assert.equal(state.progress.с.done, true);
});

test('варианты «услышь и найди»: пять разных букв, цель среди них', () => {
  let state = applyAction(createGame(2), { type: 'choose-letter', letterId: 'у' });
  state = applyAction(state, { type: 'start-trace' });
  state = applyAction(state, { type: 'submit-trace', result: goodTrace });
  assert.equal(state.listenOptions.length, 5);
  assert.equal(new Set(state.listenOptions).size, 5);
  assert.ok(state.listenOptions.includes('у'));
  assert.equal(state.listenTarget, 'у');
});

test('одинаковый сид даёт одинаковый порядок вариантов', () => {
  const run = () => {
    let state = applyAction(createGame(9), { type: 'choose-letter', letterId: 'о' });
    state = applyAction(state, { type: 'start-trace' });
    state = applyAction(state, { type: 'submit-trace', result: goodTrace });
    return state.listenOptions;
  };
  assert.deepEqual(run(), run());
});

test('три ошибки на слух — «коробка опустела», прогресс сохранён', () => {
  let state = applyAction(createGame(4), { type: 'choose-letter', letterId: 'с' });
  state = applyAction(state, { type: 'start-trace' });
  state = applyAction(state, { type: 'submit-trace', result: goodTrace });
  const wrong = LETTER_IDS.find((id) => id !== 'с');
  state = applyAction(state, { type: 'answer-listen', letterId: wrong });
  assert.equal(state.lives, 2);
  assert.equal(state.screen, SCREENS.LISTEN);
  state = applyAction(state, { type: 'answer-listen', letterId: wrong });
  assert.equal(state.lives, 1);
  state = applyAction(state, { type: 'answer-listen', letterId: wrong });
  assert.equal(state.lives, 0);
  assert.equal(state.screen, SCREENS.EMPTY_BOX);
  assert.equal(state.progress.с.done, false, 'наклейка не выдаётся');
  const again = applyAction(state, { type: 'refill-candy' });
  assert.equal(again.lives, LIVES);
  assert.equal(again.screen, SCREENS.LETTER);
  assert.equal(again.status, 'playing');
});

test('ответ не по текущей мини-игре игнорируется', () => {
  const state = applyAction(createGame(6), { type: 'choose-letter', letterId: 'а' });
  const next = applyAction(state, { type: 'answer-listen', letterId: 'а' });
  assert.deepEqual(next, state);
});

test('письмо по памяти: две попытки, потом наклейка за старание', () => {
  let state = applyAction(createGame(8), { type: 'choose-letter', letterId: 'о' });
  state = applyAction(state, { type: 'start-trace' });
  state = applyAction(state, { type: 'submit-trace', result: goodTrace });
  for (let i = 0; i < LISTEN_ROUNDS; i += 1) state = applyAction(state, { type: 'answer-listen', letterId: 'о' });
  state = applyAction(state, { type: 'submit-write', result: badWrite });
  assert.equal(state.screen, SCREENS.WRITE);
  assert.equal(state.writeAttempt, 2);
  state = applyAction(state, { type: 'submit-write', result: badWrite });
  assert.equal(state.screen, SCREENS.STICKER, 'после двух попыток наклейка за старание');
  assert.equal(state.progress.о.stars, 1);
});

test('restart обнуляет прогресс, но сохраняет настройку звука', () => {
  let state = completeLetter(createGame(12), 'а');
  state = applyAction(state, { type: 'set-sound', on: false });
  const restarted = applyAction(state, { type: 'restart' });
  assert.equal(summary(restarted).stickers, 0);
  assert.equal(restarted.screen, SCREENS.MENU);
  assert.equal(restarted.lives, LIVES);
  assert.equal(restarted.soundOn, false);
  assert.equal(restarted.status, 'playing');
});

test('reset-progress из родительского режима чистит коробку', () => {
  let state = completeLetter(createGame(13), 'у');
  state = applyAction(state, { type: 'open-parent' });
  assert.equal(state.screen, SCREENS.PARENT);
  state = applyAction(state, { type: 'reset-progress' });
  assert.equal(summary(state).stickers, 0);
  assert.equal(state.screen, SCREENS.MENU);
  assert.ok(state.toast.text.includes('пуст'));
});

test('сохранение и загрузка прогресса переживают перезагрузку', () => {
  const played = completeLetter(createGame(21), 'м');
  const persisted = toPersisted(played);
  assert.equal(persisted.progress.м.done, true);
  const restored = applyAction(createGame(21), { type: 'load-progress', progress: persisted.progress });
  assert.equal(summary(restored).stickers, 1);
  assert.equal(restored.progress.м.stars, 3);
  assert.equal(restored.status, 'playing');
});

test('загрузка мусора не ломает состояние', () => {
  const restored = applyAction(createGame(1), {
    type: 'load-progress',
    progress: { а: { done: true }, о: null, ы: { done: true } },
  });
  assert.equal(summary(restored).stickers, 1);
  assert.equal(restored.progress.о.done, false);
  assert.equal(restored.progress.ы, undefined);
});

test('пауза и звук переключаются независимо от экрана', () => {
  let state = applyAction(createGame(2), { type: 'set-paused', paused: true });
  assert.equal(state.paused, true);
  state = applyAction(state, { type: 'set-paused', paused: false });
  assert.equal(state.paused, false);
  state = applyAction(state, { type: 'set-sound', on: false });
  assert.equal(state.soundOn, false);
});

test('побеждённая игра не выдаёт новые наклейки без рестарта', () => {
  let state = createGame(5);
  for (const id of LETTER_IDS) state = completeLetter(state, id);
  assert.equal(state.status, 'won');
  const after = applyAction(state, { type: 'choose-letter', letterId: 'а' });
  assert.equal(after.screen, SCREENS.LETTER, 'повторять буквы можно и после победы');
  assert.equal(summary(after).stickers, 5);
});

test('stroke-done двигает счётчик штрихов только на экране обводки', () => {
  let state = applyAction(createGame(2), { type: 'choose-letter', letterId: 'м' });
  state = applyAction(state, { type: 'start-trace' });
  state = applyAction(state, { type: 'stroke-done', count: 2 });
  assert.equal(state.traceStrokesDone, 2);
  const elsewhere = applyAction(applyAction(state, { type: 'menu' }), { type: 'stroke-done', count: 4 });
  assert.equal(elsewhere.traceStrokesDone, 2);
});

test('альбом и родительский режим помнят, откуда пришли', () => {
  let state = applyAction(createGame(2), { type: 'choose-letter', letterId: 'а' });
  state = applyAction(state, { type: 'open-album' });
  assert.equal(state.screen, SCREENS.ALBUM);
  state = applyAction(state, { type: 'back' });
  assert.equal(state.screen, SCREENS.LETTER);
});
