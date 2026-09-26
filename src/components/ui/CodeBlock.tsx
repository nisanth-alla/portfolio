import { dedent, highlight, type Lang } from "@/lib/highlight";

/** VS Code-style minimap: each token becomes a thin bar in its syntax colour. */
export function Minimap({ code, lang }: { code: string; lang: Lang }) {
  const lines = highlight(dedent(code), lang);
  return (
    <div className="minimap" aria-hidden>
      {lines.map((tokens, i) => (
        <div key={i} className="mm-line">
          {tokens.map((tok, j) => {
            const width = Math.max(1, Math.round(tok.v.length * 1.1));
            return /^\s+$/.test(tok.v) ? (
              <span key={j} style={{ width }} />
            ) : (
              <span key={j} className={`mm-tok ${tok.t}`} style={{ width }} />
            );
          })}
        </div>
      ))}
    </div>
  );
}

type CodeBlockProps = {
  code: string;
  lang: Lang;
  startLine?: number;
  /** Render a trailing ⋮ row to signal the excerpt continues. */
  elided?: boolean;
  label?: string;
};

/** Server-rendered, syntax-highlighted excerpt with real file line numbers. */
export function CodeBlock({ code, lang, startLine = 1, elided, label }: CodeBlockProps) {
  const lines = highlight(dedent(code), lang);

  return (
    <pre className="code" aria-label={label} tabIndex={0}>
      <code>
        {lines.map((tokens, i) => (
          <span className="code-line" key={i}>
            <span className="code-ln" aria-hidden>
              {startLine + i}
            </span>
            <span className="code-src">
              {tokens.map((tok, j) =>
                tok.t === "x" ? (
                  tok.v
                ) : (
                  <span key={j} className={`tok-${tok.t}`}>
                    {tok.v}
                  </span>
                ),
              )}
            </span>
          </span>
        ))}
        {elided ? (
          <span className="code-line code-elide" aria-hidden>
            <span className="code-ln">⋮</span>
            <span className="code-src" />
          </span>
        ) : null}
      </code>
    </pre>
  );
}