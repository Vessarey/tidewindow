import type { TideWindow } from "@/lib/format";

/**
 * Real computed tide curve for one window: height samples with the walkable
 * window shaded, the +1.0 ft threshold line, and sunrise/sunset ticks.
 * Pure SVG, server-renderable.
 */
export default function TideCurve({
  window: w,
  width = 640,
  height = 140,
  showLabels = true,
}: {
  window: TideWindow;
  width?: number;
  height?: number;
  showLabels?: boolean;
}) {
  const { t0, dt, vals } = w.curve;
  const pts = vals
    .map((v, i) => (v === null ? null : { t: t0 + i * dt * 60000, v }))
    .filter((p): p is { t: number; v: number } => p !== null);
  if (pts.length < 4) return null;

  const tMin = pts[0].t;
  const tMax = pts[pts.length - 1].t;
  const vMax = Math.max(...pts.map((p) => p.v), 1.5);
  const vMin = Math.min(...pts.map((p) => p.v), -0.5) - 0.3;
  const px = (t: number) => ((t - tMin) / (tMax - tMin)) * width;
  const py = (v: number) => height - ((v - vMin) / (vMax - vMin)) * (height - 18) - 9;

  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${px(p.t).toFixed(1)},${py(p.v).toFixed(1)}`).join("");
  const area = `${line}L${px(tMax).toFixed(1)},${height}L${px(tMin).toFixed(1)},${height}Z`;

  const ticks: { x: number; label: string }[] = [];
  if (w.sunrise && w.sunrise > tMin && w.sunrise < tMax) ticks.push({ x: px(w.sunrise), label: "sunrise" });
  if (w.sunset && w.sunset > tMin && w.sunset < tMax) ticks.push({ x: px(w.sunset), label: "sunset" });

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`Tide curve for ${w.date}: low of ${w.lowHeight.toFixed(1)} ft at ${w.lowTimeLocal}, walkable window ${w.windowStartLocal} to ${w.windowEndLocal}`}
      className="w-full"
    >
      {/* walkable window shading */}
      <rect
        x={px(w.windowStart)}
        y={0}
        width={Math.max(1, px(w.windowEnd) - px(w.windowStart))}
        height={height}
        fill="var(--color-sand)"
        opacity={0.55}
      />
      {/* water area + curve */}
      <path d={area} fill="var(--color-kelp)" opacity={0.14} />
      <path d={line} fill="none" stroke="var(--color-ink)" strokeWidth={1.8} />
      {/* threshold */}
      <line x1={0} x2={width} y1={py(1.0)} y2={py(1.0)} stroke="var(--color-ink-soft)" strokeWidth={0.8} strokeDasharray="5 4" opacity={0.6} />
      {/* MLLW zero */}
      <line x1={0} x2={width} y1={py(0)} y2={py(0)} stroke="var(--color-ink-soft)" strokeWidth={0.6} opacity={0.35} />
      {/* low marker */}
      <circle cx={px(w.lowTime)} cy={py(w.lowHeight)} r={3.4} fill="var(--color-anemone)" />
      {/* sun ticks */}
      {ticks.map((t) => (
        <g key={t.label}>
          <line x1={t.x} x2={t.x} y1={0} y2={height} stroke="var(--color-gold)" strokeWidth={1.4} opacity={0.85} />
          {showLabels && (
            <text x={t.x + 4} y={12} fontSize={10} fill="var(--color-ink-soft)" fontFamily="var(--font-mono)">
              {t.label}
            </text>
          )}
        </g>
      ))}
      {showLabels && (
        <>
          <text x={4} y={py(1.0) - 4} fontSize={10} fill="var(--color-ink-soft)" fontFamily="var(--font-mono)">
            +1.0 ft walkable
          </text>
          <text x={px(w.lowTime) + 6} y={py(w.lowHeight) - 6} fontSize={11} fill="var(--color-ink)" fontFamily="var(--font-mono)" fontWeight={600}>
            {w.lowHeight.toFixed(1)} ft · {w.lowTimeLocal}
          </text>
        </>
      )}
    </svg>
  );
}
