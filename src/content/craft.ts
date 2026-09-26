// Generated from the source repos (origin/main). Excerpts are verbatim;
// line numbers match the files on GitHub. Regenerate rather than hand-edit.

import type { Lang } from "@/lib/highlight";

export type CraftItem = {
  id: string;
  title: string;
  summary: string;
  project: string;
  repo: string;
  file: string;
  lang: Lang;
  startLine: number;
  endLine: number;
  /** The excerpt stops mid-function; render a trailing ⋮. */
  elided?: boolean;
  note: string;
  href: string;
  code: string;
};

export const craft: CraftItem[] = [
  {
    id: "cas-leasing",
    title: "Compare-and-set job leasing",
    summary: "A worker claims a job with one conditional UPDATE. If another worker changed the row first, the claim fails, so a job never runs twice and no lock service is needed.",
    project: "FoxPilot",
    repo: "foxpilot-jobs/foxpilot",
    file: "src/career_agent/storage/database.py",
    lang: "python",
    startLine: 1689,
    endLine: 1707,
    note: "Jobs that run out of retries move to a dead-letter state instead of looping, and a heartbeat renews the 5-minute lease every 30 seconds.",
    href: "https://github.com/foxpilot-jobs/foxpilot/blob/main/src/career_agent/storage/database.py#L1689-L1707",
    code: "            lease_expires = now + timedelta(minutes=lease_duration_minutes)\n            claimed = connection.execute(\n                update(background_jobs_table)\n                .where(\n                    background_jobs_table.c.job_id == candidate[\"job_id\"],\n                    background_jobs_table.c.status == candidate[\"status\"],\n                    background_jobs_table.c.updated_at == candidate[\"updated_at\"],\n                )\n                .values(\n                    status=\"running\",\n                    attempt=next_attempt,\n                    lease_owner=worker_id,\n                    lease_expires_at=lease_expires,\n                    started_at=now if next_attempt == 1 else candidate[\"started_at\"],\n                    updated_at=now,\n                )\n            )\n            if claimed.rowcount != 1:\n                return None",
  },
  {
    id: "schema-repair",
    title: "Validating LLM output",
    summary: "Every model response is checked against the expected schema. A bad response gets one targeted repair prompt, then the match fails with a clear error.",
    project: "FoxPilot",
    repo: "foxpilot-jobs/foxpilot",
    file: "src/career_agent/matching.py",
    lang: "python",
    startLine: 155,
    endLine: 174,
    note: "A match only counts if it has an integer score from 0 to 100 and an APPLY, CONSIDER or SKIP verdict.",
    href: "https://github.com/foxpilot-jobs/foxpilot/blob/main/src/career_agent/matching.py#L155-L174",
    code: "        missing = [field for field in MATCH_FIELDS if field not in result]\n        score = result.get(\"match_score\")\n        recommendation = result.get(\"recommendation\")\n        valid = (\n            not missing\n            and isinstance(score, int)\n            and 0 <= score <= 100\n            and recommendation in {\"APPLY\", \"CONSIDER\", \"SKIP\"}\n        )\n        if valid:\n            result.setdefault(\"gap_analysis\", [])\n            return result\n\n        if attempt == 0:\n            prompt += (\n                \"\\nYour previous response violated the schema. Return every required field: \"\n                \"match_score (integer 0-100), recommendation (APPLY, CONSIDER, or SKIP), \"\n                \"reasons, matching_skills, missing_skills, experience_match, and concerns.\"\n            )\n            continue",
  },
  {
    id: "backpressure",
    title: "Backpressure in a Go worker pool",
    summary: "A buffered channel slows the producer when workers fall behind. On Ctrl+C the pool stops taking new tasks and lets workers finish what's already queued.",
    project: "Distributed Systems Lab",
    repo: "nisanth-alla/distributed-systems-lab",
    file: "experiments/go/worker-pool/pool.go",
    lang: "go",
    startLine: 115,
    endLine: 137,
    note: "In testing, going from 8 to 16 workers barely helped. Buffer size mattered more.",
    href: "https://github.com/nisanth-alla/distributed-systems-lab/blob/main/experiments/go/worker-pool/pool.go#L115-L137",
    code: "\t// Send tasks into the tasks channel. This is the producer.\n\t// If the buffer is full, this blocks until a worker picks one up.\n\t// That's backpressure in action.\n\ttasksSent := 0\n\tcancelled := false\n\tfor _, task := range taskList {\n\t\t// Check if the context was cancelled (e.g., Ctrl+C)\n\t\tselect {\n\t\tcase <-ctx.Done():\n\t\t\tfmt.Printf(\"\\n[pool] cancelled after sending %d/%d tasks\\n\", tasksSent, len(taskList))\n\t\t\tcancelled = true\n\t\tcase p.tasks <- task:\n\t\t\ttasksSent++\n\t\t}\n\t\tif cancelled {\n\t\t\tbreak\n\t\t}\n\t}\n\n\t// Close the tasks channel. This signals to workers that no more\n\t// tasks are coming. Their for-range loops will exit after processing\n\t// whatever is left in the buffer.\n\tclose(p.tasks)",
  },
  {
    id: "saga-compensation",
    title: "Saga compensation",
    summary: "When a stage fails, the completed stages are undone in reverse order: cancel the shipment, release the stock, then refund the payment.",
    project: "Distributed Systems Lab",
    repo: "nisanth-alla/distributed-systems-lab",
    file: "experiments/ts/order-pipeline/src/saga.ts",
    lang: "ts",
    startLine: 165,
    endLine: 184,
    elided: true,
    note: "A refund is its own transaction, so steps that can't be reversed, like sending an email, run last.",
    href: "https://github.com/nisanth-alla/distributed-systems-lab/blob/main/experiments/ts/order-pipeline/src/saga.ts#L165-L184",
    code: "  /**\n   * Run compensation for completed stages in reverse order.\n   *\n   * Why reverse? Because stages often depend on earlier stages.\n   * Shipping depends on inventory (need items to ship). Inventory\n   * depends on payment (need payment before reserving). So when\n   * undoing, you cancel the shipment first, then release inventory,\n   * then refund payment. If you refunded first and then tried to\n   * cancel the shipment, the carrier might say \"too late, it shipped.\"\n   */\n  private async compensate(order: Order, completedStages: StageName[]): Promise<void> {\n    order.status = \"compensating\";\n    order.updatedAt = Date.now();\n\n    // Reverse the completed stages\n    const toCompensate = [...completedStages].reverse();\n\n    for (const stageName of toCompensate) {\n      const stage = this.stages.find((s) => s.name === stageName);\n      if (!stage) continue;",
  },
  {
    id: "request-coalescing",
    title: "Request coalescing",
    summary: "When a hot cache key expires, concurrent requests wait on the first database lookup instead of each making their own.",
    project: "System Design Notes",
    repo: "nisanth-alla/system-design-notes",
    file: "experiments/cache-stampede/server.ts",
    lang: "ts",
    startLine: 69,
    endLine: 91,
    note: "Measured with 20 concurrent requests: 20 database calls without coalescing, 1 with it.",
    href: "https://github.com/nisanth-alla/system-design-notes/blob/main/experiments/cache-stampede/server.ts#L69-L91",
    code: "    const existing = inFlight.get(key);\n    if (existing) {\n      // Someone else already noticed the miss and is fetching — wait on\n      // their result instead of starting a second, third, fourth lookup.\n      broadcast({ type: \"coalesced\", requestId, waitingOn: existing.ownerId });\n      const value = await existing.promise;\n      broadcast({ type: \"db-call-resolved\", requestId });\n      return { value, source: \"coalesced\" };\n    }\n\n    broadcast({ type: \"cache-miss\", requestId });\n    broadcast({ type: \"db-call-started\", requestId });\n    const fetchPromise = slowDatabaseLookup(key).then((value) => {\n      cache.set(key, { value, expiresAt: Date.now() + TTL_MS });\n      inFlight.delete(key);\n      return value;\n    });\n\n    inFlight.set(key, { promise: fetchPromise, ownerId: requestId });\n    const value = await fetchPromise;\n    broadcast({ type: \"db-call-resolved\", requestId });\n    return { value, source: \"database\" };\n  }",
  },
  {
    id: "url-normaliser",
    title: "URL normalisation",
    summary: "Strips 19 tracking parameters and canonicalises the host and query before hashing with SHA-256, so Node and the browser always agree on duplicates.",
    project: "SyncMark",
    repo: "nisanth-alla/syncmark",
    file: "packages/shared/src/normalizer.ts",
    lang: "ts",
    startLine: 62,
    endLine: 80,
    note: "Covered by 13 Vitest cases in normalizer.test.ts.",
    href: "https://github.com/nisanth-alla/syncmark/blob/main/packages/shared/src/normalizer.ts#L62-L80",
    code: "  // For http(s), a bare path of \"\" or \"/\" both mean the root page.\n  if (url.protocol === 'http:' || url.protocol === 'https:') {\n    if (url.pathname === '') {\n      url.pathname = '/';\n    }\n  }\n\n  // Strip tracking parameters, keeping any genuinely useful query keys.\n  const kept: string[] = [];\n  for (const [key, value] of url.searchParams.entries()) {\n    const lowerKey = key.toLowerCase();\n    if (TRACKING_PARAMS.has(lowerKey)) continue;\n    kept.push(`${key}=${value}`);\n  }\n  kept.sort();\n  url.search = kept.length > 0 ? `?${kept.join('&')}` : '';\n\n  return url.toString();\n}",
  },
];