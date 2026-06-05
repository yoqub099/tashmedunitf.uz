"use client";

import Link from "@/components/shared/LocaleLink";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Search, Menu, X } from "lucide-react";
import { useState } from "react";
import Container from "@/components/shared/Container";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
import { useUIStore } from "@/store/useUIStore";
import { stripLocale, localePath, type Locale } from "@/lib/locale";
import { cn } from "@/lib/utils";
import { s } from "@/lib/i18n";
import { useLanguageStore } from "@/store/useLanguageStore";

const BASE = "/faoliyat/ilmiy-faoliyat/ilmiy-jurnal";

export default function JournalNavbar() {
  const rawPathname = usePathname();
  const pathname = stripLocale(rawPathname);
  const { toggleSearchModal } = useUIStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { language } = useLanguageStore();

  /** Prefix a bare path with the current locale */
  const lp = (path: string) => localePath(path, language as Locale);

  const journalNavItems = [
    { label: s("journal.home", language), href: lp(BASE), path: BASE },
    { label: s("journal.about", language), href: lp(`${BASE}/jurnal-haqida`), path: `${BASE}/jurnal-haqida` },
    { label: s("journal.issues", language), href: lp(`${BASE}/nashrlar`), path: `${BASE}/nashrlar` },
    { label: s("journal.guidelines", language), href: lp(`${BASE}/yoriqnoma`), path: `${BASE}/yoriqnoma` },
    { label: s("journal.contact", language), href: lp(`${BASE}/boglanish`), path: `${BASE}/boglanish` },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur shadow-sm">
        <Container>
          <div className="flex h-16 items-center justify-between">
            {/* Brand / Logo */}
            <Link
              href={lp(BASE)}
              className="flex items-center gap-2 shrink-0"
            >
              <Image
                src="/icon-192.webp"
                alt="TdTUTF"
                width={36}
                height={36}
                className="h-9 w-9 rounded-full"
              />
              <span className="font-serif text-xl font-extrabold text-[#00575B] leading-10 select-none hidden sm:inline">
                {s("journal.title", language)}
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-6 flex-1 justify-end">
              <div className="flex items-center gap-6">
                {journalNavItems.map((item) => {
                  const isActive =
                    item.path === BASE
                      ? pathname === BASE
                      : pathname.startsWith(item.path);

                  return (
                    <Link
                      key={item.path}
                      href={item.href}
                      className={cn(
                        "text-sm font-medium transition-colors hover:text-slate-900 whitespace-nowrap",
                        isActive ? "text-[#00575B]" : "text-gray-700"
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>

              {/* Search */}
              <button
                onClick={toggleSearchModal}
                className="p-2 rounded-full hover:bg-slate-100"
                aria-label={s("common.search", language)}
              >
                <Search className="h-5 w-5 text-gray-700" />
              </button>

              {/* Language */}
              <LanguageSwitcher variant="dark" />

              {/* Back to main site */}
              <Link
                href={lp("/")}
                className="inline-flex items-center justify-center font-semibold px-5 py-2.5 text-sm leading-5 gap-2 bg-[#00575B] text-white shadow-md shadow-[#00575B]/20 hover:bg-[#004548] transition-all active:scale-[0.98] whitespace-nowrap"
                style={{ borderRadius: 12 }}
              >
                {s("journal.main_site", language)}
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2"
              aria-label={s("common.menu", language)}
            >
              {mobileOpen ? (
                <X className="h-6 w-6 text-gray-700" />
              ) : (
                <Menu className="h-6 w-6 text-gray-700" />
              )}
            </button>
          </div>
        </Container>
      </nav>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-x-0 top-16 z-40 bg-white border-b border-gray-200 shadow-lg">
          <Container>
            <div className="py-4 space-y-1">
              {journalNavItems.map((item) => {
                const isActive =
                  item.path === BASE
                    ? pathname === BASE
                    : pathname.startsWith(item.path);

                return (
                  <Link
                    key={item.path}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "block rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-[#00575B]/10 text-[#00575B]"
                        : "text-gray-700 hover:bg-gray-50"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <div className="border-t border-gray-100 pt-3 mt-3">
                <Link
                  href={lp("/")}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg px-4 py-2.5 text-sm font-medium text-[#00575B] hover:bg-gray-50"
                >
                  &larr; {s("journal.back_to_site", language)}
                </Link>
              </div>
            </div>
          </Container>
        </div>
      )}
    </>
  );
}
