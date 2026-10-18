import { useCallback, useEffect, useRef, useState } from "react";
import ReefCanvas from "./components/ReefCanvas";
import Lobby from "./components/Lobby";
import HUD from "./components/HUD";
import DriverWorkshop from "./components/DriverWorkshop";
import Journal from "./components/Journal";
import { CameraMarkerProvider } from "./lib/markerDriver";
import { OceanAudio } from "./lib/oceanAudio";
import { findSpecies, formatDiveTime, SPECIES, type SpeciesId } from "./lib/species";
import type { GazeSource, GazeStatus, Quality, TargetUpdate, WorldEventType } from "./game/ReefWorld";
import type { ReefWorld } from "./game/ReefWorld";
import { ArrowRight, CheckIcon, CloseIcon, EyeIcon, JournalIcon, ShellMark, SoundOff, SoundOn, SparkIcon, SpeciesGlyph, VrIcon } from "./components/icons";

const STORAGE_KEY = "pelagic-eye.discovered.v1";
const SETTINGS_KEY = "pelagic-eye.settings.v1";

type Screen = "lobby" | "dive";
type Modal = "driver" | "journal" | null;

interface SettingsRecord {
  ipd: number;
  quality: Quality;
  reducedMotion: boolean;
  soundOn: boolean;
  frugalMarkers: boolean;
}

function loadDiscovered(): SpeciesId[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const ids = new Set(SPECIES.map((s) => s.id));
    return parsed.filter((id): id is SpeciesId => typeof id === "string" && ids.has(id as SpeciesId));
  } catch {
    return [];
  }
}

function loadSettings(): SettingsRecord {
  const defaults: SettingsRecord = { ipd: 6.4, quality: "high", reducedMotion: false, soundOn: true, frugalMarkers: false };
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw) as Partial<SettingsRecord>;
    return {
      ipd: typeof parsed.ipd === "number" ? Math.min(16, Math.max(4, parsed.ipd)) : defaults.ipd,
      quality: parsed.quality === "balanced" ? "balanced" : "high",
      reducedMotion: !!parsed.reducedMotion,
      soundOn: parsed.soundOn !== false,
      frugalMarkers: !!parsed.frugalMarkers,
    };
  } catch {
    return defaults;
  }
}

function usePortrait() {
  const [portrait, setPortrait] = useState(() =>
    typeof window !== "undefined" ? window.innerHeight > window.innerWidth : false
  );
  useEffect(() => {
    const handler = () => setPortrait(window.innerHeight > window.innerWidth);
    window.addEventListener("resize", handler);
    window.addEventListener("orientationchange", handler);
    return () => {
      window.removeEventListener("resize", handler);
      window.removeEventListener("orientationchange", handler);
    };
  }, []);
  return portrait;
}

const initialSettings = loadSettings();

export default function App() {
  const [screen, setScreen] = useState<Screen>("lobby");
  const [modal, setModal] = useState<Modal>(null);
  const [paused, setPaused] = useState(false);
  const [discovered, setDiscovered] = useState<SpeciesId[]>(loadDiscovered);
  const [source, setSource] = useState<GazeSource>("pointer");
  const [vr, setVr] = useState(false);
  const [ipd, setIpd] = useState(initialSettings.ipd);
  const [quality, setQuality] = useState<Quality>(initialSettings.quality);
  const [reducedMotion, setReducedMotion] = useState(initialSettings.reducedMotion);
  const [soundOn, setSoundOn] = useState(initialSettings.soundOn);
  const [frugalMarkers, setFrugalMarkers] = useState(initialSettings.frugalMarkers);
  const [target, setTarget] = useState<TargetUpdate | null>(null);
  const [heading, setHeading] = useState(0);
  const [diveTime, setDiveTime] = useState(0);
  const [fps, setFps] = useState(60);
  const [calls, setCalls] = useState(0);
  const [gazeStatus, setGazeStatus] = useState<GazeStatus>("pointer");
  const [whaleAlert, setWhaleAlert] = useState(false);
  const [toast, setToast] = useState<SpeciesId | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [hinted, setHinted] = useState(false);
  const portrait = usePortrait();

  const [provider] = useState(() => new CameraMarkerProvider());
  const audioRef = useRef<OceanAudio | null>(null);
  const worldRef = useRef<ReefWorld | null>(null);
  const whaleTimerRef = useRef<number | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  if (!audioRef.current) audioRef.current = new OceanAudio();

  const interactive = screen === "dive";

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(discovered));
  }, [discovered]);

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({ ipd, quality, reducedMotion, soundOn, frugalMarkers }));
  }, [ipd, quality, reducedMotion, soundOn, frugalMarkers]);

  useEffect(() => {
    provider.setFrugal(frugalMarkers);
  }, [provider, frugalMarkers]);

  useEffect(() => {
    return () => {
      provider.dispose();
      audioRef.current?.dispose();
      if (whaleTimerRef.current) window.clearTimeout(whaleTimerRef.current);
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    };
  }, [provider]);

  useEffect(() => {
    if (!soundOn) {
      audioRef.current?.setEnabled(false);
    } else if (audioRef.current?.isEnabled === false) {
      audioRef.current?.setEnabled(true);
    }
  }, [soundOn]);

  useEffect(() => {
    if (screen !== "dive") return;
    const id = window.setInterval(() => setDiveTime((time) => time + 1), 1000);
    return () => window.clearInterval(id);
  }, [screen]);

  useEffect(() => {
    if (screen !== "dive") return;
    const id = window.setTimeout(() => setHinted(true), 6500);
    return () => window.clearTimeout(id);
  }, [screen]);

  // Клавиатурные выходы и быстрые панели.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const tag = (event.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (event.key === "Escape") {
        if (modal) setModal(null);
        else if (paused) setPaused(false);
        else if (vr) setVr(false);
        else if (screen === "dive") setPaused(true);
        return;
      }
      if (screen !== "dive" || modal) return;
      if (event.key === "j" || event.key === "J" || event.key === "о" || event.key === "О") setModal("journal");
      if (event.key === "v" || event.key === "V" || event.key === "м" || event.key === "М") setModal("driver");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [screen, modal, paused, vr]);

  const startDive = useCallback(async () => {
    setScreen("dive");
    setModal(null);
    setPaused(false);
    setTransitioning(true);
    setHinted(false);
    setDiveTime(0);
    worldRef.current?.setInteractive(true);
    if (soundOn) {
      await audioRef.current?.start();
      audioRef.current?.setEnabled(true);
    }
    window.setTimeout(() => setTransitioning(false), 1900);
  }, [soundOn]);

  const toggleSound = useCallback(async () => {
    if (!soundOn) {
      setSoundOn(true);
      await audioRef.current?.start();
      audioRef.current?.setEnabled(true);
    } else {
      setSoundOn(false);
      audioRef.current?.setEnabled(false);
    }
  }, [soundOn]);

  const handleSourceChange = useCallback(
    (next: GazeSource) => {
      setSource(next);
      if (next === "camera") {
        const info = provider.getInfo();
        // Если уже идёт QA-подача или живая камера — не перезапускаем её.
        // Раньше переключение источника могло оборвать рабочий поток.
        if (!info.running) void provider.startCamera();
      } else if (provider.getInfo().running) {
        provider.stop();
      }
    },
    [provider]
  );

  const requestGyro = useCallback(async () => {
    if (!worldRef.current) return { ok: false, message: "Сцена ещё загружается." };
    return worldRef.current.requestGyro();
  }, []);

  const calibrateGyro = useCallback(() => {
    worldRef.current?.calibrateGyro();
    worldRef.current?.recenterView();
  }, []);

  const showToast = useCallback((id: SpeciesId) => {
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    setToast(id);
    setToastVisible(true);
    toastTimerRef.current = window.setTimeout(() => {
      setToastVisible(false);
      toastTimerRef.current = window.setTimeout(() => setToast(null), 420);
    }, 7200);
  }, []);

  const handleDiscovery = useCallback(
    (id: SpeciesId) => {
      setDiscovered((current) => (current.includes(id) ? current : [...current, id]));
      showToast(id);
      audioRef.current?.playBubble();
    },
    [showToast]
  );

  const handleWorldEvent = useCallback(
    (event: WorldEventType) => {
      if (event === "whale-near") {
        setWhaleAlert(true);
        if (whaleTimerRef.current) window.clearTimeout(whaleTimerRef.current);
        whaleTimerRef.current = window.setTimeout(() => setWhaleAlert(false), 12000);
      }
      if (event === "whale-far") {
        setWhaleAlert(false);
        if (whaleTimerRef.current) window.clearTimeout(whaleTimerRef.current);
      }
      if (event === "whale-pass") {
        audioRef.current?.playWhaleCall();
      }
      if (event === "bubble") audioRef.current?.playBubble();
    },
    []
  );

  const handleHeading = useCallback((value: number) => setHeading(value), []);
  const handleTarget = useCallback((value: TargetUpdate) => {
    setTarget((current) => {
      if (!current && !value.id) return current;
      if (current && value.id === current.id && Math.abs(value.progress - current.progress) < 0.012 && value.discovered === current.discovered) {
        return current;
      }
      return value;
    });
  }, []);
  const handleStats = useCallback((stats: { fps: number; calls: number }) => {
    setFps(stats.fps);
    setCalls(stats.calls);
  }, []);
  const handleGazeStatus = useCallback((status: GazeStatus) => setGazeStatus(status), []);

  const enterVr = useCallback(() => {
    setModal(null);
    setPaused(false);
    setVr(true);
    setScreen("dive");
    worldRef.current?.setInteractive(true);
  }, []);

  const exitVr = useCallback(() => {
    setVr(false);
    if (document.fullscreenElement) document.exitFullscreen().catch(() => undefined);
    try {
      (window.screen.orientation as ScreenOrientation & { unlock?: () => void }).unlock?.();
    } catch {
      /* no-op */
    }
  }, []);

  const backToSurface = useCallback(() => {
    setScreen("lobby");
    setPaused(false);
    setVr(false);
    setModal(null);
    setTarget(null);
    setWhaleAlert(false);
    worldRef.current?.setInteractive(false);
    if (document.fullscreenElement) document.exitFullscreen().catch(() => undefined);
  }, []);

  const resetJournal = useCallback(() => {
    setDiscovered([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const driverOnline =
    (source === "camera" && provider.getInfo().running) ||
    gazeStatus === "gyro" ||
    gazeStatus === "camera-valid" ||
    gazeStatus === "camera-single";
  const driverLabel =
    source === "camera"
      ? provider.getInfo().running
        ? "в эфире"
        : "включить"
      : source === "gyro"
        ? "гироскоп"
        : "настроить";
  const qualityLabel = quality === "high" ? "кинематограф" : "баланс";

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-abyss text-cream">
      <div className="absolute inset-0">
        <ReefCanvas
          provider={provider}
          source={source}
          interactive={interactive}
          vr={vr}
          quality={quality}
          reducedMotion={reducedMotion}
          ipdCm={ipd}
          discovered={discovered}
          onTarget={handleTarget}
          onHeading={handleHeading}
          onDiscovery={handleDiscovery}
          onEvent={handleWorldEvent}
          onStats={handleStats}
          onGazeStatus={handleGazeStatus}
          worldRef={worldRef}
        />
      </div>

      {screen === "lobby" && (
        <Lobby
          onStart={startDive}
          onOpenDriver={() => setModal("driver")}
          onOpenJournal={() => setModal("journal")}
          soundOn={soundOn}
          onToggleSound={toggleSound}
          discovered={discovered}
          driverLabel={driverLabel}
          driverOnline={driverOnline}
        />
      )}

      {screen === "dive" && (
        <HUD
          target={target}
          discovered={discovered}
          heading={heading}
          diveTime={diveTime}
          soundOn={soundOn}
          onToggleSound={toggleSound}
          onPause={() => setPaused(true)}
          onOpenDriver={() => setModal("driver")}
          onOpenJournal={() => setModal("journal")}
          onExitVr={exitVr}
          vrActive={vr}
          source={source}
          gazeStatus={gazeStatus}
          fps={fps}
          qualityLabel={qualityLabel}
          whaleAlert={whaleAlert}
          portrait={portrait}
        />
      )}

      {screen === "dive" && !hinted && !paused && !modal && !vr && (
        <div className="pointer-events-none fixed bottom-[126px] left-1/2 z-40 hidden -translate-x-1/2 sm:block">
          <div className="anim-fade-in flex items-center gap-2 rounded-full border border-white/10 bg-abyss/35 px-3.5 py-2 text-[9px] font-medium uppercase tracking-[0.15em] text-cream/65 backdrop-blur">
            <EyeIcon className="h-3 w-3 text-aqua/80" />
            {source === "camera"
              ? "ведите головой · метки в кадре"
              : source === "gyro"
                ? "поворачивайте телефон, чтобы осмотреться"
                : "перетащите сцену, чтобы осмотреться"}
          </div>
        </div>
      )}

      {toast && (
        <div
          className={`pointer-events-auto fixed bottom-[92px] left-4 z-50 w-[min(330px,calc(100vw-32px))] transition-all duration-400 sm:left-6 ${toastVisible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}
        >
          <NewDiscovery
            id={toast}
            count={discovered.length}
            onClose={() => {
              setToastVisible(false);
              window.setTimeout(() => setToast(null), 320);
            }}
            onOpen={() => {
              setModal("journal");
              setToastVisible(false);
            }}
          />
        </div>
      )}

      {modal === "driver" && (
        <DriverWorkshop
          provider={provider}
          source={source}
          onSourceChange={handleSourceChange}
          vr={vr}
          onEnterVr={enterVr}
          onExitVr={exitVr}
          ipd={ipd}
          onIpdChange={setIpd}
          quality={quality}
          onQualityChange={setQuality}
          reducedMotion={reducedMotion}
          onReducedMotionChange={setReducedMotion}
          frugalMarkers={frugalMarkers}
          onFrugalMarkersChange={setFrugalMarkers}
          onRequestGyro={requestGyro}
          onCalibrateGyro={calibrateGyro}
          gazeStatus={gazeStatus}
          onClose={() => setModal(null)}
          fps={fps}
          calls={calls}
        />
      )}

      {modal === "journal" && <Journal discovered={discovered} onClose={() => setModal(null)} onReset={resetJournal} />}

      {paused && screen === "dive" && !modal && (
        <PauseMenu
          diveTime={diveTime}
          discovered={discovered}
          soundOn={soundOn}
          onToggleSound={toggleSound}
          quality={quality}
          onQualityChange={setQuality}
          reducedMotion={reducedMotion}
          onReducedMotionChange={setReducedMotion}
          onResume={() => setPaused(false)}
          onJournal={() => setModal("journal")}
          onDriver={() => setModal("driver")}
          onSurface={backToSurface}
        />
      )}

      {transitioning && (
        <div className="pointer-events-none fixed inset-0 z-[65] flex items-center justify-center bg-[#021417] animate-[curtain_1.9s_ease-in-out_forwards]">
          <div className="flex flex-col items-center gap-5">
            <ShellMark className="h-12 w-12 animate-pulse text-aqua/80" />
            <div className="text-center">
              <div className="eyebrow text-aqua/70">погружение 07</div>
              <div className="font-display mt-2 text-4xl text-cream">18 метров тишины</div>
            </div>
            <div className="h-px w-16 bg-aqua/30" />
            <div className="text-[8px] uppercase tracking-[0.28em] text-fog/50">дышите ровно · смотрите</div>
          </div>
        </div>
      )}

      {screen === "lobby" && <div className="grain" />}
      {!vr && <div className="vignette" />}
    </div>
  );
}

function NewDiscovery({
  id,
  count,
  onClose,
  onOpen,
}: {
  id: SpeciesId;
  count: number;
  onClose: () => void;
  onOpen: () => void;
}) {
  const species = findSpecies(id);
  const rare = species.rarity === "rare" || species.rarity === "legendary";
  return (
    <div className="glass relative overflow-hidden rounded-2xl p-4 shadow-[0_20px_60px_rgba(0,0,0,.35)]">
      <div
        className="pointer-events-none absolute -right-3 -top-3 opacity-[0.08]"
        style={{ color: species.accent }}
      >
        <SpeciesGlyph id={id} className="h-24 w-36" />
      </div>
      <div className="flex items-start justify-between">
        <span className={`eyebrow flex items-center gap-1.5 ${rare ? "text-gold" : "text-aqua"}`}>
          {rare ? <SparkIcon className="h-3 w-3" /> : <CheckIcon className="h-3 w-3" />}
          {rare ? "редкая встреча" : "новое открытие"}
        </span>
        <button onClick={onClose} aria-label="Скрыть открытие" className="text-fog/40 transition hover:text-cream">
          <CloseIcon className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="mt-2.5 flex items-center gap-3">
        <div
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full border"
          style={{ borderColor: `${species.accent}40`, color: species.accent, background: `${species.accent}0d` }}
        >
          <SpeciesGlyph id={id} className="h-6 w-8" />
        </div>
        <div>
          <div className="font-display text-[22px] leading-tight text-cream">{species.name}</div>
          <div className="text-[8px] uppercase tracking-[0.14em] text-fog/50">{species.latin}</div>
        </div>
      </div>
      <p className="mt-2.5 line-clamp-2 text-[9.5px] leading-relaxed text-fog/65">{species.note}</p>
      <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-2.5">
        <span className="text-[8px] uppercase tracking-[0.13em] text-fog/40">
          {count} / {SPECIES.length} в журнале · {formatDiveTime(0).slice(3, 5)} сек взгляда
        </span>
        <button onClick={onOpen} className="flex items-center gap-1.5 text-[8px] font-semibold uppercase tracking-[0.12em] text-aqua/85 transition hover:text-aqua">
          <JournalIcon className="h-3 w-3" /> запись
          <ArrowRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}

function PauseMenu({
  diveTime,
  discovered,
  soundOn,
  onToggleSound,
  quality,
  onQualityChange,
  reducedMotion,
  onReducedMotionChange,
  onResume,
  onJournal,
  onDriver,
  onSurface,
}: {
  diveTime: number;
  discovered: SpeciesId[];
  soundOn: boolean;
  onToggleSound: () => void;
  quality: Quality;
  onQualityChange: (q: Quality) => void;
  reducedMotion: boolean;
  onReducedMotionChange: (v: boolean) => void;
  onResume: () => void;
  onJournal: () => void;
  onDriver: () => void;
  onSurface: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#011013]/65 px-4 backdrop-blur-xl">
      <div className="glass anim-fade-up w-full max-w-[520px] overflow-hidden rounded-[24px]">
        <div className="relative border-b border-white/10 px-6 py-5">
          <div className="pointer-events-none absolute -right-8 -top-10 h-40 w-40 rounded-full bg-aqua/[0.07] blur-3xl" />
          <div className="flex items-center justify-between">
            <span className="eyebrow flex items-center gap-2 text-aqua/75">
              <span className="h-1 w-1 rounded-full bg-aqua" /> погружение приостановлено
            </span>
            <span className="tabular font-mono text-[10px] text-fog/50">{formatDiveTime(diveTime)}</span>
          </div>
          <h2 className="font-display mt-2 text-[36px] leading-none text-cream">Вдох. Пауза.</h2>
          <p className="mt-2 max-w-[340px] text-[10px] leading-relaxed text-fog/55">
            Риф остаётся на месте. Ничего не уплывёт: время под водой идёт иначе.
          </p>
        </div>
        <div className="space-y-4 px-6 py-5">
          <button onClick={onResume} className="btn-primary w-full !justify-between">
            <span>Вернуться к рифу</span>
            <ArrowRight className="h-4 w-4" />
          </button>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={onJournal} className="btn-ghost !justify-start">
              <JournalIcon className="h-4 w-4 text-aqua/80" /> Журнал
              <span className="ml-auto tabular text-[9px] text-fog/45">{discovered.length}/{SPECIES.length}</span>
            </button>
            <button onClick={onDriver} className="btn-ghost !justify-start">
              <VrIcon className="h-4 w-4 text-aqua/80" /> VR-драйвер
            </button>
          </div>
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-medium text-cream/80">Звук океана</span>
              <button onClick={onToggleSound} className="flex items-center gap-1.5 text-[9px] uppercase tracking-[0.1em] text-fog/55 transition hover:text-cream">
                {soundOn ? <SoundOn className="h-3.5 w-3.5 text-aqua" /> : <SoundOff className="h-3.5 w-3.5" />}
                {soundOn ? "вкл" : "выкл"}
              </button>
            </div>
            <div className="my-3 h-px bg-white/[0.07]" />
            <div className="flex items-center justify-between gap-4">
              <span className="text-[10px] font-medium text-cream/80">Мягкое покачивание</span>
              <button
                onClick={() => onReducedMotionChange(!reducedMotion)}
                className={`relative h-4 w-7 rounded-full transition ${reducedMotion ? "bg-aqua/80" : "bg-white/15"}`}
                aria-label="Переключить покачивание камеры"
              >
                <span className={`absolute top-0.5 h-3 w-3 rounded-full bg-cream transition-all ${reducedMotion ? "left-3.5" : "left-0.5"}`} />
              </button>
            </div>
            <div className="my-3 h-px bg-white/[0.07]" />
            <div className="flex items-center justify-between gap-4">
              <span className="text-[10px] font-medium text-cream/80">Качество</span>
              <div className="flex rounded-full border border-white/10 p-0.5">
                {(["high", "balanced"] as Quality[]).map((value) => (
                  <button
                    key={value}
                    onClick={() => onQualityChange(value)}
                    className={`rounded-full px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.08em] transition ${quality === value ? "bg-white/[0.12] text-cream" : "text-fog/45"}`}
                  >
                    {value === "high" ? "Кино" : "Баланс"}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <button onClick={onSurface} className="flex w-full items-center justify-center gap-2 py-2 text-[9px] font-medium uppercase tracking-[0.16em] text-fog/45 transition hover:text-coral/80">
            <ArrowRight className="h-3.5 w-3.5 rotate-[-90deg]" /> вернуться на поверхность
          </button>
        </div>
      </div>
    </div>
  );
}
