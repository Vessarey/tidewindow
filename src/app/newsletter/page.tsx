import type { Metadata } from "next";
import { getIndex, fmtDate, fmtStamp } from "@/lib/windows";
import EmailSignup from "@/components/email-signup";

export const metadata: Metadata = {
  title: "The Minus Tide Alert — one useful email a week",
  description:
    "Pick your stretch of coast and get one weekly email: this week's ranked tide windows within driving distance, what's in the pools right now, and king-tide heads-ups.",
  alternates: { canonical: "./" },
};

export default function Newsletter() {
  const { generatedAt, stations } = getIndex();
  const west = stations.filter((s) => s.region === "outer-coast-nw").flatMap((s) => s.best30.map((w) => ({ s, w })));
  const sample = west.sort((a, b) => b.w.score - a.w.score).slice(0, 3);

  return (
    <div>
      <h1 className="text-3xl sm:text-4xl">The Minus Tide Alert</h1>
      <p className="mt-3 max-w-2xl text-lg text-ink-soft">
        One email a week: the exact hours your coast is worth the drive — computed from NOAA data, never padded.
        Launching for this season; join now and you&apos;re in the first issue.
      </p>

      <EmailSignup
        source="landing"
        headline="Join the list"
        blurb="Weekly ranked windows for your coast · what's being spotted in the pools · a heads-up before rare daylight king-tide lows. No spam, unsubscribe anytime."
        cta="Subscribe"
      />

      <h2 className="mt-10 text-2xl">What an issue looks like</h2>
      <div className="mt-4 max-w-2xl rounded-lg border border-ink/20 bg-white/70 p-6">
        <p className="mono text-[0.72rem] uppercase tracking-wider text-ink-soft">Sample · Oregon coast edition · computed {fmtStamp(generatedAt)}</p>
        <h3 className="mt-2 text-xl">This week the ocean gives back {sample[0] ? `${Math.floor(sample[0].w.daylightMin / 60)} hours` : "…"}</h3>
        {sample.map(({ s, w }) => (
          <p key={`${s.slug}-${w.lowTime}`} className="mt-3 text-[0.95rem]">
            <strong>{s.name}</strong> — {fmtDate(w.date)} ({w.weekday}): {w.lowHeight.toFixed(1)} ft at{" "}
            <span className="num">{w.lowTimeLocal}</span>, walkable {w.windowStartLocal}–{w.windowEndLocal}. Score{" "}
            {w.score}/100.
          </p>
        ))}
        <p className="mt-4 text-[0.9rem] text-ink-soft">
          …plus what iNaturalist observers logged in the pools this month, and nothing else. Reading time: about two
          minutes.
        </p>
      </div>
    </div>
  );
}
