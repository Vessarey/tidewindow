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
