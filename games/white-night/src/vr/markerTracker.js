// markerTracker.js — two-colour absolute anchor for White Night VR.
//
// The rear camera sees two coloured landmarks. A head turn right moves both
// landmarks left in the image, and a look up moves them down. The provider
// converts that image motion into semantic angles (yaw > 0 right, pitch > 0
// up), but only trusts blobs that survive entity/shape gates. A proven pair
// is `valid`; one proven landmark can be a weaker `single` anchor. This is a
// measurement provider for FusionLook, not a smoothed look controller.

const DEG = Math.PI / 180;
const ANALYZE_W = 240;
const ANALYZE_H = 180;
const FOV_X_DEG = 62;
const FOV_Y_DEG = 48;
const ENTITY_MIN_SEC = 0.15;
const ENTITY_GRACE_SEC = 0.3;
const HELD_FALLBACK_MS = 900;
const PROCESS_INTERVAL_MS = 120;

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

export function hueOf(r, g, b, dampen = null) {
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
  if (!d) return { hue: -1, sat: 0, val: mx, chroma: 0 };
  let hue;
  if (mx === r) hue = 60 * (((g - b) / d) % 6);
  else if (mx === g) hue = 60 * ((b - r) / d + 2);
  else hue = 60 * ((r - g) / d + 4);
  if (hue < 0) hue += 360;
  if (dampen) return { hue, sat: (dampen(d, hue) / 255) * 100, val: mx, chroma: d };
  return { hue, sat: (d / 255) * 100, val: mx, chroma: d };
}

export function analyzeColorBlob(data, w, h, hueCenter) {
  let fx = 0, fy = 0, fw = 0, n = 0;
  let minX = 1e9, maxX = -1e9, minY = 1e9, maxY = -1e9, maxSat = 0, maxChroma = 0, bright = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const { hue, sat, val, chroma } = hueOf(data[i], data[i + 1], data[i + 2]);
      if (hue < 0) continue;
      let dist = Math.abs(hue - hueCenter);
      if (dist > 180) dist = 360 - dist;
      if (dist > 30 || sat < 14 || val < 40 || chroma < 40) continue;
      bright++;
      if (sat > maxSat) maxSat = sat;
      if (chroma > maxChroma) maxChroma = chroma;
      const weight = (1 - dist / 30) * (sat / 100);
      fx += x * weight; fy += y * weight; fw += weight; n++;
      if (x < minX) minX = x; if (x > maxX) maxX = x;
      if (y < minY) minY = y; if (y > maxY) maxY = y;
    }
  }
  if (n < 15 || fw <= 0) return { found: false, bright, n };
  const bbW = maxX - minX + 1, bbH = maxY - minY + 1;
  const fill = n / Math.max(1, bbW * bbH);
  if (bbW > w * 0.75 || bbH > h * 0.75) return { found: false, bright, n };
  return {
    found: true, cx: fx / fw, cy: fy / fw, area: n, bright, n,
    bbW, bbH, fill, maxSat, maxChroma, minX, maxX, minY, maxY,
  };
}

function rgbForHue(hue) {
  const sector = (((hue % 360) + 360) % 360) / 60;
  const x = Math.round(255 * (1 - Math.abs((sector % 2) - 1)));
  if (sector < 1) return [255, x, 0];
  if (sector < 2) return [x, 255, 0];
  if (sector < 3) return [0, 255, x];
  if (sector < 4) return [0, x, 255];
  if (sector < 5) return [x, 0, 255];
  return [255, 0, x];
}

function rawAnglesFor(u, v, center) {
  return {
    // Landmarks move opposite to the semantic head direction in the image.
    yaw: -(u - center.x) * FOV_X_DEG * DEG,
    pitch: (v - center.y) * FOV_Y_DEG * DEG,
  };
}

function shapeOk(blob, baseShape, width, height) {
  if (!blob?.found) return false;
  const aspect = blob.bbW / Math.max(1, blob.bbH);
  if (blob.fill < 0.38) return false;
  const clipped = blob.minX <= 1 || blob.minY <= 1 || blob.maxX >= width - 2 || blob.maxY >= height - 2;
  if (clipped) return true;
  const minAspect = baseShape ? Math.max(0.85, baseShape.aspect * 0.45) : 1.15;
  return aspect >= minAspect;
}

export class DualMarkerTracker {
  constructor(video = null) {
    this.video = video;
    this.stream = null;
    this.running = false;
    this.error = null;
    this.synthetic = false;
    this.canvas = typeof document !== 'undefined' ? document.createElement('canvas') : null;
    if (this.canvas) { this.canvas.width = ANALYZE_W; this.canvas.height = ANALYZE_H; }
    this.ctx = this.canvas?.getContext('2d', { willReadFrequently: true }) || null;
    this.lastFrame = null;
    this.lastProcessAt = 0;
    this.processMs = 0;
    this.defs = [
      { id: 'left', hue: 16 },
      { id: 'right', hue: 338 },
    ];
    this.markers = this.defs.map((def) => ({ ...def, found: false, entity: false, usable: false, u: 0, v: 0, seenSince: 0, lostAt: 0, blob: null, raw: { yaw: 0, pitch: 0 }, delta: { yaw: 0, pitch: 0 }, shapeOk: false }));
    this.calibration = null;
    this.held = null;
    this.heldAt = 0;
    this.accepted = null;
    this.acceptedAt = 0;
    this.pending = null;
    this.pairState = 'none';
    this.pairSeparationDeg = 0;
    this.pairDisagreementDeg = 0;
  }

  setHues(leftHue, rightHue) {
    if (Number.isFinite(leftHue)) this.defs[0].hue = ((leftHue % 360) + 360) % 360;
    if (Number.isFinite(rightHue)) this.defs[1].hue = ((rightHue % 360) + 360) % 360;
    for (let i = 0; i < 2; i++) this.markers[i].hue = this.defs[i].hue;
  }

  get calibrated() { return !!this.calibration; }

  async start(video = this.video) {
    if (this.synthetic) { this.running = true; return true; }
    if (!navigator.mediaDevices?.getUserMedia) {
      this.error = 'Камера недоступна в этом браузере';
      return false;
    }
    this.video = video || this.video;
    const attempts = [
      { video: { facingMode: { exact: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false },
      { video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false },
      { video: true, audio: false },
    ];
    let lastError = null;
    for (const constraints of attempts) {
      try {
        this.stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (this.video) {
          this.video.srcObject = this.stream;
          await this.video.play();
        }
        this.running = true;
        this.error = null;
        return true;
      } catch (error) { lastError = error; }
    }
    this.error = lastError?.message || 'Не удалось включить камеру';
    this.running = false;
    return false;
  }

  stop() {
    if (this.stream) for (const track of this.stream.getTracks()) track.stop();
    this.stream = null;
    if (this.video) this.video.srcObject = null;
    this.running = false;
    this.synthetic = false;
  }

  process(force = false) {
    if (this.synthetic || !this.running || !this.video || !this.ctx) return this.info();
    const now = performance.now();
    if (!force && now - this.lastProcessAt < PROCESS_INTERVAL_MS) return this.info();
    if (this.video.readyState < 2 || !this.video.videoWidth) return this.info();
    this.lastProcessAt = now;
    try {
      this.ctx.drawImage(this.video, 0, 0, ANALYZE_W, ANALYZE_H);
      const frame = this.ctx.getImageData(0, 0, ANALYZE_W, ANALYZE_H);
      return this.processImageData(frame.data, ANALYZE_W, ANALYZE_H, now, frame);
    } catch (error) {
      this.error = error?.message || 'Не удалось прочитать кадр камеры';
      return this.info();
    }
  }

  processImageData(data, width, height, now = performance.now(), frame = null) {
    const t0 = performance.now();
    this.lastFrame = frame || { data, width, height };
    const center = this.calibration?.center || { x: 0.5, y: 0.5 };
    for (let i = 0; i < 2; i++) {
      const marker = this.markers[i];
      const blob = analyzeColorBlob(data, width, height, this.defs[i].hue);
      const baseShape = this.calibration?.shapes?.[i] || null;
      marker.hue = this.defs[i].hue;
      marker.blob = blob;
      marker.found = !!blob.found;
      marker.shapeOk = shapeOk(blob, baseShape, width, height);
      if (blob.found) {
        marker.u = blob.cx / Math.max(1, width);
        marker.v = blob.cy / Math.max(1, height);
        marker.raw = rawAnglesFor(marker.u, marker.v, center);
        const baseRaw = this.calibration?.baseRaw?.[i];
        marker.delta = baseRaw ? { yaw: marker.raw.yaw - baseRaw.yaw, pitch: marker.raw.pitch - baseRaw.pitch } : { ...marker.raw };
      }
      this.updateEntity(marker, blob.found && marker.shapeOk, now);
      marker.usable = !!blob.found && marker.entity && marker.shapeOk;
    }
    const candidate = this.makeCandidate();
    this.accept(candidate, now);
    this.processMs = Math.max(0, performance.now() - t0);
    return this.info();
  }

  updateEntity(marker, plausible, now) {
    if (plausible) {
      if (!marker.seenSince) marker.seenSince = now;
      marker.lostAt = 0;
      if (now - marker.seenSince >= ENTITY_MIN_SEC * 1000) marker.entity = true;
      return;
    }
    marker.seenSince = 0;
    if (!marker.lostAt) marker.lostAt = now;
    if (now - marker.lostAt >= ENTITY_GRACE_SEC * 1000) marker.entity = false;
  }

  makeCandidate() {
    if (!this.calibration) { this.pairState = 'none'; return null; }
    const [left, right] = this.markers;
    const usable = this.markers.filter((m) => m.usable);
    this.pairDisagreementDeg = 0;
    this.pairSeparationDeg = 0;
    if (left.usable && right.usable) {
      const separation = (left.raw.yaw - right.raw.yaw) / DEG;
      this.pairSeparationDeg = +separation.toFixed(2);
      const expected = this.calibration.sepDeg;
      const disagreement = Math.hypot((left.delta.yaw - right.delta.yaw) / DEG, (left.delta.pitch - right.delta.pitch) / DEG);
      this.pairDisagreementDeg = +disagreement.toFixed(2);
      const orderedAndWide = right.u > left.u + 0.04 && separation > 5;
      if (orderedAndWide && Math.abs(separation - expected) <= Math.max(4, expected * 0.4) && disagreement <= 7) {
        this.pairState = 'valid';
        return {
          status: 'valid',
          yaw: (left.delta.yaw + right.delta.yaw) / 2,
          pitch: (left.delta.pitch + right.delta.pitch) / 2,
        };
      }
      this.pairState = 'conflict';
      const reference = this.accepted || { yaw: 0, pitch: 0 };
      const plausible = [left, right]
        .filter((m) => this.singlePlausible(m, m.delta))
        .sort((a, b) => Math.hypot(a.delta.yaw - reference.yaw, a.delta.pitch - reference.pitch)
          - Math.hypot(b.delta.yaw - reference.yaw, b.delta.pitch - reference.pitch));
      return plausible[0] ? { status: 'single', yaw: plausible[0].delta.yaw, pitch: plausible[0].delta.pitch } : null;
    }
    if (usable.length === 1) {
      const marker = usable[0];
      this.pairState = 'single';
      return this.singlePlausible(marker, marker.delta)
        ? { status: 'single', yaw: marker.delta.yaw, pitch: marker.delta.pitch }
        : null;
    }
    this.pairState = 'none';
    return null;
  }

  singlePlausible(marker, delta) {
    const centerX = this.calibration?.center?.x ?? 0.5;
    const onOwnSide = marker.id === 'left' ? marker.u <= centerX + 0.03 : marker.u >= centerX - 0.03;
    const nearHeld = this.accepted && Math.hypot(delta.yaw - this.accepted.yaw, delta.pitch - this.accepted.pitch) <= 8 * DEG;
    return onOwnSide || nearHeld;
  }

  accept(candidate, now) {
    if (!candidate) { this.pending = null; return; }
    if (!this.accepted || Math.hypot(candidate.yaw - this.accepted.yaw, candidate.pitch - this.accepted.pitch) <= 30 * DEG) {
      this.accepted = { ...candidate };
      this.acceptedAt = now;
      this.held = { yaw: candidate.yaw, pitch: candidate.pitch };
      this.heldAt = now;
      this.pending = null;
      return;
    }
    if (this.pending && Math.hypot(candidate.yaw - this.pending.yaw, candidate.pitch - this.pending.pitch) <= 3 * DEG) {
      this.pending.count += 1;
      if (this.pending.count >= 2) {
        this.accepted = { ...candidate };
        this.acceptedAt = now;
        this.held = { yaw: candidate.yaw, pitch: candidate.pitch };
        this.heldAt = now;
        this.pending = null;
      }
      return;
    }
    this.pending = { yaw: candidate.yaw, pitch: candidate.pitch, count: 1 };
  }

  calibrate(now = performance.now()) {
    const [left, right] = this.markers;
    if (!left.usable || !right.usable) {
      return { ok: false, message: 'Сначала покажите обе цветные метки и удерживайте их в кадре.' };
    }
    const center = { x: (left.u + right.u) / 2, y: (left.v + right.v) / 2 };
    const baseRaw = this.markers.map((m) => rawAnglesFor(m.u, m.v, center));
    const sepDeg = (baseRaw[0].yaw - baseRaw[1].yaw) / DEG;
    if (!(sepDeg >= 8)) {
      return { ok: false, message: 'Метки слишком близки или стоят не в том порядке: разнесите их шире.' };
    }
    this.calibration = {
      center,
      baseRaw,
      sepDeg: +sepDeg.toFixed(2),
      shapes: this.markers.map((m) => ({
        aspect: +(m.blob.bbW / Math.max(1, m.blob.bbH)).toFixed(3),
        area: m.blob.area,
      })),
    };
    for (let i = 0; i < 2; i++) {
      this.markers[i].raw = { ...baseRaw[i] };
      this.markers[i].delta = { yaw: 0, pitch: 0 };
    }
    this.accepted = { status: 'valid', yaw: 0, pitch: 0 };
    this.acceptedAt = now;
    this.held = { yaw: 0, pitch: 0 };
    this.heldAt = now;
    this.pending = null;
    this.pairState = 'valid';
    return { ok: true, message: 'Метки зафиксированы. Теперь можно надевать очки.' };
  }

  clearCalibration() {
    this.calibration = null;
    this.accepted = null;
    this.acceptedAt = 0;
    this.held = null;
    this.heldAt = 0;
    this.pending = null;
    this.pairState = 'none';
  }

  recalibrateCentre(now = performance.now()) {
    if (this.calibration) return this.calibrate(now);
    return { ok: false, message: 'Сначала выполните калибровку двух меток.' };
  }

  sample(now = performance.now()) {
    if (!this.calibration || !this.accepted || !this.held) return { status: 'lost', yaw: 0, pitch: 0 };
    if (now - this.heldAt > HELD_FALLBACK_MS) return { status: 'held', yaw: this.held.yaw, pitch: this.held.pitch };
    return { status: this.accepted.status, yaw: this.accepted.yaw, pitch: this.accepted.pitch };
  }

  sampleColor(clientX, clientY, rect) {
    if (!this.lastFrame || !rect || rect.width <= 0 || rect.height <= 0) return null;
    const { data, width, height } = this.lastFrame;
    const vw = this.video?.videoWidth || width;
    const vh = this.video?.videoHeight || height;
    const videoAspect = vw / Math.max(1, vh);
    const rectAspect = rect.width / rect.height;

    // Точный учёт полей object-fit: contain для камер 9:16 и 16:9 внутри блока 4:3,
    // чтобы касание пальцем попадало ровно в выбранный пиксель цветной метки!
    let renderW = rect.width;
    let renderH = rect.height;
    let offX = 0;
    let offY = 0;
    if (videoAspect > rectAspect + 1e-3) {
      renderH = rect.width / videoAspect;
      offY = (rect.height - renderH) * 0.5;
    } else if (videoAspect < rectAspect - 1e-3) {
      renderW = rect.height * videoAspect;
      offX = (rect.width - renderW) * 0.5;
    }

    const u = (clientX - rect.left - offX) / Math.max(1, renderW);
    const v = (clientY - rect.top - offY) / Math.max(1, renderH);
    if (u < 0 || u > 1 || v < 0 || v > 1) return null;

    const x = clamp(Math.round(u * (width - 1)), 0, width - 1);
    const y = clamp(Math.round(v * (height - 1)), 0, height - 1);
    let best = null;
    for (let yy = Math.max(0, y - 4); yy <= Math.min(height - 1, y + 4); yy++) {
      for (let xx = Math.max(0, x - 4); xx <= Math.min(width - 1, x + 4); xx++) {
        const i = (yy * width + xx) * 4;
        const px = hueOf(data[i], data[i + 1], data[i + 2]);
        if (px.hue >= 0 && (!best || px.chroma > best.chroma)) best = px;
      }
    }
    return best ? { hue: best.hue, sat: best.sat, val: best.val, chroma: best.chroma } : null;
  }

  inject(markers = [], now = performance.now()) {
    this.synthetic = true;
    this.running = true;
    const width = 320, height = 240;
    const data = new Uint8ClampedArray(width * height * 4);
    for (let i = 0; i < data.length; i += 4) { data[i] = 28; data[i + 1] = 30; data[i + 2] = 38; data[i + 3] = 255; }
    for (const marker of markers) this.paintMarker(data, width, height, marker);
    return this.processImageData(data, width, height, now, { data, width, height });
  }

  paintMarker(data, width, height, marker = {}) {
    const def = this.defs.find((d) => d.id === marker.id) || this.defs[0];
    const hue = Number.isFinite(marker.hue) ? marker.hue : def.hue;
    const [r, g, b] = rgbForHue(hue);
    const cx = Math.round((marker.u ?? 0.5) * width);
    const cy = Math.round((marker.v ?? 0.5) * height);
    const w = Math.max(4, Math.round(marker.w ?? 56));
    const h = Math.max(4, Math.round(marker.h ?? 28));
    for (let y = Math.max(0, cy - Math.floor(h / 2)); y < Math.min(height, cy + Math.ceil(h / 2)); y++) {
      for (let x = Math.max(0, cx - Math.floor(w / 2)); x < Math.min(width, cx + Math.ceil(w / 2)); x++) {
        const i = (y * width + x) * 4;
        data[i] = r; data[i + 1] = g; data[i + 2] = b; data[i + 3] = 255;
      }
    }
  }

  info(now = performance.now()) {
    const sample = this.sample(now);
    return {
      running: this.running,
      synthetic: this.synthetic,
      error: this.error,
      calibrated: this.calibrated,
      status: sample.status,
      yawDeg: +(sample.yaw / DEG).toFixed(2),
      pitchDeg: +(sample.pitch / DEG).toFixed(2),
      pairState: this.pairState,
      pairSeparationDeg: this.pairSeparationDeg,
      pairDisagreementDeg: this.pairDisagreementDeg,
      heldMs: this.heldAt ? Math.round(now - this.heldAt) : null,
      procMs: +this.processMs.toFixed(2),
      calibration: this.calibration ? {
        sepDeg: this.calibration.sepDeg,
        center: { x: +this.calibration.center.x.toFixed(3), y: +this.calibration.center.y.toFixed(3) },
      } : null,
      markers: this.markers.map((m) => ({
        id: m.id,
        hue: m.hue,
        found: m.found,
        entity: m.entity,
        shapeOk: m.shapeOk,
        usable: m.usable,
        u: +m.u.toFixed(3),
        v: +m.v.toFixed(3),
        area: m.blob?.area || 0,
        aspect: m.blob?.found ? +(m.blob.bbW / Math.max(1, m.blob.bbH)).toFixed(2) : 0,
        fill: m.blob?.found ? +m.blob.fill.toFixed(2) : 0,
      })),
    };
  }
}
