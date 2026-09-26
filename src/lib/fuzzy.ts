/**
 * Rank how well `query` matches `text` (both compared case-insensitively).
 * Substring matches always outrank subsequence matches, and earlier substring
 * matches rank higher. Returns -1 when the query's characters don't appear in order.
 */
export function fuzzyScore(text: string, query: string): number {
  const haystack = text.toLowerCase();
  const needle = query.toLowerCase();
  if (!needle) return 0;

  const at = haystack.indexOf(needle);
  if (at >= 0) return 200 - at;

  let from = 0;
  let total = 0;
  let streak = 0;
  for (const ch of needle) {
    const found = haystack.indexOf(ch, from);
    if (found < 0) return -1;
    streak = found === from ? streak + 1 : 0;
    total += 1 + streak;
    from = found + 1;
  }
  return total;
}