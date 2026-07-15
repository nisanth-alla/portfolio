import { profile } from "@/content/profile";

export function CurrentFocus() {
  return (
    <section className="mx-auto w-full max-w-5xl border-t border-slate-200 px-6 py-14">
      <div className="max-w-2xl">
        <h2 className="text-2xl font-semibold tracking-tight">Current Focus</h2>
        <ul className="mt-4 space-y-3 text-base text-slate-600">
          {profile.focus.map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}