import { cn } from "@/lib/cn";

type FigProps = {
  title: string;
  /** Small glyph in the title bar badge. */
  icon?: React.ReactNode;
  /** Right side of the title bar (status, live chip…). */
  meta?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  footer?: React.ReactNode;
};

/** A window: title bar, body, optional status footer. */
export function Fig({
  title,
  icon = "›_",
  meta,
  children,
  className,
  bodyClassName,
  footer,
}: FigProps) {
  return (
    <figure className={cn("win m-0", className)}>
      <figcaption className="win-bar">
        <span className="win-icon" aria-hidden>
          {icon}
        </span>
        <span className="win-title">{title}</span>
        {meta ? <span className="win-meta">{meta}</span> : null}
      </figcaption>
      <div className={bodyClassName}>{children}</div>
      {footer ? <div className="win-foot">{footer}</div> : null}
    </figure>
  );
}

export function LiveChip({ label = "live" }: { label?: string }) {
  return (
    <span className="live-chip">
      <i aria-hidden />
      {label}
    </span>
  );
}