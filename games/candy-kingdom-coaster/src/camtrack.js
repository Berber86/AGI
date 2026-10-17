// camtrack.js — камера как «компас взгляда»: яркая метка (печатная или
// реальный предмет вроде малиновой коробки) через заднюю камеру телефона.
// Конвейер из стенда трекинга: кадр -> маска по оттенку (HSV) ->
// КРУПНЕЙШЕЕ связное пятно -> центроид -> yaw/pitch по геометрии камеры.
//
// ПРОИЗВОДИТЕЛЬНОСТЬ (полевой урок 1–3 FPS): снятие кадра с видео и
// анализ НЕЛЬЗЯ делать на главном потоке рядом с WebGL — getImageData
// синхронно сбрасывает GPU-конвейер. Поэтому в поездке конвейер живёт
// в Web Worker (camtrack-worker.js): главный поток раз в ~100 мс
// отдаёт снимок кадра (createImageBitmap) и получает готовые углы.
// На главном потоке анализ остался только для подготовки (превью,
// «Взять цвет») и как фолбэк, если Worker недоступен.

export const CAM_COLORS = {
  raspberry: { label: 'Малиновый', hue: 338, css: '#d6336c' },
  orange: { label: 'Оранжевый', hue: 16, css: '#f15a24' },
  magenta: { label: 'Маджента', hue: 300, css: '#ff00ff' },
  lime: { label: 'Лайм', hue: 140, css: '#22ff66' },
  cyan: { label: 'Циан', hue: 190, css: '#00e5ff' },
};

export function hueOf(r, g, b) {
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
  if (d === 0) return { h: 0, sat: 0, val: mx / 255 };
  let hue;
  if (mx === r) hue = ((g - b) / d) % 6;
  else if (mx === g) hue = (b - r) / d + 2;
  else hue = (r - g) / d + 4;
  hue *= 60; if (hue < 0) hue += 360;
  return { h: hue, sat: d / mx, val: mx / 255 };
}

// Крупнейшее связное пятно целевого оттенка (чужие предметы того же
// цвета не уводят центроид — урок стенда с «хлебными пиктограммами»).
export function analyzeColorBlob(data, w, h, specHue, tol = 26, satMin = 0.42) {
  const mask = new Uint8Array(w * h);
  let maskCount = 0;
  const overflow = w * h * 0.35;
  for (let i = 0, px = 0; px < w * h; px++, i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const mx = Math.max(r, g, b);
    if (mx < 60) continue;
    const mn = Math.min(r, g, b), d = mx - mn;
    if (d < mx * satMin) continue; // дешёвый отсев до вычисления оттенка
    let hue;
    if (mx === r) hue = ((g - b) / d) % 6;
    else if (mx === g) hue = (b - r) / d + 2;
    else hue = (r - g) / d + 4;
    hue *= 60; if (hue < 0) hue += 360;
    let dh = Math.abs(hue - specHue); if (dh > 180) dh = 360 - dh;
    if (dh <= tol) { mask[px] = 1; if (++maskCount > overflow) return { found: false, count: maskCount, overflow: true }; }
  }
  const seen = new Uint8Array(w * h);
  const stack = [];
  let best = null;
  for (let start = 0; start < w * h; start++) {
    if (!mask[start] || seen[start]) continue;
    let count = 0, sx = 0, sy = 0, minX = w, maxX = -1, minY = h, maxY = -1;
    stack.length = 0; stack.push(start); seen[start] = 1;
    while (stack.length) {
      const cur = stack.pop();
      const x = cur % w, y = (cur / w) | 0;
      count++; sx += x; sy += y;
      if (x < minX) minX = x; if (x > maxX) maxX = x;
      if (y < minY) minY = y; if (y > maxY) maxY = y;
      if (x > 0 && mask[cur - 1] && !seen[cur - 1]) { seen[cur - 1] = 1; stack.push(cur - 1); }
      if (x < w - 1 && mask[cur + 1] && !seen[cur + 1]) { seen[cur + 1] = 1; stack.push(cur + 1); }
      if (y > 0 && mask[cur - w] && !seen[cur - w]) { seen[cur - w] = 1; stack.push(cur - w); }
      if (y < h - 1 && mask[cur + w] && !seen[cur + w]) { seen[cur + w] = 1; stack.push(cur + w); }
    }
    if (!best || count > best.count) best = { count, sx, sy, minX, maxX, minY, maxY };
  }
  if (!best || best.count < 40 || best.count > w * h * 0.7) return { found: false, count: best ? best.count : 0, bw: 0, bh: 0, fill: 0 };
  // bbox и заполненность — бесплатная проверка формы: настоящая метка это
  // горизонтальный прямоугольник, а не «абы что» (блик, кабель, круг).
  const bw = best.maxX - best.minX + 1;
  const bh = best.maxY - best.minY + 1;
  return {
    found: true, count: best.count, u: best.sx / best.count, v: best.sy / best.count,
    bw, bh, fill: +(best.count / (bw * bh)).toFixed(3),
  };
}

// Дешёвый экспериментальный анализ жестов без тяжёлой hand-pose модели.
// Маска и silhouette-профиль намеренно консервативны: при плохом кадре
// результат false, а не догадка. V и thumbs-up возвращаются одним Worker
// результатом, чтобы не заводить второй camera/runtime pipeline.
function skinMask(data, w, h) {
  const mask = new Uint8Array(w * h);
  let count = 0;
  for (let i = 0, px = 0; px < w * h; px++, i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const y = 0.299 * r + 0.587 * g + 0.114 * b;
    const cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b;
    const cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;
    // Broad enough for different phones/skin tones; geometry rejects clutter.
    if (y < 35 || cb < 68 || cb > 145 || cr < 118 || cr > 192) continue;
    mask[px] = 1;
    count++;
  }
  return { mask, count };
}

function largestSkinComponent(mask, w, h) {
  const seen = new Uint8Array(w * h);
  const stack = [];
  let best = null;
  for (let start = 0; start < w * h; start++) {
    if (!mask[start] || seen[start]) continue;
    let count = 0, minX = w, minY = h, maxX = 0, maxY = 0;
    const points = [];
    stack.length = 0;
    stack.push(start);
    seen[start] = 1;
    while (stack.length) {
      const cur = stack.pop();
      const x = cur % w, y = (cur / w) | 0;
      points.push(cur);
      count++;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
      if (x > 0 && mask[cur - 1] && !seen[cur - 1]) { seen[cur - 1] = 1; stack.push(cur - 1); }
      if (x < w - 1 && mask[cur + 1] && !seen[cur + 1]) { seen[cur + 1] = 1; stack.push(cur + 1); }
      if (y > 0 && mask[cur - w] && !seen[cur - w]) { seen[cur - w] = 1; stack.push(cur - w); }
      if (y < h - 1 && mask[cur + w] && !seen[cur + w]) { seen[cur + w] = 1; stack.push(cur + w); }
    }
    if (!best || count > best.count) best = { count, minX, minY, maxX, maxY, points };
  }
  return best;
}

// Diagnostics for the standalone gesture room. Returns the same production
// skin mask plus a concise reason when the silhouette gate rejects the frame.
export function analyzeSkinMaskDiagnostics(data, w, h) {
  const { mask, count } = skinMask(data, w, h);
  const minMask = Math.max(70, w * h * 0.004);
  const minComponent = Math.max(70, w * h * 0.006);
  let best = null;
  let reason = 'shape-check';
  if (count >= minMask && count <= w * h * 0.75) best = largestSkinComponent(mask, w, h);
  if (count < minMask) reason = 'too-few-skin-pixels';
  else if (count > w * h * 0.75) reason = 'skin-mask-covers-background';
  else if (!best) reason = 'no-connected-hand-region';
  else if (best.count < minComponent) reason = 'hand-region-too-small';
  else {
    const bw = best.maxX - best.minX + 1;
    const bh = best.maxY - best.minY + 1;
    if (bw < w * 0.12 || bh < h * 0.16) reason = 'hand-region-too-small-in-frame';
    else if (bw > w * 0.9 || bh > h * 0.95) reason = 'hand-region-cropped-or-too-large';
  }
  return {
    mask, skinPixels: count, largestPixels: best ? best.count : 0,
    bounds: best ? { x: best.minX, y: best.minY, width: best.maxX - best.minX + 1, height: best.maxY - best.minY + 1 } : null,
    reason,
  };
}

function skinSilhouette(data, w, h) {
  const { mask, count } = skinMask(data, w, h);
  if (count < Math.max(70, w * h * 0.004) || count > w * h * 0.75) return null;
  const best = largestSkinComponent(mask, w, h);
  if (!best || best.count < Math.max(70, w * h * 0.006)) return null;
  const bw = best.maxX - best.minX + 1;
  const bh = best.maxY - best.minY + 1;
  if (bw < w * 0.12 || bh < h * 0.16 || bw > w * 0.9 || bh > h * 0.95) return null;

  const top = new Int16Array(bw);
  top.fill(best.maxY + 1);
  for (const cur of best.points) {
    const x = (cur % w) - best.minX;
    const y = (cur / w) | 0;
    if (y < top[x]) top[x] = y + best.minY;
  }
  const smooth = new Float32Array(bw);
  for (let x = 0; x < bw; x++) {
    let sum = 0, n = 0;
    for (let k = Math.max(0, x - 2); k <= Math.min(bw - 1, x + 2); k++) {
      if (top[k] <= best.maxY) { sum += top[k]; n++; }
    }
    smooth[x] = n ? sum / n : best.maxY + 1;
  }
  return { ...best, bw, bh, smooth };
}

// Жест V: две высокие раздельные вершины силуэта.
export function analyzeVGesture(data, w, h) {
  const best = skinSilhouette(data, w, h);
  if (!best) return { found: false, confidence: 0 };
  const { minX, minY, maxY, bw, bh, smooth } = best;
  const candidates = [];
  const topLimit = minY + bh * 0.42;
  for (let x = Math.max(2, Math.floor(bw * 0.12)); x < Math.min(bw - 2, Math.ceil(bw * 0.88)); x++) {
    if (smooth[x] > topLimit || smooth[x] > smooth[x - 1] || smooth[x] > smooth[x + 1]) continue;
    candidates.push({ x, y: smooth[x] });
  }
  if (candidates.length < 2) return { found: false, confidence: 0 };
  candidates.sort((a, b) => a.y - b.y);
  let pair = null;
  for (let i = 0; i < candidates.length && !pair; i++) for (let j = i + 1; j < candidates.length; j++) {
    const a = candidates[i], b = candidates[j];
    const gap = Math.abs(a.x - b.x);
    if (gap < bw * 0.14 || gap > bw * 0.78) continue;
    const lo = Math.min(a.x, b.x), hi = Math.max(a.x, b.x);
    let valley = 0;
    for (let x = lo; x <= hi; x++) valley = Math.max(valley, smooth[x]);
    const depth = valley - Math.max(a.y, b.y);
    if (depth < bh * 0.055) continue;
    pair = { a, b, gap, depth };
    break;
  }
  if (!pair) return { found: false, confidence: 0 };
  const confidence = Math.min(1, 0.45 + pair.depth / Math.max(1, bh) + pair.gap / Math.max(1, bw) * 0.35);
  return {
    found: confidence >= 0.55,
    confidence,
    peaks: [
      { u: (minX + pair.a.x) / w, v: pair.a.y / h },
      { u: (minX + pair.b.x) / w, v: pair.b.y / h },
    ],
  };
}

// Thumbs-up: one short, broad high protrusion attached to a wide fist.
// The single-peak and height checks deliberately reject a V and a long,
// narrow index finger; it is still a heuristic, so temporal debounce remains.
export function analyzeThumbGesture(data, w, h) {
  const best = skinSilhouette(data, w, h);
  if (!best) return { found: false, confidence: 0 };
  const { minX, minY, maxY, bw, bh, smooth, points, count } = best;
  const topLimit = minY + bh * 0.42;
  const candidates = [];
  for (let x = Math.max(2, Math.floor(bw * 0.1)); x < Math.min(bw - 2, Math.ceil(bw * 0.9)); x++) {
    if (smooth[x] > topLimit || smooth[x] > smooth[x - 1] || smooth[x] > smooth[x + 1]) continue;
    const previous = candidates[candidates.length - 1];
    // A rounded thumb top can produce two adjacent local minima; merge that
    // plateau, while the valley between V fingers remains a separate peak.
    if (previous && x - previous.x < bw * 0.30) {
      if (smooth[x] < previous.y) previous.x = x, previous.y = smooth[x];
    } else candidates.push({ x, y: smooth[x] });
  }
  if (candidates.length !== 1) return { found: false, confidence: 0 };
  const peak = candidates[0];
  const ratio = peak.x / Math.max(1, bw - 1);
  // A thumb is attached to a side of the fist, not centred like an index.
  if (ratio > 0.43 && ratio < 0.57) return { found: false, confidence: 0 };
  const sample = (ratioX) => smooth[Math.max(0, Math.min(bw - 1, Math.round(ratioX * (bw - 1))))];
  const shoulderY = Math.max(sample(0.14), sample(0.86));
  const rise = shoulderY - peak.y;
  if (rise < bh * 0.16 || rise > bh * 0.62) return { found: false, confidence: 0 };
  const peakBand = peak.y + bh * 0.16;
  let peakWidth = 0;
  for (const y of smooth) if (y <= peakBand) peakWidth++;
  if (peakWidth < bw * 0.16 || peakWidth > bw * 0.55) return { found: false, confidence: 0 };
  const bodyPixels = points.reduce((n, cur) => n + (((cur / w) | 0) >= minY + bh * 0.50 ? 1 : 0), 0);
  if (bodyPixels < count * 0.22 || bw < w * 0.16) return { found: false, confidence: 0 };
  const confidence = Math.min(1,
    0.48 + rise / Math.max(1, bh) * 0.42 + Math.min(0.22, peakWidth / Math.max(1, bw) * 0.30)
  );
  return {
    found: confidence >= 0.58,
    confidence,
    tip: { u: (minX + peak.x) / w, v: peak.y / h },
    silhouette: { width: bw / w, height: bh / h },
    top: maxY,
  };
}

export function analyzeGestures(data, w, h) {
  const v = analyzeVGesture(data, w, h);
  return { ...v, v, thumb: analyzeThumbGesture(data, w, h) };
}

// Две независимые цветовые метки. Пока размеры кадра малы, повторный
// проход дешевле и надёжнее сложной общей маски: каждая коробка получает
// собственное крупнейшее связное пятно, а Worker всё равно забирает кадр
// с главного потока один раз.
export function analyzeColorBlobs(data, w, h, specHues, tol = 26, satMin = 0.42) {
  return specHues.map((hue) => analyzeColorBlob(data, w, h, hue, tol, satMin));
}

// Углы из центроида; центр калибровки — НОРМАЛИЗОВАННЫЙ (0..1), чтобы
// ярусы разрешения не ломали ноль.
export function anglesFromCentroid(u, v, w, h, c0n, fovDeg) {
  const fx = (w / 2) / Math.tan(((fovDeg * Math.PI) / 180) / 2);
  const cx = c0n ? c0n.x * w : w / 2;
  const cy = c0n ? c0n.y * h : h / 2;
  return {
    yaw: (Math.atan((u - cx) / fx) * 180) / Math.PI,
    // Знак pitch — как у yaw: измеряем поворот ГОЛОВЫ, а не положение
    // метки. Голова вверх -> метка уходит ВНИЗ кадра (v растёт) -> pitch+.
    // (Было наоборот: полевой отчёт «смотрю вверх — игра смотрит вниз».)
    pitch: (Math.atan((v - cy) / fx) * 180) / Math.PI,
  };
}

const THREE_CLAMP = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);

const TIER_W = [160, 128, 112];
const TIER_MS = [100, 130, 170];

// Пара меток: насколько согласованно должны поворачиваться обе коробки, чтобы
// им можно было верить как паре; с какой скоростью (°/с) может честно ехать
// взгляд (частота кадров зависит от tier, поэтому лимит по времени, а не «за
// кадр»); ниже какого доверия к стороне метка считается потерянной; через
// сколько мс без метки угол принимается заново, а не как подозрительный скачок.
const DUAL_PAIR_GATE_DEG = 6;
const DUAL_MAX_RATE_DPS = 260;
const DUAL_MIN_STEP_DEG = 8;
const DUAL_MAX_STEP_CAP_DEG = 30;
const DUAL_TRUST_MIN = 0.25;
const DUAL_REANCHOR_MS = 900;

// Пространственная модель пары. Метки закреплены в мире, поэтому их порядок,
// расстояние и место на калибровке не меняются — по этим инвариантам чужое
// пятно отличается от метки. Скорость головы копится в истории за последние
// секунды: по ней предсказывается, где метка обязана быть в следующем кадре и
// может ли она вообще попасть в кадр.
const DUAL_HISTORY_MS = 2500;      // сколько секунд истории поворотов помним
const DUAL_HISTORY_MAX = 60;       // и сколько кадров максимум
const DUAL_RATE_READY_MS = 150;    // раньше этого о скорости судить нечем
const DUAL_RATE_LIMIT_DPS = 400;   // физиологичный предел скорости головы
const DUAL_RESIDUAL_DEG = 7;       // базовый допуск «метка там, где её ждут»
const DUAL_RESIDUAL_MAX_DEG = 30;
const DUAL_EDGE_SLACK_DEG = 8;     // запас у края: за ним метка уже «вне кадра»
const DUAL_PREDICT_S = 0.35;       // дальше этого срока не экстраполируем

// Метка становится «сущностью» только после явного наблюдения: одиночный
// кадр на 0.1 с — ещё не метка, нужно не меньше 0.15 с. Однажды подтверждённая
// метка остаётся сущностью, пока не пропадёт надолго (4 с — столько же живёт
// удержание взгляда): вернувшаяся знакомая коробка не ждёт подтверждения
// заново, а вот всё, что появилось «из небытия», обязано прожить 0.15 с.
const MARKER_CONFIRM_MS = 150;  // сущность: 0.15 с явного наблюдения
const MARKER_IDENTITY_MS = 4000;
// Метка — горизонтальный прямоугольник: длинная сторона в горизонтальной
// плоскости. Заполненность отсекает блики/контуры, пропорции — круги и
// вертикальные предметы; у края кадра bbox обрезан, там судим только по
// заполненности (виден кусок прямоугольника — это нормально).
// Пропорции сравниваются с КАЛИБРОВАННЫМИ: при повороте головы перспектива
// сжимает ширину (cos угла), и абсолютный порог отвергал бы честную метку.
const MARKER_ASPECT_MIN = 1.12;
const MARKER_ASPECT_MAX = 5.5;
const MARKER_FILL_MIN = 0.5;
const MARKER_ASPECT_BASE_LO = 0.62; // перспектива: ширина сжимается как cos угла
const MARKER_ASPECT_BASE_HI = 1.6;
const MARKER_SHAPE_MIN_W = 10;     // меньше — форма не различима, не судим
const MARKER_SHAPE_MIN_H = 8;

export class CamTracker {
  constructor() {
    this.hue = CAM_COLORS.raspberry.hue;
    this.hueA = CAM_COLORS.orange.hue;
    this.hueB = CAM_COLORS.raspberry.hue;
    this.dual = false;
    this.tol = 26;
    this.satMin = 0.42;
    this.fovDeg = 65;
    this.video = null;
    this.stream = null;
    this.running = false;
    this.synthetic = false; // QA: кадры подаются вручную
    this.found = false;
    this.yaw = 0;
    this.pitch = 0;
    this.u = 0; this.v = 0; this.count = 0;
    this.frameW = 320; this.frameH = 240;
    this.markers = [
      { id: 'left', found: false, u: 0, v: 0, count: 0 },
      { id: 'right', found: false, u: 0, v: 0, count: 0 },
    ];
    this.dualVisible = [];
    this.lastLostMarker = null;
    this.lostMarkers = [];
    this.dualCalibration = null; // raw yaw/pitch for each box at «прямо»
    this.dualBaseCount = null;   // размер пятна на калибровке (отсев мусора)
    this.dualBaseShape = null;   // пропорции/заполненность каждой метки на калибровке
    this.dualTrust = { left: 1, right: 1 };
    this.reanchorPending = null;
    this.lastAcceptAt = 0;
    this.pairState = 'idle';
    this.dualModel = null;       // порядок/расстояние/места меток на калибровке
    this.dualHistory = [];       // история углов поворота головы за секунды
    this.yawRate = 0;            // °/с: оценка скорости по этой истории
    this.dualUsed = [];          // чьи метки реально пошли в счёт
    this.dualMissing = { left: 0, right: 0 }; // кадров, где метка обязана быть, а её нет
    this.markerEntity = { left: { seenSince: 0, lastSeen: 0, confirmed: false }, right: { seenSince: 0, lastSeen: 0, confirmed: false }, single: { seenSince: 0, lastSeen: 0, confirmed: false } };
    this.markerShape = null;      // последняя измеренная форма пятна     // pair|single|conflict|tiny|same|lowtrust|step|lost
    this.gestureEnabled = false;
    this.gestureV = false;
    this.gestureConfidence = 0;
    this.gestureLastAt = 0;
    this.gestureOnFrames = 0;
    this.gestureOffFrames = 0;
    this.thumbUp = false;
    this.thumbConfidence = 0;
    this.thumbLastAt = 0;
    this.thumbOnFrames = 0;
    this.thumbOffFrames = 0;

    this.c0n = null; // нормализованный центр калибровки
    this.lastFoundAt = 0;
    this.lastFrame = null;
    // Память потери: где метка была в последний раз и за какой край ушла.
    this.heldYaw = 0;
    this.heldPitch = 0;
    this.exitSideX = null; // 'left' | 'right' | null (ушла не за край — закрыли/погасла)
    this.exitSideY = null; // 'top' | 'bottom' | null
    // Адаптивная цена: полный замер (кадр+анализ), ярусы разрешения/темпа.
    this.tier = 0;
    this.procW = TIER_W[0];
    this.intervalMs = TIER_MS[0];
    this.procMs = 0;
    this._lastAdapt = 0;
    this._work = document.createElement('canvas');
    this._wctx = this._work.getContext('2d', { willReadFrequently: true });
    // Worker-конвейер для поездки
    this._worker = undefined; // undefined = не пробовали, null = недоступен
    this._workerBusy = false;
    this._workerFails = 0;
    this._workerMode = false;
  }

  async start(video) {
    if (this.running && this.video === video) return;
    this.stop();
    let stream;
    // Поток маленький и небыстрый: полный сенсор греет SoC и дорого
    // декодируется; для метки 640x480@24 за глаза.
    // `ideal` facingMode can silently select the selfie camera when a browser
    // cannot satisfy the preference. Gestures are defined against the outward
    // camera, so require environment explicitly; only resolution/FPS may relax.
    const want = { facingMode: { exact: 'environment' }, width: { ideal: 640 }, height: { ideal: 480 }, frameRate: { ideal: 24, max: 30 } };
    try { stream = await navigator.mediaDevices.getUserMedia({ video: want, audio: false }); }
    catch {
      // Older devices may reject the size/FPS constraints, but never switch to selfie.
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { exact: 'environment' } }, audio: false,
      });
    }
    this.stream = stream;
    this.video = video || null;
    if (this.video) {
      this.video.srcObject = stream;
      await this.video.play();
    }
    this.running = true;
    this.synthetic = false;
  }

  stop() {
    if (this.stream) for (const t of this.stream.getTracks()) { try { t.stop(); } catch { /* ignore */ } }
    this.stream = null;
    this.running = false;
    this.found = false;
    this.gestureV = false;
    this.gestureConfidence = 0;
    this.gestureLastAt = 0;
    this.gestureOnFrames = 0;
    this.gestureOffFrames = 0;
    this.thumbUp = false;
    this.thumbConfidence = 0;
    this.thumbLastAt = 0;
    this.thumbOnFrames = 0;
    this.thumbOffFrames = 0;
    this._workerMode = false;
    this._workerBusy = false;
  }

  _fx(w) { return (w / 2) / Math.tan(((this.fovDeg * Math.PI) / 180) / 2); }

  _adapt(ms, now) {
    this.procMs = this.procMs ? this.procMs * 0.8 + ms * 0.2 : ms;
    if (now - this._lastAdapt < 1000) return;
    if (this.procMs > 12 && this.tier < 2) { this.tier++; this._lastAdapt = now; }
    else if (this.procMs < 4 && this.tier > 0) { this.tier--; this._lastAdapt = now; }
    else return;
    this.procW = TIER_W[this.tier];
    this.intervalMs = TIER_MS[this.tier];
  }

  setGestureEnabled(enabled) {
    this.gestureEnabled = !!enabled;
    if (!this.gestureEnabled) {
      this.gestureV = false;
      this.gestureConfidence = 0;
      this.gestureOnFrames = 0;
      this.gestureOffFrames = 0;
      this.thumbUp = false;
      this.thumbConfidence = 0;
      this.thumbOnFrames = 0;
      this.thumbOffFrames = 0;
    }
  }

  _applyGesture(result) {
    if (!this.gestureEnabled) return;
    const v = result && result.v ? result.v : (result || { found: false, confidence: 0 });
    const thumb = result && result.thumb ? result.thumb : { found: false, confidence: 0 };
    const now = performance.now();
    this.gestureLastAt = now;
    this.thumbLastAt = now;
    this.gestureConfidence = Number.isFinite(v.confidence) ? v.confidence : 0;
    this.thumbConfidence = Number.isFinite(thumb.confidence) ? thumb.confidence : 0;
    if (v.found) {
      this.gestureOnFrames++;
      this.gestureOffFrames = 0;
      if (this.gestureOnFrames >= 2) this.gestureV = true;
    } else {
      this.gestureOffFrames++;
      this.gestureOnFrames = 0;
      if (this.gestureOffFrames >= 2) this.gestureV = false;
    }
    if (thumb.found) {
      this.thumbOnFrames++;
      this.thumbOffFrames = 0;
      if (this.thumbOnFrames >= 2) this.thumbUp = true;
    } else {
      this.thumbOffFrames++;
      this.thumbOnFrames = 0;
      // Gas is safety critical: one confirmed non-thumb frame stops, while
      // enabling still needs two frames to avoid an accidental acceleration.
      if (this.thumbOffFrames >= 1) this.thumbUp = false;
    }
  }

  gestureFresh(maxMs = 700) {
    return this.gestureEnabled && this.gestureLastAt > 0 && (performance.now() - this.gestureLastAt) <= maxMs;
  }
  thumbFresh(maxMs = 700) {
    return this.gestureEnabled && this.thumbLastAt > 0 && (performance.now() - this.thumbLastAt) <= maxMs;
  }

  // Сброс калибровки пары (смена режима, новая пипетка, «Калибровать: прямо»
  // заново). Вместе с углами обнуляются база размера пятна и доверие к
  // сторонам — иначе отсев мусора сравнивал бы пятна с прошлой калибровкой.
  resetDualCalibration() {
    this.dualCalibration = null;
    this.dualBaseCount = null;
    this.dualBaseShape = null;
    this.dualModel = null;
    this.dualTrust = { left: 1, right: 1 };
    this.reanchorPending = null;
    this.dualHistory = [];
    this.yawRate = 0;
    this.dualUsed = [];
    this.dualMissing = { left: 0, right: 0 };
    this.markerEntity = { left: { seenSince: 0, lastSeen: 0, confirmed: false }, right: { seenSince: 0, lastSeen: 0, confirmed: false }, single: { seenSince: 0, lastSeen: 0, confirmed: false } };
    this.markerShape = null;
    this.pairState = 'idle';
  }

  // Забыть метку совсем (QA: проверить, что новое появление снова требует
  // 0.15 с). Без аргумента — все метки.
  forgetMarkerEntities(id = null) {
    for (const key of Object.keys(this.markerEntity || {})) {
      if (id && key !== id) continue;
      this.markerEntity[key] = { seenSince: 0, lastSeen: 0, confirmed: false };
    }
  }

  // Сущность метки: сколько времени она явно видна НЕПРЕРЫВНО и была ли она
  // подтверждена раньше. 0.1-секундный «морок» сущностью не становится.
  _markerEntityState(id, visible, now) {
    const map = this.markerEntity || (this.markerEntity = {});
    const st = map[id] || (map[id] = { seenSince: 0, lastSeen: 0, confirmed: false });
    if (visible) {
      if (st.confirmed) {
        if (st.lastSeen && now - st.lastSeen > MARKER_IDENTITY_MS) { st.confirmed = false; st.seenSince = now; }
      } else {
        if (!st.seenSince || (st.lastSeen && now - st.lastSeen > MARKER_IDENTITY_MS)) st.seenSince = now;
        if (now - st.seenSince >= MARKER_CONFIRM_MS) st.confirmed = true;
      }
      st.lastSeen = now;
    } else {
      st.seenSince = 0;
      if (st.confirmed && st.lastSeen && now - st.lastSeen > MARKER_IDENTITY_MS) st.confirmed = false;
    }
    return st;
  }

  // Форма метки: горизонтальный прямоугольник. Возвращает {ok, aspect, fill,
  // clipped, judged}; у края кадра пропорции не судим (bbox обрезан).
  // base — форма этой же метки на калибровке «прямо» (если известна).
  _markerShapeOf(res, w, h, base = null) {
    if (!res || !res.found || !res.bw || !res.bh) return { ok: true, aspect: null, fill: null, clipped: false, judged: false };
    const clipped = (res.u - res.bw / 2) <= 1 || (res.u + res.bw / 2) >= w - 1
      || (res.v - res.bh / 2) <= 1 || (res.v + res.bh / 2) >= h - 1;
    const fill = res.fill === undefined ? res.count / (res.bw * res.bh) : res.fill;
    const aspect = res.bw / res.bh;
    const bigEnough = res.bw >= MARKER_SHAPE_MIN_W && res.bh >= MARKER_SHAPE_MIN_H;
    const fillMin = base ? Math.max(0.45, (base.fill || 1) * 0.6) : MARKER_FILL_MIN;
    if (!bigEnough) return { ok: fill >= fillMin, aspect, fill, clipped, judged: false };
    if (fill < fillMin) return { ok: false, aspect, fill, clipped, judged: true };
    const lo = base && base.aspect ? Math.max(MARKER_ASPECT_MIN, base.aspect * MARKER_ASPECT_BASE_LO) : MARKER_ASPECT_MIN;
    const hi = base && base.aspect ? base.aspect * MARKER_ASPECT_BASE_HI : MARKER_ASPECT_MAX;
    if (!clipped && (aspect < lo || aspect > hi)) return { ok: false, aspect, fill, clipped, judged: true };
    return { ok: true, aspect, fill, clipped, judged: true };
  }

  // История поворота головы. Копим углы принятых кадров: по ним считается
  // скорость, которой предсказывается положение меток в следующем кадре.
  _pushYawSample(t, yaw) {
    const h = this.dualHistory || (this.dualHistory = []);
    h.push({ t, yaw });
    while (h.length > 1 && (t - h[0].t > DUAL_HISTORY_MS || h.length > DUAL_HISTORY_MAX)) h.shift();
    this.yawRate = this._estimateRate();
    return this.yawRate;
  }

  // МНК-наклон «угол/время», °/с. Без достаточной истории скорость «неизвестна»
  // (0): тогда модель молчит, а не выдумывает движение.
  _estimateRate() {
    const h = this.dualHistory || [];
    if (h.length < 3) return 0;
    const t0 = h[0].t;
    if ((h[h.length - 1].t - t0) < DUAL_RATE_READY_MS) return 0;
    let n = 0, st = 0, sy = 0, stt = 0, sty = 0;
    for (const s of h) {
      const ts = (s.t - t0) / 1000;
      n++; st += ts; sy += s.yaw; stt += ts * ts; sty += ts * s.yaw;
    }
    const den = n * stt - st * st;
    if (den <= 1e-9) return 0;
    const rate = (n * sty - st * sy) / den;
    if (!Number.isFinite(rate)) return 0;
    return THREE_CLAMP(rate, -DUAL_RATE_LIMIT_DPS, DUAL_RATE_LIMIT_DPS);
  }

  rateReady() {
    const h = this.dualHistory || [];
    return h.length >= 3 && (h[h.length - 1].t - h[0].t) >= DUAL_RATE_READY_MS;
  }

  // Переякорка после долгой потери принимается только по двум согласным
  // кадрам: одиночное «пятно похожего цвета» не должно дёргать взгляд.
  _confirmReanchor(candidate, now) {
    const p = this.reanchorPending;
    const same = p && p.id === candidate.id
      && Math.abs(p.yaw - candidate.deltaYaw) < 3
      && Math.abs(p.pitch - candidate.deltaPitch) < 3
      && (now - p.at) <= 600;
    if (same) { this.reanchorPending = null; return true; }
    this.reanchorPending = { id: candidate.id, yaw: candidate.deltaYaw, pitch: candidate.deltaPitch, at: now };
    return false;
  }

  _applyDualResult(res, w, h) {
    const wasFound = this.found;
    const previous = this.markers || [];
    const markers = (res.markers || []).map((m, i) => {
      const id = i === 0 ? 'left' : 'right';
      if (!m.found) return { ...m, id, rawYaw: null, rawPitch: null };
      const a = anglesFromCentroid(m.u, m.v, w, h, this.c0n, this.fovDeg);
      return { ...m, id, rawYaw: a.yaw, rawPitch: a.pitch };
    });
    while (markers.length < 2) markers.push({ id: markers.length === 0 ? 'left' : 'right', found: false, count: 0, rawYaw: null, rawPitch: null });
    const visible = markers.filter((m) => m.found);
    const lost = previous.filter((m) => m && m.found && !markers.find((n) => n.id === m.id && n.found));
    const visibleIds = new Set(visible.map((m) => m.id));
    this.lostMarkers = (this.lostMarkers || []).filter((id) => !visibleIds.has(id));
    for (const m of lost) if (!this.lostMarkers.includes(m.id)) this.lostMarkers.push(m.id);
    if (visible.length === 2) this.lostMarkers = [];
    this.lastLostMarker = this.lostMarkers.length ? this.lostMarkers.join(',') : null;
    this.markers = markers;
    this.dualVisible = visible.map((m) => m.id);
    this.frameW = w; this.frameH = h;
    const now = performance.now();

    // Дельта каждой метки — её собственный поворот головы относительно
    // калибровки «прямо». Обе коробки поворачиваются вместе с головой, поэтому
    // их дельты обязаны совпадать: это и есть проверка пары.
    for (const m of markers) {
      if (!m.found) { m.deltaYaw = null; m.deltaPitch = null; continue; }
      const base = this.dualCalibration && this.dualCalibration[m.id];
      m.deltaYaw = m.rawYaw - (base ? base.yaw : 0);
      m.deltaPitch = m.rawPitch - (base ? base.pitch : 0);
    }
    const M = this.dualModel;
    const calibrated = !!(M && this.dualCalibration);

    // --- пространственная модель кадра ------------------------------------
    // Метки стоят в мире: их порядок, расстояние и калиброванное место не
    // меняются. Значит для каждого кадра можно предсказать, ГДЕ каждая метка
    // обязана быть (по скорости головы за последние секунды) и МОЖЕТ ли она
    // вообще попасть в кадр. «Бесовщина» отсекается именно здесь.
    const dtSince = Math.max(0.001, (now - (this.lastAcceptAt || now)) / 1000);
    const rate = this.yawRate || 0;
    const thetaPred = calibrated ? this.heldYaw + rate * Math.min(dtSince, 0.2) : 0;
    // Край кадра в углах — это половина поля зрения (центр калибровки у пары
    // стоит в середине кадра). Запас ниже нужен на ошибку прогноза, иначе
    // модель объявляла бы «за краем» метку, стоящую ровно на границе.
    const halfFov = this.fovDeg / 2;
    // запас у края: чем быстрее поворот, тем шире окно «может быть видно»
    const edgeSlack = DUAL_EDGE_SLACK_DEG + Math.abs(rate) * Math.min(dtSince, DUAL_PREDICT_S) * 0.8;
    const tolResidual = THREE_CLAMP(DUAL_RESIDUAL_DEG + Math.abs(rate) * Math.min(dtSince, 0.2) * 0.8,
      DUAL_RESIDUAL_DEG, DUAL_RESIDUAL_MAX_DEG);
    const expectRawOf = (id) => (calibrated ? M.baseRaw[id] + thetaPred : null);
    const expectedRaw = { left: expectRawOf('left'), right: expectRawOf('right') };
    const expectedInside = (id) => {
      const raw = expectedRaw[id];
      return raw === null || Math.abs(raw) <= halfFov + edgeSlack;
    };
    for (const m of markers) {
      const eRaw = expectedRaw[m.id];
      m.expected = expectedInside(m.id);                       // может ли вообще быть видна
      m.residual = !m.found || eRaw === null ? null : m.rawYaw - eRaw; // насколько не там, где ждут
    }

    // Пятно сильно меньше калиброванного — это не коробка (мусор/блик):
    // у analyzeColorBlob есть абсолютный порог 40 px, но реальная метка
    // на калибровке всегда крупнее, и такой «огрызок» нельзя пускать в среднее.
    const tiny = (m) => {
      const base = this.dualBaseCount && this.dualBaseCount[m.id];
      if (!base) return false;
      return (m.count || 0) < Math.max(40, base * 0.08);
    };

    // Оттенок, которого в кадре быть не может, не заслуживает доверия вообще:
    // если по предсказанию метка снаружи кадра, то любое её «пятно» внутри —
    // чужой предмет. Это и есть правило «всё малиновое там игнорируем».
    const impossible = visible.filter((m) => !m.expected);
    for (const m of impossible) this.dualTrust[m.id] = Math.max(0, this.dualTrust[m.id] - 0.5);

    // Сущность и форма каждой видимой метки. Сущность — не меньше 0.15 с
    // явного непрерывного наблюдения (или недавняя проверенная идентичность).
    // Форма — горизонтальный прямоугольник, а не «абы что».
    for (const m of visible) {
      m.shape = this._markerShapeOf(m, w, h, this.dualBaseShape && this.dualBaseShape[m.id]);
      m.shapeOk = m.shape.ok;
      // Сущность засчитывает только метка, которая ПО ГЕОМЕТРИИ может быть в
      // кадре. Пятно чужого оттенка не на своём месте (оранжевое правее
      // правой метки, когда левая давно за краем) не должно продлевать жизнь
      // чужой сущности и не должно «доказывать» её возвращение.
      if (!m.expected) { m.entity = false; m.entityMs = 0; continue; }
      const st = this._markerEntityState(m.id, true, now);
      m.entity = !!st.confirmed;
      m.entityMs = m.entity ? Math.round(now - st.seenSince) : 0;
    }
    for (const id of ['left', 'right']) {
      if (!visible.some((m) => m.id === id && m.expected)) this._markerEntityState(id, false, now);
    }
    this.markerShape = visible.length ? visible[visible.length - 1].shape : null;

    const usable = visible.filter((m) => m.expected && !tiny(m) && m.entity && m.shapeOk);

    // Кто ближе к предсказанному месту — того и слушаем; доверие лишь
    // разрешает ничьи (у пришельца оно быстро падает).
    const scoreOf = (m) => (m.residual === null ? 0 : Math.abs(m.residual)) - 2 * (this.dualTrust[m.id] || 0);

    let state = 'lost';
    let chosen = null;
    let yaw = null;
    let pitch = null;
    if (!visible.length) {
      state = 'lost';
    } else if (!usable.length) {
      // Ничего, что можно пустить в счёт: либо метка ещё не прожила 0.15 с,
      // либо это не прямоугольник. Взгляд не двигаем — держим прежний угол.
      if (visible.some((m) => !m.entity)) state = 'acquiring';
      else if (visible.some((m) => !m.shapeOk)) state = 'shape';
      else if (!calibrated) state = 'pair';
      else state = impossible.length ? 'impossible' : 'tiny';
    } else if (!calibrated) {
      // До «Калибровать: прямо» судить о паре нечем — среднее по сущностям.
      state = 'pair';
      yaw = usable.reduce((sum, m) => sum + m.deltaYaw, 0) / usable.length;
      pitch = usable.reduce((sum, m) => sum + m.deltaPitch, 0) / usable.length;
    } else if (usable.length === 1) {
      state = 'single';
      chosen = usable[0];
    } else {
      const [a, b] = usable;
      // Оба детектора зацепили ОДИН И ТОТ ЖЕ предмет (в реальном свете
      // оттенки сближаются и коробка попадает в оба допуска) — это не пара.
      const sameBlob = Math.abs(a.u - b.u) < w * 0.04 && Math.abs(a.v - b.v) < h * 0.04;
      const l = usable.find((m) => m.id === 'left');
      const r = usable.find((m) => m.id === 'right');
      // Главный инвариант пары: расстояние и порядок. Левая метка всегда левее
      // правой — «малиновое левее оранжевой» невозможно.
      const sepObs = l && r ? r.rawYaw - l.rawYaw : null;
      const sepOk = sepObs !== null && Math.abs(sepObs - M.sep) <= DUAL_PAIR_GATE_DEG;
      if (sameBlob) {
        state = 'same';
        chosen = scoreOf(a) <= scoreOf(b) ? a : b;
      } else if (sepOk) {
        state = 'pair';
        yaw = (a.deltaYaw + b.deltaYaw) / 2;
        pitch = (a.deltaPitch + b.deltaPitch) / 2;
      } else {
        // Расстояние между «метками» не то, что на калибровке: одна сторона
        // чужая. Среднее здесь как раз и утягивало взгляд к центру кадра.
        state = 'conflict';
        chosen = scoreOf(a) <= scoreOf(b) ? a : b;
        const loser = (chosen === a ? b : a).id;
        this.dualTrust[loser] = Math.max(0, this.dualTrust[loser] - 0.45);
      }
    }

    if (chosen) {
      const t = this.dualTrust[chosen.id];
      const stepD = Math.hypot(chosen.deltaYaw - this.heldYaw, chosen.deltaPitch - this.heldPitch);
      // Лимит по СКОРОСТИ, но с потолком: частота кадров камеры зависит от
      // яруса (90-170 мс), и без потолка «шаг за кадр» на низком FPS пропускал
      // бы почти любой скачок от чужого пятна.
      const allow = THREE_CLAMP(DUAL_MAX_RATE_DPS * dtSince, DUAL_MIN_STEP_DEG, DUAL_MAX_STEP_CAP_DEG);
      const big = stepD > allow;
      // Метка должна быть ТАМ, где её ждут: иначе это чужое пятно. Пока
      // скорости ещё нет (история короткая), модель молчит и судим по лимиту.
      const spatialOk = !this.rateReady() || chosen.residual === null || Math.abs(chosen.residual) <= tolResidual;
      const stale = (now - this.lastFoundAt) > DUAL_REANCHOR_MS;
      const contested = state === 'conflict' || state === 'same';
      const inModel = !big && spatialOk;
      // Неожиданное, но подтверждённое вторым кадром — принимаем (это честное
      // возвращение метки или резкое движение); одиночный «морок» — нет.
      let ok = (!contested || t >= DUAL_TRUST_MIN) && (inModel || this._confirmReanchor(chosen, now));
      if (ok) {
        yaw = chosen.deltaYaw;
        pitch = chosen.deltaPitch;
        this.dualTrust[chosen.id] = Math.min(1, t + 0.1);
        if (inModel) this.reanchorPending = null; // обычное движение — ожидание сбрасываем
      } else {
        this.dualTrust[chosen.id] = Math.max(0, t - 0.2);
        state = !spatialOk && !stale ? 'spatial' : (t < DUAL_TRUST_MIN ? 'lowtrust' : 'step');
      }
    } else if (state === 'pair') {
      // Пара согласна (или калибровки ещё нет) — доверие к обеим сторонам растёт.
      for (const m of usable) this.dualTrust[m.id] = Math.min(1, this.dualTrust[m.id] + 0.15);
    }

    // Кто реально пошёл в счёт и кого не хватает там, где он обязан быть
    // (например, при взгляде ±5° обе метки должны быть видны, ни одна не «уходит»).
    this.dualUsed = yaw === null ? [] : (chosen ? [chosen.id] : usable.map((m) => m.id));
    for (const id of ['left', 'right']) {
      const seen = markers.some((m) => m.id === id && m.found);
      // Метка, которая по геометрии кадра не может быть видна, не «пропала»:
      // её не ищем и не считаем пропущенной. Иначе на большом повороте
      // счётчик копился бы вечно и любой одиночный кадр назывался бы
      // «occluded» вместо честного «single».
      if (calibrated && expectedInside(id) && !seen) this.dualMissing[id] = (this.dualMissing[id] || 0) + 1;
      else if (seen || (calibrated && !expectedInside(id))) this.dualMissing[id] = 0;
    }
    // Оттенок, которого тут быть не может, но который «нашёлся», — это чужая
    // бесовщина; называем кадр честно, даже если ведёт вторая метка.
    if (impossible.length && yaw !== null) state = 'impossible';
    if (calibrated && yaw !== null && (this.dualMissing.left > 2 || this.dualMissing.right > 2)) state = 'occluded';
    this.pairState = state;
    if (yaw !== null) {
      this.yaw = yaw;
      this.pitch = pitch;
      this.u = visible.reduce((sum, m) => sum + m.u, 0) / visible.length;
      this.v = visible.reduce((sum, m) => sum + m.v, 0) / visible.length;
      this.count = visible.reduce((sum, m) => sum + (m.count || 0), 0);
      this.found = true;
      this.lastFoundAt = now;
      this.lastAcceptAt = now;
      this._pushYawSample(now, this.yaw);
      this.heldYaw = this.yaw;
      this.heldPitch = this.pitch;
      this.exitSideX = null;
      this.exitSideY = null;
    } else {
      if (wasFound) {
        // Обе коробки пропали: сохраняем последний экранный край и
        // lastLostMarker, чтобы возврат не выглядел как новая неизвестная метка.
        const nx = this.u / (w || this.frameW || 1);
        const ny = this.v / (h || this.frameH || 1);
        this.exitSideX = nx > 0.78 ? 'right' : nx < 0.22 ? 'left' : null;
        this.exitSideY = ny < 0.22 ? 'top' : ny > 0.78 ? 'bottom' : null;
      }
      this.found = false;
      this.count = 0;
    }
    return res;
  }

  _applyResult(res, w, h) {
    this._applyGesture(res && res.gesture);
    if (this.dual && res && res.markers) return this._applyDualResult(res, w, h);
    const wasFound = this.found;
    const now = performance.now();
    this.frameW = w; this.frameH = h;
    // Одна метка — та же дисциплина: сущность после 0.15 с наблюдения и форма
    // горизонтального прямоугольника. Пока метка не сущность, взгляд держим.
    const shape = this._markerShapeOf(res, w, h);
    this.markerShape = shape;
    const entity = this._markerEntityState('single', !!res.found, now);
    const ok = res.found && entity.confirmed && shape.ok;
    if (ok) {
      const a = anglesFromCentroid(res.u, res.v, w, h, this.c0n, this.fovDeg);
      this.yaw = a.yaw; this.pitch = a.pitch;
      this.u = res.u; this.v = res.v; this.count = res.count;
      this.found = true;
      this.entityMs = entity.seenSince ? Math.round(now - entity.seenSince) : 0;
      this.lastFoundAt = now;
      this.heldYaw = this.yaw;
      this.heldPitch = this.pitch;
      this.exitSideX = null;
      this.exitSideY = null;
    } else {
      if (wasFound) {
        // момент потери: запоминаем, за какой край ушла метка
        const nx = this.u / (w || this.frameW || 1);
        const ny = this.v / (h || this.frameH || 1);
        this.exitSideX = nx > 0.78 ? 'right' : nx < 0.22 ? 'left' : null;
        this.exitSideY = ny < 0.22 ? 'top' : ny > 0.78 ? 'bottom' : null;
      }
      this.found = false;
      this.count = res.found ? 0 : (res.count || 0);
      this.entityMs = 0;
    }
    return res;
  }

  processImageData(data, w, h) {
    this.lastFrame = { data, w, h };
    const gesture = this.gestureEnabled ? analyzeGestures(data, w, h) : null;
    const res = this.dual
      ? { dual: true, markers: analyzeColorBlobs(data, w, h, [this.hueA, this.hueB], this.tol, this.satMin), gesture }
      : { ...analyzeColorBlob(data, w, h, this.hue, this.tol, this.satMin), gesture };
    return this._applyResult(res, w, h);
  }

  // Главный поток: снять кадр и проанализировать здесь (подготовка, QA,
  // фолбэк). Честно меряем ВЕСЬ путь: drawImage + getImageData + анализ.
  processMain() {
    const vid = this.video;
    if (!this.running || !vid || !vid.videoWidth) return false;
    const t0 = performance.now();
    const w = this.procW;
    const h = Math.max(2, Math.round((w * vid.videoHeight) / vid.videoWidth));
    this._work.width = w; this._work.height = h;
    this._wctx.drawImage(vid, 0, 0, w, h);
    const img = this._wctx.getImageData(0, 0, w, h);
    this.processImageData(img.data, w, h);
    this._adapt(performance.now() - t0, t0);
    return this.found;
  }

  // ------------------------------------------------------------- Worker
  ensureWorker() {
    if (this._worker !== undefined) return this._worker;
    try {
      const wk = new Worker(new URL('./camtrack-worker.js', import.meta.url), { type: 'module' });
      wk.onmessage = (e) => {
        const m = e.data || {};
        this._workerBusy = false;
        this._workerFails = 0;
        if (typeof m.procMs === 'number') this._adapt(m.procMs, performance.now());
        if (m.w && m.h) this._applyResult(m, m.w, m.h);
      };
      wk.onerror = () => { this._worker = null; this._workerBusy = false; };
      this._worker = wk;
    } catch { this._worker = null; }
    return this._worker;
  }
  useWorkerMode() {
    this._workerMode = !!this.ensureWorker();
    return this._workerMode;
  }
  workerActive() { return !!(this._workerMode && this._worker); }

  _kickWorker() {
    const wk = this._worker;
    const vid = this.video;
    if (!wk || this._workerBusy || !vid || !vid.videoWidth) return;
    this._workerBusy = true;
    const targetW = this.procW;
    const targetH = Math.max(2, Math.round((targetW * vid.videoHeight) / vid.videoWidth));
    let bmpPromise;
    try { bmpPromise = createImageBitmap(vid, { resizeWidth: targetW, resizeHeight: targetH }); }
    catch { bmpPromise = null; }
    if (!bmpPromise || typeof bmpPromise.then !== 'function') {
      // createImageBitmap с ресайзом недоступен — тихий фолбэк на главный поток
      this._workerBusy = false;
      this._workerMode = false;
      this.processMain();
      return;
    }
    bmpPromise.then((bmp) => {
      try {
        wk.postMessage({
          bitmap: bmp, hue: this.hue, hues: this.dual ? [this.hueA, this.hueB] : null,
          dual: this.dual, gesture: this.gestureEnabled, tol: this.tol, satMin: this.satMin,
          c0n: this.c0n, fovDeg: this.fovDeg,
        }, [bmp]);
      } catch { this._workerBusy = false; this._noteWorkerFail(); }
    }).catch(() => { this._workerBusy = false; this._noteWorkerFail(); });
    // Страховка: воркер молчит дольше 900 мс — кадр потерян, считаем отказ.
    // Два отказа подряд — воркер отключается, дальше дешёвый главный поток.
    setTimeout(() => {
      if (this._workerBusy) { this._workerBusy = false; this._noteWorkerFail(); }
    }, 900);
  }
  _noteWorkerFail() {
    this._workerFails++;
    if (this._workerFails >= 2) this._workerMode = false; // дальше — главный поток
  }

  // Точка входа из игрового цикла: в поездке — воркер, иначе главный поток.
  process() {
    if (this.synthetic) return this.found;
    if (this._workerMode && this.running && this.video) {
      this._kickWorker();
      return this.found;
    }
    return this.processMain();
  }

  // Оттенок реального предмета по центру последнего кадра (коробка!).
  // Нужен кадр на главном потоке — вызывающий код сначала делает processMain().
  sampleColor() {
    if (!this.lastFrame) return null;
    const { data, w, h } = this.lastFrame;
    let sx = 0, sy = 0, n = 0;
    const x0 = Math.floor(w * 0.42), x1 = Math.floor(w * 0.58);
    const y0 = Math.floor(h * 0.42), y1 = Math.floor(h * 0.58);
    for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) {
      const i = (y * w + x) * 4;
      const { h: hue, sat, val } = hueOf(data[i], data[i + 1], data[i + 2]);
      if (sat < 0.18 || val < 0.15) continue;
      sx += Math.cos((hue * Math.PI) / 180); sy += Math.sin((hue * Math.PI) / 180); n++;
    }
    if (!n) return null;
    let hue = (Math.atan2(sy, sx) * 180) / Math.PI; if (hue < 0) hue += 360;
    this.hue = hue;
    return Math.round(hue);
  }

  calibrate() {
    if (this.dual) {
      const a = this.markers[0], b = this.markers[1];
      // Калибровать можно только по подтверждённым сущностям: 0.1-секундный
      // «морок» не должен становиться точкой отсчёта «прямо».
      if (!a || !b || !a.found || !b.found || !a.entity || !b.entity) return false;
      this.c0n = { x: (a.u + b.u) / (2 * this.frameW), y: (a.v + b.v) / (2 * this.frameH) };
      const aa = anglesFromCentroid(a.u, a.v, this.frameW, this.frameH, this.c0n, this.fovDeg);
      const bb = anglesFromCentroid(b.u, b.v, this.frameW, this.frameH, this.c0n, this.fovDeg);
      this.dualBaseCount = { left: a.count || 0, right: b.count || 0 };
      this.dualBaseShape = {
        left: { aspect: a.bw && a.bh ? a.bw / a.bh : 0, fill: a.fill || 1 },
        right: { aspect: b.bw && b.bh ? b.bw / b.bh : 0, fill: b.fill || 1 },
      };
      this.dualCalibration = {
        left: { yaw: aa.yaw, pitch: aa.pitch },
        right: { yaw: bb.yaw, pitch: bb.pitch },
      };
      // Модель пространства: где каждая метка стоит «прямо» и на каком углу
      // друг от друга (порядок и расстояние — инвариант кадра).
      this.dualModel = {
        baseRaw: { left: aa.yaw, right: bb.yaw },
        sep: bb.yaw - aa.yaw,   // знак и величина — инвариант порядка и расстояния
      };
      this.dualHistory = [{ t: performance.now(), yaw: 0 }];
      this.yawRate = 0;
      this.dualUsed = [];
      this.dualMissing = { left: 0, right: 0 };
      this.dualTrust = { left: 1, right: 1 };
      this.reanchorPending = null;
      this.pairState = 'pair';
      this.yaw = 0; this.pitch = 0;
      return true;
    }
    this.c0n = this.found
      ? { x: this.u / this.frameW, y: this.v / this.frameH }
      : { x: 0.5, y: 0.5 };
    if (this.found) { this.yaw = 0; this.pitch = 0; }
    return this.found;
  }

  fresh(maxMs = 700) { return this.found && (performance.now() - this.lastFoundAt) <= maxMs; }

  // Настоящая фиксация пары: обе метки видны, обе — подтверждённые сущности
  // нужной формы, порядок и расстояние сходятся, и обе пошли в счёт. Только
  // это доказывает, что голова там, куда показывает кадр; одна метка — ещё
  // не доказательство (она может быть чужой или у края кадра).
  pairFixation() {
    if (!this.dual) return this.fresh(900);
    return !!this.found && this.pairState === 'pair'
      && this.dualVisible.length === 2 && this.dualUsed.length === 2;
  }

  // Одиночная метка ведёт взгляд в СВОЮ сторону. Условия жёсткие: кадр
  // действительно вёл ровно один доверенный объект, он подтверждённая
  // сущность нужной формы, а вторая метка либо вне кадра по геометрии
  // (мы её не ищем — «левее левой» никаких сущностей), либо отброшена
  // правилами пары как чужая. Одиночная метка никогда не доказывает
  // «прямо»: центр задаёт только пара.
  singleSteer() {
    if (!this.dual) return this.fresh(900);
    if (!this.found || !this.fresh(900)) return false;
    if ((this.dualUsed || []).length !== 1) return false;
    const id = this.dualUsed[0];
    const m = (this.markers || []).find((x) => x.id === id);
    if (!m || !m.found || !m.entity || !m.shapeOk) return false;
    // Вторая метка в кадре не должна быть подтверждённой сущностью на своём
    // месте: иначе пара была бы доказана (или честно конфликтует) — это не
    // «одиночный» кадр.
    const other = (this.markers || []).find((x) => x.id !== id);
    if (other && other.found && other.entity && other.shapeOk && other.expected) return false;
    return true;
  }

  // QA: синтетическая метка без настоящей камеры.
  // QA-кадры повторяют физику метки: горизонтальный прямоугольник с длинной
  // стороной в горизонтальной плоскости (shape='rect', r — половина высоты,
  // ширина 4r). 'circle' и 'vertical' — для проверок, что «абы что» отсекается.
  static _paintMarker(data, w, h, cx, cy, r, rgb, shape = 'rect') {
    const hw = shape === 'vertical' ? r : r * 2;
    const hh = shape === 'vertical' ? r * 2 : r;
    for (let y = Math.max(0, Math.floor(cy - hh)); y < Math.min(h, Math.ceil(cy + hh)); y++) {
      for (let x = Math.max(0, Math.floor(cx - hw)); x < Math.min(w, Math.ceil(cx + hw)); x++) {
        if (shape === 'circle') {
          const dx = x - cx, dy = y - cy;
          if (dx * dx + dy * dy > r * r) continue;
        }
        const i = (y * w + x) * 4;
        data[i] = rgb[0]; data[i + 1] = rgb[1]; data[i + 2] = rgb[2]; data[i + 3] = 255;
      }
    }
  }

  injectBlob(cx, cy, r, w = 320, h = 240, shape = 'rect') {
    this.synthetic = true;
    const data = new Uint8ClampedArray(w * h * 4);
    // малиновый ~ оттенок 339°
    CamTracker._paintMarker(data, w, h, cx, cy, r, [215, 51, 108], shape);
    return this.processImageData(data, w, h);
  }
  injectDualBlob(ax, ay, bx, by, r = 26, w = 320, h = 240, shape = 'rect') {
    this.synthetic = true;
    const data = new Uint8ClampedArray(w * h * 4);
    const shapeOf = (side) => (typeof shape === 'string' ? shape : (shape && shape[side]) || 'rect');
    const rOf = (side) => (typeof r === 'number' ? r : (r && r[side]) || 26);
    const blobs = [
      { x: ax, y: ay, r: rOf('left'), rgb: [241, 90, 36], shape: shapeOf('left') }, // orange
      { x: bx, y: by, r: rOf('right'), rgb: [215, 51, 108], shape: shapeOf('right') }, // raspberry
    ].filter((blob) => Number.isFinite(blob.x) && Number.isFinite(blob.y));
    for (const blob of blobs) CamTracker._paintMarker(data, w, h, blob.x, blob.y, blob.r, blob.rgb, blob.shape);
    return this.processImageData(data, w, h);
  }

  injectGestureV(on = true) {
    this.synthetic = true;
    this.gestureEnabled = true;
    const now = performance.now();
    this.gestureLastAt = now;
    this.thumbLastAt = now;
    this.gestureConfidence = on ? 1 : 0;
    this.gestureV = !!on;
    this.gestureOnFrames = on ? 2 : 0;
    this.gestureOffFrames = on ? 0 : 2;
    this.thumbConfidence = 0;
    this.thumbUp = false;
    this.thumbOnFrames = 0;
    this.thumbOffFrames = 2;
    return this.gestureV;
  }

  // QA: минимальный skin-colored силуэт проходит тот же анализатор, что и
  // ImageBitmap из Worker. Это не используется игрой — только synthetic QA.
  injectGestureFrame(on = true, w = 160, h = 120) {
    this.synthetic = true;
    const data = new Uint8ClampedArray(w * h * 4);
    if (!on) return this.processImageData(data, w, h);
    const put = (x, y) => {
      if (x < 0 || x >= w || y < 0 || y >= h) return;
      const i = (y * w + x) * 4;
      data[i] = 200; data[i + 1] = 140; data[i + 2] = 110; data[i + 3] = 255;
    };
    const disc = (cx, cy, r) => {
      for (let y = cy - r; y <= cy + r; y++) for (let x = cx - r; x <= cx + r; x++)
        if ((x - cx) ** 2 + (y - cy) ** 2 <= r * r) put(x, y);
    };
    const stroke = (x0, y0, x1, y1, r) => {
      const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0));
      for (let i = 0; i <= n; i++) {
        const k = n ? i / n : 0;
        disc(Math.round(x0 + (x1 - x0) * k), Math.round(y0 + (y1 - y0) * k), r);
      }
    };
    disc(80, 82, 25);
    stroke(70, 75, 57, 20, 7);
    stroke(90, 75, 104, 20, 7);
    return this.processImageData(data, w, h);
  }

  // QA: a broad fist with one short side protrusion (thumbs-up).
  injectThumbFrame(on = true, w = 160, h = 120) {
    this.synthetic = true;
    const data = new Uint8ClampedArray(w * h * 4);
    if (!on) return this.processImageData(data, w, h);
    const put = (x, y) => {
      if (x < 0 || x >= w || y < 0 || y >= h) return;
      const i = (y * w + x) * 4;
      data[i] = 200; data[i + 1] = 140; data[i + 2] = 110; data[i + 3] = 255;
    };
    for (let y = 62; y <= 105; y++) for (let x = 55; x <= 105; x++) put(x, y);
    const stroke = (x0, y0, x1, y1, r) => {
      const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0));
      for (let i = 0; i <= n; i++) {
        const k = n ? i / n : 0;
        const cx = Math.round(x0 + (x1 - x0) * k);
        const cy = Math.round(y0 + (y1 - y0) * k);
        for (let yy = cy - r; yy <= cy + r; yy++) for (let xx = cx - r; xx <= cx + r; xx++)
          if ((xx - cx) ** 2 + (yy - cy) ** 2 <= r * r) put(xx, yy);
      }
    };
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      if ((x - 80) ** 2 + (y - 82) ** 2 <= 25 ** 2) put(x, y);
    }
    stroke(90, 65, 90, 28, 9);
    return this.processImageData(data, w, h);
  }

  injectEmpty(w = 320, h = 240) {
    this.synthetic = true;
    return this.processImageData(new Uint8ClampedArray(w * h * 4), w, h);
  }
  // QA: настоящий ImageBitmap (как с камеры) через главный поток.
  async ingestBitmap(bmp) {
    const c = document.createElement('canvas');
    c.width = bmp.width; c.height = bmp.height;
    const x = c.getContext('2d', { willReadFrequently: true });
    x.drawImage(bmp, 0, 0);
    const img = x.getImageData(0, 0, c.width, c.height);
    if (bmp.close) bmp.close();
    this.synthetic = true;
    return this.processImageData(img.data, c.width, c.height);
  }

  info() {
    return {
      running: this.running, synthetic: this.synthetic, found: this.found,
      fresh: this.fresh(), yaw: +this.yaw.toFixed(1), pitch: +this.pitch.toFixed(1),
      hue: Math.round(this.hue), hueA: Math.round(this.hueA), hueB: Math.round(this.hueB), count: this.count,
      dual: !!this.dual, dualCalibrated: !!this.dualCalibration,
      gestureEnabled: !!this.gestureEnabled, gestureV: !!this.gestureV,
      gestureFresh: this.gestureFresh(), gestureConfidence: +this.gestureConfidence.toFixed(2),
      thumbUp: !!this.thumbUp, thumbFresh: this.thumbFresh(),
      thumbConfidence: +this.thumbConfidence.toFixed(2),
      dualVisible: [...this.dualVisible], lastLostMarker: this.lastLostMarker, lostMarkers: [...this.lostMarkers],
      pairState: this.pairState,
      dualTrust: { left: +this.dualTrust.left.toFixed(2), right: +this.dualTrust.right.toFixed(2) },
      dualDeltas: this.markers.map((m) => ({
        id: m.id,
        deltaYaw: m.deltaYaw === null || m.deltaYaw === undefined ? null : +m.deltaYaw.toFixed(1),
        residual: m.residual === null || m.residual === undefined ? null : +m.residual.toFixed(1),
        expected: m.expected !== false,
      })),
      dualUsed: [...(this.dualUsed || [])],
      dualMissing: { ...this.dualMissing },
      yawRate: Math.round(this.yawRate || 0),
      markerEntity: Object.fromEntries(Object.entries(this.markerEntity || {}).map(([id, st]) => [id, {
        confirmed: !!st.confirmed,
        ms: st.confirmed && st.seenSince ? Math.round(performance.now() - st.seenSince) : 0,
      }])),
      markerShape: this.markerShape ? {
        ok: !!this.markerShape.ok, judged: !!this.markerShape.judged,
        aspect: this.markerShape.aspect === null ? null : +this.markerShape.aspect.toFixed(2),
        fill: this.markerShape.fill === null ? null : +this.markerShape.fill.toFixed(2),
        clipped: !!this.markerShape.clipped,
      } : null,
      markers: this.markers.map((m) => ({
        id: m.id, found: !!m.found, u: m.found ? +m.u.toFixed(3) : null, v: m.found ? +m.v.toFixed(3) : null,
        count: m.count || 0, entity: !!m.entity, entityMs: m.entityMs || 0,
        shapeOk: m.found ? m.shapeOk !== false : null,
        aspect: m.shape && m.shape.aspect !== null ? +m.shape.aspect.toFixed(2) : null,
        fill: m.shape && m.shape.fill !== null ? +m.shape.fill.toFixed(2) : null,
        clipped: m.shape ? !!m.shape.clipped : null,
      })),
      procMs: +this.procMs.toFixed(1), procW: this.procW, tier: this.tier, intervalMs: this.intervalMs,
      tol: this.tol, satMin: this.satMin,
      heldYaw: +this.heldYaw.toFixed(1), heldPitch: +this.heldPitch.toFixed(1),
      exitSideX: this.exitSideX, exitSideY: this.exitSideY,
      worker: this.workerActive(), workerAvailable: !!this.ensureWorker() && !!this._worker,
    };
  }
}
