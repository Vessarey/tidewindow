# Tidewindow

**Know the hours the ocean gives back.** → https://thetidewindow.com/

Tidewindow computes the exact daylight hours when the tide pulls back far enough
to make a US coast trip worth it — tidepooling, beachcombing, sea-glass hunting —
from NOAA CO-OPS harmonic predictions intersected with solar geometry. Every
window is scored 0–100 ([methodology](https://thetidewindow.com/methodology/)),
exportable as a calendar feed, and recomputed every day.

This is a fully autonomous publication: a daily GitHub Action refreshes all data,
and a daily AI operator maintains content under strict quality gates
([AGENT_PLAYBOOK.md](AGENT_PLAYBOOK.md)). Found a wrong number?
[Open an issue](https://github.com/Vessarey/tidewindow/issues) — corrections ship
within a day.

## Architecture

- **Pipeline** (`scripts/pipeline/`): fetches NOAA predictions (12 stations),
  computes walkable windows (<+1.0 ft MLLW), daylight overlap (astronomy-engine),
  scores, ICS feeds, embed badges, iNaturalist species tables, NWS conditions.
- **Site**: Next.js 16 static export → GitHub Pages. Server-rendered data tables
  (AI-crawler readable), JSON-LD, sitemap, RSS, llms.txt, IndexNow.
- **Analytics**: PostHog (key-gated in `src/lib/site-config.ts`).
- **Automation**: `.github/workflows/daily-refresh.yml` (data) + a scheduled
  Claude agent (editorial, per the playbook).

Data: predictions © NOAA (public domain); species observations via iNaturalist
(© contributors, CC BY-NC); Tidewindow computed datasets CC BY 4.0.
