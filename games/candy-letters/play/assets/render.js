/**
 * Отрисовка «Сладких букв» на canvas.
 * Никаких картинок извне: леденцы, вафельная клетка, глазурь и конфетти
 * рисуются векторно, поэтому весь пакет весит килобайты.
 */

import { flattenPath, strokeLength } from './paths.js';

const LETTER_FONT = '"Baloo 2", "Comfortaa", "Trebuchet MS", "Segoe UI", sans-serif';

function roundRectPath(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

/** Подготавливает canvas под devicePixelRatio (без растянутой мыльной картинки). */
export function fitCanvas(canvas) {
  const dpr = Math.min(globalThis.devicePixelRatio || 1, 2);
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(1, Math.round(rect.width * dpr));
  const height = Math.max(1, Math.round(rect.height * dpr));
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, width: rect.width, height: rect.height, dpr };
}

/** Путь штриха в контексте canvas с заданным переносом и масштабом. */
export function tracePath(ctx, commands, scale, offsetX = 0, offsetY = 0) {
  ctx.beginPath();
  for (const command of commands) {
    const [op] = command;
    if (op === 'M') ctx.moveTo(offsetX + command[1] * scale, offsetY + command[2] * scale);
    else if (op === 'L') ctx.lineTo(offsetX + command[1] * scale, offsetY + command[2] * scale);
    else if (op === 'Q')
      ctx.quadraticCurveTo(
        offsetX + command[1] * scale,
        offsetY + command[2] * scale,
        offsetX + command[3] * scale,
        offsetY + command[4] * scale,
      );
    else if (op === 'C')
      ctx.bezierCurveTo(
        offsetX + command[1] * scale,
        offsetY + command[2] * scale,
        offsetX + command[3] * scale,
        offsetY + command[4] * scale,
        offsetX + command[5] * scale,
        offsetY + command[6] * scale,
      );
    else if (op === 'Z') ctx.closePath();
  }
}

/**
 * Кондитерская страна: небо-карамель, леденцовые деревья, вафельный забор,
 * шоколадная земля. Детали считаются из сида, поэтому фон не «прыгает».
 */
export function drawCandyBackground(ctx, width, height, seed = 1, time = 0) {
  const sky = ctx.createLinearGradient(0, 0, 0, height);
  sky.addColorStop(0, '#fff2d6');
  sky.addColorStop(0.55, '#ffe2ef');
  sky.addColorStop(1, '#ffd3c2');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, height);

  // Мармеладные облака
  ctx.save();
  ctx.globalAlpha = 0.5;
  for (let i = 0; i < 5; i += 1) {
    const drift = ((time / 26000 + i * 0.2) % 1.3) - 0.15;
    const cx = drift * width;
    const cy = height * (0.12 + ((i * 37) % 22) / 100);
    const r = height * (0.05 + ((i * 13) % 9) / 220);
    ctx.fillStyle = i % 2 === 0 ? '#fff6fb' : '#ffe9f2';
    ctx.beginPath();
    ctx.ellipse(cx, cy, r * 1.9, r, 0, 0, Math.PI * 2);
    ctx.ellipse(cx + r, cy - r * 0.35, r * 1.2, r * 0.85, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  const horizon = height * 0.72;

  // Леденцовые деревья
  const trees = 4 + (Math.abs(seed) % 3);
  for (let i = 0; i < trees; i += 1) {
    const t = (i + 0.5) / trees;
    const x = width * (0.08 + t * 0.86) + Math.sin(seed + i) * width * 0.02;
    const stickTop = horizon - height * (0.2 + ((i * 29) % 13) / 100);
    const candyR = height * (0.055 + ((i * 17) % 7) / 220);
    ctx.strokeStyle = '#e8b48c';
    ctx.lineWidth = Math.max(4, height * 0.012);
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x, horizon + height * 0.04);
    ctx.lineTo(x, stickTop);
    ctx.stroke();
    drawLollipopDisc(ctx, x, stickTop - candyR * 0.4, candyR, ['#ff8fb1', '#fff6fb'], seed + i * 3, time);
  }

  // Вафельный забор
  ctx.save();
  ctx.fillStyle = '#f6d3a3';
  ctx.strokeStyle = '#e0aa74';
  ctx.lineWidth = 2;
  const postWidth = Math.max(18, width * 0.026);
  const gap = postWidth * 1.5;
  for (let x = -gap; x < width + gap; x += gap) {
    roundRectPath(ctx, x, horizon - height * 0.06, postWidth, height * 0.12, 6);
    ctx.fill();
    ctx.stroke();
  }
  ctx.restore();

  // Шоколадная земля
  const ground = ctx.createLinearGradient(0, horizon, 0, height);
  ground.addColorStop(0, '#8b5a3c');
  ground.addColorStop(1, '#6d4028');
  ctx.fillStyle = ground;
  ctx.fillRect(0, horizon + height * 0.055, width, height);

  // Посыпка на земле
  ctx.save();
  for (let i = 0; i < 40; i += 1) {
    const x = ((i * 97 + seed * 31) % 100) / 100 * width;
    const y = horizon + height * 0.08 + ((i * 53) % 100) / 100 * height * 0.16;
    ctx.fillStyle = ['#ffd166', '#ff8fb1', '#8fd8ff', '#c77dff'][i % 4];
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.ellipse(x, y, 3.2, 1.7, (i % 7) / 7, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

/** Крупная буква поверх леденца — так её видно и на маленькой карточке. */
export function drawLetterOnCandy(ctx, x, y, glyph, size, color = '#ffffff', stroke = 'rgba(120, 40, 70, 0.35)') {
  ctx.save();
  ctx.font = `800 ${size}px ${LETTER_FONT}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.lineJoin = 'round';
  ctx.lineWidth = Math.max(3, size * 0.1);
  ctx.strokeStyle = stroke;
  ctx.strokeText(glyph, x, y + size * 0.04);
  ctx.fillStyle = color;
  ctx.fillText(glyph, x, y + size * 0.04);
  ctx.restore();
}

/** Круглый леденец со спиралью. */
export function drawLollipopDisc(ctx, x, y, radius, colors = ['#ff8fb1', '#fff6fb'], seed = 1, time = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.fillStyle = colors[1] || '#fff6fb';
  ctx.fill();

  ctx.save();
  ctx.clip();
  ctx.rotate((time / 9000 + seed) % (Math.PI * 2));
  ctx.strokeStyle = colors[0] || '#ff8fb1';
  ctx.lineWidth = Math.max(3, radius * 0.24);
  ctx.lineCap = 'round';
  ctx.beginPath();
  const turns = 3.2;
  const steps = 120;
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    const angle = t * Math.PI * 2 * turns;
    const r = t * radius * 1.05;
    const px = Math.cos(angle) * r;
    const py = Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.stroke();
  ctx.restore();

  ctx.lineWidth = Math.max(2, radius * 0.09);
  ctx.strokeStyle = 'rgba(255,255,255,0.85)';
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.98, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

/**
 * Карточка буквы: большой леденец со штрихами буквы внутри, палочка, блик.
 * Возвращает ничего, рисует в ctx.
 */
export function drawLollipopCard(ctx, width, height, letter, options = {}) {
  const { showStrokes = true, progress = 0 } = options;
  ctx.clearRect(0, 0, width, height);
  const cx = width / 2;
  const radius = Math.min(width, height) * 0.32;
  const cy = height * 0.44;

  // Палочка
  ctx.save();
  ctx.strokeStyle = '#e8b48c';
  ctx.lineWidth = Math.max(8, radius * 0.14);
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(cx, cy + radius * 0.8);
  ctx.lineTo(cx + radius * 0.12, height * 0.97);
  ctx.stroke();
  ctx.restore();

  drawLollipopDisc(ctx, cx, cy, radius, [letter.color, '#fff8fb'], 3, performance.now());

  // Буква лежит НА леденце — рисуем её до спирали, чтобы спираль шла вокруг
  const inner = radius * 1.22;
  const scale = inner / 100;
  const offsetX = cx - inner / 2;
  const offsetY = cy - inner / 2;
  ctx.save();
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  letter.strokes.forEach((stroke) => {
    tracePath(ctx, stroke.path, scale, offsetX, offsetY);
    ctx.strokeStyle = 'rgba(120, 40, 70, 0.45)';
    ctx.lineWidth = Math.max(10, scale * 17);
    ctx.stroke();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = Math.max(7, scale * 12);
    ctx.stroke();
  });
  ctx.restore();

  // Блик
  ctx.save();
  ctx.globalAlpha = 0.4;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.ellipse(cx - radius * 0.36, cy - radius * 0.42, radius * 0.24, radius * 0.14, -0.6, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  void showStrokes;
  void progress;
}

/** Вафельная клетка — фон для обводки и письма. */
export function drawWaferBoard(ctx, geometry, { accent = '#e0aa74', label = '' } = {}) {
  const { size, offsetX, offsetY } = geometry;
  ctx.save();
  roundRectPath(ctx, offsetX, offsetY, size, size, Math.min(26, size * 0.06));
  const wafer = ctx.createLinearGradient(offsetX, offsetY, offsetX + size, offsetY + size);
  wafer.addColorStop(0, '#fff6e6');
  wafer.addColorStop(1, '#ffe8cf');
  ctx.fillStyle = wafer;
  ctx.fill();
  ctx.clip();

  ctx.strokeStyle = 'rgba(224, 170, 116, 0.45)';
  ctx.lineWidth = 1.4;
  const cell = size / 8;
  for (let i = 1; i < 8; i += 1) {
    ctx.beginPath();
    ctx.moveTo(offsetX + i * cell, offsetY);
    ctx.lineTo(offsetX + i * cell, offsetY + size);
    ctx.moveTo(offsetX, offsetY + i * cell);
    ctx.lineTo(offsetX + size, offsetY + i * cell);
    ctx.stroke();
  }
  // Диагонали как в школьной тетради
  ctx.strokeStyle = 'rgba(224, 170, 116, 0.28)';
  ctx.beginPath();
  ctx.moveTo(offsetX, offsetY);
  ctx.lineTo(offsetX + size, offsetY + size);
  ctx.moveTo(offsetX + size, offsetY);
  ctx.lineTo(offsetX, offsetY + size);
  ctx.moveTo(offsetX + size / 2, offsetY);
  ctx.lineTo(offsetX + size / 2, offsetY + size);
  ctx.stroke();
  ctx.restore();

  ctx.save();
  roundRectPath(ctx, offsetX, offsetY, size, size, Math.min(26, size * 0.06));
  ctx.strokeStyle = accent;
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.restore();

  if (label) {
    ctx.save();
    ctx.fillStyle = 'rgba(120, 70, 40, 0.55)';
    ctx.font = `600 ${Math.max(12, size * 0.055)}px ${LETTER_FONT}`;
    ctx.textAlign = 'center';
    ctx.fillText(label, offsetX + size / 2, offsetY + size + Math.max(16, size * 0.07));
    ctx.restore();
  }
}

/**
 * Доска обводки: пунктирная подсказка, номер штриха, глазурь ребёнка
 * и конфетка-бегунок, которая показывает, куда вести палец.
 */
export function drawTraceBoard(ctx, geometry, letter, options = {}) {
  const {
    strokesDone = 0,
    drawn = [],
    activeStroke = null,
    guideProgress = 0,
    showGuide = true,
    ghost = false,
  } = options;
  const { size, scale, offsetX, offsetY } = geometry;

  drawWaferBoard(ctx, geometry, { accent: letter.color });

  letter.strokes.forEach((stroke, index) => {
    const isDone = index < strokesDone;
    tracePath(ctx, stroke.path, scale, offsetX, offsetY);
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    // Тень-канавка
    ctx.strokeStyle = 'rgba(160, 100, 60, 0.16)';
    ctx.lineWidth = Math.max(10, scale * 16);
    ctx.stroke();
    // Канавка или пунктирная подсказка
    ctx.save();
    if (ghost) {
      ctx.strokeStyle = 'rgba(160, 100, 60, 0.1)';
      ctx.lineWidth = Math.max(10, scale * 16);
      ctx.stroke();
    } else {
      ctx.setLineDash([scale * 6, scale * 6]);
      ctx.lineDashOffset = -(performance.now() / 60) % (scale * 12);
      ctx.strokeStyle = isDone ? 'rgba(120,120,120,0.35)' : letter.colorDeep;
      ctx.lineWidth = Math.max(3, scale * 4.2);
      ctx.globalAlpha = showGuide ? 0.9 : 0.25;
      ctx.stroke();
    }
    ctx.restore();

    // Стрелка порядка штрихов
    if (index === strokesDone && showGuide) {
      const flat = flattenPath(stroke.path, 3);
      const start = flat[0];
      ctx.save();
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = letter.colorDeep;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(offsetX + start.x * scale, offsetY + start.y * scale, Math.max(11, scale * 8), 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = letter.colorDeep;
      ctx.font = `700 ${Math.max(12, scale * 9)}px ${LETTER_FONT}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(index + 1), offsetX + start.x * scale, offsetY + start.y * scale + 1);
      ctx.restore();
    }
  });

  // Глазурь ребёнка
  const icing = (points, color, widthFactor = 0.11, alpha = 1) => {
    if (points.length < 2) {
      if (points.length === 1) {
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(offsetX + points[0].x * scale, offsetY + points[0].y * scale, Math.max(4, scale * 6), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      return;
    }
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.strokeStyle = color;
    ctx.lineWidth = Math.max(6, scale * 100 * widthFactor);
    ctx.beginPath();
    points.forEach((point, index) => {
      const x = offsetX + point.x * scale;
      const y = offsetY + point.y * scale;
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.restore();
  };

  drawn.forEach((points) => icing(points, letter.colorDeep, 0.11, 0.95));
  if (activeStroke && activeStroke.length) icing(activeStroke, letter.color, 0.11, 0.95);

  // Бегунок-подсказка по текущему штриху
  if (showGuide && strokesDone < letter.strokes.length) {
    const stroke = letter.strokes[strokesDone];
    const flat = flattenPath(stroke.path, 2);
    const length = strokeLength(stroke.path, 2);
    const index = Math.min(flat.length - 1, Math.floor(guideProgress * (flat.length - 1)));
    const point = flat[index];
    if (point) {
      ctx.save();
      ctx.globalAlpha = 0.9;
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = letter.colorDeep;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(offsetX + point.x * scale, offsetY + point.y * scale, Math.max(8, scale * 6), 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
    void length;
  }

}

/** Посыпка-конфетти: короткая радость без единой картинки. */
export function drawSprinkles(ctx, width, height, particles) {
  ctx.clearRect(0, 0, width, height);
  for (const p of particles) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, p.life);
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle);
    ctx.fillStyle = p.color;
    roundRectPath(ctx, -p.size, -p.size / 2.6, p.size * 2, p.size / 1.3, p.size / 2);
    ctx.fill();
    ctx.restore();
  }
}

export function makeSprinkles(width, height, origin, count = 46) {
  const colors = ['#ff5d73', '#ffd447', '#4cc9f0', '#c77dff', '#ff9f43', '#ffffff'];
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 + (i % 5) * 0.2;
    const speed = 3.2 + ((i * 13) % 10) / 3;
    return {
      x: origin.x,
      y: origin.y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 2.4,
      angle: (i % 12) / 12,
      spin: ((i % 7) - 3) / 40,
      size: 5 + ((i * 7) % 7),
      color: colors[i % colors.length],
      life: 1,
    };
  });
}

export function stepSprinkles(particles, width, height) {
  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.24;
    p.vx *= 0.99;
    p.angle += p.spin;
    p.life -= 0.014;
    if (p.y > height + 40) p.life = 0;
  }
  return particles.filter((p) => p.life > 0);
}
