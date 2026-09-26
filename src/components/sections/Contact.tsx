import type { CSSProperties } from "react";

import { CopyButton } from "@/components/ui/CopyButton";
import { Fig, LiveChip } from "@/components/ui/Fig";
import { Section, SectionHead } from "@/components/ui/Section";
import { profile } from "@/content/profile";

const card: Array<[string, string]> = [
  ["email", profile.email],
  ["linkedin", "in/nisanth-alla"],
  ["github", profile.handle],
  ["based_in", `${profile.city}, India`],
  ["timezone", `${profile.timezoneLabel} (UTC+5:30)`],
  ["open_to", "new opportunities"],
];

export function Contact() {
  return (
    <Section id="contact">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-center lg:gap-16">
        <div>
          <SectionHead
            id="contact"
            title={
              <>
                Let&apos;s <span className="mark">talk</span>.
              </>
            }
            lede="I'm open to new roles and collaborations. Email is the quickest way to reach me."
            className="mb-0"
          />
          <div className="mt-8 flex flex-wrap gap-3" data-reveal-item style={{ "--i": 1 } as CSSProperties}>
            <a href={profile.emailLink} className="btn btn-primary">
              Email me <span className="arrow" aria-hidden>→</span>
            </a>
            <CopyButton value={profile.email} label="Copy email" copiedLabel="Copied ✓" size="md" />
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              LinkedIn ↗
            </a>
            <a href={profile.resume} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              Résumé ↓
            </a>
          </div>
        </div>

        <div data-reveal-item style={{ "--i": 2 } as CSSProperties}>
          <Fig
            title="contact.json"
            icon="{}"
            className="spot"
            meta={<LiveChip label={`${profile.city} · ${profile.timezoneLabel}`} />}
          >
            <pre className="code m-0 px-5 py-5 text-[13px]" tabIndex={0} aria-label="Contact details as JSON">
              <code>
                <span className="tok-p">{"{"}</span>
                {"\n"}
                {card.map(([key, value], i) => (
                  <span key={key}>
                    {"  "}
                    <span className="tok-k">&quot;{key}&quot;</span>
                    <span className="tok-p">: </span>
                    <span className="tok-s">&quot;{value}&quot;</span>
                    <span className="tok-p">{i < card.length - 1 ? "," : ""}</span>
                    {"\n"}
                  </span>
                ))}
                <span className="tok-p">{"}"}</span>
              </code>
            </pre>
          </Fig>
        </div>
      </div>
    </Section>
  );
}