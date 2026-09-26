import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { dedent, highlight, type Token } from "./highlight.ts";

const kinds = (tokens: Token[]) => tokens.filter((t) => t.t !== "x" && t.v.trim()).map((t) => `${t.t}:${t.v}`);
const joined = (lines: Token[][]) => lines.map((line) => line.map((t) => t.v).join("")).join("\n");

describe("dedent", () => {
  it("removes the common leading indentation and trailing whitespace", () => {
    assert.equal(dedent("    a\n      b\n    c\n\n"), "a\n  b\nc");
  });

  it("ignores blank lines when measuring indentation", () => {
    assert.equal(dedent("\t\tx\n\n\t\ty"), "x\n\ny");
  });
});

describe("highlight", () => {
  it("round-trips the source exactly", () => {
    const source = 'const run = await client.agent.run({ prompt: "fix" });\n// done';
    assert.equal(joined(highlight(source, "ts")), source);
  });

  it("classifies TypeScript keywords, calls, strings and comments", () => {
    const [line] = highlight('const x = fetch("/api"); // note', "ts");
    assert.deepEqual(kinds(line ?? []), ["k:const", "p:=", "f:fetch", "p:(", 's:"/api"', "p:);", "c:// note"]);
  });

  it("recognises Python comments and keywords, not TypeScript ones", () => {
    const [line] = highlight("if claimed is None:  # lost the race", "python");
    assert.deepEqual(kinds(line ?? []), ["k:if", "k:is", "k:None", "p::", "c:# lost the race"]);
  });

  it("handles Go channel syntax and raw strings", () => {
    const [line] = highlight("case p.tasks <- `raw`:", "go");
    assert.ok(kinds(line ?? []).includes("k:case"));
    assert.ok(kinds(line ?? []).includes("s:`raw`"));
  });

  it("never lets a token span a line break", () => {
    const lines = highlight("/* one\ntwo */\nconst y = 1", "ts");
    assert.equal(lines.length, 3);
    assert.ok(lines.flat().every((t) => !t.v.includes("\n")));
    assert.equal(lines[0]?.[0]?.t, "c");
    assert.equal(lines[1]?.[0]?.t, "c");
  });
});