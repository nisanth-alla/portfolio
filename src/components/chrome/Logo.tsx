import { cn } from "@/lib/cn";

/** "N" monogram with a saffron status light. */
export function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden className={cn("block flex-none", className)}>
      <rect width="32" height="32" rx="8" fill="var(--fg)" />
      <path d="M9 23V9h2.6l7.2 9.6V9h2.6v14h-2.6l-7.2-9.6V23z" fill="var(--bg)" />
      <circle cx="25.5" cy="6.5" r="3" fill="var(--saffron)" />
    </svg>
  );
}