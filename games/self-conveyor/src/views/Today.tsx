import { useEffect, useState } from 'react';
import { LIST_LABEL, todayISO } from '../types';
import {
  collectToday,
  completeItem,
  completeRoutine,
  updateItem,
  updateStep,
  useApp,
  type TodayTask,
} from '../store';
import { Check } from '../ui';

// ---- Помодоро с сохранением счётчика за день ----

const POMODORO_KEY = 'self-conveyor-pomodoro';

function loadPomodoro(): { date: string; sessions: number } {
  try {
    const raw = localStorage.getItem(POMODORO_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      if (data.date === todayISO()) return data;
    }
  } catch {
    /* ignore */
  }
  return { date: todayISO(), sessions: 0 };
}

function savePomodoro(sessions: number) {
  try {
    localStorage.setItem(POMODORO_KEY, JSON.stringify({ date: todayISO(), sessions }));
  } catch {
    /* ignore */
  }
}

function Pomodoro({ work, brk }: { work: number; brk: number }) {
  const [mode, setMode] = useState<'idle' | 'work' | 'break'>('idle');
  const [left, setLeft] = useState(work * 60);
  const [sessions, setSessions] = useState(() => loadPomodoro().sessions);

  useEffect(() => {
    if (mode === 'idle') return;
    const t = setInterval(() => {
      setLeft((s) => {
        if (s > 1) return s - 1;
        if (mode === 'work') {
          setSessions((c) => {
            const n = c + 1;
            savePomodoro(n);
            return n;
          });
          setMode('break');
          return brk * 60;
        }
        setMode('work');
        return work * 60;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [mode, work, brk]);

  const mm = String(Math.floor(left / 60)).padStart(2, '0');
  const ss = String(left % 60).padStart(2, '0');

  return (
    <div className="pomodoro">
      <div>
        <div className="time">
          {mm}:{ss}
        </div>
        <div className="mode">
          {mode === 'idle' && 'готов к запуску'}
          {mode === 'work' && 'работа — без отвлечений'}
          {mode === 'break' && 'перерыв'}
        </div>
      </div>
      <div className="row">
        {mode === 'idle' ? (
          <button
            className="primary"
            onClick={() => {
              setLeft(work * 60);
              setMode('work');
            }}
          >
            ▶ старт ({work} мин)
          </button>
        ) : (
          <button onClick={() => setMode('idle')}>⏸ пауза</button>
        )}
        <button
          className="ghost"
          onClick={() => {
            setMode('idle');
            setLeft(work * 60);
          }}
        >
          сброс
        </button>
      </div>
      <div className="grow" />
      <div className="muted small">
        помидорок сегодня: <b style={{ color: 'var(--text)', fontSize: 16 }}>{sessions}</b>
        <br />
        норма 3–5 в день, не больше
      </div>
    </div>
  );
}

// ---- Онбординг (показывается, пока не закрыт) ----

const QUICKSTART_KEY = 'self-conveyor-quickstart-v1';

function Quickstart({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="panel section" style={{ borderColor: 'var(--accent)' }}>
      <div className="row">
        <h2 style={{ fontSize: 14, margin: 0 }} className="grow">
          Как устроен конвейер — 5 шагов базы
        </h2>
        <button className="tiny ghost" onClick={onDismiss}>
          понятно, скрыть
        </button>
      </div>
      <ol className="small" style={{ margin: '10px 0 0 18px', padding: 0, lineHeight: 1.9 }}>
        <li>
          <b>Желания</b> — сваливайте всё, чего хочется (поле быстрого добавления сверху).
        </li>
        <li>
          <b>Отбор и фокус</b> — переносите выжившие желания в «Отфильтрованные», затем выберите ровно{' '}
          <b>ТОП-5</b>. Остальное — в игнор до победы.
        </li>
        <li>
          <b>Цель</b> — сформулируйте «что сделать» с измеримым критерием (кнопка ✨ SMART подставит
          формулировку от ИИ).
        </li>
        <li>
          <b>Проект</b> — разбейте цель на атомарные шаги (✨ или вручную), невыполненные шаги кнопкой
          «☑ в сегодня» отправляйте в план дня.
        </li>
        <li>
          <b>Исполнение</b> — работайте помидорками: 3–5 в день, план — намерение, а не обязательство.
          Закрытие проекта — только через проверку цели.
        </li>
      </ol>
    </div>
  );
}

// ---- Вспомогательные секции ----

function TaskRow({
  task,
  notify,
}: {
  task: TodayTask;
  notify: (m: string) => void;
}) {
  const { kind, item, step, overdue } = task;

  const check = () => {
    if (step) updateStep(item.id, step.id, { done: true });
    else if (kind === 'routine') completeRoutine(item.id);
    else completeItem(item.id);
  };

  const uncheck = () => {
    if (step) updateStep(item.id, step.id, { done: false });
    else if (kind === 'item') updateItem(item.id, { list: 'someday', completedAt: null, inToday: true });
  };

  const removeFromDay = () => {
    if (step) {
      updateStep(item.id, step.id, { inToday: false, done: false });
    } else {
      updateItem(item.id, { inToday: false });
    }
    notify('Убрано из плана на сегодня');
  };

  const checked = step ? step.done : kind === 'routine' ? false : item.list === 'done';
  const title = step ? step.title : item.title;

  return (
    <div className={`today-item ${checked ? 'checked' : ''}`}>
      <Check on={checked} onToggle={() => (checked ? uncheck() : check())} />
      <div className="grow">
        <div className="title">{title}</div>
        <div className="from">
          {step ? `из проекта «${item.title}»` : LIST_LABEL[item.list]}
          {kind === 'routine' && item.nextDue ? ` · следующий срок: ${item.nextDue}` : ''}
          {overdue && <span className="overdue"> · просрочено</span>}
        </div>
      </div>
      {kind === 'routine' && !checked && <span className="chip">↻ рутина</span>}
      {!checked && (
        <button className="tiny ghost" title="Убрать из плана на сегодня" onClick={removeFromDay}>
          ✕
        </button>
      )}
    </div>
  );
}

export function TodayView({ notify }: { notify: (m: string) => void }) {
  const state = useApp();
  const { open, done } = collectToday(state);
  const [quickstart, setQuickstart] = useState(() => {
    try {
      return localStorage.getItem(QUICKSTART_KEY) !== 'hidden';
    } catch {
      return true;
    }
  });

  const dismiss = () => {
    setQuickstart(false);
    try {
      localStorage.setItem(QUICKSTART_KEY, 'hidden');
    } catch {
      /* ignore */
    }
  };

  const steps = open.filter((t) => t.kind === 'step');
  const overdue = open.filter((t) => t.overdue && t.kind !== 'step');
  const routines = open.filter((t) => t.kind === 'routine' && !t.overdue);
  const plain = open.filter((t) => t.kind === 'item' && !t.overdue);

  return (
    <div>
      <h1 className="page-title">Сегодня · {todayISO()}</h1>
      <p className="page-hint">
        План — намерение, не обязательство. Не доделали — просто берите меньше завтра. Это марафон, а не гонка.
      </p>

      {quickstart && <Quickstart onDismiss={dismiss} />}
      <Pomodoro work={state.settings.pomodoroWork} brk={state.settings.pomodoroBreak} />

      {open.length === 0 && !quickstart && (
        <div className="panel muted">
          План на сегодня пуст. Возьмите шаги из проектов (кнопка «☑ в сегодня» на карточке), отметьте дело
          «взять в Сегодня» или добавьте задачу быстрым полем сверху.
        </div>
      )}

      {steps.length > 0 && (
        <div className="today-section">
          <h2 style={{ fontSize: 15 }}>Из проектов ({steps.length})</h2>
          {steps.map((t) => (
            <TaskRow key={t.step!.id} task={t} notify={notify} />
          ))}
        </div>
      )}

      {overdue.length > 0 && (
        <div className="today-section">
          <h2 style={{ fontSize: 15, color: 'var(--red)' }}>Просроченные ({overdue.length})</h2>
          {overdue.map((t) => (
            <TaskRow key={t.item.id} task={t} notify={notify} />
          ))}
        </div>
      )}

      {routines.length > 0 && (
        <div className="today-section">
          <h2 style={{ fontSize: 15 }}>Рутины ({routines.length})</h2>
          {routines.map((t) => (
            <TaskRow key={t.item.id} task={t} notify={notify} />
          ))}
        </div>
      )}

      {plain.length > 0 && (
        <div className="today-section">
          <h2 style={{ fontSize: 15 }}>Взято в работу ({plain.length})</h2>
          {plain.map((t) => (
            <TaskRow key={t.item.id} task={t} notify={notify} />
          ))}
        </div>
      )}

      {done.length > 0 && (
        <div className="today-section">
          <h2 style={{ fontSize: 15, color: 'var(--green)' }}>Сделано сегодня ({done.length})</h2>
          {done.map((t) => (
            <TaskRow key={t.step ? t.step.id : t.item.id} task={t} notify={notify} />
          ))}
        </div>
      )}
    </div>
  );
}
