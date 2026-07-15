import { recognition } from "@/content/recognition";

export function Recognition() {
  return (
    <section className="mx-auto w-full max-w-5xl border-t border-slate-200 px-6 py-14">
      <div className="max-w-2xl">
        <h2 className="text-2xl font-semibold tracking-tight">Recognition</h2>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {recognition.map((award) => (
          <article
            key={award.title}
            className="rounded-2xl border border-slate-200 p-6"
          >
            <h3 className="text-lg font-semibold tracking-tight">
              <span aria-hidden="true" className="mr-2">
                🏆
              </span>
              {award.title}{" "}
              <span className="font-normal text-slate-500">({award.year})</span>
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {award.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
