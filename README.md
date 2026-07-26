# Nisanth A — Portfolio

Personal portfolio site: a single-page narrative of my engineering journey, work, research, and how to reach me. Built for clarity and performance—content lives in TypeScript modules, UI in small section components, minimal client JavaScript.

**Repository:** [github.com/nisanth-alla/portfolio](https://github.com/nisanth-alla/portfolio)  
**Live site:** _https://portfolio-ulzg.vercel.app/_

## Highlights

- One-page layout with sticky nav and anchor links (About, Projects, Research, Education, Contact)
- Server-rendered sections by default; client code only where interaction is needed (navigation)
- Self-hosted [Geist](https://vercel.com/font) via `next/font` (no Google Fonts request, reduced layout shift)
- Content separated from presentation under `src/content/` for easy updates without touching layout code

## On the page

| Section | Purpose |
|--------|---------|
| **Hero** | Role, headline, primary actions (Resume, GitHub, LinkedIn) |
| **Engineering Journey** | Milestone timeline (career narrative, not a stack list) |
| **About** | Bio, location, engineering philosophy |
| **Current Focus** | What I'm learning and building now |
| **Featured Projects** | Selected repos with stack and links |
| **Research & Publications** | Papers and research (including M.Tech work) |
| **Education** | Degrees and context |
| **Recognition** | Awards and stakeholder recognition |
| **Technical Writing** | Notes and explainers |
| **Contact** | LinkedIn and email |

## Tech stack

- [Next.js](https://nextjs.org) (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React](https://react.dev/)

## Project structure

```text
src/
├── app/                 # layout, page, global styles, icon
├── components/
│   ├── Nav.tsx          # sticky nav + active section (client)
│   └── sections/        # one component per page section
└── content/             # copy and data (edit here first)
    ├── profile.ts       # identity, links, hero, focus
    ├── about.ts
    ├── journey.ts
    ├── projects.ts
    ├── publications.ts
    ├── education.ts
    ├── recognition.ts
    └── writing.ts
```

Place `resume.pdf` in `public/` so the Hero resume link resolves to `/resume.pdf`.

## Local development

Requires Node.js 20+ (LTS recommended).

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Other scripts:

```bash
npm run build   # production build
npm run start   # serve production build locally
npm run lint    # ESLint
```

## Deployment

Optimized for [Vercel](https://vercel.com): connect this repository, use the default Next.js settings, deploy. Set the production URL in this README when ready.

## Contact

- [LinkedIn](https://www.linkedin.com/in/nisanth-alla/)
- [GitHub](https://github.com/nisanth-alla)
- nisanth.alla@gmail.com
