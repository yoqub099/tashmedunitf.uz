import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Toshkent Davlat Tibbiyot Universiteti Termiz Filiali";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Top gold accent */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 6, background: "#d4a843", display: "flex" }} />

        {/* Content */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, padding: 40 }}>
          {/* University name */}
          <div style={{ fontSize: 28, color: "rgba(255,255,255,0.9)", textAlign: "center", letterSpacing: 4, textTransform: "uppercase", fontWeight: 400 }}>
            Toshkent Davlat Tibbiyot Universiteti
          </div>

          {/* Medical cross symbol */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 80, height: 80, borderRadius: "50%", border: "3px solid #d4a843", marginTop: 8, marginBottom: 8 }}>
            <div style={{ fontSize: 48, color: "#d4a843", fontWeight: 700 }}>+</div>
          </div>

          {/* Branch name */}
          <div style={{ fontSize: 64, color: "white", fontWeight: 800, textAlign: "center", letterSpacing: 6, textTransform: "uppercase", lineHeight: 1.1 }}>
            TERMIZ FILIALI
          </div>

          {/* Subtitle */}
          <div style={{ fontSize: 22, color: "rgba(255,255,255,0.7)", textAlign: "center", marginTop: 8, letterSpacing: 2 }}>
            RASMIY VEB-SAYT
          </div>

          {/* Separator */}
          <div style={{ width: 200, height: 2, background: "#d4a843", marginTop: 16, marginBottom: 16, display: "flex" }} />

          {/* URL */}
          <div style={{ fontSize: 24, color: "#d4a843", fontWeight: 600, letterSpacing: 2 }}>
            tashmedunitf.uz
          </div>
        </div>

        {/* Bottom gold accent */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 6, background: "#d4a843", display: "flex" }} />
      </div>
    ),
    { ...size }
  );
}
