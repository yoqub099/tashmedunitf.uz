"use client";

import { useLanguageStore } from "@/store/useLanguageStore";
import { LANGUAGES } from "@/lib/constants";
import { stripLocale } from "@/lib/locale";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface Props {
  variant?: "light" | "dark";
}

export default function LanguageSwitcher({ variant = "light" }: Props) {
  const { language, setLanguage } = useLanguageStore();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentLang = LANGUAGES.find((l) => l.code === language);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={variant === "light" ? { textShadow: "0 0 4px rgba(255,255,255,0.4)" } : undefined}
        className={cn(
          "flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
          variant === "light"
            ? "text-white hover:bg-white/10"
            : "text-gray-700 hover:bg-gray-100"
        )}
      >
        {currentLang?.label}
        <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 rounded-xl bg-white p-1 shadow-lg border border-gray-100 min-w-25">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                const newLocale = lang.code as "uz" | "ru" | "en";
                const stripped = stripLocale(pathname);
                const query = searchParams.toString();
                const newPath = `/${newLocale}${stripped === "/" ? "" : stripped}${query ? `?${query}` : ""}`;
                setLanguage(newLocale);
                setIsOpen(false);
                router.push(newPath);
              }}
              className={cn(
                "block w-full rounded-lg px-4 py-2 text-left text-sm transition-colors",
                language === lang.code
                  ? "bg-blue-50 text-blue-700 font-medium"
                  : "text-gray-700 hover:bg-gray-50"
              )}
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
