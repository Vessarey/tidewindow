/** Generate stable 1200x630 PNG social cards for guides and station routes. */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { parse as parseYaml } from "yaml";

const ROOT = path.join(import.meta.dirname, "..");
const OUT_GUIDES = path.join(ROOT, "public", "og", "guides");
const OUT_STATIONS = path.join(ROOT, "public", "og", "stations");
const WIDTH = 1200;
const HEIGHT = 630;

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function wrap(text, maxCharacters, maxLines) {
  const words = text.split(/\s+/);
  const lines = [];
  let cursor = 0;
  while (cursor < words.length && lines.length < maxLines) {
    let line = words[cursor++];
    while (cursor < words.length && `${line} ${words[cursor]}`.length <= maxCharacters) {
      line += ` ${words[cursor++]}`;
    }
    lines.push(line);
  }
  if (cursor < words.length) lines[lines.length - 1] = `${lines.at(-1).replace(/[.,;:]?$/, "")}…`;
  return lines;
}

function textLines(lines, { x, y, lineHeight, fontSize, color = "#ffffff", weight = 700 }) {
  return `<text x="${x}" y="${y}" fill="${color}" font-family="Georgia, serif" font-size="${fontSize}" font-weight="${weight}">${lines
    .map((line, index) => `<tspan x="${x}" dy="${index === 0 ? 0 : lineHeight}">${escapeXml(line)}</tspan>`)
    .join("")}</text>`;
}

function frame(inner) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <linearGradient id="sea" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0f3038"/>
      <stop offset="1" stop-color="#174b54"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#sea)"/>
  <path d="M0 520 C180 480 300 565 490 525 S830 480 1200 535 L1200 630 L0 630 Z" fill="#eff7f3" opacity="0.08"/>
  <text x="64" y="82" fill="#7fb8ae" font-family="Arial, sans-serif" font-size="28" font-weight="700" letter-spacing="3">TIDEWINDOW</text>
  ${inner}
  <text x="64" y="584" fill="#ead9bd" font-family="Arial, sans-serif" font-size="22">Computed from NOAA predictions · updated daily</text>
  </svg>`;
}

async function writePng(svg, destination) {
  const png = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, png);
}

function articleFrontmatter(raw, file) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) throw new Error(`${file}: missing YAML frontmatter`);
  return parseYaml(match[1]);
}

function scoreColor(score) {
  if (score >= 90) return "#e0a93e";
  if (score >= 75) return "#2f7668";
  if (score >= 60) return "#7fb8ae";
  if (score >= 40) return "#ead9bd";
  return "#d7dedb";
}

async function buildGuideImages() {
  const articlesDir = path.join(ROOT, "content", "articles");
  const files = fs.readdirSync(articlesDir).filter((file) => file.endsWith(".md"));
  let count = 0;
  for (const file of files) {
    const frontmatter = articleFrontmatter(fs.readFileSync(path.join(articlesDir, file), "utf8"), file);
    if (frontmatter.draft) continue;
    const slug = file.replace(/\.md$/, "");
    const title = wrap(frontmatter.title, 34, 3);
    const category = String(frontmatter.category ?? "guide").replace(/-/g, " ").toUpperCase();
    const svg = frame(`
      <text x="64" y="150" fill="#e0a93e" font-family="Arial, sans-serif" font-size="22" font-weight="700" letter-spacing="2">${escapeXml(category)}</text>
      ${textLines(title, { x: 64, y: 222, lineHeight: 76, fontSize: 62 })}
      <rect x="64" y="500" width="132" height="6" rx="3" fill="#e0a93e"/>
    `);
    await writePng(svg, path.join(OUT_GUIDES, `${slug}.png`));
    count += 1;
  }
  return count;
}

async function buildStationImages() {
  const index = JSON.parse(fs.readFileSync(path.join(ROOT, "public", "data-json", "index.json"), "utf8"));
  for (const station of index.stations) {
    const data = JSON.parse(fs.readFileSync(path.join(ROOT, "public", "data-json", "stations", `${station.slug}.json`), "utf8"));
    const byDate = new Map();
    for (const window of data.windows.filter((window) => window.lowTime >= data.generatedAt && window.lowTime < data.generatedAt + 30 * 86400_000)) {
      const prior = byDate.get(window.date);
      if (!prior || window.score > prior) byDate.set(window.date, window.score);
    }
    const days = Array.from({ length: 30 }, (_, index) => {
      const date = new Date(data.generatedAt + index * 86400_000).toISOString().slice(0, 10);
      return byDate.get(date) ?? 0;
    });
    const cells = days.map((score, index) => {
      const x = 64 + (index % 10) * 46;
      const y = 392 + Math.floor(index / 10) * 46;
      return `<rect x="${x}" y="${y}" width="34" height="34" rx="5" fill="${scoreColor(score)}" opacity="${score ? 1 : 0.3}"/>`;
    }).join("");
    const title = wrap(station.name, 30, 2);
    const svg = frame(`
      <text x="64" y="150" fill="#e0a93e" font-family="Arial, sans-serif" font-size="22" font-weight="700" letter-spacing="2">NOAA ${escapeXml(station.noaaId)} · TIDE CHART</text>
      ${textLines(title, { x: 64, y: 230, lineHeight: 72, fontSize: 62 })}
      <text x="64" y="365" fill="#eff7f3" font-family="Arial, sans-serif" font-size="24">Next 30 days · best daylight window each day</text>
      ${cells}
    `);
    await writePng(svg, path.join(OUT_STATIONS, `${station.slug}.png`));
  }
  return index.stations.length;
}

const [guideCount, stationCount] = await Promise.all([buildGuideImages(), buildStationImages()]);
console.log(`og images: ${guideCount} guides, ${stationCount} stations`);
