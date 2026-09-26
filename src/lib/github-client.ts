export type LatestCommit = {
  message: string;
  repo: string;
  ago: string;
  url: string;
};

let pending: Promise<LatestCommit | null> | null = null;

/**
 * Latest public push, fetched once per page view and shared by every
 * consumer (hero telemetry + GitHub section) to spare the API rate limit.
 */
export function getLatestCommit(): Promise<LatestCommit | null> {
  if (!pending) {
    pending = fetch("/api/github-commit")
      .then((res) => (res.ok ? res.json() : null))
      .then((json: (LatestCommit & { error?: string }) | null) =>
        json && !json.error ? json : null,
      )
      .catch(() => null);
  }
  return pending;
}
