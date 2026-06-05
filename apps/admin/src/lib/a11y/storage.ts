import { A11Y_STORAGE_KEY, A11Y_VERSION, type A11ySettings } from "./types";
import { DEFAULT_A11Y_SETTINGS } from "./defaults";

export function readFromStorage(): A11ySettings | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(A11Y_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<A11ySettings>;
    if (!parsed || typeof parsed !== "object") return null;
    if (parsed.version !== A11Y_VERSION) {
      return { ...DEFAULT_A11Y_SETTINGS, ...parsed, version: A11Y_VERSION };
    }
    return { ...DEFAULT_A11Y_SETTINGS, ...parsed };
  } catch {
    return null;
  }
}

export function saveToStorage(settings: A11ySettings): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(A11Y_STORAGE_KEY, JSON.stringify(settings));
  } catch {
    /* Quota exceeded or private mode — silently ignore */
  }
}

export function clearStorage(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(A11Y_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
