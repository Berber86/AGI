// wristBeaconTracker.js — детектор двухцветного светящегося маяка на экране
// телефона-браслета для задней камеры VR-очков «Белой ночи».
//
// На чисто-чёрном экране второго телефона горят два контрастных пятна:
//   - distal   (ближе к кисти/пальцам): лаймово-зелёный (#00ff66, Hue ≈ 144°)
//   - proximal (ближе к локтю):         ярко-пурпурный  (#ff00aa, Hue ≈ 320°)
//
// Середина отрезка даёт 2D-положение запястья (u, v) в поле зрения очков,
// видимое расстояние между пятнами (spanNorm) даёт оптическую дальность руки,
// а угол вектора proximal -> distal даёт 2D-крен экрана без участия компаса.

import { hueOf } from './markerTracker.js';

const ANALYZE_W = 200;
const ANALYZE_H = 150;
const PROCESS_INTERVAL_MS = 90; // ~11 Гц (ведущий контур — 60 Гц гироскоп)

function circularHueDist(a, b) {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
}

export function detectLuminousSpot(data, w, h, targetHue, hueTol = 34) {
  let sx = 0, sy = 0, sw = 0, count = 0;
  let minX = w, maxX = -1, minY = h, maxY = -1;
  for (let y = 0; y < h; y++) {
    const row = y * w * 4;
    for (let x = 0; x < w; x++) {
      const i = row + x * 4;
      const r = data[i], g = data[i + 1], b = data[i + 2];
      // Светящийся экран даёт высокую яркость и насыщенность даже в сумерках
      const { hue, sat, val, chroma } = hueOf(r, g, b);
      if (hue < 0 || sat < 38 || val < 75 || chroma < 55) continue;
      const dist = circularHueDist(hue, targetHue);
      if (dist > hueTol) continue;
      const weight = (1 - dist / (hueTol + 1)) * (sat / 100) * (val / 255);
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
  if (count < 8 || sw <= 0) return { found: false, count: 0 };
  const bbW = maxX - minX + 1;
  const bbH = maxY - minY + 1;
  if (bbW > w * 0.8 || bbH > h * 0.8) return { found: false, count: 0 };
  const cx = sx / sw;
  const cy = sy / sw;
  return {
    found: true,
    count,
    u: (cx + 0.5) / w,
    v: (cy + 0.5) / h,
    bbW,
    bbH,
  };
}

export class WristBeaconTracker {
  constructor(video = null) {
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

  analyzeRgba(data, w = ANALYZE_W, h = ANALYZE_H, now = performance.now()) {
    const distal = detectLuminousSpot(data, w, h, this.distalHue);
    const proximal = detectLuminousSpot(data, w, h, this.proximalHue);
    return this._commitSpots(distal, proximal, w, h, now);
  }

  _commitSpots(distal, proximal, w, h, now) {
    const aspectY = h / w;
    if (distal.found && proximal.found) {
      const dx = distal.u - proximal.u;
      const dy = (distal.v - proximal.v) * aspectY;
      const spanNorm = Math.hypot(dx, dy);
      if (spanNorm >= 0.018 && spanNorm <= 0.65) {
        this.latest = {
          status: 'pair',
          u: (distal.u + proximal.u) * 0.5,
          v: (distal.v + proximal.v) * 0.5,
          spanNorm,
          rollRad: Math.atan2(-dy, dx),
          distalFound: true,
          proximalFound: true,
          ts: now,
        };
        return this.latest;
      }
    }
    const one = distal.found ? distal : (proximal.found ? proximal : null);
    if (one) {
      const singleScale = Math.sqrt(one.count / (w * h)) * 2.35;
      this.latest = {
        status: 'single',
        u: one.u,
        v: one.v,
        spanNorm: singleScale,
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
      this.ctx.drawImage(this.video, 0, 0, ANALYZE_W, ANALYZE_H);
      const frame = this.ctx.getImageData(0, 0, ANALYZE_W, ANALYZE_H);
      this.analyzeRgba(frame.data, ANALYZE_W, ANALYZE_H, now);
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
