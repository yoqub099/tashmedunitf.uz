"use client";

import Link from "@/components/shared/LocaleLink";
import { useRouter, usePathname } from "next/navigation";
import { getMainNavigation, type NavItem } from "@/config/navigation";
import { useLanguageStore } from "@/store/useLanguageStore";
import { stripLocale } from "@/lib/locale";
import { s } from "@/lib/i18n";
import { LANGUAGES } from "@/lib/constants";
import { useUIStore } from "@/store/useUIStore";
import { useNavigation } from "@/providers/NavigationProvider";
import { cn } from "@/lib/utils";
import { ChevronDown, X } from "lucide-react";
import { useState, useEffect } from "react";

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
    const linkClass = cn(
      "flex items-center rounded-lg py-2.5 text-sm transition-colors hover:bg-gray-50 hover:text-blue-700",
      depth === 0 ? "px-4 font-medium text-gray-800" : "px-4 text-gray-600"
    );
    if (item.external) {
      return (
        <a
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={closeMobileMenu}
          className={linkClass}
          style={{ paddingLeft: `${depth * 12 + 16}px` }}
        >
          {item.title}
        </a>
      );
    }
    return (
      <Link
        href={item.href}
        onClick={closeMobileMenu}
        className={linkClass}
        style={{ paddingLeft: `${depth * 12 + 16}px` }}
      >
        {item.title}
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

/* ── Main Mobile Menu ── */
export default function MobileMenu() {
  const { isMobileMenuOpen, closeMobileMenu } = useUIStore();
  const { language, setLanguage } = useLanguageStore();
  const router = useRouter();
  const pathname = usePathname();
  const [openSections, setOpenSections] = useState<string[]>([]);
  const dynamicNav = useNavigation();

  const navigation = getMainNavigation(language, dynamicNav.length > 0 ? dynamicNav : undefined);

  const toggleSection = (href: string) => {
    setOpenSections((prev) =>
      prev.includes(href) ? prev.filter((h) => h !== href) : [...prev, href]
    );
  };

  const handleLanguageChange = (langCode: "uz" | "ru" | "en") => {
    const stripped = stripLocale(pathname);
    const newPath = `/${langCode}${stripped === "/" ? "" : stripped}`;
    setLanguage(langCode);
    router.push(newPath);
  };

  // Mobil menu ochilganda body scroll ni bloklash
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
        "fixed inset-0 z-50 lg:hidden transition-all duration-300",
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
        {/* Panel header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">{s("common.menu", language)}</h2>
          <button
            onClick={closeMobileMenu}
            className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            aria-label={s("common.close", language)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable nav */}
        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
          {navigation.map((item) => (
            <AccordionItem
              key={item.href}
              item={item}
              depth={0}
              openSections={openSections}
              toggleSection={toggleSection}
              closeMobileMenu={closeMobileMenu}
            />
          ))}
        </nav>

        {/* Language switcher — bottom of panel (ISFT style) */}
        <div className="shrink-0 border-t border-gray-100 px-4 py-3">
          <div className="flex items-center gap-2">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code as "uz" | "ru" | "en")}
                className={cn(
                  "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                  language === lang.code
                    ? "bg-blue-700 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
