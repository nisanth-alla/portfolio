import { profile } from "@/content/profile";
import type { LatestCommit } from "@/lib/github-client";
import { cacheHeaders, errorMessage, fetchWithTimeout, githubHeaders } from "@/lib/server/http";

type PushEvent = {
  type: string;
  repo: { name: string };
  payload: { commits?: { message?: string }[] };
  created_at: string;
};

const MAX_MESSAGE = 72;

function timeAgo(iso: string, now = Date.now()): string {
  const mins = Math.max(0, Math.floor((now - new Date(iso).getTime()) / 60_000));
  if (!Number.isFinite(mins)) return "recently";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

function isPushEvent(value: unknown): value is PushEvent {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    v.type === "PushEvent" &&
    typeof v.created_at === "string" &&
    typeof (v.repo as { name?: unknown } | undefined)?.name === "string"
  );
}

/** GET /api/github-commit — the site owner's most recent public push. */
export async function GET() {
  try {
    const res = await fetchWithTimeout(
      `https://api.github.com/users/${encodeURIComponent(profile.handle)}/events/public?per_page=30`,
      { headers: githubHeaders({ Accept: "application/vnd.github+json" }) },
      4000,
    );

    if (!res.ok) {
      console.warn(`[api/github-commit] GitHub responded ${res.status}`);
      return Response.json(
        { error: "GitHub is unavailable right now." },
        { status: 502, headers: { "Cache-Control": "no-store" } },
      );
    }

    const events: unknown = await res.json();
    const push = Array.isArray(events) ? events.find(isPushEvent) : undefined;

    if (!push) {
      return Response.json({ error: "No recent public pushes." }, { status: 404, headers: cacheHeaders(300) });
    }

    // Unauthenticated requests may omit commit messages; the repo alone is still useful.
    const firstLine = push.payload.commits?.[0]?.message?.split("\n")[0] ?? "";
    const message = firstLine.length > MAX_MESSAGE ? `${firstLine.slice(0, MAX_MESSAGE)}…` : firstLine;

    const commit: LatestCommit = {
      message,
      repo: push.repo.name.split("/").at(-1) ?? push.repo.name,
      ago: timeAgo(push.created_at),
      url: `https://github.com/${push.repo.name}`,
    };

    return Response.json(commit, { headers: cacheHeaders(300, 600) });
  } catch (error) {
    console.error(`[api/github-commit] ${errorMessage(error)}`);
    return Response.json(
      { error: "GitHub is unavailable right now." },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}