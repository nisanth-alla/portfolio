import { SectionHeading } from "@/components/SectionHeading";
import { SectionShell } from "@/components/SectionShell";
import { profile } from "@/content/profile";

export function CurrentFocus() {
  return (
    <SectionShell tone="muted">
      <SectionHeading title="Current Focus" />
      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {profile.focus.map((item) => (
          <li key={item} className="card-surface flex gap-3 p-4 text-sm leading-6 text-muted-foreground">
            <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}
