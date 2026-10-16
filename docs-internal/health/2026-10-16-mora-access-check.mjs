// Read-only, dated access-notice release check; not an evergreen road-status test.
// Run from the repo: node docs-internal/health/2026-10-16-mora-access-check.mjs /path/to/clean/out [--live]
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { parse } from 'yaml';

const out = process.argv[2];
assert.ok(out, 'Pass the isolated build output directory');
const live = process.argv.includes('--live');
const base = '505b889';
const slugs = [
  'la-push-second-beach-tide-pools-2026',
  'best-tide-pools-washington-2026',
  'storm-beachcombing-winter-swell',
  'golden-hour-low-tide-photography-calendar-2026',
  'puget-sound-minus-tides-august-8-13-2026',
];
const road = 'https://www.nps.gov/olym/planyourvisit/current-road-conditions.htm';
const conditions = 'https://www.nps.gov/olym/planyourvisit/conditions.htm';
const rialto = 'https://www.nps.gov/olym/planyourvisit/rialto-beach.htm';
const old = file => execFileSync('git', ['show', `${base}:${file}`], { encoding: 'utf8' });
const tables = source => source.match(/(?:^\|.*\|\s*\n)+/gm) ?? [];
const schemas = html => [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].flatMap(m => JSON.parse(m[1]));
const sitemap = fs.readFileSync(path.join(out, 'sitemap.xml'), 'utf8');
const internal = new Set();
let tableCount = 0;
for (const slug of slugs) {
  const file = `content/articles/${slug}.md`;
  const source = fs.readFileSync(file, 'utf8');
  const previous = old(file);
  const [, fm, body] = source.split(/^---\s*$/m);
  const meta = parse(fm), prior = parse(previous.split(/^---\s*$/m)[1]);
  const html = fs.readFileSync(path.join(out, `guides/${slug}/index.html`), 'utf8');
  assert.equal(source, fs.readFileSync(path.join(path.dirname(out), file), 'utf8'), 'Exact candidate built');
  assert.deepEqual(tables(source), tables(previous), `${slug}: all numerical tables preserved`);
  tableCount += tables(source).length;
  for (const field of ['date', 'category', 'station', 'gateStations', 'featuredRoundup', 'tags']) assert.deepEqual(meta[field], prior[field], `${slug}: ${field} preserved`);
  assert.equal(meta.updated, '2026-10-16');
  assert.ok(meta.description.length <= 155, `${slug}: description length`);
  assert.equal(meta.title, slug === slugs[0] ? prior.title.replace(' (Rialto Beach Is Closed)', '') : prior.title);
  assert.equal(meta.faq.length, prior.faq.length);
  assert.ok(meta.faq.length >= 3 && meta.faq.length <= 5);
  for (let i = 0; i < meta.faq.length; i++) {
    assert.equal(meta.faq[i].q, prior.faq[i].q);
    if (!meta.faq[i].q.includes('Rialto')) assert.equal(meta.faq[i].a, prior.faq[i].a);
  }
  assert.ok(meta.sources.includes(road) && meta.sources.includes(conditions));
  assert.ok(body.includes('October 16') && body.includes('October 15') && body.includes('**Open**'));
  assert.ok(body.includes('Hole-in-the-Wall passage conditions'));
  const structured = schemas(html);
  const article = structured.find(s => s['@type'] === 'Article');
  assert.equal(article.headline, meta.title);
  assert.equal(article.dateModified.slice(0, 10), meta.updated);
  assert.equal(article.datePublished.slice(0, 10), meta.date);
  const faq = structured.find(s => s['@type'] === 'FAQPage');
  assert.equal(faq.mainEntity.length, meta.faq.length);
  for (let i = 0; i < meta.faq.length; i++) assert.equal(faq.mainEntity[i].acceptedAnswer.text, meta.faq[i].a);
  assert.equal((html.match(/<h1(?:\s|>)/g) ?? []).length, 1);
  assert.ok(!html.includes('noindex'));
  assert.ok(html.includes(road));
  const url = `https://thetidewindow.com/guides/${slug}/`;
  const sitemapEntry = sitemap.split('<url>').find(s => s.includes(`<loc>${url}</loc>`));
  assert.ok(sitemapEntry?.includes('<lastmod>2026-10-16'), `${slug}: honest sitemap update`);
  for (const match of html.matchAll(/href="(\/[^"#?]*)/g)) internal.add(match[1]);
  if (live) {
    const response = await fetch(url);
    assert.equal(response.status, 200);
    const remote = await response.text();
    assert.deepEqual(schemas(remote), structured, `${slug}: live structured content matches release`);
    assert.deepEqual(remote.match(/<table[\s\S]*?<\/table>/g), html.match(/<table[\s\S]*?<\/table>/g));
    assert.ok(remote.includes(road) && remote.includes('Hole-in-the-Wall passage conditions'));
    assert.ok(!remote.includes('Rialto Beach Is Closed'));
  }
  console.log(JSON.stringify({ slug, tablesPreserved: tables(source).length, faq: meta.faq.length, descriptionCharacters: meta.description.length, liveVerified: live }));
}
for (const href of internal) {
  const target = path.join(out, href);
  assert.ok(fs.existsSync(target) || fs.existsSync(path.join(target, 'index.html')), `Broken internal link: ${href}`);
}
assert.equal(fs.readFileSync('scripts/pipeline/stations.mjs', 'utf8'), old('scripts/pipeline/stations.mjs'), 'Shared destination metadata unchanged');
for (const file of fs.readdirSync('public/data-json/stations')) {
  const relative = `public/data-json/stations/${file}`;
  assert.equal(fs.readFileSync(relative, 'utf8'), old(relative), 'No station-data changes');
}
const data = JSON.parse(fs.readFileSync('public/data-json/stations/la-push-wa.json'));
const remaining = data.windows.filter(w => w.date >= '2026-10-16' && w.date <= '2026-12-31' && w.daylightMin >= 30);
assert.ok(remaining.every(w => w.score < 70), 'Unchanged La Push lead: no remaining Good windows');
const october = remaining.filter(w => w.date.startsWith('2026-10')).toSorted((a, b) => b.score - a.score)[0];
assert.deepEqual([october.date, Math.round(october.lowHeight * 100) / 100, october.lowTimeLocal, october.score, october.daylightMin], ['2026-10-25', -0.71, '6:48 PM', 52, 71]);
assert.ok(october.lowTime > october.sunset, 'Daylight overlap is not daylight at low');
for (const url of [road, conditions, rialto]) {
  const response = await fetch(url);
  assert.equal(response.status, 200, url);
  const text = (await response.text()).replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ');
  if (url === road) assert.match(text, /Mora Road\s+Open\s+10\/15\/26/);
  if (url === conditions) assert.ok(text.includes('October 13, 2026') && text.includes('July 8') && text.includes('Oct. 15, 2026'));
  if (url === rialto) assert.ok(text.includes('July 31, 2026') && text.includes('through October 15, 2026'));
  console.log(JSON.stringify({ officialSource: url, status: response.status }));
}
console.log(JSON.stringify({ checkedAt: new Date().toISOString(), articles: slugs.length, tablesPreserved: tableCount, internalLinks: internal.size, allChecksPassed: true, live }));
