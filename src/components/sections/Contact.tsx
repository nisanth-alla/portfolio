import { Mail } from "lucide-react";

import { GithubIcon, LinkedinIcon } from "@/components/BrandIcons";
import { CopyEmailButton } from "@/components/CopyEmailButton";
import { SectionHeading } from "@/components/SectionHeading";
import { SectionShell } from "@/components/SectionShell";
import { profile } from "@/content/profile";

export function Contact() {
  return (
    <SectionShell id="contact">
      <div className="max-w-xl">
        <SectionHeading
          title="Contact"
          subtitle="If you're hiring, collaborating, or just want to talk about systems — email is the fastest way in."
        />

        <div className="mt-6 flex flex-col gap-3">
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 rounded-xl border border-border p-3 text-sm transition hover:border-accent/40 hover:bg-muted"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
              <LinkedinIcon className="h-4 w-4 text-foreground" />
            </span>
            <span className="font-medium text-foreground">LinkedIn</span>
            <span className="ml-auto text-muted-foreground transition group-hover:text-foreground">
              {profile.linkedin.replace("https://www.", "").replace(/\/$/, "")}
            </span>
          </a>

          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 rounded-xl border border-border p-3 text-sm transition hover:border-accent/40 hover:bg-muted"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
              <GithubIcon className="h-4 w-4 text-foreground" />
            </span>
            <span className="font-medium text-foreground">GitHub</span>
            <span className="ml-auto text-muted-foreground transition group-hover:text-foreground">
              {profile.github.replace("https://", "").replace(/\/$/, "")}
            </span>
          </a>

          <a
            href={profile.emailLink}
            className="group flex items-center gap-3 rounded-xl border border-border p-3 text-sm transition hover:border-accent/40 hover:bg-muted"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
              <Mail className="h-4 w-4 text-foreground" />
            </span>
            <span className="font-medium text-foreground">Email</span>
            <span className="ml-auto text-muted-foreground transition group-hover:text-foreground">
              {profile.email}
            </span>
          </a>
        </div>

        <div className="mt-6">
          <CopyEmailButton />
        </div>
      </div>
    </SectionShell>
  );
}
