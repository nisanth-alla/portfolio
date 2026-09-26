import type { CSSProperties } from "react";

import { GithubIcon } from "@/components/ui/BrandIcons";
import { CopyButton } from "@/components/ui/CopyButton";
import { FeatureTabs, type FeatureTab } from "@/components/ui/FeatureTabs";
import { FlowPipeline } from "@/components/ui/FlowPipeline";
import { Section, SectionHead } from "@/components/ui/Section";
import { Status } from "@/components/ui/Status";
import { projects, statusLabel, type Project } from "@/content/projects";

function ProjectPanel({ project }: { project: Project }) {
  const status = statusLabel[project.status];

  return (
    <article className="flex h-full flex-col">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <h4 className="m-0 text-[22px] font-semibold tracking-[-0.035em]">{project.name}</h4>
          <Status tone={status.tone}>{status.text}</Status>
        </div>
        <div className="flex flex-wrap gap-2">
          {project.github ? (
            <a href={project.github} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">
              <GithubIcon className="h-3.5 w-3.5" /> Source
            </a>
          ) : null}
          {project.live ? (
            <a href={project.live} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
              Open live <span className="arrow" aria-hidden>↗</span>
            </a>
          ) : null}
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-6 px-5 py-5 sm:px-6">
        <p className="m-0 text-[15px] leading-7 text-muted">{project.why}</p>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <div>
            <p className="label m-0">Architecture</p>
            <div className="mt-3">
              <FlowPipeline stages={project.flow} label={`${project.name} architecture, in order`} />
            </div>
          </div>
          <div>
            <p className="label m-0">Highlights</p>
            <ul className="m-0 mt-3 list-none space-y-2.5 p-0">
              {project.highlights.map((point) => (
                <li key={point} className="flex gap-2.5 text-[13.5px] leading-6 text-foreground/90">
                  <span aria-hidden className="mt-[9px] h-1.5 w-1.5 flex-none rounded-full bg-accent" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {project.quickstart ? (
          <div>
            <div className="flex items-center justify-between gap-3">
              <p className="label m-0">Run it locally</p>
              <CopyButton
                value={project.quickstart.join("\n")}
                label="Copy"
                copiedLabel="Copied ✓"
                ariaLabel={`Copy ${project.name} quickstart commands`}
              />
            </div>
            <pre className="term-scope m-0 mt-2 overflow-x-auto rounded-[10px] px-4 py-3 font-mono text-[12px] leading-6">
              <code>
                {project.quickstart.map((line) => (
                  <span key={line} className="block whitespace-pre">
                    <span className="select-none text-accent">❯ </span>
                    {line}
                  </span>
                ))}
              </code>
            </pre>
          </div>
        ) : null}
      </div>

      <footer className="flex flex-wrap gap-1.5 border-t border-line px-5 py-3.5 sm:px-6">
        {project.stack.map((tech) => (
          <span key={tech} className="chip">
            {tech}
          </span>
        ))}
      </footer>
    </article>
  );
}

export function Projects() {
  const items: FeatureTab[] = projects.map((project) => {
    const status = statusLabel[project.status];
    return {
      id: project.id,
      title: project.name,
      summary: project.tagline,
      meta: <Status tone={status.tone}>{status.text}</Status>,
      panel: <ProjectPanel project={project} />,
    };
  });

  return (
    <Section id="projects">
      <SectionHead
        id="projects"
        title={
          <>
            Selected projects. <span className="dim">Each one started with a problem I kept running into.</span>
          </>
        }
        lede="Select a project to see why I built it, how it works and where it stands today."
      />
      <div data-reveal-item style={{ "--i": 1 } as CSSProperties}>
        <FeatureTabs group="projects" items={items} />
      </div>
    </Section>
  );
}