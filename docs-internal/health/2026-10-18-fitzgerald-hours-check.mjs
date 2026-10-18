// Dated, read-only correction check; run from the repository root.
// node docs-internal/health/2026-10-18-fitzgerald-hours-check.mjs /path/to/isolated/out
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { parse } from 'yaml';

const file = 'content/articles/fitzgerald-marine-reserve-tide-pooling-2026.md';
const source = fs.readFileSync(file, 'utf8');
const before = execFileSync('git', ['show', `c470667:${file}`], { encoding: 'utf8' });
const meta = parse(source.split(/^---\s*$/m)[1]);
const oldMeta = parse(before.split(/^---\s*$/m)[1]);
const data = JSON.parse(fs.readFileSync('public/data-json/stations/pillar-point-ca.json'));
const facts = JSON.parse(fs.readFileSync('docs-internal/facts/pillar-point-ca.json'));
const out = process.argv[2];
assert.ok(out, 'Pass isolated build output directory');
const html = fs.readFileSync(path.join(out, 'guides/fitzgerald-marine-reserve-tide-pooling-2026/index.html'), 'utf8');
const tables = text => text.match(/(?:^\|.*\|\s*\n)+/gm);
assert.equal(tables(source).length, 4);
assert.deepEqual(tables(source), tables(before), 'All four tide tables must remain byte-identical');
assert.deepEqual(source.match(/^## .+$/gm), before.match(/^## .+$/gm), 'Keep heading fragment targets');
for (const field of ['title', 'description', 'date', 'updated', 'station', 'tags', 'sources']) assert.deepEqual(meta[field], oldMeta[field]);
assert.equal(meta.faq.length, oldMeta.faq.length);
for (const index of [1, 3, 4, 5]) assert.deepEqual(meta.faq[index], oldMeta.faq[index]);
const lead = source.match(/\*\*(.*?)\*\*/s)[1];
const leadWords = lead.split(/\s+/).length;
assert.ok(leadWords >= 40 && leadWords <= 80, `Lead has ${leadWords} words`);
assert.ok(lead.includes('The low is before closing; the full window is not.'));
for (const phrase of ['the whole event inside', 'usable window', "the year's deepest daylight low", 'tide depth and daylight only']) assert.ok(!source.toLowerCase().includes(phrase.toLowerCase()), phrase);
assert.ok(source.includes('not a full-year ranking'));
assert.ok(source.includes('not an access or return-time guarantee'));
assert.deepEqual(facts.range_2026, { start_date: '2026-07-01', end_date: '2026-12-31', date_basis: 'station-local', inclusive: true });
// County schedule checked October 18: 8 AM open; 6 PM close Oct 12-Nov 1,
// 5 PM close Nov 2-Feb 2027. July lows below all occur before the 8 AM open.
const clock = (date, hour) => Date.parse(`${date}T${String(hour).padStart(2, '0')}:00:00${date < '2026-11-01' ? '-07:00' : '-08:00'}`);
const close = date => clock(date, date < '2026-10-12' ? 20 : date < '2026-11-02' ? 18 : 17);
const inHours = w => w.lowTime >= clock(w.date, 8) && w.lowTime < close(w.date);
const overlap = w => Math.max(0, (Math.min(w.windowEnd, close(w.date)) - Math.max(w.windowStart, clock(w.date, 8))) / 60000);
const remaining = data.windows.filter(w => w.date >= '2026-10-18' && w.date <= '2026-12-31');
const selected = remaining.filter(w => w.score >= 60);
assert.equal(selected.length, 20);
const rows = tables(source)[3].trim().split('\n').slice(2).map(r => r.split('|').slice(1, -1).map(s => s.trim()));
for (const [i, w] of selected.entries()) {
  const label = new Date(w.date + 'T12:00:00Z').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' });
  assert.equal(rows[i][0], label);
  assert.equal(rows[i][2], w.lowTimeLocal);
  assert.equal(Number(rows[i][5]), w.score);
  const duration = rows[i][4].match(/^(?:(\d+) h\s*)?(?:(\d+) min)?/);
  assert.equal(Number(duration[1] ?? 0) * 60 + Number(duration[2] ?? 0), overlap(w), w.date);
}
const oct25 = remaining.find(w => w.date === '2026-10-25');
assert.deepEqual([oct25.lowTimeLocal, oct25.windowStartLocal, oct25.windowEndLocal, oct25.lowHeight.toFixed(2)], ['4:59 PM', '2:50 PM', '7:15 PM', '-0.52']);
assert.deepEqual([overlap(oct25), (close(oct25.date) - oct25.lowTime) / 60000, (oct25.windowEnd - close(oct25.date)) / 60000], [190, 61, 75]);
for (const [date, minutes, sunset] of [['2026-11-24', 195, '4:53 PM'], ['2026-12-23', 210, '4:56 PM']]) {
  const w = remaining.find(w => w.date === date);
  assert.equal(overlap(w), minutes);
  assert.equal(w.sunsetLocal, sunset);
  assert.ok(w.sunset < close(date));
}
assert.equal(remaining.filter(inHours).toSorted((a, b) => a.lowHeight - b.lowHeight)[0].date, '2026-12-23');
const deepest = data.windows.filter(w => w.date >= '2026-07-01' && w.date <= '2026-12-31' && w.daylightMin >= 30).toSorted((a, b) => a.lowHeight - b.lowHeight).slice(0, 8);
assert.deepEqual(deepest.map(w => w.date), facts.deepest_2026_daylight_lows_top8.map(w => w.date));
assert.equal(deepest.filter(inHours).length, 2);
assert.equal(deepest.filter(w => w.lowTime > w.sunset).length, 4);
const schema = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].flatMap(m => JSON.parse(m[1]));
assert.equal(schema.find(s => s['@type'] === 'FAQPage').mainEntity[0].acceptedAnswer.text, meta.faq[0].a);
assert.equal(schema.find(s => s['@type'] === 'Article').dateModified.slice(0, 10), '2026-10-18');
assert.ok(html.includes('The low is before closing; the full window is not.'));
assert.ok(!html.includes('noindex'));
const links = [...new Set([...html.matchAll(/href="(\/[^"#?]*)/g)].map(m => m[1]))];
for (const href of links) assert.ok(fs.existsSync(path.join(out, href)) || fs.existsSync(path.join(out, href, 'index.html')), href);
const sources = await Promise.all(['https://www.smcgov.org/parks/fitzgerald-marine-reserve-hours', 'https://www.smcgov.org/parks/fitzgerald-marine-reserve'].map(async url => {
  const r = await fetch(url, { signal: AbortSignal.timeout(30000) });
  assert.equal(r.status, 200, url);
  return { url, status: r.status };
}));
console.log(JSON.stringify({ checkedAt: new Date().toISOString(), passed: true, preservedTables: 4, leadWords, selectedRows: 20, oct25OverlapMinutes: 190, oct25AfterCloseMinutes: 75, deepestInHours: 2, internalLinks: links.length, sources }, null, 2));
