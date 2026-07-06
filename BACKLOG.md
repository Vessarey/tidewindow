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
- [ ] NEWSLETTER GO-LIVE — pipeline CODE DONE 2026-07-05; sending blocked only
      on real signups + owner copy review (runbook:
      docs-internal/resend-newsletter.md):
      1) [x] 2026-07-05 scripts/newsletter/sync-audience.mjs — HogQL-exports
         distinct newsletter_signup emails from PostHog (host-filtered; shared
         project), upserts additively into Resend Audience "Minus Tide Alert"
         (created via API, id ff50e851-e711-4ad6-b861-5774682c8d5a, empty as
         expected — 0 signup events). Never touches existing/unsubscribed
         contacts. Verified against both live APIs.
      2) [x] 2026-07-05 scripts/newsletter/send-weekly.mjs — composes the
         weekly digest per region from public/data-json (best Good+ daylight
         window per station, species via iNat facts, prediction disclaimer,
         Resend unsubscribe placeholder). --dry-run renders to
         docs-internal/newsletter-drafts/ with zero network calls; sending
         requires --send AND --owner-reviewed AND a non-empty audience (all
         three gates verified live; sample issue committed).
      3) [ ] First issue: owner reviews rendered copy (see
         newsletter-drafts/2026-07-05 sample), record approval in JOURNAL, run
         send-weekly.mjs --send --owner-reviewed; then update EmailSignup
         blurbs + /newsletter/ page from "starting this season" to live.
         BLOCKED until newsletter_signup count > 0 — re-check every run.
      4) [ ] Add weekly cadence note to JOURNAL template (send day: Thursday).
- [x] 2026-07-05: Resend Receiving MX now "verified" (GET /domains/b06d98e7-…
      shows domain verified with DKIM, SPF MX+TXT, and Receiving MX all
      verified; recorded in docs-internal/resend-newsletter.md).

## P1 — content queue (one per day max; ≤5/week)

- [x] 2026-07-04: Weekly regional roundup format LAUNCHED — inaugural instance
      is the time-sensitive West Coast Jul 11–14 run
      (content/articles/west-coast-minus-tides-july-11-14-2026.md), triggered by
      priority (b) (coast-wide 90+ within 14 days). Recurring going forward:
      refresh weekly with the highest-scoring upcoming region; doubles as the
      future newsletter body.
- [x] 2026-07-05: Monterey / Pacific Grove station guide LAUNCHED
      (content/articles/pacific-grove-tide-pools-2026.md) — covers Point Pinos,
      Asilomar, Lovers Point; dawn/dusk split; 3 no-take MPAs verified via CDFW.
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
- [ ] Featured-roundup slot on /beaches/[state] hubs: surface the latest
      regional roundup article (discovered 2026-07-04 — §2b says "surface on the
      state hub" but the hub is fully data-driven with no article slot; roundups
      currently ride the guides index + internal links only).
- [ ] Exit-intent signup (desktop only, frequency-capped, 2nd pageview+).
- [ ] "Tidepooling 101 in 5 days" email course content (ships with Resend).
- [ ] Print stylesheet polish for month pages (page-break rules).
- [ ] 2-4 new stations: Crescent City CA (9419750), Westport WA (9441102),
      Woods Hole MA (8447930), Crystal River FL? — verify ids + tidepool
      relevance first; prefer harmonic.

## P2 — infra / reliability (discovered 2026-07-03)

- [ ] `npm run lint` fails with one pre-existing react-hooks/set-state-in-effect
      error (src/components/tools-shared.tsx:25 — setData inside useEffect cache
      hit; discovered 2026-07-05, present on clean main). Build is unaffected;
      fix by moving the cache read into initial state or useSyncExternalStore.
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
