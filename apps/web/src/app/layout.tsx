import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { headers } from "next/headers";
import QueryProvider from "@/providers/QueryProvider";
import NextTopLoader from "nextjs-toploader";
import CookieConsent from "@/components/shared/CookieConsent";
import Analytics from "@/components/shared/Analytics";
import SkipToContent from "@/components/a11y/SkipToContent";
import A11yPreHydrationScript from "@/components/a11y/A11yPreHydrationScript";
import type { Language } from "@/lib/i18n";
import { siteConfig } from "@/config/site";
import { getOrganizationSchema, getWebsiteSchema, SITE_URL, KEYWORDS } from "@/lib/seo";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  colorScheme: "light",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1e3a5f" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ToshDTU Termiz filiali — Toshkent Davlat Tibbiyot Universiteti",
    template: "%s | ToshDTU Termiz filiali",
  },
  description:
    "Toshkent Davlat Tibbiyot Universiteti Termiz filiali — Surxondaryo viloyatida yetakchi tibbiyot oliy ta'lim muassasasi. Bakalavriat, magistratura, ordinatura. 2026-yil qabul ochildi.",
  keywords: [
    ...KEYWORDS.uz.primary,
    ...KEYWORDS.uz.secondary.slice(0, 5),
    ...KEYWORDS.ru.primary.slice(0, 3),
    ...KEYWORDS.en.primary.slice(0, 3),
  ],
  authors: [{ name: siteConfig.fullName, url: SITE_URL }],
  creator: siteConfig.fullName,
  publisher: siteConfig.fullName,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.webp", type: "image/webp", sizes: "32x32" },
      { url: "/icon-192.webp", type: "image/webp", sizes: "192x192" },
      { url: "/icon-512.webp", type: "image/webp", sizes: "512x512" },
    ],
    apple: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/apple-icon.webp", type: "image/webp", sizes: "180x180" },
    ],
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "uz_UZ",
    alternateLocale: ["ru_RU", "en_US"],
    url: SITE_URL,
    siteName: siteConfig.fullName,
    title: "ToshDTU Termiz filiali — Tibbiyot oliy ta'limi",
    description:
      "Toshkent Davlat Tibbiyot Universiteti Termiz filiali — Surxondaryo viloyatida yetakchi tibbiyot oliy ta'lim muassasasi. Bakalavriat, magistratura, ordinatura.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Toshkent Davlat Tibbiyot Universiteti Termiz Filiali",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ToshDTU Termiz filiali — Tibbiyot oliy ta'limi",
    description:
      "Toshkent Davlat Tibbiyot Universiteti Termiz filiali — bakalavriat, magistratura, ordinatura. Surxondaryo viloyatida sifatli tibbiyot ta'limi.",
    images: ["/opengraph-image"],
  },
  alternates: {
    canonical: SITE_URL,
    languages: {
      uz: `${SITE_URL}/uz`,
      ru: `${SITE_URL}/ru`,
      en: `${SITE_URL}/en`,
    },
  },
  ...(siteConfig.verification.google && {
    verification: {
      google: siteConfig.verification.google,
      yandex: siteConfig.verification.yandex || undefined,
    },
  }),
  formatDetection: {
    telephone: false,
    date: false,
    email: false,
    address: false,
  },
  other: {
    "msapplication-TileColor": "#1e3a5f",
    "apple-mobile-web-app-capable": "yes",
    "mobile-web-app-capable": "yes",
  },
  category: "education",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = getOrganizationSchema();
  const websiteSchema = getWebsiteSchema();

  // Read locale from middleware header
  const headerStore = await headers();
  const locale = headerStore.get("x-locale") || "uz";

  return (
    <html lang={locale} className={inter.variable} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        {/* PWA — Apple + Android Chrome standard */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="TdTUTF" />

        {/* Microsoft Edge / IE */}
        <meta name="msapplication-TileColor" content="#1e3a5f" />
        <meta name="msapplication-config" content="/browserconfig.xml" />

        {/* Format detection - prevent auto-linking */}
        <meta name="format-detection" content="telephone=no, date=no, email=no, address=no" />

        {/* Color scheme */}
        <meta name="color-scheme" content="light" />

        {/* DNS Prefetch & Preconnect for performance */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Telegram specific */}
        <meta name="telegram:channel" content="@tdtutf" />

        {/* Geographic targeting */}
        <meta name="geo.region" content="UZ-SU" />
        <meta name="geo.placename" content="Termiz" />
        <meta name="geo.position" content="37.2242;67.2783" />
        <meta name="ICBM" content="37.2242, 67.2783" />

        {/* Content language */}
        <meta httpEquiv="content-language" content={locale} />

        {/* Generator */}
        <meta name="generator" content="Next.js" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
        <A11yPreHydrationScript />
      </head>
      <body className="font-sans antialiased bg-white text-gray-900">
        <SkipToContent serverLang={locale as Language} />
        <NextTopLoader
          color="#2563eb"
          height={3}
          showSpinner={false}
        />
        <QueryProvider>{children}</QueryProvider>
        <CookieConsent />
        <Analytics />
      </body>
    </html>
  );
}
