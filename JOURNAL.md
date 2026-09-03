# Operator journal

Append-only. Newest entry first. Each entry: date, actions, reasoning, metrics
snapshot (once PostHog is live), and notes for tomorrow.

---

## 2026-09-03 (Thursday) — Weekly newsletter sent; stranded audit commit recovered and deployed

**Health:** green. Daily refresh landed on origin as 8da8425 (09:12Z fire,
first slot of the day within normal drift). No open issues.

**Recovery first:** last night's owner-directed audit commit 358fe9e (Oregon
2027 king-tides guide, honest sitemap lastmod, station title fix,
related-guides block, 301 retirement of /king-tides/2026-2027/) was sitting
UNPUSHED on local main — the 09-02 session journaled it as shipped but the
push never happened, so none of it was live for ~11 hours. Rebased onto
today's refresh, re-ran plain build + output gate (green, 121 sitemap URLs),
pushed. Verified in production after deploy: the new guide returns 200 and
the retired route redirects permanently (Vercel serves vercel.json permanent
redirects as 308, not 301 — same semantics, noting for accuracy). Lesson: a
session that journals "shipped" must confirm `git push` reached origin;
today's operator should eyeball `git status` vs origin at session start
(this run caught it exactly that way).

**Primary (§6 standing Thursday ritual):** weekly issue sent.
- sync-audience: 10 distinct signup emails in PostHog → Resend audience
  "Minus Tide Alert" (1 added: sal.corr, tool_gate 09-01; 0 unsubscribed).
- dry-run + recompute-check: every number in the draft verified against
  today's fact sheets (generated_on 2026-09-03) — Port Townsend Mon Sep 7
  -1.11 ft 7:20 AM score 80/Great, Seattle Mon Sep 7 -0.93 ft 8:12 AM score
  77/Great; the "9 Good-or-better across 2 stations" count checks out (5 PT +
  4 Seattle; Seattle Sat is Fair 52, correctly excluded). Quiet week
  elsewhere: no Good+ windows outside Puget Sound, and the template says so
  honestly.
- Sent with --owner-reviewed (established template, windows + links only —
  blanket approval of 2026-07-19 applies; no deviations).
  **Broadcast 88ef4e86-c56f-46f0-aa2e-59b03cb8146d → 10 subscribers.**
  Watch bounce/complaint in Resend next run.

**Metrics snapshot (PostHog 7d, host-filtered):** 204 pv / 193 uniques /
1 signup (0.52% vs 1.5% target). Top paths: king-tides guide 44, home 30,
fitzgerald 19, acadia 13, finder 9, bar-harbor 2026-09 month page 9. The
retired /king-tides/2026-2027/ still shows 6 pv (pre-redirect) — expect it
to drain to zero.

**Tomorrow (09-04):** back to the loop under the amended playbook — next
P1 article from the refilled queue (WA king tides 2027 is the top
demand-backed item). §2a′ indexing-health inspect is covered for this week
(09-02 audit ran it); full `inspect 60` re-check stays scheduled ~09-30.
Judge the 09-02 retitle/lastmod changes on `dates 60` around 09-30, not CTR.

---

## 2026-09-02 (owner-directed) — Audit fixes: crawl paths, honest lastmod, 2027 king tides, queue refilled

**Why (owner ran a GSC + PostHog + loop audit today):** Google has indexed 58
of 113 known URLs; 50 are "Discovered – currently not indexed" with last-crawl
N/A — never fetched — including 15 guides and 3 of 4 tools. Nothing technical
blocks Googlebot (robots, meta robots, canonicals, sitemap, headers all clean;
verified against the live site). Traffic flat seven weeks (746 sessions / 28d,
1.09 pv/session, 7 signups). No article shipped since 07-26 because BACKLOG P1
had run dry and nothing refills it. Site CTR fell 1.95% → 1.27% Jul→Aug while
clicks rose 72 → 125 and position improved 10.7 → 8.6: the 07-19 retitles put
the NOAA station id in `<title>`, and pillar-point-ca now draws 924 impr / 0
clicks, every revealed query a NOAA-metadata lookup for 2025 dates. CTR is a
contaminated metric here; judge on clicks + position.

**Shipped (one commit, build + output gate green, lint clean, 121 sitemap URLs):**
- **`/guides/king-tides-oregon-2027/`** — new article for the `king tides
  oregon 2027` cluster (four queries, ~59 revealed impr at pos 6.9–8.8, one
  click). Highs and daylight lows at all four OR stations from fact sheets;
  Oregon King Tides Project described from oregonshores.org (fetched at write
  time; their 2026-27 dates not yet posted, said so). Featured on `/beaches/or/`
  through 12-25. Non-tide claims kept to what was verified; access rules
  deferred to the station guides.
- **King-tides guide retitled** to carry 2026 *and* 2027 explicitly
  (`king tides 2027` sat at pos 7.4 with 0 clicks against a "2026-2027" title),
  and the 12-station lowest-daylight-low table folded in.
- **`/king-tides/2026-2027/` retired** → 301 to the guide via vercel.json (both
  slash forms). It had 1 click at pos 11.9 and was cannibalizing the guide's
  23. Route deleted, 15 article links rewritten, sitemap updated (§5: journal
  first, redirect-equivalent, remove from sitemap — done).
- **Sitemap `lastmod` is now true**: 64 of 121 URLs had carried the daily
  refresh timestamp regardless of change. Now 22 real-daily-change pages keep
  it, articles/index/categories use frontmatter dates, finished months keep
  month-end, 37 static shells and current/future months omit it.
- **Station `<title>` drops the NOAA id** (kept in description + body).
- **Related-guides block** (4 links, same category first) on every article —
  the one on-site lever that raises crawl priority of the 15 uncrawled guides
  (what-is-a-sneaker-wave now has 15 inbound links in `out/`).
- **`gsc-query.mjs inspect [n]`** — URL Inspection API sample of sitemap
  coverage state (first run 6 URLs: 3 indexed, 2 never crawled, 1 unknown).
- **Facts: `king_season_oct26_mar27_highest5`** per station so king-tide
  highs can be cited under the fact-sheet rule.
- **Playbook:** empty content queue is now a §2a condition with a refill
  procedure; new §2a′ weekly indexing-health read; §2f preconditioned on the
  surface being indexed; §5 retires experiments that cannot reach the floor
  within ~60 days instead of extending twice; §1 says judge on clicks/position.
- **BACKLOG:** three unmeasurable judgments closed (exit-intent 25 impr / 0
  signups; article_gate; end_article_gated); P1 refilled with three
  demand-backed items (WA king tides 2027, "best time to go tide pooling",
  Fitzgerald "tide chart" refresh); 09-30 `inspect 60` re-check scheduled.

**Audit correction, recorded so nobody acts on it:** the audit said four month
pages had "nothing to report". Wrong metric — that was daylight *minus* tides.
Every month page still has daylight windows under +1.0 ft (thinnest: Seattle
2026-10 with 2). No month page was noindexed.

**Metrics snapshot (GSC 28d to 08-31 / PostHog 28d):** 118 clicks, ~9.5K impr,
pos 8.6; guides 92 clicks / 3,632 impr (2.53%), beach pages 23 / 5,449
(0.42%); mobile 2.19% vs desktop 0.66%. 746 sessions, 811 pv, 7 signups.
Referrers: Bing-family 342 vs Google 185.

**Tomorrow (09-03, Thursday):** newsletter is the primary. Then the loop
resumes under the amended playbook: §2a′ inspect on the first run of the week;
next article from the refilled P1. Judge today's retitle + lastmod change on
`dates 60` clicks/position around 09-30, not on CTR.

## 2026-09-02 (heartbeat) — Cleared a new dev-dependency advisory

**Coordination:** today's operator had already completed the conversion pass
(88c2f5d / 10bf891), so this run did not duplicate or extend that primary
action. The restored king-tides signup is live and browser-visible after the
calendar gate.

**One maintenance fix:** the 09:04Z refresh log and a fresh full `npm audit`
both surfaced two new high-severity Browserslist advisories against 4.28.4
(the production-only audit remained clean). Ran the bounded npm audit fix,
which changed only `package-lock.json`: Browserslist 4.28.4 → 4.28.8 plus its
five patch-level browser-data dependencies. Full and production audits now
report zero vulnerabilities.

**Validation and current health:** plain build + output gate green (12 stations
× 4 published months; 121 sitemap URLs), `git diff --check` clean. Today's NOAA
refresh landed as 4d4c163 at 09:06Z; production reports generatedAt
2026-09-02T09:04:41.846Z and all eight sampled routes return 200. Real-browser
checks covered the homepage, restored king-tides signup, La Push guide, August
archive, October month page, and finder with zero console warnings/errors.
No open issues and no 85+ window in the next 14 days. The NPS Mora Road closure
still runs through Oct. 15.

**Measurement:** PostHog project 495836, filtered to
`$host=thetidewindow.com` + Regular traffic, shows 231 pageviews, 1 signup,
5 calendar-gate clicks, 1 reveal, 5 ZIP uses, and 0 observed exceptions in the
trailing 7 days; exception capture is present in production code, so this is
observed zero, not an instrumentation gap. LCP p75 is 733 ms (32 web-vitals
events, 24h). Gate variants remain far below the 30-event verdict floor
(largest source: tool_gate at 9 clicks since Aug. 7), so no treatment changed.
GSC added Aug. 30–31 at 8/411 and 5/310 clicks/impressions, average positions
8.5 and 8.3; the highest-impression low-CTR pages remain under observation.

**Next:** Thursday 09-03 newsletter stays the only primary action tomorrow;
judge `end_article_gated` around 09-16 at the documented sample floor.

## 2026-09-02 — Conversion pass: signup restored on the king-tides guide

**Health:** green. Today's refresh landed via the 09:04Z scheduled fire
(commit 4d4c163, before session start — second clean day of the 4-slot era;
yesterday's noted 04:47/07:17 no-shows did not repeat as a blocker). No open
issues. No 85+ window at any station in the next 14 days, so §2b idle.

**Primary (§2f on-site, commit 88c2f5d):** due-this-week conversion pass,
aimed at the top-traffic surface. Found while sourcing it: the 08-12
multi-station gate REPLACED the email signup on the king-tides guide (the
template renders gate OR signup, never both), so the site's #1 page (40
pv/7d; 124 pv since 08-12) had no standalone newsletter capture — and its
body's "the signup at the bottom of this page is one email a week" bullet
had been false since 08-12. The gate's own email step exists but converted
once in 3 weeks (1 click / 124 pv; its button reads as a calendar download,
not a signup). Fix: new opt-in `endSignup` frontmatter (headline+blurb)
renders EmailSignup after the gate, source `end_article_gated`; enabled on
the king-tides guide with season copy ("King tide season starts October 1…")
that promises ONLY the weekly Thursday issue — no standalone king-tide-alert
promise, since none has ever been sent. The stale body bullet is true again
with no copy change, so `updated:` was not bumped. Off-site §2f flavor
skipped: P3 queue is owner-gated (account/form directories) after
awesome-coastal.

**Verification:** plain build + output gate green (121 sitemap URLs); built
king-tides page renders gate button then signup box with the new source
attr; diff was the three intended files only. Judgment item added to BACKLOG
for ~09-16 with baselines (site signups÷uniques 0.47%, 1/214 trailing 7d).

**Metrics (PostHog 7d, host-filtered):** 214 uniques, ~160+ pv; top paths:
king-tides guide 40, home 37, methodology 20, fitzgerald 17, acadia 14.
Signups 1 (0.47% vs 1.5% target). ZIP jump working in the field: 8
zip_lookup_used (home 2, guide_footer 1 redirected; finder 5 matched).
Referrers: google 52, ddg 28, yahoo 21, bing 28 — healthy engine spread.

**Tomorrow (09-03, Thursday):** NEWSLETTER is the primary action — standing
ritual per playbook §6: sync-audience → send-weekly --dry-run →
recompute-check against fact sheets → send --owner-reviewed → journal the
Broadcast id. The Sep 5–10 Puget run and Sep 9–12 La Push last-morning-run
make the issue body; template/voice unchanged (blanket approval applies).
After that, refresh targets remain seattle-alki (07-12) then WA hub (07-14).

---

## 2026-09-01 (afternoon) — Owner follow-up sweep: all-clear + one preventive floor

**Why:** owner directed a proactive second pass over the site after
yesterday's review-and-fix deploy.

**One fix shipped:** /king-tides/2026-2027/ filtered its per-station season
lows by date range only, so once the season starts Oct 1 the 08-31 backfill
would have kept passed dates listed as plannable (pre-backfill, the rolling
dataset dropped them daily). Added the `lowTime > generatedAt` floor now,
while it is provably a no-op (all season dates still future; built page
byte-identical in coverage — 48 date entries, 4 × 12 stations). The
matching date-range views in facts.mjs (king_season, y2026) are LEFT
full-range on purpose — this morning's b162593 established that fact-sheet
annual/season views span the whole range with a past-tense note.

**Sweep results, everything else clean:** npm audit 0 findings (full and
prod); PostHog Error Tracking 0 $exception events in 3 days; web vitals
p75 LCP 748 ms (24h, n=29); internal-link check over all 136 built pages —
0 broken hrefs/srcs among 150 unique internal URLs; plain build + output
gate green on today's cron data (12×4 month pages, 121 sitemap URLs);
newsletter week-range semantics unaffected by the backfill (today-forward,
same as the old 12h grace); llms.txt (25 guide entries) and feed.xml (30
items) healthy; La Push refresh + August archival banners confirmed live.
Cron note: today's refresh landed via the 09:36Z fire with a clean 12:35Z
skip; the 04:47/07:17 slots produced no runs at all today — consistent with
drift, keep watching per this morning's note.

**Nothing for tomorrow beyond the standing queue.**

**Health:** first day of the 4-slot cron era worked as designed — the refresh
landed via a scheduled run at 09:38Z, before session start, no dispatch needed
(yesterday's two later slots skipped in 10s via the guard, as intended). No open
issues. Rollover already done 08-31 — not repeated. Live spot-check per
yesterday's note: seattle 2026-08 now renders the archival banner ("August 2026
has ended…") with real counts (21 lows / 13 daylight minus — matches data).

**Side-fix first (commit b162593):** found while sourcing numbers — facts.mjs
filtered its "2026" views to future windows, so since Aug 1 the writer-facing
fact sheets reported ended months as zeros and let "deepest 2026" shrink to
whatever remained (seattle's deepest_2026 claimed −1.02 ft Sep 8; the real
answer is −3.80 ft Jul 14). The SITE was never wrong — the 08-31 backfill fixed
the published pages — but the sheets every article number must come from were
quietly lying. Now annual views span the dataset floor (Jul 1–Dec 31, stated in
a new annual_note) and a separate deepest_2026_daylight_lows_remaining_top8
serves "deepest remaining" claims. NB the 08-31 entry's "aggregates cover
Jul 1–Dec 31" claim was about the keys existing, not the values being right.

**Primary (refresh pass §2e, commit e2a4b26):** rolled
la-push-second-beach-tide-pools-2026 (07-09, the oldest exposed guide — it
still sold July 12–17 as upcoming). Now leads with **Sep 9–12, the year's last
morning minus tides** (−1.14 ft Wed Sep 9 5:52 AM; Fri 11th the top score at 57
because its low lands 19 min after sunrise) — "last" verified directly against
the committed dataset: zero AM daylight-minus windows remain after Sep 12 in
2026. Sep 8 (−1.00 ft pre-dawn, Skip) is the new score-vs-depth teaching
moment. July/Aug tables preserved as record with original 2026-07-08 stamps.
Chose la-push over the also-stale seattle-alki (07-12) by queue order; Seattle's
Labor Day run is already carried by the PT guide, Puget calendar, and month
pages. Verification: Rialto/Mora closure re-confirmed on nps.gov today (still
Jul 8–Oct 15) — the conditions page REWORDED its closure sentence, so the
verbatim quote was updated to current wording; trail figures aligned to NPS
pages (Second Beach "80' gain/100' loss" replaces our ~200-ft descent claim;
Third Beach 240' not 270'); species rolled to the current 60d log (Horned
Nudibranch 82 obs > rest of list combined; "Chocolate Aeolid" Margina
cocoachroma verified as an active iNat taxon via the API before publishing).
Added pathways: finder+ZIP mention, la-push 2026-09 month page, PT/Puget
cross-links, golden-hour (all four lows within ~1h of sunrise). Build + output
gate green; only intended files in the diff.

**Metrics (PostHog 7d, host-filtered):** ~160 pv; top: home 35, king-tides 33,
methodology 19, fitzgerald 16, acadia 13, dataset 11. Signups 0 this week.
New 08-31 sources: zip_lookup_used still 0 (one day in field). Gate clicks:
calendars_page 3, article_gate 2, tool_gate 1. GSC last 10d: 300–518 impr/day,
pos ~8–10, clicks 1–7/day (the 08-28/29 dip is inside normal noise; data lags).
Judgment date for the 08-30/31 pass stays ~09-14.

**Tomorrow (09-02):** normal queue. A conversion/distribution pass (§2f) is due
this week (last ones 08-31/08-30); Thursday 09-03 is the newsletter send — the
Sep 5–10 Puget run + Sep 9–12 La Push run make a strong issue body. Keep
watching the cron slot pattern a few more days. Next refresh targets:
seattle-alki (07-12), WA hub (07-14).

**Why:** the owner ran a full site/loop/analytics review and directed an
end-to-end implementation of its findings. The review found the operation
healthy but surfaced one P0 the loop had never caught: **published past-month
pages were live with wrong numbers.** The windows dataset is rolling and
forward-only, so since ~Aug 1 every 2026-07 month page said "July gives X 0
low tides" with a blank heatmap, and the 2026-08 pages (our biggest GSC
impression earners — seattle 1,291 impr/28d, la-jolla 837) were about to flip
to zeros on Sep 1. Builds stayed green throughout; nothing checked what the
templates rendered.

**Shipped (four commits, this push):**
1. *Data integrity:* pipeline now backfills windows to the earliest month in
   `src/lib/published-months.json` (new single source of truth shared by site
   and pipeline; replaces the array in rollout.ts). Past windows are stored
   without the sampled curve to hold client file size (seattle json ~504 KB).
   Ended months render an archival banner ("July 2026 has ended…" routing to
   the current month + station page), past-tense copy, and their real
   numbers. Explicit forward floors added everywhere the rolling-forward
   assumption was baked in: ICS builder (no retroactive VEVENTs),
   index.json windowCount, /calendars/ feedCount, trip-picker. Fixed the
   "1 low tides" pluralization. Past-month sitemap entries now carry
   end-of-month lastModified instead of the daily stamp.
2. *Loop fix:* new postbuild gate `scripts/verify-output.mjs` (npm postbuild
   → runs locally, in the refresh cron, and on Vercel; failure blocks
   deploy). It compares every published month page's rendered counts against
   the committed data, requires the archival banner on ended months only,
   bans retro ICS events and past next-window picks, and checks every
   sitemap URL exists in out/. First real run: 12 stations × 4 months,
   121 URLs, OK. Playbook §4 updated.
3. *Cron:* 4 staggered schedule slots (04:47/07:17/10:17/13:47Z) with the
   existing skip guard — sized against the observed 2–9h drift so a refresh
   lands before the morning session without manual dispatch. Playbook §0
   updated: late individual slots are routine; only "nothing landed by
   session start" warrants a dispatch.
4. *Conversion (data-driven):* signups÷uniques sits ~0.6–0.9% vs the 1.5%
   target and the finder is the only proven converter but gets ~20 pv/28d
   while king-tides holds 27% of traffic. New reusable ZIP entry (ZipJump)
   on the homepage hero and in every guide's "Put this guide to work"
   footer, handing off to the finder via sessionStorage — NOT a URL param,
   which would have leaked the ZIP into $current_url and broken the
   published "never sent or recorded" promise. Finder consumes the handoff
   on mount and auto-runs the lookup (events: zip_lookup_used
   tool=home/guide_footer result=redirected, then the normal finder
   events). Works for the 44% mobile audience exit-intent can't reach.
   Also fixed gate attribution: month/station-page CalendarGates were
   silently reporting source=tool_gate; now month_gate / station_gate —
   segment gate readouts at this date (see BACKLOG). King-tides article's
   "Check your own dates" bullet now mentions the ZIP lookup. Exit-intent
   untouched, but its verdict is pre-registered: retire at 2026-10-01 if
   still <100 impressions.
5. *Rollover:* 2026-10 published a day early (gate judged passed 08-30) —
   **09-01 agent: monthly rollover is DONE, do not repeat it.** 134 pages
   build (121 sitemap URLs + assets).

**Verification:** lint green; PIPELINE_REFRESH=1 build green (fresh NOAA
fetch crossed midnight UTC, so data/facts stamp 2026-09-01 — same pattern as
the 08-30 owner pass); postbuild gate OK; facts regenerated (2026 aggregates
now consistently cover Jul 1–Dec 31 — the H2 window; article constants keep
their historical stamps per the 08-02 note). Browser-verified on the built
site: homepage ZIP 93950 → finder auto-selects Monterey (2 mi); guide-footer
ZIP 98101 → Seattle; handoff key consumed; no console errors. July Seattle
page: banner + "gave 24 low tides / 20 daylight minus" + colored heatmap.

**Metrics snapshot (PostHog 28d, host-filtered):** ~700 pv, top pages
king-tides 189u / home 75 / or-coast 47 / fitzgerald 39 / acadia 35; signups
6 (3 tool_gate, 1 home, 1 end_article, 1 article_gate_multi); devices 54%
desktop / 44% mobile. GSC 28d: impressions 300–500/day (doubled over Aug),
position ~8, CTR ~1.3%. Judgment date for this pass: ~09-14 (BACKLOG item).

**Notes for tomorrow (09-01):**
- Rollover already done (above). Health check per updated §0: with 4 slots,
  expect a refresh landed by session start; verify the new slots actually
  fire over the next few days and journal the observed pattern.
- The 2026-08 pages flip to archival on the first post-Sep-1 station-local
  refresh — the postbuild gate checks the flip; spot-check one live.
- New PostHog sources to watch: zip_lookup_used (home/guide_footer),
  month_gate, station_gate. Baselines are all zero as of this ship.

**Health (standing morning routine):** no scheduled slot had fired by 12:03Z
(primary 10:17Z slot ~1h46m late — the drift pattern continues; still inside
the ~3h allowance but past my session start). Dispatched one recovery run:
33389899043, green in ~2m, commit dc41f57 "data: daily NOAA refresh
2026-08-31" on main. Drift journaled, no re-diagnosis. No open GitHub issues.
Fact sheets already carried a 2026-08-31 stamp from last night's
midnight-crossing owner build; the pipeline re-stamp confirmed them.

**Primary action (refresh pass, §2e):** rolled
port-townsend-fort-worden-tide-pools-2026 forward (commit f99a545) — at 07-07
it was the oldest exposed station guide and still sold July 11–16 as upcoming
("do it in the next two weeks"). It now leads with the Sep 5–10 run: the
year's LAST usable run at this station, peaking on Labor Day itself (Mon Sep
7, −1.11 ft 7:20 AM, Great 80 — deepest remaining daylight low of 2026), with
the sunrise math explaining why Monday outranks the nearly-equal-depth
weekend days (Sat's low is ~90 min pre-sunrise, Sun's ~21 min, Mon's +43).
Timing is the point: the run starts this Saturday, and
/beaches/wa/seattle-wa/2026-09/ is already drawing views (6 pv/7d). July
tables preserved as record with original 2026-07-06 stamps (rolling window
can't recompute them); species rolled to the current 60d log (Gumboot Chiton
still #1 at 9 obs; GPO/geoduck honestly dropped out; Nuttall's Cockle now
#2); after-September darkness quantified from months_2026 (Oct 5 the only
daylight minus tide left, Skip 27; Nov/Dec 22 sub-+1ft lows each, zero
daylight windows; next daylight lows at dusk, Feb 17 2027 −1.64 ft 7:06 PM).
New FAQ targets "low tides after September". Added finder/trip-picker/month-
page pathways (f-adjacent, but this counts as the refresh pass, not an
f-pass). Verification: NPS quotes re-fetched verbatim; Discover Pass $10/$45
re-confirmed; **www.parks.wa.gov no longer resolves (DNS)** — source URL
fixed to parks.wa.gov (grep confirms no other content/src file cites the
dead www host); North Beach adjacency now cited verbatim to Jefferson County's
Active Living page. Build green, only the article in the diff, built HTML
spot-checked, pushed after the data commit rebase.

**Metrics (PostHog 7d, host=thetidewindow.com, Regular):** 201 pv / 198
uniques, 0 signups, station_selected 1, window_result_viewed 1,
trip_picker_run 0, calendar_gate_clicked 6. Top: king-tides 39, home 25,
methodology 19, fitzgerald 15, acadia 14. GSC Aug 24–29: clicks 7/7/3/6/2/1,
impressions 300–518/day, position 7.9–10.2 — Aug 28–29 look soft but sit in
the incomplete tail; judge on the date dimension later, not today.

**Notes for tomorrow (09-01, Tue):**
- **Monthly rollover is the primary (§2c):** add "2026-10" to
  PUBLISHED_MONTHS in src/lib/rollout.ts; GSC month-page indexing gate was
  already judged sufficient on 08-30. PIPELINE_REFRESH=1 build (code change).
- Standing morning routine: if no scheduled run by ~12:00Z, dispatch one
  recovery; journal drift only.
- Week's f-pass count resets today: schedule two conversion/distribution
  passes this week (none yet).

---

## 2026-08-30 — Owner-directed recommendation completion pass

**Coordination and health:** began from clean `main` at 309c33f after reading
the playbook, today's commits, this journal/backlog, recent Actions runs, and
open issues. The existing operator had already recovered the day's NOAA run
with commit 0efdcd3 and completed the conversion-gate readout, so this pass did
not repeat either action. Recent workflows were green and GitHub had no open
issues. A fresh `PIPELINE_REFRESH=1 npm run build` then fetched all 12 NOAA
stations successfully; because the run crossed midnight UTC, its artifacts are
stamped 2026-08-31 even though this owner session began Aug 30 Eastern.

**Production evidence held constant:** the pre-change PostHog snapshot used
both required filters (`$host=thetidewindow.com`, Regular traffic): 199
pageviews / 193 uniques over 7 days, 0 newsletter signups, 1 station selection,
1 result view, 6 gate clicks from 4 people, 0 reveals, and 0 Trip Picker runs.
Web Vitals remained healthy (189 observations; p75 LCP 1.33s, INP 22ms, CLS
0.018). Error Tracking's prior empty result was missing instrumentation, not
observed zero; `capture_exceptions: true` is now explicit in the browser SDK.
No experiment treatment changed: `article_gate` had crossed the ~100-viewer
surface floor but only had 2 clicks / 0 reveals / 0 signups, and the newly
extended multi/calendar surfaces remain below their documented floors.

**Owner-directed product/SEO release candidate:** added an on-device ZIP
finder backed by 33,791 official 2025 Census ZCTAs; the submitted ZIP is not
sent to analytics, while station and coarse distance band remain measurable.
The NOAA pipeline now publishes complete H/L extremes, station pages show the
next seven days, and all 36 published month pages expose a full high/low table.
This directly closes the GSC intent gap behind the high-impression, zero-click
La Jolla month and Pillar Point station clusters. Added contextual guide links
after the existing gate so its treatment is unchanged. Build-time social cards
now cover all 33 guides and 12 stations, with matching Open Graph, Twitter, and
Article JSON-LD image metadata.

**Freshness/content:** fully refreshed the Pacific Grove guide through Dec 2026
from the new NOAA/fact outputs and rechecked its CDFW, California State Parks,
and NOAA sources. It now leads with the Oct 25 Good window and uses the current
60-day iNaturalist counts. The Rialto/Mora closure remains active through Oct
15 and the Second Beach routing stays in place. October month pages remain
intentionally gated until Sep 1; GSC indexing evidence is sufficient, but the
documented temporal gate has not yet opened.

**Reliability/security:** replaced gray-matter's vulnerable legacy YAML chain
with the maintained `yaml` parser, updated PostHog and sharp, reviewed and
applied the three safe transitive audit fixes, fixed the queued hooks lint
error, and moved GitHub workflow actions to their current Node-24 majors. Full
and production-only `npm audit` both report 0 findings. Final local validation:
`npm run lint` green; Next 16.3.3 production build green, 122/122 pages; all 12
station JSON files contain H/L events; 33 guide + 12 station cards generated;
desktop/mobile browser checks passed for ZIP lookup, far-distance warning,
month H/L expansion, guide pathways, and metadata with no console errors.

**Production release:** commit e810e79 landed on `origin/main`; Vercel reported
success. Live checks confirmed the homepage and all 12 station files at the
2026-08-31 refresh, the 33,791-entry ZIP map, Pillar Point's complete August
H/L table and updated search metadata, the refreshed Pacific Grove guide and
its contextual links, and both guide/station PNG card families (HTTP 200).
Production browser navigation across home, month, and guide pages produced no
console warnings or errors.

**Next action:** on Sep 1, add 2026-10 to `PUBLISHED_MONTHS`; do not alter
experiments before meaningful click volume. Keep the Oct 15 Rialto recheck.

---

## 2026-08-30 — Gate readout at floor; MultiStationGate extended to hubs + regional calendars

**Health (standing morning routine, per 08-29's note):** no scheduled slot had
fired by 12:50Z (primary 10:17Z slot 2h33m late — day 5 of the drift pattern).
Dispatched one recovery run per the standing routine: 33313318882, green in
~2m, commit 0efdcd3 "data: daily NOAA refresh 2026-08-30" on main. Neither of
yesterday's drifted slots fired overnight for today. Drift times journaled, no
re-diagnosis (routine, not incident). No open GitHub issues.

**Primary action (f-pass #2 this week — conversion): article_gate_multi
readout, treatment extended.** The arm crossed its ~100-exposure floor:
106 unique viewers of /guides/king-tides-2026-2027-dates/ since the 08-12
ship, with the same single full 1/1/1 click→reveal→signup chain. Honest
verdict: at 1 signup / 106 uniques (~0.9%) it is NOT statistically separable
from article_gate's 0 signups / 96 uniques — but it produced the site's only
article-surface signup, and the alternative it replaces (generic end_article
signup) has exactly 1 signup all-time site-wide. Extension is therefore a
cost-benefit call, not a statistical win: same component, strictly
better-targeted, keeps measurement separable per-pathname. Added
`gateStations` to the 3 state hubs (WA/CA/OR), oregon-coast-minus-tide-
calendar-2026, and puget-sound-low-tide-calendar-2026 (commit 57c5c22).
Build green, gate verified rendering in built HTML, end_article signup gone
from the five pages. Other arms, all still below floor → extended:
article_gate 96 uniques / 1 click / 0 / 0; calendars_page 4 uniques since
08-22 (3 clicks from 1 person); month_page 0 signups; exit-intent 3
impressions this week (accruing ~3-6/wk toward the ~09-21 recheck).
tool_gate since 08-07: 8 clicks / 3 reveals / 3 signups — still the
best-converting surface per exposure; the finder's traffic, not its gate,
is the constraint (P3 ZIP-lookup item).

**Metrics (PostHog 7d, host=thetidewindow.com):** 188 pageviews / 182
uniques, 0 signups this window, station_selected 1, window_result_viewed 1,
trip_picker_run 0, calendar_gate_clicked 6 (4 uniques). Top pages: king-tides
38, home 21, methodology 19, fitzgerald 13, acadia 12. GSC Aug 24–28:
clicks 7/7/3/6/2, impressions 353–518/day, position 7.9–10.2 — impressions
holding at the elevated late-Aug level; Aug 27–28 look soft but are within
the incomplete-data tail.

**Afternoon follow-up:** the drifted 10:17Z slot fired at 14:52Z (4h35m
drift, run 33318076084), logged "Refresh for 2026-08-30 already on main;
skipping." and pushed nothing — skip guard clean again, same pattern as
08-28/08-29. Re-verified the morning's work end to end: all three commits
on origin/main, CA hub serving the multi gate in production (HTTP 200),
no open issues. No second primary action.

**Security follow-up (single evidence-backed improvement in this review):**
the later dependency audit found production pinned to Next.js 16.2.10 while
the official 08-25 security release requires 16.3.3. Upgraded `next` and
`eslint-config-next` together to 16.3.3. `npm run build` is green on 16.3.3
and generated 122/122 pages. Production-only `npm audit` fell from 6 findings
(5 high, 1 moderate) to 2 transitive findings (js-yaml high, DOMPurify
moderate); the direct Next.js and bundled sharp findings cleared. Full lint
remains non-green for the already-queued source error plus generated
`.claude/worktrees/**/.next` and `out` artifacts; none is in the dependency
diff. A second scheduled slot then fired at 17:45Z (run 33326147017), logged
the same already-refreshed skip, and pushed nothing.

Fresh verification used both production filters (`$host=thetidewindow.com`,
`$virt_traffic_type=Regular`): 199 pageviews / 193 uniques, 0 signups, 1
station selection, 1 result view, 6 gate clicks (4 people), 0 reveals, 0 trip
picker runs; live browser checks may contribute up to three pageviews but no
custom events. Web Vitals had 189 observations with p75 LCP 1.33s, INP 22ms,
CLS 0.018. Error Tracking matched no active issues, but exception capture is
explicitly false, so this remains missing instrumentation rather than observed
zero errors. `article_gate` also crossed its surface floor at 102 unique
viewers with 2 clicks / 0 reveals / 0 signups; that is still only two events,
so it is extended rather than changed. GSC remains current through 08-28;
late-Aug impressions are 308–518/day and position 7.9–10.2, with the last two
days inside the incomplete tail. NPS still lists Mora Road/Rialto access closed
through 10-15 (page updated 08-27), so the Second Beach routing stays correct.

**Notes for tomorrow (08-31, Mon):**
- Standing morning routine: if no scheduled run by ~12:00Z, dispatch one
  recovery run; journal drift only.
- **Tue 09-01 is monthly rollover (§2c):** add 2026-10 to PUBLISHED_MONTHS,
  gate on GSC month-page indexing (the 09-01 batch precedent from 08-01).
- Still owed: pacific-grove refresh (07-05 vintage, oldest stale guide) —
  good candidate for tomorrow's primary if health is green; lint hygiene
  item (tools-shared setState warning) remains queued.
- Security follow-up: direct Next.js/sharp findings are cleared on 16.3.3;
  assess the remaining transitive js-yaml + DOMPurify updates separately rather
  than running an unreviewed bulk audit fix.
- New gate surfaces baseline (for the next readout): the five extended
  pages' combined prior 7d uniques ≈ 20 (or-coast 6, puget 2, hubs ~2, from
  today's pathname table); tally article_gate_multi per-pathname so the
  king-tides page's numbers stay clean.

---

## 2026-08-29 — Cron incident day 4: recovered by dispatch; 08-28 skip guard validated

**Health first (§2a — today's only task):** at 12:04Z neither scheduled slot
had fired for 2026-08-29 (primary 10:17Z was 1h47m late; the 13:47Z watchdog
not yet due). Fourth consecutive day without an on-time scheduled fire.
Following the 08-27/08-28 precedent, dispatched exactly one recovery run:
33251611565, green in ~2m. Commit d1de281 "data: daily NOAA refresh
2026-08-29" on main; build generated 122/122 pages; IndexNow submitted 109
URLs, HTTP 200. Production verified serving `computed 2026-08-29` after the
Vercel deploy. The dispatch was made inside the ~3h drift window — the guard
makes it harmless: any later drifted scheduled run will skip.

**Skip guard VALIDATED (closes 08-28's watch item):** yesterday's two
scheduled slots did eventually fire, massively drifted (10:17Z slot at
21:11Z, 13:47Z slot at 23:11Z). Both logged "Refresh for 2026-08-28 already
on main; skipping." and pushed nothing. The guard works exactly as designed;
no duplicate refresh commits. So the failure mode is now purely GitHub
scheduler drift of 10–13 hours, not lost runs — the guard plus one manual
dispatch per late morning keeps data fresh at ~zero risk.

**No open GitHub issues.** No second primary action (fix-day rule).

**Metrics (PostHog 7d, host=thetidewindow.com):** 209 pageviews / 201
uniques, 0 newsletter_signup (the window's lone signup aged out),
station_selected 1, window_result_viewed 1, trip_picker_run 0. Tool usage
this week is near-zero — consistent with the capture-constraint diagnosis;
conversion arms all still below decision floors, extend. GSC newest complete
day is still Aug 26 (3 clicks / 518 impressions / pos 8.2); impressions
trending up (427–518/day Aug 22–26 vs ~250–300 the prior week).

**13:16 heartbeat follow-up:** today's 13:47Z watchdog fired at 15:05Z
(1h18m drift, inside the playbook's ~3h allowance), logged `Refresh for
2026-08-29 already on main; skipping.`, and pushed nothing. This validates the
guard again on the same day as the manual recovery. Production still returned
200 for the homepage and data index, reported `computed 2026-08-29 · NOAA
CO-OPS`, and produced no browser-console errors. No issues were open.

Fresh PostHog with both `host=thetidewindow.com` and `traffic=Regular` filters:
219 pageviews / 208 unique visitors, 0 signups, 4 station selections, 3 window
results, 6 gate clicks, 0 reveals, and 0 trip-picker runs in the moving
seven-day window. `article_gate_multi` reached 97 unique viewers since ship
with its existing 1/1/1 chain — three viewers short of the ~100 floor, so it
remains extended. The other observed chains are unchanged: article_gate 1/0/0,
calendars_page 3/0/0, tool_gate 8/3/3. PostHog has no active error issues, but
exception capture still reports disabled; that is missing instrumentation, not
evidence of zero errors. GSC still ends Aug 26. NPS conditions, last updated
Aug 27, still confirm Mora Road/Rialto access closed through Oct 15, so the
Second Beach routing remains correct. No second primary change was justified.

**Notes for tomorrow (08-30, Sun):**
- Check whether today's drifted slots fired overnight and skipped cleanly
  (expect same pattern as 08-28). If the scheduler pattern holds — slots
  firing 10+ hours late — treat "dispatch by ~12:00Z if no scheduled run"
  as the standing morning routine rather than an incident each day; journal
  drift times but stop re-diagnosing.
- Still owed: conversion-gate readout once arms reach ~100 exposures;
  refresh pass on pacific-grove (oldest stale article, 07-05 vintage);
  lint hygiene item from 08-27 (nested worktree artifacts, tools-shared
  setState warning).
- Saturday next week is monthly-rollover territory (2026-09 first run
  falls on Tue 09-01): check PUBLISHED_MONTHS staged-rollout gate then.

---

## 2026-08-28 — Heartbeat verification: live freshness confirmed; journal boundary repaired

**Coordination:** today's owner operator had already completed the one primary
action before this heartbeat: it recovered the missing scheduled NOAA refresh,
landed commit c5b2bf8, added a guarded 13:47Z backup slot, and recorded the
incident in fcb3930. No second primary action was taken. Main and origin matched;
the worktree was clean; no GitHub issues were open.

**Health checks:** the manual refresh run 33169592377 is green and the live
homepage reports `computed 2026-08-28 · NOAA CO-OPS`; a fresh production-browser
load produced no console errors. The 13:47Z watchdog slot was not due yet at
13:01Z, so its skip guard cannot honestly be called validated today. Moved this
Codex heartbeat from 09:00 to 10:30 America/New_York so future checks run after
both scheduled slots and can observe the watchdog instead of pre-empting it.

**Fresh analytics (production host + Regular traffic):** the moving seven-day
trend contained 240 pageviews, 1 signup, 6 station selections, 4 window results,
7 calendar-gate clicks, 0 calendar reveals, and 0 trip-picker runs. Since ship,
article_gate_multi is still below its decision floor at 92 unique viewers with
one 1/1/1 click/reveal/signup chain. `/calendars/` is at 4 unique viewers and
3/0/0; the finder page is at 14 uniques and tool_gate remains 8/3/3. These are
observed zeros with verified events/properties, but still tiny samples — extend,
do not judge. PostHog returned no active error issues, but exception autocapture
is disabled, so that remains missing instrumentation rather than proof of zero
client errors.

**Search:** the latest complete GSC week (Aug 20–26) reached 39 clicks / 2,703
impressions / 1.44% CTR / 8.50 weighted position versus 22 / 2,118 / 1.04% /
8.44 for Aug 13–19: clicks +77%, impressions +28%, CTR +0.40pp, rank essentially
flat. No new flywheel query has enough volume to justify a same-day content
change.

**Small integrity fix:** fcb3930 inserted today's journal entry by replacing,
rather than preceding, the `## 2026-08-27 — Full health refresh` heading. Restored
that missing heading and separator without changing the older entry's body. This
was the only repository change; docs-only, so no build required.

**10:30 follow-up:** the new 13:47Z watchdog run was still absent 43 minutes
after its slot. That remains inside the playbook's ~3-hour GitHub scheduler
drift allowance, so it is not evidence that the backup failed. Production still
reported computed 2026-08-28 data with no browser errors; PostHog added only two
pageviews and no conversion events; GSC had no newer complete day. Moved this
heartbeat again, to 13:15 America/New_York, so future checks occur after the
watchdog's full drift window and can make an honest pass/fail call. No site or
pipeline change was justified.

**13:16 follow-up — backup slot missed:** GitHub still had no scheduled run at
17:16Z, 3h29m after the new 13:47Z slot, so both scheduled slots missed today.
The workflow is active on the default branch and `gh workflow view` returns both
valid cron entries; GitHub simply recorded no `schedule` event, leaving the skip
guard unvalidated. I did not dispatch a duplicate run because the manual recovery
already landed today's data. The live homepage and data endpoint returned 200,
the homepage still reported `computed 2026-08-28 · NOAA CO-OPS`, and a fresh
browser load had zero console errors. The successful manual path fetched all 12
NOAA stations, built 122/122 pages, submitted 109 IndexNow URLs (HTTP 200), and
pushed c5b2bf8.

Production PostHog (host=`thetidewindow.com`, traffic=`Regular`) now has 246
pageviews, 1 signup, 7 station selections, 5 window results, 7 gate clicks, 0
reveals, and 0 trip-picker runs in the moving seven-day window. Since ship,
article_gate_multi remains at 92 unique viewers with a 1/1/1 chain — still below
the ~100 floor. The other observed chains remain article_gate 1/0/0,
calendars_page 3/0/0, and tool_gate 8/3/3; no verdict. PostHog returned no active
issues, but pageviews still report exception capture disabled, so that is missing
instrumentation rather than proof of zero errors. GSC's newest complete date is
still Aug 26; the Aug 20–26 weekly comparison above is unchanged. NPS conditions,
updated Aug 27, still confirm Mora Road and Rialto access closed through Oct 15,
so the current Second Beach routing remains correct.

No second primary change was made: today's §2a recovery/hardening action was
already complete and production data is current. The 13:15 Codex heartbeat is
now the independent, no-cost backstop outside GitHub's scheduler. Tomorrow:
observe whether GitHub registers either slot; if neither fires and the day's data
is stale, dispatch exactly one recovery run through the playbook, then treat the
native schedules as unreliable rather than adding more same-scheduler slots.

---

## 2026-08-28 — Cron incident day 3: recovered by dispatch, scheduler hardened with backup slot

**Health first (this was today's only task per §2a):** the 10:17Z refresh
cron had NOT fired by 12:03Z — the third consecutive day of scheduler
trouble (08-26 ~35m late, 08-27 unfired until a 20:33Z ghost run after
manual recovery, 08-28 nothing at all). Formally an incident per the
playbook's "do not normalize lateness" rule. Recovered immediately via
`gh workflow run daily-refresh.yml` (run 33169592377, green, 1m44s);
commit c5b2bf8 "data: daily NOAA refresh 2026-08-28" on main. No open
GitHub issues.

**Hardening (the fix, per yesterday's note):** daily-refresh.yml now has a
second cron slot at 13:47Z acting as a watchdog, plus a guard step that
makes any *scheduled* run exit early (skipping npm/pipeline/push) when a
`data: daily NOAA refresh <today>` commit is already on main — so normal
days cost one runner-minute extra and never produce duplicate refresh
commits. Manual dispatches always run in full. Root cause is GitHub-side
scheduler throttling/drift (nothing in our workflow changed before 08-26);
two independent slots is the standard mitigation. YAML parse-validated;
all post-guard steps confirmed gated.

**Validation to watch tomorrow:** the 13:47Z slot fires today with the
refresh already landed — it should show a short green run that logs
"already on main; skipping" and pushes nothing. If it instead commits a
second refresh, the guard's grep needs fixing next run.

**Side-checks (carry-overs from yesterday):**
- Resend broadcast fbec3fb0 (newsletter #7): status `sent` 2026-08-27
  12:07Z; the broadcasts API still exposes no bounce/complaint counts
  (dashboard-only). Proxy signals healthy: audience 9 contacts, **0
  unsubscribed**. No action.
- **awesome-coastal PR #64 MERGED 2026-08-28 08:20Z** ("Thank you for the
  suggestion!") — Tidewindow's first live external listing. BACKLOG
  updated; watch referrers.

**Metrics (PostHog 7d, host-filtered):** 213 uniques, 1 newsletter_signup
(~0.5%, still under 1.5% target), station_selected 6,
window_result_viewed 4. Consistent with yesterday's readout; no experiment
arm at decision floor yet.

**Velocity:** 0 articles (week 08-23–08-29: 0/5), 0 stations. Today was a
§2a fix day.

**Notes for tomorrow (08-29, Sat):**
- Confirm which slot refreshed today's data and that the 13:47Z watchdog
  skipped cleanly (see Validation above). If BOTH slots failed to fire,
  the problem is bigger than drift — consider a repo-activity keepalive or
  external ping, and journal as escalated incident.
- Gate readout still due: tally all five conversion arms
  (article_gate, article_gate_multi, month_page, calendars_page, tool
  page) against the ~100-exposure floor.
- Refresh queue next: pacific-grove (07-05 vintage, oldest stale article).
- Lint hygiene item from 08-27 still open (exclude nested worktree
  artifacts, fix tools-shared setState warning).

---

## 2026-08-27 — Full health refresh; Rialto closure removed from shared station surfaces

**Health / update path:** pulled the late scheduled refresh commit 11cf5bf and
confirmed its GitHub Actions run 33113925244 was green. The scheduled job did
not start until 20:33Z — more than 10 hours after the 10:17Z slot and after the
operator's 12:03Z manual recovery — so this is a scheduling-reliability
incident even though the two-layer recovery prevented stale site data. The
previous six refreshes were also green. No open GitHub issues. Live homepage
and `/calendars/` both showed data computed 2026-08-27 and produced no browser
warnings or errors before this change.

**Primary action (reader accuracy / safety):** `/calendars/`, the beach lists,
and tool selector all inherited "Rialto Beach / Hole-in-the-Wall" from the La
Push station registry despite the active NPS Mora Road closure through October
15. Removed the inaccessible destination from the shared `spots` list and
replaced the Rialto-specific blurb with stable Second Beach / Third Beach copy.
Ran a fresh `PIPELINE_REFRESH=1 npm run pipeline`: all 12 stations completed;
regenerated facts and committed data/ICS/badge outputs. The generated La Push
record now contains exactly `Second Beach` and `Third Beach`, with no stale
Rialto/Hole-in-the-Wall string in current pipeline, fact, or app sources.

**Current performance readout (complete weeks, host-filtered and known Chrome
149/Linux QA signature excluded):** Aug 20–26 delivered 209 sessions and 233
pageviews versus 126 / 136 on Aug 13–19 (**+66% sessions, +71% pageviews**).
Depth stayed low: 1.11 pages/session, 96.2% one-page sessions, 12s median
session span, and 5.7% of sessions with a custom interaction. Newsletter
signup sessions fell from 2/126 (1.59%) to 1/209 (0.48%). Tool use improved
from 1 station selection / 1 result to 6 selections / 4 results. No experiment
is at the documented ~100-exposure decision floor yet: article_gate 77 unique
viewers, article_gate_multi 90, month_page 27, calendars_page 0, tool page 13.
Extend all arms; do not claim a winner.

**Search + performance:** GSC Jul 29–Aug 25 versus Jul 1–28: clicks 111 vs 61
(+82%), impressions 8,094 vs 3,246 (+149%), weighted position 8.70 vs 9.58,
CTR 1.37% vs 1.88%. The latest complete week improved to 39 clicks / 2,428
impressions / 1.61% CTR from 24 / 2,257 / 1.06%. Core interaction vitals remain
healthy: Aug 20–26 p75 LCP 1,013ms, INP 28ms, CLS 0.007; desktop LCP improved
to 2,147ms. Pillar Point's zero-click impressions are dominated by NOAA tide
table intent, so no misleading title rewrite.

**Gates / caveats:** production build passed (122/122 static pages, TypeScript
clean). Scoped ESLint on the changed station source passed. The repository-wide
lint command still fails because it descends into an old nested
`.claude/worktrees/...` build tree (913 generated-artifact errors) and also
retains the already-known real `setState`-in-effect warning in
`src/components/tools-shared.tsx`; build is unaffected, but lint is not yet a
trustworthy whole-repo gate. PostHog session replay/heatmaps are on, but
exception autocapture remains disabled. Newsletter #7 broadcast status is
`sent`; the connector did not expose bounce/complaint counts in this readout.

**Notes for tomorrow (08-28, Fri):**
- Verify the 10:17Z scheduled refresh fires normally. A second delayed day
  warrants hardening the scheduler/watchdog rather than relying on manual
  recovery.
- Recheck newsletter #7 bounce/complaint metrics in Resend before another send.
- Keep every conversion arm running to ~100 exposures; fix distribution to the
  new `/calendars/` page before judging its copy (0 visits since ship).
- Put lint hygiene in reliability work: exclude nested agent/build artifacts,
  then resolve the real tools-shared cache warning so `npm run lint` can become
  a useful gate.

---

## 2026-08-27 — Newsletter #7 sent (Aug 27–Sep 2 issue); cron drift recovered by dispatch

**Health first:** the 10:17Z refresh cron had NOT fired by 12:03Z (~1h46m
late; prior five days all fired 10:42–10:55Z). Inside the ~3h drift window,
so not a formal incident, but I didn't wait: recovered per playbook via
`gh workflow run daily-refresh.yml` (run 33070143723, green, 1m45s), commit
b2ef145 on main dated today 12:05Z. Watch tomorrow whether the scheduled
trigger resumes on its own; a late same-day scheduled run would just
produce a second (harmless) refresh commit. No open issues. awesome-coastal
PR #64: still open, no maintainer comments — keep watching.

**Primary action (Thursday ritual — newsletter #7):** full ritual executed:
facts regenerated from today's b2ef145 data → sync-audience (**1 added, 8
already present, 9 total; 0 unsubscribed**) → dry-run → recompute-check →
send. **Broadcast fbec3fb0-de21-471e-9255-37bd282de94d sent to 9
subscribers.** Issue: "Minus Tide Alert, Aug 27–Sep 2: La Push, Quillayute
River hits −0.49 ft Sat" — a neap-ish week, 6 Good windows across 3
stations (La Push 70/67, Garibaldi 65/61, Newport 64/61), 0 Great+.
Recompute-check: all six windows verified to the decimal against
docs-internal/facts/{la-push-wa,garibaldi-or,newport-or}.json (lows, times,
walkable windows, arrive-by, scores); species block matches la-push-wa
species_last60d_5km exactly; all four links fetch 200.

**Template-boundary decision:** yesterday's note wanted the Sep 5–10 Puget
Sound Labor Day run as the lead body, but the established template renders
the current issue week only (Aug 27–Sep 2) and has no look-ahead section
(verified in send-weekly.mjs). Hand-adding one would exceed the 2026-07-19
standing approval (windows + article links only), so I sent the template
as-is. The Labor Day run lands naturally in next Thursday's issue
(Sep 3–9 covers Sep 5–9) — no owner action needed.

**Gates:** no site content changed — docs-only commit (JOURNAL). No build
required. Diff reviewed.

**Velocity:** 0 new articles (week 08-23–08-29: 0/5), 0 stations.
F-passes this week: 2/2 already done (08-24, 08-26).

**Metrics (PostHog, 7d, host-filtered):** 208 uniques (up from 179). Top
paths: king-tides guide 40, home 34 pv/30 uniq, king-tides hub 20,
methodology 20, DMTI dataset 11, oregon calendar 11, fitzgerald 9,
acadia 9, seattle 2026-09 page 10 pv/8 uniq, seattle hub 8, finder
7 pv/6 uniq. Signups 1/7d (home) ≈ 0.5% — still under the 1.5% target.
Tool events 7d: station_selected 6, window_result_viewed 4.
exit_intent_shown +4 (≈30 all-time), 0 signups. No gate CTA events in the
last 7d window.

**Notes for tomorrow (08-28, Fri):**
- Check Resend bounce/complaint numbers on Broadcast fbec3fb0 (stop sends
  if complaints near 0.1%).
- Verify the 10:17Z cron fired ON SCHEDULE; two straight days of manual
  recovery = investigate the workflow (GitHub scheduled-run throttling of
  low-activity repos is the usual suspect) and journal as an incident.
- Gate readout due: article_gate_multi should cross ~100 post-ship
  uniques — tally all five arms separately.
- Refresh queue next: pacific-grove (07-05 vintage, oldest).
- Watch awesome-coastal PR #64; respond same-run if changes requested.

---

## 2026-08-26 — Distribution pass: first off-site directory submission (awesome-coastal PR)

**Health first:** refresh cron fired 10:52Z (green, 1m55s, ~35m drift),
commit 5ed6740 on main dated today. No open issues.

**Primary action (priority f — pass #2 of the 08-23 week, off-site):**
the P3 "submit to directories" item, untouched since launch, got its
first execution. Decision gate from yesterday's note: calendars_page
still shows 0 events, so off-site beat another on-site iteration.
Target chosen after a GitHub-wide sweep of awesome-lists:
**chrisleaman/awesome-coastal** (115 stars, actively maintained — last
external PR merged 2026-07-06; "resources for coastal engineers and
scientists", explicitly solicits data-sets/software via PR). Fit is
honest, not spam: intertidal fieldwork is scheduled around daylight
low tides, which is exactly what we compute. Submitted
**https://github.com/chrisleaman/awesome-coastal/pull/64** ("Add
Tidewindow to USA resources") from the owner's own account (no
personas): one 🆕 entry in the USA section — daylight windows from
NOAA predictions, 12 stations, heatmap, ICS feeds, CSV dataset, open
source. Every URL in the entry verified 200 at submit time
(/data/daylight-minus-tide-index/ — note the path is /data/, not
/datasets/). GitHub PR was the channel precisely because it needs no
account creation or third-party forms (autonomous-run constraint) and
the account is authentic.

**Gates:** no site content changed this run — docs-only commit
(JOURNAL/BACKLOG), no build required. Diff reviewed.

**Velocity:** 0 new articles (week 08-23–08-29: 0/5), 0 stations.
F-passes this week: 2/2 DONE (08-24 on-site, 08-26 off-site).

**Metrics (PostHog, 7d, host-filtered):** 179 uniques. Top paths:
king-tides guide 35, home 25 pv/21 uniq, oregon calendar 20,
king-tides hub 20, seattle 2026-09 month page 11 pv/9 uniq, seattle
hub 9, seattle 2026-08 page 9 pv/8 uniq, acadia 8, fitzgerald 8,
alki 7, finder 7 pv/6 uniq. Signups 1/7d (home) ≈ 0.6%. Gate events
7d: tool_gate 3 clicks / 0 reveals / 0 signups; **article_gate 1
click — first production article_gate event since the 08-07 ship**;
calendars_page 0; ics_url_revealed 0. Exit-intent: 26 impressions
since ship (precise count; yesterday's "~31" was an estimate — 7d
windows overlap, don't sum them), 0 signups, floor still far off.

**Notes for tomorrow (08-27, Thu):**
- NEWSLETTER #7 is the required primary: sync-audience → dry-run →
  recompute-check against fact sheets → send --owner-reviewed →
  journal Broadcast id. Lead body: Sep 5–10 Puget Sound Labor Day run
  (PT −1.11 ft Labor Day Great 80; Seattle Sep 8 −1.02 ft). Established
  template only — anything beyond windows + article links needs fresh
  owner OK.
- Watch awesome-coastal PR #64 for maintainer review each run
  (respond same-run if changes requested); journal merge when it lands.
- Gate readout at ~100 post-ship uniques per surface (~08-28 for
  article_gate_multi); tally all five arms separately.
- Refresh queue next: pacific-grove (07-05 vintage, oldest).

---

## 2026-08-25 — Refresh pass: cabrillo guide rolled to the remaining 2026 afternoon lows

**Health first:** refresh cron fired 10:51Z (green, 1m43s, ~34m drift),
commit 1055533 on main dated today. No open issues.

**Primary action (priority e — refresh pass, commit df090e5):** cabrillo
(07-03 vintage, oldest in the refresh queue, flagged yesterday) was still
leading with July's dawn lows as upcoming. Rolled fully forward: answer
box, description, and FAQs now sell the six usable dates left in 2026
(Oct 25, Nov 24–25, Dec 22–24); ranked table gains Nov 24 (−1.36 ft,
3:09 PM, 81 usable minutes — absent from the original) and a Dec 26
after-close near-miss row; July/Aug rows retired into a one-line record
note with their honest 2026-07-03 stamps (rolling data window can't
recompute them). New Sep–Dec month-cadence table surfaces the best angle
in the fresh data: November's AND December's single best-scored windows
(Nov 26, Dec 25) both land on the only two days Cabrillo closes. King
section now also names Jan 22 2027's Exceptional 90. Honest species fix:
the old text claimed sea hares "show up in our fact sheet's log" — no
longer true (60d log is now Pismo clams/beanclams/rock scallop); reworded
to past-tense July sighting + current list.

**Verification:** every surviving number re-checked against
docs-internal/facts/san-diego-ca.json regenerated today (all Dec/Nov/Jan
figures unchanged to the decimal; clipped-minutes arithmetic re-done).
All five external sources re-fetched at write time: NPS gate quote
verbatim-intact, tidepools 4:30 PM close, "0.7 or lower" threshold,
$20/$15/$10 fees + 7-day validity, Ladera 11PM–4AM and "Sunset Cliffs
(4 Lots) 2–4 a.m." curfews — all still supported. /2026-09/ month link
verified against PUBLISHED_MONTHS.

**Gates:** plain `npm run build` green, zero warnings (content-only).
Diff 1 file, 29+/20−, all intended. `updated: 2026-08-25` bumped
(real content change); dateModified verified in built JSON-LD.

**Velocity:** 0 new articles (week 08-23–08-29: 0/5), 0 stations.
F-passes this week: 1/2 — #2 must land Wed 08-26, Fri, or Sat (Thu is
newsletter). The P3 off-site directory item is still the named candidate.

**Metrics (PostHog, 7d, host-filtered):** 176 uniques. Top paths:
king-tides guide 34, oregon calendar 27, home 23 pv/19 uniq, king-tides
hub 17, seattle 2026-09 month page 11 pv/9 uniq, seattle hub 8, seattle
2026-08 page 10 pv/8 uniq, acadia 8, finder 7 pv/6 uniq. Signups 1/7d
(home) ≈ 0.6% — fourth week under the 1.5% target. Gate events 7d:
tool_gate 2 clicks / 0 reveals / 0 signups; calendars_page still 0;
exit_intent_shown +6 (~31 all-time).

**Notes for tomorrow (08-26, Wed):**
- F-pass #2 of the week is the natural primary: P3 off-site directory
  submission (untouched since launch), or iterate on-site if
  calendars_page shows any events by then.
- Thu 08-27 is newsletter #7: lead body is the Sep 5–10 Puget Sound
  Labor Day run (established template — windows + article links —
  stays inside the standing approval).
- Gate readouts: article_gate_multi likely crosses ~100 post-ship
  uniques ~08-28; tally all five arms separately.
- Refresh queue next: pacific-grove (07-05 vintage, now oldest).
- Exit-intent: extended to ~09-21 / ~100 impressions (accruing ~6/wk).

---

## 2026-08-24 — Conversion pass: king-tide surfaces routed into /calendars/; exit-intent extended again

**Health first:** refresh cron fired 10:55Z (green, 1m57s, ~38m drift),
commit 686c140 on main dated today. No open issues.

**Exit-intent readout (DUE today, extended from 08-10):** 25 impressions
all-time, 0 signups (source=exit-intent, host-filtered). Still far under
the §5 ~100-impression floor (+13 since 08-10) — EXTENDED again, honestly.
At ~6 impressions/week the floor is ~3 months out; re-check ~09-21 or at
~100 impressions. If it's still 0-for-N near the floor, the copy revisit
is the named next step.

**Primary action (priority f — conversion pass #1 of the 08-23 week,
commit a319cd7):** the king-tide cluster is the site's biggest traffic
pool (guide 30 uniq/7d #1, season hub 15 uniq/7d #4) but the season page
dead-ended at its EmailSignup — no route to /calendars/, the finder, or
the heatmap. Added a "Keep these dates" section (feeds pitch + finder +
heatmap, months-away-dates-get-lost angle). The guide's calendar bullet
now routes through /calendars/ too (was: four station-page links only),
matching the oregon-coast/puget-sound pattern. No new gate arm — the
page links into /calendars/ where the calendars_page source already
tallies, so the experiment table stays clean.

**Honesty catch (pre-push):** first draft claimed the feeds carry the
king-season lows "included" — FALSE for Garibaldi (all four of its
listed season lows score 47–59, under the feeds' Good >=60 bar) and
partially false at four more stations. Reworded to "every Good-or-better
window … and the whole season sits inside that range" (feed range
365d from generatedAt = through Aug 2027; season ends Mar 31 2027 —
verified against public/data-json).

**Gates:** plain `npm run build` green, zero warnings (app page +
link-level article edit; PIPELINE_REFRESH not run, consistent 08-18/
08-21/08-22 practice). Both links verified present in built output.
Diff 2 files, all intended. No new external links, no new tide numbers.
Article `updated:` not bumped (link-level reroute, same as 08-22).

**Velocity:** 0 new articles (week 08-23–08-29: 0/5), 0 stations.
F-passes this week: 1/2 — second must land by Sat 08-29 (don't bunch;
the P3 off-site directory item remains the untouched candidate).

**Metrics (PostHog, 7d, host-filtered):** 161 uniques. Top paths:
king-tides guide 30, oregon calendar 25, home 23 pv/19 uniq, king-tides
hub 15, seattle 2026-08 month page 11 pv/9 uniq, seattle 2026-09 month
page 9 pv/7 uniq, finder 7 pv/6 uniq. Signups 1/7d (home) ≈ 0.6% —
third week under the 1.5% target; capture is still the constraint.
Gate events 7d: tool_gate 3 clicks / 0 reveals / 0 signups;
calendars_page 0 (page is 2 days old).

**Notes for tomorrow (08-25, Tue):**
- Refresh queue next: cabrillo (07-03 vintage, oldest), then
  pacific-grove. Cabrillo is the natural priority-e primary.
- F-pass #2 of the week: P3 off-site directory item (untouched since
  launch), or watch calendars_page events and iterate on-site.
- Thu 08-27 is newsletter #7: lead body is the Sep 5–10 Puget Sound
  Labor Day run (established template — windows + article links —
  stays inside the standing approval).
- Gate readouts: article_gate_multi likely hits ~100 post-ship uniques
  ~08-28; tally all five arms (article_gate, multi, month_page,
  calendars_page, tool_gate) separately.
- Exit-intent: extended to ~09-21 / ~100 impressions (see above).

---

## 2026-08-23 — Refresh pass: puget-sound calendar rolled to the Sep 5–10 Labor Day run

**Health first:** refresh cron fired 10:43Z (green, 2m3s, ~26m drift),
commit 90c6747 on main dated today. No open issues. /calendars/ verified
deployed and live (HTTP 200, footer "Calendar feeds" link present) —
closes yesterday's deploy-verification note.

**Priority-b check (yesterday's flag):** the Sep 6–9 run entered the
14-day horizon, but it does NOT trigger priority b — no 90+ window and
no king event. Current data says it's a **Puget-Sound-only** event:
Port Townsend peaks Mon Sep 7 (Labor Day) at 80 Great (−1.11 ft,
7:20 AM), Seattle at 77 Great same day (−0.93 ft, 8:12 AM; deepest
−1.02 ft Tue Sep 8). Outer-coast WA/OR/CA lows all land pre-dawn
(score 0 Skip); OR gets only Fair Sep 9–10. The 08-14 sweep's
"Seattle −1.02 ft Sep 8" was right but it's a Good 68, not a Great
peak — the Great band is Labor Day itself.

**Primary action (priority e — refresh pass, commit 64160c4):** rolled
puget-sound-low-tide-calendar-2026 (FIRST in the refresh queue; top-CTR
GSC lander at 7.7%/pos 6.6) fully forward — it was still selling the
passed Aug 8–13 run in its answer box, description, first table, and
FAQs (only two sentences were side-fixed 08-22). New spine: the Sep
5–10 run as the year's last, with the Labor Day three-day-weekend angle
(Sat/Sun/Mon chances, holiday Monday the weekend peak, Tue Sep 8 the
deepest Seattle water left). July/Aug tables preserved as record with
their honest 2026-07-03/08-08 stamps. Also refreshed: PT-vs-Seattle
examples to Sep (52-min offset, 251-vs-220-min windows), species line
re-pulled (white-lined dirona 10 now #1), month-table verified still
matching current facts (unchanged), run-link now points at
/beaches/wa/seattle-wa/2026-09/. Caught + fixed my own draft error
pre-push: late August still has four shallow daylight minus tides
(Aug 25–28), so the table caption claims "every remaining window
better than Fair," not "every remaining minus tide."

**Recompute-check:** every number verified against
docs-internal/facts/{seattle-wa,port-townsend-wa}.json regenerated
today (08-23); "no weekend daylight minus tide after Sep 7" and "no
Seattle daylight minus tide after this run" cross-checked against
months_2026 (Oct–Dec daylight_minus_tides 0; PT's lone Oct one is
Mon Oct 5). Plain `npm run build` green, zero warnings (content-only
change). Diff: 1 file, 23+/23−, all intended. No new external links.

**Velocity:** 0 new articles (new week 08-23–08-29: 0/5), 0 stations.
F-passes this week: 0/2 — two must land by Sat 08-29; today was
priority-e on the strength of the top-lander staleness + the run
entering its 14-day window (the refresh IS the time-sensitive surface).

**Metrics (PostHog, 7d, host-filtered):** 172 uniques. Top paths:
king-tides guide 33, oregon calendar 26, home 27 pv/22 uniq,
king-tides hub 14, seattle 2026-08 month page 11, finder 9, seattle
2026-09 month page 6. Signups 2/7d (home 1, tool_gate 1) ≈ 1.2% —
second week under the 1.5% target. Gate events 7d: tool_gate 3 clicks
/ 1 reveal / 1 signup (still the only converting source);
exit_intent_shown +7.

**Notes for tomorrow (08-24, Mon):**
- **Exit-intent readout is DUE** (extended from 08-10): tally
  exit_intent_shown all-time vs newsletter_signup source=exit-intent;
  ~100-impression floor applies (was 12 on 08-10, +7 this week —
  likely another honest extension).
- F-pass #1 of 2 candidates: P3 off-site directory item (untouched),
  or a pathway from king-tides/oregon-calendar into /calendars/.
- Thu 08-27 is newsletter #7: the Sep 5–10 Puget Sound run is the
  natural lead body (established template — windows + article links —
  stays inside the standing approval).
- Refresh queue next: cabrillo (07-03 vintage), then pacific-grove.
- Gate readouts: multi arm likely hits ~100 uniques ~08-28;
  calendars_page baseline 0 at 08-22 ship.

**Health first:** refresh cron fired 10:42Z (green, 1m55s, ~25m drift),
commit 99520ad on main dated today. IndexNow in the cron log: 108 URLs,
HTTP 200. No open issues. Broadcast a9fd5234 (newsletter #6) status
"sent" (12:05Z 08-20); no bounce/complaint problems surfaced.

**Primary action (priority f — conversion pass #1, commit 634f5b6):**
the subscribable ICS feeds had no single home — a reader had to land on
an individual station page (or a tool result) to find a CalendarGate,
and the calendar-intent articles referenced the feeds only abstractly
("each station page above also offers a 12-month calendar feed", no
link). Shipped **/calendars/**: all 12 stations grouped by state, each
with spots, a live "N windows in the feed right now" count, and the
existing CalendarGate under a NEW source **calendars_page** so the
article_gate / article_gate_multi / month_page / tool_gate tallies stay
clean (tally calendars_page separately at future readouts). Honest
copy: email step disclosed up front, "on-screen tables are never
gated", subscribe-vs-download explained, prediction disclaimer +
methodology link. Wired in from the site footer ("Calendar feeds"),
/tools/ index card, llms.txt tools list, sitemap, and direct links from
the two calendar-intent articles (oregon-coast closing now links
/calendars/ instead of the abstract sentence; puget-sound closing adds
it). Chosen over the P3 off-site directory item: on-site was yesterday's
named candidate, and every listed surface funnels a page whose whole
offer converts (tool_gate is the best-converting source to date).

**Recompute-check:** all 12 rendered feed counts verified equal to
`grep -c BEGIN:VEVENT` of the corresponding public/ics file (seattle 74,
port-townsend 80, la-push 75, garibaldi 53, newport 64, charleston 60,
port-orford 69, monterey 71, pillar-point 73, la-jolla 78, san-diego 70,
bar-harbor 32); the count predicate mirrors buildIcs exactly (score
>= 60, windowStart within 365d of generatedAt). Plain `npm run build`
green (code touched is app pages only, not pipeline; PIPELINE_REFRESH
deliberately not run so the cron's data snapshot stays untouched —
consistent with 08-18/08-21 practice). All new internal links verified
present in built output; no external links added. Diff: 7 files, all
intended.

**Side-fix (same commit):** the puget-sound calendar article was
selling the passed Aug 8–13 run in present tense — "this week's run"
and "the trip picker will point you at August 8–13" (false since the
13th; the picker only surfaces future dates). Fixed those two
sentences minimally; the article's answer box, tables, and FAQs still
need a full roll-forward → added to the refresh queue AHEAD of cabrillo
on exposure (it's a top GSC lander: 6 clicks / 78 impr / 7.7% CTR /
pos 6.6 in the last 14d).

**Velocity:** 0 new articles (week 08-16–08-22 closes at 0/5), 0
stations. F-passes this week: 1/2 — the 08-21 plan to land both on
Sat+Sun miscounted the week boundary (Sun 08-23 starts a new week), so
the 08-16 week closes at 1 of 2. Journaled as a miss, not normalized;
the fix is not to bunch f-passes at week's end.

**Metrics (PostHog, 7d, host-filtered):** 170 pv / 147 uniques (deep-
neap floor continues). Top paths: king-tides 34, oregon calendar 26,
home 13, seattle 2026-08 month page 10, fitzgerald 9, finder 6.
Signups 2/7d (home 1, tool_gate 1) → signups÷uniques ≈ 1.4%, a hair
under target after two weeks above. GSC 14d: month pages are the
impression engine (seattle-08 746 impr, la-jolla-08 461, la-push-08
326, san-diego-08 246) — the /calendars/ offer sits one click from all
of them via the station-page gates and month-page "plan a visit" block.

**Notes for tomorrow (08-23, Sun):**
- **Priority b likely triggers:** the Sep 6–9 Great run enters the
  14-day horizon (Seattle −1.02 ft Sep 8 per the 08-14 sweep) — check
  band scores across WA/OR/CA in data-json first; if a 90+ or king
  event is inside 14d, the regional roundup outranks everything else
  queued. It would double as newsletter #7 body on Thu 08-27.
- New week's f-passes (2 required): candidates — P3 off-site directory
  item (untouched), or watch calendars_page gate events and iterate.
- ~08-24: exit-intent readout due (12 impressions at 08-10; apply the
  ~100-impression floor honestly — likely another extension).
- Verify /calendars/ deployed and live on Vercel (this session ended
  before the deploy finished); spot-check the footer link.
- Refresh queue order is now: puget-sound (top-CTR lander, stale run),
  cabrillo, pacific-grove.
- Gate readouts: no re-tally before ~100 post-ship uniques per surface
  (multi likely first, ~08-28); calendars_page is a new arm — record
  its baseline as 0 events at ship (2026-08-22).

---

## 2026-08-21 — Refresh pass: Oregon calendar rolled past Aug 11–14; gate readout extended (tiny-n)

**Health first:** refresh cron fired 10:49Z (green, 1m43s, ~32m drift),
commit 0481e3b on main dated today. No open issues. Broadcast a9fd5234
(newsletter #6) shows status "sent" (12:05Z yesterday); no bounce or
complaint problems surfaced.

**Gate readout (~08-21, P2) — verdict: EXTEND, all three arms tiny-n:**
- **article_gate** (13 station guides, shipped 08-07): 52 uniques since
  ship (fitzgerald 21, acadia 13, seattle 6, la-push 4, others ≤2) —
  below the ~100 floor. Production events: **0 clicks / 0 reveals /
  0 signups**. CORRECTION to yesterday's tally: the "1 article_gate
  click" was a localhost:4174 event from ship-day verification (08-07,
  acadia), not production — host-filter gate-event queries too.
- **article_gate_multi** (king-tides, shipped 08-12): 57 uniques since
  ship, full 1/1/1 chain (08-15) — promising, n=1, below floor.
- **month_page** (shipped 08-14): 0 signups; top month page seattle
  2026-08 at 8 pv/7d. Nowhere near judgeable.
- Re-check when station-guide uniques post-08-07 reach ~100 (~2-3
  weeks at current traffic) or king-tides post-08-12 uniques reach
  ~100 (~08-28 at ~6/day). No gateStations extension yet.

**Primary action (priority e — refresh pass, commit 43e04e8):** rolled
oregon-coast-minus-tide-calendar-2026 past the Aug 11–14 run it was
still selling as upcoming ("the reef won't wait past Friday the 14th")
a week after it ended. Chosen over cabrillo (older vintage) on
exposure: it's the #2 page at 26 pv/7d, cabrillo isn't in the top 25 —
same logic as the 08-18 la-jolla pick. Changes: answer box, both date
FAQs, August section, weekend section, and closing now lead with Sat
**Aug 29** (morning minus tide at all four stations — Garibaldi −0.25
ft 8:05 AM 65 Good, Newport −0.32 ft 7:41 AM 64 Good, Charleston −0.09
ft, Port Orford −0.004 ft — verified best remaining 2026 weekend
window by score sweep), the September fade, Oct 25, and a new Nov 22
Port Orford dusk mention (−0.51 ft, 4:09 PM, 60 Good). Added the
forward pointer: next Great-band daylight window on this coast is
**Jan 21, 2027 at Port Orford** (−1.89 ft, 5:12 PM, 76 — consistent
with the Port Orford guide's claim, re-verified today), next
coast-wide run May 7–9, 2027 (Exceptional May 8, Newport 97/−1.96
ft). July/Aug history preserved as record with honest stamps. Every
number from docs-internal/facts regenerated today; build green; diff
was the one article file.

**Velocity:** 0 new articles (week 08-16–: 0/5), 0 stations. F-passes
this week: 0/2 — today was priority-e, so BOTH f-passes must land
Sat 08-22 + Sun 08-23.

**Metrics (PostHog, 7d, host-filtered):** king-tides 39 pv, oregon
calendar 26, seattle 2026-08 month page 8, fitzgerald 8,
what-is-a-minus-tide 7, home 5. Signups 7d: 1 (tool_gate 08-16 era
tail); deep-neap traffic floor persists until the Sep 6–9 run.

**Notes for tomorrow (08-22, Sat):**
- **F-pass #1 of 2 (mandatory):** candidates — extend the strongest
  on-site pathway from king-tides/oregon-calendar into ICS/finder, or
  one P3 off-site listing item; journal whichever.
- ~08-23: Sep 6–9 Great run enters the 14-day horizon → priority-b
  regional roundup candidate (Seattle −1.02 ft Sep 8); check band
  scores across WA/OR/CA before writing.
- ~08-24: exit-intent readout due (12 impressions at 08-10; apply the
  ~100-impression floor honestly — likely another extension).
- Refresh queue next: cabrillo, then pacific-grove.
- Gate readout extended — do NOT re-tally before ~100 uniques; use
  host-filtered queries for gate events (localhost pollution).

---

## 2026-08-20 — Newsletter #6 sent (quiet week; audience 6→8)

**Health first:** refresh cron fired 10:49Z (green, 1m52s, ~32m drift),
commit d685441 on main dated today. No open issues. Broadcast 1dfede99
(newsletter #5) shows status "sent" in Resend; no bounce/complaint
problems surfaced.

**Primary action (Thursday ritual — newsletter #6):** sync-audience
pulled 8 distinct signup emails from PostHog — 2 new since issue #5
(an article_gate_multi signup 08-15 and a tool_gate signup 08-16), 6
already present, 0 unsubscribed; **audience 6→8**. Dry-run rendered a
genuinely quiet week: subject "Minus Tide Alert, Aug 20–Aug 26: a
quiet week on the coast", 0 Good-or-better windows at any station —
the template's built-in quiet-week rendering (honest "no station posts
a Good-or-better daylight window" plus one computed least-bad option).
Recompute-check against public/data-json/stations (d685441): all 65
windows Aug 20–26 across 12 stations score <70 — 0 Good+ confirmed —
and the least-bad line reproduces exactly (Seattle Wed Aug 26:
lowHeight −0.348 → −0.35 ft at 10:33 AM, window 9:05 AM–12:05 PM,
score 57, band Fair). Note: Port Townsend Sun Aug 23 ties at 57; the
composer's pick is fine (Seattle's is the true minus tide, −0.35 vs
+0.17 ft). Template output only — windows + disclaimer + unsubscribe,
no deviations — so within the 07-19 standing-approval scope; sent with
--owner-reviewed: **Broadcast a9fd5234-26a4-4da6-8774-111b3a9c0675 to
8 subscribers.** Watch bounce/complaint next run.

**Side checks (no site changes):**
- **Finder-landing GSC re-check (was due ~08-19):**
  /tools/tide-window-finder/ returns ZERO rows in `gsc-query.mjs pages
  28` — not even a 0-click row (0-click rows do appear, e.g. /about/),
  vs the 67-impr / pos ~52 baseline of 07-19. The 07-22 landing copy
  has not earned impressions; still below any judgeable sample. Don't
  re-title on this; the ZIP→nearest-station lookup (P3) remains the
  more plausible lever for that surface.
- **Gate tallies since the 08-07 ship (readout due ~08-21):**
  article_gate 1 click / 0 reveals / 0 signups; article_gate_multi
  full chain 1/1/1; tool_gate 5/3/3; month_page 0 signups;
  end_article 1 signup; exit_intent_shown 10 since 08-12. Tomorrow's
  readout must first check station-guide uniques since 08-07 against
  the ~100-unique tiny-n rule before judging article_gate.

**Velocity:** 0 new articles (week 08-16–: 0/5), 0 stations. No
f-pass yet this week — two are required by Sunday (Fri + Sat/Sun).

**Metrics (PostHog, 7d, host-filtered):** 137 pv / 127 uniques — down
from 174 on 08-18, the deep-neap floor (zero Good+ windows anywhere
this week). King-tides guide 36 pv, Oregon calendar 19, Fitzgerald 8,
home 7. Signups 2/7d → signups÷uniques ≈ 1.6%, second consecutive
week above the 1.5% target. Referrers: direct 33, DuckDuckGo 30,
Google 29, Bing 28, Yahoo 15, Ecosia 1 — still no AI referrers.
GSC 28d: Fitzgerald 13 clicks @ pos 7.0, king-tides 10 @ 6.1 (CTR
4.0%), seattle 2026-08 7 clicks / 931 impr, Puget Sound calendar 7 @
6.8 (CTR 5.6%).

**Notes for tomorrow (08-21, Fri):**
- article_gate readout is due — run the tiny-n uniques check first;
  tallies above. If judging, article_gate_multi is the only gate with
  a full conversion chain so far.
- f-pass #1 of the week (two required by Sunday). The readout, if it
  leads to extending gateStations, can itself count as the f-pass.
- ~08-24: exit-intent readout AND Sep 6–9 Great run enters the 14-day
  horizon (priority-b roundup candidate; Seattle −1.02 ft Sep 8).
- Refresh queue next: cabrillo, then pacific-grove.
- Watch Broadcast a9fd5234 bounce/complaint in Resend.

---

## 2026-08-18 — Refresh pass: la-jolla guide rolled to rest-of-2026

**Health first:** refresh cron fired 10:48Z (green, 1m59s, ~31m drift),
commit on main dated today. No open issues; gh CLI auth still good.
Broadcast 1dfede99 (newsletter #5) shows status "sent" in Resend, no
problems surfaced. No priority-b trigger: zero windows ≥80 in the next
14 days at any station (checked data-json); the Sep 6–9 Great run
enters the horizon ~08-24 as predicted on 08-14.

**Primary action (priority e — refresh pass, commit 9d347c2):** rolled
la-jolla-tide-pools-best-dates-2026 forward from its 07-03 vintage.
Chosen over cabrillo (same vintage) because la-jolla is the default
gate station on the king-tides guide — the top page at 54 pv/7d — so
its staleness had the most exposure. Changes: ranked table is now the
eight remaining Nov–Dec afternoon deep lows (July 13–17 dawn run
retired to a record-book sentence); month table Sep–Dec with an honest
partial-August line (from the 18th: 10 sub-+1.0 ft lows, 0 daylight
windows); near-term guidance rewritten around the Oct 10–12 zero-line
stretch (deepest −0.064 ft Sun Oct 11) and the Oct 25 season opener
(−0.366 ft, 3:27 PM, first minus tide back); species re-pulled —
Hamann's Aeolid is the new #1 at 111 obs (was Sorcerer's Dorid in
July), top-ten total now 538, all still sea slugs; FAQs updated to
rest-of-2026. Every number recompute-checked against
docs-internal/facts/la-jolla-ca.json regenerated today. July month
links swapped to the September calendar (October's page isn't
published until the Sep 1 rollover). Build green, diff was the one
article file only. Post-push, owner ran the site locally (serve out/):
home + article + Sep month page all 200, all content checks pass,
stale July-as-future copy gone.

**Velocity:** 0 new articles (week 08-16–: 0/5), 0 stations. This is
the week's first operator run (no runs 08-15–08-17).

**Metrics (PostHog, 7d, host-filtered):** 174 pv / 152 uniques —
down from 234 on 08-13, consistent with the neap lull (no deep
windows anywhere this fortnight). King-tides guide still dominant at
54 pv, then Oregon calendar 9, Fitzgerald 8, home 8, Acadia 7.
Signups 3/7d → signups÷uniques ≈ 2.0%, first week above the 1.5%
target. Notably the king-tides MultiStationGate produced its first
full conversion chain: 1 calendar_gate_clicked, 1 ics_url_revealed,
and 1 newsletter_signup all with source article_gate_multi (plus 2
tool_gate signups). exit_intent_shown 8/7d, still accumulating toward
the ~08-24 readout. Referrers: bing 45, direct 38, duckduckgo 34,
google 30, yahoo 16, ecosia 2 — no AI referrers yet.

**Notes for tomorrow (08-19, Wed):**
- Finder-landing GSC re-check is due (~08-19 per the 08-05 extension):
  `node scripts/gsc-query.mjs pages 28`, look at
  /tools/tide-window-finder/ impressions/CTR vs the 67-impr baseline.
- First f-pass of the week is due (two required by Sunday); Thursday
  08-20 is newsletter #6 (standing ritual), so f-passes likely Wed +
  Fri/Sat.
- article_gate readout ~08-21: tally article_gate, article_gate_multi,
  month_page separately — the multi gate already has a full chain.
- Refresh queue next: cabrillo, then pacific-grove.
- ~08-24: exit-intent readout AND the Sep 6–9 run enters the 14-day
  horizon (priority-b roundup candidate).

---

## 2026-08-14 — Month pages get plan-a-visit links + month_page signup (f-pass #2)

**Health first:** refresh cron fired 11:10Z (green, 1m47s, ~53m drift —
inside the envelope), commit 9d2e1f3 on main dated today. No open
issues. NOTE: the gh CLI auth from the 07-25 backlog item appears
FIXED — `gh run list` and `gh issue list` both worked without 401s;
checked off in BACKLOG.

**Primary action (priority f, conversion pass #2 of the week):** month
pages (/beaches/[state]/[slug]/[month]/) are where search clicks land
(seattle/pt/la-push 2026-08 CTRs 1.6–3.6% post-retitle; seattle 2026-08
was 8 pv this 7d) but below the window table they dead-ended: a
CalendarGate and prev/next buttons, no link to the station's field
guide, no tools pathway, no newsletter capture. Shipped (commit
c7d676c): a no-print "Plan a visit" block — station field guide (new
getStationGuide() lookup on existing station-guide frontmatter; every
station has one), Tide Window Finder, Trip Picker — plus an EmailSignup
with distinct **source=month_page**, chosen so the ~08-21 article_gate
/ article_gate_multi readout and tool_gate tallies stay uncontaminated.
Deliberately did NOT touch the king-tides guide (experiment surface) or
extend gates to regional-calendars (P2 says only after the readout).
Verified in built HTML: guide link, both tool links, and month_page
signup present on seattle-wa/2026-08. Build green, diff clean (2 files,
+37, no data churn).

**Why f over e:** week of 08-10 already has two refresh passes
(pillar-point 08-10, fitzgerald 08-11) but only one f-pass (08-12
multi-gate); playbook requires two f-passes/week.

**No priority-b trigger:** best window in next 14d is today's 89 at
La Push (tail of the Aug 11–14 run, already covered); next notable is
the Sep 6–9 Great run (Seattle −1.02 ft Sep 8) — watch as it enters the
14-day horizon around 08-24.

**Velocity:** 0 new articles (week: 0/5), 0 stations.

**Metrics (PostHog, 7d, host-filtered):** ~190 pv led by king-tides
79, Fitzgerald 13, Oregon calendar 12, home 11. Signups 3/7d
(2 tool_gate, 1 end_article). Referrers: Bing 58, direct 51, Google 39,
DuckDuckGo 27, Yahoo 23 — no AI referrers yet. GSC impressions still
climbing: 148→382/day over the last two weeks, position ~8.5. Flywheel
unchanged: pillar-point NOAA highs+lows queries dominate (the known
lows-only intent gap, P2).

**Tomorrow:** refresh-pass candidates cabrillo or la-jolla (07-03
vintage, stale July tables) — both now also linked from their month
pages, so staleness is more visible. Exit-intent readout ~08-24;
article_gate readout ~08-21 (add month_page to that query). Sep window
run enters the 14-day horizon ~08-24.

---

## 2026-08-13 — Newsletter #5 sent (Aug 13–19; audience 3→6)

**Health first:** no open issues (public API); today's refresh fired
11:11Z (~54m drift, inside the envelope, green in 1m48s), commit
f20ddf4 on main dated today.

**Primary action (Thursday ritual — newsletter #5, commit this run):**
sync-audience pulled 6 distinct signup emails from PostHog — 3 added
this week (the expected Newport tool_gate subscriber from 08-07, plus
an end_article signup 08-10 and a tool_gate signup 08-12), 3 already
present, 0 unsubscribed; the audience **doubled to 6** since issue #4.
Dry-run rendered the Aug 13–19 issue: subject "Minus Tide Alert,
Aug 13–Aug 19: La Push, Quillayute River hits −2.14 ft Thu", 23
Good-or-better windows across 8 of 12 stations, led by the week's one
Exceptional — La Push Thu Aug 13, −2.14 ft at 7:39 AM, walkable
5:20–10:00 AM, arrive by 6:39 AM, score 90 — with Seattle −1.91 ft
(88) and a four-station Oregon Great run behind it; CA correctly
empty ("Nothing Good-or-better… Central California, Southern
California"). Recompute-check: every station's height, time, window,
arrive-by, and score in the draft reproduced exactly from today's
public/data-json (f20ddf4), including the 23/1-Exceptional/13-Great
tallies and the 8-of-12 station count. Template is windows + article
links only — inside the standing-approval scope, no deviations — so
sent with --owner-reviewed: **Broadcast
1dfede99-fe13-4ddd-95f6-948545e34f2a to 6 subscribers.** Watch
bounce/complaint in Resend next run.

**Velocity:** 0 new articles (week: 0/5), 0 stations.

**Metrics (PostHog, 7d, host-filtered):** 234 pv / 215 uniques
(rising: 197 on 08-12, 195 on 08-11). Signups 3/7d — signups÷uniques
≈ 1.4%, closing on the 1.5% target (was ~0.6% at the 08-01 audit).
Top pages: king-tides 82, Oregon calendar 14, home 13, Fitzgerald 12,
Alki 11. Events 7d: newsletter_signup 3 (2 tool_gate, 1 end_article),
calendar_gate_clicked 3 (all tool_gate), ics_url_revealed 2,
station_selected 9, exit_intent_shown 9, trip_picker_run 3,
window_result_viewed 3. No article_gate_multi events yet (shipped
yesterday; readout ~08-21). Referrers: bing 57, direct 52, google 51,
duckduckgo 28, yahoo 26 — search now clearly multi-engine.

**Notes for tomorrow (08-14, Friday):**
- Refresh queue resumes: cabrillo, then la-jolla, then pacific-grove
  (all dated 07-03/07-04, and la-jolla is the king-tides guide's
  default gate station — worth de-staling before that page's traffic
  keeps compounding).
- Second f-pass of the week due by ~Sunday.
- ~08-19 finder-landing GSC re-check; ~08-21 article_gate readout
  (check article_gate and article_gate_multi separately); ~08-24
  exit-intent re-check.
- Check Broadcast 1dfede99 bounce/complaint rates in Resend.

---

## 2026-08-12 — F-pass: multi-station calendar gate on the king-tides guide

**Health first:** no open issues (public API; gh token still invalid —
owner item stands); today's refresh fired 11:11Z (~54m drift, inside
the envelope, green in 1m53s), commit fa7ae05 on main dated today;
IndexNow in the cron log: 108 URLs, HTTP 200. No Exceptional (90+)
window within 14 days at any station (checked data-json), so nothing
outranked the due conversion pass.

**Primary action (priority f — on-site conversion, commit 8491e72):**
first f-pass of the week, aimed at yesterday's note: the king-tides
guide is the runaway top page (69 pv/7d — 35% of site pageviews) but
ended in the generic end_article signup, while every station guide
ends in its CalendarGate. Shipped the multi-station design the
backlog had sketched for exactly this case: new `gateStations`
frontmatter + `MultiStationGate` component (station select wrapped
around the existing CalendarGate, keyed so reveal state resets on
switch), rendered on the king-tides guide with its four profiled
stations — La Jolla default-selected (the season's star and the
page's own verdict), then Newport, Bar Harbor, Seattle. Gate events
carry **source "article_gate_multi"**, deliberately distinct from
article_gate so the ~08-21 station-guide readout stays uncontaminated.
One routing sentence added to the article's "three ways to keep them"
list pointing at the picker; no `updated` bump (navigation copy, not
facts — same call as the a2e2377 gate rollout).

**Deliberate choice worth recording:** this front-runs the article_gate
verdict on ONE page rather than waiting for ~08-21. Rationale: the
generic signup it replaces had produced ~1 signup/7d site-wide, the
page holds a third of all traffic, and its readers are precisely
planning specific stations months out — the ICS feed is the honest
best next step for them regardless of which gate copy wins. If
article_gate_multi shows nothing by the readout, this reverts cleanly
(frontmatter line + branch).

**Gates:** build green zero warnings; no tide numbers changed
anywhere (diff is 4 files: component, page branch, frontmatter type,
article frontmatter + one sentence); exported HTML verified — select
present with all four stations and La Jolla default, generic signup
gone from the page, station guides and other generic articles
unaffected; no data-json churn. Unattended session, so no live-browser
click-through — the gate is a thin composition of the already-verified
CalendarGate; flagging here per protocol.

**Velocity:** 0 new articles (week: 0/5), 0 stations.

**Metrics (PostHog, 7d, host-filtered):** 197 pv / 192 uniques
(rising: 195 on 08-11, 166 on 08-10). Top pages: king-tides 69, home
12, Fitzgerald 12, Alki 9, Puget Sound calendar 8. Events 7d:
newsletter_signup 2 (tool_gate + end_article), calendar_gate_clicked
1 (tool_gate), ics_url_revealed 1, exit_intent_shown 7,
station_selected 1, window_result_viewed 1.

**Notes for tomorrow (08-13, Thursday):**
- NEWSLETTER #5 is the required primary: sync-audience (expect 3→4
  with the Newport subscriber) → send-weekly --dry-run →
  recompute-check against fact sheets → --send --owner-reviewed →
  journal the Broadcast id, watch bounce/complaint.
- Template must stay windows + article links only (standing approval
  scope); any deviation needs a fresh owner OK.
- After Thursday: refresh queue (cabrillo, la-jolla, pacific-grove);
  second f-pass of the week due by ~Sunday; ~08-19 finder-landing GSC
  re-check; ~08-21 article_gate readout (now also check
  article_gate_multi separately); ~08-24 exit-intent re-check.

---

## 2026-08-11 — Fitzgerald guide rolled forward: the Aug 11–14 run vs the 8 AM gate

**Health first:** no open issues (public API); today's refresh fired
11:06Z (~49m drift, inside the envelope, green in 1m53s), commit
374744e on main dated today.

**Primary action (priority e — refresh, commit 0463709):**
fitzgerald-marine-reserve-tide-pooling-2026 was next in the refresh
queue (dated 07-03, no update) and has become the #3 page by traffic
(12 pv/7d) — worth de-staling before more readers hit the passed July
table. Regenerated fact sheets from today's data, then: answer box now
pairs the standing Dec 23 inside-hours record with the live Aug 11–14
story (deepest remaining low −1.13 ft Wed Aug 12 5:12 AM, window ends
7:50 AM — ten minutes before the gate opens); July schedule table
replaced by a chronological rest-of-2026 table with the
inside-posted-hours column (Aug 11/12 zero minutes, Aug 13–15 20–45
min tails, Sep 27 2h40, Oct 25 3h10, Nov 24 3h15, Dec 23 3h30);
seasonal close schedule RE-VERIFIED at write time against the SMC
Parks hours page and corrected from the old two-step framing to the
actual four-step ladder (8 PM through Labor Day → 7 PM → 6 PM Oct 12 →
5 PM Nov 2); FAQs 1/2/5 rewritten to rest-of-2026 (42 remaining
daylight minus tides: 4/3/9/12/14); species re-tallied 2026-08-11
(opalescent 87, six slugs before the gumboot chiton at 36); deepest-8
record-book table kept with July rows honestly captioned as history,
six future rows re-verified against current predictions; July month
link swapped to the live Aug + Sep calendars; cross-link added to the
Pillar Point guide for the gate-free side of the same tide.

**Phrasing guard worth recording:** "year's last dawn minus tides"
was qualified to "last morning minus tides with usable daylight" after
checking data-json — Aug 25–27 and Sep 6–10 minus lows exist but
bottom out 1:32–5:05 AM with 0–29 lit minutes, all score 0.

**Gates:** build green zero warnings; every number in changed prose
recomputed against 2026-08-11 fact sheets (spot-list: −1.21/−1.13/
−0.84/−0.37/+0.23 Aug run; +0.19 Sep 27; −0.52 Oct 25; −1.64 Nov 24;
−1.86 Dec 23; −1.90 Dec 24); gate-math arithmetic hand-checked (45/10
min short of open; 2h40/3h10/3h15/3h30 inside closes); SMC hours page
fetched at write time; /beaches/ca/pillar-point-ca/2026-08/ and
/2026-09/ and /guides/pillar-point-tide-pools-2026/ all present in the
export; diff is the one article file only.

**Velocity:** refresh only — 0 new articles (week: 0/5), 0 stations.

**Metrics (PostHog, 7d, host-filtered):** 195 pv / 191 uniques
(rising: 166 on 08-10, 152 on 08-09). Top pages: king-tides 68, home
18, Fitzgerald 12, Alki 9, Acadia 8. Events 7d: newsletter_signup 2,
exit_intent_shown 7, calendar_gate_clicked 1, station_selected 1,
window_result_viewed 1, ics_url_revealed 1.

**Notes for tomorrow (08-12, Wednesday):**
- F-pass due (twice-weekly floor; first of this week): strongest
  candidate is routing the king-tides page — the runaway top page at
  68 pv/7d — harder into the finder/ICS/gates.
- Thursday 08-13: newsletter #5; sync should take the audience 3→4
  (Newport subscriber).
- Refresh queue after that: cabrillo, la-jolla, then pacific-grove.
- ~08-19 finder-landing GSC re-check; ~08-21 article_gate readout;
  ~08-24 exit-intent re-check.

---

## 2026-08-10 — Pillar Point guide rolled forward to the Aug 11–14 last dawn run; exit-intent verdict extended

**Health first:** no open issues (public API; gh token still invalid —
BACKLOG owner item stands); today's refresh fired 11:27Z (~70m drift,
inside the envelope, green in 1m42s), commit 0217704 on main dated today.

**Primary action (priority e — refresh, commit af4719a):**
pillar-point-tide-pools-2026 was the stalest CA guide (dated 07-03, no
update) and the highest-value one — 129 GSC impressions at 0 CTR. Its
best-8 table was entirely passed July dates. Regenerated fact sheets,
then: new answer box and best-8 table leading with the Aug 11–14 run
(deepest Tue −1.21 ft 4:29 AM; pick is Wed Aug 12 −1.13 ft 5:12 AM,
score 56) plus the Sep 26–28 dusk pivot visible in the same table;
month table now starts at a clearly-labeled partial August row with
July retired to an honest record-book caption (07-03 stamps kept);
added the Nov 22–27 six-consecutive-afternoon-minus-tides preview;
species re-pulled at 2026-08-10 (451 obs, 92% slugs, Heath's Dorid in,
Fisher's Aeolid out); FAQs 1/2/5 rewritten to rest-of-2026 framing;
July-calendar internal link moved to the live 2026-08 month page.

**Framing choice worth recording:** the run is Fair-band only, and the
article says so plainly ("a class below July's") — it also states that
Aug 11–14 are the year's last morning minus tides clearing the 30-lit-
minute daylight floor (verified against windows data: the only later
AM minus lows, Aug 26–27, get 10 and 29 lit minutes and score 0).

**Experiment judgment (P2 item due today) — exit-intent EXTENDED, not
judged:** 12 impressions all-time, 0 signups — far below the §5
~100-impression floor. Per the tiny-n rule the observation window is
extended; re-check ~08-24 or at ~100 impressions, whichever first.
No copy changes made on this n.

**Gates:** build green zero warnings; every number in changed prose
recomputed against 2026-08-10 fact sheets (spot-list: −1.21/−1.13/
−0.84/−0.37/+0.23 Aug run; +0.60/+0.19/−0.11 Sep; −1.77 Nov 25; −1.86/
−1.90 Dec); no new external links; /beaches/ca/pillar-point-ca/2026-08/
verified present in the export; diff is the one article file only.

**Velocity:** refresh only — 0 new articles (week: 0/5), 0 stations.

**Metrics (PostHog, 7d, host-filtered):** 166 pv / 162 uniques
(rising: 152 on 08-09, 141 on 08-08). Top pages: king-tides 53, home
19, Alki 9, Acadia 9. 14d events: newsletter_signup 2 (tool_gate +
end_article), calendar_gate_clicked 4, station_selected 7,
window_result_viewed 6; article_gate still 0 clicks (judge ~08-21).

**Notes for tomorrow (08-11, Tuesday):**
- Refresh queue next: the other three 07-03 CA guides (Fitzgerald,
  Cabrillo, La Jolla) — Fitzgerald shares today's regenerated
  pillar-point-ca facts, so it's the quickest follow-up.
- First f-pass of the new week is due by ~Wednesday; candidate: route
  the king-tides page (top page, 53 pv/7d) more strongly into the
  finder/gates.
- Thursday 08-13: newsletter #5; sync should take the audience 3→4
  (Newport subscriber).
- ~08-19 finder-landing GSC re-check; ~08-21 article_gate readout;
  ~08-24 exit-intent re-check.

---

## 2026-08-09 — Priority-f pass #2: /embed/ badge outreach pitch shipped (P3)

**Health first:** no open issues; today's refresh fired 10:54Z (~37m
drift, green in 1m48s), commit 5153c6e on main dated today.

**Primary action (priority f, distribution — the week's second f-pass,
meeting the twice-a-week floor):** took the BACKLOG P3 "badge outreach
page" item. /embed/ previously showed only the generator plus one intro
paragraph; it now makes the full inbound pitch: three cards (what the
badge shows / how it stays current / what it costs), a who-it-fits
paragraph (friends-groups, naturalist programs, surf shops, nature
centers, inns, beach-town blogs), an honest fine-print list, a
station-request CTA into /contact/, and a calendar cross-link to
/beaches/. Every claim verified before writing: badge = highest-scoring
window of the next 30 days (scripts/pipeline/run.mjs bestForBadge),
regenerated daily by the cron, 320×86 iframe. Deliberately did NOT claim
"no tracking" — read the actual badge HTML first and found the per-load
PostHog ping (station id + referrer hostname, per-badge distinct_id), so
the fine print discloses the ping and scopes the privacy claim to what
the source guarantees: no visitor identifier, nothing stored in the
visitor's browser.

**Why not a directory submission:** the other P3 off-site items
(directories, awesome-lists) generally require creating accounts or
submitting third-party forms — outside what the autonomous operator may
do. Left in the queue; if a genuinely account-free listing surfaces,
take it, otherwise it is an owner task.

**Side-fix:** /contact/ still said reply to the newsletter "once the
newsletter is live" — stale since go-live 2026-07-23; de-staled.

**Gates:** build green zero warnings; no new external links; internal
links (/methodology/, /contact/, /beaches/) resolve in the export; diff
is the two src files only (no public/ churn); rendered /embed/ verified
in a local static serve including a generator click-through (Newport →
preview + snippet render).

**Velocity:** 0 new articles (week: 0/5), 0 stations.

**Metrics (PostHog, 7d, host-filtered):** 152 pv / 147 uniques (rising:
was 141 yesterday, 122 on 08-07) / 1 signup (the 08-07 Newport
tool_gate one). Top pages: king-tides 46, home 20, Alki 9, Acadia 9,
seattle 2026-08 month page 6, finder 6. exit_intent_shown 6, exit-intent
signups 0; article_gate still 0 clicks; station_selected 3,
window_result_viewed 3.

**Notes for tomorrow (08-10, Monday):**
- Judge exit-intent per the P2 item: currently 6 impressions / 0
  signups — far below the ~100-impression floor in §5, so the honest
  call is an extension; journal it as such.
- Refresh queue (priority e): the four CA station guides are next.
- Thursday 08-13: newsletter #5; verify sync picks up the Newport
  subscriber (audience should go 3→4).
- ~08-19: finder-landing GSC re-check; ~08-21: article_gate readout.

---

## 2026-08-08 — Puget Sound calendar rolled forward to the Aug 8–13 run; first gate conversion landed

**Health first:** no open issues; today's refresh fired 10:52Z (~35m
drift, green in ~1m46s), commit c55b5c2 on main.

**Primary action (priority e — refresh, commit b025d62):**
puget-sound-low-tide-calendar-2026 still led with the passed July 11–16
run on the very morning its Aug 8–13 run began. Regenerated fact sheets
(facts.mjs), then: new answer box + "What's left in 2026" table leading
with the current six-day run (Sun Aug 9: Seattle −1.91 ft @ 8:29 AM
score 98 / PT −2.05 ft @ 7:38 AM score 100; deepest Tue Aug 11 −2.63
ft), July tables kept as record-books in past tense (07-03 stamps
retained honestly), weekend FAQ rewritten, species + arrive-by example +
trip-picker line refreshed, Seattle month link July→August. `updated:
2026-08-08`.

**Recompute-check caught three would-be errors before push** (the gate
works): a "nothing deeper than −1.0 ft remains" claim falsified by
Seattle's Sep 8 −1.02 ft window (→ −1.11 ft at either station, exact);
the Aug 8→9 drift step is 61 min, outside my "45 min to an hour" phrasing
(→ "roughly"); and "Labor Day is the only weekend option left" missed
PT's Sun Sep 6 −1.08 ft Good-74 window (→ FAQ lists both). Every number
in changed prose re-verified against 2026-08-08 fact sheets.

**Milestone — first calendar-gate conversion with attribution:**
2026-08-07 15:00 ET, a visitor on /beaches/or/newport-or/ ran the full
funnel calendar_gate_clicked → ics_url_revealed → newsletter_signup
(source tool_gate — post-deploy of yesterday's source tagging, so
attribution works in production). List should go 3→4 at Thursday's
sync-audience. article_gate: 0 clicks day 1 (n tiny, judgment ~08-21).

**Velocity:** refresh only — 0 new articles (week: 0/5), 0 stations.

**Metrics (PostHog, 7d, host-filtered):** 141 pv (rising vs 122
yesterday) / 1 signup (the Newport one). Funnel events above; tool_gate
now measurable end to end.

**Notes for tomorrow (08-09, Sunday):**
- Priority-f pass could go off-site (P3 distribution item) — still zero
  off-site items this week; or refresh the four CA station guides
  (priority e queue).
- 08-10: judge exit-intent (extend if n still tiny — likely).
- Thursday 08-13: newsletter #5; sync should pick up the Newport
  subscriber (verify 4 contacts post-sync).
- ~08-21: first article_gate readout vs the 08-07 baseline (27 pv/27
  uniques/0 clicks).

---

## 2026-08-07 — Priority-f pass #2: station guides now end in the station's calendar gate

**Health first:** no open issues; today's refresh fired 11:09Z (green,
~52m drift — well inside the envelope) and commit 6a52c25 landed on main,
resolving yesterday's "verify the 08-06 commit" note (08-06 fired 12:20Z,
commit 62b0564). Newsletter #4 (Broadcast 2bf7020a) status "sent"; all 3
audience contacts intact, zero unsubscribes.

**Primary action (priority f, on-site — commit a2e2377):** the
email-gated 12-month ICS calendar (CalendarGate) existed only on tools
and station/month pages; guide articles ended in the generic weekly-alert
signup. Station-guide articles are where station intent is hottest
(Acadia is the #3 page site-wide), so:
- New optional `station:` frontmatter field; the article page then swaps
  the generic EmailSignup for that station's CalendarGate, with a
  one-line lead-in ("take these dates with you"). Unknown slugs fail the
  build (getStationData throws), so typos can't ship.
- CalendarGate gained a `source` prop (default `tool_gate` unchanged);
  article instances emit `article_gate` on calendar_gate_clicked,
  newsletter_signup, and ics_url_revealed, so the experiment is
  attributable in PostHog.
- Tagged all 13 station-guides (Acadia→bar-harbor-me, Alki→seattle-wa,
  Fort Worden→port-townsend-wa, La Push, Pacific Grove→monterey-ca,
  Pillar Point + Fitzgerald→pillar-point-ca, Cabrillo + La
  Jolla→san-diego-ca/la-jolla-ca, Port Orford, Sunset Bay→charleston-or,
  Yaquina Head→newport-or, Haystack→garibaldi-or). Non-station articles
  keep the generic signup.
- Verified: PIPELINE_REFRESH build green zero warnings; pipeline-churned
  public/ files reverted (cron owns those); rendered HTML checked for
  gate-on-station-guide and generic-signup-elsewhere; interactive
  click-through (button → station-headline email form) tested on a local
  static serve — form NOT submitted (a real submit would land a fake
  signup in PostHog and, via sync-audience, in Resend). One
  calendar_gate_clicked fired from localhost during testing; host-filtered
  queries already exclude it.

**Experiment baseline (recorded per §5, judge ~08-21 or at ~100 station-guide
uniques post-change):** last 7d the 13 station guides drew 27 pv / 27
uniques; calendar_gate_clicked 0 (all sources, 7d); newsletter_signup 0.
Success looks like article_gate clicks > 0 and any attributable signup;
n will be small — apply the tiny-n rule honestly.

**Velocity:** 0 new articles, 0 stations. Week's article count: 0/5.

**Metrics (PostHog, 7d, host-filtered):** 122 pv / 118 uniques / 0
signups (was 119/114/0) — list stuck at 3. king-tides 26 pv (#1), home
20, Acadia 11, Alki 8, about 5. Tool events sparse: station_selected 2,
window_result_viewed 2, exit_intent_shown 2, trip_picker_run 0.

**Notes for tomorrow (08-08, Saturday):**
- Refresh queue (priority e) is now due: puget-sound-low-tide-calendar-2026
  (its Aug 8–13 run starts TODAY — check for passed-date copy) and the
  four CA station guides.
- 08-10: judge exit-intent (n likely still tiny — extend honestly).
- ~08-19: finder landing GSC re-check; ~08-21: first article_gate look.
- Off-site P3 distribution item still untouched this week — if Saturday's
  refresh is quick, consider pairing one listing submission.

---

## 2026-08-06 — Newsletter #4 sent: Aug 8–14 spring run leads, Port Townsend 100/100 Sunday

**Health first:** no open issues; 08-05 cron green. At the 12:03Z check
today's refresh had not yet fired — inside the ~3h drift envelope (recent
fires 11:35/12:20/12:18Z). Newsletter numbers come from committed
data-json (astronomical predictions, stable between refreshes), so
nothing sent depends on today's refresh. Still not fired at the 12:10Z
push — TOMORROW: verify an 08-06 "data: daily NOAA refresh" commit landed
on main (and log the fire time against the ~3h drift rule).

**Primary action (Thursday standing ritual — newsletter #4):**
1. sync-audience: 3 PostHog signups → 3 already present in Resend
   audience, 0 new, 0 unsubscribed (untouched).
2. dry-run rendered Aug 6–12 issue: subject "Minus Tide Alert, Aug 6–Aug
   12: Port Townsend hits -2.05 ft Sun"; 26 Good+ windows across 7 of 12
   stations.
3. Recompute-check PASS — independently recounted from
   public/data-json/stations/*.json: 26 Good+ (10 Exceptional / 8 Great /
   8 Good) exactly matches the draft; every height/time/window/score
   spot-checked across all 7 stations (PT Sun −2.049→−2.05 @ 7:38 AM,
   walkable 5:00–10:50, arriveBy 6:38 ✓; Seattle −1.908 @ 8:29 ✓; La Push
   Wed −2.313 @ 6:58 ✓; Newport −1.913 @ 6:46 ✓; Garibaldi −1.767 ✓;
   Charleston −1.715 ✓; Port Orford −1.742 ✓; all "also" rows ✓).
   "Nothing Good+ in Central CA / SoCal / New England" verified (monterey,
   pillar-point, la-jolla, san-diego, bar-harbor all zero Good+).
   Digit-stripped diff vs the 07-30 issue confirms structure identical —
   template + computed windows + article links only, so the 07-19
   standing approval covers it (no fresh owner OK needed).
4. Sent: Broadcast **2bf7020a-f510-4fdd-bb37-ec1391568319** to 3
   subscribers, Resend status "sent" 12:05:34Z. Unsubscribe placeholder
   present. Watch bounce/complaint next run.

**Velocity:** 0 new articles (newsletter run). No station adds. No build
needed — diff is drafts + JOURNAL + BACKLOG only.

**Metrics (PostHog, 7d, host-filtered):** 119 pv / 114 uniques / 0
signups (was 142/124/1) — signups÷uniques 0% this week; list stuck at 3.
king-tides 27 pv (#1), home 19, Acadia 11, about 5, seattle 2026-08 4,
finder 3. Tool events: station_selected 3, window_result_viewed 4,
exit_intent_shown 4 (still 0 attributable signups — judgment 08-10).

**Notes for tomorrow (08-07, Friday):**
- Priority-f pass #2 is due by Saturday — do it tomorrow: either one
  off-site P3 distribution item, or route the Acadia guide (steady #3
  page) into ICS/newsletter pathways. Capture is still the constraint
  (0.6→0% signup rate vs 1.5% target).
- Refresh queue (priority e) if f is somehow blocked:
  puget-sound-low-tide-calendar-2026 (check for passed dates; the Aug
  8–13 run it covers is now current) and the four CA station guides.
- 08-10: judge exit-intent (4 shown / 0 signups — n still tiny; likely
  extend).
- ~08-19: finder landing copy re-check. Next monthly GSC look: homepage
  position drift, san-diego 2026-08 CTR.

---

## 2026-08-05 — Verdict on the 07-19 retitle: qualified win. Month pages now click; Pillar Point + La Jolla don't — and the data says it's intent, not titles

**Health first:** no open issues. At the 12:07Z check today's scheduled
refresh had not yet fired — inside the ~3h drift envelope (recent fires
11:35/13:21/12:20Z); see cron postscript. Today's edits are journal/backlog
only (no tide numbers), so nothing published depends on today's refresh.

**Cron postscript:** fired 12:18:41Z (~2h drift, inside the envelope),
green in ~2m; data commit 1861136 landed on main at 12:20:29Z, rebasing
cleanly over this morning's 12:08Z editorial push (push-retry now 4-for-4
against mid-day editorial commits). The 08-03 past-3h fire remains a
one-off — no drift pattern this week; keep watching per the
don't-normalize rule.

**Primary action (BACKLOG P2, scheduled for today — judge the 2026-07-19
CTR retitle):** per §5, judged on GSC date + page dimensions, post-change
window 07-20→08-03 (15d, GSC lags 2d) vs the recorded 07-19 baseline (28d).

**Verdict: qualified win — keep every new title, iterate nothing.**
- Site-wide (date dimension): 14d pre-retitle 33 clicks / 1,993 impr
  (1.66%); 15d post 42 / 2,170 (1.94%), daily avg position now mostly
  6–9 vs 10.7 baseline.
- The target class flipped. Beach/month pages went from 0 clicks in the
  entire 28d baseline to ~12 clicks post: seattle 2026-08 4/257 (1.6% @
  7.3, was 0/45), seattle 2026-07 3/139 (2.2%), la-push 2026-08 2/102
  (2.0%), port-townsend 2026-08 2/55 (3.6%), san-diego 2026-08 1/116
  (0.9%, was 0/41 — first click, still weak). Impression growth on
  2026-08 pages is partly seasonal (August arrived), but CTR is
  per-impression and that's what moved off zero.
- Retitled guides held or improved: king-tides 4/94 = 4.3% @ 6.4 (was
  3.6% @ 6.7); Acadia 3/131 = 2.3% @ 7.9 — the "low tide schedule" title
  words it gained now show pos ~8 vs 19–50 pre-retitle.
- Still failing, with judgeable n (≥100 impr per §5): pillar-point
  cluster 0/129 (station 0/66 @ 8.1, months 0/63) and la-jolla 2026-08
  0/128 @ 6.6. Query drill-down (page-filtered): la-jolla's impressions
  are 100% anonymized — zero visible query rows, nothing to diagnose
  from; pillar-point's few visible rows are people hunting NOAA annual
  tide-table PDFs for station 9414131 — i.e. highs+lows chart intent our
  lows-only pages don't serve. That is evidence for the existing P2
  "publish daily high/low pairs" pipeline decision, not for another
  retitle. Do NOT iterate these two clusters' titles; route the problem
  to the highs+lows item (BACKLOG P2 updated with this evidence).
- Homepage 0/16 @ 20.6 (was 0/22 @ 5.3) — n far too small, extended
  window; note the position slide to ~21 and re-check with the next
  monthly look.

**Also checked while in GSC — the 07-22 finder landing copy (baseline
0/67 @ ~52, 28d):** post-window 0/49 @ 41.5. Impression rate up
(2.4→3.3/day) and position better, but composition is still ~80%
movie-piracy junk ("low tide on demand/dvdscreener/…"); the only
real-intent rows are "when is the next low tide" (2 impr @ 21.5) and
"when is low tide at my location" (1 impr @ 29). Under 100 impressions →
tiny-n rule: NO verdict, window extended to ~08-19.

**Velocity:** 0 new articles (analysis run). No station adds. No build
needed — diff is JOURNAL/BACKLOG only.

**Metrics (PostHog, 7d, host-filtered):** 142 pv / 124 uniques / 1 signup
(flat vs 152/119/1); signups÷uniques 0.8% vs 1.5% target. king-tides 29 pv
(#1), home 22, Acadia 11, seattle 2026-08 6, finder 5. Tool events:
station_selected 4, window_result_viewed 5, exit_intent_shown 3.

**Notes for tomorrow (08-06, THURSDAY — newsletter #4 is the primary):**
- sync-audience → send-weekly --dry-run → recompute-check against
  data-json → send --owner-reviewed → journal Broadcast id, watch
  bounce/complaint. Lead is the Aug 8–14 Exceptional run. Scope
  unchanged (template + computed windows + article links only).
- Priority-f pass #2 due by Saturday (off-site P3 item, or route the
  Acadia guide into ICS/newsletter).
- 08-10: judge exit-intent (3 shown / 0 signups so far — small n).
- Refresh queue (priority e): puget-sound-low-tide-calendar-2026 (check
  for passed dates) and the four CA station guides.
- ~08-19: finder landing re-check. Next monthly GSC look: homepage
  position drift, san-diego 2026-08 CTR.

---

## 2026-08-04 — Oregon coast calendar refreshed: Aug 11–14 last-dawn-run now leads; July moved to the record books

**Health first:** 08-04 cron green, fired 12:20Z (~2h drift — back inside
the envelope, so yesterday's 3h04m fire stays a one-off for now; the
incident note stands). Data commit 2d661c8 landed on main; no open issues.

**Primary action (priority e — refresh, commit 123e903):** rewrote
oregon-coast-minus-tide-calendar-2026 (5 pv/7d, #5 guide). Its answer box
still told readers "if one trip is all you can manage, aim for July
13–16" — three weeks past — exactly one week before the Aug 11–14 run its
August section undersold in a single table. This was also the timeliest
possible refresh: OR content is now fresh before the traffic the run
should bring. Changes: answer box leads with Aug 11–14 (Newport −1.91 ft,
6:46 AM low, arrive 5:46); new Newport day-by-day run-shape table
(Aug 10–15, depth peaks Wed / daylight peaks Fri, 37–50 min lunar lag);
south→north sweep spelled out (PO 6:19 → Garibaldi 7:04, 45 min); Sat
Aug 15 surfaced as 2026's best remaining weekend window (all four
stations Good, morning lows −0.71 to −0.37 ft) in both prose and FAQ;
honest closer verified from facts: NO Great-band daylight window returns
in 2026 after Aug 14 (Nov/Dec dusk lows top out at 72). July tables and
the 13 Exceptional windows kept as historical record with original
2026-07-03 stamps, prose past-tensed. Aggregate Jul–Dec counts (198/117)
kept with stamps — the rolling data window can no longer recompute them
(starts today), and predictions haven't drifted. Light conversion touch
in the closer: station-page calendar feeds mentioned (this week's theme).
updated: 2026-08-04.

**Quality gates:** 24-check verification script PASS (run-shape table,
sweep times, Aug 12 + Aug 15 all-station rows, no-Great-after-Aug-14 via
months_2026 Sep–Dec maxima AND top-8 cutoffs, September deepest −0.57);
build green, 0 warnings; diff single-file; rendered page shows
"updated Aug 4, 2026".

**Velocity:** 0 new articles (refresh, not addition). Refresh cadence:
2 of the last 3 runs (08-02, 08-04) — inside the 30–50% band.

**Metrics (PostHog, 7d, host-filtered):** king-tides 25 pv, home 16,
Acadia 11, finder 7 (was 6 — watch, day-old post-conversion-pass),
seattle 2026-08 month page 7, this article 5. GSC not pulled today
(retitle judgment is tomorrow's job, with fresh 28d data).

**Notes for tomorrow (08-05, Wednesday):**
- PRIMARY per BACKLOG P2: judge the 07-19 CTR retitle — per-page GSC CTR
  vs the recorded baseline (31 clicks / 1.84K impr / 1.7% / pos 10.7;
  pillar-point 394 impr 0 clicks; beach/month pages 0% at pos 5–8).
  Remember the tiny-n rule (§5): pages under ~100 impressions since
  07-19 get an extended window, not a verdict. Also check the 07-22
  finder landing-copy baseline (67 impr / pos ~52 / 0 clicks) while in
  GSC.
- 08-06 (Thursday): newsletter #4 — Aug 8–14 Exceptional run leads;
  recompute-check against data-json as always; owner-reviewed scope
  unchanged (template only).
- Priority-f pass #2 due by Saturday (off-site P3 item, or route the
  Acadia guide into ICS/newsletter).
- Refresh queue: puget-sound-low-tide-calendar-2026 and the four CA
  station guides are next candidates — but the Puget roundup already
  covers Aug 8–13; evaluate whether the calendar's tables have passed
  dates first.
- 08-10: judge exit-intent (impressions vs signups, PostHog).

---

## 2026-08-03 — Conversion pass: king-tides page routed into finder/ICS/newsletter; stale calendar-gate copy fixed

**Health first:** no open issues. At the 12:04Z check the 08-03 scheduled
refresh had NOT yet fired (cron 10:17Z; recent fires 11:35/11:35/12:19Z —
inside the ~3h drift envelope, so not red by playbook §0.3). Monitored
through the session; see the cron postscript below for how it resolved.
Data-json and fact sheets current through 2026-08-02 either way; today's
edits touch no tide numbers, so nothing published depends on today's
refresh.

**Cron postscript (drift incident, logged per §0.3):** the scheduled run
fired at 13:21:19Z — 3h04m after the 10:17Z cron, the first fire past the
~3h line (recent history: ~1h20m twice, ~2h once). Run completed green in
~2.5m; data commit 1fbd139 landed on main at 13:23:44Z, rebasing cleanly
over my 12:10Z editorial push (push-retry fix now 3-for-3, and this run
proves the retry against a mid-day editorial commit, not just clean main).
IndexNow: 108 URLs, HTTP 200. No action needed today, but per the
don't-normalize rule: one fire past 3h is now on record — if it happens
again this week, treat it as a pattern and consider moving the cron
earlier (e.g. 09:47Z) or adding a late-fire alarm to the workflow.

**Primary action (priority f — first conversion/distribution pass of the
week, per yesterday's note):** the king-tides dates article is the site's
top page (28 uniques/7d ≈ 23% of all traffic; 8 GSC clicks/28d) and — alone
among high-traffic pages — linked to neither the Tide Window Finder nor the
calendar feeds, with no in-article signup mention (grep showed ~20 other
articles already link the finder). Commit 9f0fe1e:
- "Check your dates" CTA added directly after the main four-station table
  (peak scan position): fixed-travel-dates framing → finder.
- Planning section now ends in a three-way capture block: finder
  (check your own dates) / station-page ICS feeds (La Jolla, Newport,
  Bar Harbor, Seattle — "12-month calendar feed…arrive-by time and a
  reminder built in", claims verified against the generated .ics: Good+
  windows, arrive-by in DESCRIPTION, VALARM -PT45M) / Thursday email
  (matches live "Sent every Thursday" copy).
- Deliberate choices: `updated:` frontmatter NOT bumped (no tide/data
  content changed; also keeps the 08-05 CTR-retitle judgment clean) and
  plain build, not PIPELINE_REFRESH (UI/content only — pipeline untouched).
- Side-fix (honesty): calendar-gate.tsx blurb still promised the weekly
  alert "(starting this season)" — stale since the 07-23 go-live and missed
  by the 5a51925 copy flip because it lives in the tool-gate path. Now
  "every Thursday." Site-wide grep confirms zero "starting this season"
  instances remain.

**Quality gates:** build green (0 warnings); all 7 internal link targets
verified present in out/; both changes exercised in the built site via the
local preview (article renders both CTAs; gate click reveals the corrected
blurb; no console errors); diff reviewed — only the 2 intended files.

**Velocity:** 0 new articles (5th consecutive non-article run is fine;
priority f is the week's mandated first pass). No station adds.

**Metrics (PostHog, 7d, host-filtered):** 152 pv / 119 uniques / 1 signup
(flat vs 155/123/1). Tool events remain thin: station_selected 5,
window_result_viewed 4, exit_intent_shown 5, finder page 6 pv. Baselines
for judging this pass in ~2 weeks: finder pageviews (6/7d), king-tides →
finder click-through (0 by construction), signups÷uniques 0.8% vs 1.5%
target. tool_gate signups to date: 0 — worth watching whether the
king-tides ICS bullet changes that.

**Notes for tomorrow (08-04, Tuesday):**
- Second priority-f pass is due by Saturday; strongest remaining candidate:
  off-site — ONE directory/listing submission from BACKLOG P3, or an
  on-site pass routing the Acadia guide (10 uniques/7d, #3 page) into
  finder/ICS (it links the finder twice already, but no ICS/newsletter
  mention).
- 08-05: judge the 07-19 CTR retitle per BACKLOG P2 (per-page GSC CTR).
- 08-06 (Thursday): newsletter #4 leads with the Aug 8–14 Exceptional run;
  roundup was verified fresh 08-02; template unchanged per owner-reviewed
  scope.
- Refresh queue (priority e): oregon-coast-minus-tide-calendar-2026 next.
- If today's cron logged a >3h drift or needed a manual dispatch, treat
  recurrence as an incident pattern per §0.3, not noise.

---

## 2026-08-02 — Golden-hour calendar refreshed to the Aug 10–13 last-dawn-run; Aug 8–13 roundup verified fresh

**Health first:** 08-02 cron green (11:35Z, 1m53s) and the data commit landed
on main (f0609c8, dated today) — the 07-31 push-retry fix is 2-for-2. No open
issues. Also pushed yesterday's stranded local commit b6123a9 (playbook
audit-driven updates) — it was committed 08-01 but never pushed.

**Priority b check (no changes needed):** with the Aug 8–14 Exceptional run
now 6 days out, verified the live Puget Sound Aug 8–13 roundup against
today's fact sheets — every low, time, window, and score matches for
Port Townsend, Seattle, and La Push (Aug 8–13), plus the OR cameo
(Newport −1.91 / Garibaldi −1.77 / Charleston −1.72 / Port Orford −1.74,
all Aug 12), Pillar Point −1.13 @ 5:12 AM, and Acadia Aug 15 −0.80 @ 7:16 AM.
featuredRoundup is live on the WA hub through Aug 13. NOAA predictions have
not drifted since 07-25; the roundup needs nothing before the run.

**Primary action (priority e — refresh):** rewrote
golden-hour-low-tide-photography-calendar-2026 — ALL 24 of its windows were
passed July dates (the most-stale article on the site). Backlog had
what-is-a-minus-tide as next, but inspection shows that article is not
stale (calendar-2026 aggregate constants, no passed dates) — corrected the
backlog note. The refreshed calendar tells the honest new story: Aug 10–13
is the year's last dawn run, and only the northern stations keep the light
(La Push −2.31 ft 48 min after sunrise Aug 12, score 90; Garibaldi 85;
Monterey and La Jolla now bottom 74–76 min BEFORE sunrise, Fair/Skip).
New material: sunset-side windows appear for the first time (both Skip —
honest "backlight still barely on the menu" framing), Rialto/Mora closure
advisory added for photographers (NPS quotes re-verified verbatim at write
time, conditions.htm added to sources), Monterey's late-December sunset-side
comeback (−1.73/−1.83 ft, score 80) framed as dormant-not-done, cross-link
to the Puget Sound roundup. All 24 table rows script-verified against
today's fact sheets (rounded lows, times, scores, azimuths, sun-edge
offsets); 14-of-24 minus-tide count script-verified; La Jolla species
updated (141 Opalescent Nudibranch, was 138 Sorcerer's Dorid). NOAA solar
glossary + NPS safety quotes re-verified. Build green; updated: 2026-08-02.

**Metrics (PostHog, 7d, host-filtered):** 155 pv / 123 uniques / 1 signup —
slightly up vs 145/114/1. Top pages: king-tides-dates 27, home 15, Acadia 10,
Fitzgerald 8, La Push 7. The golden-hour article is not in the top 10
(≈0–3 views/7d) — that near-zero is the baseline for judging this refresh
in a few weeks via GSC impressions on the page.

**Notes for tomorrow (08-03, Monday):**
- Priority f (conversion/distribution) has NOT yet run this week — due at
  least twice by Saturday; strongest on-site candidate: route the
  high-traffic king-tides page (27 views/7d, 8 GSC clicks/28d) into the
  finder + signup with an in-article "check your dates" CTA.
- 08-05: judge the 07-19 CTR retitle per BACKLOG P2 (per-page CTR, GSC).
- 08-06 (Thursday): newsletter #4 leads with the Aug 8–14 run — the
  roundup verified today is the source; template unchanged per the
  owner-reviewed scope formalized 08-01.
- Refresh queue: evaluate oregon-coast-minus-tide-calendar-2026 next.

---

## 2026-08-01 (evening, founder-present session) — PostHog project is Tidewindow-only again: PointsBrain moved to its own project

Vanessa upgraded PostHog; PointsBrain got a dedicated project ("pointsbrain",
id 538082) and left ours. Done this session (mostly on the rewards-os side —
see that repo's JOURNAL for the full record):

- All 530 PointsBrain events (pb_agent_visit / pointsbrain.com $pageview /
  $pageleave / pb_waitlist_signup, 2026-07-04 → 08-01) were copied into the
  new project with original uuids/timestamps. Vanessa then approved the
  purge: the 11 pointsbrain persons (verified zero Tidewindow events each)
  were bulk-deleted with delete_events — persons gone immediately, their
  423 pb_* events queued for PostHog's async deletion (~a day to vanish
  from queries). The ~107 anonymous pointsbrain.com $pageview/$pageleave
  events have no person profiles and cannot be deleted; playbook §1 says to
  exclude them ($host filter) when querying the shared-era window.
  pointsbrain.com production code no longer sends anything here (verified
  end-to-end: synthetic crawler hit landed only in 538082).
- Our personal API key is scoped to 495836 only (verified 403 on 538082);
  PointsBrain's new key can't see our project either. No key or capture
  changes on the Tidewindow side — site-config.ts key/settings untouched.
- Docs updated: playbook §1 shared-era note, posthog-setup.md,
  sync-audience.mjs comment (its Tidewindow-host filter was already
  defense-in-depth and stays).

**Metrics note:** any query over 2026-07-04 → 08-01 without a host filter
slightly overcounts by the ~107 leftover anonymous pointsbrain pageview/
pageleave events (the 423 pb_* events are deleting asynchronously and may
appear until the job runs). After 08-01 the project is clean by construction.

**Tomorrow:** normal queue. Nothing changed in our capture path; the 08-01
rollover entry below still governs content priorities.

**Health first:** 08-01 cron green (12:35Z, 4m01s) — first scheduled run
with the 07-31 push-retry + concurrency fix, worked cleanly. No open
issues. Fact sheets and data-json fresh (2026-08-01).

**Primary action (priority c — monthly rollover, commit ad32a5b):** added
"2026-09" to PUBLISHED_MONTHS in src/lib/rollout.ts. Staged-rollout gate:
Bing `site:` checks are captcha-blocked via fetch now, but we have GSC —
which shows the previous batches indexed AND earning: seattle-wa/2026-07
340 impr / 5 clicks, seattle-wa/2026-08 173 impr / 2 clicks,
pillar-point-ca/2026-08 179 impr, port-townsend-wa/2026-08 5.7% CTR at
pos 7.0 (28d). Gate passed on the stronger signal. September data
verified present for all 12 stations in committed data-json before the
flip. Build green; 12 new pages + 12 new sitemap entries; recompute
spot-check of seattle-wa/2026-09 vs data-json passed (19/19 dates, best
window Mon Sep 7 −0.93 ft → renders "−0.9 ft" per template rounding,
8:12 AM low, 6:25 AM window start all match). Deploy verified live
(~1 min), IndexNow submitted 108 URLs HTTP 200.

**Metrics (PostHog, 7d, host-filtered):** ~145 pv / 114 uniques /
1 signup — flat vs last week (151/133/1); the Jul 29 spike (32 pv day)
did not repeat. GSC 28d top movers: fitzgerald guide 10 clicks,
king-tides-dates 8, alki guide 7. Month pages are the impression
workhorses — more reason the Sept batch matters ahead of the Aug 8–14
run.

**Notes for tomorrow (08-02, Sunday):**
- Refresh queue (priority e): what-is-a-minus-tide remains top — its
  12-station tables are 07-03 vintage with passed FAQ dates.
- Aug 6 (Thursday) newsletter should LEAD with the Aug 8–14 Exceptional
  run (PT 100 / Seattle 98); consider whether the two live roundups need
  a freshness pass before then (priority b check).
- 08-05: judge the 07-19 CTR retitle per BACKLOG P2 (per-page CTR).
- 08-10: judge exit-intent (impressions vs signups).

---

## 2026-07-31 — Fixed the daily-refresh push race; recovered the lost 07-30 refresh

**Health first:** 07-30 cron FAILED — per playbook §2a this was today's only
task. Root cause from the run logs (30541153610): the pipeline, build, and
IndexNow all succeeded, but the final `git push` was rejected non-fast-forward
because yesterday's newsletter journal commit (272cc45) landed on main at
~12:07Z, mid-run. The day's data commit existed only on the runner and was
lost. Not a NOAA problem; a race between the cron and the Thursday editorial
push, which both start ~12:0xZ now that the scheduler delay is ~2h.

**Fix (30dc891):** the push step now retries up to 3x with a
`git pull --rebase origin main` between attempts — data commits touch only
pipeline output paths (public/data-json, public/ics, public/embed-badge,
docs-internal/facts), so rebasing over editorial commits cannot conflict.
Also added a `concurrency: daily-refresh` group so a manual dispatch can
never race the scheduled run.

**Recovery:** dispatched a manual run (30629289884) → success at ~12:07Z;
fresh data committed (f4232a1, 41 files) and Vercel deployed it. Data-json
and fact sheets are current through 2026-07-31. Today's scheduled run, if
the scheduler still fires it, will find no changes or a trivial diff and
is serialized behind the concurrency group either way.

**Resend check (side task, per yesterday's note):** Broadcast d3406658
status "sent", sent 12:06:52Z to the 3-subscriber audience; nothing
alarming visible on the broadcast object.

**Metrics (PostHog, 7d):** 151 pageviews / 133 uniques / 1 signup in the
trailing 7 days (the other 2 signups fell out of the window). No metrics
work today — fix-only run per playbook.

**Notes for tomorrow (08-01, Saturday):**
- MONTHLY ROLLOVER is due: add "2026-09" to PUBLISHED_MONTHS in
  src/lib/rollout.ts, after checking Bing `site:` indexing of existing
  month URLs per the staged-rollout rule.
- Confirm the 08-01 scheduled cron ran green with the new push logic.
- Refresh queue after rollover: what-is-a-minus-tide is still the top
  candidate.
- Aug 8–14 Exceptional run (PT 100 / Seattle 98) leads the Aug 6 issue.

---

## 2026-07-30 — Weekly newsletter #2 sent (Broadcast d3406658, 3 subscribers)

**Health first:** 07-29 cron green (12:22Z); today's had not fired at
12:03Z check — same ~2h scheduler-delay pattern, not alarming. No open
issues. Fact sheets and data-json fresh (2026-07-29).

**Primary action (Thursday standing ritual — newsletter):**
1. sync-audience: PostHog now shows **3 distinct signups** — a NEW one
   overnight: gewing@stetson.edu, 07-29 23:47 ET, source=end_article on
   **/guides/haystack-rock-tidepool-windows-2026/** — the article
   refreshed on 07-28. First evidence a refresh converted. Sync added 2
   (kuschs@, gewing@); audience now 3, 0 unsubscribed.
2. send-weekly --dry-run: Jul 30–Aug 5 issue, subject "La Push,
   Quillayute River hits -1.22 ft Fri", 25 Good+ windows across 7 of 12
   stations, 0 Exceptional / 4 Great — the quiet neap week as expected;
   copy does not oversell it.
3. Recompute-check (programmatic, vs public/data-json/stations/*.json —
   note: facts/*.json only carries best-8/month aggregates, so weekly
   windows verify against the canonical data-json): 25 low/score checks
   + 7 time/window/arrive checks all pass; week totals (25/7-of-12/0
   Exc/4 Great) match; negative claim (no Good+ in CA or New England)
   verified across all 5 remaining stations incl. san-diego; species
   block (Horned Nudibranch 66, Frilled Dogwinkle 10, Black Tegula 10)
   matches la-push facts. Unsubscribe placeholder confirmed in send
   path (dry-run substitutes it for preview — by design, line 265–266
   of send-weekly.mjs); prediction disclaimer present.
4. send-weekly --send --owner-reviewed → **Broadcast
   d3406658-acd0-4eb6-88f8-dbfac9a7dd60 sent to 3 subscribers** ~12:07Z.
   Bounce/complaint: nothing at send time; check the Resend dashboard
   metrics tomorrow.

No site content changed today (send-only run) — no build needed; diff
is drafts + journal + backlog only.

**Metrics (PostHog, host-filtered):** 07-29 was the best day yet —
**32 pv / 22 uniques** (broad, no single driver: king-tides guide 3,
Seattle 2026-08 month page 3, Fitzgerald guide 3). 7d referrer uniques:
**Google 30 now leads** (DDG 19, Bing 13, internal 11, direct 9,
Yahoo 5). Tools 7d: station_selected 5, window_result_viewed 3.
exit_intent_shown: 2 impressions 7d, no exit-intent signups yet
(judgment 2026-08-10). Signups: 3 all-time (+1 overnight); 3/62 weekly
uniques is comfortably past the 1.5% target but tiny-n.

**Notes for tomorrow (07-31, Friday):**
- Sat 08-01 is the monthly rollover: add "2026-09" to PUBLISHED_MONTHS
  in src/lib/rollout.ts — check Bing `site:` indexing of month URLs
  first per the staged-rollout rule.
- Refresh queue: what-is-a-minus-tide remains the top candidate — a
  refresh just demonstrably converted a reader, which raises the value
  of priority (e).
- Watch Resend for bounces/complaints on Broadcast d3406658 (3 sends).
- The Aug 8–14 Exceptional run enters the NEXT issue (Aug 6 send) —
  that one should lead with PT 100 / Seattle 98 / La Push 90s.

---

## 2026-07-29 — Trip-planning guide refreshed to Aug 8–14

**Health first:** Both crons green — 07-28 fired 12:15Z, 07-29 fired
12:22Z (the ~2h scheduler delay looks like the new normal; 8 green in a
row). No open issues. Fact sheets fresh (2026-07-29).

**Priority-queue walk:** (b) Aug 8–14 run remains covered by the two
live roundups; (c) rollover is Saturday; (d) P1 empty; so (e) refresh
pass, taking the top item queued yesterday.

**Primary action (priority e — refresh):**
how-to-plan-a-tidepooling-trip-around-minus-tides (commit 64c12ae). The
guide's every worked example was the passed July 13–16 run, present
tense. Rolled: answer box + arrive-by FAQ + step 3 now anchor on
Newport Aug 12 (−1.91 ft, 6:46 AM, arrive 5:46 AM); window-example
table now that window (179 of 285 daylight minutes — the 106 pre-dawn
minutes recomputed, not carried); threshold math now Newport August
(31 lows below +1.0 ft → 17 windows → 13 daylight minus tides → the
Aug 11–14 four-morning filter, all below −1.3 ft); best-time FAQ splits
past (July 13–16, Seattle −3.80 ft) from remaining (Aug 8–14, PT 100
Sunday); weekend FAQ gains the Aug 8–9 pointer; regional sections
past-tense July and lead with what remains, adding internal links to
the Puget Sound Aug 8–13 roundup and the OR hub, and fixing the stale
Newport 2026-07 month link. Year-scoped published tables (seasonal
month grid, 40-deepest weekend table, hour histogram) kept with their
honest 07-03 stamps; future claims inside them (La Jolla Dec 25 −1.72
ft 4:33 PM score 90, Aug 13 4:25 AM / 39 min) re-verified against
today's sheets. Programmatic recompute-check: 16 checks, all pass —
including "all four OR stations deepest on Aug 12" and Seattle's
zero daylight minus tides Oct–Dec. Plain build green, zero warnings,
one-file diff. Refresh, not an addition — trailing-7d additions: 2
(25th, 26th).

**Metrics (PostHog, host-filtered):** 07-28 held at 16 pv / 11 uniques
after the 07-27 spike (29/18) — no single-page driver, DDG-led. 7d
referrers: DDG 34, Google 30, direct 9, Bing 9. Tools 7d:
station_selected 4, window_result_viewed 2. **exit_intent_shown is
live in production: 1 impression 07-28, 1 on 07-29** — first real
impressions, no exit-intent signups yet (judgment 2026-08-10; note the
all-time exit_intent query timed out in HogQL, bound it by date).
Signups: none new; 2 subscribers all-time.

**Notes for tomorrow (07-30 — THURSDAY, SEND DAY):**
- Primary action is the weekly newsletter, per the standing ritual:
  sync-audience FIRST (audience is 1 of 2 — must pick up the 07-23
  kuschs@ signup), then send-weekly --dry-run, recompute-check the
  draft against fact sheets, then --send --owner-reviewed. Issue
  covers Jul 30–Aug 5; the Aug 8–14 run falls in the FOLLOWING issue
  (Aug 6), so this week's is the quieter neap issue — do not oversell
  it. Journal the Broadcast id; watch bounce/complaint.
- Sat 08-01: monthly rollover — add "2026-09" to PUBLISHED_MONTHS
  (check Bing site: indexing of month URLs first).
- Refresh queue: what-is-a-minus-tide is now the top candidate.

---

## 2026-07-28 — Haystack Rock guide refreshed to the Aug 11–14 run

**Health first:** Yesterday's cron worry resolved — the 07-27 "Daily data
refresh" ran green at 13:22Z (late by ~3h, GitHub scheduler delay as
suspected; 6 green in a row). Today's run had not fired yet when checked at
12:04Z — same delay pattern, not alarming; fact sheets are fresh
(generated 2026-07-27). No open issues (public API; gh CLI still needs
owner re-auth).

**Priority-queue walk:** (b) triggered — the Aug 8–14 run is inside 14
days with Exceptional windows (Port Townsend 100 on Sun Aug 9, Seattle
98; La Push 90s Aug 12–13) — but it is already fully covered: the
2026-07-25 Puget Sound roundup (featured on the WA hub through Aug 13)
and the OR hub roundup (through Aug 14). I verified the roundup's full
PT/Seattle table against the 07-27 fact sheets — every number still
matches. (c) rollover waits for Aug 1; (d) P1 queue is empty; so (e)
refresh pass.

**Primary action (priority e — refresh):** Haystack Rock guide (commit
234a8b6), the oldest stale article (published 07-02, untouched, spine =
the passed Jul 13–16 run). Rolled the spine to Aug 11–14 — conveniently
also "four mornings," and genuinely the year's last minus-tide dawn run
at Garibaldi (after it, deepest remaining daylight low is Dec 22's
−1.35 ft — verified). New best-8 table (computed 2026-07-27), month
table now Aug–Dec (fact-sheet months are forward-looking; July's row
can no longer be recomputed and was dropped), FAQ answers rolled
(lowest-2026 split into past/remaining, arrive-by → Aug 12 6:04 AM,
puffins → Aug 13/14), golden-hour pick now Aug 11 (6:18 AM low, 6 min
off the sun edge, best of the run), weekend pick Sat Aug 15. July 15's
−2.35 ft stays as explicit past-tense history per the 07-27 precedent.
Puffin claims (April–August presence, 8–11 AM viewing, second-largest
onshore colony, northeast grassy patch) re-verified verbatim from
haystackrockawareness.com/puffins at write time. Recompute-check ran
programmatically: 38 checks against the fact sheet, all pass (one
apparent failure was the checker's toFixed float artifact on −0.595 →
−0.60; site renders one decimal, −0.6, so −0.60 is right). Plain build
green, zero warnings; diff reviewed, one file only. This was a refresh,
not an addition — trailing-7d additions stay 2 (25th, 26th).

**Metrics (PostHog, host-filtered):** 07-27 spiked to 29 pv / 18 uniques
(recent baseline 6–16), driven by duckduckgo (18 refs that day; 33 over
7d vs google 27 — DDG is now the top 7d referrer). Spread across pages:
king-tides 4, La Push hub 3, La Push guide 3, /beaches/ 3. 7d top pages:
home 14, Acadia 10, OR calendar 8, Fitzgerald 8, king-tides 7. Signups:
none new; all-time stays 2 distinct subscribers (the 07-23 tool_gate
event double-fired but is one email — kuschs@). exit_intent_shown:
zero impressions so far (shipped 07-27; desktop-only + 2nd-pageview +
top-edge gates make impressions naturally rare at this traffic).

**Notes for tomorrow (07-29):**
- Verify the 07-28 cron eventually fired green (pattern: 1–3h late).
- Thursday 07-30 is send day: sync-audience FIRST (audience currently 1
  of 2 — must pick up kuschs@), then dry-run → recompute-check →
  --send --owner-reviewed. Issue covers Jul 30–Aug 5.
- Next refresh candidate: how-to-plan-a-tidepooling-trip-around-minus-tides
  (present-tense "marquee run is July 13–16" + a stale "/2026-07/"
  month link and 07-03-computed aggregates) — noted while checking
  inbound links to Haystack. Also still pending: what-is-a-minus-tide
  (tables computed 07-03).
- Sat 08-01: monthly rollover — add "2026-09" to PUBLISHED_MONTHS
  (check Bing site: indexing of month URLs first).
- Watch exit_intent_shown; formal judgment 2026-08-10.

---

## 2026-07-27 — Exit-intent signup shipped (owner-directed) + first refresh pass

**Health first:** As of 12:40 UTC today's "Daily data refresh" cron had NOT
fired (scheduled 10:17 UTC; the last five fired 11:37–12:05). The workflow
reports state "active" via the public API and the last five runs are green,
so this reads as GitHub scheduler delay, not a failure — but it was still
missing when this run closed. Site correctness is unaffected (committed
data-json covers through Aug 2027; deploys build from committed data). I
cannot re-dispatch it: workflow_dispatch needs auth and the gh token is
still invalid (owner re-auth note stands). **Tomorrow: verify a 07-27 or
07-28 refresh landed; if the cron went silent without a red run, that is
the day's only task per §2a.** No open reader issues (public API).

**Owner-directed action (approved two-action day): exit-intent signup
SHIPPED** (commit bf8f73b). Scope exactly per the owner's constraints:
desktop pointers only via `(hover: hover) and (pointer: fine)`; triggers
only on a real top-edge mouse exit; 2nd pageview or later (localStorage
`tw_pageviews`, counted across hard loads and soft navs via usePathname);
fires once per visitor ever (`tw_exit_prompt` cap, and no-storage browsers
fail closed to never-show); suppressed while any inline signup form is in
the viewport — without burning the cap, so it can still fire on a later
page — and for visitors who already signed up locally; dismissible by
close button, Escape, or backdrop click; copy repeats the live "Sent every
Thursday" promise, nothing more. Signups reuse the shared EmailSignup with
**source: "exit-intent"** — note the segmenting property on
newsletter_signup events is `source` (the existing inline forms populate
it; the owner's note said `form`, but a new property would have split the
schema). A capped `exit_intent_shown` event (with pathname) records
impressions so prompt-to-signup conversion is measurable; judgment item
dated 2026-08-10 added to BACKLOG. Verified on the built site in-browser:
all six gates exercised (fires when eligible; no fire on 1st pageview,
with cap set, with inline form in view — cap preserved —, or when already
subscribed; Escape/backdrop dismiss) and exit_intent_shown confirmed
landing in PostHog. Test events came from host localhost:4174, which the
host-filtered queries already exclude.

**Primary action (priority e — first refresh pass of the site):**
content/articles/how-to-read-a-tide-table.md (commit fc7f7aa). Its worked
example — the July 12–17 Newport run, the article's spine — had fully
passed. Rolled the example to Wed Aug 12 (−1.913 ft, 6:46 AM, 4:30–9:15
AM, 179 daylight min, score 88), which doubles as the August half of the
article's existing Aug-12-vs-Dec-23 twin comparison, so the piece now
reads one row and then meets that row's December near-twin (−1.910 ft,
0.003 ft apart — both re-verified). Run table is now Aug 10–15; the two
pattern claims were recomputed, not carried over (shoulders Aug 11/13
differ 0.027 ft; low-to-low drift 37–50 min across the run); the
month-generosity sentence rolled July→August (31 lows below +1.0 ft, 17
daylight windows, 13 minus tides) with the internal link now pointing at
/beaches/or/newport-or/2026-08/. July 15's −2.522 ft stays as an
explicitly past-tense historical reference (verified against fact sheets
at original publish; forward-looking facts can no longer recompute past
dates). Recompute-check ran programmatically against the 2026-07-26 fact
sheets + committed data-json: every table row, window duration, delta,
and month stat passed (the only "failures" were a checker string-format
bug, re-run clean). `updated: 2026-07-27` set; renders as "updated Jul
27, 2026". Article-slot note: this was a refresh, not an addition — the
trailing-7d addition count stays 3 (21st, 25th, 26th).

**Deliberate choice:** ran plain `npm run build` despite touching code.
§0.6 says PIPELINE_REFRESH=1 for code changes, but that flag exists to
exercise the NOAA fetch path (§1: the cron owns data refresh), and this
change is UI-only — a local refresh would have churned data-json ahead of
the late cron and raced its push. Both builds green, zero warnings; diff
reviewed both commits (feature files + one article file, no data churn).

**Metrics (PostHog, last 7d, host-filtered):** 07-20: 17 pv, 07-21: 16,
07-22: 6, 07-23: 13, 07-24: 11, 07-25: 6, 07-26: 11 (final), 07-27: 6
(partial). Top pages: home 19, king-tides 10, Acadia 9, Fitzgerald 9,
OR-calendar 7. Referrers: google 35, duckduckgo 17 (DDG holding strong),
direct 15, bing 7, yahoo 6. Tools 14d: station_selected 4,
window_result_viewed 4. newsletter_signup: no new signups — the 3rd event
now in the 14d window is the known 07-17 signup; total stays 2
subscribers. Signup rate context for the exit-intent work: 2 distinct
subscribers on ~350 all-time uniques ≈ 0.6% vs the 1.5% target.

**Notes for tomorrow (07-28):**
- **First: confirm the daily refresh cron recovered** (a 07-27 or 07-28
  green run + data commit). If it silently stopped firing, that is the
  day's only task; without gh auth the fallback is investigating the
  workflow file/API and journaling for the owner.
- Watch `exit_intent_shown` in PostHog (host-filtered) — first real
  impressions should appear within days; formal judgment 2026-08-10.
- Thursday 07-30 send: sync-audience MUST run first (adds the 07-23
  subscriber; audience currently 1 of 2). Issue covers Jul 30–Aug 5.
- Sat 08-01: monthly rollover — add "2026-09" to PUBLISHED_MONTHS (check
  Bing site: indexing of month URLs first per staged-rollout rule).
- 08-05: judge the 07-19 retitle set (P2, frozen until then).
- Article slots: 2 free in trailing 7d (additions 25th, 26th remain).
  No standing P1 candidates; next refresh-pass candidate:
  what-is-a-minus-tide (its 12-station tables still read correctly but
  were computed 07-03; FAQ example dates have passed).

---

## 2026-07-26 — Sneaker waves explainer (P1 backlog cleared)

**Health first:** Daily data refresh cron green (11:38Z, 2m10s; 5 green in a
row). No open issues (gh CLI works again for public reads; `gh run list` and
`gh issue list` both returned — the 07-25 token concern affects authed
operations only, owner re-auth note stands).

**Primary action (priority d — content backlog):** published the long-standing
P1 candidate, content/articles/what-is-a-sneaker-wave.md (tide-basics, commit
fb61627). Structure: NWS definition + the 10–20-minute-lull and 150-ft run-up
quotes; a causes section built on Li et al. 2023 in *Natural Hazards and Earth
System Sciences* (OSU + PNNL + NWS Portland — infragravity waves fed by
long-period swell from far-off storms; the Jan 16 2016 ~1000-km run-up event,
peak periods ~12→~25 s; the count-20-seconds-between-waves signal); the tide
hook — of 2026's 414 daylight minus tides at the 11 west stations, 115 bottom
out 5–8 AM and 132 at 4–7 PM (global.json histogram), so tide windows put
readers on empty dawn beaches, and the arrive-by hour absorbs the NWS
20-minute watch; an Aug 12 all-five-outer-stations table (lows 6:19–7:04 AM,
La Push −2.31 ft score 90); and an officials section that is strictly
quotation (NWS, Oregon State Parks, NPS Olympic). Safety voice rule held:
every safety sentence is a verbatim, linked quote re-verified by web fetch
today; the OSU material is framed as research findings, not our advice.
**Cut per can't-verify-→-cut:** Beach Hazards Statement specifics — no
official definition page survives fetch (glossary has no entry, wx.gov/mfr
404s) — replaced with a neutral weather.gov forecast pointer. Article slot
math: 3 additions in trailing 7d incl. today (21st, 25th, 26th) — under cap.

**Verification:** answer box 76 words; description 153 chars; global histogram
sums, all five Aug 12 table rows (toFixed(2) low, low time, arrive-by, score,
band), and the La Push 295-min/195-daylight window arithmetic recompute-checked
programmatically against 2026-07-26 fact sheets — zero failures. Plain
`npm run build` green, zero warnings; all 10 internal link targets exist in
out/; diff was exactly the one new file.

**Metrics (PostHog, last 7d, host-filtered):** 07-19: 25 pv, 07-20: 17,
07-21: 16, 07-22: 6, 07-23: 13, 07-24: 11, 07-25: 6 (final), 07-26: 1
(partial). Top pages: Fitzgerald 16, home 15, Acadia 10, king-tides 9,
OR-calendar 7. Referrers: google 40, direct 14, duckduckgo 14 (DDG holding),
bing 8, yahoo 6. Tools 14d: station_selected 4, window_result_viewed 4.
newsletter_signup: no new signups; total stays 2 subscribers.

**Notes for tomorrow (07-27):**
- **OWNER DIRECTIVE (2026-07-26, in chat):** do the normal primary action
  PLUS ship the exit-intent signup (P2 → see the owner-directed backlog
  entry for scope). This is an approved two-action day; conversion is the
  owner's stated priority (2 subscribers on 338 all-time uniques ≈ 0.6%
  vs the 1.5% target).
- Article slots: 2 free in trailing 7d. No standing P1 article candidates
  left except the Nov winter preview (too early) — consider a refresh pass
  (e / 30–50% rule; west-coast-jul-11-14 roundup is past-dated but roundups
  are event pieces — check what-is-a-minus-tide / how-to-read-a-tide-table
  tables for staleness first) or distribution (g).
- Thursday 07-30 send: sync-audience MUST run first (adds the 07-23
  subscriber; audience currently 1 of 2). Issue covers Jul 30–Aug 5.
- Sat 08-01: monthly rollover — add "2026-09" to PUBLISHED_MONTHS (check
  Bing site: indexing of month URLs first per staged-rollout rule).
- 08-05: judge the 07-19 retitle set (P2, frozen until then).

**Health first:** Daily data refresh cron green (11:37Z, 1m35s). No open
issues (checked via public REST API). **Discovery: the gh CLI token is
invalid** — `gh auth status` fails, `gh issue list` 401s. Git push still
works (separate credential) and `gh run list` still returns public data, so
nothing was blocked today; added a backlog item for the owner to re-auth.
Broadcast 7883454d re-checked via Resend API: status "sent"; no
bounce/complaint signals surfaced.

**Primary action (priority b — 14-day Exceptional trigger):** Port Townsend
posts a 90 on Sat Aug 8, the leading edge of the Sound's last 90+ run of
2026 (PT 100 Sun Aug 9, −2.05 ft 7:38 AM; Seattle 98, −1.91 ft 8:29 AM;
weekdays cap at 90 through Wed; Seattle's Tue Aug 11 −2.63 ft is the
deepest daylight water left in 2026). Published
content/articles/puget-sound-minus-tides-august-8-13-2026.md (commit
e6911db): day-by-day PT+Seattle table, honest scoring explainer (Sunday
wins on the +10 weekend bonus, Tuesday on depth), La Push Aug 12–13 (its
last two Exceptionals; routes to Second Beach, NPS Mora-closure quote
re-verified verbatim at write time), one-paragraph OR (Aug 12 peak) / CA
(pre-dawn, sits it out) / Acadia pointers, and a "naturalist season is
over" section (Seattle Aquarium's published 2026 schedule ends Jul 15 —
verified; no August dates). featuredRoundup on /beaches/wa/ until Aug 13;
scoped states to ["wa"] so the OR hub keeps its own Aug 11–14 card (newest
roundup wins per getActiveRoundup). Article slot math: 3 additions in
trailing 7d incl. today (19th, 21st, 25th) — under the 5/week cap.

**Verification:** 22 cited (station, date) rows + window/arrive-by/
daylight/species claims recompute-checked programmatically against
2026-07-25 fact sheets — zero failures (the check caught three drafting
errors before commit: an unverified Sep 7 depth, invented species leads,
and a Sunday-vs-Tuesday delta that only held for Seattle; all fixed from
data). Sep 7 numbers pulled from committed data-json (PT −1.11 ft 7:20 AM
score 80; Seattle −0.93 ft 8:12 AM 77). Gumboot "largest chiton" claim
re-verified via Monterey Bay Aquarium and cited. Plain `npm run build`
green, zero warnings; all 15 internal link targets exist in out/; WA hub
renders the roundup card; OR hub card unchanged; diff was exactly the one
new file.

**Metrics (PostHog, last 7d, host-filtered):** 07-18: 14 pv, 07-19: 25,
07-20: 17, 07-21: 16, 07-22: 6, 07-23: 13, 07-24: 11 (final), 07-25: 5
(partial). Top pages: Fitzgerald 21, king-tides 17, home 14, Acadia 8,
OR-calendar 7. Referrers: google 48, direct 20, duckduckgo 13 (new — first
double-digit DDG week), yahoo 6, bing 6. Tools: station_selected 4,
window_result_viewed 4. **newsletter_signup: SECOND distinct subscriber
signed up 07-23** (go-live day; 2 events, 1 email — double-submit), total
now 2. They have not received an issue yet.

**Notes for tomorrow (07-26):**
- Thursday 07-30 send: sync-audience MUST run first — it will add the
  07-23 subscriber (audience currently 1 of 2). Issue covers Jul 30–Aug 5
  (neap-ish); the Aug 6–12 issue the week after is the big one — it can
  reuse today's roundup framing and link the article.
- Article slots: 2 free in trailing 7d after today. Sneaker-waves explainer
  (P1) still the top standing candidate.
- Owner ping (non-blocking): gh CLI token invalid — `gh auth login` when
  convenient.
- 08-05: judge the 07-19 retitle set (P2, frozen until then).

## 2026-07-24 — Refresh pass: Acadia guide rolled forward to the Aug 13–16 run

**Health first:** Daily data refresh cron green (11:56Z, 1m37s). No open
issues. Broadcast 7883454d (yesterday's first newsletter send) re-checked via
the Resend API: status "sent", no bounce or complaint signals.

**Primary action (priority e — first refresh pass; 31 articles, cap clear at
2 in trailing 7d):** the site's #1 organic page,
guides/acadia-tide-pools-bar-island-ship-harbor, still led with "best window
of the summer is Friday, July 17" — a week in the past. Rolled every
date-bearing element forward to the 2026-07-24 fact sheet (commit 84e1246):
answer box + FAQ now lead with Sat Aug 15 (−0.80 ft, 7:16 AM, 5:45–8:40 AM,
75 Great), the 60-day table is the Aug 13–16 run + the Sep 11/12 evening
flip, the Bar Island crossing table applies the NPS ±1.5 h rule to Aug 13–16
lows, months table now Aug–Dec (July's fact row went forward-looking-only),
species counts refreshed (Periwinkle 22, Dogwhelk 11, Jackknife 11,
Slippersnail 9, Onchidoris 6). Kept an honest "late July is thin" note
(0 daylight minus tides left; Jul 31 best scores 41). Title/description
NOT touched — the page is in the frozen 07-19 retitle set (judge 08-05).
NPS quotes (bar-island, tidepooling, ship-harbor, wonderland) re-verified at
write time; Acadia conditions page checked — falcon/storm closures don't
touch our three spots. Rounding note: Aug 16 low −0.345 rendered as −0.34 to
match the site's toFixed(2) behavior.

**Verification:** every table row + spot claim recompute-checked
programmatically against the fact sheet (caught the −0.35 vs −0.34 rounding
drift); plain `npm run build` green, zero warnings; all internal link
targets exist in out/; JSON-LD dateModified 2026-07-24; diff was exactly the
one file.

**Considered and rejected:** a dedicated "Bar Island crossing times" article
(journal candidate "ME guides") — it would substantially duplicate the
refreshed guide's crossing section. Discovery while scoping it: the windows
dataset only carries lows below ~+1.0 ft, so 77 days in the 13-month range
have no entry — a full daily crossing/tide schedule isn't publishable from
committed data. Folded into the existing P2 high/low-pairs item (that
decision now blocks BOTH the "high tide acadia" queries AND any crossing-
schedule page; flywheel shows "acadia national park tide schedule" pos 19).

**Metrics (PostHog, last 7d, host-filtered):** 07-17: 23 pv, 07-18: 14,
07-19: 25, 07-20: 17, 07-21: 16, 07-22: 6, 07-23: 13 (final; recovered from
the 07-22 dip), 07-24: 3 (partial). newsletter_signup: still 1 total. GSC
flywheel: constellation park / port townsend queries steady pos 10–12 at 0%
CTR (frozen till 08-05); "king tides 2026" still converting (1 click on 2
impr).

**Notes for tomorrow (07-25):**
- Article slots free (2 in trailing 7d). Candidates: sneaker-waves explainer
  (P1 backlog) or a genuinely distinct ME angle if one exists — NOT a Bar
  Island crossing piece (see above).
- Watch whether the 07-23 subscriber count moves post-first-send; check
  Broadcast 7883454d stats again once delivery data settles.
- Next Thursday send: 07-30 run (Jul 30–Aug 5 week).

---

## 2026-07-23 — NEWSLETTER LIVE: first Minus Tide Alert sent

**Health first:** Daily data refresh cron fired on schedule (12:04Z, green);
waited for it and pulled the data commit before composing, so the issue used
today's NOAA refresh (fact sheets generated_on 2026-07-23). No open issues.

**Primary action (BACKLOG P0, owner-approved 2026-07-19, locked for today):**
the first real Minus Tide Alert went out. Sequence: (1) sync-audience — 1
distinct signup in PostHog (the 07-17 subscriber), already present, 1 total
contact; (2) dry-run rendered the Jul 23–29 issue (22 Good+ windows across 7
stations — matching the 07-19 comparison that picked this week); recompute-
checked the headline numbers against fresh fact sheets and committed
data-json (Seattle Wed Jul 29 −1.35 ft 11:33 AM score 77 Great; Port Townsend
Sun −0.81 ft 8:50 AM 76; La Push −1.302→−1.30 ft 7:28 AM; Newport −0.933→−0.93;
Garibaldi −0.852→−0.85 — all match); (3) sent:
**Broadcast 7883454d-0ac2-4b75-a1f6-78483a4b15e5**, Resend confirms status
"sent" at 12:07:25Z to 1 subscriber, unsubscribe footer handled by Resend;
(4) flipped signup copy site-wide (commit 5a51925): "Starting this season."
→ "Sent every Thursday." on home/state-hub/station/guide/king-tides blurbs,
/newsletter/ hero now "Issues go out every Thursday; join now and the next
one is yours", success message names the Thursday cadence. Honesty invariant
satisfied: copy promises exactly what now exists. Draft files for the sent
issue committed to docs-internal/newsletter-drafts/.

**Verification:** plain `npm run build` green, zero warnings; new copy
confirmed in out/; diff was exactly the 7 one-line copy changes + the two
draft files. Resend broadcast status checked post-send: sent, no bounce or
complaint signals at check time (1-recipient list; keep watching per §1).

**Metrics (PostHog, last 7d, host-filtered):** 07-16: 26 pv, 07-17: 23,
07-18: 14, 07-19: 25, 07-20: 17, 07-21: 16, 07-22: 6 (final — soft day;
yesterday's partial read was 2), 07-23: 1 (partial). Top pages: Acadia 27,
Fitzgerald 25, king-tides 19, home 12, /beaches/ca/ 8. Tool events:
station_selected 2, window_result_viewed 2. newsletter_signup: still 1
total (the subscriber who just received issue #1).

**Notes for tomorrow (07-24):**
- Newsletter is now a WEEKLY Thursday ritual: every Thursday run, the
  primary is sync-audience → dry-run → recompute-check → send. Non-Thursday
  runs proceed with the normal queue.
- Check Resend bounce/complaint for Broadcast 7883454d once delivery data
  settles (also watch whether the subscriber opens — Broadcast stats API).
- Article cap: 3 in trailing 7d (17/19/21) — slots free. Candidates: ME
  guides (hub needs 2 more; only Acadia) or the sneaker-waves explainer.
- 07-22 finalized at just 6 pv (weekday low). Watch whether 07-23 recovers;
  no action warranted yet.

---

## 2026-07-22 — Finder landing copy: intent-bearing title/H1 + internal links

**Health first:** Daily data refresh cron fired at 12:05Z mid-session, green
in 1m36s (third on-schedule day in a row; the 07-20 missed-tick concern is
closed). No open issues. Rebased today's data commit under my change before
pushing.

**Metrics (PostHog, last 7d, host-filtered):** 07-15: 19 pv, 07-16: 26,
07-17: 23, 07-18: 14, 07-19: 25, 07-20: 17, 07-21: 16 (final; 11 uniques —
yesterday's partial read was 9), 07-22: 2 (partial). Top pages: Acadia 31,
Fitzgerald 25, king-tides 19, home 12, /beaches/ca/ 8. Tool events cooled
from the 07-21 spike but stayed nonzero: station_selected 2,
window_result_viewed 2. newsletter_signup: still just the 07-17 subscriber.
Referrers: google 86, direct 36, yahoo 5, bing 4, duckduckgo 3. GSC
flywheel: no big new rows; Port Townsend / Constellation Park queries sit
pos 10–12 at 0% CTR (their guides exist; watch after the 08-05 retitle
review), "king tides 2026" converting well (2 clicks on 3 impr).

**Primary action (P2, carried from 07-21 notes; article slot deliberately
saved):** rewrote the /tools/tide-window-finder/ landing copy (commit
386e4e6). It ranked pos ~52 on 67 impr/28d with a title targeting no query.
Now: title/H1 carry demonstrated query language ("Find the next low tide
near you"), description front-loads what you get, and three short sections
below the tool link the depth explainers (what-is-a-minus-tide, how-low,
how-to-read-a-tide-table), methodology, all four state hubs, and the
sibling tools (Trip Picker, Year at a Glance). The finder was NOT part of
the frozen 07-19 retitle set, so this doesn't pollute that experiment.

**Verification:** plain `npm run build` green, zero warnings; all 10 new
internal links resolve against out/; page + tool verified in local preview
(Seattle selection loads NOAA 9447130 results; console clean). The one
tide-behavior claim ("tides shift by minutes over tens of miles of open
coast; bays and sounds lag") recompute-checked against 2026-07-21 fact
sheets: Aug 12 low sweeps Port Orford 6:19 AM → Garibaldi 7:04 AM (~45 min,
~230 mi of open coast) vs Seattle 11:07 AM inside the Sound. Diff was
exactly the one file.

**Discovery:** the finder's station dropdown labels La Push with "Rialto
Beach / Hole-in-the-Wall" — the spot that is CLOSED via Mora Road until
~Oct 15 (see P2 time-bomb). Label lives in station spots data
(scripts/pipeline/stations.mjs → committed data-json), so changing it means
a pipeline data change; noted on the backlog item rather than side-fixed.

**Notes for tomorrow (07-23, Thursday):**
- **NEWSLETTER FIRST SEND is the REQUIRED primary** (owner-approved
  07-19): 1) node scripts/newsletter/sync-audience.mjs; 2) node
  scripts/newsletter/send-weekly.mjs --send --owner-reviewed; 3) flip
  EmailSignup blurbs + /newsletter/ page from "starting this season" to
  live, build, push; 4) journal the Broadcast id; check Resend
  bounce/complaint after. Jul 23–29 week renders 22 Good+ windows across
  7 stations per the 07-19 dry-run comparison.
- Article cap: 4 in trailing 7d (16/17/19/21) — a slot frees 07-23 but the
  send is the primary; next article candidates remain ME guides (hub needs
  2 more) or the sneaker-waves explainer.
- Watch whether the finder's GSC position/CTR moves over ~2 weeks (compare
  to the 67 impr / pos ~52 baseline from 07-19).

---

## 2026-07-21 — Port Orford station guide: OR set complete (4/4)

**Health first:** Daily data refresh cron fired ON SCHEDULE today (12:01Z,
green, 1m40s) — yesterday's missed-tick concern doesn't repeat; no
re-staggering needed. No open issues. Fact sheets regenerated today
(generated_on 2026-07-21).

**Metrics (PostHog, last 7d, host-filtered):** 07-14: 38 pv, 07-15: 19,
07-16: 26, 07-17: 23, 07-18: 14, 07-19: 25, 07-20: 17 (final), 07-21: 9
(partial). Top pages: Acadia 30, Fitzgerald 24, Seattle Jul calendar 19,
king-tides 19, home 13. **Tool events are nonzero for the first time in two
weeks:** station_selected 5, window_result_viewed 5 — the /guides/ tools
card (07-20) is the likely cause; keep watching. newsletter_signup: 1 in
window (the 07-17 subscriber; no new ones). Referrers: google 103,
direct 38, yahoo 5, bing 3.

**Primary action (priority d; cap OK at 3 in trailing 7d):** published the
Port Orford station guide (content/articles/port-orford-tide-pools-2026.md,
commit 4be6544), the carried-forward recommendation — the only OR station
without a guide. **The OR station set is now complete (4/4).** Angles: the
inversion station — winter beats summer by 0.47 ft (−2.21 ft Christmas Eve
vs −1.74 ft Aug 12), the coast's biggest margin; Jan 21 2027 as Oregon's
only Great-band king window; the Aug 11–14 last-dawn-run with sunrise math
per day; and an honest "nearly blank iNat record" species section (2
research-grade observations in 60 days — vs La Jolla's 699) framed as
be-the-first-to-record. Access/reserve claims all fetched at write time:
Redfish Rocks no-take verbatim (oregonmarinereserves.com), Tseriadun/
Paradise Point agate quotes (stateparks.oregon.gov), Battle Rock history
(Travel Oregon), city visitor center + no-fee access (chamber + Oregon
Discovery). Side-fix: OR hub's "No station guide yet" line now links the
guide.

**Verification:** plain `npm run build` green, zero warnings; all 8 internal
links resolve against out/; every table cell + derived sunrise/last-light
figure recompute-checked programmatically against the fact sheet (caught
two errors pre-push: a from-memory "sixty miles north" for Newport — it's
~132 mi by great-circle — and a −1.825 rounding mismatch with the site's
toFixed(2) display, −1.83 → −1.82). Diff was the new file + one hub line.

**Notes for tomorrow (07-22):**
- Article cap: 4 in trailing 7d (16/17/19/21) — one slot, but consider
  saving it; **Thursday 07-23 is LOCKED for the newsletter first send**
  (sync-audience → send-weekly --send --owner-reviewed → flip signup copy
  site-wide → journal Broadcast id, check bounce/complaint after).
- Good Wednesday candidates instead: the P2 tide-window-finder landing copy
  (pos ~52 on 67 impr — intent-bearing H1/intro), or a GSC flywheel pull to
  see if new query rows appeared.
- ME hub still needs 2 more guides (only Acadia); next expansion tier.
- Keep watching tool events — if the /guides/ card holds, consider the same
  card on state hubs.

---

## 2026-07-20 — /guides/ index restructured; missed cron caught by manual dispatch

**Health first:** the Daily data refresh cron did NOT fire on schedule — no run
had appeared by 12:11Z, ~2h past the usual 11:25–11:55Z fire window (GitHub
occasionally skips scheduled ticks under load). Manually dispatched at 12:11Z
(run 29741270702) → green in 1m58s, IndexNow submitted 93 URLs HTTP 200, data
commit pulled. Not a code failure; nothing to fix. No open issues.

**Metrics (PostHog, last 7d, host-filtered):** 07-13: 14 pv, 07-14: 38,
07-15: 19, 07-16: 26, 07-17: 23, 07-18: 14, 07-19: 25 (final — up from 10 at
yesterday's partial read), 07-20: 3 (partial). Top pages shuffled: Acadia 29
is now #1, /guides/ index 27, Fitzgerald 22, Seattle July calendar 17,
king-tides 13. Tool events: zero for the second straight week. newsletter
signups: still just the 07-17 subscriber.

**Primary action (priority g — distribution polish; article cap exhausted
through 07-21):** restructured the /guides/ index (commit bb9d1c0), the
carried-forward recommendation from 07-19. It had been a flat newest-first
list of all 30 articles — a top-2 page every single week (27–83 pv/wk) that
buried the state hubs and the foundational explainer under whatever shipped
last. Now: (1) a "Start here" row — the minus-tide explainer + the WA/OR/CA
hubs; (2) articles grouped into category sections in a deliberate order
(tide-basics → regional-calendars → station-guides → …), each header linking
to its category page; (3) a cross-link card to the Tide Window Finder and
Trip Picker — tool events have been zero two weeks running and our top
content hub never pointed at the tools. No content or numbers changed; no
titles touched (the 07-19 CTR experiment stays frozen until ~Aug 5).

**Verification:** plain `npm run build` green, zero warnings. Rendered page
verified in a local preview of out/: start-here cards, tools card, and all 7
category sections present; category counts match (6/6/12/3/1/1/1); internal
links resolve. Diff was exactly the one file.

**Notes for tomorrow (07-21):**
- Article cap frees a slot (4 in trailing 7 days from 07-15). Best candidate:
  Port Orford station guide — the only OR station without one; it would give
  the new OR hub a complete set. ME hub still needs 2 more guides.
- Watch whether the cron fires on schedule; if it misses again two days
  running, consider re-staggering the cron time in the workflow.
- Thursday 07-23 is LOCKED: newsletter first send (sync-audience → send-weekly
  --send --owner-reviewed → flip signup copy site-wide → journal Broadcast id).
- Watch whether /guides/ tool-card clicks show up as tool pageviews/events.

---

## 2026-07-19 (addendum) — NEWSLETTER APPROVED by owner; first send set for Thu 07-23

**OWNER REVIEW RECORDED:** the owner reviewed the rendered Minus Tide Alert
draft (2026-07-18 issue, resent to them today) and approved with "proceed
with what you see fit." The first-send gate (JOURNAL 2026-07-05) is CLEARED —
`--owner-reviewed` may now be passed. Approval covers the template/voice, not
a specific issue; every send still composes fresh from committed data.

**Decision — send Thursday, not today.** Audience re-synced (0 added, 1 total).
A fresh dry-run for today's week (Jul 19-25) came out thin: 0 Great windows,
3 of 12 stations, best −0.56 ft — and literally nothing Good+ in California,
where our one subscriber signed up. A Jul 23 dry-run (the planned Thursday
cadence day, covering Jul 23-29 with the late-July run) renders 22 Good+
windows across 7 stations. First impressions matter and the alert is most
useful just before its windows, so the first issue goes out **Thursday
2026-07-23** as that run's REQUIRED action:
1. `node scripts/newsletter/sync-audience.mjs`
2. `node scripts/newsletter/send-weekly.mjs --send --owner-reviewed`
3. Flip signup copy site-wide from "starting this season" to live
   (EmailSignup blurbs + /newsletter/ page), build, push.
4. Journal the send + Broadcast id; check Resend bounce/complaint after.
Weekly cadence: every Thursday thereafter (BACKLOG P0 item 4 — done).
Exploratory dry-runs for 07-23/07-26 were rendered to compare weeks and
deleted; today's 07-19 render kept as the review-era artifact.

---

## 2026-07-19 (session 2, owner-directed) — GSC CTR pass: retitle programmatic pages toward query language

**Trigger:** owner asked why 1.84K impressions produced only 31 clicks
(28d GSC: 1.7% CTR, avg pos 10.7) and to fix it.

**Diagnosis (GSC 28d, page+query level):** (1) ~90 impressions are unwinnable
movie-piracy queries ("low tide on demand/pdvd/dvdscreener", pos 60–80) —
exclude from CTR math. (2) The real sink: programmatic beach pages ranking
pos 5–10 with **0% CTR** — pillar-point-ca station+month pages 394 impr /
0 clicks (~pos 9); la-jolla-ca 2026-08 0/34 @ 5.2; san-diego-ca 2026-08
0/41 @ 7.7; seattle-wa 2026-08 0/45 @ 6.5; homepage 0/22 @ 5.3. Expected
CTR at pos 5–8 is ~3–7%. Titles said "low tide windows — best dates to go"
while demonstrated queries say "tide chart", "tide pools <place>",
"noaa station <id>", "<place> tide predictions <date>". (3) Guides with
concrete promises already convert (king-tides 3.6% @ 6.7, Alki 5.7% @ 7.5,
Puget Sound calendar 4.2%) — that's the title style to copy.

**Changes:**
- Station pages: title `{name} low tide chart — tide pool days & times
  (NOAA {id})`; description front-loads the next-best window (date/ft/time).
- Month pages: generateMetadata now reads the station JSON — title
  `{name} low tide chart & calendar, {Month} — best days to go`; description
  carries the month's lowest tide (ft, date, time) + daylight-minus count,
  same definitions as the on-page answer box (isMinusTide && daylightMin>=30).
- Homepage: "{year} low tide calendar & minus tide finder for US beaches",
  year derived from PUBLISHED_MONTHS so it can't go stale.
- Acadia guide: title/desc gain "Low Tide Chart / Best Times / low tide
  schedule" — GSC shows pos 19–50 for exactly those words; the tables were
  already in the article, only the title didn't say so.
- King-tides guide: title now "King Tides 2026-2027 Dates: …" +
  "predictions" in description (verbatim match to its top query family).
- Stale Jul 11–14 roundup (79 impr/28d, event past): dated update block at
  top pointing to the Aug 9–12 run — PT −2.05 ft 7:38 AM (100) Sun Aug 9,
  SEA −1.91 ft 8:29 AM, Newport −1.91 ft 6:46 AM Wed Aug 12, all from
  today's fact sheets — plus a forward-looking meta description.

**Verification:** plain `npm run build` green (106 pages); every new
title/description grep-verified in out/. Update-block numbers recompute from
docs-internal/facts (seattle/port-townsend/newport 2026-08 best_window).
`npm run lint` has ONE error, pre-existing on clean HEAD
(tools-shared.tsx react-hooks/set-state-in-effect) — not from this change,
queued separately.

**Notes for tomorrow:** DO NOT iterate these titles before ~Aug 5 — recrawl
takes 1–2 weeks. Judge per-page CTR against today's baseline (31 / 1.84K /
1.7% / 10.7; pillar-point 394 impr 0 clicks), not the aggregate (movie junk
pollutes it). New backlog: tide-window-finder landing intent (pos ~52 on
67 impr), "high tide acadia" query family unserved (we only publish lows).

## 2026-07-19 — "Best Tide Pools in Oregon 2026" state hub (3rd of 4)

**Health first:** Daily data refresh cron GREEN at 11:32Z — NOAA CO-OPS
predictions recovered from Friday's service-wide outage. (Yesterday's manual
catch-up dispatch 29643735412 exhausted its 6 retries and failed overnight;
harmless — today's scheduled run landed fresh data, so the site was stale for
exactly one day as designed.) No open GitHub issues. Fact sheets fresh
(generated_on 2026-07-19). New commit-data build path verified again: plain
`npm run build` produced zero pipeline churn.

**Metrics (PostHog, last 7d, host-filtered):** 07-13: 14 pv, 07-14: 38,
07-15: 19, 07-16: 26, 07-17: 23, 07-18: 14 (final — down from the 5 partial
read), 07-19: 10 (partial). Referrers: google.com 127, $direct 36,
DuckDuckGo 3, Yandex 2, Bing 1. Top pages: /guides/ 50 (still #1 but cooling
from 75-83), Acadia 30, Seattle July calendar 20, Fitzgerald 12, king-tides
11. Tool events: zero this week. `newsletter_signup` still 1 all-time; owner
has NOT yet reviewed the 2026-07-18 draft — sending stays blocked (re-checked).

**Primary action (priority d — content backlog):** LAUNCHED **"Best Tide
Pools in Oregon 2026"** (content/articles/best-tide-pools-oregon-2026.md,
regional-calendars, commit 3c36485) — the hub the 07-17 Newport guide
unlocked, shipped on the first day the velocity cap allowed (5th article in
trailing 7 days; cap exactly met, no more writing until 07-21).

**The angles.** All computed from today's fact sheets: (1) Aug 11-14 is the
last deep dawn run of 2026 — every OR station peaks Wed Aug 12 (PO −1.74 /
CH −1.72 / NP −1.91 / GAR −1.77 ft), sweeping south→north in 45 min (6:19→
7:04 AM); verified against committed data-json that NO OR station posts
another AM low ≤ −1 ft in 2026 after Aug 15 (had to soften "last dawn run" →
"last deep dawn run": September still has −0.5 ft-class dawn minus tides).
(2) King-season depth staircase runs south-deep: −2.21 PO / −2.05 CH /
−1.91 NP / −1.66 GAR — and the summer/winter crossover lands at Newport by
0.003 ft (echoes the Newport guide's photo finish, now as a coast-wide
pattern; Garibaldi is the one station where August wins outright). (3) Gate
math: Yaquina Head's 8 AM open kills the Aug 11-13 dawn lows; every other
shore in the table is open at dawn. Honest winter caveat: all December lows
bottom after dark; the king season's only Great-band OR window is Jan 21
2027 at Port Orford (−1.89 ft, 5:12 PM, dl 152, score 76).

**Sourcing discipline:** all ~45 numbers recompute-checked by script against
facts/*.json — zero mismatches; the "no AM low ≤ −1 after the run" claim
checked against all four stations' full committed window lists (night windows
included). BLM hours/fees/seabird-closure, HRAP no-harvest, Sunset Bay
day-use + "eyes only", and Otter Rock reserve (1.2 sq mi, no-take)
re-fetched and quote-verified today. Build green; all 40 internal links in
the rendered page resolve; featuredRoundup (until 2026-08-14) verified
rendering on /beaches/or/; sitemap/feed/guides index all picked it up; diff
was exactly the one new file.

**Notes for tomorrow (07-20):**
- Velocity cap is HARD-EXHAUSTED (5 in trailing 7 days through 07-21).
  Primary should be the **/guides/ index polish** — top page every single
  week (50-83 pv/wk), carried five runs now. Alternative non-writing work:
  refresh pass on west-coast-minus-tides-july-11-14-2026.md (dates fully
  past) or the P2 og:image gap.
- Newsletter: re-check owner review of the 07-18 draft; if approved, send
  and flip signup copy (P0 item 3).
- ME hub still needs 2 more station guides (only Acadia); next station-guide
  slot could go to Port Orford (only OR station without a guide) — but not
  before 07-21.
- TIME-BOMB unchanged: after ~Oct 15 re-check NPS Mora Road/Rialto closure.

---

## 2026-07-18 — NOAA outage broke the cron; deploys de-risked; FIRST SIGNUP

**Health first:** Daily data refresh cron FAILED (11:25Z, run 29642522424) —
today's only task per playbook §2a. Root cause: a **service-wide NOAA CO-OPS
predictions outage**, not our bug. Evidence: every station tested (Seattle
9447130, Port Townsend 9444900, Pillar Point 9414131, Bar Harbor 8413320) and
every datum (MLLW, MSL, STND, NAVD) returned "No Predictions data was found";
meanwhile product=water_level returned live data and station metadata was
intact, so the API itself was up — only predictions were dark. Still down at
~12:10 ET. No open GitHub issues. **Site unaffected:** committed data covers
2026-07-17 → 2027-08-18 (281 windows/station); homepage and
/data-json/index.json serve 200.

**Fix (commit 4365733):** the outage exposed the real risk BACKLOG P2 had
flagged — `prebuild` re-ran the NOAA pipeline on every Vercel deploy (the
stamp file is gitignored, so CI never skipped), meaning any push today would
have failed to deploy. Two changes:
1. `run.mjs`: plain builds now use committed `public/data-json` whenever
   `index.json` exists; only `PIPELINE_REFRESH=1` fetches NOAA. NOAA is out of
   the deploy path entirely (P2 item done). Side benefit: ends the local
   `npm run build` data churn noted on 07-15/16/17 — verified zero churn today.
2. `daily-refresh.yml`: the refresh step now retries up to 6 times over ~100
   minutes, so a morning NOAA blip self-heals; a sustained outage still fails
   loudly.
Verified: plain pipeline run prints the committed-data skip, build green, diff
was exactly the two files. Pushed (deploy no longer needs NOAA). Dispatched a
catch-up refresh (run 29643735412, in progress) — if NOAA recovers inside its
retry window today's data lands; otherwise data is one day stale (harmless
with 13 months of coverage) and tomorrow's 10:17Z cron catches up.

**FIRST NEWSLETTER SIGNUP (organic):** all-time `newsletter_signup` went
0 → 1 — 2026-07-17 10:07 ET on /beaches/ca/, arrived from google.com, form
source state_hub. Ran `sync-audience.mjs`: 1 added, 1 total contact in the
Resend "Minus Tide Alert" audience. Rendered a fresh dry-run issue for review
(docs-internal/newsletter-drafts/2026-07-18-minus-tide-alert.html/.txt —
Jul 18–24, 11 Good+ windows across 10 stations). **OWNER ACTION REQUESTED:**
review that draft; on approval, record it in JOURNAL and run
`node scripts/newsletter/send-weekly.mjs --send --owner-reviewed`, then flip
signup copy site-wide from "starting this season" to live (BACKLOG P0 item 3).
Sending remains blocked until that review — honesty invariant.

**Metrics (PostHog, last 7d, host-filtered):** 07-11: 30 pv, 07-12: 43,
07-13: 14, 07-14: 38, 07-15: 19, 07-16: 26, 07-17: 23 (final), 07-18: 5
(partial). Referrers: google.com 145, $direct 32, DuckDuckGo 6, Yandex 2,
Bing 1 — organic ~4.5:1. Top pages: /guides/ 75 (still #1), Acadia 32,
Seattle July calendar 20, homepage 17, /beaches/ca/ 7 (the hub that converted
the signup), OR minus-tide calendar 7. Tool events still near-zero (1+1).

**Velocity:** no article today (cap was exhausted through 07-18 anyway;
trailing 7 days stays at 5).

**Notes for tomorrow (07-19):**
- Confirm the catch-up run went green (or, if NOAA stayed down, that the
  10:17Z cron recovered). If predictions are STILL down, check the CO-OPS
  status page and journal it — data would then be 2 days stale, still fine.
- **Velocity cap clears** (Seattle 07-12 rolls out) and the **OR hub is
  eligible** (3 OR guides: Haystack Rock, Charleston, Newport) — make it the
  primary unless something outranks it. /guides/ index polish (75 pv/wk, #1)
  has now been carried four runs — do it as the next non-writing primary.
- If the owner approved the newsletter draft, send the first issue and flip
  the signup copy (P0 item 3, then item 4: Thursday cadence going forward).
- TIME-BOMB unchanged: after ~Oct 15 re-check NPS Mora Road/Rialto closure.

---

## 2026-07-17 — Yaquina Head & Otter Rock (Newport, OR) station guide

**Health first:** Daily data refresh cron green (07-17 11:42Z success; 5+
consecutive green). No open GitHub issues. Fact sheets fresh (generated_on
2026-07-17). Local `npm run build` again regenerated pipeline files
(data-json/ics) — discarded before commit, same as 07-15/07-16; the cron owns
those.

**Metrics (PostHog, last 7d, host-filtered):** steady. 07-10: 11 pv, 07-11: 30,
07-12: 43, 07-13: 14, 07-14: 38, 07-15: 19, 07-16: 26 (final — yesterday's
partial read was 6), 07-17: 4 (partial). Referrers: google.com 140, $direct 32,
DuckDuckGo 6, Bing 2 — organic ~4.4:1 over direct. Top pages: /guides/ 83
(still #1), Acadia 29 (resurgent), homepage 22, Seattle July calendar 19,
OR minus-tide calendar 6. GSC flywheel: "port townsend tide pools" pos 10–12
holds; "king tides 2026" pos 9 (1 click / 2 impressions); the "noaa pillar
point 9414131" long-tail cluster persists at pos 9–11. Tool events near-zero
(1+1). `newsletter_signup` still 0 — go-live (P0 item 3) stays blocked;
re-checked.

**Primary action (priority d — content backlog):** LAUNCHED the **Newport /
Yaquina Head + Otter Rock station guide**
(content/articles/yaquina-head-otter-rock-tide-pools-2026.md, station-guides,
commit ffc453e) — the pick 07-16's journal queued. Only Exceptional window in
the next 14 days is today's at La Push (95), already covered by the La Push
guide + WA hub, so priority (b) triggered nothing new.

**The angles.** Computed from the 07-17 fact sheet: (1) photo finish — the
year's two deepest remaining daylight lows differ by 0.003 ft (~1 mm): Aug 12
−1.913 ft at 6:46 AM (score 88) vs Dec 23 −1.910 ft at 5:53 PM (score 61,
low ~73 min after a ≈4:40 PM derived sunset); (2) the year's two best
remaining days tie at 88 for opposite reasons — Jul 17 (publish day) is
−1.66 ft with 270 daylight min, the only fully-daylight window of the deepest
eight, vs Aug 12's depth-for-daylight trade; (3) gate math — Yaquina Head's
8:00 AM summer opening (BLM, verbatim) fits Jul 17's 9:15 AM low but locks out
all three Aug 11–13 dawn lows (6:00/6:46/7:28 AM), routing the dawn run to
Otter Rock; (4) all TEN of the ten most-reported iNat species near the station
are nudibranchs (Charleston was 8 of 10).

**Sourcing discipline:** all ~35 tide values recompute-checked by script
against newport-or.json — zero mismatches; sunrise/sunset times derived from
window daylight minutes and shown as arithmetic. Caught in self-review before
push: a wrong "six hundredths" Aug 11→12 depth delta (actual 0.152 ft),
an unverifiable "eight miles north" distance, and an unverified "below the
lighthouse" placement for Cobble Beach — all fixed or cut. Non-tide claims
quoted verbatim at write time: BLM fees/hours/seasonal-access
("limited or no access to Cobble Beach, the tidepools" May–Sep seabird
window — honestly flagged since it spans the whole summer season), state
parks punchbowl + "tidepools on the north side of the punch bowl" + parking
advisory, ODFW marine reserve (1.2 sq mi, "No take of animals or seaweeds",
intertidal-at-north-end quote supports pools-in-reserve framing). Devils
Punchbowl day-use fee re-fetched to get the verbatim line after a first fetch
returned only a paraphrase.

**Quality gates:** build green; page prerendered, in sitemap, on /guides/;
all 8 internal links verified against out/; 4 sources fetch 200; description
exactly 155 chars; diff = one new file.

**Velocity:** trailing 7 days = Seattle (07-12) + WA hub (07-14) + CA hub
(07-15) + Charleston (07-16) + Newport (07-17) = **5 of ≤5 — cap reached.**

**Notes for tomorrow:**
- **No articles tomorrow (07-18)** — the cap stays exhausted until 07-19
  (Seattle rolls out of the window then). Tomorrow's primary should be
  non-writing: the **/guides/ index polish** (83 pv/wk, #1 landing page, flat
  date list) has now been carried three runs — make it the primary.
- **OR hub is unlocked**: 3 OR station guides exist (Haystack Rock,
  Charleston, Newport) — same ≥3 bar the WA and CA hubs met. Earliest ship
  date 2026-07-19; queue it as that run's primary if nothing outranks it.
- Re-check newsletter_signup every run; still 0 — go-live blocked.
- TIME-BOMB unchanged: after ~Oct 15 re-check NPS Mora Road/Rialto closure.
- CA hub featuredRoundup expired today (self-clearing; no action).

---

## 2026-07-16 — Sunset Bay & Cape Arago (Charleston, OR) station guide

**Health first:** Daily data refresh cron green (07-16 11:55Z success; 5+
consecutive green). No open GitHub issues. Fact sheets fresh (generated_on
2026-07-16). Local `npm run build` again regenerated pipeline files
(data-json/ics) — discarded before commit, same as 07-15; the cron owns those.

**Metrics (PostHog, last 7d, host-filtered):** steady. 07-10: 11 pv, 07-11: 30,
07-12: 43, 07-13: 14, 07-14: 38, 07-15: 19 (final — yesterday's partial read
was 5), 07-16: 6 (partial). Referrers: google.com 126, $direct 26, DuckDuckGo
6, Bing 2 — organic ~5:1 over direct. Top pages: /guides/ 86 (still #1),
homepage 20, Seattle July calendar 19 (climbing), Acadia 13, OR minus-tide
calendar 6. GSC flywheel: "port townsend tide pools" pos 10–12 holds;
"king tides 2026" pos 9 earned a click (1/2 impressions); a cluster of
"noaa pillar point 9414131" queries sits pos 9–11 — station pages are catching
long-tail NOAA lookups. Tool events still near-zero (1+1).
`newsletter_signup` still 0 — go-live (P0 item 3) stays blocked; re-checked.

**Primary action (priority d — content backlog):** LAUNCHED the **Charleston /
Sunset Bay + Cape Arago station guide**
(content/articles/sunset-bay-cape-arago-tide-pools-2026.md, station-guides,
commit edf7dd0) — the pick 07-15's journal queued.

**The angle — deepest ≠ usable.** Computed from the 07-16 fact sheet: today,
Jul 16, is the year's ONLY remaining Exceptional window at 9432780 (−2.00 ft,
8:22 AM low, score 90, 295 daylight min), while the year's deepest remaining
low — −2.05 ft on Dec 24 — bottoms out after dark (window opens 4:10 PM, only
36 daylight min ⇒ sunset ≈ 4:46 PM, shown as arithmetic). Supporting beats:
Aug 11–14 is the last dawn run (Aug 11's 5:49 AM low precedes the ≈6:18 AM
sunrise — derived — hence its 73 vs Aug 12's 81), and 8 of the 10 most-reported
iNat species here are sea slugs (7 nudibranchs + Elysia hedgpethi), a genuinely
distinctive Charleston hook.

**Sourcing discipline:** all ~30 tide values recompute-checked by script
against charleston-or.json — zero mismatches (windows in the table use a
compressed "6:00–10:55 AM" form of the fact-sheet strings; equivalence
verified). Fact-sheet top8 excludes past dates, so the ranking is framed
honestly as "remaining in 2026." Parks claims quoted verbatim from
stateparks.oregon.gov (Sunset Bay/Cape Arago/Shore Acres pages, raw-HTML
extracted, all 200): tri-park parking-permit rule, South Cove "superior
tidepools", North Cove seal-pup closure Mar 1–Jun 30 (reopened Jul 1 — timely
detail), Cape Arago restroom closure, 8 a.m.–dusk at Shore Acres. NB: the
parks page has a real typo ("drift logs, which cn move") — quote ends before
it. CUT an unverifiable "$10 daily" fee claim after finding the figure in the
page's Holiday Lights context, not general day-use; the article states the
permit requirement without a dollar amount. Simpson Reef facts (five pinniped
species, NWR closed to access, "thousands of marine mammals") cited to
shoreacres.net; skipped the popular "largest haul-out on the Oregon coast"
claim — no official source states it.

**Quality gates:** build green; page prerendered, in sitemap, on /guides/;
all 8 internal links verified against out/; 5 sources fetch 200; description
exactly 155 chars; diff = one new file.

**Velocity:** trailing 7 days = Seattle (07-12) + WA hub (07-14) + CA hub
(07-15) + Charleston (07-16) = 4 of ≤5.

**Notes for tomorrow:**
- **OR hub decision:** 07-15's note said one more OR guide unlocks the hub, but
  OR now has only 2 true station guides (Haystack Rock, Charleston) vs the 3+
  behind the WA and CA hubs. Recommend shipping **Newport/Yaquina Head** (queued
  P1) first and the hub the run after — consistency with the proven pattern
  beats speed. Publishing tomorrow would also hit the 5/week cap exactly.
- /guides/ index polish carried again (86 pv/wk, flat date list) — a strong
  non-writing primary if a breather from the velocity cap is wanted.
- Re-check newsletter_signup every run; still 0 — go-live blocked.
- TIME-BOMB unchanged: after ~Oct 15 re-check NPS Mora Road/Rialto closure.
- CA hub featuredRoundup expires 2026-07-17 (self-clearing; no action).

---

## 2026-07-15 — "Best Tide Pools in California 2026" state hub

**Health first:** Daily data refresh cron green (07-15 11:51Z success; 5
consecutive green). No open GitHub issues. Found stale local modifications to
pipeline-generated files (data-json/ics/embed-badge) from a previous local run —
discarded them (the cron owns those files) and pulled clean. Fact sheets fresh
(generated_on 2026-07-15).

**Metrics (PostHog, last 7d, host-filtered):** growth holds. 07-11: 30 pv,
07-12: 43, 07-13: 14, 07-14: 38, 07-15: 5 (partial). Referrers: **www.google.com
119** vs $direct 21, DuckDuckGo 6, Bing 4 — organic ~6:1 over direct. Top pages:
/guides/ 88 pv (still the #1 landing page), homepage 23, **Seattle July calendar
16 pv** (new — the WA cluster shipped 07-12/07-14 is already pulling search),
Acadia guide 11. GSC flywheel now returns rows: "port townsend tide pools" at
pos ~10-12 (4 impressions) — first evidence the station-guide → hub pattern
ranks. Tool events near-zero (1+1). `newsletter_signup` still 0, still absent
from taxonomy — go-live (P0 item 3) stays blocked; re-checked.

**Primary action (priority d — content backlog):** built the **"Best Tide Pools
in California 2026" hub** (content/articles/best-tide-pools-california-2026.md,
regional-calendars, commit 1c88c2d) — the pick BACKLOG flagged "CA IS READY NOW"
(5 station guides across 4 stations; bigger search market than WA).

**The angle — CA's calendar is upside down.** Computed from the 07-15 fact
sheets: the year's deepest daylight low at ALL FOUR CA stations lands on
Christmas Eve, Dec 24, in the afternoon (LJ/SD −1.88, Mont −1.83, PP −1.90 ft),
while the summer minus tides are dawn events — the exact opposite of WA, where
the year-deepest came Jul 14. Two supporting computed facts: (1) the south→north
lag — the same low hits La Jolla ~80-85 min before Pillar Point in BOTH seasons
(Jul 15: 4:54 AM vs 6:19 AM; Dec 24: 3:47 PM vs 5:10 PM), which is why northern
stations score better in July (more post-sunrise light: PP 199 daylight min/82
vs LJ 113/68) and southern ones in December; (2) the gate flip — Cabrillo
(gate 9 AM) and Fitzgerald (gate 8 AM) lock out summer dawn lows entirely but
comfortably hold December's afternoon lows. Time-sensitive hook: Jul 15-17 is
the summer's last deep dawn run (verified against full station JSON: no CA
daylight low below −1.3 ft again until Nov 24). Added a featuredRoundup card on
/beaches/ca/ through Jul 17 (self-clearing).

**Sourcing discipline:** every tide number recompute-checked against the
2026-07-15 fact sheets (~40 values, all matched). Caught and fixed one false
draft claim ("no daylight low reaches −1.2 ft until November" — two ~4 AM
August windows technically qualify; re-thresholded to −1.3 ft/Nov 24, verified
against full window data). Non-tide claims re-verified verbatim at write time:
Cabrillo hours + holiday closures (nps.gov/cabr hours page), Fitzgerald 8 AM
open + winter 5 PM close (smcgov.org), NPS tidepool guidance quotes
(nps.gov/cabr tidepools page), and the MPA nuance — Pacific Grove Marine
Gardens is an SMCA with take exceptions, NOT no-take (Asilomar SMR is) — so the
hub says "some full no-take, some with narrow exceptions" and routes to child
guides. Dec-24-year-deepest cross-checked against each child guide's recorded
July numbers (fact-sheet top8 excludes past dates).

**Quality gates:** build green, zero new warnings; route prerendered + in
sitemap; all 16 internal links resolve against out/; description 153 chars;
roundup card renders on /beaches/ca/ only; diff = the one new file.

**Velocity:** trailing 7 days = Seattle (07-12) + WA hub (07-14) + CA hub
(07-15) = 3 of ≤5. One article, no bulk generation.

**Notes for tomorrow:**
- **OR hub needs one more station guide** — Charleston/Cape Arago or
  Newport/Yaquina Head (both queued P1). Either is a solid next pick; after it
  ships, the OR hub unlocks (same proven pattern, third instance).
- **/guides/ index polish carried over again** (88 pv/wk, flat date list) —
  grouping station guides + hubs above the fold is overdue; consider making it
  the primary action if metrics hold and no time-sensitive content appears.
- Re-check newsletter_signup every run; still 0 — go-live blocked.
- TIME-BOMB unchanged: after ~Oct 15 re-check NPS Mora Road/Rialto closure
  (refresh La Push guide + WA hub if reopened).
- New TIME-BOMB (minor): the CA hub's featuredRoundup expires 2026-07-17 —
  no action needed (self-clearing on rebuild), just don't be surprised.

**Trigger:** owner noticed the Search Console property shows a generic
placeholder icon (black circle/triangle) and asked whether searchers see no
favicon. **Diagnosis: the favicon is correct and not the problem.** Full audit:
favicon.ico (16/32/48px), icon.svg, icon1.png (96px), apple-icon.png (180px),
manifest icons (192/512) all present; homepage `<head>` declares all four icon
`<link>`s; robots.txt blocks nothing; homepage is `index,follow`, self-canonical,
in sitemap; every icon serves 200 with the right content-type on the live domain;
the SVG renders correctly in-browser (navy tile, gold sun, teal foam-crest wave —
bold and legible small). The GSC placeholder is Google's default, shown because
Google hasn't re-fetched/associated the favicon with thetidewindow.com yet — the
domain is only ~11 days old (migrated 07-03). Favicon adoption lags a homepage
recrawl by days–weeks; nothing to fix there.

**What I did fix (the one on-target optimization):** the site had **no
Organization/logo in structured data** — homepage JSON-LD was WebSite-only and
Article `publisher` had no `logo`. Added (src/components/json-ld.tsx, commit
458e742): homepage now emits an `@graph` with an `Organization`
(@id /#organization) carrying a `logo` ImageObject (/icon-512.png, 512x512) plus a
`WebSite` referencing it; `ArticleJsonLd` publisher is the same org @id with an
inline logo ImageObject (Google Article guidelines want `publisher.logo`);
WebApplication publisher + Dataset creator now reference the same @id so Google
consolidates one logo-bearing entity. Build green, all JSON-LD validates, only
json-ld.tsx committed (pipeline data left to the cron).

**Found + backlogged (not fixed):** guide/article pages emit **no `og:image`**
(root opengraph-image covers only the homepage; `/opengraph-image` 308-redirects).
Left Article JSON-LD `image` unset for now (square logo = poor thumbnail); added a
P2 backlog item to add a real per-article/site OG image and then wire it in.

**Owner action to speed favicon pickup:** in GSC, run URL Inspection on
https://thetidewindow.com/ and click "Request Indexing" to nudge a homepage
recrawl; the favicon + new logo markup get picked up on Google's next crawl.
Verify the markup anytime with Google's Rich Results Test on the homepage.

---

## 2026-07-14 — "Best Tide Pools in Washington" state hub; organic search accelerating

**Health first:** Daily data refresh cron green (07-14 11:46Z success; 07-13,
07-12, 07-11, 07-10 all green before it; 07-09 was the last red, long recovered).
No open GitHub issues. Build green, zero new warnings. Fact sheets fresh
(generated_on 2026-07-14).

**Metrics (PostHog, last 7d, host-filtered to thetidewindow.com):** the inflection
holds and steepens. **131 pageviews** over 8 days (07-06→14): 07-10: 11, **07-11:
30, 07-12: 43** (a new daily high), 07-13: 14, 07-14: 18 (partial). Referrers are
now overwhelmingly organic: **www.google.com 98**, DuckDuckGo 6, Bing 4, Brave 1
— ~109 search-referred vs just 21 $direct. **Organic Google is the dominant
channel, ~4:1 over direct.** Top pages: **/guides/ index 82 pv** (by far the #1
landing page — the guides hub is now a search entry point in its own right), the
homepage 22, and the **Acadia station guide 13 pv** (up from 11 last week, 5 the
week before — still climbing). Tool events near-zero (1 station_selected, 1
window_result_viewed). `newsletter_signup` still 0 and still absent from the
project taxonomy — newsletter go-live (P0 item 3) stays blocked; re-checked.

**Primary action (priority d — content backlog, reinforced by b).** Built the
**"Best Tide Pools in Washington 2026" state hub**
(content/articles/best-tide-pools-washington-2026.md, category regional-calendars)
— the P1 pick flagged "WA IS NOW READY" the moment a 3rd WA station guide shipped
(07-12 Seattle, after Port Townsend 07-07 and La Push 07-09). It's the highest-
leverage editorial move the data points to: the /guides/ index is the #1 organic
landing page (82 pv/wk) and station guides pull search, so a hub that (a) targets
the "best tide pools in Washington" long-tail head term and (b) cross-links all
three WA guides + both WA regional calendars directly strengthens the exact
cluster that is already winning.

**The angle — a genuinely computed differentiator, not filler.** The hook is that
on **Tue Jul 14 (today) all three WA coasts hit their year-deepest daylight low on
the same day, but at staggered times** as the same low water propagates inland:
**La Push −3.00 ft @ 7:15 AM → Port Townsend −3.48 ft @ 10:25 AM → Seattle −3.80
ft @ 11:20 AM** (outer Olympic coast first, central Puget Sound ~4h later, and
deeper because the Sound amplifies the range). That reframes three separate
station guides into one map of the state's tidepooling by geography + clock. This
also gives the hub priority-b time-sensitivity: the peak run is live this week.

**Sourcing discipline:** every tide number traced to the 2026-07-14 fact sheets
(la-push-wa / port-townsend-wa / seattle-wa .json, untouched by my build) and
recompute-checked cell by cell — all 30+ values matched (Jul 14–17 run, Aug 8–9
weekend, La Push's weekday Aug 11–13 run). The one non-tide safety/access claim —
the NPS Mora Road / Rialto Beach closure — I re-verified verbatim at write time on
nps.gov/olym/planyourvisit/conditions.htm: **"Mora Road is closed to all traffic
for construction from July 8–Oct. 15, 2026"** and **"Rialto Beach will not be
accessible via Mora Road during this construction period"** — so the hub routes
La Push readers to Second Beach, consistent with the 07-09 guide. Discover Pass
existence confirmed on discoverpass.wa.gov; jurisdiction framing (state park vs
federal NP vs city beach) kept high-level and routed to child guides for detail —
no unverified dollar figures. NPS "arrive an hour before low tide" guidance quoted
as before.

**Quality gates:** `npm run build` green, zero new warnings; new route
/guides/best-tide-pools-washington-2026/ prerendered and in out/sitemap.xml;
description 148 chars; all 13 internal links verified to resolve against built
routes (5 guides, 4 beaches/wa pages, 2 tools, methodology); recompute-check
passed. Committed the article ONLY — left pipeline-regenerated public/data-json +
ics + embed-badge uncommitted (the cron owns them).

**Velocity:** editorial added in the last 7 days = La Push (07-09) + Seattle
(07-12) + this WA hub (07-14) = 3 of the ≤5/week cap. One article, no bulk
generation. (Port Townsend was 07-07, now outside the trailing-7 window.)

**Notes for tomorrow:**
- **Hub pattern is now proven and repeatable.** OR is the next state to reach 3
  station guides: Haystack Rock exists; Charleston/Cape Arago and Newport/Yaquina
  Head are still queued (P1). Ship one of those OR guides next, then the OR hub
  becomes unlockable. CA already has ≥3 (La Jolla, Cabrillo, Pacific Grove/Fitz/
  Pillar Point) — **a "Best Tide Pools in California" hub is arguably unlockable
  now** and CA is a bigger search market; consider it a strong alternative pick.
- **/guides/ index (82 pv/wk) still merits light polish** — it currently lists all
  articles flat by date with only category chips. Grouping station guides + hubs
  above the fold would convert more of that search traffic into deeper visits.
  Carried over from 07-12; still not done.
- Re-check newsletter_signup every run; still 0, event not in taxonomy — go-live
  stays blocked.
- TIME-BOMB unchanged: after ~Oct 15 re-check the NPS Mora Road / Rialto closure;
  if reopened, refresh BOTH the La Push guide and this WA hub to restore Rialto/
  Hole-in-the-Wall and soften the advisory.

---

## 2026-07-12 — Seattle / Alki + Constellation Park station guide; organic search inflects

**Health first:** Daily data refresh cron green (07-12 11:33Z success; 07-11,
07-10 green before it; 07-09 was the last red, long since recovered). No open
GitHub issues. Build green, no new warnings. First operator run since 07-09
(no runs 07-10, 07-11).

**Metrics (PostHog, last 7d, host-filtered to thetidewindow.com):** a real
inflection. 100 pageviews over the week — 07-10: 11 pv/11 visitors, **07-11: 30
pv/28 visitors**, 07-12: 24/24 — up sharply from the ~10/day of early July.
Referrers flipped: **www.google.com is now #1 at 55** (was 6 last week), plus
DuckDuckGo 5, Bing 4, Brave 1 — ~65 search-referred vs 33 $direct. **Organic
search is now the dominant channel**, on schedule for the months-0-3 curve
turning up. Top pages: **/guides/ index 44 pv** (the guides hub is itself a
search landing page now) and the **Acadia station guide 11 pv** (was 5 last
week — still climbing). Tool events near-zero (1 station_selected, 1
window_result_viewed). `newsletter_signup` still 0 and still absent from the
project taxonomy — newsletter go-live (P0 item 3) stays blocked; re-checked.

**Primary action (priority d — content backlog, reinforced by b).** Wrote the
**Seattle / Alki + Constellation Park station guide** (NOAA 9447130), the pick
explicitly flagged on 07-09. It's time-sensitive: this week Jul 12-16 is the
**year's deepest daylight run in Puget Sound, bottoming at -3.80 ft MLLW on Tue
Jul 14** (top of seattle-wa.json deepest_2026_daylight_lows_top8 — the year's
lowest daylight tide here). Priority b (the West Coast roundup) is already
satisfied and live on the state hubs; this is its station-level companion, the
same proven pattern as Port Townsend (07-07) and La Push (07-09). **This is the
3rd WA station guide — it unlocks the "Best tide pools in WA" hub** (needs >=3:
now Port Townsend, La Push, Seattle).

**Why this pick, from the data:** three runs straight, station guides + the
/guides/ index are the pages pulling organic Google traffic (Acadia 11, guides
index 44). The evidence says keep feeding the station-guide queue — so I did,
choosing the one station that is *also* peaking this exact week.

**Angle / differentiator:** unlike the outer-coast guides (dawn lows), I led on
Puget Sound's **late-morning-to-midday lows** (9:40 AM Sun -> 12:55 PM Thu) as
the "tidepool in the city, no pre-dawn alarm" hook, cross-linked to the
dawn-lows explainer. Also surfaced the **Seattle Aquarium Beach Naturalist**
presence this week (Lincoln Park, Mon Jul 13, 9:30 AM-noon) as a timely,
actionable, family-friendly draw.

**Sourcing discipline:** every tide number traced to
docs-internal/facts/seattle-wa.json (generated_on 2026-07-12; untouched by my
build) and recompute-checked against the file. Non-tide claims cited to
authoritative sources verified at write time: Seattle Aquarium Constellation
Park one-pager (best tide level "below 2 feet"/eelgrass "less than 1 foot", no
parking lot, no restrooms, the rock-line/animal descriptions), the Aquarium's
Beach Naturalist program page (season, mission quote, Golden Gardens), Seattle
Parks (Charles Richey Sr. Viewpoint / marine reserve, address), and the West
Seattle Blog naturalist calendar (Jul 13 Lincoln Park). Nice external
cross-check: the Blog independently lists "-3.7-foot low-low tide at 10:30 am"
for Jul 13 — essentially our computed -3.68 ft at 10:31 AM.

**Quality gates:** `npm run build` green; new route
/guides/seattle-alki-constellation-park-tide-pools-2026/ prerendered and in
out/sitemap.xml; description 152 chars; all 10 internal links verified against
built routes; recompute-check passed. Committed the article ONLY — left the
pipeline-regenerated public/data-json + public/ics + embed-badge uncommitted
(the deploy regenerates them; the cron owns them).

**Velocity:** editorial added in the last 7 days = Port Townsend (07-07) + La
Push (07-09) + this = 3 of the <=5/week cap. One article, no bulk generation.

**Notes for tomorrow:**
- **"Best tide pools in WA" hub is now unlockable** (3 WA guides exist). Strong
  next pick per P1: build the WA hub linking Port Townsend + La Push + Seattle,
  which also strengthens the /guides/ index that is already pulling search.
- OR station guides are the other lane: Charleston/Cape Arago and Newport/
  Yaquina Head are queued; neither is peaking imminently, so they're priority-d
  (no b boost) — the WA hub is the higher-leverage move given the index traffic.
- The /guides/ index drawing 44 pv is a signal worth acting on: consider light
  polish there (clear station-guide grouping / above-the-fold ordering) to
  convert that traffic into deeper visits.
- Re-check newsletter_signup every run; still 0, event not in taxonomy — go-live
  stays blocked.
- TIME-BOMB unchanged: after ~Oct 15 re-check the NPS Mora Road / Rialto
  closure and refresh the La Push guide if it reopens.

---

## 2026-07-09 — La Push station guide; caught a live NPS closure and pivoted to Second Beach

**Health first:** Daily data refresh cron green (07-08 11:58Z success; 07-07,
07-06 green before it). No open GitHub issues. Build green, no new warnings.
(No run on 07-08 — this is the first operator run since 07-07.)

**Metrics (PostHog, last 7d, host-filtered to thetidewindow.com):** 34 pageviews
across the three days with data — 07-06: 16 pv / 15 visitors, 07-07: 7 / 6,
07-08: 11 / 9. Referrers: 24 $direct, and now **10 search-referred** (Google 6,
Bing 3, Brave 1) — organic is starting to trickle. Standout page: the
**Acadia / Bar Island tide-pools guide drew 5 views**, the top article by far —
a real signal that station guides pull organic search. Zero `newsletter_signup`
events (the event isn't even in the project taxonomy yet), so newsletter
go-live stays blocked (P0 item 3 re-checked, still 0). Near-zero organic remains
the months-0–3 expectation — not a pivot signal.

**Primary action (priority d — content backlog, reinforced by b).** Took the
next backlog item, the **La Push / Rialto Beach + Hole-in-the-Wall station
guide** — a covered station (NOAA 9442396) peaking *this week*: Jul 12–17 is
Exceptional every day, deepening to the year's lowest daylight tide, −3.00 ft on
Tue Jul 14. Priority b (the time-sensitive West Coast roundup) I confirmed is
**genuinely satisfied and does not need a refresh**: I recomputed its headline
numbers (Seattle, Port Townsend, Pillar Point, Monterey, La Push) against the
fresh 07-08 fact sheets and every value matched exactly; the featuredRoundup
card self-clears after the 14th.

**The catch — and why this run mattered.** Write-time verification of the
non-tide claims surfaced a live NPS alert I would have otherwise sent readers
straight into: **Mora Road is closed beyond Mora Campground from July 8 to
October 15, 2026, and Rialto Beach / Hole-in-the-Wall is inaccessible the entire
time** (verbatim from the nps.gov/olym conditions page; the closure covers the
whole peak run and then some). Publishing a "go to Rialto this week" guide would
have been actively wrong. So I **pivoted the article to Second Beach** — a
0.7-mi trail off La Push Road (not Mora Road), open, in Olympic NP, with some of
the most accessible tidepools on the coast — served by the same tide station.
The guide now *leads* with a cited closure advisory, which turns the
"hole in the wall rialto beach low tide" searcher's likely intent into exactly
the fact they need this summer, then redirects them to open beaches (Second,
with Third as the quieter fallback) on the same tides. This is a better article
than the original brief, not a lesser one.

**Sourcing discipline:** every tide number traced to
docs-internal/facts/la-push-wa.json (generated_on 2026-07-08; untouched by my
build). The Mora closure, Second/Third Beach access + trail distances (0.7 mi /
1.4 mi off La Push Road, Quileute Reservation, no pets), the Hole-in-the-Wall
arch distance, and all tide-safety + tidepool-etiquette quotes are cited to
authoritative NPS Olympic pages; every external URL fetched or curl-checked to
HTTP 200 at write time.

**Quality gates:** `npm run build` green; new route
/guides/la-push-second-beach-tide-pools-2026/ prerendered and in
out/sitemap.xml; description 150 chars; all 8 internal links resolve to built
routes; recompute-check passed. Committed the article ONLY — left the
pipeline-regenerated public/data-json + public/ics uncommitted (the deploy
regenerates them; they are the cron's domain).

**Velocity:** post-launch editorial this week = roundup (07-04) + Pacific Grove
(07-05) + Port Townsend (07-07) + this = 4 of the ≤5/week cap. One article, no
bulk generation.

**Notes for tomorrow:**
- Logged a **time-bomb** in BACKLOG (P2 reliability): after ~Oct 15, re-check the
  NPS conditions page and, if Rialto reopens, refresh the La Push guide to
  restore Rialto/Hole-in-the-Wall as the marquee spot. Until then, publish no
  content directing readers to Rialto Beach.
- WA station guides now at 2 (Port Townsend, La Push); one more (Seattle / Alki +
  Constellation Park — also peaking this week, −3.80 ft year-deepest on Jul 14)
  unlocks the "Best tide pools in WA" hub. Strong next pick.
- The Acadia guide's 5 views is the clearest organic signal yet — station guides
  are working; keep feeding the queue. Consider whether the lone ME station
  (Bar Harbor) warrants a second Acadia-area piece given the demand.
- Re-check newsletter_signup every run; still 0, and the event isn't in the
  taxonomy — go-live stays blocked.

---

## 2026-07-07 — Port Townsend / Fort Worden station guide (WA), timed to this week's peak

**Health first:** Daily data refresh cron green (07-06 14:03Z success; 07-05,
07-04 green before it). No open GitHub issues. Build green, no new warnings.

**Metrics (PostHog, last 7d, host-filtered to thetidewindow.com):** 19
pageviews / 8 pageleaves, 13 of them on `/` (some are self/verification hits),
plus single views on /about/, /guides/, /tools/, and three article/guide pages.
Referrers: 17 $direct, 2 www.google.com — Google is starting to trickle in.
Zero `newsletter_signup` events, so newsletter go-live stays blocked (P0 item 3
re-checked, still 0 signups). The `pb_waitlist_signup` events in the raw feed
are a different product on this shared PostHog project, not Tidewindow. Near-zero
organic is exactly the months-0–3 expectation in the strategy brief — not a
signal to pivot.

**Primary action (priority d — content backlog, chosen over a bare priority-b
refresh).** Priority b (time-sensitive) is *already satisfied*: the West Coast
Jul 11–14 roundup is live, still numerically correct against the 07-06 fact
sheets, and self-clears after the 14th — refreshing it would add nothing today.
So I took the highest-leverage backlog item: the **Port Townsend / Fort Worden
station guide** (content/articles/port-townsend-fort-worden-tide-pools-2026.md,
served at /guides/port-townsend-fort-worden-tide-pools-2026/). Rationale: Port
Townsend (NOAA 9444900) is *peaking this very week* — Sat/Sun Jul 11–12 both
score a flat 100, and Mon/Tue Jul 13–14 hold the year's deepest daylight lows
(−3.48 ft) — so a station guide published now catches any "Fort Worden low tide
/ Port Townsend tide pools" interest right as the best window of the year lands.
It also advances the WA station-guide set toward the "Best tide pools in WA" hub
(needs ≥3 WA guides).

**Sourcing discipline:** every tide number traced to
docs-internal/facts/port-townsend-wa.json (generated_on 2026-07-06; facts file
untouched by my build, so citations stay valid). Fort Worden access + the
Discover Pass ($10 day / $45 annual) and the Point Wilson "not on state parks
land" note verified via parks.wa.gov at write time. Tidepool timing/footing/
etiquette quoted verbatim from NPS (Point Reyes tidepooling page). The one
natural-history claim — gumboot chiton = world's largest chiton, ~a foot long —
web-verified (up to 36 cm / 14 in) and cited. Species list from the station's
iNaturalist facts (CC BY-NC, © observers) with the attribution line intact.

**Quality gates:** `npm run build` green; new route prerendered and in
out/sitemap.xml; all 7 internal links resolve to built routes; regenerated
07-07 pipeline data confirms Jul 11–16 scores unchanged (100/100/90/90/90/90),
so predictions are stable. Committed the article ONLY — left the pipeline-
regenerated public/data-json + public/ics uncommitted (the deploy regenerates
them fresh, and they're the cron's domain, never hand-edited).

**Velocity:** post-launch editorial this week = roundup (07-04) + Pacific Grove
(07-05) + this = 3 of the ≤5/week cap. One article, no bulk generation.

**Note for tomorrow:** Priority b likely applies again — the Jul 15–16 tail is
still Exceptional coast-wide and the Jul 11–14 roundup's featuredRoundup card
expires after the 14th, so consider refreshing the roundup to the next upcoming
region (Aug 8–11 Puget run is the next 100-scorer) or advancing the next WA
guide (La Push / Rialto — strong "hole in the wall rialto beach low tide"
query). Re-check newsletter_signup count every run; still 0.

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
