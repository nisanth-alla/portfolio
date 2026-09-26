"use client";

import { useEffect, useState } from "react";

import { useSound } from "@/components/providers/SoundProvider";
import { cn } from "@/lib/cn";

type CopyButtonProps = {
  value: string;
  label?: string;
  copiedLabel?: string;
  className?: string;
  /** Accessible name when the visible label is terse (e.g. "copy"). */
  ariaLabel?: string;
  size?: "sm" | "md";
};

export function CopyButton({
  value,
  label = "copy",
  copiedLabel = "copied ✓",
  className,
  ariaLabel,
  size = "sm",
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const { play } = useSound();

  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(id);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      play("success");
    } catch {
      play("error");
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      data-sfx-silent
      aria-label={ariaLabel}
      className={cn("btn btn-ghost", size === "sm" && "btn-sm", className)}
    >
      <span aria-live="polite">{copied ? copiedLabel : label}</span>
    </button>
  );
}