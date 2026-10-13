/**
 * localStorage can throw for reasons that have nothing to do with this game:
 * private browsing, disabled cookies, or a `file://` page with opaque origin.
 * The game must never break because of that, so every access goes through here.
 */
export function readStore(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeStore(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* saving a preference is a bonus, never a requirement */
  }
}
