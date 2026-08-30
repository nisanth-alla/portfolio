export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 300;

type GHEvent = {
  type: string;
  repo: { name: string };
  payload: { commits?: { message: string }[] };
  created_at: string;
};

type LatestCommit = { message: string; repo: string; ago: string; url: string };

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    p,
    new Promise<T>((_, rej) =>
      setTimeout(() => rej(new Error(`Timeout after ${ms}ms`)), ms),
    ),
  ]);
}

export async function GET() {
  try {
    const res = await withTimeout(
      fetch("https://api.github.com/users/nisanth-alla/events/public?per_page=30", {
        headers: { "User-Agent": "portfolio-nisanth-alla" },
      }),
      4000,
    );

    if (!res.ok) {
      return Response.json({ error: "GitHub API error" }, { status: 502 });
    }

    const events = (await res.json()) as GHEvent[];

    // GitHub redacts commit messages for unauthenticated requests.
    // Fall back to the most recent PushEvent regardless of commits payload.
    const push = events.find((e) => e.type === "PushEvent");

    if (!push) {
      return Response.json({ error: "No recent push events" }, { status: 404 });
    }

    // Use commit message if available, otherwise omit it
    const rawMsg = push.payload.commits?.[0]?.message?.split("\n")[0] ?? "";
    const message = rawMsg.length > 72 ? rawMsg.slice(0, 72) + "…" : rawMsg;

    // Strip org prefix so both nisanth-alla/foo and foxpilot-jobs/foxpilot look clean
    const repo = push.repo.name.includes("/")
      ? push.repo.name.split("/").slice(-1)[0]
      : push.repo.name;

    const commit: LatestCommit = {
      message,
      repo,
      ago: timeAgo(push.created_at),
      url: `https://github.com/${push.repo.name}`,
    };

    return Response.json(commit);
  } catch {
    return Response.json({ error: "Unavailable" }, { status: 502 });
  }
}
