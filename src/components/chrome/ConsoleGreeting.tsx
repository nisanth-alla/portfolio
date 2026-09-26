"use client";

import { useEffect } from "react";

import { profile } from "@/content/profile";

let greeted = false;

/** A hello for anyone who opens devtools. */
export function ConsoleGreeting() {
  useEffect(() => {
    if (greeted) return;
    greeted = true;
    console.log(
      `%c> hello, curious engineer.%c

this site: next.js 16 · react 19.2 · tailwind css v4 — no ui libraries.
source:    ${profile.source.replace("https://", "")}
try:       ⌘K for the command palette, or the terminal up top.
say hi:    ${profile.email}`,
      "color:#0b7a6c;font-weight:600;font-size:13px",
      "color:inherit",
    );
  }, []);

  return null;
}