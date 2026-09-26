const JOURNAL = "https://nisanth-alla.github.io/engineering-journal";

export const journalHome = `${JOURNAL}/`;
export const journalPageCount = 51;

/** Published pages from the Engineering Journal (titles/descriptions from frontmatter). */
export const articles = [
  {
    title: "FoxPilot, a profile-driven job discovery engine",
    topic: "build notes",
    description:
      "Why a hardcoded relevance filter was wrong, how a “two sources of truth” bug hid for hours, and how to stop LLM calls from becoming your bottleneck.",
    href: `${JOURNAL}/build-notes/foxpilot/`,
  },
  {
    title: "Channels explained",
    topic: "go",
    description:
      "How Go channels work, taught through the worker pool I actually built. Real code, real output, real mistakes.",
    href: `${JOURNAL}/go/channels-explained/`,
  },
  {
    title: "Goroutines vs async/await",
    topic: "go",
    description:
      "The mental model shift from Node's event loop to Go's goroutines, explained through the problems each one solves.",
    href: `${JOURNAL}/go/goroutines-vs-async/`,
  },
  {
    title: "Streams and buffers",
    topic: "node.js",
    description:
      "Why streams exist, how backpressure works, and practical patterns for handling data that doesn't fit in memory.",
    href: `${JOURNAL}/node/streams-and-buffers/`,
  },
  {
    title: "CI/CD in practice",
    topic: "infrastructure",
    description:
      "What a pipeline is actually defending, why flakiness is a debt collection problem, and how to build a gate developers trust enough to not bypass.",
    href: `${JOURNAL}/infrastructure/ci-cd-in-practice/`,
  },
  {
    title: "Rendering and reconciliation",
    topic: "react",
    description:
      "What “rendering” actually means in React, when it happens, and why it's usually not the performance problem you think it is.",
    href: `${JOURNAL}/react/rendering-and-reconciliation/`,
  },
];