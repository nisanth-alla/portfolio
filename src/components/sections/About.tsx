import { about } from "@/content/about";
import { profile } from "@/content/profile";

export function About() {
  return (
    <section
      id="about"
      className="mx-auto w-full max-w-5xl scroll-mt-24 border-t border-slate-200 px-6 py-14"
    >
      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">About</h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            {about.bio}
          </p>
          <p className="mt-4 text-sm text-slate-500">
            Based in {profile.location}.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Engineering Philosophy
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            {about.philosophy}
          </p>
        </div>
      </div>
    </section>
  );
}
