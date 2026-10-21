import { useState } from 'react';
import { addItem, addWheelArea, deleteItem, moveItem, prioritiesFull, removeWheelArea, updateWheelArea, useApp } from '../store';
import { aiBrainstorm, aiProsecute } from '../ai';
import { ErrorBox, RadarChart, useAIAction, DraftBanner } from '../ui';

const DEATHBED = [
  {
    key: 'deathbed',
    title: 'На смертном одре',
    origin: 'deathbed',
    prompt: 'Вы лежите при смерти, остался час-другой на размышления. О чём пожалеете: что не успели, не решились, не реализовали?',
    ai: 'Представь, что человек на смертном одре вспоминает прожитую жизнь. Накидай 10 откровенных тем для саморефлексии о нереализованных желаниях и сожалениях (короткие вопросы-подсказки).',
  },
  {
    key: 'diagnosis',
    title: 'Смертельный диагноз',
    origin: 'diagnosis',
    prompt: 'Врачи дали 6 месяцев. Что непременно успеете? Кого простите? С кем проведёте оставшееся время?',
    ai: 'Человеку поставили смертельный диагноз: 6 месяцев жизни. Накидай 10 вопросов-подсказок, чтобы он понял, что успеть важнее всего.',
  },
  {
    key: 'immortality',
    title: 'Бессмертие',
    origin: 'immortality',
    prompt: 'Вы богаты, работать не нужно, медицина продлевает жизнь без предела. Чем заполните дни? Какие проекты начнёте?',
    ai: 'Человек безмерно богат, не работает и живёт вечно. Накидай 10 вопросов-подсказок, чтобы понять, чем бы он реально занимался без нужды выживать.',
  },
];

function WheelSection() {
  const state = useApp();
  const [ideaFor, setIdeaFor] = useState<string | null>(null);
  const [ideas, setIdeas] = useState<string[]>([]);
  const [manual, setManual] = useState<Record<string, string>>({});
  const { busy, error, run } = useAIAction();

  return (
    <div className="section">
      <h2>
        Колесо баланса <span className="pill">оцените 8 сфер, найдите перекосы</span>
      </h2>
      <div className="grid2">
        <div className="panel">
          <RadarChart areas={state.wheel} size={280} />
          <div className="small muted" style={{ marginTop: 8 }}>
            Правило низкой базы: подтягивайте сферы с наименьшим баллом — это дешевле и заметнее, чем толкать 8/10 до 9/10.
          </div>
        </div>
        <div>
          {state.wheel.map((a) => (
            <div key={a.id} className="wheel-area" style={{ marginBottom: 8 }}>
              <div className="row">
                <b className="grow">{a.name}</b>
                <b style={{ fontSize: 16 }}>{a.score}/10</b>
                <button className="tiny danger" title="Удалить сферу" onClick={() => removeWheelArea(a.id)}>
                  ✕
                </button>
              </div>
              <input
                className="score-slider"
                type="range"
                min={0}
                max={10}
                value={a.score}
                onChange={(e) => updateWheelArea(a.id, { score: Number(e.target.value) })}
              />
              <textarea
                placeholder="Как сейчас (текущее состояние)…"
                value={a.current}
                onChange={(e) => updateWheelArea(a.id, { current: e.target.value })}
                style={{ minHeight: 34, marginBottom: 4 }}
              />
              <textarea
                placeholder="Что значит 10/10 для меня…"
                value={a.ideal}
                onChange={(e) => updateWheelArea(a.id, { ideal: e.target.value })}
                style={{ minHeight: 34, marginBottom: 4 }}
              />
              <textarea
                placeholder={`Следующая ступень (${a.score} → ${Math.min(10, a.score + 1)}) и как её достичь…`}
                value={a.next}
                onChange={(e) => updateWheelArea(a.id, { next: e.target.value })}
                style={{ minHeight: 34, marginBottom: 4 }}
              />
              <div className="row">
                <button
                  onClick={() => {
                    const text = manual[a.id]?.trim();
                    if (text) {
                      addItem({ title: text, list: 'desires', origin: 'wheel', notes: `Колесо баланса: ${a.name}` });
                      setManual((m) => ({ ...m, [a.id]: '' }));
                    }
                  }}
                >
                  + в желания
                </button>
                <input
                  className="grow"
                  placeholder="действие для шага вперёд…"
                  value={manual[a.id] ?? ''}
                  onChange={(e) => setManual((m) => ({ ...m, [a.id]: e.target.value }))}
                />
                <button
                  className="ai"
                  disabled={busy === `brain-${a.id}`}
                  onClick={() =>
                    run(`brain-${a.id}`, async () => {
                      setIdeaFor(a.id);
                      const res = await aiBrainstorm(
                        state.settings.llm,
                        `Сфера жизни «${a.name}»: сейчас ${a.score}/10. Состояние: ${a.current || 'не описано'}. Идеал: ${a.ideal || 'не описан'}. Следующая ступень: ${a.next || 'не описана'}. Накидай конкретных действий, чтобы подвинуться с ${a.score} на ${Math.min(10, a.score + 1)}.`,
                      );
                      setIdeas(res);
                    })
                  }
                >
                  {busy === `brain-${a.id}` ? '…' : '✨ идеи действий'}
                </button>
              </div>
              {ideaFor === a.id && ideas.length > 0 && (
                <div style={{ marginTop: 6 }}>
                  {ideas.map((idea, i) => (
                    <div key={i} className="list-row" style={{ padding: '5px 8px', marginBottom: 4 }}>
                      <div className="grow small">{idea}</div>
                      <button
                        className="tiny"
                        onClick={() => {
                          addItem({ title: idea, list: 'desires', origin: 'wheel', notes: `Колесо баланса: ${a.name}` });
                          notifyIdeas(idea);
                        }}
                      >
                        + взять
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          <button
            onClick={() => {
              const name = prompt('Название сферы жизни:');
              if (name) addWheelArea(name);
            }}
          >
            + своя сфера
          </button>
          <ErrorBox error={error} />
        </div>
      </div>
    </div>
  );
}

function notifyIdeas(_idea: string) {
  /* локальный фидбек не нужен — карточка сразу видна в списке желаний */
}

function DeathbedSection() {
  const state = useApp();
  const [texts, setTexts] = useState<Record<string, string>>({});
  const [aiIdeas, setAiIdeas] = useState<Record<string, string[]>>({});
  const { busy, error, run } = useAIAction();

  return (
    <div className="section">
      <h2>
        «Предсмертные» техники <span className="pill">желания от сердца, а не от ума</span>
      </h2>
      <div className="grid3">
        {DEATHBED.map((d) => (
          <div key={d.key} className="panel">
            <h2 style={{ fontSize: 13 }}>{d.title}</h2>
            <p className="small muted">{d.prompt}</p>
            <textarea
              placeholder="Пишите что угодно — по одной мысли в строке…"
              value={texts[d.key] ?? ''}
              onChange={(e) => setTexts((t) => ({ ...t, [d.key]: e.target.value }))}
            />
            <div className="row" style={{ marginTop: 6 }}>
              <button
                className="primary"
                onClick={() => {
                  const lines = (texts[d.key] ?? '')
                    .split('\n')
                    .map((x) => x.trim())
                    .filter(Boolean);
                  if (!lines.length) return;
                  for (const t of lines) addItem({ title: t, list: 'desires', origin: d.origin });
                  setTexts((t) => ({ ...t, [d.key]: '' }));
                }}
              >
                → в желания
              </button>
              <button
                className="ai"
                disabled={busy === d.key}
                onClick={() =>
                  run(d.key, async () => {
                    const res = await aiBrainstorm(state.settings.llm, d.ai);
                    setAiIdeas((m) => ({ ...m, [d.key]: res }));
                  })
                }
              >
                {busy === d.key ? '…' : '✨ подсказки (ИИ)'}
              </button>
            </div>
            {(aiIdeas[d.key] ?? []).length > 0 && (
              <details open>
                <summary>подсказки ({aiIdeas[d.key]!.length})</summary>
                {aiIdeas[d.key]!.map((x, i) => (
                  <div key={i} className="small" style={{ marginBottom: 3 }}>
                    • {x}{' '}
                    <button
                      className="tiny"
                      onClick={() => addItem({ title: x, list: 'desires', origin: d.origin })}
                    >
                      +
                    </button>
                  </div>
                ))}
              </details>
            )}
          </div>
        ))}
      </div>
      <ErrorBox error={error} />
    </div>
  );
}

function FilterSection() {
  const state = useApp();
  const [critique, setCritique] = useState<Record<string, string>>({});
  const { busy, error, run } = useAIAction();
  const desires = state.items.filter((it) => it.list === 'desires');

  return (
    <div className="section">
      <h2>
        Фильтрация <span className="pill">переспать и выкинуть случайное · {desires.length} в списке желаний</span>
      </h2>
      <div className="panel">
        <div className="small muted" style={{ marginBottom: 10 }}>
          4 вопроса для сомнений: 1) что будет, если это произойдёт? 2) что будет, если не произойдёт? 3) чего не будет,
          если произойдёт? 4) чего не будет, если не произойдёт? Фильтруйте не в тот же день, что записывали.
        </div>
        {desires.length === 0 && <div className="muted">Список желаний пуст.</div>}
        {desires.map((it) => (
          <div key={it.id} className="list-row">
            <div className="grow">
              <b>{it.title}</b>
              {it.notes && <div className="small muted">{it.notes}</div>}
              {critique[it.id] && <div className="small" style={{ marginTop: 6, whiteSpace: 'pre-wrap' }}>{critique[it.id]}</div>}
            </div>
            <button
              className="tiny ai"
              disabled={busy === it.id}
              onClick={() =>
                run(it.id, async () => {
                  const res = await aiProsecute(state.settings.llm, it.title, it.notes);
                  setCritique((c) => ({ ...c, [it.id]: res }));
                })
              }
            >
              {busy === it.id ? '…' : '⚖ прокурор (ИИ)'}
            </button>
            <button className="tiny" onClick={() => moveItem(it.id, 'filtered')}>
              → отфильтр.
            </button>
            <button
              className="tiny danger"
              onClick={() => {
                if (confirm('Удалить желание?')) deleteItem(it.id);
              }}
            >
              ✕
            </button>
          </div>
        ))}
        <ErrorBox error={error} />
      </div>
    </div>
  );
}

function PrioritySection() {
  const state = useApp();
  const filtered = state.items.filter((it) => it.list === 'filtered');
  const priorities = state.items.filter((it) => it.list === 'priorities');
  const full = prioritiesFull(state);

  return (
    <div className="section">
      <h2>
        Приоритизация <span className="pill">{priorities.length}/5 фокусов</span>
      </h2>
      <div className="panel">
        <div className="small muted" style={{ marginBottom: 10 }}>
          Кувшин воды на 20 стаканов: либо по чуть-чуть в каждый (ни один не полон), либо заполнить несколько до конца.
          Выберите ровно 5 — остальные остаются в отфильтрованных и ждут. Пока ТОП-5 не закрыт, остальные — полный игнор.
        </div>
        {full && (
          <div className="ok-box">ТОП-5 собран. Хватит выбирать — пора исполнять 🙂</div>
        )}
        <div className="grid2">
          <div>
            <b className="small muted">Отфильтрованные ({filtered.length})</b>
            {filtered.map((it) => (
              <div key={it.id} className="list-row" style={{ marginTop: 6 }}>
                <div className="grow">{it.title}</div>
                <button
                  className="tiny primary"
                  disabled={full}
                  onClick={() => moveItem(it.id, 'priorities')}
                >
                  {full ? 'ТОП-5 полон' : 'в ТОП-5 ↑'}
                </button>
              </div>
            ))}
            {filtered.length === 0 && <div className="muted small" style={{ marginTop: 6 }}>нет кандидатов</div>}
          </div>
          <div>
            <b className="small muted">Приоритетные</b>
            {priorities.map((it) => (
              <div key={it.id} className="list-row" style={{ marginTop: 6 }}>
                <div className="grow">{it.title}</div>
                <button className="tiny" onClick={() => moveItem(it.id, 'filtered')}>
                  убрать
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function TechniquesView() {
  return (
    <div>
      <h1 className="page-title">Техники</h1>
      <p className="page-hint">
        Инструменты определения желаний, отбора и фокуса. Всё, что выработано здесь, попадает в конвейер в разделе
        «Конвейер».
      </p>
      <DraftBanner stage={2} />
      <WheelSection />
      <DeathbedSection />
      <FilterSection />
      <PrioritySection />
    </div>
  );
}
