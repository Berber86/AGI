import { useRef, useState } from 'react';
import { cloudLoad, cloudSave, firebaseReady } from '../persistence';
import { defaultState, getState, replaceState, updateSettings, useApp } from '../store';
import { aiPing } from '../ai';
import { ErrorBox, Field, useAIAction } from '../ui';
import type { State } from '../types';

export function SettingsView({ notify }: { notify: (m: string) => void }) {
  const state = useApp();
  const { busy, error, run } = useAIAction();
  const fileRef = useRef<HTMLInputElement>(null);
  const [cloudMsg, setCloudMsg] = useState('');

  return (
    <div>
      <h1 className="page-title">Настройки</h1>
      <p className="page-hint">
        Ключи хранятся только в вашем браузере (localStorage) и не попадают в код репозитория. Основное хранение
        данных — локальное; Firebase — опциональное облако-синхронизация.
      </p>

      <div className="panel section">
        <h2 style={{ fontSize: 14 }}>ИИ (OpenAI-совместимый API)</h2>
        <div className="grid3">
          <Field label="Base URL">
            <input
              value={state.settings.llm.baseUrl}
              onChange={(e) => updateSettings({ llm: { ...state.settings.llm, baseUrl: e.target.value } })}
            />
          </Field>
          <Field label="API-ключ">
            <input
              type="password"
              value={state.settings.llm.apiKey}
              placeholder="sk-… / sk-or-…"
              onChange={(e) => updateSettings({ llm: { ...state.settings.llm, apiKey: e.target.value } })}
            />
          </Field>
          <Field label="Модель">
            <input
              value={state.settings.llm.model}
              onChange={(e) => updateSettings({ llm: { ...state.settings.llm, model: e.target.value } })}
            />
          </Field>
        </div>
        <div className="row">
          <button
            className="tiny"
            onClick={() =>
              updateSettings({
                llm: { ...state.settings.llm, baseUrl: 'https://openrouter.ai/api/v1' },
              })
            }
          >
            OpenRouter
          </button>
          <button
            className="tiny"
            onClick={() =>
              updateSettings({
                llm: { ...state.settings.llm, baseUrl: 'https://api.openai.com/v1' },
              })
            }
          >
            OpenAI
          </button>
          <button
            className="tiny"
            onClick={() =>
              updateSettings({
                llm: { ...state.settings.llm, baseUrl: 'https://api.deepseek.com/v1' },
              })
            }
          >
            DeepSeek
          </button>
          <button
            className="tiny"
            onClick={() =>
              updateSettings({
                llm: { ...state.settings.llm, model: 'meta-llama/llama-3.3-70b-instruct:free' },
              })
            }
          >
            бесплатная модель (OpenRouter)
          </button>
          <button
            className="ai"
            disabled={busy === 'ping'}
            onClick={() =>
              run('ping', async () => {
                const res = await aiPing(state.settings.llm);
                notify(`Связь с моделью есть: «${res}»`);
              })
            }
          >
            {busy === 'ping' ? 'проверяю…' : 'проверить подключение'}
          </button>
        </div>
        <div className="small muted" style={{ marginTop: 6 }}>
          Подойдёт любой провайдер с API в формате OpenAI <span className="mono">/chat/completions</span>. У OpenRouter
          одним ключом доступны и платные, и бесплатные модели (с суффиксом <span className="mono">:free</span>).
        </div>
        <ErrorBox error={error} />
      </div>

      <div className="panel section">
        <h2 style={{ fontSize: 14 }}>Firebase (Firestore) — опционально</h2>
        <div className="grid2">
          <Field label="apiKey">
            <input
              value={state.settings.firebase.apiKey}
              onChange={(e) => updateSettings({ firebase: { ...state.settings.firebase, apiKey: e.target.value } })}
            />
          </Field>
          <Field label="authDomain">
            <input
              value={state.settings.firebase.authDomain}
              placeholder="myapp.firebaseapp.com"
              onChange={(e) => updateSettings({ firebase: { ...state.settings.firebase, authDomain: e.target.value } })}
            />
          </Field>
          <Field label="projectId">
            <input
              value={state.settings.firebase.projectId}
              onChange={(e) => updateSettings({ firebase: { ...state.settings.firebase, projectId: e.target.value } })}
            />
          </Field>
          <Field label="appId">
            <input
              value={state.settings.firebase.appId}
              onChange={(e) => updateSettings({ firebase: { ...state.settings.firebase, appId: e.target.value } })}
            />
          </Field>
        </div>
        <div className="row">
          <button
            disabled={!firebaseReady(state.settings.firebase)}
            onClick={() =>
              run('cloud-save', async () => {
                await cloudSave(getState());
                setCloudMsg('Состояние сохранено в Firestore (selfConveyor/state)');
              })
            }
          >
            сохранить в облако
          </button>
          <button
            disabled={!firebaseReady(state.settings.firebase)}
            onClick={() =>
              run('cloud-load', async () => {
                const loaded = await cloudLoad(state.settings.firebase);
                if (loaded) {
                  if (confirm('Загрузить состояние из облака? Текущие локальные данные будут заменены.')) {
                    replaceState(loaded);
                    setCloudMsg('Состояние загружено из облака');
                  }
                } else {
                  setCloudMsg('В облаке пока нет данных');
                }
              })
            }
          >
            загрузить из облака
          </button>
        </div>
        {cloudMsg && <div className="ok-box">{cloudMsg}</div>}
        <div className="small muted" style={{ marginTop: 6 }}>
          Документ: коллекция <span className="mono">selfConveyor</span>, документ <span className="mono">state</span>.
          При включённом Firebase любое изменение автосохраняется в облако. Настройте правила Firestore под себя
          (например, доступ только вам).
        </div>
      </div>

      <div className="panel section">
        <h2 style={{ fontSize: 14 }}>Помодоро</h2>
        <div className="row">
          <Field label="Минут работы">
            <input
              type="number"
              style={{ maxWidth: 110 }}
              value={state.settings.pomodoroWork}
              onChange={(e) => updateSettings({ pomodoroWork: Math.max(1, Number(e.target.value) || 25) })}
            />
          </Field>
          <Field label="Минут перерыва">
            <input
              type="number"
              style={{ maxWidth: 110 }}
              value={state.settings.pomodoroBreak}
              onChange={(e) => updateSettings({ pomodoroBreak: Math.max(1, Number(e.target.value) || 5) })}
            />
          </Field>
        </div>
      </div>

      <div className="panel section">
        <h2 style={{ fontSize: 14 }}>Данные</h2>
        <div className="row">
          <button
            onClick={() => {
              const blob = new Blob([JSON.stringify(getState(), null, 2)], { type: 'application/json' });
              const a = document.createElement('a');
              a.href = URL.createObjectURL(blob);
              a.download = `self-conveyor-${new Date().toISOString().slice(0, 10)}.json`;
              a.click();
            }}
          >
            ⬇ экспорт JSON
          </button>
          <button onClick={() => fileRef.current?.click()}>⬆ импорт JSON</button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            style={{ display: 'none' }}
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              try {
                const data = JSON.parse(await file.text()) as State;
                replaceState(data);
                notify('Данные импортированы');
              } catch {
                notify('Не удалось разобрать файл');
              }
            }}
          />
          <button
            className="danger"
            onClick={() => {
              if (confirm('Полностью сбросить все данные? Действие необратимо.')) {
                replaceState(defaultState());
                notify('Все данные сброшены');
              }
            }}
          >
            сбросить всё
          </button>
        </div>
      </div>
    </div>
  );
}
