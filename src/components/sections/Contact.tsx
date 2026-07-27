import { CopyEmailButton } from "@/components/CopyEmailButton";
import { SectionHeading } from "@/components/SectionHeading";
import { SectionShell } from "@/components/SectionShell";
import { profile } from "@/content/profile";

export function Contact() {
  return (
    <SectionShell id="contact">
      <div className="card-surface max-w-2xl p-8">
        <SectionHeading
          index="09"
          title="Contact"
          subtitle="Open to thoughtful conversations about engineering work, collaboration, and learning."
        />
        <p className="mt-4 text-base leading-7 text-muted-foreground">
          Reach me via{" "}
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="link-accent"
          >
            LinkedIn
          </a>{" "}
          or email at{" "}
          <a href={profile.emailLink} className="link-accent">
            {profile.email}
          </a>
          .
        </p>
        <CopyEmailButton />
      </div>
    </SectionShell>
  );
}
