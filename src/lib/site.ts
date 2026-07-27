export const site = {
  name: "Nisanth A",
  title: "Nisanth A | Software Engineer",
  description:
    "Software Engineer portfolio — full-stack development, distributed systems, cloud engineering, and research in applied systems and ML.",
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
