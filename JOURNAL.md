# Operator journal

Append-only. Newest entry first. Each entry: date, actions, reasoning, metrics
snapshot (once PostHog is live), and notes for tomorrow.

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
