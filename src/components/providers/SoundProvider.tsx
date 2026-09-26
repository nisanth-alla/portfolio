"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";

import { createLocalStore } from "@/lib/local-store";
import { sfx, type SfxName } from "@/lib/sfx";

const soundStore = createLocalStore<"on" | "off">("portfolio-sfx", "off", ["on", "off"]);

type SoundContextValue = {
  enabled: boolean;
  toggle: () => void;
  play: (name: SfxName) => void;
};

const SoundContext = createContext<SoundContextValue>({
  enabled: false,
  toggle: () => {},
  play: () => {},
});

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const enabled = useSyncExternalStore(
    soundStore.subscribe,
    () => soundStore.read() === "on",
    () => false,
  );

  useEffect(() => {
    sfx.setEnabled(enabled);
  }, [enabled]);

  // Delegated sounds: hover ticks on [data-sfx-hover], clicks on controls.
  useEffect(() => {
    if (!enabled) return;
    // Re-entering the same element within this window stays silent, so an
    // edge-of-element jitter can never turn into a stream of ticks.
    const REPEAT_WINDOW_MS = 600;
    let lastTarget: Element | null = null;
    let lastAt = 0;

    const onOver = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const target =
        event.target instanceof Element ? event.target.closest("[data-sfx-hover]") : null;
      if (!target) return;
      const now = performance.now();
      const repeat = target === lastTarget && now - lastAt < REPEAT_WINDOW_MS;
      lastTarget = target;
      lastAt = now;
      if (!repeat) sfx.play("tick");
    };

    const onClick = (event: MouseEvent) => {
      const target =
        event.target instanceof Element
          ? event.target.closest("a, button, summary, [role='option']")
          : null;
      if (!target || target.closest("[data-sfx-silent]")) return;
      sfx.play((target.getAttribute("data-sfx") as SfxName | null) ?? "click");
    };

    document.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("click", onClick, true);
    };
  }, [enabled]);

  const toggle = useCallback(() => {
    const next = !enabled;
    soundStore.write(next ? "on" : "off");
    sfx.setEnabled(next);
    if (next) {
      sfx.unlock();
      sfx.play("on");
    }
  }, [enabled]);

  const play = useCallback((name: SfxName) => sfx.play(name), []);

  const value = useMemo(() => ({ enabled, toggle, play }), [enabled, toggle, play]);

  return <SoundContext value={value}>{children}</SoundContext>;
}

export function useSound() {
  return useContext(SoundContext);
}