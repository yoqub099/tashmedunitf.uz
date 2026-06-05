"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, KeyRound, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * To'liq sahifa parol qulflagichi.
 * Sahifa kontentini blokirovkalaydi va parol so'raydi.
 * Muvaffaqiyatli kiritilsa, `sessionKey` orqali sessionStorage'ga yoziladi
 * va shu kalit bilan boshqa har qanday `usePasswordGuard` da auto-pass bo'ladi.
 */
interface Props {
  password: string;
  sessionKey: string;
  children: React.ReactNode;
  title?: string;
  description?: string;
  cancelHref?: string;
}

export default function PageLock({
  password,
  sessionKey,
  children,
  title = "Bu sahifa himoyalangan",
  description = "Davom etish uchun parolni kiriting",
  cancelHref = "/dashboard",
}: Props) {
  const router = useRouter();
  const [state, setState] = useState<"checking" | "locked" | "unlocked">("checking");
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);

  // Sessiyani mount'da tekshirish (SSR-safe)
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (window.sessionStorage.getItem(sessionKey) === "1") {
        setState("unlocked");
      } else {
        setState("locked");
      }
    } catch {
      setState("locked");
    }
  }, [sessionKey]);

  const submit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (pw === password) {
        try {
          window.sessionStorage.setItem(sessionKey, "1");
        } catch {
          /* ignore */
        }
        setState("unlocked");
      } else {
        setError(true);
      }
    },
    [pw, password, sessionKey]
  );

  const cancel = useCallback(() => {
    router.push(cancelHref);
  }, [router, cancelHref]);

  // Sessiyani tekshirayotgan paytda spinner
  if (state === "checking") {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
      </div>
    );
  }

  if (state === "unlocked") {
    return <>{children}</>;
  }

  // Locked — to'liq sahifa modal
  return (
    <div className="relative min-h-[80vh] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-50" />

      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-blue-100">
        {/* Header */}
        <div className="relative px-6 pt-6 pb-5 bg-gradient-to-br from-blue-600 to-blue-700 text-white overflow-hidden">
          {/* Decorative dots */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 80%, rgba(255,255,255,0.15) 1px, transparent 2px), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 1px, transparent 2px)",
              backgroundSize: "28px 28px, 36px 36px",
            }}
            aria-hidden="true"
          />
          <div className="relative flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold leading-tight">{title}</h2>
              <p className="text-xs text-white/85 mt-0.5">{description}</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={submit} className="px-6 py-5">
          <label htmlFor="page-lock-pw" className="block text-sm font-medium text-gray-700 mb-1.5">
            Parol
          </label>
          <input
            id="page-lock-pw"
            type="password"
            inputMode="numeric"
            autoFocus
            value={pw}
            onChange={(e) => {
              setPw(e.target.value);
              if (error) setError(false);
            }}
            placeholder="••"
            className={cn(
              "w-full px-4 py-3 rounded-xl border-2 outline-none transition-colors text-lg tracking-widest font-mono",
              error
                ? "border-red-400 bg-red-50 text-red-700"
                : "border-gray-200 focus:border-blue-500 bg-white"
            )}
          />

          {error && (
            <div className="mt-2 flex items-center gap-1.5 text-sm text-red-600">
              <AlertCircle className="w-4 h-4" />
              Noto&apos;g&apos;ri parol. Qaytadan urinib ko&apos;ring.
            </div>
          )}

          <div className="mt-5 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={cancel}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Orqaga qaytish
            </button>
            <button
              type="submit"
              disabled={!pw}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
            >
              <KeyRound className="w-4 h-4" />
              Tasdiqlash
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
