import { useEffect, useRef, useState } from "react";
import type { CameraMarkerProvider, MarkerMode, TrackerInfo } from "../lib/markerDriver";
import type { GazeSource, GazeStatus, Quality } from "../game/ReefWorld";
import {
  ArrowRight,
  CameraIcon,
  CheckIcon,
  CloseIcon,
  CursorIcon,
  DownloadIcon,
  ExpandIcon,
  EyeIcon,
  GyroIcon,
  InfoIcon,
  RotateIcon,
  SparkIcon,
  VrIcon,
} from "./icons";

interface Props {
  provider: CameraMarkerProvider;
  source: GazeSource;
  onSourceChange: (source: GazeSource) => void;
  vr: boolean;
  onEnterVr: () => void;
  onExitVr: () => void;
  ipd: number;
  onIpdChange: (value: number) => void;
  quality: Quality;
  onQualityChange: (quality: Quality) => void;
  reducedMotion: boolean;
  onReducedMotionChange: (value: boolean) => void;
  onRequestGyro: () => Promise<{ ok: boolean; message: string }>;
  onCalibrateGyro: () => void;
  gazeStatus: GazeStatus;
  onClose: () => void;
  fps: number;
  calls: number;
}

const initialInfo = (provider: CameraMarkerProvider): TrackerInfo => provider.getInfo();

const phaseCopy: Record<string, string> = {
  idle: "не запущено",
  starting: "запуск",
  search: "поиск меток",
  single: "одна метка",
  dual: "пара согласна",
  held: "удержание",
  synthetic: "синтетика QA",
  error: "ошибка",
};

const sourceCards: {
  id: GazeSource;
  title: string;
  sub: string;
  icon: typeof CursorIcon;
  note: string;
}[] = [
  { id: "pointer", title: "Ручной", sub: "мышь / палец", icon: CursorIcon, note: "Обычный режим без датчиков" },
  { id: "gyro", title: "Гироскоп", sub: "телефон в очках", icon: GyroIcon, note: "Нужно разрешение датчиков" },
  { id: "camera", title: "Камера-метки", sub: "2 цветные метки", icon: CameraIcon, note: "Тот же драйвер, что в VR-гонках" },
];

export default function DriverWorkshop({
  provider,
  source,
  onSourceChange,
  vr,
  onEnterVr,
  onExitVr,
  ipd,
  onIpdChange,
  quality,
  onQualityChange,
  reducedMotion,
  onReducedMotionChange,
  onRequestGyro,
  onCalibrateGyro,
  gazeStatus,
  onClose,
  fps,
  calls,
}: Props) {
  const [info, setInfo] = useState<TrackerInfo>(() => initialInfo(provider));
  const [markerMode, setMarkerMode] = useState<MarkerMode>(provider.getInfo().markerMode);
  const [message, setMessage] = useState<string | null>(null);
  const [messageTone, setMessageTone] = useState<"ok" | "warn">("ok");
  const [starting, setStarting] = useState(false);
  const [fullscreenError, setFullscreenError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamVersionRef = useRef(-1);

  useEffect(() => {
    const tick = () => {
      const next = provider.getInfo();
      setInfo(next);
      const video = videoRef.current;
      if (video && provider.getStream() && next.streamVersion !== streamVersionRef.current) {
        video.srcObject = provider.getStream();
        video.play().catch(() => undefined);
        streamVersionRef.current = next.streamVersion;
      }
      if (!provider.getStream()) streamVersionRef.current = -1;
      drawPreview(next);
    };
    tick();
    const id = window.setInterval(tick, 180);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider]);

  const drawPreview = (next: TrackerInfo) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    const video = videoRef.current;
    if (video && video.readyState >= 2 && provider.getStream()) {
      ctx.drawImage(video, 0, 0, w, h);
    } else {
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, "#0b2529");
      grad.addColorStop(1, "#03181b");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = "rgba(142,228,212,.1)";
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 22) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 22) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
      ctx.fillStyle = "rgba(142,228,212,.46)";
      ctx.font = "500 10px Manrope, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(next.running ? "КАДР ЕЩЁ НЕ ПРИШЁЛ" : "КАМЕРА НЕ ЗАПУЩЕНА", w / 2, h / 2);
    }
    if (next.frame) {
      const drawBox = (box: TrackerInfo["frame"] extends null ? never : NonNullable<TrackerInfo["frame"]>["left"], color: string) => {
        if (!box) return;
        const x = box.u * w;
        const y = box.v * h;
        const bw = box.w * w;
        const bh = box.h * h;
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.strokeRect(x - bw / 2, y - bh / 2, bw, bh);
        ctx.fillStyle = color;
        const label = box.color === "left" ? "L" : "R";
        ctx.fillRect(x - bw / 2, y - bh / 2 - 13, 18, 13);
        ctx.fillStyle = "#041a1d";
        ctx.font = "700 9px Manrope, sans-serif";
        ctx.textAlign = "left";
        ctx.fillText(label, x - bw / 2 + 5, y - bh / 2 - 3);
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      };
      drawBox(next.frame.left, "#ff4f97");
      drawBox(next.frame.right, "#ff8b4f");
    }
    ctx.strokeStyle = "rgba(255,255,255,.16)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(w / 2, 0);
    ctx.lineTo(w / 2, h);
    ctx.moveTo(0, h / 2);
    ctx.lineTo(w, h / 2);
    ctx.stroke();
    ctx.strokeStyle = "rgba(142,228,212,.4)";
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, Math.min(w, h) * 0.09, 0, Math.PI * 2);
    ctx.stroke();
  };

  const ok = (text: string) => {
    setMessage(text);
    setMessageTone("ok");
  };
  const warn = (text: string) => {
    setMessage(text);
    setMessageTone("warn");
  };

  const handleCamera = async () => {
    setStarting(true);
    const started = await provider.startCamera();
    setStarting(false);
    if (started) {
      onSourceChange("camera");
      ok("Камера подключена. Проверьте метки в кадре и нажмите «Смотрю прямо».");
    } else {
      warn(provider.getInfo().error || "Камера не запустилась.");
    }
    setInfo(provider.getInfo());
  };

  const handleSynthetic = () => {
    provider.startSynthetic();
    onSourceChange("camera");
    ok("QA-подача включена. Двигайте курсором по превью: это проверка математики, не живые метки.");
    setInfo(provider.getInfo());
  };

  const handleStop = () => {
    provider.stop();
    if (source === "camera") onSourceChange("pointer");
    ok("Камера остановлена. Взгляд переключён на ручной режим.");
    setInfo(provider.getInfo());
  };

  const handleCalibrate = () => {
    const result = provider.calibrate();
    if (result.ok) ok(result.message);
    else warn(result.message);
    setInfo(provider.getInfo());
  };

  const changeMarkerMode = (mode: MarkerMode) => {
    setMarkerMode(mode);
    provider.setMarkerMode(mode);
    warn(
      mode === "dual"
        ? "Пара включена. Калибровка потребует обе метки и правильный порядок."
        : "Одна метка. Меньше требований к кадру, ниже точность и нет честной пары."
    );
    setInfo(provider.getInfo());
  };

  const requestGyro = async () => {
    const result = await onRequestGyro();
    if (result.ok) ok(result.message);
    else warn(result.message);
  };

  const lockLandscape = () => {
    try {
      void (screen.orientation as ScreenOrientation & { lock?: (o: string) => Promise<void> })
        .lock?.("landscape")
        .catch(() => undefined);
    } catch {
      /* orientation lock опционален */
    }
  };

  const enterVr = () => {
    setFullscreenError(null);
    // VR включаем сразу и никогда не ждём fullscreen: на iOS/в очках промис
    // requestFullscreen может не резолвиться, и тогда интерфейс «зависает»
    // при живой камере. Fullscreen — необязательное улучшение, не ворота.
    onEnterVr();
    if (source === "camera" && !provider.getInfo().running) {
      // Запасной вход: VR не должен открываться с мёртвым драйвером.
      void provider.startCamera().then((started) => {
        if (!started) {
          onSourceChange("pointer");
          warn(provider.getInfo().error || "Камера не запустилась. Взгляд переключён на ручной режим — без подмены данных.");
        }
      });
    }
    const request = document.documentElement.requestFullscreen;
    if (!document.fullscreenElement && request) {
      try {
        const result = request.call(document.documentElement);
        if (result && typeof result.then === "function") {
          result.then(lockLandscape).catch(() => {
            setFullscreenError("Полный экран недоступен. Стереопара включена — разверните телефон вручную.");
          });
        } else {
          lockLandscape();
        }
      } catch {
        setFullscreenError("Полный экран недоступен. Стереопара включена — разверните телефон вручную.");
      }
    } else {
      lockLandscape();
    }
    if (source === "gyro") void onRequestGyro();
  };

  const exitVr = async () => {
    onExitVr();
    if (document.fullscreenElement) {
      await document.exitFullscreen().catch(() => undefined);
    }
    try {
      (screen.orientation as ScreenOrientation & { unlock?: () => void }).unlock?.();
    } catch {
      /* no-op */
    }
  };

  const frame = info.frame;
  const detected = frame ? [frame.left, frame.right].filter(Boolean).length : 0;
  const phase = phaseCopy[info.phase] || info.phase;
  const statusTone = info.phase === "dual" || info.phase === "single" ? "text-aqua" : info.phase === "held" ? "text-gold" : info.phase === "error" ? "text-coral" : "text-fog";
  const sourceNote =
    source === "camera"
      ? info.feed === "synthetic"
        ? "QA-подача"
        : info.running
          ? "камера активна"
          : "камера выключена"
      : source === "gyro"
        ? gazeStatus === "gyro"
          ? "гироскоп активен"
          : "ожидание датчика"
        : "ручной обзор";

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto overscroll-contain bg-[#011013]/75 px-0 py-0 backdrop-blur-md sm:px-5 sm:py-6 scroll-thin">
      <div className="glass relative min-h-full w-full max-w-[1180px] overflow-hidden rounded-none border-x-0 sm:min-h-0 sm:rounded-[26px] sm:border-x">
        <div className="pointer-events-none absolute -right-24 -top-32 h-80 w-80 rounded-full bg-aqua/[0.075] blur-[80px]" />
        <div className="pointer-events-none absolute -left-24 top-1/3 h-64 w-64 rounded-full bg-coral/[0.045] blur-[70px]" />

        {/* Header */}
        <div className="relative z-10 flex items-start justify-between gap-4 border-b border-white/10 px-5 py-5 sm:px-7">
          <div className="flex items-center gap-3.5">
            <div className="relative grid h-11 w-11 place-items-center rounded-full border border-aqua/20 bg-aqua/[0.06]">
              <VrIcon className="h-6 w-6 text-aqua/90" strokeWidth={1.2} />
              <span className="absolute -right-1 top-1.5 h-2.5 w-1 rounded-[1px] bg-[#d6336c]" />
              <span className="absolute -left-1 top-1.5 h-2.5 w-1 rounded-[1px] bg-[#f15a24]" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="font-display text-[26px] leading-none text-cream sm:text-[30px]">Драйвер взгляда</h2>
                <span className="rounded-full border border-white/10 px-2 py-0.5 font-mono text-[8px] tracking-wider text-fog/55">
                  v0.9 / marker
                </span>
              </div>
              <p className="mt-1.5 text-[10px] leading-relaxed text-fog/60">
                Линзовые очки · телефон · камера смотрит на метки. Игрок не двигается — только смотрит.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/10 text-fog transition hover:border-aqua/25 hover:bg-white/5 hover:text-cream"
            aria-label="Закрыть"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-0 lg:grid-cols-[minmax(0,1fr)_356px]">
          {/* Левая колонка */}
          <div className="relative z-10 space-y-6 px-5 py-5 sm:px-7 sm:py-6">
            {/* Источник */}
            <section>
              <div className="flex items-center justify-between">
                <span className="eyebrow text-aqua/75">01 / источник взгляда</span>
                <span className="flex items-center gap-1.5 text-[9px] text-fog/55">
                  <span className={`h-1.5 w-1.5 rounded-full ${source === "camera" ? "bg-aqua" : source === "gyro" ? "bg-gold" : "bg-cream/50"}`} />
                  {sourceNote}
                </span>
              </div>
              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
                {sourceCards.map((card) => {
                  const Icon = card.icon;
                  const active = source === card.id;
                  return (
                    <button
                      key={card.id}
                      onClick={() => onSourceChange(card.id)}
                      className={`group relative flex items-start gap-3 rounded-xl border p-3.5 text-left transition sm:block ${
                        active
                          ? "border-aqua/35 bg-aqua/[0.075] shadow-[inset_0_1px_0_rgba(255,255,255,.05)]"
                          : "border-white/[0.09] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
                      }`}
                    >
                      <div className={`grid h-8 w-8 place-items-center rounded-lg border ${active ? "border-aqua/25 bg-aqua/10 text-aqua" : "border-white/10 bg-white/[0.03] text-fog/65"}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="sm:mt-3">
                        <div className="text-[11px] font-semibold text-cream/90">{card.title}</div>
                        <div className="mt-0.5 text-[9px] uppercase tracking-[0.1em] text-fog/50">{card.sub}</div>
                        <div className="mt-1.5 text-[9px] leading-relaxed text-fog/45">{card.note}</div>
                      </div>
                      {active && (
                        <span className="absolute right-3 top-3 grid h-4 w-4 place-items-center rounded-full bg-aqua text-abyss">
                          <CheckIcon className="h-2.5 w-2.5" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              <div className="mt-2.5 flex items-start gap-2 rounded-lg border border-white/[0.06] bg-white/[0.015] px-3 py-2 text-[9px] leading-relaxed text-fog/45">
                <InfoIcon className="mt-px h-3 w-3 shrink-0 text-aqua/60" />
                Режимы не смешиваются. Камера не «дополняется» гироскопом для гладкости: источник выбран явно и подписан в HUD.
              </div>
            </section>

            {/* Камера */}
            <section>
              <div className="flex items-center justify-between">
                <span className="eyebrow text-aqua/75">02 / камера — метки</span>
                <div className="flex items-center gap-2">
                  <span className={`font-mono text-[9px] ${statusTone}`}>{phase}</span>
                  <span className="h-1 w-1 rounded-full bg-white/20" />
                  <span className="font-mono text-[9px] text-fog/45">{detected} / 2 detected</span>
                </div>
              </div>

              <div className="mt-3 overflow-hidden rounded-xl border border-white/10 bg-[#03171a]">
                <div className="relative aspect-[16/9] w-full">
                  <video ref={videoRef} className="absolute inset-0 h-full w-full object-cover opacity-0" muted playsInline autoPlay />
                  <canvas
                    ref={canvasRef}
                    width={640}
                    height={360}
                    className="absolute inset-0 h-full w-full cursor-crosshair object-cover"
                    onPointerMove={(event) => {
                      if (info.feed !== "synthetic") return;
                      const rect = event.currentTarget.getBoundingClientRect();
                      provider.setSyntheticPointer((event.clientX - rect.left) / rect.width, (event.clientY - rect.top) / rect.height);
                    }}
                    onPointerDown={(event) => {
                      if (info.feed !== "synthetic") return;
                      const rect = event.currentTarget.getBoundingClientRect();
                      provider.setSyntheticPointer((event.clientX - rect.left) / rect.width, (event.clientY - rect.top) / rect.height);
                    }}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(2,16,19,.44))]" />
                  <div className="absolute left-3 top-3 flex items-center gap-2">
                    <span className="flex items-center gap-1.5 rounded-full border border-white/15 bg-black/35 px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.13em] text-cream/80 backdrop-blur">
                      <span className={`h-1 w-1 rounded-full ${info.running ? "animate-pulse bg-coral" : "bg-fog/40"}`} />
                      {info.feed === "synthetic" ? "synthetic / QA" : info.running ? "live feed" : "standby"}
                    </span>
                    {info.feed === "synthetic" && (
                      <span className="rounded-full border border-gold/25 bg-gold/10 px-2 py-1 text-[8px] uppercase tracking-[0.1em] text-gold">
                        не живые метки
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
                    <div className="flex items-center gap-2 font-mono text-[8px] text-cream/55">
                      <span className="rounded border border-white/10 bg-black/25 px-1.5 py-0.5">hsv 338 / 16</span>
                      <span className="rounded border border-white/10 bg-black/25 px-1.5 py-0.5">160×120</span>
                      <span className="hidden rounded border border-white/10 bg-black/25 px-1.5 py-0.5 sm:inline">
                        {info.workerAvailable ? "worker" : "no worker"}
                      </span>
                    </div>
                    <span className="font-mono text-[8px] text-cream/45">{info.facingMode ? info.facingMode : "—"}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 border-t border-white/10 px-3 py-3">
                  <button
                    onClick={handleCamera}
                    disabled={starting}
                    className="flex items-center gap-2 rounded-full bg-cream px-3.5 py-2 text-[10px] font-semibold text-[#062326] transition hover:bg-white disabled:opacity-55"
                  >
                    <CameraIcon className="h-3.5 w-3.5" />
                    {starting ? "Запуск…" : info.running && info.feed === "live" ? "Перезапустить камеру" : "Включить камеру"}
                  </button>
                  <button
                    onClick={handleCalibrate}
                    className="flex items-center gap-2 rounded-full border border-aqua/30 bg-aqua/[0.07] px-3.5 py-2 text-[10px] font-semibold text-aqua transition hover:bg-aqua/15"
                  >
                    <EyeIcon className="h-3.5 w-3.5" />
                    Смотрю прямо
                  </button>
                  <div className="ml-auto flex items-center gap-1 rounded-full border border-white/10 p-0.5">
                    {(["single", "dual"] as MarkerMode[]).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => changeMarkerMode(mode)}
                        className={`rounded-full px-2.5 py-1.5 text-[9px] font-medium uppercase tracking-[0.08em] transition ${
                          markerMode === mode ? "bg-white/[0.12] text-cream" : "text-fog/50 hover:text-cream"
                        }`}
                      >
                        {mode === "single" ? "1 метка" : "2 метки"}
                      </button>
                    ))}
                  </div>
                  <button onClick={handleSynthetic} className="rounded-full border border-white/10 px-3 py-2 text-[9px] font-medium text-fog/65 transition hover:border-white/20 hover:text-cream">
                    QA-подача
                  </button>
                  {info.running && (
                    <button onClick={handleStop} className="rounded-full px-2 py-2 text-[9px] font-medium text-coral/75 transition hover:text-coral">
                      стоп
                    </button>
                  )}
                </div>
              </div>

              {message && (
                <div className={`mt-2 flex items-start gap-2 rounded-lg border px-3 py-2 text-[10px] leading-relaxed ${messageTone === "ok" ? "border-aqua/15 bg-aqua/[0.05] text-aqua/85" : "border-gold/20 bg-gold/[0.06] text-gold/90"}`}>
                  <span className={`mt-0.5 h-1 w-1 shrink-0 rounded-full ${messageTone === "ok" ? "bg-aqua" : "bg-gold"}`} />
                  {message}
                </div>
              )}
              {info.error && !message && (
                <div className="mt-2 flex items-start gap-2 rounded-lg border border-coral/20 bg-coral/[0.05] px-3 py-2 text-[10px] leading-relaxed text-coral/90">
                  <InfoIcon className="mt-px h-3 w-3 shrink-0" /> {info.error}
                </div>
              )}
              <p className="mt-2 text-[9px] leading-relaxed text-fog/40">
                {info.feed === "synthetic"
                  ? "Синтетическая подача проходит тот же Worker-HSV и ту же логику пары. Метки двигаются вместе с курсором — проверяется драйвер, а не камера."
                  : "Кадр 160×120 анализируется в Worker вне главного потока. Подтверждённая метка — не меньше 150 мс. Порядок пары: малиновая левее оранжевой."}
              </p>

              <div className="mt-3 grid grid-cols-3 gap-2">
                {[
                  { label: "процесс", value: `${frame?.procMs ? frame.procMs.toFixed(1) : "—"} мс`, note: "HSV + компоненты" },
                  { label: "частота", value: `${info.fps.toFixed(1)} Гц`, note: `тир ${info.tier + 1} · ${info.intervalMs} мс` },
                  { label: "порядок", value: frame?.pairOrderOk ? "L → R" : "—", note: "пара согласована" },
                ].map((item) => (
                  <div key={item.label} className="rounded-lg border border-white/[0.07] bg-white/[0.02] px-2.5 py-2">
                    <div className="text-[7px] font-semibold uppercase tracking-[0.14em] text-fog/40">{item.label}</div>
                    <div className="tabular mt-1 text-[11px] text-cream/85">{item.value}</div>
                    <div className="mt-0.5 text-[7px] uppercase tracking-[0.08em] text-fog/35">{item.note}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* Метки */}
            <section>
              <div className="flex items-center justify-between">
                <span className="eyebrow text-aqua/75">03 / физические метки</span>
                <button
                  onClick={() => provider.downloadMarkers()}
                  className="flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.1em] text-aqua/80 transition hover:text-aqua"
                >
                  <DownloadIcon className="h-3.5 w-3.5" />
                  скачать обе
                </button>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2.5">
                <div className="overflow-hidden rounded-xl border border-white/10">
                  <div className="relative flex h-[90px] items-center justify-center bg-[#d6336c]">
                    <span className="font-mono text-[9px] font-semibold tracking-[0.2em] text-white/70">HUE 338</span>
                    <span className="absolute bottom-2 left-2 h-px w-5 bg-white/40" />
                    <span className="absolute right-2 top-2 font-mono text-[8px] text-white/55">L</span>
                  </div>
                  <div className="flex items-center justify-between bg-white/[0.025] px-3 py-2">
                    <span className="text-[10px] text-cream/80">Малиновая · левая</span>
                    <span className="text-[8px] uppercase tracking-widest text-fog/35">hold 150 ms</span>
                  </div>
                </div>
                <div className="overflow-hidden rounded-xl border border-white/10">
                  <div className="relative flex h-[90px] items-center justify-center bg-[#f15a24]">
                    <span className="font-mono text-[9px] font-semibold tracking-[0.2em] text-white/70">HUE 016</span>
                    <span className="absolute bottom-2 left-2 h-px w-5 bg-white/40" />
                    <span className="absolute right-2 top-2 font-mono text-[8px] text-white/55">R</span>
                  </div>
                  <div className="flex items-center justify-between bg-white/[0.025] px-3 py-2">
                    <span className="text-[10px] text-cream/80">Оранжевая · правая</span>
                    <span className="text-[8px] uppercase tracking-widest text-fog/35">паре нужны обе</span>
                  </div>
                </div>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[9px] text-fog/45">
                <span>горизонтальные карточки</span>
                <span className="flex items-center gap-1"><span className="h-1 w-1 rounded-full bg-aqua/70" /> ровный свет</span>
                <span>без бликов</span>
                <span>на одной высоте</span>
              </div>
            </section>

            {/* Гироскоп */}
            <section>
              <span className="eyebrow text-aqua/75">04 / гироскоп</span>
              <div className="mt-3 flex flex-col gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] p-3.5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.03] text-aqua/85">
                    <GyroIcon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-[11px] font-medium text-cream/85">
                      {gazeStatus === "gyro" ? "Датчик передаёт ориентацию" : "Датчик ещё не отвечает"}
                    </div>
                    <div className="mt-0.5 max-w-[300px] text-[9px] leading-relaxed text-fog/45">
                      Только явный режим. Если данных нет — обзор стоит на месте, HUD пишет «нет данных». Тихого смешивания с мышью нет.
                    </div>
                  </div>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button onClick={requestGyro} className="rounded-full border border-aqua/25 bg-aqua/[0.06] px-3 py-2 text-[9px] font-semibold text-aqua transition hover:bg-aqua/12">
                    Разрешить
                  </button>
                  <button onClick={onCalibrateGyro} className="rounded-full border border-white/10 px-3 py-2 text-[9px] font-medium text-fog/65 transition hover:text-cream">
                    Центр
                  </button>
                </div>
              </div>
            </section>

            {/* VR */}
            <section>
              <div className="flex items-center justify-between">
                <span className="eyebrow text-aqua/75">05 / линзовые очки</span>
                <span className="font-mono text-[8px] uppercase tracking-widest text-fog/35">без дисторсии линз</span>
              </div>
              <div className="mt-3 rounded-xl border border-white/[0.08] bg-white/[0.02] p-3.5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-lg border border-aqua/20 bg-aqua/[0.06] text-aqua">
                      <VrIcon className="h-5 w-5" strokeWidth={1.2} />
                    </div>
                    <div>
                      <div className="text-[11px] font-medium text-cream/85">Стереопара · два квадратных кадра</div>
                      <div className="mt-0.5 text-[9px] leading-relaxed text-fog/45">
                        Рендер дважды, тени один раз на пару глаз, без bloom. Поворот головы — выбранный источник.
                      </div>
                    </div>
                  </div>
                  {vr ? (
                    <button onClick={exitVr} className="shrink-0 rounded-full border border-coral/30 bg-coral/[0.08] px-4 py-2 text-[10px] font-semibold text-coral transition hover:bg-coral/15">
                      Выйти из VR
                    </button>
                  ) : (
                    <button onClick={enterVr} className="flex shrink-0 items-center justify-center gap-2 rounded-full bg-cream px-4 py-2.5 text-[10px] font-semibold text-[#062326] transition hover:bg-white">
                      <ExpandIcon className="h-3.5 w-3.5" />
                      Войти в VR
                    </button>
                  )}
                </div>
                <div className="mt-4 border-t border-white/10 pt-3.5">
                  <div className="flex items-center justify-between text-[9px]">
                    <label htmlFor="ipd" className="text-fog/60">Стереобазис</label>
                    <span className="tabular text-cream/85">{ipd.toFixed(1)} см</span>
                  </div>
                  <input
                    id="ipd"
                    type="range"
                    min={4}
                    max={16}
                    step={0.1}
                    value={ipd}
                    onChange={(event) => onIpdChange(Number(event.target.value))}
                    className="mt-2.5 w-full"
                  />
                  <div className="mt-1.5 flex justify-between text-[8px] uppercase tracking-widest text-fog/30">
                    <span>мягкий объём</span>
                    <span>гиперстерео</span>
                  </div>
                  <p className="mt-2 text-[9px] leading-relaxed text-fog/40">
                    Виртуальный базис, не размер очков. 6–7 см — комфортное наблюдение; больше 12 см делает риф миниатюрой.
                  </p>
                  {fullscreenError && <p className="mt-2 text-[9px] leading-relaxed text-gold/80">{fullscreenError}</p>}
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[8px] uppercase tracking-[0.1em] text-fog/35">
                  <span className="flex items-center gap-1.5"><RotateIcon className="h-3 w-3" /> только альбомная</span>
                  <span>Esc — выход</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5 rounded-lg border border-aqua/10 bg-aqua/[0.035] p-2.5">
                  {[
                    "тени: 1 проход / пара глаз",
                    "камера: анализ после рендера",
                    "кадр меток: 128×96",
                    "без bloom и MSAA в стерео",
                  ].map((item) => (
                    <span key={item} className="rounded-full border border-aqua/15 px-2 py-1 font-mono text-[7.5px] uppercase tracking-[0.06em] text-aqua/65">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </section>

            {/* Качество */}
            <section className="pb-2">
              <span className="eyebrow text-aqua/75">06 / комфорт и качество</span>
              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3">
                  <div className="text-[10px] font-medium text-cream/80">Картинка</div>
                  <div className="mt-2 flex rounded-full border border-white/10 p-0.5">
                    {(["high", "balanced"] as Quality[]).map((value) => (
                      <button
                        key={value}
                        onClick={() => onQualityChange(value)}
                        className={`flex-1 rounded-full px-2 py-1.5 text-[8px] font-semibold uppercase tracking-[0.08em] transition ${
                          quality === value ? "bg-white/[0.12] text-cream" : "text-fog/45 hover:text-cream"
                        }`}
                      >
                        {value === "high" ? "Кинематограф" : "Баланс"}
                      </button>
                    ))}
                  </div>
                  <p className="mt-2 text-[8px] leading-relaxed text-fog/35">Bloom и плотность частиц меняются на лету.</p>
                </div>
                <button
                  onClick={() => onReducedMotionChange(!reducedMotion)}
                  className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.02] p-3 text-left transition hover:border-white/15"
                >
                  <div>
                    <div className="text-[10px] font-medium text-cream/80">Мягкое покачивание</div>
                    <p className="mt-1 text-[8px] leading-relaxed text-fog/35">Убрать дыхание камеры для комфорта</p>
                  </div>
                  <span className={`relative h-4 w-7 shrink-0 rounded-full transition ${reducedMotion ? "bg-aqua/80" : "bg-white/15"}`}>
                    <span className={`absolute top-0.5 h-3 w-3 rounded-full bg-cream transition-all ${reducedMotion ? "left-3.5" : "left-0.5"}`} />
                  </span>
                </button>
              </div>
            </section>
          </div>

          {/* Правая колонка */}
          <aside className="relative z-10 border-t border-white/10 bg-[#042024]/45 px-5 py-6 lg:border-l lg:border-t-0 sm:px-6">
            <div className="sticky top-6 space-y-5">
              <div>
                <div className="flex items-center justify-between">
                  <span className="eyebrow text-aqua/70">схема установки</span>
                  <span className="rounded-full border border-white/10 px-2 py-0.5 text-[8px] text-fog/45">поле</span>
                </div>
                <div className="mt-3 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#021619]">
                  <svg viewBox="0 0 360 210" className="w-full">
                    <defs>
                      <radialGradient id="lensGlow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#5fc0b4" stopOpacity=".35" />
                        <stop offset="100%" stopColor="#0b3f45" stopOpacity=".15" />
                      </radialGradient>
                      <linearGradient id="seaFade" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0c3a40" />
                        <stop offset="100%" stopColor="#03181b" />
                      </linearGradient>
                    </defs>
                    <rect width="360" height="210" fill="url(#seaFade)" />
                    {/* маркеры в комнате */}
                    <g opacity=".9">
                      <rect x="72" y="33" width="50" height="20" rx="2" fill="#d6336c" />
                      <rect x="238" y="33" width="50" height="20" rx="2" fill="#f15a24" />
                      <text x="97" y="47" textAnchor="middle" fill="white" fillOpacity=".7" fontSize="7" fontFamily="monospace">LEFT</text>
                      <text x="263" y="47" textAnchor="middle" fill="white" fillOpacity=".7" fontSize="7" fontFamily="monospace">RIGHT</text>
                      <path d="M122 43h116" stroke="#b7e4dc" strokeOpacity=".2" strokeDasharray="3 4" />
                    </g>
                    {/* конус камеры */}
                    <path d="M180 132 104 38M180 132l76-94" stroke="#8ee4d4" strokeOpacity=".25" strokeDasharray="3 5" />
                    {/* очки */}
                    <g>
                      <rect x="96" y="98" width="168" height="66" rx="30" fill="#0a2b2e" stroke="#a7d9cf" strokeOpacity=".35" />
                      <circle cx="146" cy="131" r="25" fill="url(#lensGlow)" stroke="#8ee4d4" strokeOpacity=".4" />
                      <circle cx="214" cy="131" r="25" fill="url(#lensGlow)" stroke="#8ee4d4" strokeOpacity=".4" />
                      <circle cx="154" cy="124" r="2" fill="#d9fff7" opacity=".8" />
                      <circle cx="206" cy="124" r="2" fill="#d9fff7" opacity=".8" />
                      <path d="M180 104v54M118 109c-10 5-14 14-13 25M242 109c10 5 14 14 13 25" stroke="#a7d9cf" strokeOpacity=".25" />
                      <rect x="176" y="128" width="8" height="7" rx="2" fill="#ff8a66" opacity=".7" />
                    </g>
                    <text x="180" y="185" textAnchor="middle" fill="#9db8b5" fillOpacity=".6" fontSize="7" letterSpacing="1.4" fontFamily="monospace">PHONE CAMERA → FIXED MARKERS</text>
                    <text x="180" y="199" textAnchor="middle" fill="#9db8b5" fillOpacity=".32" fontSize="7" letterSpacing="1" fontFamily="monospace">ИГРОК ТОЛЬКО СМОТРИТ · 1×1 М ДО МЕТОК</text>
                  </svg>
                </div>
              </div>

              <div className="rounded-xl border border-aqua/15 bg-aqua/[0.035] p-3.5">
                <div className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.14em] text-aqua/85">
                  <SparkIcon className="h-3.5 w-3.5" /> контракт драйвера
                </div>
                <ul className="mt-3 space-y-2.5 text-[9px] leading-[1.55] text-fog/55">
                  <li className="flex gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-aqua/70" />
                    <span><span className="text-cream/80">Потеря обеих меток</span> держит последний угол и коротко доезжает по скорости головы. Возврата в центр по таймеру нет.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-aqua/70" />
                    <span><span className="text-cream/80">Пара</span> усредняется, только если дельты согласны в пределах 6°. Иначе ведёт более сильный сигнал, а не середина.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-aqua/70" />
                    <span><span className="text-cream/80">Одна метка</span> честно подписана в HUD и никогда не доказывает, что вы смотрите прямо.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-aqua/70" />
                    <span><span className="text-cream/80">Рендер</span> идёт отдельно от анализа камеры: 160×120, Worker, не больше одного кадра в очереди.</span>
                  </li>
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {[
                  ["Рендер", `${Math.round(fps)} fps`],
                  ["Draw calls", `${calls}`],
                  ["Камера", info.running ? `${info.fps.toFixed(1)} Гц` : "off"],
                  ["Источник", source === "camera" ? "markers" : source === "gyro" ? "gyro" : "pointer"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-lg border border-white/[0.07] bg-white/[0.02] px-2.5 py-2">
                    <div className="text-[7px] uppercase tracking-[0.14em] text-fog/35">{label}</div>
                    <div className="tabular mt-1 font-mono text-[10px] text-cream/80">{value}</div>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-white/[0.07] p-3.5">
                <div className="flex items-center gap-2 text-[9px] font-medium text-fog/60">
                  <InfoIcon className="h-3.5 w-3.5 text-fog/45" />
                  qa / честные границы
                </div>
                <p className="mt-2 text-[8.5px] leading-[1.65] text-fog/40">
                  Синтетика проверяет математику и состояния, но не заменяет живую камеру. Полевой тест конкретной
                  модели телефона и очков не проводился. Разрешение камеры требует HTTPS или localhost.
                </p>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {["Implemented", "Synthetic QA", "Visual"].map((tag) => (
                    <span key={tag} className="rounded-full border border-white/[0.08] px-1.5 py-0.5 font-mono text-[7px] uppercase tracking-wider text-fog/40">{tag}</span>
                  ))}
                  <span className="rounded-full border border-gold/20 bg-gold/[0.05] px-1.5 py-0.5 font-mono text-[7px] uppercase tracking-wider text-gold/55">not device-tested</span>
                </div>
              </div>

              <button onClick={onClose} className="flex w-full items-center justify-center gap-2 rounded-full border border-white/12 bg-white/[0.035] py-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-cream/80 transition hover:border-aqua/25 hover:bg-aqua/[0.07]">
                <ArrowRight className="h-3.5 w-3.5 rotate-180" /> Сохранить и вернуться к рифу
              </button>
              <p className="text-center text-[8px] leading-relaxed text-fog/30">
                Сенсорный контур собран по подходу из игры про сладкие гонки:<br />только явные источники, честное удержание, без фальшивого автопилота.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
