import type { CSSProperties } from "react";

/**
 * An architecture flow drawn as a vertical trace. When its panel is active,
 * a highlight walks the stages in order, like a request moving through.
 */
export function FlowPipeline({ stages, label }: { stages: string[]; label: string }) {
  return (
    <ol className="trace" aria-label={label} style={{ "--n": stages.length } as CSSProperties}>
      {stages.map((stage, i) => (
        <li key={stage} className="trace-step" style={{ "--i": i } as CSSProperties}>
          <span className="trace-idx" aria-hidden>
            {String(i + 1).padStart(2, "0")}
          </span>
          <span>{stage}</span>
        </li>
      ))}
    </ol>
  );
}