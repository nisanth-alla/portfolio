/**
 * Server-side HTTP helpers for the API routes.
 */

export const GITHUB_USER_AGENT = "portfolio-nisanth-alla";

/**
 * fetch() with a hard deadline. AbortController cancels the request where the
 * runtime honours it; racing a timer guarantees we stop waiting even when a
 * phase (DNS, TLS) ignores the signal. The timer is always cleared.
 */
export async function fetchWithTimeout(
  url: string,
  init: RequestInit = {},
  timeoutMs = 5000,
): Promise<Response> {
  const controller = new AbortController();
  let timer: ReturnType<typeof setTimeout> | undefined;

  const deadline = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      controller.abort();
      reject(new Error(`${new URL(url).host} timed out after ${timeoutMs}ms`));
    }, timeoutMs);
  });

  try {
    return await Promise.race([fetch(url, { ...init, signal: controller.signal }), deadline]);
  } finally {
    clearTimeout(timer);
  }
}

/** Headers for GitHub requests; uses GITHUB_TOKEN (optional) to lift rate limits. */
export function githubHeaders(extra: Record<string, string> = {}): Record<string, string> {
  const token = process.env.GITHUB_TOKEN;
  return {
    "User-Agent": GITHUB_USER_AGENT,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
}

/** Cache at the CDN for `maxAge` seconds, then serve stale while revalidating. */
export function cacheHeaders(maxAge: number, staleWhileRevalidate = maxAge * 24) {
  return {
    "Cache-Control": `public, s-maxage=${maxAge}, stale-while-revalidate=${staleWhileRevalidate}`,
  };
}

export function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}