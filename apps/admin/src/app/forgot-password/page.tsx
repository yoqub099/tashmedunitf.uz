"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Send, CheckCircle2, Loader2 } from "lucide-react";
import axios from "axios";
import { siteConfig } from "@/config/site";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await axios.post(`${siteConfig.apiUrl}/auth/forgot-password`, { email });
      setSent(true);
    } catch (err) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.message || "Xatolik yuz berdi"
        : "Xatolik yuz berdi";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative w-full min-h-svh bg-[#030815] text-white flex items-center justify-center px-4 py-10 overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-br from-[#03322e] via-[#0a1f3d] to-[#042338]" />
      <div className="login-blob bg-teal-500 w-[400px] h-[400px] -top-20 -left-20" />
      <div className="login-blob delay-2 bg-cyan-500 w-[380px] h-[380px] -bottom-20 -right-20" />
      <div className="absolute inset-0 login-grid-pattern" />

      <div className="relative z-10 w-full max-w-md login-card-enter">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-cyan-300 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Login sahifasiga qaytish
        </Link>

        <div className="relative bg-white/[0.05] backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl p-8">
          {sent ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Xat yuborildi</h2>
              <p className="text-sm text-slate-300/90 leading-relaxed">
                Agar <span className="text-cyan-300">{email}</span> tizimda mavjud bo&apos;lsa,
                parolni tiklash havolasi xatga yuboriladi. Inbox va spam'ni tekshiring.
              </p>
              <p className="mt-4 text-xs text-slate-400">
                Havola <strong>60 daqiqa</strong> davomida amal qiladi.
              </p>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-white mb-1.5">Parolni tiklash</h2>
              <p className="text-sm text-slate-300/80 mb-6">
                Email manzilingizni kiriting, sizga tiklash havolasi yuboriladi.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <label htmlFor="email" className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                    Email manzil
                  </label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@tashmedunitf.uz"
                      required
                      autoFocus
                      className="login-input w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-cyan-400/50 focus:bg-white/[0.08] focus:ring-4 focus:ring-cyan-500/10"
                    />
                  </div>
                </div>

                {error && (
                  <div className="rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-300">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-linear-to-r from-teal-500 via-cyan-500 to-blue-600 hover:from-teal-400 hover:via-cyan-400 hover:to-blue-500 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/30 hover:-translate-y-0.5"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Yuborilmoqda...
                    </>
                  ) : (
                    <>
                      Tiklash havolasini yuborish
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
