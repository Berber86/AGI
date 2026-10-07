import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Heart, Layers, Swords, Zap } from "lucide-react";
import { cn } from "@/utils/cn";
import { M } from "@/game/model";
import { useStore } from "@/game/store";
import { Btn, Chip, Label } from "@/components/ui";
import { LogoMark } from "@/components/Shell";
import art from "../../assets/infinite-forge-battlefield.jpg";

// Два осознанных выбора — и народ основан. Наследие и замысел меняют бой; один замысел также
// даёт вторую стартовую карту в руку. Первые карты игрок выкует у ИИ-кузнеца после онбординга.
// Третьего свойства («Происхождение») больше нет: земля дублировала замысел — и тем же бонусом
// (+1 к приросту энергии у степи и «Стада и воли»), и ролью в имени народа.
// Шага «Имя» по-прежнему нет: имя складывается из двух свойств (M.peopleName — наследие даёт
// основу, замысел судьбу), поэтому имён 30, а не шесть.
const STEPS = ["Наследие", "Замысел"];

/** Боевые бонусы выбора одной строкой: «+1 здоровье вождя». */
function perksOf(bonus: any): string[] {
  return M.describePerks(bonus || {}) as string[];
}

export default function Onboarding() {
  const { game, foundPeople, go, toast } = useStore();
  const p = game.player;
  const [step, setStep] = useState(0);
  // Наследие: культуры Каменного века лежат в игре целиком, и игрок выбирает одну сам.
  const startCultures: any[] = M.HISTORICAL_CULTURES.filter((c: any) => c.era === 0);
  const [cultureId, setCultureId] = useState<string | null>(() => {
    const saved = p.historicalCulture?.id;
    return saved && startCultures.some((c: any) => c.id === saved) ? saved : null;
  });
  const [seedId, setSeedId] = useState<string | null>(p.seedChoiceId || null);
  const [error, setError] = useState("");

  const culture = startCultures.find((c: any) => c.id === cultureId) || null;
  const seed = (M.SEED_CHOICES || []).find((c: any) => c.id === seedId) || null;
  const people = culture && seed ? (M.peopleName(culture, seed) as string) : "";
  const last = step === STEPS.length - 1;
  const canNext = step === 0 ? !!cultureId : !!seedId;

  // Живая сводка вождя: считается на настоящем состоянии, поэтому игрок видит итог обоих выборов
  // до основания народа — ровно те числа, с которыми он выйдет в первый бой.
  const preview = useMemo(() => {
    if (!cultureId || !seedId) return null;
    const trial = M.foundCampaign(M.createState(), { seedId, historicalCultureId: cultureId });
    return trial.error ? null : M.getBattleConfig(trial.state);
  }, [cultureId, seedId]);

  /** Народ основан: игрок сразу в лагере, где военный стол и улучшения за славу. */
  const found = () => {
    if (!seedId || !cultureId) return;
    const res = foundPeople({ seedId, historicalCultureId: cultureId });
    if (!res.ok) { setError(res.error || "Не удалось основать народ."); return; }
    setError("");
    go("forge");
    toast(`${people} основан. Выкуйте у ИИ-кузнеца первую карту — она автоматически попадёт в колоду.`, "ok");
  };

  return (
    <div className="grid min-h-dvh lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <div className="relative hidden overflow-hidden lg:block">
        <img src={art} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ground via-ground/50 to-ground/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-ground" />
        <div className="absolute bottom-10 left-10 right-16">
          <LogoMark size={44} />
          <h1 className="font-display mt-4 text-4xl font-semibold leading-tight text-parch">Основать народ и выйти в бой</h1>
          <p className="mt-3 max-w-md text-[15px] leading-relaxed text-dim">
            Два выбора — наследие и замысел. Каждый меняет вождя в бою: здоровье, энергию, размер
            колоды и стартовую руку. Вместе они дают народу имя. Первую карту выкует ИИ-кузнец;
            затем можно выйти на военный стол.
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
            <div className="max-w-3xl">
              <h2 className="font-display text-3xl font-semibold">Кем пришли в этот мир?</h2>
              <p className="mt-2 text-dim">
                Это наследие народа — древняя культура, чьи обычаи он несёт. Кузнец читает её в каждой карте,
                а боевой бонус действует с первого боя. Сменить наследие можно при переходе в новую эпоху.
              История культуры вдохновляет кузнеца, но не обязана повторяться в каждой карте.
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
                    <div className="mt-2 flex flex-wrap gap-1">{perksOf(M.cultureCombatBonus(c)).map((perk: string) => <Chip key={perk} tone="bronze">{perk}</Chip>)}</div>
                  </button>
                ))}
              </div>
              <p className="mt-4 text-xs text-faint">
                Все шесть культур Каменного века настоящие: даты, места и находки — из археологии. Боевой бонус
                выводится из того, чем культура жила: камень и металл идут в оружие, избыток еды — в выносливость вождя.
                Наследие даёт и первую половину имени народа — вторую добавит замысел.
              </p>
            </div>
          )}

          {step === 1 && (
            <div className="max-w-3xl">
              <h2 className="font-display text-3xl font-semibold">Чем живёт ваш народ?</h2>
              <p className="mt-2 text-dim">
                Замысел — это менталитет народа: что он считает богатством, во что верит и как воюет.
                Он попадает в промпты кузнеца и даёт свой боевой бонус.
              </p>

              <div className="mt-5 rounded-2xl border border-bronze/30 bg-bronze/8 p-4">
                <Label>Ваш народ</Label>
                <div className="mt-1.5 font-display text-2xl font-semibold text-parch">{people || "Безымянный народ"}</div>
                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                  {culture && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-bronze/40 bg-bronze/10 px-3 py-1.5 text-parch">
                      <span className="text-base">{culture.icon}</span>{culture.name}
                    </span>
                  )}
                </div>
                {preview && (
                  <div className="mt-3 flex flex-wrap gap-2 border-t border-bronze/25 pt-3">
                    <Chip tone="ok"><Heart size={12} />вождь {preview.hp} HP</Chip>
                    <Chip tone="know"><Layers size={12} />колода до {preview.deckLimit}</Chip>
                    <Chip tone="neutral"><Layers size={12} />рука на старте: {preview.openingHand}</Chip>
                    <Chip tone="bronze"><Zap size={12} />энергия до {preview.energyMax}, +{preview.energyGrowth}/ход</Chip>
                    {preview.atkBonus > 0 && <Chip tone="clay"><Swords size={12} />атака +{preview.atkBonus}</Chip>}
                    {preview.fatigueDelay > 0 && <Chip tone="ok">усталость позже на {preview.fatigueDelay}</Chip>}
                  </div>
                )}
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {(M.SEED_CHOICES || []).map((c: any) => (
                  <button key={c.id} onClick={() => setSeedId(c.id)}
                    className={cn("flex flex-col items-start rounded-2xl border p-4 text-left transition-all", seedId === c.id ? "border-bronze bg-raised" : "border-line bg-surface hover:border-line-strong hover:bg-raised/60")}>
                    <div className="flex w-full items-start justify-between gap-2">
                      <span className="text-3xl">{c.icon}</span>
                      <span className="flex flex-wrap items-center justify-end gap-1">
                        {perksOf(c.combat).map((perk: string) => <Chip key={perk} tone={seedId === c.id ? "bronze" : "neutral"}>{perk}</Chip>)}
                        {Number(c.openingHand) > 1 && <Chip tone={seedId === c.id ? "bronze" : "neutral"}><Layers size={12} />Рука: {c.openingHand}</Chip>}
                        {seedId === c.id && <Check size={16} className="text-bronze" />}
                      </span>
                    </div>
                    <div className="font-display mt-2 text-lg font-semibold">{c.name}</div>
                    <p className="mt-1.5 text-[13px] leading-snug text-parch/90">«{c.line}»</p>
                    <div className="mt-2 text-[11.5px] leading-snug text-faint">{c.note || c.hint}</div>
                    <div className="mt-2 text-[11.5px] leading-snug text-bronze-soft">{c.combatNote}</div>
                  </button>
                ))}
              </div>

              <div className="mt-5 rounded-2xl border border-line bg-surface p-4 text-sm leading-relaxed text-dim">
                <div className="mb-1 flex items-center gap-2 font-semibold text-parch"><Swords size={15} className="text-bronze" />Что произойдёт дальше</div>
                После основания вы сразу перейдёте к ИИ-кузнецу: выкуйте первую карту, и она автоматически попадёт
                в пустую колоду. Затем в лагере можно выбрать соперника; обе стороны начинают с одной картой в руке,
                а замысел «Знаки неба» открывает две. Победа даёт славу, поражение тоже приносит 2 славы; за неё
                покупают улучшения лагеря и куют новые AI-карты. Состав и слоты настраиваются во вкладке <b className="text-parch">«Армия»</b>.
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
