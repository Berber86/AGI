import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, Dices, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/utils/cn";
import { M } from "@/game/model";
import { MODEL_GROUPS, useStore } from "@/game/store";
import { Btn, CATEGORY_META, Chip, Label, ResIcon, RES, type ResKey } from "@/components/ui";
import { LogoMark } from "@/components/Shell";
import art from "../../assets/infinite-forge-battlefield.jpg";

const STEPS = ["Имя", "Происхождение", "Наследие", "Замысел", "Советник", "Направление"];

/* ---------- генератор имени народа (с перебросами, без ручного выбора из списка) ---------- */

// «Люди/Братья/...» + родительный падеж — согласование рода не требуется, сочетание всегда корректно.
const TRIBE_PEOPLE = ["Дети", "Сыны", "Братья", "Люди", "Хранители", "Потомки", "Стада", "Налётчики", "Воины", "Странники", "Кочевники", "Всадники", "Дозорные", "Старейшины"];
const TRIBE_OF = [
  "Кургана", "Огня", "Ветра", "Соли", "Реки", "Горизонта", "Чёрного Леса", "Быстрой Воды", "Соляной Тропы",
  "Утренней Зари", "Красной Скалы", "Степного Простора", "Южного Ветра", "Древних Курганов", "Высоких Гор",
  "Студёного Моря", "Священного Пепла", "Волчьей Тропы", "Бронзовых Холмов", "Янтарного Берега",
];
// Тотемный зверь мужского рода + согласованное прилагательное.
const TRIBE_MASC_ADJ = ["Медный", "Каменный", "Янтарный", "Огненный", "Бронзовый", "Суровый", "Древний", "Северный", "Горный", "Степной", "Солнечный", "Железный"];
const TRIBE_MASC_NOUN = ["Ворон", "Волк", "Орёл", "Медведь", "Бык", "Олень", "Сокол", "Барс", "Тур", "Кабан"];
// Множественное число людей + согласованное прилагательное во множественном числе.
const TRIBE_PLUR_ADJ = ["Каменные", "Степные", "Горные", "Огненные", "Бронзовые", "Суровые", "Древние", "Северные", "Быстрые", "Вольные", "Солёные", "Янтарные"];
const TRIBE_PLUR_NOUN = ["Братья", "Сыны", "Дети", "Люди", "Воины", "Странники", "Кочевники", "Потомки", "Хранители", "Всадники"];

const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

function generateTribeName(exclude?: string): string {
  let out = exclude;
  for (let i = 0; i < 8 && (!out || out === exclude); i++) {
    const roll = Math.random();
    out = roll < 0.5 ? `${pick(TRIBE_PEOPLE)} ${pick(TRIBE_OF)}`
      : roll < 0.75 ? `${pick(TRIBE_MASC_ADJ)} ${pick(TRIBE_MASC_NOUN)}`
        : `${pick(TRIBE_PLUR_ADJ)} ${pick(TRIBE_PLUR_NOUN)}`;
  }
  return out!;
}

/** Черновик обращений к советнику: генерацию уже оплатили, терять её нельзя. */
function readOpeningDraft(seedLine: string): { directions: any[]; direction: any | null; project: any | null } {
  try {
    const raw = JSON.parse(localStorage.getItem("iforge_opening_draft") || "null");
    if (raw && raw.seedLine === seedLine) {
      return {
        directions: Array.isArray(raw.directions) ? raw.directions : [],
        direction: raw.direction || null,
        project: raw.project || null,
      };
    }
  } catch { /* пусто */ }
  return { directions: [], direction: null, project: null };
}

export default function Onboarding() {
  const { game, model, setModel, askOpeningDirections, foundCampaign, startFirstDay, toast } = useStore();
  const p = game.player;
  const [step, setStep] = useState(() => (p.awaitingOpeningProject && p.originId ? 5 : 0));
  // Имя народа никто не выбирает руками — его придумывает генератор; переброс даёт другой вариант.
  const [name, setName] = useState(() => (p.originId ? p.name : generateTribeName()));
  const [originId, setOriginId] = useState<string | null>(p.originId || null);
  // Наследие: стартовые культуры (эпоха 0) лежат в игре целиком, и игрок выбирает одну сам —
  // раньше культура выпадала случайно и всплывала только строчкой в летописи.
  const startCultures: any[] = (M.startCulturePool ? M.startCulturePool() : M.HISTORICAL_CULTURES.filter((c: any) => c.era === 0));
  const [cultureId, setCultureId] = useState<string | null>(() => {
    const saved = p.historicalCulture?.id;
    return saved && startCultures.some((c: any) => c.id === saved) ? saved : null;
  });
  const culture = startCultures.find((c: any) => c.id === cultureId) || null;
  // Старое сохранение могло хранить затравку текстом: узнаём её среди готовых замыслов.
  const [seedId, setSeedId] = useState<string | null>(() => p.seedChoiceId
    || (M.SEED_CHOICES || []).find((c: any) => c.line === p.seedLine)?.id
    || null);
  const seedChoice = (M.SEED_CHOICES || []).find((c: any) => c.id === seedId) || null;
  const seedLine = seedChoice?.line || p.seedLine || "";
  const draft = p.awaitingOpeningProject ? readOpeningDraft(seedLine) : { directions: [], direction: null, project: null };
  // Превью направлений придумывает модель: игрок выбирает, о чём будет первая наука, и только потом
  // советник раскрывает направление в науку и постройку (второй вызов).
  const [phase, setPhase] = useState<"form" | "asking" | "directions" | "generating" | "reveal" | "error">(
    draft.project ? "reveal" : draft.directions.length ? "directions" : "form");
  const [directions, setDirections] = useState<any[]>(draft.directions);
  const [direction, setDirection] = useState<any>(draft.direction);
  const [project, setProject] = useState<any>(draft.project);
  const [error, setError] = useState("");

  const origin = M.ORIGINS.find((o: any) => o.id === originId);

  const canNext = step === 0 ? true
    : step === 1 ? !!originId
      : step === 2 ? !!cultureId
        : step === 3 ? !!seedId
          : true;

  /** Первый вопрос советнику: о чём вообще может быть наука этого народа. */
  const askDirections = async () => {
    if (!originId || !seedId) return;
    setPhase("asking");
    setError("");
    const res = await askOpeningDirections({ name: name.trim() || (origin?.name ?? ""), originId, seedId, historicalCultureId: cultureId });
    if (!res.ok) {
      setPhase("error");
      setError(res.error || "Советник недоступен.");
      return;
    }
    setDirections(res.directions || []);
    setDirection(null);
    setPhase("directions");
  };

  /** Второй вопрос: раскрыть выбранное направление в первое дело народа. */
  const found = async () => {
    if (!originId || !seedId || !direction) return;
    setPhase("generating");
    setError("");
    const res = await foundCampaign({ name: name.trim() || (origin?.name ?? ""), originId, seedId, historicalCultureId: cultureId, direction });
    if (!res.ok) {
      setPhase("error");
      setError(res.error || "Советник недоступен.");
      return;
    }
    setProject(res.project);
    setPhase("reveal");
  };

  const pickDirection = (item: any) => {
    setDirection(item);
    try { localStorage.setItem("iforge_opening_draft", JSON.stringify({ seedChoiceId: seedId, seedLine, directions, direction: item })); } catch { /* переполнение хранилища не критично */ }
  };

  // Пока советник думает — только ожидание и выбранный замысел, никаких кнопок.
  if (phase === "asking" || phase === "generating") {
    return (
      <div className="grid min-h-dvh place-items-center px-6">
        <div className="max-w-lg text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-bronze/40 bg-bronze/10"><Loader2 className="animate-spin text-bronze" size={28} /></span>
          <h1 className="font-display mt-6 text-3xl font-semibold">
            {phase === "asking" ? "Советник читает ваш народ" : `Советник раскрывает «${direction?.title ?? "выбранное"}»`}
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-dim">
            «{seedLine.trim()}»
          </p>
          <p className="mt-4 text-sm leading-relaxed text-faint">
            {phase === "asking"
              ? "Он придумает три направления науки — о чём она может быть у народа с вашей землёй, чертой, наследием и замыслом. Готовых вариантов в игре нет."
              : "Из этого направления родится первое дело народа: своя наука и своя постройка. Проект создаётся только для вас."}
          </p>
        </div>
      </div>
    );
  }

  if (phase === "error") {
    return (
      <div className="grid min-h-dvh place-items-center px-6">
        <div className="max-w-lg text-center">
          <h1 className="font-display text-3xl font-semibold">Советник не ответил</h1>
          <p className="mt-3 text-sm leading-relaxed text-bad">{error}</p>
          <p className="mt-3 text-sm leading-relaxed text-dim">Начало игры не сохранится без первого дела: попробуйте снова или выберите другой замысел.</p>
          <div className="mt-6 flex justify-center gap-3">
            <Btn variant="primary" size="lg" onClick={directions.length && direction ? found : askDirections}>Повторить<ArrowRight size={18} /></Btn>
            <Btn variant="ghost" size="lg" onClick={() => { setPhase("form"); setStep(3); }}>Сменить замысел</Btn>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "directions") {
    return (
      <div className="grid min-h-dvh place-items-center px-6 py-10">
        <div className="w-full max-w-3xl">
          <Label>Первое дело · о чём будет наука</Label>
          <h1 className="font-display mt-2 text-3xl font-semibold sm:text-4xl">Советник принёс три направления</h1>
          <p className="mt-2 max-w-2xl text-[14.5px] leading-relaxed text-dim">
            Направления придуманы под ваш народ{origin ? ` — ${origin.name}, земля «${origin.place}»` : ""}{culture ? `, наследие «${culture.name}»` : ""}{seedChoice ? `, замысел «${seedChoice.name}»` : ""}.
            Выберите одно: советник раскроет его в науку и постройку. Готовых наук в игре нет.
          </p>
          <div className="mt-6 grid gap-3">
            {directions.map((d) => (
              <button key={d.id} onClick={() => pickDirection(d)}
                className={cn("rounded-2xl border p-4 text-left transition-all", direction?.id === d.id ? "border-bronze bg-raised" : "border-line bg-surface hover:border-line-strong hover:bg-raised/60")}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-2xl leading-none">{d.icon}</span>
                      <span className="font-display text-lg font-semibold text-parch">{d.title}</span>
                      <Chip tone={CATEGORY_META[d.category]?.tone}>{CATEGORY_META[d.category]?.label ?? d.category}</Chip>
                      <Chip>{d.themeLabel}</Chip>
                    </div>
                    <p className="mt-2 text-[13.5px] leading-relaxed text-dim">{d.summary}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {(d.effects || []).map((e: any, i: number) => <Chip key={i} tone="bronze">{M.EFFECTS[e.type]?.label ?? e.type}</Chip>)}
                    </div>
                    {d.rationale && <p className="mt-2 text-xs italic leading-relaxed text-faint">Почему вашему народу: {d.rationale}</p>}
                  </div>
                  {direction?.id === d.id ? <Check size={18} className="mt-1 shrink-0 text-bronze" /> : null}
                </div>
              </button>
            ))}
          </div>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Btn variant="secondary" size="lg" className="sm:flex-1" onClick={askDirections}>
              <Dices size={18} />Другие направления
            </Btn>
            <Btn variant="primary" size="lg" className="sm:flex-[2]" disabled={!direction} onClick={found}>
              <Sparkles size={18} />{direction ? `Раскрыть «${direction.title}»` : "Выберите направление"}
            </Btn>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-faint">
            Направление — это тема первой науки: земледелие, ремесло, война, вера, знание, устройство общества или их сочетание.
            Оно запомнится в чертеже, и советник будет учитывать его в следующих проектах.
          </p>
        </div>
      </div>
    );
  }

  if (phase === "reveal" && project) {
    return (
      <div className="grid min-h-dvh place-items-center px-6 py-10">
        <div className="w-full max-w-2xl">
          <Label>Первый день · ваш народ основан</Label>
          <h1 className="font-display mt-2 text-3xl font-semibold sm:text-4xl">{name.trim() || origin?.name} начинают путь</h1>
          <div className="mt-6 rounded-2xl border border-bronze/40 bg-bronze/8 p-5">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-bronze-soft"><Sparkles size={13} />Первое дело народа</div>
            <h2 className="font-display mt-2 text-2xl font-semibold">{project.scienceName}</h2>
            <p className="mt-2 text-[14px] leading-relaxed text-dim">{project.scienceDescription}</p>
            <div className="mt-4 rounded-xl border border-line bg-ground/60 p-3.5">
              <div className="text-[11px] uppercase tracking-wider text-faint">Постройка по этому чертежу</div>
              <div className="mt-0.5 font-display text-lg font-semibold">{project.buildingName}</div>
              <p className="mt-1 text-[13px] leading-relaxed text-dim">{project.buildingDescription}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {(project.effects || []).map((e: any, i: number) => <Chip key={i} tone="bronze">{M.EFFECTS[e.type]?.label ?? e.type}</Chip>)}
              </div>
            </div>
            {project.rationale && <p className="mt-3 text-[13px] italic leading-relaxed text-faint">Почему так: {project.rationale}</p>}
          </div>
          <div className="mt-4 rounded-2xl border border-line bg-surface p-4 text-sm leading-relaxed text-dim">
            <div className="mb-1 font-semibold text-parch">Что дальше</div>
            Каждый день у вас <b className="text-parch">2 приказа</b>. Наставник сверху будет вести по шагам: изучить первое дело → построить здание → занять соседнюю землю → сыграть тренировочный бой.
          </div>
          <Btn variant="primary" size="lg" className="mt-6 w-full" onClick={() => { if (startFirstDay()) toast("Первый день начался. Наставник подскажет следующий шаг.", "ok"); }}>
            <Check size={18} />Начать первый день
          </Btn>
        </div>
      </div>
    );
  }

  return (
    <div className="grid min-h-dvh lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <div className="relative hidden overflow-hidden lg:block">
        <img src={art} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ground via-ground/50 to-ground/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-ground" />
        <div className="absolute bottom-10 left-10 right-16">
          <LogoMark size={44} />
          <h1 className="font-display mt-4 text-4xl font-semibold leading-tight text-parch">Основать цивилизацию</h1>
          <p className="mt-3 max-w-md text-[15px] leading-relaxed text-dim">Тридцать дней сезона. Земля, знания и ремесло. Ваши науки и постройки придумает советник — из выбранного замысла, а не из готового списка.</p>
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
            <div className="max-w-xl">
              <h2 className="font-display text-3xl font-semibold">Как назовём ваш народ?</h2>
              <p className="mt-2 text-dim">Выбирать ничего не нужно — имя придумывает генератор. Не понравилось — перебросьте ещё раз.</p>
              <div className="mt-6 flex items-center gap-3 rounded-2xl border border-bronze/40 bg-bronze/8 px-5 py-6">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-bronze/50 bg-raised text-xl font-bold text-bronze">{name.slice(0, 1)}</span>
                <span className="min-w-0 flex-1 truncate font-display text-2xl font-semibold text-parch">{name}</span>
              </div>
              <Btn variant="secondary" size="lg" className="mt-4 w-full" onClick={() => setName(generateTribeName(name))}>
                <Dices size={18} />Перебросить имя
              </Btn>
              <p className="mt-4 text-xs text-faint">Имя появится в летописи и в названиях ваших построек. Перебрасывайте сколько угодно раз.</p>
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 className="font-display text-3xl font-semibold">Откуда пришёл ваш народ?</h2>
              <p className="mt-2 text-dim">Происхождение даёт стартовый запас и определяет характер земли.</p>
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
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
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

          {step === 3 && (
            <div className="max-w-3xl">
              <h2 className="font-display text-3xl font-semibold">Чем живёт ваш народ?</h2>
              <p className="mt-2 text-dim">Выберите один замысел — писать ничего не нужно. Из него советник выведет ваши науки и постройки: это ваша цивилизация, а не чужой шаблон.</p>
              {(origin || culture) && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {origin && (
                    <div className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-xs text-dim">
                      <span className="text-base">{origin.icon}</span>{origin.name} · {origin.place}
                    </div>
                  )}
                  {culture && (
                    <div className="inline-flex items-center gap-2 rounded-full border border-bronze/40 bg-bronze/10 px-3 py-1.5 text-xs text-parch">
                      <span className="text-base">{culture.icon}</span>{culture.name} · {M.describeCultureBonus(culture)}
                    </div>
                  )}
                </div>
              )}
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
                    <div className="mt-2 text-[11.5px] leading-snug text-faint">Советник будет опираться на: {c.hint.toLowerCase()}.</div>
                  </button>
                ))}
              </div>
              <p className="mt-4 text-xs text-faint">Замысел останется в деле народа: по нему советник будет предлагать и следующие проекты.</p>
            </div>
          )}

          {step === 4 && (
            <div className="max-w-xl">
              <h2 className="font-display text-3xl font-semibold">Ваш советник</h2>
              <p className="mt-2 text-dim">
                Науки, постройки и карты создаёт модель прямо во время игры — готовых вариантов в игре нет. Доступ к ИИ уже настроен заранее, ключ вводить не нужно: выберите только школу модели.
              </p>
              <label className="mt-6 block">
                <Label className="mb-1.5">Модель для наук и советов</Label>
                <select value={model} onChange={(e) => setModel(e.target.value)} className="h-10 w-full rounded-lg border border-line-strong bg-surface px-3 text-sm text-parch outline-none focus:border-bronze">
                  {MODEL_GROUPS.map((g) => (
                    <optgroup key={g.id} label={`${g.label} — ${g.hint}`}>
                      {g.models.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}
                    </optgroup>
                  ))}
                </select>
                <span className="mt-1.5 block text-xs text-faint">Карты в кузнице модель выбирает сама по выпавшей редкости.</span>
              </label>
            </div>
          )}

          {step === 5 && origin && (
            <div className="max-w-xl">
              <h2 className="font-display text-3xl font-semibold">{name.trim() || origin.name} готовы к первому дню</h2>
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-4"><span className="text-3xl">{origin.icon}</span><div><Label>Происхождение</Label><div className="font-medium">{origin.name}</div><div className="text-xs text-dim">Стартовый бонус: +{origin.bonus} {RES[origin.resource as ResKey].label.toLowerCase()}</div></div></div>
                <div className="flex items-start gap-4 rounded-2xl border border-line bg-surface p-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-ground text-2xl">{culture?.icon ?? "🏺"}</span>
                  <div className="min-w-0"><Label>Наследие</Label><div className="font-medium">{culture?.name || "Древняя культура"}</div><div className="text-[13.5px] leading-relaxed text-dim">{culture?.desc || ""}</div><div className="mt-1 text-xs text-bronze-soft">{culture ? M.describeCultureBonus(culture) : ""}</div></div>
                </div>
                <div className="flex items-start gap-4 rounded-2xl border border-line bg-surface p-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-ground text-2xl">{seedChoice?.icon ?? "🧭"}</span>
                  <div><Label>Замысел народа</Label><div className="font-medium">{seedChoice?.name || "Выбранный замысел"}</div><div className="text-[14px] leading-relaxed text-dim">«{seedLine}»</div></div>
                </div>
              </div>
              <div className="mt-6 rounded-2xl border border-bronze/30 bg-bronze/8 p-4 text-sm leading-relaxed text-dim">
                <div className="mb-1 font-semibold text-bronze-soft">Что произойдёт дальше</div>
                Советник прочитает происхождение, наследие и замысел народа и предложит <b className="text-parch">три направления</b> — о чём может быть ваша первая наука:
                земледелие, ремесло, война, вера, знание, устройство общества или их сочетание. Вы выберете одно, и советник раскроет его
                в науку и постройку. После этого наставник поведёт по шагам.
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 flex items-center justify-between gap-3">
          <Btn variant="ghost" onClick={() => setStep(step - 1)} disabled={step === 0}><ArrowLeft size={16} />Назад</Btn>
          {step < 5 ? (
            <Btn variant="primary" size="lg" disabled={!canNext} onClick={() => setStep(step + 1)}>Далее<ArrowRight size={18} /></Btn>
          ) : directions.length ? (
            <Btn variant="primary" size="lg" onClick={() => setPhase("directions")}><Sparkles size={18} />К направлениям</Btn>
          ) : (
            <Btn variant="primary" size="lg" onClick={askDirections}><Sparkles size={18} />Спросить о направлениях</Btn>
          )}
        </div>
      </div>
    </div>
  );
}
