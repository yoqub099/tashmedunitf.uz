"use client";

import { useState, useEffect } from "react";
import { registerForConference } from "@/lib/services";
import { s } from "@/lib/i18n";
import { useLanguageStore } from "@/store/useLanguageStore";

/* ── Countdown Timer (hydration-safe, stops at 0) ── */
export function CountdownTimer({ date }: { date: string | null }) {
  const [timeLeft, setTimeLeft] = useState<{ h: number; m: number; s: number } | null>(null);
  const [mounted, setMounted] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!date) return;
    const target = new Date(date).getTime();
    let intervalId: ReturnType<typeof setInterval> | null = null;

    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) {
        setTimeLeft({ h: 0, m: 0, s: 0 });
        setFinished(true);
        if (intervalId) clearInterval(intervalId); // stop ticking
        return;
      }
      setTimeLeft({
        h: Math.floor(diff / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };

    tick();
    intervalId = setInterval(tick, 1000);
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [date]);

  // SSR / initial render — suppress to avoid hydration mismatch
  if (!mounted || !timeLeft) {
    return <span className="ml-auto text-sm font-extrabold text-gray-400">--:--:--</span>;
  }

  if (finished) {
    return <span className="ml-auto text-sm font-extrabold text-red-600">00:00:00</span>;
  }

  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <span className="ml-auto text-sm font-extrabold text-gray-900" aria-label="Tadbir boshlanishigacha qolgan vaqt">
      {pad(timeLeft.h)}:{pad(timeLeft.m)}:{pad(timeLeft.s)}
    </span>
  );
}

/* ── Participate Button + Registration Modal ── */
export function ParticipateButton({ newsId }: { newsId: number }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const { language: lang } = useLanguageStore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const fd = new FormData(e.currentTarget);
    const data = {
      news_id: newsId,
      first_name: fd.get("first_name") as string,
      last_name: fd.get("last_name") as string,
      email: fd.get("email") as string,
      phone: (fd.get("phone") as string) || undefined,
      address: (fd.get("address") as string) || undefined,
    };

    try {
      await registerForConference(data);
      setSuccess(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : s("conf.error_default", lang);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSuccess(false);
    setError("");
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="h-10 rounded-full border border-[#C30050] px-5 text-sm font-medium text-[#C30050] transition-colors hover:bg-[#C30050] hover:text-white"
      >
        {s("conf.participate", lang)}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={handleClose}
        >
          <div
            className="relative mx-4 w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full text-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            >
              ✕
            </button>

            {success ? (
              <div className="flex flex-col items-center gap-4 py-8">
                <div className="flex size-16 items-center justify-center rounded-full bg-green-100">
                  <svg className="size-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 className="font-serif text-xl font-semibold text-gray-900">
                  {s("conf.success_title", lang)}
                </h4>
                <p className="text-center text-sm text-gray-500">
                  {s("conf.success_message", lang)}
                </p>
                <button
                  onClick={handleClose}
                  className="mt-2 rounded-full border border-green-600 px-6 py-2 text-sm font-medium text-green-600 transition-colors hover:bg-green-600 hover:text-white"
                >
                  {s("common.close", lang)}
                </button>
              </div>
            ) : (
              <>
                <h4 className="font-serif text-2xl font-semibold text-gray-900">
                  {s("conf.registration_title", lang)}
                </h4>

                {error && (
                  <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                  </div>
                )}

                <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                  {[
                    { label: s("conf.form_first_name", lang), name: "first_name", placeholder: s("conf.form_first_name_ph", lang), required: true },
                    { label: s("conf.form_last_name", lang), name: "last_name", placeholder: s("conf.form_last_name_ph", lang), required: true },
                    { label: s("conf.form_email", lang), name: "email", placeholder: s("conf.form_email_ph", lang), required: true, type: "email" },
                    { label: s("conf.form_phone", lang), name: "phone", placeholder: s("conf.form_phone_ph", lang), required: false },
                    { label: s("conf.form_address", lang), name: "address", placeholder: s("conf.form_address_ph", lang), required: false },
                  ].map((f) => (
                    <label key={f.name} className="block">
                      <span className="text-xs text-gray-500">{f.label}</span>
                      <input
                        name={f.name}
                        type={f.type || "text"}
                        placeholder={f.placeholder}
                        required={f.required}
                        className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm transition-colors focus:border-green-500 focus:outline-none"
                      />
                    </label>
                  ))}

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="rounded-full border border-green-600 px-6 py-2 text-sm font-medium text-green-600 transition-colors hover:bg-green-600 hover:text-white disabled:opacity-50"
                    >
                      {loading ? s("conf.form_submitting", lang) : s("conf.form_submit", lang)}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
