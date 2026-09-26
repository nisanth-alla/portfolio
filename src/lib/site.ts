export const site = {
  name: "Nisanth A",
  title: "Nisanth A | Software Engineer",
  description:
    "Nisanth A is a software engineer in Hyderabad working on React and TypeScript in production, plus local-first tools and distributed systems experiments.",
  url:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "https://portfolio-ulzg.vercel.app",
  locale: "en_US",
  author: {
    name: "Nisanth A",
    email: "nisanth.alla@gmail.com",
    github: "https://github.com/nisanth-alla",
    linkedin: "https://www.linkedin.com/in/nisanth-alla/",
  },
} as const;

export function absoluteUrl(path: string) {
  return `${site.url}${path.startsWith("/") ? path : `/${path}`}`;
}