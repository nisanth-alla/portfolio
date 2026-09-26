import type { CSSProperties } from "react";

import { GithubIcon, LinkedinIcon } from "@/components/ui/BrandIcons";
import { Terminal } from "@/components/hero/terminal/Terminal";
import { Telemetry } from "@/components/hero/Telemetry";
import { Decode } from "@/components/ui/Decode";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { Fig, LiveChip } from "@/components/ui/Fig";
import { profile } from "@/content/profile";

const step = (i: number) => ({ "--i": i }) as CSSProperties;
const MARKED_PHRASES = ["reliable", "tools I wish existed"];

/** Highlight the first marked phrase found in a headline line. */
function withMarks(line: string) {
  const phrase = MARKED_PHRASES.find((p) => line.includes(p));
  if (!phrase) return line;
  const at = line.indexOf(phrase);
  return (
    <>
      {line.slice(0, at)}
      <span className="mark">{phrase}</span>
      {line.slice(at + phrase.length)}
    </>
  );
}

export function Hero() {
  const [lineOne = "", lineTwo = ""] = profile.hero.headline;

  return (
    <section aria-labelledby="hero-title" className="relative border-b border-line">
      <div className="wrap grid grid-cols-1 gap-12 pb-16 pt-10 md:pb-24 md:pt-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)] lg:items-center lg:gap-14">
        <div>
          <div className="rise flex flex-wrap items-center gap-3" style={step(0)}>
            <a href="#contact" className="avail" data-sfx-hover>
              <i aria-hidden />
              Open to new opportunities
            </a>
            <span className="font-mono text-[12px] text-faint">
              {profile.role} · {profile.city}, IN
            </span>
          </div>

          <h1 id="hero-title" className="h-display rise mt-7" style={step(1)}>
            <Decode text={profile.name} />
          </h1>

          <p
            className="rise mt-6 text-[clamp(1.35rem,2.4vw,1.85rem)] font-medium leading-[1.25] tracking-[-0.03em]"
            style={step(2)}
          >
            <span className="text-foreground">{withMarks(lineOne)}</span>
            <br />
            <span className="text-muted">{withMarks(lineTwo)}</span>
          </p>

          <p className="lede rise mt-5 max-w-xl" style={step(3)}>
            {profile.hero.subtext}
          </p>

          <div className="rise mt-8 flex flex-wrap gap-3" style={step(4)}>
            <a href={profile.resume} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              Download résumé <span className="arrow" aria-hidden>↓</span>
            </a>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              <LinkedinIcon className="h-4 w-4" /> LinkedIn
            </a>
            <a href={profile.github} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              <GithubIcon className="h-4 w-4" /> GitHub
            </a>
          </div>

          <div className="rise mt-9 flex max-w-xl items-start gap-3 border-t border-line pt-5" style={step(5)}>
            <span
              aria-hidden
              className="mt-[7px] h-2 w-2 flex-none rounded-full bg-saffron shadow-[0_0_0_4px_color-mix(in_oklab,var(--saffron)_25%,transparent)]"
            />
            <p className="m-0 text-[14.5px] leading-6 text-muted">
              <span className="font-mono text-[12px] font-medium text-foreground">Now: </span>
              {profile.now}
            </p>
          </div>
        </div>

        <div className="rise min-w-0" style={step(3)}>
          <Fig
            title="nisanth@portfolio: ~"
            meta={<LiveChip label="interactive" />}
            className="term-scope"
            footer={null}
          >
            <ErrorBoundary
              name="terminal"
              fallback={
                <p className="m-0 px-4 py-10 font-mono text-[12.5px] text-muted">
                  The terminal failed to start. Everything it shows is also further down the page.
                </p>
              }
            >
              <Terminal />
              <Telemetry />
            </ErrorBoundary>
          </Fig>
          <p className="mt-3 text-center font-mono text-[11px] text-faint">
            It&apos;s a working terminal. Type <span className="text-muted">help</span> to start.
          </p>
        </div>
      </div>
    </section>
  );
}