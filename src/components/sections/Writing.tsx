import { SectionHeading } from "@/components/SectionHeading";
import { SectionShell } from "@/components/SectionShell";
import { writing } from "@/content/writing";

export function Writing() {
  return (
    <SectionShell id="writing" tone="muted">
      <SectionHeading
       
        title="Technical Writing"
        subtitle="Short technical notes and explainers from my learning journey."
      />

      <div className="mt-8 space-y-4">
        {writing.map((item) => (
          <article key={item.title} className="card-surface p-6">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-semibold tracking-tight">{item.title}</h3>
              {item.status === "draft" ? (
                <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                  In progress
                </span>
              ) : null}
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {item.description}
            </p>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
