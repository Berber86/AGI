/**
 * Честная и детерминированная оценка обводки.
 *
 * Ребёнок рисует «глазурью» — мы получаем набор точек в координатах доски 100×100.
 * Для каждого штриха образца берём равномерные метки и смотрим:
 *   coverage — какая доля меток накрыта глазурью (в пределах допуска);
 *   stray    — какая доля детской глазури ушла далеко от образца.
 *
 * Никакого Math.random и никакой зависимости от DOM: одни и те же точки
 * всегда дают одну и ту же оценку. Это проверяется юнит-тестами.
 */

import { sampleStroke } from './paths.js';

export const TRACE_RULES = {
  /** Насколько близко к образцу должна идти глазурь (единицы доски 100×100). */
  tolerance: 11,
  /** Метка считается накрытой, если точка ребёнка не дальше tolerance. */
  minCoverage: 0.55,
  /** Доля «блуждающей» глазури, после которой штрих не засчитывается. */
  maxStray: 0.45,
  /** Минимум точек, чтобы штрих вообще оценивать (иначе ребёнок просто ткнул). */
  minPoints: 6,
  marksPerStroke: 40,
  /** Минимальная длина росчерка в единицах доски — защита от точки-тычка. */
  minStrokeLength: 14,
};

const dist = (ax, ay, bx, by) => Math.hypot(bx - ax, by - ay);

function strokePathLength(points) {
  let length = 0;
  for (let i = 1; i < points.length; i += 1) {
    length += dist(points[i - 1].x, points[i - 1].y, points[i].x, points[i].y);
  }
  return length;
}

/**
 * Оценка одного штриха.
 * @param {Array<{x:number,y:number}>} drawn точки ребёнка в координатах доски
 * @param {Array} commands путь образца
 */
export function scoreStroke(drawn, commands, rules = TRACE_RULES) {
  const points = Array.isArray(drawn) ? drawn.filter((p) => p && Number.isFinite(p.x) && Number.isFinite(p.y)) : [];
  if (points.length < rules.minPoints) {
    return { coverage: 0, stray: 1, score: 0, ok: false, stars: 0, tooShort: true };
  }

  const marks = sampleStroke(commands, rules.marksPerStroke);
  if (marks.length === 0) {
    return { coverage: 0, stray: 1, score: 0, ok: false, stars: 0, tooShort: false };
  }

  let covered = 0;
  for (const mark of marks) {
    let best = Infinity;
    for (const point of points) {
      const d = dist(mark.x, mark.y, point.x, point.y);
      if (d < best) best = d;
      if (best <= rules.tolerance) break;
    }
    if (best <= rules.tolerance) covered += 1;
  }
  const coverage = covered / marks.length;

  let stray = 0;
  for (const point of points) {
    let best = Infinity;
    for (const mark of marks) {
      const d = dist(mark.x, mark.y, point.x, point.y);
      if (d < best) best = d;
    }
    if (best > rules.tolerance * 1.7) stray += 1;
  }
  const strayRatio = stray / points.length;

  const length = strokePathLength(points);
  const tooShort = length < rules.minStrokeLength;

  const raw = Math.max(0, coverage - strayRatio * 0.35);
  const score = tooShort ? 0 : Math.max(0, Math.min(1, raw));
  const ok = !tooShort && coverage >= rules.minCoverage && strayRatio <= rules.maxStray;
  const stars = starsFor(score, ok);

  return {
    coverage: round3(coverage),
    stray: round3(strayRatio),
    score: round3(score),
    ok,
    stars,
    tooShort,
  };
}

/** Звёзды за попытку: 0 — не получилось, 1–3 — насколько аккуратно. */
export function starsFor(score, ok) {
  if (!ok) return 0;
  if (score >= 0.86) return 3;
  if (score >= 0.7) return 2;
  return 1;
}

/**
 * Оценка всей попытки: средний балл по штрихам.
 * @param {Array<Array<{x:number,y:number}>>} strokes росчерки ребёнка по порядку
 * @param {Array<{path:Array}>} letterStrokes штрихи образца
 */
export function scoreAttempt(strokes, letterStrokes, rules = TRACE_RULES) {
  const results = letterStrokes.map((stroke, index) =>
    scoreStroke(strokes[index] || [], stroke.path, rules),
  );
  const total = letterStrokes.length || 1;
  const score = results.reduce((sum, item) => sum + item.score, 0) / total;
  const allOk = results.every((item) => item.ok);
  return {
    strokes: results,
    score: round3(score),
    stars: starsFor(score, allOk),
    complete: allOk,
  };
}

function round3(value) {
  return Math.round(value * 1000) / 1000;
}
