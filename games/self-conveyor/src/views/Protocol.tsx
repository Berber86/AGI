import { useEffect, useState } from 'react';
import { AFFECT_LABEL, type Item, type ProtocolRun } from '../types';
import { addProtocolRun, useApp } from '../store';
import { aiProtocolHelp } from '../ai';
import { ErrorBox, Modal, useAIAction } from '../ui';

const FEAR_CHIPS = [
  'получится плохо',
  'непонятно с чего начать',
  'скучно / надоедливо',
  'огромно и пугает',
  'устал, не сегодня',
  'стыдно просить / показывать',
];

const PREDICT_LABEL = ['спокойно', 'неприятно', 'тяжело', 'невыносимо'];

/**
 * Механизм 1. Протокол избегания:
 * 1) назвать эмоцию/страх (аффект-фильтр)  2) разрешение «сделать плохо, на 2 минуты»
 * 3) старт на 2 минуты                      4) сверка: что было на самом деле
 */
export function ProtocolModal({
  item,
  onClose,
  notify,
}: {
  item: Item;
  onClose: () => void;
  notify: (m: string) => void;
}) {
  const state = useApp();
  const { busy, error, run } = useAIAction();
  const [step, setStep] = useState(1);
  const [fear, setFear] = useState('');
  const [predicted, setPredicted] = useState(2);
  const [microStep, setMicroStep] = useState(item.microStep);
  const [seconds, setSeconds] = useState(120);
  const [timerOn, setTimerOn] = useState(false);
  const [actual, setActual] = useState(1);

  useEffect(() => {
    if (!timerOn) return;
    const t = setInterval(() => {
      setSeconds((s) => {
        if (s > 1) return s - 1;
        setTimerOn(false);
        setStep(4);
        return 0;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [timerOn]);

  const finish = () => {
    const runEntry: ProtocolRun = {
      at: Date.now(),
      fear: fear.trim() || '(без названия)',
      microStep: microStep.trim(),
      predicted,
      actual: step === 4 ? actual : null,
    };
    addProtocolRun(item.id, runEntry);
    onClose();
    const diff = predicted - actual;
    notify(
      step === 4
        ? diff > 0
          ? `Страх преувеличил: было «${PREDICT_LABEL[predicted]}», по факту «${PREDICT_LABEL[actual]}»`
          : diff === 0
            ? 'Ожидания совпали с фактом — тоже данные'
            : 'Факт оказался тяжелее ожидания — вы это выдержали'
        : 'Протокол сохранён',
    );
  };

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');

  return (
    <Modal title={`Протокол избегания · шаг ${step} из 4`} onClose={onClose}>
      <div className="panel" style={{ marginBottom: 12 }}>
        <b>{item.title}</b>
        <div className="small muted" style={{ marginTop: 4 }}>
          ожидаемая эмоция: {AFFECT_LABEL[item.affect]} · сопротивление: {item.resistance}/3
        </div>
      </div>

      {step === 1 && (
        <div>
          <p className="small">
            Избегание — не лень, а защита от неприятной эмоции. Назовите её — это уже снижает её силу
            (аффект-лейблинг).
          </p>
          <div className="row" style={{ marginBottom: 10 }}>
            {FEAR_CHIPS.map((c) => (
              <span
                key={c}
                className={`chip ${fear === c ? 'on' : ''}`}
                style={{ cursor: 'pointer' }}
                onClick={() => setFear(c)}
              >
                {c}
              </span>
            ))}
          </div>
          <textarea
            placeholder="…или сформулируйте своими словами: чего я тут жду плохого?"
            value={fear}
            onChange={(e) => setFear(e.target.value)}
          />
          <div className="row" style={{ marginTop: 10 }}>
            <span className="small muted">насколько это будет неприятно по моим ожиданиям:</span>
            {PREDICT_LABEL.map((l, i) => (
              <button
                key={l}
                className={`tiny ${predicted === i ? 'primary' : ''}`}
                onClick={() => setPredicted(i)}
              >
                {l}
              </button>
            ))}
            <button
              className="ai"
              disabled={busy === 'help'}
              onClick={() =>
                run('help', async () => {
                  const res = await aiProtocolHelp(state.settings.llm, item.title, item.notes);
                  if (res.fears?.length) setFear(res.fears[0]);
                  if (res.microStep) setMicroStep(res.microStep);
                  notify('ИИ предложил варианты — выберите свой');
                })
              }
            >
              {busy === 'help' ? '…' : '✨ подсказка ИИ'}
            </button>
          </div>
          <ErrorBox error={error} />
          <div className="footer">
            <button className="ghost" onClick={onClose}>
              не сейчас
            </button>
            <button className="primary" onClick={() => setStep(2)}>
              дальше
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <div className="ok-box" style={{ whiteSpace: 'pre-wrap' }}>
            {'Разрешение:\nЯ имею право сделать это ПЛОХО.\nЯ делаю только 2 минуты — не результат, а старт.'}
          </div>
          <textarea
            placeholder="микро-шаг: конкретное физическое действие на 2 минуты (напр.: «открыть файл и написать один абзац криво»)"
            value={microStep}
            onChange={(e) => setMicroStep(e.target.value)}
          />
          <div className="footer">
            <button className="ghost" onClick={() => setStep(1)}>
              назад
            </button>
            <button
              className="primary"
              onClick={() => {
                setStep(3);
                setSeconds(120);
                setTimerOn(true);
              }}
            >
              ▶ старт на 2 минуты
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <div className="pomodoro" style={{ justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div className="time">
                {mm}:{ss}
              </div>
              <div className="mode">делайте плохо — это разрешено</div>
            </div>
          </div>
          <div className="footer">
            <button className="ghost" onClick={() => setTimerOn((v) => !v)}>
              {timerOn ? 'пауза' : 'продолжить'}
            </button>
            <button className="primary" onClick={() => { setTimerOn(false); setStep(4); }}>
              хватит — к факту
            </button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div>
          <p className="small">
            Сверка ожиданий и факта — главный выход протокола: мозг почти всегда преувеличивает
            неприятность избегаемого.
          </p>
          <div className="row" style={{ margin: '10px 0' }}>
            <span className="small muted">что было на самом деле:</span>
            {PREDICT_LABEL.map((l, i) => (
              <button key={l} className={`tiny ${actual === i ? 'primary' : ''}`} onClick={() => setActual(i)}>
                {l}
              </button>
            ))}
          </div>
          <div className="small muted">
            было ожидание: <b>{PREDICT_LABEL[predicted]}</b>
            {predicted > actual ? ' — страх преувеличил ✓' : predicted === actual ? ' — совпало' : ' — факт тяжелее'}
          </div>
          <div className="footer">
            <button
              className="ghost"
              onClick={() => {
                // старт был, но «факт» фиксировать нечего
                addProtocolRun(item.id, {
                  at: Date.now(),
                  fear: fear.trim() || '(без названия)',
                  microStep: microStep.trim(),
                  predicted,
                  actual: null,
                });
                onClose();
              }}
            >
              пропустить сверку
            </button>
            <button className="primary" onClick={finish}>
              сохранить сверку
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
