// ===== Хранение: localStorage (основное) + Firebase Firestore (опционально) =====
import type { FirebaseCfg, State } from './types';

const V1_KEY = 'self-conveyor-state-v1';

// --- индикатор сохранения (для UI) ---
let lastSavedAt: number | null = null;
const savedListeners = new Set<(t: number) => void>();

export function getLastSaved(): number | null {
  return lastSavedAt;
}

export function onSaved(cb: (t: number) => void): () => void {
  savedListeners.add(cb);
  return () => savedListeners.delete(cb);
}

const hasLocalStorage = typeof localStorage !== 'undefined';

/** Читает состояние; если свежего ключа нет — поднимает старые данные v1 для миграции. */
export function loadLocal(key: string): unknown | null {
  if (!hasLocalStorage) return null;
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
    const legacy = localStorage.getItem(V1_KEY);
    return legacy ? JSON.parse(legacy) : null;
  } catch {
    return null;
  }
}

export function saveLocal(key: string, s: State): void {
  if (!hasLocalStorage) return;
  try {
    localStorage.setItem(key, JSON.stringify(s));
    lastSavedAt = Date.now();
    for (const cb of savedListeners) cb(lastSavedAt);
  } catch (e) {
    console.error('saveLocal failed', e);
  }
}

let fsPromise: Promise<unknown> | null = null;
let fsProjectKey = '';

async function getFirestoreFor(cfg: FirebaseCfg): Promise<any> {
  const key = [cfg.apiKey, cfg.projectId, cfg.appId].join('|');
  if (!fsPromise || fsProjectKey !== key) {
    fsProjectKey = key;
    fsPromise = (async () => {
      const { initializeApp, getApps, deleteApp } = await import('firebase/app');
      const { getFirestore } = await import('firebase/firestore');
      for (const app of getApps()) await deleteApp(app).catch(() => {});
      const app = initializeApp({
        apiKey: cfg.apiKey,
        authDomain: cfg.authDomain || `${cfg.projectId}.firebaseapp.com`,
        projectId: cfg.projectId,
        appId: cfg.appId,
      });
      return getFirestore(app);
    })();
  }
  return fsPromise;
}

export function firebaseReady(cfg: FirebaseCfg): boolean {
  return Boolean(cfg.projectId && cfg.apiKey && cfg.appId);
}

export async function cloudSave(state: State): Promise<void> {
  const cfg = state.settings.firebase;
  if (!firebaseReady(cfg)) throw new Error('Firebase не настроен (Настройки → Firebase)');
  const { doc, setDoc } = await import('firebase/firestore');
  const fs = await getFirestoreFor(cfg);
  await setDoc(doc(fs, 'selfConveyor', 'state'), state);
}

export async function cloudLoad(cfg: FirebaseCfg): Promise<State | null> {
  if (!firebaseReady(cfg)) throw new Error('Firebase не настроен (Настройки → Firebase)');
  const { doc, getDoc } = await import('firebase/firestore');
  const fs = await getFirestoreFor(cfg);
  const snap = await getDoc(doc(fs, 'selfConveyor', 'state'));
  return snap.exists() ? (snap.data() as State) : null;
}
