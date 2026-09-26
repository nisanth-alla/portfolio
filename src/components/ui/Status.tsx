import { cn } from "@/lib/cn";

export type StatusTone = "ok" | "wait" | "err" | "live";

/** Terminal-style status marker: `[ok] shipped`, `[..] drafting`, `[●] active`. */
export function Status({
  tone,
  children,
  className,
}: {
  tone: StatusTone;
  children: React.ReactNode;
  className?: string;
}) {
  return <span className={cn("status", `is-${tone}`, className)}>{children}</span>;
}