import { ImageResponse } from "next/og";

import { profile } from "@/content/profile";

export const alt = `${profile.name} — ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const INK = "#151a19";
const BONE = "#f4f2ec";
const SPRUCE = "#0b7a6c";
const SAFFRON = "#efa51b";

export default function OpenGraphImage() {
  const [lineOne, lineTwo] = profile.hero.headline;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          padding: 64,
          background: BONE,
          color: INK,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 56,
                height: 56,
                borderRadius: 14,
                background: INK,
                color: BONE,
                fontSize: 32,
                fontWeight: 700,
                position: "relative",
              }}
            >
              N
              <div
                style={{
                  position: "absolute",
                  top: 6,
                  right: 6,
                  width: 10,
                  height: 10,
                  borderRadius: 999,
                  background: SAFFRON,
                }}
              />
            </div>
            <div style={{ display: "flex", fontSize: 24, color: "#525b58" }}>
              {profile.role} · {profile.city}, IN
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 18px",
              borderRadius: 999,
              border: "2px solid rgba(21,26,25,0.14)",
              fontSize: 20,
            }}
          >
            <div style={{ display: "flex", width: 10, height: 10, borderRadius: 999, background: "#2c7a3f" }} />
            Open to new opportunities
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", marginTop: 70 }}>
          <div style={{ display: "flex", fontSize: 124, fontWeight: 700, letterSpacing: -7, lineHeight: 1 }}>
            {profile.name}
          </div>
          <div style={{ display: "flex", fontSize: 38, marginTop: 26 }}>{lineOne}</div>
          <div style={{ display: "flex", fontSize: 38, color: "#656d6a" }}>{lineTwo}</div>
        </div>

        <div style={{ display: "flex", marginTop: "auto", alignItems: "center", gap: 12, fontSize: 20 }}>
          {["Projects", "Code samples", "Experience", "GitHub activity"].map((label, i) => (
            <div
              key={label}
              style={{
                display: "flex",
                padding: "10px 18px",
                borderRadius: 10,
                background: i === 0 ? SPRUCE : "rgba(21,26,25,0.06)",
                color: i === 0 ? BONE : INK,
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}