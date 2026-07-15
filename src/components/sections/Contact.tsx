import { profile } from "@/content/profile";

export function Contact() {
  return (
    <section
      id="contact"
      className="mx-auto w-full max-w-5xl scroll-mt-24 border-t border-slate-200 px-6 py-14"
    >
      <div className="max-w-2xl">
        <h2 className="text-2xl font-semibold tracking-tight">Contact</h2>
        <p className="mt-4 text-base text-slate-600">
          Reach me via{" "}
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-slate-900 underline underline-offset-4"
          >
            LinkedIn
          </a>{" "}
          or email at{" "}
          <a
            href={profile.emailLink}
            className="font-medium text-slate-900 underline underline-offset-4"
          >
            {profile.email}
          </a>
          .
        </p>
      </div>
    </section>
  );
}