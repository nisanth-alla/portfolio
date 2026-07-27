import { SectionHeading } from "@/components/SectionHeading";
import { SectionShell } from "@/components/SectionShell";
import { publications } from "@/content/publications";

export function Publications() {
  return (
    <SectionShell id="research" tone="muted">
      <SectionHeading
        index="05"
        title="Research & Publications"
        subtitle="Research work spanning applied embedded systems and deep learning for Indic-language OCR."
      />

      <div className="mt-8 space-y-4">
        {publications.map((item) => (
          <article key={item.title} className="card-surface p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-lg font-semibold tracking-tight">{item.title}</h3>
              <span className="text-sm font-medium text-muted-foreground">
                {item.year}
              </span>
            </div>
            <p className="mt-2 text-sm font-medium text-foreground/85">{item.venue}</p>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {item.description}
            </p>
            {item.link ? (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="link-accent mt-4 inline-block text-sm"
              >
                Read paper
              </a>
            ) : null}
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
