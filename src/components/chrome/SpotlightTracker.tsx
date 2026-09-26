"use client";

import { useEffect } from "react";

/**
 * Feeds the cursor position into any `.spot` element under the pointer
 * (as --mx / --my), so its border lights up where the cursor is.
 * One delegated, rAF-throttled listener for the whole page.
 */
export function SpotlightTracker() {
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    let raf = 0;
    let target: HTMLElement | null = null;
    let x = 0;
    let y = 0;

    const onMove = (event: PointerEvent) => {
      const el =
        event.target instanceof Element ? event.target.closest<HTMLElement>(".spot") : null;
      if (!el) return;
      target = el;
      x = event.clientX;
      y = event.clientY;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        if (!target) return;
        const rect = target.getBoundingClientRect();
        target.style.setProperty("--mx", `${x - rect.left}px`);
        target.style.setProperty("--my", `${y - rect.top}px`);
      });
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      document.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}