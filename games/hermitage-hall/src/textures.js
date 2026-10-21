// Процедурные текстуры зала. Никаких внешних ассетов: всё рисуется на canvas.
// Зерно детерминированное, чтобы кадры в тестах совпадали.

import * as THREE from 'three';

export function mulberry32(seed) {
  let a = seed >>> 0;
  return function random() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Плотность процедурных текстур: на лёгкой графике рисуем вдвое мельче.
let textureScale = 1;

export function setTextureScale(scale) {
  textureScale = Math.max(0.35, Math.min(1, scale || 1));
}

function canvas2d(w, h) {
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(64, Math.round(w * textureScale));
  canvas.height = Math.max(64, Math.round(h * textureScale));
  const ctx = canvas.getContext('2d');
  return { canvas, ctx };
}

function finish(canvas, { repeat = [1, 1], srgb = true, anisotropy = 8 } = {}) {
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(repeat[0], repeat[1]);
  texture.anisotropy = anisotropy;
  if (srgb) texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

/** Наборный паркет: клетки с косой настилкой, тёплый орех. */
export function parquetTexture(seed = 7) {
  const size = 1024;
  const cells = 3;
  const { canvas, ctx } = canvas2d(size, size);
  const rnd = mulberry32(seed);
  const cell = size / cells;
  ctx.fillStyle = '#4d341f';
  ctx.fillRect(0, 0, size, size);

  const plank = (x, y, w, h, tone, angle) => {
    ctx.save();
    ctx.translate(x + w / 2, y + h / 2);
    ctx.rotate(angle);
    const g = ctx.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2);
    g.addColorStop(0, tone[0]);
    g.addColorStop(0.5, tone[1]);
    g.addColorStop(1, tone[2]);
    ctx.fillStyle = g;
    ctx.fillRect(-w / 2, -h / 2, w, h);
    // волокна древесины
    ctx.globalAlpha = 0.22;
    for (let i = 0; i < 9; i += 1) {
      const yy = -h / 2 + (i + rnd() * 0.7) * (h / 9);
      ctx.strokeStyle = rnd() > 0.5 ? '#2f1d0f' : '#8a5f38';
      ctx.lineWidth = 0.8 + rnd() * 1.4;
      ctx.beginPath();
      ctx.moveTo(-w / 2, yy);
      ctx.bezierCurveTo(-w / 6, yy + (rnd() - 0.5) * 5, w / 6, yy + (rnd() - 0.5) * 5, w / 2, yy + (rnd() - 0.5) * 3);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    // тёмный шов
    ctx.strokeStyle = 'rgba(24,14,6,0.85)';
    ctx.lineWidth = 3;
    ctx.strokeRect(-w / 2, -h / 2, w, h);
    ctx.restore();
  };

  const tone = () => {
    const warm = 0.86 + rnd() * 0.24;
    const r = Math.round(126 * warm);
    const g = Math.round(88 * warm);
    const b = Math.round(54 * warm);
    return [`rgb(${r + 16},${g + 12},${b + 8})`, `rgb(${r},${g},${b})`, `rgb(${r - 18},${g - 14},${b - 10})`];
  };

  for (let i = 0; i < cells; i += 1) {
    for (let j = 0; j < cells; j += 1) {
      const x = i * cell;
      const y = j * cell;
      // рамка клетки — четыре узкие планки
      const bw = cell * 0.17;
      plank(x, y, cell, bw, tone(), 0);
      plank(x, y + cell - bw, cell, bw, tone(), 0);
      plank(x, y + bw, bw, cell - bw * 2, tone(), Math.PI / 2);
      plank(x + cell - bw, y + bw, bw, cell - bw * 2, tone(), Math.PI / 2);
      // внутренняя косая настилка
      const ix = x + bw;
      const iy = y + bw;
      const iw = cell - bw * 2;
      const n = 5;
      const step = (iw * 2) / n;
      for (let k = -n; k < n; k += 1) {
        const px = ix + k * step * 0.5;
        ctx.save();
        ctx.beginPath();
        ctx.rect(ix, iy, iw, iw);
        ctx.clip();
        plank(px, iy - iw * 0.2, iw * 0.34, iw * 1.5, tone(), Math.PI / 4);
        ctx.restore();
      }
    }
  }
  return finish(canvas, { repeat: [3, 2.2] });
}

/** Шёлк на стенах: глубокий зелёный с тиснёным ромбом и мелким узором. */
export function silkTexture(seed = 11) {
  const size = 512;
  const { canvas, ctx } = canvas2d(size, size);
  const rnd = mulberry32(seed);
  const g = ctx.createLinearGradient(0, 0, 0, size);
  g.addColorStop(0, '#22463a');
  g.addColorStop(0.5, '#1b3b31');
  g.addColorStop(1, '#183429');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);

  // тиснёный ромб
  const cell = size / 2;
  for (let i = 0; i < 2; i += 1) {
    for (let j = 0; j < 2; j += 1) {
      const cx = i * cell + cell / 2;
      const cy = j * cell + cell / 2;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(Math.PI / 4);
      ctx.strokeStyle = 'rgba(126,168,132,0.30)';
      ctx.lineWidth = 5;
      ctx.strokeRect(-cell * 0.32, -cell * 0.32, cell * 0.64, cell * 0.64);
      ctx.strokeStyle = 'rgba(10,24,18,0.35)';
      ctx.lineWidth = 2;
      ctx.strokeRect(-cell * 0.27, -cell * 0.27, cell * 0.54, cell * 0.54);
      // цветочная розетка
      for (let k = 0; k < 8; k += 1) {
        ctx.rotate(Math.PI / 4);
        ctx.beginPath();
        ctx.ellipse(0, -cell * 0.16, cell * 0.045, cell * 0.1, 0, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(150,186,150,0.24)';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.arc(0, 0, cell * 0.035, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(168,196,150,0.35)';
      ctx.fill();
      ctx.restore();
    }
  }
  // тканевое зерно
  ctx.globalAlpha = 0.18;
  for (let i = 0; i < 4200; i += 1) {
    ctx.fillStyle = rnd() > 0.5 ? '#2f5a48' : '#122b22';
    ctx.fillRect(rnd() * size, rnd() * size, 1.2, 1.2);
  }
  ctx.globalAlpha = 1;
  return finish(canvas, { repeat: [5, 2.4] });
}

/** Белый мрамор с серыми прожилками — для камина, плинтов и колонн. */
export function marbleTexture(seed = 23) {
  const size = 512;
  const { canvas, ctx } = canvas2d(size, size);
  const rnd = mulberry32(seed);
  ctx.fillStyle = '#efeee6';
  ctx.fillRect(0, 0, size, size);
  for (let i = 0; i < 26; i += 1) {
    ctx.beginPath();
    let x = rnd() * size;
    let y = rnd() * size;
    ctx.moveTo(x, y);
    const steps = 8 + Math.floor(rnd() * 10);
    for (let s = 0; s < steps; s += 1) {
      x += (rnd() - 0.5) * 90;
      y += (rnd() - 0.3) * 60;
      ctx.lineTo(x, y);
    }
    ctx.strokeStyle = `rgba(${120 + rnd() * 50},${120 + rnd() * 50},${118 + rnd() * 45},${0.10 + rnd() * 0.16})`;
    ctx.lineWidth = 0.6 + rnd() * 2.6;
    ctx.stroke();
  }
  ctx.globalAlpha = 0.1;
  for (let i = 0; i < 2400; i += 1) {
    ctx.fillStyle = rnd() > 0.5 ? '#ffffff' : '#b9b6ad';
    ctx.fillRect(rnd() * size, rnd() * size, 1.4, 1.4);
  }
  ctx.globalAlpha = 1;
  return finish(canvas, { repeat: [1, 1] });
}

/** Малахит: концентрические зелёные полосы для плинта бюста Гомера. */
export function malachiteTexture(seed = 31) {
  const size = 512;
  const { canvas, ctx } = canvas2d(size, size);
  const rnd = mulberry32(seed);
  ctx.fillStyle = '#2f8a5c';
  ctx.fillRect(0, 0, size, size);
  for (let i = 0; i < 40; i += 1) {
    const y = (i / 40) * size + (rnd() - 0.5) * 8;
    ctx.beginPath();
    ctx.moveTo(0, y);
    for (let x = 0; x <= size; x += 16) {
      ctx.lineTo(x, y + Math.sin((x / size) * Math.PI * (2 + rnd() * 3) + i) * (5 + rnd() * 9));
    }
    ctx.strokeStyle = i % 2 ? 'rgba(168,232,190,0.62)' : 'rgba(28,110,72,0.85)';
    ctx.lineWidth = 2 + rnd() * 8;
    ctx.stroke();
  }
  return finish(canvas, { repeat: [1, 1] });
}

/**
 * Малахитовое поле над камином. Крупнее и спокойнее, чем у плинта: доска висит
 * высоко и смотрится издалека, поэтому мелкие контрастные полосы давали бы
 * рябь даже после исправления z-fighting.
 */
export function malachitePanelTexture(seed = 37) {
  const size = 1024;
  const { canvas, ctx } = canvas2d(size, size);
  const rnd = mulberry32(seed);
  ctx.fillStyle = '#1d5c3d';
  ctx.fillRect(0, 0, size, size);
  for (let i = 0; i < 30; i += 1) {
    const y = (i / 30) * size + (rnd() - 0.5) * 18;
    ctx.beginPath();
    ctx.moveTo(0, y);
    for (let x = 0; x <= size; x += 32) {
      ctx.lineTo(x, y + Math.sin((x / size) * Math.PI * (1.3 + rnd() * 1.6) + i * 0.7) * (16 + rnd() * 26));
    }
    ctx.strokeStyle = i % 2 ? 'rgba(122,198,150,0.30)' : 'rgba(12,66,42,0.62)';
    ctx.lineWidth = 9 + rnd() * 20;
    ctx.lineCap = 'round';
    ctx.stroke();
  }
  // мягкие светлые прожилки
  for (let i = 0; i < 18; i += 1) {
    ctx.beginPath();
    const x = rnd() * size;
    ctx.moveTo(x, 0);
    for (let y = 0; y <= size; y += 48) ctx.lineTo(x + Math.sin(y / 90 + i) * 22, y);
    ctx.strokeStyle = 'rgba(178,228,196,0.13)';
    ctx.lineWidth = 3 + rnd() * 6;
    ctx.stroke();
  }
  return finish(canvas, { repeat: [1, 1], anisotropy: 8 });
}

/** Плафон: вечернее небо с облаками и золочёной овальной рамкой. */
export function plafondTexture(seed = 41) {
  const w = 1024;
  const h = 640;
  const { canvas, ctx } = canvas2d(w, h);
  const rnd = mulberry32(seed);
  const sky = ctx.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, '#2c4a72');
  sky.addColorStop(0.45, '#5f7fa6');
  sky.addColorStop(0.72, '#c7a98a');
  sky.addColorStop(1, '#8a6a55');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < 60; i += 1) {
    const x = rnd() * w;
    const y = h * (0.15 + rnd() * 0.7);
    const rx = 40 + rnd() * 170;
    const ry = 10 + rnd() * 34;
    const cloud = ctx.createRadialGradient(x, y, 2, x, y, rx);
    cloud.addColorStop(0, `rgba(255,231,201,${0.20 + rnd() * 0.22})`);
    cloud.addColorStop(1, 'rgba(255,231,201,0)');
    ctx.fillStyle = cloud;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  // золотая овальная рамка плафона
  ctx.save();
  ctx.translate(w / 2, h / 2);
  ctx.scale(1, h / w);
  ctx.beginPath();
  ctx.arc(0, 0, w * 0.46, 0, Math.PI * 2);
  ctx.restore();
  ctx.strokeStyle = 'rgba(198,158,88,0.9)';
  ctx.lineWidth = 22;
  ctx.stroke();
  ctx.strokeStyle = 'rgba(255,228,168,0.55)';
  ctx.lineWidth = 6;
  ctx.stroke();
  return finish(canvas, { repeat: [1, 1] });
}

/** Ковёр: бордовое поле, золотая кайма и медальон. */
export function rugTexture(seed = 53) {
  const w = 768;
  const h = 512;
  const { canvas, ctx } = canvas2d(w, h);
  const rnd = mulberry32(seed);
  ctx.fillStyle = '#5e1420';
  ctx.fillRect(0, 0, w, h);
  const field = ctx.createRadialGradient(w / 2, h / 2, 40, w / 2, h / 2, w * 0.62);
  field.addColorStop(0, '#8e2a32');
  field.addColorStop(1, '#4a0e1a');
  ctx.fillStyle = field;
  ctx.fillRect(18, 18, w - 36, h - 36);
  ctx.strokeStyle = '#c9a24a';
  ctx.lineWidth = 16;
  ctx.strokeRect(26, 26, w - 52, h - 52);
  ctx.strokeStyle = '#8d6a2a';
  ctx.lineWidth = 4;
  ctx.strokeRect(52, 52, w - 104, h - 104);
  // орнамент медальона
  ctx.save();
  ctx.translate(w / 2, h / 2);
  for (let i = 0; i < 16; i += 1) {
    ctx.rotate(Math.PI / 8);
    ctx.beginPath();
    ctx.ellipse(0, -h * 0.2, 22, 74, 0, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(201,162,74,0.45)';
    ctx.lineWidth = 6;
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.arc(0, 0, 52, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(226,192,120,0.7)';
  ctx.lineWidth = 10;
  ctx.stroke();
  ctx.restore();
  // ворс
  ctx.globalAlpha = 0.16;
  for (let i = 0; i < 5000; i += 1) {
    ctx.fillStyle = rnd() > 0.5 ? '#c58a6a' : '#3d0a13';
    ctx.fillRect(rnd() * w, rnd() * h, 1.6, 1.6);
  }
  ctx.globalAlpha = 1;
  return finish(canvas, { repeat: [1, 1] });
}

/** Вид из окон: Нева в июльских сумерках, Петропавловский шпиль. */
export function windowViewTexture(seed = 61) {
  const w = 768;
  const h = 1024;
  const { canvas, ctx } = canvas2d(w, h);
  const rnd = mulberry32(seed);
  const sky = ctx.createLinearGradient(0, 0, 0, h * 0.62);
  sky.addColorStop(0, '#7f9dc4');
  sky.addColorStop(0.45, '#c9b6b0');
  sky.addColorStop(0.72, '#f0c08a');
  sky.addColorStop(1, '#f7d9ab');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h * 0.62);

  // облачные полосы
  for (let i = 0; i < 26; i += 1) {
    const y = h * (0.05 + rnd() * 0.42);
    ctx.beginPath();
    ctx.ellipse(rnd() * w, y, 60 + rnd() * 150, 6 + rnd() * 16, 0, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,230,205,${0.08 + rnd() * 0.16})`;
    ctx.fill();
  }
  // низкий город (силуэт)
  ctx.fillStyle = 'rgba(52,50,62,0.92)';
  ctx.fillRect(0, h * 0.55, w, h * 0.07);
  for (let i = 0; i < 40; i += 1) {
    const bw = 14 + rnd() * 46;
    const bh = 14 + rnd() * 52;
    const x = rnd() * w;
    ctx.fillRect(x, h * 0.55 - bh, bw, bh + 6);
    if (rnd() > 0.7) {
      ctx.fillRect(x + bw * 0.4, h * 0.55 - bh - 22, 4, 22);
    }
  }
  // Петропавловский собор со шпилем
  const cx = w * 0.62;
  ctx.fillStyle = 'rgba(44,42,55,0.95)';
  ctx.fillRect(cx - 26, h * 0.5 - 74, 52, 120);
  ctx.beginPath();
  ctx.moveTo(cx - 26, h * 0.5 - 74);
  ctx.lineTo(cx, h * 0.5 - 128);
  ctx.lineTo(cx + 26, h * 0.5 - 74);
  ctx.closePath();
  ctx.fill();
  ctx.fillRect(cx - 2, h * 0.5 - 246, 4, 122);
  ctx.beginPath();
  ctx.arc(cx, h * 0.5 - 250, 5, 0, Math.PI * 2);
  ctx.fill();

  // вода
  const water = ctx.createLinearGradient(0, h * 0.62, 0, h);
  water.addColorStop(0, '#a9a2ab');
  water.addColorStop(0.35, '#6b7f96');
  water.addColorStop(1, '#2f4358');
  ctx.fillStyle = water;
  ctx.fillRect(0, h * 0.62, w, h * 0.38);
  for (let i = 0; i < 220; i += 1) {
    const y = h * (0.62 + rnd() * 0.38);
    const ww = 10 + rnd() * 90;
    ctx.fillStyle = `rgba(255,214,168,${0.05 + rnd() * 0.22})`;
    ctx.fillRect(rnd() * w, y, ww, 2 + rnd() * 2);
  }
  return finish(canvas, { repeat: [1, 1] });
}

/** «Зеркало» над камином: потускневшее стекло с намёком на отражение зала. */
export function mirrorTexture(seed = 79) {
  const w = 512;
  const h = 512;
  const { canvas, ctx } = canvas2d(w, h);
  const rnd = mulberry32(seed);
  const g = ctx.createLinearGradient(0, 0, w * 0.6, h);
  g.addColorStop(0, '#2c3a3a');
  g.addColorStop(0.45, '#546462');
  g.addColorStop(0.75, '#3a4746');
  g.addColorStop(1, '#1d2827');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  // смутные отражения окон и золочёных рам
  for (let i = 0; i < 5; i += 1) {
    const x = 40 + i * 95 + rnd() * 20;
    const y = 150 + rnd() * 90;
    ctx.fillStyle = `rgba(255,226,178,${0.05 + rnd() * 0.08})`;
    ctx.fillRect(x, y, 60 + rnd() * 40, 120 + rnd() * 90);
  }
  ctx.fillStyle = 'rgba(214,178,110,0.10)';
  ctx.fillRect(30, 60, w - 60, 18);
  ctx.fillStyle = 'rgba(214,178,110,0.07)';
  ctx.fillRect(30, h - 120, w - 60, 26);
  // потёртости и пыль
  for (let i = 0; i < 700; i += 1) {
    ctx.fillStyle = rnd() > 0.5 ? 'rgba(255,250,235,0.05)' : 'rgba(10,16,15,0.08)';
    ctx.fillRect(rnd() * w, rnd() * h, 2 + rnd() * 5, 1 + rnd() * 2);
  }
  return finish(canvas, { repeat: [1, 1] });
}

/** Дубовые двери с золочёным набором. */
export function doorTexture(seed = 71) {
  const w = 384;
  const h = 768;
  const { canvas, ctx } = canvas2d(w, h);
  const rnd = mulberry32(seed);
  const g = ctx.createLinearGradient(0, 0, w, 0);
  g.addColorStop(0, '#4a2c16');
  g.addColorStop(0.5, '#63391c');
  g.addColorStop(1, '#432712');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < 260; i += 1) {
    ctx.strokeStyle = `rgba(${20 + rnd() * 40},${12 + rnd() * 20},${6 + rnd() * 12},0.5)`;
    ctx.lineWidth = 1 + rnd() * 2;
    const y = rnd() * h;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(w * 0.3, y + (rnd() - 0.5) * 18, w * 0.7, y + (rnd() - 0.5) * 18, w, y);
    ctx.stroke();
  }
  const panel = (x, y, pw, ph) => {
    ctx.strokeStyle = '#c9a24a';
    ctx.lineWidth = 6;
    ctx.strokeRect(x, y, pw, ph);
    ctx.strokeStyle = 'rgba(30,16,6,0.8)';
    ctx.lineWidth = 2;
    ctx.strokeRect(x + 9, y + 9, pw - 18, ph - 18);
  };
  panel(26, 26, w - 52, h * 0.3);
  panel(26, h * 0.36, w - 52, h * 0.28);
  panel(26, h * 0.68, w - 52, h * 0.26);
  return finish(canvas, { repeat: [1, 1] });
}

/** Табличка под картиной: латунь, гравировка. */
/** Тёплое пятно света вокруг рамы: заменяет прожектор над полотном. */
export function lightPoolTexture() {
  const size = 256;
  const { canvas, ctx } = canvas2d(size, size);
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, 'rgba(255, 238, 206, 0.9)');
  gradient.addColorStop(0.42, 'rgba(255, 222, 176, 0.34)');
  gradient.addColorStop(0.75, 'rgba(255, 214, 164, 0.09)');
  gradient.addColorStop(1, 'rgba(255, 210, 160, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const texture = finish(canvas, { anisotropy: 1 });
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

export function plaqueTexture(lines, { width = 1024, height = 512, align = 'center' } = {}) {
  const { canvas, ctx } = canvas2d(width, height);
  const bg = ctx.createLinearGradient(0, 0, width, height);
  bg.addColorStop(0, '#9c8348');
  bg.addColorStop(0.35, '#d8bc77');
  bg.addColorStop(0.6, '#b8974f');
  bg.addColorStop(1, '#8b7439');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = 'rgba(58,44,18,0.8)';
  ctx.lineWidth = 10;
  ctx.strokeRect(12, 12, width - 24, height - 24);
  ctx.fillStyle = '#2c2413';
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  const x = align === 'center' ? width / 2 : 54;
  const sizes = [52, 40, 32, 28];
  let y = height * 0.2;
  lines.forEach((line, i) => {
    ctx.font = `${i === 0 ? '600' : '400'} ${sizes[Math.min(i, sizes.length - 1)]}px "Georgia", "Times New Roman", serif`;
    ctx.fillText(line, x, y);
    y += sizes[Math.min(i, sizes.length - 1)] * 1.42;
  });
  ctx.strokeStyle = 'rgba(255,244,208,0.45)';
  ctx.lineWidth = 3;
  ctx.strokeRect(20, 20, width - 40, height - 40);
  return finish(canvas, { repeat: [1, 1] });
}

/** Медальон точки осмотра: латунь с номером и кольцом. */
export function medallionTexture(number) {
  const size = 512;
  const { canvas, ctx } = canvas2d(size, size);
  ctx.clearRect(0, 0, size, size);
  const g = ctx.createRadialGradient(size * 0.4, size * 0.35, 20, size / 2, size / 2, size * 0.5);
  g.addColorStop(0, '#e9d6a0');
  g.addColorStop(0.55, '#c3a45f');
  g.addColorStop(1, '#7c6229');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size * 0.47, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(58,44,18,0.75)';
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size * 0.41, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = '#3a2d14';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '600 210px Georgia, "Times New Roman", serif';
  ctx.fillText(String(number), size / 2, size * 0.53);
  return finish(canvas, { repeat: [1, 1] });
}

/** Нейтральная карта шероховатости для золота/дерева. */
export function grainTexture(seed = 83, base = 150, spread = 60) {
  const size = 256;
  const { canvas, ctx } = canvas2d(size, size);
  const rnd = mulberry32(seed);
  const img = ctx.createImageData(size, size);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = base + (rnd() - 0.5) * spread;
    img.data[i] = v;
    img.data[i + 1] = v;
    img.data[i + 2] = v;
    img.data[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  return finish(canvas, { repeat: [4, 4], srgb: false });
}
