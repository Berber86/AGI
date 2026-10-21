import { useEffect, useState, type DragEvent } from 'react';
import {
  LIST_HINT,
  LIST_LABEL,
  MAIN_ORDER,
  REPEAT_LABEL,
  type AnyList,
  type Item,
  type RepeatKind,
  type Step,
} from '../types';
import {
  addItem,
  addStep,
  completeItem,
  copyTemplateToProject,
  deleteItem,
  deleteStep,
  moveForward,
  moveItem,
  takeAllStepsToToday,
  updateItem,
  updateStep,
  useApp,
  isProjectReady,
} from '../store';
import { aiDecompose, aiSmartFormulate } from '../ai';
import { Check, ErrorBox, Field, Modal, useAIAction } from '../ui';

// ===================== Редактор карточки =====================

export function ItemModal({
  item,
  onClose,
  notify,
  focusSteps,
}: {
  item: Item;
  onClose: () => void;
  notify: (m: string, err?: boolean) => void;
  focusSteps?: boolean;
}) {
  const state = useApp();
  const [title, setTitle] = useState(item.title);
  const [notes, setNotes] = useState(item.notes);
  const [criteria, setCriteria] = useState(item.criteria);
  const [result, setResult] = useState(item.result);
  const [list, setList] = useState<AnyList>(item.list);
  const [repeat, setRepeat] = useState<RepeatKind>(item.repeat);
  const [nextDue, setNextDue] = useState(item.nextDue ?? '');
  const [inToday, setInToday] = useState(item.inToday);
  const [newStep, setNewStep] = useState('');
  const { busy, error, run } = useAIAction();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const save = () => {
    if (!title.trim()) {
      notify('Название не может быть пустым', true);
      return;
    }
    updateItem(item.id, {
      title: title.trim(),
      notes,
      criteria,
      result,
      list,
      repeat,
      nextDue: nextDue || null,
      inToday,
    });
    onClose();
    notify('Сохранено');
  };

  const currentItem = state.items.find((x) => x.id === item.id) ?? item;

  return (
    <Modal title={item.title ? `Карточка · ${LIST_LABEL[item.list]}` : 'Новая карточка'} onClose={onClose}>
      <Field label="Название">
        <input value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
      </Field>
      <div className="grid2">
        <Field label="Список">
          <select value={list} onChange={(e) => setList(e.target.value as AnyList)}>
            {(Object.keys(LIST_LABEL) as AnyList[]).map((l) => (
              <option key={l} value={l}>
                {LIST_LABEL[l]}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Повтор (для рутин)">
          <select value={repeat} onChange={(e) => setRepeat(e.target.value as RepeatKind)}>
            {(Object.keys(REPEAT_LABEL) as RepeatKind[]).map((r) => (
              <option key={r} value={r}>
                {REPEAT_LABEL[r]}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <div className="grid2">
        <Field label="Дата (для срочных / рутин)">
          <input type="date" value={nextDue} onChange={(e) => setNextDue(e.target.value)} />
        </Field>
        <Field label="Критерий достижения (измеримый)">
          <input
            value={criteria}
            onChange={(e) => setCriteria(e.target.value)}
            placeholder="напр.: 10 000 ₽ на счёте"
          />
        </Field>
      </div>
      <Field label="Осязаемый результат (анти-ложная продуктивность)">
        <input
          value={result}
          onChange={(e) => setResult(e.target.value)}
          placeholder="что я смогу «потрогать» в итоге"
        />
      </Field>
      <Field label="Заметки">
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
      </Field>

      <Field label="Метапроекты (теги)">
        <div className="row">
          {state.metaprojects.map((t) => {
            const on = currentItem.tags.includes(t);
            return (
              <span
                key={t}
                className={`chip ${on ? 'on' : ''}`}
                style={{ cursor: 'pointer' }}
                onClick={() =>
                  updateItem(item.id, {
                    tags: on ? currentItem.tags.filter((x) => x !== t) : [...currentItem.tags, t],
                  })
                }
              >
                #{t}
              </span>
            );
          })}
          {state.metaprojects.length === 0 && (
            <span className="muted small">теги появятся после добавления метапроектов (черновик этапа 3)</span>
          )}
        </div>
      </Field>

      <div className="section">
        <h2>Шаги (атомарные)</h2>
        {currentItem.steps.length === 0 && (
          <div className="small muted" style={{ marginBottom: 8 }}>
            Правило базы: цель превращается в проект только после разбивки на короткие очевидные шаги —
            «думать» отделено от «делать».
          </div>
        )}
        {currentItem.steps.map((st: Step) => (
          <div key={st.id} className="list-row">
            <Check on={st.done} onToggle={() => updateStep(item.id, st.id, { done: !st.done })} />
            <div className="grow" style={{ opacity: st.done ? 0.5 : 1 }}>
              {st.title}
            </div>
            <label className="small muted row" style={{ gap: 4 }}>
              <input
                type="checkbox"
                style={{ width: 'auto' }}
                checked={st.inToday}
                onChange={(e) => updateStep(item.id, st.id, { inToday: e.target.checked })}
              />
              сегодня
            </label>
            <button className="tiny danger" title="Удалить шаг" onClick={() => deleteStep(item.id, st.id)}>
              ✕
            </button>
          </div>
        ))}
        <div className="addbox">
          <input
            value={newStep}
            placeholder="новый шаг…"
            autoFocus={focusSteps}
            onChange={(e) => setNewStep(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && newStep.trim()) {
                addStep(item.id, newStep.trim());
                setNewStep('');
              }
            }}
          />
          <button
            onClick={() => {
              if (newStep.trim()) {
                addStep(item.id, newStep.trim());
                setNewStep('');
              }
            }}
          >
            + шаг
          </button>
          <button
            className="ai"
            disabled={busy === 'decompose'}
            onClick={() =>
              run('decompose', async () => {
                const res = await aiDecompose(state.settings.llm, title, notes);
                for (const t of res.steps) addStep(item.id, t);
                notify(`Добавлено шагов: ${res.steps.length}`);
              })
            }
          >
            {busy === 'decompose' ? 'думаю…' : '✨ разбить (ИИ)'}
          </button>
        </div>
        <ErrorBox error={error} />
      </div>

      <div className="row">
        <label className="row small" style={{ gap: 6 }}>
          <input
            type="checkbox"
            style={{ width: 'auto' }}
            checked={inToday}
            onChange={(e) => setInToday(e.target.checked)}
          />
          взять дело в «Сегодня»
        </label>
        <button
          className="ai"
          disabled={busy === 'smart'}
          onClick={() =>
            run('smart', async () => {
              const res = await aiSmartFormulate(state.settings.llm, title, notes);
              setTitle(res.title);
              setCriteria(res.criteria);
              setResult(res.result);
              notify('SMART-формулировка применена — проверьте и сохраните');
            })
          }
        >
          {busy === 'smart' ? '…' : '✨ SMART-формулировка (ИИ)'}
        </button>
      </div>

      <div className="footer">
        <button
          className="danger"
          onClick={() => {
            deleteItem(item.id);
            onClose();
            notify('Удалено');
          }}
        >
          Удалить
        </button>
        <div className="row">
          <button className="ghost" onClick={onClose}>
            Отмена
          </button>
          <button className="primary" onClick={save}>
            Сохранить
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ===================== Проверка цели перед закрытием =====================

function CompleteModal({
  item,
  onClose,
  onNeedSteps,
  notify,
}: {
  item: Item;
  onClose: () => void;
  onNeedSteps: () => void;
  notify: (m: string, err?: boolean) => void;
}) {
  const ready = isProjectReady(item);
  return (
    <Modal title="Проверка цели" onClose={onClose}>
      <p>
        <b>{item.title}</b>
      </p>
      <div className="panel" style={{ marginBottom: 12 }}>
        {item.criteria ? (
          <div className="small">
            Критерий достижения: <b>{item.criteria}</b>
          </div>
        ) : (
          <div className="small muted">Критерий достижения не задан — задайте его в карточке, иначе «сделано» не проверяемо.</div>
        )}
        {item.result && <div className="small" style={{ marginTop: 4 }}>Осязаемый результат: {item.result}</div>}
        {item.steps.length > 0 && (
          <div className="small" style={{ marginTop: 4 }}>
            Шаги: {item.steps.filter((s) => s.done).length}/{item.steps.length} {ready ? '✓' : ''}
          </div>
        )}
      </div>
      {!ready && item.steps.length > 0 && (
        <div className="error-box">
          Не все шаги выполнены. По методике: если цель не достигнута — шаги были расписаны неверно,
          добавьте недостающие.
        </div>
      )}
      <div className="row">
        <button
          className="primary"
          onClick={() => {
            completeItem(item.id);
            onClose();
            notify('Цель закрыта и ушла в «Сделано» 🎉');
          }}
        >
          ✓ Цель достигнута → Сделано
        </button>
        <button
          onClick={() => {
            onClose();
            onNeedSteps();
          }}
        >
          + добавить шаги
        </button>
        <button className="ghost" onClick={onClose}>
          отмена
        </button>
      </div>
    </Modal>
  );
}

// ===================== Карточка =====================

function Card({
  item,
  onOpen,
  onNotify,
  onComplete,
}: {
  item: Item;
  onOpen: (item: Item) => void;
  onNotify: (m: string, err?: boolean) => void;
  onComplete: (item: Item) => void;
}) {
  const state = useApp();
  const { busy, run } = useAIAction();
  const stepsDone = item.steps.filter((s) => s.done).length;
  const canForward = (MAIN_ORDER as AnyList[]).includes(item.list) && item.list !== 'done';
  const ready = isProjectReady(item);

  const forward = () => {
    const idx = MAIN_ORDER.indexOf(item.list as never);
    const next = MAIN_ORDER[idx + 1];
    if (next === undefined) return;
    if (item.list === 'filtered' && (next as AnyList) === 'priorities' && state.items.filter((i) => i.list === 'priorities').length >= 5) {
      onNotify('ТОП-5 уже полон — сначала освободите приоритетные');
      return;
    }
    if (next === 'done') {
      onComplete(item); // всегда через проверку цели
      return;
    }
    moveForward(item.id);
  };

  return (
    <div
      className={`card ${item.list === 'done' ? 'done-card' : ''}`}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', item.id);
        e.dataTransfer.effectAllowed = 'move';
      }}
      onClick={() => onOpen(item)}
    >
      <div className="title">{item.title || <span className="muted">без названия</span>}</div>
      {item.criteria && <div className="small muted">✓ {item.criteria}</div>}
      {item.result && <div className="small muted">→ {item.result}</div>}
      <div className="meta">
        {item.steps.length > 0 && (
          <span className={`chip ${ready ? 'chip-ready' : ''}`}>
            шаги {stepsDone}/{item.steps.length}
          </span>
        )}
        {item.nextDue && (
          <span
            className={`chip ${item.nextDue < new Date().toISOString().slice(0, 10) ? 'overdue' : ''}`}
          >
            📅 {item.nextDue}
          </span>
        )}
        {item.repeat !== 'none' && <span className="chip">↻ {REPEAT_LABEL[item.repeat]}</span>}
        {item.tags.map((t) => (
          <span key={t} className="chip">
            #{t}
          </span>
        ))}
        {item.origin !== 'manual' && <span className="chip">{item.origin}</span>}
      </div>
      <div className="actions" onClick={(e) => e.stopPropagation()}>
        {canForward && (
          <button className="tiny" title="Дальше по конвейеру" onClick={forward}>
            →
          </button>
        )}
        {item.steps.length > 0 && (
          <button
            className="tiny"
            title="Все незакрытые шаги — в план на сегодня"
            onClick={() => {
              const n = takeAllStepsToToday(item.id);
              onNotify(n > 0 ? `Шагов взято в «Сегодня»: ${n}` : 'Все шаги уже в плане или выполнены');
            }}
          >
            ☑ в сегодня
          </button>
        )}
        {item.list === 'goals' && (
          <button
            className="tiny ai"
            disabled={busy === 'decompose'}
            onClick={() =>
              run('decompose', async () => {
                const res = await aiDecompose(state.settings.llm, item.title, item.notes);
                updateItem(item.id, {
                  list: 'projects',
                  steps: res.steps.map((t) => ({
                    id: Math.random().toString(36).slice(2),
                    title: t,
                    done: false,
                    inToday: false,
                  })),
                });
                onNotify('Шаги добавлены — цель стала проектом');
              })
            }
          >
            {busy === 'decompose' ? '…' : '✨ шаги (ИИ)'}
          </button>
        )}
        {item.list === 'templates' && (
          <button
            className="tiny"
            onClick={() => {
              copyTemplateToProject(item.id);
              onNotify('Копия шаблона — в проектах');
            }}
          >
            копия → проект
          </button>
        )}
        <button className="tiny" onClick={() => onOpen(item)}>
          ⋯
        </button>
      </div>
    </div>
  );
}

// ===================== Доска =====================

const SIDE_LISTS: AnyList[] = ['urgent', 'someday', 'routines', 'templates'];

export function BoardView({ notify }: { notify: (m: string) => void }) {
  const state = useApp();
  const [openId, setOpenId] = useState<string | null>(null);
  const [completeId, setCompleteId] = useState<string | null>(null);
  const [needStepsId, setNeedStepsId] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [query, setQuery] = useState('');
  const [dropping, setDropping] = useState<AnyList | null>(null);

  const openItem = state.items.find((it) => it.id === openId) ?? null;
  const completeItemRef = state.items.find((it) => it.id === completeId) ?? null;
  const needStepsItem = state.items.find((it) => it.id === needStepsId) ?? null;

  const q = query.trim().toLowerCase();
  const matches = (it: Item) =>
    !q ||
    it.title.toLowerCase().includes(q) ||
    it.notes.toLowerCase().includes(q) ||
    it.criteria.toLowerCase().includes(q) ||
    it.tags.some((t) => t.toLowerCase().includes(q));

  const byList = (l: AnyList) => state.items.filter((it) => it.list === l && matches(it));

  const drop = (e: DragEvent, list: AnyList) => {
    e.preventDefault();
    setDropping(null);
    const id = e.dataTransfer.getData('text/plain');
    if (!id) return;
    const it = state.items.find((x) => x.id === id);
    if (!it || it.list === list) return;
    if (list === 'done') {
      setCompleteId(id); // закрытие — всегда через проверку цели
      return;
    }
    if (list === 'priorities' && state.items.filter((i) => i.list === 'priorities').length >= 5) {
      notify('ТОП-5 уже полон — сначала освободите приоритетные');
      return;
    }
    moveItem(id, list);
  };

  const Column = ({ list }: { list: AnyList }) => {
    const items = byList(list);
    return (
      <div
        className={`col ${dropping === list ? 'dropping' : ''}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDropping(list);
        }}
        onDragLeave={() => setDropping((d) => (d === list ? null : d))}
        onDrop={(e) => drop(e, list)}
      >
        <h3>
          {LIST_LABEL[list]}
          <span className="count">{items.length}</span>
        </h3>
        <div className="hint">{LIST_HINT[list]}</div>
        {list === 'priorities' && items.length >= 5 && (
          <div className="small" style={{ color: 'var(--orange)', marginBottom: 6 }}>
            Фокус выбран — 5/5
          </div>
        )}
        {items.map((it) => (
          <Card
            key={it.id}
            item={it}
            onOpen={(x) => setOpenId(x.id)}
            onNotify={notify}
            onComplete={(x) => setCompleteId(x.id)}
          />
        ))}
        <div className="addbox">
          <input
            placeholder="+ карточка"
            value={drafts[list] ?? ''}
            onChange={(e) => setDrafts((d) => ({ ...d, [list]: e.target.value }))}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (drafts[list] ?? '').trim()) {
                addItem({ title: drafts[list]!.trim(), list });
                setDrafts((d) => ({ ...d, [list]: '' }));
              }
            }}
          />
          <button
            title="Добавить"
            onClick={() => {
              const t = (drafts[list] ?? '').trim();
              if (t) {
                addItem({ title: t, list });
                setDrafts((d) => ({ ...d, [list]: '' }));
              }
            }}
          >
            +
          </button>
        </div>
      </div>
    );
  };

  return (
    <div>
      <h1 className="page-title">Конвейер</h1>
      <p className="page-hint">
        Желание двигается по спискам слева направо: отбор → фокус → цель → проект со шагами → «Сделано».
        Перетаскивайте карточки мышью или кнопкой «→». Закрытие проекта всегда идёт через проверку цели.
      </p>
      <div className="row" style={{ marginBottom: 12 }}>
        <input
          className="grow"
          style={{ maxWidth: 320 }}
          placeholder="поиск по карточкам…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button className="ghost" onClick={() => setQuery('')}>
            сбросить
          </button>
        )}
      </div>
      <div className="board">
        {MAIN_ORDER.map((l) => (
          <Column key={l} list={l} />
        ))}
      </div>
      <hr className="sep" />
      <h2 style={{ fontSize: 15 }}>Служебные списки</h2>
      <p className="page-hint">Мелкие и повторяющиеся дела не прогоняются через весь конвейер — они падают прямо в «Сегодня».</p>
      <div className="board" style={{ gridTemplateColumns: 'repeat(4, minmax(220px, 1fr))' }}>
        {SIDE_LISTS.map((l) => (
          <Column key={l} list={l} />
        ))}
      </div>

      {openItem && <ItemModal item={openItem} onClose={() => setOpenId(null)} notify={notify} />}
      {needStepsItem && (
        <ItemModal
          item={needStepsItem}
          onClose={() => setNeedStepsId(null)}
          notify={notify}
          focusSteps
        />
      )}
      {completeItemRef && (
        <CompleteModal
          item={completeItemRef}
          onClose={() => setCompleteId(null)}
          onNeedSteps={() => setNeedStepsId(completeItemRef.id)}
          notify={notify}
        />
      )}
    </div>
  );
}
