# Resend newsletter records

Operational facts for the Minus Tide Alert pipeline. API keys live in the
gitignored files listed in AGENT_PLAYBOOK.md section 1; nothing here is secret.

## Audience

- Name: `Minus Tide Alert` (the only list we ever send to)
- Resend audience id: `ff50e851-e711-4ad6-b861-5774682c8d5a`
- Created via API 2026-07-05 by `scripts/newsletter/sync-audience.mjs` (empty at
  creation — zero `newsletter_signup` events existed; expected pre-organic).
- Consent rule: contacts enter ONLY via sync-audience.mjs, which reads
  `newsletter_signup` events from PostHog (filtered to Tidewindow hosts, since
  the project is shared). Unsubscribed contacts are never modified or re-added.

## Sending domain: updates.thetidewindow.com

- Domain id: `b06d98e7-4963-4e74-9cf3-7f73823194e2`
- Status checked 2026-07-05 via `GET /domains/{id}`: **verified**, all records
  verified — DKIM TXT, SPF MX + TXT (send.updates), and **Receiving MX
  (verified — it was "pending" when added to Vercel DNS 2026-07-03; closed
  BACKLOG item)**.
- From identity: `Tidewindow <alerts@updates.thetidewindow.com>`

## Weekly send runbook (once real signups exist)

### Nov 12 correction published; November 19 issue gates remain

The owner approved the bounded Trip Picker wording correction on Nov 12.
Source commit `62b365e`, published through `0ef1e56`, implements exactly:

> Planning a trip? The Trip Picker ranks modeled low-tide windows for your
> chosen dates (up to 21 days); nighttime lows can appear.

The Trip Picker link, other HTML paragraphs, plaintext, audience, consent,
suppression, schedule and send gates are unchanged. Actual picker-code tests
confirm an inclusive 21-day cap and possible nighttime selection. A credential-free,
network-blocked dry-run passed. A representative Nov 19–25 preview was rendered
from Nov 12 committed data and its 21 qualifying windows / six stations were
recomputed against the fact sheets. This is a readiness example, not a final
Nov 19 issue approval. All five unit suites, lint, typecheck and the 16 checks
including owner-held wording tests passed.

**Publication resolved Nov 12 after direct owner approval of repository main
and its normal automatic deployment.** The normal push advanced remote main
from `d1c496f` to `0ef1e56`. Exact-SHA Vercel commit status succeeded at
21:18:08 UTC; Production deployment `7749922796` succeeded at 21:18:09 UTC.
The prior publication denials remain historical records, not an active hold.
Only the corrected paragraph, regression tests and related handoff records
were published; no owner-held drafts or data changes were included. The
push/build workflow invokes no newsletter sender and performs no backfill.
GitHub reports no required branch-status checks configured and no check runs
for this revision; Vercel is the observed push-triggered build status.
**Nov 12 health follow-up:** the aggregate site build is now verified in an
isolated archive of local `f45b0b2`, using the ordinary `npm run build` in the
current environment, locked Next 16.4.4 and committed Nov 12 predictions.
TypeScript, 93 tests and output verification (12 stations × 6 months,
149 sitemap URLs) pass. This supersedes only the earlier font-fetch /
Turbopack build blocker; no code or permissions were changed. The newsletter's
local HTML visual review remains unverified after the earlier `file:` URL
policy denial; that access was not retried or routed around. Site browser
health checks are not a newsletter-preview review. Evidence is recorded
in the Nov 12 JOURNAL entries; source publication is now verified as above.

**Nov 12 stays SKIPPED; no backfill, resend, test email or new send is authorized
by this correction.** Wording approval, source publication, normal deployment
and aggregate-build checks are resolved. Newsletter visual review and every
issue-specific gate remain separate. The next regular
send is Thursday Nov 19 under the existing operator ritual, with no newly
established clock time or sender activation. Before that issue, confirm the
corrected revision is in the operator's source, refresh its data, render the
actual week, recompute it against current fact sheets, review the complete
preview, and perform the existing consent/suppression and adverse-event gates.
This record changes no sending code lock and does not itself grant a send.

Rollback: revert source commit `62b365e` if needed and reinstate the documented
accuracy hold before any future send; do not restore the old sentence to a sent
issue. The source patch has no data migrations or campaign side effects.

1. `node scripts/newsletter/sync-audience.mjs` — pull new signups into the
   audience. Zero-event runs are safe and idempotent.
2. `node scripts/newsletter/send-weekly.mjs --dry-run` — render the issue to
   `docs-internal/newsletter-drafts/` and read it end to end (quality gates in
   AGENT_PLAYBOOK.md section 4 apply to the digest too).
3. First issue only: owner must review the rendered copy (JOURNAL 2026-07-05);
   record the approval in JOURNAL.md before proceeding.
4. `node scripts/newsletter/send-weekly.mjs --send --owner-reviewed` — creates
   and sends the Resend Broadcast (unsubscribe handled by Resend via the
   `{{{RESEND_UNSUBSCRIBE_URL}}}` footer link). Refuses to run if the audience
   has zero subscribed contacts.
5. After the first real send: flip signup copy site-wide from "starting this
   season" / "Launching for this season" to live (EmailSignup call sites +
   /newsletter/ page), per BACKLOG P0 step 3.
6. Send day: Thursday. Watch bounce/complaint rates in Resend; stop sends if
   complaint rate nears 0.1%.

## Read-only delivery checks

Verified 2026-11-07 through the connected Resend tools. A failed or missing
per-broadcast events endpoint does not establish zero adverse events, and
does not make the previous day's counts the newest available evidence.

1. Resolve the exact sent broadcast ID from the journal and read it with
   `get-broadcast`. Confirm status and sent time; status `sent` alone does
   not prove delivery or zero complaints.
2. Use `list-broadcast-recipients` for that same ID, separately for `sent`,
   `delivered`, `bounced`, `complained`, and `suppressed`. Set `limit: 100`
   and follow returned pagination cursors when more rows exist. These are
   recipient lists for each event type; do not add sent and delivered
   together, or count a suppressed contact as a delivery or a bounce.
3. Record the check date, broadcast ID, aggregate recipient counts and any
   unavailable event types in JOURNAL. Keep recipient addresses and contact
   IDs out of repository records. A successful empty bounced/complained
   response means no recorded recipients of that type at check time;
   a failed request means unavailable, not zero.
4. If the connector is unavailable, inspect the existing broadcast's
   Resend dashboard when accessible; otherwise retain a dated last-known
   result and mark the new check unavailable. Do not invent API routes,
   retry a send, sync the audience, or change suppression to obtain metrics.

Nov 7 verification: broadcast `07bf317d-b839-4aac-9d62-246d4c24b51f` remains
sent at 2026-11-05 13:07:16Z; **30 sent, 30 delivered, 1 suppressed, no
recorded bounced or complained recipients**. These are dated observations,
not a guarantee against later adverse events. This procedure adds no send
or template approval; the existing playbook and owner gates still apply.
