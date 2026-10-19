import { findSpecies, formatDiveTime, SPECIES, type Species, type SpeciesId } from "../lib/species";
import type { GazeSource, GazeStatus, TargetUpdate } from "../game/ReefWorld";
import {
  ArrowUpRight,
  CheckIcon,
  CompassIcon,
  EyeIcon,
  JournalIcon,
  MarkerIcon,
  PauseIcon,
  RotateIcon,
  ShellMark,
  SoundOff,
  SoundOn,
  SparkIcon,
  SpeciesGlyph,
  VrIcon,
} from "./icons";

interface Props {
  target: TargetUpdate | null;
  discovered: SpeciesId[];
  heading: number;
  diveTime: number;
  soundOn: boolean;
  onToggleSound: () => void;
  onPause: () => void;
  onOpenDriver: () => void;
  onOpenJournal: () => void;
  onExitVr: () => void;
  vrActive: boolean;
  source: GazeSource;
  gazeStatus: GazeStatus;
  fps: number;
  qualityLabel: string;
  whaleAlert: boolean;
  portrait: boolean;
}

const sourcePresentation: Record<GazeStatus, { label: string; detail: string; tone: string }> = {
  pointer: { label: "Ручной обзор", detail: "перетаскивание", tone: "aqua" },
  gyro: { label: "Гироскоп", detail: "датчик активен", tone: "aqua" },
  "gyro-wait": { label: "Гироскоп", detail: "нет данных — разрешите доступ", tone: "gold" },
  "camera-valid": { label: "Камера · пара", detail: "обе метки согласны", tone: "aqua" },
  "camera-single": { label: "Камера · одна метка", detail: "пара не подтверждена", tone: "gold" },
  "camera-held": { label: "Камера · удержание", detail: "метки вне кадра", tone: "gold" },
  "camera-lost": { label: "Камера · поиск", detail: "метки не видны", tone: "coral" },
  "camera-off": { label: "Камера выключена", detail: "откройте VR-драйвер", tone: "coral" },
  fusion: { label: "Гибрид · метки + гиро", detail: "метки правят центр", tone: "aqua" },
  "fusion-gyro": { label: "Гибрид · гироскоп", detail: "якорь меток не подтверждён — ведёт датчик", tone: "gold" },
  "fusion-camera": { label: "Гибрид · камера", detail: "гироскоп молчит — ведут метки", tone: "gold" },
  "fusion-wait": { label: "Гибрид · удержание", detail: "ждём подтверждённый источник", tone: "coral" },
};

const toneMap: Record<string, string> = {
  aqua: "bg-aqua shadow-[0_0_8px_#8ee4d4]",
  gold: "bg-gold shadow-[0_0_8px_#e8c98f]",
  coral: "bg-coral shadow-[0_0_8px_#ff8a66]",
};

const compassLabel = (heading: number) => {
  const dirs = ["С", "СВ", "В", "ЮВ", "Ю", "ЮЗ", "З", "СЗ"];
  return dirs[Math.round(heading / 45) % 8];
};

export default function HUD({
  target,
  discovered,
  heading,
  diveTime,
  soundOn,
  onToggleSound,
  onPause,
  onOpenDriver,
  onOpenJournal,
  onExitVr,
  vrActive,
  source,
  gazeStatus,
  fps,
  qualityLabel,
  whaleAlert,
  portrait,
}: Props) {
  const targetSpecies: Species | null = target?.id ? findSpecies(target.id) : null;
  const presentation = sourcePresentation[gazeStatus];
  const progress = target?.progress ?? 0;
  const remaining = SPECIES.filter((s) => !discovered.includes(s.id));
  const markerSources = source === "camera";

  if (vrActive) {
    return (
      <>
        <div className="pointer-events-none fixed inset-0 z-30">
          <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-black/60" />
          <div className="absolute inset-x-0 top-0 flex items-center justify-center pt-3">
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/35 px-3 py-1.5 text-[8px] font-semibold uppercase tracking-[0.18em] text-cream/80">
              <span className="h-1 w-1 animate-pulse rounded-full bg-aqua" />
              VR · {presentation.label} · {presentation.detail}
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-3 flex flex-col items-center gap-2">
            <div className="font-display text-[17px] text-cream/75">
              Тишина рифа <span className="mx-2 text-aqua/40">·</span> {formatDiveTime(diveTime)}
            </div>
            <div className="text-[8px] uppercase tracking-[0.16em] text-fog/50">
              снимите очки, чтобы выйти · Esc
            </div>
          </div>
        </div>
        <button
          onClick={onExitVr}
          className="btn-small fixed right-3 top-3 z-50 border-white/15 bg-black/40 text-[10px]"
        >
          Выйти из VR
        </button>
        {portrait && (
          <div className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-5 bg-[#02171a]/92 px-10 text-center backdrop-blur-xl">
            <div className="grid h-16 w-16 place-items-center rounded-2xl border border-aqua/20 bg-aqua/[0.05]">
              <RotateIcon className="h-8 w-8 text-aqua" />
            </div>
            <div>
              <div className="font-display text-3xl text-cream">Поверните телефон</div>
              <p className="mx-auto mt-3 max-w-xs text-[12px] leading-relaxed text-fog/70">
                Стереопара раскрывается в альбомной ориентации. После поворота мир разделится на два кадра для глаз.
              </p>
            </div>
            <button onClick={onExitVr} className="btn-ghost">
              Вернуться без очков
            </button>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <div className="hud-scrim" />
      <div className="pointer-events-none fixed inset-0 z-30 flex flex-col justify-between">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 px-4 pt-4 sm:px-6 sm:pt-5 lg:px-8">
          <div className="pointer-events-auto flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-abyss/35 backdrop-blur-md">
              <ShellMark className="h-8 w-8 text-aqua/85" />
            </div>
            <div className="hidden sm:block">
              <div className="text-[10px] font-semibold tracking-[0.27em] text-cream/90">PELAGIC EYE</div>
              <div className="mt-1 flex items-center gap-2 text-[8px] uppercase tracking-[0.17em] text-fog/55">
                <span className="h-1 w-1 rounded-full bg-aqua" />
                Коралловый сад · 18 м
              </div>
            </div>
            <div className="hidden h-7 w-px bg-white/10 sm:block" />
            <div className="hidden items-center gap-2 text-[9px] font-medium uppercase tracking-[0.14em] text-fog/60 md:flex">
              <span className="tabular text-cream/85">{formatDiveTime(diveTime)}</span>
              <span className="text-fog/30">/</span>
              <span>погружение 07</span>
            </div>
          </div>

          <div className="pointer-events-auto flex items-center gap-1.5 rounded-full border border-white/10 bg-abyss/35 p-1.5 backdrop-blur-md">
            <button
              onClick={onOpenDriver}
              className="flex items-center gap-2 rounded-full px-2.5 py-2 text-[9px] font-medium uppercase tracking-[0.1em] text-fog transition hover:bg-white/[0.05] hover:text-cream sm:px-3"
              title="VR-драйвер и источник взгляда"
            >
              <span className={`h-1.5 w-1.5 rounded-full ${toneMap[presentation.tone]}`} />
              <span className="hidden max-w-[150px] truncate sm:inline">{presentation.label}</span>
              <MarkerIcon className="h-3.5 w-3.5 sm:hidden" />
            </button>
            <div className="h-5 w-px bg-white/10" />
            <button
              onClick={onOpenJournal}
              className="relative flex items-center gap-1.5 rounded-full px-2.5 py-2 text-[9px] font-medium uppercase tracking-[0.1em] text-fog transition hover:bg-white/[0.05] hover:text-cream sm:px-3"
              title="Полевой журнал"
            >
              <JournalIcon className="h-3.5 w-3.5" />
              <span className="tabular text-cream/80">{discovered.length}/{SPECIES.length}</span>
            </button>
            <button
              onClick={onToggleSound}
              className="grid h-8 w-8 place-items-center rounded-full text-fog transition hover:bg-white/[0.06] hover:text-cream"
              aria-label={soundOn ? "Выключить звук" : "Включить звук"}
            >
              {soundOn ? <SoundOn className="h-3.5 w-3.5" /> : <SoundOff className="h-3.5 w-3.5" />}
            </button>
            <button
              onClick={onOpenDriver}
              className="hidden items-center gap-2 rounded-full bg-white/[0.07] px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.1em] text-cream transition hover:bg-aqua/15 sm:flex"
              title="Открыть настройки VR"
            >
              <VrIcon className="h-3.5 w-3.5 text-aqua" />
              VR
            </button>
            <button
              onClick={onPause}
              className="grid h-8 w-8 place-items-center rounded-full text-fog transition hover:bg-white/[0.06] hover:text-cream"
              aria-label="Пауза"
            >
              <PauseIcon className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Правая панель наблюдений */}
        <div className="pointer-events-auto absolute right-4 top-[86px] hidden w-[252px] flex-col gap-2.5 sm:top-[92px] lg:right-8 lg:flex">
          <div className="glass-soft rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <span className="eyebrow text-[8px] text-aqua/75">Полевые заметки</span>
              <span className="tabular text-[9px] text-fog/55">{discovered.length} / {SPECIES.length}</span>
            </div>
            <div className="mt-3 h-[3px] overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-aqua/80 to-aqua/30 transition-all duration-700"
                style={{ width: `${(discovered.length / SPECIES.length) * 100}%` }}
              />
            </div>
            <div className="mt-4 space-y-2.5">
              {remaining.slice(0, 2).map((species) => (
                <button
                  key={species.id}
                  onClick={onOpenJournal}
                  className="group flex w-full items-center gap-2.5 rounded-lg py-0.5 text-left"
                >
                  <span className="grid h-6 w-6 place-items-center rounded-md border border-white/[0.07] bg-white/[0.025] text-fog/55">
                    <SpeciesGlyph id={species.id} className="h-3.5 w-4" />
                  </span>
                  <span className="flex-1 truncate text-[10px] text-fog/65 transition group-hover:text-cream/90">{species.name}</span>
                  <span className="text-[8px] uppercase tracking-widest text-fog/30">найти</span>
                </button>
              ))}
              {remaining.length === 0 && (
                <div className="flex items-center gap-2 py-2 text-[10px] text-aqua/80">
                  <CheckIcon className="h-3.5 w-3.5" /> Все виды отмечены
                </div>
              )}
            </div>
            <div className="divider my-3" />
            <div className="flex items-start gap-2">
              <SparkIcon className="mt-px h-3 w-3 shrink-0 text-gold/70" />
              <p className="text-[9px] leading-[1.55] text-fog/55">
                Наведите центр взгляда на животное и удержите 1,6 с.
              </p>
            </div>
          </div>
        </div>

        {/* Прицел / фокус */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="relative flex h-[124px] w-[124px] items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-white/[0.13]" />
            <div className={`absolute inset-[9px] rounded-full border border-dashed ${targetSpecies ? "border-aqua/20" : "border-white/[0.07]"}`} />
            {[0, 90, 180, 270].map((angle) => (
              <span
                key={angle}
                className="absolute h-[5px] w-px bg-cream/40"
                style={{ transform: `rotate(${angle}deg) translateY(-62px)` }}
              />
            ))}
            {targetSpecies && (
              <svg viewBox="0 0 120 120" className="absolute inset-0 h-full w-full -rotate-90">
                <circle cx="60" cy="60" r="55" fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="1.5" />
                <circle
                  cx="60"
                  cy="60"
                  r="55"
                  fill="none"
                  stroke={target?.discovered ? "#e8c98f" : "#8ee4d4"}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 55}`}
                  strokeDashoffset={`${2 * Math.PI * 55 * (1 - progress)}`}
                  opacity={target?.discovered ? 0.55 : 0.95}
                  style={{ transition: "stroke-dashoffset 120ms linear" }}
                />
              </svg>
            )}
            <div className={`relative flex h-7 w-7 items-center justify-center rounded-full border ${targetSpecies ? "border-aqua/40 bg-aqua/[0.08]" : "border-white/15 bg-black/10"}`}>
              <span className={`h-[3px] w-[3px] rounded-full ${targetSpecies ? "bg-aqua shadow-[0_0_7px_#8ee4d4]" : "bg-cream/50"}`} />
              {targetSpecies && <span className="sonar-ring absolute inset-0 rounded-full border border-aqua/25" />}
            </div>
            {targetSpecies ? (
              <div className="absolute left-1/2 top-[calc(100%+14px)] w-[260px] -translate-x-1/2 text-center">
                <div className="text-[8px] font-semibold uppercase tracking-[0.22em] text-aqua/70">
                  {target?.discovered ? "вид в журнале" : progress > 0.05 ? `наблюдение ${Math.round(progress * 100)}%` : "объект в фокусе"}
                </div>
                <div className="font-display mt-1 text-[22px] leading-tight text-cream drop-shadow-[0_2px_12px_rgba(0,0,0,.6)]">
                  {targetSpecies.name}
                </div>
                <div className="mt-0.5 text-[9px] font-light uppercase tracking-[0.16em] text-fog/65">{targetSpecies.latin}</div>
              </div>
            ) : (
              <div className="absolute left-1/2 top-[calc(100%+16px)] w-[230px] -translate-x-1/2 text-center">
                <div className="text-[9px] font-medium uppercase tracking-[0.18em] text-cream/45">
                  {source === "pointer" ? "перетащите, чтобы осмотреться" : "ведите взглядом по рифу"}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Компас и подсказки */}
        <div className="flex items-end justify-between gap-4 px-4 pb-4 sm:px-6 sm:pb-5 lg:px-8">
          <div className="flex items-end gap-3 sm:gap-5">
            <div className="flex flex-col gap-1.5">
              <span className="text-[8px] font-semibold uppercase tracking-[0.2em] text-fog/40">глубина</span>
              <span className="tabular text-[20px] font-light leading-none text-cream/90">
                18.4<span className="ml-1 text-[9px] uppercase tracking-widest text-fog/50">м</span>
              </span>
            </div>
            <div className="hidden h-8 w-px bg-white/10 sm:block" />
            <div className="hidden flex-col gap-1.5 sm:flex">
              <span className="text-[8px] font-semibold uppercase tracking-[0.2em] text-fog/40">видимость</span>
              <span className="tabular text-[20px] font-light leading-none text-cream/90">
                32<span className="ml-1 text-[9px] uppercase tracking-widest text-fog/50">м</span>
              </span>
            </div>
            <div className="hidden h-8 w-px bg-white/10 md:block" />
            <div className="hidden flex-col gap-1.5 md:flex">
              <span className="text-[8px] font-semibold uppercase tracking-[0.2em] text-fog/40">источник</span>
              <span className="flex items-center gap-1.5 text-[10px] text-cream/80">
                <span className={`h-1.5 w-1.5 rounded-full ${toneMap[presentation.tone]}`} />
                {presentation.detail}
              </span>
            </div>
          </div>

          <div className="pointer-events-none absolute bottom-4 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1.5 sm:flex">
            <div className="flex items-center gap-2.5 text-[8px] uppercase tracking-[0.2em] text-fog/50">
              <span>курс</span>
              <span className="tabular text-[12px] font-medium text-cream/90">{Math.round(heading).toString().padStart(3, "0")}°</span>
              <span className="text-aqua/80">{compassLabel(heading)}</span>
            </div>
            <div className="relative h-4 w-[176px] overflow-hidden">
              <div className="absolute bottom-0 left-0 right-0 h-px bg-white/15" />
              {Array.from({ length: 13 }).map((_, i) => (
                <span
                  key={i}
                  className={`absolute bottom-0 w-px bg-cream/35 ${i % 3 === 0 ? "h-2" : "h-1"}`}
                  style={{ left: `${(i / 12) * 100}%` }}
                />
              ))}
              <span
                className="absolute bottom-0 h-2.5 w-px bg-aqua shadow-[0_0_8px_#8ee4d4]"
                style={{ left: `${Math.min(100, Math.max(0, heading))}%` }}
              />
            </div>
            <span className="flex items-center gap-1.5 text-[8px] uppercase tracking-[0.16em] text-fog/40">
              <CompassIcon className="h-3 w-3" /> курс наблюдения
            </span>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="hidden items-center gap-2 text-[8px] uppercase tracking-[0.13em] text-fog/40 sm:flex">
              <span className={`h-1 w-1 rounded-full ${toneMap[presentation.tone]}`} />
              {source === "fusion" ? "гибрид · камера + гироскоп" : markerSources ? "камера-метки" : source === "gyro" ? "гироскоп" : "мышь / касание"}
              <span className="text-fog/20">·</span>
              <span className="tabular">{Math.round(fps)} fps</span>
              <span className="text-fog/20">·</span>
              <span>{qualityLabel}</span>
            </div>
            <button
              onClick={onOpenDriver}
              className="pointer-events-auto flex items-center gap-2 rounded-full border border-white/10 bg-abyss/35 px-3 py-1.5 text-[8px] font-semibold uppercase tracking-[0.14em] text-fog/65 backdrop-blur transition hover:border-aqua/25 hover:text-cream"
            >
              <VrIcon className="h-3.5 w-3.5 text-aqua/80" />
              Войти в VR
            </button>
          </div>
        </div>
      </div>

      {whaleAlert && (
        <div className="pointer-events-none fixed left-1/2 top-[78px] z-40 -translate-x-1/2 sm:top-[86px]">
          <div className="anim-fade-up flex items-center gap-3 rounded-full border border-aqua/25 bg-[#072a2e]/80 py-2 pl-3 pr-5 shadow-[0_15px_40px_rgba(0,0,0,.3)] backdrop-blur-xl">
            <span className="relative grid h-7 w-7 place-items-center rounded-full bg-aqua/10">
              <span className="absolute inset-0 animate-ping rounded-full border border-aqua/20" />
              <EyeIcon className="h-3.5 w-3.5 text-aqua" />
            </span>
            <div>
              <div className="text-[9px] font-semibold uppercase tracking-[0.19em] text-aqua">Кит на подходе</div>
              <div className="text-[9px] text-fog/60">Оставайтесь неподвижны. Смотрите выше линии рифа.</div>
            </div>
            <ArrowUpRight className="h-4 w-4 text-aqua/70" />
          </div>
        </div>
      )}
    </>
  );
}
