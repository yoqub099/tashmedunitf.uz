"use client";

import { useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, KeyRound, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface GuardOptions {
  title?: string;
  description?: string;
}

/**
 * Vaqtinchalik UI guard hook — admin paneldan harakatdan oldin parol so'raydi.
 * Real xavfsizlik emas (admin auth allaqachon bor) — tasodifan bosishdan saqlash.
 *
 * `sessionKey` berilsa: parol bir martta kiritilsa, shu sessiya davomida (tab yopilgunga qadar)
 * boshqa hech qachon so'ralmaydi. Boshqa joylar ham xuddi shu sessionKey ishlatsa,
 * ular ham auto-pass bo'ladi (umumiy unlock).
 */
export function usePasswordGuard(password: string, sessionKey?: string) {
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [options, setOptions] = useState<GuardOptions>({});
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);
  const [sessionUnlocked, setSessionUnlocked] = useState(false);

  // Mount'da sessiyani tekshirish (SSR-safe)
  useEffect(() => {
    if (!sessionKey || typeof window === "undefined") return;
    try {
      if (window.sessionStorage.getItem(sessionKey) === "1") {
        setSessionUnlocked(true);
      }
    } catch {
      /* ignore */
    }
  }, [sessionKey]);

  const guard = useCallback(
    (action: () => void, opts?: GuardOptions) => {
      if (sessionUnlocked) {
        action();
        return;
      }
      setOptions(opts || {});
      setPw("");
      setError(false);
      setPendingAction(() => action);
    },
    [sessionUnlocked]
  );

  const close = useCallback(() => {
    setPendingAction(null);
    setPw("");
    setError(false);
  }, []);

  const submit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (pw === password) {
        if (sessionKey && typeof window !== "undefined") {
          try {
            window.sessionStorage.setItem(sessionKey, "1");
          } catch {
            /* ignore */
          }
        }
        setSessionUnlocked(true);
        const fn = pendingAction;
        setPendingAction(null);
        setPw("");
        setError(false);
        fn?.();
      } else {
        setError(true);
      }
    },
    [pw, password, pendingAction, sessionKey]
  );

  const isOpen = pendingAction !== null && typeof document !== "undefined";

  const modal = isOpen
    ? createPortal(
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pw-guard-title"
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={close}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="relative px-6 pt-6 pb-4 bg-gradient-to-br from-blue-600 to-blue-700 text-white">
              <button
                type="button"
                onClick={close}
                className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-white/15 hover:bg-white/25 transition-colors flex items-center justify-center"
                aria-label="Yopish"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h2 id="pw-guard-title" className="text-lg font-bold leading-tight">
                    {options.title || "Tasdiqlash kerak"}
                  </h2>
                  <p className="text-xs text-white/80 mt-0.5">
                    {options.description || "Davom etish uchun parolni kiriting"}
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={submit} className="px-6 py-5">
              <label htmlFor="pw-guard-input" className="block text-sm font-medium text-gray-700 mb-1.5">
                Parol
              </label>
              <input
                id="pw-guard-input"
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
                  onClick={close}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Bekor qilish
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
        </div>,
        document.body
      )
    : null;

  return { guard, modal, isUnlocked: sessionUnlocked };
}
