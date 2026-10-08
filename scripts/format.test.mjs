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

// --- Live-window eligibility (fixed clocks) -------------------------------
// Regression for the 2026-10-06 finding: the Finder anchored "now" to
// data.generatedAt, so an already-ended same-day window stayed "best
// available" for the rest of the day.
import { liveNow, liveWindows, synthesis } from "../src/lib/format.ts";

const DAY = 86400_000;
const generatedAt = Date.parse("2026-10-06T11:30:00Z");

function makeWindow(overrides) {
  // Modeled on Seattle's Oct 6 case: 7:51 AM low, window ending 8:45 AM PDT.
  const lowTime = Date.parse("2026-10-06T14:51:00Z");
  return {
    date: "2026-10-06",
    weekday: "Tue",
    lowTime,
    lowTimeLocal: "7:51 AM",
    lowHeight: -0.4,
    isMinusTide: true,
    windowStart: lowTime - 54 * 60_000,
    windowEnd: Date.parse("2026-10-06T15:45:00Z"),
    daylightMin: 108,
    score: 71,
    ...overrides,
  };
}

test("liveWindows keeps a window before and during it, drops it once ended", () => {
  const w = makeWindow({});
  assert.equal(liveWindows([w], w.windowStart - 3600_000, 30).length, 1, "upcoming");
  assert.equal(liveWindows([w], w.lowTime + 10 * 60_000, 30).length, 1, "ongoing, low passed");
  assert.equal(liveWindows([w], w.windowEnd + 60_000, 30).length, 0, "ended");
});

test("an overnight window survives the date rollover until its end", () => {
  // Low near midnight local; window ends on the next calendar day.
  const lowTime = Date.parse("2026-12-24T07:40:00Z"); // 11:40 PM PST Dec 23
  const w = makeWindow({
    date: "2026-12-23",
    lowTime,
    windowStart: lowTime - 50 * 60_000,
    windowEnd: lowTime + 55 * 60_000,
  });
  const justAfterMidnightLocal = Date.parse("2026-12-24T08:10:00Z");
  assert.equal(liveWindows([w], justAfterMidnightLocal, 30).length, 1);
  assert.equal(liveWindows([w], w.windowEnd + 1, 30).length, 0);
});

test("the horizon is measured from now, not from the data stamp", () => {
  const w = makeWindow({});
  const far = makeWindow({ lowTime: w.lowTime + 31 * DAY, windowEnd: w.windowEnd + 31 * DAY });
  assert.deepEqual(liveWindows([w, far], w.lowTime - DAY, 30).map((x) => x.lowTime), [w.lowTime]);
  // Two days later the far window enters the 30-day horizon.
  assert.equal(liveWindows([w, far], w.lowTime + 2 * DAY, 30).length, 1);
});

test("liveNow floors a client clock that runs behind stale data", () => {
  assert.equal(liveNow(generatedAt - 3600_000, generatedAt), generatedAt);
  assert.equal(liveNow(generatedAt + 3600_000, generatedAt), generatedAt + 3600_000);
  // With week-old data and an honest clock, ended windows stay excluded.
  const w = makeWindow({});
  assert.equal(liveWindows([w], liveNow(w.windowEnd + 7 * DAY, generatedAt), 30).length, 0);
});

test("synthesis stops calling an ended window best available", () => {
  const ended = makeWindow({});
  const later = makeWindow({
    date: "2026-10-12",
    weekday: "Mon",
    lowTime: ended.lowTime + 6 * DAY,
    lowTimeLocal: "11:02 AM",
    lowHeight: 0.6,
    isMinusTide: false,
    windowStart: ended.windowStart + 6 * DAY,
    windowEnd: ended.windowEnd + 6 * DAY,
    score: 38,
  });
  const data = { generatedAt, windows: [ended, later] };
  const duringEnded = synthesis(data, 30, ended.lowTime - 3600_000);
  assert.ok(duringEnded.includes("7:51 AM"), duringEnded);
  const afterEnded = synthesis(data, 30, ended.windowEnd + 3600_000);
  assert.ok(!afterEnded.includes("7:51 AM"), afterEnded);
  assert.ok(afterEnded.includes("11:02 AM"), afterEnded);
  assert.ok(afterEnded.startsWith("None of the next 30 days' 1 qualifying lows"), afterEnded);
});

test("Finder summary uses the selected depth results for both count and best pick", () => {
  const shallow = makeWindow({ lowHeight: 0.5, isMinusTide: false, score: 95, lowTimeLocal: "8:00 AM" });
  const minus = makeWindow({ lowHeight: -0.5, isMinusTide: true, score: 60, lowTimeLocal: "9:00 AM" });
  const deep = makeWindow({ lowHeight: -1.5, isMinusTide: true, score: 50, lowTimeLocal: "10:00 AM" });
  const data = { generatedAt, windows: [shallow, minus, deep] };
  const now = shallow.windowStart - 3600_000;
  assert.ok(synthesis(data, 30, now).includes("8:00 AM"));
  const minusSummary = synthesis(data, 30, now, [minus, deep]);
  assert.ok(minusSummary.includes("2 qualifying lows"), minusSummary);
  assert.ok(minusSummary.includes("9:00 AM"), minusSummary);
  assert.ok(!minusSummary.includes("8:00 AM"), minusSummary);
  const deepSummary = synthesis(data, 30, now, [deep]);
  assert.ok(deepSummary.includes("1 qualifying lows"), deepSummary);
  assert.ok(deepSummary.includes("10:00 AM"), deepSummary);
});

test("empty depth results never recommend a low excluded by the filter", () => {
  const shallow = makeWindow({ lowHeight: 0.5, isMinusTide: false });
  const data = { generatedAt, windows: [shallow] };
  assert.equal(synthesis(data, 30, shallow.windowStart - 1, []),
    "No lows match this depth filter in the next 30 days at this station.");
});
