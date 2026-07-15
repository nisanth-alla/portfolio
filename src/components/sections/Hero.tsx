import { profile } from "@/content/profile";

export function Hero() {
  return (
    <section className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center px-6 py-20">
      <div className="max-w-3xl">
        <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
          {profile.role}
        </p>

        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          {profile.name}
        </h1>

        <p className="mt-4 text-xl font-medium text-slate-700 sm:text-2xl">
          {profile.hero.headline.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </p>

        <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
          {profile.hero.subtext}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={profile.resume}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            Resume
          </a>
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-900 transition hover:border-slate-900"
          >
            GitHub
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-900 transition hover:border-slate-900"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </section>
  );
}
