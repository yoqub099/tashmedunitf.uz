"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import AdminTopHeader from "@/components/layout/AdminTopHeader";
import Footer from "@/components/layout/Footer";
import AccessibilityWidget from "@/components/a11y/AccessibilityWidget";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);
  const checkedRef = useRef(false);

  const isJournal = pathname.startsWith("/faoliyat/ilmiy-faoliyat/ilmiy-jurnal");

  useEffect(() => {
    if (checkedRef.current) return;

    const check = () => {
      checkedRef.current = true;
      const state = useAuthStore.getState();
      if (!state.token || !state.isAuthenticated) {
        router.replace("/login");
      } else {
        setIsReady(true);
      }
    };

    if ((useAuthStore.persist as any).hasHydrated?.()) {
      check();
    } else {
      const unsub = useAuthStore.persist.onFinishHydration(() => {
        check();
        unsub();
      });
    }
  }, [router]);

  if (!isReady) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AdminTopHeader />
      <main id="main-content" tabIndex={-1} className={`flex-1 ${isJournal ? "" : "pt-14"}`}>{children}</main>
      {!isJournal && <Footer />}
      <AccessibilityWidget />
    </div>
  );
}
