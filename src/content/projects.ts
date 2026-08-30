export const projects = [
  {
    name: "FoxPilot",
    description:
      "A local-first, open-source job discovery tool that turns a resume and career goals into a ranked, explainable shortlist — without auto-applying, leaking data, or burning through API credits.",
    stack: [
      "Python",
      "FastAPI",
      "React",
      "TypeScript",
      "SQLite",
      "PostgreSQL",
      "Ollama",
      "Alembic",
      "Docker",
      "Railway",
    ],
    github: "https://github.com/foxpilot-jobs/foxpilot",
    live: "https://foxpilot.in",
    points: [
      "Built after noticing that every job search tool either auto-applies for you (dangerous) or dumps 200 unranked listings and walks away. FoxPilot matches your resume against listings locally using an LLM and explains the gap — you decide what to apply to.",
      "Local-first by default: Ollama runs the matching on your machine, resume never leaves it. Postgres and a hosted API layer are available for the web product path.",
      "Multi-source ingestion across Greenhouse, Lever, RemoteOK, and HN hiring threads, each behind an isolated adapter so one source outage doesn't stall the pipeline.",
      "Currently in beta and being hardened toward a user-ready product — auth, PWA shell, rate-limit observability, and the India production path on AWS are all in progress.",
    ],
  },
  {
    name: "SyncMark",
    description:
      "Profile-aware, local-first bookmark sync across every browser and every profile you run — built because no existing tool understands that 'Work' in Chrome and 'Work' in Arc are the same person.",
    stack: [
      "TypeScript",
      "Node.js",
      "SQLite",
      "React",
      "Vite",
      "WXT",
      "Turborepo",
      "Manifest V3",
    ],
    github: "https://github.com/nisanth-alla/syncmark",
    points: [
      "The gap I ran into personally: I use Chrome and Arc with separate work and personal profiles. Every sync tool — Floccus, xBrowserSync, Raindrop.io — treats bookmarks as one flat pile and has no concept of profiles. SyncMark is built on the insight that profile identity is the missing primitive.",
      "A local Node.js sync daemon holds a canonical SQLite store; thin MV3 extensions in each browser push snapshots in and apply reconciled state back out. Everything stays on your machine.",
      "Custom URL normaliser strips tracking parameters and canonicalises hosts before hashing — so two URLs that differ only by utm_source are correctly flagged as the same page. This is the deduplication step most tools get wrong.",
      "Two-way sync implemented: extension reads chrome.bookmarks, ingests to engine, pulls canonical state back and applies creates/removes to the browser's bookmark tree.",
    ],
  },
  {
    name: "Distributed Systems Lab",
    description:
      "Hands-on experiments in rate limiting, saga orchestration, and concurrent processing. Each one builds a working system, breaks it on purpose, and documents what happened.",
    stack: ["TypeScript", "Go", "Node.js", "System Design"],
    github: "https://github.com/nisanth-alla/distributed-systems-lab",
    live: "https://nisanth-alla.github.io/engineering-journal/",
    points: [
      "Three experiments across two languages, each solving a different real-world problem.",
      "Includes a Go concurrent file processor with goroutines, channels, and backpressure.",
    ],
  },
  {
    name: "System Design Notes",
    description:
      "Structured notes on caching, queues, consistency, retries, and more. Short enough to re-read in five minutes, with runnable experiments and interactive visualizations.",
    stack: ["TypeScript", "React", "Vite", "Distributed Systems"],
    github: "https://github.com/nisanth-alla/system-design-notes",
    live: "https://nisanth-alla.github.io/system-design-notes/",
    points: [
      "Six notes with a consistent structure: definition, tradeoffs, real example, summary.",
      "Two interactive visualizations: cache stampede and idempotent retries.",
    ],
  },
  {
    name: "Visual Retail Discovery",
    description:
      "A fashion discovery application combining visual search, semantic catalogue search, outfit recommendations, and an AI stylist in a single Java service.",
    stack: ["Java", "Spring Boot", "React", "TypeScript", "Computer Vision"],
    github: "https://github.com/nisanth-alla/retail-discovery",
    live: "https://retail-discovery.onrender.com/",
    points: [
      "Uses image embeddings, ONNX models, and a local vector index to find related products.",
      "Serves the React frontend and API from one container with configurable Groq and Anthropic chat providers.",
    ],
  },
  {
    name: "Engineering Journal",
    description:
      "A documentation site covering my Go learning journey and experiment deep-dives. Written as I learn, not after mastering it.",
    stack: ["Astro", "Starlight", "TypeScript"],
    github: "https://github.com/nisanth-alla/engineering-journal",
    live: "https://nisanth-alla.github.io/engineering-journal/",
    points: [
      "Articles on goroutines vs async/await, channels, and the Go mental model shift.",
      "Deployed to GitHub Pages with built-in search and dark mode.",
    ],
  },
  {
    name: "Portfolio",
    description:
      "A clean personal portfolio built with Next.js to showcase my engineering journey, projects, and writing.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS"],
    github: "https://github.com/nisanth-alla/portfolio",
    live: "https://portfolio-ulzg.vercel.app/",
    points: [
      "Content-driven architecture with minimal client JavaScript.",
      "Accessible layout, theme support, and production metadata.",
    ],
  },
];
