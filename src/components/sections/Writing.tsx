import { writing } from "@/content/writing";

export function Writing() {
  return (
    <section className="mx-auto w-full max-w-5xl border-t border-slate-200 px-6 py-14">
      <div className="max-w-2xl">
        <h2 className="text-2xl font-semibold tracking-tight">
          Technical Writing
        </h2>
        <p className="mt-3 text-base text-slate-600">
          Short technical notes and explainers from my learning journey.
        </p>
      </div>

      <div className="mt-8 space-y-4">
        {writing.map((item) => (
          <article
            key={item.title}
            className="rounded-2xl border border-slate-200 p-6"
          >
            <h3 className="text-lg font-semibold tracking-tight">{item.title}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {item.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}