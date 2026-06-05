import { create } from "zustand";
import Cookies from "js-cookie";

type Language = "uz" | "ru" | "en";

interface LanguageState {
  language: Language;
  hydrated: boolean;
  setLanguage: (lang: Language) => void;
  /** Sync store from current URL pathname (call on route changes). */
  syncFromPathname: (pathname: string) => void;
}

export const useLanguageStore = create<LanguageState>()((set, get) => ({
  // Always start with "uz" for SSR consistency (prevents hydration mismatch)
  language: "uz",
  hydrated: false,
  setLanguage: (language) => {
    Cookies.set("lang", language, { path: "/", sameSite: "lax", expires: 365 });
    set({ language });
  },
  syncFromPathname: (pathname: string) => {
    const match = pathname.match(/^\/(uz|ru|en)(\/|$)/);
    const locale = (match?.[1] as Language) || "uz";
    if (locale !== get().language || !get().hydrated) {
      Cookies.set("lang", locale, { path: "/", sameSite: "lax", expires: 365 });
      set({ language: locale, hydrated: true });
    }
  },
}));
