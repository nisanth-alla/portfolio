import { FileText } from "lucide-react";

import { GithubIcon, LinkedinIcon } from "@/components/BrandIcons";
import { ScrollReveal } from "@/components/ScrollReveal";
import { profile } from "@/content/profile";

export function Hero() {
  return (
    <section className="mx-auto flex min-h-[88vh] w-full max-w-5xl flex-col justify-center px-6 py-16 md:py-20">
      <ScrollReveal>
        <div className="max-w-2xl">
          <p className="mb-5 text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
            {profile.role} · {profile.location}
          </p>

          <h1
            className="text-5xl font-extrabold leading-[1.05] tracking-[-0.04em] text-foreground sm:text-6xl lg:text-7xl"
          >
            {profile.name}
          </h1>

          <p className="mt-6 text-lg leading-7 text-muted-foreground sm:text-xl">
            {profile.hero.subtext}
          </p>

          <div className="mt-6 flex items-center gap-3">
            <span className="now-dot" aria-hidden />
            <p className="text-sm text-foreground/80">
              {profile.now}
            </p>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href={profile.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Resume
            </a>
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary inline-flex items-center gap-2"
            >
              <GithubIcon className="h-4 w-4" />
              GitHub
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary inline-flex items-center gap-2"
            >
              <LinkedinIcon className="h-4 w-4" />
              LinkedIn
            </a>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
