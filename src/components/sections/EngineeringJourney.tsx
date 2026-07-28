import { SectionHeading } from "@/components/SectionHeading";
import { SectionShell } from "@/components/SectionShell";
import { journey, type Milestone } from "@/content/journey";

export function EngineeringJourney() {
  return (
    <SectionShell id="journey" tone="muted">
      <SectionHeading
        index="02"
        title="Engineering Journey"
        subtitle="A concise timeline of how my work and learning have evolved."
      />

      <ol className="relative mt-10 max-w-2xl border-l border-border">
        {journey.map((milestone) => (
          <MilestoneItem key={milestone.year} milestone={milestone} />
        ))}
      </ol>
    </SectionShell>
  );
}

function MilestoneItem({ milestone }: { milestone: Milestone }) {
  const isFuture = milestone.year === "Next";

  return (
    <li className="relative pb-10 pl-10 last:pb-0">
      <span
        aria-hidden="true"
        className={
          "absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full " +
          (isFuture
            ? "border-2 border-foreground bg-background"
            : "bg-foreground")
        }
      />

      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        {milestone.year}
      </p>

      <p className="mt-2 text-base leading-7 text-foreground/90">
        {milestone.description}
      </p>
    </li>
  );
}
