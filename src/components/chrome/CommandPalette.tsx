"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";

import { useSound } from "@/components/providers/SoundProvider";
import { useUi } from "@/components/providers/UiProvider";
import { useTheme } from "@/components/providers/ThemeProvider";
import { craft } from "@/content/craft";
import { sections } from "@/content/nav";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { journalHome, journalPageCount } from "@/content/writing";
import { fuzzyScore } from "@/lib/fuzzy";
import { jumpTo } from "@/lib/scroll";
import { switchTheme } from "@/lib/theme-transition";

type Command = {
  id: string;
  group: string;
  label: string;
  desc?: string;
  hint?: string;
  run: () => void;
};

const openExternal = (href: string) => window.open(href, "_blank", "noopener,noreferrer");

export function CommandPalette() {
  const { paletteOpen, closePalette, shortcutsEnabled, setShortcutsEnabled } = useUi();
  const { enabled: soundOn, toggle: toggleSound, play } = useSound();
  const { resolved } = useTheme();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const listId = useId();

  // Keep the native dialog in sync with UI state.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (paletteOpen && !dialog.open) dialog.showModal();
    if (!paletteOpen && dialog.open) dialog.close();
  }, [paletteOpen]);

  const commands = useMemo<Command[]>(() => {
    const nextTheme = resolved === "dark" ? "light" : "dark";
    return [
      ...sections.map((s) => ({
        id: `go-${s.id}`,
        group: "navigate",
        label: s.label,
        desc: s.hint,
        hint: s.key,
        run: () => jumpTo(s.id),
      })),
      ...projects.map((p) => ({
        id: `project-${p.id}`,
        group: "projects",
        label: p.name.toLowerCase(),
        desc: p.tagline,
        run: () => jumpTo(`projects-${p.id}`),
      })),
      ...craft.map((c) => ({
        id: `craft-${c.id}`,
        group: "code",
        label: c.title,
        desc: `${c.project.toLowerCase()} · ${c.file.split("/").pop()}`,
        run: () => jumpTo(`craft-${c.id}`),
      })),
      {
        id: "copy-email",
        group: "actions",
        label: "copy email address",
        desc: profile.email,
        run: () => {
          void navigator.clipboard.writeText(profile.email).then(
            () => play("success"),
            () => play("error"),
          );
        },
      },
      {
        id: "resume",
        group: "actions",
        label: "open resume",
        desc: "pdf, opens in a new tab",
        run: () => openExternal(profile.resume),
      },
      {
        id: "terminal",
        group: "actions",
        label: "focus the terminal",
        desc: "type help to see what it can do",
        run: () => {
          const input = document.getElementById("terminal-input");
          input?.scrollIntoView({ block: "center" });
          input?.focus({ preventScroll: true });
        },
      },
      {
        id: "theme",
        group: "actions",
        label: `switch to ${nextTheme} theme`,
        desc: "with a view-transition reveal",
        run: () => switchTheme(nextTheme),
      },
      {
        id: "sound",
        group: "actions",
        label: soundOn ? "turn sound off" : "turn sound on",
        desc: "synthesized ui sounds, no audio files",
        run: toggleSound,
      },
      {
        id: "shortcuts",
        group: "actions",
        label: shortcutsEnabled ? "disable single-key shortcuts" : "enable single-key shortcuts",
        desc: sections.map((s) => s.key).join(" · "),
        run: () => setShortcutsEnabled(!shortcutsEnabled),
      },
      {
        id: "github",
        group: "elsewhere",
        label: "github",
        desc: "github.com/nisanth-alla",
        run: () => openExternal(profile.github),
      },
      {
        id: "linkedin",
        group: "elsewhere",
        label: "linkedin",
        desc: "in/nisanth-alla",
        run: () => openExternal(profile.linkedin),
      },
      {
        id: "journal",
        group: "elsewhere",
        label: "engineering journal",
        desc: `${journalPageCount} pages of deep dives and demos`,
        run: () => openExternal(journalHome),
      },
      {
        id: "foxpilot",
        group: "elsewhere",
        label: "foxpilot.in",
        desc: "the live beta",
        run: () => openExternal("https://foxpilot.in"),
      },
      {
        id: "source",
        group: "elsewhere",
        label: "source of this site",
        desc: "github.com/nisanth-alla/portfolio",
        run: () => openExternal(profile.source),
      },
    ];
  }, [resolved, soundOn, toggleSound, shortcutsEnabled, setShortcutsEnabled, play]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands
      .map((cmd, order) => ({
        cmd,
        order,
        s: Math.max(
          fuzzyScore(cmd.label, q),
          (cmd.desc ? fuzzyScore(cmd.desc, q) : -1) * 0.5,
          fuzzyScore(cmd.group, q) * 0.4,
        ),
      }))
      .filter((r) => r.s >= 0)
      .sort((a, b) => b.s - a.s || a.order - b.order)
      .map((r) => r.cmd);
  }, [commands, query]);

  const safeIndex = Math.min(activeIndex, Math.max(results.length - 1, 0));
  const grouped = query.trim().length === 0;

  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>(`[data-index="${safeIndex}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [safeIndex]);

  function execute(cmd: Command | undefined) {
    if (!cmd) return;
    play("select");
    closePalette();
    // Let the dialog close (and restore scrolling) before navigating.
    requestAnimationFrame(() => cmd.run());
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!results.length) return;
      const delta = event.key === "ArrowDown" ? 1 : -1;
      setActiveIndex((safeIndex + delta + results.length) % results.length);
      play("tick");
    } else if (event.key === "Enter") {
      event.preventDefault();
      execute(results[safeIndex]);
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="palette"
      aria-label="Command palette"
      onClose={() => {
        setQuery("");
        setActiveIndex(0);
        closePalette();
      }}
      onClick={(event) => {
        if (event.target === dialogRef.current) closePalette();
      }}
    >
      <div className="pop-bar">
        <span>nav/commands</span>
        <span aria-live="polite">
          {results.length} {results.length === 1 ? "result" : "results"}
        </span>
      </div>
      <div className="pal-input-row">
        <span aria-hidden className="text-accent">
          ›
        </span>
        <input
          className="pal-input"
          autoFocus
          value={query}
          placeholder="Search sections, projects and actions…"
          role="combobox"
          aria-expanded="true"
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={results.length ? `${listId}-${safeIndex}` : undefined}
          spellCheck={false}
          autoComplete="off"
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveIndex(0);
          }}
          onKeyDown={onKeyDown}
        />
        <kbd className="kbd">esc</kbd>
      </div>

      <div ref={listRef} id={listId} role="listbox" aria-label="Commands" className="pal-list">
        {results.length === 0 ? (
          <p className="px-4 py-6 font-mono text-[12px] text-faint">
            <span className="text-err">[!!]</span> no command matches “{query}”.
          </p>
        ) : null}
        {results.map((cmd, i) => {
          const showGroup = grouped && (i === 0 || results[i - 1]?.group !== cmd.group);
          return (
            <div key={cmd.id} role="presentation">
              {showGroup ? (
                <div className="pal-group" aria-hidden>
                  {cmd.group}
                </div>
              ) : null}
              <div
                id={`${listId}-${i}`}
                role="option"
                aria-selected={i === safeIndex}
                data-index={i}
                data-sfx-silent
                className="pal-item"
                onMouseMove={() => {
                  if (i !== safeIndex) setActiveIndex(i);
                }}
                onClick={() => execute(cmd)}
              >
                <span className="pfx" aria-hidden>
                  &gt;
                </span>
                <span className="flex-none text-foreground">{cmd.label}</span>
                {cmd.desc ? <span className="desc">{cmd.desc}</span> : null}
                <span className="ml-auto flex flex-none items-center gap-2">
                  {!grouped ? <span className="text-[10px] text-faint">{cmd.group}</span> : null}
                  {cmd.hint ? <kbd className="kbd">{cmd.hint}</kbd> : null}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pal-foot" aria-hidden>
        <span>↑↓ navigate</span>
        <span>↵ select</span>
        <span>esc close</span>
        <span className="ml-auto">shortcuts {shortcutsEnabled ? "on" : "off"}</span>
      </div>
    </dialog>
  );
}