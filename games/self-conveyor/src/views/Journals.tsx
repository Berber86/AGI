import { useState } from 'react';
import { addJournalEntry, deleteJournalEntry, useApp } from '../store';
import { DraftBanner } from '../ui';

export function JournalsView({ notify }: { notify: (m: string) => void }) {
  const state = useApp();
  const [kind, setKind] = useState<'success' | 'fear'>('success');
  const [text, setText] = useState('');

  const list = state.journal.filter((e) => e.kind === kind);

  return (
    <div>
      <h1 className="page-title">Дневники</h1>
      <p className="page-hint">
        <b>Дневник успеха</b> (раз в квартал) — чтобы заметить пройденный путь: мелкие шаги незаметны день ото дня.{' '}
        <b>Дневник ложных опасений</b> (раз в месяц) — чтобы увидеть, сколько страхов не сбылось и сколько сил они
        отняли.
      </p>
      <DraftBanner stage={2} />

      <div className="panel">
        <div className="row">
          <button className={kind === 'success' ? 'primary' : 'ghost'} onClick={() => setKind('success')}>
            🏆 Успех
          </button>
          <button className={kind === 'fear' ? 'primary' : 'ghost'} onClick={() => setKind('fear')}>
            👻 Ложные опасения
          </button>
        </div>
        <textarea
          style={{ marginTop: 10 }}
          placeholder={
            kind === 'success'
              ? 'Конкретное достижение за период (запустил…, опубликовал…, достиг…)…'
              : 'Страх, который не сбылся (боялся X, а произошло Y)…'
          }
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          className="primary"
          style={{ marginTop: 8 }}
          onClick={() => {
            if (text.trim()) {
              addJournalEntry(kind, text.trim());
              setText('');
              notify('Запись добавлена');
            }
          }}
        >
          + запись
        </button>
      </div>

      <div style={{ marginTop: 14 }}>
        {list.length === 0 && <div className="panel muted">Записей пока нет.</div>}
        {list.map((e) => (
          <div key={e.id} className="list-row">
            <div className="grow">
              <div className="small muted">{e.date}</div>
              <div style={{ whiteSpace: 'pre-wrap' }}>{e.text}</div>
            </div>
            <button className="tiny danger" onClick={() => deleteJournalEntry(e.id)}>
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
