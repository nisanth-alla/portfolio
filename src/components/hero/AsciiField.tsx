"use client";

import { useEffect, useRef } from "react";

const CELL_W = 11;
const CELL_H = 18;
const RAMP = ".·:-=+*#%@"; // density levels, sparse → dense
const LENS = 170; // cursor lens radius (px)
const RIPPLE_MS = 1500;
const FRAME_MS = 1000 / 30;

type Ripple = { x: number; y: number; t: number };

/**
 * Ambient ASCII field: slow interference waves rendered as monospace glyphs.
 * The cursor is a lens that densifies and colours nearby glyphs; clicks send
 * a ripple. Glyphs come from a pre-rendered atlas (drawImage, no fillText per
 * frame), throttled to 30fps, paused offscreen / in background tabs, and a
 * single static frame under prefers-reduced-motion.
 */
export function AsciiField({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;
    let dpr = 1;
    let atlas: HTMLCanvasElement | null = null;
    let raf = 0;
    let running = false;
    let inView = true;
    let last = 0;
    const start = performance.now();
    const pointer = { x: -9999, y: -9999, on: false };
    const ripples: Ripple[] = [];

    const readTokens = () => {
      const s = getComputedStyle(document.documentElement);
      const v = (name: string, fallback: string) => s.getPropertyValue(name).trim() || fallback;
      return {
        colors: [v("--faint", "#6b7370"), v("--accent", "#0b7a6c"), v("--saffron", "#efa51b")],
        font: v("--font-geist-mono", "ui-monospace, monospace"),
      };
    };

    const buildAtlas = () => {
      const { colors, font } = readTokens();
      const a = document.createElement("canvas");
      a.width = Math.ceil(RAMP.length * CELL_W * dpr);
      a.height = Math.ceil(colors.length * CELL_H * dpr);
      const actx = a.getContext("2d");
      if (!actx) return;
      actx.scale(dpr, dpr);
      actx.font = `500 12px ${font}`;
      actx.textAlign = "center";
      actx.textBaseline = "middle";
      colors.forEach((color, row) => {
        actx.fillStyle = color;
        actx.globalAlpha = row === 0 ? 0.5 : 1;
        for (let i = 0; i < RAMP.length; i++) {
          actx.fillText(RAMP[i] ?? ".", i * CELL_W + CELL_W / 2, row * CELL_H + CELL_H / 2 + 1);
        }
      });
      atlas = a;
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(width / CELL_W);
      rows = Math.ceil(height / CELL_H);
      buildAtlas();
    };

    const draw = (now: number) => {
      if (!atlas) return;
      const t = (now - start) / 1000;
      ctx.clearRect(0, 0, width, height);
      for (let i = ripples.length - 1; i >= 0; i--) {
        if (now - (ripples[i]?.t ?? 0) > RIPPLE_MS) ripples.splice(i, 1);
      }
      const sw = CELL_W * dpr;
      const sh = CELL_H * dpr;

      for (let r = 0; r < rows; r++) {
        const cy = r * CELL_H + CELL_H / 2;
        for (let c = 0; c < cols; c++) {
          const cx = c * CELL_W + CELL_W / 2;
          const wave =
            Math.sin(c * 0.13 + t * 0.55) +
            Math.sin(r * 0.27 - t * 0.42) +
            Math.sin((c * 0.5 + r * 0.8) * 0.12 + t * 0.3);
          let level = ((wave + 3) / 6 - 0.55) / 0.45;
          let tone = 0;

          if (pointer.on) {
            const dx = cx - pointer.x;
            const dy = cy - pointer.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < LENS * LENS) {
              const k = 1 - Math.sqrt(d2) / LENS;
              level += k * k * 1.2;
              tone = k > 0.6 ? 2 : k > 0.15 ? 1 : 0;
            }
          }
          for (const rp of ripples) {
            const age = (now - rp.t) / RIPPLE_MS;
            const radius = age * 520;
            const d = Math.hypot(cx - rp.x, cy - rp.y);
            const band = 1 - Math.abs(d - radius) / 26;
            if (band > 0) {
              level += band * (1 - age) * 1.1;
              if (tone === 0) tone = 1;
            }
          }

          if (level <= 0) continue;
          const idx = Math.min(RAMP.length - 1, Math.floor(level * RAMP.length));
          ctx.drawImage(atlas, idx * sw, tone * sh, sw, sh, c * CELL_W, r * CELL_H, CELL_W, CELL_H);
        }
      }
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (now - last < FRAME_MS) return;
      last = now;
      draw(now);
    };

    const sync = () => {
      const shouldRun = !reduce && inView && document.visibilityState === "visible";
      if (shouldRun && !running) {
        running = true;
        raf = requestAnimationFrame(frame);
      } else if (!shouldRun && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.on =
        event.pointerType === "mouse" &&
        pointer.x >= 0 &&
        pointer.y >= 0 &&
        pointer.x <= rect.width &&
        pointer.y <= rect.height;
    };
    const onPointerDown = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;
      if ((event.target as Element | null)?.closest("a, button, input, [role='log']")) return;
      ripples.push({ x, y, t: performance.now() });
      if (ripples.length > 4) ripples.shift();
    };
    const onLeave = () => {
      pointer.on = false;
    };

    const init = () => {
      resize();
      if (reduce) draw(start);
      sync();
    };

    const resizeObserver = new ResizeObserver(() => {
      resize();
      if (reduce) draw(start);
    });
    resizeObserver.observe(canvas);
    const intersection = new IntersectionObserver(([entry]) => {
      inView = Boolean(entry?.isIntersecting);
      sync();
    });
    intersection.observe(canvas);
    const themeObserver = new MutationObserver(() => {
      buildAtlas();
      if (reduce) draw(start);
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", sync);
    void document.fonts.ready.then(init);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      intersection.disconnect();
      themeObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className={className} />;
}