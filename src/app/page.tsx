import Link from "next/link";
import type { Metadata } from "next";
import { getIndex, getStationData, fmtDate, fmtStamp } from "@/lib/windows";
import { PUBLISHED_MONTHS } from "@/lib/rollout";
import { WindowCard, ScoreBadge, StationChip } from "@/components/window-bits";
import TideCurve from "@/components/tide-curve";
import EmailSignup from "@/components/email-signup";
import { siteConfig } from "@/lib/site-config";

const seasonYear = PUBLISHED_MONTHS[PUBLISHED_MONTHS.length - 1].slice(0, 4);

export const metadata: Metadata = {
  title: `${siteConfig.name} — ${seasonYear} low tide calendar & minus tide finder for US beaches`,
  description: `When are the lowest tides of ${seasonYear}? The exact daylight hours the tide pulls back far enough for tidepooling, beachcombing, and sea-glass hunting — scored and ranked per beach, updated daily from NOAA predictions.`,
  alternates: { canonical: "./" },
};

export default function Home() {
  const { generatedAt, stations } = getIndex();
  const best = stations
    .flatMap((s) => s.best30.map((w) => ({ s, w })))
    .sort((a, b) => b.w.score - a.w.score)
    .slice(0, 8);
  const featured = best[0];
  const featuredData = getStationData(featured.s.slug);
  const featuredWindow = featuredData.windows.find((w) => w.lowTime === featured.w.lowTime) ?? featured.w;

  return (
    <div>
      <section className="pt-6">
        <h1 className="max-w-3xl text-4xl sm:text-5xl">Know the hours the ocean gives back.</h1>
        <p className="mt-4 max-w-2xl text-lg text-ink-soft">
          A few times a month, a very low tide lines up with daylight — and the coast opens up: tidepools, sandbars,
          sea caves, glass beaches. Tidewindow computes those exact hours for US beaches from NOAA predictions, scores
          them, and ranks them. No tide-table squinting.
        </p>
        <p className="mt-5 flex flex-wrap gap-3">
          <Link href="/tools/tide-window-finder/" className="btn">
            Find your beach&apos;s next window
          </Link>
          <Link href="/methodology/" className="btn btn-quiet">
            How the math works
          </Link>
        </p>
      </section>

      <hr className="waterline" />

      <section>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-2xl">The best window in America right now</h2>
          <span className="mono text-[0.78rem] text-ink-soft">computed {fmtStamp(generatedAt)} · NOAA CO-OPS</span>
        </div>
        <div className="answer-box">
          <span className="stamp">
            #1 of the next 30 days · <StationChip noaaId={featured.s.noaaId} />
          </span>
          <p className="text-lg">
            <strong>{featured.s.name}</strong> — {fmtDate(featuredWindow.date)} ({featuredWindow.weekday}): the tide
            drops to <strong className="num">{featuredWindow.lowHeight.toFixed(1)} ft</strong> at{" "}
            <strong className="num">{featuredWindow.lowTimeLocal}</strong>, giving{" "}
            {Math.floor(featuredWindow.daylightMin / 60)}h {featuredWindow.daylightMin % 60}m of walkable daylight
            ({featuredWindow.windowStartLocal}–{featuredWindow.windowEndLocal}).{" "}
            <ScoreBadge w={featuredWindow} />
          </p>
        </div>
        <TideCurve window={featuredWindow} />
        <p className="mt-1 text-[0.8rem] text-ink-soft">
          Computed tide curve · shaded band = below +1.0 ft · gold lines = sunrise/sunset ·{" "}
          <Link className="underline" href={`/beaches/${featured.s.stateSlug}/${featured.s.slug}/`}>
            full {featured.s.name} guide →
          </Link>
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl">Top windows, next 30 days</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {best.map(({ s, w }) => (
            <WindowCard key={`${s.slug}-${w.lowTime}`} w={w} station={s} href={`/beaches/${s.stateSlug}/${s.slug}/`} />
          ))}
        </div>
      </section>

      <hr className="waterline" />

      <section className="grid gap-8 sm:grid-cols-3">
        <div>
          <h3 className="text-xl">Computed, not written</h3>
          <p className="mt-2 text-[0.95rem] text-ink-soft">
            Every window on this site is arithmetic over NOAA harmonic tide predictions intersected with the sun&apos;s
            actual position. The methodology is public, and the numbers regenerate every day.
          </p>
        </div>
        <div>
          <h3 className="text-xl">Scored honestly</h3>
          <p className="mt-2 text-[0.95rem] text-ink-soft">
            Depth, daylight, weekends, season — one 0–100 score. When a week is a washout, we say “skip it” and show
            you the next date that isn&apos;t.
          </p>
        </div>
        <div>
          <h3 className="text-xl">Yours to keep</h3>
          <p className="mt-2 text-[0.95rem] text-ink-soft">
            Any beach&apos;s next 12 months of good windows as a calendar feed or a printable year view — plus a weekly
            alert for your stretch of coast.
          </p>
        </div>
      </section>

      <EmailSignup
        source="home"
        headline="The Minus Tide Alert"
        blurb="One email a week: the exact hours your coast is worth the drive — computed from NOAA data, never padded. Sent every Thursday."
        cta="Join the list"
      />
    </div>
  );
}
