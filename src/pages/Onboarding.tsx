import { useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { cn } from "@/utils/cn";
import { M } from "@/game/model";
import { useStore } from "@/game/store";
import { Btn, Label, ResIcon, RES, type ResKey } from "@/components/ui";
import { LogoMark } from "@/components/Shell";
import art from "../../assets/infinite-forge-battlefield.jpg";

const NAMES = ["Медный Ворон", "Речные Сыны", "Дети Кургана", "Хранители Огня", "Люди Соляной Тропы"];

export default function Onboarding() {
  const { act, toast } = useStore();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [originId, setOriginId] = useState<string | null>(null);
  const [focusId, setFocusId] = useState<string | null>(null);

  const origin = M.ORIGINS.find((o: any) => o.id === originId);
  const focus = M.OPENING_FOCUSES.find((f: any) => f.id === focusId);
  const canNext = step === 0 ? true : step === 1 ? !!origin : step === 2 ? !!focus : true;

  const begin = () => {
    const res = act((s) => M.completeOnboarding(s, { name, originId, openingFocusId: focusId }), { silent: true });
    if (res) toast("Ваш народ основал поселение. Первый день начинается.", "ok");
  };

  const steps = ["Имя", "Происхождение", "Первое дело", "Начало"];

  return (
    <div className="grid min-h-dvh lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <div className="relative hidden overflow-hidden lg:block">
        <img src={art} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ground via-ground/50 to-ground/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-ground" />
        <div className="absolute bottom-10 left-10 right-16">
          <LogoMark size={44} />
          <h1 className="font-display mt-4 text-4xl font-semibold leading-tight text-parch">Основать цивилизацию</h1>
          <p className="mt-3 max-w-md text-[15px] leading-relaxed text-dim">Тридцать дней сезона. Земля, знания и ремесло. Вы решаете, чем станет ваш народ — деревней у реки или империей на костях соседей.</p>
        </div>
      </div>

      <div className="flex flex-col px-5 py-8 sm:px-10 lg:px-14 lg:py-12">
        <div className="mb-8 flex items-center gap-3 lg:hidden"><LogoMark size={32} /><span className="font-display text-lg font-semibold">Infinite Forge</span></div>
        <ol className="mb-8 flex items-center gap-2">
          {steps.map((s, i) => (
            <li key={s} className="flex flex-1 flex-col gap-1.5">
              <span className={cn("h-1 rounded-full transition-colors", i <= step ? "bg-bronze" : "bg-line")} />
              <span className={cn("text-[11px] font-medium", i === step ? "text-parch" : "text-faint")}>{s}</span>
            </li>
          ))}
        </ol>

        <div className="flex-1 animate-rise" key={step}>
          {step === 0 && (
            <div className="max-w-lg">
              <h2 className="font-display text-3xl font-semibold">Как назовём ваш народ?</h2>
              <p className="mt-2 text-dim">Имя появится в летописи и в названиях ваших построек.</p>
              <input
                autoFocus value={name} onChange={(e) => setName(e.target.value)} maxLength={24} placeholder="Например, Медный Ворон"
                className="mt-6 h-14 w-full rounded-xl border border-line-strong bg-surface px-4 font-display text-xl text-parch outline-none placeholder:text-faint focus:border-bronze"
              />
              <div className="mt-4 flex flex-wrap gap-2">
                {NAMES.map((n) => (
                  <button key={n} onClick={() => setName(n)} className="rounded-full border border-line px-3 py-1 text-xs text-dim hover:border-bronze hover:text-parch">{n}</button>
                ))}
              </div>
              <p className="mt-4 text-xs text-faint">Можно пропустить — тогда имя возьмём из происхождения.</p>
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
            <div>
              <h2 className="font-display text-3xl font-semibold">С чего начнёте развитие?</h2>
              <p className="mt-2 text-dim">Это первое открытие народа. Позже вы сможете изучить остальные направления.</p>
              <div className="mt-6 grid gap-3">
                {M.OPENING_FOCUSES.map((f: any) => (
                  <button key={f.id} onClick={() => setFocusId(f.id)}
                    className={cn("flex gap-4 rounded-2xl border p-4 text-left transition-all", focusId === f.id ? "border-bronze bg-raised" : "border-line bg-surface hover:border-line-strong hover:bg-raised/60")}>
                    <span className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-ground text-3xl">{f.icon}</span>
                    <span>
                      <span className="font-display block text-lg font-semibold">{f.title}</span>
                      <span className="mt-0.5 block text-[13px] text-dim">Наука «{f.scienceName}» → здание «{f.buildingName}»</span>
                      <span className="mt-1 block text-xs text-faint">{M.EFFECTS[f.effect]?.label}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && origin && focus && (
            <div className="max-w-xl">
              <h2 className="font-display text-3xl font-semibold">{name.trim() || origin.name} готовы к первому дню</h2>
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-4"><span className="text-3xl">{origin.icon}</span><div><Label>Происхождение</Label><div className="font-medium">{origin.name}</div><div className="text-xs text-dim">Стартовый бонус: +{origin.bonus} {RES[origin.resource as ResKey].label.toLowerCase()}</div></div></div>
                <div className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-4"><span className="text-3xl">{focus.icon}</span><div><Label>Первое дело</Label><div className="font-medium">{focus.scienceName}</div><div className="text-xs text-dim">Потом можно построить «{focus.buildingName}»</div></div></div>
              </div>
              <div className="mt-6 rounded-2xl border border-bronze/30 bg-bronze/8 p-4 text-sm leading-relaxed text-dim">
                <div className="mb-1 font-semibold text-bronze-soft">Как устроен день</div>
                Каждый день у вас <b className="text-parch">2 приказа</b>: исследование, строительство, поход за землёй или ковка карты. Затем нажмите «Завершить день» — рабочие соберут ресурсы, а народ съест провизию. Мы подскажем, что делать дальше.
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 flex items-center justify-between gap-3">
          <Btn variant="ghost" onClick={() => setStep(step - 1)} disabled={step === 0}><ArrowLeft size={16} />Назад</Btn>
          {step < 3 ? (
            <Btn variant="primary" size="lg" onClick={() => setStep(step + 1)} disabled={!canNext}>Далее<ArrowRight size={18} /></Btn>
          ) : (
            <Btn variant="primary" size="lg" onClick={begin}><Check size={18} />Основать поселение</Btn>
          )}
        </div>
      </div>
    </div>
  );
}
