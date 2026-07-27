type SectionHeadingProps = {
  title: string;
  subtitle?: string;
  index?: string;
};

export function SectionHeading({ title, subtitle, index }: SectionHeadingProps) {
  return (
    <div className="max-w-2xl">
      {index ? (
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          {index}
        </p>
      ) : null}
      <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
      {subtitle ? (
        <p className="mt-3 text-base leading-7 text-muted-foreground">{subtitle}</p>
      ) : null}
    </div>
  );
}
