"use client";

import { useEffect, useRef, useState } from "react";

const GLYPHS = "01<>/\\|{}[]=+-_*#%";
const DURATION = 900;

/**
 * Text that "decodes" from random glyphs, left to right — on load and again
 * on hover. A hidden sizer reserves the final width, so it never shifts layout.
 */
export function Decode({ text, className }: { text: string; className?: string }) {
  const [display, setDisplay] = useState(text);
  const raf = useRef(0);

  function play() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    cancelAnimationFrame(raf.current);
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / DURATION);
      const settled = Math.floor(p * (text.length + 3)) - 3;
      let out = "";
      for (let i = 0; i < text.length; i++) {
        const ch = text[i] ?? "";
        out += ch === " " || i < settled ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      setDisplay(p < 1 ? out : text);
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  }

  useEffect(() => {
    play();
    return () => cancelAnimationFrame(raf.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- replay only when the text changes
  }, [text]);

  return (
    <span className={`decode ${className ?? ""}`} onPointerEnter={play}>
      <span className="sr-only">{text}</span>
      <span className="decode-sizer" aria-hidden>
        {text}
      </span>
      <span className="decode-live" aria-hidden>
        {display}
      </span>
    </span>
  );
}