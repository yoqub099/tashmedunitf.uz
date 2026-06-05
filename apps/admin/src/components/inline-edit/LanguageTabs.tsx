"use client";

import { cn } from "@/lib/utils";
import { LANGUAGES } from "@/lib/constants";
import type { Language, LanguageTabsProps } from "@/types/inline-edit";

export default function LanguageTabs({
  activeLanguage,
  onLanguageChange,
}: LanguageTabsProps) {
  return (
    <div className="flex items-center border-b border-gray-200 mb-4">
      {LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          type="button"
          onClick={() => onLanguageChange(lang.code as Language)}
          className={cn(
            "flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px",
            activeLanguage === lang.code
              ? "border-blue-700 text-blue-700"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          )}
        >
          <span>{lang.flag}</span>
          <span>{lang.label}</span>
          {lang.code === "uz" && (
            <span className="text-[10px] bg-red-100 text-red-600 px-1 rounded font-medium">
              *
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
