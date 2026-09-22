const STORAGE_KEY = 'cog_empires_save_v1';

export function saveGameStateToLocalStorage(state: unknown): void {
  try {
    const serialized = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (e) {
    console.warn('Failed to save game state to localStorage:', e);
  }
}

export function loadGameStateFromLocalStorage<T>(): T | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch (e) {
    console.warn('Failed to parse saved game state:', e);
    return null;
  }
}

export function clearGameSave(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('Failed to clear game save:', e);
  }
}
