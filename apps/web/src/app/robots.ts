import type { MetadataRoute } from "next";

const SITE_URL = "https://tashmedunitf.uz";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/_next/static/", "/uz/", "/ru/", "/en/"],
        disallow: [
          "/api/",
          "/login",
          "/_next/",
          "/admin/",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: ["/", "/_next/static/", "/uz/", "/ru/", "/en/"],
        disallow: ["/api/", "/login"],
      },
      {
        userAgent: "Googlebot-Image",
        allow: ["/", "/_next/static/", "/uz/", "/ru/", "/en/"],
      },
      {
        userAgent: "Yandexbot",
        allow: ["/", "/_next/static/", "/uz/", "/ru/", "/en/"],
        disallow: ["/api/", "/login"],
      },
      {
        userAgent: "Bingbot",
        allow: ["/", "/_next/static/", "/uz/", "/ru/", "/en/"],
        disallow: ["/api/", "/login"],
      },
      {
        userAgent: "DuckDuckBot",
        allow: ["/", "/_next/static/", "/uz/", "/ru/", "/en/"],
        disallow: ["/api/", "/login"],
      },
      {
        userAgent: "Baiduspider",
        allow: ["/", "/_next/static/", "/uz/", "/ru/", "/en/"],
        disallow: ["/api/", "/login"],
      },
      {
        userAgent: "Slurp",
        allow: ["/", "/_next/static/", "/uz/", "/ru/", "/en/"],
        disallow: ["/api/", "/login"],
      },
      {
        userAgent: "facebot",
        allow: ["/", "/_next/static/", "/uz/", "/ru/", "/en/"],
      },
      {
        userAgent: "Twitterbot",
        allow: ["/", "/_next/static/", "/uz/", "/ru/", "/en/"],
      },
      {
        userAgent: "LinkedInBot",
        allow: ["/", "/_next/static/", "/uz/", "/ru/", "/en/"],
      },
      {
        userAgent: "TelegramBot",
        allow: ["/", "/_next/static/", "/uz/", "/ru/", "/en/"],
      },
      {
        userAgent: "WhatsApp",
        allow: ["/", "/_next/static/", "/uz/", "/ru/", "/en/"],
      },
      {
        userAgent: "Pinterestbot",
        allow: ["/", "/_next/static/", "/uz/", "/ru/", "/en/"],
      },
      // SEO crawler bots — throttled with crawl-delay
      {
        userAgent: "AhrefsBot",
        allow: ["/", "/_next/static/", "/uz/", "/ru/", "/en/"],
        disallow: ["/api/", "/login", "/admin/"],
        crawlDelay: 10,
      },
      {
        userAgent: "SemrushBot",
        allow: ["/", "/_next/static/", "/uz/", "/ru/", "/en/"],
        disallow: ["/api/", "/login", "/admin/"],
        crawlDelay: 10,
      },
      {
        userAgent: "MJ12bot",
        allow: ["/", "/_next/static/", "/uz/", "/ru/", "/en/"],
        disallow: ["/api/", "/login", "/admin/"],
        crawlDelay: 10,
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
