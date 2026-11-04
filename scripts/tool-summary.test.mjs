// Keep short promotional copy consistent with the detailed tool explanations.
// These checks are separate from wording.test.mjs, which has owner-held edits.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const root = new URL("../", import.meta.url);
const read = (file) => fs.readFileSync(new URL(file, root), "utf8");
const normalize = (text) => text.replace(/\s+/g, " ");

test("homepage summaries do not promise an arrival rule or an available better date", () => {
  const home = normalize(read("src/app/page.tsx"));
  assert.doesNotMatch(home, /one-hour rule for when to arrive/i);
  assert.doesNotMatch(home, /line up daylight with deep water/i);
  assert.doesNotMatch(home, /show you the next date that isn/i);
  assert.match(home, /limits of a computed arrival time/i);
  assert.match(home, /nighttime lows can still appear/i);
  assert.match(home, /not a forecast of weather or beach access/i);
});

test("Trip Picker metadata and introduction qualify its ranking and fallback", () => {
  const page = normalize(read("src/app/tools/trip-picker/page.tsx"));
  const summary = page.split('<div className="mt-6">')[0];
  assert.doesNotMatch(summary, /here.s the next good date|plus the next date that is/i);
  assert.doesNotMatch(summary, /worth building the day around/i);
  assert.match(summary, /up to 21 days/i);
  assert.match(summary, /low can fall at night/i);
  assert.match(summary, /after your selected end date is shown only if one exists/i);
  assert.match(summary, /predictions do not establish beach access/i);
});

