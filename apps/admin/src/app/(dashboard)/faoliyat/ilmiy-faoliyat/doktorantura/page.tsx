"use client";

import Link from "next/link";
import StaticPageAdmin from "@/components/templates/StaticPageAdmin";
import { ChevronRight } from "lucide-react";

function AdminNavCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group flex min-h-[10rem] flex-col justify-between rounded-2xl bg-gray-100 p-4 md:p-6 lg:rounded-3xl transition-shadow hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00575B]"
    >
      <div>
        <h3 className="font-serif text-lg font-semibold text-gray-900 group-hover:text-[#00575B] transition-colors">
          {title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-gray-700 line-clamp-3">
          {description}
        </p>
      </div>
      <div className="mt-4 flex items-center justify-end">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#00575B] text-[#00575B] transition-colors group-hover:bg-[#00575B] group-hover:text-white">
          <ChevronRight className="w-5 h-5" />
        </span>
      </div>
    </Link>
  );
}

export default function DoktoranturaPage() {
  return (
    <StaticPageAdmin
      slug="doktorantura"
      title="Doktorantura"
      description="Doktorantura bo'limi boshqaruvi"
      breadcrumbItems={[
        { label: "Faoliyat", href: "/faoliyat" },
        { label: "Ilmiy faoliyat", href: "/faoliyat/ilmiy-faoliyat" },
        { label: "Doktorantura" },
      ]}
    >
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <AdminNavCard
          title="Tadqiqotchilar"
          description="Doktorantura va mustaqil tadqiqotchilar ro'yxati"
          href="/faoliyat/ilmiy-faoliyat/doktorantura/tadqiqotchilar"
        />
        <AdminNavCard
          title="Imtihon dasturlari"
          description="Doktoranturaga kirish imtihon dasturlari"
          href="/faoliyat/ilmiy-faoliyat/doktorantura/imtihon-dasturlari"
        />
        <AdminNavCard
          title="Imtihon savollari"
          description="Doktorantura imtihon savollari to'plami"
          href="/faoliyat/ilmiy-faoliyat/doktorantura/imtihon-savollari"
        />
      </div>
    </StaticPageAdmin>
  );
}
