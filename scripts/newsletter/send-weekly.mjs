/**
 * Compose (and, when explicitly told to, send) the weekly Minus Tide Alert
 * digest (BACKLOG P0 step 2).
 *
 * Every number comes from public/data-json (the committed NOAA pipeline
 * output) — nothing is written from memory. The digest covers the 7 days
 * starting at --start (default: today, machine-local) and lists each
 * station's best Good-or-better (score >= 60) daylight window, grouped by
 * region, plus species recently logged near the week's best station.
 *
 * SAFETY MODEL — three independent gates before any real email leaves:
 *   1. Sending requires the explicit --send flag. Default and --dry-run
 *      never touch the Resend send path.
 *   2. --send refuses to run against an empty audience (a list of zero
 *      subscribers means there is no one who consented — nothing to send).
 *   3. FIRST-SEND GATE: per JOURNAL 2026-07-05, the first real issue's copy
 *      must be reviewed by the owner before sending. --send therefore also
 *      requires --owner-reviewed, which may only be passed once that review
 *      is recorded in JOURNAL.md.
 * Unsubscribes are handled by Resend Broadcasts automatically via the
 * {{{RESEND_UNSUBSCRIBE_URL}}} placeholder in the footer.
 *
 * Usage:
 *   node scripts/newsletter/send-weekly.mjs --dry-run [--start=YYYY-MM-DD]
 *       Renders the issue to docs-internal/newsletter-drafts/ (HTML + text).
 *       Makes NO network calls of any kind.
 *   node scripts/newsletter/send-weekly.mjs --send --owner-reviewed
 *       Creates a Resend Broadcast to the "Minus Tide Alert" audience from
 *       alerts@updates.thetidewindow.com and sends it.
 */
import fs from "node:fs";
import path from "node:path";
import { AUDIENCE_NAME, FROM, ROOT, findAudience, listContacts, resend, resendKey } from "./lib.mjs";

// ---------------------------------------------------------------- arguments

const args = process.argv.slice(2);
const has = (f) => args.includes(f);
const opt = (name) => {
  const hit = args.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : undefined;
};

const dryRun = has("--dry-run");
const doSend = has("--send");
const ownerReviewed = has("--owner-reviewed");

if (dryRun && doSend) {
  console.error("Pick one of --dry-run or --send, not both.");
  process.exit(1);
}
if (!dryRun && !doSend) {
  console.error("Refusing to do anything without an explicit mode.");
  console.error("  --dry-run             render this week's issue to docs-internal/newsletter-drafts/ (no network)");
  console.error("  --send                create + send the Resend Broadcast (requires a non-empty audience");
  console.error("                        AND --owner-reviewed; see the first-send gate in this file's header)");
  console.error("  --start=YYYY-MM-DD    override the 7-day range start (default today)");
  process.exit(1);
}

const start = opt("start") ?? new Date().toLocaleDateString("en-CA");
if (!/^\d{4}-\d{2}-\d{2}$/.test(start)) {
  console.error(`--start must be YYYY-MM-DD (got "${start}")`);
  process.exit(1);
}

// ------------------------------------------------------------ date helpers

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function addDays(dateStr, n) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
}
function fmtDay(dateStr) {
  const [, m, d] = dateStr.split("-").map(Number);
  return `${MONTHS[m - 1]} ${d}`;
}
const end = addDays(start, 6);
const rangeLabel = `${fmtDay(start)} - ${fmtDay(end)}, ${start.slice(0, 4)}`;

// ------------------------------------------------------------- select data

const DATA = path.join(ROOT, "public", "data-json");
const index = JSON.parse(fs.readFileSync(path.join(DATA, "index.json"), "utf8"));

const GOOD = 60; // score band threshold: Good or better (see /methodology/)

const REGIONS = [
  ["puget-sound", "Puget Sound"],
  ["outer-coast-nw", "Washington and Oregon outer coast"],
  ["central-ca", "Central California"],
  ["socal", "Southern California"],
  ["new-england", "New England"],
];

const byScore = (a, b) => b.score - a.score || a.lowHeight - b.lowHeight || a.date.localeCompare(b.date);

const stations = index.stations.map((meta) => {
  const file = JSON.parse(fs.readFileSync(path.join(DATA, "stations", `${meta.slug}.json`), "utf8"));
  const inRange = file.windows.filter((w) => w.date >= start && w.date <= end && !w.night);
  const good = [...inRange].sort(byScore).filter((w) => w.score >= GOOD);
  return { meta, species: file.species ?? [], inRange, good, best: good[0] ?? null };
});

const withWindows = stations.filter((s) => s.best);
const bestOverall = [...withWindows].sort((a, b) => byScore(a.best, b.best))[0] ?? null;
const allGood = withWindows.flatMap((s) => s.good);
const nExceptional = allGood.filter((w) => w.band === "Exceptional").length;
const nGreat = allGood.filter((w) => w.band === "Great").length;

// Fallback for a genuinely quiet week: still name the least-bad window.
const fallback = !bestOverall
  ? stations
      .filter((s) => s.inRange.length)
      .map((s) => ({ s, w: [...s.inRange].sort(byScore)[0] }))
      .sort((a, b) => byScore(a.w, b.w))[0] ?? null
  : null;

// --------------------------------------------------------------- rendering

const esc = (t) => String(t).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const ft = (h) => {
  const r = h.toFixed(2);
  return r === "-0.00" ? "0.00" : r; // no negative zero
};
const ftHtml = (h) => `${ft(h).replace("-", "&#8722;")} ft`;
const ftText = (h) => `${ft(h)} ft`;
const stationUrl = (m) => `https://thetidewindow.com/beaches/${m.stateSlug}/${m.slug}/`;

function windowLineHtml(w) {
  return `${esc(w.weekday)} ${esc(fmtDay(w.date))}: <strong>${ftHtml(w.lowHeight)}</strong> at ${esc(w.lowTimeLocal)}, walkable ${esc(w.windowStartLocal)}&#8211;${esc(w.windowEndLocal)} &#183; score ${w.score}/100 (${esc(w.band)})`;
}
function windowLineText(w) {
  return `${w.weekday} ${fmtDay(w.date)}: ${ftText(w.lowHeight)} at ${w.lowTimeLocal}, walkable ${w.windowStartLocal}-${w.windowEndLocal}, score ${w.score}/100 (${w.band})`;
}

const subject = bestOverall
  ? `Minus Tide Alert, ${fmtDay(start)}-${fmtDay(end)}: ${bestOverall.meta.officialName} hits ${bestOverall.best.lowHeight.toFixed(2)} ft ${bestOverall.best.weekday}`
  : `Minus Tide Alert, ${fmtDay(start)}-${fmtDay(end)}: a quiet week on the coast`;

const muted = "color:#5c6f76;font-size:13px;line-height:1.5;";
const htmlParts = [];
htmlParts.push(`<div style="max-width:600px;margin:0 auto;padding:24px 16px;font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1d2f36;">`);
htmlParts.push(`<p style="margin:0;letter-spacing:0.08em;text-transform:uppercase;${muted}">Tidewindow &#183; The Minus Tide Alert</p>`);
htmlParts.push(`<h1 style="margin:6px 0 2px;font-size:22px;">Daylight windows for ${esc(rangeLabel)}</h1>`);

if (bestOverall) {
  htmlParts.push(
    `<p style="font-size:15px;line-height:1.6;">Best window this week: <a href="${stationUrl(bestOverall.meta)}" style="color:#0b5568;"><strong>${esc(bestOverall.meta.name)}</strong></a> &#8212; ${windowLineHtml(bestOverall.best)}. Arrive by ${esc(bestOverall.best.arriveByLocal)} to walk out on a falling tide.</p>`
  );
  htmlParts.push(
    `<p style="${muted}">${nExceptional} Exceptional and ${nGreat} Great daylight windows across ${withWindows.length} of ${stations.length} stations this week. Scores per <a href="https://thetidewindow.com/methodology/" style="color:#0b5568;">the methodology</a>.</p>`
  );
} else if (fallback) {
  htmlParts.push(
    `<p style="font-size:15px;line-height:1.6;">A quiet week: no station posts a Good-or-better daylight window. The least-bad option is <a href="${stationUrl(fallback.s.meta)}" style="color:#0b5568;"><strong>${esc(fallback.s.meta.name)}</strong></a> &#8212; ${windowLineHtml(fallback.w)}. Better runs are always visible in the <a href="https://thetidewindow.com/tools/year-heatmap/" style="color:#0b5568;">year heatmap</a>.</p>`
  );
}

const quiet = [];
for (const [regionId, regionName] of REGIONS) {
  const regionStations = withWindows.filter((s) => s.meta.region === regionId);
  if (!regionStations.length) {
    quiet.push(regionName);
    continue;
  }
  htmlParts.push(`<h2 style="margin:22px 0 4px;font-size:16px;border-bottom:1px solid #d8e2e5;padding-bottom:4px;">${esc(regionName)}</h2>`);
  for (const s of regionStations.sort((a, b) => byScore(a.best, b.best))) {
    const extra = s.good.slice(1).sort((a, b) => a.date.localeCompare(b.date));
    const extraNote = extra.length
      ? ` <span style="${muted}">Also ${extra.map((w) => `${esc(w.weekday)} ${esc(fmtDay(w.date))} (${ftHtml(w.lowHeight)}, ${w.score})`).join(", ")}.</span>`
      : "";
    htmlParts.push(
      `<p style="margin:10px 0;font-size:14px;line-height:1.6;"><a href="${stationUrl(s.meta)}" style="color:#0b5568;"><strong>${esc(s.meta.name)}</strong></a><br>${windowLineHtml(s.best)}.${extraNote}</p>`
    );
  }
}
if (quiet.length) {
  htmlParts.push(`<p style="${muted}">Nothing Good-or-better this week in ${esc(quiet.join(", "))}.</p>`);
}

// Heading says "near", not "in the pools": the 5 km iNat radius can include
// shoreline uplands, and terrestrial species occasionally appear (BACKLOG P2
// taxa-filter item). Claiming pool residency for those would be a wrong claim.
if (bestOverall && bestOverall.species.length) {
  const top = bestOverall.species.slice(0, 3);
  htmlParts.push(`<h2 style="margin:22px 0 4px;font-size:16px;border-bottom:1px solid #d8e2e5;padding-bottom:4px;">Recently logged near ${esc(bestOverall.meta.officialName)}</h2>`);
  htmlParts.push(
    `<p style="margin:10px 0;font-size:14px;line-height:1.6;">${top.map((sp) => `${esc(sp.commonName)} <em>(${esc(sp.scientificName)}, ${sp.count} obs.)</em>`).join(" &#183; ")}</p>`
  );
  htmlParts.push(`<p style="${muted}">Research-grade iNaturalist observations within 5 km of the station, last 60 days. Via iNaturalist, CC BY-NC, &#169; contributors.</p>`);
}

htmlParts.push(
  `<p style="margin:18px 0;font-size:14px;line-height:1.6;">Planning further out? The <a href="https://thetidewindow.com/tools/trip-picker/" style="color:#0b5568;">trip picker</a> ranks every daylight window at your station for the rest of the year.</p>`
);
htmlParts.push(
  `<p style="${muted}">Times are NOAA astronomical predictions, not observations &#8212; wind, swell, and pressure routinely shift actual water levels by half a foot or more. Predictions apply exactly at each station; nearby beaches can differ.</p>`
);
htmlParts.push(
  `<p style="${muted}">You are getting this because you signed up at <a href="https://thetidewindow.com/newsletter/" style="color:#0b5568;">thetidewindow.com</a>. One issue a week, plus rare king-tide alerts. Tidewindow is an automated publication &#8212; every number above is computed from NOAA CO-OPS data (<a href="https://thetidewindow.com/methodology/" style="color:#0b5568;">methodology</a>).<br><a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="color:#0b5568;">Unsubscribe</a> &#8212; one click, effective immediately.</p>`
);
htmlParts.push(`</div>`);
const html = htmlParts.join("\n");

const textParts = [];
textParts.push(`TIDEWINDOW - THE MINUS TIDE ALERT`);
textParts.push(`Daylight windows for ${rangeLabel}`);
textParts.push(``);
if (bestOverall) {
  textParts.push(`Best window this week: ${bestOverall.meta.name}`);
  textParts.push(`  ${windowLineText(bestOverall.best)}`);
  textParts.push(`  Arrive by ${bestOverall.best.arriveByLocal}. ${stationUrl(bestOverall.meta)}`);
  textParts.push(``);
  textParts.push(`${nExceptional} Exceptional and ${nGreat} Great daylight windows across ${withWindows.length} of ${stations.length} stations this week.`);
} else if (fallback) {
  textParts.push(`A quiet week: no station posts a Good-or-better daylight window.`);
  textParts.push(`Least-bad option: ${fallback.s.meta.name} - ${windowLineText(fallback.w)}`);
}
for (const [regionId, regionName] of REGIONS) {
  const regionStations = withWindows.filter((s) => s.meta.region === regionId);
  if (!regionStations.length) continue;
  textParts.push(``);
  textParts.push(`${regionName.toUpperCase()}`);
  for (const s of regionStations.sort((a, b) => byScore(a.best, b.best))) {
    textParts.push(`  ${s.meta.name} - ${windowLineText(s.best)}`);
    for (const w of s.good.slice(1).sort((a, b) => a.date.localeCompare(b.date))) {
      textParts.push(`    also ${w.weekday} ${fmtDay(w.date)}: ${ftText(w.lowHeight)}, score ${w.score}`);
    }
    textParts.push(`    ${stationUrl(s.meta)}`);
  }
}
if (quiet.length) {
  textParts.push(``);
  textParts.push(`Nothing Good-or-better this week in ${quiet.join(", ")}.`);
}
if (bestOverall && bestOverall.species.length) {
  textParts.push(``);
  textParts.push(`RECENTLY LOGGED NEAR ${bestOverall.meta.officialName.toUpperCase()}`);
  for (const sp of bestOverall.species.slice(0, 3)) {
    textParts.push(`  ${sp.commonName} (${sp.scientificName}), ${sp.count} obs.`);
  }
  textParts.push(`  Research-grade iNaturalist observations within 5 km of the station, last 60 days. CC BY-NC, (c) contributors.`);
}
textParts.push(``);
textParts.push(`Times are NOAA astronomical predictions, not observations - wind, swell, and`);
textParts.push(`pressure routinely shift actual water levels by half a foot or more.`);
textParts.push(``);
textParts.push(`You signed up at https://thetidewindow.com/newsletter/ - one issue a week.`);
textParts.push(`Unsubscribe (one click, immediate): {{{RESEND_UNSUBSCRIBE_URL}}}`);
const text = textParts.join("\n");

// ------------------------------------------------------------------ output

console.log(`Issue range: ${rangeLabel}`);
console.log(`Subject:     ${subject}`);
console.log(`Windows:     ${allGood.length} Good-or-better across ${withWindows.length} station(s)`);

if (dryRun) {
  const outDir = path.join(ROOT, "docs-internal", "newsletter-drafts");
  fs.mkdirSync(outDir, { recursive: true });
  const base = path.join(outDir, `${start}-minus-tide-alert`);
  // Neutralize the Resend placeholder so the preview renders as a plain page.
  fs.writeFileSync(`${base}.html`, `<!-- DRY RUN ${new Date().toISOString()} - subject: ${subject} -->\n` + html.replace("{{{RESEND_UNSUBSCRIBE_URL}}}", "#unsubscribe-preview"));
  fs.writeFileSync(`${base}.txt`, `Subject: ${subject}\n\n` + text.replace("{{{RESEND_UNSUBSCRIBE_URL}}}", "(unsubscribe link inserted by Resend)"));
  console.log(`Dry run: rendered, nothing sent. Files:`);
  console.log(`  ${base}.html`);
  console.log(`  ${base}.txt`);
  process.exit(0);
}

// --send path from here on.
console.log("");
console.log("FIRST-SEND GATE (JOURNAL 2026-07-05): the first real issue is additionally");
console.log("gated on owner review of the rendered copy. Do not pass --owner-reviewed");
console.log("until that review is recorded in JOURNAL.md. After the first issue this");
console.log("flag simply confirms a human-approved template is in use.");
if (!ownerReviewed) {
  console.error("Aborting: --send requires --owner-reviewed (see gate above). Nothing was sent.");
  process.exit(1);
}

const key = resendKey();
const audience = await findAudience(key);
if (!audience) {
  console.error(`Aborting: Resend audience "${AUDIENCE_NAME}" does not exist. Run sync-audience.mjs first. Nothing was sent.`);
  process.exit(1);
}
const contacts = await listContacts(key, audience.id);
const subscribed = contacts.filter((c) => !c.unsubscribed);
if (subscribed.length === 0) {
  console.error(`Aborting: audience "${AUDIENCE_NAME}" has ${contacts.length} contact(s), 0 subscribed. Nothing was sent.`);
  console.error("An empty list means no one has consented yet - wait for real newsletter_signup events.");
  process.exit(1);
}

console.log(`Audience "${AUDIENCE_NAME}": ${subscribed.length} subscribed contact(s). Creating broadcast...`);
const broadcast = await resend(key, "POST", "/broadcasts", {
  audience_id: audience.id,
  from: FROM,
  subject,
  html,
  text,
  name: `Minus Tide Alert ${start}`,
});
await resend(key, "POST", `/broadcasts/${broadcast.id}/send`, {});
console.log(`Broadcast ${broadcast.id} sent to ${subscribed.length} subscriber(s).`);
console.log("Watch bounce/complaint rates in Resend; stop sends if complaints near 0.1% (playbook section 1).");
