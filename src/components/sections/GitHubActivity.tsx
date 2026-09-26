"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { Music2 } from "lucide-react";

import { useSound } from "@/components/providers/SoundProvider";
import { Fig, LiveChip } from "@/components/ui/Fig";
import { Section, SectionHead } from "@/components/ui/Section";
import { Status } from "@/components/ui/Status";
import { profile } from "@/content/profile";
import {
  buildMonthLabels,
  buildWeeks,
  calcStreaks,
  describeDay,
  formatDay,
  isoToday,
  type Contribution,
} from "@/lib/contributions";
import { getLatestCommit, type LatestCommit } from "@/lib/github-client";
import { sfx } from "@/lib/sfx";

// ─── Types ────────────────────────────────────────────────────────────────────

type ApiResponse = {
  total: Record<string, number>;
  contributions: Contribution[];
  error?: string;
};
type Tooltip = { date: string; count: number; cx: number; cy: number } | null;
type Cursor = { w: number; d: number } | null;

// ─── Constants ────────────────────────────────────────────────────────────────

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const SHOW_DAY = new Set([1, 3, 5]);

const CELL = 11;
const GAP = 3;
const PITCH = CELL + GAP;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const levelClass = (level: number) => `hm hm-${Math.min(Math.max(level, 0), 4)}`;

// ─── Tooltip (portal → never clipped by overflow ancestors) ───────────────────

const TIP_HEIGHT = 34;
const TIP_GAP = 6;
const EDGE = 8;

function TooltipPortal({ cx, cy, count, label }: { cx: number; cy: number; count: number; label: string }) {
  const below = cy - TIP_HEIGHT - TIP_GAP < EDGE;
  const top = below ? cy + CELL + TIP_GAP : cy - TIP_HEIGHT - TIP_GAP;
  const width = Math.min((label.length + String(count).length + 20) * 7, 320);
  const left = Math.max(EDGE, Math.min(cx - width / 2, window.innerWidth - width - EDGE));

  return createPortal(
    <div className="cell-tip" style={{ top, left }}>
      <b>
        {count} contribution{count === 1 ? "" : "s"}
      </b>{" "}
      · {label}
    </div>,
    document.body,
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function GitHubActivity() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [commit, setCommit] = useState<LatestCommit | null>(null);
  const [commitFailed, setCommitFailed] = useState(false);
  const [error, setError] = useState(false);
  const [year, setYear] = useState(() => new Date().getFullYear());
  const [tooltip, setTooltip] = useState<Tooltip>(null);
  const [cursor, setCursor] = useState<Cursor>(null);
  const [announce, setAnnounce] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const { enabled: soundOn, toggle: toggleSound } = useSound();

  useEffect(() => {
    let alive = true;
    fetch("/api/github?years=2")
      .then((r) => r.json())
      .then((json: ApiResponse) => {
        if (!alive) return;
        setData(json);
        setError(Boolean(json.error));
      })
      .catch(() => alive && setError(true));
    getLatestCommit().then((latest) => {
      if (!alive) return;
      if (latest) setCommit(latest);
      else setCommitFailed(true);
    });
    return () => {
      alive = false;
    };
  }, []);

  const years = useMemo(() => {
    if (!data?.total) return [new Date().getFullYear()];
    return Object.keys(data.total).map(Number).sort((a, b) => a - b);
  }, [data]);

  const yearDays = useMemo(
    () => (data?.contributions ?? []).filter((c) => Number.parseInt(c.date.slice(0, 4), 10) === year),
    [data, year],
  );

  const weeks = useMemo(() => buildWeeks(yearDays), [yearDays]);
  const monthPositions = useMemo(() => buildMonthLabels(weeks, PITCH), [weeks]);
  const total = useMemo(() => yearDays.reduce((sum, d) => sum + d.count, 0), [yearDays]);
  const streaks = useMemo(() => calcStreaks(yearDays, isoToday()), [yearDays]);

  const today = isoToday();
  const todayPos = useMemo(() => {
    let found: { w: number; d: number } | null = null;
    weeks.forEach((week, w) =>
      week.forEach((cell, d) => {
        if (cell && cell.date <= today) found = { w, d };
      }),
    );
    return found as { w: number; d: number } | null;
  }, [weeks, today]);

  const gridWidth = weeks.length * PITCH - GAP;
  const gridHeight = 7 * PITCH - GAP;
  const panFor = (w: number) => (weeks.length > 1 ? (w / (weeks.length - 1)) * 2 - 1 : 0);

  // The tooltip is position: fixed — drop it as soon as the page scrolls.
  useEffect(() => {
    if (!tooltip) return;
    const hide = () => setTooltip(null);
    window.addEventListener("scroll", hide, { passive: true, once: true });
    return () => window.removeEventListener("scroll", hide);
  }, [tooltip]);

  // On narrow screens, start the heatmap at the most recent weeks.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, [weeks]);

  function showCell(w: number, d: number, cell: Contribution, el: Element) {
    const rect = el.getBoundingClientRect();
    setTooltip({ date: cell.date, count: cell.count, cx: rect.left + CELL / 2, cy: rect.top });
    sfx.note(d, cell.level, panFor(w));
  }

  function moveCursor(w: number, d: number) {
    const cell = weeks[w]?.[d];
    if (!cell) return;
    setCursor({ w, d });
    setAnnounce(describeDay(cell));
    const el = gridRef.current?.querySelector(`[data-w="${w}"][data-d="${d}"]`);
    if (el) {
      el.scrollIntoView({ block: "nearest", inline: "nearest" });
      showCell(w, d, cell, el);
    }
  }

  function onGridKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
      ArrowUp: [0, -1],
      ArrowDown: [0, 1],
    };
    const move = moves[event.key];
    if (event.key === "Escape") {
      setTooltip(null);
      setCursor(null);
      return;
    }
    if (!move) return;
    event.preventDefault();
    if (!cursor && todayPos) {
      moveCursor(todayPos.w, todayPos.d);
      return;
    }
    const start = cursor ?? { w: weeks.length - 1, d: 0 };
    let w = start.w + move[0];
    let d = start.d + move[1];
    // Skip padding cells at the edges of the year.
    for (let guard = 0; guard < 14 && !weeks[w]?.[d]; guard++) {
      if (w < 0 || w >= weeks.length || d < 0 || d > 6) return;
      w += move[0] || 0;
      d += move[1] || 0;
    }
    moveCursor(Math.max(0, Math.min(weeks.length - 1, w)), Math.max(0, Math.min(6, d)));
  }

  const stats = [
    { label: "This year", value: total.toLocaleString(), unit: "contributions" },
    { label: "Current streak", value: String(streaks.current), unit: "days" },
    { label: "Longest streak", value: String(streaks.longest), unit: "days" },
  ];

  return (
    <Section id="github">
      <SectionHead
        id="github"
        title={
          <>
            GitHub activity <span className="dim">(personal and open source)</span>
          </>
        }
        lede="My day-to-day work lives in private repositories, so this shows side projects only. Turn on sound and move across the grid: each weekday is a note, and busier days ring brighter."
      />

      <div data-reveal-item style={{ "--i": 1 } as CSSProperties}>
        <Fig
          title="github.com/nisanth-alla · contributions"
          icon="◧"
          meta={<LiveChip />}
          className="spot"
          footer={
            <>
              <span>Live from GitHub · contributions hourly · latest push every 5 min</span>
              <a href={profile.github} target="_blank" rel="noopener noreferrer" className="arrow-link">
                Open profile ↗
              </a>
            </>
          }
        >
          {/* ── Stats + latest push ── */}
          <div className="grid border-b border-line md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
            <div className="grid grid-cols-3 border-b border-line md:border-b-0 md:border-r">
              {stats.map((stat, i) => (
                <div key={stat.label} className={i > 0 ? "border-l border-line px-4 py-5" : "px-4 py-5"}>
                  <p className="label m-0">{stat.label}</p>
                  <p className="m-0 mt-2 text-[28px] font-semibold leading-none tracking-[-0.04em] tabular-nums">
                    {data ? stat.value : "—"}
                  </p>
                  <p className="m-0 mt-1.5 font-mono text-[11px] text-faint">{stat.unit}</p>
                </div>
              ))}
            </div>
            <div className="min-w-0 px-4 py-5">
              <p className="label m-0">Latest push</p>
              {commit ? (
                <a
                  href={commit.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-3 flex min-w-0 items-center gap-3 font-mono text-[12.5px]"
                  title={commit.message || commit.repo}
                >
                  <span aria-hidden className="h-1.5 w-1.5 flex-none rounded-full bg-accent" />
                  <span className="min-w-0 flex-1 truncate">
                    <span className="text-accent-strong">{commit.repo}</span>
                    {commit.message ? <span className="text-muted"> — {commit.message}</span> : null}
                  </span>
                  <span className="flex-none text-[11px] text-faint tabular-nums">{commit.ago}</span>
                </a>
              ) : commitFailed ? (
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="arrow-link mt-3 text-[13px]"
                >
                  See recent activity on GitHub ↗
                </a>
              ) : (
                <p className="m-0 mt-3 font-mono text-[12px] text-faint">Fetching…</p>
              )}
              {commit ? (
                <p className="m-0 mt-3">
                  <Status tone="ok">pushed</Status>
                </p>
              ) : null}
            </div>
          </div>

          {/* ── Heatmap ── */}
          <div className="p-4 sm:p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <p className="m-0 font-mono text-[12px] text-muted">
                <span className="text-foreground">{data ? total.toLocaleString() : "—"}</span> contributions in{" "}
                {year}
              </p>
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={toggleSound}
                  aria-pressed={soundOn}
                  data-sfx-silent
                  className="btn btn-ghost btn-sm sfx-btn"
                >
                  {soundOn ? (
                    <span className="sfx-bars" aria-hidden>
                      <i />
                      <i />
                      <i />
                      <i />
                    </span>
                  ) : (
                    <Music2 className="h-3.5 w-3.5" aria-hidden />
                  )}
                  {soundOn ? "Sound on" : "Play the year"}
                </button>
                <span className="mx-1 h-5 w-px bg-line" aria-hidden />
                <div className="flex gap-1.5" role="group" aria-label="Year">
                  {years.map((y) => (
                    <button
                      key={y}
                      type="button"
                      onClick={() => {
                        setYear(y);
                        setCursor(null);
                        setTooltip(null);
                      }}
                      aria-pressed={year === y}
                      data-sfx-hover
                      className={
                        year === y
                          ? "btn btn-sm border-foreground bg-foreground text-background"
                          : "btn btn-ghost btn-sm"
                      }
                    >
                      {y}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div ref={scrollRef} className="overflow-x-auto pb-1">
              {error ? (
                <p className="m-0 font-mono text-[12px] text-muted">
                  <span className="text-err">●</span> Couldn&apos;t reach GitHub right now. Try again later.
                </p>
              ) : !data ? (
                <div className="space-y-[3px]" role="status" aria-label="Loading contributions">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div key={i} className="h-[11px] w-full animate-pulse rounded-sm bg-line-soft" />
                  ))}
                </div>
              ) : (
                <div className="w-max p-1.5">
                  <div className="flex gap-[3px]">
                    <div className="flex shrink-0 flex-col gap-[3px] pr-1.5" style={{ paddingTop: CELL + 6 }}>
                      {DAYS.map((label, i) => (
                        <div
                          key={label}
                          className="flex items-center font-mono text-[9px] text-faint"
                          style={{ height: CELL, width: 22 }}
                        >
                          {SHOW_DAY.has(i) ? label : ""}
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-col gap-[3px]">
                      <div className="relative h-4 shrink-0" style={{ width: gridWidth }}>
                        {monthPositions.map((m) => (
                          <span
                            key={m.label + m.left}
                            className="absolute font-mono text-[10px] text-faint"
                            style={{ left: m.left }}
                          >
                            {m.label}
                          </span>
                        ))}
                      </div>
                      <div
                        ref={gridRef}
                        className="hm-grid relative"
                        style={{ width: gridWidth, height: gridHeight }}
                        tabIndex={0}
                        role="group"
                        aria-label={`${total} contributions in ${year}. Use arrow keys to explore days.`}
                        onKeyDown={onGridKeyDown}
                        onBlur={() => {
                          setTooltip(null);
                          setCursor(null);
                        }}
                        onMouseLeave={() => setTooltip(null)}
                      >
                        {weeks.map((week, wi) =>
                          week.map((cell, di) =>
                            cell ? (
                              <div
                                key={cell.date}
                                data-w={wi}
                                data-d={di}
                                className={`absolute ${levelClass(cell.level)}${
                                  cell.date > today ? " hm-future" : ""
                                }${cursor?.w === wi && cursor?.d === di ? " hm-cursor" : ""}`}
                                style={{ width: CELL, height: CELL, left: wi * PITCH, top: di * PITCH }}
                                onMouseEnter={(e) => showCell(wi, di, cell, e.currentTarget)}
                              />
                            ) : null,
                          ),
                        )}
                        {tooltip ? (
                          <TooltipPortal
                            cx={tooltip.cx}
                            cy={tooltip.cy}
                            count={tooltip.count}
                            label={formatDay(tooltip.date)}
                          />
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-4 font-mono text-[10px] text-faint">
                    <span className="hidden sm:inline">Tip: focus the grid and use ← ↑ → ↓</span>
                    <span className="flex items-center gap-1.5">
                      <span>Less</span>
                      {[0, 1, 2, 3, 4].map((level) => (
                        <span
                          key={level}
                          className={`inline-block ${levelClass(level)}`}
                          style={{ width: CELL, height: CELL }}
                        />
                      ))}
                      <span>More</span>
                    </span>
                  </div>
                </div>
              )}
            </div>
            <p className="sr-only" aria-live="polite">
              {announce}
            </p>
          </div>
        </Fig>
      </div>
    </Section>
  );
}