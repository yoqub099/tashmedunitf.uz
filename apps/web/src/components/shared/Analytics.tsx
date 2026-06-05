"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

const STORAGE_KEY = "tmtu:cookie-consent";

/**
 * Analytics loader — conditionally loads GA4 + Yandex Metrika
 * AFTER user accepts cookies (GDPR compliance).
 */
export default function Analytics() {
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    const check = () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const data = JSON.parse(raw);
          setConsented(data.status === "accepted");
        }
      } catch {
        /* ignore */
      }
    };
    check();
    const listener = () => check();
    window.addEventListener("cookie-consent", listener);
    return () => window.removeEventListener("cookie-consent", listener);
  }, []);

  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const yandexId = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID;

  if (!consented) return null;

  return (
    <>
      {/* Google Analytics 4 */}
      {gaId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}', { anonymize_ip: true });
            `}
          </Script>
        </>
      )}

      {/* Yandex Metrika */}
      {yandexId && (
        <Script id="yandex-metrika" strategy="afterInteractive">
          {`
            (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();
            for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
            k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
            (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

            ym(${yandexId}, "init", {
              clickmap:true,
              trackLinks:true,
              accurateTrackBounce:true,
              webvisor:false
            });
          `}
        </Script>
      )}
    </>
  );
}
