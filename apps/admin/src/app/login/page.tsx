"use client";

import { Suspense, useCallback, useEffect, useId, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Eye,
  EyeOff,
  Globe,
  GraduationCap,
  HeartPulse,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Users,
} from "lucide-react";
import { useLogin } from "@/hooks/useAuth";

const REMEMBER_EMAIL_KEY = "tmtu:admin:remembered_email";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const BRAND_FEATURES = [
  { icon: Stethoscope, text: "Tibbiyot ta'limining raqamli platformasi" },
  { icon: BookOpen, text: "4 fakultet · 21 kafedra · 40+ yo'nalish" },
  { icon: Users, text: "Talabalar, xodimlar va arizalar bazasi" },
  { icon: HeartPulse, text: "Real vaqtli boshqaruv va monitoring" },
] as const;

const BRAND_STATS = [
  { value: "4", label: "Fakultet" },
  { value: "21", label: "Kafedra" },
  { value: "3 til", label: "UZ · RU · EN" },
] as const;

function LoginFallback() {
  return (
    <main className="relative w-full min-h-svh bg-[#030815] text-white flex items-center justify-center">
      <div className="flex items-center gap-3 text-slate-400 text-sm">
        <Loader2 className="w-4 h-4 animate-spin" aria-hidden />
        <span>Yuklanmoqda...</span>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginFormInner />
    </Suspense>
  );
}

function LoginFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const loginMutation = useLogin();

  const emailId = useId();
  const passwordId = useId();
  const rememberId = useId();
  const errorId = useId();

  const emailInputRef = useRef<HTMLInputElement>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [capsLockOn, setCapsLockOn] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  useEffect(() => {
    try {
      const remembered = localStorage.getItem(REMEMBER_EMAIL_KEY);
      if (remembered) {
        setEmail(remembered);
        setRememberMe(true);
      }
    } catch {
      // localStorage unavailable (private mode, quota) — silently skip
    }
    emailInputRef.current?.focus();
  }, []);

  const validateEmail = useCallback((value: string): string | null => {
    const trimmed = value.trim();
    if (!trimmed) return "Email kiritilishi shart";
    if (!EMAIL_PATTERN.test(trimmed)) return "Email formati noto'g'ri";
    return null;
  }, []);

  const handleCapsLock = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (typeof e.getModifierState === "function") {
      setCapsLockOn(e.getModifierState("CapsLock"));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateEmail(email);
    if (validationError) {
      setEmailError(validationError);
      emailInputRef.current?.focus();
      return;
    }
    setEmailError(null);

    try {
      if (rememberMe) {
        localStorage.setItem(REMEMBER_EMAIL_KEY, email.trim());
      } else {
        localStorage.removeItem(REMEMBER_EMAIL_KEY);
      }
    } catch {
      // localStorage unavailable — continue without persisting
    }

    loginMutation.mutate(
      { email: email.trim(), password },
      {
        onSuccess: () => {
          const raw = searchParams.get("redirect");
          const target =
            raw && raw.startsWith("/") && !raw.startsWith("//") ? raw : "/dashboard";
          router.replace(target);
        },
      }
    );
  };

  const isPending = loginMutation.isPending;
  const isSubmitDisabled = isPending || !email || !password;

  return (
    <main className="relative w-full min-h-svh bg-[#030815] text-white flex flex-col lg:flex-row lg:items-stretch overflow-hidden">
      <a
        href="#login-form"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-cyan-500 focus:text-white focus:rounded-lg focus:shadow-lg"
      >
        Login formasiga o&apos;tish
      </a>

      {/* ═══════════════════════════════════════════
          LEFT — Brand panel (desktop only, ≥ lg)
          ═══════════════════════════════════════════ */}
      <aside
        className="relative hidden lg:flex lg:w-1/2 xl:w-[54%] min-h-svh overflow-hidden"
        aria-label="Universitet haqida ma'lumot"
      >
        <div className="absolute inset-0 bg-linear-to-br from-[#03322e] via-[#0a1f3d] to-[#042338]" />
        <div className="login-blob bg-teal-500 w-[520px] h-[520px] -top-40 -left-32" />
        <div className="login-blob delay-2 bg-cyan-500 w-[480px] h-[480px] top-1/2 -right-40" />
        <div className="login-blob delay-4 bg-emerald-600 w-[420px] h-[420px] -bottom-32 left-1/4" />
        <div className="absolute inset-0 login-grid-pattern" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,transparent_0%,rgba(3,8,21,0.55)_75%)]" />

        <div className="relative z-10 m-auto w-full max-w-xl px-10 xl:px-14 py-8">
          <div className="flex items-center gap-3 login-stagger" style={{ animationDelay: "0.05s" }}>
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl login-logo-glow" aria-hidden />
              <div className="relative w-14 h-14 rounded-2xl bg-linear-to-br from-teal-300 via-cyan-500 to-emerald-700 flex items-center justify-center shadow-xl">
                <HeartPulse className="w-7 h-7 text-white" strokeWidth={2.4} aria-hidden />
              </div>
            </div>
            <div>
              <p className="text-[11px] font-semibold tracking-[0.18em] text-cyan-300/80 uppercase">
                TMTU Termiz Filiali
              </p>
              <p className="text-sm font-bold text-white mt-0.5">
                Admin boshqaruv tizimi
              </p>
            </div>
          </div>

          <div
            className="mt-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm login-stagger"
            style={{ animationDelay: "0.15s" }}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" aria-hidden />
            <span className="text-xs font-semibold text-cyan-100 tracking-wide">
              RASMIY ADMIN PANEL
            </span>
          </div>

          <h1
            className="mt-4 text-[clamp(1.75rem,2.6vw,2.75rem)] font-bold leading-[1.1] tracking-tight login-stagger"
            style={{ animationDelay: "0.22s" }}
          >
            Toshkent Davlat{" "}
            <span className="bg-linear-to-r from-teal-300 via-cyan-300 to-emerald-300 bg-clip-text text-transparent">
              Tibbiyot Universiteti
            </span>{" "}
            Termiz Filiali
          </h1>
          <p
            className="mt-3 text-sm text-slate-300/90 leading-relaxed login-stagger"
            style={{ animationDelay: "0.3s" }}
          >
            Universitetning barcha ma&apos;lumotlarini bitta zamonaviy boshqaruv paneli orqali nazorat qiling.
          </p>

          <ul className="mt-6 space-y-2" aria-label="Platforma xususiyatlari">
            {BRAND_FEATURES.map((f, i) => (
              <li
                key={f.text}
                className="flex items-center gap-3 group login-stagger"
                style={{ animationDelay: `${0.4 + i * 0.08}s` }}
              >
                <div className="flex-none w-9 h-9 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-cyan-500/15 group-hover:border-cyan-400/30 transition-colors">
                  <f.icon className="w-4 h-4 text-cyan-300" strokeWidth={2.2} aria-hidden />
                </div>
                <span className="text-sm text-slate-200/90 font-medium">{f.text}</span>
              </li>
            ))}
          </ul>

          <div
            className="mt-6 pt-5 grid grid-cols-3 gap-4 border-t border-white/10 login-stagger"
            style={{ animationDelay: "0.8s" }}
          >
            {BRAND_STATS.map((s) => (
              <div key={s.label} className="flex flex-col">
                <span className="text-2xl xl:text-3xl font-bold text-white tabular-nums leading-tight">
                  {s.value}
                </span>
                <span className="text-[11px] text-slate-400 mt-1">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* ═══════════════════════════════════════════
          RIGHT — Login form
          ═══════════════════════════════════════════ */}
      <section
        className="relative flex-1 flex min-h-svh overflow-hidden"
        aria-label="Tizimga kirish formasi"
      >
        <div className="absolute inset-0 lg:hidden bg-linear-to-br from-[#030815] via-[#0a1f3d] to-[#03322e]" />
        <div className="absolute inset-0 lg:hidden login-grid-pattern opacity-60" />
        <div className="login-blob lg:hidden bg-teal-500 w-[300px] h-[300px] -top-20 -right-20" />
        <div className="login-blob delay-2 lg:hidden bg-cyan-500 w-[280px] h-[280px] -bottom-20 -left-20" />
        <div className="hidden lg:block absolute inset-0 bg-linear-to-br from-[#050d1f] to-[#061a22]" />

        <div className="relative z-10 m-auto w-full max-w-md xl:max-w-lg px-5 sm:px-8 py-10 sm:py-12 login-card-enter">
          <div className="lg:hidden flex flex-col items-center text-center mb-8">
            <div className="relative inline-flex">
              <div className="absolute inset-0 rounded-3xl login-logo-glow" aria-hidden />
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-linear-to-br from-teal-300 via-cyan-500 to-emerald-700 flex items-center justify-center shadow-2xl">
                <HeartPulse
                  className="w-8 h-8 sm:w-10 sm:h-10 text-white"
                  strokeWidth={2.2}
                  aria-hidden
                />
              </div>
            </div>
            <p className="mt-4 text-[11px] font-semibold tracking-[0.18em] text-cyan-300/80 uppercase">
              TMTU Termiz Filiali
            </p>
            <h1 className="mt-1 text-lg sm:text-xl font-bold text-white tracking-tight max-w-xs">
              Toshkent Davlat Tibbiyot Universiteti
            </h1>
            <p className="text-xs text-slate-400 mt-1">Admin boshqaruv paneli</p>
          </div>

          <div className="relative">
            <form
              id="login-form"
              onSubmit={handleSubmit}
              noValidate
              className="relative bg-white/[0.05] backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-9"
            >
              <div className="mb-6 sm:mb-7">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/20">
                  <GraduationCap className="w-3 h-3 text-cyan-300" aria-hidden />
                  <span className="text-[10px] font-bold text-cyan-200 tracking-wider uppercase">
                    Kirish
                  </span>
                </div>
                <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-white">
                  Xush kelibsiz
                </h2>
                <p className="text-sm text-slate-300/80 mt-1.5">
                  Ma&apos;lumotlaringizni kiriting va boshqaruv paneliga o&apos;ting
                </p>
              </div>

              <div className="space-y-4 sm:space-y-5">
                {/* Email field */}
                <div className="space-y-1.5">
                  <label
                    htmlFor={emailId}
                    className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider"
                  >
                    Email manzil
                  </label>
                  <div
                    className={`relative transition-transform duration-200 ${
                      emailFocus ? "scale-[1.01]" : ""
                    }`}
                  >
                    <Mail
                      className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                        emailFocus ? "text-cyan-400" : "text-slate-400"
                      }`}
                      aria-hidden
                    />
                    <input
                      ref={emailInputRef}
                      id={emailId}
                      name="email"
                      type="email"
                      inputMode="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (emailError) setEmailError(null);
                      }}
                      onBlur={() => {
                        setEmailFocus(false);
                        if (email) {
                          const err = validateEmail(email);
                          setEmailError(err);
                        }
                      }}
                      onFocus={() => setEmailFocus(true)}
                      placeholder="admin@tashmedunitf.uz"
                      required
                      autoComplete="email"
                      autoCapitalize="none"
                      spellCheck={false}
                      aria-invalid={!!emailError}
                      aria-describedby={emailError ? `${emailId}-error` : undefined}
                      disabled={isPending}
                      className={`login-input w-full pl-11 pr-4 py-3 bg-white/5 border rounded-xl text-sm text-white placeholder-slate-500 outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed ${
                        emailError
                          ? "border-red-400/50 focus:border-red-400 focus:ring-4 focus:ring-red-500/10"
                          : "border-white/10 focus:border-cyan-400/50 focus:bg-white/[0.08] focus:ring-4 focus:ring-cyan-500/10 hover:bg-white/[0.07]"
                      }`}
                    />
                  </div>
                  {emailError && (
                    <p
                      id={`${emailId}-error`}
                      className="flex items-center gap-1.5 text-xs text-red-300"
                      role="alert"
                    >
                      <AlertCircle className="w-3.5 h-3.5 flex-none" aria-hidden />
                      {emailError}
                    </p>
                  )}
                </div>

                {/* Password field */}
                <div className="space-y-1.5">
                  <label
                    htmlFor={passwordId}
                    className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider"
                  >
                    Parol
                  </label>
                  <div
                    className={`relative transition-transform duration-200 ${
                      passwordFocus ? "scale-[1.01]" : ""
                    }`}
                  >
                    <Lock
                      className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                        passwordFocus ? "text-cyan-400" : "text-slate-400"
                      }`}
                      aria-hidden
                    />
                    <input
                      id={passwordId}
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setPasswordFocus(true)}
                      onBlur={() => {
                        setPasswordFocus(false);
                        setCapsLockOn(false);
                      }}
                      onKeyDown={handleCapsLock}
                      onKeyUp={handleCapsLock}
                      placeholder="••••••••"
                      required
                      autoComplete="current-password"
                      minLength={1}
                      disabled={isPending}
                      className="login-input w-full pl-11 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-cyan-400/50 focus:bg-white/[0.08] focus:ring-4 focus:ring-cyan-500/10 hover:bg-white/[0.07] disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      tabIndex={-1}
                      disabled={isPending}
                      aria-label={
                        showPassword ? "Parolni yashirish" : "Parolni ko'rsatish"
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-white/5 transition-all disabled:opacity-50"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" aria-hidden />
                      ) : (
                        <Eye className="w-4 h-4" aria-hidden />
                      )}
                    </button>
                  </div>
                  {capsLockOn && (
                    <p
                      className="flex items-center gap-1.5 text-xs text-amber-300"
                      role="alert"
                    >
                      <AlertCircle className="w-3.5 h-3.5 flex-none" aria-hidden />
                      Caps Lock yoqilgan
                    </p>
                  )}
                </div>

                {/* Remember + Forgot password */}
                <div className="flex items-center justify-between gap-3 flex-wrap pt-1">
                  <label
                    htmlFor={rememberId}
                    className="flex items-center gap-2 cursor-pointer select-none group"
                  >
                    <span className="relative flex items-center justify-center">
                      <input
                        id={rememberId}
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        disabled={isPending}
                        className="peer appearance-none w-4 h-4 rounded border border-white/20 bg-white/5 checked:bg-cyan-500 checked:border-cyan-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#061a22] cursor-pointer transition-colors disabled:opacity-50"
                      />
                      <CheckCircle2 className="pointer-events-none absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                    </span>
                    <span className="text-xs text-slate-300 group-hover:text-white transition-colors">
                      Meni eslab qol
                    </span>
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs font-medium text-cyan-300 hover:text-cyan-200 transition-colors"
                  >
                    Parolni unutdingizmi?
                  </Link>
                </div>

                {/* Server error (live region) */}
                <div aria-live="polite" aria-atomic="true">
                  {loginMutation.isError && (
                    <div
                      id={errorId}
                      role="alert"
                      className="flex items-start gap-2.5 rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-200"
                    >
                      <AlertCircle
                        className="w-4 h-4 flex-none mt-0.5 text-red-400"
                        aria-hidden
                      />
                      <div>
                        <p className="font-semibold">Kirish amalga oshmadi</p>
                        <p className="text-xs text-red-300/90 mt-0.5">
                          Email yoki parol noto&apos;g&apos;ri. Ma&apos;lumotlarni tekshirib qayta urinib ko&apos;ring.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitDisabled}
                  aria-busy={isPending}
                  className="group relative w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-linear-to-r from-teal-500 via-cyan-500 to-blue-600 hover:from-teal-400 hover:via-cyan-400 hover:to-blue-500 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/40 hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus-visible:ring-4 focus-visible:ring-cyan-500/40 overflow-hidden"
                >
                  <span
                    className="absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                    aria-hidden
                  />
                  {isPending ? (
                    <>
                      <Loader2 className="relative w-4 h-4 animate-spin" aria-hidden />
                      <span className="relative">Tekshirilmoqda...</span>
                    </>
                  ) : (
                    <>
                      <span className="relative">Tizimga kirish</span>
                      <ArrowRight
                        className="relative w-4 h-4 transition-transform group-hover:translate-x-1"
                        aria-hidden
                      />
                    </>
                  )}
                </button>
              </div>

              {/* Secure badge */}
              <div className="mt-6 pt-5 border-t border-white/5 flex items-center justify-center gap-2 text-xs text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" aria-hidden />
                <span>Himoyalangan ulanish · SSL shifrlangan</span>
              </div>
            </form>
          </div>

          {/* Footer */}
          <footer className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
            <p className="text-center sm:text-left">
              &copy; {new Date().getFullYear()} TMTU Termiz Filiali
            </p>
            <div className="flex items-center gap-1.5">
              <Globe className="w-3 h-3" aria-hidden />
              <span>O&apos;zbekiston · Termiz</span>
            </div>
          </footer>
        </div>
      </section>
    </main>
  );
}
