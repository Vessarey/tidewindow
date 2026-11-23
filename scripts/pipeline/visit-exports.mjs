import { visitWindows } from "../../src/lib/access.mjs";
const SITE_URL = "https://thetidewindow.com";

function icsEscape(s) {
  return s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,");
}
function icsDate(ms) {
  return new Date(ms).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

export function buildIcs(station, windows, generatedAt) {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Tidewindow//EN",
    `X-WR-CALNAME:Tidewindow — ${icsEscape(station.name)}`,
    "X-WR-TIMEZONE:UTC",
  ];
  const yearAhead = generatedAt + 365 * 86400_000;
  for (const w of visitWindows(station.slug, windows)) {
    // Upcoming (or in-progress) Good+ windows only — the windows array also
    // carries past months for the published month pages, and a calendar feed
    // must never emit retroactive events.
    if (w.score < 60 || w.windowStart > yearAhead || w.windowEnd < generatedAt) continue;
    lines.push(
      "BEGIN:VEVENT",
      `UID:${station.slug}-${w.date.replace(/-/g, "")}-${icsDate(w.lowTime).slice(9, 13)}@tidewindow`,
      `DTSTAMP:${icsDate(generatedAt)}`,
      `DTSTART:${icsDate(w.windowStart)}`,
      `DTEND:${icsDate(w.windowEnd)}`,
      `SUMMARY:${icsEscape(`${w.band} low tide: ${w.lowHeight.toFixed(1)} ft at ${w.lowTimeLocal} (${station.name})`)}`,
      `DESCRIPTION:${icsEscape(
        `Score ${w.score}/100. Arrive by ${w.arriveByLocal}. Low of ${w.lowHeight.toFixed(1)} ft MLLW at ${w.lowTimeLocal}. ` +
          `Computed from NOAA station ${station.noaaId} predictions. Predictions are not observations — check conditions. ` +
          `https://thetidewindow.com/beaches/${station.stateSlug}/${station.slug}/`
      )}`,
      "BEGIN:VALARM",
      "ACTION:DISPLAY",
      "DESCRIPTION:Tide window opens soon",
      "TRIGGER:-PT45M",
      "END:VALARM",
      "END:VEVENT"
    );
  }
  lines.push("END:VCALENDAR");
  return lines.join("\r\n") + "\r\n";
}

// ---------- embed badge ----------

function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function buildBadgeHtml(station, best, posthogKey = "") {
  const line = best
    ? `Best next 30 days: <strong>${best.weekday} ${best.date.slice(5).replace("-", "/")}</strong>, ${best.lowHeight.toFixed(1)} ft at ${best.lowTimeLocal} <span style="opacity:.7">(score ${best.score})</span>`
    : "No standout low-tide window in the next 30 days";
  const url = `${SITE_URL}/beaches/${station.stateSlug}/${station.slug}/?utm_source=embed&utm_medium=badge`;
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex">
<title>Tidewindow badge — ${esc(station.name)}</title>
<style>
body{margin:0;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;background:#0F3038;color:#EFF7F3;font-size:13px}
a{color:inherit;text-decoration:none;display:flex;flex-direction:column;gap:4px;padding:10px 14px}
.n{font-size:11px;letter-spacing:.08em;text-transform:uppercase;opacity:.75}
.c{color:#E0A93E;font-size:11px}
strong{color:#fff}
</style></head>
<body><a href="${url}" target="_blank" rel="noopener">
<span class="n">${esc(station.name)} · tide window</span>
<span>${line}</span>
<span class="c">Computed by Tidewindow ↗</span>
</a>${posthogKey ? `
<script>fetch("https://us.i.posthog.com/i/v0/e/",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({api_key:"${posthogKey}",event:"embed_badge_loaded",distinct_id:"badge-${station.slug}",properties:{station_id:"${station.slug}",host_domain:document.referrer?new URL(document.referrer).hostname:"unknown"}})}).catch(function(){});</script>` : ""}
</body></html>`;
}
