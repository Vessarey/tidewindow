import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllArticles, getCategories } from "@/lib/content";
import { fmtDate } from "@/lib/windows";
import { BreadcrumbJsonLd } from "@/components/json-ld";

export function generateStaticParams() {
  return getCategories().map((c) => ({ category: c.category }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const nice = category.replace(/-/g, " ");
  return {
    title: `${nice.charAt(0).toUpperCase() + nice.slice(1)} guides`,
    description: `All Tidewindow guides about ${nice}.`,
    alternates: { canonical: "./" },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const articles = getAllArticles().filter((a) => a.category === category);
  if (!articles.length) notFound();
  const nice = category.replace(/-/g, " ");

  return (
    <div>
      <BreadcrumbJsonLd
        items={[
          { name: "Guides", path: "/guides/" },
          { name: nice, path: `/guides/category/${category}/` },
        ]}
      />
      <nav className="text-[0.85rem] text-ink-soft">
        <Link href="/guides/" className="hover:text-anemone">Guides</Link> / {nice}
      </nav>
      <h1 className="mt-2 text-3xl capitalize sm:text-4xl">{nice}</h1>
      <div className="mt-6 grid gap-4">
        {articles.map((a) => (
          <Link key={a.slug} href={`/guides/${a.slug}/`} className="rounded-lg border border-ink/15 bg-white/60 p-5 transition hover:border-kelp">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-xl">{a.title}</h2>
              <span className="mono text-[0.75rem] text-ink-soft">{fmtDate(a.updated ?? a.date)}</span>
            </div>
            <p className="mt-2 text-[0.93rem] text-ink-soft">{a.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
