import type { GameData } from './gameState.types';

/**
 * Сохранение в localStorage. Изолировано в этом модуле: остальной код
 * не знает о браузере (задел на серверную симуляцию, Фаза 5).
 */

const KEY = 'cog-empires-save-v1';

export function saveGame(data: GameData): void {
  try {
    // Бой — транзиентное состояние: после перезагрузки страницы игрок возвращается на карту
    // (см. docs/DECISIONS.md, D-22).
    localStorage.setItem(KEY, JSON.stringify({ ...data, battle: null }));
  } catch {
    // Переполнение/приватный режим — игра продолжает работать без сохранения.
  }
}

export function loadGame(): GameData | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as GameData;
  } catch {
    return null;
  }
}

export function clearSavedGame(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // игнорируем
  }
}
