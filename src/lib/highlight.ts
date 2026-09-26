/**
 * A deliberately tiny syntax highlighter for the Craft excerpts.
 * Runs on the server only (Server Components), so it ships zero client JS.
 *
 * Token classes mirror Warp's code panes: keyword, string, comment, number,
 * function call, punctuation — everything else renders as plain text.
 */

export type Lang = "ts" | "go" | "python";
export type TokenType = "k" | "s" | "c" | "n" | "f" | "p" | "x";
export type Token = { t: TokenType; v: string };

const words = (s: string) => new Set(s.split(/\s+/));

const KEYWORDS: Record<Lang, Set<string>> = {
  ts: words(
    "as async await break case catch class const continue default delete do else enum export extends false finally for from function if implements import in instanceof interface let new null of private protected public readonly return static super switch this throw true try type typeof undefined var void while yield string number boolean",
  ),
  go: words(
    "break case chan const continue default defer else fallthrough for func go goto if import interface map package range return select struct switch type var nil true false iota string int error bool",
  ),
  python: words(
    "and as assert async await break class continue def del elif else except False finally for from global if import in is lambda None nonlocal not or pass raise return True try while with yield",
  ),
};

// Groups: 1 comment · 2 string · 3 number · 4 identifier · 5 punctuation · 6 space · 7 any
const PATTERNS: Record<Lang, string> = {
  ts: String.raw`(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'|` +
    "`(?:\\\\[\\s\\S]|[^`\\\\])*`" +
    String.raw`)|(\b\d[\d_]*(?:\.\d+)?\b)|([A-Za-z_$][\w$]*)|([{}()[\].,;:?!<>=+\-*\/%&|^~@]+)|(\s+)|(.)`,
  go:
    String.raw`(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\\n])*"|` +
    "`[^`]*`" +
    String.raw`|'(?:\\.|[^'\\\n])+')|(\b\d[\d_]*(?:\.\d+)?\b)|([A-Za-z_]\w*)|([{}()[\].,;:?!<>=+\-*\/%&|^~]+)|(\s+)|(.)`,
  python: String.raw`(#[^\n]*)|([rRbBfFuU]{0,2}(?:"""[\s\S]*?"""|'''[\s\S]*?'''|"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'))|(\b\d[\d_]*(?:\.\d+)?\b)|([A-Za-z_]\w*)|([{}()[\].,;:?!<>=+\-*\/%&|^~@]+)|(\s+)|(.)`,
};

/** Remove the common leading indentation so excerpts sit flush left. */
export function dedent(code: string) {
  const lines = code.replace(/\s+$/, "").split("\n");
  const indents = lines
    .filter((line) => line.trim().length > 0)
    .map((line) => line.match(/^[ \t]*/)?.[0].length ?? 0);
  const min = indents.length ? Math.min(...indents) : 0;
  return lines.map((line) => line.slice(min)).join("\n");
}

/** Tokenize into lines of tokens (tokens never span a newline). */
export function highlight(code: string, lang: Lang): Token[][] {
  const re = new RegExp(PATTERNS[lang], "y");
  const keywords = KEYWORDS[lang];
  const lines: Token[][] = [[]];

  const push = (t: TokenType, v: string) => {
    v.split("\n").forEach((part, i) => {
      if (i > 0) lines.push([]);
      if (part) lines[lines.length - 1].push({ t, v: part });
    });
  };

  while (re.lastIndex < code.length) {
    const m = re.exec(code);
    if (!m) break;
    const [full, comment, str, num, ident, punct] = m;
    if (comment) push("c", full);
    else if (str) push("s", full);
    else if (num) push("n", full);
    else if (ident) {
      if (keywords.has(ident)) push("k", full);
      else if (code[re.lastIndex] === "(") push("f", full);
      else push("x", full);
    } else if (punct) push("p", full);
    else push("x", full);
  }

  return lines;
}
