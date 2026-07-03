# PostHog setup — the one optional manual step

Status: **NOT CONFIGURED** (the daily agent checks this file every run).

Analytics is fully wired into the site but dormant until a key exists. To turn it
on (~3 minutes, free tier is plenty):

1. Create a free account at https://us.posthog.com/signup (US Cloud).
2. Create a project (name: Tidewindow). Copy the **Project API key** (`phc_...`)
   from Settings → Project.
3. Paste it into `src/lib/site-config.ts` → `posthogKey: "phc_..."` (this key is
   publishable — safe to commit), commit and push. Pageviews, tool events, and
   `newsletter_signup` (with email) start flowing immediately.
4. Optional but recommended, so the daily agent can READ analytics: create a
   **Personal API key** (Settings → Personal API keys, scope: Query read) and save
   it as a single line in `docs-internal/posthog-api-key.txt` (gitignored), plus
   the numeric project id on line 2.
5. Update this file's Status line to CONFIGURED. The daily agent does the rest
   (verifies events, starts metric-driven decisions, exports signup emails).

Nothing else on the site depends on this — it runs fine without analytics; the
agent just operates on backlog-order instead of metrics until then.
