import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/providers/Providers";
import NextTopLoader from "nextjs-toploader";
import SkipToContent from "@/components/a11y/SkipToContent";
import A11yPreHydrationScript from "@/components/a11y/A11yPreHydrationScript";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Admin Panel — TdTUTF",
    template: "%s | TdTUTF Admin",
  },
  description: "TdTUTF Admin Panel — Boshqaruv tizimi",
  robots: { index: false, follow: false },
  icons: {
    icon: [
      { url: "/favicon.webp", type: "image/webp", sizes: "32x32" },
      { url: "/icon-192.webp", type: "image/webp", sizes: "192x192" },
      { url: "/icon-512.webp", type: "image/webp", sizes: "512x512" },
    ],
    apple: { url: "/apple-icon.webp", type: "image/webp", sizes: "180x180" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" className={inter.variable} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <A11yPreHydrationScript />
      </head>
      <body className="font-sans antialiased bg-gray-50 text-gray-900">
        <SkipToContent />
        <NextTopLoader
          color="#2563eb"
          height={3}
          showSpinner={false}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
