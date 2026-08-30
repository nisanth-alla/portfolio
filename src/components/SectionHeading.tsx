type SectionHeadingProps = {
  title: string;
  subtitle?: string;
  /** Set false to suppress the left-rule — use for headings inside cards */
  ruled?: boolean;
};

export function SectionHeading({ title, subtitle, ruled = true }: SectionHeadingProps) {
  return (
    <div className={ruled ? "section-rule max-w-2xl" : "max-w-2xl"}>
      <h2 className="text-2xl font-medium tracking-tight sm:text-3xl">{title}</h2>
      {subtitle ? (
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{subtitle}</p>
      ) : null}
    </div>
  );
}
