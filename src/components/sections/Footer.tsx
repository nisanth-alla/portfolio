import { Logo } from "@/components/chrome/Logo";
import { sections } from "@/content/nav";
import { profile } from "@/content/profile";

const elsewhere = [
  { label: "GitHub", href: profile.github, external: true },
  { label: "LinkedIn", href: profile.linkedin, external: true },
  { label: "Email", href: profile.emailLink, external: false },
  { label: "Résumé", href: profile.resume, external: true },
];

const colophon = [
  "Next.js 16 · React 19.2",
  "Tailwind CSS v4",
  "Geist + Geist Mono",
  "Web Audio · View Transitions",
];

export function Footer() {
  const year = new Date().getFullYear();
  const sha = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7);
  const branch = process.env.VERCEL_GIT_COMMIT_REF;

  return (
    <footer>
      <div className="wrap grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <a href="#top" className="inline-flex items-center gap-2.5" aria-label="Back to top">
            <Logo className="h-8 w-8" />
            <span className="text-[15px] font-semibold tracking-[-0.02em]">{profile.name}</span>
          </a>
          <p className="m-0 mt-4 max-w-xs text-[14px] leading-6 text-muted">{profile.hero.headline.join(" ")}</p>
        </div>

        <nav aria-label="Footer — sections">
          <p className="label m-0">Sections</p>
          <ul className="m-0 mt-3 list-none p-0">
            {sections.map((section) => (
              <li key={section.id}>
                <a href={`#${section.id}`} className="flex items-center gap-2 py-1 text-[14px] text-muted transition-colors hover:text-foreground">
                  {section.title}
                  <kbd className="kbd hidden md:inline-flex" aria-hidden>
                    {section.key.toUpperCase()}
                  </kbd>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Footer — elsewhere">
          <p className="label m-0">Elsewhere</p>
          <ul className="m-0 mt-3 list-none p-0">
            {elsewhere.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="block py-1 text-[14px] text-muted transition-colors hover:text-foreground"
                >
                  {item.label}
                  {item.external ? " ↗" : ""}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="label m-0">Colophon</p>
          <ul className="m-0 mt-3 list-none p-0">
            {colophon.map((line) => (
              <li key={line} className="py-1 text-[14px] text-muted">
                {line}
              </li>
            ))}
            <li className="py-1 text-[14px] text-muted">
              Press <kbd className="kbd">⌘</kbd> <kbd className="kbd">K</kbd> anywhere
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="wrap flex flex-wrap items-center justify-between gap-3 py-5 font-mono text-[11px] text-faint">
          <span>
            © {year} {profile.name} · built in {profile.city}
          </span>
          <span>
            {sha ? (
              <>
                deployed from {branch ?? "main"}@
                <a
                  href={`${profile.source}/commit/${process.env.VERCEL_GIT_COMMIT_SHA}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted hover:text-accent"
                >
                  {sha}
                </a>
              </>
            ) : (
              <a href={profile.source} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
                view source ↗
              </a>
            )}
          </span>
        </div>
      </div>
    </footer>
  );
}