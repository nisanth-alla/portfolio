import type { CSSProperties } from "react";

import { Fig } from "@/components/ui/Fig";
import { Section, SectionHead } from "@/components/ui/Section";
import { Status } from "@/components/ui/Status";
import { education } from "@/content/education";
import { publications } from "@/content/publications";
import { recognition } from "@/content/recognition";

const step = (i: number) => ({ "--i": i }) as CSSProperties;

export function Research() {
  return (
    <Section id="research">
      <SectionHead
        id="research"
        title="Research and education"
        lede="Published research on embedded automation, current work on Telugu OCR, plus my degrees and awards."
      />

      <div className="grid gap-4 md:grid-cols-2" data-reveal-item style={step(1)}>
        {publications.map((paper) => (
          <Fig
            key={paper.title}
            title={`paper · ${paper.year}`}
            icon="¶"
            className="spot flex flex-col"
            bodyClassName="flex-1 p-5 sm:p-6"
            meta={
              <Status tone={paper.status === "published" ? "ok" : "wait"}>
                {paper.status === "published" ? "published" : "in preparation"}
              </Status>
            }
          >
            <h3 className="m-0 text-[17px] font-semibold leading-snug tracking-[-0.02em]">{paper.title}</h3>
            <p className="m-0 mt-2 font-mono text-[11.5px] leading-5 text-faint">{paper.venue}</p>
            <p className="m-0 mt-4 text-[14.5px] leading-7 text-muted">{paper.description}</p>
            {paper.link ? (
              <a href={paper.link} target="_blank" rel="noopener noreferrer" className="arrow-link mt-4">
                Read the paper ↗
              </a>
            ) : null}
          </Fig>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2" data-reveal-item style={step(2)}>
        <div id="education" className="scroll-mt-24">
          <Fig title="education" icon="◎" className="spot h-full">
            <ul className="m-0 list-none p-0">
              {education.map((item) => (
                <li key={item.degree} className="border-t border-line p-5 first:border-t-0 sm:p-6">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="m-0 text-[16px] font-semibold tracking-[-0.02em]">{item.degree}</h3>
                    <span className="font-mono text-[11px] text-faint tabular-nums">{item.period}</span>
                  </div>
                  <p className="m-0 mt-1 text-[14px] text-foreground/85">{item.specialization}</p>
                  <p className="m-0 font-mono text-[11.5px] text-faint">{item.university}</p>
                  <p className="m-0 mt-3 text-[14px] leading-6 text-muted">{item.description}</p>
                </li>
              ))}
            </ul>
          </Fig>
        </div>

        <div id="recognition" className="scroll-mt-24">
          <Fig title="recognition" icon="★" className="spot h-full">
            <ul className="m-0 list-none p-0">
              {recognition.map((award) => (
                <li key={award.title} className="border-t border-line p-5 first:border-t-0 sm:p-6">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="m-0 text-[16px] font-semibold tracking-[-0.02em]">
                      <span aria-hidden className="mr-2 text-saffron">
                        ★
                      </span>
                      {award.title}
                    </h3>
                    <span className="font-mono text-[11px] text-faint tabular-nums">{award.year}</span>
                  </div>
                  <p className="m-0 mt-3 text-[14px] leading-6 text-muted">{award.description}</p>
                </li>
              ))}
            </ul>
          </Fig>
        </div>
      </div>
    </Section>
  );
}