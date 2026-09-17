import assert from "node:assert/strict";
import { test } from "node:test";
import { windowFromHourly, windowFromExtremes } from "./tide-math.mjs";

const hour = 3_600_000;

test("hourly interpolation resolves the two threshold crossings around a low", () => {
  assert.deepEqual(windowFromHourly([
    { t: 0, v: 2 }, { t: hour, v: 0 }, { t: 2 * hour, v: 2 },
  ], hour), { start: hour / 2, end: 1.5 * hour });
});

test("a shallow hourly dip away from the precise low is not a resolved window", () => {
  const samples = [{ t: 0, v: 2 }, { t: hour, v: 0.99 }, { t: 2 * hour, v: 2 }];
  assert.equal(windowFromHourly(samples, 0.6 * hour), null);
  assert.equal(windowFromHourly(samples, 1.4 * hour), null);
});

test("sub-five-minute hourly dips cannot become zero-length windows", () => {
  assert.equal(windowFromHourly([
    { t: 0, v: 2 }, { t: hour, v: 0.99 }, { t: 2 * hour, v: 2 },
  ], hour), null);
});

test("hourly data must resolve a complete dip below the threshold", () => {
  assert.equal(windowFromHourly([{ t: 0, v: 2 }, { t: hour, v: 1 }, { t: 2 * hour, v: 2 }], hour), null);
  assert.equal(windowFromHourly([{ t: 0, v: 0 }, { t: hour, v: 0 }, { t: 2 * hour, v: 2 }], hour), null);
});

test("cosine interpolation retains valid subordinate-station windows", () => {
  assert.deepEqual(windowFromExtremes([
    { t: 0, v: 2, type: "H" }, { t: hour, v: 0, type: "L" }, { t: 2 * hour, v: 2, type: "H" },
  ], 1), { start: hour / 2, end: 1.5 * hour });
});

test("subordinate dips that round to zero duration are unresolved too", () => {
  assert.equal(windowFromExtremes([
    { t: 0, v: 2, type: "H" }, { t: hour, v: 0.9999, type: "L" }, { t: 2 * hour, v: 2, type: "H" },
  ], 1), null);
});
