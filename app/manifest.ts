import type { MetadataRoute } from "next";

import { SITE_NAME } from "@/lib/site";

/** Web app manifest (served at /manifest.webmanifest, linked automatically). */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} — Schweizer FIRE-Rechner`,
    short_name: SITE_NAME,
    description:
      "Der kostenlose Schweizer Rechner für die Frühpensionierung: Brückenphase, Säule 3a, Pensionskasse, AHV und echte Steuern.",
    start_url: "/",
    display: "standalone",
    background_color: "#F6F6F2",
    theme_color: "#15212E",
    icons: [{ src: "/favicon.ico", sizes: "any", type: "image/x-icon" }],
  };
}
