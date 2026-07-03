import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content");

export interface ArticleFrontmatter {
  title: string;
  description: string;
  date: string; // ISO yyyy-mm-dd, publish date
  updated?: string; // ISO yyyy-mm-dd, last substantive update
  category: string;
  tags?: string[];
  faq?: { q: string; a: string }[]; // rendered + emitted as FAQPage JSON-LD
  sources?: string[]; // URLs backing factual claims
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

export function getCategories(): { category: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const a of getAllArticles()) {
    counts.set(a.category, (counts.get(a.category) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
}
