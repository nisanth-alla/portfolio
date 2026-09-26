/**
 * A tiny localStorage-backed store shaped for `useSyncExternalStore`.
 * Keeps preference state (sound, shortcuts) out of effects and in sync
 * across tabs via the `storage` event.
 */
export function createLocalStore<T extends string>(
  key: string,
  fallback: T,
  allowed: readonly T[],
) {
  const listeners = new Set<() => void>();

  function read(): T {
    if (typeof window === "undefined") return fallback;
    try {
      const value = window.localStorage.getItem(key);
      return value !== null && (allowed as readonly string[]).includes(value)
        ? (value as T)
        : fallback;
    } catch {
      return fallback; // private mode / blocked storage
    }
  }

  function subscribe(listener: () => void) {
    listeners.add(listener);
    const onStorage = (event: StorageEvent) => {
      if (event.key === key) listener();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  }

  function write(value: T) {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      /* ignore */
    }
    listeners.forEach((listener) => listener());
  }

  return { read, subscribe, write, fallback };
}
