import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tide tools",
  description:
    "Free tools that turn NOAA tide predictions into answers: the Tide Window Finder, Trip Picker, Year-at-a-Glance heatmap, and Golden Hour × Low Tide for photographers.",
  alternates: { canonical: "./" },
};

const tools = [
  {
    href: "/tools/tide-window-finder/",
    name: "Tide Window Finder",
    desc: "Your beach's next 30 days of walkable low-tide windows, scored and ranked — with arrive-by times.",
  },
  {
    href: "/tools/trip-picker/",
    name: "Trip Picker",
    desc: "Going to the coast on specific dates? Get the single best hour of your trip — or an honest “skip it.”",
  },
  {
    href: "/tools/year-heatmap/",
    name: "Year at a Glance",
    desc: "365 days of window quality as a printable heatmap. See your beach's whole season in one look.",
  },
  {
    href: "/tools/golden-hour/",
    name: "Golden Hour × Low Tide",
    desc: "For photographers: the rare windows when a real low tide overlaps golden light, with sun direction.",
  },
  {
    href: "/embed/",
    name: "Embeddable badge",
    desc: "Put “next great low tide” on your own site — auto-updating, free, one copy-paste.",
  },
];

export default function ToolsIndex() {
  return (
    <div>
      <h1 className="text-3xl sm:text-4xl">Tools</h1>
      <p className="mt-3 max-w-2xl text-ink-soft">
        Everything below reads the same computed dataset: NOAA CO-OPS predictions intersected with the sun, scored
        0–100. Free, no account, results never gated.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {tools.map((t) => (
          <Link key={t.href} href={t.href} className="rounded-lg border border-ink/15 bg-white/60 p-5 transition hover:border-kelp">
            <h2 className="text-xl">{t.name}</h2>
            <p className="mt-2 text-[0.92rem] text-ink-soft">{t.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
