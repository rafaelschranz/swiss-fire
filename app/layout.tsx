import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { JsonLd } from "@/components/JsonLd";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
    card: "summary",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
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
        <a
          href="#hauptinhalt"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-zinc-900 focus:px-4 focus:py-2 focus:text-white dark:focus:bg-zinc-100 dark:focus:text-zinc-900"
        >
          Zum Hauptinhalt springen
        </a>
        {children}
      </body>
    </html>
  );
}
