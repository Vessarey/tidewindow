# Domain + Vercel migration runbook

Status: **BLOCKED on payment** — tidewindow.app purchase (approved by owner,
$9.99/yr, autorenew $15/yr) failed at Vercel checkout on 2026-07-03: "Your card
was declined. Please contact your card issuer." Owner action needed: fix the
payment method at vercel.com → team "vessarey's projects" → Settings → Billing,
then either complete the purchase (cart: tidewindow.app) or ask the agent to.

Owner decisions already made (2026-07-03): domain **tidewindow.app**; hosting
**moves to Vercel** (GitHub Pages keeps permanent redirects).

## Execute in ONE run, only after the domain shows in Vercel → Domains

1. **Vercel project**: dashboard → Add New → Project → import Vessarey/tidewindow
   (GitHub app already installed). Framework Next.js, build `npm run build`,
   output `out`. Env var: none required. Verify preview deploy works.
2. **Attach domain** tidewindow.app to the project (apex, www off or redirect).
3. **Repo flip** (single commit):
   - `next.config.ts`: remove `basePath` (keep `output: "export"`, trailingSlash).
   - `src/lib/site-config.ts`: `url: "https://tidewindow.app"`, `basePath: ""`.
   - Content links: `sed -i '' 's|](/tidewindow/|](/|g' content/articles/*.md`
   - `scripts/pipeline/run.mjs`: SITE_URL + badge links + USER_AGENT host.
   - `scripts/indexnow.mjs`: HOST=tidewindow.app, KEY_LOCATION at root.
   - `vercel.json`: add PostHog reverse proxy rewrites:
     `/ingest/static/:path*` → `https://us-assets.i.posthog.com/static/:path*`,
     `/ingest/:path*` → `https://us.i.posthog.com/:path*`; then set
     `posthogHost: "https://tidewindow.app/ingest"` in site-config (ad-block
     resistant) and `ui_host: "https://us.posthog.com"` in analytics init.
   - AGENT_PLAYBOOK.md / README.md: replace vessarey.github.io/tidewindow URLs.
4. **GitHub Pages → redirect stub**: replace deploy.yml build with a small
   script that emits, for every URL in the current sitemap, an HTML file with
   `<meta http-equiv="refresh" content="0;url=https://tidewindow.app/...">`
   + `<link rel="canonical" href="...">` + a fallback link. Deploy once; leave
   the workflow disabled after (`if: false`) so the stubs persist.
5. **Root repo** Vessarey/vessarey.github.io: update robots.txt Sitemap line to
   `https://tidewindow.app/sitemap.xml` and the index.html link.
6. **Re-verify**: robots.txt + llms.txt + sitemap at domain ROOT now; IndexNow
   submit all new URLs; PostHog events flowing via /ingest; ICS links inside
   articles/gates point at the new host.
7. JOURNAL entry + update memory + BACKLOG cleanup.

Note (deploy reliability): 2026-07-03 both Pages deploys failed transiently
("Deployment failed, try again later"); re-dispatch succeeded. After migration
Vercel handles deploys and this failure mode disappears.
