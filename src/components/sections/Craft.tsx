import type { CSSProperties } from "react";

import { CodeBlock, Minimap } from "@/components/ui/CodeBlock";
import { FeatureTabs, type FeatureTab } from "@/components/ui/FeatureTabs";
import { Section, SectionHead } from "@/components/ui/Section";
import { craft, type CraftItem } from "@/content/craft";

const LANG: Record<CraftItem["lang"], { label: string; color: string }> = {
  ts: { label: "TypeScript", color: "#3b7bd0" },
  go: { label: "Go", color: "#2aa5c4" },
  python: { label: "Python", color: "#d9a520" },
};

function CraftPanel({ item }: { item: CraftItem }) {
  const parts = item.file.split("/");
  const fileName = parts.at(-1) ?? item.file;
  const repoName = item.repo.split("/").at(-1) ?? item.repo;
  const lang = LANG[item.lang];

  return (
    <div className="flex h-full flex-col">
      <div className="editor-tabs" aria-hidden>
        <span className="editor-tab is-active">
          <span className="dot" style={{ background: lang.color }} />
          {fileName}
        </span>
        <span className="editor-tab">{repoName}</span>
      </div>
      <p className="crumbs m-0" aria-label={`File path: ${item.file}`}>
        <span>{repoName}</span>
        {parts.map((part) => (
          <span key={part}>{part}</span>
        ))}
      </p>
      <div className="editor-body flex-1">
        <CodeBlock
          code={item.code}
          lang={item.lang}
          startLine={item.startLine}
          elided={item.elided}
          label={`${item.file}, lines ${item.startLine} to ${item.endLine}`}
        />
        <Minimap code={item.code} lang={item.lang} />
      </div>
      <p className="m-0 border-t border-line px-4 py-3 text-[13.5px] leading-6 text-muted">
        <span className="label mr-2 text-accent-strong">Context</span>
        {item.note}
      </p>
      <div className="statusbar">
        <span>● {lang.label}</span>
        <span>UTF-8</span>
        <span className="tabular-nums">
          Ln {item.startLine}–{item.endLine}
        </span>
        <a href={item.href} target="_blank" rel="noopener noreferrer">
          View on GitHub ↗
        </a>
      </div>
    </div>
  );
}

export function Craft() {
  const items: FeatureTab[] = craft.map((item) => ({
    id: item.id,
    title: item.title,
    summary: item.summary,
    meta: (
      <span className="chip">
        {LANG[item.lang].label} · {item.project}
      </span>
    ),
    panel: <CraftPanel item={item} />,
  }));

  return (
    <Section id="craft">
      <SectionHead
        id="craft"
        title={
          <>
            Code from my projects.
          </>
        }
        lede="Short excerpts copied from the repos and highlighted at build time. Line numbers match the files on GitHub."
      />
      <div data-reveal-item style={{ "--i": 1 } as CSSProperties}>
        <FeatureTabs group="craft" items={items} />
      </div>
    </Section>
  );
}