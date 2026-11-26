import assert from "node:assert/strict";
import { test } from "node:test";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import vm from "node:vm";
import { spawnSync } from "node:child_process";
import { accessClosure, visitWindows } from "../src/lib/access.mjs";
import { buildIcs } from "./pipeline/visit-exports.mjs";
import { liveWindows, liveNow, synthesis } from "../src/lib/format.ts";
const read = (f) => fs.readFileSync(new URL(`../${f}`, import.meta.url), "utf8");
const data = JSON.parse(read("public/data-json/stations/san-diego-ca.json"));
const slug = data.station.slug;
const closed = ["2026-11-26", "2026-12-25"];
const open = ["2026-11-25", "2026-11-27", "2026-12-24", "2026-12-26"];

test("NPS closures use the station-local Thanksgiving/Christmas date, not other holidays or stations", () => {
  for (const date of closed) assert.match(accessClosure(slug, date), /closed.*no public access/);
  for (const date of [...open, "2026-11-11", "2026-01-01"]) assert.equal(accessClosure(slug, date), null);
  assert.match(accessClosure(slug, "2027-11-25"), /Thanksgiving/);
  assert.equal(accessClosure(slug, "2027-11-26"), null);
  for (const date of closed) assert.equal(accessClosure("la-jolla-ca", date), null);
});

test("real holiday tide heights/scores remain intact; both nearby open days remain selectable", () => {
  const before = JSON.stringify(data);
  const eligible = visitWindows(slug, data.windows);
  for (const date of closed) {
    assert.ok(data.windows.some((w) => w.date === date), `predictions retained: ${date}`);
    assert.ok(!eligible.some((w) => w.date === date));
  }
  for (const date of open) {
    const w = data.windows.find((w) => w.date === date);
    assert.ok(w, date); assert.ok(eligible.includes(w), date);
  }
  assert.equal(JSON.stringify(data), before);
});

for (const holiday of closed) {
  test(`actual Trip Picker excludes ${holiday}, retaining the open day before and after`, () => {
    const picker = read("src/app/tools/trip-picker/picker.tsx");
    const selection = picker.slice(picker.indexOf("  let ranked:"), picker.indexOf("  useEffect("))
      .replace("let ranked: TideWindow[]", "let ranked");
    const d = new Date(holiday + "T12:00:00Z");
    const from = new Date(+d - 86400000).toISOString().slice(0,10);
    const to = new Date(+d + 86400000).toISOString().slice(0,10);
    // The picker drops windows with lowTime <= generatedAt; pin the stamp to
    // the trip's eve so the assertion holds after the holiday itself passes.
    const pinned = { ...data, generatedAt: Date.parse(from + "T00:00:00Z") - 86400000 };
    const result = vm.runInNewContext(`(() => { ${selection}; return ranked; })()`, { data: pinned, from, to, visitWindows });
    assert.ok(result.length); assert.ok(!result.some((w) => w.date === holiday));
    assert.ok(result.some((w) => w.date === from)); assert.ok(result.some((w) => w.date === to));
    const single = vm.runInNewContext(`(() => { ${selection}; return ranked; })()`, { data: pinned, from: holiday, to: holiday, visitWindows });
    assert.equal(single.length, 0);
  });
  test(`actual Finder excludes ${holiday} at all depth filters`, () => {
    const source = read("src/app/tools/tide-window-finder/finder.tsx");
    const selection = source.slice(source.indexOf("  const results = data"), source.indexOf("  const bestScore"));
    const now = Date.parse(holiday + "T00:00:00Z") - 2 * 86400000;
    for (const depth of ["any", "minus", "deep"]) {
      const results = vm.runInNewContext(`(() => { ${selection}; return results; })()`, { data, now, depth, liveWindows, visitWindows });
      assert.ok(!results.some((w) => w.date === holiday));
    }
  });
}

test("Finder synthesis cannot promote a holiday even if all candidate windows are closed", () => {
  const windows = data.windows.filter((w) => closed.includes(w.date));
  assert.match(synthesis({ ...data, windows }, 90, data.generatedAt), /No visit-eligible lows/);
});

test("calendar feed drops both closed dates and preserves nearby eligible open days", () => {
  const ics = buildIcs(data.station, data.windows, data.generatedAt);
  for (const date of closed) assert.ok(!ics.includes(`san-diego-ca-${date.replaceAll("-", "")}-`));
  for (const date of open) {
    const good = data.windows.filter((w) => w.date === date && w.score >= 60 && w.windowEnd >= data.generatedAt);
    for (const w of good) assert.ok(ics.includes(`san-diego-ca-${w.date.replaceAll("-", "")}-`));
  }
});

for (const date of closed) {
  test(`actual newsletter dry-run excludes closed ${date} and still renders an open alternative`, () => {
    const temp = fs.mkdtempSync(path.join(os.tmpdir(), "cabrillo-newsletter-"));
    try {
      for (const dir of ["scripts/newsletter", "src/lib", "public/data-json/stations"]) fs.mkdirSync(path.join(temp, dir), { recursive: true });
      for (const name of ["scripts/newsletter/send-weekly.mjs", "scripts/newsletter/lib.mjs", "src/lib/access.mjs"]) fs.writeFileSync(path.join(temp,name), read(name));
      const w = data.windows.find((w) => w.date === date);
      const next = new Date(Date.parse(date + "T12:00:00Z") + 86400000).toISOString().slice(0,10);
      const fixture = { ...data, species: [], windows: [{ ...w, date, score: 99, band: "Exceptional", night: false }, { ...w, date: next, weekday: "Open", score: 80, band: "Great", night: false }] };
      fs.writeFileSync(path.join(temp, "public/data-json/index.json"), JSON.stringify({ stations: [data.station] }));
      fs.writeFileSync(path.join(temp, `public/data-json/stations/${slug}.json`), JSON.stringify(fixture));
      fs.writeFileSync(path.join(temp, "no-network.cjs"), 'globalThis.fetch = () => { throw Error("Network forbidden in newsletter test"); };');
      const run = spawnSync(process.execPath,["--require",path.join(temp,"no-network.cjs"),"scripts/newsletter/send-weekly.mjs","--dry-run",`--start=${date}`],{ cwd:temp,encoding:"utf8",env:{...process.env,NODE_OPTIONS:""} });
      assert.equal(run.status,0,run.stdout+run.stderr);
      const txt = fs.readFileSync(path.join(temp,`docs-internal/newsletter-drafts/${date}-minus-tide-alert.txt`),"utf8");
      assert.ok(!txt.includes("score 99")); assert.ok(txt.includes("score 80"));
    } finally { fs.rmSync(temp,{recursive:true,force:true}); }
  });
}

test("actual golden-hour suggestions exclude both closed dates", () => {
  const source = read("src/app/tools/golden-hour/golden.tsx");
  const selection = source.slice(source.indexOf("  const results = data"), source.indexOf("  return ("));
  const results = vm.runInNewContext(`(() => { ${selection}; return results; })()`, { data, clock:data.generatedAt, liveNow, visitWindows });
  assert.ok(results.length);
  for (const date of closed) assert.ok(!results.some((w) => w.date === date));
});
