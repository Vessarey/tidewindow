// Dated, read-only release check. Run from the repository root:
// node docs-internal/health/2026-10-15-pillar-point-check.mjs /path/to/clean/build/out
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { parse } from 'yaml';

const source = fs.readFileSync('content/articles/pillar-point-tide-pools-2026.md', 'utf8');
const [, frontmatter, body] = source.split(/^---\s*$/m);
const meta = parse(frontmatter);
const data = JSON.parse(fs.readFileSync('public/data-json/stations/pillar-point-ca.json'));
const facts = JSON.parse(fs.readFileSync('docs-internal/facts/pillar-point-ca.json'));
const historicFacts = JSON.parse(execFileSync('git', ['show', '0217704:docs-internal/facts/pillar-point-ca.json'], { encoding: 'utf8' }));
const historicData = JSON.parse(execFileSync('git', ['show', '0217704:public/data-json/stations/pillar-point-ca.json'], { encoding: 'utf8' }));
const oldSource = execFileSync('git', ['show', '92ec7fd:content/articles/pillar-point-tide-pools-2026.md'], { encoding: 'utf8' });
const out = process.argv[2];
assert.ok(out, 'Pass the isolated build output directory');
const html = fs.readFileSync(path.join(out, 'guides/pillar-point-tide-pools-2026/index.html'), 'utf8');
const ft = value => `${value < 0 ? '−' : '+'}${(Math.round(Math.abs(value) * 100 + 1e-8) / 100).toFixed(2)}`;
const dayLabel = date => new Date(date + 'T12:00:00Z').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' });
const monthDay = date => new Date(date + 'T12:00:00Z').toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
const counts = windows => [windows.length, windows.filter(w => w.daylightMin >= 30).length, windows.filter(w => w.daylightMin >= 30 && w.lowHeight < 0).length];
const between = (start, end, dataset = data) => dataset.windows.filter(w => w.date >= start && w.date <= end);
const tables = body.match(/(?:^\|.*\|\s*\n)+/gm);
const oldTables = oldSource.match(/(?:^\|.*\|\s*\n)+/gm);
const rows = table => table.trim().split('\n').slice(2).map(line => line.split('|').slice(1, -1).map(x => x.trim()));
assert.equal(tables.length, 4);
const remaining = between('2026-10-15', '2026-12-31');
assert.deepEqual(counts(remaining), [70, 40, 31]);
const qualified = remaining.filter(w => w.daylightMin >= 30);
assert.equal(qualified.filter(w => w.lowTime >= w.sunrise && w.lowTime <= w.sunset).length, 25);
const deepest = qualified.toSorted((a, b) => a.lowHeight - b.lowHeight).slice(0, 8);
assert.deepEqual(deepest.map(w => w.date), facts.deepest_2026_daylight_lows_remaining_top8.map(w => w.date));
assert.deepEqual(rows(tables[0]), deepest.map(w => [dayLabel(w.date), ft(w.lowHeight), w.lowTimeLocal, w.sunsetLocal, w.lowTime > w.sunset ? 'After' : 'Before']));
assert.equal(deepest.filter(w => w.lowTime > w.sunset).length, 5);
const best = remaining.toSorted((a, b) => b.score - a.score)[0];
assert.deepEqual([best.date, best.score], ['2026-12-23', 82]);
assert.deepEqual(rows(tables[1]), rows(oldTables[0]), 'Preserve the historical eight-row numeric table');
for (const [i, w] of historicFacts.next_60d_best_8.toSorted((a, b) => a.date.localeCompare(b.date)).entries()) {
  assert.deepEqual(rows(tables[1])[i], [dayLabel(w.date), ft(w.low_ft), w.low_time_local, w.arrive_by_local, String(w.daylight_min), `${w.score} (${w.band})`]);
  const current = data.windows.find(x => x.date === w.date && x.lowTimeLocal === w.low_time_local);
  assert.deepEqual([ft(current.lowHeight), current.arriveByLocal, current.daylightMin, current.score], [ft(w.low_ft), w.arrive_by_local, w.daylight_min, w.score]);
}
for (const [i, month] of ['08', '09', '10', '11', '12'].entries()) {
  const windows = between(`2026-${month}-${month === '08' ? '10' : '01'}`, `2026-${month}-31`);
  assert.deepEqual(rows(tables[2])[i].slice(1, 4).map(Number), counts(windows));
  const w = windows.toSorted((a, b) => b.score - a.score)[0];
  assert.equal(rows(tables[2])[i][4], `${monthDay(w.date)} · ${ft(w.lowHeight)} ft · ${w.lowTimeLocal} · ${w.score}`);
}
assert.deepEqual(counts(between('2026-08-10', '2026-08-31', historicData)), [18, 10, 4]);
assert.deepEqual(counts(between('2026-08-01', '2026-08-31')), [24, 12, 4]);
assert.deepEqual(counts(between('2026-07-01', '2026-07-31')), [26, 19, 16]);
assert.deepEqual(counts(between('2026-07-03', '2026-07-31')), [24, 17, 14]);
assert.equal(counts(between('2026-08-10', '2026-12-31'))[2], 42);
const morningMinus = between('2026-08-10', '2026-12-31').filter(w => w.lowHeight < 0 && w.daylightMin >= 30 && w.lowTimeLocal.endsWith('AM'));
assert.deepEqual(morningMinus.map(w => w.date), ['2026-08-11', '2026-08-12', '2026-08-13', '2026-08-14']);
assert.deepEqual(morningMinus.map(w => [w.sunriseLocal, w.lowTime >= w.sunrise]), [['6:22 AM', false], ['6:23 AM', false], ['6:24 AM', false], ['6:25 AM', true]]);
for (const [date, expected] of [['2026-08-26', 10], ['2026-08-27', 29]]) assert.equal(data.windows.find(w => w.date === date && w.lowHeight < 0).daylightMin, expected);
for (const [date, height, low, sunrise, after] of [['2026-07-14', '−1.79', '5:33 AM', '6:00 AM', false], ['2026-07-15', '−1.63', '6:19 AM', '6:00 AM', true]]) {
  const w = data.windows.find(w => w.date === date && w.lowTimeLocal === low);
  assert.deepEqual([ft(w.lowHeight), w.sunriseLocal, w.lowTime > w.sunrise, w.score], [height, sunrise, after, 82]);
}
assert.equal(data.windows.find(w => w.date === '2026-12-24').daylightMin, 157);
assert.equal(`${best.windowStartLocal}–${best.windowEndLocal}`, '1:30 PM–7:35 PM');
const christmas = data.windows.find(w => w.date === '2026-12-25');
assert.deepEqual([christmas.arriveByLocal, christmas.sunsetLocal, christmas.arriveBy > christmas.sunset], ['4:58 PM', '4:57 PM', true]);
assert.deepEqual(rows(tables[3]), rows(oldTables[2]), 'Preserve the historical species table');
assert.deepEqual(rows(tables[3]), historicFacts.species_last60d_5km.map(s => [s.commonName, `*${s.scientificName}*`, String(s.count)]));
assert.equal(historicFacts.species_last60d_5km.reduce((sum, s) => sum + s.count, 0), 451);
assert.equal(historicFacts.species_last60d_5km.filter(s => s.commonName !== 'Gumboot Chiton').reduce((sum, s) => sum + s.count, 0), 416);
assert.equal(Math.round(416 / 451 * 100), 92);
assert.deepEqual(facts.species_last60d_5km.slice(0, 3).map(s => s.count), [27, 16, 13]);
assert.equal(meta.title, parse(oldSource.split(/^---\s*$/m)[1]).title);
assert.equal(meta.date, '2026-07-03');
assert.equal(meta.updated, '2026-10-15');
assert.equal(meta.station, 'pillar-point-ca');
assert.ok(meta.description.length <= 155);
assert.equal(meta.faq.length, 5);
const leadWords = body.match(/\*\*(.*?)\*\*/s)[1].split(/\s+/).length;
assert.ok(leadWords >= 40 && leadWords <= 80, `Lead has ${leadWords} words`);
const schemas = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].flatMap(m => JSON.parse(m[1]));
assert.equal(schemas.find(s => s['@type'] === 'FAQPage').mainEntity.length, 5);
assert.equal(schemas.find(s => s['@type'] === 'Article').dateModified.slice(0, 10), meta.updated);
assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1);
assert.ok(html.includes('https://thetidewindow.com/guides/pillar-point-tide-pools-2026/'));
assert.ok(!html.includes('noindex'));
const links = [...new Set([...html.matchAll(/href="(\/[^"#?]*)/g)].map(m => m[1]))];
for (const href of links) {
  const target = path.join(out, href);
  assert.ok(fs.existsSync(target) || fs.existsSync(path.join(target, 'index.html')), href);
}
const sources = await Promise.all(meta.sources.map(async url => {
  const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
  assert.equal(response.status, 200, url);
  return { url, status: response.status };
}));
console.log(JSON.stringify({ checkedAt: new Date().toISOString(), dataGeneratedAt: new Date(data.generatedAt).toISOString(), factsGeneratedOn: facts.generated_on, numericTables: 4, remainingCounts: counts(remaining), selectedLowCount: deepest.length, selectedAfterSunset: 5, historicalAugustCountCorrected: 18, historicalObservations: 451, descriptionLength: meta.description.length, leadWords, faqCount: meta.faq.length, internalLinks: links.length, sources, passed: true }, null, 2));
