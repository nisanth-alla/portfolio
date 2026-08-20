import { FileText } from "lucide-react";

import { GithubIcon, LinkedinIcon } from "@/components/BrandIcons";
import { ScrollReveal } from "@/components/ScrollReveal";
import { profile } from "@/content/profile";

export function Hero() {
  return (
    <section className="mx-auto flex min-h-[92vh] w-full max-w-5xl flex-col justify-center px-6 py-16 md:py-20">
      <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
        <ScrollReveal>
          <div className="max-w-3xl">
            <p className="mb-4 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
              <span
                aria-hidden
                className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_12px_color-mix(in_oklab,var(--accent)_65%,transparent)]"
              />
              {profile.role}
            </p>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              {profile.name}
            </h1>

            <p className="mt-4 text-xl font-medium text-foreground/90 sm:text-2xl">
              {profile.hero.headline.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>

            <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              {profile.hero.subtext}
            </p>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-foreground/85">
              <span className="font-medium text-foreground">Now:</span> {profile.now}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
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

        <ScrollReveal>
          <aside className="card-surface p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              At a glance
            </p>
            <ul className="mt-5 space-y-5">
              {profile.highlights.map((item) => (
                <li
                  key={item.label}
                  className="border-b border-border pb-5 last:border-0 last:pb-0"
                >
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {item.label}
                  </p>
                  <p className="mt-1.5 text-sm leading-6 text-foreground sm:text-base">
                    {item.value}
                  </p>
                </li>
              ))}
            </ul>
          </aside>
        </ScrollReveal>
      </div>
    </section>
  );
}
