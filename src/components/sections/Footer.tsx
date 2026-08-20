import { GithubIcon, LinkedinIcon } from "@/components/BrandIcons";
import { profile } from "@/content/profile";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mx-auto w-full max-w-5xl border-t border-border px-6 pb-10 pt-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-foreground">
            © {year} {profile.name}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Built with Next.js, TypeScript, and Tailwind CSS.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="rounded-md p-1.5 transition hover:text-foreground"
          >
            <GithubIcon className="h-4 w-4" />
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="rounded-md p-1.5 transition hover:text-foreground"
          >
            <LinkedinIcon className="h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
