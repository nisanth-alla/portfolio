import { projects } from "@/content/projects";

export function Projects() {
  return (
    <section
      id="projects"
      className="mx-auto w-full max-w-5xl scroll-mt-24 border-t border-slate-200 px-6 py-14"
    >
      <div className="max-w-2xl">
        <h2 className="text-2xl font-semibold tracking-tight">
          Featured Projects
        </h2>
        <p className="mt-3 text-base text-slate-600">
          Selected work that shows how I think, build, and document engineering ideas.
        </p>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <article
            key={project.name}
            className="rounded-2xl border border-slate-200 p-6 shadow-sm"
          >
            <h3 className="text-lg font-semibold tracking-tight">{project.name}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {project.description}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {project.stack.map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-5 flex gap-4 text-sm font-medium">
              {project.github ? (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-900 underline underline-offset-4"
                >
                  GitHub
                </a>
              ) : null}
              {project.live ? (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-900 underline underline-offset-4"
                >
                  Live
                </a>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}