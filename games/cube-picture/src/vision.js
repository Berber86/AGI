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
  chromaScale: 0.08, // «единица» расстояния по log-цветности
  logEps: 0.15,
  lumScale: 0.2, // «единица» расстояния по log-светлоте (после поправки на общую яркость сцены)
  maxDist: 3.2, // дальше от всех эталонов — «неизвестный цвет» (см. TOLERANCE)
  strongColor: 0.1, // неизвестный, но явно цветной пиксель — посторонний предмет
  minAreaFrac: 0.003, // минимальная площадь всех кубиков (доля кадра)
  speckFrac: 0.025, // области меньше этой доли от всех кубиков — мусор
  fragFrac: 0.4, // обрывок у выкинутой краевой области меньше этой доли кубика — тоже мусор
  cellInner: 0.5, // доля клетки, по которой голосуем (центр)
  cellFill: 0.4, // доля «кубиковых» пикселей, чтобы клетка считалась занятой
  aspectMin: 0.6,
  aspectMax: 1.65,
  shapeAspectMin: 0.8, // режим «форма»: допустимая вытянутость клетки
  shapeAspectMax: 1.25,
  gainMin: 0.6, // пределы подстройки насыщенности снимка
  gainMax: 1.7,
  castMax: 0.25, // предел подстройки оттенка снимка (в log-цветности)
  adaptNoise: 0.1, // разброс цвета одного кубика в log-цветности
  adaptGainSd: 0.2, // насколько обычно телефон меняет насыщенность
  adaptCastSd: 0.1,
  fitMinSep: 3, // цвета ближе этого (в единицах chromaScale) к соседу — не голосуют в подстройке
  pairGap: 0.35, // минимальный зазор между группами похожих цветов (в долях расстояния между эталонами)
  pairLoose: 0.75, // один цвет пары в картинке: клетка засчитывается, пока не дальше этой доли к соседу
  fitMinFrac: 0.06, // цвет голосует, если занимает хотя бы такую долю пикселей (одна клетка из 10) // насколько обычно остаётся сдвиг оттенка после деления на фон
  mode: 'color', // color — важны цвета; shape — важна только форма, цвета любые
  tolerance: 'wide',
};

/** Допуск цвета. wide — по умолчанию: подстройка под снимок, похожие цвета набора засчитываются. */
export const TOLERANCE = {
  strict: { maxDist: 3.2, lumScale: 0.2, adapt: false, twins: false, share: 2 },
  wide: { maxDist: 4.5, lumScale: 0.3, adapt: true, twins: true, share: 0.3, relative: true },
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

// Цветность в логарифмах: u = проекция (ln r, ln g, ln b) на плоскость, перпендикулярную яркости.
// В этих координатах баланс белого — сдвиг, а тоновая кривая/насыщенность камеры — растяжение,
// поэтому подстройка «g·u + t» описывает их почти точно.
const E1 = [Math.SQRT1_2, -Math.SQRT1_2, 0];
const E2 = [1 / Math.sqrt(6), 1 / Math.sqrt(6), -2 / Math.sqrt(6)];
let EPS = 0.08; // смягчение логарифма у почти нулевых каналов (синий у жёлтого)
const toUV = (r, g, b) => {
  const l = [Math.log(Math.max(r, 0) + EPS), Math.log(Math.max(g, 0) + EPS), Math.log(Math.max(b, 0) + EPS)];
  return [l[0] * E1[0] + l[1] * E1[1], l[0] * E2[0] + l[1] * E2[1] + l[2] * E2[2]];
};

/** Эталоны палитры: цветность и относительная яркость. */
function refsOf(palette) {
  return Object.keys(palette).map((k) => {
    const rel = palette[k].rel;
    const sum = rel[0] + rel[1] + rel[2];
    const c = rel.map((v) => v / sum);
    return { key: k, c, uv: toUV(rel[0], rel[1], rel[2]), y: sum / 3, decoy: !!palette[k].decoy };
  });
}

/** Цвет фона: медиана по краю кадра; при adapt — ещё и плавный перепад света слева-направо и сверху-вниз. */
function backgroundOf(small, o) {
  const { w, h, rgb } = small;
  const bw = Math.max(1, Math.round(Math.min(w, h) * o.border));
  const sides = { all: [[], [], []], l: [[], [], []], r: [[], [], []], t: [[], [], []], b: [[], [], []] };
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const L = x < bw;
      const R = x >= w - bw;
      const T = y < bw;
      const B = y >= h - bw;
      if (!(L || R || T || B)) continue;
      const i = (y * w + x) * 3;
      for (let ch = 0; ch < 3; ch++) {
        const v = rgb[i + ch];
        sides.all[ch].push(v);
        if (L) sides.l[ch].push(v);
        if (R) sides.r[ch].push(v);
      }
    }
  }
  // Верх и низ собираем по столбцам, чтобы отрезки шли вдоль края.
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < bw; y++) {
      const it = (y * w + x) * 3;
      const ib = ((h - 1 - y) * w + x) * 3;
      for (let ch = 0; ch < 3; ch++) {
        sides.t[ch].push(rgb[it + ch]);
        sides.b[ch].push(rgb[ib + ch]);
      }
    }
  }
  const med = (k) => sides[k].map((a) => median(a));
  // Край стороны — медиана медиан 5 отрезков: рука или игрушка на трети края не сдвигает оценку.
  const segMed = (k) =>
    sides[k].map((a) => {
      const n = a.length;
      const parts = [];
      for (let i = 0; i < 5; i++) parts.push(median(a.slice(Math.floor((i * n) / 5), Math.floor(((i + 1) * n) / 5))));
      return median(parts);
    });
  const bg = med('all').map((v) => Math.max(8, v));
  let gx = [0, 0, 0];
  let gy = [0, 0, 0];
  if (o.adapt) {
    const [l, r, t, b] = ['l', 'r', 't', 'b'].map(segMed);
    const lim = (d, ch) => Math.max(-0.35 * bg[ch], Math.min(0.35 * bg[ch], d));
    gx = bg.map((_, ch) => lim(r[ch] - l[ch], ch));
    gy = bg.map((_, ch) => lim(b[ch] - t[ch], ch));
  }
  return { bg, at: (x, y, ch) => Math.max(8, bg[ch] + gx[ch] * (x / w - 0.5) + gy[ch] * (y / h - 0.5)) };
}

/** Метки пикселей: индекс цвета палитры, keys.length = неизвестный цвет, -1 = фон. */
export function classify(small, palette, o = DEFAULTS) {
  const { w, h, rgb } = small;
  EPS = o.logEps ?? DEFAULTS.logEps;
  const keys = Object.keys(palette);
  const refs = refsOf(palette);
  const { bg, at } = backgroundOf(small, o);
  const bgMax = Math.max(...bg);
  const lightBg = bgMax > 100 && bgMax - Math.min(...bg) < 70;
  const labels = new Int8Array(w * h).fill(-1);
  const fgness = new Float32Array(w * h); // отличие от фона — для оценки наклона по краям
  const cs2 = o.chromaScale * o.chromaScale;
  const max2 = o.maxDist * o.maxDist;
  // Кандидаты: заметно отличаются от фона.
  const cand = [];
  for (let p = 0; p < w * h; p++) {
    const x = p % w;
    const yy = (p / w) | 0;
    const nr = rgb[p * 3] / at(x, yy, 0);
    const ng = rgb[p * 3 + 1] / at(x, yy, 1);
    const nb = rgb[p * 3 + 2] / at(x, yy, 2);
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
    cand.push({ p, y, sat, uv: toUV(nr, ng, nb) });
  }
  // Подстройка под снимок: телефон усиливает/приглушает цвета, фон бывает не нейтральным (кремовая
  // бумага, голубоватая тень). Ищем общее преобразование цветности u' = g·u + t, при котором пиксели
  // ближе всего к эталонам (несколько итераций «ближайший эталон → МНК»). Ошибку ребёнка это не прячет:
  // преобразование одно на весь кадр, а цвета кубиков разные.
  let g = 1;
  let t0 = 0;
  let t1 = 0;
  const nearestChroma = (q, skipDecoy = false) => {
    const u = g * q.uv[0] + t0;
    const v = g * q.uv[1] + t1;
    let best = -1;
    let bestD = Infinity;
    for (let k = 0; k < refs.length; k++) {
      if (skipDecoy && refs[k].decoy) continue;
      const d = ((u - refs[k].uv[0]) ** 2 + (v - refs[k].uv[1]) ** 2) / cs2;
      if (d < bestD) [best, bestD] = [k, d];
    }
    return [best, bestD];
  };
  // Цвета с близким «соседом» (красный/розовый) в подстройке не голосуют: именно их и нужно различать,
  // а любой их сдвиг подстройка «объяснила» бы, утягивая кубик к соседу.
  for (const r of refs) {
    if (r.decoy) continue;
    let near = Infinity;
    for (const q of refs) if (q !== r && !q.decoy) near = Math.min(near, Math.hypot(r.uv[0] - q.uv[0], r.uv[1] - q.uv[1]));
    r.noFit = near < o.fitMinSep * o.chromaScale;
  }
  if (o.adapt && cand.length >= 12) {
    for (let iter = 0; iter < 5; iter++) {
      const lim = iter === 0 ? 25 : 9;
      // Средняя цветность каждого найденного цвета: голос у цвета, а не у пикселя — иначе подстройка
      // подгоняется под случайный оттенок одного крупного кубика.
      const acc = refs.map(() => ({ n: 0, u: 0, v: 0 }));
      let total = 0;
      for (const q of cand) {
        // Ближайший игровой цвет (в блёклом снимке синий похож на голубой, фиолетовый — на сиреневый,
        // а голосовать должны именно они). В режиме «форма» подстройка выключена — там цвета не важны.
        const [k, d] = nearestChroma(q, true);
        if (d > lim) continue;
        acc[k].n++;
        acc[k].u += q.uv[0];
        acc[k].v += q.uv[1];
        total++;
      }
      if (total < 12) break;
      // Байесовская регрессия u_ref ≈ g·u + t с притяжением к «без подстройки» (g = 1, t = 0).
      const ic = 1 / (o.adaptNoise * o.adaptNoise);
      const ig = 1 / (o.adaptGainSd * o.adaptGainSd);
      const it = 1 / (o.adaptCastSd * o.adaptCastSd);
      let suu = 0;
      let su0 = 0;
      let su1 = 0;
      let sur = 0;
      let sr0 = 0;
      let sr1 = 0;
      let K = 0;
      refs.forEach((r, k) => {
        const a = acc[k];
        if (r.noFit || a.n < Math.max(4, total * o.fitMinFrac)) return;
        const u0 = a.u / a.n;
        const u1 = a.v / a.n;
        suu += u0 * u0 + u1 * u1;
        su0 += u0;
        su1 += u1;
        sur += u0 * r.uv[0] + u1 * r.uv[1];
        sr0 += r.uv[0];
        sr1 += r.uv[1];
        K++;
      });
      if (!K) break;
      if (o.debug) o.debug.push(refs.map((r, k) => acc[k].n ? `${r.key}:${acc[k].n}:${(acc[k].u / acc[k].n - r.uv[0]).toFixed(3)},${(acc[k].v / acc[k].n - r.uv[1]).toFixed(3)}` : '').filter(Boolean).join(' '));
      // Нормальные уравнения 3×3 (g, t0, t1); t выражаем через g и подставляем.
      const D = K * ic + it;
      const A = suu * ic + ig - (su0 * su0 + su1 * su1) * ic * ic / D;
      const B = sur * ic + ig - (su0 * sr0 + su1 * sr1) * ic * ic / D;
      g = Math.max(o.gainMin, Math.min(o.gainMax, B / A));
      t0 = (sr0 - g * su0) * ic / D;
      t1 = (sr1 - g * su1) * ic / D;
      const tl = Math.hypot(t0, t1);
      if (tl > o.castMax) [t0, t1] = [(t0 * o.castMax) / tl, (t1 * o.castMax) / tl];
    }
  }
  // Общий множитель яркости сцены: кубики на белой бумаге относительно темнее, чем на серой ткани,
  // но одинаково для всех цветов. Оцениваем по пикселям с уверенным совпадением по цветности.
  const ratios = [];
  for (const q of cand) {
    const [k, d] = nearestChroma(q, true);
    if (d <= 4) ratios.push(Math.log(q.y / refs[k].y));
  }
  const lumShift = ratios.length >= 12 ? median(ratios) : 0;
  // Итог: цветность + светлота с поправкой на сцену (отличает голубой от синего, сиреневый от фиолетового).
  const ls2 = o.lumScale * o.lumScale;
  const uvAdj = new Float32Array(w * h * 2).fill(NaN);
  for (const q of cand) {
    const u = g * q.uv[0] + t0;
    const v = g * q.uv[1] + t1;
    uvAdj[q.p * 2] = u;
    uvAdj[q.p * 2 + 1] = v;
    const ly = Math.log(q.y) - lumShift;
    let best = -1;
    let bestD = Infinity;
    for (let k = 0; k < refs.length; k++) {
      const d = ((u - refs[k].uv[0]) ** 2 + (v - refs[k].uv[1]) ** 2) / cs2 + (ly - Math.log(refs[k].y)) ** 2 / ls2;
      if (d < bestD) [best, bestD] = [k, d];
    }
    if (bestD <= max2) labels[q.p] = best;
    else if (q.sat >= o.strongColor) labels[q.p] = keys.length;
  }
  // Пары похожих цветов набора (красный/розовый): их в широком допуске сравниваем относительно.
  const pairs = [];
  refs.forEach((r, i) => refs.forEach((q, j) => {
    if (j > i && !r.decoy && !q.decoy && Math.hypot(r.uv[0] - q.uv[0], r.uv[1] - q.uv[1]) < o.fitMinSep * o.chromaScale) pairs.push([r, q]);
  }));
  return { labels, bg, lightBg, keys, fgness, lumShift, gain: g, cast: [t0, t1], uvAdj, pairs };
}

/**
 * Заполнение «дыр»: бледный кубик (сиреневый на сером столе) с шумом выходит дырявым и рассыпается
 * на обрывки. Пиксель фона, у которого ≥5 из 8 соседей одного цвета, получает этот цвет.
 */
function fillHoles(labels, w, h, nLabels) {
  const src = Int8Array.from(labels);
  const cnt = new Int32Array(nLabels);
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const p = y * w + x;
      if (src[p] >= 0) continue;
      cnt.fill(0);
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const l = src[p + dy * w + dx];
        if (l >= 0) cnt[l]++;
      }
      for (let l = 0; l < nLabels; l++) if (cnt[l] >= 5) labels[p] = l;
    }
  }
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
  // Рука или игрушка у края при широком допуске распадается на «рябь» из разных цветов: обрывки,
  // примыкающие к выкинутой краевой области и заметно меньше кубика, тоже выкидываем (до устойчивости).
  const compOf = new Int32Array(w * h).fill(-1);
  comps.forEach((c, i) => c.pix.forEach((p) => (compOf[p] = i)));
  const sizes = comps.filter((c) => !c.touches).map((c) => c.pix.length).sort((a, b) => b - a);
  const big = sizes.filter((v) => v >= sizes[0] * 0.25); // кубики (крупные области), без мелочи
  const cubeArea = big.length ? big[big.length >> 1] : 0;
  for (let changed = true, guard = 0; changed && guard < 20; guard++) {
    changed = false;
    for (const c of comps) {
      if (c.touches || c.pix.length >= cubeArea * o.fragFrac) continue;
      let adj = false;
      for (const p of c.pix) {
        const x = p % w;
        const y = (p / w) | 0;
        for (let dy = -1; dy <= 1 && !adj; dy++) {
          for (let dx = -1; dx <= 1 && !adj; dx++) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
            const j = compOf[ny * w + nx];
            if (j >= 0 && comps[j] !== c && comps[j].touches) adj = true;
          }
        }
        if (adj) break;
      }
      if (adj) {
        c.touches = true;
        changed = true;
      }
    }
  }
  const inside = comps.filter((c) => !c.touches);
  if (o.debug) o.debug.push('cubeArea ' + cubeArea + ' inside ' + inside.map((c) => `${labels[c.pix[0]]}:${c.pix.length}@${c.pix[0] % w},${(c.pix[0] / w) | 0}`).join(' '));
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
 * Похожие цвета набора (красный/розовый) при широком допуске сравниваются относительно:
 * свет может сдвинуть оба цвета, но «красные» клетки должны остаться краснее «розовых».
 * t — положение клетки на отрезке «эталон A (0) → эталон B (1)».
 */
function relativeShades(cells, pairs, o) {
  for (const [A, B] of pairs) {
    const fam = (k) => k === A.key || k === B.key;
    const dx = B.uv[0] - A.uv[0];
    const dy = B.uv[1] - A.uv[1];
    const L2 = dx * dx + dy * dy;
    const proj = (uv) => ((uv[0] - A.uv[0]) * dx + (uv[1] - A.uv[1]) * dy) / L2;
    const inFam = cells.filter((c) => fam(c.want) && fam(c.got) && c.uv);
    if (!inFam.length) continue;
    const tA = inFam.filter((c) => c.want === A.key).map((c) => proj(c.uv));
    const tB = inFam.filter((c) => c.want === B.key).map((c) => proj(c.uv));
    let accept;
    if (tA.length && tB.length) {
      // Оба цвета в картинке. Свет сдвигает обе группы вместе: оцениваем общий сдвиг δ по средним групп,
      // затем каждая клетка должна быть по свою сторону от сдвинутой середины, а группы — заметно разными.
      const mean = (a) => a.reduce((s, v) => s + v, 0) / a.length;
      const delta = (mean(tA) + mean(tB) - 1) / 2;
      const mid = 0.5 + delta;
      accept = tA.every((t) => t < mid) && tB.every((t) => t > mid) && mean(tB) - mean(tA) >= o.pairGap;
      if (accept) for (const c of inFam) c.ok = true;
      else {
        // Не сошлось — где ошибка? Делим клетки пары по самому большому разрыву на «ближе к A» и «ближе к B»
        // (относительно, а не по эталонам). Если явного разрыва нет — все кубики одного оттенка, и тогда
        // верны обычные метки.
        const ts = inFam.map((c) => ({ c, t: proj(c.uv) })).sort((a, b) => a.t - b.t);
        let cut = -1;
        let gap = 0;
        for (let i = 0; i + 1 < ts.length; i++) if (ts[i + 1].t - ts[i].t > gap) [gap, cut] = [ts[i + 1].t - ts[i].t, i];
        if (gap >= o.pairGap) {
          // Из двух объяснений (обычные метки или разделение по разрыву) берём то, где ошибок меньше:
          // ребёнку лучше показать один неверный кубик, чем два сомнительных.
          const byCut = ts.map((e, i) => e.c.want === (i <= cut ? A.key : B.key));
          const wrongCut = byCut.filter((v) => !v).length;
          const wrongNow = ts.filter((e) => !e.c.ok).length;
          if (wrongCut < wrongNow) ts.forEach((e, i) => (e.c.ok = byCut[i]));
        }
      }
    } else {
      // Только один цвет пары: засчитываем, пока клетка не стала явно соседним цветом.
      for (const c of inFam) {
        const t = proj(c.uv);
        if (c.want === A.key ? t <= o.pairLoose : t >= 1 - o.pairLoose) c.ok = true;
      }
    }
  }
}

/**
 * Анализ снимка.
 * @param img {data, width, height} — RGBA-кадр (область рамки с небольшим полем вокруг)
 * @param target 2D-массив ключей палитры или null
 * @returns {ok, reason, rotation, cells, mismatches, found, expected, ...}
 */
export function analyze(img, target, palette, opts = {}) {
  const o = { ...DEFAULTS, ...TOLERANCE[opts.tolerance || DEFAULTS.tolerance], ...opts };
  const shapeOnly = o.mode === 'shape';
  if (shapeOnly) {
    // Форма: цвет не важен — всё, что заметно отличается от фона, считается кубиком;
    // клетки должны быть почти квадратными (иначе 2 кубика «растягиваются» на сетку из 3).
    o.maxDist = Infinity;
    o.adapt = false;
    o.aspectMin = Math.max(o.aspectMin, o.shapeAspectMin);
    o.aspectMax = Math.min(o.aspectMax, o.shapeAspectMax);
  }
  // «Двойники»: цвет набора, который засчитывается за цвет картинки (голубой — за синий).
  const twinOf = (k) => (o.twins && palette[k] && palette[k].twin) || null;
  const small = downscale(img, o.work);
  const { w, h } = small;
  const { labels, bg, lightBg, keys, fgness, uvAdj, pairs } = classify(small, palette, o);
  fillHoles(labels, w, h, keys.length + 1);
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
  const pixAt = (u, v) => {
    const [x, y] = toXY(u, v);
    const ix = Math.round(x);
    const iy = Math.round(y);
    if (ix < 0 || iy < 0 || ix >= w || iy >= h) return -1;
    const p = iy * w + ix;
    return keep[p] ? p : -1;
  };
  const labelAt = (u, v) => {
    const p = pixAt(u, v);
    return p < 0 ? -1 : labels[p];
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
        let su = 0;
        let sv = 0;
        let sn = 0;
        for (let i = 0; i < n; i++) {
          for (let j = 0; j < n; j++) {
            const fu = 0.5 + ((i + 0.5) / n - 0.5) * o.cellInner;
            const fv = 0.5 + ((j + 0.5) / n - 0.5) * o.cellInner;
            const px = pixAt(u0 + (c + fu) * cw, v0 + (r + fv) * ch);
            const l = px < 0 ? -1 : labels[px];
            if (l >= 0) {
              fg++;
              counts.set(l, (counts.get(l) || 0) + 1);
              if (!Number.isNaN(uvAdj[px * 2])) {
                su += uvAdj[px * 2];
                sv += uvAdj[px * 2 + 1];
                sn++;
              }
            }
          }
        }
        let got = null;
        const want = T[r][c].v;
        let ok;
        if (fg / (n * n) >= o.cellFill) {
          let top = -1;
          let topN = -1;
          for (const [l, cnt] of counts) if (cnt > topN) [top, topN] = [l, cnt];
          got = top < keys.length ? keys[top] : UNKNOWN;
          if (shapeOnly) ok = !!want;
          else {
            // Доля пикселей нужного цвета (с двойниками): кубик, который камера видит «наполовину розовым»,
            // при широком допуске засчитывается за красный.
            let wantN = 0;
            for (const [l, cnt] of counts) {
              const k = keys[l];
              if (k && (k === want || twinOf(k) === want)) wantN += cnt;
            }
            ok = !!want && (got === want || twinOf(got) === want || wantN >= o.share * fg);
          }
        } else ok = !want;
        const corners = [
          [0, 0], [1, 0], [1, 1], [0, 1],
        ].map(([a, b]) => {
          const [x, y] = toXY(u0 + (c + a) * cw, v0 + (r + b) * ch);
          return [x * small.scale, y * small.scale];
        });
        const cell = { r, c, src: T[r][c].src, want, got, ok, corners, uv: sn ? [su / sn, sv / sn] : null };
        cells.push(cell);
      }
    }
    if (!shapeOnly && o.relative) relativeShades(cells, pairs, o);
    mismatches.length = 0;
    for (const cell of cells) if (!cell.ok) mismatches.push(cell);
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
