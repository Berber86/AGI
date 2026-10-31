// Анимации «оживления» собранных картинок. Каждая — чистая функция кадра (ctx, W, H, t),
// поэтому её легко ставить на паузу и проверять скриншотами в любой момент времени.
import { drawCube, cubesOf, layoutPicture, roundRect, star } from './draw.js';

const clamp01 = (x) => Math.max(0, Math.min(1, x));
const easeOut = (x) => 1 - Math.pow(1 - clamp01(x), 3);
const easeIn = (x) => Math.pow(clamp01(x), 2.2);
const easeOutBack = (x) => {
  const c1 = 1.9;
  const c3 = c1 + 1;
  const p = clamp01(x) - 1;
  return 1 + c3 * p * p * p + c1 * p * p;
};
const lerp = (a, b, k) => a + (b - a) * k;
const mix = (c1, c2, k) => {
  const p = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
  const a = p(c1);
  const b = p(c2);
  return `rgb(${a.map((v, i) => Math.round(lerp(v, b[i], k))).join(',')})`;
};
// Детерминированный «случайный» генератор для звёзд, пузырей и т.п.
const hash = (n) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/** Время появления: кубики «выпрыгивают» по очереди. */
function intro(cubes) {
  return 0.35 + cubes.length * 0.11;
}
function popScale(t, i) {
  return easeOutBack((t - 0.15 - i * 0.11) / 0.38);
}

function sky(ctx, W, H, top, bottom) {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, top);
  g.addColorStop(1, bottom);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
}

function ground(ctx, W, H, y, color, color2) {
  const g = ctx.createLinearGradient(0, y, 0, H);
  g.addColorStop(0, color);
  g.addColorStop(1, color2);
  ctx.fillStyle = g;
  ctx.fillRect(0, y, W, H - y);
}

function cloud(ctx, x, y, s) {
  ctx.fillStyle = 'rgba(255,255,255,0.92)';
  ctx.beginPath();
  ctx.arc(x, y, s * 0.5, 0, Math.PI * 2);
  ctx.arc(x + s * 0.5, y - s * 0.2, s * 0.6, 0, Math.PI * 2);
  ctx.arc(x + s * 1.1, y, s * 0.45, 0, Math.PI * 2);
  ctx.fill();
}

function puff(ctx, x, y, r, a, color = '235,235,240') {
  ctx.fillStyle = `rgba(${color},${a})`;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function placeCubes(picture, W, H, box = { x: 0.2, y: 0.18, w: 0.6, h: 0.55 }, maxCube = 0.17) {
  return layoutPicture(picture, W * box.x, H * box.y, W * box.w, H * box.h, W * maxCube);
}

// ---------------------------------------------------------------- светофор
function traffic(ctx, W, H, t, picture) {
  sky(ctx, W, H, '#9fdcff', '#e8f7ff');
  cloud(ctx, ((t * 18) % (W + 200)) - 100, H * 0.12, W * 0.09);
  const roadY = H * 0.8;
  ground(ctx, W, H, roadY - H * 0.04, '#cfd6dc', '#cfd6dc');
  ground(ctx, W, H, roadY, '#5b6470', '#454c56');
  ctx.fillStyle = '#fff';
  for (let x = -((t * 120) % 80); x < W; x += 80) ctx.fillRect(x, roadY + H * 0.09, 40, H * 0.012);

  const cubes = cubesOf(picture).sort((a, b) => a.r - b.r);
  const L = placeCubes(picture, W, H, { x: 0.25, y: 0.1, w: 0.5, h: 0.55 }, 0.2);
  const [x0, y0] = L.at(0, 0);
  const [, y1] = L.at(L.rows - 1, 0);
  // Столб и корпус.
  ctx.fillStyle = '#3a3f4a';
  ctx.fillRect(x0 - L.pitch * 0.09, y1, L.pitch * 0.18, roadY - y1);
  roundRect(ctx, x0 - L.pitch * 0.62, y0 - L.pitch * 0.62, L.pitch * 1.24, y1 - y0 + L.pitch * 1.24, L.pitch * 0.3);
  ctx.fillStyle = '#2b2f38';
  ctx.fill();
  const T0 = intro(cubes);
  const ta = t - T0;
  const k = easeOut(ta / 0.5);
  const phase = ta > 0 ? Math.floor(ta / 1.2) % cubes.length : -1;
  cubes.forEach((cube, i) => {
    const [cx, cy] = L.at(cube.r, cube.c);
    const active = phase === i;
    drawCube(ctx, cx, cy, L.s * popScale(t, i), cube.key, {
      dim: active ? 0 : k,
      glow: active ? 0.9 + 0.3 * Math.sin(t * 9) : 0,
    });
  });
  // На зелёный проезжает машинка.
  const green = cubes.findIndex((c) => c.key === 'G');
  if (phase === green && green >= 0) {
    const p = (ta % 1.2) / 1.2;
    const cx = lerp(-W * 0.2, W * 1.2, p);
    const cy = roadY + H * 0.055;
    const s = W * 0.12;
    ctx.fillStyle = '#ff5a8a';
    roundRect(ctx, cx - s, cy - s * 0.45, s * 2, s * 0.5, s * 0.15);
    ctx.fill();
    roundRect(ctx, cx - s * 0.55, cy - s * 0.8, s * 1.1, s * 0.45, s * 0.15);
    ctx.fill();
    ctx.fillStyle = '#bfe6ff';
    ctx.fillRect(cx - s * 0.4, cy - s * 0.7, s * 0.8, s * 0.28);
    ctx.fillStyle = '#222';
    for (const dx of [-0.6, 0.6]) {
      ctx.beginPath();
      ctx.arc(cx + dx * s, cy + s * 0.08, s * 0.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

// ---------------------------------------------------------------- змейка
function snake(ctx, W, H, t, picture) {
  sky(ctx, W, H, '#c8f2a8', '#7fcf63');
  for (let i = 0; i < 14; i++) {
    const x = hash(i) * W;
    const y = H * (0.15 + hash(i + 40) * 0.8);
    ctx.fillStyle = ['#ffef6b', '#ffffff', '#ff9ccf'][i % 3];
    for (let a = 0; a < 5; a++) {
      ctx.beginPath();
      ctx.arc(x + Math.cos(a * 1.256) * 7, y + Math.sin(a * 1.256) * 7, 5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = '#ffb000';
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  }
  const cubes = cubesOf(picture);
  const chain = (picture.chain || cubes.map((c) => [c.r, c.c])).map(([r, c]) => cubes.find((q) => q.r === r && q.c === c));
  const L = placeCubes(picture, W, H, { x: 0.2, y: 0.25, w: 0.6, h: 0.45 }, 0.18);
  const T0 = intro(cubes);
  const ta = Math.max(0, t - T0);
  const morph = easeOut(ta / 0.9);
  const speed = W * 0.16;
  const span = W + L.pitch * chain.length * 2;
  const headX = ((W * 0.5 + L.pitch * chain.length * 0.5 + ta * speed) % span) - L.pitch * chain.length;
  const pathY = (x) => H * 0.5 + Math.sin(x / (L.pitch * 1.6) - ta * 3.2) * L.pitch * 0.55;
  const n = chain.length;
  chain.forEach((cube, i) => {
    const fromHead = n - 1 - i;
    const px = headX - fromHead * L.pitch * 0.95;
    const py = pathY(px);
    const [sx, sy] = L.at(cube.r, cube.c);
    const x = lerp(sx, px, morph);
    const y = lerp(sy, py, morph);
    const tilt = Math.atan2(pathY(px + 2) - pathY(px - 2), 4) * morph;
    drawCube(ctx, x, y, L.s * popScale(t, cubes.indexOf(cube)), cube.key, { rot: tilt });
    if (i === n - 1 && t > T0) {
      // Глазки и язычок.
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(tilt);
      for (const ey of [-0.18, 0.18]) {
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(L.s * 0.18, ey * L.s, L.s * 0.13, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#111';
        ctx.beginPath();
        ctx.arc(L.s * 0.22, ey * L.s, L.s * 0.06, 0, Math.PI * 2);
        ctx.fill();
      }
      if (Math.sin(t * 7) > 0.2) {
        ctx.strokeStyle = '#e8322f';
        ctx.lineWidth = L.s * 0.06;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(L.s * 0.5, 0);
        ctx.lineTo(L.s * 0.85, 0);
        ctx.lineTo(L.s * 0.98, -L.s * 0.1);
        ctx.moveTo(L.s * 0.85, 0);
        ctx.lineTo(L.s * 0.98, L.s * 0.1);
        ctx.stroke();
      }
      ctx.restore();
    }
  });
}

// ---------------------------------------------------------------- цветок
function bee(ctx, x, y, s, t) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  const wf = Math.abs(Math.sin(t * 30));
  ctx.beginPath();
  ctx.ellipse(-s * 0.15, -s * 0.5, s * 0.3, s * 0.45 * wf + 2, -0.4, 0, Math.PI * 2);
  ctx.ellipse(s * 0.2, -s * 0.5, s * 0.3, s * 0.45 * wf + 2, 0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffcf1f';
  ctx.beginPath();
  ctx.ellipse(0, 0, s * 0.55, s * 0.38, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#222';
  ctx.fillRect(-s * 0.15, -s * 0.36, s * 0.12, s * 0.72);
  ctx.fillRect(s * 0.12, -s * 0.34, s * 0.12, s * 0.68);
  ctx.restore();
}

function flower(ctx, W, H, t, picture) {
  sky(ctx, W, H, '#bfe9ff', '#fff6d8');
  const gy = H * 0.78;
  ground(ctx, W, H, gy, '#8ad66b', '#55a844');
  const cubes = cubesOf(picture);
  const L = placeCubes(picture, W, H, { x: 0.2, y: 0.18, w: 0.6, h: 0.5 }, 0.2);
  const T0 = intro(cubes);
  const ta = Math.max(0, t - T0);
  const k = easeOut(ta / 0.8);
  const stem = cubes.find((c) => c.key === 'G');
  const center = cubes.find((c) => c.key === 'Y');
  const [stx, sty] = L.at(stem.r, stem.c);
  const [ccx, ccy] = L.at(center.r, center.c);
  const lift = -k * L.pitch * 0.5;
  // Стебель растёт до земли.
  ctx.strokeStyle = '#2f9a3f';
  ctx.lineWidth = L.s * 0.22;
  ctx.lineCap = 'round';
  const sway = Math.sin(ta * 1.7) * 0.12 * k;
  const pivotX = stx;
  const pivotY = gy;
  ctx.save();
  ctx.translate(pivotX, pivotY);
  ctx.rotate(sway);
  ctx.translate(-pivotX, -pivotY);
  ctx.beginPath();
  ctx.moveTo(stx, gy);
  ctx.lineTo(stx, sty + lift);
  ctx.stroke();
  // Листики.
  ctx.fillStyle = '#3fb84f';
  const leafY = lerp(gy, sty + lift, 0.45);
  for (const d of [-1, 1]) {
    ctx.beginPath();
    ctx.ellipse(stx + d * L.s * 0.45, leafY, L.s * 0.45 * k, L.s * 0.18 * k + 0.1, d * -0.5, 0, Math.PI * 2);
    ctx.fill();
  }
  const spin = ta * 0.9 * k;
  cubes.forEach((cube, i) => {
    let [x, y] = L.at(cube.r, cube.c);
    y += lift;
    let rot = 0;
    if (cube !== stem && cube !== center) {
      const dx = x - ccx;
      const dy = y - (ccy + lift);
      const bloom = 1 + 0.12 * k + 0.05 * Math.sin(ta * 4);
      x = ccx + (dx * Math.cos(spin) - dy * Math.sin(spin)) * bloom;
      y = ccy + lift + (dx * Math.sin(spin) + dy * Math.cos(spin)) * bloom;
      rot = spin;
    }
    drawCube(ctx, x, y, L.s * popScale(t, i), cube.key, { rot, glow: cube === center ? 0.4 * k : 0 });
  });
  ctx.restore();
  // Пчёлка.
  if (k > 0) {
    const bx = ccx + Math.cos(ta * 1.3) * L.pitch * 1.9;
    const by = ccy + lift + Math.sin(ta * 2.6) * L.pitch * 0.9;
    bee(ctx, bx, by, L.s * 0.45 * k, t);
  }
  for (let i = 0; i < 6; i++) {
    const a = ta * 0.6 + i;
    const p = (ta * 0.7 + hash(i)) % 1;
    star(ctx, ccx + Math.cos(a * 2) * L.pitch * 1.6 * p, ccy + lift + Math.sin(a * 2) * L.pitch * 1.6 * p, L.s * 0.12 * (1 - p) * k, '#fff59a', '#ffd21f');
  }
}

// ---------------------------------------------------------------- ракета
function rocket(ctx, W, H, t, picture) {
  sky(ctx, W, H, '#0b1440', '#3b2a78');
  const cubes = cubesOf(picture);
  const L = placeCubes(picture, W, H, { x: 0.25, y: 0.2, w: 0.5, h: 0.55 }, 0.17);
  const T0 = intro(cubes);
  const ta = Math.max(0, t - T0);
  const cyc = ta % 7;
  let dy = 0;
  let speed = 0;
  if (cyc < 1.4) dy = 0;
  else if (cyc < 3.2) {
    dy = -easeIn((cyc - 1.4) / 1.8) * H * 1.25;
    speed = (cyc - 1.4) / 1.8;
  } else if (cyc < 4.8) {
    dy = H * 1.25 * (1 - easeOut((cyc - 3.2) / 1.6));
    speed = 1 - (cyc - 3.2) / 1.6;
  } else dy = Math.sin((cyc - 4.8) * 3) * L.pitch * 0.08;
  // Звёзды летят вниз, пока ракета летит.
  const travel = ta * H * 0.08 + Math.max(0, ta - 1.4) * H * 0.25;
  for (let i = 0; i < 60; i++) {
    const x = hash(i) * W;
    const y = (hash(i + 99) * H + travel * (0.5 + hash(i + 7))) % H;
    const len = 2 + speed * 30 * (0.5 + hash(i + 7));
    ctx.fillStyle = `rgba(255,255,255,${0.4 + 0.6 * hash(i + 3)})`;
    ctx.fillRect(x, y - len, 2, len);
  }
  // Луна и площадка.
  ctx.fillStyle = '#fff4c2';
  ctx.beginPath();
  ctx.arc(W * 0.82, H * 0.12, W * 0.07, 0, Math.PI * 2);
  ctx.fill();
  const padY = H * 0.86;
  ctx.fillStyle = '#58607a';
  roundRect(ctx, W * 0.3, padY, W * 0.4, H * 0.03, 6);
  ctx.fill();
  const shake = cyc < 1.4 && ta > 0 ? Math.sin(t * 60) * L.pitch * 0.04 * (cyc / 1.4) : 0;
  // Огонь — самый нижний кубик (сопло ракеты), какого бы он ни был цвета.
  const flame = cubes.reduce((a, c) => (c.r > a.r ? c : a), cubes[0]);
  // Дым и огонь.
  if (flame && ta > 0) {
    const [fx, fy0] = L.at(flame.r, flame.c);
    const fy = fy0 + dy;
    for (let j = 0; j < 14; j++) {
      const age = (ta * 1.6 + j / 14) % 1;
      const px = fx + (hash(j) - 0.5) * L.pitch * 1.4 * age;
      const py = fy + L.pitch * 0.4 + age * L.pitch * (1.5 + speed * 3);
      puff(ctx, px, py, L.s * (0.2 + age * 0.5), 0.5 * (1 - age), age < 0.25 ? '255,190,80' : '220,220,235');
    }
  }
  cubes.forEach((cube, i) => {
    const [x, y] = L.at(cube.r, cube.c);
    const isFlame = cube === flame;
    const fl = isFlame && ta > 0 ? 1 + 0.25 * Math.sin(t * 40) + 0.2 * speed : 1;
    drawCube(ctx, x + shake, y + dy + (isFlame ? (fl - 1) * L.s * 0.5 : 0), L.s * popScale(t, i), cube.key, {
      sy: fl,
      glow: isFlame && ta > 0 ? 1 : 0,
    });
  });
  // Иллюминатор на верхнем синем кубике.
  const win = cubes.find((c) => c.key === 'B');
  if (win && t > T0) {
    const [x, y] = L.at(win.r, win.c);
    ctx.fillStyle = '#d8f3ff';
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = L.s * 0.06;
    ctx.beginPath();
    ctx.arc(x + shake, y + dy, L.s * 0.22, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
}

// ---------------------------------------------------------------- рыбка
function fish(ctx, W, H, t, picture) {
  sky(ctx, W, H, '#8fe0ff', '#1d6fc0');
  // Лучи света.
  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  for (let i = 0; i < 4; i++) {
    const x = W * (0.1 + i * 0.28) + Math.sin(t * 0.5 + i) * 20;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + W * 0.12, 0);
    ctx.lineTo(x + W * 0.3, H);
    ctx.lineTo(x + W * 0.1, H);
    ctx.fill();
  }
  // Песок и водоросли.
  ground(ctx, W, H, H * 0.88, '#f3dc9b', '#d9b96c');
  ctx.strokeStyle = '#2aa14a';
  ctx.lineCap = 'round';
  for (let i = 0; i < 7; i++) {
    const x = W * (0.05 + i * 0.15);
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(x, H * 0.9);
    for (let j = 1; j <= 6; j++) ctx.lineTo(x + Math.sin(t * 1.5 + j * 0.8 + i) * 10 * (j / 6), H * 0.9 - j * H * 0.035 * (1 + hash(i)));
    ctx.stroke();
  }
  const cubes = cubesOf(picture);
  const L = placeCubes(picture, W, H, { x: 0.15, y: 0.25, w: 0.7, h: 0.45 }, 0.17);
  const T0 = intro(cubes);
  const ta = Math.max(0, t - T0);
  const k = easeOut(ta / 0.7);
  const span = W + L.pitch * L.cols * 2;
  const shiftX = ((ta * W * 0.12 + span / 2) % span) - span / 2;
  const bob = Math.sin(ta * 1.4) * L.pitch * 0.3 * k;
  cubes.forEach((cube, i) => {
    const [x, y] = L.at(cube.r, cube.c);
    const wave = Math.sin(ta * 6 - cube.c * 0.9) * L.pitch * 0.13 * k;
    const tail = cube.c === 0 ? Math.sin(ta * 6) * 0.35 * k : 0;
    const px = x + shiftX;
    drawCube(ctx, px, y + wave + bob, L.s * popScale(t, i), cube.key, { rot: tail });
  });
  // Глаз.
  const eye = cubes.find((c) => c.key === 'P') || cubes[cubes.length - 1];
  if (t > T0) {
    const [x, y] = L.at(eye.r, eye.c);
    const px = x + shiftX;
    const wy = y + Math.sin(ta * 6 - eye.c * 0.9) * L.pitch * 0.13 * k + bob;
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(px, wy - L.s * 0.05, L.s * 0.22, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#111';
    ctx.beginPath();
    ctx.arc(px + L.s * 0.06, wy - L.s * 0.05, L.s * 0.1, 0, Math.PI * 2);
    ctx.fill();
    // Пузырьки.
    for (let j = 0; j < 8; j++) {
      const age = (ta * 0.5 + j / 8) % 1;
      const bx = px + L.s * 0.7 + Math.sin(age * 12 + j) * 8;
      const by = wy - age * H * 0.45;
      ctx.strokeStyle = `rgba(255,255,255,${0.9 * (1 - age)})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(bx, by, L.s * (0.06 + 0.1 * hash(j)), 0, Math.PI * 2);
      ctx.stroke();
    }
  }
}

// ---------------------------------------------------------------- машинка
function car(ctx, W, H, t, picture) {
  sky(ctx, W, H, '#a7e1ff', '#f2fbff');
  const cubes = cubesOf(picture);
  const T0 = intro(cubes);
  const ta = Math.max(0, t - T0);
  const k = easeOut(ta / 0.6);
  const scroll = ta * W * 0.5 * k;
  for (let i = 0; i < 3; i++) cloud(ctx, ((W * (0.2 + i * 0.4) - scroll * 0.1) % (W + 200) + W + 200) % (W + 200) - 100, H * (0.1 + i * 0.05), W * 0.08);
  // Холмы.
  ctx.fillStyle = '#8fd27a';
  ctx.beginPath();
  ctx.moveTo(0, H * 0.7);
  for (let x = 0; x <= W; x += 10) ctx.lineTo(x, H * 0.62 + Math.sin((x + scroll * 0.3) / 90) * H * 0.04);
  ctx.lineTo(W, H);
  ctx.lineTo(0, H);
  ctx.fill();
  const roadY = H * 0.72;
  ground(ctx, W, H, roadY, '#5b6470', '#3e4550');
  ctx.fillStyle = '#ffe36b';
  const dash = W * 0.18;
  for (let x = -(scroll % dash); x < W; x += dash) ctx.fillRect(x, roadY + H * 0.12, dash * 0.5, H * 0.015);
  // Деревья.
  for (let i = 0; i < 4; i++) {
    const x = (((W * 0.3 * i - scroll * 0.6) % (W * 1.2)) + W * 1.2) % (W * 1.2) - W * 0.1;
    ctx.fillStyle = '#7a5230';
    ctx.fillRect(x - 4, roadY - H * 0.08, 8, H * 0.08);
    ctx.fillStyle = '#2fa64a';
    ctx.beginPath();
    ctx.arc(x, roadY - H * 0.1, W * 0.045, 0, Math.PI * 2);
    ctx.fill();
  }
  const L = placeCubes(picture, W, H, { x: 0.15, y: 0.42, w: 0.7, h: 0.33 }, 0.17);
  const bounce = -Math.abs(Math.sin(ta * 9)) * L.pitch * 0.07 * k;
  const head = cubes.find((c) => c.key === 'Y');
  if (head && ta > 0) {
    const [hx, hy] = L.at(head.r, head.c);
    ctx.fillStyle = 'rgba(255,240,140,0.35)';
    ctx.beginPath();
    ctx.moveTo(hx + L.s * 0.4, hy + bounce);
    ctx.lineTo(W + 20, hy + bounce - L.pitch * 0.9);
    ctx.lineTo(W + 20, hy + bounce + L.pitch * 0.9);
    ctx.fill();
  }
  // Выхлоп.
  if (ta > 0) {
    const tailCube = cubes.filter((c) => c.r === 1).sort((a, b) => a.c - b.c)[0];
    const [ex, ey] = L.at(tailCube.r, tailCube.c);
    for (let j = 0; j < 6; j++) {
      const age = (ta * 1.5 + j / 6) % 1;
      puff(ctx, ex - L.s * 0.6 - age * L.pitch * 1.6, ey + L.s * 0.2 - age * L.pitch * 0.5, L.s * (0.12 + age * 0.3), 0.6 * (1 - age) * k, '200,205,215');
    }
  }
  cubes.forEach((cube, i) => {
    const [x, y] = L.at(cube.r, cube.c);
    const wheel = cube.r === L.rows - 1;
    drawCube(ctx, x, y + (wheel ? 0 : bounce), L.s * popScale(t, i), cube.key, {
      rot: wheel ? ta * 7 * k : 0,
      glow: cube === head && ta > 0 ? 0.9 : 0,
    });
  });
}

// ---------------------------------------------------------------- домик
function house(ctx, W, H, t, picture) {
  const cubes = cubesOf(picture);
  const T0 = intro(cubes);
  const ta = Math.max(0, t - T0);
  // День → вечер → ночь → утро, период 10 с.
  const day = ta > 0 ? (Math.cos((ta / 10) * Math.PI * 2) + 1) / 2 : 1;
  const night = 1 - day;
  sky(ctx, W, H, mix('#8fd8ff', '#101845', night), mix('#e9f8ff', '#3c2f73', night));
  for (let i = 0; i < 40; i++) {
    ctx.fillStyle = `rgba(255,255,255,${night * (0.4 + 0.6 * hash(i))})`;
    ctx.fillRect(hash(i) * W, hash(i + 50) * H * 0.6, 2, 2);
  }
  // Солнце и луна по дуге.
  const a = (ta / 10) * Math.PI * 2;
  const sx = W / 2 - Math.sin(a) * W * 0.38;
  const sy = H * 0.55 - Math.cos(a) * H * 0.42;
  ctx.fillStyle = '#ffd54a';
  ctx.beginPath();
  ctx.arc(sx, sy, W * 0.07, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fff6c9';
  ctx.beginPath();
  ctx.arc(W - sx, H * 1.1 - sy, W * 0.055, 0, Math.PI * 2);
  ctx.fill();
  const gy = H * 0.76;
  ground(ctx, W, H, gy, mix('#86d66a', '#2c5a3a', night), mix('#4fa443', '#1d3a28', night));
  const L = placeCubes(picture, W, H, { x: 0.2, y: 0.2, w: 0.6, h: 0.58 }, 0.19);
  // Дым из трубы над верхним кубиком крыши.
  const top = cubes.reduce((m, c) => (c.r < m.r ? c : m), cubes[0]);
  if (ta > 0) {
    const [tx, ty] = L.at(top.r, top.c);
    for (let j = 0; j < 7; j++) {
      const age = (ta * 0.45 + j / 7) % 1;
      puff(ctx, tx + L.s * 0.25 + Math.sin(age * 6 + j) * L.s * 0.3 + age * L.pitch, ty - L.s * 0.6 - age * L.pitch * 2.2, L.s * (0.12 + age * 0.35), 0.75 * (1 - age), '240,240,245');
    }
  }
  cubes.forEach((cube, i) => {
    const [x, y] = L.at(cube.r, cube.c);
    const grass = cube.key === 'G';
    const wall = cube.key === 'Y';
    drawCube(ctx, x, y, L.s * popScale(t, i), cube.key, {
      rot: grass ? Math.sin(ta * 2.5 + cube.c) * 0.15 : 0,
      glow: wall ? night * 1.1 : 0,
      dim: !wall && cube.key !== 'B' ? night * 0.35 : 0,
    });
    if (wall && t > T0) {
      ctx.fillStyle = mix('#7fd0ff', '#fff2a0', night);
      roundRect(ctx, x - L.s * 0.2, y - L.s * 0.22, L.s * 0.4, L.s * 0.36, 4);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.9)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, y - L.s * 0.22);
      ctx.lineTo(x, y + L.s * 0.14);
      ctx.moveTo(x - L.s * 0.2, y - L.s * 0.04);
      ctx.lineTo(x + L.s * 0.2, y - L.s * 0.04);
      ctx.stroke();
    }
    if (cube.key === 'B' && t > T0) {
      ctx.fillStyle = '#ffd21f';
      ctx.beginPath();
      ctx.arc(x + L.s * 0.22, y + L.s * 0.05, L.s * 0.06, 0, Math.PI * 2);
      ctx.fill();
    }
  });
}

// ---------------------------------------------------------------- бабочка
function butterfly(ctx, W, H, t, picture) {
  sky(ctx, W, H, '#c9f0ff', '#fff3fb');
  ground(ctx, W, H, H * 0.82, '#9be07e', '#62b552');
  for (let i = 0; i < 9; i++) {
    const x = W * (0.06 + i * 0.11);
    const y = H * (0.86 + hash(i) * 0.08);
    ctx.strokeStyle = '#3c9a3c';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x, H);
    ctx.lineTo(x + Math.sin(t + i) * 3, y);
    ctx.stroke();
    ctx.fillStyle = ['#ff6fa8', '#ffd21f', '#9b4fd6', '#ff8a1c'][i % 4];
    ctx.beginPath();
    ctx.arc(x + Math.sin(t + i) * 3, y, 7, 0, Math.PI * 2);
    ctx.fill();
  }
  const cubes = cubesOf(picture);
  const L = placeCubes(picture, W, H, { x: 0.2, y: 0.16, w: 0.6, h: 0.58 }, 0.2);
  const T0 = intro(cubes);
  const ta = Math.max(0, t - T0);
  const k = easeOut(ta / 0.8);
  const bodyC = Math.floor(L.cols / 2);
  const [bx0] = L.at(0, bodyC);
  const flap = 1 - k * 0.6 * (1 - Math.abs(Math.cos(ta * 7)));
  const fx = Math.sin(ta * 0.8) * W * 0.2 * k;
  const fy = Math.sin(ta * 1.6) * H * 0.09 * k;
  const tilt = Math.cos(ta * 0.8) * 0.18 * k;
  // След из искорок.
  for (let j = 0; j < 10; j++) {
    const tt = ta - j * 0.12;
    if (tt < 0) break;
    const x = W / 2 + Math.sin(tt * 0.8) * W * 0.2 * k;
    const y = H * 0.45 + Math.sin(tt * 1.6) * H * 0.09 * k + L.pitch;
    star(ctx, x, y, L.s * 0.12 * (1 - j / 10), '#fff6a6', '#ffcf3d');
  }
  ctx.save();
  const [, cy0] = L.at(Math.floor(L.rows / 2), bodyC);
  ctx.translate(bx0 + fx, cy0 + fy);
  ctx.rotate(tilt);
  ctx.translate(-bx0, -cy0);
  // Усики.
  const bodyTop = cubes.filter((c) => c.c === bodyC).sort((a, b) => a.r - b.r)[0];
  if (bodyTop && t > T0) {
    const [ax, ay] = L.at(bodyTop.r, bodyTop.c);
    ctx.strokeStyle = '#2a2a3a';
    ctx.lineWidth = L.s * 0.06;
    ctx.lineCap = 'round';
    for (const d of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(ax, ay - L.s * 0.4);
      ctx.quadraticCurveTo(ax + d * L.s * 0.2, ay - L.pitch, ax + d * L.s * 0.45, ay - L.pitch * 1.1);
      ctx.stroke();
      ctx.fillStyle = '#2a2a3a';
      ctx.beginPath();
      ctx.arc(ax + d * L.s * 0.45, ay - L.pitch * 1.1, L.s * 0.08, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  cubes.forEach((cube, i) => {
    const [x, y] = L.at(cube.r, cube.c);
    const wing = cube.c !== bodyC;
    const px = wing ? bx0 + (x - bx0) * flap : x;
    drawCube(ctx, px, y, L.s * popScale(t, i), cube.key, { sx: wing ? flap : 1 });
  });
  ctx.restore();
}

export const ANIMATIONS = { traffic, snake, flower, rocket, fish, car, house, butterfly };

export function drawAnimation(ctx, W, H, t, picture) {
  const f = ANIMATIONS[picture.anim];
  ctx.save();
  f(ctx, W, H, t, picture);
  ctx.restore();
}

/** Конфетти поверх анимации (первые ~3 с). */
export function drawConfetti(ctx, W, H, t) {
  if (t > 3.2) return;
  const colors = ['#e8322f', '#ffd21f', '#2fb84a', '#2f6ff0', '#ff8a1c', '#9b4fd6'];
  for (let i = 0; i < 70; i++) {
    const vx = (hash(i) - 0.5) * W * 0.9;
    const vy = -H * (0.6 + hash(i + 3) * 0.7);
    const x = W / 2 + vx * t;
    const y = H * 0.75 + vy * t + H * 0.9 * t * t;
    const s = 6 + hash(i + 9) * 8;
    ctx.save();
    ctx.globalAlpha = clamp01(3.2 - t);
    ctx.translate(x, y);
    ctx.rotate(t * 8 * (hash(i + 5) - 0.5));
    ctx.fillStyle = colors[i % colors.length];
    ctx.fillRect(-s / 2, -s / 4, s, s / 2);
    ctx.restore();
  }
}
