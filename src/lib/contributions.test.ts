import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { buildMonthLabels, buildWeeks, calcStreaks, type Contribution } from "./contributions.ts";

const day = (date: string, count: number): Contribution => ({ date, count, level: count > 0 ? 1 : 0 });

describe("calcStreaks", () => {
  it("counts consecutive active days ending today", () => {
    const days = [day("2026-09-20", 0), day("2026-09-21", 2), day("2026-09-22", 1)];
    assert.deepEqual(calcStreaks(days, "2026-09-22"), { current: 2, longest: 2 });
  });

  it("keeps the streak alive when today has no activity yet", () => {
    const days = [day("2026-09-20", 1), day("2026-09-21", 3), day("2026-09-22", 0)];
    assert.equal(calcStreaks(days, "2026-09-22").current, 2);
  });

  it("breaks the current streak on a missed day before today", () => {
    const days = [day("2026-09-19", 5), day("2026-09-20", 0), day("2026-09-21", 0), day("2026-09-22", 0)];
    assert.equal(calcStreaks(days, "2026-09-22").current, 0);
  });

  it("ignores future dates in both streaks", () => {
    const days = [day("2026-09-21", 1), day("2026-09-22", 1), day("2026-09-23", 9), day("2026-09-24", 9)];
    assert.deepEqual(calcStreaks(days, "2026-09-22"), { current: 2, longest: 2 });
  });

  it("finds the longest run anywhere in the range", () => {
    const days = [
      day("2026-01-01", 1),
      day("2026-01-02", 1),
      day("2026-01-03", 1),
      day("2026-01-04", 0),
      day("2026-01-05", 1),
    ];
    assert.equal(calcStreaks(days, "2026-01-05").longest, 3);
  });
});

describe("buildWeeks", () => {
  it("returns no weeks for no data", () => {
    assert.deepEqual(buildWeeks([]), []);
  });

  it("pads the first week so the first day sits on its weekday row", () => {
    // 2026-01-01 is a Thursday → 4 empty cells (Sun–Wed) before it.
    const weeks = buildWeeks([day("2026-01-01", 1), day("2026-01-02", 0)]);
    assert.equal(weeks.length, 1);
    assert.deepEqual(weeks[0]?.slice(0, 4), [null, null, null, null]);
    assert.equal(weeks[0]?.[4]?.date, "2026-01-01");
  });

  it("splits a full year into week columns of at most 7 cells", () => {
    const days: Contribution[] = [];
    for (let d = new Date("2026-01-01T00:00:00Z"); d.getUTCFullYear() === 2026; d.setUTCDate(d.getUTCDate() + 1)) {
      days.push(day(d.toISOString().slice(0, 10), 0));
    }
    const weeks = buildWeeks(days);
    assert.equal(weeks.flat().filter(Boolean).length, 365);
    assert.ok(weeks.every((week) => week.length <= 7));
  });
});

describe("buildMonthLabels", () => {
  it("places a label at the first column of each month", () => {
    const weeks = buildWeeks([day("2026-01-31", 0), day("2026-02-01", 0), day("2026-02-08", 0)]);
    const labels = buildMonthLabels(weeks, 14);
    assert.deepEqual(
      labels.map((l) => l.label),
      ["Jan", "Feb"],
    );
    assert.equal(labels[0]?.left, 0);
  });
});