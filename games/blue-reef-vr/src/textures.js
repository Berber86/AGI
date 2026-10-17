// Процедурные текстуры на canvas: ноль байт в репозитории, детерминированный
// результат (один и тот же seed — одна и та же картинка) и никакой зависимости
// от сети. Всё считается один раз при старте, до первой отрисовки кадра.
import * as THREE from 'three';

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Периодический value-noise: индексы решётки заворачиваются по модулю, поэтому
// текстура бесшовно тайлится — это важно для 300-метрового песчаного дна.
function makeLattice(n, rnd) {
  const g = new Float32Array(n * n);
  for (let i = 0; i < g.length; i++) g[i] = rnd();
  return g;
}

function smooth(t) { return t * t * (3 - 2 * t); }

function sampleLattice(g, n, x, y) {
  const xi = Math.floor(x), yi = Math.floor(y);
  const tx = smooth(x - xi), ty = smooth(y - yi);
  const x0 = ((xi % n) + n) % n, x1 = (x0 + 1) % n;
  const y0 = ((yi % n) + n) % n, y1 = (y0 + 1) % n;
  const a = g[y0 * n + x0], b = g[y0 * n + x1], c = g[y1 * n + x0], d = g[y1 * n + x1];
  return (a * (1 - tx) + b * tx) * (1 - ty) + (c * (1 - tx) + d * tx) * ty;
}

export function fbm(g, n, x, y, octaves = 4, gain = 0.5) {
  let sum = 0, amp = 1, norm = 0, freq = 1;
  for (let o = 0; o < octaves; o++) {
    sum += amp * sampleLattice(g, n, x * freq, y * freq);
    norm += amp;
    amp *= gain;
    freq *= 2;
  }
  return sum / norm;
}

function canvasOf(size) {
  const c = document.createElement('canvas');
  c.width = size; c.height = size;
  return c;
}

function toTexture(canvas, { repeat = 1, srgb = false, aniso = 4 } = {}) {
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeat, repeat);
  tex.anisotropy = aniso;
  if (srgb) tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

// Высоту превращаем в нормаль центральными разностями (Sobel-подобно).
function heightToNormal(height, size, strength = 2.2) {
  const c = canvasOf(size);
  const ctx = c.getContext('2d');
  const img = ctx.createImageData(size, size);
  const at = (x, y) => height[(((y % size) + size) % size) * size + (((x % size) + size) % size)];
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = (at(x + 1, y) - at(x - 1, y)) * strength;
      const dy = (at(x, y + 1) - at(x, y - 1)) * strength;
      let nx = -dx, ny = -dy, nz = 1;
      const len = Math.hypot(nx, ny, nz);
      nx /= len; ny /= len; nz /= len;
      const i = (y * size + x) * 4;
      img.data[i] = (nx * 0.5 + 0.5) * 255;
      img.data[i + 1] = (ny * 0.5 + 0.5) * 255;
      img.data[i + 2] = (nz * 0.5 + 0.5) * 255;
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return c;
}

// Песок: настоящая рябь (гребни острые, ложбины плоские) + мелкая зернистость
// + редкие ракушки и grit. Рябь асимметрична — ровный синус выглядит «гребёнкой».
export function makeSandTextures(size = 512, repeat = 26) {
  const rnd = mulberry32(20261017);
  const n = 32;
  const g = makeLattice(n, rnd);
  const gFine = makeLattice(128, rnd);
  const gMicro = makeLattice(256, rnd);
  const c = canvasOf(size);
  const ctx = c.getContext('2d');
  const img = ctx.createImageData(size, size);
  const height = new Float32Array(size * size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const u = (x / size) * n, v = (y / size) * n;
      // Крупная рябь ~0.7 м: асимметричный гребень (резкий подъём, пологий спуск).
      const warp = fbm(g, n, u, v, 3) * 2.6;
      let d = (u * 0.9 + v * 0.32) * 2.0 + warp;
      const ph = d - Math.floor(d / (Math.PI * 2)) * Math.PI * 2;
      const ripple = Math.pow(0.5 + 0.5 * Math.cos(ph), 1.7);
      // Вторая, более мелкая сетка под углом: чтобы дно не читалось «стиральной доской».
      let d2 = (u * 2.7 - v * 1.9) * 1.7 + fbm(g, n, v, u, 2) * 1.4;
      const ph2 = d2 - Math.floor(d2 / (Math.PI * 2)) * Math.PI * 2;
      const ripple2 = Math.pow(0.5 + 0.5 * Math.cos(ph2), 2.2) * 0.45;
      const grain = fbm(gFine, 128, (x / size) * 128, (y / size) * 128, 2);
      const micro = fbm(gMicro, 256, (x / size) * 256, (y / size) * 256, 1);
      const h = ripple * 0.5 + ripple2 + grain * 0.22 + micro * 0.12;
      height[y * size + x] = h;
      // Светлый коралловый песок; в ложбинах темнее, на гребнях — выбеленнее.
      const shade = 0.66 + h * 0.42;
      const speck = grain > 0.80 ? 0.10 : 0;                 // светлые крупинки
      const shell = micro > 0.88 && grain > 0.62 ? 0.22 : 0; // обломки ракушек
      const i = (y * size + x) * 4;
      img.data[i] = Math.min(255, (222 + speck * 50 + shell * 30) * shade);
      img.data[i + 1] = Math.min(255, (204 + speck * 34 + shell * 26) * shade);
      img.data[i + 2] = Math.min(255, (166 + speck * 18 + shell * 20) * shade);
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return {
    map: toTexture(c, { repeat, srgb: true, aniso: 8 }),
    normalMap: toTexture(heightToNormal(height, size, 2.6), { repeat, aniso: 4 }),
  };
}

// Поверхность коралла: поры и полипы. Без этой карты кораллы выглядят
// гладким пластиком даже при правильной форме.
// Высоту рисуем на canvas радиальными градиентами — так вместо size²×N
// экспонент получается одна 2D-операция на полип.
export function makeCoralDetail(size = 256, repeat = 7) {
  const rnd = mulberry32(4242);
  const c = canvasOf(size);
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, size, size);
  const count = Math.round(size * 2.2);
  for (let i = 0; i < count; i++) {
    // Три «этажа» пор: крупные бугры, полипы среднего размера и мелкие точки.
    const tier = rnd();
    const r = tier < 0.18 ? 5 + rnd() * 7 : tier < 0.6 ? 2 + rnd() * 3 : 0.9 + rnd() * 1.4;
    const x = rnd() * size, y = rnd() * size;
    const a = tier < 0.18 ? 0.5 + rnd() * 0.3 : 0.55 + rnd() * 0.45;
    const grd = ctx.createRadialGradient(x, y, 0, x, y, r);
    grd.addColorStop(0, `rgba(255,255,255,${a.toFixed(3)})`);
    grd.addColorStop(0.55, `rgba(160,160,160,${(a * 0.45).toFixed(3)})`);
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grd;
    // Рисуем и копию со сдвигом на size — чтобы карта была бесшовной.
    for (const [ox, oy] of [[0, 0], [size, 0], [-size, 0], [0, size], [0, -size]]) {
      const g2 = ctx.createRadialGradient(x + ox, y + oy, 0, x + ox, y + oy, r);
      g2.addColorStop(0, `rgba(255,255,255,${a.toFixed(3)})`);
      g2.addColorStop(0.55, `rgba(160,160,160,${(a * 0.45).toFixed(3)})`);
      g2.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g2;
      ctx.beginPath();
      ctx.arc(x + ox, y + oy, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  const px = ctx.getImageData(0, 0, size, size).data;
  const height = new Float32Array(size * size);
  for (let i = 0; i < size * size; i++) height[i] = px[i * 4] / 255;
  return toTexture(heightToNormal(height, size, 2.4), { repeat, aniso: 4 });
}

// Камень: пятнистая корка с обрастаниями (водоросли/известковый налёт).
export function makeRockTextures(size = 256, repeat = 3) {
  const rnd = mulberry32(777);
  const n = 16;
  const g = makeLattice(n, rnd);
  const gFine = makeLattice(64, rnd);
  const c = canvasOf(size);
  const ctx = c.getContext('2d');
  const img = ctx.createImageData(size, size);
  const height = new Float32Array(size * size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const u = (x / size) * n, v = (y / size) * n;
      const base = fbm(g, n, u, v, 4);
      const grain = fbm(gFine, 64, (x / size) * 64, (y / size) * 64, 3);
      const h = base * 0.7 + grain * 0.3;
      height[y * size + x] = h;
      const algae = Math.max(0, grain - 0.55) * 1.8; // зелёный налёт во впадинах
      const shade = 0.55 + h * 0.5;
      const i = (y * size + x) * 4;
      img.data[i] = Math.min(255, (118 * shade) * (1 - algae * 0.6));
      img.data[i + 1] = Math.min(255, (126 * shade) * (1 - algae * 0.1));
      img.data[i + 2] = Math.min(255, (112 * shade) * (1 - algae * 0.5));
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return {
    map: toTexture(c, { repeat, srgb: true }),
    normalMap: toTexture(heightToNormal(height, size, 2.4), { repeat }),
  };
}

// Мягкая точка для частиц-взвеси и пузырьков.
export function makeDotSprite(size = 64) {
  const c = canvasOf(size);
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.35, 'rgba(255,255,255,0.55)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// Пузырь: светлая оболочка и блик.
export function makeBubbleSprite(size = 64) {
  const c = canvasOf(size);
  const ctx = c.getContext('2d');
  const r = size / 2;
  const g = ctx.createRadialGradient(r, r, r * 0.55, r, r, r);
  g.addColorStop(0, 'rgba(210,245,255,0.10)');
  g.addColorStop(0.78, 'rgba(230,250,255,0.55)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  ctx.beginPath();
  ctx.arc(r * 0.72, r * 0.68, r * 0.16, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.fill();
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// Столб света: мягкие края по ширине и растворение внизу.
export function makeRaySprite(w = 64, h = 256) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const ctx = c.getContext('2d');
  const img = ctx.createImageData(w, h);
  for (let y = 0; y < h; y++) {
    const ty = y / (h - 1);
    const fade = Math.pow(1 - ty, 1.7) * Math.min(1, ty * 6); // тает к низу и к верху
    for (let x = 0; x < w; x++) {
      const tx = (x / (w - 1)) * 2 - 1;
      const edge = Math.pow(Math.max(0, 1 - Math.abs(tx)), 2.6);
      const i = (y * w + x) * 4;
      img.data[i] = 255; img.data[i + 1] = 252; img.data[i + 2] = 232;
      img.data[i + 3] = Math.max(0, Math.min(255, 255 * edge * fade));
    }
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// Веерная горгонария: прозрачная сетка ветвей.
export function makeFanTexture(size = 256) {
  const rnd = mulberry32(4242);
  const c = canvasOf(size);
  const ctx = c.getContext('2d');
  ctx.clearRect(0, 0, size, size);
  ctx.lineCap = 'round';
  const branch = (x, y, angle, len, depth) => {
    if (depth <= 0 || len < 2) return;
    const x2 = x + Math.cos(angle) * len;
    const y2 = y + Math.sin(angle) * len;
    ctx.strokeStyle = `rgba(${210 + depth * 6},${120 + depth * 12},${150 + depth * 8},0.95)`;
    ctx.lineWidth = Math.max(1, depth * 1.5);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    const spread = 0.55 + rnd() * 0.35;
    branch(x2, y2, angle - spread, len * (0.62 + rnd() * 0.16), depth - 1);
    branch(x2, y2, angle + spread, len * (0.62 + rnd() * 0.16), depth - 1);
    if (rnd() < 0.35) branch(x2, y2, angle + (rnd() - 0.5) * 0.3, len * 0.55, depth - 1);
  };
  branch(size * 0.5, size * 0.98, -Math.PI / 2, size * 0.17, 7);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
