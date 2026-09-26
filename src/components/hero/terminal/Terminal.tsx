"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";

import { useSound } from "@/components/providers/SoundProvider";
import { useTheme } from "@/components/providers/ThemeProvider";

import { CHIPS, DIR, MOTD, respond, stamp, suggest, type Block } from "./commands";

export function Terminal() {
  const { enabled: soundOn, toggle: toggleSound, play } = useSound();
  const { resolved } = useTheme();
  const [blocks, setBlocks] = useState<Block[]>([MOTD]);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const nextId = useRef(1);
  const rootRef = useRef<HTMLDivElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const autoplay = useRef({ done: false, timers: [] as number[] });

  const ghost = suggest(value);

  function run(raw: string, source: "user" | "script") {
    const result = respond(raw, { soundOn, theme: resolved, history, toggleSound });
    if (result.clear) {
      setBlocks([]);
      return;
    }
    const block: Block = { id: nextId.current++, cmd: raw.trim(), time: stamp(), out: result.out };
    setBlocks((prev) => [...prev, block].slice(-40));
    if (source === "user") setHistory((prev) => [...prev, raw.trim()].slice(-50));
    setCursor(null);
    if (result.sound) play(result.sound);
    else if (source === "user") play("select");
    result.action?.();
  }

  function cancelAutoplay() {
    const state = autoplay.current;
    if (state.done) return;
    state.done = true;
    state.timers.forEach((id) => window.clearTimeout(id));
    setBusy(false);
    setValue("");
  }

  const runScripted = useEffectEvent((cmd: string) => run(cmd, "script"));
  const typeScripted = useEffectEvent((partial: string) => {
    setValue(partial);
    play("type");
  });

  // Autoplay `whoami` → `now` once the terminal is on screen.
  useEffect(() => {
    const state = { done: false, timers: [] as number[] };
    autoplay.current = state;
    const script = ["whoami", "now"];
    const schedule = (fn: () => void, ms: number) => {
      state.timers.push(
        window.setTimeout(() => {
          if (!state.done) fn();
        }, ms),
      );
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      schedule(() => {
        script.forEach((cmd) => runScripted(cmd));
        state.done = true;
      }, 0);
      return () => {
        state.done = true;
        state.timers.forEach((id) => window.clearTimeout(id));
      };
    }

    const start = () => {
      setBusy(true);
      let t = 450;
      for (const cmd of script) {
        for (let i = 1; i <= cmd.length; i++) {
          t += 65 + Math.random() * 70;
          const partial = cmd.slice(0, i);
          schedule(() => typeScripted(partial), t);
        }
        t += 360;
        schedule(() => {
          setValue("");
          runScripted(cmd);
        }, t);
        t += 700;
      }
      schedule(() => {
        setBusy(false);
        state.done = true;
      }, t);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          observer.disconnect();
          start();
        }
      },
      { threshold: 0.35 },
    );
    if (rootRef.current) observer.observe(rootRef.current);

    return () => {
      state.done = true;
      state.timers.forEach((id) => window.clearTimeout(id));
      observer.disconnect();
    };
  }, []);

  // Keep the newest block in view.
  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [blocks]);

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const atEnd = input.selectionStart === input.value.length;

    if ((event.key === "Tab" || (event.key === "ArrowRight" && atEnd)) && ghost) {
      event.preventDefault(); // only intercept Tab when there's something to complete
      setValue(value + ghost);
      play("tick");
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!history.length) return;
      const next = cursor === null ? history.length - 1 : Math.max(0, cursor - 1);
      setCursor(next);
      setValue(history[next] ?? "");
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      if (cursor === null) return;
      const next = cursor + 1;
      if (next >= history.length) {
        setCursor(null);
        setValue("");
      } else {
        setCursor(next);
        setValue(history[next] ?? "");
      }
    } else if (event.ctrlKey && event.key.toLowerCase() === "l") {
      event.preventDefault();
      setBlocks([]);
    } else if (event.ctrlKey && event.key.toLowerCase() === "c" && !window.getSelection()?.toString()) {
      event.preventDefault();
      setBlocks((prev) => [
        ...prev,
        { id: nextId.current++, cmd: `${value}^C`, time: stamp(), out: null },
      ]);
      setValue("");
    } else if (event.key.length === 1 && !event.metaKey && !event.ctrlKey) {
      play("type");
    }
  }

  return (
    <div
      ref={rootRef}
      className="term"
      onPointerDown={cancelAutoplay}
      onPointerUp={(event) => {
        if (event.pointerType !== "mouse") return;
        if ((event.target as HTMLElement).closest("a, button, input")) return;
        if (window.getSelection()?.toString()) return;
        inputRef.current?.focus({ preventScroll: true });
      }}
    >
      <div
        ref={logRef}
        className="term-log"
        role="log"
        aria-live="polite"
        aria-busy={busy}
        aria-label="Terminal output"
      >
        {blocks.map((block) => (
          <div key={block.id} className="term-block">
            {block.cmd !== undefined ? (
              <>
                <div className="term-meta" aria-hidden>
                  <span>
                    {DIR} <span className="branch">⎇ main</span>
                  </span>
                  <span className="tabular-nums">{block.time}</span>
                </div>
                <div className="term-cmd">
                  <span className="sr-only">Command: </span>
                  {block.cmd}
                </div>
              </>
            ) : null}
            {block.out ? <div className="term-out">{block.out}</div> : null}
          </div>
        ))}
      </div>

      <div className="term-chips" role="group" aria-label="Suggested commands">
        {CHIPS.map((chip) => (
          <button
            key={chip}
            type="button"
            className="term-chip"
            data-sfx-hover
            data-sfx-silent
            onClick={() => {
              cancelAutoplay();
              run(chip, "user");
            }}
          >
            {chip}
          </button>
        ))}
      </div>

      <form
        className="term-form"
        onSubmit={(event) => {
          event.preventDefault();
          cancelAutoplay();
          const command = value;
          setValue("");
          if (command.trim()) run(command, "user");
        }}
      >
        <label htmlFor="terminal-input" className="term-prompt">
          <span className="sr-only">Type a command</span>
          <span aria-hidden>
            {DIR} <b>❯</b>
          </span>
        </label>
        <div className="term-field">
          <input
            id="terminal-input"
            ref={inputRef}
            className="term-input"
            value={value}
            placeholder={busy ? "" : "type a command…"}
            autoComplete="off"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="send"
            aria-describedby="terminal-hint"
            onFocus={cancelAutoplay}
            onChange={(event) => {
              setValue(event.target.value);
              setCursor(null);
            }}
            onKeyDown={onKeyDown}
          />
          <span className="term-ghost" aria-hidden>
            <span className="invisible">{value}</span>
            {ghost}
          </span>
        </div>
        <span id="terminal-hint" className="term-hint">
          {ghost ? "tab ↹ complete" : "↵ run"}
        </span>
      </form>
    </div>
  );
}