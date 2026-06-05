export const siteConfig = {
  name: "TdTU Termiz Filiali",
  shortName: "TdTUTF",
  description: "TdTUTF Admin Panel — Boshqaruv tizimi",
  url: "https://admin.tdtutf.uz",
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1",
  frontendUrl: process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000",
  colors: {
    primary: "#1d4ed8",
    primaryHover: "#1e40af",
    gradient: "from-blue-800 via-blue-700 to-blue-900",
    editBorder: "#3b82f6",
    editBg: "rgba(59,130,246,0.05)",
    deleteBg: "#ef4444",
    addBg: "#22c55e",
  },
} as const;

export type SiteConfig = typeof siteConfig;
