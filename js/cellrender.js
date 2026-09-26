// cellrender.js — процедурная отрисовка существ: тело, рот, органеллы, пища, частицы.
// Контракт: функции рисуют в системе координат, где (0,0) — центр клетки,
// а ось +X смотрит по направлению движения (для существ, у которых есть курс).

import { TAU, clamp, hash01, rgba, shade } from './util.js';
import { PARTS } from './parts.js';
import { FOOD_KINDS } from './species.js';

// ------------------------------------------------------------------
// Форма тела: заполняет путь. Возвращает ничего, ставит текущий путь.
// ------------------------------------------------------------------
export function bodyPath(g, shape, r, t = 0, seed = 1, phase = 0) {
  switch (shape) {
    case 'coccus':
      g.beginPath(); g.arc(0, 0, r, 0, TAU); break;

    case 'oval':
      g.beginPath(); g.ellipse(0, 0, r * 1.14, r * 0.87, 0, 0, TAU); break;

    case 'bacillus':
      g.beginPath(); g.ellipse(0, 0, r * 1.36, r * 0.7, 0, 0, TAU); break;

    case 'chain': {
      g.beginPath();
      const n = 3, off = r * 0.72;
      for (let i = 0; i < n; i++) {
        const x = (i - 1) * off * 2 * 0.62;
        g.moveTo(x + r * 0.62, 0);
        g.arc(x, 0, r * 0.62, 0, TAU);
      }
      break;
    }
    case 'spiral': {
      g.beginPath();
      for (let i = 0; i <= 40; i++) {
        const a = (i / 40) * TAU;
        const rr = r * (1 + Math.cos(3 * a + t * 0.7 + phase) * 0.18);
        const x = Math.cos(a) * rr * 1.1, y = Math.sin(a) * rr * 0.82;
        i ? g.lineTo(x, y) : g.moveTo(x, y);
      }
      g.closePath(); break;
    }
    case 'star': {
      g.beginPath();
      for (let i = 0; i <= 60; i++) {
        const a = (i / 60) * TAU;
        const rr = r * (1 + Math.cos(5 * a - t * 0.5 + phase) * 0.26);
        const x = Math.cos(a) * rr, y = Math.sin(a) * rr;
        i ? g.lineTo(x, y) : g.moveTo(x, y);
      }
      g.closePath(); break;
    }
    case 'amoeba': {
      g.beginPath();
      for (let i = 0; i <= 64; i++) {
        const a = (i / 64) * TAU;
        const rr = r * (1 + 0.13 * Math.sin(3 * a + t * 1.3 + phase)
          + 0.09 * Math.sin(5 * a - t * 0.9)
          + 0.05 * Math.sin(7 * a + t * 1.8 + seed));
        const x = Math.cos(a) * rr, y = Math.sin(a) * rr;
        i ? g.lineTo(x, y) : g.moveTo(x, y);
      }
      g.closePath(); break;
    }
    case 'bell': {
      g.beginPath();
      for (let i = 0; i <= 48; i++) {
        const a = (i / 48) * TAU;
        const skirt = Math.max(0, Math.sin(a + Math.PI / 2));
        const rr = r * (1 - 0.2 * skirt + 0.07 * Math.sin(a * 6 + t * 2.4) * skirt);
        const x = Math.cos(a) * rr * 0.98, y = Math.sin(a) * rr * 1.05;
        i ? g.lineTo(x, y) : g.moveTo(x, y);
      }
      g.closePath(); break;
    }
    case 'shield': {
      g.beginPath();
      for (let i = 0; i <= 48; i++) {
        const a = (i / 48) * TAU;
        const rr = r * (1 - 0.2 * Math.cos(a) + 0.06 * Math.cos(2 * a));
        const x = Math.cos(a) * rr * 1.08, y = Math.sin(a) * rr * 0.86;
        i ? g.lineTo(x, y) : g.moveTo(x, y);
      }
      g.closePath(); break;
    }
    case 'crystal': {
      g.beginPath();
      const n = 7;
      for (let i = 0; i < n; i++) {
        const a = (i / n) * TAU + t * 0.12;
        const rr = r * (0.85 + hash01(seed + i * 17) * 0.45);
        const x = Math.cos(a) * rr, y = Math.sin(a) * rr;
        i ? g.lineTo(x, y) : g.moveTo(x, y);
      }
      g.closePath(); break;
    }
    case 'tripod': {
      g.beginPath();
      for (let i = 0; i <= 54; i++) {
        const a = (i / 54) * TAU;
        const rr = r * (1 + 0.1 * Math.cos(3 * a + t * 0.4) + 0.06 * Math.cos(6 * a));
        const x = Math.cos(a) * rr, y = Math.sin(a) * rr;
        i ? g.lineTo(x, y) : g.moveTo(x, y);
      }
      g.closePath(); break;
    }
    default:
      g.beginPath(); g.arc(0, 0, r, 0, TAU);
  }
}

// Дополнительные украшения тела (щупальца, отростки, киль).
function bodyExtra(g, shape, r, t, color, color2, seed) {
  switch (shape) {
    case 'bell': {
      // свисающие щупальца
      g.strokeStyle = rgba(shade(color, -0.1), 0.75); g.lineWidth = Math.max(1, r * 0.06); g.lineCap = 'round';
      for (let i = 0; i < 6; i++) {
        const x = (i / 5 - 0.5) * r * 1.5;
        g.beginPath(); g.moveTo(x, r * 0.55);
        for (let k = 1; k <= 4; k++) {
          const u = k / 4;
          g.lineTo(x + Math.sin(t * 3 + i + u * 3) * r * 0.16 * u, r * (0.55 + u * 1.05));
        }
        g.stroke();
      }
      break;
    }
    case 'tripod':
      g.strokeStyle = rgba(shade(color, -0.2), 0.9); g.lineWidth = Math.max(1.5, r * 0.14); g.lineCap = 'round';
      for (let i = 0; i < 3; i++) {
        const a = (i / 3) * TAU + t * 0.3;
        g.beginPath(); g.moveTo(Math.cos(a) * r * 0.75, Math.sin(a) * r * 0.75);
        g.quadraticCurveTo(Math.cos(a + 0.4) * r * 1.4, Math.sin(a + 0.4) * r * 1.4,
          Math.cos(a + 0.15) * r * 1.75 + Math.sin(t * 2 + i) * r * 0.1,
          Math.sin(a + 0.15) * r * 1.75);
        g.stroke();
      }
      break;
    case 'lantern': {
      // светящаяся приманка
      const sway = Math.sin(t * 1.6) * 0.35;
      // eslint-disable-next-line no-param-reassign
      const lx = Math.cos(sway) * r * 1.55, ly = Math.sin(sway) * r * 0.5;
      g.strokeStyle = rgba(shade(color, -0.3), 0.9); g.lineWidth = Math.max(1, r * 0.07);
      g.beginPath(); g.moveTo(r * 0.9, 0); g.quadraticCurveTo(r * 1.35, ly * 0.6, lx, ly); g.stroke();
      const grd = g.createRadialGradient(lx, ly, 0, lx, ly, r * 0.75);
      grd.addColorStop(0, rgba(color2, 0.95));
      grd.addColorStop(0.35, rgba(color, 0.5));
      grd.addColorStop(1, rgba(color, 0));
      g.fillStyle = grd; g.beginPath(); g.arc(lx, ly, r * 0.75, 0, TAU); g.fill();
      break;
    }
    case 'crystal':
      g.strokeStyle = rgba(color2, 0.35); g.lineWidth = Math.max(1, r * 0.05);
      for (let i = 0; i < 5; i++) {
        const a = hash01(seed + i * 31) * TAU;
        g.beginPath();
        g.moveTo(Math.cos(a) * r * 0.3, Math.sin(a) * r * 0.3);
        g.lineTo(Math.cos(a) * r * 0.95, Math.sin(a) * r * 0.95);
        g.stroke();
      }
      break;
    default:
  }
}

// ------------------------------------------------------------------
// Рот/приёмное отверстие
// ------------------------------------------------------------------
export function drawMouth(g, mouth, r, t, color) {
  const dark = 'rgba(12, 20, 26, 0.85)';
  switch (mouth) {
    case 'jaws': {
      const open = 0.35 + Math.abs(Math.sin(t * 1.8)) * 0.5;
      for (const sgn of [-1, 1]) {
        g.save(); g.rotate(sgn * open * 0.5 * 0.6);
        g.beginPath();
        g.moveTo(r * 0.55, sgn * r * 0.05);
        g.quadraticCurveTo(r * 1.15, sgn * r * 0.35 * open, r * 0.6, sgn * r * 0.5 * open + sgn * r * 0.06);
        g.quadraticCurveTo(r * 0.72, sgn * r * 0.2, r * 0.55, sgn * r * 0.05);
        g.fillStyle = 'rgba(255,255,255,0.92)'; g.fill();
        g.restore();
      }
      g.beginPath(); g.moveTo(r * 0.8, -r * 0.3 * open); g.lineTo(r * 1.02, 0); g.lineTo(r * 0.8, r * 0.3 * open);
      g.fillStyle = dark; g.fill();
      break;
    }
    case 'beak':
      g.beginPath(); g.moveTo(r * 1.12, 0); g.lineTo(r * 0.55, -r * 0.28); g.lineTo(r * 0.55, r * 0.28); g.closePath();
      g.fillStyle = rgba(shade(color, -0.5), 0.95); g.fill();
      g.beginPath(); g.moveTo(r * 0.72, 0); g.lineTo(r * 1.05, 0); g.lineTo(r * 0.72, r * 0.16); g.closePath();
      g.fillStyle = 'rgba(255,255,255,0.5)'; g.fill();
      break;
    case 'disk':
      g.beginPath(); g.ellipse(r * 0.86, 0, r * 0.22, r * 0.26, 0, 0, TAU);
      g.fillStyle = dark; g.fill();
      g.strokeStyle = rgba(shade(color, 0.5), 0.7); g.lineWidth = Math.max(1, r * 0.05); g.stroke();
      break;
    case 'filter':
      g.strokeStyle = rgba(shade(color, 0.4), 0.75); g.lineWidth = Math.max(1, r * 0.06);
      for (let i = -2; i <= 2; i++) {
        g.beginPath(); g.moveTo(r * 0.95, i * r * 0.16);
        g.quadraticCurveTo(r * 1.2, i * r * 0.2, r * 1.34, i * r * 0.26 + Math.sin(t * 3 + i) * r * 0.05);
        g.stroke();
      }
      break;
    case 'tentacles':
      g.strokeStyle = rgba(color, 0.85); g.lineWidth = Math.max(1, r * 0.07); g.lineCap = 'round';
      for (let i = 0; i < 6; i++) {
        const a = -0.55 + (i / 5) * 1.1;
        const len = r * (0.9 + 0.3 * Math.sin(t * 2 + i));
        g.beginPath(); g.moveTo(Math.cos(a) * r * 0.85, Math.sin(a) * r * 0.85);
        g.quadraticCurveTo(Math.cos(a) * (r * 0.85 + len * 0.6) + Math.sin(t * 2.4 + i) * r * 0.2,
          Math.sin(a) * (r * 0.85 + len * 0.6), Math.cos(a) * (r * 0.85 + len), Math.sin(a) * (r * 0.85 + len));
        g.stroke();
      }
      break;
    case 'horror':
      g.beginPath(); g.ellipse(r * 0.9, 0, r * 0.4, r * 0.34, 0, 0, TAU);
      g.fillStyle = 'rgba(24, 4, 10, 0.95)'; g.fill();
      g.fillStyle = 'rgba(255,255,255,0.9)';
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * TAU + t * 0.4;
        g.beginPath();
        g.moveTo(r * 0.9 + Math.cos(a) * r * 0.36, Math.sin(a) * r * 0.32);
        g.lineTo(r * 0.9 + Math.cos(a + 0.28) * r * 0.36, Math.sin(a + 0.28) * r * 0.32);
        g.lineTo(r * 0.9 + Math.cos(a + 0.14) * r * 0.1, Math.sin(a + 0.14) * r * 0.09);
        g.closePath(); g.fill();
      }
      break;
    default: break;
  }
}

// ------------------------------------------------------------------
// Полная отрисовка существа.
// o: { shape, color, color2, r, t, phase, seed, parts, mouth, flash, cloak,
//      hpRatio, isPlayer, glow, aura, paralyzed }
// ------------------------------------------------------------------
export function drawCell(g, o) {
  const r = o.r, t = o.t ?? 0, seed = o.seed ?? 1, phase = o.phase ?? 0;
  const color = o.color ?? '#7fe7ff', color2 = o.color2 ?? '#ffffff';
  const parts = o.parts ?? {};
  g.save();
  if (o.cloak) g.globalAlpha *= 0.38;
  if (o.dead) g.globalAlpha *= clamp(1 - (o.deadT ?? 0) * 2.2, 0, 1);
  if (o.dead) g.scale(clamp(1 - (o.deadT ?? 0) * 0.7, 0.3, 1), clamp(1 - (o.deadT ?? 0) * 0.7, 0.3, 1));

  // --- внешнее свечение
  if (o.glow) {
    const grd = g.createRadialGradient(0, 0, r * 0.6, 0, 0, r * (1.9 + o.glow * 0.25));
    grd.addColorStop(0, rgba(color2, 0.28 * o.glow));
    grd.addColorStop(0.5, rgba(color, 0.14 * o.glow));
    grd.addColorStop(1, rgba(color, 0));
    g.fillStyle = grd; g.beginPath(); g.arc(0, 0, r * (1.9 + o.glow * 0.25), 0, TAU); g.fill();
  }

  // --- аура (яд, споры, лёд)
  if (o.aura) {
    const grd = g.createRadialGradient(0, 0, r * 0.8, 0, 0, o.aura.radius);
    grd.addColorStop(0, rgba(o.aura.color, 0.22));
    grd.addColorStop(1, rgba(o.aura.color, 0));
    g.fillStyle = grd; g.beginPath(); g.arc(0, 0, o.aura.radius, 0, TAU); g.fill();
  }

  // --- задний слой органелл
  const drawParts = (layer) => {
    for (const id in parts) {
      const p = PARTS[id]; if (!p) continue;
      if (!p.layers.includes(layer)) continue;
      g.save();
      p.draw(g, { r, color, lvl: parts[id], t: t + (id.length % 3) * 0.3, seed, phase });
      g.restore();
    }
  };
  drawParts('back');

  // --- тело
  bodyPath(g, o.shape ?? 'coccus', r, t, seed, phase);
  const bg = g.createRadialGradient(-r * 0.3, -r * 0.35, r * 0.1, 0, 0, r * 1.25);
  bg.addColorStop(0, rgba(shade(color, 0.45), 0.99));
  bg.addColorStop(0.55, rgba(color, 0.92));
  bg.addColorStop(1, rgba(shade(color, -0.35), 0.95));
  g.fillStyle = bg; g.fill();
  g.strokeStyle = rgba(color2, o.isPlayer ? 0.85 : 0.6);
  g.lineWidth = Math.max(1.2, r * (o.isPlayer ? 0.09 : 0.06));
  g.stroke();

  // --- ядро и внутренние гранулы
  const nx = -r * 0.12, ny = -r * 0.06;
  g.beginPath(); g.ellipse(nx, ny, r * 0.34, r * 0.28, 0.3, 0, TAU);
  g.fillStyle = rgba(shade(color, -0.55), 0.75); g.fill();
  g.beginPath(); g.ellipse(nx - r * 0.05, ny - r * 0.05, r * 0.13, r * 0.1, 0.3, 0, TAU);
  g.fillStyle = rgba(color2, 0.3); g.fill();
  const grains = 3 + Math.round((seed % 4));
  for (let i = 0; i < grains; i++) {
    const a = hash01(seed + i * 91) * TAU, d = r * (0.35 + hash01(seed + i * 7) * 0.4);
    g.beginPath(); g.arc(Math.cos(a) * d, Math.sin(a) * d, r * (0.05 + hash01(seed + i * 3) * 0.05), 0, TAU);
    g.fillStyle = rgba(color2, 0.28); g.fill();
  }

  bodyExtra(g, o.shape ?? 'coccus', r, t, color, color2, seed);

  // --- средний слой и рот
  drawParts('body');
  if (o.mouth && o.mouth !== 'none') drawMouth(g, o.mouth, r, t, color);

  // --- передний слой
  drawParts('front');

  // --- вспышка урона
  if (o.flash > 0) {
    bodyPath(g, o.shape ?? 'coccus', r, t, seed, phase);
    g.fillStyle = `rgba(255,${Math.round(60 * (1 - o.flash))},60,${0.72 * o.flash})`;
    g.fill();
  }
  // --- эффект паралича
  if (o.paralyzed) {
    g.strokeStyle = `rgba(255,240,150,${0.5 + Math.sin(t * 22) * 0.4})`;
    g.lineWidth = Math.max(1.4, r * 0.08);
    g.beginPath();
    for (let i = 0; i < 7; i++) {
      const a = hash01(i * 13 + seed) * TAU, d = r * (0.7 + hash01(i * 5) * 0.6);
      g.moveTo(0, 0); g.lineTo(Math.cos(a) * d, Math.sin(a) * d);
    }
    g.stroke();
  }
  // --- эффект отравления
  if (o.poisoned) {
    g.fillStyle = 'rgba(200, 255, 90, 0.55)';
    for (let i = 0; i < 4; i++) {
      const a = t * 1.6 + i * 1.7, d = r * (0.8 + Math.sin(t * 4 + i) * 0.15);
      g.beginPath(); g.arc(Math.cos(a) * d, Math.sin(a) * d, r * 0.11, 0, TAU); g.fill();
    }
  }
  g.restore();
}

// ------------------------------------------------------------------
// Пища и биомасса
// ------------------------------------------------------------------
export function drawFood(g, kind, x, y, t, seed, scale = 1) {
  const r = kind.r * scale;
  const pulse = 1 + Math.sin(t * 2.4 + seed) * 0.14;
  const s = seed % 100;

  // свечение-ореол
  const grd = g.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.1, x, y, r * 2.1 * pulse);
  grd.addColorStop(0, rgba(kind.color2, 0.9));
  grd.addColorStop(0.4, rgba(kind.color, 0.55));
  grd.addColorStop(1, rgba(kind.color, 0));
  g.fillStyle = grd;
  g.beginPath(); g.arc(x, y, r * 2.1 * pulse, 0, TAU); g.fill();

  const rot = t * 0.35 + s * 0.13;

  if (kind === FOOD_KINDS.plant) {
    // цепочка из трёх долек (диатомея)
    for (let i = -1; i <= 1; i++) {
      const px = x + i * r * 1.15 * Math.cos(rot), py = y + i * r * 1.15 * Math.sin(rot);
      g.beginPath(); g.ellipse(px, py, r * 0.78 * pulse, r * 0.52 * pulse, rot, 0, TAU);
      g.fillStyle = rgba(kind.color2, 0.95); g.fill();
      g.strokeStyle = rgba(kind.color, 0.85); g.lineWidth = Math.max(0.7, r * 0.22); g.stroke();
    }
  } else if (kind === FOOD_KINDS.algae) {
    // гроздь пузырьков
    for (let i = 0; i < 3; i++) {
      const a = rot + i * 2.1;
      const px = x + Math.cos(a) * r * 0.62, py = y + Math.sin(a) * r * 0.62;
      g.beginPath(); g.arc(px, py, r * (0.55 + (i % 2) * 0.2) * pulse, 0, TAU);
      g.fillStyle = rgba(kind.color2, 0.92); g.fill();
      g.strokeStyle = rgba(kind.color, 0.8); g.lineWidth = Math.max(0.7, r * 0.2); g.stroke();
    }
  } else if (kind === FOOD_KINDS.crystal) {
    // кристалл-ромб
    g.save(); g.translate(x, y); g.rotate(rot);
    g.beginPath();
    g.moveTo(0, -r * 1.15 * pulse); g.lineTo(r * 0.8 * pulse, 0); g.lineTo(0, r * 1.15 * pulse); g.lineTo(-r * 0.8 * pulse, 0);
    g.closePath();
    const cg = g.createLinearGradient(-r, -r, r, r);
    cg.addColorStop(0, rgba(kind.color2, 0.95)); cg.addColorStop(1, rgba(kind.color, 0.85));
    g.fillStyle = cg; g.fill();
    g.strokeStyle = rgba('#ffffff', 0.5); g.lineWidth = 1; g.stroke();
    g.restore();
  } else if (kind === FOOD_KINDS.spore) {
    // мягкая спора с вкраплениями
    g.beginPath(); g.arc(x, y, r * 1.05 * pulse, 0, TAU);
    g.fillStyle = rgba(kind.color, 0.55); g.fill();
    g.strokeStyle = rgba(kind.color2, 0.75); g.lineWidth = 1.4; g.stroke();
    for (let i = 0; i < 4; i++) {
      const a = rot + i * 1.7;
      g.beginPath(); g.arc(x + Math.cos(a) * r * 0.5, y + Math.sin(a) * r * 0.5, r * 0.2, 0, TAU);
      g.fillStyle = rgba(kind.color2, 0.9); g.fill();
    }
  } else if (kind === FOOD_KINDS.chunk) {
    // бесформенный кусок плоти
    g.beginPath();
    for (let i = 0; i <= 9; i++) {
      const a = (i / 9) * TAU;
      const rr = r * (0.8 + hash01(s + i * 13) * 0.6) * pulse;
      const px = x + Math.cos(a + rot * 0.4) * rr, py = y + Math.sin(a + rot * 0.4) * rr * 0.9;
      i ? g.lineTo(px, py) : g.moveTo(px, py);
    }
    g.closePath();
    g.fillStyle = rgba(kind.color, 0.95); g.fill();
    g.strokeStyle = rgba(kind.color2, 0.6); g.lineWidth = 1.2; g.stroke();
    g.beginPath(); g.arc(x - r * 0.25, y - r * 0.2, r * 0.22, 0, TAU);
    g.fillStyle = rgba('#fff0ec', 0.5); g.fill();
  } else if (kind.relic) {
    // реликтовый ген: вращающийся символ
    g.save(); g.translate(x, y); g.rotate(t * 0.7);
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * TAU;
      const rr = r * (i % 2 ? 0.55 : 1.25) * (1 + Math.sin(t * 3 + i) * 0.08);
      const px = Math.cos(a) * rr, py = Math.sin(a) * rr;
      i ? g.lineTo(px, py) : g.moveTo(px, py);
    }
    g.closePath();
    g.fillStyle = rgba(kind.color, 0.9); g.fill();
    g.strokeStyle = rgba('#ffffff', 0.85); g.lineWidth = 2; g.stroke();
    g.restore();
    g.beginPath(); g.arc(x, y, r * 0.35 + Math.sin(t * 4) * 1.2, 0, TAU);
    g.fillStyle = '#ffffff'; g.fill();
  } else {
    // кладка ДНК и прочее
    g.save(); g.translate(x, y); g.rotate(t * 0.5);
    g.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * TAU;
      const px = Math.cos(a) * r * pulse, py = Math.sin(a) * r * pulse;
      i ? g.lineTo(px, py) : g.moveTo(px, py);
    }
    g.closePath();
    g.fillStyle = rgba(kind.color2, 0.95); g.fill();
    g.strokeStyle = rgba(kind.color, 0.9); g.lineWidth = Math.max(0.9, r * 0.22); g.stroke();
    g.restore();
  }
}

// ------------------------------------------------------------------
// Частицы: брызги, кровь, пузырьки, искры, кольца
// ------------------------------------------------------------------
export function drawParticle(g, p) {
  const a = clamp(p.life / p.maxLife, 0, 1);
  if (p.kind === 'ring') {
    g.strokeStyle = rgba(p.color, a * 0.8);
    g.lineWidth = Math.max(1, p.size * 0.3 * a);
    g.beginPath(); g.arc(p.x, p.y, p.size * (1.6 - a), 0, TAU); g.stroke();
    return;
  }
  if (p.kind === 'bubble') {
    g.strokeStyle = rgba(p.color, a * 0.6);
    g.lineWidth = 1.2;
    g.beginPath(); g.arc(p.x, p.y, p.size, 0, TAU); g.stroke();
    g.fillStyle = rgba(p.color, a * 0.12); g.fill();
    return;
  }
  if (p.kind === 'spark') {
    g.strokeStyle = rgba(p.color, a);
    g.lineWidth = Math.max(1, p.size * 0.35);
    g.beginPath(); g.moveTo(p.x, p.y);
    g.lineTo(p.x - p.vx * 0.02, p.y - p.vy * 0.02); g.stroke();
    return;
  }
  g.fillStyle = rgba(p.color, a * (p.kind === 'goo' ? 0.85 : 1));
  g.beginPath(); g.arc(p.x, p.y, p.size * (p.kind === 'goo' ? a : 1), 0, TAU); g.fill();
}

// ------------------------------------------------------------------
// Иконка вида для бестиария (рисует мини-клетку в круглом «портрете»).
// ------------------------------------------------------------------
export function drawPortrait(g, sp, size, t = 0) {
  g.clearRect(0, 0, size, size);
  const grd = g.createRadialGradient(size / 2, size / 2, 2, size / 2, size / 2, size / 2);
  grd.addColorStop(0, '#0d3247'); grd.addColorStop(1, '#04141f');
  g.fillStyle = grd; g.fillRect(0, 0, size, size);
  g.save();
  g.translate(size / 2, size / 2);
  g.scale(0.78, 0.78);
  const r = size * 0.3;
  drawCell(g, {
    shape: sp.shape, color: sp.color, color2: sp.color2, r, t, seed: sp.id.length * 7 + 3,
    parts: sp.parts, mouth: sp.mouth, isPlayer: false, glow: sp.parts?.luciferin ? 1 : 0,
  });
  g.restore();
  g.strokeStyle = 'rgba(126,232,255,0.25)'; g.lineWidth = 2;
  g.beginPath(); g.arc(size / 2, size / 2, size / 2 - 1, 0, TAU); g.stroke();
}
