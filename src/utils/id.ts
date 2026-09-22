/**
 * Генерация уникальных идентификаторов для экземпляров (предметов, отрядов).
 * Не используется внутри детерминированной логики боя — только в сторе.
 */
let counter = 0;

export function uid(prefix = 'id'): string {
  counter = (counter + 1) % 1_000_000;
  const rand = Math.random().toString(36).slice(2, 8);
  return `${prefix}_${Date.now().toString(36)}_${counter.toString(36)}_${rand}`;
}
