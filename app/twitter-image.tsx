import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Sohovi — Privacy-First Data Quality Platform";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0A0A0A",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px 96px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: 6,
            background: "#00836e",
          }}
        />
        <div
          style={{
            fontSize: 42,
            fontWeight: 800,
            color: "#FFFFFF",
            letterSpacing: "-0.02em",
            marginBottom: 24,
          }}
        >
          Sohovi
        </div>
        <div
          style={{
            fontSize: 52,
            fontWeight: 700,
            color: "#FFFFFF",
            lineHeight: 1.15,
            letterSpacing: "-0.03em",
            maxWidth: 820,
            marginBottom: 28,
          }}
        >
          Privacy-First Data Quality Platform
        </div>
        <div
          style={{
            fontSize: 26,
            color: "#5B5B63",
            lineHeight: 1.4,
            maxWidth: 740,
          }}
        >
          Profile, score, and validate your CSV & Excel files entirely in your browser. Zero server upload.
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 84,
            right: 118,
            fontSize: 18,
            color: "#5B5B63",
          }}
        >
          sohovi.com
        </div>
      </div>
    ),
    { ...size }
  );
}
