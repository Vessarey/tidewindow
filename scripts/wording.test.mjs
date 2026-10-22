// Read-only regression checks for the daylight-at-low / arrival wording class.
//
// Added 2026-10-20 after two shipped defects of the same shape:
//   - king-tides-washington-2027 described La Push's Dec 23 -1.97 ft low as
//     "at dusk" when the committed low lands 94 minutes after sunset, and
//     instructed readers to "show up when the window opens".
//   - port-orford-tide-pools-2026 called four after-dark lows "at dusk".
//
// Rule 1: no article may instruct readers when to arrive based on window
//   arithmetic ("show up when the window opens" and variants). Describing the
//   shape of the data is fine; issuing an arrival or route plan is not.
// Rule 2: a sentence that pairs a minus height with "at dusk" must name the
//   low's clock time, and some committed station window must match that time
//   and height with the sun no lower than civil twilight (-6 deg) at the low.
//   "Dusk" for a low an hour-plus after sunset is the exact defect class.

import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const ARTICLES_DIR = path.join(ROOT, "content", "articles");
const STATIONS_DIR = path.join(ROOT, "public", "data-json", "stations");

const articles = fs
  .readdirSync(ARTICLES_DIR)
  .filter((f) => f.endsWith(".md"))
  .map((f) => ({ file: f, text: fs.readFileSync(path.join(ARTICLES_DIR, f), "utf8") }));

const allWindows = fs
  .readdirSync(STATIONS_DIR)
  .filter((f) => f.endsWith(".json"))
  .flatMap(
    (f) => JSON.parse(fs.readFileSync(path.join(STATIONS_DIR, f), "utf8")).windows ?? [],
  );

const sentencesOf = (text) => text.split(/(?<=[.!?])\s+|\n/);

test("no article instructs readers to arrive when a window opens", () => {
  for (const { file, text } of articles) {
    assert.ok(
      !/show up when the window/i.test(text),
      `${file}: contains a "show up when the window opens"-class arrival instruction. ` +
        `Describe where the daylight sits in the window instead of telling readers when to arrive.`,
    );
  }
});

test("a minus height paired with 'at dusk' matches a committed low inside civil twilight", () => {
  for (const { file, text } of articles) {
    for (const sentence of sentencesOf(text)) {
      if (!/\bat dusk\b/i.test(sentence)) continue;
      const heights = [...sentence.matchAll(/[−-](\d+\.\d+)\s?ft/g)].map((m) => -Number(m[1]));
      if (heights.length === 0) continue;
      const times = [...sentence.matchAll(/(\d{1,2}:\d{2})\s?([AP]M)/g)].map(
        (m) => `${m[1]} ${m[2]}`,
      );
      assert.ok(
        times.length > 0,
        `${file}: "at dusk" beside a minus height needs the low's clock time so the claim ` +
          `is checkable against committed windows. Sentence: ${sentence.trim().slice(0, 160)}`,
      );
      const supported = heights.some((h) =>
        times.some((t) =>
          allWindows.some(
            (w) =>
              w.lowTimeLocal === t &&
              Math.abs(w.lowHeight - h) < 0.015 &&
              typeof w.sunAltAtLow === "number" &&
              w.sunAltAtLow >= -6,
          ),
        ),
      );
      assert.ok(
        supported,
        `${file}: claims a minus low happens "at dusk" but no committed window matches that ` +
          `time and height with the sun at or above civil twilight (-6 deg) at the low. ` +
          `If the low lands after dark, say "after sunset" and where the daylight sits in ` +
          `the window. Sentence: ${sentence.trim().slice(0, 160)}`,
      );
    }
  }
});

test("tide-table worked example separates the model from arrival and access", () => {
  const { text } = articles.find(({ file }) => file === "how-to-read-a-tide-table.md");
  for (const phrase of [
    "used the window best",
    "following the water out",
    "walking back in with the flood",
    "Walkable window",
    "bottomed out mid-morning",
    "Every input is either a NOAA harmonic prediction",
  ]) {
    assert.ok(!text.includes(phrase), `Tide-table guide restores unsupported wording: ${phrase}`);
  }
  assert.match(text, /not a verified arrival time/i);
  assert.match(text, /below \+1\.0 ft/);
  assert.match(text, /weekend\/holiday/);
  assert.match(text, /regional seasonal comfort/);
});

test("tide-table example explains its before-sunrise offset using Newport data", () => {
  const { text } = articles.find(({ file }) => file === "how-to-read-a-tide-table.md");
  const { windows } = JSON.parse(fs.readFileSync(path.join(STATIONS_DIR, "newport-or.json"), "utf8"));
  const example = windows.find((w) => w.date === "2026-08-12" && w.lowTimeLocal === "6:46 AM");
  assert.ok(example, "The historical Newport worked example must remain available.");
  assert.ok(example.arriveBy < example.sunrise, "The example's offset precedes sunrise.");
  assert.ok(text.includes(example.arriveByLocal), "Explain the model's actual one-hour offset.");
  assert.ok(text.includes(example.sunriseLocal), "Show the example's actual sunrise.");
  assert.match(text, /before sunrise/);
});

test("sneaker-wave guide does not turn tide offsets into a safety plan", () => {
  const { text } = articles.find(({ file }) => file === "what-is-a-sneaker-wave.md");
  for (const pattern of [
    /ocean-watching already built in/i,
    /fits inside that hour with room to spare/i,
    /before you commit to the rocks/i,
    /the next morning this matters/i,
    /20 or more seconds apart/i,
    /414 daylight minus tides|115 (?:of|bottom out)/i,
  ]) {
    assert.doesNotMatch(text, pattern, "Do not restore unsupported safety or expired timing claims.");
  }
  assert.match(text, /does not forecast sneaker waves/i);
  assert.match(text, /not a verified arrival time/i);
  assert.match(text, /historical example/i);
  assert.match(text, /not.*(?:probability|frequency).*sneaker waves/i);
});

test("sneaker-wave historical table and scoped histogram match committed data", () => {
  const { text } = articles.find(({ file }) => file === "what-is-a-sneaker-wave.md");
  const facts = JSON.parse(fs.readFileSync(path.join(ROOT, "docs-internal/facts/global.json"), "utf8"));
  assert.equal(facts.range_2026.start_date, "2026-07-01");
  assert.equal(facts.range_2026.end_date, "2026-12-31");
  assert.match(text, /July 1–December 31, 2026/);
  assert.match(text, /at least 30 minutes of daylight overlap/);
  const hours = facts.hour_histogram_2026_daylight_minus.west;
  const morning = hours["5 AM"] + hours["6 AM"] + hours["7 AM"];
  const evening = hours["4 PM"] + hours["5 PM"] + hours["6 PM"];
  assert.ok(text.includes(`${facts.coasts.west.daylight_minus_tides_2026} minus tides`));
  assert.ok(text.includes(`**${morning}** lows`));
  assert.ok(text.includes(`**${evening}** lows`));
  for (const slug of ["la-push-wa", "garibaldi-or", "newport-or", "charleston-or", "port-orford-or"]) {
    const { station, windows } = JSON.parse(fs.readFileSync(path.join(STATIONS_DIR, `${slug}.json`), "utf8"));
    const example = windows.find((w) => w.date === "2026-08-12" && w.lowHeight < 0);
    assert.ok(example, `${slug}: historical example remains available`);
    const row = text.split("\n").find((line) => line.startsWith("|") && line.includes(station.noaaId));
    assert.ok(row, `${slug}: preserve the historical table row`);
    for (const value of [
      `−${Math.abs(example.lowHeight).toFixed(2)}`,
      example.lowTimeLocal,
      example.sunriseLocal,
      `${example.score} (${example.band})`,
    ]) assert.ok(row.includes(value), `${slug}: row must show ${value}`);
    assert.ok(example.arriveBy < example.sunrise, `${slug}: the one-hour offset precedes sunrise`);
  }
  assert.match(text, /5:46 AM.*before.*6:15 AM sunrise/);
  assert.match(text, /6:19 AM low.*before.*6:21 AM sunrise/);
});
