import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SearchModal from "@/components/shared/SearchModal";
import AutoRefresh from "@/components/shared/AutoRefresh";
import AccessibilityWidget from "@/components/a11y/AccessibilityWidget";
import { loadTranslations } from "@/lib/i18n";
import { getNavigation } from "@/lib/services";
import { getLanguage } from "@/lib/language";
import { NavigationProvider } from "@/providers/NavigationProvider";
import type { NavTreeItem } from "@/types";
import type { Language } from "@/lib/i18n";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await loadTranslations();
  const lang = await getLanguage();

  // Fetch dynamic navigation from API with graceful fallback
  let navItems: NavTreeItem[] = [];
  try {
    const res = await getNavigation();
    if (res.success && Array.isArray(res.data)) {
      navItems = res.data;
    }
  } catch {
    // API unavailable — fall back to static navigation
  }

  return (
    <NavigationProvider items={navItems}>
      <div className="flex min-h-screen flex-col">
        <AutoRefresh />
        <Header serverLang={lang as Language} />
        <SearchModal />
        <main id="main-content" tabIndex={-1} className="flex-1">{children}</main>
        <Footer />
        <AccessibilityWidget serverLang={lang as Language} />
      </div>
    </NavigationProvider>
  );
}
