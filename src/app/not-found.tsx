import type { Metadata } from "next";
import Link from "next/link";

import { Logo } from "@/components/chrome/Logo";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <main id="main-content" className="wrap flex min-h-svh flex-col justify-center py-20">
      <Link href="/" aria-label="Home" className="mb-12 inline-flex w-fit">
        <Logo className="h-9 w-9" />
      </Link>
      <p className="eyebrow">
        <b>404</b>
        <span>Not found</span>
      </p>
      <h1 className="h-section mt-4 max-w-2xl">This page doesn&apos;t exist.</h1>
      <p className="lede mt-4 max-w-lg">The link might be out of date, or the address has a typo.</p>
      <pre className="term-scope mt-8 max-w-lg overflow-x-auto rounded-xl px-4 py-3 font-mono text-[12.5px] leading-6">
        <code>
          <span className="text-accent">❯ </span>cd ./this-page{"\n"}
          <span className="text-err">cd: no such file or directory</span>
        </code>
      </pre>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/" className="btn btn-primary">
          Back to the homepage
        </Link>
        <Link href="/#projects" className="btn btn-ghost">
          See my projects
        </Link>
      </div>
    </main>
  );
}