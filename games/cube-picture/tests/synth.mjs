// Синтетические «фото» раскладки кубиков сверху для тестов распознавания.
// Используется и в Node (юнит-тесты), и в браузере (e2e через тестовый мост).

// Так цвета кубиков обычно видит камера (темнее и грязнее, чем на экране).
export const CAMERA_COLORS = {
  R: [196, 38, 42],
  O: [232, 118, 34],
  Y: [232, 196, 44],
  G: [44, 146, 72],
  B: [38, 88, 186],
  P: [118, 58, 158],
  K: [230, 120, 160], // розовый — по умолчанию цвета нет в палитре
  W: [244, 242, 236], // белый кубик — почти как бумага
};

function rng(seed) {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return ((s >>> 0) % 100000) / 100000;
  };
}

export function rotateRows(rows, k) {
  let g = rows.map((r) => [...r]);
  for (let i = 0; i < k % 4; i++) {
    const H = g.length;
    const W = g[0].length;
    const n = [];
    for (let r = 0; r < W; r++) {
      n.push([]);
      for (let c = 0; c < H; c++) n[r].push(g[H - 1 - c][r]);
    }
    g = n;
  }
  return g.map((r) => r.join(''));
}

/**
 * @param rows массив строк картинки ('.' — пусто)
 * @returns {data: Uint8ClampedArray, width, height}
 */
export function renderScene(rows, opts = {}) {
  const {
    size = 400,
    cube = 56,
    gap = 3,
    angle = 0, // градусы, наклон всей раскладки
    offset = [0, 0],
    bg = 'paper',
    tint = [1, 1, 1],
    noise = 10,
    jitter = 10, // разброс цвета между кубиками
    seed = 7,
    specks = [], // [{x, y, r, color:[r,g,b]}] — посторонние предметы
    lightGradient = 0.12,
    wobble = 0, // неаккуратность: случайный сдвиг каждого кубика, px
    keystone = 0, // съёмка не строго сверху: верх кадра шире низа на долю
  } = opts;
  const rand = rng(seed);
  const W = size;
  const H = size;
  const data = new Uint8ClampedArray(W * H * 4);
  const rowsN = rows.length;
  const colsN = rows[0].length;
  const pitch = cube + gap;
  const layoutW = colsN * pitch - gap;
  const layoutH = rowsN * pitch - gap;
  const a = (-angle * Math.PI) / 180;
  const ca = Math.cos(a);
  const sa = Math.sin(a);
  const cubeShift = rows.map((r) => [...r].map(() => [(rand() - 0.5) * jitter, (rand() - 0.5) * jitter, (rand() - 0.5) * jitter]));
  const wob = rows.map((r) => [...r].map(() => [(rand() - 0.5) * 2 * wobble, (rand() - 0.5) * 2 * wobble]));
  const cubeAt = (lx, ly) => {
    const c0 = Math.floor(lx / pitch);
    const r0 = Math.floor(ly / pitch);
    for (let r = r0 - 1; r <= r0 + 1; r++) {
      for (let c = c0 - 1; c <= c0 + 1; c++) {
        if (r < 0 || c < 0 || r >= rowsN || c >= colsN) continue;
        const ch = rows[r][c];
        if (ch === '.' || ch === ' ') continue;
        const fx = lx - c * pitch - wob[r][c][0];
        const fy = ly - r * pitch - wob[r][c][1];
        if (fx < 0 || fy < 0 || fx >= cube || fy >= cube) continue;
        return { ch, r, c, fx: fx / cube, fy: fy / cube };
      }
    }
    return null;
  };
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const dy = y - H / 2 - offset[1];
      const dx = (x - W / 2 - offset[0]) * (1 + keystone * (dy / H));
      const lx = dx * ca - dy * sa + layoutW / 2;
      const ly = dx * sa + dy * ca + layoutH / 2;
      let col;
      if (bg === 'wood') {
        const s = Math.sin(y * 0.06 + Math.sin(x * 0.013) * 3) * 16;
        col = [178 + s, 126 + s * 0.8, 74 + s * 0.5];
      } else if (bg === 'gray') {
        col = [150, 150, 152];
      } else {
        col = [236, 232, 224];
      }
      const light = 1 - lightGradient * (y / H) + lightGradient / 2;
      const hit = cubeAt(lx, ly);
      if (hit) {
        const base = CAMERA_COLORS[hit.ch];
        const sh = cubeShift[hit.r][hit.c];
        const edge = Math.min(hit.fx, hit.fy, 1 - hit.fx, 1 - hit.fy);
        const bevel = edge < 0.08 ? 0.72 : edge < 0.14 ? 0.88 : 1;
        const hl = hit.fx + hit.fy < 0.5 ? 1.06 : 1;
        col = base.map((v, i) => (v + sh[i]) * bevel * hl);
      } else if (cubeAt(lx - 5, ly - 6)) {
        col = col.map((v) => v * 0.78); // тень
      }
      for (const sp of specks) {
        if ((x - sp.x) ** 2 + (y - sp.y) ** 2 < sp.r * sp.r) col = sp.color.slice();
      }
      const n = (rand() - 0.5) * 2 * noise;
      const i = (y * W + x) * 4;
      data[i] = col[0] * light * tint[0] + n;
      data[i + 1] = col[1] * light * tint[1] + n;
      data[i + 2] = col[2] * light * tint[2] + n;
      data[i + 3] = 255;
    }
  }
  return { data, width: W, height: H };
}

/** Заменяет символ в клетке (r, c). */
export function setCell(rows, r, c, ch) {
  return rows.map((row, i) => (i === r ? row.slice(0, c) + ch + row.slice(c + 1) : row));
}
