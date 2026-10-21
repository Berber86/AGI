import { useState } from 'react';
import { addItem, addItems, useApp } from '../store';
import { aiTriage, type TriageResult } from '../ai';
import { ErrorBox, useAIAction, DraftBanner } from '../ui';

export function InboxView({ notify }: { notify: (m: string) => void }) {
  const state = useApp();
  const [text, setText] = useState('');
  const [quick, setQuick] = useState('');
  const [result, setResult] = useState<TriageResult | null>(null);
  const [taken, setTaken] = useState<Record<string, boolean>>({});
  const { busy, error, run } = useAIAction();

  return (
    <div>
      <h1 className="page-title">Входящее (триаж)</h1>
      <p className="page-hint">
        Свалите сюда поток мыслей, идей и мелочей — ИИ разложит на желания, проекты со шагами и мусор. Вы только
        подтверждаете. Решения принимаете вы, ИИ лишь сортирует.
      </p>
      <DraftBanner stage={3} />

      <div className="panel">
        <textarea
          style={{ minHeight: 140 }}
          placeholder="Мысли, идеи, задачи — в любом виде, по одной в строке…"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="row" style={{ marginTop: 8 }}>
          <button
            className="primary"
            disabled={busy === 'triage' || !text.trim()}
            onClick={() =>
              run('triage', async () => {
                const res = await aiTriage(state.settings.llm, text);
                setResult(res);
                setTaken({});
              })
            }
          >
            {busy === 'triage' ? 'разбираю…' : '✨ разобрать (ИИ)'}
          </button>
          <button
            className="ghost"
            disabled={!text.trim()}
            onClick={() => {
              for (const line of text.split('\n').map((x) => x.trim()).filter(Boolean)) {
                addItem({ title: line, list: 'desires', origin: 'inbox' });
              }
              setText('');
              notify('Всё ушло в желания без разбора');
            }}
          >
            без разбора → в желания
          </button>
        </div>
        <ErrorBox error={error} />
      </div>

      <div className="panel" style={{ marginTop: 10 }}>
        <div className="row">
          <input
            className="grow"
            placeholder="быстрое добавление одного желания…"
            value={quick}
            onChange={(e) => setQuick(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && quick.trim()) {
                addItem({ title: quick.trim(), list: 'desires', origin: 'inbox' });
                setQuick('');
              }
            }}
          />
          <button
            onClick={() => {
              if (quick.trim()) {
                addItem({ title: quick.trim(), list: 'desires', origin: 'inbox' });
                setQuick('');
              }
            }}
          >
            + в желания
          </button>
        </div>
      </div>

      {result && (
        <div style={{ marginTop: 14 }}>
          <div className="grid3">
            <div className="panel">
              <h2 style={{ fontSize: 14 }}>Желания ({result.desires.length})</h2>
              {result.desires.map((d, i) => (
                <div key={i} className="list-row">
                  <div className="grow">{d}</div>
                  <button
                    className="tiny primary"
                    disabled={taken[`d${i}`]}
                    onClick={() => {
                      addItem({ title: d, list: 'desires', origin: 'inbox' });
                      setTaken((t) => ({ ...t, [`d${i}`]: true }));
                    }}
                  >
                    {taken[`d${i}`] ? '✓' : 'взять'}
                  </button>
                </div>
              ))}
              {result.desires.length === 0 && <div className="muted small">нет</div>}
              {result.desires.length > 0 && (
                <button
                  className="tiny"
                  style={{ marginTop: 6 }}
                  onClick={() => {
                    addItems(result.desires.map((d) => ({ title: d, list: 'desires' as const, origin: 'inbox' })));
                    const t: Record<string, boolean> = {};
                    result.desires.forEach((_, i) => (t[`d${i}`] = true));
                    setTaken((prev) => ({ ...prev, ...t }));
                    notify('Все желания добавлены');
                  }}
                >
                  взять все
                </button>
              )}
            </div>
            <div className="panel">
              <h2 style={{ fontSize: 14 }}>Проекты ({result.projects.length})</h2>
              {result.projects.map((p, i) => (
                <div key={i} className="list-row" style={{ display: 'block' }}>
                  <b>{p.title}</b>
                  <ol className="small muted" style={{ margin: '4px 0 6px 16px', padding: 0 }}>
                    {p.steps.map((s, j) => (
                      <li key={j}>{s}</li>
                    ))}
                  </ol>
                  <button
                    className="tiny primary"
                    disabled={taken[`p${i}`]}
                    onClick={() => {
                      addItem({
                        title: p.title,
                        list: 'projects',
                        origin: 'inbox',
                        steps: p.steps.map((s) => ({
                          id: Math.random().toString(36).slice(2),
                          title: s,
                          done: false,
                          inToday: false,
                        })),
                      });
                      setTaken((t) => ({ ...t, [`p${i}`]: true }));
                    }}
                  >
                    {taken[`p${i}`] ? '✓' : 'взять проект'}
                  </button>
                </div>
              ))}
              {result.projects.length === 0 && <div className="muted small">нет</div>}
            </div>
            <div className="panel">
              <h2 style={{ fontSize: 14 }}>Мусор ({result.junk.length})</h2>
              {result.junk.map((j, i) => (
                <div key={i} className="list-row">
                  <div className="grow muted">{j}</div>
                </div>
              ))}
              {result.junk.length === 0 && <div className="muted small">нет</div>}
            </div>
          </div>
          <div className="row" style={{ marginTop: 10 }}>
            <button
              className="ghost"
              onClick={() => {
                setResult(null);
                setText('');
              }}
            >
              очистить результат
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
