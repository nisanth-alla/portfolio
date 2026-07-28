"use client";

import { useEffect, useState } from "react";

import { ThemeToggle } from "@/components/ThemeToggle";
import { profile } from "@/content/profile";

const items = [
  { label: "About", href: "#about", id: "about" },
  { label: "Journey", href: "#journey", id: "journey" },
  { label: "Projects", href: "#projects", id: "projects" },
  { label: "Research", href: "#research", id: "research" },
  { label: "Writing", href: "#writing", id: "writing" },
  { label: "Contact", href: "#contact", id: "contact" },
];

function NavLinks({ active }: { active: string | null }) {
  return (
    <>
      {items.map((item) => {
        const isActive = active === item.id;
        return (
          <li key={item.href}>
            <a
              href={item.href}
              aria-current={isActive ? "true" : undefined}
              className={
                "block whitespace-nowrap border-b-2 pb-1 transition " +
                (isActive
                  ? "border-foreground font-medium text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground")
              }
            >
              {item.label}
            </a>
          </li>
        );
      })}
    </>
  );
}

export function Nav() {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const activationLine = 96;
    const lastIndex = items.length - 1;

    const update = () => {
      const vh = window.innerHeight;
      let currentId: string | null = null;

      items.forEach((item, i) => {
        const el = document.getElementById(item.id);
        if (!el) return;
        const rect = el.getBoundingClientRect();

        if (rect.top <= activationLine) {
          currentId = item.id;
        }

        if (i === lastIndex && rect.height > 0) {
          const visible = Math.max(
            0,
            Math.min(vh, rect.bottom) - Math.max(0, rect.top),
          );
          if (visible / rect.height >= 0.5) {
            currentId = item.id;
          }
        }
      });

      setActive(currentId);
    };

    const rafId = requestAnimationFrame(update);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <nav
      aria-label="Primary"
      className="sticky top-0 z-40 border-b border-border/70 bg-background/75 backdrop-blur-md"
    >
      <div className="mx-auto w-full max-w-5xl px-6 py-3 md:py-4">
        <div className="flex items-center justify-between gap-4">
          <a
            href="#main-content"
            className="text-sm font-semibold tracking-tight text-foreground"
          >
            {profile.name}
          </a>
          <div className="flex items-center gap-3 md:gap-4">
            <ul className="hidden items-center gap-x-5 text-sm lg:flex">
              <NavLinks active={active} />
            </ul>
            <ThemeToggle />
          </div>
        </div>
        <ul className="mt-2 flex gap-x-5 overflow-x-auto text-sm lg:hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <NavLinks active={active} />
        </ul>
      </div>
    </nav>
  );
}
