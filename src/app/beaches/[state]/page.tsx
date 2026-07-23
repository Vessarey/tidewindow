import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getIndex, fmtDate, fmtStamp } from "@/lib/windows";
import { getActiveRoundup } from "@/lib/content";
import { WindowCard } from "@/components/window-bits";
import { BreadcrumbJsonLd } from "@/components/json-ld";
import EmailSignup from "@/components/email-signup";

export function generateStaticParams() {
  const { stations } = getIndex();
  return [...new Set(stations.map((s) => s.stateSlug))].map((state) => ({ state }));
}

export async function generateMetadata({ params }: { params: Promise<{ state: string }> }): Promise<Metadata> {
  const { state } = await params;
  const { stations } = getIndex();
  const group = stations.filter((s) => s.stateSlug === state);
  if (!group.length) return {};
  return {
    title: `${group[0].stateName} minus tide windows`,
    description: `The best upcoming daylight low-tide windows across ${group[0].stateName} — tidepooling and beachcombing hours computed from NOAA predictions, updated daily.`,
    alternates: { canonical: "./" },
  };
}

export default async function StatePage({ params }: { params: Promise<{ state: string }> }) {
  const { state } = await params;
  const { generatedAt, stations } = getIndex();
  const group = stations.filter((s) => s.stateSlug === state);
  if (!group.length) notFound();
  const stateName = group[0].stateName;

  const upcoming = group
    .flatMap((s) => s.best30.map((w) => ({ s, w })))
    .sort((a, b) => b.w.score - a.w.score)
    .slice(0, 9);

  // Time-sensitive featured roundup, if one is active for this state today.
  // Data-driven: renders only while the roundup's `until` date hasn't passed,
  // so it clears itself on the next daily rebuild after the event.
  const roundup = getActiveRoundup(state, fmtStamp(generatedAt));

  return (
    <div>
      <BreadcrumbJsonLd
        items={[
          { name: "Beaches", path: "/beaches/" },
          { name: stateName, path: `/beaches/${state}/` },
        ]}
      />
      <nav className="text-[0.85rem] text-ink-soft">
        <Link href="/beaches/" className="hover:text-anemone">Beaches</Link> / {stateName}
      </nav>
      <h1 className="mt-2 text-3xl sm:text-4xl">{stateName}: the hours worth driving for</h1>

      <div className="answer-box">
        <span className="stamp">Computed {fmtStamp(generatedAt)} · next 30 days · NOAA CO-OPS predictions</span>
        <p>
          {upcoming[0] ? (
            <>
              The best daylight window in {stateName} in the next 30 days is{" "}
              <strong>
                {fmtDate(upcoming[0].w.date)} ({upcoming[0].w.weekday})
              </strong>{" "}
              at <strong>{upcoming[0].s.name}</strong>: a{" "}
              <strong className="num">{upcoming[0].w.lowHeight.toFixed(1)} ft</strong> low at{" "}
              <strong className="num">{upcoming[0].w.lowTimeLocal}</strong>, walkable{" "}
              {upcoming[0].w.windowStartLocal}–{upcoming[0].w.windowEndLocal}, scoring {upcoming[0].w.score}/100.
            </>
          ) : (
            <>No standout daylight windows in the next 30 days — the ranked list below shows the next dates that qualify.</>
          )}
        </p>
      </div>

      {roundup && (
        <aside className="roundup-card">
          <span className="eyebrow">Featured roundup · time-sensitive</span>
          <h2 className="roundup-title">
            <Link href={`/guides/${roundup.slug}/`}>{roundup.title}</Link>
          </h2>
          <p className="roundup-teaser">
            {roundup.featuredRoundup.event} — {roundup.featuredRoundup.teaser}
          </p>
          <Link href={`/guides/${roundup.slug}/`} className="roundup-more">
            Read the full roundup →
          </Link>
        </aside>
      )}

      <h2 className="mt-8 text-2xl">Best {stateName} windows, next 30 days</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {upcoming.map(({ s, w }) => (
          <WindowCard key={`${s.slug}-${w.lowTime}`} w={w} station={s} href={`/beaches/${s.stateSlug}/${s.slug}/`} />
        ))}
      </div>

      <h2 className="mt-10 text-2xl">All {stateName} stations</h2>
      <ul className="mt-3 list-disc pl-6">
        {group.map((s) => (
          <li key={s.slug}>
            <Link href={`/beaches/${s.stateSlug}/${s.slug}/`} className="text-kelp-deep underline hover:text-anemone">
              {s.name}
            </Link>{" "}
            <span className="text-[0.9rem] text-ink-soft">— {s.spots.join(", ")}</span>
          </li>
        ))}
      </ul>

      <EmailSignup
        source="state_hub"
        headline={`${stateName}'s Minus Tide Alert`}
        blurb="One email a week with the ranked windows for your coast — computed from NOAA data, never padded. Sent every Thursday."
        cta="Join the list"
      />
    </div>
  );
}
