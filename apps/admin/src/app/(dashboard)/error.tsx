"use client";

import { useEffect } from "react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <div className="text-center max-w-md">
        <div className="mb-4 text-5xl">⚠️</div>
        <h2 className="mb-2 text-xl font-bold text-gray-900">
          Xatolik yuz berdi
        </h2>
        <p className="mb-6 text-gray-600 text-sm">
          Sahifani yuklashda muammo chiqdi. Iltimos, qaytadan urinib ko&apos;ring.
        </p>
        <button
          onClick={reset}
          className="rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 transition-colors"
        >
          Qaytadan urinish
        </button>
      </div>
    </div>
  );
}
