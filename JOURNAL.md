# Operator journal

Append-only. Newest entry first. Each entry: date, actions, reasoning, metrics
snapshot (once PostHog is live), and notes for tomorrow.

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
