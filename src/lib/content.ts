import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content");

/**
 * Marks an article as a time-sensitive regional roundup that should surface in
 * the featured slot on matching /beaches/[state] hubs. Set in article
 * frontmatter; the slot renders only while `until` is on or after the build date,
 * so it disappears on its own once the event has passed (the site rebuilds daily).
 */
export interface FeaturedRoundup {
  states: string[]; // state slugs the roundup surfaces on, e.g. ["wa", "or", "ca"]
  event: string; // human date label for the run, e.g. "July 11-14, 2026"
  until: string; // ISO yyyy-mm-dd; last build date the slot shows (inclusive)
  teaser: string; // one self-contained sentence, no numbers we can't stand behind
}

export interface ArticleFrontmatter {
  title: string;
  description: string;
  date: string; // ISO yyyy-mm-dd, publish date
  updated?: string; // ISO yyyy-mm-dd, last substantive update
  category: string;
  tags?: string[];
  faq?: { q: string; a: string }[]; // rendered + emitted as FAQPage JSON-LD
  sources?: string[]; // URLs backing factual claims
  featuredRoundup?: FeaturedRoundup; // opt-in state-hub featured slot
  draft?: boolean;
}

export interface Article extends ArticleFrontmatter {
  slug: string;
  body: string; // raw markdown
  readingMinutes: number;
}

function articlesDir(): string {
  return path.join(CONTENT_DIR, "articles");
}

export function getAllArticles(): Article[] {
  const dir = articlesDir();
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
  const articles = files.map((file) => {
    const raw = fs.readFileSync(path.join(dir, file), "utf8");
    const { data, content } = matter(raw);
    const fm = data as ArticleFrontmatter;
    const words = content.split(/\s+/).length;
    return {
      ...fm,
      slug: file.replace(/\.md$/, ""),
      body: content,
      readingMinutes: Math.max(1, Math.round(words / 220)),
    };
  });
  return articles
    .filter((a) => !a.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getArticle(slug: string): Article | undefined {
  return getAllArticles().find((a) => a.slug === slug);
}

export type RoundupArticle = Article & { featuredRoundup: FeaturedRoundup };

/**
 * The active featured roundup for a state hub, or undefined if none applies.
 * `today` is the build date (yyyy-mm-dd); a roundup shows only while it targets
 * this state and its `until` date has not passed. Articles are date-sorted
 * newest-first, so the most recent qualifying roundup wins.
 */
export function getActiveRoundup(stateSlug: string, today: string): RoundupArticle | undefined {
  return getAllArticles().find(
    (a): a is RoundupArticle =>
      !!a.featuredRoundup &&
      a.featuredRoundup.states.includes(stateSlug) &&
      a.featuredRoundup.until >= today
  );
}

export function getCategories(): { category: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const a of getAllArticles()) {
    counts.set(a.category, (counts.get(a.category) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
}
