import { Logo } from "@/components/chrome/Logo";
import { NavPop } from "@/components/chrome/NavPop";
import { PaletteButton } from "@/components/chrome/PaletteButton";
import { SoundToggle } from "@/components/chrome/SoundToggle";
import { ThemeToggle } from "@/components/chrome/ThemeToggle";
import { sections, topNavIds } from "@/content/nav";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { journalHome } from "@/content/writing";

const elsewhere = [
  { label: "GitHub", href: profile.github, desc: "github.com/nisanth-alla" },
  { label: "LinkedIn", href: profile.linkedin, desc: "in/nisanth-alla" },
  { label: "Engineering Journal", href: journalHome, desc: "Deep dives, demos and build notes" },
  { label: "foxpilot.in", href: "https://foxpilot.in", desc: "The live beta" },
];

export function TopNav() {
  const links = sections.filter((s) => (topNavIds as readonly string[]).includes(s.id));

  return (
    <header id="top" className="relative z-30">
      <div className="wrap flex h-16 items-center justify-between gap-4">
        <a href="#top" className="flex items-center gap-2.5" aria-label={`${profile.name} — back to top`}>
          <Logo className="h-8 w-8" />
          <span className="text-[15px] font-semibold tracking-[-0.02em]">{profile.name}</span>
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
          <NavPop label="Work" title="projects" count={projects.length} className="w-[27rem]">
            {projects.map((project) => (
              <a key={project.id} href={`#projects-${project.id}`} className="pop-link" data-sfx-hover>
                {project.name}
                <span className="pop-desc">{project.tagline}</span>
              </a>
            ))}
          </NavPop>
          {links.map((section) => (
            <a key={section.id} href={`#${section.id}`} className="nav-link" data-sfx-hover>
              {section.title}
            </a>
          ))}
          <NavPop label="Elsewhere" title="elsewhere" count={elsewhere.length}>
            {elsewhere.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="pop-link"
                data-sfx-hover
              >
                {item.label} ↗<span className="pop-desc">{item.desc}</span>
              </a>
            ))}
          </NavPop>
        </nav>

        <div className="flex items-center gap-2">
          <PaletteButton />
          <SoundToggle />
          <ThemeToggle />
          <a
            href={profile.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-sm hidden sm:inline-flex"
          >
            Résumé
          </a>
        </div>
      </div>
    </header>
  );
}