"use client";

import { Search } from "lucide-react";
import { useSyncExternalStore } from "react";

import { useUi } from "@/components/providers/UiProvider";
import { cn } from "@/lib/cn";

const noopSubscribe = () => () => {};

function useModKey() {
  return useSyncExternalStore(
    noopSubscribe,
    () => (/Mac|iPhone|iPad|iPod/.test(navigator.platform) ? "⌘" : "Ctrl"),
    () => "⌘",
  );
}

export function PaletteButton({ compact = false }: { compact?: boolean }) {
  const { openPalette } = useUi();
  const mod = useModKey();

  if (compact) {
    return (
      <button
        type="button"
        onClick={openPalette}
        data-sfx-silent
        aria-label="Open command palette"
        aria-keyshortcuts="Meta+K Control+K"
        className="icon-btn"
      >
        <Search className="h-4 w-4" aria-hidden />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={openPalette}
      data-sfx-silent
      data-sfx-hover
      aria-label="Open command palette"
      aria-keyshortcuts="Meta+K Control+K"
      className={cn(
        "inline-flex h-9 items-center gap-2 rounded-[10px] border border-line bg-panel pl-2.5 pr-1.5 text-[13px] text-muted transition-colors hover:border-accent hover:text-foreground",
      )}
    >
      <Search className="h-3.5 w-3.5" aria-hidden />
      <span className="hidden pr-4 sm:inline">Search</span>
      <span className="hidden items-center gap-1 sm:inline-flex" aria-hidden>
        <kbd className="kbd">{mod}</kbd>
        <kbd className="kbd">K</kbd>
      </span>
    </button>
  );
}