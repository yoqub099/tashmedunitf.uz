"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { s } from "@/lib/i18n";
import { useLanguageStore } from "@/store/useLanguageStore";

export default function MainError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { language } = useLanguageStore();

  useEffect(() => {
    // Log to console; in prod, Sentry captures via beforeSend
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.error("Page error:", error);
    }
  }, [error]);

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-4 py-12 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-rose-50/30">
      <div
        className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-rose-200/20 to-amber-200/20 blur-3xl pointer-events-none"
        aria-hidden
      />
      <div
        className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-amber-200/20 to-rose-200/20 blur-3xl pointer-events-none"
        aria-hidden
      />

      <div className="relative z-10 max-w-lg w-full text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400 to-rose-500 shadow-2xl shadow-rose-500/30 mb-6">
          <AlertTriangle className="w-10 h-10 text-white" strokeWidth={2.2} />
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
          {s("error.page_load", language)}
        </h1>
        <p className="text-base text-slate-600 mb-2">
          {s("error.page_load_desc", language)}
        </p>
        {error.digest && (
          <p className="text-xs text-slate-400 font-mono mb-6">
            ID: {error.digest}
          </p>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-white font-semibold rounded-xl shadow-lg shadow-rose-500/25 hover:-translate-y-0.5 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            {s("common.try_again", language)}
          </button>
          <Link
            href={`/${language}`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 font-semibold rounded-xl shadow-sm transition-all"
          >
            <Home className="w-4 h-4" />
            {s("error.go_home", language)}
          </Link>
        </div>
      </div>
    </main>
  );
}
