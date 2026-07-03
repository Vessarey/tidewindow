/**
 * Submit all sitemap URLs to IndexNow (Bing, Yandex, Seznam, Naver — and the
 * index ChatGPT search rides on). Keyless-account-less; the key file is
 * hosted at the domain root (public/<key>.txt).
 * Run after each deploy: node scripts/indexnow.mjs
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(import.meta.dirname, "..");
const KEY = fs.readFileSync(path.join(ROOT, "docs-internal", "indexnow-key.txt"), "utf8").trim();
const HOST = "thetidewindow.com";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

const sitemap = fs.readFileSync(path.join(ROOT, "out", "sitemap.xml"), "utf8");
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList: urls }),
});
console.log(`IndexNow: submitted ${urls.length} URLs — HTTP ${res.status}`);
if (!res.ok) {
  console.error(await res.text());
  process.exit(1);
}
