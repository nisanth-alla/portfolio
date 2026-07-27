import { SectionHeading } from "@/components/SectionHeading";
import { SectionShell } from "@/components/SectionShell";
import { recognition } from "@/content/recognition";

export function Recognition() {
  return (
    <SectionShell tone="muted">
      <SectionHeading index="07" title="Recognition" />

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {recognition.map((award) => (
          <article key={award.title} className="card-surface p-6">
            <h3 className="text-lg font-semibold tracking-tight">
              <span aria-hidden="true" className="mr-2">
                🏆
              </span>
              {award.title}{" "}
              <span className="font-normal text-muted-foreground">({award.year})</span>
            </h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {award.description}
            </p>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
