// Render the actual server templates without the app layout's external Google-font fetch.
// This is a focused template regression, not a replacement for next build.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { createRequire } from "node:module";
import ts from "typescript";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import * as access from "../src/lib/access.mjs";
const require = createRequire(import.meta.url);
const root = path.resolve(import.meta.dirname,"..");
const cache = new Map();
const Noop = () => null;
const stub = { __esModule:true, default:Noop, BreadcrumbJsonLd:Noop, FaqJsonLd:Noop, StationDatasetJsonLd:Noop, ZIP_HANDOFF_KEY:"zip" };
function load(file) {
  file = path.resolve(root,file);
  if (cache.has(file)) return cache.get(file).exports;
  const cjsModule = { exports:{} }; cache.set(file,cjsModule);
  const js = ts.transpileModule(fs.readFileSync(file,"utf8"), { compilerOptions:{ module:ts.ModuleKind.CommonJS, target:ts.ScriptTarget.ES2022, jsx:ts.JsxEmit.ReactJSX, esModuleInterop:true } }).outputText;
  function localRequire(name) {
    if (name === "next/link") return { __esModule:true, default:({children,href,...props}) => React.createElement("a",{href,...props},children) };
    if (name === "next/navigation") return { notFound:() => { throw Error("notFound"); } };
    if (name.endsWith("access.mjs")) return access;
    if (name === "@/components/tools-shared") return { useStationData:() => ({data,loading:false,error:null,retry:Noop}), StationSelect:Noop, StationDataStatus:Noop };
    if (name === "@/lib/content") return { getStationGuide:() => null };
    if (name.startsWith("@/components/") && !["@/components/window-bits","@/components/access-notice"].includes(name)) return stub;
    if (name.startsWith("@/") || name.startsWith(".")) {
      const base = name.startsWith("@/") ? path.join(root,"src",name.slice(2)) : path.resolve(path.dirname(file),name);
      if (base.endsWith(".json")) return JSON.parse(fs.readFileSync(base,"utf8"));
      return load(fs.existsSync(base+".ts") ? base+".ts" : base+".tsx");
    }
    return require(name);
  }
  vm.runInNewContext(js,{require:localRequire,module:cjsModule,exports:cjsModule.exports,process,console},{filename:file});
  return cjsModule.exports;
}
const windows = load("src/lib/windows.ts");
const data = windows.getStationData("san-diego-ca");
for (const [month,day,label] of [["2026-11","26","Thanksgiving Day"],["2026-12","25","Christmas Day"]]) {
  test(`actual ${month} chart preserves the closed date and its tide score, but never selects it as best`, async () => {
    const page = load("src/app/beaches/[state]/[slug]/[month]/page.tsx").default;
    const html = renderToStaticMarkup(await page({params:Promise.resolve({state:"ca",slug:"san-diego-ca",month})}));
    assert.ok(html.includes(`${month}-${day}`)); assert.ok(html.includes(`Cabrillo closed — ${label}; no public access.`));
    const w = data.windows.find((w) => w.date === `${month}-${day}`);
    assert.ok(html.includes(`${w.score} · ${w.band}`));
    const answer = html.match(/<div class="answer-box">([\s\S]*?)<\/div>/)[1];
    const best = access.visitWindows(data.station.slug,data.windows.filter((w) => w.date.startsWith(month) && !w.night && w.daylightMin >= 30)).sort((a,b) => b.score-a.score)[0];
    assert.ok(answer.includes(windows.fmtDate(best.date)));
    assert.ok(!answer.includes(`<strong>${windows.fmtDate(`${month}-${day}`)}`));
    assert.ok(html.includes(`${day} ×`));
  });
}
test("actual homepage cards exclude both closed Cabrillo dates and retain an open replacement", () => {
  const html = renderToStaticMarkup(React.createElement(load("src/app/page.tsx").default));
  const cards = [...html.matchAll(/<a href="\/beaches\/ca\/san-diego-ca\/">([\s\S]*?)<\/a>/g)].map((m) => m[1]);
  assert.ok(cards.some((card) => card.includes("<time")));
  for (const card of cards) for (const date of ["2026-11-26","2026-12-25"]) assert.ok(!card.includes(`datetime="${date}"`));
});
test("actual station page labels closed chart rows while selecting an open next-best window", async () => {
  const page = load("src/app/beaches/[state]/[slug]/page.tsx").default;
  // The page's 30-day chart only lists windows with lowTime > generatedAt, so
  // once the holiday passes a fresh data stamp drops the closed row and the
  // label assertion could never hold again (it broke both Nov 27 scheduled
  // refreshes). Pin the stamp to Thanksgiving's eve for this render only.
  const real = windows.getStationData;
  windows.getStationData = (slug) => ({ ...real(slug), generatedAt: Date.parse("2026-11-25T20:00:00Z") });
  let html;
  try {
    html = renderToStaticMarkup(await page({params:Promise.resolve({state:"ca",slug:"san-diego-ca"})}));
  } finally { windows.getStationData = real; }
  assert.ok(html.includes("Cabrillo closed — Thanksgiving Day; no public access."));
  const answer = html.match(/<div class="answer-box">([\s\S]*?)<\/div>/)[1];
  assert.ok(!answer.includes("Nov 26, 2026"));
});
test("actual calendars page counts the eligible feed events, not closed holiday predictions", () => {
  const html = renderToStaticMarkup(React.createElement(load("src/app/calendars/page.tsx").default));
  const expected = access.visitWindows(data.station.slug,data.windows).filter((w) => w.score>=60 && w.windowEnd>data.generatedAt && w.windowStart<=data.generatedAt+365*86400000).length;
  const stationCard = html.slice(html.indexOf("San Diego (Cabrillo)"));
  assert.ok(stationCard.includes(`${expected} windows in the feed right now`));
  assert.ok(stationCard.includes("Cabrillo holiday closures:"));
});

test("actual year heatmap marks both holiday dates closed instead of coloring them as visit opportunities", () => {
  const html = renderToStaticMarkup(React.createElement(load("src/app/tools/year-heatmap/heatmap.tsx").default,{stations:[]}));
  assert.ok(html.includes('title="Cabrillo closed — Thanksgiving Day; no public access."'));
  assert.ok(html.includes('title="Cabrillo closed — Christmas Day; no public access."'));
  assert.ok(html.includes("26 ×")); assert.ok(html.includes("25 ×"));
});
