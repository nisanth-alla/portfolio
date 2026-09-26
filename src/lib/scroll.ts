function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Jump to an in-page anchor. Uses the hash so the browser handles
 * scroll-margin, history and hashchange listeners (e.g. feature tabs),
 * then moves focus to the section heading for screen-reader users.
 */
export function jumpTo(target: string) {
  const id = target.replace(/^#/, "");
  const el = document.getElementById(id);
  if (!el) {
    window.location.assign(`/#${id}`);
    return;
  }

  if (window.location.hash === `#${id}`) {
    el.scrollIntoView({
      behavior: prefersReducedMotion() ? "auto" : "smooth",
      block: "start",
    });
  } else {
    window.location.hash = id;
  }

  const heading = document.getElementById(`${id}-title`);
  heading?.focus({ preventScroll: true });
}
