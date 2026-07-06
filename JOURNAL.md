# Operator journal

Append-only. Newest entry first. Each entry: date, actions, reasoning, metrics
snapshot (once PostHog is live), and notes for tomorrow.

---

## 2026-07-06 — P0 closed: $pageview capture fixed (soft-nav pageviews now land)

**Health first:** Daily data refresh cron green (07-05 11:49Z success, 07-04
green before it). No open GitHub issues. Build green.

**Primary action (priority a — the top P0 unblocker that blinds all metrics).**
Fixed the remaining half of the 2026-07-05 pageview incident. The /ingest proxy
outage was already fixed (commit 2159b6e); this was the second, independent bug.

- **Root cause**, confirmed by reading posthog-js 1.396.5 source, not guessed:
  the SDK's History API monitor — the thing that emits a `$pageview` on client-
  side (pushState) navigation — has `get isEnabled(){return "history_change" ===
  config.capture_pageview}`. With our `capture_pageview: true` that monitor was
  disabled entirely. On a Next.js `output:"export"` site, internal `<Link>`
  clicks are soft pushState navigations, so only hard page loads recorded a
  `$pageview` and every in-site route change recorded nothing — exactly the
  "client-side route change → zero capture requests" symptom logged yesterday.
  (The load-time initial pageview fires on any truthy value via a separate path,
  so hard loads were unaffected; the `defaults:"2026-05-30"` preset in fact
  resolves `capture_pageview` to `"history_change"` on its own — we were
  overriding it back to `true`.)
- **Fix (commit 1e88dbc):** `capture_pageview: true` → `"history_change"` in
  src/components/analytics.tsx, with an explanatory comment. One-line behavioral
  change; keeps the initial pageview, adds soft-nav pageviews. No double-count
  (the history monitor captures nothing on init).
- **Quality gates:** `npm run build` green. The prebuild re-fetched NOAA and
  churned public/data-json + public/ics (12 stations) — reverted those before
  commit per the "cron owns the data files" rule; the diff is analytics.tsx only.
  Confirmed `capture_pageview:"history_change"` (and no residual
  `capture_pageview:!0`) in the built bundle, then polled the live site until the
  deployed chunk served it.

**Verified end-to-end (live):** connected to the local browser, loaded
thetidewindow.com (transport healthy — /s/ and /i/v0/e/ POSTs return 200), then
did a real `history.pushState` soft-nav to /guides/ then /tools/. A `/i/v0/e/`
capture POST fired (200), and a PostHog query confirmed **both `$pageview` events
landed** (path=/guides/ and /tools/, ~08:14 ET) within seconds. With the old
`true` value a pushState produced zero capture requests, so this is a clean
before/after. Those two are test pageviews — filter them from today's metrics.

**Metrics snapshot (last 7d, host=thetidewindow.com):** $pageview 4 (pre-fix,
all hard loads) + 2 test, $pageleave 5, $autocapture 1, plus 2 legacy
$diagnostic_fetch_probe. Real organic still ~zero (expected months 0–3; do not
panic-pivot) — but from now on soft navigations count, so the pageview number
will finally reflect actual browsing depth. newsletter_signup still 0 (newsletter
go-live stays blocked on first real signup + owner copy review).

**Tomorrow:** trust the pageview number now — check the pageview:pageleave ratio
and per-path distribution for the first real sessions. Then resume the P1 content
queue (next: Port Townsend / Fort Worden station guide, or the weekly regional
roundup refresh which also reuses the featuredRoundup slot). Newsletter P0
re-check: is newsletter_signup > 0 yet?

## 2026-07-05 (P0 incident) — PostHog capture was fully dark since domain migration

**Trigger:** owner asked for real-session metrics. Splitting the shared PostHog
project (495836) by `$host` revealed thetidewindow.com had **zero** events all
time (one stray legacy github.io $pageleave aside), while pointsbrain.com — same
project — flowed normally. That's an outage, not just pre-organic quiet.

**Root cause (confirmed via live browser smoke test):** the first-party
`/ingest` reverse proxy never worked for ingestion under `output:"export"` +
`trailingSlash:true`. Vercel serves the static 404.html for the extensionless
PostHog endpoints, so every capture POST 404'd; only the `.js` asset GETs
(`/ingest/array/{key}/config.js`, `/ingest/static/*`) proxied. So posthog-js
loaded and looked healthy (this is why the 07-03 "verified flowing" note was a
false positive — it only confirmed config.js loaded, not that events ingested).
Measured matrix: GET/POST `/ingest/e/`, `/ingest/i/v0/e/`, `/ingest/flags`,
`/ingest/decide/` → 404 site HTML; GET `…/config.js` → 200 proxied.

**Fix shipped (commit 2159b6e):** `posthogHost` `/ingest` → `https://us.i.posthog.com`
in src/lib/site-config.ts (posts direct to Cloud; us-assets host derived
automatically). Deployed via Vercel.

**Verified post-deploy:** live bundle now uses us.i.posthog.com; assets load
from us-assets (200); cross-origin fetch POST to `/i/v0/e/` and `/e/` return 200
(CORS ok); **thetidewindow.com $pageleave events now land in PostHog** (they did
not before — transport restored). Two `$diagnostic_fetch_probe` events were sent
during testing (clearly named; filter them out of metrics).

**SECOND issue found, still OPEN (see BACKLOG P0):** even with transport fixed,
`$pageview` events specifically are NOT captured — 0 pageviews all-time for
thetidewindow.com, vs 16 for pointsbrain. Instrumented the live page (fetch +
sendBeacon patched, confirmed alive), did a client-side route change, waited 5s
past the flush interval → posthog-js made ZERO capture requests. Not CORS (POST
200), not the proxy (fixed), not bot-blocking (`navigator.webdriver` false, normal
UA). Localized to client `capture_pageview` behavior in analytics.tsx (likely the
`capture_pageview: true` + `defaults: "2026-05-30"` interaction in posthog-js
1.396.5). Custom tool events and pageleave work; only pageview is affected.
Did NOT blind-ship a second guess — needs a verified fix (try
`capture_pageview: "history_change"`, sanity-check the `defaults` preset value,
or bump posthog-js).

**Note:** this is thetidewindow-specific; pointsbrain.com analytics are healthy
(pageviews + waitlist signups flowing). PointsBrain does not use the /ingest
proxy pattern.

**Tomorrow / next:** land the $pageview fix (BACKLOG P0) and re-verify a live
pageview reaches PostHog before trusting any Tidewindow traffic metric.

---

## 2026-07-05 (third run) — State-hub roundup slot; terrestrial species filter

**Why a third run:** two scoped, time-boxed items — one with a hard July 11
deadline (surface the West Coast roundup on the state hubs before the event),
one a brand-integrity bug (land animals in tide-pool species tables). Both are
priority-(a)-class: a time-sensitive surfacing gap and a wrong-content defect.

**Task 1 — featured-roundup slot on /beaches/[state] (deadline Jul 11).**
The hub was fully data-driven with no article slot, so the Jul 11-14 roundup
only rode the guides index + internal links (logged 2026-07-04). Added an
opt-in, data-driven slot:

- New optional article frontmatter `featuredRoundup: { states, event, until,
  teaser }` and `getActiveRoundup(stateSlug, today)` in src/lib/content.ts. A
  roundup surfaces only while it targets the state AND `until` >= the build
  date; articles are date-sorted so the newest qualifying one wins.
- The West Coast roundup declares `states: [wa, or, ca]`, `until: 2026-07-14`.
- The hub renders a kelp-accented `.roundup-card` (new globals.css class,
  built only from existing theme tokens — foam-deep/sand/kelp/ink, display +
  mono type) directly under the computed answer-box. Distinct from the
  gold-accented answer-box on purpose so it reads as editorial, not as the
  computed number. Typography only, no emoji.
- Graceful expiry: because the site rebuilds daily, the slot disappears on the
  first rebuild after 2026-07-14 with no code change. Verified it shows on the
  wa/or/ca built hubs and is absent from me (no covered stations there).

**Task 2 — terrestrial species leaking into tide-pool tables.** The iNat
`species_counts` call filters to four iconic taxa (Mollusca, Echinodermata,
Cnidaria, Arthropoda), but a 5 km coastal radius plus those broad phyla let
land snails/slugs and terrestrial arthropods through — the render literally
showed Garden Snail (Cornu aspersum) at Seattle, Pacific Banana Slug at Port
Townsend, Milk/Brown-lipped Snails farther south.

- Extracted the iNat logic into scripts/pipeline/species.mjs (imported by
  run.mjs; run.mjs self-executes on import so it could not be reused directly).
  Added a `TERRESTRIAL_CLADE_IDS` ancestor-id blocklist and `isTerrestrialTaxon`
  — a taxon is dropped if its `ancestor_ids` (or own id) hits Stylommatophora
  (land snails/slugs, 47485), Insecta (47158), Arachnida (47119), Myriapoda
  (144128), Entognatha/Collembola (243773/49470), or Oniscidea (woodlice,
  84718; land Crustacea that read as marine). Ids verified against the iNat
  taxa API. Over-fetches per_page=30 then filters to top 10 so tables stay full.
- Marine slug clades are deliberately NOT blocked (Sacoglossa, nudibranchs,
  Systellommatophora incl. intertidal Onchidiidae), so real sea slugs survive.
- Regenerated species with scripts/pipeline/refresh-species.mjs, which reads
  each station's stored lat/lng and rewrites ONLY the `species` field — no NOAA
  refetch, no window/curve/timestamp churn (the daily cron owns that). 11 of 12
  stations changed; verified programmatically that the diff is species-only.

**Verification.** `npm run build` green, zero warnings introduced; prebuild
pipeline skipped (data 15h old) so the build ran against the patched data.
Garden Snail gone from the built Seattle page (grep count 0); spot-checked
La Jolla — Hopkins' Rose Nudibranch (Ceratodoris rosacea) is correctly kept as
marine (it only dropped in ranking as iNat's 60-day counts shifted, not from
the filter). Removed set across stations was exclusively land snails/slugs and
woodlice. `npm run lint` still reports only the one pre-existing
set-state-in-effect error in tools-shared.tsx (BACKLOG P2) — none added.
No emails sent, nothing purchased, no accounts created.

**Tomorrow:** the roundup slot expires itself after Jul 14; the Thursday weekly
roundup refresh (next region) should set `featuredRoundup` on its own article
to reuse the slot. Newsletter go-live (P0) still pending owner review + first
real signup. The species filter is a blocklist — if a new terrestrial clade
ever surfaces, add its iNat id to TERRESTRIAL_CLADE_IDS in species.mjs.

---

## 2026-07-05 (P0, second run) — Newsletter pipeline built; MX verified

**Why a second run today:** declared P0 — build the newsletter code NOW so that
the day real signups exist, sending is a one-command action instead of a
build-from-scratch scramble.

**Done:**

1. **scripts/newsletter/sync-audience.mjs** (+ shared lib.mjs, zero deps like
   gsc-query.mjs): HogQL-exports distinct `newsletter_signup` emails (+ source
   prop, first-seen) from PostHog — filtered to Tidewindow hosts because
   project 495836 is shared across sites — and upserts them additively into
   the Resend Audience "Minus Tide Alert", creating it via API if absent.
   Unsubscribed or existing contacts are never modified (unsubscribes win,
   permanently). Ran it for real: 0 signup events (expected), audience created
   empty, id ff50e851-e711-4ad6-b861-5774682c8d5a.
2. **scripts/newsletter/send-weekly.mjs**: composes the weekly Minus Tide
   Alert from public/data-json only — per region, each station's best
   Good-or-better (score ≥60) daylight window for the 7 days from --start
   (default today), extra Good+ days, iNat species near the week's best
   station, prediction-not-observation disclaimer, automation disclosure, and
   Resend's unsubscribe placeholder. Three independent gates before anything
   sends: explicit --send flag (default and --dry-run never touch the send
   path), non-empty audience (refuses at 0 subscribed), and --owner-reviewed
   (first-send gate: this flag may only be passed once owner copy review is
   recorded here — printed by the script itself).
3. **Dry-ran everything against the live APIs, sent nothing:** sync (real,
   zero events); send --dry-run → sample issue committed at
   docs-internal/newsletter-drafts/2026-07-05-minus-tide-alert.{html,txt}
   (subject: "Minus Tide Alert, Jul 5-Jul 11: Port Townsend hits -2.36 ft
   Sat"); send --send without --owner-reviewed → aborts; --send
   --owner-reviewed → aborts on empty audience. Quiet-week fallback exercised
   with --start=2026-10-05 (renders "least-bad option" copy; test files not
   committed). Recompute-checked rendered numbers against
   public/data-json/stations/ (PT −2.361/7:58 AM/100, Garibaldi set) — match.
4. **Receiving MX is now VERIFIED**: GET /domains/b06d98e7-… shows
   updates.thetidewindow.com fully verified (DKIM, SPF MX+TXT, Receiving MX).
   Closed the BACKLOG item; records + send runbook written to
   docs-internal/resend-newsletter.md.

**Copy honesty choices:** species section says "Recently logged near
{station}", not "in the pools" — the 5 km iNat radius pulls in terrestrial
strays (today's render literally surfaced Pacific Banana Slug at Port
Townsend; the P2 taxa-filter item stands). Negative-zero heights render as
0.00. Digest includes the predictions-not-observations disclaimer and the
automation disclosure, mirroring /methodology/.

**Side-fix:** removed the party-popper emoji from the EmailSignup success
message (studio no-emoji rule; it was UI-facing).

**Gates:** `npm run build` green, zero warnings introduced; diff reviewed (no
data-json churn — pipeline stamp was fresh from today's cron). `npm run lint`
reports ONE pre-existing error (react-hooks/set-state-in-effect in
src/components/tools-shared.tsx:25) — verified present on clean main via
`git stash`, not introduced here; logged to BACKLOG P2. No email sent to
anyone — the audience is empty and the send path was never reached with a
sendable state.

**Owner action requested (when signups exist):** review the rendered sample at
docs-internal/newsletter-drafts/2026-07-05-minus-tide-alert.html; on approval
we record it here and the first send becomes:
`node scripts/newsletter/sync-audience.mjs && node scripts/newsletter/send-weekly.mjs --send --owner-reviewed`.

**Tomorrow:** re-check `newsletter_signup` count each run (sync-audience.mjs
is now the fast way); the moment it is > 0, request owner copy review, then
first send + flip signup copy to live (BACKLOG P0 step 3). Weekly send day:
Thursday.

---

## 2026-07-05 (d) — Content backlog: Pacific Grove station guide

**Health (green).** "Daily data refresh" cron ran success at 11:49 UTC today
(run 28739770707, 2m2s); no open issues. Legacy red runs are pre-Vercel "Pages
redirect stubs" — not the live path.

**Metrics.** PostHog project 495836 (shared across the autonomous sites), last 7
days: 10 $pageviews, all on `/`, 9 $direct + 1 from bing.com; 3 $pageleave; 0
tidewindow newsletter signups (the 2 `pb_waitlist_signup` events are PointsBrain,
not us). GSC flywheel/pages/queries all empty. This is the expected pre-organic
picture for months 0–3 — no signal to chase, so I operated from the backlog.

**Action (priority d).** No new uncovered 90+ region (yesterday's West Coast
Jul 11–14 roundup is fresh and still upcoming), not a month-rollover day, so the
call was one content-backlog article. Wrote the top queued station guide:
**Pacific Grove tide pools** (content/articles/pacific-grove-tide-pools-2026.md),
covering the three spots Monterey station 9413450 serves — Point Pinos, Asilomar,
Lovers Point. Angle: unlike the gated Fitzgerald reserve, this is open shoreline
(no gate hours), but the whole coast is three connected no-take MPAs. The year's
deep daylight lows split into a July dawn run (Jul 14–16, all below −1.3 ft) and
a December dusk run (deepest −1.83 ft Dec 24). Nudibranch-heavy species record
(top 6 iNat logs all sea slugs). Cross-linked to the live West Coast roundup,
the dawn-lows explainer, Fitzgerald, king tides, and the tools.

**Verification.** Every tide number from docs-internal/facts/monterey-ca.json
(generated 2026-07-05). MPA rules verified at write time via CDFW
(wildlife.ca.gov) and CA State Parks — all three reserves confirmed no-take with
the verbatim "unlawful to injure, damage, take, or possess…" language; cited in
sources. `npm run build` green; all 9 internal links resolve against built
routes; article in sitemap (now 85 URLs). Discarded the pipeline's data-json/ics
rebuild churn (build re-runs NOAA locally; that's the cron's domain — only the
`generatedAt` stamp differed).

**Velocity.** Post-launch editorial pace is 2 pieces (07-04 roundup + today) —
well under the ≤5/week cap. The 21 "last 7 days" additions are the sanctioned
launch batch, not ongoing rate.

**Tomorrow:** normal queue. Weekly regional roundup is a Thursday cadence
(next refresh ~07-09/07-11 with the highest-scoring upcoming region). Otherwise
next station guide in the queue is Port Townsend / Fort Worden, or the
noted-strong-query La Push / Rialto + Hole-in-the-Wall. Newsletter go-live (P0)
still pending owner review of first-issue copy.

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
