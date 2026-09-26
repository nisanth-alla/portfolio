"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

import { profile } from "@/content/profile";
import { getLatestCommit, type LatestCommit } from "@/lib/github-client";

// Shared clock for useSyncExternalStore (0 = not hydrated yet).
let clockNow = 0;
let clockTimer: number | undefined;
const clockListeners = new Set<() => void>();

function subscribeClock(listener: () => void) {
  clockListeners.add(listener);
  if (clockListeners.size === 1) {
    clockNow = Date.now();
    clockTimer = window.setInterval(() => {
      clockNow = Date.now();
      clockListeners.forEach((l) => l());
    }, 15_000);
  }
  return () => {
    clockListeners.delete(listener);
    if (clockListeners.size === 0) window.clearInterval(clockTimer);
  };
}
const getClock = () => clockNow;
const getServerClock = () => 0;

function formatTime(ms: number, timeZone?: string) {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone,
  }).format(new Date(ms));
}

function visitorZone() {
  const zone = Intl.DateTimeFormat().resolvedOptions().timeZone ?? "";
  const city = zone.split("/").pop()?.replace(/_/g, " ").toLowerCase() ?? "local";
  return { zone, city };
}

/** tmux-style status line: session · Hyderabad time · your time · last push. */
export function Telemetry() {
  const now = useSyncExternalStore(subscribeClock, getClock, getServerClock);
  const [commit, setCommit] = useState<LatestCommit | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    getLatestCommit().then((latest) => {
      if (!alive) return;
      if (latest) setCommit(latest);
      else setFailed(true);
    });
    return () => {
      alive = false;
    };
  }, []);

  const hydrated = now > 0;
  const visitor = hydrated ? visitorZone() : null;
  const sameZone = visitor?.zone === profile.timezone;

  return (
    <div className="tmux" role="group" aria-label="Status line">
      <span className="tmux-seg is-head">● nisanth</span>
      <span className="tmux-seg is-mid tabular-nums">
        {profile.city.slice(0, 3).toLowerCase()} {hydrated ? formatTime(now, profile.timezone) : "--:--"}{" "}
        {profile.timezoneLabel.toLowerCase()}
      </span>
      {visitor && !sameZone ? (
        <span className="tmux-seg is-plain tabular-nums">
          you {formatTime(now)} {visitor.city}
        </span>
      ) : null}
      <span className="tmux-right">
        {commit ? (
          <a href={commit.url} target="_blank" rel="noopener noreferrer" className="truncate">
            pushed {commit.ago} → {commit.repo}
          </a>
        ) : (
          failed ? (
            <a href={profile.github} target="_blank" rel="noopener noreferrer" className="truncate">
              github.com/{profile.handle}
            </a>
          ) : (
            <span>fetching…</span>
          )
        )}
      </span>
    </div>
  );
}