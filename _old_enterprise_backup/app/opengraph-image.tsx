import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Mahira Sharma — Enterprise SEO Strategist";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 28, color: "#10b981", fontWeight: 700 }}>
          MAHIRA.SHARMA
        </div>
        <div style={{ fontSize: 64, fontWeight: 800, marginTop: 20, lineHeight: 1.1 }}>
          Enterprise SEO Strategist
        </div>
        <div style={{ fontSize: 30, color: "#94a3b8", marginTop: 24 }}>
          Scaling organic growth for enterprise brands.
        </div>
      </div>
    ),
    size,
  );
}
