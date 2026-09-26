import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { fuzzyScore } from "./fuzzy.ts";
import { shortHash } from "./hash.ts";
import { levenshtein } from "./text.ts";

describe("fuzzyScore", () => {
  it("returns -1 when characters are missing or out of order", () => {
    assert.equal(fuzzyScore("projects", "xyz"), -1);
    assert.equal(fuzzyScore("craft", "tf"), -1);
  });

  it("ranks substring matches above subsequence matches", () => {
    assert.ok(fuzzyScore("foxpilot", "pilot") > fuzzyScore("foxpilot", "fxplt"));
  });

  it("prefers earlier substring matches and ignores case", () => {
    assert.ok(fuzzyScore("GitHub activity", "git") > fuzzyScore("open github", "git"));
  });
});

describe("levenshtein", () => {
  it("measures edit distance", () => {
    assert.equal(levenshtein("whoami", "whoami"), 0);
    assert.equal(levenshtein("whaomi", "whoami"), 2);
    assert.equal(levenshtein("", "help"), 4);
    assert.equal(levenshtein("kitten", "sitting"), 3);
  });
});

describe("shortHash", () => {
  it("is deterministic, 7 hex characters, and input-sensitive", () => {
    assert.equal(shortHash("2024:lead"), shortHash("2024:lead"));
    assert.match(shortHash("anything"), /^[0-9a-f]{7}$/);
    assert.notEqual(shortHash("a"), shortHash("b"));
  });
});
