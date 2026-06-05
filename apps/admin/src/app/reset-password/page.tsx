"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Lock, Eye, EyeOff, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import axios from "axios";
import { siteConfig } from "@/config/site";

function Fallback() {
  return (
    <main className="relative w-full min-h-svh bg-[#030815] text-white flex items-center justify-center">
      <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<Fallback />}>
      <ResetForm />
    </Suspense>
  );
}

function ResetForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== passwordConfirm) {
      setError("Parollar mos kelmadi");
      return;
    }
    if (password.length < 8) {
      setError("Parol kamida 8 belgi bo'lishi kerak");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${siteConfig.apiUrl}/auth/reset-password`, {
        email,
        token,
        password,
        password_confirmation: passwordConfirm,
      });
      setSuccess(true);
      setTimeout(() => router.replace("/login"), 2500);
    } catch (err) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.message || "Xatolik yuz berdi"
        : "Xatolik yuz berdi";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!email || !token) {
    return (
      <main className="relative w-full min-h-svh bg-[#030815] text-white flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Yaroqsiz havola</h2>
          <p className="text-sm text-slate-300/90 mb-6">
            Havola to&apos;liq emas yoki muddati tugagan. Iltimos, qaytadan so&apos;rov yuboring.
          </p>
          <Link
            href="/forgot-password"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-white font-semibold rounded-xl transition-colors"
          >
            Qaytadan so&apos;rash
          </Link>
        </div>
      </main>
    );
  }

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
          {success ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Parol yangilandi!</h2>
              <p className="text-sm text-slate-300/90">
                Endi yangi parol bilan kirishingiz mumkin. Login sahifasiga yo&apos;naltirilyapsiz...
              </p>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-white mb-1.5">Yangi parol o&apos;rnatish</h2>
              <p className="text-sm text-slate-300/80 mb-6">
                <span className="text-cyan-300">{email}</span> uchun yangi parol tanlang.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <label htmlFor="password" className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                    Yangi parol
                  </label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Kamida 8 belgi"
                      required
                      minLength={8}
                      autoFocus
                      className="login-input w-full pl-11 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-cyan-400/50 focus:ring-4 focus:ring-cyan-500/10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      tabIndex={-1}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-cyan-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="passwordConfirm" className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                    Parolni tasdiqlang
                  </label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="passwordConfirm"
                      type={showPassword ? "text" : "password"}
                      value={passwordConfirm}
                      onChange={(e) => setPasswordConfirm(e.target.value)}
                      placeholder="Parolni takrorlang"
                      required
                      minLength={8}
                      className="login-input w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-cyan-400/50 focus:ring-4 focus:ring-cyan-500/10"
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex items-start gap-2 rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-300">
                    <AlertCircle className="w-4 h-4 flex-none mt-0.5" />
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !password || !passwordConfirm}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-linear-to-r from-teal-500 via-cyan-500 to-blue-600 hover:from-teal-400 hover:via-cyan-400 hover:to-blue-500 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/30 hover:-translate-y-0.5"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Yangilanyapti...
                    </>
                  ) : (
                    "Parolni yangilash"
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
