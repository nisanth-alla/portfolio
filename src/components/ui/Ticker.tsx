"use client";

import { useEffect, useRef, type CSSProperties } from "react";

import { cn } from "@/lib/cn";

const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

/**
 * Odometer-style number: each digit rolls up to its value when it scrolls
 * into view. Renders the final value on the server (and for reduced motion).
 */
export function Ticker({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const chars = Array.from(value);
  const order = chars.map((_, i) => chars.slice(0, i).filter((c) => /\d/.test(c)).length);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) return; // already visible

    el.dataset.armed = "true";
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        requestAnimationFrame(() => {
          el.dataset.armed = "false";
        });
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <span ref={ref} className={cn("ticker", className)}>
      <span className="sr-only">{value}</span>
      <span className="ticker-inner" aria-hidden>
        {chars.map((ch, i) =>
          /\d/.test(ch) ? (
            <span
              key={i}
              className="ticker-col"
              style={{ "--v": Number(ch), "--d": order[i] } as CSSProperties}
            >
              {DIGITS.map((digit) => (
                <span key={digit}>{digit}</span>
              ))}
            </span>
          ) : (
            <span key={i} className="ticker-sym">
              {ch}
            </span>
          ),
        )}
      </span>
    </span>
  );
}