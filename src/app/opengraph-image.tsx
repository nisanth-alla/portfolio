import { ImageResponse } from "next/og";

import { profile } from "@/content/profile";

export const alt = `${profile.name} — ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "#030712",
          color: "#f8fafc",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 6, opacity: 0.7 }}>
          {profile.role.toUpperCase()}
        </div>
        <div style={{ fontSize: 72, fontWeight: 700, marginTop: 24 }}>
          {profile.name}
        </div>
        <div style={{ fontSize: 32, marginTop: 24, maxWidth: 900, opacity: 0.85 }}>
          {profile.hero.headline.join(" ")}
        </div>
      </div>
    ),
    { ...size },
  );
}
