"use client";

import { useState } from "react";

import { projects } from "@/content/projects";
import { toolbelt } from "@/content/stack";

/** Project names that list each tool in their stack. */
const usage = new Map(
  toolbelt.map((tool) => [
    tool,
    projects
      .filter((p) =>
        p.stack.some((s) => {
          const name = s.toLowerCase();
          return name === tool || name.startsWith(`${tool} `);
        }),
      )
      .map((p) => p.name),
  ]),
);

function shortUsage(tool: string) {
  const names = usage.get(tool) ?? [];
  if (names.length === 0) return "used across my work";
  if (names.length <= 2) return `used in ${names.join(" and ")}`;
  return `used in ${names.slice(0, 2).join(", ")} +${names.length - 2} more`;
}

function fullUsage(tool: string) {
  const names = usage.get(tool) ?? [];
  return names.length ? `used in ${names.join(", ")}` : "used across my work";
}

type TrackProps = {
  duplicate?: boolean;
  active: string | null;
  onActivate: (tool: string) => void;
};

function Track({ duplicate = false, active, onActivate }: TrackProps) {
  return (
    <ul
      className={`${duplicate ? "marquee-dup " : ""}m-0 flex list-none gap-2 p-0 pr-2`}
      aria-hidden={duplicate || undefined}
    >
      {toolbelt.map((tool) => (
        <li
          key={tool}
          className="tool"
          data-active={active === tool}
          tabIndex={duplicate ? -1 : 0}
          aria-label={duplicate ? undefined : `${tool}, ${fullUsage(tool)}`}
          onPointerEnter={() => onActivate(tool)}
          onFocus={() => onActivate(tool)}
          data-sfx-hover
        >
          <i aria-hidden />
          {tool}
        </li>
      ))}
    </ul>
  );
}

/**
 * The toolbelt behind the projects. Hovering or focusing a tool shows where
 * it's used. The caption has a fixed two-line box so its content never
 * changes the strip's height (which would move chips under a resting cursor
 * and cause hover flicker), and the selection only clears when the pointer
 * or focus leaves the whole strip, not when crossing the gaps between chips.
 */
export function StackMarquee() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <section aria-label="Tools used across these projects" className="border-b border-line">
      <div className="wrap flex flex-col gap-4 py-6 md:flex-row md:items-center md:gap-8">
        <p
          className="m-0 h-[2.6em] w-full flex-none overflow-hidden font-mono text-[12px] leading-[1.3em] md:w-64"
          aria-hidden
        >
          {active ? (
            <>
              <span className="block truncate text-foreground">{active}</span>
              <span className="block truncate text-faint">{shortUsage(active)}</span>
            </>
          ) : (
            <>
              <span className="block truncate text-faint">Tools used across</span>
              <span className="block truncate text-faint">these projects</span>
            </>
          )}
        </p>
        <div
          className="marquee min-w-0 flex-1"
          onPointerLeave={() => setActive(null)}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setActive(null);
          }}
        >
          <div className="marquee-track">
            <Track active={active} onActivate={setActive} />
            <Track duplicate active={active} onActivate={setActive} />
          </div>
        </div>
      </div>
    </section>
  );
}