"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";

import { useSound } from "@/components/providers/SoundProvider";
import { sections } from "@/content/nav";
import { createLocalStore } from "@/lib/local-store";
import { jumpTo } from "@/lib/scroll";

// Single-key shortcuts can be turned off (WCAG 2.1.4 Character Key Shortcuts).
const shortcutStore = createLocalStore<"on" | "off">("portfolio-shortcuts", "on", ["on", "off"]);

type UiContextValue = {
  paletteOpen: boolean;
  openPalette: () => void;
  closePalette: () => void;
  shortcutsEnabled: boolean;
  setShortcutsEnabled: (value: boolean) => void;
};

const UiContext = createContext<UiContextValue | null>(null);

function isEditable(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || target.isContentEditable;
}

export function UiProvider({ children }: { children: React.ReactNode }) {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const { play } = useSound();

  const shortcutsEnabled = useSyncExternalStore(
    shortcutStore.subscribe,
    () => shortcutStore.read() === "on",
    () => true,
  );

  const openPalette = useCallback(() => {
    setPaletteOpen(true);
    play("open");
  }, [play]);

  const closePalette = useCallback(() => setPaletteOpen(false), []);

  const setShortcutsEnabled = useCallback((value: boolean) => {
    shortcutStore.write(value ? "on" : "off");
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key;

      // ⌘K / Ctrl+K works everywhere, including inside the terminal input.
      if ((event.metaKey || event.ctrlKey) && !event.altKey && key.toLowerCase() === "k") {
        event.preventDefault();
        if (paletteOpen) {
          setPaletteOpen(false);
        } else {
          openPalette();
        }
        return;
      }

      if (paletteOpen || event.defaultPrevented) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (isEditable(event.target)) return;

      if (key === "/" || key === "?") {
        event.preventDefault();
        openPalette();
        return;
      }

      if (!shortcutsEnabled || event.shiftKey || key.length !== 1) return;
      const section = sections.find((s) => s.key === key.toLowerCase());
      if (section) {
        event.preventDefault();
        jumpTo(section.id);
        play("select");
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [paletteOpen, shortcutsEnabled, openPalette, play]);

  const value = useMemo(
    () => ({ paletteOpen, openPalette, closePalette, shortcutsEnabled, setShortcutsEnabled }),
    [paletteOpen, openPalette, closePalette, shortcutsEnabled, setShortcutsEnabled],
  );

  return <UiContext value={value}>{children}</UiContext>;
}

export function useUi() {
  const ctx = useContext(UiContext);
  if (!ctx) throw new Error("useUi must be used within UiProvider");
  return ctx;
}