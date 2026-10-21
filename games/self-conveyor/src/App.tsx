import { useState, useSyncExternalStore, type ReactNode } from 'react';
import { BoardView } from './views/Board';
import { TodayView } from './views/Today';
import { TechniquesView } from './views/Techniques';
import { MetricsView } from './views/Metrics';
import { JournalsView } from './views/Journals';
import { MetaprojectsView } from './views/Metaprojects';
import { RetroView } from './views/Retro';
import { InboxView } from './views/Inbox';
import { SettingsView } from './views/SettingsView';
import { addItem, collectToday, useApp } from './store';
import { getLastSaved, onSaved } from './persistence';

type ViewId =
  | 'today'
  | 'board'
  | 'techniques'
  | 'metrics'
  | 'journals'
  | 'meta'
  | 'retro'
  | 'inbox'
  | 'settings';

const NAV: { id: ViewId; label: string }[] = [
  { id: 'today', label: 'Сегодня' },
  { id: 'board', label: 'Конвейер' },
  { id: 'techniques', label: 'Техники' },
  { id: 'metrics', label: 'Метрики' },
  { id: 'journals', label: 'Дневники' },
  { id: 'inbox', label: 'Входящее (ИИ)' },
  { id: 'meta', label: 'Метапроекты' },
  { id: 'retro', label: 'Ретро и HADI' },
  { id: 'settings', label: 'Настройки' },
];

const GROUPS: { title: string; ids: ViewId[] }[] = [
  { title: 'Этап 1 · база', ids: ['today', 'board'] },
  { title: 'Черновики · этап 2', ids: ['techniques', 'metrics', 'journals'] },
  { title: 'Черновики · этап 3', ids: ['inbox', 'meta', 'retro'] },
  { title: 'Система', ids: ['settings'] },
];

function useLastSaved(): number | null {
  return useSyncExternalStore(onSaved, getLastSaved, () => null);
}

export default function App() {
  const [view, setView] = useState<ViewId>('today');
  const [toast, setToast] = useState<{ text: string; err: boolean } | null>(null);
  const [quick, setQuick] = useState('');
  const state = useApp();
  const lastSaved = useLastSaved();

  const notify = (text: string, err = false) => {
    setToast({ text, err });
    setTimeout(() => setToast(null), 3200);
  };

  const quickAdd = () => {
    const t = quick.trim();
    if (!t) return;
    addItem({ title: t, list: 'desires' });
    setQuick('');
    notify('Желание добавлено в начало конвейера');
  };

  const todayCount = collectToday(state).open.length;

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <h1>⚙ Конвейер</h1>
          <div className="sub">управление собой</div>
        </div>
        {GROUPS.map((g) => (
          <div key={g.title}>
            <div className="nav-group">{g.title}</div>
            {g.ids.map((id) => {
              const n = NAV.find((x) => x.id === id)!;
              return (
                <button
                  key={id}
                  className={`nav-item ${view === id ? 'active' : ''}`}
                  onClick={() => setView(id)}
                >
                  <span className="label">{n.label}</span>
                  {id === 'today' && todayCount > 0 && <span className="badge">{todayCount}</span>}
                </button>
              );
            })}
          </div>
        ))}
        <div className="grow" />
        <div className="small muted" style={{ padding: '8px 10px' }}>
          {lastSaved ? (
            <>сохранено в {new Date(lastSaved).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</>
          ) : (
            <>данные в localStorage</>
          )}
        </div>
      </aside>

      <main className="main">
        <div className="topbar">
          <input
            className="grow"
            placeholder="быстрое захват: мысль или желание → Enter добавит в «Желания»"
            value={quick}
            onChange={(e) => setQuick(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') quickAdd();
            }}
          />
          <button className="primary" onClick={quickAdd}>
            + желание
          </button>
        </div>

        {view === 'today' && <TodayView notify={notify} />}
        {view === 'board' && <BoardView notify={notify} />}
        {view === 'techniques' && <TechniquesView />}
        {view === 'metrics' && <MetricsView notify={notify} />}
        {view === 'journals' && <JournalsView notify={notify} />}
        {view === 'meta' && <MetaprojectsView notify={notify} />}
        {view === 'retro' && <RetroView notify={notify} />}
        {view === 'inbox' && <InboxView notify={notify} />}
        {view === 'settings' && <SettingsView notify={notify} />}
      </main>
      {toast && <div className={`toast ${toast.err ? 'err' : ''}`}>{toast.text}</div>}
    </div>
  );
}
