import { Award } from "lucide-react";

import { SectionHeading } from "@/components/SectionHeading";
import { SectionShell } from "@/components/SectionShell";
import { recognition } from "@/content/recognition";

export function Recognition() {
  return (
    <SectionShell tone="muted">
      <SectionHeading index="08" title="Recognition" />

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {recognition.map((award) => (
          <article key={award.title} className="card-surface p-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
              <Award className="h-5 w-5 text-accent" />
            </span>
            <h3 className="mt-4 text-lg font-semibold tracking-tight">
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
