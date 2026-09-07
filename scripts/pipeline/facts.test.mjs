import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { FACT_RANGE_2026, inFactRange2026 } from "./fact-range.mjs";

const ROOT = path.join(import.meta.dirname, "..", "..");
const read = (relative) => JSON.parse(fs.readFileSync(path.join(ROOT, relative), "utf8"));
const index = read("public/data-json/index.json");
const globalFacts = read("docs-internal/facts/global.json");
const data = Object.fromEntries(index.stations.map(({ slug }) =>
  [slug, read(`public/data-json/stations/${slug}.json`)]));
const facts = Object.fromEntries(index.stations.map(({ slug }) =>
  [slug, read(`docs-internal/facts/${slug}.json`)]));

test("2026 fact scope uses inclusive station-local dates, not UTC instants or now", () => {
  assert.deepEqual(FACT_RANGE_2026, {
    start_date: "2026-07-01", end_date: "2026-12-31",
    date_basis: "station-local", inclusive: true,
  });
  for (const [date, expected] of [
    ["2025-12-31", false], ["2026-06-30", false], ["2026-07-01", true],
    ["2026-09-07", true], ["2026-12-31", true], ["2027-01-01", false],
  ]) {
    // Deliberately conflicting timestamp: local date is the reporting key.
    assert.equal(inFactRange2026({ date, lowTime: 0 }), expected, date);
  }
});

// Independently state the expected range here so changing the helper cannot
// make an accidental date-range regression silently change the expectation.
const inExpectedRange = (w) => w.date >= "2026-07-01" && w.date <= "2026-12-31";

for (const coast of ["west", "east"]) {
  test(`${coast} coast totals and hourly histogram match scoped data and monthly facts`, () => {
    const stationRows = index.stations.filter((s) => (s.state === "ME" ? "east" : "west") === coast);
    const slugs = stationRows.map((s) => s.slug);
    const minus = slugs.flatMap((s) => data[s].windows).filter((w) => inExpectedRange(w) && w.isMinusTide);
    const daylight = minus.filter((w) => w.daylightMin >= 30);
    const actual = globalFacts.coasts[coast];
    assert.equal(actual.daylight_minus_tides_2026, daylight.length);
    assert.equal(actual.minus_tides_2026, minus.length);
    assert.equal(actual.daylight_share_pct, Math.round(daylight.length / Math.max(1, minus.length) * 100));
    assert.deepEqual(actual.stations, slugs);
    const histogram = {};
    for (const w of daylight) {
      const hour = w.lowTimeLocal.replace(/:\d+ /, " ");
      histogram[hour] = (histogram[hour] ?? 0) + 1;
    }
    assert.deepEqual(globalFacts.hour_histogram_2026_daylight_minus[coast], histogram);
    const monthlyTotal = slugs.reduce((sum, s) => sum + Object.values(facts[s].months_2026)
      .reduce((n, month) => n + month.daylight_minus_tides, 0), 0);
    assert.equal(actual.daylight_minus_tides_2026, monthlyTotal);
    assert.deepEqual(globalFacts.range_2026, FACT_RANGE_2026);
  });
}

for (const { slug } of index.stations) {
  test(`${slug} monthly and deepest facts retain past months within the stated scope`, () => {
    const f = facts[slug];
    assert.deepEqual(f.range_2026, FACT_RANGE_2026);
    assert.equal(f.generated_on, new Date(data[slug].generatedAt).toISOString().slice(0, 10));
    const windows = data[slug].windows.filter(inExpectedRange);
    assert.deepEqual(Object.keys(f.months_2026), ["2026-07", "2026-08", "2026-09", "2026-10", "2026-11", "2026-12"]);
    for (const [month, actual] of Object.entries(f.months_2026)) {
      const rows = windows.filter((w) => w.date.startsWith(month));
      assert.equal(actual.lows_below_1ft, rows.length, month);
      assert.equal(actual.daylight_windows, rows.filter((w) => w.daylightMin >= 30).length, month);
      assert.equal(actual.daylight_minus_tides, rows.filter((w) => w.daylightMin >= 30 && w.isMinusTide).length, month);
    }
    for (const [key, rows] of [
      ["deepest_2026_daylight_lows_top8", windows],
      ["deepest_2026_daylight_lows_remaining_top8", windows.filter((w) => w.lowTime > data[slug].generatedAt)],
    ]) {
      const expected = rows.filter((w) => w.daylightMin >= 30).sort((a, b) => a.lowHeight - b.lowHeight).slice(0, 8);
      assert.deepEqual(f[key].map((w) => [w.date, w.low_ft]), expected.map((w) => [w.date, w.lowHeight]), key);
    }
  });
}

for (const region of ["oregon", "puget", "california"]) {
  test(`${region} regional facts disclose the same range and match station rollups`, () => {
    const regional = read(`docs-internal/facts/region-${region}.json`);
    assert.deepEqual(regional.range_2026, FACT_RANGE_2026);
    for (const station of regional.stations) {
      assert.deepEqual(station.months_2026, facts[station.slug].months_2026);
      assert.deepEqual(station.deepest, facts[station.slug].deepest_2026_daylight_lows_top8.slice(0, 4));
    }
  });
}
