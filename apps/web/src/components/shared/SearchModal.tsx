"use client";

import { cn } from "@/lib/utils";
import { Search, X, FileText, Newspaper, Building, GraduationCap } from "lucide-react";
import { useUIStore } from "@/store/useUIStore";
import { useDebounce } from "@/hooks/useDebounce";
import { useState, useEffect, useRef } from "react";
import { search } from "@/lib/services";
import { SearchResult } from "@/types";
import { t } from "@/lib/translate";
import { s } from "@/lib/i18n";
import { useLanguageStore } from "@/store/useLanguageStore";
import Link from "@/components/shared/LocaleLink";

const typeIcons: Record<string, React.ElementType> = {
  news: Newspaper,
  department: Building,
  direction: GraduationCap,
  page: FileText,
};

export default function SearchModal() {
  const { language } = useLanguageStore();
  const { isSearchModalOpen, closeSearchModal } = useUIStore();
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const inputRef = useRef<HTMLInputElement>(null);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (isSearchModalOpen) {
      inputRef.current?.focus();
    } else {
      setQuery("");
      setResults([]);
      setSearched(false);
    }
  }, [isSearchModalOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSearchModal();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [closeSearchModal]);

  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) {
      setResults([]);
      setSearched(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    search(debouncedQuery)
      .then((res) => {
        if (!cancelled) {
          setResults(res.data || []);
          setSearched(true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setResults([]);
          setSearched(true);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  if (!isSearchModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-16">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={closeSearchModal}
      />
      <div className="relative z-10 w-full max-w-2xl rounded-2xl bg-white p-4 sm:p-6 shadow-2xl mx-4">
        <div className="flex items-center gap-3 border-b border-gray-200 pb-3 sm:pb-4">
          <Search className="h-5 w-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder={s("search.placeholder", language)}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 text-base sm:text-lg outline-none placeholder:text-gray-400"
          />
          <button onClick={closeSearchModal} className="rounded-lg p-1 hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-4 min-h-40 max-h-[70vh] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-700 border-t-transparent" />
            </div>
          ) : searched && results.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              &quot;{debouncedQuery}&quot; {s("search.no_results", language)}
            </p>
          ) : results.length > 0 ? (
            <div className="space-y-2">
              {results.map((item) => {
                const Icon = typeIcons[item.type] || FileText;
                const typeLabels: Record<string, string> = {
                  news: s("search.news", language),
                  department: s("search.department", language),
                  direction: s("search.direction", language),
                  page: s("search.page", language),
                };
                const label = typeLabels[item.type] || item.type;
                const title = typeof item.title === "string" ? item.title : t(item.title, language);

                return (
                  <Link
                    key={`${item.type}-${item.id}`}
                    href={item.url}
                    onClick={closeSearchModal}
                    className="flex items-center gap-3 rounded-xl p-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                      <Icon className="h-5 w-5 text-blue-700" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{title}</p>
                      <p className="text-xs text-gray-500">{label}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-gray-400 py-8">
              {s("search.enter_keyword", language)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
