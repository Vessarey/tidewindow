# Operator journal

Append-only. Newest entry first. Each entry: date, actions, reasoning, metrics
snapshot (once PostHog is live), and notes for tomorrow.

---

## 2026-07-04 (b) — Time-sensitive: coast-wide minus-tide run (P1 roundup launched)

**Health (green).** "Daily data refresh" cron ran success at 11:47 UTC today
(run 28705224661); no open issues. The two red runs in the list are legacy
"Pages redirect stubs" from the pre-Vercel github.io era — not the live path.

**Metrics.** PostHog query API works; last 7 days on project 495836 shows
essentially zero Tidewindow traffic (0 `$pageview`, 1 `$pageleave`; the 2
`pb_waitlist_signup` events are PointsBrain sharing the project). Expected for
day 2 — the strategy brief predicts near-zero organic for months 0–3, so no
metrics signal to steer by yet. `newsletter_signup` count is 0, so P0 newsletter
go-live stays blocked: an empty Resend Audience can't be sent to, and the honesty
invariant forbids implying a list exists. Deferred until real signups appear.

**Primary action — priority (b), time-sensitive content.** Fact sheets flag an
Exceptional (90+) run *within 14 days*: Jul 11–12 score a flat 100 in Puget
Sound, and on **Mon Jul 13 six of seven Pacific NW stations post Exceptional
daylight windows on the same day** (Seattle −3.68 ft → −3.80 ft Jul 14, the
year's lowest daylight tide; PT −3.48 ft; La Push/Garibaldi/Newport/Charleston
all 90; Port Orford 88). California lags ~2 days (pre-dawn lows until the 14th).
Wrote the inaugural P1 weekly regional roundup around this:
`content/articles/west-coast-minus-tides-july-11-14-2026.md` (category
regional-calendars). Distinct from the existing Puget calendar — its angle is the
coast-wide simultaneity, not an annual list — and links to it rather than
duplicating.

**Gates.** `npm run build` green, zero warnings; an automated recompute-check
asserted all 21 published tuples against `docs-internal/facts/*.json` (ALL
VERIFIED); NPS tidepooling safety quotes web-verified at write time
(point-reyes-tidepooling.htm); internal links validated against routes + guide
slugs; article in sitemap. Reverted the `public/data-json` + `public/ics` files
that my local build's NOAA pipeline regenerated — that data is the cron's job
(§1), so the commit is the article only.

**Note on "surface it on the state hub" (§2b).** The `/beaches/[state]` hub is
fully data-driven and already auto-lists the Jul 11–13 windows by score; there's
no featured-article slot in the current design. Adding one is a product change
(logged to BACKLOG P2), not a daily-run task — discoverability for the roundup
rides on the guides index (date-sorted, so it's on top), category page, RSS, and
in-article links for now.

**Velocity.** 1 editorial piece today; this is the first daily-cadence article
since the 20-piece launch batch (07-02/03), so well within ≤5/week.

**Tomorrow:** watch the run land — refresh this roundup's `updated:` only if a
number materially shifts; otherwise pick the next P1 station guide (Monterey or
Port Townsend). Re-check `newsletter_signup` count; the moment real signups
appear, P0 newsletter go-live jumps the queue.

---

## 2026-07-03 (b) — Fixed the refresh→deploy pipeline; verified P0 health

**Health check first.** "Daily data refresh" had zero runs — it silently skipped
its first scheduled 10:17 UTC window (a well-known GitHub quirk for newly-added
scheduled workflows; also delayed/dropped under load). YAML cron `17 10 * * *` is
correct. Dispatched it manually: green in 1m42s. **IndexNow: "submitted 83 URLs —
HTTP 200"** (P0 ✔). No open issues.

**Primary action — fixed two real defects in the refresh→deploy path:**

1. **Refreshed data never deployed.** The refresh job commits fresh NOAA data with
   the default `GITHUB_TOKEN`; GitHub deliberately suppresses push-triggered
   workflows for `GITHUB_TOKEN` pushes (recursion guard), so the Deploy workflow
   never fired for bot commits. Evidence: deploys ran only for Vanessa's pushes
   (81c8397, c7ac2fe); bot commit 50235ae triggered none. Left unfixed, every daily
   refresh would accumulate fresh numbers in the repo that never reach the live
   site. Fix: added a `workflow_run` trigger to `deploy.yml` (immune to the token
   restriction) that deploys on successful refresh completion, guarded by
   `conclusion == 'success'`. **Verified end-to-end:** dispatched a refresh → it
   committed a0a0f32 → a `workflow_run` deploy fired and went green.

2. **Any NOAA blip fails the deploy.** `.pipeline-stamp` is gitignored, so every
   fresh CI checkout re-runs the full pipeline against live NOAA (the deploy's
   `prebuild`). NOAA's datagetter intermittently returns HTTP 200 with a body of
   `{error: "No Predictions data was found..."}` for a valid station/datum;
   `fetchJson` only retries hard HTTP errors, so this soft error threw unretried.
   It really bit today: a Port Townsend (9444900) blip failed the deploy of my own
   fix commit (4d07f04) at 12:09:58 UTC — even though refresh runs 4 min either side
   succeeded. Fix: retry the soft error up to 4× with backoff in `fetchPredictions`.
   Verified with a forced `PIPELINE_REFRESH=1` run (all 12 stations, incl. 9444900)
   and a green deploy of 790451c.

**Quality gates:** `npm run build` green locally (0 new warnings); discarded the
data-json/ics/badge files my local pipeline run regenerated (Action-owned — never
hand-committed); diffs limited to `deploy.yml` and `run.mjs`. Live site verified:
homepage renders current windows, automation disclosure intact, `/data-json/
index.json` valid.

**Velocity:** 0 editorial pieces (20 added this week already — over the ≤5/week cap;
infra/health day, correctly no new article).

**Metrics:** none — PostHog still NOT_CONFIGURED (`posthogKey` empty, no API-key
file). Operating on backlog order.

**Notes for tomorrow:** (1) Confirm the *scheduled* (not dispatched) refresh fired
at 10:17 UTC and that its `workflow_run` deploy went green on its own — that closes
out the cron-reliability question. (2) If both are green and velocity allows, start
P1: weekly regional roundup (pick the region with the highest upcoming windows) or
the Monterey/Pacific Grove station guide. (3) Non-blocking backlog: bump Actions off
Node-20; consider deploying from committed data instead of re-fetching NOAA.

---

## 2026-07-04 (cont.) — GSC API access for the agent

**Done:** Owner enabled Google account MFA (Cloud Console prerequisite). Created
GCP project `tidewindow-agent`, enabled Search Console API, service account
gsc-reader@tidewindow-agent.iam.gserviceaccount.com with JSON key (gitignored at
docs-internal/gsc-service-account.json, chmod 600), added as Full user on the
sc-domain:thetidewindow.com property. New zero-dependency reader:
scripts/gsc-query.mjs (sites|queries|pages|flywheel). Verified live: property
lists with siteFullUser; analytics queries execute (0 rows — site is a day old).

**Effect:** the GSC flywheel (§2c) is now fully unlocked — check
`gsc-query.mjs flywheel 28` weekly; act when rows appear.

---

## 2026-07-04 — Google Search Console live

**Done:** GSC domain property for thetidewindow.com verified via DNS TXT (added
to Vercel DNS), sitemap.xml submitted (Google read it within a minute — it
already lists the sitemap as the homepage's discovery source), homepage added to
the priority crawl queue via URL Inspection → Request Indexing.

**Note:** No GSC API credential exists — indexing/queries flywheel uses Bing
site: checks + PostHog referrers until a service account is added (optional
owner step). Watch GSC → Pages report over the coming weeks via the owner.

**Next:** newsletter go-live (BACKLOG P0) remains the top action.

---

## 2026-07-03 (night) — Full metrics + email stack unlocked

**Done:** Owner provided (a) PostHog personal API key (all-access) — saved to
gitignored docs-internal/posthog-api-key.txt, query API verified working; the
operator now runs metrics-driven per playbook §1; (b) Resend API key — saved to
gitignored docs-internal/resend-api-key.txt. Resend sending domain
updates.thetidewindow.com: DKIM/SPF verified (sending READY). The Receiving MX
record was missing from Vercel DNS (the integration only adds sending records) —
added it (updates → MX 10 inbound-smtp.us-east-1.amazonaws.com) plus optional
DMARC (_dmarc.updates, p=none); both resolve at the authoritative NS; Resend
shows Receiving "pending" until its next re-check.

**Next (priority):** BACKLOG P0 newsletter go-live — audience sync from PostHog,
weekly digest Broadcast, then flip signup copy to live. This outranks new
articles: the list is the asset.

---

## 2026-07-03 (evening) — Migrated to thetidewindow.com on Vercel

**Done:** Owner purchased thetidewindow.com ($11.25/yr, renews Jul 3 2027, chosen
over tidewindow.app after the .app card decline surfaced better .com options).
Executed docs-internal/domain-migration.md end to end: basePath removed, all
internal links root-relative, Vercel project imported from GitHub (deploys on
every push), domain attached (apex canonical), PostHog proxied first-party via
/ingest rewrites (verified flowing), robots/sitemap/llms.txt now at domain root,
IndexNow resubmitted (83 URLs, HTTP 202), old vessarey.github.io/tidewindow URLs
serve redirect stubs (meta-refresh + canonical + JS catch-all; "Pages redirect
stubs" workflow is dispatch-only now). Fixed badge embed URLs to trailing-slash
form (Vercel serves public .html extensionless).

**Watch:** Vercel build runs the NOAA pipeline on every deploy (stamp is
gitignored) — if NOAA flakes during a deploy, the soft-error retry covers it.
Daily flow is now: 10:17 UTC Actions cron refreshes data + pushes → Vercel
auto-deploys; 8 AM local operator does editorial.

**Tomorrow:** normal queue (P1 weekly regional roundup). Consider BACKLOG P2
"build from committed data" to take NOAA out of the deploy path entirely.

---

## 2026-07-03 (afternoon) — PostHog live; domain purchase blocked on card

**Done:** PostHog project created by owner (id 495836, US Cloud) — project token
wired into site-config (defaults 2026-05-30, person_profiles identified_only);
analytics + newsletter_signup capture now LIVE on the github.io site. Owner
approved buying tidewindow.app ($9.99) and migrating hosting to Vercel; checkout
failed: card declined (owner must fix billing at Vercel). Full migration runbook
written to docs-internal/domain-migration.md — execute when the domain appears.
Re-dispatched the failed Pages deploy — succeeded (failures were transient).

**Pending owner:** fix Vercel payment method; optional PostHog personal API key
(docs-internal/posthog-setup.md) for agent metrics reads.

**Tomorrow:** check whether tidewindow.app appears in Vercel domains → if yes,
execute domain-migration.md as the day's primary action. Otherwise continue P1.

---

## 2026-07-03 — Launch content batch

**Done:** All 20 launch articles live (write -> adversarial fact-check -> fix
pipeline; every tide number traced to docs-internal/facts/, external claims
web-verified with sources, internal links validated against routes). Sitemap now
83 URLs. Resubmitted to IndexNow.

**Notes:** First workflow run hit the session usage cap mid-verification; resumed
after reset with cached writes — only verify/fix re-ran. Pillar Point article is
dated 2026-07-03 (its data stamp) — correct behavior. NOAA station pages render
client-side, so automated source-checks of tidesandcurrents.noaa.gov see a shell;
the URLs are canonical and correct.

**Tomorrow:** BACKLOG P0 — confirm daily-refresh cron ran green at 10:17 UTC and
IndexNow succeeded in its logs; then start the weekly regional roundup (P1).

---

## 2026-07-02 — Launch

**Done:** Full launch build. NOAA pipeline (12 stations: 3 WA, 4 OR, 4 CA, 1 ME;
hourly interpolation for harmonic stations, cosine for Pillar Point; scores per
/methodology/), 4 tools (finder, trip picker, year heatmap, golden hour), 20
fact-checked launch articles, monthly calendar pages for 2026-07 and 2026-08
(staged programmatic rollout, batch 1 = 24 pages), king-tides 2026-27 page,
Daylight Minus-Tide Index dataset + CSV, ICS feeds per station, embed badges,
llms.txt, RSS, sitemap, JSON-LD (WebSite, Dataset, Article, FAQPage, Breadcrumb,
WebApplication), IndexNow key + submit script, daily data-refresh GitHub Action
(10:17 UTC), deploy-on-push GitHub Action.

**Deliberate choices:** GitHub Pages over Vercel (only authenticated channel;
static export; migration path documented). PostHog wired but env-gated — no key
yet; signups meanwhile land in localStorage + are no-ops in analytics. Newsletter
copy says "starting this season" because sending isn't wired (no Resend key) —
honesty invariant.

**Metrics:** n/a (analytics not yet enabled; expect months 0–3 near-zero organic
per strategy brief — do NOT panic-pivot).

**Tomorrow:** verify deploy + IndexNow green (BACKLOG P0), then start P1 content
queue with the weekly regional roundup.
