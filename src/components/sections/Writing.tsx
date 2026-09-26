import type { CSSProperties } from "react";

import { Section, SectionHead } from "@/components/ui/Section";
import { articles, journalHome, journalPageCount } from "@/content/writing";

export function Writing() {
  return (
    <Section id="writing">
      <SectionHead
        id="writing"
        title="Writing"
        lede={`From my engineering journal, where I write things up as I learn them. ${journalPageCount} pages so far.`}
      />

      <ul className="m-0 list-none p-0" data-reveal-item style={{ "--i": 1 } as CSSProperties}>
        {articles.map((article, i) => (
          <li key={article.href} className="row-item">
            <a
              href={article.href}
              target="_blank"
              rel="noopener noreferrer"
              data-sfx-hover
              className="group grid gap-3 px-1 py-5 sm:grid-cols-[3rem_minmax(0,1fr)_auto] sm:gap-6 sm:px-3"
            >
              <span className="hidden pt-1 font-mono text-[11px] text-faint sm:block">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0">
                <span className="text-[17px] font-semibold tracking-[-0.02em] text-foreground transition-colors group-hover:text-accent-strong">
                  {article.title}
                </span>
                <span className="mt-1.5 block max-w-3xl text-[14.5px] leading-6 text-muted">
                  {article.description}
                </span>
              </span>
              <span className="flex items-start gap-3">
                <span className="chip">{article.topic}</span>
                <span
                  aria-hidden
                  className="pt-0.5 text-[15px] text-faint transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                >
                  ↗
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>

      <div className="mt-10" data-reveal-item style={{ "--i": 2 } as CSSProperties}>
        <a href={journalHome} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
          Browse all {journalPageCount} pages <span className="arrow" aria-hidden>↗</span>
        </a>
      </div>
    </Section>
  );
}