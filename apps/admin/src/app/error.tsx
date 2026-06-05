"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin global error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900">Kutilmagan xatolik yuz berdi</h2>
        <p className="mt-2 text-sm text-gray-500">
          Iltimos, sahifani qayta yuklang yoki keyinroq urinib ko&apos;ring.
        </p>
        <button
          onClick={reset}
          className="mt-6 rounded-xl bg-blue-700 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-800"
        >
          Qayta urinish
        </button>
      </div>
    </div>
  );
}
