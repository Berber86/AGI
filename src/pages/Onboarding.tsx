import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, Compass } from "lucide-react";
import { cn } from "@/utils/cn";
import { M } from "@/game/model";
import { useStore } from "@/game/store";
import { Btn, Label, ResIcon, type ResKey } from "@/components/ui";
import { LogoMark } from "@/components/Shell";
import art from "../../assets/infinite-forge-battlefield.jpg";

// Три осознанных выбора — и народ основан. Шага «Имя» больше нет: имя народа происходит из
// выбранной земли (ORIGINS.people), поэтому оно всегда согласовано с происхождением и звучит
// в том же серьёзном тоне, что и наследие. Шага «Советник» тоже нет: модель выбирает игра.
const STEPS = ["Происхождение", "Наследие", "Замысел"];

export default function Onboarding() {
  const { game, foundPeople, go, toast } = useStore();
  const p = game.player;
  const [step, setStep] = useState(0);
  const [originId, setOriginId] = useState<string | null>(p.originId || null);
  // Наследие: стартовые культуры (эпоха 0) лежат в игре целиком, и игрок выбирает одну сам.
  const startCultures: any[] = (M.startCulturePool ? M.startCulturePool() : M.HISTORICAL_CULTURES.filter((c: any) => c.era === 0));
  const [cultureId, setCultureId] = useState<string | null>(() => {
    const saved = p.historicalCulture?.id;
    return saved && startCultures.some((c: any) => c.id === saved) ? saved : null;
  });
  // Старое сохранение могло хранить замысел текстом: узнаём его среди готовых вариантов.
  const [seedId, setSeedId] = useState<string | null>(() => p.seedChoiceId
    || (M.SEED_CHOICES || []).find((c: any) => c.line === p.seedLine)?.id
    || null);
  const [error, setError] = useState("");

  const origin = M.ORIGINS.find((o: any) => o.id === originId) || null;
  const culture = startCultures.find((c: any) => c.id === cultureId) || null;
  // Имя народа не придумывается и не перебрасывается — оно следует из происхождения.
  const people = origin ? M.originPeopleName(origin) : "";
  const last = step === STEPS.length - 1;
  const canNext = step === 0 ? !!originId : step === 1 ? !!cultureId : !!seedId;

  /** Народ основан: игрок сразу в поселении, без стартовой науки и без стартового здания. */
  const found = () => {
    if (!originId || !seedId) return;
    const res = foundPeople({ originId, seedId, historicalCultureId: cultureId });
    if (!res.ok) { setError(res.error || "Не удалось основать народ."); return; }
    setError("");
    go("home");
    toast(`${people} выходят на свою землю. Первый день начался.`, "ok");
  };

  return (
    <div className="grid min-h-dvh lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <div className="relative hidden overflow-hidden lg:block">
        <img src={art} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ground via-ground/50 to-ground/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-ground" />
        <div className="absolute bottom-10 left-10 right-16">
          <LogoMark size={44} />
          <h1 className="font-display mt-4 text-4xl font-semibold leading-tight text-parch">Основать цивилизацию</h1>
          <p className="mt-3 max-w-md text-[15px] leading-relaxed text-dim">
            Тридцать дней сезона. Земля, знания и ремесло. Три выбора — происхождение, наследие и замысел;
            науки и постройки советник придумает позже, когда вы сами его спросите.
          </p>
        </div>
      </div>

      <div className="flex flex-col px-5 py-8 sm:px-10 lg:px-14 lg:py-12">
        <div className="mb-8 flex items-center gap-3 lg:hidden"><LogoMark size={32} /><span className="font-display text-lg font-semibold">Infinite Forge</span></div>
        <ol className="mb-8 flex items-center gap-2">
          {STEPS.map((s, i) => (
            <li key={s} className="flex flex-1 flex-col gap-1.5">
              <span className={cn("h-1 rounded-full transition-colors", i <= step ? "bg-bronze" : "bg-line")} />
              <span className={cn("text-[11px] font-medium", i === step ? "text-parch" : "text-faint")}>{s}</span>
            </li>
          ))}
        </ol>

        <div className="flex-1 animate-rise" key={step}>
          {step === 0 && (
            <div>
              <h2 className="font-display text-3xl font-semibold">Откуда пришёл ваш народ?</h2>
              <p className="mt-2 max-w-2xl text-dim">
                Земля задаёт стартовый запас, биом и ремесло, с которого народ начнёт. Из неё же происходит имя народа —
                придумывать его не нужно.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {M.ORIGINS.map((o: any) => (
                  <button key={o.id} onClick={() => setOriginId(o.id)}
                    className={cn("rounded-2xl border p-4 text-left transition-all", originId === o.id ? "border-bronze bg-raised" : "border-line bg-surface hover:border-line-strong hover:bg-raised/60")}>
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-3xl">{o.icon}</span>
                      <span className="inline-flex items-center gap-1 rounded-md bg-ground px-2 py-0.5 text-xs font-semibold text-parch"><ResIcon k={o.resource as ResKey} size={13} />+{o.bonus}</span>
                    </div>
                    <div className="font-display mt-2 text-lg font-semibold">{o.name}</div>
                    <div className="text-xs text-faint">{o.place}</div>
                    <p className="mt-2 text-[13px] leading-snug text-dim">{o.description}</p>
                    <div className="mt-2 text-[11.5px] leading-snug text-bronze-soft">{o.historical}</div>
                    <div className="mt-2 text-[11.5px] text-faint">Имя народа: <span className="text-parch">{M.originPeopleName(o)}</span></div>
                  </button>
                ))}
              </div>
              <p className="mt-4 text-xs leading-relaxed text-faint">
                Все шесть земель настоящие: датировки и прототипы — из археологии. Происхождение попадёт в летопись
                и в промпты советника вместе с наследием и замыслом.
              </p>
            </div>
          )}

          {step === 1 && (
            <div className="max-w-3xl">
              <h2 className="font-display text-3xl font-semibold">Кем пришли в этот мир?</h2>
              <p className="mt-2 text-dim">
                Это наследие народа — древняя культура, чьи обычаи он несёт. Советник читает его в каждом проекте,
                а бонусы работают с первого дня. Сменить наследие можно будет при переходе в новую эпоху.
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {startCultures.map((c: any) => (
                  <button key={c.id} onClick={() => setCultureId(c.id)}
                    className={cn("flex flex-col items-start rounded-2xl border p-4 text-left transition-all", cultureId === c.id ? "border-bronze bg-raised" : "border-line bg-surface hover:border-line-strong hover:bg-raised/60")}>
                    <div className="flex w-full items-start justify-between gap-2">
                      <span className="text-3xl">{c.icon}</span>
                      {cultureId === c.id ? <Check size={16} className="mt-1 text-bronze" /> : null}
                    </div>
                    <div className="font-display mt-2 text-lg font-semibold">{c.name}</div>
                    <p className="mt-1.5 text-[13px] leading-snug text-parch/90">{c.desc}</p>
                    <div className="mt-2 text-[11.5px] leading-snug text-bronze-soft">{M.describeCultureBonus(c)}</div>
                  </button>
                ))}
              </div>
              <p className="mt-4 text-xs text-faint">
                Все шесть культур Каменного века настоящие: даты, места и находки — из археологии. Наследие попадёт в летопись
                и в промпты советника: науки, постройки и карты кузница будет придумывать именно под него.
              </p>
            </div>
          )}

          {step === 2 && (
            <div className="max-w-3xl">
              <h2 className="font-display text-3xl font-semibold">Чем живёт ваш народ?</h2>
              <p className="mt-2 text-dim">
                Замысел — это менталитет народа: что он считает богатством, во что верит и чего боится.
                Писать ничего не нужно: из выбранного замысла советник выведет ваши науки и постройки.
              </p>

              <div className="mt-5 rounded-2xl border border-bronze/30 bg-bronze/8 p-4">
                <Label>Ваш народ</Label>
                <div className="mt-1.5 font-display text-2xl font-semibold text-parch">{people || "Безымянный народ"}</div>
                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                  {origin && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-dim">
                      <span className="text-base">{origin.icon}</span>{origin.name} · {origin.place}
                    </span>
                  )}
                  {culture && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-bronze/40 bg-bronze/10 px-3 py-1.5 text-parch">
                      <span className="text-base">{culture.icon}</span>{culture.name} · {M.describeCultureBonus(culture)}
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {(M.SEED_CHOICES || []).map((c: any) => (
                  <button key={c.id} onClick={() => setSeedId(c.id)}
                    className={cn("flex flex-col items-start rounded-2xl border p-4 text-left transition-all", seedId === c.id ? "border-bronze bg-raised" : "border-line bg-surface hover:border-line-strong hover:bg-raised/60")}>
                    <div className="flex w-full items-start justify-between gap-2">
                      <span className="text-3xl">{c.icon}</span>
                      {seedId === c.id ? <Check size={16} className="mt-1 text-bronze" /> : null}
                    </div>
                    <div className="font-display mt-2 text-lg font-semibold">{c.name}</div>
                    <p className="mt-1.5 text-[13px] leading-snug text-parch/90">«{c.line}»</p>
                    <div className="mt-2 text-[11.5px] leading-snug text-faint">{c.note || c.hint}</div>
                  </button>
                ))}
              </div>

              <div className="mt-5 rounded-2xl border border-line bg-surface p-4 text-sm leading-relaxed text-dim">
                <div className="mb-1 flex items-center gap-2 font-semibold text-parch"><Compass size={15} className="text-bronze" />Что произойдёт дальше</div>
                Вы окажетесь в поселении первого дня: карта, кузница, армия и развитие открыты сразу.
                Построек и наук пока нет — когда будете готовы, откройте вкладку <b className="text-parch">«Развитие» → «Наука»</b> и спросите советника:
                он придумает <b className="text-parch">три разные науки</b>, у каждой своё здание и свои свойства, а вы выберете одну.
              </div>
              {error && <p className="mt-3 text-sm text-bad">{error}</p>}
            </div>
          )}
        </div>

        <div className="mt-8 flex items-center justify-between gap-3">
          <Btn variant="ghost" onClick={() => setStep(step - 1)} disabled={step === 0}><ArrowLeft size={16} />Назад</Btn>
          {!last ? (
            <Btn variant="primary" size="lg" disabled={!canNext} onClick={() => setStep(step + 1)}>Далее<ArrowRight size={18} /></Btn>
          ) : (
            <Btn variant="primary" size="lg" disabled={!canNext} onClick={found}>
              <Check size={18} />{people ? `Основать народ «${people}»` : "Основать народ"}
            </Btn>
          )}
        </div>
      </div>
    </div>
  );
}
