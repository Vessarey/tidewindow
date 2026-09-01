/**
 * Post-build output gate (runs automatically via npm "postbuild" — locally,
 * in the daily-refresh workflow, and on Vercel; a failure blocks the deploy).
 *
 * The build succeeding is not the same as the pages being right: on
 * 2026-08-31 every published past-month page was live saying "0 low tides"
 * because the windows dataset had rolled past those months while the build
 * stayed green. This gate compares what the templates RENDERED against what
 * the committed data says, so a data/template drift can never ship silently.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(import.meta.dirname, "..");
const OUT = path.join(ROOT, "out");
const DATA = path.join(ROOT, "public", "data-json");
const PUBLISHED_MONTHS = JSON.parse(
  fs.readFileSync(path.join(ROOT, "src", "lib", "published-months.json"), "utf8")
);

const failures = [];
const fail = (msg) => failures.push(msg);

const index = JSON.parse(fs.readFileSync(path.join(DATA, "index.json"), "utf8"));
const { generatedAt, stations } = index;

const stripComments = (html) => html.replace(/<!--[\s\S]*?-->/g, "");

// ---------- 1. month pages: rendered numbers must match the data ----------

for (const s of stations) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA, "stations", `${s.slug}.json`), "utf8"));
  const currentMonth = new Intl.DateTimeFormat("en-CA", {
    timeZone: data.station.tz,
    year: "numeric",
    month: "2-digit",
  }).format(new Date(generatedAt));

  for (const month of PUBLISHED_MONTHS) {
    const page = path.join(OUT, "beaches", s.stateSlug, s.slug, month, "index.html");
    if (!fs.existsSync(page)) {
      fail(`${s.slug}/${month}: page missing from out/`);
      continue;
    }
    const html = stripComments(fs.readFileSync(page, "utf8"));

    const expectedWindows = data.windows.filter((w) => w.date.startsWith(month)).length;
    const m = html.match(/(?:gives|gave)[\s\S]{0,200}?<strong class="num">(\d+)<\/strong>/);
    if (!m) {
      fail(`${s.slug}/${month}: answer-box window count not found in rendered HTML`);
    } else if (Number(m[1]) !== expectedWindows) {
      fail(`${s.slug}/${month}: renders ${m[1]} windows but data has ${expectedWindows}`);
    }

    const expectedTides = data.tides.filter((t) => t.date.startsWith(month)).length;
    const tm = html.match(/high and low tide table \((\d+) events\)/);
    if (!tm) {
      fail(`${s.slug}/${month}: H/L tide table summary not found`);
    } else if (Number(tm[1]) !== expectedTides || expectedTides === 0) {
      fail(`${s.slug}/${month}: H/L table has ${tm[1]} events, data has ${expectedTides} (must be >0)`);
    }

    const shouldBePast = month < currentMonth;
    const hasBanner = html.includes("has ended");
    if (shouldBePast && !hasBanner) fail(`${s.slug}/${month}: past month missing archival banner`);
    if (!shouldBePast && hasBanner) fail(`${s.slug}/${month}: current/future month wrongly shows archival banner`);
  }
}

// ---------- 2. index.json summaries must be forward-looking ----------

for (const s of stations) {
  for (const w of s.best30 ?? []) {
    if (w.lowTime <= generatedAt - 86400_000) {
      fail(`index.json ${s.slug}: best30 contains a past window (${w.date})`);
    }
  }
  if (s.nextWindow && s.nextWindow.lowTime <= generatedAt - 86400_000) {
    fail(`index.json ${s.slug}: nextWindow is in the past (${s.nextWindow.date})`);
  }
}

// ---------- 3. ICS feeds must not contain retroactive events ----------

for (const s of stations) {
  const ics = fs.readFileSync(path.join(ROOT, "public", "ics", `${s.slug}.ics`), "utf8");
  for (const dtstart of ics.match(/DTSTART:(\d{8}T\d{6}Z)/g) ?? []) {
    const iso = dtstart.slice(8).replace(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z/, "$1-$2-$3T$4:$5:$6Z");
    if (Date.parse(iso) < generatedAt - 86400_000) {
      fail(`ics ${s.slug}: retroactive VEVENT at ${iso}`);
      break;
    }
  }
}

// ---------- 4. every sitemap URL must exist in out/ ----------

const sitemap = fs.readFileSync(path.join(OUT, "sitemap.xml"), "utf8");
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (locs.length < 100) fail(`sitemap has only ${locs.length} URLs (expected 100+)`);
for (const loc of locs) {
  const p = new URL(loc).pathname;
  const file = path.join(OUT, p, "index.html");
  if (!fs.existsSync(file)) fail(`sitemap URL has no built page: ${p}`);
}

// ---------- verdict ----------

if (failures.length) {
  console.error(`verify-output: ${failures.length} FAILURE(S)`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log(
  `verify-output: OK — ${stations.length} stations × ${PUBLISHED_MONTHS.length} months, ${locs.length} sitemap URLs verified`
);
