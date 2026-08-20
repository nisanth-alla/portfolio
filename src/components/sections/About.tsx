import { SectionHeading } from "@/components/SectionHeading";
import { SectionShell } from "@/components/SectionShell";
import { about } from "@/content/about";
import { profile } from "@/content/profile";

export function About() {
  return (
    <SectionShell id="about">
      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <SectionHeading index="02" title="About" />
          <p className="mt-4 text-base leading-7 text-muted-foreground">{about.bio}</p>
          <p className="mt-4 text-sm text-muted-foreground">
            Based in {profile.location}.
          </p>
        </div>

        <div className="card-surface p-6 md:p-8">
          <SectionHeading title="Engineering Philosophy" />
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            {about.philosophy}
          </p>
        </div>
      </div>
    </SectionShell>
  );
}
