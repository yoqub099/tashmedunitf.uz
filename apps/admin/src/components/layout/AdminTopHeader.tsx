"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  Menu,
  LogOut,
  ChevronDown,
  BarChart3,
  Bell,
  Plus,
  FileText,
  Languages,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { mainNavigation, adminNavItems, type NavItem } from "@/config/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { usePageTree } from "@/hooks/usePages";
import { useUIStore } from "@/store/useUIStore";
import { useLogout } from "@/hooks/useAuth";
import { useUnreadCount } from "@/hooks/useContacts";
import { useConferenceUnreadCount } from "@/hooks/useConferenceRegistrations";
import { useJobAppUnreadCount } from "@/hooks/useJobApplications";
import { useStudentWorkUnreadCount } from "@/hooks/useStudentWorks";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import Avatar from "@/components/shared/Avatar";
import AdminMobileMenu from "./AdminMobileMenu";
import AccessibilityHeaderButton from "@/components/a11y/AccessibilityHeaderButton";
import AddPageGuardedButton from "@/components/shared/AddPageGuardedButton";

/* ============================================
   Reusable nav links for xl inline & lg second row
   ============================================ */
/** Collect ALL href paths AND their last segments from a NavItem tree */
function collectAllHrefs(items: NavItem[]): Set<string> {
  const set = new Set<string>();
  const walk = (list: NavItem[]) => {
    for (const item of list) {
      // Add full href path
      set.add(item.href.replace(/\/$/, ""));
      // Add last segment (slug)
      const last = item.href.replace(/\/$/, "").split("/").pop() || "";
      if (last) set.add(last);
      if (item.children) walk(item.children);
    }
  };
  walk(items);
  return set;
}

/** Convert DB page to NavItem recursively */
function dbToNav(page: any): NavItem {
  return {
    title: typeof page.title === "object" ? page.title?.uz || page.slug : page.title,
    href: `/${page.slug}`,
    children: page.children?.filter((c: any) => c.is_nav_item && c.is_published).length
      ? page.children.filter((c: any) => c.is_nav_item && c.is_published).map(dbToNav)
      : undefined,
  };
}

/** Merge: keep static nav + add new DB items (children AND new root items) */
function mergeNavWithDb(staticNav: NavItem[], dbTree: any[]): NavItem[] {
  const knownSlugs = collectAllHrefs(staticNav);

  // 1. Merge existing static items with their new DB children
  const merged = staticNav.map((sItem) => {
    const sSlug = sItem.href.replace(/\/$/, "").split("/").pop() || "";
    const dbMatch = (dbTree as any[]).find((d) => d.slug === sSlug && d.is_nav_item);
    if (!dbMatch?.children?.length) return sItem;

    // New children from DB
    const newFromDb: NavItem[] = [];
    for (const dc of dbMatch.children) {
      if (!dc.is_nav_item || !dc.is_published) continue;
      if (knownSlugs.has(dc.slug)) continue;
      newFromDb.push(dbToNav(dc));
    }

    // Recursively merge existing static children
    const mergedChildren = (sItem.children || []).map((sc) => {
      const scSlug = sc.href.replace(/\/$/, "").split("/").pop() || "";
      const dbChild = dbMatch.children.find((dc: any) => dc.slug === scSlug);
      if (!dbChild?.children?.length) return sc;

      const newGrandchildren: NavItem[] = [];
      for (const gc of dbChild.children) {
        if (!gc.is_nav_item || !gc.is_published) continue;
        if (knownSlugs.has(gc.slug)) continue;
        newGrandchildren.push(dbToNav(gc));
      }
      return newGrandchildren.length
        ? { ...sc, children: [...(sc.children || []), ...newGrandchildren] }
        : sc;
    });

    return newFromDb.length
      ? { ...sItem, children: [...mergedChildren, ...newFromDb] }
      : { ...sItem, children: mergedChildren };
  });

  // 2. Add NEW root items from DB that don't exist in static nav
  const newRoots: NavItem[] = [];
  for (const dbItem of dbTree) {
    if (!dbItem.is_nav_item || !dbItem.is_published || dbItem.parent_id) continue;
    if (knownSlugs.has(dbItem.slug)) continue;
    newRoots.push(dbToNav(dbItem));
  }

  return [...merged, ...newRoots];
}

function NavLinks({
  isBlue,
  pathname,
  confUnread,
  jobAppUnread,
  studentWorkUnread,
}: {
  isBlue: boolean;
  pathname: string;
  confUnread?: number;
  jobAppUnread?: number;
  studentWorkUnread?: number;
}) {
  // Load dynamic pages from DB and merge with static nav
  const { data: dbTree } = usePageTree();
  const mergedNav = dbTree?.length ? mergeNavWithDb(mainNavigation, dbTree) : mainNavigation;

  // Inject badge into nav items
  const nav = mergedNav.map((item) => {
    // Yangiliklar > Ro'yxatlar â€” conference unread badge
    if (item.href === "/yangiliklar" && item.children && confUnread && confUnread > 0) {
      return {
        ...item,
        children: item.children.map((child) =>
          child.href === "/konferensiya-royxatlari" ? { ...child, badge: confUnread } : child
        ),
      };
    }
    // Talabalarga â€” job app + student works unread badges
    if (item.href === "/talabalarga" && item.children) {
      return {
        ...item,
        children: item.children.map((child) => {
          // Karyera Markazi > Ish arizalari
          if (child.href === "/talabalarga/karyera-markazi" && child.children && jobAppUnread && jobAppUnread > 0) {
            return {
              ...child,
              children: child.children.map((grandchild) =>
                grandchild.href === "/ish-arizalari" ? { ...grandchild, badge: jobAppUnread } : grandchild
              ),
            };
          }
          // Talaba ishlari
          if (child.href === "/talabalarga/talaba-ishlari" && studentWorkUnread && studentWorkUnread > 0) {
            return { ...child, badge: studentWorkUnread };
          }
          return child;
        }),
      };
    }
    return item;
  });

  return (
    <>
      {nav.map((item) => (
        <DropdownNavItem
          key={item.href}
          item={item}
          pathname={pathname}
          isBlue={isBlue}
        />
      ))}

      {/* Separator */}
      <div className={cn("mr-6 h-3 w-px", isBlue ? "bg-white" : "bg-gray-300")} />

      {/* Dashboard link */}
      <Link
        href="/dashboard"
        className={cn(
          "flex items-center gap-1.5 px-4 py-2 text-sm font-medium whitespace-nowrap transition-all duration-200 rounded-lg",
          pathname === "/dashboard"
            ? isBlue
              ? "text-white font-extrabold"
              : "text-blue-700 font-bold"
            : isBlue
              ? "text-white hover:text-white hover:bg-white/10"
              : "text-gray-700 hover:text-gray-900 hover:bg-gray-100/60"
        )}
      >
        <BarChart3 className="w-4 h-4" />
        Dashboard
      </Link>
    </>
  );
}

/* ============================================
   Main Admin Header Component
   ============================================ */
export default function AdminTopHeader() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const { toggleMobileMenu, closeMobileMenu } = useUIStore();
  const logoutMutation = useLogout();
  const { data: unreadCount } = useUnreadCount();
  const { data: confUnread } = useConferenceUnreadCount();
  const { data: jobAppUnread } = useJobAppUnreadCount();
  const { data: studentWorkUnread } = useStudentWorkUnreadCount();

  // Total unread count for bell badge (contacts + job apps + conf + student works)
  const totalUnread = (unreadCount || 0) + (jobAppUnread || 0) + (confUnread || 0) + (studentWorkUnread || 0);
  const { scrollDirection, scrollY } = useScrollDirection();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const [isPastHero, setIsPastHero] = useState(false);

  const isJournal = pathname.startsWith("/faoliyat/ilmiy-faoliyat/ilmiy-jurnal");
  const isHome = pathname === "/" || pathname === "";
  const isScrolled = scrollY > 50;

  // Real-time hero detection: check hero bottom vs viewport on every scroll
  useEffect(() => {
    if (!isHome) { setIsPastHero(false); return; }

    let heroEl: HTMLElement | null = null;

    const check = () => {
      if (!heroEl) heroEl = document.getElementById("hero-section");
      if (!heroEl) return;
      setIsPastHero(heroEl.getBoundingClientRect().bottom <= 80);
    };

    window.addEventListener("scroll", check, { passive: true });
    check();
    const t = setTimeout(check, 200);

    return () => {
      window.removeEventListener("scroll", check);
      clearTimeout(t);
    };
  }, [isHome]);

  const isBlue = isHome && !isPastHero;

  const bgClass = isHome
    ? isPastHero
      ? "bg-white shadow-md border-b border-gray-100"
      : isScrolled
        ? "bg-[#00575B]/90 backdrop-blur-xl shadow-lg"
        : "bg-gradient-to-b from-black/30 to-transparent"
    : isScrolled
      ? "bg-white shadow-md border-b border-gray-100"
      : "bg-white border-b border-gray-100";

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    closeMobileMenu();
  }, [pathname, closeMobileMenu]);

  if (isJournal) return null;

  return (
    <><header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        bgClass,
        scrollDirection === "down" && scrollY > 300 && "-translate-y-full"
      )}
    >
      <div className="mx-auto max-w-350 px-4 sm:px-6 lg:px-8">
        {/* â”€â”€ Row 1: Logo + (xl: centered nav) + right â”€â”€ */}
        <div className="relative flex items-center py-3">
          {/* navbar-start: logo */}
          <div className="flex shrink-0 items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/icon-192.webp"
                alt="TdTUTF"
                width={40}
                height={40}
                className="h-10 w-10 rounded-full"
                priority
                unoptimized
              />
            </Link>
          </div>

          {/* navbar-center: desktop nav (xl+) */}
          <nav className="hidden lg:flex flex-1 items-center justify-center">
            <NavLinks isBlue={isBlue} pathname={pathname} confUnread={confUnread} jobAppUnread={jobAppUnread} studentWorkUnread={studentWorkUnread} />
          </nav>

          {/* navbar-end: a11y + bell + profile + hamburger */}
          <div className="ml-auto flex shrink-0 items-center gap-2">
            <AccessibilityHeaderButton variant={isBlue ? "light" : "dark"} />

            {/* Notification Bell */}
            <Link
              href="/aloqa"
              className={cn(
                "relative rounded-full p-2 transition-all hover:opacity-80",
                isBlue ? "bg-white/15 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-600"
              )}
            >
              <Bell className="w-5 h-5" />
              {totalUnread > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-3xs font-bold rounded-full flex items-center justify-center">
                  {totalUnread > 99 ? "99+" : totalUnread}
                </span>
              )}
            </Link>

            {/* Profile Dropdown â€” hidden on mobile, visible on md+ */}
            <div ref={profileRef} className="relative hidden md:block">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className={cn(
                  "flex items-center gap-2 p-1.5 rounded-full transition-colors",
                  isBlue ? "hover:bg-white/10" : "hover:bg-gray-100"
                )}
              >
                <Avatar
                  src={user?.avatar}
                  alt={user?.name || "Admin"}
                  size="sm"
                />
                <span
                  className={cn(
                    "hidden lg:block text-sm font-medium max-w-30 truncate",
                    isBlue ? "text-white" : "text-gray-700"
                  )}
                >
                  {user?.name}
                </span>
                <ChevronDown
                  className={cn(
                    "hidden lg:block w-3.5 h-3.5 transition-transform",
                    isBlue ? "text-white/70" : "text-gray-400",
                    profileOpen && "rotate-180"
                  )}
                />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full mt-1 w-52 sm:w-56 bg-white rounded-2xl shadow-2xl py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">
                      {user?.name}
                    </p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <Link
                    href="/dashboard"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                  >
                    <BarChart3 className="w-4 h-4" />
                    Dashboard
                  </Link>
                  <Link
                    href="/sahifalar"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                  >
                    <FileText className="w-4 h-4" />
                    Sahifalar
                  </Link>
                  <Link
                    href="/social-links"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Ijtimoiy tarmoqlar
                  </Link>
                  <hr className="my-1 border-gray-100" />
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      logoutMutation.mutate();
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4" />
                    Chiqish
                  </button>
                </div>
              )}
            </div>

            {/* Hamburger â€” mobile only */}
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

    {/* ISFT-style Mobile Side Panel */}
    <AdminMobileMenu />
  </>);
}

/* ============================================
   Dropdown Navigation Item Component
   ============================================ */
function DropdownNavItem({
  item,
  pathname,
  isBlue,
}: {
  item: NavItem;
  pathname: string;
  isBlue: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

  const openMenu = useCallback(() => {
    clearTimeout(timeoutRef.current!);
    setOpen(true);
  }, []);

  const closeMenu = useCallback(() => {
    timeoutRef.current = setTimeout(() => setOpen(false), 150);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const NAV_GLOW = "0 0 4px rgba(255,255,255,0.5), 0 0 10px rgba(255,255,255,0.2)";
  const NAV_GLOW_ACTIVE = "0 0 6px rgba(255,255,255,0.6), 0 0 14px rgba(255,255,255,0.3)";

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

      <div
        className={cn(
          "absolute left-0 top-full pt-2 z-500 transition-all duration-200",
          open ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-1 pointer-events-none"
        )}
      >
        <div className="rounded-2xl bg-white p-2 shadow-2xl min-w-max" role="menu" aria-label={item.title}>
          {item.children.map((child) => (
            <SubNavItem key={child.href} item={child} onClose={() => setOpen(false)} />
          ))}
          <div className="border-t border-gray-100 mt-1 pt-1">
            <AddPageGuardedButton
              href={`/sahifalar?parent=${encodeURIComponent(item.href.replace(/^\//, ""))}`}
              onClose={() => setOpen(false)}
              className="flex w-full items-center gap-2 rounded-lg px-4 py-2.5 text-sm text-blue-600 hover:bg-blue-50 transition-colors"
              iconSize="md"
              label="Yangi sahifa qo'shish"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================
   Sub Navigation Item (supports nested dropdowns)
   ============================================ */
function SubNavItem({ item, onClose }: { item: NavItem; onClose: () => void }) {
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
    return (
      <Link
        href={item.href}
        role="menuitem"
        onClick={onClose}
        className="flex items-center justify-between rounded-lg px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-700 transition-colors text-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 focus-visible:bg-blue-50"
      >
        {item.title}
        {item.badge && item.badge > 0 && (
          <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-3xs font-bold text-white">
            {item.badge > 99 ? "99+" : item.badge}
          </span>
        )}
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
        onClick={onClose}
        aria-expanded={open}
        aria-haspopup="true"
        onFocus={openMenu}
        className="flex w-full items-center justify-between rounded-lg px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors text-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 focus-visible:bg-blue-50"
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
          {item.children.map((subChild) => (
            <SubSubNavItem key={subChild.href} item={subChild} onClose={onClose} />
          ))}
          <div className="border-t border-gray-100 mt-1 pt-1">
            <AddPageGuardedButton
              href={`/sahifalar?parent=${encodeURIComponent(item.href.replace(/^\//, ""))}`}
              onClose={onClose}
              className="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-xs text-blue-600 hover:bg-blue-50 transition-colors"
              iconSize="sm"
              label="Yangi qo'shish"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function SubSubNavItem({ item, onClose }: { item: NavItem; onClose: () => void }) {
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
    return (
      <Link
        href={item.href}
        role="menuitem"
        onClick={onClose}
        className="block rounded-lg px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-700 transition-colors text-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 focus-visible:bg-blue-50"
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
        onClick={onClose}
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
