// Dated, read-only release check. Run from the repository root:
// node docs-internal/health/2026-10-14-cabrillo-check.mjs /path/to/clean/build/out
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';

const source = fs.readFileSync('content/articles/cabrillo-tide-pools-2026.md', 'utf8');
const [, frontmatter, body] = source.split(/^---\s*$/m);
const meta = parse(frontmatter);
const data = JSON.parse(fs.readFileSync('public/data-json/stations/san-diego-ca.json'));
const facts = JSON.parse(fs.readFileSync('docs-internal/facts/san-diego-ca.json'));
const out = process.argv[2];
assert.ok(out, 'Pass the isolated build output directory');
const html = fs.readFileSync(path.join(out, 'guides/cabrillo-tide-pools-2026/index.html'), 'utf8');
const minute = value => {
  const [, h, m, a] = value.match(/^(\d+):(\d+) (AM|PM)$/);
  return (+h % 12) * 60 + +m + (a === 'PM' ? 720 : 0);
};
const ft = value => `${value < 0 ? '−' : '+'}${(Math.round(Math.abs(value) * 100 + 1e-8) / 100).toFixed(2)}`;
const holidays = new Set(['2026-11-26', '2026-12-25']);
const inRange = x => x.date >= '2026-10-14' && x.date <= '2026-12-31';
const raw = data.tides.filter(t => inRange(t) && t.type === 'L' && t.height < 0 && minute(t.timeLocal) >= 540 && minute(t.timeLocal) < 990 && !holidays.has(t.date));
const modeled = data.windows.filter(w => inRange(w) && w.lowHeight < 0 && minute(w.lowTimeLocal) >= 540 && minute(w.lowTimeLocal) < 990 && !holidays.has(w.date));
assert.equal(raw.length, 21);
assert.deepEqual(raw.map(x => x.date), modeled.map(x => x.date));
const tables = body.match(/(?:^\|.*\|\s*\n)+/gm);
assert.equal(tables.length, 3);
const rows = table => table.trim().split('\n').slice(2).map(line => line.split('|').slice(1, -1).map(x => x.trim()));
const selection = rows(tables[0]);
assert.equal(selection.length, 21);
for (const [i, t] of raw.entries()) {
  const date = new Date(t.date + 'T12:00:00Z');
  const label = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' });
  assert.deepEqual(selection[i], [label, ft(t.height), t.timeLocal, String(990 - minute(t.timeLocal))]);
}
const remaining = data.windows.filter(inRange);
assert.deepEqual([remaining.length, remaining.filter(w => w.daylightMin >= 30).length, remaining.filter(w => w.daylightMin >= 30 && w.lowHeight < 0).length], [67, 41, 32]);
const months = rows(tables[1]);
for (const [i, month] of ['09', '10', '11', '12'].entries()) {
  const windows = data.windows.filter(w => w.date.startsWith(`2026-${month}`));
  assert.deepEqual(months[i].slice(1, 4).map(Number), [windows.length, windows.filter(w => w.daylightMin >= 30).length, windows.filter(w => w.daylightMin >= 30 && w.lowHeight < 0).length]);
  const best = windows.toSorted((a, b) => b.score - a.score)[0];
  assert.ok(months[i][4].includes(ft(best.lowHeight)) && months[i][4].includes(best.lowTimeLocal));
}
const clips = rows(tables[2]);
for (const [i, date] of ['2026-12-22', '2026-12-23', '2026-12-24'].entries()) {
  const w = data.windows.find(w => w.date === date);
  assert.equal(clips[i][1], `${w.windowStartLocal}–${w.windowEndLocal}`);
  assert.equal(clips[i][2], `${w.windowStartLocal}–4:30 PM`);
  assert.equal(+clips[i][3], Math.min(990, minute(w.windowEndLocal)) - Math.max(540, minute(w.windowStartLocal)));
}
const summer = data.tides.filter(t => t.type === 'L' && t.height < 0 && t.date >= '2026-07-01' && t.date <= '2026-08-31');
assert.deepEqual([summer.length, Math.min(...summer.map(t => minute(t.timeLocal))), Math.max(...summer.map(t => minute(t.timeLocal)))], [29, 112, 415]);
for (const [start, expected] of [['2026-07-01', [24, 16, 12]], ['2026-07-03', [22, 14, 10]]]) {
  const windows = data.windows.filter(w => w.date >= start && w.date <= '2026-07-31');
  assert.deepEqual([windows.length, windows.filter(w => w.daylightMin >= 30).length, windows.filter(w => w.daylightMin >= 30 && w.lowHeight < 0).length], expected);
}
for (const [date, height, time] of [['2026-07-14', '−1.69', '4:17 AM'], ['2026-08-13', '−1.03', '4:30 AM'], ['2026-11-26', '−1.31', '4:49 PM'], ['2026-12-25', '−1.71', '4:36 PM'], ['2026-12-26', '−1.33', '5:22 PM'], ['2027-01-20', '−1.72', '2:11 PM'], ['2027-01-21', '−1.97', '2:51 PM'], ['2027-01-22', '−1.96', '3:30 PM']]) {
  const w = data.windows.find(w => w.date === date && w.lowTimeLocal === time);
  assert.ok(w, date);
  assert.equal(ft(w.lowHeight), height, date);
  if (date < '2026-09') assert.ok(w.lowTime < w.sunrise, date);
  if (date.startsWith('2027')) assert.ok(w.lowTime < w.sunset && minute(time) >= 540 && minute(time) < 990, date);
}
const winter = data.windows.filter(w => w.date >= '2026-10-01' && w.date <= '2027-03-31' && w.daylightMin >= 30);
assert.equal(winter.toSorted((a, b) => a.lowHeight - b.lowHeight)[0].date, '2027-01-21');
assert.equal(winter.find(w => w.date === '2027-01-22').score, 90);
assert.equal(meta.date, '2026-07-03');
assert.equal(meta.updated, '2026-10-14');
assert.equal(meta.station, 'san-diego-ca');
assert.ok(meta.description.length <= 155);
assert.equal(meta.faq.length, 5);
const leadWords = body.match(/\*\*(.*?)\*\*/s)[1].split(/\s+/).length;
assert.ok(leadWords >= 40 && leadWords <= 80);
const schemas = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].flatMap(m => JSON.parse(m[1]));
assert.equal(schemas.find(s => s['@type'] === 'FAQPage').mainEntity.length, 5);
assert.equal(schemas.find(s => s['@type'] === 'Article').dateModified.slice(0, 10), meta.updated);
assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1);
assert.ok(html.includes('https://thetidewindow.com/guides/cabrillo-tide-pools-2026/'));
assert.ok(!html.includes('noindex'));
const links = [...new Set([...html.matchAll(/href="(\/[^"#?]*)/g)].map(m => m[1]))];
for (const href of links) {
  const target = path.join(out, href);
  assert.ok(fs.existsSync(target) || fs.existsSync(path.join(target, 'index.html')), href);
}
const sources = await Promise.all(meta.sources.map(async url => {
  const response = await fetch(url);
  assert.equal(response.status, 200, url);
  return { url, status: response.status };
}));
console.log(JSON.stringify({ checkedAt: new Date().toISOString(), dataGeneratedAt: new Date(data.generatedAt).toISOString(), factsGeneratedOn: facts.generated_on, selectedLowCount: raw.length, numericTables: 3, remainingCounts: [67, 41, 32], julyWholeMonth: [24, 16, 12], july3Snapshot: [22, 14, 10], julyAugustMinusLows: summer.length, decemberOverlapMinutes: clips.map(r => +r[3]), descriptionLength: meta.description.length, leadWords, faqCount: meta.faq.length, internalLinks: links.length, sources, passed: true }, null, 2));
