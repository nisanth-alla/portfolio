import { site } from "@/lib/site";

/**
 * Project case studies. Every fact here is traceable to the project's repo
 * (README, source, tests, config). Keep it that way when editing.
 */
export type ProjectStatus = "beta" | "active" | "live" | "shipped";

export type Project = {
  id: string;
  name: string;
  status: ProjectStatus;
  /** One line for the list row. */
  tagline: string;
  /** The problem that made it worth building, in the first person. */
  why: string;
  /** Main data / request flow, in order. Keep each stage short. */
  flow: string[];
  highlights: string[];
  quickstart?: string[];
  stack: string[];
  github?: string;
  live?: string;
};

export const projects: Project[] = [
  {
    id: "foxpilot",
    name: "FoxPilot",
    status: "beta",
    tagline: "Local-first job discovery that ranks listings against your resume and explains every score.",
    why: "Every job search tool I tried either auto-applied for me, which is risky, or dumped hundreds of unranked listings. FoxPilot matches your resume against listings with an LLM and explains the gap. You decide what to apply to.",
    flow: [
      "resume → profile",
      "isolated source adapters",
      "tech-job filter",
      "canonical dedupe",
      "LLM match + gap analysis",
      "ranked shortlist",
    ],
    highlights: [
      "Pulls from 10+ job sources, including Greenhouse, Lever, Ashby, RemoteOK and Hacker News “Who is hiring”. Each adapter is isolated, so one source failing never stalls a scan.",
      "Every match comes back with a 0–100 score, an APPLY / CONSIDER / SKIP verdict, reasons and a skill-gap analysis, validated against a schema.",
      "A background worker leases jobs from the database with heartbeats, retry classification and a dead-letter state.",
      "Runs locally by default with Ollama. PostgreSQL and a hosted API power the web beta.",
    ],
    quickstart: [
      "./scripts/bootstrap.sh",
      "source .venv/bin/activate",
      "foxpilot init --resume /absolute/path/to/resume.pdf",
      "foxpilot migrate",
      "foxpilot scan",
    ],
    stack: ["Python", "FastAPI", "React", "TypeScript", "SQLite", "PostgreSQL", "Ollama", "Alembic", "Docker", "Railway"],
    github: "https://github.com/foxpilot-jobs/foxpilot",
    live: "https://foxpilot.in",
  },
  {
    id: "syncmark",
    name: "SyncMark",
    status: "active",
    tagline: "Bookmark sync that understands browser profiles, so “Work” in Chrome and “Work” in Arc stay in step.",
    why: "I use Chrome and Arc with separate work and personal profiles. Every sync tool I tried (Floccus, xBrowserSync, Raindrop.io) treats bookmarks as one flat pile with no idea what a profile is. SyncMark is built around profile identity.",
    flow: ["MV3 extension", "ingest API", "sync engine (LWW)", "SQLite canonical store", "apply back to browser"],
    highlights: [
      "A local Node daemon on 127.0.0.1 keeps the canonical SQLite store (WAL mode) behind a single repository interface. Nothing leaves your machine.",
      "The URL normaliser strips 19 tracking parameters and canonicalises the host and query before SHA-256 hashing, with identical results in Node and the browser via Web Crypto.",
      "Two-way sync: the extension ingests the browser's bookmarks, pulls the canonical state and applies creates and removes back to the tree.",
      "A pnpm and Turborepo monorepo (shared, engine, dashboard, extension) with 40 Vitest tests. CI runs lint, typecheck, build and test.",
    ],
    quickstart: ["pnpm install", "pnpm build", "pnpm test", "pnpm --filter @syncmark/engine start"],
    stack: ["TypeScript", "Node.js", "SQLite", "React", "Vite", "WXT", "Turborepo", "Manifest V3"],
    github: "https://github.com/nisanth-alla/syncmark",
  },
  {
    id: "distributed-systems-lab",
    name: "Distributed Systems Lab",
    status: "active",
    tagline: "Rate limiting, sagas and worker pools. Each one built, broken on purpose and written up.",
    why: "I learn distributed systems best by building a small working version, breaking it deliberately and writing down what happened. Each experiment ships with its design decisions.",
    flow: ["build a working system", "inject failure", "observe and measure", "document the fix"],
    highlights: [
      "Rate limiter (TypeScript): token bucket and sliding window per IP, switchable at runtime, responding with 429, Retry-After and X-RateLimit headers.",
      "Order pipeline (TypeScript): an orchestrated saga (payment, inventory, shipping, notification) that compensates in reverse when a stage fails.",
      "Worker pool (Go): fan-out and fan-in over buffered channels for backpressure, with context cancellation on SIGINT and SIGTERM.",
      "Every experiment has a README and a design-decisions doc covering what broke and what changed.",
    ],
    quickstart: ["cd experiments/ts && npm install", "npm run rate-limiter:dev", "cd ../go && go run ./cmd/worker-pool"],
    stack: ["Go", "TypeScript", "Node.js", "Express", "WebSockets"],
    github: "https://github.com/nisanth-alla/distributed-systems-lab",
    live: "https://nisanth-alla.github.io/engineering-journal/experiments/",
  },
  {
    id: "system-design-notes",
    name: "System Design Notes",
    status: "shipped",
    tagline: "Short notes on caching, queues, consistency and retries, plus two failures you can watch in the browser.",
    why: "Six notes on caching, queues, consistency, retries and idempotency, database design and API design. Each follows the same format: what it is, when to use it, a real example and a five-line summary.",
    flow: ["CLI load / React viz", "Express server", "naive ↔ fixed mode", "WebSocket events", "animated timeline"],
    highlights: [
      "Cache stampede: after a 1-second expiry, 20 concurrent requests make 20 database calls. With request coalescing, they make one.",
      "Idempotent retries: three retries charge a customer three times. With an Idempotency-Key, once. Reusing a key with a different payload returns 409.",
      "Both demos switch between naive and fixed modes at runtime and stream events over WebSockets to the visualiser.",
    ],
    quickstart: ["cd experiments && npm install", "npm run cache-stampede:naive", "npm run cache-stampede:load"],
    stack: ["TypeScript", "React", "Vite", "Express", "WebSockets"],
    github: "https://github.com/nisanth-alla/system-design-notes",
    live: "https://nisanth-alla.github.io/system-design-notes/",
  },
  {
    id: "retail-discovery",
    name: "Visual Retail Discovery",
    status: "live",
    tagline: "Upload an outfit photo, find visually similar products, then ask an AI stylist. One Java service.",
    why: "It started at an event and I kept going on my own, to see how far computer vision, embeddings and an LLM could be pushed inside a single deployable service.",
    flow: [
      "upload + normalise",
      "YOLO (ONNX) detect + crop",
      "ResNet-18 embeddings",
      "cosine search",
      "top-k results",
      "stylist chat",
    ],
    highlights: [
      "A YOLO model exported to ONNX detects 16 garment classes. Each crop is embedded with ResNet-18 (DJL) and ranked by cosine similarity against a local vector store.",
      "Semantic catalogue search with all-MiniLM-L6-v2 text embeddings.",
      "The stylist chat uses Groq (Llama 3.3 70B) by default. Switching to Anthropic is one config flag, via Spring's @ConditionalOnProperty.",
      "Ships as one container: a three-stage Docker build running as a non-root user, serving both the React app and the REST API.",
    ],
    quickstart: ["./mvnw spring-boot:run", "cd frontend && npm ci && npm run dev"],
    stack: ["Java 17", "Spring Boot", "ONNX Runtime", "DJL", "React", "TypeScript", "Docker"],
    github: "https://github.com/nisanth-alla/retail-discovery",
    live: "https://retail-discovery.onrender.com/",
  },
  {
    id: "engineering-journal",
    name: "Engineering Journal",
    status: "live",
    tagline: "51 pages across the stack with 20 interactive demos, and a verify step that blocks broken pages.",
    why: "Deep dives, interview prep, experiment write-ups and build notes, covering JavaScript to Go, databases, infrastructure and Playwright. I write it while I learn, not after.",
    flow: ["MDX content", "Starlight + React islands", "Astro build + Pagefind", "verify gate", "GitHub Pages"],
    highlights: [
      "51 MDX pages in 12 sections, with 20 interactive React demos covering the event loop, closures, B-tree indexing, CI/CD and more.",
      "npm run verify checks formatting, ESLint and astro check, builds the site (failing on an empty search index), then runs 28 Playwright tests.",
      "Includes build notes from my own projects, such as how a “two sources of truth” bug hid for hours in FoxPilot.",
    ],
    quickstart: ["npm install", "npm run dev", "npm run verify"],
    stack: ["Astro", "Starlight", "React", "TypeScript", "Playwright", "Pagefind"],
    github: "https://github.com/nisanth-alla/engineering-journal",
    live: "https://nisanth-alla.github.io/engineering-journal/",
  },
  {
    id: "portfolio",
    name: "Portfolio",
    status: "live",
    tagline: "This site: a working terminal, command palette and hover tabs, with no UI libraries.",
    why: "I wanted the site itself to show how I build frontends: typed content, server rendering by default, and client JavaScript only where it earns its place.",
    flow: ["typed content modules", "server components", "client islands", "Vercel"],
    highlights: [
      "Next.js 16 App Router and React 19.2. Sections render on the server; the terminal, palette, tabs and heatmap are small client islands behind error boundaries.",
      "Keyboard-first and accessible: command palette, single-key navigation (toggleable), focus management and reduced-motion support throughout.",
      "UI sounds are synthesised with the Web Audio API (off by default), and the theme switch uses the View Transitions API.",
      "GitHub data comes through cached API routes with timeouts, response validation and a fallback source. Pure logic is unit-tested with Node's test runner.",
    ],
    quickstart: ["npm install", "npm run dev", "npm run verify"],
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Web Audio", "Vercel"],
    github: "https://github.com/nisanth-alla/portfolio",
    live: site.url,
  },
];

export const statusLabel: Record<ProjectStatus, { text: string; tone: "ok" | "wait" | "live" }> = {
  beta: { text: "beta", tone: "wait" },
  active: { text: "active", tone: "live" },
  live: { text: "live", tone: "ok" },
  shipped: { text: "shipped", tone: "ok" },
};
