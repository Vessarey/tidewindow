import Link from "next/link";
import type { Metadata } from "next";
import { getIndex, fmtDate, fmtStamp } from "@/lib/windows";
import { ScoreBadge } from "@/components/window-bits";

export const metadata: Metadata = {
  title: "Beaches & tide stations",
  description:
    "Every beach Tidewindow covers, by state — with each station's next good daylight low-tide window, computed from NOAA predictions.",
  alternates: { canonical: "./" },
};

export default function BeachesIndex() {
  const { generatedAt, stations } = getIndex();
  const states = [...new Set(stations.map((s) => s.stateSlug))];

  return (
    <div>
      <h1 className="text-3xl sm:text-4xl">Beaches we compute</h1>
      <p className="mt-3 max-w-2xl text-ink-soft">
        Each station below is a NOAA tide-prediction point covering nearby tidepool and beachcombing spots. Coverage
        grows continuously — <span className="mono text-[0.85rem]">last computed {fmtStamp(generatedAt)}</span>.
      </p>
      {states.map((stateSlug) => {
        const group = stations.filter((s) => s.stateSlug === stateSlug);
        return (
          <section key={stateSlug} className="mt-8">
            <h2 className="text-2xl">
              <Link href={`/beaches/${stateSlug}/`} className="hover:text-anemone">
                {group[0].stateName} →
              </Link>
            </h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {group.map((s) => (
                <Link
                  key={s.slug}
                  href={`/beaches/${s.stateSlug}/${s.slug}/`}
                  className="rounded-lg border border-ink/15 bg-white/60 p-4 transition hover:border-kelp"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="font-semibold">{s.name}</p>
                    {s.best30[0] && <ScoreBadge w={s.best30[0]} />}
                  </div>
                  <p className="mt-1 text-[0.85rem] text-ink-soft">{s.spots.join(" · ")}</p>
                  {s.best30[0] && (
                    <p className="num mt-2 text-[0.9rem]">
                      Best soon: {fmtDate(s.best30[0].date)} · {s.best30[0].lowHeight.toFixed(1)} ft at{" "}
                      {s.best30[0].lowTimeLocal}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
