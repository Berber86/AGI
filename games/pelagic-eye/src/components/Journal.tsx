import { useState } from "react";
import { RARITY_LABEL, SPECIES, type SpeciesId } from "../lib/species";
import {
  ArrowRight,
  CheckIcon,
  CloseIcon,
  DiveIcon,
  EyeIcon,
  InfoIcon,
  JournalIcon,
  ShellMark,
  SparkIcon,
  SpeciesGlyph,
  WaveIcon,
} from "./icons";

interface Props {
  discovered: SpeciesId[];
  onClose: () => void;
  onReset: () => void;
}

export default function Journal({ discovered, onClose, onReset }: Props) {
  const [filter, setFilter] = useState<"all" | "found" | "missing">("all");
  const foundCount = discovered.length;
  const rareCount = SPECIES.filter((s) => discovered.includes(s.id) && (s.rarity === "rare" || s.rarity === "legendary")).length;
  const completion = Math.round((foundCount / SPECIES.length) * 100);
  const whale = SPECIES.find((s) => s.id === "whale")!;
  const filtered = SPECIES.filter((s) => {
    if (filter === "found") return discovered.includes(s.id);
    if (filter === "missing") return !discovered.includes(s.id);
    return true;
  });

  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto overscroll-contain bg-[#011013]/78 px-0 py-0 backdrop-blur-md sm:px-5 sm:py-6 scroll-thin">
      <div className="glass relative mx-auto min-h-full w-full max-w-[1150px] overflow-hidden rounded-none border-x-0 sm:min-h-0 sm:rounded-[26px] sm:border-x">
        <div className="pointer-events-none absolute -right-24 -top-32 h-96 w-96 rounded-full bg-aqua/[0.06] blur-[90px]" />
        <header className="relative z-10 flex items-start justify-between gap-4 border-b border-white/10 px-5 py-5 sm:px-8">
          <div className="flex items-center gap-3.5">
            <div className="grid h-11 w-11 place-items-center rounded-full border border-aqua/20 bg-aqua/[0.055] text-aqua/90">
              <JournalIcon className="h-5 w-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="font-display text-[28px] leading-none text-cream sm:text-[32px]">Полевой журнал</h2>
                <span className="rounded-full border border-white/10 px-2 py-0.5 font-mono text-[8px] uppercase tracking-wider text-fog/50">exp. 07</span>
              </div>
              <p className="mt-1.5 text-[10px] text-fog/55">Коралловый сад · 18°32′S 119°04′E · наблюдения без вторжения</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/10 text-fog transition hover:border-aqua/25 hover:bg-white/5 hover:text-cream"
            aria-label="Закрыть журнал"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </header>

        <div className="relative z-10 px-5 py-5 sm:px-8 sm:py-6">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
            <div className="rounded-2xl border border-white/[0.09] bg-white/[0.025] p-5">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <span className="eyebrow text-aqua/70">прогресс наблюдения</span>
                  <div className="mt-2 flex items-end gap-2.5">
                    <span className="font-display text-[58px] leading-[0.8] text-cream">{foundCount}</span>
                    <span className="font-display text-[30px] leading-none text-fog/35">/ {SPECIES.length}</span>
                  </div>
                  <p className="mt-3 max-w-[290px] text-[10px] leading-relaxed text-fog/55">
                    {foundCount === SPECIES.length
                      ? "Все восемь историй этого рифа записаны. Можно просто смотреть."
                      : "Каждое открытие требует взгляда и терпения. Животные сами решают, когда подойти ближе."}
                  </p>
                </div>
                <div className="relative grid h-[74px] w-[74px] shrink-0 place-items-center">
                  <svg viewBox="0 0 80 80" className="absolute inset-0 -rotate-90">
                    <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,.09)" strokeWidth="2" />
                    <circle
                      cx="40"
                      cy="40"
                      r="34"
                      fill="none"
                      stroke="#8ee4d4"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 34}
                      strokeDashoffset={2 * Math.PI * 34 * (1 - foundCount / SPECIES.length)}
                      className="transition-all duration-700"
                    />
                  </svg>
                  <span className="tabular text-[12px] font-medium text-cream">{completion}%</span>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="chip border-aqua/15 bg-aqua/[0.045] text-aqua/80"><CheckIcon className="h-2.5 w-2.5" /> {foundCount} подтверждено</span>
                <span className="chip border-gold/15 bg-gold/[0.04] text-gold/80"><SparkIcon className="h-2.5 w-2.5" /> {rareCount} редких</span>
                <span className="chip text-fog/55"><EyeIcon className="h-2.5 w-2.5" /> только взгляд</span>
              </div>
            </div>

            <div className={`relative overflow-hidden rounded-2xl border p-5 ${discovered.includes("whale") ? "border-aqua/25 bg-[linear-gradient(140deg,rgba(34,94,98,.45),rgba(4,28,32,.8))]" : "border-white/[0.09] bg-white/[0.02]"}`}>
              <div className="pointer-events-none absolute -bottom-2 -right-2 text-white/[0.035]">
                <SpeciesGlyph id="whale" className="h-32 w-44" />
              </div>
              <span className="eyebrow text-gold/70">редкая встреча</span>
              <div className="font-display mt-2 text-[25px] leading-tight text-cream">{whale.name}</div>
              <div className="text-[9px] uppercase tracking-[0.15em] text-fog/45">{whale.latin} · {whale.size}</div>
              <p className="relative mt-3 max-w-[280px] text-[9.5px] leading-relaxed text-fog/60">
                {discovered.includes("whale")
                  ? "Кит прошёл над рифом. Запись сделана без движения: только взгляд и задержанное дыхание."
                  : "В этих водах проходит миграционный маршрут. Кит появляется сам — оставайтесь неподвижны и смотрите выше линии рифа."}
              </p>
              <div className="mt-3 flex items-center gap-2 text-[8px] uppercase tracking-[0.12em] text-fog/45">
                <span className={`h-1.5 w-1.5 rounded-full ${discovered.includes("whale") ? "bg-aqua shadow-[0_0_8px_#8ee4d4]" : "bg-fog/30"}`} />
                {discovered.includes("whale") ? "встреча подтверждена" : "ещё не встречен"}
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.02] p-1">
              {([
                ["all", "Все виды"],
                ["found", "Встреченные"],
                ["missing", "Впереди"],
              ] as const).map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => setFilter(value)}
                  className={`rounded-full px-3 py-1.5 text-[9px] font-medium transition ${filter === value ? "bg-white/[0.1] text-cream" : "text-fog/50 hover:text-cream"}`}
                >
                  {label}
                  <span className="ml-1.5 text-[8px] text-fog/35">
                    {value === "all" ? SPECIES.length : value === "found" ? foundCount : SPECIES.length - foundCount}
                  </span>
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 text-[8px] uppercase tracking-[0.13em] text-fog/35">
              <WaveIcon className="h-3.5 w-3.5" /> тихий наблюдатель · 0 вмешательств
            </div>
          </div>

          <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {filtered.map((species) => {
              const found = discovered.includes(species.id);
              return (
                <article
                  key={species.id}
                  className={`group relative overflow-hidden rounded-xl border p-4 transition ${
                    found ? "border-white/[0.13] bg-white/[0.035] hover:border-white/20" : "border-white/[0.06] bg-white/[0.012]"
                  }`}
                >
                  <div
                    className="pointer-events-none absolute -right-2 -top-2 opacity-[0.055] transition duration-500 group-hover:opacity-[0.1]"
                    style={{ color: species.accent }}
                  >
                    <SpeciesGlyph id={species.id} className="h-28 w-40" />
                  </div>
                  <div className="relative flex items-start gap-3.5">
                    <div
                      className="grid h-14 w-14 shrink-0 place-items-center rounded-xl border bg-white/[0.025]"
                      style={{ borderColor: found ? `${species.accent}45` : "rgba(255,255,255,.06)", color: found ? species.accent : "#5a7472" }}
                    >
                      {found ? <SpeciesGlyph id={species.id} className="h-8 w-10" /> : <span className="font-display text-xl text-fog/25">?</span>}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className={`text-[13px] font-semibold ${found ? "text-cream/90" : "text-fog/55"}`}>
                            {found ? species.name : "Не подтверждён"}
                          </div>
                          <div className="mt-0.5 text-[8px] uppercase tracking-[0.13em] text-fog/35">
                            {found ? species.latin : "вид скрыт · ведите наблюдение"}
                          </div>
                        </div>
                        <span
                          className={`shrink-0 rounded-full border px-1.5 py-0.5 text-[7px] font-medium uppercase tracking-[0.1em] ${
                            found ? "border-white/10 text-fog/55" : "border-white/[0.06] text-fog/25"
                          }`}
                        >
                          {found ? "в журнале" : "впереди"}
                        </span>
                      </div>
                      <p className={`mt-2 line-clamp-2 text-[9px] leading-relaxed ${found ? "text-fog/60" : "text-fog/30"}`}>
                        {found ? species.description : species.note}
                      </p>
                      <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[8px] uppercase tracking-[0.08em] text-fog/35">
                        <span>{species.depth}</span>
                        <span className="h-0.5 w-0.5 rounded-full bg-fog/30" />
                        <span>{species.habitat}</span>
                        <span className="ml-auto normal-case tracking-normal text-fog/35">{found ? RARITY_LABEL[species.rarity] : "не встречен"}</span>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 border-t border-white/10 pt-4 sm:grid-cols-[1fr_auto] sm:items-center">
            <div className="flex items-start gap-2.5 text-[9px] leading-relaxed text-fog/40">
              <InfoIcon className="mt-px h-3.5 w-3.5 shrink-0 text-fog/45" />
              <p>
                Вид считается открытым после 1,6 секунды удержания взгляда. Это не охота: здесь ничего нельзя
                потрогать, поймать или напугать. Записи хранятся только в этом браузере.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  if (window.confirm("Очистить полевой журнал? Все открытия будут забыты.")) onReset();
                }}
                className="rounded-full px-3 py-2 text-[9px] font-medium text-fog/45 transition hover:text-coral/80"
              >
                Очистить журнал
              </button>
              <button onClick={onClose} className="btn-primary !px-5 !py-2.5 !text-[11px]">
                {foundCount ? "К рифу" : "Начать наблюдение"}
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-white/[0.07] pt-3">
            <div className="flex items-center gap-2 text-[8px] uppercase tracking-[0.2em] text-fog/30">
              <ShellMark className="h-4 w-4" /> Pelagic eye · observatory
            </div>
            <div className="flex items-center gap-3 text-[8px] uppercase tracking-[0.15em] text-fog/25">
              <span className="flex items-center gap-1"><DiveIcon className="h-3 w-3" /> 18.4 m</span>
              <span className="flex items-center gap-1"><CheckIcon className="h-3 w-3" /> local-first</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
