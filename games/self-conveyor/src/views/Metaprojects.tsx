import { useState } from 'react';
import { addMetaproject, removeMetaproject, useApp } from '../store';
import { LIST_LABEL } from '../types';
import { DraftBanner } from '../ui';

export function MetaprojectsView({ notify }: { notify: (m: string) => void }) {
  const state = useApp();
  const [name, setName] = useState('');
  const [filter, setFilter] = useState<string | null>(null);

  const tagged = state.items.filter((it) => it.tags.length > 0);
  const groups = state.metaprojects.map((m) => ({
    tag: m,
    items: tagged.filter((it) => it.tags.includes(m)),
  }));
  const untagged = state.items.filter((it) => it.tags.length === 0 && it.list !== 'done');

  return (
    <div>
      <h1 className="page-title">Метапроекты</h1>
      <p className="page-hint">
        Стратегический уровень над проектами («эпики» в корпоративных таск-трекерах). Тег объединяет проекты, рутины и
        задачи. Высший пилотаж — когда одна задача работает сразу на несколько метапроектов.
      </p>
      <DraftBanner stage={3} />

      <div className="panel">
        <div className="row">
          <input
            className="grow"
            placeholder="новый метапроект (Финансы, Фитнес, Буддизм…)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && name.trim()) {
                addMetaproject(name);
                setName('');
              }
            }}
          />
          <button
            className="primary"
            onClick={() => {
              if (name.trim()) {
                addMetaproject(name);
                setName('');
                notify('Метапроект добавлен');
              }
            }}
          >
            + добавить
          </button>
        </div>
        <div className="row" style={{ marginTop: 10 }}>
          {state.metaprojects.map((m) => (
            <span
              key={m}
              className={`chip ${filter === m ? 'on' : ''}`}
              style={{ cursor: 'pointer' }}
              onClick={() => setFilter(filter === m ? null : m)}
            >
              #{m} ({tagged.filter((it) => it.tags.includes(m)).length})
              <span
                className="x"
                title="Удалить метапроект"
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm(`Удалить метапроект #${m} (теги с карточек тоже снимутся)?`)) removeMetaproject(m);
                }}
              >
                ✕
              </span>
            </span>
          ))}
          {state.metaprojects.length === 0 && <span className="muted small">пока нет метапроектов</span>}
        </div>
      </div>

      <div style={{ marginTop: 14 }}>
        {groups
          .filter((g) => !filter || g.tag === filter)
          .map((g) => (
            <div key={g.tag} className="section">
              <h2>
                #{g.tag} <span className="pill">{g.items.length}</span>
              </h2>
              {g.items.map((it) => (
                <div key={it.id} className="list-row">
                  <div className="grow">
                    <b>{it.title}</b>
                    <div className="small muted">
                      {LIST_LABEL[it.list]}
                      {it.tags.length > 1 && ` · также: ${it.tags.filter((t) => t !== g.tag).map((t) => '#' + t).join(', ')}`}
                    </div>
                  </div>
                </div>
              ))}
              {g.items.length === 0 && <div className="muted small">нет карточек — добавьте тег в карточке (кнопка «⋯»)</div>}
            </div>
          ))}

        {!filter && untagged.length > 0 && (
          <div className="section">
            <h2>
              Без тега <span className="pill">{untagged.length}</span>
            </h2>
            <div className="small muted" style={{ marginBottom: 6 }}>
              Откройте карточку («⋯» на доске) и отметьте метапроекты — так стратегия станет видна целиком.
            </div>
            {untagged.slice(0, 12).map((it) => (
              <div key={it.id} className="list-row">
                <div className="grow">{it.title}</div>
                <span className="chip">{LIST_LABEL[it.list]}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
