// camtrack.js — камера как «компас взгляда»: яркая метка (печатная или
// реальный предмет вроде малиновой коробки) через заднюю камеру телефона.
// Конвейер из стенда трекинга: кадр 320 px -> маска по оттенку (HSV) ->
// КРУПНЕЙШЕЕ связное пятно -> центроид -> yaw/pitch по геометрии камеры.
// Всё локально, без библиотек и сети. Гироскоп здесь не участвует.

export const CAM_COLORS = {
  raspberry: { label: 'Малиновый', hue: 338 },
  magenta: { label: 'Маджента', hue: 300 },
  lime: { label: 'Лайм', hue: 140 },
  cyan: { label: 'Циан', hue: 190 },
};

function hueOf(r, g, b) {
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
    if (d < mx * satMin) continue; // дешёвый целочисленный отсев до вычисления оттенка
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
    let count = 0, sx = 0, sy = 0;
    stack.length = 0; stack.push(start); seen[start] = 1;
    while (stack.length) {
      const cur = stack.pop();
      const x = cur % w, y = (cur / w) | 0;
      count++; sx += x; sy += y;
      if (x > 0 && mask[cur - 1] && !seen[cur - 1]) { seen[cur - 1] = 1; stack.push(cur - 1); }
      if (x < w - 1 && mask[cur + 1] && !seen[cur + 1]) { seen[cur + 1] = 1; stack.push(cur + 1); }
      if (y > 0 && mask[cur - w] && !seen[cur - w]) { seen[cur - w] = 1; stack.push(cur - w); }
      if (y < h - 1 && mask[cur + w] && !seen[cur + w]) { seen[cur + w] = 1; stack.push(cur + w); }
    }
    if (!best || count > best.count) best = { count, sx, sy };
  }
  if (!best || best.count < 60 || best.count > w * h * 0.7) return { found: false, count: best ? best.count : 0 };
  return { found: true, count: best.count, u: best.sx / best.count, v: best.sy / best.count };
}

export class CamTracker {
  constructor() {
    this.hue = CAM_COLORS.raspberry.hue;
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
    this.c0 = null;
    this.lastFoundAt = 0;
    this.lastFrame = null;
    // Адаптивная цена анализа: замеряем длительность обработки и при
    // перегрузе снижаем разрешение/частоту, а не роняем FPS игры.
    this.tier = 0;
    this.procW = 256;
    this.intervalMs = 85;
    this.procMs = 0;
    this._lastAdapt = 0;
    this._work = document.createElement('canvas');
    this._wctx = this._work.getContext('2d', { willReadFrequently: true });
  }

  async start(video) {
    if (this.running && this.video === video) return;
    this.stop();
    let stream;
    // Поток просим маленький: полный сенсор (1080p) греет SoC и дорого
    // декодируется/масштабируется в каждый анализируемый кадр.
    const want = { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 }, frameRate: { ideal: 30, max: 30 } };
    try { stream = await navigator.mediaDevices.getUserMedia({ video: want, audio: false }); }
    catch { stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false }); }
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
  }

  _fx(w) { return (w / 2) / Math.tan(((this.fovDeg * Math.PI) / 180) / 2); }

  processImageData(data, w, h) {
    const t0 = performance.now();
    this.frameW = w; this.frameH = h;
    this.lastFrame = { data, w, h };
    const res = analyzeColorBlob(data, w, h, this.hue, this.tol, this.satMin);
    const ms = performance.now() - t0;
    this.procMs = this.procMs ? this.procMs * 0.8 + ms * 0.2 : ms;
    if (t0 - this._lastAdapt > 1000) {
      if (this.procMs > 12 && this.tier < 2) { this.tier++; this._lastAdapt = t0; }
      else if (this.procMs < 4 && this.tier > 0) { this.tier--; this._lastAdapt = t0; }
      this.procW = [256, 192, 160][this.tier];
      this.intervalMs = [85, 115, 150][this.tier];
    }
    if (res.found) {
      const fx = this._fx(w);
      const cx = this.c0 ? this.c0.x : w / 2;
      const cy = this.c0 ? this.c0.y : h / 2;
      this.yaw = (Math.atan((res.u - cx) / fx) * 180) / Math.PI;
      this.pitch = -(Math.atan((res.v - cy) / fx) * 180) / Math.PI;
      this.u = res.u; this.v = res.v; this.count = res.count;
      this.found = true;
      this.lastFoundAt = performance.now();
    } else {
      this.found = false;
      this.count = res.count;
    }
    return res;
  }

  process() {
    if (this.synthetic) return this.found;
    const vid = this.video;
    if (!this.running || !vid || !vid.videoWidth) return false;
    const w = this.procW;
    const h = Math.max(2, Math.round((w * vid.videoHeight) / vid.videoWidth));
    this._work.width = w; this._work.height = h;
    this._wctx.drawImage(vid, 0, 0, w, h);
    const img = this._wctx.getImageData(0, 0, w, h);
    this.processImageData(img.data, w, h);
    return this.found;
  }

  // Оттенок реального предмета по центру последнего кадра (коробка!).
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
    this.c0 = this.found ? { x: this.u, y: this.v } : { x: this.frameW / 2, y: this.frameH / 2 };
    if (this.found) { this.yaw = 0; this.pitch = 0; }
  }

  fresh(maxMs = 700) { return this.found && (performance.now() - this.lastFoundAt) <= maxMs; }

  // QA: синтетическая метка без настоящей камеры.
  injectBlob(cx, cy, r, w = 320, h = 240) {
    this.synthetic = true;
    const data = new Uint8ClampedArray(w * h * 4);
    // малиновый ~ оттенок 339°
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const dx = x - cx, dy = y - cy;
      if (dx * dx + dy * dy <= r * r) {
        const i = (y * w + x) * 4;
        data[i] = 215; data[i + 1] = 51; data[i + 2] = 108; data[i + 3] = 255;
      }
    }
    return this.processImageData(data, w, h);
  }
  injectEmpty(w = 320, h = 240) {
    this.synthetic = true;
    return this.processImageData(new Uint8ClampedArray(w * h * 4), w, h);
  }

  info() {
    return {
      running: this.running, synthetic: this.synthetic, found: this.found,
      fresh: this.fresh(), yaw: +this.yaw.toFixed(1), pitch: +this.pitch.toFixed(1),
      hue: Math.round(this.hue), count: this.count,
      procMs: +this.procMs.toFixed(1), procW: this.procW, tier: this.tier, intervalMs: this.intervalMs,
    };
  }
}
