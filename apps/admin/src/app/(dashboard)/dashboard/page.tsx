"use client";

import Link from "next/link";
import {
  ChevronRight,
  Newspaper,
  GraduationCap,
  Building2,
  Users,
  BookOpen,
  Database,
  HelpCircle,
  Image as ImageIcon,
  Handshake,
  Star,
  MapPin,
  MessageSquare,
  Briefcase,
  CalendarCheck,
  Languages,
  FileText,
  Type,
} from "lucide-react";
import Container from "@/components/shared/Container";
import SectionTitle from "@/components/shared/SectionTitle";
import Card from "@/components/shared/Card";
import { cn } from "@/lib/utils";
import { useNews } from "@/hooks/useNews";
import { useBanners } from "@/hooks/useBanners";
import { usePartners } from "@/hooks/usePartners";
import { useTestimonials } from "@/hooks/useTestimonials";
import { useFaculties } from "@/hooks/useFaculties";
import { useFaqs } from "@/hooks/useFaqs";
import { useDepartments } from "@/hooks/useDepartments";
import { useStaff } from "@/hooks/useStaff";
import { usePages } from "@/hooks/usePages";
import { useDirections } from "@/hooks/useDirections";
import { useContactLocations } from "@/hooks/useContactLocations";
import { useUnreadCount } from "@/hooks/useContacts";
import { useJobAppUnreadCount } from "@/hooks/useJobApplications";
import { useConferenceUnreadCount } from "@/hooks/useConferenceRegistrations";

interface HubItem {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  color: string;
  badge?: number;
}

const colorClasses: Record<string, string> = {
  blue: "bg-blue-50 text-blue-600",
  green: "bg-green-50 text-green-600",
  purple: "bg-purple-50 text-purple-600",
  orange: "bg-orange-50 text-orange-600",
  red: "bg-red-50 text-red-600",
  teal: "bg-teal-50 text-teal-600",
  indigo: "bg-indigo-50 text-indigo-600",
  pink: "bg-pink-50 text-pink-600",
  yellow: "bg-yellow-50 text-yellow-600",
  cyan: "bg-cyan-50 text-cyan-600",
  amber: "bg-amber-50 text-amber-600",
  emerald: "bg-emerald-50 text-emerald-600",
  rose: "bg-rose-50 text-rose-600",
  violet: "bg-violet-50 text-violet-600",
  slate: "bg-slate-50 text-slate-600",
};

function HubCard({ item }: { item: HubItem }) {
  const colorClass = colorClasses[item.color] || colorClasses.blue;
  return (
    <Link href={item.href}>
      <Card className="group hover:shadow-md hover:border-blue-200 transition-all duration-200 cursor-pointer h-full">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className={cn("w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0", colorClass)}>
            {item.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-semibold text-sm sm:text-base text-gray-900 group-hover:text-blue-700 transition-colors">
                {item.title}
              </h3>
              <div className="flex items-center gap-2 shrink-0">
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-full bg-red-500 text-white text-xs font-bold">
                    {item.badge}
                  </span>
                )}
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.description}</p>
          </div>
        </div>
      </Card>
    </Link>
  );
}

function countOf(d: unknown): number {
  const obj = d as { meta?: { total?: number }; data?: unknown[] } | undefined;
  if (!obj) return 0;
  if (obj.meta?.total != null) return obj.meta.total;
  if (Array.isArray(obj.data)) return obj.data.length;
  if (Array.isArray(d)) return (d as unknown[]).length;
  return 0;
}

export default function DashboardPage() {
  const { data: news } = useNews({ per_page: 1 });
  const { data: banners } = useBanners();
  const { data: partners } = usePartners({ per_page: 1 });
  const { data: testimonials } = useTestimonials();
  const { data: faculties } = useFaculties({ per_page: 1 });
  const { data: faqs } = useFaqs();
  const { data: departments } = useDepartments({ per_page: 1 });
  const { data: staff } = useStaff({ per_page: 1 });
  const { data: pages } = usePages({ per_page: 1 });
  const { data: directions } = useDirections({ per_page: 1 });
  const { data: contactLocations } = useContactLocations();

  const { data: contactUnread } = useUnreadCount();
  const { data: jobAppUnread } = useJobAppUnreadCount();
  const { data: conferenceUnread } = useConferenceUnreadCount();

  // ═══ Kontent bo'limi ═══
  const contentItems: HubItem[] = [
    {
      title: "Yangiliklar",
      description: `${countOf(news)} ta yangilik — news, tadbirlar, konferensiyalar`,
      href: "/yangiliklar",
      icon: <Newspaper className="w-5 h-5 sm:w-6 sm:h-6" />,
      color: "blue",
    },
    {
      title: "Sahifalar",
      description: `${countOf(pages)} ta sahifa — ierarxik tree boshqaruvi`,
      href: "/sahifalar",
      icon: <Database className="w-5 h-5 sm:w-6 sm:h-6" />,
      color: "amber",
    },
    {
      title: "FAQ",
      description: `${countOf(faqs)} ta savol-javob`,
      href: "/faq",
      icon: <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6" />,
      color: "pink",
    },
    {
      title: "Tarjimalar",
      description: "UI matnlarini uz/ru/en tilida tahrirlash",
      href: "/translations",
      icon: <Languages className="w-5 h-5 sm:w-6 sm:h-6" />,
      color: "indigo",
    },
    {
      title: "Tadbirlar",
      description: "Tadbirlar va eventlarni boshqarish",
      href: "/tadbirlar",
      icon: <CalendarCheck className="w-5 h-5 sm:w-6 sm:h-6" />,
      color: "green",
    },
    {
      title: "Konferensiyalar",
      description: "Konferensiyalar ro'yxati",
      href: "/konferensiyalar",
      icon: <FileText className="w-5 h-5 sm:w-6 sm:h-6" />,
      color: "violet",
    },
  ];

  // ═══ Tashkiliy tuzilma ═══
  const structureItems: HubItem[] = [
    {
      title: "Fakultetlar",
      description: `${countOf(faculties)} ta fakultet`,
      href: "/biz-haqimizda/tuzilma/fakultetlar",
      icon: <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6" />,
      color: "purple",
    },
    {
      title: "Kafedralar",
      description: `${countOf(departments)} ta kafedra`,
      href: "/biz-haqimizda/tuzilma/kafedralar",
      icon: <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />,
      color: "teal",
    },
    {
      title: "Xodimlar",
      description: `${countOf(staff)} ta xodim`,
      href: "/biz-haqimizda/tuzilma/xodimlar",
      icon: <Users className="w-5 h-5 sm:w-6 sm:h-6" />,
      color: "cyan",
    },
    {
      title: "Yo'nalishlar",
      description: `${countOf(directions)} ta ta'lim yo'nalishi`,
      href: "/abiturientlarga/bakalavriat",
      icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />,
      color: "emerald",
    },
  ];

  // ═══ Sayt elementlari ═══
  const siteItems: HubItem[] = [
    {
      title: "Bannerlar",
      description: `${countOf(banners)} ta bosh sahifa banneri`,
      href: "/bannerlar",
      icon: <ImageIcon className="w-5 h-5 sm:w-6 sm:h-6" />,
      color: "rose",
    },
    {
      title: "Sheriklar",
      description: `${countOf(partners)} ta hamkor tashkilot`,
      href: "/sheriklar",
      icon: <Handshake className="w-5 h-5 sm:w-6 sm:h-6" />,
      color: "indigo",
    },
    {
      title: "Testimoniallar",
      description: `${countOf(testimonials)} ta talaba fikri`,
      href: "/testimoniallar",
      icon: <Star className="w-5 h-5 sm:w-6 sm:h-6" />,
      color: "yellow",
    },
    {
      title: "Sayt kontenti",
      description: "Bosh sahifa matnlari va HTML bloklari",
      href: "/sayt-kontenti",
      icon: <Type className="w-5 h-5 sm:w-6 sm:h-6" />,
      color: "purple",
    },
    {
      title: "Joylashuvlar",
      description: `${countOf(contactLocations)} ta aloqa joylashuvi`,
      href: "/aloqa",
      icon: <MapPin className="w-5 h-5 sm:w-6 sm:h-6" />,
      color: "red",
    },
  ];

  // ═══ Xabarlar / arizalar ═══
  const inboxItems: HubItem[] = [
    {
      title: "Aloqa xabarlari",
      description: (contactUnread || 0) > 0 ? `${contactUnread} ta yangi xabar bor` : "Barcha xabarlar o'qilgan",
      href: "/aloqa",
      icon: <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />,
      color: "orange",
      badge: contactUnread || 0,
    },
    {
      title: "Ish arizalari",
      description: (jobAppUnread || 0) > 0 ? `${jobAppUnread} ta yangi ariza` : "Barcha arizalar ko'rilgan",
      href: "/ish-arizalari",
      icon: <Briefcase className="w-5 h-5 sm:w-6 sm:h-6" />,
      color: "purple",
      badge: jobAppUnread || 0,
    },
    {
      title: "Konferensiya ro'yxatlari",
      description: (conferenceUnread || 0) > 0 ? `${conferenceUnread} ta yangi ro'yxat` : "Barcha ro'yxatlar ko'rilgan",
      href: "/konferensiya-royxatlari",
      icon: <CalendarCheck className="w-5 h-5 sm:w-6 sm:h-6" />,
      color: "blue",
      badge: conferenceUnread || 0,
    },
  ];

  return (
    <>
      {/* Kontent */}
      <section className="py-10 sm:py-16">
        <Container>
          <SectionTitle title="Dashboard" subtitle="Admin boshqaruv paneli — barcha bo'limlar" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {contentItems.map((item) => (
              <HubCard key={item.href + item.title} item={item} />
            ))}
          </div>
        </Container>
      </section>

      {/* Xabarlar / Inbox */}
      <section className="pb-10 sm:pb-16">
        <Container>
          <SectionTitle title="Kiruvchi xabarlar" subtitle="Yangi arizalar va murojaatlar" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {inboxItems.map((item) => (
              <HubCard key={item.href + item.title} item={item} />
            ))}
          </div>
        </Container>
      </section>

      {/* Tashkiliy tuzilma */}
      <section className="pb-10 sm:pb-16">
        <Container>
          <SectionTitle title="Tashkiliy tuzilma" subtitle="Fakultetlar, kafedralar, xodimlar" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {structureItems.map((item) => (
              <HubCard key={item.href + item.title} item={item} />
            ))}
          </div>
        </Container>
      </section>

      {/* Sayt elementlari */}
      <section className="pb-10 sm:pb-16">
        <Container>
          <SectionTitle title="Sayt elementlari" subtitle="Bannerlar, sheriklar, testimoniallar" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {siteItems.map((item) => (
              <HubCard key={item.href + item.title} item={item} />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
