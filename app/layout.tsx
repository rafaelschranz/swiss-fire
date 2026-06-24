import type { Metadata } from "next";
import Link from "next/link";
import { IBM_Plex_Mono, Inter, Spectral } from "next/font/google";
import "./globals.css";
import { JsonLd } from "@/components/JsonLd";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

const spectral = Spectral({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-spectral",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-plex",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Frühpensionierung & Pensionskasse`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "FIRE Schweiz",
    "Frühpensionierung",
    "Brückenphase",
    "Säule 3a",
    "Pensionskasse",
    "BVG",
    "AHV",
    "Kapitalbezug Steuern",
    "finanzielle Unabhängigkeit",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "de_CH",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Frühpensionierung & Pensionskasse`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Frühpensionierung & Pensionskasse`,
    description: SITE_DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="de"
      className={`${spectral.variable} ${inter.variable} ${plexMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: SITE_NAME,
            url: SITE_URL,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Web",
            description: SITE_DESCRIPTION,
            inLanguage: "de-CH",
            offers: { "@type": "Offer", price: "0", priceCurrency: "CHF" },
          }}
        />
        <a href="#hauptinhalt" className="skip-link">
          Zum Hauptinhalt springen
        </a>

        <header className="bg-ink text-paper">
          <div className="col flex items-center justify-between py-3.5">
            <Link href="/" className="eyebrow text-brass-soft no-underline">
              Private Dossier · Swiss FIRE
            </Link>
            <Link
              href="/ratgeber"
              className="eyebrow text-paper/70 no-underline transition hover:text-paper"
            >
              Ratgeber
            </Link>
          </div>
        </header>

        {children}

        <footer className="mt-auto bg-ink-2 text-paper/70">
          <div className="col space-y-2 py-8 text-xs leading-relaxed">
            <p className="eyebrow text-brass-soft">Hinweis</p>
            <p className="max-w-prose">
              Ausschliesslich zu Bildungszwecken. Keine Finanz-, Steuer- oder Anlageberatung.
              Alle Steuerangaben sind Schätzungen ohne Gewähr. Berechnungen laufen lokal im
              Browser; es werden keine Eingaben an einen Server übertragen.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
