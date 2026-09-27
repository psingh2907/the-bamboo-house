import { ImageResponse } from "next/og";
import { business } from "@/data/business";

export const alt = `${business.name} — family restaurant in Syamardanda, Panna`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Shared social card, generated at build time (no photo needed). */
export default function OpengraphImage() {
  const slats = Array.from({ length: 22 }, (_, i) => i);
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#16110c", position: "relative" }}>
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 470, display: "flex", gap: 5, opacity: 0.9 }}>
          {slats.map((i) => (
            <div
              key={i}
              style={{
                width: 16,
                height: "100%",
                background: "linear-gradient(90deg,#6b4520,#d6a760 40%,#5e3c1b)",
                opacity: 0.55 + ((i * 37) % 45) / 100,
              }}
            />
          ))}
        </div>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(90deg,#16110c 45%,rgba(22,17,12,0.2) 100%)",
          }}
        />
        <div style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 80px", color: "#fbf7ef" }}>
          <div style={{ fontSize: 22, letterSpacing: 6, color: "#c99a55", textTransform: "uppercase" }}>
            [ Family restaurant · Syamardanda, Panna ]
          </div>
          <div style={{ fontSize: 96, lineHeight: 1, marginTop: 28, letterSpacing: -2 }}>The Bamboo House</div>
          <div style={{ fontSize: 40, marginTop: 24, color: "#e7cf9e", fontStyle: "italic" }}>Come hungry. Leave with a memory.</div>
          <div style={{ fontSize: 24, marginTop: 40, color: "#b8aa96" }}>
            {`${business.rating.value} / 5 on Google · Open daily 11 am – 9:30 pm`}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
