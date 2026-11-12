// Keep short promotional copy consistent with the detailed tool explanations.
// These checks are separate from wording.test.mjs, which has owner-held edits.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import vm from "node:vm";
import { spawnSync } from "node:child_process";

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

test("Trip Picker's actual selection caps inclusive ranges at 21 days and can rank a nighttime low first", () => {
  const picker = read("src/app/tools/trip-picker/picker.tsx");
  const selection = picker.slice(picker.indexOf("  let ranked:"), picker.indexOf("  useEffect("))
    .replace("let ranked: TideWindow[]", "let ranked");
  assert.ok(selection.includes("Range capped at 21 days."), "Locate the actual picker selection, not a test reimplementation.");
  const from = "2026-11-19";
  const windows = [
    { date: from, lowTime: "2026-11-19T22:00:00Z", score: 90, night: true },
    { date: "2026-12-09", lowTime: "2026-12-09T12:00:00Z", score: 70, night: false },
    { date: "2026-12-10", lowTime: "2026-12-10T12:00:00Z", score: 100, night: false },
  ];
  const result = vm.runInNewContext(`(() => { ${selection}; return { ranked, clampedNote }; })()`, {
    from, to: "2026-12-19", data: { generatedAt: "2026-11-12T00:00:00Z", windows },
  });
  assert.equal(result.ranked.length, 2);
  assert.equal(result.ranked[0].night, true);
  assert.equal(result.ranked[1].date, "2026-12-09");
  assert.equal(result.clampedNote, "Range capped at 21 days.");
});

test("newsletter dry-run renders the approved Trip Picker sentence without credentials or network", () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), "tide-newsletter-copy-"));
  try {
    for (const dir of ["scripts/newsletter", "public/data-json/stations"]) fs.mkdirSync(path.join(temp, dir), { recursive: true });
    for (const file of ["send-weekly.mjs", "lib.mjs"]) {
      fs.copyFileSync(new URL(`scripts/newsletter/${file}`, root), path.join(temp, "scripts/newsletter", file));
    }
    const index = JSON.parse(read("public/data-json/index.json"));
    fs.writeFileSync(path.join(temp, "public/data-json/index.json"), JSON.stringify(index));
    for (const { slug } of index.stations) {
      fs.copyFileSync(new URL(`public/data-json/stations/${slug}.json`, root), path.join(temp, `public/data-json/stations/${slug}.json`));
    }
    const guard = path.join(temp, "no-network.cjs");
    fs.writeFileSync(guard, 'globalThis.fetch = () => { throw new Error("Newsletter preview must not access the network"); };');
    const run = spawnSync(process.execPath, ["--require", guard, "scripts/newsletter/send-weekly.mjs", "--dry-run", "--start=2026-11-19"], {
      cwd: temp, encoding: "utf8", env: { ...process.env, NODE_OPTIONS: "" },
    });
    assert.equal(run.status, 0, run.stdout + run.stderr);
    assert.match(run.stdout, /Dry run: rendered, nothing sent/);
    const html = fs.readFileSync(path.join(temp, "docs-internal/newsletter-drafts/2026-11-19-minus-tide-alert.html"), "utf8");
    const visible = html.replace(/<[^>]+>/g, "");
    assert.match(visible, /Planning a trip\? The Trip Picker ranks modeled low-tide windows for your chosen dates \(up to 21 days\); nighttime lows can appear\./);
    assert.doesNotMatch(visible, /ranks every daylight window|for the rest of the year/i);
    assert.match(html, /href="https:\/\/thetidewindow\.com\/tools\/trip-picker\/"/);
    assert.match(html, /href="#unsubscribe-preview"/);
    const noMode = spawnSync(process.execPath, ["--require", guard, "scripts/newsletter/send-weekly.mjs"], { cwd: temp, encoding: "utf8" });
    assert.equal(noMode.status, 1);
    assert.match(noMode.stderr, /Refusing to do anything without an explicit mode/);
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
});

