import type { CSSProperties } from "react";

import { Fig } from "@/components/ui/Fig";
import { Section, SectionHead } from "@/components/ui/Section";
import { journey, type Milestone } from "@/content/journey";
import { cn } from "@/lib/cn";
import { shortHash } from "@/lib/hash";

function Commit({ milestone, isHead }: { milestone: Milestone; isHead: boolean }) {
  const isFuture = milestone.year === "Next";
  const hash = shortHash(`${milestone.year}:${milestone.message}`);

  return (
    <li className={cn("commit", isHead && "is-head", isFuture && "is-future")}>
      <span className="commit-node" aria-hidden />
      <div className="min-w-0">
        <p className="commit-head m-0">
          <span className="commit-hash" aria-hidden>
            {isFuture ? "·······" : hash}
          </span>
          {isHead ? <span className="ref is-head">HEAD → main</span> : null}
          {isFuture ? (
            <span className="ref">origin/next</span>
          ) : (
            <span className="ref is-tag">tag: {milestone.year}</span>
          )}
          <span className="commit-msg">
            <span className={cn("commit-type", milestone.type)}>
              {milestone.type}
              {milestone.scope ? `(${milestone.scope})` : ""}:
            </span>{" "}
            {milestone.message}
          </span>
        </p>
        <p className="commit-body">
          <span className="sr-only">{isFuture ? "Next: " : `${milestone.year}: `}</span>
          {milestone.description}
        </p>
      </div>
    </li>
  );
}

export function EngineeringJourney() {
  const headIndex = journey.findLastIndex((m) => m.year !== "Next");

  return (
    <Section id="journey">
      <SectionHead
        id="journey"
        title={
          <>
            Experience <span className="dim">as a git log</span>
          </>
        }
        lede="Oldest first. HEAD is where I am now, and the dashed branch is where I'm heading."
      />
      <div data-reveal-item style={{ "--i": 1 } as CSSProperties}>
        <Fig title="git log --graph --reverse" icon="⎇">
          <div className="relative">
            <span className="gitlog-rail" aria-hidden />
            <ol className="gitlog">
              {journey.map((milestone, i) => (
                <Commit key={milestone.year} milestone={milestone} isHead={i === headIndex} />
              ))}
            </ol>
          </div>
        </Fig>
      </div>
    </Section>
  );
}
