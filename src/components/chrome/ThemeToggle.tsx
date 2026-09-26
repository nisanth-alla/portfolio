"use client";

import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/components/providers/ThemeProvider";
import { cn } from "@/lib/cn";
import { switchTheme } from "@/lib/theme-transition";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolved } = useTheme();
  const next = resolved === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      className={cn("icon-btn", className)}
      aria-label={`Switch to ${next} theme`}
      title={`${next} theme`}
      data-sfx-hover
      onClick={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        switchTheme(next, { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
      }}
    >
      {/* Icon choice via CSS so server and client markup always match. */}
      <Sun className="h-4 w-4 dark:hidden" aria-hidden />
      <Moon className="hidden h-4 w-4 dark:block" aria-hidden />
    </button>
  );
}