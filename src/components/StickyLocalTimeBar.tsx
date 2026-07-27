"use client";

import { VisitorLocalTime } from "@/components/VisitorLocalTime";

export function StickyLocalTimeBar() {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <div
        className="pointer-events-auto flex max-w-[min(100%,24rem)] items-center gap-2.5 rounded-full border border-border bg-background/90 px-4 py-2 text-xs shadow-[0_8px_30px_color-mix(in_oklab,var(--fg)_8%,transparent)] backdrop-blur-md"
        role="status"
        aria-live="polite"
        aria-label="Your local date and time"
      >
        <span aria-hidden className="text-accent">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
            <path
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              d="M12 7v5l3 2"
            />
          </svg>
        </span>
        <span className="shrink-0 font-medium text-muted-foreground">Your time</span>
        <VisitorLocalTime className="truncate tabular-nums" />
      </div>
    </div>
  );
}
