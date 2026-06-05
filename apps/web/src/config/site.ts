export const siteConfig = {
  name: "ToshDTU Termiz filiali",
  fullName: "Toshkent Davlat Tibbiyot Universiteti Termiz Filiali",
  shortName: "TdTUTF",
  description:
    "Toshkent Davlat Tibbiyot Universiteti Termiz filiali — Surxondaryo viloyatida yetakchi tibbiyot oliy ta'lim muassasasi. Bakalavriat, magistratura, ordinatura.",
  url: "https://tashmedunitf.uz",
  ogImage: "/opengraph-image",
  links: {
    telegram: "https://t.me/tdtutf",
    instagram: "https://instagram.com/tdtutf",
    facebook: "https://facebook.com/tdtutf",
    youtube: "https://youtube.com/@tdtutf",
  },
  contact: {
    phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || "+998 76 221-40-30",
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "info@tashmedunitf.uz",
    address: "Surxondaryo viloyati, Termiz shahri",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || "",
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION || "",
    bing: process.env.NEXT_PUBLIC_BING_VERIFICATION || "",
  },
} as const;

export type SiteConfig = typeof siteConfig;
