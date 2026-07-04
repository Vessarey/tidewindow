# PostHog setup

Status: **FULLY CONFIGURED** (capture live + agent personal API key saved 2026-07-03 in docs-internal/posthog-api-key.txt).

- Project: Tidewindow, id **495836**, US Cloud (us.posthog.com).
- Project token `phc_DkedwnjqYT23MHadQyjUhfQ83jhvudqujZqRG8utdui9` is wired into
  `src/lib/site-config.ts` (write-only token, safe in public code). Pageviews,
  tool events, and `newsletter_signup` (identify+capture with email) flow.
- Signup emails live in PostHog: Activity → filter event `newsletter_signup`,
  or Persons (identified by email).

## Remaining optional step (owner, ~1 min)

The daily agent can only READ analytics (top pages, referrers, conversion
trends) with a personal API key, and PostHog requires re-authentication to
create one — an owner-only action:

1. https://us.posthog.com/settings/user-api-keys → re-authenticate when asked.
2. Create key: label `tidewindow-agent`, scope **Query: Read** only.
3. Save it as line 1 of `docs-internal/posthog-api-key.txt` (gitignored),
   line 2: `495836`.

Until then the agent operates backlog-driven (its default), checking for this
file each run. Query API endpoint for the agent:
`POST https://us.posthog.com/api/projects/495836/query` with
`Authorization: Bearer <personal key>` and a HogQL body, e.g.
`{"query":{"kind":"HogQLQuery","query":"select properties.$pathname, count() from events where event='$pageview' and timestamp > now() - interval 7 day group by 1 order by 2 desc limit 20"}}`.
