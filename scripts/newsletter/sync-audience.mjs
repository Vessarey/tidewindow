/**
 * Sync newsletter signups from PostHog into the Resend Audience
 * "Minus Tide Alert" (BACKLOG P0 step 1).
 *
 * Consent rule (playbook section 1): the ONLY addresses that ever enter the
 * audience are ones captured as `newsletter_signup` events by the site's own
 * EmailSignup component. Nothing else is a valid source.
 *
 * Behavior:
 *   - HogQL-exports distinct signup emails (+ first source prop, first-seen
 *     timestamp) from PostHog. The PostHog project is shared across sites, so
 *     events are filtered to Tidewindow hosts.
 *   - Creates the audience via the Resend API if it does not exist yet.
 *   - Upserts additively: only emails not already in the audience are added.
 *     Existing contacts are NEVER modified — in particular an unsubscribed
 *     contact is never re-subscribed, even if a fresh signup event exists
 *     (unsubscribes win, immediately and permanently, per playbook).
 *   - Signup `source` has no Resend contact field; it stays queryable in
 *     PostHog and is printed in the summary here.
 *
 * Usage:
 *   node scripts/newsletter/sync-audience.mjs            # real sync
 *   node scripts/newsletter/sync-audience.mjs --dry-run  # read APIs, write nothing
 */
import { AUDIENCE_NAME, findAudience, hogql, listContacts, resend, resendKey, sleep } from "./lib.mjs";

const dryRun = process.argv.includes("--dry-run");

// Hosts that have ever served the signup form (github.io era ended 2026-07-03).
const HOSTS = ["thetidewindow.com", "www.thetidewindow.com", "vessarey.github.io"];

const rows = await hogql(`
  SELECT properties.email AS email,
         any(properties.source) AS source,
         min(timestamp) AS first_seen
  FROM events
  WHERE event = 'newsletter_signup'
    AND properties.email IS NOT NULL
    AND properties.email != ''
    AND properties.$host IN (${HOSTS.map((h) => `'${h}'`).join(", ")})
  GROUP BY email
  ORDER BY first_seen ASC
  LIMIT 10000
`);

// Normalize + dedupe defensively (PostHog GROUP BY is case-sensitive).
const signups = new Map();
for (const [email, source, firstSeen] of rows) {
  const norm = String(email).trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(norm)) continue;
  if (!signups.has(norm)) signups.set(norm, { source: source ?? "unknown", firstSeen });
}
console.log(`PostHog: ${rows.length} distinct signup email(s) -> ${signups.size} after normalization`);
for (const [email, meta] of signups) {
  console.log(`  ${email}  source=${meta.source}  first_seen=${meta.firstSeen}`);
}

const key = resendKey();
let audience = await findAudience(key);
if (!audience) {
  if (dryRun) {
    console.log(`[dry-run] audience "${AUDIENCE_NAME}" does not exist; would create it`);
    process.exit(0);
  }
  audience = await resend(key, "POST", "/audiences", { name: AUDIENCE_NAME });
  console.log(`Created Resend audience "${AUDIENCE_NAME}" (id ${audience.id})`);
} else {
  console.log(`Resend audience "${AUDIENCE_NAME}" exists (id ${audience.id})`);
}

const existing = await listContacts(key, audience.id);
const existingEmails = new Set(existing.map((c) => String(c.email).trim().toLowerCase()));
const unsubscribed = existing.filter((c) => c.unsubscribed).length;

let added = 0;
let skipped = 0;
for (const email of signups.keys()) {
  if (existingEmails.has(email)) {
    skipped++;
    continue;
  }
  if (dryRun) {
    console.log(`[dry-run] would add ${email}`);
    added++;
    continue;
  }
  await resend(key, "POST", `/audiences/${audience.id}/contacts`, { email, unsubscribed: false });
  added++;
  await sleep(600); // Resend rate limit is 2 req/s
}

console.log(
  `${dryRun ? "[dry-run] " : ""}Sync complete: ${added} added, ${skipped} already present, ` +
    `${existing.length + (dryRun ? 0 : added)} total contact(s) (${unsubscribed} unsubscribed — left untouched).`
);
if (signups.size === 0) {
  console.log("Zero signups so far — expected pre-organic (months 0-3). The audience stays empty and send-weekly.mjs will refuse to send.");
}
