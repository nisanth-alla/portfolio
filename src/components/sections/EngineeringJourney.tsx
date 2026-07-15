import { journey, type Milestone } from "@/content/journey";

export function EngineeringJourney() {
  return (
    <section className="mx-auto w-full max-w-5xl border-t border-slate-200 px-6 py-14">
      <div className="max-w-2xl">
        <h2 className="text-2xl font-semibold tracking-tight">
          Engineering Journey
        </h2>
      </div>

      <ol className="relative mt-10 max-w-2xl border-l border-slate-200">
        {journey.map((milestone) => (
          <MilestoneItem key={milestone.year} milestone={milestone} />
        ))}
      </ol>
    </section>
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
          (isFuture ? "border-2 border-slate-900 bg-white" : "bg-slate-900")
        }
      />

      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
        {milestone.year}
      </p>

      <p className="mt-2 text-base leading-7 text-slate-700">
        {milestone.description}
      </p>
    </li>
  );
}
