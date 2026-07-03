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

export default function GuidesIndex() {
  const articles = getAllArticles();
  const categories = getCategories();
  return (
    <div>
      <h1 className="text-3xl sm:text-4xl">Guides</h1>
      <p className="mt-3 max-w-2xl text-ink-soft">
        How tides work, when to go, and what you&apos;ll find — written around computed numbers, not vibes.
      </p>
      <p className="mt-4 flex flex-wrap gap-2">
        {categories.map((c) => (
          <Link key={c.category} href={`/guides/category/${c.category}/`} className="btn btn-quiet !px-3 !py-1 text-[0.85rem]">
            {c.category.replace(/-/g, " ")} ({c.count})
          </Link>
        ))}
      </p>
      <div className="mt-6 grid gap-4">
        {articles.map((a) => (
          <Link key={a.slug} href={`/guides/${a.slug}/`} className="rounded-lg border border-ink/15 bg-white/60 p-5 transition hover:border-kelp">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-xl">{a.title}</h2>
              <span className="mono text-[0.75rem] text-ink-soft">
                {fmtDate(a.updated ?? a.date)} · {a.readingMinutes} min
              </span>
            </div>
            <p className="mt-2 text-[0.93rem] text-ink-soft">{a.description}</p>
          </Link>
        ))}
        {articles.length === 0 && <p className="text-ink-soft">First guides land shortly.</p>}
      </div>
    </div>
  );
}
