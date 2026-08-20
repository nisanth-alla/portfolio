import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const revalidate = 3600;

type RawContribution = {
  date: string;
  count: number;
  level: number;
};

type ContributionResponse = {
  total: Record<string, number>;
  contributions: RawContribution[];
};

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get("username") ?? "nisanth-alla";
  const yearsParam = request.nextUrl.searchParams.get("years") ?? "1";

  const years = Math.min(
    6,
    Math.max(1, Number.parseInt(yearsParam, 10) || 1),
  );

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}`,
      { signal: controller.signal, next: { revalidate: 3600 } },
    );
    clearTimeout(timeout);

    if (!res.ok) {
      return Response.json(
        { error: `GitHub API responded with ${res.status}` },
        { status: 502 },
      );
    }

    const data = (await res.json()) as ContributionResponse;
    const contributions = data.contributions ?? [];

    const currentYear = new Date().getFullYear();
    const earliestYear = currentYear - years + 1;

    const recent = contributions.filter((c) => {
      const year = Number.parseInt(c.date.slice(0, 4), 10);
      return year >= earliestYear;
    });

    const totals: Record<string, number> = {};
    for (const c of recent) {
      const year = c.date.slice(0, 4);
      totals[year] = (totals[year] ?? 0) + c.count;
    }

    return Response.json({ total: totals, contributions: recent });
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error && error.name === "AbortError"
            ? "GitHub request timed out"
            : "Failed to fetch GitHub contributions",
      },
      { status: 502 },
    );
  }
}
