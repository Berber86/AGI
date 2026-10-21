import { useState } from 'react';
import { addItem, addMetric, addMetricPoint, deleteMetric, updateMetric, useApp } from '../store';
import { Field, Sparkline, DraftBanner } from '../ui';
import type { RepeatKind } from '../types';

export function MetricsView({ notify }: { notify: (m: string) => void }) {
  const state = useApp();
  const [name, setName] = useState('');
  const [unit, setUnit] = useState('');
  const [values, setValues] = useState<Record<string, string>>({});

  return (
    <div>
      <h1 className="page-title">Метрики</h1>
      <p className="page-hint">
        «Что измеряется — то управляется». Замеряйте числа регулярно, чтобы видеть динамику и падения в сферах жизни.
        Привяжите к метрике рутину — и она сама будет напоминать о замере.
      </p>
      <DraftBanner stage={2} />

      <div className="panel" style={{ marginBottom: 14 }}>
        <div className="row">
          <Field label="Название метрики">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Вес / Net worth / Давление…" />
          </Field>
          <Field label="Единицы">
            <input value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="кг / ₽ / мм рт.ст." />
          </Field>
          <button
            className="primary"
            onClick={() => {
              if (name.trim()) {
                addMetric(name.trim(), unit.trim());
                setName('');
                setUnit('');
                notify('Метрика добавлена');
              }
            }}
          >
            + метрика
          </button>
        </div>
      </div>

      {state.metrics.length === 0 && (
        <div className="panel muted">Пока нет метрик. Примеры: вес (раз в неделю), чистые активы (раз в месяц), подписчики, показатели крови (раз в полгода).</div>
      )}

      {state.metrics.map((m) => {
        const last = m.points[m.points.length - 1];
        const prev = m.points[m.points.length - 2];
        const delta = last && prev ? (last.v - prev.v).toFixed(2) : null;
        return (
          <div key={m.id} className="panel" style={{ marginBottom: 10 }}>
            <div className="row">
              <div className="grow">
                <b>{m.name}</b> <span className="muted small">{m.unit}</span>
                {last && (
                  <div className="small muted">
                    последнее: <b style={{ color: 'var(--text)' }}>{last.v} {m.unit}</b>
                    {delta !== null && <span> · изменение: {delta}</span>} · замеров: {m.points.length}
                  </div>
                )}
              </div>
              <Sparkline points={m.points} width={200} height={48} />
            </div>
            <div className="row" style={{ marginTop: 8 }}>
              <input
                style={{ maxWidth: 140 }}
                placeholder="значение"
                value={values[m.id] ?? ''}
                onChange={(e) => setValues((v) => ({ ...v, [m.id]: e.target.value }))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const num = Number((values[m.id] ?? '').replace(',', '.'));
                    if (!Number.isNaN(num)) {
                      addMetricPoint(m.id, num);
                      setValues((v) => ({ ...v, [m.id]: '' }));
                    }
                  }
                }}
              />
              <button
                onClick={() => {
                  const num = Number((values[m.id] ?? '').replace(',', '.'));
                  if (!Number.isNaN(num)) {
                    addMetricPoint(m.id, num);
                    setValues((v) => ({ ...v, [m.id]: '' }));
                    notify('Замер записан');
                  }
                }}
              >
                + замер
              </button>
              <button
                title="Создать рутину замера в конвейере"
                onClick={() => {
                  const repeat: RepeatKind = 'monthly';
                  addItem({
                    title: `Замер: ${m.name}`,
                    list: 'routines',
                    repeat,
                    nextDue: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
                    notes: 'Рутина создана из метрики «' + m.name + '»',
                    origin: 'metric',
                  });
                  notify('Рутина замера создана (раз в месяц) — настройте дату в карточке');
                }}
              >
                ⏰ рутина замера
              </button>
              <input
                style={{ maxWidth: 90 }}
                value={m.name}
                onChange={(e) => updateMetric(m.id, { name: e.target.value })}
              />
              <input
                style={{ maxWidth: 90 }}
                value={m.unit}
                onChange={(e) => updateMetric(m.id, { unit: e.target.value })}
              />
              <button className="danger" onClick={() => deleteMetric(m.id)}>
                удалить
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
