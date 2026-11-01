// Рисование объёмных кубиков и статичных картинок.
import { PALETTE, colorCounts } from './pictures.js';

export function roundRect(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

/** Кубик с центром (cx, cy) и стороной s. opts: rot, sx, sy, alpha, glow, dim */
/** «Любой цвет» (режим «форма»): светло-серый кубик с четырьмя цветными точками. */
export const ANY = '*';
const ANY_STYLE = { fill: '#d4cfe0', dark: '#a49db8', light: '#f1eef8' };

export function drawCube(ctx, cx, cy, s, key, opts = {}) {
  const p = key === ANY ? ANY_STYLE : PALETTE[key] || { fill: '#999', dark: '#555', light: '#ccc' };
  const { rot = 0, sx = 1, sy = 1, alpha = 1, glow = 0, dim = 0 } = opts;
  if (alpha <= 0 || s <= 0) return;
  ctx.save();
  ctx.globalAlpha *= alpha;
  ctx.translate(cx, cy);
  if (rot) ctx.rotate(rot);
  ctx.scale(sx, sy);
  const h = s / 2;
  const r = s * 0.16;
  if (glow > 0) {
    ctx.shadowColor = p.light;
    ctx.shadowBlur = s * 0.8 * glow;
  } else {
    ctx.shadowColor = 'rgba(40,30,60,0.28)';
    ctx.shadowBlur = s * 0.12;
    ctx.shadowOffsetY = s * 0.07;
  }
  // Корпус (тёмный низ = боковая грань).
  ctx.fillStyle = p.dark;
  roundRect(ctx, -h, -h, s, s, r);
  ctx.fill();
  ctx.shadowColor = 'transparent';
  // Верхняя грань.
  const g = ctx.createLinearGradient(-h, -h, h, h);
  g.addColorStop(0, p.light);
  g.addColorStop(0.45, p.fill);
  g.addColorStop(1, p.fill);
  ctx.fillStyle = g;
  roundRect(ctx, -h, -h, s, s * 0.88, r);
  ctx.fill();
  // Блик.
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  roundRect(ctx, -h + s * 0.12, -h + s * 0.1, s * 0.38, s * 0.14, s * 0.07);
  ctx.fill();
  if (key === ANY) {
    const dots = ['Y', 'R', 'G', 'B'];
    dots.forEach((k, i) => {
      ctx.fillStyle = PALETTE[k].fill;
      ctx.beginPath();
      ctx.arc((i % 2 ? 1 : -1) * s * 0.15, -s * 0.06 + (i > 1 ? 1 : -1) * s * 0.15, s * 0.1, 0, Math.PI * 2);
      ctx.fill();
    });
  }
  if (dim > 0) {
    ctx.fillStyle = `rgba(20,20,35,${0.62 * dim})`;
    roundRect(ctx, -h, -h, s, s, r);
    ctx.fill();
  }
  ctx.restore();
}

/**
 * Список кубиков картинки: {r, c, key, role}. key — каким цветом рисовать, role — цвет в образце
 * (по нему анимация находит «окошко», «стебель» и т. п.). В режиме «форма» картинка оживает в цветах,
 * из которых её собрал ребёнок: picture.roles хранит исходные цвета.
 */
export function cubesOf(picture) {
  const out = [];
  picture.rows.forEach((row, r) =>
    [...row].forEach((key, c) => key !== '.' && out.push({ r, c, key, role: picture.roles ? picture.roles[r][c] : key })),
  );
  return out;
}

/** Картинка, вписанная в прямоугольник (x, y, w, h). Возвращает геометрию. */
export function layoutPicture(picture, x, y, w, h, maxCube = Infinity) {
  const rows = picture.rows.length;
  const cols = picture.rows[0].length;
  const pitch = Math.min(w / cols, h / rows, maxCube);
  const s = pitch * 0.9;
  const ox = x + (w - pitch * cols) / 2 + pitch / 2;
  const oy = y + (h - pitch * rows) / 2 + pitch / 2;
  return { rows, cols, pitch, s, ox, oy, at: (r, c) => [ox + c * pitch, oy + r * pitch] };
}

export function drawPicture(ctx, picture, x, y, w, h, opts = {}) {
  const L = layoutPicture(picture, x, y, w, h, opts.maxCube);
  if (opts.grid) {
    ctx.save();
    ctx.strokeStyle = 'rgba(120,100,160,0.18)';
    ctx.lineWidth = Math.max(1, L.pitch * 0.03);
    ctx.setLineDash([L.pitch * 0.12, L.pitch * 0.1]);
    for (let r = 0; r < L.rows; r++) {
      for (let c = 0; c < L.cols; c++) {
        const [cx, cy] = L.at(r, c);
        roundRect(ctx, cx - L.s / 2, cy - L.s / 2, L.s, L.s, L.s * 0.16);
        ctx.stroke();
      }
    }
    ctx.restore();
  }
  for (const cube of cubesOf(picture)) {
    const [cx, cy] = L.at(cube.r, cube.c);
    drawCube(ctx, cx, cy, L.s, cube.key, opts.cubeOpts ? opts.cubeOpts(cube) : undefined);
  }
  return L;
}

/** Ряд «что понадобится»: для каждого цвета — столько маленьких кубиков, сколько нужно. */
export function drawInventory(ctx, picture, x, y, w, h) {
  const groups = colorCounts(picture);
  const total = groups.reduce((s, [, n]) => s + n, 0) + (groups.length - 1) * 0.8;
  const s = Math.min(h * 0.8, (w / total) * 0.86);
  const pitch = s / 0.86;
  let cx = x + (w - total * pitch) / 2 + pitch / 2;
  const cy = y + h / 2;
  for (const [key, n] of groups) {
    for (let i = 0; i < n; i++) {
      drawCube(ctx, cx, cy, s, key);
      cx += pitch;
    }
    cx += pitch * 0.8;
  }
}

export function star(ctx, cx, cy, R, fill = '#ffc83d', stroke = '#e09400') {
  ctx.save();
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 ? R * 0.45 : R;
    ctx.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr);
  }
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.lineWidth = R * 0.12;
  ctx.strokeStyle = stroke;
  ctx.lineJoin = 'round';
  ctx.stroke();
  ctx.restore();
}
