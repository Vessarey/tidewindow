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
