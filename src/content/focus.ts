/** Current focus, rendered as Warp-style stacked "layers". */
export type FocusLayer = {
  title: string;
  chips: string[];
  description: string;
};

export const focusLayers: FocusLayer[] = [
  {
    title: "Production full-stack",
    chips: ["react", "typescript", "next.js"],
    description: "Building production-ready full-stack applications.",
  },
  {
    title: "Backend depth",
    chips: ["node.js", "express", "postgres"],
    description: "Improving backend skills with Node.js and Express.",
  },
  {
    title: "Distributed systems",
    chips: ["go", "sagas", "rate limiting"],
    description: "Learning distributed systems and system design.",
  },
  {
    title: "Cloud engineering",
    chips: ["aws", "docker"],
    description: "Cloud engineering with AWS.",
  },
  {
    title: "Public proof",
    chips: ["projects", "writing", "open source"],
    description: "Creating strong public proof through projects and writing.",
  },
];