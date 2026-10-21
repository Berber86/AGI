import { useState } from 'react';
import {
  addHadi,
  addRetroNote,
  deleteHadi,
  deleteRetroNote,
  updateHadi,
  useApp,
} from '../store';
import { aiHadi, aiRetro } from '../ai';
import { ErrorBox, Field, useAIAction, DraftBanner } from '../ui';

function useStats() {
  const state = useApp();
  const now = Date.now();
  const weekAgo = now - 7 * 86400000;
  const monthAgo = now - 30 * 86400000;
  const doneAll = state.items.filter((it) => it.list === 'done');
  return {
    counts: {
      desires: state.items.filter((i) => i.list === 'desires').length,
      filtered: state.items.filter((i) => i.list === 'filtered').length,
      priorities: state.items.filter((i) => i.list === 'priorities').length,
      goals: state.items.filter((i) => i.list === 'goals').length,
      projects: state.items.filter((i) => i.list === 'projects').length,
      done: doneAll.length,
      doneWeek: doneAll.filter((i) => i.completedAt && i.completedAt > weekAgo).length,
      doneMonth: doneAll.filter((i) => i.completedAt && i.completedAt > monthAgo).length,
      stepsDone: state.items.flatMap((i) => i.steps).filter((s) => s.done).length,
      stepsTotal: state.items.flatMap((i) => i.steps).length,
    },
    recentDone: doneAll.slice(0, 15).map((i) => i.title),
    metrics: state.metrics.map((m) => ({
      name: m.name,
      unit: m.unit,
      last: m.points[m.points.length - 1]?.v ?? null,
      prev: m.points[m.points.length - 2]?.v ?? null,
      n: m.points.length,
    })),
  };
}

export function RetroView({ notify }: { notify: (m: string) => void }) {
  const state = useApp();
  const stats = useStats();
  const [hypothesis, setHypothesis] = useState('');
  const { busy, error, run } = useAIAction();

  return (
    <div>
      <h1 className="page-title">Ретро (PDCA) и HADI</h1>
      <p className="page-hint">
        Цикл <b>plan → do → check → act</b>: проверка идёт по цифрам, а коррективы перенастраивают сам конвейер.{' '}
        <b>HADI</b> — научный метод для нового: гипотеза → действие → данные → вывод.
      </p>
      <DraftBanner stage={3} />

      <div className="stats-grid section">
        <div className="stat">
          <div className="num">{stats.counts.doneWeek}</div>
          <div className="lbl">закрыто за неделю</div>
        </div>
        <div className="stat">
          <div className="num">{stats.counts.doneMonth}</div>
          <div className="lbl">закрыто за месяц</div>
        </div>
        <div className="stat">
          <div className="num">
            {stats.counts.stepsDone}/{stats.counts.stepsTotal}
          </div>
          <div className="lbl">шагов выполнено</div>
        </div>
        <div className="stat">
          <div className="num">{stats.counts.priorities}/5</div>
          <div className="lbl">фокусов занято</div>
        </div>
      </div>

      <div className="panel section">
        <h2 style={{ fontSize: 14 }}>Итерация: check → act</h2>
        <div className="small muted">
          Воронка: желания {stats.counts.desires} → отфильтр. {stats.counts.filtered} → приоритет {stats.counts.priorities} →
          цели {stats.counts.goals} → проекты {stats.counts.projects} → сделано {stats.counts.done}.
        </div>
        {stats.metrics.length > 0 && (
          <div className="small muted" style={{ marginTop: 6 }}>
            Метрики:{' '}
            {stats.metrics
              .map((m) => `${m.name}: ${m.last ?? '—'}${m.unit} (замеров: ${m.n})`)
              .join(' · ')}
          </div>
        )}
        <button
          className="ai"
          style={{ marginTop: 10 }}
          disabled={busy === 'retro'}
          onClick={() =>
            run('retro', async () => {
              const res = await aiRetro(state.settings.llm, JSON.stringify(stats, null, 2));
              addRetroNote(res);
              notify('Ретроспектива сохранена ниже');
            })
          }
        >
          {busy === 'retro' ? 'анализирую…' : '✨ ИИ-ретроспектива итерации'}
        </button>
        <ErrorBox error={error} />
      </div>

      {state.retroNotes.map((n) => (
        <div key={n.id} className="panel" style={{ marginBottom: 8, whiteSpace: 'pre-wrap' }}>
          <div className="row">
            <span className="small muted grow">{n.date}</span>
            <button className="tiny danger" onClick={() => deleteRetroNote(n.id)}>
              ✕
            </button>
          </div>
          {n.text}
        </div>
      ))}

      <hr className="sep" />

      <div className="section">
        <h2>HADI — работа с неизвестным</h2>
        <div className="panel">
          <Field label="Новая гипотеза">
            <input
              value={hypothesis}
              placeholder="например: утренние тренировки дают больше энергии, чем вечерние"
              onChange={(e) => setHypothesis(e.target.value)}
            />
          </Field>
          <button
            className="primary"
            onClick={() => {
              if (hypothesis.trim()) {
                addHadi(hypothesis.trim());
                setHypothesis('');
              }
            }}
          >
            + поставить гипотезу
          </button>
        </div>

        {state.hadis.map((h) => (
          <div key={h.id} className="panel" style={{ marginTop: 8 }}>
            <div className="row">
              <b className="grow">{h.hypothesis}</b>
              <span className="chip">
                {h.status === 'open' ? 'открыта' : h.status === 'confirmed' ? 'подтверждена' : 'опровергнута'}
              </span>
              <button
                className="tiny ai"
                disabled={busy === h.id}
                onClick={() =>
                  run(h.id, async () => {
                    const res = await aiHadi(state.settings.llm, h.hypothesis);
                    updateHadi(h.id, res);
                  })
                }
              >
                {busy === h.id ? '…' : '✨ эксперимент (ИИ)'}
              </button>
              <button
                className="tiny"
                onClick={() =>
                  updateHadi(h.id, {
                    status: h.status === 'confirmed' ? 'open' : 'confirmed',
                  })
                }
              >
                ✓
              </button>
              <button
                className="tiny"
                onClick={() =>
                  updateHadi(h.id, {
                    status: h.status === 'rejected' ? 'open' : 'rejected',
                  })
                }
              >
                ✗
              </button>
              <button className="tiny danger" onClick={() => deleteHadi(h.id)}>
                удалить
              </button>
            </div>
            <div className="grid3" style={{ marginTop: 8 }}>
              <Field label="H — действие (эксперимент)">
                <textarea value={h.action} onChange={(e) => updateHadi(h.id, { action: e.target.value })} />
              </Field>
              <Field label="D — какие данные собрать">
                <textarea value={h.data} onChange={(e) => updateHadi(h.id, { data: e.target.value })} />
              </Field>
              <Field label="I — вывод">
                <textarea value={h.insight} onChange={(e) => updateHadi(h.id, { insight: e.target.value })} />
              </Field>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
