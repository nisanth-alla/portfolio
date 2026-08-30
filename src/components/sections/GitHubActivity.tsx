"use client";

import { useEffect, useMemo, useState } from "react";

import { GithubIcon } from "@/components/BrandIcons";
import { SectionHeading } from "@/components/SectionHeading";
import { SectionShell } from "@/components/SectionShell";
import { profile } from "@/content/profile";

type Contribution = {
  date: string;
  count: number;
  level: number;
};

type ApiResponse = {
  total: Record<string, number>;
  contributions: Contribution[];
  error?: string;
};

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];

function levelColor(level: number, isDark: boolean): string {
  // Five indigo shades that track the site accent (#5b6cf9 light / #7c8cf8 dark)
  const shades = isDark
    ? ["#192133", "#2d3a6b", "#3d4f9f", "#5b6cf9", "#7c8cf8"]
    : ["#e8eaf6", "#c5c9f4", "#9ba2ef", "#6b74f0", "#5b6cf9"];
  return shades[level] ?? shades[0];
}

export function GitHubActivity() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [error, setError] = useState(false);
  const [year, setYear] = useState<number>(() => new Date().getFullYear());
  const [isDark, setIsDark] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
      : false,
  );

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onMedia = (e: MediaQueryListEvent) => setIsDark(e.matches);
    media.addEventListener("change", onMedia);

    let active = true;
    fetch("/api/github?years=2")
      .then((res) => res.json())
      .then((json) => {
        if (active) {
          setData(json);
          setError(!!json.error);
        }
      })
      .catch(() => active && setError(true));

    return () => {
      active = false;
      media.removeEventListener("change", onMedia);
    };
  }, []);

  const years = useMemo(() => {
    if (!data) return [new Date().getFullYear()];
    return Object.keys(data.total)
      .map(Number)
      .sort((a, b) => a - b);
  }, [data]);

  const yearData = useMemo(() => {
    if (!data) return [];
    return data.contributions.filter(
      (c) => Number.parseInt(c.date.slice(0, 4), 10) === year,
    );
  }, [data, year]);

  const grid = useMemo(() => {
    if (!yearData.length) return [];
    const days: { date: string; count: number; level: number }[] = [];
    for (let i = 0; i < yearData.length; i++) {
      const c = yearData[i];
      days.push({ date: c.date, count: c.count, level: c.level });
    }
    return days;
  }, [yearData]);

  const weeks = useMemo(() => {
    const result: (typeof grid)[] = [];
    for (let i = 0; i < grid.length; i += 7) {
      result.push(grid.slice(i, i + 7));
    }
    return result;
  }, [grid]);

  const totalContributions = useMemo(() => {
    if (!data) return 0;
    return grid.reduce((sum, day) => sum + day.count, 0);
  }, [grid, data]);

  const monthPositions = useMemo(() => {
    if (!weeks.length) return [];
    const positions: { label: string; col: number }[] = [];
    let lastMonth = -1;
    weeks.forEach((week, col) => {
      const firstDay = week[0];
      if (!firstDay) return;
      const month = Number.parseInt(firstDay.date.slice(5, 7), 10);
      if (month !== lastMonth) {
        positions.push({ label: MONTH_LABELS[month - 1], col });
        lastMonth = month;
      }
    });
    return positions;
  }, [weeks]);

  return (
    <SectionShell id="github">
      <SectionHeading
       
        title="GitHub Activity"
        subtitle="Personal and open-source commits only — the proprietary work lives in the journey section."
      />

      <div className="mt-8 card-surface p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
              <GithubIcon className="h-4.5 w-4.5 text-foreground" />
            </span>
            <div>
              <p className="text-sm font-medium text-foreground">
                {profile.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {totalContributions.toLocaleString()} contributions in {year}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            {years.map((y) => (
              <button
                key={y}
                type="button"
                onClick={() => setYear(y)}
                aria-pressed={year === y}
                className={
                  "rounded-full px-3 py-1 text-xs font-medium transition " +
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

        <div className="mt-6 overflow-x-auto pb-2">
          {error ? (
            <p className="text-sm text-muted-foreground">
              Couldn&apos;t load contributions right now. They&apos;ll show up
              again on the next visit.
            </p>
          ) : !data ? (
            <div className="space-y-3">
              {Array.from({ length: 7 }).map((_, i) => (
                <div
                  key={i}
                  className="h-2.5 w-full animate-pulse rounded bg-muted"
                />
              ))}
            </div>
          ) : (
            <div>
              <div className="mb-1 flex h-4 gap-[3px] text-[10px] text-muted-foreground">
                {monthPositions.map((m) => (
                  <span
                    key={m.label}
                    className="whitespace-nowrap"
                    style={{ marginLeft: m.col === 0 ? 0 : undefined }}
                  >
                    {m.label}
                  </span>
                ))}
              </div>

              <div className="flex gap-[3px]">
                <div className="mr-1 grid w-6 grid-rows-7 gap-[3px] text-[9px] text-muted-foreground">
                  {DAY_LABELS.map((d, i) => (
                    <span key={i} className="leading-[10px]">
                      {d}
                    </span>
                  ))}
                </div>
                <div className="flex gap-[3px]">
                  {weeks.map((week, wi) => (
                    <div key={wi} className="grid grid-rows-7 gap-[3px]">
                      {week.map((day) => (
                        <div
                          key={day.date}
                          title={`${day.date}: ${day.count} contribution${day.count === 1 ? "" : "s"}`}
                          className="h-[10px] w-[10px] rounded-[2px]"
                          style={{
                            backgroundColor: levelColor(day.level, isDark),
                          }}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-end gap-2 text-[10px] text-muted-foreground">
                <span>Less</span>
                {[0, 1, 2, 3, 4].map((l) => (
                  <span
                    key={l}
                    className="h-[10px] w-[10px] rounded-[2px]"
                    style={{ backgroundColor: levelColor(l, isDark) }}
                  />
                ))}
                <span>More</span>
              </div>
            </div>
          )}
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          Live from{" "}
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="link-accent"
          >
            GitHub
          </a>
          , refreshed every hour.
        </p>
      </div>
    </SectionShell>
  );
}
