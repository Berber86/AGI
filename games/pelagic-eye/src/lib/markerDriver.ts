/**
 * CameraMarkerProvider — «примитивный» драйвер взгляда для линзовых очков.
 *
 * Физика: метки закреплены в комнате перед игроком (малиновая слева,
 * оранжевая справа). Задняя камера телефона в очках видит их. Когда голова
 * поворачивается, метки уезжают в кадре. Одиночная метка даёт направление,
 * пара — честную калибровку. Если обе пропали, взгляд удерживается и только
 * коротко «доезжает» по последней скорости. Возврата к центру по таймеру нет.
 *
 * Анализ кадра — HSV + связные компоненты в Worker, кадр 160×120. В главном
 * потоке нет getImageData во время рендера. Есть синтетическая подача для QA:
 * она явно подписана и не выдаётся за живую камеру.
 */

import { perfProbe } from "./perfProbe";

export type MarkerMode = "single" | "dual";
export type TrackerFeed = "live" | "synthetic";
export type GazeStatus = "valid" | "single" | "held" | "lost" | "idle";
export type TrackerPhase =
  | "idle"
  | "starting"
  | "search"
  | "single"
  | "dual"
  | "held"
  | "synthetic"
  | "error";

export interface MarkerBox {
  color: "left" | "right";
  u: number;
  v: number;
  w: number;
  h: number;
  area: number;
  fill: number;
  rawYaw: number;
  rawPitch: number;
}

export interface GazeSample {
  yaw: number;
  pitch: number;
  status: GazeStatus;
  marker: "pair" | "left" | "right" | null;
  ts: number;
}

export interface FrameResult {
  left: MarkerBox | null;
  right: MarkerBox | null;
  procMs: number;
  w: number;
  h: number;
  ts: number;
  pairOrderOk: boolean;
  worker: boolean;
}

export interface TrackerInfo {
  phase: TrackerPhase;
  feed: TrackerFeed | null;
  markerMode: MarkerMode;
  running: boolean;
  error: string | null;
  streamActive: boolean;
  streamVersion: number;
  calibrated: boolean;
  calibrationAt: number | null;
  frame: FrameResult | null;
  sample: GazeSample;
  fps: number;
  busy: boolean;
  workerAvailable: boolean;
  facingMode: string | null;
  resolution: string;
  queue: number;
  tier: number;
  intervalMs: number;
  frugal: boolean;
}

interface Anchor {
  u: number;
  v: number;
  rawYaw: number;
  rawPitch: number;
  at: number;
}

interface Calibration {
  left: Anchor | null;
  right: Anchor | null;
  mode: MarkerMode;
}

// Адаптивные ярусы анализа: метке не нужен полноразмерный кадр. Ширина
// уменьшается, если Worker честно не успевает; частота анализа в VR отдельная.
// Последний тир (64×48) — «микро» для бюджетного режима опроса камеры.
const TIERS = [
  { w: 160, h: 120 },
  { w: 128, h: 96 },
  { w: 112, h: 84 },
  { w: 64, h: 48 },
];
// Бюджетный опрос камеры: ~30× реже обычного тика (3000мс против ~100мс).
// Диагностический режим для проверки гипотезы «тормоза от камеры»: трекинг
// от него вянет (опрос раз в ~3с) — это сознательная плата за замер.
const FRUGAL_INTERVAL_MS = 3000;
const FRAME_W = TIERS[0].w;
const FRAME_H = TIERS[0].h;
const MIN_ENTITY_MS = 150;
const LOST_GRACE_MS = 4000;
const COAST_MS = 1200;
const COAST_MAX_DEG = 8;
const COAST_MAX_RATE = 12;
const PAIR_GATE_DEG = 6;
const FOV_DEG = 56;
const YAW_LIMIT = 1.35;
const PITCH_MIN = -0.44;
const PITCH_MAX = 0.92;

const clamp = (v: number, lo: number, hi: number) => (v < lo ? lo : v > hi ? hi : v);
const deg = (rad: number) => (rad * 180) / Math.PI;

const WORKER_SOURCE = `
const SPECS = [
  { id: 'left', hue: 338, tol: 24 },
  { id: 'right', hue: 16, tol: 23 },
];
const clamp = (v, lo, hi) => v < lo ? lo : v > hi ? hi : v;

function analyzeOne(data, w, h, specHue, tol) {
  const mask = new Uint8Array(w * h);
  for (let i = 0, px = 0; px < w * h; px++, i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const mx = Math.max(r, g, b);
    if (mx < 46) continue;
    const mn = Math.min(r, g, b), d = mx - mn;
    if (d < mx * 0.36) continue;
    let hue;
    if (mx === r) hue = ((g - b) / d) % 6;
    else if (mx === g) hue = (b - r) / d + 2;
    else hue = (r - g) / d + 4;
    hue *= 60;
    if (hue < 0) hue += 360;
    let dh = Math.abs(hue - specHue);
    if (dh > 180) dh = 360 - dh;
    if (dh <= tol) mask[px] = 1;
  }
  const seen = new Uint8Array(w * h);
  const stack = new Int32Array(w * h);
  let sp = 0;
  let best = null;
  for (let start = 0; start < w * h; start++) {
    if (!mask[start] || seen[start]) continue;
    let count = 0, sx = 0, sy = 0;
    let minX = w, maxX = -1, minY = h, maxY = -1;
    sp = 0; stack[sp++] = start; seen[start] = 1;
    while (sp > 0) {
      const cur = stack[--sp];
      const x = cur % w, y = (cur / w) | 0;
      count++; sx += x; sy += y;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
      if (x > 0 && mask[cur - 1] && !seen[cur - 1]) { seen[cur - 1] = 1; stack[sp++] = cur - 1; }
      if (x < w - 1 && mask[cur + 1] && !seen[cur + 1]) { seen[cur + 1] = 1; stack[sp++] = cur + 1; }
      if (y > 0 && mask[cur - w] && !seen[cur - w]) { seen[cur - w] = 1; stack[sp++] = cur - w; }
      if (y < h - 1 && mask[cur + w] && !seen[cur + w]) { seen[cur + w] = 1; stack[sp++] = cur + w; }
    }
    if (!best || count > best.count) best = { count, sx, sy, minX, maxX, minY, maxY };
  }
  if (!best || best.count < 32) return { found: false };
  const bw = best.maxX - best.minX + 1;
  const bh = best.maxY - best.minY + 1;
  const fill = best.count / (bw * bh);
  const ratio = bw / Math.max(1, bh);
  const touchesEdge = best.minX <= 1 || best.maxX >= w - 2 || best.minY <= 1 || best.maxY >= h - 2;
  if (best.count > w * h * 0.62) return { found: false };
  if (fill < 0.42) return { found: false };
  if (!touchesEdge && ratio < 1.1) return { found: false };
  const u = best.sx / best.count;
  const v = best.sy / best.count;
  const fx = (w / 2) / Math.tan((${FOV_DEG} * Math.PI / 180) / 2);
  return {
    found: true,
    u: u / w,
    v: v / h,
    w: bw / w,
    h: bh / h,
    area: best.count,
    fill: Math.round(fill * 1000) / 1000,
    rawYaw: Math.atan((u - w / 2) / fx) * 180 / Math.PI,
    rawPitch: Math.atan((v - h / 2) / fx) * 180 / Math.PI,
  };
}

self.onmessage = (event) => {
  const msg = event.data;
  if (!msg || msg.type !== 'frame') return;
  const started = performance.now();
  try {
    let data;
    if (msg.bitmap) {
      if (!self.surface) {
        self.surface = new OffscreenCanvas(msg.w, msg.h);
        self.ctx = self.surface.getContext('2d', { willReadFrequently: true });
      }
      if (self.surface.width !== msg.w || self.surface.height !== msg.h) {
        self.surface.width = msg.w; self.surface.height = msg.h;
      }
      self.ctx.drawImage(msg.bitmap, 0, 0, msg.w, msg.h);
      data = self.ctx.getImageData(0, 0, msg.w, msg.h).data;
      if (msg.bitmap.close) msg.bitmap.close();
    } else {
      data = msg.imageData;
    }
    const results = SPECS.map((spec) => analyzeOne(data, msg.w, msg.h, spec.hue, spec.tol));
    const left = results[0].found ? Object.assign({ color: 'left' }, results[0]) : null;
    const right = results[1].found ? Object.assign({ color: 'right' }, results[1]) : null;
    self.postMessage({
      type: 'result',
      left, right,
      ts: msg.t,
      procMs: Math.round((performance.now() - started) * 10) / 10,
      w: msg.w, h: msg.h,
      pairOrderOk: !!(left && right && left.u < right.u),
      worker: true,
    });
  } catch (error) {
    self.postMessage({ type: 'error', message: String(error), ts: msg.t });
  }
};
`;

export class CameraMarkerProvider {
  private worker: Worker | null = null;
  private workerUrl: string | null = null;
  private workerAvailable = false;
  private busy = false;
  private busyTimer = 0;
  private timer = 0;
  private processingInterval = 100;
  // Бюджетный опрос: перекрывает processingInterval и поднимает его до
  // FRUGAL_INTERVAL_MS (~30× реже), анализ всегда на микро-тире.
  private frugal = false;
  private minTier = 0;
  private lastPumpAt = 0;
  private tier = 0;
  private procHistory: number[] = [];
  private video: HTMLVideoElement | null = null;
  private stream: MediaStream | null = null;
  private syntheticCanvas: HTMLCanvasElement | null = null;
  private syntheticShift = 0;
  private syntheticPulse = 0;
  private running = false;
  private starting = false;
  private feed: TrackerFeed | null = null;
  private error: string | null = null;
  private facingMode: string | null = null;
  private markerMode: MarkerMode = "dual";
  private calibration: Calibration = { left: null, right: null, mode: "dual" };
  private calibrationAt: number | null = null;
  private frame: FrameResult | null = null;
  private streamVersion = 0;
  private lastGaze: GazeSample = { yaw: 0, pitch: 0, status: "idle", marker: null, ts: 0 };
  private visible = { left: false, right: false };
  private firstSeen = { left: 0, right: 0 };
  private lastSeen = { left: 0, right: 0 };
  private lastVelocity = { yaw: 0, pitch: 0, at: 0 };
  private lastProcessed = 0;
  private processedTimes: number[] = [];
  private pairOrderOk = true;
  private lastConfirmed: FrameResult | null = null;
  private coastApplied = { yaw: 0, pitch: 0 };
  private lastRawGaze = { yaw: 0, pitch: 0, at: 0 };
  private readResolution = "—";

  constructor() {
    this.createWorker();
  }

  private createWorker() {
    if (this.worker) return;
    try {
      this.workerUrl = URL.createObjectURL(new Blob([WORKER_SOURCE], { type: "application/javascript" }));
      this.worker = new Worker(this.workerUrl);
      this.workerAvailable = true;
      this.worker.onmessage = (event) => this.onWorkerMessage(event.data);
      this.worker.onerror = () => {
        this.workerAvailable = false;
        this.busy = false;
        this.error = "Worker анализа не запустился. Камера остановлена честно, без подмены данных.";
      };
    } catch {
      this.workerAvailable = false;
      this.error = "Worker недоступен в этом браузере.";
    }
  }

  getInfo(): TrackerInfo {
    const now = performance.now();
    return {
      phase: this.phase(now),
      feed: this.feed,
      markerMode: this.markerMode,
      running: this.running,
      error: this.error,
      streamActive: !!this.stream,
      streamVersion: this.streamVersion,
      calibrated: !!(this.calibration.left || this.calibration.right),
      calibrationAt: this.calibrationAt,
      frame: this.frame,
      sample: this.getGaze(now),
      fps: this.fps(now),
      busy: this.busy,
      workerAvailable: this.workerAvailable,
      facingMode: this.facingMode,
      resolution: this.readResolution,
      queue: this.busy ? 1 : 0,
      tier: this.effectiveTier(),
      intervalMs: this.effectiveIntervalMs(),
      frugal: this.frugal,
    };
  }

  getGaze(now = performance.now()): GazeSample {
    if (!this.running && !this.stream) {
      return { yaw: 0, pitch: 0, status: "idle", marker: null, ts: now };
    }
    if (this.visible.left || this.visible.right) {
      this.coastApplied = { yaw: 0, pitch: 0 };
      const gaze = this.computeGaze(now);
      this.lastGaze = gaze;
      if (this.lastRawGaze.at > 0) {
        const dt = Math.max(0.016, (now - this.lastRawGaze.at) / 1000);
        const vYaw = (deg(gaze.yaw) - deg(this.lastRawGaze.yaw)) / dt;
        const vPitch = (deg(gaze.pitch) - deg(this.lastRawGaze.pitch)) / dt;
        // Сглаживаем скорость: один шумный кадр не должен «толкать» обзор.
        this.lastVelocity.yaw = this.lastVelocity.yaw * 0.55 + vYaw * 0.45;
        this.lastVelocity.pitch = this.lastVelocity.pitch * 0.55 + vPitch * 0.45;
        this.lastVelocity.at = now;
      }
      this.lastRawGaze = { yaw: gaze.yaw, pitch: gaze.pitch, at: now };
      return gaze;
    }

    // Ни одна метка не подтверждена. Держим последний угол и коротко
    // «доезжаем» по последней измеренной скорости. Центр не включается.
    const hadMarker = Math.max(this.lastSeen.left, this.lastSeen.right);
    if (!hadMarker) {
      return { yaw: 0, pitch: 0, status: "lost", marker: null, ts: now };
    }
    const since = now - hadMarker;
    if (since < COAST_MS && this.lastVelocity.at > 0) {
      // Скорость головы измерена в градусах/с; потолок — 12°/с, затухание 0.55 c.
      const dt = 1 / 60;
      const decay = Math.exp(-since / 550);
      const rateYaw = clamp(this.lastVelocity.yaw, -COAST_MAX_RATE, COAST_MAX_RATE);
      const ratePitch = clamp(this.lastVelocity.pitch, -COAST_MAX_RATE, COAST_MAX_RATE);
      this.coastApplied.yaw = clamp(this.coastApplied.yaw + rateYaw * dt * decay, -COAST_MAX_DEG, COAST_MAX_DEG);
      this.coastApplied.pitch = clamp(this.coastApplied.pitch + ratePitch * dt * decay, -COAST_MAX_DEG, COAST_MAX_DEG);
    }
    return {
      yaw: clamp(this.lastGaze.yaw + (this.coastApplied.yaw * Math.PI) / 180, -YAW_LIMIT, YAW_LIMIT),
      pitch: clamp(this.lastGaze.pitch + (this.coastApplied.pitch * Math.PI) / 180, PITCH_MIN, PITCH_MAX),
      status: "held",
      marker: null,
      ts: now,
    };
  }

  private computeGaze(now: number): GazeSample {
    if (!this.calibration.left && !this.calibration.right) {
      this.autoCalibrate(now);
    }
    const deltas: { side: "left" | "right"; yaw: number; pitch: number }[] = [];
    if (this.visible.left && this.calibration.left && this.lastConfirmed?.left) {
      deltas.push(this.deltaFor("left", this.lastConfirmed.left));
    }
    if (this.markerMode === "dual" && this.visible.right && this.calibration.right && this.lastConfirmed?.right) {
      deltas.push(this.deltaFor("right", this.lastConfirmed.right));
    }
    if (!deltas.length) {
      return { yaw: 0, pitch: 0, status: "lost", marker: null, ts: now };
    }
    if (deltas.length === 2) {
      const agree = Math.abs(deltas[0].yaw - deltas[1].yaw) <= (PAIR_GATE_DEG * Math.PI) / 180;
      if (agree) {
        return {
          yaw: (deltas[0].yaw + deltas[1].yaw) / 2,
          pitch: (deltas[0].pitch + deltas[1].pitch) / 2,
          status: "valid",
          marker: "pair",
          ts: now,
        };
      }
      // Противоречие пары: доверяем стороне с большим сигналом, не среднему.
      const lead = Math.abs(deltas[0].yaw) > Math.abs(deltas[1].yaw) ? deltas[0] : deltas[1];
      return { yaw: lead.yaw, pitch: lead.pitch, status: "single", marker: lead.side, ts: now };
    }
    return {
      yaw: deltas[0].yaw,
      pitch: deltas[0].pitch,
      status: "single",
      marker: deltas[0].side,
      ts: now,
    };
  }

  private deltaFor(side: "left" | "right", box: MarkerBox) {
    const anchor = this.calibration[side]!;
    const yawDelta = (box.rawYaw - anchor.rawYaw) * (Math.PI / 180);
    const pitchDelta = (box.rawPitch - anchor.rawPitch) * (Math.PI / 180);
    return {
      side,
      yaw: clamp(-yawDelta, -YAW_LIMIT, YAW_LIMIT),
      pitch: clamp(pitchDelta, PITCH_MIN, PITCH_MAX),
    };
  }

  private phase(now: number): TrackerPhase {
    if (this.starting) return "starting";
    if (this.error) return "error";
    if (!this.running) return "idle";
    if (this.feed === "synthetic") return "synthetic";
    if (this.visible.left && this.visible.right) return this.pairOrderOk ? "dual" : "single";
    if (this.visible.left || this.visible.right) return "single";
    if (Math.max(this.lastSeen.left, this.lastSeen.right) && now - Math.max(this.lastSeen.left, this.lastSeen.right) < LOST_GRACE_MS * 5) {
      return "held";
    }
    return "search";
  }

  private fps(now: number) {
    // Окно счёта Гц должно вместить пару тиков даже при медленном Worker
    // (headless) и при бюджетном режиме (тик раз в 3с).
    const windowMs = Math.max(4000, this.effectiveIntervalMs() * 1.5 + 400);
    this.processedTimes = this.processedTimes.filter((t) => now - t < windowMs);
    return Math.round((this.processedTimes.length / (windowMs / 1000)) * 10) / 10;
  }

  setMarkerMode(mode: MarkerMode) {
    this.markerMode = mode;
    this.calibration = { left: null, right: null, mode };
    this.calibrationAt = null;
    this.visible = { left: false, right: false };
    this.firstSeen = { left: 0, right: 0 };
    this.lastSeen = { left: 0, right: 0 };
  }

  setProcessingInterval(ms: number) {
    this.processingInterval = clamp(ms, 70, 260);
  }

  /**
   * В стерео тот же телефон греет два прохода, поэтому стартуем с более
   * лёгкого кадра (128×96) и не даём адаптиву спуститься ниже этого тира.
   * Порог сущности и геометрия пары не меняются — это только разрешение.
   */
  setVrMode(vr: boolean) {
    this.minTier = vr ? 1 : 0;
    this.tier = Math.max(this.tier, this.minTier);
    if (vr) this.procHistory = [];
    this.setProcessingInterval(vr ? 135 : 100);
  }

  /**
   * Бюджетный режим опроса камеры (~30×): опрос раз в ~3с вместо ~10Гц и
   * анализ на микро-тире 64×48. Это диагностический переключатель для
   * проверки гипотезы «тормоза от камеры» — трекинг от него вянет, и это
   * ожидаемо. Поведение по умолчанию не меняется.
   */
  setFrugal(on: boolean) {
    if (this.frugal === on) return;
    this.frugal = on;
    // Живой стрим подстраиваем на лету (лучшее усилие): «сила» обращения к
    // камере — это ещё и разрешение/fps самой камеры, не только анализ.
    const track = this.stream?.getVideoTracks()[0];
    if (track?.applyConstraints) {
      track.applyConstraints(this.cameraConstraints()).catch(() => undefined);
    }
    if (on) this.procHistory = [];
  }

  /** Разрешение и fps камеры: в бюджете — 320×240@10, обычно — 960×720@24-30. */
  private cameraConstraints(): MediaTrackConstraints {
    return {
      facingMode: { ideal: "environment" },
      ...(this.frugal
        ? { width: { ideal: 320 }, height: { ideal: 240 }, frameRate: { ideal: 10, max: 15 } }
        : { width: { ideal: 960 }, height: { ideal: 720 }, frameRate: { ideal: 24, max: 30 } }),
    };
  }

  private effectiveIntervalMs() {
    return this.frugal ? FRUGAL_INTERVAL_MS : this.processingInterval;
  }

  private effectiveTier() {
    return this.frugal ? TIERS.length - 1 : this.tier;
  }

  /**
   * Главный контур: камеру считаем ПОСЛЕ рендера кадра, а не в произвольный
   * момент setInterval. createImageBitmap(video) — это GPU-чтение; если оно
   * попадает перед важным кадром стереопары, появляется ровно тот рывок,
   * который описан в skill. Один кадр в полёте, очередь не растёт.
   */
  pumpAfterRender() {
    const now = performance.now();
    this.lastPumpAt = now;
    if (!this.running || this.busy || !this.worker) return;
    if (now - this.lastProcessed < this.effectiveIntervalMs()) return;
    void this.tick();
  }

  setSyntheticPointer(nx: number, ny: number) {
    this.syntheticShift = clamp(nx, 0, 1) - 0.5;
    this.syntheticPulse = clamp(ny, 0, 1) - 0.5;
  }

  async startCamera() {
    if (this.starting) return false;
    this.error = null;
    this.starting = true;
    this.running = true;
    this.feed = "live";
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("getUserMedia недоступен. Нужен HTTPS/localhost и разрешение камеры.");
      }
      this.stopTracks();
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: this.cameraConstraints(),
      });
      this.stream = stream;
      this.streamVersion += 1;
      if (!this.video) {
        this.video = document.createElement("video");
        this.video.className = "tracker-video";
        this.video.autoplay = true;
        this.video.muted = true;
        this.video.playsInline = true;
        document.body.appendChild(this.video);
      }
      this.video.srcObject = stream;
      await this.video.play().catch(() => undefined);
      const track = stream.getVideoTracks()[0];
      const settings = track?.getSettings?.() || {};
      this.facingMode = settings.facingMode || null;
      this.readResolution = `${settings.width || "?"}×${settings.height || "?"}`;
      this.startLoop();
      this.starting = false;
      return true;
    } catch (error) {
      this.error = this.describeCameraError(error);
      this.running = false;
      this.feed = null;
      this.starting = false;
      return false;
    }
  }

  private describeCameraError(error: unknown) {
    const name = (error as { name?: string })?.name || "";
    if (name === "NotAllowedError") return "Доступ к камере отклонён. Разрешите камеру в настройках браузера.";
    if (name === "NotFoundError") return "Камера не найдена. Подойдёт любой телефон с задней камерой.";
    if (name === "NotReadableError") return "Камера занята другим приложением.";
    if (name === "SecurityError") return "Браузер требует HTTPS для доступа к камере.";
    return (error as Error)?.message || "Не удалось включить камеру.";
  }

  startSynthetic() {
    this.stopTracks();
    this.feed = "synthetic";
    this.running = true;
    this.starting = false;
    this.error = null;
    this.streamKill();
    if (!this.syntheticCanvas) {
      this.syntheticCanvas = document.createElement("canvas");
      this.syntheticCanvas.width = FRAME_W;
      this.syntheticCanvas.height = FRAME_H;
    }
    this.startLoop();
  }

  async start(): Promise<boolean> {
    return this.startCamera();
  }

  stop() {
    this.running = false;
    this.feed = null;
    this.starting = false;
    this.stopTracks();
    this.stopLoop();
    this.visible = { left: false, right: false };
    this.lastSeen = { left: 0, right: 0 };
    this.frame = null;
    this.busy = false;
  }

  private streamKill() {
    this.stream = null;
    this.streamVersion += 1;
  }

  private stopTracks() {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
      this.streamVersion += 1;
    }
    if (this.video) this.video.srcObject = null;
  }

  calibrate(): { ok: boolean; message: string } {
    const now = performance.now();
    const boxes = this.lastConfirmed;
    if (!this.running || !boxes) {
      return { ok: false, message: "Калибровка недоступна: метка не подтверждена в кадре." };
    }
    if (this.markerMode === "dual" && (!this.visible.left || !this.visible.right)) {
      return { ok: false, message: "Для пары нужны обе метки. Сейчас видна только одна." };
    }
    if (this.markerMode === "dual" && !this.pairOrderOk) {
      return { ok: false, message: "Метки перепутаны местами: малиновая должна быть левее оранжевой." };
    }
    const anchor = (box: MarkerBox | null): Anchor | null =>
      box
        ? { u: box.u, v: box.v, rawYaw: box.rawYaw, rawPitch: box.rawPitch, at: now }
        : null;
    this.calibration = {
      left: anchor(boxes.left),
      right: this.markerMode === "dual" ? anchor(boxes.right) : null,
      mode: this.markerMode,
    };
    this.calibrationAt = now;
    this.coastApplied = { yaw: 0, pitch: 0 };
    const paired = this.markerMode === "dual" && this.visibleBoth();
    this.lastGaze = { yaw: 0, pitch: 0, status: paired ? "valid" : "single", marker: paired ? "pair" : null, ts: now };
    return {
      ok: true,
      message: paired
        ? "Пара откалибрована: прямо — это текущее положение обеих меток."
        : "Метка откалибрована. Прямо — текущее положение одной метки.",
    };
  }

  private visibleBoth() {
    return this.visible.left && this.visible.right && this.pairOrderOk;
  }

  autoCalibrate(now: number) {
    const boxes = this.lastConfirmed;
    if (!boxes) return;
    const anchor = (box: MarkerBox | null): Anchor | null =>
      box ? { u: box.u, v: box.v, rawYaw: box.rawYaw, rawPitch: box.rawPitch, at: now } : null;
    this.calibration = {
      left: anchor(boxes.left),
      right: this.markerMode === "dual" ? anchor(boxes.right) : null,
      mode: this.markerMode,
    };
    this.calibrationAt = now;
  }

  getStream(): MediaStream | null {
    return this.stream;
  }

  private startLoop() {
    this.stopLoop();
    // Резервный путь, когда сцену не рендерят (например, открыт только
    // драйвер). Если мир сам зовёт pumpAfterRender, таймер молчит.
    this.timer = window.setInterval(() => {
      if (performance.now() - this.lastPumpAt < 600) return;
      if (this.busy) return;
      void this.tick();
    }, 180);
    void this.tick();
  }

  private stopLoop() {
    if (this.timer) window.clearInterval(this.timer);
    this.timer = 0;
  }

  private async tick() {
    if (!this.running || this.busy || !this.worker) return;
    const now = performance.now();
    // Шаг анализа живёт здесь, а не только в pumpAfterRender: резервный таймер
    // startLoop и QA-контур обязаны уважать тот же каденс (в бюджетном режиме —
    // FRUGAL_INTERVAL_MS).
    if (now - this.lastProcessed < this.effectiveIntervalMs()) return;
    this.busy = true;
    perfProbe.camBusy = true;
    perfProbe.event("cam:tick");
    const camT0 = performance.now();
    const dims = TIERS[this.effectiveTier()];
    if (this.busyTimer) window.clearTimeout(this.busyTimer);
    this.busyTimer = window.setTimeout(() => {
      this.busy = false;
    }, 1700);
    try {
      if (this.feed === "synthetic" && this.syntheticCanvas) {
        if (this.syntheticCanvas.width !== dims.w || this.syntheticCanvas.height !== dims.h) {
          this.syntheticCanvas.width = dims.w;
          this.syntheticCanvas.height = dims.h;
        }
        this.drawSynthetic(now);
        const bitmap = await createImageBitmap(this.syntheticCanvas);
        perfProbe.event("cam:bitmap", "synthetic", performance.now() - camT0);
        this.lastProcessed = now;
        this.worker.postMessage({ type: "frame", bitmap, w: dims.w, h: dims.h, t: now }, [bitmap]);
        return;
      }
      const video = this.video;
      if (!video || video.readyState < 2) {
        this.busy = false;
        return;
      }
      let bitmap: ImageBitmap;
      try {
        bitmap = await createImageBitmap(video, {
          resizeWidth: dims.w,
          resizeHeight: dims.h,
          resizeQuality: "low",
        });
      } catch {
        bitmap = await createImageBitmap(video);
      }
      perfProbe.event("cam:bitmap", "video", performance.now() - camT0);
      this.lastProcessed = now;
      this.worker.postMessage({ type: "frame", bitmap, w: dims.w, h: dims.h, t: now }, [bitmap]);
    } catch (error) {
      this.busy = false;
      perfProbe.camBusy = false;
      perfProbe.event("cam:error", (error as Error)?.message || String(error));
      this.error = `Сбой захвата кадра: ${(error as Error)?.message || error}`;
      this.running = false;
    }
  }

  private drawSynthetic(now: number) {
    const canvas = this.syntheticCanvas!;
    const ctx = canvas.getContext("2d")!;
    const w = canvas.width;
    const h = canvas.height;
    ctx.fillStyle = "#1a2626";
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 26; i++) {
      const g = 20 + ((i * 37) % 40);
      ctx.fillStyle = `rgb(${g},${g + 18},${g + 16})`;
      ctx.fillRect((i * 53) % w, (i * 29) % h, 9, 9);
    }
    const wobble = Math.sin(now / 1400) * 0.008;
    const x1 = (0.31 + this.syntheticShift + wobble) * w;
    const x2 = (0.69 + this.syntheticShift + wobble) * w;
    const y = (0.5 + this.syntheticPulse * 0.6) * h;
    const bw = Math.round(w * 0.29);
    const bh = Math.round(h * 0.22);
    ctx.fillStyle = "#d6336c";
    ctx.fillRect(x1 - bw / 2, y - bh / 2, bw, bh);
    ctx.fillStyle = "#f15a24";
    ctx.fillRect(x2 - bw / 2, y - bh / 2, bw, bh);
    ctx.fillStyle = "rgba(255,255,255,.22)";
    ctx.fillRect(x1 - bw / 2, y - bh / 2, bw, 2);
    ctx.fillRect(x2 - bw / 2, y - bh / 2, bw, 2);
  }

  private onWorkerMessage(msg: { type: string; message?: string } & Partial<FrameResult>) {
    this.busy = false;
    perfProbe.camBusy = false;
    if (this.busyTimer) window.clearTimeout(this.busyTimer);
    if (msg.type === "error") {
      this.error = `Worker: ${msg.message || "ошибка анализа"}`;
      perfProbe.event("cam:error", msg.message);
      return;
    }
    if (msg.type !== "result") return;
    perfProbe.event("cam:result", undefined, msg.procMs);
    const now = performance.now();
    const wasSeen = this.visible;
    const wasLastSeen = this.lastSeen;
    this.processedTimes.push(now);
    this.procHistory.push(msg.procMs ?? 0);
    if (this.procHistory.length > 14) this.procHistory.shift();
    if (this.procHistory.length === 14) {
      const avg = this.procHistory.reduce((a, b) => a + b, 0) / this.procHistory.length;
      if (avg > 21 && this.tier < TIERS.length - 1) {
        this.tier += 1;
        this.procHistory = [];
      } else if (avg < 8 && this.tier > this.minTier) {
        this.tier -= 1;
        this.procHistory = [];
      }
    }
    this.frame = {
      left: (msg.left as MarkerBox | null) ?? null,
      right: (msg.right as MarkerBox | null) ?? null,
      procMs: msg.procMs ?? 0,
      w: msg.w ?? FRAME_W,
      h: msg.h ?? FRAME_H,
      ts: msg.ts ?? now,
      pairOrderOk: !!msg.pairOrderOk,
      worker: true,
    };
    this.pairOrderOk = this.frame.pairOrderOk;

    const settle = (side: "left" | "right") => {
      const blob = side === "left" ? this.frame!.left : this.frame!.right;
      if (!blob) {
        this.visible[side] = false;
        this.firstSeen[side] = 0;
        return;
      }
      if (!this.firstSeen[side]) this.firstSeen[side] = now;
      const confirmed = now - this.firstSeen[side] >= MIN_ENTITY_MS;
      if (confirmed) {
        this.visible[side] = true;
        this.lastSeen[side] = now;
      }
    };
    settle("left");
    settle("right");
    if (this.visible.left || this.visible.right) {
      this.lastConfirmed = this.frame;
      if (!this.calibration.left && !this.calibration.right) this.autoCalibrate(now);
    }
    if (wasSeen.left !== this.visible.left || wasSeen.right !== this.visible.right) {
      // Появление метки: если пропадала дольше LOST_GRACE_MS, нужен новый
      // согласный кадр перед тем, как снова вести взгляд.
      (["left", "right"] as const).forEach((side) => {
        if (this.visible[side] && !wasSeen[side] && wasLastSeen[side] && now - wasLastSeen[side] > LOST_GRACE_MS) {
          this.firstSeen[side] = now;
          this.visible[side] = false;
        }
      });
    }
    if (!this.frame.left && !this.frame.right) this.lastConfirmed = null;
    if (this.visible.left || this.visible.right) {
      const sample = this.getGaze(now);
      this.lastGaze = sample;
      this.lastRawGaze = { yaw: sample.yaw, pitch: sample.pitch, at: now };
    }
  }

  downloadMarkers() {
    const canvas = document.createElement("canvas");
    canvas.width = 1240;
    canvas.height = 800;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#f5efe1";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#082b2f";
    ctx.font = "600 34px Georgia, serif";
    ctx.fillText("PELAGIC EYE · тест-метки взгляда", 56, 76);
    ctx.font = "500 18px Arial, sans-serif";
    ctx.fillStyle = "#315a5c";
    ctx.fillText("Закрепите карточки перед собой на одной высоте. Малиновая — слева, оранжевая — справа.", 56, 112);
    const card = (x: number, color: string, title: string, sub: string) => {
      ctx.fillStyle = "rgba(8,43,47,.08)";
      ctx.fillRect(x, 158, 540, 520);
      ctx.strokeStyle = "rgba(8,43,47,.2)";
      ctx.setLineDash([6, 6]);
      ctx.strokeRect(x + 26, 190, 488, 300);
      ctx.setLineDash([]);
      ctx.fillStyle = color;
      ctx.fillRect(x + 45, 205, 450, 270);
      ctx.fillStyle = "rgba(255,255,255,.32)";
      ctx.fillRect(x + 45, 205, 450, 14);
      ctx.fillStyle = "#082b2f";
      ctx.font = "700 22px Arial, sans-serif";
      ctx.fillText(title, x + 32, 552);
      ctx.font = "400 17px Arial, sans-serif";
      ctx.fillStyle = "#41696a";
      ctx.fillText(sub, x + 32, 582);
      ctx.fillText(sub, x + 32, 582);
      ctx.fillStyle = "#315a5c";
      ctx.font = "13px Arial, sans-serif";
      ctx.fillText("Держите горизонтально · не сгибайте · избегайте бликов", x + 32, 634);
    };
    card(56, "#d6336c", "МАЛИНОВАЯ · ЛЕВАЯ", "Hue 338° · цвет виден даже в сумерках");
    card(644, "#f15a24", "ОРАНЖЕВАЯ · ПРАВАЯ", "Hue 16° · вторая половина пары");
    ctx.fillStyle = "#557d7e";
    ctx.font = "13px Arial, sans-serif";
    ctx.fillText("Совет: если камера теряет пару — уменьшите дистанцию, включите ровный свет и не наклоняйте карточки.", 56, 742);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "pelagic-eye-fiducials.png";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 3000);
    }, "image/png");
  }

  dispose() {
    this.stop();
    this.worker?.terminate();
    this.worker = null;
    if (this.workerUrl) URL.revokeObjectURL(this.workerUrl);
    this.workerUrl = null;
    if (this.video) {
      this.video.remove();
      this.video = null;
    }
    this.syntheticCanvas = null;
  }
}
