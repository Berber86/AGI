import { useEffect, useRef, useState } from "react";
import type { CameraMarkerProvider } from "../lib/markerDriver";
import type { SpeciesId } from "../lib/species";
import { ReefWorld, type GazeSource, type GazeStatus, type Quality, type TargetUpdate, type WorldEventType } from "../game/ReefWorld";

interface Props {
  provider: CameraMarkerProvider;
  source: GazeSource;
  interactive: boolean;
  vr: boolean;
  quality: Quality;
  reducedMotion: boolean;
  ipdCm: number;
  discovered: SpeciesId[];
  onTarget: (target: TargetUpdate) => void;
  onHeading: (heading: number) => void;
  onDiscovery: (id: SpeciesId) => void;
  onEvent: (event: WorldEventType) => void;
  onStats: (stats: { fps: number; calls: number }) => void;
  onGazeStatus: (status: GazeStatus) => void;
  worldRef: React.MutableRefObject<ReefWorld | null>;
  onReady?: () => void;
}

export default function ReefCanvas({
  provider,
  source,
  interactive,
  vr,
  quality,
  reducedMotion,
  ipdCm,
  discovered,
  onTarget,
  onHeading,
  onDiscovery,
  onEvent,
  onStats,
  onGazeStatus,
  worldRef,
  onReady,
}: Props) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const callbacksRef = useRef({ onTarget, onHeading, onDiscovery, onEvent, onStats, onGazeStatus, onReady });
  const [error, setError] = useState<string | null>(null);
  callbacksRef.current = { onTarget, onHeading, onDiscovery, onEvent, onStats, onGazeStatus, onReady };

  useEffect(() => {
    if (!mountRef.current) return;
    let world: ReefWorld | null = null;
    try {
      world = new ReefWorld(
        mountRef.current,
        provider,
        {
          onTarget: (target) => callbacksRef.current.onTarget(target),
          onHeading: (heading) => callbacksRef.current.onHeading(heading),
          onDiscovery: (id) => callbacksRef.current.onDiscovery(id),
          onEvent: (event) => callbacksRef.current.onEvent(event),
          onStats: (stats) => callbacksRef.current.onStats(stats),
          onGazeStatus: (status) => callbacksRef.current.onGazeStatus(status),
        },
        {
          interactive,
          source,
          vr,
          ipdCm,
          quality,
          reducedMotion,
        }
      );
      worldRef.current = world;
      (window as unknown as { __REEF__?: ReefWorld }).__REEF__ = world;
      callbacksRef.current.onReady?.();
    } catch (err) {
      setError((err as Error)?.message || "WebGL недоступен");
    }
    return () => {
      world?.dispose();
      worldRef.current = null;
    };
    // Мир создаётся ровно один раз; все настройки обновляются ниже.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider]);

  useEffect(() => {
    worldRef.current?.setInteractive(interactive);
  }, [interactive, worldRef]);

  useEffect(() => {
    worldRef.current?.setSource(source);
  }, [source, worldRef]);

  useEffect(() => {
    worldRef.current?.setVr(vr);
  }, [vr, worldRef]);

  useEffect(() => {
    worldRef.current?.setQuality(quality);
  }, [quality, worldRef]);

  useEffect(() => {
    worldRef.current?.setReducedMotion(reducedMotion);
  }, [reducedMotion, worldRef]);

  useEffect(() => {
    worldRef.current?.setIpd(ipdCm);
  }, [ipdCm, worldRef]);

  useEffect(() => {
    worldRef.current?.setDiscovered(discovered);
  }, [discovered, worldRef]);

  return (
    <div ref={mountRef} className="absolute inset-0 h-full w-full overflow-hidden">
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-abyss px-8 text-center">
          <span className="eyebrow text-coral">WebGL недоступен</span>
          <p className="max-w-sm text-sm text-fog">
            Для наблюдения за рифом нужен браузер с аппаратным ускорением. Попробуйте открыть страницу в Chrome или Safari.
          </p>
          <span className="font-mono text-[10px] text-fog/50">{error}</span>
        </div>
      )}
    </div>
  );
}
