# Tidewindow — Definitive Site Specification

**Decision record.** Tidewindow was ranked #1 by all three adversarial judges (totals 48, 48, 45 — highest on every list) and is the only concept of six with zero fatal flaws from any judge. Judge 3 verified the SERP-gap claim directly: demand is proven (local outlets hand-rewrite "exact 2026 minus tide dates" listicles every spring; WA state publishes a "best daylight low tides" PDF), no computed national competitor exists, and LLMs structurally cannot compute future tide × daylight intersections — so answer engines must cite whoever does. Grafted from runners-up: dual-source numeric verification and the window-timed email course (The Dark Window), the conditions-aware "Worth the Trip" check and alert-first email framing (StockedWaters), the printable 12-month station calendar (Dark Sky Almanac), and methodology-page discipline (GrainMath).

---

## 1) Name, tagline, domain

- **Name:** Tidewindow
- **Tagline:** *Know the hours the ocean gives back.*
- **Slug / basePath:** `tidewindow` → launches at `https://vessarey.github.io/tidewindow` (GitHub Pages project site; set `siteConfig.basePath = "/tidewindow"`).
- **Custom domain upgrade path:** acquire `tidewindow.com` (fallbacks: `tidewindows.com`, `minustide.co`) as soon as practical; when live, 301 the Pages host and update `siteConfig.url`. Per the brief, a .com materially improves crawl trust — treat as a week-1 follow-up, not a launch blocker.

**One-liner:** Tidewindow computes the exact daylight hours when the ocean pulls back far enough to make a coast trip worth it — scored, ranked minus-tide windows for US beaches, exportable to your calendar.

---

## 2) Audience & core value

**Who:**
1. Coastal day-trippers and families planning tidepool visits (PNW, California, New England primary; Gulf/Southeast for winter coverage).
2. Beachcombers, sea-glass and agate hunters who care about *very* low tides after winter swell.
3. Beach/tidepool photographers hunting golden-hour × low-tide overlap.
4. Teachers and group leaders scheduling field trips weeks ahead.

**Core value:** Everyone else publishes raw tide tables or one-town blog posts rewritten by hand each spring. Tidewindow answers the question people actually ask — *"is this weekend any good, and if not, which morning is?"* — with a computed, scored, dated answer for their specific beach, exportable as a calendar. Every number is deterministic arithmetic over NOAA CO-OPS harmonic predictions (free, keyless, published years ahead) intersected with locally computed sunrise/sunset. The LLM never has to *know* a fact — only phrase one.

**Why it survives 2026 Google + AI engines:** non-commodity by construction (a generative model cannot produce future tide-daylight windows), structurally fresh (the answer changes daily), citation-forcing (engines must cite a computed source), and the email hook is perishable and recurring by nature.

---

## 3) Information architecture

Static export (`next build` → `out/`), trailing-slash URLs, every indexable page server-rendered at build time. Daily rebuild via GitHub Actions cron regenerates all computed data.

```
/                                        Home: today's best windows nationally + finder entry
/tools/                                  Tools index
/tools/tide-window-finder/               Flagship tool
/tools/trip-picker/                      Best hour within a date range
/tools/year-heatmap/                     365-day window-quality heatmap per station
/tools/golden-hour/                      Photography: golden hour × low tide overlap
/beaches/                                National index (by state)
/beaches/[state]/                        State hub: best upcoming windows across its stations
/beaches/[state]/[beach-slug]/           Station guide (evergreen + live 30-day windows)
/beaches/[state]/[beach-slug]/[yyyy-mm]/ Monthly calendar page (programmatic, staged rollout)
/king-tides/[season]/                    e.g. /king-tides/2026-2027/ — event × season pages
/guides/[slug]/                          Editorial cluster articles
/data/                                   Original datasets index
/data/[dataset-slug]/                    e.g. /data/daylight-minus-tide-index-2027/
/newsletter/                             Dedicated signup landing page w/ sample issue
/embed/                                  Embeddable badge docs + generator
/about/  /methodology/  /contact/        Trust pages (honest automation disclosure)
/feed.xml  /sitemap.xml  /robots.txt  /llms.txt
```

**Page types:** Home; Tool pages; State hubs; Station guides; Monthly station calendars (programmatic); Event/season pages (king tides, "Summer Minus Tide Season 2027"); Guides (pillar + cluster); Dataset pages; Trust pages; Newsletter landing.

**Launch scope (month 1):** 1 pillar + ~19 guides, 12 flagship station guides (4 OR, 4 CA, 3 WA, 1 New England), 3 state hubs (OR, CA, WA), all 4 tools, `/king-tides/2026-2027/`, trust pages. Monthly calendar pages roll out programmatically *only after* GSC confirms indexing of the first batch (10–20 → 50–100 → weekly batches ≤200), per the brief's staged-rollout rule. Full 1,000-station coverage is a year-2 destination, not a launch requirement.

---

## 4) Interactive tools at launch

All tools are client-leaf React components reading **precomputed static JSON** (`/data-json/stations/{id}/windows.json`) generated at build time by the pipeline — no runtime APIs, no server, AI-crawler-readable HTML fallback tables rendered on every station page.

### 4a) The Window Score (shared logic, published openly on /methodology/)

For each low-tide event at a station over the next 400 days, computed from NOAA CO-OPS predictions (station datum MLLW) + astronomy-engine sun times:

- **Window** = contiguous interval when predicted height < **+1.0 ft MLLW** (walkable threshold), centered on the low. `arrive_by` = 60 min before the low; `leave_by` = when the tide re-crosses +1.0 ft (rounded to 5 min).
- **Depth (0–50 pts):** linear from 0 pts at +0.5 ft to 50 pts at −2.0 ft MLLW (clamped).
- **Daylight (0–30 pts):** overlap of the window with [sunrise, sunset]: 0 pts under 30 min, scaling linearly to 30 pts at ≥3 h. Windows with zero daylight overlap score 0 total and are labeled "night tide."
- **Timing (0–10 pts):** Saturday/Sunday/US federal holiday +10; Friday +5.
- **Season comfort (0–10 pts):** monthly regional factor from NOAA climate normals (air temp + daylight length), precomputed per station region.
- **Rating bands:** 90–100 Exceptional · 75–89 Great · 60–74 Good · 40–59 Fair · <40 Skip.

### 4b) Tide Window Finder (flagship)

- **Inputs:** beach/station search (name, state, or "near ZIP" via static ZIP→station lookup); optional depth preference (Any low / Minus tides only / −1.0 ft and lower).
- **Outputs:** ranked next-30-days list: date, low time & height (ft MLLW), score + rating badge, arrive-by/leave-by, daylight & weekend flags, sparkline tide curve for the day; plus a one-sentence computed synthesis ("Only 3 of July's 62 lows at this station fall below −1.0 ft in daylight; the best is Tue Jul 14, 7:12 AM").
- **Logic:** filter precomputed windows to next 30 days, sort by score. Core result always free and ungated.

### 4c) Trip Picker

- **Inputs:** station + date range (e.g., "our vacation week," max 21 days).
- **Outputs:** the single best window in range (headline card) + up to 3 runners-up; if the best score < 40, an honest "this isn't a great week — nearest Great window is [date]" with the next qualifying date.

### 4d) Year-at-a-Glance Heatmap

- **Inputs:** station + year (current or next).
- **Outputs:** 365-cell month-grid calendar, each day colored by its best window score; hover/tap reveals time/height/score; print stylesheet included. This page doubles as the visual anchor of every monthly calendar page.

### 4e) Golden Hour × Low Tide (photographers)

- **Inputs:** station + month.
- **Outputs:** table of windows where the low falls within ±90 min of golden hour (sun altitude < 10°), with sun azimuth at low tide (which way the light points).

### 4f) Worth-the-Trip check *(grafted from StockedWaters)*

On windows within the next 7 days only, show a conditions row: nearest NDBC buoy swell height/period + NWS point forecast (fetched at daily build time, baked into JSON, timestamped "as of [build time]"). Framed strictly as "check conditions before you go" — predictions vs. actual water level disclaimer on every instance. Never rendered for windows >7 days out.

### 4g) Email-gated enhanced outputs (the conversion layer)

- **iCal subscription feed** per station (`.ics` regenerated daily at build; URL revealed post-signup): every Good+ daylight window for the next 12 months as calendar events with arrive-by alarms.
- **Printable 12-month PDF calendar** per station *(grafted from Dark Sky Almanac)* — the year heatmap + month tables, generated at build.
- Both are delivered via click-triggered two-step opt-in (see §6). On-screen results are never gated.

### 4h) Embeddable badge (passive backlink engine)

`/embed/` generates a copy-paste snippet: a static iframe showing "Next great low tide at [beach]: Tue Jul 14, 7:12 AM (−1.4 ft)" with a "Computed by Tidewindow" attribution link. Targets: local blogs, aquariums, park friends-groups, surf shops.

---

## 5) Launch content: 20 pieces, priority order

Each targets a real long-tail query pattern (4+ words, KD<30, proven by hand-written annual listicles in the vertical). Every piece opens with a dated, self-contained 40–80-word computed answer naming its NOAA station ID.

1. **How to Plan a Tidepooling Trip Around Minus Tides (Complete 2026 Guide)** — *Pillar (3,500+ words).* What minus tides are, the −0.5 ft rule, reading windows, region-by-region season timing, safety basics quoted from NPS pages; links to every cluster page and tool. Targets "when is the best time to go tide pooling."
2. **What Is a Minus Tide? (And Why Only a Few Each Month Happen in Daylight)** — Defines MLLW and negative tides with a quotable 2-sentence definition; computed stat: share of 2026 minus tides that fall in daylight by coast. Targets "what is a minus tide."
3. **How Low Does the Tide Need to Be for Tide Pools? The −0.5 ft Rule, Tested Against NOAA Data** — Tests the folk rule against 12 months of predictions at 10 stations; gives per-coast thresholds. Targets "how low does the tide need to be for tide pools."
4. **Oregon Coast Minus Tide Calendar 2026: Every Daylight Minus Tide, Month by Month** — Full-year computed table for 6 OR stations with best-10 ranked; the state's hand-written listicles prove this exact demand. Targets "oregon coast minus tides 2026."
5. **Puget Sound Low Tide Calendar 2026: The 10 Best Daylight Lows of Summer (Only 4 Are Weekends)** — Seattle/Tacoma-area stations, summer-weighted; the computed weekend scarcity stat is the hook. Targets "puget sound low tide 2026."
6. **La Jolla Tide Pools: Best Dates in 2026, Ranked by Daylight Minus Tides** — Station 9410230 windows + what observers logged there last month (iNaturalist counts, attributed). Targets "la jolla tide pools best time."
7. **Cabrillo National Monument Tide Pools: 2026 Minus Tide Dates and the Best Hour to Arrive** — Station 9410170; arrive-by/leave-by framing; park-hours caveat quoted from NPS. Targets "cabrillo tide pools low tide schedule."
8. **Haystack Rock Tidepool Windows 2026: The Dates the Reef Is Fully Walkable** — Cannon Beach station; walkability threshold explained; puffin-season crossover note. Targets "haystack rock low tide 2026."
9. **Fitzgerald Marine Reserve: Best Tide Pooling Days in 2026 (Month-by-Month Windows)** — Half Moon Bay area station; ranger-guided-day overlap. Targets "fitzgerald marine reserve low tide schedule 2026."
10. **King Tides 2026–27: Extreme-Low Dates for Every US Coast and What They Expose** — Season/event page published months ahead *(Dark Window graft)*; both the dramatic highs and the rare daylight minus-lows. Targets "king tides 2026 dates."
11. **Best Time for Sea Glass Hunting: How Minus Tides and Winter Swell Decide What the Beach Gives Back** — Joins tide windows with NDBC swell climatology; winter-content anchor. Targets "best time for sea glass hunting."
12. **Why East Coast Tide Pooling Is Different: The −1.0 ft Rule from Maine to Florida** — Explains semidiurnal range differences with computed station comparisons; hub for New England expansion. Targets "tide pooling east coast when."
13. **Acadia National Park Tide Pools: 2026 Low Tide Windows for Bar Island and Ship Harbor** — Bar Harbor station; bar-crossing timing is a safety-framed, high-intent query. Targets "acadia tide pools low tide."
14. **Tidepooling With Kids: A Checklist and the 2026 Weekend Windows Worth the Drive** — Family-angle checklist (the cluster lead magnet) + best weekend windows per region. Targets "tide pooling with kids tips."
15. **Golden Hour at Low Tide: A Photographer's 2026 Calendar for the West Coast** — Tool-companion piece; 20 best golden-hour × minus-tide overlaps of 2026. Targets "low tide photography golden hour."
16. **Why Summer's Lowest Tides Happen at Dawn on the Pacific Coast** — Evergreen explainer of tidal mechanics with computed hour-of-day histograms; high citability. Targets "why are low tides early morning summer."
17. **How to Read a Tide Table (and What Tide Charts Don't Tell You)** — Beginner explainer that positions the Window Score as the answer; internal-link hub. Targets "how to read a tide table."
18. **Agate Hunting on the Oregon Coast: Best Months, Tides, and 2026 Dates** — Winter minus tides + post-storm gravel beds; non-YMYL beachcombing winter anchor. Targets "agate hunting oregon coast best time."
19. **Pillar Point Tide Pools: 2026 Windows, Plus the 47 Species Logged There Last Month** — Station guide with live iNaturalist species-frequency table (CC-licensed, attributed). Targets "pillar point tide pools low tide."
20. **Storm Beachcombing: What Winter Swell Plus a Minus Tide Uncovers (2026–27 Window List)** — NDBC swell data × tide windows; completes the winter-trough content strategy. Targets "beachcombing after storms best time."

---

## 6) Email capture design

**Infrastructure reality:** static site; capture is recorded as PostHog events per the repo design (`posthog.capture('newsletter_signup', { form, station })` + `identify(generatedId, { email })` — generated ID as distinct_id, never raw email). The daily agent exports new signups via the PostHog query API and sends via Resend (per owner's preferred stack). SPF+DKIM+DMARC, one-click unsubscribe, double opt-in from day one.

**The hook — "The Minus Tide Alert":** pick your stretch of coast; get one short weekly email with (a) this week's best windows within driving distance, ranked; (b) what's being spotted in the pools right now (live iNaturalist counts); (c) a heads-up when a rare daylight king-tide low is coming. The value prop sentence on every form: *"One email a week: the exact hours your coast is worth the drive — computed from NOAA data, never padded."*

**Placements (all click-triggered two-step opt-ins; no entry popups on mobile):**
1. **Tool gates (primary):** after any Finder/Trip Picker/Heatmap result — "Email me my 12-month calendar for this beach (PDF + iCal feed)." Core on-screen result always free.
2. **Inline mid-article** after the first computed table: "Get the weekly windows for [region]."
3. **End-of-article** cluster-matched magnets: Tidepooling With Kids checklist (family cluster), 20 Golden-Hour Overlaps sheet (photo cluster), Sea Glass & Storm calendar (beachcombing cluster).
4. **Exit-intent, desktop only,** frequency-capped, 2nd pageview+.
5. **/newsletter/ landing page** with a real sample issue.

**Flagship magnet *(Dark Window graft)*:** **"Tidepooling 101 in 5 Days"** email course — day 5 lands the day before the subscriber's next Good+ window at their chosen station, so the course ends with "now go — tomorrow at 7:12 AM." Course start dates are computed per station at signup.

**Subscribers get:** the weekly regional alert; station PDF+iCal on request; king-tide season previews; the quarterly dataset announcements. Target capture: ≥1.5% site-wide by month 3, 3%+ by month 6.

---

## 7) AEO plan

**Schema.org (JSON-LD, raw escaped `<script type="application/ld+json">` in Server Components, typed with schema-dts):**

| Page type | Types |
|---|---|
| Root layout | `Organization` + `WebSite` (with `SearchAction` for the finder) |
| Station guides & monthly calendars | `Dataset` (per-station window data: name, temporalCoverage, `isBasedOn` → NOAA CO-OPS station URL, license) + `BreadcrumbList` + `Place` (beach geo) |
| Guides/articles | `Article` (datePublished/dateModified honest, `author` = Tidewindow with About link) + `BreadcrumbList`; lightweight `FAQPage` only where a real Q&A block exists (extraction hygiene for non-Google engines — build nothing that depends on it) |
| Tool pages | `WebApplication` (free, browser) + `BreadcrumbList` |
| Dataset pages | `Dataset` with `distribution` → downloadable CSV |
| Event/season pages | `Article` + `Dataset` |

**llms.txt:** publish a minimal one at `/llms.txt` — site purpose, methodology summary, index of the ~25 highest-value pages, dataset CSV links, and an explicit "cite as Tidewindow, computed from NOAA CO-OPS station predictions" line. Cost: ~zero. Expectation set honestly per research: crawlers rarely fetch it and Google ignores it; it is hygiene, not strategy. The real AEO work is below.

**Citability tactics (the actual plan):**
- Every page opens with a **self-contained, dated 40–80-word answer** containing a statistic + named primary source ("…per NOAA station 9410170") — the +41%/+40% Princeton GEO pattern, structural on every page.
- **Question-formatted H2s** answering fan-out sub-queries: how low is low enough, what will I see, is it safe, when's the best month, weekday vs weekend.
- **All numbers in server-rendered HTML tables** — no client-rendered primary content (no AI crawler except Googlebot executes JS).
- **robots.txt allows OAI-SearchBot, PerplexityBot, Claude-SearchBot** explicitly (training bots GPTBot/ClaudeBot may be blocked separately — owner's call, default allow-search/allow-training-off).
- **Bing Webmaster Tools + IndexNow on every publish** (ChatGPT rides Bing, 87% overlap); verify **Brave indexing** separately (Claude). GSC + sitemap day one; RSS at `/feed.xml` advertised in metadata alternates.
- **Visible "computed on [date]" stamps** on every data block (Perplexity freshness reranker); `lastModified` in sitemap only on real content change.
- **Quarterly original dataset** (first: *The 2027 Daylight Minus-Tide Index — 500 US coastal sites ranked by total explorable daylight hours*, CSV download + methodology) — the citation/link magnet.
- Never use `nosnippet`/`max-snippet` (kills AIO eligibility).

---

## 8) Daily agent content roadmap

**Daily run (GitHub Actions cron, then commit → deploy):**

1. **Data refresh (every run, non-negotiable):** pull NOAA CO-OPS predictions for active stations (cache full-year harmonics; the API is keyless and stable), recompute all windows/scores, regenerate station JSON, `.ics` files, 7-day NDBC/NWS conditions, and rolling "next 30 days" blocks on every published page. This alone makes the site genuinely daily-fresh with zero hallucination surface.
2. **Pick today's publish/improve action** by priority queue:
   a. **Time-sensitive:** an Exceptional window or king-tide event inside 14 days for a covered region → regional roundup + newsletter draft.
   b. **Seasonal backlog:** the 20-piece launch list, then season-matched cluster expansion (spring/summer: tidepooling; fall/winter: king tides, sea glass, agates, storm beachcombing, Gulf/Southeast coverage — the winter-trough mitigation is scheduled, not improvised).
   c. **GSC flywheel (from month 3):** mine Performance queries at positions 8–20; expand or create the matching page.
   d. **Programmatic rollout:** monthly calendar pages in staged batches (10–20 → verify indexing in GSC → 50–100 → weekly ≤200), each requiring 30–60% page-specific computed content + a 100–150-word unique synthesis; if a batch's indexing stalls, pause the template.
   e. **Refresh pass (30–50% of capacity once inventory exists):** roll dated pages forward, update stats to current data, visible changelogs.
3. **Newsletter assembly** (weekly): regional best-windows digest from the same computed data.

**Data sources:** NOAA CO-OPS (predictions, datums, station metadata) · astronomy-engine (local sun computation) · iNaturalist open API (species counts near stations, CC-licensed photos only, attributed) · NDBC buoys (swell) · NWS api.weather.gov (7-day forecasts) · GSC API + Bing WMT (indexing, queries) · PostHog query API (engagement, conversions).

**Quality gates (config-level; any failure blocks publish):**
- **Tier 1 — deterministic:** all numbers on the page match a fresh recomputation; **dual-source check** *(Dark Window graft)*: sun times cross-validated against NOAA solar calc / USNO within ±2 min, tide values spot-checked against CO-OPS published daily predictions within ±0.05 ft — a numeric diff, not an LLM judgment; all cited URLs return 200; valid schema; no placeholder text; on-topic (auto-reject off-niche briefs).
- **Tier 2 — grounding:** every non-computed claim (park hours, access rules) entailment-checked against a page fetched during the run; zero parametric-memory statistics; information-gain check against the current top-10 (kill drafts that add no computed data or original angle).
- **Tier 3 — honesty & safety:** no fake authors — content published under the Tidewindow brand with the /methodology/ automation disclosure; safety guidance only quoted verbatim from NPS/state-park pages with links; **hard blocklist:** shellfish harvesting/biotoxin advice, rescue/survival instruction, anything YMYL. Framing rule on every conditions mention: predictions ≠ actual water levels; check local conditions.
- **Velocity caps:** ≤5 editorial pieces/week; programmatic ≤200/week post-verification; never bursts.
- **Circuit breakers:** weekly GSC manual-action check; if any cluster drops >30% in a confirmed update window → freeze and audit; stalled template → pause and prune; zero-impression pages 410'd after ~6 months; seasonality-aware comparisons (YoY, not WoW) so winter troughs don't trip false alarms.

---

## 9) Design direction

**Vibe: a field almanac that learned to compute.** Printed tide-table heritage (the WA state PDF, harbor almanacs) fused with a precise modern data tool. Nothing dashboard-generic, nothing purple-gradient-AI.

- **Palette:** Tide Ink `#0F3038` (deep blue-green, primary text/surfaces) · Foam `#EFF7F3` (background) · Exposed Sand `#EAD9BD` (section bands, cards) · Kelp `#1E7A6F` (links, primary actions) · Anemone `#E4674A` (score badges, accents — used sparingly) · Low-tide Gold `#E0A93E` (Exceptional ratings, highlights). Dark mode: Tide Ink base with Foam text.
- **Typography:** **Fraunces** (variable serif) for display/headlines — warm, almanac-flavored, distinctive; **a clean grotesque (e.g., Inter)** for body; **tabular monospace (IBM Plex Mono)** for every number, time, and tide height — the data *looks* like instrument output. Station IDs set as small-caps "stamp" chips: `NOAA 9410170`.
- **Signature motifs:** (1) a real computed **tide curve SVG** as the recurring visual — hero shows today's curve at a featured station with the window shaded and sunrise/sunset ticks; every window card carries a day-curve sparkline; (2) the **horizon band** — pages divided by a single hairline "waterline" rule; (3) the **year heatmap grid** as the brand's iconic artifact (also the OG-image template: station name + this month's mini-heatmap, generated via `ImageResponse`, 1200×630).
- **Layout:** data-first — the computed answer block (dated, 40–80 words, sand-colored card) sits above the fold on every page before any prose; generous whitespace; max ~68ch prose measure; tables full-width with sticky headers; print stylesheets treated as a first-class feature (people pin these calendars to fridges).
- **Tone:** plain, numerate, quietly charming ("Only 3 mornings in July qualify. Here's the math."). Never breathless, never padded.

---

## 10) Success metrics (PostHog)

**Setup:** posthog-js with autocapture + Web Analytics dashboard; reverse-proxy rewrites are unavailable on GitHub Pages at launch (accept ad-block loss; add the `/relay/*` proxy when the custom domain + Vercel/CF move happens); `person_profiles: 'identified_only'`; `identify()` called **only** on signup with a generated ID.

**Custom events:**
- `station_selected` {station_id, state, tool}
- `window_result_viewed` {station_id, best_score, days_to_best}
- `trip_picker_run` {station_id, range_days, best_score}
- `heatmap_viewed` / `heatmap_printed` {station_id}
- `calendar_gate_clicked` {station_id, asset: 'pdf'|'ics'} (two-step opt-in step 1)
- `newsletter_signup` {form: 'tool_gate'|'inline'|'end_article'|'exit'|'landing', station_id?} + identify
- `pdf_downloaded` / `ics_url_revealed` {station_id}
- `embed_badge_loaded` {host_domain} (fired from the embed)
- `dataset_csv_downloaded` {dataset}

**KPIs & targets (agent reviews weekly via query API; recap endpoint daily):**

| Metric | How | Month-3 / Month-6 target |
|---|---|---|
| Email capture rate | `newsletter_signup` uniques ÷ unique visitors | ≥1.5% / ≥3% (fix the offer if under 1.5%) |
| Subscribers | cumulative signups | 100–300 / 1,000 |
| Tool engagement | `window_result_viewed` ÷ sessions | ≥25% / ≥35% |
| Tool-gate conversion | signup(form=tool_gate) ÷ `calendar_gate_clicked` | ≥30% |
| Organic sessions | channel breakdown (sessions table) | indexing confirmed / few hundred per month |
| AI-referral sessions & their signup rate | `$entry_referring_domain` in (chatgpt.com, perplexity.ai, gemini, copilot) | tracked from day 1; expect low volume, 4–23× conversion |
| Per-cluster pageviews | pathname prefix grouping | trend up per cluster post-indexing |
| Embed network | distinct `host_domain` on `embed_badge_loaded` | 5 / 25 hosts |
| Return visitors | WoW returning-visitor share | ≥15% by month 6 |

**Non-PostHog companions the agent tracks in the same weekly review:** GSC indexing rate per template, positions 8–20 query list (the flywheel input), Bing/Brave index verification, newsletter open/CTR and spam-complaint rate (<0.1%).

**Timeline expectations (so nobody panics):** months 0–3 near-zero organic — success is indexing + tools live + first 100–300 subs; months 4–6 first long-tail and Bing/Brave/AI citations; months 6–9 cluster authority + programmatic expansion if batch metrics justify; months 8–12 competitive movement. The email list is the asset the algorithm can't take away.