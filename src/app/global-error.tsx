"use client";

import { useEffect } from "react";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  unstable_retry: () => void;
};

/**
 * Last-resort boundary for errors in the root layout. It replaces the layout,
 * so it can't rely on global CSS or fonts — styles are inline on purpose.
 */
export default function GlobalError({ error, unstable_retry }: GlobalErrorProps) {
  useEffect(() => {
    console.error("[app] root layout error", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#f4f2ec",
          color: "#151a19",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <title>Something went wrong | Nisanth A</title>
        <main style={{ maxWidth: 480, padding: 24 }}>
          <h1 style={{ fontSize: 28, letterSpacing: "-0.03em", margin: 0 }}>Something went wrong.</h1>
          <p style={{ color: "#525b58", lineHeight: 1.6 }}>
            The site hit an unexpected error. Please try again.
          </p>
          <button
            type="button"
            onClick={() => unstable_retry()}
            style={{
              marginTop: 8,
              padding: "10px 16px",
              border: 0,
              borderRadius: 10,
              background: "#151a19",
              color: "#f4f2ec",
              font: "inherit",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}