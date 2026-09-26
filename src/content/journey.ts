export type CommitType = "feat" | "refactor" | "wip";

export type Milestone = {
  year: string;
  /** Conventional-commit style summary for the git-log view. */
  type: CommitType;
  scope?: string;
  message: string;
  description: string;
};

export const journey: Milestone[] = [
  {
    year: "2022",
    type: "feat",
    message: "start career building frontend applications",
    description:
      "Started my software engineering career building frontend applications.",
  },
  {
    year: "2024",
    type: "feat",
    scope: "uber-freight",
    message: "lead frontend initiatives across production systems",
    description:
      "Began leading frontend initiatives while working across production systems, on-call engineering, and cross-functional teams at Uber Freight.",
  },
  {
    year: "2025",
    type: "feat",
    message: "start foxpilot, build syncmark from scratch",
    description:
      "Started FoxPilot, a local-first job discovery tool, out of frustration with search tools that produce noise instead of signal. It's now in beta. Also started SyncMark after noticing that no bookmark sync tool understands browser profiles, and built its sync engine, URL normaliser and MV3 extension from scratch.",
  },
  {
    year: "2026",
    type: "refactor",
    message: "expand into cloud, distributed systems and backend",
    description:
      "Expanding into cloud infrastructure, distributed systems and backend architecture through side projects and study, because production work keeps asking for that system-level understanding.",
  },
  {
    year: "Next",
    type: "wip",
    message: "roles with large-scale systems and real product depth",
    description:
      "Pursuing engineering roles and opportunities where the work involves large-scale systems, product depth, and problems worth solving.",
  },
];