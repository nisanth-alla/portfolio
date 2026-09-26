"use client";

import { useEffect, useId, useRef, useState } from "react";

import { cn } from "@/lib/cn";

type NavPopProps = {
  label: string;
  /** Shown as `nav/<title>` in the pop bar. */
  title: string;
  count: number;
  align?: "left" | "right";
  className?: string;
  children: React.ReactNode;
};

/** Warp-style nav pop-over: opens on hover (mouse) or click, closes on Esc / outside. */
export function NavPop({ label, title, count, align = "left", className, children }: NavPopProps) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  return (
    <div
      ref={wrapRef}
      className="relative"
      onPointerEnter={(event) => {
        if (event.pointerType !== "mouse") return;
        window.clearTimeout(closeTimer.current);
        setOpen(true);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType !== "mouse") return;
        closeTimer.current = window.setTimeout(() => setOpen(false), 140);
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          setOpen(false);
          wrapRef.current?.querySelector("button")?.focus();
        }
      }}
      onBlur={(event) => {
        if (!wrapRef.current?.contains(event.relatedTarget as Node | null)) setOpen(false);
      }}
      onClick={(event) => {
        if ((event.target as HTMLElement).closest("a")) setOpen(false);
      }}
    >
      <button
        type="button"
        className="nav-link"
        aria-expanded={open}
        aria-controls={id}
        data-sfx-hover
        onClick={() => setOpen((value) => !value)}
      >
        {label}
        <span aria-hidden className="text-[10px] text-faint">
          {open ? "^" : "⌄"}
        </span>
      </button>
      {open ? (
        <div id={id} className={cn("nav-pop", align === "right" && "align-right", className)}>
          <div className="pop-bar">
            <span>nav/{title}</span>
            <span>
              {count} {count === 1 ? "link" : "links"}
            </span>
          </div>
          <div className="pop-body">{children}</div>
        </div>
      ) : null}
    </div>
  );
}