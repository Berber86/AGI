import { useState } from 'react';
import {
  AFFECT_LABEL,
  COST_LABEL,
  RESISTANCE_LABEL,
  REPEAT_LABEL,
  budgetFor,
  quotaFor,
  todayISO,
  tomorrowISO,
  type Item,
} from '../types';
import {
  closeDay,
  completeDueItem,
  dueBucket,
  dueRoutines,
  getDay,
  planAdd,
  planComplete,
  planRemove,
  poolItems,
  reschedule,
  reopenDay,
  setEnergy,
  setEvening,
  useApp,
} from '../store';
import { ProtocolModal } from './Protocol';
import { Check } from '../ui';

const QUICKSTART_KEY = 'self-conveyor-quickstart-v2';

function Quickstart({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="panel section" style={{ borderColor: 'var(--accent)' }}>
      <div className="row">
        <h2 style={{ fontSize: 14, margin: 0 }} className="grow">
          Два механизма — вот и вся система
        </h2>
        <button className="tiny ghost" onClick={onDismiss}>
          понятно, скрыть
        </button>
      </div>
      <ol className="small" style={{ margin: '10px 0 0 18px', padding: 0, lineHeight: 1.9 }}>
        <li>
          <b>По силам.</b> Утром отметьте силы (1–5) — день соберётся из бюджета сил, а не из списка
          «должен». Квота закрывает день: набрали план — конвейеру можно выключаться. Никаких просроченных.
        </li>
        <li>
          <b>Протокол избегания.</b> Дело, которого тянет избежать, — не напоминание, а протокол: назвать
          страх → разрешение сделать плохо и на 2 минуты → старт → сверка «что было на самом деле».
          Страх почти всегда преувеличивает.
        </li>
      </ol>
    </div>
  );
}

function DueRow({
  item,
  overdue,
  onProtocol,
  notify,
}: {
  item: Item;
  overdue: boolean;
  onProtocol: (item: Item) => void;
  notify: (m: string, err?: boolean) => void;
}) {
  const isRoutine = item.repeat !== 'none';
  return (
    <div className="today-item">
      <Check
        on={false}
        onToggle={() => {
          completeDueItem(item.id);
          notify(isRoutine ? `Рутина выполнена — следующий срок: ${item.due ?? '—'}` : 'Сделано ✓');
        }}
      />
      <div className="grow">
        <div className="title">{item.title}</div>
        <div className="from">
          {isRoutine ? `↻ ${REPEAT_LABEL[item.repeat]}` : `📅 срок ${item.due}`}
          {overdue && <span className="overdue"> · просрочено</span>}
          {item.resistance >= 2 && ' · 🫁 избегание'}
        </div>
      </div>
      {item.resistance >= 2 && (
        <button className="tiny ai" onClick={() => onProtocol(item)}>
          🫁 избегаю
        </button>
      )}
      {!isRoutine && (
        <button
          className="tiny ghost"
          title="Перенести на завтра"
          onClick={() => {
            reschedule(item.id, tomorrowISO());
            notify('Перенесено на завтра');
          }}
        >
          → завтра
        </button>
      )}
      {!isRoutine && (
        <button
          className="tiny ghost"
          title="Снять срок — дело уйдёт в «когда-нибудь»"
          onClick={() => {
            reschedule(item.id, null);
            notify('Срок снят — дело свободно ждёт на складе');
          }}
        >
          снять срок
        </button>
      )}
    </div>
  );
}

function PlanCard({
  item,
  joy,
  done,
  onProtocol,
  notify,
}: {
  item: Item;
  joy: boolean;
  done: boolean;
  onProtocol: (item: Item) => void;
  notify: (m: string, err?: boolean) => void;
}) {
  return (
    <div className={`today-item ${done ? 'checked' : ''}`}>
      <Check
        on={done}
        onToggle={() => {
          if (!done) {
            planComplete(item.id);
            notify('Сделано ✓');
          }
        }}
      />
      <div className="grow">
        <div className="title">{item.title}</div>
        <div className="from">
          {joy ? 'слот «на радость» · ' : ''}
          стоимость: {COST_LABEL[item.cost]}
          {item.resistance > 0 && ` · сопротивление: ${RESISTANCE_LABEL[item.resistance]}`}
          {item.affect !== 'none' && ` · ${AFFECT_LABEL[item.affect]}`}
        </div>
      </div>
      {!done && item.resistance >= 2 && (
        <button className="tiny ai" title="Протокол избегания" onClick={() => onProtocol(item)}>
          🫁 избегаю
        </button>
      )}
      {!done && (
        <button className="tiny ghost" title="Протокол избегания — для любого дела" onClick={() => onProtocol(item)}>
          протокол
        </button>
      )}
      {!done && (
        <button
          className="tiny ghost"
          title="Убрать из плана"
          onClick={() => {
            planRemove(item.id);
            notify('Убрано из плана');
          }}
        >
          ✕
        </button>
      )}
    </div>
  );
}

export function TodayView({ notify }: { notify: (m: string, err?: boolean) => void }) {
  const state = useApp();
  const day = getDay(state);
  const [protocolItem, setProtocolItem] = useState<Item | null>(null);
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

  const budget = budgetFor(day.energy);
  const quota = quotaFor(day.energy, state.settings.quotaMax);
  const nonJoy = day.plan.filter((p) => !p.joy);
  const spent = nonJoy.reduce((sum, p) => sum + (state.items.find((i) => i.id === p.itemId)?.cost ?? 0), 0);
  const itemsById = (id: string) => state.items.find((i) => i.id === id);

  const candidates = poolItems(state)
    .filter((it) => !day.plan.some((p) => p.itemId === it.id))
    .sort((a, b) => b.resistance - a.resistance || a.cost - b.cost);

  const allDone = day.plan.length > 0 && day.plan.every((p) => p.done);
  const shuttered = day.closed || allDone;
  const due = dueBucket(state);
  const routines = dueRoutines(state);

  return (
    <div>
      <h1 className="page-title">Сегодня · {todayISO()}</h1>
      <p className="page-hint">
        День собирается из ваших сил, а не из чувства долга. Набрали квоту — день закрыт, остальное спит.
      </p>

      {quickstart && <Quickstart onDismiss={dismiss} />}

      {/* ---- Чекин сил ---- */}
      <div className="panel section">
        <div className="row">
          <b className="grow">Силы сейчас:</b>
          {[1, 2, 3, 4, 5].map((e) => (
            <button
              key={e}
              className={day.energy === e ? 'primary' : ''}
              onClick={() => setEnergy(e)}
              title={e <= 2 ? 'выживание' : e === 3 ? 'обычный день' : 'хороший ресурс'}
            >
              {e}
            </button>
          ))}
          {day.energy == null && <span className="muted small">отметьте 1–5 — и система соберёт план по силам</span>}
        </div>
        {day.energy != null && (
          <div className="small muted" style={{ marginTop: 8 }}>
            бюджет дня: <b style={{ color: 'var(--text)' }}>{spent}/{budget}</b> единиц стоимости ·
            квота: <b style={{ color: 'var(--text)' }}>{nonJoy.length}/{quota}</b> дел
            {day.energy <= 2 && ' · режим выживания: система не осуждает'}
          </div>
        )}
        {day.energy != null && (
          <div className="budget-bar">
            <div
              className={`budget-fill ${spent >= budget ? 'full' : ''}`}
              style={{ width: `${Math.min(100, (spent / Math.max(1, budget)) * 100)}%` }}
            />
          </div>
        )}
      </div>

      {/* ---- Шторка ---- */}
      {shuttered && (
        <div className={`panel section ${allDone ? 'shutter-done' : 'shutter'}`}>
          <div className="row">
            <div className="grow">
              <b style={{ fontSize: 15 }}>{allDone ? 'Всё на сегодня выполнено 🎉' : 'День закрыт'}</b>
              <div className="small" style={{ marginTop: 4 }}>
                Остальное спит до завтра. Жизнь — не бэклог: конвейер выключен по правилам, а не по вине.
              </div>
            </div>
            {!allDone && (
              <button className="ghost" onClick={() => reopenDay()}>
                открыть заново
              </button>
            )}
          </div>
        </div>
      )}

      {/* ---- Обязательства: сроки и рутины (не зависят от квоты) ---- */}
      {(due.overdue.length > 0 || due.dueToday.length > 0) && (
        <div className="today-section">
          <h2 style={{ fontSize: 15 }}>
            ⏱ По сроку ({due.overdue.length + due.dueToday.length})
          </h2>
          {due.overdue.map((it) => (
            <DueRow key={it.id} item={it} overdue onProtocol={setProtocolItem} notify={notify} />
          ))}
          {due.dueToday.map((it) => (
            <DueRow key={it.id} item={it} overdue={false} onProtocol={setProtocolItem} notify={notify} />
          ))}
        </div>
      )}

      {(routines.overdue.length > 0 || routines.dueToday.length > 0) && (
        <div className="today-section">
          <h2 style={{ fontSize: 15 }}>
            ↻ Рутины ({routines.overdue.length + routines.dueToday.length})
          </h2>
          {routines.overdue.map((it) => (
            <DueRow key={it.id} item={it} overdue onProtocol={setProtocolItem} notify={notify} />
          ))}
          {routines.dueToday.map((it) => (
            <DueRow key={it.id} item={it} overdue={false} onProtocol={setProtocolItem} notify={notify} />
          ))}
        </div>
      )}

      {/* ---- План дня ---- */}
      <div className="today-section">
        <h2 style={{ fontSize: 15 }}>
          План дня ({day.plan.filter((p) => p.done).length}/{day.plan.length})
        </h2>
        {day.plan.length === 0 && (
          <div className="panel muted">
            {day.energy == null
              ? 'Сначала — чекин сил сверху. Потом наберите дела из «Склада» по бюджету.'
              : 'Наберите дела из кандидатов ниже — по бюджету сил, не по чувству долга.'}
          </div>
        )}
        {day.plan.map((p) => {
          const it = itemsById(p.itemId);
          if (!it) return null;
          return (
            <PlanCard
              key={p.itemId}
              item={it}
              joy={p.joy}
              done={p.done}
              onProtocol={setProtocolItem}
              notify={notify}
            />
          );
        })}
        {day.plan.length > 0 && !shuttered && (
          <button
            className="ghost"
            style={{ marginTop: 8 }}
            onClick={() => {
              closeDay();
              notify('Шторка опущена — день закрыт по квоте');
            }}
          >
            закрыть день (шторка)
          </button>
        )}
      </div>

      {/* ---- Вечерний микро-разбор ---- */}
      <div className="today-section">
        <h2 style={{ fontSize: 15 }}>Как прошёл день?</h2>
        <div className="row">
          {[1, 2, 3, 4, 5].map((e) => (
            <button key={e} className={day.evening === e ? 'primary' : ''} onClick={() => setEvening(e)}>
              {e}
            </button>
          ))}
          <span className="muted small">одним тапом — без анализа и самоедства</span>
        </div>
      </div>

      {/* ---- Кандидаты из склада ---- */}
      {!shuttered && (
        <div className="today-section">
          <h2 style={{ fontSize: 15 }}>Кандидаты со склада</h2>
          {candidates.length === 0 && <div className="panel muted">Склад пуст или всё уже в плане.</div>}
          {candidates.map((it) => {
            const freeJoy = !day.plan.some((p) => p.joy);
            return (
              <div key={it.id} className="today-item">
                <div className="grow">
                  <div className="title">{it.title}</div>
                  <div className="from">
                    {COST_LABEL[it.cost]} · {RESISTANCE_LABEL[it.resistance]}
                    {it.affect !== 'none' && ` · ${AFFECT_LABEL[it.affect]}`}
                  </div>
                </div>
                <button
                  className="tiny primary"
                  title="В план дня"
                  onClick={() => {
                    const res = planAdd(it.id, false);
                    if (!res.ok) notify(res.reason ?? 'не удалось взять', true);
                  }}
                >
                  + в план
                </button>
                {freeJoy && (
                  <button
                    className="tiny"
                    title="Бесплатный слот «на радость» — не тратит бюджет"
                    onClick={() => {
                      const res = planAdd(it.id, true);
                      if (!res.ok) notify(res.reason ?? 'не удалось взять', true);
                    }}
                  >
                    ☺ на радость
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {protocolItem && (
        <ProtocolModal
          item={protocolItem}
          onClose={() => setProtocolItem(null)}
          notify={notify}
        />
      )}
    </div>
  );
}
