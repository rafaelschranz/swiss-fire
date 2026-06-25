import { ImageResponse } from "next/og";

import { SITE_NAME } from "@/lib/site";

export const alt = SITE_NAME;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Branded "Private Dossier" share card (ink / porcelain / brass).
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#15212E",
          color: "#F6F6F2",
          padding: "72px 80px",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div
            style={{
              fontSize: 22,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: "#C9A567",
              fontFamily: "monospace",
            }}
          >
            Private Dossier · Schweizer FIRE
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ fontSize: 76, lineHeight: 1.05, maxWidth: 980 }}>
            Reicht Ihr Kapital bis zur Pension?
          </div>
          <div style={{ fontSize: 30, color: "rgba(246,246,242,0.72)", maxWidth: 900, fontFamily: "Helvetica, Arial, sans-serif" }}>
            Brückenrechnung zwischen Frühpensionierung und Säule 3a, Pensionskasse &amp; AHV —
            inkl. echter ESTV-Steuern pro Gemeinde.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid rgba(246,246,242,0.18)",
            paddingTop: 22,
            fontSize: 22,
            fontFamily: "monospace",
            color: "rgba(246,246,242,0.7)",
          }}
        >
          <div>Säule 3a · Pensionskasse · AHV · Steuern</div>
          <div style={{ color: "#C9A567" }}>Bildungstool — keine Finanzberatung</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
