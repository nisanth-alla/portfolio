export const THEME_STORAGE_KEY = "portfolio-theme";

export type ThemePreference = "light" | "dark";
export type ResolvedTheme = "light" | "dark";

export function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/** Returns saved light/dark, or null to mean “follow OS appearance”. */
export function readStoredTheme(): ThemePreference | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
    if (stored === "system") {
      localStorage.removeItem(THEME_STORAGE_KEY);
    }
  } catch {
    /* private browsing / blocked storage */
  }
  return null;
}

export function resolveTheme(preference: ThemePreference | null): ResolvedTheme {
  if (preference === "dark") return "dark";
  if (preference === "light") return "light";
  return getSystemTheme();
}

export function applyResolvedTheme(resolved: ResolvedTheme) {
  const root = document.documentElement;
  root.classList.toggle("dark", resolved === "dark");
  root.style.colorScheme = resolved;
}

const themeListeners = new Set<() => void>();

export function subscribeTheme(onStoreChange: () => void) {
  themeListeners.add(onStoreChange);

  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const onSystemChange = () => {
    if (readStoredTheme() !== null) return;
    applyResolvedTheme(getSystemTheme());
    themeListeners.forEach((listener) => listener());
  };

  const onStorage = (event: StorageEvent) => {
    if (event.key === THEME_STORAGE_KEY) {
      themeListeners.forEach((listener) => listener());
    }
  };

  media.addEventListener("change", onSystemChange);
  window.addEventListener("storage", onStorage);

  return () => {
    themeListeners.delete(onStoreChange);
    media.removeEventListener("change", onSystemChange);
    window.removeEventListener("storage", onStorage);
  };
}

export function setThemePreference(next: ThemePreference) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, next);
  } catch {
    /* ignore */
  }
  applyResolvedTheme(next);
  themeListeners.forEach((listener) => listener());
}

export const themeInitScript = `(function(){try{var k=${JSON.stringify(THEME_STORAGE_KEY)};var t=localStorage.getItem(k);if(t==='system'){localStorage.removeItem(k);t=null;}var s=t==='dark'||(t==='light'?false:window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',s);document.documentElement.style.colorScheme=s?'dark':'light';}catch(e){}})();`;
