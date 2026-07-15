import { education } from "@/content/education";

export function Education() {
  return (
    <section
      id="education"
      className="mx-auto w-full max-w-5xl scroll-mt-24 border-t border-slate-200 px-6 py-14"
    >
      <div className="max-w-2xl">
        <h2 className="text-2xl font-semibold tracking-tight">Education</h2>
      </div>

      <div className="mt-8 space-y-4">
        {education.map((item) => (
          <article
            key={item.degree + item.period}
            className="rounded-2xl border border-slate-200 p-6"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-lg font-semibold tracking-tight">
                {item.degree}
              </h3>
              <span className="text-sm font-medium text-slate-500">
                {item.period}
              </span>
            </div>
            <p className="mt-1 text-sm font-medium text-slate-700">
              {item.specialization}
            </p>
            <p className="text-sm text-slate-500">{item.university}</p>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {item.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
