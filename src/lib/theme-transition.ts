import { flushSync } from "react-dom";

import { setThemePreference, type ThemePreference } from "@/lib/theme";

/**
 * Switch theme with a circular reveal from the click point using the
 * View Transitions API. Falls back to an instant swap when unsupported
 * or when the visitor prefers reduced motion.
 */
export function switchTheme(next: ThemePreference, origin?: { x: number; y: number }) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (typeof document.startViewTransition !== "function" || reduce) {
    setThemePreference(next);
    return;
  }

  const x = origin?.x ?? window.innerWidth - 40;
  const y = origin?.y ?? 32;
  const radius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y),
  );

  const transition = document.startViewTransition(() => {
    flushSync(() => setThemePreference(next));
  });

  transition.ready
    .then(() => {
      document.documentElement.animate(
        {
          clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`],
        },
        {
          duration: 560,
          easing: "cubic-bezier(0.2, 0.7, 0.2, 1)",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    })
    .catch(() => {
      /* transition skipped — theme is already applied */
    });
}
