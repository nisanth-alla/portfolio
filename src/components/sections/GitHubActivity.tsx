"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { GithubIcon } from "@/components/BrandIcons";
import { SectionHeading } from "@/components/SectionHeading";
import { SectionShell } from "@/components/SectionShell";
import { profile } from "@/content/profile";

// ─── Types ────────────────────────────────────────────────────────────────────

type Contribution = { date: string; count: number; level: number };
type ApiResponse = {
  total: Record<string, number>;
  contributions: Contribution[];
  error?: string;
};
type LatestCommit = {
  message: string;
  repo: string;
  ago: string;
  url: string;
  error?: string;
};
type TooltipState = {
  date: string;
  count: number;
  x: number;
  y: number;
} | null;

// ─── Constants ────────────────────────────────────────────────────────────────

const MONTH_LABELS = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec",
];
// Sunday = 0 in GitHub's calendar (also JS Date convention)
const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
// Only label Mon / Wed / Fri to avoid crowding (indices 1, 3, 5)
const SHOW_DAY = new Set([1, 3, 5]);

const CELL = 11;   // px — cell size
const GAP  = 3;    // px — gap between cells
const PITCH = CELL + GAP; // 14px per column/row

// ─── Colour ───────────────────────────────────────────────────────────────────

function levelColor(level: number, isDark: boolean): string {
  const shades = isDark
    ? ["#192133", "#2d3a6b", "#3d4f9f", "#5b6cf9", "#7c8cf8"]
    : ["#e8eaf6", "#c5c9f4", "#9ba2ef", "#6b74f0", "#5b6cf9"];
  return shades[Math.min(level, 4)] ?? shades[0];
}

// ─── Streak calculation ───────────────────────────────────────────────────────

function calcStreaks(days: Contribution[]) {
  let current = 0;
  let longest = 0;
  let run = 0;
  const today = new Date().toISOString().slice(0, 10);

  // Walk backwards from today to find current streak
  for (let i = days.length - 1; i >= 0; i--) {
    const d = days[i];
    if (!d) break;
    if (d.date > today) continue;
    if (d.count > 0) {
      current++;
    } else {
      // Allow today to be 0 (day not over yet) — only break if yesterday was 0
      if (d.date !== today) break;
    }
  }

  // Walk forwards for longest streak
  for (const d of days) {
    if (d.count > 0) {
      run++;
      if (run > longest) longest = run;
    } else {
      run = 0;
    }
  }

  return { current, longest };
}

// ─── Build week columns with padding ─────────────────────────────────────────
// GitHub aligns Sunday to row 0. Pad the first column with nulls so the
// first real day lands on the right row.

type Cell = Contribution | null;

function buildWeeks(days: Contribution[]): Cell[][] {
  if (!days.length) return [];

  const firstDate = new Date(days[0].date + "T00:00:00");
  // JS getDay(): Sun=0 Mon=1 … Sat=6 — exactly the row index we want
  const startPad = firstDate.getDay();

  const padded: Cell[] = [
    ...Array.from({ length: startPad }, () => null),
    ...days,
  ];

  const weeks: Cell[][] = [];
  for (let i = 0; i < padded.length; i += 7) {
    weeks.push(padded.slice(i, i + 7));
  }
  return weeks;
}

// ─── Month label positions ─────────────────────────────────────────────────────
// Placed by left = colIndex × PITCH (in px), matching the actual cell grid.

function buildMonthPositions(weeks: Cell[][]): { label: string; left: number }[] {
  const positions: { label: string; left: number }[] = [];
  let lastMonth = -1;

  weeks.forEach((week, col) => {
    const firstReal = week.find((c) => c !== null) as Contribution | undefined;
    if (!firstReal) return;
    const month = Number.parseInt(firstReal.date.slice(5, 7), 10);
    if (month !== lastMonth) {
      positions.push({ label: MONTH_LABELS[month - 1], left: col * PITCH });
      lastMonth = month;
    }
  });

  return positions;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function GitHubActivity() {
  const [data, setData]         = useState<ApiResponse | null>(null);
  const [commit, setCommit]     = useState<LatestCommit | null>(null);
  const [error, setError]       = useState(false);
  const [year, setYear]         = useState(() => new Date().getFullYear());
  const [tooltip, setTooltip]   = useState<TooltipState>(null);
  const [isDark, setIsDark]     = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
      : false,
  );
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onMedia = (e: MediaQueryListEvent) => setIsDark(e.matches);
    media.addEventListener("change", onMedia);

    let alive = true;

    fetch("/api/github?years=2")
      .then((r) => r.json())
      .then((j: ApiResponse) => { if (alive) { setData(j); setError(!!j.error); } })
      .catch(() => alive && setError(true));

    fetch("/api/github-commit")
      .then((r) => r.json())
      .then((j: LatestCommit) => { if (alive && !j.error) setCommit(j); })
      .catch(() => { /* commit is optional */ });

    return () => {
      alive = false;
      media.removeEventListener("change", onMedia);
    };
  }, []);

  // ── Derived ──────────────────────────────────────────────────────────────

  const years = useMemo(() => {
    if (!data) return [new Date().getFullYear()];
    return Object.keys(data.total).map(Number).sort((a, b) => a - b);
  }, [data]);

  const yearDays = useMemo(() => {
    if (!data) return [];
    return data.contributions.filter(
      (c) => Number.parseInt(c.date.slice(0, 4), 10) === year,
    );
  }, [data, year]);

  const weeks = useMemo(() => buildWeeks(yearDays), [yearDays]);

  const monthPositions = useMemo(
    () => buildMonthPositions(weeks),
    [weeks],
  );

  const total = useMemo(
    () => yearDays.reduce((s, d) => s + d.count, 0),
    [yearDays],
  );

  const streaks = useMemo(() => calcStreaks(yearDays), [yearDays]);

  // Total grid width so the wrapper can size correctly
  const gridWidth = weeks.length * PITCH - GAP;
  // Total grid height: 7 rows
  const gridHeight = 7 * PITCH - GAP;

  // ── Tooltip handlers ──────────────────────────────────────────────────────

  function handleCellEnter(
    e: React.MouseEvent<HTMLDivElement>,
    cell: Contribution,
  ) {
    const rect = e.currentTarget.getBoundingClientRect();
    const gridRect = gridRef.current?.getBoundingClientRect();
    if (!gridRect) return;
    setTooltip({
      date: cell.date,
      count: cell.count,
      x: rect.left - gridRect.left + CELL / 2,
      y: rect.top - gridRect.top,
    });
  }

  function formatTooltipDate(iso: string) {
    const d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <SectionShell id="github">
      <SectionHeading
        title="GitHub Activity"
        subtitle="Personal and open-source commits only — the proprietary work lives in the journey section."
      />

      <div className="mt-8 card-surface p-5 sm:p-6">

        {/* ── Header row ── */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
              <GithubIcon className="h-[18px] w-[18px] text-foreground" />
            </span>
            <div>
              <p className="text-sm font-medium text-foreground">{profile.name}</p>
              <p className="text-xs text-muted-foreground">
                {total.toLocaleString()} contributions in {year}
              </p>
            </div>
          </div>

          {/* Year picker */}
          <div className="flex gap-1.5 self-start">
            {years.map((y) => (
              <button
                key={y}
                type="button"
                onClick={() => setYear(y)}
                aria-pressed={year === y}
                className={
                  "rounded-full px-3 py-1 text-xs font-medium transition-colors " +
                  (year === y
                    ? "bg-foreground text-background"
                    : "bg-muted text-muted-foreground hover:text-foreground")
                }
              >
                {y}
              </button>
            ))}
          </div>
        </div>

        {/* ── Streak stats ── */}
        {data && (
          <div className="mt-4 flex gap-5 border-t border-border pt-4">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Current streak</p>
              <p className="mt-0.5 text-xl font-semibold tabular-nums text-foreground">
                {streaks.current}
                <span className="ml-1 text-xs font-normal text-muted-foreground">days</span>
              </p>
            </div>
            <div className="w-px bg-border" />
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Longest streak</p>
              <p className="mt-0.5 text-xl font-semibold tabular-nums text-foreground">
                {streaks.longest}
                <span className="ml-1 text-xs font-normal text-muted-foreground">days</span>
              </p>
            </div>
            <div className="w-px bg-border" />
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">This year</p>
              <p className="mt-0.5 text-xl font-semibold tabular-nums text-foreground">
                {total.toLocaleString()}
                <span className="ml-1 text-xs font-normal text-muted-foreground">commits</span>
              </p>
            </div>
          </div>
        )}

        {/* ── Heatmap ── */}
        <div className="mt-5 overflow-x-auto pb-1">
          {error ? (
            <p className="text-sm text-muted-foreground">
              Couldn&apos;t load right now — check back on the next visit.
            </p>
          ) : !data ? (
            <div className="space-y-[3px]">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="h-[11px] w-full animate-pulse rounded-sm bg-muted" />
              ))}
            </div>
          ) : (
            <div>
              {/* Month label row — absolutely positioned over the grid */}
              <div
                className="relative mb-1.5 h-4"
                style={{ width: gridWidth, minWidth: gridWidth }}
              >
                {monthPositions.map((m) => (
                  <span
                    key={m.label + m.left}
                    className="absolute text-[10px] text-muted-foreground"
                    style={{ left: m.left }}
                  >
                    {m.label}
                  </span>
                ))}
              </div>

              {/* Day labels + grid */}
              <div className="flex gap-[3px]">
                {/* Day-of-week axis */}
                <div
                  className="flex shrink-0 flex-col gap-[3px] pr-1.5"
                  style={{ paddingTop: 0 }}
                >
                  {DAY_LABELS.map((label, idx) => (
                    <div
                      key={label}
                      className="flex items-center text-[9px] text-muted-foreground"
                      style={{ height: CELL, width: 20 }}
                    >
                      {SHOW_DAY.has(idx) ? label : ""}
                    </div>
                  ))}
                </div>

                {/* Heatmap grid — relatively positioned for tooltip anchor */}
                <div
                  ref={gridRef}
                  className="relative"
                  style={{ width: gridWidth, height: gridHeight }}
                  onMouseLeave={() => setTooltip(null)}
                >
                  {/* Render cells absolutely by (col, row) so layout is exact */}
                  {weeks.map((week, wi) =>
                    week.map((cell, ri) => {
                      if (!cell) return null;
                      return (
                        <div
                          key={cell.date}
                          className="absolute rounded-[2px] cursor-default"
                          style={{
                            width: CELL,
                            height: CELL,
                            left: wi * PITCH,
                            top: ri * PITCH,
                            backgroundColor: levelColor(cell.level, isDark),
                          }}
                          onMouseEnter={(e) => handleCellEnter(e, cell)}
                        />
                      );
                    })
                  )}

                  {/* Tooltip */}
                  {tooltip && (
                    <div
                      className="pointer-events-none absolute z-10 whitespace-nowrap rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs shadow-md"
                      style={{
                        left: tooltip.x,
                        top: tooltip.y - 44,
                        transform: "translateX(-50%)",
                      }}
                    >
                      <span className="font-medium text-foreground">
                        {tooltip.count} contribution{tooltip.count !== 1 ? "s" : ""}
                      </span>
                      <span className="ml-1.5 text-muted-foreground">
                        {formatTooltipDate(tooltip.date)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Legend */}
              <div className="mt-3 flex items-center justify-end gap-1.5 text-[10px] text-muted-foreground">
                <span>Less</span>
                {[0, 1, 2, 3, 4].map((l) => (
                  <span
                    key={l}
                    className="rounded-[2px]"
                    style={{
                      width: CELL,
                      height: CELL,
                      display: "inline-block",
                      backgroundColor: levelColor(l, isDark),
                    }}
                  />
                ))}
                <span>More</span>
              </div>
            </div>
          )}
        </div>

        {/* ── Latest commit ── */}
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-4">
          <div className="flex min-w-0 items-center gap-2 text-xs text-muted-foreground">
            <span className="shrink-0 font-medium text-foreground">Latest push</span>
            {commit ? (
              <a
                href={commit.url}
                target="_blank"
                rel="noopener noreferrer"
                className="truncate hover:text-foreground transition-colors"
                title={commit.message}
              >
                <span className="text-accent font-mono">{commit.repo}</span>
                {commit.message && (
                  <>
                    <span className="mx-1">—</span>
                    <span>{commit.message}</span>
                  </>
                )}
              </a>
            ) : (
              <span className="italic opacity-50">loading…</span>
            )}
          </div>
          {commit && (
            <span className="shrink-0 text-[11px] text-muted-foreground tabular-nums">
              {commit.ago}
            </span>
          )}
        </div>

        {/* ── Footer ── */}
        <p className="mt-3 text-[11px] text-muted-foreground">
          Live from{" "}
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="link-accent"
          >
            GitHub
          </a>
          {" "}· contributions refreshed hourly · latest push every 5 min
        </p>
      </div>
    </SectionShell>
  );
}
