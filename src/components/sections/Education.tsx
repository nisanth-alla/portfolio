import { SectionHeading } from "@/components/SectionHeading";
import { SectionShell } from "@/components/SectionShell";
import { education } from "@/content/education";

export function Education() {
  return (
    <SectionShell id="education">
      <SectionHeading index="06" title="Education" />

      <div className="mt-8 space-y-4">
        {education.map((item) => (
          <article
            key={item.degree + item.period}
            className="card-surface p-6"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-lg font-semibold tracking-tight">{item.degree}</h3>
              <span className="text-sm font-medium text-muted-foreground">
                {item.period}
              </span>
            </div>
            <p className="mt-1 text-sm font-medium text-foreground/85">
              {item.specialization}
            </p>
            <p className="text-sm text-muted-foreground">{item.university}</p>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {item.description}
            </p>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
