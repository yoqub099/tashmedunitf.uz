"use client";

import { useEffect } from "react";
import { s } from "@/lib/i18n";
import { useLanguageStore } from "@/store/useLanguageStore";
import { reportClientError } from "@/lib/errorReporter";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { language } = useLanguageStore();

  useEffect(() => {
    reportClientError({
      message: error.message,
      type: error.name,
      stack: error.stack,
      level: "critical",
      extra: { digest: error.digest, boundary: "global" },
    });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-4 sm:mb-6 text-5xl sm:text-6xl font-bold text-red-500">{s("error.title", language)}</div>
        <h1 className="mb-3 text-2xl font-bold text-gray-900">
          {s("error.unexpected", language)}
        </h1>
        <p className="mb-6 text-gray-600">
          {s("error.page_load_desc", language)}
        </p>
        <button
          onClick={reset}
          className="rounded-lg bg-blue-700 px-6 py-3 text-sm font-medium text-white hover:bg-blue-800 transition-colors"
        >
          {s("common.try_again", language)}
        </button>
      </div>
    </div>
  );
}
