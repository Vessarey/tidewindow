/**
 * Generates the GitHub Pages redirect-stub site. The project moved to
 * https://thetidewindow.com (Vercel) on 2026-07-03; the old
 * vessarey.github.io/tidewindow/* URLs permanently redirect there.
 *
 * Reads the freshly built out/sitemap.xml (new-domain URLs), emits one stub
 * per page at the matching old path, plus a catch-all 404 that redirects any
 * un-stubbed path (assets, ICS, JSON) by prefix rewrite.
 *
 * Output: pages-stubs/
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(import.meta.dirname, "..");
const OUT = path.join(ROOT, "pages-stubs");
const NEW_ORIGIN = "https://thetidewindow.com";

const sitemap = fs.readFileSync(path.join(ROOT, "out", "sitemap.xml"), "utf8");
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

function stubHtml(target) {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<title>Moved to thetidewindow.com</title>
<link rel="canonical" href="${target}">
<meta http-equiv="refresh" content="0;url=${target}">
<meta name="robots" content="noindex">
</head><body>
<p>Tidewindow moved — this page now lives at <a href="${target}">${target}</a>.</p>
</body></html>\n`;
}

let count = 0;
for (const url of urls) {
  const pathname = new URL(url).pathname; // e.g. /guides/foo/
  const dir = path.join(OUT, pathname);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), stubHtml(url));
  count++;
}

// Catch-all for assets/ICS/JSON and anything unmapped: JS prefix rewrite.
fs.writeFileSync(
  path.join(OUT, "404.html"),
  `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Moved to thetidewindow.com</title>
<meta name="robots" content="noindex">
<script>
var p = location.pathname.replace(/^\\/tidewindow/, "");
location.replace("${NEW_ORIGIN}" + p + location.search + location.hash);
</script>
</head><body><p>Tidewindow moved to <a href="${NEW_ORIGIN}">thetidewindow.com</a>.</p></body></html>\n`
);

console.log(`pages-stubs: ${count} redirect stubs + 404 catch-all written`);
