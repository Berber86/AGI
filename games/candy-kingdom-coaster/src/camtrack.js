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
  raspberry: { label: 'Малиновый', hue: 338 },
  magenta: { label: 'Маджента', hue: 300 },
  lime: { label: 'Лайм', hue: 140 },
  cyan: { label: 'Циан', hue: 190 },
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
  if (!best || best.count < 40 || best.count > w * h * 0.7) return { found: false, count: best ? best.count : 0 };
  return { found: true, count: best.count, u: best.sx / best.count, v: best.sy / best.count };
}

// Углы из центроида; центр калибровки — НОРМАЛИЗОВАННЫЙ (0..1), чтобы
// ярусы разрешения не ломали ноль.
export function anglesFromCentroid(u, v, w, h, c0n, fovDeg) {
  const fx = (w / 2) / Math.tan(((fovDeg * Math.PI) / 180) / 2);
  const cx = c0n ? c0n.x * w : w / 2;
  const cy = c0n ? c0n.y * h : h / 2;
  return {
    yaw: (Math.atan((u - cx) / fx) * 180) / Math.PI,
    pitch: -(Math.atan((v - cy) / fx) * 180) / Math.PI,
  };
}

const TIER_W = [160, 128, 112];
const TIER_MS = [100, 130, 170];

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
    this.c0n = null; // нормализованный центр калибровки
    this.lastFoundAt = 0;
    this.lastFrame = null;
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
    const want = { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 }, frameRate: { ideal: 24, max: 30 } };
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

  _applyResult(res, w, h) {
    this.frameW = w; this.frameH = h;
    if (res.found) {
      const a = anglesFromCentroid(res.u, res.v, w, h, this.c0n, this.fovDeg);
      this.yaw = a.yaw; this.pitch = a.pitch;
      this.u = res.u; this.v = res.v; this.count = res.count;
      this.found = true;
      this.lastFoundAt = performance.now();
    } else {
      this.found = false;
      this.count = res.count || 0;
    }
    return res;
  }

  processImageData(data, w, h) {
    this.lastFrame = { data, w, h };
    return this._applyResult(analyzeColorBlob(data, w, h, this.hue, this.tol, this.satMin), w, h);
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
          bitmap: bmp, hue: this.hue, tol: this.tol, satMin: this.satMin,
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
    this.c0n = this.found
      ? { x: this.u / this.frameW, y: this.v / this.frameH }
      : { x: 0.5, y: 0.5 };
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
      hue: Math.round(this.hue), count: this.count,
      procMs: +this.procMs.toFixed(1), procW: this.procW, tier: this.tier, intervalMs: this.intervalMs,
      worker: this.workerActive(), workerAvailable: !!this.ensureWorker() && !!this._worker,
    };
  }
}
