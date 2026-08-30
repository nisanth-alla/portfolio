import { ProjectCard } from "@/components/ProjectCard";
import { SectionHeading } from "@/components/SectionHeading";
import { SectionShell } from "@/components/SectionShell";
import { projects } from "@/content/projects";

export function Projects() {
  return (
    <SectionShell id="projects">
      <SectionHeading
       
        title="Featured Projects"
        subtitle="Selected work that shows how I think, build, and document engineering ideas."
      />

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.name} {...project} />
        ))}
      </div>
    </SectionShell>
  );
}
