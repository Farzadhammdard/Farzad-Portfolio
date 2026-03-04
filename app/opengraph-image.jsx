import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 1200,
  height: 630
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 72,
          color: "#eef6ff",
          background:
            "radial-gradient(circle at 15% 20%, rgba(14,165,233,0.4), transparent 45%), #080f1f"
        }}
      >
        <p style={{ letterSpacing: "0.2em", fontSize: 24, opacity: 0.9 }}>PORTFOLIO</p>
        <h1 style={{ fontSize: 82, margin: "20px 0 0", lineHeight: 1.05 }}>Farzad</h1>
        <p style={{ fontSize: 34, marginTop: 20, maxWidth: 900, opacity: 0.9 }}>
          JavaScript Portfolio • Persian + English • Admin Panel
        </p>
      </div>
    ),
    {
      ...size
    }
  );
}
