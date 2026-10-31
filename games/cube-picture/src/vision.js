// Проверка сборки по снимку. Чистый JS без зависимостей: работает и в браузере, и в Node (тесты).
//
// Конвейер:
//  1) уменьшаем кадр до ~160 px (усреднение = шумоподавление);
//  2) фон = медиана цвета по краю кадра; каждый пиксель делим на цвет фона —
//     так убираются яркость и оттенок освещения (тёплая лампа, пасмурный день);
//  3) у каждого пикселя считаем цветность (доли R,G,B) и относительную яркость и сравниваем
//     с эталонами палитры (сняты с фото настоящих кубиков); почти нейтральные пиксели (фон, тени)
//     и очень тёмные щели — не кубики;
//  4) связные области: выкидываем крошки и всё, что касается края кадра (рука, игрушки);
//  5) оцениваем наклон раскладки по направлениям краёв кубиков;
//  6) делим рамку на сетку картинки в 4 поворотах, в центре каждой клетки голосуем за цвет;
//  7) выбираем поворот с наименьшим числом ошибок.

export const DEFAULTS = {
  work: 160, // размер стороны рабочего кадра
  border: 0.05, // доля края кадра для оценки фона
  neutral: 0.034, // цветность ближе этого к серому — фон/тень (зелёный кубик ≈ 0.06)
  minBgDist: 0.14, // минимальное отличие от фона (в долях цвета фона)
  minY: 0.13, // относительная яркость ниже — щель/глубокая тень
  darkY: 0.55, // темнее этого — предмет, даже если почти серый (тени на бумаге светлее)
  chromaScale: 0.03, // «единица» расстояния по цветности
  lumScale: 0.2, // «единица» расстояния по log-светлоте (после поправки на общую яркость сцены)
  maxDist: 3.2, // дальше от всех эталонов — «неизвестный цвет»
  strongColor: 0.1, // неизвестный, но явно цветной пиксель — посторонний предмет
  minAreaFrac: 0.003, // минимальная площадь всех кубиков (доля кадра)
  speckFrac: 0.025, // области меньше этой доли от всех кубиков — мусор
  cellInner: 0.5, // доля клетки, по которой голосуем (центр)
  cellFill: 0.4, // доля «кубиковых» пикселей, чтобы клетка считалась занятой
  aspectMin: 0.6,
  aspectMax: 1.65,
};

const UNKNOWN = '?';

function median(values) {
  const a = Float64Array.from(values).sort();
  return a.length ? a[a.length >> 1] : 0;
}

/** Уменьшение кадра усреднением блоков. Возвращает {w, h, rgb: Float32Array}. */
export function downscale(img, maxDim) {
  const scale = Math.max(1, Math.max(img.width, img.height) / maxDim);
  const w = Math.max(1, Math.round(img.width / scale));
  const h = Math.max(1, Math.round(img.height / scale));
  const rgb = new Float32Array(w * h * 3);
  const cnt = new Float32Array(w * h);
  const src = img.data;
  const step = scale > 3 ? Math.floor(scale / 2) : 1; // при сильном уменьшении берём каждый n-й пиксель
  for (let y = 0; y < img.height; y += step) {
    const ty = Math.min(h - 1, Math.floor(y / scale));
    for (let x = 0; x < img.width; x += step) {
      const tx = Math.min(w - 1, Math.floor(x / scale));
      const si = (y * img.width + x) * 4;
      const ti = ty * w + tx;
      rgb[ti * 3] += src[si];
      rgb[ti * 3 + 1] += src[si + 1];
      rgb[ti * 3 + 2] += src[si + 2];
      cnt[ti] += 1;
    }
  }
  for (let i = 0; i < w * h; i++) {
    const n = cnt[i] || 1;
    rgb[i * 3] /= n;
    rgb[i * 3 + 1] /= n;
    rgb[i * 3 + 2] /= n;
  }
  return { w, h, rgb, scale: img.width / w };
}

/** Поворот сетки по часовой стрелке k раз; src[r][c] — координаты клетки в исходной картинке. */
export function rotateGrid(target, k) {
  let g = target.map((row, r) => row.map((v, c) => ({ v, src: [r, c] })));
  for (let i = 0; i < ((k % 4) + 4) % 4; i++) {
    const H = g.length;
    const W = g[0].length;
    const next = [];
    for (let r = 0; r < W; r++) {
      next.push([]);
      for (let c = 0; c < H; c++) next[r].push(g[H - 1 - c][r]);
    }
    g = next;
  }
  return g;
}

/** Эталоны палитры: цветность и относительная яркость. */
function refsOf(palette) {
  return Object.keys(palette).map((k) => {
    const rel = palette[k].rel;
    const sum = rel[0] + rel[1] + rel[2];
    return { key: k, c: rel.map((v) => v / sum), y: sum / 3, decoy: !!palette[k].decoy };
  });
}

/** Метки пикселей: индекс цвета палитры, keys.length = неизвестный цвет, -1 = фон. */
export function classify(small, palette, o = DEFAULTS) {
  const { w, h, rgb } = small;
  const keys = Object.keys(palette);
  const refs = refsOf(palette);
  // Фон: медиана по краевому кольцу.
  const bw = Math.max(1, Math.round(Math.min(w, h) * o.border));
  const rs = [];
  const gs = [];
  const bs = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (x >= bw && x < w - bw && y >= bw && y < h - bw) continue;
      const i = (y * w + x) * 3;
      rs.push(rgb[i]);
      gs.push(rgb[i + 1]);
      bs.push(rgb[i + 2]);
    }
  }
  const bg = [median(rs), median(gs), median(bs)].map((v) => Math.max(8, v));
  const bgMax = Math.max(...bg);
  const lightBg = bgMax > 100 && bgMax - Math.min(...bg) < 70;
  const labels = new Int8Array(w * h).fill(-1);
  const fgness = new Float32Array(w * h); // отличие от фона — для оценки наклона по краям
  const cs2 = o.chromaScale * o.chromaScale;
  const max2 = o.maxDist * o.maxDist;
  // Проход 1: кандидаты и расстояния по цветности.
  const cand = [];
  for (let p = 0; p < w * h; p++) {
    const nr = rgb[p * 3] / bg[0];
    const ng = rgb[p * 3 + 1] / bg[1];
    const nb = rgb[p * 3 + 2] / bg[2];
    const dist = Math.hypot(nr - 1, ng - 1, nb - 1);
    fgness[p] = Math.min(1.5, dist);
    if (dist < o.minBgDist) continue;
    const sum = nr + ng + nb;
    const y = sum / 3;
    if (y < o.minY) continue;
    const cr = nr / sum;
    const cg = ng / sum;
    const cb = nb / sum;
    const sat = Math.hypot(cr - 1 / 3, cg - 1 / 3, cb - 1 / 3);
    // Почти серое — фон или тень, если только это не заметно тёмный предмет (тёмно-зелёный кубик на бумаге).
    if (sat < o.neutral && y > o.darkY) continue;
    const dc = refs.map((r) => ((cr - r.c[0]) ** 2 + (cg - r.c[1]) ** 2 + (cb - r.c[2]) ** 2) / cs2);
    cand.push({ p, y, sat, dc });
  }
  // Общий множитель яркости сцены: кубики на белой бумаге относительно темнее, чем на серой ткани,
  // но одинаково для всех цветов. Оцениваем по пикселям с уверенным совпадением по цветности.
  const ratios = [];
  for (const q of cand) {
    let k = 0;
    for (let i = 1; i < refs.length; i++) if (q.dc[i] < q.dc[k]) k = i;
    if (q.dc[k] <= 4 && !refs[k].decoy) ratios.push(Math.log(q.y / refs[k].y));
  }
  const lumShift = ratios.length >= 12 ? median(ratios) : 0;
  // Проход 2: цветность + светлота с поправкой на сцену (отличает голубой от синего, сиреневый от фиолетового).
  const ls2 = o.lumScale * o.lumScale;
  for (const q of cand) {
    const ly = Math.log(q.y) - lumShift;
    let best = -1;
    let bestD = Infinity;
    for (let k = 0; k < refs.length; k++) {
      const d = q.dc[k] + (ly - Math.log(refs[k].y)) ** 2 / ls2;
      if (d < bestD) {
        bestD = d;
        best = k;
      }
    }
    if (bestD <= max2) labels[q.p] = best;
    else if (q.sat >= o.strongColor) labels[q.p] = keys.length;
  }
  return { labels, bg, lightBg, keys, fgness, lumShift };
}

/** Оставляет только «настоящие» области кубиков. Возвращает маску и площадь. */
function cleanComponents(labels, w, h, o) {
  const seen = new Uint8Array(w * h);
  const comps = [];
  const stack = new Int32Array(w * h);
  for (let start = 0; start < w * h; start++) {
    const lab = labels[start];
    if (lab < 0 || seen[start]) continue;
    let sp = 0;
    stack[sp++] = start;
    seen[start] = 1;
    const pix = [];
    let touches = false;
    while (sp) {
      const p = stack[--sp];
      pix.push(p);
      const x = p % w;
      const y = (p / w) | 0;
      if (x === 0 || y === 0 || x === w - 1 || y === h - 1) touches = true;
      for (let dy = -1; dy <= 1; dy++) {
        const ny = y + dy;
        if (ny < 0 || ny >= h) continue;
        for (let dx = -1; dx <= 1; dx++) {
          const nx = x + dx;
          if (nx < 0 || nx >= w) continue;
          const q = ny * w + nx;
          // Области ищем отдельно для каждого цвета: складка фона или рука, касающаяся края,
          // не утягивает за собой соседние кубики.
          if (!seen[q] && labels[q] === lab) {
            seen[q] = 1;
            stack[sp++] = q;
          }
        }
      }
    }
    comps.push({ pix, touches });
  }
  const inside = comps.filter((c) => !c.touches);
  const total = inside.reduce((s, c) => s + c.pix.length, 0);
  const minArea = Math.max(4, total * o.speckFrac);
  const keep = new Uint8Array(w * h);
  let area = 0;
  for (const c of inside) {
    if (c.pix.length < minArea) continue;
    for (const p of c.pix) keep[p] = 1;
    area += c.pix.length;
  }
  return { keep, area, removedEdge: comps.length - inside.length };
}

/**
 * Наклон раскладки по направлениям краёв: края кубиков параллельны сетке, поэтому
 * усредняем вектор (cos 4θ, sin 4θ) градиента «отличия от фона», взвешенный квадратом силы края.
 * Работает для любых фигур (в отличие от минимальной рамки, которая путается на «крестиках»).
 */
function estimateSkew(chroma, keep, w, h) {
  // Зона вокруг кубиков (расширенная маска), чтобы не ловить текстуру стола.
  const near = new Uint8Array(w * h);
  const R = 2;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (!keep[y * w + x]) continue;
      for (let dy = -R; dy <= R; dy++) {
        for (let dx = -R; dx <= R; dx++) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx >= 0 && ny >= 0 && nx < w && ny < h) near[ny * w + nx] = 1;
        }
      }
    }
  }
  let sc = 0;
  let ss = 0;
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const p = y * w + x;
      if (!near[p]) continue;
      const a = chroma[p - w - 1];
      const b = chroma[p - w];
      const c = chroma[p - w + 1];
      const d = chroma[p - 1];
      const f = chroma[p + 1];
      const g = chroma[p + w - 1];
      const hh = chroma[p + w];
      const i = chroma[p + w + 1];
      const gx = c + 2 * f + i - a - 2 * d - g;
      const gy = g + 2 * hh + i - a - 2 * b - c;
      const m2 = gx * gx + gy * gy;
      if (m2 < 1) continue;
      const t = Math.atan2(gy, gx) * 4;
      sc += m2 * Math.cos(t);
      ss += m2 * Math.sin(t);
    }
  }
  return sc === 0 && ss === 0 ? 0 : Math.atan2(ss, sc) / 4;
}

function boxAt(points, angle) {
  const ca = Math.cos(angle);
  const sa = Math.sin(angle);
  let u0 = Infinity;
  let u1 = -Infinity;
  let v0 = Infinity;
  let v1 = -Infinity;
  for (let i = 0; i < points.length; i += 2) {
    const u = points[i] * ca + points[i + 1] * sa;
    const v = -points[i] * sa + points[i + 1] * ca;
    if (u < u0) u0 = u;
    if (u > u1) u1 = u;
    if (v < v0) v0 = v;
    if (v > v1) v1 = v;
  }
  return [u0 - 0.5, u1 + 0.5, v0 - 0.5, v1 + 0.5];
}

/**
 * Анализ снимка.
 * @param img {data, width, height} — RGBA-кадр (область рамки с небольшим полем вокруг)
 * @param target 2D-массив ключей палитры или null
 * @returns {ok, reason, rotation, cells, mismatches, found, expected, ...}
 */
export function analyze(img, target, palette, opts = {}) {
  const o = { ...DEFAULTS, ...opts };
  const small = downscale(img, o.work);
  const { w, h } = small;
  const { labels, bg, lightBg, keys, fgness } = classify(small, palette, o);
  const { keep, area } = cleanComponents(labels, w, h, o);
  const expected = target.flat().filter(Boolean).length;
  const base = { ok: false, expected, found: 0, bg, lightBg, rotation: 0, cells: [], mismatches: [], frame: null };

  if (area < Math.max(6, w * h * o.minAreaFrac)) return { ...base, reason: 'empty' };

  const points = [];
  for (let p = 0; p < w * h; p++) if (keep[p]) points.push(p % w, (p / w) | 0);
  const skew = { angle: estimateSkew(fgness, keep, w, h) };
  const [u0, u1, v0, v1] = boxAt(points, skew.angle);
  const ca = Math.cos(skew.angle);
  const sa = Math.sin(skew.angle);
  const toXY = (u, v) => [u * ca - v * sa, u * sa + v * ca];
  const labelAt = (u, v) => {
    const [x, y] = toXY(u, v);
    const ix = Math.round(x);
    const iy = Math.round(y);
    if (ix < 0 || iy < 0 || ix >= w || iy >= h) return -1;
    const p = iy * w + ix;
    return keep[p] ? labels[p] : -1;
  };

  let best = null;
  for (let k = 0; k < 4; k++) {
    const T = rotateGrid(target, k);
    const rows = T.length;
    const cols = T[0].length;
    const cw = (u1 - u0) / cols;
    const ch = (v1 - v0) / rows;
    const aspect = cw / ch;
    if (aspect < o.aspectMin || aspect > o.aspectMax) continue;
    const cells = [];
    const mismatches = [];
    const n = 7;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const counts = new Map();
        let fg = 0;
        for (let i = 0; i < n; i++) {
          for (let j = 0; j < n; j++) {
            const fu = 0.5 + ((i + 0.5) / n - 0.5) * o.cellInner;
            const fv = 0.5 + ((j + 0.5) / n - 0.5) * o.cellInner;
            const l = labelAt(u0 + (c + fu) * cw, v0 + (r + fv) * ch);
            if (l >= 0) {
              fg++;
              counts.set(l, (counts.get(l) || 0) + 1);
            }
          }
        }
        let got = null;
        if (fg / (n * n) >= o.cellFill) {
          let top = -1;
          let topN = -1;
          for (const [l, cnt] of counts) if (cnt > topN) [top, topN] = [l, cnt];
          got = top < keys.length ? keys[top] : UNKNOWN;
        }
        const want = T[r][c].v;
        const corners = [
          [0, 0], [1, 0], [1, 1], [0, 1],
        ].map(([a, b]) => {
          const [x, y] = toXY(u0 + (c + a) * cw, v0 + (r + b) * ch);
          return [x * small.scale, y * small.scale];
        });
        const cell = { r, c, src: T[r][c].src, want, got, ok: want === got, corners };
        cells.push(cell);
        if (!cell.ok) mismatches.push(cell);
      }
    }
    const score = mismatches.length + Math.abs(Math.log(aspect)) * 0.6;
    if (!best || score < best.score) best = { k, rows, cols, cells, mismatches, score, aspect };
  }

  const frame = [
    [u0, v0], [u1, v0], [u1, v1], [u0, v1],
  ].map(([u, v]) => toXY(u, v).map((q) => q * small.scale));
  if (!best) return { ...base, reason: 'shape', frame, skewDeg: (skew.angle * 180) / Math.PI };

  const found = best.cells.filter((c) => c.got).length;
  const ok = best.mismatches.length === 0;
  return {
    ...base,
    ok,
    reason: ok ? 'match' : 'colors',
    rotation: best.k * 90,
    rows: best.rows,
    cols: best.cols,
    cells: best.cells,
    mismatches: best.mismatches,
    found,
    frame,
    skewDeg: (skew.angle * 180) / Math.PI,
  };
}
