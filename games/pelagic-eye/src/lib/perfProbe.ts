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
  /** Синхронное ожидание GPU (gl.finish) в конце кадра — только при замере. */
  gpuMs: number;
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

export type FreezeCategory = "gpu" | "longtask" | "render" | "cpu" | "camera" | "outside";

export interface FreezeRecord {
  frame: number;
  t: number;
  wallMs: number;
  updateMs: number;
  renderMs: number;
  gpuMs: number;
  outsideMs: number;
  longtaskMs: number;
  camBusy: boolean;
  category: FreezeCategory;
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
  private gcPauses: { t: number; ms: number; kind: string }[] = [];
  private loafs: { t: number; ms: number; styleMs: number; paintMs: number; scripts: string[] }[] = [];
  meta: Record<string, unknown> = {};
  /** Последний готовый отчёт — переживает закрытие панели драйвера. */
  lastReport: { text: string; json: Record<string, unknown> } | null = null;
  /** Замер заармлен и стартует при входе в VR (см. App). */
  armedForVr = false;
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
    window.addEventListener("fullscreenchange", () => {
      this.pushEvent({
        t: performance.now(),
        frame: this.currentFrame,
        kind: "fullscreen",
        detail: document.fullscreenElement ? "on" : "off",
      });
    });
    // GC-паузы с именем (Chrome): отличает сборку мусора от прочих «вне кадра».
    try {
      const gcObs = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const rec = {
            t: entry.startTime,
            ms: entry.duration,
            kind: String((entry as unknown as { detail?: { kind?: string } }).detail?.kind ?? "gc"),
          };
          if (this.active) this.gcPauses.push(rec);
          this.pushEvent({ t: rec.t, frame: this.currentFrame, kind: "gc", ms: rec.ms, detail: rec.kind });
        }
      });
      gcObs.observe({ entryTypes: ["gc"] } as unknown as PerformanceObserverInit);
    } catch {
      /* нет gc-observer */
    }
    // Длинные кадры анимации (Chrome 123+): кто внутри — стили/раскладка/
    // пейнт или конкретные скрипты. Это имена для «длинных JS-задач».
    try {
      const loafObs = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const e = entry as unknown as {
            startTime: number;
            duration: number;
            styleAndLayoutDuration?: number;
            paintDuration?: number;
            scripts?: { sourceURL?: string; invokerType?: string; duration?: number }[];
          };
          const scripts = (e.scripts ?? [])
            .slice(0, 3)
            .map((s) => `${s.invokerType || "?"}:${(s.sourceURL || "?").split("/").pop() || "?"} ${Math.round(s.duration || 0)}мс`);
          const rec = {
            t: e.startTime,
            ms: e.duration,
            styleMs: e.styleAndLayoutDuration ?? 0,
            paintMs: e.paintDuration ?? 0,
            scripts,
          };
          if (this.active) this.loafs.push(rec);
          this.pushEvent({
            t: rec.t,
            frame: this.currentFrame,
            kind: "loaf",
            ms: rec.ms,
            detail: scripts[0] || `стили ${Math.round(rec.styleMs)}мс`,
          });
        }
      });
      loafObs.observe({ entryTypes: ["long-animation-frame"] } as unknown as PerformanceObserverInit);
    } catch {
      /* нет loaf-observer */
    }
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
    this.gcPauses = [];
    this.loafs = [];
    this.lastReport = null;
    this.armedForVr = false;
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
    // Первый кадр: его wallMs — разрыв с кадром ДО старта замера и может
    // «утечь» в статистику (было: сумма фризов 194% времени). Прижимаем к
    // границе замера; сырой разрыв фиксируем событием stall.
    if (!this.frames.length && rec.wallMs > rec.t - this.startedAt + 100) {
      const raw = rec.wallMs;
      rec = { ...rec, wallMs: Math.max(0, rec.t - this.startedAt) };
      this.pushEvent({ t: rec.t, frame: rec.frame, kind: "stall", ms: Math.round(raw), detail: "до старта замера" });
    }
    if (rec.wallMs > 1000) {
      this.pushEvent({ t: rec.t, frame: rec.frame, kind: "stall", ms: Math.round(rec.wallMs), detail: `кадр #${rec.frame}` });
    }
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

  /** Классификация одного фриза: что ест время кадра (по наибольшей доле). */
  private classify(f: FrameRecord, longMs: number): { category: FreezeCategory; label: string } {
    const updateMs = f.gazeMs + f.worldMs + f.partMs + f.discMs;
    // Компоненты кадра; gpuMs входит в renderMs (gl.finish — часть render()).
    const comps: { cat: FreezeCategory; ms: number; text: string }[] = [
      {
        cat: "gpu",
        ms: f.gpuMs,
        text: `GPU-растеризация ${fmt(f.gpuMs, 0)}мс (fill-rate/шейдеры)`,
      },
      {
        cat: "longtask",
        ms: longMs,
        text: `длинные JS-задачи/стили ${fmt(longMs, 0)}мс (см. строки LoAF/GC ниже)`,
      },
      {
        cat: "render",
        ms: f.renderMs - f.gpuMs,
        text: `рендер/CPU-сабмит драйверу ${fmt(f.renderMs, 0)}мс`,
      },
      {
        cat: "cpu",
        ms: updateMs,
        text: `CPU-сцена ${fmt(updateMs, 0)}мс`,
      },
      {
        cat: "outside",
        ms: f.outsideMs,
        text: `вне меток ${fmt(f.outsideMs, 0)}мс (композитор/презентация/GC-в-простое)`,
      },
    ];
    const best = comps.reduce((a, b) => (b.ms > a.ms ? b : a));
    const significant = comps.filter((c) => c.ms >= f.wallMs * 0.18 && c.ms > 20);
    const category: FreezeCategory = best.ms >= f.wallMs * 0.3 ? best.cat : "outside";
    const label = (significant.length
      ? significant
          .sort((a, b) => b.ms - a.ms)
          .map((c) => c.text)
          .join(" + ")
      : "вне кадра: разрыв подачи кадров (браузер/смена ориентации/fullscreen/GC)") +
      (f.camBusy ? " · камера в полёте" : "");
    return { category, label };
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

    // Пересечения фризов с длинными задачами: считаем только реально общее
    // время (раньше задача на секунду «дарила» весь свой вес каждому кадру).
    const longByFrame = (f: FrameRecord) => {
      let sum = 0;
      for (const lt of this.longTasks) {
        const overlap = Math.min(lt.t + lt.ms, f.t) - Math.max(lt.t, f.t - f.wallMs);
        if (overlap > 0) sum += overlap;
      }
      return sum;
    };

    const freezes: FreezeRecord[] = frames
      .filter((f) => f.wallMs >= freezeMs)
      .map((f) => {
        const longMs = longByFrame(f);
        const updateMs = f.gazeMs + f.worldMs + f.partMs + f.discMs;
        const verdict = this.classify(f, longMs);
        return {
          frame: f.frame,
          t: Math.round(f.t),
          wallMs: Math.round(f.wallMs),
          updateMs: Math.round(updateMs),
          renderMs: Math.round(f.renderMs),
          gpuMs: Math.round(f.gpuMs),
          outsideMs: Math.round(f.outsideMs),
          longtaskMs: Math.round(longMs),
          camBusy: f.camBusy,
          category: verdict.category,
          label: verdict.label,
        };
      })
      .sort((a, b) => b.wallMs - a.wallMs);

    // Сводка виновников по сумме времени фризов (по категориям).
    const catNames: Record<FreezeCategory, string> = {
      gpu: "GPU-растеризация (fill-rate/шейдеры)",
      longtask: "длинные JS-задачи (GC/React/стили)",
      render: "рендер/CPU-сабмит драйверу",
      cpu: "CPU-сцена (JS-обновление мира)",
      camera: "камера (захват/чтение кадра)",
      outside: "вне кадра (GC/браузер/композитор)",
    };
    const buckets = new Map<FreezeCategory, { ms: number; count: number }>();
    for (const f of freezes) {
      const cur = buckets.get(f.category) || { ms: 0, count: 0 };
      cur.ms += f.wallMs;
      cur.count += 1;
      buckets.set(f.category, cur);
    }
    const freezeTotal = freezes.reduce((a, f) => a + f.wallMs, 0);
    const owners = [...buckets.entries()]
      .map(([cat, v]) => ({
        category: cat,
        name: catNames[cat],
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
      gpuMs: sum((f) => f.gpuMs),
      outsideMs: sum((f) => f.outsideMs),
    };
    const gpuVals = frames.map((f) => f.gpuMs);
    const gpuMax = gpuVals.length ? Math.max(...gpuVals) : 0;
    const drawsAvg = frames.length ? sum((f) => f.calls) : 0;
    const trisAvg = frames.length ? sum((f) => f.triangles) : 0;

    const camTicks = this.events.filter((e) => e.kind === "cam:tick").length;
    const camResults = this.events.filter((e) => e.kind === "cam:result");
    const camBitmaps = this.events.filter((e) => e.kind === "cam:bitmap");
    const camProcAvg = camResults.length
      ? camResults.reduce((a, e) => a + (e.ms || 0), 0) / camResults.length
      : 0;
    const camProcMax = camResults.length ? Math.max(...camResults.map((e) => e.ms || 0)) : 0;
    const camBitmapAvg = camBitmaps.length
      ? camBitmaps.reduce((a, e) => a + (e.ms || 0), 0) / camBitmaps.length
      : 0;
    const camBitmapMax = camBitmaps.length ? Math.max(...camBitmaps.map((e) => e.ms || 0)) : 0;
    const freezesWithCam = freezes.filter((f) => f.camBusy).length;
    const longTotal = this.longTasks.reduce((a, l) => a + l.ms, 0);
    const longGc = this.longTasks.length;
    const uiPolls = this.events.filter((e) => e.kind === "ui:poll");
    const uiPollAvg = uiPolls.length ? uiPolls.reduce((a, e) => a + (e.ms || 0), 0) / uiPolls.length : 0;
    const uiPollMax = uiPolls.length ? Math.max(...uiPolls.map((e) => e.ms || 0)) : 0;
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
      `GPU-ожидание (gl.finish): среднее ${fmt(avg.gpuMs)}мс · макс ${fmt(gpuMax)}мс — ${avg.gpuMs > p50 * 0.45 ? "кадр УПИРАЕТСЯ В GPU (fill-rate/шейдеры)" : "GPU не главный источник кадра"}`
    );
    lines.push(
      `Средний кадр: обновление сцены ${fmt(avg.gazeMs + avg.worldMs + avg.partMs + avg.discMs)}мс (пути ${fmt(avg.actMs)}, кит/черепаха ${fmt(avg.aniMs)}, школы ${fmt(avg.schMs)}, частицы ${fmt(avg.partMs)}), рендер ${fmt(avg.renderMs)}мс (глаз0 ${fmt(avg.rEye0Ms)}, глаз1 ${fmt(avg.rEye1Ms)}, composer ${fmt(avg.rCompMs)}), GPU ${fmt(avg.gpuMs)}мс, вне кадра ${fmt(avg.outsideMs)}мс`
    );
    lines.push(`Сцена: ≈${fmt(drawsAvg, 0)} draws/кадр, ≈${fmt(trisAvg / 1000, 0)}k треугольников`);
    lines.push(
      `Длинные JS-задачи: ${longGc} шт, суммарно ${fmt(longTotal, 0)}мс${longGc ? " (GC/React/стили/драйвер)" : ""}`
    );
    const gcMax = this.gcPauses.length ? Math.max(...this.gcPauses.map((g) => g.ms)) : 0;
    const gcKinds = new Map<string, number>();
    for (const g of this.gcPauses) gcKinds.set(g.kind, (gcKinds.get(g.kind) || 0) + 1);
    lines.push(
      `GC-паузы: ${this.gcPauses.length} шт, суммарно ${fmt(this.gcPauses.reduce((a, g) => a + g.ms, 0), 0)}мс (макс ${fmt(gcMax, 0)}мс${this.gcPauses.length ? ", " + [...gcKinds.entries()].map(([k, n]) => `${k}×${n}`).join(", ") : ""})`
    );
    const loafStyleAvg = this.loafs.length
      ? this.loafs.reduce((a, l) => a + l.styleMs, 0) / this.loafs.length
      : 0;
    const loafPaintAvg = this.loafs.length
      ? this.loafs.reduce((a, l) => a + l.paintMs, 0) / this.loafs.length
      : 0;
    const scriptCounts = new Map<string, { n: number; ms: number }>();
    for (const l of this.loafs) {
      for (const s of l.scripts) {
        const cur = scriptCounts.get(s) || { n: 0, ms: 0 };
        cur.n += 1;
        scriptCounts.set(s, cur);
      }
    }
    const topScripts = [...scriptCounts.entries()].slice(0, 4).map(([s]) => s);
    lines.push(
      `LoAF (длинные кадры анимации): ${this.loafs.length} шт, стиль+раскладка ср. ${fmt(loafStyleAvg, 0)}мс, пейнт ср. ${fmt(loafPaintAvg, 0)}мс${topScripts.length ? `; топ: ${topScripts.join(" | ")}` : ""}`
    );
    lines.push(
      `UI-цикл (панель драйвера, опрос/превью): ${uiPolls.length} шт, ср. ${fmt(uiPollAvg)}мс, макс ${fmt(uiPollMax)}мс`
    );
    lines.push(
      `Камера: тиков ${camTicks}, bitmap ср. ${fmt(camBitmapAvg, 0)}мс (макс ${fmt(camBitmapMax, 0)}), анализ ср. ${fmt(camProcAvg, 0)}мс (макс ${fmt(camProcMax, 0)}); фризов в момент тика камеры: ${freezesWithCam} из ${freezes.length}`
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
      lines.push("Худшие кадры (wall / update / render / GPU / вне кадра / JS-задача / причина):");
      for (const f of freezes.slice(0, 20)) {
        lines.push(
          `  #${f.frame} ${f.wallMs}мс / ${f.updateMs} / ${f.renderMs} / ${f.gpuMs} / ${f.outsideMs} / ${f.longtaskMs}${f.camBusy ? " cam" : ""} / ${f.label}`
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
          `  #${f.frame} ${fmt(f.wallMs)}мс / ${fmt(f.gazeMs + f.worldMs + f.partMs + f.discMs)} / ${fmt(f.renderMs)} / GPU ${fmt(f.gpuMs)} / ${fmt(f.outsideMs)}`
        );
      }
    }
    const noisy = new Set(["longtask", "ui:poll", "loaf"]);
    const evs = this.events.filter((e) => !noisy.has(e.kind)).slice(-14);
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
        gc: {
          count: this.gcPauses.length,
          totalMs: Math.round(this.gcPauses.reduce((a, g) => a + g.ms, 0)),
          maxMs: Math.round(gcMax),
          kinds: Object.fromEntries(gcKinds),
        },
        loaf: {
          count: this.loafs.length,
          styleAvgMs: +fmt(loafStyleAvg, 0),
          paintAvgMs: +fmt(loafPaintAvg, 0),
          topScripts,
        },
        gpu: { avgMs: +fmt(avg.gpuMs), maxMs: +fmt(gpuMax), bound: avg.gpuMs > p50 * 0.45 },
        uiPoll: { count: uiPolls.length, avgMs: +fmt(uiPollAvg), maxMs: +fmt(uiPollMax) },
        scene: { drawsAvg: +fmt(drawsAvg, 0), trisAvg: Math.round(trisAvg) },
        camera: {
          ticks: camTicks,
          procAvgMs: +fmt(camProcAvg, 0),
          procMaxMs: +fmt(camProcMax, 0),
          bitmapAvgMs: +fmt(camBitmapAvg, 0),
          bitmapMaxMs: +fmt(camBitmapMax, 0),
          freezesWithCam,
        },
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
