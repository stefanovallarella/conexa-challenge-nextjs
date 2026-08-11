import { ImageResponse } from "next/og";

export const alt = "Rick & Morty Episode Explorer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const INK_900 = "#0E1116";
const INK_400 = "#8B95A5";
const TEAL = "#0EA5A5";
const AMBER = "#E08A1E";
const CIRCLE_SIZE = 260;

export default function OpengraphImage() {
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
          gap: 56,
          backgroundColor: INK_900,
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: CIRCLE_SIZE,
              height: CIRCLE_SIZE,
              borderRadius: CIRCLE_SIZE,
              backgroundColor: TEAL,
              opacity: 0.85,
            }}
          />
          <div
            style={{
              width: CIRCLE_SIZE,
              height: CIRCLE_SIZE,
              borderRadius: CIRCLE_SIZE,
              backgroundColor: AMBER,
              opacity: 0.75,
              marginLeft: -110,
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div style={{ fontSize: 56, color: "#E6EAF0", letterSpacing: -1 }}>
            Rick &amp; Morty Episode Explorer
          </div>
          <div style={{ fontSize: 28, color: INK_400 }}>
            Pick two characters and see which episodes they share
          </div>
        </div>
      </div>
    ),
    size,
  );
}
