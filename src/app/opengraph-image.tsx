import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Mahira Sharma — SEO Specialist";
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
          background: "#faf7f2",
          color: "#1a1a1a",
          fontFamily: "serif",
        }}
      >
        <div style={{ fontSize: 26, color: "#0d7377", fontWeight: 700 }}>
          MAHIRA SHARMA
        </div>
        <div style={{ fontSize: 66, fontWeight: 800, marginTop: 20, lineHeight: 1.05 }}>
          Helping brands rank
        </div>
        <div style={{ fontSize: 66, fontWeight: 800, lineHeight: 1.05 }}>
          higher, naturally.
        </div>
        <div style={{ fontSize: 28, color: "#6b6b6b", marginTop: 24 }}>
          SEO Specialist · Melbourne &amp; Kathmandu
        </div>
      </div>
    ),
    size,
  );
}
