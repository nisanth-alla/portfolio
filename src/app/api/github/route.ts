import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 3600;

type Contribution = { date: string; count: number; level: number };
type ContributionResponse = {
  total: Record<string, number>;
  contributions: Contribution[];
};

/** Hard timeout via Promise.race — AbortController alone doesn't interrupt
 *  undici's DNS/connection phase in all environments. */
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms),
    ),
  ]);
}

/** Primary source: jogruber community API — returns date, count, level. */
async function fromJogruber(username: string): Promise<ContributionResponse> {
  const res = await withTimeout(
    fetch(`https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}`, {
      headers: { "User-Agent": "portfolio-nisanth-alla" },
    }),
    5000,
  );
  if (!res.ok) throw new Error(`jogruber ${res.status}`);
  return res.json() as Promise<ContributionResponse>;
}

/** Fallback source: GitHub's native contributions HTML.
 *  Parses <td class="ContributionCalendar-day" data-date="…" data-level="…">.
 *  Count is unavailable here — we map level → approximate count for display. */
async function fromGitHubHtml(username: string): Promise<ContributionResponse> {
  const res = await withTimeout(
    fetch(`https://github.com/users/${encodeURIComponent(username)}/contributions`, {
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "User-Agent": "portfolio-nisanth-alla",
      },
    }),
    5000,
  );
  if (!res.ok) throw new Error(`github-html ${res.status}`);

  const html = await res.text();

  // Parse every ContributionCalendar-day cell
  const cellRe = /data-date="(\d{4}-\d{2}-\d{2})"[^>]*data-level="(\d)"/g;
  const contributions: Contribution[] = [];
  let m: RegExpExecArray | null;

  // level → representative count (used only when real count unavailable)
  const levelToCount = [0, 1, 3, 6, 10];

  while ((m = cellRe.exec(html)) !== null) {
    const level = Number(m[2]);
    contributions.push({
      date: m[1],
      count: levelToCount[level] ?? 0,
      level,
    });
  }

  if (!contributions.length) throw new Error("No cells parsed from GitHub HTML");

  contributions.sort((a, b) => a.date.localeCompare(b.date));

  const total: Record<string, number> = {};
  for (const c of contributions) {
    const year = c.date.slice(0, 4);
    total[year] = (total[year] ?? 0) + c.count;
  }

  return { total, contributions };
}

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get("username") ?? "nisanth-alla";
  const yearsParam = request.nextUrl.searchParams.get("years") ?? "1";
  const years = Math.min(6, Math.max(1, Number.parseInt(yearsParam, 10) || 1));

  let data: ContributionResponse | null = null;

  // Try primary, then fallback
  for (const fetch of [() => fromJogruber(username), () => fromGitHubHtml(username)]) {
    try {
      data = await fetch();
      break;
    } catch {
      // try next source
    }
  }

  if (!data) {
    return Response.json(
      { error: "Could not load GitHub contributions — both sources unavailable." },
      { status: 502 },
    );
  }

  const currentYear = new Date().getFullYear();
  const earliestYear = currentYear - years + 1;

  const recent = data.contributions.filter(
    (c) => Number.parseInt(c.date.slice(0, 4), 10) >= earliestYear,
  );

  const totals: Record<string, number> = {};
  for (const c of recent) {
    const year = c.date.slice(0, 4);
    totals[year] = (totals[year] ?? 0) + c.count;
  }

  return Response.json({ total: totals, contributions: recent });
}
