"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { mainNavigation, adminNavItems, type NavItem } from "@/config/navigation";
import { useUIStore } from "@/store/useUIStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useLogout } from "@/hooks/useAuth";
import { useConferenceUnreadCount } from "@/hooks/useConferenceRegistrations";
import { useJobAppUnreadCount } from "@/hooks/useJobApplications";
import { useStudentWorkUnreadCount } from "@/hooks/useStudentWorks";
import { cn } from "@/lib/utils";
import { ChevronDown, LogOut, X } from "lucide-react";
import { useState, useEffect } from "react";
import Avatar from "@/components/shared/Avatar";

/* ── Recursive accordion menu item ── */
function AccordionItem({
  item,
  depth,
  openSections,
  toggleSection,
  closeMobileMenu,
}: {
  item: NavItem;
  depth: number;
  openSections: string[];
  toggleSection: (href: string) => void;
  closeMobileMenu: () => void;
}) {
  const isOpen = openSections.includes(item.href);
  const hasChildren = item.children && item.children.length > 0;

  if (!hasChildren) {
    return (
      <Link
        href={item.href}
        onClick={closeMobileMenu}
        className={cn(
          "flex items-center justify-between rounded-lg py-2.5 text-sm transition-colors hover:bg-gray-50 hover:text-blue-700",
          depth === 0 ? "px-4 font-medium text-gray-800" : "px-4 text-gray-600"
        )}
        style={{ paddingLeft: `${depth * 12 + 16}px` }}
      >
        {item.title}
        {item.badge && item.badge > 0 && (
          <span className="mr-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-3xs font-bold text-white">
            {item.badge > 99 ? "99+" : item.badge}
          </span>
        )}
      </Link>
    );
  }

  return (
    <div>
      <button
        onClick={() => toggleSection(item.href)}
        className={cn(
          "flex w-full items-center justify-between rounded-lg py-2.5 text-sm transition-colors hover:bg-gray-50",
          depth === 0 ? "px-4 font-medium text-gray-800" : "px-4 text-gray-600"
        )}
        style={{ paddingLeft: `${depth * 12 + 16}px` }}
      >
        {item.title}
        <ChevronDown
          className={cn(
            "mr-2 h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {/* Children — animated slide */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-200",
          isOpen ? "max-h-500 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        {item.children!.map((child) => (
          <AccordionItem
            key={child.href}
            item={child}
            depth={depth + 1}
            openSections={openSections}
            toggleSection={toggleSection}
            closeMobileMenu={closeMobileMenu}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Main Admin Mobile Menu ── */
export default function AdminMobileMenu() {
  const pathname = usePathname();
  const { isMobileMenuOpen, closeMobileMenu } = useUIStore();
  const { user } = useAuthStore();
  const logoutMutation = useLogout();
  const { data: confUnread } = useConferenceUnreadCount();
  const { data: jobAppUnread } = useJobAppUnreadCount();
  const { data: studentWorkUnread } = useStudentWorkUnreadCount();
  const [openSections, setOpenSections] = useState<string[]>([]);

  const toggleSection = (href: string) => {
    setOpenSections((prev) =>
      prev.includes(href) ? prev.filter((h) => h !== href) : [...prev, href]
    );
  };

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-60 lg:hidden transition-all duration-300",
        isMobileMenuOpen ? "visible" : "invisible"
      )}
    >
      {/* Backdrop — semi-transparent */}
      <div
        className={cn(
          "absolute inset-0 bg-black/40 transition-opacity duration-300",
          isMobileMenuOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={closeMobileMenu}
      />

      {/* Side Panel — FeedUp style, slides from right */}
      <div
        className={cn(
          "absolute top-0 right-0 bottom-0 w-[88%] max-w-md flex flex-col bg-white shadow-2xl transition-transform duration-300 ease-out",
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Panel header — "Menyu" + close + user info */}
        <div className="shrink-0 bg-blue-700 px-4 pt-4 pb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-white">Menyu</h2>
            <button
              onClick={closeMobileMenu}
              className="rounded-full p-1.5 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
              aria-label="Yopish"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <Avatar
              src={user?.avatar}
              alt={user?.name || "Admin"}
              size="md"
            />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {user?.name}
              </p>
              <p className="text-xs text-blue-200 truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          {/* Admin nav items */}
          <div className="px-2 py-3 space-y-0.5">
            <p className="px-4 py-1.5 text-3xs font-semibold text-gray-400 uppercase tracking-wider">
              Admin Panel
            </p>
            {adminNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              const itemBadge = item.href === "/ish-arizalari" && jobAppUnread && jobAppUnread > 0 ? jobAppUnread : item.badge;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-50 hover:text-blue-700"
                  )}
                >
                  <Icon className="w-4.5 h-4.5 shrink-0" />
                  <span className="flex-1">{item.label}</span>
                  {itemBadge && itemBadge > 0 && (
                    <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-3xs font-bold text-white">
                      {itemBadge > 99 ? "99+" : itemBadge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Separator */}
          <div className="border-t border-gray-100 mx-4" />

          {/* Public navigation accordion */}
          <div className="px-2 py-3 space-y-0.5">
            <p className="px-4 py-1.5 text-3xs font-semibold text-gray-400 uppercase tracking-wider">
              Sayt navigatsiyasi
            </p>
            {/* Inject badge into navigation */}
            {mainNavigation.map((item) => {
              let enriched = item;
              // Inject conference unread badge
              if (item.href === "/yangiliklar" && item.children && confUnread && confUnread > 0) {
                enriched = {
                  ...item,
                  children: item.children.map((child) =>
                    child.href === "/konferensiya-royxatlari" ? { ...child, badge: confUnread } : child
                  ),
                };
              }
              // Inject job application + student works unread badges
              if (item.href === "/talabalarga" && item.children && ((jobAppUnread && jobAppUnread > 0) || (studentWorkUnread && studentWorkUnread > 0))) {
                enriched = {
                  ...enriched,
                  children: (enriched.children || item.children)!.map((child) => {
                    if (child.href === "/talabalarga/karyera-markazi" && child.children && jobAppUnread && jobAppUnread > 0) {
                      return {
                        ...child,
                        children: child.children.map((grandchild) =>
                          grandchild.href === "/ish-arizalari" ? { ...grandchild, badge: jobAppUnread } : grandchild
                        ),
                      };
                    }
                    if (child.href === "/talabalarga/talaba-ishlari" && studentWorkUnread && studentWorkUnread > 0) {
                      return { ...child, badge: studentWorkUnread };
                    }
                    return child;
                  }),
                };
              }
              return (
                <AccordionItem
                  key={enriched.href}
                  item={enriched}
                  depth={0}
                  openSections={openSections}
                  toggleSection={toggleSection}
                  closeMobileMenu={closeMobileMenu}
                />
              );
            })}
          </div>
        </div>

        {/* Logout — bottom of panel */}
        <div className="shrink-0 border-t border-gray-100 px-4 py-3">
          <button
            onClick={() => {
              closeMobileMenu();
              logoutMutation.mutate();
            }}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4.5 h-4.5" />
            Chiqish
          </button>
        </div>
      </div>
    </div>
  );
}
