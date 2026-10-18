/**
 * PerfProbe — пофреймовый профилировщик для 15-секундного теста фризов.
 *
 * Идея: в момент сильного фриза важно понять, чем занят кадр. Каждый кадр
 * пишет разбивку: обновление сцены (с подфазами), рендер (по глазам/бloom),
 * «вне кадра» (GC, React, композитор браузера) и пересечения с длинными
 * JS-задачами и тиками камеры. Отчёт классифицирует каждый фриз и сводит
 * виновников по сумме времени — этот текст и прикладывают к разбору.
 */

export interface FrameRecord {
  frame: number;
  t: number;
  wallMs: number;
  dtMs: number;
  gazeMs: number;
  worldMs: number;
  partMs: number;
  discMs: number;
  uniMs: number;
  actMs: number;
  aniMs: number;
  schMs: number;
  rEye0Ms: number;
  rEye1Ms: number;
  rCompMs: number;
  renderMs: number;
  outsideMs: number;
  calls: number;
  triangles: number;
  programs: number;
  heapMB: number | null;
  gov: number;
  camBusy: boolean;
}

export interface ProbeEvent {
  t: number;
  frame: number;
  kind: string;
  ms?: number;
  detail?: string;
}

export interface FreezeRecord {
  frame: number;
  t: number;
  wallMs: number;
  updateMs: number;
  renderMs: number;
  outsideMs: number;
  longtaskMs: number;
  camBusy: boolean;
  label: string;
}

const fmt = (v: number, d = 1) => (Math.round(v * 10 ** d) / 10 ** d).toFixed(d);

const median = (arr: number[]) => {
  if (!arr.length) return 0;
  const s = [...arr].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)];
};

const percentile = (arr: number[], p: number) => {
  if (!arr.length) return 0;
  const s = [...arr].sort((a, b) => a - b);
  return s[Math.min(s.length - 1, Math.floor((s.length * p) / 100))];
};

class PerfProbe {
  active = false;
  /** Номер кадра мира — ReefWorld пишет сюда каждый кадр. */
  currentFrame = 0;
  /** Камера: тик в полёте (markerDriver ставит/снимает). */
  camBusy = false;

  private startedAt = 0;
  private durationMs = 15000;
  private frames: FrameRecord[] = [];
  private events: ProbeEvent[] = [];
  private ring: ProbeEvent[] = [];
  private longTasks: { t: number; ms: number }[] = [];
  meta: Record<string, unknown> = {};
  /** Последний готовый отчёт — переживает закрытие панели драйвера. */
  lastReport: { text: string; json: Record<string, unknown> } | null = null;
  private observer: PerformanceObserver | null = null;

  constructor() {
    if (typeof window === "undefined") return;
    try {
      this.observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const rec = { t: entry.startTime, ms: entry.duration };
          if (this.active) this.longTasks.push(rec);
          this.pushEvent({ t: rec.t, frame: this.currentFrame, kind: "longtask", ms: rec.ms });
        }
      });
      this.observer.observe({ entryTypes: ["longtask"] } as unknown as PerformanceObserverInit);
    } catch {
      // Браузер без longtask — обойдёмся разбивкой кадра.
    }
    window.addEventListener("visibilitychange", () => {
      this.pushEvent({
        t: performance.now(),
        frame: this.currentFrame,
        kind: "visibility",
        detail: document.visibilityState,
      });
    });
  }

  setMeta(meta: Record<string, unknown>) {
    Object.assign(this.meta, meta);
  }

  event(kind: string, detail?: string, ms?: number) {
    this.pushEvent({ t: performance.now(), frame: this.currentFrame, kind, detail, ms });
  }

  private pushEvent(e: ProbeEvent) {
    this.ring.push(e);
    if (this.ring.length > 200) this.ring.shift();
    if (this.active) this.events.push(e);
  }

  start(durationMs = 15000) {
    this.durationMs = durationMs;
    this.frames = [];
    this.events = [];
    this.longTasks = [];
    this.lastReport = null;
    this.startedAt = performance.now();
    this.active = true;
    this.pushEvent({ t: this.startedAt, frame: this.currentFrame, kind: "probe:start", ms: durationMs });
    return durationMs;
  }

  get running() {
    return this.active;
  }

  get elapsedMs() {
    return this.active ? performance.now() - this.startedAt : 0;
  }

  submit(rec: FrameRecord) {
    if (!this.active) return;
    this.frames.push(rec);
    if (rec.t - this.startedAt > this.durationMs) this.stopNow();
  }

  /** Завершить замер сейчас (или сгенерировать отчёт по накопленному). */
  stopNow() {
    if (!this.active) return this.lastReport;
    this.pushEvent({ t: performance.now(), frame: this.currentFrame, kind: "probe:stop" });
    this.active = false;
    this.lastReport = this.report();
    return this.lastReport;
  }

  /** Классификация одного фриза: что ест время кадра. */
  private classify(f: FrameRecord, longMs: number): string {
    const updateMs = f.gazeMs + f.worldMs + f.partMs + f.discMs;
    if (longMs >= 30) return `длинная JS-задача ${fmt(longMs, 0)}мс (GC или тяжёлый JS вне кадра)`;
    if (f.renderMs >= f.wallMs * 0.5) return `рендер/GPU (кадр ${fmt(f.renderMs, 0)}мс из ${fmt(f.wallMs, 0)}мс)`;
    if (updateMs >= f.wallMs * 0.5) {
      const parts: [string, number][] = [
        ["рыбы-пути", f.actMs],
        ["кит/черепаха/медузы", f.aniMs],
        ["школы/инстансы", f.schMs],
        ["частицы", f.partMs],
        ["взгляд", f.gazeMs],
      ];
      parts.sort((a, b) => b[1] - a[1]);
      return `CPU-сцена: ${parts[0][0]} ${fmt(parts[0][1], 0)}мс из ${fmt(updateMs, 0)}мс`;
    }
    if (f.camBusy) return "камера: захват/чтение кадра (createImageBitmap/readback)";
    return "вне кадра: GC/браузер/композитор/React";
  }

  report(): { text: string; json: Record<string, unknown> } {
    const frames = this.frames;
    const walls = frames.map((f) => f.wallMs).filter((w) => w > 0);
    const p50 = median(walls);
    const p90 = percentile(walls, 90);
    const p99 = percentile(walls, 99);
    const maxW = walls.length ? Math.max(...walls) : 0;
    // Порог фриза: ≥50мс и не более 150мс. Не должен «уезжать» вслед за
    // медианой — иначе на слабом конвейере (headless, software-GL, где все
    // кадры по секунде) фризом не окажется ничего.
    const freezeMs = Math.max(50, Math.min(p50 * 1.5, 150));
    const spanMs = frames.length > 1 ? frames[frames.length - 1].t - frames[0].t : 0;
    const fps = spanMs > 0 ? (frames.length / spanMs) * 1000 : 0;

    // Пересечения фризов с длинными задачами.
    const longByFrame = (f: FrameRecord) => {
      let sum = 0;
      for (const lt of this.longTasks) {
        // Длинная задача перекрывает кадр, если её окно попало в промежуток
        // (t-wallMs, t].
        if (lt.t + lt.ms > f.t - f.wallMs && lt.t < f.t) sum += lt.ms;
      }
      return sum;
    };

    const freezes: FreezeRecord[] = frames
      .filter((f) => f.wallMs >= freezeMs)
      .map((f) => {
        const longMs = longByFrame(f);
        const updateMs = f.gazeMs + f.worldMs + f.partMs + f.discMs;
        return {
          frame: f.frame,
          t: Math.round(f.t),
          wallMs: Math.round(f.wallMs),
          updateMs: Math.round(updateMs),
          renderMs: Math.round(f.renderMs),
          outsideMs: Math.round(f.outsideMs),
          longtaskMs: Math.round(longMs),
          camBusy: f.camBusy,
          label: this.classify(f, longMs),
        };
      })
      .sort((a, b) => b.wallMs - a.wallMs);

    // Сводка виновников по сумме времени фризов.
    const buckets = new Map<string, { ms: number; count: number }>();
    for (const f of freezes) {
      const key = f.label.split(" (")[0].split(":")[0];
      const cur = buckets.get(key) || { ms: 0, count: 0 };
      cur.ms += f.wallMs;
      cur.count += 1;
      buckets.set(key, cur);
    }
    const freezeTotal = freezes.reduce((a, f) => a + f.wallMs, 0);
    const owners = [...buckets.entries()]
      .map(([name, v]) => ({
        name,
        count: v.count,
        freezeMs: Math.round(v.ms),
        sharePct: freezeTotal ? Math.round((v.ms / freezeTotal) * 100) : 0,
      }))
      .sort((a, b) => b.freezeMs - a.freezeMs);

    const sum = (sel: (f: FrameRecord) => number) =>
      frames.length ? frames.reduce((a, f) => a + sel(f), 0) / frames.length : 0;
    const avg = {
      gazeMs: sum((f) => f.gazeMs),
      worldMs: sum((f) => f.worldMs),
      partMs: sum((f) => f.partMs),
      discMs: sum((f) => f.discMs),
      uniMs: sum((f) => f.uniMs),
      actMs: sum((f) => f.actMs),
      aniMs: sum((f) => f.aniMs),
      schMs: sum((f) => f.schMs),
      renderMs: sum((f) => f.renderMs),
      rEye0Ms: sum((f) => f.rEye0Ms),
      rEye1Ms: sum((f) => f.rEye1Ms),
      rCompMs: sum((f) => f.rCompMs),
      outsideMs: sum((f) => f.outsideMs),
    };

    const camTicks = this.events.filter((e) => e.kind === "cam:tick").length;
    const camResults = this.events.filter((e) => e.kind === "cam:result");
    const camProcAvg = camResults.length
      ? camResults.reduce((a, e) => a + (e.ms || 0), 0) / camResults.length
      : 0;
    const freezesWithCam = freezes.filter((f) => f.camBusy).length;
    const longTotal = this.longTasks.reduce((a, l) => a + l.ms, 0);
    const longGc = this.longTasks.length;
    const resizeCount = this.events.filter((e) => e.kind === "resize").length;
    const govEvents = this.events.filter((e) => e.kind === "gov");
    const heap = frames.map((f) => f.heapMB).filter((v): v is number => typeof v === "number");

    const lines: string[] = [];
    lines.push("=== PELAGIC-EYE · тест фризов ===");
    lines.push(`Устройство: ${this.meta.ua || "?"}`);
    lines.push(`GPU: ${this.meta.gpu || "?"}`);
    if (/swiftshader|llvmpipe|software|swangle/i.test(String(this.meta.gpu || ""))) {
      lines.push("Примечание: программный растеризатор — отрисовка GPU попадает во «вне кадра»; на реальном телефоне она уйдёт в рендер.");
    }
    lines.push(
      `Режим: ${this.meta.vrMode || "?"}, quality=${this.meta.quality ?? "?"}, dpr=${this.meta.dpr ?? "?"}, экран ${this.meta.screen ?? "?"}`
    );
    lines.push(
      `Кадры: ${frames.length} за ${fmt(spanMs / 1000, 1)}с (≈${fmt(fps, 1)} FPS), фреймворк-время: p50 ${fmt(p50)}мс · p90 ${fmt(p90)}мс · p99 ${fmt(p99)}мс · max ${fmt(maxW)}мс`
    );
    lines.push(
      `Фризы (>${fmt(freezeMs, 0)}мс): ${freezes.length} шт, суммарно ${fmt(freezeTotal / 1000, 2)}с (${fmt((freezeTotal / Math.max(spanMs, 1)) * 100, 1)}% времени); >100мс: ${freezes.filter((f) => f.wallMs > 100).length}, >250мс: ${freezes.filter((f) => f.wallMs > 250).length}`
    );
    lines.push(
      `Средний кадр: обновление сцены ${fmt(avg.gazeMs + avg.worldMs + avg.partMs + avg.discMs)}мс (пути ${fmt(avg.actMs)}, кит/черепаха ${fmt(avg.aniMs)}, школы ${fmt(avg.schMs)}, частицы ${fmt(avg.partMs)}), рендер ${fmt(avg.renderMs)}мс (глаз0 ${fmt(avg.rEye0Ms)}, глаз1 ${fmt(avg.rEye1Ms)}, composer ${fmt(avg.rCompMs)}), вне кадра ${fmt(avg.outsideMs)}мс`
    );
    lines.push(
      `Длинные JS-задачи: ${longGc} шт, суммарно ${fmt(longTotal, 0)}мс${longGc ? " — главный кандидат на «невидимые» фризы (GC)" : ""}`
    );
    lines.push(
      `Камера: тиков ${camTicks}, ср. анализ ${fmt(camProcAvg, 0)}мс; фризов в момент тика камеры: ${freezesWithCam} из ${freezes.length}`
    );
    lines.push(
      `События: resize ×${resizeCount}, губернатор VR ${govEvents.length ? govEvents.map((e) => e.detail).join(", ") : "—"}, длинных задач ${longGc}`
    );
    if (heap.length) {
      lines.push(`JS-heap: ${fmt(heap[0], 0)} → ${fmt(heap[heap.length - 1], 0)} МБ (макс ${fmt(Math.max(...heap), 0)})`);
    }
    lines.push("");
    if (owners.length) {
      lines.push("Виновники по сумме времени фризов:");
      owners.forEach((o, i) => {
        lines.push(`  ${i + 1}) ${o.name} — ${o.sharePct}% (${o.count} шт, ${o.freezeMs}мс)`);
      });
      lines.push("");
    }
    if (freezes.length) {
      lines.push("Худшие кадры (wall / update / render / вне кадра / longtask / причина):");
      for (const f of freezes.slice(0, 20)) {
        lines.push(
          `  #${f.frame} ${f.wallMs}мс / ${f.updateMs} / ${f.renderMs} / ${f.outsideMs} / ${f.longtaskMs}${f.camBusy ? " / cam" : ""} / ${f.label}`
        );
      }
    } else {
      lines.push("Сильных фризов в окне замера не поймано. Повторите тест, когда фриз ощущается.");
    }
    // Контрольная выборка нормальных кадров — чтобы видеть базовый профиль.
    const normal = frames.filter((f) => f.wallMs < freezeMs);
    if (normal.length) {
      lines.push("");
      lines.push("Нормальные кадры (выборка):");
      const step = Math.max(1, Math.floor(normal.length / 6));
      for (let i = 0; i < normal.length; i += step) {
        const f = normal[i];
        lines.push(
          `  #${f.frame} ${fmt(f.wallMs)}мс / ${fmt(f.gazeMs + f.worldMs + f.partMs + f.discMs)} / ${fmt(f.renderMs)} / ${fmt(f.outsideMs)}`
        );
      }
    }
    const evs = this.events.filter((e) => e.kind !== "longtask").slice(-12);
    if (evs.length) {
      lines.push("");
      lines.push("События замера:");
      for (const e of evs) {
        lines.push(`  [${fmt((e.t - this.startedAt) / 1000, 1)}с] ${e.kind}${e.detail ? " " + e.detail : ""}${e.ms ? ` ${fmt(e.ms, 0)}мс` : ""}`);
      }
    }

    const json = {
      meta: { ...this.meta, startedAt: this.startedAt, durationMs: this.durationMs },
      summary: {
        frames: frames.length,
        spanMs: Math.round(spanMs),
        fps: +fmt(fps, 1),
        p50: +fmt(p50),
        p90: +fmt(p90),
        p99: +fmt(p99),
        max: +fmt(maxW),
        freezeMs: +fmt(freezeMs, 0),
        freezes: freezes.length,
        freezeTotalMs: Math.round(freezeTotal),
        owners,
        avg: Object.fromEntries(Object.entries(avg).map(([k, v]) => [k, +fmt(v, 2)])),
        longTasks: { count: longGc, totalMs: Math.round(longTotal) },
        camera: { ticks: camTicks, procAvgMs: +fmt(camProcAvg, 0), freezesWithCam },
      },
      freezes,
      frames: this.frames,
      events: this.events,
      longTasks: this.longTasks,
    };
    return { text: lines.join("\n"), json };
  }
}

export const perfProbe = new PerfProbe();
