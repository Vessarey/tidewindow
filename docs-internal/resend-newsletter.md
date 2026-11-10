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

### Active Nov 12 accuracy hold — recorded Nov 10

Do not send the Nov 12 issue with the known-inaccurate Trip Picker sentence
in `scripts/newsletter/send-weekly.mjs`. The standing template approval in
AGENT_PLAYBOOK §6 does not waive its accuracy gates or authorize a replacement.
The Nov 10 morning journal instruction to send unchanged is superseded.

The exact bounded proposal remains unapproved:

> Planning a trip? The Trip Picker ranks modeled low-tide windows for your
> chosen dates (up to 21 days); nighttime lows can appear.

Preserve the existing Trip Picker link and all other established-template
content. Release this hold only after explicit owner approval is recorded,
the bounded change and its regression check are implemented, and an isolated
preview is rendered and recomputed against current facts. If these gates are
not complete on Nov 12, skip the issue and journal the reason. Do not silently
remove the sentence, substitute new copy, resend an old issue, or send a
correction broadcast. This documentation does not create a code-enforced
lock or grant permission to send.

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
