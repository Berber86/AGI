import { useState, useSyncExternalStore, type ReactNode } from 'react';
import { TodayView } from './views/Today';
import { PoolView } from './views/Pool';
import { DataView } from './views/Data';
import { SettingsView } from './views/SettingsView';
import { addItem, useApp } from './store';
import { getLastSaved, onSaved } from './persistence';

type ViewId = 'today' | 'pool' | 'data' | 'settings';

const NAV: { id: ViewId; label: string; hint: string }[] = [
  { id: 'today', label: 'Сегодня', hint: 'силы → план → шторка' },
  { id: 'pool', label: 'Склад', hint: 'дела и аффект-фильтр' },
  { id: 'data', label: 'Данные', hint: 'страх против факта' },
  { id: 'settings', label: 'Настройки', hint: 'хранилище и ключи' },
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
    addItem({ title: t });
    setQuick('');
    notify('На складе — уточните аффект в карточке, когда будет время');
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <h1>⚙ По силам</h1>
          <div className="sub">конвейер нового типа</div>
        </div>
        {NAV.map((n) => (
          <button
            key={n.id}
            className={`nav-item ${view === n.id ? 'active' : ''}`}
            onClick={() => setView(n.id)}
            title={n.hint}
          >
            <span className="label">{n.label}</span>
          </button>
        ))}
        <div className="grow" />
        <div className="small muted" style={{ padding: '8px 10px' }}>
          {lastSaved ? (
            <>
              сохранено в{' '}
              {new Date(lastSaved).toLocaleTimeString('ru-RU', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })}
            </>
          ) : (
            <>данные в localStorage</>
          )}
        </div>
      </aside>

      <main className="main">
        <div className="topbar">
          <input
            className="grow"
            placeholder="быстрый захват дела → Enter положит на склад"
            value={quick}
            onChange={(e) => setQuick(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') quickAdd();
            }}
          />
          <button className="primary" onClick={quickAdd}>
            + дело
          </button>
        </div>

        {view === 'today' && <TodayView notify={notify} />}
        {view === 'pool' && <PoolView notify={notify} />}
        {view === 'data' && <DataView />}
        {view === 'settings' && <SettingsView notify={notify} />}
      </main>
      {toast && <div className={`toast ${toast.err ? 'err' : ''}`}>{toast.text}</div>}
    </div>
  );
}
