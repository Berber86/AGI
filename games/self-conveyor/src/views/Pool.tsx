import { useEffect, useState } from 'react';
import {
  AFFECT_LABEL,
  COST_LABEL,
  RESISTANCE_LABEL,
  REPEAT_LABEL,
  todayISO,
  tomorrowISO,
  type AffectKind,
  type Item,
  type RepeatKind,
} from '../types';
import { addItem, deleteItem, dropItem, restoreItem, updateItem, useApp } from '../store';
import { Field, Modal } from '../ui';

const AFFECTS = Object.keys(AFFECT_LABEL) as AffectKind[];
const REPEATS = Object.keys(REPEAT_LABEL) as RepeatKind[];

function weekFromNow(): string {
  return new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);
}

function ItemModal({ item, onClose, notify }: { item: Item; onClose: () => void; notify: (m: string, err?: boolean) => void }) {
  const [title, setTitle] = useState(item.title);
  const [notes, setNotes] = useState(item.notes);
  const [cost, setCost] = useState<1 | 2 | 3>(item.cost);
  const [affect, setAffect] = useState<AffectKind>(item.affect);
  const [resistance, setResistance] = useState(item.resistance);
  const [microStep, setMicroStep] = useState(item.microStep);
  const [joy, setJoy] = useState(item.joy);
  const [due, setDue] = useState(item.due ?? '');
  const [repeat, setRepeat] = useState<RepeatKind>(item.repeat);

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
      cost,
      affect,
      resistance,
      microStep,
      joy,
      due: due || null,
      repeat,
    });
    onClose();
    notify('Сохранено');
  };

  return (
    <Modal title="Дело" onClose={onClose}>
      <Field label="Название">
        <input value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
      </Field>
      <Field label="Заметки">
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
      </Field>

      <div className="grid2">
        <Field label="Стоимость (мыслетопливо)">
          <select value={cost} onChange={(e) => setCost(Number(e.target.value) as 1 | 2 | 3)}>
            {[1, 2, 3].map((c) => (
              <option key={c} value={c}>
                {COST_LABEL[c as 1 | 2 | 3]}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Ожидаемая эмоция (аффект-фильтр)">
          <select value={affect} onChange={(e) => setAffect(e.target.value as AffectKind)}>
            {AFFECTS.map((a) => (
              <option key={a} value={a}>
                {AFFECT_LABEL[a]}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid2">
        <Field label="Сопротивление / избегание">
          <select value={resistance} onChange={(e) => setResistance(Number(e.target.value))}>
            {RESISTANCE_LABEL.map((l, i) => (
              <option key={l} value={i}>
                {i}/3 — {l}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Микро-шаг «на 2 минуты»">
          <input
            value={microStep}
            onChange={(e) => setMicroStep(e.target.value)}
            placeholder="что можно сделать плохо за 2 минуты"
          />
        </Field>
      </div>

      <div className="grid2">
        <Field label="Срок (для обязательств)">
          <input type="date" value={due} onChange={(e) => setDue(e.target.value)} />
        </Field>
        <Field label="Повтор (рутина)">
          <select value={repeat} onChange={(e) => setRepeat(e.target.value as RepeatKind)}>
            {REPEATS.map((r) => (
              <option key={r} value={r}>
                {REPEAT_LABEL[r]}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <div className="row" style={{ marginBottom: 10 }}>
        <button className="tiny" onClick={() => setDue(todayISO())}>сегодня</button>
        <button className="tiny" onClick={() => setDue(tomorrowISO())}>завтра</button>
        <button className="tiny" onClick={() => setDue(weekFromNow())}>+ неделя</button>
        <button className="tiny" onClick={() => setDue('')}>без срока</button>
        <span className="small muted">
          честный тест: «что будет, если просрочу?» — если «ничего», срок не ставьте
        </span>
      </div>

      <label className="row small" style={{ gap: 6, marginBottom: 12 }}>
        <input type="checkbox" style={{ width: 'auto' }} checked={joy} onChange={(e) => setJoy(e.target.checked)} />
        кандидат в слот «на радость» (бесплатный для бюджета)
      </label>

      {item.runs.length > 0 && (
        <div className="section">
          <h2>История протокола</h2>
          {item.runs.map((r, i) => (
            <div key={i} className="small muted" style={{ marginBottom: 4 }}>
              {new Date(r.at).toLocaleDateString('ru-RU')}: «{r.fear}» — ожидал {r.predicted}/3
              {r.actual != null ? `, факт ${r.actual}/3` : ' (без сверки)'}
            </div>
          ))}
        </div>
      )}

      <div className="footer">
        <div className="row">
          <button
            className="danger"
            onClick={() => {
              deleteItem(item.id);
              onClose();
              notify('Удалено');
            }}
          >
            удалить
          </button>
          {item.status === 'pool' ? (
            <button
              className="danger ghost"
              onClick={() => {
                dropItem(item.id);
                onClose();
                notify('Выброшено — мёртвое должно умереть');
              }}
            >
              выбросить
            </button>
          ) : (
            <button
              onClick={() => {
                restoreItem(item.id);
                onClose();
                notify('Возвращено в склад');
              }}
            >
              вернуть в склад
            </button>
          )}
        </div>
        <div className="row">
          <button className="ghost" onClick={onClose}>
            отмена
          </button>
          <button className="primary" onClick={save}>
            сохранить
          </button>
        </div>
      </div>
    </Modal>
  );
}

export function PoolView({ notify }: { notify: (m: string, err?: boolean) => void }) {
  const state = useApp();
  const [openId, setOpenId] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const [query, setQuery] = useState('');
  const [horizon, setHorizon] = useState<'all' | 'overdue' | 'today' | 'week' | 'nodate' | 'routines'>('all');

  const openItem = state.items.find((it) => it.id === openId) ?? null;
  const q = query.trim().toLowerCase();
  const today = todayISO();
  const week = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);

  const matchesHorizon = (it: Item): boolean => {
    switch (horizon) {
      case 'overdue':
        return !!it.due && it.due < today;
      case 'today':
        return it.due === today;
      case 'week':
        return !!it.due && it.due <= week;
      case 'nodate':
        return !it.due && it.repeat === 'none';
      case 'routines':
        return it.repeat !== 'none';
      default:
        return true;
    }
  };

  const items = state.items.filter((it) => {
    if (!matchesHorizon(it)) return false;
    if (!q) return true;
    return it.title.toLowerCase().includes(q) || it.notes.toLowerCase().includes(q);
  });

  const groups: { key: string; label: string; list: Item[] }[] = [
    { key: 'pool', label: 'Склад (доступно)', list: items.filter((i) => i.status === 'pool' && i.resistance < 2) },
    { key: 'avoid', label: '🫁 Зона избегания', list: items.filter((i) => i.status === 'pool' && i.resistance >= 2) },
    { key: 'done', label: 'Сделано', list: items.filter((i) => i.status === 'done') },
    { key: 'dropped', label: 'Выброшено', list: items.filter((i) => i.status === 'dropped') },
  ];

  return (
    <div>
      <h1 className="page-title">Склад</h1>
      <p className="page-hint">
        Захват в один тап. Обязательно аффект-фильтр: чего я от этого дела жду — скуки, тревоги, тяжести?
        Дело с сопротивлением ≥2 попадает в «зону избегания» — там работает протокол, а не воля.
      </p>

      <div className="panel" style={{ marginBottom: 12 }}>
        <div className="row">
          <input
            className="grow"
            placeholder="новое дело…"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && draft.trim()) {
                addItem({ title: draft.trim() });
                setDraft('');
              }
            }}
          />
          <button
            className="primary"
            onClick={() => {
              if (draft.trim()) {
                addItem({ title: draft.trim() });
                setDraft('');
                notify('На складе');
              }
            }}
          >
            + на склад
          </button>
        </div>
        <div className="row" style={{ marginTop: 8 }}>
          <input
            className="grow"
            style={{ maxWidth: 240 }}
            placeholder="поиск…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {(
            [
              ['all', 'все'],
              ['overdue', 'просрочено'],
              ['today', 'сегодня'],
              ['week', 'до недели'],
              ['nodate', 'без срока'],
              ['routines', 'рутины'],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              className={`tiny ${horizon === key ? 'primary' : 'ghost'}`}
              onClick={() => setHorizon(key)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {groups.map((g) => (
        <div key={g.key} className="section">
          <h2>
            {g.label} <span className="pill">{g.list.length}</span>
          </h2>
          {g.list.length === 0 && <div className="muted small">пусто</div>}
          {g.list.map((it) => (
            <div key={it.id} className="list-row" onClick={() => setOpenId(it.id)} style={{ cursor: 'pointer' }}>
              <div className="grow">
                <b>{it.title}</b>
                <div className="small muted">
                  {COST_LABEL[it.cost]} · сопротивление {it.resistance}/3
                  {it.affect !== 'none' && ` · ${AFFECT_LABEL[it.affect]}`}
                  {it.due && ` · 📅 ${it.due}${it.due < today ? ' (просрочено)' : ''}`}
                  {it.repeat !== 'none' && ` · ↻ ${REPEAT_LABEL[it.repeat]}`}
                  {it.joy && ' · ☺ радость'}
                  {it.runs.length > 0 && ` · протоколов: ${it.runs.length}`}
                </div>
              </div>
              <button className="tiny">⋯</button>
            </div>
          ))}
        </div>
      ))}

      {openItem && <ItemModal item={openItem} onClose={() => setOpenId(null)} notify={notify} />}
    </div>
  );
}
