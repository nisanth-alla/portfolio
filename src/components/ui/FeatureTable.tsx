"use client";

import { Fragment, useEffect, useRef, useState, type CSSProperties } from "react";

import { useSound } from "@/components/providers/SoundProvider";
import { cn } from "@/lib/cn";

export type FeatureTab = {
  id: string;
  title: string;
  summary: string;
  meta?: React.ReactNode;
  /** Server-rendered detail panel. */
  panel: React.ReactNode;
};

type FeatureTabsProps = {
  /** Namespace for ids and deep links: `#<group>-<item id>`. */
  group: string;
  items: FeatureTab[];
};

const DESKTOP = "(min-width: 900px)";
const HOVER_INTENT_MS = 70;

/*
 * Only a pointer that physically moved should switch tabs. When content
 * scrolls under a still cursor, browsers fire pointer events at the same
 * screen position — those are ignored. The window listener runs after
 * React's root listener, so handlers see the *previous* position.
 */
let lastScreenX = Number.NaN;
let lastScreenY = Number.NaN;
let pointerTracking = false;
function trackPointer() {
  if (pointerTracking) return;
  pointerTracking = true;
  window.addEventListener(
    "pointermove",
    (event) => {
      lastScreenX = event.screenX;
      lastScreenY = event.screenY;
    },
    { passive: true },
  );
}

/**
 * Summary rows that reveal an elaborated panel.
 * Desktop: hover / focus / click switches the side panel; every panel shares
 * one grid cell so the height never jumps. Mobile: an accordion.
 * Accordion semantics (button-in-heading + aria-expanded) on every layout.
 */
export function FeatureTabs({ group, items }: FeatureTabsProps) {
  const [active, setActive] = useState<string | null>(items[0]?.id ?? null);
  const rootRef = useRef<HTMLDivElement>(null);
  const hoverTimer = useRef<number | undefined>(undefined);
  const pending = useRef<string | null>(null);
  const { play } = useSound();

  const isDesktop = () => window.matchMedia(DESKTOP).matches;

  function activate(id: string, sound: "tick" | "select") {
    if (id === active) return;
    setActive(id);
    play(sound);
  }

  useEffect(() => {
    trackPointer();
  }, []);

  // Deep links: #projects-foxpilot activates (and reveals) that row.
  useEffect(() => {
    const prefix = `${group}-`;
    const sync = () => {
      const hash = decodeURIComponent(window.location.hash.slice(1));
      if (!hash.startsWith(prefix)) return;
      const id = hash.slice(prefix.length);
      if (!items.some((item) => item.id === id)) return;
      window.clearTimeout(hoverTimer.current);
      pending.current = null;
      setActive(id);
      if (window.matchMedia(DESKTOP).matches) {
        requestAnimationFrame(() =>
          rootRef.current?.scrollIntoView({
            block: "start",
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
              ? "auto"
              : "smooth",
          }),
        );
      }
    };
    const raf = requestAnimationFrame(sync);
    window.addEventListener("hashchange", sync);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("hashchange", sync);
    };
  }, [group, items]);

  useEffect(() => () => window.clearTimeout(hoverTimer.current), []);

  function focusRow(index: number) {
    const buttons = rootRef.current?.querySelectorAll<HTMLButtonElement>("[data-ft-btn]");
    if (!buttons?.length) return;
    buttons[(index + buttons.length) % buttons.length]?.focus();
  }

  return (
    <div
      ref={rootRef}
      className="ft"
      style={{ "--ft-rows": items.length, scrollMarginTop: "88px" } as CSSProperties}
    >
      {items.map((item, i) => {
        const isActive = active === item.id;
        const buttonId = `${group}-tab-${item.id}`;
        const panelId = `${group}-panel-${item.id}`;

        return (
          <Fragment key={item.id}>
            <h3
              id={`${group}-${item.id}`}
              className="ft-row scroll-mt-24 font-normal"
              style={{ "--ft-i": i + 1 } as CSSProperties}
            >
              <button
                id={buttonId}
                type="button"
                className="ft-btn"
                aria-expanded={isActive}
                aria-controls={panelId}
                data-ft-btn
                data-sfx-silent
                onClick={() => {
                  if (!isDesktop() && isActive) {
                    setActive(null); // collapse on mobile
                    play("tick");
                  } else {
                    activate(item.id, "select");
                  }
                }}
                onFocus={() => {
                  if (isDesktop()) activate(item.id, "tick");
                }}
                onPointerMove={(event) => {
                  if (event.pointerType !== "mouse" || !isDesktop()) return;
                  if (event.screenX === lastScreenX && event.screenY === lastScreenY) return;
                  if (item.id === active || pending.current === item.id) return;
                  pending.current = item.id;
                  window.clearTimeout(hoverTimer.current);
                  hoverTimer.current = window.setTimeout(() => {
                    pending.current = null;
                    activate(item.id, "tick");
                  }, HOVER_INTENT_MS);
                }}
                onPointerLeave={() => {
                  window.clearTimeout(hoverTimer.current);
                  pending.current = null;
                }}
                onKeyDown={(event) => {
                  if (event.key === "ArrowDown") {
                    event.preventDefault();
                    focusRow(i + 1);
                  } else if (event.key === "ArrowUp") {
                    event.preventDefault();
                    focusRow(i - 1);
                  } else if (event.key === "Home") {
                    event.preventDefault();
                    focusRow(0);
                  } else if (event.key === "End") {
                    event.preventDefault();
                    focusRow(items.length - 1);
                  }
                }}
              >
                <span className="ft-n" aria-hidden>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="ft-title">{item.title}</span>
                    {item.meta}
                  </span>
                  <span className="ft-summary block">{item.summary}</span>
                </span>
                <span className="ft-caret" aria-hidden>
                  +
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={cn("ft-panel", "spot")}
              data-active={isActive}
            >
              <div className="ft-panel-inner h-full">{item.panel}</div>
            </div>
          </Fragment>
        );
      })}
    </div>
  );
}