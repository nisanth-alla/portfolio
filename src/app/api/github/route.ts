import type { NextRequest } from "next/server";

import { profile } from "@/content/profile";
import type { Contribution } from "@/lib/contributions";
import {
  GITHUB_USER_AGENT,
  cacheHeaders,
  errorMessage,
  fetchWithTimeout,
  githubHeaders,
} from "@/lib/server/http";

type ContributionData = {
  total: Record<string, number>;
  contributions: Contribution[];
};

const MAX_YEARS = 3;
const TIMEOUT_MS = 5000;

function isContribution(value: unknown): value is Contribution {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.date === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(v.date) &&
    typeof v.count === "number" &&
    typeof v.level === "number"
  );
}

/**
 * Primary source: the community contributions API (date, count, level).
 * Third-party host, so it never receives the GitHub token.
 */
async function fromContributionsApi(username: string): Promise<Contribution[]> {
  const res = await fetchWithTimeout(
    `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}`,
    { headers: { "User-Agent": GITHUB_USER_AGENT } },
    TIMEOUT_MS,
  );
  if (!res.ok) throw new Error(`contributions API responded ${res.status}`);

  const body: unknown = await res.json();
  const list = (body as { contributions?: unknown }).contributions;
  if (!Array.isArray(list) || !list.every(isContribution)) {
    throw new Error("contributions API returned an unexpected shape");
  }
  return list;
}

/**
 * Fallback source: GitHub's own contribution calendar HTML. Only levels are
 * available there, so counts are approximated from the level for display.
 */
async function fromGitHubCalendar(username: string): Promise<Contribution[]> {
  const res = await fetchWithTimeout(
    `https://github.com/users/${encodeURIComponent(username)}/contributions`,
    { headers: githubHeaders({ "X-Requested-With": "XMLHttpRequest" }) },
    TIMEOUT_MS,
  );
  if (!res.ok) throw new Error(`GitHub calendar responded ${res.status}`);

  const html = await res.text();
  const levelToCount = [0, 1, 3, 6, 10];
  const cells = html.matchAll(/data-date="(\d{4}-\d{2}-\d{2})"[^>]*data-level="(\d)"/g);
  const contributions = Array.from(cells, ([, date = "", level = "0"]) => ({
    date,
    count: levelToCount[Number(level)] ?? 0,
    level: Number(level),
  }));

  if (!contributions.length) throw new Error("GitHub calendar markup had no day cells");
  return contributions.sort((a, b) => a.date.localeCompare(b.date));
}

const SOURCES = [
  ["contributions-api", fromContributionsApi],
  ["github-calendar", fromGitHubCalendar],
] as const;

/**
 * GET /api/github?years=1..3
 * Contribution calendar for the site owner only — deliberately not a
 * general-purpose proxy for arbitrary usernames.
 */
export async function GET(request: NextRequest) {
  const requested = Number.parseInt(request.nextUrl.searchParams.get("years") ?? "1", 10);
  const years = Math.min(MAX_YEARS, Math.max(1, Number.isFinite(requested) ? requested : 1));

  let contributions: Contribution[] | null = null;
  for (const [name, load] of SOURCES) {
    try {
      contributions = await load(profile.handle);
      break;
    } catch (error) {
      console.warn(`[api/github] ${name} failed: ${errorMessage(error)}`);
    }
  }

  if (!contributions) {
    return Response.json(
      { error: "GitHub contributions are unavailable right now." },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }

  const earliestYear = new Date().getFullYear() - years + 1;
  const recent = contributions.filter((c) => Number.parseInt(c.date.slice(0, 4), 10) >= earliestYear);

  const total: Record<string, number> = {};
  for (const c of recent) {
    const year = c.date.slice(0, 4);
    total[year] = (total[year] ?? 0) + c.count;
  }

  const data: ContributionData = { total, contributions: recent };
  return Response.json(data, { headers: cacheHeaders(3600) });
}