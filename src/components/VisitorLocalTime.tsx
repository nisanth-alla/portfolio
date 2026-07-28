"use client";

import { useEffect, useState } from "react";

function formatVisitorLocalTime(date: Date) {
  const time = new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);

  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return { time, tz };
}

type VisitorLocalTimeProps = {
  className?: string;
};

export function VisitorLocalTime({ className = "" }: VisitorLocalTimeProps) {
  const [display, setDisplay] = useState<{ time: string; tz: string } | null>(
    null,
  );

  useEffect(() => {
    const tick = () => setDisplay(formatVisitorLocalTime(new Date()));
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span className={className} suppressHydrationWarning>
      {display ? (
        <>
          <span className="text-foreground">{display.time}</span>
          <span className="text-muted-foreground"> · {display.tz}</span>
        </>
      ) : (
        <span className="text-muted-foreground">Local time</span>
      )}
    </span>
  );
}
