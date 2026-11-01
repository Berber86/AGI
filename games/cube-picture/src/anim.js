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
  const green = cubes.findIndex((c) => c.role === 'G');
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
  const stem = cubes.find((c) => c.role === 'G');
  const center = cubes.find((c) => c.role === 'Y');
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
  const win = cubes.find((c) => c.role === 'B');
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
  const eye = cubes.find((c) => c.role === 'P') || cubes[cubes.length - 1];
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
  const head = cubes.find((c) => c.role === 'Y');
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
    const grass = cube.role === 'G';
    const wall = cube.role === 'Y';
    drawCube(ctx, x, y, L.s * popScale(t, i), cube.key, {
      rot: grass ? Math.sin(ta * 2.5 + cube.c) * 0.15 : 0,
      glow: wall ? night * 1.1 : 0,
      dim: !wall && cube.role !== 'B' ? night * 0.35 : 0,
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
    if (cube.role === 'B' && t > T0) {
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

// ================================================================ простые картинки (2–4 кубика)

/** Глазки на кубике: (x, y) — центр между глазами, s — сторона кубика. */
function eyes(ctx, x, y, s, look = 0, open = 1) {
  for (const d of [-1, 1]) {
    const ex = x + d * s * 0.2;
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.ellipse(ex, y, s * 0.13, s * 0.15 * Math.max(0.12, open), 0, 0, Math.PI * 2);
    ctx.fill();
    if (open > 0.3) {
      ctx.fillStyle = '#2a2140';
      ctx.beginPath();
      ctx.arc(ex + look * s * 0.05, y + s * 0.02, s * 0.07, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
/** Моргание раз в несколько секунд: 1 — открыты, 0 — закрыты. */
const blink = (t, seed = 0) => (((t + seed) % 3.1) < 0.14 ? 0.1 : 1);

function heartPath(ctx, x, y, s) {
  ctx.beginPath();
  ctx.moveTo(x, y + s * 0.38);
  ctx.bezierCurveTo(x - s * 0.95, y - s * 0.2, x - s * 0.4, y - s * 0.85, x, y - s * 0.32);
  ctx.bezierCurveTo(x + s * 0.4, y - s * 0.85, x + s * 0.95, y - s * 0.2, x, y + s * 0.38);
  ctx.closePath();
}

/** Сдвигает раскладку по вертикали так, чтобы нижний ряд кубиков стоял на линии y. */
function standOn(L, y) {
  const oy = y - L.s / 2 - (L.rows - 1) * L.pitch;
  return { ...L, oy, at: (r, c) => [L.ox + c * L.pitch, oy + r * L.pitch] };
}

/** Огонёк-капля над (x, y): k — яркость появления. */
function flame(ctx, x, y, s, t, k) {
  const h = s * (0.75 + 0.08 * Math.sin(t * 13) + 0.05 * Math.sin(t * 23)) * k;
  const wv = s * 0.26 * k;
  const sway = Math.sin(t * 5.3) * s * 0.06;
  const layer = (sc, color) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x + sway * 1.6, y - h * sc);
    ctx.bezierCurveTo(x + wv * sc * 1.2, y - h * sc * 0.45, x + wv * sc, y, x, y);
    ctx.bezierCurveTo(x - wv * sc, y, x - wv * sc * 1.2, y - h * sc * 0.45, x + sway * 1.6, y - h * sc);
    ctx.fill();
  };
  layer(1, '#ff9a3c');
  layer(0.7, '#ffd23f');
  layer(0.4, '#fff6c8');
}

/** Центр картинки (для вращения/качания всей фигуры). */
function centerOf(L) {
  const [x0, y0] = L.at(0, 0);
  const [x1, y1] = L.at(L.rows - 1, L.cols - 1);
  return [(x0 + x1) / 2, (y0 + y1) / 2];
}

// ---------------------------------------------------------------- свечка
function candle(ctx, W, H, t, picture) {
  const cubes = cubesOf(picture);
  const T0 = intro(cubes);
  const ta = Math.max(0, t - T0);
  const lit = easeOut(ta / 0.8);
  sky(ctx, W, H, mix('#241a3a', '#5a3a5e', lit), mix('#3b2a55', '#a8664f', lit));
  // Звёзды в окне.
  ctx.fillStyle = 'rgba(140,170,255,0.25)';
  roundRect(ctx, W * 0.1, H * 0.08, W * 0.3, H * 0.22, 14);
  ctx.fill();
  for (let i = 0; i < 6; i++) star(ctx, W * (0.14 + hash(i) * 0.22), H * (0.11 + hash(i + 9) * 0.16), 4 + hash(i + 3) * 3, '#fff7c2', '#fff7c2');
  // Стол.
  ground(ctx, W, H, H * 0.78, '#8a5a3c', '#5e3b26');
  const L = standOn(placeCubes(picture, W, H, { x: 0.3, y: 0.28, w: 0.4, h: 0.5 }, 0.22), H * 0.8);
  const flameCube = cubes.reduce((a, c) => (c.r < a.r ? c : a), cubes[0]);
  const [fx, fy] = L.at(flameCube.r, flameCube.c);
  // Тёплый ореол.
  if (lit > 0) {
    const r = L.pitch * (1.6 + 0.15 * Math.sin(t * 13) + 0.1 * Math.sin(t * 7.3)) * lit;
    const g = ctx.createRadialGradient(fx, fy, 0, fx, fy, r * 2.2);
    g.addColorStop(0, 'rgba(255,214,120,0.55)');
    g.addColorStop(1, 'rgba(255,170,80,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }
  // Искорки летят вверх.
  for (let j = 0; j < 8 && ta > 0; j++) {
    const age = (ta * 0.7 + j / 8) % 1;
    const x = fx + Math.sin(j * 2.3 + age * 6) * L.s * 0.35;
    const y = fy - L.s * 1.2 - age * L.pitch * 2.2;
    star(ctx, x, y, L.s * 0.09 * (1 - age), '#fff1a8', '#ffc94a');
  }
  cubes.forEach((cube, i) => {
    const [x, y] = L.at(cube.r, cube.c);
    const flame = cube === flameCube;
    drawCube(ctx, x, y, L.s * popScale(t, i), cube.key, {
      rot: flame ? Math.sin(t * 4.3) * 0.05 * lit : 0,
      glow: flame ? lit * (0.8 + 0.2 * Math.sin(t * 11)) : 0,
    });
  });
  // Фитилёк и огонёк над верхним кубиком.
  if (lit > 0) {
    const top = fy - L.s * 0.5;
    ctx.strokeStyle = '#3a2a2a';
    ctx.lineWidth = L.s * 0.06;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(fx, top);
    ctx.lineTo(fx, top - L.s * 0.14);
    ctx.stroke();
    flame(ctx, fx, top - L.s * 0.08, L.s, t, lit);
  }
}

// ---------------------------------------------------------------- сердечко
function heart(ctx, W, H, t, picture) {
  sky(ctx, W, H, '#ffd6e8', '#ff9ec4');
  // Мягкие круги-«пузыри» фона.
  for (let i = 0; i < 7; i++) {
    ctx.fillStyle = `rgba(255,255,255,${0.18 + 0.1 * Math.sin(t * 1.3 + i)})`;
    ctx.beginPath();
    ctx.arc(W * hash(i + 20), H * hash(i + 40), W * (0.06 + hash(i + 60) * 0.1), 0, Math.PI * 2);
    ctx.fill();
  }
  const cubes = cubesOf(picture);
  const T0 = intro(cubes);
  const ta = Math.max(0, t - T0);
  const L = placeCubes(picture, W, H, { x: 0.2, y: 0.28, w: 0.6, h: 0.4 }, 0.24);
  const [cx, cy] = centerOf(L);
  // Маленькие сердечки улетают вверх.
  for (let j = 0; j < 16 && ta > 0; j++) {
    const age = (ta * 0.35 + hash(j)) % 1;
    const x = W * (0.1 + hash(j + 5) * 0.8) + Math.sin(age * 9 + j) * W * 0.03;
    const y = H * (1.05 - age * 1.1);
    ctx.globalAlpha = 0.85 * Math.sin(age * Math.PI);
    heartPath(ctx, x, y, W * (0.035 + hash(j + 2) * 0.03));
    ctx.fillStyle = ['#ef3b6e', '#ffffff', '#e0508e', '#ff7aa8'][j % 4];
    ctx.fill();
    ctx.globalAlpha = 1;
  }
  // «Тук-тук»: два быстрых толчка и пауза.
  const ph = ta % 1.1;
  const beat = ta > 0 ? 0.16 * Math.exp(-Math.pow((ph - 0.1) / 0.06, 2)) + 0.11 * Math.exp(-Math.pow((ph - 0.32) / 0.06, 2)) : 0;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(1 + beat, 1 + beat);
  ctx.translate(-cx, -cy);
  // Розовое сердце-подложка проявляется под кубиками.
  ctx.globalAlpha = 0.55 * easeOut(ta / 0.8);
  heartPath(ctx, cx, cy - L.pitch * 0.15, L.pitch * 2.6);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.globalAlpha = 1;
  cubes.forEach((cube, i) => {
    const [x, y] = L.at(cube.r, cube.c);
    drawCube(ctx, x, y, L.s * popScale(t, i), cube.key, { glow: beat * 4 });
  });
  ctx.restore();
}

// ---------------------------------------------------------------- кораблик
function boat(ctx, W, H, t, picture) {
  sky(ctx, W, H, '#8fd3ff', '#e6f7ff');
  ctx.fillStyle = '#ffe27a';
  ctx.beginPath();
  ctx.arc(W * 0.82, H * 0.12, W * 0.08, 0, Math.PI * 2);
  ctx.fill();
  cloud(ctx, ((t * 14) % (W + 220)) - 120, H * 0.14, W * 0.08);
  // Чайки.
  ctx.strokeStyle = '#4a5568';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  for (let i = 0; i < 3; i++) {
    const x = ((t * (30 + i * 9) + i * W * 0.4) % (W + 60)) - 30;
    const y = H * (0.2 + i * 0.06) + Math.sin(t * 2 + i) * 6;
    const f = Math.sin(t * 8 + i) * 4;
    ctx.beginPath();
    ctx.moveTo(x - 10, y - f);
    ctx.quadraticCurveTo(x - 4, y - 8, x, y);
    ctx.quadraticCurveTo(x + 4, y - 8, x + 10, y - f);
    ctx.stroke();
  }
  const seaY = H * 0.64;
  const wave = (x, ph, amp) => seaY + Math.sin(x * 0.03 + ph) * amp + Math.sin(x * 0.071 + ph * 1.3) * amp * 0.5;
  const drawSea = (ph, amp, color, dy) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, H);
    for (let x = 0; x <= W; x += 8) ctx.lineTo(x, wave(x, ph, amp) + dy);
    ctx.lineTo(W, H);
    ctx.fill();
  };
  drawSea(t * 1.2, 8, '#5fb4ea', -H * 0.03);
  const cubes = cubesOf(picture);
  const T0 = intro(cubes);
  const ta = Math.max(0, t - T0);
  const k = easeOut(ta / 0.8);
  const L = standOn(placeCubes(picture, W, H, { x: 0.25, y: 0.3, w: 0.5, h: 0.36 }, 0.2), seaY + H * 0.05);
  const [cx, cy] = centerOf(L);
  const span = W * 1.4;
  const dx = k ? ((ta * W * 0.08 + span / 2) % span) - span / 2 : 0;
  const bob = Math.sin(ta * 2.2) * L.pitch * 0.12 * k;
  const rock = Math.sin(ta * 2.2 + 0.8) * 0.12 * k;
  const bottom = Math.max(...cubes.map((c) => c.r));
  ctx.save();
  ctx.translate(cx + dx, cy + bob);
  ctx.rotate(rock);
  ctx.translate(-cx, -cy);
  cubes.forEach((cube, i) => {
    const [x, y] = L.at(cube.r, cube.c);
    const sail = cube.r < bottom;
    drawCube(ctx, x, y, L.s * popScale(t, i), cube.key, { sx: sail ? 1 + 0.06 * Math.sin(ta * 5) * k : 1 });
  });
  ctx.restore();
  drawSea(t * 1.6 + 2, 10, 'rgba(46,140,214,0.88)', H * 0.06);
  // Пена.
  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  for (let i = 0; i < 6; i++) {
    const x = ((i * W) / 5 + t * 40) % (W + 40) - 20;
    ctx.beginPath();
    ctx.ellipse(x, wave(x, t * 1.6 + 2, 10) + H * 0.06, 12, 4, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

// ---------------------------------------------------------------- грибок
function mushroom(ctx, W, H, t, picture) {
  sky(ctx, W, H, '#bfe9ff', '#f2fbe8');
  const groundY = H * 0.72;
  // Деревья вдали.
  for (let i = 0; i < 5; i++) {
    const x = W * (0.05 + i * 0.23);
    const th = H * (0.08 + hash(i + 7) * 0.05);
    ctx.fillStyle = '#9b6b45';
    ctx.fillRect(x - W * 0.015, groundY - th, W * 0.03, th);
    ctx.fillStyle = i % 2 ? '#7cc576' : '#5fae5c';
    ctx.beginPath();
    ctx.arc(x, groundY - th - W * 0.06, W * 0.09, 0, Math.PI * 2);
    ctx.fill();
  }
  ground(ctx, W, H, groundY, '#8fd46f', '#5aa94a');
  const cubes = cubesOf(picture);
  const T0 = intro(cubes);
  const ta = Math.max(0, t - T0);
  const L = standOn(placeCubes(picture, W, H, { x: 0.2, y: 0.34, w: 0.6, h: 0.36 }, 0.22), groundY + H * 0.04);
  const bottom = Math.max(...cubes.map((c) => c.r));
  const [, yb] = L.at(bottom, 0);
  // Вырастает из земли, потом прыгает с «приплюскиванием».
  const grow = easeOutBack(ta / 0.9);
  const hopT = Math.max(0, ta - 1.1) % 1.3;
  const hop = ta > 1.1 ? Math.max(0, Math.sin((hopT / 0.8) * Math.PI)) * (hopT < 0.8 ? 1 : 0) : 0;
  const squash = ta > 1.1 && hopT > 0.8 ? Math.sin(((hopT - 0.8) / 0.5) * Math.PI) * 0.18 : 0;
  const lift = hop * L.pitch * 1.1;
  // Тень.
  ctx.fillStyle = `rgba(30,70,30,${0.25 * (1 - hop * 0.6)})`;
  ctx.beginPath();
  ctx.ellipse(W / 2, yb + L.s * 0.55, L.pitch * (1.4 - hop * 0.5), L.s * 0.18, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.save();
  ctx.translate(W / 2, yb + L.s / 2);
  ctx.scale(1 + squash, clamp01(grow) * (1 - squash) + (grow > 1 ? grow - 1 : 0));
  ctx.translate(-W / 2, -(yb + L.s / 2) - lift / Math.max(0.3, grow));
  cubes.forEach((cube, i) => {
    const [x, y] = L.at(cube.r, cube.c);
    drawCube(ctx, x, y, L.s * popScale(t, i), cube.key);
  });
  const stem = cubes.find((c) => c.r === bottom);
  if (stem && ta > 0.6) {
    const [x, y] = L.at(stem.r, stem.c);
    eyes(ctx, x, y - L.s * 0.05, L.s, Math.sin(ta * 0.9), blink(ta));
    ctx.strokeStyle = '#3a2c5c';
    ctx.lineWidth = L.s * 0.05;
    ctx.beginPath();
    ctx.arc(x, y + L.s * 0.12, L.s * 0.12, 0.2, Math.PI - 0.2);
    ctx.stroke();
  }
  ctx.restore();
  // Травинки спереди.
  ctx.strokeStyle = '#3f9a3f';
  ctx.lineWidth = 3;
  for (let i = 0; i < 16; i++) {
    const x = W * (i / 15);
    ctx.beginPath();
    ctx.moveTo(x, H);
    ctx.lineTo(x + Math.sin(t * 2 + i) * 4, groundY + H * 0.08 + hash(i) * H * 0.08);
    ctx.stroke();
  }
}

// ---------------------------------------------------------------- подарок
function present(ctx, W, H, t, picture) {
  sky(ctx, W, H, '#fff1d6', '#ffd9e6');
  // Гирлянда.
  for (let i = 0; i < 9; i++) {
    const x = W * (0.05 + i * 0.112);
    const y = H * 0.07 + Math.sin(i * 0.9) * 8;
    ctx.fillStyle = ['#ef5b5b', '#f5c63c', '#2f8a4e', '#3456b8', '#e0508e'][i % 5];
    ctx.globalAlpha = 0.6 + 0.4 * Math.abs(Math.sin(t * 3 + i));
    ctx.beginPath();
    ctx.arc(x, y, 7, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  ground(ctx, W, H, H * 0.8, '#e9c9a6', '#d4aa82');
  const cubes = cubesOf(picture);
  const T0 = intro(cubes);
  const ta = Math.max(0, t - T0);
  const L = standOn(placeCubes(picture, W, H, { x: 0.25, y: 0.42, w: 0.5, h: 0.38 }, 0.22), H * 0.84);
  const [cx] = centerOf(L);
  const top = Math.min(...cubes.map((c) => c.r));
  // Цикл 3 с: трясётся → крышка подлетает → звезда выпрыгивает → крышка обратно.
  const ph = ta % 3;
  const shake = ta > 0 && ph < 0.8 ? Math.sin(ph * 40) * 0.07 * (ph / 0.8) : 0;
  const open = ta > 0 && ph >= 0.8 ? Math.sin(clamp01((ph - 0.8) / 2) * Math.PI) : 0;
  const lidUp = easeOut(open * 1.6) * L.pitch * 1.4;
  const [, yTop] = L.at(top, 0);
  if (open > 0) {
    const sp = clamp01((ph - 0.9) / 1.4);
    const sy = yTop - L.pitch * 0.4 - easeOut(sp) * H * 0.22;
    for (let j = 0; j < 10; j++) {
      const a = (j / 10) * Math.PI * 2 + ta;
      const r = L.pitch * (0.6 + sp * 1.4);
      star(ctx, cx + Math.cos(a) * r, sy + Math.sin(a) * r * 0.7, L.s * 0.08 * (1 - sp * 0.5), '#fff6a6', '#ffcf3d');
    }
    ctx.save();
    ctx.translate(cx, sy);
    ctx.rotate(sp * Math.PI * 2);
    star(ctx, 0, 0, L.s * (0.25 + 0.35 * easeOutBack(sp)));
    ctx.restore();
  }
  cubes.forEach((cube, i) => {
    const [x, y] = L.at(cube.r, cube.c);
    const lid = cube.r === top;
    const lx = lid ? (x - cx) * (1 + open * 0.15) + cx : x;
    drawCube(ctx, lx, y - (lid ? lidUp : 0), L.s * popScale(t, i), cube.key, {
      rot: shake + (lid ? (x < cx ? -1 : 1) * open * 0.35 : 0),
    });
  });
  // Бантик на крышке.
  if (ta > 0) {
    const by = yTop - L.s * 0.55 - lidUp;
    ctx.fillStyle = '#fff';
    for (const d of [-1, 1]) {
      ctx.beginPath();
      ctx.ellipse(cx + d * L.s * 0.22, by, L.s * 0.22, L.s * 0.13, d * 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.beginPath();
    ctx.arc(cx, by, L.s * 0.09, 0, Math.PI * 2);
    ctx.fill();
  }
}

// ---------------------------------------------------------------- гусеница
function caterpillar(ctx, W, H, t, picture) {
  sky(ctx, W, H, '#d6f5ff', '#f4ffe6');
  const groundY = H * 0.66;
  ground(ctx, W, H, groundY, '#9ee07f', '#63b552');
  // Листик, к которому ползёт.
  for (let i = 0; i < 4; i++) {
    const x = W * (0.12 + i * 0.26);
    ctx.strokeStyle = '#3f9a3f';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x, groundY);
    ctx.quadraticCurveTo(x + 8, groundY - H * 0.06, x + Math.sin(t * 1.5 + i) * 6, groundY - H * 0.1);
    ctx.stroke();
    ctx.fillStyle = '#4fae4a';
    ctx.beginPath();
    ctx.ellipse(x + 14, groundY - H * 0.07, W * 0.045, W * 0.02, -0.5, 0, Math.PI * 2);
    ctx.fill();
  }
  const cubes = cubesOf(picture).sort((a, b) => a.c - b.c || a.r - b.r);
  const T0 = intro(cubes);
  const ta = Math.max(0, t - T0);
  const k = easeOut(ta / 0.8);
  // Раскладываем в одну линию (как бы ни была повёрнута картинка в образце).
  const n = cubes.length;
  const s = Math.min(W * 0.17, (W * 0.62) / n);
  const pitch = s * 1.06;
  const span = W + pitch * n * 2;
  const x0 = ((ta * W * 0.07 + span * 0.4) % span) - pitch * n;
  const baseY = groundY - s * 0.45;
  cubes.forEach((cube, i) => {
    const wave = Math.max(0, Math.sin(ta * 4 - i * 0.9)) * s * 0.45 * k;
    const x = x0 + i * pitch + Math.sin(ta * 4 - i * 0.9) * s * 0.08 * k;
    drawCube(ctx, x, baseY - wave, s * popScale(t, i), cube.key, { rot: Math.cos(ta * 4 - i * 0.9) * 0.12 * k });
  });
  // Голова — последний кубик: глазки и усики.
  const head = n - 1;
  const hx = x0 + head * pitch;
  const hy = baseY - Math.max(0, Math.sin(ta * 4 - head * 0.9)) * s * 0.45 * k;
  if (t > T0) {
    eyes(ctx, hx + s * 0.05, hy - s * 0.05, s, 1, blink(ta, 0.7));
    ctx.strokeStyle = '#2a2140';
    ctx.lineWidth = s * 0.06;
    ctx.lineCap = 'round';
    for (const d of [-1, 1]) {
      const tipX = hx + d * s * 0.25 + Math.sin(ta * 6 + d) * s * 0.05;
      const tipY = hy - s * 0.95;
      ctx.beginPath();
      ctx.moveTo(hx + d * s * 0.15, hy - s * 0.45);
      ctx.quadraticCurveTo(hx + d * s * 0.1, hy - s * 0.8, tipX, tipY);
      ctx.stroke();
      ctx.fillStyle = '#2a2140';
      ctx.beginPath();
      ctx.arc(tipX, tipY, s * 0.07, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  // Цветочки спереди.
  for (let i = 0; i < 7; i++) {
    const x = W * (0.07 + i * 0.145);
    const y = groundY + H * (0.12 + hash(i) * 0.14);
    ctx.fillStyle = ['#ff6fa8', '#ffd21f', '#ffffff'][i % 3];
    for (let a = 0; a < 5; a++) {
      ctx.beginPath();
      ctx.arc(x + Math.cos(a * 1.256 + t) * 6, y + Math.sin(a * 1.256 + t) * 6, 4.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

export const ANIMATIONS = { traffic, snake, flower, rocket, fish, car, house, butterfly, candle, heart, boat, mushroom, present, caterpillar };

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
