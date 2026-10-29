// wristBeaconTracker.js — помехозащищённый детектор двухцветного светящегося
// маяка на экране телефона-браслета для задней камеры VR-очков «Белой ночи».
//
// Защита от бытовых помех в комнате:
//   1. Поиск локального максимума яркости по сетке (8x6 ячеек) вместо наивного
//      усреднения по всему кадру: зелёный цветок на окне и зелёное пятно на руке
//      не сливаются в воображаемую точку между ними.
//   2. Учёт лёгкого пересвета центра OLED-пятна автоэкспозицией камеры в сумерках.
//   3. Геометрическая взаимная проверка пары (#00ff66 + #ff00aa): сопоставимая
//      площадь пятен и разумный разнос; одиночное пятно ('single') удерживается
//      только 400 мс после подтверждённой пары и только рядом с её позицией,
//      чтобы случайные цветные предметы в комнате никогда не уводили руку.

import { hueOf } from './markerTracker.js';

const ANALYZE_W = 200;
const ANALYZE_H = 150;
const PROCESS_INTERVAL_MS = 90; // ~11 Гц (ведущий контур — 60 Гц гироскоп)
const GRID_COLS = 8;
const GRID_ROWS = 6;
const SINGLE_GRACE_MS = 400;

function circularHueDist(a, b) {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
}

export function detectLuminousSpot(data, w, h, targetHue, hueTol = 34) {
  const cellW = w / GRID_COLS;
  const cellH = h / GRID_ROWS;
  const gridScore = new Float64Array(GRID_COLS * GRID_ROWS);
  const gridSumX = new Float64Array(GRID_COLS * GRID_ROWS);
  const gridSumY = new Float64Array(GRID_COLS * GRID_ROWS);

  // Шаг 1: находим самую яркую локальную ячейку нужного оттенка
  for (let y = 0; y < h; y++) {
    const gy = Math.min(GRID_ROWS - 1, (y / cellH) | 0);
    const row = y * w * 4;
    for (let x = 0; x < w; x++) {
      const i = row + x * 4;
      const r = data[i], g = data[i + 1], b = data[i + 2];
      const { hue, sat, val, chroma } = hueOf(r, g, b);
      if (hue < 0 || val < 72) continue;
      // Допускаем чуть меньшую насыщенность в самом ярком ядре экрана (val >= 200)
      const minSat = val >= 205 ? 20 : 36;
      const minChroma = val >= 205 ? 34 : 52;
      if (sat < minSat || chroma < minChroma) continue;
      const dist = circularHueDist(hue, targetHue);
      if (dist > hueTol) continue;

      const weight = (1 - dist / (hueTol + 1)) * (0.35 + (sat / 100) * 0.65) * Math.pow(val / 255, 1.35);
      const cellIdx = gy * GRID_COLS + Math.min(GRID_COLS - 1, (x / cellW) | 0);
      gridScore[cellIdx] += weight;
      gridSumX[cellIdx] += x * weight;
      gridSumY[cellIdx] += y * weight;
    }
  }

  // Находим лучший кластер 2x2 соседних ячеек (на случай, если пятно легло на границу ячейки)
  let bestScore = 0;
  let seedX = w * 0.5;
  let seedY = h * 0.5;
  for (let gy = 0; gy < GRID_ROWS; gy++) {
    for (let gx = 0; gx < GRID_COLS; gx++) {
      let sumS = 0, sumX = 0, sumY = 0;
      for (let dy = 0; dy <= 1 && gy + dy < GRID_ROWS; dy++) {
        for (let dx = 0; dx <= 1 && gx + dx < GRID_COLS; dx++) {
          const idx = (gy + dy) * GRID_COLS + (gx + dx);
          sumS += gridScore[idx];
          sumX += gridSumX[idx];
          sumY += gridSumY[idx];
        }
      }
      if (sumS > bestScore) {
        bestScore = sumS;
        seedX = sumX / sumS;
        seedY = sumY / sumS;
      }
    }
  }

  if (bestScore < 1.2) return { found: false, count: 0 };

  // Шаг 2: собираем компактное пятно ТОЛЬКО в локальном радиусе вокруг найденного пика
  const winR = Math.max(22, Math.round(Math.min(w, h) * 0.24));
  const x0 = Math.max(0, Math.floor(seedX - winR));
  const x1 = Math.min(w - 1, Math.ceil(seedX + winR));
  const y0 = Math.max(0, Math.floor(seedY - winR));
  const y1 = Math.min(h - 1, Math.ceil(seedY + winR));

  let sx = 0, sy = 0, sw = 0, count = 0;
  let minX = w, maxX = -1, minY = h, maxY = -1;
  for (let y = y0; y <= y1; y++) {
    const row = y * w * 4;
    for (let x = x0; x <= x1; x++) {
      if (Math.hypot(x - seedX, y - seedY) > winR) continue;
      const i = row + x * 4;
      const r = data[i], g = data[i + 1], b = data[i + 2];
      const { hue, sat, val, chroma } = hueOf(r, g, b);
      if (hue < 0 || val < 72) continue;
      const minSat = val >= 205 ? 20 : 36;
      const minChroma = val >= 205 ? 34 : 52;
      if (sat < minSat || chroma < minChroma) continue;
      const dist = circularHueDist(hue, targetHue);
      if (dist > hueTol) continue;

      const weight = (1 - dist / (hueTol + 1)) * (0.35 + (sat / 100) * 0.65) * (val / 255);
      sx += x * weight;
      sy += y * weight;
      sw += weight;
      count++;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }

  if (count < 7 || sw <= 0) return { found: false, count: 0 };
  const bbW = maxX - minX + 1;
  const bbH = maxY - minY + 1;
  const fill = count / Math.max(1, bbW * bbH);
  // Пятно на экране компактное (не растянутая на полкомнаты штора и не редкий шум)
  if (bbW > w * 0.45 || bbH > h * 0.45 || fill < 0.25) return { found: false, count: 0 };

  const cx = sx / sw;
  const cy = sy / sw;
  return {
    found: true,
    count,
    u: (cx + 0.5) / w,
    v: (cy + 0.5) / h,
    bbW,
    bbH,
    fill,
  };
}

export class WristBeaconTracker {
  constructor(video = null) {
    this.aspectY = 0.75; // 4:3 — типовой кадр задней камеры телефона
    this.video = video;
    this.stream = null;
    this.running = false;
    this.synthetic = false;
    this.error = null;
    this.distalHue = 144;   // #00ff66
    this.proximalHue = 320; // #ff00aa
    this.canvas = typeof document !== 'undefined' ? document.createElement('canvas') : null;
    if (this.canvas) {
      this.canvas.width = ANALYZE_W;
      this.canvas.height = ANALYZE_H;
    }
    this.ctx = this.canvas?.getContext('2d', { willReadFrequently: true }) || null;
    this.lastProcessAt = 0;
    this.processMs = 0;
    this.lastPairAt = -10000;
    this.lastPairPos = { u: 0.5, v: 0.55, spanNorm: 0.12 };
    this.latest = {
      status: 'none',
      u: 0.5,
      v: 0.55,
      spanNorm: 0,
      rollRad: 0,
      distalFound: false,
      proximalFound: false,
      ts: 0,
    };
  }

  async start(video = this.video) {
    if (this.synthetic) {
      this.running = true;
      return true;
    }
    if (!navigator.mediaDevices?.getUserMedia) {
      this.error = 'Камера недоступна в этом браузере';
      return false;
    }
    this.video = video || this.video;
    const attempts = [
      { video: { facingMode: { exact: 'environment' }, width: { ideal: 640 }, height: { ideal: 480 } }, audio: false },
      { video: { facingMode: { ideal: 'environment' }, width: { ideal: 640 }, height: { ideal: 480 } }, audio: false },
      { video: true, audio: false },
    ];
    let lastErr = null;
    for (const c of attempts) {
      try {
        this.stream = await navigator.mediaDevices.getUserMedia(c);
        if (this.video) {
          this.video.srcObject = this.stream;
          await this.video.play();
        }
        this.running = true;
        this.error = null;
        return true;
      } catch (e) {
        lastErr = e;
      }
    }
    this.error = lastErr?.message || 'Не удалось включить камеру';
    this.running = false;
    return false;
  }

  stop() {
    if (this.stream) {
      for (const t of this.stream.getTracks()) t.stop();
      this.stream = null;
    }
    if (this.video && this.video.srcObject) this.video.srcObject = null;
    this.running = false;
    this.synthetic = false;
  }

  analyzeRgba(data, w = ANALYZE_W, h = ANALYZE_H, now = performance.now(), videoAspectY = h / w) {
    this.aspectY = Number.isFinite(videoAspectY) && videoAspectY > 0.1 ? videoAspectY : h / w;
    const distal = detectLuminousSpot(data, w, h, this.distalHue);
    const proximal = detectLuminousSpot(data, w, h, this.proximalHue);
    return this._commitSpots(distal, proximal, w, h, now, videoAspectY);
  }

  _commitSpots(distal, proximal, w, h, now, videoAspectY = h / w) {
    const aspectY = Number.isFinite(videoAspectY) && videoAspectY > 0.1 ? videoAspectY : (h / w);
    // Реальное соотношение сторон кадра нужно игре, чтобы перевести пиксели в УГЛЫ
    // (иначе вертикаль предплечья считается с коэффициентом 0.75 на 16:9-камере).
    this.aspectY = aspectY;
    // Диагональная нормировка (с эталоном 4:3 -> 1.25): расстояние между пятнами НЕ «дышит»
    // при повороте кисти на 90° перед камерой 16:9 и НЕ сбивается при перевороте телефона
    // из портретного окна калибровки (480x640) в ландшафтные VR-очки (640x480)!
    const diagScale = 1.25 / Math.hypot(1, aspectY);
    if (distal.found && proximal.found) {
      const dx = (distal.u - proximal.u) * diagScale;
      const dy = (distal.v - proximal.v) * aspectY * diagScale;
      const spanNorm = Math.hypot(dx, dy);
      const areaA = Math.max(1, distal.count || 1);
      const areaB = Math.max(1, proximal.count || 1);
      const areaRatio = Math.max(areaA / areaB, areaB / areaA);
      // Оба пятна на одном экране имеют сопоставимый размер и лежат рядом
      if (spanNorm >= 0.018 && spanNorm <= 0.58 && areaRatio <= 9) {
        const u = (distal.u + proximal.u) * 0.5;
        const v = (distal.v + proximal.v) * 0.5;
        this.lastPairAt = now;
        this.lastPairPos = { u, v, spanNorm };
        this.latest = {
          status: 'pair',
          u,
          v,
          spanNorm,
          rollRad: Math.atan2(-dy, dx),
          distalFound: true,
          proximalFound: true,
          ts: now,
        };
        return this.latest;
      }
    }

    // Одиночное пятно допускаем ТОЛЬКО как кратковременное удержание после недавней пары
    // и только рядом с последней известной позицией браслета (игнорируя цветные вещи в комнате!)
    const one = distal.found ? distal : (proximal.found ? proximal : null);
    if (
      one &&
      now - this.lastPairAt <= SINGLE_GRACE_MS &&
      Math.hypot(one.u - this.lastPairPos.u, one.v - this.lastPairPos.v) <= 0.20
    ) {
      this.latest = {
        status: 'single',
        u: one.u,
        v: one.v,
        spanNorm: this.lastPairPos.spanNorm,
        rollRad: this.latest.rollRad,
        distalFound: !!distal.found,
        proximalFound: !!proximal.found,
        ts: now,
      };
      return this.latest;
    }

    this.latest = {
      ...this.latest,
      status: 'none',
      distalFound: false,
      proximalFound: false,
    };
    return this.latest;
  }

  process(force = false, now = performance.now()) {
    if (this.synthetic) return this.latest;
    if (!this.running || !this.video || !this.ctx || this.video.readyState < 2) return this.latest;
    if (!force && now - this.lastProcessAt < PROCESS_INTERVAL_MS) return this.latest;
    const t0 = performance.now();
    this.lastProcessAt = now;
    try {
      const vw = this.video.videoWidth || ANALYZE_W;
      const vh = this.video.videoHeight || ANALYZE_H;
      this.ctx.drawImage(this.video, 0, 0, ANALYZE_W, ANALYZE_H);
      const frame = this.ctx.getImageData(0, 0, ANALYZE_W, ANALYZE_H);
      this.analyzeRgba(frame.data, ANALYZE_W, ANALYZE_H, now, vh / vw);
    } catch {
      // Игнорируем единичный пропуск видеокадра
    }
    this.processMs = +(performance.now() - t0).toFixed(2);
    return this.latest;
  }

  /**
   * Синтетическая подача маяка для детерминированных unit/E2E тестов.
   */
  inject({ distal = null, proximal = null } = {}, now = performance.now()) {
    this.synthetic = true;
    this.running = true;
    const d = distal
      ? { found: true, u: distal.u, v: distal.v, count: distal.count ?? 90 }
      : { found: false, count: 0 };
    const p = proximal
      ? { found: true, u: proximal.u, v: proximal.v, count: proximal.count ?? 90 }
      : { found: false, count: 0 };
    return this._commitSpots(d, p, ANALYZE_W, ANALYZE_H, now);
  }

  sample(now = performance.now()) {
    const ageMs = this.latest.ts ? now - this.latest.ts : Infinity;
    return {
      ...this.latest,
      aspectY: +this.aspectY.toFixed(4),
      fresh: ageMs <= 450 && this.latest.status !== 'none',
      ageMs: Number.isFinite(ageMs) ? Math.round(ageMs) : null,
    };
  }

  info() {
    const s = this.sample();
    return {
      running: this.running,
      synthetic: this.synthetic,
      error: this.error,
      status: s.status,
      fresh: s.fresh,
      u: +s.u.toFixed(3),
      v: +s.v.toFixed(3),
      spanNorm: +s.spanNorm.toFixed(4),
      rollDeg: +(s.rollRad * 180 / Math.PI).toFixed(1),
      distalFound: s.distalFound,
      proximalFound: s.proximalFound,
      processMs: this.processMs,
    };
  }
}
