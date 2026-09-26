/**
 * Pure helpers for the GitHub contribution heatmap.
 * No DOM or framework imports, so they can be unit-tested with `node --test`.
 */

export type Contribution = { date: string; count: number; level: number };
export type Cell = Contribution | null;
export type MonthLabel = { label: string; left: number };

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Today's date as YYYY-MM-DD (UTC, matching the contribution API). */
export function isoToday(now = new Date()) {
  return now.toISOString().slice(0, 10);
}

/**
 * Current streak and longest streak, in days. Future dates are ignored, and a
 * zero count for today doesn't break the current streak (the day isn't over).
 */
export function calcStreaks(days: Contribution[], today = isoToday()) {
  let current = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    const day = days[i];
    if (!day || day.date > today) continue;
    if (day.count > 0) current++;
    else if (day.date !== today) break;
  }

  let longest = 0;
  let run = 0;
  for (const day of days) {
    if (day.date > today) break;
    run = day.count > 0 ? run + 1 : 0;
    longest = Math.max(longest, run);
  }

  return { current, longest };
}

/** Group days into week columns, padding the first week so Sunday is row 0. */
export function buildWeeks(days: Contribution[]): Cell[][] {
  const first = days[0];
  if (!first) return [];
  const startPad = new Date(`${first.date}T00:00:00`).getDay();
  const padded: Cell[] = [...Array.from({ length: startPad }, () => null), ...days];
  const weeks: Cell[][] = [];
  for (let i = 0; i < padded.length; i += 7) weeks.push(padded.slice(i, i + 7));
  return weeks;
}

/** Month labels positioned at the first week column in which each month appears. */
export function buildMonthLabels(weeks: Cell[][], pitch: number): MonthLabel[] {
  const labels: MonthLabel[] = [];
  let lastMonth = -1;
  weeks.forEach((week, column) => {
    const firstDay = week.find((cell) => cell !== null);
    if (!firstDay) return;
    const month = Number.parseInt(firstDay.date.slice(5, 7), 10);
    if (month !== lastMonth) {
      labels.push({ label: MONTHS[month - 1] ?? "", left: column * pitch });
      lastMonth = month;
    }
  });
  return labels;
}

/** "Fri, Sep 25, 2026" */
export function formatDay(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function describeDay(day: Contribution) {
  return `${day.count} contribution${day.count === 1 ? "" : "s"} on ${formatDay(day.date)}`;
}