"use client";

import { createContext, useContext, useMemo, useSyncExternalStore } from "react";

import {
  readStoredTheme,
  resolveTheme,
  setThemePreference,
  subscribeTheme,
  type ResolvedTheme,
  type ThemePreference,
} from "@/lib/theme";

type ThemeContextValue = {
  resolved: ResolvedTheme;
  setPreference: (next: ThemePreference) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getClientResolvedTheme(): ResolvedTheme {
  return resolveTheme(readStoredTheme());
}

function getServerResolvedTheme(): ResolvedTheme {
  return "light";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const resolved = useSyncExternalStore(
    subscribeTheme,
    getClientResolvedTheme,
    getServerResolvedTheme,
  );

  const value = useMemo<ThemeContextValue>(
    () => ({
      resolved,
      setPreference: setThemePreference,
    }),
    [resolved],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}
