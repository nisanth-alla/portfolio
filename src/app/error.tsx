"use client";

import Link from "next/link";
import { useEffect } from "react";

import { profile } from "@/content/profile";

type ErrorPageProps = {
  error: Error & { digest?: string };
  unstable_retry: () => void;
};

export default function ErrorPage({ error, unstable_retry }: ErrorPageProps) {
  useEffect(() => {
    console.error("[app] unhandled render error", error);
  }, [error]);

  return (
    <main id="main-content" className="wrap flex min-h-svh flex-col justify-center py-20">
      <p className="eyebrow">
        <b>500</b>
        <span>Something went wrong</span>
      </p>
      <h1 className="h-section mt-4 max-w-2xl">This page failed to load.</h1>
      <p className="lede mt-4 max-w-lg">
        Trying again usually fixes it. If it doesn&apos;t, I&apos;d appreciate a quick note at{" "}
        <a className="text-accent-strong underline underline-offset-4" href={profile.emailLink}>
          {profile.email}
        </a>
        .
      </p>
      {error.digest ? (
        <p className="mt-3 font-mono text-[11.5px] text-faint">Reference: {error.digest}</p>
      ) : null}
      <div className="mt-8 flex flex-wrap gap-3">
        <button type="button" onClick={() => unstable_retry()} className="btn btn-primary">
          Try again
        </button>
        <Link href="/" className="btn btn-ghost">
          Back to the homepage
        </Link>
      </div>
    </main>
  );
}