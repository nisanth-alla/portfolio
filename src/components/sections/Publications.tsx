import { publications } from "@/content/publications";

export function Publications() {
  return (
    <section
      id="research"
      className="mx-auto w-full max-w-5xl scroll-mt-24 border-t border-slate-200 px-6 py-14"
    >
      <div className="max-w-2xl">
        <h2 className="text-2xl font-semibold tracking-tight">
          Research & Publications
        </h2>
        <p className="mt-3 text-base text-slate-600">
          Research work spanning applied embedded systems and deep learning for
          Indic-language OCR.
        </p>
      </div>

      <div className="mt-8 space-y-4">
        {publications.map((item) => (
          <article
            key={item.title}
            className="rounded-2xl border border-slate-200 p-6"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-lg font-semibold tracking-tight">
                {item.title}
              </h3>
              <span className="text-sm font-medium text-slate-500">
                {item.year}
              </span>
            </div>
            <p className="mt-2 text-sm font-medium text-slate-700">
              {item.venue}
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {item.description}
            </p>
            {item.link ? (
              <a
                href={item.link}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-block text-sm font-medium text-slate-900 underline underline-offset-4"
              >
                Read paper
              </a>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
