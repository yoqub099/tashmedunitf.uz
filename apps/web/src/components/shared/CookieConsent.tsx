"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X, Cookie, Check } from "lucide-react";

const STORAGE_KEY = "tmtu:cookie-consent";

type ConsentStatus = "accepted" | "declined";

interface Consent {
  status: ConsentStatus;
  timestamp: number;
  version: number;
}

const CONSENT_VERSION = 1;

function getStoredConsent(): Consent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as Consent;
    if (data.version !== CONSENT_VERSION) return null;
    return data;
  } catch {
    return null;
  }
}

function storeConsent(status: ConsentStatus) {
  if (typeof window === "undefined") return;
  const data: Consent = { status, timestamp: Date.now(), version: CONSENT_VERSION };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* ignore */
  }
  // Notify listeners (e.g. analytics scripts) that consent has changed
  window.dispatchEvent(new CustomEvent("cookie-consent", { detail: data }));
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = getStoredConsent();
    if (!stored) {
      // Show after a small delay to avoid layout jump
      const t = setTimeout(() => setVisible(true), 700);
      return () => clearTimeout(t);
    }
  }, []);

  if (!visible) return null;

  const handleAccept = () => {
    storeConsent("accepted");
    setVisible(false);
  };
  const handleDecline = () => {
    storeConsent("declined");
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-desc"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-50 max-w-md"
    >
      <div className="relative rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200 shadow-2xl p-5 sm:p-6">
        <button
          onClick={handleDecline}
          aria-label="Yopish"
          className="absolute right-3 top-3 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3 pr-6">
          <div className="flex-none w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-sm">
            <Cookie className="w-5 h-5 text-white" strokeWidth={2.4} />
          </div>
          <div className="flex-1 min-w-0">
            <h2 id="cookie-consent-title" className="text-sm font-bold text-slate-900">
              Cookie fayllar haqida
            </h2>
            <p id="cookie-consent-desc" className="mt-1 text-xs text-slate-600 leading-relaxed">
              Sayt ishini yaxshilash va foydalanuvchi tajribasini tahlil qilish uchun cookie
              fayllardan foydalanamiz.{" "}
              <Link href="/uz/privacy" className="text-teal-600 hover:text-teal-700 underline">
                Maxfiylik siyosati
              </Link>
              .
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-col-reverse sm:flex-row gap-2">
          <button
            onClick={handleDecline}
            className="flex-1 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Rad etish
          </button>
          <button
            onClick={handleAccept}
            className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 rounded-xl transition-all shadow-sm hover:shadow-md"
          >
            <Check className="w-3.5 h-3.5" />
            Qabul qilish
          </button>
        </div>
      </div>
    </div>
  );
}
