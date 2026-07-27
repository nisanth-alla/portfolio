"use client";

import { useCallback, useState } from "react";

import { profile } from "@/content/profile";

export function CopyEmailButton() {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = profile.emailLink;
    }
  }, []);

  return (
    <button type="button" onClick={copy} className="btn-secondary mt-6">
      {copied ? "Email copied" : "Copy email address"}
    </button>
  );
}
