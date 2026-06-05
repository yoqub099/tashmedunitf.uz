import {
  Home,
  Newspaper,
  CalendarDays,
  Presentation,
  HelpCircle,
  Mail,
  ClipboardList,
  Briefcase,
  BookOpen,
  Languages,
  FileText,
  Image as ImageIcon,
  Handshake,
  Star,
  Type,
  GraduationCap,
  BookOpenCheck,
  Library,
  Camera,
  FolderArchive,
  type LucideIcon,
} from "lucide-react";

// ============================================
// Frontend-style navigation with dropdowns
// ============================================

export interface NavItem {
  title: string;
  href: string;
  children?: NavItem[];
  badge?: number;
}

export const mainNavigation: NavItem[] = [
  {
    title: "Biz haqimizda",
    href: "/biz-haqimizda",
    children: [
      { title: "Umumiy ma'lumot", href: "/biz-haqimizda/umumiy-malumot" },
      {
        title: "Tuzilma",
        href: "/biz-haqimizda/tuzilma",
        children: [
          { title: "Konsultativ organlar", href: "/biz-haqimizda/tuzilma/konsultativ-organlar" },
          { title: "Rektorat", href: "/biz-haqimizda/tuzilma/rektorat" },
          { title: "Fakultetlar", href: "/biz-haqimizda/tuzilma/fakultetlar" },
          { title: "Kafedralar", href: "/biz-haqimizda/tuzilma/kafedralar" },
          { title: "Xodimlar", href: "/biz-haqimizda/tuzilma/xodimlar" },
          { title: "Filiallar", href: "/biz-haqimizda/tuzilma/filiallar" },
        ],
      },
      { title: "Virtual qabulxona", href: "/biz-haqimizda/virtual-qabulxona" },
      { title: "Murojaatlar tartibi", href: "/biz-haqimizda/murojaatlar-tartibi" },
      {
        title: "Me'yoriy hujjatlar",
        href: "/biz-haqimizda/meyoriy-hujjatlar",
        children: [
          { title: "Qonunlar", href: "/biz-haqimizda/meyoriy-hujjatlar/qonunlar" },
          { title: "Prezident qarorlari", href: "/biz-haqimizda/meyoriy-hujjatlar/prezident-qarorlari" },
          { title: "Vazirlar mahkamasi", href: "/biz-haqimizda/meyoriy-hujjatlar/vazirlar-mahkamasi" },
          { title: "Nizom", href: "/biz-haqimizda/meyoriy-hujjatlar/nizom" },
          { title: "Ichki hujjatlar", href: "/biz-haqimizda/meyoriy-hujjatlar/ichki-hujjatlar" },
          { title: "Ishga qabul", href: "/biz-haqimizda/meyoriy-hujjatlar/ishga-qabul" },
          { title: "E'lonlar", href: "/biz-haqimizda/meyoriy-hujjatlar/elonlar" },
          { title: "Akademik hujjatlar", href: "/biz-haqimizda/meyoriy-hujjatlar/akademik-hujjatlar" },
          { title: "Vazirlik hujjatlari", href: "/biz-haqimizda/meyoriy-hujjatlar/vazirlik-hujjatlari" },
        ],
      },
      { title: "Sifat siyosati", href: "/biz-haqimizda/sifat-siyosati" },
      { title: "Antikorrupsiya", href: "/biz-haqimizda/antikorrupsiya" },
    ],
  },
  {
    title: "Faoliyat",
    href: "/faoliyat",
    children: [
      {
        title: "Ilmiy faoliyat",
        href: "/faoliyat/ilmiy-faoliyat",
        children: [
          { title: "Ilmiy jurnal", href: "/faoliyat/ilmiy-faoliyat/ilmiy-jurnal" },
          { title: "Jurnal nashrlari boshqaruvi", href: "/ilmiy-jurnal-nashrlar" },
          { title: "Tadqiqot", href: "/faoliyat/ilmiy-faoliyat/tadqiqot" },
          { title: "Konferensiyalar", href: "/faoliyat/ilmiy-faoliyat/konferensiyalar" },
          { title: "Ilmiy ishlar va innovatsiyalar", href: "/faoliyat/ilmiy-faoliyat/ilmiy-ishlar-va-innovatsiyalar" },
          {
            title: "Doktorantura",
            href: "/faoliyat/ilmiy-faoliyat/doktorantura",
            children: [
              { title: "Tadqiqotchilar", href: "/faoliyat/ilmiy-faoliyat/doktorantura/tadqiqotchilar" },
              { title: "Imtihon dasturlari", href: "/faoliyat/ilmiy-faoliyat/doktorantura/imtihon-dasturlari" },
              { title: "Imtihon savollari", href: "/faoliyat/ilmiy-faoliyat/doktorantura/imtihon-savollari" },
            ],
          },
          { title: "Iqtidorli talabalar", href: "/faoliyat/ilmiy-faoliyat/iqtidorli-talabalar" },
          { title: "OAK tavsiya nashrlar", href: "/faoliyat/ilmiy-faoliyat/oaq-tavsiya-nashrlar" },
        ],
      },
      { title: "O'quv faoliyati", href: "/faoliyat/oquv-faoliyati" },
      { title: "Xalqaro hamkorlik", href: "/faoliyat/xalqaro-hamkorlik" },
      { title: "Tadqiqod markazi", href: "/faoliyat/tadqiqod-markazi" },
    ],
  },
  {
    title: "Abiturientlarga",
    href: "/abiturientlarga",
    children: [
      {
        title: "Bakalavriat",
        href: "/abiturientlarga/bakalavriat",
        children: [
          { title: "Tibbiyot fakulteti", href: "/abiturientlarga/bakalavriat/fakultet/1" },
          { title: "Farmatsiya fakulteti", href: "/abiturientlarga/bakalavriat/fakultet/2" },
          { title: "Qo'shma ta'lim (PIMU)", href: "/abiturientlarga/bakalavriat/fakultet/5" },
        ],
      },
      {
        title: "Klinik ordinatura",
        href: "/abiturientlarga/ordinatura",
        children: [
          { title: "Klinik tibbiyot fakulteti", href: "/abiturientlarga/ordinatura/fakultet/3" },
        ],
      },
      {
        title: "Magistratura",
        href: "/abiturientlarga/magistratura",
        children: [
          { title: "Ilmiy-tadqiqot fakulteti", href: "/abiturientlarga/magistratura/fakultet/4" },
        ],
      },
      { title: "Barcha yo'nalishlar", href: "/abiturientlarga/yo-nalishlar" },
      { title: "O'qishni ko'chirish va tiklash", href: "/abiturientlarga/oqishni-kochirish-va-tiklash" },
      { title: "Test topshiriladigan fanlar", href: "/abiturientlarga/test-topshiriladigan-fanlar" },
    ],
  },
  {
    title: "Talabalarga",
    href: "/talabalarga",
    children: [
      {
        title: "TdTUTF Karyera Markazi",
        href: "/talabalarga/karyera-markazi",
        children: [
          { title: "TdTUTF Karyera Markazi", href: "/talabalarga/karyera-markazi" },
          { title: "Bo'sh ish o'rinlari", href: "/talabalarga/karyera-markazi/bosh-ish-orinlari" },
          { title: "Ish arizalari", href: "/ish-arizalari" },
          { title: "Markaz ma'lumotlari", href: "/karyera-malumotlari" },
        ],
      },
      {
        title: "Kutubxona",
        href: "/talabalarga/kutubxona",
        children: [
          { title: "Kutubxona", href: "/talabalarga/kutubxona" },
          { title: "E-Library", href: "/talabalarga/kutubxona/e-library" },
          { title: "Emerald", href: "/talabalarga/kutubxona/emerald" },
          { title: "Resurslar boshqaruvi", href: "/kutubxona-resurslari" },
        ],
      },
      { title: "Talaba ishlari", href: "/talabalarga/talaba-ishlari" },
      { title: "Talabalar hayoti rasmlari", href: "/talabalar-hayoti-fotolari" },
    ],
  },
  {
    title: "Yangiliklar",
    href: "/yangiliklar",
    children: [
      { title: "Yangiliklar", href: "/yangiliklar" },
      { title: "Tadbirlar", href: "/yangiliklar/tadbirlar" },
      { title: "Konferensiyalar", href: "/yangiliklar/konferensiyalar" },
      { title: "Ro'yxatlar", href: "/konferensiya-royxatlari" },
    ],
  },
  {
    title: "Sayt elementlari",
    href: "/bannerlar",
    children: [
      { title: "Bannerlar", href: "/bannerlar" },
      { title: "Hamkorlar", href: "/sheriklar" },
      { title: "Testimoniallar", href: "/testimoniallar" },
      { title: "Sayt kontenti", href: "/sayt-kontenti" },
      { title: "Sayt media (rasmlar/video)", href: "/sayt-media" },
    ],
  },
  {
    title: "FAQ",
    href: "/faq",
  },
  {
    title: "Aloqa",
    href: "/aloqa",
  },
];

// ============================================
// Admin-specific quick nav items (for mobile menu)
// ============================================

export interface AdminNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
}

export const adminNavItems: AdminNavItem[] = [
  { label: "Bosh sahifa", href: "/", icon: Home },
  { label: "Yangiliklar", href: "/yangiliklar", icon: Newspaper },
  { label: "Tadbirlar", href: "/yangiliklar/tadbirlar", icon: CalendarDays },
  { label: "Konferensiyalar", href: "/yangiliklar/konferensiyalar", icon: Presentation },
  { label: "Ro'yxatlar", href: "/konferensiya-royxatlari", icon: ClipboardList },
  { label: "Ish arizalari", href: "/ish-arizalari", icon: Briefcase },
  { label: "Kutubxona", href: "/talabalarga/kutubxona", icon: BookOpen },
  { label: "Sahifalar", href: "/sahifalar", icon: FileText },
  { label: "FAQ", href: "/faq", icon: HelpCircle },
  { label: "Tarjimalar", href: "/translations", icon: Languages },
  { label: "Aloqa", href: "/aloqa", icon: Mail },
  // Yangi qo'shilgan CRUD'lar
  { label: "Bannerlar", href: "/bannerlar", icon: ImageIcon },
  { label: "Hamkorlar", href: "/sheriklar", icon: Handshake },
  { label: "Testimoniallar", href: "/testimoniallar", icon: Star },
  { label: "Sayt kontenti", href: "/sayt-kontenti", icon: Type },
  { label: "Yo'nalishlar", href: "/abiturientlarga/yo-nalishlar", icon: GraduationCap },
  { label: "Kutubxona resurslari", href: "/kutubxona-resurslari", icon: Library },
  { label: "Jurnal nashrlari", href: "/ilmiy-jurnal-nashrlar", icon: BookOpenCheck },
  { label: "Karyera ma'lumotlari", href: "/karyera-malumotlari", icon: Briefcase },
  { label: "Talabalar hayoti", href: "/talabalar-hayoti-fotolari", icon: Camera },
  { label: "Sayt media", href: "/sayt-media", icon: FolderArchive },
];

// ============================================
// Footer navigation
// ============================================

export const footerNavigation = {
  tezkorHavolalar: [
    { title: "Biz haqimizda", href: "/biz-haqimizda" },
    { title: "Yangiliklar", href: "/yangiliklar" },
    { title: "FAQ", href: "/faq" },
  ],
  foydaliHavolalar: [
    { title: "Konferensiyalar", href: "/yangiliklar/konferensiyalar" },
  ],
  talimDasturlari: [
    { title: "Bakalavriat", href: "/abiturientlarga/bakalavriat" },
    { title: "Magistratura", href: "/abiturientlarga/magistratura" },
    { title: "Klinik ordinatura", href: "/abiturientlarga/ordinatura" },
  ],
};
