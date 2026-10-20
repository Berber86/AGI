/**
 * Юнит-тесты оценки обводки и данных букв.
 * Запуск: npm test  (node --test tests/)
 */
import test from 'node:test';
import assert from 'node:assert/strict';

import { LETTERS, LETTER_IDS, seededShuffle, totalStrokes } from '../play/assets/letters.js';
import { flattenPath, sampleStroke, strokeLength } from '../play/assets/paths.js';
import { scoreStroke, scoreAttempt, TRACE_RULES } from '../play/assets/tracing.js';

const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

/** «Идеальный ребёнок»: идёт ровно по образцу с маленьким шагом. */
function idealStroke(commands, jitter = 0) {
  const flat = flattenPath(commands, 1.2);
  return flat.map((p) => ({ x: p.x + (jitter ? ((p.x * 31) % 7) / 7 * jitter : 0), y: p.y }));
}

test('в наборе ровно пять букв с допустимыми штрихами', () => {
  assert.deepEqual(LETTER_IDS, ['а', 'о', 'у', 'м', 'с']);
  for (const letter of LETTERS) {
    assert.ok(letter.strokes.length >= 1, `${letter.id}: нет штрихов`);
    assert.ok(letter.sound && letter.speak, `${letter.id}: нет озвучки`);
    for (const stroke of letter.strokes) {
      const flat = flattenPath(stroke.path, 2);
      assert.ok(flat.length > 2, `${letter.id}: штрих вырожден`);
      for (const point of flat) {
        assert.ok(point.x >= 0 && point.x <= 100, `${letter.id}: x вне доски ${point.x}`);
        assert.ok(point.y >= 0 && point.y <= 100, `${letter.id}: y вне доски ${point.y}`);
      }
    }
  }
});

test('метки вдоль штриха стоят чаще допуска — обводку можно честно оценить', () => {
  for (const letter of LETTERS) {
    for (const stroke of letter.strokes) {
      const marks = sampleStroke(stroke.path, TRACE_RULES.marksPerStroke);
      let worst = 0;
      for (let i = 1; i < marks.length; i += 1) worst = Math.max(worst, dist(marks[i - 1], marks[i]));
      assert.ok(
        worst < TRACE_RULES.tolerance,
        `${letter.id}: шаг меток ${worst.toFixed(2)} больше допуска ${TRACE_RULES.tolerance}`,
      );
    }
  }
});

test('аккуратная обводка даёт полный зачёт и не меньше двух звёзд', () => {
  for (const letter of LETTERS) {
    const strokes = letter.strokes.map((stroke) => idealStroke(stroke.path));
    const result = scoreAttempt(strokes, letter.strokes);
    assert.ok(result.complete, `${letter.id}: аккуратная обводка не зачтена`);
    assert.ok(result.stars >= 2, `${letter.id}: звёзд ${result.stars}`);
    assert.ok(result.score >= 0.7, `${letter.id}: балл ${result.score}`);
  }
});

test('обводка дрожащей рукой всё ещё зачитывается', () => {
  const letter = LETTERS[0];
  const strokes = letter.strokes.map((stroke) =>
    idealStroke(stroke.path).map((p, i) => ({
      x: p.x + (i % 3 === 0 ? 2.4 : -2.1),
      y: p.y + (i % 2 === 0 ? 1.8 : -1.6),
    })),
  );
  const result = scoreAttempt(strokes, letter.strokes);
  assert.ok(result.complete, 'дрожание руки не должно ломать зачёт');
  assert.ok(result.stars >= 1);
});

test('пустая попытка — ноль баллов и ноль звёзд', () => {
  const letter = LETTERS[0];
  const result = scoreAttempt([], letter.strokes);
  assert.equal(result.score, 0);
  assert.equal(result.stars, 0);
  assert.equal(result.complete, false);
});

test('один тычок пальцем не засчитывается как штрих', () => {
  const stroke = LETTERS[0].strokes[0];
  const result = scoreStroke([{ x: 12, y: 88 }, { x: 12.5, y: 88.2 }], stroke.path);
  assert.equal(result.stars, 0);
  assert.equal(result.ok, false);
  assert.equal(result.tooShort, true);
});

test('глазурь в стороне от буквы не даёт баллов', () => {
  const stroke = LETTERS[0].strokes[0];
  const far = Array.from({ length: 30 }, (_, i) => ({ x: 92, y: 8 + i * 2.5 }));
  const result = scoreStroke(far, stroke.path);
  assert.equal(result.score, 0);
  assert.equal(result.stars, 0);
  assert.ok(result.stray > 0.9, `stray ${result.stray}`);
});

test('оценка детерминирована и не зависит от порядка точек', () => {
  const stroke = LETTERS[3].strokes[1];
  const points = idealStroke(stroke.path);
  const first = scoreStroke(points, stroke.path);
  const again = scoreStroke(points.map((p) => ({ ...p })), stroke.path);
  assert.deepEqual(first, again);
  const reversed = scoreStroke([...points].reverse(), stroke.path);
  assert.equal(reversed.coverage, first.coverage);
  assert.equal(reversed.stars, first.stars);
});

test('пропуск куска штриха снижает балл', () => {
  // Ребёнок отвлёкся и не довёл глазурь: вырезаем длинные куски росчерка.
  const stroke = LETTERS[2].strokes[1];
  const withGaps = (gapPoints) => {
    const points = [];
    let skip = 0;
    idealStroke(stroke.path).forEach((point, index) => {
      if (skip > 0) {
        skip -= 1;
        return;
      }
      points.push(point);
      if (index % 40 === 39) skip = gapPoints;
    });
    return points;
  };
  // Мелкий разрыв в пределах допуска глазурь ещё «затягивает»...
  const small = scoreStroke(withGaps(10), stroke.path);
  assert.equal(small.coverage, 1, 'маленький разрыв не должен снижать зачёт');
  // ...а длинный пропуск честно виден в оценке.
  const big = scoreStroke(withGaps(60), stroke.path);
  assert.ok(big.coverage < 0.95, `длинный пропуск не замечен: coverage ${big.coverage}`);
  assert.ok(big.score < small.score, 'балл за пропуск должен падать');
});

test('длина штрихов положительна и нужна для анимации подсказки', () => {
  for (const letter of LETTERS) {
    for (const stroke of letter.strokes) {
      const length = strokeLength(stroke.path);
      assert.ok(length > 10, `${letter.id}: короткий штрих ${length}`);
    }
  }
});

test('перемешивание вариантов детерминировано по сиду', () => {
  const a = seededShuffle(LETTER_IDS, 42);
  const b = seededShuffle(LETTER_IDS, 42);
  assert.deepEqual(a, b);
  assert.deepEqual([...a].sort(), [...LETTER_IDS].sort());
  assert.notDeepEqual(seededShuffle(LETTER_IDS, 43), a);
});

test('у каждой буквы есть чему учиться: штрихов от одного до четырёх', () => {
  for (const letter of LETTERS) {
    const count = totalStrokes(letter);
    assert.ok(count >= 1 && count <= 4, `${letter.id}: ${count} штрихов`);
  }
});
