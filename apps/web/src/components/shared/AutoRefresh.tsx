"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useCallback } from "react";

/**
 * Real-time auto-refresh — admin paneldan o'zgartirish bo'lganda
 * frontend brauzer DARHOL yangilanadi (2 soniya ichida).
 *
 * Har 2 soniyada version endpointni tekshiradi.
 * Version o'zgarsa → router.refresh() → yangi HTML olinadi.
 * Agar HTML yangilanmasa → sahifani to'liq yuklaydi (fallback).
 *
 * F5 bosish shart emas!
 */
const POLL_INTERVAL = 2000; // 2 soniya — tezroq reaksiya
const DEBOUNCE_MS = 800; // Tez-tez refresh oldini olish

export default function AutoRefresh() {
  const router = useRouter();
  const versionRef = useRef<number>(0);
  const lastRefresh = useRef(Date.now());
  const refreshCount = useRef(0);

  /**
   * Sahifadagi barcha img elementlarini cache-bust qilish
   * Brauzer cache'dan emas, serverdan yangi rasm oladi
   */
  const bustImageCache = useCallback(() => {
    const images = document.querySelectorAll("img[src]");
    const ts = Date.now();
    images.forEach((img) => {
      const src = (img as HTMLImageElement).src;
      // Faqat backend rasm URL'larini yangilash
      if (src.includes("/storage/media/") || src.includes("/media/")) {
        const url = new URL(src);
        url.searchParams.set("_t", String(ts));
        (img as HTMLImageElement).src = url.toString();
      }
    });
  }, []);

  useEffect(() => {
    let active = true;

    async function checkVersion() {
      if (!active) return;
      try {
        const res = await fetch("/api/revalidate/stream", {
          cache: "no-store",
        });
        if (!res.ok) return;
        const data = await res.json();

        if (
          data.version &&
          versionRef.current > 0 &&
          data.version !== versionRef.current
        ) {
          // Version o'zgardi — sahifani yangilaymiz
          console.log(
            "[AutoRefresh] Version o'zgardi:",
            versionRef.current,
            "→",
            data.version,
            "— sahifa yangilanmoqda..."
          );
          const now = Date.now();
          if (now - lastRefresh.current > DEBOUNCE_MS) {
            lastRefresh.current = now;
            versionRef.current = data.version;
            refreshCount.current++;

            // 1) Router refresh — server component'larni qayta render qiladi
            router.refresh();

            // 2) Kichik kechikishdan keyin rasm cache'ni ham tozalash
            setTimeout(() => {
              bustImageCache();
            }, 500);

            // 3) Agar 3 marta refresh bo'lib, hali o'zgarmasa — to'liq reload
            if (refreshCount.current >= 3) {
              console.log("[AutoRefresh] Fallback: sahifa to'liq yuklanmoqda...");
              refreshCount.current = 0;
              window.location.reload();
            }
          }
        } else if (data.version && versionRef.current === 0) {
          // Birinchi marta — faqat version saqlaymiz
          versionRef.current = data.version;
        } else if (data.version && data.version === versionRef.current) {
          // Version o'zgarmagan — refresh counter'ni reset qilamiz
          refreshCount.current = 0;
        }
      } catch {
        // Network error — skip
      }
    }

    // Dastlab version olish
    checkVersion();

    // Har 2 soniyada tekshirish
    const interval = setInterval(checkVersion, POLL_INTERVAL);

    // Tab ko'rinsa ham refresh (admin tabdan qaytganda)
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        checkVersion();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      active = false;
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [router, bustImageCache]);

  return null;
}
