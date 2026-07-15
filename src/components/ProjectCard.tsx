type ProjectCardProps = {
    name: string;
    description: string;
    stack: string[];
    github?: string;
    live?: string;
  };
  
  export function ProjectCard({
    name,
    description,
    stack,
    github,
    live,
  }: ProjectCardProps) {
    return (
      <article className="rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold tracking-tight">{name}</h3>
        <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
  
        <div className="mt-4 flex flex-wrap gap-2">
          {stack.map((item) => (
            <span
              key={item}
              className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
            >
              {item}
            </span>
          ))}
        </div>
  
        <div className="mt-5 flex gap-4 text-sm font-medium">
          {github ? (
            <a
              href={github}
              target="_blank"
              rel="noreferrer"
              className="text-slate-900 underline underline-offset-4"
            >
              GitHub
            </a>
          ) : null}
          {live ? (
            <a
              href={live}
              target="_blank"
              rel="noreferrer"
              className="text-slate-900 underline underline-offset-4"
            >
              Live
            </a>
          ) : null}
        </div>
      </article>
    );
  }