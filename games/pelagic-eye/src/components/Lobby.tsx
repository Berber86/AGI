import { SPECIES } from "../lib/species";
import type { SpeciesId } from "../lib/species";
import {
  ArrowRight,
  ArrowUpRight,
  CameraIcon,
  DiveIcon,
  EyeIcon,
  GyroIcon,
  JournalIcon,
  MarkerIcon,
  ShellMark,
  SoundOff,
  SoundOn,
  SparkIcon,
  SpeciesGlyph,
  VrIcon,
} from "./icons";

interface Props {
  onStart: () => void;
  onOpenDriver: () => void;
  onOpenJournal: () => void;
  soundOn: boolean;
  onToggleSound: () => void;
  discovered: SpeciesId[];
  driverLabel: string;
  driverOnline: boolean;
}

const liveSpecies = [
  { id: "clownfish" as SpeciesId, note: "в актинии · 1.4 м" },
  { id: "blue-tang" as SpeciesId, note: "стая · 3.3 м" },
  { id: "whale" as SpeciesId, note: "миграция · 12 м" },
];

export default function Lobby({
  onStart,
  onOpenDriver,
  onOpenJournal,
  soundOn,
  onToggleSound,
  discovered,
  driverLabel,
  driverOnline,
}: Props) {
  return (
    <div className="absolute inset-0 z-30 overflow-y-auto overflow-x-hidden scroll-thin">
      <div className="lobby-scrim" />
      {/* Верхняя панель */}
      <header className="relative z-40 flex items-center justify-between gap-6 px-5 pb-5 pt-5 sm:px-8 lg:px-12 lg:pt-7">
        <div className="flex items-center gap-3.5">
          <ShellMark className="h-10 w-10 text-aqua/90" />
          <div className="leading-none">
            <div className="text-[13px] font-semibold tracking-[0.3em] text-cream">PELAGIC EYE</div>
            <div className="mt-1.5 text-[8px] font-medium uppercase tracking-[0.28em] text-fog/65">
              Подводная обсерватория
            </div>
          </div>
        </div>

        <nav className="hidden items-center gap-1 rounded-full border border-white/10 bg-abyss/30 px-1.5 py-1.5 backdrop-blur-xl md:flex">
          <button className="flex items-center gap-2 rounded-full bg-cream/[0.08] px-4 py-2 text-[11px] font-medium text-cream">
            <span className="h-1 w-1 rounded-full bg-aqua" />
            Погружение
          </button>
          <button
            onClick={onOpenJournal}
            className="flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-medium text-fog transition hover:text-cream"
          >
            <JournalIcon className="h-3.5 w-3.5" />
            Полевой журнал
          </button>
          <button
            onClick={onOpenDriver}
            className="flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-medium text-fog transition hover:text-cream"
          >
            <VrIcon className="h-4 w-4" />
            VR-драйвер
          </button>
        </nav>

        <div className="flex items-center gap-2.5">
          <div className="hidden items-center gap-2 rounded-full border border-aqua/15 bg-aqua/[0.06] px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.17em] text-aqua/90 sm:flex">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-aqua opacity-50" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-aqua" />
            </span>
            Риф в эфире
          </div>
          <button
            onClick={onToggleSound}
            aria-label={soundOn ? "Выключить звук" : "Включить звук"}
            className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.035] text-cream/80 transition hover:border-aqua/30 hover:text-cream"
          >
            {soundOn ? <SoundOn className="h-4 w-4" /> : <SoundOff className="h-4 w-4" />}
          </button>
          <button
            onClick={onOpenJournal}
            aria-label="Открыть журнал"
            className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.035] text-cream/80 transition hover:border-aqua/30 hover:text-cream md:hidden"
          >
            <JournalIcon className="h-4 w-4" />
          </button>
        </div>
      </header>

      <main className="relative z-40 mx-auto flex min-h-[calc(100%-92px)] w-full max-w-[1560px] flex-col justify-between px-5 pb-5 sm:px-8 lg:px-12 lg:pb-8">
        <div className="grid flex-1 grid-cols-1 items-start gap-8 pt-8 sm:pt-12 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-14 lg:pt-[8vh]">
          <div className="max-w-[690px]">
            <div
              className="anim-fade-up flex flex-wrap items-center gap-3 text-[9px] font-semibold uppercase tracking-[0.25em] text-aqua/85"
              style={{ animationDelay: "60ms" }}
            >
              <span className="h-px w-8 bg-aqua/50" />
              Экспедиция 07
              <span className="h-0.5 w-0.5 rounded-full bg-fog/50" />
              Коралловый сад
              <span className="h-0.5 w-0.5 rounded-full bg-fog/50" />
              Тихий океан
            </div>

            <h1
              className="anim-fade-up font-display mt-5 text-[clamp(3.65rem,7.6vw,7rem)] leading-[0.87] text-cream"
              style={{ animationDelay: "140ms" }}
            >
              Тишина
              <br />
              <span className="relative ml-[0.07em] inline-block italic text-[#cdeee5]">
                рифа
                <span className="absolute -bottom-2 left-[0.1em] h-px w-[74%] bg-gradient-to-r from-aqua/60 to-transparent" />
              </span>
              <span className="ml-[0.08em] font-sans text-[0.12em] font-light not-italic tracking-[0.1em] align-super text-aqua/60">
                18&thinsp;м
              </span>
            </h1>

            <p
              className="anim-fade-up mt-7 max-w-[410px] text-[13.5px] font-light leading-[1.8] text-[#d5e5de]/85 sm:text-[14.5px]"
              style={{ animationDelay: "230ms" }}
            >
              Здесь не нужно плыть. Опуститесь на дно, отыщите героев среди кораллов и
              дождитесь кита. Один взгляд — одно открытие.
            </p>

            <div
              className="anim-fade-up mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center"
              style={{ animationDelay: "320ms" }}
            >
              <button onClick={onStart} className="btn-primary sweep group w-full overflow-hidden sm:w-auto">
                <span className="relative z-10">
                  {discovered.length ? "Продолжить погружение" : "Начать погружение"}
                </span>
                <span className="relative z-10 grid h-6 w-6 place-items-center rounded-full bg-[#0a2c30] text-cream transition group-hover:rotate-[-15deg]">
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </button>
              <button onClick={onOpenDriver} className="btn-ghost group w-full sm:w-auto">
                <VrIcon className="h-4 w-4 text-aqua/90" />
                <span>Режим линзовых очков</span>
                <ArrowUpRight className="h-3.5 w-3.5 text-fog/60 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </button>
            </div>

            <div
              className="anim-fade-up mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-[10px] font-medium tracking-[0.02em] text-fog/60"
              style={{ animationDelay: "420ms" }}
            >
              <span className="flex items-center gap-2">
                <EyeIcon className="h-3.5 w-3.5 text-aqua/70" /> Только взгляд — без движения в мире
              </span>
              <span className="hidden h-3 w-px bg-white/10 sm:block" />
              <span>Стерео · метки · гироскоп</span>
            </div>

            <div
              className="anim-fade-in mt-12 flex max-w-[620px] flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between"
              style={{ animationDelay: "600ms" }}
            >
              <div className="flex items-center gap-4">
                <div className="flex -space-x-1.5">
                  {SPECIES.slice(0, 4).map((species) => (
                    <span
                      key={species.id}
                      className="grid h-7 w-7 place-items-center rounded-full border border-white/10 bg-[#082b2f]"
                      style={{ color: species.accent }}
                    >
                      <SpeciesGlyph id={species.id} className="h-3.5 w-4" />
                    </span>
                  ))}
                </div>
                <div className="text-[10px] leading-relaxed text-fog/65">
                  <span className="text-cream/90">{discovered.length} из {SPECIES.length}</span> видов уже в журнале
                  <br />
                  <span className="text-fog/45">восемь историй одного рифа</span>
                </div>
              </div>
              <button
                onClick={onOpenJournal}
                className="group flex items-center gap-1.5 self-start text-[10px] font-semibold uppercase tracking-[0.16em] text-aqua/80 transition hover:text-aqua sm:self-auto"
              >
                Открыть журнал
                <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>

          {/* Правая колонка с полевыми данными */}
          <div className="hidden flex-col gap-3 lg:flex">
            <div
              className="glass anim-fade-up rounded-2xl p-5"
              style={{ animationDelay: "380ms" }}
            >
              <div className="flex items-center justify-between">
                <span className="eyebrow text-aqua/80">Сейчас на рифе</span>
                <span className="flex items-center gap-1.5 text-[9px] font-medium uppercase tracking-[0.16em] text-aqua/70">
                  <span className="h-1 w-1 rounded-full bg-aqua shadow-[0_0_8px_#8ee4d4]" />
                  live
                </span>
              </div>
              <div className="mt-4 space-y-0.5">
                {liveSpecies.map((entry, index) => {
                  const species = SPECIES.find((s) => s.id === entry.id)!;
                  return (
                    <div
                      key={entry.id}
                      className="group flex items-center gap-3 rounded-xl px-2 py-2.5 transition hover:bg-white/[0.035]"
                    >
                      <span
                        className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/[0.07] bg-white/[0.025]"
                        style={{ color: species.accent }}
                      >
                        <SpeciesGlyph id={species.id} className="h-5 w-6" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[11px] font-medium text-cream/90">{species.name}</div>
                        <div className="mt-0.5 text-[9px] uppercase tracking-[0.1em] text-fog/50">{entry.note}</div>
                      </div>
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${index === 2 ? "bg-coral/80" : "bg-aqua/70"}`}
                      />
                    </div>
                  );
                })}
              </div>
              <div className="divider my-3" />
              <div className="flex items-center justify-between text-[9px] uppercase tracking-[0.13em] text-fog/50">
                <span>миграция кита</span>
                <span className="text-coral/80">ожидается</span>
              </div>
            </div>

            <button
              onClick={onOpenDriver}
              className="glass anim-fade-up group rounded-2xl p-5 text-left transition hover:border-aqua/25"
              style={{ animationDelay: "470ms" }}
            >
              <div className="flex items-start justify-between">
                <span className="eyebrow text-aqua/80">VR-режим</span>
                <div className="flex items-center gap-1.5">
                  <span className={`h-1.5 w-1.5 rounded-full ${driverOnline ? "bg-aqua shadow-[0_0_8px_#8ee4d4]" : "bg-fog/35"}`} />
                  <span className="text-[9px] font-medium uppercase tracking-[0.12em] text-fog/65">
                    {driverOnline ? "подключён" : "готов"}
                  </span>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-4">
                <div className="relative grid h-14 w-[74px] shrink-0 place-items-center rounded-xl border border-aqua/15 bg-aqua/[0.04]">
                  <VrIcon className="h-8 w-8 text-aqua/85" strokeWidth={1} />
                  <span className="absolute -left-1 top-2 h-2.5 w-1.5 rounded-[1px] bg-[#d6336c]" />
                  <span className="absolute -right-1 top-2 h-2.5 w-1.5 rounded-[1px] bg-[#f15a24]" />
                </div>
                <div>
                  <div className="font-display text-[20px] leading-tight text-cream">Линзовые очки</div>
                  <div className="mt-1 text-[10px] leading-relaxed text-fog/65">
                    Стереопара и взгляд по камере-меткам
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
                <span className="flex items-center gap-3 text-[9px] text-fog/55">
                  <span className="flex items-center gap-1.5">
                    <CameraIcon className="h-3 w-3" /> метки
                  </span>
                  <span className="flex items-center gap-1.5">
                    <GyroIcon className="h-3 w-3" /> гироскоп
                  </span>
                </span>
                <span className="flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-aqua/80">
                  {driverLabel}
                  <ArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
                </span>
              </div>
            </button>

            <div className="anim-fade-up mt-auto flex items-start gap-2.5 px-2 pt-3" style={{ animationDelay: "560ms" }}>
              <SparkIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold/60" />
              <p className="text-[10px] font-light leading-relaxed text-fog/55">
                Полевая заметка: вдох — 4 секунды, выдох — 6. Не тянитесь к рыбам. Они подойдут сами.
              </p>
            </div>
          </div>
        </div>

        {/* Нижняя полоса данных */}
        <div className="anim-fade-in mt-10 lg:mt-6" style={{ animationDelay: "520ms" }}>
          <div className="flex flex-col gap-4 border-t border-white/[0.13] py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 sm:flex sm:items-center sm:gap-0">
              {[
                ["Глубина", "18.4", "м"],
                ["Видимость", "32", "м"],
                ["Вода", "+24", "°C"],
                ["Течение", "0.3", "узла"],
              ].map(([label, value, unit], index) => (
                <div key={label} className={`flex flex-col gap-1 sm:min-w-[110px] sm:border-l sm:border-white/10 sm:pl-5 ${index === 0 ? "sm:border-l-0 sm:pl-0" : ""}`}>
                  <span className="text-[8px] font-semibold uppercase tracking-[0.18em] text-fog/45">{label}</span>
                  <span className="tabular text-[16px] font-light text-cream/90">
                    {value}<span className="ml-1 text-[9px] uppercase tracking-widest text-fog/50">{unit}</span>
                  </span>
                </div>
              ))}
            </div>
            <div className="flex flex-col items-start gap-3 text-[9px] uppercase tracking-[0.14em] text-fog/45 sm:flex-row sm:items-center sm:gap-5">
              <div className="flex items-center gap-2.5">
                <span className="flex items-center gap-1.5"><MarkerIcon className="h-3 w-3 text-[#d6336c]" /> левая метка</span>
                <span className="flex items-center gap-1.5"><MarkerIcon className="h-3 w-3 text-[#f15a24]" /> правая метка</span>
              </div>
              <span className="hidden h-3 w-px bg-white/15 sm:block" />
              <span className="flex items-center gap-1.5">
                <DiveIcon className="h-3.5 w-3.5 text-aqua/60" /> 08° 32′ S · 119° 04′ E
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
