import Link from "next/link";
import type { Metadata } from "next";
import { getAllArticles, getCategories } from "@/lib/content";
import { fmtDate } from "@/lib/windows";

export const metadata: Metadata = {
  title: "Guides",
  description:
    "Field guides to minus tides, tidepooling, beachcombing, and coastal timing — every number computed from NOAA data.",
  alternates: { canonical: "./" },
};

// Curated entry points shown above the category sections. Slugs that stop
// existing are skipped, not fatal.
const START_HERE = [
  "what-is-a-minus-tide",
  "best-tide-pools-washington-2026",
  "best-tide-pools-oregon-2026",
  "best-tide-pools-california-2026",
];

// Section order on this page; categories not listed append alphabetically.
const CATEGORY_ORDER = [
  "tide-basics",
  "regional-calendars",
  "station-guides",
  "beachcombing",
  "photography",
  "families",
  "king-tides",
];

function categoryRank(category: string): number {
  const i = CATEGORY_ORDER.indexOf(category);
  return i === -1 ? CATEGORY_ORDER.length : i;
}

export default function GuidesIndex() {
  const articles = getAllArticles();
  const bySlug = new Map(articles.map((a) => [a.slug, a]));
  const startHere = START_HERE.flatMap((s) => bySlug.get(s) ?? []);
  const sections = [...getCategories()].sort(
    (a, b) => categoryRank(a.category) - categoryRank(b.category) || a.category.localeCompare(b.category),
  );

  return (
    <div>
      <h1 className="text-3xl sm:text-4xl">Guides</h1>
      <p className="mt-3 max-w-2xl text-ink-soft">
        How tides work, when to go, and what you&apos;ll find — written around computed numbers, not vibes.
      </p>
      <p className="mt-4 flex flex-wrap gap-2">
        {sections.map((c) => (
          <Link key={c.category} href={`/guides/category/${c.category}/`} className="btn btn-quiet !px-3 !py-1 text-[0.85rem]">
            {c.category.replace(/-/g, " ")} ({c.count})
          </Link>
        ))}
      </p>

      {startHere.length > 0 && (
        <section className="mt-8">
          <h2 className="text-2xl">Start here</h2>
          <p className="mt-1 text-[0.93rem] text-ink-soft">
            The one explainer worth reading first, then the state-by-state hubs that link out to every beach we cover.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {startHere.map((a) => (
              <Link key={a.slug} href={`/guides/${a.slug}/`} className="rounded-lg border border-ink/15 bg-white/60 p-5 transition hover:border-kelp">
                <h3 className="text-xl">{a.title}</h3>
                <p className="mt-2 text-[0.93rem] text-ink-soft">{a.description}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <aside className="mt-8 rounded-lg border border-kelp/40 bg-white/60 p-5">
        <h2 className="text-xl">After a date, not a guide?</h2>
        <p className="mt-2 text-[0.93rem] text-ink-soft">
          The <Link href="/tools/tide-window-finder/" className="underline hover:text-anemone">Tide Window Finder</Link>{" "}
          ranks your beach&apos;s next 30 days of daylight low-tide windows, and the{" "}
          <Link href="/tools/trip-picker/" className="underline hover:text-anemone">Trip Picker</Link> judges the specific
          dates of a trip — both from the same NOAA-computed dataset these guides cite.
        </p>
      </aside>

      {sections.map((c) => {
        const group = articles.filter((a) => a.category === c.category);
        return (
          <section key={c.category} className="mt-10">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-2xl capitalize">{c.category.replace(/-/g, " ")}</h2>
              <Link href={`/guides/category/${c.category}/`} className="text-[0.85rem] text-ink-soft hover:text-anemone">
                {c.count} {c.count === 1 ? "guide" : "guides"}
              </Link>
            </div>
            <div className="mt-4 grid gap-4">
              {group.map((a) => (
                <Link key={a.slug} href={`/guides/${a.slug}/`} className="rounded-lg border border-ink/15 bg-white/60 p-5 transition hover:border-kelp">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-xl">{a.title}</h3>
                    <span className="mono text-[0.75rem] text-ink-soft">
                      {fmtDate(a.updated ?? a.date)} · {a.readingMinutes} min
                    </span>
                  </div>
                  <p className="mt-2 text-[0.93rem] text-ink-soft">{a.description}</p>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
      {articles.length === 0 && <p className="mt-6 text-ink-soft">First guides land shortly.</p>}
    </div>
  );
}
