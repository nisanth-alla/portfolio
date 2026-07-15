type SectionHeadingProps = {
    title: string;
    subtitle?: string;
  };
  
  export function SectionHeading({ title, subtitle }: SectionHeadingProps) {
    return (
      <div className="max-w-2xl">
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        {subtitle ? <p className="mt-3 text-base text-slate-600">{subtitle}</p> : null}
      </div>
    );
  }