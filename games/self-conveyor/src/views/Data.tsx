import { dayHistory, fearStats, useApp } from '../store';
import { AFFECT_LABEL } from '../types';
import { Sparkline } from '../ui';

export function DataView() {
  const state = useApp();
  const fs = fearStats(state);
  const history = dayHistory(state, 30);

  const overstatedPct = fs.runs > 0 ? Math.round((fs.overstated / fs.runs) * 100) : 0;
  const energyPoints = history
    .filter((d) => d.energy != null)
    .map((d, i) => ({ t: i, v: d.energy as number }));
  const closedDays = history.filter((d) => d.closed || (d.plan.length > 0 && d.plan.every((p) => p.done))).length;
  const doneItems = state.items.filter((i) => i.status === 'done').length;

  const runs = state.items
    .flatMap((it) => it.runs.map((r) => ({ ...r, title: it.title })))
    .sort((a, b) => b.at - a.at)
    .slice(0, 12);

  return (
    <div>
      <h1 className="page-title">Данные</h1>
      <p className="page-hint">
        Не «сколько задач закрыто», а суд над страхом и ресурсом: система проверяет себя, а не вас.
      </p>

      <div className="stats-grid section">
        <div className="stat">
          <div className="num">
            {fs.runs > 0 ? `${overstatedPct}%` : '—'}
          </div>
          <div className="lbl">страх преувеличил (после сверки)</div>
        </div>
        <div className="stat">
          <div className="num">{fs.runs}</div>
          <div className="lbl">протоколов избегания</div>
        </div>
        <div className="stat">
          <div className="num">{closedDays}</div>
          <div className="lbl">дней с закрытой квотой</div>
        </div>
        <div className="stat">
          <div className="num">{doneItems}</div>
          <div className="lbl">дел завершено всего</div>
        </div>
      </div>

      <div className="panel section">
        <h2 style={{ fontSize: 14 }}>Страх против факта</h2>
        {fs.runs === 0 ? (
          <div className="muted small">
            Пока нет сверок. Запустите протокол избегания на «Сегодня» — и система начнёт собирать
            доказательства того, что страх врёт (или нет — тоже данные).
          </div>
        ) : (
          <div>
            <div className="small" style={{ marginBottom: 8 }}>
              преувеличил: <b>{fs.overstated}</b> · совпало: <b>{fs.matched}</b> · факт хуже:{' '}
              <b>{fs.worse}</b>
            </div>
            <div className="budget-bar">
              <div className="budget-fill" style={{ width: `${overstatedPct}%`, background: 'var(--green)' }} />
            </div>
          </div>
        )}
      </div>

      <div className="panel section">
        <h2 style={{ fontSize: 14 }}>Силы по дням</h2>
        {energyPoints.length < 2 ? (
          <div className="muted small">Нужно хотя бы два дня чекинов.</div>
        ) : (
          <>
            <Sparkline points={energyPoints} width={280} height={54} />
            <div className="small muted" style={{ marginTop: 6 }}>
              Последние {energyPoints.length} дней с чекином · средний:{' '}
              {(energyPoints.reduce((s, p) => s + p.v, 0) / energyPoints.length).toFixed(1)}/5
            </div>
          </>
        )}
      </div>

      <div className="panel section">
        <h2 style={{ fontSize: 14 }}>Последние сверки протокола</h2>
        {runs.length === 0 && <div className="muted small">Пока пусто.</div>}
        {runs.map((r, i) => (
          <div key={i} className="list-row">
            <div className="grow">
              <b>{r.title}</b>
              <div className="small muted">
                {new Date(r.at).toLocaleDateString('ru-RU')} · «{r.fear}»
                {r.microStep && ` · шаг: ${r.microStep}`}
              </div>
            </div>
            <span className={`chip ${r.actual != null && r.actual < r.predicted ? 'chip-ready' : ''}`}>
              ожидал {r.predicted}/3 {r.actual != null ? `→ факт ${r.actual}/3` : '→ без сверки'}
            </span>
          </div>
        ))}
      </div>

      <div className="panel section">
        <h2 style={{ fontSize: 14 }}>Дни</h2>
        {history.length === 0 && <div className="muted small">История дней появится после первого чекина.</div>}
        {history
          .slice()
          .reverse()
          .slice(0, 10)
          .map((d) => (
            <div key={d.date} className="list-row">
              <div className="grow small">
                <b>{d.date}</b>
                <span className="muted">
                  {' '}
                  · силы: {d.energy ?? '—'} · план: {d.plan.filter((p) => p.done).length}/{d.plan.length}
                  {d.closed && ' · шторка'}
                  {d.evening != null && ` · вечер: ${d.evening}/5`}
                </span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
