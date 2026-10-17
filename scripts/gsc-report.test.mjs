import test from 'node:test';
import assert from 'node:assert/strict';
import { reportWindow, readReportRows, selectReportRows } from './gsc-report.mjs';

test('28 days means exactly 28 inclusive Pacific dates', () => {
  assert.deepEqual(reportWindow(28, new Date('2026-10-17T17:19:33Z')), {
    startDate: '2026-09-18', endDate: '2026-10-15', days: 28,
  });
});
test('one-day reports have identical start and end dates', () => {
  const r = reportWindow(1, new Date('2026-10-17T17:19:33Z'));
  assert.equal(r.startDate, r.endDate);
});
test('UTC midnight does not advance the Pacific reporting date', () => {
  assert.equal(reportWindow(28, new Date('2026-10-17T01:00:00Z')).endDate, '2026-10-14');
});
test('date arithmetic crosses leap day and year boundaries', () => {
  assert.equal(reportWindow(2, new Date('2024-03-03T20:00:00Z')).startDate, '2024-02-29');
  assert.equal(reportWindow(2, new Date('2027-01-03T20:00:00Z')).startDate, '2026-12-31');
});
test('DST does not shorten or lengthen calendar-day ranges', () => {
  for (const now of ['2026-03-10T20:00:00Z', '2026-11-03T20:00:00Z']) {
    const r = reportWindow(7, new Date(now));
    assert.equal((Date.parse(r.endDate) - Date.parse(r.startDate)) / 86400000 + 1, 7);
  }
});
test('default/string days work and malformed periods fail', () => {
  assert.equal(reportWindow(undefined).days, 28);
  assert.equal(reportWindow('7').days, 7);
  for (const v of [0, -1, 1.5, '', 'nope', Infinity]) assert.throws(() => reportWindow(v));
});
test('all API pages are fetched before selecting opportunities', async () => {
  const calls = [];
  const rows = await readReportRows(async body => {
    calls.push(body);
    return { rows: [{ keys: ['a'] }, { keys: ['b'] }, { keys: ['c'] }].slice(body.startRow, body.startRow + body.rowLimit) };
  }, { startDate: '2026-09-18', endDate: '2026-10-15', dimensions: ['query'] }, { pageSize: 2 });
  assert.equal(rows.length, 3);
  assert.deepEqual(calls.map(c => c.startRow), [0, 2]);
  assert.ok(calls.every(c => c.type === 'web' && c.dataState === 'final' && c.dimensions[0] === 'query'));
});
test('exactly full pages require a final empty page', async () => {
  const offsets = [];
  const rows = await readReportRows(async b => {
    offsets.push(b.startRow);
    return b.startRow === 0 ? { rows: [{}, {}] } : {};
  }, {}, { pageSize: 2 });
  assert.deepEqual(offsets, [0, 2]);
  assert.equal(rows.length, 2);
});
test('missing rows are empty, not an invented zero-valued record', async () => {
  assert.deepEqual(await readReportRows(async () => ({}), {}), []);
});
test('pagination ceiling and request errors never emit a partial report', async () => {
  await assert.rejects(readReportRows(async () => ({ rows: [{}] }), {}, { pageSize: 1, maxPages: 2 }), /report not emitted/);
  await assert.rejects(readReportRows(async () => { throw new Error('API unavailable'); }, {}), /API unavailable/);
});
test('invalid pagination settings or responses fail', async () => {
  await assert.rejects(readReportRows(async () => ({}), {}, { pageSize: 25001 }), /page size/);
  await assert.rejects(readReportRows(async () => ({}), {}, { maxPages: 0 }), /page limit/);
  await assert.rejects(readReportRows(async () => ({ rows: {} }), {}), /Invalid Search Analytics/);
});
test('flywheel includes zero-click opportunities beyond the old 100-row cap', () => {
  const rows = Array.from({ length: 100 }, (_, i) => ({ keys: [String(i)], clicks: 1, impressions: 1, position: 7 }));
  rows.push({ keys: ['missed opportunity'], clicks: 0, impressions: 69, position: 9 });
  assert.deepEqual(selectReportRows(rows, 'flywheel').map(r => r.keys[0]), ['missed opportunity']);
});
test('flywheel uses inclusive rank boundaries and sorts before its display cap', () => {
  const rows = Array.from({ length: 45 }, (_, i) => ({ impressions: i, position: i % 2 ? 8 : 20 }));
  rows.push({ impressions: 1000, position: 7.9 }, { impressions: 1000, position: 20.1 });
  const selected = selectReportRows(rows, 'flywheel');
  assert.equal(selected.length, 40);
  assert.deepEqual([selected[0].impressions, selected.at(-1).impressions], [44, 5]);
});
test('date reports retain all rows; other reports keep the explicit display cap', () => {
  const rows = Array.from({ length: 60 }, (_, i) => ({ keys: [String(i)] }));
  assert.equal(selectReportRows(rows, 'dates').length, 60);
  assert.equal(selectReportRows(rows, 'pages').length, 40);
  assert.equal(rows.length, 60);
});
