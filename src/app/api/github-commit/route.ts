export const runtime = "nodejs";
export const revalidate = 300; // 5 minutes

type GHEvent = {
  type: string;
  repo: { name: string };
  payload: {
    commits?: { message: string }[];
    ref?: string;
  };
  created_at: string;
};

type LatestCommit = {
  message: string;
  repo: string;
  ago: string;
  url: string;
};

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

export async function GET() {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(
      "https://api.github.com/users/nisanth-alla/events/public?per_page=30",
      {
        signal: controller.signal,
        headers: { "User-Agent": "portfolio-nisanth-alla" },
        next: { revalidate: 300 },
      },
    );
    clearTimeout(timeout);

    if (!res.ok) {
      return Response.json({ error: "GitHub API error" }, { status: 502 });
    }

    const events = (await res.json()) as GHEvent[];

    const pushEvent = events.find(
      (e) =>
        e.type === "PushEvent" &&
        Array.isArray(e.payload.commits) &&
        e.payload.commits.length > 0,
    );

    if (!pushEvent) {
      return Response.json({ error: "No recent commits" }, { status: 404 });
    }

    const message =
      pushEvent.payload.commits?.[0]?.message?.split("\n")[0] ?? "";
    const repoName = pushEvent.repo.name.replace("nisanth-alla/", "");

    const commit: LatestCommit = {
      message: message.length > 72 ? message.slice(0, 72) + "…" : message,
      repo: repoName,
      ago: timeAgo(pushEvent.created_at),
      url: `https://github.com/${pushEvent.repo.name}`,
    };

    return Response.json(commit);
  } catch {
    return Response.json({ error: "Failed to fetch" }, { status: 502 });
  }
}
