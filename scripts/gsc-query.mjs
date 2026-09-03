/**
 * Google Search Console reader for the daily agent. Zero dependencies:
 * signs a service-account JWT with node:crypto, exchanges it for an access
 * token, and queries the Search Analytics API for sc-domain:thetidewindow.com.
 *
 * Credential: docs-internal/gsc-service-account.json (gitignored).
 *
 * Usage:
 *   node scripts/gsc-query.mjs sites                 # verify property access
 *   node scripts/gsc-query.mjs queries [days=28]     # top queries w/ position
 *   node scripts/gsc-query.mjs pages [days=28]       # top pages
 *   node scripts/gsc-query.mjs flywheel [days=28]    # queries at positions 8-20
 *   node scripts/gsc-query.mjs dates [days=28]       # daily clicks/impr/pos trend
 *   node scripts/gsc-query.mjs inspect [n=40]        # coverage state of n sitemap URLs (URL Inspection API)
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const ROOT = path.join(import.meta.dirname, "..");
const CREDS = JSON.parse(fs.readFileSync(path.join(ROOT, "docs-internal", "gsc-service-account.json"), "utf8"));
const PROPERTY = "sc-domain:thetidewindow.com";
const SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";

function b64url(input) {
  return Buffer.from(input).toString("base64url");
}

async function getAccessToken() {
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = b64url(
    JSON.stringify({
      iss: CREDS.client_email,
      scope: SCOPE,
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    })
  );
  const signature = crypto.sign("RSA-SHA256", Buffer.from(`${header}.${claims}`), CREDS.private_key).toString("base64url");
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${header}.${claims}.${signature}`,
    }),
  });
  const data = await res.json();
  if (!data.access_token) throw new Error("token exchange failed: " + JSON.stringify(data));
  return data.access_token;
}

async function api(token, url, body) {
  const res = await fetch(url, {
    method: body ? "POST" : "GET",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`GSC API ${res.status}: ${JSON.stringify(data)}`);
  return data;
}

function dateStr(daysAgo) {
  return new Date(Date.now() - daysAgo * 86400_000).toISOString().slice(0, 10);
}

const [cmd = "sites", daysArg] = process.argv.slice(2);
const days = Number(daysArg) || 28;
const token = await getAccessToken();

if (cmd === "inspect") {
  // Indexing-health read (playbook §2a′). The Page-indexing report has no API,
  // but the URL Inspection API returns each URL's coverage state; sample the
  // live sitemap evenly (quota: 2,000 inspections/day) and tabulate. Added
  // 2026-09-02 after the audit found 50 sitemap URLs Google had never fetched.
  const n = Number(daysArg) || 40;
  const xml = await (await fetch("https://thetidewindow.com/sitemap.xml")).text();
  const all = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const step = Math.max(1, Math.floor(all.length / n));
  const sample = all.filter((_, i) => i % step === 0).slice(0, n);
  const rows = [];
  for (const url of sample) {
    const data = await api(token, "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect", {
      inspectionUrl: url,
      siteUrl: PROPERTY,
    });
    const r = data.inspectionResult?.indexStatusResult ?? {};
    rows.push({
      url: url.replace("https://thetidewindow.com", ""),
      state: r.coverageState ?? "?",
      crawled: r.lastCrawlTime ? r.lastCrawlTime.slice(0, 10) : "never",
    });
  }
  const tally = {};
  for (const r of rows) tally[r.state] = (tally[r.state] ?? 0) + 1;
  console.log(`Sampled ${rows.length} of ${all.length} sitemap URLs:`);
  for (const [state, count] of Object.entries(tally).sort((a, b) => b[1] - a[1])) console.log(`  ${String(count).padStart(3)}  ${state}`);
  console.log("");
  for (const r of rows.sort((a, b) => a.state.localeCompare(b.state))) {
    console.log(`${r.state.padEnd(42)} ${r.crawled.padEnd(10)} ${r.url}`);
  }
} else if (cmd === "sites") {
  const data = await api(token, "https://www.googleapis.com/webmasters/v3/sites");
  console.log(JSON.stringify(data, null, 2));
} else {
  const dimension = cmd === "dates" ? "date" : cmd === "pages" ? "page" : "query";
  const body = {
    startDate: dateStr(days + 2),
    endDate: dateStr(2), // GSC data lags ~2 days
    dimensions: [dimension],
    rowLimit: 100,
  };
  const data = await api(
    token,
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(PROPERTY)}/searchAnalytics/query`,
    body
  );
  let rows = data.rows ?? [];
  if (cmd === "flywheel") {
    rows = rows.filter((r) => r.position >= 8 && r.position <= 20).sort((a, b) => b.impressions - a.impressions);
  }
  if (!rows.length) {
    console.log(`No ${cmd} rows for the last ${days} days (normal for a new site — GSC data lags and accumulates slowly).`);
  } else {
    for (const r of cmd === "dates" ? rows : rows.slice(0, 40)) {
      console.log(
        `${r.keys[0]}  clicks=${r.clicks} impressions=${r.impressions} ctr=${(r.ctr * 100).toFixed(1)}% pos=${r.position.toFixed(1)}`
      );
    }
  }
}
