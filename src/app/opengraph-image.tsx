import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const alt = "Tidewindow — know the hours the ocean gives back";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0F3038",
          color: "#EFF7F3",
          padding: 64,
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 72, fontWeight: 700, color: "#FFFFFF" }}>Tidewindow</div>
          <div style={{ fontSize: 34, marginTop: 16, color: "#EAD9BD" }}>
            Know the hours the ocean gives back.
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div style={{ fontSize: 22, color: "#7FB8AE", fontFamily: "monospace" }}>
            daylight minus-tide windows · computed from NOAA predictions · updated daily
          </div>
          <div
            style={{
              display: "flex",
              background: "#E0A93E",
              color: "#3A2B06",
              fontSize: 22,
              fontFamily: "monospace",
              padding: "8px 18px",
              borderRadius: 6,
            }}
          >
            score 0–100
          </div>
        </div>
      </div>
    ),
    size
  );
}
