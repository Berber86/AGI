import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, Loader2, RefreshCw, Sparkles } from "lucide-react";
import { cn } from "@/utils/cn";
import { M } from "@/game/model";
import { useStore } from "@/game/store";
import { Btn, Chip, Label, ResIcon, RES, type ResKey } from "@/components/ui";
import { LogoMark } from "@/components/Shell";
import art from "../../assets/infinite-forge-battlefield.jpg";

const NAME_PEOPLE = ["Дети", "Сыны", "Хранители", "Люди", "Племя", "Наследники", "Сородичи", "Стражи"];
const NAME_IMAGES = ["Медной Реки", "Красного Ила", "Быстрой Воды", "Соляных Озёр", "Каменного Порога", "Тихого Огня", "Северного Ветра", "Высоких Курганов", "Чёрного Тростника", "Золотой Пыли", "Длинной Тени", "Белых Склонов"];

function rollPeopleName(previous = "") {
  for (let attempt = 0; attempt < 12; attempt += 1) {
    const candidate = `${NAME_PEOPLE[Math.floor(Math.random() * NAME_PEOPLE.length)]} ${NAME_IMAGES[Math.floor(Math.random() * NAME_IMAGES.length)]}`;
    if (candidate !== previous) return candidate;
  }
  return `${NAME_PEOPLE[0]} ${NAME_IMAGES[0]}`;
}

const STEPS = ["Название", "Происхождение", "Замысел", "Начало"];

/** Черновик первого проекта: генерацию уже оплатили, терять её нельзя. */
function readOpeningDraft(seedLine: string): any | null {
  try {
    const raw = JSON.parse(localStorage.getItem("iforge_opening_draft") || "null");
    if (raw && raw.seedLine === seedLine && raw.project) return raw.project;
  } catch { /* пусто */ }
  return null;
}

export default function Onboarding() {
  const { game, foundCampaign, startFirstDay, toast } = useStore();
  const p = game.player;
  const [step, setStep] = useState(() => (p.awaitingOpeningProject && p.originId ? 3 : 0));
  const [name, setName] = useState(() => (p.originId ? p.name : rollPeopleName()));
  const [originId, setOriginId] = useState<string | null>(p.originId || null);
  // Старое сохранение могло хранить затравку текстом: узнаём её среди готовых замыслов.
  const [seedId, setSeedId] = useState<string | null>(() => p.seedChoiceId
    || (M.SEED_CHOICES || []).find((c: any) => c.line === p.seedLine)?.id
    || null);
  const seedChoice = (M.SEED_CHOICES || []).find((c: any) => c.id === seedId) || null;
  const seedLine = seedChoice?.line || p.seedLine || "";
  const draft = p.awaitingOpeningProject ? readOpeningDraft(seedLine) : null;
  const [phase, setPhase] = useState<"form" | "generating" | "reveal" | "error">(draft ? "reveal" : "form");
  const [project, setProject] = useState<any>(draft);
  const [error, setError] = useState("");

  const origin = M.ORIGINS.find((o: any) => o.id === originId);

  // verifyKey выполняется автоматически в StoreProvider: ключ живёт в серверном окружении Vercel.
  const canNext = step === 0 ? name.trim().length > 0
    : step === 1 ? !!originId
      : step === 2 ? !!seedId
        : true;

  const found = async () => {
    if (!originId || !seedId) return;
    setPhase("generating");
    setError("");
    const res = await foundCampaign({ name: name.trim() || (origin?.name ?? ""), originId, seedId });
    if (!res.ok) {
      setPhase("error");
      setError(res.error || "Советник недоступен.");
      return;
    }
    setProject(res.project);
    setPhase("reveal");
  };

  // Пока идёт генерация — только ожидание и выбранный замысел, никаких кнопок.
  if (phase === "generating") {
    return (
      <div className="grid min-h-dvh place-items-center px-6">
        <div className="max-w-lg text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-bronze/40 bg-bronze/10"><Loader2 className="animate-spin text-bronze" size={28} /></span>
          <h1 className="font-display mt-6 text-3xl font-semibold">Советник читает ваш замысел</h1>
          <p className="mt-3 text-[15px] leading-relaxed text-dim">
            «{seedLine.trim()}»
          </p>
          <p className="mt-4 text-sm leading-relaxed text-faint">
            Из этого выбора рождается первое дело народа: своя наука и своя постройка. Готовых вариантов в игре нет — этот проект создаётся только для вас.
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
            <Btn variant="primary" size="lg" onClick={found}>Повторить<ArrowRight size={18} /></Btn>
            <Btn variant="ghost" size="lg" onClick={() => { setPhase("form"); setStep(2); }}>Сменить замысел</Btn>
          </div>
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
              <h2 className="font-display text-3xl font-semibold">Название народа</h2>
              <p className="mt-2 text-dim">Имя появится само — выбирать из списка или писать его не нужно. Не понравилось? Сделайте переброс.</p>
              <div className="mt-8 rounded-2xl border border-bronze/40 bg-bronze/8 p-5 sm:p-6">
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-bronze-soft">Сгенерировано для вас</div>
                <div className="mt-3 font-display text-3xl font-semibold text-parch sm:text-4xl">{name}</div>
                <Btn variant="secondary" size="lg" className="mt-5" onClick={() => setName((previous: string) => rollPeopleName(previous))}>
                  <RefreshCw size={17} />Перебросить название
                </Btn>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-faint">Генератор собирает новое имя из историчных образов. Перебрасывайте сколько угодно раз.</p>
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
              <h2 className="font-display text-3xl font-semibold">Чем живёт ваш народ?</h2>
              <p className="mt-2 text-dim">Выберите один замысел — писать ничего не нужно. Из него советник выведет ваши науки и постройки: это ваша цивилизация, а не чужой шаблон.</p>
              {origin && (
                <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-xs text-dim">
                  <span className="text-base">{origin.icon}</span>{origin.name} · {origin.place}
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

          {step === 3 && origin && (
            <div className="max-w-xl">
              <h2 className="font-display text-3xl font-semibold">{name.trim() || origin.name} готовы к первому дню</h2>
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-4"><span className="text-3xl">{origin.icon}</span><div><Label>Происхождение</Label><div className="font-medium">{origin.name}</div><div className="text-xs text-dim">Стартовый бонус: +{origin.bonus} {RES[origin.resource as ResKey].label.toLowerCase()}</div></div></div>
                <div className="flex items-start gap-4 rounded-2xl border border-line bg-surface p-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-ground text-2xl">{seedChoice?.icon ?? "🧭"}</span>
                  <div><Label>Замысел народа</Label><div className="font-medium">{seedChoice?.name || "Выбранный замысел"}</div><div className="text-[14px] leading-relaxed text-dim">«{seedLine}»</div></div>
                </div>
              </div>
              <div className="mt-6 rounded-2xl border border-bronze/30 bg-bronze/8 p-4 text-sm leading-relaxed text-dim">
                <div className="mb-1 font-semibold text-bronze-soft">Что произойдёт дальше</div>
                Советник прочитает замысел и создаст ваше первое дело — науку и постройку. После этого наставник поведёт по шагам.
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 flex items-center justify-between gap-3">
          <Btn variant="ghost" onClick={() => setStep(step - 1)} disabled={step === 0}><ArrowLeft size={16} />Назад</Btn>
          {step < 3 ? (
            <Btn variant="primary" size="lg" disabled={!canNext} onClick={() => setStep(step + 1)}>
              Далее<ArrowRight size={18} />
            </Btn>
          ) : (
            <Btn variant="primary" size="lg" onClick={found} disabled={!name.trim()}><Sparkles size={18} />Создать первое дело</Btn>
          )}
        </div>
      </div>
    </div>
  );
}
