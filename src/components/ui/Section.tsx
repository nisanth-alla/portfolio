import { Reveal } from "@/components/ui/Reveal";
import { sectionNumber, sections } from "@/content/nav";
import { cn } from "@/lib/cn";

type SectionProps = {
  id: string;
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
};

export function Section({ id, children, className, innerClassName }: SectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={cn("section", className)}>
      <Reveal className={cn("wrap", innerClassName)}>{children}</Reveal>
    </section>
  );
}

type SectionHeadProps = {
  id: string;
  /** Defaults to the section's registry title. */
  eyebrow?: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
};

/** `—— 01  PROJECTS` → headline → lede. The heading is the jump target. */
export function SectionHead({ id, eyebrow, title, lede, children, className }: SectionHeadProps) {
  const number = sectionNumber(id);
  const label = eyebrow ?? sections.find((s) => s.id === id)?.title ?? id;

  return (
    <header className={cn("section-head", className)} data-reveal-item>
      <p className="eyebrow">
        {number ? <b>{number}</b> : null}
        <span>{label}</span>
      </p>
      <h2 id={`${id}-title`} tabIndex={-1} className="h-section">
        {title}
      </h2>
      {lede ? <p className="lede">{lede}</p> : null}
      {children}
    </header>
  );
}