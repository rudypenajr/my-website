import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Rudy Pena - Staff Software Engineer focused on applied AI platforms";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "radial-gradient(circle at 14% 20%, rgba(244,114,82,0.32), transparent 320px), radial-gradient(circle at 82% 24%, rgba(34,211,238,0.22), transparent 330px), linear-gradient(135deg, #101216 0%, #0c0e12 58%, #111827 100%)",
          color: "#f5f7fa",
          padding: "72px",
          fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#9fa9b5",
            fontSize: 28,
            fontWeight: 700,
          }}
        >
          <span>rudypenajr.com</span>
          <span>Applied AI Platforms</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
          <div
            style={{
              display: "flex",
              width: "fit-content",
              border: "1px solid rgba(244,114,82,0.58)",
              borderRadius: 999,
              background: "rgba(244,114,82,0.12)",
              color: "#fb923c",
              padding: "12px 20px",
              fontSize: 24,
              fontWeight: 800,
            }}
          >
            Staff Software Engineer
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <h1
              style={{
                margin: 0,
                fontSize: 104,
                lineHeight: 0.95,
                letterSpacing: 0,
                fontWeight: 900,
              }}
            >
              Rudy Pena
            </h1>
            <p
              style={{
                margin: 0,
                maxWidth: 910,
                color: "#c9d2dc",
                fontSize: 34,
                lineHeight: 1.35,
                fontWeight: 650,
              }}
            >
              Building secure AI platforms with AWS Bedrock AgentCore, Strands agents,
              FastAPI MCP services, and Python/Node.js developer tools.
            </p>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 14,
            color: "#dbe4ee",
            fontSize: 24,
            fontWeight: 800,
          }}
        >
          {["AgentCore", "Strands", "FastAPI MCP", "Python", "Next.js"].map((item) => (
            <span
              key={item}
              style={{
                border: "1px solid rgba(159,169,181,0.36)",
                borderRadius: 999,
                background: "rgba(38,44,54,0.72)",
                padding: "10px 16px",
              }}
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
