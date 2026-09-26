"use client";

import { useEffect, useState } from "react";

import { Logo } from "@/components/chrome/Logo";
import { PaletteButton } from "@/components/chrome/PaletteButton";
import { SoundToggle } from "@/components/chrome/SoundToggle";
import { sections } from "@/content/nav";
import { cn } from "@/lib/cn";

const IDS = sections.map((s) => s.id);
const pad = (n: number) => String(n).padStart(2, "0");

/** Which section sits in the middle band of the viewport. */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids]);

  return active;
}

/**
 * Floating "pipeline" dock: sections are stages — done ones fill in spruce,
 * the current one glows saffron. Slides in once the top nav leaves.
 */
export function Dock() {
  const [visible, setVisible] = useState(false);
  const active = useActiveSection(IDS);
  const activeIndex = active ? IDS.indexOf(active) : -1;

  useEffect(() => {
    const top = document.getElementById("top");
    if (!top) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(!entry?.isIntersecting));
    observer.observe(top);
    return () => observer.disconnect();
  }, []);

  return (
    <nav aria-label="Sections" className={cn("dock", visible && "is-visible")} inert={!visible}>
      <a href="#top" aria-label="Back to top" className="flex-none">
        <Logo className="h-8 w-8" />
      </a>
      <ol className="dock-stages">
        {sections.map((section, i) => {
          const state = i < activeIndex ? "done" : i === activeIndex ? "active" : "todo";
          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className="dock-stage"
                data-state={state}
                data-tip={section.key.toUpperCase()}
                aria-current={state === "active" ? "true" : undefined}
                aria-keyshortcuts={section.key.toUpperCase()}
                data-sfx-hover
              >
                <span className="dock-dot" aria-hidden />
                <span className="dock-label">{section.title}</span>
              </a>
            </li>
          );
        })}
      </ol>
      <span className="dock-count" aria-hidden>
        {activeIndex >= 0 ? pad(activeIndex + 1) : "--"}/{pad(sections.length)}
      </span>
      <span className="dock-sep" aria-hidden />
      <SoundToggle />
      <PaletteButton compact />
    </nav>
  );
}