"use client";

import { useTheme } from "@/components/ThemeProvider";
import type { ThemePreference } from "@/lib/theme";

const options: { value: ThemePreference; label: string }[] = [
  { value: "light", label: "Light theme" },
  { value: "dark", label: "Dark theme" },
];

function ThemeIcon({ mode }: { mode: ThemePreference }) {
  if (mode === "light") {
    return (
      <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4" fill="none">
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
        <path
          stroke="currentColor"
          strokeWidth="1.5"
          d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
        />
      </svg>
    );
  }
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4" fill="none">
      <path
        fill="currentColor"
        d="M21 14.5A8.5 8.5 0 0 1 9.5 3 7 7 0 1 0 21 14.5Z"
      />
    </svg>
  );
}

export function ThemeToggle() {
  const { resolved, setPreference } = useTheme();

  return (
    <div
      className="flex shrink-0 items-center rounded-full border border-border bg-card/80 p-0.5 shadow-sm backdrop-blur"
      role="group"
      aria-label="Color theme"
    >
      {options.map((option) => {
        const active = resolved === option.value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            aria-label={option.label}
            title={option.label}
            onClick={() => setPreference(option.value)}
            className={
              "flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-medium transition " +
              (active
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground")
            }
          >
            <ThemeIcon mode={option.value} />
            <span className="hidden sm:inline capitalize">{option.value}</span>
          </button>
        );
      })}
    </div>
  );
}
