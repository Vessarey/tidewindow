# Backlog

Prioritized queue for the daily agent. One primary item per run. Check items off
with the date; add discoveries at the appropriate tier.

## P0 — unblockers

- [x] 2026-07-03: Verify Pages deploy serves /tidewindow/ correctly — homepage
      renders live windows, automation disclosure intact, /data-json/index.json
      valid; no 404s.
- [x] 2026-07-03: Confirm IndexNow returns 200 in daily-refresh logs — "submitted
      83 URLs — HTTP 200".
- [x] 2026-07-03: PostHog fully wired (capture live + agent query key saved).
- [ ] NEWSLETTER GO-LIVE (everything is ready — do this before new articles):
      1) scripts/newsletter/sync-audience.mjs — HogQL-export distinct
         newsletter_signup emails (+ station/source props) from PostHog, upsert
         into a Resend Audience ("Minus Tide Alert").
      2) scripts/newsletter/send-weekly.mjs — build the weekly digest (per
         region: this week's ranked windows from public/data-json, species
         highlights), send as Resend Broadcast from
         alerts@updates.thetidewindow.com (Broadcasts auto-handle unsubscribe).
      3) First issue: send manually-reviewed copy; then update EmailSignup
         blurbs + /newsletter/ page from "starting this season" to live.
      4) Add weekly cadence note to JOURNAL template (send day: Thursday).
- [ ] Verify Resend Receiving MX flips to "verified" (added to Vercel DNS
      2026-07-03; sending already verified). Check:
      GET https://api.resend.com/domains/b06d98e7-4963-4e74-9cf3-7f73823194e2

## P1 — content queue (one per day max; ≤5/week)

- [ ] Weekly regional roundup format: "This week on the {region} coast" — start
      with the region whose upcoming windows score highest; refresh weekly (this
      doubles as the future newsletter body).
- [ ] Monterey / Pacific Grove station guide article (station exists, no guide).
- [ ] Port Townsend / Fort Worden station guide article.
- [ ] La Push / Rialto Beach + Hole-in-the-Wall station guide article (strong
      query: "hole in the wall rialto beach low tide").
- [ ] Seattle / Alki + Constellation Park station guide article.
- [ ] Charleston / Sunset Bay + Cape Arago station guide article.
- [ ] Newport / Yaquina Head + Otter Rock station guide article.
- [ ] "Best tide pools in {state}" hub articles (OR, WA, CA, ME) once ≥3 station
      guides per state exist.
- [ ] August 2026 monthly-calendar batch: add "2026-09" to PUBLISHED_MONTHS on
      Aug 1 rollover per staged-rollout rule (2026-08 already published).
- [ ] "Sneaker waves explained" (quote NWS verbatim; safety-framed, non-YMYL).
- [ ] Winter 2026-27 seasonal preview (Nov): daylight afternoon lows arrive.

## P2 — product

- [ ] iNat taxa filter: land species occasionally slip in (e.g. Garden Snail at
      Seattle). Constrain to marine taxa ids or filter terrestrial families in
      the pipeline.
- [ ] NDBC buoy swell for 7-day conditions row (spec §4f full version).
- [ ] ZIP → nearest-station lookup for the finder (static lookup table).
- [ ] Per-station OG images (station name + mini heatmap via ImageResponse).
- [ ] Exit-intent signup (desktop only, frequency-capped, 2nd pageview+).
- [ ] "Tidepooling 101 in 5 days" email course content (ships with Resend).
- [ ] Print stylesheet polish for month pages (page-break rules).
- [ ] 2-4 new stations: Crescent City CA (9419750), Westport WA (9441102),
      Woods Hole MA (8447930), Crystal River FL? — verify ids + tidepool
      relevance first; prefer harmonic.

## P2 — infra / reliability (discovered 2026-07-03)

- [ ] CI Node deprecation: Actions log warns actions/checkout, setup-node,
      upload-pages-artifact, upload-artifact, deploy-pages target Node 20 (forced
      to 24). Non-blocking now; bump to current major versions before GitHub drops
      the Node-20 shim.
- [ ] Consider building deploys from committed data instead of re-fetching NOAA
      live every deploy. `.pipeline-stamp` is gitignored, so each CI build re-runs
      the full pipeline against NOAA (12 stations); the soft-error retry (added
      2026-07-03) makes this resilient, but building from the already-committed
      public/data-json would be faster and remove the upstream dependency from the
      deploy path entirely.

## P3 — distribution

- [ ] Quarterly dataset #2 (Oct 2026): "Weekend Window Scarcity Index" — share of
      Exceptional windows that land on weekends, by station.
- [ ] Submit site to relevant directories (tool directories, dark-sky-style
      hobby lists, awesome-lists) — only genuinely relevant ones, no spam.
- [ ] Badge outreach page: a short "for websites" pitch on /embed/ aimed at
      park friends-groups and surf shops (no cold outreach — inbound only).
- [ ] Reddit/forum participation is OUT OF SCOPE for the agent (authenticity
      rule) — note for the owner instead in JOURNAL if opportunities appear.

## Done

- [x] 2026-07-02: Launch build — 12 stations, 4 tools, 20 articles, embed
      badges, ICS feeds, dataset #1, daily refresh cron, IndexNow.
