import { ImageResponse } from "next/og";

import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { SITE_NAME } from "@/lib/site";

export const alt = SITE_NAME;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Per-locale branded "Private Dossier" share card (ink / porcelain / brass).
export default async function OpengraphImage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const t = getDictionary(isLocale(lang) ? lang : "de");
  const og = t.og;

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
            {og.kicker}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ fontSize: 76, lineHeight: 1.05, maxWidth: 980 }}>{og.h1}</div>
          <div style={{ fontSize: 30, color: "rgba(246,246,242,0.72)", maxWidth: 900, fontFamily: "Helvetica, Arial, sans-serif" }}>
            {og.body}
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
          <div>{og.footerLeft}</div>
          <div style={{ color: "#C9A567" }}>{og.footerRight}</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
