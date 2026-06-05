"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const BASE = "/faoliyat/ilmiy-faoliyat/ilmiy-jurnal";

const journalNavItems = [
  { label: "Bosh sahifa", href: BASE },
  { label: "Jurnal haqida", href: `${BASE}/jurnal-haqida` },
  { label: "Nashrlar", href: `${BASE}/nashrlar` },
  { label: "Yo'riqnoma", href: `${BASE}/yoriqnoma` },
  { label: "Bog'lanish", href: `${BASE}/boglanish` },
];

export default function AdminJournalNavbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur shadow-sm">
        <div className="mx-auto max-w-350 px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Brand / Logo */}
            <Link
              href={BASE}
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
                Ilmiy jurnal
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-6 flex-1 justify-end">
              <div className="flex items-center gap-6">
                {journalNavItems.map((item) => {
                  const isActive =
                    item.href === BASE
                      ? pathname === BASE
                      : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
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

              {/* Back to admin */}
              <Link
                href="/"
                className="inline-flex items-center justify-center font-semibold px-5 py-2.5 text-sm leading-5 gap-2 bg-[#00575B] text-white shadow-md shadow-[#00575B]/20 hover:bg-[#004548] transition-all active:scale-[0.98] whitespace-nowrap"
                style={{ borderRadius: 12 }}
              >
                Admin panel
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2"
              aria-label="Menu"
            >
              {mobileOpen ? (
                <X className="h-6 w-6 text-gray-700" />
              ) : (
                <Menu className="h-6 w-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-x-0 top-16 z-40 bg-white border-b border-gray-200 shadow-lg">
          <div className="mx-auto max-w-350 px-4 sm:px-6 lg:px-8">
            <div className="py-4 space-y-1">
              {journalNavItems.map((item) => {
                const isActive = pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
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
                  href="/"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg px-4 py-2.5 text-sm font-medium text-[#00575B] hover:bg-gray-50"
                >
                  ← Admin panelga qaytish
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
