/**
 * Геометрия штрихов: превращаем описание пути в плотную ломаную,
 * чтобы обводку ребёнка можно было честно сравнить с образцом.
 * Модуль чистый: никакого DOM, его можно импортировать в node-тестах.
 */

const dist = (ax, ay, bx, by) => Math.hypot(bx - ax, by - ay);

function quadPoint(p0, p1, p2, t) {
  const u = 1 - t;
  return [
    u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0],
    u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1],
  ];
}

function cubicPoint(p0, p1, p2, p3, t) {
  const u = 1 - t;
  return [
    u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
    u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1],
  ];
}

/**
 * Разворачивает путь в ломаную с шагом примерно `step` единиц.
 * Возвращает [{ x, y, t }], где t — доля пройденного пути (0..1).
 */
export function flattenPath(commands, step = 2) {
  const points = [];
  if (!Array.isArray(commands) || commands.length === 0) return points;

  let cursor = [0, 0];
  let start = [0, 0];
  let travelled = 0;
  let total = 0;
  const segments = [];

  const push = (x, y) => {
    const last = segments[segments.length - 1];
    if (last && dist(last.x, last.y, x, y) < 1e-6) return;
    segments.push({ x, y });
  };

  for (const command of commands) {
    const [op] = command;
    if (op === 'M') {
      cursor = [command[1], command[2]];
      start = cursor;
      push(cursor[0], cursor[1]);
    } else if (op === 'L') {
      const target = [command[1], command[2]];
      const length = Math.max(dist(cursor[0], cursor[1], target[0], target[1]), 1e-6);
      const steps = Math.max(1, Math.ceil(length / step));
      for (let i = 1; i <= steps; i += 1) {
        const t = i / steps;
        push(cursor[0] + (target[0] - cursor[0]) * t, cursor[1] + (target[1] - cursor[1]) * t);
      }
      cursor = target;
    } else if (op === 'Q') {
      const c = [command[1], command[2]];
      const target = [command[3], command[4]];
      const approx = dist(cursor[0], cursor[1], c[0], c[1]) + dist(c[0], c[1], target[0], target[1]);
      const steps = Math.max(2, Math.ceil(approx / step));
      for (let i = 1; i <= steps; i += 1) {
        const p = quadPoint(cursor, c, target, i / steps);
        push(p[0], p[1]);
      }
      cursor = target;
    } else if (op === 'C') {
      const c1 = [command[1], command[2]];
      const c2 = [command[3], command[4]];
      const target = [command[5], command[6]];
      const approx =
        dist(cursor[0], cursor[1], c1[0], c1[1]) +
        dist(c1[0], c1[1], c2[0], c2[1]) +
        dist(c2[0], c2[1], target[0], target[1]);
      const steps = Math.max(2, Math.ceil(approx / step));
      for (let i = 1; i <= steps; i += 1) {
        const p = cubicPoint(cursor, c1, c2, target, i / steps);
        push(p[0], p[1]);
      }
      cursor = target;
    } else if (op === 'Z') {
      const length = Math.max(dist(cursor[0], cursor[1], start[0], start[1]), 1e-6);
      const steps = Math.max(1, Math.ceil(length / step));
      for (let i = 1; i <= steps; i += 1) {
        const t = i / steps;
        push(cursor[0] + (start[0] - cursor[0]) * t, cursor[1] + (start[1] - cursor[1]) * t);
      }
      cursor = [start[0], start[1]];
    }
  }

  for (let i = 1; i < segments.length; i += 1) {
    total += dist(segments[i - 1].x, segments[i - 1].y, segments[i].x, segments[i].y);
  }
  let acc = 0;
  points.push({ x: segments[0].x, y: segments[0].y, t: 0 });
  for (let i = 1; i < segments.length; i += 1) {
    acc += dist(segments[i - 1].x, segments[i - 1].y, segments[i].x, segments[i].y);
    points.push({ x: segments[i].x, y: segments[i].y, t: total > 0 ? acc / total : 0 });
  }
  void travelled;
  return points;
}

/** Равномерные точки-метки вдоль штриха — по ним считаем покрытие обводки. */
export function sampleStroke(commands, count = 40, step = 2) {
  const points = flattenPath(commands, step);
  if (points.length === 0) return [];
  if (points.length === 1) return [points[0]];
  const marks = [];
  for (let i = 0; i < count; i += 1) {
    const target = (i / (count - 1)) * (points.length - 1);
    const index = Math.min(points.length - 1, Math.floor(target));
    marks.push(points[index]);
  }
  return marks;
}

export function pathStart(commands) {
  const flat = flattenPath(commands, 8);
  return flat.length ? flat[0] : { x: 50, y: 50, t: 0 };
}

export function pathEnd(commands) {
  const flat = flattenPath(commands, 8);
  return flat.length ? flat[flat.length - 1] : { x: 50, y: 50, t: 1 };
}

/** Длина штриха в единицах доски — нужна для анимации подсказки. */
export function strokeLength(commands, step = 2) {
  const points = flattenPath(commands, step);
  let length = 0;
  for (let i = 1; i < points.length; i += 1) {
    length += dist(points[i - 1].x, points[i - 1].y, points[i].x, points[i].y);
  }
  return length;
}

/**
 * Перевод касания в координаты доски 100×100.
 * Чистая функция, чтобы тест не зависел от DOM.
 */
export function boardGeometry(width, height, board = 100, padding = 8) {
  const size = Math.max(1, Math.min(width, height) - padding * 2);
  const scale = size / board;
  const offsetX = (width - size) / 2;
  const offsetY = (height - size) / 2;
  return { size, scale, offsetX, offsetY, board };
}

export function toBoard(geometry, clientX, clientY, rect) {
  const x = (clientX - rect.left - geometry.offsetX) / geometry.scale;
  const y = (clientY - rect.top - geometry.offsetY) / geometry.scale;
  return { x, y };
}
