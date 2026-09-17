import assert from "node:assert/strict";
import { test } from "node:test";
import fs from "node:fs";
import { fmtSunEdge } from "../src/lib/format.ts";

const sunrise = Date.parse("2026-10-05T14:00:00Z");
const sunset = Date.parse("2026-10-06T02:00:00Z");

for (const [name, edge] of [["sunrise", sunrise], ["sunset", sunset]]) {
  for (const [direction, offset] of [["before", -32], ["after", 19]]) {
    test(`labels a low ${direction} ${name}`, () => {
      assert.equal(fmtSunEdge({ sunrise, sunset, lowTime: edge + offset * 60_000 }), `${Math.abs(offset)} min ${direction} ${name}`);
    });
  }
  test(`labels a low at ${name}`, () => {
    assert.equal(fmtSunEdge({ sunrise, sunset, lowTime: edge }), `At ${name}`);
  });
}

test("handles missing solar events without treating them as the Unix epoch", () => {
  assert.equal(fmtSunEdge({ lowTime: sunrise - 60_000, sunrise, sunset: null }), "1 min before sunrise");
  assert.equal(fmtSunEdge({ lowTime: sunset + 60_000, sunrise: null, sunset }), "1 min after sunset");
  assert.equal(fmtSunEdge({ lowTime: sunrise, sunrise: null, sunset: null }), "Unavailable");
});

test("Seattle lows before sunrise and after sunset retain the correct direction", () => {
  const data = JSON.parse(fs.readFileSync(new URL("../public/data-json/stations/seattle-wa.json", import.meta.url), "utf8"));
  // These are real cases that previously displayed the opposite solar phase.
  for (const [date, expected] of [["2026-10-05", "before sunrise"], ["2027-02-15", "after sunset"]]) {
    const window = data.windows.find((w) => w.date === date && w.daylightMin >= 30);
    // Pipeline data rolls forward, so the synthetic cases above remain the
    // permanent regression even after these specific dates leave the dataset.
    if (window) assert.ok(fmtSunEdge(window).endsWith(expected), `${date}: ${fmtSunEdge(window)}`);
  }
});
