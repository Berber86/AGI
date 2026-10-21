// ===== Хранение: localStorage (основное) + Firebase Firestore (опциональная синхронизация) =====
import type { FirebaseCfg, State } from './types';

export const STORAGE_KEY = 'self-conveyor-state-v1';

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

export function loadLocal(): State | null {
  if (!hasLocalStorage) return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as State) : null;
  } catch {
    return null;
  }
}

export function saveLocal(s: State): void {
  if (!hasLocalStorage) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    lastSavedAt = Date.now();
    for (const cb of savedListeners) cb(lastSavedAt);
  } catch (e) {
    console.error('saveLocal failed', e);
  }
}

type Fs = unknown;
let fsPromise: Promise<Fs> | null = null;
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
