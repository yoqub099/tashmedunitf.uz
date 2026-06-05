"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import { Search, Menu } from "lucide-react";
import { getMainNavigation, type NavItem } from "@/config/navigation";
import { useUIStore } from "@/store/useUIStore";
import { useLanguageStore } from "@/store/useLanguageStore";
import { stripLocale } from "@/lib/locale";
import { s } from "@/lib/i18n";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { useNavigation } from "@/providers/NavigationProvider";
import LanguageSwitcher from "./LanguageSwitcher";
import MobileMenu from "./MobileMenu";
import AccessibilityHeaderButton from "@/components/a11y/AccessibilityHeaderButton";
import type { Language } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const NAV_GLOW = "0 0 4px rgba(255,255,255,0.5), 0 0 10px rgba(255,255,255,0.2)";
const NAV_GLOW_ACTIVE = "0 0 6px rgba(255,255,255,0.6), 0 0 14px rgba(255,255,255,0.3)";

/* ============================================
   Accessible Dropdown Nav Item
   - Link for navigation (click â†’ navigate)
   - Hover/Focus â†’ open dropdown
   - Escape â†’ close dropdown
   - aria-expanded, role="menu" for screen readers
   ============================================ */
function DropdownNavItem({ item, isBlue, pathname }: { item: NavItem; isBlue: boolean; pathname: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const itemPath = stripLocale(item.href);
  const isActive = pathname === itemPath || pathname.startsWith(itemPath + "/");

  const openMenu = useCallback(() => {
    clearTimeout(timeoutRef.current!);
    setOpen(true);
  }, []);

  const closeMenu = useCallback(() => {
    timeoutRef.current = setTimeout(() => setOpen(false), 150);
  }, []);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!item.children) {
    return (
      <Link
        href={item.href}
        style={isBlue ? { textShadow: isActive ? NAV_GLOW_ACTIVE : NAV_GLOW } : undefined}
        className={cn(
          "px-4 py-2 text-sm font-medium whitespace-nowrap transition-all duration-200 rounded-lg",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400",
          isBlue
            ? isActive ? "text-white font-extrabold" : "text-white hover:text-white hover:bg-white/10"
            : isActive ? "text-blue-700 font-bold" : "text-gray-700 hover:text-gray-900 hover:bg-gray-100/60"
        )}
      >
        {item.title}
      </Link>
    );
  }

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={openMenu}
      onMouseLeave={closeMenu}
      onKeyDown={(e) => { if (e.key === "Escape") setOpen(false); }}
    >
      {/* Main link â€" click navigates, hover/focus opens dropdown */}
      <Link
        href={item.href}
        onFocus={openMenu}
        aria-expanded={open}
        aria-haspopup="true"
        style={isBlue ? { textShadow: isActive ? NAV_GLOW_ACTIVE : NAV_GLOW } : undefined}
        className={cn(
          "px-4 py-2 text-sm font-medium whitespace-nowrap transition-all duration-200 rounded-lg",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400",
          isBlue
            ? isActive ? "text-white font-extrabold" : "text-white hover:text-white hover:bg-white/10"
            : isActive ? "text-blue-700 font-bold" : "text-gray-700 hover:text-gray-900 hover:bg-gray-100/60"
        )}
      >
        {item.title}
      </Link>

      {/* Dropdown */}
      <div
        className={cn(
          "absolute left-0 top-full pt-2 z-500 transition-all duration-200",
          open ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-1 pointer-events-none"
        )}
      >
        <div className="rounded-2xl bg-white p-2 shadow-2xl min-w-max" role="menu" aria-label={item.title}>
          {item.children.map((child) => (
            <SubMenuItem key={child.href} item={child} onClose={() => setOpen(false)} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================
   Sub Menu Item (supports nested dropdowns)
   ============================================ */
function SubMenuItem({ item, onClose }: { item: NavItem; onClose: () => void }) {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openMenu = useCallback(() => {
    clearTimeout(timeoutRef.current!);
    setOpen(true);
  }, []);

  const closeMenu = useCallback(() => {
    timeoutRef.current = setTimeout(() => setOpen(false), 150);
  }, []);

  if (!item.children) {
    const linkClass = "flex items-center justify-between rounded-lg px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors text-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 focus-visible:bg-blue-50";
    if (item.external) {
      return (
        <a
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          role="menuitem"
          onClick={onClose}
          className={linkClass}
        >
          {item.title}
        </a>
      );
    }
    return (
      <Link
        href={item.href}
        role="menuitem"
        onClick={onClose}
        className={linkClass}
      >
        {item.title}
      </Link>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={openMenu}
      onMouseLeave={closeMenu}
      onKeyDown={(e) => { if (e.key === "Escape") setOpen(false); }}
    >
      <Link
        href={item.href}
        role="menuitem"
        aria-expanded={open}
        aria-haspopup="true"
        onFocus={openMenu}
        className="flex w-full items-center justify-between rounded-lg px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors text-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 focus-visible:bg-blue-50"
      >
        {item.title}
        <span className="ml-4 text-gray-400">&gt;</span>
      </Link>

      {/* Sub-dropdown */}
      <div
        className={cn(
          "absolute left-full top-0 pl-2 z-500 transition-all duration-200",
          open ? "opacity-100 visible translate-x-0" : "opacity-0 invisible -translate-x-1 pointer-events-none"
        )}
      >
        <div className="rounded-2xl bg-white p-2 shadow-2xl min-w-max" role="menu" aria-label={item.title}>
          {item.children.map((child) => (
            <SubSubMenuItem key={child.href} item={child} onClose={onClose} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================
   Sub-Sub Menu Item (3rd level)
   ============================================ */
function SubSubMenuItem({ item, onClose }: { item: NavItem; onClose: () => void }) {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openMenu = useCallback(() => {
    clearTimeout(timeoutRef.current!);
    setOpen(true);
  }, []);

  const closeMenu = useCallback(() => {
    timeoutRef.current = setTimeout(() => setOpen(false), 150);
  }, []);

  if (!item.children) {
    const linkClass = "block rounded-lg px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors text-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 focus-visible:bg-blue-50";
    if (item.external) {
      return (
        <a
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          role="menuitem"
          onClick={onClose}
          className={linkClass}
        >
          {item.title}
        </a>
      );
    }
    return (
      <Link
        href={item.href}
        role="menuitem"
        onClick={onClose}
        className={linkClass}
      >
        {item.title}
      </Link>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={openMenu}
      onMouseLeave={closeMenu}
      onKeyDown={(e) => { if (e.key === "Escape") setOpen(false); }}
    >
      <Link
        href={item.href}
        role="menuitem"
        aria-expanded={open}
        aria-haspopup="true"
        onFocus={openMenu}
        className="flex w-full items-center justify-between rounded-lg px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-700 transition-colors text-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 focus-visible:bg-blue-50"
      >
        {item.title}
        <span className="ml-4 text-gray-400">&gt;</span>
      </Link>

      <div
        className={cn(
          "absolute left-full top-0 pl-2 z-500 transition-all duration-200",
          open ? "opacity-100 visible translate-x-0" : "opacity-0 invisible -translate-x-1 pointer-events-none"
        )}
      >
        <div className="rounded-2xl bg-white p-2 shadow-2xl min-w-max" role="menu" aria-label={item.title}>
          {item.children.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              role="menuitem"
              onClick={onClose}
              className="block rounded-lg px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors text-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 focus-visible:bg-blue-50"
            >
              {child.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================
   Nav Links wrapper
   ============================================ */
function NavLinks({ isBlue, serverLang }: { isBlue: boolean; serverLang?: string }) {
  const rawPathname = usePathname();
  const pathname = stripLocale(rawPathname);
  const { language, hydrated } = useLanguageStore();
  // Use server-provided lang for initial render to prevent hydration mismatch
  const lang = hydrated ? language : (serverLang || language);
  const dynamicNav = useNavigation();
  const navigation = getMainNavigation(lang as "uz" | "ru" | "en", dynamicNav.length > 0 ? dynamicNav : undefined);
  return (
    <>
      {navigation.map((item) => (
        <DropdownNavItem key={item.href} item={item} isBlue={isBlue} pathname={pathname} />
      ))}
    </>
  );
}

/* ============================================
   Main Header Component
   ============================================ */
export default function Header({ serverLang }: { serverLang?: string }) {
  const { toggleMobileMenu, toggleSearchModal } = useUIStore();
  const { language, syncFromPathname, hydrated } = useLanguageStore();
  // Use server-provided lang until client hydration completes
  const lang = hydrated ? language : (serverLang || language);
  const { scrollDirection, scrollY } = useScrollDirection();
  const rawPathname = usePathname();
  const pathname = stripLocale(rawPathname);

  // Keep language store in sync when URL changes externally (back/forward, direct links)
  useEffect(() => {
    syncFromPathname(rawPathname);
  }, [rawPathname, syncFromPathname]);
  const [isPastHero, setIsPastHero] = useState(false);

  const isHome = pathname === "/" || pathname === "";
  const isJournal = pathname.startsWith("/faoliyat/ilmiy-faoliyat/ilmiy-jurnal");
  const isScrolled = scrollY > 50;

  // Real-time hero detection: check hero bottom vs viewport on every scroll
  useEffect(() => {
    if (!isHome) { setIsPastHero(false); return; }

    let heroEl: HTMLElement | null = null;

    const check = () => {
      if (!heroEl) heroEl = document.getElementById("hero-section");
      if (!heroEl) return;
      // Hero bottom relative to viewport â€" when it goes above ~80px (navbar height), we're past it
      setIsPastHero(heroEl.getBoundingClientRect().bottom <= 80);
    };

    window.addEventListener("scroll", check, { passive: true });
    // Run once after mount (handles refresh-with-scroll and SSR hydration)
    check();
    const t = setTimeout(check, 200);

    return () => {
      window.removeEventListener("scroll", check);
      clearTimeout(t);
    };
  }, [isHome]);

  const isBlue = isHome && !isPastHero;

  // Hide header on journal pages (journal has its own navbar)
  if (isJournal) return null;

  const bgClass = isHome
    ? isPastHero
      ? "bg-white shadow-md border-b border-gray-100"
      : isScrolled
        ? "bg-[#00575B]/90 backdrop-blur-xl shadow-lg"
        : "bg-gradient-to-b from-black/30 to-transparent"
    : isScrolled
      ? "bg-white shadow-md border-b border-gray-100"
      : "bg-white border-b border-gray-100";

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
          bgClass,
          scrollDirection === "down" && scrollY > 300 && "-translate-y-full"
        )}
      >
        <div className="mx-auto max-w-350 px-4 sm:px-6 lg:px-8">
          {/* â"€â"€ Row 1: Logo + (xl: centered nav) + right â"€â"€ */}
          <div className="relative flex items-center py-3">
            {/* navbar-start: logo */}
            <div className="flex shrink-0 items-center">
              <Link href={`/${lang}`} className="flex items-center">
                <Image
                  src="/icon-192.webp"
                  alt="TdTUTF"
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full"
                  priority
                />
              </Link>
            </div>

            {/* navbar-center: desktop nav (xl+) */}
            <nav className="hidden lg:flex flex-1 items-center justify-center">
              <NavLinks isBlue={isBlue} serverLang={serverLang} />

              {/* Separator */}
              <div className={cn("mr-6 h-3 w-px", isBlue ? "bg-white" : "bg-gray-300")} />

              {/* Language switcher inline at xl */}
              <LanguageSwitcher variant={isBlue ? "light" : "dark"} />
            </nav>

            {/* navbar-end: a11y + search + hamburger */}
            <div className="ml-auto flex shrink-0 items-center gap-2">
              <AccessibilityHeaderButton
                serverLang={(serverLang as Language) || "uz"}
                variant={isBlue ? "light" : "dark"}
              />

              <button
                onClick={toggleSearchModal}
                className={cn(
                  "rounded-full p-2 transition-all hover:opacity-80",
                  isBlue ? "bg-white/15" : "bg-gray-100 hover:bg-gray-200"
                )}
                aria-label={s("common.search", language)}
              >
                <Search className={cn("h-5 w-5", isBlue ? "text-white" : "text-gray-600")} />
              </button>

              <button
                onClick={toggleMobileMenu}
                className={cn(
                  "rounded-full p-2 lg:hidden transition-all hover:opacity-80",
                  isBlue ? "bg-white/15" : "bg-gray-100 hover:bg-gray-200"
                )}
                aria-label="Menu"
              >
                <Menu className={cn("h-5 w-5", isBlue ? "text-white" : "text-gray-600")} />
              </button>
            </div>
          </div>


        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu />
    </>
  );
}
