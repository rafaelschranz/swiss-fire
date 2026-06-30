import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Inter, Spectral } from "next/font/google";
import { notFound } from "next/navigation";

import "../globals.css";
import { JsonLd } from "@/components/JsonLd";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { HTML_LANG, isLocale, LOCALES, OG_LOCALE, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { I18nProvider } from "@/lib/i18n/I18nProvider";
import { localeHref } from "@/lib/i18n/routing";
import { ANALYTICS, SITE_NAME, SITE_URL } from "@/lib/site";

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

export const viewport: Viewport = {
  themeColor: "#15212E",
  colorScheme: "light",
};

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = getDictionary(lang);
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: t.meta.titleDefault,
      template: t.meta.titleTemplate,
    },
    description: t.meta.description,
    applicationName: SITE_NAME,
    keywords: t.meta.keywords,
    alternates: {
      canonical: localeHref(lang, "/"),
      languages: {
        "de-CH": localeHref("de", "/"),
        "en-CH": localeHref("en", "/"),
        "x-default": localeHref("de", "/"),
      },
    },
    openGraph: {
      type: "website",
      locale: OG_LOCALE[lang],
      url: `${SITE_URL}${localeHref(lang, "/")}`,
      siteName: SITE_NAME,
      title: t.meta.titleDefault,
      description: t.meta.description,
    },
    twitter: {
      card: "summary_large_image",
      title: t.meta.titleDefault,
      description: t.meta.description,
    },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const t = getDictionary(locale);

  return (
    <html
      lang={HTML_LANG[locale]}
      className={`${spectral.variable} ${inter.variable} ${plexMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: SITE_NAME,
            url: SITE_URL,
            description: t.meta.description,
            logo: `${SITE_URL}/opengraph-image`,
          }}
        />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: SITE_NAME,
            url: `${SITE_URL}${localeHref(locale, "/")}`,
            inLanguage: HTML_LANG[locale],
          }}
        />
        <a href="#hauptinhalt" className="skip-link">
          {t.common.skipToContent}
        </a>

        <I18nProvider lang={locale} dict={t}>
          <SiteHeader lang={locale} dict={t} />
          {children}
          <SiteFooter lang={locale} dict={t} />
        </I18nProvider>

        {/* Self-hosted Umami — cookieless, production only. Plain defer tag (as provided). */}
        {process.env.NODE_ENV === "production" && (
          <script defer src={ANALYTICS.src} data-website-id={ANALYTICS.websiteId} />
        )}
      </body>
    </html>
  );
}
