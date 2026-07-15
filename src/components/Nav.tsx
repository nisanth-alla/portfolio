"use client";

import { useEffect, useState } from "react";

import { profile } from "@/content/profile";

const items = [
  { label: "About", href: "#about", id: "about" },
  { label: "Projects", href: "#projects", id: "projects" },
  { label: "Research", href: "#research", id: "research" },
  { label: "Education", href: "#education", id: "education" },
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
                  ? "border-slate-900 font-medium text-slate-900"
                  : "border-transparent text-slate-600 hover:text-slate-900")
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
    <nav className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/80 backdrop-blur">
      <div className="mx-auto w-full max-w-5xl px-6 py-3 md:py-4">
        <div className="flex items-center justify-between gap-6">
          <a
            href="#top"
            className="text-sm font-semibold tracking-tight text-slate-900"
          >
            {profile.name}
          </a>
          <ul className="hidden items-center gap-x-6 text-sm md:flex">
            <NavLinks active={active} />
          </ul>
        </div>
        <ul className="mt-2 flex gap-x-6 overflow-x-auto text-sm md:hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <NavLinks active={active} />
        </ul>
      </div>
    </nav>
  );
}
