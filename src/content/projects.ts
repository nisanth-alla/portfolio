export const projects = [
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
