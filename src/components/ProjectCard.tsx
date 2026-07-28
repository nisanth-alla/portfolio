type ProjectCardProps = {
  name: string;
  description: string;
  stack: string[];
  github?: string;
  live?: string;
  points?: string[];
};

export function ProjectCard({
  name,
  description,
  stack,
  github,
  live,
  points,
}: ProjectCardProps) {
  return (
    <article className="card-surface flex h-full flex-col p-6">
      <h3 className="text-lg font-semibold tracking-tight">{name}</h3>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p>

      {points?.length ? (
        <ul className="mt-4 space-y-2 text-sm leading-6 text-foreground/85">
          {points.map((point) => (
            <li key={point} className="flex gap-2">
              <span aria-hidden className="text-accent">
                —
              </span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        {stack.map((item) => (
          <span
            key={item}
            className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground/80"
          >
            {item}
          </span>
        ))}
      </div>

      <div className="mt-auto flex gap-4 pt-5 text-sm font-medium">
        {github ? (
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            className="link-accent"
          >
            GitHub
          </a>
        ) : null}
        {live ? (
          <a href={live} target="_blank" rel="noopener noreferrer" className="link-accent">
            Live
          </a>
        ) : null}
      </div>
    </article>
  );
}
