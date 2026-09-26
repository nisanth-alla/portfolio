/**
 * Single source of truth for in-page sections. Drives the top nav, the
 * pipeline dock, single-key shortcuts, section numbering and the palette.
 */
export type SectionLink = {
  id: string;
  /** Lowercase handle used by the terminal and palette. */
  label: string;
  /** Display title for navigation. */
  title: string;
  /** Single-key shortcut (lowercase). */
  key: string;
  hint: string;
};

export const sections: SectionLink[] = [
  { id: "projects", label: "projects", title: "Projects", key: "p", hint: "selected work, with case studies" },
  { id: "craft", label: "craft", title: "Craft", key: "c", hint: "real code from real repos" },
  { id: "journey", label: "journey", title: "Journey", key: "j", hint: "a career as a git log" },
  { id: "about", label: "about", title: "About", key: "a", hint: "how I think about software" },
  { id: "now", label: "now", title: "Now", key: "n", hint: "where I'm investing next" },
  { id: "github", label: "github", title: "GitHub", key: "g", hint: "live contributions" },
  { id: "research", label: "research", title: "Research", key: "r", hint: "papers, education, recognition" },
  { id: "writing", label: "writing", title: "Writing", key: "w", hint: "notes from the engineering journal" },
  { id: "contact", label: "contact", title: "Contact", key: "e", hint: "email is the fastest way in" },
];

/** Sections shown as plain links in the top nav. */
export const topNavIds = ["craft", "journey", "about", "writing"] as const;

export function sectionNumber(id: string) {
  const index = sections.findIndex((s) => s.id === id);
  return index >= 0 ? String(index + 1).padStart(2, "0") : null;
}