"use client";

import { Volume2, VolumeX } from "lucide-react";

import { useSound } from "@/components/providers/SoundProvider";
import { cn } from "@/lib/cn";

/** Sound switch. Off by default; the icon gains live equaliser bars when on. */
export function SoundToggle({ className }: { className?: string }) {
  const { enabled, toggle } = useSound();

  return (
    <button
      type="button"
      className={cn("icon-btn sfx-btn", className)}
      aria-pressed={enabled}
      aria-label="Sound effects"
      title={enabled ? "Mute sound effects" : "Turn on sound effects"}
      data-sfx-silent
      onClick={toggle}
    >
      {enabled ? (
        <span className="inline-flex items-center gap-[3px]">
          <Volume2 className="h-4 w-4" aria-hidden />
          <span className="sfx-bars" aria-hidden>
            <i />
            <i />
            <i />
          </span>
        </span>
      ) : (
        <VolumeX className="h-4 w-4" aria-hidden />
      )}
    </button>
  );
}